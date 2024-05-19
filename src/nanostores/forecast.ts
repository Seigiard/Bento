import { atom, onMount, task } from 'nanostores'
import { ForecastDataType, defaultValue, getForecast } from '../models/forecast'

export const $forecast = atom<ForecastDataType>(defaultValue)

onMount($forecast, () => {
  task(async () => {
    const data = await getForecast()
    $forecast.set(data)
  })
})
