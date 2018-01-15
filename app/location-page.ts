declare var android: any;
declare var com: any;
declare var java: any;


import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';
import { TNSPlayer } from 'nativescript-audio';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums";
import { TimePicker } from "ui/time-picker";
import { SnackBar, SnackBarOptions } from "nativescript-snackbar";
import * as appModule from "application";
import * as Permissions from "nativescript-permissions";

declare var android: any;

import { watchLocation } from './gps/nativescript-background-gps';


export function onPickerLoaded(args: EventData) {
    let timePicker = <TimePicker>args.object;

    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
    timePicker.hour = 9;
    timePicker.minute = 25;
}

export function navigatingTo(args: EventData) {

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    /*

    const GoogleApiClient = com.google.android.gms.common.api.GoogleApiClient;
    const LocationServices = com.google.android.gms.location.LocationServices;
    const LocationRequest = com.google.android.gms.location.LocationRequest;
    const LocationListener = com.google.android.gms.location.LocationListener;

    var googleApiClient = new GoogleApiClient.Builder(appModule.android.context)
    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks({
        onConnected: function() {
        
            var locationRequest = new LocationRequest();
            
              locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
              locationRequest.setInterval(1000);
              locationRequest.setFastestInterval(1000);
              locationRequest.setMaxWaitTime(1000);
              locationRequest.setSmallestDisplacement(0);
            
              var locationListener = new LocationListener({
                onLocationChanged: function onLocationChanged(location) {
                  // debug('onLocationChanged', location.toString());
                  console.log(JSON.stringify(location)); 
                  var _player = new TNSPlayer();
                  _player.initFromFile({
                      audioFile: '~/audio/ding.mp3', // ~ = app directory
                      loop: false,
                      completeCallback: _trackComplete.bind(this),
                      errorCallback: _trackError.bind(this)
                  }).then(() => {
                      _player.play();
                  });
                }
              });
              Permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "Test").then(() => {
                LocationServices.FusedLocationApi.requestLocationUpdates(googleApiClient, locationRequest, locationListener);
              });

        },
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

    googleApiClient.connect();*/

    /*const LocationResult = com.google.android.gms.location.LocationResult;
    com.pip3r4o.android.app.IntentService.extend('com.my.IntentService', {
        onHandleIntent: function (intent) {
            const loc = LocationResult.extractResult(intent).getLastLocation();
        }
    });*/

    //let context = (<android.content.Context>appModule.android.context);
    //const intent = new android.content.Intent(context, com.my.IntentService.class);
    //const pendingIntent = android.app.PrendingIntent.getService(context, 0, intent, android.app.PrendingIntent.FLAG_UPDATE_CURRENT);

    //var powerManager = (<android.content.Context>appModule.android.context).getSystemService(android.content.Context.POWER_SERVICE);
    //var lock = powerManager.newWakeLock(android.os.PowerManager.FULL_WAKE_LOCK, "TestTagVetTrack");
    //lock.acquire();

    var loaded = false;
    var _player = new TNSPlayer();
    _player.initFromFile({
        audioFile: '~/audio/ding.mp3', // ~ = app directory
        loop: false,
        completeCallback: _trackComplete.bind(this),
        errorCallback: _trackError.bind(this)
    }).then(() => {
        loaded = true;
    });

    Permissions.requestPermission(android.Manifest.permission.ACCESS_FINE_LOCATION, "Test").then(() => {
        var androidLocationManager = (<android.content.Context>appModule.android.context).getSystemService(android.content.Context.LOCATION_SERVICE);
        let criteria = new android.location.Criteria();
        criteria.setAccuracy(android.location.Criteria.ACCURACY_FINE);
        let listener = new android.location.LocationListener({
            onLocationChanged: function (location: android.location.Location) {
                console.log(JSON.stringify(location)); 
                
                _player.play();
                /*var _player = new TNSPlayer();
                _player.initFromFile({
                    audioFile: '~/audio/ding.mp3', // ~ = app directory
                    loop: false,
                    completeCallback: _trackComplete.bind(this),
                    errorCallback: _trackError.bind(this)
                }).then(() => {
                    _player.play();
                });*/
                
                //androidLocationManager.removeUpdates(listener);
            },

            onProviderDisabled: function (provider) {
                //
            },

            onProviderEnabled: function (provider) {
                //
            },

            onStatusChanged: function (arg1, arg2, arg3) {
                //
            }
        });
        androidLocationManager.requestLocationUpdates(1000, 0, criteria, listener, null);
    });


    /*watchLocation(
        function (location) { 
            
            console.log(JSON.stringify(location)); 
            var _player = new TNSPlayer();
            _player.initFromFile({
                audioFile: '~/audio/ding.mp3', // ~ = app directory
                loop: false,
                completeCallback: _trackComplete.bind(this),
                errorCallback: _trackError.bind(this)
            }).then(() => {
                _player.play();
            });
        
        },
        function (location) { console.log(location); },
        {}
    );*/

    let s = new SnackBar();
    let options: SnackBarOptions = {
        actionText: 'ActionText',
        actionTextColor: "#ff4081",
        snackText: 'SnackText',
        hideDelay: 3500
      };
  
      s.action(options).then(args => {
        if (args.command === "Action") {
          
        }
      }); 

    let page = <Page>args.object;

    /*var _player = new TNSPlayer();
    _player.initFromFile({
        audioFile: '~/audio/ding.mp3', // ~ = app directory
        loop: false,
        completeCallback: _trackComplete.bind(this),
        errorCallback: _trackError.bind(this)
    }).then(() => {
        _player.play();
    });*/

    //geolocation.enableLocationRequest();
    //console.log(geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 }));
    
    /*var dialogs = require("ui/dialogs");
    dialogs.alert("Your message").then(function() {
        console.log("Dialog closed!");
    });*/

    function _trackComplete(args: any) {
		console.log('reference back to player:', args.player);

		// iOS only: flag indicating if completed succesfully
		console.log('whether song play completed successfully:', args.flag);
	}

	function _trackError(args: any) {
		console.log('reference back to player:', args.player);
		console.log('the error:', args.error);

		// Android only: extra detail on error
		console.log('extra info on the error:', args.extra);
	}
    
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and TypeScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    page.bindingContext = new HelloWorldModel();
}