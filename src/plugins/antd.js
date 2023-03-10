// 按需加载 ant-design-vue
// 手动删除没用用过的组件
import Vue from 'vue';
import 'ant-design-vue/lib/select/style/css';
import 'ant-design-vue/lib/spin/style/css';
import {
  Select,
  Spin
} from 'ant-design-vue';

/* v1.1.3+ registration methods */
Vue.component(Select.name, Select)
Vue.component(Spin.name, Spin)