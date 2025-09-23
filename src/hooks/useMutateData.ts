import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { showErrorNotification, showSuccessNotification } from "../utils/notifications";

import type { DefaultError, UseMutationOptions } from "@tanstack/react-query";

type IMutationFunction<TResponse, TRequest> = (options?: Partial<TRequest>) => UseMutationOptions<TResponse, DefaultError, TRequest>;

type ExtractBodyType<T> = T extends { body?: infer B } ? B : never;
type ExtractPathType<T> = T extends { path?: infer P } ? P : never;

interface IUseMutateDataOptions<TResponse> {
  onSuccess?: (data: TResponse) => Promise<void> | void;
  onError?: (error: DefaultError) => Promise<void> | void;
  successMessage?: string;
}

function useMutateData<TResponse, TRequest extends Record<string, unknown>>(mutationFunction: IMutationFunction<TResponse, TRequest>, options?: IUseMutateDataOptions<TResponse>) {
  const [data, setData] = useState<TResponse | null>(null);

  const mutation = useMutation({
    ...mutationFunction(),
    onSuccess: async (responseData) => {
      setData(responseData);
      if (options?.successMessage) {
        showSuccessNotification("Success", options.successMessage);
      }
      await options?.onSuccess?.(responseData);
    },
    onError: async (error) => {
      setData(null);
      showErrorNotification("Error", error.message || "An unexpected error occurred");
      await options?.onError?.(error);
    },
  });

  const executeRequest = async (requestBody: ExtractBodyType<TRequest>, path?: ExtractPathType<TRequest>) => {
    const requestData: Record<string, unknown> = { body: requestBody };
    if (path !== undefined) {
      requestData.path = path;
    }
    await mutation.mutateAsync(requestData as TRequest);
  };

  return [data, executeRequest, mutation.isPending] as const;
}

export default useMutateData;
