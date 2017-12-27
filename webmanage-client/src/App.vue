<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  created() {
    this.checkLogin();
  },
  watch: {
    "$route" : 'checkLogin'
  },
  methods: {
    checkLogin(){
      //检查是否存在session
      //cookie操作方法在源码里有或者参考网上的即可
      if(document.cookie){
        //如果没有登录状态则跳转到登录页
        this.$router.push('/login');
      }
    }
  }
}
</script>
<style lang="less">
/*全局样式*/

body,
p,
h1,
h2 {
  padding: 0;
  margin: 0;
}

h1,
h2 {
  font-size: 14px;
  font-weight: normal;
}

body,
html {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top {
  background: #EFF2F7;
}

.table {
  width: 100%;
  .page {
    padding: 10px;
    text-align: center;
  }
}
</style>
<style lang="less" scoped>
/*组件样式*/

#app {
  height: 100%;
  width: 100%;
}
</style>
