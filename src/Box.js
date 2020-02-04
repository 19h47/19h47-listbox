import {
	ARROWDOWN,
	END,
	HOME,
	ARROWUP,
} from '@19h47/keycode';

import { addClass, removeClass } from '@/utils';

export default class Box {
	constructor(element) {
		this.rootElement = element;

		// Bind.
		this.onFocus = this.onFocus.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onClick = this.onClick.bind(this);
	}

	init() {
		// console.info('Box.init');

		this.activeDescendant = this.rootElement.getAttribute('aria-activedescendant');
		this.items = [...this.rootElement.querySelectorAll('[role="option"]')];

		this.handleFocusChange = null;
		this.keysSoFar = '';

		this.initEvents();
	}

	initEvents() {
		this.rootElement.addEventListener('focus', this.onFocus);
		this.rootElement.addEventListener('keydown', this.onKeyDown);
		this.rootElement.addEventListener('click', this.onClick);
	}

	onClick(event) {
		// console.info('Box.onClick');

		const { target } = event;

		if ('option' === target.getAttribute('role')) {
			this.focusItem(target);
		}
	}

	onFocus() {
		if (this.activeDescendant) {
			return false;
		}

		return this.focusItem(this.items[0]);
	}


	/**
	 * Handle various keyboard controls
	 *
	 * @param event The keydown event object
	 */
	onKeyDown(event) {
		const key = event.keyCode || event.which;
		const $next = this.rootElement.querySelector(`#${this.activeDescendant}`);

		if (!$next) {
			return false;
		}

		const focus = element => {
			event.preventDefault();
			this.focusItem(element);
		};

		const codes = {
			[HOME]: () => focus(this.items[0]),
			[END]: () => focus(this.items[this.items.length - 1]),
			[ARROWUP]: () => $next.previousElementSibling ? focus($next.previousElementSibling) : false, // eslint-disable-line no-confusing-arrow, max-len
			[ARROWDOWN]: () => $next.nextElementSibling ? focus($next.nextElementSibling) : false, // eslint-disable-line no-confusing-arrow, max-len
			default: () => {
				const itemToFocus = this.findItemToFocus(key);

				return itemToFocus ? this.focusItem(itemToFocus) : false;
			},
		};

		return (codes[key] || codes.default)();
	}

	focusItem(element) {
		// console.info('Box.focusItem');

		const $active = this.rootElement.querySelector(`#${this.activeDescendant}`);

		if ($active) {
			removeClass($active, 'focused');
		}

		addClass(element, 'focused');

		this.rootElement.setAttribute('aria-activedescendant', element.id);
		this.activeDescendant = element.id;

		// @TODO check if it's working
		if (this.rootElement.scrollHeight > this.rootElement.clientHeight) {
			const scrollBottom = this.rootElement.clientHeight + this.rootElement.scrollTop;
			const elementBottom = element.offsetTop + element.offsetHeight;

			if (elementBottom > scrollBottom) {
				this.rootElement.scrollTop = elementBottom - this.rootElement.clientHeight;
			} else if (element.offsetTop < this.rootElement.scrollTop) {
				this.rootElement.scrollTop = element.offsetTop;
			}
		}

		this.handleFocusChange(element);
	}

	setHandleFocusChange(focusChangeHandler) {
		this.handleFocusChange = focusChangeHandler;
	}

	findItemToFocus(key) {
		const character = String.fromCharCode(key);

		if (!this.keysSoFar) {
			for (let i = 0; i < this.items.length; i += 1) {
				if (this.items[i].getAttribute('id') === this.activeDescendant) {
					this.searchIndex = i;
				}
			}
		}

		this.keysSoFar += character;
		this.clearKeysSoFarAfterDelay();

		let nextMatch = this.findMatchInRange(
			this.items,
			this.searchIndex + 1,
			this.items.length,
		);

		if (!nextMatch) {
			nextMatch = this.findMatchInRange(
				this.items,
				0,
				this.searchIndex,
			);
		}

		return nextMatch;
	}

	clearKeysSoFarAfterDelay() {
		if (this.keyClear) {
			clearTimeout(this.keyClear);
			this.keyClear = null;
		}
		this.keyClear = setTimeout(() => {
			this.keysSoFar = '';
			this.keyClear = null;
		}, 500);
	}

	findMatchInRange(list, startIndex, endIndex) {
		// console.log({ list, startIndex, endIndex });

		// Find the first item starting with the keysSoFar substring, searching in
		// the specified range of items
		for (let i = startIndex; i < endIndex; i += 1) {
			const label = list[i].innerText;

			if (label && 0 === label.toUpperCase().indexOf(this.keysSoFar)) {
				return list[i];
			}
		}
		return null;
	}

	setHandleItemChange(handlerFn) {
		this.handleItemChange = handlerFn;
	}
}
