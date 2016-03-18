/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true */
/*global beforeEach, describe, it */
'use strict';



// Variables
let context;
const co = require('co'),
    expect = require('expect.js');


// beforeEach
beforeEach(function () {
    context = require('../')();
});


// Test
describe('karmia-context', function () {
    describe('set', function () {
        it('Should set parameter', function () {
            var key = 'key',
                value = 'value';
            context.set(key, value);

            expect(context.parameters[key]).to.be(value);
        });

        it('Should set object', function () {
            var parameter = {key: 'value'};
            context.set(parameter);

            expect(context.parameters[parameter.key]).to.be(parameter.value);
        });

        it('Should merge object parameters', function () {
            var parameter1 = {key1: 'value1'},
                parameter2 = {key2: 'value2'};
            context.set(parameter1);
            context.set(parameter2);

            expect(context.parameters[parameter1.key]).to.be(parameter1.value);
            expect(context.parameters[parameter2.key]).to.be(parameter2.value);
        });
    });


    describe('get', function () {
        it('Should get parameter', function () {
            var key = 'key',
                value = 'value';
            context.set(key, value);

            expect(context.get(key)).to.be(value);
        });

        it('Should get default parameter', function () {
            var key = 'key',
                default_value = 'default_value';

            expect(context.get(key, default_value)).to.be(default_value);
        });
    });


    describe('child', function () {
        var key = 'key',
            values = {value: 1};

        it('Should extend parameters', function () {
            context.set(key, values);

            var child_context = context.child();
            expect(child_context.get(key)).to.eql(values);
        });

        it('Should not overwrite parent parameters', function () {
            context.set(key, values);

            var child_context = context.child(),
                new_values = child_context.get(key);
            new_values.value = 2;
            child_context.set(key, new_values);

            expect(context.get(key)).to.eql(values);
            expect(child_context.get(key)).to.eql(new_values);
        });
    });


    describe('annotate', function () {
        describe('Should annotate function', function () {
            it('arguments exists', function () {
                var fn = function (value1, value2) {
                    return value1 + value2;
                };

                expect(context.annotate(fn)).to.eql(['value1', 'value2']);
            });

            it('no arguments exists', function () {
                var fn = function () {
                    return 'result';
                };

                expect(context.annotate(fn)).to.eql([]);
            });
        });


        describe('invoke', function () {
            describe('Should invoke function', function () {
                it('Return result', function () {
                    var parameters = {value1: 1, value2: 2},
                        fn = function (value1, value2) {
                            return value1 + value2;
                        };

                    expect(context.invoke(fn, parameters)).to.be(3);
                });

                it('Callback', function (done) {
                    var parameters = {value1: 1, value2: 2},
                        fn = function (value1, value2, callback) {
                            return callback(null, value1 + value2);
                        };

                    context.call(fn, parameters, function (error, result) {
                        expect(error).to.be(null);
                        expect(result).to.be(3);

                        done();
                    });
                });
            });
        });


        describe('call', function () {
            it('Should merge context parameters', function () {
                context.set('value1', 1);
                var parameters = {value2: 2},
                    fn = function (value1, value2) {
                        return value1 + value2;
                    };

                expect(context.call(fn, parameters)).to.be(3);
            });

            it('Call without parameters', function (done) {
                var fn = function (callback) {
                    callback('ok');
                };

                context.call(fn, function (result) {
                    expect(result).to.be('ok');

                    done();
                });
            });
        });


        describe('async', function () {
            it('Should get async function', function (done) {
                var values = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        callback(null, value1 + value2);
                    },
                    async_function = context.async(fn, values);

                async_function(function (error, result) {
                    expect(error).to.be(null);
                    expect(result).to.be(3);

                    done();
                });
            });
        });


        describe('promise', function () {
            it('Should return promise', function () {
                var values = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        callback(null, value1 + value2);
                    },
                    promise = context.promise(fn, values);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(3);
                });
            });

            it('Should resolve', function (done) {
                var values = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        setTimeout(function () {
                            callback(null, value1 + value2);
                        }, 0);
                    };

                co(function* () {
                    var result = yield context.promise(fn, values);

                    expect(result).to.be(3);

                    done();
                });
            });
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

