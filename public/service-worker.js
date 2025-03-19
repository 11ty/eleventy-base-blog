self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("static").then(cache => {
      return cache.addAll(["/", "/style.css", "/style2.css", "/src/eleventy.js", "https://cdn.glitch.global/20f72408-f4e6-44a2-8c7f-cb2b06892d20/android-chrome-512x512.png?v=1735625043056"])
    })
  )
  
  self.skipWaiting();
})

self.addEventListener("fetch", e => {
  console.log(`Intercepting fetch request for: ${e.request.url}`);
})
