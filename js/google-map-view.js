(function(window, document, undefined) {
  var GoogleMapView = {};
  
  var GEO_CODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

  // zoom level for Google Map
  var DEFAULT_ZOOM = 14;
  var STATUS_OK = 200;

  /* Renders a map for the given entry into the provided $map element. */
  GoogleMapView.render = function($map, entryData) {
    GoogleMapView.getGeocoding($map, entryData.address, GoogleMapView.getMap);
  };

  /* 
   * Gets the geocoded latitude and longitude from the Google geocoding API
   * and calls a callback to handle that data.
   * Params: @$map -> target HTML element, @address -> text address for mapping,
   *					@callback -> function to be called on success or error
   * 
   * Calls: callback($map, error, apiStatus, latitude, longitude)
   * 		$map -> the target HTML element to place the map in
   *		error -> the error that occurred or NULL if no error occurred
   * 		apiStatus -> the status returned by the geocoding api
   *		latitude -> latitude returned by the geocoding api
   * 		longitude -> longitude returned by the geocoding api
   */
  GoogleMapView.getGeocoding = function($map, address, callback) {
  	var request = new XMLHttpRequest();
    request.addEventListener('load', function() { //executes on return
      if(request.status == STATUS_OK) { //Good response code from server
        var resp = JSON.parse(request.responseText);
        if(resp.status == "OK") { //Everything OK from the Geocoding API
					var res = resp.results;
	        var lat = res[0].geometry.location.lat;
	        var lng = res[0].geometry.location.lng;
	        callback($map, null, resp.status, lat, lng, name);
        } else { //Bad response code from Geocoding API
        	callback($map, request.status, resp.status, null, null);
        }
      } else { //Bad response code from server
        callback($map, request.status, null, null, null);
      }
    });
    //setup POST request
    var url = GEO_CODING_URL + address;
    request.open('GET', url);
    //make request
    request.send();
  }

  /*
   * Takes a latitude and longitude and gets a map centered around that location.
   * Also gets sets a marker at that location. Then serves the map into the specified
   * HTML element (@$map).
   */
  GoogleMapView.getMap = function($map, error, apiStatus, latitude, longitude) {
    if(error) { //Handle errors from both the server and the Geocoding API
    	errMsg = error;
    	if(apiStatus) {
    		errMsg = "Geocoding API Error: " + apiStatus;
    	}
    	Util.displayErrMsg(errMsg);
    } else { //Received good results from Geocoding API -> use them to get map from Google Maps API
    	var LatLng = new google.maps.LatLng(latitude, longitude);
    	var mapOptions = {
	      center: {lat: latitude, lng: longitude},
	      zoom: DEFAULT_ZOOM
	    };
	    var map = new google.maps.Map($map[0], mapOptions);
		  var marker = new google.maps.Marker({
		      position: LatLng,
		      map: map
		  });
    }
  }
  
  window.GoogleMapView = GoogleMapView;
})(this, this.document);
