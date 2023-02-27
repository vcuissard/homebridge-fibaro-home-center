export declare class FibaroClient {
    url: string;
    host: string;
    auth: string;
    adminAuth: any;
    https: boolean;
    ca: unknown;
    status: boolean;
    constructor(url: any, host: any, username: any, password: any, log: any, adminUsername: any, adminPassword: any);
    composeURL(service: any): string;
    genericGet(service: any): Promise<any>;
    genericPost(service: any, body: any): any;
    genericPut(service: any, body: any): any;
    genericAdminPut(service: any, body: any): any;
    getInfo(): Promise<any>;
    getScenes(): Promise<any>;
    getClimateZones(): Promise<any>;
    getClimateZone(ID: any): Promise<any>;
    getHeatingZones(): Promise<any>;
    getHeatingZone(ID: any): Promise<any>;
    setClimateZoneHandTemperature(ID: any, mode: any, temperature: any, timestamp: any): any;
    setHeatingZoneHandTemperature(ID: any, temperature: any, timestamp: any): any;
    getRooms(): Promise<any>;
    getDevices(): Promise<any>;
    getDeviceProperties(ID: any): Promise<any>;
    refreshStates(lastPoll: any): Promise<any>;
    executeDeviceAction(ID: any, action: any, param: any): any;
    executeScene(ID: any, useOldApi: any): any;
    getGlobalVariable(globalVariableID: any): Promise<any>;
    setGlobalVariable(globalVariableID: any, value: any): any;
}
//# sourceMappingURL=fibaro-api.d.ts.map