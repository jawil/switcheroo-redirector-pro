import React, { Component } from "react";
import { message, Popconfirm, Switch } from "antd";
import { LocalRulesService } from "utils/ruleutil";
/* 手动添加代理地址 */
export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonRules: this.props.commonRules,
      fewRules: this.props.fewRules
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

  /* 删除全部代理地址 */
  deleteAllRules() {
    if (this.state.commonRules.length) {
      message.success("全部删除成功！", 1);
      const fewRules = this.state.fewRules.concat(this.state.commonRules);
      this.setState({ commonRules: [], fewRules });
      this.props.onFooter([], fewRules);
    } else {
      message.error("暂时没有数据可以删除！", 1);
    }
    localStorage["deleteAll"] = "deleteAll";
  }

  /* 是否开启代理 */
  switchProxy(onoff) {
    localStorage["isProxy"] = JSON.stringify(onoff);
  }

  render() {
    return (
      <footer>
        <Popconfirm
          placement="right"
          title="你确认全部删除吗？"
          onConfirm={e => this.deleteAllRules(e)}
          okText="是"
          cancelText="否"
        >
          <button className="deleteAll-btn">全部删除</button>
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
      </footer>
    );
  }
}
