import type { ForecastDataType } from '../models/forecast';

export function getForecastView({
  temperature,
  unit,
  description,
  icon,
  hasGeolocationAccess,
}: ForecastDataType) {
  // Скрываем только если явно нет доступа к геолокации
  if (hasGeolocationAccess === false) {
    return null;
  }

  // Показываем прогноз если есть данные
  if (temperature !== '--' && temperature !== undefined) {
    return `
    <svg version="2.0">
      <use href="#${icon}" />
    </svg>
    <span>${temperature} °${unit}</span>
    ${description || ''}
  `;
  }

  // В остальных случаях показываем загрузку или пустой блок
  return `
    <svg version="2.0">
      <use href="#${icon}" />
    </svg>
    <span>-- °${unit}</span>
  `;
}
