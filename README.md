# Azure Blob CDN Worker

A Cloudflare Worker used to handle requests to Azure Blob Storage using custom domains. The worker runs on a custom domain to capture GET requests and re-route them to Blob Storage, while also using Cloudflare's caching API to cache the returned assets.

Based on the "Configure your CDN" tutorial on Cloudflare Workers (https://developers.cloudflare.com/workers/tutorials/configure-your-cdn/)

## Configuration

This worker can run on multiple routes and domains, and uses a KV namespace to map the requested domain to an Azure Blob Storage account name and (optionally) a path prefix.

i.e., having:

* This Worker running on custom route `blob.mydomain.com` 
* A KV entry: `"blob.mydomain.com": { "name": "my-az-account", "pathPrefix": "/container" }`

A GET request to `blob.mydomain.com/image.png` will be routed to `https://my-az-account.blob.core.windows.net/container/image.png`

If the specified blob exists, it will be returned as the response and also cached by Cloudflare.

Cloudflare Account id and KV namespace bindings are specified in the `wrangler.toml` file as specified in the [docs][docs].

## [wrangler](https://github.com/cloudflare/wrangler) commands

Init and Scaffolding

```
wrangler config
wrangler generate projectname https://github.com/cloudflare/worker-template
```

Test (with watch - hot reload)

```
wrangler preview --watch
```

[docs]:https://developers.cloudflare.com/workers/tooling/wrangler/configuration#per-project
