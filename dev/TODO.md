# TODO

- build: static pages exporter (2.0.0)
- dev: multi page development
- api wdwh/hooks: useUrl hook
- build: comptime function
- build: make import path of `App.tsx` independent (See 1.13.0 below)
- runtime: inline signals & signals optymalizations

`a idiot admires complexity, a genius adrimes simplicity`

## Static page exporter

/src/app/index.tsx => /dist/index.html
/src/app/test/index.tsx => /dist/test/index.html or /dist/test.html

- have same css => if multipage => no bundling

### 1.13.0 (make import path of `App.tsx` independent + some comptime side render)

`src/app/index.tsx`

```tsx
import { hello } from "util";

export default function Page() {
  return (
    <html lang="en">
      <body className="bg-blacke text-white">
        <div>Container</div>
        <button onClick={hello}>Click me!</button>
      </body>
    </html>
  );
}
```

`src/app/util.tsx`

```tsx
export function hello() {
  console.log(`Hello!`);
}
```

compiled to

`*in build RAM*`

```ts
const nodesTree = {
  imports: {
    util: { `hello` },
  },
  nodes: {
    type: `html`,
    props: { lang: `en` },
    children: [
      {
        type: `body`,
        props: {
          className: `bg-black text-white`,
        },
        children: [
          {
            type: `div`,
            children: `Container`,
          },
          {
            type: `button`,
            props: { onClick: `hello` }, // Or call(hello) or object
            children: `Click me!`,
          },
        ],
      },
    ],
  },
};
```

compiled to

`node_modules/.cache/wdwh/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="./react-c5c0zhye.svg" />
    <title>Example</title>
    <link rel="stylesheet" href="./chunk-wz55c7ww.css" />
    <script src="./chunk-3r6bk6sz.js"></script>
  </head>
  <body class="bg-black text-white"></body>
</html>
```

`+`

`node_modules/.chahe/wdwh/index.tsx`

```tsx
import { createRoot } from "react-dom/client";
import "../../../src/app/global.css";
import { hello } from "../../../src/app/util";

function Page() {
  return (
    <>
      <div>Container</div>
      <button onClick={hello}>Click me!</button>
    </>
  );
}

createRoot(document.getElementsByTagName("body")[0]).render(<App />);
```
