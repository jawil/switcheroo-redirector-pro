import React, { Component } from "react";
import { $ } from "utils/getdom";
import { autoTextarea } from "utils/textareaAutoHeight";
import { Popconfirm, Button, message } from "antd";
/* 抓取页面所有链接 */
export default class GetLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonRules: this.props.commonRules,
      loading: false
    };
  }

  static get defaultProps() {
    return {
      auth: "叶念"
    };
  }

  /* 抓取页面loading 开启 */
  enterLoading() {
    this.setState({ loading: true });
    this.props.onGetLinks([], []);
    setTimeout(f => {
      chrome.tabs.getSelected(null, tab => {
        localStorage["proxyUrl"] = tab.url;
        chrome.tabs.sendRequest(tab.id, "", response => {
          // chrome.extension.getBackgroundPage().rules = response.commonLinks;
          if (response) {
            this.props.onGetLinks(response.commonLinks, response.fewLinks);
            this.setState({
              loading: false
            });
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

  render() {
    return (
      <li className="collect-urls">
        <Popconfirm
          placement="right"
          title="是否清空链接重新抓取？"
          onConfirm={e => this.enterLoading(e)}
          okText="是"
          cancelText="否"
        >
          <Button type="danger" loading={this.state.loading}>
            重新抓取页面链接
          </Button>
        </Popconfirm>

        <Button type="dashed" onClick={e => this.refreshPage(e)}>
          刷新页面
        </Button>
      </li>
    );
  }
}
