import { ARROW_UP, ARROW_DOWN, ENTER, ESCAPE } from './keycode';

import { addClass, removeClass } from './utils';
import type Box from './Box';

export type ButtonOptions = {
	delay?: number;
};

export default class Button {
	rootElement: HTMLElement;

	box: Box;

	options: Required<ButtonOptions>;

	isOpen = false;

	$label: HTMLElement | null = null;

	constructor(element: HTMLElement, box: Box, options: ButtonOptions = {}) {
		this.rootElement = element;
		this.box = box;
		this.options = { delay: 0, ...options };

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onKeyup = this.onKeyup.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onKeysChange = this.onKeysChange.bind(this);
	}

	init(): void {
		this.$label = this.rootElement.querySelector('.js-list-label');
		this.initEvents();
	}

	initEvents(): void {
		this.rootElement.addEventListener('click', this.onClick);
		this.rootElement.addEventListener('keyup', this.onKeyup);

		this.box.on('Box.blur', () => this.close());
		this.box.on('Box.keydown', this.onKeydown);
		this.box.on('Box.focus', this.onFocus);
		this.box.on('Box.click', this.onFocus);
		this.box.on('Box.keysChange', this.onKeysChange);
	}

	onKeyup(event: KeyboardEvent): false | void {
		const key = event.keyCode || event.which;

		const open = () => {
			event.preventDefault();
			this.open();
		};

		const codes: Record<number | string, () => false | void> = {
			[ARROW_UP]: open,
			[ARROW_DOWN]: open,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	onKeydown(event: KeyboardEvent): false | void {
		const key = event.keyCode || event.which;

		const close = () => {
			event.preventDefault();
			this.close();
			this.rootElement.focus();
		};

		const codes: Record<number | string, () => false | void> = {
			[ENTER]: close,
			[ESCAPE]: close,
			default: () => false,
		};

		return (codes[key] || codes.default)();
	}

	onClick(): boolean {
		return this.isOpen ? this.close() : this.open();
	}

	onFocus(item: HTMLElement): void {
		if (this.$label) {
			this.$label.innerText = item.innerText;
		}

		const changeEvent = new CustomEvent('Button.change', { detail: { item } });

		this.rootElement.dispatchEvent(changeEvent);
	}

	open(): boolean {
		if (this.isOpen) {
			return false;
		}

		this.isOpen = true;

		addClass(this.box.rootElement, 'is-active');
		this.rootElement.setAttribute('aria-expanded', 'true');

		setTimeout(() => {
			this.box.rootElement.focus();
		}, this.options.delay);

		return true;
	}

	close(): boolean {
		if (!this.isOpen) {
			return false;
		}

		this.isOpen = false;

		removeClass(this.box.rootElement, 'is-active');
		this.rootElement.removeAttribute('aria-expanded');

		return true;
	}

	onKeysChange(keys: string): void {
		const event = new CustomEvent('Button.keys', { detail: { keys } });

		this.rootElement.dispatchEvent(event);
	}
}
