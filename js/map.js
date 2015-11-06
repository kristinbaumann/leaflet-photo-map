var mapboxID, cloudinary_cloudName, cloudinary_apiKey, cloudinary_folder;
var map, photoLayer, data;


loadSettings();

function loadSettings(){
    $.getJSON("settings.json", function(json) {
        mapboxID = json['mapboxID']
        L.mapbox.accessToken = json['mapboxAccessToken']
        cloudinary_cloudName = json['cloudinary_cloudName']
        cloudinary_apiKey = json['cloudinary_apiKey']
        cloudinary_folder = json['cloudinary_folder']

        loadBaseMap();
        fetchData();
    });
}


function loadBaseMap(){
    map = L.map('map', {center: [-27.103, 133.467], zoom: 4, zoomControl: false });
    new L.Control.Zoom({ position: 'topright' }).addTo(map);

    var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/'+mapboxID+'/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken);

    map.addLayer(mapboxTiles);
}

function fetchData(){
    $.cloudinary.config({ cloud_name: cloudinary_cloudName, api_key: cloudinary_apiKey });

    url = $.cloudinary.url(cloudinary_folder, {format: 'json', type: 'list'});
    $.get( url, function (result) {
        data = result.resources;
        initLayer();
    });
}

function initLayer(){

    photoLayer = L.photo.cluster({ spiderfyDistanceMultiplier: 1.2 }).on('click', function (evt) {

        var template = '<div class="popup-container"><img src="{url}"/>';

        if(evt.layer.photo.caption != null)
            template +='<p class="popup-caption">{caption}</p>';

        if(evt.layer.photo.description != null)
            template +='<p class="popup-description">{description}</p>';
        template += '</div>';

        popup = evt.layer.bindPopup(L.Util.template(template, evt.layer.photo), {
            className: 'leaflet-popup-photo',
            minWidth: 400
        }).openPopup();
    });

    addImages();
}

function addImages(){

    var images = []

    data.forEach( function (entry) {
        if (entry.context != undefined){
            attributes = entry.context.custom;

            url = 'http://res.cloudinary.com/'+cloudinary_cloudName+'/image/upload/' + entry.public_id

            image = {
                caption: attributes.title,
                description: attributes.description,
                lat: attributes.lat,
                lng: attributes.lng,
                thumbnail: 'http://res.cloudinary.com/'+cloudinary_cloudName+'/image/upload/w_80,h_60,c_thumb,q_30/' + entry.public_id,
                url: 'http://res.cloudinary.com/'+cloudinary_cloudName+'/image/upload/q_70/' + entry.public_id
            }
            images.push(image);

        }
    });

    photoLayer.add(images).addTo(map);
    //map.fitBounds(photoLayer.getBounds());
}