import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useReAuthentication from "../../hooks/useReAuthentication";
import { userAuthenticatedConfig } from "../../storage_configs/authenticationConfigs.ts";
import { useAtom } from "jotai";
import { login } from "../../constants/pages";

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
    return <Navigate to={login} replace />;
  }

  return render();
}

export default AuthenticationProtection;
