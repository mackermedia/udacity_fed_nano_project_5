
// 2. find and add images for locations
// 3. yelp reviews for locations

var allLocations = [
    {
        id: 1,
        title: "Avery Brewing Company",
        address: "5763 Arapahoe Avenue, Boulder, CO 80303",
        lat: 40.0144,
        lng: -105.219,
        breweryDbId: "Jio9R0",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/Jio9R0/upload_ygs0YS-icon.png"
    },
    {
        id: 2,
        title: "Twisted Pine Brewing Co",
        address: "3201 Walnut Street, Boulder, CO 80301",
        lat: 40.0201,
        lng: -105.251,
        breweryDbId: "aaN9Np",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/aaN9Np/upload_fhLuhp-icon.png"
    },
    {
        id: 3,
        title: "Boulder Beer",
        address: "2880 Wilderness Place, Boulder, CO 80301",
        lat: 40.0261,
        lng: -105.248,
        breweryDbId: "stdQLg",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/stdQLg/upload_k5veTg-icon.png"
    },
    {
        id: 4,
        title: "Upslope Brewing Company",
        address: "1898 South Flatiron Court Boulder, CO 80301",
        lat: 40.0203,
        lng: -105.218,
        breweryDbId: "VjnZAd",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/VjnZAd/upload_akMbwc-icon.png"
    },
    {
        id: 5,
        title: "FATE Brewing Company",
        address: "1600 38th Street, Boulder, CO 80301",
        lat: 40.0145,
        lng: -105.245,
        breweryDbId: "mEhLzL",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/mEhLzL/upload_9ANdl1-icon.png"
    },
    {
        id: 6,
        title: "J Wells Brewery",
        address: "2516 49th Street #5, Boulder, CO 80301",
        lat: 40.0245,
        lng: -105.239,
        breweryDbId: "XPKDbB",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/XPKDbB/upload_gV1bYr-icon.png"
    },
    {
        id: 7,
        title: "Wild Woods Brewery",
        address: "5460 Conestoga Court, Boulder, CO 80301",
        lat: 40.0166,
        lng: -105.227,
        breweryDbId: "a2yFCt",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/a2yFCt/upload_N449Jl-icon.png"
    },
    {
        id: 8,
        title: "Mountain Sun Pub & Brewery",
        address: "1535 Pearl Street, Boulder, CO 80302",
        lat: 40.0188,
        lng: -105.275,
        breweryDbId: "fQwjb1",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/fQwjb1/upload_RMU4U6-icon.png"
    },
    {
        id: 9,
        title: "Walnut Brewery",
        address: "1123 Walnut Street, Boulder, CO 80302",
        lat: 40.0167,
        lng: -105.281,
        breweryDbId: "ATZH3J",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/ATZH3J/upload_IKtakH-icon.png"
    },
    {
        id: 10,
        title: "Sanitas Brewing Co",
        address: "3550 Frontier Avenue, Boulder, CO 80301",
        lat: 40.0231,
        lng: -105.247,
        breweryDbId: "e7pl4v",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/e7pl4v/upload_DurIdP-icon.png"
    },
    {
        id: 11,
        title: "BRU handbuilt ales & eats",
        address: "5290 Arapahoe Avenue, Boulder, CO 80303",
        lat: 40.0145,
        lng: -105.228,
        breweryDbId: "1lFW5q",
        image: "https://s3.amazonaws.com/brewerydbapi/brewery/1lFW5q/upload_qcycin-icon.png"
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
    this.image = ko.observable(data.image);
    this.dataLoaded = ko.observable(false);
    this.breweryDbId = data.breweryDbId;
    this.owner = owner;

    this.createMarker = function() {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.latitude(), this.longitude()),
            title: this.title(),
            map: owner.map
        });

        google.maps.event.addListener(marker, 'click', function() {
            owner.locationSelected(self);
        });

        return marker;
    }

    this.marker = this.createMarker();

    this.contentString = "<p>" + this.title() + "</p>";

    this.createInfoWindow = function() {
        var infoWindow = new google.maps.InfoWindow({
            content: self.contentString
        });

        return infoWindow;
    }

    this.openInfoWindow = function() {
        self.infoWindow.open(owner.map, self.marker);
    }

    this.closeInfoWindow = function() {
        self.infoWindow.close();
    }

    this.infoWindow = this.createInfoWindow();

    this.beers = ko.observableArray([]);

    this.loadBeerData = function() {
        $.ajax({ url: "http://mackermedia.com/brewery_db_proxy/?brewery_id=" + self.breweryDbId,
            success: function(data) {
                self.setBeers(data.data);
                self.dataLoaded(true);
                self.owner.triggerCarousel();
            },
            error: function(msg) {
                // TODO show an error message
                console.log(msg);
                alert('oh no');
            }});
    }

    this.setBeers = function(data) {
        data.forEach(function (beerData) {
            if (beerData.availabilityId !== undefined && beerData.availabilityId === 3) {
                return; // 3 is 'Not Available'
            }

            self.beers.push(new Beer(beerData))
        });
    }
}

var Beer = function(data) {
    this.name = ko.observable(data.name);
    this.abv = ko.observable(data.abv);
    if (data.labels !== undefined) {
        this.icon = ko.observable(data.labels.medium);
    } else {
        this.icon = ko.observable("images/na.png");
    }
    if (data.style !== undefined) {
        this.style = ko.observable(data.style.name);
    } else {
        this.style = ko.observable("N/A");
    }
}

/* ======= ViewModel ======= */


var ViewModel = function() {
    var self = this;

    this.locations = ko.observableArray([]);
    this.filteredLocations = ko.observableArray([]);
    this.currentLocation = ko.observable(null);
    this.searchKeyword = ko.observable('');

    this.locationSelected = function(location) {
        self.currentLocation(location);
        $("#" + location.id()).scrollintoview();
        closeAllInfoWindows();
        location.openInfoWindow();
        if (location.dataLoaded() !== true) {
            location.loadBeerData();
        }
    }

    this.initialize = function() {
        this.map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: new google.maps.LatLng(40.025, -105.27),
            draggable: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            scrollwheel: false,
            zoom: 13,
        })

        // init all locations list
        allLocations.forEach(function(locationItem) {
            self.locations.push(new Location(locationItem, this));
        });

        // init filtered locations list
        self.locations().forEach(function (location) {
            self.filteredLocations.push(location);
        })
    }

    this.searchFilter = function() {
        self.resetMap();

        // determine matches
        var matches = self.locations().filter(function (location) {
            return location.title().toLowerCase().indexOf(self.searchKeyword()) !== -1;
        });

        // if they match, insert them back into the filtered list
        self.filteredLocations(matches);

        self.updateMap();
    }

    this.resetMap = function() {
        self.locations().forEach(function (location) {
            location.marker.setMap(null);
        })
    }

    this.updateMap = function() {
        self.filteredLocations().forEach(function (location) {
            location.marker.setMap(self.map);
            location.closeInfoWindow();
        })
    }

    this.closeAllInfoWindows = function() {
        self.filteredLocations().forEach(function (location) {
            location.closeInfoWindow();
        })
    }

    initialize();
}

// make it go!
ko.applyBindings(ViewModel);
