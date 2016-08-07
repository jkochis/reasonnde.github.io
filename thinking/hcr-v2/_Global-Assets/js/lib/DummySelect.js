(function() {
  define([], function() {
    var Select;
    Select = function() {
      return {
        update: function() {
          return true;
        },
        close: function() {
          return true;
        }
      };
    };
    Select.init = function() {
      return true;
    };
    return Select;
  });

}).call(this);
