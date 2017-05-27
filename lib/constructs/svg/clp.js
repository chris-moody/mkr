/*!
 * VERSION: 1.0.1
 * DATE: 2017-05-26
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
     * @param {*=} options.parent - Preferably an SVGElement. When an HTMLElement is provided, a new SVGElement is appended to it, which becomes the parent for the clp.
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {Array=} options.clips - 1x2 Array of object descriptors used to create clipping areas in the clippath.
     * @param {Array=} options.targets - 1x2 Array of object descriptors used to create targets for the clippath.
     * @param {Object=} options.attr - Attributes to apply to the clp's clippath element.
     * @param {Object=} options.css - CSS Properties to apply to the clp's clippath element.

     * @requires {@link  mkr}
     * @returns {clp} A new clp instance.
    **/
    var clp = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.setDefault(options, 'parent', mkr.default(mkr.query('svg'), mkr.create('svg', {css:{overflow:'visible'}})));
        var p = typeof this._parent == 'string' ? mkr.query(this._parent) : this._parent;
        if(!(p instanceof SVGElement)) {
            this._parent = mkr.query('svg', p) || mkr.create('svg', {css:{overflow:'visible'}}, this._parent);
        }
        
        mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options, 'css', {});
        
        var clips = mkr.default(options.clips, []); //objects
        var targets = mkr.default(options.targets, []); //
        
        var d = this._defs = mkr.query('defs', this._parent) || mkr.create('defs', {}, this._parent)
            var clip = this._clip = mkr.create('clipPath', {attr:options.attr, css:options.css}, d)
                for(var i=0; i<clips.length; i++) {
                    var c = clips[i];
                    if(c.length < 1) c.push('rect'); //default type rect
                    if(c.length < 2) c.push({}); //default empty options
                    this.create(c[0], c[1]);
                }
        for(var i=0; i<targets.length; i++) {
            var target = targets[i];
            if(target.length < 1) target.push('div'); //default type div
            if(target.length < 2) target.push({}); //default type empty options
            this.createTarget(target[0], target[1]);
        }
        
        _instances[id] = this;
    };

    clp.prototype = {
        /**
         * @name clp#el
         * @public
         * @readonly
         * @type SVGElement
         * @description The clippath element associated with this instance
        **/
        get el() {return this._clip;},

        /**
         * @name clp#id
         * @public
         * @readonly
         * @type String
         * @description The id of this instance's clippath element
        **/
        get id() {return this.el.id;},

        /**
         * @name clp#parent
         * @public
         * @readonly
         * @type SVGElement
         * @description The parent of the defs element
        **/
        get parent() {return this.defs.parentNode;},

        /**
         * @name clp#defs
         * @public
         * @readonly
         * @type SVGElement
         * @description The SVGDefsElement where the clippath is stored
        **/
        get defs() {return this._defs;},

        /**
         * @name clp#url
         * @public
         * @readonly
         * @type String
         * @description The url function string used to assign the clippath to an element
        **/
        get url() {return 'url("#'+this.id+'")';},

        /**
         * @name clp#clips
         * @public
         * @readonly
         * @type NodeList
         * @description A nodelist of the clipath's child elements
        **/
        get clips() {return mkr.queryAll('*', this.el)},

        /**
         * @function construct
         * @memberof clp.prototype
         * @public
         * @description Invokes mkr.construct to produce a new construct and add it to the clippath
         * @param {String} type - The type of construct to produce.
         * @param {Object=} options - A set of attributes and css properties used to produce the element
         * @param {int=} index - The insertion index, defaults to the number of clippath children. When negative, becomes the sum of itself and the length of clips
         * @returns {Element} The new element
        **/
        construct: function(type, options, index) {
            options.parent = this.el;
            return mkr.construct(type, options);
        },

        /**
         * @function create
         * @memberof clp.prototype
         * @public
         * @description Invokes mkr.create to produce a new element and add it to the clippath
         * @param {String} type - The type of element to produce. Checkout {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Usage_context MDN Clippath} for permitted content
         * @param {Object=} options - A set of attributes and css properties used to produce the element
         * @param {int=} index - The insertion index, defaults to the number of clippath children. When negative, becomes the sum of itself and the length of clips
         * @returns {Element} The new element
        **/
        create: function(type, options, index) {
            return mkr.create(type, options, this.el, index);
        },

        /**
         * @function add
         * @memberof clp.prototype
         * @public
         * @description Invokes mkr.add to add existing elements to the clippath
         * @param {*} target - A single element, array of elements, or a css selector string.
         * @param {int=} index - Insertion index of the target. Defaults to the number of clippath children.
         * @returns {*} The added element, or array of elements
        **/
        add: function(target, index) {
            return mkr.add(target, this.el, index);
        },
        
        /**
         * @function remove
         * @memberof clp.prototype
         * @public
         * @description Removes the element at the specified index from the clippath
         * @param {int} [index=-1] - The index of the target element. When negative, becomes the sum of itself and the length of clips
         * @returns {SVGElement} The element that was removed
        **/
        remove: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.clips.length + index;
            return mkr.remove(this.clips[index]);
        },

        /**
         * @function get
         * @memberof clp.prototype
         * @public
         * @description Returns the element at the specified index in the clippath
         * @param {int} [index=-1] - The index of the target element. When negative, becomes the sum of itself and the length of clips
         * @returns {SVGElement} The element at the specified index
        **/
        get: function(index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.clips.length + index;
            return this.clips[index];
        },

        /**
         * @function set
         * @memberof clp.prototype
         * @public
         * @description Updates the element at the specified index in the clippath
         * @param {Object} options - A set of attributes and css properties to set on the element
         * @param {int} [index=-1] - The index of the target element. When negative, becomes the sum of itself and the length of clips
         * @returns {SVGElement} The updated element
        **/
        set: function(options, index) {
            index = mkr.default(index, -1);
            if(index < 0) index = this.clips.length + index;
            var clip = this.get(index);
            TweenMax.set(clip, options);
            return clip;
        },

        /**
         * @function constructTarget
         * @memberof clp.prototype
         * @public
         * @description Invokes mkr.construct to produce a new construct, add it to the parent and set its css clippath set to this instances's url property.
         * @param {String} type - The type of construct to produce.
         * @param {Object=} options - A set of attributes and css properties to assign to the construct
         * @param {int=} index - The insertion index, defaults to the number of children on the parent. When negative, becomes the sum of itself and the number of children
         * @returns {*} The new construct
        **/
        constructTarget: function(type, options, index) {
            options = options || {};
            options.parent = this.parent;
            mkr.setDefault(options, 'css', {});            
            options.css.clipPath = this.url;
            return mkr.construct(type, options);
        },

        /**
         * @function createTarget
         * @memberof clp.prototype
         * @public
         * @description Invokes mkr.create to produce new element, add it to the root svg and set its css clippath set to this instances's url property.
         * @param {*} type - Type of element to produce.
         * @param {Object=} options - A set of attributes and css properties to assign to the element
         * @param {int=} index - The insertion index, defaults to the number of children on the parent. When negative, becomes the sum of itself and the number of children
         * @returns {Element} The target element
        **/
        createTarget: function(type, options, index) {
            options = options || {};
            mkr.setDefault(options, 'css', {});
            options.css.clipPath = this.url;
            return mkr.create(type, options, this.parent, index);
        },
        
        /**
         * @function assign
         * @memberof clp.prototype
         * @public
         * @description Assigns this instance's clippath url to the targeted elements.
         * @param {*} targets - An array or selector string
         * @param {Object=} options - A set of attributes and css properties applied to the target elements
         * @param {Boolean} [add=false] - Optionally add the targets to the parent.
         * @param {int=} index - The insertion index, defaults to the number of children on the parent. When negative, becomes the sum of itself and the number of children
         * @returns {Element} The target elements
        **/
        assign: function(targets, options, add, index) {
            options = options || {};
            mkr.setDefault(options, 'css', {});
            options.css.clipPath = this.url;

            var t = [];
            add = mkr.default(add, false);
            mkr.each(targets, function(el) {
                if(add) mkr.add(el, this.parent, index)
                TweenMax.set(el, options);
                t.push(el)
            }, this);
            return t;
        },

        /**
         * @function unassign
         * @memberof clp.prototype
         * @public
         * @description Removes the clippath assignment from the target elements.
         * @param {*} targets - An array or selector string
         * @param {Boolean} [remove=false] - Optionally remove the targets from the parent.
         * @returns {Element} The target elements
        **/
        unassign: function(targets, remove) {
            remove = mkr.default(remove, false);

            var t = []
            mkr.each(targets, function(el) {
                TweenMax.set(el, {clearProps:'clipPath'});
                if(remove) mkr.remove(el);
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
          return '1.0.1';
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