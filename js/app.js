
// 2. find and add images for locations
// 3. yelp reviews for locations

var allLocations = [
    {
        id: 1,
        title: "Avery Brewing Company",
        address: "5763 Arapahoe Avenue, Boulder, CO 80303",
        lat: 40.0144,
        lng: -105.219
    },
    {
        id: 2,
        title: "Twisted Pine Brewing Co",
        address: "3201 Walnut Street, Boulder, CO 80301",
        lat: 40.0201,
        lng: -105.251
    },
    {
        id: 3,
        title: "Boulder Beer",
        address: "2880 Wilderness Place, Boulder, CO 80301",
        lat: 40.0261,
        lng: -105.248
    },
    {
        id: 4,
        title: "Upslope Brewing Company",
        address: "1898 South Flatiron Court Boulder, CO 80301",
        lat: 40.0203,
        lng: -105.218
    },
    {
        id: 5,
        title: "FATE Brewing Company",
        address: "1600 38th Street, Boulder, CO 80301",
        lat: 40.0145,
        lng: -105.245
    },
    {
        id: 6,
        title: "J Wells Brewery",
        address: "2516 49th Street #5, Boulder, CO 80301",
        lat: 40.0245,
        lng: -105.239
    },
    {
        id: 7,
        title: "Wild Woods Brewery",
        address: "5460 Conestoga Court, Boulder, CO 80301",
        lat: 40.0166,
        lng: -105.227
    },
    {
        id: 8,
        title: "Mountain Sun Pub & Brewery",
        address: "1535 Pearl Street, Boulder, CO 80302",
        lat: 40.0188,
        lng: -105.275
    },
    {
        id: 9,
        title: "Walnut Brewery",
        address: "1123 Walnut Street, Boulder, CO 80302",
        lat: 40.0167,
        lng: -105.281
    },
    {
        id: 10,
        title: "Sanitas Brewing Co",
        address: "3550 Frontier Avenue, Boulder, CO 80301",
        lat: 40.0231,
        lng: -105.247
    },
    {
        id: 11,
        title: "BRU handbuilt ales & eats",
        address: "5290 Arapahoe Avenue, Boulder, CO 80303",
        lat: 40.0145,
        lng: -105.228
    },
    {
        id: 12,
        title: "Boulder Distillery & Clear Spirit Company",
        address: "2500 47th Street Unit 10, Boulder, CO 80301",
        lat: 40.0264,
        lng: -105.244
    },
    {
        id: 13,
        title: "Roundhouse Spirits Distillery",
        address: "5311 Western Avenue #180, Boulder, CO 80301",
        lat: 40.0174,
        lng: -105.229
    },
    {
        id: 14,
        title: "J&L Distilling Company",
        address: "4843 Pearl Street #1, Boulder, CO 80301",
        lat: 40.0254,
        lng: -105.240
    }
]

/* ======= Model ======= */

var Location = function(data, owner) {
    var self = this;

    this.id = ko.observable("location-" + data.id);
    this.title = ko.observable(data.title);
    this.address = ko.observable(data.address);
    this.latitude = ko.observable(data.lat);
    this.longitude = ko.observable(data.lng);

    this.createMarker = function() {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(ko.unwrap(this.latitude), ko.unwrap(this.longitude)),
            title: ko.unwrap(this.title),
            map: owner.map
        });

        google.maps.event.addListener(marker, 'click', function() {
            owner.locationSelected(self);
        });

        return marker;
    }

    var marker = this.createMarker();
}

/* ======= ViewModel ======= */

// 1.3 make viewModel update map markers? -- map marker clicks? -- map marker infowindows closing on selection
// 1.4 make listview click update css property to show selected

var ViewModel = function() {
    var self = this;

    this.locations = ko.observableArray([]);
    this.currentLocation = ko.observable(null);

    this.locationSelected = function(location) {
        this.currentLocation(location);
        document.getElementById(ko.unwrap(location.id)).scrollIntoView();
    }

    this.initialize = function() {
        this.map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(40.025, -105.27),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        })

        allLocations.forEach(function(locationItem) {
            self.locations.push(new Location(locationItem, this));
        });
    }

    initialize();
}


// var mapView = {

//     markers: [],
//     infoWindows: [],

//     init: function(aMap) {
//         var mapOptions = {
//           center: { lat: 40.025, lng: -105.27},
//           zoom: 14
//         };

//         // store the map for later and attach it to the DOM
//         this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//         this.render();
//     },

//     render: function() {
//         // populate markers
//         var locations = ViewModel.getLocations();

//         for (var i = 0; i < locations.length; i++) {
//             this.markers[i] = new google.maps.Marker({
//                 position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
//                 map: this.map,
//                 title: locations[i].title
//             });

//             this.infoWindows[i] = new google.maps.InfoWindow({
//                 content: "<div>" + locations[i].title + "</div>"
//             });

//             google.maps.event.addListener(this.markers[i], 'click', this.markerClickCallback(i, this));
//         }
//     },

//     markerClickCallback: function(index, that) {
//         return function() {
//             that.infoWindows[index].open(that.map, that.markers[index]);
//         };
//     },

//     closeOpenInfoWindows: function() {
//         for (var i = 0; i < this.infoWindows.length; i++) {
//             this.infoWindows[i].close();
//         }
//     },

//     openInfoWindow: function(index) {
//         this.closeOpenInfoWindows();
//         this.infoWindows[index].open(this.map, this.markers[index]);
//     }
// }


// make it go!
ko.applyBindings(ViewModel);
