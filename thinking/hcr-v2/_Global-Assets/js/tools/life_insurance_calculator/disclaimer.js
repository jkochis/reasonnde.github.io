define([
		"TweenMax"
	],
	function(TweenMax) {

		var disclaimerContainer = $(".disclaimerContainer"),
			disclaimerModal = $(".disclaimerContainer-modal"),
			disclaimerTitleEl = $(".disclaimerContainer-title"),
			disclaimerCopyEl = $(".disclaimerContainer-copy"),
			closeButton = $('.disclaimerContainer-close');

		var modalAnimations = {
			customFadeIn: function(timelineConfig) {

				var tl = new TimelineLite(timelineConfig).pause();
				//wrapper = disclaimerContainer[0]
				//inner = disclaimerModal[0];//this.$(".inner")[0];

				tl.add(TweenMax.fromTo(disclaimerContainer, 0.2, {
					display: "block",
					opacity: 0,
					perspective:500
				},{
					opacity: 1,
					ease: Power2.easeIn,
				}));

				tl.add(TweenMax.fromTo(disclaimerModal, 0.2, {
					opacity: 0,
					transform: "rotateX(-25deg)",
					transformOrigin: "center top"
				}, {
					opacity: 1,
					transform: "rotateX(0deg)",
					transformOrigin: "center top",
					ease: Power2.easeOut
				}).delay(0.2));

				return tl;
			},
			customFadeOut: function(timelineConfig) {
				var tl = new TimelineLite(timelineConfig).pause();

				tl.add(TweenMax.fromTo(disclaimerModal, 0.2, {
					opacity: 1,
					transform: "rotateX(0deg)"
				}, {
					opacity: 0,
					transform: "rotateX(-25deg)",
					ease: Power2.easeOut
				}).delay(0.2));

				tl.add(TweenMax.to(disclaimerContainer, 0.2, {
					display: "none",
					opacity: 0,
					ease: Power2.easeOut
				}));

				return tl;
			},
			mobileCustomFadeIn: function() {
				var inner, tl;

				tl = new TimelineLite().pause();
				inner = this.$(".inner")[0];

				if (this.$el.is(":visible")) {
					return tl;
				}

				tl.add(TweenLite.to(inner, 0, {
					opacity: 1,
					transform: ""
				}));

				tl.add(TweenLite.to(this.el, 0, {
					opacity: 0,
					display: "block"
				}));

				tl.add(TweenLite.to(this.el, 0.25, {
					opacity: 1,
					ease: Quart.easeIn
				}));
				return tl;
			}
		};

		var legalContent = $(".legal .legal-content"),
			legalButton = legalContent.find(".toggle"),
			legalCopy = legalContent.find(".content"),
			resultsLegalCopy = legalContent.find(".content-results");

		legalButton.on("click touchend", onLegalClick);
		closeButton.on("click touchend", hideDisclaimer);

		function onLegalClick() {

			if (legalButton.hasClass("results")) {
				showResultsLegalDisclaimer();
			} else {
				showLegalDisclaimer();
			}
		}

		function showLegalDisclaimer () {
			disclaimerTitleEl.html(legalCopy.data("title"));
			disclaimerCopyEl.html(legalCopy.html());
			disclaimerContainer.addClass("lrg");

			showDisclaimer();
		}

		function showResultsLegalDisclaimer () {

			disclaimerTitleEl.html(resultsLegalCopy.data("title"));
			disclaimerCopyEl.html(resultsLegalCopy.html());
			disclaimerContainer.addClass("lrg");

			showDisclaimer();
		}

		function showDisclaimer () {

			disclaimerContainer.addClass("show");

			var animation = modalAnimations.customFadeIn({});
			animation.play();
		}

		function hideDisclaimer() {
			var animation = modalAnimations.customFadeOut({
				onComplete: function () {
					disclaimerContainer.removeClass("show");
					disclaimerContainer.removeClass("lrg");

					disclaimerTitleEl.html(disclaimerTitleEl.data("defaultTitle"));
				}
			});
			animation.play();
		}


		disclaimerContainer.on("show", showDisclaimer);

	}
);
