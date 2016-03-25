function SSOController() {
    var k;
    var l = this;
    var m = null;
    var n = 1800;
    var o = 3600 * 24;
    var p = null;
    var q = null;
    var r = 3;
    var s = null;
    var t = "http://login.sina.com.cn/sso/crossdomain.php";
    var u = "http://login.sina.com.cn/sso/login.php";
    var v = "http://login.sina.com.cn/sso/logout.php";
    var w = "http://login.sina.com.cn/sso/updatetgt.php";
    var y = "http://login.sina.com.cn/sso/prelogin.php";
    var z = "http://login.sina.com.cn/cgi/pin.php";
    var A = "http://weibo.com/sguide/vdun.php";
    var B = "http://passport.weibo.com/visitor/visitor";
    var C = null;
    var D = "";
    var E = null;
    var F = null;
    var G = null;
    var H = null;
    var I = 1;
    var J = 2;
    var K = 4;
    var L = "";
    var M = {};
    var N = 0;
    var O = 0;
    var P;
    this.https = 1;
    this.rsa = 2;
    this.wsse = 4;
    this.name = "sinaSSOController";
    this.loginFormId = "ssoLoginForm";
    this.scriptId = "ssoLoginScript";
    this.ssoCrossDomainScriptId = "ssoCrossDomainScriptId";
    this.loginFrameName = "ssoLoginFrame";
    this.appLoginURL = {
        "weibo.com": "https://passport.weibo.com/sso/wblogin"
    };
    this.appDomainService = {
        "weibo.com": "miniblog"
    };
    this.loginExtraQuery = {};
    this.setDomain = false;
    this.feedBackUrl = "";
    this.service = "sso";
    this.domain = "sina.com.cn";
    this.from = "";
    this.pageCharset = "GB2312";
    this.useTicket = false;
    this.isCheckLoginState = false;
    this.isUpdateCookieOnLoad = true;
    this.useIframe = true;
    this.noActiveTime = 7200;
    this.autoUpdateCookieTime = 1800;
    this.loginType = J;
    this.timeoutEnable = false;
    this.loginTimeout = 5000;
    this.crossDomain = true;
    this.scriptLoginHttps = false;
    this.allowAutoFoundServerTime = false;
    this.allowAutoFoundServerTimeError = true;
    this.calcServerTimeInterval = 2000;
    this.servertime = null;
    this.nonce = null;
    this.rsaPubkey = null;
    this.rsakv = null;
    this.loginExtraFlag = {};
    this.cdult = false;
    this.crossDomainTime = 5;
    this.failRedirect = false;
    this.isGenerateVisitor = true;
    this.generateVisitorProbability = 1;
    this.generateVisitorDelay = 6;
    this.generateVisitorDomain = ["^.*sina.com.cn$"];
    this.getVersion = function () {
        return "ssologin.js(v1.4.15) 2014-05-04"
    };
    this.getEntry = function () {
        return l.entry
    };
    this.getClientType = function () {
        return l.getVersion().split(" ")[0]
    };
    this.init = function () {
        if (bg(arguments[0]) === "object") {
            return customPrepare(arguments[0])
        }
        l.setLoginType(l.loginType);
        var a = window.sinaSSOConfig;
        if (typeof a != "object") {
            a = {}
        }
        var b;
        for (b in a) {
            l[b] = a[b]
        }
        if (!l.entry) {
            l.entry = l.service
        }
        if (l.isUpdateCookieOnLoad) {
            setTimeout(l.name + ".updateCookie()", 10000)
        }
        if (l.isGenerateVisitor) {
            if (self === top && Math.random() < l.generateVisitorProbability && location.protocol !== "https:") {
                setTimeout(l.name + ".generateVisitor()", l.generateVisitorDelay * 1000)
            }
        }
        if (l.isCheckLoginState) {
            U(window, "load", function () {
                l.checkLoginState()
            })
        }
        if (l.allowAutoFoundServerTime && ssoLoginServerTime) {
            l.setServerTime(ssoLoginServerTime)
        }
        l.customInit()
    };
    this.getLoginInfo = function () {
        var a = bj("sso_info");
        if (!a) {
            return {}
        }
        return bp(sinaSSOEncoder.Cookie.decode(a))
    };
    this.customInit = function () {};
    this.customUpdateCookieCallBack = function (a) {};
    this.customLoginCallBack = function (a) {};
    this.customLogoutCallBack = function (a) {
        l.customLoginCallBack({
            result: false
        })
    };
    var Q, customPrepare, customLogout;
    (function () {
        var d = function () {},
            loginParam = {
                username: "",
                password: "",
                savestate: 0,
                vsnf: 0,
                vsnval: "",
                door: "",
                setCookie: 1,
                ssoSimpleLogin: 0,
                onComplete: d,
                onSuccess: d,
                onFailure: d
            },
            logoutParam = {
                onComplete: d,
                onSuccess: d,
                onFailure: d
            },
            hashExtra = {
                vsnf: "vsnf",
                vsnval: "vsnval",
                door: "door",
                setCookie: "s",
                ssoSimpleLogin: "ssosimplelogin"
            },
            loginOptions = {},
            logoutOptions = {};
        var e = function (a, b) {
            var c, param = {};
            a = a || {};
            b = b || {};
            br(param, a);
            for (c in b) {
                if (a.hasOwnProperty(c)) {
                    param[c] = b[c]
                }
            }
            return param
        };
        var f = function (a, b, c) {
            if (typeof (a[b]) === "function") {
                a[b](c)
            }
        };
        this.callbackLoginStatus = function (a) {
            l.customLoginCallBack(a);
            f(loginOptions, "onComplete", a);
            if (a && a.result === true) {
                f(loginOptions, "onSuccess", a)
            } else {
                f(loginOptions, "onFailure", a)
            }
        };
        P = function (a) {
            l.customLogoutCallBack(a);
            f(logoutOptions, "onComplete", a);
            if (a && a.result === true) {
                f(logoutOptions, "onSuccess", a)
            } else {
                f(logoutOptions, "onFailure", a)
            }
        };
        customPrepare = function (a) {
            var b;
            a = a || {};
            loginOptions = br({
                entry: "sso",
                useTicket: false,
                service: "sso",
                domain: "sina.com.cn",
                feedBackUrl: "",
                setDomain: false,
                crossDomain: true,
                name: "sinaSSOController"
            }, loginParam);
            loginOptions = e(loginOptions, a);
            window[loginOptions.name] = window[loginOptions.name] || l;
            for (b in loginOptions) {
                if (!loginParam.hasOwnProperty(b)) {
                    l[b] = loginOptions[b]
                }
            }
            l.loginExtraQuery = {};
            br(l.loginExtraQuery, loginOptions.loginExtraQuery);
            for (b in hashExtra) {
                if (loginOptions.hasOwnProperty(b)) {
                    l.loginExtraQuery[hashExtra[b]] = loginOptions[b]
                }
            }
        };
        Q = function (a) {
            a = a || {};
            customPrepare(a);
            l.login(loginOptions.username, loginOptions.password, loginOptions.savestate)
        };
        customLogout = function (a) {
            a = a || {};
            logoutOptions = br({}, logoutParam);
            logoutOptions = e(logoutOptions, a);
            l.logout()
        }
    }).apply(this);
    this.login = function (b, c, d) {
        if (bg(arguments[0]) === "object") {
            return Q(arguments[0])
        }
        if (!F) {
            F = new V(l.timeoutEnable)
        } else {
            F.clear()
        }
        F.start(l.loginTimeout, function () {
            F.clear();
            l.callbackLoginStatus({
                result: false,
                errno: -1,
                reason: unescape("%u767B%u5F55%u8D85%u65F6%uFF0C%u8BF7%u91CD%u8BD5")
            })
        });
        d = d == k ? 0 : d;
        M.savestate = d;
        G = function () {
            if (!l.feedBackUrl && Z(b, c, d)) {
                return true
            }
            if (l.useIframe && (l.setDomain || l.feedBackUrl)) {
                if (l.setDomain) {
                    document.domain = l.domain;
                    if (!l.feedBackUrl && l.domain != "sina.com.cn") {
                        l.feedBackUrl = bk(l.appLoginURL[l.domain], {
                            domain: 1
                        })
                    }
                }
                D = "post";
                var a = bc(b, c, d);
                if (!a) {
                    D = "get";
                    if (l.scriptLoginHttps) {
                        l.setLoginType(l.loginType | I)
                    } else {
                        l.setLoginType(l.loginType | J)
                    }
                    bb(b, c, d)
                }
            } else {
                D = "get";
                bb(b, c, d)
            }
            l.nonce = null
        };
        H = function () {
            if ((l.loginType & K) || (l.loginType & J)) {
                if (l.servertime) {
                    if (!l.nonce) {
                        l.nonce = R(6)
                    }
                    G();
                    return true
                }
                l.getServerTime(b, G)
            } else {
                G()
            }
        };
        H();
        return true
    };
    this.prelogin = function (b, c) {
        var d = location.protocol == "https:" ? y.replace(/^http:/, "https:") : y;
        var e = b.username || "";
        e = sinaSSOEncoder.base64.encode(bm(e));
        delete b.username;
        var f = {
            entry: l.entry,
            callback: l.name + ".preloginCallBack",
            su: e,
            rsakt: "mod"
        };
        d = bk(d, br(f, b));
        l.preloginCallBack = function (a) {
            if (a && a.retcode == 0) {
                l.setServerTime(a.servertime);
                l.nonce = a.nonce;
                l.rsaPubkey = a.pubkey;
                l.rsakv = a.rsakv;
                L = a.pcid;
                O = (new Date()).getTime() - N - (parseInt(a.exectime, 10) || 0)
            }
            if (typeof c == "function") {
                c(a)
            }
        };
        N = (new Date()).getTime();
        W(l.scriptId, d)
    };
    this.getServerTime = function (a, b) {
        if (l.servertime) {
            if (typeof b == "function") {
                b({
                    retcode: 0,
                    servertime: l.servertime
                })
            }
            return true
        }
        l.prelogin({
            username: a
        }, b)
    };
    this.logout = function () {
        try {
            if (bg(arguments[0]) === "object") {
                return customLogout(arguments[0])
            }
            var a = {
                entry: l.getEntry(),
                callback: l.name + ".ssoLogoutCallBack"
            };
            try {
                a.sr = window.screen.width + "*" + window.screen.height
            } catch (e) {}
            var b = location.protocol == "https:" ? v.replace(/^http:/, "https:") : v;
            b = bk(b, a);
            W(l.scriptId, b)
        } catch (e) {}
        return true
    };
    this.ssoLogoutCallBack = function (a) {
        if (a.arrURL) {
            l.setCrossDomainUrlList(a)
        }
        l.crossDomainAction("logout", function () {
            P({
                result: true
            })
        })
    };
    this.updateCookie = function () {
        try {
            if (l.autoUpdateCookieTime > 5) {
                if (m != null) {
                    clearTimeout(m)
                }
                m = setTimeout(l.name + ".updateCookie()", l.autoUpdateCookieTime * 1000)
            }
            var a = l.getCookieExpireTime();
            var b = (new Date()).getTime() / 1000;
            var c = {};
            if (a == null) {
                c = {
                    retcode: 6102
                }
            } else {
                if (a < b) {
                    c = {
                        retcode: 6203
                    }
                } else {
                    if (a - o + n > b) {
                        c = {
                            retcode: 6110
                        }
                    } else {
                        if (a - b > l.noActiveTime) {
                            c = {
                                retcode: 6111
                            }
                        }
                    }
                }
            } if (c.retcode !== k) {
                l.customUpdateCookieCallBack(c);
                return false
            }
            var d = location.protocol == "https:" ? w.replace(/^http:/, "https:") : w;
            d = bk(d, {
                entry: l.getEntry(),
                callback: l.name + ".updateCookieCallBack"
            });
            W(l.scriptId, d)
        } catch (e) {}
        return true
    };
    this.setCrossDomainUrlList = function (a) {
        C = a
    };
    this.checkAltLoginName = function () {
        return true
    };
    this.callFeedBackUrl = function (a) {
        try {
            var b = {
                callback: l.name + ".feedBackUrlCallBack"
            };
            if (a.ticket) {
                b.ticket = a.ticket
            }
            if (a.retcode !== k) {
                b.retcode = a.retcode
            }
            var c = bk(l.feedBackUrl, b);
            W(l.scriptId, c)
        } catch (e) {}
        return true
    };
    this.loginCallBack = function (a) {
        try {
            if (l.timeoutEnable && !F.isset()) {
                return
            }
            F.clear();
            l.loginExtraFlag = {};
            var b = {};
            var c = a.ticket;
            var d = a.uid;
            if (d) {
                b.result = true;
                b.retcode = 0;
                b.userinfo = {
                    uniqueid: a.uid
                };
                if (c) {
                    b.ticket = c
                }
                if (a.cookie) {
                    b.cookie = a.cookie
                }
                if (l.feedBackUrl) {
                    if (l.crossDomain) {
                        l.crossDomainAction("login", function () {
                            l.callFeedBackUrl(b)
                        })
                    } else {
                        l.callFeedBackUrl(b)
                    }
                } else {
                    if (l.crossDomain) {
                        if (a.crossDomainUrlList) {
                            l.setCrossDomainUrlList({
                                retcode: 0,
                                arrURL: a.crossDomainUrlList
                            })
                        }
                        l.crossDomainAction("login", function () {
                            if (c && l.appLoginURL[l.domain]) {
                                l.appLogin(c, l.domain, l.name + ".callbackLoginStatus")
                            } else {
                                b.userinfo = br(b.userinfo, l.getSinaCookie());
                                l.callbackLoginStatus(b)
                            }
                        })
                    } else {
                        l.callbackLoginStatus(b)
                    }
                }
            } else {
                if (H && a.retcode == "2092" && l.allowAutoFoundServerTimeError) {
                    l.setServerTime(0);
                    l.loginExtraFlag = br(l.loginExtraFlag, {
                        wsseretry: "servertime_error"
                    });
                    H();
                    H = null;
                    return false
                }
                b.result = false;
                b.errno = a.retcode;
                if (b.errno == "4069") {
                    var f = a.reason.split("|");
                    b.reason = f[0];
                    if (f.length == 2) {
                        b.rurl = f[1]
                    }
                    if (b.rurl) {
                        try {
                            top.location.href = b.rurl;
                            return
                        } catch (e) {}
                    }
                } else {
                    b.reason = a.reason
                }
                l.callbackLoginStatus(b)
            }
        } catch (e) {}
        return true
    };
    this.updateCookieCallBack = function (a) {
        if (a.retcode == 0) {
            l.crossDomainAction("update", function () {
                l.customUpdateCookieCallBack(a)
            })
        } else {
            l.customUpdateCookieCallBack(a)
        }
    };
    this.feedBackUrlCallBack = function (a) {
        if (D == "post" && l.timeoutEnable && !F.isset()) {
            return
        }
        if (a.errno == "2092") {
            l.setServerTime(0)
        }
        if (H && (a.errno == "2092") && l.allowAutoFoundServerTimeError) {
            l.loginExtraFlag = br(l.loginExtraFlag, {
                wsseretry: "servertime_error"
            });
            H();
            H = null;
            return false
        } else {
            F && F.clear()
        } if (a.errno == "4069") {
            var b = a.reason.split("|");
            a.reason = b[0];
            if (b.length == 2) {
                a.rurl = b[1];
                try {
                    top.location.href = a.rurl;
                    return
                } catch (e) {}
            }
        }
        l.callbackLoginStatus(a);
        bf(l.loginFrameName)
    };
    this.doCrossDomainCallBack = function (a) {
        l.crossDomainCounter++;
        if (a) {
            bf(a.scriptId)
        }
        if (l.crossDomainCounter == l.crossDomainCount) {
            clearTimeout(q);
            l.crossDomainResult()
        }
    };
    this.crossDomainCallBack = function (a) {
        bf(l.ssoCrossDomainScriptId);
        if (!a || a.retcode != 0) {
            return false
        }
        var b = a.arrURL;
        var c, scriptId;
        var d = {
            callback: l.name + ".doCrossDomainCallBack"
        };
        l.crossDomainCount = b.length;
        l.crossDomainCounter = 0;
        if (b.length == 0) {
            clearTimeout(q);
            l.crossDomainResult();
            return true
        }
        for (var i = 0; i < b.length; i++) {
            c = b[i];
            scriptId = "ssoscript" + i;
            d.scriptId = scriptId;
            c = bk(c, d);
            if (bh()) {
                X(scriptId, c)
            } else {
                W(scriptId, c)
            }
        }
    };
    this.crossDomainResult = function () {
        C = null;
        if (typeof p == "function") {
            p()
        }
    };
    this.crossDomainAction = function (a, b) {
        q = setTimeout(l.name + ".crossDomainResult()", r * 1000);
        if (typeof b == "function") {
            p = b
        } else {
            p = null
        } if (C) {
            l.crossDomainCallBack(C);
            return false
        }
        var c = l.domain;
        if (a == "update") {
            a = "login";
            c = "sina.com.cn"
        }
        var d = {
            scriptId: l.ssoCrossDomainScriptId,
            callback: l.name + ".crossDomainCallBack",
            action: a,
            domain: c,
            sr: window.screen.width + "*" + window.screen.height
        };
        var e = bk(t, d);
        W(l.ssoCrossDomainScriptId, e)
    };
    this.checkLoginState = function (d) {
        if (d) {
            l.autoLogin(d)
        } else {
            l.autoLogin(function (a) {
                var b = {};
                if (a !== null) {
                    var c = {
                        displayname: a.nick,
                        uniqueid: a.uid,
                        userid: a.user
                    };
                    b.result = true;
                    b.userinfo = c
                } else {
                    b.result = false;
                    b.reason = ""
                }
                l.callbackLoginStatus(b)
            })
        }
    };
    this.getCookieExpireTime = function () {
        return T(l.domain)
    };
    this.getSinaCookie = function (a) {
        var b = bn(bj("SUP"));
        if (!b && !bn(bj("ALF"))) {
            return null
        }
        if (!b) {
            b = bn(bj("SUR"))
        }
        if (!b) {
            return null
        }
        var c = bp(b);
        if (a && c.et && (c.et * 1000 < (new Date()).getTime())) {
            return null
        }
        return c
    };
    this.get51UCCookie = function () {
        return l.getSinaCookie()
    };
    this.autoLogin = function (a, b) {
        if (l.domain == "sina.com.cn") {
            if (bj("SUP") === null && bj("ALF") !== null) {
                S(a);
                return true
            }
        } else {
            if (bj("SUP") === null && (b || bj("SSOLoginState") !== null || bj("ALF") !== null)) {
                S(a);
                return true
            }
        }
        a(l.getSinaCookie());
        return true
    };
    this.autoLoginCallBack2 = function (a) {
        try {
            s(l.getSinaCookie())
        } catch (e) {}
        return true
    };
    this.appLogin = function (a, b, c) {
        var d = M.savestate ? parseInt((new Date()).getTime() / 1000 + M.savestate * 86400) : 0;
        var e = bj("ALF") ? bj("ALF") : 0;
        var f = {
            callback: c,
            ticket: a,
            ssosavestate: d || e
        };
        var g = l.appLoginURL[b];
        var h = bk(g, f);
        W(l.scriptId, h, "gb2312");
        return true
    };
    this.autoLoginCallBack3 = function (a) {
        if (a.retcode != 0) {
            l.autoLoginCallBack2(a);
            return false
        }
        var b = l.domain == "sina.com.cn" ? "weibo.com" : l.domain;
        l.appLogin(a.ticket, b, l.name + ".autoLoginCallBack2");
        return true
    };
    this.setLoginType = function (a) {
        var b = location.protocol == "https:" ? l.https : 0;
        if (b) {
            l.crossDomain = false
        }
        l.loginType = a | b;
        return true
    };
    this.setServerTime = function (a) {
        if (!E) {
            E = new V(true)
        }
        if (a == 0) {
            E.clear();
            l.servertime = a;
            return true
        }
        if (a < 1294935546) {
            return false
        }
        var b = function () {
            if (l.servertime) {
                l.servertime += l.calcServerTimeInterval / 1000;
                E.start(l.calcServerTimeInterval, b)
            }
        };
        l.servertime = a;
        E.start(l.calcServerTimeInterval, b)
    };
    this.getPinCodeUrl = function (a) {
        if (a == k) {
            a = 0
        }
        if (L) {
            l.loginExtraQuery.pcid = L
        }
        var b = location.protocol == "https:" ? z.replace(/^http:/, "https:") : z;
        return b + "?r=" + Math.floor(Math.random() * 100000000) + "&s=" + a + (L.length > 0 ? "&p=" + L : "")
    };
    this.showPinCode = function (a) {
        l.$(a).src = l.getPinCodeUrl()
    };
    this.isVfValid = function () {
        return l.getSinaCookie(true)["vf"] != 1
    };
    this.getVfValidUrl = function () {
        return A
    };
    this.enableFailRedirect = function () {
        l.failRedirect = true
    };
    var R = function (a) {
        var x = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var b = "";
        for (var i = 0; i < a; i++) {
            b += x.charAt(Math.ceil(Math.random() * 1000000) % x.length)
        }
        return b
    };
    var S = function (a) {
        s = a;
        var b = {
            entry: l.getEntry(),
            service: l.service,
            encoding: "UTF-8",
            gateway: 1,
            returntype: "TEXT",
            from: l.from
        };
        if (l.domain == "sina.com.cn") {
            b.callback = l.name + ".autoLoginCallBack3";
            b.service = "miniblog";
            b.useticket = 1
        } else {
            b.callback = l.name + ".autoLoginCallBack3";
            b.useticket = 1
        }
        var c = location.protocol == "https:" ? u.replace(/^http:/, "https:") : u;
        c = bk(c, b);
        W(l.scriptId, c, "gb2312");
        return true
    };
    var T = function (a) {
        var b = null;
        var c = null;
        c = l.getSinaCookie();
        if (c) {
            b = c.et
        }
        return b
    };
    var U = function (a, b, c) {
        if (a.addEventListener) {
            a.addEventListener(b, c, false)
        } else {
            if (a.attachEvent) {
                a.attachEvent("on" + b, c)
            } else {
                a["on" + b] = c
            }
        }
    };
    var V = function (c) {
        var d = false;
        this.start = function (a, b) {
            if (c) {
                d = setTimeout(b, a)
            }
        };
        this.clear = function (a) {
            if (c) {
                clearTimeout(d);
                d = false
            }
        };
        this.isset = function () {
            return d !== false
        }
    };
    var W = function (a, b, c) {
        bf(a);
        var d = document.getElementsByTagName("head")[0];
        var e = document.createElement("script");
        e.charset = c || "gb2312";
        e.id = a;
        e.type = "text/javascript";
        e.src = bk(b, {
            client: l.getClientType(),
            _: (new Date()).getTime()
        });
        d.appendChild(e)
    };
    var X = function (a, b) {
        bf(a);
        var c = document.getElementsByTagName("body")[0];
        var d = document.createElement("iframe");
        d.style.display = "none";
        d.src = bk(b, {
            client: l.getClientType(),
            _: (new Date()).getTime()
        });
        d.isReady = false;
        U(d, "load", function () {
            if (d.isReady) {
                return
            }
            d.isReady = true;
            l.doCrossDomainCallBack({
                scriptId: a
            })
        });
        c.appendChild(d)
    };
    var Y = function (a, b, c) {
        var d = {
            entry: l.getEntry(),
            gateway: 1,
            from: l.from,
            savestate: c,
            useticket: l.useTicket ? 1 : 0
        };
        if (l.failRedirect) {
            l.loginExtraQuery.frd = 1
        }
        d = br(d, {
            pagerefer: document.referrer || ""
        });
        d = br(d, l.loginExtraFlag);
        d = br(d, l.loginExtraQuery);
        d.su = sinaSSOEncoder.base64.encode(bm(a));
        if (l.service) {
            d.service = l.service
        }
        if ((l.loginType & J) && l.servertime && sinaSSOEncoder && sinaSSOEncoder.RSAKey) {
            d.servertime = l.servertime;
            d.nonce = l.nonce;
            d.pwencode = "rsa2";
            d.rsakv = l.rsakv;
            var f = new sinaSSOEncoder.RSAKey();
            f.setPublic(l.rsaPubkey, "10001");
            b = f.encrypt([l.servertime, l.nonce].join("\t") + "\n" + b)
        } else {
            if ((l.loginType & K) && l.servertime && sinaSSOEncoder && sinaSSOEncoder.hex_sha1) {
                d.servertime = l.servertime;
                d.nonce = l.nonce;
                d.pwencode = "wsse";
                b = sinaSSOEncoder.hex_sha1("" + sinaSSOEncoder.hex_sha1(sinaSSOEncoder.hex_sha1(b)) + l.servertime + l.nonce)
            }
        }
        d.sp = b;
        try {
            d.sr = window.screen.width + "*" + window.screen.height
        } catch (e) {}
        return d
    };
    var Z = function (a, b, c) {
        if (typeof XMLHttpRequest == "undefined") {
            return false
        }
        var d = new XMLHttpRequest();
        if (!"withCredentials" in d) {
            return false
        }
        var f = ba(a, b, c);
        var g = (l.loginType & I) ? u.replace(/^http:/, "https:") : u;
        g = bk(g, {
            client: l.getClientType(),
            _: (new Date()).getTime()
        });
        try {
            d.open("POST", g, true);
            d.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            d.withCredentials = true;
            d.onreadystatechange = function () {
                if (d.readyState == 4 && d.status == 200) {
                    l.loginCallBack(bq(d.responseText))
                }
            };
            d.send(bo(f))
        } catch (e) {
            return false
        }
        return true
    };
    var ba = function (a, b, c) {
        if (l.appLoginURL[l.domain]) {
            l.useTicket = 1;
            l.service = l.appDomainService[l.domain] || l.service
        }
        var d = 0;
        if (l.domain) {
            d = 2
        }
        if (!l.appLoginURL[l.domain]) {
            d = 3
        }
        if (l.cdult !== false) {
            d = l.cdult
        }
        if (d == 3) {
            r = l.crossDomainTime;
            delete l.appLoginURL[l.domain]
        }
        var e = Y(a, b, c);
        return br(e, {
            encoding: "UTF-8",
            cdult: d,
            domain: l.domain,
            useticket: l.appLoginURL[l.domain] ? 1 : 0,
            prelt: O,
            returntype: "TEXT"
        })
    };
    var bb = function (a, b, c) {
        var d = ba(a, b, c);
        d = br(d, {
            callback: l.name + ".loginCallBack"
        });
        var e = (l.loginType & I) ? u.replace(/^http:/, "https:") : u;
        e = bk(e, d);
        W(l.scriptId, e, "gb2312")
    };
    var bc = function (a, b, c) {
        bd(l.loginFrameName);
        var d = be(l.loginFormId);
        var f = Y(a, b, c);
        f.encoding = "UTF-8";
        if (l.crossDomain == false) {
            f.crossdomain = 0
        }
        f.prelt = O;
        if (l.feedBackUrl) {
            f.url = bk(l.feedBackUrl, {
                framelogin: 1,
                callback: "parent." + l.name + ".feedBackUrlCallBack"
            });
            f.returntype = "META"
        } else {
            f.callback = "parent." + l.name + ".loginCallBack";
            f.returntype = "IFRAME";
            f.setdomain = l.setDomain ? 1 : 0
        }
        for (var g in l.loginExtraQuery) {
            if (typeof l.loginExtraQuery[g] == "function") {
                continue
            }
            f[g] = l.loginExtraQuery[g]
        }
        for (var h in f) {
            d.addInput(h, f[h])
        }
        var i = (l.loginType & I) ? u.replace(/^http:/, "https:") : u;
        i = bk(i, br({
            client: l.getClientType()
        }, l.loginExtraFlag));
        d.method = "post";
        d.action = i;
        d.target = l.loginFrameName;
        var j = true;
        try {
            d.submit()
        } catch (e) {
            bf(l.loginFrameName);
            j = false
        }
        setTimeout(function () {
            bf(d)
        }, 10);
        return j
    };
    var bd = function (a, b) {
        if (b == null) {
            b = "javascript:false;"
        }
        bf(a);
        var c = document.createElement("iframe");
        c.height = 0;
        c.width = 0;
        c.style.display = "none";
        c.name = a;
        c.id = a;
        c.src = b;
        bi(document.body, c);
        window.frames[a].name = a;
        return c
    };
    var be = function (e, f) {
        if (f == null) {
            f = "none"
        }
        bf(e);
        var g = document.createElement("form");
        g.height = 0;
        g.width = 0;
        g.style.display = f;
        g.name = e;
        g.id = e;
        bi(document.body, g);
        document.forms[e].name = e;
        g.addInput = function (a, b, c) {
            if (c == null) {
                c = "text"
            }
            var d = this.getElementsByTagName("input")[a];
            if (d) {
                this.removeChild(d)
            }
            d = document.createElement("input");
            this.appendChild(d);
            d.id = a;
            d.name = a;
            d.type = c;
            d.value = b
        };
        return g
    };
    var bf = function (a) {
        try {
            if (typeof (a) === "string") {
                a = l.$(a)
            }
            a.parentNode.removeChild(a)
        } catch (e) {}
    };
    var bg = function (a) {
        if (typeof (a) === "undefined") {
            return "undefined"
        }
        if (a === null) {
            return "null"
        }
        return Object.prototype.toString.call(a).replace(/^\[object\s|\]$/gi, "").toLowerCase()
    };
    var bh = function () {
        var a = navigator.userAgent.toLowerCase();
        return ((/webkit/i).test(a) && !(/chrome/i).test(a))
    };
    var bi = function (a, b) {
        a.appendChild(b)
    };
    var bj = function (a) {
        var b = (new RegExp(a + "=([^;]+)")).exec(document.cookie);
        return b == null ? null : b[1]
    };
    var bk = function (a, b) {
        return a + bl(a) + bo(b)
    };
    var bl = function (a) {
        return (/\?/.test(a) ? "&" : "?")
    };
    var bm = function (a) {
        return encodeURIComponent(a)
    };
    var bn = function (a) {
        if (a == null) {
            return ""
        } else {
            try {
                return decodeURIComponent(a)
            } catch (e) {
                return ""
            }
        }
    };
    var bo = function (a) {
        if (typeof a != "object") {
            return ""
        }
        var b = new Array();
        for (var c in a) {
            if (typeof a[c] == "function") {
                continue
            }
            b.push(c + "=" + bm(a[c]))
        }
        return b.join("&")
    };
    var bp = function (a) {
        var b = a.split("&");
        var c;
        var d = {};
        for (var i = 0; i < b.length; i++) {
            c = b[i].split("=");
            d[c[0]] = bn(c[1])
        }
        return d
    };
    var bq = function (a) {
        if (typeof (a) === "object") {
            return a
        } else {
            if (window.JSON) {
                return JSON.parse(a)
            } else {
                return eval("(" + a + ")")
            }
        }
    };
    var br = function (a, b) {
        for (var c in b) {
            a[c] = b[c]
        }
        return a
    };
    this.$ = function (a) {
        return document.getElementById(a)
    };
    this.generateVisitor = function () {
        var b, domainValid = false;
        for (var i = 0; i < this.generateVisitorDomain.length; i++) {
            b = new RegExp(this.generateVisitorDomain[i]);
            if (b.test(document.domain)) {
                domainValid = true;
                break
            }
        }
        if (!domainValid) {
            return false
        }
        try {
            if (l.shouldGenerateVisitor() && !l.$("visitorfrm84747h4784")) {
                document.body.insertAdjacentHTML("beforeEnd", "<iframe id='visitorfrm84747h4784' style='position:absolute;left:0;top:0;border:none;width:1px;height:1px' src='" + B + "'/>");
                setTimeout(function () {
                    try {
                        var a = l.$("visitorfrm84747h4784");
                        if (a) {
                            a.parentNode.removeChild(a)
                        }
                    } catch (e) {}
                }, 1000 * 30)
            }
        } catch (e) {
            return false
        }
        return true
    };
    this.shouldGenerateVisitor = function () {
        var a = false;
        var b = false;
        var c = bj("SUBP");
        if (c) {
            a = true
        }
        var d = bj("SUP");
        if (d) {
            b = true
        }
        if (!a && !b) {
            return true
        }
        return false
    }
}
var sinaSSOEncoder = sinaSSOEncoder || {};
(function () {
    var i = 0;
    var g = 8;
    this.hex_sha1 = function (j) {
        return h(b(f(j), j.length * g))
    };
    var b = function (A, r) {
        A[r >> 5] |= 128 << (24 - r % 32);
        A[((r + 64 >> 9) << 4) + 15] = r;
        var B = Array(80);
        var z = 1732584193;
        var y = -271733879;
        var v = -1732584194;
        var u = 271733878;
        var s = -1009589776;
        for (var o = 0; o < A.length; o += 16) {
            var q = z;
            var p = y;
            var n = v;
            var m = u;
            var k = s;
            for (var l = 0; l < 80; l++) {
                if (l < 16) {
                    B[l] = A[o + l]
                } else {
                    B[l] = d(B[l - 3] ^ B[l - 8] ^ B[l - 14] ^ B[l - 16], 1)
                }
                var C = e(e(d(z, 5), a(l, y, v, u)), e(e(s, B[l]), c(l)));
                s = u;
                u = v;
                v = d(y, 30);
                y = z;
                z = C
            }
            z = e(z, q);
            y = e(y, p);
            v = e(v, n);
            u = e(u, m);
            s = e(s, k)
        }
        return Array(z, y, v, u, s)
    };
    var a = function (k, j, m, l) {
        if (k < 20) {
            return (j & m) | ((~j) & l)
        }
        if (k < 40) {
            return j ^ m ^ l
        }
        if (k < 60) {
            return (j & m) | (j & l) | (m & l)
        }
        return j ^ m ^ l
    };
    var c = function (j) {
        return (j < 20) ? 1518500249 : (j < 40) ? 1859775393 : (j < 60) ? -1894007588 : -899497514
    };
    var e = function (j, m) {
        var l = (j & 65535) + (m & 65535);
        var k = (j >> 16) + (m >> 16) + (l >> 16);
        return (k << 16) | (l & 65535)
    };
    var d = function (j, k) {
        return (j << k) | (j >>> (32 - k))
    };
    var f = function (m) {
        var l = Array();
        var j = (1 << g) - 1;
        for (var k = 0; k < m.length * g; k += g) {
            l[k >> 5] |= (m.charCodeAt(k / g) & j) << (24 - k % 32)
        }
        return l
    };
    var h = function (l) {
        var k = i ? "0123456789ABCDEF" : "0123456789abcdef";
        var m = "";
        for (var j = 0; j < l.length * 4; j++) {
            m += k.charAt((l[j >> 2] >> ((3 - j % 4) * 8 + 4)) & 15) + k.charAt((l[j >> 2] >> ((3 - j % 4) * 8)) & 15)
        }
        return m
    };
    this.base64 = {
        encode: function (l) {
            l = "" + l;
            if (l == "") {
                return ""
            }
            var j = "";
            var s, q, o = "";
            var r, p, n, m = "";
            var k = 0;
            do {
                s = l.charCodeAt(k++);
                q = l.charCodeAt(k++);
                o = l.charCodeAt(k++);
                r = s >> 2;
                p = ((s & 3) << 4) | (q >> 4);
                n = ((q & 15) << 2) | (o >> 6);
                m = o & 63;
                if (isNaN(q)) {
                    n = m = 64
                } else {
                    if (isNaN(o)) {
                        m = 64
                    }
                }
                j = j + this._keys.charAt(r) + this._keys.charAt(p) + this._keys.charAt(n) + this._keys.charAt(m);
                s = q = o = "";
                r = p = n = m = ""
            } while (k < l.length);
            return j
        }, decode: function (s, p, l) {
            var r = function (j, C) {
                for (var B = 0; B < j.length; B++) {
                    if (j[B] === C) {
                        return B
                    }
                }
                return -1
            };
            if (typeof (s) == "string") {
                s = s.split("")
            }
            var m = [];
            var A, y, v = "";
            var z, x, u, t = "";
            if (s.length % 4 != 0) {}
            var k = /[^A-Za-z0-9\+\/\=]/g;
            var w = this._keys.split("");
            if (p == "urlsafe") {
                k = /[^A-Za-z0-9\-_\=]/g;
                w = this._keys_urlsafe.split("")
            }
            var o = 0;
            if (p == "binnary") {
                w = [];
                for (o = 0; o <= 64; o++) {
                    w[o] = o + 128
                }
            }
            if (p != "binnary" && k.exec(s.join(""))) {
                return l == "array" ? [] : ""
            }
            o = 0;
            do {
                z = r(w, s[o++]);
                x = r(w, s[o++]);
                u = r(w, s[o++]);
                t = r(w, s[o++]);
                A = (z << 2) | (x >> 4);
                y = ((x & 15) << 4) | (u >> 2);
                v = ((u & 3) << 6) | t;
                m.push(A);
                if (u != 64 && u != -1) {
                    m.push(y)
                }
                if (t != 64 && t != -1) {
                    m.push(v)
                }
                A = y = v = "";
                z = x = u = t = ""
            } while (o < s.length);
            if (l == "array") {
                return m
            }
            var q = "",
                n = 0;
            for (; n < m.lenth; n++) {
                q += String.fromCharCode(m[n])
            }
            return q
        }, _keys: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        _keys_urlsafe: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_="
    };
    this.Cookie = {
        decode: function (n) {
            var p = function (q) {
                var r = "",
                    s = 0;
                for (; s < q.length; s++) {
                    r += "%" + l(q[s])
                }
                return decodeURIComponent(r)
            };
            var l = function (q) {
                var r = "0" + q.toString(16);
                return r.length <= 2 ? r : r.substr(1)
            };
            var m = [];
            var k = n.substr(0, 3);
            var j = n.substr(3);
            switch (k) {
            case "v01":
                for (var o = 0; o < j.length; o += 2) {
                    m.push(parseInt(j.substr(o, 2), 16))
                }
                return decodeURIComponent(p(sinaSSOEncoder.base64.decode(m, "binnary", "array")));
                break;
            case "v02":
                m = sinaSSOEncoder.base64.decode(j, "urlsafe", "array");
                return p(sinaSSOEncoder.base64.decode(m, "binnary", "array"));
                break;
            default:
                return decodeURIComponent(n)
            }
        }
    }
}).call(sinaSSOEncoder);
(function () {
    var ba;
    var bb = 244837814094590;
    var Y = ((bb & 16777215) == 15715070);

    function aq(z, t, a) {
        if (z != null) {
            if ("number" == typeof z) {
                this.fromNumber(z, t, a)
            } else {
                if (t == null && "string" != typeof z) {
                    this.fromString(z, 256)
                } else {
                    this.fromString(z, t)
                }
            }
        }
    }

    function h() {
        return new aq(null)
    }

    function b(a, t, z, c, d, e) {
        while (--e >= 0) {
            var f = t * this[a++] + z[c] + d;
            d = Math.floor(f / 67108864);
            z[c++] = f & 67108863
        }
        return d
    }

    function ax(a, b, c, d, e, t) {
        var f = b & 32767,
            aF = b >> 15;
        while (--t >= 0) {
            var g = this[a] & 32767;
            var h = this[a++] >> 15;
            var z = aF * g + h * f;
            g = f * g + ((z & 32767) << 15) + c[d] + (e & 1073741823);
            e = (g >>> 30) + (z >>> 15) + aF * h + (e >>> 30);
            c[d++] = g & 1073741823
        }
        return e
    }

    function aw(a, b, c, d, e, t) {
        var f = b & 16383,
            aF = b >> 14;
        while (--t >= 0) {
            var g = this[a] & 16383;
            var h = this[a++] >> 14;
            var z = aF * g + h * f;
            g = f * g + ((z & 16383) << 14) + c[d] + e;
            e = (g >> 28) + (z >> 14) + aF * h;
            c[d++] = g & 268435455
        }
        return e
    }
    if (Y && (navigator.appName == "Microsoft Internet Explorer")) {
        aq.prototype.am = ax;
        ba = 30
    } else {
        if (Y && (navigator.appName != "Netscape")) {
            aq.prototype.am = b;
            ba = 26
        } else {
            aq.prototype.am = aw;
            ba = 28
        }
    }
    aq.prototype.DB = ba;
    aq.prototype.DM = ((1 << ba) - 1);
    aq.prototype.DV = (1 << ba);
    var Z = 52;
    aq.prototype.FV = Math.pow(2, Z);
    aq.prototype.F1 = Z - ba;
    aq.prototype.F2 = 2 * ba - Z;
    var bc = "0123456789abcdefghijklmnopqrstuvwxyz";
    var bd = new Array();
    var be, v;
    be = "0".charCodeAt(0);
    for (v = 0; v <= 9; ++v) {
        bd[be++] = v
    }
    be = "a".charCodeAt(0);
    for (v = 10; v < 36; ++v) {
        bd[be++] = v
    }
    be = "A".charCodeAt(0);
    for (v = 10; v < 36; ++v) {
        bd[be++] = v
    }

    function ay(t) {
        return bc.charAt(t)
    }

    function A(z, t) {
        var a = bd[z.charCodeAt(t)];
        return (a == null) ? -1 : a
    }

    function X(z) {
        for (var t = this.t - 1; t >= 0; --t) {
            z[t] = this[t]
        }
        z.t = this.t;
        z.s = this.s
    }

    function n(t) {
        this.t = 1;
        this.s = (t < 0) ? -1 : 0;
        if (t > 0) {
            this[0] = t
        } else {
            if (t < -1) {
                this[0] = t + DV
            } else {
                this.t = 0
            }
        }
    }

    function c(t) {
        var z = h();
        z.fromInt(t);
        return z
    }

    function w(a, z) {
        var b;
        if (z == 16) {
            b = 4
        } else {
            if (z == 8) {
                b = 3
            } else {
                if (z == 256) {
                    b = 8
                } else {
                    if (z == 2) {
                        b = 1
                    } else {
                        if (z == 32) {
                            b = 5
                        } else {
                            if (z == 4) {
                                b = 2
                            } else {
                                this.fromRadix(a, z);
                                return
                            }
                        }
                    }
                }
            }
        }
        this.t = 0;
        this.s = 0;
        var c = a.length,
            az = false,
            aB = 0;
        while (--c >= 0) {
            var t = (b == 8) ? a[c] & 255 : A(a, c);
            if (t < 0) {
                if (a.charAt(c) == "-") {
                    az = true
                }
                continue
            }
            az = false;
            if (aB == 0) {
                this[this.t++] = t
            } else {
                if (aB + b > this.DB) {
                    this[this.t - 1] |= (t & ((1 << (this.DB - aB)) - 1)) << aB;
                    this[this.t++] = (t >> (this.DB - aB))
                } else {
                    this[this.t - 1] |= t << aB
                }
            }
            aB += b;
            if (aB >= this.DB) {
                aB -= this.DB
            }
        }
        if (b == 8 && (a[0] & 128) != 0) {
            this.s = -1;
            if (aB > 0) {
                this[this.t - 1] |= ((1 << (this.DB - aB)) - 1) << aB
            }
        }
        this.clamp();
        if (az) {
            aq.ZERO.subTo(this, this)
        }
    }

    function O() {
        var t = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == t) {
            --this.t
        }
    }

    function q(z) {
        if (this.s < 0) {
            return "-" + this.negate().toString(z)
        }
        var a;
        if (z == 16) {
            a = 4
        } else {
            if (z == 8) {
                a = 3
            } else {
                if (z == 2) {
                    a = 1
                } else {
                    if (z == 32) {
                        a = 5
                    } else {
                        if (z == 4) {
                            a = 2
                        } else {
                            return this.toRadix(z)
                        }
                    }
                }
            }
        }
        var b = (1 << a) - 1,
            aE, t = false,
            aC = "",
            aA = this.t;
        var c = this.DB - (aA * this.DB) % a;
        if (aA-- > 0) {
            if (c < this.DB && (aE = this[aA] >> c) > 0) {
                t = true;
                aC = ay(aE)
            }
            while (aA >= 0) {
                if (c < a) {
                    aE = (this[aA] & ((1 << c) - 1)) << (a - c);
                    aE |= this[--aA] >> (c += this.DB - a)
                } else {
                    aE = (this[aA] >> (c -= a)) & b;
                    if (c <= 0) {
                        c += this.DB;
                        --aA
                    }
                } if (aE > 0) {
                    t = true
                }
                if (t) {
                    aC += ay(aE)
                }
            }
        }
        return t ? aC : "0"
    }

    function R() {
        var t = h();
        aq.ZERO.subTo(this, t);
        return t
    }

    function ak() {
        return (this.s < 0) ? this.negate() : this
    }

    function G(t) {
        var a = this.s - t.s;
        if (a != 0) {
            return a
        }
        var z = this.t;
        a = z - t.t;
        if (a != 0) {
            return a
        }
        while (--z >= 0) {
            if ((a = this[z] - t[z]) != 0) {
                return a
            }
        }
        return 0
    }

    function j(z) {
        var a = 1,
            az;
        if ((az = z >>> 16) != 0) {
            z = az;
            a += 16
        }
        if ((az = z >> 8) != 0) {
            z = az;
            a += 8
        }
        if ((az = z >> 4) != 0) {
            z = az;
            a += 4
        }
        if ((az = z >> 2) != 0) {
            z = az;
            a += 2
        }
        if ((az = z >> 1) != 0) {
            z = az;
            a += 1
        }
        return a
    }

    function u() {
        if (this.t <= 0) {
            return 0
        }
        return this.DB * (this.t - 1) + j(this[this.t - 1] ^ (this.s & this.DM))
    }

    function ap(a, z) {
        var t;
        for (t = this.t - 1; t >= 0; --t) {
            z[t + a] = this[t]
        }
        for (t = a - 1; t >= 0; --t) {
            z[t] = 0
        }
        z.t = this.t + a;
        z.s = this.s
    }

    function W(a, z) {
        for (var t = a; t < this.t; ++t) {
            z[t - a] = this[t]
        }
        z.t = Math.max(this.t - a, 0);
        z.s = this.s
    }

    function s(a, b) {
        var z = a % this.DB;
        var t = this.DB - z;
        var c = (1 << t) - 1;
        var d = Math.floor(a / this.DB),
            aD = (this.s << z) & this.DM,
            az;
        for (az = this.t - 1; az >= 0; --az) {
            b[az + d + 1] = (this[az] >> t) | aD;
            aD = (this[az] & c) << z
        }
        for (az = d - 1; az >= 0; --az) {
            b[az] = 0
        }
        b[d] = aD;
        b.t = this.t + d + 1;
        b.s = this.s;
        b.clamp()
    }

    function l(a, b) {
        b.s = this.s;
        var c = Math.floor(a / this.DB);
        if (c >= this.t) {
            b.t = 0;
            return
        }
        var z = a % this.DB;
        var t = this.DB - z;
        var d = (1 << z) - 1;
        b[0] = this[c] >> z;
        for (var e = c + 1; e < this.t; ++e) {
            b[e - c - 1] |= (this[e] & d) << t;
            b[e - c] = this[e] >> z
        }
        if (z > 0) {
            b[this.t - c - 1] |= (this.s & d) << t
        }
        b.t = this.t - c;
        b.clamp()
    }

    function aa(z, a) {
        var b = 0,
            aB = 0,
            t = Math.min(z.t, this.t);
        while (b < t) {
            aB += this[b] - z[b];
            a[b++] = aB & this.DM;
            aB >>= this.DB
        }
        if (z.t < this.t) {
            aB -= z.s;
            while (b < this.t) {
                aB += this[b];
                a[b++] = aB & this.DM;
                aB >>= this.DB
            }
            aB += this.s
        } else {
            aB += this.s;
            while (b < z.t) {
                aB -= z[b];
                a[b++] = aB & this.DM;
                aB >>= this.DB
            }
            aB -= z.s
        }
        a.s = (aB < 0) ? -1 : 0;
        if (aB < -1) {
            a[b++] = this.DV + aB
        } else {
            if (aB > 0) {
                a[b++] = aB
            }
        }
        a.t = b;
        a.clamp()
    }

    function D(z, a) {
        var t = this.abs(),
            aB = z.abs();
        var b = t.t;
        a.t = b + aB.t;
        while (--b >= 0) {
            a[b] = 0
        }
        for (b = 0; b < aB.t; ++b) {
            a[b + t.t] = t.am(0, aB[b], a, b, 0, t.t)
        }
        a.s = 0;
        a.clamp();
        if (this.s != z.s) {
            aq.ZERO.subTo(a, a)
        }
    }

    function Q(a) {
        var t = this.abs();
        var z = a.t = 2 * t.t;
        while (--z >= 0) {
            a[z] = 0
        }
        for (z = 0; z < t.t - 1; ++z) {
            var b = t.am(z, t[z], a, 2 * z, 0, 1);
            if ((a[z + t.t] += t.am(z + 1, 2 * t[z], a, 2 * z + 1, b, t.t - z - 1)) >= t.DV) {
                a[z + t.t] -= t.DV;
                a[z + t.t + 1] = 1
            }
        }
        if (a.t > 0) {
            a[a.t - 1] += t.am(z, t[z], a, 2 * z, 0, 1)
        }
        a.s = 0;
        a.clamp()
    }

    function E(a, b, c) {
        var d = a.abs();
        if (d.t <= 0) {
            return
        }
        var e = this.abs();
        if (e.t < d.t) {
            if (b != null) {
                b.fromInt(0)
            }
            if (c != null) {
                this.copyTo(c)
            }
            return
        }
        if (c == null) {
            c = h()
        }
        var f = h(),
            z = this.s,
            aG = a.s;
        var g = this.DB - j(d[d.t - 1]);
        if (g > 0) {
            d.lShiftTo(g, f);
            e.lShiftTo(g, c)
        } else {
            d.copyTo(f);
            e.copyTo(c)
        }
        var i = f.t;
        var k = f[i - 1];
        if (k == 0) {
            return
        }
        var l = k * (1 << this.F1) + ((i > 1) ? f[i - 2] >> this.F2 : 0);
        var m = this.FV / l,
            aP = (1 << this.F1) / l,
            aO = 1 << this.F2;
        var n = c.t,
            aK = n - i,
            aC = (b == null) ? h() : b;
        f.dlShiftTo(aK, aC);
        if (c.compareTo(aC) >= 0) {
            c[c.t++] = 1;
            c.subTo(aC, c)
        }
        aq.ONE.dlShiftTo(i, aC);
        aC.subTo(f, f);
        while (f.t < i) {
            f[f.t++] = 0
        }
        while (--aK >= 0) {
            var o = (c[--n] == k) ? this.DM : Math.floor(c[n] * m + (c[n - 1] + aO) * aP);
            if ((c[n] += f.am(0, o, c, aK, 0, i)) < o) {
                f.dlShiftTo(aK, aC);
                c.subTo(aC, c);
                while (c[n] < --o) {
                    c.subTo(aC, c)
                }
            }
        }
        if (b != null) {
            c.drShiftTo(i, b);
            if (z != aG) {
                aq.ZERO.subTo(b, b)
            }
        }
        c.t = i;
        c.clamp();
        if (g > 0) {
            c.rShiftTo(g, c)
        }
        if (z < 0) {
            aq.ZERO.subTo(c, c)
        }
    }

    function N(t) {
        var z = h();
        this.abs().divRemTo(t, null, z);
        if (this.s < 0 && z.compareTo(aq.ZERO) > 0) {
            t.subTo(z, z)
        }
        return z
    }

    function K(t) {
        this.m = t
    }

    function U(t) {
        if (t.s < 0 || t.compareTo(this.m) >= 0) {
            return t.mod(this.m)
        } else {
            return t
        }
    }

    function aj(t) {
        return t
    }

    function J(t) {
        t.divRemTo(this.m, null, t)
    }

    function H(t, a, z) {
        t.multiplyTo(a, z);
        this.reduce(z)
    }

    function at(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }
    K.prototype.convert = U;
    K.prototype.revert = aj;
    K.prototype.reduce = J;
    K.prototype.mulTo = H;
    K.prototype.sqrTo = at;

    function B() {
        if (this.t < 1) {
            return 0
        }
        var t = this[0];
        if ((t & 1) == 0) {
            return 0
        }
        var z = t & 3;
        z = (z * (2 - (t & 15) * z)) & 15;
        z = (z * (2 - (t & 255) * z)) & 255;
        z = (z * (2 - (((t & 65535) * z) & 65535))) & 65535;
        z = (z * (2 - t * z % this.DV)) % this.DV;
        return (z > 0) ? this.DV - z : -z
    }

    function f(t) {
        this.m = t;
        this.mp = t.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << (t.DB - 15)) - 1;
        this.mt2 = 2 * t.t
    }

    function ai(t) {
        var z = h();
        t.abs().dlShiftTo(this.m.t, z);
        z.divRemTo(this.m, null, z);
        if (t.s < 0 && z.compareTo(aq.ZERO) > 0) {
            this.m.subTo(z, z)
        }
        return z
    }

    function ar(t) {
        var z = h();
        t.copyTo(z);
        this.reduce(z);
        return z
    }

    function P(t) {
        while (t.t <= this.mt2) {
            t[t.t++] = 0
        }
        for (var a = 0; a < this.m.t; ++a) {
            var z = t[a] & 32767;
            var b = (z * this.mpl + (((z * this.mph + (t[a] >> 15) * this.mpl) & this.um) << 15)) & t.DM;
            z = a + this.m.t;
            t[z] += this.m.am(0, b, t, a, 0, this.m.t);
            while (t[z] >= t.DV) {
                t[z] -= t.DV;
                t[++z]++
            }
        }
        t.clamp();
        t.drShiftTo(this.m.t, t);
        if (t.compareTo(this.m) >= 0) {
            t.subTo(this.m, t)
        }
    }

    function al(t, z) {
        t.squareTo(z);
        this.reduce(z)
    }

    function y(t, a, z) {
        t.multiplyTo(a, z);
        this.reduce(z)
    }
    f.prototype.convert = ai;
    f.prototype.revert = ar;
    f.prototype.reduce = P;
    f.prototype.mulTo = y;
    f.prototype.sqrTo = al;

    function i() {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
    }

    function x(a, b) {
        if (a > 4294967295 || a < 1) {
            return aq.ONE
        }
        var c = h(),
            az = h(),
            aC = b.convert(this),
            aB = j(a) - 1;
        aC.copyTo(c);
        while (--aB >= 0) {
            b.sqrTo(c, az);
            if ((a & (1 << aB)) > 0) {
                b.mulTo(az, aC, c)
            } else {
                var d = c;
                c = az;
                az = d
            }
        }
        return b.revert(c)
    }

    function am(a, t) {
        var b;
        if (a < 256 || t.isEven()) {
            b = new K(t)
        } else {
            b = new f(t)
        }
        return this.exp(a, b)
    }
    aq.prototype.copyTo = X;
    aq.prototype.fromInt = n;
    aq.prototype.fromString = w;
    aq.prototype.clamp = O;
    aq.prototype.dlShiftTo = ap;
    aq.prototype.drShiftTo = W;
    aq.prototype.lShiftTo = s;
    aq.prototype.rShiftTo = l;
    aq.prototype.subTo = aa;
    aq.prototype.multiplyTo = D;
    aq.prototype.squareTo = Q;
    aq.prototype.divRemTo = E;
    aq.prototype.invDigit = B;
    aq.prototype.isEven = i;
    aq.prototype.exp = x;
    aq.prototype.toString = q;
    aq.prototype.negate = R;
    aq.prototype.abs = ak;
    aq.prototype.compareTo = G;
    aq.prototype.bitLength = u;
    aq.prototype.mod = N;
    aq.prototype.modPowInt = am;
    aq.ZERO = c(0);
    aq.ONE = c(1);

    function k() {
        this.i = 0;
        this.j = 0;
        this.S = new Array()
    }

    function e(a) {
        var b, z, az;
        for (b = 0; b < 256; ++b) {
            this.S[b] = b
        }
        z = 0;
        for (b = 0; b < 256; ++b) {
            z = (z + this.S[b] + a[b % a.length]) & 255;
            az = this.S[b];
            this.S[b] = this.S[z];
            this.S[z] = az
        }
        this.i = 0;
        this.j = 0
    }

    function a() {
        var z;
        this.i = (this.i + 1) & 255;
        this.j = (this.j + this.S[this.i]) & 255;
        z = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = z;
        return this.S[(z + this.S[this.i]) & 255]
    }
    k.prototype.init = e;
    k.prototype.next = a;

    function an() {
        return new k()
    }
    var M = 256;
    var m;
    var T;
    var bf;

    function d(t) {
        T[bf++] ^= t & 255;
        T[bf++] ^= (t >> 8) & 255;
        T[bf++] ^= (t >> 16) & 255;
        T[bf++] ^= (t >> 24) & 255;
        if (bf >= M) {
            bf -= M
        }
    }

    function S() {
        d(new Date().getTime())
    }
    if (T == null) {
        T = new Array();
        bf = 0;
        var I;
        if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto && typeof (window.crypto.random) === "function") {
            var F = window.crypto.random(32);
            for (I = 0; I < F.length; ++I) {
                T[bf++] = F.charCodeAt(I) & 255
            }
        }
        while (bf < M) {
            I = Math.floor(65536 * Math.random());
            T[bf++] = I >>> 8;
            T[bf++] = I & 255
        }
        bf = 0;
        S()
    }

    function C() {
        if (m == null) {
            S();
            m = an();
            m.init(T);
            for (bf = 0; bf < T.length; ++bf) {
                T[bf] = 0
            }
            bf = 0
        }
        return m.next()
    }

    function au(z) {
        var t;
        for (t = 0; t < z.length; ++t) {
            z[t] = C()
        }
    }

    function ac() {}
    ac.prototype.nextBytes = au;

    function g(z, t) {
        return new aq(z, t)
    }

    function ag(a, b) {
        var t = "";
        var z = 0;
        while (z + b < a.length) {
            t += a.substring(z, z + b) + "\n";
            z += b
        }
        return t + a.substring(z, a.length)
    }

    function r(t) {
        if (t < 16) {
            return "0" + t.toString(16)
        } else {
            return t.toString(16)
        }
    }

    function ae(a, b) {
        if (b < a.length + 11) {
            alert("Message too long for RSA");
            return null
        }
        var c = new Array();
        var d = a.length - 1;
        while (d >= 0 && b > 0) {
            var e = a.charCodeAt(d--);
            if (e < 128) {
                c[--b] = e
            } else {
                if ((e > 127) && (e < 2048)) {
                    c[--b] = (e & 63) | 128;
                    c[--b] = (e >> 6) | 192
                } else {
                    c[--b] = (e & 63) | 128;
                    c[--b] = ((e >> 6) & 63) | 128;
                    c[--b] = (e >> 12) | 224
                }
            }
        }
        c[--b] = 0;
        var z = new ac();
        var t = new Array();
        while (b > 2) {
            t[0] = 0;
            while (t[0] == 0) {
                z.nextBytes(t)
            }
            c[--b] = t[0]
        }
        c[--b] = 2;
        c[--b] = 0;
        return new aq(c)
    }

    function L() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null
    }

    function o(z, t) {
        if (z != null && t != null && z.length > 0 && t.length > 0) {
            this.n = g(z, 16);
            this.e = parseInt(t, 16)
        } else {
            alert("Invalid RSA public key")
        }
    }

    function V(t) {
        return t.modPowInt(this.e, this.n)
    }

    function p(a) {
        var t = ae(a, (this.n.bitLength() + 7) >> 3);
        if (t == null) {
            return null
        }
        var b = this.doPublic(t);
        if (b == null) {
            return null
        }
        var z = b.toString(16);
        if ((z.length & 1) == 0) {
            return z
        } else {
            return "0" + z
        }
    }
    L.prototype.doPublic = V;
    L.prototype.setPublic = o;
    L.prototype.encrypt = p;
    this.RSAKey = L
}).call(sinaSSOEncoder);
sinaSSOController = new SSOController();
sinaSSOController.init();
