import React, { Component } from "react";

import { message, Select } from "antd";
const Option = Select.Option;
/* 手动添加代理地址 */
export default class SelectRule extends Component {
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

  selectedRules(dataArr) {
    console.log(dataArr);
  }
  /* 添加新的代理地址 */
  addSelectNewRule(e) {
    console.log(1);
  }

  render() {
    return (
      <li className="url-item">
        <Select
          mode="tags"
          style={{ width: "87%", marginRight: "10px" }}
          placeholder="点击选择或填写要代理的链接"
          onChange={dataArr => this.selectedRules(dataArr)}
        >
          <Option key="1">"https://baidu.com"</Option>
          <Option key="2">"https://google.com"</Option>
          <Option key="3">"https://facebook.com"</Option>
          <Option key="4">"https://microsoft.com"</Option>
          <Option key="5">"https://alibaba.com"</Option>
          <Option key="https://g.alicdn.com/platform/c/rasterizehtml/1.2.4/dist/">
            "https://g.alicdn.com/platform/c/rasterizehtml/1.2.4/dist/"
          </Option>
        </Select>
        <button onClick={e => this.addSelectNewRule(e)} className="add-btn">
          add
        </button>
      </li>
    );
  }
}
