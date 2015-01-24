
// 2. find and add images for locations
// 3. yelp reviews for locations

var allLocations = [
    {
      title: "Viget (My Work)",
      lat: 40.0173,
      lng: -105.277
    },
    {
      title: "PMG (Wife's Work)",
      lat: 40.0175,
      lng: -105.282
    },
    {
      title: "Boulder Fermentation Supply",
      lat: 40.0264,
      lng: -105.244
    },
    {
      title: "Outback Saloon",
      lat: 40.0317,
      lng: -105.258
    },
    {
      title: "Backcountry Pizza & Taphouse",
      lat: 40.0144,
      lng: -105.264
    }
]

/* ======= Model ======= */

var Location = function() {

}

/* ======= ViewModel ======= */

// 1. update my app to use knockout
// 1.1 create ViewModel functions for listview contents and clicks
// 1.2 listview click setCurrentLocation() on ViewModel which updates observables in info section
// 1.3 make viewModel update map markers? -- map marker clicks? -- map marker infowindows closing on selection
// 1.4 make listview click update css property to show selected

var ViewModel = function() {

    // 1. he starts with putting the model inside the ViewModel (name: clickCount: imgSrc:, imgAttribution, incrementCounter function())
    // 2. he puts data-bind attributes in the DOM and removes the ids for the current cat
    // 2.1 for img src he does data-bind="attr: {src: imgSrc}"
    // 3. add an obersvable array in viewModel -. added a ul with foreach: nicknames: and li with data-bind="text: $data"
    // 4. moves all the "model" related code from ViewModel to a Cat function (all the properties and computed functdions)
    // 5. in ViewModel this.currentCat = ko.observable(new Cat() );
    // 6. in DOM changes all data-bind things to currentCat().name
    // 7. changes currentCount function from this. to this.currentCat().
    // 8. uses KO `with` for scoping to remove "currentCat()" all over the place in DOM (div data-bind="with:currentCat") ALSO changes click to $parent.incrementCounter
    // 9. adds the var self = this; for the incrementCounter function scope within currentCat thing
    // 10. updates Cat function to accept data arg (var Cat = function(data) )
    // 11. change cat this.name = ko.observable(data.name) and hard-codes the { name: 'hi' } data in the ViewModel at constructor
    // 12. added var initialCats = [] array like previous
    // 13. in ViewModel, this.catLast = ko.observableArray([]); then initialCats.forEach(function(catItem) {
        // self.catList.push(new Cat(catItem));
    // })
    // 14. this.currentCat = ko.obserable(this.catList()[0]);
    // 15. to make them show up iterate over list in DOM and make function to set currentCat observable on click

}

/* ======= View ======= */

var mapView = {

    markers: [],
    infoWindows: [],

    init: function(aMap) {
        var mapOptions = {
          center: { lat: 40.025, lng: -105.27},
          zoom: 14
        };

        // store the map for later and attach it to the DOM
        this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        this.render();
    },

    render: function() {
        // populate markers
        var locations = ViewModel.getLocations();

        for (var i = 0; i < locations.length; i++) {
            this.markers[i] = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
                map: this.map,
                title: locations[i].title
            });

            this.infoWindows[i] = new google.maps.InfoWindow({
                content: "<div>" + locations[i].title + "</div>"
            });

            google.maps.event.addListener(this.markers[i], 'click', this.markerClickCallback(i, this));
        }
    },

    markerClickCallback: function(index, that) {
        return function() {
            that.infoWindows[index].open(that.map, that.markers[index]);
        };
    },

    closeOpenInfoWindows: function() {
        for (var i = 0; i < this.infoWindows.length; i++) {
            this.infoWindows[i].close();
        }
    },

    openInfoWindow: function(index) {
        this.closeOpenInfoWindows();
        this.infoWindows[index].open(this.map, this.markers[index]);
    }
}

var locationListView = {
    init: function() {
        // store the DOM element for access later
        this.locationListElem = document.getElementById('location-list');

        this.render();
    },

    render: function() {
        var location, elem, i;

        // get the locations from the ViewModel
        var locations = ViewModel.getLocations();

        // empty the location list
        this.locationListElem.innerHTML = '';

        // loop over the locations
        for (i = 0; i < locations.length; i++) {
            location = locations[i];

            elem = document.createElement('li');
            elem.textContent = location.title;

            // on click. setCurrentLocation and render the locationView
            elem.addEventListener('click', (function(locationCopy) {
                return function() {
                    ViewModel.setCurrentLocation(locationCopy);
                    locationView.render();
                    mapView.openInfoWindow(i);
                };
            })(location));

            // finally, add the element to the list
            this.locationListElem.appendChild(elem);
        }
    }
}

var locationView = {
    init: function() {
        // store pointers to DOM elements for access later
        this.locationNameElem = document.getElementById('location-name');

        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current location
        var currentLocation = ViewModel.getCurrentLocation();

        if (currentLocation !== null) {
            this.locationNameElem.textContent = currentLocation.title;
        }
    }
}

// make it go!
ko.applyBindings(ViewModel);
