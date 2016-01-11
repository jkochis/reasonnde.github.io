jq18.fn.parseURLs = function (options) {
    var settings = jq18.extend({
        allowWebpages: true,
        allowMedia: true
    }, options);

    var endpoints;
    jq18.getJSON("/_layouts/15/ShareSomething/getEndpoints.aspx", function (json) { endpoints = json; });

    var runParse = function (event) {
        if (!attachmentTypeSet) { // if something else hasn't been attached already
            if (event.type == "paste" || event.keyCode == 32) {
                var box = jq18(this);
                var re = new RegExp("((https?://)|(www\\.))[\\w-\\._~:/\\?%#\\[\\]@!\\$&'\\(\\)\\*\\+,;=]*", "i");
                //var re = new RegExp("((https?://)?(www\\.)?(?<!@)\\b\\w*?[a-z]{1}[a-z0-9-]*(\\.[a-z0-9/\\?=_#&%~:-]+)+)", "i");  //javascript doesn't support lookbehide so I have to exlude @ symbols later
                setTimeout(function () { // timeout allows the pasted data to enter the textbox before we retrieve it.
                    if (re.test(box.text())) { //if a url exists
                        if (box.text()[re.exec(box.text()).index - 1] != "@") {  //exclude urls preceded by @ (aka an email address)
                            var url = re.exec(box.text())[0];
                            var isMedia = false;
                            var isImage = false;
                            if (settings.allowMedia)
                                jq18.each(endpoints, function (i, endpoint) {
                                    var mediaRE = new RegExp(endpoint.url_re, "i");
                                    if (mediaRE.test(url)) { //if url is a media source
                                        isMedia = true;
                                        attachMedia(url, endpoint.endpoint_url);
                                        return false;
                                    } else {
                                        var imageRE = RegExp("\\.jpg$|\\.jpeg$|\\.png$|\\.gif$|\\.bmp$|\\.tif$", "i");
                                        if (imageRE.test(url)) { //if url points to an image
                                            isImage = true;
                                            attachImage(url);
                                            return false;
                                        }
                                    }
                                });
                            if (settings.allowWebpages && !isMedia && !isImage)
                                attachWebpage(url);
                        }
                    }
                }, 0);
            }
        }
    }

    return this.bind('keyup paste', runParse);
}