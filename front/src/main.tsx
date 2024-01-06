import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "dayjs/locale/fr";
import "./index.css";

import { MantineProvider } from "@mantine/core";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import mantineConfig from "./config/mantineConfig.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MantineProvider {...mantineConfig}>
    <App />
  </MantineProvider>
);
