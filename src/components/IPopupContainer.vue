<template>
  <!--
    根目录规范(必须不能为空)：
    idm-ctrl：控件类型 drag_container：容器，drag_container_inlieblock：行内容器，idm_module：非容器的组件
    id：使用moduleObject.id，如果id不使用这个将会被idm-ctrl-id属性替换
    idm-ctrl-id：组件的id，这个必须不能为空
  -->
  <div idm-ctrl="idm_module"
  :id="moduleObject.id"
  :idm-ctrl-id="moduleObject.id"
  >
    <div class="popup-wrap" v-show="show">
      <van-popup v-model="showCopy"
      :position="propData.showPosition"
      :style="{ width: propData.boxwidth, height: propData.boxheight }"
      :get-container="propData.isContainer&&'body'">
        <template v-if="propData.loadType == 'loadcatalog'">
          <div class="popup-tab" v-for="(item, index) in list" :key="index" >
            <div class="tag-title">{{item[propData.tabTitleField]}}</div>
            <div class="tab-ul">
              <div class="tag-li" :class="chooseVal==subitem.id && 'active'"
                v-for="(subitem, subindex) in item[propData.tagContentFiled]"
                :key="subindex"
                @click="handleClick(subitem)">
                {{subitem[propData.tabTitleField]}}
              </div>
            </div>
          </div>
        </template>
        <template v-if="propData.loadType == 'loadcontainer'">
          <div class="tab-conent drag_container"
            idm-ctrl-inner
            :idm-ctrl-id="moduleObject.id"
            :idm-container-index="1"
          ></div>
        </template>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { getTagInfoData } from '../mock/mockData'
export default {
  name: 'IPopupContainer',
  data () {
    return {
      moduleObject: {},
      propData: this.$root.propData.compositeAttr || {
        showPosition: 'right',
        boxwidth: '80%',
        boxheight: '100%',
        tabTitleField: 'title',
        tagContentFiled: 'list',
        titleBottom: '10px',
        catalogBottom: '20px',
        isShow: true,
        loadType: 'adaptive'
      },
      list: [],
      show: false,
      showCopy: true,
      chooseVal: ''
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
  },
  mounted() {
    this.show = this.propData.isShow;
    this.init();
  },
  methods: {
    propDataWatchHandle (propData) {
      this.propData = propData.compositeAttr || {};
      this.init();
    },
    handleStyle () {
      let styleObject = {},
        catalogObject = {},
        tagObject = {},
        activeObject = {},
        tipsStyleObj = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key]
          if (!element && element !== false && element != 0) {
            continue
          }
          switch (key) {
            case 'ulbox':
              IDM.style.setBoxStyle(styleObject, element);
              break
            case 'tagTitle':
              IDM.style.setFontStyle(tipsStyleObj, element);
              break
            case 'titleBottom':
              tipsStyleObj['padding-bottom'] = element;
              break
            case 'catalogBottom':
              catalogObject['padding-top'] = element
              break
            case 'tagBox':
              IDM.style.setBoxStyle(tagObject, element);
              break
            case 'tagBorder':
              IDM.style.setBorderStyle(tagObject, element)
              break
            case 'tagFont':
              IDM.style.setFontStyle(tagObject, element);
              break
            case 'chooseTagBorder':
              IDM.style.setBorderStyle(activeObject, element)
              break
            case 'chooseTagFont':
              IDM.style.setFontStyle(activeObject, element);
              break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .van-popup", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .tag-title", tipsStyleObj);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .popup-tab+.popup-tab", catalogObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .tag-li", tagObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .tag-li.active", activeObject);
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
      console.log(object, '测试消息');
      switch (object.type) {
        case this.propData.sendKey:
          console.log('IPopupContainer接收消息格式', object.message);
          this.show = object.message;
          this.showCopy = object.message;
          if (this.propData.loadType == 'loadcatalog') {
            this.chooseVal = object.message;
          }
          break;
      }
    },
    handleClick (val) {
      this.chooseVal = val;
      // 自定义函数
      const func = this.propData.customFuncClickTab?.[0]
      window[func.name] && window[func.name].call(this,{
        tab:val,
        _this:this
      });
      // 发送消息给组件
      this.sendBroadcastMessage({
        type: this.propData.receiveKey,
        rangeModule: this.propData.triggerComponents && this.propData.triggerComponents.map(el => el.moduleId),
        message: val
      })
      this.show = false;
      this.showCopy = false;
    },
    /**
     * 组件通信：发送消息的方法
     * @param {
     *  type:"自己定义的，统一规定的type：linkageResult（组件联动传结果值）、linkageDemand（组件联动传需求值）、linkageReload（联动组件重新加载）
     * 、linkageOpenDialog（打开弹窗）、linkageCloseDialog（关闭弹窗）、linkageShowModule（显示组件）、linkageHideModule（隐藏组件）、linkageResetDefaultValue（重置默认值）",
     *  message:{实际的消息对象},
     *  rangeModule:"为空发送给全部，根据配置的属性中设定的值（值的内容是组件的packageid数组），不取子表的，比如直接 this.$root.propData.compositeAttr["attrKey"]（注意attrKey是属性中定义的bindKey）,这里的格式为：['1','2']"",
     *  className:"指定的组件类型，比如只给待办组件发送，然后再去过滤上面的值"
     *  globalSend:如果为true则全站发送消息，注意全站rangeModule是无效的，只有className才有效，默认为false
     * } object 
     */
    sendBroadcastMessage(object) {
        window.IDM.broadcast && window.IDM.broadcast.send(object);
    },
    // 过滤接口参数
    fileterParams() {
      let obj = {};
      if (this.propData.customFunc && this.propData.customFunc.length > 0) {
        let name = this.propData.customFunc[0].name
        obj = window[name] && window[name].call(this);
      }
      return obj
    },
    initData () {
      if (this.moduleObject.env == "production") {
        if (this.propData.dataSource) {
          const routerParams = this.fileterParams();
          IDM.datasource.request(this.propData.dataSource[0]?.id, {
            moduleObject: this.moduleObject,
            param: { ...routerParams }
          }, (data) => {
            if (data) {
              this.list = data;
            }
          })
        }
      } else {
        this.list = getTagInfoData();
      }
    },
    init () {
      console.log(this.propData, this.moduleObject, '数据');
      this.handleStyle();
      if (this.propData.loadType == 'loadcatalog') {
        this.initData();
      }
      this.show = this.propData.isShow;
      this.showCopy = true;
    },
  }
}
</script>

<style lang="scss" scoped>
.popup-wrap{
  .tab-conent{
    min-height: 200px;
  }
  .tab-ul{
    display: flex;
    // .tag-li{
    //   padding: 5px 10px;
    //   margin: 0 10px 0 0;
    //   border: 1px solid #D6D6D6;
    //   border-radius: 50px;
    // }
    // .active{
    //   border: 1px solid #f00;
    //   color: #f00;
    // }
  }
}
</style>
