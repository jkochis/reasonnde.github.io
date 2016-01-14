jq18.fn.limitMaxlength = function (options) {

    var settings = jq18.extend({
        attribute: "maxlength",
        onLimit: function () { },
        onEdit: function () { },
        onBlur: function () { }
    }, options);

    // Event handler to limit the textarea
    var onEdit = function () {
        var box = jq18(this);
        var maxlength = parseInt(box.attr(settings.attribute));
        var textLen = (box.text() != "Subject" && box.text() != "Body") ? box.text().length : 0;
        if (textLen > maxlength) {
            // Call the onlimit handler within the scope of the textarea
            jq18.proxy(settings.onLimit, this)();
        }

        // Call the onEdit handler within the scope of the textarea
        jq18.proxy(settings.onEdit, this)(maxlength - textLen);
    }

    // Call the onBlur handler within the scope of the textarea
    var onBlur = function () { jq18.proxy(settings.onBlur, this)(); }

    this.each(onEdit);

    return this.keyup(onEdit).focus(onEdit).blur(onBlur).live('input paste', onEdit);
}