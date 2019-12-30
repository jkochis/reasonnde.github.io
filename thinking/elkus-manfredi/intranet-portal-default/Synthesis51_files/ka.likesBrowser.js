function likesBrowser(likes) {
    var html = document.createElement("div");
    html.setAttribute("class", "ka_greyLinks");
    var titleEl = document.createElement("span");
    titleEl.setAttribute("class", "ka_likesModalTitle");
    titleEl.innerHTML = "Likes";
    html.appendChild(titleEl);
    jq18.each(likes, function (i, author) {
        var like = document.createElement("div");
        like.innerHTML += "<img src='" + author.ImageURL + "' width='50px' height='50px' style='vertical-align:top' class='ka_circular' />";
        like.innerHTML += "&nbsp";

        var nameLink = document.createElement("a");
        nameLink.setAttribute('href', author.ProfileURL);
        nameLink.innerHTML = author.Name;
        like.appendChild(nameLink);

        jq18(like)
        .css("padding", "3px")
        .css("margin", "2px")
        .css("white-space", "nowrap")
        .click(function () { window.location.href = author.ProfileURL; });
        
        html.appendChild(like);
    });

    jq18('#likesBrowserBody').html(html);

    var maxHeight = jq18(window).height() - 100;
    if (maxHeight > 600) maxHeight = 600;

    jq18.colorbox({
        html: html,
        className: 'ka_likesModal',
        maxHeight: maxHeight,
        initialWidth: 400,
        maxWidth: jq18(window).width() - 100
    });

    return false;
}