
/*
  Class: Backbone.GSModel
  Extends: Backbone.Model
  This extension of Backbone.Model allows for custom setters and getters.
 */

(function() {
  define(["backbone"], function(Backbone) {
    return Backbone.GSModel = Backbone.Model.extend({
      get: function(attr) {
        if (_.isFunction(this.getters[attr])) {
          return this.getters[attr].call(this);
        }
        return Backbone.Model.prototype.get.call(this, attr);
      },
      set: function(key, value, options) {
        var attr, attrs;
        if (_.isObject(key) || key === null) {
          attrs = key;
          options = value;
        } else {
          attrs = {};
          attrs[key] = value;
        }
        options = options || {};
        for (attr in attrs) {
          if (_.isUndefined(attrs[attr]) || _.isNull(attrs[attr])) {
            delete attrs[attr];
            continue;
          }
          if (_.isFunction(this.setters[attr])) {
            attrs[attr] = this.setters[attr].call(this, attrs[attr], options);
          }
        }
        return Backbone.Model.prototype.set.call(this, attrs, options);
      },

      /*
        Add a function as a setters property, named after an attribute of the model.
        The function's first argument is the value to be assigned.
        It's return value is what will actually be assigned to the model.
       */
      setters: {},

      /*
        Add a function as a getters property, named after an attribute of the model.
        It's return value is what will be returned by the get call for this attribute.
       */
      getters: {}
    });
  });

}).call(this);
