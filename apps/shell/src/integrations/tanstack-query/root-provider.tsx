import { queryClient } from '@repo/query'

export function getContext() {
  return {
    queryClient,
  }
}

export default function TanstackQueryProvider() {}
