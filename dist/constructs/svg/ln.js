/*!
 * VERSION: 0.0.1
 * DATE: 2017-05-23
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
     * @class ln
     * @classdesc Shortcut for creating SVG lines.
     * @description Initializes a new ln instance.
     * @param {Object} options - Options used to customize the ln
     * @param {*=} options.parent - SVGElement which to append the primary element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.x1=0] - Start of the line along the x-axis
     * @param {Number} [options.y1=0] - Start of the line along the y-axis
     * @param {Number} [options.x2=50] - End of the line along the x-axis
     * @param {Number} [options.y2=50] - End of the line along the y-axis
     * @param {String} [options.fill='transparent'] - The default fill color
     * @param {String} [options.stroke='#000000'] - The default stroke color
     * @param {Number} [options.strokeWidth=1] - The default stroke width
     * @param {Object=} options.attr - Attributes to apply to the ln's SVGElement element.
     * @param {Object=} options.css - CSS Properties to apply to the ln's SVGElement element.

     * @requires {@link  mkr}
     * @returns {ln} A new ln instance.
    **/
    var ln = function(options) {
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

        mkr.setDefault(options.attr, 'x1', 0); 
        mkr.setDefault(options.attr, 'y1', 0);
        mkr.setDefault(options.attr, 'x2', 50); 
        mkr.setDefault(options.attr, 'y2', 50);
        
        mkr.setDefault(options.attr, 'fill', options.fill);
        mkr.setDefault(options.attr, 'stroke', options.stroke);
        mkr.setDefault(options.attr, 'stroke-width', options.strokeWidth);

        this._el = mkr.create('line', {attr:options.attr, css:options.css}, this._parent);

		_instances[id] = this;
	};

    //TODO length, angle
	ln.prototype = {
        /**
         * @name ln#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The SVGElement element associated with this instance
        **/
        get el() {return this._el;},

        /**
         * @name ln#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's SVGElement element
        **/
        get id() {return this.el.id;},

        /**
         * @name ln#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the primary element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name ln#fill
         * @public
         * @type String
         * @description The ln's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name ln#stroke
         * @public
         * @type String
         * @description The ln's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name ln#strokeWidth
         * @public
         * @type Number
         * @description The ln's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name ln#dasharray
         * @public
         * @type *
         * @description The stroke-dasharray of the primary element
        **/
        get dasharray() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dasharray');
        },
        set dasharray(value) {
            TweenMax.set(this.el, {css:{strokeDasharray:value}});
        },

        /**
         * @name ln#dashoffset
         * @public
         * @type *
         * @description The stroke-dashoffset of the primary element
        **/
        get dashoffset() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dashoffset');
        },
        set dashoffset(value) {
            TweenMax.set(this.el, {css:{strokeDashoffset:value}});
        },

        /**
         * @name ln#slice
         * @public
         * @type String
         * @description Control how much of the primary element's stroke is drawn. Space-delimited values define a slice, ie '10 30'. A single value asserts 0 as the starting value. Accepts percentages for relative values
        **/
        get slice() {
            var offset, da, da0, da1, p0, p1;
            offset = mkr.unitless(String(this.dashoffset).trim());
            da = this.dasharray.split(',');
            da0 = mkr.unitless(String(da[0]).trim());
            
            if(offset === 0 && da0 === 'none') return '0 100%';

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
         * @name ln#x1
         * @public
         * @type Number
         * @description Start of the line along the x-axis
        **/
        get x1() {return this.el.getAttribute('x1');},
        set x1(value) {
            this.el.setAttribute('x1', value);
        },

        /**
         * @name ln#y1
         * @public
         * @type Number
         * @description Start of the line along the y-axis
        **/
        get y1() {return this.el.getAttribute('y1');},
        set y1(value) {
            this.el.setAttribute('y1', value);
        },

        /**
         * @name ln#x2
         * @public
         * @type Number
         * @description End of the line along the x-axis
        **/
        get x2() {return this.el.getAttribute('x2');},
        set x2(value) {
            this.el.setAttribute('x2', value);
        },

        /**
         * @name ln#y2
         * @public
         * @type Number
         * @description End of the line along the y-axis
        **/
        get y2() {return this.el.getAttribute('y2');},
        set y2(value) {
            this.el.setAttribute('y2', value);
        },
	};
	
	/**
    * @function getInstance
    * @memberof ln
    * @static
    * @description returns the ln instance associated with the id
    * @param {String} id - The lookup id
    * @returns {ln} The associated ln, if it exists
    **/
    ln.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof ln
    * @static
    * @description returns the ln instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {ln} The associated ln, if it exists
    **/    
    ln.getElInstance = function(el) {
        return _instances[el.id];
    };

	/**
    * @alias ln.VERSION
    * @memberof ln
    * @static
    * @readonly
    * @type String
    * @description returns ln's version number
    **/
    Object.defineProperty(ln, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return ln; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = ln;
    } else { //browser
        global[className] = ln;
    }
})(mkr._constructs, 'ln');