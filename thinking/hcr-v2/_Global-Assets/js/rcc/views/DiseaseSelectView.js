(function() {
  define(["jquery", "underscore", "backbone", "Select", "modernizr", "rcc/views/DiseaseCollectionView", "lib/ie"], function($, _, Backbone, Select, Modernizr, DiseaseCollectionView, ie) {
    var DiseaseSelectView;
    return DiseaseSelectView = Backbone.View.extend({
      initialize: function() {
        this.listenTo(this.model, "change:disease", this.onModelCurrentDisease);
        this.listenTo(this.model, "change:gender", this.onModelGender);
        _.bindAll(this, "onClickSelect");
        $("html").on("click", (function(_this) {
          return function() {
            return _this.hideDiseasesTab();
          };
        })(this));
        return this.$el.on("click", function(e) {
          return e.stopPropagation();
        });
      },
      events: {
        "change .diseases": "onChangeCurrentDisease",
        "click .input.diseases, .select-target": "onClickSelect",
        "onMouseEnter .diseases": "onMouseEnterDisease"
      },
      render: function() {
        this._rendered = true;
        this.$el.addClass("only-touch-select");
        this.$el.empty();
        this.renderSelect();
        return this.renderDiseasesTab();
      },
      renderSelect: function() {
        var $select, currentDisease;
        $select = $("<select class='input input--select diseases'></select>");
		this.collection = this.model.diseasesForGender();
        this.collection.each((function(_this) {
          return function(disease) {
            var $disease;
            $disease = $("<option></option>");
            $disease.val(disease.get("id"));
            $disease.text(disease.get("name"));
            return $disease.appendTo($select);
          };
        })(this));
        currentDisease = this.model.get("disease");
        if (currentDisease) {
          $select.val(currentDisease.get("id"));
        }
        $select.appendTo(this.$el);
        this.$diseases = $select;
        return this.diseaseSelect = new Select({
          el: $select[0],
          className: "select-theme-default only-touch"
        });
      },
      renderDiseasesTab: function() {
        var $tab;
        $tab = $("<div class='rcc-collection--disease tab'></div>").hide();
        $tab.appendTo(this.$el);
        this.diseaseTabView = new DiseaseCollectionView({
          el: $tab,
          collection: this.collection,
          model: this.model,
          attributes: {
            "data-item-idprefix": "rcc-diseases-" + parseInt(Math.random() * 100) + "--",
            "numdiseases": 4
          }
        });
        this.diseaseTabView.render();
        return this.$diseasesCollection = $tab;
      },
      toggleDiseasesTab: function() {
        if (this.$diseasesCollection) {
          this.$diseasesCollection.fadeToggle("fast");
        }
        if (this.diseaseSelect) {
          return $(this.diseaseSelect.target).toggleClass("active");
        }
      },
      showDiseasesTab: function() {
        if (this.$diseasesCollection) {
          return this.$diseasesCollection.fadeIn("fast");
        }
      },
      hideDiseasesTab: function() {
        if (this.$diseasesCollection) {
          this.$diseasesCollection.fadeOut("fast");
        }
        if (this.diseaseSelect) {
          if (!(Modernizr.touch || !rcc.getsDesktop() || ie < 9)) {
            this.diseaseSelect.close();
          }
          return $(this.diseaseSelect.target).removeClass("active");
        }
      },
      onChangeCurrentDisease: function() {
        return this.model.set("disease", this.$diseases.val());
      },
      onModelCurrentDisease: function() {
        var $select, newDiseaseId;
        if (!this.$el.is(":visible")) {
          return;
        }
        this.hideDiseasesTab();
        newDiseaseId = this.model.get("disease").get("id");
        $select = this.$diseases;
		var trackDisease = newDiseaseId.replace('-', ' ');
        if ($select.length) {
		  //console.log(newDiseaseId);
		  if (window.utag) {
            utag.link({_ga_category: 'real cost calculator',_ga_action: 'form detail: real costs of dropdown',_ga_label: ''+ trackDisease +''});
          }
          $select.val(newDiseaseId);
          return this.diseaseSelect.update();
        }
      },
      onClickSelect: function(e) {
        if (!(Modernizr.touch || !rcc.getsDesktop() || ie < 9)) {
          return this.toggleDiseasesTab();
        }
      },
      onModelGender: function() {
        if (!this.$el.is(":visible")) {
          return;
        }
        this.collection = this.model.diseasesForGender();
        return this.render();
      }
    });
  });
}).call(this);