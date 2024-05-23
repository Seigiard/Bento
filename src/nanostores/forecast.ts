import { atom, batched, task } from 'nanostores'
import { ForecastDataType, TTL_TIME, defaultValue, getForecast } from '../models/forecast'
import { $settings } from './settings'
export const $forecast = atom<ForecastDataType>(defaultValue)

// Stringify weatherKeys to avoid unnecessary fetches
const $weatherKeys = batched($settings, ({
  weatherDefaultLatitude, weatherDefaultLongitude, weatherKey, weatherLanguage, weatherUnit
}) => JSON.stringify({
  weatherDefaultLatitude, weatherDefaultLongitude, weatherKey, weatherLanguage, weatherUnit
}))

$weatherKeys.subscribe((keys) => {
  task(async () => {
    await updateForecaseData(keys)

    const intervalId = setInterval(async () => {
      await updateForecaseData(keys)
    }, TTL_TIME)
    return () => clearInterval(intervalId)
  })
})

async function updateForecaseData(keys) {
  const { weatherDefaultLatitude, weatherDefaultLongitude, weatherKey, weatherLanguage, weatherUnit } = JSON.parse(keys)

  const data = await getForecast({
    fallbackLatitude: weatherDefaultLatitude,
    fallbackLongitude: weatherDefaultLongitude,
    apiKey: weatherKey,
    language: weatherLanguage,
    unit: weatherUnit
  })

  data && $forecast.set(data)
}