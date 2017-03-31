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

    var grdnt = function(options, parent) {
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		var parent = this._parent = mkr.getDefault(options, 'parent', document.body);
		
		options = options || {};
		var type = mkr.default(options.type, 'linear');
		var stops = mkr.default(options.stops, []); 
		mkr.setDefault(options, 'svg', {});
		mkr.setDefault(options, 'css', {});
		var attr = mkr.setDefault(options, 'attr', {});
		mkr.setDefault(options.attr, 'id', id);
		
		var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, parent)
			var d = mkr.query('defs', s) || mkr.create('defs', {}, s)
				var grad = this._grad = mkr.create(type+'Gradient', {attr:options.attr, css:options.css}, d)
					for(var i=0; i<stops.length; i++) {
						this.addStop(stops[i]);
					}
		
		_instances[id] = this;
	};
	
	grdnt.prototype.addStop = function(attr) {
		mkr.setDefault(attr, 'stop-color', attr.color)
		return mkr.create('stop', {attr:attr}, this._grad);
	};
	
	/**
    * @alias grdnt.VERSION
    * @memberof grdnt
    * @static
    * @readonly
    * @type String
    * @description returns grdnt's version number
    **/
    Object.defineProperty(grdnt, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return grdnt; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = grdnt;
    } else { //browser
        global[className] = grdnt;
    }
})(mkr._constructs, 'grdnt');