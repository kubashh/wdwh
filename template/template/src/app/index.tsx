import { type Metadata } from "wdwh";
import App from "./App";

export const metadata: Metadata = {
  title: `Example`,
  iconPath: `./react.svg`,
  // bundleIcon: `true`, // add it for bundle icon into html
  description: `Example project created with wdwh framework`,
};

export default function Page() {
  return (
    <body className="bg-black text-white">
      <App />
    </body>
  );
}
