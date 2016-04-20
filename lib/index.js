/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true, regexp: true, unparam: true, vars: true */
'use strict';



// Variables
const events = require('events'),
      _ = require('lodash'),
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
    constructor() {
        super();
        this.parameters = {};
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
        if (_.isObject(key)) {
            parameters = key;
        } else {
            parameters[key] = value;
        }

        return _.merge(self.parameters, parameters);
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

        return _.get(self.parameters, key, default_value);
    }


    /**
     * Remove context parameter
     *
     * @param   {string} key
     * @returns {KarmiaContext}
     */
    remove(key) {
        const self = this;
        delete self.parameters[key];

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
        child.parameters = _.merge({}, self.parameters);

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
        let inject = fn.__inject;
        if (inject) {
            return inject;
        }

        inject = [];
        if (fn.length) {
            const statement = fn.toString().replace(REGEXP_STRIP_COMMENTS, ''),
                  args = statement.match(REGEXP_FN_ARGS);
            _.forEach(args[1].split(REGEXP_FN_ARG_SPLIT), function (arg) {
                arg.replace(REGEXP_FN_ARG, function (all, name) {
                    inject.push(name);
                });
            });
        }

        fn.__inject = inject;

        return inject;
    }


    /**
     * Invoke function
     *
     * @method  KarmiaContext#invoke
     * @param   {Function} fn
     * @param   {Object} parameters
     * @param   {Function|undefined} callback
     * @returns {*}
     */
    invoke(fn, parameters, callback) {
        const self = this,
              values = [];
        parameters.context = parameters.context || self;

        _.forEach(self.annotate(fn), function (key) {
            values.push(parameters[key]);
        });

        if (_.isFunction(callback)) {
            values[values.length - 1] = callback;
        }

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
        if (_.isFunction(parameters)) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
              values = _.merge(_.merge({}, self.parameters), parameters);

        return self.invoke(fn, values, callback);
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

        return new Promise(function (resolve, reject) {
            self.call(fn, parameters, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}


// Export module
module.exports = function () {
    return new KarmiaContext();
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
