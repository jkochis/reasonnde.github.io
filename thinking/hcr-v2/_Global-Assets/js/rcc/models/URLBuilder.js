
/*
  Class: URLBuilder
  Extends: Object
  Builds a string representing a relative URL from an array of arguments.
  The arguments are concatenated into the relative URL until any argument cannot be added (bc. of being invalid).
  After this, the concatenation is not continued.
 */

(function() {
  define(["jquery", "underscore"], function($, _) {
    var URLBuilder;
    return URLBuilder = (function() {
      function URLBuilder(segments, options) {
        this.trailingSlash = !!options.trailingSlash;
        this.leadingSlash = !!options.leadingSlash;
        this.assembleURL(segments);
        return this.url;
      }

      URLBuilder.prototype.get = function() {
        return this.url;
      };

      URLBuilder.prototype.assembleURL = function(segments) {
        var segment, _i, _len;
        this.url = "";
        for (_i = 0, _len = segments.length; _i < _len; _i++) {
          segment = segments[_i];
          if (segment == null) {
            break;
          }
          if (("" + segment) === "NaN") {
            break;
          }
          this.url += "/" + segment;
        }
        if (this.leadingSlash) {
          this.url = this.url.substr(1);
        }
        if (this.trailingSlash) {
          return this.url = this.url.substr(0, this.url.length - 2);
        }
      };

      return URLBuilder;

    })();
  });

}).call(this);
