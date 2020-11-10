<template>
  <div class="table-wrapper">
    <el-table
      :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
      border
      style="width: 100%"
      :row-style="getRowClass"
      :header-row-style="getRowClass"
      :header-cell-style="getRowClass"
    >
      <el-table-column prop="station_name" align="center" label="台站名称" min-width="175px"> </el-table-column>
      <el-table-column prop="description" align="center" label="预警内容" min-width="175px"> </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="tableData.length"
      :page-size="pagesize"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagesize: 15,
      currpage: 1
    }
  },
  watch: {},
  methods: {
    handleCurrentChange(cpage) {
      this.currpage = cpage
    },
    getRowClass(row, column, rowIndex, columnIndex) {
      return 'background:#f1f3fa;color:rgba(0,0,0,85);'
    },
    warings() {
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/get_warning')
        .then(res => {
          if (res.data.code == -1) {
            alert('登录已失效,请重新登录!')
            localStorage.clear()
            this.$router.push('/')
            return
          }
          this.tableData = res.data.records
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  destroyed() {},
  mounted() {
    this.warings()
  }
}
</script>

<style scoped>
.el-table {
  font-size: 16px;
}

.table-wrapper /deep/ .el-table td,
.table-wrapper /deep/ .el-table th {
  padding: 6px;
}
</style>
