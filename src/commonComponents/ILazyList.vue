<template>
  <div ref="lazyList" class="lazyList">
    <slot></slot>
    <div class="lazy_list__finished-text" v-show="finished" @click="!finished && (modelValue = true) && $emit('load')">{{
        finishedText
      }}
    </div>
    <div class="lazy_list__loading" v-show="modelValue">
      <van-loading size="14px" >加载中...</van-loading>
    </div>
  </div>
</template>

<script>
import {Loading} from 'vant';

export default {
  name: "ILazyList",
  comments: {Loading},
  model: {
    prop: 'modelValue',
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    finished: {
      type: Boolean,
      default: false
    },
    finishedText: {
      type: String,
      default: "没有更多了"
    },
  },
  emits: ['load'],
  computed: {
    loading: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch:{
    finishedText(newV,oldV){
      if (!this.finished){
        this.$emit('load')
      }
    },
    loading(newV,oldV){
      if (newV){
        this.$emit('load')
      }

      this.handleScroll()
    }
  },
  data() {
    return {
      list: {},
      preTime: {},
      latestListHeight:null,
      timer:null
    }
  },
  mounted() {
    this.preTime = new Date().getTime() //获取时间毫秒数
    this.list = this.$refs.lazyList


    this.timer = setInterval(()=>{
      this.handleScroll()
    }, 500);

    this.loading = true
    this.$emit('load')
    window.addEventListener('scroll', this.debounce(this.handleScroll))
  },
  methods: {

    handleScroll() {
      if (!this.finished){
        // 获取视窗高度
        let domHeight = window.screen.height || window.innerHeight || document.documentElement.clientHeight
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

        let listHeight = this.list.offsetHeight
        let listTop = this.list.getBoundingClientRect().top
        if (domHeight+100 >= listHeight + listTop && this.latestListHeight !== listHeight) {
          this.latestListHeight = listHeight
          this.$emit('load')
        }
      }
    },
    debounce(func, wait = 50) {
      let timer = 0
      return function (...params) {
        timer && clearTimeout(timer)
        timer = setTimeout(() => func.apply(this, params), wait)
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = "";
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style scoped>

.lazy_list__finished-text {
  color: #969799;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
}

.lazy_list__loading{
  display: flex;
  justify-content: center;
  padding: 10px 0;
}
</style>