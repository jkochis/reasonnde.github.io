(function() {
  define(['views/base'], function(BaseView) {
    var CostsView;
    return CostsView = BaseView.extend({
      el: $('.step--help'),
      evaluateForm: function() {
        return {
          disease: $("[name=rcc-help-dis]").find(":selected").val()
        };
      },
      step: 3,
      render: function() {
        return this.renderDisease(this.model.get("disease"));
      },
      renderDisease: function(disease) {
        if (!disease) {
          return;
        }
        return $("[name=rcc-help-dis]").find("[value=" + disease + "]").prop('selected', true);
      },
      getUrlForView: function() {
        return "help";
      }
    });
  });

}).call(this);
