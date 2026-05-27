    // /**
    //  * Returns an object that represents the provided namespace.
    //  * @param {string} name - The namespace to create.
    //  * @returns {Object} - The resulting namespace. If an existing object exists at the provided namespace, the existing object is returned.
    //  * @example
    //  * mi.namespace("A.B.C").func = function() { ... }; // accessible at A.B.C.func();
    //  */
    // mi.namespace = function(name) {
    //     var parts = name.split(".");
    //     var parent = window;
    //     for (var i = 0, il = parts.length; i < il; ++i) {
    //         parent = (parent[parts[i]] = parent[parts[i]] || {});
    //     }
    //     return parent;
    // };

/**
 * Runs the provided converter on all keys in the provided object, recursing into objects and arrays.
 * @param {object} obj - The object to evaluate.
 * @param {function} mapFunc - The key mapping function.
 * @returns {obj} - The provided object with the conversions applied.
 */
export function mapKeysRecursive(obj, mapFunc) {
    if (obj && angular.isArray(obj)) {
        return obj.map(function(x) { return mapKeysRecursive(x, mapFunc); });
    }

    if (obj && angular.isObject(obj)) {
        var hasAnyProperty = false;
        var result = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                hasAnyProperty = true;
                result[mapFunc(key)] = mapKeysRecursive(obj[key], mapFunc);
            }
        }
        return hasAnyProperty ? result : obj;
    }

    return obj;
};

export function toPascalCaseRecursive(obj) { 
    return mapKeysRecursive(obj, function (x) { return x ? x.substr(0, 1).toUpperCase() + x.substr(1) : x; }); 
}

//     /**
//      * Runs the provided converter on all values in the provided object, recursing into objects and arrays.
//      * @param {object} obj - The object to evaluate.
//      * @param {function} mapFunc - The value mapping function.
//      * @returns {obj} - The provided object with the conversions applied.
//      */
//     mi.mapValuesRecursive = function(obj, mapFunc) {
//         if (obj && angular.isArray(obj)) {
//             return obj.map(function(x) { return mi.mapValuesRecursive(x, mapFunc); });
//         }

//         if (obj && angular.isObject(obj)) {
//             var hasAnyProperty = false;
//             var result = {};
//             for (var key in obj) {
//                 if (obj.hasOwnProperty(key)) {
//                     hasAnyProperty = true;
//                     result[key] = mi.mapValuesRecursive(obj[key], mapFunc);
//                 }
//             }
//             return hasAnyProperty ? result : obj;
//         }

//         return mapFunc(obj);
//     };

//     /**
//      * Gets the current userAgent
//      * @returns {String}
//      */
//     mi.userAgent = function() {
//         var ua = window.navigator.userAgent.toLowerCase(),
//             type = "",
//             agentChecks = [
//                 "iphone", "ipad", "android", "msie", "windows phone",
//                 "blackberry", "firefox", "chrome", "opera", "safari"
//             ];

//         angular.forEach(agentChecks, function(check) {
//             if (ua.indexOf(check) >= 0) {
//                 type += (type !== "") ? " " : "";
//                 type += check.replace(" ", "");
//             }
//         });

//         return (type === "") ? "browser" : type;
//     };

//     /**
//      * Gets the current device pixel ratio
//      * @returns {Integer}
//      */
//     mi.pixelRatio = function() {
//         return window.devicePixelRatio;
//     };

// })(window.mi || (window.mi = {}));