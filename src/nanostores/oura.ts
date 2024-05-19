import { persistentAtom } from '@nanostores/persistent'
import { onMount, task } from 'nanostores'
import { ChartDataType, defaultValue, getChartData } from '../models/oura'

export const $oura = persistentAtom<ChartDataType>('oura', defaultValue, {
  encode: JSON.stringify,
  decode: JSON.parse,
})

onMount($oura, () => {
  task(async () => {
    const data = await getChartData()
    $oura.set(data)
  })
})
