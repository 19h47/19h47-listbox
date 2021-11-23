import { ARROW_UP, ARROW_DOWN, ENTER, ESCAPE } from '@19h47/keycode';

import { addClass, removeClass } from '@/utils';

export default class Button {
	constructor(element, box, options = {}) {
		this.rootElement = element;
		this.box = box;
		this.options = { delay: 0, ...options };

		this.isOpen = false;

		// Bind.
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyup = this.onKeyup.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onKeysChange = this.onKeysChange.bind(this);
	}

	init() {
		this.$label = this.rootElement.querySelector('.js-list-label');

		this.initEvents();
	}

	initEvents() {
		// console.info('Button.initEvents');

		this.rootElement.addEventListener('click', this.onClick);
		this.rootElement.addEventListener('keyup', this.onKeyup);

		this.box.on('Box.blur', () => this.close());
		this.box.on('Box.keydown', this.onKeydown);
		this.box.on('Box.focus', this.onFocus);
		this.box.on('Box.click', this.onFocus);
		this.box.on('Box.keysChange', this.onKeysChange);
	}

	onKeyup(event) {
		// console.log('Button.onKeyup');

		const key = event.keyCode || event.which;

		const open = () => {
			event.preventDefault();
			this.open();
			// this.box.checkKeyPress(event);
		};

		const codes = {
			[ARROW_UP]: open,
			[ARROW_DOWN]: open,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	onKeydown(event) {
		// console.info('Button.onKeydown');

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

	onClick() {
		return this.isOpen ? this.close() : this.open();
	}

	onFocus(item) {
		// console.info('Button.onFocus');

		this.$label.innerText = item.innerText;

		const changeEvent = new CustomEvent('Button.change', { detail: { item } });

		this.rootElement.dispatchEvent(changeEvent);
	}

	open() {
		// console.info('Button.open');

		if (this.isOpen) return false;

		this.isOpen = true;

		addClass(this.box.rootElement, 'is-active');

		this.rootElement.setAttribute('aria-expanded', true);

		setTimeout(() => {
			this.box.rootElement.focus();
		}, this.options.delay);

		return true;
	}

	close() {
		// console.info('Button.close');

		if (!this.isOpen) return false;

		this.isOpen = false;

		removeClass(this.box.rootElement, 'is-active');

		this.rootElement.removeAttribute('aria-expanded');

		return true;
	}

	onKeysChange(keys) {
		const event = new CustomEvent('Button.keys', { detail: { keys } });

		this.rootElement.dispatchEvent(event);
	}
}
