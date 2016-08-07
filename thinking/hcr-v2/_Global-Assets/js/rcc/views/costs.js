(function() {
  define(['views/base'], function(BaseView) {
    var CostsView;
    return CostsView = BaseView.extend({
      el: $('.step--costs'),
      evaluateForm: function() {
        return {
          disease: $("[name=rcc-costs-dis]").find(":selected").val(),
          coverage: $("[name=rcc-coverage]:checked").val()
        };
      },
      step: 2,
      render: function() {
        this.renderDisease(this.model.get("disease"));
        return this.renderCoverage(this.model.get("coverage"));
      },
      renderDisease: function(disease) {
        if (!disease) {
          return;
        }
        return $("[name=rcc-costs-dis]").find("[value=" + disease + "]").prop("selected", true);
      },
      renderCoverage: function(coverage) {
        return $("[name=rcc-coverage]").filter("[value=" + coverage + "]").prop("checked", true);
      },
      renderErrors: function() {
        this.updateState();
        return console.log(this.model.validationError);
      },
      getUrlForView: function() {
        return "costs";
      }
    });
  });

}).call(this);
