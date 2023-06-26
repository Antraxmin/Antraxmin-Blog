/*!
 * Chirpy v6.0.1 (https://github.com/cotes2020/jekyll-theme-chirpy/)
 * © 2019 Cotes Chung
 * MIT Licensed
 */
!(function () {
  'use strict';
  function t(t, e) {
    if (!(t instanceof e))
      throw new TypeError('Cannot call a class as a function');
  }
  function e(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        'value' in n && (n.writable = !0),
        Object.defineProperty(t, i(n.key), n);
    }
  }
  function r(t, r, n) {
    return (
      r && e(t.prototype, r),
      n && e(t, n),
      Object.defineProperty(t, 'prototype', { writable: !1 }),
      t
    );
  }
  function n(t, e, r) {
    return (
      (e = i(e)) in t
        ? Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
          })
        : (t[e] = r),
      t
    );
  }
  function o(t) {
    return (
      (function (t) {
        if (Array.isArray(t)) return a(t);
      })(t) ||
      (function (t) {
        if (
          ('undefined' != typeof Symbol && null != t[Symbol.iterator]) ||
          null != t['@@iterator']
        )
          return Array.from(t);
      })(t) ||
      (function (t, e) {
        if (!t) return;
        if ('string' == typeof t) return a(t, e);
        var r = Object.prototype.toString.call(t).slice(8, -1);
        'Object' === r && t.constructor && (r = t.constructor.name);
        if ('Map' === r || 'Set' === r) return Array.from(t);
        if (
          'Arguments' === r ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
        )
          return a(t, e);
      })(t) ||
      (function () {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
      })()
    );
  }
  function a(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
    return n;
  }
  function i(t) {
    var e = (function (t, e) {
      if ('object' != typeof t || null === t) return t;
      var r = t[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(t, e || 'default');
        if ('object' != typeof n) return n;
        throw new TypeError('@@toPrimitive must return a primitive value.');
      }
      return ('string' === e ? String : Number)(t);
    })(t, 'string');
    return 'symbol' == typeof e ? e : String(e);
  }
  var l = $('.mode-toggle');
  var s = $('body'),
    u = 'sidebar-display',
    c = (function () {
      function e() {
        t(this, e);
      }
      return (
        r(e, null, [
          {
            key: 'toggle',
            value: function () {
              !1 === e.isExpanded ? s.attr(u, '') : s.removeAttr(u),
                (e.isExpanded = !e.isExpanded);
            }
          }
        ]),
        e
      );
    })();
  n(c, 'isExpanded', !1);
  var f = $('#sidebar-trigger'),
    d = $('#search-trigger'),
    m = $('#search-cancel'),
    p = $('#main>.row'),
    v = $('#topbar-title'),
    g = $('#search-wrapper'),
    b = $('#search-result-wrapper'),
    y = $('#search-results'),
    h = $('#search-input'),
    w = $('#search-hints'),
    C = $('html,body'),
    k = 'loaded',
    T = 'unloaded',
    j = 'input-focus',
    A = 'd-flex',
    S = (function () {
      function e() {
        t(this, e);
      }
      return (
        r(e, null, [
          {
            key: 'on',
            value: function () {
              (e.offset = window.scrollY), C.scrollTop(0);
            }
          },
          {
            key: 'off',
            value: function () {
              C.scrollTop(e.offset);
            }
          }
        ]),
        e
      );
    })();
  n(S, 'offset', 0), n(S, 'resultVisible', !1);
  var x = (function () {
      function e() {
        t(this, e);
      }
      return (
        r(e, null, [
          {
            key: 'on',
            value: function () {
              f.addClass(T),
                v.addClass(T),
                d.addClass(T),
                g.addClass(A),
                m.addClass(k);
            }
          },
          {
            key: 'off',
            value: function () {
              m.removeClass(k),
                g.removeClass(A),
                f.removeClass(T),
                v.removeClass(T),
                d.removeClass(T);
            }
          }
        ]),
        e
      );
    })(),
    E = (function () {
      function e() {
        t(this, e);
      }
      return (
        r(e, null, [
          {
            key: 'on',
            value: function () {
              S.resultVisible ||
                (S.on(),
                b.removeClass(T),
                p.addClass(T),
                (S.resultVisible = !0));
            }
          },
          {
            key: 'off',
            value: function () {
              S.resultVisible &&
                (y.empty(),
                w.hasClass(T) && w.removeClass(T),
                b.addClass(T),
                p.removeClass(T),
                S.off(),
                h.val(''),
                (S.resultVisible = !1));
            }
          }
        ]),
        e
      );
    })();
  function F() {
    return m.hasClass(k);
  }
  $('.collapse');
  $('.code-header>button').children().attr('class');
  var O = (function () {
    function e() {
      t(this, e);
    }
    return (
      r(e, null, [
        {
          key: 'attrTimestamp',
          get: function () {
            return 'data-ts';
          }
        },
        {
          key: 'attrDateFormat',
          get: function () {
            return 'data-df';
          }
        },
        {
          key: 'locale',
          get: function () {
            return $('html').attr('lang').substring(0, 2);
          }
        },
        {
          key: 'getTimestamp',
          value: function (t) {
            return Number(t.attr(e.attrTimestamp));
          }
        },
        {
          key: 'getDateFormat',
          value: function (t) {
            return t.attr(e.attrDateFormat);
          }
        }
      ]),
      e
    );
  })();
  $(window).on('scroll', function () {
    $(window).scrollTop() > 50
      ? $('#back-to-top').fadeIn()
      : $('#back-to-top').fadeOut();
  }),
    $('#back-to-top').on('click', function () {
      window.scrollTo(0, 0);
    }),
    o(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (
      t
    ) {
      return new bootstrap.Tooltip(t);
    }),
    0 !== l.length &&
      l.off().on('click', function (t) {
        var e = $(t.target),
          r = e.prop('tagName') === 'button'.toUpperCase() ? e : e.parent();
        modeToggle.flipMode(), r.trigger('blur');
      }),
    $('#sidebar-trigger').on('click', c.toggle),
    $('#mask').on('click', c.toggle),
    d.on('click', function () {
      x.on(), E.on(), h.trigger('focus');
    }),
    m.on('click', function () {
      x.off(), E.off();
    }),
    h.on('focus', function () {
      g.addClass(j);
    }),
    h.on('focusout', function () {
      g.removeClass(j);
    }),
    h.on('input', function () {
      '' === h.val()
        ? F()
          ? w.removeClass(T)
          : E.off()
        : (E.on(), F() && w.addClass(T));
    }),
    dayjs.locale(O.locale),
    dayjs.extend(window.dayjs_plugin_localizedFormat),
    $('['.concat(O.attrTimestamp, ']')).each(function () {
      var t = dayjs.unix(O.getTimestamp($(this))),
        e = t.format(O.getDateFormat($(this)));
      $(this).text(e),
        $(this).removeAttr(O.attrTimestamp),
        $(this).removeAttr(O.attrDateFormat);
      var r = $(this).attr('data-bs-toggle');
      if (void 0 !== r && 'tooltip' === r) {
        var n = t.format('llll');
        $(this).attr('data-bs-title', n), new bootstrap.Tooltip($(this));
      }
    }),
    $('#core-wrapper img[data-src]') <= 0 ||
      document.addEventListener('lazyloaded', function (t) {
        $(t.target).parent().removeClass('shimmer');
      });
})();
