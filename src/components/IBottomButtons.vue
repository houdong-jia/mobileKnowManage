<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    class="i-bottom-buttons-outer"
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
    <div class="i-bottom-buttons-left">
      <template v-for="(item, index) in buttons">
        <div
          v-if="item.align === 'left'"
          class="i-bottom-buttons-item"
          :key="index"
          :class="[
            { upDown: item.layout == 'upDown' },
            { border: item.showBorder },
          ]"
          :style="item.styleObject"
          @click="btnClick(item)"
        >
          <span class="item-icon" v-if="item.icon && item.icon.length > 0">
            <svg class="idm_filed_svg_icon" aria-hidden="true">
              <use :xlink:href="`#${item.icon && item.icon[0]}`" />
            </svg>
          </span>
          <span>{{ item.text }}</span>
        </div>
      </template>
    </div>
    <div class="i-bottom-buttons-right">
      <template v-for="(item, index) in buttons">
        <div
          v-if="item.align === 'right'"
          class="i-bottom-buttons-item"
          :key="index"
          :class="[
            { upDown: item.layout == 'upDown' },
            { border: item.showBorder },
          ]"
          :style="item.styleObject"
          @click="btnClick(item)"
        >
          <span class="item-icon" v-if="item.icon && item.icon.length > 0">
            <svg class="idm_filed_svg_icon" aria-hidden="true">
              <use :xlink:href="`#${item.icon && item.icon[0]}`" />
            </svg>
          </span>
          <span>{{ item.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Empty, Loading, Image as VanImage } from "vant";
import "vant/lib/empty/style";
import "vant/lib/loading/style";
import "vant/lib/image/style";

export default {
  name: "IBottomButtons",
  components: {
    [Empty.name]: Empty,
    [Loading.name]: Loading,
    [VanImage.name]: VanImage,
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        buttons: [
          {
            key: "collect",
            textType: "fixed",
            layout: "upDown",
            icon: "",
            align: "left",
            text: "12",
            showBorder: false,
          },
          {
            key: "like",
            textType: "fixed",
            layout: "upDown",
            icon: "",
            align: "left",
            text: "121",
            showBorder: false,
          },
          {
            key: "like",
            textType: "fixed",
            layout: "leftRight",
            icon: "",
            align: "right",
            text: "纠错",
            showBorder: true,
          },
        ],
      },
      buttons: [],
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
    /**
     * 按钮点击
     */
    btnClick(item){
      const func = item.clickCustomFunction && item.clickCustomFunction[0];
      func && window[func.name] &&
      window[func.name].call(this, {
        commonParam: this.commonParam(),
        item: item,
        customParams:func.param,
        _this: this,
      });

      const allFunc = this.propData.allClickCustomFunction && this.propData.allClickCustomFunction[0];
      allFunc && window[allFunc.name] &&
      window[allFunc.name].call(this, {
        commonParam: this.commonParam(),
        item: item,
        customParams:allFunc.param,
        _this: this,
      });
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
    initPropData() {
      this.propData.buttons.forEach((item) => {
        // 样式
        let styleObject = {};
        if (item.bgColor && item.bgColor.hex8) {
          styleObject["backgroundColor"] = IDM.hex8ToRgbaString(
            item.bgColor.hex8
          );
        }
        if (item.border) {
          IDM.style.setBorderStyle(styleObject, item.border);
        }
        if(item.font){
          IDM.style.setFontStyle(styleObject, item.font);
        }
        item.styleObject = styleObject;

        // 自定义文本
        if (item.textType === "customFunction") {
          const func = item.textCustomFunction && item.textCustomFunction[0];
          item.text =
            func && window[func.name] &&
            window[func.name].call(this, {
              commonParam: this.commonParam(),
              customParams:func.param,
              item: item,
              _this: this,
            });
        }
      });
      this.buttons = this.propData.buttons;
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(pageSize = {}) {
      var styleObject = {};

      const scale = this.getScale(pageSize.width);
      styleObject["--i-bottom-buttons-scale"] = scale;

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
        //     " .i-bottom-buttons-item .item-style .item-style-circle",
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
          this.propDataWatchHandle();
          break;
        case "pageResize":
          this.convertAttrToStyleObject(messageObject.message);
          break;
      }
    },
    /**
     * 交互功能：设置组件的上下文内容值
     * @param {
     *  type:"定义的类型，已知类型：pageCommonInterface（页面统一接口返回值）、"
     *  key:"数据key标识，页面每个接口设置的数据集名称，方便识别获取自己需要的数据"
     *  data:"数据集，内容为：字符串 or 数组 or 对象"
     * }
     */
    setContextValue(object) {
      console.log("统一接口设置的值", object);
      if (object.type != "pageCommonInterface") {
        return;
      }
      //这里使用的是子表，所以要循环匹配所有子表的属性然后再去设置修改默认值
      this.buttons.forEach((item) => {
        if (
          item.textType === "pageCommonInterface" &&
          object.key === item.dataName
        ) {
          item.text = this.getExpressData(
            item.dataName,
            item.dataFiled,
            object.data
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$scale: var(--i-bottom-buttons-scale);

.i-bottom-buttons-outer {
  position: fixed;
  bottom: 0;
  padding: calc(20px * #{$scale}) calc(12px * #{$scale});
  background-color: #fff;
  box-shadow: 0 calc(2px * #{$scale}) calc(12px * #{$scale}) 0
    rgba(0, 0, 0, 0.07);
  color: #666666;
  font-size: calc(14px * #{$scale});
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  .i-bottom-buttons-left,
  .i-bottom-buttons-right {
    display: flex;

    .i-bottom-buttons-item {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: calc(5px * #{$scale});
      padding: calc(10px * #{$scale});
      margin-right: calc(8px * #{$scale});

      &:last-child {
        margin-right: 0;
      }

      .idm_filed_svg_icon {
        font-size: 1.1em;
        width: 1.1em;
        height: 1.1em;
        fill: currentColor;
        vertical-align: -0.15em;
        outline: none;
      }

      .item-icon {
        margin-bottom: calc(4px * #{$scale});
      }

      &.upDown {
        flex-direction: column;
      }

      &.border {
        border: 1px solid #d4d4d4;
        padding: calc(10px * #{$scale}) calc(26px * #{$scale});

        .item-icon {
          margin-bottom: 0;
          margin-right: calc(6px * #{$scale});
        }
      }
    }
  }
}
</style>
