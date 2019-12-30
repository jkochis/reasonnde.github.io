(function() {
  define(['views/base'], function(BaseView) {
    var StartView;
    return StartView = BaseView.extend({
      el: $('.step--start'),
      evaluateForm: function() {
        return {
          gender: $("[name=rcc-gender]:checked").val(),
          age: parseInt($("[name=rcc-age]").val(), 10),
          disease: $("[name=rcc-dis]:checked").val()
        };
      },
      step: 1,
      allowWithInvalidState: true,
      render: function() {
        this.renderGender(this.model.get("gender"));
        this.renderAge(this.model.get("age"));
        return this.renderDisease(this.model.get("disease"));
      },
      renderDisease: function(disease) {
        if (!disease) {
          return;
        }
        return $("[name=rcc-dis][value=" + disease + "]").prop("checked", true);
      },
      renderAge: function(age) {
        if (!age) {
          return;
        }
        return $("[name=rcc-age]").val(age);
      },
      renderGender: function(gender) {
        if (!gender) {
          return;
        }
        return $("[name=rcc-gender][value=" + gender + "]").prop("checked", true);
      },
      getUrlForView: function() {
        return "start";
      }
    });
  });

}).call(this);
