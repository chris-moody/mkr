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
     * @class drw
     * @classdesc A tool for drawing and animating SVG paths
     * @description Initializes a new drw instance.
     * @param {Object} options - Options used to customize the drw instance
     * @param {*} [options.parent=document.body] - Element which the drw's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {*=} options.svgRoot - svg element which to append the drw. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {String} [options.fill='transparent'] - The default fill color
     * @param {String} [options.stroke='#000000'] - The default stroke color
     * @param {Number} [options.strokeWidth=1] - The default stroke width
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {String} [options.svg.attr.class='drw-svg']
     * @param {String} [options.svg.attr.width='100%']
     * @param {String} [options.svg.attr.height='100%']
     * @param {String} [options.svg.css.overflow='visible']

     * @requires {@link  drw}
     * @returns {msk} A new drw instance.
    **/
    var drw = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.getDefault(options, 'parent', document.body);
        
        //mkr.setDefault(options, 'attr', {});
        //mkr.setDefault(options.attr, 'id', id);
        //mkr.setDefault(options, 'css', {});
        mkr.setDefault(options, 'svg', {});

        mkr.setDefault(options.svg, 'attr', {});
        mkr.setDefault(options.svg.attr, 'class', 'drw-svg');
        mkr.setDefault(options.svg.attr, 'width', '100%');
        mkr.setDefault(options.svg.attr, 'height', '100%');
        mkr.setDefault(options.svg, 'css', {});
        mkr.setDefault(options.svg.css, 'overflow', visible);

        this._svg = options.svgRoot || mkr.create('svg', options.svg, this._parent);

        this._drawData = {};
        this._drawData.fill = mkr.default(options.fill, 'transparent');
        this._drawData.stroke = mkr.default(options.stroke, '#000000');
        this._drawData['stroke-width'] = mkr.default(options.strokeWidth, 1);
        
        this._init();
        _instances[id] = this;
    };
  
    drw.prototype = {
        /**
         * @name drw#svg
         * @public
         * @readonly
         * @type SVGElement
         * @description The root svg element
        **/
        get svg() {return this._svg;},

        /**
         * @name drw#fill
         * @public
         * @type String
         * @description The current fill color
        **/
        get fill() {return this._drawData.fill;},
        set fill(value) {
            this._drawData.fill = value;
        },

        /**
         * @name drw#stroke
         * @public
         * @type String
         * @description The current stroke color
        **/
        get stroke() {return this._drawData.stroke;},
        set stroke(value) {
            this._drawData.stroke = value;
        },

        /**
         * @name drw#strokeWidth
         * @public
         * @type String
         * @description The current stroke width
        **/
        get strokeWidth() {return this._drawData.strokeWidth;},
        set strokeWidth(value) {
            this._drawData['stroke-width'] = value;
        },

        /**
         * @function _init
         * @memberof drw.prototype
         * @private
         * @description Initializes the drw instance
        **/
        _init: function() {
            //this._last = null;
            this._lastX = this._lastY = 0;
        },

        /**
         * @function _checkPath
         * @memberof drw.prototype
         * @private
         * @description Initializes the drw instance
        **/
        _checkPath: function(d) {
            this.newPath(d);
            //if(!this._path) { this.newPath(d); }
        },

        /**
         * @function newPath
         * @memberof drw.prototype
         * @public
         * @description Starts a new path object fo subsequent drawing commands
        **/
        newPath: function(d) {
            d=d||'';
            var pathData = mkr.merge(this._drawData, {d:d}); 
            this._next = null;
            this._last = this._path = mkr.create('path', {attr:pathData}, this._svg);
        },

        /**
         * @function end
         * @memberof drw.prototype
         * @public
         * @description Ends the current path, optionally closing it with a 'Z' command
         * @param {Boolean} [close=false] - Whether to append a 'Z' command to the path
        **/
        end: function(close) {
            if(!this._path) return;

            var _path = this._path;
            this._path = null;
            if(close) {
                var path = _path.getAttribute('d').split(' ');
                path.push('Z');
                TweenMax.set(_path, {attr:{d:path.join(' ')}});
            }
        },
        
        //shapes

        /**
         * @function circle
         * @memberof drw.prototype
         * @public
         * @description draw a circle
         * @param {Number} x - Center of the circle along the x-axis
         * @param {Number} y - Center of the circle along the y-axis
         * @param {Number} r - Radius of the circle
         * @returns {SVGElement} an ellipse element
        **/
        circle: function(x, y, r) {
            return this.ellipse(x, y, r, r);
        },

        /**
         * @function ellipse
         * @memberof drw.prototype
         * @public
         * @description draw a ellipse
         * @param {Number} x - Center of the ellipse along the x-axis
         * @param {Number} y - Center of the ellipse along the y-axis
         * @param {Number} rx - Radius of the ellipse along the x-axis
         * @param {Number} ry - Radius of the ellipse along the y-axis
         * @returns {SVGElement} an ellipse element
        **/
        ellipse: function(x, y, rx, ry) {
            this.end();
            var data = mkr.merge(this._drawData, {cx:x, cy:y, rx:rx, ry:ry});
            
            this._last = mkr.create('ellipse', {attr:data}, this._svg);
            return this._last;
        },

        /**
         * @function triangle
         * @memberof drw.prototype
         * @private
         * @description draw a triangle
         * @returns {SVGElement} an polygon element
        **/
        triangle: function(){},

        /**
         * @function rect
         * @memberof drw.prototype
         * @public
         * @description draw a rectangle
         * @param {Number} x - Position of the rectangle along the x-axis
         * @param {Number} y - Position of the rectangle along the y-axis
         * @param {Number} w - Width of the rectangle
         * @param {Number} h - Height of the rectangle
         * @returns {SVGElement} an rect element
        **/
        rect: function(x, y, w, h){
            this.end();
            var data = mkr.merge(this._drawData, {x:x, y:y, width:w, height:h});
            
            this._last = mkr.create('rect', {attr:data}, this._svg);
            return this._last;
        },

        /**
         * @function polygon
         * @memberof drw.prototype
         * @public
         * @description draw a rectangle
         * @param {...Number} points - Points used to form the polygon
         * @returns {SVGElement} an polygon element
        **/
        polygon: function(points) {
            this.end();
            var pts = '';
            for(var i=0; i<points.length; i++) {
                pts = points[i]+(i%2==0 ? ',' : ' ');
            }
            console.log(pts);
            var data = mkr.merge(this._drawData, {points:pts});
            
            this._last = mkr.create('polygon', {attr:data}, this._svg);
            return this._last;
        },
        
        //drawing commands

        /**
         * @function _move
         * @memberof drw.prototype
         * @private
         * @description Move the drawing cursor to specific coordinates
         * @param {Number} x - Cursor position along the x-axis
         * @param {Number} y - Cursor position along the y-axis
         * @returns {TweenMax}
        **/
        _move: function(x, y){
            this._checkPath();
            var path = this._path.getAttribute('d').split(' ');
            path.push('M', x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
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
         * @returns {TweenMax}
        **/
        qdrtc: function(cx, cy, x, y){
            this._checkPath(['M',cx,cy].join(' '));
            var path = this._path.getAttribute('d').split(' ');
            path.push('Q', cx, cy, x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },

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
         * @returns {TweenMax}
        **/
        curve: function(cx1, cy1, cx2, cy2, x, y){
            this._checkPath(['M',cx1,cy1].join(' '));
            var path = this._path.getAttribute('d').split(' ');
            path.push('C', cx1, cy1, cx2, cy2, x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },

        /* pieTo: function(duration, start, length, vars, r, cx, cy, icx, icy, iR, iStart, iLength) {
            var sw = this.strokeWidth;
            var tweens = [TweenMax.set(this, {strokeWidth:r*1.5})];
            tweens = tweens.concat(this.arcTo(duration, start, length, vars, r, cx, cy, icx, icy, iR, iStart, iLength));
            tweens.push(TweenMax.set(this, {strokeWidth:sw}));
            return tweens
        }, */


        /**
         * @function arcTo
         * @memberof drw.prototype
         * @public
         * @description Animate an arc
         * @param {Number} duration - Duration of the animation in seconds
         * @param {Number} start - Final starting point of the arc along the circle in degrees
         * @param {Number} length - Final length of the arc in degrees from 0-359
         * @param {Number} vars - Options passed to the TweenMax instance which facilitates the animation
         * @param {Number} r - Final radius of the arc
         * @param {Number} cx - Final center of the arc along the x-axis
         * @param {Number} cy - Final center of the arc along the y-axis

         * @param {Number} icx - Initial center of the arc along the x-axis
         * @param {Number} icy - Initial center of the arc along the y-axis
         * @param {Number} iR - Initial radius of the arc
         * @param {Number} iStart - Initial starting point of the arc along the circle in degrees
         * @param {Number} iLength - Initial length of the arc in degrees from 0-359
         * @returns {TweenMax}
        **/
        arcTo: function(duration, start, length, vars, r, cx, cy, icx, icy, iR, iStart, iLength) {
            r = mkr.default(r, 50), iR = mkr.default(iR, r);
            start = mkr.default(start, 0), iStart = mkr.default(iStart, start);
            length = mkr.default(length, 360), iLength = mkr.default(iLength, 0);
            cx = mkr.default(cx, this._lastX); icx = mkr.default(icx, this._lastX);
            cy = mkr.default(cy, this._lastY); icy = mkr.default(icy, this._lastY);
            
            var end = start + length;
            var rad1 = (end-90)*(Math.PI/180.0);
            var rad2 = (start-90)*(Math.PI/180.0);
            
            var x2 = cx+(r*Math.cos(rad2));// - (r*Math.cos(rad1));
            var y2 = cy+(r*Math.sin(rad2));// + (r*Math.sin(rad1));
            
            end = iStart + iLength;
            var iRad1 = (end-90)*(Math.PI/180.0);
            var iRad2 = (iStart-90)*(Math.PI/180.0);
            
            cx-=(r*Math.cos(iRad1));
            cy-=(r*Math.sin(iRad1));
            
            icx-=(iR*Math.cos(iRad1));
            icy-=(iR*Math.sin(iRad1));
            
            this.arc(icy, icy, iR, iStart, iLength);
            
            var p = drw.calculateArc(cx, cy, r, start, length);
            this._lastX = p[1]; //update last point to coord of last point in arc
            this._lastY = p[2];
            
            var prefix = ['M'].join(' ')

            var tVars = {cx:cx, cy:cy, r:r, start:start, length:length};
            
            //grab current arc properties and tween this target to new props based on params
            var targetPath = this._last;
            var target = {cx:icx, cy:icy, r:iR, start:iStart, length:iLength};

            vars.onUpdate = function() {
                var newArc = drw.calculateArc(target.cx, target.cy, target.r, target.start, target.length);
                newArc.splice(0, 1);
                var d = prefix+' '+newArc.join(' ');
                TweenMax.set(targetPath, {attr:{d:d}});
            }
                    
            return [TweenMax.to(this._path, duration, vars), TweenMax.to(target, duration, tVars)];
        },

        /**
         * @function arc
         * @memberof drw.prototype
         * @public
         * @description Draw an arc
         * @param {Number} cx - Center of the arc along the x-axis
         * @param {Number} cy - Center of the arc along the y-axis
         * @param {Number} r - Radius of the arc
         * @param {Number} start - Starting point of the arc along the circle in degrees
         * @param {Number} length - Length of the arc in degrees from 0-359
         * @returns {TweenMax}
        **/
        arc: function(cx, cy, r, start, length) {
            this._checkPath();
            //var path = this._path.getAttribute('d').split(' ');
            var path = drw.calculateArc(cx, cy, r, start, length);
            this._path._mkrarcdata = {cx:cx, cy:cy, r:r, start:start, length:length, path:path};

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        
        /**
         * @function lineTo
         * @memberof drw.prototype
         * @public
         * @description Animate a line between two points
         * @param {Number} duration - Duration of the animation in seconds
         * @param {Number} x - End point of the line along the x-axis
         * @param {Number} y - End point of the line along the y-axis
         * @param {Number} vars - Options passed to the TweenMax instance which facilitates the animation
         * @param {Number} fromX - Origin point of the line along the x-axis
         * @param {Number} fromY - Origin point of the line along the y-axis
         * @returns {TweenMax}
        **/
        lineTo: function(duration, x, y, vars, fromX, fromY) {
            fromX = mkr.default(fromX, this._lastX);
            fromY = mkr.default(fromY, this._lastY);
            
            this._lastX = x;
            this._lastY = y;
            this.line(fromX, fromY);
            
            vars = vars || {}; vars.attr = vars.attr || {};
                vars.attr.d = ['M', fromX, fromY, 'L', x, y].join(' ');
            return TweenMax.to(this._path, duration, vars);
        },

        /**
         * @function line
         * @memberof drw.prototype
         * @public
         * @description Draw a line
         * @param {Number} x - End point of the line along the x-axis
         * @param {Number} y - End point of the line along the y-axis
         * @returns {TweenMax}
        **/
        line: function(x, y){
            this._checkPath(['M',x,y].join(' '));
            var path = this._next || this._path.getAttribute('d');
            path = path.split(' ');
            path.push('L', x, y);
            this._next = path = path.join(' ');
            return TweenMax.to(this._path, 0, {attr:{d:path}});
        }
    };
    
    /**
     * @function calcArcFrom
     * @memberof drw
     * @private
     * @static
     * @description Calculate an arc... is this even useful???
     * @param {Number} cx - Center of the arc along the x-axis
     * @param {Number} cy - Center of the arc along the y-axis
     * @param {Number} r - Radius of the arc
     * @param {Number} start - Starting point of the arc along the circle in degrees
     * @param {Number} length - Length of the arc in degrees from 0-359
     * @returns {Array} Array of characters representing an arc command
    **/
    drw.calcArcFrom = function(x, y, r, start, length) {
        if(length%360 == 0 && length != 0) length+= 359.999*(length/Math.abs(length));
        length = length%360;

        var end = start + length;
        var rad1 = (end-90)*(Math.PI/180.0);
        var rad2 = (start-90)*(Math.PI/180.0);
        //var x1 = cx+(r*Math.cos(rad1));
        //var y1 = cy+(r*Math.sin(rad1));
        var cx = x-(r*Math.cos(rad1));
        var cy = y-(r*Math.sin(rad1));
        var x2 = cx+(r*Math.cos(rad2));
        var y2 = cy+(r*Math.sin(rad2));
        var largeArcFlag = length <= 180 ? 0 : 1;
        var sweepFlag = 0;

        return ['M', x, y, 'A', r, r, 0, largeArcFlag, sweepFlag, x2, y2];
    };
    
    /**
     * @function calculateArc
     * @memberof drw
     * @static
     * @description Calculate an arc command with the given parameters
     * @param {Number} cx - Center of the arc along the x-axis
     * @param {Number} cy - Center of the arc along the y-axis
     * @param {Number} r - Radius of the arc
     * @param {Number} start - Starting point of the arc along the circle in degrees
     * @param {Number} length - Length of the arc in degrees from 0-359
     * @returns {Array} Array of characters representing an arc command
    **/
    drw.calculateArc = function(cx, cy, r, start, length) {
        if(length%360 == 0 && length != 0) length+= 359.999*(length/Math.abs(length));
        length = length%360;

        var end = start + length;
        var rad1 = (end-90)*(Math.PI/180.0);
        var rad2 = (start-90)*(Math.PI/180.0);
        var x1 = cx+(r*Math.cos(rad1));
        var y1 = cy+(r*Math.sin(rad1));
        var x2 = cx+(r*Math.cos(rad2));
        var y2 = cy+(r*Math.sin(rad2));
        var largeArcFlag = length <= 180 ? 0 : 1;
        var sweepFlag = 0;

        return ['M', x1, y1, 'A', r, r, 0, largeArcFlag, sweepFlag, x2, y2];
    };

    /**
     * @function splitPath
     * @memberof drw
     * @static
     * @private
     * @description Searches the given path for the first instance of the specified command and returns the results in an array
     * @param {String} path - The path to search
     * @param {String} cmd - The command to look for
     * @returns {Array} Array of containing the index of the path command, the command header, the full command, and the remaining path in that order.
    **/
    drw.splitPath = function(path, cmd) {
        cmd = cmd || 'A-Z';
        var n = path.search(new RegExp('['+cmd+'](?!.*['+cmd+'])', 'gi'));
        if(n < 0) return [n, '', path, ''];
        return [n, path[n], path.substr(0, n+1), path.substr(n+2)];
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
    * @alias drw.VERSION
    * @memberof drw
    * @static
    * @readonly
    * @type String
    * @description returns drw's version number
    **/
    Object.defineProperty(drw, 'VERSION', {
        get: function() {
          return '0.0.1';
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