import { batched } from 'nanostores'
import { lsAtom } from '../helpers/lsAtom'
import { ChartDataType, TTL_TIME, defaultValue, getChartData } from '../models/oura'
import { $settings } from './settings'

export const $oura = lsAtom<ChartDataType>('oura', defaultValue)

export const $lastFetchTimestamp = lsAtom<number>('ouraLastFetchTimestamp', 0)

// Stringify ouraKeys to avoid unnecessary fetches
const $ouraKeys = batched([$settings, $lastFetchTimestamp], ({ ouraApiKey }, lastFetchTimestamp) => JSON.stringify({
  ouraApiKey,
  lastFetchTimestamp
}))

$ouraKeys.subscribe((value) => {
  const {
    ouraApiKey,
    lastFetchTimestamp
  } = JSON.parse(value)

  if (!ouraApiKey) {
    return
  }

  const lastFetchDiffMs = new Date().getTime() - lastFetchTimestamp
  const timeout = TTL_TIME - lastFetchDiffMs < 0 ? 0 : TTL_TIME - lastFetchDiffMs

  const timeoutId = setTimeout(async () => {
    await updateOuraData(ouraApiKey)
  }, timeout)
  return () => clearInterval(timeoutId)
})

async function updateOuraData(ouraApiKey) {
  try {
    const data = await getChartData(ouraApiKey)
    data && $oura.set(data)
  } catch (e) {
    console.error(e)
  }

  $lastFetchTimestamp.set(new Date().getTime())
}
