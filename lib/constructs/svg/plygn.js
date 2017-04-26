/*!
 * VERSION: 0.0.1
 * DATE: 2017-03-31
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

    var plygn = function(options) {
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		
		var parent = this._parent = mkr.getDefault(options, 'parent', document.body);
		
		options = options || {};
		
		this._x = mkr.default(options.x, 0); 
		this._y = mkr.default(options.y, 0); 
		mkr.setDefault(options, 'svg', {});
		mkr.setDefault(options, 'css', {});
		var attr = mkr.setDefault(options, 'attr', {});
		var points = this._points = mkr.default(attr.points, ''); 
		mkr.setDefault(options.attr, 'id', id);
		
		//var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, parent)
		var poly = this._poly = mkr.create('polygon', {attr:options.attr, css:options.css}, parent)
		
		_instances[id] = this;
	};
	
	plygn.prototype = {
		get x() {
			return this._x;
		},
		set x(value) {
			this._x = value;
			this.update();
		},
		get y() {
			return this._y;
		},
		set y(value) {
			this._y = value;
			this.update();
		},
		get poly() {
			return this._poly;
		},
	};
	
	plygn.prototype.update = function() {
		var points = this._points.split(',');
		var newPts = '';
		for(var i=0; i<points.length; i++) {
			var xy = points[i].replace(/^ /g,'').split(' ');
			xy[0] = Number(xy[0]) + this._x;
			xy[1] = Number(xy[1]) + this._y;
			newPts += (i>0?', ':'')+xy.join(' ');
		}
		TweenMax.set(this._poly, {attr:{points:newPts}})
	};
	
	/**
    * @alias plygn.VERSION
    * @memberof plygn
    * @static
    * @readonly
    * @type String
    * @description returns plygn's version number
    **/
    Object.defineProperty(plygn, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return plygn; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = plygn;
    } else { //browser
        global[className] = plygn;
    }
})(mkr._constructs, 'plygn');