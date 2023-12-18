import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authRoute, noAuthRoute } from "../config/routes";
import { IRawRoute } from "../services/routeUtils";
import { useUser } from "../stores/User.store";

interface IGuardianProps {
  noAuthRedirect: string;
  authRedirect: string;
  children: React.ReactElement;
}

const getAuthForRoute = () => {
  const pathname = location.pathname;
  const noAuth = noAuthRoute.find(
    (r) => "/public/" + r.path.slice(0, -1) === pathname
  );
  const auth = authRoute.find(
    (r) => "/auth/" + r.path.slice(0, -1) === pathname
  );

  const actualRoute = {
    ...((noAuth || auth) as IRawRoute),
    needAuth: auth !== undefined,
  };

  return actualRoute.needAuth;
};

const Guardian: React.FC<IGuardianProps> = ({
  noAuthRedirect,
  authRedirect,
  children,
}) => {
  const user = useUser();
  const isAuth = (user.token ?? "").length > 0;
  const location = useLocation();

  const routeNeedAuth = getAuthForRoute();

  const navigate = useNavigate();

  let redirectRoute = location.pathname;

  if (isAuth !== routeNeedAuth) {
    if (isAuth === true) redirectRoute = authRedirect;
    else redirectRoute = noAuthRedirect;
  }

  useEffect(() => {
    if (location.pathname !== redirectRoute) {
      const timeoutID = setTimeout(() => {
        clearInterval(timeoutID);
        navigate(redirectRoute);
      }, 2000);
    }
  }, [location, isAuth]);

  if (location.pathname !== redirectRoute)
    return <div>Vous allez être redirigé dans quelques instants</div>;

  return children;
};

export default Guardian;
