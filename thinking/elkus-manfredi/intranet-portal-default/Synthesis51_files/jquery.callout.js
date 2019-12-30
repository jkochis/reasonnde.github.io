jq18.fn.callout = function (options) {
    this.each(function () {
        var caller = this;
        if (options == "hide") {
            var cots = caller.callout;
            for (var c in cots) {
                cots[c].fadeOut(0);
            }
        } else if (options == "show") {
            var cots = caller.callout;
            for (var c in cots) {
                cots[c].fadeIn(0);
            }
            jq18(caller).callout("reorder");
        } else if (options == "destroy") {
            var cots = caller.callout;
            for (var c in cots) {
                cots[c].fadeOut(0, function () {
                    jq18(this).remove();
                });
            }
        } else if (options == "reorder") {
            var cots = caller.callout;
            var ltop = jq18(caller).offset().top;
            var lleft = jq18(caller).offset().left;
            for (var c in cots) {
                if (cots[c].is(':visible')) {
                    var ctop = cots[c].offset().top;
                    var cleft = cots[c].offset().left;
                    var ltdiff = ltop - cots[c].attr("top");
                    var lldiff = lleft - cots[c].attr("left");
                    cots[c].css("top", ctop + ltdiff);
                    cots[c].css("left", cleft + lldiff);
                    cots[c].attr("top", ltop);
                    cots[c].attr("left", lleft);
                }
            }
        } else {
            options = jq18.extend({
                width: 'auto',
                height: 'auto',
                position: 'top',
                align: 'center',
                pointer: 'center',
                msg: 'Example Text',
                css: '',
                show: 'true'
            }, options || {});

            var position = options.position;
            var width = options.width;
            var height = options.height;
            var msg = options.msg;
            var align = options.align;
            var pointer = options.pointer;
            var css = options.css;

            var jq18co = jq18("<div class='callout_main'></div>");
            var jq18cont = jq18("<div class='callout " + css + " callout_cont_" + position + "'>" + msg + "</div>");
            var jq18tri = jq18("<div class='callout_tri callout_" + position + "'></div>");
            var jq18tri2 = jq18("<div></div>");
            jq18tri.append(jq18tri2);

            //Define default style
            jq18co.css("position", "absolute").hide();
            jq18cont.css("zIndex", 11);
            jq18tri.css("border-color", "#666666 transparent transparent transparent")
             .css("border-style", "solid")
             .css("height", 0)
             .css("width", 0)
             .css("zIndex", 10);
            jq18tri2.css("position", "relative")
             .css("border-style", "solid")
             .css("height", 0)
             .css("width", 0)
             .css("zIndex", 12);

            jq18co.append(jq18cont);
            if (position == "bottom" || position == "right")
                jq18co.prepend(jq18tri);
            else
                jq18co.append(jq18tri);

            jq18("body").append(jq18co);
            //Get callout style
            var importStyle = new Array(
                    "backgroundColor",
                    "borderTopColor", "borderLeftColor", "borderRightColor", "borderBottomColor",
                    "borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth",
                    "marginTop", "marginLeft", "marginRight", "marginBottom"
            );
            var s = {} //style object
            for (var i in importStyle) {
                s[importStyle[i]] = jq18cont.style(importStyle[i]);
            }

            jq18co.css("marginLeft", s.marginLeft).css("marginRight", s.marginRight).css("marginTop", s.marginTop).css("marginBottom", s.marginBottom);
            jq18cont.css("margin", 0);
            // hide it fron the screen temporally to perform metrics
            var left = -1000;
            var top = -1000;
            jq18co.css("left", left);
            jq18co.css("top", top);
            jq18co.show();

            if (width != 'auto') jq18co.css("width", width);
            if (height != 'auto') jq18cont.css("height", height);

            width = jq18cont.width();
            height = jq18cont.height();
            var ttop = jq18(caller).offset().top;
            var tleft = jq18(caller).offset().left;
            var twidth = jq18(caller).width();
            var theight = jq18(caller).height();
            jq18co.attr("left", tleft);
            jq18co.attr("top", ttop);

            // Restore non-sense settings
            if (position == "top" || position == "bottom") {
                if (align == "bottom" || align == "top") align = "center";
                if (pointer == "bottom" || pointer == "top") pointer = "center";
            } else {
                if (align == "left" || align == "right") align = "center";
                if (pointer == "left" || pointer == "right") pointer = "center";
            }
            switch (pointer) {
                case "none": jq18tri.hide(); break;
                case "left": jq18tri.css("marginLeft", 10); break;
                case "right": jq18tri.css("marginLeft", (width > 18) ? width - 10 - 8 : 0); break;
                case "top": jq18tri.css("top", 20); break;  //--------TRIANGLE HEIGHT
                case "bottom": jq18tri.css("top", (height > 18) ? height - 10 - 8 : 0); break;
            }
            switch (align) {
                case "left": left = tleft; break;
                case "right": left = tleft + twidth - width - 8; break; //why 8?
                case "top": top = ttop; break;
                case "bottom": top = ttop + theight - height - 10; break; //why 10?
            }
            switch (position) {
                case "top":
                case "bottom":
                    if (position == "top") {
                        top = ttop - height - 25 //25: just a margin (+ triangle height)
                        jq18tri.css("marginTop", -1).css("borderTopColor", s.borderBottomColor);
                        jq18tri2.css("borderTopColor", s.backgroundColor).css("left", -10).css("top", -12);
                    } else {
                        top = ttop + theight + 5; //5: just a margin
                        jq18tri.css("marginBottom", -1).css("borderBottomColor", s.borderTopColor);
                        jq18tri2.css("borderBottomColor", s.backgroundColor).css("left", -10).css("top", -8);
                    }
                    if (align == "center") left = tleft + (twidth / 2) - (width / 2);
                    if (pointer == "center")
                        jq18tri.css("marginLeft", (width / 2) - 8); //8: half of the triangle
                    else if (pointer == "left" && align == "right")
                        left = tleft + (twidth) - 25; //25: slighly to the left
                    else if (pointer == "right" && align == "left")
                        left = tleft - width + 25; //25: slighly to the right

                    if (jq18.browser.opera) jq18tri2.hide(); //TODO: problem displaying tri2 in bottom and top
                    break;
                case "left":
                case "right":
                    if (position == "left") {
                        left = tleft - width - 26; // BOX POSSITION
                        jq18tri.css("left", width + 2) //TRI POSITION
                        .css("border-color", s.borderLeftColor + " transparent transparent transparent")
                        .css("border-width", "10px 20px 10px 0px");
                        jq18tri2.css("border-color", s.backgroundColor + " transparent transparent transparent")
                        .css("border-width", "10px 16px 10px 0px")
                        .css("left", -1)
                        .css("top", -9);
                    } else {
                        left = tleft + twidth + 20;
                        jq18tri.css("left", -20)
                        .css("border-color", s.borderLeftColor + " transparent transparent transparent")
                        .css("border-width", "10px 0px 10px 20px");
                        jq18tri2.css("position", "relative")
                        .css("border-color", s.backgroundColor + " transparent transparent transparent")
                        .css("border-width", "10px 0px 10px 20px")
                        .css("left", -16)
                        .css("top", -9);
                    }
                    jq18tri.css("position", "absolute");
                    if (align == "center") top = ttop + (theight / 2) - (height / 2) - 6; //6: adjust height
                    if (pointer == "center")
                        jq18tri.css("top", (height / 2) - 4); //2: adjust single line
                    else if (pointer == "top" && align == "bottom")
                        top = ttop + theight - 30;  //25: slighly to the top
                    else if (pointer == "bottom" && align == "top")
                        top = ttop - height + 20; //25: slighly to the bottom
                    break;
            }
            //Hide it and show it gracefuly
            jq18co.hide();
            jq18co.css("left", left);
            jq18co.css("top", top - 14);
            if (options.show) jq18co.fadeIn(0);
            if (caller.callout == undefined) {
                caller.callout = new Array();
                jq18(window).bind("resize", function resizeWindow(e) {
                    jq18(caller).callout("reorder");
                });
            }
            caller.callout.push(jq18co);
        }
    });
    jq18(".callout_main").mouseleave(function () {
        jq18("a").callout("destroy");
    });
    return this;
}
// From the net (unknown author) and converted by A.Lepe
jq18.fn.style = function (property) { var el = this[0]; if (el.currentStyle) return el.currentStyle[property]; else if (document.defaultView && document.defaultView.getComputedStyle) return document.defaultView.getComputedStyle(el, "")[property]; else return el.style[property]; }