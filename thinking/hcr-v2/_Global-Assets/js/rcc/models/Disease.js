
/*
  Class: Disease
  Extends: Backbone.GSModel
  A lean model that stores data about a disease.
 */

(function() {
  define(["jquery", "underscore", "backbone", "rcc/collections/Policies"], function($, _, Backbone, Policies) {
    var Disease;
    return Disease = Backbone.GSModel.extend({
      defaults: {
        male: true,
        female: true,
        checked: false
      },
      setters: {
        groupPolicies: function(val) {
          if (val instanceof Policies) {
            return val;
          } else {
            return new Policies(val);
          }
        },
        individualPolicies: function(val) {
          if (val instanceof Policies) {
            return val;
          } else {
            return new Policies(val);
          }
        }
      },
      _ageRanges: [
        {
          lo: 0,
          hi: 25
        }, {
          lo: 26,
          hi: 30
        }, {
          lo: 31,
          hi: 35
        }, {
          lo: 36,
          hi: 40
        }, {
          lo: 41,
          hi: 45
        }, {
          lo: 46,
          hi: 50
        }, {
          lo: 51,
          hi: 55
        }, {
          lo: 56,
          hi: 60
        }, {
          lo: 61,
          hi: 65
        }, {
          lo: 66,
          hi: 70
        }, {
          lo: 71,
          hi: 999
        }
      ],
      getDescription: function(gender, age) {
        var ageIndex, ageRange, descriptions, i, _i, _len, _ref;
        if (gender == null) {
          gender = "male";
        }
        if (age == null) {
          age = 23;
        }
        if (!(descriptions = this.get("desc"))) {
          return;
        }
        descriptions = descriptions[gender];
        ageIndex = 0;
        _ref = this._ageRanges;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          ageRange = _ref[i];
          if ((ageRange.lo <= age && age <= ageRange.hi)) {
            ageIndex = i;
            break;
          }
        }
        return descriptions[ageIndex];
      }
    });
  });

}).call(this);
