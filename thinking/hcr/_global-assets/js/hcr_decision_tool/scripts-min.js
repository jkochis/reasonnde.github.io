! function() {
    function a(a, b) {
        b.src ? n.ajax({
            url: b.src,
            async: !1,
            dataType: "script"
        }) : n.globalEval(b.text || b.textContent || b.innerHTML || ""), b.parentNode && b.parentNode.removeChild(b)
    }

    function b() {
        return +new Date
    }

    function c(a, b) {
        return a[0] && parseInt(n.curCSS(a[0], b, !0), 10) || 0
    }

    function d() {
        return !1
    }

    function e() {
        return !0
    }

    function f(a) {
        var b = RegExp("(^|\\.)" + a.type + "(\\.|$)"),
            c = !0,
            d = [];
        return n.each(n.data(this, "events").live || [], function(c, e) {
            if (b.test(e.type)) {
                var f = n(a.target).closest(e.data)[0];
                f && d.push({
                    elem: f,
                    fn: e
                })
            }
        }), d.sort(function(a, b) {
            return n.data(a.elem, "closest") - n.data(b.elem, "closest")
        }), n.each(d, function() {
            return this.fn.call(this.elem, a, this.fn.data) === !1 ? c = !1 : void 0
        }), c
    }

    function g(a, b) {
        return ["live", a, b.replace(/\./g, "`").replace(/ /g, "|")].join(".")
    }

    function h() {
        y || (y = !0, document.addEventListener ? document.addEventListener("DOMContentLoaded", function() {
            document.removeEventListener("DOMContentLoaded", arguments.callee, !1), n.ready()
        }, !1) : document.attachEvent && (document.attachEvent("onreadystatechange", function() {
            "complete" === document.readyState && (document.detachEvent("onreadystatechange", arguments.callee), n.ready())
        }), document.documentElement.doScroll && k == k.top && ! function() {
            if (!n.isReady) {
                try {
                    document.documentElement.doScroll("left")
                } catch (a) {
                    return void setTimeout(arguments.callee, 0)
                }
                n.ready()
            }
        }()), n.event.add(k, "load", n.ready))
    }

    function i(a, b) {
        var c = {};
        return n.each(D.concat.apply([], D.slice(0, b)), function() {
            c[this] = a
        }), c
    }
    var j, k = this,
        l = k.jQuery,
        m = k.$,
        n = k.jQuery = k.$ = function(a, b) {
            return new n.fn.init(a, b)
        },
        o = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
        p = /^.[^:#\[\.,]*$/;
    n.fn = n.prototype = {
        init: function(a, b) {
            if (a = a || document, a.nodeType) return this[0] = a, this.length = 1, this.context = a, this;
            if ("string" == typeof a) {
                var c = o.exec(a);
                if (!c || !c[1] && b) return n(b).find(a);
                if (!c[1]) {
                    var d = document.getElementById(c[3]);
                    if (d && d.id != c[3]) return n().find(a);
                    var e = n(d || []);
                    return e.context = document, e.selector = a, e
                }
                a = n.clean([c[1]], b)
            } else if (n.isFunction(a)) return n(document).ready(a);
            return a.selector && a.context && (this.selector = a.selector, this.context = a.context), this.setArray(n.isArray(a) ? a : n.makeArray(a))
        },
        selector: "",
        jquery: "1.3.2",
        size: function() {
            return this.length
        },
        get: function(a) {
            return a === j ? Array.prototype.slice.call(this) : this[a]
        },
        pushStack: function(a, b, c) {
            var d = n(a);
            return d.prevObject = this, d.context = this.context, "find" === b ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")"), d
        },
        setArray: function(a) {
            return this.length = 0, Array.prototype.push.apply(this, a), this
        },
        each: function(a, b) {
            return n.each(this, a, b)
        },
        index: function(a) {
            return n.inArray(a && a.jquery ? a[0] : a, this)
        },
        attr: function(a, b, c) {
            var d = a;
            if ("string" == typeof a) {
                if (b === j) return this[0] && n[c || "attr"](this[0], a);
                d = {}, d[a] = b
            }
            return this.each(function(b) {
                for (a in d) n.attr(c ? this.style : this, a, n.prop(this, d[a], c, b, a))
            })
        },
        css: function(a, b) {
            return ("width" == a || "height" == a) && parseFloat(b) < 0 && (b = j), this.attr(a, b, "curCSS")
        },
        text: function(a) {
            if ("object" != typeof a && null != a) return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(a));
            var b = "";
            return n.each(a || this, function() {
                n.each(this.childNodes, function() {
                    8 != this.nodeType && (b += 1 != this.nodeType ? this.nodeValue : n.fn.text([this]))
                })
            }), b
        },
        wrapAll: function(a) {
            if (this[0]) {
                var b = n(a, this[0].ownerDocument).clone();
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    for (var a = this; a.firstChild;) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return this.each(function() {
                n(this).contents().wrapAll(a)
            })
        },
        wrap: function(a) {
            return this.each(function() {
                n(this).wrapAll(a)
            })
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                1 == this.nodeType && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                1 == this.nodeType && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        end: function() {
            return this.prevObject || n([])
        },
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        find: function(a) {
            if (1 === this.length) {
                var b = this.pushStack([], "find", a);
                return b.length = 0, n.find(a, this[0], b), b
            }
            return this.pushStack(n.unique(n.map(this, function(b) {
                return n.find(a, b)
            })), "find", a)
        },
        clone: function(a) {
            var b = this.map(function() {
                if (n.support.noCloneEvent || n.isXMLDoc(this)) return this.cloneNode(!0);
                var a = this.outerHTML;
                if (!a) {
                    var b = this.ownerDocument.createElement("div");
                    b.appendChild(this.cloneNode(!0)), a = b.innerHTML
                }
                return n.clean([a.replace(/ jQuery\d+="(?:\d+|null)"/g, "").replace(/^\s*/, "")])[0]
            });
            if (a === !0) {
                var c = this.find("*").andSelf(),
                    d = 0;
                b.find("*").andSelf().each(function() {
                    if (this.nodeName === c[d].nodeName) {
                        var a = n.data(c[d], "events");
                        for (var b in a)
                            for (var e in a[b]) n.event.add(this, b, a[b][e], a[b][e].data);
                        d++
                    }
                })
            }
            return b
        },
        filter: function(a) {
            return this.pushStack(n.isFunction(a) && n.grep(this, function(b, c) {
                return a.call(b, c)
            }) || n.multiFilter(a, n.grep(this, function(a) {
                return 1 === a.nodeType
            })), "filter", a)
        },
        closest: function(a) {
            var b = n.expr.match.POS.test(a) ? n(a) : null,
                c = 0;
            return this.map(function() {
                for (var d = this; d && d.ownerDocument;) {
                    if (b ? b.index(d) > -1 : n(d).is(a)) return n.data(d, "closest", c), d;
                    d = d.parentNode, c++
                }
            })
        },
        not: function(a) {
            if ("string" == typeof a) {
                if (p.test(a)) return this.pushStack(n.multiFilter(a, this, !0), "not", a);
                a = n.multiFilter(a, this)
            }
            var b = a.length && a[a.length - 1] !== j && !a.nodeType;
            return this.filter(function() {
                return b ? n.inArray(this, a) < 0 : this != a
            })
        },
        add: function(a) {
            return this.pushStack(n.unique(n.merge(this.get(), "string" == typeof a ? n(a) : n.makeArray(a))))
        },
        is: function(a) {
            return !!a && n.multiFilter(a, this).length > 0
        },
        hasClass: function(a) {
            return !!a && this.is("." + a)
        },
        val: function(a) {
            if (a === j) {
                var b = this[0];
                if (b) {
                    if (n.nodeName(b, "option")) return (b.attributes.value || {}).specified ? b.value : b.text;
                    if (n.nodeName(b, "select")) {
                        var c = b.selectedIndex,
                            d = [],
                            e = b.options,
                            f = "select-one" == b.type;
                        if (0 > c) return null;
                        for (var g = f ? c : 0, h = f ? c + 1 : e.length; h > g; g++) {
                            var i = e[g];
                            if (i.selected) {
                                if (a = n(i).val(), f) return a;
                                d.push(a)
                            }
                        }
                        return d
                    }
                    return (b.value || "").replace(/\r/g, "")
                }
                return j
            }
            return "number" == typeof a && (a += ""), this.each(function() {
                if (1 == this.nodeType)
                    if (n.isArray(a) && /radio|checkbox/.test(this.type)) this.checked = n.inArray(this.value, a) >= 0 || n.inArray(this.name, a) >= 0;
                    else if (n.nodeName(this, "select")) {
                    var b = n.makeArray(a);
                    n("option", this).each(function() {
                        this.selected = n.inArray(this.value, b) >= 0 || n.inArray(this.text, b) >= 0
                    }), b.length || (this.selectedIndex = -1)
                } else this.value = a
            })
        },
        html: function(a) {
            return a === j ? this[0] ? this[0].innerHTML.replace(/ jQuery\d+="(?:\d+|null)"/g, "") : null : this.empty().append(a)
        },
        replaceWith: function(a) {
            return this.after(a).remove()
        },
        eq: function(a) {
            return this.slice(a, +a + 1)
        },
        slice: function() {
            return this.pushStack(Array.prototype.slice.apply(this, arguments), "slice", Array.prototype.slice.call(arguments).join(","))
        },
        map: function(a) {
            return this.pushStack(n.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        },
        domManip: function(b, c, d) {
            function e(a, b) {
                return c && n.nodeName(a, "table") && n.nodeName(b, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
            }
            if (this[0]) {
                var f = (this[0].ownerDocument || this[0]).createDocumentFragment(),
                    g = n.clean(b, this[0].ownerDocument || this[0], f),
                    h = f.firstChild;
                if (h)
                    for (var i = 0, j = this.length; j > i; i++) d.call(e(this[i], h), this.length > 1 || i > 0 ? f.cloneNode(!0) : f);
                g && n.each(g, a)
            }
            return this
        }
    }, n.fn.init.prototype = n.fn, n.extend = n.fn.extend = function() {
        var a, b = arguments[0] || {},
            c = 1,
            d = arguments.length,
            e = !1;
        for ("boolean" == typeof b && (e = b, b = arguments[1] || {}, c = 2), "object" == typeof b || n.isFunction(b) || (b = {}), d == c && (b = this, --c); d > c; c++)
            if (null != (a = arguments[c]))
                for (var f in a) {
                    var g = b[f],
                        h = a[f];
                    b !== h && (e && h && "object" == typeof h && !h.nodeType ? b[f] = n.extend(e, g || (null != h.length ? [] : {}), h) : h !== j && (b[f] = h))
                }
            return b
    };
    var q = /z-?index|font-?weight|opacity|zoom|line-?height/i,
        r = document.defaultView || {},
        s = Object.prototype.toString;
    n.extend({
        noConflict: function(a) {
            return k.$ = m, a && (k.jQuery = l), n
        },
        isFunction: function(a) {
            return "[object Function]" === s.call(a)
        },
        isArray: function(a) {
            return "[object Array]" === s.call(a)
        },
        isXMLDoc: function(a) {
            return 9 === a.nodeType && "HTML" !== a.documentElement.nodeName || !!a.ownerDocument && n.isXMLDoc(a.ownerDocument)
        },
        globalEval: function(a) {
            if (a && /\S/.test(a)) {
                var b = document.getElementsByTagName("head")[0] || document.documentElement,
                    c = document.createElement("script");
                c.type = "text/javascript", n.support.scriptEval ? c.appendChild(document.createTextNode(a)) : c.text = a, b.insertBefore(c, b.firstChild), b.removeChild(c)
            }
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toUpperCase() == b.toUpperCase()
        },
        each: function(a, b, c) {
            var d, e = 0,
                f = a.length;
            if (c)
                if (f === j) {
                    for (d in a)
                        if (b.apply(a[d], c) === !1) break
                } else
                    for (; f > e && b.apply(a[e++], c) !== !1;);
            else if (f === j) {
                for (d in a)
                    if (b.call(a[d], d, a[d]) === !1) break
            } else
                for (var g = a[0]; f > e && b.call(g, e, g) !== !1; g = a[++e]);
            return a
        },
        prop: function(a, b, c, d, e) {
            return n.isFunction(b) && (b = b.call(a, d)), "number" != typeof b || "curCSS" != c || q.test(e) ? b : b + "px"
        },
        className: {
            add: function(a, b) {
                n.each((b || "").split(/\s+/), function(b, c) {
                    1 != a.nodeType || n.className.has(a.className, c) || (a.className += (a.className ? " " : "") + c)
                })
            },
            remove: function(a, b) {
                1 == a.nodeType && (a.className = b !== j ? n.grep(a.className.split(/\s+/), function(a) {
                    return !n.className.has(b, a)
                }).join(" ") : "")
            },
            has: function(a, b) {
                return a && n.inArray(b, (a.className || a).toString().split(/\s+/)) > -1
            }
        },
        swap: function(a, b, c) {
            var d = {};
            for (var e in b) d[e] = a.style[e], a.style[e] = b[e];
            c.call(a);
            for (var e in b) a.style[e] = d[e]
        },
        css: function(a, b, c, d) {
            function e() {
                f = "width" == b ? a.offsetWidth : a.offsetHeight, "border" !== d && n.each(h, function() {
                    d || (f -= parseFloat(n.curCSS(a, "padding" + this, !0)) || 0), "margin" === d ? f += parseFloat(n.curCSS(a, "margin" + this, !0)) || 0 : f -= parseFloat(n.curCSS(a, "border" + this + "Width", !0)) || 0
                })
            }
            if ("width" == b || "height" == b) {
                var f, g = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    h = "width" == b ? ["Left", "Right"] : ["Top", "Bottom"];
                return 0 !== a.offsetWidth ? e() : n.swap(a, g, e), Math.max(0, Math.round(f))
            }
            return n.curCSS(a, b, c)
        },
        curCSS: function(a, b, c) {
            var d, e = a.style;
            if ("opacity" == b && !n.support.opacity) return d = n.attr(e, "opacity"), "" == d ? "1" : d;
            if (b.match(/float/i) && (b = z), !c && e && e[b]) d = e[b];
            else if (r.getComputedStyle) {
                b.match(/float/i) && (b = "float"), b = b.replace(/([A-Z])/g, "-$1").toLowerCase();
                var f = r.getComputedStyle(a, null);
                f && (d = f.getPropertyValue(b)), "opacity" == b && "" == d && (d = "1")
            } else if (a.currentStyle) {
                var g = b.replace(/\-(\w)/g, function(a, b) {
                    return b.toUpperCase()
                });
                if (d = a.currentStyle[b] || a.currentStyle[g], !/^\d+(px)?$/i.test(d) && /^\d/.test(d)) {
                    var h = e.left,
                        i = a.runtimeStyle.left;
                    a.runtimeStyle.left = a.currentStyle.left, e.left = d || 0, d = e.pixelLeft + "px", e.left = h, a.runtimeStyle.left = i
                }
            }
            return d
        },
        clean: function(a, b, c) {
            if (b = b || document, "undefined" == typeof b.createElement && (b = b.ownerDocument || b[0] && b[0].ownerDocument || document), !c && 1 === a.length && "string" == typeof a[0]) {
                var d = /^<(\w+)\s*\/?>$/.exec(a[0]);
                if (d) return [b.createElement(d[1])]
            }
            var e = [],
                f = [],
                g = b.createElement("div");
            if (n.each(a, function(a, c) {
                    if ("number" == typeof c && (c += ""), c) {
                        if ("string" == typeof c) {
                            c = c.replace(/(<(\w+)[^>]*?)\/>/g, function(a, b, c) {
                                return c.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? a : b + "></" + c + ">"
                            });
                            var d = c.replace(/^\s+/, "").substring(0, 10).toLowerCase(),
                                f = !d.indexOf("<opt") && [1, "<select multiple='multiple'>", "</select>"] || !d.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"] || d.match(/^<(thead|tbody|tfoot|colg|cap)/) && [1, "<table>", "</table>"] || !d.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!d.indexOf("<td") || !d.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || !d.indexOf("<col") && [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] || !n.support.htmlSerialize && [1, "div<div>", "</div>"] || [0, "", ""];
                            for (g.innerHTML = f[1] + c + f[2]; f[0]--;) g = g.lastChild;
                            if (!n.support.tbody)
                                for (var h = /<tbody/i.test(c), i = d.indexOf("<table") || h ? "<table>" != f[1] || h ? [] : g.childNodes : g.firstChild && g.firstChild.childNodes, j = i.length - 1; j >= 0; --j) n.nodeName(i[j], "tbody") && !i[j].childNodes.length && i[j].parentNode.removeChild(i[j]);
                            !n.support.leadingWhitespace && /^\s/.test(c) && g.insertBefore(b.createTextNode(c.match(/^\s*/)[0]), g.firstChild), c = n.makeArray(g.childNodes)
                        }
                        c.nodeType ? e.push(c) : e = n.merge(e, c)
                    }
                }), c) {
                for (var h = 0; e[h]; h++) !n.nodeName(e[h], "script") || e[h].type && "text/javascript" !== e[h].type.toLowerCase() ? (1 === e[h].nodeType && e.splice.apply(e, [h + 1, 0].concat(n.makeArray(e[h].getElementsByTagName("script")))), c.appendChild(e[h])) : f.push(e[h].parentNode ? e[h].parentNode.removeChild(e[h]) : e[h]);
                return f
            }
            return e
        },
        attr: function(a, b, c) {
            if (!a || 3 == a.nodeType || 8 == a.nodeType) return j;
            var d = !n.isXMLDoc(a),
                e = c !== j;
            if (b = d && n.props[b] || b, a.tagName) {
                var f = /href|src|style/.test(b);
                if ("selected" == b && a.parentNode && a.parentNode.selectedIndex, b in a && d && !f) {
                    if (e) {
                        if ("type" == b && n.nodeName(a, "input") && a.parentNode) throw "type property can't be changed";
                        a[b] = c
                    }
                    if (n.nodeName(a, "form") && a.getAttributeNode(b)) return a.getAttributeNode(b).nodeValue;
                    if ("tabIndex" == b) {
                        var g = a.getAttributeNode("tabIndex");
                        return g && g.specified ? g.value : a.nodeName.match(/(button|input|object|select|textarea)/i) ? 0 : a.nodeName.match(/^(a|area)$/i) && a.href ? 0 : j
                    }
                    return a[b]
                }
                if (!n.support.style && d && "style" == b) return n.attr(a.style, "cssText", c);
                e && a.setAttribute(b, "" + c);
                var h = !n.support.hrefNormalized && d && f ? a.getAttribute(b, 2) : a.getAttribute(b);
                return null === h ? j : h
            }
            return n.support.opacity || "opacity" != b ? (b = b.replace(/-([a-z])/gi, function(a, b) {
                return b.toUpperCase()
            }), e && (a[b] = c), a[b]) : (e && (a.zoom = 1, a.filter = (a.filter || "").replace(/alpha\([^)]*\)/, "") + (parseInt(c) + "" == "NaN" ? "" : "alpha(opacity=" + 100 * c + ")")), a.filter && a.filter.indexOf("opacity=") >= 0 ? parseFloat(a.filter.match(/opacity=([^)]*)/)[1]) / 100 + "" : "")
        },
        trim: function(a) {
            return (a || "").replace(/^\s+|\s+$/g, "")
        },
        makeArray: function(a) {
            var b = [];
            if (null != a) {
                var c = a.length;
                if (null == c || "string" == typeof a || n.isFunction(a) || a.setInterval) b[0] = a;
                else
                    for (; c;) b[--c] = a[c]
            }
            return b
        },
        inArray: function(a, b) {
            for (var c = 0, d = b.length; d > c; c++)
                if (b[c] === a) return c;
            return -1
        },
        merge: function(a, b) {
            var c, d = 0,
                e = a.length;
            if (n.support.getAll)
                for (; null != (c = b[d++]);) a[e++] = c;
            else
                for (; null != (c = b[d++]);) 8 != c.nodeType && (a[e++] = c);
            return a
        },
        unique: function(a) {
            var b = [],
                c = {};
            try {
                for (var d = 0, e = a.length; e > d; d++) {
                    var f = n.data(a[d]);
                    c[f] || (c[f] = !0, b.push(a[d]))
                }
            } catch (g) {
                b = a
            }
            return b
        },
        grep: function(a, b, c) {
            for (var d = [], e = 0, f = a.length; f > e; e++) !c != !b(a[e], e) && d.push(a[e]);
            return d
        },
        map: function(a, b) {
            for (var c = [], d = 0, e = a.length; e > d; d++) {
                var f = b(a[d], d);
                null != f && (c[c.length] = f)
            }
            return c.concat.apply([], c)
        }
    });
    var t = navigator.userAgent.toLowerCase();
    n.browser = {
        version: (t.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        safari: /webkit/.test(t),
        opera: /opera/.test(t),
        msie: /msie/.test(t) && !/opera/.test(t),
        mozilla: /mozilla/.test(t) && !/(compatible|webkit)/.test(t)
    }, n.each({
        parent: function(a) {
            return a.parentNode
        },
        parents: function(a) {
            return n.dir(a, "parentNode")
        },
        next: function(a) {
            return n.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return n.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return n.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return n.dir(a, "previousSibling")
        },
        siblings: function(a) {
            return n.sibling(a.parentNode.firstChild, a)
        },
        children: function(a) {
            return n.sibling(a.firstChild)
        },
        contents: function(a) {
            return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.makeArray(a.childNodes)
        }
    }, function(a, b) {
        n.fn[a] = function(c) {
            var d = n.map(this, b);
            return c && "string" == typeof c && (d = n.multiFilter(c, d)), this.pushStack(n.unique(d), a, c)
        }
    }), n.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        n.fn[a] = function(c) {
            for (var d = [], e = n(c), f = 0, g = e.length; g > f; f++) {
                var h = (f > 0 ? this.clone(!0) : this).get();
                n.fn[b].apply(n(e[f]), h), d = d.concat(h)
            }
            return this.pushStack(d, a, c)
        }
    }), n.each({
        removeAttr: function(a) {
            n.attr(this, a, ""), 1 == this.nodeType && this.removeAttribute(a)
        },
        addClass: function(a) {
            n.className.add(this, a)
        },
        removeClass: function(a) {
            n.className.remove(this, a)
        },
        toggleClass: function(a, b) {
            "boolean" != typeof b && (b = !n.className.has(this, a)), n.className[b ? "add" : "remove"](this, a)
        },
        remove: function(a) {
            (!a || n.filter(a, [this]).length) && (n("*", this).add([this]).each(function() {
                n.event.remove(this), n.removeData(this)
            }), this.parentNode && this.parentNode.removeChild(this))
        },
        empty: function() {
            for (n(this).children().remove(); this.firstChild;) this.removeChild(this.firstChild)
        }
    }, function(a, b) {
        n.fn[a] = function() {
            return this.each(b, arguments)
        }
    });
    var u = "jQuery" + b(),
        v = 0,
        w = {};
    n.extend({
            cache: {},
            data: function(a, b, c) {
                a = a == k ? w : a;
                var d = a[u];
                return d || (d = a[u] = ++v), b && !n.cache[d] && (n.cache[d] = {}), c !== j && (n.cache[d][b] = c), b ? n.cache[d][b] : d
            },
            removeData: function(a, b) {
                a = a == k ? w : a;
                var c = a[u];
                if (b) {
                    if (n.cache[c]) {
                        delete n.cache[c][b], b = "";
                        for (b in n.cache[c]) break;
                        b || n.removeData(a)
                    }
                } else {
                    try {
                        delete a[u]
                    } catch (d) {
                        a.removeAttribute && a.removeAttribute(u)
                    }
                    delete n.cache[c]
                }
            },
            queue: function(a, b, c) {
                if (a) {
                    b = (b || "fx") + "queue";
                    var d = n.data(a, b);
                    !d || n.isArray(c) ? d = n.data(a, b, n.makeArray(c)) : c && d.push(c)
                }
                return d
            },
            dequeue: function(a, b) {
                var c = n.queue(a, b),
                    d = c.shift();
                b && "fx" !== b || (d = c[0]), d !== j && d.call(a)
            }
        }), n.fn.extend({
            data: function(a, b) {
                var c = a.split(".");
                if (c[1] = c[1] ? "." + c[1] : "", b === j) {
                    var d = this.triggerHandler("getData" + c[1] + "!", [c[0]]);
                    return d === j && this.length && (d = n.data(this[0], a)), d === j && c[1] ? this.data(c[0]) : d
                }
                return this.trigger("setData" + c[1] + "!", [c[0], b]).each(function() {
                    n.data(this, a, b)
                })
            },
            removeData: function(a) {
                return this.each(function() {
                    n.removeData(this, a)
                })
            },
            queue: function(a, b) {
                return "string" != typeof a && (b = a, a = "fx"), b === j ? n.queue(this[0], a) : this.each(function() {
                    var c = n.queue(this, a, b);
                    "fx" == a && 1 == c.length && c[0].call(this)
                })
            },
            dequeue: function(a) {
                return this.each(function() {
                    n.dequeue(this, a)
                })
            }
        }),
        function() {
            function a(a, b, c, d, e, f) {
                for (var g = "previousSibling" == a && !f, h = 0, i = d.length; i > h; h++) {
                    var j = d[h];
                    if (j) {
                        g && 1 === j.nodeType && (j.sizcache = c, j.sizset = h), j = j[a];
                        for (var k = !1; j;) {
                            if (j.sizcache === c) {
                                k = d[j.sizset];
                                break
                            }
                            if (1 !== j.nodeType || f || (j.sizcache = c, j.sizset = h), j.nodeName === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        d[h] = k
                    }
                }
            }

            function b(a, b, c, d, e, g) {
                for (var h = "previousSibling" == a && !g, i = 0, j = d.length; j > i; i++) {
                    var k = d[i];
                    if (k) {
                        h && 1 === k.nodeType && (k.sizcache = c, k.sizset = i), k = k[a];
                        for (var l = !1; k;) {
                            if (k.sizcache === c) {
                                l = d[k.sizset];
                                break
                            }
                            if (1 === k.nodeType)
                                if (g || (k.sizcache = c, k.sizset = i), "string" != typeof b) {
                                    if (k === b) {
                                        l = !0;
                                        break
                                    }
                                } else if (f.filter(b, [k]).length > 0) {
                                l = k;
                                break
                            }
                            k = k[a]
                        }
                        d[i] = l
                    }
                }
            }
            var c = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
                d = 0,
                e = Object.prototype.toString,
                f = function(a, b, d, i) {
                    if (d = d || [], b = b || document, 1 !== b.nodeType && 9 !== b.nodeType) return [];
                    if (!a || "string" != typeof a) return d;
                    var j, l, n, r, s = [],
                        t = !0;
                    for (c.lastIndex = 0; null !== (j = c.exec(a));)
                        if (s.push(j[1]), j[2]) {
                            r = RegExp.rightContext;
                            break
                        }
                    if (s.length > 1 && h.exec(a))
                        if (2 === s.length && g.relative[s[0]]) l = q(s[0] + s[1], b);
                        else
                            for (l = g.relative[s[0]] ? [b] : f(s.shift(), b); s.length;) a = s.shift(), g.relative[a] && (a += s.shift()), l = q(a, l);
                    else {
                        var u = i ? {
                            expr: s.pop(),
                            set: k(i)
                        } : f.find(s.pop(), 1 === s.length && b.parentNode ? b.parentNode : b, p(b));
                        for (l = f.filter(u.expr, u.set), s.length > 0 ? n = k(l) : t = !1; s.length;) {
                            var v = s.pop(),
                                w = v;
                            g.relative[v] ? w = s.pop() : v = "", null == w && (w = b), g.relative[v](n, w, p(b))
                        }
                    }
                    if (n || (n = l), !n) throw "Syntax error, unrecognized expression: " + (v || a);
                    if ("[object Array]" === e.call(n))
                        if (t)
                            if (1 === b.nodeType)
                                for (var x = 0; null != n[x]; x++) n[x] && (n[x] === !0 || 1 === n[x].nodeType && o(b, n[x])) && d.push(l[x]);
                            else
                                for (var x = 0; null != n[x]; x++) n[x] && 1 === n[x].nodeType && d.push(l[x]);
                    else d.push.apply(d, n);
                    else k(n, d);
                    if (r && (f(r, b, d, i), m && (hasDuplicate = !1, d.sort(m), hasDuplicate)))
                        for (var x = 1; x < d.length; x++) d[x] === d[x - 1] && d.splice(x--, 1);
                    return d
                };
            f.matches = function(a, b) {
                return f(a, null, null, b)
            }, f.find = function(a, b, c) {
                var d, e;
                if (!a) return [];
                for (var f = 0, h = g.order.length; h > f; f++) {
                    var e, i = g.order[f];
                    if (e = g.match[i].exec(a)) {
                        var j = RegExp.leftContext;
                        if ("\\" !== j.substr(j.length - 1) && (e[1] = (e[1] || "").replace(/\\/g, ""), d = g.find[i](e, b, c), null != d)) {
                            a = a.replace(g.match[i], "");
                            break
                        }
                    }
                }
                return d || (d = b.getElementsByTagName("*")), {
                    set: d,
                    expr: a
                }
            }, f.filter = function(a, b, c, d) {
                for (var e, f, h = a, i = [], k = b, l = b && b[0] && p(b[0]); a && b.length;) {
                    for (var m in g.filter)
                        if (null != (e = g.match[m].exec(a))) {
                            var n, o, q = g.filter[m];
                            if (f = !1, k == i && (i = []), g.preFilter[m])
                                if (e = g.preFilter[m](e, k, c, i, d, l)) {
                                    if (e === !0) continue
                                } else f = n = !0;
                            if (e)
                                for (var r = 0; null != (o = k[r]); r++)
                                    if (o) {
                                        n = q(o, e, r, k);
                                        var s = d ^ !!n;
                                        c && null != n ? s ? f = !0 : k[r] = !1 : s && (i.push(o), f = !0)
                                    }
                            if (n !== j) {
                                if (c || (k = i), a = a.replace(g.match[m], ""), !f) return [];
                                break
                            }
                        }
                    if (a == h) {
                        if (null == f) throw "Syntax error, unrecognized expression: " + a;
                        break
                    }
                    h = a
                }
                return k
            };
            var g = f.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
                    },
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(a) {
                            return a.getAttribute("href")
                        }
                    },
                    relative: {
                        "+": function(a, b, c) {
                            var d = "string" == typeof b,
                                e = d && !/\W/.test(b),
                                g = d && !e;
                            e && !c && (b = b.toUpperCase());
                            for (var h, i = 0, j = a.length; j > i; i++)
                                if (h = a[i]) {
                                    for (;
                                        (h = h.previousSibling) && 1 !== h.nodeType;);
                                    a[i] = g || h && h.nodeName === b ? h || !1 : h === b
                                }
                            g && f.filter(b, a, !0)
                        },
                        ">": function(a, b, c) {
                            var d = "string" == typeof b;
                            if (d && !/\W/.test(b)) {
                                b = c ? b : b.toUpperCase();
                                for (var e = 0, g = a.length; g > e; e++) {
                                    var h = a[e];
                                    if (h) {
                                        var i = h.parentNode;
                                        a[e] = i.nodeName === b ? i : !1
                                    }
                                }
                            } else {
                                for (var e = 0, g = a.length; g > e; e++) {
                                    var h = a[e];
                                    h && (a[e] = d ? h.parentNode : h.parentNode === b)
                                }
                                d && f.filter(b, a, !0)
                            }
                        },
                        "": function(c, e, f) {
                            var g = d++,
                                h = b;
                            if (!e.match(/\W/)) {
                                var i = e = f ? e : e.toUpperCase();
                                h = a
                            }
                            h("parentNode", e, g, c, i, f)
                        },
                        "~": function(c, e, f) {
                            var g = d++,
                                h = b;
                            if ("string" == typeof e && !e.match(/\W/)) {
                                var i = e = f ? e : e.toUpperCase();
                                h = a
                            }
                            h("previousSibling", e, g, c, i, f)
                        }
                    },
                    find: {
                        ID: function(a, b, c) {
                            if ("undefined" != typeof b.getElementById && !c) {
                                var d = b.getElementById(a[1]);
                                return d ? [d] : []
                            }
                        },
                        NAME: function(a, b) {
                            if ("undefined" != typeof b.getElementsByName) {
                                for (var c = [], d = b.getElementsByName(a[1]), e = 0, f = d.length; f > e; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                                return 0 === c.length ? null : c
                            }
                        },
                        TAG: function(a, b) {
                            return b.getElementsByTagName(a[1])
                        }
                    },
                    preFilter: {
                        CLASS: function(a, b, c, d, e, f) {
                            if (a = " " + a[1].replace(/\\/g, "") + " ", f) return a;
                            for (var g, h = 0; null != (g = b[h]); h++) g && (e ^ (g.className && (" " + g.className + " ").indexOf(a) >= 0) ? c || d.push(g) : c && (b[h] = !1));
                            return !1
                        },
                        ID: function(a) {
                            return a[1].replace(/\\/g, "")
                        },
                        TAG: function(a, b) {
                            for (var c = 0; b[c] === !1; c++);
                            return b[c] && p(b[c]) ? a[1] : a[1].toUpperCase()
                        },
                        CHILD: function(a) {
                            if ("nth" == a[1]) {
                                var b = /(-?)(\d*)n((?:\+|-)?\d*)/.exec("even" == a[2] && "2n" || "odd" == a[2] && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            }
                            return a[0] = d++, a
                        },
                        ATTR: function(a, b, c, d, e, f) {
                            var h = a[1].replace(/\\/g, "");
                            return !f && g.attrMap[h] && (a[1] = g.attrMap[h]), "~=" === a[2] && (a[4] = " " + a[4] + " "), a
                        },
                        PSEUDO: function(a, b, d, e, h) {
                            if ("not" === a[1]) {
                                if (!(a[3].match(c).length > 1 || /^\w/.test(a[3]))) {
                                    var i = f.filter(a[3], b, d, !0 ^ h);
                                    return d || e.push.apply(e, i), !1
                                }
                                a[3] = f(a[3], null, null, b)
                            } else if (g.match.POS.test(a[0]) || g.match.CHILD.test(a[0])) return !0;
                            return a
                        },
                        POS: function(a) {
                            return a.unshift(!0), a
                        }
                    },
                    filters: {
                        enabled: function(a) {
                            return a.disabled === !1 && "hidden" !== a.type
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            return a.checked === !0
                        },
                        selected: function(a) {
                            return a.parentNode.selectedIndex, a.selected === !0
                        },
                        parent: function(a) {
                            return !!a.firstChild
                        },
                        empty: function(a) {
                            return !a.firstChild
                        },
                        has: function(a, b, c) {
                            return !!f(c[3], a).length
                        },
                        header: function(a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function(a) {
                            return "text" === a.type
                        },
                        radio: function(a) {
                            return "radio" === a.type
                        },
                        checkbox: function(a) {
                            return "checkbox" === a.type
                        },
                        file: function(a) {
                            return "file" === a.type
                        },
                        password: function(a) {
                            return "password" === a.type
                        },
                        submit: function(a) {
                            return "submit" === a.type
                        },
                        image: function(a) {
                            return "image" === a.type
                        },
                        reset: function(a) {
                            return "reset" === a.type
                        },
                        button: function(a) {
                            return "button" === a.type || "BUTTON" === a.nodeName.toUpperCase()
                        },
                        input: function(a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        }
                    },
                    setFilters: {
                        first: function(a, b) {
                            return 0 === b
                        },
                        last: function(a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function(a, b) {
                            return b % 2 === 0
                        },
                        odd: function(a, b) {
                            return b % 2 === 1
                        },
                        lt: function(a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function(a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function(a, b, c) {
                            return c[3] - 0 == b
                        },
                        eq: function(a, b, c) {
                            return c[3] - 0 == b
                        }
                    },
                    filter: {
                        PSEUDO: function(a, b, c, d) {
                            var e = b[1],
                                f = g.filters[e];
                            if (f) return f(a, c, b, d);
                            if ("contains" === e) return (a.textContent || a.innerText || "").indexOf(b[3]) >= 0;
                            if ("not" === e) {
                                for (var h = b[3], c = 0, i = h.length; i > c; c++)
                                    if (h[c] === a) return !1;
                                return !0
                            }
                        },
                        CHILD: function(a, b) {
                            var c = b[1],
                                d = a;
                            switch (c) {
                                case "only":
                                case "first":
                                    for (; d = d.previousSibling;)
                                        if (1 === d.nodeType) return !1;
                                    if ("first" == c) return !0;
                                    d = a;
                                case "last":
                                    for (; d = d.nextSibling;)
                                        if (1 === d.nodeType) return !1;
                                    return !0;
                                case "nth":
                                    var e = b[2],
                                        f = b[3];
                                    if (1 == e && 0 == f) return !0;
                                    var g = b[0],
                                        h = a.parentNode;
                                    if (h && (h.sizcache !== g || !a.nodeIndex)) {
                                        var i = 0;
                                        for (d = h.firstChild; d; d = d.nextSibling) 1 === d.nodeType && (d.nodeIndex = ++i);
                                        h.sizcache = g
                                    }
                                    var j = a.nodeIndex - f;
                                    return 0 == e ? 0 == j : j % e == 0 && j / e >= 0
                            }
                        },
                        ID: function(a, b) {
                            return 1 === a.nodeType && a.getAttribute("id") === b
                        },
                        TAG: function(a, b) {
                            return "*" === b && 1 === a.nodeType || a.nodeName === b
                        },
                        CLASS: function(a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function(a, b) {
                            var c = b[1],
                                d = g.attrHandle[c] ? g.attrHandle[c](a) : null != a[c] ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                h = b[4];
                            return null == d ? "!=" === f : "=" === f ? e === h : "*=" === f ? e.indexOf(h) >= 0 : "~=" === f ? (" " + e + " ").indexOf(h) >= 0 : h ? "!=" === f ? e != h : "^=" === f ? 0 === e.indexOf(h) : "$=" === f ? e.substr(e.length - h.length) === h : "|=" === f ? e === h || e.substr(0, h.length + 1) === h + "-" : !1 : e && d !== !1
                        },
                        POS: function(a, b, c, d) {
                            var e = b[2],
                                f = g.setFilters[e];
                            return f ? f(a, c, b, d) : void 0
                        }
                    }
                },
                h = g.match.POS;
            for (var i in g.match) g.match[i] = RegExp(g.match[i].source + /(?![^\[]*\])(?![^\(]*\))/.source);
            var k = function(a, b) {
                return a = Array.prototype.slice.call(a), b ? (b.push.apply(b, a), b) : a
            };
            try {
                Array.prototype.slice.call(document.documentElement.childNodes)
            } catch (l) {
                k = function(a, b) {
                    var c = b || [];
                    if ("[object Array]" === e.call(a)) Array.prototype.push.apply(c, a);
                    else if ("number" == typeof a.length)
                        for (var d = 0, f = a.length; f > d; d++) c.push(a[d]);
                    else
                        for (var d = 0; a[d]; d++) c.push(a[d]);
                    return c
                }
            }
            var m;
            document.documentElement.compareDocumentPosition ? m = function(a, b) {
                    var c = 4 & a.compareDocumentPosition(b) ? -1 : a === b ? 0 : 1;
                    return 0 === c && (hasDuplicate = !0), c
                } : "sourceIndex" in document.documentElement ? m = function(a, b) {
                    var c = a.sourceIndex - b.sourceIndex;
                    return 0 === c && (hasDuplicate = !0), c
                } : document.createRange && (m = function(a, b) {
                    var c = a.ownerDocument.createRange(),
                        d = b.ownerDocument.createRange();
                    c.selectNode(a), c.collapse(!0), d.selectNode(b), d.collapse(!0);
                    var e = c.compareBoundaryPoints(Range.START_TO_END, d);
                    return 0 === e && (hasDuplicate = !0), e
                }),
                function() {
                    var a = document.createElement("form"),
                        b = "script" + (new Date).getTime();
                    a.innerHTML = "<input name='" + b + "'/>";
                    var c = document.documentElement;
                    c.insertBefore(a, c.firstChild), document.getElementById(b) && (g.find.ID = function(a, b, c) {
                        if ("undefined" != typeof b.getElementById && !c) {
                            var d = b.getElementById(a[1]);
                            return d ? d.id === a[1] || "undefined" != typeof d.getAttributeNode && d.getAttributeNode("id").nodeValue === a[1] ? [d] : j : []
                        }
                    }, g.filter.ID = function(a, b) {
                        var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                        return 1 === a.nodeType && c && c.nodeValue === b
                    }), c.removeChild(a)
                }(),
                function() {
                    var a = document.createElement("div");
                    a.appendChild(document.createComment("")), a.getElementsByTagName("*").length > 0 && (g.find.TAG = function(a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if ("*" === a[1]) {
                            for (var d = [], e = 0; c[e]; e++) 1 === c[e].nodeType && d.push(c[e]);
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && "undefined" != typeof a.firstChild.getAttribute && "#" !== a.firstChild.getAttribute("href") && (g.attrHandle.href = function(a) {
                        return a.getAttribute("href", 2)
                    })
                }(), document.querySelectorAll && ! function() {
                    var a = f,
                        b = document.createElement("div");
                    b.innerHTML = "<p class='TEST'></p>", b.querySelectorAll && 0 === b.querySelectorAll(".TEST").length || (f = function(b, c, d, e) {
                        if (c = c || document, !e && 9 === c.nodeType && !p(c)) try {
                            return k(c.querySelectorAll(b), d)
                        } catch (f) {}
                        return a(b, c, d, e)
                    }, f.find = a.find, f.filter = a.filter, f.selectors = a.selectors, f.matches = a.matches)
                }(), document.getElementsByClassName && document.documentElement.getElementsByClassName && ! function() {
                    var a = document.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>", 0 !== a.getElementsByClassName("e").length && (a.lastChild.className = "e", 1 !== a.getElementsByClassName("e").length && (g.order.splice(1, 0, "CLASS"), g.find.CLASS = function(a, b, c) {
                        return "undefined" == typeof b.getElementsByClassName || c ? void 0 : b.getElementsByClassName(a[1])
                    }))
                }();
            var o = document.compareDocumentPosition ? function(a, b) {
                    return 16 & a.compareDocumentPosition(b)
                } : function(a, b) {
                    return a !== b && (a.contains ? a.contains(b) : !0)
                },
                p = function(a) {
                    return 9 === a.nodeType && "HTML" !== a.documentElement.nodeName || !!a.ownerDocument && p(a.ownerDocument)
                },
                q = function(a, b) {
                    for (var c, d = [], e = "", h = b.nodeType ? [b] : b; c = g.match.PSEUDO.exec(a);) e += c[0], a = a.replace(g.match.PSEUDO, "");
                    a = g.relative[a] ? a + "*" : a;
                    for (var i = 0, j = h.length; j > i; i++) f(a, h[i], d);
                    return f.filter(e, d)
                };
            n.find = f, n.filter = f.filter, n.expr = f.selectors, n.expr[":"] = n.expr.filters, f.selectors.filters.hidden = function(a) {
                return 0 === a.offsetWidth || 0 === a.offsetHeight
            }, f.selectors.filters.visible = function(a) {
                return a.offsetWidth > 0 || a.offsetHeight > 0
            }, f.selectors.filters.animated = function(a) {
                return n.grep(n.timers, function(b) {
                    return a === b.elem
                }).length
            }, n.multiFilter = function(a, b, c) {
                return c && (a = ":not(" + a + ")"), f.matches(a, b)
            }, n.dir = function(a, b) {
                for (var c = [], d = a[b]; d && d != document;) 1 == d.nodeType && c.push(d), d = d[b];
                return c
            }, n.nth = function(a, b, c) {
                b = b || 1;
                for (var d = 0; a && (1 != a.nodeType || ++d != b); a = a[c]);
                return a
            }, n.sibling = function(a, b) {
                for (var c = []; a; a = a.nextSibling) 1 == a.nodeType && a != b && c.push(a);
                return c
            }
        }(), n.event = {
            add: function(a, b, c, d) {
                if (3 != a.nodeType && 8 != a.nodeType) {
                    if (a.setInterval && a != k && (a = k), c.guid || (c.guid = this.guid++), d !== j) {
                        var e = c;
                        c = this.proxy(e), c.data = d
                    }
                    var f = n.data(a, "events") || n.data(a, "events", {}),
                        g = n.data(a, "handle") || n.data(a, "handle", function() {
                            return "undefined" == typeof n || n.event.triggered ? j : n.event.handle.apply(arguments.callee.elem, arguments)
                        });
                    g.elem = a, n.each(b.split(/\s+/), function(b, e) {
                        var h = e.split(".");
                        e = h.shift(), c.type = h.slice().sort().join(".");
                        var i = f[e];
                        n.event.specialAll[e] && n.event.specialAll[e].setup.call(a, d, h), i || (i = f[e] = {}, n.event.special[e] && n.event.special[e].setup.call(a, d, h) !== !1 || (a.addEventListener ? a.addEventListener(e, g, !1) : a.attachEvent && a.attachEvent("on" + e, g))), i[c.guid] = c, n.event.global[e] = !0
                    }), a = null
                }
            },
            guid: 1,
            global: {},
            remove: function(a, b, c) {
                if (3 != a.nodeType && 8 != a.nodeType) {
                    var d, e = n.data(a, "events");
                    if (e) {
                        if (b === j || "string" == typeof b && "." == b.charAt(0))
                            for (var f in e) this.remove(a, f + (b || ""));
                        else b.type && (c = b.handler, b = b.type), n.each(b.split(/\s+/), function(b, f) {
                            var g = f.split(".");
                            f = g.shift();
                            var h = RegExp("(^|\\.)" + g.slice().sort().join(".*\\.") + "(\\.|$)");
                            if (e[f]) {
                                if (c) delete e[f][c.guid];
                                else
                                    for (var i in e[f]) h.test(e[f][i].type) && delete e[f][i];
                                n.event.specialAll[f] && n.event.specialAll[f].teardown.call(a, g);
                                for (d in e[f]) break;
                                d || (n.event.special[f] && n.event.special[f].teardown.call(a, g) !== !1 || (a.removeEventListener ? a.removeEventListener(f, n.data(a, "handle"), !1) : a.detachEvent && a.detachEvent("on" + f, n.data(a, "handle"))), d = null, delete e[f])
                            }
                        });
                        for (d in e) break;
                        if (!d) {
                            var g = n.data(a, "handle");
                            g && (g.elem = null), n.removeData(a, "events"), n.removeData(a, "handle")
                        }
                    }
                }
            },
            trigger: function(a, b, c, d) {
                var e = a.type || a;
                if (!d) {
                    if (a = "object" == typeof a ? a[u] ? a : n.extend(n.Event(e), a) : n.Event(e), e.indexOf("!") >= 0 && (a.type = e = e.slice(0, -1), a.exclusive = !0), c || (a.stopPropagation(), this.global[e] && n.each(n.cache, function() {
                            this.events && this.events[e] && n.event.trigger(a, b, this.handle.elem)
                        })), !c || 3 == c.nodeType || 8 == c.nodeType) return j;
                    a.result = j, a.target = c, b = n.makeArray(b), b.unshift(a)
                }
                a.currentTarget = c;
                var f = n.data(c, "handle");
                if (f && f.apply(c, b), (!c[e] || n.nodeName(c, "a") && "click" == e) && c["on" + e] && c["on" + e].apply(c, b) === !1 && (a.result = !1), !(d || !c[e] || a.isDefaultPrevented() || n.nodeName(c, "a") && "click" == e)) {
                    this.triggered = !0;
                    try {
                        c[e]()
                    } catch (g) {}
                }
                if (this.triggered = !1, !a.isPropagationStopped()) {
                    var h = c.parentNode || c.ownerDocument;
                    h && n.event.trigger(a, b, h, !0)
                }
            },
            handle: function(a) {
                var b, c;
                a = arguments[0] = n.event.fix(a || k.event), a.currentTarget = this;
                var d = a.type.split(".");
                a.type = d.shift(), b = !d.length && !a.exclusive;
                var e = RegExp("(^|\\.)" + d.slice().sort().join(".*\\.") + "(\\.|$)");
                c = (n.data(this, "events") || {})[a.type];
                for (var f in c) {
                    var g = c[f];
                    if (b || e.test(g.type)) {
                        a.handler = g, a.data = g.data;
                        var h = g.apply(this, arguments);
                        if (h !== j && (a.result = h, h === !1 && (a.preventDefault(), a.stopPropagation())), a.isImmediatePropagationStopped()) break
                    }
                }
            },
            props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
            fix: function(a) {
                if (a[u]) return a;
                var b = a;
                a = n.Event(b);
                for (var c, d = this.props.length; d;) c = this.props[--d], a[c] = b[c];
                if (a.target || (a.target = a.srcElement || document), 3 == a.target.nodeType && (a.target = a.target.parentNode), !a.relatedTarget && a.fromElement && (a.relatedTarget = a.fromElement == a.target ? a.toElement : a.fromElement), null == a.pageX && null != a.clientX) {
                    var e = document.documentElement,
                        f = document.body;
                    a.pageX = a.clientX + (e && e.scrollLeft || f && f.scrollLeft || 0) - (e.clientLeft || 0), a.pageY = a.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e.clientTop || 0)
                }
                return !a.which && (a.charCode || 0 === a.charCode ? a.charCode : a.keyCode) && (a.which = a.charCode || a.keyCode), !a.metaKey && a.ctrlKey && (a.metaKey = a.ctrlKey), !a.which && a.button && (a.which = 1 & a.button ? 1 : 2 & a.button ? 3 : 4 & a.button ? 2 : 0), a
            },
            proxy: function(a, b) {
                return b = b || function() {
                    return a.apply(this, arguments)
                }, b.guid = a.guid = a.guid || b.guid || this.guid++, b
            },
            special: {
                ready: {
                    setup: h,
                    teardown: function() {}
                }
            },
            specialAll: {
                live: {
                    setup: function(a, b) {
                        n.event.add(this, b[0], f)
                    },
                    teardown: function(a) {
                        if (a.length) {
                            var b = 0,
                                c = RegExp("(^|\\.)" + a[0] + "(\\.|$)");
                            n.each(n.data(this, "events").live || {}, function() {
                                c.test(this.type) && b++
                            }), 1 > b && n.event.remove(this, a[0], f)
                        }
                    }
                }
            }
        }, n.Event = function(a) {
            return this.preventDefault ? (a && a.type ? (this.originalEvent = a, this.type = a.type) : this.type = a, this.timeStamp = b(), void(this[u] = !0)) : new n.Event(a)
        }, n.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = e;
                var a = this.originalEvent;
                a && (a.preventDefault && a.preventDefault(), a.returnValue = !1)
            },
            stopPropagation: function() {
                this.isPropagationStopped = e;
                var a = this.originalEvent;
                a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = e, this.stopPropagation()
            },
            isDefaultPrevented: d,
            isPropagationStopped: d,
            isImmediatePropagationStopped: d
        };
    var x = function(a) {
        for (var b = a.relatedTarget; b && b != this;) try {
            b = b.parentNode
        } catch (c) {
            b = this
        }
        b != this && (a.type = a.data, n.event.handle.apply(this, arguments))
    };
    n.each({
        mouseover: "mouseenter",
        mouseout: "mouseleave"
    }, function(a, b) {
        n.event.special[b] = {
            setup: function() {
                n.event.add(this, a, x, b)
            },
            teardown: function() {
                n.event.remove(this, a, x)
            }
        }
    }), n.fn.extend({
        bind: function(a, b, c) {
            return "unload" == a ? this.one(a, b, c) : this.each(function() {
                n.event.add(this, a, c || b, c && b)
            })
        },
        one: function(a, b, c) {
            var d = n.event.proxy(c || b, function(a) {
                return n(this).unbind(a, d), (c || b).apply(this, arguments)
            });
            return this.each(function() {
                n.event.add(this, a, d, c && b)
            })
        },
        unbind: function(a, b) {
            return this.each(function() {
                n.event.remove(this, a, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                n.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            if (this[0]) {
                var c = n.Event(a);
                return c.preventDefault(), c.stopPropagation(), n.event.trigger(c, b, this[0]), c.result
            }
        },
        toggle: function(a) {
            for (var b = arguments, c = 1; c < b.length;) n.event.proxy(a, b[c++]);
            return this.click(n.event.proxy(a, function(a) {
                return this.lastToggle = (this.lastToggle || 0) % c, a.preventDefault(), b[this.lastToggle++].apply(this, arguments) || !1
            }))
        },
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b)
        },
        ready: function(a) {
            return h(), n.isReady ? a.call(document, n) : n.readyList.push(a), this
        },
        live: function(a, b) {
            var c = n.event.proxy(b);
            return c.guid += this.selector + a, n(document).bind(g(a, this.selector), this.selector, c), this
        },
        die: function(a, b) {
            return n(document).unbind(g(a, this.selector), b ? {
                guid: b.guid + this.selector + a
            } : null), this
        }
    }), n.extend({
        isReady: !1,
        readyList: [],
        ready: function() {
            n.isReady || (n.isReady = !0, n.readyList && (n.each(n.readyList, function() {
                this.call(document, n)
            }), n.readyList = null), n(document).triggerHandler("ready"))
        }
    });
    var y = !1;
    n.each("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error".split(","), function(a, b) {
            n.fn[b] = function(a) {
                return a ? this.bind(b, a) : this.trigger(b)
            }
        }), n(k).bind("unload", function() {
            for (var a in n.cache) 1 != a && n.cache[a].handle && n.event.remove(n.cache[a].handle.elem)
        }),
        function() {
            n.support = {};
            var a = document.documentElement,
                b = document.createElement("script"),
                c = document.createElement("div"),
                d = "script" + (new Date).getTime();
            c.style.display = "none", c.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';
            var e = c.getElementsByTagName("*"),
                f = c.getElementsByTagName("a")[0];
            if (e && e.length && f) {
                n.support = {
                    leadingWhitespace: 3 == c.firstChild.nodeType,
                    tbody: !c.getElementsByTagName("tbody").length,
                    objectAll: !!c.getElementsByTagName("object")[0].getElementsByTagName("*").length,
                    htmlSerialize: !!c.getElementsByTagName("link").length,
                    style: /red/.test(f.getAttribute("style")),
                    hrefNormalized: "/a" === f.getAttribute("href"),
                    opacity: "0.5" === f.style.opacity,
                    cssFloat: !!f.style.cssFloat,
                    scriptEval: !1,
                    noCloneEvent: !0,
                    boxModel: null
                }, b.type = "text/javascript";
                try {
                    b.appendChild(document.createTextNode("window." + d + "=1;"))
                } catch (g) {}
                a.insertBefore(b, a.firstChild), k[d] && (n.support.scriptEval = !0, delete k[d]), a.removeChild(b), c.attachEvent && c.fireEvent && (c.attachEvent("onclick", function() {
                    n.support.noCloneEvent = !1, c.detachEvent("onclick", arguments.callee)
                }), c.cloneNode(!0).fireEvent("onclick")), n(function() {
                    var a = document.createElement("div");
                    a.style.width = a.style.paddingLeft = "1px", document.body.appendChild(a), n.boxModel = n.support.boxModel = 2 === a.offsetWidth, document.body.removeChild(a).style.display = "none"
                })
            }
        }();
    var z = n.support.cssFloat ? "cssFloat" : "styleFloat";
    n.props = {
        "for": "htmlFor",
        "class": "className",
        "float": z,
        cssFloat: z,
        styleFloat: z,
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        tabindex: "tabIndex"
    }, n.fn.extend({
        _load: n.fn.load,
        load: function(a, b, c) {
            if ("string" != typeof a) return this._load(a);
            var d = a.indexOf(" ");
            if (d >= 0) {
                var e = a.slice(d, a.length);
                a = a.slice(0, d)
            }
            var f = "GET";
            b && (n.isFunction(b) ? (c = b, b = null) : "object" == typeof b && (b = n.param(b), f = "POST"));
            var g = this;
            return n.ajax({
                url: a,
                type: f,
                dataType: "html",
                data: b,
                complete: function(a, b) {
                    ("success" == b || "notmodified" == b) && g.html(e ? n("<div/>").append(a.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(e) : a.responseText), c && g.each(c, [a.responseText, b, a])
                }
            }), this
        },
        serialize: function() {
            return n.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? n.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password|search/i.test(this.type))
            }).map(function(a, b) {
                var c = n(this).val();
                return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a
                    }
                }) : {
                    name: b.name,
                    value: c
                }
            }).get()
        }
    }), n.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(a, b) {
        n.fn[b] = function(a) {
            return this.bind(b, a)
        }
    });
    var A = b();
    n.extend({
        get: function(a, b, c, d) {
            return n.isFunction(b) && (c = b, b = null), n.ajax({
                type: "GET",
                url: a,
                data: b,
                success: c,
                dataType: d
            })
        },
        getScript: function(a, b) {
            return n.get(a, null, b, "script")
        },
        getJSON: function(a, b, c) {
            return n.get(a, b, c, "json")
        },
        post: function(a, b, c, d) {
            return n.isFunction(b) && (c = b, b = {}), n.ajax({
                type: "POST",
                url: a,
                data: b,
                success: c,
                dataType: d
            })
        },
        ajaxSetup: function(a) {
            n.extend(n.ajaxSettings, a)
        },
        ajaxSettings: {
            url: location.href,
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: !0,
            async: !0,
            xhr: function() {
                return k.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest
            },
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        ajax: function(a) {
            function c() {
                a.success && a.success(g, f), a.global && n.event.trigger("ajaxSuccess", [t, a])
            }

            function d() {
                a.complete && a.complete(t, f), a.global && n.event.trigger("ajaxComplete", [t, a]), a.global && !--n.active && n.event.trigger("ajaxStop")
            }
            a = n.extend(!0, a, n.extend(!0, {}, n.ajaxSettings, a));
            var e, f, g, h = /=\?(&|$)/g,
                i = a.type.toUpperCase();
            if (a.data && a.processData && "string" != typeof a.data && (a.data = n.param(a.data)), "jsonp" == a.dataType && ("GET" == i ? a.url.match(h) || (a.url += (a.url.match(/\?/) ? "&" : "?") + (a.jsonp || "callback") + "=?") : a.data && a.data.match(h) || (a.data = (a.data ? a.data + "&" : "") + (a.jsonp || "callback") + "=?"), a.dataType = "json"), "json" == a.dataType && (a.data && a.data.match(h) || a.url.match(h)) && (e = "jsonp" + A++, a.data && (a.data = (a.data + "").replace(h, "=" + e + "$1")), a.url = a.url.replace(h, "=" + e + "$1"), a.dataType = "script", k[e] = function(a) {
                    g = a, c(), d(), k[e] = j;
                    try {
                        delete k[e]
                    } catch (b) {}
                    p && p.removeChild(q)
                }), "script" == a.dataType && null == a.cache && (a.cache = !1), a.cache === !1 && "GET" == i) {
                var l = b(),
                    m = a.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + l + "$2");
                a.url = m + (m == a.url ? (a.url.match(/\?/) ? "&" : "?") + "_=" + l : "")
            }
            a.data && "GET" == i && (a.url += (a.url.match(/\?/) ? "&" : "?") + a.data, a.data = null), a.global && !n.active++ && n.event.trigger("ajaxStart");
            var o = /^(\w+:)?\/\/([^\/?#]+)/.exec(a.url);
            if ("script" == a.dataType && "GET" == i && o && (o[1] && o[1] != location.protocol || o[2] != location.host)) {
                var p = document.getElementsByTagName("head")[0],
                    q = document.createElement("script");
                if (q.src = a.url, a.scriptCharset && (q.charset = a.scriptCharset), !e) {
                    var r = !1;
                    q.onload = q.onreadystatechange = function() {
                        r || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (r = !0, c(), d(), q.onload = q.onreadystatechange = null, p.removeChild(q))
                    }
                }
                return p.appendChild(q), j
            }
            var s = !1,
                t = a.xhr();
            a.username ? t.open(i, a.url, a.async, a.username, a.password) : t.open(i, a.url, a.async);
            try {
                a.data && t.setRequestHeader("Content-Type", a.contentType), a.ifModified && t.setRequestHeader("If-Modified-Since", n.lastModified[a.url] || "Thu, 01 Jan 1970 00:00:00 GMT"), t.setRequestHeader("X-Requested-With", "XMLHttpRequest"), t.setRequestHeader("Accept", a.dataType && a.accepts[a.dataType] ? a.accepts[a.dataType] + ", */*" : a.accepts._default)
            } catch (u) {}
            if (a.beforeSend && a.beforeSend(t, a) === !1) return a.global && !--n.active && n.event.trigger("ajaxStop"), t.abort(), !1;
            a.global && n.event.trigger("ajaxSend", [t, a]);
            var v = function(b) {
                if (0 == t.readyState) w && (clearInterval(w), w = null, a.global && !--n.active && n.event.trigger("ajaxStop"));
                else if (!s && t && (4 == t.readyState || "timeout" == b)) {
                    if (s = !0, w && (clearInterval(w), w = null), f = "timeout" == b ? "timeout" : n.httpSuccess(t) ? a.ifModified && n.httpNotModified(t, a.url) ? "notmodified" : "success" : "error", "success" == f) try {
                        g = n.httpData(t, a.dataType, a)
                    } catch (h) {
                        f = "parsererror"
                    }
                    if ("success" == f) {
                        var i;
                        try {
                            i = t.getResponseHeader("Last-Modified")
                        } catch (h) {}
                        a.ifModified && i && (n.lastModified[a.url] = i), e || c()
                    } else n.handleError(a, t, f);
                    d(), b && t.abort(), a.async && (t = null)
                }
            };
            if (a.async) {
                var w = setInterval(v, 13);
                a.timeout > 0 && setTimeout(function() {
                    t && !s && v("timeout")
                }, a.timeout)
            }
            try {
                t.send(a.data)
            } catch (u) {
                n.handleError(a, t, null, u)
            }
            return a.async || v(), t
        },
        handleError: function(a, b, c, d) {
            a.error && a.error(b, c, d), a.global && n.event.trigger("ajaxError", [b, a, d])
        },
        active: 0,
        httpSuccess: function(a) {
            try {
                return !a.status && "file:" == location.protocol || a.status >= 200 && a.status < 300 || 304 == a.status || 1223 == a.status
            } catch (b) {}
            return !1
        },
        httpNotModified: function(a, b) {
            try {
                var c = a.getResponseHeader("Last-Modified");
                return 304 == a.status || c == n.lastModified[b]
            } catch (d) {}
            return !1
        },
        httpData: function(a, b, c) {
            var d = a.getResponseHeader("content-type"),
                e = "xml" == b || !b && d && d.indexOf("xml") >= 0,
                f = e ? a.responseXML : a.responseText;
            if (e && "parsererror" == f.documentElement.tagName) throw "parsererror";
            return c && c.dataFilter && (f = c.dataFilter(f, b)), "string" == typeof f && ("script" == b && n.globalEval(f), "json" == b && (f = k.eval("(" + f + ")"))), f
        },
        param: function(a) {
            function b(a, b) {
                c[c.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            }
            var c = [];
            if (n.isArray(a) || a.jquery) n.each(a, function() {
                b(this.name, this.value)
            });
            else
                for (var d in a) n.isArray(a[d]) ? n.each(a[d], function() {
                    b(d, this)
                }) : b(d, n.isFunction(a[d]) ? a[d]() : a[d]);
            return c.join("&").replace(/%20/g, "+")
        }
    });
    var B, C = {},
        D = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ];
    n.fn.extend({
        show: function(a, b) {
            if (a) return this.animate(i("show", 3), a, b);
            for (var c = 0, d = this.length; d > c; c++) {
                var e = n.data(this[c], "olddisplay");
                if (this[c].style.display = e || "", "none" === n.css(this[c], "display")) {
                    var f, g = this[c].tagName;
                    if (C[g]) f = C[g];
                    else {
                        var h = n("<" + g + " />").appendTo("body");
                        f = h.css("display"), "none" === f && (f = "block"), h.remove(), C[g] = f
                    }
                    n.data(this[c], "olddisplay", f)
                }
            }
            for (var c = 0, d = this.length; d > c; c++) this[c].style.display = n.data(this[c], "olddisplay") || "";
            return this
        },
        hide: function(a, b) {
            if (a) return this.animate(i("hide", 3), a, b);
            for (var c = 0, d = this.length; d > c; c++) {
                var e = n.data(this[c], "olddisplay");
                e || "none" === e || n.data(this[c], "olddisplay", n.css(this[c], "display"))
            }
            for (var c = 0, d = this.length; d > c; c++) this[c].style.display = "none";
            return this
        },
        _toggle: n.fn.toggle,
        toggle: function(a, b) {
            var c = "boolean" == typeof a;
            return n.isFunction(a) && n.isFunction(b) ? this._toggle.apply(this, arguments) : null == a || c ? this.each(function() {
                var b = c ? a : n(this).is(":hidden");
                n(this)[b ? "show" : "hide"]()
            }) : this.animate(i("toggle", 3), a, b)
        },
        fadeTo: function(a, b, c) {
            return this.animate({
                opacity: b
            }, a, c)
        },
        animate: function(a, b, c, d) {
            var e = n.speed(b, c, d);
            return this[e.queue === !1 ? "each" : "queue"](function() {
                var b, c = n.extend({}, e),
                    d = 1 == this.nodeType && n(this).is(":hidden"),
                    f = this;
                for (b in a) {
                    if ("hide" == a[b] && d || "show" == a[b] && !d) return c.complete.call(this);
                    "height" != b && "width" != b || !this.style || (c.display = n.css(this, "display"), c.overflow = this.style.overflow)
                }
                return null != c.overflow && (this.style.overflow = "hidden"), c.curAnim = n.extend({}, a), n.each(a, function(b, e) {
                    var g = new n.fx(f, c, b);
                    if (/toggle|show|hide/.test(e)) g["toggle" == e ? d ? "show" : "hide" : e](a);
                    else {
                        var h = e.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                            i = g.cur(!0) || 0;
                        if (h) {
                            var j = parseFloat(h[2]),
                                k = h[3] || "px";
                            "px" != k && (f.style[b] = (j || 1) + k, i = (j || 1) / g.cur(!0) * i, f.style[b] = i + k), h[1] && (j = ("-=" == h[1] ? -1 : 1) * j + i), g.custom(i, j, k)
                        } else g.custom(i, e, "")
                    }
                }), !0
            })
        },
        stop: function(a, b) {
            var c = n.timers;
            return a && this.queue([]), this.each(function() {
                for (var a = c.length - 1; a >= 0; a--) c[a].elem == this && (b && c[a](!0), c.splice(a, 1))
            }), b || this.dequeue(), this
        }
    }), n.each({
        slideDown: i("show", 1),
        slideUp: i("hide", 1),
        slideToggle: i("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        }
    }, function(a, b) {
        n.fn[a] = function(a, c) {
            return this.animate(b, a, c)
        }
    }), n.extend({
        speed: function(a, b, c) {
            var d = "object" == typeof a ? a : {
                complete: c || !c && b || n.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !n.isFunction(b) && b
            };
            return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : n.fx.speeds[d.duration] || n.fx.speeds._default, d.old = d.complete, d.complete = function() {
                d.queue !== !1 && n(this).dequeue(), n.isFunction(d.old) && d.old.call(this)
            }, d
        },
        easing: {
            linear: function(a, b, c, d) {
                return c + d * a
            },
            swing: function(a, b, c, d) {
                return (-Math.cos(a * Math.PI) / 2 + .5) * d + c
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig || (b.orig = {})
        }
    }), n.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (n.fx.step[this.prop] || n.fx.step._default)(this), "height" != this.prop && "width" != this.prop || !this.elem.style || (this.elem.style.display = "block")
        },
        cur: function(a) {
            if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop])) return this.elem[this.prop];
            var b = parseFloat(n.css(this.elem, this.prop, a));
            return b && b > -1e4 ? b : parseFloat(n.curCSS(this.elem, this.prop)) || 0
        },
        custom: function(a, c, d) {
            function e(a) {
                return f.step(a)
            }
            this.startTime = b(), this.start = a, this.end = c, this.unit = d || this.unit || "px", this.now = this.start, this.pos = this.state = 0;
            var f = this;
            e.elem = this.elem, e() && n.timers.push(e) && !B && (B = setInterval(function() {
                for (var a = n.timers, b = 0; b < a.length; b++) a[b]() || a.splice(b--, 1);
                a.length || (clearInterval(B), B = j)
            }, 13))
        },
        show: function() {
            this.options.orig[this.prop] = n.attr(this.elem.style, this.prop), this.options.show = !0, this.custom("width" == this.prop || "height" == this.prop ? 1 : 0, this.cur()), n(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = n.attr(this.elem.style, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(a) {
            var c = b();
            if (a || c >= this.options.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), this.options.curAnim[this.prop] = !0;
                var d = !0;
                for (var e in this.options.curAnim) this.options.curAnim[e] !== !0 && (d = !1);
                if (d) {
                    if (null != this.options.display && (this.elem.style.overflow = this.options.overflow, this.elem.style.display = this.options.display, "none" == n.css(this.elem, "display") && (this.elem.style.display = "block")), this.options.hide && n(this.elem).hide(), this.options.hide || this.options.show)
                        for (var f in this.options.curAnim) n.attr(this.elem.style, f, this.options.orig[f]);
                    this.options.complete.call(this.elem)
                }
                return !1
            }
            var g = c - this.startTime;
            return this.state = g / this.options.duration, this.pos = n.easing[this.options.easing || (n.easing.swing ? "swing" : "linear")](this.state, g, 0, 1, this.options.duration), this.now = this.start + (this.end - this.start) * this.pos, this.update(), !0
        }
    }, n.extend(n.fx, {
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                n.attr(a.elem.style, "opacity", a.now)
            },
            _default: function(a) {
                a.elem.style && null != a.elem.style[a.prop] ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), n.fn.offset = document.documentElement.getBoundingClientRect ? function() {
        if (!this[0]) return {
            top: 0,
            left: 0
        };
        if (this[0] === this[0].ownerDocument.body) return n.offset.bodyOffset(this[0]);
        var a = this[0].getBoundingClientRect(),
            b = this[0].ownerDocument,
            c = b.body,
            d = b.documentElement,
            e = d.clientTop || c.clientTop || 0,
            f = d.clientLeft || c.clientLeft || 0,
            g = a.top + (self.pageYOffset || n.boxModel && d.scrollTop || c.scrollTop) - e,
            h = a.left + (self.pageXOffset || n.boxModel && d.scrollLeft || c.scrollLeft) - f;
        return {
            top: g,
            left: h
        }
    } : function() {
        if (!this[0]) return {
            top: 0,
            left: 0
        };
        if (this[0] === this[0].ownerDocument.body) return n.offset.bodyOffset(this[0]);
        n.offset.initialized || n.offset.initialize();
        for (var a, b = this[0], c = b.offsetParent, d = b, e = b.ownerDocument, f = e.documentElement, g = e.body, h = e.defaultView, i = h.getComputedStyle(b, null), j = b.offsetTop, k = b.offsetLeft;
            (b = b.parentNode) && b !== g && b !== f;) a = h.getComputedStyle(b, null), j -= b.scrollTop, k -= b.scrollLeft, b === c && (j += b.offsetTop, k += b.offsetLeft, !n.offset.doesNotAddBorder || n.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(b.tagName) || (j += parseInt(a.borderTopWidth, 10) || 0, k += parseInt(a.borderLeftWidth, 10) || 0), d = c, c = b.offsetParent), n.offset.subtractsBorderForOverflowNotVisible && "visible" !== a.overflow && (j += parseInt(a.borderTopWidth, 10) || 0, k += parseInt(a.borderLeftWidth, 10) || 0), i = a;
        return ("relative" === i.position || "static" === i.position) && (j += g.offsetTop, k += g.offsetLeft), "fixed" === i.position && (j += Math.max(f.scrollTop, g.scrollTop), k += Math.max(f.scrollLeft, g.scrollLeft)), {
            top: j,
            left: k
        }
    }, n.offset = {
        initialize: function() {
            if (!this.initialized) {
                var a, b, c, d, e, f = document.body,
                    g = document.createElement("div"),
                    h = f.style.marginTop,
                    i = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';
                d = {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    margin: 0,
                    border: 0,
                    width: "1px",
                    height: "1px",
                    visibility: "hidden"
                };
                for (e in d) g.style[e] = d[e];
                g.innerHTML = i, f.insertBefore(g, f.firstChild), a = g.firstChild, b = a.firstChild, c = a.nextSibling.firstChild.firstChild, this.doesNotAddBorder = 5 !== b.offsetTop, this.doesAddBorderForTableAndCells = 5 === c.offsetTop, a.style.overflow = "hidden", a.style.position = "relative", this.subtractsBorderForOverflowNotVisible = -5 === b.offsetTop, f.style.marginTop = "1px", this.doesNotIncludeMarginInBodyOffset = 0 === f.offsetTop, f.style.marginTop = h, f.removeChild(g), this.initialized = !0
            }
        },
        bodyOffset: function(a) {
            n.offset.initialized || n.offset.initialize();
            var b = a.offsetTop,
                c = a.offsetLeft;
            return n.offset.doesNotIncludeMarginInBodyOffset && (b += parseInt(n.curCSS(a, "marginTop", !0), 10) || 0, c += parseInt(n.curCSS(a, "marginLeft", !0), 10) || 0), {
                top: b,
                left: c
            }
        }
    }, n.fn.extend({
        position: function() {
            var a;
            if (this[0]) {
                var b = this.offsetParent(),
                    d = this.offset(),
                    e = /^body|html$/i.test(b[0].tagName) ? {
                        top: 0,
                        left: 0
                    } : b.offset();
                d.top -= c(this, "marginTop"), d.left -= c(this, "marginLeft"), e.top += c(b, "borderTopWidth"), e.left += c(b, "borderLeftWidth"), a = {
                    top: d.top - e.top,
                    left: d.left - e.left
                }
            }
            return a
        },
        offsetParent: function() {
            for (var a = this[0].offsetParent || document.body; a && !/^body|html$/i.test(a.tagName) && "static" == n.css(a, "position");) a = a.offsetParent;
            return n(a)
        }
    }), n.each(["Left", "Top"], function(a, b) {
        var c = "scroll" + b;
        n.fn[c] = function(b) {
            return this[0] ? b !== j ? this.each(function() {
                this == k || this == document ? k.scrollTo(a ? n(k).scrollLeft() : b, a ? b : n(k).scrollTop()) : this[c] = b
            }) : this[0] == k || this[0] == document ? self[a ? "pageYOffset" : "pageXOffset"] || n.boxModel && document.documentElement[c] || document.body[c] : this[0][c] : null
        }
    }), n.each(["Height", "Width"], function(a, b) {
        var c = b.toLowerCase();
        n.fn["inner" + b] = function() {
            return this[0] ? n.css(this[0], c, !1, "padding") : null
        }, n.fn["outer" + b] = function(a) {
            return this[0] ? n.css(this[0], c, !1, a ? "margin" : "border") : null
        };
        var d = b.toLowerCase();
        n.fn[d] = function(a) {
            return this[0] == k ? "CSS1Compat" == document.compatMode && document.documentElement["client" + b] || document.body["client" + b] : this[0] == document ? Math.max(document.documentElement["client" + b], document.body["scroll" + b], document.documentElement["scroll" + b], document.body["offset" + b], document.documentElement["offset" + b]) : a === j ? this.length ? n.css(this[0], d) : null : this.css(d, "string" == typeof a ? a : a + "px")
        }
    })
}(), window.Modernizr = function(a, b, c) {
        function d(a) {
            t.cssText = a
        }

        function e(a, b) {
            return d(u.join(a + ";") + (b || ""))
        }

        function f(a, b) {
            return typeof a === b
        }

        function g(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function h(a, b) {
            for (var d in a) {
                var e = a[d];
                if (!g(e, "-") && t[e] !== c) return "pfx" == b ? e : !0
            }
            return !1
        }

        function i(a, b, d) {
            for (var e in a) {
                var g = b[a[e]];
                if (g !== c) return d === !1 ? a[e] : f(g, "function") ? g.bind(d || b) : g
            }
            return !1
        }

        function j(a, b, c) {
            var d = a.charAt(0).toUpperCase() + a.slice(1),
                e = (a + " " + w.join(d + " ") + d).split(" ");
            return f(b, "string") || f(b, "undefined") ? h(e, b) : (e = (a + " " + x.join(d + " ") + d).split(" "), i(e, b, c))
        }
        var k, l, m, n = "2.7.1",
            o = {},
            p = !0,
            q = b.documentElement,
            r = "modernizr",
            s = b.createElement(r),
            t = s.style,
            u = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
            v = "Webkit Moz O ms",
            w = v.split(" "),
            x = v.toLowerCase().split(" "),
            y = {},
            z = [],
            A = z.slice,
            B = function(a, c, d, e) {
                var f, g, h, i, j = b.createElement("div"),
                    k = b.body,
                    l = k || b.createElement("body");
                if (parseInt(d, 10))
                    for (; d--;) h = b.createElement("div"), h.id = e ? e[d] : r + (d + 1), j.appendChild(h);
                return f = ["&#173;", '<style id="s', r, '">', a, "</style>"].join(""), j.id = r, (k ? j : l).innerHTML += f, l.appendChild(j), k || (l.style.background = "", l.style.overflow = "hidden", i = q.style.overflow, q.style.overflow = "hidden", q.appendChild(l)), g = c(j, a), k ? j.parentNode.removeChild(j) : (l.parentNode.removeChild(l), q.style.overflow = i), !!g
            },
            C = {}.hasOwnProperty;
        m = f(C, "undefined") || f(C.call, "undefined") ? function(a, b) {
            return b in a && f(a.constructor.prototype[b], "undefined")
        } : function(a, b) {
            return C.call(a, b)
        }, Function.prototype.bind || (Function.prototype.bind = function(a) {
            var b = this;
            if ("function" != typeof b) throw new TypeError;
            var c = A.call(arguments, 1),
                d = function() {
                    if (this instanceof d) {
                        var e = function() {};
                        e.prototype = b.prototype;
                        var f = new e,
                            g = b.apply(f, c.concat(A.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return b.apply(a, c.concat(A.call(arguments)))
                };
            return d
        }), y.touch = function() {
            var c;
            return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : B(["@media (", u.join("touch-enabled),("), r, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
                c = 9 === a.offsetTop
            }), c
        }, y.rgba = function() {
            return d("background-color:rgba(150,255,150,.5)"), g(t.backgroundColor, "rgba")
        }, y.opacity = function() {
            return e("opacity:.55"), /^0.55$/.test(t.opacity)
        }, y.cssgradients = function() {
            var a = "background-image:",
                b = "gradient(linear,left top,right bottom,from(#9f9),to(white));",
                c = "linear-gradient(left top,#9f9, white);";
            return d((a + "-webkit- ".split(" ").join(b + a) + u.join(c + a)).slice(0, -a.length)), g(t.backgroundImage, "gradient")
        }, y.csstransforms = function() {
            return !!j("transform")
        }, y.csstransitions = function() {
            return j("transition")
        };
        for (var D in y) m(y, D) && (l = D.toLowerCase(), o[l] = y[D](), z.push((o[l] ? "" : "no-") + l));
        return o.addTest = function(a, b) {
            if ("object" == typeof a)
                for (var d in a) m(a, d) && o.addTest(d, a[d]);
            else {
                if (a = a.toLowerCase(), o[a] !== c) return o;
                b = "function" == typeof b ? b() : b, "undefined" != typeof p && p && (q.className += " " + (b ? "" : "no-") + a), o[a] = b
            }
            return o
        }, d(""), s = k = null, o._version = n, o._prefixes = u, o._domPrefixes = x, o._cssomPrefixes = w, o.testProp = function(a) {
            return h([a])
        }, o.testAllProps = j, o.testStyles = B, o.prefixed = function(a, b, c) {
            return b ? j(a, b, c) : j(a, "pfx")
        }, q.className = q.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (p ? " js " + z.join(" ") : ""), o
    }(this, this.document),
    function(a, b, c) {
        function d(a) {
            return "[object Function]" == q.call(a)
        }

        function e(a) {
            return "string" == typeof a
        }

        function f() {}

        function g(a) {
            return !a || "loaded" == a || "complete" == a || "uninitialized" == a
        }

        function h() {
            var a = r.shift();
            s = 1, a ? a.t ? o(function() {
                ("c" == a.t ? m.injectCss : m.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
            }, 0) : (a(), h()) : s = 0
        }

        function i(a, c, d, e, f, i, j) {
            function k(b) {
                if (!n && g(l.readyState) && (t.r = n = 1, !s && h(), l.onload = l.onreadystatechange = null, b)) {
                    "img" != a && o(function() {
                        v.removeChild(l)
                    }, 50);
                    for (var d in A[c]) A[c].hasOwnProperty(d) && A[c][d].onload()
                }
            }
            var j = j || m.errorTimeout,
                l = b.createElement(a),
                n = 0,
                q = 0,
                t = {
                    t: d,
                    s: c,
                    e: f,
                    a: i,
                    x: j
                };
            1 === A[c] && (q = 1, A[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
                k.call(this, q)
            }, r.splice(e, 0, t), "img" != a && (q || 2 === A[c] ? (v.insertBefore(l, u ? null : p), o(k, j)) : A[c].push(l))
        }

        function j(a, b, c, d, f) {
            return s = 0, b = b || "j", e(a) ? i("c" == b ? x : w, a, b, this.i++, c, d, f) : (r.splice(this.i++, 0, a), 1 == r.length && h()), this
        }

        function k() {
            var a = m;
            return a.loader = {
                load: j,
                i: 0
            }, a
        }
        var l, m, n = b.documentElement,
            o = a.setTimeout,
            p = b.getElementsByTagName("script")[0],
            q = {}.toString,
            r = [],
            s = 0,
            t = "MozAppearance" in n.style,
            u = t && !!b.createRange().compareNode,
            v = u ? n : p.parentNode,
            n = a.opera && "[object Opera]" == q.call(a.opera),
            n = !!b.attachEvent && !n,
            w = t ? "object" : n ? "script" : "img",
            x = n ? "script" : w,
            y = Array.isArray || function(a) {
                return "[object Array]" == q.call(a)
            },
            z = [],
            A = {},
            B = {
                timeout: function(a, b) {
                    return b.length && (a.timeout = b[0]), a
                }
            };
        m = function(a) {
            function b(a) {
                var b, c, d, a = a.split("!"),
                    e = z.length,
                    f = a.pop(),
                    g = a.length,
                    f = {
                        url: f,
                        origUrl: f,
                        prefixes: a
                    };
                for (c = 0; g > c; c++) d = a[c].split("="), (b = B[d.shift()]) && (f = b(f, d));
                for (c = 0; e > c; c++) f = z[c](f);
                return f
            }

            function g(a, e, f, g, h) {
                var i = b(a),
                    j = i.autoCallback;
                i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (A[i.url] ? i.noexec = !0 : A[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                    k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), A[i.url] = 2
                })))
            }

            function h(a, b) {
                function c(a, c) {
                    if (a) {
                        if (e(a)) c || (l = function() {
                            var a = [].slice.call(arguments);
                            m.apply(this, a), n()
                        }), g(a, l, b, 0, j);
                        else if (Object(a) === a)
                            for (i in h = function() {
                                    var b, c = 0;
                                    for (b in a) a.hasOwnProperty(b) && c++;
                                    return c
                                }(), a) a.hasOwnProperty(i) && (!c && !--h && (d(l) ? l = function() {
                                var a = [].slice.call(arguments);
                                m.apply(this, a), n()
                            } : l[i] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b), n()
                                }
                            }(m[i])), g(a[i], l, b, i, j))
                    } else !c && n()
                }
                var h, i, j = !!a.test,
                    k = a.load || a.both,
                    l = a.callback || f,
                    m = l,
                    n = a.complete || f;
                c(j ? a.yep : a.nope, !!k), k && c(k)
            }
            var i, j, l = this.yepnope.loader;
            if (e(a)) g(a, 0, l, 0);
            else if (y(a))
                for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : y(j) ? m(j) : Object(j) === j && h(j, l);
            else Object(a) === a && h(a, l)
        }, m.addPrefix = function(a, b) {
            B[a] = b
        }, m.addFilter = function(a) {
            z.push(a)
        }, m.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", l = function() {
            b.removeEventListener("DOMContentLoaded", l, 0), b.readyState = "complete"
        }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
            var k, l, n = b.createElement("script"),
                e = e || m.errorTimeout;
            n.src = a;
            for (l in d) n.setAttribute(l, d[l]);
            c = j ? h : c || f, n.onreadystatechange = n.onload = function() {
                !k && g(n.readyState) && (k = 1, c(), n.onload = n.onreadystatechange = null)
            }, o(function() {
                k || (k = 1, c(1))
            }, e), i ? n.onload() : p.parentNode.insertBefore(n, p)
        }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
            var j, e = b.createElement("link"),
                c = i ? h : c || f;
            e.href = a, e.rel = "stylesheet", e.type = "text/css";
            for (j in d) e.setAttribute(j, d[j]);
            g || (p.parentNode.insertBefore(e, p), o(c, 0))
        }
    }(this, document), Modernizr.load = function() {
        yepnope.apply(window, [].slice.call(arguments, 0))
    },
    function(a, b) {
        "use strict";

        function c() {
            if (!d.READY) {
                d.event.determineEventTypes();
                for (var a in d.gestures) d.gestures.hasOwnProperty(a) && d.detection.register(d.gestures[a]);
                d.event.onTouch(d.DOCUMENT, d.EVENT_MOVE, d.detection.detect), d.event.onTouch(d.DOCUMENT, d.EVENT_END, d.detection.detect), d.READY = !0
            }
        }
        var d = function(a, b) {
            return new d.Instance(a, b || {})
        };
        d.defaults = {
            stop_browser_behavior: {
                userSelect: "none",
                touchAction: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        }, d.HAS_POINTEREVENTS = navigator.pointerEnabled || navigator.msPointerEnabled, d.HAS_TOUCHEVENTS = "ontouchstart" in a, d.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i, d.NO_MOUSEEVENTS = d.HAS_TOUCHEVENTS && navigator.userAgent.match(d.MOBILE_REGEX), d.EVENT_TYPES = {}, d.DIRECTION_DOWN = "down", d.DIRECTION_LEFT = "left", d.DIRECTION_UP = "up", d.DIRECTION_RIGHT = "right", d.POINTER_MOUSE = "mouse", d.POINTER_TOUCH = "touch", d.POINTER_PEN = "pen", d.EVENT_START = "start", d.EVENT_MOVE = "move", d.EVENT_END = "end", d.DOCUMENT = document, d.plugins = {}, d.READY = !1, d.Instance = function(a, b) {
            var e = this;
            return c(), this.element = a, this.enabled = !0, this.options = d.utils.extend(d.utils.extend({}, d.defaults), b || {}), this.options.stop_browser_behavior && d.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior), d.event.onTouch(a, d.EVENT_START, function(a) {
                e.enabled && d.detection.startDetect(e, a)
            }), this
        }, d.Instance.prototype = {
            on: function(a, b) {
                for (var c = a.split(" "), d = 0; d < c.length; d++) this.element.addEventListener ? this.element.addEventListener(c[d], b, !1) : this.element.attachEvent(c[d], b);
                return this
            },
            off: function(a, b) {
                for (var c = a.split(" "), d = 0; d < c.length; d++) this.element.removeEventListener(c[d], b, !1);
                return this
            },
            trigger: function(a, b) {
                var c = d.DOCUMENT.createEvent("Event");
                c.initEvent(a, !0, !0), c.gesture = b;
                var e = this.element;
                return d.utils.hasParent(b.target, e) && (e = b.target), e.dispatchEvent(c), this
            },
            enable: function(a) {
                return this.enabled = a, this
            }
        };
        var e = null,
            f = !1,
            g = !1;
        d.event = {
            bindDom: function(a, b, c) {
                for (var d = b.split(" "), e = 0; e < d.length; e++) a.addEventListener ? a.addEventListener(d[e], c, !1) : a.attachEvent(d[e], c)
            },
            onTouch: function(a, b, c) {
                var h = this;
                this.bindDom(a, d.EVENT_TYPES[b], function(i) {
                    var j = i.type.toLowerCase();
                    if (!j.match(/mouse/) || !g) {
                        (j.match(/touch/) || j.match(/pointerdown/) || j.match(/mouse/) && 1 === i.which) && (f = !0), j.match(/touch|pointer/) && (g = !0);
                        var k = 0;
                        f && (d.HAS_POINTEREVENTS && b != d.EVENT_END ? k = d.PointerEvent.updatePointer(b, i) : j.match(/touch/) ? k = i.touches.length : g || (k = j.match(/up/) ? 0 : 1), k > 0 && b == d.EVENT_END ? b = d.EVENT_MOVE : k || (b = d.EVENT_END), k || null === e ? e = i : i = e, c.call(d.detection, h.collectEventData(a, b, i)), d.HAS_POINTEREVENTS && b == d.EVENT_END && (k = d.PointerEvent.updatePointer(b, i))), k || (e = null, f = !1, g = !1, d.PointerEvent.reset())
                    }
                })
            },
            determineEventTypes: function() {
                var a;
                a = d.HAS_POINTEREVENTS ? d.PointerEvent.getEvents() : d.NO_MOUSEEVENTS ? ["touchstart", "touchmove", "touchend touchcancel"] : ["touchstart mousedown", "touchmove mousemove", "touchend touchcancel mouseup"], d.EVENT_TYPES[d.EVENT_START] = a[0], d.EVENT_TYPES[d.EVENT_MOVE] = a[1], d.EVENT_TYPES[d.EVENT_END] = a[2]
            },
            getTouchList: function(a) {
                return d.HAS_POINTEREVENTS ? d.PointerEvent.getTouchList() : a.touches ? a.touches : [{
                    identifier: 1,
                    pageX: a.pageX,
                    pageY: a.pageY,
                    target: a.target
                }]
            },
            collectEventData: function(a, b, c) {
                var e = this.getTouchList(c, b),
                    f = d.POINTER_TOUCH;
                return (c.type.match(/mouse/) || d.PointerEvent.matchType(d.POINTER_MOUSE, c)) && (f = d.POINTER_MOUSE), {
                    center: d.utils.getCenter(e),
                    timeStamp: (new Date).getTime(),
                    target: c.target,
                    touches: e,
                    eventType: b,
                    pointerType: f,
                    srcEvent: c,
                    preventDefault: function() {
                        this.srcEvent.preventManipulation && this.srcEvent.preventManipulation(), this.srcEvent.preventDefault && this.srcEvent.preventDefault()
                    },
                    stopPropagation: function() {
                        this.srcEvent.stopPropagation()
                    },
                    stopDetect: function() {
                        return d.detection.stopDetect()
                    }
                }
            }
        }, d.PointerEvent = {
            pointers: {},
            getTouchList: function() {
                var a = this,
                    b = [];
                return Object.keys(a.pointers).sort().forEach(function(c) {
                    b.push(a.pointers[c])
                }), b
            },
            updatePointer: function(a, b) {
                return a == d.EVENT_END ? this.pointers = {} : (b.identifier = b.pointerId, this.pointers[b.pointerId] = b), Object.keys(this.pointers).length
            },
            matchType: function(a, b) {
                if (!b.pointerType) return !1;
                var c = {};
                return c[d.POINTER_MOUSE] = b.pointerType == b.MSPOINTER_TYPE_MOUSE || b.pointerType == d.POINTER_MOUSE, c[d.POINTER_TOUCH] = b.pointerType == b.MSPOINTER_TYPE_TOUCH || b.pointerType == d.POINTER_TOUCH, c[d.POINTER_PEN] = b.pointerType == b.MSPOINTER_TYPE_PEN || b.pointerType == d.POINTER_PEN, c[a]
            },
            getEvents: function() {
                return ["pointerdown MSPointerDown", "pointermove MSPointerMove", "pointerup pointercancel MSPointerUp MSPointerCancel"]
            },
            reset: function() {
                this.pointers = {}
            }
        }, d.utils = {
            extend: function(a, c, d) {
                for (var e in c) a[e] !== b && d || (a[e] = c[e]);
                return a
            },
            hasParent: function(a, b) {
                for (; a;) {
                    if (a == b) return !0;
                    a = a.parentNode
                }
                return !1
            },
            getCenter: function(a) {
                for (var b = [], c = [], d = 0, e = a.length; e > d; d++) b.push(a[d].pageX), c.push(a[d].pageY);
                return {
                    pageX: (Math.min.apply(Math, b) + Math.max.apply(Math, b)) / 2,
                    pageY: (Math.min.apply(Math, c) + Math.max.apply(Math, c)) / 2
                }
            },
            getVelocity: function(a, b, c) {
                return {
                    x: Math.abs(b / a) || 0,
                    y: Math.abs(c / a) || 0
                }
            },
            getAngle: function(a, b) {
                var c = b.pageY - a.pageY,
                    d = b.pageX - a.pageX;
                return 180 * Math.atan2(c, d) / Math.PI
            },
            getDirection: function(a, b) {
                var c = Math.abs(a.pageX - b.pageX),
                    e = Math.abs(a.pageY - b.pageY);
                return c >= e ? a.pageX - b.pageX > 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT : a.pageY - b.pageY > 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN
            },
            getDistance: function(a, b) {
                var c = b.pageX - a.pageX,
                    d = b.pageY - a.pageY;
                return Math.sqrt(c * c + d * d)
            },
            getScale: function(a, b) {
                return a.length >= 2 && b.length >= 2 ? this.getDistance(b[0], b[1]) / this.getDistance(a[0], a[1]) : 1
            },
            getRotation: function(a, b) {
                return a.length >= 2 && b.length >= 2 ? this.getAngle(b[1], b[0]) - this.getAngle(a[1], a[0]) : 0
            },
            isVertical: function(a) {
                return a == d.DIRECTION_UP || a == d.DIRECTION_DOWN
            },
            stopDefaultBrowserBehavior: function(a, b) {
                var c, d = ["webkit", "khtml", "moz", "ms", "o", ""];
                if (b && a.style) {
                    for (var e = 0; e < d.length; e++)
                        for (var f in b) b.hasOwnProperty(f) && (c = f, d[e] && (c = d[e] + c.substring(0, 1).toUpperCase() + c.substring(1)), a.style[c] = b[f]);
                    "none" == b.userSelect && (a.onselectstart = function() {
                        return !1
                    })
                }
            }
        }, d.detection = {
            gestures: [],
            current: null,
            previous: null,
            stopped: !1,
            startDetect: function(a, b) {
                this.current || (this.stopped = !1, this.current = {
                    inst: a,
                    startEvent: d.utils.extend({}, b),
                    lastEvent: !1,
                    name: ""
                }, this.detect(b))
            },
            detect: function(a) {
                if (this.current && !this.stopped) {
                    a = this.extendEventData(a);
                    for (var b = this.current.inst.options, c = 0, e = this.gestures.length; e > c; c++) {
                        var f = this.gestures[c];
                        if (!this.stopped && b[f.name] !== !1 && f.handler.call(f, a, this.current.inst) === !1) {
                            this.stopDetect();
                            break
                        }
                    }
                    return this.current && (this.current.lastEvent = a), a.eventType == d.EVENT_END && !a.touches.length - 1 && this.stopDetect(), a
                }
            },
            stopDetect: function() {
                this.previous = d.utils.extend({}, this.current), this.current = null, this.stopped = !0
            },
            extendEventData: function(a) {
                var b = this.current.startEvent;
                if (b && (a.touches.length != b.touches.length || a.touches === b.touches)) {
                    b.touches = [];
                    for (var c = 0, e = a.touches.length; e > c; c++) b.touches.push(d.utils.extend({}, a.touches[c]))
                }
                var f = a.timeStamp - b.timeStamp,
                    g = a.center.pageX - b.center.pageX,
                    h = a.center.pageY - b.center.pageY,
                    i = d.utils.getVelocity(f, g, h);
                return d.utils.extend(a, {
                    deltaTime: f,
                    deltaX: g,
                    deltaY: h,
                    velocityX: i.x,
                    velocityY: i.y,
                    distance: d.utils.getDistance(b.center, a.center),
                    angle: d.utils.getAngle(b.center, a.center),
                    direction: d.utils.getDirection(b.center, a.center),
                    scale: d.utils.getScale(b.touches, a.touches),
                    rotation: d.utils.getRotation(b.touches, a.touches),
                    startEvent: b
                }), a
            },
            register: function(a) {
                var c = a.defaults || {};
                return c[a.name] === b && (c[a.name] = !0), d.utils.extend(d.defaults, c, !0), a.index = a.index || 1e3, this.gestures.push(a), this.gestures.sort(function(a, b) {
                    return a.index < b.index ? -1 : a.index > b.index ? 1 : 0
                }), this.gestures
            }
        }, d.gestures = d.gestures || {}, d.gestures.Hold = {
            name: "hold",
            index: 10,
            defaults: {
                hold_timeout: 500,
                hold_threshold: 1
            },
            timer: null,
            handler: function(a, b) {
                switch (a.eventType) {
                    case d.EVENT_START:
                        clearTimeout(this.timer), d.detection.current.name = this.name, this.timer = setTimeout(function() {
                            "hold" == d.detection.current.name && b.trigger("hold", a)
                        }, b.options.hold_timeout);
                        break;
                    case d.EVENT_MOVE:
                        a.distance > b.options.hold_threshold && clearTimeout(this.timer);
                        break;
                    case d.EVENT_END:
                        clearTimeout(this.timer)
                }
            }
        }, d.gestures.Tap = {
            name: "tap",
            index: 100,
            defaults: {
                tap_max_touchtime: 250,
                tap_max_distance: 10,
                tap_always: !0,
                doubletap_distance: 20,
                doubletap_interval: 300
            },
            handler: function(a, b) {
                if (a.eventType == d.EVENT_END) {
                    var c = d.detection.previous,
                        e = !1;
                    if (a.deltaTime > b.options.tap_max_touchtime || a.distance > b.options.tap_max_distance) return;
                    c && "tap" == c.name && a.timeStamp - c.lastEvent.timeStamp < b.options.doubletap_interval && a.distance < b.options.doubletap_distance && (b.trigger("doubletap", a), e = !0), (!e || b.options.tap_always) && (d.detection.current.name = "tap", b.trigger(d.detection.current.name, a))
                }
            }
        }, d.gestures.Swipe = {
            name: "swipe",
            index: 40,
            defaults: {
                swipe_max_touches: 1,
                swipe_velocity: .7
            },
            handler: function(a, b) {
                if (a.eventType == d.EVENT_END) {
                    if (b.options.swipe_max_touches > 0 && a.touches.length > b.options.swipe_max_touches) return;
                    (a.velocityX > b.options.swipe_velocity || a.velocityY > b.options.swipe_velocity) && (b.trigger(this.name, a), b.trigger(this.name + a.direction, a))
                }
            }
        }, d.gestures.Drag = {
            name: "drag",
            index: 50,
            defaults: {
                drag_min_distance: 10,
                drag_max_touches: 1,
                drag_block_horizontal: !1,
                drag_block_vertical: !1,
                drag_lock_to_axis: !1,
                drag_lock_min_distance: 25
            },
            triggered: !1,
            handler: function(a, b) {
                if (d.detection.current.name != this.name && this.triggered) return b.trigger(this.name + "end", a), void(this.triggered = !1);
                if (!(b.options.drag_max_touches > 0 && a.touches.length > b.options.drag_max_touches)) switch (a.eventType) {
                    case d.EVENT_START:
                        this.triggered = !1;
                        break;
                    case d.EVENT_MOVE:
                        if (a.distance < b.options.drag_min_distance && d.detection.current.name != this.name) return;
                        d.detection.current.name = this.name, (d.detection.current.lastEvent.drag_locked_to_axis || b.options.drag_lock_to_axis && b.options.drag_lock_min_distance <= a.distance) && (a.drag_locked_to_axis = !0);
                        var c = d.detection.current.lastEvent.direction;
                        a.drag_locked_to_axis && c !== a.direction && (a.direction = d.utils.isVertical(c) ? a.deltaY < 0 ? d.DIRECTION_UP : d.DIRECTION_DOWN : a.deltaX < 0 ? d.DIRECTION_LEFT : d.DIRECTION_RIGHT), this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), b.trigger(this.name + a.direction, a), (b.options.drag_block_vertical && d.utils.isVertical(a.direction) || b.options.drag_block_horizontal && !d.utils.isVertical(a.direction)) && a.preventDefault();
                        break;
                    case d.EVENT_END:
                        this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
                }
            }
        }, d.gestures.Transform = {
            name: "transform",
            index: 45,
            defaults: {
                transform_min_scale: .01,
                transform_min_rotation: 1,
                transform_always_block: !1
            },
            triggered: !1,
            handler: function(a, b) {
                if (d.detection.current.name != this.name && this.triggered) return b.trigger(this.name + "end", a), void(this.triggered = !1);
                if (!(a.touches.length < 2)) switch (b.options.transform_always_block && a.preventDefault(), a.eventType) {
                    case d.EVENT_START:
                        this.triggered = !1;
                        break;
                    case d.EVENT_MOVE:
                        var c = Math.abs(1 - a.scale),
                            e = Math.abs(a.rotation);
                        if (c < b.options.transform_min_scale && e < b.options.transform_min_rotation) return;
                        d.detection.current.name = this.name, this.triggered || (b.trigger(this.name + "start", a), this.triggered = !0), b.trigger(this.name, a), e > b.options.transform_min_rotation && b.trigger("rotate", a), c > b.options.transform_min_scale && (b.trigger("pinch", a), b.trigger("pinch" + (a.scale < 1 ? "in" : "out"), a));
                        break;
                    case d.EVENT_END:
                        this.triggered && b.trigger(this.name + "end", a), this.triggered = !1
                }
            }
        }, d.gestures.Touch = {
            name: "touch",
            index: -1 / 0,
            defaults: {
                prevent_default: !1,
                prevent_mouseevents: !1
            },
            handler: function(a, b) {
                return b.options.prevent_mouseevents && a.pointerType == d.POINTER_MOUSE ? void a.stopDetect() : (b.options.prevent_default && a.preventDefault(), void(a.eventType == d.EVENT_START && b.trigger(this.name, a)))
            }
        }, d.gestures.Release = {
            name: "release",
            index: 1 / 0,
            handler: function(a, b) {
                a.eventType == d.EVENT_END && b.trigger(this.name, a)
            }
        }, "object" == typeof module && "object" == typeof module.exports ? module.exports = d : (a.Hammer = d, "function" == typeof a.define && a.define.amd && a.define("hammer", [], function() {
            return d
        }))
    }(this),
    function() {
        function a() {}

        function b(a, b) {
            this.path = a, "undefined" != typeof b && null !== b ? (this.at_2x_path = b, this.perform_check = !1) : (this.at_2x_path = a.replace(/\.\w+$/, function(a) {
                return "@2x" + a
            }), this.perform_check = !0)
        }

        function c(a) {
            this.el = a, this.path = new b(this.el.getAttribute("src"), this.el.getAttribute("data-at2x"));
            var c = this;
            this.path.check_2x_variant(function(a) {
                a && c.swap()
            })
        }
        var d = "undefined" == typeof exports ? window : exports,
            e = {
                check_mime_type: !0
            };
        d.Retina = a, a.configure = function(a) {
            null == a && (a = {});
            for (var b in a) e[b] = a[b]
        }, a.init = function(a) {
            null == a && (a = d);
            var b = a.onload || new Function;
            a.onload = function() {
                var a, d, e = document.getElementsByTagName("img"),
                    f = [];
                for (a = 0; a < e.length; a++) d = e[a], f.push(new c(d));
                b()
            }
        }, a.isRetina = function() {
            var a = "(-webkit-min-device-pixel-ratio: 1.5),                      (min--moz-device-pixel-ratio: 1.5),                      (-o-min-device-pixel-ratio: 3/2),                      (min-resolution: 1.5dppx)";
            return d.devicePixelRatio > 1 ? !0 : d.matchMedia && d.matchMedia(a).matches ? !0 : !1
        }, d.RetinaImagePath = b, b.confirmed_paths = [], b.prototype.is_external = function() {
            return !(!this.path.match(/^https?\:/i) || this.path.match("//" + document.domain))
        }, b.prototype.check_2x_variant = function(a) {
            var c, d = this;
            return this.is_external() ? a(!1) : this.perform_check || "undefined" == typeof this.at_2x_path || null === this.at_2x_path ? this.at_2x_path in b.confirmed_paths ? a(!0) : (c = new XMLHttpRequest, c.open("HEAD", this.at_2x_path), c.onreadystatechange = function() {
                if (4 != c.readyState) return a(!1);
                if (c.status >= 200 && c.status <= 399) {
                    if (e.check_mime_type) {
                        var f = c.getResponseHeader("Content-Type");
                        if (null == f || !f.match(/^image/i)) return a(!1)
                    }
                    return b.confirmed_paths.push(d.at_2x_path), a(!0)
                }
                return a(!1)
            }, c.send(), void 0) : a(!0)
        }, d.RetinaImage = c, c.prototype.swap = function(a) {
            function b() {
                c.el.complete ? (c.el.setAttribute("width", c.el.offsetWidth), c.el.setAttribute("height", c.el.offsetHeight), c.el.setAttribute("src", a)) : setTimeout(b, 5)
            }
            "undefined" == typeof a && (a = this.path.at_2x_path);
            var c = this;
            b()
        }, a.isRetina() && a.init(d)
    }(),
    function(a) {
        a.fn.hoverIntent = function(b, c, d) {
            var e = {
                interval: 100,
                sensitivity: 7,
                timeout: 0
            };
            e = "object" == typeof b ? a.extend(e, b) : a.isFunction(c) ? a.extend(e, {
                over: b,
                out: c,
                selector: d
            }) : a.extend(e, {
                over: b,
                out: b,
                selector: c
            });
            var f, g, h, i, j = function(a) {
                    f = a.pageX, g = a.pageY
                },
                k = function(b, c) {
                    return c.hoverIntent_t = clearTimeout(c.hoverIntent_t), Math.abs(h - f) + Math.abs(i - g) < e.sensitivity ? (a(c).off("mousemove.hoverIntent", j), c.hoverIntent_s = 1, e.over.apply(c, [b])) : (h = f, i = g, c.hoverIntent_t = setTimeout(function() {
                        k(b, c)
                    }, e.interval), void 0)
                },
                l = function(a, b) {
                    return b.hoverIntent_t = clearTimeout(b.hoverIntent_t), b.hoverIntent_s = 0, e.out.apply(b, [a])
                },
                m = function(b) {
                    var c = jQuery.extend({}, b),
                        d = this;
                    d.hoverIntent_t && (d.hoverIntent_t = clearTimeout(d.hoverIntent_t)), "mouseenter" == b.type ? (h = c.pageX, i = c.pageY, a(d).on("mousemove.hoverIntent", j), 1 != d.hoverIntent_s && (d.hoverIntent_t = setTimeout(function() {
                        k(c, d)
                    }, e.interval))) : (a(d).off("mousemove.hoverIntent", j), 1 == d.hoverIntent_s && (d.hoverIntent_t = setTimeout(function() {
                        l(c, d)
                    }, e.timeout)))
                };
            return this.on({
                "mouseenter.hoverIntent": m,
                "mouseleave.hoverIntent": m
            }, e.selector)
        }
    }(jQuery), jQuery.cookie = function(a, b, c) {
        if (arguments.length > 1 && "[object Object]" !== String(b)) {
            if (c = jQuery.extend({}, c), (null === b || void 0 === b) && (c.expires = -1), "number" == typeof c.expires) {
                var d = c.expires,
                    e = c.expires = new Date;
                e.setDate(e.getDate() + d)
            }
            return b = String(b), document.cookie = [encodeURIComponent(a), "=", c.raw ? b : encodeURIComponent(b), c.expires ? "; expires=" + c.expires.toUTCString() : "", c.path ? "; path=" + c.path : "", c.domain ? "; domain=" + c.domain : "", c.secure ? "; secure" : ""].join("")
        }
        c = b || {};
        var f, g = c.raw ? function(a) {
            return a
        } : decodeURIComponent;
        return (f = new RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)").exec(document.cookie)) ? g(f[1]) : null
    };
var ui = {
        bindEvents: function() {
            $(window).resize(function() {
                clearTimeout(window.resizeEvt), window.resizeEvt = setTimeout(function() {
                    ui.resizeEnd()
                }, 500)
            })
        },
        highlightTooltips: function(a) {
            if (Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0) a.addClass("tooltip-highlight"), setTimeout(function() {
                a.removeClass("tooltip-highlight")
            }, 1500);
            else if (Modernizr.opacity === !0)
                for (i = 0; 3 > i; i++) a.fadeTo("fast", .6).fadeTo("fast", 1)
        },
        resizeBody: function() {
            8 == $.browser.version && $slider.css({
                height: $main.outerHeight() + "px"
            })
        },
        resizeEnd: function() {
            ui.windowWidth = $(window).width(), ui.windowHeight = $(window).height(), ui._fixLegacyLayout(), ui.resizeBody(), tooltips.hide()
        },
        _fixLegacyLayout: function() {
            if (Modernizr.csstransforms !== !0 || Modernizr.csstransitions !== !0) {
                switch (windowWidth = ui.windowWidth < 768 ? 768 : ui.windowWidth, "intro" === slider.currentLevel ? (introLevelXPosition = windowWidth * (slider.currentId - 1), introLevelCss = {}, introLevelCss.left = "-" + introLevelXPosition + "px", slider.$intro.css(introLevelCss)) : (introLevelXPosition = windowWidth * (slider.introCurrentId - 1), introLevelCss = {}, introLevelCss.left = "-" + introLevelXPosition + "px", presentationLevelXPosition = windowWidth * (slider.currentId - 1), presentationLevelCss = {}, presentationLevelCss.left = "-" + presentationLevelXPosition + "px", slider.$presentation.css(presentationLevelCss), slider.$intro.css(introLevelCss)), windowHeight = ui.windowHeight < 650 ? 650 : ui.windowHeight, slider.currentLevel) {
                    case "intro":
                        yPosition = 0;
                        break;
                    case "presentation":
                        yPosition = "-" + windowHeight
                }
                css = {}, css.top = yPosition + "px", $slider.css(css)
            }
        },
        choices: {
            answers: {
                1: void 0,
                2: void 0,
                3: void 0
            },
            grandfatheredHidden: !1,
            firstTimeAnswering: !0,
            showQuestion: function(a) {
                a.addClass("revealed")
            },
            hideQuestion: function(a, b) {
                a.addClass("deselected").removeClass("revealed"), setTimeout(function() {
                    void 0 !== b && b(), a.removeClass("deselected")
                }, 500)
            },
            highlightAnswer: function(a, b) {
                ui.choices.deselectAnswer(b), a.addClass("selected")
            },
            deselectAnswer: function(a) {
                $selectedAnswer = a.find(".selected"), $selectedAnswer.addClass("deselected").removeClass("selected")
            },
            _convertNumberToText: function(a) {
                var b;
                switch (a) {
                    case 5:
                        b = "five";
                        break;
                    case 4:
                        b = "four";
                        break;
                    case 3:
                        b = "three";
                        break;
                    case 2:
                        b = "two"
                }
                return b
            },
            selectPresentation: function(a, b) {
                switch (void 0 !== slider.$chosenPresentation && (ui.choices.grandfatheredHidden = !1, slider.$chosenPresentation.hide(), slider.$currentGrandfatheredSlide.removeClass("hidden").show()), slider.$chosenPresentation = $('.presentation[data-presentation="' + chosenPresentation + '"]', $presentation), $keyItemsContainer = $(".key-items", slider.$chosenPresentation), $firstKeyItemsContainer = $keyItemsContainer.eq(0), $keyItems = $("a", $firstKeyItemsContainer), numberOfKeyItems = $keyItems.length, $keyItemsNumber = $(".first-key-items", slider.$chosenPresentation), $keyItemsNumber.text(numberOfKeyItems), slider.$currentGrandfatheredSlide = $(".grandfathered", slider.$chosenPresentation), b === !0 && (ui.choices.grandfatheredHidden = !0, $keyItemsNumber.text(numberOfKeyItems - 1), slider.$currentGrandfatheredSlide.addClass("hidden").hide()), $keyItems = $('a:not(".hidden")', $firstKeyItemsContainer), numberOfKeyItems = $keyItems.length, $firstKeyItemsContainer.removeClass("five-up four-up three-up two-up").addClass(ui.choices._convertNumberToText(numberOfKeyItems) + "-up"), $forwardButton.addClass("prompt"), setTimeout(function() {
                    $forwardButton.removeClass("prompt")
                }, 500), slider.noOfPresentationSlides = $("section:not(.hidden)", slider.$chosenPresentation).length, chosenPresentation) {
                    case "under-50-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_under50", "yes_selected");
                        break;
                    case "under-50-no-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_under50", "no_selected");
                        break;
                    case "50-100-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_50to99", "yes_selected");
                        break;
                    case "50-100-no-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_50to99", "no_selected");
                        break;
                    case "over-100-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_100ormore", "yes_selected");
                        break;
                    case "over-100-no-insurance":
                        ga("send","event", "hcr_decision_tool", "major_medical_100ormore", "no_selected");
                }
                slider.$chosenPresentation.show()
            },
            toggle: function(a) {
                switch ($question = a.parent(".question"), questionNo = parseFloat($question[0].getAttribute("data-question")), answer = a[0].getAttribute("data-answer"), answerNo = $question.children(".choice").index(a), "under-50" === ui.choices.answers[1] ? (ga("before-2010" === answer ? ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_under50", "yes_selected"] : ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_under50", "no_selected"]), ga("insurance" === answer ? ["send","event", "hcr_decision_tool", "major_medical_under50", "yes_selected"] : ["send","event", "hcr_decision_tool", "major_medical_under50", "no_selected"])) : "50-100" === ui.choices.answers[1] ? (ga("before-2010" === answer ? ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_50to99", "yes_selected"] : ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_50to99", "no_selected"]), ga("insurance" === answer ? ["send","event", "hcr_decision_tool", "major_medical_50to99", "yes_selected"] : ["send","event", "hcr_decision_tool", "major_medical_50to99", "no_selected"])) : "over-100" === ui.choices.answers[1] && (ga("before-2010" === answer ? ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_100ormore", "yes_selected"] : ["send","event", "hcr_decision_tool", "offerplan_beforemarch232010_100ormore", "no_selected"]), ga("insurance" === answer ? ["send","event", "hcr_decision_tool", "major_medical_100ormore", "yes_selected"] : ["send","event", "hcr_decision_tool", "major_medical_100ormore", "no_selected"])), ui.choices.answers[questionNo] = answer, $nextQuestion = $("fieldset", $slide3).eq(questionNo), nextQuestionNo = questionNo + 1, ui.choices.highlightAnswer(a, $question), nextQuestionNo) {
                    case 2:
                        ui.choices.showQuestion($nextQuestion);
                        break;
                    case 3:
                        "insurance" === answer ? (ui.choices.showQuestion($nextQuestion), slider.presentationUnlocked = !1) : (ui.choices.answers[3] = void 0, ui.choices.hideQuestion($nextQuestion, function() {
                            ui.choices.deselectAnswer($nextQuestion)
                        }))
                }
                void 0 !== ui.choices.answers[1] && void 0 !== ui.choices.answers[2] && (chosenPresentation = ui.choices.answers[1] + "-" + ui.choices.answers[2], "no-insurance" === ui.choices.answers[2] ? (ui.choices.selectPresentation(chosenPresentation, !1), slider.presentationUnlocked = !0, ui.choices.firstTimeAnswering === !0 && (ui.choices.firstTimeAnswering = !1, slider.next())) : "after-2010" === ui.choices.answers[3] ? (ui.choices.selectPresentation(chosenPresentation, !0), slider.presentationUnlocked = !0, ui.choices.firstTimeAnswering === !0 && (ui.choices.firstTimeAnswering = !1, slider.next())) : "before-2010" === ui.choices.answers[3] && (ui.choices.selectPresentation(chosenPresentation, !1), slider.presentationUnlocked = !0, ui.choices.firstTimeAnswering === !0 && (ui.choices.firstTimeAnswering = !1, slider.next())))
            },
            prompt: function() {
                $questions = $(".question:not(.selected)", $slide3), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? ($questions.removeClass("prompt"), setTimeout(function() {
                    $questions.addClass("prompt")
                }, 50)) : ($elementToBlink = $("fieldset.revealed .question", $slide3), $elementToBlink.css({
                    visibility: "hidden"
                }), setTimeout(function() {
                    $elementToBlink.css({
                        visibility: "visible"
                    }), setTimeout(function() {
                        $elementToBlink.css({
                            visibility: "hidden"
                        }), setTimeout(function() {
                            $elementToBlink.css({
                                visibility: "visible"
                            })
                        }, 100)
                    }, 100)
                }, 100))
            },
            reset: function() {
                ui.choices.numberOfEmployees = void 0, ui.choices.medicalInsurance = void 0, slider.presentationUnlocked = !1, $(".question.selected, .question .selected", $slide3).removeClass("selected")
            }
        },
        homeButton: {
            isOpen: !1,
            show: function() {
                ui.homeButton.isOpen === !1 && (ui.homeButton.isOpen = !0, $homeButton.addClass("open"))
            },
            hide: function() {
                ui.homeButton.isOpen === !0 && (ui.homeButton.isOpen = !1, $homeButton.removeClass("open"))
            }
        },
        nav: {
            backButton: {
                isOpen: !1,
                show: function() {
                    ui.nav.backButton.isOpen === !1 && (ui.nav.backButton.isOpen = !0, $backButton.addClass("open"))
                },
                hide: function() {
                    ui.nav.backButton.isOpen === !0 && (ui.nav.backButton.isOpen = !1, $backButton.removeClass("open"))
                }
            },
            forwardButton: {
                isOpen: !0,
                show: function() {
                    ui.nav.forwardButton.isOpen === !1 && (ui.nav.forwardButton.isOpen = !0, $forwardButton.addClass("open"))
                },
                hide: function() {
                    ui.nav.forwardButton.isOpen === !0 && (ui.nav.forwardButton.isOpen = !1, $forwardButton.removeClass("open"))
                }
            }
        }
    },
    tooltips = {
        options: {
            paddingX: 20,
            paddingY: 20,
            windowPadding: 40,
            leftOffset: 20
        },
        isOpen: !1,
        hoverTimer: void 0,
        bindEvents: function() {
            $mouseElements = $(".tooltipped, .tooltip", $slider), $mouseElements.live("click", function(a) {
                "tooltip" !== $(this).attr("id") && a.preventDefault()
            }), Modernizr.touch === !0 && ($mouseElements = $(".tooltipped", $mouseElements), $slider.click(function() {
                tooltips.isOpen === !0 && tooltips.hide()
            })), $mouseElements.live("mouseover", function(a) {
                a.preventDefault(), id = $(this).attr("href") || $(this)[0].getAttribute("data-related-tooltip"), tooltips.$currentElement !== id && void 0 !== tooltips.$currentElement && (clearTimeout(tooltips.hoverTimer), tooltips.hide($(this)), tooltips.$currentElement = void 0), slider.isActive === !1 && (tooltips.$currentElement = id, clearTimeout(tooltips.hoverTimer), tooltips.show($(this)))
            }), $("#tooltip-close").live("click", function(a) {
                a.preventDefault(), $tooltip = $(this).parents(".tooltip"), tooltips.hide($tooltip)
            }), Modernizr.touch === !1 && $mouseElements.live("mouseout", function(a) {
                a.preventDefault(), tooltips.hoverTimer = setTimeout(function() {
                    tooltips.hide($(this)), tooltips.$currentElement = void 0
                }, 50)
            })
        },
        _smartPosition: function(a) {
            var b = {};
            elPositionTop = a.position().top, elPositionLeft = a.position().left, elHeight = a.outerHeight(), elWidth = a.outerWidth(), elPositionBottom = elPositionTop + elHeight, tooltipHeight = tooltips.$tooltip.outerHeight(), tooltipWidth = tooltips.$tooltip.outerWidth(), scrollTop = $(window).scrollTop(), windowBottom = ui.windowHeight + scrollTop, spaceAbove = elPositionTop - scrollTop, spaceBelow = windowBottom - elPositionBottom, spaceAbove > spaceBelow ? (topPosition = elPositionTop - tooltipHeight - 8, scrollTop > topPosition && (newHeight = elPositionTop - scrollTop - 70, tooltips.$tooltip.find(".tooltip-content").css({
                height: newHeight + "px"
            }), topPosition = scrollTop + 20), b.top = topPosition + "px", className = "bottom") : (topPosition = elPositionTop + elHeight - 8, b.top = topPosition + "px", className = "top", tooltipBottom = topPosition + tooltipHeight, tooltipBottom + tooltips.options.paddingY > windowBottom && (newHeight = windowBottom - topPosition - 110 + "px", tooltips.$tooltip.find(".tooltip-content").css({
                height: newHeight
            }))), elPositionLeft + tooltipWidth > ui.windowWidth ? (b.left = elPositionLeft - tooltipWidth + 80 + "px", className += " right") : elPositionLeft > 60 ? (b.left = elPositionLeft - 40 + "px", className += " left") : (b.left = elPositionLeft + "px", className += " left"), tooltips.$tooltip.css(b).addClass(className), $("#tooltip-close").focus()
        },
        show: function(a) {
            tooltips.isOpen === !1 && (tooltips.isOpen = !0, a.hasClass("tooltip") === !1 && (tooltips.$el = a, tooltipName = a.attr("href"), tooltipContent = $(tooltipName).html(), tooltipHtml = '<div id="tooltip" data-related-tooltip="' + tooltipName + '" class="tooltip"><div class="tooltip-container"><div id="tooltip-close">Close<span class="icon"></span></div><div class="tooltip-content">' + tooltipContent + "</div></div></div>", $main.append(tooltipHtml), tooltips.$tooltip = $("#tooltip")), tooltips._smartPosition(tooltips.$el))
        },
        hide: function() {
            void 0 !== tooltips.$tooltip && tooltips.isOpen === !0 && (tooltips.isOpen = !1, tooltips.$tooltip.remove())
        }
    },
    newsletter = {
        isOpen: !1,
        bindEvents: function() {
            $signUp.live("click", function(a) {
                a.preventDefault(), newsletter.open()
            }), $newsletterClose.live("click", function(a) {
                a.preventDefault(), newsletter.close()
            }), $("#email").focus(function() {
                $(this).val("")
            }), $("#email").blur(function() {
                "" === $(this).val() && $(this).val("Enter your email")
            }), $newsletter.live("click", function(a) {
                "newsletter-container" === a.target.id && (a.preventDefault(), newsletter.close())
            }), $(".submitEnews").click(function() {
                newsletter.aflac.eNewsSubmit()
            })
        },
        aflac: {
            setCookie: function(a, b, c) {
                if (c) {
                    var d = new Date;
                    d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3);
                    var e = "; expires=" + d.toGMTString()
                } else var e = "";
                document.cookie = a + "=" + b + e + "; path=/"
            },
            getCookie: function(a) {
                for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
                    for (var e = c[d];
                        " " == e.charAt(0);) e = e.substring(1, e.length);
                    if (0 == e.indexOf(b)) return e.substring(b.length, e.length)
                }
                return null
            },
            deleteCookie: function(a) {
                setCookie(a, null)
            },
            validateEmail: function(a) {
                return newsletter.aflac.emailReg.test(a) ? !0 : !1
            },
            validateOnlyLetters: function(a) {
                var b = /[0-9]/g;
                return b.test(a) ? !1 : !0
            },
            checkForm: function() {
                var a = document.getElementById("email");
                return validateEmail(a.value) ? (a.style.border = "1px solid #BFBFBF", void setCookie("awr_enews_opt", a.value, 30)) : (a.style.border = "1px solid red", !1)
            },
            validateEmail: function(a) {
                var b = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                return 0 == b.test(a) ? !1 : 1 == b.test(a) ? !0 : void 0
            },
            validateOnlyLetters: function(a) {
                var b = /[0-9]/g;
                return b.test(a) ? !1 : !0
            },
            checkForm: function() {
                var a = !1,
                    b = document.getElementById("email"),
                    c = $(".selectedTxt").text();
                return newsletter.aflac.validateEmail(b.value) ? (b.style.border = "1px solid #BFBFBF", $(".emailAdd").hide()) : (b.style.border = "1px solid #FFa12b", $(".emailAdd").show(), a = !0), "Role" == c ? ($(".newListSelected").css("border", "1px solid #FFa12b"), $(".roles").show(), a = !0) : ($(".newListSelected").css("border", "none"), $(".roles").hide()), 1 == a ? !1 : void 0
            },
            eNewsSubmit: function() {
                return 0 != newsletter.aflac.checkForm() && $.ajax({
                    type: "POST",
                    url: "http://www.aflac.com/us/exacttarget.ashx",
                    data: $("#enewsForm > div input,#enewsForm > input,#enewsForm > div select,#enewsForm > div textarea").serialize(),
                    dataType: "text",
                    beforeSend: function() {
                        $(".enewsFirst").hide(), $(".enewsLoad").show()
                    },
                    success: function(a) {
                        a.indexOf("success") > -1 ? ($(".enewsLoad").hide(), $(".enewsResult").show()) : ($(".enewsLoad").hide(), $(".enewsResult").hide(), $(".enewsError").show())
                    },
                    error: function() {
                        return $(".enewsLoad").hide(), $(".enewsResult").hide(), $(".enewsError").show(), window.setTimeout(function() {
                            $(".enewsError").hide(), $(".enewsLoad").fadeIn("slow")
                        }, 5e3), !0
                    }
                }), !1
            }
        },
        init: function() {},
        open: function() {
            newsletter.isOpen === !1 && (newsletter.isOpen = !0, breadcrumbs.isOpen === !0 && (breadcrumbs.closedForModal = !0, breadcrumbs.close()), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? $newsletter.addClass("open") : (css = {}, Modernizr.opacity === !0 && (css.opacity = 1), css.visibility = "visible", $newsletter.css(css)), $("#email").val("Enter your email"))
        },
        close: function() {
            newsletter.isOpen === !0 && (newsletter.isOpen = !1, breadcrumbs.isOpen === !1 && breadcrumbs.closedForModal === !0 && setTimeout(function() {
                breadcrumbs.open()
            }, 500), $("input", $newsletter).val(""), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? $newsletter.removeClass("open") : (css = {}, Modernizr.opacity === !0 && (css.opacity = 0), css.visibility = "hidden", $newsletter.css(css)))
        }
    },
    calculator = {
        isOpen: !1,
        bindEvents: function() {
            $calculatorOpen.live("click", function(a) {
                a.preventDefault(), calculator.open()
            }), $calculatorClose.live("click", function(a) {
                a.preventDefault(), calculator.close()
            }), $calculator.live("click", function(a) {
                "calculator-container" === a.target.id && (a.preventDefault(), calculator.close())
            }), $("input", $calculator).live("keyup", function(a) {
                a.preventDefault(), calculator.update()
            })
        },
        open: function() {
            calculator.isOpen === !1 && (calculator.isOpen = !0, breadcrumbs.isOpen === !0 && (breadcrumbs.closedForModal = !0, breadcrumbs.close()), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? $calculator.addClass("open") : (css = {}, Modernizr.opacity === !0 && (css.opacity = 1), css.visibility = "visible", $calculator.css(css)), setTimeout(function() {
                $fte.focus()
            }, 500))
        },
        close: function() {
            calculator.isOpen === !0 && (calculator.isOpen = !1, breadcrumbs.isOpen === !1 && breadcrumbs.closedForModal === !0 && setTimeout(function() {
                breadcrumbs.open()
            }, 500), $("input", $calculator).val(""), $result.text("0"), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? $calculator.removeClass("open") : (css = {}, Modernizr.opacity === !0 && (css.opacity = 0), css.visibility = "hidden", $calculator.css(css)))
        },
        update: function() {
            fte = parseInt($fte.val()), pte = parseInt($pte.val()), hours = parseInt($hours.val()), isNaN(fte) && (fte = 0), isNaN(pte) && (pte = 0), isNaN(hours) && (hours = 0), total = Math.round(hours / 120 + fte), $result.text("0"), setTimeout(function() {
                0 !== total && "" !== $fte.val() && "" !== $hours.val() && $result.text(total)
            }, 250)
        }
    },
    breadcrumbs = {
        isOpen: !1,
        highlight: function(a) {
            slider.isActive === !1 && (breadcrumbs.$el.children(".selected").removeClass("selected"), void 0 === a && (a = breadcrumbs.$el.children("a").eq(breadcrumbs.id)), a.addClass("selected"))
        },
        _setup: function() {
            breadcrumbs.$clone = breadcrumbs.$el.clone(), breadcrumbs.$clone.attr("id", "breadcrumbs"), Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? (css = {}, css[slider.transformPrefix + "transform"] = "translateY(-110%) translateZ(0)", breadcrumbs.$clone.css(css)) : (css = {}, css.top = "-105px", breadcrumbs.$clone.css(css)), $("#breadcrumbs-wrapper").prepend(breadcrumbs.$clone), breadcrumbs.$el = $("#breadcrumbs"), breadcrumbs.$el.find("a").live("click", function(a) {
                a.preventDefault(), selectedBreadcrumbId = $("a", breadcrumbs.$el).index($(this)), activeBreadcrumbId = $("a", breadcrumbs.$el).index($(".selected")), relatedSlideId = slider.currentId + (selectedBreadcrumbId - activeBreadcrumbId), relatedSlideId = "presentation-" + parseFloat(relatedSlideId), breadcrumbs.highlight($(this)), slider.goTo(relatedSlideId)
            })
        },
        open: function(a) {
            breadcrumbs.isOpen === !1 && (breadcrumbs.isOpen = !0, breadcrumbs.closedForModal === !0 ? breadcrumbs.closedForModal = !1 : breadcrumbs.$el = $(".key-items-" + a, slider.$chosenPresentation), breadcrumbs._setup(a), $logo.css({
                "margin-left": "-100%",
                "margin-top": 0
            }), setTimeout(function() {
                Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? (css = {}, css[slider.transformPrefix + "transform"] = "translateY(0) translateZ(0)", css[slider.transitionPrefix + "transition"] = slider.transformPrefix + "transform 350ms cubic-bezier(0, 1, 1, 1)", breadcrumbs.$el.css(css)) : breadcrumbs.$el.animate({
                    top: "0px"
                }, 350)
            }, 50)), breadcrumbs.highlight()
        },
        close: function() {
            breadcrumbs.isOpen === !0 && (breadcrumbs.isOpen = !1, Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0 ? (css = {}, css[slider.transformPrefix + "transform"] = "translateY(-110%) translateZ(0)", css[slider.transitionPrefix + "transition"] = slider.transformPrefix + "transform 350ms ease-in", breadcrumbs.$el.css(css)) : (breadcrumbsHeight = breadcrumbs.$el.outerHeight(), breadcrumbs.$el.animate({
                top: -breadcrumbsHeight + "px"
            }, 350)), setTimeout(function() {
                breadcrumbs.$el.remove(), $logo.css({
                    "margin-left": 0,
                    "margin-top": "-1px"
                })
            }, 500))
        }
    },
    slider = {
        options: {
            startingSlide: 1,
            slideSpeed: 1e3,
            slideEasing: "ease-in-out"
        },
        defaults: {
            effects: {
                speed: 500
            }
        },
        isActive: !1,
        currentLevel: "intro",
        currentId: 1,
        introCurrentId: 1,
        $currentSlide: $("section", $("#intro")).eq(1),
        presentationUnlocked: !1,
        bindEvents: function() {
            $backButton.click(function(a) {
                a.preventDefault(), slider.prev()
            }), $forwardButton.click(function(a) {
                a.preventDefault(), slider.next()
            }), $(".choice", $slide3).live("click", function(a) {
                a.preventDefault(), 0 === $(this).parents(".deselected").length && ui.choices.toggle($(this))
            }), $(".key-items-box .key-items a", $presentation).live("click", function(a) {
                a.preventDefault(), breadcrumbId = $(this).parent(".key-items").children("a").index(this) + 1, relatedSlideId = "presentation-" + parseFloat(breadcrumbId + slider.currentId), slider.goTo(relatedSlideId)
            })
        },
        init: function(a) {
            slider.$el = a, slider.$intro = $("#intro", slider.$el), slider.$presentation = $("#presentation", slider.$el), slider.noOfIntroSlides = $("section", slider.$intro).length, slider.noOfPresentationSlides = $("section", slider.$presentation).length, slider.$slides = $("section", slider.$el), slider.noOfSlides = slider.$slides.length, slider.transformPrefix = slider.progressiveEnhance.transformPrefix(Modernizr.prefixed("transform")), slider.transitionPrefix = slider.progressiveEnhance.transitionPrefix(Modernizr.prefixed("transition"))
        },
        goTo: function(a) {
            if (slider.isActive === !1 && "" !== a) {
                if (originalId = a, idAndLevel = a.split("-"), level = idAndLevel[0], a = parseInt(idAndLevel[1]), a === slider.currentId && level === slider.currentLevel) return;
                if (tooltips.isOpen === !0 && tooltips.hide(), slider.presentationUnlocked === !1 && "presentation" === level) return ui.choices.prompt(), !1;
                if (breadcrumbs.closedForModal = !1, "intro" === level && (slider.introCurrentId = a), a -= 1, slider.nextId = a, slider.nextId < slider.currentId && slider.nextId < 1 && "intro" === level) {
                    if (ui.homeButton.hide(), ui.nav.backButton.hide(), slider.nextId < 0) return !1
                } else ui.homeButton.show(), ui.nav.backButton.show();
                if (lastSlideId = slider.noOfPresentationSlides, nextIdOneBased = slider.nextId + 1, nextIdOneBased > slider.currentId && nextIdOneBased >= lastSlideId) {
                    if (ui.nav.forwardButton.hide(), nextIdOneBased > lastSlideId) return !1
                } else ui.nav.forwardButton.show();
                slider.$currentLevel = $("#" + level, slider.$el), slider.$currentSlide = "presentation" === level ? $('section:not(".hidden")', slider.$chosenPresentation).eq(a) : $("section", slider.$currentLevel).eq(a), breadcrumbs.set = slider.$currentSlide[0].getAttribute("data-breadcrumb-set"), breadcrumbs.id = slider.$currentSlide[0].getAttribute("data-breadcrumb") - 1, null === breadcrumbs.set && breadcrumbs.close(), slider.animation.move(level, a)
            }
        },
        next: function() {
            slider.currentId === slider.noOfIntroSlides && "intro" === slider.currentLevel ? (nextLevel = "presentation", nextId = 1) : (nextLevel = slider.currentLevel, nextId = slider.currentId + 1), slider.goTo(nextLevel + "-" + nextId)
        },
        prev: function() {
            1 === slider.currentId && "presentation" === slider.currentLevel ? (previousLevel = "intro", previousId = slider.noOfIntroSlides) : (previousLevel = slider.currentLevel, previousId = slider.currentId - 1), slider.goTo(previousLevel + "-" + previousId)
        },
        animation: {
            move: function(a, b) {
                slider.isActive === !1 && (slider.isActive = !0, direction = slider.currentLevel === a ? "horizontal" : "vertical", "presentation" === slider.currentLevel && "intro" === a && 0 === b && slider.animation._horizontal("intro", 0, !0), "horizontal" === direction && slider.animation._horizontal(a, b), "vertical" === direction && slider.animation._vertical(a), setTimeout(function() {
                    "presentation" === slider.currentLevel && "intro" === a && slider.animation._horizontal("presentation", 0, !0), slider.currentLevel = a, slider.currentId = b + 1, slider.isActive = !1, $tooltips = $(".tooltipped", slider.$currentSlide), ui.highlightTooltips($tooltips), "presentation" === a && (breadcrumbSetId = slider.$currentSlide[0].getAttribute("data-breadcrumb-set"), null !== breadcrumbSetId && breadcrumbs.open(breadcrumbSetId)), calculator.isOpen === !0 && calculator.close()
                }, 1e3))
            },
            _horizontal: function(a, b, c) {
                if (Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0) switch (xPosition = 100 * b, css = {}, css[slider.transformPrefix + "transform"] = "translateX(-" + xPosition + "%) translateZ(0)", speed = c !== !0 ? slider.options.slideSpeed : 0, css[slider.transitionPrefix + "transition"] = slider.transformPrefix + "transform " + speed + "ms " + slider.options.slideEasing, a) {
                    case "intro":
                        slider.$intro.css(css);
                        break;
                    case "presentation":
                        slider.$presentation.css(css)
                } else if (windowWidth = ui.windowWidth < 768 ? 768 : ui.windowWidth, xPosition = "-" + windowWidth * b + "px", css = {}, css.left = xPosition, c !== !0) switch (a) {
                    case "intro":
                        slider.$intro.animate(css, 1e3);
                        break;
                    case "presentation":
                        slider.$presentation.animate(css, 1e3)
                } else switch (a) {
                    case "intro":
                        slider.$intro.css(css);
                        break;
                    case "presentation":
                        slider.$presentation.css(css)
                }
            },
            _vertical: function(a, b) {
                if (Modernizr.csstransforms === !0 && Modernizr.csstransitions === !0) {
                    switch (a) {
                        case "intro":
                            yPosition = 0;
                            break;
                        case "presentation":
                            yPosition = -100
                    }
                    css = {}, css[slider.transformPrefix + "transform"] = "translateY(" + yPosition + "%) translateZ(0)", speed = b !== !0 ? slider.options.slideSpeed : 0, css[slider.transitionPrefix + "transition"] = slider.transformPrefix + "transform " + speed + "ms " + slider.options.slideEasing, $slider.css(css)
                } else {
                    switch (windowHeight = $(window).height(), 650 > windowHeight && (windowHeight = 650), a) {
                        case "intro":
                            yPosition = 0;
                            break;
                        case "presentation":
                            yPosition = "-" + windowHeight
                    }
                    css = {}, css.top = yPosition + "px", $slider.animate(css, slider.options.slideSpeed)
                }
            }
        },
        progressiveEnhance: {
            transformPrefix: function(a) {
                return translations = {
                    WebkitTransform: "-webkit-",
                    MozTransform: "-moz-",
                    OTransform: "-o-",
                    msTransform: "-ms-",
                    transform: ""
                }, translations[a]
            },
            transitionPrefix: function(a) {
                return translations = {
                    WebkitTransition: "-webkit-",
                    MozTransition: "-moz-",
                    OTransition: "-o-",
                    msTransition: "-ms-",
                    transition: ""
                }, translations[a]
            }
        }
    };
$(document).ready(function() {
    $intro = $("#intro"), $slider = $("#slider"), $backButton = $("#back"), $forwardButton = $("#forward"), $slide3 = $("#slide3"), $homeButton = $("#home"), $main = $("#main"), $header = $("#header"), $logo = $("#logo"), $presentation = $("#presentation"), $calculator = $("#calculator-container"), $calculatorOpen = $(".calculator-button"), $calculatorClose = $("#close", $calculator), $result = $("#result", $calculator), $fte = $("#fte", $calculator), $pte = $("#pte", $calculator), $hours = $("#hours", $calculator), $tooltipped = $(".tooltipped", $slider), $signUp = $(".sign-up", $presentation), $newsletter = $("#newsletter-container"), $newsletterClose = $("#newsletter-close"), $question1 = $("#question1", $intro), $question2 = $("#question2", $intro), $question3 = $("#question3", $intro), slider.init($slider), slider.bindEvents(), tooltips.bindEvents(), newsletter.bindEvents(), calculator.bindEvents(), ui.bindEvents(), ui.resizeEnd(), $slider.live("touchmove", function(a) {
        ui.windowWidth >= 768 && ui.windowHeight >= 550 && a.preventDefault()
    }), $("section, .tooltip", $slider).live("touchmove", function(a) {
        a.stopPropagation()
    }), $("#home, #presentation [data-goto]").live("click", function(a) {
        a.preventDefault(), slideId = $(this)[0].getAttribute("data-goto"), slider.goTo(slideId)
    });
    var a = document.getElementById("slider");
    hammerOptions = {
        drag: !1,
        swipe_velocity: .4,
        stop_browser_behavior: !0
    }, Hammer(a, hammerOptions).on("swipeleft", function() {
        ui.windowWidth >= 768 && ui.windowHeight >= 550 && slider.next()
    }), Hammer(a, hammerOptions).on("swiperight", function() {
        ui.windowWidth >= 768 && ui.windowHeight >= 550 && slider.prev()
    })
});