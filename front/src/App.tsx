import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { authRoute, noAuthRoute } from "./config/routes";
import DevTools from "./elements/DevTools";
import Guardian from "./elements/Guardian";
import Layout from "./elements/Layout/Layout";
import { renderRoute } from "./services/routeUtils";
const envVars = import.meta.env;

function App() {
  const PUBLIC_HOME = "/public/crypto";
  const AUTH_HOME = "/auth/home";

  return (
    <div>
      <BrowserRouter>
        {envVars.VITE_ENV === "DEV" && <DevTools />}
        <Guardian authRedirect={AUTH_HOME} noAuthRedirect={PUBLIC_HOME}>
          <Routes>
            {/* no auth routes */}
            <Route path="/public/" element={<Layout />}>
              {noAuthRoute.map((route) =>
                renderRoute({ ...route, needAuth: false })
              )}
            </Route>

            {/* auth routes */}
            <Route path="/auth/" element={<Layout />}>
              {authRoute.map((route) =>
                renderRoute({ ...route, needAuth: true })
              )}
            </Route>
            <Route path="*" element={<Navigate to={PUBLIC_HOME} />} />
          </Routes>
        </Guardian>
      </BrowserRouter>
    </div>
  );
}

export default App;
