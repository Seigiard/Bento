import { LinkType } from "./models";

export function getLinkListView(data: readonly LinkType[]) {
	const result = (data ?? []).map(({ title, link }) => {
		return `<li><a href="${link}">${title}</a></li>`;
	});

	result.push(getAddItemView());

	return result.join("");
}

function getAddItemView() {
	return ``;
}
