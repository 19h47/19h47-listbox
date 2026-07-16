export const addClass = (target: Element, className: string): void => {
	target.classList.add(className);
};

export const removeClass = (target: Element, className: string): void => {
	target.classList.remove(className);
};

export const toggleClass = (target: Element, className: string): void => {
	target.classList.toggle(className);
};

export const toggleAttribute = (target: Element, attribute: string): void => {
	if (target.hasAttribute(attribute)) {
		target.removeAttribute(attribute);
	} else {
		target.setAttribute(attribute, '');
	}
};
