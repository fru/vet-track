import {Observable, EventData} from 'data/observable';

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
    }

    _refilter() {
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