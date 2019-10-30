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

    var scrollW, scrollH;
    mkr.on(window, 'load', function() {
        //create 2 test divs
        //one non-scrolling, f
        var d1 = mkr.create('div', {css:{width:100, height:100, alpha:0, background:'#00ffff'}}, document.body);
        //one scrolling
        var d2 = mkr.create('div', {css:{width:100, height:100, alpha:0, background:'#00ffff', overflowX:'scroll', overflowY:'scroll'}}, document.body);
        //scrollbar height/width is the difference between the two divs' clientHeights/Widths
        scrollH = d1.clientHeight - d2.clientHeight;
        scrollW = d1.clientWidth - d2.clientWidth;
        //remove the test divs
        mkr.remove([d1, d2]);
    });

    /**
     * @class scrllmsk
     * @classdesc Simple container div for masking away native scrollbars
     * @description Initializes a new scrllmsk instance.
     * @param {Object} options - Options used to customize the scrllmsk
     * @param {*} [options.parent=document.body] - Element which the scrllmsk's container element is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     
     * @param {Object=} options.attr - Attributes to apply to the scrllmsk's container element.
     * @param {Object=} options.css - CSS Properties to apply to the scrllmsk's container element

     * @param {Object=} options.content - Options used to create the scrllmsk's content element
     * @param {String} [options.content.attr.class='scrllmsk-content']

     * @requires {@link  mkr}
     * @returns {msk} A new scrllmsk instance.
    **/
    var scrllmsk = function(options) {
		options = options || {};
		_count++;
        var id = this._id = options.id || className+'-'+_count;
		this._parent = mkr.getDefault(options, 'parent', document.body);
		
        mkr.setDefault(options, 'text', '');
        mkr.setDefault(options, 'contentId', undefined);
        mkr.setDefault(options, 'contentClass', undefined);
        mkr.setDefault(options, 'wrapperId', undefined);
        mkr.setDefault(options, 'wrapperClass', undefined);
        mkr.setDefault(options, 'x', undefined);
        mkr.setDefault(options, 'y', undefined);
        mkr.setDefault(options, 'top', undefined);
        mkr.setDefault(options, 'left', undefined);
        mkr.setDefault(options, 'width', '100%');
        mkr.setDefault(options, 'height', '100%');

		mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options.attr, 'class', 'mkr-'+className);
        mkr.setDefault(options, 'css', {});
        mkr.setDefault(options.css, 'overflow', 'hidden');
        mkr.setDefault(options.css, 'x', options.x);
        mkr.setDefault(options.css, 'y', options.y);
        mkr.setDefault(options.css, 'top', options.top);
        mkr.setDefault(options.css, 'left', options.left);
        mkr.setDefault(options.css, 'width', options.width);
        mkr.setDefault(options.css, 'height', options.height);

        mkr.setDefault(options, 'wrapper', {});
        mkr.setDefault(options.wrapper, 'attr', {});
        mkr.setDefault(options.wrapper.attr, 'id', options.wrapperId);
        let classes = ['scrllmsk-wrapper'];
        if(options.wrapperClass) classes.push(options.wrapperClass);
        if(options.wrapper.attr.class) classes.push(options.wrapper.attr.class);
        options.wrapper.attr.class = classes.join(' ');
        mkr.setDefault(options.wrapper, 'css', {});
        mkr.setDefault(options.wrapper.css, 'overflow', 'scroll');
        mkr.setDefault(options.wrapper.css, 'width', 'calc(100% + '+scrollW+'px)');
        mkr.setDefault(options.wrapper.css, 'height', 'calc(100% + '+scrollH+'px)');

        mkr.setDefault(options, 'content', {});
        mkr.setDefault(options.content, 'attr', {});

        mkr.setDefault(options.content.attr, 'id', options.contentId);
        classes = ['scrllmsk-content'];
        if(options.contentClass) classes.push(options.contentClass);
        if(options.content.attr.class) classes.push(options.content.attr.class);
        options.content.attr.class = classes.join(' ');
        mkr.setDefault(options.content, 'css', {});
        mkr.setDefault(options.content.css, 'overflow', 'visible');
        mkr.setDefault(options.content.css, 'width', 'auto');
        mkr.setDefault(options.content.css, 'height', 'auto');
        mkr.setDefault(options.content, 'text', options.text);
		
		this._container = mkr.create('div', {attr:options.attr, css:options.css}, this._parent);
        this._wrapper = mkr.create('div', options.wrapper, this._container);
		this._content = mkr.create('div', options.content, this._wrapper);
		_instances[id] = this;
	};
	
	scrllmsk.prototype = {

        /**
         * @name scrllmsk#container
         * @public
         * @readonly
         * @type HTMLElement
         * @description The container element
        **/
        get container() {return this._container;},

        /**
         * @name scrllmsk#content
         * @public
         * @readonly
         * @type HTMLElement
         * @description The content element
        **/
        get content() {return this._content;},
    };

	/**
    * @alias scrllmsk.scrollH
    * @memberof scrllmsk
    * @static
    * @readonly
    * @type String
    * @description returns the height of the browser's scrollbar
    **/
    Object.defineProperty(scrllmsk, 'scrollH', {
        get: function() {
          return scrollH;
        }
    });

	/**
    * @alias scrllmsk.scrollW
    * @memberof scrllmsk
    * @static
    * @readonly
    * @type String
    * @description returns the width of the browser's scrollbar
    **/
    Object.defineProperty(scrllmsk, 'scrollW', {
        get: function() {
          return scrollW;
        }
    });

    /**
    * @function getInstance
    * @memberof scrllmsk
    * @static
    * @description returns the scrllmsk instance associated with the id
    * @param {String} id - The lookup id
    * @returns {scrllmsk} The associate scrllmsk, if it exists
    **/
    scrllmsk.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof scrllmsk
    * @static
    * @description returns the scrllmsk instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {scrllmsk} The associate scrllmsk, if it exists
    **/    
    scrllmsk.getElInstance = function(el) {
        return _instances[el.id];
    };

	/**
    * @alias scrllmsk.VERSION
    * @memberof scrllmsk
    * @static
    * @readonly
    * @type String
    * @description returns scrllmsk's version number
    **/
    Object.defineProperty(scrllmsk, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return scrllmsk; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = scrllmsk;
    } else { //browser
        global[className] = scrllmsk;
    }
})(mkr._constructs, 'scrllmsk');