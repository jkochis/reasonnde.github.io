define([], function() {

		function ImageLoader () {

		}

		var p = ImageLoader.prototype;

		p.loadImage = function(path, callback, key) {

			var img = new Image(),
				complete = callback;

			img.onload = function() {
				//console.log("Loaded : ", path);
				if (complete) {
					complete(img, key);
				}
			};

			img.src = path;
		};
		/*
		*	Load an array of image paths
		*
		*/
		p.loadAssets = function (assets, callback) {

			var	_assets = assets,
				_images = [],
				_loaded = 0,
				_complete = callback,
				imageLoaded = function (img, key) {
					_images[key] = img;
					_loaded++;
					if (_loaded === _assets.length ) {
						_complete(_images);
					}
				};

			for (var i = 0, l = _assets.length, loader; i < l; i++ ) {
				loader = this.loadImage(_assets[i], imageLoaded, i);
			}
		};

		p.getTags = function (selector) {
			return selector ? document.querySelectorAll(selector) : document.getElementsByTagName('*');
		};

		p.getImageURLS = function (selector) {
			var tags = typeof selector === "string" || selector === undefined ? this.getTags(selector) : selector.childNodes;
			//console.log("tags", tags);

			var images = tags.length ? this.getImageURLSfromNodeList(tags) : this.getImageURLSfromNodeList([selector]);

			//console.log("images", images);

			return images;
		};

		p.getImageURLSfromNodeList = function(nodeList) {
			var images = [],
				tags = nodeList,
				key = {},
				url,
				el;

			for (var i = 0, len = tags.length; i < len; i++) {
				el = tags[i];
				if (el.currentStyle) {
					if (el.currentStyle.backgroundImage !== 'none') {
						url = el.currentStyle;
					}
				}
				else if (window.getComputedStyle) {
					if (document.defaultView.getComputedStyle(el, null).getPropertyValue('background-image') !== 'none') {
						url = document.defaultView.getComputedStyle(el, null).getPropertyValue('background-image');
					}
				}

				if (el.nodeName === "IMG" || el.tagName === "IMG") {
					url = el.src;

					if (url.indexOf("http://") > -1 && key[url] === undefined) {
						images.push($.trim(url));
						key[url] = images.length;
					}
				}


				if (url !== "" && url !== undefined) {
					if (url.indexOf("http://") > -1 && key[url] === undefined) {
						//var isURL = url.indexOf("static");
						// trim quotes
						url = url.indexOf('url("') > -1 ? url.slice(5, url.length - 2) : url;
						url = url.indexOf("url('") > -1 ? url.slice(5, url.length - 2) : url;
						url = url.indexOf('url(') > -1 ? url.slice(4, url.length - 1) : url;

						//console.log(i + "  " + url);
						images.push($.trim(url));
						key[url] = images.length;
						url = "";
					}
				}

			}

			return images;
		};

		return new ImageLoader();
	}
);
