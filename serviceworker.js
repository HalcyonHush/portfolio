self.addEventListener("install",function(e){e.waitUntil(caches.open("offline").then(function(e){return e.addAll(["/","/css/site.css","/css/home.css","/js/site.js","/img/icon-skills.svg","/img/icon-projects.svg","/img/icon-github.svg","/img/icon-linkedin.svg"])}))}),self.addEventListener("activate",function(e){e.waitUntil(clients.claim())}),self.addEventListener("fetch",function(e){"GET"===e.request.method&&e.respondWith(fetch(e.request).then(function(n){var t=n.clone();return caches.open("offline").then(function(n){n.put(e.request,t)}),n}).catch(function(n){return caches.match(e.request)}))});