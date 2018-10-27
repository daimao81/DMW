/*
 * Official Web Page
 * <https: //kagedesuworkshop.blogspot.com/p/alpha-net.html>
 *
 * License
 * Creative Commons 4.0 Attribution, Share Alike, Non-Commercial
 * <https://creativecommons.org/licenses/by-nc-sa/4.0/>
 *
 * Copyright (c) 2018 Vladimir Skrypnikov (Pheonix KageDesu)
 * <https://kagedesuworkshop.blogspot.ru/>
 *
 */

//=============================================================================
// Alpha_NET
//=============================================================================

/*:
 * @author Pheonix KageDesu
 * @plugindesc v0.6.774 Network system (Beta)
 * @help
 * 
 * Web Page: 
 * https://kagedesuworkshop.blogspot.com/p/alpha-net.html
 * Wiki Page: 
 * https://github.com/KageDesu/AlphaNET/wiki
 * Patreon Page: 
 * https://www.patreon.com/KageDesu
 * YouTube Channel:
 * https://www.youtube.com/channel/UCA3R61ojF5vp5tGwJ1YqdgQ?
 * 
 * Thanks to all my patrons!
 * Plugin supporters:
 *  - Donald Derrick
 *  - Ilya Chkoliar (https: //elushisgaming.club/)
 *  - Elindos Phar
 *  - Sarcastic Sloth
 * 
 * ==============================================================
 * Plugin Commands
 * ==============================================================
 *  --- Game Host ---
 * NET start - start server (only for PC)
 * NET hotSeat - start split screen
 *    (server must be started on your PC first)
 * NET stop - stop server
 * 
 * NET restrict - disable connection other players to the game
 * NET allow - enable connection to the game
 * 
 *  --- Game Client ---
 * NET connect - join to the game
 * NET disconnect - left the game
 * 
 * [!] Please read Wiki Page for more information and documentation
 * 
 * === === === === === === === === === === === === === === === === ===
 * 
 * @param Alpha NET
 * 
 * @param ActorsForPlayers
 * @parent Alpha NET
 * @text Actors for players
 * @type string
 * @default 1, 2, 3, 4
 * @desc Actor ID for each player, separate by comma. Actors count = how many players can join to the game
 * 
 * @param NetworkEvents
 * @text Network Events
 * @parent Alpha NET
 * @type string
 * @default --- --- --- --- ---
 * 
 * @param ServerStarted
 * @text On Server Started
 * @parent NetworkEvents
 * @type number
 * @default 0
 * @desc CommonEvent ID, called when Server get started (only for host)
 * 
 * @param OnConnect
 * @text On Join
 * @parent NetworkEvents
 * @type number
 * @default 0
 * @desc CommonEvent ID, called when you join the game
 * 
 * @param OnDisconect
 * @text On Disconect
 * @parent NetworkEvents
 * @type number
 * @default 0
 * @desc CommonEvent ID, called when you lost connection with game
 * 
 * @param OnOtherCon
 * @text On Another Join
 * @parent NetworkEvents
 * @type number
 * @default 0
 * @desc CommonEvent ID, called when another player join your game
 * 
 * @param OnOtherDisc
 * @text On Another Left
 * @parent NetworkEvents
 * @type number
 * @default 0
 * @desc CommonEvent ID, called when another player left your game
 * 
 * @param _supporters
 * @text Plugin Supporters
 * @default Thanks to these guys!
 * 
 * @param Donald Derrick
 * @parent _supporters
 * @desc https://www.patreon.com/user/creators?u=4416500
 * 
 * @param Ilya Chkoliar
 * @default https://elushisgaming.club/
 * @parent _supporters
 * @desc https://www.patreon.com/elushisgaming
 * 
 * @param Elindos Phar
 * @parent _supporters
 * @desc https://www.patreon.com/user/creators?u=13443236
 * 
 * @param Sarcastic Sloth
 * @parent _supporters
 * @desc https://www.patreon.com/user/creators?u=12796212
 * 
 */

//Show NET Icons?
//Show ICON while Chat?
//Show ICON while Wait?
//Show ICON while Menu?
//PICs for All Three Icons (стандартные хранить в памяти?)


//@[CODE STANDARD X2]

/* jshint -W097 */
/* jshint -W117 */

"use strict";

var Imported = Imported || {};
Imported.AlphaNET = true;

var AlphaNET = {};
AlphaNET.Version = '0.6';
AlphaNET.Build = 774;

AlphaNET.Versions = {
    'KDCore': '1.1',
    'NET': AlphaNET.Version + ' : ' + AlphaNET.Build,
    'Socket.io': '2.0.4',
    'CoffeeScript CLI': '2.3.1'
};

AlphaNET.LIBS = {};

AlphaNET.register = function (library) {
    this.LIBS[library.name] = library;
};

// * Global LOG
var LOGW = {};

// ------------------------- MAIN MODULES ---------------------------------
function Network() {
    throw new Error('This is a static class');
}

function NetPartyManager() {
    throw new Error('This is a static class');
}

function MakerManager() {
    throw new Error('This is a static class');
}

function HotSeatKeyMapper() {
    throw new Error('This is a static class');
}

function NetWorldManager() {
    throw new Error('This is a static class');
}

function InfoPrinter() {
    throw new Error('This is a static class');
}
// -------------------------------------------------------------------------

//@[GLOBAL DEFINITON]
function executeFunctionByName(functionName, context /*, args */ ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

function showDebugConsole() {
    if (!Utils.isNwjs()) return;
    require('nw.gui').Window.get().showDevTools();
}

(function () {
    //@[ALIAS]
    var _SceneManager_catchException_NET = SceneManager.catchException;
    SceneManager.catchException = function (e) {
        SceneManager._printErrorInfoNET();
        _SceneManager_catchException_NET.call(this, e);
    };

    //?[NEW]
    SceneManager._printErrorInfoNET = function () {
        console.error("Using Alpha NET [Version: " + AlphaNET.Version + " ; Build: " + AlphaNET.Build + " ; on MV  " + Utils.RPGMAKER_VERSION + "]");
    };

    //@[ALIAS]
    var _SceneManager_onError_ABS = SceneManager.onError;
    SceneManager.onError = function (e) {
        SceneManager._printErrorInfoNET();
        showDebugConsole();
        _SceneManager_onError_ABS.call(this, e);
    };

    // * Данный метод отвечает чтобы при загрузке сохранённой игры нашлись классы библиотек
    //@[ALIAS]
    var _JsonEx_decode = JsonEx._decode;
    JsonEx._decode = function (value, circular, registry) {
        var type = Object.prototype.toString.call(value);
        if (type === '[object Object]' || type === '[object Array]') {
            if (value['@']) {
                var constructor = AlphaNET.LIBS[value['@']] || KDCore[value['@']];
                if (constructor) {
                    value = this._resetPrototype(value, constructor.prototype);
                    value['@'] = null;
                }
            }
        }
        return _JsonEx_decode.call(this, value, circular, registry);
    };
})();
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ KDCore.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
var KDCore;

KDCore = KDCore || {};

KDCore.Version = '1.1';

KDCore.LIBS = {};

KDCore.register = function (library) {
    return this.LIBS[library.name] = library;
};

(function () {
    var BitmapSrc, Color, DevLog, ParametersManager, SDK, StringsLoader, __TMP_LOGS__;
    //Array Extension
    //------------------------------------------------------------------------------
    Array.prototype.delete = function () {
        var L, a, ax, what;
        what = void 0;
        a = arguments;
        L = a.length;
        ax = void 0;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
    Array.prototype.include = function (value) {
        return this.indexOf(value) !== -1;
    };
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };
    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };
    Array.prototype.sample = function () {
        if (this.length === 0) {
            return [];
        }
        return this[SDK.rand(0, this.length - 1)];
    };
    Array.prototype.first = function () {
        return this[0];
    };
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
    Array.prototype.shuffle = function () {
        var k, n, v;
        n = this.length;
        while (n > 1) {
            n--;
            k = SDK.rand(0, n + 1);
            v = this[k];
            this[k] = this[n];
            this[n] = v;
        }
    };
    Array.prototype.count = function () {
        return this.length;
    };
    //Number Extension
    //------------------------------------------------------------------------------
    Number.prototype.do = function (method) {
        return SDK.times(this, method);
    };
    Number.prototype.clamp = function (min, max) {
        return Math.min(Math.max(this, min), max);
    };
    //Sprite Extension
    //------------------------------------------------------------------------------
    Sprite.prototype.moveToCenter = function (dx = 0, dy = 0) {
        return this.move(-this.bitmap.width / 2 + dx, -this.bitmap.height / 2 + dy);
    };
    Sprite.prototype.setStaticAnchor = function (floatX, floatY) {
        this.x -= Math.round(this.width * floatX);
        this.y -= Math.round(this.height * floatY);
    };
    Sprite.prototype.moveToParentCenter = function () {
        if (!this.parent) {
            return;
        }
        return this.move(this.parent.width / 2, this.parent.height / 2);
    };
    //Bitmap Extension
    //------------------------------------------------------------------------------
    Bitmap.prototype.fillAll = function (color) {
        return this.fillRect(0, 0, this.width, this.height, color.CSS);
    };
    Bitmap.prototype.drawIcon = function (x, y, icon, size = 32) {
        var bitmap;
        bitmap = null;
        if (icon instanceof Bitmap) {
            bitmap = icon;
        } else {
            bitmap = BitmapSrc.LoadFromIconIndex(icon).bitmap;
        }
        return this.drawOnMe(bitmap, x, y, size, size);
    };
    Bitmap.prototype.drawOnMe = function (bitmap, x = 0, y = 0, sw = 0, sh = 0) {
        if (sw <= 0) {
            sw = bitmap.width;
        }
        if (sh <= 0) {
            sh = bitmap.height;
        }
        this.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, sw, sh);
    };
    Bitmap.prototype.drawTextFull = function (text, position = 'center') {
        return this.drawText(text, 0, 0, this.width, this.height, position);
    };
    //SDK
    //------------------------------------------------------------------------------
    SDK = function () {
        throw new Error('This is a static class');
    };
    SDK.rand = function (min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    };
    SDK.setConstantToObject = function (object, constantName, constantValue) {
        object[constantName] = constantValue;
        if (typeof object[constantName] === 'object') {
            Object.freeze(object[constantName]);
        }
        Object.defineProperty(object, constantName, {
            writable: false
        });
    };
    SDK.convertBitmapToBase64Data = function (bitmap) {
        return bitmap._canvas.toDataURL('image/png');
    };
    SDK.times = function (times, method) {
        var i, results;
        i = 0;
        results = [];
        while (i < times) {
            method(i);
            results.push(i++);
        }
        return results;
    };
    SDK.toGlobalCoord = function (layer, coordSymbol = 'x') {
        var node, t;
        t = layer[coordSymbol];
        node = layer;
        while (node) {
            t -= node[coordSymbol];
            node = node.parent;
        }
        return (t * -1) + layer[coordSymbol];
    };
    SDK.isInt = function (n) {
        return Number(n) === n && n % 1 === 0;
    };
    SDK.isFloat = function (n) {
        return Number(n) === n && n % 1 !== 0;
    };
    //Color
    //------------------------------------------------------------------------------
    Color = class Color {
        constructor(r1 = 255, g1 = 255, b1 = 255, a1 = 255) {
            this.r = r1;
            this.g = g1;
            this.b = b1;
            this.a = a1;
        }

        getLightestColor(lightLevel) {
            var bf, newColor, p;
            bf = 0.3 * this.R + 0.59 * this.G + 0.11 * this.B;
            p = 0;
            newColor = [0, 0, 0, 0];
            if (bf - lightLevel >= 0) {
                if (bf >= 0) {
                    p = Math.abs(bf - lightLevel) / lightLevel;
                }
                newColor = this.ARR.map(function (c) {
                    return c - (p * c);
                });
            } else {
                if (bf >= 0) {
                    p = (lightLevel - bf) / (255 - bf);
                }
                newColor = this.ARR.map(function (c) {
                    return [(255 - c) * p + c, 255].min();
                });
            }
            return new Color(newColor[0], newColor[1], newColor[2], newColor[3]);
        }

        clone() {
            return this.reAlpha(this.a);
        }

        reAlpha(newAlpha) {
            return new Color(this.r, this.g, this.b, newAlpha || 255);
        }

        static AddConstantColor(name, color) {
            color.toHex();
            color.toArray();
            color.toCSS();
            SDK.setConstantToObject(Color, name, color);
        }

        toHex() {
            var b, g, r;
            if (this._colorHex != null) {
                return this._colorHex;
            }
            r = Math.floor(this.r).toString(16).padStart(2, "0");
            g = Math.floor(this.g).toString(16).padStart(2, "0");
            b = Math.floor(this.b).toString(16).padStart(2, "0");
            return this._colorHex = '#' + r + g + b;
        }

        toArray() {
            if (this._colorArray != null) {
                return this._colorArray;
            }
            return this._colorArray = [this.r, this.g, this.b, this.a];
        }

        toCSS() {
            var na, nb, ng, nr;
            if (this._colorCss != null) {
                return this._colorCss;
            }
            nr = Math.round(this.r);
            ng = Math.round(this.g);
            nb = Math.round(this.b);
            na = this.a / 255;
            return this._colorCss = `rgba(${nr},${ng},${nb},${na})`;
        }

        static Random() {
            var a, b, c;
            a = SDK.rand(1, 254);
            b = SDK.rand(1, 254);
            c = SDK.rand(1, 254);
            return new Color(a, b, c, 255);
        }

        static FromHex(hexString) {
            var color, result;
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
            color = null;
            if (result != null) {
                color = {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                };
            }
            if (color != null) {
                return new Color(color.r, color.g, color.b, 255);
            } else {
                return Color.NONE;
            }
        }

    };
    Object.defineProperties(Color.prototype, {
        R: {
            get: function () {
                return this.r;
            },
            configurable: true
        },
        G: {
            get: function () {
                return this.g;
            },
            configurable: true
        },
        B: {
            get: function () {
                return this.b;
            },
            configurable: true
        },
        A: {
            get: function () {
                return this.a;
            },
            configurable: true
        },
        ARR: {
            get: function () {
                return this.toArray();
            },
            configurable: true
        },
        CSS: {
            get: function () {
                return this.toCSS();
            },
            configurable: true
        },
        HEX: {
            get: function () {
                return this.toHex();
            },
            configurable: true
        }
    });
    Color.AddConstantColor('NONE', new Color(0, 0, 0, 0));
    Color.AddConstantColor('BLACK', new Color(0, 0, 0, 255));
    Color.AddConstantColor('WHITE', new Color(255, 255, 255, 255));
    Color.AddConstantColor('RED', new Color(255, 0, 0, 255));
    Color.AddConstantColor('GREEN', new Color(0, 255, 0, 255));
    Color.AddConstantColor('BLUE', new Color(0, 0, 255, 255));
    Color.AddConstantColor('AQUA', new Color(128, 255, 255, 255));
    Color.AddConstantColor('MAGENTA', new Color(128, 0, 128, 255));
    Color.AddConstantColor('YELLOW', new Color(255, 255, 0, 255));
    Color.AddConstantColor('ORANGE', new Color(255, 128, 0, 255));
    //DevLog
    //------------------------------------------------------------------------------
    __TMP_LOGS__ = [];
    DevLog = class DevLog {
        constructor(prefix = "") {
            this.prefix = prefix;
            this._isShow = typeof DEV !== 'undefined';
            this._color = Color.BLACK;
            this._backColor = Color.WHITE;
            __TMP_LOGS__.push(this);
        }

        on() {
            this._isShow = true;
            return this;
        }

        off() {
            this._isShow = false;
            return this;
        }

        applyRandomColors() {
            this.applyRandomWithoutBackgroundColors();
            this.setBackColor(Color.Random());
            return this;
        }

        applyRandomWithoutBackgroundColors() {
            this.setColor(Color.Random());
            return this;
        }

        setColor(color) {
            this._color = color;
            return this;
        }

        setBackColor(backColor) {
            this._backColor = backColor;
            return this;
        }

        applyLibraryColors() {
            this.setColors(new Color(22, 120, 138, 0), Color.WHITE);
            return this;
        }

        setColors(color, backColor) {
            this.setColor(color);
            this.setBackColor(backColor);
            return this;
        }

        applyExtensionColors() {
            this.setColors(new Color(22, 143, 137, 0), Color.BLACK.getLightestColor(60));
            return this;
        }

        applyWarningColors() {
            this.setColors(Color.ORANGE, Color.BLACK.getLightestColor(100));
            return this;
        }

        p(text) {
            if (!this._isShow) {
                return;
            }
            if (text == null) {
                console.log("");
            }
            this._printText(text);
        }

        _printText(text) {
            text = this.prefix + " : " + text;
            if (this._isUsingColor()) {
                return this._printTextWithColors(text);
            } else {
                return console.log(text);
            }
        }

        _isUsingColor() {
            return this._color !== Color.BLACK || this._backColor !== Color.WHITE;
        }

        _printTextWithColors(text) {
            var args;
            args = ['%c' + text, `color: ${this._color.HEX} ; background: ${this._backColor.HEX};`];
            return window.console.log.apply(console, args);
        }

        static CreateForLib(library) {
            var dlog;
            dlog = new DevLog(library.name);
            dlog.applyLibraryColors();
            return dlog;
        }

        static EnableAllLogs() {
            return __TMP_LOGS__.forEach(function (log) {
                return log.on();
            });
        }

    };
    BitmapSrc = (function () {
        //BitmapSrc
        //------------------------------------------------------------------------------
        class BitmapSrc {
            constructor() {
                this.bitmap = null;
            }

            static LoadFromIconIndex(iconIndex) {
                var bs, icon_bitmap, iconset, ph, pw, sx, sy;
                bs = new BitmapSrc();
                if (BitmapSrc.CACHE[iconIndex] == null) {
                    iconset = ImageManager.loadSystem('IconSet');
                    pw = Window_Base._iconWidth;
                    ph = Window_Base._iconHeight;
                    sx = iconIndex % 16 * pw;
                    sy = Math.floor(iconIndex / 16) * ph;
                    icon_bitmap = new Bitmap(pw, ph);
                    icon_bitmap.addLoadListener(function () {
                        icon_bitmap.blt(iconset, sx, sy, pw, ph, 0, 0);
                    });
                    BitmapSrc.CACHE[iconIndex] = icon_bitmap;
                }
                bs.bitmap = BitmapSrc.CACHE[iconIndex];
                return bs;
            }

            static LoadFromImageFolder(filename) {
                var bs;
                bs = new BitmapSrc();
                bs.bitmap = ImageManager.loadPicture(filename);
                return bs;
            }

            static LoadFromBase64(data, name) {
                var bs;
                bs = new BitmapSrc();
                if (name != null) {
                    if (BitmapSrc.CACHE[name] != null) {
                        bs.bitmap = BitmapSrc.CACHE[name];
                    } else {
                        BitmapSrc.CACHE[name] = Bitmap.load(data);
                        bs.bitmap = BitmapSrc.CACHE[name];
                    }
                } else {
                    bs.bitmap = Bitmap.load(data);
                }
                return bs;
            }

            static LoadFromMemory(symbol) {
                var bs;
                bs = new BitmapSrc();
                if (BitmapSrc.CACHE[symbol] != null) {
                    bs.bitmap = BitmapSrc.CACHE[symbol];
                } else {
                    bs.bitmap = ImageManager.loadEmptyBitmap();
                }
                return bs;
            }

        };

        BitmapSrc.CACHE = {};

        return BitmapSrc;

    }).call(this);
    //ParametersManager
    //------------------------------------------------------------------------------
    PluginManager.getPluginParametersByRoot = function (rootName) {
        var pluginParameters, property;
        for (property in this._parameters) {
            if (this._parameters.hasOwnProperty(property)) {
                pluginParameters = this._parameters[property];
                if (PluginManager.isPluginParametersContentKey(pluginParameters, rootName)) {
                    return pluginParameters;
                }
            }
        }
        return PluginManager.parameters(rootName);
    };
    PluginManager.isPluginParametersContentKey = function (pluginParameters, key) {
        return pluginParameters[key] !== void 0;
    };
    ParametersManager = class ParametersManager {
        constructor(pluginName) {
            this.pluginName = pluginName;
            this._cache = {};
            this._parameters = PluginManager.getPluginParametersByRoot(this.pluginName);
        }

        isLoaded() {
            return (this._parameters != null) && this._parameters.hasOwnProperty(this.pluginName);
        }

        isHasParameter(name) {
            return this._parameters[name] != null;
        }

        getString(name) {
            return this._parameters[name];
        }

        convertField(object, fieldName) {
            var e;
            try {
                object[fieldName] = JSON.parse(object[fieldName] || 'false');
            } catch (error) {
                e = error;
                console.error('Error while convert field ' + e.name);
                object[fieldName] = false;
            }
            return object;
        }

        convertImage(object, fieldName) {
            return object[fieldName] = this.loadImage(object[fieldName]);
        }

        loadImage(filename, smooth) {
            var e, path;
            try {
                if (filename) {
                    path = filename.split('/');
                    filename = path.last();
                    path = path.first() + '/';
                    return ImageManager.loadBitmap('img/' + path, filename, 0, smooth || true);
                } else {
                    return ImageManager.loadEmptyBitmap();
                }
            } catch (error) {
                e = error;
                console.error(e);
                return ImageManager.loadEmptyBitmap();
            }
        }

        getFromCacheOrInit(name, func) {
            var object;
            if (!this.isInCache(name)) {
                if (func != null) {
                    object = func.call(this);
                    this.putInCache(name, object);
                }
            }
            return this.getFromCache(name);
        }

        isInCache(name) {
            return this._cache.hasOwnProperty(name);
        }

        putInCache(name, object) {
            return this._cache[name] = object;
        }

        getFromCache(name) {
            return this._cache[name];
        }

        getNumber(name) {
            var number;
            number = this.getObject(name);
            if (SDK.isInt(number)) {
                return number;
            }
            return 0;
        }

        getObject(name) {
            if (this.isHasParameter(name)) {
                return JSON.parse(this.getString(name) || '{}');
            } else {
                return {};
            }
        }

        getBoolean(name) {
            if (this.isHasParameter(name)) {
                return JSON.parse(this.getString(name) || false);
            } else {
                return false;
            }
        }

    };
    //StringsLoader
    //------------------------------------------------------------------------------
    StringsLoader = class StringsLoader {
        constructor(_parameters) {
            this._parameters = _parameters;
        }

        loadAllStringsToObject(object) {
            var strings;
            strings = this._collect(object);
            this._writeNewString(object, strings);
        }

        _collect(object) {
            var properties, strings;
            properties = Object.getOwnPropertyNames(object);
            strings = properties.filter(function (item) {
                return item.includes("STRING_");
            });
            return strings;
        }

        _writeNewString(object, strings) {
            var j, len, string;
            for (j = 0, len = strings.length; j < len; j++) {
                string = strings[j];
                this._setStringFromPluginParametersToObject(object, string);
            }
        }

        _setStringFromPluginParametersToObject(object, stringName) {
            var newValue;
            newValue = this._parameters[stringName];
            if (newValue) {
                object[stringName] = newValue;
            }
        }

    };
    //EXTENSION TO GLOBAL
    //------------------------------------------------------------------------------
    KDCore.SDK = SDK;
    KDCore.Color = Color;
    KDCore.DevLog = DevLog;
    KDCore.BitmapSrc = BitmapSrc;
    KDCore.ParametersManager = ParametersManager;
    KDCore.StringsLoader = StringsLoader;
})();

// ■ END KDCore.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ DevExt.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var __TMP_LOG__;
    __TMP_LOG__ = null;
    String.prototype.LOG = function () {
        if (__TMP_LOG__ === null) {
            __TMP_LOG__ = new KDCore.DevLog("TMP");
            __TMP_LOG__.setColors(KDCore.Color.MAGENTA, KDCore.Color.BLACK.getLightestColor(230));
        }
        __TMP_LOG__.p(this);
    };
    Number.prototype.LOG = function () {
        return this.toString().LOG();
    };
    Array.prototype.LOG = function () {
        return this.toString().LOG();
    };
    Boolean.prototype.LOG = function () {
        return this.toString().LOG();
    };
    String.prototype.P = function () {
        return this.LOG();
    };
    String.prototype.p = function (additionText) {
        var str;
        if (additionText != null) {
            str = this + " : " + additionText;
            return str.LOG();
        } else {
            return this.LOG();
        }
    };
    Array.prototype.findElementByField = function (elementField, value) {
        var result;
        result = this.filter(function (item) {
            return item[elementField] === value;
        });
        if (result.length === 0) {
            return null;
        } else {
            return result[0];
        }
    };
    Array.prototype.findElementIndexByField = function (elementField, value) {
        var element;
        element = this.findElementByField(elementField, value);
        return this.indexOf(element);
    };
})();

// ■ END DevExt.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetworkClient.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var LOG, NetworkClient, _C, _M, _R;
    LOG = new KDCore.DevLog(" * Client");
    LOG.setColors(KDCore.Color.MAGENTA.reAlpha(200), KDCore.Color.BLACK.getLightestColor(200));
    LOG.on();
    //@[DEFINES]
    _C = null; //? ClientManager
    _M = null; //? NetMessage
    _R = null; //? _registerNetMessage
    NetworkClient = class NetworkClient {
        constructor(socket) {
            this.socket = socket;
            _R = this._registerNetMessage.bind(this);
            _M = NetMessage;
            _C = AlphaNET.LIBS.ClientManager;
            NetMessage.Setup(this.socket);
            this._handleCommands();
        }

        _handleCommands() {
            this._handleError();
            this._handleConnect();
            this._handleDisconect();
            return this._handleNET();
        }

        _handleError() {
            return this.socket.on('connect_error', function () {
                LOG.p('Connect error!');
                Network.onConnectionError();
                return Network.disconnect();
            });
        }

        _handleConnect() { // * WHEN THIS CLIENT CONNECT TO SERVER
            return this.socket.on('connect', function () {
                LOG.p('Connected');
                Network.runEvent(Network.commonEventOnConnectToServer);
                return Network.onConnectToServer();
            });
        }

        _handleDisconect() { // * WHEN SERVER TURN OFF
            return this.socket.on('disconnect', function () {
                LOG.p('Disconnected');
                NetPartyManager.clearParty();
                Network.runEvent(Network.commonEventOnDisconectFromServer);
                return Network.onConnectionLost();
            });
        }

        _handleNET() {
            this.socket.on('trace', function () { // * Используется для теста соединения
                return LOG.p("Trace from Server");
            });
            _R(_M.AlertMessage(), function (netData) {
                return window.alert(netData.data);
            });
            _R(_M.PlayerConnect(), _C.OnAnotherConnected);
            _R(_M.PlayerDisconnect(), _C.OnAnotherDisconnected);
            _R(_M.HostResponse(), _C.OnHostResponse);
            _R(_M.PlayersTableResponse(), _C.SetPlayersTableData);
            _R(_M.RequestPlayerData(), _C.OnAnotherPlayerDataRequested);
            _R(_M.PlayerDataResponse(), _C.OnAnotherPlayerDataResponse);
            _R(_M.PlayerMoveData(), _C.OnAnotherPlayerMove);
            _R(_M.MapEventMoveData(), _C.OnEventMoveData);
            _R(_M.WindowSelect(), _C.OnWindowSelectData);
            _R(_M.BattleInputCommand(), _C.OnBattleInputCommand);
            _R(_M.TempMessage(), _C.OnTempMessage);
            _R(_M.SyncEvent(), _C.OnEventSync);
            _R(_M.LockEvent(), _C.OnEventLock);
            _R(_M.StartSharedEvent(), _C.OnStartSharedEvent);
            _R(_M.BattleBattlerRefreshData(), _C.OnBattleBattlerRefreshCommand);
            _R(_M.BattleAction(), _C.OnBattleActionCommand);
            _R(_M.BattleManager(), _C.OnBattleManagerCommand);
            _R(_M.PlayerNetIcon(), _C.OnPlayerNetIcon);
            _R(_M.VirtualInterpreter(), _C.OnVirtualIterpreterCommand);
            _R(_M.PlayerNetActorData(), _C.OnPlayerNetActorData);
            _R(_M.HostGameMapId(), _C.OnHostGameMapId);
            _R(_M.PlayerWorldData(), _C.OnPlayerWorldData);
            _R(_M.GlobalWorldData(), _C.OnGlobalWorldData);

            // * При завершени ожидания сервера
            this.socket.on(_M.OnWaitResponse().name, function (data) {
                return Network.onServerResponse(data);
            });

            //?{TEST}
            return this.socket.on('123', function (data) {
                if ((data != null ? data.waited : void 0) === true) {
                    return Network.onServerResponse();
                }
            });
        }

        _registerNetMessage(netMessage, func) {
            return this.socket.on(netMessage.name, func);
        }

        _requestPlayersInitialData() {
            return _M.RequestPlayerData().send();
        }

        disconnect() {
            _C.OnDisconnect();
            if (this.socket != null) {
                return this.socket.disconnect();
            }
        }

    };
    AlphaNET.register(NetworkClient);
})();

// ■ END NetworkClient.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetworkServer.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//* ================ HELP SECTION =================
//client.emit('testX') #ТОЛЬКО ЭТОМУ
//this._server.emit('testX') #ВСЕМ
//client.broadcast.emit('testX') #ВСЕМ, КРОМЕ СЕБЯ

//Как создавать новую команду
//1 - Создаём NetMessage
//2 - Прописываем команду в NetworkServer.coffee
//3 - Прописываем команду в NetworkClient.coffee
//4 - Прописываем логику команды в ClientManager (если это сообщение от сервера)
//5 - Прописываем логику в ServerManager (если это сообщение от клиента к сереру)
//* ==============================================
(function () {
    var LOG, NetworkServer, ServerManager, _M, _R, _RT;
    LOG = new KDCore.DevLog("Server");
    LOG.setColors(KDCore.Color.GREEN, KDCore.Color.BLACK.getLightestColor(120));
    LOG.on();
    //@[DEFINES]
    _M = null; //? NetMessage
    _R = null; //? _registerNetMessage
    _RT = null; //? _retranslate
    ServerManager = null;
    NetworkServer = class NetworkServer {
        constructor(port) {
            this.port = port;
            _M = NetMessage;
            _R = this._registerNetMessage.bind(this);
            _RT = this._retranslate.bind(this);
            ServerManager = AlphaNET.LIBS.ServerManager;
            this._host = null;
            this._startServer();
            ServerManager.Init(this);
            this._handleCommands();
        }

        _startServer() {
            var path;
            path = './js/libs/server';
            this._server = require(path)(this.port);
            Network.runEvent(Network.commonEventOnServerStarted);
            InfoPrinter.p('<font color="blue" size="3">Server started</font>');
            setTimeout(InfoPrinter.clear, 3000);
            return LOG.p("started");
        }

        _handleCommands() {
            return this._server.on('connection', (client) => { // * WHEN ANOTHER CLIENT CONNECTS TO THIS SERVER
                LOG.p("Client connected " + client.id);
                this._handleDisconnect(client);
                this._setupServerCommands(client);
                return this._registerConnection(client);
            });
        }

        _handleDisconnect(client) { // * WHEN ANOTHER CLIENT GONE FROM THIS SERVER
            return client.on('disconnect', function () {
                LOG.p("Client disconnected " + client.id);
                return ServerManager.OnClientDisconnect(client);
            });
        }

        _registerConnection(client) {
            if (!this._isHostExists()) {
                return this._registerHost(client);
            } else {
                return ServerManager.OnNewPlayerConnected(client);
            }
        }

        _isHostExists() {
            return this._host !== null;
        }

        _registerHost(client) {
            this._host = client;
            LOG.p("Host is " + client.id);
            //TODO: Это не обязательно, так как Хост = этому клиенту, можно сразу на NEtwork Установить
            NetMessage.HostResponse(client).send();
            return ServerManager.RegisterHost(client);
        }

        _setupServerCommands(client) {
            _RT(client, _M.RequestPlayerData());
            _RT(client, _M.PlayerDataResponse());
            _RT(client, _M.PlayerMoveData());
            _RT(client, _M.MapEventMoveData());
            _RT(client, _M.WindowSelect());
            _RT(client, _M.BattleInputCommand());
            _RT(client, _M.TempMessage());
            _RT(client, _M.LockEvent());
            _RT(client, _M.BattleBattlerRefreshData());
            _RT(client, _M.BattleAction());
            _RT(client, _M.BattleManager());
            _RT(client, _M.PlayerNetIcon());
            _RT(client, _M.PlayerNetActorData());
            // * Эти команды выполняются только на сервере
            _R(client, _M.RegisterOnSharedEvent(), ServerManager.RegisterOnSharedEvent);
            _R(client, _M.RegisterOnSharedEventSync(), ServerManager.RegisterOnSharedEventSync);
            _R(client, _M.RequestSync(), ServerManager.RegisterOnSync);
            _R(client, _M.PlayerWorldData(), ServerManager.OnPlayerWorldData);
            _R(client, _M.PlayerNetItemsData(), ServerManager.OnPlayerNetItemsData);
            // * Эти команды ретранслируются, а также выполняются на сервере
            _RT(client, _M.StartSharedEvent());
            _R(client, _M.StartSharedEvent(), ServerManager.StartSharedEvent);
            _RT(client, _M.SyncEvent());
            _R(client, _M.SyncEvent(), ServerManager.OnSyncEvent);
            _RT(client, _M.VirtualInterpreter());
            _R(client, _M.VirtualInterpreter(), ServerManager.OnVirtualInterpreter);
            //?{TEST}
            //client.on _M.TempMessage().name, (data) ->
            //    LOG.p('123')
            //    _M.TempMessage(client).send(data.data)
            //    _M.TempMessage(client).broadcast(data.data)

            //@_registerNetMessage client, 'testWaitHard', -> LOG.p('hard wait accepted')

            //?{TEST}
            client.on('testWaitHard', function (data) {
                return LOG.p('hard wait accepted ' + data.data);
            });
            //?{TEST}
            return client.on('testWaitHardRepeated', function (data) {
                return LOG.p('hard repeat wait accepted ' + data.data);
            });
        }

        // * Этот метод перенаправляет команду от сервера на все клиенты (кроме клиента, который прислал эту команду)
        _retranslate(client, netCommand) {
            return _R(client, netCommand, function (networkData) {
                netCommand.socket = client;
                netCommand.setFrom(client.id);
                return netCommand.broadcast(networkData.data);
            });
        }

        _registerNetMessage(client, netMessage, func) {
            return client.on(netMessage.name, func);
        }

        instance() {
            return this._server;
        }

        isStarted() {
            return this.instance() != null;
        }

        onWaitPoolReady(data) {
            return this._server.emit(_M.OnWaitResponse().name, data);
        }

        abortWaitPool(clientId, code) {
            var client;
            client = this._getClientById(clientId);
            return client != null ? client.emit(_M.OnWaitResponse().name, code) : void 0;
        }

        _getClientById(clientId) {
            return this.clients()[clientId];
        }

        //?{TEST}
        test() {
            return this._server.emit('123', {
                waited: true
            });
        }

        stop() {
            var ref;
            if ((ref = this._server) != null) {
                ref.close();
            }
            this._server = null;
            return LOG.p("stopped");
        }

        clients() {
            return this._server.clients().sockets;
        }

        clientsCount() {
            return Object.keys(this.clients()).length;
        }

    };
    AlphaNET.register(NetworkServer);
})();

// ■ END NetworkServer.coffee
//---------------------------------------------------------------------------

//Compressed by MV Plugin Builder
(function () {
    var _0x38c6 = [
        'isCurrentSceneIsMenuBased',
        'terminate',
        'While\x20try\x20execute\x20virtual\x20command',
        'OnTempMessage',
        'TEMP\x20MESSAGE\x20:\x20NETWORK\x20DATA',
        'OnPlayerNetActorData',
        'onActorDataFromNetwork',
        'FJmhH',
        'rCbze',
        'getActorIdBySocketId',
        'sessionData',
        'setPlayerActorData',
        'START\x20SHARED\x20EVENT\x20FROM\x20NETWORK',
        'read\x20shared\x20event\x20data',
        'While\x20try\x20save\x20another\x20actor\x20data',
        'While\x20try\x20synchronize\x20another\x20actor\x20data',
        'OnHostGameMapId',
        'SERVER\x20MAP\x20IS\x20OTHER,\x20TRANSFER\x20PLAYER!',
        'reserveTransfer',
        'While\x20try\x20synchronize\x20game\x20map\x20with\x20Server',
        'OnPlayerWorldData',
        'onActroItemsFromNetwork',
        'actorData',
        'While\x20try\x20load\x20player\x20world\x20data\x20from\x20server',
        'OnGlobalWorldData',
        'onGlobalWorldDataFromNetwork',
        'While\x20try\x20load\x20global\x20world\x20data\x20from\x20server',
        'OnDisconnect',
        'register',
        'OnHostResponse',
        'setHost',
        'OnAnotherConnected',
        'commonEventOnOtherClientConnected',
        'OnAnotherDisconnected',
        'playerData',
        'from',
        'runEvent',
        'commonEventOnOtherClientDisconected',
        'SetPlayersTableData',
        'isHost',
        'players',
        'data',
        'myPlayerData',
        'myId',
        'SetupVirtualUpdate',
        'send',
        'UOpEA',
        'endTurn',
        '_virtualUpdateThread',
        'isConnected',
        'synchronize',
        'SERVER_UPDATE_TIME',
        'OnAnotherPlayerDataRequested',
        'PlayerDataResponse',
        'collectDataForNetwork',
        'PLAYER\x20DATA\x20FROM',
        'getCharById',
        'error',
        'While\x20character\x20synchronization',
        'OnAnotherPlayerMove',
        'DAKqP',
        'vXsVT',
        'BATTLE\x20:\x20ACTOR\x20REFRESH',
        '_hp',
        '_mp',
        '_tp',
        'onNetworkCharacterData',
        'charData',
        'moveData',
        'ZFosp',
        'While\x20moving\x20character',
        'synchronizeFromNetwork',
        'OnEventMoveData',
        'mapId',
        'event',
        'eventId',
        '_moveCharacterFromNetwork',
        'onNetworkDirectionData',
        'OnWindowSelectData',
        'networkWSelectedIndex',
        'index',
        'networkWAction',
        'action',
        'yTaSQ',
        '_startActionFromNetwork',
        'targets',
        'read\x20Window\x20Select\x20Data\x20from\x20Server',
        'OnEventSync',
        'oehZr',
        'EVENT\x20SYNC\x20COMMAND',
        'IPRQw',
        'EVENT\x20LOCK\x20COMMAND',
        'setLockedEventByNetwork',
        'isLock',
        'setSkillFromNet',
        'dgoUA',
        'Rkhft',
        'JbLrz',
        'read\x20event\x20sync\x20data',
        'OnStartSharedEvent',
        'startEventFromNetwork',
        'BATTLE\x20:\x20ON\x20INPUT\x20COMMAND',
        '_selectInputCommandFromNetwork',
        'getBattleSubjectById',
        '_states',
        'states',
        'OnBattleActionCommand',
        'BATTLE\x20:\x20GAME\x20ACTION',
        'setResult',
        'sbj',
        'target',
        'clearResult',
        'setupFromOuterData',
        '_result',
        'memberByActorId',
        'currentAction',
        'setSkill',
        'XlOil',
        'actionId',
        'setItem',
        'setItemFromNet',
        'setTarget',
        'xXrDq',
        'onNetworkMoveData',
        'setTargetFromNet',
        'OnBattleManagerCommand',
        'battleOrder',
        'convertIdsToBattlers',
        'Caaol',
        'efRRN',
        'setUniqueIdsForEnemies',
        'troopIds',
        'endAction',
        '_processTurnFromNetwork',
        'subjectId',
        'startAction',
        'invokeNormal',
        '_invokeNormalActionFromNetwork',
        'targetId',
        'abortBattle',
        '_abortBattleCommandFromNetwork',
        'victory',
        'REZfO',
        'processVictory',
        'directionData',
        'defeat',
        'processDefeat',
        'escape',
        'iLnaH',
        'success',
        'NETWORK\x20ICON',
        'inBattle',
        'lLYWD',
        'jYjhY',
        'showNetworkIcon',
        'While\x20start\x20network\x20icon',
        'VIRTUAL\x20INTERPRETER',
        '_params',
        'parameters',
        '_mapId',
        '_eventId',
        'command',
        'function',
        'Qlysr'
    ];
    (function (_0x2d8f05, _0x4b81bb) {
        var _0x4d74cb = function (_0x32719f) {
            while (--_0x32719f) {
                _0x2d8f05['push'](_0x2d8f05['shift']());
            }
        };
        _0x4d74cb(++_0x4b81bb);
    }(_0x38c6, 0xc1));
    var _0x1a5c = function (_0x3ba860, _0x82f2be) {
        _0x3ba860 = _0x3ba860 - 0x0;
        var _0x22eccf = _0x38c6[_0x3ba860];
        return _0x22eccf;
    };
    var ClientManager;
    ClientManager = class ClientManager {
        static[_0x1a5c('0x0')]() {
            return Network[_0x1a5c('0x1')]();
        }
        static[_0x1a5c('0x2')](_0x5444d1) {
            return Network['runEvent'](Network[_0x1a5c('0x3')]);
        }
        static[_0x1a5c('0x4')](_0x31cbb6) {
            if (!Network[_0x1a5c('0x5')](_0x31cbb6[_0x1a5c('0x6')])) {
                return;
            }
            NetPartyManager['removePlayer'](_0x31cbb6[_0x1a5c('0x6')]);
            return Network[_0x1a5c('0x7')](Network[_0x1a5c('0x8')]);
        }
        static[_0x1a5c('0x9')](_0xe209c9) {
            if (!Network[_0x1a5c('0xa')]()) {
                Network[_0x1a5c('0xb')] = _0xe209c9[_0x1a5c('0xc')];
                Network[_0x1a5c('0xd')] = Network[_0x1a5c('0x5')](Network[_0x1a5c('0xe')]());
            }
            NetPartyManager['refreshParty']();
            ClientManager[_0x1a5c('0xf')]();
            return NetMessage['RequestPlayerData']()[_0x1a5c('0x10')]();
        }
        static[_0x1a5c('0xf')]() {
            var _0x1df3d4;
            if (ClientManager['_virtualUpdateThread'] != null) {
                if (_0x1a5c('0x11') !== _0x1a5c('0x11')) {
                    BattleManager[_0x1a5c('0x12')]();
                    return;
                } else {
                    return;
                }
            }
            return ClientManager[_0x1a5c('0x13')] = setTimeout(_0x1df3d4 = function () {
                if (!Network[_0x1a5c('0x14')]()) {
                    return;
                }
                NetPartyManager[_0x1a5c('0x15')]();
                NetWorldManager[_0x1a5c('0x15')]();
                if (ClientManager[_0x1a5c('0x13')] != null) {
                    return ClientManager[_0x1a5c('0x13')] = setTimeout(_0x1df3d4, Network[_0x1a5c('0x16')]);
                }
            }, Network[_0x1a5c('0x16')]);
        }
        static[_0x1a5c('0x17')](_0x3e38ab) {
            NetMessage[_0x1a5c('0x18')]()['send']($gamePlayer[_0x1a5c('0x19')]());
            return NetPartyManager[_0x1a5c('0x15')]();
        }
        static['OnAnotherPlayerDataResponse'](_0x2dba13) {
            var _0x29463a, _0x3a6424;
            _0x1a5c('0x1a')['p'](_0x2dba13[_0x1a5c('0x6')]);
            try {
                _0x29463a = NetPartyManager[_0x1a5c('0x1b')](_0x2dba13[_0x1a5c('0x6')]);
                return _0x29463a != null ? _0x29463a['synchronizeFromNetwork'](_0x2dba13[_0x1a5c('0xc')]) : void 0x0;
            } catch (_0x1a016c) {
                _0x3a6424 = _0x1a016c;
                return Network[_0x1a5c('0x1c')](_0x3a6424, _0x1a5c('0x1d'));
            }
        }
        static[_0x1a5c('0x1e')](_0x2f1ae9) {
            var _0x3bc025;
            _0x3bc025 = NetPartyManager['getCharById'](_0x2f1ae9[_0x1a5c('0x6')]);
            if (_0x3bc025 == null) {
                if (_0x1a5c('0x1f') !== _0x1a5c('0x20')) {
                    return;
                } else {
                    var _0x4c737f, _0x1b3663;
                    _0x1b3663 = _0x2f1ae9[_0x1a5c('0xc')];
                    _0x1a5c('0x21')['p'](_0x1b3663['id']);
                    _0x4c737f = BattleManager['getBattleSubjectById'](_0x1b3663['id']);
                    if (_0x4c737f != null) {
                        _0x4c737f[_0x1a5c('0x22')] = _0x1b3663['hp'];
                        _0x4c737f[_0x1a5c('0x23')] = _0x1b3663['mp'];
                        _0x4c737f[_0x1a5c('0x24')] = _0x1b3663['tp'];
                        _0x4c737f['_states'] = _0x1b3663['states'];
                    }
                }
            }
            return ClientManager['_moveCharacterFromNetwork'](_0x3bc025, _0x2f1ae9[_0x1a5c('0xc')]);
        }
        static['_moveCharacterFromNetwork'](_0x53f479, _0x1224ee) {
            var _0x1499b4;
            try {
                _0x53f479[_0x1a5c('0x25')](_0x1224ee[_0x1a5c('0x26')]);
                return _0x53f479['onNetworkMoveData'](_0x1224ee[_0x1a5c('0x27')]);
            } catch (_0x15cf78) {
                if ('ZFosp' === _0x1a5c('0x28')) {
                    _0x1499b4 = _0x15cf78;
                    return Network[_0x1a5c('0x1c')](_0x1499b4, _0x1a5c('0x29'));
                } else {
                    var _0x19f61e, _0x2fc911;
                    _0x1a5c('0x1a')['p'](networkData[_0x1a5c('0x6')]);
                    try {
                        _0x19f61e = NetPartyManager[_0x1a5c('0x1b')](networkData[_0x1a5c('0x6')]);
                        return _0x19f61e != null ? _0x19f61e[_0x1a5c('0x2a')](networkData[_0x1a5c('0xc')]) : void 0x0;
                    } catch (_0x251bb7) {
                        _0x2fc911 = _0x251bb7;
                        return Network[_0x1a5c('0x1c')](_0x2fc911, _0x1a5c('0x1d'));
                    }
                }
            }
        }
        static[_0x1a5c('0x2b')](_0x4d1723) {
            var _0x421952, _0x6fad60, _0x20cee2, _0x2004f4;
            try {
                _0x421952 = _0x4d1723[_0x1a5c('0xc')];
                _0x2004f4 = _0x421952[_0x1a5c('0x2c')];
                if ($gameMap['mapId']() !== _0x2004f4) {
                    return;
                }
                _0x20cee2 = $gameMap[_0x1a5c('0x2d')](_0x421952[_0x1a5c('0x2e')]);
                if (!_0x20cee2) {
                    return;
                }
                if (_0x421952[_0x1a5c('0x27')] != null) {
                    ClientManager[_0x1a5c('0x2f')](_0x20cee2, _0x421952[_0x1a5c('0x27')]);
                }
                if (_0x421952['directionData'] != null) {
                    return _0x20cee2[_0x1a5c('0x30')](_0x421952['directionData']);
                }
            } catch (_0x440c4e) {
                _0x6fad60 = _0x440c4e;
                return Network['error'](_0x6fad60, 'While\x20moving\x20event');
            }
        }
        static[_0x1a5c('0x31')](_0x523183) {
            var _0x124257, _0x4c9723;
            try {
                _0x124257 = _0x523183[_0x1a5c('0xc')];
                $gameTemp[_0x1a5c('0x32')] = _0x124257[_0x1a5c('0x33')];
                if ($gameTemp[_0x1a5c('0x34')] == null) {
                    return $gameTemp[_0x1a5c('0x34')] = _0x124257[_0x1a5c('0x35')];
                }
            } catch (_0x180941) {
                if (_0x1a5c('0x36') !== 'yTaSQ') {
                    BattleManager[_0x1a5c('0x37')](_0x124257[_0x1a5c('0x38')]);
                    return;
                } else {
                    _0x4c9723 = _0x180941;
                    return Network[_0x1a5c('0x1c')](_0x4c9723, _0x1a5c('0x39'));
                }
            }
        }
        static[_0x1a5c('0x3a')](_0x4ed408) {
            var _0x8d275b, _0x2b2150, _0x442835, _0xaf4453;
            try {
                if ('oehZr' === _0x1a5c('0x3b')) {
                    _0x1a5c('0x3c')['p']();
                    _0x8d275b = _0x4ed408[_0x1a5c('0xc')];
                    _0xaf4453 = _0x8d275b[_0x1a5c('0x2c')];
                    if ($gameMap[_0x1a5c('0x2c')]() !== _0xaf4453) {
                        if (_0x1a5c('0x3d') !== _0x1a5c('0x3d')) {
                            _0x1a5c('0x3e')['p']();
                            _0x8d275b = _0x4ed408[_0x1a5c('0xc')];
                            if ($gameMap[_0x1a5c('0x2c')]() !== _0x8d275b[_0x1a5c('0x2c')]) {
                                return;
                            }
                            return $gameMap[_0x1a5c('0x3f')](_0x8d275b[_0x1a5c('0x2e')], _0x8d275b[_0x1a5c('0x40')]);
                        } else {
                            return;
                        }
                    }
                    _0x442835 = $gameMap[_0x1a5c('0x2d')](_0x8d275b[_0x1a5c('0x2e')]);
                    return _0x442835 != null ? _0x442835['executeSyncCommandFromNetwork'](_0x8d275b['pi'], _0x8d275b['li']) : void 0x0;
                } else {
                    if (act != null) {
                        act[_0x1a5c('0x41')](data['actionId']);
                    }
                    return;
                }
            } catch (_0x23ef76) {
                if (_0x1a5c('0x42') !== _0x1a5c('0x42')) {
                    return;
                } else {
                    _0x2b2150 = _0x23ef76;
                    return Network['error'](_0x2b2150, 'read\x20event\x20sync\x20data');
                }
            }
        }
        static['OnEventLock'](_0x77d842) {
            var _0x3af0c9, _0x2dba70;
            try {
                'EVENT\x20LOCK\x20COMMAND' ['p']();
                _0x3af0c9 = _0x77d842[_0x1a5c('0xc')];
                if ($gameMap['mapId']() !== _0x3af0c9['mapId']) {
                    if (_0x1a5c('0x43') === _0x1a5c('0x43')) {
                        return;
                    } else {
                        'EVENT\x20SYNC\x20COMMAND' ['p']();
                        _0x3af0c9 = _0x77d842[_0x1a5c('0xc')];
                        mapId = _0x3af0c9['mapId'];
                        if ($gameMap['mapId']() !== mapId) {
                            return;
                        }
                        event = $gameMap[_0x1a5c('0x2d')](_0x3af0c9[_0x1a5c('0x2e')]);
                        return event != null ? event['executeSyncCommandFromNetwork'](_0x3af0c9['pi'], _0x3af0c9['li']) : void 0x0;
                    }
                }
                return $gameMap[_0x1a5c('0x3f')](_0x3af0c9[_0x1a5c('0x2e')], _0x3af0c9[_0x1a5c('0x40')]);
            } catch (_0x2fd65b) {
                if (_0x1a5c('0x44') === _0x1a5c('0x44')) {
                    _0x2dba70 = _0x2fd65b;
                    return Network['error'](_0x2dba70, _0x1a5c('0x45'));
                } else {
                    return 'TEMP\x20MESSAGE\x20:\x20NETWORK\x20DATA' ['p']();
                }
            }
        }
        static[_0x1a5c('0x46')](_0x7f71a9) {
            var _0x37e381;
            try {
                'START\x20SHARED\x20EVENT\x20FROM\x20NETWORK' ['p']();
                return $gameMap[_0x1a5c('0x47')](_0x7f71a9['data']);
            } catch (_0x327015) {
                _0x37e381 = _0x327015;
                return Network['error'](_0x37e381, 'read\x20shared\x20event\x20data');
            }
        }
        static['OnBattleInputCommand'](_0x51dc8a) {
            _0x1a5c('0x48')['p']();
            return BattleManager[_0x1a5c('0x49')](_0x51dc8a[_0x1a5c('0xc')]);
        }
        static['OnBattleBattlerRefreshCommand'](_0x357be8) {
            var _0x3010bd, _0x2a5b6a;
            _0x2a5b6a = _0x357be8[_0x1a5c('0xc')];
            _0x1a5c('0x21')['p'](_0x2a5b6a['id']);
            _0x3010bd = BattleManager[_0x1a5c('0x4a')](_0x2a5b6a['id']);
            if (_0x3010bd != null) {
                _0x3010bd[_0x1a5c('0x22')] = _0x2a5b6a['hp'];
                _0x3010bd['_mp'] = _0x2a5b6a['mp'];
                _0x3010bd[_0x1a5c('0x24')] = _0x2a5b6a['tp'];
                _0x3010bd[_0x1a5c('0x4b')] = _0x2a5b6a[_0x1a5c('0x4c')];
            }
        }
        static[_0x1a5c('0x4d')](_0x668aa9) {
            var _0x341272, _0x1829f1, _0x31cba1, _0x3f0d3a, _0x34ffdf, _0x3a18b8;
            _0x31cba1 = _0x668aa9['data'];
            _0x1a5c('0x4e')['p'](_0x31cba1['id']);
            if (_0x31cba1['id'] === _0x1a5c('0x4f')) {
                _0x34ffdf = BattleManager[_0x1a5c('0x4a')](_0x31cba1[_0x1a5c('0x50')]);
                _0x3a18b8 = BattleManager[_0x1a5c('0x4a')](_0x31cba1[_0x1a5c('0x51')]);
                if (_0x34ffdf != null) {
                    _0x34ffdf[_0x1a5c('0x52')]();
                }
                _0x3f0d3a = new Game_ActionResult();
                _0x3f0d3a[_0x1a5c('0x53')](_0x31cba1['result']);
                _0x3a18b8[_0x1a5c('0x54')] = _0x3f0d3a;
                return;
            }
            _0x1829f1 = $gameParty[_0x1a5c('0x55')](_0x31cba1['actorId']);
            _0x341272 = _0x1829f1[_0x1a5c('0x56')]();
            if (_0x31cba1['id'] === _0x1a5c('0x57')) {
                if (_0x341272 != null) {
                    if ('kOPqT' === _0x1a5c('0x58')) {
                        return ClientManager['_virtualUpdateThread'] = setTimeout(update, Network[_0x1a5c('0x16')]);
                    } else {
                        _0x341272[_0x1a5c('0x41')](_0x31cba1[_0x1a5c('0x59')]);
                    }
                }
                return;
            }
            if (_0x31cba1['id'] === _0x1a5c('0x5a')) {
                if (_0x341272 != null) {
                    _0x341272[_0x1a5c('0x5b')](_0x31cba1[_0x1a5c('0x59')]);
                }
                return;
            }
            if (_0x31cba1['id'] === _0x1a5c('0x5c')) {
                if (_0x1a5c('0x5d') !== _0x1a5c('0x5d')) {
                    var _0x27af4c;
                    try {
                        char[_0x1a5c('0x25')](netMovingData['charData']);
                        return char[_0x1a5c('0x5e')](netMovingData['moveData']);
                    } catch (_0x9ffd14) {
                        _0x27af4c = _0x9ffd14;
                        return Network['error'](_0x27af4c, 'While\x20moving\x20character');
                    }
                } else {
                    if (_0x341272 != null) {
                        _0x341272[_0x1a5c('0x5f')](_0x31cba1[_0x1a5c('0x59')]);
                    }
                }
            }
        }
        static[_0x1a5c('0x60')](_0x50c718) {
            var _0x2a8434, _0x44278e;
            _0x44278e = _0x50c718['data'];
            _0x2a8434 = _0x44278e['id'];
            'BATTLE\x20:\x20MANAGER' ['p'](_0x2a8434);
            if (_0x2a8434 === _0x1a5c('0x61')) {
                BattleManager['_actionBattlers'] = BattleManager[_0x1a5c('0x62')](_0x44278e['orderData']);
                return;
            }
            if (_0x2a8434 === 'enemyIds') {
                if (_0x1a5c('0x63') === _0x1a5c('0x64')) {
                    SceneManager['safeRefreshCurrentScene']();
                } else {
                    $gameTroop[_0x1a5c('0x65')](_0x44278e[_0x1a5c('0x66')]);
                    return;
                }
            }
            if (_0x2a8434 === _0x1a5c('0x67')) {
                BattleManager['endAction']();
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x12')) {
                BattleManager[_0x1a5c('0x12')]();
                return;
            }
            if (_0x2a8434 === 'processTurn') {
                BattleManager[_0x1a5c('0x68')](_0x44278e[_0x1a5c('0x69')]);
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x6a')) {
                BattleManager[_0x1a5c('0x37')](_0x44278e[_0x1a5c('0x38')]);
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x6b')) {
                BattleManager[_0x1a5c('0x6c')](_0x44278e['subjectId'], _0x44278e[_0x1a5c('0x6d')]);
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x6e')) {
                BattleManager[_0x1a5c('0x6f')]();
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x70')) {
                if (_0x1a5c('0x71') === _0x1a5c('0x71')) {
                    BattleManager[_0x1a5c('0x72')]();
                    return;
                } else {
                    return event[_0x1a5c('0x30')](_0x44278e[_0x1a5c('0x73')]);
                }
            }
            if (_0x2a8434 === _0x1a5c('0x74')) {
                BattleManager[_0x1a5c('0x75')]();
                return;
            }
            if (_0x2a8434 === _0x1a5c('0x76')) {
                if (_0x1a5c('0x77') === 'EoFFP') {
                    char['onNetworkCharacterData'](netMovingData[_0x1a5c('0x26')]);
                    return char['onNetworkMoveData'](netMovingData['moveData']);
                } else {
                    BattleManager['_onEscapeFromNetwork'](_0x44278e[_0x1a5c('0x78')]);
                }
            }
        }
        static['OnPlayerNetIcon'](_0x4688e7) {
            var _0x277cc6, _0x35be3c;
            _0x1a5c('0x79')['p']();
            try {
                _0x277cc6 = NetPartyManager[_0x1a5c('0x1b')](_0x4688e7['from']);
                if (!Network[_0x1a5c('0x7a')]()) {
                    if (_0x1a5c('0x7b') !== _0x1a5c('0x7c')) {
                        return _0x277cc6 != null ? _0x277cc6[_0x1a5c('0x7d')](_0x4688e7['data']) : void 0x0;
                    } else {
                        _0x277cc6 = NetPartyManager[_0x1a5c('0x1b')](_0x4688e7[_0x1a5c('0x6')]);
                        if (!Network[_0x1a5c('0x7a')]()) {
                            return _0x277cc6 != null ? _0x277cc6[_0x1a5c('0x7d')](_0x4688e7[_0x1a5c('0xc')]) : void 0x0;
                        }
                    }
                }
            } catch (_0x544f44) {
                _0x35be3c = _0x544f44;
                return Network[_0x1a5c('0x1c')](_0x35be3c, _0x1a5c('0x7e'));
            }
        }
        static['OnVirtualIterpreterCommand'](_0x3fc0c6) {
            var _0x2478ce, _0x2cb8e2, _0x3a704c, _0x82e655, _0x4a8510;
            _0x1a5c('0x7f')['p'](_0x3fc0c6[_0x1a5c('0xc')]['id']);
            _0x2478ce = _0x3fc0c6[_0x1a5c('0xc')];
            try {
                if ('eZkhW' === 'pamwK') {
                    _0x1a5c('0x48')['p']();
                    return BattleManager[_0x1a5c('0x49')](_0x3fc0c6['data']);
                } else {
                    _0x3a704c = new Game_Interpreter();
                    _0x3a704c[_0x1a5c('0x80')] = _0x2478ce[_0x1a5c('0x81')];
                    _0x3a704c[_0x1a5c('0x82')] = _0x2478ce[_0x1a5c('0x2c')];
                    _0x3a704c[_0x1a5c('0x83')] = _0x2478ce[_0x1a5c('0x2e')];
                    _0x4a8510 = _0x1a5c('0x84') + _0x2478ce['id'];
                    _0x82e655 = _0x3a704c[_0x4a8510];
                    if (_0x82e655 != null && typeof _0x82e655 === _0x1a5c('0x85')) {
                        if ('Qlysr' !== _0x1a5c('0x86')) {
                            return;
                        } else {
                            _0x3a704c[_0x4a8510]();
                            if (SceneManager[_0x1a5c('0x87')]()) {
                                SceneManager['safeRefreshCurrentScene']();
                            }
                        }
                    }
                    return _0x3a704c[_0x1a5c('0x88')]();
                }
            } catch (_0x50318c) {
                _0x2cb8e2 = _0x50318c;
                return Network[_0x1a5c('0x1c')](_0x2cb8e2, _0x1a5c('0x89'));
            }
        }
        static[_0x1a5c('0x8a')](_0x436012) {
            return _0x1a5c('0x8b')['p']();
        }
        static[_0x1a5c('0x8c')](_0x8c4d2e) {
            var _0x3109cf, _0x549e18;
            try {
                NetPartyManager[_0x1a5c('0x8d')](_0x8c4d2e['from'], _0x8c4d2e['data']);
                try {
                    if (_0x1a5c('0x8e') !== 'FJmhH') {
                        var _0x10adbc, _0x2c0b4e;
                        try {
                            _0x1a5c('0x3e')['p']();
                            _0x10adbc = _0x8c4d2e[_0x1a5c('0xc')];
                            if ($gameMap[_0x1a5c('0x2c')]() !== _0x10adbc[_0x1a5c('0x2c')]) {
                                return;
                            }
                            return $gameMap['setLockedEventByNetwork'](_0x10adbc[_0x1a5c('0x2e')], _0x10adbc[_0x1a5c('0x40')]);
                        } catch (_0x4d2b39) {
                            _0x2c0b4e = _0x4d2b39;
                            return Network[_0x1a5c('0x1c')](_0x2c0b4e, 'read\x20event\x20sync\x20data');
                        }
                    } else {
                        if (Network[_0x1a5c('0xa')]()) {
                            if (_0x1a5c('0x8f') !== 'dwjPX') {
                                _0x3109cf = NetPartyManager[_0x1a5c('0x90')](_0x8c4d2e[_0x1a5c('0x6')]);
                                return Network[_0x1a5c('0x91')][_0x1a5c('0x92')](_0x3109cf, _0x8c4d2e['data']);
                            } else {
                                var _0x4a11b3;
                                try {
                                    _0x1a5c('0x93')['p']();
                                    return $gameMap[_0x1a5c('0x47')](_0x8c4d2e[_0x1a5c('0xc')]);
                                } catch (_0x4bdb0e) {
                                    _0x4a11b3 = _0x4bdb0e;
                                    return Network[_0x1a5c('0x1c')](_0x4a11b3, _0x1a5c('0x94'));
                                }
                            }
                        }
                    }
                } catch (_0x501575) {
                    _0x549e18 = _0x501575;
                    return Network[_0x1a5c('0x1c')](_0x549e18, _0x1a5c('0x95'));
                }
            } catch (_0x5a9085) {
                if ('BysTU' !== 'BysTU') {
                    BattleManager[_0x1a5c('0x72')]();
                    return;
                } else {
                    _0x549e18 = _0x5a9085;
                    return Network[_0x1a5c('0x1c')](_0x549e18, _0x1a5c('0x96'));
                }
            }
        }
        static[_0x1a5c('0x97')](_0x15cd23) {
            var _0x56d2e1, _0x45a853, _0x355cad;
            try {
                _0x45a853 = _0x15cd23[_0x1a5c('0xc')][_0x1a5c('0x2c')];
                if ($gameMap[_0x1a5c('0x2c')]() !== _0x45a853) {
                    _0x1a5c('0x98')['p']();
                    _0x355cad = _0x15cd23[_0x1a5c('0xc')];
                    return $gamePlayer[_0x1a5c('0x99')](_0x45a853, _0x355cad['x'], _0x355cad['y'], _0x355cad['d'], 0x0);
                }
            } catch (_0x2609f5) {
                _0x56d2e1 = _0x2609f5;
                return Network[_0x1a5c('0x1c')](_0x56d2e1, _0x1a5c('0x9a'));
            }
        }
        static[_0x1a5c('0x9b')](_0x21cc7e) {
            var _0x5b1a5a, _0x3eab78;
            try {
                _0x3eab78 = _0x21cc7e[_0x1a5c('0xc')];
                NetPartyManager[_0x1a5c('0x9c')](_0x21cc7e[_0x1a5c('0x6')], _0x3eab78['actorItems']);
                NetPartyManager['onActorDataFromNetwork'](_0x21cc7e[_0x1a5c('0x6')], _0x3eab78[_0x1a5c('0x9d')]);
                return NetWorldManager['onWorldDataFromNetwork'](_0x3eab78);
            } catch (_0x27e803) {
                _0x5b1a5a = _0x27e803;
                return Network[_0x1a5c('0x1c')](_0x5b1a5a, _0x1a5c('0x9e'));
            }
        }
        static[_0x1a5c('0x9f')](_0xbb68e) {
            var _0x4cfa53;
            try {
                return NetWorldManager[_0x1a5c('0xa0')](_0xbb68e[_0x1a5c('0xc')]);
            } catch (_0x371e76) {
                _0x4cfa53 = _0x371e76;
                return Network[_0x1a5c('0x1c')](_0x4cfa53, _0x1a5c('0xa1'));
            }
        }
        static[_0x1a5c('0xa2')]() {
            return ClientManager['_virtualUpdateThread'] = null;
        }
    };
    AlphaNET[_0x1a5c('0xa3')](ClientManager);
})();

//Compressed by MV Plugin Builder
(function () {
    var _0x3a64 = [
        'getAllData',
        'PlayerWorldData',
        'HostGameMapId',
        'getGlobalData',
        'GlobalWorldData',
        'NFRON',
        'yqIyo',
        'allowConnect',
        'Connection\x20restricted\x20by\x20Server!',
        'error',
        'when\x20new\x20player\x20register',
        '_host',
        'setFrom',
        'SERVER\x20START\x20NET\x20MESSAGE',
        'IsEventPoolExists',
        'eventId',
        'RegisterOnSharedEvent',
        'REGISTER\x20\x20ON\x20EVENT',
        'data',
        'addClient',
        'wNflL',
        'CQmfW',
        'abortWaitPool',
        'from',
        '!!!\x20ABORT,\x20something\x20wrong!',
        'RegisterOnSharedEventSync',
        'REGISTER\x20\x20ON\x20EVENT\x20SYNC\x20LINE',
        'line',
        'waitId',
        'CreateEventPool',
        'LIBS',
        '_waitPoolThread',
        'oxXlQ',
        'getPoolSize',
        'clientsCount',
        'xluWs',
        'isPoolReady',
        'onWaitPoolReady',
        'ZnffD',
        'getActorIdBySocketId',
        'setPlayerItemsData',
        'vXQHe',
        'pFtxA',
        'stopServer',
        'RegisterOnSync',
        'SERVER\x20ACCEPT\x20SYNC\x20REQUEST',
        'RegisterOnSyncPool',
        'NetWaitPool',
        '_startSyncPoolThread',
        'OnPlayerWorldData',
        'PFUTY',
        'setPlayerWorldData',
        'OnSyncEvent',
        'onEventSyncCommand',
        'While\x20try\x20check\x20virtual\x20command\x20on\x20Server',
        'OnPlayerNetItemsData',
        'register',
        '_netServer',
        'eventWaitPool',
        'syncPools',
        'RegisterHost',
        'registerNewPlayer',
        'myPlayerData',
        'players',
        'first',
        'sessionData',
        'NetSessionData',
        'OnNewPlayerConnected',
        'canConnect',
        'QsIBo',
        'AlertMessage',
        'send',
        'Server\x20is\x20Busy!\x20Try\x20again\x20later!',
        'isMaximumForNetwork',
        'ZVuup',
        'disconnect',
        'bytIS',
        'YkTMA',
        'onEventVirtualCommand',
        'RegisterNewPlayer',
        'PlayersTableResponse',
        'serv',
        'PlayerConnect',
        'broadcast',
        'hasInfoAbout'
    ];
    (function (_0x328dd8, _0x384add) {
        var _0x3fa071 = function (_0x34911e) {
            while (--_0x34911e) {
                _0x328dd8['push'](_0x328dd8['shift']());
            }
        };
        _0x3fa071(++_0x384add);
    }(_0x3a64, 0xe3));
    var _0x9349 = function (_0x3b2813, _0x409e65) {
        _0x3b2813 = _0x3b2813 - 0x0;
        var _0x344174 = _0x3a64[_0x3b2813];
        return _0x344174;
    };
    var ServerManager;
    ServerManager = class ServerManager {
        static['Init'](_0x129c0f) {
            this[_0x9349('0x0')] = _0x129c0f;
            this['serv'] = _0x129c0f['instance']();
            this[_0x9349('0x1')] = null;
            return this[_0x9349('0x2')] = {};
        }
        static[_0x9349('0x3')](_0x31efdd) {
            NetPartyManager[_0x9349('0x4')](_0x31efdd['id']);
            Network[_0x9349('0x5')] = Network[_0x9349('0x6')][_0x9349('0x7')]();
            if (Network[_0x9349('0x8')] === null) {
                return Network[_0x9349('0x8')] = new AlphaNET['LIBS'][(_0x9349('0x9'))]();
            }
        }
        static[_0x9349('0xa')](_0x55b823) {
            if (!Network[_0x9349('0xb')]()) {
                if ('RpoYm' === _0x9349('0xc')) {
                    NetMessage[_0x9349('0xd')](_0x55b823)[_0x9349('0xe')](_0x9349('0xf'));
                    _0x55b823['disconnect']();
                    return;
                } else {
                    NetMessage[_0x9349('0xd')](_0x55b823)[_0x9349('0xe')](_0x9349('0xf'));
                    _0x55b823['disconnect']();
                    return;
                }
            }
            if ($gameParty[_0x9349('0x10')]()) {
                if ('wFCef' !== _0x9349('0x11')) {
                    NetMessage[_0x9349('0xd')](_0x55b823)[_0x9349('0xe')]('Server\x20is\x20Full!');
                    _0x55b823[_0x9349('0x12')]();
                    return;
                } else {
                    ServerManager['_waitPoolThread'] = setTimeout(mama, 0x64);
                }
            }
            if (!Network['allowConnect']()) {
                if (_0x9349('0x13') === _0x9349('0x14')) {
                    return NetWorldManager[_0x9349('0x15')](data);
                } else {
                    NetMessage[_0x9349('0xd')](_0x55b823)[_0x9349('0xe')]('Connection\x20restricted\x20by\x20Server!');
                    _0x55b823[_0x9349('0x12')]();
                    return;
                }
            }
            return this[_0x9349('0x16')](_0x55b823);
        }
        static['RegisterNewPlayer'](_0x2a78c9) {
            var _0x59d262, _0x56533f, _0x2ba488, _0x2370cb, _0x20f813;
            try {
                NetPartyManager['registerNewPlayer'](_0x2a78c9['id']);
                NetMessage[_0x9349('0x17')](ServerManager[_0x9349('0x18')])[_0x9349('0xe')](Network[_0x9349('0x6')]);
                NetMessage[_0x9349('0x19')](_0x2a78c9)[_0x9349('0x1a')]();
                _0x2370cb = NetPartyManager['getActorIdBySocketId'](_0x2a78c9['id']);
                if (Network[_0x9349('0x8')][_0x9349('0x1b')](_0x2370cb)) {
                    _0x20f813 = Network[_0x9349('0x8')][_0x9349('0x1c')](_0x2370cb);
                    NetMessage[_0x9349('0x1d')](_0x2a78c9)[_0x9349('0xe')](_0x20f813);
                }
                _0x2ba488 = {
                    'mapId': $gameMap['mapId'](),
                    'x': $gamePlayer['x'],
                    'y': $gamePlayer['y'],
                    'd': $gamePlayer['direction']()
                };
                NetMessage[_0x9349('0x1e')](_0x2a78c9)[_0x9349('0xe')](_0x2ba488);
                _0x56533f = Network['sessionData'][_0x9349('0x1f')]()['getWorldDataNetwork']();
                return NetMessage[_0x9349('0x20')](_0x2a78c9)[_0x9349('0xe')](_0x56533f);
            } catch (_0x583a98) {
                if (_0x9349('0x21') === _0x9349('0x22')) {
                    if (!Network[_0x9349('0xb')]()) {
                        NetMessage[_0x9349('0xd')](_0x2a78c9)['send'](_0x9349('0xf'));
                        _0x2a78c9[_0x9349('0x12')]();
                        return;
                    }
                    if ($gameParty[_0x9349('0x10')]()) {
                        NetMessage[_0x9349('0xd')](_0x2a78c9)[_0x9349('0xe')]('Server\x20is\x20Full!');
                        _0x2a78c9[_0x9349('0x12')]();
                        return;
                    }
                    if (!Network[_0x9349('0x23')]()) {
                        NetMessage[_0x9349('0xd')](_0x2a78c9)[_0x9349('0xe')](_0x9349('0x24'));
                        _0x2a78c9['disconnect']();
                        return;
                    }
                    return this['RegisterNewPlayer'](_0x2a78c9);
                } else {
                    _0x59d262 = _0x583a98;
                    return Network[_0x9349('0x25')](_0x59d262, _0x9349('0x26'));
                }
            }
        }
        static['OnClientDisconnect'](_0x2a7aa4) {
            if (_0x2a7aa4['id'] === ServerManager['_netServer'][_0x9349('0x27')]['id']) {
                return Network['stopServer']();
            } else {
                return NetMessage['PlayerDisconnect'](_0x2a7aa4)[_0x9349('0x28')](_0x2a7aa4['id'])[_0x9349('0x1a')]();
            }
        }
        static['StartSharedEvent'](_0x1e4603) {
            _0x9349('0x29')['p']();
            if (!ServerManager[_0x9349('0x2a')]()) {
                ServerManager['CreateEventPool'](_0x1e4603['data'][_0x9349('0x2b')]);
            }
            return ServerManager[_0x9349('0x2c')](_0x1e4603);
        }
        static['RegisterOnSharedEvent'](_0x122443) {
            _0x9349('0x2d')['p']();
            if (ServerManager['eventWaitPool'] != null && _0x122443[_0x9349('0x2e')][_0x9349('0x2b')] === ServerManager[_0x9349('0x1')]['waitId']) {
                if ('SGgwn' !== 'SGgwn') {
                    er = error;
                    return Network[_0x9349('0x25')](er, _0x9349('0x26'));
                } else {
                    return ServerManager[_0x9349('0x1')][_0x9349('0x2f')](_0x122443['from'], !![]);
                }
            } else {
                if (_0x9349('0x30') === _0x9349('0x31')) {
                    Network[_0x9349('0x25')]('', _0x9349('0x2c'));
                    '!!!\x20ABORT,\x20something\x20wrong!' ['p']();
                    return ServerManager[_0x9349('0x0')][_0x9349('0x32')](_0x122443[_0x9349('0x33')], -0x64);
                } else {
                    Network[_0x9349('0x25')]('', _0x9349('0x2c'));
                    _0x9349('0x34')['p']();
                    return ServerManager[_0x9349('0x0')][_0x9349('0x32')](_0x122443[_0x9349('0x33')], -0x64);
                }
            }
        }
        static[_0x9349('0x35')](_0x59e84f) {
            _0x9349('0x36')['p'](_0x59e84f[_0x9349('0x2e')][_0x9349('0x37')]);
            if (!ServerManager[_0x9349('0x2a')]()) {
                ServerManager['CreateEventPool'](_0x59e84f[_0x9349('0x2e')][_0x9349('0x2b')]);
            }
            if (_0x59e84f['data'][_0x9349('0x2b')] !== ServerManager[_0x9349('0x1')][_0x9349('0x38')]) {
                return;
            }
            return ServerManager[_0x9349('0x1')][_0x9349('0x2f')](_0x59e84f[_0x9349('0x33')], !![]);
        }
        static['IsEventPoolExists']() {
            return this['eventWaitPool'] != null;
        }
        static[_0x9349('0x39')](_0x360ee4) {
            var _0x2d89ad;
            ServerManager[_0x9349('0x1')] = new AlphaNET[(_0x9349('0x3a'))]['NetWaitPool'](_0x360ee4);
            return ServerManager[_0x9349('0x3b')] = setTimeout(_0x2d89ad = function () {
                if (_0x9349('0x3c') !== 'oxXlQ') {
                    return this[_0x9349('0x1')] != null;
                } else {
                    var _0x22ef65, _0x254f5a;
                    if (((_0x254f5a = ServerManager[_0x9349('0x1')]) != null ? _0x254f5a[_0x9349('0x3d')]() : void 0x0) === ServerManager[_0x9349('0x0')][_0x9349('0x3e')]()) {
                        if ('xluWs' !== _0x9349('0x3f')) {
                            if (ServerManager[_0x9349('0x1')][_0x9349('0x40')]()) {
                                _0x22ef65 = ServerManager[_0x9349('0x1')][_0x9349('0x38')];
                                ServerManager['_netServer'][_0x9349('0x41')](_0x22ef65);
                                ServerManager['eventWaitPool'] = null;
                                return;
                            }
                        } else {
                            if (ServerManager[_0x9349('0x1')]['isPoolReady']()) {
                                if ('ZnffD' !== _0x9349('0x42')) {
                                    actorId = NetPartyManager[_0x9349('0x43')](networkData['from']);
                                    return Network['sessionData'][_0x9349('0x44')](actorId, networkData['data']);
                                } else {
                                    _0x22ef65 = ServerManager[_0x9349('0x1')][_0x9349('0x38')];
                                    ServerManager[_0x9349('0x0')][_0x9349('0x41')](_0x22ef65);
                                    ServerManager[_0x9349('0x1')] = null;
                                    return;
                                }
                            }
                        }
                    }
                    if (ServerManager[_0x9349('0x1')] != null) {
                        if (_0x9349('0x45') !== _0x9349('0x46')) {
                            ServerManager[_0x9349('0x3b')] = setTimeout(_0x2d89ad, 0x64);
                        } else {
                            return Network[_0x9349('0x47')]();
                        }
                    }
                }
            }, 0x64);
        }
        static[_0x9349('0x48')](_0x430d02) {
            var _0x2b5228;
            _0x9349('0x49')['p'](_0x430d02['data']);
            _0x2b5228 = _0x430d02[_0x9349('0x2e')];
            return ServerManager[_0x9349('0x4a')](_0x2b5228, _0x430d02[_0x9349('0x33')]);
        }
        static['RegisterOnSyncPool'](_0x18b347, _0x309483) {
            var _0x1bc15c;
            if (ServerManager[_0x9349('0x2')][_0x18b347] == null) {
                if ('RsedS' !== 'RsedS') {
                    if (_0x309483['id'] === ServerManager[_0x9349('0x0')]['_host']['id']) {
                        return Network['stopServer']();
                    } else {
                        return NetMessage['PlayerDisconnect'](_0x309483)['setFrom'](_0x309483['id'])[_0x9349('0x1a')]();
                    }
                } else {
                    ServerManager[_0x9349('0x2')][_0x18b347] = new AlphaNET[(_0x9349('0x3a'))][(_0x9349('0x4b'))](_0x18b347);
                    ServerManager[_0x9349('0x4c')](_0x18b347);
                }
            }
            _0x1bc15c = ServerManager[_0x9349('0x2')][_0x18b347];
            return _0x1bc15c[_0x9349('0x2f')](_0x309483, !![]);
        }
        static['_startSyncPoolThread'](_0x4d3e9b) {
            var _0x2e1a84;
            return setTimeout(_0x2e1a84 = function () {
                var _0x5c57c0, _0x447e2e;
                _0x5c57c0 = ServerManager[_0x9349('0x2')][_0x4d3e9b];
                if (_0x5c57c0 == null) {
                    return;
                }
                _0x447e2e = ServerManager[_0x9349('0x0')][_0x9349('0x3e')]();
                if (_0x5c57c0[_0x9349('0x3d')]() === _0x447e2e && _0x5c57c0['isPoolReady']()) {
                    ServerManager[_0x9349('0x0')]['onWaitPoolReady'](_0x5c57c0[_0x9349('0x38')]);
                    ServerManager['syncPools'][_0x4d3e9b] = null;
                    return;
                } else {
                    setTimeout(_0x2e1a84, 0x64);
                }
            }, 0x64);
        }
        static[_0x9349('0x4d')](_0x2cb341) {
            var _0x49d874;
            _0x49d874 = NetPartyManager[_0x9349('0x43')](_0x2cb341['from']);
            if (_0x49d874 == null) {
                if (_0x9349('0x4e') === 'TDNEI') {
                    var _0x26e4e9;
                    _0x9349('0x49')['p'](_0x2cb341[_0x9349('0x2e')]);
                    _0x26e4e9 = _0x2cb341[_0x9349('0x2e')];
                    return ServerManager[_0x9349('0x4a')](_0x26e4e9, _0x2cb341[_0x9349('0x33')]);
                } else {
                    return;
                }
            }
            Network['sessionData'][_0x9349('0x4f')](_0x49d874, _0x2cb341['data']);
        }
        static[_0x9349('0x50')](_0x51bc15) {
            return NetWorldManager[_0x9349('0x51')](_0x51bc15['data']);
        }
        static['OnVirtualInterpreter'](_0x3c10b5) {
            var _0x3e44d3, _0x44afd5;
            _0x3e44d3 = _0x3c10b5[_0x9349('0x2e')];
            try {
                return NetWorldManager[_0x9349('0x15')](_0x3e44d3);
            } catch (_0x265535) {
                _0x44afd5 = _0x265535;
                return Network['error'](_0x44afd5, _0x9349('0x52'));
            }
        }
        static[_0x9349('0x53')](_0x30ae9a) {
            var _0x5296fe, _0x410365;
            try {
                if (Network['isHost']()) {
                    _0x5296fe = NetPartyManager[_0x9349('0x43')](_0x30ae9a[_0x9349('0x33')]);
                    return Network[_0x9349('0x8')][_0x9349('0x44')](_0x5296fe, _0x30ae9a['data']);
                }
            } catch (_0x312a59) {
                _0x410365 = _0x312a59;
                return Network[_0x9349('0x25')](_0x410365, 'While\x20try\x20save\x20another\x20actor\x20data');
            }
        }
    };
    AlphaNET[_0x9349('0x54')](ServerManager);
})();

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ BattleManager.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////

(function () {
    //@[DEFINES]
    var _ = BattleManager;

    //@[ALIAS]
    var _alias__startBattle = _.startBattle;
    _.startBattle = function () {
        _alias__startBattle.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer())
            $gameParty.refreshForNetwork();
    };

    //@[ALIAS]
    var _alias__isBusy = _.isBusy;
    _.isBusy = function () {
        var result = _alias__isBusy.call(this, ...arguments);
        return result || Network.isBusy();
    };

    //@[ALIAS]
    var _alias__updateTurn = _.updateTurn;
    _.updateTurn = function () {
        if (!Network.isConnected()) {
            _alias__updateTurn.call(this, ...arguments);
            return;
        }
        if (BattleManager.isNetworkBattleServer()) {
            // * Только на сервере происходит обновление хода
            _alias__updateTurn.call(this, ...arguments);
        } else
            $gameParty.requestMotionRefresh();
    };

    //@[ALIAS]
    var _alias__startTurn = _.startTurn;
    _.startTurn = function () {
        _alias__startTurn.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer()) {
            this._sendBattleOrderToNetwork();
        }
    };

    //@[ALIAS]
    var _alias__setup = _.setup;
    _.setup = function () {
        if (Network.isConnected())
            Network._inBattle = true;
        _alias__setup.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer()) {
            this._sendTroopNetworkIds();
        }
    };

    //@[ALIAS]
    var _alias__endAction = _.endAction;
    _.endAction = function () {
        _alias__endAction.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer()) {
            this._sendActionEndToNetwork();
        }
    };

    //@[ALIAS]
    var _alias__endTurn = _.endTurn;
    _.endTurn = function () {
        if (BattleManager.isNetworkBattleServer()) {
            this._sendTurnEndToNetwork();
        }
        _alias__endTurn.call(this, ...arguments);
        BattleManager.syncNet();
    };

    // * Данный метод работает только на сервере
    //@[ALIAS]
    var _alias__processTurn = _.processTurn;
    _.processTurn = function () {
        if (!Network.isConnected()) {
            _alias__processTurn.call(this, ...arguments);
            return;
        }
        if (BattleManager.isNetworkBattleServer()) {
            var subject = this._subject;
            var action = subject.currentAction();
            _alias__processTurn.call(this, ...arguments);
            if (!action) {
                this._sendProcessTurnToNetwork(subject);
            }
        }
    };

    // * Данный метод работает только на сервере (от processTurn)
    //@[ALIAS]
    var _alias__startAction = _.startAction;
    _.startAction = function () {
        if (!Network.isConnected()) {
            _alias__startAction.call(this, ...arguments);
            return;
        }
        if (BattleManager.isNetworkBattleServer()) {
            _alias__startAction.call(this, ...arguments);
            this._sendStartActionToNetwork(this._targets);
        }
    };

    //TODO: Временно!
    // * Временно отключил его для сети
    //@[ALIAS]
    var _alias__displayStartMessages = _.displayStartMessages;
    _.displayStartMessages = function () {
        if (BattleManager.isNetworkBattle()) {
            return;
        }
        _alias__displayStartMessages.call(this, ...arguments);
    };

    // * Данный метод работает только на сервере (от startAction)
    //@[ALIAS]
    var _alias__invokeNormalAction = _.invokeNormalAction;
    _.invokeNormalAction = function (subject, target) {
        var realTarget = this.applySubstitute(target);
        _alias__invokeNormalAction.call(this, ...arguments);
        $gameParty.refreshForNetwork();
        if (BattleManager.isNetworkBattleServer()) {
            this._sendInvokeNormalToNetwork(subject, realTarget);
        }
    };

    //TODO: invokeCounterAttack
    // * Данный метод работает только на сервере (от startAction)
    //@[ALIAS]
    var _alias__invokeCounterAttack = _.invokeCounterAttack;
    _.invokeCounterAttack = function (subject, target) {
        if (!Network.isConnected()) {
            _alias__invokeCounterAttack.call(this, ...arguments);
            return;
        }
        // * Пока Counter Attack не реализована, обычная  NormalAction
        if (BattleManager.isNetworkBattleServer()) {
            this.invokeNormalAction(subject, target);
        }
    };

    //TODO: invokeMagicReflection
    // * Данный метод работает только на сервере (от startAction)
    //@[ALIAS]
    var _alias__invokeMagicReflection = _.invokeMagicReflection;
    _.invokeMagicReflection = function (subject, target) {
        if (!Network.isConnected()) {
            _alias__invokeMagicReflection.call(this, ...arguments);
            return;
        }
        // * Пока Magic Reflection не реализована, обычная  NormalAction
        if (BattleManager.isNetworkBattleServer()) {
            this.invokeNormalAction(subject, target);
        }
    };

    //@[ALIAS]
    BattleManager._alias__selectNextCommand = _.selectNextCommand;
    _.selectNextCommand = function () {
        if (!Network.isConnected()) {
            this._alias__selectNextCommand.call(this, ...arguments);
            return;
        }
        this._selectInputCommandNetwork('next');
    };

    //@[ALIAS]
    BattleManager._alias__selectPreviousCommand = _.selectPreviousCommand;
    _.selectPreviousCommand = function () {
        if (!Network.isConnected()) {
            this._alias__selectPreviousCommand.call(this, ...arguments);
            return;
        }
        this._selectInputCommandNetwork('prev');
    };


    //@[ALIAS]
    var _alias__endBattle = _.endBattle;
    _.endBattle = function (result) {
        if (Network.isConnected()) {
            BattleManager.syncNet();
            _alias__endBattle.call(this, ...arguments);
        } else {
            _alias__endBattle.call(this, ...arguments);
        }
    };

    // * Данный метод работает только на сервере
    //@[ALIAS]
    var _alias__checkBattleEnd = _.checkBattleEnd;
    _.checkBattleEnd = function () {
        if (Network.isConnected()) {
            if (BattleManager.isNetworkBattleServer()) {
                return _alias__checkBattleEnd.call(this, ...arguments);
            } else {
                return false;
            }
        } else
            return _alias__checkBattleEnd.call(this, ...arguments);
    };

    // * Данный метод работает только на сервере (из checkBattleEnd)
    //@[ALIAS]
    var _alias__checkAbort = _.checkAbort;
    _.checkAbort = function () {
        if (Network.isConnected()) {
            if ($gameParty.isEmpty() || this.isAborting()) {
                SoundManager.playEscape();
                this._escaped = true;
                this._sendAbortBattleToNetwork();
                this.processAbort();
            }
            return false;
        } else {
            return _alias__checkAbort.call(this);
        }
    };

    // * Данный метод работает только на сервере (из checkBattleEnd)
    //@[ALIAS]
    var _alias__processVictory = _.processVictory;
    _.processVictory = function () {
        if (BattleManager.isNetworkBattleServer()) {
            this._sendVictoryToNetwork();
        }
        _alias__processVictory.call(this, ...arguments);
    };

    // * Данный метод работает только на сервере (из checkBattleEnd)
    //@[ALIAS]
    var _alias__processDefeat = _.processDefeat;
    _.processDefeat = function () {
        if (BattleManager.isNetworkBattleServer()) {
            this._sendDefeatToNetwork();
        }
        _alias__processDefeat.call(this, ...arguments);
    };

    //@[ALIAS]
    var _alias__processEscape = _.processEscape;
    _.processEscape = function () {
        if (Network.isConnected()) {
            return _alias__processEscape.call(this, ...arguments);
        } else {
            if (BattleManager.isNetworkBattleServer()) {
                var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
                this._sendEscapeToNetwork(success);
                this._onEscapeFromNetwork(success); // * Логика вынесена отдельно для севрера и клиента
                return success;
            }
            return false;
        }
    };

})();

// ■ END BattleManager.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ BattleManager_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//?[NEW]
BattleManager.isNetworkBattle = function () {
    return Network.isConnected() && Network.inBattle();
};

//?[NEW]
BattleManager.isNetworkBattleServer = function () {
    return BattleManager.isNetworkBattle() && Network.isHost();
};

//?[NEW]
BattleManager.convertBattlersToIds = function (arrayOfBattlers) {
    return arrayOfBattlers.map(item => {
        return BattleManager.getIdByBattleSubject(item);
    });
};

//?[NEW]
BattleManager.convertIdsToBattlers = function (arrayOfIds) {
    return arrayOfIds.map(item => {
        return BattleManager.getBattleSubjectById(item);
    });
};

//?[NEW]
BattleManager.getBattleSubjectById = function (id) {
    if (id < 900)
        return $gameParty.memberByActorId(id);
    else
        return $gameTroop.getEnemyByNetId(id);
};

//?[NEW]
BattleManager.getIdByBattleSubject = function (subject) {
    if (subject == null)
        subject = this._subject;
    if (subject.isActor()) {
        return subject.actorId();
    } else {
        return subject.uniqueNetworkId();
    }
};

//?[NEW]
BattleManager.isMyActorInput = function () {
    if (!Network.isConnected()) return true;
    var myIndex = $gameParty.memberIndexByActorId(NetPartyManager.getMyActorId());
    return myIndex == this._actorIndex;
};

//?[NEW]
BattleManager.syncNet = function () {
    if (BattleManager.isNetworkBattle()) {
        Network.requestSync();
    }
};

//?[NEW]
BattleManager._processTurnFromNetwork = function (subjectId) {
    try {
        var subject = this.getBattleSubjectById(subjectId);
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
    } catch (error) {
        AlphaNET.error(error, ' processTurnFromNetwork');
    }
};

//?[NEW]
BattleManager._startActionFromNetwork = function (targets) {
    this._startActionFromNetworkDefault(targets);
};

//?[NEW]
BattleManager._startActionFromNetworkDefault = function (targets) {
    try {
        this._subject = this.getNextSubject();
        if (this._subject == null) {
            return;
        }
        this._action = this._subject.currentAction();
        this._subject.useItem(this._action.item());
        this.refreshStatus();
        this._action.applyGlobal();
        this._targets = this.convertIdsToBattlers(targets);
    } catch (error) {
        AlphaNET.error(error, ' startActionFromNetwork  : DEFAULT');
        return;
    }
    if (this._targets.length > 0) {
        try {
            this._logWindow.startAction(this._subject, this._action, this._targets);
        } catch (error) {
            console.error(error);
        }
    }
};

//?[NEW]
BattleManager._selectInputCommandFromNetwork = function (commnadName) {
    try {
        if (commnadName == 'next')
            this._alias__selectNextCommand.call(this);
        else
            this._alias__selectPreviousCommand.call(this);
    } catch (error) {
        AlphaNET.error(error, ' _selectInputCommandFromNetwork');
        this._alias__selectNextCommand.call(this);
    }
};

//?[NEW]
BattleManager._invokeNormalActionFromNetwork = function (subjectId, targetId) {
    try {
        var subject = this.getBattleSubjectById(subjectId);
        var target = this.getBattleSubjectById(targetId);
        this._logWindow.displayActionResults(subject, target);
    } catch (error) {
        AlphaNET.error(error, 'invokeNormalActionFromNetwork');
    }
};

//?[NEW]
BattleManager._abortBattleCommandFromNetwork = function () {
    SoundManager.playEscape();
    this._escaped = true;
    this.processAbort();
};

//?[NEW]
BattleManager._onEscapeFromNetwork = function (success) {
    $gameParty.performEscape();
    SoundManager.playEscape();
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
};

//?[NEW]
BattleManager._sendBattleOrderToNetwork = function () {
    var orderData = this.convertBattlersToIds(BattleManager._actionBattlers);
    //console.info(BattleManager._actionBattlers);
    var data = NetMessage.CreateSubMessageData('battleOrder');
    data.orderData = orderData;
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendNetworkMsg = function (data) {
    Network.sendMessage(NetMessage.BattleManager().setData(data));
};

//?[NEW]
BattleManager._sendTroopNetworkIds = function () {
    var troopIds = $gameTroop.members().map(item => item.uniqueNetworkId());
    var data = NetMessage.CreateSubMessageData('enemyIds');
    data.troopIds = troopIds;
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendActionEndToNetwork = function () {
    this._sendNetworkMsg(NetMessage.CreateSubMessageData('endAction'));
};

//?[NEW]
BattleManager._sendTurnEndToNetwork = function () {
    this._sendNetworkMsg(NetMessage.CreateSubMessageData('endTurn'));
};

//?[NEW]
BattleManager._sendProcessTurnToNetwork = function (subject) {
    var data = NetMessage.CreateSubMessageData('processTurn');
    data.subjectId = this.getIdByBattleSubject(subject);
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendStartActionToNetwork = function (targets) {
    var data = NetMessage.CreateSubMessageData('startAction');
    data.targets = this.convertBattlersToIds(targets);
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendInvokeNormalToNetwork = function (subject, target) {
    var data = NetMessage.CreateSubMessageData('invokeNormal');
    data.subjectId = this.getIdByBattleSubject(subject);
    data.targetId = this.getIdByBattleSubject(target);
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._selectInputCommandNetwork = function (commandName) {
    var method = this._alias__selectNextCommand;
    if (commandName == 'prev')
        method = this._alias__selectPreviousCommand;
    if (this.actor()) {
        if (BattleManager.isMyActorInput()) {
            method.call(this);
            Network.sendMessage(NetMessage.BattleInputCommand().setData(commandName));
        }
    } else {
        method.call(this);
    }
};

//?[NEW]
BattleManager._sendAbortBattleToNetwork = function () {
    var data = NetMessage.CreateSubMessageData('abortBattle');
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendVictoryToNetwork = function () {
    var data = NetMessage.CreateSubMessageData('victory');
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendDefeatToNetwork = function () {
    var data = NetMessage.CreateSubMessageData('defeat');
    this._sendNetworkMsg(data);
};

//?[NEW]
BattleManager._sendEscapeToNetwork = function (success) {
    var data = NetMessage.CreateSubMessageData('escape');
    data.success = success;
    this._sendNetworkMsg(data);
};

// ■ END BattleManager_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ DataManager.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

    //@[ALIAS]
    var _alias_DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        var contents = _alias_DataManager_makeSaveContents.call(this, ...arguments);
        try {
            if (Network.isConnected()) {
                if (Network.isHost() && Network.sessionData != null) {
                    contents.network = Network.sessionData.makeSaveContents();
                }
            }
        } catch (error) {
            AlphaNET.error(error, ' create network world save data');
        }
        return contents;
    };

    //@[ALIAS]
    var _alias_DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _alias_DataManager_extractSaveContents.call(this, ...arguments);
        try {
            if (contents.network != null) {
                if (Network.sessionData == null)
                    Network.sessionData = new AlphaNET.LIBS.NetSessionData();
                Network.sessionData.extractSaveContents(contents.network);
            }
        } catch (error) {
            AlphaNET.error(error, ' load network world save data');
        }
    };

    //@[ALIAS]
    var _alias_DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function () {
        _alias_DataManager_createGameObjects.call(this, ...arguments);
        AlphaNET.ExtraPluginSupport();
    };

})();
// ■ END DataManager.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ ExtraPluginsSupport.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
AlphaNET.ExtraPluginSupport = (function () {

    // * Yanfly Engine Plugins - Item Core
    (function () {
        if (Imported.YEP_ItemCore == null)
            return;
        try {
            //@[ALIAS]
            var _alias_Game_Party_getDataForNetwork = Game_Party.prototype.getDataForNetwork;
            Game_Party.prototype.getDataForNetwork = function () {
                var result = _alias_Game_Party_getDataForNetwork.call(this, ...arguments);

                var weapons = {};
                for (const [key, value] of Object.entries($gameParty._weapons)) {
                    var newKey = Number(key) - Yanfly.Param.ItemStartingId;
                    weapons[newKey] = value;
                }
                result.weapons = JSON.stringify(weapons);

                var armors = {};
                var realArmors = $gameParty.armors();
                for (var i = 0; i < realArmors.length; i++) {
                    var baseId = DataManager.getBaseItem(realArmors[i]).id;
                    if (armors[baseId] == null)
                        armors[baseId] = 1;
                    else
                        armors[baseId] += 1;
                }
                result.armors = JSON.stringify(armors);

                return result;
            };

            //$[OVER]
            Game_Party.prototype._setArmorsFromNetwork = function (armors) {
                if (armors != null) {
                    try {
                        var temp = JSON.parse(armors);
                        for (const [key, value] of Object.entries(temp)) {
                            var item = $dataArmors[Number(key)];
                            $gameParty.gainItem(item, value);
                        }
                    } catch (error) {
                        AlphaNET.error(error, ' load player armors from Network');
                    }
                }
            };


        } catch (error) {
            AlphaNET.warning('Alpha NET compatibility for YEP_ItemCore.js not loaded!');
        }
    })();

});
// ■ END ExtraPluginsSupport.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Action.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function (target) {
        _alias_Game_Action_apply.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer()) {
            this._sendActionResultToNetwork(target);
        }
    };

    //@[ALIAS]
    var _alias_Game_Action_setSkill = Game_Action.prototype.setSkill;
    Game_Action.prototype.setSkill = function (skillId) {
        _alias_Game_Action_setSkill.call(this, ...arguments);
        if (BattleManager.isNetworkBattle()) {
            this._sendSetActionSkillToNetwork(skillId);
        }
        this._outerCall = false;
    };

    //@[ALIAS]
    var _alias_Game_Action_setItem = Game_Action.prototype.setItem;
    Game_Action.prototype.setItem = function (itemId) {
        _alias_Game_Action_setItem.call(this, ...arguments);
        if (BattleManager.isNetworkBattle()) {
            this._sendSetActionItemToNetwork(itemId);
        }
        this._outerCall = false;
    };

    //@[ALIAS]
    var _alias_Game_Action_setTarget = Game_Action.prototype.setTarget;
    Game_Action.prototype.setTarget = function (targetIndex) {
        _alias_Game_Action_setTarget.call(this, ...arguments);
        if (BattleManager.isNetworkBattle()) {
            this._sendSetActionTargetToNetwork(targetIndex);
        }
        this._outerCall = false;
    };

    //?[NEW]
    Game_Action.prototype.setSkillFromNet = function (skillId) {
        this._outerCall = true;
        "Game_Action: Skill set from Net".p(skillId);
        this.setSkill(skillId);
    };

    //?[NEW]
    Game_Action.prototype.setItemFromNet = function (itemId) {
        this._outerCall = true;
        "Game_Action: Item set from Net".p(itemId);
        this.setItem(itemId);
    };

    //?[NEW]
    Game_Action.prototype.setTargetFromNet = function (targetIndex) {
        this._outerCall = true;
        "Game_Action: Target set from Net".p(targetIndex);
        this.setTarget(targetIndex);
    };

})();
// ■ END Game_Action.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Action_private.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var _;
    //@[CLASS IMPL ONLY]

    //@[DEFINES]
    _ = Game_Action.prototype;
    _._sendActionResultToNetwork = function (target) {
        var data;
        if (BattleManager._phase !== 'action') {
            return;
        }
        data = NetMessage.CreateSubMessageData('setResult');
        data.sbj = BattleManager.getIdByBattleSubject(this.subject());
        data.target = BattleManager.getIdByBattleSubject(target);
        data.result = target.result();
        this._sendActionNetMsg(data);
    };
    _._sendActionNetMsg = function (data) {
        return Network.sendMessage(NetMessage.BattleAction().setData(data));
    };
    _._sendSetActionSkillToNetwork = function (skillId) {
        return this._createActionNetMessage('setSkill', skillId);
    };
    _._createActionNetMessage = function (name, actionId) {
        var data;
        if (this._outerCall === true) {
            return;
        }
        if (!(this._subjectActorId > 0)) {
            return;
        }
        data = NetMessage.CreateSubMessageData(name);
        data.actionId = actionId;
        data.actorId = this._subjectActorId;
        this._sendActionNetMsg(data);
    };
    _._sendSetActionItemToNetwork = function (itemId) {
        return this._createActionNetMessage('setItem', itemId);
    };
    _._sendSetActionTargetToNetwork = function (targetIndex) {
        return this._createActionNetMessage('setTarget', targetIndex);
    };
})();

// ■ END Game_Action_private.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_ActionResult_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//?[NEW]
Game_ActionResult.prototype.setupFromOuterData = function (data) {
    var item = this;
    Object.getOwnPropertyNames(data).forEach(function (key, index) {
        item[key] = data[key];
    });
};
// ■ END Game_ActionResult_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Actor.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Actor_refresh = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function () {
        _alias_Game_Actor_refresh.call(this, ...arguments);
        if (this._isNeedNetworkRefresh()) {
            this._sendRefreshMessageToNetwork(this.actorId());
        }
    };
})();
// ■ END Game_Actor.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Actor_X.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//$[OVER]
Game_Actor.prototype.performDamage = function () {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        if (this == $gameParty.leader())
            $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};
// ■ END Game_Actor_X.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Battler.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

    //TODO: Game_Battler.escape - не синхронизирован. Т.е. один игрок может  убежать, если у вещи есть
    //специальный эффект, но это не синхронизируется, бой встаёт!

    //@[ALIAS]
    var _alias_Game_Battler_consumeItem = Game_Battler.prototype.consumeItem;
    Game_Battler.prototype.consumeItem = function (item) {
        if (Network.isConnected()) {
            if (this == $gameParty.leader()) {
                "CONSUME ITEM".p();
                _alias_Game_Battler_consumeItem.call(this, ...arguments);
            }
        } else {
            _alias_Game_Battler_consumeItem.call(this, ...arguments);
        }
    };

    //@[ALIAS]
    var _alias_Game_Battler_meetsItemConditions = Game_Battler.prototype.meetsItemConditions;
    Game_Battler.prototype.meetsItemConditions = function (item) {
        if (Network.isConnected()) {
            if (this == $gameParty.leader()) {
                return _alias_Game_Battler_meetsItemConditions.call(this, item);
            } else {
                return this.meetsUsableItemConditions(item);
            }
        } else
            return _alias_Game_Battler_meetsItemConditions.call(this, item);
    };
})();
// ■ END Game_Battler.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Battler_private.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var _;
    //@[CLASS IMPL ONLY]

    //@[DEFINES]
    _ = Game_Battler.prototype;
    _._sendRefreshMessageToNetwork = function (netId) {
        var data, msg;
        data = this._collectDataForNetwork();
        data.id = netId;
        msg = NetMessage.BattleBattlerRefreshData().setData(data);
        Network.sendMessage(msg);
    };
    _._collectDataForNetwork = function () {
        var data;
        return data = {
            hp: this._hp,
            mp: this._mp,
            tp: this._tp,
            states: this._states
        };
    };
    _._isNeedNetworkRefresh = function () {
        var phase;
        if (BattleManager.isNetworkBattleServer()) {
            phase = BattleManager._phase;
            return phase === 'action' || phase === 'start';
        }
        return false;
    };
})();

// ■ END Game_Battler_private.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Character.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Character_initMembers = Game_Character.prototype.initMembers;
    Game_Character.prototype.initMembers = function () {
        _alias_Game_Character_initMembers.call(this, ...arguments);
        this._networkIconId = 0;
    };
})();
// ■ END Game_Character.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Character_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////

//?[NEW]
Game_Character.prototype.synchronizeFromNetwork = function (netCharData) {
    this.onNetworkCharacterData(netCharData.charData);
    this.locate(netCharData.locatePoint.x, netCharData.locatePoint.y);
    this.onNetworkDirectionData(netCharData.locatePoint.direction);
};

//?[NEW]
Game_Character.prototype.onNetworkCharacterData = function (characterData) {
    this.updateNetworkData(characterData);
};

//?[NEW]
Game_Character.prototype.updateNetworkData = function (characterData) {
    for (var key in characterData) {
        this[key] = characterData[key];
    }
};

//?[NEW]
Game_Character.prototype.onNetworkDirectionData = function (d) {
    this._direction = d;
};

//?[NEW]
Game_Character.prototype.collectDataForNetwork = function () {
    var data = this._collectDataForNetwork();
    data.locatePoint = {
        x: this._x,
        y: this._y,
        direction: this._direction
    };
    return data;
};

//?[NEW]
Game_Character.prototype._collectDataForNetwork = function () {
    var data = {};
    data.charData = this._collectCharDataForNetwork();
    data.moveData = this._collectMoveDataForNetwork();
    return data;
};

//?[NEW]
Game_Character.prototype._collectCharDataForNetwork = function () {
    var data = {};
    data._moveSpeed = this.realMoveSpeed();
    data._opacity = this.opacity();
    data._blendMode = this.blendMode();
    data._walkAnime = this.hasWalkAnime();
    data._stepAnime = this.hasStepAnime();
    data._directionFix = this.isDirectionFixed();
    data._transparent = this.isTransparent();
    data._direction = this._direction;
    return data;
};

//?[NEW]
Game_Character.prototype._collectMoveDataForNetwork = function () {
    return {
        x: this.x,
        y: this.y
    };
};

//?[NEW]
Game_Character.prototype.onNetworkMoveData = function (moveData) {
    this._moveFromNetwork(moveData);
};

//?[NEW]
Game_Character.prototype._moveFromNetwork = function (point) {
    try {
        var sx = this.deltaXFrom(point.x);
        var sy = this.deltaYFrom(point.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this._moveStraightNetwork(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this._moveStraightNetwork(sy > 0 ? 8 : 2);
        }
    } catch (e) {

    }
};

//?[NEW]
Game_Character.prototype._moveStraightNetwork = function (d) {
    this.setMovementSuccess(true);
    this.setDirection(d);
    this._x = $gameMap.roundXWithDirection(this._x, d);
    this._y = $gameMap.roundYWithDirection(this._y, d);
    this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
    this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
    this.increaseSteps();
};

//?[NEW]
Game_Character.prototype.networkIconId = function () {
    return this._networkIconId;
};

//?[NEW]
Game_Character.prototype._startNetworkIcon = function () {
    this._networkIconId = 0;
};

//?[NEW]
Game_Character.prototype.showNetworkIcon = function (iconId) {
    this._networkIconId = iconId;
};
// ■ END Game_Character_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Enemy.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function () {
        _alias_Game_Enemy_setup.call(this, ...arguments);
        if (BattleManager.isNetworkBattleServer()) {
            this._uniqueNetworkId = 901 + $gameTroop.members().length;
            "UID".p(this._uniqueNetworkId);
        }
    };

    //?[NEW]
    Game_Enemy.prototype.uniqueNetworkId = function () {
        return this._uniqueNetworkId;
    };

    //@[ALIAS]
    var _alias_Game_Enemy_refresh = Game_Enemy.prototype.refresh;
    Game_Enemy.prototype.refresh = function () {
        _alias_Game_Enemy_refresh.call(this, ...arguments);
        if (this._isNeedNetworkRefresh()) {
            this._sendRefreshMessageToNetwork(this.uniqueNetworkId());
        }
    };
})();
// ■ END Game_Enemy.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Event.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////

(function () {

    //@[ALIAS]
    var _Game_Event_prototype_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function () {
        _Game_Event_prototype_initMembers.call(this);
        this._isOnlyLocalMovement = false;
        this._isNetworkSharedMode = false;
        this._isStartedFromNetwork = false;
        this._networkSyncCommands = [];
    };

    //@[ALIAS]
    var _alias_Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function () {
        _alias_Game_Event_initialize.call(this, ...arguments);
        this._checkNetworkGlobalSymbols();
    };

    //?[NEW]
    Game_Event.prototype.isLockedByNet = function () {
        return $gameMap.isEventLockedByNet(this.eventId());
    };

    //?[NEW]
    Game_Event.prototype._checkNetworkGlobalSymbols = function () {
        try {
            var ev = this.event();
            if (ev.note.contains('LOCAL')) {
                //"LOCAL".p(ev.id);
                this.setLocalMovementMode(true);
            }
            if (ev.note.contains('NET')) {
                //"NET ALL".p(ev.id);
                this.setLocalMovementMode(true);
                this.setNetworkSharedMode(true);
            }
        } catch (error) {
            AlphaNET.error(error, ' read network global symbols from Event');
        }
    };

    //?[NEW]
    Game_Event.prototype.isOnlyLocalMoveMode = function () {
        return this._isOnlyLocalMovement == true;
    };

    //?[NEW]
    Game_Event.prototype.setLocalMovementMode = function (bool) {
        this._isOnlyLocalMovement = bool;
    };

    //?[NEW]
    Game_Event.prototype.setNetworkSharedMode = function (bool) {
        this._isNetworkSharedMode = bool;
    };

    //?[NEW]
    Game_Event.prototype.isNetworkSharedMode = function () {
        return (this._isNetworkSharedMode == true);
    };

    // * Когда Event движется, он передаёт все свои данные через сервер другим игрокам
    //@[ALIAS]
    var _Game_Event_prototype_moveStraight = Game_Event.prototype.moveStraight;
    Game_Event.prototype.moveStraight = function (d) {
        _Game_Event_prototype_moveStraight.call(this, d);
        if (Network.isConnected() && !this.isOnlyLocalMoveMode()) {
            var data = this._collectEventBasicDataForNetwork();
            data.moveData = this._collectDataForNetwork();
            Network.sendMessage(NetMessage.MapEventMoveData().setData(data));
        }
    };

    //?[NEW]
    Game_Event.prototype._collectEventBasicDataForNetwork = function () {
        var data = {
            eventId: this.eventId(),
            mapId: $gameMap.mapId()
        };
        return data;
    };

    // * Когда Event меняет Direction, он передаёт все свои данные через сервер другим игрокам
    //@[ALIAS]
    var _Game_Event_prototype_setDirection = Game_Event.prototype.setDirection;
    Game_Event.prototype.setDirection = function (d) {
        _Game_Event_prototype_setDirection.call(this, d);
        if (Network.isConnected() && !this.isOnlyLocalMoveMode()) {
            this._syncDirectionNetwork(d);
        }
    };

    //?[NEW]
    Game_Event.prototype._syncDirectionNetwork = function (d) {
        if (!this.isDirectionFixed() && d) {
            var data = this._collectEventBasicDataForNetwork();
            data.directionData = d;
            Network.sendMessage(NetMessage.MapEventMoveData().setData(data));
        }
    };

    //@[ALIAS]
    var _Game_Event_prototype_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function () {
        if (Network.isConnected() &&
            !Network.isHost() &&
            !this.isOnlyLocalMoveMode()) {
            //?EMPTY
            //* Все движения событий обрабатываются на хосте, кроме только локальных
        } else {
            _Game_Event_prototype_updateSelfMovement.call(this);
        }
    };

    // * Эта функция вызывается на Хосте, когда он находится не на сцене карты
    // * Она нужна, чтобы события продолжали SelfMovement и не зависали у всех игроков
    //?[NEW]
    Game_Event.prototype.updateForNetwork = function () {
        Game_Character.prototype.update.call(this);
    };

    //@[ALIAS]
    var _alias_Game_Event_list = Game_Event.prototype.list;
    Game_Event.prototype.list = function () {
        if (this.isNeedStartSyncCommand()) {
            "RUN EVENT SYNC COMMAND".p();
            return this._createSyncCommandsList();
        } else if (this.isLockedByNet()) {
            return [];
        } else
            return _alias_Game_Event_list.call(this, ...arguments);
    };

    //@[ALIAS]
    var _alias_Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _alias_Game_Event_update.call(this, ...arguments);
        if (this.isNeedStartSyncCommand()) {
            this._starting = true;
        }
    };

    //?[NEW]
    Game_Event.prototype.startFromNetwork = function () {
        this._isStartedFromNetwork = true;
        if (this.sharedPageIndex >= 0) {
            this._pageIndex = this.sharedPageIndex;
            this.sharedPageIndex = -1;
        }
        this.start();
    };

    //?[NEW]
    Game_Event.prototype.isStartedFromNetwork = function () {
        return this._isStartedFromNetwork == true;
    };

    //?[NEW]
    Game_Event.prototype.clearStartFromNetwork = function () {
        this._isStartedFromNetwork = false;
    };
})();

// ■ END Game_Event.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Event_private.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var _;
    //@[CLASS IMPL ONLY]

    //@[DEFINES]
    _ = Game_Event.prototype;
    _.isNeedStartSyncCommand = function () {
        return this._networkSyncCommands.length > 0;
    };
    _.executeSyncCommandFromNetwork = function (pageIndex = 0, listIndex = -1) {
        this._networkSyncCommands.push([...arguments]);
        "COMMAND ADDED TO networkSyncCommands".p();
        if (!this.isStarting()) {
            return this._starting = true;
        }
    };
    _._createSyncCommandsList = function () {
        var list;
        list = this._networkSyncCommands.map((command) => {
            var item;
            item = this._getSyncCommand(...command);
            if (item != null) {
                return item;
            }
        });
        this._networkSyncCommands = [];
        return list;
    };
    _._getSyncCommand = function (pageIndex = 0, listIndex = -1) {
        var page;
        page = this.event().pages[pageIndex];
        if (page != null) {
            return this._getSyncCommandLine(page, listIndex);
        } else {
            return this._syncCommandLineNotFounded();
        }
    };
    _._getSyncCommandLine = function (page, index = -1) {
        var line, list;
        if (index < 0) {
            this._syncCommandLineNotFounded();
        }
        list = page.list;
        if (!((list != null) && list.length > 1)) {
            this._syncCommandLineNotFounded();
        }
        line = list[index];
        if (line != null) {
            return line;
        } else {
            return this._syncCommandLineNotFounded();
        }
    };
    _._syncCommandLineNotFounded = function () {
        AlphaNET.error('', 'Cannot Sync. Event Line not founded!');
        return null;
    };
})();

// ■ END Game_Event_private.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Followers.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//$[OVER]
Game_Followers.prototype.initialize = function () {
    this._visible = true;
    this._gathering = false;
    this._data = [];
    for (var i = 0; i < Network.maximumNetworkPlayers; i++) {
        this._data.push(new AlphaNET.LIBS.NetworkCharacter(i));
    }
    this._netCharIdStore = null; // * Для оптимизации
};

//?[NEW]
Game_Followers.prototype.getNetworkCharById = function (id) {
    if (this._netCharIdStore == null)
        this._generateStore();
    return this._netCharIdStore[id];
};

// * Создаём хэш ID и character, чтобы каждый раз не искать по ID в _data
//?[NEW] 
Game_Followers.prototype._generateStore = function () {
    this._netCharIdStore = {};
    this._data.forEach(item => {
        this._netCharIdStore[item.netId] = item;
    });
};

//$[OVER]
Game_Followers.prototype.update = function () {
    this.forEach(function (follower) {
        follower.update();
    }, this);
};

//@[ALIAS]
/*var _alias_Game_Followers_updateMove = Game_Followers.prototype.updateMove;
Game_Followers.prototype.updateMove = function () {
    if(Network.isConnected()) {
        if (!Network.isHost()) return;
        for (var i = this._data.length - 1; i >= 0; i--) {
            var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
            this._data[i].chaseCharacter(precedingCharacter);
        }
    } else
        _alias_Game_Followers_updateMove.call(this, ...arguments);
};*/ //TODO: Gather можно реализовать

//?[NEW]
Game_Followers.prototype.count = function () {
    return this._data.length;
};

//?[NEW]
Game_Followers.prototype.refreshNetwork = function () {
    this._data.forEach(item => item.refreshNet());
    this._generateStore();
};
// ■ END Game_Followers.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Interpreter.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

    // * 1 - сделать выполнение событий с Sync, only, except командами - OK
    //  Проверить если событие запущено другое, а приходит синхронизация - OK
    //  Проверить очередь - OK
    // * 2 - сделать NET ALL событие с Sync, only, except командами + регулировка одновременного старта - OK
    // * 3 - параллельные события ???
    // * 4 - indent, ветвление ???
    // * 5 - общие события (обыные, параллельные, автоматические) ???

    //@[DEFINES]
    var _ = Game_Interpreter.prototype;

    //@[ALIAS]
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'NET') {
            switch (args[0]) {
                /* jshint -W086 */
                case 'start':
                    AlphaNET.startServer();
                    // * Тут нет Break намеренно, так как сразу соединение нужно к серверу
                case 'connect':
                    AlphaNET.connectToServer();
                    break;
                case 'disconnect':
                    AlphaNET.disconnectFromServer();
                    break;
                case 'hotSeat':
                    AlphaNET.startAnotherClient();
                    break;
                case 'stop':
                    AlphaNET.stopServer();
                    break;
                case 'sync':
                    this._onNETSyncCommand();
                    break;
                case 'lock':
                    this._onNETLockCommand();
                    break;
                case 'only':
                case 'except':
                    this._onNETConditionCommand(args);
                    break;
                case 'virtual':
                    this._onNETVirtualCommand();
                    break;
                case 'restrict':
                    if (Network.isHost())
                        Network._allowConnection = false;
                    break;
                case 'allow':
                    if (Network.isHost())
                        Network._allowConnection = true;
                    break;
                default:
                    break;
            }
        }
    };

    //@[ALIAS]
    var _alias_Game_Interpreter_clear = Game_Interpreter.prototype.clear;
    Game_Interpreter.prototype.clear = function () {
        _alias_Game_Interpreter_clear.call(this);
        this._network = new AlphaNET.LIBS.InterpreterNET();
    };

    //@[ALIAS]
    var _alias__setup = _.setup;
    _.setup = function () {
        _alias__setup.call(this, ...arguments);
        if (Network.isConnected() && this._eventId > 0) {
            this._network.setup(this._eventId, this._list);
            if (this._network.isShared() && this.isRunning()) {
                this._network.startNetwork();
            }
        }
    };

    //@[ALIAS]
    var _alias__updateWaitMode = _.updateWaitMode;
    _.updateWaitMode = function () {
        if (this._waitMode == 'network') {
            return this._updateWaitModeNetwork();
        } else {
            this._network.resetWait();
            return _alias__updateWaitMode.call(this, ...arguments);
        }
    };

    //?[NEW]
    _._updateWaitModeNetwork = function () {
        if (!Network.isBusy()) {
            return this._network.updateWaitMode();
        }
        return true; // * Continue waiting
    };

    //@[ALIAS]
    var _alias__setupChoices = _.setupChoices;
    _.setupChoices = function () {
        _alias__setupChoices.call(this, ...arguments);
        if (Network.isConnected()) {
            $gameMessage.setSharedChoiseMode(this._network.isShared());
        }
    };

    // * Transfer Player
    //@[ALIAS]
    var _alias__command201 = _.command201;
    _.command201 = function () {
        return this._startCommandOnlyInSharedMode(_alias__command201, arguments);
    };


    // * Battle Processing
    //@[ALIAS]
    var _alias__command301 = _.command301;
    _.command301 = function () {
        return this._startCommandOnlyInSharedMode(_alias__command301, arguments);
    };

    //@[ALIAS]
    var _alias__terminate = _.terminate;
    _.terminate = function () {
        _alias__terminate.call(this, ...arguments);
        if (this._needEventUnlock) { // * Unlock the event
            this._onNETLockCommand(false);
        }
    };

    //?[NEW]
    _.command900 = function () {
        this.setWaitMode('network');
        return this._network.command900();
    };

    //?[NEW]
    _.command901 = function () {
        this.setWaitMode('network');
        return this._network.command901(this._index);
    };

    // * Change Party Member
    //@[ALIAS]
    var _alias__command129 = _.command129;
    _.command129 = function () {
        if (Network.isConnected()) {
            AlphaNET.warning('Change Party Member (129) - not allowed in Network game!');
            return true;
        } else
            return _alias__command129.call(this, ...arguments);
    };

    // * Getting On and Off Vehicles
    //@[ALIAS]
    var _alias__command206 = _.command206;
    _.command206 = function () {
        if (Network.isConnected()) {
            AlphaNET.warning('Getting On and Off Vehicles (206) - not allowed in Network game!');
            return true;
        } else
            return _alias__command206.call(this, ...arguments);
    };

    // * Change Player Followers
    //@[ALIAS]
    var _alias__command216 = _.command216;
    _.command216 = function () {
        if (Network.isConnected()) {
            AlphaNET.warning('Change Player Followers (216) - not allowed in Network game!');
            return true;
        } else
            return _alias__command216.call(this, ...arguments);
    };

    // * Gather Followers
    //$[OVER]
    _.command217 = function () {
        AlphaNET.warning('Gather Followers (217) - not working with Alpha NET plugin');
        return true;
    };

    //@[ALIAS]
    var _alias__executeCommand = _.executeCommand;
    _.executeCommand = function () {
        if (Network.isConnected())
            this._networkSynchronization();
        return _alias__executeCommand.call(this, ...arguments);
    };

})();

// ■ END LibGame_Interpreter
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
//Compressed by MV Plugin Builder
(function () {
    var _0x2737 = [
        'currentCommand',
        '_isSyncCommandRequire',
        'code',
        '_isSyncCommandValid',
        'FbIrz',
        '_executeSyncCommand',
        'nextEventCode',
        '_getBasicEventDataForNet',
        'sendMessage',
        '_mapId',
        'eventId',
        'fUnVM',
        'event',
        '_pageIndex',
        'include',
        'get\x20page\x20index\x20for\x20event\x20sync\x20command',
        '_onNETLockCommand',
        'bGoca',
        '_needEventUnlock',
        'isLock',
        'setData',
        '_executeConditionCommand',
        'IhFkg',
        'GkRIf',
        'split',
        'map',
        'dsSCY',
        'while\x20read\x20condition\x20excpet\x20or\x20only',
        'isHost',
        'NaAOv',
        'getMyPlayerIndex',
        'getMyActorId',
        'contains',
        'oWEeE',
        '_index',
        '_isListLineIsSynced',
        'dLqwJ',
        '_list',
        'parameters',
        'NET\x20sync',
        'kyjgH',
        'error',
        'while\x20check\x20list[index]\x20to\x20sync\x20line',
        '_startCommandOnlyInSharedMode',
        'vDIdw',
        'call',
        'warning',
        'This\x20command\x20allowed\x20only\x20in\x20NET\x20shared\x20events',
        '_networkSynchronization',
        'QcgFW',
        'zhrEi',
        'utYHf',
        '_sendVirtualCommand',
        'CreateSubMessageData',
        'mapId',
        '_eventId',
        '_onNETVirtualCommand',
        'RgjoN',
        'ajKem',
        'dsZBH',
        'qcZIp',
        '_executeVirtualCommand',
        '_onNETSyncCommand',
        'isConnected',
        'ThOeD',
        '_network',
        'isShared'
    ];
    (function (_0x137076, _0x3a2ed2) {
        var _0x140bc3 = function (_0x32ac4c) {
            while (--_0x32ac4c) {
                _0x137076['push'](_0x137076['shift']());
            }
        };
        _0x140bc3(++_0x3a2ed2);
    }(_0x2737, 0x81));
    var _0x1722 = function (_0x4645c2, _0x4d6512) {
        _0x4645c2 = _0x4645c2 - 0x0;
        var _0x34658d = _0x2737[_0x4645c2];
        return _0x34658d;
    };
    (function () {
        var _0x55be76, _0x4ac213, _0x1da1c8;
        _0x1da1c8 = Game_Interpreter['prototype'];
        _0x4ac213 = [
            0x65,
            0x66,
            0x67,
            0x68,
            0x6c
        ];
        _0x55be76 = [
            0x137,
            0x138,
            0x146,
            0x139,
            0x13a,
            0x13b,
            0x13c,
            0x13d,
            0x13e,
            0x13f,
            0x140,
            0x141,
            0x142,
            0x143,
            0x144,
            0x145,
            0xca,
            0xcb,
            0x119,
            0x11a,
            0x11b,
            0x11c,
            0x14b,
            0x14c,
            0x156,
            0x14d,
            0x14e,
            0x14f,
            0x150,
            0x151,
            0x153,
            0x154
        ];
        _0x1da1c8[_0x1722('0x0')] = function () {
            if (!Network[_0x1722('0x1')]()) {
                if ('apXdR' !== _0x1722('0x2')) {
                    return;
                } else {
                    var _0x976291;
                    if (this[_0x1722('0x3')][_0x1722('0x4')]()) {
                        return;
                    }
                    _0x976291 = this[_0x1722('0x5')]();
                    if (_0x976291 == null) {
                        return;
                    }
                    if (!this[_0x1722('0x6')](_0x976291[_0x1722('0x7')])) {
                        return;
                    }
                    return this['_sendVirtualCommand'](_0x976291);
                }
            }
            if (this[_0x1722('0x8')]()) {
                if (_0x1722('0x9') !== _0x1722('0x9')) {
                    return;
                } else {
                    return this[_0x1722('0xa')]();
                }
            }
        };
        _0x1da1c8[_0x1722('0x8')] = function () {
            var _0xbe9965;
            _0xbe9965 = this[_0x1722('0xb')]();
            return !_0x4ac213['include'](_0xbe9965) && !_0x55be76['include'](_0xbe9965);
        };
        _0x1da1c8[_0x1722('0xa')] = function () {
            var _0x2eba97;
            _0x2eba97 = this[_0x1722('0xc')]();
            _0x2eba97['pi'] = this['_getCurrentPageIndexForNet']();
            _0x2eba97['li'] = this['_index'] + 0x1;
            return Network[_0x1722('0xd')](NetMessage['SyncEvent']()['setData'](_0x2eba97));
        };
        _0x1da1c8[_0x1722('0xc')] = function () {
            return {
                'mapId': this[_0x1722('0xe')],
                'eventId': this[_0x1722('0xf')]()
            };
        };
        _0x1da1c8['_getCurrentPageIndexForNet'] = function () {
            var _0x224201, _0x389b59, _0x2bbcf4;
            try {
                if (_0x1722('0x10') !== 'grYtF') {
                    _0x389b59 = this['eventId']();
                    if (_0x389b59) {
                        _0x2bbcf4 = $gameMap[_0x1722('0x11')](_0x389b59);
                        if (_0x2bbcf4) {
                            return _0x2bbcf4[_0x1722('0x12')];
                        }
                    }
                    return 0x0;
                } else {
                    var _0x78a76;
                    _0x78a76 = this[_0x1722('0xb')]();
                    return !_0x4ac213[_0x1722('0x13')](_0x78a76) && !_0x55be76['include'](_0x78a76);
                }
            } catch (_0x528e9d) {
                _0x224201 = _0x528e9d;
                AlphaNET['error'](_0x224201, _0x1722('0x14'));
                return 0x0;
            }
        };
        _0x1da1c8[_0x1722('0x15')] = function (_0x443dd1 = !![]) {
            if (_0x1722('0x16') === _0x1722('0x16')) {
                var _0xcc03d5;
                if (!Network[_0x1722('0x1')]()) {
                    return;
                }
                this[_0x1722('0x17')] = _0x443dd1;
                _0xcc03d5 = this[_0x1722('0xc')]();
                _0xcc03d5[_0x1722('0x18')] = _0x443dd1;
                return Network[_0x1722('0xd')](NetMessage['LockEvent']()[_0x1722('0x19')](_0xcc03d5));
            } else {
                this[_0x1722('0x1a')](parameters[0x0]);
            }
        };
        _0x1da1c8['_onNETConditionCommand'] = function (_0x477fdf) {
            var _0x154cf8, _0x235331, _0x3ff481;
            try {
                if (_0x1722('0x1b') !== _0x1722('0x1c')) {
                    if (!Network['isConnected']()) {
                        return;
                    }
                    _0x235331 = _0x477fdf[0x1];
                    if (_0x235331 == null) {
                        this[_0x1722('0x1a')](_0x477fdf[0x0]);
                    } else {
                        _0x3ff481 = _0x477fdf[0x1][_0x1722('0x1d')]('|')[_0x1722('0x1e')](function (_0x6d586) {
                            return Number(_0x6d586);
                        });
                        this[_0x1722('0x1a')](_0x477fdf[0x0], _0x3ff481, _0x477fdf[0x2] === 'A');
                    }
                } else {
                    return this['_executeVirtualCommand']();
                }
            } catch (_0x59b374) {
                if ('Cajmi' !== _0x1722('0x1f')) {
                    _0x154cf8 = _0x59b374;
                    AlphaNET['error'](_0x154cf8, _0x1722('0x20'));
                } else {
                    return;
                }
            }
        };
        _0x1da1c8[_0x1722('0x1a')] = function (_0x517020, _0x32aa7e = null, _0x48f8f5 = ![]) {
            var _0x29c81c, _0x2ad633;
            _0x29c81c = Network[_0x1722('0x21')]();
            if (_0x32aa7e != null) {
                if ('NaAOv' !== _0x1722('0x22')) {
                    return;
                } else {
                    _0x2ad633 = !_0x48f8f5 ? NetPartyManager[_0x1722('0x23')]() : NetPartyManager[_0x1722('0x24')]();
                    _0x29c81c = _0x32aa7e[_0x1722('0x25')](_0x2ad633);
                }
            }
            if (_0x29c81c && _0x517020 === 'except') {
                if (_0x1722('0x26') !== 'oWEeE') {
                    ids = parameters[0x1]['split']('|')['map'](function (_0x3a5cfe) {
                        return Number(_0x3a5cfe);
                    });
                    this[_0x1722('0x1a')](parameters[0x0], ids, parameters[0x2] === 'A');
                } else {
                    this[_0x1722('0x27')]++;
                }
            }
            if (!_0x29c81c && _0x517020 === 'only') {
                this[_0x1722('0x27')]++;
            }
        };
        _0x1da1c8[_0x1722('0x28')] = function (_0x146758) {
            var _0x510dd5, _0x564b99;
            try {
                if (_0x1722('0x29') !== _0x1722('0x29')) {
                    return;
                } else {
                    _0x510dd5 = this[_0x1722('0x2a')][_0x146758];
                    if (_0x510dd5[_0x1722('0x7')] === 0x164) {
                        return _0x510dd5[_0x1722('0x2b')][0x0] === _0x1722('0x2c');
                    }
                }
            } catch (_0x48b591) {
                if (_0x1722('0x2d') !== _0x1722('0x2d')) {
                    evId = this[_0x1722('0xf')]();
                    if (evId) {
                        event = $gameMap[_0x1722('0x11')](evId);
                        if (event) {
                            return event['_pageIndex'];
                        }
                    }
                    return 0x0;
                } else {
                    _0x564b99 = _0x48b591;
                    AlphaNET[_0x1722('0x2e')](_0x564b99, _0x1722('0x2f'));
                }
            }
            return ![];
        };
        _0x1da1c8[_0x1722('0x30')] = function (_0x50c8cb, _0x20fa2c) {
            if (!Network[_0x1722('0x1')]()) {
                if ('vDIdw' === _0x1722('0x31')) {
                    return _0x50c8cb[_0x1722('0x32')](this, ..._0x20fa2c);
                } else {
                    var _0x13a701, _0x2085c3;
                    _0x13a701 = Network[_0x1722('0x21')]();
                    if (id != null) {
                        _0x2085c3 = !isActorId ? NetPartyManager['getMyPlayerIndex']() : NetPartyManager[_0x1722('0x24')]();
                        _0x13a701 = id[_0x1722('0x25')](_0x2085c3);
                    }
                    if (_0x13a701 && command === 'except') {
                        this[_0x1722('0x27')]++;
                    }
                    if (!_0x13a701 && command === 'only') {
                        this[_0x1722('0x27')]++;
                    }
                }
            } else {
                if (this['_network']['isShared']()) {
                    return _0x50c8cb[_0x1722('0x32')](this, ..._0x20fa2c);
                } else {
                    AlphaNET[_0x1722('0x33')](_0x1722('0x34'));
                }
            }
            return !![];
        };
        _0x1da1c8[_0x1722('0x35')] = function () {
            if ('WGEUg' !== _0x1722('0x36')) {
                var _0x3c0a45;
                if (this[_0x1722('0x3')][_0x1722('0x4')]()) {
                    if (_0x1722('0x37') !== _0x1722('0x38')) {
                        return;
                    } else {
                        e = error;
                        AlphaNET[_0x1722('0x2e')](e, _0x1722('0x14'));
                        return 0x0;
                    }
                }
                _0x3c0a45 = this[_0x1722('0x5')]();
                if (_0x3c0a45 == null) {
                    return;
                }
                if (!this[_0x1722('0x6')](_0x3c0a45[_0x1722('0x7')])) {
                    return;
                }
                return this[_0x1722('0x39')](_0x3c0a45);
            } else {
                if (!Network[_0x1722('0x1')]()) {
                    return;
                }
                if (this['_isSyncCommandValid']()) {
                    return this[_0x1722('0xa')]();
                }
            }
        };
        _0x1da1c8[_0x1722('0x6')] = function (_0x52355c) {
            return _0x55be76['include'](_0x52355c);
        };
        _0x1da1c8[_0x1722('0x39')] = function (_0x22e1cb) {
            var _0x54a895, _0x12484a;
            _0x12484a = NetMessage['VirtualInterpreter']();
            _0x54a895 = NetMessage[_0x1722('0x3a')](_0x22e1cb[_0x1722('0x7')]);
            _0x54a895[_0x1722('0x2b')] = _0x22e1cb[_0x1722('0x2b')];
            _0x54a895[_0x1722('0x3b')] = this['_mapId'];
            _0x54a895['eventId'] = this[_0x1722('0x3c')];
            _0x12484a[_0x1722('0x19')](_0x54a895);
            Network[_0x1722('0xd')](_0x12484a);
        };
        _0x1da1c8[_0x1722('0x3d')] = function () {
            if (_0x1722('0x3e') === _0x1722('0x3e')) {
                if (!Network[_0x1722('0x1')]()) {
                    if ('IkQtz' !== _0x1722('0x3f')) {
                        return;
                    } else {
                        return;
                    }
                }
                if (this['_network']['isShared']()) {
                    if ('FCGUC' !== _0x1722('0x40')) {
                        return;
                    } else {
                        return;
                    }
                }
                if (this[_0x1722('0x8')]()) {
                    if (_0x1722('0x41') === _0x1722('0x41')) {
                        return this['_executeVirtualCommand']();
                    } else {
                        e = error;
                        AlphaNET[_0x1722('0x2e')](e, _0x1722('0x2f'));
                    }
                }
            } else {
                return cmd[_0x1722('0x2b')][0x0] === 'NET\x20sync';
            }
        };
        _0x1da1c8[_0x1722('0x42')] = function () {
            var _0x40b1e3;
            _0x40b1e3 = this['_list'][this[_0x1722('0x27')] + 0x1];
            return this['_sendVirtualCommand'](_0x40b1e3);
        };
    }());
})();

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Map.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //?[NEW]
    Game_Map.prototype.updateEventsForNetwork = function () {
        this.events().forEach(function (event) {
            event.updateForNetwork();
        });
        //TODO: Можно просто вызывать updateEvents
        //TODO: Сейчас в этой функции не обновляются commonEvents
    };


    //@[ALIAS]
    var _alias_Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function () {
        _alias_Game_Map_update.call(this, ...arguments);
        this._checkSharedEvent();
    };

    //?[NEW]
    Game_Map.prototype._checkSharedEvent = function () {
        if (this._sharedEventData != null) {
            this._sharedEventData.startFromNetwork();
            this._sharedEventData = null;
        }
    };

    //@[ALIAS]
    var _alias_Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function () {
        //console.groupCollapsed('Game_Map_setup');
        _alias_Game_Map_setup.call(this, ...arguments);
        this._sharedEventData = null;
        this._lockedEventsIds = [];
        ///console.groupEnd();
    };

    //?[NEW]
    Game_Map.prototype.startEventFromNetwork = function (data) {
        if (data.mapId == this.mapId()) {
            var event = this.event(data.eventId);
            if (event && !$gameMap.isAnyEventStarting()) {
                "DATA PAGE INDEX".p(data.pageIndex);
                event.sharedPageIndex = data.pageIndex;
                this._sharedEventData = event;
            }
        }
    };

    //?[NEW]
    Game_Map.prototype.setLockedEventByNetwork = function (eventId, isLocked = true) {
        if (!eventId || eventId <= 0) return;
        if (!this.event(eventId)) return;
        if (isLocked) {
            "GAME MAP LOCK EVENT".p(eventId);
            this._lockedEventsIds.push(eventId);
        } else {
            "  GAME MAP UNLOCK EVENT".p(eventId);
            this._lockedEventsIds.delete(eventId);
        }
    };

    //?[NEW]
    Game_Map.prototype.isEventLockedByNet = function (eventId) {
        if (this._lockedEventsIds != null)
            return this._lockedEventsIds.includes(eventId);
        return false;
    };
})();
// ■ END Game_Map.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Message.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Message_clear6565 = Game_Message.prototype.clear;
    Game_Message.prototype.clear = function () {
        _alias_Game_Message_clear6565.call(this, ...arguments);
        this._isChoiseShared = false;
    };

    //?[NEW]
    Game_Message.prototype.setSharedChoiseMode = function (bool) {
        this._isChoiseShared = bool;
    };

    //?[NEW]
    Game_Message.prototype.isChoiseSharedMode = function () {
        return (this._isChoiseShared == true);
    };
})();
// ■ END Game_Message.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Party.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //?[NEW]
    Game_Party.prototype.isMaximumForNetwork = function () {
        return Network.maximumNetworkPlayers == this.size();
    };

    //@[ALIAS]
    var _alias_Game_Party_leader = Game_Party.prototype.leader;
    Game_Party.prototype.leader = function () {
        if (Network.isConnected() && !Network.isHost()) {
            return this.memberByActorId(Network.myPlayerData.actorId);
        } else {
            return _alias_Game_Party_leader.call(this);
        }
    };

    //?[NEW]
    Game_Party.prototype.memberByActorId = function (actorId) {
        return $gameActors.actor(actorId);
    };

    //?[NEW]
    Game_Party.prototype.memberIndexByActorId = function (actorId) {
        return this.members().findElementIndexByField("_actorId", actorId);
    };

    //?[NEW]
    Game_Party.prototype.refreshForNetwork = function () {
        if (Network.isConnected())
            this.members().forEach(item => item.refresh());
    };

    //?[NEW]
    Game_Party.prototype.getDataForNetwork = function () {
        var itemsData = {
            items: JSON.stringify($gameParty._items),
            weapons: JSON.stringify($gameParty._weapons),
            armors: JSON.stringify($gameParty._armors),
            gold: JSON.stringify($gameParty._gold)
        };
        return itemsData;
    };

    //?[NEW]
    Game_Party.prototype.setDataFromNetwork = function (data) {
        if (data.items != null) {
            $gameParty._items = JSON.parse(data.items);
        }
        if (data.weapons != null) {
            $gameParty._weapons = JSON.parse(data.weapons);
        }
        if (data.gold != null) {
            $gameParty._gold = JSON.parse(data.gold);
        }
        if (data.armors != null)
            this._setArmorsFromNetwork(data.armors);
    };

    // * Отдельный метод для совместимости с YEP плагином
    //?[NEW]
    Game_Party.prototype._setArmorsFromNetwork = function (armors) {
        if (armors != null) {
            $gameParty._armors = JSON.parse(armors);
        }
    };

})();
// ■ END Game_Party.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Player.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _Game_Player_prototype_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function (d) {
        _Game_Player_prototype_moveStraight.call(this, d);
        if (Network.isConnected()) {
            var moveData = this._collectDataForNetwork();
            Network.sendMessage(NetMessage.PlayerMoveData().setData(moveData));
        }
    };

    //@[ALIAS]
    var _alias_Game_Player_getOnOffVehicle = Game_Player.prototype.getOnOffVehicle;
    Game_Player.prototype.getOnOffVehicle = function () {
        if (Network.isConnected()) {
            return false;
        } else
            return _alias_Game_Player_getOnOffVehicle.call(this, ...arguments);

    };
})();
// ■ END Game_Player.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Game_Troop.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function () {
        _alias_Game_Troop_setup.call(this, ...arguments);
        if (BattleManager.isNetworkBattle()) {
            if (this._uniqueNamesFromNetwork != null) {
                this.setUniqueIdsForEnemies(this._uniqueNamesFromNetwork);
            }
        }
    };

    //?[NEW]
    Game_Troop.prototype.getEnemyByNetId = function (netId) {
        return this.members().find(item => item.uniqueNetworkId() == netId);
    };

    //?[NEW]
    Game_Troop.prototype.setUniqueIdsForEnemies = function (data) {
        var enemies = this.members();
        if (enemies.length > 0) {
            data.forEach((item, index) => enemies[index]._uniqueNetworkId = item);
            this._uniqueNamesFromNetwork = null;
        } else {
            this._uniqueNamesFromNetwork = data;
        }
    };
})();
// ■ END Game_Troop.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ HotSeatKeyMapper.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[CLASS IMPL ONLY]

    // * inputType: 1 - Mouse, 2 - Keyboard, null - All
    HotSeatKeyMapper.init = function (inputType, mirror) {
        if (!Utils.isNwjs())
            return;

        this._inputType = inputType;
        this._mirror = mirror; // * Другой маппер
        this._initMapper();
    };

    if (!Utils.isNwjs())
        return;

    Input._setupEventHandlers = function () {
        window.addEventListener('blur', this._onLostFocus.bind(this));
    };

    TouchInput._setupEventHandlers = function () {
        var isSupportPassive = Utils.isSupportPassiveEvent();
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('wheel', this._onWheel.bind(this));
        document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {
            passive: false
        } : false);
        document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {
            passive: false
        } : false);
        document.addEventListener('touchend', this._onTouchEnd.bind(this));
        document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
        document.addEventListener('pointerdown', this._onPointerDown.bind(this));
    };

    HotSeatKeyMapper._initMapper = function () {
        document.addEventListener('mousedown', this._onMouseDown.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
    };

    HotSeatKeyMapper._onMouseDown = function (eventX) {
        var data = {
            type: 1,
            name: '_onMouseDown',
            event: eventX
        };
        this.map(data);
    };

    HotSeatKeyMapper.map = function (data) {
        if (data.type == 1) {
            this.touchMap(data);
        } else {
            this.keyMap(data);
        }
    };

    HotSeatKeyMapper.touchMap = function (data) {
        if (this.isMouse()) {
            executeFunctionByName(data.name, TouchInput, data.event);
        } else {
            this.sendToMirror(data);
        }
    };

    HotSeatKeyMapper.sendToMirror = function (data) {
        if (this._mirror) {
            this._mirror.map(data);
        }
    };

    HotSeatKeyMapper.keyMap = function (data) {
        if (this.isKeyboard()) {
            executeFunctionByName(data.name, Input, data.event);
        } else {
            this.sendToMirror(data);
        }
    };

    HotSeatKeyMapper._onMouseMove = function (eventX) {
        var data = {
            type: 1,
            name: '_onMouseMove',
            event: eventX
        }
        this.map(data);
    };

    HotSeatKeyMapper._onMouseUp = function (eventX) {
        var data = {
            type: 1,
            name: '_onMouseUp',
            event: eventX
        };
        this.map(data);
    };

    //В event.type записано название типа события
    HotSeatKeyMapper._onKeyDown = function (eventX) {
        var data = {
            type: 2,
            name: '_onKeyDown',
            event: eventX
        };
        this.map(data);
    };

    HotSeatKeyMapper._onKeyUp = function (eventX) {
        var data = {
            type: 2,
            name: '_onKeyUp',
            event: eventX
        };
        this.map(data);
    };

    HotSeatKeyMapper.isKeyboard = function () {
        if (this._inputType == null)
            return true;
        return this._inputType == 2;
    };

    HotSeatKeyMapper.isMouse = function () {
        if (this._inputType == null)
            return true;
        return this._inputType == 1;
    };

    HotSeatKeyMapper.myType = function () {
        return this._inputType;
    };

    HotSeatKeyMapper.isMyType = function (data) {
        if (this.myType() == null)
            return true;
        return this.myType() == data.type;
    };
})();
// ■ END HotSeatKeyMapper.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Image_Manager_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

    //?[NEW]
    ImageManager.loadNetwork = function (filename, hue) {
        return this.loadBitmap('img/network/', filename, hue, false);
    };

})();
// ■ END Image_Manager_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
//Compressed by MV Plugin Builder
(function () {
    var _0x129d = [
        'InfoPrinter',
        'setup',
        'appendChild',
        'width',
        '_width',
        'height',
        'style',
        'textAlign',
        'textShadow',
        '20px',
        '400px',
        'position',
        'absolute',
        'kVJhP',
        '<font\x20color=\x22white\x22>',
        '</font><br>',
        'innerHTML',
        'clear',
        'mDnBX',
        '_createErrorPrinter',
        'create',
        'nreHR',
        'cnyHv',
        '_infoPrinter',
        'createElement'
    ];
    (function (_0x5c94be, _0x2b4c72) {
        var _0x2f680a = function (_0x4cbae8) {
            while (--_0x4cbae8) {
                _0x5c94be['push'](_0x5c94be['shift']());
            }
        };
        _0x2f680a(++_0x2b4c72);
    }(_0x129d, 0x1ee));
    var _0x46d5 = function (_0x1d0241, _0x25797b) {
        _0x1d0241 = _0x1d0241 - 0x0;
        var _0x5a78fb = _0x129d[_0x1d0241];
        return _0x5a78fb;
    };
    (function () {
        var _0x4dc9a0;
        _0x4dc9a0 = Graphics[_0x46d5('0x0')];
        Graphics['_createErrorPrinter'] = function () {
            _0x4dc9a0['call'](this);
            return InfoPrinter[_0x46d5('0x1')]();
        };
        InfoPrinter['create'] = function () {
            if (_0x46d5('0x2') !== _0x46d5('0x3')) {
                InfoPrinter[_0x46d5('0x4')] = document[_0x46d5('0x5')]('p');
                InfoPrinter['_infoPrinter']['id'] = _0x46d5('0x6');
                InfoPrinter[_0x46d5('0x7')]();
                return document['body'][_0x46d5('0x8')](InfoPrinter['_infoPrinter']);
            } else {
                return;
            }
        };
        InfoPrinter[_0x46d5('0x7')] = function () {
            var _0x1c20af;
            _0x1c20af = InfoPrinter[_0x46d5('0x4')];
            _0x1c20af[_0x46d5('0x9')] = Graphics[_0x46d5('0xa')] * 0.8;
            _0x1c20af[_0x46d5('0xb')] = 0x64;
            _0x1c20af[_0x46d5('0xc')][_0x46d5('0xd')] = 'left';
            _0x1c20af[_0x46d5('0xc')][_0x46d5('0xe')] = '1px\x201px\x203px\x20#000';
            _0x1c20af[_0x46d5('0xc')]['fontSize'] = _0x46d5('0xf');
            _0x1c20af[_0x46d5('0xc')]['zIndex'] = 0x46;
            _0x1c20af[_0x46d5('0xc')][_0x46d5('0x9')] = '400px';
            _0x1c20af[_0x46d5('0xc')][_0x46d5('0xb')] = _0x46d5('0x10');
            return _0x1c20af[_0x46d5('0xc')][_0x46d5('0x11')] = _0x46d5('0x12');
        };
        InfoPrinter['p'] = function (_0x4e5241) {
            var _0x6e703b;
            if (InfoPrinter[_0x46d5('0x4')] == null) {
                if ('kVJhP' === _0x46d5('0x13')) {
                    return;
                } else {
                    var _0x5337c3;
                    if (InfoPrinter[_0x46d5('0x4')] == null) {
                        return;
                    }
                    _0x5337c3 = _0x46d5('0x14') + _0x4e5241 + _0x46d5('0x15');
                    InfoPrinter[_0x46d5('0x4')]['innerHTML'] = _0x5337c3;
                }
            }
            _0x6e703b = _0x46d5('0x14') + _0x4e5241 + '</font><br>';
            InfoPrinter['_infoPrinter'][_0x46d5('0x16')] = _0x6e703b;
        };
        InfoPrinter[_0x46d5('0x17')] = function () {
            if (InfoPrinter['_infoPrinter'] == null) {
                if (_0x46d5('0x18') !== 'mDnBX') {
                    if (InfoPrinter['_infoPrinter'] == null) {
                        return;
                    }
                    InfoPrinter[_0x46d5('0x4')][_0x46d5('0x16')] = '';
                } else {
                    return;
                }
            }
            InfoPrinter['_infoPrinter']['innerHTML'] = '';
        };
    }());
})();

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Input.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    ///INPUT
    var i, j;
    Input.KeyMapperNET = {};
    //Numbers
    for (i = j = 48; j <= 57; i = ++j) {
        Input.KeyMapperNET[i] = String.fromCharCode(i);
    }
    //Numbers NUM LOCK
    for (i = j = 96; j <= 105; i = ++j) {
        Input.KeyMapperNET[i] = 'Numpad' + String(i - 96);
    }

    Input.KeyMapperNET[8] = 'Backspace';
    Input.KeyMapperNET[190] = '.';
    Input.KeyMapperNET[110] = 'NumpadDecimal';

    var alias_atbs_input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function (event) {
        alias_atbs_input_onKeyDown.call(this, event);
        if (event.code && event.code.contains('Numpad')) {
            Input._setStateWithMapperMYP(event.keyCode);
            return;
        }
        if (Input.keyMapper[event.keyCode]) {
            return;
        }
        Input._setStateWithMapperMYP(event.keyCode);
    };

    Input._setStateWithMapperMYP = function (keyCode, state = true) {
        var symbol;
        symbol = Input.KeyMapperNET[keyCode];
        if (symbol != null) {
            this._currentState[symbol] = state;
        }
    };

    var alias_atbs_input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function (event) {
        alias_atbs_input_onKeyUp.call(this, event);
        if (event.code && event.code.contains('Numpad')) {
            Input._setStateWithMapperMYP(event.keyCode, false);
            return;
        }
        Input._setStateWithMapperMYP(event.keyCode, false);
    };
})();
// ■ END Input.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
//Compressed by MV Plugin Builder
(function () {
    var _0x245a = [
        '_shared',
        '_lineSyncIndex',
        '_waitNetCount',
        '_startedOutside',
        'isNeedLineSync',
        'setup',
        '_event',
        'event',
        'qLQWp',
        'xQarw',
        'isNetworkSharedMode',
        'isShared',
        '_prepareSharedEvent',
        '_list',
        '_insertNetShareCommand',
        '_prepareEventListForNet',
        '_insertNetCommand',
        'replace',
        '_isNetCommandExists',
        'code',
        'splice',
        'WOHlx',
        'index',
        'push',
        '_prepareList_replaceSyncCommand',
        'contains',
        'NET\x20sync',
        '_insertNetSyncCommand',
        'isStartedFromNetwork',
        'clearStartFromNetwork',
        'updateWaitMode',
        'eventId',
        '_checkWaitCount',
        'error',
        'getLastResponseData',
        'mfDtn',
        'resetWait',
        'command901',
        'CMD\x20900\x20run',
        '_collectEventBasicDataForNetwork',
        'WAIT_PLAYER',
        'duHPi',
        'sendMessage',
        'StartSharedEvent',
        'setRepeat',
        'setData',
        'CMD\x20901\x20run',
        'RegisterOnSharedEventSync'
    ];
    (function (_0x379dce, _0x53daaf) {
        var _0x3752c5 = function (_0x2b90e) {
            while (--_0x2b90e) {
                _0x379dce['push'](_0x379dce['shift']());
            }
        };
        _0x3752c5(++_0x53daaf);
    }(_0x245a, 0xf0));
    var _0x6d3a = function (_0x4bd822, _0x2bd6f7) {
        _0x4bd822 = _0x4bd822 - 0x0;
        var _0xb4bdb3 = _0x245a[_0x4bd822];
        return _0xb4bdb3;
    };
    var InterpreterNET;
    InterpreterNET = class InterpreterNET {
        constructor() {
                this['_startedOutside'] = ![];
                this[_0x6d3a('0x0')] = ![];
                this[_0x6d3a('0x1')] = -0x1;
                this[_0x6d3a('0x2')] = 0x0;
            }
            ['isStartedOutside']() {
                return this[_0x6d3a('0x3')] === !![];
            }
            ['isShared']() {
                return this[_0x6d3a('0x0')] === !![];
            }
            [_0x6d3a('0x4')]() {
                return this[_0x6d3a('0x1')] >= 0x0;
            }
            ['resetWait']() {
                return this[_0x6d3a('0x2')] = 0x0;
            }
            [_0x6d3a('0x5')](_0x394df7, _0x58d00b) {
                this[_0x6d3a('0x6')] = $gameMap[_0x6d3a('0x7')](_0x394df7);
                if (this[_0x6d3a('0x6')] == null) {
                    if (_0x6d3a('0x8') !== _0x6d3a('0x9')) {
                        return;
                    } else {
                        this['_checkWaitCount'](responseId);
                    }
                }
                this[_0x6d3a('0x0')] = this[_0x6d3a('0x6')][_0x6d3a('0xa')]();
                if (this[_0x6d3a('0xb')]()) {
                    return this[_0x6d3a('0xc')](_0x58d00b);
                }
            }
            [_0x6d3a('0xc')](_0x3fc37d) {
                this[_0x6d3a('0xd')] = _0x3fc37d;
                this[_0x6d3a('0xe')]();
                return this[_0x6d3a('0xf')]();
            }
            [_0x6d3a('0xe')]() {
                return this[_0x6d3a('0x10')]({
                    'index': 0x0,
                    'replace': ![],
                    'code': InterpreterNET['CMD_SHARE']
                });
            }
            [_0x6d3a('0x10')](_0x376999) {
                var _0x2c2fce, _0x10c7b7;
                _0x2c2fce = _0x376999['index'] || 0x0;
                _0x10c7b7 = _0x376999[_0x6d3a('0x11')];
                if (this[_0x6d3a('0x12')](_0x2c2fce, _0x376999[_0x6d3a('0x13')])) {
                    return;
                }
                return this['_list'][_0x6d3a('0x14')](_0x2c2fce, _0x10c7b7, {
                    'code': _0x376999[_0x6d3a('0x13')],
                    'indent': 0x0,
                    'parameters': []
                });
            }
            [_0x6d3a('0x12')](_0x17e59c, _0x4a6599) {
                return this[_0x6d3a('0xd')][_0x17e59c][_0x6d3a('0x13')] === _0x4a6599;
            }
            ['_prepareEventListForNet']() {
                var _0x35925d, _0x2c8927;
                _0x35925d = this[_0x6d3a('0xd')]['length'] - 0x1;
                _0x2c8927 = [];
                while (_0x35925d >= 0x0) {
                    if ('WOHlx' !== _0x6d3a('0x15')) {
                        var _0xd8950f, _0x3198ca;
                        _0xd8950f = command[_0x6d3a('0x16')] || 0x0;
                        _0x3198ca = command[_0x6d3a('0x11')];
                        if (this[_0x6d3a('0x12')](_0xd8950f, command[_0x6d3a('0x13')])) {
                            return;
                        }
                        return this[_0x6d3a('0xd')][_0x6d3a('0x14')](_0xd8950f, _0x3198ca, {
                            'code': command[_0x6d3a('0x13')],
                            'indent': 0x0,
                            'parameters': []
                        });
                    } else {
                        this['_prepareList_replaceSyncCommand'](_0x35925d);
                        _0x2c8927[_0x6d3a('0x17')](_0x35925d--);
                    }
                }
                return _0x2c8927;
            }
            [_0x6d3a('0x18')](_0x3c1831) {
                var _0x31fe01;
                _0x31fe01 = this['_list'][_0x3c1831];
                if (_0x31fe01[_0x6d3a('0x13')] !== 0x164) {
                    return;
                }
                if (!_0x31fe01['parameters'][0x0][_0x6d3a('0x19')](_0x6d3a('0x1a'))) {
                    return;
                }
                this[_0x6d3a('0x1b')](_0x3c1831);
            }
            ['_insertNetSyncCommand'](_0x5910bd) {
                return this[_0x6d3a('0x10')]({
                    'index': _0x5910bd,
                    'replace': !![],
                    'code': InterpreterNET['CMD_SYNC']
                });
            }
            ['startNetwork']() {
                if (!this[_0x6d3a('0xb')]()) {
                    return;
                }
                this[_0x6d3a('0x3')] = this['_event'][_0x6d3a('0x1c')]();
                return this[_0x6d3a('0x6')][_0x6d3a('0x1d')]();
            }
            [_0x6d3a('0x1e')]() {
                var _0x218da0, _0x4ee216;
                _0x4ee216 = this[_0x6d3a('0x6')][_0x6d3a('0x1f')]();
                _0x218da0 = Network['getLastResponseData']();
                if (this['isShared']()) {
                    this[_0x6d3a('0x20')](_0x218da0);
                }
                if (_0x218da0 === -0x64) {
                    if ('vRlfL' !== 'vRlfL') {
                        return this[_0x6d3a('0x1')] >= 0x0;
                    } else {
                        Network[_0x6d3a('0x21')]('', 'Server\x20wait\x20error,\x20code\x20-\x20100');
                        $gameMap['_interpreter']['_index'] = 0x64;
                        return ![];
                    }
                }
                return !(Network[_0x6d3a('0x22')]() === _0x4ee216);
            }
            ['_checkWaitCount'](_0x1b2aa6) {
                if (_0x1b2aa6 == null) {
                    if (_0x6d3a('0x23') !== _0x6d3a('0x23')) {
                        this[_0x6d3a('0x24')]();
                        return this[_0x6d3a('0x25')]();
                    } else {
                        this[_0x6d3a('0x2')] += 0x1;
                    }
                }
                if (this[_0x6d3a('0x2')] >= 0x3c) {
                    this[_0x6d3a('0x24')]();
                    return this[_0x6d3a('0x25')]();
                }
            }
            ['command900']() {
                var _0xb86324, _0x6c3080;
                _0x6d3a('0x26')['p']();
                _0xb86324 = this[_0x6d3a('0x6')][_0x6d3a('0x27')]();
                _0x6c3080 = Network[_0x6d3a('0x28')];
                if (!this['isStartedOutside']()) {
                    if (_0x6d3a('0x29') !== 'XaTmM') {
                        _0xb86324['pageIndex'] = this[_0x6d3a('0x6')]['findProperPageIndex']();
                        Network[_0x6d3a('0x2a')](NetMessage[_0x6d3a('0x2b')]()[_0x6d3a('0x2c')](_0x6c3080)[_0x6d3a('0x2d')](_0xb86324));
                    } else {
                        return this[_0x6d3a('0x2')] = 0x0;
                    }
                } else {
                    Network['sendMessage'](NetMessage['RegisterOnSharedEvent']()[_0x6d3a('0x2c')](_0x6c3080)[_0x6d3a('0x2d')](_0xb86324));
                }
                return !![];
            }
            [_0x6d3a('0x25')](_0x22f81f) {
                var _0x4fae56, _0x52b01d;
                _0x6d3a('0x2e')['p']();
                _0x4fae56 = this[_0x6d3a('0x6')]['_collectEventBasicDataForNetwork']();
                _0x4fae56['line'] = _0x22f81f;
                _0x52b01d = Network[_0x6d3a('0x28')];
                Network[_0x6d3a('0x2a')](NetMessage[_0x6d3a('0x2f')]()[_0x6d3a('0x2c')](_0x52b01d)['setData'](_0x4fae56));
                return !![];
            }
    };
    InterpreterNET['CMD_SHARE'] = 0x384;
    InterpreterNET['CMD_SYNC'] = 0x385;
    AlphaNET['register'](InterpreterNET);
})();

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ MakerManager.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[CLASS IMPL ONLY]

    Object.defineProperty(MakerManager, 'childWindow', {
        get: function () {
            return this._childWindow;
        },
        configurable: true
    });

    MakerManager.initManager = function () {
        this._childWindow = null;
        HotSeatKeyMapper.init(null, null);
    };

    MakerManager.setupGameWindow = function () {
        var win = nw.Window.get();
        win.removeAllListeners('close');
        win.on('close', this.onWindowClose.bind(win));

        win.removeAllListeners('restore');
        win.removeAllListeners('focus');
        win.removeAllListeners('minimize');

        win.on('focus', function () {
            if (MakerManager.childWindow) {
                MakerManager.childWindow.restore();
            }
        });
        win.on('restore', function () {
            if (MakerManager.childWindow) {
                MakerManager.childWindow.restore();
            }
        });
        win.on('minimize', function () {
            if (MakerManager.childWindow) {
                MakerManager.childWindow.minimize();
            }
        });

        win.removeAllListeners('move');
        win.on('move', function (x, y) {
            if (MakerManager.childWindow) {
                MakerManager.childWindow.x = x + Graphics.width + 8;
                MakerManager.childWindow.y = y;
            }
        });

    };

    MakerManager.openMaker = function () {
        if (!Utils.isNwjs())
            return;
        if (MakerManager._childWindow == null) {
            HotSeatKeyMapper.init(1, null);
            this.setupGameWindow();
            this.createWindow();
            Network.setHotGame(true);
        } else {
            MakerManager.closeMaker();
            MakerManager.deleteMaker();
            MakerManager.openMaker();
        }
    };

    MakerManager.createWindow = function () {
        var win = nw.Window.get();
        var filename = 'www/index.html';
        if (Utils.isOptionValid('test')) {
            filename = 'index.html';
        }
        nw.Window.open(filename, {
            width: win.width - 2,
            height: win.height,
            resizable: false,
            show_in_taskbar: false,
            new_instance: false
        }, function (new_win) {
            MakerManager._childWindow = new_win;
            new_win.on('loaded', this._onWindowCreated.bind(this));
        }.bind(this));
    };

    MakerManager._onWindowCreated = function () {
        this._moveWindow();
        this._setupWindow();
    };

    MakerManager._moveWindow = function () {
        window.moveBy(-400, 0);
        this._childWindow.moveTo(window.screenX + Graphics.boxWidth + 8, window.screenY);
    };

    MakerManager._setupWindow = function () {
        this._childWindow.on('closed', this.deleteMaker.bind(this));
        this._childWindow.on('close', this.closeMaker.bind(this));

        var mapper = this._childWindow.window.HotSeatKeyMapper;
        this._childWindow.window.Network.setHotGame(true);
        HotSeatKeyMapper._mirror = mapper;
        mapper.init(2, HotSeatKeyMapper);
    };

    MakerManager.onWindowClose = function () {
        MakerManager.closeTheWindows.call(this);
    };

    MakerManager.closeMaker = function () {
        HotSeatKeyMapper.init(null, null);
        Network.setHotGame(false);
        this._childWindow.close(true);
    };

    MakerManager.deleteMaker = function () {
        this._childWindow = null;
    };

    MakerManager.closeTheWindows = function () {
        if (MakerManager.childWindow)
            MakerManager.childWindow.close(true);
        this.close(true);
    };

})();
// ■ END MakerManager.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetMessage.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//@[GLOBAL]
var NetMessage;

NetMessage = (function () {
    class NetMessage {
        constructor(socket1) {
            this.socket = socket1;
            this.name = "trace";
            this.from = "";
            this.to = "";
            this.data = "";
            this.waited = false;
        }

        setName(name) {
            this.name = name;
            return this;
        }

        setTo(socketId) {
            this.to = socketId;
            return this;
        }

        setFrom(socketId) {
            this.from = socketId;
            return this;
        }

        setData(data) {
            this.data = data;
            return this;
        }

        setWait(symbol) {
            this.waited = true;
            Network.waitServerResponse(this, symbol);
            return this;
        }

        setRepeat(symbol) {
            this.waited = true;
            Network.waitServerResponseRepeated(this, symbol);
            return this;
        }

        send(data) {
            this.socket.emit(this.name, this._makeData(data));
            return this;
        }

        broadcast(data) {
            return this.socket.broadcast.emit(this.name, this._makeData(data));
        }

        _makeData(data = null) {
            var netData;
            netData = {};
            if (data == null) {
                data = this.data;
            } else {
                this.data = data;
            }
            netData.data = data;
            netData.from = this.from;
            netData.to = this.to;
            netData.waited = this.waited;
            return netData;
        }

        static Setup(socket) {
            return NetMessage.Socket = socket;
        }

        static PlayerDisconnect(socket) {
            return this.EmptyMessage(socket).setName('playerDisconnect');
        }

        static PlayerConnect(socket) {
            return this.EmptyMessage(socket).setName('playerConnect');
        }

        static HostResponse(socket) {
            return this.EmptyMessage(socket).setName('host').setFrom('server');
        }

        static AlertMessage(socket) {
            return this.EmptyMessage(socket).setFrom('server').setName('alertMessage');
        }

        static EmptyMessage(socket = null) {
            var msg, targetSocket;
            targetSocket = socket;
            if (socket == null) {
                targetSocket = this.Socket;
            }
            msg = new NetMessage(targetSocket);
            if (targetSocket != null) {
                msg.setFrom(targetSocket.id);
            }
            return msg;
        }

        static CreateSubMessageData(id) {
            var data;
            return data = {
                id: id
            };
        }

    };

    NetMessage.Socket = null;

    return NetMessage;

}).call(this);

AlphaNET.register(NetMessage);

// ■ END NetMessage.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetMessages.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var _CM, _M;
    //@[DEFINES]
    _M = NetMessage;
    _CM = function (socket, name) {
        return _M.EmptyMessage(socket).setName(name);
    };
    //?INITIAL
    _M.RequestPlayerData = function (_) {
        return _CM(_, 'requestInitialPlayerData');
    };
    _M.PlayerDataResponse = function (_) {
        return _CM(_, 'responsePlayerData');
    };
    _M.PlayersTableResponse = function (_) {
        return _CM(_, 'playersTableResponse');
    };
    _M.HostGameMapId = function (_) {
        return _CM(_, 'hostGameMapId');
    };

    //?PLAYERS
    _M.PlayerMoveData = function (_) {
        return _CM(_, 'playerMove');
    };
    _M.PlayerNetIcon = function (_) {
        return _CM(_, 'playerIcon');
    };
    _M.PlayerNetActorData = function (_) {
        return _CM(_, 'playerNetActorData');
    };
    _M.PlayerNetItemsData = function (_) {
        return _CM(_, 'playerNetItemsData');
    };
    _M.PlayerWorldData = function (_) {
        return _CM(_, 'playerWorldData');
    };
    _M.GlobalWorldData = function (_) {
        return _CM(_, 'globalWorldData');
    };
    //?EVENTS
    _M.MapEventMoveData = function (_) {
        return _CM(_, 'mapEventMove');
    };
    _M.SyncEvent = function (_) {
        return _CM(_, 'mapEventSync');
    };
    _M.LockEvent = function (_) {
        return _CM(_, 'mapEventLock');
    };
    _M.StartSharedEvent = function (_) {
        return _CM(_, 'startSharedEvent');
    };
    _M.RegisterOnSharedEvent = function (_) {
        return _CM(_, 'registerOnSharedEvent');
    };
    _M.RegisterOnSharedEventSync = function (_) {
        return _CM(_, 'registerOnSharedEventSync');
    };
    _M.VirtualInterpreter = function (_) {
        return _CM(_, 'virtualInterpreter');
    };
    //?WINDOWS
    _M.WindowSelect = function (_) {
        return _CM(_, 'window_select_data');
    };
    //?BATTLE
    _M.BattleInputCommand = function (_) {
        return _CM(_, 'battle_inputCommand');
    };
    _M.BattleBattlerRefreshData = function (_) {
        return _CM(_, 'battle_refreshData');
    };
    _M.BattleAction = function (_) {
        return _CM(_, 'battle_action');
    };
    _M.BattleManager = function (_) {
        return _CM(_, 'battle_manager');
    };
    //?GLOBAL
    _M.OnWaitResponse = function (_) {
        return _CM(_, 'onWaitResponse');
    };
    _M.RequestSync = function (_) {
        return _CM(_, 'requestSync');
    };
    //?{TEST}
    _M.TempMessage = function (_) {
        return _CM(_, 'tempMessage');
    };
})();

// ■ END NetMessages.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetParameters.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var NetParameters;
    // * Если параметры не были загружены, будет возвращять стандартные значения автоматически
    NetParameters = class NetParameters extends KDCore.ParametersManager {
        constructor() {
            super('Alpha NET');
        }

        get_actorsForPlayers() {
            var name;
            if (this.isLoaded()) {
                name = 'ActorsForPlayers';
                return this.getFromCacheOrInit(name, function () {
                    var obj;
                    try {
                        obj = this.getString(name);
                        return obj.split(',').map(function (i) {
                            return Number(i);
                        });
                    } catch (error) {
                        AlphaNET.warning('wrong plugin parameter Actors for players');
                        return [1, 2];
                    }
                });
            } else {
                return [1, 2, 3, 4];
            }
        }

        load_CommonEventsForNetwork() {
            if (!this.isLoaded()) {
                return;
            }
            try {
                Network.commonEventOnServerStarted = this.getNumber("ServerStarted");
                Network.commonEventOnConnectToServer = this.getNumber("OnConnect");
                Network.commonEventOnDisconectFromServer = this.getNumber("OnDisconect");
                Network.commonEventOnOtherClientConnected = this.getNumber("OnOtherCon");
                Network.commonEventOnOtherClientDisconected = this.getNumber("OnOtherDisc");
            } catch (error) {
                return AlphaNET.warning('wrong plugin parameters for network common events');
            }
        }

    };
    AlphaNET.register(NetParameters);
    AlphaNET.Parameters = new NetParameters();
})();

// ■ END NetParameters.coffee
//---------------------------------------------------------------------------

//Compressed by MV Plugin Builder
(function () {
    var _0x1bc8 = [
        'fpxmf',
        'tieOw',
        'refreshNetwork',
        'synchronize',
        'isCurrentSceneIsBattle',
        'isEventRunning',
        'getMyActorDataForNetwork',
        'PlayerNetActorData',
        'sendMessage',
        'PlayerNetItemsData',
        'sDDdw',
        'while\x20try\x20collect\x20actor\x20Data\x20to\x20synchronize',
        'onActorDataFromNetwork',
        'XDMJV',
        'TTFiW',
        'while\x20get\x20character\x20sprite\x20on\x20map',
        'wpdCZ',
        'isCurrentSceneIsMenuBased',
        'safeRefreshCurrentScene',
        'refresh',
        'xKnrn',
        'BXdCF',
        'jhOoL',
        'onActroItemsFromNetwork',
        'rCmwP',
        'DnCBT',
        'setDataFromNetwork',
        'clearParty',
        'BnkoC',
        'WWUaN',
        'length',
        'qPsnb',
        'getPlayer',
        'REMOVE\x20PLAYER',
        'players',
        'delete',
        'removeActor',
        'actorId',
        'unshift',
        'refreshCharacters',
        'networkActorsId',
        'push',
        'addActor',
        'getPlayerByIndex',
        'vieRG',
        'myPlayerData',
        'LRiue',
        'error',
        'while\x20try\x20synchronize\x20actor\x20Data\x20from\x20Network',
        'getMyActorId',
        'HIneJ',
        'getMe',
        'getHost',
        'LTNVD',
        'requestRefresh',
        'getCharById',
        'indexOf',
        'getMyPlayerSprite',
        'getPlayerSpriteById',
        'myId',
        'isCurrentSceneIsMap',
        'AOPLg',
        'BEWZI',
        '_scene',
        '_characterSprites',
        '_character',
        'Ojfnk',
        'IpHVE',
        'hiMJa',
        'aWQIH',
        'NetworkCharacter',
        'netId',
        'kUsjr',
        'ZTaXm',
        'getActorIdBySocketId',
        'parse',
        '_data',
        'followers',
        'getNetworkCharById',
        'AYwCJ',
        'memberByActorId',
        'stringify',
        'ZijNw',
        'registerNewPlayer',
        'REGISTER\x20PLAYER',
        'setActorId',
        'removePlayer',
        'NANrQ'
    ];
    (function (_0x4bd822, _0x2bd6f7) {
        var _0xb4bdb3 = function (_0x1d68f6) {
            while (--_0x1d68f6) {
                _0x4bd822['push'](_0x4bd822['shift']());
            }
        };
        _0xb4bdb3(++_0x2bd6f7);
    }(_0x1bc8, 0x1d3));
    var _0x4bc4 = function (_0x1f1b97, _0x29db6d) {
        _0x1f1b97 = _0x1f1b97 - 0x0;
        var _0x1f1843 = _0x1bc8[_0x1f1b97];
        return _0x1f1843;
    };
    (function () {
        NetPartyManager[_0x4bc4('0x0')] = function () {
            var _0x1f6225, _0x2e2c22, _0x37aade, _0x1d1a56, _0x450aa8;
            if (Network['myPlayerData'] == null) {
                if (_0x4bc4('0x1') !== _0x4bc4('0x2')) {
                    return;
                } else {
                    return;
                }
            }
            'CLEAR\x20PARTY' ['p']();
            _0x1d1a56 = $gameParty['members']();
            for (_0x1f6225 = _0x2e2c22 = _0x450aa8 = _0x1d1a56[_0x4bc4('0x3')] - 0x1; _0x450aa8 <= 0x0 ? _0x2e2c22 <= 0x0 : _0x2e2c22 >= 0x0; _0x1f6225 = _0x450aa8 <= 0x0 ? ++_0x2e2c22 : --_0x2e2c22) {
                if ('qPsnb' !== _0x4bc4('0x4')) {
                    var _0x1543a9;
                    _0x1543a9 = NetPartyManager[_0x4bc4('0x5')](id);
                    if (_0x1543a9 == null) {
                        return;
                    }
                    _0x4bc4('0x6')['p'](id);
                    Network[_0x4bc4('0x7')][_0x4bc4('0x8')](_0x1543a9);
                    $gameParty[_0x4bc4('0x9')](_0x1543a9[_0x4bc4('0xa')]);
                    Network['networkActorsId'][_0x4bc4('0xb')](_0x1543a9[_0x4bc4('0xa')]);
                    return NetPartyManager[_0x4bc4('0xc')]();
                } else {
                    _0x37aade = _0x1d1a56[_0x1f6225];
                    if (_0x37aade != null) {
                        $gameParty['removeActor'](_0x37aade['actorId']());
                        Network[_0x4bc4('0xd')][_0x4bc4('0xe')](_0x37aade['actorId']());
                    }
                }
            }
            return $gameParty[_0x4bc4('0xf')](NetPartyManager['getMyActorId']());
        };
        NetPartyManager['refreshParty'] = function () {
            var _0x2d39be, _0x26bcff, _0xb59e06;
            for (_0x2d39be = _0x26bcff = 0x1, _0xb59e06 = Network[_0x4bc4('0x7')][_0x4bc4('0x3')]; 0x1 <= _0xb59e06 ? _0x26bcff < _0xb59e06 : _0x26bcff > _0xb59e06; _0x2d39be = 0x1 <= _0xb59e06 ? ++_0x26bcff : --_0x26bcff) {
                $gameParty[_0x4bc4('0xf')](Network[_0x4bc4('0x7')][_0x2d39be]['actorId']);
            }
            return NetPartyManager[_0x4bc4('0xc')]();
        };
        NetPartyManager['getPlayer'] = function (_0x215fad) {
            return Network['playerData'](_0x215fad);
        };
        NetPartyManager[_0x4bc4('0x10')] = function (_0x39e528) {
            if (_0x4bc4('0x11') === _0x4bc4('0x11')) {
                return Network[_0x4bc4('0x7')][_0x39e528];
            } else {
                return Network[_0x4bc4('0x12')];
            }
        };
        NetPartyManager['getMe'] = function () {
            if (_0x4bc4('0x13') === 'DAsRO') {
                e = error;
                AlphaNET[_0x4bc4('0x14')](e, _0x4bc4('0x15'));
            } else {
                return Network[_0x4bc4('0x12')];
            }
        };
        NetPartyManager[_0x4bc4('0x16')] = function () {
            if (_0x4bc4('0x17') !== 'HIneJ') {
                return;
            } else {
                return NetPartyManager[_0x4bc4('0x18')]()['actorId'];
            }
        };
        NetPartyManager[_0x4bc4('0x19')] = function () {
            if ('LTNVD' !== _0x4bc4('0x1a')) {
                NetPartyManager[_0x4bc4('0xc')]();
                $gameMap[_0x4bc4('0x1b')]();
            } else {
                return NetPartyManager[_0x4bc4('0x10')](0x0);
            }
        };
        NetPartyManager[_0x4bc4('0x1c')] = function (_0x423a98) {
            return $gamePlayer['followers']()['getNetworkCharById'](_0x423a98);
        };
        NetPartyManager['getMyPlayerIndex'] = function () {
            return Network['players'][_0x4bc4('0x1d')](NetPartyManager[_0x4bc4('0x18')]()) + 0x1;
        };
        NetPartyManager[_0x4bc4('0x1e')] = function () {
            return NetPartyManager[_0x4bc4('0x1f')](Network[_0x4bc4('0x20')]());
        };
        NetPartyManager[_0x4bc4('0x1f')] = function (_0x1b1195) {
            var _0x344d3f, _0x454de1, _0x445cfd, _0x2a37dd;
            if (!SceneManager[_0x4bc4('0x21')]()) {
                return null;
            }
            try {
                if (_0x4bc4('0x22') !== _0x4bc4('0x23')) {
                    _0x454de1 = null;
                    _0x2a37dd = SceneManager[_0x4bc4('0x24')]['_spriteset'];
                    if (_0x2a37dd != null) {
                        _0x445cfd = _0x2a37dd[_0x4bc4('0x25')];
                        if (_0x445cfd != null) {
                            _0x445cfd['forEach'](function (_0x4cf9bd) {
                                if (_0x4cf9bd[_0x4bc4('0x26')] != null) {
                                    if (_0x4bc4('0x27') !== _0x4bc4('0x27')) {
                                        var _0x405761;
                                        _0x405761 = NetPartyManager[_0x4bc4('0x5')](id);
                                        return _0x405761['actorId'];
                                    } else {
                                        if (_0x4cf9bd['_character'] instanceof Game_Player) {
                                            if (_0x4bc4('0x28') === _0x4bc4('0x28')) {
                                                if (_0x1b1195 === Network['myId']()) {
                                                    if (_0x4bc4('0x29') === _0x4bc4('0x2a')) {
                                                        if (_0x1b1195 === Network[_0x4bc4('0x20')]()) {
                                                            _0x454de1 = _0x4cf9bd;
                                                        }
                                                    } else {
                                                        _0x454de1 = _0x4cf9bd;
                                                    }
                                                }
                                            } else {
                                                return;
                                            }
                                        }
                                        if (_0x4cf9bd[_0x4bc4('0x26')] instanceof AlphaNET['LIBS'][_0x4bc4('0x2b')]) {
                                            if (_0x4cf9bd[_0x4bc4('0x26')][_0x4bc4('0x2c')] === _0x1b1195) {
                                                if (_0x4bc4('0x2d') !== _0x4bc4('0x2e')) {
                                                    return _0x454de1 = _0x4cf9bd;
                                                } else {
                                                    var _0x437797, _0x61af40, _0x11eb57;
                                                    try {
                                                        _0x437797 = NetPartyManager[_0x4bc4('0x2f')](socketId);
                                                        _0x11eb57 = JsonEx[_0x4bc4('0x30')](data);
                                                        if ($gameActors[_0x4bc4('0x31')][_0x437797] == null) {
                                                            return;
                                                        }
                                                        $gameActors[_0x4bc4('0x31')][_0x437797] = _0x11eb57;
                                                        NetPartyManager['refresh']();
                                                    } catch (_0x3ae54f) {
                                                        _0x61af40 = _0x3ae54f;
                                                        AlphaNET[_0x4bc4('0x14')](_0x61af40, _0x4bc4('0x15'));
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                    return _0x454de1;
                } else {
                    return $gamePlayer[_0x4bc4('0x32')]()[_0x4bc4('0x33')](id);
                }
            } catch (_0x2e91ea) {
                if ('AYwCJ' === _0x4bc4('0x34')) {
                    _0x344d3f = _0x2e91ea;
                    AlphaNET['error'](_0x344d3f, 'while\x20get\x20character\x20sprite\x20on\x20map');
                } else {
                    var _0x52d62f, _0x5a23cb, _0xbe4507, _0x2c5893;
                    try {
                        _0x2c5893 = NetPartyManager[_0x4bc4('0x16')]();
                        _0x52d62f = $gameParty[_0x4bc4('0x35')](_0x2c5893);
                        _0x5a23cb = JsonEx[_0x4bc4('0x36')](_0x52d62f);
                        return _0x5a23cb;
                    } catch (_0x155d80) {
                        _0xbe4507 = _0x155d80;
                        return AlphaNET[_0x4bc4('0x14')](_0xbe4507, 'while\x20try\x20collect\x20actor\x20Data\x20to\x20synchronize');
                    }
                }
            }
            return null;
        };
        NetPartyManager[_0x4bc4('0x2f')] = function (_0x250f24) {
            if (_0x4bc4('0x37') === 'ZijNw') {
                var _0xd53532;
                _0xd53532 = NetPartyManager[_0x4bc4('0x5')](_0x250f24);
                return _0xd53532[_0x4bc4('0xa')];
            } else {
                var _0x2d212d, _0x2c98d3, _0x47898b;
                for (_0x2d212d = _0x2c98d3 = 0x1, _0x47898b = Network[_0x4bc4('0x7')][_0x4bc4('0x3')]; 0x1 <= _0x47898b ? _0x2c98d3 < _0x47898b : _0x2c98d3 > _0x47898b; _0x2d212d = 0x1 <= _0x47898b ? ++_0x2c98d3 : --_0x2c98d3) {
                    $gameParty[_0x4bc4('0xf')](Network[_0x4bc4('0x7')][_0x2d212d]['actorId']);
                }
                return NetPartyManager[_0x4bc4('0xc')]();
            }
        };
        NetPartyManager[_0x4bc4('0x38')] = function (_0x3d6e15) {
            var _0x93742a, _0x1d593a;
            _0x4bc4('0x39')['p'](_0x3d6e15);
            _0x1d593a = new AlphaNET['LIBS']['NetworkPlayerData'](_0x3d6e15);
            _0x93742a = Network['networkActorsId']['first']();
            _0x1d593a[_0x4bc4('0x3a')](_0x93742a);
            Network['networkActorsId'][_0x4bc4('0x8')](_0x93742a);
            return Network[_0x4bc4('0x7')]['push'](_0x1d593a);
        };
        NetPartyManager[_0x4bc4('0x3b')] = function (_0x141764) {
            if ('NANrQ' === _0x4bc4('0x3c')) {
                var _0x377796;
                _0x377796 = NetPartyManager[_0x4bc4('0x5')](_0x141764);
                if (_0x377796 == null) {
                    if ('toYeO' === _0x4bc4('0x3d')) {
                        return NetPartyManager[_0x4bc4('0x10')](0x0);
                    } else {
                        return;
                    }
                }
                _0x4bc4('0x6')['p'](_0x141764);
                Network['players'][_0x4bc4('0x8')](_0x377796);
                $gameParty[_0x4bc4('0x9')](_0x377796[_0x4bc4('0xa')]);
                Network['networkActorsId'][_0x4bc4('0xb')](_0x377796[_0x4bc4('0xa')]);
                return NetPartyManager['refreshCharacters']();
            } else {
                return NetPartyManager[_0x4bc4('0x18')]()[_0x4bc4('0xa')];
            }
        };
        NetPartyManager[_0x4bc4('0xc')] = function () {
            if (_0x4bc4('0x3e') !== _0x4bc4('0x3e')) {
                id = NetPartyManager[_0x4bc4('0x16')]();
                actor = $gameParty[_0x4bc4('0x35')](id);
                data = JsonEx[_0x4bc4('0x36')](actor);
                return data;
            } else {
                return $gamePlayer[_0x4bc4('0x32')]()[_0x4bc4('0x3f')]();
            }
        };
        NetPartyManager[_0x4bc4('0x40')] = function () {
            var _0xdc4a81, _0xdcfacb;
            if (SceneManager[_0x4bc4('0x41')]()) {
                return;
            }
            if ($gameMap[_0x4bc4('0x42')]()) {
                return;
            }
            _0xdc4a81 = NetPartyManager[_0x4bc4('0x43')]();
            if (_0xdc4a81 != null) {
                Network['sendMessage'](NetMessage[_0x4bc4('0x44')]()['setData'](_0xdc4a81));
            }
            _0xdcfacb = $gameParty['getDataForNetwork']();
            if (_0xdcfacb != null) {
                return Network[_0x4bc4('0x45')](NetMessage[_0x4bc4('0x46')]()['setData'](_0xdcfacb));
            }
        };
        NetPartyManager[_0x4bc4('0x43')] = function () {
            var _0x58533e, _0x4b1fd1, _0x3a97e1, _0x43e6e6;
            try {
                _0x43e6e6 = NetPartyManager['getMyActorId']();
                _0x58533e = $gameParty[_0x4bc4('0x35')](_0x43e6e6);
                _0x4b1fd1 = JsonEx['stringify'](_0x58533e);
                return _0x4b1fd1;
            } catch (_0x3f2c84) {
                if (_0x4bc4('0x47') === _0x4bc4('0x47')) {
                    _0x3a97e1 = _0x3f2c84;
                    return AlphaNET[_0x4bc4('0x14')](_0x3a97e1, _0x4bc4('0x48'));
                } else {
                    $gameParty[_0x4bc4('0xf')](Network[_0x4bc4('0x7')][i][_0x4bc4('0xa')]);
                }
            }
        };
        NetPartyManager[_0x4bc4('0x49')] = function (_0x52487b, _0x362d99) {
            if (_0x4bc4('0x4a') === _0x4bc4('0x4b')) {
                _0x3d6b7f = error;
                AlphaNET[_0x4bc4('0x14')](_0x3d6b7f, _0x4bc4('0x4c'));
            } else {
                var _0x58f71f, _0x3d6b7f, _0x2c3126;
                try {
                    _0x58f71f = NetPartyManager['getActorIdBySocketId'](_0x52487b);
                    _0x2c3126 = JsonEx[_0x4bc4('0x30')](_0x362d99);
                    if ($gameActors['_data'][_0x58f71f] == null) {
                        if (_0x4bc4('0x4d') === _0x4bc4('0x4d')) {
                            return;
                        } else {
                            if (SceneManager[_0x4bc4('0x21')]()) {
                                NetPartyManager[_0x4bc4('0xc')]();
                                $gameMap[_0x4bc4('0x1b')]();
                            }
                            if (SceneManager[_0x4bc4('0x4e')]()) {
                                return SceneManager[_0x4bc4('0x4f')]();
                            }
                        }
                    }
                    $gameActors[_0x4bc4('0x31')][_0x58f71f] = _0x2c3126;
                    NetPartyManager[_0x4bc4('0x50')]();
                } catch (_0x26bf4f) {
                    _0x3d6b7f = _0x26bf4f;
                    AlphaNET['error'](_0x3d6b7f, _0x4bc4('0x15'));
                }
            }
        };
        NetPartyManager[_0x4bc4('0x50')] = function () {
            if (_0x4bc4('0x51') !== _0x4bc4('0x52')) {
                if (SceneManager['isCurrentSceneIsMap']()) {
                    if (_0x4bc4('0x53') === _0x4bc4('0x53')) {
                        NetPartyManager[_0x4bc4('0xc')]();
                        $gameMap['requestRefresh']();
                    } else {
                        return null;
                    }
                }
                if (SceneManager[_0x4bc4('0x4e')]()) {
                    return SceneManager['safeRefreshCurrentScene']();
                }
            } else {
                return NetPartyManager[_0x4bc4('0x1f')](Network['myId']());
            }
        };
        NetPartyManager[_0x4bc4('0x54')] = function (_0x599406, _0x2cb6d9) {
            var _0x11be08, _0x20518f;
            try {
                if (_0x2cb6d9 == null) {
                    if (_0x4bc4('0x55') === _0x4bc4('0x55')) {
                        return;
                    } else {
                        $gameParty[_0x4bc4('0x9')](member[_0x4bc4('0xa')]());
                        Network[_0x4bc4('0xd')][_0x4bc4('0xe')](member[_0x4bc4('0xa')]());
                    }
                }
                _0x11be08 = NetPartyManager[_0x4bc4('0x2f')](_0x599406);
                if (_0x2cb6d9 != null) {
                    if (_0x4bc4('0x56') !== _0x4bc4('0x56')) {
                        if (sprite[_0x4bc4('0x26')][_0x4bc4('0x2c')] === netId) {
                            return result = sprite;
                        }
                    } else {
                        $gameParty[_0x4bc4('0x57')](_0x2cb6d9);
                    }
                }
                NetPartyManager[_0x4bc4('0x50')]();
            } catch (_0x36b867) {
                _0x20518f = _0x36b867;
                AlphaNET['error'](_0x20518f, 'while\x20try\x20synchronize\x20actor\x20Data\x20from\x20Network');
            }
        };
    }());
})();

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetPlayerWorldData.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var NetPlayerWorldData;
    NetPlayerWorldData = class NetPlayerWorldData {
        constructor() {
            this.actorData = null;
            this.actorItems = null;
            this.variablesData = [];
            this.selfSwitchData = [];
            this.switchData = [];
        }

        setActorData(data) {
            return this.actorData = data;
        }

        getActorData() {
            return this.actorData;
        }

        setActorItems(data) {
            return this.actorItems = data;
        }

        getActorItems() {
            return this.actorItems;
        }

        setWorldData(data) {
            var e;
            try {
                this.variablesData = data.variablesData;
                this.switchData = data.switchData;
                return this.selfSwitchData = data.selfSwitchData;
            } catch (error) {
                e = error;
                return Network.error(e, 'while try save World Data for player');
            }
        }

        getWorldDataNetwork() {
            var data;
            return data = {
                variablesData: JSON.stringify(this.variablesData),
                switchData: JSON.stringify(this.switchData),
                selfSwitchData: JSON.stringify(this.selfSwitchData)
            };
        }

        makeSaveContents(actorId) {
            var saveData, world;
            world = {
                variablesData: this.variablesData,
                switchData: this.switchData,
                selfSwitchData: this.selfSwitchData
            };
            saveData = {
                world: world,
                actorItems: this.actorItems,
                actorData: $gameActors._data[actorId]
            };
            return saveData;
        }

    };
    AlphaNET.register(NetPlayerWorldData);
})();

// ■ END NetPlayerWorldData.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetSessionData.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var NetSessionData;
    NetSessionData = class NetSessionData {
        constructor() {
            this._actorsData = {};
            this._globalData = new AlphaNET.LIBS.NetPlayerWorldData();
        }

        setPlayerActorData(actorId, data) {
            this._checkActorWorldData(actorId);
            //"PLAYER DATA SAVED TO SESSION".p(actorId)
            this.getAllData(actorId).setActorData(data);
        }

        getPlayerActorData(actorId) {
            this._checkActorWorldData(actorId);
            return this.getAllData(actorId).getActorData();
        }

        setPlayerItemsData(actorId, data) {
            this._checkActorWorldData(actorId);
            this.getAllData(actorId).setActorItems(data);
        }

        getPlayerItemsrData(actorId) {
            this._checkActorWorldData(actorId);
            return this.getAllData(actorId).getActorItems();
        }

        hasInfoAbout(actorId) {
            return this._actorsData[actorId] != null;
        }

        getAllData(actorId) {
            return this._actorsData[actorId];
        }

        getGlobalData() {
            return this._globalData;
        }

        setPlayerWorldData(actorId, data) {
            this._checkActorWorldData(actorId);
            return this.getAllData(actorId).setWorldData(data);
        }

        getPlayerWorldData(actorId) {
            this._checkActorWorldData(actorId);
            return this.getAllData(actorId).getWorldData();
        }

        makeSaveContents() {
            var _actorsData, g, item, saveData;
            _actorsData = {};
            for (item in this._actorsData) {
                if (this._actorsData.hasOwnProperty(item)) {
                    if (this._actorsData[item].actorData != null) {
                        _actorsData[item] = this._actorsData[item].makeSaveContents(item);
                    }
                }
            }
            g = this._globalData.makeSaveContents();
            return saveData = {
                global: g,
                actorsData: _actorsData
            };
        }

        extractSaveContents(content) {
            var e, item, results;
            try {
                this._loadDataToWorldObject(this._globalData, content.global);
                results = [];
                for (item in content.actorsData) {
                    if (content.actorsData.hasOwnProperty(item)) {
                        this._actorsData[item] = new AlphaNET.LIBS.NetPlayerWorldData();
                        results.push(this._loadDataToWorldObject(this._actorsData[item], content.actorsData[item]));
                    } else {
                        results.push(void 0);
                    }
                }
                return results;
            } catch (error) {
                e = error;
                return AlphaNET.error(e, ' while load network world save data');
            }
        }

        _loadDataToWorldObject(obj, data) {
            var e;
            try {
                obj.actorItems = data.actorItems;
                if (data.actorData != null) {
                    obj.actorData = JsonEx.stringify(data.actorData);
                }
                return obj.setWorldData(data.world);
            } catch (error) {
                e = error;
                return AlphaNET.error(e, ' while extract network world save data');
            }
        }

        _checkActorWorldData(actorId) {
            if (!this.hasInfoAbout(actorId)) {
                this._actorsData[actorId] = new AlphaNET.LIBS.NetPlayerWorldData();
            }
        }

    };
    AlphaNET.register(NetSessionData);
})();

// ■ END NetSessionData.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetWaitPool.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var NetWaitPool;
    NetWaitPool = class NetWaitPool {
        constructor(waitId) {
            this.waitId = waitId;
            this._clients = [];
            this.resetPool();
        }

        addClient(clientId, isReady = false) {
            if (this._getClientIndex(clientId) < 0) {
                this._clients.push(clientId);
            }
            if (isReady === true) {
                return this.setClientReady(clientId);
            }
        }

        _getClientIndex(clientId) {
            return this._clients.indexOf(clientId);
        }

        setClientReady(clientId) {
            return this._statuses[this._getClientIndex(clientId)] = true;
        }

        isPoolReady() {
            return this._statuses.every(function (status) {
                return status === true;
            });
        }

        resetPool() {
            return this._statuses = []; // * Массив готовности
        }

        getPoolSize() {
            return this._clients.length;
        }

    };
    AlphaNET.register(NetWaitPool);
})();

// ■ END NetWaitPool.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Network.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    //@[CLASS HEADER PART]
    //@[CLASS IMPL ONLY]
    Network.commonEventOnServerStarted = 0;
    Network.commonEventOnConnectToServer = 0;
    Network.commonEventOnDisconectFromServer = 0;
    Network.commonEventOnOtherClientConnected = 0;
    Network.commonEventOnOtherClientDisconected = 0;
    Network.maximumNetworkPlayers = 4;
    Network.networkActorsId = [
        1,
        2,
        3,
        4 // * This is mutable (меняется во время игры)
    ];
    Network.SERVER_UPDATE_TIME = 500;
    Network.WAIT_SERVER = 0;
    Network.WAIT_PLAYER = 1;
    Network.ICON_NONE = -1;
    Network.ICON_MESSAGE = 1;
    Network.ICON_MENU = 2;
    Network.ICON_SHOP = 3;
    Network.ICON_WAIT = 4;
    Network.isConnected = function () {
        return this._isConnected === true;
    };
    Network.isHost = function () {
        return Network.isConnected() && this._isHost === true;
    };
    Network.isHotGame = function () {
        return this._isHotGame === true;
    };
    Network.isBusy = function () {
        return this._isBusy === true;
    };
    Network.myId = function () {
        if (Network.isConnected()) {
            return this.socket.id;
        }
    };
    Network.playerData = function (id) {
        return Network.players.findElementByField('id', id);
    };
    Network.isHotHost = function () {
        return Network.isHotGame() && Network.isHost();
    };
    Network.inBattle = function () {
        return this._inBattle === true;
    };
    Network.allowConnect = function () {
        return this._allowConnection === true;
    };
    Network.canConnect = function () {
        return SceneManager.isCurrentSceneIsMap() && !Network.isBusy();
    };
    Network.startServer = function () {
        return Network._startServer();
    };
    Network.stopServer = function () {
        var ref;
        return (ref = this.server) != null ? ref.stop() : void 0;
    };
    Network.connectToServer = function () {
        return Network._connectToServer();
    };
    Network.disconnect = function () {
        var ref;
        return (ref = this.client) != null ? ref.disconnect() : void 0;
    };
    Network.sendMessage = function (netMessage) {
        if (!Network.isConnected()) {
            return;
        }
        netMessage.setFrom(this.socket.id).send();
    };
    Network.sendIcon = function (iconId) {
        var msg;
        if (!Network.isConnected()) {
            return;
        }
        if (iconId == null) {
            iconId = Network.ICON_NONE;
        }
        msg = NetMessage.PlayerNetIcon().setData(iconId);
        return Network.sendMessage(msg);
    };
    Network.requestSync = function (syncId) {
        var msg;
        if (!Network.isConnected()) {
            return;
        }
        msg = NetMessage.RequestSync().setData(syncId).setRepeat(Network.WAIT_PLAYER);
        return Network.sendMessage(msg);
    };
    //?{TEST}
    Network.sendTemp = function (data) {
        var msg;
        if (!Network.isConnected()) {
            return;
        }
        msg = NetMessage.TempMessage().setData(data);
        return Network.sendMessage(msg);
    };
    Network.sendTempWait = function (data) {
        var msg;
        if (!Network.isConnected()) {
            return;
        }
        msg = NetMessage.TempMessage().setRepeat().setData(data);
        return Network.sendMessage(msg);
    };
    AlphaNET.register(Network);
})();

// ■ END Network.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Network_private.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var LOG;
    LOG = new KDCore.DevLog("Network");
    LOG.on();
    LOG.setColors(KDCore.Color.BLUE, KDCore.Color.BLACK.getLightestColor(235));

    //@[CLASS PRIVATE PART]
    //@[CLASS IMPL ONLY]
    Network.ip = 'localhost';
    Network.port = 3032;
    Network.initialize = function () {
        LOG.p("Network initialized on " + Network.ip + " : " + Network.port);
        this.socket = null;
        this._isConnected = false;
        this._isHost = false;
        this._isHotGame = false;
        this._isBusy = false;
        this._thread = null;
        this.players = [];
        this.myPlayerData = null;
        this._waitMode = 0;
        this._allowConnection = true;
        this.sessionData = null;
        Network.networkActorsId = AlphaNET.Parameters.get_actorsForPlayers();
        Network.maximumNetworkPlayers = Network.networkActorsId.length;
        AlphaNET.Parameters.load_CommonEventsForNetwork();
    };
    Network._startServer = function () {
        if (Utils.isNwjs()) {
            return this.server = new AlphaNET.LIBS.NetworkServer(Network.port);
        } else {
            return LOG.p("You can start server only in NW.js (PC)");
        }
    };
    Network._connectToServer = function () {
        var adr;
        if (this.socket != null) {
            return LOG.p("Connection already exists!");
        } else {
            adr = this._makeNetAdress();
            LOG.p("Connect to " + adr);
            this.socket = io(adr);
            return this.client = new AlphaNET.LIBS.NetworkClient(this.socket);
        }
    };
    Network.setHost = function () {
        return this._isHost = true;
    };
    Network.setHotGame = function (isHotGame) {
        return this._isHotGame = isHotGame;
    };
    Network._makeNetAdress = function () {
        return 'http://' + Network.ip + ":" + Network.port;
    };
    Network.runEvent = function (commonEventId) {
        if ((commonEventId != null) && commonEventId > 0 && ($dataCommonEvents[commonEventId] != null)) {
            LOG.p("Start common event " + commonEventId);
            return $gameTemp.reserveCommonEvent(commonEventId);
        }
    };
    Network.onConnectToServer = function () {
        return this._isConnected = true;
    };
    Network.onConnectionError = function () {
        return this.socket = null;
    };
    //TODO: Либо вызывать общее событие, либо сделать handler
    Network.onConnectionLost = function () {
        Network.disconnect();
        this._isConnected = false;
        this.socket = null;
        return Network.clearPlayersData();
    };
    Network.clearPlayersData = function () {
        Network.players = [];
        Network.myPlayerData = null;
        return NetPartyManager.refreshCharacters();
    };
    Network.isPlayerWaitMode = function () {
        return this._waitMode === Network.WAIT_PLAYER;
    };
    Network.isServerWaitMode = function () {
        return this._waitMode === Network.WAIT_SERVER;
    };
    Network.getLastResponseData = function () {
        return this._lastResponseData;
    };
    //?[TEST]
    Network.test = function () {
        var msg;
        msg = new AlphaNET.LIBS.NetMessage(this.socket);
        msg.setName('testWaitHard').send("baba").setWait();
        return this._isBusy = true;
    };
    //?[TEST]
    Network.test2 = function () {
        var msg;
        msg = new AlphaNET.LIBS.NetMessage(this.socket);
        msg.setName('testWaitHardRepeated').send("gfgf").setRepeat();
        return this._isBusy = true;
    };
    //*Активирует режим ожидания ответа от сервера, игра зависает и ждёт ответ от сервера
    Network.waitServerResponse = function (netMessage, waitMode) {
        //LOG.p 'Sended wait state request to server ' + netMessage.name
        this._waitMode = waitMode || Network.WAIT_SERVER;
        this._isBusy = true;
        Network.sendIcon(Network.ICON_WAIT);
    };
    //*Активирует режим повторения команды, игра в это время зависает и ждёт ответ от сервера
    Network.waitServerResponseRepeated = function (netMessage, waitMode) {
        var func;
        //LOG.p 'Repeated mode'
        Network.waitServerResponse(netMessage, waitMode);
        this._thread = setTimeout(func = function () {
            if (Network.isBusy() && (Network._thread != null)) {
                netMessage.send();
                Network.sendIcon(Network.ICON_WAIT);
                return Network._thread = setTimeout(func, 2000);
            }
        }, 2000);
    };

    //*Ответ (который игра ждала) получен, игра отвисает
    Network.onServerResponse = function (data) {
        //LOG.p 'Wait state request complete'
        this._lastResponseData = data;
        this._isBusy = false;
        Network.sendIcon(Network.ICON_NONE);
        if (this._thread != null) {
            clearInterval(this._thread);
        }
    };
    Network.error = function (error, message) {
        if (Network._errorLog == null) {
            Network._errorLog = new KDCore.DevLog('Network Error');
            Network._errorLog.setColors(KDCore.Color.RED, KDCore.Color.BLACK.getLightestColor(225));
            Network._errorLog.on();
        }
        if (message != null) {
            Network._errorLog.p(message);
        }
        return console.error(error);
    };
})();

// ■ END Network_private.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetworkCharacter.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
var NetworkCharacter;

NetworkCharacter = class NetworkCharacter extends Game_Follower {
    constructor(index) {
        super(index);
    }

    refreshNet() {
        var pl;
        pl = NetPartyManager.getPlayerByIndex(this.netIndex);
        if (pl != null) {
            this.netId = pl.id;
        } else {
            this.netId = null;
        }
        return this.refresh();
    }

    initialize(index) {
        this.netIndex = index;
        this.netId = null;
        Game_Follower.prototype.initialize.call(this, this.netIndex);
        return this.setTransparent(false);
    }

    actor() {
        var pl;
        if (!Network.isConnected()) {
            return null;
        }
        pl = NetPartyManager.getPlayerByIndex(this.netIndex);
        if (pl == null) {
            return null;
        }
        if (pl.id === Network.myPlayerData.id) {
            // * Если это я, то не создаётся NetworkCharacter
            return null;
        }
        return $gameParty.memberByActorId(pl.actorId);
    }

    update() {
        return Game_Character.prototype.update.call(this);
    }

    //?[EMPTY]
    chaseCharacter() {}

};

AlphaNET.register(NetworkCharacter);

// ■ END NetworkCharacter.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetworkPlayerData.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var NetworkPlayerData;
    NetworkPlayerData = class NetworkPlayerData {
        constructor(id) {
            this.id = id;
        }

        setActorId(actorId) {
            return this.actorId = actorId;
        }

        data() {
            return {
                id: this.id,
                actorId: this.actorId
            };
        }

    };
    AlphaNET.register(NetworkPlayerData);
})();

// ■ END NetworkPlayerData.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ NetWorldManager.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//@[CLASS IMPL ONLY]

// 121 - Switch
// 122 - Variable
// 123 - SelfSwitch
NetWorldManager.WORLD_SYNC_COMMANDS = [121, 122, 123];

NetWorldManager.synchronize = function () {
    var data;
    if (SceneManager.isCurrentSceneIsBattle()) {
        return;
    }
    if ($gameMap.isEventRunning()) {
        return;
    }
    if (Network.isHost()) {
        return;
    }
    data = {};
    data.variablesData = NetWorldManager.getDataForNetwork($gameVariables);
    data.switchData = NetWorldManager.getDataForNetwork($gameSwitches);
    data.selfSwitchData = NetWorldManager.getDataForNetwork($gameSelfSwitches);
    return Network.sendMessage(NetMessage.PlayerWorldData().setData(data));
};

NetWorldManager.onWorldDataFromNetwork = function (data) {
    NetWorldManager.setDataFromNetwork($gameVariables, data.variablesData);
    NetWorldManager.setDataFromNetwork($gameSwitches, data.switchData);
    return NetWorldManager.setDataFromNetwork($gameSelfSwitches, data.selfSwitchData);
};

NetWorldManager.onGlobalWorldDataFromNetwork = function (data) {
    NetWorldManager.setExtraFromNetwork($gameVariables, data.variablesData);
    NetWorldManager.setExtraFromNetwork($gameSwitches, data.switchData);
    return NetWorldManager.setExtraFromNetwork($gameSelfSwitches, data.selfSwitchData);
};

NetWorldManager.getDataForNetwork = function (gameVariableObject) {
    return JSON.stringify(gameVariableObject._data);
};

NetWorldManager.setDataFromNetwork = function (gameVariableObject, data) {
    var netArray;
    netArray = JSON.parse(data);
    gameVariableObject._data = netArray;
    return gameVariableObject.onChange();
};

// * Загружает дополнительные значения (которые были под NET sync или NET virtual)
// * [[id, value],...]
NetWorldManager.setExtraFromNetwork = function (gameVariableObject, data) {
    var i, item, j, netData, ref;
    netData = JSON.parse(data);
    for (i = j = 0, ref = netData.length;
        (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        item = netData[i];
        gameVariableObject._data[item[0]] = item[1];
    }
    gameVariableObject.onChange();
};

NetWorldManager.onEventSyncCommand = function (commandData) {
    var e, event, line, mapId, page;
    if (!Network.isHost()) {
        return;
    }
    mapId = commandData.mapId;
    if ($gameMap.mapId() !== mapId) {
        return;
    }
    event = $gameMap.event(commandData.eventId);
    if (event == null) {
        return;
    }
    try {
        page = event.event().pages[commandData.pi];
        if (page == null) {
            return;
        }
        line = page.list[commandData.li];
        if (line == null) {
            return;
        }
        if (NetWorldManager.WORLD_SYNC_COMMANDS.include(line.code)) {
            return NetWorldManager.saveGlobalInfo(line.code, line.parameters, commandData);
        }
    } catch (error) {
        e = error;
        return Network.error(e, 'while check event sync command');
    }
};

NetWorldManager.saveGlobalInfo = function (code, parameters, evData) {
    var p;
    "saveGlobalInfo for".p(code);
    p = parameters;
    switch (code) {
        case 121:
            NetWorldManager.setSwitchToGlobal(p[0], p[1], p[2] === 0);
            break;
        case 122:
            setTimeout((function () {
                return NetWorldManager.setVariableToGlobal(p[0], p[1]);
            }), 500);
            break;
        case 123:
            NetWorldManager.setSelfSwitchToGlobal(p[0], p[1] === 0, evData);
            break;
        default:
            break;
    }
};

NetWorldManager.setSwitchToGlobal = function (fromI, toI, value) {
    var global, i, j, ref, ref1;
    global = Network.sessionData.getGlobalData();
    for (i = j = ref = fromI, ref1 = toI;
        (ref <= ref1 ? j <= ref1 : j >= ref1); i = ref <= ref1 ? ++j : --j) {
        global.switchData.push([i, value]);
    }
};

NetWorldManager.setVariableToGlobal = function (fromI, toI) {
    var e, global, i, j, ref, ref1;
    try {
        global = Network.sessionData.getGlobalData();
        for (i = j = ref = fromI, ref1 = toI;
            (ref <= ref1 ? j <= ref1 : j >= ref1); i = ref <= ref1 ? ++j : --j) {
            global.variablesData.push([i, $gameVariables.value(i)]);
        }
    } catch (error) {
        e = error;
        return Network.error(e, 'while set variables to global');
    }
};

NetWorldManager.setSelfSwitchToGlobal = function (switchName, value, commandData) {
    var e, global, key;
    try {
        global = Network.sessionData.getGlobalData();
        key = [commandData.mapId, commandData.eventId, switchName];
        global.selfSwitchData.push([key.toString(), value]);
    } catch (error) {
        e = error;
        return Network.error(e, 'while set selfSwitch to global');
    }
};

NetWorldManager.onEventVirtualCommand = function (commandData) {
    if (!Network.isHost()) {
        return;
    }
    if (!NetWorldManager.WORLD_SYNC_COMMANDS.include(commandData.id)) {
        return;
    }
    NetWorldManager.saveGlobalInfo(commandData.id, commandData.parameters, commandData);
};

// ■ END NetWorldManager.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ PointX.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//@[MINI VERSION OF POINTX]
//@[GLOBAL DEFINITION]
var PointX;

PointX = (function () {
    class PointX {
        constructor(_x, _y) {
            this._x = _x;
            this._y = _y;
        }

        convertToCanvas() {
            return new PointX(Graphics.pageToCanvasX(this._x), Graphics.pageToCanvasY(this._y));
        }

        convertToMap() {
            return new PointX($gameMap.canvasToMapX(this._x), $gameMap.canvasToMapY(this._y));
        }

        convertToScreen() {
            return new PointX(this.screenX(), this.screenY());
        }

        screenX() {
            var t, tw;
            t = $gameMap.adjustX(this._x);
            tw = $gameMap.tileWidth();
            return Math.round(t * tw + tw / 2);
        }

        screenY() {
            var t, th;
            t = $gameMap.adjustY(this._y);
            th = $gameMap.tileHeight();
            return Math.round(t * th + th);
        }

        clone() {
            return new PointX(this._x, this._y);
        }

        toString() {
            return `[${this._x}:${this._y}]`;
        }

        static _getEmpty() {
            if (PointX._empty == null) {
                PointX._empty = new PointX(0, 0);
            }
            return PointX._empty;
        }

    };

    Object.defineProperties(PointX.prototype, {
        x: {
            get: function () {
                return this._x;
            },
            configurable: true
        },
        y: {
            get: function () {
                return this._y;
            },
            configurable: true
        }
    });

    Object.defineProperties(PointX, {
        Empty: {
            get: function () {
                return PointX._getEmpty();
            },
            configurable: false
        }
    });

    return PointX;

}).call(this);

//@[EXTENSIONS]
Array.prototype.toPoint = function () {
    return new PointX(this[0], this[1]);
};

Sprite.prototype.toPoint = function () {
    return new PointX(this.x, this.y);
};

// ■ END PointX.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Base.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Scene_Base_isBusy = Scene_Base.prototype.isBusy;
    Scene_Base.prototype.isBusy = function () {
        var base = _alias_Scene_Base_isBusy.call(this);
        return base && Network.isBusy() && $gamePlayer.isTransferring();
    };

    //@[ALIAS]
    var _alias_Scene_Base_initialize = Scene_Base.prototype.initialize;
    Scene_Base.prototype.initialize = function () {
        _alias_Scene_Base_initialize.call(this);
        this._syncIsShowed = false;
        this._spriteNetSyncMini = new AlphaNET.LIBS.Sprite_WaitNetworkMini();
        this._spriteNetSync = new AlphaNET.LIBS.Sprite_WaitNetwork();
    };

    //@[ALIAS]
    var _alias_Scene_Base_updateNET = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function () {
        if (Network.isBusy()) {
            if (Network.isServerWaitMode()) {
                this._updateOnBusyNetwork();
                return;
            } else {
                this._showSyncWait(Network.WAIT_PLAYER);
            }
        } else {
            this._hideSyncWait();
        }
        this._updateNetwork();
        _alias_Scene_Base_updateNET.call(this, ...arguments);
    };
})();


//?[NEW]
Scene_Base.prototype._updateOnBusyNetwork = function () {
    this.updateFade();
    this._showSyncWait(Network.WAIT_SERVER);
};

//?[NEW]
Scene_Base.prototype._showSyncWait = function (waitId) {
    this._showSyncWaitMini();
    setTimeout(() => {
        if (this._syncIsShowed == true) {
            this.addChild(this._spriteNetSync);
            this._spriteNetSync.activate(waitId);
        }
    }, 1000);
};

//?[NEW]
Scene_Base.prototype._showSyncWaitMini = function () {
    if (this._spriteNetSyncMini.isActive()) return;
    this._syncIsShowed = true;
    this.addChild(this._spriteNetSyncMini);
    this._spriteNetSyncMini.activate();
};

//?[NEW]
Scene_Base.prototype._hideSyncWait = function () {
    if (!this._syncIsShowed) return;
    this._syncIsShowed = false;
    this._spriteNetSyncMini.hide();
    this._spriteNetSync.hide();
    this.removeChild(this._spriteNetSyncMini);
    this.removeChild(this._spriteNetSync);
};

//?[NEW]
Scene_Base.prototype._updateNetwork = function () {
    if (!Network.isConnected()) return;
    if (Network.isHost()) {
        if (this instanceof Scene_Map) {
            //?EMPTY
            // * Все движения событий обрабатываются на хосте, поэтому если хост на сцене карты,
            // * то всё нормально. А если хост на другой сцене, то нужно дополнительное обновление
            // * игровой карты, чтобы события не стояли на месте у всех других игроков
        } else {
            $gameMap.updateEventsForNetwork();
        }
    }
};

// ■ END Scene_Base.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Battle.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function () {
        _alias_Scene_Battle_createPartyCommandWindow.call(this, ...arguments);
        if (Network.isConnected()) {
            // * Выбор команд группы только за хостом
            this._partyCommandWindow.setNetworkShared(true);
        }
    };

    //@[ALIAS]
    var _alias_Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function () {
        if (Network.isConnected()) {
            if (BattleManager.isMyActorInput())
                _alias_Scene_Battle_startActorCommandSelection.call(this);
            else
                this.endCommandSelection();
        } else {
            _alias_Scene_Battle_startActorCommandSelection.call(this);
        }
    };

    //@[ALIAS]
    var _alias_Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function () {
        if (Network.isConnected()) {
            Network._inBattle = true;
        }
        _alias_Scene_Battle_start.call(this, ...arguments);
    };

    //@[ALIAS]
    var _alias_Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        _alias_Scene_Battle_terminate.call(this, ...arguments);
        Network._inBattle = false;
    };

})();
// ■ END Scene_Battle.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_IpConfig.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Scene_IpConfig;
    Scene_IpConfig = class Scene_IpConfig extends Scene_Base {
        constructor() {
            super();
            SMouse.initMouseTrack(true);
            this._loadResources();
            this._createTitle();
            this._createInfo();
            this._createCommandWindow();
            this._createInputWindow();
        }

        _loadResources() {
            ImageManager.loadNetwork('btn1');
            ImageManager.loadNetwork('btn2');
            return ImageManager.loadNetwork('btn3');
        }

        _createTitle() {
            var h, title;
            title = new Sprite(new Bitmap(Graphics._boxWidth, 200));
            title.bitmap.fontSize = 80;
            h = title.bitmap.height / 2;
            title.bitmap.drawText('ALPHA', 0, h, 400, 1, 'center');
            title.bitmap.textColor = KDCore.Color.BLUE.CSS;
            title.bitmap.drawText('NET', 180, h, 400, 1, 'center');
            return this.addChild(title);
        }

        _createInfo() {}

        _createCommandWindow() {
            this.cmdWindow = new AlphaNET.LIBS.Window_IpConfig();
            this.cmdWindow.setHandler('cancel', this.popScene.bind(this));
            this.cmdWindow.setHandler('ip', this._ipCommand.bind(this));
            this.cmdWindow.setHandler('port', this._portCommand.bind(this));
            return this.addChild(this.cmdWindow);
        }

        _ipCommand() {
            this.cmdWindow.close();
            this.cmdWindow.deactivate();
            return this.input.start("ip");
        }

        _portCommand() {
            this.cmdWindow.close();
            this.cmdWindow.deactivate();
            return this.input.start("port");
        }

        _createInputWindow() {
            this.input = new AlphaNET.LIBS.Window_IpInput();
            this.input.setHandler('cancel', this._onInputCancel.bind(this));
            this.input.setHandler('ok', this._onInputOk.bind(this));
            return this.addChild(this.input);
        }

        _onInputOk() {
            this.input.saveTextData();
            return this._onInputCancel();
        }

        _onInputCancel() {
            this.cmdWindow.open();
            this.cmdWindow.activate();
            this.input.close();
            return this.input.deactivate();
        }

        terminate() {
            super.terminate();
            return SMouse.setTrack(false);
        }

    };
    AlphaNET.register(Scene_IpConfig);
})();

// ■ END Scene_IpConfig.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Map.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function () {
        _alias_Scene_Map_start.call(this, ...arguments);
        Network.sendIcon(null);
    };
})();
// ■ END Scene_Map.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Menu.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function () {
        _alias_Scene_Menu_start.call(this, ...arguments);
        Network.sendIcon(Network.ICON_MENU);
    };
})();
// ■ END Scene_Menu.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_MenuBase.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //?[NEW]
    Scene_MenuBase.prototype.refreshNetwork = function () {
        try {
            this.updateActor();
            if (this._windowLayer == null)
                return;
            var childs = this._windowLayer.children;
            for (var i = 0; i < childs.length; i++) {
                var child = childs[i];
                if (child != null && child.refresh != null) {
                    child.refresh();
                }
            }
        } catch (e) {
            AlphaNET.error(e, 'while try refresh MenuBased scene from Network');
        }
    };
})();
// ■ END Scene_MenuBase.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Options.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _alias_Window_Options_makeCommandList.call(this, ...arguments);
        this.addCommand('Network', 'network');
    };

    //@[ALIAS]
    var _alias_Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        if (this._isNetworkCommand(index)) {
            if (Network != null)
                return Network.ip + ":" + Network.port;
            else
                return "";
        } else
            return _alias_Window_Options_statusText.call(this, ...arguments);
    };

    //?[NEW]
    Window_Options.prototype._isNetworkCommand = function (index) {
        return this.commandName(index).contains('Network');
    };

    //@[ALIAS]
    var _alias_Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (this._isNetworkCommand(this.index())) {
            SoundManager.playCursor();
            SceneManager.push(AlphaNET.LIBS.Scene_IpConfig);
        } else {
            _alias_Window_Options_processOk.call(this, ...arguments);
        }
    };
})();
// ■ END Scene_Options.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Shop.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Scene_Shop_start = Scene_Shop.prototype.start;
    Scene_Shop.prototype.start = function () {
        _alias_Scene_Shop_start.call(this, ...arguments);
        Network.sendIcon(Network.ICON_SHOP);
    };
})();
// ■ END Scene_Shop.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Status.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

})();
// ■ END Scene_Status.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Scene_Manager_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //?[NEW]
    SceneManager.isCurrentSceneIsMap = function () {
        return (this._scene != null && this._scene instanceof Scene_Map);
    };

    //?[NEW]
    SceneManager.isCurrentSceneIsBattle = function () {
        return (this._scene != null && this._scene instanceof Scene_Battle);
    };

    //?[NEW]
    SceneManager.isCurrentSceneIsMenuBased = function () {
        return (this._scene != null && this._scene instanceof Scene_MenuBase);
    };

    //?[NEW]
    SceneManager.safeRefreshCurrentScene = function () {
        try {
            if (this._scene.refresh != null)
                this._scene.refresh();
            if (this._scene.refreshNetwork != null)
                this._scene.refreshNetwork();
            if (this._scene.refreshActor != null)
                this._scene.refreshActor();
        } catch (error) {
            AlphaNET.error(error, 'while try refresh current game scene');
        }
    };
})();
// ■ END Scene_Manager_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ SMouse.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//@[GLOBAL DEFINITION]

var __SmouseNeedTrack = false;
var __SmousePosition = null;

function SMouse() {
    throw new Error('This is a static class');
}

SMouse.initMouseTrack = function (isSet) {
    document.onmousemove = SMouse.handleMouseMove;
    __SmouseNeedTrack = false;
    __SmousePosition = PointX.Empty;
    if (isSet == true) {
        SMouse.setTrack(true);
    }
};

SMouse.setTrack = function (isSet) {
    __SmouseNeedTrack = isSet;
    if (isSet) this.handleMouseMove(null);
};

SMouse.isTracked = function () {
    return (__SmouseNeedTrack == true);
};

SMouse.handleMouseMoveCanvas = function (canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    __SmousePosition = new PointX(evt.clientX - rect.left, evt.clientY - rect.top);
};

SMouse.handleMouseMove = function (event) {
    if (!__SmouseNeedTrack) return;

    var eventDoc, doc, body;

    event = event || window.event; // IE-ism
    if (!event) return;

    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0);
    }

    __SmousePosition = new PointX(event.pageX, event.pageY);
    __SmousePosition = __SmousePosition.convertToCanvas();
};

SMouse.getMousePosition = function () {
    if (!Utils.isMobileDevice())
        return __SmousePosition;
    else
        return PointX.Empty;
};

// ■ END SMouse.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Sprite_Character.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Sprite_Character_updateBalloon = Sprite_Character.prototype.updateBalloon;
    Sprite_Character.prototype.updateBalloon = function () {
        _alias_Sprite_Character_updateBalloon.call(this, ...arguments);
        this._setupNetworkIcon();
        if (this._networkIconSprite) {
            this._networkIconSprite.x = this.x;
            this._networkIconSprite.y = this.y - this.height;
        }
    };

    //?[NEW]
    Sprite_Character.prototype._setupNetworkIcon = function () {
        var iconId = this._character.networkIconId();
        if (iconId == -1) {
            this._endNetworkIcon();
        }
        if (iconId > 0) {
            this._startNetworkIcon();
            this._character._startNetworkIcon();
        }
    };

    //?[NEW]
    Sprite_Character.prototype._startNetworkIcon = function () {
        if (!this._networkIconSprite) {
            this._networkIconSprite = new AlphaNET.LIBS.Sprite_NetStatusIcon();
        }
        this._networkIconSprite.setup(this._character.networkIconId());
        this.parent.addChild(this._networkIconSprite);
    };

    //?[NEW]
    Sprite_Character.prototype._endNetworkIcon = function () {
        if (this._networkIconSprite) {
            this.parent.removeChild(this._networkIconSprite);
            this._networkIconSprite = null;
        }
    };

})();
// ■ END Sprite_Character.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Sprite_NetStatusIcon.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Sprite_NetStatusIcon;
    Sprite_NetStatusIcon = class Sprite_NetStatusIcon extends Sprite_Balloon {
        constructor() {
            super();
        }

        loadBitmap() {
            this.bitmap = ImageManager.loadNetwork('StateIcons');
            return this.setFrame(0, 0, 0, 0);
        }

        setup(iconId) {
            this._balloonId = iconId;
            return this._duration = 5 * this.speed() + this.waitTime();
        }

        update() {
            super.update();
            if (this._duration <= 0) {
                this._firstStep = true;
                return this.setup(this._balloonId);
            }
        }

        frameIndex() {
            var frameIndex, index;
            index = (this._duration - this.waitTime()) / this.speed();
            frameIndex = 4 - Math.max(Math.floor(index), 0);
            if (this._firstStep == null) {
                return frameIndex;
            } else {
                if (frameIndex === 0) {
                    return 1;
                } else {
                    return frameIndex;
                }
            }
        }

    };
    AlphaNET.register(Sprite_NetStatusIcon);
})();

// ■ END Sprite_NetStatusIcon.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ AXUI_Container.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//@[PART OF Alpha ABS AXUI]
(function () {
    var UIContainer;
    UIContainer = class UIContainer extends Sprite {
        constructor(size) {
            super(new Bitmap(size, size));
            this.size = size;
            this.items = [];
            this.orientation = "horizontal";
            this.placePoint = "rigth";
            this.itemsCount = 1;
            this.spacing = 0;
            this.move(100, 100);
        }

        //?{PUBLIC}
        setItemsCount(itemsCount) {
            this.itemsCount = itemsCount;
            return this._refreshMain();
        }

        _refreshMain() {
            var s;
            s = this._getSize() * this.itemsCount;
            this.bitmap = new Bitmap(s, s);
            this._rearrange();
            return this._refreshPlace();
        }

        _getSize() {
            return this.size + this.spacing;
        }

        //?{PUBLIC}
        setSpacing(spacing) {
            this.spacing = spacing;
            return this._refreshMain();
        }

        //?{PUBLIC}
        addChild(sprite) {
            this._createItem(sprite);
            this._rearrange();
            return this._refreshPlace();
        }

        _createItem(sprite) {
            this._reCreatePlacer(sprite.visible);
            this.items.push(sprite);
            return this._placer.addChild(sprite);
        }

        _reCreatePlacer(isNew) {
            var pl, s, visLen;
            if (this._placer != null) {
                super.removeChild(this._placer);
            }
            visLen = this._visItemsLength();
            if (isNew === true) {
                visLen += 1;
            }
            s = this._getSize() * visLen;
            s -= this.spacing;
            this._placer = new Sprite(new Bitmap(s, s));
            super.addChild(this._placer);
            pl = this._placer;
            this.items.forEach(function (item) {
                if (item.visible === true) {
                    return pl.addChild(item);
                }
            });
        }

        _visItemsLength() {
            var count, i, j, ref;
            count = 0;
            for (i = j = 0, ref = this.items.length;
                (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
                if (this.items[i].visible === true) {
                    count++;
                }
            }
            return count;
        }

        _rearrange() {
            var ref, ref1;
            if (this._placer == null) {
                return;
            }
            if ((ref = this._placer.children[0]) != null) {
                ref.x = 0;
            }
            if ((ref1 = this._placer.children[0]) != null) {
                ref1.y = 0;
            }
            if (this.isVertical()) {
                return this._rearrangeVertical();
            } else {
                return this._rearrangeHorizontal();
            }
        }

        _rearrangeVertical() {
            var i, items, j, ref, results, s;
            items = this._placer.children;
            s = this._getSize();
            results = [];
            for (i = j = 1, ref = items.length;
                (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
                results.push(items[i].y = items[0].y + (s * i));
            }
            return results;
        }

        _rearrangeHorizontal() {
            var i, items, j, ref, results, s;
            items = this._placer.children;
            s = this._getSize();
            results = [];
            for (i = j = 1, ref = items.length;
                (1 <= ref ? j < ref : j > ref); i = 1 <= ref ? ++j : --j) {
                results.push(items[i].x = items[0].x + (s * i));
            }
            return results;
        }

        _refreshPlace() {
            if (this._placer == null) {
                return;
            }
            if (this.isVertical()) {
                return this._refreshPlaceVertical();
            } else {
                return this._refreshPlaceHorizontal();
            }
        }

        _refreshPlaceVertical() {
            if (this.placePoint === "center") {
                this._placer.y = this.height / 2;
                this._placer.y = this._placer.y - (this._placer.height / 2);
            }
            if (this.placePoint === "left") {
                this._placer.y = this.height;
                return this._placer.y = this._placer.y - this._placer.height;
            }
        }

        _refreshPlaceHorizontal() {
            if (this.placePoint === "center") {
                this._placer.x = this.width / 2;
                this._placer.x = this._placer.x - (this._placer.width / 2);
            }
            if (this.placePoint === "left") {
                this._placer.x = this.width;
                return this._placer.x = this._placer.x - this._placer.width;
            }
        }

        //?{PUBLIC}
        refresh() {
            this._reCreatePlacer(false);
            this._rearrange();
            return this._refreshPlace();
        }

        //?{PUBLIC}
        setHorizontal() {
            this.orientation = "horizontal";
            this._rearrange();
            return this._refreshPlace();
        }

        //?{PUBLIC}
        isHorizontal() {
            return this.orientation === "horizontal";
        }

        //?{PUBLIC}
        setVertical() {
            this.orientation = "vertical";
            this._rearrange();
            return this._refreshPlace();
        }


        //?{PUBLIC}
        isVertical() {
            return this.isHorizontal() === false;
        }


        //?{PUBLIC}
        setPivotToCenter() {
            this.placePoint = "center";
            return this._refreshPlace();
        }


        //?{PUBLIC}
        setPivotToLeft() {
            this.placePoint = "left";
            return this._refreshPlace();
        }


        //?{PUBLIC}
        setPivotToRight() {
            this.placePoint = "right";
            return this._refreshPlace();
        }

    };
    AlphaNET.register(UIContainer);
})();

// ■ END AXUI_Container.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Sprite_WaitNetwork.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Sprite_WaitNetwork;
    Sprite_WaitNetwork = (function () {
        class Sprite_WaitNetwork extends Sprite {
            constructor() {
                super(new Bitmap(Graphics.width, Sprite_WaitNetwork.HEIGHT));
                this._waitId = 0;
                this._stepper = 0;
                this.move(0, (Graphics.height / 2) - Sprite_WaitNetwork.HEIGHT / 2);
                this.hide();
            }

            isActive() {
                return this.visible === true && (this.parent != null);
            }

            activate(waitId) {
                this.bitmap.clear();
                this._waitId = waitId;
                this.visible = true;
                return this._drawMain();
            }

            //@_startThread()
            hide() {
                return this.visible = false;
            }

            _drawMain() {
                var prefix, text;
                this.bitmap.clear();
                this.bitmap.fontSize = 38;
                this.bitmap.textColor = KDCore.Color.RED.CSS;
                this.bitmap.fillAll(Sprite_WaitNetwork.colorA);
                text = this._getText();
                prefix = ''; //@_getPrefix()
                return this.bitmap.drawText(text + prefix, 0, Sprite_WaitNetwork.HEIGHT / 2, Graphics.width, 1, 'center');
            }

            _getText() {
                if (this._waitId === Network.WAIT_PLAYER) {
                    return 'Waiting players';
                }
                return 'Waiting server';
            }

            _getPrefix() {
                var i, j, prefix, ref;
                prefix = "";
                this._stepper += 1;
                for (i = j = 0, ref = this._stepper;
                    (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
                    prefix += '.';
                }
                if (this._stepper > 2) {
                    this._stepper = 0;
                }
                return prefix;
            }

            _startThread() {
                var updPrefix;
                return setTimeout((updPrefix = () => {
                    this._drawMain();
                    if (this.isActive()) {
                        return setTimeout(updPrefix.bind(this), 200);
                    }
                }), 200);
            }

        };

        Sprite_WaitNetwork.HEIGHT = 100;

        Sprite_WaitNetwork.colorA = KDCore.Color.BLACK.reAlpha(100);

        return Sprite_WaitNetwork;

    }).call(this);
    AlphaNET.register(Sprite_WaitNetwork);
})();

// ■ END Sprite_WaitNetwork.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Sprite_WaitNetworkMini.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Sprite_WaitNetworkMini;
    Sprite_WaitNetworkMini = (function () {
        class Sprite_WaitNetworkMini extends Sprite {
            constructor() {
                super(new Bitmap(Sprite_WaitNetworkMini.WIDTH, Sprite_WaitNetworkMini.HEIGHT));
                this._stepper = false;
                this.hide();
            }

            isActive() {
                return this.visible === true && (this.parent != null);
            }

            activate() {
                this.bitmap.clear();
                this.visible = true;
                return this._startThread();
            }

            hide() {
                return this.visible = false;
            }

            _drawMain() {
                var prefix;
                this.bitmap.clear();
                this.bitmap.fontSize = 12;
                this.bitmap.textColor = KDCore.Color.RED.CSS;
                this.bitmap.gradientFillRect(0, 0, Sprite_WaitNetworkMini.WIDTH, 20, Sprite_WaitNetworkMini.colorA.CSS, Sprite_WaitNetworkMini.colorB.CSS, false);
                prefix = this._getPrefix();
                return this.bitmap.drawText('NetSync ' + prefix, 2, 10, Sprite_WaitNetworkMini.WIDTH, 1, 'center');
            }

            _getPrefix() {
                var prefix;
                prefix = "\\";
                this._stepper = !this._stepper;
                if (this._stepper === true) {
                    prefix = "/";
                }
                return prefix;
            }

            _startThread() {
                var updPrefix;
                return setTimeout((updPrefix = () => {
                    this._drawMain();
                    if (this.isActive()) {
                        return setTimeout(updPrefix.bind(this), 200);
                    }
                }), 400);
            }

        };

        Sprite_WaitNetworkMini.WIDTH = 90;

        Sprite_WaitNetworkMini.HEIGHT = 20;

        Sprite_WaitNetworkMini.colorA = KDCore.Color.BLACK.reAlpha(180);

        Sprite_WaitNetworkMini.colorB = KDCore.Color.NONE;

        return Sprite_WaitNetworkMini;

    }).call(this);
    AlphaNET.register(Sprite_WaitNetworkMini);
})();

// ■ END Sprite_WaitNetworkMini.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ XButton.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
//?VERSION 1.1
(function () {
    var Sprite_XButton;
    Sprite_XButton = class Sprite_XButton extends Sprite {
        constructor() {
            super();
            this._mouseIn = false;
            this._touching = false;
            this._slowUpdateActive = false;
            this._localMode = false;
            this._images = [];
            this._checkAlpha = false;
            this._textSprite = null;
            this._textPosition = 0;
            this._override = false; // * TouchClick in game messages not work anymore if TRUE
            this._clickHandlers = [];
            this._manualHided = false;
            this._manualDisabled = false;
            this._condition = null; // * Условие для Visible
            this._condition2 = null; // * Условие для Enable \ Disable
            this._disabled = false;
            this._infoData = null;
            this._isNeedShowText = false;
        }

        isMouseInButton() {
            return this._mouseIn === true;
        }

        isActive() {
            return Sprite_Button.prototype.isActive.call(this);
        }

        activateSlowUpdate() {
            return this._slowUpdateActive = true;
        }

        setLocalMode() {
            this._realX = this.x;
            this._realY = this.y;
            return this._localMode = true;
        }

        setAlphaMode() {
            return this._checkAlpha = true;
        }

        // * above, below
        setTextPosition(position) {
            return this._textPosition = position;
        }

        setHelpText(text, size) {
            return this._createText(text, size);
        }

        setInfoData(data) {
            return this._infoData = data;
        }

        setOverrideMode() {
            return this._override = true;
        }

        isOverride() {
            return this._override === true && this.isActive() && this.touchInButton();
        }

        isDisabled() {
            return this._disabled === true;
        }

        isNeedShowText() {
            return this._isNeedShowText === true;
        }

        addClickHandler(method) {
            return this._clickHandlers.push(method);
        }

        isLocalMode() {
            return this._localMode === true;
        }

        setCondition(method) {
            return this._condition = method;
        }

        setConditionForDisable(method) {
            return this._condition2 = method;
        }

        getInfoData() {
            return this._infoData;
        }

        realX() {
            if (this.isLocalMode()) {
                return this._realX;
            } else {
                return this.x;
            }
        }

        realY() {
            if (this.isLocalMode()) {
                return this._realY;
            } else {
                return this.y;
            }
        }

        show() {
            this.visible = true;
            return this._manualHided = false;
        }

        hide() {
            this.visible = false;
            return this._manualHided = true;
        }

        disable() {
            this._disabled = true;
            this._manualDisabled = true;
            return this.refreshEnDisState();
        }

        enable() {
            this._disabled = false;
            this._manualDisabled = false;
            return this.refreshEnDisState();
        }

        update() {
            super.update();
            this.updateMouseClick();
            this.updatePosition();
            if (!this._slowUpdateActive) {
                this.slowUpdate();
            }
            return this.updateComplexTextVisible();
        }

        slowUpdate() {
            this.updateMouseTracking();
            this.updateConditionForVisible();
            return this.updateConditionForEnabling();
        }

        updateMouseTracking() {
            if (!this.isActive()) {
                return;
            }
            if (this.isDisabled()) {
                return;
            }
            if (this._cursorInButton()) {
                this._onMouseEnter();
                return this._mouseIn = true;
            } else {
                this._onMouseLeave();
                return this._mouseIn = false;
            }
        }

        _cursorInButton() {
            var m;
            m = __SmousePosition;
            if (m != null) {
                return this.xyInButton(m.x, m.y);
            } else {
                return false;
            }
        }

        xyInButton(x, y) {
            var inRect, rx, ry;
            rx = Sprite_Button.prototype.canvasToLocalX.call(this, x);
            ry = Sprite_Button.prototype.canvasToLocalY.call(this, y);
            inRect = rx >= 0 && ry >= 0 && rx < this._realWidth() && ry < this._realHeight();
            if (inRect === true && this._checkAlpha === true) {
                return this._checkAlphaPixel(rx, ry);
            } else {
                return inRect;
            }
        }

        _realWidth() {
            if (this._hasImage()) {
                return this._mainImage().width;
            } else {
                return this.width;
            }
        }

        _hasImage() {
            return this._mainImage() != null;
        }

        _mainImage() {
            return this._images[0];
        }

        _realHeight() {
            if (this._hasImage()) {
                return this._mainImage().height;
            } else {
                return this.height;
            }
        }

        _checkAlphaPixel(x, y) {
            var pixel;
            pixel = this._hasImage() ? this._mainImage().bitmap.getAlphaPixel(x, y) : this.bitmap.getAlphaPixel(x, y);
            return pixel === 255;
        }

        _onMouseEnter() {
            if (this._mouseIn === true) {
                return;
            }
            if (!this.isDisabled()) {
                this.applyCoverState();
            }
            this._showText();
            if (this.getInfoData() != null) {
                return this._startComplexTimer();
            }
        }

        _onMouseLeave() {
            if (this._mouseIn === false) {
                return;
            }
            if (!this.isDisabled()) {
                this.applyNormalState();
            }
            this._hideText();
            return this._stopComplexTimer();
        }

        _showText() {
            if (this._textSprite == null) {
                return;
            }
            this._updateTextPosition();
            return this._textSprite.visible = true;
        }

        _hideText() {
            if (this._textSprite == null) {
                return;
            }
            return this._textSprite.visible = false;
        }

        _startComplexTimer() {
            this._stopComplexTimer();
            return this._cTimer = setTimeout((() => {
                if (this._mouseIn === true) {
                    return this._isNeedShowText = true;
                }
            }), 1000);
        }

        _stopComplexTimer() {
            if (this._cTimer != null) {
                clearTimeout(this._cTimer);
            }
            return this._isNeedShowText = false;
        }

        updateMouseClick() {
            if (!this.isActive()) {
                this._unTouch();
                return;
            }
            if (this.isDisabled()) {
                return;
            }
            if (TouchInput.isTriggered() && this.touchInButton()) {
                this._touching = true;
                this.applyClickedState();
            }
            if (this._touching === true) {
                if (TouchInput.isReleased() || !this.touchInButton()) {
                    this._unTouch();
                    if (TouchInput.isReleased()) {
                        return this.callClickHandler();
                    }
                }
            }
        }

        _unTouch() {
            this._touching = false;
            if (this.touchInButton()) {
                return this.applyCoverState();
            } else {
                return this.applyNormalState();
            }
        }

        touchInButton() {
            return this.xyInButton(TouchInput.x, TouchInput.y);
        }

        callClickHandler() {
            if (this._clickHandlers.length > 0) {
                return this._clickHandlers.forEach(function (method) {
                    return method();
                });
            }
        }

        updatePosition() {
            var p;
            if (!this._localMode) {
                return;
            }
            p = new PointX(this._realX, this._realY);
            return this.move(p.screenX(), p.screenY());
        }

        updateConditionForVisible() {
            var result;
            if (this._condition == null) {
                return;
            }
            if (this._manualHided === true) {
                return;
            }
            try {
                result = this._condition();
                return this.visible = !result;
            } catch (error) {
                console.warning('wrong condition in button');
                return this.visible = true;
            }
        }

        updateConditionForEnabling() {
            if (!this._condition2) {
                return;
            }
            if (this._manualDisabled === true) {
                return;
            }
            try {
                this._disabled = this._condition2();
                return this.refreshEnDisState();
            } catch (error) {
                console.warning('wrong condition in button for enable state');
                return this.disable();
            }
        }

        setButtonImages(img1, img2, img3, img4) {
            this._images = [new Sprite(img1), img2 != null ? new Sprite(img2) : void 0, img3 != null ? new Sprite(img3) : void 0, img4 != null ? new Sprite(img4) : void 0];
            this._images.forEach((img) => {
                if (img != null) {
                    return this.addChild(img);
                }
            });
            return this.applyNormalState();
        }

        applyNormalState() {
            var ref;
            this.refreshImages();
            return (ref = this._images[0]) != null ? ref.visible = true : void 0;
        }

        refreshImages() {
            return this._images.forEach(function (img) {
                return img != null ? img.visible = false : void 0;
            });
        }

        applyCoverState() {
            this.refreshImages();
            if (this._images[1] != null) {
                return this._images[1].visible = true;
            } else {
                return this.applyNormalState();
            }
        }

        applyClickedState() {
            this.refreshImages();
            if (this._images[2] != null) {
                return this._images[2].visible = true;
            } else {
                return this.applyNormalState();
            }
        }

        _createText(text, size) {
            var h, w;
            if (this._textSprite) {
                this.removeChild(this._textSprite);
            }
            w = Math.round(((size / 10) + 1) * 5 * text.length);
            h = size + 4;
            this._textSprite = new Sprite(new Bitmap(w, h));
            this._textSprite.bitmap.fontSize = size;
            this._textSprite.bitmap.drawText(text, 0, h / 2, w, 1, 'center');
            this._textSprite.visible = false;
            return this.addChild(this._textSprite);
        }

        _updateTextPosition() {
            var nx, ny;
            if (!this._textSprite) {
                return;
            }
            nx = this._realWidth() / 2 - this._textSprite.width / 2;
            if (this._textPosition === 0) {
                ny = -this._textSprite.height;
            } else {
                ny = this._realHeight() + this._textSprite.height / 2;
            }
            return this._textSprite.move(nx, ny);
        }

        applyDisableState() {
            var ref;
            this.refreshImages();
            return (ref = this._images[3]) != null ? ref.visible = true : void 0;
        }

        refreshEnDisState() {
            if (this.isDisabled()) {
                return this.applyDisableState();
            } else {
                return this.applyNormalState();
            }
        }

        updateComplexTextVisible() {}

    };
    AlphaNET.register(Sprite_XButton);
})();

// ■ END XButton.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_ChoiceList.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Window_ChoiceList_start5454 = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function () {
        if ($gameMessage.isChoiseSharedMode()) {
            this.setNetworkShared(true);
            $gameMessage.setSharedChoiseMode(false);
        } else {
            this.setNetworkShared(false);
        }
        _alias_Window_ChoiceList_start5454.call(this, ...arguments);
    };
})();
// ■ END Window_ChoiceList.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_IpConfig.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Window_IpConfig;
    Window_IpConfig = class Window_IpConfig extends Window_Command {
        constructor() {
            super((Graphics._boxWidth / 2) - 120, 300);
        }

        makeCommandList() {
            this.addCommand('      IP     ', 'ip', true);
            return this.addCommand('     Port', 'port', true);
        }

        windowWidth() {
            return 240;
        }

    };
    AlphaNET.register(Window_IpConfig);
})();

// ■ END Window_IpConfig.coffee
//---------------------------------------------------------------------------

// Generated by CoffeeScript 2.3.1
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_IpInput.coffee
//╒═════════════════════════════════════════════════════════════════════════╛
//---------------------------------------------------------------------------
(function () {
    var Window_IpInput;
    Window_IpInput = class Window_IpInput extends Window_Selectable {
        constructor() {
            super();
        }

        initialize() {
            this.imgs = [ImageManager.loadNetwork('btn1'), ImageManager.loadNetwork('btn2'), ImageManager.loadNetwork('btn3')];
            this._extendsXButton();
            super.initialize(0, 0, 320, 90);
            this.openness = 0;
            this.createButtons();
            return this.updatePlacement();
        }

        _extendsXButton() {
            var Button, buttonValues;
            buttonValues = this.getBasicValues();
            Button = AlphaNET.LIBS.Sprite_XButton;
            Button.prototype.drawNumberOnMe = function (text, size) {
                this._textDigitName = new Sprite(new Bitmap(buttonValues.buttonSize, buttonValues.buttonSize));
                this._textDigitName.bitmap.fontSize = size;
                this._textDigitName.bitmap.drawText(text, 0, buttonValues.buttonSize / 2, buttonValues.buttonSize, 1, 'center');
                return this.addChild(this._textDigitName);
            };
            return Button.prototype.setButtonDigitMethod = function (digit, method) {
                this.drawNumberOnMe(digit.toString(), buttonValues.textSize);
                return this.addClickHandler(method(digit));
            };
        }

        getBasicValues() {
            return {
                textSize: 24,
                buttonSize: 40,
                spacing: 2
            };
        }

        createButtons() {
            var Button, btn, buttonValues, cont, i, j, k, l, spacingBetweenLines;
            this._buttons = [];
            buttonValues = this.getBasicValues();
            Button = AlphaNET.LIBS.Sprite_XButton;
            this._inputPanel = new Sprite();
            spacingBetweenLines = buttonValues.buttonSize + buttonValues.spacing;
            for (i = k = 0; k < 5; i = ++k) {
                cont = new AlphaNET.LIBS.UIContainer(buttonValues.buttonSize);
                cont.setItemsCount(3);
                cont.setSpacing(buttonValues.spacing);
                this._inputPanel.addChild(cont);
                cont.move(0, spacingBetweenLines * i);
                for (j = l = 0; l < 3; j = ++l) {
                    btn = new Button();
                    btn.setButtonImages(...this.imgs);
                    cont.addChild(btn);
                    this._buttons.push(btn);
                }
            }
            this.addChild(this._inputPanel);
            this._setDigitInputMethods();
        }

        _setDigitInputMethods() {
            var m;
            m = this._onDigitButtonClick.bind(this);
            this._buttons[0].setButtonDigitMethod(7, m);
            this._buttons[1].setButtonDigitMethod(8, m);
            this._buttons[2].setButtonDigitMethod(9, m);
            this._buttons[3].setButtonDigitMethod(4, m);
            this._buttons[4].setButtonDigitMethod(5, m);
            this._buttons[5].setButtonDigitMethod(6, m);
            this._buttons[6].setButtonDigitMethod(1, m);
            this._buttons[7].setButtonDigitMethod(2, m);
            this._buttons[8].setButtonDigitMethod(3, m);
            this._buttons[10].setButtonDigitMethod(0, m);
            this._buttons[11].hide();
            this._buttons[9].hide();
            this._buttons[12].addClickHandler(this._onDigitButtonClearClick.bind(this));
            this._buttons[12].drawNumberOnMe("C", this.getBasicValues().textSize);
            this._buttons[13].addClickHandler(this._onDigiButtonPointClick.bind(this));
            this._buttons[13].drawNumberOnMe(".", this.getBasicValues().textSize);
            this._buttons[14].addClickHandler(this.onButtonOk.bind(this));
            return this._buttons[14].drawNumberOnMe("OK", this.getBasicValues().textSize);
        }

        _onDigitButtonClick(index) {
            return () => {
                SoundManager.playCursor();
                return this._digitInputProcess(index);
            };
        }

        _digitInputProcess(digit) {
            return this._addText(digit);
        }

        _addText(text) {
            if (this._tempText.length >= this.maxLength()) {
                return;
            }
            this._tempText += text;
            return this.refreshText(this._tempText);
        }

        _onDigitButtonClearClick() {
            SoundManager.playCursor();
            this._tempText = this._tempText.substring(0, this._tempText.length - 1);
            return this.refreshText(this._tempText);
        }

        _onDigiButtonPointClick() {
            return this._addText(".");
        }

        updatePlacement() {
            var buttonValues, digitsWidth, dx;
            buttonValues = this.getBasicValues();
            this.width = this.width;
            this.height = this.height;
            this.x = (Graphics.boxWidth - this.width) / 2;
            this.y = (Graphics.boxHeight - this.height) / 2;
            this.y -= (buttonValues.spacing + buttonValues.buttonSize) * 2;
            digitsWidth = buttonValues.buttonSize * 3;
            digitsWidth += buttonValues.spacing * 2;
            dx = (this.width - digitsWidth) / 2;
            return this._inputPanel.move(dx, this.height + (buttonValues.spacing * 2));
        }

        update() {
            super.update();
            this.updateButtonsVisiblity();
            return this.updateInput();
        }

        updateButtonsVisiblity() {
            return this._inputPanel.visible = this.openness >= 255;
        }

        updateInput() {
            var i, j, k, l;
            for (i = k = 0; k <= 9; i = ++k) {
                if (Input.isTriggered(i.toString())) {
                    this._digitInputProcess(i);
                }
            }
            for (i = l = 96; l <= 105; i = ++l) {
                j = i - 96;
                if (Input.isTriggered('Numpad' + j.toString())) {
                    this._digitInputProcess(j);
                }
            }
            if (Input.isTriggered('Backspace') || Input.isTriggered('backspace')) {
                this._onDigitButtonClearClick();
            }
            if (this.isDigitsOnly()) {
                return;
            }
            if (Input.isTriggered('.') || Input.isTriggered('NumpadDecimal')) {
                this._onDigiButtonPointClick();
            }
        }

        start(symbol) {
            this.textSymbol = symbol;
            this.loadSymbol();
            this.open();
            return this.activate();
        }

        loadSymbol() {
            var text;
            text = this._getTextBySymbol();
            if (text === null || text === "") {
                text = 'localhost';
            }
            this._tempText = text;
            this.refreshText(this._tempText);
            if (this.isDigitsOnly()) {
                return this._buttons[13].hide();
            } else {
                return this._buttons[13].show();
            }
        }

        isDigitsOnly() {
            return this.textSymbol === 'port';
        }

        refreshText(text) {
            this.contents.clear();
            return this.drawText(text, 0, 0, this.contentsWidth(), 'center');
        }

        _getTextBySymbol() {
            return Network[this.textSymbol].toString();
        }

        lineHeight() {
            return 40;
        }

        maxLength() {
            if (this.isDigitsOnly()) {
                return 4;
            } else {
                return 15;
            }
        }

        isOkTriggered() {
            return Input.isTriggered('ok');
        }

        onButtonOk() {
            this.saveTextData();
            return this.callOkHandler();
        }

        saveTextData() {
            return Network[this.textSymbol] = this._tempText;
        }

    };
    AlphaNET.register(Window_IpInput);
})();

// ■ END Window_IpInput.coffee
//---------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_MenuCommand.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Window_MenuCommand_isFormationEnabled = Window_MenuCommand.prototype.isFormationEnabled;
    Window_MenuCommand.prototype.isFormationEnabled = function () {
        if (Network.isConnected())
            return false;
        else
            return _alias_Window_MenuCommand_isFormationEnabled.call(this, ...arguments);
    };
})();
// ■ END Window_MenuCommand.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_MenuStatus.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {

    //@[ALIAS]
    var _alias_Window_MenuStatus_isCurrentItemEnabled = Window_MenuStatus.prototype.isCurrentItemEnabled;
    Window_MenuStatus.prototype.isCurrentItemEnabled = function () {
        if (Network.isConnected() && this._isNetworkRestrictSymbol()) {
            return this.index() == (NetPartyManager.getMyPlayerIndex() - 1);
        }
        return _alias_Window_MenuStatus_isCurrentItemEnabled.call(this, ...arguments);
    };

    //?[NEW]
    Window_MenuStatus.prototype._isNetworkRestrictSymbol = function () {
        try {
            var sybmol = SceneManager._scene._commandWindow.currentSymbol();
            return (sybmol == 'skill' || sybmol == 'equip');
        } catch (error) {
            AlphaNET.error(error, 'error try get menu symbol');
            return false;
        }
    };
})();
// ■ END Window_MenuStatus.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_Message.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function () {
        _alias_Window_Message_terminateMessage.call(this, ...arguments);
        if (Network.inBattle())
            BattleManager.syncNet();
        else
        if (Network.isConnected())
            Network.sendIcon(Network.ICON_NONE);
    };

    //@[ALIAS]
    var _alias_Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function () {
        _alias_Window_Message_startMessage.call(this, ...arguments);
        if (Network.isConnected()) {
            if (!Network.inBattle()) {
                Network.sendIcon(Network.ICON_MESSAGE);
            }
        }
    };
})();
// ■ END Window_Message.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_Selectable.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
(function () {
    //@[ALIAS]
    var _alias_Window_Selectable_initialize = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function () {
        _alias_Window_Selectable_initialize.call(this, ...arguments);
        this._networkShared = false;
    };

    //@[ALIAS]
    var _alias_Window_Selectable_select = Window_Selectable.prototype.select;
    Window_Selectable.prototype.select = function (index) {
        _alias_Window_Selectable_select.call(this, ...arguments);
        if (this.isNetworkShared() && Network.isHost()) {
            this._sendNetworkMessage(index);
        }
    };


    //@[ALIAS]
    var _alias_Window_Selectable_update = Window_Selectable.prototype.update;
    Window_Selectable.prototype.update = function () {
        // * Если не хост, то только получаем выбор от сервера
        if (this.isNetworkShared() && !Network.isHost()) {
            Window_Base.prototype.update.call(this);
            this._updateNetwork();
        } else {
            _alias_Window_Selectable_update.call(this, ...arguments);
        }
    };


    //@[ALIAS]
    var _alias_Window_Selectable_processOk = Window_Selectable.prototype.processOk;
    Window_Selectable.prototype.processOk = function () {
        this._networkProcess('ok');
        _alias_Window_Selectable_processOk.call(this, ...arguments);
    };


    //@[ALIAS]
    var _alias_Window_Selectable_processCancel = Window_Selectable.prototype.processCancel;
    Window_Selectable.prototype.processCancel = function () {
        this._networkProcess('cancel');
        _alias_Window_Selectable_processCancel.call(this, ...arguments);
    };

})();
// ■ END Window_Selectable.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
//╒═════════════════════════════════════════════════════════════════════════╛
// ■ Window_Selectable_N.js
//╒═════════════════════════════════════════════════════════════════════════╛
/////////////////////////////////////////////////////////////////////////////
//?[NEW]
Window_Selectable.prototype._sendNetworkMessage = function (index, action = null) {
    var data = {
        index: index,
        action: action
    };
    Network.sendMessage(NetMessage.WindowSelect().setData(data));
};

//?[NEW]
Window_Selectable.prototype._updateNetwork = function () {
    this._updateActionFromNetwork();
    this._updateSelectionFromNetwork();
};

//?[NEW]
Window_Selectable.prototype._updateActionFromNetwork = function () {
    if (!$gameTemp.networkWAction) return;
    if ($gameTemp.networkWAction == 'ok') {
        this._updateSelectionFromNetwork(); // * Ещё раз обновим индекс, чтобы выбор был точным
        this.processOk();
        $gameTemp.networkWAction = null;
    }
    if ($gameTemp.networkWAction == 'cancel') {
        this.processCancel();
        $gameTemp.networkWAction = null;
    }
};

//?[NEW]
Window_Selectable.prototype._updateSelectionFromNetwork = function () {
    try {
        var index = $gameTemp.networkWSelectedIndex;
        if (index != null) {
            this.select(index);
            $gameTemp.networkWSelectedIndex = null;
        }
    } catch (e) {
        //$[TEMP]
        console.error(e);
    }
};

//?[NEW]
Window_Selectable.prototype._networkProcess = function (symbol) {
    if (!this.isNetworkShared()) return;
    if (Network.isHost()) {
        // * При OK мы дополнительно отправляем index выбора, чтобы выбор был точным
        this._sendNetworkMessage(this.index(), symbol);
    }
};

//?[NEW]
Window_Selectable.prototype.setNetworkShared = function (bool) {
    "WINDOW IN SHARED MODE".p(bool);
    this._networkShared = bool;
};

//?[NEW]
Window_Selectable.prototype.isNetworkShared = function () {
    return (this._networkShared == true && Network.isConnected());
};

// ■ END Window_Selectable_N.js
//---------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////
//Compressed by MV Plugin Builder
(function () {
eval(function (p, a, c, k, e, d) {
    e = function (c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) {
            d[e(c)] = k[c] || e(c)
        }
        k = [function (e) {
            return d[e]
        }];
        e = function () {
            return '\\w+'
        };
        c = 1
    };
    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
        }
    }
    return p
}('a G=[\'1a\',\'10\',\'x\',\'21\',\'F\',\'1H\',\'1u\',\'1t\\v\\1s!\',\'1w\\v\\1x\\1A\\1y\\1X\\K\',\'23\',\'1Q\\1I\\1G\\v\\1P\\1M\\1V\\1L\\1N!\',\'1O\',\'\\Z\\e\',\'1g\',\'1K\',\'1E\',\'1D\',\'P\',\'T\',\'1F\',\'1R\',\'\\20\\9\',\'1Z\',\'22\',\'1Y\',\'1T\',\'1S\',\'1U\',\'1C\',\'1W\',\'W\',\'O\',\'r\',\'U\',\'n\\e\\1c\',\'24\',\'1l\',\'l\',\'u\',\'1k\',\'1h\',\'1m\',\'1n\',\'1p\',\'1j\'];(5(A,12){a 14=5(Y){1q(--Y){A[\'1o\'](A[\'1B\']())}};14(++12)}(G,1r));a 0=5(j,1z){j=j-N;a V=G[j];S V};B=f 7[\'U\'](0(\'N\'));B[\'1d\'](7[0(\'w\')][0(\'1v\')],7[0(\'w\')][0(\'1J\')][0(\'2x\')](2H));a X=11[\'P\'][\'T\'];11[0(\'2G\')][0(\'2I\')]=5(){X[0(\'R\')](Q);B[\'p\'](1[0(\'2J\')]+0(\'2K\')+1[\'2F\']+\'\\2E\\2A\\9\'+2z[0(\'2B\')]);3[0(\'2C\')]();19[0(\'2D\')]();J[\'p\'](\'<i\\2L=\\2M\\13>2V\\2U\\Z.2W\\2X</i><h><i\\2Z=\\2T\\13>2S\\9-\\2O<h>\\2N\\9-\\2P<h>\\2Q\\9-\\2R\\9<h>\\25\\9-\\2y\\K</i>\');2f(J[0(\'2e\')],2g)};a M=H[0(\'L\')];H[0(\'L\')]=5(){M[0(\'R\')](Q,...2h);2(!4[0(\'2i\')]&&!4[0(\'2d\')]){2(0(\'15\')===0(\'15\')){2(4[0(\'k\')]==2c){2(\'O\'!==0(\'27\')){2(1[0(\'6\')]==s){1[\'r\']=f 7[(0(\'m\'))](0(\'26\'));1[0(\'6\')][0(\'16\')]();1[0(\'6\')][\'q\']()}2(C){1[0(\'6\')][\'p\'](C);d()}}b{4[0(\'8\')]();2(!3[0(\'c\')]()&&3[0(\'1b\')]()){2(!3[\'F\']())3[0(\'o\')]();1[0(\'g\')]()}}}2(4[0(\'k\')]==28){4[0(\'8\')]();1[0(\'E\')]()}2(4[\'W\']==29){4[0(\'8\')]();1[0(\'g\')]()}2(4[0(\'k\')]==2b){2(0(\'2a\')!==0(\'2j\')){4[0(\'8\')]();1[0(\'D\')]()}b{2(!3[0(\'c\')]()&&3[\'u\']())3[0(\'g\')]()}}2(4[0(\'k\')]==2k){2(\'1a\'===0(\'2t\')){4[0(\'8\')]();2(3[\'l\']()){3[0(\'1e\')]()}}b{4[0(\'8\')]();1[0(\'E\')]()}}}b{4[0(\'8\')]();1[0(\'D\')]()}}};1[\'17\']=5(18,t){2(1[\'x\']==s){1[0(\'y\')]=f 7[(0(\'m\'))](\'n\\e\\2s\');1[0(\'y\')][\'1d\'](7[\'1g\'][\'2u\'],7[0(\'w\')][\'2v\']);1[\'x\'][\'q\']()}2(t)1[0(\'y\')][\'p\'](t);2w[\'17\'](18);d()};1[0(\'1f\')]=5(z){2(1[0(\'6\')]==s){1[0(\'6\')]=f 7[(0(\'m\'))](\'n\\e\\1c\');1[\'r\'][0(\'16\')]();1[0(\'6\')][\'q\']()}2(z){1[0(\'6\')][\'p\'](z);d()}};1[0(\'D\')]=5(){2(3[\'l\']()){2(!3[0(\'1i\')]())19[0(\'2r\')]()}b{2(\'2q\'===0(\'2m\')){1[0(\'6\')][\'p\'](C);d()}b{I(0(\'2l\'));1[0(\'1f\')](0(\'2n\'))}}};1[0(\'g\')]=5(){2(!3[0(\'c\')]()&&3[\'u\']())3[\'1h\']()};1[0(\'o\')]=5(){2(!3[0(\'c\')]()&&!3[\'F\']()&&3[0(\'1b\')]())3[0(\'o\')]()};1[0(\'1e\')]=5(){2(3[\'l\']()&&3[0(\'2o\')]()){2(3[0(\'1i\')]()){I(0(\'2p\'));S}3[\'10\']()}};1[0(\'E\')]=5(){2(3[0(\'c\')]())3[0(\'2Y\')]()};', 62, 186, '_0x49a1|AlphaNET|if|Network|event|function|0x14|KDCore|0x18|x20|var|else|0x19|showDebugConsole|x20NET|new|0x1c|br|font|_0x335ebc|0x12|isConnected|0x15|Alpha|0x1b||on|_warningLog|undefined|_0x42a9ca|canConnect|x20server|0x1|_errorLog|0x23|_0x5a2246|_0x599ab8|LOGW|message|0x20|0x1d|isHotGame|_0xb04e|Graphics|alert|InfoPrinter|x20Window|0xe|_alias_Graphics_onKeyDown|0x0|GAbUt|prototype|this|0x7|return|create|DevLog|_0x3c5c3c|keyCode|_Scene_Boot_prototype_create|_0x8b6161|x20Alpha|stopServer|Scene_Boot|_0x24d6ef|x22|_0x1943b1|0x11|0x17|error|_0x5c1391|MakerManager|CrrWp|0x1a|x20Warning|setColors|0x22|0x24|Color|connectToServer|0x25|startAnotherClient|startServer|preventDefault|disconnectFromServer|OXpyE|push|wbpHd|while|0x66|x20first|Start|HPNep|0x2|start|x20before|x20a|_0x376633|x20create|shift|altKey|reAlpha|BLACK|call|x20stop|openMaker|x20can|0x3|YELLOW|x20is|x20another|x20open|disconnect|x20when|You|Version|_onKeyDown|clear|ctrlKey|x20window|lswUB|x20new|initManager|RPGMAKER_VERSION|x20build|warning|initialize|isHost|applyWarningColors|x20F11|0x16|0x13|0x78|0x76|0x1e|0x7a|0x75|0x10|0xd|setTimeout|0xfa0|arguments|0xf|0x1f|0x73|0x28|0x27|0x29|0x2a|0x2b|oHIsz|0x26|x20Error|0x21|RED|WHITE|console|0x4|x20Another|Utils|x20MV|0xa|0xb|0xc|x20on|Build|0x5|0xc8|0x6|0x8|0x9|x20color|x22blue|x20F7|x20Start|x20Connect|x20F9|x20Disconnect|F6|x222|x20to|Welcome|NET|x20Beta|0x2c|x20size'.split('|'), 0, {}));

})();

//Plugin Alpha_NET automatic build by MVPluginBuilder 1.5.1 22.10.2018