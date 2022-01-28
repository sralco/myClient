const start_url = window.location.href;
let myname = 'myClient';
let mycolor = '#2f4f4f';

if (start_url.includes('saloni')) {
  myname = "Saloni";
}

if (start_url.includes('/mysaloon/')) {
  myname = decodeURI(start_url.substring(start_url.lastIndexOf('/') + 1));
  const arr = myname.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  myname = arr.join(" ") + " mySaloon";
}

if (start_url.includes('/mysaloon/') || (start_url.includes('/prenotazioneclienti/'))) {
  mycolor = '#000000';
}

var manifestJSON = {
  "id": "myClient",
  "gcm_sender_id": "103953800507",
  "name": myname,
  "short_name": myname,
  "theme_color": mycolor,
  "background_color": mycolor,
  "display": "standalone",
  "start_url": start_url,
  "description": myname + " APP",
  "icons": [{
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "https://www.gamainformatica.it/myClient/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ]
};

const link = document.createElement("link");
link.rel = "manifest";
const stringManifest = JSON.stringify(manifestJSON);
link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest))
document.head.appendChild(link);
