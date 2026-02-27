import { type Metadata } from "wdwh";
import App from "./App.tsx";

export const metadata: Metadata = {
  iconPath: `./react.svg`,
  title: `Example`,
};

export default function Page() {
  return (
    <html>
      <head></head>
      <body className="bg-black text-white">
        <App />
      </body>
    </html>
  );
}
