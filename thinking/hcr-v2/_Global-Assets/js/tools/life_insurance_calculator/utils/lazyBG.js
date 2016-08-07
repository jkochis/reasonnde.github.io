define(['./imageLoader'], function(ImageLoader) {

		function LazyBG (el) {

			var element = el,
				MOBILE_BREAKPOINT = 768,
				loadComplete = false;

			var mobileImageSrc = element.data("srcmobile"),
				tabletImageSrc = element.data("srctablet");

			var win = $(window),
				windowWidth = win.outerWidth();

			var urls = [mobileImageSrc, tabletImageSrc];

			ImageLoader.loadAssets(urls, imagesLoaded);

			function imagesLoaded() {
				loadComplete = true;
				element.addClass("img-loaded");
				assignImage();
			}

			function assignImage() {
				if(loadComplete) {
					var image = mobileImageSrc;
					if (windowWidth >= MOBILE_BREAKPOINT) {
						image = tabletImageSrc;
					}

					element.css("backgroundImage", 'url(' + image + ')');
				}
			}

			function handleResize () {
				windowWidth = win.outerWidth();
				assignImage();
			}

			win.on("resize", handleResize);
		}

		return  LazyBG;
	}
);
