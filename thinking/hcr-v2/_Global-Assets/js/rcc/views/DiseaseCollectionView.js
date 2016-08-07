(function() {
  define(["jquery", "underscore", "backbone", "TweenMax", "rcc/views/DiseaseView"], function($, _, Backbone, TweenMax, DiseaseView) {
    var DiseaseCollectionView;
    return DiseaseCollectionView = Backbone.View.extend({
      initialize: function() {
        this.listenTo(this.model, "change:disease", this.onCurrentDiseaseChange);
        this.listenTo(this.model, "change:gender", this.onGenderChange);
        this.on("slidechange", this.onChangeSlide);
        this.initSubViews();
        _.bindAll(this, "_onWindowResize");
        return $(window).on("resize", this._onWindowResize);
      },
      getViewForDisease: function(model) {
        return _(this._diseaseViews).select(function(cv) {
          return cv.model === model;
        })[0];
      },
      events: {
        "click  .input.disease": "onClickDisease",
        "click  .diseases__nav .rcc-button": "onClickNavButton"
      },
      initSubViews: function() {
        this._diseaseViews = [];
		this.collection = this.model.diseasesForGender();
        return this.collection.each((function(_this) {
          return function(disease) {
            var newDiseaseView;
            newDiseaseView = new DiseaseView({
              model: disease,
              attributes: {
                "for": _this.attributes["data-item-idprefix"] + disease.get("id"),
                "data-name": _this.attributes["data-item-name"],
                "tooltip": _this.attributes["tooltip"]
              }
            });
            return _this._diseaseViews.push(newDiseaseView);
          };
        })(this));
      },
      render: function() {
        var $container, $inner, $nav, navMarkup;
        this.initSubViews();
        this._rendered = true;

        /*
        Create DiseaseView for each disease and render it into the container.
         */
        $container = $("<div class='diseases__container'></div>");
        $inner = $("<div class='inner'></div>").appendTo($container);
        _(this._diseaseViews).each((function(_this) {
          return function(dv) {
            return $inner.append(dv.render().el);
          };
        })(this));
        this.diseaseHolder = $inner[0];

        /*
        Create navigation to toggle left and right.
         */
        navMarkup = "<nav class='diseases__nav'>";
        navMarkup += "<button type='button' class='rcc-button rcc-button--left' data-modifier='-1'>&laquo;</button>";
        navMarkup += "<span class='page-indicator'><em class='current'>1</em> of <em class='total'>1</em></span>";
        navMarkup += "<button type='button' class='rcc-button rcc-button--right' data-modifier='1'>&raquo;</button>";
        navMarkup += "</nav>";
        $nav = $(navMarkup);

        /*
        Add jQuery/DOM Objects to View $element
         */
        this.$el.empty();
        this.$el.append($container);
        this.$diseases = this.$(".disease");
        this.$el.append($nav);
        this.$pageTotal = this.$(".page-indicator .total");
        this.initSlides();
        this.initDiseaseWidth();
        return this.onChangeSlide(void 0, 0);
      },
      initSlides: function() {
        var currentDiseaseIndex, disease, dv;
        this.currentSlide = this.currentSlide || 0;
        if (disease = this.model.get("disease")) {
          dv = this.getViewForDisease(disease);
          if (dv) {
            currentDiseaseIndex = dv.index();
          }
          this.setSlideFromIndex(currentDiseaseIndex, true);
        }
        return this.$pageTotal.text(this.getSlideCount());
      },
      setSlideFromModifier: function(modifier) {
        var slides;
        slides = this.getSlideCount();
        this.currentSlide = (this.currentSlide + modifier + slides) % slides;
        return this.trigger("slidechange");
      },
      setSlideFromIndex: function(index, silent) {
        var slides;
        if (index == null) {
          index = 0;
        }
        if (silent == null) {
          silent = false;
        }
        slides = this.getSlideCount();
        this.currentSlide = Math.floor(Math.max(0, index) / this.getDiseasesPerSlide());
        if (!silent) {
          return this.trigger("slidechange");
        }
      },
      getSlideCount: function() {
        return Math.ceil(this._diseaseViews.length / this.getDiseasesPerSlide());
      },
      initDiseaseWidth: function() {
        return this.diseaseWidth = this.$(".input.disease").first().outerWidth();
      },
      initNumDiseases: function() {
        return this.getDiseasesPerSlide();
      },
      getDiseasesPerSlide: function() {
        var fixedNum, width;
        if (fixedNum = this.attributes.numdiseases) {
          return fixedNum;
        } else {
          width = $(window).width();
          if (width < rcc.breakpoints.small) {
            return this.attributes.smallnumdiseases;
          } else {
            if (width < rcc.breakpoints.desktop) {
              return this.attributes.mediumnumdiseases;
            } else {
              return this.attributes.largenumdiseases;
            }
          }
        }
      },
      onChangeSlide: function(e, time) {
        var s, val;
        if (!_.isNumber(time)) {
          time = 0.5;
        }
        s = this.currentSlide;
        this.$el.find(".page-indicator .current").text(s + 1);
        val = -this.diseaseWidth * s * this.getDiseasesPerSlide();
        if (_.isNumber(val) && !_.isNaN(val)) {
          return TweenMax.to(this.diseaseHolder, time, {
            left: val,
            ease: Power2.easeOutSine
          });
        }
      },
      onClickDisease: function(e) {
		  this.model.on("change", this._onModelChange, this);
        var $clicked, $diseases;
        $diseases = this.$diseases;
        $clicked = $(e.currentTarget);
        $diseases.filter(".checked").not($clicked).removeClass("checked");
        return this.model.set("disease", $clicked.data("value"));
      },	  
	  _onModelChange: function() {
			if(!this.model.get('initiated')){
				this.model.set('initiated', true);
                if (window.utag) {
                    utag.link({_ga_category: 'lead form',_ga_action: 'initiate',_ga_label: utag.data.form_type});
                }    
			}
	  },
      onCurrentDiseaseChange: function() {
        var disease;
        if (!(disease = this.model.get("disease"))) {
          return;
        }
        return this.$diseases.filter("[data-value=" + disease.get("id") + "]").addClass("checked");
      },
      getValue: function() {
        return this.$diseases.filter(".checked").first().data("value");
      },
      onGenderChange: function() {
        this.collection = this.model.diseasesForGender();
        return this.render();
      },
      onClickNavButton: function(e) {
        var modifier;
        modifier = parseInt($(e.target).data("modifier"));
        return this.setSlideFromModifier(modifier);
      },
      _onWindowResize: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this.initSlides();
        this.initDiseaseWidth();
        return this.onChangeSlide(void 0, 0);
      }
    });
  });

}).call(this);
