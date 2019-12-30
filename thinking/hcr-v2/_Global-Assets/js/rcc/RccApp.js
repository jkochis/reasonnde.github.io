
/*
Kick off the application.
 */

(function() {
  define(["underscore", "backbone", "rcc/rcc", "rcc/router", "rcc/models/DataModel", "rcc/controllers/AppController"], function(_, Backbone, rcc, Router, DataModel, AppController) {
    var RccApp;
    return RccApp = {
      build: function() {

        /*
        Define on the application namespace:
        - vent:           Event mediation object that can be triggered or listened to
        - router:         Global app router
        - model:          Global application model
        - appController:  Global app controller
         */
        window.rcc = rcc;
        rcc.vent = _.extend({}, Backbone.Events);
        rcc.model = new DataModel();
        rcc.router = new Router();
        rcc.appController = new AppController();

        /*
        Begin the routing (without HTML5 History API support),
        set the root folder to '/' by default.
         */
        Backbone.history.start({
          pushState: false,
          root: rcc.root
        });
        return rcc.model.trigger("change");
      }
    };
  });

}).call(this);
