import { ARROW_UP, ARROW_DOWN, HOME, END } from '@19h47/keycode';

import { addClass, removeClass } from '@/utils';

export default class Box {
	constructor(element) {
		this.rootElement = element;

		this.handleFocusChange = null;
		this.Keys = '';

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
	}

	onClick(event) {
		// console.info('Box.onClick');

		const { target } = event;

		if ('option' === target.getAttribute('role')) {
			this.focusOption(target);
		}
	}

	onFocus() {
		// console.log('Box.onFocus');

		if (this.activeDescendant) {
			return false;
		}

		return this.focusOption(this.options[0]);
	}

	/**
	 * Handle various keyboard controls
	 *
	 * @param event The keydown event object
	 */
	onKeydown(event) {
		const key = event.keyCode || event.which;
		const $next = this.rootElement.querySelector(`#${this.activeDescendant}`);

		if (!$next) {
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
				$next.previousElementSibling ? focus($next.previousElementSibling) : false, // eslint-disable-line no-confusing-arrow, max-len
			[ARROW_DOWN]: () =>
				$next.nextElementSibling ? focus($next.nextElementSibling) : false, // eslint-disable-line no-confusing-arrow, max-len
			default: () => {
				const itemToFocus = this.findOptionToFocus(key);

				return itemToFocus ? this.focusOption(itemToFocus) : false;
			},
		};

		return (codes[key] || codes.default)();
	}

	focusOption(option) {
		// console.info('Box.focusOption', element);

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

		this.handleFocusChange(option);
	}

	findOptionToFocus(key) {
		const character = String.fromCharCode(key);

		if (!this.Keys) {
			for (let i = 0; i < this.options.length; i += 1) {
				if (this.options[i].getAttribute('id') === this.activeDescendant) {
					this.searchIndex = i;
				}
			}
		}

		this.Keys += character;
		this.clearKeysAfterDelay();

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

	clearKeysAfterDelay() {
		if (this.keyClear) {
			clearTimeout(this.keyClear);
			this.keyClear = null;
		}
		this.keyClear = setTimeout(() => {
			this.Keys = '';
			this.keyClear = null;
		}, 500);
	}

	findMatchInRange(list, startIndex, endIndex) {
		// console.log({ list, startIndex, endIndex });

		// Find the first item starting with the Keys substring, searching in
		// the specified range of items
		for (let i = startIndex; i < endIndex; i += 1) {
			const label = list[i].innerText;

			if (label && 0 === label.toUpperCase().indexOf(this.Keys)) {
				return list[i];
			}
		}
		return null;
	}

	setHandleFocusChange(focusChangeHandler) {
		// console.log('Box.setHandleFocusChange');

		this.handleFocusChange = focusChangeHandler;
	}
}
