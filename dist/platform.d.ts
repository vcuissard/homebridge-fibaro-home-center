import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { FibaroClient } from './fibaro-api';
import { SetFunctions } from './setFunctions';
import { GetFunctions } from './getFunctions';
import { Poller } from './pollerupdate';
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export declare class FibaroHC implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    readonly accessories: PlatformAccessory[];
    updateSubscriptions: Array<unknown>;
    poller?: Poller;
    scenes: Record<string, string>;
    climateZones: Record<string, string>;
    info: Record<string, string>;
    fibaroClient?: FibaroClient;
    setFunctions?: SetFunctions;
    getFunctions?: GetFunctions;
    mutex: any;
    constructor(log: Logger, config: PlatformConfig, api: API);
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): void;
    LoadAccessories(devices: any, rooms: any): void;
    addAccessory(device: any): void;
    removeAccessory(accessory: any): void;
    findServiceByName(name: any, service: any): Service | undefined;
    isOldApi(): boolean | "";
}
//# sourceMappingURL=platform.d.ts.map