<template>
  <div>
    <div>
      <el-page-header @back="$router.push('/equipment')" content="新建气象设备"></el-page-header>
      <el-divider></el-divider>
    </div>
    <div class="box">
      <el-card header="新建气象设备" class="login-card">
        <el-form @submit.native.prevent status-icon :model="verification" ref="verification">
          <el-form-item label="设备编号" prop="station_id" :rules="verification.rules">
            <el-input
              v-model.trim="verification.station_id"
              maxlength="6"
              onkeyup="value=value.replace(/[^\w_]/g,'');"
              placeholder="字母数字组合,长度为6"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="station_name" :rules="{ required: true, message: '设备名称不能为空' }">
            <el-input
              v-model.trim="verification.station_name"
              placeholder="请输入设备名称"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备经纬度,例:113.790921,34.748171" prop="lon_lat" :rules="verification.rules">
            <el-input
              v-model="verification.lon_lat"
              @blur.prevent="b()"
              onkeyup="value=value.replace(/[^\d.,，]/g,'');"
              placeholder="请输入经纬度"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="address" disabled placeholder="根据经纬度自动填充" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="设备创建者" prop="creator" :rules="{ required: true, message: '设备创建者不能为空' }">
            <el-input v-model.trim="verification.creator" placeholder="请输入创建者" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否发送报文">
            <el-radio-group v-model="isradio">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="register('verification')" native-type="submit">新建</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      props: {
        multiple: true
      },
      verification: {
        station_id: '',
        station_name: '',
        creator: '',
        lon_lat: '',
        rules: {
          required: true,
          message: '参数不能为空'
        }
      },
      new_lon_lat: '',
      isradio: '2',
      radio: '2',
      address: ''
    }
  },
  methods: {
    b() {
      for (let i = 0; i < this.verification.lon_lat.length; i++) {
        if (this.verification.lon_lat[i] == ',') {
          this.new_lon_lat = this.verification.lon_lat.split(',')
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
        if (this.verification.lon_lat[i] == '，') {
          this.new_lon_lat = this.verification.lon_lat.split('，')
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
    register(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.verification.station_id.length != 6) {
            this.$message({
              type: 'warning',
              message: '设备编号必须为6位'
            })
            return
          }
          let headers = this.$ajax.defaults.headers.common
          headers['token'] = localStorage.getItem('token')
          // headers['username'] = localStorage.getItem('user_name')
          this.$ajax
            .post('/add_equipments', {
              e_code: '0101',
              basic_info: {
                eid: 'HZG07' + this.verification.station_id + '002',
                station_name: encodeURI(this.verification.station_name),
                longitude: this.new_lon_lat[0],
                latitude: this.new_lon_lat[1],
                creator: encodeURI(this.verification.creator),
                message_push: this.isradio,
                station_id: this.verification.station_id,
                address: encodeURI(this.address)
              },
              addr_value: '',
              sub_device: {
                '0301': [],
                '0302': [],
                '0303': []
              },
              new_sub_device: {
                '0301': [],
                '0302': [],
                '0303': []
              },
              extend_data: ''
            })
            .then(res => {
              switch (res.data.code) {
                case -1:
                  // alert('登陆已失效，请重新登陆！')
                  alert('登陆已失效，请重新登陆！')
                  localStorage.clear()
                  top.location.href = 'http://zhgl.hngl.cn:8080/auth-server/login'
                  break
                case 0:
                  this.$message({
                    type: 'error',
                    message: '新建失败'
                  })
                  break
                case 1:
                  this.$router.push('/equipment')
                  this.$message({
                    type: 'success',
                    message: '新建气象设备成功'
                  })
                  break
                case 2:
                  this.$message({
                    type: 'warning',
                    message: '设备编号重复'
                  })
                  break
                case 3:
                  this.$message({
                    type: 'warning',
                    message: '设备名称重复'
                  })
                  break
                case 4:
                  this.$message({
                    type: 'warning',
                    message: '设备识别号重复'
                  })
                  break
                case 5:
                  this.$message({
                    type: 'warning',
                    message: '辅助设备编号重复'
                  })
                  break
                case 6:
                  this.$message({
                    type: 'warning',
                    message: '辅助设备名称重复'
                  })
                  break
                case 7:
                  this.$message({
                    type: 'warning',
                    message: '辅助设备eid重复'
                  })
                  break
              }
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
            })
        } else {
          this.$message({
            type: 'error',
            message: '下列参数不能为空'
          })
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
}

.el-divider--horizontal {
  margin: 12px 0px;
}

.box {
  width: 400px;
  height: 100%;
  box-shadow: 11px 6px 48px 0 rgba(209, 205, 205, 0.5);
  margin: 0 auto;
  background: #fdfeff;
  border-radius: 0.5rem;
  display: flex;
}
</style>
