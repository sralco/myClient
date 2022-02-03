const start_url = window.location.href;
let myname = 'myClient';
let mycolor = '#2f4f4f';
let iconUrl = 'https://www.gamainformatica.it/images/PersonalizzazioniApp/gaetano_di_matteo/AppIcons/';


if (start_url.includes('saloni')) {
  myname = "Saloni";
}

if (start_url.includes('/mysaloon/')) {
  myname = decodeURI(start_url.substring(start_url.lastIndexOf('/') + 1));
  const arr = myname.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  iconUrl = 'https://www.gamainformatica.it/images/PersonalizzazioniApp/' + myname.split(' ').join('_').toLowerCase() + '/AppIcons/';
  var xhr = new XMLHttpRequest();
try{
    xhr.open('HEAD', iconUrl, false);
    xhr.send();
    if (xhr.status == "404") {
      iconUrl = 'https://www.gamainformatica.it/images/PersonalizzazioniApp/gaetano_di_matteo/AppIcons/';
    }

  } catch (error) {
    console.log(error)
  }

  console.log(iconUrl);
  myname = arr.join(" ") + " mySaloon";
}

if (start_url.includes('/mysaloon/') || (start_url.includes('/prenotazioneclienti/')) || (start_url.includes('/loginclienti')) || (start_url.includes('/registrazionecliente'))) {
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
      "src": iconUrl + 'android-icon-72x72.png',
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'android-icon-96x96.png',
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'apple-icon-120x120.png',
      "sizes": "120x120",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'android-icon-128x128.png',
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'android-icon-144x144.png',
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'apple-touch-icon-152x152.png',
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'apple-icon-180x180.png',
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'android-icon-192x192.png',
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'android-icon-384x384.png',
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": iconUrl + 'icon-512x512.png',
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "related_applications": [{
    "platform": "webapp",
    "url": "https://www.gamainformatica.it/generate-manifest.js",
  }],
};

const link = document.createElement("link");
link.rel = "manifest";
const stringManifest = JSON.stringify(manifestJSON);
link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest))
document.head.appendChild(link);
