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

    var clp = function(options, parent) {
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		var parent = this._parent = mkr.getDefault(options, 'parent', document.body);
		
		options = options || {};
		var clips = mkr.default(options.clips, []); //objects
		var targets = mkr.default(options.targets, []); //
		mkr.setDefault(options, 'svg', {});
		mkr.setDefault(options, 'css', {});
		mkr.setDefault(options, 'attr', {});
		mkr.setDefault(options.attr, 'id', id);
		
		var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, parent)
			var d = mkr.query('defs', s) || mkr.create('defs', {}, s)
				var clip = this._clip = mkr.create('clipPath', {attr:options.attr, css:options.css}, d)
					for(var i=0; i<clips.length; i++) {
						var c = clips[i];
						if(c.length < 1) c.push('rect');
						if(c.length < 2) c.push({});
						this.addClip(c[0], c[1]);
					}
			for(var i=0; i<targets.length; i++) {
				var target = targets[i];
				if(target.length < 1) target.push('div');
				if(target.length < 2) target.push({});
				this.addTarget(target[0], target[1], s);
			}
		
		_instances[id] = this;
	};
	
	clp.prototype.addClip = function(type, options) {
		return mkr.create(type, options, this._clip);
	};
	
	clp.prototype.addTarget = function(typeOrTarget, options) {
		if(typeof typeOrTarget === 'string') {
			mkr.setDefault(options, 'css', {});
			options.css.clipPath = 'url(#'+this._id+')';

			return mkr.create(typeOrTarget, options, this._svg);
		}
		else {
			mkr.add(typeOrTarget, this._svg)
			TweenMax.set(typeOrTarget, {css:{clipPath:'url(#'+this._id+')'}});
		}
	};
	
	/**
    * @alias clp.VERSION
    * @memberof clp
    * @static
    * @readonly
    * @type String
    * @description returns clp's version number
    **/
    Object.defineProperty(clp, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return clp; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = clp;
    } else { //browser
        global[className] = clp;
    }
})(mkr._constructs, 'clp');