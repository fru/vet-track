import {Location as LocationDef} from "./location";

export class Location implements LocationDef {
  public latitude: number;
  public longitude: number;

  public altitude: number;

  public horizontalAccuracy: number;
  public verticalAccuracy: number;

  public speed: number; // in m/s ?

  public direction: number; // in degrees

  public timestamp: Date;

  public android: any;  // android Location
}

export var defaultGetLocationTimeout = 20 * 1000; // 5 minutes