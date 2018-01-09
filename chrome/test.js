// 获取当前页面的标题和 url
/* chrome.tabs.query(
  {
    active: true,
    currentWindow: true
  },
  tabs => {
    document.getElementById("popup_title").innerHTML = tabs[0].title;
    document.getElementById("popup_url").innerHTML = tabs[0].url;
  }
);
 */

// 激活当前页面刷新网页
/* chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.reload(tabs[0].id);
});

chrome.tabs.query({ active: true, currentWindow: true }, function(arrayOfTabs) {
  var code = "window.location.reload();";
  chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
});

chrome.tabs.getSelected(null, function(tab) {
  var code = "window.location.reload();";
  chrome.tabs.executeScript(tab.id, { code: code });
});
 */

// 获取 popup 页面的 window 对象
/* chrome.tabs.getSelected(null, function(tab) {
  alert(chrome.extension.getBackgroundPage()); // 获取 background 页面的 window 对象 
  alert(Object.keys(chrome.extension.getViews({ type: "popup" })[0])); // 还可以 type:"tab"
  alert(chrome.extension.getViews({ type: "popup" })[0].location);
});  */

// pop 页面与 background 之间通信
/* chrome.tabs.getSelected(null, function(tab) {
  alert(Object.keys(chrome.extension.getBackgroundPage().window));
  chrome.runtime.sendMessage("Hello", function(response) {
    document.querySelector("#test").innerHTML = response;
  });
}); */

// 获取 background 页面的属性值， 总结来说，就是Extension的Page之间，可以通过chrome.extension.getViews和chrome.extension.getBackgroundPage这两个API接口获得对方的window对象。有了对方的window对象之后，就可以直接进行通信了。
/* document.addEventListener("DOMContentLoaded", function() {
  console.log(chrome.extension.getBackgroundPage().whoiam);
}); */

// Extension Page 向 Content Script 发送消息，由于 Extension 的 Page 和 Content Script 不在同一个进程，它们的通信过程就会复杂一些，Chromium 的 Extension 机制提供了两个API：chrome.tabs.sendRequest和chome.extension.onRequest，用来从 Extension Page 向 Content Script 发送消息。 


//同样，Chromium 的 Extension 机制也为从 Content Script 向 Extension Page 发送消息提供了两个API：chrome.runtime.sendMessage和chrome.runtime.onMessage。


