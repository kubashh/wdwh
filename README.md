# WDWH (Easyer web dev without html)

Works only with Bun runtime

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

- `src/app/index.tsx` (contains only `html` `head` `body` tags and `metadata`)
- `src/app/App.tsx` (app entry point)
- `src/app/react.svg` (favicon, can be any other image, bun path must be specify in `src/app/index.tsx`)
- `src/app/index.css` (must contain `@import "tailwindcss";`)
- `package.json` (with scripts `dev` `build`)
- `tsconfig.json` (for `typescript`)
