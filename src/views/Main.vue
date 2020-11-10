<template>
  <div class="box">
    <div class="block">
      <div style="margin-left: 43px;">
        <span class="demonstration">选择日期：</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="block_1">
        <span class="demonstration">站台配置：</span>
        <el-select
          v-model="eid"
          filterable
          style="width: 220px"
          clearable
          multiple
          placeholder="搜索/选择站台配置"
          :collapse-tags="true"
          @change="selectStation"
        >
          <el-option v-for="item in stations" :key="item.key" :label="item.value" :value="item">
          </el-option>
        </el-select>
        <span class="demonstration">要素配置：</span>
        <el-select
          v-model="feature_filter"
          id="select_id"
          style="width: 300px;"
          filterable
          clearable
          multiple
          placeholder="搜索/选择要素配置"
          collapse-tags
          @change="selectStations"
        >
          <el-option v-for="item in elements" :key="item.key" :label="item.value" :value="item">
          </el-option>
        </el-select>
        <el-button
          type="primary"
          style="font-size: 16px; width: 84px;border-radius: 5px;"
          @click="b()"
          >查询</el-button
        >
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        element-loading-text="加载中,请稍等"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(245,245,245, 0.8)"
        v-loading="loading"
        :data="tableData.slice((page - 1) * size, page * size)"
        border
        max-height="682"
        style="width: 100%; margin: 0 auto;"
        :row-style="getRowClass"
        :header-row-style="getRowClass"
        :header-cell-style="getRowClass"
      >
        <!-- 动态循环的列表 -->
        <template v-for="(item, index) in obj">
          <el-table-column
            :key="index"
            :prop="item.prop"
            :min-width="item.minWidth"
            :label="item.label"
            :fixed="item.fixed"
            align="center"
          >
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        background
        :current-page.sync="currentPage1"
        :page-size="size"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import date from '../../static/js/date.js'
export default {
  data() {
    return {
      show: false,
      time: '',
      eid: '', //台站
      feature_filter: '', //要素
      tableData: [],
      elements: [],
      stations: [],
      obj: [],
      eid_key: [], //站台信息：key-value
      feature_filter_key: [], //要素信息：key-value
      page: 1, //页
      numbers: 0,
      rowIndex: '',
      columnIndex: '',
      s: [],
      size: '17',
      loading: false,
      currentPage1: null
    }
  },
  methods: {
    getRowClass: function({ row, column, rowIndex, columnIndex }) {
      return 'background:#f1f3fa;color:rgba(0,0,0,85);border-color: #eeeeee;'
    },
    // 页数
    handleCurrentChange(val) {
      this.page = val
    },
    selectStation(value) {
      this.eid = value
    },
    selectStations(value) {
      this.feature_filter = value
    },
    b() {
      //点击事件
      this.loading = true
      setTimeout(() => {
        if (!this.loading) {
          return
        } else {
          this.$message({
            type: 'warning',
            message: '请求超时,请刷新页面重新请求！'
          })
          this.loading = false
        }
      }, 5000)
      this.page = 1
      this.currentPage1 = 1
      if (this.time == '' || this.eid == '') {
        this.$message({
          type: 'warning',
          message: '参数不能为空'
        })
        this.loading = false
        return
      }
      for (let i = 0; i < this.time.length; i++) {
        // 日期转为时间戳
        let a = this.time[i]
        let b = Math.round(a)
        this.time[i] = b
      }
      // 清空台站
      this.eid_key = []
      for (let i = 0; i < this.eid.length; i++) {
        this.eid_key.push(this.eid[i].key)
      }
      this.feature_filter_key = []
      for (let i = 0; i < this.feature_filter.length; i++) {
        this.feature_filter_key.push(this.feature_filter[i].key)
      }
      this.s = []
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/features_his', {
          start_time: this.time[0],
          end_time: this.time[1],
          eid: this.eid_key,
          feature_filter: this.feature_filter_key,
          page: this.page,
          size: this.size.toString()
        })
        .then(res => {
          if (res.data.code == -1) {
            localStorage.clear()
            top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
            return
          }
          this.loading = false
          if (res.data.records.length == 0) {
            this.$message({
              type: 'warning',
              message: '此设备无数据！'
            })
            return
          }
          let data = res.data.records
          this.tableData = data
          for (let i = 0; i < this.eid.length; i++) {
            for (let j = 0; j < this.tableData.length; j++) {
              if (this.eid[i].key == this.tableData[j].eid) {
                this.tableData[j].eid = this.eid[i].value
              }
            }
          }
          this.numbers = res.data.numbers
          for (let i = 0; i < data.length; i++) {
            this.s.push(data[i].q_code)
          }
          switch (this.feature_filter.length) {
            case 0:
              this.obj = [
                {
                  label: '站台',
                  prop: 'eid',
                  fixed: 'left',
                  minWidth: '200px'
                },
                {
                  label: '时间',
                  prop: 'obs_date',
                  fixed: 'left',
                  minWidth: '200px'
                }
              ]
              break
            default:
              this.obj = [
                {
                  label: '站台',
                  prop: 'eid',
                  fixed: 'left',
                  minWidth: '200px'
                },
                {
                  label: '时间',
                  prop: 'obs_date',
                  fixed: 'left',
                  minWidth: '200px'
                }
              ]
          }
          for (let i = 0; i < this.feature_filter.length; i++) {
            this.obj.push({
              label: this.feature_filter[i].value,
              prop: this.feature_filter[i].key,
              minWidth: '140px'
            })
          }
          for (let i = 0; i < data.length; i++) {
            let timeStamp = data[i].obs_date
            let d = date.formatTime(timeStamp * 1000, 'yyyy-MM-dd HH:mm:ss')
            data[i].obs_date = d
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    resolution() {
      let width = screen.width
      let a = document.querySelectorAll('.el-select')
      let b = document.querySelectorAll('.demonstration')
      let c = document.querySelectorAll(
        '.el-date-editor.el-range-editor.el-input__inner.el-date-editor--daterange'
      )
      switch (width) {
        case 1600:
        case 1440:
        // 故意合并
        case 1400:
          a[0].style.width = '280px'
          a[1].style.width = '200px'
          for (let i = 0; i < b.length; i++) {
            b[i].style.marginLeft = '6px'
          }
          c[0].style.width = '320px'
          this.size = '15'
          break
        case 1360:
        case 1366:
          a[1].style.width = '200px'
          for (let i = 0; i < b.length; i++) {
            b[i].style.marginLeft = '6px'
          }
          c[0].style.width = '250px'
          this.size = '10'
          break
      }
    },
    feature() {
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/reverse_features')
        .then(res => {
          if (res.data.code == -1) {
            localStorage.clear()
            top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
            return
          }
          this.elements = res.data.records
        })
        .catch(e => {
          console.log(e)
        })
    },
    equ() {
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/equip_name', {
          e_code: ''
        })
        .then(res => {
          if (res.data.code == -1) {
            alert('登陆已失效，请重新登陆！')
            localStorage.clear()
            top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
            return
          }
          this.stations = res.data.records
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted() {
    this.equ()
    this.feature()
    this.resolution()
  }
}
</script>

<style scoped>
@import url('../../static/css/main.css');

.table-wrapper /deep/ .el-table td,
.table-wrapper /deep/ .el-table th {
  padding: 6px;
}
</style>
