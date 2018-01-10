import React, { Component } from "react";
import { $ } from "utils/getdom";
import { autoTextarea } from "utils/textareaAutoHeight";
import { message } from "antd";

/* 手动添加代理地址 */
export default class AddRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rules: this.props.rules
    };
  }

  static get defaultProps() {
    return {
      auth: "叶念"
    };
  }

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
      this.props.onAddRule(this.state.rules);
      $(oLi, ".from").value = "";
      $(oLi, ".to").value = "";
      message.success("添加成功！", 1);
    } else {
      message.error("请填写要代理url地址！", 1);
    }
  }

  render() {
    return (
      <li className="url-item">
        <textarea
          type="text"
          onFocus={e => autoTextarea(e.target)}
          class="from"
        />
        <span className="seperator">&gt;</span>
        <textarea
          type="text"
          onFocus={e => autoTextarea(e.target)}
          class="to"
          placeholder="http://127.0.0.1:3000/"
        />
        <button onClick={e => this.addNewRule(e)} className="add-btn">
          add
        </button>
      </li>
    );
  }
}
