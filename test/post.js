require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("POST", function () {
	describe("static", function () {
		var Class;

		beforeEach(function () {
			Class = function () { };
		});

		describe("no parameters", function () {
			var stub;

			beforeEach(function () {
				stub = sinon.stub();
				
				Class.method = function () {
					stub();
				};
			});

			it("post() - with no hooks - should call function", function () {
				fnhook(Class);
				Class.method();
				stub.callCount.should.equal(1);
			});

			it("post() - with single hook - should call pre() before function", function () {
				fnhook(Class);

				Class.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(2);
			});

			it("post() - with two hooks - should call both hooks before function", function () {
				fnhook(Class);

				Class.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.post("method", function (next) {
					stub.callCount.should.equal(2);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(3);
			});
		});

		describe("with parameters", function () {
			var argument = "test";

			it("post() - with one parameter - should pass parameter to post()", function () {
				Class.method = function (arg) {
					arg.should.equal(argument);
				};

				fnhook(Class);

				Class.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(arg);
				});

				Class.method(argument);
			});

			it("post() - where method mutates parameter - should pass original parameter to post() hook", function () {
				Class.method = function (arg) {
					arg.should.equal(argument);
					arg = "changed";
				};

				fnhook(Class);

				Class.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(argument);
				});

				Class.method(argument);
			});
		});
	});
});