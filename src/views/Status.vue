<template>
  <div>
    <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" border style="width: 100%"
      :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass" :cell-style="setCellStyle">
      <el-table-column prop="obs_time" align="center" label="时间" :formatter="dataFormatter" min-width="175px">
      </el-table-column>
      <el-table-column prop="station_name" align="center" label="设备号" min-width="175px">
      </el-table-column>
      <el-table-column prop="status" label="设备状态" align="center" min-width="175px">
        <template slot="header" slot-scope="scope">
          <el-input v-model="searchTableInfo" prefix-icon="el-icon-search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <span v-html="formatter(scope,scope.row.status)"></span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-size="pagesize" layout="total, prev, pager, next, jumper" :total="tableData.length"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import page_size from '../../static/js/page.js'
  export default {
    data() {
      return {
        getSearchInfo: [],
        pagesize: page_size(),
        currpage: 1,
        searchTableInfo: ''
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
    methods: {
      handleCurrentChange(cpage) {
        this.currpage = cpage
      },
      setCellStyle: function({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex == 2 && row.status === 0) {
          return {
            "color": "red"
          }
        }
      },
      getRowClass(
        row,
        column,
        rowIndex,
        columnIndex
      ) {
        return "background:#f1f3fa;color:rgba(0,0,0,85);";
      },
      status() {
        let headers = this.$ajax.defaults.headers.common
        headers['token'] = localStorage.getItem('token')
        headers['username'] = localStorage.getItem('user_name')
        this.$ajax.post('/equip_all_info')
          .then(res => {
            if (res.data.code == -1) {
              alert('登录已失效,请重新登录!')
              localStorage.clear()
              this.$router.push('/')
              return
            }
            console.log(res.data.records)
            let Data = res.data.records
            this.getSearchInfo = Data
          })
          .catch(e => {
            console.log(e)
          })
      },
      formatter(scope, value) {
        switch (value) {
          case 1:
            return '在线'
            break
          default:
            return '离线'
        }
      },
      dataFormatter(row, column) {
        if (row.obs_time) {
          return moment(row.obs_time * 1000).format("YYYY-MM-DD HH:mm:ss")
        }
      },
    },
    mounted() {
      this.status()
    }
  }
</script>
<style scoped>
  .el-table {
    font-size: 16px;
  }
</style>
