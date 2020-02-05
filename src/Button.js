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

		this.isOpen = false;

		// Bind.
		this.open = this.open.bind(this);
		this.toggle = this.toggle.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.close = this.close.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
	}

	init() {
		this.$label = this.rootElement.querySelector('.js-list-label');

		this.initEvents();
	}

	initEvents() {
		console.log('Button.initEvents');
		this.rootElement.addEventListener('click', this.toggle);
		this.rootElement.addEventListener('keyup', this.onKeyUp);
		this.box.rootElement.addEventListener('blur', this.close);
		this.box.rootElement.addEventListener('keydown', this.onKeyDown);
		this.box.setHandleFocusChange(this.onFocusChange);
	}

	onKeyUp(event) {
		// console.log('Button.onKeyUp');

		const key = event.keyCode || event.which;

		const open = () => {
			event.preventDefault();
			this.open();
			this.box.checkKeyPress(event);
		};

		const codes = {
			[UP]: open,
			[DOWN]: open,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	onKeyDown(event) {
		// console.log('Button.onKeyDown');

		const key = event.keyCode || event.which;

		const close = () => {
			event.preventDefault();
			this.close();
			this.rootElement.focus();
		};

		const codes = {
			[ENTER]: close,
			[ESCAPE]: close,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}


	toggle() {
		if (this.isOpen) return this.close();

		return this.open();
	}

	open() {
		console.info('Button.open');

		if (this.isOpen) return false;

		this.isOpen = true;

		addClass(this.box.rootElement, 'is-active');

		this.rootElement.setAttribute('aria-expanded', true);
		return this.box.rootElement.focus();
	}

	close() {
		console.info('Button.close');

		if (!this.isOpen) return false;

		this.isOpen = false;

		removeClass(this.box.rootElement, 'is-active');

		return this.rootElement.removeAttribute('aria-expanded');
	}

	onFocusChange(item) {
		this.$label.innerText = item.innerText;

		const changeEvent = new CustomEvent('Button.change', { detail: { item } });

		this.rootElement.dispatchEvent(changeEvent);
	}
}
