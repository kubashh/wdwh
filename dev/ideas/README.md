# Ideas

## Build

build index.tsx to

1. index.html (include chunk-hash.html (because of hashing))
2. chunk-hash.css
3. chunk-hash.js
4. chunk-hash.html

So `index.html` is extremly light

## In runtime

`chunk-hash.html`
`js`
`css`

- cache hit =>
  - same name (hash) => chunk-hash.html from cache
  - else feach()
- else => feach()

## From GPT - cache framework

- **Basic caching (easy)**
  - key → value storage
  - TTL (time-to-live)
  - get / set / delete
  - in-memory cache

- **Intermediate caching (medium)**
  - file-based cache
  - HTTP caching (Cache-Control, ETag, Last-Modified)
  - request caching (e.g. API responses, HTML pages)
  - cache invalidation rules
  - integration with server (Bun/Node)

- **Advanced caching (hard)**
  - stale-while-revalidate
  - SSR/HTML caching
  - CDN / edge caching
  - distributed cache (multi-server)
  - race condition handling
  - cache consistency across systems

- **Production-grade framework (very hard)**
  - automatic invalidation
  - smart revalidation
  - build-time + runtime caching
  - streaming + partial caching
  - observability (cache hits/misses)
