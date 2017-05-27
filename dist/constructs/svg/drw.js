/*!
 * VERSION: 0.1.1
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
     * @class drw
     * @classdesc A tool for drawing and animating SVG paths
     * @description Initializes a new drw instance.
     * @param {Object} options - Options used to customize the drw instance
     * @param {*=} options.parent - SVGElement which to append the drw's path element
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Number} [options.x=0] - Origin of the drw instance along the x-axis
     * @param {Number} [options.y=0] - Origin of the drw instance along the y-axis
     * @param {Boolean} [options.relative=false] - Whether drawing commands use relative vs absolute coordinates
     * @param {String} [options.fill='transparent'] - The default fill color
     * @param {String} [options.stroke='#000000'] - The default stroke color
     * @param {Number} [options.strokeWidth=1] - The default stroke width

     * @requires {@link  mkr}
     * @returns {drw} A new drw instance.
    **/
    var drw = function(options) {
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
        mkr.setDefault(options, 'relative', false);
        
        mkr.setDefault(options.attr, 'd', '');
        mkr.setDefault(options.attr, 'fill', options.fill);
        mkr.setDefault(options.attr, 'stroke', options.stroke);
        mkr.setDefault(options.attr, 'stroke-width', options.strokeWidth);

        this._path = mkr.create('path', {attr:options.attr, css:options.css}, this._parent);
        this._x = mkr.default(options.x, 0); 
        this._y = mkr.default(options.y, 0);
        this.move(this._x, this._y);
        this._startUnit = this._endUnit = false;

        _instances[id] = this;
    };
  
    drw.prototype = {
        /**
         * @name drw#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The path element associated with this instance
        **/
        get el() {return this._path;},

        /**
         * @name drw#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's clippath element
        **/
        get id() {return this.el.id;},

        /**
         * @name drw#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the path element
        **/
        get parent() {return this.el.parentNode;},

        /**
         * @name drw#fill
         * @public
         * @type String
         * @description The drw's fill color
        **/
        get fill() {return this.el.getAttribute('fill');},
        set fill(value) {
            this.el.setAttribute('fill', value);
        },

        /**
         * @name drw#stroke
         * @public
         * @type String
         * @description The drw's stroke color
        **/
        get stroke() {return this.el.getAttribute('stroke');},
        set stroke(value) {
            this.el.setAttribute('stroke', value);
        },

        /**
         * @name drw#strokeWidth
         * @public
         * @type Number
         * @description The drw's stroke width
        **/
        get strokeWidth() {return this.el.getAttribute('stroke-width');},
        set strokeWidth(value) {
            this.el.setAttribute('stroke-width', value);
        },

        /**
         * @name drw#x
         * @public
         * @type Number
         * @description The origin of the path along the x-axis
        **/
        get x() {
            return this._x;
        },
        set x(value) {
            this._x = value;
            this.setOrigin(this.x, this.y);
        },

        /**
         * @name drw#y
         * @public
         * @type Number
         * @description The origin of the path along the y-axis
        **/
        get y() {
            return this._y;
        },
        set y(value) {
            this._y = value;
            this.setOrigin(this.x, this.y);
        },

        /**
         * @name drw#relative
         * @public
         * @type Boolean
         * @description Whether drawing commands use relative vs absolute coordinates
        **/
        get relative() {return this._relative;},
        set relative(value) {
            this._relative = value;
        },

        /**
         * @name drw#d
         * @public
         * @type String
         * @description The drawing command
        **/
        get d() {return this.el.getAttribute('d');},
        set d(value) {
            this.el.setAttribute('d', value);
        },

        /**
         * @name drw#dasharray
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
         * @name drw#dashoffset
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
         * @name drw#slice
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
        
        //-- Helper Functions --//

        /**
         * @function find
         * @memberof drw.prototype
         * @public
         * @description Searches the path for the first instance of the specified pattern and returns the results in an array
         * @param {String} [pattern='A-Z'] - The search pattern.
         * @returns {Array} Array of containing the index of the path command, the command header, the full command, and the remaining path in that order.
        **/
        find: function(pattern) {
            return drw.find(this.d, pattern);
        },

        /**
         * @function split
         * @memberof drw.prototype
         * @static
         * @description Splits the path into an array of drawing commands
         * @returns {Array} An array of drawing commands.
        **/
        split: function(path) {
            return drw.split(this.d);
        },

        //-- Chainable Functions --//

        /**
         * @function setRelative
         * @memberof drw.prototype
         * @public
         * @description Set value of the relative property. @see relative
         * @param {Boolean} value - The value to set
         * @returns {drw} self
        **/
        setRelative: function(value) {
            this.relative = value;
            return this;
        },

        /**
         * @function setSlice
         * @memberof drw.prototype
         * @public
         * @description Chainable method for setting the slice. @see slice
         * @param {String} value - The slice value
         * @returns {drw} self
        **/
        setSlice: function(value) {
            this.slice = value;
            return this;
        },

        /**
         * @function setOrigin
         * @memberof drw.prototype
         * @public
         * @description Set the origin of the path
         * @param {Number} x - The origin along the x-axis
         * @param {Number} y - The origin along the y-axis
         * @returns {drw} self
        **/
        setOrigin: function(x, y) {
            this.relative = value;
            var commands = this.split();
            var origin = commands.shift().split(' ');
            if(['m', 'M'].indexOf(origin[0]) >= 0) {
                origin[1] = x;
                origin[2] = y;
            }
            commands.unshift(origin.join(''));
            return this;
        },

        /**
         * @function insertRaw
         * @memberof drw.prototype
         * @public
         * @description Inserts a new drawing command into the path element without enforcing the drawing mode
         * @param {String} index - Insertion index
         * @param {String} cmd - The command
         * @param {...*} params - Parameters for the supplied command
         * @returns {drw} self
        **/
        insertRaw: function(index, cmd, params) {            
            var args = Array.prototype.slice.call(arguments, 1);//.join(' ').trim();
            //console.log(args);
            var len = args.length;
            if(len > 2) {
                var arg;
                for(var i=1; i<len; i++) {
                    arg = args[i];
                    if(typeof arg == 'string') continue;
                    args[i] = arg = mkr.fix(arg);
                    if(i == 1) continue;
                    if(arg >= 0) args[i] = ','+arg;
                }
            }
            var c = args.join('').trim();

            var commands = this.d === '' ? [] : this.split();
            index = mkr.default(index, commands.length);
            if(index < 0) index = commands.length + index; 
            commands.splice(index, 0, c)

            TweenMax.set(this._path, {attr:{d:commands.join('')}});
            return this;
        },

        /**
         * @function insert
         * @memberof drw.prototype
         * @public
         * @description Inserts a new drawing command into the path element
         * @param {String} index - Insertion index
         * @param {String} cmd - The command
         * @param {...*} params - Parameters for the supplied command
         * @returns {drw} self
        **/
        insert: function(index, cmd, params) {
            if(this.relative) cmd = cmd.toLowerCase();
            else cmd = cmd.toUpperCase();

            var args = Array.prototype.slice.call(arguments);
            return this.insertRaw.apply(this, args);
        },

        /**
         * @function addRaw
         * @memberof drw.prototype
         * @public
         * @description Adds a new drawing command to the path element without enforcing the drawing mode
         * @param {String} cmd - The command
         * @param {...*} params - Parameters for the supplied command
         * @returns {drw} self
        **/
        addRaw: function(cmd, params) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(undefined);
            return this.insertRaw.apply(this, args);
        },

        /**
         * @function add
         * @memberof drw.prototype
         * @public
         * @description add a new drawing command to the path element
         * @param {String} cmd - The command
         * @param {...*} params - Parameters for the supplied command
         * @returns {drw} self
        **/
        add: function(cmd, params) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(undefined);
            return this.insert.apply(this, args);
        },

        /**
         * @function clear
         * @memberof drw.prototype
         * @public
         * @description Clears the drawing command except for the origin
         * @returns {drw} self
        **/
        clear: function() {
            this.d = '';
            return this.move(this.x, this.y);
        },

        //-- Line Functions --//

        /**
         * @function move
         * @memberof drw.prototype
         * @public
         * @description Move the drawing cursor to specific coordinates
         * @param {Number} x - Cursor position along the x-axis
         * @param {Number} y - Cursor position along the y-axis
         * @returns {drw} self
        **/
        move: function(x, y) {
            return this.add('M', x, y);
        },

        /**
         * @function line
         * @memberof drw.prototype
         * @public
         * @description Draw a line
         * @param {Number} x - End point of the line along the x-axis
         * @param {Number} y - End point of the line along the y-axis
         * @returns {drw} self
        **/
        line: function(x, y) {
            return this.add('L', x, y);
        },

        /**
         * @function lineH
         * @memberof drw.prototype
         * @public
         * @description Draw a horizontal line
         * @param {Number} x - End point of the line along the x-axis
         * @returns {drw} self
        **/
        lineH: function(x) {
            return this.add('H', x);
        },

        /**
         * @function lineV
         * @memberof drw.prototype
         * @public
         * @description Draw a vertical line
         * @param {Number} y - End point of the line along the y-axis
         * @returns {drw} self
        **/
        lineV: function(y) {
            return this.add('V', y);
        },

        /**
         * @function close
         * @memberof drw.prototype
         * @public
         * @description Close the path with a 'Z' command
         * @returns {drw} self
        **/
        close: function(close) {
            return this.add('Z');
        },

        //-- Curve Functions --//

        /**
         * @function curve
         * @memberof drw.prototype
         * @public
         * @description Draw a cubic bezier curve
         * @param {Number} cx1 - Control point1 along the x-axis
         * @param {Number} cy1 - Control point1 along the y-axis
         * @param {Number} cx2 - Control point2 along the x-axis
         * @param {Number} cy2 - Control point2 along the y-axis
         * @param {Number} x - End point along the x-axis
         * @param {Number} y - End point along the y-axis
         * @returns {drw} self
        **/
        curve: function(cx1, cy1, cx2, cy2, x, y) {
            return this.add('C', cx1, cy1, cx2, cy2, x, y);
        },

        /**
         * @function curve2
         * @memberof drw.prototype
         * @public
         * @description Draw a cubic bezier curve. Invokes the 'S' command to chain cubic bezier curves together
         * @param {Number} cx - Control point along the x-axis
         * @param {Number} cy - Control point along the y-axis
         * @param {Number} x - End point along the x-axis
         * @param {Number} y - End point along the y-axis
         * @returns {drw} self
        **/
        curve2: function(cx, cy, x, y) {
            return this.add('S', cx, cy, x, y);
        },

        /**
         * @function qdrtc
         * @memberof drw.prototype
         * @public
         * @description Draw a quadratic bezier curve
         * @param {Number} cx - Control point along the x-axis
         * @param {Number} cy - Control point along the y-axis
         * @param {Number} x - End point along the x-axis
         * @param {Number} y - End point along the y-axis
         * @returns {drw} self
        **/
        qdrtc: function(cx, cy, x, y) {
            return this.add('Q', cx, cy, x, y);
        },

        /**
         * @function qdrtc2
         * @memberof drw.prototype
         * @public
         * @description Draw a quadratic bezier curve. Invokes the 'T' command to chain quadratic bezier curves together
         * @param {Number} x - End point along the x-axis
         * @param {Number} y - End point along the y-axis
         * @returns {drw} self
        **/
        qdrtc2: function(x, y) {
            return this.add('T', x, y);
        },

        //-- Arc Functions --//

        /**
         * @function arc
         * @memberof drw.prototype
         * @public
         * @description Draw a circular arc
         * @param {Number} x - Origin of the arc along the x-axis
         * @param {Number} y - Origin of the arc along the y-axis
         * @param {Number} r - Radius of the arc
         * @param {Number} start - Starting point of the arc along the circle in degrees
         * @param {Number} length - Length of the arc in degrees from 0-359
         * @param {Boolean} [fromCenter=true] - Whether the origin is the center of arc or a point along its edge
         * @param {*} [largeArcSweepFlag='auto'] - Large arc sweep flag used in the arc. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
         * @param {int} [sweepFlag=0] -  Sweep flag of the arc along the y-axis. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
         * @returns {drw} self
        **/
        arc: function(x, y, r, start, length, fromCenter, largeArcSweepFlag, sweepFlag) {
            var commands = drw.calculateArc(x, y, r, r, start, length, fromCenter, largeArcSweepFlag, sweepFlag);
            this.add.apply(this, commands[0]);
            return this.add.apply(this, commands[1]);
        },

        /**
         * @function arc2
         * @memberof drw.prototype
         * @public
         * @description Draw an elliptical arc
         * @param {Number} x - Origin of the arc along the x-axis
         * @param {Number} y - Origin of the arc along the y-axis
         * @param {Number} rx - Radius of the arc along the x-axis
         * @param {Number} rx - Radius of the arc along the y-axis
         * @param {Number} start - Starting point of the arc along the circle in degrees
         * @param {Number} length - Length of the arc in degrees from 0-359
         * @param {Boolean} [fromCenter=true] - Whether the origin is the center of arc or a point along its edge
         * @param {*} [largeArcSweepFlag='auto'] - Large arc sweep flag used in the arc. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
         * @param {int} [sweepFlag=0] -  Sweep flag of the arc along the y-axis. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
         * @returns {drw} self
        **/
        arc2: function(x, y, rx, ry, start, length, fromCenter, largeArcSweepFlag, sweepFlag) {
            var commands = drw.calculateArc(x, y, rx, ry, start, length, fromCenter, largeArcSweepFlag, sweepFlag);
            this.add.apply(this, commands[0]);
            return this.add.apply(this, commands[1]);
        },

        //-- Shape Functions --//

        /**
         * @function circle
         * @memberof drw.prototype
         * @public
         * @description draw a circle
         * @param {Number} x - Origin of the circle along the x-axis
         * @param {Number} y - Origin of the circle along the y-axis
         * @param {Number} r - Radius of the circle
         * @param {Boolean} [fromCenter=true] - Whether the origin is the center of arc or a point along its edge
         * @returns {drw} self
        **/
        circle: function(x, y, r, fromCenter) {
            return this.arc(x, y, r, 0, 360, fromCenter);
        },

        /**
         * @function ellipse
         * @memberof drw.prototype
         * @public
         * @description draw a ellipse
         * @param {Number} x - Origin of the ellipse along the x-axis
         * @param {Number} y - Origin of the ellipse along the y-axis
         * @param {Number} rx - Radius of the ellipse along the x-axis
         * @param {Number} ry - Radius of the ellipse along the y-axis
         * @param {Boolean} [fromCenter=true] - Whether the origin is the center of arc or a point along its edge
         * @returns {drw} self
        **/
        ellipse: function(x, y, rx, ry, fromCenter) {
            return this.arc2(x, y, rx, ry, 0, 360, fromCenter);
        },

        /**
         * @function polygon
         * @memberof drw.prototype
         * @public
         * @description draw a regular polygon
         * @param {Number} x - Origin of the polygon along the x-axis
         * @param {Number} y - Origin of the polygon along the y-axis
         * @param {Number} r - The radius of the polygon
         * @param {int} [sides=5] - The number of sides on the polygon
         * @param {int} [rotation=0] - The rotation of the polygon in degrees
         * @returns {drw} self
        **/
        polygon: function(x, y, r, sides, rotation) {
            sides = mkr.default(sides, 5);
            rotation = mkr.default(rotation, 0);

            var points = [];
            var dR = mkr.RAD*(360/sides);
            rotation *= mkr.RAD;
            this.move(x, y);
            var lx=x, ly=y, dx, dy;
            for(var i=0; i<sides; i++) {
                dx = (x + r*Math.cos(dR*i+rotation)) - lx;
                dy = (y + r*Math.sin(dR*i+rotation)) - ly;
                lx += dx;
                ly += dy;
                points.push([lx, ly]);
                var func = i == 0 ? this.move : this.line;
                if(this.relative) {
                    func.call(this, dx, dy);
                }
                else {
                    func.call(this,lx, ly);
                }
            }
            if(this.relative) {
                dx = points[0][0] - lx;
                dy = points[0][1] - ly;
                this.line(dx, dy);
            }
            else {
                this.line(points[0][0], points[0][1]);
            }
            return this;
        },

        /**
         * @function triangle
         * @memberof drw.prototype
         * @public
         * @description draw a regular triangle
         * @param {Number} x - Origin of the triangle along the x-axis
         * @param {Number} y - Origin of the triangle along the y-axis
         * @param {Number} r - The radius of the triangle
         * @param {int} [rotation=0] - The rotation of the triangle in degrees
         * @returns {drw} self
        **/
        triangle: function(x, y, r, rotation) {
            return this.polygon(x, y, r, 3, rotation);
        },

        /**
         * @function square
         * @memberof drw.prototype
         * @public
         * @description draw a regular square
         * @param {Number} x - Origin of the square along the x-axis
         * @param {Number} y - Origin of the square along the y-axis
         * @param {Number} r - The radius of the square
         * @param {int} [rotation=0] - The rotation of the square in degrees
         * @returns {drw} self
        **/
        square: function(x, y, r, rotation) {
            return this.polygon(x, y, r, 4, rotation);
        },

        /**
         * @function star
         * @memberof drw.prototype
         * @public
         * @description draw a regular star
         * @param {Number} x - Origin of the star along the x-axis
         * @param {Number} y - Origin of the star along the y-axis
         * @param {Number} r1 - The inner radius of the star
         * @param {Number} r2 - The outer radius of the star
         * @param {int} [points=5] - The number of points on the star
         * @param {int} [rotation=0] - The rotation of the star in degrees
         * @returns {drw} self
        **/
        star: function(x, y, r1, r2, points, rotation) {
            points = mkr.default(points, 5);
            rotation = mkr.default(rotation, 0);

            var coords = [];
            var len = points*2;
            var dR = mkr.RAD*(360/len);
            rotation *= mkr.RAD;
            this.move(x, y);
            var lx=x, ly=y, dx, dy, r;
            for(var i=0; i<len; i++) {
                r = i%2 == 0 ? r1 : r2;
                dx = (x + r*Math.cos(dR*i+rotation)) - lx;
                dy = (y + r*Math.sin(dR*i+rotation)) - ly;
                lx += dx;
                ly += dy;
                coords.push([lx, ly]);
                var func = i == 0 ? this.move : this.line;
                if(this.relative) {
                    func.call(this, dx, dy);
                }
                else {
                    func.call(this,lx, ly);
                }
            }
            if(this.relative) {
                dx = coords[0][0] - lx;
                dy = coords[0][1] - ly;
                this.line(dx, dy);
            }
            else {
                this.line(coords[0][0], coords[0][1]);
            }
            return this;
        },

        /**
         * @function rect
         * @memberof drw.prototype
         * @public
         * @description draw a rectangle
         * @param {Number} x - Position of the rectangle along the x-axis
         * @param {Number} y - Position of the rectangle along the y-axis
         * @param {Number} w - Width of the rectangle
         * @param {Number} h - Height of the rectangle
         * @returns {drw} self
        **/
        rect: function(x, y, w, h){
            this.move(x, y);
            if(this.relative) {
                this.lineH(w);
                this.lineV(h);
                this.lineH(-w);
                this.lineV(-h);
            }
            else {
                this.lineH(x+w);
                this.lineV(y+h);
                this.lineH(x);
                this.lineV(y);
            }
            return this;
        },
    };
    
    /**
     * @function calculateArc
     * @memberof drw
     * @static
     * @description Calculate an arc given its center
     * @param {Number} x - Origin of the arc along the x-axis
     * @param {Number} y - Origin of the arc along the y-axis
     * @param {Number} rx - Radius of the arc along the x-axis
     * @param {Number} ry - Radius of the arc along the y-axis
     * @param {Number} start - Starting point of the arc along the circle in degrees
     * @param {Number} length - Length of the arc in degrees from 0-359
     * @param {Boolean} [fromCenter=true] - Whether the origin is the center of arc or a point along its edge
     * @param {*} [largeArcSweepFlag='auto'] - Large arc sweep flag used in the arc. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
     * @param {int} [sweepFlag=0] -  Sweep flag of the arc along the y-axis. See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths/#Arcs Arcs on the MDN} for more info.
     * @returns {Array} Array of characters representing an arc command
    **/
    drw.calculateArc = function(x, y, rx, ry, start, length, fromCenter, largeArcSweepFlag, sweepFlag) {
        if(length%360 == 0 && length != 0) length+= 359.999*(length/Math.abs(length));
        length = length%360;

        var end = start + length;
        var rad1 = (end-90)*mkr.RAD;
        var rad2 = (start-90)*mkr.RAD;
        var x1, x2, y1, y2;

        fromCenter = mkr.default(fromCenter, true);
        if(!fromCenter) {
            x1 = x;
            y1 = y;
            var cx = x-(rx*Math.cos(rad1));
            var cy = y-(ry*Math.sin(rad1));
            x2 = cx+(rx*Math.cos(rad2));
            y2 = cy+(ry*Math.sin(rad2));
        }
        else {
            x1 = x+(rx*Math.cos(rad1));
            y1 = y+(ry*Math.sin(rad1));
            x2 = x+(rx*Math.cos(rad2));
            y2 = y+(ry*Math.sin(rad2));
        }
        
        largeArcSweepFlag = mkr.default(largeArcSweepFlag, 'auto');
        if(largeArcSweepFlag === 'auto') largeArcSweepFlag = length <= 180 ? 0 : 1;
        sweepFlag = mkr.default(sweepFlag, 0);

        return [['M', x1, y1], ['A', rx, ry, 0, largeArcSweepFlag, sweepFlag, x2, y2]];
    };

    /**
     * @function find
     * @memberof drw
     * @static
     * @description Searches the given path for each occurrence of the provided command pattern
     * @param {String} path - The path to search
     * @param {String} [pattern='[A-Za-z]'] - The search pattern.
     * @returns {Array} Array of result objects where each entry contains fields the matched substring(match) and the index of the match within the path(index)
    **/
    drw.find = function(path, pattern) {
        pattern = pattern || '[A-Za-z]';
        var regX = new RegExp('('+pattern+')((( |-)?\\d+(\\.\\d+)*,*)*)', 'g');
        var results =[];
        path.replace(regX, function() {
            var result = {
                match: arguments[0],
                index: arguments[arguments.length-2],
                groups: Array.prototype.slice.call(arguments, 1, -2)
            }
            
            results.push(result);
        });

        return results;
    };

    /**
     * @function split
     * @memberof drw
     * @static
     * @description Splits the given path into an array of drawing commands
     * @param {String} path - The path to search
     * @returns {Array} An array of drawing commands.
    **/
    drw.split = function(path) {
        var regX = /([A-Za-z])((( |-)?\d+(\.\d+)*,*)*)/g;
        var matches =[];
        path.replace(regX, function(match) {
            matches.push(match);
        });
        return matches;
    };

    /**
     * @function getInstance
     * @memberof drw
     * @static
     * @description returns the drw instance associated with the id
     * @param {String} id - The lookup id
     * @returns {drw} The associate drw, if it exists
    **/
    drw.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof drw
    * @static
    * @description returns the drw instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {drw} The associate drw, if it exists
    **/    
    drw.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias drw.VERSION
    * @memberof drw
    * @static
    * @readonly
    * @type String
    * @description returns drw's version number
    **/
    Object.defineProperty(drw, 'VERSION', {
        get: function() {
          return '0.1.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return drw; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = drw;
    } else { //browser
        global[className] = drw;
    }
})(mkr._constructs, 'drw');