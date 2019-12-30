if (navigator.userAgent.indexOf('Mac') != -1)
    jq18('html').addClass("ka_mac");

// Toggles the tools neccessary to add tags to a stream item. Used by Updates and ShareSomething.
function addTags(addTagsBox) {
    if (addTagsBox.is(':visible')) { //Already showing then cancel
        addTagsBox.hide();
        addTagsBox.siblings('div.ka_button').hide();
        jq18('input.ka_shareButton').addClass('ka_buttonActive');
    } else {
        addTagsBox
        .hover(
            function () { suggestionSelected = true; },
            function () { suggestionSelected = false; })
        .click(function () {
            if (jq18(this).children('input').val() == '') { //not using the input yet
                jq18(this).children('span.ka_addTagsText').hide();
                jq18(this).children('input').show();
                setTimeout(function () { //wait for IE to render control first
                    addTagsBox.children('input').focus(); //then IE can focus it
                }, 10);
            }
        })
        //.click()//move caret to tagging input
        .children('input').focusout(function () {
            if (!suggestionSelected) {  //if you click on anything other than the results or the tags box
                if (jq18(this).val().length > 2 && jq18(this).val().startsWith('#')) //if a new hashtag has been started
                {
                    var hashtagID = jq18(this).val().replace(' ', '');
                    addTagIfNotAlready(jq18(this).parent(), 'Hashtag', hashtagID, hashtagID);
                    if (addTagsBox.attr('id') == "addTagsBox_Share") //only for ShareSomething
                        pushJsonTag('Hashtag', hashtagID);
                }
                addTagsBox.children('input').val('').hide();
                jq18('div.ka_tagSuggestionBox').remove();
                addTagsBox.append(addTagsBox.children('span.ka_addTagsText').show());
            }
        });
        addTagsBox.siblings('.ka_button').css('display', 'inline-block');
        jq18('input.ka_shareButton').removeClass('ka_buttonActive');
    }
}

// functions used when searching for new tags to mention with. Used By Updates and ShareSomething.
var suggestionSelected = false;
var tagSuggestionCaller;
var tagSuggestionDestination;
var selectedTagSuggestionIndex = -1;
var previouslySelectedTagSuggestionIndex;
var addTagTimer;
var tagLookup;
jq18(document).ready(function () {
    jq18('form').bind("keypress", function (e) { //prevents the page form from submiting when enter key is pressed
        var code = e.which;
        if (code == 13 && document.activeElement.className == "ka_addTagPhrase") {
            return false;
        }
    });
    commentBoxEvents();
    jq18(window).trigger('resize');//fixes bug when window is resized during page render
});
function commentBoxEvents() {
    var commentEditCallback = function (remaining) {
        var commentActions = jq18(this).siblings("div.ka_commentActions");
        var lblCharsRemaining = commentActions.children('span.charsRemaining');
        if (remaining < 100)
            lblCharsRemaining.text(remaining);
        else
            lblCharsRemaining.text('');
        if (remaining >= 0) {
            lblCharsRemaining.removeClass('red');
            commentActions.children('input.ka_button').addClass('ka_buttonActive').removeAttr('disabled');
        }
    }
    var commentLimitCallback = function () {
        var commentActions = jq18(this).siblings("div.ka_commentActions");
        commentActions.children('span.charsRemaining').addClass('red');
        commentActions.children('input.ka_button').removeClass('ka_buttonActive').attr('disabled', 'disabled');
    }
    jq18('.ka_newCommentBox')
        .unbind()
        .filterHTML()
        .lineBreak()
        .limitMaxlength({
            attribute: "maximumLength",
            onEdit: commentEditCallback,
            onLimit: commentLimitCallback
        });
}
function addTagKeyUp(event, newQuery, caller) {
    tagSuggestionCaller = caller;
    previouslySelectedTagSuggestionIndex = selectedTagSuggestionIndex;
    var key = event.which || event.keyCode;
    if (key == 13) { // enter
        var selectedDiv = jq18("div.ka_tagSuggestionBox>div:eq(" + selectedTagSuggestionIndex + ")");
        if (selectedDiv.length == 1)
            selectedDiv.click();
        return false;
    } else if (key == 38) { // up
        selectedTagSuggestionIndex--;
        tagSuggestionIndexChanged();
    } else if (key == 40) { // down
        selectedTagSuggestionIndex++;
        tagSuggestionIndexChanged();
    } else if (key == 27) { // escape
        jq18('div.ka_tagSuggestionBox').remove();
        selectedTagSuggestionIndex = null;
        suggestionSelected = false;
    } else if (newQuery.length > 0) { // any other new query
        jq18('div.ka_tagSuggestionBox').remove();
        clearTimeout(addTagTimer);
        if (tagLookup) {
            tagLookup.abort();
            tagLookup = null;
        }
        if (newQuery != "#") {
            addTagTimer = setTimeout(function () {
                suggestTags(newQuery);
            }, 500); //500ms timer to between key strokes before suggesting tags
        }
    } else { // nothing to query
        jq18('div.ka_tagSuggestionBox').remove();
        clearTimeout(addTagTimer);
        if (tagLookup) {
            tagLookup.abort();
            tagLookup = null;
        }
    }
}
function tagSuggestionIndexChanged() {
    // check bounds
    if (selectedTagSuggestionIndex != previouslySelectedTagSuggestionIndex) {
        if (selectedTagSuggestionIndex < 0)
            selectedTagSuggestionIndex = 0;
        if (selectedTagSuggestionIndex >= jq18("div.ka_tagSuggestionBox>div").length - 1)
            selectedTagSuggestionIndex = jq18("div.ka_tagSuggestionBox>div").length - 1;
    }
    // select new div, unselect the previous selected
    if (selectedTagSuggestionIndex > -1) {
        if (selectedTagSuggestionIndex != previouslySelectedTagSuggestionIndex) {
            jq18("div.ka_tagSuggestionBox>div:eq(" + selectedTagSuggestionIndex + ")").addClass("hovered").siblings().removeClass("hovered");
        }
    }
}
function suggestTags(phrase) {
    selectedTagSuggestionIndex = null;
    var sugBox = document.createElement('div');
    var sugBoxWidth = tagSuggestionCaller.width();
    var sugBoxLeft = tagSuggestionCaller.position().left;
    var sugBoxTop = tagSuggestionCaller.position().top + tagSuggestionCaller.height();
    if (tagSuggestionCaller.attr('id') == 'addTagsBox_Share') { //ShareSomething tagging box
        sugBoxWidth += 1;
        sugBoxTop += 11;
        sugBoxLeft += 5;
    } else if (tagSuggestionCaller.attr('class') == 'ka_addTagsBox') {//edit tags box
        sugBoxWidth += 1;
        sugBoxTop += 6;
    } else if (tagSuggestionCaller.attr('id') == 'shareBox') { //ShareSomething inline
        sugBoxWidth += 6;
        sugBoxTop += 3;
        sugBoxLeft += 5;
    } else if (tagSuggestionCaller.attr('class') == 'ka_newCommentBox') { //comment inline
        sugBoxWidth += 17;
        sugBoxTop += 12;
    } else if (tagSuggestionCaller.attr('id') == 'shareTitle') { //title inline
        sugBoxWidth += 17;
        sugBoxTop += 18;
        sugBoxLeft += 5;
    }
    sugBox.style.width = sugBoxWidth + "px";
    sugBox.className = "ka_tagSuggestionBox";
    sugBox.innerHTML = "Searching for \"" + phrase + "\"";
    jq18(sugBox)
	.css('top', sugBoxTop) //use css top/left instead of offset() to avoid JQuery bug #6949
	.css('left', sugBoxLeft)
	.hover(function () {
	    suggestionSelected = true;
	    if (tagSuggestionCaller.attr('id') == "shareBox" || tagSuggestionCaller.attr('id') == "shareTitle" || tagSuggestionCaller.attr('class') == 'ka_newCommentBox') {//Inline
	        if (savedSelection)
	            rangy.removeMarkers(savedSelection); //remove any marker elements from caret position
	        savedSelection = rangy.saveSelection(); // save caret position
	    }
	},
		function () { suggestionSelected = false; });
    tagSuggestionCaller.parent().append(sugBox);
    getSuggestions(phrase);
}
var tagSearchType;
function getSuggestions(phrase) {
    if (tagSearchType) {
        var url = "/_layouts/15/NexusAPIProxy/Search2.ashx?searchString=" + encodeURIComponent(phrase) + "&searchType=" + tagSearchType + "&maxResults=20&expandedSearch=false";
        tagSearchType = null;
        tagLookup = jq18.getJSON(url, setSuggestions)
        .error(function (jqXHR, textStatus, errorThrown) {
            tag = null;
            if (jqXHR.responseText)
                alert("error: " + textStatus + "\nincoming Text: " + (jqXHR.responseText.length > 100 ? jqXHR.responseText.substring(0, 100) : jqXHR.responseText));
        });
    } else {
        jq18('div.ka_tagSuggestionBox').remove();
    }
}
var sugOrder = ["Community", "Employee", "Company", "Project", "Contact", "Opportunity", "Hashtag"];
function setSuggestions(sugs) {
    var existingTags;
    var excludeEmp;
    if (tagSuggestionCaller.attr('id') == 'addTagsBox_Share') //Shomething tagging box
    {
        existingTags = jq18('div#addTagsBox_Share div.shareTag:visible');
        excludeEmp = employeeID;
    }
    else if (tagSuggestionCaller.attr('class') == 'ka_addTagsBox') //comment tagging box
    {
        existingTags = tagSuggestionCaller.children('div.shareTag:visible');
        excludeEmp = tagSuggestionCaller.attr('author');
    }
    tagLookup = null;
    var sugBox = jq18('div.ka_tagSuggestionBox');
    sugBox.html('');
    jq18(sugOrder).each(function (i, sugType) {
        if (sugs[sugType]) {
            jq18(sugs[sugType].results).each(function (i, sug) {
                var sugID = getSuggestionID(sug);
                //IF NOT AUTHOR OR ALREADY TAGGED
                if (!(sug.$type == "Employee" && sugID == excludeEmp)//not author
                        && (!existingTags // and is inline
                        || findShareTag(existingTags, sug.$type, sugID).length === 0)) //or not already tagged
                    sugBox.append(formSuggestion(sug));
            });
        }
    });
    if (sugBox.children().length === 0)
        sugBox.remove();
    setSuggestionActions();
}
function getSuggestionID(sug) {
    if (sug.EmployeeID != null) return sug.EmployeeID;
    else if (sug.ProjectID != null) return sug.ProjectID;
    else if (sug.ContactID != null) return sug.ContactID;
    else if (sug.CompanyID != null) return sug.CompanyID;
    else if (sug.OpportunityID != null) return sug.OpportunityID;
    else if (sug.CommunityName != null) return sug.CommunityID;
    else if (sug.HashtagID != null) return sug.HashtagID;
    else return null;
}
function getSuggestionName(sug) {
    if (sug.EmployeeID != null) return sug.FullName;
    else if (sug.ProjectID != null) return sug.MarketingName;
    else if (sug.ContactID != null) return sug.ContactName;
    else if (sug.CompanyID != null) return sug.CompanyName;
    else if (sug.OpportunityID != null) return sug.OpportunityName;
    else if (sug.CommunityName != null) return sug.CommunityName;
    else if (sug.HashtagID != null) return sug.HashtagID;
    else return null;
}
function findShareTag(tagsArray, type, id) {
    return jq18.grep(tagsArray, function (tag) {
        return jq18(tag).attr('type') == type && jq18(tag).attr('id') == id;
    });
}
function formSuggestion(sug) {
    var sugType = sug.$type;
    var divSug = document.createElement('div');
    jq18(divSug).attr('type', tagIntToType(sugType));
    divSug.className = "ka_tagSuggestion";

    var divImg = document.createElement('div');
    divImg.style.width = "35px";
    divImg.style.height = "35px";

    var img = document.createElement('img');
    if (sugType == "Community") {
        img.src = "/_layouts/15/images/KAWebParts/community_25.png";
        divImg.appendChild(img);
    }
    else if (sugType == "Hashtag") {
        img.src = "/_layouts/15/images/KAWebParts/topic_25.png";
        divImg.appendChild(img);
    }
    else {
        img.src = GetMediaURL(sug.PrimaryImageID, sugType, '35w35h_fxd');
        divImg.appendChild(img);
    }

    var divText = document.createElement('div');
    divText.style.padding = "0px 0px 0px 3px";
    var spanTitle = document.createElement('span');
    spanTitle.className = "ka_tagSuggestionTitle";
    var divSubTitle = document.createElement('div');
    divSubTitle.className = "ka_tagSuggestionSubTitle";

    if (sugType == "Employee") {
        jq18(img).addClass('ka_circular');
        jq18(divSug).attr('id', sug.EmployeeID);
        spanTitle.innerHTML = sug.FullName;
        if (sug.Title)
            divSubTitle.innerHTML = sug.Title;
    } else if (sugType == "Project") {
        jq18(divSug).attr('id', sug.ProjectID);
        spanTitle.innerHTML = sug.MarketingName;
        if (sug.ClientName)
            divSubTitle.innerHTML = sug.ClientName;
    } else if (sugType == "Contact") {
        jq18(divSug).attr('id', sug.ContactID);
        spanTitle.innerHTML = sug.ContactName;
        if (sug.CompanyName)
            divSubTitle.innerHTML = sug.CompanyName;
    } else if (sugType == "Company") {
        jq18(divSug).attr('id', sug.CompanyID);
        spanTitle.innerHTML = sug.CompanyName;
        if (sug.PrimaryDiscipline)
            divSubTitle.innerHTML = sug.PrimaryDiscipline; // mobile uses Address
    } else if (sugType == "Opportunity") {
        jq18(divSug).attr('id', sug.OpportunityID);
        spanTitle.innerHTML = sug.OpportunityName;
        if (sug.ClientName)
            divSubTitle.innerHTML = sug.ClientName;
    } else if (sugType == "Community") {
        jq18(divSug).attr('id', sug.CommunityID);
        spanTitle.innerHTML = sug.CommunityName;
    } else if (sugType == "Hashtag") {
        jq18(divSug).attr('id', sug.HashtagID);
        spanTitle.innerHTML = sug.HashtagID;
    } else {
        spanTitle.innerHTML = sugType;
    }
    divText.appendChild(spanTitle);
    divText.appendChild(divSubTitle);
    divSug.appendChild(divImg);
    divSug.appendChild(divText);
    return divSug;
}
function setSuggestionActions() {
    jq18('div.ka_tagSuggestion:first').addClass("hovered");
    selectedTagSuggestionIndex = 0;
    jq18('div.ka_tagSuggestion').hover(function () {
        jq18(this).siblings().removeClass("hovered");
    })
    .click(
		function () {
		    if (tagSuggestionCaller.attr('class') != 'ka_addTagsBox' && tagSuggestionCaller[0] != document.activeElement) { // is inline and event came from mouse click and not .click() trigger
		        tagSuggestionCaller.focus();
		        rangy.restoreSelection(savedSelection); //restore caret to possition in box
		    }
		    tagSuggestionAccept(jq18(this));
		});
}
function tagSuggestionAccept(suggestedTag) {
    var sugType = suggestedTag.attr("type");
    var sugID = suggestedTag.attr("id");
    var sugText = suggestedTag.children("div:last").children("span:first").text();
    //FROM INLINE ShareSomething
    if (tagSuggestionCaller.attr('class') != 'ka_addTagsBox') {
        linkifyInlineTag(sugType, sugID, sugText);
        if (tagSuggestionDestination) {//destination exists means it's in ShareSomething
            addTagIfNotAlready(tagSuggestionDestination, sugType, sugID, sugText);
            pushJsonTag(sugType, sugID);
        }
    }
        //FROM INLINE Comment
    else if (tagSuggestionCaller.attr('class') == 'ka_newCommentBox') {
        linkifyInlineTag(sugType, sugID, sugText);
    }
        //FROM TAGGING BOX
    else {
        addTagIfNotAlready(tagSuggestionCaller, sugType, sugID, sugText);
        if (tagSuggestionCaller.attr('id') == "addTagsBox_Share") //ShareSomething only
            pushJsonTag(sugType, sugID);
        tagSuggestionCaller.append(tagSuggestionCaller.children('input').val(''));
        tagSuggestionCaller.click();
    }
    jq18('div.ka_tagSuggestionBox').remove();
    suggestionSelected = false;
}
function pushJsonTag(type, id) {
    type = tagTypeToInt(type);
    var jsonTags = JSON.parse(getJsonTags());
    if (jsonTags == null) jsonTags = [];
    jq18.each(jsonTags, function (i, tag) {
        if (tag.EntityType == type && tag.EntityID == id) {
            jsonTags.splice(i, 1);
            return false;
        }
    });
    jsonTags.push({ EntityType: type, EntityID: id, Deleted: 0 });
    setJsonTags(JSON.stringify(jsonTags));
}
function hideJsonTag(type, id) {
    type = tagTypeToInt(type);
    var jsonTags = JSON.parse(getJsonTags());
    if (jsonTags == null) jsonTags = [];
    jq18.each(jsonTags, function (i, tag) {
        if (tag.EntityType == type && tag.EntityID == id)
            tag.Deleted = 1;
    });
    setJsonTags(JSON.stringify(jsonTags));
}
function addTagIfNotAlready(toBox, sugType, sugID, sugText) {
    //var sugType = tagTypeToInt(sugTypeName);
    var exists = false;
    toBox.children('.shareTag').each(function (i) {
        if (jq18(this).attr('type') == sugType && jq18(this).attr('id') == sugID) {
            exists = true;
            if (!jq18(this).is(':visible'))
                jq18(this).show();
            return false;
        }
    });
    if (!exists) {
        var shareTag = document.createElement("div");
        shareTag.className = "shareTag";
        jq18(shareTag).attr("type", sugType);
        jq18(shareTag).attr("id", sugID);
        if (!tagSuggestionCaller.hasClass('ka_addTagsBox')) //inline tags only
            jq18(shareTag).attr('inline', true);
        shareTag.innerHTML = sugText;
        var btnRemoveTag = document.createElement("img");
        btnRemoveTag.className = "btnRemoveTag";
        btnRemoveTag.src = "/_layouts/15/images/KAWebParts/X.png";
        jq18(btnRemoveTag).click(function () {
            if (!jq18(this).parent().parent().parent().hasClass('ka_streamTagEditor'))
                deleteTagShareSomething(jq18(this).parent(), sugType, sugID);
            else
                deleteTagUpdates(jq18(this).parent());
        });
        shareTag.appendChild(btnRemoveTag);
        //toBox.append(shareTag);
        if (toBox.children('div.shareTag:last').length > 0)
            jq18(shareTag).insertAfter(toBox.children('div.shareTag:last'));
        else
            toBox.prepend(shareTag);
    }
}
function deleteTagShareSomething(tagDiv, type, id) {
    type = tagTypeToInt(type);
    var jsonTags = JSON.parse(getJsonTags());
    jq18.each(jsonTags, function (i, tag) {
        if (tag.EntityType == type && tag.EntityID == id) {
            tag.Deleted = 1; //mark deleted rather than actually deleting so inline tags can link
            //jsonTags.splice(i, 1);
            return false;
        }
    });
    if (ValidateTags(jsonTags)) {
        tagDiv.remove();
        setJsonTags(JSON.stringify(jsonTags));
    }
    else
        alert("This is the last tag. Please add another before removing this one.");
}
function deleteTagUpdates(tagDiv) {
    var jsonTags = [];
    jq18.each(tagDiv.siblings('div.shareTag'), function (i, div) {
        jsonTags.push({ "EntityType": tagTypeToInt(jq18(div).attr("type")), "EntityID": tagTypeToInt(jq18(div).attr("id")), "Deleted": jq18(div).is(':visible') ? 0 : 1 });
    });
    if (ValidateTags(jsonTags)) {
        tagDiv.hide();
    }
    else
        alert("This is the last tag. Please add another before removing this one.");
}
function ValidateTags(jsonTags) {
    var valid = false;
    jq18.each(jsonTags, function (i, tag) {
        //if (tag.EntityType != 0 && tag.Deleted == 0) { //If a community or entity is still tagged
        if (tag.Deleted == 0) { //just required any tag
            valid = true;
            return false; //break loop
        }
    });
    return valid;
}
function tagTypeToInt(tagTypeName) {
    switch (tagTypeName) {
        case "Hashtag":
            return 0;
            break;
        case "Community":
            return 1;
            break;
        case "Employee":
            return 2;
            break;
        case "Project":
            return 3;
            break;
        case "Contact":
            return 4;
            break;
        case "Company":
            return 5;
            break;
        case "MktCampaign":
            return 6;
            break;
        case "Opportunity":
            return 7;
            break;
        default:
            return tagTypeName;
            break;
    }
}
function tagIntToType(tagType) {
    switch (tagType) {
        case 0:
            return "Hashtag";
            break;
        case 1:
            return "Community";
            break;
        case 2:
            return "Employee";
            break;
        case 3:
            return "Project";
            break;
        case 4:
            return "Contact";
            break;
        case 5:
            return "Company";
            break;
        case 6:
            return "MktCampaign";
            break;
        case 7:
            return "Opportunity";
            break;
        default:
            return tagType;
            break;
    }
}
function linkifyInlineTag(type, id, text) {
    var editableDiv = tagSuggestionCaller[0];
    var link = document.createElement('a');
    jq18.get("/_layouts/15/GetTagUrl.ashx", { type: type, id: id }).done(function (data) {
        link.href = data;
    });
    link.className = 'ka_inlineTag';
    link.setAttribute('entId', id);
    link.setAttribute('entType', type);
    /* Modern IE seems to have resolved this bug
    if (jq18.browser.msie)
        link.setAttribute('contenteditable', 'true'); //WTF IE?
    else*/
        link.setAttribute('contenteditable', 'false');
    link.target = '_blank';
    link.innerHTML = text;
    replaceTagPhraseWithLink(link);
}

function boxTagKeyUp(e, caller) {
    tagSuggestionDestination = null;
    if (caller.value[0] == '#' && //if working on a hashtag
        (e.keyCode == 32 || //and space is pressed
        (e.keyCode == 13 && (selectedTagSuggestionIndex == null || selectedTagSuggestionIndex < 0)))) { //or enter is pressed while no suggestions are selected
        jq18('div.ka_tagSuggestionBox').remove();
        var hashtags = caller.value.split(' ');
        for (i = 0; i < hashtags.length; i++) { //loop hashtags in case more than one made it in (ie. paste)
            var hashtagID = hashtags[i].replace(',', '');//replace comma in case a list was pasted in with commas
            if (hashtagID.trim() != '' && hashtagID.startsWith('#')) { //if the hashtag is valid
                addTagIfNotAlready(jq18(caller).parent(), 'Hashtag', hashtagID, hashtagID);
                if (jq18(caller).parent().attr('id') == "addTagsBox_Share") //only for ShareSomething
                    pushJsonTag('Hashtag', hashtagID);
                jq18(caller).parent().append(jq18(caller).val('')).click();
            }
        }
    } else {
        var query = caller.value;
        if (query[0] == '#')
            tagSearchType = "Hashtag"; // only hashtags
        else if (query[0] == '@') {
            tagSearchType = "Mentions"; // all tag types excluding hashtags
            query = query.substring(1, query.length);
        }
        else
            tagSearchType = "Tags"; //all of em
        addTagKeyUp(e, query, jq18(caller).parent());
    }
}
//Inline tagging
var savedSelection;
var tagPhrase;
function ifTaggingKeyDown(e) {
    var key = e.which || e.keyCode;
    if (jq18('div.ka_tagSuggestionBox').is(':visible') //if tagging then hijack these events
        && (key == 38 || key == 40 || key == 13 || key == 27)) //up,down,enter,escape
        //e.stopPropagation();
        return false;
    else if (jq18(':focus').attr('id') == "shareTitle" //if in title don't allow line breaks
        && key == 13) //enter
        return false;
    return true;
}
function inlineTagKeyUp(e, caller, destination) {
    if (e.keyCode == 8 || e.keyCode == 46) //Remove deleted tags if 8(backspace) or 46(delete)
        checkInlineTagRemoved(jq18(caller), destination);

    var tagPhrase = getTagPhrase(caller);
    if (tagPhrase && tagSearchType) {
        tagSuggestionDestination = destination;
        addTagKeyUp(e, tagPhrase, jq18(caller));
    } else {
        jq18('div.ka_tagSuggestionBox').remove();
        clearTimeout(addTagTimer);
        if (tagLookup) {
            tagLookup.abort();
            tagLookup = null;
        }
    }
}
function checkInlineTagRemoved(caller, destination) {
    if (caller.attr('id') == 'shareBox' || caller.attr('id') == 'shareTitle') {// shareSomething needs to sync inline tags with tag box. comments don't
        destination.children('div.shareTag[inline=true]').each(function (i) {
            var id = jq18(this).attr('id');
            var type = jq18(this).attr('type');
            //var re = new RegExp('<a[^<>]*?entId="' + id + '".*?entType="' + type + '".*?</a>', 'i');
            //var html = '';
            //jq18.each(jq18('div#shareTitle, div#shareBox'), function (i, o) { html += jq18(o).html() });
            if (jq18('.ka_inlineTag[entType=' + type + '][entId="' + id + '"]', '#shareBox,#shareTitle').length == 0) {
                jq18(this).remove();
                hideJsonTag(type, id);
            }
        });
    }
}
function getTagPhrase() {
    tagPhrase = null;
    var sel = rangy.getSelection();
    var node = sel.focusNode;
    var pos = sel.focusOffset; //caret offset from beginging of text node
    if (pos == 0 && sel.focusNode && sel.focusNode.previousSibling) //IE might set caret possition to begining of next node rather than end of editing node
        node = sel.focusNode.previousSibling; //if so then use the previous node
    if (node && node.data) {
        var text = pos == 0 ? node.data.trim() : node.data.substring(0, pos).trim(); //if using the previous node then get the whole text, else get from 0 to caret
        if (text) {
            if (text.indexOf('@') > text.indexOf('#')) { //typing a mention
                tagPrefix = '@';
                tagSearchType = "Mentions";
            } else if (text.indexOf('#') > text.indexOf('@')) { //typing a hashtag
                tagPrefix = '#';
                tagSearchType = "Hashtag";
            } else {
                tagPrefix = null;
                tagSearchType = null;
            }
            if (tagPrefix) {
                tagPhrase = text.split(tagPrefix).pop(); //all text between prefix and caret
                if (tagPrefix == '#') {
                    if (tagPhrase.indexOf(' ') > -1) //if typed a hashtag, space will terminate searching
                        return null;
                    else
                        tagPhrase = tagPrefix + tagPhrase; //leave # in search because it is included in index
                }
            }
            else
                return null;
        }
    }
    return tagPhrase;
}
var tagPrefix;
function replaceTagPhraseWithLink(link) {
    var sel = rangy.getSelection();
    var node = sel.focusNode;
    var pos = sel.focusOffset; //caret offset from beginging of text node
    if (pos == 0) //IE might set caret possition to begining of next node rather than end of editing node
        node = sel.focusNode.previousSibling; //if so then use the privious node
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        var toReplace = (tagPrefix != "#" ? tagPrefix : "") + tagPhrase; //# is already part of hashtag searches
        if (pos != 0) {
            range.startContainer.data = range.startContainer.data.replace(toReplace, '');
            range.collapseToPoint(node, pos - toReplace.length);
        } else
            node.data = node.data.replace(toReplace, '');
        tagPrefix = null;
        range.collapse(false);
        if (jq18.browser.chrome || jq18.browser.msie && (jq18.browser.version == "7.0" || jq18.browser.version == "8.0" || jq18.browser.version == "9.0"))
            range.insertNode(document.createTextNode(" "));//IE 8/9 and chrome have a problem with puting a carent where there isn't a text node
        range.insertNode(link);
        range.collapseAfter(link);
        sel.setSingleRange(range);
        if (jq18.browser.safari)
            // Obnoxious space-adding fix for Chrome cursor position
            jq18(range.commonAncestorContainer).html(jq18(range.commonAncestorContainer).html() + " ");
    }
    if (savedSelection)
        rangy.removeMarkers(savedSelection); //remove any marker elements from caret position

}

// Media Tools
function GetMediaURL(mediaID, entType, size) {
    if ((!mediaID || mediaID == '00000000-0000-0000-0000-000000000000') && entType != null)
        return urlTemplates.placeholderUrl + "?id=" + entType + "&size=" + size;
    else
        return urlTemplates.imageProxyUrl + "?id=" + mediaID + "&size=" + size;
}
function hideObjects() {
    //IE11 fixed issue 
    //if (jq18.browser.msie) //IE objects always display on top of other elements (like modal windows)
        //jq18('object, iframe').addClass('ka_hideObject');
}
function unhideObjects() {
    jq18('.ka_hideObject').removeClass('ka_hideObject');
}
function middleAlignImagesCallback(d) {
    for (var i = 0; i < d.images.length; i++) {
        var img = jq18(d.images[i].img);
        if (img.height() > img.parent().height())
            img.css('margin-top', 0 - (img.height() / 2) + (img.parent().height() / 2) + 'px');
    }
}
function linkifyMedia(mediaGroupSelector, disableGrouping) {
    var rel;
    if (disableGrouping) rel = false;
    else rel = mediaGroupSelector;
    jq18(mediaGroupSelector).colorbox({
        rel: rel,
        href: '/_layouts/15/KAMasterPage/imgDetail.ashx',
        data: mediaModalParams,
        loop: false,
        width: 1070,
        initialWidth: 1050,
        height: 649,
        initialHeight: 649,
        title: false,
        current: false,
        className: 'ka_mediaModal'
    });
}
function mediaModalParams() {
    if (jq18(this).attr('ItemID'))
        return { 'videoItemID': jq18(this).attr('ItemID') };
    var imgUrl;
    if (jq18(this).attr('fullsizeurl')) imgUrl = jq18(this).attr('fullsizeurl');
    else imgUrl = jq18(this).attr('src');
    return { 'imageUrl': imgUrl };
}
var ka_slickProperties = {
    lazyLoad: 'progressive',
    nextArrow: '<button type="button" class="slick-next"><img src="/_layouts/15/images/KAMasterPage/Right_Arrow_White.png" /></button>',
    prevArrow: '<button type="button" class="slick-prev"><img src="/_layouts/15/images/KAMasterPage/Right_Arrow_White.png" /></button>'
};
var ka_slickProperties_mini = {
    lazyLoad: 'progressive',
    nextArrow: '<button type="button" class="slick-next"><img src="/_layouts/15/images/KAMasterPage/Right_Arrow_White_Small.png" /></button>',
    prevArrow: '<button type="button" class="slick-prev"><img src="/_layouts/15/images/KAMasterPage/Right_Arrow_White_Small.png" /></button>'
};
function spin(img) { jq18(img).addClass('ka_spinning'); }
function stopspin(img) { jq18(img).removeClass('ka_spinning'); }
function addthrobber(sender) {
    jq18(sender).addClass("throbber16");
}

// Relationship Count Hover Popup
var _miniListTemplate;
function getMiniListTemplate(async) {
    if (!_miniListTemplate) {
        jq18.ajax({
            url: '/_layouts/15/KAMasterPage/mustache/entityMiniList.htm?r=' + Date.now(),
            async: async,
            success: function (template) { _miniListTemplate = template; }
        });
    }
    return _miniListTemplate;
}
var relationLookup;
function popRelations(el) {
    if (relationLookup) {
        relationLookup.abort();
        relationLookup = null;
    }
    if (_miniListTemplate == null) getMiniListTemplate(true); //preload mustache template
    jq18("a").callout("destroy");
    if ((jq18(window).width() - (jq18(el).offset().left + jq18(el).width())) > 285)
        jq18(el).callout({ msg: "<span style='padding:5px;'>Loading...</span>", position: "right", align: "top", pointer: "top", height: 50 });
    else
        jq18(el).callout({ msg: "<span style='padding:5px;'>Loading...</span>", position: "left", align: "top", pointer: "top", height: 50 });
    var getType = el.getAttribute('getType');
    var byType = el.getAttribute('byType');
    var byID = el.getAttribute('byID');
    var alsoBy = el.getAttribute('alsoBy');
    var sendData = { 'getType': getType, 'byType': byType, 'byID': byID };
    if (alsoBy != null) sendData['secondaryFilter'] = alsoBy;

    relationLookup = jq18.getJSON('/_layouts/15/NexusAPIProxy/Relations.ashx',
        sendData,
        function (data) {
            var popHtml = Mustache.render(getMiniListTemplate(false), data);
            jq18("a").callout("destroy");
            if ((jq18(window).width() - (jq18(el).offset().left + jq18(el).width())) > 285)
                jq18(el).callout({ msg: popHtml, position: "right", align: "top", pointer: "top" });
            else
                jq18(el).callout({ msg: popHtml, position: "left", align: "top", pointer: "top" });
        });
}

//misc
function hideWebpart(webpartID) { 
    if ((document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode && document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value != '1') || 
    (document.forms[MSOWebPartPageFormName]._wikiPageMode && document.forms[MSOWebPartPageFormName]._wikiPageMode.value != 'Edit'))
    {
        if (jq18('div[id$=' + webpartID + '].ms-webpartzone-cell').length > 0)
            jq18('div[id$=' + webpartID + '].ms-webpartzone-cell').hide();
        else {
            console.log('Retrying to hide webpart ' + webpartID);
            setTimeout(function () { hideWebpart(webpartID); }, 250);
        }
    }
}
function KA_IMNRC(emailAddr, img) {
    IMNRC(emailAddr, img);
    if (!jq18(img).hasClass('ms-spimn-presence-disconnected-10x10x32'))
        jq18(img).closest('.ms-imnSpan').show();
}
function possibleFileLinkClick(e, link) {
    var href = jq18(link).attr('href');
    if (href.startsWith('file://') || href.startsWith('\\')) {
        if (!e) e = window.event;
        if (e) {
            if (e.preventDefault) e.preventDefault(); //non-IE
            else e.returnValue = false;//IE
        }
        window.prompt("Links to file servers are not supported in most browsers. Please copy and paste the link below:", href);
    }
}

// Expand/collapse functions for Generic Entity Lists

// Expand only (by page size)
function expandEntityListByPage(selector, pageSize) {
    var moreDiv = jq18(selector).parent();
    var entityListDiv = moreDiv.parent();    

    var moreDivIndex = moreDiv.index();
    var firstHiddenItemIndex = entityListDiv.find(".ka_ExpandedEntityItem").first().index();

    var nextPageIndex = firstHiddenItemIndex + pageSize;

    if (nextPageIndex >= moreDivIndex) {
        entityListDiv.children().removeClass("ka_ExpandedEntityItem");
        moreDiv.remove();
    }
    else {
        entityListDiv.children(":lt(" + nextPageIndex + ")").removeClass("ka_ExpandedEntityItem");
    }
}

// Expand and collapse
function expandEntityList(selector) {
    jq18(selector).parent().siblings(".ka_ExpandedEntityItem").slideDown(400, function () {
        jq18(selector).parent().hide();
        jq18(selector).parent().siblings(".ka_CollapseEntitiesDiv").show();
    });
}
function collapseEntityList(selector) {
    jq18(selector).parent().siblings(".ka_ExpandedEntityItem").slideUp(400, function () {
        jq18(selector).parent().hide();
        jq18(selector).parent().siblings(".ka_ExpandEntitiesDiv").show();
    });
}

// KA Simple Modal Dialog
function OpenKASimpleModal(title, url) {
    OpenKAModalWithOptions(title, url, null, null, KASimpleModalCloseCallback);
}
function KASimpleModalCloseCallback(result, msg) {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        if (result === SP.UI.DialogResult.OK) {
            if (msg && msg != '')
                var notifyId = SP.UI.Notify.addNotification(msg, false);
        }
        else if (result === SP.UI.DialogResult.cancel) {
            // Do nothing
        }
        else if (result = SP.UI.DialogResult.invalid) {
            if (msg && msg != '')
                alert(msg);
        }
    });
}
function CloseKAModalWithOK(msg) {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, msg);
    });
}
function CloseKAModalWithCancel() {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel, null);
    });
}
function CloseKAModalWithError(msg) {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.invalid, msg);
    });
}
function CloseKAModalWithOKAndPrompt(msg, value) {
    prompt(msg, value);
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK, null);
    });
}

function OpenKAModalWithOptions(title, url, height, width, callbackFunction)
{
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        var options = SP.UI.$create_DialogOptions();
        options.title = title;
        options.url = url;
        if (!height || !width)
            options.autoSize = true;
        if (height)
            options.height = height;
        if (width)
            options.width;
        options.scroll = 0;
        options.dialogReturnValueCallback = Function.createDelegate(null, callbackFunction);
        SP.UI.ModalDialog.showModalDialog(options);
    });
}

// Add/Remove Sticky Notifications
var KANotificationId = '';
function AddKAStickyNotification(msg) {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        KANotificationId = SP.UI.Notify.addNotification(msg, true);
    });
}
function RemoveKAStickyNotification() {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        SP.UI.Notify.removeNotification(KANotificationId);
        KANotificationId = '';
    });
}
