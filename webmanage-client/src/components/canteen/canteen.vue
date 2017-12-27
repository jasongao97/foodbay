<template>
  <div class="canteen">
    <div class="add-button">
      <el-row>
        <el-col :span="3">
          <el-button type="primary" icon="edit" @click="handleNew">添加新的条目</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table">
      <el-table :data="place" border="border" height="600">
        <el-table-column type="index" width="60" align="center"></el-table-column>

        <el-table-column label="食堂名称" width="200" prop="title" align="center">
        </el-table-column>

        <el-table-column label="拥挤程度" align="center">
          <template scope="scope">
            <div class="block">
              <div v-for="info in scope.row.information">
                {{info.area + ' ' + info.name + ': ' + info.state}}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
          <template scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" icon="edit">编辑</el-button>
            <el-button @click="handleDel(scope.$index)" type="danger" icon="delete">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!--table end-->
    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="食堂名称">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-table :data="editForm.information">
          <el-table-column label="区域">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.area"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="区域名称">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="人数指数">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.state"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="删除">
            <template scope="scope">
              <el-button @click="delArea(scope.$index)" type="danger" size="small" icon="delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="newLine()">新建一行</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit()">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script type="text/javascript">

export default {
  computed: {
  },
  created: function() {
    this.$http.get('/getAllPlace').then(response => {
      var resPlace = response.data.place;
      this.$data.place = [];
      for (var i = 0; i < resPlace.length; i++) {
        this.$data.place.push({
          _id: resPlace[i]._id,
          title: resPlace[i].title
        })
        this.$data.place[i].information = [];
        for (var j = 0; j < resPlace[i].information.length; j++) {
          this.$data.place[i].information.push({
            area: resPlace[i].information[j].area,
            name: resPlace[i].information[j].name,
            state: resPlace[i].information[j].state
          })
        }
      }
    }, response => {
      console.log("err");
    })
  },
  data() {
    return {
      border: true,
      editFormVisible: false,
      editForm: {
        id: 0,
        _id: '',
        title: '',
        information: [
          {
            "area": "四层",
            "name": "教工食堂",
            "state": "2"
          },{
            "area": "三层",
            "name": "清真食堂",
            "state": "9"
          },{
            "area": "二层",
            "name": "学生食堂",
            "state": "5"
          },{
            "area": "一层",
            "name": "学生食堂",
            "state": "8"
          }],
      },
      place: []
    }
  },
  methods: {
      handleDel: function (index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var Objdata = {_id: this.$data.place[index]._id}
          this.$http.post('/deleteCanteen', Objdata).then(response => {
            console.log("success");
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.listLoading = true;
            this.$data.place.splice(index,1);
          }, response => {
            console.log("err");
            this.$message({
              message: '修改失败 请刷新重试',
              type: 'error'
            });
          });
        }).catch(() => {});
      },
      handleEdit: function (index, row) {
        this.$data.editForm.title = row.title;
        this.$data.editForm._id = row._id;
        this.$data.editForm.id = index;
        this.$data.editForm.information = [];
        for(var i = 0; i < row.information.length; i++) {
          this.$data.editForm.information.push({
            area: row.information[i].area,
            name: row.information[i].name,
            state: row.information[i].state
          })
        }
        this.editFormVisible = true;
      },
      newLine: function () {
        this.$data.editForm.information.push({
          "area": '',
          "name": '',
          "state": ''
        });
      },
      delArea: function(index) {
        this.$data.editForm.information.splice(index,1);
      },
      handleNew: function () {
        this.$data.editForm.title = '';
        this.$data.editForm._id = ''
        this.$data.editForm.id = this.$data.place.length;
        this.$data.editForm.information = [];
        this.editFormVisible = true;
      },
      editSubmit: function() {
        var row = this.$data.editForm;
        var index = row.id;
        var infoArr = [];
        for(var i = 0; i < row.information.length; i++) {
          infoArr.push({
            area: row.information[i].area,
            name: row.information[i].name,
            state: row.information[i].state
          })
        }
        this.$data.place.splice(index, 1, {
          _id: row._id,
          title: row.title,
          information: infoArr
        })
        this.editFormVisible = false;
        var Objdata = this.$data.place[index];
        this.$http.post('/upsertCanteen', Objdata).then(response => {
          console.log("success");
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }, response => {
          console.log("err");
          this.$message({
            message: '修改失败 请刷新重试',
            type: 'error'
          });
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.block {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.add-button {
  margin: 20px 0 20px 20px;
}
</style>
