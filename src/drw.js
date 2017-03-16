console.log(mkr.VERSION);
(function(global, className) {
    var _instances = {};
    var _count=0;

    var drw = function(options) {
        var id = className+'-'+_count;
        _count++;

        options = options || {};

        this._parent = mkr.setDefault(options, 'parent', document.body);
        this._svg = options.svg || mkr.create('svg', {attr:{id:id, class:'drw-svg', width:d, height:d}, css:{overflow:'visible'}}, this._parent);

        this._drawData = {};
        this._drawData.fill = mkr.default(options.fill, 'transparent');
        this._drawData.stroke = mkr.default(options.stroke, '#000000');
        this._drawData.strokeWeight = mkr.default(options.strokeWeight, 1);
        
        _init();
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
        get strokeWeight() {return this._drawData.strokeWeight;},
        set strokeWeight(value) {
            this._drawData.strokeWeight = value;
        },

        _init: function() {

        },

        _checkPath: function() {
            if(!this._path) { this.newPath(); }
        },
        newPath: function() {
            this._path = mkr.create('path', {attr:this._drawData});
        },
        end: function(close) {
            if(!this._path) return;

            var _path = this._path;
            this._path = null;
            if(close) {
                var path = _path.getAttribute(d).split(' ');
                path.push('Z');
                TweenMax.set(_path, {attr:{d:path.join(' ')}});
            }
        },

        move: function(x, y){
            this._checkPath();
            var path = this._path.getAttribute(d).split(' ');
            path.push('M', x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        line: function(x, y){
            this._checkPath();
            var path = this._path.getAttribute(d).split(' ');
            path.push('L', x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        qdrtc: function(cx, cx, x, y){
            this._checkPath();
            var path = this._path.getAttribute(d).split(' ');
            path.push('Q', cx, cy, x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        curve: function(cx1, cy1, cx2, cy2, x, y){
            this._checkPath();
            var path = this._path.getAttribute(d).split(' ');
            path.push('C', cx1, cy1, cx2, cy2, x, y);

            return TweenMax.set(this._path, {attr:{d:path.join(' ')}});
        },
        arc: function(){},
        circle: function(x, y, r){
            this.end();
            var data = mkr.merge(this._drawData, {cx:x, cy:y, rx:r, ry:r});
            return mkr.create('ellipse', {attr:data});
        },
        ellipse: function(x, y, rx, ry){
            this.end();
            var data = mkr.merge(this._drawData, {cx:x, cy:y, rx:rx, ry:ry});
            return mkr.create('ellipse', {attr:data});
        },
        triangle: function(){},
        rect: function(x, y, w, h){
            this.end();
            var data = mkr.merge(this._drawData, {x:x, y:y, width:w, height:h});
            return mkr.create('rect', {attr:data});
        },
        polygon: function(...points){
            this.end();
            var points = Array.from(arguments);
            var pts = '';
            for(var i=0; i<points.length; i++) {
                pts = points[i]+(i%2==0 ? ',' : ' ');
            }
            console.log(pts);
            var data = mkr.merge(this._drawData, {points:pts});
            return mkr.create('polygon', {attr:data});
        },

        update: function() {
           // if(mkr.default(draw, true))
            //this.draw();
        },
        draw: function() {

        },
    };

    drw.getInstance = function(id) {
        return _instances[id];
    };
    drw.getElInstance = function(el) {
        return _instances[el.id];
    };

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return drw; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = drw;
    } else { //browser
        global[className] = drw;
    }
})(mkr.constructs, 'drw');