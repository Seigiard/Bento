import { onMount, task } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { ChartDataType, defaultValue, getChartData } from '../models/oura'

export const $oura = lsAtom<ChartDataType>('oura', defaultValue)
export const $accessToken = lsAtom<string>('ouraAccessToken', '')

onMount($oura, () => {
  task(async () => {
    const accessToken = $accessToken.get()
    if (!accessToken) {
      return
    }
    const data = await getChartData(accessToken)
    $oura.set(data)
  })
})