export declare const lowestTemp = 12;
export declare const stdTemp = 21;
export declare class SetFunctions {
    setFunctionsMapping: any;
    getTargetSecuritySystemSceneMapping: any;
    platform: any;
    constructor(platform: any);
    setOn(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setBrightness(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setTargetPosition(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setTargetTiltAngle(angle: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setLockTargetState(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setTargetDoorState(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setTargetHeatingCoolingState(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setTargetTemperature(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setHue(value: any, context: any, characteristic: any, service: any, IDs: any): void;
    setSaturation(value: any, context: any, characteristic: any, service: any, IDs: any): void;
    setSecuritySystemTargetState(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    setActive(value: any, context: any, characteristic: any, service: any, IDs: any): Promise<void>;
    updateHomeCenterColorFromHomeKit(h: any, s: any, service: any, IDs: any): Promise<void>;
    HSVtoRGB(hue: any, saturation: any, value: any): {
        r: number;
        g: number;
        b: number;
        w: number;
    };
    command(c: any, value: any, service: any, IDs: any): Promise<void>;
    scene(sceneID: any): Promise<void>;
    setGlobalVariable(variableID: any, value: any): Promise<void>;
    getGlobalVariable(variableID: any): Promise<any>;
    checkLockCurrentState(IDs: any, value: any): Promise<void>;
    /***
     *  Scale the value from input range to output range as integer
     * @param num value to be scaled
     * @param in_min input value range minimum
     * @param in_max input value range maximum
     * @param out_min output value range minimum
     * @param out_max output value range maximum
     */
    static scale(num: number, in_min: number, in_max: number, out_min: number, out_max: number): number;
}
//# sourceMappingURL=setFunctions.d.ts.map