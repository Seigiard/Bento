import { getElement } from "./getElement";

export function renderText(selector: string, text?: string | number) {
	if (text === undefined) {
		return;
	}

	const el = getElement(selector);

	if (!el) {
		return;
	}

	el.innerHTML = "" + text;
}
