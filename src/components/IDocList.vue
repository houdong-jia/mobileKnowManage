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
    class="i-docList-outer"
    ref="module_ref"
  >
    <div key="i-docList-content" class="i-docList-content">
      <van-list
        v-model="loading"
        :finished="finished"
        :loading-text="propData.loadDesc"
        :finished-text="propData.finishedDesc"
        @load="onLoad"
      >
        <div class="i-docList-content-item" v-for="item,index in data" :key="index" @click="onItemClick(item, index)" :style="{cursor: propData.handleClickCustomFunction && propData.handleClickCustomFunction[0] && propData.handleClickCustomFunction[0].name ? 'pointer' : ''}">
          <div class="item-title">
            <div class="img" v-if="propData.titleLeftType == 'img' && propData.imageField">
              <img
                width="100%"
                height="100%"
                :src="
                  IDM.url.getWebPath(getExpressData('data', propData.imageField, item))
                "
              />
            </div>
            <div class="icon" v-if="propData.titleLeftType == 'icon' && propData.icon && propData.icon.length">
              <svg
                class="idm_filed_svg_icon"
                aria-hidden="true"
              >
                <use :xlink:href="`#${propData.icon && propData.icon[0]}`" />
              </svg>
            </div>
            <div class="title" v-if="propData.titleFiled">{{getExpressData('data', propData.titleFiled, item)}}</div>
            <div
              class="tag"
              v-if="propData.titleTagName"
              v-show="propData.titleTagCompareField ? propData.titleTagCompareValue ? item[propData.titleTagCompareField] == propData.titleTagCompareValue : item[propData.titleTagCompareField] : true"
            >
              {{propData.titleTagName}}
            </div>
          </div>
          <DocListExtra :extraList="middleExtraList" :item="item" :index="index" :getExpressData="getExpressData" :onExtraClick="onExtraClick" />
          <div class="item-content" v-if="propData.contentFiled" v-html="getExpressData('data', propData.contentFiled, item)" :style="{'-webkit-line-clamp': propData.lineClamp}" />
          <DocListExtra :extraList="bottomExtraList" :item="item" :index="index" :getExpressData="getExpressData" :onExtraClick="onExtraClick" />
          <div class="item-float" :style="{top: propData.floatTop + 'px', bottom: propData.floatBottom + 'px', right: propData.floatRight + 'px', left: propData.floatLeft + 'px'}" v-if="propData.floatItemType != 'none'">
            <van-button v-if="propData.floatItemType == 'button'" :color="propData.buttonColor && propData.buttonColor.hex8 ? IDM.hex8ToRgbaString(propData.buttonColor.hex8) : ''" size="small" @click.stop="onButtonClick(item, index)">{{propData.buttonName}}</van-button>
            <div v-if="propData.floatItemType == 'img' && propData.floatImageField" class="img" >
              <img
                width="100%"
                height="100%"
                :src="
                  IDM.url.getWebPath(getExpressData('data', propData.floatImageField, item))
                "
              />
            </div>
          </div>
        </div>
      </van-list>
      <div class="i-docList-content-empty" v-if="(!data || !data.length) && !loading">
        <img
          :src="
            IDM.url.getModuleAssetsWebPath(require('../assets/empty-default.png'), moduleObject)
          "
        />
        <div v-if="propData.emptyDesc" class="desc">{{propData.emptyDesc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
const devResult = (pageNum) => {
  const arr = [];
  for(let i=0;i<pageNum;i++){
    arr.push({
      title: `公司基本管理制度`,
      content: '公司的管理制度有助于维护工作秩序，提高工作效率。经过一定的程序严格制定相应的制度，是公司管理的依据和准则。公司管理制度大体上可以分为规章和责任制度。规章制度侧重于工作内容、范围和工作程序、方式，如管理细则、行政管理制度、生产经营管理制度。责任制度侧重于规范责任、职权和利益的界限及其关系。一套科学完整的公司管理制度可以保证企业的正常运转和职工的合法利益不受侵害一套科学完整的公司管理制度可以保证企业的正常运转和职工的合法利益不受侵害……',
      publishDate: '2022-09-22 14:34',
      viewTimes: '509',
      praiseTimes: '18',
      commentTimes: '4',
      publishName: '发布人',
      isPublished: true
    })
  }
  arr[1].update = 1
  return arr;
}
import DocListExtra from './DocListExtra.vue';
export default {
  name: 'IDocList',
  components: {
    DocListExtra
  },
  data() {
    return {
      moduleObject: {},
      currentEquipWidth: 0,
      propData: this.$root.propData.compositeAttr || {
        emptyDesc: '暂无数据',
        extraPosition: "middle",
        titleFiled: "title",
        contentFiled: "content",
        titleTagName: "有更新",
        titleLeftType: 'icon',
        imageField: 'image',
        icon: '1',
        titleTagCompareField: 'update',
        titleTagCompareValue: '1',
        lineClamp: 3,
        floatItemType: 'button',
        floatImageField: 'floatImage',
        buttonName: '取消关注',
        buttonColor: '#BEBEBEFF',
        pageNum: 10,
        extraList: [{
          textFiled: '@[publishName]',
          key: 'viewTimes',
          position: 'flex-start',
          extraPosition: 'middle',
          leftAreaType: 'img',
          imageField: 'img'
        },{
          textFiled: '发布时间：@[publishDate]',
          key: 'publishDate',
          position: 'flex-start',
          compareField: 'isPublished',
          clickType: 'none',
          extraPosition: 'bottom',
          extraWidth: '60'
        },{
          textFiled: '@[praiseTimes]人查看 · @[praiseTimes]评论',
          key: 'praiseTimes',
          position: 'flex-end',
          extraPosition: 'bottom',
          extraWidth: '40'
        },{
          textFiled: '点赞@[commentTimes]',
          key: 'commentTimes',
          position: 'flex-end',
          extraPosition: 'middle'
        }]
      },
      addParam: {},
      data: [],
      loading: false,
      finished: false,
      pageIndex: 1
    };
  },
  props: {},
  computed: {
    bottomExtraList() {
      if (this.propData.extraList && this.propData.extraList.length) {
        return this.propData.extraList.filter(item => item.extraPosition == 'bottom')
      } else {
        return []
      }
    },
    middleExtraList() {
      if (this.propData.extraList && this.propData.extraList.length) {
        return this.propData.extraList.filter(item => item.extraPosition == 'middle')
      } else {
        return []
      }
    }
  },
  watch: {
    'propData.dataSource': {
      handler(newValue, oldValue) {
        if (this.moduleObject.env !== 'production' && ((newValue && newValue[0]?.id) != (oldValue && oldValue[0]?.id))) {
          this.reloadList()
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
  },
  methods: {
    convertAttrToStyleObject() {
      this.convertOutAttrToStyleObject();
      this.convertItemAttrToStyleObject();
      this.convertExtraItemAttrToStyleObject();
      this.convertFloatItemAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    onButtonClick(item, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleButtonClickCustomFunction, {
        item,
        index,
        data: this.data,
        _this: this
      });
    },
    onItemClick(item, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      this.customFunctionHandle(this.propData.handleClickCustomFunction, {
        item,
        index,
        data: this.data,
        _this: this
      });
    },
    onExtraClick(extra, item, index) {
      if (this.moduleObject.env !== 'production') {
        return;
      }
      if (extra.clickType == 'dataSource' && extra.dataSource && extra.dataSource[0]?.id) {
        IDM.datasource.request(extra.dataSource[0]?.id, {
          moduleObject: this.moduleObject,
          param: {
            item,
          }
        }, (data) => {
          if (extra.callbackType == 'reloadCurrentPage') {
            const pageIndex = parseInt(index / this.propData.pageNum)
            this.reloadCurrentPage(pageIndex)
          }else if (extra.callbackType == 'customFunction') {
            this.customFunctionHandle(extra.callbackCustomFunction, {
              item,
              index,
              data: this.data,
              resData: data,
              _this: this
            });
          }
        })
      } else if (extra.clickType == 'customFunction') {
        this.customFunctionHandle(extra.handleClickCustomFunction, {
          item,
          index,
          data: this.data,
          _this: this
        });
      } else {
        this.onItemClick(item, index);
      }
    },
    reloadCurrentPage(index) {
      this.finished = false;
      if (index) {
        this.pageIndex = index;
      }
      const arr = this.data.slice(0, (this.pageIndex - 1) * this.propData.pageNum);
      this.onLoad(arr, this.propData.pageNum * 2);
    },
    reloadList() {
      this.finished = false;
      this.pageIndex = 1;
      this.data = [];
    },
    onLoad(arr) {
      if (this.propData.dataType != 'dataSource' || !this.propData.dataSource || !this.propData.dataSource[0]?.id) {
        // this.finished = false;
        this.loading = false;
        if (this.moduleObject.env !== 'production') {
          this.data = [...this.data, ...devResult(this.propData.pageNum)];
        }
        return;
      }
      this.loading = true;
      IDM.datasource.request(this.propData.dataSource[0]?.id, {
        moduleObject: this.moduleObject,
        param: {
          pageIndex: this.pageIndex,
          pageNum: arr ? this.propData.pageNum * 2 : this.propData.pageNum,
          ...this.addParam
        }
      }, (data) => {
        this.loading = false;
        const listData = data.data || [];
        const originListData = arr || this.data;
        this.data = [...originListData, ...listData];
        if (arr) {
          this.pageIndex = this.pageIndex + 2;
        } else {
          this.pageIndex = this.pageIndex + 1;
        }
        
        if (this.data.length > data.total) {
          this.finished = true;
        }
      })
    },
    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
    },
    /**
     * 组件通信：接收消息的方法
     */
    receiveBroadcastMessage(messageObject) {
      switch (messageObject.type) {
        case 'linkageReload':
          this.addParam = messageObject.message || {};
          this.reloadList();
          break;
        case 'linkageDemand':
          // eslint-disable-next-line no-case-declarations
          const param = this.customFunctionHandle(this.propData.customLinkageDemandFunction, { messageObject, originParam: this.addParam }) || messageObject.message;
          this.addParam = param || {};
          delete this.addParam._break;
          !param._break && this.reloadList();
          break;
        case 'pageResize':
          this.currentEquipWidth = messageObject.message?.width;
          this.convertAttrToStyleObject();
          break;
        case 'linkageResult':
          if (messageObject.message && this.propData.dataType == 'linkageResult') {
            let data = this.propData.dataFiled ? this.getExpressData('data', this.propData.dataFiled, messageObject.message) : messageObject.message;
            this.data = this.customFormat(this.propData.dataCustomFunction, data) || [];
          }
          break;
      }
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
     * 把属性转换成样式对象
     */
    convertOutAttrToStyleObject() {
      const styleObject = {};
      const emptyStyleObject = {};
      const emptyFontStyleObject = {};
      const emptyImgStyleObject = {};

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
            case 'border':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'boxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'box':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'emptyHeight':
              emptyStyleObject['height'] = element;
              break;
            case 'emptyImgSize':
              emptyImgStyleObject['height'] = element + 'px';
              emptyImgStyleObject['width'] = element + 'px';
              break;
            case 'emptyFont':
              IDM.style.setFontStyle(emptyFontStyleObject, element);
              emptyFontStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'emptyFontMargin':
              emptyFontStyleObject['margin-top'] = element + 'px';
              break;
          }
        }
      }

      window.IDM.setStyleToPageHead(this.moduleObject.packageid + ' #' + this.moduleObject.id, styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty',
        emptyStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty .desc',
        emptyFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-empty img',
        emptyImgStyleObject
      );
    },
    convertItemAttrToStyleObject() {
      const styleObject = {};
      const titleStyleObject = {};
      const contentStyleObject = {};
      const extraStyleObject = {};
      const titleFontStyleObject = {};
      const titleTagStyleObject = {};
      const titleImgStyleObject = {};
      const titleIconStyleObject = {};

      if (this.propData.itemBgSize && this.propData.itemBgSize == 'custom') {
        styleObject['background-size'] =
          (this.propData.itemBgSizeWidth
            ? this.propData.itemBgSizeWidth.inputVal + this.propData.itemBgSizeWidth.selectVal
            : 'auto') +
          ' ' +
          (this.propData.itemBgSizeHeight
            ? this.propData.itemBgSizeHeight.inputVal + this.propData.itemBgSizeHeight.selectVal
            : 'auto');
      } else if (this.propData.itemBgSize) {
        styleObject['background-size'] = this.propData.itemBgSize;
      }
      if (this.propData.itemPositionX && this.propData.itemPositionX.inputVal) {
        styleObject['background-position-x'] =
          this.propData.itemPositionX.inputVal + this.propData.itemPositionX.selectVal;
      }
      if (this.propData.itemPositionY && this.propData.itemPositionY.inputVal) {
        styleObject['background-position-y'] =
          this.propData.itemPositionY.inputVal + this.propData.itemPositionY.selectVal;
      }
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'itemWidth':
              styleObject['width'] = element;
              break;
            case 'itemHeight':
              styleObject['height'] = element;
              break;
            case 'itemBgColor':
              styleObject['background-color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'itemBgImgUrl':
              styleObject['background-image'] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case 'itemBgRepeat':
              //平铺模式
              styleObject['background-repeat'] = element;
              break;
            case 'itemBgAttachment':
              //背景模式
              styleObject['background-attachment'] = element;
              break;
            case 'itemBorder':
              IDM.style.setBorderStyle(styleObject, element);
              break;
            case 'itemBoxShadow':
              styleObject['box-shadow'] = element;
              break;
            case 'itemBox':
              IDM.style.setBoxStyle(styleObject, element);
              break;
            case 'itemTitleBox':
              IDM.style.setBoxStyle(titleStyleObject, element);
              break;
            case 'itemContentBox':
              IDM.style.setBoxStyle(contentStyleObject, element);
              break;
            case 'itemExtraBox':
              IDM.style.setBoxStyle(extraStyleObject, element);
              break;
            case 'itemContentFont':
              IDM.style.setFontStyle(contentStyleObject, element);
              contentStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'itemTitleFont':
              IDM.style.setFontStyle(titleFontStyleObject, element);
              titleFontStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              break;
            case 'itemTitleImgSize':
              titleImgStyleObject['width'] = this.translatePxToAdaptation(element) + 'px';
              titleImgStyleObject['height'] = this.translatePxToAdaptation(element) + 'px';
              break;
            case 'itemTitleIconSize':
              titleIconStyleObject['font-size'] = this.translatePxToAdaptation(element) + 'px';
              break;
            case 'itemTileIconColor':
              titleIconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
              break;
            case 'itemTitleTagFont':
              IDM.style.setFontStyle(titleTagStyleObject, element);
              titleTagStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                element.fontSize + element.fontSizeUnit
              titleTagStyleObject['border-color'] = element.fontColors.hex8 ? IDM.hex8ToRgbaString(element.fontColors.hex8) : '';
              break;
            case 'itemTitleTagMargin':
              titleTagStyleObject['margin-left'] = element + 'px';
              break;
            case 'itemTitleImgMargin':
              titleImgStyleObject['margin-right'] = element + 'px';
              titleIconStyleObject['margin-right'] = element + 'px';
              break;
          }
        }
      }

      window.IDM.setStyleToPageHead(this.moduleObject.packageid + ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item', styleObject);
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title',
        titleStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-content',
        contentStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-extra',
        extraStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .title',
        titleFontStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .img',
        titleImgStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .icon',
        titleIconStyleObject
      );
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-title .tag',
        titleTagStyleObject
      );
    },
    convertFloatItemAttrToStyleObject() {
      const styleObject = {};

      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element != 0) {
            continue;
          }
          switch (key) {
            case 'floatWidth':
              styleObject['width'] = element;
              break;
            case 'floatHeight':
              styleObject['height'] = element;
              break;
            case 'floatBorderRadius':
              styleObject['border-radius'] = element + 'px';
              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
        this.moduleObject.packageid +
          ' #' +
          this.moduleObject.id +
          ' .i-docList-content .i-docList-content-item .item-float',
        styleObject
      );
    },
    convertExtraItemAttrToStyleObject() {
      const extraList = this.propData.extraList;
      if (!extraList) {
        return;
      }
      for (var i = 0; i < extraList.length; i++) {
        const extra = extraList[i];
        if (!(extra.key)) {
          continue;
        }
        const itemStyleObject = {};
        const iconStyleObject = {};
        const textStyleObject = {};
        const imgStyleObject = {};
        for (const key in extra) {
          if (extra.hasOwnProperty.call(extra, key)) {
            const element = extra[key];
            if (!element && element !== false && element != 0) {
              continue;
            }
            switch (key) {
              case 'box':
                IDM.style.setBoxStyle(itemStyleObject, element);
                break;
              case 'imgSize':
                imgStyleObject['width'] = this.translatePxToAdaptation(element) + 'px';
                imgStyleObject['height'] = this.translatePxToAdaptation(element) + 'px';
              break;
              case 'iconSize':
                iconStyleObject['font-size'] = this.translatePxToAdaptation(element) + 'px';
                break;
              case 'iconColor':
                iconStyleObject['color'] = element && element.hex8 ? IDM.hex8ToRgbaString(element.hex8) : '';
                break;
              case 'iconMargin':
                iconStyleObject['margin-right'] = element + 'px';
                imgStyleObject['margin-right'] = element + 'px';
                break;
              case 'extrafont':
                IDM.style.setFontStyle(textStyleObject, element);
                textStyleObject['font-size'] = element.fontSizeUnit == 'px' ?
                  this.translatePxToAdaptation(element.fontSize) + element.fontSizeUnit :
                  element.fontSize + element.fontSizeUnit
                break;
            }
          }
        }
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key}`,
          itemStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key} .icon`,
          iconStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key} .img`,
          imgStyleObject
        );
        window.IDM.setStyleToPageHead(
          this.moduleObject.packageid + ' #' + this.moduleObject.id + ` .i-docList-content .i-docList-content-item .item-extra .item-${extra.key} .text`,
          textStyleObject
        );
      }
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
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-extra .item .text',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-extra .item .icon',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-title .tag',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
            'border-color': item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : '',
          }
        );
        IDM.setStyleToPageHead(
          '.' +
            themeNamePrefix +
            item.key +
            ' #' + this.moduleObject.id + ' .i-docList-content .i-docList-content-item .item-title .icon',
          {
            color: item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : ''
          }
        );
      }
    }
  }
};
</script>

<style lang="scss">
.i-docList-outer {
  box-sizing: border-box;
  padding: 0 10px;
  margin: 0 10px;
  position: relative;
  // &::-webkit-scrollbar-track-piece {
  //   background-color: #ffffff;
  // }

  // &::-webkit-scrollbar {
  //   width: 8px;
  //   height: 9px;
  // }

  // &::-webkit-scrollbar-thumb {
  //   background-color: #ebebeb;
  //   background-clip: padding-box;
  //   min-height: 28px;
  //   border-radius: 4px;
  // }

  .i-docList-content {
    .i-docList-content-item {
      padding: 15px;
      background: #FFFFFF;
      box-shadow: 0px 2px 9px 7px rgba(238,238,238,0.5);
      border-radius: 10px;
      margin: 10px 0;
      position: relative;
      .item-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .img{
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          margin-right: 5px;
        }
        .icon {
          flex-shrink: 0;
          line-height: 1;
          font-size: 22px;
          color: #0954C6;
          margin-right: 5px;
          .idm_filed_svg_icon {
            font-size: 1em;
            width: 1em;
            height: 1em;
            line-height: 1;
            fill: currentColor;
            vertical-align: -0.15em;
            outline: none;
          }
        }
        .title{
          font-size: 16px;
          color: #333333;
          letter-spacing: 0;
          line-height: 22px;
          font-weight: 500;
        }
        .tag {
          flex-shrink: 0;
          font-size: 12px;
          line-height: 18px;
          color: #0079FF;
          border: 1px solid rgba(0,145,255,1);
          border-radius: 2px;
          padding: 0 5px;
          margin-left: 10px;
        }
      }
      .item-content {
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 22px;
        font-weight: 400;
        text-indent: 2em;
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      .item-float {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 15px;
        width: 75px;
        height: 34px;
        border-radius: 7px;
        margin: auto;
        .img {
          width: 100%;
          height: 100%;
        }
        .van-button {
          width: 100%;
          height: 100%;
        }
      }
    }

    .i-docList-content-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 150px;
        height: 150px;
      }
      .desc {
        font-size: 14px;
        color: #666666;
        line-height: 22px;
        margin-top: 10px;
      }
    }
  }
}
</style>
