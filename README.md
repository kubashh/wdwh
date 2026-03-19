# WDWH (Easier web dev without html)

The Bun frontend framework.
Designed to simplify static-site web development using TypeScript and Bun runtime.
The framework automatically converts `src/app/**/index.tsx` pages into HTML
during build, supports multi‑page projects, and bundles client-side code with
tailwind CSS.  
For development you need the Bun runtime.  
[Install bun](https://bun.com/docs/installation)

## Init project

```sh
bunx wdwh@latest init
```

## Usage

```tsx
import { createSignal } from "wdwh";

const countSignal = createSignal(0);

function Counter() {
  const count = countSignal.use();

  return (
    <>
      <h2>{count}</h2>
      <button onClick={() => countSignal.set((prev) => prev + 1)}>Increment</button>
    </>
  );
}
```

## Adding to project

### 1. Install `wdwh`

```sh
bun i wdwh@latest
```

### 2. Add script `dev` `build` to `package.json`

```json
{
  "scripts": {
    "dev": "wdwh dev",
    "build": "wdwh build"
  }
}
```

### 3. [Add files](https://github.com/kubashh/wdwh/tree/main/template/template)

- `src/app/index.tsx` and additional `src/app/` subfolders – **all**
  `index.tsx` files are treated as separate pages and will produce
  `/DIST_DIR/index.html`, `/DIST_DIR/foo/index.html`, etc.
- `src/app/App.tsx` <!-- to remove in future -->
- `src/app/react.svg` (favicon, can be any other image, bun path must be specify in `src/app/index.tsx`)
- `src/app/global.css` (must contain `@import "tailwindcss";`)
- `package.json` (with scripts `dev` `build`)
- `tsconfig.json` (for `typescript`). The framework ships with strict
  settings and checks every page file during build.

### Optional helper utilities

- `clsx` build in
- `useSearchParam`

<!-- - `useUrl` -->
<!-- - `comptime` executes js in build -->
