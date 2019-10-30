/*!
 * VERSION: 0.0.3
 * DATE: 2019-10-29
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
     * @class scrllr
     * @classdesc Simple container div for masking away native scrollbars
     * @description Initializes a new scrllr instance.
     * @param {Object} options - Options used to customize the scrllr
     * @param {*} [options.parent=document.body] - Element which the scrllr's container element is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     
     * @param {Object=} options.attr - Attributes to apply to the scrllr's container element.
     * @param {Object=} options.css - CSS Properties to apply to the scrllr's container element
     
     * @param {Object=} options.scrllbr - Options used to create the scrllr's scrllbr instance
     * @param {Object=} options.scrllmsk - Options used to create the scrllr's scrllmsk instance

     * @requires {@link  mkr}
     * @returns {msk} A new scrllr instance.
    **/
    var scrllr = function(options) {
		options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		this._parent = mkr.getDefault(options, 'parent', document.body);
		
        mkr.setDefault(options, 'text', '');
        mkr.setDefault(options, 'content', undefined);
        mkr.setDefault(options, 'contentId', undefined);
        mkr.setDefault(options, 'contentClass', undefined);
        mkr.setDefault(options, 'wrapper', undefined);
        mkr.setDefault(options, 'wrapperId', undefined);
        mkr.setDefault(options, 'wrapperClass', undefined);
        mkr.setDefault(options, 'x', undefined);
        mkr.setDefault(options, 'y', undefined);
        mkr.setDefault(options, 'top', undefined);
        mkr.setDefault(options, 'left', undefined);
        mkr.setDefault(options, 'width', undefined);
        mkr.setDefault(options, 'height', undefined);

		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options.attr, 'class', 'mkr-'+className);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options.css, 'x', options.x);
        mkr.setDefault(options.css, 'y', options.y);
        mkr.setDefault(options.css, 'top', options.top);
        mkr.setDefault(options.css, 'left', options.left);
        mkr.setDefault(options.css, 'width', options.width);
        mkr.setDefault(options.css, 'height', options.height);
		
        mkr.setDefault(options, 'scrllbr', {});
        mkr.setDefault(options.scrllbr, 'attr', {});
        mkr.setDefault(options.scrllbr.attr, 'id', id+'-scrllbr');
        mkr.setDefault(options, 'scrllmsk', {});
        mkr.setDefault(options.scrllmsk, 'attr', {});
        mkr.setDefault(options.scrllmsk.attr, 'id', id+'-scrllmsk');
        mkr.setDefault(options.scrllmsk, 'text', options.text);
        mkr.setDefault(options.scrllmsk, 'content', options.content);
        mkr.setDefault(options.scrllmsk, 'contentId', options.contentId);
        mkr.setDefault(options.scrllmsk, 'contentClass', options.contentClass);
        mkr.setDefault(options.scrllmsk, 'wrapper', options.wrapper);
        mkr.setDefault(options.scrllmsk, 'wrapperId', options.wrapperId);
        mkr.setDefault(options.scrllmsk, 'wrapperClass', options.wrapperClass);

		this._container = mkr.create('div', {attr:options.attr, css:options.css}, this._parent);
		this._msk = mkr.construct('scrllmsk', options.scrllmsk, this._container);
        this._br = mkr.construct('scrllbr', options.scrllbr, this._container);
		_instances[id] = this;
	};
	
	scrllr.prototype = {

        /**
         * @name scrllr#container
         * @public
         * @readonly
         * @type scrllmsk
         * @description The container element
        **/
        get container() {return this._container;},

        /**
         * @name scrllr#msk
         * @public
         * @readonly
         * @type scrllmsk
         * @description The scrllmsk element
        **/
        get msk() {return this._msk;},

        /**
         * @name scrllr#br
         * @public
         * @readonly
         * @type scrllbr
         * @description The scrllbr element
        **/
        get br() {return this._br;},
    };

    /**
    * @function getInstance
    * @memberof scrllr
    * @static
    * @description returns the scrllr instance associated with the id
    * @param {String} id - The lookup id
    * @returns {scrllr} The associate scrllr, if it exists
    **/
    scrllr.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof scrllr
    * @static
    * @description returns the scrllr instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {scrllr} The associate scrllr, if it exists
    **/    
    scrllr.getElInstance = function(el) {
        return _instances[el.id];
    };

	/**
    * @alias scrllr.VERSION
    * @memberof scrllr
    * @static
    * @readonly
    * @type String
    * @description returns scrllr's version number
    **/
    Object.defineProperty(scrllr, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return scrllr; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = scrllr;
    } else { //browser
        global[className] = scrllr;
    }
})(mkr._constructs, 'scrllr');