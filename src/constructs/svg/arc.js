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

    var arc = function(options) {
        _count++;
        var id = this._id = options.id || className+'-'+_count;

        options = options || {};

        mkr.setDefault(options, 'path', {});
        mkr.setDefault(options.path, 'attr', {});
        mkr.setDefault(options.path.attr, 'id', id+'-path');
        mkr.setDefault(options.path.attr, 'class', 'path');
        mkr.setDefault(options.path.attr, 'fill', 'transparent');
        mkr.setDefault(options.path.attr, 'stroke', '#f37121');
        mkr.setDefault(options.path.attr, 'stroke-width', 15);

        mkr.setDefault(options, 'outline', {});
        mkr.setDefault(options.outline, 'attr', {});
        mkr.setDefault(options.outline.attr, 'id', id+'-outline');
        mkr.setDefault(options.outline.attr, 'class', 'outline');
        mkr.setDefault(options.outline.attr, 'fill', 'transparent');
        mkr.setDefault(options.outline.attr, 'stroke', 'rgba(255,255,255,.2)');
        mkr.setDefault(options.outline.attr, 'stroke-width', options.path.attr['stroke-width']);

        this._radius = mkr.setDefault(options, 'radius', 50);
        var d = 2*options.radius;

        this._parent = mkr.setDefault(options, 'parent', document.body);
        this._svg = options.svg || mkr.create('svg', {attr:{id:id, class:'arc-svg', width:d, height:d}, css:{overflow:'visible'}}, this._parent);

        this._start = mkr.setDefault(options, 'start', 0);
        
        this._length = arc.normalize(mkr.setDefault(options, 'length', 0));
        this._end = this._start + this._length;

        this._cx = mkr.setDefault(options, 'cx', this._radius);
        this._cy = mkr.setDefault(options, 'cy', this._radius);
        this._rotation = mkr.setDefault(options, 'rotation', 0);
        this._sweepFlag = mkr.setDefault(options, 'sweepFlag', 0);

        mkr.setDefault(options.path.attr, 'd', this.path);    
        mkr.setDefault(options.outline.attr, 'd', this.outline);    

        //this._outline = mkr.create('path', options.outline, this._svg);
        this._path = mkr.create('path', options.path, this._svg);   

        _instances[id] = this;
    };
  
    arc.prototype = {
        get cx() {return this._cx;},
        set cx(value) {
            this._cx = value;
            this.update();
        },
        get cy() {return this._cy;},
        set cy(value) {
            this._cy = value;
            this.update();
        },
        get radius() {return this._radius;},
        set radius(value) {
            this._radius = value;
            this.update();
        },
        get end() {return this._start+this._length;},
        set end(value) {
            this._end = value;
            this.length = value-this._start;
        },
        get start() {return this._start;},
        set start(value) {
            this._start = value;
            this.update();
        },
        get length() {return this._length;},
        set length(value) {
            this._length = value;
            this.update();
        },
        get rotation() {return this._rotation;},
        set rotation(value) {
            this._rotation = value;
            this.update();
        },
        get largeArcFlag() {return this._largeArcFlag;},
        get sweepFlag() {return this._sweepFlag;},
        set sweepFlag(value) {
            this._sweepFlag = value;
            this.update();
        },
        get path() {
            return this.calculatePath(this.cx, this.cy, this.radius, this.start, this.length);
        },
        get outline() {
            return this.calculatePath(this.cx, this.cy, this.radius, 0, 360);
        },
        calculatePath: function(cx, cy, r, start, length) {
            length = arc.normalize(length);
            if(length < 0) length+= 360;
            var end = start + length;
            
            var rad1 = (end-90)*(Math.PI/180.0);
            var rad2 = (start-90)*(Math.PI/180.0);
            var x1 = cx+(r*Math.cos(rad1));
            var y1 = cy+(r*Math.sin(rad1));
            var x2 = cx+(r*Math.cos(rad2));
            var y2 = cy+(r*Math.sin(rad2));
            var largeArcFlag = length <= 180 ? 0 : 1;
            var sweepFlag = this.sweepFlag;

            return [
                "M", x1, y1, 
                "A", r, r, 0, largeArcFlag, sweepFlag, x2, y2
            ].join(" ");
        },
        update: function(draw) {
            if(mkr.default(draw, true))
            this.draw();
        },
        draw: function() {
            TweenMax.set(this._path, {attr:{d:this.path}});
            //TweenMax.set(this._outline, {attr:{d:this.outline}});
        }
    };
    arc.normalize = function(value) {
        if(value%360 == 0 && value != 0) value+= 359.999*(value/Math.abs(value));
        return value%360;
    };
    arc.getInstance = function(id) {
        return _instances[id];
    };
    arc.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias mkr.VERSION
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