/*!
 * VERSION: 0.0.2
 * DATE: 2017-05-06
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
     * @class clp
     * @classdesc Harness the power of SVG clippaths with clp
     * @description Initializes a new clp instance.
     * @param {Object} options - Options used to customize the clp
     * @param {*} [options.parent=document.body] - Element which the clp's svgRoot is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {*=} options.svgRoot - svg element which to append the clp. Can be a selector string or element. It is auto-generated and added to options.parent when not provided
     * @param {Array=} options.clips - 1x2 Array of object descriptors used to create clipping areas in the clippath.
     * @param {Array=} options.targets - 1x2 Array of object descriptors used to create targets for the clippath.
     * @param {Object=} options.svg - Options used to create svgRoot when none is provided
     * @param {String} [options.svg.attr.class='clp-svg']
     * @param {String} [options.svg.css.overflow='visible']
     * @param {Object=} options.attr - Attributes to apply to the clp's clippath element.
     * @param {Object=} options.css - CSS Properties to apply to the clp's clippath element.

     * @requires {@link  mkr}
     * @returns {clp} A new clp instance.
    **/
    var clp = function(options) {
    	options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		this._parent = mkr.getDefault(options, 'parent', document.body);
		
		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options, 'svg', {});
		
		var clips = mkr.default(options.clips, []); //objects
		var targets = mkr.default(options.targets, []); //
		
        mkr.setDefault(options.svg, 'attr', {});
        mkr.setDefault(options.svg.attr, 'class', 'clp-svg');
        mkr.setDefault(options.svg, 'css', {});
        mkr.setDefault(options.svg.css, 'overflow', 'visible');
		
		var s = this._svg = options.svgRoot || mkr.create('svg', options.svg, this._parent)
			var d = mkr.query('defs', s) || mkr.create('defs', {}, s)
				var clip = this._clip = mkr.create('clipPath', {attr:options.attr, css:options.css}, d)
					for(var i=0; i<clips.length; i++) {
						var c = clips[i];
						if(c.length < 1) c.push('rect'); //default type rect
						if(c.length < 2) c.push({}); //default empty options
						this.addClip(c[0], c[1]);
					}
			for(var i=0; i<targets.length; i++) {
				var target = targets[i];
				if(target.length < 1) target.push('div'); //default type div
				if(target.length < 2) target.push({}); //default type empty options
				this.addTarget(target[0], target[1], s);
			}
		
		_instances[id] = this;
	};

	clp.prototype = {
        /**
         * @name clp#svg
         * @public
         * @readonly
         * @type SVGElement
         * @description The root svg element
        **/
        get svg() {return this._svg;},

        /**
         * @name clp#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The clippath element associated with this instance
        **/
        get el() {return this._clip;},

        /**
	     * @function addClip
	     * @memberof clp.prototype
	     * @public
	     * @description Invokes mkr.create to add a new element to the clippath
	     * @param {String} type - The type of element to create.
		 * @param {Object=} options - A set of attributes and css properties used to create the element
	     * @returns {Element} The new element
	    **/
		addClip: function(type, options) {
			return mkr.create(type, options, this._clip);
		},
		
		/**
	     * @function addTarget
	     * @memberof clp.prototype
	     * @public
	     * @description Assigns a clipppath url to a new or existing element. Target element is added to the svgRoot
	     * @param {*} typeOrTarget - An existing element, or the type of element to create.
		 * @param {Object=} options - A set of attributes and css properties applied to the target element
	     * @returns {Element} The target element
	    **/
		addTarget: function(typeOrTarget, options) {
			options = options || {};
			mkr.setDefault(options, 'css', {});
			options.css.clipPath = 'url(#'+this._id+')';
			if(typeof typeOrTarget === 'string') {
				return mkr.create(typeOrTarget, options, this._svg);
			}
			else {
				mkr.add(typeOrTarget, this._svg)
				TweenMax.set(typeOrTarget, options);
			}
			return typeOrTarget;
		},
		
		/**
	     * @function addTargets
	     * @memberof clp.prototype
	     * @public
	     * @description Assigns a clipppath url to a set of existing elements. Target elements are added to the svgRoot
	     * @param {*} targets - An array or selector string
		 * @param {Object=} options - A set of attributes and css properties applied to the target elements
	     * @returns {Element} The target elements
	    **/
		addTargets: function(targets, options) {
			options = options || {};
			mkr.setDefault(options, 'css', {});
			options.css.clipPath = 'url(#'+this._id+')';

			var t = []
			mkr.each(targets, function(el) {
				mkr.add(el, this._svg)
				TweenMax.set(el, options);
				t.push(el)
			});
			return t;
		},
    };

	/**
    * @function getInstance
    * @memberof clp
    * @static
    * @description returns the clp instance associated with the id
    * @param {String} id - The lookup id
    * @returns {clp} The associate clp, if it exists
    **/
    clp.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof clp
    * @static
    * @description returns the clp instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {clp} The associate clp, if it exists
    **/    
    clp.getElInstance = function(el) {
        return _instances[el.id];
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
          return '0.0.2';
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