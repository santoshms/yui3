YUI.add('parallel-tests', function(Y) {

    var Assert = Y.Assert;

    var testCase = new Y.Test.Case({
        name: "Parallel Tests",

        test_load: function() {
            var test = this;
            Y.applyConfig({ useSync: false });
            Y.use('parallel', function() {
                test.resume(function() {
                    Assert.isFunction(Y.Parallel, 'Y.Parallel did not load');
                });
            });
            test.wait();
        },
        test_stack: function() {
            var stack = new Y.Parallel(),
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                }), 100);
            }

            stack.done(function() {
                Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(15, counter, 'Stack did not complete properly');
            });
        },
        test_results: function() {
            var stack = new Y.Parallel(),
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    return false;
                }), 100);
            }

            stack.done(function(results) {
                Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(15, counter, 'Stack did not complete properly');
                Assert.areEqual(15, results.length, 'Results array is not right');
            });
        },
        test_returns_data: function() {
            var stack = new Y.Parallel(),
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(15, counter, 'Stack did not complete properly');
                Assert.areEqual(15, results.length, 'Results array is not right');
                Assert.areEqual(0, data.length, 'Data array is not right');
            }, []);
        },
        test_nocontext: function() {
            var stack = new Y.Parallel(),
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    Assert.isFunction(this.use, 'Execution context is wrong in stack item');
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(15, counter, 'Stack did not complete properly');
                Assert.areEqual(15, results.length, 'Results array is not right');
                Assert.areEqual(0, data.length, 'Data array is not right');
                Assert.isFunction(this.use, 'Execution context is wrong in done handler');
            }, []);
        },
        test_context: function() {
            var stack = new Y.Parallel({
                context: { foo: true }
            }),
            counter = 0;

            for (var i = 1; i <= 15; i++) {
                setTimeout(stack.add(function() {
                    counter++;
                    Assert.isTrue(this.foo, 'Execution context is wrong in stack item');
                    return false;
                }), 100);
            }

            stack.done(function(results, data) {
                Assert.areEqual(15, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(15, counter, 'Stack did not complete properly');
                Assert.areEqual(15, results.length, 'Results array is not right');
                Assert.areEqual(0, data.length, 'Data array is not right');
                Assert.isTrue(this.foo, 'Execution context is wrong in done handler');
            }, []);
        },
        test_add_nofn: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback();

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual(0, data.length, 'Data array is not right');
                Assert.isFunction(this.use, 'Execution context is wrong in done handler');
            }, []);
        },
        test_add_nofn_one_arg: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback('foo');

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual('foo', results[0], 'Results is not right');
            });
        },
        test_add_nofn_two_args: function() {
            var stack = new Y.Parallel(),
                callback;

            // Calls `add()` with no args, then calls the returned callback fn.
            callback = stack.add();
            callback('foo', 'bar');

            stack.done(function(results, data) {
                Assert.areEqual(1, stack.finished, 'Stack did not complete properly');
                Assert.areEqual(1, results.length, 'Results array is not right');
                Assert.areEqual(2, results[0].length, 'Results[0] array is not right');
                Assert.areEqual('foo', results[0][0], 'Results[0][0] is not right');
                Assert.areEqual('bar', results[0][1], 'Results[0][1] is not right');
            });
        }
    });

    Y.Test.Runner.add(testCase);



});
