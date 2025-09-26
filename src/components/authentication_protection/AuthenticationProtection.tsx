import type { ReactNode } from "react";
import useReAuthentication from "../../hooks/useReAuthentication";
import { userAuthenticatedConfig } from "../../storage_configs/authenticationConfigs.ts";
import { useAtom } from "jotai";

interface IAuthenticationProtectionProps {
  children: ReactNode;
}

function AuthenticationProtection(props: IAuthenticationProtectionProps) {
  const { children } = props;

  const [isUserAuthenticated] = useAtom(userAuthenticatedConfig);

  useReAuthentication();

  function render() {
    if (isUserAuthenticated) {
      return children;
    }
    return null;
  }

  return render();
}

export default AuthenticationProtection;
