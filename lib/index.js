/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true, regexp: true, unparam: true, vars: true */
'use strict';



// Variables
const events = require('events'),
      REGEXP_FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m,
      REGEXP_FN_ARG_SPLIT = /,/,
      REGEXP_FN_ARG = /^\s*(\S+?)\s*$/,
      REGEXP_STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;


/**
 * KarmiaContext
 *
 * @class
 */
class KarmiaContext extends events.EventEmitter {

    /**
     * Constructor
     *
     * @constructs KarmiaContext
     */
    constructor(options) {
        super();

        const self = this,
            callback = options.callback || ['callback', 'cb', 'done'];
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
    set(key, value) {
        const self = this;
        let parameters = {};
        if (key instanceof Object) {
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
     * @param   {*} default_value
     * @returns {*}
     */
    get(key, default_value) {
        const self = this;

        return (key in self.parameters) ? self.parameters[key] : default_value;
    }


    /**
     * Remove context parameter
     *
     * @param   {string} key
     * @returns {KarmiaContext}
     */
    remove(key) {
        const self = this;
        Reflect.deleteProperty(self.parameters, key);

        return self;
    }


    /**
     * Create child context
     *
     * @method  KarmiaContext#child
     * @returns {KarmiaContext}
     */
    child() {
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
    annotate(fn) {
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
            args[1].split(REGEXP_FN_ARG_SPLIT).forEach(function (arg) {
                arg.replace(REGEXP_FN_ARG, function (all, name) {
                    inject.push(name);
                    if (-1 < self.callback.indexOf(name)) {
                        callback = name;
                    }
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
    invoke(fn, parameters) {
        const self = this;
        parameters.context = parameters.context || self;

        const values = self.annotate(fn).map(function (key) {
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
    call(fn, parameters, callback) {
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
    async(fn, parameters) {
        const self = this;

        return function (callback) {
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
    promise(fn, parameters) {
        const self = this;

        if (undefined === fn.__callback) {
            self.annotate(fn);
        }

        if (fn.__callback) {
            return new Promise(function (resolve, reject) {
                self.call(fn, parameters, function (error, result) {
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
module.exports = function (options) {
    return new KarmiaContext(options || {});
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
