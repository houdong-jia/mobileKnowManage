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
    class="i-searchJump-outer"
    ref="module_ref"
  >
    <div class="i-searchJump-content">
      <van-search
        v-model="value"
        :placeholder="propData.placeholder"
        background="transparent"
        @search="onSearch"
        class="i-searchJump-content-search"
      />
      <div
        v-if="propData.showDrag"
        class="drag_container i-searchJump-content-drag"
        idm-ctrl-inner
        :idm-ctrl-id="moduleObject.id"
        idm-container-index="1"
      />
    </div>
    <div class="i-searchJump-hotwords" v-if="propData.showHotWords && data && data.length">
      <span class="label" v-if="propData.hotWordsTitle">
        {{propData.hotWordsTitle}}
      </span>
      <span
        class="item"
        v-for="(item, index) in data"
        :key="index"
        @click="onHotWordClick(item)"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script>
const devResult = () => ['关键词1','关键词2','关键词3'];
export default {
  name: 'ISearchJump',
  data() {
    return {
      moduleObject: {},
      currentEquipWidth: 0,
      propData: this.$root.propData.compositeAttr || {
        hotWordsTitle: "热门搜索：",
        showHotWords: true,
        showDrag: true,
        shape: "round",
        placeholder: "请输入检索词"
      },
      data: {},
      value: ""
    };
  },
  props: {},
  watch: {
    'propData.dataSource': {
      handler(newValue, oldValue) {
        if (this.moduleObject.env !== 'production' && ((newValue && newValue[0]?.id) != (oldValue && oldValue[0]?.id))) {
          this.initData();
        }
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject;
    this.getClientWidth();
    this.convertAttrToStyleObject();
    this.convertSearchAttrToStyleObject();
    this.convertHotWordsAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
    this.propData.showHotWords && this.initData();
  },
  methods: {
    getElementData(dataFiled, elementFiled) {
      const data = this.getExpressData('data', dataFiled, this.data)
      return this.getExpressData('data', elementFiled, data)
    },
    onSearch(){
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleSearch, {
        value: this.value
      })
    },
    onHotWordClick(item){
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleHotWordClick, {
        value: item
      })
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.convertSearchAttrToStyleObject();
      this.convertHotWordsAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch (messageObject.type) {
        case 'linkageReload':
          this.initData();
          break;
        case 'pageResize':
          this.currentEquipWidth = messageObject.message?.width;
          this.convertAttrToStyleObject();
          this.convertSearchAttrToStyleObject();
          this.convertHotWordsAttrToStyleObject();
          this.convertThemeListAttrToStyleObject();
          break;
      }
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
        _defaultVal = window.IDM.express.replace.call(this, '@[' + filedExp + ']', dataObject, true);
      }
      return _defaultVal;
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
     * 请求数据
     */
    initData() {
      if (!this.propData.dataSource || !this.propData.dataSource[0]?.id) {
        if (this.moduleObject.env !== 'production') {
          this.data = devResult();
        }
        return;
      }
      IDM.datasource.request(this.propData.dataSource[0]?.id, {
        moduleObject: this.moduleObject
      }, (data) => {
        this.data = data;
      })
    },
    getClientWidth() {
      if (this.moduleObject.env == 'develop') {
        return;
      } else {
        this.currentEquipWidth = window.innerWidth;
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
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject() {
      const styleObject = {};

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
      if (this.propData.positionX && this.propData.positionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.positionX.inputVal + this.propData.positionX.selectVal;
      }
      if (this.propData.positionY && this.propData.positionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.positionY.inputVal + this.propData.positionY.selectVal;
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
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'bgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'bgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'bgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'bgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id, styleObject);
    },
    convertSearchAttrToStyleObject() {
      const searchStyleObject = {};
      const searchFontStyleObject = {};
      const searchIconStyleObject = {};
      const searchPlaceholderStyleObject = {};

      if (this.propData.searchBgSize && this.propData.searchBgSize == 'custom') {
        searchStyleObject['background-size'] =
          (this.propData.searchBgSizeWidth
            ? this.propData.searchBgSizeWidth.inputVal + this.propData.searchBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.searchBgSizeHeight
            ? this.propData.searchBgSizeHeight.inputVal + this.propData.searchBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.searchBgSize) {
        searchStyleObject['background-size'] = this.propData.searchBgSize;
      }
      if (this.propData.searchPositionX && this.propData.searchPositionX.inputVal) {
        searchStyleObject['background-position-x'] =
          this.propData.searchPositionX.inputVal + this.propData.searchPositionX.selectVal;
      }
      if (this.propData.searchPositionY && this.propData.searchPositionY.inputVal) {
        searchStyleObject['background-position-y'] =
          this.propData.searchPositionY.inputVal + this.propData.searchPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'searchWidth':
              searchStyleObject['width'] = element;
              break;
            case 'searchHeight':
              searchStyleObject['height'] = element;
              break;
            case 'searchBoxShadow':
              searchStyleObject['box-shadow'] = element;
              break;
            case 'searchBox':
              IDM.style.setBoxStyle(searchStyleObject, element);
              break;
            case 'searchBorder':
              IDM.style.setBorderStyle(searchStyleObject, element);
              break;
            case 'searchBgColor':
              searchStyleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'searchBgImgUrl':
              searchStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'searchBgRepeat':
              //平铺模式
              searchStyleObject['background-repeat'] = element;
              break;
            case 'searchBgAttachment':
              //背景模式
              searchStyleObject['background-attachment'] = element;
              break;
            case 'searchFont':
              IDM.style.setFontStyle(searchFontStyleObject, element);
              searchFontStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              IDM.style.setFontStyle(searchPlaceholderStyleObject, element);
              searchPlaceholderStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'searchIconSize':
              searchIconStyleObject['font-size'] = element ? this.translatePxToAdaptation(element) + 'px' : ''
              break;
            case 'searchIconColor':
              searchIconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : ''
              searchPlaceholderStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : ''
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-content .i-searchJump-content-search .van-search__content`,
        searchStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-content .i-searchJump-content-search .van-search__content .van-field__control`,
        searchFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-content .i-searchJump-content-search .van-search__content .van-icon`,
        searchIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-content .i-searchJump-content-search .van-search__content .van-field__control::-webkit-input-placeholder`,
        searchPlaceholderStyleObject
      );
    },
    convertHotWordsAttrToStyleObject() {
      const hotWordsStyleObject = {};
      const hotWordsLabelFontStyleObject = {};
      const hotWordsItemFontStyleObject = {};

      if (this.propData.hotWordsBgSize && this.propData.hotWordsBgSize == 'custom') {
        hotWordsStyleObject['background-size'] =
          (this.propData.hotWordsBgSizeWidth
            ? this.propData.hotWordsBgSizeWidth.inputVal + this.propData.hotWordsBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.hotWordsBgSizeHeight
            ? this.propData.hotWordsBgSizeHeight.inputVal + this.propData.hotWordsBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.hotWordsBgSize) {
        hotWordsStyleObject['background-size'] = this.propData.hotWordsBgSize;
      }
      if (this.propData.hotWordsPositionX && this.propData.hotWordsPositionX.inputVal) {
        hotWordsStyleObject['background-position-x'] =
          this.propData.hotWordsPositionX.inputVal + this.propData.hotWordsPositionX.selectVal;
      }
      if (this.propData.hotWordsPositionY && this.propData.hotWordsPositionY.inputVal) {
        hotWordsStyleObject['background-position-y'] =
          this.propData.hotWordsPositionY.inputVal + this.propData.hotWordsPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'hotWordsWidth':
              hotWordsStyleObject['width'] = element;
              break;
            case 'hotWordsHeight':
              hotWordsStyleObject['height'] = element;
              break;
            case 'hotWordsBoxShadow':
              hotWordsStyleObject['box-shadow'] = element;
              break;
            case 'hotWordsBox':
              IDM.style.setBoxStyle(hotWordsStyleObject, element);
              break;
            case 'hotWordsBorder':
              IDM.style.setBorderStyle(hotWordsStyleObject, element);
              break;
            case 'hotWordsBgColor':
              hotWordsStyleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'hotWordsBgImgUrl':
              hotWordsStyleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'hotWordsBgRepeat':
              //平铺模式
              hotWordsStyleObject['background-repeat'] = element;
              break;
            case 'hotWordsBgAttachment':
              //背景模式
              hotWordsStyleObject['background-attachment'] = element;
              break;
            case 'hotWordsLabelFont':
              IDM.style.setFontStyle(hotWordsLabelFontStyleObject, element);
              hotWordsLabelFontStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'hotWordsItemFont':
              IDM.style.setFontStyle(hotWordsItemFontStyleObject, element);
              hotWordsItemFontStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'hotWordsMargin':
              hotWordsItemFontStyleObject['margin-left'] = element ? element + 'px' : ''
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-hotwords`,
        hotWordsStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-hotwords .label`,
        hotWordsLabelFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-searchJump-hotwords .item`,
        hotWordsItemFontStyleObject
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
            ' .i-searchJump-hotwords .item',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' .i-searchJump-hotwords .label',
          {color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''}
        );
      }
    }
  }
};
</script>

<style lang="scss">
.i-searchJump-outer {
  width: auto;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  padding: 10px;

  .i-searchJump-content {
    display: flex;
    align-items: center;
    .i-searchJump-content-search {
      flex: 1;
      padding: 0;
      margin-right: 15px;
      .van-search__content {
        background-color: rgba(255,255,255,0.68);
        border-radius: 27.5px;
        .van-cell {
          align-items: center;
        }
        .van-icon {
          font-size: 20px;
          color: #999999;
        }
        .van-field__control {
          color: #000000A6;
          font-size: 14px;
          &::-webkit-input-placeholder {
            color: #999999;
            font-size: 14px;
          }
        } 
      }
    }
    // .i-searchJump-content-drag {
    //   width: 34px;
    //   height: 34px;
    // }
  }
  .i-searchJump-hotwords {
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
    color: #0091FF;
    font-weight: 400;
    .item {
      text-decoration: underline;
      margin-left: 10px;
    }
  }
}
</style>
