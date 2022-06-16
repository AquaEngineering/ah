function unbindBeforeUnloadEvents() {
    $(window).unbind("beforeunload.channel"), $(document).unbind("page:before-change.channel page:before-unload.channel")
}

function confirmUnsavedChanges() {
    var e = $("#unsaved_message").val(),
        t = channelInfo();
    unbindBeforeUnloadEvents(), $(window).bind("beforeunload.channel", function() {
        if (channelChanged(t)) return e
    }), $(document).bind("page:before-change.channel page:before-unload.channel", function() {
        if (channelChanged(t) && !confirm(e)) return !1
    })
}

function channelInfo() {
    var e = $(":text").get(),
        t = $(":radio:checked").get(),
        n = $(":checkbox").get();
    return [e, $("textarea").get(), t, n].map(function(e) {
        return e.map(function(e) {
            return e.value
        })
    }).reduce(function(e, t) {
        return e.concat(t)
    })
}

function channelChanged(e) {
    if (!elementPresent($("#channel_form"))) return !1;
    if ("/channels/new" === window.location.pathname) return !0;
    var t = channelInfo();
    if (e.length !== t.length) return !0;
    for (var n = 0; n < e.length; n++)
        if (t[n] !== e[n]) return !0;
    return !1
}

function setSchedulable() {
    switch ($("#schedulable_templates").append($(".schedulable_template")), $("#schedulable").html(""), $("#timecontrol_schedulable_type").val()) {
        case "TwitterAccount":
            $("#schedulable").append($("#thingtweet_template")), disableDateTime(!1);
            break;
        case "Thinghttp":
            $("#schedulable").append($("#thinghttp_template")), disableDateTime(!1);
            break;
        case "Talkback":
            $("#schedulable").append($("#talkback_template")), disableDateTime(!1);
            break;
        case "MatlabCode":
            $("#schedulable").append($("#matlab_code_template")), !0 === $("#timecontrol_frequency_hourly").prop("checked") || !0 === $("#timecontrol_frequency_minutes").prop("checked") ? disableDateTime(!0) : disableDateTime(!1);
            break;
        case "MatlabIotAnalytic":
            ThingSpeak.MatlabIotAnalyticUtility.getMATLABFileNames(), $("#schedulable").append($("#matlab_iot_analytic_template")), !0 === $("#timecontrol_frequency_hourly").prop("checked") || !0 === $("#timecontrol_frequency_minutes").prop("checked") ? disableDateTime(!0) : disableDateTime(!1)
    }
    "" !== $("#schedulable option:selected").text() ? $("#timecontrol-save-button").removeAttr("disabled") : $("#timecontrol-save-button").attr("disabled", !0)
}

function setWeekdays() {
    var e = $("#saved_weekdays").val();
    e.length > 0 && $.each(e.split(" "), function(e, t) {
        $('.weekdays[value="' + t + '"]').prop("checked", !0)
    })
}

function fixDateTime() {
    var e = $("#timecontrol_run_at").val(),
        t = $("#saved_hour").val();
    if (e.length > 0) {
        var n = e.split(" ");
        $("#timecontrol_run_at").val(n[0])
    }
    if (t.length > 0) {
        var i = t.split(" ");
        $("#hour").val(i[0]), $("#minute").val($("#saved_minute").val()), $("#ampm").val(i[1])
    }
}

function getStartTime() {
    $.ajax({
        url: "calculate_start_time",
        success: function(e) {
            var t = e.start_time;
            $("#hour").val(parseInt(t.substring(0, 2), 10)), $("#minute").val(t.substring(3, 5)), $("#second").val(t.substring(6, 8)), $("#ampm").val(t.substring(9).toLowerCase()), $("#minute_start_time").text($("#hour").val() + ":" + $("#minute").val() + " " + $("#ampm").val())
        }
    })
}

function disableDateTime(e) {
    e ? (getStartTime(), $("#frequency_div_time").hide(), $("#frequency_div_start_time").show()) : ($("#frequency_div_time").show(), $("#frequency_div_start_time").hide())
}

function recurrancyHandler() {
    !0 === $("#timecontrol_frequency_weekly").prop("checked") ? ($("#frequency_once_div").hide(), $("#frequency_recurring_div_days").show(), $("#frequency_recurring_div_hours").hide(), $("#frequency_recurring_div_minutes").hide(), $("#frequency_once_div_date").hide(), $("#frequency_recurring_div_choice").show(), setTimeLabel("Time"), disableDateTime(!1)) : !0 === $("#timecontrol_frequency_daily").prop("checked") ? ($("#frequency_once_div").hide(), $("#frequency_recurring_div_hours").hide(), $("#frequency_recurring_div_minutes").hide(), $("#frequency_recurring_div_days").hide(), $("#frequency_once_div_date").hide(), $("#frequency_recurring_div_choice").show(), setTimeLabel("Time"), disableDateTime(!1)) : !0 === $("#timecontrol_frequency_hourly").prop("checked") ? ($("#frequency_once_div").hide(), $("#frequency_recurring_div_days").hide(), $("#frequency_recurring_div_minutes").hide(), $("#frequency_recurring_div_hours").show(), $("#frequency_once_div_date").hide(), $("#frequency_recurring_div_choice").show(), "MatlabCode" === $("#timecontrol_schedulable_type").val() || "MatlabIotAnalytic" === $("#timecontrol_schedulable_type").val() ? disableDateTime(!0) : disableDateTime(!1), setTimeLabel("Start Time")) : !0 === $("#timecontrol_frequency_minutes").prop("checked") && ($("#frequency_once_div").hide(), $("#frequency_recurring_div_days").hide(), $("#frequency_recurring_div_hours").hide(), $("#frequency_recurring_div_minutes").show(), $("#frequency_once_div_date").hide(), $("#frequency_recurring_div_choice").show(), "MatlabCode" === $("#timecontrol_schedulable_type").val() || "MatlabIotAnalytic" === $("#timecontrol_schedulable_type").val() ? disableDateTime(!0) : disableDateTime(!1), setTimeLabel("Start Time")), displayFuzzyTimeOptions()
}

function setTimeLabel(e) {
    $("#time_label").text(e)
}

function setWeekdays() {
    var e = $("#saved_weekdays").val();
    e.length > 0 && $.each(e.split(" "), function(e, t) {
        $('.weekdays[value="' + t + '"]').prop("checked", !0)
    })
}

function setFrequencyOption() {
    !0 === $("#timecontrol_frequency_weekly").prop("checked") || !0 === $("#timecontrol_frequency_daily").prop("checked") || !0 === $("#timecontrol_frequency_hourly").prop("checked") || !0 === $("#timecontrol_frequency_minutes").prop("checked") ? $("#frequency_recurrance").attr("checked", !0) : $("#frequency_once").attr("checked", !0), frequencyHandler()
}

function frequencyHandler() {
    !0 === $("#frequency_once").prop("checked") ? ($("#frequency_recurring_div").hide(), $("#frequency_once_div").show(), $("#frequency_recurring_div_choice").hide(), $("#frequency_once_div_date").show(), $("#frequency_recurring_div_hours").hide(), $("#frequency_recurring_div_minutes").hide(), $("#frequency_recurring_div_days").hide(), setTimeLabel("Time"), disableDateTime(!1)) : !0 === $("#frequency_recurrance").prop("checked") && ($("#frequency_once_div").hide(), $("#frequency_recurring_div").show(), $("#frequency_once_div_date").hide(), $("#frequency_recurring_div_choice").show(), $("input:radio[class='recurrance_radio']").is(":checked") || $("#timecontrol_frequency_weekly").attr("checked", !0), recurrancyHandler())
}

function displayFuzzyTimeOptions() {
    if (!0 === $("#timecontrol_frequency_minutes").prop("checked") && !1 === $("#frequency_once").prop("checked")) {
        recurring_minute = $("#timecontrol_recurring_minute").prop("selectedOptions")[0];
        var e = recurring_minute.value / 2;
        e *= 60, $("#fuzzy_time option").each(function() {
            $(this).val() < e ? $(this).show() : $(this).hide()
        }), $("#fuzzy_time").val($("#fuzzy_time option:first").val())
    } else $("#fuzzy_time option").each(function() {
        $(this).show()
    })
}! function(e, t) {
    "use strict";
    var n;
    e.rails !== t && e.error("jquery-ujs has already been loaded!");
    var i = e(document);
    e.rails = n = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
        fileInputSelector: "input[name][type=file]:not([disabled])",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        csrfToken: function() {
            return e("meta[name=csrf-token]").attr("content")
        },
        csrfParam: function() {
            return e("meta[name=csrf-param]").attr("content")
        },
        CSRFProtection: function(e) {
            var t = n.csrfToken();
            t && e.setRequestHeader("X-CSRF-Token", t)
        },
        refreshCSRFTokens: function() {
            e('form input[name="' + n.csrfParam() + '"]').val(n.csrfToken())
        },
        fire: function(t, n, i) {
            var a = e.Event(n);
            return t.trigger(a, i), !1 !== a.result
        },
        confirm: function(e) {
            return confirm(e)
        },
        ajax: function(t) {
            return e.ajax(t)
        },
        href: function(e) {
            return e[0].href
        },
        isRemote: function(e) {
            return e.data("remote") !== t && !1 !== e.data("remote")
        },
        handleRemote: function(i) {
            var a, r, o, s, l, u;
            if (n.fire(i, "ajax:before")) {
                if (s = i.data("with-credentials") || null, l = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
                    a = i.data("ujs:submit-button-formmethod") || i.attr("method"), r = i.data("ujs:submit-button-formaction") || i.attr("action"), o = e(i[0]).serializeArray();
                    var d = i.data("ujs:submit-button");
                    d && (o.push(d), i.data("ujs:submit-button", null)), i.data("ujs:submit-button-formmethod", null), i.data("ujs:submit-button-formaction", null)
                } else i.is(n.inputChangeSelector) ? (a = i.data("method"), r = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (a = i.data("method") || "get", r = i.data("url"), o = i.serialize(), i.data("params") && (o = o + "&" + i.data("params"))) : (a = i.data("method"), r = n.href(i), o = i.data("params") || null);
                return u = {
                    type: a || "GET",
                    data: o,
                    dataType: l,
                    beforeSend: function(e, a) {
                        if (a.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + a.accepts.script), !n.fire(i, "ajax:beforeSend", [e, a])) return !1;
                        i.trigger("ajax:send", e)
                    },
                    success: function(e, t, n) {
                        i.trigger("ajax:success", [e, t, n])
                    },
                    complete: function(e, t) {
                        i.trigger("ajax:complete", [e, t])
                    },
                    error: function(e, t, n) {
                        i.trigger("ajax:error", [e, t, n])
                    },
                    crossDomain: n.isCrossDomain(r)
                }, s && (u.xhrFields = {
                    withCredentials: s
                }), r && (u.url = r), n.ajax(u)
            }
            return !1
        },
        isCrossDomain: function(e) {
            var t = document.createElement("a");
            t.href = location.href;
            var n = document.createElement("a");
            try {
                return n.href = e, n.href = n.href, !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host)
            } catch (i) {
                return !0
            }
        },
        handleMethod: function(i) {
            var a = n.href(i),
                r = i.data("method"),
                o = i.attr("target"),
                s = n.csrfToken(),
                l = n.csrfParam(),
                u = e('<form method="post" action="' + a + '"></form>'),
                d = '<input name="_method" value="' + r + '" type="hidden" />';
            l === t || s === t || n.isCrossDomain(a) || (d += '<input name="' + l + '" value="' + s + '" type="hidden" />'), o && u.attr("target", o), u.hide().append(d).appendTo("body"), u.submit()
        },
        formElements: function(t, n) {
            return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
        },
        disableFormElements: function(t) {
            n.formElements(t, n.disableSelector).each(function() {
                n.disableFormElement(e(this))
            })
        },
        disableFormElement: function(e) {
            var n, i;
            n = e.is("button") ? "html" : "val", (i = e.data("disable-with")) !== t && (e.data("ujs:enable-with", e[n]()), e[n](i)), e.prop("disabled", !0), e.data("ujs:disabled", !0)
        },
        enableFormElements: function(t) {
            n.formElements(t, n.enableSelector).each(function() {
                n.enableFormElement(e(this))
            })
        },
        enableFormElement: function(e) {
            var n = e.is("button") ? "html" : "val";
            e.data("ujs:enable-with") !== t && (e[n](e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.prop("disabled", !1), e.removeData("ujs:disabled")
        },
        allowAction: function(e) {
            var t, i = e.data("confirm"),
                a = !1;
            if (!i) return !0;
            if (n.fire(e, "confirm")) {
                try {
                    a = n.confirm(i)
                } catch (r) {
                    (console.error || console.log).call(console, r.stack || r)
                }
                t = n.fire(e, "confirm:complete", [a])
            }
            return a && t
        },
        blankInputs: function(t, n, i) {
            var a, r, o, s = e(),
                l = n || "input,textarea",
                u = t.find(l),
                d = {};
            return u.each(function() {
                (a = e(this)).is("input[type=radio]") ? (o = a.attr("name"), d[o] || (0 === t.find('input[type=radio]:checked[name="' + o + '"]').length && (r = t.find('input[type=radio][name="' + o + '"]'), s = s.add(r)), d[o] = o)) : (a.is("input[type=checkbox],input[type=radio]") ? a.is(":checked") : !!a.val()) === i && (s = s.add(a))
            }), !!s.length && s
        },
        nonBlankInputs: function(e, t) {
            return n.blankInputs(e, t, !0)
        },
        stopEverything: function(t) {
            return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
        },
        disableElement: function(e) {
            var i = e.data("disable-with");
            i !== t && (e.data("ujs:enable-with", e.html()), e.html(i)), e.bind("click.railsDisable", function(e) {
                return n.stopEverything(e)
            }), e.data("ujs:disabled", !0)
        },
        enableElement: function(e) {
            e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable"), e.removeData("ujs:disabled")
        }
    }, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function(e, t, i) {
        e.crossDomain || n.CSRFProtection(i)
    }), e(window).on("pageshow.rails", function() {
        e(e.rails.enableSelector).each(function() {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableFormElement(t)
        }), e(e.rails.linkDisableSelector).each(function() {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableElement(t)
        })
    }), i.on("ajax:complete", n.linkDisableSelector, function() {
        n.enableElement(e(this))
    }), i.on("ajax:complete", n.buttonDisableSelector, function() {
        n.enableFormElement(e(this))
    }), i.on("click.rails", n.linkClickSelector, function(t) {
        var i = e(this),
            a = i.data("method"),
            r = i.data("params"),
            o = t.metaKey || t.ctrlKey;
        if (!n.allowAction(i)) return n.stopEverything(t);
        if (!o && i.is(n.linkDisableSelector) && n.disableElement(i), n.isRemote(i)) {
            if (o && (!a || "GET" === a) && !r) return !0;
            var s = n.handleRemote(i);
            return !1 === s ? n.enableElement(i) : s.fail(function() {
                n.enableElement(i)
            }), !1
        }
        return a ? (n.handleMethod(i), !1) : void 0
    }), i.on("click.rails", n.buttonClickSelector, function(t) {
        var i = e(this);
        if (!n.allowAction(i) || !n.isRemote(i)) return n.stopEverything(t);
        i.is(n.buttonDisableSelector) && n.disableFormElement(i);
        var a = n.handleRemote(i);
        return !1 === a ? n.enableFormElement(i) : a.fail(function() {
            n.enableFormElement(i)
        }), !1
    }), i.on("change.rails", n.inputChangeSelector, function(t) {
        var i = e(this);
        return n.allowAction(i) && n.isRemote(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
    }), i.on("submit.rails", n.formSubmitSelector, function(i) {
        var a, r, o = e(this),
            s = n.isRemote(o);
        if (!n.allowAction(o)) return n.stopEverything(i);
        if (o.attr("novalidate") === t)
            if (o.data("ujs:formnovalidate-button") === t) {
                if ((a = n.blankInputs(o, n.requiredInputSelector, !1)) && n.fire(o, "ajax:aborted:required", [a])) return n.stopEverything(i)
            } else o.data("ujs:formnovalidate-button", t);
        if (s) {
            if (r = n.nonBlankInputs(o, n.fileInputSelector)) {
                setTimeout(function() {
                    n.disableFormElements(o)
                }, 13);
                var l = n.fire(o, "ajax:aborted:file", [r]);
                return l || setTimeout(function() {
                    n.enableFormElements(o)
                }, 13), l
            }
            return n.handleRemote(o), !1
        }
        setTimeout(function() {
            n.disableFormElements(o)
        }, 13)
    }), i.on("click.rails", n.formInputClickSelector, function(t) {
        var i = e(this);
        if (!n.allowAction(i)) return n.stopEverything(t);
        var a = i.attr("name"),
            r = a ? {
                name: a,
                value: i.val()
            } : null,
            o = i.closest("form");
        0 === o.length && (o = e("#" + i.attr("form"))), o.data("ujs:submit-button", r), o.data("ujs:formnovalidate-button", i.attr("formnovalidate")), o.data("ujs:submit-button-formaction", i.attr("formaction")), o.data("ujs:submit-button-formmethod", i.attr("formmethod"))
    }), i.on("ajax:send.rails", n.formSubmitSelector, function(t) {
        this === t.target && n.disableFormElements(e(this))
    }), i.on("ajax:complete.rails", n.formSubmitSelector, function(t) {
        this === t.target && n.enableFormElements(e(this))
    }), e(function() {
        n.refreshCSRFTokens()
    }))
}(jQuery);
var ThingSpeak = ThingSpeak || {};
ThingSpeak.showConfirmModal = function(e, t) {
        const n = e.attr("data-confirm"),
            i = e.attr("data-confirm-title");
        $("#confirmation-modal .modal-body").text(n), i && $("#confirmation-modal .modal-title").text(i);
        const a = $("#confirmation-modal");
        a.on("hidden.bs.modal", () => {
            $("#confirmation-modal-ok").off("click")
        }), $("#confirmation-modal-ok").one("click", () => {
            t(e)
        }), a.modal()
    },
    function(e) {
        const t = function(e) {
            const t = e.attr("data-confirm");
            e.removeAttr("data-confirm"), e.is("form") ? e.trigger("submit.rails") : e.trigger("click.rails"), e.attr("data-confirm", t)
        };
        e.allowAction = function(e) {
            return !e.attr("data-confirm") || (ThingSpeak.showConfirmModal(e, t), !1)
        }
    }($.rails),
    /*!
     * jQuery Cookie Plugin
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2011, Klaus Hartl
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.opensource.org/licenses/GPL-2.0
     */
    function(e) {
        e.cookie = function(t, n, i) {
            if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(n)) || null === n || n === undefined)) {
                if (i = e.extend({}, i), null !== n && n !== undefined || (i.expires = -1), "number" == typeof i.expires) {
                    var a = i.expires,
                        r = i.expires = new Date;
                    r.setDate(r.getDate() + a)
                }
                return n = String(n), document.cookie = [encodeURIComponent(t), "=", i.raw ? n : encodeURIComponent(n), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
            }
            for (var o, s = (i = n || {}).raw ? function(e) {
                    return e
                } : decodeURIComponent, l = document.cookie.split("; "), u = 0; o = l[u] && l[u].split("="); u++)
                if (s(o[0]) === t) return s(o[1] || "");
            return null
        }
    }(jQuery),
    /*
    Turbolinks 5.2.0
    Copyright © 2018 Basecamp, LLC
     */
    function() {
        var e = this;
        (function() {
            (function() {
                this.Turbolinks = {
                    supported: null != window.history.pushState && null != window.requestAnimationFrame && null != window.addEventListener,
                    visit: function(e, n) {
                        return t.controller.visit(e, n)
                    },
                    clearCache: function() {
                        return t.controller.clearCache()
                    },
                    setProgressBarDelay: function(e) {
                        return t.controller.setProgressBarDelay(e)
                    }
                }
            }).call(this)
        }).call(e);
        var t = e.Turbolinks;
        (function() {
            (function() {
                var e, n, i, a = [].slice;
                t.copyObject = function(e) {
                    var t, n, i;
                    for (t in n = {}, e) i = e[t], n[t] = i;
                    return n
                }, t.closest = function(t, n) {
                    return e.call(t, n)
                }, e = function() {
                    var e;
                    return null != (e = document.documentElement.closest) ? e : function(e) {
                        var t;
                        for (t = this; t;) {
                            if (t.nodeType === Node.ELEMENT_NODE && n.call(t, e)) return t;
                            t = t.parentNode
                        }
                    }
                }(), t.defer = function(e) {
                    return setTimeout(e, 1)
                }, t.throttle = function(e) {
                    var t;
                    return t = null,
                        function() {
                            var n, i;
                            return n = 1 <= arguments.length ? a.call(arguments, 0) : [], null != t ? t : t = requestAnimationFrame((i = this, function() {
                                return t = null, e.apply(i, n)
                            }))
                        }
                }, t.dispatch = function(e, t) {
                    var n, a, r, o, s, l;
                    return l = (s = null != t ? t : {}).target, n = s.cancelable, a = s.data, (r = document.createEvent("Events")).initEvent(e, !0, !0 === n), r.data = null != a ? a : {}, r.cancelable && !i && (o = r.preventDefault, r.preventDefault = function() {
                        return this.defaultPrevented || Object.defineProperty(this, "defaultPrevented", {
                            get: function() {
                                return !0
                            }
                        }), o.call(this)
                    }), (null != l ? l : document).dispatchEvent(r), r
                }, i = function() {
                    var e;
                    return (e = document.createEvent("Events")).initEvent("test", !0, !0), e.preventDefault(), e.defaultPrevented
                }(), t.match = function(e, t) {
                    return n.call(e, t)
                }, n = function() {
                    var e, t, n, i;
                    return null != (t = null != (n = null != (i = (e = document.documentElement).matchesSelector) ? i : e.webkitMatchesSelector) ? n : e.msMatchesSelector) ? t : e.mozMatchesSelector
                }(), t.uuid = function() {
                    var e, t, n;
                    for (n = "", e = t = 1; 36 >= t; e = ++t) n += 9 === e || 14 === e || 19 === e || 24 === e ? "-" : 15 === e ? "4" : 20 === e ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(15 * Math.random()).toString(16);
                    return n
                }
            }).call(this),
                function() {
                    t.Location = function() {
                        function e(e) {
                            var t, n;
                            null == e && (e = ""), (n = document.createElement("a")).href = e.toString(), this.absoluteURL = n.href, 2 > (t = n.hash.length) ? this.requestURL = this.absoluteURL : (this.requestURL = this.absoluteURL.slice(0, -t), this.anchor = n.hash.slice(1))
                        }
                        var t, n, i, a;
                        return e.wrap = function(e) {
                            return e instanceof this ? e : new this(e)
                        }, e.prototype.getOrigin = function() {
                            return this.absoluteURL.split("/", 3).join("/")
                        }, e.prototype.getPath = function() {
                            var e, t;
                            return null != (e = null != (t = this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/)) ? t[1] : void 0) ? e : "/"
                        }, e.prototype.getPathComponents = function() {
                            return this.getPath().split("/").slice(1)
                        }, e.prototype.getLastPathComponent = function() {
                            return this.getPathComponents().slice(-1)[0]
                        }, e.prototype.getExtension = function() {
                            var e, t;
                            return null != (e = null != (t = this.getLastPathComponent().match(/\.[^.]*$/)) ? t[0] : void 0) ? e : ""
                        }, e.prototype.isHTML = function() {
                            return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)
                        }, e.prototype.isPrefixedBy = function(e) {
                            var t;
                            return t = n(e), this.isEqualTo(e) || a(this.absoluteURL, t)
                        }, e.prototype.isEqualTo = function(e) {
                            return this.absoluteURL === (null != e ? e.absoluteURL : void 0)
                        }, e.prototype.toCacheKey = function() {
                            return this.requestURL
                        }, e.prototype.toJSON = function() {
                            return this.absoluteURL
                        }, e.prototype.toString = function() {
                            return this.absoluteURL
                        }, e.prototype.valueOf = function() {
                            return this.absoluteURL
                        }, n = function(e) {
                            return t(e.getOrigin() + e.getPath())
                        }, t = function(e) {
                            return i(e, "/") ? e : e + "/"
                        }, a = function(e, t) {
                            return e.slice(0, t.length) === t
                        }, i = function(e, t) {
                            return e.slice(-t.length) === t
                        }, e
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.HttpRequest = function() {
                        function n(n, i, a) {
                            this.delegate = n, this.requestCanceled = e(this.requestCanceled, this), this.requestTimedOut = e(this.requestTimedOut, this), this.requestFailed = e(this.requestFailed, this), this.requestLoaded = e(this.requestLoaded, this), this.requestProgressed = e(this.requestProgressed, this), this.url = t.Location.wrap(i).requestURL, this.referrer = t.Location.wrap(a).absoluteURL, this.createXHR()
                        }
                        return n.NETWORK_FAILURE = 0, n.TIMEOUT_FAILURE = -1, n.timeout = 60, n.prototype.send = function() {
                            var e;
                            return this.xhr && !this.sent ? (this.notifyApplicationBeforeRequestStart(), this.setProgress(0), this.xhr.send(), this.sent = !0, "function" == typeof(e = this.delegate).requestStarted ? e.requestStarted() : void 0) : void 0
                        }, n.prototype.cancel = function() {
                            return this.xhr && this.sent ? this.xhr.abort() : void 0
                        }, n.prototype.requestProgressed = function(e) {
                            return e.lengthComputable ? this.setProgress(e.loaded / e.total) : void 0
                        }, n.prototype.requestLoaded = function() {
                            return this.endRequest((e = this, function() {
                                var t;
                                return 200 <= (t = e.xhr.status) && 300 > t ? e.delegate.requestCompletedWithResponse(e.xhr.responseText, e.xhr.getResponseHeader("Turbolinks-Location")) : (e.failed = !0, e.delegate.requestFailedWithStatusCode(e.xhr.status, e.xhr.responseText))
                            }));
                            var e
                        }, n.prototype.requestFailed = function() {
                            return this.endRequest((e = this, function() {
                                return e.failed = !0, e.delegate.requestFailedWithStatusCode(e.constructor.NETWORK_FAILURE)
                            }));
                            var e
                        }, n.prototype.requestTimedOut = function() {
                            return this.endRequest((e = this, function() {
                                return e.failed = !0, e.delegate.requestFailedWithStatusCode(e.constructor.TIMEOUT_FAILURE)
                            }));
                            var e
                        }, n.prototype.requestCanceled = function() {
                            return this.endRequest()
                        }, n.prototype.notifyApplicationBeforeRequestStart = function() {
                            return t.dispatch("turbolinks:request-start", {
                                data: {
                                    url: this.url,
                                    xhr: this.xhr
                                }
                            })
                        }, n.prototype.notifyApplicationAfterRequestEnd = function() {
                            return t.dispatch("turbolinks:request-end", {
                                data: {
                                    url: this.url,
                                    xhr: this.xhr
                                }
                            })
                        }, n.prototype.createXHR = function() {
                            return this.xhr = new XMLHttpRequest, this.xhr.open("GET", this.url, !0), this.xhr.timeout = 1e3 * this.constructor.timeout, this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml"), this.xhr.setRequestHeader("Turbolinks-Referrer", this.referrer), this.xhr.onprogress = this.requestProgressed, this.xhr.onload = this.requestLoaded, this.xhr.onerror = this.requestFailed, this.xhr.ontimeout = this.requestTimedOut, this.xhr.onabort = this.requestCanceled
                        }, n.prototype.endRequest = function(e) {
                            return this.xhr ? (this.notifyApplicationAfterRequestEnd(), null != e && e.call(this), this.destroy()) : void 0
                        }, n.prototype.setProgress = function(e) {
                            var t;
                            return this.progress = e, "function" == typeof(t = this.delegate).requestProgressed ? t.requestProgressed(this.progress) : void 0
                        }, n.prototype.destroy = function() {
                            var e;
                            return this.setProgress(1), "function" == typeof(e = this.delegate).requestFinished && e.requestFinished(), this.delegate = null, this.xhr = null
                        }, n
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.ProgressBar = function() {
                        function t() {
                            this.trickle = e(this.trickle, this), this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement()
                        }
                        var n;
                        return n = 300, t.defaultCSS = ".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width " + n + "ms ease-out, opacity " + n / 2 + "ms " + n / 2 + "ms ease-in;\n  transform: translate3d(0, 0, 0);\n}", t.prototype.show = function() {
                            return this.visible ? void 0 : (this.visible = !0, this.installStylesheetElement(), this.installProgressElement(), this.startTrickling())
                        }, t.prototype.hide = function() {
                            return this.visible && !this.hiding ? (this.hiding = !0, this.fadeProgressElement((e = this, function() {
                                return e.uninstallProgressElement(), e.stopTrickling(), e.visible = !1, e.hiding = !1
                            }))) : void 0;
                            var e
                        }, t.prototype.setValue = function(e) {
                            return this.value = e, this.refresh()
                        }, t.prototype.installStylesheetElement = function() {
                            return document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
                        }, t.prototype.installProgressElement = function() {
                            return this.progressElement.style.width = 0, this.progressElement.style.opacity = 1, document.documentElement.insertBefore(this.progressElement, document.body), this.refresh()
                        }, t.prototype.fadeProgressElement = function(e) {
                            return this.progressElement.style.opacity = 0, setTimeout(e, 1.5 * n)
                        }, t.prototype.uninstallProgressElement = function() {
                            return this.progressElement.parentNode ? document.documentElement.removeChild(this.progressElement) : void 0
                        }, t.prototype.startTrickling = function() {
                            return null != this.trickleInterval ? this.trickleInterval : this.trickleInterval = setInterval(this.trickle, n)
                        }, t.prototype.stopTrickling = function() {
                            return clearInterval(this.trickleInterval), this.trickleInterval = null
                        }, t.prototype.trickle = function() {
                            return this.setValue(this.value + Math.random() / 100)
                        }, t.prototype.refresh = function() {
                            return requestAnimationFrame((e = this, function() {
                                return e.progressElement.style.width = 10 + 90 * e.value + "%"
                            }));
                            var e
                        }, t.prototype.createStylesheetElement = function() {
                            var e;
                            return (e = document.createElement("style")).type = "text/css", e.textContent = this.constructor.defaultCSS, e
                        }, t.prototype.createProgressElement = function() {
                            var e;
                            return (e = document.createElement("div")).className = "turbolinks-progress-bar", e
                        }, t
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.BrowserAdapter = function() {
                        function n(n) {
                            this.controller = n, this.showProgressBar = e(this.showProgressBar, this), this.progressBar = new t.ProgressBar
                        }
                        var i, a, r;
                        return r = t.HttpRequest, i = r.NETWORK_FAILURE, a = r.TIMEOUT_FAILURE, n.prototype.visitProposedToLocationWithAction = function(e, t) {
                            return this.controller.startVisitToLocationWithAction(e, t)
                        }, n.prototype.visitStarted = function(e) {
                            return e.issueRequest(), e.changeHistory(), e.loadCachedSnapshot()
                        }, n.prototype.visitRequestStarted = function(e) {
                            return this.progressBar.setValue(0), e.hasCachedSnapshot() || "restore" !== e.action ? this.showProgressBarAfterDelay() : this.showProgressBar()
                        }, n.prototype.visitRequestProgressed = function(e) {
                            return this.progressBar.setValue(e.progress)
                        }, n.prototype.visitRequestCompleted = function(e) {
                            return e.loadResponse()
                        }, n.prototype.visitRequestFailedWithStatusCode = function(e, t) {
                            switch (t) {
                                case i:
                                case a:
                                    return this.reload();
                                default:
                                    return e.loadResponse()
                            }
                        }, n.prototype.visitRequestFinished = function() {
                            return this.hideProgressBar()
                        }, n.prototype.visitCompleted = function(e) {
                            return e.followRedirect()
                        }, n.prototype.pageInvalidated = function() {
                            return this.reload()
                        }, n.prototype.showProgressBarAfterDelay = function() {
                            return this.progressBarTimeout = setTimeout(this.showProgressBar, this.controller.progressBarDelay)
                        }, n.prototype.showProgressBar = function() {
                            return this.progressBar.show()
                        }, n.prototype.hideProgressBar = function() {
                            return this.progressBar.hide(), clearTimeout(this.progressBarTimeout)
                        }, n.prototype.reload = function() {
                            return window.location.reload()
                        }, n
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.History = function() {
                        function n(t) {
                            this.delegate = t, this.onPageLoad = e(this.onPageLoad, this), this.onPopState = e(this.onPopState, this)
                        }
                        return n.prototype.start = function() {
                            return this.started ? void 0 : (addEventListener("popstate", this.onPopState, !1), addEventListener("load", this.onPageLoad, !1), this.started = !0)
                        }, n.prototype.stop = function() {
                            return this.started ? (removeEventListener("popstate", this.onPopState, !1), removeEventListener("load", this.onPageLoad, !1), this.started = !1) : void 0
                        }, n.prototype.push = function(e, n) {
                            return e = t.Location.wrap(e), this.update("push", e, n)
                        }, n.prototype.replace = function(e, n) {
                            return e = t.Location.wrap(e), this.update("replace", e, n)
                        }, n.prototype.onPopState = function(e) {
                            var n, i, a, r;
                            return this.shouldHandlePopState() && (r = null != (i = e.state) ? i.turbolinks : void 0) ? (n = t.Location.wrap(window.location), a = r.restorationIdentifier, this.delegate.historyPoppedToLocationWithRestorationIdentifier(n, a)) : void 0
                        }, n.prototype.onPageLoad = function() {
                            return t.defer(function(e) {
                                return function() {
                                    return e.pageLoaded = !0
                                }
                            }(this))
                        }, n.prototype.shouldHandlePopState = function() {
                            return this.pageIsLoaded()
                        }, n.prototype.pageIsLoaded = function() {
                            return this.pageLoaded || "complete" === document.readyState
                        }, n.prototype.update = function(e, t, n) {
                            var i;
                            return i = {
                                turbolinks: {
                                    restorationIdentifier: n
                                }
                            }, history[e + "State"](i, null, t)
                        }, n
                    }()
                }.call(this),
                function() {
                    t.HeadDetails = function() {
                        function e(e) {
                            var t, n, i, o, s;
                            for (this.elements = {}, n = 0, o = e.length; o > n; n++)(s = e[n]).nodeType === Node.ELEMENT_NODE && (i = s.outerHTML, (null != (t = this.elements)[i] ? t[i] : t[i] = {
                                type: r(s),
                                tracked: a(s),
                                elements: []
                            }).elements.push(s))
                        }
                        var t, n, i, a, r;
                        return e.fromHeadElement = function(e) {
                            var t;
                            return new this(null != (t = null != e ? e.childNodes : void 0) ? t : [])
                        }, e.prototype.hasElementWithKey = function(e) {
                            return e in this.elements
                        }, e.prototype.getTrackedElementSignature = function() {
                            var e;
                            return function() {
                                var t, n;
                                for (e in n = [], t = this.elements) t[e].tracked && n.push(e);
                                return n
                            }.call(this).join("")
                        }, e.prototype.getScriptElementsNotInDetails = function(e) {
                            return this.getElementsMatchingTypeNotInDetails("script", e)
                        }, e.prototype.getStylesheetElementsNotInDetails = function(e) {
                            return this.getElementsMatchingTypeNotInDetails("stylesheet", e)
                        }, e.prototype.getElementsMatchingTypeNotInDetails = function(e, t) {
                            var n, i, a, r, o, s;
                            for (i in o = [], a = this.elements) s = (r = a[i]).type, n = r.elements, s !== e || t.hasElementWithKey(i) || o.push(n[0]);
                            return o
                        }, e.prototype.getProvisionalElements = function() {
                            var e, t, n, i, a, r, o;
                            for (t in n = [], i = this.elements) o = (a = i[t]).type, r = a.tracked, e = a.elements, null != o || r ? e.length > 1 && n.push.apply(n, e.slice(1)) : n.push.apply(n, e);
                            return n
                        }, e.prototype.getMetaValue = function(e) {
                            var t;
                            return null != (t = this.findMetaElementByName(e)) ? t.getAttribute("content") : void 0
                        }, e.prototype.findMetaElementByName = function(e) {
                            var n, i, a, r;
                            for (a in n = void 0, r = this.elements) i = r[a].elements, t(i[0], e) && (n = i[0]);
                            return n
                        }, r = function(e) {
                            return n(e) ? "script" : i(e) ? "stylesheet" : void 0
                        }, a = function(e) {
                            return "reload" === e.getAttribute("data-turbolinks-track")
                        }, n = function(e) {
                            return "script" === e.tagName.toLowerCase()
                        }, i = function(e) {
                            var t;
                            return "style" === (t = e.tagName.toLowerCase()) || "link" === t && "stylesheet" === e.getAttribute("rel")
                        }, t = function(e, t) {
                            return "meta" === e.tagName.toLowerCase() && e.getAttribute("name") === t
                        }, e
                    }()
                }.call(this),
                function() {
                    t.Snapshot = function() {
                        function e(e, t) {
                            this.headDetails = e, this.bodyElement = t
                        }
                        return e.wrap = function(e) {
                            return e instanceof this ? e : "string" == typeof e ? this.fromHTMLString(e) : this.fromHTMLElement(e)
                        }, e.fromHTMLString = function(e) {
                            var t;
                            return (t = document.createElement("html")).innerHTML = e, this.fromHTMLElement(t)
                        }, e.fromHTMLElement = function(e) {
                            var n, i, a;
                            return i = e.querySelector("head"), n = null != (a = e.querySelector("body")) ? a : document.createElement("body"), new this(t.HeadDetails.fromHeadElement(i), n)
                        }, e.prototype.clone = function() {
                            return new this.constructor(this.headDetails, this.bodyElement.cloneNode(!0))
                        }, e.prototype.getRootLocation = function() {
                            var e, n;
                            return n = null != (e = this.getSetting("root")) ? e : "/", new t.Location(n)
                        }, e.prototype.getCacheControlValue = function() {
                            return this.getSetting("cache-control")
                        }, e.prototype.getElementForAnchor = function(e) {
                            try {
                                return this.bodyElement.querySelector("[id='" + e + "'], a[name='" + e + "']")
                            } catch (t) {}
                        }, e.prototype.getPermanentElements = function() {
                            return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")
                        }, e.prototype.getPermanentElementById = function(e) {
                            return this.bodyElement.querySelector("#" + e + "[data-turbolinks-permanent]")
                        }, e.prototype.getPermanentElementsPresentInSnapshot = function(e) {
                            var t, n, i, a, r;
                            for (r = [], n = 0, i = (a = this.getPermanentElements()).length; i > n; n++) t = a[n], e.getPermanentElementById(t.id) && r.push(t);
                            return r
                        }, e.prototype.findFirstAutofocusableElement = function() {
                            return this.bodyElement.querySelector("[autofocus]")
                        }, e.prototype.hasAnchor = function(e) {
                            return null != this.getElementForAnchor(e)
                        }, e.prototype.isPreviewable = function() {
                            return "no-preview" !== this.getCacheControlValue()
                        }, e.prototype.isCacheable = function() {
                            return "no-cache" !== this.getCacheControlValue()
                        }, e.prototype.isVisitable = function() {
                            return "reload" !== this.getSetting("visit-control")
                        }, e.prototype.getSetting = function(e) {
                            return this.headDetails.getMetaValue("turbolinks-" + e)
                        }, e
                    }()
                }.call(this),
                function() {
                    var e = [].slice;
                    t.Renderer = function() {
                        function t() {}
                        var n;
                        return t.render = function() {
                            var t, n, i;
                            return n = arguments[0], t = arguments[1], (i = function(e, t, n) {
                                n.prototype = e.prototype;
                                var i = new n,
                                    a = e.apply(i, t);
                                return Object(a) === a ? a : i
                            }(this, 3 <= arguments.length ? e.call(arguments, 2) : [], function() {})).delegate = n, i.render(t), i
                        }, t.prototype.renderView = function(e) {
                            return this.delegate.viewWillRender(this.newBody), e(), this.delegate.viewRendered(this.newBody)
                        }, t.prototype.invalidateView = function() {
                            return this.delegate.viewInvalidated()
                        }, t.prototype.createScriptElement = function(e) {
                            var t;
                            return "false" === e.getAttribute("data-turbolinks-eval") ? e : ((t = document.createElement("script")).textContent = e.textContent, t.async = !1, n(t, e), t)
                        }, n = function(e, t) {
                            var n, i, a, r, o, s, l;
                            for (s = [], n = 0, i = (r = t.attributes).length; i > n; n++) a = (o = r[n]).name, l = o.value, s.push(e.setAttribute(a, l));
                            return s
                        }, t
                    }()
                }.call(this),
                function() {
                    var e, n, i = function(e, t) {
                            function n() {
                                this.constructor = e
                            }
                            for (var i in t) a.call(t, i) && (e[i] = t[i]);
                            return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
                        },
                        a = {}.hasOwnProperty;
                    t.SnapshotRenderer = function(t) {
                        function a(e, t, n) {
                            this.currentSnapshot = e, this.newSnapshot = t, this.isPreview = n, this.currentHeadDetails = this.currentSnapshot.headDetails, this.newHeadDetails = this.newSnapshot.headDetails, this.currentBody = this.currentSnapshot.bodyElement, this.newBody = this.newSnapshot.bodyElement
                        }
                        return i(a, t), a.prototype.render = function(e) {
                            return this.shouldRender() ? (this.mergeHead(), this.renderView((t = this, function() {
                                return t.replaceBody(), t.isPreview || t.focusFirstAutofocusableElement(), e()
                            }))) : this.invalidateView();
                            var t
                        }, a.prototype.mergeHead = function() {
                            return this.copyNewHeadStylesheetElements(), this.copyNewHeadScriptElements(), this.removeCurrentHeadProvisionalElements(), this.copyNewHeadProvisionalElements()
                        }, a.prototype.replaceBody = function() {
                            var e;
                            return e = this.relocateCurrentBodyPermanentElements(), this.activateNewBodyScriptElements(), this.assignNewBody(), this.replacePlaceholderElementsWithClonedPermanentElements(e)
                        }, a.prototype.shouldRender = function() {
                            return this.newSnapshot.isVisitable() && this.trackedElementsAreIdentical()
                        }, a.prototype.trackedElementsAreIdentical = function() {
                            return this.currentHeadDetails.getTrackedElementSignature() === this.newHeadDetails.getTrackedElementSignature()
                        }, a.prototype.copyNewHeadStylesheetElements = function() {
                            var e, t, n, i, a;
                            for (a = [], t = 0, n = (i = this.getNewHeadStylesheetElements()).length; n > t; t++) e = i[t], a.push(document.head.appendChild(e));
                            return a
                        }, a.prototype.copyNewHeadScriptElements = function() {
                            var e, t, n, i, a;
                            for (a = [], t = 0, n = (i = this.getNewHeadScriptElements()).length; n > t; t++) e = i[t], a.push(document.head.appendChild(this.createScriptElement(e)));
                            return a
                        }, a.prototype.removeCurrentHeadProvisionalElements = function() {
                            var e, t, n, i, a;
                            for (a = [], t = 0, n = (i = this.getCurrentHeadProvisionalElements()).length; n > t; t++) e = i[t], a.push(document.head.removeChild(e));
                            return a
                        }, a.prototype.copyNewHeadProvisionalElements = function() {
                            var e, t, n, i, a;
                            for (a = [], t = 0, n = (i = this.getNewHeadProvisionalElements()).length; n > t; t++) e = i[t], a.push(document.head.appendChild(e));
                            return a
                        }, a.prototype.relocateCurrentBodyPermanentElements = function() {
                            var t, i, a, r, o, s, l;
                            for (l = [], t = 0, i = (s = this.getCurrentBodyPermanentElements()).length; i > t; t++) r = s[t], o = e(r), a = this.newSnapshot.getPermanentElementById(r.id), n(r, o.element), n(a, r), l.push(o);
                            return l
                        }, a.prototype.replacePlaceholderElementsWithClonedPermanentElements = function(e) {
                            var t, i, a, r, o, s;
                            for (s = [], a = 0, r = e.length; r > a; a++) i = (o = e[a]).element, t = o.permanentElement.cloneNode(!0), s.push(n(i, t));
                            return s
                        }, a.prototype.activateNewBodyScriptElements = function() {
                            var e, t, i, a, r, o;
                            for (o = [], t = 0, a = (r = this.getNewBodyScriptElements()).length; a > t; t++) i = r[t], e = this.createScriptElement(i), o.push(n(i, e));
                            return o
                        }, a.prototype.assignNewBody = function() {
                            return document.body = this.newBody
                        }, a.prototype.focusFirstAutofocusableElement = function() {
                            var e;
                            return null != (e = this.newSnapshot.findFirstAutofocusableElement()) ? e.focus() : void 0
                        }, a.prototype.getNewHeadStylesheetElements = function() {
                            return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)
                        }, a.prototype.getNewHeadScriptElements = function() {
                            return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)
                        }, a.prototype.getCurrentHeadProvisionalElements = function() {
                            return this.currentHeadDetails.getProvisionalElements()
                        }, a.prototype.getNewHeadProvisionalElements = function() {
                            return this.newHeadDetails.getProvisionalElements()
                        }, a.prototype.getCurrentBodyPermanentElements = function() {
                            return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)
                        }, a.prototype.getNewBodyScriptElements = function() {
                            return this.newBody.querySelectorAll("script")
                        }, a
                    }(t.Renderer), e = function(e) {
                        var t;
                        return (t = document.createElement("meta")).setAttribute("name", "turbolinks-permanent-placeholder"), t.setAttribute("content", e.id), {
                            element: t,
                            permanentElement: e
                        }
                    }, n = function(e, t) {
                        var n;
                        return (n = e.parentNode) ? n.replaceChild(t, e) : void 0
                    }
                }.call(this),
                function() {
                    var e = function(e, t) {
                            function i() {
                                this.constructor = e
                            }
                            for (var a in t) n.call(t, a) && (e[a] = t[a]);
                            return i.prototype = t.prototype, e.prototype = new i, e.__super__ = t.prototype, e
                        },
                        n = {}.hasOwnProperty;
                    t.ErrorRenderer = function(t) {
                        function n(e) {
                            var t;
                            (t = document.createElement("html")).innerHTML = e, this.newHead = t.querySelector("head"), this.newBody = t.querySelector("body")
                        }
                        return e(n, t), n.prototype.render = function(e) {
                            return this.renderView((t = this, function() {
                                return t.replaceHeadAndBody(), t.activateBodyScriptElements(), e()
                            }));
                            var t
                        }, n.prototype.replaceHeadAndBody = function() {
                            var e, t;
                            return t = document.head, e = document.body, t.parentNode.replaceChild(this.newHead, t), e.parentNode.replaceChild(this.newBody, e)
                        }, n.prototype.activateBodyScriptElements = function() {
                            var e, t, n, i, a, r;
                            for (r = [], t = 0, n = (i = this.getScriptElements()).length; n > t; t++) a = i[t], e = this.createScriptElement(a), r.push(a.parentNode.replaceChild(e, a));
                            return r
                        }, n.prototype.getScriptElements = function() {
                            return document.documentElement.querySelectorAll("script")
                        }, n
                    }(t.Renderer)
                }.call(this),
                function() {
                    t.View = function() {
                        function e(e) {
                            this.delegate = e, this.htmlElement = document.documentElement
                        }
                        return e.prototype.getRootLocation = function() {
                            return this.getSnapshot().getRootLocation()
                        }, e.prototype.getElementForAnchor = function(e) {
                            return this.getSnapshot().getElementForAnchor(e)
                        }, e.prototype.getSnapshot = function() {
                            return t.Snapshot.fromHTMLElement(this.htmlElement)
                        }, e.prototype.render = function(e, t) {
                            var n, i, a;
                            return a = e.snapshot, n = e.error, i = e.isPreview, this.markAsPreview(i), null != a ? this.renderSnapshot(a, i, t) : this.renderError(n, t)
                        }, e.prototype.markAsPreview = function(e) {
                            return e ? this.htmlElement.setAttribute("data-turbolinks-preview", "") : this.htmlElement.removeAttribute("data-turbolinks-preview")
                        }, e.prototype.renderSnapshot = function(e, n, i) {
                            return t.SnapshotRenderer.render(this.delegate, i, this.getSnapshot(), t.Snapshot.wrap(e), n)
                        }, e.prototype.renderError = function(e, n) {
                            return t.ErrorRenderer.render(this.delegate, n, e)
                        }, e
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.ScrollManager = function() {
                        function n(n) {
                            this.delegate = n, this.onScroll = e(this.onScroll, this), this.onScroll = t.throttle(this.onScroll)
                        }
                        return n.prototype.start = function() {
                            return this.started ? void 0 : (addEventListener("scroll", this.onScroll, !1), this.onScroll(), this.started = !0)
                        }, n.prototype.stop = function() {
                            return this.started ? (removeEventListener("scroll", this.onScroll, !1), this.started = !1) : void 0
                        }, n.prototype.scrollToElement = function(e) {
                            return e.scrollIntoView()
                        }, n.prototype.scrollToPosition = function(e) {
                            var t, n;
                            return t = e.x, n = e.y, window.scrollTo(t, n)
                        }, n.prototype.onScroll = function() {
                            return this.updatePosition({
                                x: window.pageXOffset,
                                y: window.pageYOffset
                            })
                        }, n.prototype.updatePosition = function(e) {
                            var t;
                            return this.position = e, null != (t = this.delegate) ? t.scrollPositionChanged(this.position) : void 0
                        }, n
                    }()
                }.call(this),
                function() {
                    t.SnapshotCache = function() {
                        function e(e) {
                            this.size = e, this.keys = [], this.snapshots = {}
                        }
                        var n;
                        return e.prototype.has = function(e) {
                            return n(e) in this.snapshots
                        }, e.prototype.get = function(e) {
                            var t;
                            if (this.has(e)) return t = this.read(e), this.touch(e), t
                        }, e.prototype.put = function(e, t) {
                            return this.write(e, t), this.touch(e), t
                        }, e.prototype.read = function(e) {
                            var t;
                            return t = n(e), this.snapshots[t]
                        }, e.prototype.write = function(e, t) {
                            var i;
                            return i = n(e), this.snapshots[i] = t
                        }, e.prototype.touch = function(e) {
                            var t, i;
                            return i = n(e), (t = this.keys.indexOf(i)) > -1 && this.keys.splice(t, 1), this.keys.unshift(i), this.trim()
                        }, e.prototype.trim = function() {
                            var e, t, n, i, a;
                            for (a = [], e = 0, n = (i = this.keys.splice(this.size)).length; n > e; e++) t = i[e], a.push(delete this.snapshots[t]);
                            return a
                        }, n = function(e) {
                            return t.Location.wrap(e).toCacheKey()
                        }, e
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.Visit = function() {
                        function n(n, i, a) {
                            this.controller = n, this.action = a, this.performScroll = e(this.performScroll, this), this.identifier = t.uuid(), this.location = t.Location.wrap(i), this.adapter = this.controller.adapter, this.state = "initialized", this.timingMetrics = {}
                        }
                        var i;
                        return n.prototype.start = function() {
                            return "initialized" === this.state ? (this.recordTimingMetric("visitStart"), this.state = "started", this.adapter.visitStarted(this)) : void 0
                        }, n.prototype.cancel = function() {
                            var e;
                            return "started" === this.state ? (null != (e = this.request) && e.cancel(), this.cancelRender(), this.state = "canceled") : void 0
                        }, n.prototype.complete = function() {
                            var e;
                            return "started" === this.state ? (this.recordTimingMetric("visitEnd"), this.state = "completed", "function" == typeof(e = this.adapter).visitCompleted && e.visitCompleted(this), this.controller.visitCompleted(this)) : void 0
                        }, n.prototype.fail = function() {
                            var e;
                            return "started" === this.state ? (this.state = "failed", "function" == typeof(e = this.adapter).visitFailed ? e.visitFailed(this) : void 0) : void 0
                        }, n.prototype.changeHistory = function() {
                            var e, t;
                            return this.historyChanged ? void 0 : (e = this.location.isEqualTo(this.referrer) ? "replace" : this.action, t = i(e), this.controller[t](this.location, this.restorationIdentifier), this.historyChanged = !0)
                        }, n.prototype.issueRequest = function() {
                            return this.shouldIssueRequest() && null == this.request ? (this.progress = 0, this.request = new t.HttpRequest(this, this.location, this.referrer), this.request.send()) : void 0
                        }, n.prototype.getCachedSnapshot = function() {
                            var e;
                            return !(e = this.controller.getCachedSnapshotForLocation(this.location)) || null != this.location.anchor && !e.hasAnchor(this.location.anchor) || "restore" !== this.action && !e.isPreviewable() ? void 0 : e
                        }, n.prototype.hasCachedSnapshot = function() {
                            return null != this.getCachedSnapshot()
                        }, n.prototype.loadCachedSnapshot = function() {
                            var e, t;
                            return (t = this.getCachedSnapshot()) ? (e = this.shouldIssueRequest(), this.render(function() {
                                var n;
                                return this.cacheSnapshot(), this.controller.render({
                                    snapshot: t,
                                    isPreview: e
                                }, this.performScroll), "function" == typeof(n = this.adapter).visitRendered && n.visitRendered(this), e ? void 0 : this.complete()
                            })) : void 0
                        }, n.prototype.loadResponse = function() {
                            return null != this.response ? this.render(function() {
                                var e, t;
                                return this.cacheSnapshot(), this.request.failed ? (this.controller.render({
                                    error: this.response
                                }, this.performScroll), "function" == typeof(e = this.adapter).visitRendered && e.visitRendered(this), this.fail()) : (this.controller.render({
                                    snapshot: this.response
                                }, this.performScroll), "function" == typeof(t = this.adapter).visitRendered && t.visitRendered(this), this.complete())
                            }) : void 0
                        }, n.prototype.followRedirect = function() {
                            return this.redirectedToLocation && !this.followedRedirect ? (this.location = this.redirectedToLocation, this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier), this.followedRedirect = !0) : void 0
                        }, n.prototype.requestStarted = function() {
                            var e;
                            return this.recordTimingMetric("requestStart"), "function" == typeof(e = this.adapter).visitRequestStarted ? e.visitRequestStarted(this) : void 0
                        }, n.prototype.requestProgressed = function(e) {
                            var t;
                            return this.progress = e, "function" == typeof(t = this.adapter).visitRequestProgressed ? t.visitRequestProgressed(this) : void 0
                        }, n.prototype.requestCompletedWithResponse = function(e, n) {
                            return this.response = e, null != n && (this.redirectedToLocation = t.Location.wrap(n)), this.adapter.visitRequestCompleted(this)
                        }, n.prototype.requestFailedWithStatusCode = function(e, t) {
                            return this.response = t, this.adapter.visitRequestFailedWithStatusCode(this, e)
                        }, n.prototype.requestFinished = function() {
                            var e;
                            return this.recordTimingMetric("requestEnd"), "function" == typeof(e = this.adapter).visitRequestFinished ? e.visitRequestFinished(this) : void 0
                        }, n.prototype.performScroll = function() {
                            return this.scrolled ? void 0 : ("restore" === this.action ? this.scrollToRestoredPosition() || this.scrollToTop() : this.scrollToAnchor() || this.scrollToTop(), this.scrolled = !0)
                        }, n.prototype.scrollToRestoredPosition = function() {
                            var e, t;
                            return null != (e = null != (t = this.restorationData) ? t.scrollPosition : void 0) ? (this.controller.scrollToPosition(e), !0) : void 0
                        }, n.prototype.scrollToAnchor = function() {
                            return null != this.location.anchor ? (this.controller.scrollToAnchor(this.location.anchor), !0) : void 0
                        }, n.prototype.scrollToTop = function() {
                            return this.controller.scrollToPosition({
                                x: 0,
                                y: 0
                            })
                        }, n.prototype.recordTimingMetric = function(e) {
                            var t;
                            return null != (t = this.timingMetrics)[e] ? t[e] : t[e] = (new Date).getTime()
                        }, n.prototype.getTimingMetrics = function() {
                            return t.copyObject(this.timingMetrics)
                        }, i = function(e) {
                            switch (e) {
                                case "replace":
                                    return "replaceHistoryWithLocationAndRestorationIdentifier";
                                case "advance":
                                case "restore":
                                    return "pushHistoryWithLocationAndRestorationIdentifier"
                            }
                        }, n.prototype.shouldIssueRequest = function() {
                            return "restore" !== this.action || !this.hasCachedSnapshot()
                        }, n.prototype.cacheSnapshot = function() {
                            return this.snapshotCached ? void 0 : (this.controller.cacheSnapshot(), this.snapshotCached = !0)
                        }, n.prototype.render = function(e) {
                            return this.cancelRender(), this.frame = requestAnimationFrame((t = this, function() {
                                return t.frame = null, e.call(t)
                            }));
                            var t
                        }, n.prototype.cancelRender = function() {
                            return this.frame ? cancelAnimationFrame(this.frame) : void 0
                        }, n
                    }()
                }.call(this),
                function() {
                    var e = function(e, t) {
                        return function() {
                            return e.apply(t, arguments)
                        }
                    };
                    t.Controller = function() {
                        function n() {
                            this.clickBubbled = e(this.clickBubbled, this), this.clickCaptured = e(this.clickCaptured, this), this.pageLoaded = e(this.pageLoaded, this), this.history = new t.History(this), this.view = new t.View(this), this.scrollManager = new t.ScrollManager(this), this.restorationData = {}, this.clearCache(), this.setProgressBarDelay(500)
                        }
                        return n.prototype.start = function() {
                            return t.supported && !this.started ? (addEventListener("click", this.clickCaptured, !0), addEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.start(), this.startHistory(), this.started = !0, this.enabled = !0) : void 0
                        }, n.prototype.disable = function() {
                            return this.enabled = !1
                        }, n.prototype.stop = function() {
                            return this.started ? (removeEventListener("click", this.clickCaptured, !0), removeEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.stop(), this.stopHistory(), this.started = !1) : void 0
                        }, n.prototype.clearCache = function() {
                            return this.cache = new t.SnapshotCache(10)
                        }, n.prototype.visit = function(e, n) {
                            var i, a;
                            return null == n && (n = {}), e = t.Location.wrap(e), this.applicationAllowsVisitingLocation(e) ? this.locationIsVisitable(e) ? (i = null != (a = n.action) ? a : "advance", this.adapter.visitProposedToLocationWithAction(e, i)) : window.location = e : void 0
                        }, n.prototype.startVisitToLocationWithAction = function(e, n, i) {
                            var a;
                            return t.supported ? (a = this.getRestorationDataForIdentifier(i), this.startVisit(e, n, {
                                restorationData: a
                            })) : window.location = e
                        }, n.prototype.setProgressBarDelay = function(e) {
                            return this.progressBarDelay = e
                        }, n.prototype.startHistory = function() {
                            return this.location = t.Location.wrap(window.location), this.restorationIdentifier = t.uuid(), this.history.start(), this.history.replace(this.location, this.restorationIdentifier)
                        }, n.prototype.stopHistory = function() {
                            return this.history.stop()
                        }, n.prototype.pushHistoryWithLocationAndRestorationIdentifier = function(e, n) {
                            return this.restorationIdentifier = n, this.location = t.Location.wrap(e), this.history.push(this.location, this.restorationIdentifier)
                        }, n.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function(e, n) {
                            return this.restorationIdentifier = n, this.location = t.Location.wrap(e), this.history.replace(this.location, this.restorationIdentifier)
                        }, n.prototype.historyPoppedToLocationWithRestorationIdentifier = function(e, n) {
                            var i;
                            return this.restorationIdentifier = n, this.enabled ? (i = this.getRestorationDataForIdentifier(this.restorationIdentifier), this.startVisit(e, "restore", {
                                restorationIdentifier: this.restorationIdentifier,
                                restorationData: i,
                                historyChanged: !0
                            }), this.location = t.Location.wrap(e)) : this.adapter.pageInvalidated()
                        }, n.prototype.getCachedSnapshotForLocation = function(e) {
                            var t;
                            return null != (t = this.cache.get(e)) ? t.clone() : void 0
                        }, n.prototype.shouldCacheSnapshot = function() {
                            return this.view.getSnapshot().isCacheable()
                        }, n.prototype.cacheSnapshot = function() {
                            var e, n;
                            return this.shouldCacheSnapshot() ? (this.notifyApplicationBeforeCachingSnapshot(), n = this.view.getSnapshot(), e = this.lastRenderedLocation, t.defer(function(t) {
                                return function() {
                                    return t.cache.put(e, n.clone())
                                }
                            }(this))) : void 0
                        }, n.prototype.scrollToAnchor = function(e) {
                            var t;
                            return (t = this.view.getElementForAnchor(e)) ? this.scrollToElement(t) : this.scrollToPosition({
                                x: 0,
                                y: 0
                            })
                        }, n.prototype.scrollToElement = function(e) {
                            return this.scrollManager.scrollToElement(e)
                        }, n.prototype.scrollToPosition = function(e) {
                            return this.scrollManager.scrollToPosition(e)
                        }, n.prototype.scrollPositionChanged = function(e) {
                            return this.getCurrentRestorationData().scrollPosition = e
                        }, n.prototype.render = function(e, t) {
                            return this.view.render(e, t)
                        }, n.prototype.viewInvalidated = function() {
                            return this.adapter.pageInvalidated()
                        }, n.prototype.viewWillRender = function(e) {
                            return this.notifyApplicationBeforeRender(e)
                        }, n.prototype.viewRendered = function() {
                            return this.lastRenderedLocation = this.currentVisit.location, this.notifyApplicationAfterRender()
                        }, n.prototype.pageLoaded = function() {
                            return this.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad()
                        }, n.prototype.clickCaptured = function() {
                            return removeEventListener("click", this.clickBubbled, !1), addEventListener("click", this.clickBubbled, !1)
                        }, n.prototype.clickBubbled = function(e) {
                            var t, n, i;
                            return this.enabled && this.clickEventIsSignificant(e) && (n = this.getVisitableLinkForNode(e.target)) && (i = this.getVisitableLocationForLink(n)) && this.applicationAllowsFollowingLinkToLocation(n, i) ? (e.preventDefault(), t = this.getActionForLink(n), this.visit(i, {
                                action: t
                            })) : void 0
                        }, n.prototype.applicationAllowsFollowingLinkToLocation = function(e, t) {
                            return !this.notifyApplicationAfterClickingLinkToLocation(e, t).defaultPrevented
                        }, n.prototype.applicationAllowsVisitingLocation = function(e) {
                            return !this.notifyApplicationBeforeVisitingLocation(e).defaultPrevented
                        }, n.prototype.notifyApplicationAfterClickingLinkToLocation = function(e, n) {
                            return t.dispatch("turbolinks:click", {
                                target: e,
                                data: {
                                    url: n.absoluteURL
                                },
                                cancelable: !0
                            })
                        }, n.prototype.notifyApplicationBeforeVisitingLocation = function(e) {
                            return t.dispatch("turbolinks:before-visit", {
                                data: {
                                    url: e.absoluteURL
                                },
                                cancelable: !0
                            })
                        }, n.prototype.notifyApplicationAfterVisitingLocation = function(e) {
                            return t.dispatch("turbolinks:visit", {
                                data: {
                                    url: e.absoluteURL
                                }
                            })
                        }, n.prototype.notifyApplicationBeforeCachingSnapshot = function() {
                            return t.dispatch("turbolinks:before-cache")
                        }, n.prototype.notifyApplicationBeforeRender = function(e) {
                            return t.dispatch("turbolinks:before-render", {
                                data: {
                                    newBody: e
                                }
                            })
                        }, n.prototype.notifyApplicationAfterRender = function() {
                            return t.dispatch("turbolinks:render")
                        }, n.prototype.notifyApplicationAfterPageLoad = function(e) {
                            return null == e && (e = {}), t.dispatch("turbolinks:load", {
                                data: {
                                    url: this.location.absoluteURL,
                                    timing: e
                                }
                            })
                        }, n.prototype.startVisit = function(e, t, n) {
                            var i;
                            return null != (i = this.currentVisit) && i.cancel(), this.currentVisit = this.createVisit(e, t, n), this.currentVisit.start(), this.notifyApplicationAfterVisitingLocation(e)
                        }, n.prototype.createVisit = function(e, n, i) {
                            var a, r, o, s, l;
                            return s = (r = null != i ? i : {}).restorationIdentifier, o = r.restorationData, a = r.historyChanged, (l = new t.Visit(this, e, n)).restorationIdentifier = null != s ? s : t.uuid(), l.restorationData = t.copyObject(o), l.historyChanged = a, l.referrer = this.location, l
                        }, n.prototype.visitCompleted = function(e) {
                            return this.notifyApplicationAfterPageLoad(e.getTimingMetrics())
                        }, n.prototype.clickEventIsSignificant = function(e) {
                            return !(e.defaultPrevented || e.target.isContentEditable || e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
                        }, n.prototype.getVisitableLinkForNode = function(e) {
                            return this.nodeIsVisitable(e) ? t.closest(e, "a[href]:not([target]):not([download])") : void 0
                        }, n.prototype.getVisitableLocationForLink = function(e) {
                            var n;
                            return n = new t.Location(e.getAttribute("href")), this.locationIsVisitable(n) ? n : void 0
                        }, n.prototype.getActionForLink = function(e) {
                            var t;
                            return null != (t = e.getAttribute("data-turbolinks-action")) ? t : "advance"
                        }, n.prototype.nodeIsVisitable = function(e) {
                            var n;
                            return !(n = t.closest(e, "[data-turbolinks]")) || "false" !== n.getAttribute("data-turbolinks")
                        }, n.prototype.locationIsVisitable = function(e) {
                            return e.isPrefixedBy(this.view.getRootLocation()) && e.isHTML()
                        }, n.prototype.getCurrentRestorationData = function() {
                            return this.getRestorationDataForIdentifier(this.restorationIdentifier)
                        }, n.prototype.getRestorationDataForIdentifier = function(e) {
                            var t;
                            return null != (t = this.restorationData)[e] ? t[e] : t[e] = {}
                        }, n
                    }()
                }.call(this),
                function() {
                    ! function() {
                        var e, t;
                        if ((e = t = document.currentScript) && !t.hasAttribute("data-turbolinks-suppress-warning"))
                            for (; e = e.parentNode;)
                                if (e === document.body) return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s", t.outerHTML)
                    }()
                }.call(this),
                function() {
                    var e, n, i;
                    t.start = function() {
                        return n() ? (null == t.controller && (t.controller = e()), t.controller.start()) : void 0
                    }, n = function() {
                        return null == window.Turbolinks && (window.Turbolinks = t), i()
                    }, e = function() {
                        var e;
                        return (e = new t.Controller).adapter = new t.BrowserAdapter(e), e
                    }, (i = function() {
                        return window.Turbolinks === t
                    })() && t.start()
                }.call(this)
        }).call(this), "object" == typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd && define(t)
    }.call(this),
    /**
     * Timeago is a jQuery plugin that makes it easy to support automatically
     * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
     *
     * @name timeago
     * @version 1.4.1
     * @requires jQuery v1.2.3+
     * @author Ryan McGeary
     * @license MIT License - http://www.opensource.org/licenses/mit-license.php
     *
     * For usage and examples, visit:
     * http://timeago.yarp.com/
     *
     * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
     */
    function(e) {
        function t() {
            var t = n(this);
            return isNaN(t.datetime) || e(this).text(i(t.datetime)), this
        }

        function n(t) {
            if (!(t = e(t)).data("timeago")) {
                t.data("timeago", {
                    datetime: r.datetime(t)
                });
                var n = e.trim(t.text());
                n.length > 0 && t.attr("title", n)
            }
            return t.data("timeago")
        }

        function i(e) {
            return r.inWords(a(e))
        }

        function a(e) {
            return (new Date).getTime() - e.getTime()
        }
        e.timeago = function(t) {
            return t instanceof Date ? i(t) : i("string" == typeof t ? e.timeago.parse(t) : e.timeago.datetime(t))
        };
        var r = e.timeago;
        e.extend(e.timeago, {
            settings: {
                refreshMillis: 6e4,
                allowFuture: !1,
                strings: {
                    prefixAgo: null,
                    prefixFromNow: null,
                    suffixAgo: "ago",
                    suffixFromNow: "from now",
                    seconds: "less than a minute",
                    minute: "about a minute",
                    minutes: "%d minutes",
                    hour: "about an hour",
                    hours: "about %d hours",
                    day: "a day",
                    days: "%d days",
                    month: "about a month",
                    months: "%d months",
                    year: "about a year",
                    years: "%d years",
                    numbers: []
                }
            },
            inWords: function(t) {
                function n(n, a) {
                    var r = e.isFunction(n) ? n(a, t) : n,
                        o = i.numbers && i.numbers[a] || a;
                    return r.replace(/%d/i, o)
                }
                var i = this.settings.strings,
                    a = i.prefixAgo,
                    r = i.suffixAgo;
                this.settings.allowFuture && (t < 0 && (a = i.prefixFromNow, r = i.suffixFromNow), t = Math.abs(t));
                var o = t / 1e3,
                    s = o / 60,
                    l = s / 60,
                    u = l / 24,
                    d = u / 365,
                    c = o < 45 && n(i.seconds, Math.round(o)) || o < 90 && n(i.minute, 1) || s < 45 && n(i.minutes, Math.round(s)) || s < 90 && n(i.hour, 1) || l < 24 && n(i.hours, Math.round(l)) || l < 48 && n(i.day, 1) || u < 30 && n(i.days, Math.floor(u)) || u < 60 && n(i.month, 1) || u < 365 && n(i.months, Math.floor(u / 30)) || d < 2 && n(i.year, 1) || n(i.years, Math.floor(d));
                return e.trim([a, c, r].join(" "))
            },
            parse: function(t) {
                var n = e.trim(t);
                return n = (n = (n = (n = n.replace(/\.\d\d\d+/, "")).replace(/-/, "/").replace(/-/, "/")).replace(/T/, " ").replace(/Z/, " UTC")).replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"), new Date(n)
            },
            datetime: function(t) {
                var n = "time" === e(t).get(0).tagName.toLowerCase() ? e(t).attr("datetime") : e(t).attr("title");
                return r.parse(n)
            }
        }), e.fn.timeago = function() {
            var e = this;
            e.each(t);
            var n = r.settings;
            return n.refreshMillis > 0 && setInterval(function() {
                e.each(t)
            }, n.refreshMillis), e
        }, document.createElement("abbr"), document.createElement("time")
    }(jQuery),
    function(e) {
        window.NestedFormEvents = function() {
            this.addFields = e.proxy(this.addFields, this), this.removeFields = e.proxy(this.removeFields, this)
        }, NestedFormEvents.prototype = {
            addFields: function(t) {
                var n = t.currentTarget,
                    i = e(n).data("association"),
                    a = e("#" + e(n).data("blueprint-id")).data("blueprint"),
                    r = (e(n).closest(".fields").closestChild("input, textarea, select").eq(0).attr("name") || "").replace(new RegExp("[[a-z_]+]$"), "");
                if (r)
                    for (var o = r.match(/[a-z_]+_attributes(?=\]\[(new_)?\d+\])/g) || [], s = r.match(/[0-9]+/g) || [], l = 0; l < o.length; l++) s[l] && (a = (a = a.replace(new RegExp("(_" + o[l] + ")_.+?_", "g"), "$1_" + s[l] + "_")).replace(new RegExp("(\\[" + o[l] + "\\])\\[.+?\\]", "g"), "$1[" + s[l] + "]"));
                var u = new RegExp("new_" + i, "g"),
                    d = this.newId();
                a = e.trim(a.replace(u, d));
                var c = this.insertFields(a, i, n);
                return c.trigger({
                    type: "nested:fieldAdded",
                    field: c
                }).trigger({
                    type: "nested:fieldAdded:" + i,
                    field: c
                }), !1
            },
            newId: function() {
                return (new Date).getTime()
            },
            insertFields: function(t, n, i) {
                var a = e(i).data("target");
                return a ? e(t).appendTo(e(a)) : e(t).insertBefore(i)
            },
            removeFields: function(t) {
                var n = e(t.currentTarget),
                    i = n.data("association");
                n.prev("input[type=hidden]").val("1");
                var a = n.closest(".fields");
                return a.hide(), a.trigger({
                    type: "nested:fieldRemoved",
                    field: a
                }).trigger({
                    type: "nested:fieldRemoved:" + i,
                    field: a
                }), !1
            }
        }, window.nestedFormEvents = new NestedFormEvents, e(document).delegate("form a.add_nested_fields", "click", nestedFormEvents.addFields).delegate("form a.remove_nested_fields", "click", nestedFormEvents.removeFields)
    }(jQuery),
    /*
     * Copyright 2011, Tobias Lindig
     *
     * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
     * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
     *
     */
    function(e) {
        e.fn.closestChild = function(t) {
            if (t && "" != t) {
                var n = [];
                for (n.push(this); n.length > 0;)
                    for (var i = n.shift().children(), a = 0; a < i.length; ++a) {
                        var r = e(i[a]);
                        if (r.is(t)) return r;
                        n.push(r)
                    }
            }
            return e()
        }
    }(jQuery);
var wloc = window.location.toString(); - 1 !== wloc.indexOf("api.") && wloc.indexOf("api.") < 20 && -1 === wloc.indexOf("charts") && -1 === wloc.indexOf("plugins") && (-1 !== wloc.indexOf("-api.") ? window.location = wloc.replace("api", "web") : window.location = wloc.replace("api", "www")),
    /*
     * Copyright (c) 2010 Lyconic, LLC.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    function(e) {
        function t(t, i, a, r) {
            l = {
                dataType: "json"
            }, 1 === arguments.length && "string" != typeof arguments[0] ? "url" in (l = e.extend(l, t)) && "data" in l && n(l.url, l.data) : (e.isFunction(i) && (r = a, a = i, i = null), t = n(t, i), l = e.extend(l, {
                url: t,
                data: i,
                success: a,
                error: r
            }))
        }

        function n(e, t) {
            var n, i, a;
            for (n in t) a = t[n], (i = e.replace("{" + n + "}", a)) != e && (e = i, delete t[n]);
            return e
        }

        function i(t) {
            return t.type = t.type || "GET", "string" != typeof t.data && null != t.data && (t.data = e.param(t.data)), t.data = t.data || "", e.restSetup.csrf && !e.isEmptyObject(e.restSetup.csrf) && (/^(get)$/i.test(t.type) || /(authenticity_token=)/i.test(t.data) || (t.data += (t.data ? "&" : "") + e.restSetup.csrfParam + "=" + $restSetup.csrfToken)), /^(get|post)$/i.test(t.type) || (t.data += (t.data ? "&" : "") + e.restSetup.methodParam + "=" + t.type.toLowerCase(), t.type = "POST"), u.call(this, t)
        }

        function a() {
            return t.apply(this, arguments), e.extend(l, {
                type: "GET"
            }), e.ajax(l)
        }

        function r() {
            return t.apply(this, arguments), e.extend(l, {
                type: "POST"
            }), e.ajax(l)
        }

        function o() {
            return t.apply(this, arguments), e.extend(l, {
                type: "PUT"
            }), e.ajax(l)
        }

        function s() {
            return t.apply(this, arguments), e.extend(l, {
                type: "DELETE"
            }), e.ajax(l)
        }
        e.restSetup = {
            methodParam: "_method"
        }, e(document).on("page:load ready", function() {
            e.extend(e.restSetup, {
                csrfParam: e("meta[name=csrf-param]").attr("content"),
                csrfToken: e("meta[name=csrf-token]").attr("content")
            })
        });
        var l, u = e.ajax;
        e.extend({
            ajax: i,
            read: a,
            create: r,
            update: o,
            destroy: s
        })
    }(jQuery),
    /*
     * validate.js 1.0.1
     * Copyright (c) 2011 Rick Harrison, http://rickharrison.me
     * validate.js is open sourced under the MIT license.
     * Portions of validate.js are inspired by CodeIgniter.
     * http://rickharrison.github.com/validate.js
     */
    function(e, t, n) {
        var i = {
                required: "The %s field is required.",
                matches: "The %s field does not match the %s field.",
                valid_email: "The %s field must contain a valid email address.",
                min_length: "The %s field must be at least %s characters in length.",
                max_length: "The %s field must not exceed %s characters in length.",
                exact_length: "The %s field must be exactly %s characters in length.",
                greater_than: "The %s field must contain a number greater than %s.",
                less_than: "The %s field must contain a number less than %s.",
                alpha: "The %s field must only contain alphabetical characters.",
                alpha_numeric: "The %s field must only contain alpha-numeric characters.",
                alpha_dash: "The %s field must only contain alpha-numeric characters, underscores, and dashes.",
                numeric: "The %s field must contain only numbers.",
                integer: "The %s field must contain an integer."
            },
            a = function() {},
            r = /^(.+)\[(.+)\]$/,
            o = /^[0-9]+$/,
            s = /^\-?[0-9]+$/,
            l = /^\-?[0-9]*\.?[0-9]+$/,
            u = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
            d = /^[a-z]+$/i,
            c = /^[a-z0-9]+$/i,
            h = /^[a-z0-9_-]+$/i,
            p = function(e, n, i) {
                for (this.callback = i || a, this.errors = [], this.fields = {}, this.form = t.forms[e] || {}, this.messages = {}, this.handlers = {}, e = 0, i = n.length; e < i; e++) {
                    var r = n[e];
                    r.name && r.rules && (this.fields[r.name] = {
                        name: r.name,
                        display: r.display || r.name,
                        rules: r.rules,
                        type: null,
                        value: null,
                        checked: null
                    })
                }
                this.form.onsubmit = function(e) {
                    return function(t) {
                        try {
                            return e._validateForm(t)
                        } catch (r) {}
                    }
                }(this)
            };
        p.prototype.setMessage = function(e, t) {
            return this.messages[e] = t, this
        }, p.prototype.registerCallback = function(e, t) {
            return e && "string" == typeof e && t && "function" == typeof t && (this.handlers[e] = t), this
        }, p.prototype._validateForm = function(e) {
            for (var t in this.errors = [], this.fields)
                if (this.fields.hasOwnProperty(t)) {
                    var i = this.fields[t] || {},
                        a = this.form[i.name];
                    a && a !== n && (i.type = a.type, i.value = a.value, i.checked = a.checked), this._validateField(i)
                } if ("function" == typeof this.callback && this.callback(this.errors, e), this.errors.length > 0) {
                if (!e || !e.preventDefault) return !1;
                e.preventDefault()
            }
            return !0
        }, p.prototype._validateField = function(e) {
            var t = e.rules.split("|");
            if (-1 !== e.rules.indexOf("required") || e.value && "" !== e.value && e.value !== n)
                for (var a = 0, o = t.length; a < o; a++) {
                    var s = t[a],
                        l = null,
                        u = !1;
                    if ((parts = r.exec(s)) && (s = parts[1], l = parts[2]), "function" == typeof this._hooks[s] ? this._hooks[s].apply(this, [e, l]) || (u = !0) : "callback_" === s.substring(0, 9) && (s = s.substring(9, s.length), "function" == typeof this.handlers[s] && !1 === this.handlers[s].apply(this, [e.value]) && (u = !0)), u) {
                        (t = this.messages[s] || i[s]) ? (e = t.replace("%s", e.display), l && (e = e.replace("%s", this.fields[l] ? this.fields[l].display : l)), this.errors.push(e)) : this.errors.push("An error has occurred with the " + e.display + " field.");
                        break
                    }
                }
        }, p.prototype._hooks = {
            required: function(e) {
                var t = e.value;
                return "checkbox" === e.type ? !0 === e.checked : null !== t && "" !== t
            },
            matches: function(e, t) {
                return !!(el = this.form[t]) && e.value === el.value
            },
            valid_email: function(e) {
                return u.test(e.value)
            },
            min_length: function(e, t) {
                return !!o.test(t) && e.value.length >= t
            },
            max_length: function(e, t) {
                return !!o.test(t) && e.value.length <= t
            },
            exact_length: function(e, t) {
                return !!o.test(t) && e.value.length == t
            },
            greater_than: function(e, t) {
                return !!l.test(e.value) && parseFloat(e.value) > parseFloat(t)
            },
            less_than: function(e, t) {
                return !!l.test(e.value) && parseFloat(e.value) < parseFloat(t)
            },
            alpha: function(e) {
                return d.test(e.value)
            },
            alpha_numeric: function(e) {
                return c.test(e.value)
            },
            alpha_dash: function(e) {
                return h.test(e.value)
            },
            numeric: function(e) {
                return l.test(e.value)
            },
            integer: function(e) {
                return s.test(e.value)
            }
        }, e.FormValidator = p
    }(window, document), $(document).on("page:load ready", function() {
        elementPresent($("#channel_form")) && ($(".field_checkbox").click(function() {
            var e = $(this).val(),
                t = $("#channel_field" + e);
            $(this).is(":checked") ? (t.removeAttr("readonly"), t.val("Field Label " + e), t.select()) : (t.val(""), t.attr("readonly", !0))
        }), $("#channel_show_location").click(function() {
            $(this).is(":checked") ? ($("#channel_longitude").removeAttr("readonly"), $("#channel_latitude").removeAttr("readonly"), $("#label_longitude").removeClass("label-disabled"), $("#label_latitude").removeClass("label-disabled")) : ($("#channel_longitude").attr("readonly", !0), $("#channel_latitude").attr("readonly", !0), $("#label_longitude").addClass("label-disabled"), $("#label_latitude").addClass("label-disabled"))
        }), $("#channel_show_video").click(function() {
            $(this).is(":checked") ? ($('[name="channel[video_type]"]:radio').removeAttr("disabled"), $("#channel_video_id").removeAttr("readonly"), $("#label_youtube").removeClass("label-disabled"), $("#label_vimeo").removeClass("label-disabled"), $("#label_video_id").removeClass("label-disabled")) : ($('[name="channel[video_type]"]:radio').attr("disabled", !0), $("#channel_video_id").attr("readonly", !0), $("#label_youtube").addClass("label-disabled"), $("#label_vimeo").addClass("label-disabled"), $("#label_video_id").addClass("label-disabled"))
        }), $("form").submit(function() {
            $('[name="channel[video_type]"]:radio').removeAttr("disabled"), unbindBeforeUnloadEvents()
        }), confirmUnsavedChanges())
    });
var elementPresent = function(e) {
        return "string" == typeof e ? 0 !== $(e).length : 0 !== e.length
    },
    q = null;
// Copyright (C) 2006 Google Inc.
window.PR_SHOULD_USE_CONTINUATION = !0,
    function() {
        function e(e) {
            function t(e) {
                var t = e.charCodeAt(0);
                if (92 !== t) return t;
                var n = e.charAt(1);
                return (t = c[n]) ? t : "0" <= n && n <= "7" ? parseInt(e.substring(1), 8) : "u" === n || "x" === n ? parseInt(e.substring(2), 16) : e.charCodeAt(1)
            }

            function n(e) {
                return e < 32 ? (e < 16 ? "\\x0" : "\\x") + e.toString(16) : ("\\" !== (e = String.fromCharCode(e)) && "-" !== e && "[" !== e && "]" !== e || (e = "\\" + e), e)
            }

            function i(e) {
                for (var i = e.substring(1, e.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g), a = (e = [], []), r = "^" === i[0], o = r ? 1 : 0, s = i.length; o < s; ++o) {
                    var l = i[o];
                    if (/\\[bdsw]/i.test(l)) e.push(l);
                    else {
                        var u;
                        l = t(l);
                        o + 2 < s && "-" === i[o + 1] ? (u = t(i[o + 2]), o += 2) : u = l, a.push([l, u]), u < 65 || l > 122 || (u < 65 || l > 90 || a.push([32 | Math.max(65, l), 32 | Math.min(u, 90)]), u < 97 || l > 122 || a.push([-33 & Math.max(97, l), -33 & Math.min(u, 122)]))
                    }
                }
                for (a.sort(function(e, t) {
                        return e[0] - t[0] || t[1] - e[1]
                    }), i = [], l = [NaN, NaN], o = 0; o < a.length; ++o)(s = a[o])[0] <= l[1] + 1 ? l[1] = Math.max(l[1], s[1]) : i.push(l = s);
                for (a = ["["], r && a.push("^"), a.push.apply(a, e), o = 0; o < i.length; ++o) s = i[o], a.push(n(s[0])), s[1] > s[0] && (s[1] + 1 > s[0] && a.push("-"), a.push(n(s[1])));
                return a.push("]"), a.join("")
            }

            function a(e) {
                for (var t = e.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), n = t.length, a = [], s = 0, l = 0; s < n; ++s) {
                    var u = t[s];
                    "(" === u ? ++l : "\\" === u.charAt(0) && (u = +u.substring(1)) && u <= l && (a[u] = -1)
                }
                for (s = 1; s < a.length; ++s) - 1 === a[s] && (a[s] = ++r);
                for (l = s = 0; s < n; ++s) "(" === (u = t[s]) ? void 0 === a[++l] && (t[s] = "(?:") : "\\" === u.charAt(0) && (u = +u.substring(1)) && u <= l && (t[s] = "\\" + a[l]);
                for (l = s = 0; s < n; ++s) "^" === t[s] && "^" !== t[s + 1] && (t[s] = "");
                if (e.ignoreCase && o)
                    for (s = 0; s < n; ++s) e = (u = t[s]).charAt(0), u.length >= 2 && "[" === e ? t[s] = i(u) : "\\" !== e && (t[s] = u.replace(/[A-Za-z]/g, function(e) {
                        return e = e.charCodeAt(0), "[" + String.fromCharCode(-33 & e, 32 | e) + "]"
                    }));
                return t.join("")
            }
            for (var r = 0, o = !1, s = !1, l = 0, u = e.length; l < u; ++l) {
                var d = e[l];
                if (d.ignoreCase) s = !0;
                else if (/[a-z]/i.test(d.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ""))) {
                    o = !0, s = !1;
                    break
                }
            }
            var c = {
                    b: 8,
                    t: 9,
                    n: 10,
                    v: 11,
                    f: 12,
                    r: 13
                },
                h = [];
            for (l = 0, u = e.length; l < u; ++l) {
                if ((d = e[l]).global || d.multiline) throw Error("" + d);
                h.push("(?:" + a(d) + ")")
            }
            return RegExp(h.join("|"), s ? "gi" : "g")
        }

        function t(e) {
            function t(e) {
                switch (e.nodeType) {
                    case 1:
                        if (i.test(e.className)) break;
                        for (var n = e.firstChild; n; n = n.nextSibling) t(n);
                        "BR" !== (n = e.nodeName) && "LI" !== n || (a[s] = "\n", o[s << 1] = r++, o[s++ << 1 | 1] = e);
                        break;
                    case 3:
                    case 4:
                        (n = e.nodeValue).length && (n = l ? n.replace(/\r\n?/g, "\n") : n.replace(/[\t\n\r ]+/g, " "), a[s] = n, o[s << 1] = r, r += n.length, o[s++ << 1 | 1] = e)
                }
            }
            var n, i = /(?:^|\s)nocode(?:\s|$)/,
                a = [],
                r = 0,
                o = [],
                s = 0;
            e.currentStyle ? n = e.currentStyle.whiteSpace : window.getComputedStyle && (n = document.defaultView.getComputedStyle(e, q).getPropertyValue("white-space"));
            var l = n && "pre" === n.substring(0, 3);
            return t(e), {
                a: a.join("").replace(/\n$/, ""),
                c: o
            }
        }

        function n(e, t, n, i) {
            t && (n(e = {
                a: t,
                d: e
            }), i.push.apply(i, e.e))
        }

        function i(t, i) {
            function a(e) {
                for (var t = e.d, u = [t, "pln"], d = 0, c = e.a.match(r) || [], h = {}, p = 0, f = c.length; p < f; ++p) {
                    var m, g = c[p],
                        _ = h[g],
                        v = void 0;
                    if ("string" == typeof _) m = !1;
                    else {
                        var y = o[g.charAt(0)];
                        if (y) v = g.match(y[1]), _ = y[0];
                        else {
                            for (m = 0; m < l; ++m)
                                if (y = i[m], v = g.match(y[1])) {
                                    _ = y[0];
                                    break
                                } v || (_ = "pln")
                        }!(m = _.length >= 5 && "lang-" === _.substring(0, 5)) || v && "string" == typeof v[1] || (m = !1, _ = "src"), m || (h[g] = _)
                    }
                    if (y = d, d += g.length, m) {
                        m = v[1];
                        var w = g.indexOf(m),
                            b = w + m.length;
                        v[2] && (w = (b = g.length - v[2].length) - m.length), _ = _.substring(5), n(t + y, g.substring(0, w), a, u), n(t + y + w, m, s(_, m), u), n(t + y + b, g.substring(b), a, u)
                    } else u.push(t + y, _)
                }
                e.e = u
            }
            var r, o = {};
            ! function() {
                for (var n = t.concat(i), a = [], s = {}, l = 0, u = n.length; l < u; ++l) {
                    var d = n[l],
                        c = d[3];
                    if (c)
                        for (var h = c.length; --h >= 0;) o[c.charAt(h)] = d;
                    c = "" + (d = d[1]), s.hasOwnProperty(c) || (a.push(d), s[c] = q)
                }
                a.push(/[\S\s]/), r = e(a)
            }();
            var l = i.length;
            return a
        }

        function a(e) {
            var t = [],
                n = [];
            e.tripleQuotedStrings ? t.push(["str", /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, q, "'\""]) : e.multiLineStrings ? t.push(["str", /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/, q, "'\"`"]) : t.push(["str", /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, q, "\"'"]), e.verbatimStrings && n.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, q]);
            var a = e.hashComments;
            return a && (e.cStyleComments ? (a > 1 ? t.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, q, "#"]) : t.push(["com", /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/, q, "#"]), n.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, q])) : t.push(["com", /^#[^\n\r]*/, q, "#"])), e.cStyleComments && (n.push(["com", /^\/\/[^\n\r]*/, q]), n.push(["com", /^\/\*[\S\s]*?(?:\*\/|$)/, q])), e.regexLiterals && n.push(["lang-regex", /^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]), (a = e.types) && n.push(["typ", a]), (e = ("" + e.keywords).replace(/^ | $/g, "")).length && n.push(["kwd", RegExp("^(?:" + e.replace(/[\s,]+/g, "|") + ")\\b"), q]), t.push(["pln", /^\s+/, q, " \r\n\t\xa0"]), n.push(["lit", /^@[$_a-z][\w$@]*/i, q], ["typ", /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, q], ["pln", /^[$_a-z][\w$@]*/i, q], ["lit", /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, q, "0123456789"], ["pln", /^\\[\S\s]?/, q], ["pun", /^.[^\s\w"-$'./@\\`]*/, q]), i(t, n)
        }

        function r(e, t) {
            function n(e) {
                switch (e.nodeType) {
                    case 1:
                        if (r.test(e.className)) break;
                        if ("BR" === e.nodeName) i(e), e.parentNode && e.parentNode.removeChild(e);
                        else
                            for (e = e.firstChild; e; e = e.nextSibling) n(e);
                        break;
                    case 3:
                    case 4:
                        if (l) {
                            var t = e.nodeValue,
                                a = t.match(o);
                            if (a) {
                                var u = t.substring(0, a.index);
                                e.nodeValue = u, (t = t.substring(a.index + a[0].length)) && e.parentNode.insertBefore(s.createTextNode(t), e.nextSibling), i(e), u || e.parentNode.removeChild(e)
                            }
                        }
                }
            }

            function i(e) {
                function t(e, n) {
                    var i = n ? e.cloneNode(!1) : e;
                    if (a = e.parentNode) {
                        var a = t(a, 1),
                            r = e.nextSibling;
                        a.appendChild(i);
                        for (var o = r; o; o = r) r = o.nextSibling, a.appendChild(o)
                    }
                    return i
                }
                for (; !e.nextSibling;)
                    if (!(e = e.parentNode)) return;
                var n;
                for (e = t(e.nextSibling, 0);
                    (n = e.parentNode) && 1 === n.nodeType;) e = n;
                u.push(e)
            }
            var a, r = /(?:^|\s)nocode(?:\s|$)/,
                o = /\r\n?|\n/,
                s = e.ownerDocument;
            e.currentStyle ? a = e.currentStyle.whiteSpace : window.getComputedStyle && (a = s.defaultView.getComputedStyle(e, q).getPropertyValue("white-space"));
            var l = a && "pre" === a.substring(0, 3);
            for (a = s.createElement("LI"); e.firstChild;) a.appendChild(e.firstChild);
            for (var u = [a], d = 0; d < u.length; ++d) n(u[d]);
            t === (0 | t) && u[0].setAttribute("value", t);
            var c = s.createElement("OL");
            c.className = "linenums";
            for (var h = Math.max(0, t - 1 | 0) || 0, p = (d = 0, u.length); d < p; ++d)(a = u[d]).className = "L" + (d + h) % 10, a.firstChild || a.appendChild(s.createTextNode("\xa0")), c.appendChild(a);
            e.appendChild(c)
        }

        function o(e, t) {
            for (var n = t.length; --n >= 0;) {
                var i = t[n];
                y.hasOwnProperty(i) ? window.console && console.warn("cannot override language handler %s", i) : y[i] = e
            }
        }

        function s(e, t) {
            return e && y.hasOwnProperty(e) || (e = /^\s*</.test(t) ? "default-markup" : "default-code"), y[e]
        }

        function l(e) {
            var n = e.g;
            try {
                var i = (c = t(e.h)).a;
                e.a = i, e.c = c.c, e.d = 0, s(n, i)(e);
                var a, r, o = /\bMSIE\b/.test(navigator.userAgent),
                    l = (n = /\n/g, e.a),
                    d = l.length,
                    c = 0,
                    h = e.c,
                    p = h.length,
                    f = (i = 0, e.e),
                    m = f.length;
                e = 0;
                for (f[m] = d, r = a = 0; r < m;) f[r] !== f[r + 2] ? (f[a++] = f[r++], f[a++] = f[r++]) : r += 2;
                for (m = a, r = a = 0; r < m;) {
                    for (var g = f[r], _ = f[r + 1], v = r + 2; v + 2 <= m && f[v + 1] === _;) v += 2;
                    f[a++] = g, f[a++] = _, r = v
                }
                for (f.length = a; i < p;) {
                    var y, w = h[i + 2] || d,
                        b = f[e + 2] || d,
                        $ = (v = Math.min(w, b), h[i + 1]);
                    if (1 !== $.nodeType && (y = l.substring(c, v))) {
                        o && (y = y.replace(n, "\r")), $.nodeValue = y;
                        var k = $.ownerDocument,
                            x = k.createElement("SPAN");
                        x.className = f[e + 1];
                        var E = $.parentNode;
                        E.replaceChild(x, $), x.appendChild($), c < w && (h[i + 1] = $ = k.createTextNode(l.substring(v, w)), E.insertBefore($, x.nextSibling))
                    }(c = v) >= w && (i += 2), c >= b && (e += 2)
                }
            } catch (u) {
                "console" in window && console.log(u && u.stack ? u.stack : u)
            }
        }
        var u, d, c = [u = [
                [d = ["break,continue,do,else,for,if,return,while"], "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"
            ], "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],
            h = [u, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"],
            p = [h, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"],
            f = [d, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
            m = [d, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],
            g = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/,
            _ = /\S/,
            v = a({
                keywords: [c, p, u = [u, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"], "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END" + f, m, d = [d, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"]],
                hashComments: !0,
                cStyleComments: !0,
                multiLineStrings: !0,
                regexLiterals: !0
            }),
            y = {};
        o(v, ["default-code"]), o(i([], [
            ["pln", /^[^<?]+/],
            ["dec", /^<!\w[^>]*(?:>|$)/],
            ["com", /^<\!--[\S\s]*?(?:--\>|$)/],
            ["lang-", /^<\?([\S\s]+?)(?:\?>|$)/],
            ["lang-", /^<%([\S\s]+?)(?:%>|$)/],
            ["pun", /^(?:<[%?]|[%?]>)/],
            ["lang-", /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],
            ["lang-js", /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],
            ["lang-css", /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],
            ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]
        ]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), o(i([
            ["pln", /^\s+/, q, " \t\r\n"],
            ["atv", /^(?:"[^"]*"?|'[^']*'?)/, q, "\"'"]
        ], [
            ["tag", /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],
            ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
            ["lang-uq.val", /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],
            ["pun", /^[/<->]+/],
            ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i],
            ["lang-js", /^on\w+\s*=\s*'([^']+)'/i],
            ["lang-js", /^on\w+\s*=\s*([^\s"'>]+)/i],
            ["lang-css", /^style\s*=\s*"([^"]+)"/i],
            ["lang-css", /^style\s*=\s*'([^']+)'/i],
            ["lang-css", /^style\s*=\s*([^\s"'>]+)/i]
        ]), ["in.tag"]), o(i([], [
            ["atv", /^[\S\s]+/]
        ]), ["uq.val"]), o(a({
            keywords: c,
            hashComments: !0,
            cStyleComments: !0,
            types: g
        }), ["c", "cc", "cpp", "cxx", "cyc", "m"]), o(a({
            keywords: "null,true,false"
        }), ["json"]), o(a({
            keywords: p,
            hashComments: !0,
            cStyleComments: !0,
            verbatimStrings: !0,
            types: g
        }), ["cs"]), o(a({
            keywords: h,
            cStyleComments: !0
        }), ["java"]), o(a({
            keywords: d,
            hashComments: !0,
            multiLineStrings: !0
        }), ["bsh", "csh", "sh"]), o(a({
            keywords: f,
            hashComments: !0,
            multiLineStrings: !0,
            tripleQuotedStrings: !0
        }), ["cv", "py"]), o(a({
            keywords: "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        }), ["perl", "pl", "pm"]), o(a({
            keywords: m,
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        }), ["rb"]), o(a({
            keywords: u,
            cStyleComments: !0,
            regexLiterals: !0
        }), ["js"]), o(a({
            keywords: "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes",
            hashComments: 3,
            cStyleComments: !0,
            multilineStrings: !0,
            tripleQuotedStrings: !0,
            regexLiterals: !0
        }), ["coffee"]), o(i([], [
            ["str", /^[\S\s]+/]
        ]), ["regex"]), window.prettyPrintOne = function(e, t, n) {
            var i = document.createElement("PRE");
            return i.innerHTML = e, n && r(i, n), l({
                g: t,
                i: n,
                h: i
            }), i.innerHTML
        }, window.prettyPrint = function(e) {
            function t() {
                for (var n = window.PR_SHOULD_USE_CONTINUATION ? u.now() + 250 : Infinity; d < i.length && u.now() < n; d++) {
                    var a = i[d];
                    if ((o = a.className).indexOf("prettyprint") >= 0) {
                        var o, s, h;
                        if (h = !(o = o.match(c))) {
                            for (var p = void 0, f = (h = a).firstChild; f; f = f.nextSibling) {
                                var m = f.nodeType;
                                p = 1 === m ? p ? h : f : 3 === m && _.test(f.nodeValue) ? h : p
                            }
                            h = (s = p === h ? void 0 : p) && "CODE" === s.tagName
                        }
                        for (h && (o = s.className.match(c)), o && (o = o[1]), h = !1, p = a.parentNode; p; p = p.parentNode)
                            if (("pre" === p.tagName || "code" === p.tagName || "xmp" === p.tagName) && p.className && p.className.indexOf("prettyprint") >= 0) {
                                h = !0;
                                break
                            } h || ((h = !!(h = a.className.match(/\blinenums\b(?::(\d+))?/)) && (!h[1] || !h[1].length || +h[1])) && r(a, h), l({
                            g: o,
                            h: a,
                            i: h
                        }))
                    }
                }
                d < i.length ? setTimeout(t, 250) : e && e()
            }
            for (var n = [document.getElementsByTagName("pre"), document.getElementsByTagName("code"), document.getElementsByTagName("xmp")], i = [], a = 0; a < n.length; ++a)
                for (var o = 0, s = n[a].length; o < s; ++o) i.push(n[a][o]);
            n = q;
            var u = Date;
            u.now || (u = {
                now: function() {
                    return +new Date
                }
            });
            var d = 0,
                c = /\blang(?:uage)?-([\w.]+)(?!\S)/;
            t()
        }, window.PR = {
            createSimpleLexer: i,
            registerLangHandler: o,
            sourceDecorator: a,
            PR_ATTRIB_NAME: "atn",
            PR_ATTRIB_VALUE: "atv",
            PR_COMMENT: "com",
            PR_DECLARATION: "dec",
            PR_KEYWORD: "kwd",
            PR_LITERAL: "lit",
            PR_NOCODE: "nocode",
            PR_PLAIN: "pln",
            PR_PUNCTUATION: "pun",
            PR_SOURCE: "src",
            PR_STRING: "str",
            PR_TAG: "tag",
            PR_TYPE: "typ"
        }
    }(), (0, window.jQuery)(function() {
        window.prettyPrint && prettyPrint()
    }), $(document).on("page:load ready", function() {
        $(".response").click(function() {
            var e = $(this).data("response_type");
            $(".response").removeClass("active"), $(".response-" + e).addClass("active"), $(".format").hide(), $(".format-" + e).show()
        })
    });
var evalContainer, fevalContainer, evalDiv, fevalDiv, fevalImg, hiddenMcode, hiddenErrorTitle, hiddenTimeoutTitle, hiddenSuccessTitle, hiddenErrorMessage, unsavedChangesMessage, errored, erroredMessage, timeOutDetailText, codeEditor, alerts = {
        showBanners: function(e) {
            var t = document.getElementById(e);
            "none" === t.style.display && (t.style.display = "block"), t.scrollIntoView(!1)
        },
        hideBanners: function(e) {
            var t = document.getElementById(e);
            "block" === t.style.display && (t.style.display = "none")
        },
        displayErrorAlert: function(e) {
            alerts.showBanners(e)
        }
    },
    analysis_visualization_name_save = {
        onmouseclick: function(e, t) {
            $(e).val().trim() ? ($(e).val(xssEvasion.sanitizeResponse($(e).val().trim())), saveType = "mouseClick", e.form.save.click()) : alerts.displayErrorAlert(t)
        },
        onkeypress: function(e, t) {
            13 == event.keyCode && (event.preventDefault(), $(e).val().trim() ? ($(e).val(xssEvasion.sanitizeResponse($(e).val().trim())), saveType = "enter", e.form.save.click()) : alerts.displayErrorAlert(t))
        }
    };
$("#analysis_name_empty_error_close").on("click", function() {
    alerts.hideBanners(this.parentElement.id)
}), $("#matlab_code_empty_warning_close").on("click", function() {
    alerts.hideBanners(this.parentElement.id)
});
var mssInit = function() {
        evalContainer = $("#eval_container .collapse"), fevalContainer = $("#feval_container .collapse"), evalDiv = $("#eval"), fevalDiv = $("#feval_svg"), fevalImg = $("#feval_png"), hiddenMcode = getHiddenMcodeDiv(), hiddenErrorTitle = $("#error_title").val(), hiddenTimeoutTitle = $("#timeout_title").val(), timeOutDetailText = $("#timeout_detailed").val(), hiddenSuccessTitle = $("#success_title").val(), hiddenErrorMessage = $("#error_message").val(), unsavedChangesMessage = $("#unsaved_changes").val(), errored = $("#errored"), erroredMessage = $("#errored_timecontrol_react").val(), "" !== hiddenErrorMessage && displayError(hiddenErrorMessage), $("#clear").click(function() {
            clearHistory(), clearFEvalResponse()
        }), $(window).unbind("beforeunload.matlab").bind("beforeunload.matlab", function() {
            if (matlabEditor.rtcPresent() && unsavedChanges()) return unsavedChangesMessage
        }), $(document).unbind("page:before-change.matlab").bind("page:before-change.matlab", function() {
            if (matlabEditor.rtcPresent() && unsavedChanges() && !confirm(unsavedChangesMessage)) return !1
        })
    },
    onEditorLoad = function() {
        $("#editorSpinner").hide(), codeEditor = window.editor.rtcInstance.getDocument(), matlabEditor.checkCodeChange(), mssInit(), matlabEditor.setMcode(), $("#commit").click(function() {
            matlabEditor.uiLock(), $(".dismiss").click(), hiddenMcode.val(matlabEditor.getMcode())
        }), $("#save").click(function() {
            "enter" != saveType && "mouseClick" != saveType && matlabEditor.uiLock(), $(".dismiss").click(), hiddenMcode.val(matlabEditor.getMcode())
        }), $("#analytics_text_field").length > 0 && matlabEditor.checkMatlabFileNameChange()
    },
    isPlugin = function() {
        return elementPresent(fevalContainer)
    },
    isMatlabIotAnalytic = function() {
        return elementPresent($("#matlab_iot_analytic_mcode"))
    },
    getHiddenMcodeDiv = function() {
        var e;
        return e = isMatlabIotAnalytic() ? "#matlab_iot_analytic_mcode" : isPlugin() ? "#plugin_mcode" : "#matlab_code_mcode", $(e)
    },
    unsavedChanges = (elementPresent = function(e) {
        return "string" == typeof e ? 0 !== $(e).length : 0 !== e.length
    }, function() {
        return matlabEditor.getMcode() !== hiddenMcode.val()
    }),
    clearFEvalResponse = function() {
        elementPresent(fevalDiv) && fevalDiv.children().remove(), elementPresent(fevalImg) && (fevalImg.removeAttr("src"), fevalImg.hide())
    },
    clearHistory = function() {
        elementPresent(evalDiv) && evalDiv.children().remove()
    },
    handleMSSResponse = function(e) {
        if ("error" in e && null !== e.error) displayError(e.error), clearFEvalResponse();
        else if (displaySuccess(hiddenSuccessTitle), elementPresent(evalDiv) && "eval" in e && appendOutput(e.eval, !1), elementPresent(fevalDiv) && "feval" in e) {
            var t = e.feval;
            clearFEvalResponse(), "ggjson" in t && null !== t.ggjson ? handleWebPlotResponse(t.ggjson) : "hgplot" in t && null !== t.hgplot && handlePlotResponse(t.hgplot)
        }
    },
    handleMSSResponseIotAnalytics = function(e) {
        if ($("#eval_container").show(), "error" in e && null !== e.error) displayError(e.error), clearFEvalResponse();
        else if (displaySuccess(hiddenSuccessTitle), elementPresent(evalDiv) && "eval" in e && appendOutput(e.eval, !1), "feval" in e) {
            var t = e.feval;
            clearFEvalResponse(), "ggjson" in t && null !== t.ggjson ? ($("#feval_container").show(), handleWebPlotResponse(t.ggjson)) : "hgplot" in t && null !== t.hgplot ? ($("#feval_container").show(), handlePlotResponse(t.hgplot)) : $("#feval_container").hide()
        }
    },
    handlePlotResponse = function(e) {
        fevalImg.attr("src", e).show()
    },
    handleWebPlotResponse = function(e) {
        var t = JSON.parse(e);
        renderVega(t, "#feval_svg"), fevalImg.hide()
    },
    appendOutput = function(e, t) {
        if ("" !== e && null !== e && e !== undefined) {
            var n = document.createElement("div");
            !0 === t && $(n).addClass("matlab_warning");
            var i = xssEvasion.sanitizeResponse(e);
            if (n.innerHTML = i, elementPresent(evalDiv)) {
                var a = $(n).find("a");
                a.length > 0 && $(a).click(interceptErrorUrl), $(document.createElement("hr")).appendTo(n), $(n).appendTo(evalDiv), $(evalDiv).scrollTop($(evalDiv).prop("scrollHeight"))
            }
        }
    },
    displayError = function(e, t) {
        t === undefined && (t = "#root");
        var n = hiddenErrorTitle;
        "true" === errored.val() && (n += " " + erroredMessage), e === timeOutDetailText && (n = hiddenTimeoutTitle), $('<div class="flash alert alert-danger"><span class="dismiss">X</span><p>' + n + "</p></div").insertBefore(t), $(".flash a").click(interceptErrorUrl), $(".dismiss").on("click", function() {
            $(this).parent().remove()
        }), appendOutput(e, !0)
    },
    displaySuccess = function(e, t) {
        t === undefined && (t = "#root"), $(".alert-success").remove(), $('<div class="flash alert alert-success"><span class="dismiss">X</span><p>' + e + "</p></div").insertBefore(t), $(".dismiss").on("click", function() {
            $(this).parent().remove()
        }), setTimeout(function() {
            $("div.flash.alert.alert-success").length > 0 && $(".flash").hide("slow")
        }, 15e3)
    },
    displayErrorFormElements = function(e, t) {
        t === undefined && (t = "#root"), $(".alert-danger").remove(), $('<div class="flash alert alert-danger"><span class="dismiss">X</span><p class="word_break_normal" id="error_message_p"> </p></div>').insertBefore(t), $("#error_message_p").append(e), $(".dismiss").on("click", function() {
            $(this).parent().remove()
        })
    },
    interceptErrorUrl = function(e) {
        "http" !== this.href.substring(0, 4) && (e.preventDefault(), evalErrorUrl(this.href, function(e) {
            null !== e && "eval" in e && appendOutput(e.eval, !1)
        }))
    },
    evalErrorUrl = function(e, t) {
        if (-1 !== e.indexOf("matlab:")) {
            var n = e.substring(0, 7);
            if ("matlab:" === n) {
                var i = e.substring(7);
                "doc" === (n = i.substring(0, 3)) ? (i = i.substring(4), window.open("http://www.mathworks.com/help/search.html?qdoc=" + i)) : $.ajax({
                    method: "POST",
                    url: "test_code",
                    data: {
                        mcode: i
                    },
                    dataType: "json"
                }).done(function(e) {
                    t(e)
                })
            }
        }
    },
    renderVega = function(e, t) {
        var n = new thingSpeakWebplot;
        e.resizable = !0, e.resizableButtonVisible = !1, !1 !== n.setSpec(e, t) && (n.loadLibraries(), n.render(), n.resize())
    },
    matlabEditor = {
        checkCodeChange: function() {
            document.getElementById("solutionBodyArea").onkeyup = function() {
                parent.document.getElementById("saveNeeded") && (parent.document.getElementById("saveNeeded").innerHTML = "*")
            }
        },
        rtcPresent: function() {
            return void 0 !== codeEditor
        },
        setMcode: function() {
            matlabEditor.rtcPresent() && codeEditor.setText(hiddenMcode.val())
        },
        getMcode: function() {
            if (matlabEditor.rtcPresent()) return codeEditor.getText()
        },
        uiUnlock: function() {
            matlabEditor.rtcPresent() && (window.editor.rtcInstance.focus(), codeEditor.setReadOnly(!1))
        },
        uiLock: function() {
            matlabEditor.rtcPresent() && (window.editor.rtcInstance.blur(), window.editor.resizeEditor(), codeEditor.setReadOnly(!0))
        },
        checkMatlabFileNameChange: function() {
            document.getElementById("analytics_text_field").onkeypress = function() {
                parent.document.getElementById("saveNeeded") && (parent.document.getElementById("saveNeeded").innerHTML = "*")
            }
        }
    },
    setExhaustionAlertDefaults = function() {
        is_shutOff = !1, is_leu = !1, exhuastion_message_id = "#call_of_action_exhaust", shut_off_message_id = "#call_of_action_shutoff", expire_message_id = "#call_of_action_expire", to_expire_message_id = "#call_of_action_to_expire", $(".exhaustion_reminder").hide(), $(".expiration_reminder").hide(), $(".shutoff_alert").hide(), $(".shutoff_expiration_alert").hide(), currentDate = new Date, a_tag_id = null
    },
    checkMessageExhaustion = function(e, t, n, i, a, r) {
        var o = !1;
        if (estimated_exhaustion_date = UsageVisualizations.estimateExhaustionOrExpirationDate(i.monthly, i.daily, r).Date, t.dateType = UsageVisualizations.estimateExhaustionOrExpirationDate(i.monthly, i.daily, r).DateType, 1 == is_shutOff) $("#license_id_val").text(e), $("#shut_off_date").text(moment(t.exhaustion_date).format("LL")), $(".shutoff_alert").show(), a != undefined && !0 === a && (o = !0);
        else if (t.dateType != undefined && "Expiration Date" === t.dateType && estimated_exhaustion_date < currentDate) setExpirationAlert(e, n, !0), $("#license_id_val_expire_shutoff").text(e), $("#shut_off_date_exp").text(moment(estimated_exhaustion_date).format("LL")), n || $(".shutoff_expiration_alert").show();
        else {
            var s = Math.abs(estimated_exhaustion_date.getTime() - (new Date).getTime());
            Math.ceil(s / 864e5) <= 45 && (o = !0, t.dateType != undefined && "Expiration Date" === t.dateType ? ($("#license_id_val_expire").text(e), $("#expiration_date").text(moment(estimated_exhaustion_date).format("LL")), n || (setExpirationAlert(e, n, !1), $(".expiration_reminder").show())) : (setExpirationAlert(e, n, !1), $("#license_id_val_exhaust").text(e), $("#exp_expiration_date").text(moment(estimated_exhaustion_date).format("LL")), $(".exhaustion_reminder").show()))
        }
        a != undefined && !0 === a && !0 === o && $("#monthly_usage_tab").is(":visible") && $('#charts_tabs a[href="#monthly_usage"]').tab("show")
    },
    populateFreeUnitsLink = function(e) {
        1 != e ? $(exhuastion_message_id).attr("href", "/prices") : $(shut_off_message_id).attr("href", "/prices")
    },
    populateAlertMessages = function(e, t) {
        1 == is_leu ? setMessageForLEU(t) : setMessageForNonLEU(e, t)
    },
    setMessageForLEU = function(e) {
        setAdminContactMessage(1 != e ? exhuastion_message_id : shut_off_message_id)
    },
    setMessageForNonLEU = function(e, t) {
        setPurchaseUnitsMessage(1 != t ? exhuastion_message_id : shut_off_message_id, e)
    },
    populatePurchaseUnitsLink = function(e) {
        $("#purchase_units_link").attr("href", "/account/purchase/" + encodeURIComponent(e))
    },
    setAdminContactMessage = function(e) {
        $(e).text("Contact your administrator.").removeClass("exhaustion_alert").removeAttr("href").addClass("contact_admin")
    },
    setPurchaseUnitsMessage = function(e, t) {
        $(e).text("Purchase more units").attr("href", "/account/purchase/" + encodeURIComponent(t)).attr("data-turbolinks", !1)
    },
    setExpirationAlert = function(e, t, n) {
        a_tag_id = 1 == n ? expire_message_id : to_expire_message_id, 1 == t ? $(a_tag_id).attr("href", "/prices") : 1 == is_leu ? $(a_tag_id).text("Contact your administrator.").removeClass("exhaustion_alert").removeAttr("href").addClass("contact_admin") : $(a_tag_id).text("Purchase more units").attr("href", "/account/purchase/" + encodeURIComponent(e)).attr("data-turbolinks", !1)
    };
ThingSpeak.Channel = function() {
    function e(e) {
        for (var t in this.channel = e.channel, this.publicView = e.public_view, this.currentUserOwns = e.current_user_owns, this.windows = [], $("abbr.timeago").timeago(), e.windows) this.windows.push(ThingSpeak.Window.init(e.windows[t], this.currentUserOwns));
        if ($("#add_widget_modal").on("show.bs.modal", function() {
                document.getElementById("add_widget_next").disabled = !0, widgetPreview.resetSettings(), widgetPreview.showPreviewPane()
            }), $("#add_widget_next").click(function() {
                widgetPreview.showWidgetForm()
            }.bind(this)), $(".add_widget_cancel").click(function() {
                widgetPreview.resetSettings()
            }.bind(this)), $("#configure_widget_parameters_modal").on("shown.bs.modal", function() {
                widgetPreviewHelpers.gaugeToggleDisplayCheckBox(this)
            }.bind(this)), $("#configure_widget_parameters_modal").on("hide.bs.modal", function() {
                $("#gauge_min_max_error").hide(), $("#units_error").hide(), widgetPreview.resetSettings()
            }), $("#invalid_widget_parameter_close").on("click", function() {
                $(this).parent().hide()
            }), $("#invalid_widget_type_close").on("click", function() {
                $(this).parent().hide()
            }), $(document).on("click", "#gauge_add_range_", function() {
                widgetHelperFunctions.gaugePlusButtonHelper("widget_params_config_")
            }), $(document).on("click", "[id^=range_close_icon]", function(e) {
                gaugeRemoveRange(e.target.parentElement)
            }), $(document).on("click", "#gauge_min_max_error_close", function() {
                widgetHelperFunctions.hideGaugeMinMaxError(this)
            }), $(document).on("click", "#units_error_close", function() {
                widgetHelperFunctions.hideUnitsError(this)
            }), $("#add_widget_create").click(function() {
                var e = $(".window-preview-container-selected").find("#widget-metadata-id").html(),
                    t = $("#configure_widget_parameters_modal").find("#gauge_min_max_error"),
                    n = $("#configure_widget_parameters_modal").find("#units_error"),
                    i = widgetHelperFunctions.validateAndGetWidgetData(e, t, n);
                if (!i) return !1;
                var a = this.publicView,
                    r = widgetHelperFunctions.getWidgetWindow(e, i, a);
                $(this).toggleClass("window-preview-container-selected"), ThingSpeak.Window.addWidgetWindow(this.channel.id, r)
            }.bind(this)), $("#add_visualization_modal").on("show.bs.modal", function() {
                hiddenText = $("#add_visualization_empty_text"), $("#add_visualization_modal_content_body").children("div").length > 0 ? hiddenText.attr("hidden", "hidden") : hiddenText.removeAttr("hidden")
            }), $(".window-preview-container").click(function() {
                widgetPreview.selectCurrentWindow(), $(this).toggleClass("window-preview-container-selected")
            }), $("#add_visualization_cancel").click(function() {
                $(".window-preview-container-selected").removeClass("window-preview-container-selected")
            }), $("#add_visualization_save").click(function() {
                var e = this.publicView,
                    t = [],
                    n = {};
                $(".window-preview-container-selected").each(function(i, a) {
                    $(a).remove(), n = {
                        public_flag: e,
                        content_type: $(a).attr("content-type"),
                        content_id: $(a).attr("content-id")
                    }, t.push(n)
                }), ThingSpeak.Window.addVisualizations(this.channel.id, t)
            }.bind(this)), this.currentUserOwns) {
            var n = function() {
                var e = [];
                $(".window-container").each(function(t, n) {
                    e.push(n.id.split("_")[1])
                });
                var t = "/channels/" + this.channel.id + "/windows/reposition",
                    n = {
                        public_flag: this.publicView,
                        window_ids: e
                    };
                $.ajax({
                    url: t,
                    method: "PUT",
                    data: n,
                    dataType: "json"
                })
            }.bind(this);
            this.sortable = Sortable.create($("#windows_container")[0], {
                sort: !0,
                delay: 0,
                animation: 150,
                handle: ".window-header",
                draggable: ".window-container",
                scroll: !0,
                scrollSensitivity: 70,
                scrollSpeed: 10,
                fallbackOnBody: !1,
                onEnd: n
            })
        }
        return this
    }
    return {
        init: function(t) {
            return new e(t)
        },
        addVisualizationPreview: function(e) {
            var t = $.parseHTML(e);
            $(t).click(function() {
                $(this).toggleClass("window-preview-container-selected")
            }), $("#add_visualization_modal_content_body").append(t)
        }
    }
}();
var monthlyData, dailyData, loadMeterData = function(e) {
        var t;
        $("#available_licenses").change(function() {
            var e = this.value,
                t = $("#channel-metadata-id").html();
            $.ajax({
                url: "/channels/update_license",
                method: "POST",
                data: {
                    channel_id: t,
                    license: e
                },
                dataType: "html"
            })
        }), t = e.is_free_user ? e.free_license_id : e.is_a_staff ? e.staff_license_id : $("#available_licenses").val(), loadMeterInfo(t), $("#available_licenses").change(function() {
            loadMeterInfo($("#available_licenses").val())
        })
    },
    setDefaultsChannels = function() {
        $("input#upload_csv_channel_btn").removeAttr("disabled")
    },
    loadMeterInfo = function(e) {
        var t;
        setExhaustionAlertDefaults(), setDefaultsChannels(), 1 == meter_data.is_free_user ? (1 == meter_data.has_exhausted && (is_shutOff = !0, t = "Importing data into a channel requires messages. Buy a new license."), populateFreeUnitsLink(is_shutOff)) : meter_data.licenses.forEach(function(n) {
            n.license_id == e && (null != n.has_exhausted && (is_shutOff = !0, t = "Importing data into a channel requires messages. Purchase more units."), 1 == n.is_an_leu && (is_leu = !0, t = "Importing data into a channel requires messages. Contact your license administrator."), populatePurchaseUnitsLink(e), populateAlertMessages(e, is_shutOff))
        }), findDailyAndMonthlyUsage(e), !0 === is_shutOff && ($("input#upload_csv_channel_btn").addClass("enable_events_disabled_elements"), $("input#upload_csv_channel_btn").attr("disabled", "disabled"), $("input#upload_csv_channel_btn").attr("title", t))
    },
    findDailyAndMonthlyUsage = function(e) {
        var t = !1,
            n = {
                daily: undefined,
                monthly: undefined
            },
            i = {
                userType: meter_data.user_type
            },
            a = 0;
        meter_data.is_free_user || jQuery.isEmptyObject(meter_data.licenses) || meter_data.licenses.forEach(function(n) {
            n.license_id == e && (t = n.is_an_leu, a = n.total_remaining_messages_per_license)
        }), meter_data.is_free_user ? (i.number_of_messages_per_unit = meter_data.free_messages_per_year, i.messages_remaining = meter_data.licenses[0].messages_remaining) : (i.number_of_messages_per_unit = meter_data.messages_per_paid_unit, i.messages_remaining = a);
        var r = function(e) {
                n.daily = e, s(n)
            },
            o = function(e) {
                n.monthly = e, s(n)
            },
            s = function(t) {
                t.daily && t.monthly && checkMessageExhaustion(e, meter_data, meter_data.is_free_user, n, !1, i)
            },
            l = 5e3;
        $.ajax({
            url: "/account/daily_usage.json",
            cache: !1,
            data: {
                lid: e,
                is_an_leu: t
            },
            dataType: "json",
            tryCount: 0,
            retryLimit: 1,
            timeout: l
        }).done(r).fail(function(e) {
            if (200 != e.status && 304 != e.status) return this.tryCount++, this.tryCount <= this.retryLimit ? void $.ajax(this) : void 0
        }), $.ajax({
            url: "/account/monthly_usage.json",
            cache: !1,
            data: {
                lid: e,
                is_an_leu: t
            },
            dataType: "json",
            tryCount: 0,
            retryLimit: 1,
            timeout: l
        }).done(o).fail(function(e) {
            if (200 != e.status && 304 != e.status) return this.tryCount++, this.tryCount <= this.retryLimit ? void $.ajax(this) : void 0
        })
    },
    usagePurposeModal = {
        showHideUsageModal: function() {
            !1 === usage_purpose_modal_flag ? usagePurposeModal.setModalFields() : $("#usage_purpose_modal").modal("hide")
        },
        setModalFields: function() {
            usagePurposeModal.setModalDefaults(), usagePurposeModal.setModalOptionsForCommGov(), usagePurposeModal.setModalOptionsForNonCommGov()
        },
        setModalDefaults: function() {
            $("#usage_purpose_modal").modal("show"), $("#submit_intent_of_use").attr("disabled", "disableClick"), $("#company_name").hide()
        },
        setModalOptionsForCommGov: function() {
            $("#usage_purpose_modal").on("click", "#extended_user_detail_intended_use_0, #extended_user_detail_intended_use_1", function() {
                $("#company_name").show(), usagePurposeModal.toggleOkButton()
            })
        },
        setModalOptionsForNonCommGov: function() {
            $("#usage_purpose_modal").on("click", "#extended_user_detail_intended_use_2, #extended_user_detail_intended_use_3, #extended_user_detail_intended_use_4", function() {
                $("#company_name").hide(), $("#extended_user_detail_company_name").val(null), $("#submit_intent_of_use").removeAttr("disabled")
            })
        },
        toggleOkButton: function() {
            "" === $.trim($("#extended_user_detail_company_name").val()) ? $("#submit_intent_of_use").attr("disabled", "disableClick") : $("#submit_intent_of_use").removeAttr("disabled")
        }
    };
$(document).ready(function() {
    "channels" === location.pathname.substring(1) && usagePurposeModal.showHideUsageModal()
});
var widgetPreview = {
        showPreviewPane: function() {
            $("#add_widget_modal_content_body").children("div").length > 0 ? $("#add_widget_empty_text").attr("hidden", !0) : $("#add_widget_empty_text").attr("hidden", !1)
        },
        showWidgetForm: function() {
            var e = $(".window-preview-container-selected").find("#widget-metadata-id").html(),
                t = $("#channel-metadata-id").html();
            ThingSpeak.Widget.getNewWidgetFormElements(t, e)
        },
        resetSettings: function() {
            $(".window-preview-container-selected").removeClass("window-preview-container-selected");
            $("#channel-metadata-id").html()
        },
        selectCurrentWindow: function() {
            $("#add_widget_modal_content_body > .window-preview-container-selected").each(function(e, t) {
                t.classList.remove("window-preview-container-selected")
            }), document.getElementById("add_widget_next").disabled = !1
        }
    },
    widgetPreviewHelpers = {
        gaugeToggleDisplayCheckBox: function() {
            $(document).on("click", "#display_value_", function() {
                this.value = !!$(this).is(":checked")
            })
        }
    },
    widgetHelperFunctions = {
        validateAndGetWidgetData: function(e, t, n) {
            var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "",
                a = "#widget_params_config_" + i;
            switch (Number(e)) {
                case 0:
                    return !!widgetHelperFunctions.isGaugeValid(a, i, t, n) && ThingSpeak.Widget.getGaugeParams(i);
                case 1:
                    return !!widgetHelperFunctions.isNumericDisplayValid(a, i, n) && ThingSpeak.Widget.getNumericDisplayParams(i);
                case 2:
                    return ThingSpeak.Widget.getLampIndicatorParams(i);
                default:
                    return !1
            }
        },
        getWidgetWindow: function(e, t, n) {
            var i = $(".window-preview-container-selected")[0];
            $("#channel-metadata-id").html();
            return {
                public_flag: n,
                content_type: $(i).attr("content-type"),
                content_id: $(i).attr("content-id"),
                widget_type: e,
                parameters: t
            }
        },
        isGaugeValid: function(e, t, n, i) {
            var a = !0;
            return widgetHelperFunctions.isGaugeMinMaxInvalid(e, t) && (a = !1, n.show()), widgetHelperFunctions.isUnitInvalid(e, t) && (a = !1, i.show()), a
        },
        isNumericDisplayValid: function(e, t, n) {
            var i = !0;
            return widgetHelperFunctions.isUnitInvalid(e, t) && (i = !1, n.show()), i
        },
        updateName: function(e, t) {
            t = t != undefined ? t : "";
            var n = $(e).find("#name_" + t)[0].value;
            t = "#window_" + t;
            $(t + " .window-title").text(n)
        },
        isGaugeMinMaxInvalid: function(e, t) {
            t = t != undefined ? t : "";
            var n = $(e).find("#min_" + t)[0].value,
                i = $(e).find("#max_" + t)[0].value;
            return widgetHelperFunctions.isMaxMinInvalid(n, i)
        },
        isMaxMinInvalid: function(e, t) {
            return Number(e) >= Number(t)
        },
        isUnitInvalid: function(e, t) {
            var n = $(e).find("#units_" + t)[0].value;
            return "" !== n && !/([^0-9])$/.test(n)
        },
        hideGaugeMinMaxError: function(e) {
            $("#" + $(e).parents()[4].id).find("#gauge_min_max_error").hide()
        },
        hideUnitsError: function(e) {
            $("#" + $(e).parents()[4].id).find("#units_error").hide()
        },
        gaugePlusButtonHelper: function(e) {
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "",
                n = $("#range_meta_key_" + t).html(),
                i = Math.floor(9e5 * Math.random()) + 1e5,
                a = Number(document.getElementById("range_meta_key_" + t).innerHTML);
            rangeLabel = 0 === a ? "Range" : "";
            var r = "<tr><td class='widget-form-label widget-table-cells'><label class='control-label'>" + rangeLabel + " </label></td><td class='widget-table-cells'><input class='form-control' type='number' step='any' name='range_start_" + n + "' value='0'></td><td class='widget-table-cells'><input class='form-control' type='number' step='any' name='range_end_" + n + "' value='0'></td><td class='widget-table-cells'><input class='form-control' value=#" + i + " name='range_color_" + n + "' type='color'></input></td><td name='" + t + "' class='color-range-row'><span id ='range_close_icon_" + n + "'class='close' aria-hidden='true'>&times;</span></td></tr>";
            document.getElementById(e).insertAdjacentHTML("beforeend", r), "" != document.getElementById("range_meta_key_" + t) && (document.getElementById("range_meta_key_" + t).innerHTML = Number(n) + 1)
        }
    };
ThingSpeak.Window = function() {
    function e(e, t) {
        return this.initialize = function(e, t) {
            for (var n in e) this[n] = e[n];
            if (null !== this.html && $("#windows_container").append($.parseHTML(this.html)), this.container = $("#window_" + this.id), this.iframeModal = $("#window_iframe_modal_" + this.id), this.iframe = $("#window_iframe_" + this.id), t) {
                if (this.optionsModal = $("#window_options_modal_" + this.id), this.options_json = JSON.parse(this.options_json), $(this.container).find("#remove_window_" + this.id).click(this.remove.bind(this)), $("#window_options_modal_save_" + this.id).click(this.update_options.bind(this)), $("#window_widget_options_modal_save_" + this.id).click(this.update_widget_params.bind(this)), $("#widget_options_modal_open_" + this.id).click(this.widget_options_modal_open.bind(this)), $(this.optionsModal).on("hidden.bs.modal", this.reset_options.bind(this)), "widget" == this.content_type) {
                    var i = this.id;
                    $("#window_widget_options_modal_" + i).on("shown.bs.modal", function() {
                        $(document).on("click", "#display_value_" + i, function() {
                            this.value = !!$(this).is(":checked")
                        })
                    }.bind(this)), $(document).on("click", "#gauge_add_range_" + i, function() {
                        var e = "widget_params_config_" + i;
                        widgetHelperFunctions.gaugePlusButtonHelper(e, i)
                    })
                }
                $(this.optionsModal).find(".mutuallyexclusive").change(function(e) {
                    var t = $(e.target),
                        n = t.attr("id");
                    t.parents("div.modal-body").find(".mutuallyexclusive").each(function(e, t) {
                        t.id !== n && $(t).val("")
                    })
                }), this.reset_options()
            }
            return this
        }, this.widget_options_modal_open = function() {
            $(".error_banner").hide();
            var e = this.id,
                t = this.channel_id,
                n = this.content_id,
                i = "widget_options_modal_content_body_",
                a = "/channels/" + t + "/widgets/" + n + "/edit.json";
            $("#" + i).hide(), $.ajax({
                method: "GET",
                url: a,
                success: function(t) {
                    $("#" + i).show(), ThingSpeak.Widget.constructConfigModal({
                        params: JSON.parse(t.parameters),
                        enabled_fields: t.enabled_fields
                    }, t.widget_type, i, e)
                },
                error: function() {
                    $("#" + i).innerHTML = "Failed to fetch value from the server."
                }
            })
        }, this.update_widget_params = function() {
            var e = $("#widget_type_metadata_" + this.id).html(),
                t = $("#window_widget_options_modal_" + this.id).find("#gauge_min_max_error"),
                i = $("#window_widget_options_modal_" + this.id).find("#units_error"),
                a = widgetHelperFunctions.validateAndGetWidgetData(e, t, i, this.id);
            if (!a) return !1;
            n.updateWidget(this.id, this.content_id, this.channel_id, a)
        }, this.update_options = function() {
            var e = function() {
                    var e = {},
                        t = function() {
                            var t = this.id.split("_")[1],
                                n = $(this).val();
                            "" != (n = "string" == typeof n ? n.trim() : n) && (e[t] = n)
                        };
                    return this.optionsModal.find(".form-control").each(t), e
                }.bind(this),
                t = function(e) {
                    this.iframe_html = e.iframe_html, this.iframe_src = e.iframe_src, this.options = e.options, this.options_json = JSON.parse(e.options_json), $(this.iframe)[0].src = this.iframe_src, $(this.iframeModal).find("pre").text(this.iframe_html), $(this.optionsModal).modal("hide")
                }.bind(this),
                n = {
                    window_update: "chart_options",
                    options: e()
                },
                i = function(e) {
                    switch (e.status) {
                        case 401:
                            location.href = "/login";
                            break;
                        default:
                            location.reload()
                    }
                };
            this.post(n, "json", t, i)
        }, this.reset_options = function() {
            var e = this.options_json,
                t = function() {
                    var t = this.id.split("_")[1];
                    $(this).val(e[t])
                };
            this.optionsModal.find(".form-control").each(t)
        }, this.remove = function() {
            var e = !0;
            if ("widget" == this.content_type && (e = confirm("Are you sure you want to delete this widget?")), e) {
                $(this.container).remove();
                var t = {
                    window_update: "remove"
                };
                this.post(t, "script")
            }
        }, this.post = function(e, t, n, i) {
            $.ajax({
                method: "PUT",
                url: this.url,
                data: e,
                dataType: t
            }).done(n).error(i)
        }, this.initialize(e, t)
    }
    var t = function(e, t) {
            data = {
                window: t
            }, $.ajax({
                method: "POST",
                url: "/channels/" + e + "/windows/create_widget",
                data: data,
                dataType: "script",
                error: function(e) {
                    400 == e.status && n.showErrorBanner(e)
                }
            })
        },
        n = {
            updateWidget: function(e, t, i, a) {
                widgetHelperFunctions.updateName("#widget_params_config_" + e, e);
                var r = "/channels/" + i + "/widgets/" + t,
                    o = {
                        paramData: a
                    };
                $.ajax({
                    method: "PUT",
                    data: o,
                    url: r,
                    success: function() {
                        document.getElementById("window_iframe_" + e).src += ""
                    },
                    error: function(e) {
                        400 == e.status && n.showErrorBanner(e)
                    }
                })
            },
            showErrorBanner: function(e) {
                document.getElementById("widget-config-err-msg").innerHTML = JSON.parse(e.responseText).error_message, $("#invalid_widget_parameter").show()
            }
        };
    return {
        init: function(t, n) {
            return new e(t, n)
        },
        addVisualizations: function(e, t) {
            data = {
                windows: JSON.stringify(t)
            }, $.ajax({
                method: "POST",
                url: "/channels/" + e + "/windows",
                data: data,
                dataType: "script"
            })
        },
        addWidgetWindow: t
    }
}(), $(document).on("page:load ready", function() {
    function e() {
        1 == visualization_public_flag ? ($("#url_checkbox").attr("checked", "checked"), r()) : ($("#url_checkbox").removeAttr("checked"), o())
    }
    if (elementPresent($("#channel_ids")) || elementPresent($("#visualization_url_div"))) {
        if (elementPresent($("#results_container")) && pluginDisplaySettings.hidePlotAndCodeOutput(), elementPresent($("#channel_listings_parent_div")) && (pluginDisplaySettings.populateShowChannels(), pluginDisplaySettings.toggleFontAwesomePlusSign()), elementPresent($("#channel_ids"))) {
            JSON.parse($("#channel_ids").val());
            var t = JSON.parse($("#public_channel_ids").val()),
                n = $("#visualization_is_private_text").val()
        }
        var i = {
                displaySharingError: function() {
                    $("#visualization_name_empty_error").show()
                },
                displayFlagSaveError: function() {
                    $("#visualization_flag_save_error").show()
                }
            },
            a = {
                setCheckbox: function() {
                    auto_update_matlab_visualization ? $("#auto_update_checkbox").attr("checked", "checked") : $("#auto_update_checkbox").removeAttr("checked")
                },
                savePreference: function(e) {
                    var t = auto_update_matlab_visualization_url,
                        n = {
                            auto_update_matlab_visualization: e
                        };
                    $.ajax({
                        url: t,
                        method: "PUT",
                        data: n
                    }).fail(function() {
                        alerts.displayErrorAlert("auto_update_matlab_visualization_save_error")
                    })
                }
            },
            r = function() {
                $("#visualization_URL").prop("placeholder", ""), $("#visualization_URL").prop("value", visualization_public_url), document.getElementById("visualization_URL").style.cursor = "default", $("#copy_button").show(), $("#visualization_child_div").addClass("input-group")
            },
            o = function() {
                $("#visualization_URL").prop("placeholder", ""), $("#visualization_URL").prop("value", ""), document.getElementById("visualization_URL").style.cursor = "not-allowed", $("#copy_button").hide()
            };
        elementPresent($("#visualization_url_div")) && e(), elementPresent($("#visualization_auto_update")) && (a.setCheckbox(), $("#auto_update_checkbox").click(function() {
            a.savePreference(this.checked)
        })), $("#auto_update_matlab_visualization_save_error_close").on("click", function() {
            alerts.hideBanners(this.parentElement.id)
        }), $("#visualization_text_field").on("change", function() {
            $(this).val().trim() ? (saveType = "mouseClick", this.form.save.click()) : i.displaySharingError()
        }), $("#visualization_text_field").on("keypress", function(e) {
            13 == e.keyCode && (e.preventDefault(), $(this).val().trim() ? (saveType = "enter", this.form.save.click()) : i.displaySharingError())
        }), $("#url_checkbox").on("click", function() {
            if (this.checked) {
                if (visualization_public_flag = !0, elementPresent($("#channel_ids")))
                    for (var e = 0; e < t.length; e++) $("#public_" + t[e]).attr("disabled", !1).removeAttr("title")
            } else if (visualization_public_flag = !1, elementPresent($("#channel_ids")))
                for (e = 0; e < t.length; e++) $("#public_" + t[e]).attr("checked", !1).attr("title", n).attr("disabled", !0);
            s(!visualization_public_flag), l()
        });
        var s = function(e) {
                1 == e ? o() : r()
            },
            l = function() {
                var e = save_public_flag_url,
                    t = {
                        public_flag: visualization_public_flag
                    };
                $.ajax({
                    url: e,
                    method: save_public_flag_url_http_verb,
                    data: t
                }).fail(function() {
                    i.displayFlagSaveError()
                })
            };
        elementPresent($("#channel_ids")) && ($.tablesorter.addParser({
            id: "checkbox",
            is: function() {
                return !1
            },
            format: function(e, t, n) {
                return $(n).children().last().is(":checked") ? 1 : 0
            },
            type: "numeric"
        }), $("#add_to_channel_table").tablesorter({
            headers: {
                2: {
                    sorter: "checkbox"
                },
                3: {
                    sorter: "checkbox"
                }
            },
            widgets: ["stickyHeaders"],
            widgetOptions: {
                stickyHeaders_attachTo: ".add-to-channel-table"
            },
            initialized: function(e) {
                var t = !1;
                $(e).find("input[type=checkbox]").each(function() {
                    $(this).bind("change", function() {
                        $(e).trigger("updateCell", [$(this).closest("td")[0], t])
                    })
                })
            }
        }))
    }
});
elementPresent = function(e) {
    return "string" == typeof e ? 0 !== $(e).length : 0 !== e.length
};
var pluginDisplaySettings = {
        populateShowChannels: function() {
            $("#channels_list").html(""), selected = !1;
            for (var e, t = document.getElementById("add_to_channel_table"), n = 1; e = t.rows[n]; n++) {
                arr = [];
                for (var i, a = 0; i = e.cells[a]; a++) arr[a] = a < 2 ? i.innerHTML : i.getElementsByTagName("input")[1].checked;
                channel_name = arr[0], channel_id = arr[1], private_view_checkbox_val = arr[2], public_view_checkbox_val = arr[3], is_private = !0 === private_view_checkbox_val ? "private view" : "", "" === is_private ? is_public = !0 === public_view_checkbox_val ? "public view" : "" : is_public = !0 === public_view_checkbox_val ? ", public view" : "", 1 != ("" === is_private && "" === is_public) && (selected = !0, "private view" === is_private ? $("#channels_list").append('<li class="list-group-item list-group-channels list-group-item-light"><a href="/channels/' + channel_id + '/private_show">' + channel_name + "</a> (" + channel_id + ") - " + is_private + is_public + "</li>") : $("#channels_list").append('<li class="list-group-item list-group-channels list-group-item-light"><a href="/channels/' + channel_id + '/">' + channel_name + "</a> (" + channel_id + ") - " + is_public + "</li>"))
            }
            selected || ($("#channels_list").html(""), $("#channels_list").append('<li class="list-group-item list-group-channels list-group-item-light"> None </li>'))
        },
        toggleFontAwesomePlusSign: function() {
            $(".collapse").on("show.bs.collapse", function() {
                $(this).parent().find(".fa").removeClass("fa-plus").addClass("fa-minus")
            }).on("hide.bs.collapse", function() {
                $(this).parent().find(".fa").removeClass("fa-minus").addClass("fa-plus")
            })
        },
        hidePlotAndCodeOutput: function() {
            is_error ? ($("#feval_container").show(), $("#eval_container").show()) : ($("#feval_container").hide(), $("#eval_container").hide())
        }
    },
    usageVisualizationCharts = null;
UsageVisualizations = function() {
    function e(e, t) {
        var n = new Date;
        n = new Date(n.getFullYear(), n.getMonth(), n.getDate());
        for (var i = 0, a = 0, r = 0; r < e.units.length; r++)
            if (e.units[r].endDate !== undefined && new Date(e.units[r].endDate).getTime() + 86400 >= n.getTime() && e.units[r].qty !== undefined && (i += e.units[r].qty * t, e.units[r].usages !== undefined))
                for (var o = 0; o < e.units[r].usages.length; o++)
                    if (e.units[r].usages[o].months !== undefined)
                        for (var s = 0; s < e.units[r].usages[o].months.length; s++) e.units[r].qty > 0 && (a += e.units[r].usages[o].months[s]);
        var l = {};
        return l[0] = i, l[1] = a, l
    }

    function t(t, n) {
        var i = {
                0: "Invalid Date",
                1: "Unknown Monthly Usage"
            },
            a = new Date,
            o = new Date(a.getTime() - 30 * r);
        o < new Date("2016-12-05") && (o = new Date("2016-12-05"));
        var s = o.getYear() + 1900,
            l = a.getMonth() - 1,
            u = o.getMonth();
        if (l < 1 && (l = 12), t === undefined || t.units === undefined) return i;
        for (var d = 0, c = [], h = 0, p = 0; p < t.units.length; p++)
            if (t.units[p].usages !== undefined)
                for (var f = 0; f < t.units[p].usages.length; f++)
                    if (t.units[p].usages[f].year !== undefined && t.units[p].usages[f].year >= s && t.units[p].usages[f].months !== undefined)
                        for (var m = 0; m < t.units[p].usages[f].months.length; m++)
                            if (m >= u && m <= l) {
                                var g = new Date(t.units[p].endDate);
                                t.units[p].qty > 0 && g >= o && (c[h] = [t.units[p].usages[f].year, m], h += 1, d += t.units[p].usages[f].months[m])
                            } var _, v = [];
        for (p = 0; p < c.length; p++) {
            _ = 0;
            for (f = 0; f < v.length; f++) c[p][0] === v[f][0] && c[p][1] === v[f][1] && (_ = 1);
            0 === _ && v.push(c[p])
        }
        var y = 0;
        v.length > 0 && (y = d / v.length);
        var w = e(t, n),
            b = w[0],
            $ = w[1],
            k = new Date((new Date).getTime() + 366 * r);
        return y > 0 && (k = new Date((new Date).getTime() + 30 * r * Math.floor((b - $) / y))), "Invalid Date" === k.toDateString() && (k = new Date((new Date).getTime() + 366 * r)), i[0] = k, i[1] = y, i
    }

    function n(e, n, i) {
        var a = 0,
            u = 3e6,
            d = 0,
            c = 1,
            h = 0;
        i !== undefined && i.userType !== undefined && (a = parseInt(i.userType)), i !== undefined && i.number_of_messages_per_unit !== undefined && (u = parseInt(i.number_of_messages_per_unit)), i !== undefined && i.display_recommended_units !== undefined && (d = parseInt(i.display_recommended_units)), i !== undefined && i.proposed_num_of_units !== undefined && (c = parseInt(i.proposed_num_of_units), h = 1), c < 1 && (c = 1);
        var p = {
            chart: {
                renderTo: n,
                animation: !1,
                type: "column"
            },
            title: {
                text: null
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Messages remaining"
                },
                stackLabels: {
                    enabled: !1,
                    style: {
                        fontWeight: "bold"
                    }
                }
            },
            legend: {
                align: "right",
                x: -30,
                verticalAlign: "top",
                y: 25,
                floating: !0,
                backgroundColor: Highcharts.theme && Highcharts.theme.background2 || "white",
                borderColor: "#CCC",
                borderWidth: 1,
                shadow: !1,
                layout: "vertical"
            },
            tooltip: {
                headerFormat: "<b>{point.x}</b><br/>",
                pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
            },
            plotOptions: {
                column: {
                    stacking: "normal",
                    dataLabels: {
                        enabled: !1
                    }
                }
            },
            series: [],
            credits: {
                enabled: !1
            }
        };
        if (e === undefined) return p.chart.height = 120, p.yAxis.title.text = null, usageVisualizationCharts = new Highcharts.Chart(p), 1 === d ? usageVisualizationCharts.showLoading("Not enough data has been collected to display monthly data usage or recommend number of units required at current usage rate. A chart will be populated after at least one month of data has been collected.") : usageVisualizationCharts.showLoading("Not enough data has been collected to display monthly data usage. A chart with monthly usage information will be populated after at least one month of data has been collected."), c;
        if (e.units === undefined || 0 === e.units.length) return p.chart.height = 120, p.yAxis.title.text = null, (usageVisualizationCharts = new Highcharts.Chart(p)).showLoading("This license does not appear to have any available ThingSpeak units."), c;
        var f = 0;
        for (S = 0; S < e.units.length; S++) e.units[S].endDate !== undefined && e.units[S].qty > 0 && e.units[S].usages.length > 0 && (f += 1);
        if (0 === f) return p.chart.height = 120, p.yAxis.title.text = null, usageVisualizationCharts = new Highcharts.Chart(p), 1 === d ? usageVisualizationCharts.showLoading("Not enough data has been collected to display monthly data usage or recommend number of units required at current usage rate. A chart will be populated after at least one month of data has been collected.") : usageVisualizationCharts.showLoading("A chart with monthly usage information will be populated after at least one month of data has been collected."), c;
        if (h && d) {
            var m = {},
                g = new Date;
            m.id = 0, m.qty = c;
            var _ = g.getFullYear(),
                v = g.getMonth() + 1,
                y = g.getDate();
            v < 10 && (v = "0" + v), v > 11 && (v = "01", _ += 1), y < 10 && (y = "0" + y), m.startDate = _ + "-" + v + "-" + y;
            var w = new Date(g.getTime() + 365 * r),
                b = w.getFullYear(),
                $ = w.getMonth() + 1,
                k = w.getDate();
            $ < 10 && ($ = "0" + $), $ > 11 && ($ = "01", b += 1), k < 10 && (k = "0" + k), m.endDate = b + "-" + $ + "-" + k;
            var x = [{}];
            x[0].year = g.getFullYear(), x[0].months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], m.usages = x, e.units.push(m)
        }
        for (var E = new Date, T = new Date(e.units[0].endDate), S = 0; S < e.units.length; S++) {
            if (e.units[S].endDate !== undefined && e.units[S].qty > 0) E < (V = new Date(e.units[S].endDate)) && (E = new Date(V.getTime())), T > new Date(e.units[S].startDate) && (T = new Date(e.units[S].startDate))
        }
        var C = t(e, u),
            D = C[0],
            P = C[1];
        ("Invalid Date" === D.toDateString() || D >= E) && (D = E);
        var L = new Date(Math.max(D.getTime(), E.getTime()) + 31 * r),
            M = new Date(L - 424 * r);
        M < T && (M = T);
        var A = [];
        for (S = 0; S < e.units.length; S++)
            if (e.units[S].qty > 0 && new Date(e.units[S].endDate) >= M) {
                var R = [],
                    q = [],
                    F = M,
                    I = 0;
                if (0 === e.units[S].usages.length) {
                    var N = M.getMonth(),
                        H = M.getFullYear();
                    do {
                        q.push(0), F = new Date(H + "-" + s[N][0] + "-" + s[N][1]), (N += 1) > 11 && (N = 0, H += 1)
                    } while (F < L);
                    q.splice(q.length - 1);
                    var U = M.getMonth() + 1;
                    U < 10 && (U = "0" + U);
                    var j = M.getDate();
                    j < 10 && (j = "0" + j), R = [e.units[S].id, e.units[S].qty, e.units[S].startDate, e.units[S].endDate, M.getFullYear() + "-" + U + "-" + j, q, I]
                } else {
                    for (ae = 0; ae < e.units[S].usages.length && e.units[S].usages[ae].year !== M.getFullYear(); ae++);
                    N = M.getMonth(), H = M.getFullYear();
                    do {
                        F = new Date(H + "-" + s[N][0] + "-" + s[N][1]), e.units[S].usages.length > ae && e.units[S].usages[ae].months !== undefined && e.units[S].usages[ae].months.length >= N ? q.push(e.units[S].usages[ae].months[N]) : q.push(0), (N += 1) > 11 && (N = 0, H += 1, ae += 1)
                    } while (F < L);
                    q.splice(q.length - 1);
                    var B = M.getMonth() + 1;
                    B < 10 && (B = "0" + B);
                    var O = M.getDate();
                    O < 10 && (O = "0" + O), R = [e.units[S].id, e.units[S].qty, e.units[S].startDate, e.units[S].endDate, M.getFullYear() + "-" + B + "-" + O, q, I]
                }
                for (var z = new Date(e.units[S].startDate), V = new Date(e.units[S].endDate), W = 0, Y = 0; Y < e.units[S].usages.length; Y++)
                    for (var G = 0; G < e.units[S].usages[Y].months.length; G++) {
                        var J = G >= z.getMonth(),
                            Q = e.units[S].usages[Y].year >= z.getFullYear(),
                            K = G < M.getMonth(),
                            X = e.units[S].usages[Y].year <= M.getFullYear();
                        J && Q && K && X && (W += e.units[S].usages[Y].months[G])
                    }
                var Z = e.units[S].qty * u - W;
                W === u && (R[6] = 1), R[5][0] = Z, A.push(R)
            } for (S = 0; S < A.length - 1; S++)
            if (new Date(A[S][3]) > new Date(A[S + 1][3])) {
                var ee = A[S];
                A[S] = A[S + 1], A[S + 1] = ee
            } var te = [],
            ne = [];
        for (S = 0; S < A.length; S++) {
            var ie, ae = 1,
                re = 0,
                oe = 0,
                se = new Date,
                le = se.getMonth() + 1;
            le < 10 && (le = "0" + le), se = new Date(se.getFullYear() + "-" + le + "-" + s[se.getMonth()][1]);
            do {
                if (ie = new Date(A[S][4]), re = new Date(A[S][4]).getMonth() + ae, oe = Math.floor(re / 12), (de = (re %= 12) + 1) < 10 && (de = "0" + de), (ie = new Date(ie.getFullYear() + oe + "-" + de + "-" + s[re][1])) >= se) break;
                A[S][5][ae] = A[S][5][ae - 1] - A[S][5][ae], A[S][5][ae] < 0 && (A[S][5][ae] = 0), ae += 1
            } while (ie < se && ie < new Date(A[S][3]));
            ne[S] = A[S].slice(), ne[S][5] = A[S][5].slice();
            for (var ue = 0; ue < l; ue++) ne[S][5][ue] = 0;
            var de;
            I = 0;
            (de = re = new Date(ne[S][4]).getMonth() + 1) < 10 && (de = "0" + de);
            var ce = new Date(new Date(ne[S][4]).getFullYear() + "-" + de + "-" + s[re - 1][1]);
            if (new Date(ne[S][3]) > new Date && 0 === I && (0 === S || te.length > 0 && ce > te[0] ? (ne[S][5][ae] = A[S][5][ae - 1] - P, ne[S][5][ae] < 0 && (ne[S][5][ae] = 0, te[0] = ce, te[1] = 0)) : ne[S][5][ae] = A[S][5][ae - 1], ne[S][5][ae] > 0))
                for (ue = ae + 1; ue < l - 1; ue++) {
                    oe = 0, re = new Date(ne[S][4]).getMonth() + ue, oe = Math.floor(re / 12), (de = (re %= 12) + 1) < 10 && (de = "0" + de), ce = new Date(new Date(ne[S][4]).getFullYear() + oe + "-" + de + "-" + s[re][1]);
                    var he = new Date(ne[S][3]),
                        pe = he.getMonth() + 1;
                    pe < 10 && (pe = "0" + pe);
                    var fe = he.getUTCDate();
                    if (fe < 10 && (fe = "0" + fe), he = new Date(he.getFullYear() + "-" + pe + "-" + fe), ce.getMonth() > he.getMonth() && ce.getFullYear() >= he.getFullYear()) {
                        te[0] = new Date(ce.getTime()), ne[S][5][ue - 1] > P ? te[1] = 0 : te[1] = ne[S][5][ue - 1] - P;
                        break
                    }
                    if (0 === S || te.length > 0 && ce >= te[0] ? ne[S][5][ue] = ne[S][5][ue - 1] - P : ne[S][5][ue] = ne[S][5][ue - 1], ne[S][5][ue] < 0 && (ne[S][5][ue] = 0, 0 === I)) {
                        te[0] = new Date(ce.getTime()), te[1] = -ne[S][5][ue], I = 1;
                        break
                    }
                }
        }
        for (S = 0; S < A.length - 1; S++)
            if (new Date(A[S][3]) > new Date(A[S + 1][3])) {
                ee = A[S];
                A[S] = A[S + 1], A[S + 1] = ee;
                var me = ne[S];
                ne[S] = ne[S + 1], ne[S + 1] = me
            } var ge = 0;
        do {
            ge = 0;
            for (S = 0; S < A.length; S++) 1 === A[S][6] && (A.splice(S, 1), ne.splice(S, 1), ge = 1)
        } while (1 === ge);
        for (S = 0; S < A.length; S++) {
            var _e = [];
            M = new Date(A[S][4]);
            for (ae = 0; ae < l; ae++) {
                var ve = M.getFullYear(),
                    ye = M.getMonth() + ae;
                ve += Math.floor(ye / 12), ye %= 12, _e.push([new Date(ve + "-" + s[ye][0][0] + "-" + s[ye][0][1]), A[S][5][ae]])
            }
            var we = {};
            we.name = 3 == a ? "Remaining messages (purchase " + A[S][2] + ")" : "Remaining messages (free messages start date " + A[S][2] + ")", we.data = _e, we.color = "rgba(" + o[S % o.length][0] + "," + o[S % o.length][1] + "," + o[S % o.length][2] + ",1)", p.series.push(we)
        }
        for (S = 0; S < ne.length; S++) {
            _e = [], M = new Date(ne[S][4]);
            for (ae = 0; ae < l; ae++) ve = M.getFullYear(), ye = M.getMonth() + ae, ve += Math.floor(ye, 12), ye %= 12, _e.push([new Date(ve + "-" + s[ye][0][0] + "-" + s[ye][0][1]), ne[S][5][ae]]);
            var be = {};
            be.name = 3 == a ? "Projected# messages remaining (purchase " + ne[S][2] + ")" : "Projected# messages remaining (free messages renewal date " + ne[S][2] + ")", be.data = _e, be.color = "rgba(" + o[S % o.length][0] + "," + o[S % o.length][1] + "," + o[S % o.length][2] + ",0.25)", p.series.push(be)
        }
        for (var $e = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ke = new Date(M), xe = ke.getMonth(), Ee = ke.getFullYear(), Te = 0; Te < l;) p.xAxis.categories.push($e[xe] + " " + Ee), ++xe > 11 && (xe = 0, Ee += 1), Te++;
        return p.series.reverse(), usageVisualizationCharts = new Highcharts.Chart(p), h && d && e.units.pop(), c
    }

    function i(e, t, n, i) {
        n !== undefined && n.userType !== undefined && parseInt(n.userType), n !== undefined && n.number_of_messages_per_unit !== undefined && parseInt(n.number_of_messages_per_unit), n !== undefined && n.display_recommended_units !== undefined && parseInt(n.display_recommended_units), n !== undefined && n.proposed_num_of_units !== undefined && parseInt(n.proposed_num_of_units), i = i !== undefined ? parseInt(i) : Infinity;
        var a = {
                chart: {
                    renderTo: t,
                    animation: !1
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: "datetime",
                    labels: {
                        rotation: -45
                    },
                    dateTimeLabelFormats: {
                        day: "%e-%b-%Y"
                    },
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Messages used per day"
                    },
                    stackLabels: {
                        enabled: !1,
                        style: {
                            fontWeight: "bold",
                            color: Highcharts.theme && Highcharts.theme.textColor || "gray"
                        }
                    }
                },
                legend: {
                    align: "right",
                    x: -30,
                    verticalAlign: "top",
                    y: 25,
                    floating: !0,
                    backgroundColor: Highcharts.theme && Highcharts.theme.background2 || "white",
                    borderColor: "#CCC",
                    borderWidth: 1,
                    shadow: !1,
                    layout: "vertical",
                    enabled: !0
                },
                tooltip: {
                    formatter: function() {
                        return 1 !== this.y ? messageText = "messages" : messageText = "message", "<b>" + this.y + " " + messageText + "</b> used on " + Highcharts.dateFormat("%e-%b-%Y", new Date(this.x))
                    }
                },
                plotOptions: {
                    column: {
                        stacking: "normal",
                        events: {
                            legendItemClick: function() {
                                return !1
                            }
                        },
                        showInLegend: !1,
                        dataLabels: {
                            enabled: !1,
                            color: Highcharts.theme && Highcharts.theme.dataLabelsColor || "white",
                            style: {
                                textShadow: "0 0 3px black"
                            }
                        }
                    }
                },
                series: [{
                    name: "Daily ThingSpeak message usage",
                    data: [],
                    marker: {
                        enabled: !1
                    },
                    enableMouseTracking: !0,
                    type: "column",
                    color: "rgba(6,154,71,1)"
                }],
                credits: {
                    enabled: !1
                }
            },
            o = [],
            s = new Date;
        s = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, -1 * s.getTimezoneOffset());
        var l = new Date(s - u * r);
        if (e === undefined || e.startDate === undefined || e.datapoints === undefined || 0 === e.datapoints) return a.chart.height = 120, a.yAxis.title.text = null, a.xAxis.lineWidth = 0, void(usageVisualizationCharts = new Highcharts.Chart(a)).showLoading("Not enough data has been collected to display daily data usage. A chart with daily usage information will be populated after at least one day of data has been collected.");
        for (var d = new Date(e.startDate).getTime(), c = Math.round((l - d) / r), h = Math.max(0, c), p = 0, f = h; f < e.datapoints; f++) {
            var m = new Date(l.valueOf() + (f - c) * r);
            o[f - h] = [m.getTime(), e.usages[f]], parseInt(e.usages[f]) > p && (p = e.usages[f])
        }
        if (0 === o.length && (o[0] = [l.getTime(), 0]), o.length < u)
            for (f = o.length; f < u; f++) m = new Date(o[f - 1][0] + 1 * r), o[f] = [m.getTime(), 0];
        a.series[0].data = o, usageVisualizationCharts = new Highcharts.Chart(a), p > .95 * i && (usageVisualizationCharts.addSeries({
            name: "Recommended maximum daily usage based on your annual capacity",
            data: [
                [l.getTime(), i],
                [s.getTime(), i]
            ],
            marker: {
                enabled: !1
            },
            enableMouseTracking: !1,
            type: "line",
            color: "rgba(0,0,0,0.7)",
            dashStyle: "shortdot",
            events: {
                legendItemClick: function() {
                    return !1
                }
            }
        }), usageVisualizationCharts.addSeries({
            name: "",
            data: [
                [s.getTime(), 1.2 * p]
            ],
            marker: {
                enabled: !1
            },
            enableMouseTracking: !1,
            type: "line",
            color: "rgba(0,0,0,0)",
            showInLegend: !1,
            events: {
                legendItemClick: function() {
                    return !1
                }
            },
            visible: !0
        }))
    }

    function a(t, n, i) {
        var a = 3e6;
        i !== undefined && i.userType !== undefined && parseInt(i.userType), i !== undefined && i.number_of_messages_per_unit !== undefined && (a = parseInt(i.number_of_messages_per_unit)), i !== undefined && i.display_recommended_units !== undefined && parseInt(i.display_recommended_units), i !== undefined && i.proposed_num_of_units !== undefined && parseInt(i.proposed_num_of_units);
        var r = {};
        if (r.Date = new Date((new Date).setFullYear((new Date).getFullYear() + 1)), r.DateType = "Expiration Date", r.DailyUsageRate = 0, n === undefined || n.usages === undefined || 0 === n.usages.length) return r;
        if (t === undefined || t.units === undefined || 0 === t.units.length) return r;
        for (var o = new Date("2016-12-05"), s = 0; s < t.units.length; s++)
            if (t.units[s].qty > 0 && t.units[s].endDate !== undefined && new Date(t.units[s].endDate) > o) {
                var l = Date.UTC(t.units[s].endDate.split("-")[0], t.units[s].endDate.split("-")[1] - 1, t.units[s].endDate.split("-")[2]);
                o = new Date(l + 60 * new Date(Date.now()).getTimezoneOffset() * 1e3)
            } var u = new Date,
            d = u.getDate(),
            c = 0;
        for (s = 1; s < d; s++) c += parseInt(n.usages[n.usages.length - s]);
        var h = e(t, a),
            p = h[0] - (h[1] + c),
            f = 0,
            m = 0,
            g = 0,
            _ = 0;
        for (s = 1; s < 31; s++) f += parseInt(n.usages[n.usages.length - s]), s < 16 && (m += parseInt(n.usages[n.usages.length - s])), s < 8 && (g += parseInt(n.usages[n.usages.length - s])), s < 2 && (_ += parseInt(n.usages[n.usages.length - s]));
        var v = Math.ceil(f / 30),
            y = Math.ceil(m / 15),
            w = Math.ceil(g / 7),
            b = _,
            $ = 1e-6;
        0 == v && (v = $), 0 == y && (y = $), 0 == w && (w = $), 0 == b && (b = $);
        var k = Math.floor(p / v),
            x = Math.floor(p / y),
            E = Math.floor(p / w),
            T = Math.floor(p / b);
        k > 365 && (k = 365), x > 365 && (x = 365), E > 365 && (E = 365), T > 365 && (T = 365);
        var S = (new Date).getTime(),
            C = 864e5,
            D = new Date(S + k * C),
            P = v;
        return p < 15 * y && (D = new Date(S + x * C), P = y), p < 7 * w && (D = new Date(S + E * C), P = w), p < b && (D = new Date(S + T * C), P = b), (D < u || p < 0) && (D = u), o < D || o.getFullYear() == D.getFullYear() && o.getMonth() == D.getMonth() && o.getDate() == D.getDate() ? (r.Date = o, r.DateType = "Expiration Date") : (r.Date = D, r.DateType = "Exhaustion Date"), r.DailyUsageRate = Math.round(P), r
    }
    var r = 864e5,
        o = [
            [0, 114, 189],
            [217, 83, 25],
            [237, 177, 32],
            [126, 47, 142],
            [119, 172, 48],
            [77, 190, 238],
            [162, 20, 47]
        ],
        s = [
            ["01", 31],
            ["02", 28],
            ["03", 31],
            ["04", 30],
            ["05", 31],
            ["06", 30],
            ["07", 31],
            ["08", 31],
            ["09", 30],
            ["10", 31],
            ["11", 30],
            ["12", 31]
        ],
        l = 14,
        u = 32;
    return {
        updateDailyUsageChart: i,
        updateMonthlyUsageChart: n,
        estimateExhaustionOrExpirationDate: a
    }
}(), $(document).on("page:load ready", function() {
    var e;
    0 !== $("#sales_div").length && (e = user_info.is_free_user ? user_info.free_license_id : user_info.is_a_staff ? user_info.staff_license_id : $("#select_license").is("label") ? $("#select_license").html() : $("#select_license").val(), loadAccountsPage(e), $("#select_license").change(function() {
        loadAccountsPage($("#select_license").val())
    }), $('a[data-toggle="tab"]').on("shown.bs.tab", function() {
        usageVisualizationCharts && usageVisualizationCharts.reflow();
        var e, t, n = /(width: )\w+/,
            i = document.getElementById("myTabContent").offsetWidth - 50;
        (t = $(".highcharts-container").attr("style")) !== undefined && (e = t.replace(n, "width: " + i + "px"), $(".highcharts-container").attr("style", e)), (t = $(".highcharts-loading").attr("style")) !== undefined && (e = t.replace(n, "width: " + i + "px"), $(".highcharts-loading").attr("style", e))
    }))
});
var formatToLocale = function(e) {
        return e = isNaN(parseInt(e)) ? "" : e.toLocaleString()
    },
    accountsPageHelperFunctions = {
        setLicenseType: function(e) {
            for (i = 0; i < license_types.length; i++)
                if (license_types[i].hasOwnProperty(e)) {
                    $("#license_type").html(license_types[i][e]);
                    break
                }
        },
        setDivsForFreeUser: function() {
            $(".admin_div").hide(), $(".leu_div").hide(), $(".nde_leu_div").hide(), $(".nde_admin_div").hide(), $(".free_user_div").show(), $(".staff_div").hide()
        },
        populateFreeUserTable: function() {
            var e, t, n, i = {
                    "01": "Jan",
                    "02": "Feb",
                    "03": "Mar",
                    "04": "Apr",
                    "05": "May",
                    "06": "Jun",
                    "07": "Jul",
                    "08": "Aug",
                    "09": "Sep",
                    10: "Oct",
                    11: "Nov",
                    12: "Dec"
                },
                a = user_info.licenses[0].end_date.split("-");
            e = a[2], t = i[a[1]], n = a[0];
            var r = user_info.licenses[0].messages_remaining;
            $("#free_unit_expiration_date").html(e + " " + t + " " + n), $("#free_messages_available").html(formatToLocale(Math.round(user_info.free_messages_per_year))), $("#free_messages_remaining").html(formatToLocale(r)), null != channel_data && ($("#free_channels_available").html(channel_data[3]), $("#free_channels_remaining").html(channel_data[2]))
        },
        setLicenseUnavailableText: function() {
            var e = '<tr><td colspan="3"><span class="text-danger break-word">' + rI18n.license_details_tmp_unavail + "</span></td></tr>";
            $("#free_user_messages_table2").append(e)
        },
        setAccountsPageForFreeUser: function() {
            1 == user_info.has_exhausted && (is_shutOff = !0), accountsPageHelperFunctions.setDivsForFreeUser(), jQuery.isEmptyObject(user_info.licenses) ? accountsPageHelperFunctions.setLicenseUnavailableText() : accountsPageHelperFunctions.populateFreeUserTable(), $("#suggested_daily_usage_rate_free_user").html("&nbsp;" + formatToLocale(Math.round(user_info.free_messages_per_year / 365)) + "&nbsp;messages"), populateFreeUnitsLink(is_shutOff)
        },
        showErrorBanner: function() {
            $("#invalid_widget_type").show(), $("#configure_widget_parameters_modal").modal("toggle")
        },
        findChannelLimit: function(e, t) {
            return offering_id_limit_hash[e] * t
        }
    },
    loadAccountsPage = function(e) {
        null != license_types && accountsPageHelperFunctions.setLicenseType(e), setExhaustionAlertDefaults(), 1 == user_info.is_free_user ? accountsPageHelperFunctions.setAccountsPageForFreeUser() : ($(".free_user_div").hide(), jQuery.isEmptyObject(user_info.licenses) ? ($(".admin_div").hide(), $(".leu_div").hide(), $(".nde_leu_div").hide(), $(".nde_admin_div").hide(), $(".staff_div").hide(), $(".license_info_unavail_div").show()) : user_info.licenses.forEach(function(t) {
            if (t.license_id == e) {
                if (null != t.has_exhausted && (is_shutOff = !0), 1 == t.is_an_leu) {
                    is_leu = !0, 1 == t.is_an_nde_leu ? ($(".admin_div").hide(), $(".leu_div").hide(), $(".nde_admin_div").hide(), $(".nde_leu_div").show(), $(".staff_div").hide()) : t.is_a_staff ? ($(".admin_div").hide(), $(".nde_leu_div").hide(), $(".nde_admin_div").hide(), $(".leu_div").hide(), $(".staff_div").show()) : ($(".admin_div").hide(), $(".nde_leu_div").hide(), $(".nde_admin_div").hide(), $(".leu_div").show(), $(".staff_div").hide());
                    var n = !1;
                    user_info.licenses.forEach(function(e) {
                        0 == e.is_an_leu && (n = !0)
                    }), n ? $(".pricing_link").hide() : $(".pricing_link").show()
                } else 1 == t.is_an_nde_admin ? ($(".admin_div").hide(), $(".leu_div").hide(), $(".nde_leu_div").hide(), $(".staff_div").hide(), $(".nde_admin_div").show()) : ($(".leu_div").hide(), $(".nde_leu_div").hide(), $(".nde_admin_div").hide(), $(".staff_div").hide(), $(".admin_div").show()), drawUnitsTable(t, e), populatePurchaseUnitsLink(e);
                populateAlertMessages(e, is_shutOff)
            }
        })), drawMessageUsageCharts(e), populateLicenceCenterLink(e)
    },
    drawUnitsTable = function(e, t) {
        e.is_an_nde_admin ? (salesDiv = $("#sales_div_nde"), suggested_daily_rate = $("#suggested_daily_usage_rate_nde")) : (salesDiv = $("#sales_div"), suggested_daily_rate = $("#suggested_daily_usage_rate")), salesDiv.find("table").remove();
        var n = [],
            i = 0;
        user_info.licenses.forEach(function(e) {
            if (e.license_id == t) return i += 1, n = e.units, !1
        });
        var a, r, o, s, l, u = 0,
            d = [],
            c = [
                [0, 114, 189],
                [217, 83, 25],
                [237, 177, 32],
                [126, 47, 142],
                [119, 172, 48],
                [77, 190, 238],
                [162, 20, 47]
            ],
            h = 0,
            p = 0,
            f = new Date(1970, 1, 1),
            m = new Date(1970, 1, 1),
            g = null;
        null != channel_data && (g = channel_data[4][t]);
        i = 0;
        var _ = "",
            v = "",
            y = !1,
            w = "2019-02-13";
        n.forEach(function(e) {
            expirationDateUTC = Date.UTC(e.end_date.split("-")[0], e.end_date.split("-")[1] - 1, e.end_date.split("-")[2]), a = new Date(expirationDateUTC + 60 * new Date(Date.now()).getTimezoneOffset() * 1e3), null != g && (a >= new Date ? (y ? v = "N/A" : (_ = g[i][0], 0 === e.messages_remaining && e.start_date < w ? (v = "N/A", y = !0) : v = g[i][1]), i++) : (_ = accountsPageHelperFunctions.findChannelLimit(e.offering_id, e.qty), v = 0)), r = (a.getDate() < 10 ? "0" : "") + a.getDate(), o = a.toLocaleString("en-us", {
                    month: "short"
                }), s = a.getFullYear(), l = e.messages_allowed, messagesRemaining = e.messages_remaining,
                u += messagesRemaining;
            var t = "rgba(" + c[h][0] + "," + c[h][1] + "," + c[h][2] + ",1)",
                b = "<table><colgroup><col class='col-sm-2 col-xs-6'><col class='col-sm-4 col-xs-12'></colgroup><tr><td class='text-left'><label>Units:</label><label style='font-weight: normal'>" + e.qty + "</label></td><td class='text-right'><label>Expiration Date: &nbsp</label><label style='font-weight: normal;'> " + r + " " + o + " " + s + "&nbsp;<i class='fa fa-square units_box' style=color:" + t + " aria-hidden='true'></i></label></td></tr>" + ("<table class='table table-bordered table-sm text-center pricing_results'><colgroup><col class='col-sm-2 col-xs-6'><col class='col-sm-2 col-xs-6'><col class='col-sm-2 col-xs-6'></colgroup><thead class='text-center'><tr><th scope='col'></th><th scope='col' class='text-center'>Purchased</th><th scope='col' class='text-center'>Remaining</th></tr></thead><tbody><tr><th scope='row'>Messages</th><td>" + l + "</td><td>" + messagesRemaining + "</td></tr><th scope='row'>Channels</th><td>" + _ + "</td><td>" + v + "</td></tr></tbody></table>");
            h = (h + 1) % c.length, a > new Date ? (salesDiv.append(b), a > m && (m = a)) : (p += 1, a > f && (f = a, trHTMLMAX = b), p === n.length && salesDiv.append(trHTMLMAX)), checkForLicenseProdId(d, e, a)
        }), d.forEach(function(e) {
            checkForUnitExpiration(e)
        });
        var b = Math.abs((new Date).getTime() - m.getTime()),
            k = Math.ceil(b / 864e5);
        user_info.suggestedDailyRate = Math.round(u / k), suggested_daily_rate.html("&nbsp;" + formatToLocale(user_info.suggestedDailyRate) + "&nbsp;messages")
    },
    checkForLicenseProdId = function(e, t, n) {
        for (var i in e.push({
                key: t,
                value: n
            }), e) e[i].key.licensed_prod_id === t.licensed_prod_id && 1 != e.length && e[i].key.id != t.id && checkDateForRenewal(e[i], n, e, i)
    },
    checkDateForRenewal = function(e, t, n, i) {
        e.value < t ? n.splice(i, 1) : n.splice(-1, 1)
    },
    checkForUnitExpiration = function(e) {
        var t = Math.abs(new Date(e.value).getTime() - (new Date).getTime()),
            n = Math.ceil(t / 864e5),
            i = e.value.toISOString().split("T")[0] === (new Date).toISOString().split("T")[0];
        (e.value > new Date || i) && n <= 60 && renderRenewalsDiv(e)
    },
    renderRenewalsDiv = function(e) {
        $("#purchase_units_link").addClass("btn-default"), $("#renew_units_link").show();
        var t = '<div id="' + e.key.id + 'renewals_div" class="alert alert-danger alert-dismissable renewals_expiration_alert" style="display:none; clear:both"><a href="#" class="close" data-dismiss="alert" aria-label="close">X</a><span>User purchase made on <strong><span name="renewal_start_date" id="' + e.key.id + 'renewal_start_date"></span></strong> is going to expire on: <strong><span name="renewal_expiration_date" id="' + e.key.id + 'renewal_expiration_date"></span></strong>.<i class="fa fa-exclamation-triangle" aria-hidden="true"></i><a id="' + e.key.id + 'call_of_action_to_renew" class="exhaustion_alert" target="_blank">Renew units</a></span></div>';
        $("#exhaustion_div").append(t), $("#" + e.key.id + "renewal_start_date").text(moment(new Date(e.key.start_date)).format("LL")), $("#" + e.key.id + "renewal_expiration_date").text(moment(new Date(e.value)).format("LL")), populateRenewUnitsLink(e.key.id), $("#" + e.key.id + "renewals_div").show()
    },
    drawMessageUsageCharts = function(e) {
        $("#spinner_daily").show(), $("#spinner_monthly").show();
        var t = !1,
            n = 0;
        user_info.is_free_user || jQuery.isEmptyObject(user_info.licenses) || user_info.licenses.forEach(function(i) {
            i.license_id == e && (t = i.is_an_leu, n = i.total_remaining_messages_per_license)
        });
        var i = {
                daily: undefined,
                monthly: undefined
            },
            a = {
                userType: user_info.user_type
            };
        user_info.is_free_user ? (a.number_of_messages_per_unit = user_info.free_messages_per_year, a.messages_remaining = user_info.licenses[0].messages_remaining) : (a.number_of_messages_per_unit = user_info.messages_per_paid_unit, a.messages_remaining = n);
        var r = function(e) {
                i.daily = e, s(i), $("#spinner_daily").hide(), UsageVisualizations.updateDailyUsageChart(e, "dailyMessageUsage", a, user_info.suggestedDailyRate)
            },
            o = function(e) {
                i.monthly = e, s(i), $("#monthly_usage_tab").is(":visible") && ($("#spinner_monthly").hide(), UsageVisualizations.updateMonthlyUsageChart(e, "messageUnitUsage", a))
            },
            s = function(t) {
                t.daily && t.monthly && checkMessageExhaustion(e, user_info, user_info.is_free_user, i, !0, a)
            },
            l = 5e3,
            u = {
                url: "/account/daily_usage.json",
                cache: !1,
                data: {
                    lid: e,
                    is_an_leu: t
                },
                dataType: "json",
                timeout: l
            };
        $.ajax(u).done(r).fail(function(e) {
            304 != e.status ? $.ajax(u).done(r).fail(function() {
                $("#spinner_daily").hide(), $("#dailyMessageUsageTmpUnavail").show()
            }) : ($("#spinner_daily").hide(), $("#dailyMessageUsageTmpUnavail").show())
        }), monthlyAjaxOptions = {
            url: "/account/monthly_usage.json",
            cache: !1,
            data: {
                lid: e,
                is_an_leu: t
            },
            dataType: "json",
            timeout: l
        }, $.ajax(monthlyAjaxOptions).done(o).fail(function(e) {
            304 != e.status ? $.ajax(monthlyAjaxOptions).done(o).fail(function() {
                $("#spinner_monthly").hide(), $("#messageUnitUsageTmpUnavail").show()
            }) : ($("#spinner_monthly").hide(), $("#messageUnitUsageTmpUnavail").show())
        })
    },
    populateLicenceCenterLink = function(e) {
        var t = user_info.license_center_link;
        t = t.replace(":lid", encodeURIComponent(e)), $("#license_center_link").attr("href", t)
    },
    populateRenewUnitsLink = function(e) {
        var t = user_info.licenses[user_info.licenses.length - 1].license_id;
        renew_link = renew_units_link.replace(":lid", encodeURIComponent(t)), $("#" + e + "call_of_action_to_renew").attr("href", renew_link), $("#renew_units_link").attr("href", renew_link)
    };
$(document).on("page:load ready", function() {
    var e = -90;
    $(".flash").length > 0 && ($(".flash").on("click", function() {
        $(this).hide("slow")
    }), setTimeout(function() {
        $("div.flash.alert.alert-success").length > 0 && $(".flash").hide("slow")
    }, 15e3)), $("#talkback_command_add").click(function() {
        $(this).hide(), $("#talkback_command_add_form").removeClass("hide")
    }), $("#contact_link").click(function() {
        $("#contact_form").toggle()
    }), $(".tablesorter").length > 0 && $(".tablesorter").tablesorter(), $("#userlogin_js").val("6H2W6QYUAJT1Q8EB"), $("input").not(".maxlength_exempt").attr("maxlength", "80"), setTimeout(function() {
        if ("" !== window.location.hash) {
            var t = $(window.location.hash).offset().top + e;
            $(document).scrollTop(t)
        }
    }, 150)
});