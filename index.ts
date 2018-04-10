/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Import modules
import events = require("events");


// Variables
const REGEXP_FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m,
    REGEXP_FN_ARG_SPLIT = /,/,
    REGEXP_FN_ARG = /^\s*(\S+?)\s*$/,
    REGEXP_STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


// Interfaces
declare interface Options {
    callback: Array<string>
}

declare interface Parameters {
    [index: string]: any
}


// Class
declare class AnnoatedFunction extends Function {
    __inject?: Array<string>;
    __callback?: string;
}


/**
 * KarmiaContext
 *
 * @class
 */
class KarmiaContext extends events.EventEmitter {
    /**
     * Properties
     */
    public callback: Array<string>;
    public parameters: Parameters;

    /**
     * Constructor
     *
     * @param {Object} [options]
     * @constructs KarmiaContext
     */
    constructor(options?: Options) {
        super();
        options = options || {} as Options;

        const self = this,
            callback = options.callback || ['callback'];
        self.callback = Array.isArray(callback) ? callback : [callback];
        self.parameters = {};
    }


    /**
     * Set context parameters
     *
     * @method  KarmiaContext#set
     * @param   {Object|string} key
     * @param   {*} value
     * @returns {Object}
     */
    set(key: Parameters|string, value?: any): Parameters {
        const self = this;
        let parameters = {} as Parameters;
        if ('object' === typeof key) {
            parameters = key;
        } else {
            parameters[key] = value;
        }

        return Object.assign(self.parameters, parameters);
    }


    /**
     * Get context parameter
     *
     * @method  KarmiaContext#get
     * @param   {string} key
     * @param   {*} [default_value]
     * @returns {*}
     */
    get(key: string, default_value?: any) {
        const self = this;

        return (key in self.parameters) ? self.parameters[key] : default_value;
    }


    /**
     * Remove context parameter
     *
     * @param   {string} key
     * @returns {Object}
     */
    remove(key: string): KarmiaContext {
        const self = this;
        delete self.parameters[key];

        return self;
    }


    /**
     * Create child context
     *
     * @method  KarmiaContext#child
     * @returns {Object}
     */
    child(): KarmiaContext {
        const self = this,
            child = Object.create(self);
        child.parameters = Object.assign({}, self.parameters);

        return child;
    }


    /**
     * Annotate function
     *
     * @method  KarmiaContext#annotate
     * @param   {Function} fn
     * @returns {Array}
     */
    annotate(fn: AnnoatedFunction): Array<string> {
        const self = this;
        let inject = fn.__inject,
            callback = fn.__callback || '';
        if (inject) {
            return inject;
        }

        inject = [];
        if (fn.length) {
            const statement = fn.toString().replace(REGEXP_STRIP_COMMENTS, ''),
                args = statement.match(REGEXP_FN_ARGS);
            args[1].split(REGEXP_FN_ARG_SPLIT).forEach(function (arg: string): void {
                arg.replace(REGEXP_FN_ARG, function (all: string, name: string): string {
                    inject.push(name);
                    if (-1 < self.callback.indexOf(name)) {
                        callback = name;
                    }

                    return name;
                });
            });
        }

        fn.__inject = inject;
        fn.__callback = callback;

        return inject;
    }


    /**
     * Invoke function
     *
     * @method  KarmiaContext#invoke
     * @param   {Function} fn
     * @param   {Object} parameters
     * @returns {*}
     */
    invoke(fn: Function, parameters?: Parameters) {
        const self = this;
        parameters.context = parameters.context || self;

        const values = self.annotate(fn as AnnoatedFunction).map(function (key) {
            return parameters[key];
        });

        return fn.apply(self, values);
    }


    /**
     * Call function
     *
     * @param   {Function} fn
     * @param   {Function|Object} parameters
     * @param   {Function|undefined} callback
     * @returns {*}
     */
    call(fn: AnnoatedFunction, parameters?: Parameters, callback?: Parameters|Function) {
        if (parameters instanceof Function) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
            values = Object.assign(Object.assign({}, self.parameters), parameters);
        self.callback.forEach(function (key) {
            values[key] = callback;
        });

        return self.invoke(fn, values);
    }


    /**
     * Return async function
     *
     * @param   {Function} fn
     * @param   {Object} parameters
     * @returns {Function}
     */
    async(fn: AnnoatedFunction, parameters?: Parameters) {
        const self = this;

        return function (callback?: (error: Error, result: any) => void) {
            self.call(fn, parameters, callback);
        };
    }


    /**
     * Return promise
     *
     * @param   {Function} fn
     * @param   {Object} parameters
     * @returns {Promise}
     */
    promise(fn: AnnoatedFunction, parameters?: Parameters) {
        const self = this;

        if (undefined === fn.__callback) {
            self.annotate(fn);
        }

        if (fn.__callback) {
            return new Promise(function (resolve, reject) {
                self.call(fn, parameters, function (error: Error, result: any) {
                    return (error) ? reject(error) : resolve(result);
                });
            });
        }

        const result = self.call(fn, parameters);
        if (result instanceof Promise) {
            return result;
        }

        return (result instanceof Error) ? Promise.reject(result) : Promise.resolve(result);
    }
}


// Export module
export = KarmiaContext;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
