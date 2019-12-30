
/*
  Routes and JavaScript! such awesome! much wow!
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["jquery", "underscore", "backbone", "rcc/rcc"], function($, _, Backbone, rcc) {
    var Router;
    return Router = Backbone.Router.extend({
      routes: {
        "start": "start",
        "start/:gender": "start",
        "start/:gender/:age": "start",
        "start/:gender/:age/:disease": "start",
        "start/:gender/:age/:disease/:pType/:severity": "start",
        "start/:gender/:age/:disease/:pType/:severity/:insurance": "start",
        "start/:gender/:age/:disease/:pType/:severity/:insurance/:rent": "start",
        "start/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income": "start",
        "start/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income/:family": "start",
        "start/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income/:family/:aD/:uD/:iaD/:pvC/:svC/:pvN/:svN/:gdC/:bdC/:sdC/:gdN/:bdN/:sdN/:dgC/:imC/:dgN/:imN/:erC/:ucC/:erV/:ucV/:hosPer/:hosOpt": "start",
        "customize/:gender/:age/:disease/:pType/:severity": "customize",
        "customize/:gender/:age/:disease/:pType/:severity/:insurance": "customize",
        "customize/:gender/:age/:disease/:pType/:severity/:insurance/:rent": "customize",
        "customize/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income": "customize",
        "customize/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income/:family": "customize",
        "customize/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income/:family/:aD/:uD/:iaD/:pvC/:svC/:pvN/:svN/:gdC/:bdC/:sdC/:gdN/:bdN/:sdN/:dgC/:imC/:dgN/:imN/:erC/:ucC/:erV/:ucV/:hosPer/:hosOpt": "customize",
        "help/:gender/:age/:disease/:pType/:severity/:insurance/:rent/:income/:family/:aD/:uD/:iaD/:pvC/:svC/:pvN/:svN/:gdC/:bdC/:sdC/:gdN/:bdN/:sdN/:dgC/:imC/:dgN/:imN/:erC/:ucC/:erV/:ucV/:hosPer/:hosOpt": "help",
        "*path": "startOver",
        "/": "startOver"
      },
      startOver: function() {
        return rcc.appController.render("start");
      },
      start: function() {
        this.setParamsFrom(arguments);
        return rcc.appController.render("start");
      },
      customize: function() {
        this.setParamsFrom(arguments);
        return rcc.appController.render("customize");
      },
      help: function() {
        this.setParamsFrom(arguments);
        return rcc.appController.render("help");
      },
      setParamsFrom: function(argList) {
        var i, param, params, _i, _len, _ref;
        params = {};
        _ref = this._availableParams;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          param = _ref[i];
          if (argList[i] != null) {
            params[param.name] = argList[i];
          }
        }
        return rcc.model.set("params", params);
      },
      _availableRoutes: ["start", "customize", "results"],
      _availableParams: [
        {
          name: "gender",
          routes: ["start"]
        }, {
          name: "age"
        }, {
          name: "disease"
        }, {
          name: "policyType"
        }, {
          name: "severity",
          routes: ["customize"]
        }, {
          name: "insurance"
        }, {
          name: "rent"
        }, {
          name: "income"
        }, {
          name: "family"
        }, {
          name: "availableDeductible"
        }, {
          name: "usedDeductible"
        }, {
          name: "insuranceAfterDeductible"
        }, {
          name: "primaryCarePer"
        }, {
          name: "specialistCarePer"
        }, {
          name: "primaryCareNum"
        }, {
          name: "specialistCareNum"
        }, {
          name: "genericDrugPer"
        }, {
          name: "brandDrugPer"
        }, {
          name: "specialtyDrugPer"
        }, {
          name: "genericDrugNum"
        }, {
          name: "brandDrugNum"
        }, {
          name: "specialtyDrugNum"
        }, {
          name: "diagnosticsPer"
        }, {
          name: "imagingPer"
        }, {
          name: "diagnoticsNum"
        }, {
          name: "imagingNum"
        }, {
          name: "erPer"
        }, {
          name: "urgentPer"
        }, {
          name: "erNum"
        }, {
          name: "urgentNum"
        }, {
          name: "hospital"
        }, {
          name: "hospitalOpt"
        }
      ],
      _generateRoutesFromParams: function() {
        var c, currentParam, i, j, param, params, route, routes, routesObject, url, _i, _j, _k, _l, _len, _len1, _ref;
        routesObject = {};
        routes = this._availableRoutes;
        params = this._availableParams;
        for (_i = 0, _len = routes.length; _i < _len; _i++) {
          route = routes[_i];
          for (i = _j = 0, _len1 = params.length; _j < _len1; i = ++_j) {
            param = params[i];
            if (!(param.routes && __indexOf.call(param.routes, route) >= 0)) {
              continue;
            }
            for (j = _k = i, _ref = params.length - 1; i <= _ref ? _k <= _ref : _k >= _ref; j = i <= _ref ? ++_k : --_k) {
              url = route;
              for (c = _l = 0; 0 <= j ? _l <= j : _l >= j; c = 0 <= j ? ++_l : --_l) {
                currentParam = params[c];
                url += "/:" + currentParam.name;
              }
              routesObject[url] = route;
            }
          }
        }
        routesObject["/"] = "startOver";
        return routesObject["path*"] = "startOver";
      }
    });
  });

}).call(this);
