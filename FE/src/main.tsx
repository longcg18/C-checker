import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.tsx";
import "./styles/index.css";

const GOOGLE_CLIENT_ID = "988401071814-56kve7lfi1sg4vqckqju6v0p25hk5o8o.apps.googleusercontent.com";
const rootElement = document.getElementById("root")!;

// The server-rendered HTML gives crawlers complete public content immediately.
// React then takes ownership of the same container for the interactive app.
if (rootElement.dataset.prerendered === "true") rootElement.replaceChildren();

createRoot(rootElement).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
