class LocalRulesService {
  getRules() {
    let stroredRules = localStorage["rules"];
    if (!stroredRules) {
      return [];
    }
    return JSON.parse(stroredRules);
  }
  setRules(rules) {
    localStorage["rules"] = JSON.stringify(rules);
  }
}

class RuleMatcher {
  constructor(rules) {
    this.lastRequestId = null;
    this.rules = rules;
  }

  redirectOnMatch(request) {
    let rule = _.find(this.rules, rule => {
      return (
        rule.isActive &&
        request.url.indexOf(rule.from) > -1 &&
        request.requestId !== this.lastRequestId
      );
    });

    if (rule) {
      this.lastRequestId = request.requestId;
      return {
        redirectUrl: request.url.replace(rule.from, rule.to)
      };
    }
  }
}

//显示一个桌面通知
function showDataOnPage(id, data, link) {
  if (window.webkitNotifications) {
    var notification = window.webkitNotifications.createNotification(
      "images/switch128.png",
      "Alibaba HTTP Redirector",
      data
    );
    notification.show();
    setTimeout(function() {
      notification.cancel();
    }, 5000);
  } else if (chrome.notifications) {
    var opt = {
      type: "basic",
      title: "Alibaba HTTP Redirector",
      message: data,
      iconUrl: "images/switch128.png"
    };
    chrome.notifications.create("", opt, function(id) {
      chrome.notifications.onClicked.addListener(function() {
        chrome.notifications.clear(id);
        window.open(link);
      });

      setTimeout(function() {
        chrome.notifications.clear(id);
      }, 5000);
    });
  } else {
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  sendResponse({ proxyUrl: localStorage["proxyUrl"] });
  let currentUrl = request.currentUrl;
  let proxyUrl = localStorage["proxyUrl"];

  if (
    new RegExp(currentUrl, "g").test(proxyUrl) &&
    JSON.parse(localStorage["isProxy"]) &&
    JSON.parse(localStorage["rules"]).length
  ) {
    showDataOnPage(
      1000,
      "Alibaba HTTP Redirector 正在为您代理中！",
      "https://github.com/jawil"
    );
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  details => {
    const isProxy = JSON.parse(localStorage["isProxy"]);
    if (isProxy) {
      const rules = new LocalRulesService().getRules();
      const ruleMatcher = new RuleMatcher(rules);
      return ruleMatcher.redirectOnMatch(details);
    }
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking"]
);
