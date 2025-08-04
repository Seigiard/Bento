import { ForecastDataType } from "../models/forecast";

export function getForecastView({
	temperature,
	unit,
	description,
	icon,
}: ForecastDataType) {
	return `
    <svg version="2.0">
      <use href="#${icon}" />
    </svg>
    <span>${temperature} °${unit}</span>
    ${description}
  `;
}
