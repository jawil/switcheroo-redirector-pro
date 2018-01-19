import React, { Component } from "react";
import { $ } from "utils/getdom";
import { autoTextarea } from "utils/textareaAutoHeight";
import { Popconfirm, message, Checkbox, AutoComplete, Input } from "antd";
const { TextArea } = Input;

export default class UrlList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commonRules: this.props.commonRules,
      fewRules: this.props.fewRules,
      dataSource: this.props.allScriptLinks
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

  componentDidMount() {
    this.props.eventbus.on("autoComplete", dataSource => {
      this.setState({ dataSource });
    });
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
        const childTextArea = type === "from" ? $(oLi, ".from") : $(oLi, ".to");
        autoTextarea(childTextArea);
        childTextArea.click();
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
        this.state.commonRules[index][
          type
        ] = childSpan.innerHTML = disableEditingText;

        this.props.onChangeRule(this.state.commonRules, this.state.fewRules);
      }
    );
  }

  /* 删除代理地址 */
  deleteRule(e, index) {
    message.success("删除成功！", 1);
    this.state.fewRules.push(this.state.commonRules[index]);
    this.state.commonRules.splice(index, 1);
    this.props.onChangeRule(this.state.commonRules, this.state.fewRules);
  }

  /* 代理地址是否生效 */
  isProxyActive(e, index) {
    this.state.commonRules[index].isActive = e.target.checked;
    this.props.onChangeRule(this.state.commonRules, this.state.fewRules);
  }

  render() {
    const EditHTML = (item, index, minify) => {
      if (this.state[`isEditFrom${index}`] === void 0) {
        this.state[`isEditFrom${index}`] = index;
        this.state[`isEditTo${index}`] = index;
      }

      return (
        <li key={index} className="url-item">
          {this.state[`isEditFrom${index}`] === index ? (
            <span
              className="from"
              onDoubleClick={e => this.ableEditing(e, "from", index)}
              title={item.from}
            >
              {item.from}
            </span>
          ) : (
            <AutoComplete
              dataSource={this.state.dataSource}
              defaultValue={item.from}
              dropdownClassName={`ant-dropdown-custom ${minify ? minify : ""}`}
              filterOption
            >
              <TextArea
                className="from textarea"
                onBlur={e => this.disableEditing(e, "from", index)}
              />
            </AutoComplete>
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
            <AutoComplete
              dataSource={this.state.dataSource}
              defaultValue={item.to}
              dropdownClassName={`ant-dropdown-custom ${minify ? minify : ""}`}
              filterOption
            >
              <TextArea
                className="to textarea"
                onBlur={e => this.disableEditing(e, "to", index)}
              />
            </AutoComplete>
          )}
          <Checkbox
            defaultChecked={item.isActive}
            onChange={e => this.isProxyActive(e, index)}
          />
          <Popconfirm
            placement="left"
            title="你确认删除吗？"
            onConfirm={e => this.deleteRule(e, index)}
            okText="是"
            cancelText="否"
          >
            <a className="delete-btn" href="javascript:void(0);">
              删除
            </a>
          </Popconfirm>
        </li>
      );
    };

    const minifyUrl = [];
    const commonUrl = [];
    this.state.commonRules.forEach(item => {
      if (/\/+\?\?/.test(item.from)) {
        minifyUrl.push(item);
      } else {
        commonUrl.push(item);
      }
    });

    this.state.commonRules = [...commonUrl, ...minifyUrl];

    const commonUrlList = commonUrl.map((item, index) => {
      return EditHTML(item, index);
    });

    const tips = (
      <li className="url-item url-item-head">
        <span className="from">React.min.js</span>
        <span className="seperator" />
        <span className="to">React.js</span>
      </li>
    );

    const minifyUrlList = minifyUrl.map((item, index) => {
      let currentIndex = commonUrlList.length + index;
      return EditHTML(item, currentIndex, "minify");
    });

    return (
      <ul className="url-group-item">
        {commonUrlList}
        {minifyUrl.length ? tips : ""}
        {minifyUrlList}
      </ul>
    );
  }
}
