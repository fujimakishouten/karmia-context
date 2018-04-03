declare class KarmiaContext {
    callback: Array<string>;
    parameters: object;

    constructor(options?: object);
    set(key: any, value?: any): KarmiaContext;
    get(key: any, default_value?: any): any;
    remove(key: any): KarmiaContext;
    child(): KarmiaContext;
    annotate(fn: Function): Array<string>;
    invoke(fn: Function, parameters: object): any;
    call(fn: Function, parameters?: object, callback?: Function): any;
    async(fn: Function, parameters?: object): Function;
    promise(fn: Function, parameters?: object): Promise<any>;
}

export = KarmiaContext;
