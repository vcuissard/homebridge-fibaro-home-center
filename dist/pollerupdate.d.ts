export declare class Poller {
    platform: any;
    pollingUpdateRunning: boolean;
    lastPoll: number;
    pollerPeriod: number;
    timeout: any;
    constructor(platform: any, pollerPeriod: any);
    poll(): Promise<void>;
    restartPoll(delay: any): void;
    cancelPoll(): void;
    manageValue(change: any): void;
    manageGlobalVariableDevice(param: any, type: any): Promise<void>;
    manageSecuritySystem(): Promise<void>;
    manageColor(change: any): void;
    manageOperatingMode(change: any): void;
    manageHeatingThermostatSetpoint(change: any): void;
}
//# sourceMappingURL=pollerupdate.d.ts.map