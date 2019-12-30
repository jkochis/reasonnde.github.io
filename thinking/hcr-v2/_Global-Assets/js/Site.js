/**
 * Created by roel.kok on 4/22/14.
 */
 ///////////////////
define([
	"underscore",
	"lib/Env",
	"lib/MediaQueries",
	"widgets/SampleWidget",
	"widgets/SegmentationsMenu",
	"widgets/SegmentationsLanding",
	"widgets/LandingSlider",
	"widgets/HelpfulLinks",
	"widgets/IsIsNot",
	"widgets/Testimonial",
	"widgets/NavBarWidget",
    "widgets/ShareWidget",
	"widgets/PageStaticHeader",
//	"widgets/RequestAQuoteForm",
	"widgets/Sidebar",
	"widgets/SidebarIndividuals",
	"widgets/SidebarAgents",
	"widgets/SidebarBrokers",
	"widgets/SidebarEmployers",
	//"widgets/HealthcareReformMain",
	//"widgets/HealthcareReformNews",
	//"widgets/HealthcareReformTimeline",
	"widgets/Footer",
	"pages/SecondaryPage",
	"widgets/Policies",
	"widgets/TabsMenu",
	"widgets/ProductSnapshot",
	"widgets/RightPlan",
	"widgets/WhyAflac",
	"widgets/CallToActionIcon",
	"widgets/AccountLogin",
	"widgets/Disclaimer",
	//"widgets/RCCProducts",
	//"widgets/RCCQuote",
	"widgets/ScrollWidget"
	//"widgets/contact/GenericForm"
	//"widgets/contact/FabForm"
],
function(
	_,
	Env,
	MediaQueries,
	SampleWidget,
	SegmentationsMenu,
	SegmentationsLanding,
	LandingSlider,
	HelpfulLinks,
	IsIsNot,
	Testimonial,
	NavBarWidget,
    ShareWidget,
	PageStaticHeader,
//	RequestAQuoteForm,
	Sidebar,
	SidebarIndividuals,
	SidebarAgents,
	SidebarBrokers,
	SidebarEmployers,
	//HealthcareReformMain,
	//HealthcareReformNews,
	//HealthcareReformTimeline,
	Footer,
	SecondaryPage,
	Policies,
	TabsMenu,
	ProductSnapshot,
	RightPlan,
	WhyAflac,
	CallToActionIcon,
	AccountLogin,
	Disclaimer,
	//RCCProducts,
	//RCCQuote,
	ScrollWidget
	//GenericForm
	//FabForm
) {
	// Yo! Add yo widgets here
	var availableWidgets = [
		SampleWidget,
		SegmentationsMenu,
		SegmentationsLanding,
		LandingSlider,
		HelpfulLinks,
		IsIsNot,
		Testimonial,
		NavBarWidget,
     	ShareWidget,
		PageStaticHeader,
//		RequestAQuoteForm,
		Sidebar,
		SidebarIndividuals,
		SidebarAgents,
		SidebarBrokers,
		SidebarEmployers,
		//HealthcareReformMain,
		//HealthcareReformNews,
		//HealthcareReformTimeline,
		Footer,
		SecondaryPage,
		Policies,
		TabsMenu,
		ProductSnapshot,
		RightPlan,
		WhyAflac,
		CallToActionIcon,
		AccountLogin,
		Disclaimer,
		//RCCProducts,
		//RCCQuote,
		ScrollWidget
		//GenericForm
		//FabForm
	];
	var Site = function() {
		this.widgets = [];
		this.$root = $(document.body);
		this.initCompat();
		this.initWidgets();
	}
	_.extend(Site.prototype, {
		widgets: null,
		initCompat: function() {
//		if(Env.IE8) {
//			this.compat = new IE8Compat(this);
//		}
		},
		initWidgets: function() {
			for(var i = 0; i < availableWidgets.length; i++) {
				var WidgetClass = availableWidgets[i];
				var $els = this.$root.find(WidgetClass.selector);
				$els.each(_.bind(function(i, el) {
					this.widgets.push(new WidgetClass({
						el: el
					}));
				}, this));
			}
		}
	});
	var IE8Compat = function(site) {
		_.bindAll(this,
			"onResizeWindow"
		);
		this.site = site;
		this.applyMediaQueries();
		$(window).on("resize", this.onResizeWindow);
	}
	_.extend(IE8Compat.prototype, {
		applyMediaQueries: function() {
			var $el = $("html");
			for(var i = 0; i < IE8Compat.mediaQueryList.length; i++) {
				var mq = IE8Compat.mediaQueryList[i];
				if(matchMedia(mq.query).matches) {
					$el.addClass(mq.className);
				}
				else {
					$el.removeClass(mq.className);
				}
			}
			document.body.className = document.body.className + "";
		},
		onResizeWindow: function() {
			setTimeout(_.bind(this.applyMediaQueries, this), 1000);
		}
	});
	var mediaQueryList = [];
	for(label in MediaQueries) {
		mediaQueryList.push({
			className: "mq-" + label.replace("_", "-").toLowerCase(),
			query: MediaQueries[label]
		});
	}
	_.extend(IE8Compat, {
		mediaQueryList: mediaQueryList
	});
	return Site;
});