/*!
 * VERSION: 0.0.8
 * DATE: 2017-02-22
 * UPDATES AND DOCS AT: nowhere but here for now
 *
 * @license MIT Copyright (c) 2017, Christopher C. Moody. All rights reserved.
 * 
 * @author: Christopher C. Moody, chris@moodydigital.com
 */

(function(className){
	var _instances={}, _count=0;
	
	/**
	 * @class admkr
	 * @description Initializes a new admkr instance. admkr leverages the power of {@link https://greensock.com/tweenlite} to make ad building a cinch!
	 * @param {Object} options - A set of attributes and css properties used to create the container
	 * @param {Boolean} [options.preload=false] - When true, delays loading img elements until the instance's load function in called
	 * @param {String} [options.imgDir=""] - Relative path from the doc root specifiying the location of images
	 * @requires {@link https://greensock.com/tweenlite}
	 */
	var admkr = function(options) {
		var id=_count;
		_count++;
		this._elements = [];
		this._elDefaults = {};
		this._count=0;

		this._imgDir = admkr.setDefault('imgDir', '', options);
		delete options.imgDir;

		this._preload = options.preload;
		delete options.preload;

		this._images = [];
		this._loadCallback = null;
		this._loadContext = null;
		var _loadedImages = 0;

		admkr.setDefault('attr', {}, options);
		'class' in options.attr ? options.attr.class += ' admkr-container' : options.attr.class = 'admkr-container';

		/**
		 * @name admkr#container
		 * @type HTMLElement
		 * @description the default container element used to hold all elements added to/created by the admkr instance
		**/
		this.container = this.createElement("div", options, document.body, true);

		_instances[id] = this;


		var _imageLoaded = function() {
			_loadedImages++;
			var ad = _instances[id];
			//console.log('image loaded!', _loadedImages);
			if(_loadedImages == ad._images.length) {
				if(ad._loadCallback) {
					ad._loadCallback.apply(ad._loadContext);
				}
				_preload = false;
			}
		}

		/**
		 * @function load
		 * @memberof admkr
		 * @instance
		 * @description When preloading is enabled, this function begins loading the instances img tags
		 * @param {function} callback - A callback function to call once loading is complete
		 * @param {Object=} context - The context to be apply to the callback
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
	 * @function createElement
	 * @memberof admkr.prototype
	 * @public
	 * @description Creates a new html element
	 * @param {string} type - The type of element to create.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
	 * @param {Element=} parent - The Element to append the new element. Defaults to the instance container
	 * @param {boolean} [ignore=false] - Pass true to prevent admkr from saving a reference to the element
	 * @returns The new element
	**/
	admkr.prototype.createElement = function(type, options, parent, ignore) {
		var t = type.toLowerCase();
		options = options || {};
		options.css = options.css || {};
		options.attr = options.attr || {};
		if("bg" in options) {
			if(options.bg.charAt(0) == "#" || options.bg == "transparent") {
				options.css.backgroundColor = options.bg;
			}
			else {
				options.css.backgroundImage = "url("+this._imgDir+options.bg+")";
			}
		}

		var xlnkns = 'http://www.w3.org/1999/xlink'
		var svgns = 'http://www.w3.org/2000/svg';
		var svgTags = ['svg', 'defs', 'use', 'image', 'g', 'mask', 'clippath', 'lineargradient', 'radialgradient', 'stop', 'text', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path'];
		var element;
		if(svgTags.indexOf(t) >= 0) {
			//console.log(t, type);
			element = document.createElementNS(svgns, type);
			if('xlink:href' in options.attr) {
				element.setAttributeNS(xlnkns, 'href', options.attr['xlink:href']);
				delete options.attr['xlink:href'];
			}
		}
		else {
			element = document.createElement(type);
			options.css.position = options.css.position || "absolute";
			admkr.setDefault("force3d", true, options);
		}		

		//var element = type==="svg"? document.createElementNS("http://www.w3.org/2000/svg", type) :document.createElement(type);
		if(type === 'img' && this._preload) {
			if(options.attr && options.attr.src) {
				this._images.push({img:element, src:options.attr.src});
				delete options.attr.src;
			}
		}

		this.add(element, options, parent, ignore);
	
		return element;
	};

	/**
	 * @function clone
	 * @memberof admkr.prototype
	 * @static
	 * @description clone a dom element with optional params
	 * @param {Object} target - The object to be cloned
	 * @param {Object=} options - attributes a properties to set on the new obj
	 * @param {Boolean} [deep=true] - Whether children should also be cloned
	 * @returns {Element}
	**/
	admkr.prototype.clone = function(target, options, parent, ignore, deep) {
		options = options || {};
		options.css = options.css || {};
		options.css.position = options.css.position || "absolute";
		admkr.setDefault("force3d", true, options);

		deep === undefined ? true : deep;
		var clone;
		if(target.tagName.toLowerCase() === 'svg') {
			options.text = target.innerHTML;
			clone = this.createElement('svg', options, parent, true);
		}
		else {
			clone = target.cloneNode(deep);
			delete clone.id;
		}
		
		this.add(clone, options, parent, ignore);
		
		return clone;
	};

	/**
	 * @function add
	 * @memberof admkr.prototype
	 * @public
	 * @description Adds an existing element the admkr instance
	 * @param {Element} element - The element to add
	 * @param {Object=} options - The element's default options
	 * @param {Element=} parent - The parent element. Defaults to the instance container
	 * @param {Boolean} [ignore=false] - Pass true to prevent admkr saving a reference to the element
	 * @returns The element
	**/
	admkr.prototype.add = function(element, options, parent, ignore) {
		TweenLite.set(element, options);

		parent = (parent==null || parent === undefined) ? this.container : parent;


		if(parent) parent.appendChild(element);
		if(!ignore) {
			this.saveElement(element, options);
		}
		return element;
	};

	/**
	 * @function remove
	 * @memberof admkr.prototype
	 * @public
	 * @description Removes an element from the admkr instance
	 * @param {Element} element - The element to add
	 * @param {Boolean} [killTweens=true] -  Whether to kill the element's tweens
	 * @param {Boolean} [removeFromDom=true] - Whether to remove element from DOM
	 * @returns The element
	**/
	admkr.prototype.remove = function(element, killTweens, removeFromDom) {
		var n = this._elements.indexOf(element);
		if(n < -1) { //can't remove what isn't there...
			this._elements.splice(n, 1);
			var mkrindex = element.getAttribute('mkrindex');
			delete this._elDefaults[mkrindex];

			killTweens = killTweens === undefined ? true : killTweens;
			if(killTweens) TweenLite.killTweensOf(element);

			removeFromDom = removeFromDom === undefined ? true : removeFromDom;
			if(removeFromDom) element.parentNode.removeChild(element);
		}
		return element;
	};

	/**
	 * @function saveElement
	 * @memberof admkr.prototype
	 * @public
	 * @description Creates a new html element
	 * @param {string} element - The type of element to save.
	 * @param {Object=} options - A set of attributes and css properties used to create the element
	**/
	admkr.prototype.saveElement = function(element, options) {
		element.setAttribute('mkrindex', this._count);
		this._elDefaults[this._count] = options;
		this._elements.push(element);
		this._count++;
	};

	/**
	 * @function killAllTweens
	 * @memberof admkr.prototype
	 * @public
	 * @description Kills all tweens of this admkr's elements
	**/
	admkr.prototype.killAllTweens = function() {
		var len = this._elements.length;
		for(var i = 0; i < len; i++) {
			TweenLite.killTweensOf(this._elements[i]);
		}
	};

	/**
	 * @function nuke
	 * @memberof admkr.prototype
	 * @public
	 * @description Kills all tweens of this admkr's elements, and removes the container from the dom
	**/
	admkr.prototype.nuke = function() {
		this.killAllTweens();
		this.container.parentNode.removeChild(this.container);
	};

	/**
	 * @function reset
	 * @memberof admkr.prototype
	 * @public
	 * @description Resets all of this admkr's elements to their default attribute/css values
	**/
	admkr.prototype.reset = function(killTweens) {
		var len = this._elements.length;
		killTweens = killTweens === undefined ? true : killTweens;
		for(var i = 0; i < len; i++) {
			var el = this._elements[i];
			var mkrindex = el.getAttribute('mkrindex');
			if(this._elDefaults[mkrindex]) {
				console.log(mkrindex);
				if(killTweens) TweenLite.killTweensOf(el);
				TweenLite.to(el, 0, {clearProps:'all'});
				TweenLite.set(el, this._elDefaults[mkrindex]);
			}
		}
	};

	/**
	 * @function makeDC
	 * @memberof admkr
	 * @static
	 * @description Factory method for quickly creating ads that conforms to DC standards
	 * @param {Number} width - The width of the ad
	 * @param {Number} height - The height of the ad
	 * @returns The newly created ad
	**/
	admkr.makeDC = function(width, height, options) {
		options = options || {};
		admkr.setDefault('attr', {}, options);
		admkr.setDefault('css', {}, options);
		admkr.setDefault('width', width, options.css);
		admkr.setDefault('height', height, options.css);
		admkr.setDefault('top', '0px', options.css);
		admkr.setDefault('left', '0px', options.css);
		admkr.setDefault('zIndex', 1, options.css);
		admkr.setDefault('overflow', 'hidden', options.css);

		var ad = new admkr(options);
		ad.width = width;
		ad.height = height;
		ad.border = document.createElement('div');
		TweenLite.set(ad.border, {attr:{class:'admkr-border'},
			css:{position:'absolute', pointerEvents:'none', zIndex:'1000',
			left:'0px', top:'0px', border:'1px solid #666666', width:width-2, height:height-2
		}});
		ad.container.appendChild(ad.border);

		return ad;
	};

	/**
	 * @function reveal
	 * @memberof admkr
	 * @static
	 * @description shortcut for revealing scrollable content. Created as a utility to assist with screenshotting
	 * @param {*} target - A selector string, Array, or element
	 * @param {Object=} options - An optional set of attributes and css properties to set on the element
	**/
    admkr.reveal = function(target, options) {
		if(target == null || typeof target == 'undefined') {
			return;
		}
		if(options) TweenLite.set(target, options);
		var targets;
		if(typeof target === 'string') targets = admkr.queryAll(target);
		else if(Array.isArray(target)) targets = target;
		else targets = [target];

		targets.forEach(function(el) {
			var parent = el.parentNode;
			while(parent) {
				TweenLite.set(parent, {overflowY:'visible', overflowX:'visible', overflow:'visible'});
				parent = parent.parentNode;
			}
		});
    };
    
	/**
	 * @function extend
	 * @memberof admkr
	 * @static
	 * @description shortcut for creating class extensions using protoypal inheritance
	 * @param {Object} baseObj - The object to be extended
	 * @returns {Object}
	**/
	admkr.extend = function(baseObj) {
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
	 * @function get
	 * @memberof admkr
	 * @static
	 * @description document.getElementById(id) shortcut
	 * @param {string} id - A case-sensitive string representing the unique ID of the element being sought
	 * @returns {Element}
	**/
	admkr.get = function(id) {
		return document.getElementById(id);
	}

	/**
	* @function query
	* @memberof admkr
	* @static
	* @description Returns the first element within the baseElement that matches the specified selectors. element.querySelector(selectors) shortcut
	* @param {string} selectors - A string containing one or more CSS selectors separated by commas.
	* @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	* @returns {Element} The first element within the baseElement that matches the specified selectors.
	*/
	admkr.query = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelector"](selectors);
	};

	/**
	 * @function queryAll
	 * @memberof admkr
	 * @static
	 * @description Returns a NodeList of all elements within the baseElement that match the specified selectors. element.querySelectorAll(selectors) shortcut
	 * @param {string} selectors - A string containing one or more CSS selectors separated by commas.
	 * @param {Element} [baseElement=document] - The ancestor element to search. Defaults to the document object
	 * @returns {NodeList} A NodeList of all elements within the baseElement that match the specified selectors.
	**/
	admkr.queryAll = function(selectors, baseElement) {
		baseElement = baseElement || document;
		return baseElement["querySelectorAll"](selectors);
	};

	/**
	 * @function on
	 * @memberof admkr
	 * @static
	 * @description Add a listener to one or many objects
	 * @param {*} target - A selector string, Array, or element
	 * @param {string} eventType - A string representing the type of event the listener is associated with
	 * @param {function} callback - The function to be executed when the associated event is fired
	**/
	admkr.on = function(target, eventType, callback) {
		if(target == null || typeof target == 'undefined') {
			return;
		}
		var targets;
		if(typeof target === 'string') targets = admkr.queryAll(target);
		else if(Array.isArray(target)) targets = target;
		else targets = [target];

		targets.forEach(function(el) {
			el.addEventListener(eventType, callback, false);
		});
	};

	/**
	 * @function off
	 * @memberof admkr
	 * @static
	 * @description Remove a listener from one or many objects
	 * @param {*} target - A selector string, Array, or element
	 * @param {string} eventType - A string representing the type of event the listener is associated with
	 * @param {function} callback - The function to be executed when the associated event is fired
	**/
	admkr.off = function(target, eventType, callback) {
		if(target == null || typeof(target) == 'undefined') {
			return;
		}
		var targets;
		if(typeof target === 'string') targets = admkr.queryAll(target);
		else if(Array.isArray(target)) targets = target;
		else targets = [target];
		targets.forEach(function(el) {
			el.removeEventListener(eventType, callback, false);
		});
	};

	/**
	 * @function setDefault
	 * @memberof admkr
	 * @static
	 * @description Sets the the value of target[propertyName] to value if propertyName has not already bee assigned
	 * @param {string} propertyName - The name of the property being set
	 * @param {string} value - The value to set
	 * @param {*} target - The target of this operation
	 * @returns {*} The value of target[propertyName]
	**/
	admkr.setDefault = function(propertyName, value, target) {
		if(!(propertyName in target)) {
			target[propertyName] = value;
		}
		return target[propertyName];
	};

	/**
	 * @function createStyleSheet
	 * @memberof admkr
	 * @private
	 * @description Creates the style sheet admkr uses for dynamic styles
	 * @returns {StyleSheet} The new stylesheet
	**/
	var createStyleSheet = function() {	
		var style = document.createElement('style');		
		style.appendChild(document.createTextNode(''));
		document.head.appendChild(style);
		return style.sheet;
	};

	/**
	 * @alias admkr.styles
	 * @memberof admkr
	 * @static
	 * @type StyleSheet
	 * @description admkr's dynamic stylesheet. Used by admkr.addRule
	**/
	admkr.styles = createStyleSheet();

	/**
	 * @function addRule
	 * @memberof admkr
	 * @static
	 * @description add a css rule to admkr's global stylesheet.
	 * @param {String} selector - A selector string, that the rule should target
	 * @param {String} rules - The rules to add
	 * @param {int=} index - The index at which to insert the rule.
	**/
    admkr.addRule = function(selector, rules, index) {
    	//var ruleString = JSON.stringify(rules).replace(/\"/g, '');
    	index = index === undefined ? admkr.styles.cssRules.length : index;
		if("insertRule" in admkr.styles) {
			admkr.styles.insertRule(selector + "{" + rules + "}", index);
		}
		else if("addRule" in admkr.styles) {
			admkr.styles.addRule(selector, rules, index);
		}
	};

	/**
	 * @function setPolyPath
	 * @memberof admkr
	 * @static
	 * @description Shortcut method for dynamically setting the target's clipPath using the polygon func. Useful for animating clipath arrays
	 * @param {Element} target - Target for clipPath
	 * @param {Array} points - Array of points to be used as the clipPath
	 * @param {unit} [unit=%] - The unit of measure to be used in the clipPath
	**/
	admkr.setPolyClipPath = function(target, points, unit) {
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
		TweenLite.set(target, {clipPath:clipPath});
	};

	/**
	 * @function distance
	 * @memberof admkr
	 * @static
	 * @description Calculates the distance between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The distance between the two points
	 *
	**/
	admkr.distance = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	};

	/**
	 * @function rotation
	 * @memberof admkr
	 * @static
	 * @description Calculates the angle(in radians) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in radians) between the two points
	 *
	**/
	admkr.rotation = function(x1, y1, x2, y2) {
		var dx = x2-x1;
		var dy = y2-y1;
		return Math.atan2(dy, dx);
	};

	/**
	 * @function angle
	 * @memberof admkr
	 * @static
	 * @description Calculates the angle(in degrees) between two points
	 * @param {Number} x1 - The x-coordinate of the first point
	 * @param {Number} y1 - The y-coordinate of the first point
	 * @param {Number} x2 - The x-coordinate of the second point
	 * @param {Number} y2 - The y-coordinate of the second point
	 * @returns {Number} The angle(in degrees) between the two points
	 *
	**/
	admkr.angle = function(x1, y1, x2, y2) {
		var ang = admkr.rotation(x1, y1, x2, y2)*admkr.DEG;
		//console.log(x1, y1, x2, y2, ang);
		return ang;
	};

	/**
	 * @function RAD
	 * @memberof admkr
	 * @static
	 * @description Mathematical constant for converting degrees to radians
	**/
	admkr.RAD = Math.PI/180;

	/**
	 * @function DEG
	 * @memberof admkr
	 * @static
	 * @description Mathematical constant for converting radians to degrees
	**/
	admkr.DEG = 180/Math.PI;

	/**
	 * @function randomRange
	 * @memberof admkr
	 * @static
	 * @description returns a random number between the supplied min and max values
	 * @param {Number} min - The minimum value
	 * @param {Number} max - The maximum value
	 * @returns {Number} A random number between the supplied min and max values
	 *
	**/
	admkr.randomRange = function(min, max) {
        return Math.floor(Math.random() * (max - min + 0.99)) + min;
    };

    window[className] = admkr;
	return admkr;
})('admkr');