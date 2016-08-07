define([
		'backbone',
		'lib/WidgetView',
		'lib/Util',
		'tools/life_insurance_calculator/disclaimer',
		'tools/life_insurance_calculator/form',
		'tools/life_insurance_calculator/results'
	],
	function(
			Backbone,
			WidgetView,
			Util,
			disclaimerController,
			formController,
			resultsController
		) {

		var $LICelement,
			currentState;

		var LifeInsuranceCalculator = WidgetView.extend({

				initialize: function () {

					// init the page here...
					formController.setup();
					resultsController.setup();

					var home = $(".lic-home"),
						results = $(".lic-results"),
						legalButton = $(".legal-content .toggle");

					var AppRouter = Backbone.Router.extend({
						routes: {
							"lic": "defaultRoute", // matches http://example.com/#anything-here
							"lic/results": "resultsRoute"
						},

						defaultRoute: function () {
							// show form
							results.removeClass("active");
							home.addClass("active");

							legalButton.removeClass("results");
						},

						resultsRoute : function () {
							// get score
							var score = formController.getScore(),
								formattedScore = Util.currencyFormat(score, 0);

							$(".licResults-amount").text(formattedScore);

							// show results
							home.removeClass("active");
							results.addClass("active");


							legalButton.addClass("results");

							// scroll to top
							window.scrollTo(0, 0);
						}
					});
					// Initiate the router
					var app_router = new AppRouter();

					// Start Backbone history a necessary step for bookmarkable URL's
					var hasRouteMatch = Backbone.history.start();

					if(!hasRouteMatch) {
						// go to default route
						app_router.navigate('/lic');
					}
					if (window.utag) {
					utag.link({_ga_category: 'life insurance calculator',_ga_action: 'form view'});
					}

				}
			},
			{
				build: function() {

					$LICelement = $('.lic');

					if($LICelement.length) {
						new LifeInsuranceCalculator();
					}
				}
			});

		return LifeInsuranceCalculator;
	});


