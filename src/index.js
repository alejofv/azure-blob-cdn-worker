addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  if (event.request.method === 'GET') {
    let response = await serveAsset(event)
    if (response.status > 399) {
      response = new Response(response.statusText, { status: response.status })
    }
    return response
  } else {
    return new Response('Method not allowed', {
      status: 405
    })
  }
}

const getAccountConfig = (host) => CDNKeys.get(host, "json")

async function serveAsset(event) {
  const cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    const url = new URL(event.request.url)

    console.log(`Getting config for ${url.host}`)
    const config = await getAccountConfig(url.host)
    if (!config)
      return new Response('Unrecognized host', { status: 400 })

    const pathPrefix = config.pathPrefix || ""
    const originUrl = `https://${config.name}.blob.core.windows.net${pathPrefix}${url.pathname}`
    const cacheMaxAge = config.cacheMaxAge || "31536000"

    console.log('Fetching from origin: ' + originUrl)
    response = await fetch(originUrl)

    if (response.status == 200) {
      // Aggresive cache: 7 days, inmutable
      response = new Response(response.body, response)
      response.headers.set('cache-control', `public, max-age=${cacheMaxAge}, immutable`)

      // Save successful responses in the cache - avoid caching temporary 404's or similar
      event.waitUntil(cache.put(event.request, response.clone()))
    }
  }
  return response
}