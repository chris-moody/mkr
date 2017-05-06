/*!
 * VERSION: 0.0.1
 * DATE: 2017-03-30
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
     * @param {*} [options.parent=document.body] - Element which the arc's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.radius=50] - The radius of the arc
     * @param {Number} [options.cx=this.radius] - The center of the arc along the x-axis
     * @param {Number} [options.cy=this.radius] - The center of the arc along the y-axis
     * @param {Number} [options.start=0] - The starting point of the arc along its circle in degrees
     * @param {Number} [options.length=0] - The length of the arc along in degrees
     * @param {Number} [options.rotation=0] - The rotation of the arc in degrees
     * @param {Number} [options.sweepFlag=0] - The sweepFlag value used in the svg drawing command to produce the arc
     * @param {*=} options.svgRoot - svg element which to append the arc. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {String} [options.svg.attr.class='arc-svg']
     * @param {String} [options.svg.attr.width=options.radius*2]
     * @param {String} [options.svg.attr.height=options.radius*2]
     * @param {String} [options.svg.css.overflow='visible']

     * @param {Object=} options.css - CSS properties to apply to the arc's path element.
     * @param {Object=} options.attr - Attributes to apply to the arc's path element.
     * @param {String} [options.attr.class='arc-path'] - Class string applied to the path element.
     * @param {String} [options.attr.fill='transparent'] - The fill color of the path.
     * @param {String} [options.attr.stroke='#f37121'] - The stroke color of the path.
     * @param {String} [options.attr['stroke-width']=15] - The stroke-width of the path.

     * @requires {@link  mkr}
     * @returns {arc} A new arc instance.
    **/
    var arc = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', document.body);

        mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options, 'svg', {});

        mkr.setDefault(options.attr, 'class', 'arc-path');
        mkr.setDefault(options.attr, 'fill', 'transparent');
        mkr.setDefault(options.attr, 'stroke', '#f37121');
        mkr.setDefault(options.attr, 'stroke-width', 15);

        this._radius = mkr.setDefault(options, 'radius', 50);
        var d = 2*options.radius;

        mkr.setDefault(options.svg, 'attr', {});
        mkr.setDefault(options.svg.attr, 'class', 'arc-svg');
        mkr.setDefault(options.svg.attr, 'width', d);
        mkr.setDefault(options.svg.attr, 'height', d);
        mkr.setDefault(options.svg, 'css', {});
        mkr.setDefault(options.svg.css, 'overflow', visible);

        this._svg = options.svgRoot;
        if(!this._svg) {
            this._svg = mkr.create('svg', options.svg, this._parent);
        }
        else if(typeof this._svg === 'string') {
            this._svg = mkr.query(this._svg)
        }
        this._start = mkr.setDefault(options, 'start', 0);
        
        this._length = arc.flatten(mkr.setDefault(options, 'length', 0));
        this._end = this._start + this._length;

        this._cx = mkr.setDefault(options, 'cx', this._radius);
        this._cy = mkr.setDefault(options, 'cy', this._radius);
        this._rotation = mkr.setDefault(options, 'rotation', 0);
        this._sweepFlag = mkr.setDefault(options, 'sweepFlag', 0);

        mkr.setDefault(options.attr, 'd', this.path);    
        this._path = mkr.create('path', {attr:options.attr, css:options.css}, this._svg);   

        _instances[id] = this;
    };
  
    arc.prototype = {
        /**
         * @name arc#svg
         * @public
         * @readonly
         * @type SVGElement
         * @description The root svg element
        **/
        get svg() {return this._svg;},

        /**
         * @name arc#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The path element associated with this instance
        **/
        get el() {return this._path;},

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
         * @name arc#radius
         * @public
         * @type Number
         * @description The radius of the arc
        **/
        get radius() {return this._radius;},
        set radius(value) {
            this._radius = value;
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
         * @description The largeArcFlag value used in the svg drawing command to produce the arc
        **/
        get largeArcFlag() {return this._largeArcFlag;},

        /**
         * @name arc#sweepFlag
         * @public
         * @type Number
         * @description The sweepFlag value used in the svg drawing command to produce the arc
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
         * @description The svg drawing command to produce the main path element
        **/
        get calculatedPath() {
            return this.calculatePath(this.cx, this.cy, this.radius, this.start, this.length);
        },

        /**
         * @name arc#path
         * @public
         * @readonly
         * @type Number
         * @description The main path element
        **/
        get path() {
            return this._path;
        },

        /**
         * @function calculatePath
         * @memberof arc.prototype
         * @public
         * @description Returns the svg drawing command to produce the specified
         * @param {Number} cx - The center of the arc along the x-axis
         * @param {Number} cy - The center of the arc along the y-axis
         * @param {Number} r - The radius of the arc
         * @param {Number} start - The starting point of the arc along its circle in degrees
         * @param {Number} length - The length of the arc in degrees
         * @returns {String} The svg drawing command 
        **/
        calculatePath: function(cx, cy, r, start, length) {
            length = arc.flatten(length);
            if(length < 0) length+= 360;
            var end = start + length;
            
            var rad1 = (end-90)*(Math.PI/180.0);
            var rad2 = (start-90)*(Math.PI/180.0);
            var x1 = cx+(r*Math.cos(rad1));
            var y1 = cy+(r*Math.sin(rad1));
            var x2 = cx+(r*Math.cos(rad2));
            var y2 = cy+(r*Math.sin(rad2)); t
            var largeArcFlag = length <= 180 ? 0 : 1;
            var sweepFlag = this.sweepFlag;

            return [
                "M", x1, y1, 
                "A", r, r, 0, largeArcFlag, sweepFlag, x2, y2
            ].join(" ");
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
            TweenMax.set(this._path, {attr:{d:this.path}});
        }
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
          return '0.0.1';
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