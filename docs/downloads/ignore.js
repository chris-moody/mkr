
(function(className) {
	/**
	 * @class ignore
	 * @private
	 * @description Initializes a new ignore instance. Ignore this. I'm only here to make sure jsdocs doesn't use full file paths in src ref links
	 * @param {Object} options - Lorem ipsum blah blah
	 * @param {String} [options.frack="FRACK"] - Lorem ipsum blah blah
	 * @param {String} [options.flarg="FLARG"] - Lorem ipsum blah blah
	 * @requires {@link https://google.com/}
	 */
	var ignore = function(options) {

		this._frack = ignore.setDefault("frack", "FRACK", options);
		delete options.frack;

		this._flarg = ignore.setDefault("flarg", "FLARG", options);
		delete options.FLARG;
		
		/**
		 * @name ignore#instanceMember
		 * @type HTMLElement
		 * @description Lorem ipsum blah blah
		**/
		this.instanceMember = this.createElement("div", options, document.body, true);


		var _privateMethod = function() {

		}

		/**
		 * @function priviligedMethod
		 * @memberof ignore
		 * @instance
		 * @description Lorem ipsum blah blah
		 * @param {function} callback - Lorem ipsum blah blah
		 * @param {Object=} context - Lorem ipsum blah blah
		**/
		this.priviligedMethod = function(callback, context) {
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
	 * @function protoMember
	 * @memberof ignore.prototype
	 * @public
	 * @description Lorem ipsum blah blah
	 * @param {string} type - Lorem ipsum blah blah
	 * @param {Object=} options - Lorem ipsum blah blah
	 * @param {Element=} parent - Lorem ipsum blah blah
	 * @param {boolean} [ignore=false] - Lorem ipsum blah blah
	 * @returns The new element
	**/
	ignore.prototype.protoMember = function(type, options, parent, ignore) {
		
	};

	/**
	 * @function staticMember
	 * @memberof ignore
	 * @static
	 * @description Lorem ipsum blah blah
	 * @param {*} target - Lorem ipsum blah blah
	 * @param {Object=} options - Lorem ipsum blah blah
	**/
    ignore.staticMember = function(target, options) {

    };

    window[className] = ignore;
	return ignore;
})('ignore');