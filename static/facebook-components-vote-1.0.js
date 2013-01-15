/* Facebook Web Clients 1.0 */

var guardian = window.guardian || {};
guardian.facebook = guardian.facebook || {};

// In case we forget to take out console statements. IE becomes very unhappy when we forget. Let's not make IE unhappy
if (typeof(console) === 'undefined') {
    var console = {};
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function () {
    };
}

// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
        // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
        // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

    function Empty() {}

    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (typeof target != "function") {
                throw new TypeError("Function.prototype.bind called on incompatible " + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = target.apply(
                        this,
                        args.concat(slice.call(arguments))
                    );
                    if (Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return target.apply(
                        that,
                        args.concat(slice.call(arguments))
                    );

                }

            };
            if(target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }
            // XXX bound.length is never writable, so don't even try
            //
            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.
            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        };
    }

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
    var call = Function.prototype.call;
    var prototypeOfArray = Array.prototype;
    var prototypeOfObject = Object.prototype;
    var slice = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
    var _toString = call.bind(prototypeOfObject.toString);
    var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
    var defineGetter;
    var defineSetter;
    var lookupGetter;
    var lookupSetter;
    var supportsAccessors;
    if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
        defineGetter = call.bind(prototypeOfObject.__defineGetter__);
        defineSetter = call.bind(prototypeOfObject.__defineSetter__);
        lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
        lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    }

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
    if ([1,2].splice(0).length != 2) {
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    }

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) == undefined but should be "1"
    if ([].unshift(0) != 1) {
        var array_unshift = Array.prototype.unshift;
        Array.prototype.unshift = function() {
            array_unshift.apply(this, arguments);
            return this.length;
        };
    }

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    if (!Array.isArray) {
        Array.isArray = function isArray(obj) {
            return _toString(obj) == "[object Array]";
        };
    }

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
    var boxedString = Object("a"),
        splitString = boxedString[0] != "a" || !(0 in boxedString);

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(fun /*, thisp*/) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                thisp = arguments[1],
                i = -1,
                length = self.length >>> 0;

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(); // TODO message
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    // context
                    fun.call(thisp, self[i], i, object);
                }
            }
        };
    }

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    if (!Array.prototype.map) {
        Array.prototype.map = function map(fun /*, thisp*/) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                result = Array(length),
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self)
                    result[i] = fun.call(thisp, self[i], i, object);
            }
            return result;
        };
    }

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function filter(fun /*, thisp */) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                result = [],
                value,
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (fun.call(thisp, value, i, object)) {
                        result.push(value);
                    }
                }
            }
            return result;
        };
    }

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    if (!Array.prototype.every) {
        Array.prototype.every = function every(fun /*, thisp */) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !fun.call(thisp, self[i], i, object)) {
                    return false;
                }
            }
            return true;
        };
    }

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    if (!Array.prototype.some) {
        Array.prototype.some = function some(fun /*, thisp */) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                thisp = arguments[1];

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self && fun.call(thisp, self[i], i, object)) {
                    return true;
                }
            }
            return false;
        };
    }

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function reduce(fun /*, initial*/) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0;

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            // no value to return if no initial value and an empty array
            if (!length && arguments.length == 1) {
                throw new TypeError("reduce of empty array with no initial value");
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError("reduce of empty array with no initial value");
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = fun.call(void 0, result, self[i], i, object);
                }
            }

            return result;
        };
    }

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
            var object = toObject(this),
                self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0;

            // If no callback function or if callback is not a callable function
            if (_toString(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            // no value to return if no initial value, empty array
            if (!length && arguments.length == 1) {
                throw new TypeError("reduceRight of empty array with no initial value");
            }

            var result, i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError("reduceRight of empty array with no initial value");
                    }
                } while (true);
            }

            do {
                if (i in this) {
                    result = fun.call(void 0, result, self[i], i, object);
                }
            } while (i--);

            return result;
        };
    }

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
        Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
            var self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    toObject(this),
                length = self.length >>> 0;

            if (!length) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = toInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : Math.max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === sought) {
                    return i;
                }
            }
            return -1;
        };
    }

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
        Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
            var self = splitString && _toString(this) == "[object String]" ?
                    this.split("") :
                    toObject(this),
                length = self.length >>> 0;

            if (!length) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = Math.min(i, toInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && sought === self[i]) {
                    return i;
                }
            }
            return -1;
        };
    }

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
    if (!Object.keys) {
        // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
        var hasDontEnumBug = true,
            dontEnums = [
                "toString",
                "toLocaleString",
                "valueOf",
                "hasOwnProperty",
                "isPrototypeOf",
                "propertyIsEnumerable",
                "constructor"
            ],
            dontEnumsLength = dontEnums.length;

        for (var key in {"toString": null}) {
            hasDontEnumBug = false;
        }

        Object.keys = function keys(object) {

            if (
                (typeof object != "object" && typeof object != "function") ||
                    object === null
                ) {
                throw new TypeError("Object.keys called on a non-object");
            }

            var keys = [];
            for (var name in object) {
                if (owns(object, name)) {
                    keys.push(name);
                }
            }

            if (hasDontEnumBug) {
                for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                    var dontEnum = dontEnums[i];
                    if (owns(object, dontEnum)) {
                        keys.push(dontEnum);
                    }
                }
            }
            return keys;
        };

    }

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000,
        negativeYearString = "-000001";
    if (
        !Date.prototype.toISOString ||
            (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
        ) {
        Date.prototype.toISOString = function toISOString() {
            var result, length, value, year, month;
            if (!isFinite(this)) {
                throw new RangeError("Date.prototype.toISOString called on non-finite value.");
            }

            year = this.getUTCFullYear();

            month = this.getUTCMonth();
            // see https://github.com/kriskowal/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = (month % 12 + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            result = [month + 1, this.getUTCDate(),
                this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
            year = (
                (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
                    ("00000" + Math.abs(year))
                        .slice(0 <= year && year <= 9999 ? -4 : -6)
                );

            length = result.length;
            while (length--) {
                value = result[length];
                // pad months, days, hours, minutes, and seconds to have two
                // digits.
                if (value < 10) {
                    result[length] = "0" + value;
                }
            }
            // pad milliseconds to have three digits.
            return (
                year + "-" + result.slice(0, 2).join("-") +
                    "T" + result.slice(2).join(":") + "." +
                    ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
                );
        };
    }


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
    var dateToJSONIsSupported = false;
    try {
        dateToJSONIsSupported = (
            Date.prototype.toJSON &&
                new Date(NaN).toJSON() === null &&
                new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
                Date.prototype.toJSON.call({ // generic
                    toISOString: function () {
                        return true;
                    }
                })
            );
    } catch (e) {
    }
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be toPrimitive(O, hint Number).
            var o = Object(this),
                tv = toPrimitive(o),
                toISO;
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === "number" && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            toISO = o.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (typeof toISO != "function") {
                throw new TypeError("toISOString property is not callable");
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(o);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
    if (!Date.parse || "Date.parse is buggy") {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        Date = (function(NativeDate) {

            // Date.length === 7
            function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                if (this instanceof NativeDate) {
                    var date = length == 1 && String(Y) === Y ? // isString(Y)
                        // We explicitly pass it through parse:
                        new NativeDate(Date.parse(Y)) :
                        // We have to manually make calls depending on argument
                        // length here
                        length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                            length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                                length >= 5 ? new NativeDate(Y, M, D, h, m) :
                                    length >= 4 ? new NativeDate(Y, M, D, h) :
                                        length >= 3 ? new NativeDate(Y, M, D) :
                                            length >= 2 ? new NativeDate(Y, M) :
                                                length >= 1 ? new NativeDate(Y) :
                                                    new NativeDate();
                    // Prevent mixups with unfixed Date object
                    date.constructor = Date;
                    return date;
                }
                return NativeDate.apply(this, arguments);
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp("^" +
                "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                // 6-digit extended year
                "(?:-(\\d{2})" + // optional month capture
                "(?:-(\\d{2})" + // optional day capture
                "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                ":(\\d{2})" + // seconds capture
                "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
                "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                "([-+])" + // sign capture
                "(\\d{2})" + // hours offset capture
                ":(\\d{2})" + // minutes offset capture
                ")" +
                ")?)?)?)?" +
                "$");

            var months = [
                0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
            ];

            function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month] +
                        Math.floor((year - 1969 + t) / 4) -
                        Math.floor((year - 1901 + t) / 100) +
                        Math.floor((year - 1601 + t) / 400) +
                        365 * (year - 1970)
                    );
            }

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                Date[key] = NativeDate[key];
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            Date.now = NativeDate.now;
            Date.UTC = NativeDate.UTC;
            Date.prototype = NativeDate.prototype;
            Date.prototype.constructor = Date;

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            Date.parse = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = Number(match[1]),
                        month = Number(match[2] || 1) - 1,
                        day = Number(match[3] || 1) - 1,
                        hour = Number(match[4] || 0),
                        minute = Number(match[5] || 0),
                        second = Number(match[6] || 0),
                        millisecond = Number(match[7] || 0),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        offset = !match[4] || match[8] ?
                            0 : Number(new NativeDate(1970, 0)),
                        signOffset = match[9] === "-" ? 1 : -1,
                        hourOffset = Number(match[10] || 0),
                        minuteOffset = Number(match[11] || 0),
                        result;
                    if (
                        hour < (
                            minute > 0 || second > 0 || millisecond > 0 ?
                                24 : 25
                            ) &&
                            minute < 60 && second < 60 && millisecond < 1000 &&
                            month > -1 && month < 12 && hourOffset < 24 &&
                            minuteOffset < 60 && // detect invalid offsets
                            day > -1 &&
                            day < (
                                dayFromMonth(year, month + 1) -
                                    dayFromMonth(year, month)
                                )
                        ) {
                        result = (
                            (dayFromMonth(year, month) + day) * 24 +
                                hour +
                                hourOffset * signOffset
                            ) * 60;
                        result = (
                            (result + minute + minuteOffset * signOffset) * 60 +
                                second
                            ) * 1000 + millisecond + offset;
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };

            return Date;
        })(Date);
    }

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }


//
// String
// ======
//


// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14
// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
    if("0".split(void 0, 0).length) {
        var string_split = String.prototype.split;
        String.prototype.split = function(separator, limit) {
            if(separator === void 0 && limit === 0)return [];
            return string_split.apply(this, arguments);
        }
    }

// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    if("".substr && "0b".substr(-1) !== "b") {
        var string_substr = String.prototype.substr;
        /**
         *  Get the substring of a string
         *  @param  {integer}  start   where to start the substring
         *  @param  {integer}  length  how many characters to return
         *  @return {string}
         */
        String.prototype.substr = function(start, length) {
            return string_substr.call(
                this,
                start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
                length
            );
        }
    }

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
    var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
        "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
        "\u2029\uFEFF";
    if (!String.prototype.trim || ws.trim()) {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        ws = "[" + ws + "]";
        var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
            trimEndRegexp = new RegExp(ws + ws + "*$");
        String.prototype.trim = function trim() {
            if (this === undefined || this === null) {
                throw new TypeError("can't convert "+this+" to object");
            }
            return String(this)
                .replace(trimBeginRegexp, "")
                .replace(trimEndRegexp, "");
        };
    }

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

    function toInteger(n) {
        n = +n;
        if (n !== n) { // isNaN
            n = 0;
        } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
    }

    function isPrimitive(input) {
        var type = typeof input;
        return (
            input === null ||
                type === "undefined" ||
                type === "boolean" ||
                type === "number" ||
                type === "string"
            );
    }

    function toPrimitive(input) {
        var val, valueOf, toString;
        if (isPrimitive(input)) {
            return input;
        }
        valueOf = input.valueOf;
        if (typeof valueOf === "function") {
            val = valueOf.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        toString = input.toString;
        if (typeof toString === "function") {
            val = toString.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        throw new TypeError();
    }

// ES5 9.9
// http://es5.github.com/#x9.9
    var toObject = function (o) {
        if (o == null) { // this matches both null and undefined
            throw new TypeError("can't convert "+o+" to object");
        }
        return Object(o);
    };

});
/**
 * EventEmitter v4.0.3 - git.io/ee
 * Oliver Caldwell
 * MIT license
 */
(function(exports) {
    // JSHint config - http://www.jshint.com/
    /*jshint laxcomma:true*/
    /*global define:true*/

    // Place the script in strict mode
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class Manages event registering and emitting.
     */
    function EventEmitter(){}

    // Shortcuts to improve speed and size

    // Easy access to the prototype
    var proto = EventEmitter.prototype

    // Existence of a native indexOf
        , nativeIndexOf = Array.prototype.indexOf ? true : false;

    /**
     * Finds the index of the listener for the event in it's storage array
     *
     * @param {Function} listener Method to look for.
     * @param {Function[]} listeners Array of listeners to search through.
     * @return {Number} Index of the specified listener, -1 if not found
     */
    function indexOfListener(listener, listeners) {
        // Return the index via the native method if possible
        if(nativeIndexOf) {
            return listeners.indexOf(listener);
        }

        // There is no native method
        // Use a manual loop to find the index
        var i = listeners.length;
        while(i--) {
            // If the listener matches, return it's index
            if(listeners[i] === listener) {
                return i;
            }
        }

        // Default to returning -1
        return -1;
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     *
     * @param {String} evt Name of the event to return the listeners from.
     * @return {Function[]} All listener functions for the event.
     * @doc
     */
    proto.getListeners = function(evt) {
        // Create a shortcut to the storage object
        // Initialise it if it does not exists yet
        var events = this._events || (this._events = {});

        // Return the listener array
        // Initialise it if it does not exist
        return events[evt] || (events[evt] = []);
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     *
     * @param {String} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListener = function(evt, listener) {
        // Fetch the listeners
        var listeners = this.getListeners(evt);

        // Push the listener into the array if it is not already there
        if(indexOfListener(listener, listeners) === -1) {
            listeners.push(listener);
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of addListener
     * @doc
     */
    proto.on = proto.addListener;

    /**
     * Removes a listener function from the specified event.
     *
     * @param {String} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListener = function(evt, listener) {
        // Fetch the listeners
        // And get the index of the listener in the array
        var listeners = this.getListeners(evt)
            , index = indexOfListener(listener, listeners);

        // If the listener was found then remove it
        if(index !== -1) {
            listeners.splice(index, 1);

            // If there are no more listeners in this array then remove it
            if(listeners.length === 0) {
                this._events[evt] = null;
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of removeListener
     * @doc
     */
    proto.off = proto.removeListener;

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.addListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     *
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeListeners = function(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.manipulateListeners = function(remove, evt, listeners) {
        // Initialise any required variables
        var i
            , value
            , single = remove ? this.removeListener : this.addListener
            , multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of it's properties to this method
        if(typeof evt === 'object') {
            for(i in evt) {
                if(evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if(typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while(i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     *
     * @param {String} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.removeEvent = function(evt) {
        // Remove different things depending on the state of evt
        if(evt) {
            // Remove all listeners for the specified event
            this._events[evt] = null;
        }
        else {
            // Remove all listeners in all events
            this._events = null;
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     *
     * @param {String} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each argument.
     * @return {Object} Current instance of EventEmitter for chaining.
     * @doc
     */
    proto.emitEvent = function(evt, args) {
        // Get the listeners for the event
        // Also initialise any other required variables
        var listeners = this.getListeners(evt)
            , i = listeners.length
            , response;

        // Loop over all listeners assigned to the event
        // Apply the arguments array to each listener function
        while(i--) {
            // If the listener returns true then it shall be removed from the event
            // The function is executed either with a basic call or an apply if there is an args array
            response = args ? listeners[i].apply(null, args) : listeners[i]();
            if(response === true) {
                this.removeListener(evt, listeners[i]);
            }
        }

        // Return the instance of EventEmitter to allow chaining
        return this;
    };

    /**
     * Alias of emitEvent
     * @doc
     */
    proto.trigger = proto.emitEvent;

    exports.EventEmitter = EventEmitter;

}(this));
(function () {

    /**
     * Abbreviates the given numeric such that they never exceed four characters.
     * Small numbers (<1000) are returned as-is
     * Numbers like 3000 are rendered as 3.5K
     * Numbers beyond 5 digits are rendered like 20K, 21K, 500K
     * Numbers in millions are rendered as 1.5M, 10M, 20M.
     * @param {Number} value The value to abbreviate
     * @return {String} The formatted value
     */
    function BigNumberFormatter(value) {

        var i, l, multiplier, newValue;

        for (i = 0, l = multipliers.length; i < l; i++) {
            multiplier = multipliers[i];
            if (value >= multiplier.n) {
                newValue = value / multiplier.n;
                return newValue.toFixed(newValue < 10 ? 1 : 0) + multiplier.abbr;
            }
        }

        return value;
    }

    var multipliers = [
        {abbr: 'M', n: 1000000},
        {abbr: 'K', n: 1000}
    ];

    guardian.facebook.BigNumberFormatter = BigNumberFormatter;

})();
(function () {

    function VoteController(model, view, authorizer) {
        this.model = model;
        this.view = view;
        this.authorizer = authorizer;
    }

    VoteController.prototype.baseURI = null;
    VoteController.prototype.model = null;
    VoteController.prototype.view = null;
    VoteController.prototype.authorizer = null;

    /**
     * Initialises callbacks and makes a call to get the poll data from the server.
     * @param {String} baseURI The base URI for this and all subsequent XHR requests
     */
    VoteController.prototype.initialise = function (baseURI) {
        this.baseURI = baseURI;

        this.authorizer.onNotAuthorized.then(this.handleNotAuthorized.bind(this));
        this.authorizer.onConnected.then(this.checkExistingVote.bind(this));
        this.authorizer.onConnected.then(this.submitVoteWhenLoggedIn.bind(this));

        this.view.on("voted", this.submitVote.bind(this));
        jQuery.ajax({
            url: this.baseURI + "/poll?type=" + this.model.type,
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
            data: {
                article: this.getArticleId()
            }
        }).then(handleResponse(this.handleLoadedData.bind(this)));
    };

    VoteController.prototype.handleNotAuthorized = function () {
        this.model.setAllowedToVote(true);
    };

    VoteController.prototype.handleLoadedData = function (json) {
        this.model.setAllData(json.questions[0]);
    };

    VoteController.prototype.getArticleId = function () {
        return jQuery("meta[property='og:url']").attr("content");
    };

    VoteController.prototype.checkExistingVote = function () {

        jQuery.ajax({
            url: this.baseURI + "/user",
            type: "GET",
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller',
            data: {
                article: this.getArticleId(),
                user: this.authorizer.userId
            }
        }).then(handleResponse(this.handleUserExistingVote.bind(this)));

    };

    VoteController.prototype.handleUserExistingVote = function (user) {
        if (user.choice) {
            console.log("Controller: User has already voted for " + user.choice);
            this.model.registerVote(user.choice, false);
        } else {
            console.log("Controller: User has not voted yet");
            this.model.setAllowedToVote(true);
        }
    };

    VoteController.prototype.submitVote = function (choice) {
        this.choice = choice;
        this.authorizer.login().then(this.submitVoteWhenLoggedIn.bind(this));
    };

    VoteController.prototype.submitVoteWhenLoggedIn = function () {
        if (this.choice) {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType: 'jsonp',
                jsonpCallback: 'votecontroller',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: this.choice
                }
            }).then(handleResponse(this.handlePostResponse.bind(this, this.choice)));
        }
        this.choice = null;
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
        this.model.registerVote(choice, true);
    };

    function handleResponse(successFunction) {
        return (function (response) {
            if (response.error) {
                console.error(response.error.message);
            } else {
                successFunction(response.data)
            }
        });
    }

    guardian.facebook.VoteController = VoteController;

})();
(function () {

    function LoginButtonView(selector, authorizer, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Login button view has no element: " + selector);
        }

        this.authorizer = authorizer;
        this.model = model;

        this.render();

        this.model.on(guardian.facebook.VoteModel.DATA_CHANGED, this.render.bind(this));
        this.authorizer.getLoginStatus().then(this.render.bind(this));
        this.authorizer.onUserDataLoaded.then(this.render.bind(this));

        this.jContainer.delegate("a", "click.loginbutton", this.handleLoginClick.bind(this));
    }

    LoginButtonView.prototype.model = null;
    LoginButtonView.prototype.authorizer = null;
    LoginButtonView.prototype.jContainer = null;

    LoginButtonView.prototype.render = function () {

        var userData = this.authorizer.userData;

        if (userData) {

            var txt = userData.first_name,
                voteLabel = this.model.getVotelabel();

            if (voteLabel) {
                txt += ", your vote '" + voteLabel + "' was counted";
            } else {
                txt += ", share your opinion with your friends on Facebook";
            }

            this.jContainer.find(".message").html(txt);

            if (userData.username) {
                this.jContainer.find(".avatar")
                    .removeClass("initially-off")
                    .attr("src", "http://graph.facebook.com/" + userData.username + "/picture")
            }

        } else {
            this.jContainer.find(".message")
                .html("<a>Share your opinion with your friends on Facebook</a>")
        }
    };

    LoginButtonView.prototype.handleLoginClick = function () {
        console.log("Auth'ing user");
        this.authorizer.login();
        return false;
    };

    guardian.facebook.LoginButtonView = LoginButtonView;

})();
(function () {

    function TitleView(selector, model) {
        this.jContainer = jQuery(selector);

        if (!this.jContainer.length) {
            throw new Error("Title view has no element: " + selector);
        }

        this.model = model;
        this.render();
    }

    TitleView.prototype.model = null;
    TitleView.prototype.jContainer = null;

    TitleView.getAuthors = function () {
        return jQuery("a.contributor").map(function () {
            return jQuery(this).text();
        }).get();
    };

    TitleView.prototype.render = function () {
        var title = "";
        switch (this.model.type) {
            case guardian.facebook.VoteModel.AGREE_WITH_OPINION:
                title = "Do you agree with " + TitleView.getAuthors().join(" and ") + "?";
                break;
            case guardian.facebook.VoteModel.AGREE_WITH_HEADLINE:
                title = "Do you agree?";
                break;
        }
        this.jContainer.html(title);
    };

    guardian.facebook.TitleView = TitleView;

})();
(function () {

    /**
     * @constructor
     * @param {String} type The type of poll, eg "agree_with_opinion"
     */
    function VoteModel(type) {
        this.type = type;
        this.choice = undefined;
        this.allowedToVote = true;
        this.dataDeferred = jQuery.Deferred();
    }

    VoteModel.prototype = Object.create(EventEmitter.prototype);

    VoteModel.prototype.type = null;
    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;

    VoteModel.prototype.setAllData = function (data) {
        this.answers = data.answers;
        this.trigger(VoteModel.DATA_CHANGED);
        this.dataDeferred.resolve();
    };

    VoteModel.prototype.whenDataIsSet = function () {
        return this.dataDeferred.promise();
    };

    VoteModel.prototype.setAllowedToVote = function (allowedToVote) {
        this.allowedToVote = allowedToVote;
        this.trigger(VoteModel.DATA_CHANGED);
    };

    VoteModel.prototype.getAgree = function () {
        return this.answers && this.answers[0].count;
    };

    VoteModel.prototype.getDisagree = function () {
        return this.answers && this.answers[1].count;
    };

    VoteModel.prototype.getTotal = function () {
        return this.getAgree() + this.getDisagree();
    };

    VoteModel.prototype.getAnswerById = function (answerId) {
        return this.answers.filter(function (answer) {
            return answer.id == answerId;
        })[0];
    };

    VoteModel.prototype.registerVote = function (answerId, changeCounts) {

        this.whenDataIsSet().then(function () {
            var answer = this.getAnswerById(answerId);
            if (answer) {
                if (changeCounts === undefined || changeCounts === true) {
                    console.log("Model: Registering new vote: " + answerId);
                    answer.count++;
                } else {
                    console.log("Model: Noticing existing vote: " + answerId);
                }
                this.choice = answerId;
                this.trigger(VoteModel.DATA_CHANGED);
            } else {
                console.log("Unrecognised vote: " + answerId)
            }
        }.bind(this));

    };

    VoteModel.prototype.getVotelabel = function () {
        if (this.choice) {
            return this.getAnswerById(this.choice).label;
        } else {
            return undefined;
        }
    };

    VoteModel.prototype.canVote = function () {
        return !this.choice && this.allowedToVote;
    };

    VoteModel.prototype.getAgreePercent = function () {
        var total = this.getTotal();
        if (total) {
            return (this.getAgree() / total) * 100;
        } else {
            return VoteModel.EVEN;
        }
    };

    VoteModel.prototype.destroy = function () {
        this.removeEvent(); // remove all events
    };

    /**
     * @event
     */
    VoteModel.DATA_CHANGED = "dataChanged";

    VoteModel.EVEN = 50;

    /**
     * Type of vote when the user is asked to agree with the opinion of the author on a topic
     * @type {string}
     */
    VoteModel.AGREE_WITH_OPINION = "agree_with_opinion";

    /**
     * Type of vote when the user is asked to agree with the headline of the article (not the author's opinion on the matter)
     * @type {string}
     */
    VoteModel.AGREE_WITH_HEADLINE = "agree_with_headline";

    /**
     * Type of vote when the user is asked to consider whether the proposal is likely or not
     * @type {string}
     */
    VoteModel.THINK_LIKELY = "think_headline_likely";

    guardian.facebook.VoteModel = VoteModel;

})();
(function () {

    function VoteComponent(selector, model, donutClass, numberFormatter) {
        this.jContainer = jQuery(selector).removeClass("initially-off");
        this.model = model;
        this.numberFormatter = numberFormatter;
        this.initialise(donutClass);
    }

    VoteComponent.prototype = Object.create(EventEmitter.prototype);

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.numberFormatter = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.jContainer.html(VoteComponent.HTML);
        this.renderCallback = this.render.bind(this);
        this.model.on("dataChanged", this.renderCallback);
        this.donut = new donutClass(this.jContainer.find(".donut-container"));
        this.jContainer.delegate(".btn:not(.disabled)", "click.vote-component", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.updateButton = function (answers, index, element) {
        var answer = answers[index], jElement = jQuery(element);
        jElement.attr("data-action", answer.id);
        jElement.find(".count").html(this.numberFormatter(answer.count));
        jElement.find(".label").html(answer.label);
        if (this.model.choice) {
            jElement.removeClass("btn");
            if (answer.id == this.model.choice) {
                jElement.addClass("selected");
            } else {
                jElement.addClass("disabled");
            }
        } else {
            jElement.addClass("btn");
        }
    };

    VoteComponent.prototype.render = function () {

        this.donut.setPercent(this.model.getAgreePercent());

        this.jContainer.find(".choice")
            .each(this.updateButton.bind(this, this.model.answers));

        if (!this.animated) {
            this.animated = true;
            jQuery(".vote-component").animate({"height": "180px"});
        }
    };

    VoteComponent.prototype.handleButtonClick = function (jEvent) {
        var jTarget = jQuery(jEvent.currentTarget),
            action = jTarget.data("action");
        if (this.model.canVote()) {
            jTarget.find(".label").text("Sharing...");
            this.trigger("voted", [action]);
        }
    };

    VoteComponent.prototype.destroy = function () {
        this.model.removeEvent("dataChanged", this.renderCallback);
        this.jContainer.undelegate(".vote-component");
    };

    VoteComponent.HTML = '' +
        '<div class="vote-component">' +
        '<strong class="vote-title"></strong>' +
        '<div class="social-summary">' +
        '<img class="avatar initially-off" />' +
        '<img class="facebookIcon" src="http://facebook-web-clients.appspot.com/static/facebookIcon_16x16.gif" />' +
        '<div class="message"></div>' +
        '</div>' +
        '<div class="vote-area">' +
        '<span class="choice agree btn zone-primary-background" data-action="agree"><span class="tick">&#10004;</span><span class="label"></span><span class="count zone-primary-background"></span></span>' +
        '<div class="donut-container"></div>' +
        '<span class="choice disagree btn zone-secondary-background" data-action="disagree"><span class="count zone-secondary-background"></span><span class="label"></span><span class="tick">&#10004;</span></span>' +
        '</div>' +
        '</div>';

    guardian.facebook.VoteComponent = VoteComponent;

})();