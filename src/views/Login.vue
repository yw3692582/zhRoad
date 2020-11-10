<template>
  <el-container>
    <el-main>
      <div class="top_box">
        <img src="/static/img/u4.png" style="padding: 20px 0px 0px 10%;" height="37" width="50" />
        <span style="font-size: 32px;color:white; padding-left: 20px;line-height: 80px;">智慧公路-气象平台</span>
        <span style="padding-left: 30%;">
          <el-input prefix-icon="el-icon-user-solid" style="width: 240px;line-height: 80px;padding-right: 20px;"
            v-model="username" placeholder="请输入用户名"></el-input>
          <el-input prefix-icon="el-icon-lock" style="width: 240px;line-height: 80px;" @keyup.enter.native="login"
            v-model="password" type="password" placeholder="请输入密码"></el-input>
          <el-button type="primary" @click="login" style="height: 42px;margin-top: 20px;margin-left: 20px;">登录</el-button>
        </span>
      </div>
      <div class="footer_box">
        <span>版权所有©2018-2020</span>
        <br>
        <span>中电科信息产业有限公司</span>
      </div>
      <!-- <div class="box">
				<label>用户名</label>
				<el-input style="display: inline;" v-model="username" placeholder="请输入用户名"></el-input><br />
				<label>密码</label>&nbsp;&nbsp;&nbsp;&nbsp;
				<el-input style="display: inline;" v-model="password" type="password" @keyup.enter.native="login" placeholder="请输入密码"></el-input><br />
				<el-button type="primary" @click="login" style="font-size: 16px;margin-left: 230px;">登录</el-button>
			</div> -->
      <!-- </div> -->
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
  export default {
    data() {
      return {
        username: '',
        password: '',
        list: [
          "static/img/img_3_1.jpg",
          "static/img/img_3_2.jpg"
        ]
      }
    },
    methods: {
      // 验证登陆
      login() {
        if (this.username == '' || this.password == '') {
          this.$message({
            type: 'warning',
            message: '账号或密码不能为空!'
          })
          return
        }
        this.$ajax.post('/login', {
            username: this.username,
            password: this.password
          })
          .then(res => {
            switch (res.data.code) {
              case 0:
                this.$message({
                  type: 'error',
                  message: '登陆失败'
                })
                break
              case 1:
                this.$message({
                  type: 'warning',
                  message: '用户不存在/密码不正确!',
                })
                break
              case 2:
                this.$store.commit("handleToken", res.data.token);
                this.$router.push('/main')
                this.$message({
                  type: 'success',
                  message: '管理员登陆成功'
                })
                this.$store.commit("handleUsername", this.username);
                break
              case 3:
                this.$store.commit("handleToken", res.data.token);
                this.$router.push('/main')
                this.$message({
                  type: 'success',
                  message: '普通用户登陆成功'
                })
                this.$store.commit("handleUsername", this.username);
                break
            }
          })
          .catch(e => {
            console.log(e)
          })
      },
      resolution() {
        let width = screen.width
        let img = document.querySelectorAll("img")
        let span = document.querySelectorAll("span")
        switch (width) {
          case 1680:
            // 故意合并
          case 1600:
            img[0].style.padding = '20px 0px 0px 5%'
            span[1].style.paddingLeft = '30%'
            break
            // 故意合并
          case 1440:
          case 1400:
          case 1366:
            img[0].style.padding = '20px 0px 0px 3%'
            span[1].style.paddingLeft = '22%'
            break
        }
      }
    },
    mounted() {
      this.resolution()
    }
  }
</script>

<style scoped>
  @import url("../../static/css/login.css");
</style>
