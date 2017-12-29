import {Observable, EventData} from 'data/observable';

import * as appModule from "application";
import * as fs from "tns-core-modules/file-system";
import * as Permissions from "nativescript-permissions";
import * as Watcher from "./gps/location.android";

declare var android: any;

export class HelloWorldModel extends Observable {

    allItems = [ "Jack", "John", "Mark", "Ashley" ];
    filter   = "";
    items: string[];

    constructor() {
        super();
        this.items = ['test', 'test1', 'test2', 'test', 'test1', 'test2', 'test', 'test1', 'test2', 'test', 'test1', 'test2']
        this.on(Observable.propertyChangeEvent, (e: any) => {
            if (e.propertyName === "filter") this.set("items", this._refilter());
        });

        //Watcher.initialize();


    }

    _refilter() {

        var lm = (<android.content.Context>appModule.android.context).getSystemService(android.content.Context.LOCATION_SERVICE);
        var location = lm.getLastKnownLocation(android.location.LocationManager.GPS_PROVIDER);
        console.log(location.getLongitude());

        var tempPath = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath(), "test.txt");

        
        Permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "Test").then(() => {

            var f1 = fs.File.fromPath(tempPath);
            f1.writeText(f1.readTextSync() + "\nSomething")
            .then(function () {
                // Succeeded writing to the file.
            }, function (error) {
                // Failed to write to the file.
            });
        }).catch(() => {
            console.log("Permission is not granted (sadface)");
        });
    

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        var result = []; 
        var filter = this.filter.trim();

        if (filter) {
            var regexp = new RegExp(filter, 'i');
            for(let item of this.allItems) {
                if (item.match(regexp)) {
                    result.push(item);
                }
            }
        }

        return result;
    }

}