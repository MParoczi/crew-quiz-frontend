import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { showErrorNotification, showSuccessNotification } from "../utils/notifications";

import type { DefaultError, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IQueryOptionsFunction<TRequest> = (options: TRequest) => any;

interface IUseQueryDataOptions<TResponse> {
  onSuccess?: (data: TResponse) => Promise<void> | void;
  onError?: (error: DefaultError) => Promise<void> | void;
  successMessage?: string;
}

function useQueryData<TResponse, TRequest extends Record<string, unknown> | undefined>(
  queryOptionsFunction: IQueryOptionsFunction<TRequest>,
  queryParams?: TRequest,
  options?: IUseQueryDataOptions<TResponse>,
) {
  const queryOptions = queryOptionsFunction(queryParams ?? ({} as TRequest));

  const query = useQuery({
    ...queryOptions,
    enabled: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data !== undefined && options) {
      if (options.successMessage) {
        showSuccessNotification("Success", options.successMessage);
      }
      if (options.onSuccess) {
        void options.onSuccess(query.data as TResponse);
      }
    }
  }, [query.isSuccess, query.data, options]);

  useEffect(() => {
    if (query.isError) {
      showErrorNotification("Error", query.error.message || "An unexpected error occurred");
      if (options?.onError) {
        void options.onError(query.error);
      }
    }
  }, [query.isError, query.error, options]);

  const refetch = (refetchOptions?: RefetchOptions): Promise<QueryObserverResult<TResponse>> => {
    return query.refetch(refetchOptions) as Promise<QueryObserverResult<TResponse>>;
  };

  return [(query.data as TResponse | null) ?? null, refetch, query.isLoading as boolean] as const;
}

export default useQueryData;
