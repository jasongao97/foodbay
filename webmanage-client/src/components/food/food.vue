<template>
  <div class="food">
    <div class="add-button">
      <el-row>
        <el-col :span="3">
          <el-button type="primary" icon="edit" @click="handleNew">添加新的条目</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table">
      <el-table :data="food" border="border" height="600">
        <el-table-column type="index" width="60"></el-table-column>

        <el-table-column label="菜名" width="100" prop="name">
        </el-table-column>
        <el-table-column label="图片" width="130">
          <template scope="scope">
            <img :src="'http://pic.ustb.wang/image/' + scope.row.pic" class="pic"/>
          </template>
        </el-table-column>
        <el-table-column label="位置" width="120" prop="place">
        </el-table-column>
        <el-table-column label="区域" width="120" prop="area">
        </el-table-column>
        <el-table-column label="价格" width="100" prop="price">
        </el-table-column>

        <el-table-column label="信息评分">
            <el-table-column label="欢迎度" prop="rate.popular">
            </el-table-column>
            <el-table-column label="辣度" prop="rate.chilli">
            </el-table-column>
            <el-table-column label="等待时间" prop="rate.time">
            </el-table-column>
            <el-table-column label="座位情况" prop="rate.seat">
            </el-table-column>
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template scope="scope">
            <p>
              <el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)" icon="edit">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDel(scope.$index)" icon="delete">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--table end-->
    <!--dailog start-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px">

        <el-row>
          <el-col :span="20">
            <el-form-item label="菜品名称">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="图片">
              <el-input v-model="editForm.pic"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="位置">
              <el-input v-model="editForm.place"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="区域">
              <el-input v-model="editForm.area"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="价格">
              <el-input v-model="editForm.price"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="欢迎度">
              <el-input v-model="editForm.popular"></el-input>
            </el-form-item>
          </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="辣度">
              <el-input v-model="editForm.chilli"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="等待时间">
              <el-input v-model="editForm.time"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="座位情况">
              <el-input v-model="editForm.seat"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit()">提交</el-button>
      </div>

    </el-dialog>
    <!--dailog end-->
  </div>
</template>
<script type="text/javascript">
export default {
  computed: {
  },
  created: function() {
    this.$http.get('/getAllFood').then(response => {
      var resFood = response.data.food;
      this.$data.food = [];
      for (var i = 0; i < resFood.length; i++) {
        this.$data.food.push({
          _id: resFood[i]._id,
          name: resFood[i].name,
          pic: resFood[i].pic,
          place: resFood[i].place,
          area: resFood[i].area,
          price: resFood[i].price,
          rate: resFood[i].rate
        });
      }
    }, response => {
      console.log("err");
    })
  },
  data() {
    return {
      editFormVisible: false,
      editForm: {
        id: '',
        _id: '',
        name: '',
        pic: '',
        place: '',
        price: '',
        popular: {},
        chilli: {},
        time: {},
        seat: {}
      },
      food: []
    }
  },
  methods: {
    handleDel: function (index) {
      this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var Objdata = {_id: this.$data.food[index]._id}
        this.$http.post('/deleteFood', Objdata).then(response => {
          console.log("success");
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.listLoading = true;
          this.$data.food.splice(index,1);
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
      var editForm = this.$data.editForm;
      editForm.id = index;
      editForm._id = row._id;
      editForm.name = row.name;
      editForm.pic = row.pic;
      editForm.place = row.place;
      editForm.area = row.area;
      editForm.price = row.price;
      editForm.popular = row.rate.popular;
      editForm.chilli = row.rate.chilli;
      editForm.time = row.rate.time;
      editForm.seat = row.rate.seat;
      this.editFormVisible = true;
    },
    handleNew: function () {
      this.$data.editForm._id = '';
      this.$data.editForm.name = '';
      this.$data.editForm.pic = '';
      this.$data.editForm.id = this.$data.food.length;
      this.$data.editForm.place = '';
      this.$data.editForm.area = '';
      this.$data.editForm.price = '';
      this.$data.editForm.popular = '';
      this.$data.editForm.chilli = '';
      this.$data.editForm.time = '';
      this.$data.editForm.seat = '';
      this.editFormVisible = true;
    },
    editSubmit: function() {
      var row = this.$data.editForm;
      var index = row.id;
      this.$data.food.splice(index, 1, {
        _id: row._id,
        name: row.name,
        pic: row.pic,
        place: row.place,
        area: row.area,
        price: row.price,
        rate: {
          popular: row.popular,
          chilli: row.chilli,
          time: row.time,
          seat: row.seat
        }
      })
      this.editFormVisible = false;
      var Objdata = this.$data.food[index];
      this.$http.post('/upsertFood', Objdata).then(response => {
        console.log("success");
        this.$message({
          message: '修改菜品成功',
          type: 'success'
        });
      }, response => {
        console.log("err");
        this.$message({
          message: '修改失败 请刷新重试',
          type: 'error'
        });
      })
    },
  }
}
</script>
<style lang="less" scoped>
.add-button {
  margin: 20px 0 20px 20px;
}
.pic {
  width: 100px;
}
</style>
