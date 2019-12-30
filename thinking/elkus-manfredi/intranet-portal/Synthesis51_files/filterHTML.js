jq18.fn.filterHTML = function (stripAll) {

    var acceptableTags = ["u", "b", "strong", "em", "i", "sub", "sup", "strike", "s", "del", "br", "br ", "p", "ul", "li", "ol"];
    var acceptableAttr = ["href", "class"];
    var runFilter = function (event) {
        if (event.type == "paste") {
            var box = jq18(this);
            setTimeout(function () { // timeout allows the pasted data to enter the textbox before we retrieve it.
                box.find('[class!="ka_inlineTag"]').each(function () {
                    var elem = this;
                    var name = elem.nodeName.toLowerCase();
                    if (stripAll || jq18.inArray(name, acceptableTags) == -1) {
                        if (jq18(elem).contents().length == 0) {
                            jq18(elem).remove();
                            return true;
                        }
                        else{
                            jq18(elem).contents().unwrap();
                        }
                    }
                    else {
                        var attrToRem = new Array();
                        jq18.each(elem.attributes, function (i, attrib) {
                            if (jq18.inArray(attrib.name, acceptableAttr) == -1)
                                attrToRem.push(attrib.name);
                        });
                        jq18.each(attrToRem, function (i, attName) {
                            elem.removeAttribute(attName);
                        });
                    }
                });
            }, 0);
        }
    }

    return this.bind('paste', runFilter);
}


