<template>
  <div class="user">
    <div class="table">
      <el-table :data="user" height="600">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column label="Id" min-width="100">
          <template scope="scope">
            <p>{{scope.row.userId}}</p>
          </template>
        </el-table-column>

        <el-table-column label="头像">
          <template scope="scope">
            <img :src="scope.row.info.avatarUrl" class="avatar"/>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="info.nickName">
        </el-table-column>
        <el-table-column label="性别" prop="info.gender">
        </el-table-column>
        <el-table-column label="语言" prop="info.language">
        </el-table-column>
        <el-table-column label="地区" min-width="140">
          <template scope="scope">
            <p>{{scope.row.info.country + ' ' + scope.row.info.province + ' ' + scope.row.info.city}}</p>
          </template>
        </el-table-column>
        <el-table-column label="收藏食堂">
          <template scope="scope">
            <div class="block">
              <div v-for="item in scope.row.checked">
                {{item}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收藏食堂">
          <template scope="scope">
            <div class="block">
              <div v-for="item in scope.row.dishes">
                {{item}}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300">
          <template scope="scope">
            <p>
              <el-button type="danger" @click="handleDel(scope.$index)" icon="delete">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--table end-->
  </div>
</template>
<script type="text/javascript">
export default {
  computed: {
    tableHeight() {
      return document.body.offsetHeight;
    }
  },
  created: function() {
    this.$http.get('/getAllUser').then(response => {
      var resUser = response.data.user;
      this.$data.user = [];
      for (var i = 0; i < resUser.length; i++) {
        this.$data.user.push({
          userId: resUser[i].userId,
          info: resUser[i].info
        })
        this.$data.user[i].checked = [];
        for (var j = 0; j < resUser[i].checked.length; j++) {
          this.$data.user[i].checked.push(resUser[i].checked[j]);
        }
        this.$data.user[i].dishes = [];
        for (var j = 0; j < resUser[i].dishes.length; j++) {
          this.$data.user[i].dishes.push(resUser[i].dishes[j]);
        }
      }
    }, response => {
      console.log("err");
    })
  },
  data() {
    return {
      user: []
    }
  },
  methods: {
    handleDel: function (index) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var Objdata = {userId: this.$data.user[index].userId}
        this.$http.post('/deleteUser', Objdata).then(response => {
          console.log("success");
          this.$message({
            message: '删除用户成功',
            type: 'success'
          });
          this.listLoading = true;
          this.$data.user.splice(index,1);
        }, response => {
          console.log("err");
          this.$message({
            message: '修改失败 请刷新重试',
            type: 'error'
          });
        });
      }).catch(() => {});
    },
  }
}
</script>
<style lang="less" scoped>
.avatar {
  width: 80px;
}
</style>
