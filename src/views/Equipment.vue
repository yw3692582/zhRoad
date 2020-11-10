<template>
  <div>
    <el-button
      type="primary"
      style="display: flex;font-size: 16px;margin-bottom: 10px;"
      @click="$router.push('/createEqu')"
      >新建设备</el-button
    >
    <div class="table-wrapper">
      <el-table
        border
        :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        style="width: 100%;font-size: 16px;"
        :row-style="getRowClass"
        :header-row-style="getRowClass"
        :header-cell-style="getRowClass"
        :cell-style="setCellStyle"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="经度:">
                <span>{{ props.row.longitude }}</span>
              </el-form-item>
              <el-form-item label="纬度:">
                <span>{{ props.row.latitude }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="station_name" align="center" min-width="152px"> </el-table-column>
        <el-table-column label="设备号" prop="eid" align="center" min-width="184px"> </el-table-column>
        <!-- <el-table-column label="创建者" prop="creator" align="center" min-width="88px">
        </el-table-column> -->
        <!-- <el-table-column label="地址" prop="address" align="center" min-width="310px">
				</el-table-column> -->
        <!-- <el-table-column label="创建时间" prop="create_time" align="center" min-width="190px" :formatter="formatterTime">
        </el-table-column> -->
        <el-table-column label="设备状态" prop="status" align="center" min-width="120px" :formatter="on_off_line">
        </el-table-column>
        <el-table-column align="center" min-width="155px">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="searchTableInfo"
              size="mini"
              prefix-icon="el-icon-search"
              placeholder="请输入内容搜索"
            ></el-input>
          </template>
          <template slot-scope="scope">
            <!-- <el-link @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-link> -->
            <el-link @click="handleDelete(scope.$index, scope.row)" type="danger">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page.sync="currentPage1"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <div class="edit_dia">
      <!-- 编辑设备 弹窗 -->
      <el-dialog :close-on-click-modal="false" title="编辑设备" :visible.sync="dialogEditVisible" @close="cancel">
        <el-form status-icon @submit.native.prevent>
          <el-form-item label="台站编号" style="padding-bottom: 10px;">
            <el-input v-model.trim="station_id" style="width: 300px;" placeholder="请输入设备编号"></el-input>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input v-model.trim="station_name" style="width: 300px;" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备经纬度,例:113.790921,34.748171">
            <el-input v-model="lon_lat" @blur.prevent="b()" placeholder="请输入经纬度"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="address" disabled placeholder="根据经纬度自动填充"></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button @click="cancel">取 消</el-button>
          <el-button
            type="primary"
            :disabled="btn1 && btn2 && btn7 ? btn : btn == false"
            @click="editEqu"
            native-type="submit"
            >修改</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import page_size from '../../static/js/page.js'
export default {
  inject: ['reload'],
  data() {
    return {
      dialogEditVisible: false,
      eid: '',
      getSearchInfo: [],
      searchTableInfo: '',
      options: [],
      search: '',
      pagesize: page_size(),
      currpage: 1,
      currentPage1: null,
      isradio: false,
      e_code: '',
      station_id: '',
      station_name: '',
      lon_lat: '',
      address: '',
      sub_id: [],
      sub_eid: '',
      longitude: '',
      latitude: '',

      btn: true,
      btn1: true,
      btn2: true,
      btn7: true,

      old_sta_id: '',
      old_sta_name: '',
      old_lon_lat: '',

      btn7: true,
      new_lon_lat: []
    }
  },
  computed: {
    tableData() {
      let searchTableInfo = this.searchTableInfo
      if (searchTableInfo) {
        this.currpage = 1
        this.currentPage1 = 1
        return this.getSearchInfo.filter(data => {
          return Object.keys(data).some(key => {
            return (
              String(data[key])
                .toLowerCase()
                .indexOf(searchTableInfo) > -1
            )
          })
        })
      }
      return this.getSearchInfo
    }
  },
  watch: {
    // 台站id
    station_id(newsta_id, oldsta_id) {
      if (newsta_id == this.old_sta_id) {
        this.btn1 = true
      } else {
        this.station_id = newsta_id
        this.btn1 = false
      }
    },
    // 台站name
    station_name(newsta_name, oldsta_name) {
      if (newsta_name == this.old_sta_name) {
        this.btn2 = true
      } else {
        this.station_name = newsta_name
        this.btn2 = false
      }
    },
    // 地址
    lon_lat(new_add, old_add) {
      if (new_add == this.old_lon_lat) {
        this.btn7 = true
      } else {
        this.btn7 = false
      }
    }
  },
  methods: {
    setCellStyle: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 6 && row.status === 0) {
        return {
          color: 'red'
        }
      }
    },
    getRowClass: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#f1f3fa;color:rgba(0,0,0,85);border-color: #eeeeee;'
    },
    b() {
      for (let i = 0; i < this.lon_lat.length; i++) {
        if (this.lon_lat[i] == ',') {
          this.new_lon_lat = this.lon_lat.split(',')
          if (this.new_lon_lat[0] > 180) {
            this.$message({
              type: 'warning',
              message: '经度不得超过180'
            })
            return
          }
          if (this.new_lon_lat[1] > 90) {
            this.$message({
              type: 'warning',
              message: '纬度不得超过90'
            })
            return
          }
        }
        if (this.lon_lat[i] == '，') {
          this.new_lon_lat = this.lon_lat.split('，')
          if (this.new_lon_lat[0] > 180) {
            this.$message({
              type: 'warning',
              message: '经度不得超过180'
            })
            return
          }
          if (this.new_lon_lat[1] > 90) {
            this.$message({
              type: 'warning',
              message: '纬度不得超过90'
            })
            return
          }
        }
      }
      let headers = this.$ajax.defaults.headers.common
      delete headers.token
      delete headers.username
      this.$ajax
        .get(
          '//restapi.amap.com/v3/geocode/regeo?key=657d0c0ea15e983c2b8f48fb44059ef5&' +
            'location=' +
            this.new_lon_lat[0] +
            ',' +
            this.new_lon_lat[1]
        )
        .then(res => {
          this.address = res.data.regeocode.formatted_address
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: '获取地址失败，请刷新页面'
          })
        })
    },
    register() {
      this.$router.push('/createEq')
    },
    handleEdit(index, row) {
      this.dialogEditVisible = true
      if (row.station_id == null || row.station_id == '') {
        this.old_sta_id = row.station_id
      } else {
        this.old_sta_id = row.station_id.concat()
      }
      this.eid = row.eid
      this.e_code = row.e_code
      this.station_id = row.station_id
      this.station_name = row.station_name
      this.old_sta_name = row.station_name.concat()
      this.lon_lat = row.longitude + ',' + row.latitude
      this.lon_lat = row.longitude + '，' + row.latitude
      this.old_lon_lat = this.lon_lat.concat()
      this.longitude = row.longitude
      this.latitude = row.latitude
      this.address = row.address
    },
    cancel() {
      this.station_id = ''
      this.station_name = ''
      this.lon_lat = ''
      this.address = ''
      this.dialogEditVisible = false
    },
    editEqu() {
      if (this.station_id.length != 6) {
        this.$message({
          type: 'warning',
          message: '设备编号必须为6位'
        })
        return
      }
      if (this.station_id == this.old_sta_id) {
        this.station_id = ''
      }
      if (this.station_name == this.old_sta_name) {
        this.station_name = ''
      }
      if (this.longitude == null && this.latitude == null && this.address == null) {
        this.longitude = ''
        this.latitude = ''
        this.address = ''
      }
      for (let i = 0; i < this.lon_lat.length; i++) {
        if (this.lon_lat[i] == ',') {
          this.new_lon_lat = this.lon_lat.split(',')
        }
        if (this.lon_lat[i] == '，') {
          this.new_lon_lat = this.lon_lat.split('，')
        }
      }
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/manage_equipments', {
          eid: this.eid,
          e_code: '',
          station_name: encodeURI(this.station_name),
          longitude: this.new_lon_lat[0],
          latitude: this.new_lon_lat[1],
          creator: '',
          message_push: this.isradio.toString(),
          address: encodeURI(this.address),
          station_id: this.station_id,
          sub_device: {
            id: [],
            new_sub_device: []
          },
          extend_data: {}
        })
        .then(res => {
          switch (res.data.code) {
            case -1:
              // alert('登录已失效,请重新登录!')
              localStorage.clear()
              top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
              break
            case 0:
              this.$message({
                type: 'error',
                message: '修改失败'
              })
              break
            case 1:
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              break
            case 2:
              this.$message({
                type: 'warning',
                message: '设备号重复'
              })
              break
            case 3:
              this.$message({
                type: 'warning',
                message: '设备名重复'
              })
              break
          }
          this.reload()
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: '编辑信息失败'
          })
          this.reload()
        })
      this.dialogEditVisible = false
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该设备信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let headers = this.$ajax.defaults.headers.common
          headers['token'] = localStorage.getItem('token')
          // headers['username'] = localStorage.getItem('user_name')
          this.$ajax
            .post('/delete_equipments', {
              eid: row.eid
            })
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: 'success',
                  message: '删除信息成功'
                })
              }
              if (res.data.code == -1) {
                alert('登陆已失效，请重新登陆！')
                localStorage.clear()
                top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
                return
              }
              this.reload()
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: '删除用户信息失败'
              })
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
      this.currpage = cpage
    },
    formatterTime(row, column) {
      let date = row[column.property]
      if (date == undefined) {
        return ''
      }
      return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    equ() {
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/equip_all_info')
        .then(res => {
          if (res.data.code == -1) {
            alert('登陆已失效，请重新登陆！')
            localStorage.clear()
            top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
            return
          }
          let Data = res.data.records
          this.getSearchInfo = Data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: '获取数据失败'
          })
        })
    },
    on_off_line(row, column) {
      switch (row.status) {
        case 0:
          return '离线'
          break
        default:
          return '在线'
      }
    }
  },
  mounted() {
    this.equ()
  }
}
</script>
<style scoped>
.table-wrapper /deep/ .el-table td,
.table-wrapper /deep/ .el-table th {
  padding: 8px;
}

.table-wrapper /deep/ .el-form-item {
  padding-left: 50px;
  margin-bottom: 0px;
}
</style>
