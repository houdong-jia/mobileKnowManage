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
    <div class="popup-wrap">
      <van-popup v-model="show"
      :position="propData.showPosition"
      :style="{ width: propData.boxwidth, height: propData.boxheight }">
        <div class="popup-tab" v-for="(item, index) in list" :key="index">
          <div class="tag-title">{{item[propData.tabTitleField]}}</div>
          <div class="tab-ul">
            <div class="tag-li" v-for="(subitem, subindex) in item[propData.tagContentFiled].split(',')" :key="subindex">
              {{subitem}}
            </div>
          </div>
        </div>
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

      },
      list: [],
      show: true
    }
  },
  created() {
    this.moduleObject = this.$root.moduleObject
    this.init();
  },
  methods: {
    handleStyle () {
      let styleObject = {},
        tipsStyleObj = {};
      for (const key in this.propData) {
        if (this.propData.hasOwnProperty.call(this.propData, key)) {
          const element = this.propData[key]
          if (!element && element !== false && element != 0) {
            continue
          }
          switch (key) {
            case 'ulbox':
              IDM.style.setBoxStyle(styleObject, element)
              break
            case 'tagTitle':
              IDM.style.setFontStyle(tipsStyleObj, element);
              break
          }
        }
      }
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .van-popup", styleObject);
      window.IDM.setStyleToPageHead(this.moduleObject.id + " .popup-wrap .tag-title", tipsStyleObj);
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
      console.log(this.propData, '数据');
      this.handleStyle();
      this.initData();
    },
  }
}
</script>

<style lang="scss" scoped>
.popup-wrap{
  .tab-ul{
    display: flex;
  }
}
</style>
