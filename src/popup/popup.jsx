import React, { Component } from "react";
import { $ } from "utils/getdom";
import { LocalRulesService } from "utils/ruleutil";
import "./index.css";

import UrlList from "components/UrlList";
import AddRule from "components/AddRule";
import GetLinks from "components/GetLinks";
import SelectRule from "components/SelectRule";
import Footer from "components/Footer";

export default class Switcheroo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localRules: new LocalRulesService(),
      rules: new LocalRulesService().getRules() || []
    };
  }

  static get defaultProps() {
    return {
      auth: "叶念"
    };
  }

  componentWillMount() {
    /* 当rules为空并且用户没有点击全部删除的动作自动初始化抓取 */
    if (
      !this.state.localRules.getRules().length &&
      !localStorage["deleteAll"]
    ) {
      chrome.tabs.getSelected(null, tab => {
        localStorage["proxyUrl"] = tab.url;
        chrome.tabs.sendRequest(tab.id, "", response => {
          // chrome.extension.getBackgroundPage().rules = response.scriptUrlList;
          this.state.localRules.setRules(response.scriptUrlList || []);
          this.setState({ rules: response.scriptUrlList || [] });
        });
      });
    }
  }

  /* 编辑删除链接 */
  changeRules(rules) {
    this.setState({ rules });
    rules = rules.length ? rules : "";
    this.state.localRules.setRules(rules);
  }

  render() {
    return (
      <ul className="url-group">
        <GetLinks
          rules={this.state.rules}
          onGetLinks={rules => this.changeRules(rules)}
        />

        <UrlList
          rules={this.state.rules}
          onChangeRule={rules => this.changeRules(rules)}
        />

        <AddRule
          rules={this.state.rules}
          onAddRule={rules => this.changeRules(rules)}
        />

        <SelectRule
          rules={this.state.rules}
          onSelectRule={rules => this.changeRules(rules)}
        />

        <Footer
          rules={this.state.rules}
          onFooter={rules => this.changeRules(rules)}
        />
      </ul>
    );
  }
}
