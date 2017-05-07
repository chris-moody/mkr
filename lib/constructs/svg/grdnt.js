/*!
 * VERSION: 0.0.2
 * DATE: 2017-05-06
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2017 Christopher C. Moody
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
     * @param {*} [options.parent=document.body] - Element which the grdnt's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {*=} options.svgRoot - svg element which to append the grdnt. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {String} [options.type=grdnt.LINEAR] - The type of gradient to create. Can be grdnt.LINEAR or grdnt.RADIAL.
     * @param {Array} [options.stops=[]] - An array of objects containing stop element attributes. Used to initialize the stops for the gradient
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {String} [options.svg.attr.class='grdnt-svg']
     * @param {String} [options.svg.css.overflow='visible']
     * @param {Object=} options.attr - Attributes to apply to the grdnt's gradient element.
     * @param {Object=} options.css - CSS Properties to apply to the grdnt's gradient element.

     * @requires {@link  grdnt}
     * @returns {msk} A new grdnt instance.
    **/
    var grdnt = function(options) {
		options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		this._parent = mkr.getDefault(options, 'parent', document.body);
		
		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options, 'svg', {});

        mkr.setDefault(options.svg, 'attr', {});
        mkr.setDefault(options.svg.attr, 'class', 'grdnt-svg');
        mkr.setDefault(options.svg, 'css', {});
        mkr.setDefault(options.svg.css, 'overflow', 'visible');

		var type = mkr.default(options.type, grdnt.LINEAR);
		var stops = mkr.default(options.stops, []);
		
		var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, this._parent)
			var d = mkr.query('defs', s) || mkr.create('defs', {}, s)
				var grad = this._grad = mkr.create(type+'Gradient', {attr:options.attr, css:options.css}, d)
					for(var i=0; i<stops.length; i++) {
						this.addStop(stops[i]);
					}
		
		_instances[id] = this;
	};
	
	grdnt.prototype = {
        /**
         * @name grdnt#svg
         * @public
         * @readonly
         * @type SVGElement
         * @description The root svg element
        **/
        get svg() {return this._svg;},

        /**
         * @name grdnt#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The gradient element associated with this instance
        **/
        get el() {return this._grad;},

        /**
	     * @function addStop
	     * @memberof grdnt.prototype
	     * @public
	     * @description Updates the points attribute of the polygon element.
	     * @param {Object} attr - Attributes to set on the stop element
	     * @param {Object} attr.color - Shortcut for 'stop-color'
	    **/
		addStop: function(attr) {
			mkr.setDefault(attr, 'stop-color', attr.color)
			return mkr.create('stop', {attr:attr}, this._grad);
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
          return '0.0.2';
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