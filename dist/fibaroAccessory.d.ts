import { PlatformAccessory } from 'homebridge';
import { FibaroHC } from './platform';
export declare class FibaroAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly device;
    mainService: any;
    batteryService: any;
    mainCharacteristics: any;
    batteryCharacteristics: any;
    isValid: any;
    constructor(platform: FibaroHC, accessory: PlatformAccessory, device: any);
    bindCharactersticsEvent(service: any, characteristics: any): void;
    bindCharacteristicEvents(characteristic: any, service: any): void;
    setCharacteristicValue(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    getCharacteristicValue(callback: any, characteristic: any, service: any, accessory: any, IDs: any): Promise<void>;
    subscribeUpdate(service: any, characteristic: any, propertyChanged: any): void;
}
//# sourceMappingURL=fibaroAccessory.d.ts.map