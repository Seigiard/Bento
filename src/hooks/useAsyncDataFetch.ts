import { useSignal, useSignalEffect } from '@preact/signals'

interface UseAsyncDataFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseAsyncDataFetchOptions {
  /**
   * Условие для автоматической загрузки данных
   * Если false, данные не будут загружены автоматически
   */
  enabled?: boolean
  
  /**
   * Пропускать автоматическую загрузку если данные уже загружены
   * По умолчанию true
   */
  skipIfLoaded?: boolean
}

/**
 * Универсальный хук для асинхронной загрузки данных
 * @param fetchFn - функция для загрузки данных
 * @param options - опции для хука
 * @returns объект с data, isLoading, error и refetch
 */
export function useAsyncDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataFetchOptions = {}
): UseAsyncDataFetchResult<T> {
  const { enabled = true, skipIfLoaded = true } = options
  
  const data = useSignal<T | null>(null)
  const isLoading = useSignal(false)
  const error = useSignal<string | null>(null)
  const hasLoaded = useSignal(false)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetchFn()
      data.value = result
      hasLoaded.value = true
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('useAsyncDataFetch error:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  // Автоматическая загрузка при изменении условий
  useSignalEffect(() => {
    const shouldFetch = enabled && (!skipIfLoaded || !hasLoaded.value)
    if (shouldFetch) {
      fetchData()
    }
  })

  return {
    data: data.value,
    isLoading: isLoading.value,
    error: error.value,
    refetch: fetchData
  }
}