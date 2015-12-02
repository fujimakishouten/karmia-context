/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true */
"use strict";



// Variables
var util = require('util'),
    events = require('events'),
    _ = require('lodash'),
    REGEXP_FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m,
    REGEXP_FN_ARG_SPLIT = /,/,
    REGEXP_FN_ARG = /^\s*(\S+?)\s*$/,
    REGEXP_STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

/**
 * KarmiaContext
 *
 * @constructor
 */
function KarmiaContext() {
    this.parameters = {};
}

KarmiaContext.prototype = {

    /**
     * Set context parameter
     *
     * @param {string} key
     * @param {*} value
     */
    set: function (key, value) {
        var self = this;

        self.parameters[key] = value;
    },


    /**
     * Get context parameter
     *
     * @param   {string} key
     * @param   {*} default_value
     * @returns {*}
     */
    get: function (key, default_value) {
        var self = this;

        return (key in self.parameters) ? self.parameters[key] : default_value;
    },


    /**
     * Create child context
     *
     * @returns KarmiaContext
     */
    child: function () {
        var self = this,
            child = Object.create(self);
        child.parameters = _.merge({}, self.parameters);

        return child;
    },


    /**
     * Annotate function
     *
     * @param   {Function} fn
     * @returns {Array}
     */
    annotate: function (fn) {
        var inject = fn.inject;
        if (inject) {
            return inject;
        }

        inject = [];
        if (fn.length) {
            var statement = fn.toString().replace(REGEXP_STRIP_COMMENTS, ''),
                args = statement.match(REGEXP_FN_ARGS);
            _.forEach(args[1].split(REGEXP_FN_ARG_SPLIT), function (arg) {
                arg.replace(REGEXP_FN_ARG, function (all, name) {
                    inject.push(name);
                });
            });
        }

        fn.inject = inject;

        return inject;
    },


    /**
     * Invoke function
     *
     * @param {Function} fn
     * @param {Object} parameters
     * @param {Function} callback
     */
    invoke: function (fn, parameters, callback) {
        var self = this,
            values = [];
        _.forEach(self.annotate(fn), function (key) {
            values.push(parameters[key]);
        });

        if (_.isFunction(callback)) {
            values[values.length - 1] = callback;
        }

        return fn.apply(self, values);
    },


    /**
     * Call function
     *
     * @param   {Function} fn
     * @param   {Object} parameters
     * @param   {Function|undefined} callback
     * @returns {*}
     */
    call: function (fn, parameters, callback) {
        if (_.isFunction(parameters)) {
            callback = parameters;
            parameters = {};
        }

        var self = this,
            values = _.merge(this.parameters, parameters);

        return self.invoke(fn, values, callback);
    },


    /**
     * Return async function
     *
     * @param   {Function} fn
     * @param   {Object} parameters
     * @returns {Function}
     */
    async: function (fn, parameters) {
        var self = this;

        return function (callback) {
            self.call(fn, parameters, callback);
        };
    }

};

// Extends event emitter
util.inherits(KarmiaContext, events.EventEmitter);

// Export module
var context = new KarmiaContext();
module.exports = context;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
