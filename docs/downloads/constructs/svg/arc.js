/*!
 * VERSION: 1.1.0
 * DATE: 2017-05-26
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
     * @class arc
     * @classdesc A customizable and animatable SVG arc
     * @description Initializes a new arc instance.
     * @param {Object} options - Options used to customize the arc
     * @param {*=} options.parent - SVGElement which to append the arc's path element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.rx=50] - The x-axis radius of the arc
     * @param {Number} [options.ry=50] - The y-axis radius of the arc
     * @param {Number=} options.r - Use this option to create a circular, an arc that uses the same value for both rx and ry
     * @param {Number} [options.cx=this.rx] - The center of the arc along the x-axis
     * @param {Number} [options.cy=this.ry] - The center of the arc along the y-axis
     * @param {Number} [options.start=0] - The starting point of the arc along its circle in degrees
     * @param {Number} [options.length=0] - The length of the arc along in degrees
     * @param {Number} [options.rotation=0] - The rotation of the arc in degrees
     * @param {Number} [options.sweepFlag=0] - The sweepFlag value used in the svg drawing command to produce the arc

     * @param {String} [options.fill='transparent'] - The arc's fill color.
     * @param {String} [options.stroke='#000000'] - The arc's stroke color.
     * @param {String} [options.strokeWidth=1] - The arc's stroke-width.

     * @param {Object=} options.css - CSS properties to apply to the arc's path element.
     * @param {Object=} options.attr - Attributes to apply to the arc's path element.
     * @param {String} [options.attr.class='arc-path'] - Class string applied to the path element.

     * @requires {@link  mkr}
     * @returns {arc} A new arc instance.
    **/
    var arc = function(options) {
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

        mkr.setDefault(options.attr, 'class', 'arc-path');
        mkr.setDefault(options.attr, 'fill', options.fill);
        mkr.setDefault(options.attr, 'stroke', options.stroke);
        mkr.setDefault(options.attr, 'stroke-width', options.strokeWidth);

        var r = options.r;
        if(r !== undefined) {
            this._rx = this._ry = r;
        }
        else {
            this._rx = mkr.default(options.rx, 50);
            this._ry = mkr.default(options.ry, 50);
        }
        
        this._start = mkr.default(options.start, 0);
        
        this._length = arc.flatten(mkr.default(options.length, 0));
        this._end = this._start + this._length;

        this._cx = mkr.default(options.cx, this._rx);
        this._cy = mkr.default(options.cy, this._ry);
        this._rotation = mkr.default(options.rotation, 0);
        this._sweepFlag = mkr.default(options.sweepFlag, 0);

        mkr.setDefault(options.attr, 'd', this.calculatedPath);    
        this._path = mkr.create('path', {attr:options.attr, css:options.css}, this._parent);   

        _instances[id] = this;
    };
  
    arc.prototype = {
        /**
         * @name arc#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The path element associated with this instance
        **/
        get el() {return this._path;},

        /**
         * @name arc#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's path element
        **/
        get id() {return this.el.id;},

        /**
         * @name arc#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the path element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name arc#fill
         * @public
         * @type String
         * @description The arc's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name arc#stroke
         * @public
         * @type String
         * @description The arc's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name arc#strokeWidth
         * @public
         * @type Number
         * @description The arc's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name arc#dasharray
         * @public
         * @type *
         * @description The stroke-dasharray of the path
        **/
        get dasharray() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dasharray');
        },
        set dasharray(value) {
            TweenMax.set(this.el, {css:{strokeDasharray:value}});
        },

        /**
         * @name arc#dashoffset
         * @public
         * @type *
         * @description The stroke-dashoffset of the path
        **/
        get dashoffset() {
            var style = window.getComputedStyle(this.el);
            return style.getPropertyValue('stroke-dashoffset');
        },
        set dashoffset(value) {
            TweenMax.set(this.el, {css:{strokeDashoffset:value}});
        },

        /**
         * @name arc#slice
         * @public
         * @type String
         * @description Control how much of the path's stroke is drawn. Space-delimited values define a slice, ie '10 30'. A single value asserts 0 as the starting value. Accepts percentages for relative values
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
         * @name arc#cx
         * @public
         * @type Number
         * @description The center of the arc along the x-axis
        **/
        get cx() {return this._cx;},
        set cx(value) {
            this._cx = value;
            this.update();
        },

        /**
         * @name arc#cy
         * @public
         * @type Number
         * @description The center of the arc along the y-axis
        **/
        get cy() {return this._cy;},
        set cy(value) {
            this._cy = value;
            this.update();
        },

        /**
         * @name arc#r
         * @public
         * @type Number
         * @description The radius of the arc
        **/
        get r() {return this._rx;},
        set r(value) {
            this._rx = this._ry = value;
            this.update();
        },

        /**
         * @name arc#rx
         * @public
         * @type Number
         * @description The x-axis radius of the arc
        **/
        get rx() {return this._rx;},
        set rx(value) {
            this._rx = value;
            this.update();
        },

        /**
         * @name arc#ry
         * @public
         * @type Number
         * @description The y-axis radius of the arc
        **/
        get ry() {return this._ry;},
        set ry(value) {
            this._ry = value;
            this.update();
        },

        /**
         * @name arc#end
         * @public
         * @type Number
         * @description The ending point of the arc along its circle in degrees
        **/
        get end() {return this._start+this._length;},
        set end(value) {
            this._end = value;
            this.length = value-this._start;
        },
        
        /**
         * @name arc#start
         * @public
         * @type Number
         * @description The starting point of the arc along its circle in degrees
        **/
        get start() {return this._start;},
        set start(value) {
            this._start = value;
            this.update();
        },

        /**
         * @name arc#length
         * @public
         * @type Number
         * @description The length of the arc in degrees
        **/
        get length() {return this._length;},
        set length(value) {
            this._length = value;
            this.update();
        },

        /**
         * @name arc#rotation
         * @public
         * @type Number
         * @description The rotation of the arc in degrees
        **/
        get rotation() {return this._rotation;},
        set rotation(value) {
            this._rotation = value;
            this.update();
        },

        /**
         * @name arc#largeArcFlag
         * @public
         * @readonly
         * @type Number
         * @description The largeArcFlag value used by the svg drawing command to produce the arc
        **/
        get largeArcFlag() {return this._largeArcFlag;},

        /**
         * @name arc#sweepFlag
         * @public
         * @type Number
         * @description The sweepFlag value used by the svg drawing command to produce the arc
        **/
        get sweepFlag() {return this._sweepFlag;},
        set sweepFlag(value) {
            this._sweepFlag = value;
            this.update();
        },

        /**
         * @name arc#calculatedPath
         * @public
         * @readonly
         * @type String
         * @description The svg drawing calculated based on the prperties of this instance
        **/
        get calculatedPath() {
            return arc.calculatePath(this.cx, this.cy, this.rx, this.ry, this.start, this.length, this.sweepFlag);
        },

        /**
         * @function calculatePath
         * @memberof arc.prototype
         * @public
         * @description Returns the svg drawing command to produce the specified
         * @param {Number} cx - The center of the arc along the x-axis
         * @param {Number} cy - The center of the arc along the y-axis
         * @param {Number} rx - The x-axis radius of the arc
         * @param {Number} ry - The y-axis radius of the arc
         * @param {Number} start - The starting point of the arc along its circle in degrees
         * @param {Number} length - The length of the arc in degrees
         * @param {Number} sweepFlag - The sweepFlag value used in the calculated svg drawing command
         * @returns {String} The svg drawing command 
        **/
        calculatePath: function(cx, cy, rx, ry, start, length, sweepFlag) {
            return arc.calculatePath(cx, cy, rx, ry, start, length, sweepFlag);
        },

        /**
         * @function update
         * @memberof arc.prototype
         * @private
         * @description Updates the arc
         * @param {Boolean} [draw=true] - Whether to invoke the draw function
        **/
        update: function(draw) {
            if(mkr.default(draw, true)) this.draw();
        },

        /**
         * @function draw
         * @memberof arc.prototype
         * @private
         * @description Draws the path of the arc
        **/
        draw: function() {
            TweenMax.set(this._path, {attr:{d:this.calculatedPath}});
        }
    };
    /**
     * @function calculatePath
     * @memberof arc
     * @static
     * @description Returns the svg drawing command to produce the specified
     * @param {Number} cx - The center of the arc along the x-axis
     * @param {Number} cy - The center of the arc along the y-axis
     * @param {Number} rx - The x-axis radius of the arc
     * @param {Number} ry - The y-axis radius of the arc
     * @param {Number} start - The starting point of the arc along its circle in degrees
     * @param {Number} length - The length of the arc in degrees
     * @param {Number} sweepFlag - The sweepFlag value used in the calculated svg drawing command
     * @returns {String} The svg drawing command 
    **/
    arc.calculatePath = function(cx, cy, rx, ry, start, length, sweepFlag) {
        length = arc.flatten(length);
        if(length < 0) length+= 360;
        var end = start + length;
        
        var rad1 = (end-90)*mkr.RAD;
        var rad2 = (start-90)*mkr.RAD;
        var x1 = cx+(rx*Math.cos(rad1));
        var y1 = cy+(ry*Math.sin(rad1));
        var x2 = cx+(rx*Math.cos(rad2));
        var y2 = cy+(ry*Math.sin(rad2));
        var largeArcFlag = length <= 180 ? 0 : 1;
        var sweepFlag = mkr.default(sweepFlag, 0);

        return [
            "M", x1, y1, 
            "A", rx, ry, 0, largeArcFlag, sweepFlag, x2, y2
        ].join(" ");
    };

    /**
    * @function flatten
    * @memberof arc
    * @static
    * @description The provided value flattened in the range of 0-360
    * @param {Number} value - The value to flatten
    * @returns {Number} The flattened value 
    **/
    arc.flatten = function(value) {
        if(value%360 == 0 && value != 0) value+= 359.999*(value/Math.abs(value));
        return value%360;
    };

    /**
    * @function getInstance
    * @memberof arc
    * @static
    * @description returns the arc instance associated with the id
    * @param {String} id - The lookup id
    * @returns {arc} The associate arc, if it exists
    **/
    arc.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof arc
    * @static
    * @description returns the arc instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {arc} The associate arc, if it exists
    **/    
    arc.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias arc.VERSION
    * @memberof arc
    * @static
    * @readonly
    * @type String
    * @description returns arc's version number
    **/
    Object.defineProperty(arc, 'VERSION', {
        get: function() {
          return '1.1.0';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return arc; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = arc;
    } else { //browser
        global[className] = arc;
    }
})(mkr._constructs, 'arc');