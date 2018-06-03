import Vue from 'vue'

const app = new Vue({
  // 会编译template的内容，然后render
  // el: '#root',
  template: '<div ref="div">{{text}} {{obj.a}}</div>',
  data: {
    text: 0,
    obj: {}
  }
})

console.log(app)
app.$mount('#root')
