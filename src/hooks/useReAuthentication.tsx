import { useCallback, useEffect } from "react";
import useMutateData from "./useMutateData.ts";
import { postApiAuthenticationReauthenticateMutation } from "../api/@tanstack/react-query.gen.ts";
import useUserLocalStorage from "./useUserLocalStorage.ts";
import { userAuthenticatedConfig } from "../storage_configs/authenticationConfigs.ts";
import { useAtom } from "jotai";
import { setApiToken } from "../utils/apiClient.ts";
import type { BackendModelsDtosAuthenticationDto } from "../api";

function useReAuthentication() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useAtom<boolean>(userAuthenticatedConfig);
  const [user, setUserLocalStorage] = useUserLocalStorage();

  const onReauthenticationSuccess = useCallback(
    (reAuthenticationDto: BackendModelsDtosAuthenticationDto) => {
      if (!reAuthenticationDto.token) {
        return;
      }
      setIsUserAuthenticated(true);
      setUserLocalStorage(reAuthenticationDto);
      setApiToken(reAuthenticationDto.token);
    },
    [setIsUserAuthenticated, setUserLocalStorage],
  );

  const [, reauthenticate, isReauthenticateInProgress] = useMutateData(postApiAuthenticationReauthenticateMutation, { onSuccess: onReauthenticationSuccess });

  const handleReauthenticate = useCallback(async () => {
    if (user && !isUserAuthenticated) {
      await reauthenticate(user);
    }
  }, [isUserAuthenticated, reauthenticate, user]);

  useEffect(() => {
    if (!isReauthenticateInProgress) {
      void handleReauthenticate();
    }
  }, [handleReauthenticate, isReauthenticateInProgress]);
}

export default useReAuthentication;
