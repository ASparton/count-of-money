import CryptoList from "../elements/Crypto/CryptoList";
import Login from "../elements/Login";
import NewsList from "../elements/News/NewsList";
import Register from "../elements/Register";
import UserAccess from "../elements/UserAccess";
import { IRawRoute } from "../services/routeUtils";

export const noAuthRoute: IRawRoute[] = [
  {
    path: "login/",
    Component: Login,
  },
  {
    path: "register/",
    Component: Register,
  },
  {
    path: "crypto/",
    Component: CryptoList,
  },
  {
    path: "news/",
    Component: NewsList,
  },
];

export const authRoute: IRawRoute[] = [
  {
    path: "user/",
    Component: UserAccess,
  },
  {
    path: "crypto/",
    Component: CryptoList,
  },
  {
    path: "news/",
    Component: NewsList,
  },
];
