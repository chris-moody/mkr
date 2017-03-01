/*!
 * VERSION: 0.1.1
 * DATE: 2017-03-01
 * UPDATES AND DOCS AT: https://chris-moody.github.io/mkr
 *
 * @license copyright 2017 Christopher C. Moody
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of
 *	this software and associated documentation files (the "Software"), to deal in the
 *	Software without restriction, including without limitation the rights to use, copy,
 *	modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 *	and to permit persons to whom the Software is furnished to do so, subject to the
 *	following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all
 *	copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 *	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 *	PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @author: Christopher C. Moody, chris@moodydigital.com
 */

(function(className, scope){
	var _instances={}, _count=0;
	
	/**
	 * @class mkr
	 * @description Initializes a new mkr instance. A lightweight companion library to the {@link https://greensock.com/ greensock animation platform}, mkr delivers a 100% javascript method of content creation
	 * @param {Object} options - A set of attributes and css properties used to create the container. A few special properities and overrides are documented below.
	 * @param {Element} [options.parent=document.body] - Element the mkr instance container is appended to
	 * @param {Object=} options.tmln - options passed to the built-in TimelineMax instance.
	 * @param {Boolean} [options.preload=false] - When true, delays loading img elements until the instance's load function in called
	 * @param {String} [options.imgDir=""] - Relative path from the doc root specifiying the location of images
	 * @requires {@link https://greensock.com/tweenmax TweenMax}
	 */
	var mkr = function(options) {
		var id=_count;
		_count++;
		this._elements = [];
		this._states = {};
		this._count=0;
		this._tag = 'mkr-'+id+'-index';
		options = options || {};
		options.tmln = options.tmln || {};
		this._tmln = new TimelineMax(options.tmln);
		delete options.tmln;
		this._imgDir = mkr.getDefault(options, 'imgDir', '');
		delete options.imgDir;

		var parent = mkr.getDefault(options, 'parent', document.body);
		delete options.parent;
		if(typeof parent === 'string') parent = mkr.query(parent);

		this._preload = options.preload;
		delete options.preload;

		this._images = [];
		this._loadCallback = null;
		this._loadContext = null;
		var _loadedImages = 0;

		mkr.setDefault(options, 'attr', {});
		var classes = 'mkr-container mkr-'+id;
		'class' in options.attr ? options.attr.class += ' '+classes : options.attr.class = classes;

		/**
		 * @name mkr#container
		 * @type HTMLElement
		 * @description the default container element used to hold all elements added to/created by the mkr instance
		**/
		this.container = this.create("div", options, parent, true);

		_instances[id] = this;

		var _imageLoaded = function() {
			_loadedImages++;
			var self = _instances[id];
			//console.log('image loaded!', _loadedImages);
			if(_loadedImages == self._images.length) {
				if(self._loadCallback) {
					self._loadCallback.apply(self._loadContext);
				}
				_preload = false;
			}
		}

		/**
		 * @alias mkr.id
		 * @memberof mkr
		 * @public
		 * @readonly
		 * @type int
		 * @description internal id of this mkr instance
		**/
		Object.defineProperty(this, 'id', {
		    get: function() {
		      return id;
		    }
		});

		/**
		 * @function load
		 * @memberof mkr
		 * @instance
		 * @description When preloading is enabled, this function begins loading the instances img tags
		 * @param {function} callback - A callback function to call once loading is complete
		 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
		**/
		this.load = function(callback, context) {
			this._loadCallback = callback;
			this._loadContext = context;

			var i = this._images.length;
			if(i <= 0) {
				this._loadCallback.apply(this._loadContext);
				return;
			}
			
			while(i--) {
				this._images[i].img.onload = _imageLoaded;
			}

			i = this._images.length;
			while(i--) {
				this._images[i].img.src = this._images[i].src;
			}
		};
	};

	/**
	 * @alias mkr.tmln
	 * @memberof mkr.prototype
	 * @public
	 * @type TimelineMax
	 * @description reference to this mkr's built-in TimelineMax instance
	**/
	Object.defineProperty(mkr.prototype, 'tmln', {
	    get: function() {
	      return this._tmln;
	    }
	});

	/**
	 * @alias mkr.width
	 * @memberof mkr.prototype
	 * @public
	 * @type Number
	 * @description pixel height of this mkr's container
	**/
	Object.defineProperty(mkr.prototype, 'width', {
	    get: function() {
	      return this.container.offsetWidth;
	    },
	    set: function(value) {
	      this.container.offsetWidth = this.value;
	    }

	});

	/**
	 * @alias mkr.height
	 * @memberof mkr.prototype
	 * @public
	 * @type Number
	 * @description pixel width of this mkr's container
	**/
	Object.defineProperty(mkr.prototype, 'height', {
	    get: function() {
	      return this.container.offsetHeight;
	    },
	    set: function(value) {
	      this.container.offsetHeight = this.value;
	    }
	});

	/**
	 * @function create
	 * @memberof mkr.prototype
	 * @public
	 * @description Creates a new html element
	 * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
	 * @param {*=} parent - The element to append the new element. Can be an element or a css selector string
	 * @param {Boolean} [save=true] - Pass false to prevent mkr saving a reference to the element @see save
	 * @returns {Element} The new element
	**/
	mkr.prototype.create = function(type, options, parent, save) {
		var t = type.toLowerCase();
		options = options || {};
		options.css = options.css || {};
		options.attr = options.attr || {};

		var xlnkns = 'http://www.w3.org/1999/xlink'
		var svgns = 'http://www.w3.org/2000/svg';
		var svgTags = ['svg', 'defs', 'use', 'image', 'g', 'mask', 'clippath', 'lineargradient', 'radialgradient', 'stop', 'text', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path'];
		var element;
		if(svgTags.indexOf(t) >= 0) {
			//console.log(t, type);
			element = document.createElementNS(svgns, type);
			if(type == 'svg') options.css.position = options.css.position || "absolute";

			if('xlink:href' in options.attr) {
				element.setAttributeNS(xlnkns, 'href', options.attr['xlink:href']);
				delete options.attr['xlink:href'];
			}
		}
		else {
			element = document.createElement(type);
			//options.css.position = options.css.position || "absolute";
			mkr.setDefault(options.css, 'position', 'absolute');
			mkr.setDefault(options, 'force3d', true);
		}		

		//var element = type==="svg"? document.createElementNS("http://www.w3.org/2000/svg", type) :document.createElement(type);
		if(type === 'img' && this._preload) {
			if(options.attr && options.attr.src) {
				this._images.push({img:element, src:options.attr.src});
				delete options.attr.src;
			}
		}

		this.add(element, options, parent, save);
	
		return element;
	};

	/**
	 * @function batch
	 * @memberof mkr.prototype
	 * @public
	 * @description Creates a specified number of elements with the same parameters
	 * @param {String} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the elements
	 * @param {Number} num - The number of elements to produce
	 * @param {*=} parent - The element to append the new elements. Can be an element or a css selector string
	 * @param {Boolean} [save=true] - Pass false to prevent mkr saving a references to the elements @see save
	 * @returns {Array} An array containing the new elements
	**/
	mkr.prototype.batch = function(type, options, num, parent, save) {
		var elements = [];
		var n = num;
		while(n--) {
			elements.push(mkr.create(type, options, parent, save));
		}
		return elements;
	}

	/**
	 * @function add
	 * @memberof mkr.prototype
	 * @public
	 * @description Adds existing elements the mkr instance
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {Object=} options - The element's default options
	 * @param {Element=} parent - The parent element. Defaults to the instance container
	 * @param {Boolean} [save=true] - Pass false to prevent mkr saving a reference to the element @see save
	 * @returns {*} The added element, or an array when multiple elements are targeted
	**/
	mkr.prototype.add = function(target, options, parent, save) {
		parent = (parent==null || parent === undefined) ? this.container : parent;
		if(typeof parent === 'string') parent = mkr.query(parent);

		save = save === undefined ? true : save;

		var self = _instances[this.id];
		var targets = [];
		mkr.each(target, function(el) {
			TweenMax.set(el, options);

			if(parent) parent.appendChild(el);
			if(!save) {
				self.save(el, options);
			}
			targets.push(el);
		});
		return targets;
	};

	/**
	 * @function remove
	 * @memberof mkr.prototype
	 * @public
	 * @description Removes elements from the mkr instance
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {Boolean} [killTweens=true] -  Whether to kill the element's tweens
	 * @param {Boolean} [removeFromDOM=true] - Whether to remove element from DOM
	 * @returns {*} The removed element, or an array when multiple elements are targeted
	**/
	mkr.prototype.remove = function(target, killTweens, removeFromDOM) {
		killTweens = mkr.default(killTweens, true);
		removeFromDOM = removeFromDOM === undefined ? true : removeFromDOM;

		var self = _instances[this.id];
		var targets = [];
		mkr.each(target, function(el) {
			var n = self._elements.indexOf(el);
			if(n > -1) { //can't remove what isn't there...
				self._elements.splice(n, 1);
				var mkrindex = el.getAttribute(self._tag);
				delete self._states[mkrindex];
				el.removeAttribute(self._tag);

				if(killTweens) TweenMax.killTweensOf(el);
				if(removeFromDOM) mkr.removeChild(el);
				targets.push(el);
			}
		});
		return targets.length == 1 ? targets[0] : targets;
	};

	/**
	 * @function save
	 * @memberof mkr.prototype
	 * @public
	 * @description Associates an initial state with existing elements
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {Object=} state - A set of attributes and styles representing the element's initial state
	**/
	mkr.prototype.save = function(target, state) {
		var self = _instances[this.id];
		mkr.each(target, function(el) {
			var mkrindex = el.hasAttribute(self._tag) ? el.getAttribute(self._tag) : -1;
			if(mkrindex == -1) {
				el.setAttribute(self._tag, self._count);
				mkrindex = self._count;
				self._elements.push(el);
				self._count++;
			}
			self._states[mkrindex] = state;
		});
	};

	/**
	 * @function kill
	 * @memberof mkr.prototype
	 * @public
	 * @description Kills this mkr's tweens, child tweens, and timeline. Removes all listeners and removes the container from the DOM
	**/
	mkr.prototype.kill = function() {
		TweenMax.killTweensOf(this);
		TweenMax.killTweensOf(this.container);
		TweenMax.killChildTweensOf(this.container);
		mkr.off('.mkr-'+this.id+' *');
		mkr.removeChild(this.container);
	};

	/**
	 * @function reset
	 * @memberof mkr.prototype
	 * @public
	 * @description Resets all of this mkr's elements to their default attribute/css values
	**/
	mkr.prototype.reset = function(killTweens) {
		var len = this._elements.length;
		killTweens = killTweens === undefined ? true : killTweens;
		for(var i = 0; i < len; i++) {
			var el = this._elements[i];
			var mkrindex = el.getAttribute(this._tag);
			if(this._states[mkrindex]) {
				//console.log(mkrindex);
				if(killTweens) TweenMax.killTweensOf(el);
				TweenMax.to(el, 0, {clearProps:'all'});
				TweenMax.set(el, this._states[mkrindex]);
			}
		}
	};

	/**
	 * @function makeDC
	 * @memberof mkr
	 * @static
	 * @description Factory method for quickly creating creatives that conform to DCS standards
	 * @param {Number} width - The width of the creative
	 * @param {Number} height - The height of the creative
	 * @returns The newly created creative
	**/
	mkr.makeDC = function(width, height, options) {
		options = options || {};
		mkr.setDefault(options, 'attr', {});
		mkr.setDefault(options, 'css', {});
		mkr.setDefault(options.css, 'width', width);
		mkr.setDefault(options.css, 'height', height);
		mkr.setDefault(options.css, 'top', '0px');
		mkr.setDefault(options.css, 'left', '0px');
		mkr.setDefault(options.css, 'zIndex', 1);
		mkr.setDefault(options.css, 'overflow', 'hidden');

		var dc = new mkr(options);
		//dc.width = width;
		//dc.height = height;
		dc.border = document.createElement('div');
		TweenMax.set(dc.border, {attr:{class:'mkr-border'},
			css:{position:'absolute', pointerEvents:'none', zIndex:'1000',
			left:'0px', top:'0px', border:'1px solid #666666', width:width-2, height:height-2
		}});
		dc.container.appendChild(dc.border);

		return dc;
	};

    /**
	 * @function each
	 * @memberof mkr
	 * @static
	 * @description Executes the provided function for each target object
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {*} callback - Function to execute for each object
	 * @param {Object=} context - Context on which the callback is executed (object that should represent the `this` variable inside callback function)
	**/
    mkr.each = function(target, callback, context) {
    	if(target == null || typeof target === 'undefined') {
			return;
		}
		var targets;
		if(typeof target === 'string') targets = mkr.queryAll(target);
		else if(Array.isArray(target)) targets = target;
		else targets = [target];

		targets.forEach(callback, context);
    };

	/**
	 * @function on
	 * @memberof mkr
	 * @static
	 * @description Add a listener to one or many objects
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String} type - A string representing the type of event the listener is associated with
	 * @param {Function} listener - The function to be executed when the associated event is fired
	 * @param {Object=} context - Context on which the listener is executed (object that should represent the `this` variable inside listener function)
	 * @param {Number} [priority=0] - Affects listener execution order. Higher priority listeners are executed before those with lower priority. Listeners of the same priority are executed in order of insertion
	**/
	mkr.on = function(target, type, listener, context, priority) {
		mkr.each(target, function(el) {
			var cxt = mkr.default(context, el);
			mkr._triggerMatrix.add(el, type, listener, cxt, priority);
			//el.addEventListener(eventType, listener, false);
		});
	};

	/**
	 * @function once
	 * @memberof mkr
	 * @static
	 * @description Add a listener to one or many objects that only executes once per object
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String} type - A string representing the type of event the listener is associated with
	 * @param {Function} listener - The function to be executed when the associated event is fired
	 * @param {Object=} context - Context on which the listener is executed (object that should represent the `this` variable inside listener function)
	 * @param {Number} [priority=0] - Affects listener execution order. Higher priority listeners are executed before those with lower priority. Listeners of the same priority are executed in order of insertion
	**/
	mkr.once = function(target, type, listener, context, priority) {
		mkr.each(target, function(el) {
			var cxt = mkr.default(context, el);
			mkr._triggerMatrix.addOnce(el, type, listener, cxt, priority);
			//el.addEventListener(eventType, listener, false);
		});
	};

	/**
	 * @function off
	 * @memberof mkr
	 * @static
	 * @description Remove listeners from one or many objects. Behaves differently depending on the number of passed arguments.
	 * - 3+ arguments: Only removes the specified listener from the target
	 ^ - First 2 arguments only: Removes all listeners of provdied event type
	 * - First argument only: Removes all listeners from the target
	 * @param {*} target - An single element, array of elements, or a css selector string.
	 * @param {String=} type - The event type. Excluding this this argu
	 * @param {Function=} listener - The listener to remove. Excluding this argument removes all listeners of the specified from the target
	 * @param {Object=} context - Context on which the listener is executed (object that should represent the `this` variable inside listener function)
	**/
	mkr.off = function(target, type, listener, context) {
		var func;
		if(type === undefined) func = mkr._triggerMatrix.delete.bind(mkr._triggerMatrix);
		else if(listener === undefined) func = mkr._triggerMatrix.removeAll.bind(mkr._triggerMatrix);
		else func = mkr._triggerMatrix.remove.bind(mkr._triggerMatrix);

		mkr.each(target, function(el) {
			var cxt = mkr.default(context, el);
			func(el, type, listener, cxt);
			//el.removeEventListener(eventType, listener, false);
		});
	};

	/**
	 * @function clearListeners
	 * @memberof mkr
	 * @static
	 * @description Removes all listeners managed by mkr across all mkr instances. Its a good idea to be sure that you want to do this.
	**/
	mkr.clearListeners = function() {
		mkr._triggerMatrix.clear();
	};

	/**
	 * @function reveal
	 * @memberof mkr
	 * @static
	 * @description shortcut for revealing scrollable content.
	 * @param {*} target - A selector string, Array, or element
	 * @param {Object=} options - An optional set of attributes and css properties applied to the target
	 * @param {Object=} parentOpts - An optional set of attributes and css properties applied to every parent of the target
	**/
    mkr.reveal = function(target, options, parentOpts) {
    	if(options) TweenMax.set(target, options);
    	parentOpts = parentOpts || {};
    	mkr.setDefault(parentOpts, 'overflowY', 'visible');

		mkr.each(target, function(el) {
			var parent = el.parentNode;
			while(parent) {
				parentOpts.height = parent.scrollHeight+1;
				TweenMax.set(parent, parentOpts);
				//TweenMax.set(parent, {overflowY:'visible', height:parent.scrollHeight+1});
				parent = parent.parentNode;
			}
		});
    };
    
    /**
	 * @function scroll
	 * @memberof mkr
	 * @static
	 * @description Tweens the scrollable area of targets at the specified speed in px/s. Can target multiple objects
	 * @param {*} target - A selector string, Array, or element
	 * @param {*} speed - The speed of the tween in px/s
	 * @param {Object=} options - Additional properties passed to the tween
	 * @returns {Array} An array of tweens created to facilitate the animation
	**/
    mkr.scroll = function(target, speed, options) {

		mkr.setDefault(options, 'scrollTo', 'max');
		mkr.setDefault(options, 'ease', Power0.easeNone);

		var tweens = [];
		mkr.each(target, function(el) {
			var scrollTime = el.scrollHeight/speed;
			tweens.push(TweenMax.to(el, scrollTime, options));
			//duration = Math.max(duration, scrollTime);
		});
		return tweens;
    };

	/**
	 * @function extend
	 * @memberof mkr
	 * @static
	 * @description shortcut for creating class extensions using protoypal inheritance
	 * @param {Object} baseObj - The object to be extended
	 * @returns {Object}
	**/
	mkr.extend = function(baseObj) {
		if (typeof Object.create !== 'function') {
		    Object.create = function (o) {
		        function F() {}
		        F.prototype = o;
		        return new F();
		    };
		}
		newObj = Object.create(baseObj);
	};

	/**
	* @function query
	* @memberof mkr
	* @static
	* @description Returns the first element within the baseElement that matches the specified selectors. element.querySelector(selectors) shortcut
	* @param {String} selectors - A string containing one or more CSS selectors separated by commas.
	* @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	* @returns {Element} The first element within the baseElement that matches the specified selectors.
	*/
	mkr.query = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelector"](selectors);
	};

	/**
	 * @function queryAll
	 * @memberof mkr
	 * @static
	 * @description Returns a NodeList of all elements within the baseElement that match the specified selectors. element.querySelectorAll(selectors) shortcut
	 * @param {String} selectors - A string containing one or more CSS selectors separated by commas.
	 * @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	 * @returns {NodeList} A NodeList of all elements within the baseElement that match the specified selectors.
	**/
	mkr.queryAll = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelectorAll"](selectors);
	};

	/**
	 * @function addChild
	 * @memberof mkr
	 * @static
	 * @description Adds an existing element to the specified parent
	 * @param {String} target - A string containing one or more CSS selectors separated by commas.
	 * @param {Element} [parent=document.body] - The ancestor element to search. Defaults to the document object
	 * @param {int=} index - Where in the parent to add the element. Defaults to the end.
	 * @returns {Element} The added element
	**/
	mkr.addChild = function(target, parent, index) {
		parent = mkr.default(parent, document.body);
		index = mkr.default(index, parent.childNodes.length-1);

		return parent.insertBefore(target, parent.childNodes[index]);
	};

	/**
	 * @function removeChild
	 * @memberof mkr
	 * @static
	 * @description Removes an existing element from the DOM
	 * @returns {Element} The removed element
	**/
	mkr.removeChild = function(target) {
		return target.parentNode.removeChild(target);
	};

	/**
	 * @function default
	 * @memberof mkr
	 * @static
	 * @description Examines provided value and returns the fallback if it is undefined
	 * @param {String} value - The value to examine
	 * @param {String} value - The fallback value
	 * @returns {*} returns value or the fallback if it is undefined
	**/
	mkr.default = function(value, fallback) {
		return value === undefined ? fallback : value;
	};

	/**
	 * @function getDefault
	 * @memberof mkr
	 * @static
	 * @description Returns target[key] or value if target[key] has not be defined
	 * @param {Object} target - The target of this operation
	 * @param {String} key - The name of the property being set
	 * @param {String} value - The value to set
	 * @returns {*} target[key] or value if target[key] has not be defined
	**/
	mkr.getDefault = function(target, key, value) {
		/*if(!(key in target)) {
			return val;
		}
		return target[key]*/
		return mkr.default(target[key], value);
	};

	/**
	 * @function setDefault
	 * @memberof mkr
	 * @static
	 * @description Sets the the value of target[key] to value if key has not already been assigned
	 * @param {Object} target - The target of this operation
	 * @param {String} key - The name of the property being set
	 * @param {String} value - The value to set
	 * @returns {*} The value of target[key]
	**/
	mkr.setDefault = function(target, key, value) {
		/*if(!(key in target)) {
			target[key] = value;
		}
		return target[key];*/
		target[key] = mkr.default(target[key], value);
		return target[key];
	};

	/**
	 * @function createStyleSheet
	 * @memberof mkr
	 * @private
	 * @description Creates the style sheet mkr uses for dynamic styles
	 * @returns {StyleSheet} The new stylesheet
	**/
	var createStyleSheet = function() {	
		var style = document.createElement('style');		
		style.appendChild(document.createTextNode(''));
		document.head.appendChild(style);
		return style.sheet;
	};

	/**
	 * @function addRule
	 * @memberof mkr
	 * @static
	 * @description Adds a CSS rule to mkr's global stylesheet.
	 * @param {String} selector - A selector string, that the rule should target
	 * @param {Object} styles - The styles to add to the new rule
	 * @param {int=} index - The index at which to insert the rule.
	 * @returns {int} The index of the newly inserted rule
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.addRule = function(selector, styles, index) {
    	//var ruleString = JSON.stringify(styles).replace(/\"/g, '');
    	index = index === undefined ? mkr.styles.cssRules.length : index;
		//mkr.styles.insertRule(selector + "{" + styles + "}", index);
		//console.log(selector+"{}");
		var rules = selector+"{}";
		var n = -1;
		try {
			n = mkr.styles.insertRule(rules, index);
			var rule = mkr.styles.cssRules[n].style;//CSSRulePlugin.getRule(selector);
			TweenMax.set(rule, {cssRule:styles});
		}
		catch(e){};
		return n;
	};

	/**
	 * @function removeRule
	 * @memberof mkr
	 * @static
	 * @description Traverses mkr's stylesheet and removes first rule to match the selector.
	 * @param {String} selector - The selector text of the rule to remove.
	**/
    mkr.removeRule = function(selector) {
    	var index = mkr.findRule(selector);
    	if(index > -1) {
    		mkr.styles.deleteRule(index);
    	}
	};

	/**
	 * @function deleteRule
	 * @memberof mkr
	 * @static
	 * @description Delete the CSS rule at the specified index.
	 * @param {int=} index - The index the rule to remove.
	**/
    mkr.deleteRule = function(index) {
		mkr.styles.deleteRule(index);
	};

	/**
	 * @function findRule
	 * @memberof mkr
	 * @static
	 * @description Traverses mkr's stylesheet and returns the index of the first rule to match the selector. Returns -1 if the rule is not found.
	 * @param {String} selector - Selector used to search the stylesheet
	 * @returns {int} index - The index of the rule or -1 if not found.
	**/
    mkr.findRule = function(selector) {
    	var len = mkr.styles.cssRules.length;
    	for(var i=0; i < len; i++) {
    		if(selector === mkr.styles.cssRules[i].selectorText) {
    			return i;
    		}
    	}
    	return -1;
	};

	/**
	 * @function getRule
	 * @memberof mkr
	 * @static
	 * @description Alias for CSSRulePlugin.getRule. Returns the CSSRules that match the provided selector
	 * @param {String} selector - A selector string by which to select rules
	 * @returns {CSSStyleDeclaration} - The matched rule(s)
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.getRule = function(selector) {
    	return CSSRulePlugin.getRule(selector);
	};

	/**
	 * @function setRule
	 * @memberof mkr
	 * @static
	 * @description Updates the matched CSSRules with the provided styles
	 * @param {String} selector - A selector string, that the rule should target
	 * @param {Object} styles - The styles to set of the matched rules
	 * @requires {@link https://greensock.com/cssruleplugin CSSRulePlugin}
	**/
    mkr.setRule = function(selector, styles, index) {
    	var rule = CSSRulePlugin.getRule(selector);
    	if(rule) {
			TweenMax.set(rule, {cssRule:styles});
		}
	};

	/**
	 * @function setPolyPath
	 * @memberof mkr
	 * @static
	 * @description Shortcut method for dynamically setting the target's clipPath using the polygon func. Useful for animating clipath arrays
	 * @param {Element} target - Target for clipPath
	 * @param {Array} points - Array of points to be used as the clipPath
	 * @param {unit} [unit=%] - The unit of measure to be used in the clipPath
	**/
	mkr.setPolyClipPath = function(target, points, unit) {
		if([null, undefined].indexOf(target) < 0 || [null, undefined].indexOf(points) < 0)
			return;

		unit = unit === undefined ? '%' : unit;
		var clipPath = 'polygon(';
		var len = points.length;
		for(var i = 0; i < len; i++) {
			clipPath += points[i]+unit;
			if(i < len-1) {
				clipPath += i%2==0?' ':',';
			}
		}
		clipPath += ')';
		TweenMax.set(target, {clipPath:clipPath});
	};

	/**
	 * @function distance
	 * @memberof mkr
	 * @static
	 * @description Calculates the distance between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The distance between the two points
	 *
	**/
	mkr.distance = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	};

	/**
	 * @function rotation
	 * @memberof mkr
	 * @static
	 * @description Calculates the angle(in radians) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in radians) between the two points
	 *
	**/
	mkr.rotation = function(x1, y1, x2, y2) {
		var dx = x2-x1;
		var dy = y2-y1;
		return Math.atan2(dy, dx);
	};

	/**
	 * @function angle
	 * @memberof mkr
	 * @static
	 * @description Calculates the angle(in degrees) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in degrees) between the two points
	 *
	**/
	mkr.angle = function(x1, y1, x2, y2) {
		var ang = mkr.rotation(x1, y1, x2, y2)*mkr.DEG;
		//console.log(x1, y1, x2, y2, ang);
		return ang;
	};

	/**
	 * @function randomRange
	 * @memberof mkr
	 * @static
	 * @description returns a random number between the supplied min and max values
	 * @param {Number} min - The minimum value
	 * @param {Number} max - The maximum value
	 * @returns {Number} A random number between the supplied min and max values
	 *
	**/
	mkr.randomRange = function(min, max) {
        return Math.floor(Math.random() * (max - min + 0.99)) + min;
    };

	/**
	 * @alias mkr.RAD
	 * @memberof mkr
	 * @static
	 * @type Number
	 * @description Mathematical constant for converting degrees to radians
	**/
	mkr.RAD = Math.PI/180;

	/**
	 * @alias mkr.DEG
	 * @memberof mkr
	 * @static
	 * @type Number
	 * @description Mathematical constant for converting radians to degrees
	**/
	mkr.DEG = 180/Math.PI;

    /**
	 * @alias mkr.styles
	 * @memberof mkr
	 * @static
	 * @type StyleSheet
	 * @description mkr's dynamic stylesheet. Used by mkr.addRule
	**/
	mkr.styles = createStyleSheet();

	/**
	 * @alias mkr.rules
	 * @memberof mkr
	 * @static
	 * @type CSSRuleList
	 * @description mkr's dynamic stylesheet rules.
	**/
	Object.defineProperty(mkr, 'rules', {
	    get: function() {
	      return mkr.styles.cssRules;
	    }
	});

    (function(className, scope) {
	    var SignalManager = function (options) {
	        var _signals = {};

	        this.register = function (signalId) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }
	        };

	        this.add = function (signalId, listener, context, priority, isOnce) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }

	            var signal = _signals[signalId];
	            context = context || null;
	            priority = priority || 0;
	            isOnce = isOnce === undefined
	            return signal.add(listener, context, priority);
	        };

	        this.addOnce = function (signalId, listener, context, priority) {
	            if(!(signalId in _signals)) {
	                _signals[signalId] = new signals.Signal();
	            }

	            var signal = _signals[signalId];
	            context = context || null;
	            priority = priority || 0;

	            return signal.addOnce(listener, context, priority);
	        };

	        this.dispatch = function (signalId, params) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].dispatch.apply(null, Array.prototype.slice.call(arguments, 1));
	        };

	        this.dispose = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].dispose();
	            delete _signals[signalId];
	        };

	        this.forget = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].forget();
	        };

	        this.getNumListeners = function (signalId) {
	            if(!(signalId in _signals)) {
	                return 0;
	            }

	            return _signals[signalId].getNumListeners();
	        };

	        this.halt = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].halt();
	        };

	        this.has = function (signalId, listener, context) {
	            if(!(signalId in _signals)) {
	                return false;
	            }
	            context = context || null;
	            return _signals[signalId].has(listener, context);
	        };

	        this.remove = function (signalId, listener, context) {
	            if(!(signalId in _signals)) {
	                return;
	            }
	            context = context || null;
	            _signals[signalId].remove(listener, context);
	        };

	        this.removeAll = function (signalId) {
	            if(!(signalId in _signals)) {
	                return;
	            }

	            _signals[signalId].removeAll();
	        };

	        this.destroy = function (signalId) {
	            for(sigId in _signals) {
	                _signals[sigId].dispose();
	                delete _signals[sigId];
	            }
	        };
	    };

	    scope[className] = SignalManager;
	    return SignalManager;
	})('SignalManager', mkr);

	(function(className, scope) {
	  	var matrix = function(options) {
	    	this._mngrs = new Map();
	    	
	    	//add a listener
			this.add = function(target, type, listener, context, priority, isOnce) {
				isOnce = isOnce === undefined ? false : isOnce;
				if(!this._mngrs.has(target)){
					this._mngrs.set(target, {signals:new scope.SignalManager(), triggers:{}});
				}
				var mngr = this._mngrs.get(target);

				var trigger;
				if(mngr.triggers.hasOwnProperty(type)) { //clear existing trigger
					trigger = mngr.triggers[type];
					target.removeEventListener(type, trigger);
					delete mngr.triggers[type];
				}

				if(isOnce) {
					trigger = function(e) {
						mngr.signals.dispatch(type, e);
						if(mngr.signals.getNumListeners(type) == 0) {
			              	target.removeEventListener(type, trigger);
			              	delete mngr.triggers[type];
			            }
					};

					mngr.signals.addOnce(type, listener, context, priority);
				}
				else {
					trigger = function(e){mngr.signals.dispatch(type, e)};
					mngr.signals.add(type, listener, context, priority);
				}

				target.addEventListener(type, trigger);
				mngr.triggers[type] = trigger;
			};
	    	
	    	//add a listener that removes itself after te 1st trigger
			this.addOnce = function(target, type, listener, context, priority) {
				this.add(target, type, listener, context, priority, true);
			};

			//remove a single listener
			this.remove = function(target, type, listener, context) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				if(!mngr.triggers.hasOwnProperty(type)) { //no listeners of type
					return;
				}
				if(!mngr.signals.has(type, listener, context)) { //not here to remove
					return;
				}
        		
        		mngr.signals.remove(type, listener, context);

		        //remove trigger if no more listeners are attached
		        if(mngr.signals.getNumListeners(type) == 0) {
		          	var trigger = mngr.triggers[type];
		          	target.removeEventListener(type, trigger);
		          	delete mngr.triggers[type];
		        }
			}

			//remove all listeners on a target of the specified type
			this.removeAll = function(target, type) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				if(!mngr.triggers.hasOwnProperty(type)) { //no listeners of type
					return;
				}
        		
        		mngr.signals.removeAll(type);
        		var trigger = mngr.triggers[type];
	          	target.removeEventListener(type, trigger);
	          	delete mngr.triggers[type];
			}

			//remove all listeners for a target
		    this.delete = function(target) {
				if(!this._mngrs.has(target)) { //no listeners for target exist
					return;
				}
				var mngr = this._mngrs.get(target);

				for(var type in mngr.triggers) {
					var trigger = mngr.triggers[type];
					target.removeEventListener(type, trigger);
					delete mngr.triggers[type];
				}	      
				mngr.signals.destroy();
				this._mngrs.delete(target);
		  	}

		  	//clear the entire matrix of listeners
		  	this.clear = function() {
		  		var self = this;
		  		this._mngrs.forEach(function(mngr, target) {
		  			self.delete(target);
		  		});
		  	}
		};

		scope[className] = matrix;
		return matrix;
	})('TriggerMatrix', mkr);

	/**
	* @alias mkr._triggerMatrix
	* @memberof mkr
	* @private
	* @static
	* @type TriggerMatrix
	* @description mkr's internal event trigger matrix
	**/
	mkr._triggerMatrix = new mkr.TriggerMatrix();

	/**
	* @alias mkr.VERSION
	* @memberof mkr
	* @static
	* @type String
	* @description returns mkr's version number
	**/
	mkr.VERSION = '0.1.1';

    scope[className] = mkr;
	return mkr;
})('mkr', window);

/*!JS Signals <http://millermedeiros.github.com/js-signals/> @license Released under the MIT license Author: Miller MedeirosVersion: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);