var debugMode = true;
var isProduction = true;
var isResultPage = false;
var isAdminPage = false;

var quickSearchConfig = {
    delay: 10,             // time to wait before executing the query (in ms) 500
    minCharacters: 1,       // minimum nr of characters to enter before search 3
    resultsAnimation: 0,  // animation time (in ms) of the search results 200
    resultAnimation: 0,      // animation time (in ms) of individual result (when selected) 0
    suggestionsToShow: 10
};

var spotSelectedResult = -1;
var resultsSelected = false;
var suggestReq = false;
var noSuggestions = true;
var getSearchSuggestionsJob;
var inputForSuggestion = "";
var focusOnSuggestion = false;
var selectedSuggestion = false;
var quickFindTimer;
var query = "";

var selectedScope = "Everything";
var selectedFacets = [];
var runFacetSearch = false;
var currentPageIndex = 0;
var currentNexusResultIndex = 0;
var currentSPResultIndex = 0;
var currentNavResultIndex = 0;
var nextNexusResultIndex = 0;
var nextSPResultIndex = 0;
var nextNavResultIndex = 0;
var prevNexusResultIndex = 0;
var prevSPResultIndex = 0;
var prevNavResultIndex = 0;
var pagingArray = [];

var isBrowserBack = false;

var nexusImages;
var spImages;
var nexusVideos;
var spVideos;

var scopesPanelArray = [];
var allScopesArray = ["Everything", "Posts", "Documents", "Images", "Videos", "Wiki Pages", "Employees", "Projects", "Companies", "Opportunities", "Contacts", "Communities", "Topics", "Events", "Links", "Other Results"];
var leftColumnResultsOrder = ["Posts", "Documents", "Images", "Videos", "Wiki Pages", "Events", "Links", "Other Results"];
var rightColumnResultsOrder = ["Employees", "Projects", "Companies", "Opportunities", "Contacts", "Communities", "Topics"];
var nexusScopes = ["Posts", "Images", "Videos", "Employees", "Projects", "Companies", "Opportunities", "Contacts", "Communities", "Topics"];
var sharepointScopes = ["Documents", "Images", "Videos", "Wiki Pages", "Events", "Links", "Other Results"]
var hasLeftColumnResult = false;

var bestBetsResultGroup = {};
var allSearchResults = [];
var allFacetGroups = [];
var resultTemplates = {};//container to lazyload mustache templates into

var referringUrl;
var nexusReq = false;
var spReq = false;
var allReq = false;
var postsReq = false;
var bbPostsReq = false;
var facReq = false;
var nexuFacetsReq = false;
var spFacetsReq = false;
var noResults = true;
var noResultsForScope = true;
var sp2013SearchJob;
var nexusSearchJob;
var getStreamItemsRequest;
var getFacetsRequest;
var searchFacetsRequest;
var groupDisplayLimit = 3;
var pageSize = 10;
var imagePageSize = 50;
var facetLimit = 6;
var facetMoreLimit = 21;
var spFacetSearch = false;
var spPageSearch = false;
var preloadedPosts = false;

var searchLogTimerStart;

function searchResultsGroup(header, nexusHitCount, nexusResults, spHitCount, spResults, spRemovedResultsCount) {
    this.header = header;
    this.count = nexusHitCount + spHitCount;
    this.unfilteredCount = nexusHitCount + spHitCount;
    this.spRemovedResultsCount = spRemovedResultsCount;

    this.moreText = buildMoreLabel(nexusHitCount + spHitCount, header);

    this.currentPageResults = [];
    this.postsToPrefetch = [];

    this.nexusResults = nexusResults;
    this.spResults = spResults;
    this.unfilteredNexusResults = nexusResults.slice();
    this.unfilteredSPResults = spResults.slice();

    this.urlHash = setURLHash(query, header, "", selectedSuggestion);
    
    if (selectedScope == "Everything") this.linkHeader = true; else this.linkHeader = false;
    if (selectedScope == "Everything" && (nexusHitCount + spHitCount) > groupDisplayLimit) this.showFooter = true; else this.showFooter = false;

    this.showPaging = false;

    this.nexusFacets = [];
    this.spFacets = [];
    this.spFacetsUnrefined = [];
    this.currentFacets = [];
    this.allFacets = [];
}

var spotlightPartials;
var spotlightTemplates = {};//container to lazyload mustache templates into
var resultTypeOrder = ["StreamItem", "Document", "Image", "Video", "Wiki", "Employee", "Project", "Company", "Opportunity", "Contact", "MktCampaign", "Community", "Hashtag", "Event", "Link", "Other", "ShowAll"];

jq18(document).ready(function () {

    getURLParameters(true);
    referringUrl = document.referrer;

    if (selectedFacets.length > 0)
        runFacetSearch = true;

    if (query != "")
        jq18(".quickSearchTextBox").val(query);

    jq18(".quickSearchTextBox")
    .focus(function () {
        cacheNavLinks();

        jq18("#ka_QuickSearchResults, #ka_searchIcon").hover(
            function () { resultsSelected = true; },
            function () { resultsSelected = false; }
        );
    })
    .blur(function () {
        if (!resultsSelected) {  //if you click on anything other than the results
            clearResults(); //clear and hide the results
        }
    });

    if (window.location.href.toLowerCase().indexOf("/_layouts/15/search/results.aspx") > -1)
        isResultPage = true;
    if (window.location.href.toLowerCase().indexOf("/_layouts/15/search/searchoptimization.aspx") > -1) {
        isAdminPage = true;

        var searchDiv = jq18("#DeltaPlaceHolderSearchArea");
        jq18("#ka_SearchOptimizationSearchBox").append(searchDiv);
        
        

    }

    if (isResultPage || isAdminPage) {

        jq18('.quickSearchTextBox')
        .focusin(function () {
            window.inSearchBox = true;
            window.browserNavKeyPress = false;
            logToConsole("Search box is in focus.");
        })
       .focusout(function () {
            window.inSearchBox = false;
            logToConsole("Focus out of search box.");
       });

        jq18("#sideNavBox").css('display', 'none');
        jq18("#contentBox").css('margin-left', '100px');
        
        if (query != "")
            initSearch();
    }   

});
jq18(document).click(function (e) {
    if (isResultPage || isAdminPage) {

        var target = e.target;

        if (!jq18(target).is('#ka_DynamicPanelDropdown') && !jq18(target).parents().is('#ka_DynamicPanelDropdown')) {
            jq18('#ka_panelDDL').css('visibility', 'hidden');
        }
    }
});


// SUGGESTION SEARCH

function initSuggestSearch() {
    // Get query from search box
    var query = jq18.trim(jq18(".quickSearchTextBox").val());

    // First store query in data
    jq18(".quickSearchTextBox").data("query", query);

    // Abort any existing requests and clear old results
    stopAllSearches();
    clearResults();

    // start the search
    if (query.length >= quickSearchConfig.minCharacters) {
        quickSearchSelectedDivIndex = -1;

        getSearchSuggestions(query);

    }
}

function getSearchSuggestions(phrase) {
    suggestReq = true;

    var sugData = {
        "searchString": phrase,
        "isAdminPage": isAdminPage
    };
    //logToConsole(JSON.stringify(sugData));

    var url = "/_layouts/15/NexusAPIProxy/GetSuggestions.ashx";
    getSearchSuggestionsJob = jq18.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(sugData),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(function (data) {
        getSearchSuggestionsSuccess(data);
    })
    .fail(function (jqXHR, textStatus) {
        nexusPermissionedSuggestReq = false;
        logToConsole(textStatus);
    });
}
function getSearchSuggestionsSuccess(json) {
    logToConsole(JSON.stringify(json));
    suggestReq = false;

    if (json["suggestionsList"].length > 0) {
        noSuggestions = false;
        showResults(json);
    }
    else if (noSuggestions)
        clearResults();
}

function clearResults() {
    logToConsole("Clearing Suggestions");
    noSuggestions = true;
    selectedSuggestion = false;
    spotSelectedResult = -1;
    jq18("#ka_QuickSearchResults").hide().empty();
}

function showResults(suggestionsJson) {

    logToConsole("In show results: " + JSON.stringify(suggestionsJson));
    var resultsDiv = jq18("#ka_QuickSearchResults");

    // Get query from search box and query from returned json to make sure they match
    var searchBoxQuery = jq18.trim(jq18(".quickSearchTextBox").val());
    logToConsole("searchBoxQuery: " + searchBoxQuery);

    var jsonQuery = suggestionsJson["searchString"];
    logToConsole("jsonQuery: " + jsonQuery);

    // Remove any suggestions from the resultsDiv that no longer match the search box query
    var existingChildren = resultsDiv.children().length;
    logToConsole("Num of children before: " + existingChildren);
    if (existingChildren > 0) {

        jq18.each(resultsDiv.children(), function (i, ch) {
            logToConsole("child query val: " + jq18(ch).attr('query'));
        });

        resultsDiv.children().not("[query='" + escapeHtml(searchBoxQuery) + "']").remove();
        existingChildren = resultsDiv.children().length; // re-count children
    }
    logToConsole("Num of children after: " + existingChildren);

    // If search box and json query match AND there is still room for more suggestions, THEN display them
    if (searchBoxQuery == jsonQuery && existingChildren < quickSearchConfig.suggestionsToShow) {

        var suggestionsArray = suggestionsJson["suggestionsList"];
        var numberOfSuggestions = suggestionsArray.length;

        var divCss = {
            "top": resultsDiv.prev().position().top + resultsDiv.prev().height() + 1,
            "left": resultsDiv.prev().position().left,
            "width": resultsDiv.prev().width(),
            "max-height": jq18(window).height() - 60
        };
        jq18(window).resize(function () {
            resultsDiv.css('max-height', (jq18(window).height() - 60) + 'px'); //resize spotlight on window resize
        });

        var sugs = suggestionsArray.slice();
        if ((quickSearchConfig.suggestionsToShow - existingChildren) < numberOfSuggestions)
            sugs = suggestionsArray.slice(0, quickSearchConfig.suggestionsToShow - existingChildren);

        jq18.each(suggestionsArray, function (i) {
            var suggestionDisplayText = getSuggestionDisplayText(searchBoxQuery, sugs[i]);
            suggestionDiv = jq18("<div>").html(suggestionDisplayText).attr("query", escapeHtml(searchBoxQuery));
            suggestionDiv.click(function () {
                stopAllSearches();
                selectedSuggestion = true;
                query = sugs[i];
                jq18(".quickSearchTextBox").val(query);
                
                resultsDiv.slideUp("fast");
                
                if (isResultPage || isAdminPage) {

                    if (query != "") {
                        window.location.hash = setURLHash(query, selectedScope, "", selectedSuggestion);
                        initSearch();
                    }
                }
                else {
                    if (query != "")
                        window.location = "/_layouts/15/search/results.aspx" + setURLHash(query, "Everything", "", selectedSuggestion);
                }
            });
            resultsDiv.append(suggestionDiv);
            jq18(suggestionDiv).data("suggestion", sugs[i]);
        });

        resultsDiv.css(divCss).show();
    }
}

function getSuggestionDisplayText(searchBoxText, suggestionText) {
    var displayText = suggestionText;
    var parsedSearchBoxText = searchBoxText.toLowerCase().replace('"', '');
    var sbtLength = parsedSearchBoxText.length
    var parsedSuggestionText = suggestionText.toLowerCase();
    if (parsedSuggestionText.indexOf(parsedSearchBoxText) == 0)
        displayText = displayText.slice(0, sbtLength) + "<span style='font-weight:500'>" + displayText.slice(sbtLength) + "</span>";
    else if (parsedSuggestionText.indexOf(" " + parsedSearchBoxText) > 0) {
        var insertPoint = parsedSuggestionText.indexOf(" " + parsedSearchBoxText);
        displayText = "<span style='font-weight:500'>" + displayText.slice(0, insertPoint) + "</span>" + displayText.slice(insertPoint, insertPoint + sbtLength + 1) + "<span style='font-weight:500'>" + displayText.slice(insertPoint + sbtLength + 1) + "</span>";
    }
    else if (parsedSuggestionText.indexOf("#" + parsedSearchBoxText) == 0) {
        displayText = displayText.slice(0, sbtLength + 1) + "<span style='font-weight:500'>" + displayText.slice(sbtLength + 1) + "</span>";
    }
    return displayText;
}

jq18(document)
    .on("mouseover", "#ka_QuickSearchResults>div", function () {   
            if (!selectedSuggestion) {
                jq18('#ka_QuickSearchResults > div').removeClass('suggestionInFocus');
                focusOnSuggestion = true;
                jq18(this).addClass('suggestionInFocus');
                spotSelectedResult = jq18(this).index();
            }
    })
    .on("mouseleave", "#ka_QuickSearchResults>div", function () {
            if (!selectedSuggestion) {
                jq18('#ka_QuickSearchResults > div').removeClass('suggestionInFocus');
                focusOnSuggestion = false;
                spotSelectedResult = -1;
            }
    });

function selectSuggestionByIndex(resultIndex) {
    jq18('#ka_QuickSearchResults > div').removeClass('suggestionInFocus');
    focusOnSuggestion = true;
    var selectedDiv = jq18('#ka_QuickSearchResults > div:eq(' + resultIndex + ')')
    selectedDiv.addClass('suggestionInFocus');
    jq18(".quickSearchTextBox").val(selectedDiv.data("suggestion"));
}


// GENERAL FUNCTIONS

function quickFindKeyUp(e, box) {

    var searchBox = jq18("#" + box)
    switch (e.keyCode) {
        case 13: // enter key pressed
            stopAllSearches();
            if (focusOnSuggestion)
                selectedSuggestion = true;
            query = searchBox.val();
            jq18("#ka_QuickSearchResults").slideUp("fast");

            if (isResultPage || isAdminPage) {
                if (query != "") {
                    referringUrl = window.location.href;
                    window.location.hash = setURLHash(query, selectedScope, "", selectedSuggestion);
                    initSearch();
                }
            }
            else {
                if (query != "")
                    window.location = "/_layouts/15/search/results.aspx" + setURLHash(query, "Everything", "", selectedSuggestion);
            }
            break;
        case 27:  // esc key pressed
            stopAllSearches();
            resultsSelected = false;
            jq18(".quickSearchTextBox").val(inputForSuggestion);
            inputForSuggestion = "";
            focusOnSuggestion = false;
            clearResults();
            break;
        case 38:  // up arrow pressed
            if (spotSelectedResult > -1) { //check bounds
                spotSelectedResult--;

                if (spotSelectedResult > -1)
                    selectSuggestionByIndex(spotSelectedResult);
                else {
                    jq18('#ka_QuickSearchResults > div').removeClass('suggestionInFocus');
                    jq18(".quickSearchTextBox").val(inputForSuggestion);
                    focusOnSuggestion = false;
                }
            }
            else {
                jq18('#ka_QuickSearchResults > div').removeClass('suggestionInFocus');
                jq18(".quickSearchTextBox").val(inputForSuggestion);
                focusOnSuggestion = false;
            }
            break;
        case 40:  // down arrow pressed
            stopAllSearches();

            if (spotSelectedResult < 0)
                inputForSuggestion = jq18(".quickSearchTextBox").val();

            if (spotSelectedResult < (jq18('#ka_QuickSearchResults > div').length - 1)) { //check bounds
                spotSelectedResult++;
                selectSuggestionByIndex(spotSelectedResult);
            }
            break;
        default:
            if (jq18('#' + box).val().trim() == "") //if search box is empty
                clearResults();
            else if (jq18('#' + box).data("query") != jq18('#' + box).val()) {// if the query is different from the previous one, search again
                if (isAdminPage || isProduction) {
                    clearTimeout(quickFindTimer);
                    quickFindTimer = setTimeout(function () {
                        initSuggestSearch();
                    }, quickSearchConfig.delay); // time between key strokes before suggesting tags
                }
                selectedFacets = []; // also, clear out any old selectedFacets, since they won't apply to a new search query
            }
            break;
    }

}
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};
function goResultsPage() {
    stopAllSearches();
    jq18("#ka_QuickSearchResults").slideUp('fast');
    if (jq18(".quickSearchTextBox").val() != '') {
        query = jq18(".quickSearchTextBox").val();
        if (isResultPage || isAdminPage) {
            referringUrl = window.location.href;
            window.location.hash = setURLHash(query, selectedScope, "", selectedSuggestion);
            initSearch();
        }
        else
            window.location = "/_layouts/15/search/results.aspx" + setURLHash(query, "Everything", "", selectedSuggestion);
    }
}
function stopAllSearches() {
    if (getSearchSuggestionsJob != null) {
        getSearchSuggestionsJob.abort();
        getSearchSuggestionsJob = null;
        suggestReq = false;
    }
    if (nexusSearchJob != null) {
        nexusSearchJob.abort();
        nexusSearchJob = null;
        nexusReq = false;
    }
    if (sp2013SearchJob != null) {
        sp2013SearchJob.abort();
        sp2013SearchJob = null;
        spReq = false;
    }
    if (getStreamItemsRequest != null) {
        getStreamItemsRequest.abort();
        getStreamItemsRequest = null;
        postsReq = false;
    }
    if (getFacetsRequest != null) {
        getFacetsRequest.abort();
        getFacetsRequest = null;
        nexusFacetsReq = false;
    }
    if (searchFacetsRequest != null) {
        searchFacetsRequest.abort();
        searchFacetsRequest = null;
        nexusReq = false;
    }
}
function getURLParameters(includeFacets) {

    // Reset variables to defaults before populating from hash
    query = "";
    selectedScope = "Everything";
    selectedFacets = [];
    selectedSuggestion = false;

    if (window.location.hash != "") {
        var hash = (function (a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p = a[i].split('=');
                if (p.length != 2) continue;
                b[p[0]] = p[1];
            }
            return b;
        })(window.location.hash.substr(1).split('&'));

        if (hash["Query"] != null)
            query = decodeURIComponent(hash["Query"].replace(/\+/g, " "));

        if (hash["Scope"] != null)
            selectedScope = decodeURIComponent(hash["Scope"]);

        if (hash["Ref"] != null && includeFacets) {
            var refPair = hash["Ref"].split('+');

            jq18.each(refPair, function (i, val) {
                var r = convertURLRefinementToSelectedFacet(val);
                selectedFacets.push(r);
            })
        }

        if (hash["sg"] != null)
            selectedSuggestion = hash["sg"];

    }

}
function setURLHash(q, s, r, isSug) {
    var hash = "#";

    if (q != "")
        hash += "Query=" + encodeURIComponent(q) + "&";

    if (s != "Everything")
        hash += "Scope=" + encodeURIComponent(s) + "&";

    if (r != "") {
        var refString = "";
        var catToClear = "";
        if (r.indexOf("ClearFacets") > -1)
            catToClear = r.split('_eq_')[0];

        if (selectedFacets.length > 0) {
            jq18.each(selectedFacets, function (index, value) {
                if (value.facetName != catToClear) {
                    if (value.spRefinementValue)
                        refString += encodeURIComponent(value.facetName.replace(' ', '_') + '_eq_' + value.spRefinementValue) + '+';
                    else
                        refString += encodeURIComponent(value.facetName.replace(' ', '_') + '_eq_' + value.facetID) + '+';
                }
            });
        }

        if (r.indexOf("ClearFacets") < 0)
            refString += encodeURIComponent(r) + '+';

        if (refString != "") {
            if (refString.slice(-1) == "+")
                refString = refString.substring(0, refString.length - 1);

            hash += "Ref=" + refString;
        }
    }

    if (isSug)
        hash += "sg=true&";
    else
        hash += "sg=false&";

    hash = hash.replace(/\&\s*$/, "");

    return hash;
}

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function FormatDateTimeStamp(dateInput) {
    var formattedStamp;
    if (dateInput > new Date(new Date() - 1 * 60 * 1000)) //newer than a minute ago
        formattedStamp = Math.round((new Date() - dateInput) / 1000) + " sec";
    else if (dateInput > new Date(new Date() - 1 * 60 * 60 * 1000)) //newer than an hour ago
        formattedStamp = Math.round((new Date() - dateInput) / (60 * 1000)) + " min";
    else if (dateInput > new Date(new Date() - 1 * 24 * 60 * 60 * 1000)) //newer than a day ago
        formattedStamp = Math.round((new Date() - dateInput) / (60 * 60 * 1000)) + "h";
    else {
        var year = dateInput.getFullYear() != new Date().getFullYear() ? (", " + dateInput.getFullYear().toString()) : ""; //if not in current year then show yyyy
        formattedStamp = monthNames[dateInput.getMonth()] + " " + dateInput.getDate() + year;
    }
    return formattedStamp;
}
function FormatDuration(seconds) {
    var min = Math.floor(seconds/60);
    var sec = seconds - (min*60);
    var hr = Math.floor(min/60);
    min = min - (hr*60);
    return (hr ? hr + ':' : '') + (hr && min<10 ? '0' + min : min) + ':' + (sec<10 ? '0' + sec : sec);
}
function FormatEventTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function getIconName(fileExtension) {
    switch (fileExtension) {
        case "doc":
        case "dot":
        case "docx":
        case "dotx":
        case "docm":
        case "dotm":
        case "rtf":
            return "docIcon";
        case "xls":
        case "xlt":
        case "xlm":
        case "xlsm":
        case "xlts":
        case "xlsx":
            return "xlsIcon";
        case "sldx":
        case "sldm":
        case "ppt":
        case "pot":
        case "pptm":
        case "ppsx":
        case "ppsm":
        case "pptx":
            return "pptIcon";
        case "pdf":
            return "pdfIcon";
        default:
            return "GenericDocument";
    }
}
function removeHiddenImages(imgs) {
    imgs.load(function () { //as each image loads
        var firstBottom = "none";
        jq18.each(imgs, function (i, el) { //check each sibling to make sure it fits
            if (firstBottom == "none")
                firstBottom = el.offsetTop + el.height;
            else if (el.offsetTop > firstBottom) //if not
                el.remove(); //remove it
        });
    });
}
function buildMoreLabel(hitCount, scope)
{
    scope = scope.toLowerCase();

    if (scope == "other results")
        scope = "results";

    var singleScope = scope.substring(0, scope.length - 1);

    if (scope == "opportunities")
        singleScope = "opportunity";
    else if (scope == "companies")
        singleScope = "company";
    else if (scope == "communities")
        singleScope = "community";

    if (hitCount > (100 + groupDisplayLimit))
        return "100+ more " + scope;
    else if ((hitCount - groupDisplayLimit) == 1) 
        return "1 more " + singleScope;
    else
        return (hitCount - groupDisplayLimit) + " more " + scope;   
}



// BELOW IS STUFF FOR THE RESULTS PAGE

function initSearch() {

    searchLogTimerStart = Date.now();

    noresults = true;

    if (selectedScope == "Everything")
        noResultsForScope = false;
    else
        noResultsForScope = true;

    stopAllSearches();
    resetPagingToDefaults();
    allSearchResults = [];
    allFacetGroups = [];
    spFacetSearch = false;
    spPageSearch = false;

    jq18("img.loading").removeClass("ka_HiddenElement");

    if (!jq18(".ka_NoResults").hasClass("ka_HiddenElement")) {
        jq18(".ka_NoResults").addClass("ka_HiddenElement");
    }
    
    // start the search
    //if (selectedScope != "Documents" && selectedScope != "Wiki Pages" && selectedScope != "Events" && selectedScope != "Links" && selectedScope != "Other Results")
        nexusSearch(query);

    //if (selectedScope == "Everything" || selectedScope == "Documents" || selectedScope == "Links" || selectedScope == "Wiki Pages" || selectedScope == "Events" || selectedScope == "Images" || selectedScope == "Videos" || selectedScope == "Other Results")
        spSearchViaProxy(query);

    jq18(".ka_SearchResults").empty();
    jq18("#ka_SearchScopesPanel").empty();

}

function buildScopesPanel() {

    resultScopes = jq18.map(allSearchResults, function (group) {
        return group.header;
    });

    // Now that we know the result scopes, if there is not a left column result, we need to collapse the width of that column
    var collapseLeftColumn = true;
    if (selectedScope != "Everything")
        collapseLeftColumn = false;
    else {
        jq18.each(resultScopes, function (index, resultScope) {
            if (leftColumnResultsOrder.indexOf(resultScope) > -1) {
                collapseLeftColumn = false;
                return false;
            };
        });
    }
    if (collapseLeftColumn) {
        if (jq18("#ka_SearchResultsLeftColumn").hasClass("ka_SearchResultsLeft")) {
            jq18("#ka_SearchResultsLeftColumn").removeClass("ka_SearchResultsLeft");
        }
        if (jq18("#ka_SearchResultsRightColumn").hasClass("ka_SearchResultsRight")) {
            jq18("#ka_SearchResultsRightColumn").removeClass("ka_SearchResultsRight");
        }
    }
    else {
        if (!jq18("#ka_SearchResultsLeftColumn").hasClass("ka_SearchResultsLeft")) {
            jq18("#ka_SearchResultsLeftColumn").addClass("ka_SearchResultsLeft");
        }
        if (!jq18("#ka_SearchResultsRightColumn").hasClass("ka_SearchResultsRight")) {
            jq18("#ka_SearchResultsRightColumn").addClass("ka_SearchResultsRight");
        }
    }

    scopesPanelArray = jq18.grep(allScopesArray, function (s) {
        return s == "Everything" || resultScopes.indexOf(s) > -1;
    });

    var fixedScopeArray = [];
    var dynamicScopeArray = [];

    if (scopesPanelArray.length > 7)
    {
        //logToConsole(JSON.stringify(scopesPanelArray));
        fixedScopeArray = scopesPanelArray.slice(0, 6);
        dynamicScopeArray = scopesPanelArray.slice(6);
        
        var dynamicElement = scopesPanelArray[6];
        var dynamicElementIndex = dynamicScopeArray.indexOf(selectedScope);

        if (dynamicElementIndex > -1)
            dynamicElement = selectedScope;

        var dynamicPanel = "<a href='" + setURLHash(query, dynamicElement, "", selectedSuggestion) + "' id='ka_searchScope_" + dynamicElement.replace(' ', '_') + "' onclick='selectScope(this.id);'>" + dynamicElement + "</a><ul id='ka_DynamicPanelDropdown' class='ka_searchMore dropdown' ><li><a href='#' onmouseover='toggleDynamicScope();'>More<img src='/_layouts/15/images/KAWebParts/More_lt_grey.png' alt='More'  style='margin-left:5px;' /></a></li></ul>"

        var remainingArray = dynamicScopeArray.slice();
        remainingArray.splice(remainingArray.indexOf(dynamicElement), 1);

        var dynamicPanelDropDown = "<li><ul id='ka_panelDDL' class='ka_MoreScopesDropdown' >";
        jq18.each(remainingArray, function (i, val) {
            dynamicPanelDropDown += "<li><a href='" + setURLHash(query, val, "", selectedSuggestion) + "' id='ka_searchScope_" + val.replace(' ', '_') + "' onclick='selectScope(this.id);'>" + val + "</a></li>";
        });
        dynamicPanelDropDown += "</ul></li>"
    }
    else 
        fixedScopeArray = scopesPanelArray;

    var fixedPanel = "";
    jq18.each(fixedScopeArray, function (i, val) {
        fixedPanel += "<a href='" + setURLHash(query, val, "", selectedSuggestion) + "' id='ka_searchScope_" + val.replace(' ', '_') + "' onclick='selectScope(this.id);' >" + val + "</a>";
    });
     
    jq18("#ka_SearchScopesPanel").empty();
    jq18("#ka_SearchScopesPanel").append(fixedPanel);

    if (dynamicScopeArray.length > 0) {
        jq18("#ka_SearchScopesPanel").append(dynamicPanel);
        jq18("#ka_DynamicPanelDropdown").append(dynamicPanelDropDown);
    }

    jq18("#ka_searchScope_" + selectedScope.replace(' ', '_')).addClass("ka_SelectedScope");

}
function toggleDynamicScope() {
    if (jq18('#ka_panelDDL').css('visibility') == 'hidden')
        jq18('#ka_panelDDL').css('visibility', 'visible');
    else
        jq18('#ka_panelDDL').css('visibility', 'hidden');
}
function selectScope(scopeID) {

    searchLogTimerStart = Date.now();
    var oldScope = selectedScope;
    selectedScope = scopeID.substring(15).replace('_', ' ');

    jq18("img.loading").removeClass("ka_HiddenElement");
    if (oldScope != "Everything") {
        var previousGroup = getCurrentGroupFromAllResults(oldScope);
        previousGroup.count = previousGroup.unfilteredCount;
        previousGroup.nexusResults = previousGroup.unfilteredNexusResults.slice();
        previousGroup.spResults = previousGroup.unfilteredSPResults.slice();
        previousGroup.currentFacets = previousGroup.allFacets.slice();        
    }

    resetPagingToDefaults();   
    
    allFacetGroups = [];
    selectedFacets = [];
    spFacetSearch = false;
    spPageSearch = false;
    jq18(".ka_SearchResults").empty();
    jq18("#ka_SearchScopesPanel").scrollTop();
    transformAllResultGroups();

}

function spSearchViaProxy(query) {
    spReq = true;

    var spSearchScope = "Everything";
    var refinements = [];

    if (spFacetSearch || spPageSearch) {
        spSearchScope = selectedScope;
        refinements = selectedFacets;
    }
    
    var spData = {
        "query": query,
        "scope": spSearchScope,
        "refinements": refinements,
        "relevantResultsStartIndex": currentSPResultIndex,
        "navResultsStartIndex": currentNavResultIndex,
        "pageSize": pageSize,
        "imagePageSize": imagePageSize
    };

    //logToConsole(JSON.stringify(spData));
    var start = Date.now();

    var url = "/_layouts/15/NexusAPIProxy/SPSearch.ashx";
    sp2013SearchJob = jq18.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(spData),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
        .done(function (data) {
            //logToConsole(data);
            var timeElapsed = Date.now() - start;
            logToConsole("SPSearch request took " + timeElapsed + "ms");           
            spSearchViaProxySuccess(data);
        })
        .fail(function (jqXHR, textStatus) {
            ajaxRequestFailed("spSearchViaProxy", textStatus);
        });
}
function spSearchViaProxySuccess(json) {
    
    if (json && json.logMessage)
        logToConsole("SPSearch Log Message: " + json.logMessage);

    jq18.each(sharepointScopes, function (i, scope) {

        if (json[scope] && json[scope].logMessage)
            logToConsole("Log Message for " + scope + " results from SP Search: " + JSON.stringify(json[scope].logMessage));

        if (json[scope] && json[scope].hitCount > 0) {

            if (selectedScope == scope)
                noResultsForScope = false;

            var spResults = [];
            jq18.each(json[scope].results, function (i, r) {
                transformSPResult(scope, r);
                spResults.push(r);
            });

            var results;
            
            var foundGroup = getCurrentGroupFromAllResults(scope);

            if (foundGroup) {
                results = foundGroup;

                if (!spPageSearch)
                    results.count += json[scope].hitCount;

                //results.moreText = buildMoreLabel(results.count, results.header);
                //if (selectedScope == "Everything" && results.count > groupDisplayLimit) results.showFooter = true; else results.showFooter = false;
                results.spResults = spResults;
                results.spRemovedResultsCount = json[scope].resultsRemovedFromPage || 0;

                //logToConsole("unfilteredCount: " + results.unfilteredCount + ", spFacetSearch: " + spFacetSearch + ", spPageSearch: " + spPageSearch);
                if (!spFacetSearch && !spPageSearch) {
                    results.unfilteredCount += json[scope].hitCount;
                    results.unfilteredSPResults = spResults.slice();
                    results.moreText = buildMoreLabel(results.unfilteredCount, results.header);
                    if (selectedScope == "Everything" && results.unfilteredCount > groupDisplayLimit) results.showFooter = true; else results.showFooter = false;

                }                    
            }
            else {
                results = new searchResultsGroup(scope, 0, [], json[scope].hitCount, spResults, json[scope].resultsRemovedFromPage || 0);
                allSearchResults.push(results);
            }                
            
            results.spFacetsUnrefined = json[scope].facets;
            //logToConsole(JSON.stringify(results.spFacetsUnrefined));

        }
    });

    spReq = false;
    
    if (allSearchResults.length > 0) {
        noResults = false;

        if (!nexusReq) {
            
            if (noResultsForScope) {
                selectedScope = "Everything";
                selectedFacets = [];
                window.location.hash = setURLHash(query, "Everything", "", selectedSuggestion);
            }

            transformAllResultGroups();
        }
    }
    else {
        if (!nexusReq) {
            jq18("img.loading").addClass("ka_HiddenElement");
            displayNoResults();
        }

    }
       
}
function getSPDisplayIconUrl(scope, fileExtension, resultIconName) {
    var internalIconName;
    if (scope == "Wiki Pages")
        return  "/_layouts/15/KA Search/icons/wikiIcon.png";
    else if (scope == "Links")
        return "/_layouts/15/KA Search/icons/linkIcon.png";
    else
        internalIconName = getIconName(fileExtension);

    if (!internalIconName) {
        if (!resultIconName)
            return "/_layouts/15/images/" + resultIconName;
        else
            return "/_layouts/15/KA Search/icons/GenericDocument.png";
    }
    else
        return "/_layouts/15/KA Search/icons/" + internalIconName + ".png";
}

function nexusSearch(query) {
    nexusReq = true;
    
    var maxResults = 1000;
    var preParsedQuery = preParseNexusQuery(query);
    var start = Date.now();

    logToConsole("Parsed Nexus Query: " + preParsedQuery);

    var url = "/_layouts/15/NexusAPIProxy/Search2.ashx?searchString=" + preParsedQuery + "&searchType=All&maxResults=" + maxResults;
    nexusSearchJob = jq18.getJSON(url, nexusSearchSuccess)
        .done(function () {
            var timeElapsed = Date.now() - start;
            logToConsole("Nexus Search request took " + timeElapsed + "ms")
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            ajaxRequestFailed("nexusSearch", textStatus);
        });    
}
function nexusSearchSuccess(json) {

    // Best Bets
    if (json.BestBet && json.BestBet.hitCount) {

        var bbResults = [];
        var streamItemIds = [];

        jq18.each(jq18(json.BestBet.results), function (i, r) {

            if (r["$type"] == "StreamItem") {
                streamItemIds.push(r.ItemID);
            }

            transformNexusResult(r["$type"], r);

            if (selectedScope == r.Scope)
                noResultsForScope = false;

            bbResults.push(r);
        });

        bestBetsResultGroup.count = json.BestBet.hitCount;
        bestBetsResultGroup.unfilteredBestBets = bbResults;
        bestBetsResultGroup.streamItemIds = streamItemIds;

        if (streamItemIds.length > 0) {
            bbPostsReq = true;
            getStreamItems(bestBetsResultGroup, streamItemIds, true);
        }
    }
    else {
        bestBetsResultGroup.count = 0;
        bestBetsResultGroup.unfilteredBestBets = [];
        bestBetsResultGroup.streamItemIds = [];
    }

    jq18.each(nexusScopes, function (i, scope) {
        resultType = getNexusSearchType(scope);
        if (json[resultType] && json[resultType].hitCount) {

            if (selectedScope == scope)
                noResultsForScope = false;

            var nexusResults = [];
            var postsToPrefetch = [];

            if (scope == "Posts") {
                if (json.StreamItem.results.length > pageSize)
                    postsToPrefetch = json.StreamItem.results.slice(0, pageSize);                              
            }

            jq18.each(jq18(json[resultType].results), function (i, r) {
                transformNexusResult(resultType, r);
                nexusResults.push(r);
            });

            var results;
            if (scope == "Images" || scope == "Videos") {

                var foundGroup = getCurrentGroupFromAllResults(scope);

                if (foundGroup) {
                    results = foundGroup;
                    results.count += json[resultType].hitCount;
                    results.unfilteredCount += json[resultType].hitCount;
                    results.moreText = buildMoreLabel(results.unfilteredCount, results.header);
                    if (selectedScope == "Everything" && results.unfilteredCount > groupDisplayLimit) results.showFooter = true; else results.showFooter = false;
                    results.nexusResults = nexusResults;
                    results.unfilteredNexusResults = nexusResults.slice();
                }
                else {
                    results = new searchResultsGroup(scope, json[resultType].hitCount, nexusResults, 0, [], 0);
                    allSearchResults.push(results);
                }
            }
            else {
                results = new searchResultsGroup(scope, json[resultType].hitCount, nexusResults, 0, [], 0);

                if (scope == "Posts") {
                    results.postsToPrefetch = postsToPrefetch;

                    // Adding special pre-processing for post results on the Everything page, that was previously done in the transformResultGroup stuff (hopefully, doing it earlier will make it faster)
                    if (selectedScope == "Everything") {
                        results.currentPageResults = results.nexusResults.slice(currentNexusResultIndex);
                        if (results.currentPageResults.length > groupDisplayLimit)
                            results.currentPageResults = results.currentPageResults.slice(0, groupDisplayLimit);
                        preloadedPosts = true;
                        postsReq = true;
                        getPostResultsDetails(results, true);
                        getPostResultsDetails(results, false);
                    }

                    allSearchResults.unshift(results);
                }
                else
                    allSearchResults.push(results);
            }
                                  
        }        
    });

    nexusReq = false;

    if (allSearchResults.length > 0 || bestBetsResultGroup.count > 0) {
        noResults = false;

        if (!spReq) {
            
            if (noResultsForScope) {
                selectedScope = "Everything";
                selectedFacets = [];
                window.location.hash = setURLHash(query, "Everything", "", selectedSuggestion);
            }

            transformAllResultGroups();
        }        
    }
    else {
        if (!spReq) {            
            jq18("img.loading").addClass("ka_HiddenElement");
            displayNoResults();
        }
    }
    
}
function getNexusSearchType(scope) {
    switch (scope) {
        case "Employees":
            return "Employee";
            break;
        case "Projects":
            return "Project";
            break;
        case "Contacts":
            return "Contact";
            break;
        case "Companies":
            return "Company";
            break;
        case "Campaigns":
            return "MktCampaign";
            break;
        case "Opportunities":
            return "Opportunity";
            break;
        case "Communities":
            return "Community";
            break;
        case "Topics":
            return "Hashtag";
            break;
        case "Posts":
            return "StreamItem";
            break;
        case "Images":
            return "Media";
            break;
        case "Videos":
            return "Video";
            break;
        default:
            return "All";
            break;
    }
}
function preParseNexusQuery(inQuery)
{    
    if (selectedSuggestion)
        inQuery = inQuery.replace(/:/g, "\\:").replace(/-/g, "\\-").replace(/\+/g, "\\+").replace(/\?/,"\\?");

    logToConsole("selectedSuggestion: " + selectedSuggestion + ", parsedQuery: " + inQuery);

    return encodeURIComponent(inQuery);

}

function transformSPResult(resultType, result) {
    result.source = "SharePoint";

    if (result.lastModDate)
        result.lastModDate = FormatDateTimeStamp(new Date(result.lastModDate));

    result.icon = getSPDisplayIconUrl(resultType, result.fileExtension, result.icon);
    
    if (result.authorID)
        result.authorName = '<a href="' + urlTemplates.employeeProfileUrl + '?Employee=' + result.authorID + '">' + result.authorName + '</a>';

    if (result.spListId) {
        if (result.spListItemId)
            result.Identifier = "SharepointListItem||" + result.spListId + "|" + result.spListItemId;
        else
            result.Identifier = "SharepointList||" + result.spListId;
    }
    else
        result.Identifier = result.resultType + "||" + result.title;
       
    switch (resultType) {
        case "Documents":            
            
            if (result.path && result.path.indexOf('.aspx?') > -1) {  // if the result.path is a link to one of those display aspx pages, then use the encoded file URL
                if (result.encodedFileUrl)
                    result.path = result.encodedFileUrl;
            }
            else
                result.path = encodeURI(result.path);
                   
            if (result.path.indexOf('/') > -1) 
                result.title = decodeURIComponent(result.path.substr(result.path.lastIndexOf('/') + 1)); //filename  
            else if (result.fileExtension)
                result.title += "." + result.fileExtension;

            result.Scope = "Documents";
            result.IsDocument = true;

            break;
        case "Links":
            result.displayUrl = result.path;
            var startIndex = result.path.indexOf("://");
            if (startIndex > -1)
                result.displayUrl = result.path.substring(startIndex + 3);

            result.Scope = "Links";
            result.IsLink = true;

            break;
        case "Events":
            result.eventDate = new Date(result.eventDate);
            result.eventMonth = monthNames[result.eventDate.getMonth()].toUpperCase();
            result.eventDay = result.eventDate.getDate();
            result.eventYear = result.eventDate.getFullYear();

            if (result.eventAllDay)
                result.eventTime = "All Day Event";
            else if (result.eventRecurring)
                result.eventTime = "Recurring Event. This instance begins at " + FormatEventTime(result.eventDate);
            else
                result.eventTime = FormatEventTime(result.eventDate);

            result.Scope = "Events";
            result.IsEvent = true;
            break;
        case "Images":
            if (result.title.trim() == '')
                result.title = result.path.substr(result.path.lastIndexOf('/') + 1); //filename
            else if (result.fileExtension)
                result.title += "." + result.fileExtension;
            result.oversizeImage = false;
            result.ImageUrl = result.encodedFileUrl;
            if (result.size > 5000000 && !result.pictureThumbnailUrl)//max size in bytes (5MB) (ie. large image not in picture library)
            {
                result.oversizeImage = true;
                result.size = (result.size.toFixed(2) / 1000000).toFixed(2);
            }
            result.Scope = "Images";
            result.IsImage = true;
            break;
        case "Videos":
            result.ProfileUrl = result.path;
            result.DateStamp = result.lastModDate;
            result.Scope = "Videos";
            result.IsVideo = true;
            break;
        default:
            result.Scope = "Other Results";
            result.IsOtherResult = true;
            break;
    }
}
function transformNexusResult(resultType, result)
{
    var imageID = "00000000-0000-0000-0000-000000000000";
    result.source = "Nexus";

    switch (resultType) {
        case "Employee":
            result.Identifier = result.EmployeeID;
            if (result.PrimaryImageID)
                imageID = result.PrimaryImageID;
            result.ImageUrl = getDisplayImageUrl(result.$type, imageID, null);
            result.ProfileUrl = urlTemplates.employeeProfileUrl + '?Employee=' + result.EmployeeID;
            result.Scope = "Employees";
            result.IsEmployee = true;
            break;
        case "Project":
            result.Identifier = result.ProjectID;
            if (result.PrimaryImageID)
                imageID = result.PrimaryImageID;
            result.ImageUrl = getDisplayImageUrl(result.$type, imageID, null);
            if (result.ClientID)
                result.ClientProfileUrl = urlTemplates.companyProfileUrl + '?Company=' + result.ClientID;
            result.ProfileUrl = urlTemplates.projectProfileUrl + '?Project=' + result.ProjectID;
            result.Scope = "Projects";
            result.IsProject = true;
            break;
        case "Contact":
            result.Identifier = result.ContactID;
            if (result.PrimaryImageID)
                imageID = result.PrimaryImageID;
            result.ImageUrl = getDisplayImageUrl(result.$type, imageID, null);
            if (result.CompanyID)
                result.CompanyProfileUrl = urlTemplates.companyProfileUrl + '?Company=' + result.CompanyID;
            result.ProfileUrl = urlTemplates.contactProfileUrl + '?Contact=' + result.ContactID;
            result.Scope = "Contacts";
            result.IsContact = true;
            break;
        case "Company":
            result.Identifier = result.CompanyID;
            if (result.PrimaryImageID)
                imageID = result.PrimaryImageID;
            result.ImageUrl = getDisplayImageUrl(result.$type, imageID, null);
            result.ProfileUrl = urlTemplates.companyProfileUrl + '?Company=' + result.CompanyID;
            result.Scope = "Companies";
            result.IsCompany = true;
            break;
        case "Opportunity":
            result.Identifier = result.OpportunityID;
            if (result.PrimaryImageID)
                imageID = result.PrimaryImageID;
            result.ImageUrl = getDisplayImageUrl(result.$type, imageID, null);
            if (result.ClientID)
                result.ClientProfileUrl = urlTemplates.companyProfileUrl + '?Company=' + result.ClientID;
            result.ProfileUrl = urlTemplates.opportunityProfileUrl + '?Opportunity=' + result.OpportunityID;
            result.Scope = "Opportunities";
            result.IsOpportunity = true;
            break;
        case "Community":
            result.Identifier = result.CommunityID;
            result.ImageUrl = "/_layouts/15/KA Search/icons/communityIcon.png";
            result.Scope = "Communities";
            result.IsCommunity = true;
            break;
        case "Hashtag":
            result.Identifier = result.HashtagID;
            result.ImageUrl = "/_layouts/15/KA Search/icons/topicIcon.png";
            result.ProfileUrl = urlTemplates.topicUrl + '?Hashtag=' + encodeURIComponent(result.HashtagID);
            result.Scope = "Topics";
            result.IsHashtag = true;
            break;
        case "Media":
            result.Identifier = result.MediaID;
            result.ImageUrl = urlTemplates.imageProxyUrl + '?id=' + result.MediaID + '&size=240w180h';
            result.Scope = "Images";
            result.IsMedia = true;
            break;
        case "Video":
            if (result.ItemID) {
                result.Identifier = "ItemID||" + result.ItemID;
                result.title = result.SubItemTitle;
                if (result.Duration) result.Duration = FormatDuration(result.Duration);
                if (result.DateStamp) result.DateStamp = FormatDateTimeStamp(new Date(result.DateStamp));
                if (result.ThumbnailMediaID) result.ImageUrl = urlTemplates.imageProxyUrl + '?id=' + result.ThumbnailMediaID + '&size=240w240h';
                result.ProfileUrl = result.SubItemProfileUrl;
                result.DisplayUrl = result.SubItemProfileUrl;

                if (result.SubItemProfileUrl) {
                    var startIndex = result.SubItemProfileUrl.indexOf("://");
                    if (startIndex > -1)
                        result.DisplayUrl = result.SubItemProfileUrl.substring(startIndex + 3);
                }
            }
            else {
                result.Identifier = "DAMImageID||" + result.DAMImageID;
                if (result.Caption) result.title = result.Caption; else result.title = result.DAMImageID;
                if (result.Duration) result.Duration = FormatDuration(result.Duration);
                if (result.DateStamp) result.DateStamp = FormatDateTimeStamp(new Date(result.DateStamp));
                if (result.ThumbnailMediaID) result.ImageUrl = urlTemplates.imageProxyUrl + '?id=' + result.ThumbnailMediaID + '&size=240w240h';
                result.ProfileUrl = result.DAM_ImageRecord;
            }
            result.Scope = "Videos";
            result.IsVideo = true;
            break;
        case "StreamItem":
            result.Identifier = result.ItemID;
            result.Scope = "Posts";
            result.IsStreamItem = true;
            break;
        case "SharepointList":
            result.Identifier = result.ListID;
            result.Scope = "Other Results";
            result.IsOtherResult = true;
            result.icon = "/_layouts/15/KA Search/icons/GenericDocument.png";

            if (result.DateModified)
                result.lastModDate = FormatDateTimeStamp(new Date(result.DateModified));

            break;
        case "SharepointListItem":
            result.Identifier = result.ListItemID;

            if (result.SearchScope == 3) {
                result.Scope = "Videos";
                result.IsVideo = true;
            }
            else if (result.SearchScope == 4) {
                result.Scope = "Documents";
                result.IsDocument = true;
            }
            else if (result.SearchScope == 5) {
                result.Scope = "Wiki Pages";
                result.IsWikiPage = true;
            }
            else if (result.SearchScope == 7) {
                result.Scope = "Events";
                result.IsEvent = true;
            }
            else {
                result.Scope = "Other Results";
                result.IsOtherResult = true;
            }

            result.icon = getSPDisplayIconUrl(result.Scope, result.FileExtension, "");

            if (result.DateModified)
                result.lastModDate = FormatDateTimeStamp(new Date(result.DateModified));

            break;
        case "ExternalLink":
            result.Identifier = result.ResultName;

            result.displayUrl = result.ResultUrl;
            var startIndex = result.ResultUrl.indexOf("://");
            if (startIndex > -1)
                result.displayUrl = result.ResultUrl.substring(startIndex + 3);


            result.Scope = "Links";
            result.IsExternalLink = true;
            break;
        default:
            result.Scope = "Other Results";
            result.IsOtherResult = true;
            break;
    }
}
function transformAllResultGroups()
{
    allReq = true;

    if (selectedScope != "Everything") {
        facReq = true;

        var selectedGroup = getCurrentGroupFromAllResults(selectedScope);
        transformResultGroup(selectedGroup);

        if (bestBetsResultGroup.count > 0 && currentPageIndex == 0 && selectedFacets.length == 0) {
            var bestBetsUnfiltered = bestBetsResultGroup.unfilteredBestBets.slice();
            bestBetsResultGroup.currentPageBestBets = jq18.grep(bestBetsUnfiltered, function (n, i) {
                return n.Scope == selectedScope;
            });

            if (bestBetsResultGroup.currentPageBestBets.length == 1)
                bestBetsResultGroup.header = "Best Bet";
            else
                bestBetsResultGroup.header = "Best Bets";
        }
        else
            bestBetsResultGroup.currentPageBestBets = [];
    }
    else {
        facReq = false;

        jq18.each(allSearchResults, function (i, group) {
            transformResultGroup(group);
        });

        if (bestBetsResultGroup.count > 0) {

            if (bestBetsResultGroup.count == 1)
                bestBetsResultGroup.header = "Best Bet";
            else
                bestBetsResultGroup.header = "Best Bets";

            bestBetsResultGroup.currentPageBestBets = bestBetsResultGroup.unfilteredBestBets.slice();
        }
        else
            bestBetsResultGroup.currentPageBestBets = [];
    }

    logToConsole(JSON.stringify(bestBetsResultGroup));

    allReq = false;
    if (!postsReq && !bbPostsReq && !facReq) // && !runFacetSearch)
        formatAllResults();

}
function transformResultGroup(group)
{
    if (group.header == "Images" || group.header == "Videos")
    {
        mixAndMatchResults(group);

        if (selectedScope == group.header) {

            if (group.currentFacets.length > 0) {
                allFacetGroups = group.currentFacets.slice();
                facReq = false;
            }
            else {
                spFacetsReq = true;
                nexusFacetsReq = true;
                getNexusFacetsData(group);
                buildFacetsList(group.spFacetsUnrefined, group, "sharepoint");
            }
        }
    }
    else if (sharepointScopes.indexOf(group.header) > -1) {
        group.currentPageResults = group.spResults.slice();

        if (selectedScope == group.header) {

            if (group.currentFacets.length > 0) {
                allFacetGroups = group.currentFacets.slice();
                facReq = false;
            }
            else {
                nexusFacetsReq = false;
                spFacetsReq = true;
                buildFacetsList(group.spFacetsUnrefined, group, "sharepoint");
            }
        }
    }
    else {

        if (group.header != "Posts")
            group.currentPageResults = group.nexusResults.slice(currentNexusResultIndex);
        else {
            if (!preloadedPosts) { // because this was already done for posts on the Everything page
                group.currentPageResults = group.nexusResults.slice(currentNexusResultIndex);
            }            
        }

        if (selectedScope == group.header) {

            if (group.currentFacets.length > 0 || group.header == "Topics") {
                allFacetGroups = group.currentFacets.slice();
                facReq = false;
            }
            else {
                nexusFacetsReq = true;
                spFacetsReq = false;
                getNexusFacetsData(group);
            }
        }
    }

    //logToConsole("RUN FACET SEARCH: " + runFacetSearch);
    if (!runFacetSearch) {
        if (selectedScope != "Everything") {
            group.linkHeader = false;
            group.showFooter = false;

            var itemsPerPage = pageSize;
            if (group.header == "Images")
                itemsPerPage = imagePageSize;

            buildPagination(group, itemsPerPage);
        }
        else {
            group.linkHeader = true;
            group.showPaging = false;
            if (group.count > groupDisplayLimit)
                group.showFooter = true;
            if (group.currentPageResults.length > groupDisplayLimit)
                group.currentPageResults = group.currentPageResults.slice(0, groupDisplayLimit);
        }

        /*if ((selectedScope == "Everything" || selectedScope == "Posts") && group.header == "Posts") {
            postsReq = true;
            getPostResultsDetails(group, true);
            getPostResultsDetails(group, false);
        }
        CHANGING THIS SO THAT IT DOESN'T RUN ON THE EVERYTHING PAGE, SINCE THIS WILL ALREADY HAVE RUN */
        if (!preloadedPosts && group.header == "Posts") {
            postsReq = true;
            getPostResultsDetails(group, true);
            getPostResultsDetails(group, false);
        }
    }
    preloadedPosts = false;
}

function getPostResultsDetails(group, isCurrentPage) {
    var resultSetToFetch;

    if (!isCurrentPage && group.postsToPrefetch.length > 0) {
        logToConsole("Prefetching Posts for " + group.postsToPrefetch.length + " results.");
        resultSetToFetch = group.postsToPrefetch;
    }
    else {
        logToConsole("Getting details for " + group.currentPageResults.length + " post results.");
        resultSetToFetch = group.currentPageResults;
    }

    if (resultSetToFetch.length > 0) {

        var itemsToFetch = jq18.map(resultSetToFetch, function (n) {
            return { "ItemID": n.ItemID, "ModDate": n.ModDate };
        });

        getStreamItems(group, itemsToFetch, isCurrentPage);
    }
}
function getStreamItems(group, itemIds, forCurrentPage) {
    //logToConsole(JSON.stringify(itemIds));
    var start = Date.now();

    getStreamItemsRequest = jq18.ajax({
        url: "/_layouts/15/NexusAPIProxy/GetStreamItems.ashx",
        type: "POST",
        data: JSON.stringify(itemIds),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    .done(function (data) {

        var timeElapsed = Date.now() - start;
        //logToConsole(data);
        if (forCurrentPage) {
            logToConsole("Get Stream Items request (Current Page) took " + timeElapsed + "ms");
            getStreamItemsSuccess(group, data);
        }
        else
            logToConsole("Get Stream Items request (Prefetch) took " + timeElapsed + "ms");

    })
    .fail(function (jqXHR, textStatus) {
        ajaxRequestFailed("getStreamItemsRequest", textStatus);
    });
}
function getStreamItemsSuccess(group, streamItems) {

    jq18.each(streamItems, function (i, si) {
        transformStreamItem(si);
    });

    if (group.header == "Posts") { // if it's Posts
        group.currentPageResults = streamItems;
        group.ShowSubItem = false;
        postsReq = false;
    }
    else { // or if it's Best Bets

        // Match up stream item details with best bets results
        jq18.each(streamItems, function (i, si) {
            for(var i = 0; i < bestBebestBetsResultGroup.unfilteredBestBets.length; i++) {
                if (bestBetsResultGroup.unfilteredBestBets[i].Identifier == si.ItemID) {
                    bestBetsResultGroup.unfilteredBestBets[i] = si;
                    break;
                }
            }
        });

        bbPostsReq = false;
    }

    if (!spReq && !allReq && !facReq && !postsReq && !bbPostsReq) // && !runFacetSearch) 
        formatAllResults();
}
function transformStreamItem(strItem) {
    strItem.DisplayDate = FormatDateTimeStamp(new Date(strItem.DateStamp));
    strItem.ProfileUrl = urlTemplates.threadUrl + '?ItemID=' + strItem.ItemID;

    var imageID = "00000000-0000-0000-0000-000000000000";
    if (strItem.DisplayEntityImageID)
        imageID = strItem.DisplayEntityImageID;
    strItem.ImageUrl = getDisplayImageUrl(strItem.DisplayEntityType, imageID, strItem.ImageOverrideUrl);

    strItem.DisplayImageCircular = false;
    if (strItem.DisplayEntityType == "Employee")
        strItem.DisplayImageCircular = true;

    strItem.LikeIcon = "Like_Off.png"
    if (strItem.LikeCount) {
        if (strItem.LikeCount > 1)
            strItem.LikeText = strItem.LikeCount + " Likes";
        else
            strItem.LikeText = "1 Like";

        if (strItem.LikesList) {
            jq18.each(strItem.LikesList, function (i, l) {
                if (l.AuthorID == employeeID) {
                    strItem.LikeIcon = "Like_On.png";
                    return false;
                }
            });
        }
    }
    else
        strItem.LikeText = "Like";

    if (strItem.CommentCount) {
        if (strItem.CommentCount > 1)
            strItem.CommentText = strItem.CommentCount + " Comments";
        else
            strItem.CommentText = "1 Comment";
    }
    else
        strItem.CommentText = "Comment";
    
    strItem.Identifier = strItem.ItemID;
    strItem.Scope = "Posts";
    strItem.IsStreamItem = true;
}

function formatAllResults()
{
    jq18("img.loading").addClass("ka_HiddenElement");

    buildScopesPanel();

    hasLeftColumnResult = false;
    var finalHitCount = 0;
    jq18.each(allSearchResults, function (i, group) {
        if (selectedScope == "Everything" || selectedScope == group.header) {

            if (selectedScope == "Everything" && leftColumnResultsOrder.indexOf(group.header) > -1)
                hasLeftColumnResult = true;

            finalHitCount += group.count;
            formatResultGroup(group);
        }

        if (selectedScope == group.header && allFacetGroups.length > 0 && (group.spFacets.length > 0 || group.nexusFacets.length > 0))
            renderFacetsList(group);
    });

    if (bestBetsResultGroup.currentPageBestBets.length > 0) {
        finalHitCount += bestBetsResultGroup.currentPageBestBets.length;
        formatResultGroup(bestBetsResultGroup);
    }

    logQuery(finalHitCount);
    
    // Try to pre-cache images if there are image results and we're not on the image page
    if (selectedScope != "Images")
    {
        var imageGroup = getCurrentGroupFromAllResults("Images");
        if (imageGroup && imageGroup.count > groupDisplayLimit)
        {
            var imageResultsToPrecache = jq18.merge([], imageGroup.nexusResults);
            jq18.merge(imageResultsToPrecache, imageGroup.spResults);

            if (imageResultsToPrecache.length > imagePageSize*2)
                imageResultsToPrecache = imageResultsToPrecache.slice(0, imagePageSize * 2);

            var imagesToPrecache = jq18.map(imageResultsToPrecache, function (n) {
                    if (n.pictureThumbnailUrl) 
                        return n.pictureThumbnailUrl; 
                    else
                        return n.ImageUrl;                   
            });

            preloadImages(imagesToPrecache);
        }
    }
     
}
function formatResultGroup(group) {

    var mustacheTemplateName = "";
    if (group.header == "Best Bet" || group.header == "Best Bets")
        mustacheTemplateName = "BestBets_Results.htm";
    else
        mustacheTemplateName = group.header.replace(' ', '_') + '_Results.htm';
    var groupDiv = "";
       
    if (resultTemplates[mustacheTemplateName]) {
        groupDiv = jq18(Mustache.render(resultTemplates[mustacheTemplateName], group));
        placeResults(group.header, groupDiv);
    }
    else {
        jq18.get('/_Layouts/15/KA Search/mustache/' + mustacheTemplateName + '?r=' + Date.now(), function (template) {
            resultTemplates[mustacheTemplateName] = template;//cache it for future searches
            groupDiv = jq18(Mustache.render(template, group));
            placeResults(group.header, groupDiv);
        });
    }
}
function placeResults(groupName, divGroup)
{
    if (selectedScope != "Everything") {
        if (groupName == "Best Bet" || groupName == "Best Bets")
            divGroup.prependTo("#ka_SearchResultsLeftColumn");
        else
            jq18("#ka_SearchResultsLeftColumn").append(divGroup);        
    }
    else {
        if (groupName == "Best Bet" || groupName == "Best Bets")
            if (hasLeftColumnResult)
                divGroup.prependTo("#ka_SearchResultsLeftColumn");
            else
                divGroup.prependTo("#ka_SearchResultsRightColumn");
        else {

            var resultOrderArray = leftColumnResultsOrder;
            if (rightColumnResultsOrder.indexOf(groupName) > -1)
                resultOrderArray = rightColumnResultsOrder;

            var myTypePredecessor = getResultTypePredecessor(groupName, resultOrderArray);
            if (myTypePredecessor.length == 0) {
                if (resultOrderArray == rightColumnResultsOrder) {

                    if (jq18("#ka_SearchResultsRightColumn > #ka_SearchResultGroup_BestBets").length > 0)
                        divGroup.insertAfter("#ka_SearchResultGroup_BestBets");
                    else
                        divGroup.prependTo("#ka_SearchResultsRightColumn");
                }
                else {
                    if (jq18("#ka_SearchResultsLeftColumn > #ka_SearchResultGroup_BestBets").length > 0)
                        divGroup.insertAfter("#ka_SearchResultGroup_BestBets");
                    else
                        divGroup.prependTo("#ka_SearchResultsLeftColumn");
                }
            }
            else
                divGroup.insertAfter(myTypePredecessor);
        }
    }

    if (selectedScope == "Everything" || selectedScope == "Images")
        linkifyMedia('#ka_SearchResultGroup_Images > .ka_SearchResultItem img');
    if (selectedScope == "Everything" || selectedScope == "Videos") {
        linkifyMedia('#ka_SearchResultGroup_Videos .ka_SearchResultItemImage > a[itemid]'); //only show modal for vids attached to a stream item
        linkifyMedia('#ka_SearchResultGroup_Videos .ka_SearchResultItemDetails > a[itemid]');
    }

    if (groupName == "Images")
        addClickLoggingToGroup('Image', '#ka_SearchResultGroup_Images > .ka_SearchResultItem img');
    else
        addClickLoggingToGroup('Link', '#ka_SearchResultGroup_' + groupName.replace(' ', '_') + ' > .ka_SearchResultItem a');
}
function getResultTypePredecessor(type, resultOrderArray) {
    var myTypeIndex = resultOrderArray.indexOf(type);
    if (myTypeIndex == 0) return [];
    for (var i = myTypeIndex - 1; i >= 0; i--) {
        var predecessor = jq18('#ka_SearchResultGroup_' + resultOrderArray[i].replace(' ', '_'));
        if (predecessor.length > 0) return predecessor;
    }
    return [];
}

function getDisplayImageUrl(imageType, imageID, overrideUrl) {
    if (overrideUrl)
        return overrideUrl;
    else if (imageType && imageID && imageID != "00000000-0000-0000-0000-000000000000") 
        return urlTemplates.imageProxyUrl + '?id=' + imageID + '&size=50w50h_fxd';
    else
        return urlTemplates.placeholderUrl + '?id=' + (imageType || 'Employee') + '&size=50w50h_fxd';
}
function getDisplayEntityUrl(entityType, entityID)
{
    switch (entityType) {
        case "Employee":
            return urlTemplates.employeeProfileUrl + '?Employee=' + entityID;
            break;
        case "Project":
            return urlTemplates.projectProfileUrl + '?Project=' + entityID;
            break;
        case "Contact":
            return urlTemplates.contactProfileUrl + '?Contact=' + entityID;
            break;
        case "Company":
            return urlTemplates.employeeProfileUrl + '?Company=' + entityID;
            break;
        case "Opportunity":
            return urlTemplates.opportunityProfileUrl + '?Opportunity=' + entityID;
            break;
    }
}


// FACETED SEARCH STUFF BELOW
var postsFacets = ["My Activity", "Posted", "Author", "Community", "Topic"];
var imagesFacets = ["Source", "Size", "Uploaded"];
var documentsFacets = ["Document Type", "Uploaded", "Community"];
var wikisFacets = ["Last Modified", "Community"];
var projectsFacets = ["Client Name", "Status", "Project Type"];
var opportunitesFacets = ["Client Name", "Stage", "Opportunity Type"];
var contactsFacets = ["Company", "Title", "City"];
var eventsFacets = ["Time Frame", "Community"];
var staticFacetOrder = ["All", "Intranet", "DAM", "Past 7 Days", "Past 30 Days", "Past 12 Months", "Over 12 Months", "Small", "Medium", "Large", "Wrote", "Commented", "Liked"]

function facet(facetID, facetName, facetValue, spRefinementValue, matchedResultsCount, category) {
    this.facetID = facetID;
    this.facetName = facetName;
    this.facetValue = facetValue;
    this.spRefinementValue = spRefinementValue
    this.matchedResultsCount = matchedResultsCount;
    if (matchedResultsCount > 100) this.matchedResultsDisplay = "100+"; else this.matchedResultsDisplay = matchedResultsCount;
    if (spRefinementValue) this.urlHash = setURLHash(query, selectedScope, category.replace(' ', '_') + '_eq_' + spRefinementValue, selectedSuggestion); else this.urlHash = setURLHash(query, selectedScope, category.replace(' ', '_') + '_eq_' + facetID, selectedSuggestion);
}
function facetsGroup(facetCategory, facets) {
    this.categoryID = facetCategory.replace(' ', '_');
    this.facetCategory = facetCategory;
    this.unlimitedFacets = facets;

    if (facets.length > facetMoreLimit)
        facets = facets.slice(0, facetMoreLimit);

    if (facets.length > facetLimit) {
        this.facets = facets.slice(0, facetLimit);
        this.moreFacets = facets.slice(facetLimit, facets.length);
    }
    else {
        this.facets = facets;        
    }
    if (facets.length > facetLimit) this.showMoreFacets = true; else showMoreFacets = false;
}
function selectedFacet(facetID, facetName, facetValue, spRefinementValue)
{
    this.facetID = facetID;
    this.facetName = facetName;
    this.facetValue = facetValue;
    this.spRefinementValue = spRefinementValue;
}
function getNexusFacetsData(group)
{
    var resultIDs = jq18.map(group.nexusResults, function(n) {
        return n.Identifier;
    });

    var searchResultIDs = "'" + resultIDs.join("','") + "'"
    if (selectedScope == "Posts" || selectedScope == "Communities") 
        searchResultIDs = resultIDs.join()

    var getFacetsRequestData = {
        "SearchScope": selectedScope,
        "SearchResultIDs": searchResultIDs
    };

    //logToConsole(JSON.stringify(getFacetsRequestData));
    var start = Date.now();

    var url = "/_layouts/15/NexusAPIProxy/GetFacets.ashx";
    getFacetsRequest = jq18.ajax({
            url:url,
            type:"POST",
            data: JSON.stringify(getFacetsRequestData),
            contentType:"application/json; charset=utf-8",
            dataType:"json"          
        })
        .done(function (data) {
            //logToConsole(data);
            var timeElapsed = Date.now() - start;
            logToConsole("Get Facets request took " + timeElapsed + "ms");
            buildFacetsList(data, group, "nexus");
        })
        .fail(function (jqXHR, textStatus) {
            ajaxRequestFailed("getFacetsRequest", textStatus);
        });
}
function buildFacetsList(json, group, source)
{
    allFacetGroups = [];

    if (source.toLowerCase() == "sharepoint")
        group.spFacets = [];
    else
        group.nexusFacets = [];

    if (json.length > 0) {
        jq18.each(json, function (i, facetCat) {

            if (facetCat.facetGroupValues.length > 0) {
                var facList = [];

                facList.push(new facet("ClearFacets", "All", "All", null, null, facetCat.facetGroupName));

                jq18.each(facetCat.facetGroupValues, function (i, fac) {
                    var spRefValue = null;
                    if (fac.spRefinementValue)
                        spRefValue = fac.spRefinementValue;

                    var f = new facet(fac.facetID, fac.facetName, fac.facetValue, spRefValue, fac.matchedResultsCount, facetCat.facetGroupName);
                    facList.push(f);
                });

                // Sort facets by MatchedResultsCount Descending, then by FacetName Alpha Ascending
                facList.sort(sortFacets);

                var fg = new facetsGroup(facetCat.facetGroupName, facList);

                if (source.toLowerCase() == "sharepoint")
                    group.spFacets.push(fg);
                else
                    group.nexusFacets.push(fg);
            }
        });       
    }

    if (source.toLowerCase() == "sharepoint")
        spFacetsReq = false;
    else
        nexusFacetsReq = false;

    if (!nexusFacetsReq && !spFacetsReq) {

        // Now combine any facets that need combining and cut off each category based on the facet limit we've set
        if (selectedScope == "Images" || selectedScope == "Videos")
            mixAndMatchFacets(group);
        else if (sharepointScopes.indexOf(selectedScope) > -1) 
            allFacetGroups = group.spFacets.slice();
        else 
            allFacetGroups = group.nexusFacets.slice();            

        // OK, JUST IN CASE YOU'VE BOOKMARKED A URL AND WE NO LONGER HAVE THE FACET ID OR VALUE, ITERATE THROUGH THE REFINEMENTS LIST AND UPDATE ANY REFINEMENTS MISSING VALUES
        if (allFacetGroups.length > 0 && selectedFacets.length > 0) {
            //logToConsole("ALL FACET GROUPS: " + JSON.stringify(allFacetGroups));
            //logToConsole("SELECTED FACETS: " + JSON.stringify(selectedFacets));
            jq18.each(selectedFacets, function (i, sf) {
                if (!sf.facetID || !sf.facetValue)
                    findSelectedFacet(sf);
            });
        }

        // Limit the number of facets to display in each group
        jq18.each(allFacetGroups, function (i, fg) {
            if (fg.facets.length > facetLimit)
                fg.facets = fg.facets.slice(0, facetLimit);
        });

        // Order the facet groups using the facet arrays (or by default alphabetically)
        allFacetGroups.sort(sortFacetGroups);
        //logToConsole(JSON.stringify(allFacetGroups));

        group.currentFacets = allFacetGroups.slice();
        if (group.allFacets.length == 0)
            group.allFacets = allFacetGroups.slice();

        if (runFacetSearch) {
            runFacetSearch = false;
            group.count = 0;
            group.currentFacets = [];
           
            if (sharepointScopes.indexOf(selectedScope) > -1) {
                spFacetSearch = true;
                spPageSearch = false;
                group.spResults = [];
                group.spFacets = [];
                group.spFacetsUnrefined = [];
                spSearchViaProxy(query);
            }

            if (nexusScopes.indexOf(selectedScope) > -1) 
                initFacetSearch(group);
        }
        else {
            facReq = false;

            if (!allReq && !postsReq && !bbPostsReq) 
                formatAllResults();
        }
    }
}
function renderFacetsList(group)
{
    jq18("#ka_SearchResultsRightColumn").empty();
    //logToConsole("ALL FACET GROUPS IN RENDER FACETS LIST: " + JSON.stringify(allFacetGroups));
    //logToConsole("SELECTED FACETS: " + JSON.stringify(selectedFacets));
        
        // RENDER FACETS LIST, IDENTIFYING THOSE THAT HAVE BEEN SLEECTED
        var mustacheTemplateName = 'FacetsList.htm';
        var facetsDiv = "";

        if (resultTemplates[mustacheTemplateName]) {
            facetsDiv = jq18(Mustache.render(resultTemplates[mustacheTemplateName], { allFacetGroups: allFacetGroups }));
            jq18("#ka_SearchResultsRightColumn").append(facetsDiv);

            jq18.each(allFacetGroups, function (i, val) {
                jq18("#ka_SearchFacet_" + val.facetCategory.replace(' ', '_') + "_eq_ClearFacets").addClass("ka_SelectedFacet");                
            });
            jq18.each(selectedFacets, function (i, val) {
                jq18("#ka_SearchFacet_" + val.facetName.replace(' ', '_') + "_eq_" + val.facetID).addClass("ka_SelectedFacet").parent().siblings().children().removeClass("ka_SelectedFacet");
                jq18("#ka_SearchFacet_" + val.facetName.replace(' ', '_') + "_eq_" + val.facetID).parent().siblings().children().not('[id$=ClearFacets]').parent().remove();
            });
        }
        else {
            jq18.get('/_Layouts/15/KA Search/mustache/' + mustacheTemplateName + '?r=' + Date.now(), function (template) {
                resultTemplates[mustacheTemplateName] = template;//cache it for future searches
                facetsDiv = jq18(Mustache.render(template, { allFacetGroups: allFacetGroups }));
                jq18("#ka_SearchResultsRightColumn").append(facetsDiv);

                jq18.each(allFacetGroups, function (i, val) {
                    jq18("#ka_SearchFacet_" + val.facetCategory.replace(' ', '_') + "_eq_ClearFacets").addClass("ka_SelectedFacet");                       
                });
                jq18.each(selectedFacets, function (i, val) {
                    jq18("#ka_SearchFacet_" + val.facetName.replace(' ', '_') + "_eq_" + val.facetID).addClass("ka_SelectedFacet").parent().siblings().children().removeClass("ka_SelectedFacet");
                    jq18("#ka_SearchFacet_" + val.facetName.replace(' ', '_') + "_eq_" + val.facetID).parent().siblings().children().not('[id$=ClearFacets]').parent().remove();
                });
            });
        }
            
}
function selectFacet(facetID)
{
    searchLogTimerStart = Date.now();

    var group = getCurrentGroupFromAllResults(selectedScope);
    group.currentFacets = [];
    var selectedFacetString = facetID.substring(15);
    var selectedCategory = selectedFacetString.split('_eq_')[0].replace('_',' ');

    if (selectedFacets.length > 0) {
        selectedFacets = jq18.grep(selectedFacets, function (a) {
            return a.facetName.indexOf(selectedCategory) < 0;
        });
    }

    if (selectedFacetString.indexOf("ClearFacets") < 0) {
        var facet = convertFacetIDToSelectedFacet(facetID);               
        selectedFacets.push(facet);
    }
    
    resetPagingToDefaults();
    group.count = 0;

    if (sharepointScopes.indexOf(selectedScope) > -1) {
        spFacetSearch = true;
        spPageSearch = false;
        group.spResults = [];
        group.spFacets = [];
        group.spFacetsUnrefined = [];
        spSearchViaProxy(query);
        
    }

    if (nexusScopes.indexOf(selectedScope) > -1)
        initFacetSearch(group);

    jq18("img.loading").removeClass("ka_HiddenElement");
    jq18("#ka_SearchResultsLeftColumn").empty();
    jq18("#ka_SearchScopesPanel").scrollTop();

}
function initFacetSearch(group)
{
    var resultIDs = jq18.map(group.unfilteredNexusResults, function (n) {
        return n.Identifier;
    });

    if (resultIDs && resultIDs.length > 0) {

        nexusReq = true;

        var getFacetedSearchData = {
            "SearchScope": selectedScope,
            "SearchResultIDs": "'" + resultIDs.join("','") + "'",
            "SelectedFacets": selectedFacets
        };

        //logToConsole("FACETED SEARCH DATA: " + JSON.stringify(getFacetedSearchData));

        var url = "/_layouts/15/NexusAPIProxy/SearchFacets.ashx";
        searchFacetsRequest = jq18.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(getFacetedSearchData),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function (data) {
                //logToConsole("FACET SEARCH RESPONSE: " + JSON.stringify(data));
                filterResultsFromFacetedSearch(data, group);
            })
            .fail(function (jqXHR, textStatus) {
                ajaxRequestFailed("searchFacetsRequest", textStatus);
            });
    }
    
}
function filterResultsFromFacetedSearch(json, group)
{
    if (json.length > 0) {
        var returnedIDs = jq18.map(json, function (j) {
            return j.ResultingID;
        });
        var filteredResults = jq18.grep(group.unfilteredNexusResults, function (asr) {
            return returnedIDs.indexOf(asr.Identifier.toString()) > -1;
        });
        group.nexusResults = filteredResults;
    }
    else {
        group.nexusResults = [];
    }

    group.count += group.nexusResults.length;

    nexusReq = false;

    if (!spReq) 
        transformAllResultGroups();   
}
function convertFacetIDToSelectedFacet(facetID)
{
    var refinement = facetID.substring(15);
    var categoryID = refinement.split('_eq_')[0];
    var fID = refinement.split('_eq_')[1];

    var selFacet = new selectedFacet(fID, categoryID.replace('_', ' '), null, null);;
    findSelectedFacet(selFacet);
    return selFacet;
}
function convertURLRefinementToSelectedFacet(refinement) {
    refinement = decodeURIComponent(refinement);
    var categoryID = refinement.split('_eq_')[0];
    var fID = refinement.split('_eq_')[1];

    var facet;
    if (sharepointScopes.indexOf(selectedScope) > -1 && categoryID.toLowerCase() != "source") {
        //facet = new selectedFacet(null, categoryID.replace('_', ' '), null, fID);

        if ((selectedScope == "Images" || selectedScope == "Videos") && fID.indexOf("0x") == 0) 
            facet = new selectedFacet(fID, categoryID.replace('_', ' '), null, null);
        else
            facet = new selectedFacet(null, categoryID.replace('_', ' '), null, fID);
    }
    else
        facet = new selectedFacet(fID, categoryID.replace('_', ' '), null, null);

    return facet;
}
function findSelectedFacet(selFacet)
{
    var matchingCat;
    if (allFacetGroups && allFacetGroups.length > 0) {
        jq18.each(allFacetGroups, function (i, c) {
            if (c.categoryID == selFacet.facetName.replace(' ', '_')) {
                matchingCat = c;
                return false;
            }                
        });        
    }

    var foundFacet;
    if (matchingCat) {

        jq18.each(matchingCat.unlimitedFacets, function (i, f) {
            if (selFacet.facetID) {
                if (f.facetID == selFacet.facetID) {
                    foundFacet = f;
                    return false;
                }
            }
            else if (selFacet.spRefinementValue) {
                if (f.spRefinementValue == selFacet.spRefinementValue) {
                    foundFacet = f;
                    return false;
                }
            }
            else
                return false;
        });       
    }
    if (foundFacet) {
        if (!selFacet.facetID)
            selFacet.facetID = foundFacet.facetID;
        if (!selFacet.facetValue)
            selFacet.facetValue = foundFacet.facetValue;
        if (!selFacet.spRefinementValue)
            selFacet.spRefinementValue = foundFacet.spRefinementValue;
    }
}
function expandFacets(categoryId)
{
    jq18(".ka_MoreFacet_" + categoryId).slideDown(400, function () {
        jq18(".ka_MoreFacets_" + categoryId).html('<a onmouseover="collapseFacets(\'' + categoryId + '\')" >Less <img src="/_layouts/15/images/KAWebParts/Less_cyan.png"></a>');
    });
}
function collapseFacets(categoryId) {
    jq18(".ka_MoreFacet_" + categoryId).slideUp(400, function () {
        jq18(".ka_MoreFacets_" + categoryId).html('<a onmouseover="expandFacets(\'' + categoryId + '\')" >More <img src="/_layouts/15/images/KAWebParts/More_cyan.png"></a>');
    });   
}

// PAGINATION
function buildPagination(group, itemsPerPage)
{    
    
    if (group.count > itemsPerPage)
        group.showPaging = true;
    else
        group.showPaging = false;


    if (group.showPaging) {
        currentStartIndex = currentPageIndex * itemsPerPage;
        nextStartIndex = (currentPageIndex + 1) * itemsPerPage;
        group.currentPageResults = group.currentPageResults.slice(0, itemsPerPage);

        var nexusResultsOnPage = 0;
        var spResultsOnPage = 0;
        var navResultsOnPage = 0;
        var allResultsOnPage = group.currentPageResults.length;

        if (sharepointScopes.indexOf(selectedScope) > -1 && selectedScope != "Links" && selectedScope != "Images" && selectedScope != "Videos")
            spResultsOnPage = allResultsOnPage;
        else if (selectedScope == "Links") {
            var navResults = jq18.grep(group.currentPageResults, function (r) {
                return r.resultType == "NavLink";
            });

            if (navResults)
                navResultsOnPage = navResults.length;

            spResultsOnPage = allResultsOnPage - navResultsOnPage;
        }
        else if (selectedScope == "Images" || selectedScope == "Videos") {
            var spResults = jq18.grep(group.currentPageResults, function (r) {
                return r.source == "SharePoint";
            });

            if (spResults)
                spResultsOnPage = spResults.length;

            nexusResultsOnPage = allResultsOnPage - spResultsOnPage;
        }
        else
            nexusResultsOnPage = allResultsOnPage;

        var currentPage = jq18.grep(pagingArray, function (i, p) { return p.pageIndex = currentPageIndex });
        if (!currentPage)
            currentPage = { pageIndex: currentPageIndex, nexusResultIndex: currentNexusResultIndex, spResultIndex: currentSPResultIndex, navResultIndex: currentNavResultIndex };
        pagingArray.push(currentPage);

        nextNexusResultIndex = currentNexusResultIndex + nexusResultsOnPage;
        nextSPResultIndex = currentSPResultIndex + spResultsOnPage + group.spRemovedResultsCount;
        nextNavResultIndex = currentNavResultIndex + navResultsOnPage;

        if (currentPageIndex > 0) {
            var prevPage = jq18.grep(pagingArray, function (i, p) { return p.pageIndex = currentPageIndex - 1 });
            if (!prevPage) {
                prevNexusResultIndex = prevPage.nexusResultIndex;
                prevSPResultIndex = prevPage.spResultIndex;
                prevNavResultIndex = prevPage.navResultIndex;
            }

        }



        if (selectedScope == "Posts") {
            var nextPageResults = [];
            if (nextNexusResultIndex + itemsPerPage > group.nexusResults.length)
                nextPageResults = group.nexusResults.slice(nextNexusResultIndex, group.nexusResults.length);
            else
                nextPageResults = group.nexusResults.slice(nextNexusResultIndex, nextNexusResultIndex + itemsPerPage);

            group.postsToPrefetch = nextPageResults;
        }

        if (group.currentPageResults.length >= itemsPerPage)
            group.pagingLabel = " " + (currentStartIndex + 1) + " - " + nextStartIndex + " ";
        else
            group.pagingLabel = " " + (currentStartIndex + 1) + " - " + (currentStartIndex + group.currentPageResults.length)  + " ";

        if (currentPageIndex > 1)
            group.showStart = true;
        else
            group.showStart = false;

        if (currentPageIndex > 0)
            group.showPrev = true;
        else
            group.showPrev = false;

        if (group.count > nextStartIndex)
            group.showNext = true;
        else
            group.showNext = false;
    }   
}
function goNextPage()
{
    searchLogTimerStart = Date.now();

    currentPageIndex++;
    currentNexusResultIndex = nextNexusResultIndex;
    currentSPResultIndex = nextSPResultIndex;
    currentNavResultIndex = nextNavResultIndex;
    jq18("img.loading").removeClass("ka_HiddenElement");
    jq18("#ka_SearchResultsLeftColumn").empty();
    jq18("#ka_SearchScopesPanel").scrollTop();

    if (sharepointScopes.indexOf(selectedScope) > -1) {
        //spFacetSearch = false;
        spPageSearch = true;
        var currentGroup = getCurrentGroupFromAllResults(selectedScope);
        currentGroup.spResults = [];
        spSearchViaProxy(query);
    }
    else
        transformAllResultGroups();
}
function goPrevPage()
{
    searchLogTimerStart = Date.now();

    currentPageIndex--;
    currentNexusResultIndex = prevNexusResultIndex;
    currentSPResultIndex = prevSPResultIndex;
    currentNavResultIndex = prevNavResultIndex;
    jq18("img.loading").removeClass("ka_HiddenElement");
    jq18("#ka_SearchResultsLeftColumn").empty();
    jq18("#ka_SearchScopesPanel").scrollTop();

    if (sharepointScopes.indexOf(selectedScope) > -1) {
        //spFacetSearch = false;
        spPageSearch = true;
        var currentGroup = getCurrentGroupFromAllResults(selectedScope);
        currentGroup.spResults = [];
        spSearchViaProxy(query);
    }
    else
        transformAllResultGroups();
}
function goStartPage()
{
    searchLogTimerStart = Date.now();

    currentPageIndex = 0;
    currentNexusResultIndex = 0;
    currentSPResultIndex = 0;
    currentNavResultIndex = 0;
    jq18("img.loading").removeClass("ka_HiddenElement");
    jq18("#ka_SearchResultsLeftColumn").empty();
    jq18("#ka_SearchScopesPanel").scrollTop();

    if (sharepointScopes.indexOf(selectedScope) > -1) {
        //spFacetSearch = false;
        spPageSearch = true;
        var currentGroup = getCurrentGroupFromAllResults(selectedScope);
        currentGroup.spResults = [];
        spSearchViaProxy(query);
    }
    else
        transformAllResultGroups();
}
function resetPagingToDefaults() {
    currentPageIndex = 0;
    currentNexusResultIndex = 0;
    currentSPResultIndex = 0;
    currentNavResultIndex = 0;
    nextNexusResultIndex = 0;
    nextSPResultIndex = 0;
    nextNavResultIndex = 0;
    prevNexusResultIndex = 0;
    prevSPResultIndex = 0;
    prevNavResultIndex = 0;
    pagingArray = [];

}

function getCurrentGroupFromAllResults(scope)
{
    var matchedGroup;
    jq18.each(allSearchResults, function (index, group) {
        if (group.header == scope) {
            matchedGroup = group;
            return false;
        }
    });
    return matchedGroup;
}

function mixAndMatchResults(group) {

    //logToConsole("NEXUS RESULTS IN GROUP: " + JSON.stringify(group.nexusResults));
    //logToConsole("SP RESULTS IN GROUP: " + JSON.stringify(group.spResults));
    
    var maxNexusScore;
    var maxSPScore;
    var normFactor = 1;
    var importanceFactor = 0.75;

    if (group.nexusResults.length > currentNexusResultIndex) {
        group.currentPageResults = group.nexusResults.slice(currentNexusResultIndex);
        
        if (group.spResults.length > 0) {
            maxNexusScore = group.currentPageResults[0].score; // 0.07265477
            maxSPScore = group.spResults[0].score; // 11.031831741333008
            if (maxNexusScore > 0) normFactor = maxSPScore / maxNexusScore;  // 151.837

            jq18.each(group.spResults, function (i, origImg) {
                var img = jq18.extend(true, {}, origImg);
                img.score = img.score / normFactor * importanceFactor; // 11.03 / 151.837 * 0.75
                var insertAtIndex = 0;
                while (group.currentPageResults[insertAtIndex] != null && group.currentPageResults[insertAtIndex].score > img.score) insertAtIndex++;
                group.currentPageResults.splice(insertAtIndex, 0, img);
            });
        }
    }
    else
        group.currentPageResults = group.spResults.slice();

    //logToConsole("POSTMIX GROUP: " + JSON.stringify(group));
}
function mixAndMatchFacets(group) {

    //logToConsole("NEXUS FACETS GROUP: " + JSON.stringify(group.nexusFacets));
    //logToConsole("SP FACETS GROUP: " + JSON.stringify(group.spFacets));

    if (group.nexusFacets.length > 0) {
        allFacetGroups = group.nexusFacets.slice();

        if (group.spFacets.length > 0) {
            jq18.each(group.spFacets, function (i, fg) {
                //var facGroup = jq18.extend(true, {}, fg);

                // If there is already a facet group with this CategoryID, find it
                var matchingCats = jq18.grep(allFacetGroups, function (c) { return c.categoryID.toLowerCase() == fg.categoryID.toLowerCase(); });

                if (matchingCats && matchingCats.length > 0) {
                    //logToConsole("Found CategoryID: " + matchingCats[0].categoryID);
                    var facCategory = matchingCats[0].facetCategory;
                    var facList = [];
                    jq18.each(fg.facets, function (i, f) {

                        if (f.facetID != "ClearFacets") {
                            var matchingFacets = jq18.grep(matchingCats[0].facets, function (c) { return c.facetID.toLowerCase() == f.facetID.toLowerCase(); });

                            if (matchingFacets && matchingFacets.length > 0) {
                                matchingFacets[0].matchedResultsCount = matchingFacets[0].matchedResultsCount + f.matchedResultsCount;
                                if (matchingFacets[0].matchedResultsCount > 100) matchingFacets[0].matchedResultsDisplay = "100+"; else matchingFacets[0].matchedResultsDisplay = matchingFacets[0].matchedResultsCount;
                                matchingFacets[0].spRefinementValue = f.spRefinementValue;
                                matchingFacets[0].urlHash = f.urlHash;

                                //facList.push(matchingFacets[0]);
                            }
                            else {
                                matchingCats[0].facets.push(f);
                                //facList.push(f);
                            }
                        }
                    });
                    facList = matchingCats[0].facets;
                    //logToConsole("facList: " + JSON.stringify(facList));
                    // Resort the list and create a new facet group for the matched category
                    facList.sort(sortFacets);
                    matchingCats[0] = new facetsGroup(facCategory, facList);                   
                }
                else {
                    // Since this facet group didn't exist in the Nexus Facets, add it in
                    allFacetGroups.push(fg);
                }
            });            
        }
    }
    else
        allFacetGroups = group.spFacets.slice();

    //logToConsole("POSTMIX FACETS GROUP: " + JSON.stringify(allFacetGroups));

}
function sortFacets(a,b)
{
    if (a.facetID == "ClearFacets")
        return -1;
    else if (b.facetID == "ClearFacets")
        return 1;
    else if (staticFacetOrder.indexOf(a.facetValue) > -1 && staticFacetOrder.indexOf(b.facetValue) > -1) {
        if (staticFacetOrder.indexOf(a.facetValue) < staticFacetOrder.indexOf(b.facetValue))
            return -1;
        else if (staticFacetOrder.indexOf(a.facetValue) > staticFacetOrder.indexOf(b.facetValue))
            return 1;
        else
            return 0;
    }
    else {
        if (a.matchedResultsCount > b.matchedResultsCount)
            return -1;
        else if (a.matchedResultsCount < b.matchedResultsCount)
            return 1;
        else {
            if (a.facetName < b.facetName)
                return -1;
            else if (a.facetname > b.facetName)
                return 1;
            else
                return 0;
        }
    }
}
function sortFacetGroups(a,b)
{
    var facetsForScope = [];
    if (selectedScope == "Posts")
        facetsForScope = postsFacets.slice();
    else if (selectedScope == "Images")
        facetsForScope = imagesFacets.slice();
    else if (selectedScope == "Documents")
        facetsForScope = documentsFacets.slice();
    else if (selectedScope == "Wiki Pages")
        facetsForScope = wikisFacets.slice();
    else if (selectedScope == "Projects")
        facetsForScope = projectsFacets.slice();
    else if (selectedScope == "Opportunities")
        facetsForScope = opportunitesFacets.slice();
    else if (selectedScope == "Contacts")
        facetsForScope = contactsFacets.slice();
    else if (selectedScope == "Events")
        facetsForScope = eventsFacets.slice();
            
    if (facetsForScope.length > 0) {
        if (facetsForScope.indexOf(a.facetCategory) < facetsForScope.indexOf(b.facetCategory))
            return -1;
        else if (facetsForScope.indexOf(a.facetCategory) > facetsForScope.indexOf(b.facetCategory))
            return 1;
        else
            return 0;
    }
    else {
        if (a.facetCategory < b.facetCategory)
            return -1;
        else if (a.facetCategory > b.facetCategory)
            return 1;
        else
            return 0
    }
}

function displayNoResults()
{
    logQuery(0);
    selectedScope = "Everything";
    selectedFacets = [];
    window.location.hash = setURLHash(query, "Everything", "", selectedSuggestion);
    jq18(".ka_NoResults").html("<h2>No results found for <b>&ldquo;" + query + "&rdquo;</b></h2>");
    jq18(".ka_NoResults").removeClass("ka_HiddenElement");
}
function displayErrorMsg() {
    selectedScope = "Everything";
    selectedFacets = [];
    window.location.hash = setURLHash(query, "Everything", "", selectedSuggestion);
    jq18(".ka_NoResults").html("<h2>Search Results did not load successfully. Please try again.</h2>");
    jq18(".ka_NoResults").removeClass("ka_HiddenElement");
}

// LOGGING
function logQuery(hitCount) {

    if (isAdminPage)
        return false;
    
    var searchLogDuration = 0;
    if (searchLogTimerStart)
        searchLogDuration = Date.now() - searchLogTimerStart;
    
    var lqData = {
        "Query": query,
        "Scope": selectedScope,
        "Refinements": selectedFacets,
        "CurrentPageIndex": currentPageIndex,
        "ResultCount": hitCount,
        "BrowserBack": isBrowserBack,
        "SearchDuration": searchLogDuration,
        "ReferringUrl": referringUrl,
        "IsSuggestion": selectedSuggestion
    };

    logToConsole(JSON.stringify(lqData));

    var url = "/_layouts/15/NexusAPIProxy/LogQuery.ashx";
    var logQueryRequest = jq18.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(lqData),
        contentType: "application/json; charset=utf-8"
        //dataType: "json"
    })
        .done(function (data) {
            logToConsole(data);
        })
        .fail(function (jqXHR, textStatus) {
            if (textStatus != 'abort') {
                logToConsole("logQuery Error: " + textStatus);
            }
        })
        .always(function () {
            isBrowserBack = false;
            searchLogTimerStart = null;
            searchLogDuration = 0;

            // re-set referringUrl once logged
            referringUrl = window.location.href;
        });

    delete lqData.SearchDuration;
    appInsights.trackEvent("SearchQuery", lqData, { "SearchDuration": searchLogDuration });

    
}
function logClick(clickType, resultUrl, resultId) {

    if (isAdminPage)
        return false;

    var lcData = {
        "Query": query,
        "Scope": selectedScope,
        "Refinements": selectedFacets,
        "CurrentPageIndex": currentPageIndex,
        "ResultUrl": resultUrl,
        "ResultDetails": resultId,
        "IsBestBet": false
    };
    logToConsole(JSON.stringify(lcData));

    var url = "/_layouts/15/NexusAPIProxy/LogClick.ashx";
    var logClickRequest = jq18.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(lcData),
        contentType: "application/json; charset=utf-8",
        async: false // needed for Safari and Firefox
        //dataType: "json"
    })
      .fail(function (jqXHR, textStatus) {
            if (textStatus != 'abort') {
                logToConsole("logClick Error: " + textStatus);
            }
      })
      /*.always(function () {
          if (clickType == "Link")
              window.location = resultUrl;
      })*/
    ;
    //appInsights.trackEvent("SearchClick", lcData, null);
}
function addClickLoggingToGroup(clickType, selector)
{
    jq18(selector).click(function (event) {

        var resultIdAttr = jq18(this).closest("div[class='ka_SearchResultItem']").attr('resultid');

        if (clickType == "Image")
            logClick(clickType, jq18(this).attr('src'), resultIdAttr);
        else {
            //event.preventDefault();
            logClick(clickType, jq18(this).attr('href'), resultIdAttr);
        }

    });
}
function ajaxRequestFailed(request, textStatus)
{
    stopAllSearches();
    if (textStatus != 'abort') {
        logToConsole(request + " Error: " + textStatus);
    }
    allSearchResults = [];
    allFacetGroups = [];
    jq18("img.loading").addClass("ka_HiddenElement");
    isBrowserBack = false;
    displayErrorMsg();
    jq18(".ka_SearchResults").empty();
    jq18("#ka_SearchScopesPanel").empty();
}
function logToConsole() {
    if (debugMode && isAdminPage && window.console) { if (Function.prototype.bind) log = Function.prototype.bind.call(console.log, console); else log = function () { Function.prototype.apply.call(console.log, console, arguments); }; log.apply(this, arguments); }
}

// PRECACHE NAV LINKS
function cacheNavLinks() {
    var url = "/_layouts/15/NexusAPIProxy/SPNavSearch.ashx?cacheNodes=true";
    var cacheNavLinksRequest = jq18.ajax({
        url: url       
    })
        .done(function (data) {
            logToConsole(data);
        })
        .fail(function (jqXHR, textStatus) {
            if (textStatus != 'abort') {
                logToConsole("cacheNavLinks Error: " + textStatus);
            }
        });
}

// PRECACHE IMAGES
function preloadImages(array) {
    logToConsole("About to pre-load " + array.length + " images.");
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i];
    }
}


// BACK/FORWARD BROWSER BUTTON AND KEYPRESS HANDLING
if (window.location.href.toLowerCase().indexOf("/_layouts/15/search/results.aspx") > -1 || window.location.href.toLowerCase().indexOf("/_layouts/15/search/searchoptimization.aspx") > -1) {
    jq18(document)
        .keydown(function (e) {
            if ((e.which == 8 || (e.which == 37 && e.altKey) || (e.which == 39 && e.altKey)) && !window.inSearchBox) {
                window.browserNavKeyPress = true;
                //logToConsole("Browser Nav key pressed.");
            }
            else
                window.browserNavKeyPress = false;
        });
    jq18('body')
        .mouseover(function () {
            window.innerDocClick = true;
            //logToConsole("User's mouse is inside the page.");
        })
       .mouseleave(function () {
           window.innerDocClick = false;
           window.browserNavKeyPress = false;
           //logToConsole("User's mouse has left the page.");
       });
    window.onhashchange = function () {
        logToConsole("Now in window.onhashchange");
        logToConsole("window.innerDocClick = " + window.innerDocClick);
        if (!window.innerDocClick || window.browserNavKeyPress) {
            // If the url hash has changed and it's not due to an action within the page, then it's most likely the back/forward browser buttons or someone manually editing the hash, so re-do the search
            logToConsole("window.location.hash is " + window.location.hash);

            getURLParameters(true);

            if (selectedFacets.length > 0)
                runFacetSearch = true;

            if (query != "") {
                jq18(".quickSearchTextBox").val(query);
                isBrowserBack = true;
                initSearch();
            }

            window.browserNavKeyPress = false;
        }
    }
}

