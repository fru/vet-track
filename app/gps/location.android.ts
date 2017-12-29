declare var com: any;

import application = require("application");
import observable = require('data/observable');

const GoogleApiClient = com.google.android.gms.common.api.GoogleApiClient;
const LocationServices = com.google.android.gms.location.LocationServices;
const LocationRequest = com.google.android.gms.location.LocationRequest;
const LocationListener = com.google.android.gms.location.LocationListener;

var locationListener;

const service: any = new observable.Observable();

service.ready = false;

service.value = null;

service.watching = false;

service.serialize = function(location) {
  return location ? {
    provider: location.getProvider(),
    timestamp: new Date(location.getTime()),
    accuracy: location.hasAccuracy() ? location.getAccuracy() : null,
    latitude: location.getLatitude(),
    longitude: location.getLongitude(),
    altitude: location.hasAltitude() ? location.getAltitude() : null,
    speed: location.hasSpeed() ? location.getSpeed() : null,
    bearing: location.hasBearing() ? location.getBearing() : null,
    extras: location.getExtras(),
  } : null;
};

service.initialize = function() {

  this.googleApiClient = new GoogleApiClient.Builder(application.android.context)
    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks({
      onConnected: function() {
        //debug('onConnected', arguments);
        this.ready = true;
        this.notify({
          eventName: 'ready',
        });
        this.notify({
          eventName: '_googleApiClientConnected',
          object: this.googleApiClient
        });
      }.bind(this),
      onConnectionSuspended: function() {
        //debug('onConnectionSuspended', arguments);
        this.notify({
          eventName: '_googleApiClientConnectionSuspended',
          object: this.googleApiClient
        });
      }.bind(this),
    }))
    .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener({
      onConnectionFailed: function() {
        //debug('onConnectionFailed', arguments);
        this.notify({
          eventName: '_googleApiClientConnectionFailed',
          object: this.googleApiClient
        });
      }.bind(this),
    }))
    .addApi(LocationServices.API)
    .build();

  this.googleApiClient.connect();

};

application.android.on(application.AndroidApplication.activityStartedEvent, service.initialize.bind(service));

application.android.on(application.AndroidApplication.activityStoppedEvent, function(event) {
  this.googleApiClient.disconnect();
}.bind(service));

service.getLastKnown = function getLastKnown() { // TODO: recheck
  return new Promise(function(resolve, reject) {

    var _getLastKnown = function _getLastKnown() {
      var location = LocationServices.FusedLocationApi.getLastLocation(this.googleApiClient);
      //debug('getLastKnown', typeof location, location ? location.toString() : null);
      resolve(this.serialize(location));
    }.bind(this);

    if (this.ready) {
      _getLastKnown();
    } else {
      this.on('_googleApiClientConnected', _getLastKnown);
    }

  }.bind(this));
};

service.getCurrent = function getCurrent() {
  return new Promise(function(resolve, reject) {

    var _getCurrent = function _getCurrent() {

      var locationRequest = new LocationRequest();

      locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
      locationRequest.setMaxWaitTime(1000);
      locationRequest.setNumUpdates(1);

      var locationListener = new LocationListener({
        onLocationChanged: function onLocationChanged(location) {
          // debug('onLocationChanged', location.toString());
          var value = this.serialize(location);
          resolve(value);
        }.bind(this),
      });

      LocationServices.FusedLocationApi.requestLocationUpdates(this.googleApiClient, locationRequest, locationListener);

    }.bind(this);

    if (this.ready) {
      _getCurrent();
    } else {
      this.on('_googleApiClientConnected', _getCurrent);
    }

  }.bind(this));
};

service._watch = function _watch() {

  var locationRequest = new LocationRequest();

  locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
  locationRequest.setInterval(1000);
  locationRequest.setFastestInterval(1000);
  locationRequest.setMaxWaitTime(1000);
  locationRequest.setSmallestDisplacement(0);

  locationListener = new LocationListener({
    onLocationChanged: function onLocationChanged(location) {
      // debug('onLocationChanged', location.toString());

      var value = this.serialize(location);

      if (!value) {
        return;
      }

      this.value = value;

      this.notify({
        eventName: 'update',
        object: value,
      });

    }.bind(this),
  });

  LocationServices.FusedLocationApi.requestLocationUpdates(this.googleApiClient, locationRequest, locationListener);

};

service.startWatching = function startWatching() {
  if (this.watching) {
    return;
  }

  if (this.ready) {
    this._watch();
  } else {
    this.on('_googleApiClientConnected', this._watch.bind(this));
  }

  this.watching = true;
};

service.stopWatching = function stopWatching() {
  if (!this.watching) {
    return;
  }
  if (this.googleApiClient && this.googleApiClient.isConnected()) {
    LocationServices.FusedLocationApi.removeLocationUpdates(this.googleApiClient, locationListener);
  }
  this.watching = false;
};

export = service;
