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
     * @class plygn
     * @classdesc Shortcut for creating SVG polygons
     * @description Initializes a new plygn instance.
     * @param {Object} options - Options used to customize the plygn
     * @param {*=} options.parent - SVGElement which to append the plygn's polygon element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.x=0] - Origin of the polygon along the x-axis
     * @param {Number} [options.y=0] - Origin of the polygon along the y-axis
     * @param {Array=} options.points - A 2d array of points used to draw the polygon relative to its origin. Each index in the parent array should contian an arry with two numbers for x and y.
     * @param {String} [options.fill='transparent'] - The default fill color
     * @param {String} [options.stroke='#000000'] - The default stroke color
     * @param {Number} [options.strokeWidth=1] - The default stroke width
     * @param {Object=} options.attr - Attributes to apply to the plygn's polygon element.
     * @param {Object=} options.css - CSS Properties to apply to the plygn's polygon element.

     * @requires {@link  mkr}
     * @returns {plygn} A new plygn instance.
    **/
    var plygn = function(options) {
    	options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', mkr.default(mkr.query('svg'), mkr.create('svg', {css:{overflow:'visible'}})));
        var p = typeof this._parent == 'string' ? mkr.query(this._parent) : this._parent;
        if(!(p instanceof SVGElement)) {
            this._parent = mkr.query('svg', p) || mkr.create('svg', {css:{overflow:'visible'}}, this._parent);
        }

		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});

        mkr.setDefault(options, 'fill', 'transparent');
        mkr.setDefault(options, 'stroke', '#000000');
        mkr.setDefault(options, 'strokeWidth', 1);

        mkr.setDefault(options.attr, 'fill', options.fill);
        mkr.setDefault(options.attr, 'stroke', options.stroke);
        mkr.setDefault(options.attr, 'stroke-width', options.strokeWidth);
		
		this._x = mkr.default(options.x, 0); 
		this._y = mkr.default(options.y, 0);
		this._points = mkr.default(options.points, []); 

		this._poly = mkr.create('polygon', {attr:options.attr, css:options.css}, this._parent)
		this.update();

		_instances[id] = this;
	};

	plygn.prototype = {
        /**
         * @name plygn#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The polygon element associated with this instance
        **/
        get el() {return this._poly;},

        /**
         * @name plygn#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's polygon element
        **/
        get id() {return this.el.id;},

        /**
         * @name plygn#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the polygon element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name plygn#fill
         * @public
         * @type String
         * @description The plygn's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name plygn#stroke
         * @public
         * @type String
         * @description The plygn's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name plygn#strokeWidth
         * @public
         * @type Number
         * @description The plygn's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name plygn#dasharray
         * @public
         * @type *
         * @description The stroke-dasharray of the polygon
        **/
        get dasharray() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dasharray');
        },
        set dasharray(value) {
            TweenMax.set(this.el, {css:{strokeDasharray:value}});
        },

        /**
         * @name plygn#dashoffset
         * @public
         * @type *
         * @description The stroke-dashoffset of the polygon
        **/
        get dashoffset() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dashoffset');
        },
        set dashoffset(value) {
            TweenMax.set(this.el, {css:{strokeDashoffset:value}});
        },

        /**
         * @name plygn#slice
         * @public
         * @type String
         * @description Control how much of the polygon's stroke is drawn. Space-delimited values define a slice, ie '10 30'. A single value asserts 0 as the starting value. Accepts percentages for relative values
        **/
        get slice() {
            var offset, da, da0, da1, p0, p1;
            offset = mkr.unitless(String(this.dashoffset).trim());
            da = this.dasharray.split(',');
            da0 = mkr.unitless(String(da[0]).trim());
            
            if(offset === 0 && isNaN(da0)) return '0 100%';

            da1 = mkr.unitless(String(da[1]).trim());
            var start, end, len = this.el.getTotalLength();

            //math is SLIGHTLY off here...
            if(offset < 0) {
                start = -offset;
                end = da0 + start;
            }
            else {
                start = 0;
                end = Math.abs(da0 - offset);
            }

            if(this._startUnit) start = mkr.fix(start/len)*100+'%'
            if(this._endUnit) end = mkr.fix(end/len)*100+'%'

            return start+' '+end;
        },
        set slice(value) {
            var args = value.split(' ');
            if(args.length == 0) return;
            var start, end;
            if(args.length == 1) {
                start = 0;
                end = args[0];
            }
            else {
                start = args[0];
                end = args[1]; 
            }
            
            var len = this.el.getTotalLength();
            //convert percentages
            if(typeof start === 'string') {
                var n = start.indexOf('%');
                if(n >= 0) {
                    start = mkr.fix(len*(mkr.unitless(start)/100));
                    this._startUnit = true;
                } else this._startUnit = false;
            }
            if(typeof end === 'string') {
                n = end.indexOf('%');
                if(n >= 0) {
                    end = mkr.fix(len*(mkr.unitless(end)/100));
                    this._endUnit = true;
                } else this._endUnit = false;
            }
            var offset, da0, da1, p0, p1;
            p0 = Math.min(start, end); //smaller
            p1 = Math.max(start, end); //larger
            if(p0 == 0) {
                da0 = len+1 //da0 === len+1 when start is 0
                offset = p1 >= len ? 0 : da0 - p1; //offset zero when full
            }
            else {
                da0 = Math.abs(p1 - p0); //dasharry 0 is the length of the segment
                offset = -p0; //offset is -p1 since 
            }
            da1 = len+11;

            TweenMax.set(this, {dashoffset:offset, dasharray:da0+'px,'+da1+'px'});
        },

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
         * @name plygn#points
         * @public
         * @type Array
         * @description An 2d array of points used to draw the polygon relative to its origin
        **/
        get points() {
            return this._points;
        },
        set points(value) {
            this._points = value;
            this.update();
        },

        /**
         * @function addPoint
         * @memberof plygn.prototype
         * @public
         * @description Add a new point to the plygn.
         * @param {Array} coords - The new point coordinates
         * @param {int=} index - The insertion index, defaults to the number of points. When negative, becomes the sum of itself and the number points
         * @returns {plygn} The plygn instance
        **/
        addPoint: function(coords, index) {
            index = mkr.default(index, this._points.length);
            this._points.splice(index, 0, coords);
            this.update();
            return this;
        },

        /**
         * @function removePoint
         * @memberof plygn.prototype
         * @public
         * @description Remove the point at the specified index
         * @param {int} [index=-1] - The index target point. When negative, becomes the sum of itself and the number points
         * @returns {Array} The removed point coordinates
        **/
        removePoint: function(index) {
            index = mkr.default(index, -1);
            var removed = this._points.splice(index, 1);
            this.update();
            return removed[0];
        },

        /**
         * @function getPoint
         * @memberof plygn.prototype
         * @public
         * @description Returns the point at the specified index
         * @param {int} [index=-1] - The index of the target point. When negative, becomes the sum of itself and the number points
         * @returns {Array} The point at the specified index
        **/
        getPoint: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this._points.length + index;
            return this._points[index];
        },

        /**
         * @function setPoint
         * @memberof plygn.prototype
         * @public
         * @description Updates the point at the specified index
         * @param {Array} coords - The new point coordinates
         * @param {int} [index=-1] - The index of the target point. When negative, becomes the sum of itself and the number points
         * @returns {Array} The updated point
        **/
        setPoint: function(coords, index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this._points.length + index;
            this._points[index] = coords;
            this.update();
            return this._points[index];
        },

		/**
	     * @function update
	     * @memberof plygn.prototype
	     * @public
	     * @description Updates the points attribute of the polygon element.
	    **/
		update: function() {
			var points = this._points;
            var len = points.length;
			var newPts = ''; //helper string to build new points attr based on origin
			for(var i=0; i<len; i++) {
				var xy = points[i];//.replace(/^ /g,'').split(' ');
				var x = Number(xy[0]) + this._x;
				var y = Number(xy[1]) + this._y;
				newPts += (i>0?', ':'')+x+' '+y;
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
          return '1.0.2';
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