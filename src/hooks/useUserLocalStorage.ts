import { useLocalStorage } from "@mantine/hooks";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { login, registration } from "../constants/pages";
import { userKey } from "../constants/storageKeys";

import type { BackendModelsDtosAuthenticationDto } from "../api/types.gen";
import { setApiToken } from "../utils/apiClient.ts";
import { userAuthenticatedConfig } from "../storage_configs/authenticationConfigs.ts";
import { useAtom } from "jotai";

function useUserLocalStorage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserAuthenticated] = useAtom(userAuthenticatedConfig);

  const serialize = useCallback((value: BackendModelsDtosAuthenticationDto | null) => {
    if (value !== null) {
      return JSON.stringify({ ...value, userId: Number(value.userId) });
    }

    return "";
  }, []);

  const deserialize = useCallback(
    (value?: string) => {
      if (value) {
        const parsedUser = JSON.parse(value) as BackendModelsDtosAuthenticationDto;
        if (!parsedUser.token) {
          void navigate(login);
        }

        if (parsedUser.token && !isUserAuthenticated) {
          setApiToken(parsedUser.token);
        }

        return parsedUser;
      }

      if (location.pathname !== registration) {
        void navigate(login);
      }

      return null;
    },
    [isUserAuthenticated, location.pathname, navigate],
  );

  return useLocalStorage<BackendModelsDtosAuthenticationDto | null>({
    key: userKey,
    defaultValue: null,
    serialize,
    deserialize,
  });
}

export default useUserLocalStorage;
