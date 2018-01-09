import React, { Component } from "react";
import { $ } from "utils/getdom";
import { LocalRulesService } from "utils/ruleutil";
import { autoTextarea } from "utils/textareaAutoHeight";
import "./index.css";

import { Popconfirm, message, Button, Checkbox, Switch, Icon } from "antd";

export default class Switcheroo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: "叶念",
      loading: false,
      localRules: new LocalRulesService(),
      rules: new LocalRulesService().getRules() || []
    };
  }

  static get defaultProps() {
    return {
      auth: "jawil"
    };
  }

  componentWillMount() {
    if (!this.state.localRules.getRules().length) {
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

  /* 双击进入编辑模式 */
  ableEditing(e, type, index) {
    const EditType =
      type === "from" ? `isEditFrom${index}` : `isEditTo${index}`;
    const oLi = e.target.parentNode;
    this.setState(
      {
        [EditType]: "jawil"
      },
      f => {
        const childInput = type === "from" ? $(oLi, ".from") : $(oLi, ".to");
        autoTextarea(childInput);
        childInput.focus();
      }
    );
  }

  /* 离开焦点进入展示模式 */
  disableEditing(e, type, index) {
    const disableEditingText = e.target.value;
    const oLi = e.target.parentNode;
    const EditType =
      type === "from" ? `isEditFrom${index}` : `isEditTo${index}`;
    this.setState(
      {
        [EditType]: index
      },
      f => {
        const childSpan = type === "from" ? $(oLi, ".from") : $(oLi, ".to");

        this.state.rules[index - 1][
          type
        ] = childSpan.innerHTML = disableEditingText;

        this.state.localRules.setRules(this.state.rules);
      }
    );
  }

  /* 手动添加代理地址 */
  addNewRule(e) {
    const oLi = e.target.parentNode;
    let newRule = {
      from: $(oLi, ".from").value,
      to: $(oLi, ".to").value || "http://127.0.0.1:3000/",
      isActive: true,
      $$hashKey: Math.random()
        .toString(16)
        .substring(2)
    };
    if (newRule.from) {
      this.state.rules.push(newRule);
      this.forceUpdate();
      this.state.localRules.setRules(this.state.rules);
      $(oLi, ".from").value = "";
      $(oLi, ".to").value = "";
      message.success("添加成功！", 1);
    } else {
      message.error("请填写要代理url地址！", 1);
    }
  }

  /* 删除代理地址 */
  deleteRule(index) {
    message.success("删除成功！", 1);
    this.state.rules.splice(index - 1, 1);
    this.forceUpdate();
    this.state.localRules.setRules(this.state.rules);
  }

  /* 删除全部代理地址 */
  deleteAllRules() {
    if (this.state.rules.length) {
      message.success("全部删除成功！", 1);
      this.setState({ rules: [] });
      this.state.localRules.setRules("");
    } else {
      message.error("暂时没有数据可以删除！", 1);
    }
  }

  /* 代理地址是否生效 */
  isProxyActive(e, index) {
    this.state.rules[index - 1].isActive = e.target.checked;
    this.state.localRules.setRules(this.state.rules);
  }

  /* 抓取页面loading 开启 */
  enterLoading() {
    this.setState({ rules: [], loading: true });
    this.state.localRules.setRules("");
    setTimeout(f => {
      chrome.tabs.getSelected(null, tab => {
        localStorage["proxyUrl"] = tab.url;
        chrome.tabs.sendRequest(tab.id, "", response => {
          // chrome.extension.getBackgroundPage().rules = response.scriptUrlList;
          this.state.localRules.setRules(response.scriptUrlList || []);

          this.setState({
            rules: response.scriptUrlList || [],
            loading: false
          });
        });
      });
    }, 1000);
  }

  /* 是否开启代理 */
  switchProxy(onoff) {
    localStorage["isProxy"] = JSON.stringify(onoff);
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
    const EditHTML = (item, i) => {
      const index = i + 1;
      if (!this.state[`isEditFrom${index}`]) {
        this.state[`isEditFrom${index}`] = index;
        this.state[`isEditTo${index}`] = index;
      }

      return (
        <li key={index} className="url-item">
          <Checkbox
            defaultChecked={item.isActive}
            onChange={e => this.isProxyActive(e, index)}
          />
          {this.state[`isEditFrom${index}`] === index ? (
            <span
              className="from"
              onDoubleClick={e => this.ableEditing(e, "from", index)}
              title={item.from}
            >
              {item.from}
            </span>
          ) : (
            <textarea
              class="from"
              onBlur={e => this.disableEditing(e, "from", index)}
              defaultValue={item.from}
            />
          )}

          <span className="seperator">&gt;</span>

          {this.state[`isEditTo${index}`] === index ? (
            <span
              className="to"
              onDoubleClick={e => this.ableEditing(e, "to", index)}
              title={item.to}
            >
              {item.to}
            </span>
          ) : (
            <textarea
              class="to"
              onBlur={e => this.disableEditing(e, "to", index)}
              defaultValue={item.to}
            />
          )}

          <Popconfirm
            placement="left"
            title="你确认删除吗？"
            onConfirm={() => this.deleteRule(index)}
            okText="是"
            cancelText="否"
          >
            <button className="delete-btn">删除</button>
          </Popconfirm>
        </li>
      );
    };

    const urlList = this.state.rules.map((item, index) => {
      return EditHTML(item, index);
    });

    const newRule = (
      <li className="url-item url-item-diff">
        <input type="text" class="from" />
        <span className="seperator">&gt;</span>
        <input type="text" class="to" />
        <button onClick={e => this.addNewRule(e)} className="add-btn">
          增加
        </button>
      </li>
    );

    const headRule = (
      <li className="url-item url-item-diff url-item-head">
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
        <div className="collect-urls">
          <Popconfirm
            placement="right"
            title="是否清空链接重新抓取？"
            onConfirm={e => this.enterLoading(e)}
            okText="是"
            cancelText="否"
          >
            <Button type="primary" size="small" loading={this.state.loading}>
              抓取当前页面链接
            </Button>
          </Popconfirm>

          <Button size="small" type="dashed" onClick={e => this.refreshPage(e)}>
            刷新
          </Button>
        </div>
        {headRule}
        {urlList}
        {newRule}
        <Popconfirm
          placement="right"
          title="你确认全部删除吗？"
          onConfirm={e => this.deleteAllRules(e)}
          okText="是"
          cancelText="否"
        >
          <button className="delete-btn deleteAll-btn">全部删除</button>
        </Popconfirm>
        <div className="switch">
          <Switch
            onChange={e => this.switchProxy(e)}
            checkedChildren="代理开"
            unCheckedChildren="代理关"
            defaultChecked={
              localStorage["isProxy"]
                ? JSON.parse(localStorage["isProxy"])
                : true
            }
          />
        </div>
      </ul>
    );
  }
}
