// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import $ from 'jquery'
//  
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);
//
// import draggable from 'vuedraggable'
// Vue.use(draggable);

import dhtmlxGantt from 'dhtmlx-gantt';  
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_undo.js'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import 'dhtmlx-gantt/codebase/locale/locale_cn.js'
Vue.use(dhtmlxGantt);

// import vueDragAndDropList from 'vue-drag-and-drop-list'; 
// Vue.use(vueDragAndDropList);

import VueDND from 'awe-dnd'
Vue.use(VueDND)
 
 //挂载全局axsio方法
import axios from './http/index'
Vue.prototype.$axios = axios  

// import commonApi from './http/commonApi'
// Vue.prototype.$axios = axios
// Vue.prototype.$api =  commonApi 


require('./assets/css/common.css')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
