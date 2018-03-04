/*!
 * VERSION: 1.0.2
 * DATE: 2018-03-03
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2017-2018 Christopher C. Moody
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of
 *  this software and associated documentation files (the "Software"), to deal in the
 *  Software without restriction, including without limitation the rights to use, copy,
 *  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 *  and to permit persons to whom the Software is furnished to do so, subject to the
 *  following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 *  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @author: Christopher C. Moody, chris@moodydigital.com
 */
 
(function(global, className) {
    var _instances = {}, _count=-1;

    /**
     * @class grdnt
     * @classdesc Shortcut for creating SVG gradients
     * @description Initializes a new grdnt instance.
     * @param {Object} options - Options used to customize the grdnt
     * @param {*=} options.parent - Preferably an SVGElement. When an HTMLElement is provided, a new SVGElement is appended to it, which becomes the parent for the grdnt.
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {String} [options.type=grdnt.LINEAR] - The type of gradient to create. Can be grdnt.LINEAR or grdnt.RADIAL.
     * @param {Array} [options.stops=[]] - An array of objects containing stop element attributes. Used to initialize the stops for the gradient
     * @param {Object=} options.attr - Attributes to apply to the grdnt's gradient element.
     * @param {Object=} options.css - CSS Properties to apply to the grdnt's gradient element.

     * @requires {@link  mkr}
     * @returns {grdnt} A new grdnt instance.
    **/
    var grdnt = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', mkr.default(mkr.query('svg'), mkr.create('svg', {css:{overflow:'visible'}})));
        var p = typeof this._parent == 'string' ? mkr.query(this._parent) : this._parent;
        if(!(p instanceof SVGElement)) {
            this._parent = mkr.query('svg', p) || mkr.create('svg', {css:{overflow:'visible'}}, this._parent);
        }
        /*if(this._parent instanceof SVGElement) {
            s = this._svg = this._parent;
        }*/
        
        mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});

        var type = mkr.default(options.type, grdnt.LINEAR);
        var stops = mkr.default(options.stops, []);
        
        var d = this._defs = mkr.query('defs', this._parent) || mkr.create('defs', {}, this._parent)
            var grad = this._grad = mkr.create(type+'Gradient', {attr:options.attr, css:options.css}, d)
                for(var i=0; i<stops.length; i++) {
                    this.addStop(stops[i]);
                }
        
        _instances[id] = this;
    };
    
    grdnt.prototype = {
        /**
         * @name grdnt#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The gradient element associated with this instance
        **/
        get el() {return this._grad;},

        /**
         * @name grdnt#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's gradient element
        **/
        get id() {return this.el.id;},

        /**
         * @name grdnt#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the defs element
        **/
        get parent() {return this.defs.parentNode;},

        /**
         * @name grdnt#defs
         * @public
         * @readonly
         * @type SVGElement
         * @description The SVGDefsElement where the gradient is stored
        **/
        get defs() {return this._defs;},

        /**
         * @name grdnt#url
         * @public
         * @readonly
         * @type String
         * @description The url function string used to assign the gradient as a fill, stroke, etc
        **/
        get url() {return 'url(#'+this.id+')';},

        /**
         * @name grdnt#svg
         * @public
         * @readonly
         * @type NodeList
         * @description A nodelist of the grdnt's stop elements
        **/
        get stops() {return mkr.queryAll('#'+this.id+' stop')},

        /**
         * @function addStop
         * @memberof grdnt.prototype
         * @public
         * @description Updates the points attribute of the polygon element.
         * @param {Object} attr - Attributes to set on the stop element
         * @param {Object} attr.color - Shortcut for 'stop-color'
         * @param {Object} attr.alpha - Shortcut for 'stop-opacity'
         * @param {int=} index - The insertion index, defaults to the number of stops. When negative, becomes the sum of itself and the number of stops
         * @returns {SVGElement} The new stop element
        **/
        addStop: function(attr, index) {
            index = mkr.default(index, this.stops.length);
            if(index < 0) index = this.stops.length + index;
            mkr.setDefault(attr, 'stop-color', attr.color);
            mkr.setDefault(attr, 'stop-opacity', attr.alpha);
            return mkr.create('stop', {attr:attr}, this._grad, index);
        },

        /**
         * @function removeStop
         * @memberof grdnt.prototype
         * @public
         * @description Removes the stop element at the specified index
         * @param {int} [index=-1] - The index of the target stop. When negative, becomes the sum of itself and the number of stops
         * @returns {SVGElement} The stop element that was removed
        **/
        removeStop: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.stops.length + index;
            return mkr.remove(this.stops[index]);
        },

        /**
         * @function getStop
         * @memberof grdnt.prototype
         * @public
         * @description Returns the stop element at the specified index
         * @param {int} [index=-1] - The index of the target stop. When negative, becomes the sum of itself and the number of stops
         * @returns {SVGElement} The stop element at the specified index
        **/
        getStop: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.stops.length + index;
            return this.stops[index];
        },

        /**
         * @function setStop
         * @memberof grdnt.prototype
         * @public
         * @description Updates the stop element at the specified index
         * @param {Object} attr - Attributes to set on the stop element
         * @param {Object} attr.color - Shortcut for 'stop-color'
         * @param {Object} attr.alpha - Shortcut for 'stop-opacity'
         * @param {int} [index=-1] - The index of the target stop. When negative, becomes the sum of itself and the number of stops
         * @returns {SVGElement} The updated stop element
        **/
        setStop: function(attr, index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.stops.length + index;
            mkr.setDefault(attr, 'stop-color', attr.color);
            mkr.setDefault(attr, 'stop-opacity', attr.alpha);
            var stop = this.getStop(index);
            TweenMax.set(stop, {attr:attr});
            return stop;
        }
    };
    
    /**
    * @alias grdnt.LINEAR
    * @memberof grdnt
    * @static
    * @readonly
    * @type String
    * @description returns 'linear'
    **/
    Object.defineProperty(grdnt, 'LINEAR', {
        get: function() {
          return 'linear';
        }
    });

    /**
    * @alias grdnt.RADIAL
    * @memberof grdnt
    * @static
    * @readonly
    * @type String
    * @description returns 'radial'
    **/
    Object.defineProperty(grdnt, 'RADIAL', {
        get: function() {
          return 'radial';
        }
    });

    /**
    * @function getInstance
    * @memberof grdnt
    * @static
    * @description returns the grdnt instance associated with the id
    * @param {String} id - The lookup id
    * @returns {grdnt} The associate grdnt, if it exists
    **/
    grdnt.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof grdnt
    * @static
    * @description returns the grdnt instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {grdnt} The associate grdnt, if it exists
    **/    
    grdnt.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias grdnt.VERSION
    * @memberof grdnt
    * @static
    * @readonly
    * @type String
    * @description returns grdnt's version number
    **/
    Object.defineProperty(grdnt, 'VERSION', {
        get: function() {
          return '1.0.2';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return grdnt; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = grdnt;
    } else { //browser
        global[className] = grdnt;
    }
})(mkr._constructs, 'grdnt');