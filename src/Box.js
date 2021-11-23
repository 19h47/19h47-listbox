import { ARROW_UP, ARROW_DOWN, HOME, END, PAGE_UP, PAGE_DOWN } from '@19h47/keycode';

import { EventEmitter } from 'events';
import { addClass, removeClass } from '@/utils';

export default class Box extends EventEmitter {
	constructor(element, selectOnFocus = true) {
		super();

		this.rootElement = element;

		this.keys = '';
		this.active = false;
		this.selectOnFocus = selectOnFocus;

		// Bind.
		this.onFocus = this.onFocus.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	init() {
		// console.info('Box.init');

		this.activeDescendant = this.rootElement.getAttribute('aria-activedescendant');
		this.options = [...this.rootElement.querySelectorAll('[role="option"]')];

		this.initEvents();
	}

	initEvents() {
		this.rootElement.addEventListener('focus', this.onFocus);

		this.rootElement.addEventListener('keydown', this.onKeydown);
		this.rootElement.addEventListener('click', this.onClick);
		this.rootElement.addEventListener('blur', () => this.emit('Box.blur'));
	}

	onClick(event) {
		// console.info('Box.onClick');

		const { target } = event;

		if ('option' === target.getAttribute('role')) {
			this.focusOption(target);
			this.emit('Box.click', target);
		}
	}

	onFocus() {
		// console.info('Box.onFocus');

		if (this.activeDescendant) {
			return false;
		}

		return this.focusOption(this.options[0]);
	}

	/**
	 * Handle various keyboard controls
	 *
	 * @param event The event object
	 */
	onKeydown(event) {
		this.emit('Box.keydown', event);

		const key = event.keyCode || event.which;
		const $active = this.rootElement.querySelector(`#${this.activeDescendant}`);

		this.active = this.options.indexOf($active);

		if (!$active) {
			return false;
		}

		const focus = element => {
			event.preventDefault();
			this.focusOption(element);
		};

		const codes = {
			[HOME]: () => focus(this.options[0]),
			[END]: () => focus(this.options[this.options.length - 1]),
			[ARROW_UP]: () =>
				$active.previousElementSibling ? focus($active.previousElementSibling) : false,
			[ARROW_DOWN]: () =>
				$active.nextElementSibling ? focus($active.nextElementSibling) : false,
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

	focusOption(option) {
		// console.info('Box.focusOption');

		const $active = this.rootElement.querySelector(`#${this.activeDescendant}`);

		if ($active) {
			removeClass($active, 'is-active');
			$active.removeAttribute('aria-selected');
		}

		addClass(option, 'is-active');
		option.setAttribute('aria-selected', true);

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

	find(key) {
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
	 * Clear
	 *
	 * @param {int} delay
	 */
	clear(delay = 500) {
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

	findMatchInRange(list, startIndex, endIndex) {
		// console.log({ list, startIndex, endIndex });

		// Find the first item starting with the Keys substring, searching in
		// the specified range of items
		for (let i = startIndex; i < endIndex; i += 1) {
			const label = list[i].innerText;

			if (label && 0 === label.toUpperCase().indexOf(this.keys)) {
				return list[i];
			}
		}
		return null;
	}
}
