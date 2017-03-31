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

    var msk = function(options) {
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		var parent = this._parent = mkr.getDefault(options, 'parent', document.body);
		
		options = options || {};
		var masks = mkr.default(options.masks, []); //objects
		var targets = mkr.default(options.targets, []); //
		mkr.setDefault(options, 'svg', {});
		mkr.setDefault(options, 'css', {});
		mkr.setDefault(options, 'attr', {});
		mkr.setDefault(options.attr, 'id', id);
		
		var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, parent)
			var d = mkr.create('defs', {}, s)
				var mask = this._mask = mkr.create('mask', {attr:options.attr, css:options.css}, d)
					for(var i=0; i<masks.length; i++) {
						var m = masks[i];
						if(m.length < 1) m.push('rect');
						if(m.length < 2) m.push({});
						this.addMask(m[0], m[1]);
					}
			for(var i=0; i<targets.length; i++) {
				var target = targets[i];
				if(target.length < 1) target.push('div');
				if(target.length < 2) target.push({});
				
				this.addTarget(target[0], target[1], s);
			}
		
		_instances[id] = this;
	};
	
	msk.prototype.addMask = function(type, options) {
		return mkr.create(type, options, this._mask);
	};
	
	msk.prototype.addTarget = function(type, options) {
		mkr.setDefault(options, 'attr', {});
		options.attr.mask = 'url(#'+this._id+')';
		
		return mkr.create(type, options, this._svg);
	};
	
	/**
    * @alias msk.VERSION
    * @memberof msk
    * @static
    * @readonly
    * @type String
    * @description returns msk's version number
    **/
    Object.defineProperty(msk, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return msk; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = msk;
    } else { //browser
        global[className] = msk;
    }
})(mkr._constructs, 'msk');