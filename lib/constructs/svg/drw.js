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

    var drw = function(options) {
        _count++;
        var id = this._id = options.id || className+'-'+_count;

        options = options || {};

        this._parent = mkr.setDefault(options, 'parent', document.body);
        this._svg = options.svgRoot || mkr.create('svg', {attr:{id:id, class:'drw-svg', width:'100%', height:'100%'}, css:{overflow:'visible'}}, this._parent);

        this._drawData = {};
        this._drawData.fill = mkr.default(options.fill, 'transparent');
        this._drawData.stroke = mkr.default(options.stroke, '#000000');
        this._drawData['stroke-width'] = mkr.default(options.strokeWidth, 3);
        
        this._init();
        _instances[id] = this;
    };
  
    drw.prototype = {
        get svg() {return this._svg;},
        get fill() {return this._drawData.fill;},
        set fill(value) {
            this._drawData.fill = value;
        },
        get stroke() {return this._drawData.stroke;},
        set stroke(value) {
            this._drawData.stroke = value;
        },
        get strokeWidth() {console.log('woot!');return this._drawData.strokeWidth;},
        set strokeWidth(value) {
            this._drawData['stroke-width'] = value;
        },

        _init: function() {
            //this._last = null;
            this._lastX = this._lastY = 0;
        },

        _checkPath: function(d) {
            this.newPath(d);
            if(!this._path) { this.newPath(d); }
        },
        newPath: function(d) {
            d=d||'';
            var pathData = mkr.merge(this._drawData, {d:d}); 
            this._next = null;
            this._last = this._path = mkr.create('path', {attr:pathData}, this._svg);
        },
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
        circle: function(x, y, r) {
            return this.ellipse(x, y, r, r);
        },
        ellipse: function(x, y, rx, ry) {
            this.end();
            var data = mkr.merge(this._drawData, {cx:x, cy:y, rx:rx, ry:ry});
            
            this._last = mkr.create('ellipse', {attr:data}, this._svg);
            return this._last;
        },
        triangle: function(){},
        rect: function(x, y, w, h){
            this.end();
            var data = mkr.merge(this._drawData, {x:x, y:y, width:w, height:h});
            
            this._last = mkr.create('rect', {attr:data}, this._svg);
            return this._last;
        },
        polygon: function(...points){
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
        
        //useless without single path drawing
        _move: function(x, y){
            this._checkPath();
            var path = this._path.getAttribute('d').split(' ');
            path.push('M', x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        qdrtc: function(cx, cy, x, y){
            this._checkPath(['M',cx,cy].join(' '));
            var path = this._path.getAttribute('d').split(' ');
            path.push('Q', cx, cy, x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
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
        arc: function(cx, cy, r, start, length) {
            this._checkPath();
            //var path = this._path.getAttribute('d').split(' ');
            var path = drw.calculateArc(cx, cy, r, start, length);
            this._path._mkrarcdata = {cx:cx, cy:cy, r:r, start:start, length:length, path:path};

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        
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
        line: function(x, y){
            this._checkPath(['M',x,y].join(' '));
            var path = this._next || this._path.getAttribute('d');
            path = path.split(' ');
            path.push('L', x, y);
            this._next = path = path.join(' ');
            return TweenMax.to(this._path, 0, {attr:{d:path}});
        }
    };
    
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
    drw.splitPath = function(path, cmd) {
        cmd = cmd || 'A-Z';
        var n = path.search(new RegExp('['+cmd+'](?!.*['+cmd+'])', 'gi'));
        if(n < 0) return [n, '', path, ''];
        return [n, path[n], path.substr(0, n+1), path.substr(n+2)];
    };
    drw.getInstance = function(id) {
        return _instances[id];
    };
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