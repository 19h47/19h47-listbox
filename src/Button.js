import {
	DOWN,
	ENTER,
	UP,
	ESCAPE,
} from '@19h47/keycode';

import { addClass, removeClass } from '@/utils';

export default class Button {
	constructor(element, listbox) {
		this.rootElement = element;
		this.box = listbox;

		// Bind.
		this.show = this.show.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.hide = this.hide.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
	}

	init() {
		this.$label = this.rootElement.querySelector('.js-list-label');

		this.initEvents();
	}

	initEvents() {
		this.rootElement.addEventListener('click', this.show);
		this.rootElement.addEventListener('keyup', this.onKeyUp);
		this.box.rootElement.addEventListener('blur', this.hide);
		this.box.rootElement.addEventListener('keydown', this.onKeyDown);
		this.box.setHandleFocusChange(this.onFocusChange);
	}

	onKeyUp(event) {
		// console.log('Button.onKeyUp');

		const key = event.keyCode || event.which;

		const show = () => {
			event.preventDefault();
			this.show();
			this.box.checkKeyPress(event);
		};

		const codes = {
			[UP]: show,
			[DOWN]: show,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	onKeyDown(event) {
		// console.log('Button.onKeyDown');

		const key = event.keyCode || event.which;

		const hide = () => {
			event.preventDefault();
			this.hide();
			this.rootElement.focus();
		};

		const codes = {
			[ENTER]: hide,
			[ESCAPE]: hide,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	show() {
		// console.info('Button.show');

		addClass(this.box.rootElement, 'is-active');

		this.rootElement.setAttribute('aria-expanded', true);
		this.box.rootElement.focus();
	}

	hide() {
		// console.info('Button.hide');

		removeClass(this.box.rootElement, 'is-active');

		this.rootElement.removeAttribute('aria-expanded');
	}

	onFocusChange(item) {
		this.$label.innerText = item.innerText;

		const changeEvent = new CustomEvent('Button.change', { detail: { item } });

		this.rootElement.dispatchEvent(changeEvent);
	}
}
