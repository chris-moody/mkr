/*!
 * VERSION: 0.0.1
 * DATE: 2019-10-28
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2019 Christopher C. Moody
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
     * @class scrllbr
     * @classdesc Cross-browser custom scrollbar
     * @description Initializes a new scrllbr instance.
     * @param {Object} options - Options used to customize the scrllbr
     * @param {*} [options.parent=document.body] - Element which the scrllbr's contianer element is appended
     * @param {String=} options.id - The id of the instance. Auto-generated when not provided
     * @param {String} [options.type=scrllbr.VERTICAL] - The type of scrllbr to create. Can be scrllbr.VERTICAL, scrllbr.HORIZONTAL or scrllbr.OMNI.
     
     * @param {Object=} options.attr - Attributes to apply to the scrllbr's container element.
     * @param {Object=} options.css - CSS Properties to apply to the scrllbr's container element

     * @param {Object=} options.content - Options used to create the scrllbr's content element
     * @param {String} [options.content.attr.class='scrllbr-content']

     * @param {Object=} options.track - Options used to create the scrollbar track
     * @param {String} [options.track.attr.class='scrllbr-track']

     * @param {Object=} options.thumb - Options used to create scrollbar thumb
     * @param {String} [options.thumb.attr.class='scrllbr-thumb']

     * @requires {@link  scrllbr}
     * @returns {msk} A new scrllbr instance.
    **/
    var scrllbr = function(options) {
        options = options || {};
        _count++;
        var id = this._id = options.id || className+'-'+_count;
        this._parent = mkr.getDefault(options, 'parent', document.body);

        mkr.setDefault(options, 'attr', {});
        mkr.setDefault(options.attr, 'id', id);
        mkr.setDefault(options.attr, 'class', 'mkr-'+className);
        mkr.setDefault(options, 'css', {});

        mkr.setDefault(options, 'track', {});
        mkr.setDefault(options.track, 'attr', {});
        mkr.setDefault(options.track.attr, 'class', 'track');
        mkr.setDefault(options.track, 'css', {});

        mkr.setDefault(options, 'thumb', {});
        mkr.setDefault(options.thumb, 'attr', {});
        mkr.setDefault(options.thumb.attr, 'class', 'thumb');
        mkr.setDefault(options.thumb, 'css', {});
        mkr.setDefault(options.thumb.css, 'height', 100);
        
        this._container = mkr.create('div', {attr:options.attr, css:options.css}, this._parent);
        this._track = mkr.create('div', options.track, this._container);
        this._thumb = mkr.create('div', options.thumb, this._container);
        this._ux = mkr.setDefault(options, 'ux', 'click');
        this._observer = new MutationObserver(this.onMutate.bind(this));
        this._scrolling = false;
        this._scroll = 0;
        this._range = 0;
        this._touchStart = {x:0, y:0};

        this.type = mkr.setDefault(options, 'type', scrllbr.VERTICAL);
        this.target =  mkr.setDefault(options, 'target', null);

        _instances[id] = this;
    };
    
    scrllbr.prototype = {

        /**
         * @name scrllbr#el
         * @public
         * @readonly
         * @type Element
         * @description The container element associated with this instance
        **/
        get el() {return this._container;},

        /**
         * @name scrllbr#range
         * @public
         * @readonly
         * @type Number
         * @description The range of the scrllr thumb in pixels
        **/
        get range() { return this.type === scrllbr.VERTICAL ?
            this._track.clientHeight - this._thumb.clientHeight :
            this._track.clientWidth - this._thumb.clientWidth;
         },
        
        /**
         * @name scrllbr#scroll
         * @public
         * @type Number
         * @description The current scroll position as a number between 0 and 1
        **/
        get scroll() { return this._scroll; },
        set scroll(value) {
            this._scroll = Math.min(1, Math.max(0, value));
            if(this.type === scrllbr.VERTICAL) TweenMax.set(this._thumb, {y:this._scroll*this.range});
            else TweenMax.set(this._thumb, {x:this._scroll*this.range});
        },

        /**
         * @name scrllbr#target
         * @public
         * @type Element
         * @description The element to which the scrllbr is attached
        **/
        get target() {return this._target;},
        set target(value) {
            if(this._target) this.removeListeners();

            this._target = value;
            if(!this._target) return;
            this.addListeners();
            mkr.once(window, 'load', this.refresh, this);
        },

        /**
         * @name scrllbr#type
         * @public
         * @readonly
         * @type String
         * @description Indicates the orientation of the scrllbr instance
        **/
        get type() {return this._type;},
        set type(value) {
            this._type = value;
            if(this._type === scrllbr.VERTICAL) TweenMax.set(this._container, {className:'-=horizontal'});
            else TweenMax.set(this._container, {className:'+=horizontal'});
        },

        /**
         * @function addListeners
         * @memberof scrllbr.prototype
         * @public
         * @description Attach scroll listeners to the target
        **/
        addListeners: function() {
            //this._observer.observe(this._target, {childList:true, subtree:true});
            mkr.on(this._target, 'scroll', this.onScroll, this);

            if(this._ux.indexOf('touch') < 0) {
                mkr.on(this._thumb, 'mousedown', this.startScroll, this);
                mkr.on(this._track, 'mousedown', this.trackScroll, this);
                return;
            }

            mkr.on(this._thumb, 'touchstart', this.startScroll, this);
            mkr.on(this._track, 'touchstart', this.trackScroll, this);
        },

        /**
         * @function removeListeners
         * @memberof scrllbr.prototype
         * @public
         * @description Remove scroll listeners to the target
        **/
        removeListeners: function() {
            this._scrolling = false;
            //this._observer.disconnect();
            mkr.off(this._target, 'scroll', this.onScroll, this);

            if(this._ux.indexOf('touch') < 0) {
                mkr.off(this._thumb, 'mousedown', this.startScroll, this);
                mkr.off(this._track, 'mousedown', this.trackScroll, this);
                mkr.off(document.body, 'mouseup', this.stopScroll, this);
                mkr.off(document.body, 'mouseleave', this.stopScroll, this);
                mkr.off(document.body, 'mousemove', this.updateScroll, this);
                return;
            }

            mkr.off(this._thumb, 'touchstart', this.startScroll, this);
            mkr.off(this._track, 'touchstart', this.trackScroll, this);
            mkr.off(document.body, 'touchend', this.stopScroll, this);
            mkr.off(document.body, 'touchcancel', this.stopScroll, this);
            mkr.off(document.body, 'touchmove', this.updateScroll, this);
        },

        /**
         * @function trackScroll
         * @memberof scrllbr.prototype
         * @public
         * @description Handle track interactions
        **/
        trackScroll: function(e) {
            var delta, dir, sLen, eX, eY, target = this._target,
                x=0, y=0;
            var t = this._container;
            while(t.offsetParent) {
                x += t.offsetLeft;
                y += t.offsetTop;
                t = t.offsetParent;
            }


            if(e.type === 'touchstart') {
                var touch = e.touches[0];
                eX = touch.clientX;
                eY = touch.clientY;
            }
            else {
                eX = e.clientX;
                eY = e.clientY;
            }

            if(this.type === scrllbr.VERTICAL) {
                delta = (eY-y)/this.range - this.scroll;
                dir = Math.abs(delta)/delta;
                sLen = target.scrollHeight - target.clientHeight;
                delta = dir*0.95*(target.clientHeight/sLen);
            }
            else {
                delta = (eX-x)/this.range - this.scroll;
                dir = Math.abs(delta)/delta;
                sLen = target.scrollWidth - target.clientWidth;
                delta = dir*0.95*(target.clientWidth/sLen);
            }

            this.scroll = this._scroll + delta;
            TweenMax.set(this._target, {scrollTo:(this.scroll)*sLen});

            this.startScroll(e);
        },

        /**
         * @function startScroll
         * @memberof scrllbr.prototype
         * @public
         * @description Add listeners to enable manual scrolling
        **/
        startScroll: function(e) {
            this._scrolling = true;
            //console.log('start scroll');
            if(e.type === 'touchstart') {
                var touch = e.touches[0];
                this._touchStart = { 
                    x:touch.clientX,
                    y:touch.clientY
                };
            }

            if(this._ux.indexOf('touch') < 0) {
                mkr.on(document.body, 'mouseup', this.stopScroll, this);
                mkr.on(document.body, 'mouseleave', this.stopScroll, this);
                mkr.on(document.body, 'mousemove', this.updateScroll, this);
                return;
            }

            mkr.on(document.body, 'touchend', this.stopScroll, this);
            mkr.on(document.body, 'touchcancel', this.stopScroll, this);
            mkr.on(document.body, 'touchmove', this.updateScroll, this);
        },

        /**
         * @function stopScroll
         * @memberof scrllbr.prototype
         * @public
         * @description Remove manuak scroll listeners
        **/
        stopScroll: function(e) {
            this._scrolling = false;
            this._touchStart = {x:0, y:0};
            //console.log('stop scroll');
            if(this._ux.indexOf('touch') < 0) {
                mkr.off(document.body, 'mouseup', this.stopScroll, this);
                mkr.off(document.body, 'mouseleave', this.stopScroll, this);
                mkr.off(document.body, 'mousemove', this.updateScroll, this);
                return;
            }

            mkr.off(document.body, 'touchend', this.stopScroll, this);
            mkr.off(document.body, 'touchcancel', this.stopScroll, this);
            mkr.off(document.body, 'touchmove', this.updateScroll, this);
        },

        /**
         * @function updateScroll
         * @memberof scrllbr.prototype
         * @public
         * @description Update tha target scroll position based on user action
        **/
        updateScroll: function(e) {
            var sLen, sPos, delta, touch, target = this._target;
            if(e.type == 'touchmove') {
                touch = e.changedTouches[0];
            }
            if(this.type === scrllbr.VERTICAL) {
                sLen = target.scrollHeight - target.clientHeight;
                if(e.type == 'touchmove') {
                    delta = (touch.clientY-this._touchStart.y)/this.range;
                    this._touchStart.y = touch.clientY;
                }
                else delta = e.movementY/this.range;
            }
            else {
                sLen = target.scrollWidth - target.clientWidth;
                if(e.type == 'touchmove') {
                    delta = (touch.clientX-this._touchStart.x)/this.range;
                    this._touchStart.x = touch.clientX;
                }
                else delta = movementX/this.range;
            }

            this.scroll = this._scroll + delta;
            TweenMax.set(this._target, {scrollTo:(this.scroll+delta)*sLen});
        },

        /**
         * @function onScroll
         * @memberof scrllbr.prototype
         * @public
         * @description Updates thumb position when the target is scrolled
        **/
        onScroll: function(e) {
            if(this._scrolling) return;
            var sLength, sPos, scrollLen, target = this._target;
            if(!target) return;
            if(this.type === scrllbr.VERTICAL) {
                sLength = target.scrollHeight - target.clientHeight;
                sPos = target.scrollTop/sLength;
            }
            else {
                sLength = target.scrollWidth - target.clientWidth;
                sPos = target.scrollLeft/sLength;
            }

             this.scroll = sPos;
        },

        /**
         * @function onMutate
         * @memberof scrllbr.prototype
         * @public
         * @description Updates thumb when the target is mutated
        **/
        onMutate: function(mutationsList, observer) {
            mutationsList.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    //console.log('A child node has been added or removed.');
                    this.refresh();
                }
            });
            //mkr.on(target, 'scroll', this.onScroll, this);
        },

        /**
         * @function refresh
         * @memberof scrllbr.prototype
         * @private
         * @description Updates the thumb position/size based on the target.
        **/
        refresh: function() {
            var sLength, sPos, sRatio, scrollLen, target = this._target;
            if(!target) return;
            if(this.type === scrllbr.VERTICAL) {
                sLength = target.scrollHeight - target.clientHeight;
                sRatio = target.clientHeight/sLength;
                sPos = target.scrollTop/sLength;

                TweenMax.set(this._thumb, {height:sRatio*this._track.clientHeight});
            }
            else {
                sLength = target.scrollWidth - target.clientWidth;
                sRatio = target.clientWidth/sLength;
                sPos = target.scrollLeft/sLength;

                TweenMax.set(this._thumb, {width:sRatio*this._track.clientWidth});
            }

            this.scroll = sPos;

        },
    };

    /**
    * @alias scrllbr.VERTICAL
    * @memberof scrllbr
    * @static
    * @readonly
    * @type String
    * @description returns 'vertical'
    **/
    Object.defineProperty(scrllbr, 'VERTICAL', {
        get: function() {
          return 'vertical';
        }
    });

    /**
    * @alias scrllbr.HORIZONTAL
    * @memberof scrllbr
    * @static
    * @readonly
    * @type String
    * @description returns 'horizontal'
    **/
    Object.defineProperty(scrllbr, 'HORIZONTAL', {
        get: function() {
          return 'horizontal';
        }
    });

    /**
    * @function getInstance
    * @memberof scrllbr
    * @static
    * @description returns the scrllbr instance associated with the id
    * @param {String} id - The lookup id
    * @returns {scrllbr} The associate scrllbr, if it exists
    **/
    scrllbr.getInstance = function(id) {
        return _instances[id];
    };

    /**
    * @function getElInstance
    * @memberof scrllbr
    * @static
    * @description returns the scrllbr instance associated with the provided element's id attribute
    * @param {Element} el - The element with the lookup id
    * @returns {scrllbr} The associate scrllbr, if it exists
    **/    
    scrllbr.getElInstance = function(el) {
        return _instances[el.id];
    };

    /**
    * @alias scrllbr.VERSION
    * @memberof scrllbr
    * @static
    * @readonly
    * @type String
    * @description returns scrllbr's version number
    **/
    Object.defineProperty(scrllbr, 'VERSION', {
        get: function() {
          return '0.0.1';
        }
    });

    if(typeof define === 'function' && define.amd){ //AMD
        define(function () { return scrllbr; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = scrllbr;
    } else { //browser
        global[className] = scrllbr;
    }
})(mkr._constructs, 'scrllbr');