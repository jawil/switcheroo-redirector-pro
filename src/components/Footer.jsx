import React, { Component } from "react";
import { message, Popconfirm, Switch } from "antd";

/* 手动添加代理地址 */
export default class Footer extends Component {
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

  /* 删除全部代理地址 */
  deleteAllRules() {
    if (this.state.rules.length) {
      message.success("全部删除成功！", 1);
      this.setState({ rules: [] });
      this.props.onFooter([]);
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
          <button className="deleteAll-btn">remove all</button>
        </Popconfirm>
        <div className="switch">
          <Switch
            onChange={e => this.switchProxy(e)}
            checkedChildren="proxy on"
            unCheckedChildren="proxy off"
            defaultChecked={JSON.parse(localStorage["isProxy"])}
          />
        </div>
      </footer>
    );
  }
}
