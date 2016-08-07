define([
	"underscore",
	"lib/Env",
	"lib/WidgetView",
	"lib/MediaHelper",
	"lib/MediaQueries"
],
function(
	_,
	Env,
	WidgetView,
	MediaHelper,
	MediaQueries
) {
	var CallToActionIcon = WidgetView.extend({

		initialize: function() {
			this.setup();
		},

		setup: function() {
			var that = this;

			var _icon = this.$el.find('.icon');

			var animationInterval = setInterval(function () {
		        secondPlay()
		    }, 700);


			function secondPlay() {
			    _icon.removeClass("play");
			    var aa = $("ul.secondPlay li.active");

			    if (aa.html() == undefined) {
			        aa = $("ul.secondPlay li").eq(0);
			        aa.addClass("before")
			            .removeClass("active")
			            .next("li")
			            .addClass("active")
			            .closest(".icon")
			            .addClass("play");

			    }
			    else if (aa.is(":nth-child(4)")) {
			        $("ul.secondPlay li").removeClass("before");
			        //aa.addClass('active');
			        //aa.addClass("before");//.removeClass("active");
			        //aa = $("ul.secondPlay li").eq(0);
			        aa.addClass("active")
			            .closest(".icon")
			            .addClass("stop");
			      	clearInterval(animationInterval);
			      	return;
			    }
			    else {
			        $("ul.secondPlay li").removeClass("before");
			        aa.addClass("before")
			            .removeClass("active")
			            .next("li")
			            .addClass("active")
			            .closest(".icon")
			            .addClass("play");
			    }

			}
		},

		onTearDown: function() {

		},

	},
	{
		selector: '.w_cta_icon'
	});

	return CallToActionIcon;
});