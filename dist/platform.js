"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FibaroHC = void 0;
const settings_1 = require("./settings");
const fibaroAccessory_1 = require("./fibaroAccessory");
const fibaro_api_1 = require("./fibaro-api");
const setFunctions_1 = require("./setFunctions");
const getFunctions_1 = require("./getFunctions");
const pollerupdate_1 = require("./pollerupdate");
const async_mutex_1 = require("async-mutex");
const defaultPollerPeriod = 5;
const timeOffset = 2 * 3600;
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class FibaroHC {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        // this is used to track restored cached accessories
        this.accessories = [];
        this.updateSubscriptions = [];
        this.scenes = {};
        this.climateZones = {};
        this.mutex = new async_mutex_1.Mutex();
        this.info = {};
        if (!config) {
            this.log.error('Fibaro HC configuration: cannot find configuration for the plugin');
            return;
        }
        let pollerPeriod = this.config.pollerperiod ? parseInt(this.config.pollerperiod) : defaultPollerPeriod;
        if (isNaN(pollerPeriod) || pollerPeriod < 0 || pollerPeriod > 100) {
            pollerPeriod = defaultPollerPeriod;
        }
        if (this.config.thermostattimeout === undefined) {
            this.config.thermostattimeout = timeOffset.toString();
        }
        if (this.config.switchglobalvariables === undefined) {
            this.config.switchglobalvariables = '';
        }
        if (this.config.dimmerglobalvariables === undefined) {
            this.config.dimmerglobalvariables = '';
        }
        if (this.config.securitysystem === undefined ||
            (this.config.securitysystem !== 'enabled' && this.config.securitysystem !== 'disabled')) {
            this.config.securitysystem = 'disabled';
        }
        if (this.config.FibaroTemperatureUnit === undefined) {
            this.config.FibaroTemperatureUnit = 'C';
        }
        if (this.config.addRoomNameToDeviceName === undefined) {
            this.config.addRoomNameToDeviceName = 'disabled';
        }
        this.fibaroClient = new fibaro_api_1.FibaroClient(this.config.url, this.config.host, this.config.username, this.config.password, this.log, this.config.adminUsername, this.config.adminPassword);
        if (this.fibaroClient.status === false) {
            this.log.error('Cannot connect to Fibaro Home Center. Check credentials, url/host or ca.cer file');
            return;
        }
        if (pollerPeriod !== 0) {
            this.poller = new pollerupdate_1.Poller(this, pollerPeriod);
        }
        this.getFunctions = new getFunctions_1.GetFunctions(this);
        this.log.debug('Finished initializing platform:', this.config.name);
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on('didFinishLaunching', async () => {
            log.debug('Executed didFinishLaunching callback');
            if (!this.fibaroClient) {
                return;
            }
            try {
                this.info = (await this.fibaroClient.getInfo()).body;
                const scenes = (await this.fibaroClient.getScenes()).body;
                scenes.map((s) => {
                    this.scenes[s.name] = s.id;
                    if (s.name.startsWith('_')) {
                        const device = { name: s.name.substring(1), roomID: 0, id: s.id, type: 'scene' };
                        this.addAccessory(device);
                    }
                });
                if (this.isOldApi()) {
                    const heatingZones = (await this.fibaroClient.getHeatingZones()).body;
                    heatingZones.map((s) => {
                        this.climateZones[s.name] = s.id;
                        const device = { name: s.name, roomID: 0, id: s.id, type: 'heatingZone', properties: s.properties };
                        this.addAccessory(device);
                    });
                }
                else {
                    const climateZones = (await this.fibaroClient.getClimateZones()).body;
                    climateZones.map((s) => {
                        this.climateZones[s.name] = s.id;
                        const device = { name: s.name, roomID: 0, id: s.id, type: 'climateZone', properties: s.properties };
                        this.addAccessory(device);
                    });
                }
                this.setFunctions = new setFunctions_1.SetFunctions(this); // There's a dependency in setFunction to Scene Mapping
                const devices = this.fibaroClient ? (await this.fibaroClient.getDevices()).body : {};
                let rooms = null;
                if (this.config.addRoomNameToDeviceName === 'enabled' && this.fibaroClient) {
                    rooms = (await this.fibaroClient.getRooms()).body;
                }
                this.LoadAccessories(devices, rooms);
            }
            catch (e) {
                this.log.error('Error getting data from Home Center: ', e);
                throw e;
            }
        });
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        // To enable the removing of cached accessories no more present on Fibaro Home Center
        accessory.context.reviewed = false;
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    LoadAccessories(devices, rooms) {
        this.log.info('Loading F accessories');
        devices.map((s, i, a) => {
            if (s.visible === true && !s.name.startsWith('_')) {
                if (rooms !== null) {
                    // patch device name
                    this.log.debug('Rooms not null');
                    const room = rooms.find(r => r.id === s.roomID);
                    s.name = s.name + ' - ' + ((room !== null && room !== undefined) ? room.name : 'no-room');
                }
                this.addAccessory(s);
            }
        });
        // Create Global Variable Switches and Dimmers
        const createGlobalVariableDevices = (param, type) => {
            if (param && param !== '') {
                const globalVariables = param.split(',');
                for (let i = 0; i < globalVariables.length; i++) {
                    const device = { name: globalVariables[i], roomID: 0, id: 0, type: type };
                    this.addAccessory(device);
                }
            }
        };
        createGlobalVariableDevices(this.config.switchglobalvariables, 'G');
        createGlobalVariableDevices(this.config.dimmerglobalvariables, 'D');
        // Create Security System accessory
        if (this.config.securitysystem === 'enabled') {
            const device = { name: 'FibaroSecuritySystem', roomID: 0, id: 0, type: 'securitySystem' };
            this.addAccessory(device);
        }
        // Remove not reviewd accessories: cached accessories no more present in Home Center
        this.accessories.forEach((a) => {
            if (!a.context.reviewed) {
                this.removeAccessory(a);
            }
        });
        // Start the poller update mechanism
        if (this.poller) {
            this.poller.poll();
        }
    }
    addAccessory(device) {
        if (device === undefined) {
            return;
        }
        const uuid = this.api.hap.uuid.generate(device.name + device.roomID);
        const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
        if (existingAccessory) {
            // the accessory already exists
            this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
            // Update context
            existingAccessory.context.device = device;
            existingAccessory.context.reviewed = true;
            this.api.updatePlatformAccessories([existingAccessory]);
            // Create accessory handler
            new fibaroAccessory_1.FibaroAccessory(this, existingAccessory, device);
        }
        else {
            // the accessory does not yet exist, so we need to create it
            const accessory = new this.api.platformAccessory(device.name, uuid);
            // Create context
            accessory.context.device = device;
            accessory.context.reviewed = true;
            // Create accessory handler
            const fa = new fibaroAccessory_1.FibaroAccessory(this, accessory, device);
            if (fa.isValid) {
                // link the accessory to the platform
                this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
                this.accessories.push(accessory);
                this.log.info('Adding new accessory:', device.name);
            }
        }
    }
    removeAccessory(accessory) {
        this.log.info('Remove accessory: ', accessory.displayName);
        this.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
        this.accessories.forEach((element, index) => {
            if (element.UUID === accessory.uuid) {
                this.accessories.splice(index, 1);
            }
        });
    }
    findServiceByName(name, service) {
        const a = this.accessories.find((accessory) => {
            const s = accessory.getService(service);
            if (s && s.displayName === name) {
                return true;
            }
            else {
                return false;
            }
        });
        if (a) {
            return a.getService(service);
        }
        else {
            return undefined;
        }
    }
    isOldApi() {
        return this.info && this.info.serialNumber &&
            (this.info.serialNumber.indexOf('HC2-') === 0 || this.info.serialNumber.indexOf('HCL-') === 0);
    }
}
exports.FibaroHC = FibaroHC;
//# sourceMappingURL=platform.js.map