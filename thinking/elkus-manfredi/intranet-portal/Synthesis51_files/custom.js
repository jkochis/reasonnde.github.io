window.carouselLoaded = false;
var placeCarousel = function() {
    if(document.forms[0].action.indexOf("emme/Default.aspx") > -1 && window.carouselLoaded === false) {
        if (jq18('#DeltaTopNavigation a.selected').text() === 'HomeCurrently selected') {
            var portalCarousel = {
                currentSlide: 0,
                autoPlay: false,
                slideData: [],
                loadSlide: function (slide) {
                    if (jq18(slide).index() !== this.currentSlide) {
                        portalCarousel.currentSlide = jq18(slide).index();
                        // move to position
                        jq18(slide).css({
                            'left': '980px',
                            'z-index': '2'
                        }).animate({
                            'left': '0',
                            'z-index': '1'
                        }, {
                            duration: 500, complete: function () {
                                jq18('.carousel-slide').not(slide).css('z-index', '0');
                            }
                        });
                    }
                },
                buildCarousel: function (data) {
                    // create a container element for the slides
                    var carouselContainer = jq18('<div>', {class: 'carousel-slides-container'});
                    // build each slide for the carousel from JSON
                    for (slide in data) {
                        var slideHTML = this.buildSlide(data[slide]);
                        jq18(carouselContainer).append(slideHTML[0]);
                    }
                    ;
                    // create controls to navigate the slides
                    var carouselControls = jq18('<ul>', {class: 'carousel-slides-controls'});
                    for (var i = 0; i < data.length; i++) {
                        jq18(carouselControls).append('<li class="carousel-slide-control">');
                    }
                    ;
                    jq18(carouselContainer).append(carouselControls);
                    return carouselContainer;
                },
                buildSlide: function (data) {
                    // slide template
                    var slide = jq18('<div>', {
                        class: 'carousel-slide',
                        attr: {
                            'style': 'background-image:url(' + data.image + ')'
                        }
                    });
                    var slideText = jq18('<div>', {
                        class: 'carousel-slide-text'
                    });
                    var slideCategory = jq18('<a>', {
                        class: 'carousel-slide-category',
                        href: data['category-link'],
                        text: data.category
                    });
                    var slideTitle = jq18('<div>', {
                        class: 'carousel-slide-title',
                        text: data.title
                    });
                    var slideCopy = jq18('<div>', {
                        class: 'carousel-slide-copy',
                        html: data.copy
                    });
                    if (data.link) {
                        var slideLink = jq18('<a>', {
                            class: 'carousel-slide-link',
                            href: data.link,
                            text: 'more >>'
                        });
                    }
                    slideText.prepend(slideCategory, [slideTitle, slideCopy, slideLink])
                    slide.prepend(slideText);
                    return slide;
                },
                init: function (data) {
                    return this.buildCarousel(data);
                }
            };
            // setup the carousel
            var yamlLoc = 'http://emme/carousel/Shared%20Documents/';
            //determine if we want the preview JSON
            var slideJSON = document.location.search.indexOf("preview") > -1 ? 'slides-preview.txt' : 'slides.txt';
            // create the carousel element and put the slides in
            var carousel = jq18("<div class='carousel'>");
            var startAutoplay = function () {
                portalCarousel.autoPlay = true;
                window.autoplay = setInterval(function () {
                    var $cur = jq18('.carousel-slide-control.active');
                    var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                    $next.click();
                }, 6500);
            }
            var stopAutoplay = function (duration) {
                clearInterval(window.autoplay);
                portalCarousel.autoPlay = false;
                if (duration > 0) {
                    clearTimeout(window.pauser);
                    window.pauser = setTimeout(function () {
                        // figure out which slide to load next when timer runs out
                        var $cur = jq18('.carousel-slide-control.active');
                        var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                        $next.click();
                        // turn on autoplay once pause timer runs out
                        startAutoplay();
                    }, duration);
                }
            }
            // load yaml and run thru yaml-to-json parser
            // initialize carousel and attach to DOM
            jq18.get(yamlLoc + slideJSON, function (response) {
                    html = portalCarousel.init(jsyaml.load(response));
                    carousel.html(html);
                })
                .done(function () {
                    // plunk it at the top of the content box
                    cb = jq18('#contentBox').prepend(carousel);
                    cb.css('margin-top', '0');
                    jq18('.carousel-slide-control:eq(0)').addClass('active');
                    // put the first slide on top
                    jq18('.carousel-slide:eq(0)').css('z-index', 1);
                    window.carouselLoaded = true;
                    // handle clicks on carousel controls and left/right arrow keys
                    jq18('.carousel-slide-control').on('click arrowClick', function (e) {
                        // set index to the control that was clicked and load the slide with the same index
                        var index = jq18('.carousel-slide-control').index(this);
                        portalCarousel.loadSlide(jq18('.carousel-slide:eq(' + index + ')'));
                        // update controls
                        jq18('.carousel-slide-control').not(this).removeClass('active');
                        jq18(this).addClass('active');
                        // if this was not an autoplay event...
                        if (e.type === 'arrowClick' || !e.isTrigger) {
                            // turn off autoplay and/or (re)start pause timer
                            stopAutoplay(15000);

                        }
                    });
                    // handle left and right arrow keypress listeners
                    jq18(document).keyup(function (e) {
                        switch (e.which) {
                            case 39:
                                var $cur = jq18('.carousel-slide-control.active').removeClass('active');
                                // right
                                var $next = $cur.next().length ? $cur.next() : jq18('.carousel-slide-control:eq(0)');
                                $next.trigger('arrowClick');
                                break;
                            case 37:
                                var $cur = jq18('.carousel-slide-control.active').removeClass('active');
                                // left
                                var $prev = $cur.prev().length ? $cur.prev() : jq18('.carousel-slide-control').last();
                                $prev.trigger('arrowClick');
                                break;
                        }
                    });
                    // pause carousel when there's mouse activity over it
                    jq18('.carousel').on('click mouseenter mouseleave mousemove', function (e) {
                        if (e.type === 'arrowClick' || !e.isTrigger) {
                            stopAutoplay(15000);
                        }
                    });
                    // start autoplay onload
                    startAutoplay();
                });
        }
        /* 15 minute page refresh */
        var time = new Date().getTime();
         jq18(document.body).bind("mousedown keypress", function(e) {
             time = new Date().getTime();
         });
    
         function refresh() {
             if(new Date().getTime() - time >= 900000) 
                 window.location.reload(true);
             else 
                 setTimeout(refresh, 5000);
         }
        setTimeout(refresh, 5000);
        /* js-yaml 3.6.0 https://github.com/nodeca/js-yaml */
        !function (e) {
            if ("object" == typeof exports && "undefined" != typeof module)module.exports = e(); else if ("function" == typeof define && define.amd)define([], e); else {
                var t;
                t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.jsyaml = e()
            }
        }(function () {
            return function e(t, n, i) {
                function r(a, s) {
                    if (!n[a]) {
                        if (!t[a]) {
                            var c = "function" == typeof require && require;
                            if (!s && c)return c(a, !0);
                            if (o)return o(a, !0);
                            var u = new Error("Cannot find module '" + a + "'");
                            throw u.code = "MODULE_NOT_FOUND", u
                        }
                        var l = n[a] = {exports: {}};
                        t[a][0].call(l.exports, function (e) {
                            var n = t[a][1][e];
                            return r(n ? n : e)
                        }, l, l.exports, e, t, n, i)
                    }
                    return n[a].exports
                }

                for (var o = "function" == typeof require && require, a = 0; a < i.length; a++)r(i[a]);
                return r
            }({
                1: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return function () {
                            throw new Error("Function " + e + " is deprecated and cannot be used.")
                        }
                    }

                    var r = e("./js-yaml/loader"), o = e("./js-yaml/dumper");
                    t.exports.Type = e("./js-yaml/type"), t.exports.Schema = e("./js-yaml/schema"), t.exports.FAILSAFE_SCHEMA = e("./js-yaml/schema/failsafe"), t.exports.JSON_SCHEMA = e("./js-yaml/schema/json"), t.exports.CORE_SCHEMA = e("./js-yaml/schema/core"), t.exports.DEFAULT_SAFE_SCHEMA = e("./js-yaml/schema/default_safe"), t.exports.DEFAULT_FULL_SCHEMA = e("./js-yaml/schema/default_full"), t.exports.load = r.load, t.exports.loadAll = r.loadAll, t.exports.safeLoad = r.safeLoad, t.exports.safeLoadAll = r.safeLoadAll, t.exports.dump = o.dump, t.exports.safeDump = o.safeDump, t.exports.YAMLException = e("./js-yaml/exception"), t.exports.MINIMAL_SCHEMA = e("./js-yaml/schema/failsafe"), t.exports.SAFE_SCHEMA = e("./js-yaml/schema/default_safe"), t.exports.DEFAULT_SCHEMA = e("./js-yaml/schema/default_full"), t.exports.scan = i("scan"), t.exports.parse = i("parse"), t.exports.compose = i("compose"), t.exports.addConstructor = i("addConstructor")
                }, {
                    "./js-yaml/dumper": 3,
                    "./js-yaml/exception": 4,
                    "./js-yaml/loader": 5,
                    "./js-yaml/schema": 7,
                    "./js-yaml/schema/core": 8,
                    "./js-yaml/schema/default_full": 9,
                    "./js-yaml/schema/default_safe": 10,
                    "./js-yaml/schema/failsafe": 11,
                    "./js-yaml/schema/json": 12,
                    "./js-yaml/type": 13
                }],
                2: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return "undefined" == typeof e || null === e
                    }

                    function r(e) {
                        return "object" == typeof e && null !== e
                    }

                    function o(e) {
                        return Array.isArray(e) ? e : i(e) ? [] : [e]
                    }

                    function a(e, t) {
                        var n, i, r, o;
                        if (t)for (o = Object.keys(t), n = 0, i = o.length; i > n; n += 1)r = o[n], e[r] = t[r];
                        return e
                    }

                    function s(e, t) {
                        var n, i = "";
                        for (n = 0; t > n; n += 1)i += e;
                        return i
                    }

                    function c(e) {
                        return 0 === e && Number.NEGATIVE_INFINITY === 1 / e
                    }

                    t.exports.isNothing = i, t.exports.isObject = r, t.exports.toArray = o, t.exports.repeat = s, t.exports.isNegativeZero = c, t.exports.extend = a
                }, {}],
                3: [function (e, t, n) {
                    "use strict";
                    function i(e, t) {
                        var n, i, r, o, a, s, c;
                        if (null === t)return {};
                        for (n = {}, i = Object.keys(t), r = 0, o = i.length; o > r; r += 1)a = i[r], s = String(t[a]), "!!" === a.slice(0, 2) && (a = "tag:yaml.org,2002:" + a.slice(2)), c = e.compiledTypeMap[a], c && L.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[a] = s;
                        return n
                    }

                    function r(e) {
                        var t, n, i;
                        if (t = e.toString(16).toUpperCase(), 255 >= e)n = "x", i = 2; else if (65535 >= e)n = "u", i = 4; else {
                            if (!(4294967295 >= e))throw new N("code point within a string may not be greater than 0xFFFFFFFF");
                            n = "U", i = 8
                        }
                        return "\\" + n + F.repeat("0", i - t.length) + t
                    }

                    function o(e) {
                        this.schema = e.schema || M, this.indent = Math.max(1, e.indent || 2), this.skipInvalid = e.skipInvalid || !1, this.flowLevel = F.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = i(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null
                    }

                    function a(e, t) {
                        for (var n, i = F.repeat(" ", t), r = 0, o = -1, a = "", s = e.length; s > r;)o = e.indexOf("\n", r), -1 === o ? (n = e.slice(r), r = s) : (n = e.slice(r, o + 1), r = o + 1), n.length && "\n" !== n && (a += i), a += n;
                        return a
                    }

                    function s(e, t) {
                        return "\n" + F.repeat(" ", e.indent * t)
                    }

                    function c(e, t) {
                        var n, i, r;
                        for (n = 0, i = e.implicitTypes.length; i > n; n += 1)if (r = e.implicitTypes[n], r.resolve(t))return !0;
                        return !1
                    }

                    function u(e) {
                        return e === q || e === D
                    }

                    function l(e) {
                        return e >= 32 && 126 >= e || e >= 161 && 55295 >= e && 8232 !== e && 8233 !== e || e >= 57344 && 65533 >= e && 65279 !== e || e >= 65536 && 1114111 >= e
                    }

                    function p(e) {
                        return l(e) && 65279 !== e && e !== H && e !== Q && e !== X && e !== te && e !== ie && e !== V && e !== B
                    }

                    function f(e) {
                        return l(e) && 65279 !== e && !u(e) && e !== G && e !== z && e !== V && e !== H && e !== Q && e !== X && e !== te && e !== ie && e !== B && e !== W && e !== $ && e !== Y && e !== ne && e !== Z && e !== K && e !== R && e !== P && e !== J && e !== ee
                    }

                    function d(e, t, n, i, r) {
                        var o, a, s = !1, c = !1, d = -1 !== i, h = -1, m = f(e.charCodeAt(0)) && !u(e.charCodeAt(e.length - 1));
                        if (t)for (o = 0; o < e.length; o++) {
                            if (a = e.charCodeAt(o), !l(a))return le;
                            m = m && p(a)
                        } else {
                            for (o = 0; o < e.length; o++) {
                                if (a = e.charCodeAt(o), a === U)s = !0, d && (c = c || o - h - 1 > i && " " !== e[h + 1], h = o); else if (!l(a))return le;
                                m = m && p(a)
                            }
                            c = c || d && o - h - 1 > i && " " !== e[h + 1]
                        }
                        return s || c ? " " === e[0] && n > 9 ? le : c ? ue : ce : m && !r(e) ? ae : se
                    }

                    function h(e, t, n, i) {
                        e.dump = function () {
                            function r(t) {
                                return c(e, t)
                            }

                            if (0 === t.length)return "''";
                            if (!e.noCompatMode && -1 !== oe.indexOf(t))return "'" + t + "'";
                            var o = e.indent * Math.max(1, n), s = -1 === e.lineWidth ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), u = i || e.flowLevel > -1 && n >= e.flowLevel;
                            switch (d(t, u, e.indent, s, r)) {
                                case ae:
                                    return t;
                                case se:
                                    return "'" + t.replace(/'/g, "''") + "'";
                                case ce:
                                    return "|" + m(t, e.indent) + g(a(t, o));
                                case ue:
                                    return ">" + m(t, e.indent) + g(a(y(t, s), o));
                                case le:
                                    return '"' + v(t, s) + '"';
                                default:
                                    throw new N("impossible error: invalid scalar style")
                            }
                        }()
                    }

                    function m(e, t) {
                        var n = " " === e[0] ? String(t) : "", i = "\n" === e[e.length - 1], r = i && ("\n" === e[e.length - 2] || "\n" === e), o = r ? "+" : i ? "" : "-";
                        return n + o + "\n"
                    }

                    function g(e) {
                        return "\n" === e[e.length - 1] ? e.slice(0, -1) : e
                    }

                    function y(e, t) {
                        for (var n, i, r = /(\n+)([^\n]*)/g, o = function () {
                            var n = e.indexOf("\n");
                            return n = -1 !== n ? n : e.length, r.lastIndex = n, x(e.slice(0, n), t)
                        }(), a = "\n" === e[0] || " " === e[0]; i = r.exec(e);) {
                            var s = i[1], c = i[2];
                            n = " " === c[0], o += s + (a || n || "" === c ? "" : "\n") + x(c, t), a = n
                        }
                        return o
                    }

                    function x(e, t) {
                        if ("" === e || " " === e[0])return e;
                        for (var n, i, r = / [^ ]/g, o = 0, a = 0, s = 0, c = ""; n = r.exec(e);)s = n.index, s - o > t && (i = a > o ? a : s, c += "\n" + e.slice(o, i), o = i + 1), a = s;
                        return c += "\n", c += e.length - o > t && a > o ? e.slice(o, a) + "\n" + e.slice(a + 1) : e.slice(o), c.slice(1)
                    }

                    function v(e) {
                        for (var t, n, i = "", o = 0; o < e.length; o++)t = e.charCodeAt(o), n = re[t], i += !n && l(t) ? e[o] : n || r(t);
                        return i
                    }

                    function A(e, t, n) {
                        var i, r, o = "", a = e.tag;
                        for (i = 0, r = n.length; r > i; i += 1)j(e, t, n[i], !1, !1) && (0 !== i && (o += ", "), o += e.dump);
                        e.tag = a, e.dump = "[" + o + "]"
                    }

                    function b(e, t, n, i) {
                        var r, o, a = "", c = e.tag;
                        for (r = 0, o = n.length; o > r; r += 1)j(e, t + 1, n[r], !0, !0) && (i && 0 === r || (a += s(e, t)), a += "- " + e.dump);
                        e.tag = c, e.dump = a || "[]"
                    }

                    function w(e, t, n) {
                        var i, r, o, a, s, c = "", u = e.tag, l = Object.keys(n);
                        for (i = 0, r = l.length; r > i; i += 1)s = "", 0 !== i && (s += ", "), o = l[i], a = n[o], j(e, t, o, !1, !1) && (e.dump.length > 1024 && (s += "? "), s += e.dump + ": ", j(e, t, a, !1, !1) && (s += e.dump, c += s));
                        e.tag = u, e.dump = "{" + c + "}"
                    }

                    function C(e, t, n, i) {
                        var r, o, a, c, u, l, p = "", f = e.tag, d = Object.keys(n);
                        if (e.sortKeys === !0)d.sort(); else if ("function" == typeof e.sortKeys)d.sort(e.sortKeys); else if (e.sortKeys)throw new N("sortKeys must be a boolean or a function");
                        for (r = 0, o = d.length; o > r; r += 1)l = "", i && 0 === r || (l += s(e, t)), a = d[r], c = n[a], j(e, t + 1, a, !0, !0, !0) && (u = null !== e.tag && "?" !== e.tag || e.dump && e.dump.length > 1024, u && (l += e.dump && U === e.dump.charCodeAt(0) ? "?" : "? "), l += e.dump, u && (l += s(e, t)), j(e, t + 1, c, !0, u) && (l += e.dump && U === e.dump.charCodeAt(0) ? ":" : ": ", l += e.dump, p += l));
                        e.tag = f, e.dump = p || "{}"
                    }

                    function k(e, t, n) {
                        var i, r, o, a, s, c;
                        for (r = n ? e.explicitTypes : e.implicitTypes, o = 0, a = r.length; a > o; o += 1)if (s = r[o], (s.instanceOf || s.predicate) && (!s.instanceOf || "object" == typeof t && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
                            if (e.tag = n ? s.tag : "?", s.represent) {
                                if (c = e.styleMap[s.tag] || s.defaultStyle, "[object Function]" === T.call(s.represent))i = s.represent(t, c); else {
                                    if (!L.call(s.represent, c))throw new N("!<" + s.tag + '> tag resolver accepts not "' + c + '" style');
                                    i = s.represent[c](t, c)
                                }
                                e.dump = i
                            }
                            return !0
                        }
                        return !1
                    }

                    function j(e, t, n, i, r, o) {
                        e.tag = null, e.dump = n, k(e, n, !1) || k(e, n, !0);
                        var a = T.call(e.dump);
                        i && (i = e.flowLevel < 0 || e.flowLevel > t);
                        var s, c, u = "[object Object]" === a || "[object Array]" === a;
                        if (u && (s = e.duplicates.indexOf(n), c = -1 !== s), (null !== e.tag && "?" !== e.tag || c || 2 !== e.indent && t > 0) && (r = !1), c && e.usedDuplicates[s])e.dump = "*ref_" + s; else {
                            if (u && c && !e.usedDuplicates[s] && (e.usedDuplicates[s] = !0), "[object Object]" === a)i && 0 !== Object.keys(e.dump).length ? (C(e, t, e.dump, r), c && (e.dump = "&ref_" + s + e.dump)) : (w(e, t, e.dump), c && (e.dump = "&ref_" + s + " " + e.dump)); else if ("[object Array]" === a)i && 0 !== e.dump.length ? (b(e, t, e.dump, r), c && (e.dump = "&ref_" + s + e.dump)) : (A(e, t, e.dump), c && (e.dump = "&ref_" + s + " " + e.dump)); else {
                                if ("[object String]" !== a) {
                                    if (e.skipInvalid)return !1;
                                    throw new N("unacceptable kind of an object to dump " + a)
                                }
                                "?" !== e.tag && h(e, e.dump, t, o)
                            }
                            null !== e.tag && "?" !== e.tag && (e.dump = "!<" + e.tag + "> " + e.dump)
                        }
                        return !0
                    }

                    function I(e, t) {
                        var n, i, r = [], o = [];
                        for (S(e, r, o), n = 0, i = o.length; i > n; n += 1)t.duplicates.push(r[o[n]]);
                        t.usedDuplicates = new Array(i)
                    }

                    function S(e, t, n) {
                        var i, r, o;
                        if (null !== e && "object" == typeof e)if (r = t.indexOf(e), -1 !== r)-1 === n.indexOf(r) && n.push(r); else if (t.push(e), Array.isArray(e))for (r = 0, o = e.length; o > r; r += 1)S(e[r], t, n); else for (i = Object.keys(e), r = 0, o = i.length; o > r; r += 1)S(e[i[r]], t, n)
                    }

                    function O(e, t) {
                        t = t || {};
                        var n = new o(t);
                        return n.noRefs || I(e, n), j(n, 0, e, !0, !0) ? n.dump + "\n" : ""
                    }

                    function E(e, t) {
                        return O(e, F.extend({schema: _}, t))
                    }

                    var F = e("./common"), N = e("./exception"), M = e("./schema/default_full"), _ = e("./schema/default_safe"), T = Object.prototype.toString, L = Object.prototype.hasOwnProperty, D = 9, U = 10, q = 32, Y = 33, R = 34, B = 35, P = 37, W = 38, K = 39, $ = 42, H = 44, G = 45, V = 58, Z = 62, z = 63, J = 64, Q = 91, X = 93, ee = 96, te = 123, ne = 124, ie = 125, re = {};
                    re[0] = "\\0", re[7] = "\\a", re[8] = "\\b", re[9] = "\\t", re[10] = "\\n", re[11] = "\\v", re[12] = "\\f", re[13] = "\\r", re[27] = "\\e", re[34] = '\\"', re[92] = "\\\\", re[133] = "\\N", re[160] = "\\_", re[8232] = "\\L", re[8233] = "\\P";
                    var oe = ["y", "Y", "yes", "Yes", "YES", "on", "On", "ON", "n", "N", "no", "No", "NO", "off", "Off", "OFF"], ae = 1, se = 2, ce = 3, ue = 4, le = 5;
                    t.exports.dump = O, t.exports.safeDump = E
                }, {"./common": 2, "./exception": 4, "./schema/default_full": 9, "./schema/default_safe": 10}],
                4: [function (e, t, n) {
                    "use strict";
                    function i(e, t) {
                        Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack || "", this.name = "YAMLException", this.reason = e, this.mark = t, this.message = (this.reason || "(unknown reason)") + (this.mark ? " " + this.mark.toString() : "")
                    }

                    i.prototype = Object.create(Error.prototype), i.prototype.constructor = i, i.prototype.toString = function (e) {
                        var t = this.name + ": ";
                        return t += this.reason || "(unknown reason)", !e && this.mark && (t += " " + this.mark.toString()), t
                    }, t.exports = i
                }, {}],
                5: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return 10 === e || 13 === e
                    }

                    function r(e) {
                        return 9 === e || 32 === e
                    }

                    function o(e) {
                        return 9 === e || 32 === e || 10 === e || 13 === e
                    }

                    function a(e) {
                        return 44 === e || 91 === e || 93 === e || 123 === e || 125 === e
                    }

                    function s(e) {
                        var t;
                        return e >= 48 && 57 >= e ? e - 48 : (t = 32 | e, t >= 97 && 102 >= t ? t - 97 + 10 : -1)
                    }

                    function c(e) {
                        return 120 === e ? 2 : 117 === e ? 4 : 85 === e ? 8 : 0
                    }

                    function u(e) {
                        return e >= 48 && 57 >= e ? e - 48 : -1
                    }

                    function l(e) {
                        return 48 === e ? "\x00" : 97 === e ? "" : 98 === e ? "\b" : 116 === e ? "	" : 9 === e ? "	" : 110 === e ? "\n" : 118 === e ? "\x0B" : 102 === e ? "\f" : 114 === e ? "\r" : 101 === e ? "" : 32 === e ? " " : 34 === e ? '"' : 47 === e ? "/" : 92 === e ? "\\" : 78 === e ? "" : 95 === e ? " " : 76 === e ? "\u2028" : 80 === e ? "\u2029" : ""
                    }

                    function p(e) {
                        return 65535 >= e ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320)
                    }

                    function f(e, t) {
                        this.input = e, this.filename = t.filename || null, this.schema = t.schema || K, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.documents = []
                    }

                    function d(e, t) {
                        return new B(t, new P(e.filename, e.input, e.position, e.line, e.position - e.lineStart))
                    }

                    function h(e, t) {
                        throw d(e, t)
                    }

                    function m(e, t) {
                        e.onWarning && e.onWarning.call(null, d(e, t))
                    }

                    function g(e, t, n, i) {
                        var r, o, a, s;
                        if (n > t) {
                            if (s = e.input.slice(t, n), i)for (r = 0, o = s.length; o > r; r += 1)a = s.charCodeAt(r), 9 === a || a >= 32 && 1114111 >= a || h(e, "expected valid JSON character"); else X.test(s) && h(e, "the stream contains non-printable characters");
                            e.result += s
                        }
                    }

                    function y(e, t, n, i) {
                        var r, o, a, s;
                        for (R.isObject(n) || h(e, "cannot merge mappings; the provided source object is unacceptable"), r = Object.keys(n), a = 0, s = r.length; s > a; a += 1)o = r[a], $.call(t, o) || (t[o] = n[o], i[o] = !0)
                    }

                    function x(e, t, n, i, r, o) {
                        var a, s;
                        if (r = String(r), null === t && (t = {}), "tag:yaml.org,2002:merge" === i)if (Array.isArray(o))for (a = 0, s = o.length; s > a; a += 1)y(e, t, o[a], n); else y(e, t, o, n); else e.json || $.call(n, r) || !$.call(t, r) || h(e, "duplicated mapping key"), t[r] = o, delete n[r];
                        return t
                    }

                    function v(e) {
                        var t;
                        t = e.input.charCodeAt(e.position), 10 === t ? e.position++ : 13 === t ? (e.position++, 10 === e.input.charCodeAt(e.position) && e.position++) : h(e, "a line break is expected"), e.line += 1, e.lineStart = e.position
                    }

                    function A(e, t, n) {
                        for (var o = 0, a = e.input.charCodeAt(e.position); 0 !== a;) {
                            for (; r(a);)a = e.input.charCodeAt(++e.position);
                            if (t && 35 === a)do a = e.input.charCodeAt(++e.position); while (10 !== a && 13 !== a && 0 !== a);
                            if (!i(a))break;
                            for (v(e), a = e.input.charCodeAt(e.position), o++, e.lineIndent = 0; 32 === a;)e.lineIndent++, a = e.input.charCodeAt(++e.position)
                        }
                        return -1 !== n && 0 !== o && e.lineIndent < n && m(e, "deficient indentation"), o
                    }

                    function b(e) {
                        var t, n = e.position;
                        return t = e.input.charCodeAt(n), (45 === t || 46 === t) && t === e.input.charCodeAt(n + 1) && t === e.input.charCodeAt(n + 2) && (n += 3, t = e.input.charCodeAt(n), 0 === t || o(t))
                    }

                    function w(e, t) {
                        1 === t ? e.result += " " : t > 1 && (e.result += R.repeat("\n", t - 1))
                    }

                    function C(e, t, n) {
                        var s, c, u, l, p, f, d, h, m, y = e.kind, x = e.result;
                        if (m = e.input.charCodeAt(e.position), o(m) || a(m) || 35 === m || 38 === m || 42 === m || 33 === m || 124 === m || 62 === m || 39 === m || 34 === m || 37 === m || 64 === m || 96 === m)return !1;
                        if ((63 === m || 45 === m) && (c = e.input.charCodeAt(e.position + 1), o(c) || n && a(c)))return !1;
                        for (e.kind = "scalar", e.result = "", u = l = e.position, p = !1; 0 !== m;) {
                            if (58 === m) {
                                if (c = e.input.charCodeAt(e.position + 1), o(c) || n && a(c))break
                            } else if (35 === m) {
                                if (s = e.input.charCodeAt(e.position - 1), o(s))break
                            } else {
                                if (e.position === e.lineStart && b(e) || n && a(m))break;
                                if (i(m)) {
                                    if (f = e.line, d = e.lineStart, h = e.lineIndent, A(e, !1, -1), e.lineIndent >= t) {
                                        p = !0, m = e.input.charCodeAt(e.position);
                                        continue
                                    }
                                    e.position = l, e.line = f, e.lineStart = d, e.lineIndent = h;
                                    break
                                }
                            }
                            p && (g(e, u, l, !1), w(e, e.line - f), u = l = e.position, p = !1), r(m) || (l = e.position + 1), m = e.input.charCodeAt(++e.position)
                        }
                        return g(e, u, l, !1), e.result ? !0 : (e.kind = y, e.result = x, !1)
                    }

                    function k(e, t) {
                        var n, r, o;
                        if (n = e.input.charCodeAt(e.position), 39 !== n)return !1;
                        for (e.kind = "scalar", e.result = "", e.position++, r = o = e.position; 0 !== (n = e.input.charCodeAt(e.position));)if (39 === n) {
                            if (g(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), 39 !== n)return !0;
                            r = o = e.position, e.position++
                        } else i(n) ? (g(e, r, o, !0), w(e, A(e, !1, t)), r = o = e.position) : e.position === e.lineStart && b(e) ? h(e, "unexpected end of the document within a single quoted scalar") : (e.position++, o = e.position);
                        h(e, "unexpected end of the stream within a single quoted scalar")
                    }

                    function j(e, t) {
                        var n, r, o, a, u, l;
                        if (l = e.input.charCodeAt(e.position), 34 !== l)return !1;
                        for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; 0 !== (l = e.input.charCodeAt(e.position));) {
                            if (34 === l)return g(e, n, e.position, !0), e.position++, !0;
                            if (92 === l) {
                                if (g(e, n, e.position, !0), l = e.input.charCodeAt(++e.position), i(l))A(e, !1, t); else if (256 > l && re[l])e.result += oe[l], e.position++; else if ((u = c(l)) > 0) {
                                    for (o = u, a = 0; o > 0; o--)l = e.input.charCodeAt(++e.position), (u = s(l)) >= 0 ? a = (a << 4) + u : h(e, "expected hexadecimal character");
                                    e.result += p(a), e.position++
                                } else h(e, "unknown escape sequence");
                                n = r = e.position
                            } else i(l) ? (g(e, n, r, !0), w(e, A(e, !1, t)), n = r = e.position) : e.position === e.lineStart && b(e) ? h(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position)
                        }
                        h(e, "unexpected end of the stream within a double quoted scalar")
                    }

                    function I(e, t) {
                        var n, i, r, a, s, c, u, l, p, f, d, m = !0, g = e.tag, y = e.anchor, v = {};
                        if (d = e.input.charCodeAt(e.position), 91 === d)a = 93, u = !1, i = []; else {
                            if (123 !== d)return !1;
                            a = 125, u = !0, i = {}
                        }
                        for (null !== e.anchor && (e.anchorMap[e.anchor] = i), d = e.input.charCodeAt(++e.position); 0 !== d;) {
                            if (A(e, !0, t), d = e.input.charCodeAt(e.position), d === a)return e.position++, e.tag = g, e.anchor = y, e.kind = u ? "mapping" : "sequence", e.result = i, !0;
                            m || h(e, "missed comma between flow collection entries"), p = l = f = null, s = c = !1, 63 === d && (r = e.input.charCodeAt(e.position + 1), o(r) && (s = c = !0, e.position++, A(e, !0, t))), n = e.line, _(e, t, H, !1, !0), p = e.tag, l = e.result, A(e, !0, t), d = e.input.charCodeAt(e.position), !c && e.line !== n || 58 !== d || (s = !0, d = e.input.charCodeAt(++e.position), A(e, !0, t), _(e, t, H, !1, !0), f = e.result), u ? x(e, i, v, p, l, f) : s ? i.push(x(e, null, v, p, l, f)) : i.push(l), A(e, !0, t), d = e.input.charCodeAt(e.position), 44 === d ? (m = !0, d = e.input.charCodeAt(++e.position)) : m = !1
                        }
                        h(e, "unexpected end of the stream within a flow collection")
                    }

                    function S(e, t) {
                        var n, o, a, s, c = z, l = !1, p = !1, f = t, d = 0, m = !1;
                        if (s = e.input.charCodeAt(e.position), 124 === s)o = !1; else {
                            if (62 !== s)return !1;
                            o = !0
                        }
                        for (e.kind = "scalar", e.result = ""; 0 !== s;)if (s = e.input.charCodeAt(++e.position), 43 === s || 45 === s)z === c ? c = 43 === s ? Q : J : h(e, "repeat of a chomping mode identifier"); else {
                            if (!((a = u(s)) >= 0))break;
                            0 === a ? h(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : p ? h(e, "repeat of an indentation width identifier") : (f = t + a - 1, p = !0)
                        }
                        if (r(s)) {
                            do s = e.input.charCodeAt(++e.position); while (r(s));
                            if (35 === s)do s = e.input.charCodeAt(++e.position); while (!i(s) && 0 !== s)
                        }
                        for (; 0 !== s;) {
                            for (v(e), e.lineIndent = 0, s = e.input.charCodeAt(e.position); (!p || e.lineIndent < f) && 32 === s;)e.lineIndent++, s = e.input.charCodeAt(++e.position);
                            if (!p && e.lineIndent > f && (f = e.lineIndent), i(s))d++; else {
                                if (e.lineIndent < f) {
                                    c === Q ? e.result += R.repeat("\n", l ? 1 + d : d) : c === z && l && (e.result += "\n");
                                    break
                                }
                                for (o ? r(s) ? (m = !0, e.result += R.repeat("\n", l ? 1 + d : d)) : m ? (m = !1, e.result += R.repeat("\n", d + 1)) : 0 === d ? l && (e.result += " ") : e.result += R.repeat("\n", d) : e.result += R.repeat("\n", l ? 1 + d : d), l = !0, p = !0, d = 0, n = e.position; !i(s) && 0 !== s;)s = e.input.charCodeAt(++e.position);
                                g(e, n, e.position, !1)
                            }
                        }
                        return !0
                    }

                    function O(e, t) {
                        var n, i, r, a = e.tag, s = e.anchor, c = [], u = !1;
                        for (null !== e.anchor && (e.anchorMap[e.anchor] = c), r = e.input.charCodeAt(e.position); 0 !== r && 45 === r && (i = e.input.charCodeAt(e.position + 1), o(i));)if (u = !0, e.position++, A(e, !0, -1) && e.lineIndent <= t)c.push(null), r = e.input.charCodeAt(e.position); else if (n = e.line, _(e, t, V, !1, !0), c.push(e.result), A(e, !0, -1), r = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && 0 !== r)h(e, "bad indentation of a sequence entry"); else if (e.lineIndent < t)break;
                        return u ? (e.tag = a, e.anchor = s, e.kind = "sequence", e.result = c, !0) : !1
                    }

                    function E(e, t, n) {
                        var i, a, s, c, u = e.tag, l = e.anchor, p = {}, f = {}, d = null, m = null, g = null, y = !1, v = !1;
                        for (null !== e.anchor && (e.anchorMap[e.anchor] = p), c = e.input.charCodeAt(e.position); 0 !== c;) {
                            if (i = e.input.charCodeAt(e.position + 1), s = e.line, 63 !== c && 58 !== c || !o(i)) {
                                if (!_(e, n, G, !1, !0))break;
                                if (e.line === s) {
                                    for (c = e.input.charCodeAt(e.position); r(c);)c = e.input.charCodeAt(++e.position);
                                    if (58 === c)c = e.input.charCodeAt(++e.position), o(c) || h(e, "a whitespace character is expected after the key-value separator within a block mapping"), y && (x(e, p, f, d, m, null), d = m = g = null), v = !0, y = !1, a = !1, d = e.tag, m = e.result; else {
                                        if (!v)return e.tag = u, e.anchor = l, !0;
                                        h(e, "can not read an implicit mapping pair; a colon is missed")
                                    }
                                } else {
                                    if (!v)return e.tag = u, e.anchor = l, !0;
                                    h(e, "can not read a block mapping entry; a multiline key may not be an implicit key")
                                }
                            } else 63 === c ? (y && (x(e, p, f, d, m, null), d = m = g = null), v = !0, y = !0, a = !0) : y ? (y = !1, a = !0) : h(e, "incomplete explicit mapping pair; a key node is missed"), e.position += 1, c = i;
                            if ((e.line === s || e.lineIndent > t) && (_(e, t, Z, !0, a) && (y ? m = e.result : g = e.result), y || (x(e, p, f, d, m, g), d = m = g = null), A(e, !0, -1), c = e.input.charCodeAt(e.position)), e.lineIndent > t && 0 !== c)h(e, "bad indentation of a mapping entry"); else if (e.lineIndent < t)break
                        }
                        return y && x(e, p, f, d, m, null), v && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = p), v
                    }

                    function F(e) {
                        var t, n, i, r, a = !1, s = !1;
                        if (r = e.input.charCodeAt(e.position), 33 !== r)return !1;
                        if (null !== e.tag && h(e, "duplication of a tag property"), r = e.input.charCodeAt(++e.position), 60 === r ? (a = !0, r = e.input.charCodeAt(++e.position)) : 33 === r ? (s = !0, n = "!!", r = e.input.charCodeAt(++e.position)) : n = "!", t = e.position, a) {
                            do r = e.input.charCodeAt(++e.position); while (0 !== r && 62 !== r);
                            e.position < e.length ? (i = e.input.slice(t, e.position), r = e.input.charCodeAt(++e.position)) : h(e, "unexpected end of the stream within a verbatim tag")
                        } else {
                            for (; 0 !== r && !o(r);)33 === r && (s ? h(e, "tag suffix cannot contain exclamation marks") : (n = e.input.slice(t - 1, e.position + 1), ne.test(n) || h(e, "named tag handle cannot contain such characters"), s = !0, t = e.position + 1)), r = e.input.charCodeAt(++e.position);
                            i = e.input.slice(t, e.position), te.test(i) && h(e, "tag suffix cannot contain flow indicator characters")
                        }
                        return i && !ie.test(i) && h(e, "tag name cannot contain such characters: " + i), a ? e.tag = i : $.call(e.tagMap, n) ? e.tag = e.tagMap[n] + i : "!" === n ? e.tag = "!" + i : "!!" === n ? e.tag = "tag:yaml.org,2002:" + i : h(e, 'undeclared tag handle "' + n + '"'), !0
                    }

                    function N(e) {
                        var t, n;
                        if (n = e.input.charCodeAt(e.position), 38 !== n)return !1;
                        for (null !== e.anchor && h(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; 0 !== n && !o(n) && !a(n);)n = e.input.charCodeAt(++e.position);
                        return e.position === t && h(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0
                    }

                    function M(e) {
                        var t, n, i;
                        if (i = e.input.charCodeAt(e.position), 42 !== i)return !1;
                        for (i = e.input.charCodeAt(++e.position), t = e.position; 0 !== i && !o(i) && !a(i);)i = e.input.charCodeAt(++e.position);
                        return e.position === t && h(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), e.anchorMap.hasOwnProperty(n) || h(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], A(e, !0, -1), !0
                    }

                    function _(e, t, n, i, r) {
                        var o, a, s, c, u, l, p, f, d = 1, m = !1, g = !1;
                        if (null !== e.listener && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = Z === n || V === n, i && A(e, !0, -1) && (m = !0, e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)), 1 === d)for (; F(e) || N(e);)A(e, !0, -1) ? (m = !0, s = o, e.lineIndent > t ? d = 1 : e.lineIndent === t ? d = 0 : e.lineIndent < t && (d = -1)) : s = !1;
                        if (s && (s = m || r), 1 !== d && Z !== n || (p = H === n || G === n ? t : t + 1, f = e.position - e.lineStart, 1 === d ? s && (O(e, f) || E(e, f, p)) || I(e, p) ? g = !0 : (a && S(e, p) || k(e, p) || j(e, p) ? g = !0 : M(e) ? (g = !0, null === e.tag && null === e.anchor || h(e, "alias node should not have any properties")) : C(e, p, H === n) && (g = !0, null === e.tag && (e.tag = "?")), null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : 0 === d && (g = s && O(e, f))), null !== e.tag && "!" !== e.tag)if ("?" === e.tag) {
                            for (c = 0, u = e.implicitTypes.length; u > c; c += 1)if (l = e.implicitTypes[c], l.resolve(e.result)) {
                                e.result = l.construct(e.result), e.tag = l.tag, null !== e.anchor && (e.anchorMap[e.anchor] = e.result);
                                break
                            }
                        } else $.call(e.typeMap, e.tag) ? (l = e.typeMap[e.tag], null !== e.result && l.kind !== e.kind && h(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + l.kind + '", not "' + e.kind + '"'), l.resolve(e.result) ? (e.result = l.construct(e.result), null !== e.anchor && (e.anchorMap[e.anchor] = e.result)) : h(e, "cannot resolve a node with !<" + e.tag + "> explicit tag")) : h(e, "unknown tag !<" + e.tag + ">");
                        return null !== e.listener && e.listener("close", e), null !== e.tag || null !== e.anchor || g
                    }

                    function T(e) {
                        var t, n, a, s, c = e.position, u = !1;
                        for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = {}, e.anchorMap = {}; 0 !== (s = e.input.charCodeAt(e.position)) && (A(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || 37 !== s));) {
                            for (u = !0, s = e.input.charCodeAt(++e.position), t = e.position; 0 !== s && !o(s);)s = e.input.charCodeAt(++e.position);
                            for (n = e.input.slice(t, e.position), a = [], n.length < 1 && h(e, "directive name must not be less than one character in length"); 0 !== s;) {
                                for (; r(s);)s = e.input.charCodeAt(++e.position);
                                if (35 === s) {
                                    do s = e.input.charCodeAt(++e.position); while (0 !== s && !i(s));
                                    break
                                }
                                if (i(s))break;
                                for (t = e.position; 0 !== s && !o(s);)s = e.input.charCodeAt(++e.position);
                                a.push(e.input.slice(t, e.position))
                            }
                            0 !== s && v(e), $.call(se, n) ? se[n](e, n, a) : m(e, 'unknown document directive "' + n + '"')
                        }
                        return A(e, !0, -1), 0 === e.lineIndent && 45 === e.input.charCodeAt(e.position) && 45 === e.input.charCodeAt(e.position + 1) && 45 === e.input.charCodeAt(e.position + 2) ? (e.position += 3, A(e, !0, -1)) : u && h(e, "directives end mark is expected"), _(e, e.lineIndent - 1, Z, !1, !0), A(e, !0, -1), e.checkLineBreaks && ee.test(e.input.slice(c, e.position)) && m(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && b(e) ? void(46 === e.input.charCodeAt(e.position) && (e.position += 3, A(e, !0, -1))) : void(e.position < e.length - 1 && h(e, "end of the stream or a document separator is expected"))
                    }

                    function L(e, t) {
                        e = String(e), t = t || {}, 0 !== e.length && (10 !== e.charCodeAt(e.length - 1) && 13 !== e.charCodeAt(e.length - 1) && (e += "\n"), 65279 === e.charCodeAt(0) && (e = e.slice(1)));
                        var n = new f(e, t);
                        for (n.input += "\x00"; 32 === n.input.charCodeAt(n.position);)n.lineIndent += 1, n.position += 1;
                        for (; n.position < n.length - 1;)T(n);
                        return n.documents
                    }

                    function D(e, t, n) {
                        var i, r, o = L(e, n);
                        for (i = 0, r = o.length; r > i; i += 1)t(o[i])
                    }

                    function U(e, t) {
                        var n = L(e, t);
                        if (0 !== n.length) {
                            if (1 === n.length)return n[0];
                            throw new B("expected a single document in the stream, but found more")
                        }
                    }

                    function q(e, t, n) {
                        D(e, t, R.extend({schema: W}, n))
                    }

                    function Y(e, t) {
                        return U(e, R.extend({schema: W}, t))
                    }

                    for (var R = e("./common"), B = e("./exception"), P = e("./mark"), W = e("./schema/default_safe"), K = e("./schema/default_full"), $ = Object.prototype.hasOwnProperty, H = 1, G = 2, V = 3, Z = 4, z = 1, J = 2, Q = 3, X = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, ee = /[\x85\u2028\u2029]/, te = /[,\[\]\{\}]/, ne = /^(?:!|!!|![a-z\-]+!)$/i, ie = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i, re = new Array(256), oe = new Array(256), ae = 0; 256 > ae; ae++)re[ae] = l(ae) ? 1 : 0, oe[ae] = l(ae);
                    var se = {
                        YAML: function (e, t, n) {
                            var i, r, o;
                            null !== e.version && h(e, "duplication of %YAML directive"), 1 !== n.length && h(e, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), null === i && h(e, "ill-formed argument of the YAML directive"), r = parseInt(i[1], 10), o = parseInt(i[2], 10), 1 !== r && h(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = 2 > o, 1 !== o && 2 !== o && m(e, "unsupported YAML version of the document")
                        }, TAG: function (e, t, n) {
                            var i, r;
                            2 !== n.length && h(e, "TAG directive accepts exactly two arguments"), i = n[0], r = n[1], ne.test(i) || h(e, "ill-formed tag handle (first argument) of the TAG directive"), $.call(e.tagMap, i) && h(e, 'there is a previously declared suffix for "' + i + '" tag handle'), ie.test(r) || h(e, "ill-formed tag prefix (second argument) of the TAG directive"), e.tagMap[i] = r
                        }
                    };
                    t.exports.loadAll = D, t.exports.load = U, t.exports.safeLoadAll = q, t.exports.safeLoad = Y
                }, {"./common": 2, "./exception": 4, "./mark": 6, "./schema/default_full": 9, "./schema/default_safe": 10}],
                6: [function (e, t, n) {
                    "use strict";
                    function i(e, t, n, i, r) {
                        this.name = e, this.buffer = t, this.position = n, this.line = i, this.column = r
                    }

                    var r = e("./common");
                    i.prototype.getSnippet = function (e, t) {
                        var n, i, o, a, s;
                        if (!this.buffer)return null;
                        for (e = e || 4, t = t || 75, n = "", i = this.position; i > 0 && -1 === "\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(i - 1));)if (i -= 1, this.position - i > t / 2 - 1) {
                            n = " ... ", i += 5;
                            break
                        }
                        for (o = "", a = this.position; a < this.buffer.length && -1 === "\x00\r\n\u2028\u2029".indexOf(this.buffer.charAt(a));)if (a += 1, a - this.position > t / 2 - 1) {
                            o = " ... ", a -= 5;
                            break
                        }
                        return s = this.buffer.slice(i, a), r.repeat(" ", e) + n + s + o + "\n" + r.repeat(" ", e + this.position - i + n.length) + "^"
                    }, i.prototype.toString = function (e) {
                        var t, n = "";
                        return this.name && (n += 'in "' + this.name + '" '), n += "at line " + (this.line + 1) + ", column " + (this.column + 1), e || (t = this.getSnippet(), t && (n += ":\n" + t)), n
                    }, t.exports = i
                }, {"./common": 2}],
                7: [function (e, t, n) {
                    "use strict";
                    function i(e, t, n) {
                        var r = [];
                        return e.include.forEach(function (e) {
                            n = i(e, t, n)
                        }), e[t].forEach(function (e) {
                            n.forEach(function (t, n) {
                                t.tag === e.tag && r.push(n)
                            }), n.push(e)
                        }), n.filter(function (e, t) {
                            return -1 === r.indexOf(t)
                        })
                    }

                    function r() {
                        function e(e) {
                            i[e.tag] = e
                        }

                        var t, n, i = {};
                        for (t = 0, n = arguments.length; n > t; t += 1)arguments[t].forEach(e);
                        return i
                    }

                    function o(e) {
                        this.include = e.include || [], this.implicit = e.implicit || [], this.explicit = e.explicit || [], this.implicit.forEach(function (e) {
                            if (e.loadKind && "scalar" !== e.loadKind)throw new s("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")
                        }), this.compiledImplicit = i(this, "implicit", []), this.compiledExplicit = i(this, "explicit", []), this.compiledTypeMap = r(this.compiledImplicit, this.compiledExplicit)
                    }

                    var a = e("./common"), s = e("./exception"), c = e("./type");
                    o.DEFAULT = null, o.create = function () {
                        var e, t;
                        switch (arguments.length) {
                            case 1:
                                e = o.DEFAULT, t = arguments[0];
                                break;
                            case 2:
                                e = arguments[0], t = arguments[1];
                                break;
                            default:
                                throw new s("Wrong number of arguments for Schema.create function")
                        }
                        if (e = a.toArray(e), t = a.toArray(t), !e.every(function (e) {
                                return e instanceof o
                            }))throw new s("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");
                        if (!t.every(function (e) {
                                return e instanceof c
                            }))throw new s("Specified list of YAML types (or a single Type object) contains a non-Type object.");
                        return new o({include: e, explicit: t})
                    }, t.exports = o
                }, {"./common": 2, "./exception": 4, "./type": 13}],
                8: [function (e, t, n) {
                    "use strict";
                    var i = e("../schema");
                    t.exports = new i({include: [e("./json")]})
                }, {"../schema": 7, "./json": 12}],
                9: [function (e, t, n) {
                    "use strict";
                    var i = e("../schema");
                    t.exports = i.DEFAULT = new i({
                        include: [e("./default_safe")],
                        explicit: [e("../type/js/undefined"), e("../type/js/regexp"), e("../type/js/function")]
                    })
                }, {
                    "../schema": 7,
                    "../type/js/function": 18,
                    "../type/js/regexp": 19,
                    "../type/js/undefined": 20,
                    "./default_safe": 10
                }],
                10: [function (e, t, n) {
                    "use strict";
                    var i = e("../schema");
                    t.exports = new i({
                        include: [e("./core")],
                        implicit: [e("../type/timestamp"), e("../type/merge")],
                        explicit: [e("../type/binary"), e("../type/omap"), e("../type/pairs"), e("../type/set")]
                    })
                }, {
                    "../schema": 7,
                    "../type/binary": 14,
                    "../type/merge": 22,
                    "../type/omap": 24,
                    "../type/pairs": 25,
                    "../type/set": 27,
                    "../type/timestamp": 29,
                    "./core": 8
                }],
                11: [function (e, t, n) {
                    "use strict";
                    var i = e("../schema");
                    t.exports = new i({explicit: [e("../type/str"), e("../type/seq"), e("../type/map")]})
                }, {"../schema": 7, "../type/map": 21, "../type/seq": 26, "../type/str": 28}],
                12: [function (e, t, n) {
                    "use strict";
                    var i = e("../schema");
                    t.exports = new i({
                        include: [e("./failsafe")],
                        implicit: [e("../type/null"), e("../type/bool"), e("../type/int"), e("../type/float")]
                    })
                }, {
                    "../schema": 7,
                    "../type/bool": 15,
                    "../type/float": 16,
                    "../type/int": 17,
                    "../type/null": 23,
                    "./failsafe": 11
                }],
                13: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        var t = {};
                        return null !== e && Object.keys(e).forEach(function (n) {
                            e[n].forEach(function (e) {
                                t[String(e)] = n
                            })
                        }), t
                    }

                    function r(e, t) {
                        if (t = t || {}, Object.keys(t).forEach(function (t) {
                                if (-1 === a.indexOf(t))throw new o('Unknown option "' + t + '" is met in definition of "' + e + '" YAML type.')
                            }), this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function () {
                                    return !0
                                }, this.construct = t.construct || function (e) {
                                    return e
                                }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.defaultStyle = t.defaultStyle || null, this.styleAliases = i(t.styleAliases || null), -1 === s.indexOf(this.kind))throw new o('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.')
                    }

                    var o = e("./exception"), a = ["kind", "resolve", "construct", "instanceOf", "predicate", "represent", "defaultStyle", "styleAliases"], s = ["scalar", "sequence", "mapping"];
                    t.exports = r
                }, {"./exception": 4}],
                14: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !1;
                        var t, n, i = 0, r = e.length, o = p;
                        for (n = 0; r > n; n++)if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
                            if (0 > t)return !1;
                            i += 6
                        }
                        return i % 8 === 0
                    }

                    function r(e) {
                        var t, n, i = e.replace(/[\r\n=]/g, ""), r = i.length, o = p, a = 0, c = [];
                        for (t = 0; r > t; t++)t % 4 === 0 && t && (c.push(a >> 16 & 255), c.push(a >> 8 & 255), c.push(255 & a)), a = a << 6 | o.indexOf(i.charAt(t));
                        return n = r % 4 * 6, 0 === n ? (c.push(a >> 16 & 255), c.push(a >> 8 & 255), c.push(255 & a)) : 18 === n ? (c.push(a >> 10 & 255), c.push(a >> 2 & 255)) : 12 === n && c.push(a >> 4 & 255), s ? new s(c) : c
                    }

                    function o(e) {
                        var t, n, i = "", r = 0, o = e.length, a = p;
                        for (t = 0; o > t; t++)t % 3 === 0 && t && (i += a[r >> 18 & 63], i += a[r >> 12 & 63], i += a[r >> 6 & 63], i += a[63 & r]), r = (r << 8) + e[t];
                        return n = o % 3, 0 === n ? (i += a[r >> 18 & 63], i += a[r >> 12 & 63], i += a[r >> 6 & 63], i += a[63 & r]) : 2 === n ? (i += a[r >> 10 & 63], i += a[r >> 4 & 63], i += a[r << 2 & 63], i += a[64]) : 1 === n && (i += a[r >> 2 & 63], i += a[r << 4 & 63], i += a[64], i += a[64]), i
                    }

                    function a(e) {
                        return s && s.isBuffer(e)
                    }

                    var s;
                    try {
                        var c = e;
                        s = c("buffer").Buffer;
                    } catch (u) {
                    }
                    var l = e("../type"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
                    t.exports = new l("tag:yaml.org,2002:binary", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: a,
                        represent: o
                    })
                }, {"../type": 13}],
                15: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !1;
                        var t = e.length;
                        return 4 === t && ("true" === e || "True" === e || "TRUE" === e) || 5 === t && ("false" === e || "False" === e || "FALSE" === e)
                    }

                    function r(e) {
                        return "true" === e || "True" === e || "TRUE" === e
                    }

                    function o(e) {
                        return "[object Boolean]" === Object.prototype.toString.call(e)
                    }

                    var a = e("../type");
                    t.exports = new a("tag:yaml.org,2002:bool", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: o,
                        represent: {
                            lowercase: function (e) {
                                return e ? "true" : "false"
                            }, uppercase: function (e) {
                                return e ? "TRUE" : "FALSE"
                            }, camelcase: function (e) {
                                return e ? "True" : "False"
                            }
                        },
                        defaultStyle: "lowercase"
                    })
                }, {"../type": 13}],
                16: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return null === e ? !1 : !!u.test(e)
                    }

                    function r(e) {
                        var t, n, i, r;
                        return t = e.replace(/_/g, "").toLowerCase(), n = "-" === t[0] ? -1 : 1, r = [], "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), ".inf" === t ? 1 === n ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : ".nan" === t ? NaN : t.indexOf(":") >= 0 ? (t.split(":").forEach(function (e) {
                            r.unshift(parseFloat(e, 10))
                        }), t = 0, i = 1, r.forEach(function (e) {
                            t += e * i, i *= 60
                        }), n * t) : n * parseFloat(t, 10)
                    }

                    function o(e, t) {
                        var n;
                        if (isNaN(e))switch (t) {
                            case"lowercase":
                                return ".nan";
                            case"uppercase":
                                return ".NAN";
                            case"camelcase":
                                return ".NaN"
                        } else if (Number.POSITIVE_INFINITY === e)switch (t) {
                            case"lowercase":
                                return ".inf";
                            case"uppercase":
                                return ".INF";
                            case"camelcase":
                                return ".Inf"
                        } else if (Number.NEGATIVE_INFINITY === e)switch (t) {
                            case"lowercase":
                                return "-.inf";
                            case"uppercase":
                                return "-.INF";
                            case"camelcase":
                                return "-.Inf"
                        } else if (s.isNegativeZero(e))return "-0.0";
                        return n = e.toString(10), l.test(n) ? n.replace("e", ".e") : n
                    }

                    function a(e) {
                        return "[object Number]" === Object.prototype.toString.call(e) && (e % 1 !== 0 || s.isNegativeZero(e))
                    }

                    var s = e("../common"), c = e("../type"), u = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?|\\.[0-9_]+(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), l = /^[-+]?[0-9]+e/;
                    t.exports = new c("tag:yaml.org,2002:float", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: a,
                        represent: o,
                        defaultStyle: "lowercase"
                    })
                }, {"../common": 2, "../type": 13}],
                17: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return e >= 48 && 57 >= e || e >= 65 && 70 >= e || e >= 97 && 102 >= e
                    }

                    function r(e) {
                        return e >= 48 && 55 >= e
                    }

                    function o(e) {
                        return e >= 48 && 57 >= e
                    }

                    function a(e) {
                        if (null === e)return !1;
                        var t, n = e.length, a = 0, s = !1;
                        if (!n)return !1;
                        if (t = e[a], "-" !== t && "+" !== t || (t = e[++a]), "0" === t) {
                            if (a + 1 === n)return !0;
                            if (t = e[++a], "b" === t) {
                                for (a++; n > a; a++)if (t = e[a], "_" !== t) {
                                    if ("0" !== t && "1" !== t)return !1;
                                    s = !0
                                }
                                return s
                            }
                            if ("x" === t) {
                                for (a++; n > a; a++)if (t = e[a], "_" !== t) {
                                    if (!i(e.charCodeAt(a)))return !1;
                                    s = !0
                                }
                                return s
                            }
                            for (; n > a; a++)if (t = e[a], "_" !== t) {
                                if (!r(e.charCodeAt(a)))return !1;
                                s = !0
                            }
                            return s
                        }
                        for (; n > a; a++)if (t = e[a], "_" !== t) {
                            if (":" === t)break;
                            if (!o(e.charCodeAt(a)))return !1;
                            s = !0
                        }
                        return s ? ":" !== t ? !0 : /^(:[0-5]?[0-9])+$/.test(e.slice(a)) : !1
                    }

                    function s(e) {
                        var t, n, i = e, r = 1, o = [];
                        return -1 !== i.indexOf("_") && (i = i.replace(/_/g, "")), t = i[0], "-" !== t && "+" !== t || ("-" === t && (r = -1), i = i.slice(1), t = i[0]), "0" === i ? 0 : "0" === t ? "b" === i[1] ? r * parseInt(i.slice(2), 2) : "x" === i[1] ? r * parseInt(i, 16) : r * parseInt(i, 8) : -1 !== i.indexOf(":") ? (i.split(":").forEach(function (e) {
                            o.unshift(parseInt(e, 10))
                        }), i = 0, n = 1, o.forEach(function (e) {
                            i += e * n, n *= 60
                        }), r * i) : r * parseInt(i, 10)
                    }

                    function c(e) {
                        return "[object Number]" === Object.prototype.toString.call(e) && e % 1 === 0 && !u.isNegativeZero(e)
                    }

                    var u = e("../common"), l = e("../type");
                    t.exports = new l("tag:yaml.org,2002:int", {
                        kind: "scalar",
                        resolve: a,
                        construct: s,
                        predicate: c,
                        represent: {
                            binary: function (e) {
                                return "0b" + e.toString(2)
                            }, octal: function (e) {
                                return "0" + e.toString(8)
                            }, decimal: function (e) {
                                return e.toString(10)
                            }, hexadecimal: function (e) {
                                return "0x" + e.toString(16).toUpperCase()
                            }
                        },
                        defaultStyle: "decimal",
                        styleAliases: {
                            binary: [2, "bin"],
                            octal: [8, "oct"],
                            decimal: [10, "dec"],
                            hexadecimal: [16, "hex"]
                        }
                    })
                }, {"../common": 2, "../type": 13}],
                18: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !1;
                        try {
                            var t = "(" + e + ")", n = s.parse(t, {range: !0});
                            return "Program" === n.type && 1 === n.body.length && "ExpressionStatement" === n.body[0].type && "FunctionExpression" === n.body[0].expression.type
                        } catch (i) {
                            return !1
                        }
                    }

                    function r(e) {
                        var t, n = "(" + e + ")", i = s.parse(n, {range: !0}), r = [];
                        if ("Program" !== i.type || 1 !== i.body.length || "ExpressionStatement" !== i.body[0].type || "FunctionExpression" !== i.body[0].expression.type)throw new Error("Failed to resolve function");
                        return i.body[0].expression.params.forEach(function (e) {
                            r.push(e.name)
                        }), t = i.body[0].expression.body.range, new Function(r, n.slice(t[0] + 1, t[1] - 1))
                    }

                    function o(e) {
                        return e.toString()
                    }

                    function a(e) {
                        return "[object Function]" === Object.prototype.toString.call(e)
                    }

                    var s;
                    try {
                        var c = e;
                        s = c("esprima")
                    } catch (u) {
                        "undefined" != typeof window && (s = window.esprima)
                    }
                    var l = e("../../type");
                    t.exports = new l("tag:yaml.org,2002:js/function", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: a,
                        represent: o
                    })
                }, {"../../type": 13}],
                19: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !1;
                        if (0 === e.length)return !1;
                        var t = e, n = /\/([gim]*)$/.exec(e), i = "";
                        if ("/" === t[0]) {
                            if (n && (i = n[1]), i.length > 3)return !1;
                            if ("/" !== t[t.length - i.length - 1])return !1
                        }
                        return !0
                    }

                    function r(e) {
                        var t = e, n = /\/([gim]*)$/.exec(e), i = "";
                        return "/" === t[0] && (n && (i = n[1]), t = t.slice(1, t.length - i.length - 1)), new RegExp(t, i)
                    }

                    function o(e) {
                        var t = "/" + e.source + "/";
                        return e.global && (t += "g"), e.multiline && (t += "m"), e.ignoreCase && (t += "i"), t
                    }

                    function a(e) {
                        return "[object RegExp]" === Object.prototype.toString.call(e)
                    }

                    var s = e("../../type");
                    t.exports = new s("tag:yaml.org,2002:js/regexp", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: a,
                        represent: o
                    })
                }, {"../../type": 13}],
                20: [function (e, t, n) {
                    "use strict";
                    function i() {
                        return !0
                    }

                    function r() {
                    }

                    function o() {
                        return ""
                    }

                    function a(e) {
                        return "undefined" == typeof e
                    }

                    var s = e("../../type");
                    t.exports = new s("tag:yaml.org,2002:js/undefined", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: a,
                        represent: o
                    })
                }, {"../../type": 13}],
                21: [function (e, t, n) {
                    "use strict";
                    var i = e("../type");
                    t.exports = new i("tag:yaml.org,2002:map", {
                        kind: "mapping", construct: function (e) {
                            return null !== e ? e : {}
                        }
                    })
                }, {"../type": 13}],
                22: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return "<<" === e || null === e
                    }

                    var r = e("../type");
                    t.exports = new r("tag:yaml.org,2002:merge", {kind: "scalar", resolve: i})
                }, {"../type": 13}],
                23: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !0;
                        var t = e.length;
                        return 1 === t && "~" === e || 4 === t && ("null" === e || "Null" === e || "NULL" === e)
                    }

                    function r() {
                        return null
                    }

                    function o(e) {
                        return null === e
                    }

                    var a = e("../type");
                    t.exports = new a("tag:yaml.org,2002:null", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        predicate: o,
                        represent: {
                            canonical: function () {
                                return "~"
                            }, lowercase: function () {
                                return "null"
                            }, uppercase: function () {
                                return "NULL"
                            }, camelcase: function () {
                                return "Null"
                            }
                        },
                        defaultStyle: "lowercase"
                    })
                }, {"../type": 13}],
                24: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !0;
                        var t, n, i, r, o, c = [], u = e;
                        for (t = 0, n = u.length; n > t; t += 1) {
                            if (i = u[t], o = !1, "[object Object]" !== s.call(i))return !1;
                            for (r in i)if (a.call(i, r)) {
                                if (o)return !1;
                                o = !0
                            }
                            if (!o)return !1;
                            if (-1 !== c.indexOf(r))return !1;
                            c.push(r)
                        }
                        return !0
                    }

                    function r(e) {
                        return null !== e ? e : []
                    }

                    var o = e("../type"), a = Object.prototype.hasOwnProperty, s = Object.prototype.toString;
                    t.exports = new o("tag:yaml.org,2002:omap", {kind: "sequence", resolve: i, construct: r})
                }, {"../type": 13}],
                25: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !0;
                        var t, n, i, r, o, s = e;
                        for (o = new Array(s.length), t = 0, n = s.length; n > t; t += 1) {
                            if (i = s[t], "[object Object]" !== a.call(i))return !1;
                            if (r = Object.keys(i), 1 !== r.length)return !1;
                            o[t] = [r[0], i[r[0]]]
                        }
                        return !0
                    }

                    function r(e) {
                        if (null === e)return [];
                        var t, n, i, r, o, a = e;
                        for (o = new Array(a.length), t = 0, n = a.length; n > t; t += 1)i = a[t], r = Object.keys(i), o[t] = [r[0], i[r[0]]];
                        return o
                    }

                    var o = e("../type"), a = Object.prototype.toString;
                    t.exports = new o("tag:yaml.org,2002:pairs", {kind: "sequence", resolve: i, construct: r})
                }, {"../type": 13}],
                26: [function (e, t, n) {
                    "use strict";
                    var i = e("../type");
                    t.exports = new i("tag:yaml.org,2002:seq", {
                        kind: "sequence", construct: function (e) {
                            return null !== e ? e : []
                        }
                    })
                }, {"../type": 13}],
                27: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        if (null === e)return !0;
                        var t, n = e;
                        for (t in n)if (a.call(n, t) && null !== n[t])return !1;
                        return !0
                    }

                    function r(e) {
                        return null !== e ? e : {}
                    }

                    var o = e("../type"), a = Object.prototype.hasOwnProperty;
                    t.exports = new o("tag:yaml.org,2002:set", {kind: "mapping", resolve: i, construct: r})
                }, {"../type": 13}],
                28: [function (e, t, n) {
                    "use strict";
                    var i = e("../type");
                    t.exports = new i("tag:yaml.org,2002:str", {
                        kind: "scalar", construct: function (e) {
                            return null !== e ? e : ""
                        }
                    })
                }, {"../type": 13}],
                29: [function (e, t, n) {
                    "use strict";
                    function i(e) {
                        return null === e ? !1 : null !== s.exec(e) ? !0 : null !== c.exec(e)
                    }

                    function r(e) {
                        var t, n, i, r, o, a, u, l, p, f, d = 0, h = null;
                        if (t = s.exec(e), null === t && (t = c.exec(e)), null === t)throw new Error("Date resolve error");
                        if (n = +t[1], i = +t[2] - 1, r = +t[3], !t[4])return new Date(Date.UTC(n, i, r));
                        if (o = +t[4], a = +t[5], u = +t[6], t[7]) {
                            for (d = t[7].slice(0, 3); d.length < 3;)d += "0";
                            d = +d
                        }
                        return t[9] && (l = +t[10], p = +(t[11] || 0), h = 6e4 * (60 * l + p), "-" === t[9] && (h = -h)), f = new Date(Date.UTC(n, i, r, o, a, u, d)), h && f.setTime(f.getTime() - h), f
                    }

                    function o(e) {
                        return e.toISOString()
                    }

                    var a = e("../type"), s = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), c = new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
                    t.exports = new a("tag:yaml.org,2002:timestamp", {
                        kind: "scalar",
                        resolve: i,
                        construct: r,
                        instanceOf: Date,
                        represent: o
                    })
                }, {"../type": 13}],
                "/": [function (e, t, n) {
                    "use strict";
                    var i = e("./lib/js-yaml.js");
                    t.exports = i
                }, {"./lib/js-yaml.js": 1}]
            }, {}, [])("/")
        });
    }
}
setTimeout(function(){
    placeCarousel();
}, 100);

// GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
//Reasonnde
ga('create', 'UA-78419842-1', 'auto', rsnd);
ga('rsnd.send', 'pageview');
//EMA
ga('create', 'UA-78308447-1', 'auto');
ga('send', 'pageview');
