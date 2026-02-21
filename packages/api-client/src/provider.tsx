"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FexoraClient } from "./client";
import { setApiClient } from "./hooks";

interface ApiProviderProps {
  baseUrl: string;
  children: React.ReactNode;
}

export function ApiProvider({ baseUrl, children }: ApiProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [client] = useState(() => {
    const c = new FexoraClient(baseUrl);
    setApiClient(c);
    return c;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
