var ApiClient, SimplePromise, Traitify, console;
Array.prototype.map || (Array.prototype.map = function(t, e) {
    var r, n, o, i, s, a, u;
    if (o = void 0, r = void 0, i = void 0, "undefined" == typeof this || null === this) throw new TypeError(" this is null or not defined");
    if (n = Object(this), a = n.length >>> 0, "function" != typeof t) throw new TypeError(t + " is not a function");
    for (e && (o = e), r = new Array(a), i = 0; a > i;) s = void 0, u = void 0, i in n && (s = n[i], u = t.call(o, s, i, n), r[i] = u), i++;
    return r
}), Array.prototype.filter || (Array.prototype.filter = function(t) {
    "use strict";
    var e, r, n, o, i, s;
    if (void 0 === this || null === this) throw new TypeError;
    if (o = Object(this), r = o.length >>> 0, "function" != typeof t) throw new TypeError;
    for (n = [], i = arguments[1], e = 0; r > e;) e in o && (s = o[e], t.call(i, s, e, o) && n.push(s)), e++;
    return n
}), Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
    var e, r;
    for (r = this.length >>> 0, e = Number(arguments[1]) || 0, e = 0 > e ? Math.ceil(e) : Math.floor(e), 0 > e && (e += r); r > e;) {
        if (e in this && this[e] === t) return e;
        e++
    }
    return -1
}), console || (console = {
    log: function() {}
}), Object.keys || (Object.keys = function() {
    "use strict";
    var t, e, r, n;
    return n = Object.prototype.hasOwnProperty, r = !{
            toString: null
        }.propertyIsEnumerable("toString"), t = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], e = t.length,
        function(o) {
            var i, s, a;
            if ("object" != typeof o && ("function" != typeof o || null === o)) throw new TypeError("Object.keys called on non-object");
            a = [], s = void 0, i = void 0;
            for (s in o) n.call(o, s) && a.push(s);
            if (r)
                for (i = 0; e > i;) n.call(o, t[i]) && a.push(t[i]), i++;
            return a
        }
}()), SimplePromise = function(t) {
    var e;
    return e = Object(), e.then = function(t) {
        return e.thenCallback = t, e.resolved && e.thenCallback(e.data), e
    }, e.resolved = !1, e.resolve = function(t) {
        return e.data = t, e.thenCallback ? e.thenCallback(t) : e.resolved = !0, e
    }, e["catch"] = function(t) {
        return e.rejected ? t(e.error) : e.rejectCallback = t, e
    }, e.rejected = !1, e.reject = function(t) {
        return e.error = t, e.rejectCallback ? e.rejectCallback(t) : e.rejected = !0, e
    }, t(e.resolve, e.reject), e
}, ApiClient = function() {
    function t() {
        this.host = "https://api.traitify.com", this.version = "v1", "undefined" != typeof XDomainRequest ? this.oldIE = !0 : this.oldIE = !1, this.beautify = !1, this.XHR = XMLHttpRequest
    }
    return t.prototype.online = function() {
        return navigator.onLine
    }, t.prototype.setBeautify = function(t) {
        return this.beautify = t, this
    }, t.prototype.setHost = function(t) {
        return t.match(/http/) || (t = "https://" + t), this.oldIE && (t = t.replace("https://", "").replace("http://", ""), t = "" + location.protocol + "//" + t), this.host = t, this
    }, t.prototype.setPublicKey = function(t) {
        return this.publicKey = t, this
    }, t.prototype.setVersion = function(t) {
        return this.version = t, this
    }, t.prototype.ajax = function(t, e, r, n) {
        var o, i, s, a, u, c, p, l;
        if (o = this.beautify, p = "" + this.host + "/" + this.version + e, l = new this.XHR, "withCredentials" in l && !this.oldIE) l.open(t, p, !0);
        else {
            if ("undefined" == typeof XDomainRequest) return new SimplePromise(function(t, e) {
                return e("CORS is Not Supported By This Browser")
            });
            this.oldIE && (c = (new Date).getTime(), p += -1 === p.indexOf("?") ? "?authorization=" + this.publicKey + "&reset_cache=" + c : "&authorization=" + this.publicKey + "&reset_cache=" + c), l = new XDomainRequest, l.open(t, p)
        }
        return l && !this.oldIE && (l.setRequestHeader("Authorization", "Basic " + btoa(this.publicKey + ":x")), l.setRequestHeader("Content-type", "application/json"), l.setRequestHeader("Accept", "application/json")), u = this, s = this.online(), i = this.oldIE, a = new SimplePromise(function(t, e) {
            if (u.reject = e, !s) return u.reject();
            try {
                return l.onload = function() {
                    var e;
                    return 404 === l.status ? u.reject(l.response) : (e = i ? l.responseText : l.response, o && (e = e.replace(/_([a-z])/g, function(t, e) {
                        return e.toUpperCase()
                    }).replace(/_/g, "")), e = JSON.parse(e), r && r(e), u.resolve = t, u.resolve(e))
                }, l.onprogress = function() {}, l.ontimeout = function() {}, l.onerror = function() {}, window.setTimeout(function() {
                    try {
                        return l.send(JSON.stringify(n))
                    } catch (t) {
                        return u.reject(t)
                    }
                }, 0), l
            } catch (a) {
                return u.reject(a)
            }
        })
    }, t.prototype.put = function(t, e, r) {
        return this.oldIE ? this.ajax("POST", t, r, e) : this.ajax("PUT", t, r, e)
    }, t.prototype.get = function(t, e) {
        return this.ajax("GET", t, e, "")
    }, t.prototype.getDecks = function(t) {
        return this.get("/decks", t)
    }, t.prototype.getSlides = function(t, e) {
        return this.get("/assessments/" + t + "/slides", e)
    }, t.prototype.addSlide = function(t, e, r, n, o) {
        return this.put("/assessments/" + t + "/slides/" + e, {
            response: r,
            time_taken: n
        }, o)
    }, t.prototype.addSlides = function(t, e, r) {
        return this.put("/assessments/" + t + "/slides", e, r)
    }, t.prototype.getPersonalityTypes = function(t, e, r) {
        var n, o, i, s, a, u;
        for (null == e && (e = Object()), null == (a = e.image_pack) && (e.image_pack = "linear"), o = Array(), u = Object.keys(e), i = 0, s = u.length; s > i; i++) n = u[i], o.push("" + n + "=" + e[n]);
        return this.get("/assessments/" + t + "/personality_types?" + o.join("&"), r)
    }, t.prototype.getPersonalityTraits = function(t, e, r) {
        return this.get("/assessments/" + t + "/personality_traits/raw", r)
    }, t.prototype.getCareers = function(t, e, r) {
        var n, o, i, s, a, u;
        for (null == e && (e = Object()), null == (a = e.number_of_matches) && (e.number_of_matches = 8), o = Array(), u = Object.keys(e), i = 0, s = u.length; s > i; i++) n = u[i], o.push("" + n + "=" + e[n]);
        return this.get("/assessments/" + t + "/matches/careers?" + o.join("&"), r)
    }, t
}(), Traitify = new ApiClient;
var Ui;
Ui = function() {
    function e() {
        this.widgets = Object(), this.userAgent = navigator.userAgent, this.runningWidgets = Object()
    }
    return e.prototype.load = function(e, t, n, i) {
        var s, r, u, a, d, c, g, l, o, h, f, p, b, y, O, j, v;
        if (null == n && (n = Object()), a = Object(), d = Object(), c = this.widgets[e]) return g = e, e = t, t = n, n = i, null == n && (n = Object()), null == (y = n[g]) && (n[g] = Object()), c = c(e, t, n), Traitify.ui.loadResults({
            slideDeck: c
        }), c;
        for (s = Object(), O = Object.keys(this.widgets), l = 0, f = O.length; f > l; l++) g = O[l], r = n[g] && n[g].target ? n[g].target : t, this.runningWidgets[g] = this.widgets[g](e, r, n), u = this.runningWidgets[g].dataDependencies, -1 !== u.indexOf("Slides") ? (d[g] = this.runningWidgets[g], d[g].widgets = s) : (a[g] = this.runningWidgets[g], a[g].widgets = s);
        if (0 !== Object.keys(d).length) {
            for (Traitify.getSlides(e).then(function(e) {
                    var t, i, s, r, u, c, g, l;
                    for (t = e.filter(function(e) {
                            return "number" == typeof e.completed_at
                        }), i = 0 === Object.keys(n).filter(function(e) {
                            return n[e].showResults === !1
                        }).length, g = Object.keys(d), l = [], u = 0, c = g.length; c > u; u++) r = g[u], s = d[r], s.data.add("Slides", e), t.length === e.length ? (s.callbacks.trigger("Finished"), i ? l.push(Traitify.ui.loadResults(a)) : l.push(void 0)) : l.push(s.run());
                    return l
                }), j = Object.keys(a), o = 0, p = j.length; p > o; o++) g = j[o], s[g] = a[g];
            for (v = Object.keys(d), h = 0, b = v.length; b > h; h++) g = v[h], s[g] = d[g];
            return s
        }
    }, e.prototype.loadResults = function(e) {
        var t, n, i, s, r, u, a, d, c;
        for (t = Object(), d = Object.keys(e), c = [], u = 0, a = d.length; a > u; u++) r = d[u], s = e[r], s.widgets = e, 0 === s.dataDependencies.length ? c.push(s.run()) : c.push(function() {
            var u, a, d, c;
            for (d = s.dataDependencies, c = [], u = 0, a = d.length; a > u; u++) n = d[u], t[n] !== !0 ? (t[n] = !0, i = Traitify["get" + n](s.assessmentId), i.cleanName = n, c.push(i.then(function(t) {
                var i, u, a, d, c, g, l, o;
                for (n = this.cleanName, u = Object.keys(e).filter(function(t) {
                        return e[t], -1 !== e[t].dataDependencies.indexOf(n)
                    }), o = [], a = 0, c = u.length; c > a; a++) {
                    for (r = u[a], s = e[r], s.data.add(n, t), i = !0, l = s.dataDependencies, d = 0, g = l.length; g > d; d++) n = l[d], !s.data.get(n);
                    i ? o.push(s.run()) : o.push(void 0)
                }
                return o
            }))) : c.push(void 0);
            return c
        }());
        return c
    }, e.prototype.widget = function(e, t) {
        var n;
        return n = this.styles, Traitify.ui.widgets[e] = function(e, n, i) {
            var s;
            return s = new Widget(n), s.data.cookies.scope = e, s.build = t, s.assessmentId = e, s.options = i, s.build(s), s
        }
    }, e
}(), Traitify.ui = new Ui, Traitify.ui.styles = Object();
var Actions, Callbacks, Cookie, Data, Helpers, Library, Stack, States, Tags, Views, Widget, __hasProp = {}.hasOwnProperty,
    __extends = function(t, e) {
        function r() {
            this.constructor = t
        }
        for (var i in e) __hasProp.call(e, i) && (t[i] = e[i]);
        return r.prototype = e.prototype, t.prototype = new r, t.__super__ = e.prototype, t
    };
Helpers = function() {
    function t() {}
    return t.prototype.toDash = function(t) {
        return t ? t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        }) : void 0
    }, t.prototype.hexToRGB = function(t) {
        var e;
        return 0 !== t.length ? (e = t.match(/([\da-f]{2})([\da-f]{2})([\da-f]{2})/i), e.slice(1).map(function(t) {
            return parseInt(t, 16)
        })) : void 0
    }, t.prototype.add = function(t, e) {
        return this[t] = e
    }, t
}(), Cookie = function() {
    function t() {
        this.scope = "default"
    }
    return t.prototype.set = function(t, e, r) {
        var i;
        return this.time = null != r ? r : 2, r = new Date, r.setTime(r.getTime() + 6e4 * this.time), i = "expires=" + r.toUTCString(), e = JSON.stringify(e), document.cookie = "tf-cookie-" + this.scope + "-" + t + "=" + e + "; " + i
    }, t.prototype.get = function(t) {
        var e, r, i, n;
        for (r = document.cookie.split(";"), i = 0, t = "tf-cookie-" + this.scope + "-" + t + "="; i < r.length;) {
            for (e = r[i];
                " " === e.charAt(0);) e = e.substring(1); - 1 !== e.indexOf(t) && (n = e.substring(t.length, e.length)), i++
        }
        return n ? JSON.parse(n) : void 0
    }, t
}(), Library = function() {
    function t() {
        this.store = Object()
    }
    return t.prototype.add = function(t, e) {
        return this.store[t] = e
    }, t.prototype.set = function(t, e) {
        return this.add(t, e)
    }, t.prototype.get = function(t) {
        return t ? this.store[t] : this.store
    }, t.prototype.remove = function(t) {
        return this.store[t] ? delete this.store[t] : !1
    }, t
}(), Callbacks = function() {
    function t(t) {
        this.parent = t, this.library = new Library, this.states = new Library
    }
    return t.prototype.trigger = function(t) {
        return this.library.get(t) ? this.library.get(t)(this) : this.states.add(t, !0)
    }, t.prototype.add = function(t) {
        var e, r;
        return r = this.states, e = this.library, this.parent["on" + t] = function(i) {
            return r.get(t) ? i() : e.add(t, i)
        }
    }, t
}(), Tags = function() {
    function t() {
        this.library = new Library
    }
    return t.prototype.div = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "div", e, r)
    }, t.prototype.span = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "span", e, r)
    }, t.prototype.img = function(t, e, r) {
        return null == r && (r = Object()), r.src = e, this.tag(t, "img", r)
    }, t.prototype.hr = function(t, e) {
        return this.tag(t, "hr", e)
    }, t.prototype.i = function(t, e, r) {
        return this.tag(t, "i", e, r)
    }, t.prototype.a = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "a", e, r)
    }, t.prototype.get = function(t) {
        return this.library.get(t)
    }, t.prototype.tag = function(t, e, r, i) {
        var n, s, o, a, u, c, h, p, y, l;
        o = document.createElement(e), c = !1, "object" == typeof t && (t = t[0], c = !0), -1 !== t.indexOf(".") ? (a = t.split("."), a = a[a.length - 1]) : a = t, null == r && (r = Object()), s = (new Helpers).toDash(a), null == (y = r["class"]) && (r["class"] = ""), r["class"] = 0 === r["class"].length ? s : " " + s;
        for (n in r)
            if ("style" !== n) o.setAttribute(n, r[n]);
            else
                for (l = Object.keys(r.style), h = 0, p = l.length; p > h; h++) u = l[h], o.style[u] = r[n][u];
        return c ? (this.library.get(t) || this.library.add(t, Array()), this.library.get(t).push(o)) : this.library.add(t, o), o.library = this.library, o.appendTo = function(e) {
            var r;
            return "object" == typeof e ? (t = e[0], r = e[1], this.library.store[t][r].appendChild(this)) : this.library.get(e).appendChild(this)
        }, i && (o.innerHTML = i), o
    }, t
}(), Data = function(t) {
    function e() {
        e.__super__.constructor.call(this), this.cookies = new Cookie, this.persists = Object()
    }
    return __extends(e, t), e.prototype.add = function(t, r) {
        return e.__super__.add.call(this, t, r), this.persists[t] && this.cookies.set(t, r, this.persists[t]), r
    }, e.prototype.get = function(t) {
        return this.persists[t] && !this.store[t] ? this.set(t, this.cookies.get(t)) : e.__super__.get.call(this, t)
    }, e.prototype.counter = function(t) {
        var e;
        return e = this.store, {
            up: function(r) {
                return e[t] += r || 1
            },
            down: function(r) {
                return e[t] -= r || 1
            }
        }
    }, e.prototype.persist = function(t, e) {
        return null == e && (e = 2), void(this.persists[t] = e)
    }, e
}(Library), Views = function() {
    function t() {
        this.library = new Library, this.tags = new Tags
    }
    return t.prototype.add = function(t, e) {
        return this.library.add(t, e)
    }, t.prototype.render = function(t, e) {
        return this.library.get(t) ? this.library.get(t).call(this, e) : void 0
    }, t.prototype.remove = function(t, e) {
        return this.library.remove(t)
    }, t
}(), Stack = function() {
    function t() {
        this.events = new Library
    }
    return t.prototype.trigger = function(t) {
        var e, r, i, n, s, o, a;
        if (t) return this.events.get(t)();
        for (i = this.events.get(), o = Object.keys(i), a = [], n = 0, s = o.length; s > n; n++) r = o[n], e = i[r], a.push(e());
        return a
    }, t
}(), Actions = function(t) {
    function e() {
        return e.__super__.constructor.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.trigger = function(t, e) {
        return this.get(t) ? this.get(t)(e) : void 0
    }, e
}(Library), States = function(t) {
    function e() {
        return e.__super__.constructor.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.add = function(t, r) {
        return null == r && (r = !1), e.__super__.add.call(this, t, r)
    }, e.prototype.set = function(t, e) {
        return this.add(t, e)
    }, e
}(Library), Widget = function() {
    function t(t) {
        this.target = t, this.views = new Views, this.library = new Library, this.data = new Data, this.dataDependencies = Array(), this.styles = Array(), this.states = new States, this.callbacks = new Callbacks(this), this.helpers = new Helpers, this.actions = new Actions, this.initialization = new Stack, this.views.data = this.data, this.userAgent = Traitify.ui.userAgent, this.views.tags.library.add("main", document.querySelector(this.target)), this.views.tags.library.get("main").innerHTML = "", this.userAgent.match(/iPad/i) && (this.device = "ipad"), this.userAgent.match(/iPhone/i) && (this.device = "iphone"), this.userAgent.match(/Android/i) && (this.device = "android"), this.userAgent.match(/BlackBerry/i) && (this.device = "blackberry"), this.userAgent.match(/webOS/i) && (this.device = "webos"), this.nodes = this.views.tags.library
    }
    return t.prototype.version = "3.0.0 HNA", t.prototype.dataDependency = function(t) {
        return this.dataDependencies.push(t)
    }, t.prototype.styleDependency = function(t) {
        return this.styles.push(t)
    }, t.prototype.run = function() {
        var t, e, r, i, n, s;
        for (s = this.styles, i = 0, n = s.length; n > i; i++) t = s[i], e = document.createElement("style"), e.type = "text/css", Traitify.oldIE ? e.styleSheet ? e.styleSheet.cssText = Traitify.ui.styles[t] : (r = document.createTextNode(Traitify.ui.styles[t]), e.appendChild(r)) : e.innerHTML = Traitify.ui.styles[t], this.nodes.get("main").appendChild(e);
        return this.initialization.trigger()
    }, t
}();
Traitify.ui.widget("slideDeck", function(e, t) {
    return null == t && (t = Object()), e.data.add("slideResponses", Object()), e.states.add("animating"), e.states.add("finished"), e.states.add("initialized"), e.states.add("transitionEndListens"), e.states.add("imageWaiting"), e.callbacks.add("Initialize"), e.callbacks.add("Finished"), e.callbacks.add("AddSlide"), e.callbacks.add("Me"), e.callbacks.add("NotMe"), e.callbacks.add("AdvanceSlide"), e.data.persist("slideValues"), e.data.add("imageCache", Array()), e.data.add("fetchErroring"), e.styleDependency("all"), e.styleDependency("slide-deck"), e.states.add("trying", !0), e.dataDependency("Slides"), e.data.get("slideValues") || e.data.add("slideValues", Array()), e.actions.add("processSlide", function(t) {
        var i, a, n, d, s;
        return e.data.set("lastSlideTime", e.data.get("currentSlideTime")), e.data.set("currentSlideTime", (new Date).getTime()), d = e.data.get("slideValues"), d.push({
            id: t.id,
            response: t.value,
            time_taken: e.data.get("currentSlideTime") - e.data.get("lastSlideTime")
        }), e.data.set("slideValues", d), s = e.widgets, e.data.counter("sentSlides").up(), n = e.data.get("sentSlides"), e.data.get("slideValues").length % 10 === 0 || n === e.data.get("slidesToPlayLength") ? (i = Traitify.addSlides(e.assessmentId, e.data.get("slideValues")), a = e.data.get("slideValues"), e.data.set("slideValues", Array()), i.then(function(t) {
            var i, a, d, r;
            return e.callbacks.trigger("addSlide"), n === e.data.get("slidesToPlayLength") ? (e.nodes.get("main").innerHTML = "", null == (d = e.options) && (e.options = Object()), null == (r = (a = e.options).slideDeck) && (a.slideDeck = Object()), e.options && e.options.slideDeck.showResults !== !1 && (s = e.widgets, s.personalityTypes && (i = s.personalityTypes.callbacks, s.personalityTypes = Traitify.ui.load("personalityTypes", e.assessmentId, s.personalityTypes.target || e.target, s.personalityTypes.options), s.personalityTypes.callbacks = i), s.personalityTraits && (i = s.personalityTraits.callbacks, s.personalityTraits = Traitify.ui.load("personalityTraits", e.assessmentId, s.personalityTraits.target || e.target, s.personalityTraits.options), i = s.personalityTraits.callbacks, s.personalityTraits.callbacks = i), s.results && (i = s.results.callbacks, s.results = Traitify.ui.load("results", e.assessmentId, s.results.target || e.target, s.results.options), s.results.callbacks = i), s.famousPeople && (i = s.famousPeople.callbacks, s.famousPeople = Traitify.ui.load("famousPeople", e.assessmentId, s.famousPeople.target || e.target, s.famousPeople.options), s.famousPeople.callbacks = i)), e.callbacks.trigger("Finished")) : void 0
        })["catch"](function() {
            return console.log("internet offline"), e.data.set("slideValues", e.data.get("slideValues").concat(a))
        })) : void 0
    }), e.helpers.add("getProgressBarNumbers", function(t) {
        var i, a, n, d;
        return d = e.data.get("Slides").length, i = e.data.get("SlidesCompleted").length, n = e.data.get("SlidesNotCompleted").length, a = i + e.data.get("sentSlides"), t || (a += 1), Math.round(a / d * 100)
    }), e.views.add("internetFailure", function() {
        var t;
        return e.views.render("wifiLoading"), t = this.tags.get("loading").innerHTML, this.tags.get("loading").innerHTML = "", this.tags.div("refreshButton", "Refresh").appendTo("loading"), this.tags.get("refreshButton").onclick = function() {
            return e.views.tags.get("loading").innerHTML = t, e.actions.trigger("fetchNext")
        }, this.tags.get("wifiLoading")
    }), e.views.add("wifiLoading", function() {
        return this.tags.get("wifiLoading") || (this.tags.div("wifiLoading"), this.tags.div("loading").appendTo("wifiLoading"), this.tags.div("loadingText", "Loading").appendTo("loading")), this.tags.get("wifiLoading")
    }), e.views.add("slideDeckContainer", function() {
        var t, i, a;
        return i = this.tags.div("tfSlideDeckContainer"), t = this.tags.div("cover"), this.tags.tag("rotateBack", "object", {
            data: "https://s3.amazonaws.com/traitify-cdn/assets/images/js/landscape-phone.svg",
            type: "image/svg+xml"
        }).appendTo("cover"), i.appendChild(t), a = e.helpers.getProgressBarNumbers("initializing"), i.appendChild(e.views.render("progressBar", a)), i.appendChild(this.render("slides", e.data.get("SlidesNotCompleted"))), i.appendChild(this.render("meNotMe")), i
    }), e.views.add("meNotMe", function() {
        return this.tags.div("meNotMeContainerAttachment"), this.tags.div("meNotMeContainer").appendTo("meNotMeContainerAttachment"), this.tags.div("me").appendTo("meNotMeContainer"), this.tags.div("notMe").appendTo("meNotMeContainer"), e.nodes.get("notMe").innerHTML = "NOT ME", e.nodes.get("me").innerHTML = "ME", this.tags.get("meNotMeContainerAttachment")
    }), e.views.add("slides", function(t) {
        var i, a;
        return a = this.tags.div("slides"), i = e.views.render("slide", t[0]), i.appendTo("slides"), i.className += " placeholder", e.nodes.set("currentSlide", e.views.render("slide", t[0])), e.nodes.get("currentSlide").className += " active", e.nodes.get("currentSlide").appendTo("slides"), t[1] && (e.nodes.set("nextSlide", e.views.render("slide", t[1])), e.nodes.get("nextSlide").appendTo("slides")), e.nodes.set("slides", a), a
    }), e.views.add("slide", function(e) {
        var t, i, a, n;
        return i = this.tags.div("slide"), a = this.tags.div("caption"), a.innerHTML = e.caption || "", t = e.image_desktop_retina || "", n = this.tags.div(["slide.image"], {
            style: {
                backgroundImage: "url('" + t + "')",
                backgroundPosition: "" + (e.focus_x || "") + "% " + (e.focus_y || "") + "%"
            }
        }), n.appendChild(a), i.appendChild(n), i
    }), e.views.add("progressBar", function(t) {
        var i, a;
        return i = this.tags.div("progress-bar"), a = this.tags.div("progress-bar-inner"), a.style.width = t + "%", i.appendChild(a), e.nodes.set("progressBar", i), e.nodes.set("progressBarInner", a), i
    }), e.views.add("loadingAnimation", function() {
        return this.tags.div("loading"), this.tags.div("symbol").appendTo("loading"), this.tags.i("leftDot").appendTo("symbol"), this.tags.i("rightDot").appendTo("symbol"), this.tags.get("loading")
    }), e.data.add("touched", Object()), e.helpers.add("touch", function(t, i) {
        var a;
        return a = e.data.get("touched"), t.addEventListener("touchstart", function(e) {
            var t;
            return t = e.changedTouches[0], a.startx = parseInt(t.clientX), a.starty = parseInt(t.clientY)
        }), t.addEventListener("touchend", function(e) {
            var t, n, d;
            return d = e.changedTouches[0], t = Math.abs(a.startx - parseInt(d.clientX)), n = Math.abs(a.starty - parseInt(d.clientY)), 60 > t && 60 > t ? i() : void 0
        })
    }), e.helpers.add("onload", function(e) {
        return window.addEventListener ? window.addEventListener("load", e) : void 0
    }), e.actions.add("me", function() {
        var t, i;
        return i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], !e.states.get("animating") && e.nodes.get("nextSlide") && i && e.actions.trigger("cacheCheck?") ? (e.data.get("SlidesNotCompleted")[e.data.get("currentSlide")] || e.actions.trigger("loadingAnimation"), e.states.set("animating", !0), e.actions.trigger("advanceSlide"), e.actions.trigger("processSlide", {
            id: i.id,
            value: !0
        }), e.data.counter("currentSlide").up(), e.callbacks.trigger("Me")) : !e.states.get("animating") && e.nodes.get().nextSlide && i ? (e.actions.trigger("setWifiLoading", !0), e.actions.trigger("failSlideAnimation")) : void 0
    }), e.actions.add("notMe", function() {
        var t, i;
        return i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], !e.states.get("animating") && e.nodes.get("nextSlide") && i && e.actions.trigger("cacheCheck?") ? (e.data.get("SlidesNotCompleted")[e.data.get("currentSlide")] || e.actions.trigger("loadingAnimation"), e.states.set("animating", !0), e.actions.trigger("advanceSlide"), i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], e.actions.trigger("processSlide", {
            id: i.id,
            value: !1
        }), e.data.counter("currentSlide").up(), e.callbacks.trigger("notMe")) : !e.states.get("animating") && e.nodes.get().nextSlide && i ? (e.actions.trigger("setWifiLoading", !0), e.actions.trigger("failSlideAnimation")) : void 0
    }), e.actions.add("advanceSlide", function() {
        var t, i;
        return e.nodes.get("progressBarInner").style.width = e.helpers.getProgressBarNumbers() + "%", e.nodes.get("playedSlide") && e.nodes.get("slides").removeChild(e.nodes.get("playedSlide")), e.nodes.set("playedSlide", e.nodes.get("currentSlide")), e.nodes.set("currentSlide", e.nodes.get("nextSlide")), t = function(t) {
            return e.actions.trigger("advancedSlide"), e.states.set("animating", !1)
        }, Traitify.oldIE || (e.nodes.get("currentSlide").addEventListener("webkitTransitionEnd", t, !1), e.nodes.get("currentSlide").addEventListener("transitionend", t, !1), e.nodes.get("currentSlide").addEventListener("oTransitionEnd", t, !1), e.nodes.get("currentSlide").addEventListener("otransitionend", t, !1)), Traitify.oldIE && t(), e.nodes.get("playedSlide").className += " played", e.nodes.get("currentSlide").className += " active", i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], i ? (e.nodes.set("nextSlide", e.views.render("slide", i)), e.nodes.get("slides").appendChild(e.nodes.get().nextSlide), e.callbacks.trigger("AdvanceSlide")) : void 0
    }), e.actions.add("loadingAnimation", function() {
        return e.nodes.get("meNotMeContainer").className += " hide", e.nodes.get("slides").removeChild(e.nodes.get("currentSlide")), e.nodes.get("slides").insertBefore(e.views.render("loadingAnimation"), e.nodes.get("slides").firstChild)
    }), e.data.add("imageCache", Object()), e.actions.add("prefetchSlides", function() {
        return e.data.add("slideIndex", 0), e.actions.trigger("fetchNext")
    }), e.actions.add("fetchNext", function() {
        var t, i, a;
        return e.data.set("fetchErroring", !1), a = e.data.get("SlidesNotCompleted"), i = a[e.data.get("slideIndex")], t = new Image, t.id = i.id, t.onerror = function() {
            var t, i, a;
            return e.data.get("fetchErroring") || (e.data.set("fetchSlides", !0), e.data.set("fetchErroring", !0), setTimeout(function() {
                return e.actions.trigger("cacheCheck?") ? void 0 : (e.data.set("fetchSlides", !1), e.actions.trigger("setWifiLoading", !1), e.views.render("internetFailure").appendTo("meNotMeContainer"))
            }, 3e4)), i = this.onload, t = this.onerror, a = this.src, e.data.get("fetchSlides") ? setTimeout(function() {
                var e;
                return e = new Image, e.onload = i, e.onerror = t, e.src = a
            }, 1e3) : void 0
        }, t.onload = function() {
            return e.data.get("imageCache")[this.src] = !0, e.data.counter("slideIndex").up(), e.data.get("SlidesNotCompleted")[e.data.get("slideIndex")] && e.actions.trigger("fetchNext"), e.actions.trigger("cacheCheck?") ? e.actions.trigger("setWifiLoading", !1) : void 0
        }, t.src = i.image_desktop_retina
    }), e.actions.add("cacheCheck?", function() {
        var t;
        return t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], t ? e.data.get("imageCache")[t.image_desktop_retina] : e.data.get("currentSlide") + 1 >= e.data.get("SlidesNotCompleted").length ? !0 : void 0
    }), e.actions.add("setWifiLoading", function(t) {
        var i;
        return t ? (i = e.views.render("wifiLoading"), i.className += " fade-in", i.appendTo("meNotMeContainer")) : e.views.tags.get("wifiLoading") ? (e.views.tags.get("wifiLoading").parentNode.removeChild(e.views.tags.get("wifiLoading")), e.views.tags.library.set("wifiLoading", null)) : void 0
    }), e.actions.add("failSlideAnimation", function() {
        return e.nodes.get("currentSlide").className = e.nodes.get("currentSlide").className + " not-ready-animation"
    }), e.actions.add("setContainerSize", function() {
        var t;
        return t = e.nodes.get("main").scrollWidth, e.nodes.get("container").className = e.nodes.get("container").className.replace(" medium", ""), e.nodes.get("container").className = e.nodes.get("container").className.replace(" large", ""), e.nodes.get("container").className = e.nodes.get("container").className.replace(" small", ""), 480 > t ? e.nodes.get("container").className += " small" : 768 > t ? e.nodes.get("container").className += " medium" : void 0
    }), e.actions.add("onRotate", function(e) {
        var t, i;
        return i = "onorientationchange" in window, t = i ? "orientationchange" : "resize", window.addEventListener(t, function(t) {
            return e(t)
        }, !1)
    }), e.initialization.events.add("Setup Data", function() {
        var t, i, a, n;
        return a = e.data.get("Slides"), i = e.data.get("slideValues").map(function(e) {
            return e.id
        }), e.data.add("currentSlide", 1), t = e.data.get("Slides").filter(function(e) {
            return e.response || -1 !== i.indexOf(e.id)
        }), n = e.data.get("Slides").filter(function(e) {
            return !e.response && -1 === i.indexOf(e.id)
        }), e.data.add("SlidesCompleted", t), e.data.add("SlidesNotCompleted", n), e.data.add("sentSlides", 0), e.data.add("slidesToPlayLength", e.data.get("SlidesNotCompleted").length)
    }), e.initialization.events.add("Handle device type", function() {
        return e.nodes.set("container", e.views.render("slideDeckContainer")), e.device && (e.nodes.get("container").className += " " + e.device, e.nodes.get("container").className += " mobile phone", e.nodes.get("container").className += " non-touch"), t && t.size && (e.nodes.get("container").className += " " + t.size), e.nodes.get("main").appendChild(e.nodes.get().container), e.actions.trigger("cacheCheck?") ? void 0 : e.actions.trigger("setWifiLoading", !0)
    }), e.initialization.events.add("Actions", function() {
        return "iphone" === e.device || "ipad" === e.device ? (e.helpers.touch(e.nodes.get("notMe"), function() {
            return e.actions.trigger("notMe")
        }), e.helpers.touch(e.nodes.get("me"), function() {
            return e.actions.trigger("me")
        })) : (e.nodes.get("notMe").onclick = function() {
            return e.actions.trigger("notMe")
        }, e.nodes.get("me").onclick = function() {
            return e.actions.trigger("me")
        })
    }), e.initialization.events.add("Prefetch Slides", function() {
        return e.actions.trigger("prefetchSlides")
    }), e.initialization.events.add("Setup Screen", function() {
        var t;
        return e.actions.trigger("setContainerSize"), window.onresize = function() {
            return e.device ? void 0 : e.actions.trigger("setContainerSize")
        }, e.device && e.device ? (t = function() {
            return e.helpers.add("windowOrienter", function() {
                return e.nodes.get("main").style.height = window.innerHeight + "px"
            }), e.helpers.windowOrienter()
        }, e.actions.trigger("onRotate", function(t) {
            return e.helpers.windowOrienter()
        }), e.helpers.onload(function() {
            return t()
        }), t()) : void 0
    }), e.initialization.events.add("initialized", function() {
        return e.states.set("initialized", !0), e.callbacks.trigger("Initialize"), e.data.add("currentSlideTime", (new Date).getTime())
    })
});
Traitify.ui.widget("results", function(e, a) {
    return e.states.add("initialized"), e.callbacks.add("Initialize"), e.dataDependency("PersonalityTypes"), e.styleDependency("all"), e.styleDependency("results/default"), e.initialization.events.add("Setup Data", function() {
        return e.views.render("Results").appendTo("main"), e.callbacks.trigger("Initialize")
    }), e.views.add("Results", function() {
        return this.tags.div("tfResults"), Traitify.oldIE && (this.tags.get("tfResults").className += " ie"), this.render("Personality Blend").appendTo("tfResults"), this.tags.library.get("tfResults")
    }), e.views.add("Personality Blend", function() {
        var a, t, i;
        return e.data.get("PersonalityTypes").personality_blend ? (this.tags.div("personalityBlend"), a = e.data.get("PersonalityTypes").personality_blend, this.render("Personality Blend Badges").appendTo("personalityBlend"), t = a.name ? a.name.replace("/", "/&#8203;") : "", this.tags.div("name", t).appendTo("personalityBlend"), this.tags.div("blendDescription", a.description).appendTo("personalityBlend")) : (this.tags.div("personalityType"), i = e.data.get("PersonalityTypes").personality_types[0].personality_type, this.render("Personality Type Badge").appendTo("personalityType"), this.tags.div("name", i.name).appendTo("personalityType"), this.tags.div("typeDescription", i.description).appendTo("personalityType")), this.tags.library.get("personalityBlend") || this.tags.library.get("personalityType")
    }), e.views.add("Personality Blend Badges", function() {
        var a, t, i, s, n, r, d;
        return s = e.data.get("PersonalityTypes").personality_blend, r = s.personality_type_1, a = e.helpers.hexToRGB(r.badge.color_1), this.tags.div("badgesContainer"), i = Traitify.oldIE ? {} : {
            style: {
                backgroundColor: "rgba(" + a.join(", ") + ", .07)",
                borderColor: "#" + r.badge.color_1
            }
        }, this.tags.div("leftBadge", i).appendTo("badgesContainer"), this.tags.img("leftBadgeImage", r.badge.image_medium).appendTo("leftBadge"), d = s.personality_type_2, t = e.helpers.hexToRGB(d.badge.color_1), n = Traitify.oldIE ? {} : {
            style: {
                backgroundColor: "rgba(" + t.join(", ") + ", .07)",
                borderColor: "#" + d.badge.color_1
            }
        }, this.tags.div("rightBadge", n).appendTo("badgesContainer"), this.tags.img("leftBadgeImage", d.badge.image_medium).appendTo("rightBadge"), this.tags.library.get("badgesContainer")
    }), e.views.add("Personality Type Badge", function() {
        var a, t, i, s, n;
        return n = e.data.get("PersonalityTypes").personality_types[0].personality_type, this.tags.div("badgesContainer"), i = e.helpers.hexToRGB(n.badge.color_1), a = Traitify.oldIE ? "" + n.badge.color_1 : "rgba(" + i.join(", ") + ", .07)", t = this.tags.div("badge", {
            style: {
                backgroundColor: a,
                borderColor: "#" + n.badge.color_1
            }
        }).appendTo("badgesContainer"), s = this.tags.img("badgeImage", n.badge.image_medium).appendTo("badge"), this.tags.library.get("badgesContainer")
    })
});
Traitify.ui.widget("personalityTypes", function(e, t) {
    return e.states.add("initialized"), e.dataDependency("PersonalityTypes"), e.styleDependency("all"), e.styleDependency("results/personality-types"), e.callbacks.add("Initialize"), e.initialization.events.add("Setup Data", function() {
        return e.views.render("Personality Types Container").appendTo("main")
    }), e.views.add("Personality Types Container", function() {
        var t, i;
        return i = this.tags.div("tfPersonalityTypes"), Traitify.oldIE && (i.className += " ie"), this.tags.div("personalityTypesContainerScroller").appendTo("tfPersonalityTypes"), this.tags.div("personalityTypesContainer").appendTo("personalityTypesContainerScroller"), this.render("Personality Types").appendTo("personalityTypesContainer"), t = this.tags.div("description").appendTo("tfPersonalityTypes"), t.innerHTML = e.data.get("PersonalityTypes").personality_types[0].personality_type.description, e.callbacks.trigger("Initialize"), i
    }), e.views.add("Personality Types", function() {
        var t, i, a, n, s, r;
        for (a = this.tags.div("personalityTypes", Object()), s = Array(), this.tags.div("arrow").appendTo("personalityTypes"), this.tags.div("icon").appendTo("arrow"), s = e.data.get("PersonalityTypes").personality_types, t = 0; t < s.length;) n = s[t], this.tags.div("personalityType", {
            "data-index": t
        }).appendTo("personalityTypes"), i = this.tags.div("name", Object(), n.personality_type.name).appendTo("personalityType"), i.style.color = "#" + n.personality_type.badge.color_1, this.tags.img("badge", n.personality_type.badge.image_medium).appendTo("personalityType"), r = this.tags.div("score", Object(), "" + Math.round(n.score) + " / 100").appendTo("personalityType"), t++;
        return a
    }), e.initialization.events.add("personalityTypes", function() {
        var t, i, a, n, s;
        for (i = document.querySelectorAll(".tf-personality-types .personality-type"), s = [], a = 0, n = i.length; n > a; a++) t = i[a], s.push(t.onclick = function() {
            var t, i, a, n;
            return i = document.querySelector(".tf-personality-types .description"), n = this.getAttribute("data-index"), t = document.querySelector(".tf-personality-types .arrow"), t.style.left = 130 * n + "px", a = e.data.get("PersonalityTypes").personality_types[n].personality_type.description, i.innerHTML = a
        });
        return s
    })
});
Traitify.ui.widget("personalityTraits", function(t, i) {
    return t.states.add("initialized"), t.callbacks.add("Initialize"), t.dataDependency("PersonalityTraits"), t.styleDependency("all"), t.styleDependency("results/personality-traits"), t.initialization.events.add("Setup Data", function() {
        return t.views.render("Personality Traits Container").appendTo("main"), t.callbacks.trigger("Initialize")
    }), t.views.add("Personality Traits Container", function() {
        var t, i, a, e, r;
        for (i = this.tags.div("tfPersonalityTraits"), Traitify.oldIE && (i.className += " ie"), this.tags.div("personalityTraits").appendTo("tfPersonalityTraits"), r = this.data.get("PersonalityTraits").slice(0, 8), t = 0; t < r.length;) e = r[t].personality_trait, a = e.personality_type, this.tags.div(["personalityTraits.trait"], {
            style: {
                borderColor: "#" + a.badge.color_1
            }
        }).appendTo("personalityTraits"), this.tags.div(["personalityTraits.trait.name"], e.name).appendTo(["personalityTraits.trait", t]), Traitify.oldIE ? this.tags.img(["personalityTraits.trait.background"], a.badge.image_medium).appendTo(["personalityTraits.trait", t]) : this.tags.div(["personalityTraits.trait.background"], {
            style: {
                backgroundImage: "url('" + a.badge.image_medium + "')"
            }
        }).appendTo(["personalityTraits.trait", t]), this.tags.div(["personalityTraits.trait.definition"], e.definition).appendTo(["personalityTraits.trait", t]), t++;
        return i
    })
});
Traitify.ui.styles['all'] = '@font-face{font-family:"Source Sans Pro";font-style:normal;font-weight:400;src:local("Source Sans Pro"),local("Source Sans Pro"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/source-sans-pro.woff) format("woff")}@font-face{font-family:"Adelle Sans Bold";font-style:bold;font-weight:800;src:local("Adelle Sans Bold"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/adelle-sans-bold.woff) format("woff")}@font-face{font-family:"Adelle Sans";font-style:normal;font-weight:400;src:local("Adelle Sans"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/adelle-sans.woff) format("woff")}';
Traitify.ui.styles['slide-deck'] = '.tf-slide-deck-container{margin:0 auto;max-width:1200px;font-family:"Adelle Sans","Helvetica Neue",Helvetica,Arial,sans-serif;overflow:hidden;color:#fff;width:100%;position:relative;font-size:22px;-webkit-font-smoothing:antialised;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-box-sizing:initial;-moz-box-sizing:initial;box-sizing:initial}.tf-slide-deck-container .cover{display:none;background-color:#35aaf1}.tf-slide-deck-container .slides{position:relative}.tf-slide-deck-container .internet-failure{position:absolute;top:45%;width:100%;text-align:center;text-shadow:0 0 3px #000}.tf-slide-deck-container .slide .image{height:400px;background-size:cover}.tf-slide-deck-container .slides .loading{color:#000;text-align:center;position:absolute;width:100%;top:40%}.tf-slide-deck-container .slides .loading .left-dot{background-color:#058fc4;width:20px;height:20px}.tf-slide-deck-container .slides .loading .right-dot{background-color:#cb4e4e;width:20px;height:20px}.tf-slide-deck-container .slides .slide{padding:0;margin:0;box-sizing:initial;-webkit-transition:left .5s ease-in-out;-moz-transition:left .5s ease-in-out;-o-transition:left .5s ease-in-out;transition:left .5s ease-in-out;position:absolute;left:100%;top:0;width:100%}.tf-slide-deck-container .slides .slide.active{left:0}.tf-slide-deck-container .slides .slide.played{left:-100%}.tf-slide-deck-container .slides .slide img{width:100%}.tf-slide-deck-container .slides .slide.active.not-ready-animation{-webkit-animation:not-ready-animation 1s}@-webkit-keyframes not-ready-animation{0%,100%{left:0}50%{left:-10%}}.tf-slide-deck-container .slides .slide.placeholder{position:relative}.tf-slide-deck-container .me-not-me-container.hide{margin-left:100%;opacity:0;visibility:hidden}.tf-slide-deck-container .me-not-me-container-attachment{position:absolute;z-index:1;bottom:0;width:100%;line-height:1em;text-align:center;padding-bottom:15px}.tf-slide-deck-container .me-not-me-container{position:relative;border-radius:30px;overflow:hidden;font-size:16px;display:inline-block;margin:0 auto;height:50px;width:370px;line-height:53px}.tf-slide-deck-container .wifi-loading{position:absolute;z-index:2;width:100%;height:100%;top:0;font-size:16px;vertical-align:middle;text-align:center}.tf-slide-deck-container .wifi-loading .loading .loading-text{-webkit-animation:pulse-animation 2s ease-in-out infinite;-moz-animation:pulse-animation .3s ease-in-out infinite;-o-animation:pulse-animation .3s ease-in-out infinite;animation:pulse-animation .3s ease-in-out infinite}.tf-slide-deck-container .wifi-loading .loading .refresh-button{cursor:pointer}@-webkit-keyframes pulse-animation{0%,100%{opacity:.3}10%{opacity:.2}50%{opacity:.9}60%{opacity:1}}.tf-slide-deck-container .wifi-loading .loading{font-size:18px;background-color:#058fc4;position:relative;width:100%;display:inline-block;color:#fff}.tf-slide-deck-container.medium .wifi-loading .loading{width:100%;font-size:14px}.tf-slide-deck-container .me,.tf-slide-deck-container .not-me{height:100%;text-align:center;cursor:pointer}.tf-slide-deck-container .me{background-color:#058fc4;position:relative;width:50%;display:inline-block}.tf-slide-deck-container .not-me{position:relative;width:50%;display:inline-block;background-color:#cb4e4e}.tf-slide-deck-container .me-not-me-container .not-me:active{background-color:#b44646}.tf-slide-deck-container .me-not-me-container .me:active{background-color:#007a9c}.tf-slide-deck-container .caption{background-color:rgba(0,0,0,.5);background-image:url(https://s3.amazonaws.com/traitify-cdn/images/black_transparent/50.png);padding:15px 0 10px;text-align:center;font-size:28px;position:absolute;width:100%}.tf-slide-deck-container .progress-bar{height:10px;display:block;background-color:rgba(255,255,255,.5);background-image:url(https://s3.amazonaws.com/traitify-cdn/images/white_transparent/50.png);position:absolute;z-index:1;width:100%;-webkit-box-shadow:none;box-shadow:none;-webkit-transition:none;transition:none}.tf-slide-deck-container .progress-bar .progress-bar-inner{width:0;height:10px;background-color:#fff;position:absolute;-webkit-animation-delay:2s;animation-delay:2s;-webkit-transition:width .3s linear;-moz-transition:width .3s linear;-o-transition:width .3s linear;transition:width .3s linear;border-radius:0 5px 5px 0}@media only screen and (min-width:760px){.tf-slide-deck-container .slide .image{height:570px}.tf-slide-deck-container .me-not-me-container{font-size:24px}.tf-slide-deck-container .slide .caption{font-size:32px}}.loading .symbol{width:30px;height:30px;margin:0 auto}.loading .symbol i{margin-left:-15px;width:30px;height:30px;display:inline-block;background:#cb4e4e;border-radius:50%;position:absolute}.loading .symbol i:nth-child(1){-webkit-transform:translate(-50px,0);-webkit-animation:loading-ani1 1s linear infinite}.loading .symbol i:nth-child(2){background:#058fc4;-webkit-transform:translate(50px,0);-webkit-animation:loading-ani2 1s linear infinite}@-webkit-keyframes loading-ani1{25%{z-index:2}50%{-webkit-transform:translate(50px,0) scale(1)}75%{-webkit-transform:translate(0,0) scale(.75)}100%{-webkit-transform:translate(-50px,0) scale(1)}}@-webkit-keyframes loading-ani2{25%{-webkit-transform:translate(0,0) scale(.75)}50%{-webkit-transform:translate(-50px,0) scale(1)}75%{z-index:2}100%{-webkit-transform:translate(50px,0) scale(1)}}.small.tf-slide-deck-container .me-not-me-container{width:250px;height:41px;line-height:47px;font-size:15px}.small.tf-slide-deck-container .slide .caption{font-size:18px}.medium.tf-slide-deck-container .slide .caption{font-size:24px}.medium.tf-slide-deck-container .me-not-me-container{width:290px;height:48px;line-height:50px;font-size:17px}.phone.tf-slide-deck-container .slide,.phone.tf-slide-deck-container .slide .image{height:100%}.phone.tf-slide-deck-container .progress-bar{background-color:rgba(255,255,255,.5);position:absolute;z-index:2;border:0;height:10px}.phone.tf-slide-deck-container .progress-bar-inner{border-radius:0 5px 5px 0;height:10px}.phone.tf-slide-deck-container .slide.placeholder .caption{z-index:-1}.phone:not(.non-touch).tf-slide-deck-container .caption{font-size:20px;background-color:transparent;position:relative;width:100%;padding-top:20px}.phone.tf-slide-deck-container .slide{padding:0;margin:0;-webkit-transition:width .4s linear;-moz-transition:width .4s linear;-o-transition:width .4s linear;transition:width .4s linear;position:absolute;right:0;top:0;width:0;left:auto}.phone.tf-slide-deck-container .slides .slide.played{right:auto;width:0;left:auto}.phone.tf-slide-deck-container .slides .slide.active{right:0;width:100%;left:auto}.phone.tf-slide-deck-container .slides .slide.active .caption{z-index:2}.phone.tf-slide-deck-container .slides .slide.played .caption{z-index:auto}.phone.tf-slide-deck-container,.phone.tf-slide-deck-container .slide .image,.phone.tf-slide-deck-container .slides{height:100%}.phone.tf-slide-deck-container .me-not-me-container{height:38px;line-height:42px;width:250px;font-size:20px}@media screen and (device-width:320px) and (orientation:landscape){.phone.tf-slide-deck-container .caption{font-size:16px}.phone.tf-slide-deck-container .progress-bar-inner{border-radius:0 4px 4px 0;height:8px}.phone.tf-slide-deck-container .me-not-me-container{font-size:40px}.phone.tf-slide-deck-container .cover{width:100%;height:100%;position:absolute;z-index:10;display:block}.phone.tf-slide-deck-container .cover .rotate-back{width:70%;margin-left:15%;margin-right:15%;height:70%;bottom:0;position:absolute;background-size:cover}}.phone.tf-slide-deck-container .caption{margin-top:10px;padding:10px 0}@media screen and (orientation:landscape){.iphone.tf-slide-deck-container .cover{width:100%;height:100%;position:absolute;z-index:10;display:block}.iphone.tf-slide-deck-container .cover .rotate-back{width:70%;margin-left:15%;margin-right:15%;height:70%;bottom:0;position:absolute;background-size:cover}.phone.tf-slide-deck-container .me-not-me-container{height:30px}.phone.tf-slide-deck-container .progress-bar,.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:5px}.phone.tf-slide-deck-container .slide .caption{font-size:12px;padding:3px;margin-top:5px}}.ipad.phone.tf-slide-deck-container .progress-bar{height:15px}.ipad.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:15px;border-radius:0 8px 8px 0}.ipad.phone.tf-slide-deck-container .slide .caption{margin-top:15px;font-size:28px}.ipad.phone.tf-slide-deck-container .me-not-me-container{width:400px;height:60px;font-size:28px;line-height:63px}@media screen and (orientation:landscape){.ipad.phone.tf-slide-deck-container .progress-bar,.ipad.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:10px}.ipad.phone.tf-slide-deck-container .slide .caption{margin-top:10px}.phone.android.tf-slide-deck-container .me-not-me-container{height:auto}.phone.android.tf-slide-deck-container .caption{font-size:20px;padding:5px 0}.non-touch.phone.android.tf-slide-deck-container .me-not-me-container .not-me,.phone.android.tf-slide-deck-container .me-not-me-container .me{font-size:18px;padding:5px 0}.phone.android.tf-slide-deck-container .me-not-me-container .me{width:30%;margin-left:20%;height:auto}.phone.android.tf-slide-deck-container .me-not-me-container .not-me{width:30%;margin-right:20%;height:auto}}';
Traitify.ui.styles['results/default'] = '.tf-results{font-family:"Source Sans Pro";padding:10px}.tf-results.ie{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.tf-results div,.tf-results img{box-sizing:content-box}.tf-results .personality-blend,.tf-results .personality-type{text-align:center}.tf-results .personality-blend .badges-container,.tf-results .personality-type .badges-container{max-width:264px;width:100%;margin:0 auto}.tf-results .personality-type .badges-container .badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;display:inline-block;background-color:rgba(255,255,255,.5);margin:0 auto}.tf-results.ie .personality-type .badge{border:0 solid}.tf-results .personality-type .badges-container .badge img{width:100%}.tf-results .personality-type .name{font-size:24px;margin:12px 0}.tf-results .personality-type .type-description{width:100%;position:relative;text-align:justify;max-width:860px;margin:0 auto}.tf-results .personality-blend .badges-container .left-badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;display:inline-block;background-color:rgba(255,255,255,.5)}.tf-results .personality-blend .badges-container .left-badge img{width:100%}.tf-results .personality-blend .badges-container .right-badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;margin-left:-10%;display:inline-block}.tf-results.ie .personality-blend .badges-container .left-badge,.tf-results.ie .personality-blend .badges-container .right-badge{border:0 solid}.tf-results.ie .personality-blend .badges-container .left-badge img,.tf-results.ie .personality-blend .badges-container .right-badge img{width:100px;height:100px}.tf-results .personality-blend .badges-container .right-badge img{width:100%}.tf-results .personality-blend .name{font-size:24px;margin:12px 0}.tf-results .personality-blend .blend-description{width:100%;position:relative;text-align:justify;max-width:860px;margin:0 auto}';
Traitify.ui.styles['results/personality-types'] = '.tf-personality-types{font-family:"Source Sans Pro"}.tf-personality-types.ie{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.tf-personality-types .description{max-width:860px;margin:-25px auto 0;padding:24px;text-align:justify}.tf-personality-types .personality-types-container{background-color:#022946;width:100%}.tf-personality-types .personality-types-container-scroller{height:220px;overflow-y:hidden;overflow-x:auto}.tf-personality-types .personality-types-container .personality-types{background-color:#022946;position:relative}.tf-personality-types .personality-types-container .personality-types .arrow{text-align:center;width:130px;bottom:-20px;position:absolute;left:0;-webkit-transition:left .2s linear;-moz-transition:left .2s linear;-o-transition:left .2s linear;transition:left .2s linear}.tf-personality-types .personality-types-container .personality-types .arrow .icon{width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-top:20px solid #022946;margin:0 auto}.tf-personality-types .personality-types-container .personality-types{width:910px;margin:0 auto}.tf-personality-types .personality-types-container .personality-types .personality-type{display:inline-block;width:130px;text-align:center;padding:20px 0;cursor:pointer}.tf-personality-types .personality-types-container .personality-types .personality-type .badge{width:60px;height:60px;margin:18px auto}.tf-personality-types .personality-types-container .personality-types .personality-type .name{font-family:"Adelle Sans Bold";text-align:center;margin:0 auto}.tf-personality-types .personality-types-container .personality-types .personality-type .score{color:#fff}';
Traitify.ui.styles['results/personality-traits'] = '.tf-personality-traits{font-family:"Source Sans Pro"}.tf-personality-traits.ie{font-family:arial}.tf-personality-traits div,.tf-personality-traits img{box-sizing:content-box}.tf-personality-traits .your-top-traits{font-size:24px;margin:20px;text-align:center}.tf-personality-traits .personality-traits{max-width:800px;margin:0 auto;text-align:center}.tf-personality-traits .personality-traits .trait{border-top:6px solid;border-color:#9af;display:inline-block;width:180px;margin:5px;vertical-align:top;background-color:#fff;height:180px;position:relative;line-height:1.2em;text-align:center}.tf-personality-traits.ie .personality-traits .trait{height:280px}@media (max-width:768px){.tf-personality-traits .personality-traits .trait{width:45%}}.tf-personality-traits .personality-traits .trait .name{font-family:"Adelle Sans Bold";margin:20px 20px 0;display:inline-block;font-weight:600;text-align:left}.tf-personality-traits.ie .personality-traits .trait .name{display:block;text-align:center}.tf-personality-traits .personality-traits .trait .definition{padding:0 20px;margin-top:10px;font-size:14px;font-weight:400;text-align:left}.tf-personality-traits .personality-traits .trait .background{width:80%;height:80%;margin:10%;top:10px;position:absolute;background-size:contain;background-repeat:no-repeat;background-position:center center;opacity:.15}.tf-personality-traits.ie .personality-traits .trait .background{margin:0 auto;width:50px;height:50px;position:relative}';
var ApiClient, SimplePromise, Traitify, console;
Array.prototype.map || (Array.prototype.map = function(t, e) {
    var r, n, o, i, s, a, u;
    if (o = void 0, r = void 0, i = void 0, "undefined" == typeof this || null === this) throw new TypeError(" this is null or not defined");
    if (n = Object(this), a = n.length >>> 0, "function" != typeof t) throw new TypeError(t + " is not a function");
    for (e && (o = e), r = new Array(a), i = 0; a > i;) s = void 0, u = void 0, i in n && (s = n[i], u = t.call(o, s, i, n), r[i] = u), i++;
    return r
}), Array.prototype.filter || (Array.prototype.filter = function(t) {
    "use strict";
    var e, r, n, o, i, s;
    if (void 0 === this || null === this) throw new TypeError;
    if (o = Object(this), r = o.length >>> 0, "function" != typeof t) throw new TypeError;
    for (n = [], i = arguments[1], e = 0; r > e;) e in o && (s = o[e], t.call(i, s, e, o) && n.push(s)), e++;
    return n
}), Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
    var e, r;
    for (r = this.length >>> 0, e = Number(arguments[1]) || 0, e = 0 > e ? Math.ceil(e) : Math.floor(e), 0 > e && (e += r); r > e;) {
        if (e in this && this[e] === t) return e;
        e++
    }
    return -1
}), console || (console = {
    log: function() {}
}), Object.keys || (Object.keys = function() {
    "use strict";
    var t, e, r, n;
    return n = Object.prototype.hasOwnProperty, r = !{
            toString: null
        }.propertyIsEnumerable("toString"), t = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"], e = t.length,
        function(o) {
            var i, s, a;
            if ("object" != typeof o && ("function" != typeof o || null === o)) throw new TypeError("Object.keys called on non-object");
            a = [], s = void 0, i = void 0;
            for (s in o) n.call(o, s) && a.push(s);
            if (r)
                for (i = 0; e > i;) n.call(o, t[i]) && a.push(t[i]), i++;
            return a
        }
}()), SimplePromise = function(t) {
    var e;
    return e = Object(), e.then = function(t) {
        return e.thenCallback = t, e.resolved && e.thenCallback(e.data), e
    }, e.resolved = !1, e.resolve = function(t) {
        return e.data = t, e.thenCallback ? e.thenCallback(t) : e.resolved = !0, e
    }, e["catch"] = function(t) {
        return e.rejected ? t(e.error) : e.rejectCallback = t, e
    }, e.rejected = !1, e.reject = function(t) {
        return e.error = t, e.rejectCallback ? e.rejectCallback(t) : e.rejected = !0, e
    }, t(e.resolve, e.reject), e
}, ApiClient = function() {
    function t() {
        this.host = "https://api.traitify.com", this.version = "v1", "undefined" != typeof XDomainRequest ? this.oldIE = !0 : this.oldIE = !1, this.beautify = !1, this.XHR = XMLHttpRequest
    }
    return t.prototype.online = function() {
        return navigator.onLine
    }, t.prototype.setBeautify = function(t) {
        return this.beautify = t, this
    }, t.prototype.setHost = function(t) {
        return t.match(/http/) || (t = "https://" + t), this.oldIE && (t = t.replace("https://", "").replace("http://", ""), t = "" + location.protocol + "//" + t), this.host = t, this
    }, t.prototype.setPublicKey = function(t) {
        return this.publicKey = t, this
    }, t.prototype.setVersion = function(t) {
        return this.version = t, this
    }, t.prototype.ajax = function(t, e, r, n) {
        var o, i, s, a, u, c, p, l;
        if (o = this.beautify, p = "" + this.host + "/" + this.version + e, l = new this.XHR, "withCredentials" in l && !this.oldIE) l.open(t, p, !0);
        else {
            if ("undefined" == typeof XDomainRequest) return new SimplePromise(function(t, e) {
                return e("CORS is Not Supported By This Browser")
            });
            this.oldIE && (c = (new Date).getTime(), p += -1 === p.indexOf("?") ? "?authorization=" + this.publicKey + "&reset_cache=" + c : "&authorization=" + this.publicKey + "&reset_cache=" + c), l = new XDomainRequest, l.open(t, p)
        }
        return l && !this.oldIE && (l.setRequestHeader("Authorization", "Basic " + btoa(this.publicKey + ":x")), l.setRequestHeader("Content-type", "application/json"), l.setRequestHeader("Accept", "application/json")), u = this, s = this.online(), i = this.oldIE, a = new SimplePromise(function(t, e) {
            if (u.reject = e, !s) return u.reject();
            try {
                return l.onload = function() {
                    var e;
                    return 404 === l.status ? u.reject(l.response) : (e = i ? l.responseText : l.response, o && (e = e.replace(/_([a-z])/g, function(t, e) {
                        return e.toUpperCase()
                    }).replace(/_/g, "")), e = JSON.parse(e), r && r(e), u.resolve = t, u.resolve(e))
                }, l.onprogress = function() {}, l.ontimeout = function() {}, l.onerror = function() {}, window.setTimeout(function() {
                    try {
                        return l.send(JSON.stringify(n))
                    } catch (t) {
                        return u.reject(t)
                    }
                }, 0), l
            } catch (a) {
                return u.reject(a)
            }
        })
    }, t.prototype.put = function(t, e, r) {
        return this.oldIE ? this.ajax("POST", t, r, e) : this.ajax("PUT", t, r, e)
    }, t.prototype.get = function(t, e) {
        return this.ajax("GET", t, e, "")
    }, t.prototype.getDecks = function(t) {
        return this.get("/decks", t)
    }, t.prototype.getSlides = function(t, e) {
        return this.get("/assessments/" + t + "/slides", e)
    }, t.prototype.addSlide = function(t, e, r, n, o) {
        return this.put("/assessments/" + t + "/slides/" + e, {
            response: r,
            time_taken: n
        }, o)
    }, t.prototype.addSlides = function(t, e, r) {
        return this.put("/assessments/" + t + "/slides", e, r)
    }, t.prototype.getPersonalityTypes = function(t, e, r) {
        var n, o, i, s, a, u;
        for (null == e && (e = Object()), null == (a = e.image_pack) && (e.image_pack = "linear"), o = Array(), u = Object.keys(e), i = 0, s = u.length; s > i; i++) n = u[i], o.push("" + n + "=" + e[n]);
        return this.get("/assessments/" + t + "/personality_types?" + o.join("&"), r)
    }, t.prototype.getPersonalityTraits = function(t, e, r) {
        return this.get("/assessments/" + t + "/personality_traits/raw", r)
    }, t.prototype.getCareers = function(t, e, r) {
        var n, o, i, s, a, u;
        for (null == e && (e = Object()), null == (a = e.number_of_matches) && (e.number_of_matches = 8), o = Array(), u = Object.keys(e), i = 0, s = u.length; s > i; i++) n = u[i], o.push("" + n + "=" + e[n]);
        return this.get("/assessments/" + t + "/matches/careers?" + o.join("&"), r)
    }, t
}(), Traitify = new ApiClient;
var Ui;
Ui = function() {
    function e() {
        this.widgets = Object(), this.userAgent = navigator.userAgent, this.runningWidgets = Object()
    }
    return e.prototype.load = function(e, t, n, i) {
        var s, r, u, a, d, c, g, l, o, h, f, p, b, y, O, j, v;
        if (null == n && (n = Object()), a = Object(), d = Object(), c = this.widgets[e]) return g = e, e = t, t = n, n = i, null == n && (n = Object()), null == (y = n[g]) && (n[g] = Object()), c = c(e, t, n), Traitify.ui.loadResults({
            slideDeck: c
        }), c;
        for (s = Object(), O = Object.keys(this.widgets), l = 0, f = O.length; f > l; l++) g = O[l], r = n[g] && n[g].target ? n[g].target : t, this.runningWidgets[g] = this.widgets[g](e, r, n), u = this.runningWidgets[g].dataDependencies, -1 !== u.indexOf("Slides") ? (d[g] = this.runningWidgets[g], d[g].widgets = s) : (a[g] = this.runningWidgets[g], a[g].widgets = s);
        if (0 !== Object.keys(d).length) {
            for (Traitify.getSlides(e).then(function(e) {
                    var t, i, s, r, u, c, g, l;
                    for (t = e.filter(function(e) {
                            return "number" == typeof e.completed_at
                        }), i = 0 === Object.keys(n).filter(function(e) {
                            return n[e].showResults === !1
                        }).length, g = Object.keys(d), l = [], u = 0, c = g.length; c > u; u++) r = g[u], s = d[r], s.data.add("Slides", e), t.length === e.length ? (s.callbacks.trigger("Finished"), i ? l.push(Traitify.ui.loadResults(a)) : l.push(void 0)) : l.push(s.run());
                    return l
                }), j = Object.keys(a), o = 0, p = j.length; p > o; o++) g = j[o], s[g] = a[g];
            for (v = Object.keys(d), h = 0, b = v.length; b > h; h++) g = v[h], s[g] = d[g];
            return s
        }
    }, e.prototype.loadResults = function(e) {
        var t, n, i, s, r, u, a, d, c;
        for (t = Object(), d = Object.keys(e), c = [], u = 0, a = d.length; a > u; u++) r = d[u], s = e[r], s.widgets = e, 0 === s.dataDependencies.length ? c.push(s.run()) : c.push(function() {
            var u, a, d, c;
            for (d = s.dataDependencies, c = [], u = 0, a = d.length; a > u; u++) n = d[u], t[n] !== !0 ? (t[n] = !0, i = Traitify["get" + n](s.assessmentId), i.cleanName = n, c.push(i.then(function(t) {
                var i, u, a, d, c, g, l, o;
                for (n = this.cleanName, u = Object.keys(e).filter(function(t) {
                        return e[t], -1 !== e[t].dataDependencies.indexOf(n)
                    }), o = [], a = 0, c = u.length; c > a; a++) {
                    for (r = u[a], s = e[r], s.data.add(n, t), i = !0, l = s.dataDependencies, d = 0, g = l.length; g > d; d++) n = l[d], !s.data.get(n);
                    i ? o.push(s.run()) : o.push(void 0)
                }
                return o
            }))) : c.push(void 0);
            return c
        }());
        return c
    }, e.prototype.widget = function(e, t) {
        var n;
        return n = this.styles, Traitify.ui.widgets[e] = function(e, n, i) {
            var s;
            return s = new Widget(n), s.data.cookies.scope = e, s.build = t, s.assessmentId = e, s.options = i, s.build(s), s
        }
    }, e
}(), Traitify.ui = new Ui, Traitify.ui.styles = Object();
var Actions, Callbacks, Cookie, Data, Helpers, Library, Stack, States, Tags, Views, Widget, __hasProp = {}.hasOwnProperty,
    __extends = function(t, e) {
        function r() {
            this.constructor = t
        }
        for (var i in e) __hasProp.call(e, i) && (t[i] = e[i]);
        return r.prototype = e.prototype, t.prototype = new r, t.__super__ = e.prototype, t
    };
Helpers = function() {
    function t() {}
    return t.prototype.toDash = function(t) {
        return t ? t.replace(/([A-Z])/g, function(t) {
            return "-" + t.toLowerCase()
        }) : void 0
    }, t.prototype.hexToRGB = function(t) {
        var e;
        return 0 !== t.length ? (e = t.match(/([\da-f]{2})([\da-f]{2})([\da-f]{2})/i), e.slice(1).map(function(t) {
            return parseInt(t, 16)
        })) : void 0
    }, t.prototype.add = function(t, e) {
        return this[t] = e
    }, t
}(), Cookie = function() {
    function t() {
        this.scope = "default"
    }
    return t.prototype.set = function(t, e, r) {
        var i;
        return this.time = null != r ? r : 2, r = new Date, r.setTime(r.getTime() + 6e4 * this.time), i = "expires=" + r.toUTCString(), e = JSON.stringify(e), document.cookie = "tf-cookie-" + this.scope + "-" + t + "=" + e + "; " + i
    }, t.prototype.get = function(t) {
        var e, r, i, n;
        for (r = document.cookie.split(";"), i = 0, t = "tf-cookie-" + this.scope + "-" + t + "="; i < r.length;) {
            for (e = r[i];
                " " === e.charAt(0);) e = e.substring(1); - 1 !== e.indexOf(t) && (n = e.substring(t.length, e.length)), i++
        }
        return n ? JSON.parse(n) : void 0
    }, t
}(), Library = function() {
    function t() {
        this.store = Object()
    }
    return t.prototype.add = function(t, e) {
        return this.store[t] = e
    }, t.prototype.set = function(t, e) {
        return this.add(t, e)
    }, t.prototype.get = function(t) {
        return t ? this.store[t] : this.store
    }, t.prototype.remove = function(t) {
        return this.store[t] ? delete this.store[t] : !1
    }, t
}(), Callbacks = function() {
    function t(t) {
        this.parent = t, this.library = new Library, this.states = new Library
    }
    return t.prototype.trigger = function(t) {
        return this.library.get(t) ? this.library.get(t)(this) : this.states.add(t, !0)
    }, t.prototype.add = function(t) {
        var e, r;
        return r = this.states, e = this.library, this.parent["on" + t] = function(i) {
            return r.get(t) ? i() : e.add(t, i)
        }
    }, t
}(), Tags = function() {
    function t() {
        this.library = new Library
    }
    return t.prototype.div = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "div", e, r)
    }, t.prototype.span = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "span", e, r)
    }, t.prototype.img = function(t, e, r) {
        return null == r && (r = Object()), r.src = e, this.tag(t, "img", r)
    }, t.prototype.hr = function(t, e) {
        return this.tag(t, "hr", e)
    }, t.prototype.i = function(t, e, r) {
        return this.tag(t, "i", e, r)
    }, t.prototype.a = function(t, e, r) {
        return "string" == typeof e && (r = e, e = Object()), this.tag(t, "a", e, r)
    }, t.prototype.get = function(t) {
        return this.library.get(t)
    }, t.prototype.tag = function(t, e, r, i) {
        var n, s, o, a, u, c, h, p, y, l;
        o = document.createElement(e), c = !1, "object" == typeof t && (t = t[0], c = !0), -1 !== t.indexOf(".") ? (a = t.split("."), a = a[a.length - 1]) : a = t, null == r && (r = Object()), s = (new Helpers).toDash(a), null == (y = r["class"]) && (r["class"] = ""), r["class"] = 0 === r["class"].length ? s : " " + s;
        for (n in r)
            if ("style" !== n) o.setAttribute(n, r[n]);
            else
                for (l = Object.keys(r.style), h = 0, p = l.length; p > h; h++) u = l[h], o.style[u] = r[n][u];
        return c ? (this.library.get(t) || this.library.add(t, Array()), this.library.get(t).push(o)) : this.library.add(t, o), o.library = this.library, o.appendTo = function(e) {
            var r;
            return "object" == typeof e ? (t = e[0], r = e[1], this.library.store[t][r].appendChild(this)) : this.library.get(e).appendChild(this)
        }, i && (o.innerHTML = i), o
    }, t
}(), Data = function(t) {
    function e() {
        e.__super__.constructor.call(this), this.cookies = new Cookie, this.persists = Object()
    }
    return __extends(e, t), e.prototype.add = function(t, r) {
        return e.__super__.add.call(this, t, r), this.persists[t] && this.cookies.set(t, r, this.persists[t]), r
    }, e.prototype.get = function(t) {
        return this.persists[t] && !this.store[t] ? this.set(t, this.cookies.get(t)) : e.__super__.get.call(this, t)
    }, e.prototype.counter = function(t) {
        var e;
        return e = this.store, {
            up: function(r) {
                return e[t] += r || 1
            },
            down: function(r) {
                return e[t] -= r || 1
            }
        }
    }, e.prototype.persist = function(t, e) {
        return null == e && (e = 2), void(this.persists[t] = e)
    }, e
}(Library), Views = function() {
    function t() {
        this.library = new Library, this.tags = new Tags
    }
    return t.prototype.add = function(t, e) {
        return this.library.add(t, e)
    }, t.prototype.render = function(t, e) {
        return this.library.get(t) ? this.library.get(t).call(this, e) : void 0
    }, t.prototype.remove = function(t, e) {
        return this.library.remove(t)
    }, t
}(), Stack = function() {
    function t() {
        this.events = new Library
    }
    return t.prototype.trigger = function(t) {
        var e, r, i, n, s, o, a;
        if (t) return this.events.get(t)();
        for (i = this.events.get(), o = Object.keys(i), a = [], n = 0, s = o.length; s > n; n++) r = o[n], e = i[r], a.push(e());
        return a
    }, t
}(), Actions = function(t) {
    function e() {
        return e.__super__.constructor.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.trigger = function(t, e) {
        return this.get(t) ? this.get(t)(e) : void 0
    }, e
}(Library), States = function(t) {
    function e() {
        return e.__super__.constructor.apply(this, arguments)
    }
    return __extends(e, t), e.prototype.add = function(t, r) {
        return null == r && (r = !1), e.__super__.add.call(this, t, r)
    }, e.prototype.set = function(t, e) {
        return this.add(t, e)
    }, e
}(Library), Widget = function() {
    function t(t) {
        this.target = t, this.views = new Views, this.library = new Library, this.data = new Data, this.dataDependencies = Array(), this.styles = Array(), this.states = new States, this.callbacks = new Callbacks(this), this.helpers = new Helpers, this.actions = new Actions, this.initialization = new Stack, this.views.data = this.data, this.userAgent = Traitify.ui.userAgent, this.views.tags.library.add("main", document.querySelector(this.target)), this.views.tags.library.get("main").innerHTML = "", this.userAgent.match(/iPad/i) && (this.device = "ipad"), this.userAgent.match(/iPhone/i) && (this.device = "iphone"), this.userAgent.match(/Android/i) && (this.device = "android"), this.userAgent.match(/BlackBerry/i) && (this.device = "blackberry"), this.userAgent.match(/webOS/i) && (this.device = "webos"), this.nodes = this.views.tags.library
    }
    return t.prototype.version = "3.0.0 HNA", t.prototype.dataDependency = function(t) {
        return this.dataDependencies.push(t)
    }, t.prototype.styleDependency = function(t) {
        return this.styles.push(t)
    }, t.prototype.run = function() {
        var t, e, r, i, n, s;
        for (s = this.styles, i = 0, n = s.length; n > i; i++) t = s[i], e = document.createElement("style"), e.type = "text/css", Traitify.oldIE ? e.styleSheet ? e.styleSheet.cssText = Traitify.ui.styles[t] : (r = document.createTextNode(Traitify.ui.styles[t]), e.appendChild(r)) : e.innerHTML = Traitify.ui.styles[t], this.nodes.get("main").appendChild(e);
        return this.initialization.trigger()
    }, t
}();
Traitify.ui.widget("slideDeck", function(e, t) {
    return null == t && (t = Object()), e.data.add("slideResponses", Object()), e.states.add("animating"), e.states.add("finished"), e.states.add("initialized"), e.states.add("transitionEndListens"), e.states.add("imageWaiting"), e.callbacks.add("Initialize"), e.callbacks.add("Finished"), e.callbacks.add("AddSlide"), e.callbacks.add("Me"), e.callbacks.add("NotMe"), e.callbacks.add("AdvanceSlide"), e.data.persist("slideValues"), e.data.add("imageCache", Array()), e.data.add("fetchErroring"), e.styleDependency("all"), e.styleDependency("slide-deck"), e.states.add("trying", !0), e.dataDependency("Slides"), e.data.get("slideValues") || e.data.add("slideValues", Array()), e.actions.add("processSlide", function(t) {
        var i, a, n, d, s;
        return e.data.set("lastSlideTime", e.data.get("currentSlideTime")), e.data.set("currentSlideTime", (new Date).getTime()), d = e.data.get("slideValues"), d.push({
            id: t.id,
            response: t.value,
            time_taken: e.data.get("currentSlideTime") - e.data.get("lastSlideTime")
        }), e.data.set("slideValues", d), s = e.widgets, e.data.counter("sentSlides").up(), n = e.data.get("sentSlides"), e.data.get("slideValues").length % 10 === 0 || n === e.data.get("slidesToPlayLength") ? (i = Traitify.addSlides(e.assessmentId, e.data.get("slideValues")), a = e.data.get("slideValues"), e.data.set("slideValues", Array()), i.then(function(t) {
            var i, a, d, r;
            return e.callbacks.trigger("addSlide"), n === e.data.get("slidesToPlayLength") ? (e.nodes.get("main").innerHTML = "", null == (d = e.options) && (e.options = Object()), null == (r = (a = e.options).slideDeck) && (a.slideDeck = Object()), e.options && e.options.slideDeck.showResults !== !1 && (s = e.widgets, s.personalityTypes && (i = s.personalityTypes.callbacks, s.personalityTypes = Traitify.ui.load("personalityTypes", e.assessmentId, s.personalityTypes.target || e.target, s.personalityTypes.options), s.personalityTypes.callbacks = i), s.personalityTraits && (i = s.personalityTraits.callbacks, s.personalityTraits = Traitify.ui.load("personalityTraits", e.assessmentId, s.personalityTraits.target || e.target, s.personalityTraits.options), i = s.personalityTraits.callbacks, s.personalityTraits.callbacks = i), s.results && (i = s.results.callbacks, s.results = Traitify.ui.load("results", e.assessmentId, s.results.target || e.target, s.results.options), s.results.callbacks = i), s.famousPeople && (i = s.famousPeople.callbacks, s.famousPeople = Traitify.ui.load("famousPeople", e.assessmentId, s.famousPeople.target || e.target, s.famousPeople.options), s.famousPeople.callbacks = i)), e.callbacks.trigger("Finished")) : void 0
        })["catch"](function() {
            return console.log("internet offline"), e.data.set("slideValues", e.data.get("slideValues").concat(a))
        })) : void 0
    }), e.helpers.add("getProgressBarNumbers", function(t) {
        var i, a, n, d;
        return d = e.data.get("Slides").length, i = e.data.get("SlidesCompleted").length, n = e.data.get("SlidesNotCompleted").length, a = i + e.data.get("sentSlides"), t || (a += 1), Math.round(a / d * 100)
    }), e.views.add("internetFailure", function() {
        var t;
        return e.views.render("wifiLoading"), t = this.tags.get("loading").innerHTML, this.tags.get("loading").innerHTML = "", this.tags.div("refreshButton", "Refresh").appendTo("loading"), this.tags.get("refreshButton").onclick = function() {
            return e.views.tags.get("loading").innerHTML = t, e.actions.trigger("fetchNext")
        }, this.tags.get("wifiLoading")
    }), e.views.add("wifiLoading", function() {
        return this.tags.get("wifiLoading") || (this.tags.div("wifiLoading"), this.tags.div("loading").appendTo("wifiLoading"), this.tags.div("loadingText", "Loading").appendTo("loading")), this.tags.get("wifiLoading")
    }), e.views.add("slideDeckContainer", function() {
        var t, i, a;
        return i = this.tags.div("tfSlideDeckContainer"), t = this.tags.div("cover"), this.tags.tag("rotateBack", "object", {
            data: "https://s3.amazonaws.com/traitify-cdn/assets/images/js/landscape-phone.svg",
            type: "image/svg+xml"
        }).appendTo("cover"), i.appendChild(t), a = e.helpers.getProgressBarNumbers("initializing"), i.appendChild(e.views.render("progressBar", a)), i.appendChild(this.render("slides", e.data.get("SlidesNotCompleted"))), i.appendChild(this.render("meNotMe")), i
    }), e.views.add("meNotMe", function() {
        return this.tags.div("meNotMeContainerAttachment"), this.tags.div("meNotMeContainer").appendTo("meNotMeContainerAttachment"), this.tags.div("me").appendTo("meNotMeContainer"), this.tags.div("notMe").appendTo("meNotMeContainer"), e.nodes.get("notMe").innerHTML = "NOT ME", e.nodes.get("me").innerHTML = "ME", this.tags.get("meNotMeContainerAttachment")
    }), e.views.add("slides", function(t) {
        var i, a;
        return a = this.tags.div("slides"), i = e.views.render("slide", t[0]), i.appendTo("slides"), i.className += " placeholder", e.nodes.set("currentSlide", e.views.render("slide", t[0])), e.nodes.get("currentSlide").className += " active", e.nodes.get("currentSlide").appendTo("slides"), t[1] && (e.nodes.set("nextSlide", e.views.render("slide", t[1])), e.nodes.get("nextSlide").appendTo("slides")), e.nodes.set("slides", a), a
    }), e.views.add("slide", function(e) {
        var t, i, a, n;
        return i = this.tags.div("slide"), a = this.tags.div("caption"), a.innerHTML = e.caption || "", t = e.image_desktop_retina || "", n = this.tags.div(["slide.image"], {
            style: {
                backgroundImage: "url('" + t + "')",
                backgroundPosition: "" + (e.focus_x || "") + "% " + (e.focus_y || "") + "%"
            }
        }), n.appendChild(a), i.appendChild(n), i
    }), e.views.add("progressBar", function(t) {
        var i, a;
        return i = this.tags.div("progress-bar"), a = this.tags.div("progress-bar-inner"), a.style.width = t + "%", i.appendChild(a), e.nodes.set("progressBar", i), e.nodes.set("progressBarInner", a), i
    }), e.views.add("loadingAnimation", function() {
        return this.tags.div("loading"), this.tags.div("symbol").appendTo("loading"), this.tags.i("leftDot").appendTo("symbol"), this.tags.i("rightDot").appendTo("symbol"), this.tags.get("loading")
    }), e.data.add("touched", Object()), e.helpers.add("touch", function(t, i) {
        var a;
        return a = e.data.get("touched"), t.addEventListener("touchstart", function(e) {
            var t;
            return t = e.changedTouches[0], a.startx = parseInt(t.clientX), a.starty = parseInt(t.clientY)
        }), t.addEventListener("touchend", function(e) {
            var t, n, d;
            return d = e.changedTouches[0], t = Math.abs(a.startx - parseInt(d.clientX)), n = Math.abs(a.starty - parseInt(d.clientY)), 60 > t && 60 > t ? i() : void 0
        })
    }), e.helpers.add("onload", function(e) {
        return window.addEventListener ? window.addEventListener("load", e) : void 0
    }), e.actions.add("me", function() {
        var t, i;
        return i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], !e.states.get("animating") && e.nodes.get("nextSlide") && i && e.actions.trigger("cacheCheck?") ? (e.data.get("SlidesNotCompleted")[e.data.get("currentSlide")] || e.actions.trigger("loadingAnimation"), e.states.set("animating", !0), e.actions.trigger("advanceSlide"), e.actions.trigger("processSlide", {
            id: i.id,
            value: !0
        }), e.data.counter("currentSlide").up(), e.callbacks.trigger("Me")) : !e.states.get("animating") && e.nodes.get().nextSlide && i ? (e.actions.trigger("setWifiLoading", !0), e.actions.trigger("failSlideAnimation")) : void 0
    }), e.actions.add("notMe", function() {
        var t, i;
        return i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], !e.states.get("animating") && e.nodes.get("nextSlide") && i && e.actions.trigger("cacheCheck?") ? (e.data.get("SlidesNotCompleted")[e.data.get("currentSlide")] || e.actions.trigger("loadingAnimation"), e.states.set("animating", !0), e.actions.trigger("advanceSlide"), i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") - 1], e.actions.trigger("processSlide", {
            id: i.id,
            value: !1
        }), e.data.counter("currentSlide").up(), e.callbacks.trigger("notMe")) : !e.states.get("animating") && e.nodes.get().nextSlide && i ? (e.actions.trigger("setWifiLoading", !0), e.actions.trigger("failSlideAnimation")) : void 0
    }), e.actions.add("advanceSlide", function() {
        var t, i;
        return e.nodes.get("progressBarInner").style.width = e.helpers.getProgressBarNumbers() + "%", e.nodes.get("playedSlide") && e.nodes.get("slides").removeChild(e.nodes.get("playedSlide")), e.nodes.set("playedSlide", e.nodes.get("currentSlide")), e.nodes.set("currentSlide", e.nodes.get("nextSlide")), t = function(t) {
            return e.actions.trigger("advancedSlide"), e.states.set("animating", !1)
        }, Traitify.oldIE || (e.nodes.get("currentSlide").addEventListener("webkitTransitionEnd", t, !1), e.nodes.get("currentSlide").addEventListener("transitionend", t, !1), e.nodes.get("currentSlide").addEventListener("oTransitionEnd", t, !1), e.nodes.get("currentSlide").addEventListener("otransitionend", t, !1)), Traitify.oldIE && t(), e.nodes.get("playedSlide").className += " played", e.nodes.get("currentSlide").className += " active", i = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], i ? (e.nodes.set("nextSlide", e.views.render("slide", i)), e.nodes.get("slides").appendChild(e.nodes.get().nextSlide), e.callbacks.trigger("AdvanceSlide")) : void 0
    }), e.actions.add("loadingAnimation", function() {
        return e.nodes.get("meNotMeContainer").className += " hide", e.nodes.get("slides").removeChild(e.nodes.get("currentSlide")), e.nodes.get("slides").insertBefore(e.views.render("loadingAnimation"), e.nodes.get("slides").firstChild)
    }), e.data.add("imageCache", Object()), e.actions.add("prefetchSlides", function() {
        return e.data.add("slideIndex", 0), e.actions.trigger("fetchNext")
    }), e.actions.add("fetchNext", function() {
        var t, i, a;
        return e.data.set("fetchErroring", !1), a = e.data.get("SlidesNotCompleted"), i = a[e.data.get("slideIndex")], t = new Image, t.id = i.id, t.onerror = function() {
            var t, i, a;
            return e.data.get("fetchErroring") || (e.data.set("fetchSlides", !0), e.data.set("fetchErroring", !0), setTimeout(function() {
                return e.actions.trigger("cacheCheck?") ? void 0 : (e.data.set("fetchSlides", !1), e.actions.trigger("setWifiLoading", !1), e.views.render("internetFailure").appendTo("meNotMeContainer"))
            }, 3e4)), i = this.onload, t = this.onerror, a = this.src, e.data.get("fetchSlides") ? setTimeout(function() {
                var e;
                return e = new Image, e.onload = i, e.onerror = t, e.src = a
            }, 1e3) : void 0
        }, t.onload = function() {
            return e.data.get("imageCache")[this.src] = !0, e.data.counter("slideIndex").up(), e.data.get("SlidesNotCompleted")[e.data.get("slideIndex")] && e.actions.trigger("fetchNext"), e.actions.trigger("cacheCheck?") ? e.actions.trigger("setWifiLoading", !1) : void 0
        }, t.src = i.image_desktop_retina
    }), e.actions.add("cacheCheck?", function() {
        var t;
        return t = e.data.get("SlidesNotCompleted")[e.data.get("currentSlide") + 1], t ? e.data.get("imageCache")[t.image_desktop_retina] : e.data.get("currentSlide") + 1 >= e.data.get("SlidesNotCompleted").length ? !0 : void 0
    }), e.actions.add("setWifiLoading", function(t) {
        var i;
        return t ? (i = e.views.render("wifiLoading"), i.className += " fade-in", i.appendTo("meNotMeContainer")) : e.views.tags.get("wifiLoading") ? (e.views.tags.get("wifiLoading").parentNode.removeChild(e.views.tags.get("wifiLoading")), e.views.tags.library.set("wifiLoading", null)) : void 0
    }), e.actions.add("failSlideAnimation", function() {
        return e.nodes.get("currentSlide").className = e.nodes.get("currentSlide").className + " not-ready-animation"
    }), e.actions.add("setContainerSize", function() {
        var t;
        return t = e.nodes.get("main").scrollWidth, e.nodes.get("container").className = e.nodes.get("container").className.replace(" medium", ""), e.nodes.get("container").className = e.nodes.get("container").className.replace(" large", ""), e.nodes.get("container").className = e.nodes.get("container").className.replace(" small", ""), 480 > t ? e.nodes.get("container").className += " small" : 768 > t ? e.nodes.get("container").className += " medium" : void 0
    }), e.actions.add("onRotate", function(e) {
        var t, i;
        return i = "onorientationchange" in window, t = i ? "orientationchange" : "resize", window.addEventListener(t, function(t) {
            return e(t)
        }, !1)
    }), e.initialization.events.add("Setup Data", function() {
        var t, i, a, n;
        return a = e.data.get("Slides"), i = e.data.get("slideValues").map(function(e) {
            return e.id
        }), e.data.add("currentSlide", 1), t = e.data.get("Slides").filter(function(e) {
            return e.response || -1 !== i.indexOf(e.id)
        }), n = e.data.get("Slides").filter(function(e) {
            return !e.response && -1 === i.indexOf(e.id)
        }), e.data.add("SlidesCompleted", t), e.data.add("SlidesNotCompleted", n), e.data.add("sentSlides", 0), e.data.add("slidesToPlayLength", e.data.get("SlidesNotCompleted").length)
    }), e.initialization.events.add("Handle device type", function() {
        return e.nodes.set("container", e.views.render("slideDeckContainer")), e.device && (e.nodes.get("container").className += " " + e.device, e.nodes.get("container").className += " mobile phone", e.nodes.get("container").className += " non-touch"), t && t.size && (e.nodes.get("container").className += " " + t.size), e.nodes.get("main").appendChild(e.nodes.get().container), e.actions.trigger("cacheCheck?") ? void 0 : e.actions.trigger("setWifiLoading", !0)
    }), e.initialization.events.add("Actions", function() {
        return "iphone" === e.device || "ipad" === e.device ? (e.helpers.touch(e.nodes.get("notMe"), function() {
            return e.actions.trigger("notMe")
        }), e.helpers.touch(e.nodes.get("me"), function() {
            return e.actions.trigger("me")
        })) : (e.nodes.get("notMe").onclick = function() {
            return e.actions.trigger("notMe")
        }, e.nodes.get("me").onclick = function() {
            return e.actions.trigger("me")
        })
    }), e.initialization.events.add("Prefetch Slides", function() {
        return e.actions.trigger("prefetchSlides")
    }), e.initialization.events.add("Setup Screen", function() {
        var t;
        return e.actions.trigger("setContainerSize"), window.onresize = function() {
            return e.device ? void 0 : e.actions.trigger("setContainerSize")
        }, e.device && e.device ? (t = function() {
            return e.helpers.add("windowOrienter", function() {
                return e.nodes.get("main").style.height = window.innerHeight + "px"
            }), e.helpers.windowOrienter()
        }, e.actions.trigger("onRotate", function(t) {
            return e.helpers.windowOrienter()
        }), e.helpers.onload(function() {
            return t()
        }), t()) : void 0
    }), e.initialization.events.add("initialized", function() {
        return e.states.set("initialized", !0), e.callbacks.trigger("Initialize"), e.data.add("currentSlideTime", (new Date).getTime())
    })
});
Traitify.ui.widget("results", function(e, a) {
    return e.states.add("initialized"), e.callbacks.add("Initialize"), e.dataDependency("PersonalityTypes"), e.styleDependency("all"), e.styleDependency("results/default"), e.initialization.events.add("Setup Data", function() {
        return e.views.render("Results").appendTo("main"), e.callbacks.trigger("Initialize")
    }), e.views.add("Results", function() {
        return this.tags.div("tfResults"), Traitify.oldIE && (this.tags.get("tfResults").className += " ie"), this.render("Personality Blend").appendTo("tfResults"), this.tags.library.get("tfResults")
    }), e.views.add("Personality Blend", function() {
        var a, t, i;
        return e.data.get("PersonalityTypes").personality_blend ? (this.tags.div("personalityBlend"), a = e.data.get("PersonalityTypes").personality_blend, this.render("Personality Blend Badges").appendTo("personalityBlend"), t = a.name ? a.name.replace("/", "/&#8203;") : "", this.tags.div("name", t).appendTo("personalityBlend"), this.tags.div("blendDescription", a.description).appendTo("personalityBlend")) : (this.tags.div("personalityType"), i = e.data.get("PersonalityTypes").personality_types[0].personality_type, this.render("Personality Type Badge").appendTo("personalityType"), this.tags.div("name", i.name).appendTo("personalityType"), this.tags.div("typeDescription", i.description).appendTo("personalityType")), this.tags.library.get("personalityBlend") || this.tags.library.get("personalityType")
    }), e.views.add("Personality Blend Badges", function() {
        var a, t, i, s, n, r, d;
        return s = e.data.get("PersonalityTypes").personality_blend, r = s.personality_type_1, a = e.helpers.hexToRGB(r.badge.color_1), this.tags.div("badgesContainer"), i = Traitify.oldIE ? {} : {
            style: {
                backgroundColor: "rgba(" + a.join(", ") + ", .07)",
                borderColor: "#" + r.badge.color_1
            }
        }, this.tags.div("leftBadge", i).appendTo("badgesContainer"), this.tags.img("leftBadgeImage", r.badge.image_medium).appendTo("leftBadge"), d = s.personality_type_2, t = e.helpers.hexToRGB(d.badge.color_1), n = Traitify.oldIE ? {} : {
            style: {
                backgroundColor: "rgba(" + t.join(", ") + ", .07)",
                borderColor: "#" + d.badge.color_1
            }
        }, this.tags.div("rightBadge", n).appendTo("badgesContainer"), this.tags.img("leftBadgeImage", d.badge.image_medium).appendTo("rightBadge"), this.tags.library.get("badgesContainer")
    }), e.views.add("Personality Type Badge", function() {
        var a, t, i, s, n;
        return n = e.data.get("PersonalityTypes").personality_types[0].personality_type, this.tags.div("badgesContainer"), i = e.helpers.hexToRGB(n.badge.color_1), a = Traitify.oldIE ? "" + n.badge.color_1 : "rgba(" + i.join(", ") + ", .07)", t = this.tags.div("badge", {
            style: {
                backgroundColor: a,
                borderColor: "#" + n.badge.color_1
            }
        }).appendTo("badgesContainer"), s = this.tags.img("badgeImage", n.badge.image_medium).appendTo("badge"), this.tags.library.get("badgesContainer")
    })
});
Traitify.ui.widget("personalityTypes", function(e, t) {
    return e.states.add("initialized"), e.dataDependency("PersonalityTypes"), e.styleDependency("all"), e.styleDependency("results/personality-types"), e.callbacks.add("Initialize"), e.initialization.events.add("Setup Data", function() {
        return e.views.render("Personality Types Container").appendTo("main")
    }), e.views.add("Personality Types Container", function() {
        var t, i;
        return i = this.tags.div("tfPersonalityTypes"), Traitify.oldIE && (i.className += " ie"), this.tags.div("personalityTypesContainerScroller").appendTo("tfPersonalityTypes"), this.tags.div("personalityTypesContainer").appendTo("personalityTypesContainerScroller"), this.render("Personality Types").appendTo("personalityTypesContainer"), t = this.tags.div("description").appendTo("tfPersonalityTypes"), t.innerHTML = e.data.get("PersonalityTypes").personality_types[0].personality_type.description, e.callbacks.trigger("Initialize"), i
    }), e.views.add("Personality Types", function() {
        var t, i, a, n, s, r;
        for (a = this.tags.div("personalityTypes", Object()), s = Array(), this.tags.div("arrow").appendTo("personalityTypes"), this.tags.div("icon").appendTo("arrow"), s = e.data.get("PersonalityTypes").personality_types, t = 0; t < s.length;) n = s[t], this.tags.div("personalityType", {
            "data-index": t
        }).appendTo("personalityTypes"), i = this.tags.div("name", Object(), n.personality_type.name).appendTo("personalityType"), i.style.color = "#" + n.personality_type.badge.color_1, this.tags.img("badge", n.personality_type.badge.image_medium).appendTo("personalityType"), r = this.tags.div("score", Object(), "" + Math.round(n.score) + " / 100").appendTo("personalityType"), t++;
        return a
    }), e.initialization.events.add("personalityTypes", function() {
        var t, i, a, n, s;
        for (i = document.querySelectorAll(".tf-personality-types .personality-type"), s = [], a = 0, n = i.length; n > a; a++) t = i[a], s.push(t.onclick = function() {
            var t, i, a, n;
            return i = document.querySelector(".tf-personality-types .description"), n = this.getAttribute("data-index"), t = document.querySelector(".tf-personality-types .arrow"), t.style.left = 130 * n + "px", a = e.data.get("PersonalityTypes").personality_types[n].personality_type.description, i.innerHTML = a
        });
        return s
    })
});
Traitify.ui.widget("personalityTraits", function(t, i) {
    return t.states.add("initialized"), t.callbacks.add("Initialize"), t.dataDependency("PersonalityTraits"), t.styleDependency("all"), t.styleDependency("results/personality-traits"), t.initialization.events.add("Setup Data", function() {
        return t.views.render("Personality Traits Container").appendTo("main"), t.callbacks.trigger("Initialize")
    }), t.views.add("Personality Traits Container", function() {
        var t, i, a, e, r;
        for (i = this.tags.div("tfPersonalityTraits"), Traitify.oldIE && (i.className += " ie"), this.tags.div("personalityTraits").appendTo("tfPersonalityTraits"), r = this.data.get("PersonalityTraits").slice(0, 8), t = 0; t < r.length;) e = r[t].personality_trait, a = e.personality_type, this.tags.div(["personalityTraits.trait"], {
            style: {
                borderColor: "#" + a.badge.color_1
            }
        }).appendTo("personalityTraits"), this.tags.div(["personalityTraits.trait.name"], e.name).appendTo(["personalityTraits.trait", t]), Traitify.oldIE ? this.tags.img(["personalityTraits.trait.background"], a.badge.image_medium).appendTo(["personalityTraits.trait", t]) : this.tags.div(["personalityTraits.trait.background"], {
            style: {
                backgroundImage: "url('" + a.badge.image_medium + "')"
            }
        }).appendTo(["personalityTraits.trait", t]), this.tags.div(["personalityTraits.trait.definition"], e.definition).appendTo(["personalityTraits.trait", t]), t++;
        return i
    })
});
Traitify.ui.styles['all'] = '@font-face{font-family:"Source Sans Pro";font-style:normal;font-weight:400;src:local("Source Sans Pro"),local("Source Sans Pro"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/source-sans-pro.woff) format("woff")}@font-face{font-family:"Adelle Sans Bold";font-style:bold;font-weight:800;src:local("Adelle Sans Bold"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/adelle-sans-bold.woff) format("woff")}@font-face{font-family:"Adelle Sans";font-style:normal;font-weight:400;src:local("Adelle Sans"),url(https://s3.amazonaws.com/traitify-cdn/assets/fonts/adelle-sans.woff) format("woff")}';
Traitify.ui.styles['slide-deck'] = '.tf-slide-deck-container{margin:0 auto;max-width:1200px;font-family:"Adelle Sans","Helvetica Neue",Helvetica,Arial,sans-serif;overflow:hidden;color:#fff;width:100%;position:relative;font-size:22px;-webkit-font-smoothing:antialised;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-box-sizing:initial;-moz-box-sizing:initial;box-sizing:initial}.tf-slide-deck-container .cover{display:none;background-color:#35aaf1}.tf-slide-deck-container .slides{position:relative}.tf-slide-deck-container .internet-failure{position:absolute;top:45%;width:100%;text-align:center;text-shadow:0 0 3px #000}.tf-slide-deck-container .slide .image{height:400px;background-size:cover}.tf-slide-deck-container .slides .loading{color:#000;text-align:center;position:absolute;width:100%;top:40%}.tf-slide-deck-container .slides .loading .left-dot{background-color:#058fc4;width:20px;height:20px}.tf-slide-deck-container .slides .loading .right-dot{background-color:#cb4e4e;width:20px;height:20px}.tf-slide-deck-container .slides .slide{padding:0;margin:0;box-sizing:initial;-webkit-transition:left .5s ease-in-out;-moz-transition:left .5s ease-in-out;-o-transition:left .5s ease-in-out;transition:left .5s ease-in-out;position:absolute;left:100%;top:0;width:100%}.tf-slide-deck-container .slides .slide.active{left:0}.tf-slide-deck-container .slides .slide.played{left:-100%}.tf-slide-deck-container .slides .slide img{width:100%}.tf-slide-deck-container .slides .slide.active.not-ready-animation{-webkit-animation:not-ready-animation 1s}@-webkit-keyframes not-ready-animation{0%,100%{left:0}50%{left:-10%}}.tf-slide-deck-container .slides .slide.placeholder{position:relative}.tf-slide-deck-container .me-not-me-container.hide{margin-left:100%;opacity:0;visibility:hidden}.tf-slide-deck-container .me-not-me-container-attachment{position:absolute;z-index:1;bottom:0;width:100%;line-height:1em;text-align:center;padding-bottom:15px}.tf-slide-deck-container .me-not-me-container{position:relative;border-radius:30px;overflow:hidden;font-size:16px;display:inline-block;margin:0 auto;height:50px;width:370px;line-height:53px}.tf-slide-deck-container .wifi-loading{position:absolute;z-index:2;width:100%;height:100%;top:0;font-size:16px;vertical-align:middle;text-align:center}.tf-slide-deck-container .wifi-loading .loading .loading-text{-webkit-animation:pulse-animation 2s ease-in-out infinite;-moz-animation:pulse-animation .3s ease-in-out infinite;-o-animation:pulse-animation .3s ease-in-out infinite;animation:pulse-animation .3s ease-in-out infinite}.tf-slide-deck-container .wifi-loading .loading .refresh-button{cursor:pointer}@-webkit-keyframes pulse-animation{0%,100%{opacity:.3}10%{opacity:.2}50%{opacity:.9}60%{opacity:1}}.tf-slide-deck-container .wifi-loading .loading{font-size:18px;background-color:#058fc4;position:relative;width:100%;display:inline-block;color:#fff}.tf-slide-deck-container.medium .wifi-loading .loading{width:100%;font-size:14px}.tf-slide-deck-container .me,.tf-slide-deck-container .not-me{height:100%;text-align:center;cursor:pointer}.tf-slide-deck-container .me{background-color:#058fc4;position:relative;width:50%;display:inline-block}.tf-slide-deck-container .not-me{position:relative;width:50%;display:inline-block;background-color:#cb4e4e}.tf-slide-deck-container .me-not-me-container .not-me:active{background-color:#b44646}.tf-slide-deck-container .me-not-me-container .me:active{background-color:#007a9c}.tf-slide-deck-container .caption{background-color:rgba(0,0,0,.5);background-image:url(https://s3.amazonaws.com/traitify-cdn/images/black_transparent/50.png);padding:15px 0 10px;text-align:center;font-size:28px;position:absolute;width:100%}.tf-slide-deck-container .progress-bar{height:10px;display:block;background-color:rgba(255,255,255,.5);background-image:url(https://s3.amazonaws.com/traitify-cdn/images/white_transparent/50.png);position:absolute;z-index:1;width:100%;-webkit-box-shadow:none;box-shadow:none;-webkit-transition:none;transition:none}.tf-slide-deck-container .progress-bar .progress-bar-inner{width:0;height:10px;background-color:#fff;position:absolute;-webkit-animation-delay:2s;animation-delay:2s;-webkit-transition:width .3s linear;-moz-transition:width .3s linear;-o-transition:width .3s linear;transition:width .3s linear;border-radius:0 5px 5px 0}@media only screen and (min-width:760px){.tf-slide-deck-container .slide .image{height:570px}.tf-slide-deck-container .me-not-me-container{font-size:24px}.tf-slide-deck-container .slide .caption{font-size:32px}}.loading .symbol{width:30px;height:30px;margin:0 auto}.loading .symbol i{margin-left:-15px;width:30px;height:30px;display:inline-block;background:#cb4e4e;border-radius:50%;position:absolute}.loading .symbol i:nth-child(1){-webkit-transform:translate(-50px,0);-webkit-animation:loading-ani1 1s linear infinite}.loading .symbol i:nth-child(2){background:#058fc4;-webkit-transform:translate(50px,0);-webkit-animation:loading-ani2 1s linear infinite}@-webkit-keyframes loading-ani1{25%{z-index:2}50%{-webkit-transform:translate(50px,0) scale(1)}75%{-webkit-transform:translate(0,0) scale(.75)}100%{-webkit-transform:translate(-50px,0) scale(1)}}@-webkit-keyframes loading-ani2{25%{-webkit-transform:translate(0,0) scale(.75)}50%{-webkit-transform:translate(-50px,0) scale(1)}75%{z-index:2}100%{-webkit-transform:translate(50px,0) scale(1)}}.small.tf-slide-deck-container .me-not-me-container{width:250px;height:41px;line-height:47px;font-size:15px}.small.tf-slide-deck-container .slide .caption{font-size:18px}.medium.tf-slide-deck-container .slide .caption{font-size:24px}.medium.tf-slide-deck-container .me-not-me-container{width:290px;height:48px;line-height:50px;font-size:17px}.phone.tf-slide-deck-container .slide,.phone.tf-slide-deck-container .slide .image{height:100%}.phone.tf-slide-deck-container .progress-bar{background-color:rgba(255,255,255,.5);position:absolute;z-index:2;border:0;height:10px}.phone.tf-slide-deck-container .progress-bar-inner{border-radius:0 5px 5px 0;height:10px}.phone.tf-slide-deck-container .slide.placeholder .caption{z-index:-1}.phone:not(.non-touch).tf-slide-deck-container .caption{font-size:20px;background-color:transparent;position:relative;width:100%;padding-top:20px}.phone.tf-slide-deck-container .slide{padding:0;margin:0;-webkit-transition:width .4s linear;-moz-transition:width .4s linear;-o-transition:width .4s linear;transition:width .4s linear;position:absolute;right:0;top:0;width:0;left:auto}.phone.tf-slide-deck-container .slides .slide.played{right:auto;width:0;left:auto}.phone.tf-slide-deck-container .slides .slide.active{right:0;width:100%;left:auto}.phone.tf-slide-deck-container .slides .slide.active .caption{z-index:2}.phone.tf-slide-deck-container .slides .slide.played .caption{z-index:auto}.phone.tf-slide-deck-container,.phone.tf-slide-deck-container .slide .image,.phone.tf-slide-deck-container .slides{height:100%}.phone.tf-slide-deck-container .me-not-me-container{height:38px;line-height:42px;width:250px;font-size:20px}@media screen and (device-width:320px) and (orientation:landscape){.phone.tf-slide-deck-container .caption{font-size:16px}.phone.tf-slide-deck-container .progress-bar-inner{border-radius:0 4px 4px 0;height:8px}.phone.tf-slide-deck-container .me-not-me-container{font-size:40px}.phone.tf-slide-deck-container .cover{width:100%;height:100%;position:absolute;z-index:10;display:block}.phone.tf-slide-deck-container .cover .rotate-back{width:70%;margin-left:15%;margin-right:15%;height:70%;bottom:0;position:absolute;background-size:cover}}.phone.tf-slide-deck-container .caption{margin-top:10px;padding:10px 0}@media screen and (orientation:landscape){.iphone.tf-slide-deck-container .cover{width:100%;height:100%;position:absolute;z-index:10;display:block}.iphone.tf-slide-deck-container .cover .rotate-back{width:70%;margin-left:15%;margin-right:15%;height:70%;bottom:0;position:absolute;background-size:cover}.phone.tf-slide-deck-container .me-not-me-container{height:30px}.phone.tf-slide-deck-container .progress-bar,.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:5px}.phone.tf-slide-deck-container .slide .caption{font-size:12px;padding:3px;margin-top:5px}}.ipad.phone.tf-slide-deck-container .progress-bar{height:15px}.ipad.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:15px;border-radius:0 8px 8px 0}.ipad.phone.tf-slide-deck-container .slide .caption{margin-top:15px;font-size:28px}.ipad.phone.tf-slide-deck-container .me-not-me-container{width:400px;height:60px;font-size:28px;line-height:63px}@media screen and (orientation:landscape){.ipad.phone.tf-slide-deck-container .progress-bar,.ipad.phone.tf-slide-deck-container .progress-bar .progress-bar-inner{height:10px}.ipad.phone.tf-slide-deck-container .slide .caption{margin-top:10px}.phone.android.tf-slide-deck-container .me-not-me-container{height:auto}.phone.android.tf-slide-deck-container .caption{font-size:20px;padding:5px 0}.non-touch.phone.android.tf-slide-deck-container .me-not-me-container .not-me,.phone.android.tf-slide-deck-container .me-not-me-container .me{font-size:18px;padding:5px 0}.phone.android.tf-slide-deck-container .me-not-me-container .me{width:30%;margin-left:20%;height:auto}.phone.android.tf-slide-deck-container .me-not-me-container .not-me{width:30%;margin-right:20%;height:auto}}';
Traitify.ui.styles['results/default'] = '.tf-results{font-family:"Source Sans Pro";padding:10px}.tf-results.ie{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.tf-results div,.tf-results img{box-sizing:content-box}.tf-results .personality-blend,.tf-results .personality-type{text-align:center}.tf-results .personality-blend .badges-container,.tf-results .personality-type .badges-container{max-width:264px;width:100%;margin:0 auto}.tf-results .personality-type .badges-container .badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;display:inline-block;background-color:rgba(255,255,255,.5);margin:0 auto}.tf-results.ie .personality-type .badge{border:0 solid}.tf-results .personality-type .badges-container .badge img{width:100%}.tf-results .personality-type .name{font-size:24px;margin:12px 0}.tf-results .personality-type .type-description{width:100%;position:relative;text-align:justify;max-width:860px;margin:0 auto}.tf-results .personality-blend .badges-container .left-badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;display:inline-block;background-color:rgba(255,255,255,.5)}.tf-results .personality-blend .badges-container .left-badge img{width:100%}.tf-results .personality-blend .badges-container .right-badge{width:29%;padding:12%;position:relative;border-radius:50%;border:2px solid;margin-left:-10%;display:inline-block}.tf-results.ie .personality-blend .badges-container .left-badge,.tf-results.ie .personality-blend .badges-container .right-badge{border:0 solid}.tf-results.ie .personality-blend .badges-container .left-badge img,.tf-results.ie .personality-blend .badges-container .right-badge img{width:100px;height:100px}.tf-results .personality-blend .badges-container .right-badge img{width:100%}.tf-results .personality-blend .name{font-size:24px;margin:12px 0}.tf-results .personality-blend .blend-description{width:100%;position:relative;text-align:justify;max-width:860px;margin:0 auto}';
Traitify.ui.styles['results/personality-types'] = '.tf-personality-types{font-family:"Source Sans Pro"}.tf-personality-types.ie{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}.tf-personality-types .description{max-width:860px;margin:-25px auto 0;padding:24px;text-align:justify}.tf-personality-types .personality-types-container{background-color:#022946;width:100%}.tf-personality-types .personality-types-container-scroller{height:220px;overflow-y:hidden;overflow-x:auto}.tf-personality-types .personality-types-container .personality-types{background-color:#022946;position:relative}.tf-personality-types .personality-types-container .personality-types .arrow{text-align:center;width:130px;bottom:-20px;position:absolute;left:0;-webkit-transition:left .2s linear;-moz-transition:left .2s linear;-o-transition:left .2s linear;transition:left .2s linear}.tf-personality-types .personality-types-container .personality-types .arrow .icon{width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-top:20px solid #022946;margin:0 auto}.tf-personality-types .personality-types-container .personality-types{width:910px;margin:0 auto}.tf-personality-types .personality-types-container .personality-types .personality-type{display:inline-block;width:130px;text-align:center;padding:20px 0;cursor:pointer}.tf-personality-types .personality-types-container .personality-types .personality-type .badge{width:60px;height:60px;margin:18px auto}.tf-personality-types .personality-types-container .personality-types .personality-type .name{font-family:"Adelle Sans Bold";text-align:center;margin:0 auto}.tf-personality-types .personality-types-container .personality-types .personality-type .score{color:#fff}';
Traitify.ui.styles['results/personality-traits'] = '.tf-personality-traits{font-family:"Source Sans Pro"}.tf-personality-traits.ie{font-family:arial}.tf-personality-traits div,.tf-personality-traits img{box-sizing:content-box}.tf-personality-traits .your-top-traits{font-size:24px;margin:20px;text-align:center}.tf-personality-traits .personality-traits{max-width:800px;margin:0 auto;text-align:center}.tf-personality-traits .personality-traits .trait{border-top:6px solid;border-color:#9af;display:inline-block;width:180px;margin:5px;vertical-align:top;background-color:#fff;height:180px;position:relative;line-height:1.2em;text-align:center}.tf-personality-traits.ie .personality-traits .trait{height:280px}@media (max-width:768px){.tf-personality-traits .personality-traits .trait{width:45%}}.tf-personality-traits .personality-traits .trait .name{font-family:"Adelle Sans Bold";margin:20px 20px 0;display:inline-block;font-weight:600;text-align:left}.tf-personality-traits.ie .personality-traits .trait .name{display:block;text-align:center}.tf-personality-traits .personality-traits .trait .definition{padding:0 20px;margin-top:10px;font-size:14px;font-weight:400;text-align:left}.tf-personality-traits .personality-traits .trait .background{width:80%;height:80%;margin:10%;top:10px;position:absolute;background-size:contain;background-repeat:no-repeat;background-position:center center;opacity:.15}.tf-personality-traits.ie .personality-traits .trait .background{margin:0 auto;width:50px;height:50px;position:relative}';