# leaflet-photo-map

Leaflet map showing geotagged photos

using the plugin [Leaflet.Photo](https://github.com/turban/Leaflet.Photo)

base map tiles from [Mapbox](https://www.mapbox.com/mapbox.js/api/v2.2.3/)
photo storage via [Cloudinary](http://cloudinary.com/)

## Simple setup for your own photo map

* register at Mapbox and create a base map
* register at Cloudinary, enable unsigned uploading and delivering of image meta data
* save `settings-sample.json` as `settings.json` and add your credentials
* add image: set `title`, `description`, `lat`, `lng` in meta data
* secure your settings file on your server
