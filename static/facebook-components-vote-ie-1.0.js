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
if (typeof Object.create === 'undefined') {
  Object.create = function (o) {
    function F() {};
    F.prototype = o;
    return new F();
  };
}

// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns are not implemented.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

    (function() {

        // alias some functions to make (compiled) code shorter
        var m = Math;
        var mr = m.round;
        var ms = m.sin;
        var mc = m.cos;
        var abs = m.abs;
        var sqrt = m.sqrt;

        // this is used for sub pixel precision
        var Z = 10;
        var Z2 = Z / 2;

        /**
         * This funtion is assigned to the <canvas> elements as element.getContext().
         * @this {HTMLElement}
         * @return {CanvasRenderingContext2D_}
         */
        function getContext() {
            return this.context_ ||
                (this.context_ = new CanvasRenderingContext2D_(this));
        }

        var slice = Array.prototype.slice;

        /**
         * Binds a function to an object. The returned function will always use the
         * passed in {@code obj} as {@code this}.
         *
         * Example:
         *
         *   g = bind(f, obj, a, b)
         *   g(c, d) // will do f.call(obj, a, b, c, d)
         *
         * @param {Function} f The function to bind the object to
         * @param {Object} obj The object that should act as this when the function
         *     is called
         * @param {*} var_args Rest arguments that will be used as the initial
         *     arguments when the function is called
         * @return {Function} A new function that has bound this
         */
        function bind(f, obj, var_args) {
            var a = slice.call(arguments, 2);
            return function() {
                return f.apply(obj, a.concat(slice.call(arguments)));
            };
        }

        var G_vmlCanvasManager_ = {
            init: function(opt_doc) {
                if (/MSIE/.test(navigator.userAgent) && !window.opera) {
                    var doc = opt_doc || document;
                    // Create a dummy element so that IE will allow canvas elements to be
                    // recognized.
                    doc.createElement('canvas');
                    doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
                }
            },

            init_: function(doc) {
                // create xmlns
                if (!doc.namespaces['g_vml_']) {
                    doc.namespaces.add('g_vml_', 'urn:schemas-microsoft-com:vml',
                        '#default#VML');

                }
                if (!doc.namespaces['g_o_']) {
                    doc.namespaces.add('g_o_', 'urn:schemas-microsoft-com:office:office',
                        '#default#VML');
                }

                // Setup default CSS.  Only add one style sheet per document
                if (!doc.styleSheets['ex_canvas_']) {
                    var ss = doc.createStyleSheet();
                    ss.owningElement.id = 'ex_canvas_';
                    ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
                        // default size is 300x150 in Gecko and Opera
                        'text-align:left;width:300px;height:150px}' +
                        'g_vml_\\:*{behavior:url(#default#VML)}' +
                        'g_o_\\:*{behavior:url(#default#VML)}';

                }

                // find all canvas elements
                var els = doc.getElementsByTagName('canvas');
                for (var i = 0; i < els.length; i++) {
                    this.initElement(els[i]);
                }
            },

            /**
             * Public initializes a canvas element so that it can be used as canvas
             * element from now on. This is called automatically before the page is
             * loaded but if you are creating elements using createElement you need to
             * make sure this is called on the element.
             * @param {HTMLElement} el The canvas element to initialize.
             * @return {HTMLElement} the element that was created.
             */
            initElement: function(el) {
                if (!el.getContext) {

                    el.getContext = getContext;

                    // Remove fallback content. There is no way to hide text nodes so we
                    // just remove all childNodes. We could hide all elements and remove
                    // text nodes but who really cares about the fallback content.
                    el.innerHTML = '';

                    // do not use inline function because that will leak memory
                    el.attachEvent('onpropertychange', onPropertyChange);
                    el.attachEvent('onresize', onResize);

                    var attrs = el.attributes;
                    if (attrs.width && attrs.width.specified) {
                        // TODO: use runtimeStyle and coordsize
                        // el.getContext().setWidth_(attrs.width.nodeValue);
                        el.style.width = attrs.width.nodeValue + 'px';
                    } else {
                        el.width = el.clientWidth;
                    }
                    if (attrs.height && attrs.height.specified) {
                        // TODO: use runtimeStyle and coordsize
                        // el.getContext().setHeight_(attrs.height.nodeValue);
                        el.style.height = attrs.height.nodeValue + 'px';
                    } else {
                        el.height = el.clientHeight;
                    }
                    //el.getContext().setCoordsize_()
                }
                return el;
            }
        };

        function onPropertyChange(e) {
            var el = e.srcElement;

            switch (e.propertyName) {
                case 'width':
                    el.style.width = el.attributes.width.nodeValue + 'px';
                    el.getContext().clearRect();
                    break;
                case 'height':
                    el.style.height = el.attributes.height.nodeValue + 'px';
                    el.getContext().clearRect();
                    break;
            }
        }

        function onResize(e) {
            var el = e.srcElement;
            if (el.firstChild) {
                el.firstChild.style.width =  el.clientWidth + 'px';
                el.firstChild.style.height = el.clientHeight + 'px';
            }
        }

        G_vmlCanvasManager_.init();

        // precompute "00" to "FF"
        var dec2hex = [];
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
            }
        }

        function createMatrixIdentity() {
            return [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
        }

        function matrixMultiply(m1, m2) {
            var result = createMatrixIdentity();

            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    var sum = 0;

                    for (var z = 0; z < 3; z++) {
                        sum += m1[x][z] * m2[z][y];
                    }

                    result[x][y] = sum;
                }
            }
            return result;
        }

        function copyState(o1, o2) {
            o2.fillStyle     = o1.fillStyle;
            o2.lineCap       = o1.lineCap;
            o2.lineJoin      = o1.lineJoin;
            o2.lineWidth     = o1.lineWidth;
            o2.miterLimit    = o1.miterLimit;
            o2.shadowBlur    = o1.shadowBlur;
            o2.shadowColor   = o1.shadowColor;
            o2.shadowOffsetX = o1.shadowOffsetX;
            o2.shadowOffsetY = o1.shadowOffsetY;
            o2.strokeStyle   = o1.strokeStyle;
            o2.globalAlpha   = o1.globalAlpha;
            o2.arcScaleX_    = o1.arcScaleX_;
            o2.arcScaleY_    = o1.arcScaleY_;
            o2.lineScale_    = o1.lineScale_;
        }

        function processStyle(styleString) {
            var str, alpha = 1;

            styleString = String(styleString);
            if (styleString.substring(0, 3) == 'rgb') {
                var start = styleString.indexOf('(', 3);
                var end = styleString.indexOf(')', start + 1);
                var guts = styleString.substring(start + 1, end).split(',');

                str = '#';
                for (var i = 0; i < 3; i++) {
                    str += dec2hex[Number(guts[i])];
                }

                if (guts.length == 4 && styleString.substr(3, 1) == 'a') {
                    alpha = guts[3];
                }
            } else {
                str = styleString;
            }

            return {color: str, alpha: alpha};
        }

        function processLineCap(lineCap) {
            switch (lineCap) {
                case 'butt':
                    return 'flat';
                case 'round':
                    return 'round';
                case 'square':
                default:
                    return 'square';
            }
        }

        /**
         * This class implements CanvasRenderingContext2D interface as described by
         * the WHATWG.
         * @param {HTMLElement} surfaceElement The element that the 2D context should
         * be associated with
         */
        function CanvasRenderingContext2D_(surfaceElement) {
            this.m_ = createMatrixIdentity();

            this.mStack_ = [];
            this.aStack_ = [];
            this.currentPath_ = [];

            // Canvas context properties
            this.strokeStyle = '#000';
            this.fillStyle = '#000';

            this.lineWidth = 1;
            this.lineJoin = 'miter';
            this.lineCap = 'butt';
            this.miterLimit = Z * 1;
            this.globalAlpha = 1;
            this.canvas = surfaceElement;

            var el = surfaceElement.ownerDocument.createElement('div');
            el.style.width =  surfaceElement.clientWidth + 'px';
            el.style.height = surfaceElement.clientHeight + 'px';
            el.style.overflow = 'hidden';
            el.style.position = 'absolute';
            surfaceElement.appendChild(el);

            this.element_ = el;
            this.arcScaleX_ = 1;
            this.arcScaleY_ = 1;
            this.lineScale_ = 1;
        }

        var contextPrototype = CanvasRenderingContext2D_.prototype;
        contextPrototype.clearRect = function() {
            this.element_.innerHTML = '';
        };

        contextPrototype.beginPath = function() {
            // TODO: Branch current matrix so that save/restore has no effect
            //       as per safari docs.
            this.currentPath_ = [];
        };

        contextPrototype.moveTo = function(aX, aY) {
            var p = this.getCoords_(aX, aY);
            this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };

        contextPrototype.lineTo = function(aX, aY) {
            var p = this.getCoords_(aX, aY);
            this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

            this.currentX_ = p.x;
            this.currentY_ = p.y;
        };

        contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                                  aCP2x, aCP2y,
                                                  aX, aY) {
            var p = this.getCoords_(aX, aY);
            var cp1 = this.getCoords_(aCP1x, aCP1y);
            var cp2 = this.getCoords_(aCP2x, aCP2y);
            bezierCurveTo(this, cp1, cp2, p);
        };

        // Helper function that takes the already fixed cordinates.
        function bezierCurveTo(self, cp1, cp2, p) {
            self.currentPath_.push({
                type: 'bezierCurveTo',
                cp1x: cp1.x,
                cp1y: cp1.y,
                cp2x: cp2.x,
                cp2y: cp2.y,
                x: p.x,
                y: p.y
            });
            self.currentX_ = p.x;
            self.currentY_ = p.y;
        }

        contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
            // the following is lifted almost directly from
            // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

            var cp = this.getCoords_(aCPx, aCPy);
            var p = this.getCoords_(aX, aY);

            var cp1 = {
                x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
                y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
            };
            var cp2 = {
                x: cp1.x + (p.x - this.currentX_) / 3.0,
                y: cp1.y + (p.y - this.currentY_) / 3.0
            };

            bezierCurveTo(this, cp1, cp2, p);
        };

        contextPrototype.arc = function(aX, aY, aRadius,
                                        aStartAngle, aEndAngle, aClockwise) {
            aRadius *= Z;
            var arcType = aClockwise ? 'at' : 'wa';

            var xStart = aX + mc(aStartAngle) * aRadius - Z2;
            var yStart = aY + ms(aStartAngle) * aRadius - Z2;

            var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
            var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

            // IE won't render arches drawn counter clockwise if xStart == xEnd.
            if (xStart == xEnd && !aClockwise) {
                xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                // that can be represented in binary
            }

            var p = this.getCoords_(aX, aY);
            var pStart = this.getCoords_(xStart, yStart);
            var pEnd = this.getCoords_(xEnd, yEnd);

            this.currentPath_.push({type: arcType,
                x: p.x,
                y: p.y,
                radius: aRadius,
                xStart: pStart.x,
                yStart: pStart.y,
                xEnd: pEnd.x,
                yEnd: pEnd.y});

        };

        contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
        };

        contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
            var oldPath = this.currentPath_;
            this.beginPath();

            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
            this.stroke();

            this.currentPath_ = oldPath;
        };

        contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
            var oldPath = this.currentPath_;
            this.beginPath();

            this.moveTo(aX, aY);
            this.lineTo(aX + aWidth, aY);
            this.lineTo(aX + aWidth, aY + aHeight);
            this.lineTo(aX, aY + aHeight);
            this.closePath();
            this.fill();

            this.currentPath_ = oldPath;
        };

        contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
            var gradient = new CanvasGradient_('gradient');
            gradient.x0_ = aX0;
            gradient.y0_ = aY0;
            gradient.x1_ = aX1;
            gradient.y1_ = aY1;
            return gradient;
        };

        contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                         aX1, aY1, aR1) {
            var gradient = new CanvasGradient_('gradientradial');
            gradient.x0_ = aX0;
            gradient.y0_ = aY0;
            gradient.r0_ = aR0;
            gradient.x1_ = aX1;
            gradient.y1_ = aY1;
            gradient.r1_ = aR1;
            return gradient;
        };

        contextPrototype.drawImage = function(image, var_args) {
            var dx, dy, dw, dh, sx, sy, sw, sh;

            // to find the original width we overide the width and height
            var oldRuntimeWidth = image.runtimeStyle.width;
            var oldRuntimeHeight = image.runtimeStyle.height;
            image.runtimeStyle.width = 'auto';
            image.runtimeStyle.height = 'auto';

            // get the original size
            var w = image.width;
            var h = image.height;

            // and remove overides
            image.runtimeStyle.width = oldRuntimeWidth;
            image.runtimeStyle.height = oldRuntimeHeight;

            if (arguments.length == 3) {
                dx = arguments[1];
                dy = arguments[2];
                sx = sy = 0;
                sw = dw = w;
                sh = dh = h;
            } else if (arguments.length == 5) {
                dx = arguments[1];
                dy = arguments[2];
                dw = arguments[3];
                dh = arguments[4];
                sx = sy = 0;
                sw = w;
                sh = h;
            } else if (arguments.length == 9) {
                sx = arguments[1];
                sy = arguments[2];
                sw = arguments[3];
                sh = arguments[4];
                dx = arguments[5];
                dy = arguments[6];
                dw = arguments[7];
                dh = arguments[8];
            } else {
                throw Error('Invalid number of arguments');
            }

            var d = this.getCoords_(dx, dy);

            var w2 = sw / 2;
            var h2 = sh / 2;

            var vmlStr = [];

            var W = 10;
            var H = 10;

            // For some reason that I've now forgotten, using divs didn't work
            vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

            // If filters are necessary (rotation exists), create them
            // filters are bog-slow, so only create them if abbsolutely necessary
            // The following check doesn't account for skews (which don't exist
            // in the canvas spec (yet) anyway.

            if (this.m_[0][0] != 1 || this.m_[0][1]) {
                var filter = [];

                // Note the 12/21 reversal
                filter.push('M11=', this.m_[0][0], ',',
                    'M12=', this.m_[1][0], ',',
                    'M21=', this.m_[0][1], ',',
                    'M22=', this.m_[1][1], ',',
                    'Dx=', mr(d.x / Z), ',',
                    'Dy=', mr(d.y / Z), '');

                // Bounding box calculation (need to minimize displayed area so that
                // filters don't waste time on unused pixels.
                var max = d;
                var c2 = this.getCoords_(dx + dw, dy);
                var c3 = this.getCoords_(dx, dy + dh);
                var c4 = this.getCoords_(dx + dw, dy + dh);

                max.x = m.max(max.x, c2.x, c3.x, c4.x);
                max.y = m.max(max.y, c2.y, c3.y, c4.y);

                vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                    'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                    filter.join(''), ", sizingmethod='clip');")
            } else {
                vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
            }

            vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px;"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

            this.element_.insertAdjacentHTML('BeforeEnd',
                vmlStr.join(''));
        };

        contextPrototype.stroke = function(aFill) {
            var lineStr = [];
            var lineOpen = false;
            var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
            var color = a.color;
            var opacity = a.alpha * this.globalAlpha;

            var W = 10;
            var H = 10;

            lineStr.push('<g_vml_:shape',
                ' filled="', !!aFill, '"',
                ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                ' stroked="', !aFill, '"',
                ' path="');

            var newSeq = false;
            var min = {x: null, y: null};
            var max = {x: null, y: null};

            for (var i = 0; i < this.currentPath_.length; i++) {
                var p = this.currentPath_[i];
                var c;

                switch (p.type) {
                    case 'moveTo':
                        c = p;
                        lineStr.push(' m ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'lineTo':
                        lineStr.push(' l ', mr(p.x), ',', mr(p.y));
                        break;
                    case 'close':
                        lineStr.push(' x ');
                        p = null;
                        break;
                    case 'bezierCurveTo':
                        lineStr.push(' c ',
                            mr(p.cp1x), ',', mr(p.cp1y), ',',
                            mr(p.cp2x), ',', mr(p.cp2y), ',',
                            mr(p.x), ',', mr(p.y));
                        break;
                    case 'at':
                    case 'wa':
                        lineStr.push(' ', p.type, ' ',
                            mr(p.x - this.arcScaleX_ * p.radius), ',',
                            mr(p.y - this.arcScaleY_ * p.radius), ' ',
                            mr(p.x + this.arcScaleX_ * p.radius), ',',
                            mr(p.y + this.arcScaleY_ * p.radius), ' ',
                            mr(p.xStart), ',', mr(p.yStart), ' ',
                            mr(p.xEnd), ',', mr(p.yEnd));
                        break;
                }


                // TODO: Following is broken for curves due to
                //       move to proper paths.

                // Figure out dimensions so we can do gradient fills
                // properly
                if (p) {
                    if (min.x == null || p.x < min.x) {
                        min.x = p.x;
                    }
                    if (max.x == null || p.x > max.x) {
                        max.x = p.x;
                    }
                    if (min.y == null || p.y < min.y) {
                        min.y = p.y;
                    }
                    if (max.y == null || p.y > max.y) {
                        max.y = p.y;
                    }
                }
            }
            lineStr.push(' ">');

            if (!aFill) {
                var lineWidth = this.lineScale_ * this.lineWidth;

                // VML cannot correctly render a line if the width is less than 1px.
                // In that case, we dilute the color to make the line look thinner.
                if (lineWidth < 1) {
                    opacity *= lineWidth;
                }

                lineStr.push(
                    '<g_vml_:stroke',
                    ' opacity="', opacity, '"',
                    ' joinstyle="', this.lineJoin, '"',
                    ' miterlimit="', this.miterLimit, '"',
                    ' endcap="', processLineCap(this.lineCap), '"',
                    ' weight="', lineWidth, 'px"',
                    ' color="', color, '" />'
                );
            } else if (typeof this.fillStyle == 'object') {
                var fillStyle = this.fillStyle;
                var angle = 0;
                var focus = {x: 0, y: 0};

                // additional offset
                var shift = 0;
                // scale factor for offset
                var expansion = 1;

                if (fillStyle.type_ == 'gradient') {
                    var x0 = fillStyle.x0_ / this.arcScaleX_;
                    var y0 = fillStyle.y0_ / this.arcScaleY_;
                    var x1 = fillStyle.x1_ / this.arcScaleX_;
                    var y1 = fillStyle.y1_ / this.arcScaleY_;
                    var p0 = this.getCoords_(x0, y0);
                    var p1 = this.getCoords_(x1, y1);
                    var dx = p1.x - p0.x;
                    var dy = p1.y - p0.y;
                    angle = Math.atan2(dx, dy) * 180 / Math.PI;

                    // The angle should be a non-negative number.
                    if (angle < 0) {
                        angle += 360;
                    }

                    // Very small angles produce an unexpected result because they are
                    // converted to a scientific notation string.
                    if (angle < 1e-6) {
                        angle = 0;
                    }
                } else {
                    var p0 = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
                    var width  = max.x - min.x;
                    var height = max.y - min.y;
                    focus = {
                        x: (p0.x - min.x) / width,
                        y: (p0.y - min.y) / height
                    };

                    width  /= this.arcScaleX_ * Z;
                    height /= this.arcScaleY_ * Z;
                    var dimension = m.max(width, height);
                    shift = 2 * fillStyle.r0_ / dimension;
                    expansion = 2 * fillStyle.r1_ / dimension - shift;
                }

                // We need to sort the color stops in ascending order by offset,
                // otherwise IE won't interpret it correctly.
                var stops = fillStyle.colors_;
                stops.sort(function(cs1, cs2) {
                    return cs1.offset - cs2.offset;
                });

                var length = stops.length;
                var color1 = stops[0].color;
                var color2 = stops[length - 1].color;
                var opacity1 = stops[0].alpha * this.globalAlpha;
                var opacity2 = stops[length - 1].alpha * this.globalAlpha;

                var colors = [];
                for (var i = 0; i < length; i++) {
                    var stop = stops[i];
                    colors.push(stop.offset * expansion + shift + ' ' + stop.color);
                }

                // When colors attribute is used, the meanings of opacity and o:opacity2
                // are reversed.
                lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                    ' method="none" focus="100%"',
                    ' color="', color1, '"',
                    ' color2="', color2, '"',
                    ' colors="', colors.join(','), '"',
                    ' opacity="', opacity2, '"',
                    ' g_o_:opacity2="', opacity1, '"',
                    ' angle="', angle, '"',
                    ' focusposition="', focus.x, ',', focus.y, '" />');
            } else {
                lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                    '" />');
            }

            lineStr.push('</g_vml_:shape>');

            this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
        };

        contextPrototype.fill = function() {
            this.stroke(true);
        }

        contextPrototype.closePath = function() {
            this.currentPath_.push({type: 'close'});
        };

        /**
         * @private
         */
        contextPrototype.getCoords_ = function(aX, aY) {
            var m = this.m_;
            return {
                x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
                y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
            }
        };

        contextPrototype.save = function() {
            var o = {};
            copyState(this, o);
            this.aStack_.push(o);
            this.mStack_.push(this.m_);
            this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
        };

        contextPrototype.restore = function() {
            copyState(this.aStack_.pop(), this);
            this.m_ = this.mStack_.pop();
        };

        function matrixIsFinite(m) {
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 2; k++) {
                    if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
                        return false;
                    }
                }
            }
            return true;
        }

        function setM(ctx, m, updateLineScale) {
            if (!matrixIsFinite(m)) {
                return;
            }
            ctx.m_ = m;

            if (updateLineScale) {
                // Get the line scale.
                // Determinant of this.m_ means how much the area is enlarged by the
                // transformation. So its square root can be used as a scale factor
                // for width.
                var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
                ctx.lineScale_ = sqrt(abs(det));
            }
        }

        contextPrototype.translate = function(aX, aY) {
            var m1 = [
                [1,  0,  0],
                [0,  1,  0],
                [aX, aY, 1]
            ];

            setM(this, matrixMultiply(m1, this.m_), false);
        };

        contextPrototype.rotate = function(aRot) {
            var c = mc(aRot);
            var s = ms(aRot);

            var m1 = [
                [c,  s, 0],
                [-s, c, 0],
                [0,  0, 1]
            ];

            setM(this, matrixMultiply(m1, this.m_), false);
        };

        contextPrototype.scale = function(aX, aY) {
            this.arcScaleX_ *= aX;
            this.arcScaleY_ *= aY;
            var m1 = [
                [aX, 0,  0],
                [0,  aY, 0],
                [0,  0,  1]
            ];

            setM(this, matrixMultiply(m1, this.m_), true);
        };

        contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
            var m1 = [
                [m11, m12, 0],
                [m21, m22, 0],
                [dx,  dy,  1]
            ];

            setM(this, matrixMultiply(m1, this.m_), true);
        };

        contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
            var m = [
                [m11, m12, 0],
                [m21, m22, 0],
                [dx,  dy,  1]
            ];

            setM(this, m, true);
        };

        /******** STUBS ********/
        contextPrototype.clip = function() {
            // TODO: Implement
        };

        contextPrototype.arcTo = function() {
            // TODO: Implement
        };

        contextPrototype.createPattern = function() {
            return new CanvasPattern_;
        };

        // Gradient / Pattern Stubs
        function CanvasGradient_(aType) {
            this.type_ = aType;
            this.x0_ = 0;
            this.y0_ = 0;
            this.r0_ = 0;
            this.x1_ = 0;
            this.y1_ = 0;
            this.r1_ = 0;
            this.colors_ = [];
        }

        CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
            aColor = processStyle(aColor);
            this.colors_.push({offset: aOffset,
                color: aColor.color,
                alpha: aColor.alpha});
        };

        function CanvasPattern_() {}

        // set up externs
        G_vmlCanvasManager = G_vmlCanvasManager_;
        CanvasRenderingContext2D = CanvasRenderingContext2D_;
        CanvasGradient = CanvasGradient_;
        CanvasPattern = CanvasPattern_;

    })();

} // if
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

        this.model.on("voted", this.submitVote.bind(this));

        jQuery.ajax({
            url: this.baseURI + "/poll?type=" + this.model.type,
            dataType: 'jsonp',
            jsonpCallback: 'votecontroller_initialise',
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
            jsonpCallback: 'votecontroller_existingvotecheck',
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
        this.model.submittedChoice = choice;
        this.authorizer.login().then(this.submitVoteWhenLoggedIn.bind(this));
        this.authorizer.cancelledLogin.then(this.cancelVoteSubmission.bind(this));
    };

    VoteController.prototype.cancelVoteSubmission = function () {
        this.model.submittedChoice = null;
        this.view.render();
    };

    VoteController.prototype.submitVoteWhenLoggedIn = function () {
        if (this.model.submittedChoice) {
            jQuery.ajax({
                url: this.baseURI + "/vote",
                dataType: 'jsonp',
                jsonpCallback: 'votecontroller_submitvote',
                data: {
                    article: this.getArticleId(),
                    access_token: this.authorizer.accessToken,
                    user: this.authorizer.userId,
                    action: this.model.submittedChoice
                }
            }).then(handleResponse(
                    this.handlePostResponse.bind(this, this.model.submittedChoice),
                    this.handleVoteFailed.bind(this)
                ));
        }
        this.model.submittedChoice = null;
    };

    VoteController.prototype.handlePostResponse = function (choice, response) {
        console.log("Controller: Posted response to Facebook OK. Voted for " + choice);
        this.model.registerVote(choice, true);
    };

    VoteController.prototype.handleVoteFailed = function (error) {
        console.log("Unable to vote. Possibly already voted already or has not given permission to do so.");
        this.view.render();
        if (error.message.indexOf("#200") > -1) {
            if (confirm("You need extended permissions in order to publish your vote. Would you like to continue?")) {
                this.authorizer.login(guardian.facebook.Authorizer.DEFAULT_PERMISSIONS, true);
            }
        }
    };

    function handleResponse(successFunction, errorFunction) {
        return (function (response) {
            if (response.data.error) {
                errorFunction && errorFunction(response.data.error);
                console.error("Error from server: " + response.data.error.message);
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
        this.submittedChoice = null;
        this.dataDeferred = jQuery.Deferred();
    }

    VoteModel.prototype = Object.create(EventEmitter.prototype);

    VoteModel.prototype.type = null;
    VoteModel.prototype.questionId = null;
    VoteModel.prototype.options = null;
    VoteModel.prototype.choice = null;
    VoteModel.prototype.allowedToVote = null;
    VoteModel.prototype.submittedChoice = null;

    VoteModel.prototype.setAllData = function (data) {
        this.answers = data.answers;
        this.trigger(VoteModel.DATA_CHANGED);
        this.dataDeferred.resolve();
    };

    VoteModel.prototype.setSubmittedChoice = function (choice) {
        if (this.canVote()) {
            this.submittedChoice = choice;
            this.trigger("voted", [choice]);
        }
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

    VoteComponent.prototype.jContainer = null;
    VoteComponent.prototype.donut = null;
    VoteComponent.prototype.numberFormatter = null;
    VoteComponent.prototype.model = null;

    VoteComponent.prototype.initialise = function (donutClass) {
        this.jContainer.html(VoteComponent.HTML);
        this.renderCallback = this.render.bind(this);
        this.model.on("dataChanged", this.renderCallback);
        this.model.on("voted", this.renderCallback);
        this.donut = new donutClass(this.jContainer.find(".donut-container"));
        this.jContainer.delegate(".btn:not(.disabled)", "click.vote-component", this.handleButtonClick.bind(this));
    };

    VoteComponent.prototype.updateButton = function (answers, index, element) {
        var answer = answers[index], jElement = jQuery(element);
        jElement.attr("data-action", answer.id);
        jElement.find(".count").html(this.numberFormatter(answer.count));
        jElement.find(".label").html(answer.id == this.model.submittedChoice ? "Sharing..." : answer.label);
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
        this.model.setSubmittedChoice(action);
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