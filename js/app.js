/**
 * app.js
 * This is the file that houses the main app logic. It includes initial location data,
 * two Models (Location and Beer), a ViewModel, and initializes knockout.
 */

 /**
  * Initial Location data
  * It includes: id, title, address, latitude, longitude, BreweryDB API Id, image
  */
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

/**
 * The Location Model.
 * It sets the publicly viewable knockout attributes, handles creating a map marker,
 * handles creating a map info window (and opening/closing), and fetching beer data from the API.
 */
var Location = function(data, owner) {
    var self = this;

    // knockout observables
    this.id         = ko.observable("location-" + data.id);
    this.title      = ko.observable(data.title);
    this.address    = ko.observable(data.address);
    this.latitude   = ko.observable(data.lat);
    this.longitude  = ko.observable(data.lng);
    this.image      = ko.observable(data.image);
    this.dataLoaded = ko.observable(false);
    this.beers      = ko.observableArray([]);

    // instance variables
    this.owner         = owner;
    this.contentString = "<p>" + this.title() + "</p>";
    this.breweryDbId   = data.breweryDbId;

    /**
     * This function creates a google map marker object
     * @return {object} This returns the marker at lat/lng, with title and click handler.
     */
    this.createMarker = function() {
        if (typeof google !== 'undefined' && google.maps.Map) {
            // create the Google Maps marker at the correct location with title
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.latitude(), this.longitude()),
                title: this.title(),
                map: owner.map
            });

            // set the click handler -- which sets ViewModel.locationSelected(self)
            google.maps.event.addListener(marker, 'click', function() {
                owner.locationSelected(self);
            });

            return marker;
        }
    }
    this.marker = this.createMarker();

    /**
     * This function creates a google map info window object
     * @return {object} This returns the info window with content.
     */
    this.createInfoWindow = function() {
        // create the info window and set the content.
        // had to initialize the string outside of this function ¯\_(ツ)_/¯
        if (typeof google !== 'undefined' && google.maps.Map) {
            var infoWindow = new google.maps.InfoWindow({
                content: self.contentString
            });

            return infoWindow;
        }
    }
    this.infoWindow = this.createInfoWindow();

    /**
     * This function opens the location's info window
     */
    this.openInfoWindow = function() {
        if (typeof google !== 'undefined' && google.maps.Map) {
            self.infoWindow.open(owner.map, self.marker);
        }
    }

    /**
     * This function closes the location's info window
     */
    this.closeInfoWindow = function() {
        if (typeof google !== 'undefined' && google.maps.Map) {
            self.infoWindow.close();
        }
    }

    /**
     * This function loads beer data from the Brewery DB API (proxy).
     * On success: set the location's beers collection & flag the location as having loaded data.
     * On failure: alert the user with the error message.
     */
    this.loadBeerData = function() {
        $.ajax({ url: "http://mackermedia.com/brewery_db_proxy/?brewery_id=" + self.breweryDbId,
            success: function(data) {
                self.setBeers(data.data);
                self.dataLoaded(true);
            },
            error: function(msg) {
                alert(msg);
            }});
    }

    /**
     * This function sets the location's beers collection
     * It ignores beers with availability of 'Not Available'.
     * @param  {array of objects} This is the beer data to be stored in the beers collection.
     */
    this.setBeers = function(data) {
        data.forEach(function (beerData) {
            if (beerData.availabilityId !== undefined && beerData.availabilityId === 3) {
                return; // 3 is 'Not Available'
            }

            self.beers.push(new Beer(beerData))
        });
    }
}

/**
 * The Beer Model.
 * It sets the publicly viewable knockout attributes.
 * @param {object} This is the beer data to be set on the observable attributes.
 */
var Beer = function(data) {
    // knockout observables
    this.name = ko.observable(data.name);
    this.abv = ko.observable(data.abv);

    // handle case where no picture
    if (data.labels !== undefined) {
        this.icon = ko.observable(data.labels.medium);
    } else {
        this.icon = ko.observable("images/na.png");
    }

    // handle case where no style information
    if (data.style !== undefined) {
        this.style = ko.observable(data.style.name);
    } else {
        this.style = ko.observable("N/A");
    }
}

/**
 * The ViewModel.
 * A knockout.js convention object for handling binding data between the Models and the View.
 * It handles providing observable data and special application logic.
 */
var ViewModel = function() {
    var self = this;

    // knockout observables initialization
    this.locations = ko.observableArray([]);
    this.filteredLocations = ko.observableArray([]);
    this.currentLocation = ko.observable(null);
    this.searchKeyword = ko.observable('');

    /**
     * This function updates the currently selected Location.
     * On setting current: scroll the Location ListView item into view,
     * close all open info windows, open the location's info window, & load beer data.
     * @param  {object} This is the location object to set as current.
     */
    this.locationSelected = function(location) {
        // set the ko observable
        self.currentLocation(location);
        // scroll the listview item into view
        $("#" + location.id()).scrollintoview();

        // close open info windows and open the only current one
        closeAllInfoWindows();
        location.marker.setIcon("images/beer_marker.png");
        location.openInfoWindow();

        // load beer data
        if (location.dataLoaded() !== true) {
            location.loadBeerData();
        }
    }

    /**
     * This function gets called on creating a new ViewModel object.
     * It initializes the Google Maps map, initializes Location data, and filtered location data.
     */
    this.initialize = function() {
        // init the google map
        if (typeof google !== 'undefined' && google.maps.Map) {
            self.map = new google.maps.Map(document.getElementById('map-canvas'), {
                center: new google.maps.LatLng(40.025, -105.27),
                draggable: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                panControl: false,
                scrollwheel: false,
                zoom: 13,
            })
        } else {
            var mapCanvas = $("#map-canvas");
            mapCanvas.html("Google Maps Library failed to load. You need to either be online or not blocking this script.");
            mapCanvas.addClass("text-center");
        }

        // listen for the window resize event & trigger Google Maps to update too
        $(window).resize(function() {
            if (typeof google !== 'undefined' && google.maps.Map) {
                var center = map.getCenter();
                google.maps.event.trigger(this.map, "resize");
                self.map.setCenter(center);
            }
        });

        // init all locations list
        allLocations.forEach(function(locationItem) {
            self.locations.push(new Location(locationItem, this));
        });

        // init filtered locations list -- used for search/filtering
        self.locations().forEach(function (location) {
            self.filteredLocations.push(location);
        })
    }

    /**
     * This function is called on change of the search/filter input.
     * It resets the map, determines matching locations, and then updates the map.
     */
    this.searchFilter = function() {
        self.resetMap();

        // determine matches by simple string contains matching
        var matches = self.locations().filter(function (location) {
            return location.title().toLowerCase().indexOf(self.searchKeyword()) !== -1;
        });

        // if they match, insert them back into the filtered list
        self.filteredLocations(matches);

        self.updateMap();
    }

    /**
     * This function resets the google map's markers by removing all of them.
     */
    this.resetMap = function() {
        self.locations().forEach(function (location) {
            location.marker.setMap(null);
        })
    }

    /**
     * This function updates the google map's markers by adding only ones belonging to filteredLocations.
     */
    this.updateMap = function() {
        self.filteredLocations().forEach(function (location) {
            location.marker.setMap(self.map);
            location.closeInfoWindow();
        })
    }

    /**
     * This function closes all of the google map's info windows.
     */
    this.closeAllInfoWindows = function() {
        self.filteredLocations().forEach(function (location) {
            location.closeInfoWindow();
            location.marker.setIcon(null);
        })
    }

    initialize();
}

// make it go!
ko.applyBindings(ViewModel);
