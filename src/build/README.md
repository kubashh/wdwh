# Compilation (TODO)

`index.tsx`

```tsx
import { useState } from "react";
import "./index.css";

export default function Home() {
  return (
    <html>
      <head></head>
      <body className="bg-black text-white">
        <section>
          <h2>Comp1</h2>
          <Comp1 />
        </section>
        <section>
          <h2>Comp2</h2>
          <Comp2 />
        </section>
        <section>
          <h2>My static section</h2>
          <div>Count: none</div>
        </section>
      </body>
    </html>
  );
}

function Comp1() {
  const [count, setCount] = useState(0);

  const onClick = () => setCount((prev) => prev + 1);

  return (
    <div>
      <div>Count: {count}</div>
      <button onClick={onClick}>Increment</button>
    </div>
  );
}

function Comp2() {
  const [count, setCount] = useState(0);

  const onClick = () => setCount((prev) => prev * 2);

  return (
    <div className={count === 0 ? `text-red` : `text-tomato`}>
      <div>Count: {count}</div>
      <button onClick={onClick}>Double</button>
    </div>
  );
}
```

`index.css`

```css
@import "tailwindcss";
```

into

`index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- <link rel="icon" type="image/svg+xml" href="./react-c5c0zhye.svg" /> -->
    <!-- <title>Index</title> -->

    <script src="./index.tsx"></script>
  </head>
  <body class="bg-black text-white">
    <section>
      <h2>Comp1</h2>
      <div id="hydrate-1"></div>
    </section>
    <section id="hydrate-2"></section>
    <section>
      <h2>My static section</h2>
      <div>Count: none</div>
    </section>
  </body>
</html>
```

`index.tsx`

```tsx
import { hydrateRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";

hydrateRoot(document.getElementById(`hydrate-1`)!, <Hydrate1 />);
hydrateRoot(document.getElementById(`hydrate-2`)!, <Hydrate2 />);

function Hydrate1() {
  const [count, setCount] = useState(0);

  const onClick = () => setCount((prev) => prev + 1);

  return (
    <>
      <div>Count: {count}</div>
      <button onClick={onClick}>Increment</button>
    </>
  );
}

function Hydrate2() {
  return (
    <>
      <h2>Comp2</h2>
      <Comp2 />
    </>
  );
}

function Comp2() {
  const [count, setCount] = useState(0);

  const onClick = () => setCount((prev) => prev * 2);

  return (
    <div className={count === 0 ? `text-red` : `text-tomato`}>
      <div>Count: {count}</div>
      <button onClick={onClick}>Double</button>
    </div>
  );
}
```

`index.css`

```css
@import "tailwindcss";
```
