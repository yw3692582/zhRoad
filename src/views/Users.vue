<template>
  <div>
    <div>
      <el-button class="header-tip" style="margin-bottom: 10px;" @click="$router.push('/registered')" type="primary">新建用户</el-button>
    </div>
    <div class="table-wrapper">
      <el-table border :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%;font-size: 16px;"
        :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column label="用户名称" prop="user_name" align="center" min-width="185px">
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center" :formatter="formatter" min-width="185px">
        </el-table-column>
        <el-table-column align="center" min-width="185px">
          <template slot="header" slot-scope="scope">
            <el-input v-model="searchTableInfo" size="mini" prefix-icon="el-icon-search" placeholder="请输入内容搜索"></el-input>
          </template>
          <template slot-scope="scope">
            <el-link @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-link>
            <el-link @click="handleDelete(scope.$index, scope.row)" type="danger">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, prev, pager, next, jumper" :total="tableData.length" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <div class="edit_dia">
      <!-- 弹窗 -->
      <el-dialog :close-on-click-modal="false" title="编辑信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <el-input v-model.trim="username" autocomplete="off" style="width: 217px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-switch style="display: block" v-model="reset" active-color="#13ce66" inactive-color="#ff4949"
              active-text="重置密码" inactive-text="不重置密码">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" :disabled="btn1 && btn3?btn:btn == false" @click="edit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import page_size from '../../static/js/page.js'
  export default {
    inject: ["reload"],
    data() {
      return {
        dialogFormVisible: false,
        getSearchInfo: [],
        searchTableInfo: '',
        search: '',
        pagesize: page_size(),
        currpage: 1,
        form: {
          id: '',
        },
        reset: false,
        old_name: '',
        username: '',
        formLabelWidth: '120px',
        options: [],
        btn: true,
        btn1: true,
        btn3: true
      }
    },
    computed: {
      tableData() {
        let searchTableInfo = this.searchTableInfo
        if (searchTableInfo) {
          return this.getSearchInfo.filter(data => {
            return Object.keys(data).some(key => {
              return String(data[key]).toLowerCase().indexOf(searchTableInfo) > -1
            })
          })
        }
        return this.getSearchInfo
      },
    },
    watch: {
      // 监听用户名称是否改变
      username(newname, oldename) {
        if (newname == this.old_name) {
          this.btn1 = true
        } else {
          this.btn1 = false
        }
      },

      // 监听是否重置密码
      reset(newreset, oldreset) {
        if (newreset == false) {
          this.btn3 = true
        } else {
          this.btn3 = false
        }
      },
    },
    methods: {
      getRowClass: function({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        return "background:#f1f3fa;color:rgba(0,0,0,85);";
      },
      // 编辑
      handleEdit(index, row) {
        this.dialogFormVisible = true
        this.username = row.user_name
        this.old_name = row.user_name.concat()
        this.reset = false
        this.btn = true
        this.id = row.id
      },
      edit() {
        if (this.username == this.old_name) {
          this.username = ''
        }
        if (this.reset == false) {
          this.reset = ''
        } else {
          this.reset = '123456'
        }
        let headers = this.$ajax.defaults.headers.common
        headers['token'] = localStorage.getItem('token')
        headers['username'] = localStorage.getItem('user_name')
        this.$ajax.post('/modify_user', {
            id: this.id,
            user_name: encodeURI(this.username),
            service_code: '',
            password: this.reset,
          })
          .then(res => {
            switch (res.data.code) {
              case 0:
                this.reload()
                this.$message({
                  type: "error",
                  message: "修改失败"
                })
                break
              case 1:
                this.reload()
                this.$message({
                  type: "success",
                  message: "编辑信息成功"
                })
                break
              case 2:
                this.$message({
                  type: "warning",
                  message: "用户名已存在"
                })
                break
              case -1:
                alert('登录已失效,请重新登录!')
                localStorage.clear()
                this.$router.push('/')
                break
            }
          })
          .catch(e => {
            this.$message({
              type: "error",
              message: "修改信息失败"
            })
            this.reload()
          })
        // 管理switch
        if (this.reset == false) {
          this.reset = false
        } else {
          this.reset = true
        }
      },
      handleDelete(index, row) {
        this.id = row.id
        this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            let headers = this.$ajax.defaults.headers.common
            headers['token'] = localStorage.getItem('token')
            headers['username'] = localStorage.getItem('user_name')
            this.$ajax.post('/delete_user', {
                id: this.id,
                service_code: ''
              })
              .then(res => {
                switch (res.data.code) {
                  case 0:
                    this.$message({
                      type: 'error',
                      message: '删除失败!'
                    })
                    break
                  case -1:
                    alert('登录已失效,请重新登录!')
                    localStorage.clear()
                    this.$router.push('/')
                    break
                  default:
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    })
                }
                this.reload()
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      handleCurrentChange(cpage) {
        this.currpage = cpage;
      },
      formatter(row, column) {
        let date = row[column.property];
        if (date == undefined) {
          return "";
        }
        return moment(date * 1000).format("YYYY-MM-DD HH:mm:ss");
      },
      users() {
        let headers = this.$ajax.defaults.headers.common
        headers['token'] = localStorage.getItem('token')
        headers['username'] = localStorage.getItem('user_name')
        this.$ajax.post('/user_list')
          .then(res => {
            if (res.data.code == -1) {
              alert('登录已失效,请重新登录!')
              localStorage.clear()
              this.$router.push('/')
              return
            }
            let Data = res.data.user
            this.getSearchInfo = Data
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: "获取用户信息失败"
            })
          })
      },
    },
    mounted() {
      this.users()
    }
  }
</script>
<style scoped>
  .header-tip {
    display: flex;
    font-size: 16px;
  }
</style>
