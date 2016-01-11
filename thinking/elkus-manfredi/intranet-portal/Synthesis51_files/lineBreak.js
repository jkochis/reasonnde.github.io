jq18.fn.lineBreak = function () {
    if (jq18.browser.msie && navigator.userAgent.indexOf("Trident/7.0") < 0) { //IE that isn't 11
        return this.each(function () {
            jq18(this).keypress(
                function (e) {
                    if (e.keyCode == 13) {
                        var sel = rangy.getSelection();
                        var range = sel.getRangeAt(0);
                        var br = document.createElement('br');
                        range.insertNode(br);
                        range.collapseAfter(br);
                        sel.setSingleRange(range);
                        return false;
                    }
                }
            );
        });
    } else if (jq18.browser.chrome || jq18.browser.webkit || navigator.userAgent.indexOf("Trident/7.0") > -1) { //chrome,safari,IE11
        return this.each(function () {
            jq18(this).keypress(
                function (e) {
                    if (e.keyCode == 13) {
                        var sel = rangy.getSelection();
                        var range = sel.getRangeAt(0);
                        if (range.commonAncestorContainer.className != 'ka_newCommentBox' && range.commonAncestorContainer.id != "shareBox")
                            var needBr = true;
                        var br = document.createElement('br');
                        range.insertNode(br);
                        range.collapseAfter(br);
                        if (needBr && jq18.browser.chrome || jq18.browser.webkit)
                            range.insertNode(document.createElement('br'));
                        else if (needBr && navigator.userAgent.indexOf("Trident/7.0") > -1)
                            range.insertNode(document.createTextNode('\u200b')); //Zero Width Space
                        sel.setSingleRange(range);
                        return false;
                    }
                }
            );
        });
    }
    else
        return this;
}