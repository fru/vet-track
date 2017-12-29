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

export function onPickerLoaded(args: EventData) {
    let timePicker = <TimePicker>args.object;

    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
    timePicker.hour = 9;
    timePicker.minute = 25;
}

export function navigatingTo(args: EventData) {

    let page = <Page>args.object;

    var _player = new TNSPlayer();
    _player.initFromFile({
        audioFile: '~/audio/ding.mp3', // ~ = app directory
        loop: false,
        completeCallback: _trackComplete.bind(this),
        errorCallback: _trackError.bind(this)
    }).then(() => {
        _player.play();
    });

    geolocation.enableLocationRequest();
    console.log(geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 }));
    
    var dialogs = require("ui/dialogs");
    dialogs.alert("Your message").then(function() {
        console.log("Dialog closed!");
    });

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