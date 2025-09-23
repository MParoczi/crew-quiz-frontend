import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";

import App from "./App.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
