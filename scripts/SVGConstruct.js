/*!
 * VERSION: 0.0.2
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
     * @class SVGConstruct
     * @classdesc Base class for SVG constructs
     * @description Initializes a new SVGConstruct instance.
     * @param {Object} options - Options used to customize the SVGConstruct
     * @param {*=} options.parent - SVGElement which to append the primary element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Object=} options.attr - Attributes to apply to the SVGConstruct's SVGElement element.
     * @param {Object=} options.css - CSS Properties to apply to the SVGConstruct's SVGElement element.

     * @requires {@link  mkr}
     * @returns {SVGConstruct} A new SVGConstruct instance.
    **/
    var SVGConstruct = function(options) {
    	options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', mkr.default(mkr.query('svg'), mkr.create('svg', {css:{overflow:'visible'}})));
        var p = typeof this._parent == 'string' ? mkr.query(this._parent) : this._parent;
        if(!(p instanceof SVGElement)) {
            this._parent = mkr.create('svg', {css:{overflow:'visible'}}, this._parent);
        }

        mkr.setDefault(options, 'type', 'line');
		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});

        mkr.setDefault(options, 'fill', 'transparent');
        mkr.setDefault(options, 'stroke', '#000000');
        mkr.setDefault(options, 'strokeWidth', 1);
        
        mkr.setDefault(options.attr, 'fill', options.fill);
        mkr.setDefault(options.attr, 'stroke', options.stroke);
        mkr.setDefault(options.attr, 'stroke-width', options.strokeWidth);

        this._el = mkr.create(type, {attr:options.attr, css:options.css}, this._parent)

		//this._el = mkr.create('polygon', {attr:options.attr, css:options.css}, this._svg)

		_instances[id] = this;
	};

	SVGConstruct.prototype = {
        /**
         * @name SVGConstruct#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The SVGElement element associated with this instance
        **/
        get el() {return this._el;},

        /**
         * @name SVGConstruct#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's SVGElement element
        **/
        get id() {return this.el.id;},

        /**
         * @name SVGConstruct#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the primary element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name SVGConstruct#fill
         * @public
         * @type String
         * @description The SVGConstruct's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name SVGConstruct#stroke
         * @public
         * @type String
         * @description The SVGConstruct's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name SVGConstruct#strokeWidth
         * @public
         * @type Number
         * @description The SVGConstruct's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name SVGConstruct#dasharray
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
         * @name SVGConstruct#dashoffset
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
         * @name SVGConstruct#slice
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
	};
	
	/**
    * @function getInstance
    * @memberof SVGConstruct
    * @static
    * @description returns the SVGConstruct instance associated with the id
    * @param {String} id - The lookup id
    * @returns {SVGConstruct} The associate SVGConstruct, if it exists
    **/
    SVGConstruct.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof SVGConstruct
    * @static
    * @description returns the SVGConstruct instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {SVGConstruct} The associate SVGConstruct, if it exists
    **/    
    SVGConstruct.getElInstance = function(el) {
        return _instances[el.id];
    };

	/**
    * @alias SVGConstruct.VERSION
    * @memberof SVGConstruct
    * @static
    * @readonly
    * @type String
    * @description returns SVGConstruct's version number
    **/
    Object.defineProperty(SVGConstruct, 'VERSION', {
        get: function() {
          return '0.0.2';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return SVGConstruct; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = SVGConstruct;
    } else { //browser
        global[className] = SVGConstruct;
    }
})(mkr._constructs, 'SVGConstruct');