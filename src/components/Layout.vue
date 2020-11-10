<template>
  <el-container>
    <!-- <el-header height="120px">
			<img src="/static/img/u4.png" style="padding: 26px 0px 0px 46px;" height="37" width="50" />
			<div style="font-size: 28px;color:#ffffff; padding-left: 20px; line-height: 100px;">智慧公路-气象平台</div>
			<span style="color: #ffffff;padding-left: 200px; font-size: 18px;font-weight: 500;line-height: 100px;" id="time">{{data}}</span>
			<div style="position: absolute;right: 5%;display: flex;">
				<div style="padding: 20px 5px 0px 0px;line-height: 100px;">
						<el-avatar :size="50" src="static/img/hearder.png"></el-avatar>
				</div>
			</div>
		</el-header> -->
    <el-container>
      <el-aside width="150px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#1990FF"
          text-color="#fff"
          active-text-color="rgba(0,0,0,85)"
          router
        >
          <el-menu-item index="/main">
            <img src="/static/img/u16.png" height="28px" width="30px" />
            <span slot="title">数据查询</span>
          </el-menu-item>
          <!-- <el-menu-item index="/status">
						<img src="/static/img/status.png" height="28px" width="30px">
						<span slot="title">设备状态</span>
					</el-menu-item> -->
          <!-- <el-menu-item index="/warning">
						<img src="/static/img/warning.png" height="28px" width="30px">
						<span slot="title">气象预警</span>
					</el-menu-item> -->
          <el-menu-item index="/equipment">
            <img src="/static/img/equ.png" height="28px" width="30px" />
            <span slot="title">设备管理</span>
          </el-menu-item>
          <el-menu-item index="/statistical">
            <img src="/static/img/statistical.png" height="28px" width="30px" />
            <span slot="title">数据统计</span>
          </el-menu-item>
          <el-menu-item index="/monitor">
            <img src="/static/img/map.png" height="28px" width="30px" />
            <span slot="title">地图监控</span>
          </el-menu-item>
          <!-- <el-menu-item index="/users">
						<img src="/static/img/user.png" height="28px" width="30px">
						<span slot="title">用户管理</span>
					</el-menu-item> -->
        </el-menu>
      </el-aside>
      <el-main>
        <div>
          <router-view v-if="isRouterAlive"></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  provide: function() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true,
      // timer: null,
      data: 0
    }
  },
  methods: {
    reload: function() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
    // time() {
    // 	this.data = moment().format("YYYY年MM月DD日 dddd HH:mm:ss")
    // },
    exit() {
      this.$message({
        type: 'success',
        message: '退出成功!'
      })
      localStorage.clear()
      this.$router.push('/')
    },
    resolution() {
      let width = screen.width
      // let header = document.querySelectorAll(".el-header")
      let menu = document.querySelectorAll('.el-menu .el-menu-item')
      switch (width) {
        case 1400:
        case 1440:
          // header[0].style.height = '100px'
          for (let i = 0; i < menu.length; i++) {
            menu[i].style.margin = '15px 0px 0px 0px'
          }
          break
        case 1360:
        case 1366:
          // header[0].style.height = '100px'
          for (let i = 0; i < menu.length; i++) {
            menu[i].style.margin = '5px 0px 0px 0px'
          }
          break
      }
    },
    getTokens() {
      let url = this.$route.query //tk参数
      let token
      let loca_token = localStorage.getItem('token') //localstorage中的token
      let url_string = JSON.stringify(url)
      if (url_string == '{}') {
        if (loca_token) {
          token = loca_token
        } else {
          top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
        }
      } else {
        token = url.tk
        localStorage.setItem('token', token)
        this.$store.commit('handleToken', token)
      }
    }
  },
  mounted() {
    this.getTokens()
    // this.getTokenVues()
    // this.timer = setInterval(this.time, 1000);
    this.resolution()
  },
  beforeDestroy() {
    // clearInterval(this.timer);
  }
}
</script>

<style>
@import url('../../static/css/layout.css');

.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-size: 16px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
