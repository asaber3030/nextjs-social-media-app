"use client"
import React, { useState } from "react"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60,
      },
    },
  }))

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}