/*!
 * VERSION: 0.0.1
 * DATE: 2017-05-16
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
     * @class estar
     * @classdesc Shortcut for creating SVG-based elliptical stars
     * @description Initializes a new estar instance.
     * @param {Object} options - Options used to customize the estar
     * @param {*=} options.parent - SVGElement which to append the estar's polygon element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.x=0] - Origin of the estar along the x-axis
     * @param {Number} [options.y=0] - Origin of the estar along the y-axis
     * @param {Number} [options.r1x=15] - First radius of the estar along the x-axis
     * @param {Number} [options.r1y=25] - First radius of the estar along the y-axis
     * @param {Number} [options.r2x=50] - Second radius of the estar along the x-axis
     * @param {Number} [options.r2y=75] - Second radius of the estar along the y-axis
     * @param {int} [options.points=5] - The number of points on the estar
     * @param {String} [options.fill='transparent'] - The default fill color
     * @param {String} [options.stroke='#000000'] - The default stroke color
     * @param {Number} [options.strokeWidth=1] - The default stroke width
     * @param {Object=} options.attr - Attributes to apply to the estar's polygon element.
     * @param {Object=} options.css - CSS Properties to apply to the estar's polygon element.

     * @requires {@link  mkr}
     * @returns {estar} A new estar instance.
    **/
    var estar = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', mkr.default(mkr.query('svg'), mkr.create('svg', {css:{overflow:'visible'}})));
        var p = typeof this._parent == 'string' ? mkr.query(this._parent) : this._parent;
        if(!(p instanceof SVGElement)) {
            this._parent = mkr.create('svg', {css:{overflow:'visible'}}, this._parent);
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
        this._points = mkr.default(options._points, 5); 
        this._r1x = mkr.default(options.r1x, 15);
        this._r1y = mkr.default(options.r1y, 25);
        this._r2x = mkr.default(options.r2x, 50);
        this._r2y = mkr.default(options.r2y, 75);

        this._poly = mkr.create('polygon', {attr:options.attr, css:options.css}, this._parent);
        this.update();

        _instances[id] = this;
    };

    estar.prototype = {
        /**
         * @name estar#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The polygon element associated with this instance
        **/
        get el() {return this._poly;},

        /**
         * @name estar#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's polygon element
        **/
        get id() {return this.el.id;},

        /**
         * @name estar#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the polygon element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name estar#fill
         * @public
         * @type String
         * @description The estar's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name estar#stroke
         * @public
         * @type String
         * @description The estar's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name estar#strokeWidth
         * @public
         * @type Number
         * @description The estar's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name estar#dasharray
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
         * @name estar#dashoffset
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
         * @name estar#slice
         * @public
         * @type String
         * @description Control how much of the polygon's stroke is drawn. Space-delimited values define a slice, ie '10 30'. A single value asserts 0 as the estarting value. Accepts percentages for relative values
        **/
        get slice() {
            var offset, da, da0, da1, p0, p1;
            offset = mkr.unitless(String(this.dashoffset).trim());
            da = this.dasharray.split(',');
            da0 = mkr.unitless(String(da[0]).trim());
            
            if(offset === 0 && da0 === 'none') return '0 100%';

            da1 = mkr.unitless(String(da[1]).trim());
            var estart, end, len = this.el.getTotalLength();

            //math is SLIGHTLY off here...
            if(offset < 0) {
                estart = -offset;
                end = da0 + estart;
            }
            else {
                estart = 0;
                end = Math.abs(da0 - offset);
            }

            if(this._estartUnit) estart = mkr.fix(estart/len)*100+'%'
            if(this._endUnit) end = mkr.fix(end/len)*100+'%'

            return estart+' '+end;
        },
        set slice(value) {
            var args = value.split(' ');
            if(args.length == 0) return;
            var estart, end;
            if(args.length == 1) {
                estart = 0;
                end = args[0];
            }
            else {
                estart = args[0];
                end = args[1]; 
            }
            
            var len = this.el.getTotalLength();
            //convert percentages
            if(typeof estart === 'string') {
                var n = estart.indexOf('%');
                if(n >= 0) {
                    estart = mkr.fix(len*(mkr.unitless(estart)/100));
                    this._estartUnit = true;
                } else this._estartUnit = false;
            }
            if(typeof end === 'string') {
                n = end.indexOf('%');
                if(n >= 0) {
                    end = mkr.fix(len*(mkr.unitless(end)/100));
                    this._endUnit = true;
                } else this._endUnit = false;
            }
            var offset, da0, da1, p0, p1;
            p0 = Math.min(estart, end); //smaller
            p1 = Math.max(estart, end); //larger
            if(p0 == 0) {
                da0 = len+1 //da0 === len+1 when estart is 0
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
         * @name estar#x
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
         * @name estar#y
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
         * @readonly
         * @type Array
         * @description An 2d array of coordinares used to draw the estar relative to its origin
        **/
        get coords() {
            return this._coords;
        },

        /**
         * @name estar#r1x
         * @public
         * @type Number
         * @description First radius of the estar along the x-axis
        **/
        get r1x() {
            return this._r1x;
        },
        set r1x(value) {
            this._r1x = value;
            this.update();
        },

        /**
         * @name estar#r1y
         * @public
         * @type Number
         * @description First radius of the estar along the x-axis
        **/
        get r1y() {
            return this._r1y;
        },
        set r1y(value) {
            this._r1y = value;
            this.update();
        },

        /**
         * @name estar#r2x
         * @public
         * @type Number
         * @description Second radius of the estar along the x-axis
        **/
        get r2x() {
            return this._r2x;
        },
        set r2x(value) {
            this._r2x = value;
            this.update();
        },

        /**
         * @name estar#r2y
         * @public
         * @type Number
         * @description Second radius of the estar along the y-axis
        **/
        get r2y() {
            return this._r2y;
        },
        set r2y(value) {
            this._r2y = value;
            this.update();
        },

        /**
         * @name estar#points
         * @public
         * @type int
         * @description The number of points on the polygon
        **/
        get points() {
            return this._points;
        },
        set points(value) {
            this._points = value;
            this.update();
        },

        /**
         * @function getPoint
         * @memberof estar.prototype
         * @public
         * @description Returns the coordinates at the specified index
         * @param {int} [index=-1] - The index of the desired point. When negative, becomes the sum of itself and the length of the points array
         * @returns {Array} The coordinates at the specified index
        **/
        getPoint: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this._coords.length + index;
            return this._coords[index];
        },

        /**
         * @function update
         * @memberof estar.prototype
         * @public
         * @description Updates the points attribute of the polygon element.
        **/
        update: function() { 
            this._coords = [];
            var newPts = ''; //helper string to build new points attr based on origin
            var rx, ry, len = this._points*2;
            var dR = mkr.RAD*(360/len);
            for(var i=0; i<len; i++) {
                rx = i%2 == 0 ? this.r1x : this.r2y;
                ry = i%2 == 0 ? this.r1x : this.r2y;
                var x = this._x + rx*Math.cos(dR*i);
                var y = this._y + ry*Math.sin(dR*i);
                this._coords[i] = [x, y];
                newPts += (i>0?', ':'')+x+' '+y;
            }
            TweenMax.set(this._poly, {attr:{points:newPts}})
        },
    };
    
    /**
    * @function getInstance
    * @memberof estar
    * @static
    * @description returns the estar instance associated with the id
    * @param {String} id - The lookup id
    * @returns {estar} The associate estar, if it exists
    **/
    estar.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof estar
    * @static
    * @description returns the estar instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {estar} The associate estar, if it exists
    **/    
    estar.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias estar.VERSION
    * @memberof estar
    * @static
    * @readonly
    * @type String
    * @description returns estar's version number
    **/
    Object.defineProperty(estar, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return estar; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = estar;
    } else { //browser
        global[className] = estar;
    }
})(mkr._constructs, 'estar');