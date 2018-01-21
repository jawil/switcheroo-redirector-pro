import React, { Component } from "react";
import Eventemitter from "wolfy87-eventemitter";
const eventbus = new Eventemitter();
import { $ } from "utils/getdom";
import { LocalRulesService } from "utils/ruleutil";
const localRules = new LocalRulesService();
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
      commonRules: localRules.getRules("commonRules"),
      fewRules: localRules.getRules("fewRules"),
      allScriptLinks: JSON.parse(localStorage["allScriptLinks"])
    };
  }

  static get defaultProps() {
    return {
      auth: "叶念"
    };
  }

  componentWillMount() {
    chrome.tabs.getSelected(null, tab => {
      /* 当rules为空并且用户没有点击全部删除的动作自动初始化抓取 */
      if (
        !localRules.getRules("commonRules").length &&
        !localStorage["deleteAll"]
      ) {
        /* 初始化时候的代理链接就是当前页面的链接 */
        localStorage["proxyUrl"] = tab.url;

        chrome.tabs.sendRequest(tab.id, "", response => {
          localRules.setRules(response.commonLinks, response.fewLinks);
          localStorage["allScriptLinks"] = JSON.stringify(
            response.allScriptLinks
          );
          this.setState({
            commonRules: response.commonLinks,
            fewRules: response.fewLinks,
            allScriptLinks: response.allScriptLinks
          });
        });
      }
    });
  }

  /* 编辑删除链接 */
  changeRules(commonRules, fewRules) {
    this.setState({ commonRules, fewRules });
    localRules.setRules(commonRules, fewRules);
  }

  render() {
    const headRule = (
      <li className="url-item url-item-head">
        <a href="https://github.com/jawil/redirect" target="_blank">
          有问题？联系我
        </a>
        <span class="from">From</span>
        <span className="seperator" />
        <span class="to">To</span>
      </li>
    );

    return (
      <ul className="url-group">
        <GetLinks
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          allScriptLinks={this.state.allScriptLinks}
          onGetLinks={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
          eventbus={eventbus}
        />

        <SelectRule
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          onSelectRule={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
        />

        <UrlList
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          allScriptLinks={this.state.allScriptLinks}
          onChangeRule={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
          eventbus={eventbus}
        />

        <Footer
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          onFooter={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
        />
      </ul>
    );
  }
}
