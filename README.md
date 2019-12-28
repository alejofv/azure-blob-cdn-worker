# Azure Blob CDN Worker

A Cloudflare Workers project used to handle requests to Azure Blob Storage on custom domains. The worker intercepts calls to a custom "blob" domain and re-routes them to Blob Storage, also using Cloudflare's caching API.

Based on the "Configure your CDN" tutorial on Cloudflare Workers (https://developers.cloudflare.com/workers/tutorials/configure-your-cdn/)

#### Using [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler config
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Test (with watch - hot reload)

```
wrangler preview --watch
```

Publish

```
wrangler publish
```