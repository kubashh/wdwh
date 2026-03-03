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
  `/dist/index.html`, `/dist/foo/index.html`, etc.
- `src/app/App.tsx`
- `src/app/react.svg` (favicon, can be any other image, bun path must be specify in `src/app/index.tsx`)
- `src/app/global.css` (must contain `@import "tailwindcss";`)
- `package.json` (with scripts `dev` `build`)
- `tsconfig.json` (for `typescript`). The framework ships with strict
  settings and checks every page file during build.

### Optional helper utilities

- You can use built‑in helpers such as `useUrl()` (client side hook that
  returns the current path) and other future `comptime` helpers for compiling
  data at build time. Extend them by editing `src/lib/*` or adding plugins.
