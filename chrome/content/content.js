const currentUrl = window.location.host + window.location.pathname;

chrome.runtime.sendMessage({ currentUrl: currentUrl }, function(response) {
  let proxyUrl = response.proxyUrl;
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  const scriptUrlList = Array.from(document.querySelectorAll("script"))
    .map(item => {
      let pathname = item.src.split("/").pop();

      return item.src.split(pathname)[0];
    })
    .filter(item => {
      return !!item == true;
    });

  let scriptUrl = [...new Set(scriptUrlList)];

  /* 阿里定制化 */
  const alicdn = "g.alicdn.com/platform";
  const alinw = "alinw.alicdn.com/platform";
  const assets = "g-assets.daily.taobao.net/platform";

  let generatorScriptUrl = scriptUrl
    .filter(item => {
      return /\/\?*platform/.test(item);
    })
    .map(item => {
      let toUrl = "http://127.0.0.1:3000/";
      if (/\/\?\?platform/.test(item)) {
        toUrl = item.replace(/\.min/g, "");
      }
      return {
        from: item,
        to: toUrl,
        isActive: true,
        $$hashKey: Math.random()
          .toString(16)
          .substring(2)
      };
    });

  /* 特殊的planform??放在最后面 */
  generatorScriptUrl.forEach((item, index, array) => {
    if (/\/\?\?platform/.test(item.from)) {
      array.splice(index, 1);
      array.push(item);
    }
  });

  console.log(generatorScriptUrl, 1111);

  /* 如果不是阿里的网站就正常抓取链接 */
  if (!generatorScriptUrl.length) {
    generatorScriptUrl = scriptUrl.map(item => {
      return {
        from: item,
        to: "http://127.0.0.1:3000/",
        isActive: true,
        $$hashKey: Math.random()
          .toString(16)
          .substring(2)
      };
    });
  }

  sendResponse({
    scriptUrlList: generatorScriptUrl || []
  });
});
