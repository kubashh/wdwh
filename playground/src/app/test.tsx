import { hydrateRoot } from "react-dom/client";
import App from "./test-app";

// createRoot(document.getElementsByTagName(`body`)[0]!).render(<App />);
hydrateRoot(document.getElementsByTagName(`body`)[0]!, <App />);
