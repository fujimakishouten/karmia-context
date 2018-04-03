/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
let context;
const expect = require('expect.js'),
    karmia_context = require('../');


// beforeEach
beforeEach(function () {
    context = new karmia_context();
});


// Test
describe('karmia-context', function () {
    describe('set', function () {
        it('Should set parameter', function () {
            const key = 'key',
                value = 'value';
            context.set(key, value);

            expect(context.parameters[key]).to.be(value);
        });

        it('Should set object', function () {
            const parameter = {key: 'value'};
            context.set(parameter);

            expect(context.parameters[parameter.key]).to.be(parameter.value);
        });

        it('Should merge object parameters', function () {
            const parameter1 = {key1: 'value1'},
                parameter2 = {key2: 'value2'};
            context.set(parameter1);
            context.set(parameter2);

            expect(context.parameters[parameter1.key]).to.be(parameter1.value);
            expect(context.parameters[parameter2.key]).to.be(parameter2.value);
        });
    });


    describe('get', function () {
        it('Should get parameter', function () {
            const key = 'key',
                value = 'value';
            context.set(key, value);

            expect(context.get(key)).to.be(value);
        });

        it('Should get default parameter', function () {
            const key = 'key',
                default_value = 'default_value';

            expect(context.get(key, default_value)).to.be(default_value);
        });
    });

    describe('remove', function () {
        it('Should remove parameter', function () {
            const key = 'key',
                value = 'value';
            context.set(key, value);
            expect(context.get(key)).to.be(value);

            context.remove(key);
            expect(context.get(key)).to.be(undefined);
        });
    });


    describe('child', function () {
        const key = 'key',
            values = {value: 1};

        it('Should extend parameters', function () {
            context.set(key, values);

            const child_context = context.child();
            expect(child_context.get(key)).to.eql(values);
        });

        it('Should not overwrite parent parameters', function () {
            context.set(key, values);

            const child_context = context.child(),
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
                const fn = function (value1, value2) {
                    return value1 + value2;
                };

                expect(context.annotate(fn)).to.eql(['value1', 'value2']);
            });

            it('no arguments exists', function () {
                const fn = function () {
                    return 'result';
                };

                expect(context.annotate(fn)).to.eql([]);
            });
        });


        describe('invoke', function () {
            describe('Should invoke function', function () {
                it('Return result', function () {
                    const parameters = {value1: 1, value2: 2},
                        fn = function (value1, value2) {
                            return value1 + value2;
                        };

                    expect(context.invoke(fn, parameters)).to.be(parameters.value1 + parameters.value2);
                });

                it('Callback', function (done) {
                    const parameters = {value1: 1, value2: 2},
                        fn = function (value1, value2, callback) {
                            return callback(null, value1 + value2);
                        };

                    context.call(fn, parameters, function (error, result) {
                        expect(error).to.be(null);
                        expect(result).to.be(parameters.value1 + parameters.value2);

                        done();
                    });
                });
            });
        });


        describe('call', function () {
            it('Should merge context parameters', function () {
                const value1 = 1,
                    parameters = {value2: 2},
                    fn = function (value1, value2) {
                        return value1 + value2;
                    };
                context.set('value1', value1);
                expect(context.call(fn, parameters)).to.be(value1 + parameters.value2);
            });

            it('Call without parameters', function (done) {
                const fn = function (callback) {
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
                const parameters = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        callback(null, value1 + value2);
                    },
                    async_function = context.async(fn, parameters);

                async_function(function (error, result) {
                    expect(error).to.be(null);
                    expect(result).to.be(3);

                    done();
                });
            });
        });


        describe('promise', function () {
            it('Should return promise', function () {
                const parameters = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        callback(null, value1 + value2);
                    },
                    promise = context.promise(fn, parameters);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(parameters.value1 + parameters.value2);
                });
            });

            it('Should resolve', function (done) {
                const parameters = {value1: 1, value2: 2},
                    fn = function (value1, value2, callback) {
                        setTimeout(function () {
                            callback(null, value1 + value2);
                        }, 0);
                    },
                    promise = context.promise(fn, parameters);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(parameters.value1 + parameters.value2);

                    done();
                });
            });

            it('Not a callback function', function (done) {
                const parameters = {value1: 1, value2: 2},
                    fn = function (value1, value2) {
                        return Promise.resolve(value1 + value2);
                    },
                    promise = context.promise(fn, parameters);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(parameters.value1 + parameters.value2);

                    done();
                });
            });

            it('Not a promise', function (done) {
                const parameters = {value1: 1, value2: 2},
                    fn = function (value1, value2) {
                        return value1 + value2;
                    },
                    promise = context.promise(fn, parameters);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(parameters.value1 + parameters.value2);

                    done();
                });
            });

            it('Without parameters', function (done) {
                const result = 'ok',
                    fn = function () {
                        return result;
                    },
                    promise = context.promise(fn);
                expect(promise).to.be.a(Promise);
                promise.then(function (result) {
                    expect(result).to.be(result);

                    done();
                });
            });

            it('Error', function (done) {
                const code = 500,
                    message = 'TEST_EXCEPTION',
                    fn = function () {
                        const error = new Error(message);
                        error.code = code;

                        return error;
                    },
                    promise = context.promise(fn);
                expect(promise).to.be.a(Promise);
                promise.catch(function (error) {
                    expect(error.code).to.be(500);
                    expect(error.message).to.be(message);

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

