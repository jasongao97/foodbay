<template>
  <div class="home">
    <!--left-->
    <div class="top">
      <el-menu :default-active="router" :router="true" :unique-opened="true" theme="dark" mode="horizontal">
        <el-menu-item index="/canteen">食堂管理</el-menu-item>
        <el-menu-item index="/user">用户信息</el-menu-item>
        <el-menu-item index="/food">美食管理</el-menu-item>
        <el-menu-item index="/quit">退出</el-menu-item>
      </el-menu>
    </div>
    <!--left end-->
    <!--right-->
    <div>
      <!--content-->
      <div class="content">
        <router-view></router-view>
      </div>
      <!--content end-->
    </div>
    <!--right end-->
    <!--userinfo-->
    <!--userinfo end-->
  </div>
</template>
<script type="text/javascript">
export default {
  beforeRouteEnter(to, from, next) {
      next(function(vm) {
        if (to.path == '/') {
          vm.router = '/canteen';
        } else {
          vm.router = to.path;
        }
      });
    },
    data() {
      return {
        router: '/canteen',
      }
    },
}
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 100%;
}
</style>
