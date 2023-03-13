<template>
  <div idm-ctrl="idm_module"
       :id="moduleObject.id"
       :idm-ctrl-id="moduleObject.id"
       class="IStudy-Card">
    <div class="container">
      <van-loading v-if="isLoading" size="24px" vertical>加载中...</van-loading>
      <template v-else>
        <div class="study-card">
          <div class="study-card-header" v-if="propData.isShowHeadText">
            <div class="left">
              <a-space class="icon">
                <svg-icon icon-class="shu"/>
              </a-space>
              <div class="left-text">{{ propData.headText }}</div>
            </div>
            <div class="right" @click="showMoreData" v-if="propData.isShowMore">
              <div class="right-text">
                更多
              </div>
              <a-space class="icon">
                <svg-icon icon-class="rightCircleOutLined"/>
              </a-space>
            </div>
          </div>
          <div class="video-list">
            <div class="video-card" v-for="(item) in videoData" :key="item.index" @click=toVideo(item)>
              <div class="videoImg">
                <img :src="getImageUrl(item)">
                <div class="videoData">
                  <div class="left-data">
                    <svg-icon icon-class="youtube" color="white" v-show="propData.isShowVideoNum"/>
                    <p class="video-data-text" v-show="propData.isShowVideoNum">{{ item[propData.videoAmountOfPlay] }}</p>
                  </div>
                  <p class="video-data-text"> {{ item[propData.videoReleaseDate] }}</p></div>
              </div>
              <p class="videoDetail">{{ item[propData.videoIntroduction] }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="IStudy-Card-mask" v-if="moduleObject.env === 'develop' && !propData.dataSource">
      <span>！未绑定数据源</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "IStudyCard",
  data() {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        headText: "学习精选",
        "isShowMore": true,
        "isShowHeadText": true,
        "isShowVideoNum": true,
        themeList: [
          {
            "key": "blue",
            "mainColor": {
              "hex": "#0073CA",
              "hex8": "#0073CAFF"
            }
          }
        ]
      },
      isLoading: true,
      videoData: [
        {
          index: 1,
          image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/dc0441f5511b41fc9f7606e415dea00c.png",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "安徽合肥：多彩过暑假，实践有收获",
          videoUrl: "#1"
        },
        {
          index: 2,
          image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/b4fbbb9fd80745f99c77a1f1682a3740.jpg",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "浙江宁波：植物观察 地质探索 假期研学快乐多",
          videoUrl: "#2"
        },
        {
          index: 3,
          image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/05776bf6034d40b882366297006da726.jpg",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "河南内乡：戏曲博物馆里过暑假，品味非遗文化",
          videoUrl: "#3"
        },
        {
          index: 4,
          image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
          videoUrl: "#4"
        },
        {
          index: 5,
          image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
          videoUrl: "#4"
        },
        {
          index: 6,
          image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
          amountOfPlay: 1200,
          releaseDate: "2022-8-17",
          videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
          videoUrl: "#4"
        }
      ]
    }
  },
  computed: {},
  created() {
    this.moduleObject = this.$root.moduleObject
    this.convertAttrToStyleObject();
    this.convertThemeListAttrToStyleObject();
  },
  methods: {
    getImageUrl(item) {
        if ( item[this.propData.videoImage ? this.propData.videoImage : 'imageUrl'] ) {
            return IDM.url.getWebPath(item[this.propData.videoImage ? this.propData.videoImage : 'imageUrl'])
        } else {
            return IDM.url.getModuleAssetsWebPath(require(`../assets/image-list.png`),this.moduleObject)
        }
    },
    /**
     * 适配页面
     */
    getScale(pageWidth) {
      const base = this.propData.baseValue || 414
      const ratio = this.propData.adaptationRatio || 1.2
      const width = this.moduleObject.env === "production" ? window.innerWidth : pageWidth || 414
      return (width / base - 1) * (ratio - 1) + 1
    },
    /**
     * 图片适配
     */
    getImgScale(pageWidth) {
      let width = this.moduleObject.env === "production" ? window.innerWidth : pageWidth || 414
      return width / 414
    },

    /**
     * 提供父级组件调用的刷新prop数据组件
     */
    propDataWatchHandle(propData) {
      this.propData = propData.compositeAttr || {};
      this.convertAttrToStyleObject();
      this.convertThemeListAttrToStyleObject();
    },
    /**
     * 重新加载
     */
    reload() {
      //请求数据源
      this.initData();

      let styleObject = {};
      const imgScale = this.getImgScale()
      styleObject['--i-studycard-imgScale'] = imgScale;
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .study-card',
          styleObject);
    },

    /**
     * 加载动态数据
     */
    initData() {
      let dataSource = this.propData.dataSource;
      if (!dataSource) {
        if (!this.moduleObject.env || this.moduleObject.env === "develop") {
          // mock数据
          setTimeout(() => {
            this.infoList = [];
            const res = {
              data: [
                {
                  index: 1,
                  image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/dc0441f5511b41fc9f7606e415dea00c.png",
                  amountOfPlay: 1500,
                  releaseDate: "2022-9-7",
                  videoIntroduction: "安徽合肥：多彩过暑假，实践有收获",
                  videoUrl: "#1"
                },
                {
                  index: 2,
                  image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/b4fbbb9fd80745f99c77a1f1682a3740.jpg",
                  amountOfPlay: 1500,
                  releaseDate: "2022-9-7",
                  videoIntroduction: "浙江宁波：植物观察 地质探索 假期研学快乐多",
                  videoUrl: "#2"
                },
                {
                  index: 3,
                  image: "https://boot-img.xuexi.cn/lego/image/2562_newsSlider/05776bf6034d40b882366297006da726.jpg",
                  amountOfPlay: 1500,
                  releaseDate: "2022-9-7",
                  videoIntroduction: "河南内乡：戏曲博物馆里过暑假，品味非遗文化",
                  videoUrl: "#3"
                },
                {
                  index: 4,
                  image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
                  amountOfPlay: 1500,
                  releaseDate: "2022-9-7",
                  videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
                  videoUrl: "#4"
                },
                {
                  index: 5,
                  image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
                  amountOfPlay: 1200,
                  releaseDate: "2022-8-17",
                  videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
                  videoUrl: "#4"
                },
                {
                  index: 6,
                  image: "https://boot-img.xuexi.cn/contribute_img/20220809100554/66386949742976920.jpg",
                  amountOfPlay: 1200,
                  releaseDate: "2022-8-17",
                  videoIntroduction: "河南鹤壁淇滨区:“双减”下的暑假劳动教育结硕果",
                  videoUrl: "#4"
                }
              ]
            };
            this.videoData = res.data
            this.isLoading = false;
          }, 0)
        }

        this.isLoading = false;
        return;
      }

      IDM.datasource.request(this.propData.dataSource[0]?.id,{
        moduleObject: this.moduleObject
      },(res) => {
          if ( res && res.length ) {
                this.videoData = res;
          }
        // let tempList = []
        // this.videoData = []
        // tempList = res[this.propData.dataFiled];
        // for (let i = 0; i < tempList.length; i++) {
        //   let tempItem = {}
        //   tempItem.index = i
        //   for (let name in tempList[i]) {
        //     tempItem[name] = tempList[i][name]
        //   }
        //   tempItem.image = tempList[i][this.propData.videoImage]
        //   tempItem.amountOfPlay = tempList[i][this.propData.videoAmountOfPlay]
        //   tempItem.releaseDate = tempList[i][this.propData.videoReleaseDate]
        //   tempItem.videoIntroduction = tempList[i][this.propData.videoIntroduction]
        //   this.videoData.push(tempItem)
        // }
        this.isLoading = false;
      })

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
        var dataObject = {IDM: window.IDM};
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
        } catch (error) {
        }
        _defaultVal = resValue;
      }

      return _defaultVal;
    },
    /**
     * 把属性转换成样式对象
     */
    convertAttrToStyleObject(pageSize = {}) {
      let styleObject = {};
      let styleHeaderLeft = {};
      let styleHeaderRight = {};
      let styleVideo = {};
      let videoDataText = {};
      let videoDetailText = {};

      const scale = this.getScale(pageSize.width);
      styleObject['--i-studycard-scale'] = scale;

      const imgScale = this.getImgScale(pageSize.width)
      styleObject['--i-studycard-imgScale'] = imgScale;
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key];
          if (!element && element !== false && element !== 0) {
            continue;
          }
          switch (key) {
            case "width":
            case "height":
              styleObject[key] = element;
              break;
            case "bgColor":
              if (element && element.hex8) {
                styleObject["background-color"] = IDM.hex8ToRgbaString(element.hex8);
              }
              break;
            case "bgImgUrl":
              styleObject[
                  "background-image"
                  ] = `url(${window.IDM.url.getWebPath(element)})`;
              break;
            case "bgRepeat":
              //平铺模式
              styleObject["background-repeat"] = element;
              break;
            case "bgAttachment":
              //背景模式
              styleObject["background-attachment"] = element;
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
            case "border":
              if (element.border.top.width > 0) {
                styleObject["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                styleObject["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleObject["border-top-color"] = element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleObject["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                styleObject["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleObject["border-right-color"] = element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleObject["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                styleObject["border-bottom-style"] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleObject["border-bottom-color"] = element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleObject["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                styleObject["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleObject["border-left-color"] = element.border.left.colors.hex8;
                }
              }
              styleObject["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleObject["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleObject["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleObject["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case "videoBorder":
              if (element.border.top.width > 0) {
                styleVideo["border-top-width"] = element.border.top.width + element.border.top.widthUnit;
                styleVideo["border-top-style"] = element.border.top.style;
                if (element.border.top.colors.hex8) {
                  styleVideo["border-top-color"] = element.border.top.colors.hex8;
                }
              }
              if (element.border.right.width > 0) {
                styleVideo["border-right-width"] = element.border.right.width + element.border.right.widthUnit;
                styleVideo["border-right-style"] = element.border.right.style;
                if (element.border.right.colors.hex8) {
                  styleVideo["border-right-color"] = element.border.right.colors.hex8;
                }
              }
              if (element.border.bottom.width > 0) {
                styleVideo["border-bottom-width"] = element.border.bottom.width + element.border.bottom.widthUnit;
                styleVideo["border-bottom-style"] = element.border.bottom.style;
                if (element.border.bottom.colors.hex8) {
                  styleVideo["border-bottom-color"] = element.border.bottom.colors.hex8;
                }
              }
              if (element.border.left.width > 0) {
                styleVideo["border-left-width"] = element.border.left.width + element.border.left.widthUnit;
                styleVideo["border-left-style"] = element.border.left.style;
                if (element.border.left.colors.hex8) {
                  styleVideo["border-left-color"] = element.border.left.colors.hex8;
                }
              }
              styleVideo["border-top-left-radius"] = element.radius.leftTop.radius + element.radius.leftTop.radiusUnit;
              styleVideo["border-top-right-radius"] = element.radius.rightTop.radius + element.radius.rightTop.radiusUnit;
              styleVideo["border-bottom-left-radius"] = element.radius.leftBottom.radius + element.radius.leftBottom.radiusUnit;
              styleVideo["border-bottom-right-radius"] = element.radius.rightBottom.radius + element.radius.rightBottom.radiusUnit;
              break;
            case "boxShadow":
              styleObject["box-shadow"] = element;
              break;
            case "headerLeftFont":
              styleHeaderLeft["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleHeaderLeft["color"] = element.fontColors.hex8;
              }
              styleHeaderLeft["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              styleHeaderLeft["font-style"] = element.fontStyle;
              styleHeaderLeft["font-size"] = element.fontSize + element.fontSizeUnit;
              styleHeaderLeft["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              styleHeaderLeft["text-align"] = element.fontTextAlign;
              styleHeaderLeft["text-decoration"] = element.fontDecoration;
              break;
            case "headerRightFont":
              styleHeaderRight["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                styleHeaderRight["color"] = element.fontColors.hex8;
              }
              styleHeaderRight["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              styleHeaderRight["font-style"] = element.fontStyle;
              styleHeaderRight["font-size"] = element.fontSize + element.fontSizeUnit;
              styleHeaderRight["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              styleHeaderRight["text-align"] = element.fontTextAlign;
              styleHeaderRight["text-decoration"] = element.fontDecoration;
              break;
            case "videoBottomFont":
              videoDetailText["font-family"] = element.fontFamily;
              if (element.fontColors.hex8) {
                videoDetailText["color"] = element.fontColors.hex8;
              }
              videoDetailText["font-weight"] = element.fontWeight && element.fontWeight.split(" ")[0];
              videoDetailText["font-style"] = element.fontStyle;
              videoDetailText["font-size"] = element.fontSize + element.fontSizeUnit;
              videoDetailText["line-height"] = element.fontLineHeight + (element.fontLineHeightUnit == "-" ? "" : element.fontLineHeightUnit);
              videoDetailText["text-align"] = element.fontTextAlign;
              videoDetailText["text-decoration"] = element.fontDecoration;

              break;
          }
        }
      }
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .study-card',
          styleObject);
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .left-text',
          styleHeaderLeft);
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .right-text',
          styleHeaderRight);
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .video-card',
          styleVideo);
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .video-data-text',
          videoDataText);
      window.IDM.setStyleToPageHead(
          this.moduleObject.id + ' .videoDetail',
          videoDetailText);
      this.initData()
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
        IDM.setStyleToPageHead(
            "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .left",
            {
              "color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
            }
        );
        IDM.setStyleToPageHead(
            "." +
            themeNamePrefix +
            item.key +
            " #" +
            (this.moduleObject.packageid || "module_demo") +
            " .right",
            {
              "color": item.mainColor ? IDM.hex8ToRgbaString(item.mainColor.hex8) : "",
            }
        );
      }
    },

    //点击更多的回调函数
    showMoreData() {
      if (this.propData.showMoreUrl && this.propData.showMoreUrl.length > 0) {
        IDM.router.push(
            this.moduleObject.pageid,
            this.propData.showMoreUrl[0].id,
            {
              keep: true,
              enterAnim: "",
              quitAnim: ""
            }
        );
      } else {
        IDM.message.warning("请选择要跳转的子页面");
      }
    },

    //点击视频卡片后跳转函数
    toVideo(item) {
      console.log(this.propData.listJumpUrl)

      if (this.propData.listJumpUrl && this.propData.listJumpUrl.length > 0) {
        IDM.router.push(
            this.moduleObject.pageid,
            this.propData.listJumpUrl[0].id,
            {
              keep: true,
              params:  this.jumpCustomFunc(item) || item,
              enterAnim: '',
              quitAnim: ''
            }
        );
      } else {
        IDM.message.warning("请选择要跳转的子页面");
      }
    },
    jumpCustomFunc(item){
      const func = this.propData.jumpCustomFunc?.[0]
      return func && window[func.name] && window[func.name].call(this,{item,_this:this})
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
      switch (messageObject.type) {
        case 'websocket':
          if (this.propData.messageRefreshKey && messageObject.message) {
            const messageData = typeof messageObject.message === 'string' && JSON.parse(messageObject.message) || messageObject.message
            const arr = Array.isArray(this.propData.messageRefreshKey) ? this.propData.messageRefreshKey : [this.propData.messageRefreshKey]
            if (messageData.badgeType && arr.includes(messageData.badgeType)) {
              this.isLoading = true;
              this.initData();
            }
          }
          break;
        case 'linkageReload':
          this.isLoading = true;
          this.initData()
          break;
        case 'pageResize':
          this.convertAttrToStyleObject(messageObject.message);
          break;
      }
    },
  }
}
</script>

<style scoped lang="scss">
$scale: var(--i-studycard-scale);
$imgScale: var(--i-studycard-imgScale);

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .study-card {
    border: calc(1px * #{ $scale }) solid rgba(243, 243, 243, 1);
    height: auto;
    width: 100%;
    background-color: #ffffff;
    border-radius: calc(6px * #{ $scale });
    margin: calc(16px * #{ $scale }) calc(10px * #{ $scale });
    padding: 0 calc(12px * #{ $scale });

    &-header {
      margin: calc(18px * #{ $scale }) 0 calc(8px * #{ $scale }) 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: center;

      .left {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        color: rgb(205, 6, 3);
        margin-left: calc(-4px * #{ $scale });

        .left-text {
          font-family: arial, helvetica, 'microsoft yahei', serif;
          color: #333333FF;
          font-size: calc(18px * #{ $scale });
          line-height: calc(18px * #{ $scale });
          font-weight: 800;
        }
      }
    ;


      .right {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        color: rgb(205, 6, 3);

        .right-text {
          font-family: arial, helvetica, 'microsoft yahei', serif;
          padding-right: calc(5px * #{ $scale });
          font-size: calc(14px * #{ $scale });
          line-height: calc(14px * #{ $scale });
          font-weight: 400;
        }

      }

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          width: calc(18px * #{ $scale });
          height: calc(18px * #{ $scale });
        }
      }
    }

    .video-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      align-content: space-around;
      justify-content: space-between;
      flex-direction: row;
      margin: calc(8px * #{ $scale }) 0 0 0;
      height: 100%;
      padding: 0;

      .video-card {
        position: relative;
        width: 48%;;
        height: auto;
        margin: 0 0 calc(14px * #{ $scale }) 0;
        border: calc(1px * #{ $scale }) solid rgba(237, 237, 237, 1);
        border-radius: calc(4px * #{ $scale });
        overflow: hidden;

        .videoImg {
          width: auto;
          height: calc(106px * #{ $imgScale });
          display: flex;
          flex-direction: column-reverse;
          align-items: center;

          img {
            width: 100%;
            height: calc(106px * #{ $imgScale });
            position: absolute;
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }

        .videoData {
          width: 100%;
          height: 18%;
          display: flex;
          justify-content: space-between;
          padding: calc(2px * #{ $scale }) calc(4px * #{ $scale });
          align-items: center;
          font-size: calc(12px * #{ $scale });
          line-height: calc(12px * #{ $scale });
          font-weight: 400;
          z-index: 1;

          .left-data {
            height: 100%;
            display: flex;
            align-items: center;

            svg {
              width: calc(24px * #{ $scale });
              height: calc(24px * #{ $scale });
              padding-right: calc(2px * #{ $scale });
            }
          }

          p {
            display: inline;
            color: #ffffff;
          }
        }

        p {
          margin: 0;
          padding: 0;
        }

        .videoDetail {
          width: auto;
          height: calc(40px * #{ $scale });
          margin: calc(6px * #{ $scale }) calc(8px * #{ $scale }) calc(10px * #{ $scale }) calc(8px * #{ $scale });
          font-size: calc(14px * #{ $scale });
          line-height: calc(20px * #{ $scale });
          color: rgb(50, 50, 50);
          font-weight: 500;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}

.IStudy-Card-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    padding: 6px 20px;
    color: #e6a23c;
    background: #fdf6ec;
    border: 1px solid #f5dab1;
    border-radius: 4px;
  }
}
</style>