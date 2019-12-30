
/*
  Class: DataModel
  Extends: Backbone.GSModel, which is an extension of Backbone.Model allowing for custom setters and getters.
  The core maintainer of the app's state.
 */

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(["jquery", "underscore", "backbone", "rcc/rcc", "rcc/models/BackboneGS", "rcc/models/Disease", "rcc/models/Policy", "rcc/collections/Diseases", "rcc/collections/FemaleDiseases", "rcc/collections/MaleDiseases", "rcc/collections/Policies"], function($, _, Backbone, rcc, BackboneGS, Disease, Policy, Diseases, FemaleDiseases, MaleDiseases, Policies) {

    /*
    Define some dumb models for typechecking
     */
    var DataModel, Families, Family, Income, Incomes, Insurance, Insurances, Rent, Rents;
    Income = Backbone.Model.extend({});
    Incomes = Backbone.Collection.extend({
      model: Income
    });
    Rent = Backbone.Model.extend({});
    Rents = Backbone.Collection.extend({
      model: Rent
    });
    Insurance = Backbone.Model.extend({});
    Insurances = Backbone.Collection.extend({
      model: Insurance
    });
    Family = Backbone.Model.extend({});
    Families = Backbone.Collection.extend({
      model: Family
    });
    return DataModel = Backbone.GSModel.extend({

      /*
      Define application defaults
      NOTE: These will not be applied directly, but through the set method.
       */
      defaults: {
		advancedOptionsInitiated: false,
        availableDeductible: 1500,
        brandDrugNum: 10,
        brandDrugPer: 30,
        diagnosticsNum: 10,
        diagnosticsPer: 25,
        diseases: new Diseases(rcc.data.diseaseData),
        erNum: 5,
        erPer: 200,
        family: "couple",
        genericDrugNum: 10,
        genericDrugPer: 10,
        hospital: 30,
        hospitalOpt: "outpatient",
        imagingNum: 5,
        imagingPer: 50,
        income: "2901-4200",
        insuranceAfterDeductible: 90,
        policyType: "individual",
        primaryCareNum: 10,
        primaryCarePer: 25,
        rent: "1000-1499",
        severity: "moderate",
        specialtyDrugPer: 70,
        specialistNum: 10,
        specialistPer: 35,
        step: 1,
        surgery: 30,
        usedDeductible: 1500,
        specialtyDrugNum: 10,
        urgentNum: 5,
        urgentPer: 30
      },

      /*
        Grab a bunch of (global) data which has been defined in the data file and create collections from it.
       */
      rents: new Rents(rcc.data.rentData),
      incomes: new Incomes(rcc.data.incomeData),
      families: new Families(rcc.data.familyData),
      insurances: new Insurances(rcc.data.insuranceData),
      initialize: function() {
        return this.listenTo(this.get("diseases"), "change:checked", function() {
          return this.set("disease", this.get("diseases").current());
        });
      },

      /*
      Return all diseases for the current gender or the intersection of female and male related diseases.
       */
      diseasesForGender: function() {
        switch (this.get("gender")) {
          case "female":
            return new FemaleDiseases(this.get("diseases").female());
          case "male":
            return new MaleDiseases(this.get("diseases").male());
          default:
            return new MaleDiseases(this.get("diseases").intersection());
        }
      },

      /*
      Call Validator for current step of the application.
       */
      validate: function(attributes, options) {
        var errors;
        switch (this.get("step")) {
          case 1:
            errors = this.validateFirstStep(attributes, options);
            break;
          case 2:
            errors = this.validateSecondStep(attributes, options);
            break;
          case 3:
            errors = this.validateThirdStep(attributes, options);
            break;
          default:
            throw "Error: Invalid step";
        }
        if (_.isEmpty(errors)) {
		
        } else {
          return errors;
        }
      },
      validateFirstStep: function(attributes) {
        var errors, validateAge, validateDisease, validateGender;
        validateGender = (function(_this) {
          return function() {
            var _ref;
            if ((_ref = attributes.gender) !== "male" && _ref !== "female") {
              return false;
            }
            return true;
          };
        })(this);
        validateAge = (function(_this) {
          return function() {
            var parsedAge;
            if (!attributes.age) {
              return false;
            }
            parsedAge = parseInt(attributes.age, 10);
            if (!_.isNumber(parsedAge)) {
              return false;
            }
            if (_.isNaN(parsedAge)) {
              return false;
            }
            if (!(parsedAge >= 18)) {
              return false;
            }
            return true;
          };
        })(this);
        validateDisease = (function(_this) {
          return function() {
            var currentGender, _ref;
            if (_ref = attributes.disease, __indexOf.call(attributes.diseases.models, _ref) < 0) {
              return false;
            }

            /*
            Check if current disease is valid for current gender
             */
            currentGender = attributes.gender;
            if (!attributes.disease.get(currentGender)) {
              return false.disease;
            }
            return true;
          };
        })(this);
        errors = {};
        if (!validateGender()) {
          errors.gender = "Select your gender.";
        }
        if (!validateAge()) {
          errors.age = "Enter your age.";
        }
        if (!validateDisease()) {
          errors.disease = "Choose your disease..";
        }
        return errors;
      },
      validateSecondStep: function(attributes) {
        var errors, validateIncome, validateInsurance, validateRent, validateSeverity;
        validateRent = (function(_this) {
          return function() {
            if (!(attributes.rent instanceof Rent)) {
              return false;
            }
            if (!_this.rents.findWhere({
              id: attributes.rent.get("id")
            })) {
              return false;
            }
            return true;
          };
        })(this);
        validateIncome = (function(_this) {
          return function() {
            if (!(attributes.income instanceof Income)) {
              return false;
            }
            if (!_this.incomes.findWhere({
              id: attributes.income.get("id")
            })) {
              return false;
            }
            return true;
          };
        })(this);
        validateInsurance = (function(_this) {
          return function() {
            if (!(attributes.insurance instanceof Insurance)) {
              return false;
            }
            if (!_this.insurances.findWhere({
              id: attributes.insurance.get("id")
            })) {
              return false;
            }
            return true;
          };
        })(this);
        validateSeverity = (function(_this) {
          return function() {
            var _ref;
            if (_ref = attributes.severity, __indexOf.call(_this._severities, _ref) < 0) {
              return false;
            }
            return true;
          };
        })(this);
        errors = this.validateFirstStep(attributes);
        if (!validateIncome()) {
          errors.income = "Choose your income";
        }
        if (!validateRent()) {
          errors.rent = "Choose your rent";
        }
        if (!validateInsurance()) {
          errors.insurance = "Choose your coverage.";
        }
        if (!validateSeverity()) {
          errors.severity = "Choose the severity of your disease.";
        }
        return errors;
      },
      validateThirdStep: function(attributes) {
        return this.validateSecondStep(attributes);
      },

      /*
      Return medical costs, duration etc. for current disease and severity
       */
      getDiseaseData: function(severity) {
        var disease;
        if (severity == null) {
          severity = this.get("severity");
        }
        disease = this.get("disease");
        if (disease) {
          return disease.get("severities")[severity];
        }
      },
      getters: {

        /*
          Return the coverage of the user's current major medical
         */
        coverage: function() {
          var insurance;
          if (!(insurance = this.get("insurance"))) {
            return void 0;
          }
          return insurance.get("coverage");
        },
        duration: function() {
          var data;
          data = this.getDiseaseData();
          if (data) {
            return data.duration;
          }
        },
        diseaseId: function() {
          var disease;
          disease = this.get("disease");
          if (disease) {
            return disease.get("id");
          }
        },
        diseaseTexts: function() {
          var severity, texts, _i, _len, _ref;
          texts = {};
          _ref = this._severities;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            severity = _ref[_i];
            texts[severity] = this.getDiseaseData(severity).medicalText;
          }
          return texts;
        },
        familyId: function() {
          var family;
          family = this.get("family");
          if (family) {
            return family.get("id");
          }
        },
        familyValue: function() {
          var family;
          family = this.get("family");
          if (family) {
            return family.get("value");
          }
        },

        /*
        Dynamically compute current household costs.
        Influencing factors are income, rent, family structure and duration of disease.
         */
        household: function() {
          var checkIncomeRange, data, duration, familyPercent, incomeRange, incomeValue, rentValue, _avg;
          incomeValue = this.get("incomeValue");
          rentValue = this.get("rentValue");
          familyPercent = this.get("familyValue");
          data = this.getDiseaseData();
          if (!data) {
            return 0;
          }
          duration = data.duration;
          incomeRange = [[999.92, 108], [2083.25, 108], [4166.58, 108], [5833.25, 108], [6666.58, 78], [8333.25, 73], [9999.92, 70], [12499.92, 65], [16666.58, 50], [20833.25, 50], [99999, 50]];
          checkIncomeRange = function(x) {
            var i, income, _baseRange, _i, _len, _result;
            _baseRange = 0;
            for (i = _i = 0, _len = incomeRange.length; _i < _len; i = ++_i) {
              income = incomeRange[i];
              if (x >= _baseRange && x <= income[0]) {
                _result = [i, income[1]];
              }
              _baseRange = income[0];
            }
            return _result;
          };
          _avg = (checkIncomeRange(incomeValue)[1] + familyPercent) / 200;
          return Math.round(((_avg * incomeValue) + rentValue) * duration);
        },
        howAflacHelps: function() {
          var disease, effectivePolicies, policies, policyType, severity;
          disease = this.get("disease");
          if (!disease) {
            return 0;
          }
          severity = this.get("severity" || "moderate");
          policyType = this.get("policyType");
          switch (policyType) {
            case "individual":
              policies = disease.get("individualPolicies");
              break;
            case "group":
              policies = disease.get("groupPolicies");
              break;
            default:
              throw "Error: Invalid policy type";
          }
          effectivePolicies = _.filter(policies.cappedToLimit(), function(policy) {
            return policy.get("checked");
          });
          return _.reduce(effectivePolicies, (function(payOut, policy) {
            return payOut + policy.get(severity);
          }), 0);
        },
        incomeId: function() {
          var income;
          income = this.get("income");
          if (income) {
            return income.get("id");
          }
        },
        incomeValue: function() {
          var income;
          income = this.get("income");
          if (income) {
            return income.get("value");
          }
        },
        insuranceId: function() {
          var insurance;
          insurance = this.get("insurance");
          if (insurance) {
            return insurance.get("id");
          }
        },
        insuranceLevel: function() {
          var insurance;
          insurance = this.get("insurance");
          if (typeof insurance !== string) {
            return void 0;
          }
          return insurance.split("-")[1];
        },
        insuranceOption: function() {
          var insurance;
          insurance = this.get("insurance");
          if (typeof insurance !== string) {
            return void 0;
          }
          return insurance.split("-")[0];
        },
        insuranceType: function() {
          var insurance;
          insurance = this.get("insurance");
          if (insurance) {
            return insurance.get("type");
          }
        },

        /*
        Dynamically compute current medical costs.
        - If selected insurance is advanced (app's default case),
        specific values such as prescriptions, doctor visits, hospital stays etc. are incorporated into the calculation.
        
        - If an insurance plan is selected, a more basic calculation is conducted,
        based on estimated medical cost and coverage for the selected plan.
         */
        medical: function() {
          var brandDrugCosts, diagnosticsCosts, emergencyRoomCosts, flatCosts1, flatCosts2, genericDrugCosts, imagingCosts, insurance, insurancePercent, primaryCareCosts, remainingDeductible, specialistCosts, specialtyDrugCosts, surgeryCosts, urgentCareCosts;
          insurance = this.get("insurance");
          if (insurance && insurance.get("type") !== "advanced") {
            return Math.round(this.getDiseaseData().medical * (100 - insurance.get("coverage")) / 100);
          } else {
            if (!this.get("disease")) {
              return 0;
            }
            remainingDeductible = this.get("availableDeductible") - this.get("usedDeductible");
            insurancePercent = this.get("insuranceAfterDeductible") / 100;
            primaryCareCosts = this.get("primaryCarePer") * this.get("primaryCareNum");
            specialistCosts = this.get("specialistPer") * this.get("specialistNum");
            genericDrugCosts = this.get("genericDrugPer") * this.get("genericDrugNum");
            brandDrugCosts = this.get("brandDrugPer") * this.get("brandDrugNum");
            specialtyDrugCosts = this.get("specialtyDrugPer") * this.get("specialtyDrugNum");
            flatCosts1 = primaryCareCosts + specialistCosts + genericDrugCosts + brandDrugCosts + specialtyDrugCosts;
            diagnosticsCosts = this.get("diagnosticsPer") * this.get("diagnosticsNum");
            imagingCosts = this.get("imagingPer") * this.get("imagingNum");
            emergencyRoomCosts = this.get("erPer") * this.get("erNum");
            urgentCareCosts = this.get("urgentPer") * this.get("urgentNum");
            flatCosts2 = diagnosticsCosts + imagingCosts + emergencyRoomCosts + urgentCareCosts;
            surgeryCosts = (this.get("hospital") / 100) * this.getDiseaseData().medical;
            if (flatCosts2 > remainingDeductible) {
              return Math.round(remainingDeductible + flatCosts1 + ((1 - insurancePercent) * flatCosts2) + surgeryCosts);
            } else {
              return Math.round(flatCosts1 + flatCosts2 + surgeryCosts);
            }
          }
        },
        oop: function() {
          var data;
          data = this.getDiseaseData();
          if (data) {
            return data.oop;
          }
        },
        policies: function() {
          var disease, policies, policyType;
          if (!(disease = this.get("disease"))) {
            return false;
          }
          if (!(policyType = this.get("policyType"))) {
            return false;
          }
          switch (policyType) {
            case "individual":
              return policies = disease.get("individualPolicies");
            case "group":
              return policies = disease.get("groupPolicies");
          }
        },
        remainingExpenses: function() {
          var coverage, total;
          total = this.get("total");
          coverage = this.get("howAflacHelps");
          if (!(_.isNumber(total) && _.isNumber(coverage))) {
            return 0;
          }
          return Math.max(0, total - coverage);
        },
        rentId: function() {
          var rent;
          rent = this.get("rent");
          if (rent) {
            return rent.get("id");
          }
        },
        rentValue: function() {
          var rent;
          rent = this.get("rent");
          if (rent) {
            return rent.get("value");
          }
        },
        severities: function() {
          return this._severities;
        },
        texts: function() {
          var disease;
          disease = this.get("disease");
          if (disease) {
            return disease.get("expenseText");
          } else {
            return {
              medical: "",
              household: "",
              oop: ""
            };
          }
        },
        total: function() {
          return this.get("medical") + this.get("household") + this.get("oop");
        }
      },
      setters: {
        age: function(val) {
          return parseInt(val, 10);
        },
        disease: function(val) {
          var disease;
          if (val instanceof Disease) {
            disease = val;
          } else {
            disease = this.get("diseases").findWhere({
              id: val
            });
          }
          if (disease instanceof Disease) {
            disease.set("checked", true);
          }
          return disease;
        },
        income: function(val) {
          if (val instanceof Income) {
            return val;
          } else {
            return this.incomes.findWhere({
              id: val
            });
          }
        },
        insurance: function(val) {
          if (val instanceof Insurance) {
            return val;
          } else {
            return this.insurances.findWhere({
              id: val
            });
          }
        },
        rent: function(val) {
          if (val instanceof Rent) {
            return val;
          } else {
            return this.rents.findWhere({
              id: val
            });
          }
        },
        family: function(val) {
          if (val instanceof Family) {
            return val;
          } else {
            return this.families.findWhere({
              id: val
            });
          }
        },
        availableDeductible: function(val) {
          return parseInt(val, 10);
        },
        brandDrugPer: function(val) {
          return parseInt(val, 10);
        },
        brandDrugNum: function(val) {
          return parseInt(val, 10);
        },
        usedDeductible: function(val) {
          return parseInt(val, 10);
        },
        insuranceAfterDeductible: function(val) {
          return parseInt(val, 10);
        },
        primaryCarePer: function(val) {
          return parseInt(val, 10);
        },
        primaryCareNum: function(val) {
          return parseInt(val, 10);
        },
        specialistPer: function(val) {
          return parseInt(val, 10);
        },
        specialistNum: function(val) {
          return parseInt(val, 10);
        },
        genericDrugPer: function(val) {
          return parseInt(val, 10);
        },
        genericDrugNum: function(val) {
          return parseInt(val, 10);
        },
        hospital: function(val) {
          return parseInt(val, 10);
        },
        specialtyDrugPer: function(val) {
          return parseInt(val, 10);
        },
        specialtyDrugNum: function(val) {
          return parseInt(val, 10);
        },
        diagnosticsPer: function(val) {
          return parseInt(val, 10);
        },
        diagnosticsNum: function(val) {
          return parseInt(val, 10);
        },
        imagingPer: function(val) {
          return parseInt(val, 10);
        },
        imagingNum: function(val) {
          return parseInt(val, 10);
        },
        erPer: function(val) {
          return parseInt(val, 10);
        },
        erNum: function(val) {
          return parseInt(val, 10);
        },
        urgentPer: function(val) {
          return parseInt(val, 10);
        },
        urgentNum: function(val) {
          return parseInt(val, 10);
        }
      },	
      _severities: ["mild", "moderate", "severe"]

    });
  });

}).call(this);
