var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* eslint-disable no-undef */
// var _ = require('lodash')
// 检查notion页面加载
var waitNotionPageReady = function waitNotionPageReady(selector) {
  return new Promise(function (resolve) {
    var delay = 500;
    var f = function f() {
      var element = document.querySelector(selector);
      if (element != null) {
        resolve(element);
      } else {
        setTimeout(f, delay);
      }
    };
    f();
  });
};

waitNotionPageReady('#notion-app').then(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 1),
      el = _ref2[0];

  initSideBar();
  addDarkBtn();
  // 创建视图观察者
  NotionXObserver('#notion-app', renderToc);
});

var renderToc = _.throttle(function (MutationRecords, observer) {
  patchToc();
}, 500);

// utils
var scrollToTop = function scrollToTop() {
  $('.notion-scroller').animate({
    scrollTop: 0
  }, 200, null);
};

function initSideBar() {
  // sidebar按钮
  var $btn = $("<div id='toc-btn-chrome-plugin'>TOC</div>");
  $btn.click(function () {
    if ($('#toc-ul-chrome-plugin').length > 0) {
      $('#toc-ul-chrome-plugin').toggleClass('open');
      $('#toc-btn-chrome-plugin').toggleClass('open');
      $('#toc-btn-chrome-plugin').text('TOC');
    }
  });
  $btn.mouseover(function () {
    if ($('#toc-ul-chrome-plugin').length > 0) {
      $('#toc-ul-chrome-plugin').addClass('open');
      $('#toc-btn-chrome-plugin').addClass('open');
      $('#toc-btn-chrome-plugin').text('>>');
    }
  });
  $('#toc-btn-chrome-plugin').hide();
  $('body').append($btn);
}

function addDarkBtn() {
  var $btnShare = $('.notion-topbar-share-menu');
  if ($btnShare.length > 0) {
    var $btnDark = $('\n      <div id="dark-btn-chrome-plugin" title="\u6697\u9ED1\u6A21\u5F0F">\n        <input type="checkbox" id="dark-mode-inp"/>\n        <label for="dark-mode-inp"></label>\n      </div>\n    ');
    $btnDark.find('label').click(function (e) {
      e.stopPropagation();
      var oldChecked = $(e.currentTarget).parent().find('input')[0].checked;
      if (!oldChecked) {
        $('html').addClass('dark');
      } else {
        $('html').removeClass('dark');
      }
    });
    $btnDark.insertBefore($btnShare);
    darkBtnFlag = true;
  }
}

// list
function patchToc() {
  var $ul = null;
  if ($('#toc-ul-chrome-plugin').length <= 0) {
    $ul = $("<ul id='toc-ul-chrome-plugin'></ul>");
    $('body').append($ul);
  } else {
    $ul = $('#toc-ul-chrome-plugin');
  }
  var hs = $('.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block').map(function (i, e) {
    var dataBlockId = e.attributes['data-block-id'].value;
    dataBlockId = dataBlockId.replace(/-/g, '');
    var href = location.pathname + '#' + dataBlockId;
    return {
      desc: e.innerText,
      href: href,
      level: e.classList.contains('notion-header-block') ? 1 : e.classList.contains('notion-sub_header-block') ? 2 : 3
    };
  });
  if (hs.length < 0) {
    $('#toc-btn-chrome-plugin').hide();
    return;
  }
  $('#toc-btn-chrome-plugin').show();
  var $li = $('\n  <li class="level-1">\n    <a class="toTopBtn" href="#">TOP</a>\n  </li>\n  ');
  $li.click(scrollToTop);
  var liStr = '';
  for (var i = 0, l = hs.length; i < l; i++) {
    if (!hs[i].desc || !hs[i].level) continue;
    liStr += '<li class="level-' + hs[i].level + '" title="' + hs[i].desc + '">' + '<a href="' + hs[i].href + '">' + hs[i].desc + '</a>' + '</li>';
  }
  $ul.html(liStr);
  $ul.append($li);
}
var template = "\n<div>\n  <nav class=\"notionx-sidebar\">\n    <div class=\"notionx-switcher\"></div>\n\n    <div class=\"notionx-header\">\n      <div>\n        <i>setting btn</i>\n        <i>pin btn</i>\n        <i>top btn</i>\n        <i>sidebar orientation btn</i>\n      </div>\n    </div>\n\n    <div class=\"notionx-views\">\n      <div class=\"notionx-view notionx-view-toc\">\n        <li>\n          <a href=\"#test\"></a>\n        </li>\n      </div>\n\n      <div class=\"notionx-view notionx-view-setting\">\n        <div>\n          <span>how to trigger sidebar:</span>\n          <select name=\"triggerWay\" id=\"triggerWay\">\n            <option value=\"hover\">hover</option>\n            <option value=\"click\">click</option>\n          </select>\n        </div>\n        <div>\n          <span>Hide Dark Mode Btn:</span>\n          <input type=\"checkbox\" name=\"showDark\" id=\"showDark\"/>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"notionx-footer\">\n      <p>\n        NotionX by\n        <a href=\"www.scarsu.com\">ScarSu</a>\n      </p>\n    </div>\n  </nav>\n</div>\n";
exports.template = template;
var NotionXObserver = function NotionXObserver(selector, cb) {
  var observer = new MutationObserver(cb);
  var notionApp = document.querySelector(selector);
  var config = {
    childList: true,
    subtree: true
  };
  observer.observe(notionApp, config);
};
exports.NotionXObserver = NotionXObserver;
