export declare class GetFunctions {
    getFunctionsMapping: any;
    getCurrentSecuritySystemStateMapping: any;
    getTargetSecuritySystemStateMapping: any;
    platform: any;
    constructor(platform: any);
    getBool(characteristic: any, service: any, IDs: any, properties: any): void;
    getFloat(characteristic: any, service: any, IDs: any, properties: any): void;
    getBrightness(characteristic: any, service: any, IDs: any, properties: any): void;
    getPositionState(characteristic: any, service: any, IDs: any, properties: any): void;
    getCurrentPosition(characteristic: any, service: any, IDs: any, properties: any): void;
    getCurrentTiltAngle(characteristic: any, service: any, IDs: any, properties: any): void;
    getCurrentTemperature(characteristic: any, service: any, IDs: any, properties: any): Promise<void>;
    getTargetTemperature(characteristic: any, service: any, IDs: any, properties: any): Promise<void>;
    getContactSensorState(characteristic: any, service: any, IDs: any, properties: any): void;
    getLeakDetected(characteristic: any, service: any, IDs: any, properties: any): void;
    getSmokeDetected(characteristic: any, service: any, IDs: any, properties: any): void;
    getCarbonMonoxideDetected(characteristic: any, service: any, IDs: any, properties: any): void;
    getCarbonMonoxideLevel(characteristic: any, service: any, IDs: any, properties: any): void;
    getCarbonMonoxidePeakLevel(characteristic: any, service: any, IDs: any, properties: any): void;
    getOutletInUse(characteristic: any, service: any, IDs: any, properties: any): void;
    getLockCurrentState(characteristic: any, service: any, IDs: any, properties: any): void;
    getCurrentHeatingCoolingState(characteristic: any, service: any, IDs: any, properties: any): Promise<void>;
    getTargetHeatingCoolingState(characteristic: any, service: any, IDs: any, properties: any): Promise<void>;
    getTemperatureDisplayUnits(characteristic: any, service: any, IDs: any, properties: any): void;
    getHue(characteristic: any, service: any, IDs: any, properties: any): void;
    getSaturation(characteristic: any, service: any, IDs: any, properties: any): void;
    getCurrentDoorState(characteristic: any, service: any, IDs: any, properties: any): void;
    getTargetDoorState(characteristic: any, service: any, IDs: any, properties: any): void;
    getObstructionDetected(characteristic: any, service: any, IDs: any, properties: any): void;
    getBatteryLevel(characteristic: any, service: any, IDs: any, properties: any): void;
    getChargingState(characteristic: any, service: any, IDs: any, properties: any): void;
    getStatusLowBattery(characteristic: any, service: any, IDs: any, properties: any): void;
    getSecuritySystemState(characteristic: any, service: any, IDs: any, securitySystemStatus: any): void;
    getActive(characteristic: any, service: any, IDs: any, properties: any): void;
    getInUse(characteristic: any, service: any, IDs: any, properties: any): void;
    getProgrammableSwitchEvent(characteristic: any, service: any, IDs: any, properties: any): void;
    updateHomeKitColorFromHomeCenter(color: any, service: any): {
        h: number;
        s: number;
        v: number;
    };
    RGBtoHSV(r: any, g: any, b: any, w: any): {
        h: number;
        s: number;
        v: number;
    };
    getBoolean(value: any): boolean;
}
//# sourceMappingURL=getFunctions.d.ts.map