import React, { Component } from "react";
import { $ } from "utils/getdom";
import { autoTextarea } from "utils/textareaAutoHeight";
import { LocalRulesService } from "utils/ruleutil";
const localRules = new LocalRulesService();
import { Popconfirm, Button, message } from "antd";
/* 抓取页面所有链接 */
export default class GetLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      commonRules: this.props.commonRules,
      fewRules: this.props.fewRules,
      allScriptLinks: this.props.allScriptLinks,
      hisRules: JSON.parse(localStorage["hisRules"] || "[]"),
      currentUrl: "",
      hasHisRule: "",
      hisBtnToggle: true
    };
  }

  static get defaultProps() {
    return {
      auth: "叶念"
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      commonRules: nextProps.commonRules,
      fewRules: nextProps.fewRules
    });
  }

  componentWillMount() {
    chrome.tabs.getSelected(null, tab => {
      this.setState({ currentUrl: tab.url });
      /* 看是否有历史记录 */
      const hisRules = JSON.parse(localStorage["hisRules"] || "[]");
      const filterRule = hisRules.filter(item => {
        return item.url === tab.url;
      });

      if (filterRule.length && localStorage["proxyUrl"] !== tab.url) {
        this.setState({
          hisBtnToggle: false,
          hasHisRule: filterRule[0]
        });
      }
    });
  }

  /* 抓取页面loading 开启 */
  enterLoading(commonRules, fewRules) {
    this.setState({ loading: true });
    this.props.onGetLinks([], []);
    setTimeout(f => {
      chrome.tabs.getSelected(null, tab => {
        chrome.tabs.sendRequest(tab.id, "", response => {
          if (response) {
            /* 历史记录存贮 */
            const hisRule = {
              url: localStorage["proxyUrl"],
              commonRules,
              fewRules,
              allScriptLinks: localStorage["allScriptLinks"]
            };

            const currentRule = {
              url: tab.url,
              commonRules: response.commonLinks,
              fewRules: response.fewLinks,
              allScriptLinks: response.allScriptLinks
            };

            const filterRules = this.state.hisRules.filter(item => {
              return item.url !== hisRule.url || item.url !== currentRule.url;
            });

            filterRules.push(hisRule);

          
              filterRules.push(currentRule);
            

            localStorage["hisRules"] = JSON.stringify(filterRules);

            /* 重新抓取更新UI */
            localStorage["proxyUrl"] = tab.url;
            this.props.onGetLinks(response.commonLinks, response.fewLinks);
            this.setState({
              loading: false
            });
            localStorage["allScriptLinks"] = JSON.stringify(
              response.allScriptLinks
            );
            this.props.eventbus.emit("autoComplete", response.allScriptLinks);
          } else {
            message.error("请刷新页面生效后再重新获取！", 1);
          }
        });
      });
    }, 1000);
  }

  /* 刷新页面 */
  refreshPage(e) {
    chrome.tabs.getSelected(null, function(tab) {
      var code = "window.location.reload();";
      chrome.tabs.executeScript(tab.id, { code: code });
      window.close();
    });
  }

  /* 还原历史配置 */
  hisConfig(hisConfig, currentConfig) {
    /* 更新 commonRules，fewRules，allScriptLinks */
    localRules.setRules(hisConfig.commonRules, hisConfig.fewRules);
    localStorage["allScriptLinks"] = JSON.stringify(hisConfig.allScriptLinks);

    /* 更新 hisRules*/
    const hisRules = JSON.parse(localStorage["hisRules"] || "[]");

    /* 过滤掉当前页面的 url 历史记录，它是匹配上一个 url 的链接信息 */
 

    hisRules.push(currentConfig);

    localStorage["hisRules"] = JSON.stringify(hisRules);

    this.setState({
      hisBtnToggle: true
    });

    this.props.onGetLinks(hisConfig.commonRules, hisConfig.fewRules);

    /* 每次还原配置相当于重新抓取一次配置，所以代理的链接变成当前的 url */
    localStorage["proxyUrl"] = this.state.currentUrl;
    localStorage["allScriptLinks"] = JSON.stringify(hisConfig.allScriptLinks);
    this.props.eventbus.emit("autoComplete", hisConfig.allScriptLinks);

    message.success("历史配置还原成功！", 1);
  }

  render() {
    const commonRules = this.state.commonRules;
    const fewRules = this.state.fewRules;

    const currentConfig = {
      url: localStorage["proxyUrl"],
      commonRules: this.state.commonRules,
      fewRules: this.state.fewRules,
      allScriptLinks: this.state.allScriptLinks
    };
    
    console.log(currentConfig,currentConfig.commonRules.length,"currentConfig")

    const hasHisRule = this.state.hasHisRule;
    let hisConfig = "";
    if (hasHisRule) {
      hisConfig = {
        commonRules: hasHisRule.commonRules,
        fewRules: hasHisRule.fewRules,
        allScriptLinks: hasHisRule.allScriptLinks,
        proxy: localStorage["proxyUrl"]
      };
    }

    const togglePop = this.state.hisBtnToggle ? "block" : "none";
    const toggleBtn = this.state.hisBtnToggle ? "none" : "block";

    return (
      <li className="collect-urls">
        <Popconfirm
          placement="right"
          title="是否清空链接重新抓取？"
          onConfirm={this.enterLoading.bind(this, commonRules, fewRules)}
          okText="是"
          cancelText="否"
        >
          <Button
            type="danger"
            loading={this.state.loading}
            style={{ display: togglePop }}
          >
            重新抓取页面链接
          </Button>
        </Popconfirm>

        <Button
          type="danger"
          type="small"
          onClick={this.hisConfig.bind(this, hisConfig, currentConfig)}
          style={{ display: toggleBtn }}
        >
          有历史配置，是否还原？
        </Button>

        <Button type="dashed" onClick={e => this.refreshPage(e)}>
          刷新页面
        </Button>
      </li>
    );
  }
}
