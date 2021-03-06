import React, { Component } from "react";
import { LocalRulesService } from "utils/ruleutil";
import { message, Select, Button } from "antd";
const Option = Select.Option;
/* 手动添加代理地址 */
export default class SelectRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonRules: this.props.commonRules,
      fewRules: this.props.fewRules,
      selected: [],
      isAdd: false
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

  selectedRules(dataArr) {
    if (dataArr.length) {
      this.state.isAdd = true;
    }
    this.state.selected = dataArr.map(item => {
      let toUrl = "http://127.0.0.1:3000/";
      if (/\/+\?\?/.test(item)) {
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

    this.state.fewRules = this.state.fewRules.filter(item => {
      return dataArr.indexOf(item.from) === -1;
    });
  }
  /* 添加新的代理地址 */
  addSelectNewRule(e) {
    const commonRules = [...this.state.commonRules, ...this.state.selected];
    const fewRules = this.state.fewRules;
    this.props.onSelectRule(commonRules, fewRules);
    if (this.state.isAdd) {
      message.success("添加成功！", 1);
      this.state.isAdd = false;
    } else {
      message.error("链接不能为空！", 1);
    }

    const clearEle = document.querySelector(".ant-select-selection__clear");
    clearEle && clearEle.click();
  }
  render() {
    const children = this.state.fewRules.map(item => {
      return <Option key={item.from}>{item.from}</Option>;
    });

    return (
      <li className="url-item">
        <Select
          mode="tags"
          style={{ width: "89%", marginRight: "10px" }}
          placeholder="点击选择或填写要代理的目录链接"
          onChange={dataArr => this.selectedRules(dataArr)}
          allowClear={true}
        >
          {children}
        </Select>
        <Button onClick={e => this.addSelectNewRule(e)} size="small">
          增加
        </Button>
      </li>
    );
  }
}
