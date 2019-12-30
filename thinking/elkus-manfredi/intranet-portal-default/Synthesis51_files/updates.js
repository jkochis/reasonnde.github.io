// fixes page jump with updatepanel postback
var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_beginRequest(beginRequest);

function StreamTags_ToggleEdit(itemID) {
    var divTags = jq18('a.ka_streamTagLink', 'div.ka_streamTags[itemID="' + itemID + '"]');
    var addTagsBox = jq18('div.ka_streamTagEditor[itemID="' + itemID + '"]').children('div.ka_addTagsBox');
    if (addTagsBox.is(':hidden')) {
        var lastTag = null;
        divTags.each(function (i) {
            var thisTag = BoxifyTagLink(jq18(this));
            if (lastTag == null)
                addTagsBox.prepend(thisTag);
            else
                jq18(thisTag).insertAfter(lastTag);
            lastTag = thisTag;
        });
        addTags(addTagsBox);
        addTagsBox.parent().slideDown();
    } else {
        UnboxifyTagLinks(itemID, null);
    }
}

function BoxifyTagLink(lnk) {
    var streamTag = document.createElement("div");
    jq18(streamTag).attr('url', lnk.attr('href'))
        .attr("type", lnk.attr("type"))
        .attr("id", lnk.attr("id"));
    streamTag.className = "shareTag";

    /*var tagIcon = document.createElement("img");
    tagIcon.className = "tagIcon";
    tagIcon["src"] = "\\_layouts\\images\\KAWebParts\\" + getTagIcon(lnk.attr("type")) + "TagIcon.png";*/

    var btnRemoveTag = document.createElement("img");
    btnRemoveTag.className = "btnRemoveTag";
    btnRemoveTag.src = "/_layouts/15/images/KAWebParts/X.png";
    jq18(btnRemoveTag).click(function () {
        if (jq18(this).parent().siblings('a.ka_streamTagLink, div.shareTag:visible').length > 0) { // If there are other active mentions
            jq18(this).parent().map(function () {
                if (this.previousSibling && this.previousSibling.nodeType == 3) // preceded by a comma
                    return this.previousSibling;
                else if (this.nextSibling && this.nextSibling.nodeType == 3) // followed by a comma
                    return this.nextSibling;
                else
                    return null;
            }).remove();  //remove comma
            jq18(this).parent().hide();
        } else
            alert("This is the last tag. Please add another before removing this one.");
    });

    //streamTag.appendChild(tagIcon);
    streamTag.innerHTML += lnk.text();
    lnk.map(function () {
        if (this.nextSibling && this.nextSibling.nodeType == 3)
            return this.nextSibling;
        else
            return null;
    }).remove();
    lnk.remove();

    streamTag.appendChild(btnRemoveTag);
    return streamTag;
}
function UnboxifyTagLinks(itemID, apiTags) {
    var toBox = jq18('div.ka_streamTags[itemid="' + itemID + '"]');
    var fromBox = jq18('div.ka_streamTagEditor[itemid="' + itemID + '"] div.ka_addTagsBox');
    var comma = '';
    fromBox.children('div.shareTag:visible').each(function () {
        var lnk = document.createElement('a');
        jq18(lnk).attr('href', jq18(this).attr("url") != null ? jq18(this).attr("url") : findTagUrl(apiTags, tagTypeToInt(jq18(this).attr('type')), jq18(this).attr('id')))
            .attr("type", jq18(this).attr("type"))
            .attr("id", jq18(this).attr("id"))
            .attr("author", employeeID)
            .attr("class", "ka_streamTagLink");
        lnk.innerHTML = jq18(this).contents().filter(function () {
            return this.nodeType == 3;
        }).text();
        toBox.append(comma);
        comma = ', ';
        toBox.append(lnk);
        jq18(this).remove();
    });
    fromBox.parent().slideUp();
}

function updateTags_Stream(itemID) {
    var fromBox = jq18('div.ka_streamTagEditor[itemid="' + itemID + '"] div.ka_addTagsBox');
    //Get New Tags
    var tagsIn = [];
    fromBox.children('div.shareTag:visible').each(function () {
        tagsIn.push({ EntityType: tagTypeToInt(jq18(this).attr('type')), EntityID: jq18(this).attr('id'), Deleted: 0 });
    });
    //Get Removed Tags
    fromBox.children('div.shareTag:hidden').each(function () {
        tagsIn.push({ EntityType: tagTypeToInt(jq18(this).attr('type')), EntityID: jq18(this).attr('id'), Deleted: 1 });
    });

    if (tagsIn.length > 0) {
        jq18('div.ka_applyStreamTags[itemid="' + itemID + '"]').removeClass('ka_buttonActive').attr('onclick', '');
        jq18.ajax({
            type: 'POST',
            url: '/_layouts/15/Updates/UpdateTags.ashx',
            data: { ItemID: itemID, Tags: JSON.stringify(tagsIn) },
            success: function (response) {
                if (response.Result) {
                    UnboxifyTagLinks(itemID, response.Tags);
                }
                else {
                    alert("Error: Not all changes could be applied.");
                }
                jq18('div.ka_applyStreamTags[itemid="' + itemID + '"]').addClass('ka_buttonActive').attr('onclick', 'updateTags_Stream("'+itemID+'")');
            },
            error: function (request, status, error) {
                alert(status + ' - ' + error + ' - ' + request.responseText);
            },
            dataType: 'json'
        });
    }
    //else
    //    UnboxifyTagLinks(toBox);
}

function beginRequest() {
    prm._scrollPosition = null;
}

function showRemoveComment() {
    jq18("div.ka_streamComment:has('input.ka_removeIcon')").hover(
        function () { jq18(this).find("span.ka_streamCommentDate").hide(); jq18(this).find("input.ka_removeIcon").show(); },
        function () { jq18(this).find("span.ka_streamCommentDate").show(); jq18(this).find("input.ka_removeIcon").hide(); }
    );
}

function likeLink() {
    jq18('a.ka_likeAuthor').hover(function () {
        jq18(this).parent().children('img.ka_likeIcon').addClass("hovered"); //.css("background-position", "-42 -162");
    },
    function () {
        jq18(this).parent().children('img.ka_likeIcon').removeClass("hovered");
    });
}

function hideFromSub(lnk) {
    unhideObjects()
    jq18(lnk).parent().parent().parent().removeClass("hover");
    jq18(lnk).parent().parent().parent().children('ul:first').css('visibility', 'hidden');
}

function newCommentFocus(box) {
    if (box.text().trim() == 'Add a comment...')
        box.text('');
    box.siblings("div.ka_commentActions").show();
};

function newCommentBlur(box) {
    if (box.text().trim() == '') {
        box.text('Add a comment...');
        box.siblings("div.ka_commentActions").hide();
    }
}
function newCommentCancel(btn) {
    btn.parent().parent().siblings('div.ka_newCommentBox').text('Add a comment...');
    btn.parent().parent().hide();
}

function slideComments(itemID) {
    jq18('tr.updatesRow[itemid="'+itemID+'"] div.ka_streamCommentCount').hide();
    jq18('tr.updatesRow[itemid="' + itemID + '"] div.ka_streamComment:hidden').show();
}
function focusCommentBox(itemID) {
    var boxHeight = 75;
    var commentBox = jq18('tr.updatesRow[itemid="' + itemID + '"] div.ka_newCommentBox');
    if (jq18(commentBox).offset().top < 0 || //comment box is above window
        jq18(commentBox).offset().top - boxHeight > jq18(window).height()) //comment box is below window
    {
        var toTopOfWorkspace = jq18('#s4-workspace').scrollTop() + commentBox.offset().top;
        jq18('#s4-workspace').animate({ //scroll to see comment box
            scrollTop: toTopOfWorkspace - jq18(window).height() + boxHeight
        });
    }
    commentBox.focus();
}

function thread(jqContainer) {
    jq18("ul.dropdown li a", jqContainer).each(function () {
        var itemHovered = false;
        var topUL = jq18(this).parent().parent();
        var subUL = jq18(this).siblings('ul');
        var longWidth = subUL.width();
        if (topUL.width() > longWidth) longWidth = topUL.width();
        topUL.css('min-width', longWidth);
        subUL.css('min-width', longWidth);
        jq18(this)
        .off("click") //remove previous bindings if page has multiple updates parts
        .on("click", function () {
            if (topUL.hasClass("open")) { //clicking the menu when it is open will close it
                HideMenu(this);
            }
            else {
                this.focus(); //allows blur event to work
                ShowMenu(this);
            }
        })
        .on("blur", function () { //clicking outside of the menu will close it
            if (!itemHovered) HideMenu(this);
        })
        .siblings().hover(
            function () { itemHovered = true; },
            function () { itemHovered = false; }
        );
        function HideMenu(topLink) {
            unhideObjects();
            topUL.removeClass("open");
            subUL.css('visibility', 'hidden');
        }
        function ShowMenu(topLink) {
            hideObjects();
            topUL.addClass("open");
            subUL.css('visibility', 'visible');
        }
    });
}
function StreamViewSelected(newView) {
    //Display newley selected view
    var newView_copy = jq18(newView).clone(true).attr('onClick', 'return false;');
    jq18(newView).replaceWith(
        jq18('ul.ka_streamViews li a:first')
        .replaceWith(
            newView_copy.append(
                jq18('ul.ka_streamViews li a img')))
        .attr('onClick', 'StreamViewSelected(this); return false;'));
    //Hide menu
    unhideObjects();
    jq18('ul.ka_streamViews li:first').removeClass('hover').children('ul:first').css('visibility', 'hidden');
    jq18('ul.ka_streamViews').removeClass('open');
    //Restore menu events
    thread();
    //Set Cookie
    //jq18.cookie('streamView', jq18(newView).attr('viewid'), { expires: 365, path: '/' });
    //Trigger postback
    jq18('input[type=text].ka_streamViewChanged').val(jq18(newView).attr('viewid'));
    jq18('input[type=button].ka_streamViewChanged').click();
    //__doPostBack(jq18('input.ka_streamViewChanged').attr('value', jq18(newView).attr('viewid')).name, '');
}
function addComment_Click(btn) {
    if (savedSelection) rangy.removeMarkers(savedSelection); //remove any marker elements from caret position
    var comm = btn.parent().siblings('div.ka_newCommentBox').html();
    if (comm == null || comm == "") {
        alert("Please type your comment in the box.");
        return false;
    } else {
        jq18('textarea.tbCommentToAdd').val(comm);
        btn.attr('disabled', 'disabled').removeClass('ka_buttonActive').val('Loading...');
        btn.remove("ka_buttonActive");
        return true;
    }
}
function findTagUrl(tagList, tagType, tagID) {
    var url;
    jq18.each(tagList, function (i, tag) {
        if (tag.EntityType == tagType && tag.EntityID == tagID) {
            url = tag.URL;
            return false;
        }
    });
    return url;
}
function streamLess(itemID) {
    if (!itemID) {
        jq18.cookie('moreOrLess', 'less', { expires: 365, path: '/' });
        setMoreLessButtonState();
        jq18('tr.updatesRow').each(function () { streamLess(jq18(this).attr('itemid')) });
    } else if (!jq18('tr.updatesRow[itemid="' + itemID + '"]').hasClass('less')) {
        var targetHeight = jq18('div.ka_streamLessView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).hide().css('height', '').height(); //hide if not already then remove height=0 set by IE fix
        jq18('div.ka_streamMoreView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).animate(
			{ height: targetHeight },
			function () {
			    if (jq18.browser.msie)
			        jq18(this).css('overflow', 'hidden').css('height', '0'); //setting height instead of hide() fixes IE compat. view issue
			    else
			        jq18(this).css('height', '').hide();
			    jq18(this).siblings('div.ka_streamLessView').show();
			    //imagesLoaded(jq18('a.SubItemThumbnail.ka_225w150h_fxdw img'), middleAlignImagesCallback); //must wait til animation is done so images and divs aren't moving around when heights are calculated
			});
    }
    if (itemID) jq18('tr.updatesRow[itemid="' + itemID + '"]').addClass('less');
    jq18('#hfExpandedItems').val(JSON.stringify(jq18('tr.updatesRow:not(.less)').map(function(){return jq18(this).attr('itemid');}).get())); //keep track of which items are expanded
}
function streamMore(itemID, focusComment) {
    //imagesLoaded(jq18('a.SubItemThumbnail.ka_225w150h_fxdw img'), middleAlignImagesCallback);
    if (!itemID) {
        jq18.cookie('moreOrLess', 'more', { expires: 365, path: '/' });
        setMoreLessButtonState();
        jq18('tr.updatesRow').each(function () { streamMore(jq18(this).attr('itemid')) });
    } else if (jq18('tr.updatesRow[itemid="' + itemID + '"]').hasClass('less')) {
        var startHeight = jq18('div.ka_streamLessView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).height();
        var targetHeight = jq18('div.ka_streamMoreView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).hide().css('height', '').height();//hide if not already then remove height=0 set by IE fix
        if (jq18.browser.msie)
            jq18('div.ka_streamLessView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).css('overflow', 'hidden').css('height', '0'); //setting height instead of hide() fixes IE compat. view issue
        else
            jq18('div.ka_streamLessView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).hide();
        jq18('div.ka_streamMoreView', jq18('tr.updatesRow[itemid="' + itemID + '"]')).height(startHeight).show().animate(
			{ height: targetHeight },
			function () {
			    jq18(this).css('height', '');
			    if (focusComment) focusCommentBox(itemID);
			});
        jq18('tr.updatesRow[itemid="' + itemID + '"] div.ka_streamMoreView .ka_steamSubItemBody').filter(function () {
            return jq18(this).children('div:has(img)').length > 1; //find subitems with multiple slides (images)
        }).slick(ka_slickProperties);//slickSetOptions is to reset slider since it doesn't work when hidden
        thread(jq18('tr.updatesRow[itemid="' + itemID + '"]'));
    }
    if (itemID) jq18('tr.updatesRow[itemid="' + itemID + '"]').removeClass('less');
    jq18('#hfExpandedItems').val(JSON.stringify(jq18('tr.updatesRow:not(.less)').map(function () { return jq18(this).attr('itemid'); }).get())); //keep track of which items are expanded
}
function setMoreLessButtonState() {
    if (jq18.cookie('moreOrLess') == null || jq18.cookie('moreOrLess') == 'less') {
        jq18('#ka_streamMore').removeClass('active');
        jq18('#ka_streamLess').addClass('active');
    } else {
        jq18('#ka_streamLess').removeClass('active');
        jq18('#ka_streamMore').addClass('active');
    }
}
function streamSearchFocus(input) {
    if (jq18(input).val() == "Search the Stream")
        jq18(input).val('');
    jq18(input).blur(function () {
        if (jq18(this).val() == "")
            jq18(this).val("Search the Stream");
    })
    .keyup(function () {
        if (jq18(this).attr('searchPhrase') != "") { //if we returned from a search
            if (jq18(this).val() != jq18(this).attr('searchPhrase')) //new search entered
                jq18(this).siblings('.ka_execSearchIcon').show().siblings('.ka_clearSearchIcon').hide(); //show search button
            else
                jq18(this).siblings('.ka_execSearchIcon').hide().siblings('.ka_clearSearchIcon').show(); //show clear button
        }
    });
}
function stopLinkBubble(e) {
    if (!e) e = window.event;
    if (e) {
        if (e.preventDefault) e.preventDefault(); //non-IE
        else e.returnValue = false;//IE
    }
}

// Edit Blog Post Stuff
function editBlogPostSharePoint(url) {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.ModalDialog.OpenPopUpPage(url, editBlogCallback);
    });
}
function editBlogCallback(result) {

    if (result != SP.UI.DialogResult.cancel) {
        setTimeout(function () {       
            jq18('div[id*="_pnlUpdates"]').each(function (i) {
                __doPostBack(this.id, 'clearIDs');
            });
        }, 3000);
    }
}