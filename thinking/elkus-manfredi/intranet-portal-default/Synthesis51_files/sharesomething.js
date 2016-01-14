function getDefaultTags() {
    var url = "/_layouts/15/NexusAPIProxy/GetDefaultMentions.ashx";
    if (window.location.href.indexOf('?') > -1) {
        var urlBits = window.location.href.split("?");
        var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        url += "?url=" + encodeURIComponent(urlBits[0]) + "&" + urlBits[1];
    } else {
        url += "?url=" + encodeURIComponent(window.location.href)
    }
    jq18.getJSON(url, setDefaultTags)
    .error(function (jqXHR, textStatus, errorThrown) {
        setJsonTags("[]");
        alert(jqXHR.responseText.substring(0, jqXHR.responseText.length > 100 ? 100 : jqXHR.responseText.length));
    });
}
function setDefaultTags(tags) {
    var jsonTags = [];
    jq18.each(jq18(tags), function (i, tag) {
        tagSuggestionCaller = jq18('div#addTagsBox_Share');
        addTagIfNotAlready(tagSuggestionCaller, tag.EntityType, tag.EntityID, tag.EntityName);
        jsonTags.push({ EntityType: tag.EntityType, EntityID: tag.EntityID, Deleted: tag.Deleted });
    });
    setJsonTags(JSON.stringify(jsonTags));
}
function attachMedia(media_url, endpoint_url) {
    jq18("#attachmentName").text(media_url);
    jq18(".tbWebpageURL").val(media_url);
    try {
        // We have to use getoEmbed.aspx as a proxy to get around cross-domain scripting
        jq18.getJSON("/_layouts/15/ShareSomething/getoEmbed.aspx", { media_url: encodeURIComponent(media_url), endpoint_url: endpoint_url }, function (oEmbed) {
            if (!oEmbed.type) //if no type then oEmbed didn't work
                attachWebpage(media_url);
            else if (oEmbed.type == "video" && oEmbed.provider_name == "OpenAsset") {
                attachOpenAssetVideo(media_url, oEmbed);
            } else {
                jq18("#attachmentName").hide();//removed this in 4.5
                jq18(".ka_shareAttachmentIcon").hide();//removed this in 4.5
                jq18('#tbAttachmentData').val(JSON.stringify(oEmbed));
                if (oEmbed.title != null)
                    jq18(".tbAttachmentName").val(oEmbed.title);
                else if (oEmbed["provider-name"] != null)
                    jq18(".tbAttachmentName").val(oEmbed["provider-name"]);
                else if (oEmbed.provider_name != null)
                    jq18(".tbAttachmentName").val(oEmbed.provider_name);

                if (oEmbed.type == "video" || oEmbed.type == "rich") {
                    if (oEmbed.provider_url && oEmbed.provider_url.indexOf('youtube') > -1) {
                        var embedObj = jq18(oEmbed.html);
                        embedObj.attr('src', embedObj.attr('src') + '&wmode=opaque');
                        jq18("#attachmentPreview").html('').append(embedObj);
                    }
                    else
                        jq18("#attachmentPreview").html(oEmbed.html);
                }
                else if (oEmbed.type == "photo")
                    jq18("#attachmentPreview").html("<a href='" + media_url + "' target='_blank'><img src='" + oEmbed.url + "' style='border:0px; max-width:500px;'/></a>");

                if (oEmbed.thumbnail_url)
                    jq18('.tbAttachmentThumbnailUrl').val(oEmbed.thumbnail_url);

                jq18(".tbWebpageURL").val(media_url);

                if (oEmbed.type != "link") {
                    jq18(".tbAttachmentPreview").val(jq18("#attachmentPreview").html());
                    jq18('#cancelAttachment').slideDown();
                    jq18("#divAttachment").slideDown();
                    if (oEmbed.type == "video")
                        setAttachmentType("Attached Video");
                    else
                        setAttachmentType("Attached Media");
                }
                else
                    attachWebpage(media_url);
                jq18('.ka_shareTools').hide();
                jq18('input.ka_shareButton').addClass('ka_buttonActive');
            }
        }).fail(function (jqxhr, textStatus, error) {
            attachWebpage(media_url)
        });
    } catch (e) { }
}
function webpageUrlEntered(e) {
    if (e.type == 'paste')
        setTimeout(function () { // timeout allows the pasted data to enter the textbox before we retrieve it.
            attachLink(jq18(e.target));
        }, 0);
    else if (e.which == 13 || e.which == 32) {//enter or space
        attachLink(jq18(e.target));
        return false;
    }
    return true;
}
function attachLink(box) {
    var url = jq18.trim(box.val());
    if (url == "+ add a link")
        return false;
    box.slideUp();
    var isMedia = false;
    var isImage = false;
    jq18.getJSON("/_layouts/15/ShareSomething/getEndpoints.aspx", function (json) {
        var endpoints = json;
        var re = new RegExp("((https?://)|(www\\.))\\S*", "i");
        jq18.each(endpoints, function (i, endpoint) {
            var mediaRE = new RegExp(endpoint.url_re, "i");
            if (mediaRE.test(url)) { //if url is a media source
                isMedia = true;
                attachMedia(url, endpoint.endpoint_url);
            }/* else {
                var imageRE = RegExp("\\.jpg$|\\.jpeg$|\\.png$|\\.gif$|\\.bmp$", "i");
                if (imageRE.test(url)) { //if url points to an image
                    isImage = true;
                    attachImage(url);
                }
                //todo: check content type of header to test for image
            }*/
        });
        if (!isMedia && !isImage)
            attachWebpage(url);
        jq18('.ka_shareTools').hide();
    });
}
function attachOpenAssetVideo(url, oEmbed) {
    jq18('input.ka_shareButton').addClass('ka_buttonActive');
    setAttachmentType("Attached Webpage");
    jq18('.ka_shareTools').hide();

    //PUT THE THUMBNAIL
    jq18('span.TotalImages').html("1");
    jq18('#loadTo').html('<a href="'+url+'" target="_blank"><div id="toLoad"><div id="pnlImageBrowser" class="imageBrowser play" style="height: 150px; position:relative"><img src="' + oEmbed.thumbnail_url + '" class="browseImage" num="1"><img src="/_layouts/15/KA Search/icons/videoIcon_40.png" class="play"></div></div></a><span class="TotalImages" style="display:none">1</span>');
    imageBrowserLoad();

    jq18('#tbAttachmentData').val(JSON.stringify(oEmbed));
    jq18('.tbWebpageURL').val(url);
    jq18("a[id$='_attachedWebTitleLbl']").html(oEmbed.title + " - OpenAsset").attr('href', url);
    jq18("input[id$='_attachedWebTitle']").val(oEmbed.title + " - OpenAsset");
    jq18("#divAttachedWebpage").show();
    jq18('#cancelAttachment').slideDown();
}
function attachWebpage(url) {
    jq18('input.ka_shareButton').addClass('ka_buttonActive');
    setAttachmentType("Attached Webpage");
    jq18('.ka_shareTools').hide();
    jq18('#loadTo').load("/_layouts/15/ShareSomething/pageImgBrowser.aspx?attachedURL=" + encodeURIComponent(url) + " #toLoad", function () {
        imageBrowserLoad();
    });
    jq18.getJSON('/_layouts/15/ShareSomething/PageScraper.ashx', { 'url': url }, function (d) {
        /*if (d.error) {
            alert(d.error);
            jq18('.ka_shareTools').show();
        }
        else {*/
            jq18('.tbWebpageURL').val(d.url);
            jq18("a[id$='_attachedWebTitleLbl']").html(d.title).attr('href', d.url);
            jq18("input[id$='_attachedWebTitle']").val(d.title);
            if (d.subTitle) {
                jq18("span[id$='_attachedWebSubTitleLbl']").html(d.subTitle);
                jq18("input[id$='_attachedWebSubTitle']").val(d.subTitle);
            }
            if (d.description) {
                jq18("span[id$='_attachedWebDescriptionLbl']").html(d.description);
                jq18("input[id$='_attachedWebDescription']").val(d.description);
            }
            jq18("#divAttachedWebpage").show();
            jq18('#cancelAttachment').slideDown();
        //}
    });
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return null;
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function shareBodyFocus(tbox) {
    if (tbox.text() == 'Body')
        tbox.html('');
}
function shareBodyBlur(tbox) {
    if (tbox.text().trim() == '')
        tbox.html('Body');
}
function shareFocus(box) {
    if (getJsonTags() == "")
        getDefaultTags();
    if (box.text() == 'Share Something') {
        box.animate({ 'min-height': '13px', 'padding-top': '5px' }, 400, null).html('').blur();
        box.parent().removeClass('closed');
        addTags(jq18('div#addTagsBox_Share'));
        box.siblings("div#shareBox, div#shareFooter, div#addTagsBox_Share, div.ka_cancelShareX").slideDown();
        setShareToolActions();
    }
    else if (box.text() == 'Title')
        box.html('');
}
function shareReset(box) {
    box.animate({'min-height':'20px', 'padding-top':'9px'}, 400, null)
    .html('Share Something')
    .attr('rows', '2')
    .siblings('div,input').slideUp();
    box.parent().addClass('closed');
}
function shareBlur(box) {
    if (box.text().trim() == '') {
        box.html('Title');
    }
}
function setShareToolActions() {
    jq18('#sharePic').unbind().click(function() {
        shareToolAction_Pic(jq18(this));
    });
    jq18('#shareFile').unbind().click(function () {
        shareToolAction_File(jq18(this));
    });
    jq18('#shareLink').unbind().click(function () {
        shareToolAction_Link(jq18(this));
    });
    jq18('.shareBlog').unbind().click(function () {
        shareToolAction_Blog(jq18(this));
    });
}
function shareToolAction_Pic(caller) {
    if (jq18('.tbWebpageURL').is(':visible')) {
        jq18('.tbWebpageURL').slideUp('fast', function () { jq18('.ka_shareButton').addClass('ka_buttonActive'); });
    }
    if (jq18('div#shareToolActionPic').length > 0)
        jq18('div.ka_shareToolActions').remove();
    else {
        jq18('div.ka_shareToolActions').remove();
        var toolBox = document.createElement('div');
        toolBox.className = "ka_shareToolActions";
        jq18(toolBox)
            .attr('id', 'shareToolActionPic')
            .offset({ top: (caller.position().top + caller.height() + 15), left: (caller.position().left - 35) });

        var triFill = document.createElement('div');
        triFill.className = "ka_shareActionTriangleFill";
        toolBox.appendChild(triFill);
        var triBorder = document.createElement('div');
        triBorder.className = "ka_shareActionTriangleBorder";
        toolBox.appendChild(triBorder);

        var shareActionUp = document.createElement('div');
        shareActionUp.className = "ka_shareAction";
        var imgShareUp = document.createElement('img');
        imgShareUp.src = "/_layouts/15/ShareSomething/images/ka_up_arrow_17_20.png";
        shareActionUp.appendChild(imgShareUp);
        var txtShareUp = document.createElement('span');
        txtShareUp.innerHTML = "Upload an image from your computer.";
        shareActionUp.appendChild(txtShareUp);
        toolBox.appendChild(shareActionUp);

        var shareActionPicWeb = document.createElement('div');
        shareActionPicWeb.className = "ka_shareAction";
        var imgSharePicWeb = document.createElement('img');
        imgSharePicWeb.src = "/_layouts/15/ShareSomething/images/ka_link_19_20.png";

        shareActionPicWeb.appendChild(imgSharePicWeb);
        var txtSharePicWeb = document.createElement('span');
        txtSharePicWeb.innerHTML = "Upload an image from a URL.";
        shareActionPicWeb.appendChild(txtSharePicWeb);
        jq18(shareActionPicWeb).click(uploadWebImageClick);
        //toolBox.appendChild(shareActionPicWeb);

        caller.parent().append(toolBox);
        jq18(toolBox).css('position', ''); //IE fix when setting offset

        //file input for uploads
        var fileInput = document.createElement('input');
        
        jq18(fileInput)
            .attr('type', 'file')
            .attr('accept','image/*')
            .addClass('ka_fileInput')
            .height(jq18(shareActionUp).height()+10)
            .width(jq18(shareActionUp).width() + 10)
            .attr('title', '')
            .fileupload({
                url: '/_layouts/15/media/upload.ashx',
                type: 'POST',
                autoUpload: true,
                dataType: 'json',
                forceIframeTransport: jq18.browser.msie,
                dropZone: jq18('div#shareBox'),
                pasteZone: jq18('div#shareBox'),
                change: validateImages,
                drop: validateImages,
                paste: validateImages,
                add: function (e, data) {
                    var total_size = 0;
                    jq18.each(data.files, function (index, file) {
                        total_size = total_size + file.size;
                    });
                    if(total_size>10485760){//10mb
                        alert("Cannot upload files greater than 10MB");
                    }
                    else{
                        data.submit()
                    }
                },
                send: function (e, data) {
                    //progBox.html(data.files[0].name).prependTo('div#fileUploadContainer');
                    var imgID = getImgID(data.files[0].name, data.files[0].size, data.files[0].lastModified);
                    var progText = jq18(document.createElement('span'))
                        .addClass('ka_progressText')
                        .attr('id', "text_" + imgID);
                    var progBox = jq18(document.createElement('div'))
                        .attr('id', "box_" + imgID)
                        .addClass('ka_progressBox')
                        .after(progText)
                        .prependTo('div#fileUploadContainer');
                    var progBar = jq18(document.createElement('div'))
                        .addClass('ka_progressBar')
                        .appendTo(progBox);
                    jq18('div#fileUploadContainer').show();
                    jq18(toolBox).remove();

                    jq18('.ka_shareTools').hide();
                    jq18('.tbWebpageURL').slideUp();
                    jq18('input.ka_shareButton').attr('disabled', 'disabled').removeClass('ka_buttonActive');
                },
                progress: function (e, data) {
                    var imgID = getImgID(data.files[0].name, data.files[0].size, data.files[0].lastModified);
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var progBar = jq18('div#box_' + imgID + ' div');
                    var progText = jq18('span#text_' + imgID);
                    progBar.css('width', progress + '%');
                    if (progress < 100)
                        progText.text('Uploading ' + progress + '%');
                    else {
                        imgUpInfinteProgress(progBar);
                        progText.text('Processing...');
                    }
                },
                done: function (e, data) {
                    var imgID = getImgID(data.files[0].name, data.files[0].size, data.files[0].lastModified);
                    var progText = jq18('span#text_' + imgID);
                    var progBox = jq18('div#box_' + imgID);
                    if (data.result.Error) {
                        progText.text('Error uploading image.');
                        alert(data.result.Error);
                    } else {
                        jq18.each(data.result, function (index, file) {
                            attachUpMedia(file.MediaID);
                            jq18('input.ka_shareButton').removeAttr('disabled').addClass('ka_buttonActive');
                            progText.text('Resizing...');
                            var imgCheckInterval = setInterval(function () {
                                if (CheckImageExists(file.Url)) {
                                    clearInterval(imgCheckInterval);
                                    progBox.remove();
                                    progText.remove();
                                    var thumbLink = jq18('<a/>')
                                        .html('<img src=' + file.Url + ' />')
                                        .attr('href', file.Url.split('&size')[0])
                                        .attr('target', '_blank')
                                        .addClass('ka_shareImgThumb')
                                        .appendTo('div#fileUploadContainer');
                                    jq18('#cancelAttachment').slideDown();
                                }
                            }, 2000);
                        });
                    }
                },
                fail: function (e, data) {
                    var imgID = getImgID(data.files[0].name, data.files[0].size, data.files[0].lastModified);
                    var progText = jq18('span#text_' + imgID);
                    progText.text('Error uploading image.');
                    alert(data.errorThrown);
                }
            });
        //file input container
        var divFileContainer = document.createElement('div');
        jq18(divFileContainer)
        .attr('class', 'ka_fileContainer')
        .height(jq18(shareActionUp).height() + 10)
        .width(jq18(shareActionUp).width() + 10)
        .append(fileInput);
        jq18(shareActionUp).append(divFileContainer);

        //var fileMax = document.createElement('input');
        //jq18(fileMax).attr('type', 'hidden').attr('name', 'MAX_FILE_SIZE').val('5242880');
        //jq18(shareActionUp).append(fileMax);
    }
    function imgUpInfinteProgress(progBar) {
        function imgUpProgOut() {
            if (progBar.is(':visible')) {
                progBar.css('right', '0');
                progBar.animate({ width: 0 }, 3000, 'linear', imgUpProgIn);
            }
        }
        function imgUpProgIn() {
            if (progBar.is(':visible')) {
                progBar.css('right', '');
                progBar.animate({ width: '100%' }, 3000, 'linear', imgUpProgOut);
            }
        }
        imgUpProgOut();
    }
    var fileAdded = false;
    function validateImages(e, data) {
        if (employeeID != "C708D252-89CB-461D-A729-8FFF8BCDD972" && employeeID != "PWINN") {//for my testing only
            if (fileAdded) {
                data.files = [];
                console.log("image already added");
            }
            else if (data.files && data.files.length > 1) {
                data.files.splice(0, data.files.length - 1);
                console.log("just using one of the images");
            }
        }
        fileAdded = true;
    }
}
function getImgID(name, size, mod) {
    return size + mod;
}
function shareToolAction_File(caller) {
    if (jq18('.tbWebpageURL').is(':visible')) {
        jq18('.tbWebpageURL').slideUp('fast', function () { jq18('.ka_shareButton').addClass('ka_buttonActive'); });
    }
    if (jq18('div#shareToolActionFile').length > 0)
        jq18('div.ka_shareToolActions').remove();
    else {
        jq18('div.ka_shareToolActions').remove();
        var toolBox = document.createElement('div');
        toolBox.className = "ka_shareToolActions";
        jq18(toolBox)
            .attr('id', 'shareToolActionFile')
            .offset({ top: (caller.position().top + caller.height() + 15), left: (caller.position().left - 42) });

        var triFill = document.createElement('div');
        triFill.className = "ka_shareActionTriangleFill";
        toolBox.appendChild(triFill);
        var triBorder = document.createElement('div');
        triBorder.className = "ka_shareActionTriangleBorder";
        toolBox.appendChild(triBorder);

        var shareActionUp = document.createElement('div');
        shareActionUp.className = "ka_shareAction";
        var imgShareUp = document.createElement('img');
        imgShareUp.src = "/_layouts/15/ShareSomething/images/ka_up_arrow_17_20.png";
        shareActionUp.appendChild(imgShareUp);
        var txtShareUp = document.createElement('span');
        txtShareUp.innerHTML = "Upload a file from your computer.";
        shareActionUp.appendChild(txtShareUp);
        jq18(shareActionUp).click(function () { alert('Coming Soon'); });
        //toolBox.appendChild(shareActionUp);

        var shareActionPicWeb = document.createElement('div');
        shareActionPicWeb.className = "ka_shareAction";
        var imgSharePicWeb = document.createElement('img');
        imgSharePicWeb.src = "/_layouts/15/ShareSomething/images/ka_paperclip_18_16.png";
        shareActionPicWeb.appendChild(imgSharePicWeb);
        var txtSharePicWeb = document.createElement('span');
        txtSharePicWeb.innerHTML = "Select a file from a document library.";
        shareActionPicWeb.appendChild(txtSharePicWeb);
        jq18(shareActionPicWeb).click(shareFileFromLibClick);
        toolBox.appendChild(shareActionPicWeb);

        caller.parent().append(toolBox);
        jq18(toolBox).css('position', ''); //IE fix when setting offset
    }
}
function shareToolAction_Link(caller) {
    jq18('div.ka_shareToolActions').remove();
    if (jq18('.tbWebpageURL').is(':visible')) {
        jq18('.tbWebpageURL').slideUp('fast', function () { jq18('.ka_shareButton').addClass('ka_buttonActive'); });
    } else {
        jq18('.tbWebpageURL').slideDown('fast', function () { jq18('input.ka_shareButton').removeClass('ka_buttonActive'); });
    }
}
function shareToolAction_Blog(caller) {
    if (jq18('.tbWebpageURL').is(':visible')) {
        jq18('.tbWebpageURL').slideUp('fast', function () { jq18('.ka_shareButton').addClass('ka_buttonActive'); });
    }
    if (jq18('div#shareToolActionBlog').length > 0)
        jq18('div.ka_shareToolActions').remove();
    else {
        jq18('div.ka_shareToolActions').remove();
        var toolBox = document.createElement('div');
        toolBox.className = "ka_shareToolActions";
        jq18(toolBox)
            .attr('id','shareToolActionBlog')
            .offset({ top: (caller.position().top + caller.height() + 15), left: (caller.position().left - 37) });

        var triFill = document.createElement('div');
        triFill.className = "ka_shareActionTriangleFill";
        toolBox.appendChild(triFill);
        var triBorder = document.createElement('div');
        triBorder.className = "ka_shareActionTriangleBorder";
        toolBox.appendChild(triBorder);

        if (blogOptions == 'Both' || blogOptions == 'SharePoint') {
            var shareActionSP = document.createElement('div');
            shareActionSP.className = "ka_shareAction";
            var imgShareSP = document.createElement('span');
            jq18(imgShareSP).attr('class', 'ka_blogIcon');
            imgShareSP.innerHTML = "S";
            shareActionSP.appendChild(imgShareSP);
            var txtShareSP = document.createElement('span');
            txtShareSP.innerHTML = "Use SharePoint to write a blog post.";
            shareActionSP.appendChild(txtShareSP);
            jq18(shareActionSP).click(function () { newBlogPostSharePoint(); });
            toolBox.appendChild(shareActionSP);
        }
        if (jq18.browser.msie && (blogOptions == 'Both' || blogOptions == 'Word')) {
            var shareActionWord = document.createElement('div');
            shareActionWord.className = "ka_shareAction";
            var imgShareWord = document.createElement('span');
            jq18(imgShareWord).attr('class','ka_blogIcon');
            imgShareWord.innerHTML = "W";
            shareActionWord.appendChild(imgShareWord);
            var txtShareWord = document.createElement('span');
            txtShareWord.innerHTML = "Use Word to write a blog post.";
            shareActionWord.appendChild(txtShareWord);
            jq18(shareActionWord).click(function () { newBlogPostWord(); });
            toolBox.appendChild(shareActionWord);
        }

        caller.parent().append(toolBox);
        jq18(toolBox).css('position', ''); //IE fix when setting offset
    }
}
function uploadWebImageClick() {
    jq18(this).parent().remove();
    alert("Coming Soon");
}
function CheckImageExists(image_url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url.replace('proxy','exist'), false);
    http.send();
    return http.status == 200;
}
function shareFileFromLibClick() {
    jq18(this).parent().remove();
    jq18('#divAttachedWebpage').hide();
    if (jq18(".tbWebpageURL").is(":visible"))
        jq18(".tbWebpageURL").slideUp();
    hideObjects();
    jq18("#modalContentDocs").modal({
        opacity: 70,
        onClose: function () { jq18.modal.close(); unhideObjects(); }
    });
}
function btnShare_Click(btn) {
    if (savedSelection) rangy.removeMarkers(savedSelection); //remove any marker elements from caret position
    if (jq18('#shareTitle').text().trim() == "Title") {
        jq18('#shareTitle').addClass('ka_redBorder');
        jq18('span.ka_ShareErrorMessage').text('Please include a subject line.');
        return false;
    }
    /*else if (jq18('div#shareBox').text().trim() == "Body") {
        jq18('div#shareBox').css('border-color', 'red');
        jq18('span.ka_ShareErrorMessage').text('Please include the body of your update.');
        return false;
    }*/
    else if (!ValidateTags(JSON.parse(getJsonTags()))) {
        jq18('span.ka_ShareErrorMessage').text('Please add tag.');
        addTags(jq18('div#addTagsBox_Share'));
        return false;
    }
    else if (jq18('.tbWebpageURL').is(':visible') && jq18('.tbWebpageURL').val() != '+ add a link') {
        attachLink(jq18('.tbWebpageURL'));
        return false;
    }
    else {
        jq18('span.ka_ShareErrorMessage').text('');
        hfShareTitle.val(jq18('div#shareTitle').html());
        if (jq18('div#shareBox').text().trim() != "Body")
            hfShareText.val(jq18('div#shareBox').html());
        btn.attr('disabled', 'disabled').removeClass('ka_buttonActive').val('Loading...');
        return true;
    }
}
function attachUpMedia(mediaID) {
    var attachmentsJsonField = jq18('#fileUploadContainer').children('input[type="hidden"]');
    var attachmentsJson = JSON.parse(attachmentsJsonField.val());
    attachmentsJson.push({ Type: "image", ID: mediaID });
    attachmentsJsonField.val(JSON.stringify(attachmentsJson));
    setAttachmentType("Uploaded Media");
}
function newBlogPostSharePoint() {
    if (siteUrl != "/")
        OpenPopUpPage(siteUrl + '/Lists/Posts/NewPost.aspx', newBlogCallback);
    else
        OpenPopUpPage('/Lists/Posts/NewPost.aspx', newBlogCallback);
    cancelShare();
}
var newBlogCallback = function () {
    //addNotification("Loading...");
    setTimeout(function () {
        //window.location = window.location;
        jq18('div[id*="_pnlUpdates"]').each(function (i) {
            __doPostBack(this.id, 'clearIDs');
        });
    }, 3000);
}
function removeAttachment() {
    if (jq18.browser.msie && parseInt(jq18.browser.version) == 7) {
        jq18("#divAttachedWebpage").hide();
        jq18("#divAttachment").hide();
        jq18("#fileUploadContainer").hide();
        cleanUp();
    }
    else {
        if (jq18("#divAttachment").is(":visible"))
            jq18("#divAttachment").slideUp("slow", cleanUpAttachmentValues);
        if (jq18("#divAttachedWebpage").is(":visible"))
            jq18("#divAttachedWebpage").slideUp("slow", cleanUpAttachmentValues);
        if (jq18("#fileUploadContainer").is(":visible"))
            jq18("#fileUploadContainer").slideUp("slow", cleanUpAttachmentValues);
    }

    jq18('#cancelAttachment').slideUp();
    jq18('.ka_shareTools').show();
}
function shareKeyDown(box) {//catch the case when a user cancels a share then starts typing a new one. The blur/focus must be triggered manually
    if (box.html() == 'Share Something')
        shareFocus(box);
}
function cancelShare() {
    shareReset(jq18('#shareTitle').html(''));
    shareBodyBlur(jq18('#shareBox').html(''));
    setAttachmentType("");
    //cancel image exists check
    if (imgCheckInterval) clearInterval(imgCheckInterval);
    //remove uploaded image
    jq18('#fileUploadContainer').children('input').val('[]');
    jq18('#fileUploadContainer').children('a').remove();
    //clean attached values
    cleanUpAttachmentValues();
    //hide tagging tools
    jq18('#addTagsBox_Share').slideUp().children('div.shareTag').remove();
    setJsonTags("");
    if (employeeID != '0')
        jq18('input.ka_shareButton').addClass('ka_buttonActive').removeAttr('disabled');
    //show share tools
    jq18('div.ka_shareToolActions').remove();
    jq18('img.ka_shareTools').show();
    return false;
}

var lblCharsRemaining;
function ShareSomething_Load() {
    lblCharsRemaining = jq18('div#shareFooter span.charsRemaining');
    jq18('div#shareBox').unbind().filterHTML().parseURLs().lineBreak()
            .limitMaxlength({
                attribute: "maximumLength",
                onEdit: onEditCallback,
                onLimit: onLimitCallback,
                onBlur: onBlurCallback
            })
            .keydown(function (e) { return ifTaggingKeyDown(e); })
            .keyup(function (e) { inlineTagKeyUp(e, this, jq18('div#addTagsBox_Share')); });
    jq18('div#shareTitle').filterHTML(true)
        .limitMaxlength({
            attribute: "maximumLength",
            onEdit: onEditCallback,
            onLimit: onLimitCallback,
            onBlur: onBlurCallback
        })
        .keydown(function (e) { shareKeyDown(jq18(this)); return ifTaggingKeyDown(e); })
        .keyup(function (e) { inlineTagKeyUp(e, this, jq18('div#addTagsBox_Share')); })
        .focus(function () { shareFocus(jq18(this)); })
        .blur(function () { shareBlur(jq18(this)); });
}
var shareBodyTooLong = false;
var shareTitleTooLong = false;
function onEditCallback(remaining) {
    if (remaining < 100 || jq18(this).attr('id') == 'shareTitle')
        lblCharsRemaining.text(remaining);
    else
        lblCharsRemaining.text('');

    if (remaining >= 0) {
        lblCharsRemaining.removeClass('red');
        if (jq18(this).attr('id') == 'shareBox')
            shareBodyTooLong = false;
        else if (jq18(this).attr('id') == 'shareTitle')
            shareTitleTooLong = false;
        checkShareErrors(shareTitleTooLong, shareBodyTooLong, false)
    }
}
function onLimitCallback() {
    lblCharsRemaining.addClass('red');
    if (jq18(this).attr('id') == 'shareBox') {
        shareBodyTooLong = true;
        checkShareErrors(shareTitleTooLong, shareBodyTooLong, true);
    }
    else if (jq18(this).attr('id') == 'shareTitle') {
        shareTitleTooLong = true;
        checkShareErrors(shareTitleTooLong, shareBodyTooLong, false);
    }
}
var onBlurCallback = function () {
    //jq18('span.ka_ShareErrorMessage').text('');
    lblCharsRemaining.text('');
    checkShareErrors(shareTitleTooLong, shareBodyTooLong, false);
}
function checkShareErrors(sttl, sbtl, bodyFocused) {
    setTimeout(function () {
        if (sttl)
            jq18('#shareTitle').addClass('ka_redBorder');
        else
            jq18('#shareTitle').removeClass('ka_redBorder');
        if (sbtl)
            jq18('#shareBox').addClass('ka_redBorder');
        else
            jq18('#shareBox').removeClass('ka_redBorder');

        if (sttl && !bodyFocused)
            jq18('span.ka_ShareErrorMessage').text('Please shorten your title line.');
        else if (sbtl)
            jq18('span.ka_ShareErrorMessage').text('Update body is too long.');

        if (sttl || sbtl)
            jq18('input.ka_shareButton').removeClass('ka_buttonActive').attr('disabled', 'disabled');
        else
        {
            jq18('span.ka_ShareErrorMessage').text('');
            if (employeeID != '0')
                jq18('input.ka_shareButton').addClass('ka_buttonActive').removeAttr('disabled');
        }
    }, 0);
}