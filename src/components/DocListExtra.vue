<template>
  <div class="item-extra" v-if="extraList && extraList.length">
    <template v-for="extra,eindex in extraList">
      <div
        v-if="extra.key"
        v-show="extra.compareField ? extra.compareValue ? item[extra.compareField] == extra.compareValue : item[extra.compareField] : true"
        :key="eindex"
        :class="`item item-${extra.key}`"
        :style="{width: extra.extraWidth + '%', justifyContent: extra.position, cursor: extra.clickType != 'none' ? 'pointer' : ''}"
        @click.stop="onExtraClick(extra,item,index)"
      >
        <div class="img" v-if="extra.leftAreaType == 'img' && (extra.imageField || extra.image)">
          <img
            width="100%"
            height="100%"
            :src="
              IDM.url.getWebPath(extra.imageField ? getExpressData('data', extra.imageField, item) : extra.image)
            "
          />
        </div>
        <div class="icon" v-if="extra.leftAreaType == 'icon' && extra.icon && extra.icon.length">
          <svg
            class="idm_filed_svg_icon"
            aria-hidden="true"
          >
            <use :xlink:href="`#${extra.icon && extra.icon[0]}`" />
          </svg>
        </div>
        <div class="text">
          {{extra.textFiled.includes("@[") ? IDM.express.replace(extra.textFiled, item, true) : extra.textFiled}}
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props: ['extraList', 'item', 'getExpressData', 'onExtraClick']
}
</script>
<style lang="scss">
.item-extra {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  .item {
    display: inline-block;
    // margin-right: 15px;
    width: 50%;
    display: flex;
    .icon {
      flex-shrink: 0;
      display: inline-block;
      font-size: 14px;
      color: #999999;
      margin-right: 5px;
      .idm_filed_svg_icon {
        font-size: 1em;
        width: 1em;
        height: 1em;
        fill: currentColor;
        vertical-align: -0.15em;
        outline: none;
      }
    }
    .img {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      display: inline-block;
      margin-right: 5px;
    }
    .text {
      display: inline-block;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
      overflow: hidden;//溢出隐藏
      white-space: nowrap;//禁止换行
      text-overflow: ellipsis;//...
    }
  }
}
</style>
