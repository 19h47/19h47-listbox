type Listener = (...args: any[]) => void;

export default class EventEmitter {
	#events = new Map<string, Listener[]>();

	on(event: string, listener: Listener): this {
		const listeners = this.#events.get(event) ?? [];
		listeners.push(listener);
		this.#events.set(event, listeners);

		return this;
	}

	emit(event: string, ...args: unknown[]): boolean {
		const listeners = this.#events.get(event);

		if (!listeners) {
			return false;
		}

		listeners.forEach(listener => {
			listener(...args);
		});

		return true;
	}

	off(event: string, listener: Listener): this {
		const listeners = this.#events.get(event);

		if (!listeners) {
			return this;
		}

		this.#events.set(
			event,
			listeners.filter(item => item !== listener),
		);

		return this;
	}
}
