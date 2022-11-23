export const addClass = (target, className) => target.classList.add(className);
export const removeClass = (target, className) => target.classList.remove(className);
export const toggleClass = (target, className) => target.classList.toggle(className);
export const toggleAttribute = (target, attribute) =>
	target.hasAttribute(attribute)
		? target.removeAttribute(attribute)
		: target.setAttribute(attribute, '');
