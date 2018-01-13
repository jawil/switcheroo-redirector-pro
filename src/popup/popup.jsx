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
      commonRules: new LocalRulesService().getRules("commonRules") || [],
      fewRules: new LocalRulesService().getRules("fewRules") || []
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
      !this.state.localRules.getRules("commonRules").length &&
      !localStorage["deleteAll"]
    ) {
      chrome.tabs.getSelected(null, tab => {
        localStorage["proxyUrl"] = tab.url;
        chrome.tabs.sendRequest(tab.id, "", response => {
          // chrome.extension.getBackgroundPage().rules = response.commonLinks;
          this.state.localRules.setRules(
            response.commonLinks,
            response.fewLinks
          );
          this.setState({
            commonRules: response.commonLinks,
            fewRules: response.fewLinks
          });
        });
      });
    }
  }

  /* 编辑删除链接 */
  changeRules(commonRules, fewRules) {
    this.setState({ commonRules, fewRules });
    commonRules = commonRules.length ? commonRules : "";
    fewRules = fewRules.length ? fewRules : "";
    this.state.localRules.setRules(commonRules, fewRules);
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
          onGetLinks={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
        />

        <SelectRule
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          onSelectRule={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
        />

        {headRule}

        <UrlList
          commonRules={this.state.commonRules}
          fewRules={this.state.fewRules}
          onChangeRule={(commonRules, fewRules) =>
            this.changeRules(commonRules, fewRules)
          }
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

/* 
import axios from "axios";
import cheerio from "cheerio";
chrome.tabs.getSelected(null, tab => {
  axios
    .get(tab.url)
    .then(function(response) {
      const $ = cheerio.load(response.data);
      console.log($("script"),typeof Array.from($("script")))
      let { commonLinks } = genertorRules($("script"));
      console.log(commonLinks);
    })
    .catch(function(error) {
      console.log(error);
    });
}); */
