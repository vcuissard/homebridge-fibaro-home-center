"use strict";
//    Copyright 2021 ilcato
//
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FibaroAccessory = void 0;
class FibaroAccessory {
    constructor(platform, accessory, device) {
        this.platform = platform;
        this.accessory = accessory;
        this.device = device;
        this.isValid = true;
        // set accessory information
        const properties = this.device.properties || {};
        const manufacturer = (properties.zwaveCompany || 'IlCato').replace('Fibargroup', 'Fibar Group');
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, manufacturer)
            .setCharacteristic(this.platform.Characteristic.Model, `${this.device.type.length > 1 ?
            this.device.type :
            'HomeCenter Bridged Accessory'}`)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, `${properties.serialNumber || '<unknown>'}`);
        let service;
        let subtype = this.device.id + '----';
        switch (this.device.type) {
            case 'com.fibaro.multilevelSwitch':
            case 'com.fibaro.FGD212':
            case 'com.fibaro.FGWD111':
                switch (parseInt(this.device.properties.deviceControlType)) {
                    case 2: // Lighting
                    case 23: // Lighting
                        service = this.platform.Service.Lightbulb;
                        this.mainCharacteristics = [this.platform.Characteristic.On, this.platform.Characteristic.Brightness];
                        break;
                    default:
                        service = this.platform.Service.Switch;
                        this.mainCharacteristics = [this.platform.Characteristic.On];
                        break;
                }
                break;
            case 'com.fibaro.binarySwitch':
            case 'com.fibaro.developer.bxs.virtualBinarySwitch':
            case 'com.fibaro.satelOutput':
            case 'com.fibaro.FGWDS221':
                switch (parseInt(this.device.properties.deviceControlType)) {
                    case 2: // Lighting
                    case 5: // Bedside Lamp
                    case 7: // Wall Lamp
                        service = this.platform.Service.Lightbulb;
                        this.mainCharacteristics = [this.platform.Characteristic.On];
                        break;
                    case 20: // Wall Socket
                        service = this.platform.Service.Outlet;
                        this.mainCharacteristics = [this.platform.Characteristic.On, this.platform.Characteristic.OutletInUse];
                        break;
                    case 25: // Video gate open
                        service = this.platform.Service.LockMechanism;
                        subtype = device.id + '--' + 'LOCK';
                        this.mainCharacteristics = [this.platform.Characteristic.LockCurrentState, this.platform.Characteristic.LockTargetState];
                        break;
                    case 26: // valve
                        service = this.platform.Service.Valve;
                        this.mainCharacteristics = [
                            this.platform.Characteristic.Active,
                            this.platform.Characteristic.InUse,
                            this.platform.Characteristic.ValveType,
                        ];
                        break;
                    default:
                        service = this.platform.Service.Switch;
                        this.mainCharacteristics = [this.platform.Characteristic.On];
                        break;
                }
                break;
            case 'com.fibaro.baseShutter':
            case 'com.fibaro.barrier':
                service = this.platform.Service.GarageDoorOpener;
                this.mainCharacteristics =
                    [this.platform.Characteristic.CurrentDoorState,
                        this.platform.Characteristic.TargetDoorState,
                        this.platform.Characteristic.ObstructionDetected];
                break;
            case 'com.fibaro.FGR221':
            case 'com.fibaro.FGRM222':
            case 'com.fibaro.FGR223':
            case 'com.fibaro.rollerShutter':
            case 'com.fibaro.FGWR111':
            case 'com.fibaro.remoteBaseShutter':
                service = this.platform.Service.WindowCovering;
                this.mainCharacteristics = [
                    this.platform.Characteristic.CurrentPosition,
                    this.platform.Characteristic.TargetPosition,
                    this.platform.Characteristic.PositionState,
                ];
                if (parseInt(this.device.properties.deviceControlType) === 55) {
                    this.mainCharacteristics.push(this.platform.Characteristic.CurrentHorizontalTiltAngle, this.platform.Characteristic.TargetHorizontalTiltAngle);
                }
                if (this.device.type === 'com.fibaro.remoteBaseShutter') {
                    subtype = device.id + '--OPENCLOSEONLY';
                }
                break;
            case 'com.fibaro.FGMS001':
            case 'com.fibaro.FGMS001v2':
            case 'com.fibaro.motionSensor':
                service = this.platform.Service.MotionSensor;
                this.mainCharacteristics = [this.platform.Characteristic.MotionDetected];
                break;
            case 'com.fibaro.temperatureSensor':
                service = this.platform.Service.TemperatureSensor;
                this.mainCharacteristics = [this.platform.Characteristic.CurrentTemperature];
                break;
            case 'com.fibaro.humiditySensor':
                service = this.platform.Service.HumiditySensor;
                this.mainCharacteristics = [this.platform.Characteristic.CurrentRelativeHumidity];
                break;
            case 'com.fibaro.binarySensor':
            case 'com.fibaro.doorSensor':
            case 'com.fibaro.FGDW002':
            case 'com.fibaro.windowSensor':
            case 'com.fibaro.satelZone':
            case 'com.fibaro.doorWindowSensor':
                if (this.device.id === this.platform.config.doorbellDeviceId) {
                    service = this.platform.Service.Doorbell;
                    this.mainCharacteristics = [this.platform.Characteristic.ProgrammableSwitchEvent];
                }
                else {
                    service = this.platform.Service.ContactSensor;
                    this.mainCharacteristics = [this.platform.Characteristic.ContactSensorState];
                }
                break;
            case 'com.fibaro.FGFS101':
            case 'com.fibaro.floodSensor':
                service = this.platform.Service.LeakSensor;
                this.mainCharacteristics = [this.platform.Characteristic.LeakDetected];
                break;
            case 'com.fibaro.FGSS001':
            case 'com.fibaro.smokeSensor':
            case 'com.fibaro.gasDetector':
                service = this.platform.Service.SmokeSensor;
                this.mainCharacteristics = [this.platform.Characteristic.SmokeDetected];
                break;
            case 'com.fibaro.FGCD001':
                service = this.platform.Service.CarbonMonoxideSensor;
                this.mainCharacteristics =
                    [this.platform.Characteristic.CarbonMonoxideDetected,
                        this.platform.Characteristic.CarbonMonoxideLevel,
                        this.platform.Characteristic.CarbonMonoxidePeakLevel, this.platform.Characteristic.BatteryLevel];
                break;
            case 'com.fibaro.lightSensor':
                service = this.platform.Service.LightSensor;
                this.mainCharacteristics = [this.platform.Characteristic.CurrentAmbientLightLevel];
                break;
            case 'com.fibaro.multilevelSensor':
                switch (properties.deviceRole) {
                    case 'TemperatureSensor':
                        service = this.platform.Service.TemperatureSensor;
                        this.mainCharacteristics = [this.platform.Characteristic.CurrentTemperature];
                        break;
                    case 'HumiditySensor':
                        service = this.platform.Service.HumiditySensor;
                        this.mainCharacteristics = [this.platform.Characteristic.CurrentRelativeHumidity];
                        break;
                    case 'LightSensor':
                    case 'MultilevelSensor':
                        service = this.platform.Service.LightSensor;
                        this.mainCharacteristics = [this.platform.Characteristic.CurrentAmbientLightLevel];
                        break;
                    default:
                        this.isValid = false;
                        return;
                }
                break;
            case 'com.fibaro.FGWP101':
            case 'com.fibaro.FGWP102':
            case 'com.fibaro.FGWPG111':
            case 'com.fibaro.FGWOEF011':
                service = this.platform.Service.Outlet;
                this.mainCharacteristics = [this.platform.Characteristic.On, this.platform.Characteristic.OutletInUse];
                break;
            case 'com.fibaro.doorLock':
            case 'com.fibaro.gerda':
                service = this.platform.Service.LockMechanism;
                this.mainCharacteristics = [this.platform.Characteristic.LockCurrentState, this.platform.Characteristic.LockTargetState];
                break;
            case 'com.fibaro.FGRGBW441M':
            case 'com.fibaro.colorController':
            case 'com.fibaro.FGRGBW442':
            case 'com.fibaro.FGRGBW442CC':
                service = this.platform.Service.Lightbulb;
                this.mainCharacteristics =
                    [this.platform.Characteristic.On,
                        this.platform.Characteristic.Brightness,
                        this.platform.Characteristic.Hue,
                        this.platform.Characteristic.Saturation];
                break;
            case 'securitySystem':
                service = this.platform.Service.SecuritySystem;
                this.mainCharacteristics =
                    [this.platform.Characteristic.SecuritySystemCurrentState,
                        this.platform.Characteristic.SecuritySystemTargetState];
                subtype = '0--';
                break;
            case 'scene':
                service = this.platform.Service.Switch;
                this.mainCharacteristics = [this.platform.Characteristic.On];
                subtype = device.id + '--SC';
                break;
            case 'climateZone':
                service = this.platform.Service.Thermostat;
                this.mainCharacteristics =
                    [this.platform.Characteristic.CurrentTemperature,
                        this.platform.Characteristic.TargetTemperature,
                        this.platform.Characteristic.CurrentHeatingCoolingState,
                        this.platform.Characteristic.TargetHeatingCoolingState,
                        this.platform.Characteristic.TemperatureDisplayUnits];
                subtype = device.id + '--CZ';
                break;
            case 'heatingZone':
                service = this.platform.Service.Thermostat;
                this.mainCharacteristics =
                    [this.platform.Characteristic.CurrentTemperature,
                        this.platform.Characteristic.TargetTemperature,
                        this.platform.Characteristic.CurrentHeatingCoolingState,
                        this.platform.Characteristic.TargetHeatingCoolingState,
                        this.platform.Characteristic.TemperatureDisplayUnits];
                subtype = device.id + '--HZ';
                break;
            case 'G':
                service = this.platform.Service.Switch;
                this.mainCharacteristics = [this.platform.Characteristic.On];
                subtype = this.device.type + '-' + this.device.name + '-';
                break;
            case 'D':
                service = this.platform.Service.Lightbulb;
                this.mainCharacteristics = [this.platform.Characteristic.On, this.platform.Characteristic.Brightness];
                subtype = this.device.type + '-' + this.device.name + '-';
                break;
            default:
                this.isValid = false;
                return;
        }
        this.mainService = this.accessory.getService(service);
        if (!this.mainService) {
            this.mainService = this.accessory.addService(new service(this.device.name));
        }
        this.mainService.subtype = subtype;
        this.bindCharactersticsEvent(this.mainService, this.mainCharacteristics);
        if (this.device.interfaces && this.device.interfaces.includes('battery')) {
            this.batteryService = this.accessory.getService(this.platform.Service.Battery);
            if (!this.batteryService) {
                this.batteryService = this.accessory.addService(new this.platform.Service.Battery(this.device.name + ' Battery'));
            }
            if (!this.batteryService.subtype) {
                this.batteryService.subtype = this.device.id + '----';
            }
            this.batteryCharacteristics =
                [this.platform.Characteristic.BatteryLevel,
                    this.platform.Characteristic.ChargingState,
                    this.platform.Characteristic.StatusLowBattery];
            this.bindCharactersticsEvent(this.batteryService, this.batteryCharacteristics);
        }
        // Remove no more existing services
        for (let t = 0; t < this.accessory.services.length; t++) {
            const s = this.accessory.services[t];
            if (s.displayName !== this.mainService.displayName &&
                s.UUID !== this.platform.Service.AccessoryInformation.UUID &&
                s.UUID !== this.platform.Service.Battery.UUID) {
                this.accessory.removeService(s);
            }
        }
    }
    bindCharactersticsEvent(service, characteristics) {
        if (!characteristics) {
            return;
        }
        for (let i = 0; i < characteristics.length; i++) {
            const characteristic = service.getCharacteristic(characteristics[i]);
            if (characteristic.UUID === this.platform.Characteristic.CurrentAmbientLightLevel.UUID) {
                characteristic.props.maxValue = 100000;
                characteristic.props.minStep = 1;
                characteristic.props.minValue = 0;
            }
            if (characteristic.UUID === this.platform.Characteristic.CurrentTemperature.UUID) {
                characteristic.props.minValue = -50;
            }
            if (characteristic.UUID === this.platform.Characteristic.TargetTemperature.UUID) {
                characteristic.props.maxValue = 100;
            }
            if (characteristic.UUID === this.platform.Characteristic.ValveType.UUID) {
                characteristic.value = this.platform.Characteristic.ValveType.GENERIC_VALVE;
            }
            this.bindCharacteristicEvents(characteristic, service);
        }
    }
    bindCharacteristicEvents(characteristic, service) {
        if (!characteristic || !service || !service.subtype) {
            return;
        }
        const IDs = service.subtype.split('-');
        // IDs[0] is always device ID, "0" for security system and "G" for global variables switches
        // IDs[1] is reserved for the button ID for virtual devices, or the global variable name for global variable devices, otherwise is ""
        // IDs[2] is a subdevice type: "LOCK" for locks, "SC" for Scenes, "CZ" for Climate zones,
        //                             "HZ" for heating zones, "G" for global variables, "D" for dimmer global variables
        service.isVirtual = IDs[1] !== '' ? true : false;
        service.isSecuritySystem = IDs[0] === '0' ? true : false;
        service.isGlobalVariableSwitch = IDs[0] === 'G' ? true : false;
        service.isGlobalVariableDimmer = IDs[0] === 'D' ? true : false;
        service.isLockSwitch = (IDs.length >= 3 && IDs[2] === 'LOCK') ? true : false;
        service.isScene = (IDs.length >= 3 && IDs[2] === 'SC') ? true : false;
        service.isClimateZone = (IDs.length >= 3 && IDs[2] === 'CZ') ? true : false;
        service.isHeatingZone = (IDs.length >= 3 && IDs[2] === 'HZ') ? true : false;
        service.isOpenCloseOnly = (IDs.length >= 3 && IDs[2] === 'OPENCLOSEONLY') ? true : false;
        if (!service.isVirtual && !service.isScene
            && characteristic.UUID !== this.platform.Characteristic.ValveType.UUID) {
            let propertyChanged = 'value'; // subscribe to the changes of this property
            if (characteristic.UUID === this.platform.Characteristic.Hue.UUID
                || characteristic.UUID === this.platform.Characteristic.Saturation.UUID) {
                propertyChanged = 'color';
            }
            if (characteristic.UUID === this.platform.Characteristic.CurrentHeatingCoolingState.UUID ||
                characteristic.UUID === this.platform.Characteristic.TargetHeatingCoolingState.UUID) {
                propertyChanged = 'mode';
            }
            if (characteristic.UUID === this.platform.Characteristic.TargetTemperature.UUID) {
                propertyChanged = 'targettemperature';
            }
            if (service.UUID === this.platform.Service.WindowCovering.UUID
                && characteristic.UUID === this.platform.Characteristic.CurrentHorizontalTiltAngle.UUID) {
                propertyChanged = 'value2';
            }
            if (service.UUID === this.platform.Service.WindowCovering.UUID
                && characteristic.UUID === this.platform.Characteristic.TargetHorizontalTiltAngle.UUID) {
                propertyChanged = 'value2';
            }
            this.subscribeUpdate(service, characteristic, propertyChanged);
        }
        characteristic.on('set', async (value, callback, context) => {
            this.setCharacteristicValue(value, context, characteristic, service, IDs);
            callback();
        });
        characteristic.on('get', async (callback) => {
            if (characteristic.UUID === this.platform.Characteristic.Name.UUID
                || characteristic.UUID === this.platform.Characteristic.ValveType.UUID) {
                callback(undefined, characteristic.value);
                return;
            }
            if ((service.isVirtual && !service.isGlobalVariableSwitch && !service.isGlobalVariableDimmer) || service.isScene) {
                // a push button is normally off
                callback(undefined, false);
            }
            else {
                this.getCharacteristicValue(callback, characteristic, service, this.accessory, IDs);
            }
        });
    }
    async setCharacteristicValue(value, context, characteristic, service, IDs) {
        if (context !== 'fromFibaro' && context !== 'fromSetValue') {
            if (this.platform.setFunctions) {
                const setFunction = this.platform.setFunctions.setFunctionsMapping.get(characteristic.UUID);
                const platform = this.platform;
                if (setFunction && platform.poller !== undefined) {
                    await this.platform.mutex.runExclusive(async () => {
                        var _a, _b;
                        (_a = platform.poller) === null || _a === void 0 ? void 0 : _a.cancelPoll();
                        setFunction.call(platform.setFunctions, value, context, characteristic, service, IDs);
                        (_b = platform.poller) === null || _b === void 0 ? void 0 : _b.restartPoll(5000);
                    });
                }
            }
        }
    }
    async getCharacteristicValue(callback, characteristic, service, accessory, IDs) {
        this.platform.log.info('Getting value from device: ', `${IDs[0]}  parameter: ${characteristic.displayName}`);
        callback(undefined, characteristic.value);
        try {
            if (!this.platform.fibaroClient) {
                this.platform.log.error('No Fibaro client available.');
                return;
            }
            // Manage security system status
            if (service.isSecuritySystem) {
                const securitySystemStatus = (await this.platform.fibaroClient.getGlobalVariable('SecuritySystem')).body;
                if (this.platform.getFunctions) {
                    this.platform.getFunctions.getSecuritySystemState(characteristic, service, IDs, securitySystemStatus);
                }
                return;
            }
            // Manage global variable switches
            if (service.isGlobalVariableSwitch) {
                const switchStatus = (await this.platform.fibaroClient.getGlobalVariable(IDs[1])).body;
                if (this.platform.getFunctions) {
                    this.platform.getFunctions.getBool(characteristic, service, IDs, switchStatus);
                }
                return;
            }
            // Manage global variable dimmers
            if (service.isGlobalVariableDimmer) {
                const value = (await this.platform.fibaroClient.getGlobalVariable(IDs[1])).body;
                if (this.platform.getFunctions) {
                    if (characteristic.UUID === this.platform.Characteristic.Brightness.UUID) {
                        this.platform.getFunctions.getBrightness(characteristic, service, IDs, value);
                    }
                    else if (characteristic.UUID === this.platform.Characteristic.On.UUID) {
                        this.platform.getFunctions.getBool(characteristic, service, IDs, value);
                    }
                }
                return;
            }
        }
        catch (e) {
            this.platform.log.error('There was a problem getting value from Global Variables', ` - Err: ${e}`);
            return;
        }
        if (!this.platform.getFunctions) {
            return;
        }
        const getFunction = this.platform.getFunctions.getFunctionsMapping.get(characteristic.UUID);
        if (getFunction) {
            if (!this.platform.fibaroClient) {
                return;
            }
            try {
                let properties;
                if (!service.isClimateZone && !service.isHeatingZone) {
                    properties = (await this.platform.fibaroClient.getDeviceProperties(IDs[0])).body.properties;
                }
                else {
                    properties = {};
                }
                if (getFunction.function) {
                    if (this.platform.config.FibaroTemperatureUnit === 'F') {
                        if (Object.prototype.hasOwnProperty.call(properties, 'value') && characteristic.displayName === 'Current Temperature') {
                            properties.value = (properties.value - 32) * 5 / 9;
                        }
                    }
                    if (Object.prototype.hasOwnProperty.call(properties, 'dead') && properties.dead === 'true') {
                        service.dead = true;
                        this.platform.log.info('Device dead: ', `${IDs[0]}  parameter: ${characteristic.displayName}`);
                    }
                    else {
                        service.dead = false;
                        getFunction.function.call(this.platform.getFunctions, characteristic, service, IDs, properties);
                    }
                }
                else {
                    this.platform.log.error('No get function defined for: ', `${characteristic.displayName}`);
                }
            }
            catch (e) {
                service.dead = true;
                this.platform.log.error('G1 - There was a problem getting value from: ', `${IDs[0]} - Err: ${e}`);
            }
        }
    }
    subscribeUpdate(service, characteristic, propertyChanged) {
        const IDs = service.subtype.split('-');
        this.platform.updateSubscriptions.push({ 'id': IDs[0], 'service': service, 'characteristic': characteristic, 'property': propertyChanged });
    }
}
exports.FibaroAccessory = FibaroAccessory;
//# sourceMappingURL=fibaroAccessory.js.map