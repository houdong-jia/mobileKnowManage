<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    class="i-remote-search-outer"
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
  >
    <!--
      组件内部容器
      增加class="drag_container" 必选
      idm-ctrl-id：组件的id，这个必须不能为空
      idm-container-index  组件的内部容器索引，不重复唯一且不变，必选
    -->
    <a-select
      mode="multiple"
      label-in-value
      :value="selectValue"
      :placeholder="propData.placeholder"
      style="width: 100%"
      :size="propData.size"
      :filter-option="false"
      :not-found-content="fetching ? undefined : null"
      @search="fetchUser"
      @change="handleChange"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option v-for="d in options" :key="d.value" :value="d.value">
        {{ d.label }}
      </a-select-option>
    </a-select>
    <div
      v-show="
        propData.showDragContainer &&
        (this.moduleObject.env != 'production' || propData.showDragContainer)
      "
      class="idm_itabs_drag_container"
      :style="{ left: propData.dragContainerX, top: propData.dragContainerY }"
    >
      <div
        class="drag_container"
        idm-ctrl-inner
        :idm-ctrl-id="moduleObject.id"
        idm-container-index="1"
      ></div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
  name: "IRemoteSearch",
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        placeholder: "请输入关键词",
        size: "default",
        multiple: true,
        showLeftIcon: true,
        labelInterface: "label",
        valueInterface: "value",
        dragContainerY: "8px",
        dragContainerX: "10%",
        showDragContainer: false,
      },
      selectValue: [],
      options: [],
      fetching: false,
    };
  },
  props: {},
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
    this.initPropData();
  },
  mounted() {},
  destroyed() {},
  methods: {
    handleChange(selectValue) {
      Object.assign(this, {
        selectValue,
      });
    },
    // 过滤接口参数
    customParam(query) {
      let obj = {};
      if (
        this.propData.customParamFunc &&
        this.propData.customParamFunc.length > 0
      ) {
        let name = this.propData.customParamFunc[0].name;
        obj =
          window[name] &&
          window[name].call(this, {
            query,
          });
      }
      return obj;
    },
    // 请求
    fetchUser(query) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.fetching = true;

      let dataSource = this.propData.dataSource;
      if (
        !this.moduleObject.env ||
        this.moduleObject.env != "production" ||
        !dataSource
      ) {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        this.options = [
          {
            value: "1",
            label: "张三",
          },
          {
            value: "2",
            label: "李四",
          },
          {
            value: "3",
            label: "王五",
          },
        ];
        this.fetching = false;
        return;
      }
      IDM.datasource.request(
        this.propData.dataSource[0]?.id,
        {
          moduleObject: this.moduleObject,
          param: {
            query,
            ...this.customParam(query),
          },
        },
        (res) => {
          if (fetchId !== this.lastFetchId) {
            return;
          }
          const data =  res.map(item => {
            return {
              value:item[this.propData.valueInterface],
              label:item[this.propData.labelInterface]
            }
          });
          this.options = data;
          this.fetching = false;
        },
        () => {
          this.fetching = false;
        }
      );
    },
    /**
     * 适配页面
     */
    getScale(pageWidth) {
      const base = this.propData.baseValue || 414;
      const ratio = this.propData.adaptationRatio || 1.2;
      const width =
        this.moduleObject.env === "production"
          ? window.innerWidth
          : pageWidth || 414;
      return (width / base - 1) * (ratio - 1) + 1;
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
      this.initPropData();
    },
    /**
     * 初始化组件属性
     */
    initPropData() {},
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(pageSize = {}) {
      var styleObject = {};

      const scale = this.getScale(pageSize.width);
      styleObject["--i-remote-search-scale"] = scale;

      if (this.propData.bgSize && this.propData.bgSize == "custom") {
        styleObject["background-size"] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal +
              this.propData.bgSizeWidth.selectVal
            : "auto") +
          " " +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal +
              this.propData.bgSizeHeight.selectVal
            : "auto");
      } else if (this.propData.bgSize) {
        styleObject["background-size"] = this.propData.bgSize;
      }
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject["background-position-x"] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject["background-position-y"] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = IDM.hex8ToRgbaString(
                  element.hex8
                );
              }
              break;
            case "box":
              if (element.marginTopVal) {
                styleObject["margin-top"] = `${element.marginTopVal}`;
              }
              if (element.marginRightVal) {
                styleObject["margin-right"] = `${element.marginRightVal}`;
              }
              if (element.marginBottomVal) {
                styleObject["margin-bottom"] = `${element.marginBottomVal}`;
              }
              if (element.marginLeftVal) {
                styleObject["margin-left"] = `${element.marginLeftVal}`;
              }
              if (element.paddingTopVal) {
                styleObject["padding-top"] = `${element.paddingTopVal}`;
              }
              if (element.paddingRightVal) {
                styleObject["padding-right"] = `${element.paddingRightVal}`;
              }
              if (element.paddingBottomVal) {
                styleObject["padding-bottom"] = `${element.paddingBottomVal}`;
              }
              if (element.paddingLeftVal) {
                styleObject["padding-left"] = `${element.paddingLeftVal}`;
              }
              break;
            case "bgImgUrl":
              styleObject[
                "background-image"
              ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "positionX":
              //背景横向偏移

              break;
            case "positionY":
              //背景纵向偏移

              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
              break;
            case "border":
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] =
                  element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] = IDM.hex8ToRgbaString(
                    element.border.top.colors.hex8
                  );
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] =
                  element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] = IDM.hex8ToRgbaString(
                    element.border.right.colors.hex8
                  );
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] =
                  element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] =
                  element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] = IDM.hex8ToRgbaString(
                    element.border.bottom.colors.hex8
                  );
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] =
                  element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] = IDM.hex8ToRgbaString(
                    element.border.left.colors.hex8
                  );
                }
              }

              styleObject["border-top-left-radius"] =
                element.radius.leftTop.radius +
                element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] =
                element.radius.rightTop.radius +
                element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] =
                element.radius.leftBottom.radius +
                element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] =
                element.radius.rightBottom.radius +
                element.radius.rightBottom.radiusUnit;
              break;
            case "boxShadow":
              styleObject["box-shadow"] = element;
              break;
            case "font":
              styleObject["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleObject["color"] = IDM.hex8ToRgbaString(
                  element.fontColors.hex8
                );
              }
              styleObject["font-weight"] =
                element.fontWeight && element.fontWeight.split(" ")[0];
              styleObject["font-style"] = element.fontStyle;
              styleObject["font-size"] =
                element.fontSize + element.fontSizeUnit;
              styleObject["line-height"] =
                element.fontLineHeight +
                (element.fontLineHeightUnit == "-"
                  ? ""
                  : element.fontLineHeightUnit);
              styleObject["text-align"] = element.fontTextAlign;
              styleObject["text-decoration"] = element.fontDecoration;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
    },
    /**
     * 主题颜色
     */
    convertThemeListAttrToStyleObject() {
      const themeList = this.propData.themeList;
      if (!themeList) {
        return;
      }
      const themeNamePrefix =
        IDM.setting &&
        IDM.setting.applications &&
        IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : "idm-theme-";
      for (var i = 0; i < themeList.length; i++) {
        var item = themeList[i];

        // IDM.setStyleToPageHead(
        //   "." +
        //     themeNamePrefix +
        //     item.key +
        //     " #" +
        //     (this.moduleObject.packageid || "module_demo") +
        //     " .i-remote-search-item .item-style .item-style-circle",
        //   {
        //     "border-color": item.mainColor
        //       ? IDM.hex8ToRgbaString(item.mainColor.hex8)
        //       : "",
        //   }
        // );
      }
    },
    /**
     * 通用的url参数对象
     * 所有地址的url参数转换
     */
    commonParam() {
      let urlObject = IDM.url.queryObject();
      var params = {
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : "",
        urlData: JSON.stringify(urlObject),
      };
      return params;
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      var _defaultVal = undefined;
      if (dataFiled) {
        var filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths("[") ? "" : ".") + filedExp;
        var dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(
          this,
          "@[" + filedExp + "]",
          dataObject
        );
      }
      //对结果进行再次函数自定义
      if (
        this.propData.customFunction &&
        this.propData.customFunction.length > 0
      ) {
        var params = this.commonParam();
        var resValue = "";
        try {
          resValue =
            window[this.propData.customFunction[0].name] &&
            window[this.propData.customFunction[0].name].call(this, {
              ...params,
              ...this.propData.customFunction[0].param,
              moduleObject: this.moduleObject,
              expressData: _defaultVal,
              interfaceData: resultData,
            });
        } catch (error) {}
        _defaultVal = resValue;
      }

      return _defaultVal;
    },
    /**
     * 组件通信：接收消息的方法
     * @param {
     *  type:"发送消息的时候定义的类型，这里可以自己用来要具体做什么，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）"
     *  message:{发送的时候传输的消息对象数据}
     *  messageKey:"消息数据的key值，代表数据类型是什么，常用于表单交互上，比如通过这个key判断是什么数据"
     *  isAcross:如果为true则代表发送来源是其他页面的组件，默认为false
     * } object
     */
    receiveBroadcastMessage(messageObject) {
      console.log("组件收到消息", messageObject);
      let func;
      switch (messageObject.type) {
        case "websocket":
          if (this.propData.messageRefreshKey && messageObject.message) {
            const messageData =
              (typeof messageObject.message === "string" &&
                JSON.parse(messageObject.message)) ||
              messageObject.message;
            const arr = Array.isArray(this.propData.messageRefreshKey)
              ? this.propData.messageRefreshKey
              : [this.propData.messageRefreshKey];
            if (messageData.badgeType && arr.includes(messageData.badgeType)) {
              this.isLoading = true;
              this.initData();
            }
          }
          break;
        case "linkageReload":
          // this.propDataWatchHandle();
          break;
        case "pageResize":
          this.convertAttrToStyleObject(messageObject.message);
          break;
        case this.propData.submitMessageKey:
          func = this.propData.submitFunction?.[0]
          func && window[func.name] && window[func.name].call(this,{
            selectValue:this.selectValue,
            router:IDM.router.getParam(this.moduleObject.routerId)
          })
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$scale: var(--i-remote-search-scale);

.i-remote-search-outer {
  position: relative;
  padding: calc(10px * #{$scale}) calc(12px * #{$scale});
  background-color: #fff;
  box-shadow: 0px calc(2px * #{$scale}) calc(2px * #{$scale}) 0px
    rgba(0, 0, 0, 0.07);
  color: #999999;
  font-size: calc(14px * #{$scale});
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ::v-deep .ant-select-selection {
    background-color: #f2f2f2;
    border-radius: 100px;
    border: none;
  }

  .idm_itabs_drag_container {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
