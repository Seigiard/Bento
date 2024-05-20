import { atom, onMount, task } from 'nanostores'
import { ForecastDataType, TTL_TIME, defaultValue, getForecast } from '../models/forecast'

export const $forecast = atom<ForecastDataType>(defaultValue)

onMount($forecast, () => {
  task(async () => {
    const data = await getForecast()
    $forecast.set(data)

    const intervalId = setInterval(async () => {
      const data = await getForecast()
      $forecast.set(data)
    }, TTL_TIME)
    return () => clearInterval(intervalId)
  })
})
