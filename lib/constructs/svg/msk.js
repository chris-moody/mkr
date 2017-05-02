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

    /**
     * @class msk
     * @classdesc Harness the power of SVG masking with msk
     * @description Initializes a new msk instance.
     * @param {Object} options - Options use to customize the msk
     * @param {*} [options.parent=document.body] - Element which the msk's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {*=} options.svgRoot - svg element which to append the msk. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {Array=} options.masks - 1x2 Array of object descriptors used to create masking areas in the mask.
     * @param {Array=} options.targets - 1x2 Array of object descriptors used to create targets for the mask.
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {Object=} options.attr - Attributes to apply to the msk's mask element.
     * @param {Object=} options.css - CSS Properties to apply to the msk's mask element.

     * @requires {@link  mkr}
     * @returns {msk} A new msk instance.
     */
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
			var d = mkr.query('defs', s) || mkr.create('defs', {}, s)
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
	
	/**
	 * @name msk#svgRoot
	 * @public
	 * @readonly
	 * @type SVGElement
	 * @description The parent svg of this instance
	**/
	Object.defineProperty(mkr.prototype, 'svgRoot', {
	    get: function() {
	      return this._svg;
	    }
	});
	
	/**
     * @function addMask
     * @memberof msk.prototype
     * @public
     * @description Invokes mkr.create to add a new element to the mask
     * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
     * @returns {Element} The new element
    **/
	msk.prototype.addMask = function(type, options) {
		return mkr.create(type, options, this._mask);
	};
	
	/**
     * @function addTarget
     * @memberof msk.prototype
     * @public
     * @description Assigns a mask url to a new or existing element. Target element is added to the svgRoot
     * @param {*} typeOrTarget - An existing element, or the type of element to create.
	 * @param {Object=} options - A set of attributes and css properties applied to the target element
     * @returns {Element} The target element
    **/
	msk.prototype.addTarget = function(typeOrTarget, options) {
		options = options || {};
		mkr.setDefault(options, 'attr', {});
		options.attr.mask = 'url(#'+this._id+')';
		if(typeof typeOrTarget === 'string') {
			return mkr.create(typeOrTarget, options, this._svg);
		}
		else {
			mkr.add(typeOrTarget, this._svg)
			TweenMax.set(typeOrTarget, options);
		}
		return typeOrTarget;
	};
	
	/**
     * @function addTargets
     * @memberof msk.prototype
     * @public
     * @description Assigns a mask url to a set of existing elements. Target elements are added to the svgRoot
     * @param {*} targets - An array or selector string
	 * @param {Object=} options - A set of attributes and css properties applied to the target elements
     * @returns {Element} The target elements
    **/
	msk.prototype.addTargets = function(targets, options) {
		options = options || {};
		mkr.setDefault(options, 'css', {});
		options.attr.mask = 'url(#'+this._id+')';

		var t = []
		mkr.each(targets, function(el) {
			mkr.add(el, this._svg)
			TweenMax.set(el, options);
			t.push(el)
		});
		return t;
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