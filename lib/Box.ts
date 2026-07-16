import { ARROW_UP, ARROW_DOWN, HOME, END, PAGE_UP, PAGE_DOWN } from './keycode';

import EventEmitter from './EventEmitter';
import { addClass, removeClass, toggleAttribute, toggleClass } from './utils';

export default class Box extends EventEmitter {
	rootElement: HTMLElement;

	keys = '';

	active = -1;

	selectOnFocus: boolean;

	blurOnFocus: boolean;

	multiple = false;

	activeDescendant: string | null = null;

	options: HTMLElement[] = [];

	searchIndex = 0;

	keyClear: ReturnType<typeof setTimeout> | null = null;

	constructor(element: HTMLElement, selectOnFocus = true, blurOnFocus = false) {
		super();

		this.rootElement = element;
		this.selectOnFocus = selectOnFocus;
		this.blurOnFocus = blurOnFocus;

		if (this.multiple) {
			this.selectOnFocus = false;
		}

		this.onFocus = this.onFocus.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onClick = this.onClick.bind(this);
		this.blur = this.blur.bind(this);
	}

	init(): void {
		this.activeDescendant = this.rootElement.getAttribute('aria-activedescendant');
		this.options = [...this.rootElement.querySelectorAll<HTMLElement>('[role="option"]')];

		this.initEvents();
	}

	initEvents(): void {
		this.rootElement.addEventListener('focus', this.onFocus);
		this.rootElement.addEventListener('keydown', this.onKeydown);
		this.rootElement.addEventListener('click', this.onClick);
		this.rootElement.addEventListener('blur', this.blur);
	}

	blur(): void {
		this.emit('Box.blur');
	}

	onClick(event: MouseEvent): void {
		const { target } = event;

		if (!(target instanceof HTMLElement)) {
			return;
		}

		if ('option' === target.getAttribute('role')) {
			this.focusOption(target);

			if (!this.multiple) {
				this.emit('Box.click', target);
			}

			if (this.blurOnFocus) {
				this.rootElement.blur();
			}
		}
	}

	onFocus(): false | void {
		if (this.activeDescendant) {
			return false;
		}

		return this.focusOption(this.options[0]);
	}

	/**
	 * Handle various keyboard controls
	 */
	onKeydown(event: KeyboardEvent): false | void {
		this.emit('Box.keydown', event);

		const key = event.keyCode || event.which;
		const $active = this.activeDescendant
			? this.rootElement.querySelector<HTMLElement>(`#${this.activeDescendant}`)
			: null;

		this.active = $active ? this.options.indexOf($active) : -1;

		if (!$active) {
			return false;
		}

		const focus = (element: HTMLElement) => {
			event.preventDefault();
			this.focusOption(element);
		};

		const codes: Record<number | string, () => false | void> = {
			[HOME]: () => focus(this.options[0]),
			[END]: () => focus(this.options[this.options.length - 1]),
			[ARROW_UP]: () =>
				$active.previousElementSibling instanceof HTMLElement
					? focus($active.previousElementSibling)
					: false,
			[ARROW_DOWN]: () =>
				$active.nextElementSibling instanceof HTMLElement
					? focus($active.nextElementSibling)
					: false,
			[PAGE_UP]: () => {
				if (0 < this.active - 5) {
					focus(this.options[this.active - 5]);
				} else {
					focus(this.options[0]);
				}
			},
			[PAGE_DOWN]: () => {
				if (this.options.length - 1 > this.active + 5) {
					focus(this.options[this.active + 5]);
				} else {
					focus(this.options[this.options.length - 1]);
				}
			},
			default: () => {
				const itemToFocus = this.find(key);

				return itemToFocus ? this.focusOption(itemToFocus) : false;
			},
		};

		return (codes[key] || codes.default)();
	}

	focusOption(option: HTMLElement): void {
		if (this.multiple) {
			toggleClass(option, 'is-active');
			toggleAttribute(option, 'aria-selected');
		} else {
			const $active = this.activeDescendant
				? this.rootElement.querySelector<HTMLElement>(`#${this.activeDescendant}`)
				: null;

			if ($active) {
				removeClass($active, 'is-active');
				$active.removeAttribute('aria-selected');
			}

			addClass(option, 'is-active');
			option.setAttribute('aria-selected', 'true');
		}

		this.rootElement.setAttribute('aria-activedescendant', option.id);
		this.activeDescendant = option.id;

		if (this.rootElement.scrollHeight > this.rootElement.clientHeight) {
			const scrollBottom = this.rootElement.clientHeight + this.rootElement.scrollTop;
			const elementBottom = option.offsetTop + option.offsetHeight;

			if (elementBottom > scrollBottom) {
				this.rootElement.scrollTop = elementBottom - this.rootElement.clientHeight;
			} else if (option.offsetTop < this.rootElement.scrollTop) {
				this.rootElement.scrollTop = option.offsetTop;
			}
		}

		if (this.selectOnFocus) {
			this.emit('Box.focus', option);
		}
	}

	find(key: number): HTMLElement | null {
		const character = String.fromCharCode(key);

		if (!this.keys) {
			for (let i = 0; i < this.options.length; i += 1) {
				if (this.options[i].getAttribute('id') === this.activeDescendant) {
					this.searchIndex = i;
				}
			}
		}

		this.keys += character;
		this.emit('Box.keysChange', this.keys);
		this.clear();

		let nextMatch = this.findMatchInRange(
			this.options,
			this.searchIndex + 1,
			this.options.length,
		);

		if (!nextMatch) {
			nextMatch = this.findMatchInRange(this.options, 0, this.searchIndex);
		}

		return nextMatch;
	}

	/**
	 * Clear typed character buffer after delay
	 */
	clear(delay = 500): void {
		if (this.keyClear) {
			clearTimeout(this.keyClear);
			this.keyClear = null;
		}

		this.keyClear = setTimeout(() => {
			this.keys = '';
			this.emit('Box.keysChange', this.keys);
			this.keyClear = null;
		}, delay);
	}

	findMatchInRange(
		list: HTMLElement[],
		startIndex: number,
		endIndex: number,
	): HTMLElement | null {
		for (let i = startIndex; i < endIndex; i += 1) {
			const label = list[i].innerText;

			if (label && 0 === label.toUpperCase().indexOf(this.keys)) {
				return list[i];
			}
		}

		return null;
	}
}
