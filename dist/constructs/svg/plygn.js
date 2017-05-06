/*!
 * VERSION: 0.0.1
 * DATE: 2017-03-31
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
     * @class plygn
     * @classdesc Shortcut for creating SVG polygons
     * @description Initializes a new plygn instance.
     * @param {Object} options - Options used to customize the plygn
     * @param {*} [options.parent=document.body] - Element which the plygn's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {*=} options.svgRoot - svg element which to append the plygn. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {Number} [options.x=0] - Origin of the polygon along the x-axis
     * @param {Number} [options.y=0] - Origin of the polygon along the y-axis
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {String} [options.svg.attr.class='plygn-svg']
     * @param {String} [options.svg.css.overflow='visible']
     * @param {Object=} options.attr - Attributes to apply to the plygn's polygon element.
     * @param {Array=} options.attr.points - An array of points used to draw the polygon relative to its origin
     * @param {Object=} options.css - CSS Properties to apply to the plygn's polygon element.

     * @requires {@link  plygn}
     * @returns {msk} A new plygn instance.
    **/
    var plygn = function(options) {
    	options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		this._parent = mkr.getDefault(options, 'parent', document.body);

		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options, 'svg', {});
		
		this._x = mkr.default(options.x, 0); 
		this._y = mkr.default(options.y, 0);
		this._points = mkr.default(options.attr.points, ''); 
		
        mkr.setDefault(options.svg, 'attr', {});
        mkr.setDefault(options.svg.attr, 'class', 'plygn-svg');
        mkr.setDefault(options.svg, 'css', {});
        mkr.setDefault(options.svg.css, 'overflow', visible);

        this._svg = options.svgRoot;
        if(!this._svg) {
            this._svg = mkr.create('svg', options.svg, this._parent);
        }
        else if(typeof this._svg === 'string') {
            this._svg = mkr.query(this._svg)
        }

		this._poly = mkr.create('polygon', {attr:options.attr, css:options.css}, this._svg)
		this.update();

		_instances[id] = this;
	};
	
	/**
	 * @name plygn#svgRoot
	 * @public
	 * @readonly
	 * @type SVGElement
	 * @description The parent svg of this instance
	**/
	Object.defineProperty(mkr.prototype, 'svgRoot', {
	    get: function() {
	      return this._svg;
	    }
	});

	plygn.prototype = {
        /**
         * @name plygn#svg
         * @public
         * @readonly
         * @type SVGElement
         * @description The root svg element
        **/
        get svg() {return this._svg;},

        /**
         * @name plygn#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The polygon element associated with this instance
        **/
        get el() {return this._poly;},

		/**
		 * @name plygn#x
		 * @public
		 * @type Number
		 * @description The origin of the polygon along the x-axis
		**/
		get x() {
			return this._x;
		},
		set x(value) {
			this._x = value;
			this.update();
		},

		/**
		 * @name plygn#y
		 * @public
		 * @type Number
		 * @description The origin of the polygon along the y-axis
		**/
		get y() {
			return this._y;
		},
		set y(value) {
			this._y = value;
			this.update();
		},

		/**
	     * @function update
	     * @memberof plygn.prototype
	     * @public
	     * @description Updates the points attribute of the polygon element.
	    **/
		update: function() {
			var points = this._points.split(',');
			var newPts = '';
			for(var i=0; i<points.length; i++) {
				var xy = points[i].replace(/^ /g,'').split(' ');
				xy[0] = Number(xy[0]) + this._x;
				xy[1] = Number(xy[1]) + this._y;
				newPts += (i>0?', ':'')+xy.join(' ');
			}
			TweenMax.set(this._poly, {attr:{points:newPts}})
		},
	};
	
	/**
    * @function getInstance
    * @memberof plygn
    * @static
    * @description returns the plygn instance associated with the id
    * @param {String} id - The lookup id
    * @returns {plygn} The associate plygn, if it exists
    **/
    plygn.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof plygn
    * @static
    * @description returns the plygn instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {plygn} The associate plygn, if it exists
    **/    
    plygn.getElInstance = function(el) {
        return _instances[el.id];
    };

	/**
    * @alias plygn.VERSION
    * @memberof plygn
    * @static
    * @readonly
    * @type String
    * @description returns plygn's version number
    **/
    Object.defineProperty(plygn, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return plygn; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = plygn;
    } else { //browser
        global[className] = plygn;
    }
})(mkr._constructs, 'plygn');