import { AxiosError } from 'axios'

import { QueryClient } from '@tanstack/react-query'

function logRequestID(error: unknown) {
  if (error instanceof AxiosError && `${error.status}`.startsWith('5')) {
    const requestId = error.config?.headers['X-Request-ID']
    console.log(`Ошибка сервера. ID запроса: ${requestId}`)
  }

  return false
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      throwOnError: logRequestID,
    },
    mutations: {
      throwOnError: logRequestID,
    },
  },
})
