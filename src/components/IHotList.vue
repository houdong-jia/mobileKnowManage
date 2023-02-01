<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div
    idm-ctrl="idm_module"
    :id="moduleObject.id"
    :idm-ctrl-id="moduleObject.id"
    class="i-hotList-outer"
  >
    <div key="i-hotList-header" class="i-hotList-header" v-if="propData.isShowTitleBar">
      <div class="i-hotList-header-main">
        <div class="i-hotList-header-tit">
          <span v-if="propData.titleIconPosition === 'right'">{{ propData.title }}</span>
          <div class="i-hotList-header-tit-icon" v-if="propData.showIcon">
            <svg
              v-if="propData.titleIcon && propData.titleIcon.length > 0"
              class="idm_filed_svg_icon"
              aria-hidden="true"
            >
              <use :xlink:href="`#${propData.titleIcon && propData.titleIcon[0]}`" />
            </svg>
            <svg-icon v-else class="idm_filed_svg_icon" icon-class="shu" />
          </div>
          <span v-if="propData.titleIconPosition === 'left'">{{ propData.title }}</span>
        </div>
      </div>
      <div class="i-hotList-header-more" v-if="propData.showMore" @click="onMoreClick">
        <span>{{propData.moreDesc || ''}}</span>
        <svg
          v-if="propData.moreIcon && propData.moreIcon.length > 0"
          class="idm_filed_svg_icon"
          aria-hidden="true"
        >
          <use :xlink:href="`#${propData.moreIcon && propData.moreIcon[0]}`" />
        </svg>
        <svg-icon v-else icon-class="arrowRight" className="idm_filed_svg_icon"/>
      </div>
    </div>
    <div class="i-hotList-content">
      <template v-if="data && data.length">
        <div
          class="record"
          v-for="(record, i) in formatHotList"
          :key="i"
        >
          <div
            :class="`item item-${config.key}`"
            :style="{
              'background-image': config.bgUrlFiled ? `url(${IDM.url.getWebPath(getExpressData('data', config.bgUrlFiled, data))})` : '',
              'flex-grow': config.rowSpan || 1,
              'align-items': config.yPosition,
              'justify-content': config.xPosition
            }"
            v-for="(config, index) in record"
            :key="index"
            @click="onItemClick(config, index)"
          >
            <div class="item-name">
              {{ config.textFiled ? getExpressData('data', config.textFiled, data) : '' }}
            </div>
          </div>
        </div>
      </template>
      <van-empty
        v-else
        :image-size="emptyImageSize"
        :description="'暂无数据'"
        :style="{width: '100%', height: '100%'}"
      >
        <template #image>
          <van-image
            :src="
              IDM.url.getModuleAssetsWebPath(require('../assets/empty-default.png'), moduleObject)
            "
          />
        </template>
      </van-empty>
    </div>
  </div>
</template>

<script>
const devResult = () => [
  {
    text: "目录1"
  },
  {
    text: "目录2"
  },
  {
    text: "目录3"
  },
  {
    text: "目录4"
  },
  {
    text: "目录5"
  }
]
import { Empty, Image as VanImage } from 'vant';
import 'vant/lib/empty/style';
import 'vant/lib/image/style';
export default {
  name: 'IHotList',
  components: {
    [Empty.name]: Empty,
    [VanImage.name]: VanImage
  },
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        dataSource: '1',
        isShowTitleBar: true,
        showMore: true,
        showIcon: true,
        titleIconPosition: 'left',
        title: '卡片标题',
        moreDesc: '更多',
        hotList: [
          { colIndex: 1, key: '1', textFiled: '[0].text', bgUrlFiled: '[0].bgUrl', rowSpan: 2 },
          { colIndex: 2, key: '2', textFiled: '[1].text' },
          { colIndex: 2, key: '3', textFiled: '[2].text' },
          { colIndex: 3, key: '4', textFiled: '[3].text' },
          { colIndex: 3, key: '5', textFiled: '[4].text' }
        ]
      },
      // 当前设备宽度
      currentEquipWidth: '',
      data: []
    };
  },
  props: {},
  computed: {
    formatHotList() {
      const tempList = [];
      this.propData.hotList?.forEach(item => {
        if (!tempList[item.colIndex - 1]) {
          tempList[item.colIndex - 1] = [item];
        } else {
          tempList[item.colIndex - 1] = [...tempList[item.colIndex - 1], item];
        }
      });
      return tempList;
    },
    emptyImageSize() {
      return this.translatePxToAdaptation(this.propData.emptyImageSize || 70);
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.initData();
    this.convertAttrToStyleObject();
    this.convertItemAttrToStyleObject();
    // 主题
    this.convertThemeListAttrToStyleObject();
  },
  destroyed() {},
  methods: {
    onMoreClick(){
      if (this.moduleObject.env !== 'production') {
        return;
      }
      if (this.propData.moreJumpType === 'custom') {
        this.customFunctionHandle(this.propData.customMoreBtnFunction);
      } else if (this.propData.moreJumpType === 'tab' && this.propData.moreUrl) {
        const item = {
          isTabReload: "-1",
          name: this.propData.title,
          action: IDM.url.getWebPath(this.propData.moreUrl)
        };
        window.$$iframeCtrl && window.$$iframeCtrl.addTab(item);
      } else if (this.propData.moreUrl) {
        const url = IDM.url.getWebPath(this.propData.moreUrl);
        window.open(url, this.propData.moreJumpType || '_block');
      }
    },
    onItemClick(config, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleItemClick, {
        config: config,
        index: index,
        data: this.data
      })
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.initData();
      this.convertAttrToStyleObject();
      this.convertItemAttrToStyleObject();
      // 主题
      this.convertThemeListAttrToStyleObject();
    },
    customFormat(customFunction, data) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        data =
          window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            data
          });
      }
      return data;
    },
    customFunctionHandle(customFunction, param = {}) {
      if (customFunction && customFunction[0] && customFunction[0].name) {
        return window[customFunction[0].name] &&
          window[customFunction[0].name].call(this, {
            commonParam: this.commonParam(),
            customParam: customFunction[0].param,
            ...param
          });
      }
    },
    commonParam() {
      return {
        moduleObject: this.moduleObject,
        pageId:
          window.IDM.broadcast && window.IDM.broadcast.pageModule
            ? window.IDM.broadcast.pageModule.id
            : '',
        urlObject: IDM.url.queryObject()
      };
    },
    /**
     * 通用的获取表达式匹配后的结果
     */
    getExpressData(dataName, dataFiled, resultData) {
      //给defaultValue设置dataFiled的值
      let _defaultVal = undefined;
      if (dataFiled) {
        let filedExp = dataFiled;
        filedExp = dataName + (filedExp.startsWiths('[') ? '' : '.') + filedExp;
        let dataObject = { IDM: window.IDM };
        dataObject[dataName] = resultData;
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject, false);
      }
      return _defaultVal;
    },
    /**
     * 重新加载
     */
    reload() {
      //请求数据源
      this.initData();
    },
    initData() {
      //所有地址的url参数转换
      const param = this.commonParam();
      if (!this.propData.dataSource || !this.propData.dataSource[0]?.id) {
        if (this.moduleObject.env !== 'production') {
          this.data = devResult();
        }
        return;
      }
      IDM.datasource.request(this.propData.dataSource[0]?.id, {
        moduleObject: this.moduleObject,
        param
      }, (data) => {
        this.data = data || [];
      })
    },
    /**
     * 每项样式
     */
    convertItemAttrToStyleObject() {
      const hotList = this.propData.hotList;
      if (!hotList) {
        return;
      }
      for (var i = 0; i < hotList.length; i++) {
        const item = hotList[i];
        if (!(item.key)) {
          continue;
        }
        const itemStyleObject = {};
        const itemNameStyleObject = {};

        if (item.bgSize && item.bgSize == 'custom') {
          itemStyleObject['background-size'] =
            (item.bgSizeWidth
              ? item.bgSizeWidth.inputVal + item.bgSizeWidth.selectVal
              : 'auto') +
            ' ' +
            (item.bgSizeHeight
              ? item.bgSizeHeight.inputVal + item.bgSizeHeight.selectVal
              : 'auto');
        } else if (item.bgSize) {
          itemStyleObject['background-size'] = item.bgSize;
        }

        if (item.positionX && item.positionX.inputVal) {
          itemStyleObject['background-position-x'] =
            item.positionX.inputVal + item.positionX.selectVal;
        }

        if (item.positionY && item.positionY.inputVal) {
          itemStyleObject['background-position-y'] =
            item.positionY.inputVal + item.positionY.selectVal;
        }

        for (const key in item) {
          if (item.hasOwnProperty.call(item, key)) {
            const element = item[key];
            if (!element && element !== false && element != 0) {
              continue;
            }
            switch (key) {
              case 'bgColor':
                itemStyleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
                break;
              case 'bgImgUrl':
                itemStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
                break;
              case 'bgRepeat':
                itemStyleObject['background-repeat'] = element;
                break;
              case 'bgAttachment':
                itemStyleObject['background-attachment'] = element;
                break;
              case 'width':
            case 'height':
              itemStyleObject[key] = element;
              break;
              case 'boxShadow':
                itemStyleObject['box-shadow'] = element;
                break;
              case 'box':
                IDM.style.setBoxStyle(itemStyleObject, element);
                break;
              case 'border':
                IDM.style.setBorderStyle(itemStyleObject, element);
                break;
              case 'font':
                IDM.style.setFontStyle(itemNameStyleObject, element);
                itemNameStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                  this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                  element.fontSize + element.fontSizeUnit
                break;
            }
          }
        }
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-hotList-content .record .item-${item.key}`,
          itemStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-hotList-content .record .item-${item.key} .item-name`,
          itemNameStyleObject
        );
      }
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};
      const headerStyleObject = {};
      const titleStyleObject = {};
      const innerCardStyleObject = {};
      const iconStyleObject = {};
      const moreStyleObject = {};
      const moreIconStyleObject={};

      if (this.propData.bgSize && this.propData.bgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.bgSizeWidth
            ? this.propData.bgSizeWidth.inputVal + this.propData.bgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.bgSizeHeight
            ? this.propData.bgSizeHeight.inputVal + this.propData.bgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.bgSize) {
        styleObject['background-size'] = this.propData.bgSize;
      }
      if (this.propData.innerBgSize && this.propData.innerBgSize == 'custom') {
        innerCardStyleObject['background-size'] =
          (this.propData.innerBgSizeWidth
            ? this.propData.innerBgSizeWidth.inputVal + this.propData.innerBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.innerBgSizeHeight
            ? this.propData.innerBgSizeHeight.inputVal + this.propData.innerBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.innerBgSize) {
        innerCardStyleObject['background-size'] = this.propData.innerBgSize;
      }

      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.innerPositionX && this.propData.innerPositionX.inputVal) {
        innerCardStyleObject['background-position-x'] =
          this.propData.innerPositionX.inputVal + this.propData.innerPositionX.selectVal;
      }

      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
      }
      if (this.propData.innerPositionY && this.propData.innerPositionY.inputVal) {
        innerCardStyleObject['background-position-y'] =
          this.propData.innerPositionY.inputVal + this.propData.innerPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'width':
            case 'height':
              styleObject[key] = element;
              break;
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'innerBgColor':
              innerCardStyleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'innerBox':
              IDM.style.setBoxStyle(innerCardStyleObject, element);
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'innerBgImgUrl':
              innerCardStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(
                element
              )})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'innerBgRepeat':
              //平铺模式
              innerCardStyleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'innerBgAttachment':
              //背景模式
              innerCardStyleObject['background-attachment'] = element;
              break;
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'innerBorder':
              IDM.style.setBorderStyle(innerCardStyleObject, element);
              break;
            case 'titleFont':
              IDM.style.setFontStyle(titleStyleObject, element);
              titleStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'titleIconColor':
              iconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'titleIconSize':
              iconStyleObject['font-size'] = this.translatePxToAdaptation(element) + 'px';
              break;
            case 'moreIconColor':
              moreIconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'moreIconSize':
              moreIconStyleObject['font-size'] = this.translatePxToAdaptation(element) + 'px';
              break;
            case 'headerBox':
              IDM.style.setBoxStyle(headerStyleObject, element);
              break;
            case 'moreFont':
              IDM.style.setFontStyle(moreStyleObject, element);
              moreStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-hotList-content',
        innerCardStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-hotList-header',
        headerStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.id + ' .i-hotList-header-tit span',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-hotList-header-tit .i-hotList-header-tit-icon',
        iconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-hotList-header .i-hotList-header-more span',
        moreStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-hotList-header .i-hotList-header-more .idm_filed_svg_icon',
        moreIconStyleObject
      );
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
        IDM.setting && IDM.setting.applications && IDM.setting.applications.themeNamePrefix
          ? IDM.setting.applications.themeNamePrefix
          : 'idm-theme-';
      for (var i = 0; i < themeList.length; i++) {
        const item = themeList[i];

        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-hotList-outer .i-hotList-header-tit .i-hotList-header-tit-icon',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-hotList-outer .i-hotList-header .i-hotList-header-more span',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-hotList-outer .i-hotList-header .i-hotList-header-more .idm_filed_svg_icon',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
      }
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
    receiveBroadcastMessage(object) {
      if (object.type && object.type === 'pageResize') {
        this.currentEquipWidth = object.message?.width;
        this.convertAttrToStyleObject();
        this.convertItemAttrToStyleObject();
      }
    },
    /**
     * 移动端文字大小自适应
     */
    translatePxToAdaptation(data) {
      const clientWidth = this.currentEquipWidth;
      if (!data || !clientWidth) {
        return data;
      }
      const adaptationBase = this.propData.adaptationBase || 414;
      const adaptationPercent = this.propData.adaptationPercent || 1;
      const percent = (clientWidth / adaptationBase - 1) * (adaptationPercent - 1) + 1;
      return Math.round(data * percent);
    },
  }
};
</script>
<style lang="scss" scoped>
.i-hotList-outer {
  width: auto;
  box-sizing: border-box;
  padding: 0 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 168px;
  overflow: hidden;

  .i-hotList-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .i-hotList-header-main {
      // width: 86%;
      flex-grow: 1;
      display: flex;
      align-items: center;

      .i-hotList-header-tit {
        font-size: 16px;
        color: #333;
        text-decoration: none;
        max-width: 60%;
        display: flex;
        align-items: center;
        line-height: 40px;

        .i-hotList-header-tit-icon {
          color: #2871E1;
          font-size: 18px;
          // margin-right: 5px;
          display: inline-block;
          flex: 1;
        }

        span {
          // margin-right: 5px;
          width: 90%;
          flex: 8;
        }

        .idm_filed_svg_icon {
          font-size: 1em;
          width: 1em;
          height: 1em;
          fill: currentColor;
          vertical-align: -0.15em;
          outline: none;
        }
      }
    }

    .i-hotList-header-more {
      margin: 0 5px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
      span {
        font-size: 14px;
        color: #0954C6;
        margin: 0 3px;
      }
      .idm_filed_svg_icon {
        color: #0954C6;
        font-size: 18px;
        width: 1em;
        height: 1em;
        fill: currentColor;
        vertical-align: -0.2em;
        outline: none;
      }
    }
  }

  .i-hotList-content {
    flex-grow: 1;
    flex-shrink: 1;
    height: 0;
    // border-top: 1px solid #ccc;
    display: flex;
    align-items: stretch;
    flex-direction: row;
    flex-wrap: nowrap;
    .record {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      justify-content: flex-start;
      .item {
        flex-grow: 0;
        margin: 5px;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        height: auto;
        width: auto;
        background-color: #D2F0F8;
        .item-name {
          position: relative;
          // padding: 5px;
        }
      }
    }
  }
}
</style>
