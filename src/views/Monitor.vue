<template>
  <div>
    <div>
      <!-- 地图 -->
      <div id="container"></div>
    </div>
    <div class="layer_Data">
      <div id="dia_station">
        <div id="left_main">
          <div class="left_herder">
            <el-tooltip class="item" effect="light" content="数据刷新" placement="top">
              <i class="el-icon-refresh" @click="refreshData"></i>
            </el-tooltip>
            <i class="el-icon-time"></i><label>{{ lookTime }}</label>
            <el-select v-model="station" @change="selectStation" placeholder="请选择台站">
              <el-option
                v-for="item in opStation"
                :key="item.eid"
                :label="item.station_name"
                :value="item.eid"
              >
              </el-option>
            </el-select>
          </div>
          <div class="left_center">
            <el-row>
              <el-col :span="6">
                <div id="temperature" class="div1" style="width: 87px;height:260px;"></div>
              </el-col>
              <el-col :span="6">
                <div id="humidity" class="div1" style="width: 87px;height:260px;"></div>
              </el-col>
              <el-col :span="6">
                <div id="subgrade" class="div1" style="width: 87px;height:260px;"></div>
              </el-col>
              <el-col :span="6">
                <div id="road" class="div1" style="width: 87px;height:260px;"></div>
              </el-col>
            </el-row>
          </div>
          <div class="left_center_bottom">
            <el-row>
              <el-col :span="12">
                <div id="direction" style="width: 180px;height:220px;"></div>
              </el-col>
              <el-col :span="12">
                <div id="speed" style="width: 180px;height:220px;"></div>
              </el-col>
            </el-row>
          </div>
          <div class="left_center_footer">
            <el-row style="padding: 18px 0px 0px 0px;">
              <el-col :span="12">
                <div>
                  <img src="/static/icon/njd.png" height="10" width="15" />
                  分钟能见度：<span id="fontColor">{{ av_avg1mhv }}m</span>
                </div>
              </el-col>
              <el-col :span="12" style="padding-left: 15px;">
                <div>
                  <img src="/static/icon/PM.png" height="15" width="15" />
                  PM 2.5：<span id="fontColor">{{ pm }}μg/m³</span>
                </div>
              </el-col>
            </el-row>
            <el-row style="padding: 18px 0px 9px 0px;">
              <el-col :span="12">
                <div>
                  <img src="/static/icon/rainfall.png" height="15" width="15" />
                  分钟降水：<span id="fontColor">{{ mntrnfl }}mm</span>
                </div>
              </el-col>
              <el-col :span="12" style="padding-left: 15px;">
                <div>
                  <img src="/static/icon/sh.png" height="14" width="14" />
                  水膜厚度：<span id="fontColor">{{ rw_wft }}mm</span>
                </div>
              </el-col>
            </el-row>
            <el-row style="padding: 9px 0px 9px 0px;">
              <el-col :span="12">
                <div>
                  <img src="/static/icon/bc.png" height="15" width="15" />
                  冰层厚度：<span id="fontColor">{{ rw_ift }}mm</span>
                </div>
              </el-col>
              <el-col :span="12" style="padding-left: 15px;">
                <div>
                  <img src="/static/icon/xc.png" height="15" width="15" />
                  雪层厚度：<span id="fontColor">{{ rw_sft }}mm</span>
                </div>
              </el-col>
            </el-row>
            <el-row style="padding-top: 9px;">
              <el-col :span="12">
                <div>
                  <img src="/static/icon/shxs.png" height="15" width="15" />
                  湿滑系数：<span id="fontColor">{{ wetslipcoef }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      eid: '',
      markers: [],
      infoWindows: [],
      startIcons: [],
      station: '',
      opStation: [],
      lookTime: moment().format('MM月DD日 dddd'),
      Tem: 0, //气温
      Hum: 0, //湿度
      Sub: 0, //路基温度
      Road: 0, //路面温度

      Dire: 0, //瞬时风向
      Speed: 0, //瞬时风速

      av_avg1mhv: 0, //能见度
      pm: 0, //空气质量
      mntrnfl: 0, //降水
      rw_wft: 0, //水膜厚度
      rw_ift: 0, //冰层厚度
      rw_sft: 0, //雪层厚度
      //rw_trs: '--', //路面状况
      wetslipcoef: 0 //湿滑系数
    }
  },
  updated() {
    this.drawTem()
    this.drawHum()
    this.drawSub()
    this.drawRoad()
    this.drawDire()
    this.drawSpeed()
  },
  methods: {
    initMap() {
      //初始化地图
      this.map = new AMap.Map('container', {
        viewMode: '2D',
        zoom: 4,
        zooms: [4, 18]
      })
      this.addControls()
      this.addMaker()
      this.clickMarker()
      this.info_window()
    },
    addControls() {
      // 地图添加控件
      AMapUI.loadUI(['control/BasicControl'], BasicControl => {
        // 缩放
        this.map.addControl(
          new BasicControl.Zoom({
            position: 'rb',
            showZoomNum: true
          })
        )
        // 比例尺
        this.map.addControl(new AMap.Scale({}))
      })
    },
    selectStation(val) {
      this.eid = val
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      this.$ajax
        .post('/live_data', {
          eid: val
        })
        .then(res => {
          let data = res.data
          this.$nextTick(() => {
            this.Tem = data['QIWEN']
            this.Hum = data['XIANGDUISHIDU']
            this.Sub = data['TENCMLUJIWD']
            this.Road = data['LUMIANWD']
            this.Dire = data['SHUNSHIFS']
            this.Speed = data['SHUNSHIFX']
            this.av_avg1mhv = data['ONEMINNENGJIANDU']
            this.pm = data['PM25NONGDU']
            this.mntrnfl = data['FENZHONGJIANGSHUI']
            this.rw_wft = data['SHUIMOHOUDU']
            this.rw_ift = data['BINGCENGHOUDU']
            this.rw_sft = data['XUECENGHOUDU']
            this.wetslipcoef = data['SHIHUAXISHU']
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    refreshData() {
      //刷新数据
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      this.$ajax
        .post('/live_data', {
          eid: this.eid
        })
        .then(res => {
          let data = res.data
          this.$nextTick(() => {
            this.Tem = data['QIWEN']
            this.Hum = data['XIANGDUISHIDU']
            this.Sub = data['TENCMLUJIWD']
            this.Road = data['LUMIANWD']
            this.Dire = data['SHUNSHIFS']
            this.Speed = data['SHUNSHIFX']
            this.av_avg1mhv = data['ONEMINNENGJIANDU']
            this.pm = data['PM25NONGDU']
            this.mntrnfl = data['FENZHONGJIANGSHUI']
            this.rw_wft = data['SHUIMOHOUDU']
            this.rw_ift = data['BINGCENGHOUDU']
            this.rw_sft = data['XUECENGHOUDU']
            this.wetslipcoef = data['SHIHUAXISHU']
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    clickMarker() {
      // 点击/移入/移出操作
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].on('mouseover', () => {
          //鼠标移入
          this.map.setDefaultCursor('pointer')
          this.infoWindows[i].open(this.map, this.markers[i].getPosition())
        })
        this.markers[i].on('mouseout', () => {
          //鼠标移出
          this.map.setDefaultCursor('default')
          this.infoWindows[i].close()
        })
        // this.markers[i].on('click', e => {
        //   //点击台站
        //   this.map.setDefaultCursor('pointer')
        //   alert('暂未开发该功能！')
        // })
      }
    },
    addMaker() {
      //添加台站
      this.map.clearMap() //清空之前的点标记
      for (let i = 0, len = this.opStation.length; i < len; i++) {
        let img = ''
        if (this.opStation[i].status == 1) {
          img = '../../static/img/normal_green.png'
        } else {
          img = '../../static/img/normal_red.png'
        }
        var startIcon = new AMap.Icon({
          //添加不同的图片
          // 图标尺寸
          size: new AMap.Size(25, 34),
          // 图标的取图地址
          image: img,
          // 图标所用图片大小
          imageSize: new AMap.Size(24, 24),
          // 图标偏移量
          imageOffset: new AMap.Pixel(0, 0)
        })
        this.startIcons.push(startIcon)
      }
      for (let i = 0, len = this.opStation.length; i < len; i++) {
        var marker = new AMap.Marker({
          map: this.map,
          icon: this.startIcons[i],
          position: [parseInt(this.opStation[i].longitude), parseInt(this.opStation[i].latitude)],
          offset: new AMap.Pixel(-13, -20)
        })
        this.markers.push(marker)
      }
    },
    info_window() {
      for (var i = 0; i < this.opStation.length; i++) {
        let infoWindow = new AMap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: this.createInfoWindow(this.opStation[i].station_name, this.opStation[i].eid),
          // 弹窗位置
          offset: new AMap.Pixel(13, -35)
        })
        this.infoWindows.push(infoWindow)
      }
    },
    createInfoWindow(title, content) {
      //地图自定义窗口
      let info = document.createElement('div')
      info.className = 'custom-info input-card content-window-card'
      //可以通过下面的方式修改自定义窗体的宽高
      info.style.width = '200px'
      // 定义顶部标题
      let top = document.createElement('div')
      let titleD = document.createElement('div')
      top.className = 'info-top'
      titleD.innerHTML = title
      top.appendChild(titleD)
      info.appendChild(top)
      // 定义中部内容
      let middle = document.createElement('div')
      middle.className = 'info-middle'
      middle.style.backgroundColor = 'white'
      middle.innerHTML = content
      info.appendChild(middle)
      // 定义底部内容
      let bottom = document.createElement('div')
      bottom.className = 'info-bottom'
      bottom.style.position = 'relative'
      bottom.style.top = '0px'
      bottom.style.margin = '0 auto'
      let sharp = document.createElement('img')
      sharp.src = 'static/img/sharp.png'
      bottom.appendChild(sharp)
      info.appendChild(bottom)
      return info
    },
    layerData() {
      //实时数据弹窗
      let _this = this
      layer.open({
        type: 1,
        title: false,
        area: ['390px', '680px'],
        shade: false,
        resize: false,
        maxmin: false,
        offset: ['3vw', '150px'],
        anim: 2,
        closeBtn: 0,
        content: $('#dia_station')
      })
      this.$nextTick(() => {
        this.drawTem()
        this.drawHum()
        this.drawSub()
        this.drawRoad()
        this.drawDire()
        this.drawSpeed()
      })
    },
    drawTem() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('temperature'))
      let TP_value = this.Tem
      let kd = []
      let Gradient = []
      let showValue = ''
      // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
      for (let i = 0, len = 135; i <= len; i++) {
        if (i < 10 || i > 130) {
          kd.push('')
        } else {
          if ((i - 10) % 20 === 0) {
            kd.push('-3')
          } else if ((i - 10) % 4 === 0) {
            kd.push('-1')
          } else {
            kd.push('')
          }
        }
      }
      //中间线的渐变色和文本内容
      if (TP_value > 20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 0.5,
            color: '#E4D225'
          },
          {
            offset: 1,
            color: '#E01F28'
          }
        )
      } else if (TP_value > -20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 1,
            color: '#E4D225'
          }
        )
      } else {
        Gradient.push({
          offset: 1,
          color: '#93FE94'
        })
      }
      if (TP_value > 70) {
        showValue = 70
      } else {
        if (TP_value < -50) {
          showValue = -50
        } else {
          showValue = TP_value
        }
      }
      // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
      let option = {
        // backgroundColor: '#062263',
        title: {
          text: '温度计',
          show: false
        },
        yAxis: [
          {
            show: false,
            data: [],
            min: 0,
            max: 135,
            axisLine: {
              show: false
            }
          },
          {
            show: false,
            min: 0,
            max: 50
          }
        ],
        xAxis: [
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -10,
            max: 12
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            // 对应上面XAxis的第一个对)象配置
            xAxisIndex: 0,
            data: [
              {
                value: showValue + 60,
                label: {
                  normal: {
                    show: true,
                    position: 'bottom',
                    formatter: '{back|' + '气温:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
                    rich: {
                      back: {
                        align: 'center',
                        lineHeight: 50,
                        fontSize: 14,
                        fontFamily: 'digifacewide',
                        color: 'white'
                      },
                      unit: {
                        fontFamily: '微软雅黑',
                        fontSize: 10,
                        lineHeight: 50,
                        color: 'white'
                      }
                    }
                  }
                }
              }
            ],
            barWidth: 10, //中间圆柱
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
              }
            },
            z: 2
          },
          {
            name: '白框', //重点
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [134],
            barWidth: 13,
            itemStyle: {
              normal: {
                // color: '#0C2E6D',
                color: 'rgba(6, 34, 99, 0.1)',
                barBorderRadius: 50
              }
            },
            z: 1
          },
          {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [135],
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#4577BA', //可修改
                barBorderRadius: 50
              }
            },
            z: 0
          },
          {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#93FE94', //可修改
                opacity: 1
              }
            },
            z: 2
          },
          {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#0C2E6D',
                opacity: 1
              }
            },
            z: 1
          },
          {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 23,
            itemStyle: {
              normal: {
                color: '#4577BA', //可以修改
                opacity: 1
              }
            },
            z: 0
          },
          {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 0,
            xAxisIndex: 3,
            label: {
              normal: {
                show: true,
                position: 'left',
                distance: 5,
                color: 'white',
                fontSize: 10,
                formatter: function(params) {
                  if (params.dataIndex > 130 || params.dataIndex < 10) {
                    return ''
                  } else {
                    if ((params.dataIndex - 10) % 20 === 0) {
                      return params.dataIndex - 60
                    } else {
                      return ''
                    }
                  }
                }
              }
            },
            barGap: '-100%',
            data: kd,
            barWidth: 1,
            itemStyle: {
              normal: {
                color: 'white',
                barBorderRadius: 120,
                labelLine: '10',
                length: 10
              }
            },
            z: 0
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    drawHum() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('humidity'))
      let TP_value = this.Hum
      let kd = []
      let Gradient = []
      let showValue = ''
      // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
      for (let i = 0, len = 110; i <= len; i++) {
        if (i < 10 || i > 110) {
          kd.push('')
        } else {
          if ((i - 10) % 20 === 0) {
            kd.push('-3')
          } else if ((i - 10) % 4 === 0) {
            kd.push('-1')
          } else {
            kd.push('')
          }
        }
      }
      //中间线的渐变色和文本内容
      if (TP_value > 30) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 0.5,
            color: '#E4D225'
          },
          {
            offset: 1,
            color: '#E01F28'
          }
        )
      } else if (TP_value > 60) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 1,
            color: '#E4D225'
          }
        )
      } else {
        Gradient.push({
          offset: 1,
          color: '#93FE94'
        })
      }
      if (TP_value > 100) {
        showValue = 100
      } else {
        if (TP_value <= 0) {
          showValue = -10
        } else {
          showValue = TP_value
        }
      }
      // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
      let option = {
        // backgroundColor: '#062263',
        title: {
          text: '温度计',
          show: false
        },
        yAxis: [
          {
            show: false,
            data: [],
            min: 0,
            max: 115,
            axisLine: {
              show: false
            }
          },
          {
            show: false,
            min: 0,
            max: 50
          }
        ],
        xAxis: [
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -10,
            max: 12
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            // 对应上面XAxis的第一个对)象配置
            xAxisIndex: 0,
            data: [
              {
                value: showValue + 10,
                label: {
                  normal: {
                    show: true,
                    position: 'bottom',
                    formatter: '{back|' + '湿度:' + TP_value + '}{unit|%}\n{downTxt|' + '}',
                    rich: {
                      back: {
                        align: 'center',
                        lineHeight: 50,
                        fontSize: 14,
                        fontFamily: 'digifacewide',
                        color: 'white'
                      },
                      unit: {
                        fontFamily: '微软雅黑',
                        fontSize: 10,
                        lineHeight: 50,
                        color: 'white'
                      }
                    }
                  }
                }
              }
            ],
            barWidth: 10, //中间圆柱
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
              }
            },
            z: 2
          },
          {
            name: '白框',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [134],
            barWidth: 13,
            itemStyle: {
              normal: {
                // color: '#0C2E6D',
                color: 'rgba(6, 34, 99, 0.1)',
                barBorderRadius: 50
              }
            },
            z: 1
          },
          {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [135],
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#4577BA', //可修改
                barBorderRadius: 50
              }
            },
            z: 0
          },
          {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#93FE94', //可修改
                opacity: 1
              }
            },
            z: 2
          },
          {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#0C2E6D',
                opacity: 1
              }
            },
            z: 1
          },
          {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 23,
            itemStyle: {
              normal: {
                color: '#4577BA', //可以修改
                opacity: 1
              }
            },
            z: 0
          },
          {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 0,
            xAxisIndex: 3,
            label: {
              normal: {
                show: true,
                position: 'left',
                distance: 5,
                color: 'white',
                fontSize: 10,
                formatter: function(params) {
                  if (params.dataIndex > 110 || params.dataIndex < 10) {
                    return ''
                  } else {
                    if ((params.dataIndex - 10) % 20 === 0) {
                      return params.dataIndex - 10
                    } else {
                      return ''
                    }
                  }
                }
              }
            },
            barGap: '-100%',
            data: kd,
            barWidth: 1,
            itemStyle: {
              normal: {
                color: 'white',
                barBorderRadius: 120,
                labelLine: '10',
                length: 10
              }
            },
            z: 0
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    drawSub() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('subgrade'))
      let TP_value = this.Sub
      let kd = []
      let Gradient = []
      let showValue = ''
      // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
      for (let i = 0, len = 135; i <= len; i++) {
        if (i < 10 || i > 130) {
          kd.push('')
        } else {
          if ((i - 10) % 20 === 0) {
            kd.push('-3')
          } else if ((i - 10) % 4 === 0) {
            kd.push('-1')
          } else {
            kd.push('')
          }
        }
      }
      //中间线的渐变色和文本内容
      if (TP_value > 20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 0.5,
            color: '#E4D225'
          },
          {
            offset: 1,
            color: '#E01F28'
          }
        )
      } else if (TP_value > -20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 1,
            color: '#E4D225'
          }
        )
      } else {
        Gradient.push({
          offset: 1,
          color: '#93FE94'
        })
      }
      if (TP_value > 70) {
        showValue = 70
      } else {
        if (TP_value < -50) {
          showValue = -50
        } else {
          showValue = TP_value
        }
      }
      // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
      let option = {
        // backgroundColor: '#062263',
        title: {
          text: '温度计',
          show: false
        },
        yAxis: [
          {
            show: false,
            data: [],
            min: 0,
            max: 135,
            axisLine: {
              show: false
            }
          },
          {
            show: false,
            min: 0,
            max: 50
          }
        ],
        xAxis: [
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -10,
            max: 12
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            // 对应上面XAxis的第一个对)象配置
            xAxisIndex: 0,
            data: [
              {
                value: showValue + 60,
                label: {
                  normal: {
                    show: true,
                    position: 'bottom',
                    formatter: '{back|' + '路基:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
                    rich: {
                      back: {
                        align: 'center',
                        lineHeight: 50,
                        fontSize: 14,
                        fontFamily: 'digifacewide',
                        color: 'white'
                      },
                      unit: {
                        fontFamily: '微软雅黑',
                        fontSize: 10,
                        lineHeight: 50,
                        color: 'white'
                      }
                    }
                  }
                }
              }
            ],
            barWidth: 10, //中间圆柱
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
              }
            },
            z: 2
          },
          {
            name: '白框',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [134],
            barWidth: 13,
            itemStyle: {
              normal: {
                // color: '#0C2E6D',
                color: 'rgba(6, 34, 99, 0.1)',
                barBorderRadius: 50
              }
            },
            z: 1
          },
          {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [135],
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#4577BA', //可修改
                barBorderRadius: 50
              }
            },
            z: 0
          },
          {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#93FE94', //可修改
                opacity: 1
              }
            },
            z: 2
          },
          {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#0C2E6D',
                opacity: 1
              }
            },
            z: 1
          },
          {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 23,
            itemStyle: {
              normal: {
                color: '#4577BA', //可以修改
                opacity: 1
              }
            },
            z: 0
          },
          {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 0,
            xAxisIndex: 3,
            label: {
              normal: {
                show: true,
                position: 'left',
                distance: 5,
                color: 'white',
                fontSize: 10,
                formatter: function(params) {
                  if (params.dataIndex > 130 || params.dataIndex < 10) {
                    return ''
                  } else {
                    if ((params.dataIndex - 10) % 20 === 0) {
                      return params.dataIndex - 60
                    } else {
                      return ''
                    }
                  }
                }
              }
            },
            barGap: '-100%',
            data: kd,
            barWidth: 1,
            itemStyle: {
              normal: {
                color: 'white',
                barBorderRadius: 120,
                labelLine: '10',
                length: 10
              }
            },
            z: 0
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    drawRoad() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('road'))
      let TP_value = this.Road
      let kd = []
      let Gradient = []
      let showValue = ''
      // 刻度使用柱状图模拟，短设置1，长的设置3；构造一个数据
      for (let i = 0, len = 135; i <= len; i++) {
        if (i < 10 || i > 130) {
          kd.push('')
        } else {
          if ((i - 10) % 20 === 0) {
            kd.push('-3')
          } else if ((i - 10) % 4 === 0) {
            kd.push('-1')
          } else {
            kd.push('')
          }
        }
      }
      //中间线的渐变色和文本内容
      if (TP_value > 20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 0.5,
            color: '#E4D225'
          },
          {
            offset: 1,
            color: '#E01F28'
          }
        )
      } else if (TP_value > -20) {
        Gradient.push(
          {
            offset: 0,
            color: '#93FE94'
          },
          {
            offset: 1,
            color: '#E4D225'
          }
        )
      } else {
        Gradient.push({
          offset: 1,
          color: '#93FE94'
        })
      }
      if (TP_value > 70) {
        showValue = 70
      } else {
        if (TP_value < -50) {
          showValue = -50
        } else {
          showValue = TP_value
        }
      }
      // 因为柱状初始化为0，温度存在负值，所以加上负值60和空出距离10
      let option = {
        // backgroundColor: '#062263',
        title: {
          text: '温度计',
          show: false
        },
        yAxis: [
          {
            show: false,
            data: [],
            min: 0,
            max: 135,
            axisLine: {
              show: false
            }
          },
          {
            show: false,
            min: 0,
            max: 50
          }
        ],
        xAxis: [
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -110,
            max: 80,
            data: []
          },
          {
            show: false,
            min: -10,
            max: 12
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            // 对应上面XAxis的第一个对)象配置
            xAxisIndex: 0,
            data: [
              {
                value: showValue + 60,
                label: {
                  normal: {
                    show: true,
                    position: 'bottom',
                    formatter: '{back|' + '路面:' + TP_value + '}{unit|°C}\n{downTxt|' + '}',
                    rich: {
                      back: {
                        align: 'center',
                        lineHeight: 50,
                        fontSize: 14,
                        fontFamily: 'digifacewide',
                        color: 'white'
                      },
                      unit: {
                        fontFamily: '微软雅黑',
                        fontSize: 10,
                        lineHeight: 50,
                        color: 'white'
                      }
                    }
                  }
                }
              }
            ],
            barWidth: 10, //中间圆柱
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)
              }
            },
            z: 2
          },
          {
            name: '白框',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [134],
            barWidth: 13,
            itemStyle: {
              normal: {
                // color: '#0C2E6D',
                color: 'rgba(6, 34, 99, 0.1)',
                barBorderRadius: 50
              }
            },
            z: 1
          },
          {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [135],
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#4577BA', //可修改
                barBorderRadius: 50
              }
            },
            z: 0
          },
          {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#93FE94', //可修改
                opacity: 1
              }
            },
            z: 2
          },
          {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 18,
            itemStyle: {
              normal: {
                color: '#0C2E6D',
                opacity: 1
              }
            },
            z: 1
          },
          {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 23,
            itemStyle: {
              normal: {
                color: '#4577BA', //可以修改
                opacity: 1
              }
            },
            z: 0
          },
          {
            name: '刻度',
            type: 'bar',
            yAxisIndex: 0,
            xAxisIndex: 3,
            label: {
              normal: {
                show: true,
                position: 'left',
                distance: 5,
                color: 'white',
                fontSize: 10,
                formatter: function(params) {
                  if (params.dataIndex > 130 || params.dataIndex < 10) {
                    return ''
                  } else {
                    if ((params.dataIndex - 10) % 20 === 0) {
                      return params.dataIndex - 60
                    } else {
                      return ''
                    }
                  }
                }
              }
            },
            barGap: '-100%',
            data: kd,
            barWidth: 1,
            itemStyle: {
              normal: {
                color: 'white',
                barBorderRadius: 120,
                labelLine: '10',
                length: 10
              }
            },
            z: 0
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    drawDire() {
      let myChart = echarts.init(document.getElementById('direction'))
      let val = this.Dire
      let Gradient = [
        {
          offset: 0,
          color: '#e100ff'
        },
        {
          offset: 0.2,
          color: '#c700ff'
        },
        {
          offset: 0.4,
          color: '#a400ff'
        },
        {
          offset: 0.6,
          color: '#8b00ff'
        },
        {
          offset: 0.8,
          color: '#8500ff'
        },
        {
          offset: 1,
          color: '#7f00ff'
        }
      ]
      let option = {
        // backgroundColor: 'rgba(6,34,99,0.1)',
        color: '#fff',
        tooltip: {
          show: false
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true,
          borderWidth: '0'
        },
        title: {
          text: '瞬时风向：' + val + '°',
          bottom: '0',
          left: 'center',
          textStyle: {
            fontSize: 12,
            color: '#fff'
          }
        },
        series: [
          {
            name: '最外部进度条',
            type: 'gauge',
            radius: '90%',
            startAngle: '90',
            endAngle: '-269.999',
            splitNumber: 12,
            axisLine: {
              lineStyle: {
                color: [
                  [
                    val / 360,
                    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: 'rgba(140,27,255,0)'
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(140,27,255,0.2)'
                      },
                      {
                        offset: 0,
                        color: 'rgba(140,27,255,1)'
                      }
                    ])
                  ],
                  [1, 'rgba(28,128,245,.0)']
                ],
                width: 5
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              show: false
            },
            detail: {
              show: false
            },
            title: {
              //标题
              show: false
            },
            data: [
              {
                value: val
              }
            ],
            pointer: {
              show: false
            },
            animationDuration: 4000
          },
          {
            name: '瞬时风向',
            type: 'gauge',
            radius: '80%',
            startAngle: '90',
            endAngle: '-269.9',
            splitNumber: 12, // 分割段数
            z: 8,
            min: 0,
            max: 360,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, 'yellow']],
                width: 0
              }
            },
            pointer: {
              //指针
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 5, // 每份split细分多少段
              length: 5, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#9a58ff',
                width: 1
              }
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel
              formatter: function(v) {
                v = v.toFixed()
                switch (v + '') {
                  case '0':
                    return '0'
                  case '90':
                    return '90'
                  case '180':
                    return '180'
                  case '270':
                    return '270'
                  case '360':
                    return '0'
                }
              },
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'white',
                fontSize: 10
              }
            },
            splitLine: {
              // 分隔线
              show: true, // 默认显示，属性show控制显示与否
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#9a58ff',
                width: 2
              }
            },
            detail: {
              show: false,
              textStyle: {
                fontSize: '14',
                color: 'white'
              }
            },
            title: {
              show: false
            },
            data: [
              {
                value: val
              }
            ]
          },
          {
            name: '内部阴影',
            type: 'gauge',
            radius: '70%',
            startAngle: '90',
            endAngle: '-269.9',
            z: 4,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [val / 360, new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)],
                  [1, 'rgba(28,128,245,.0)']
                ],
                width: 40,
                opacity: 0.6
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              show: false
            },
            detail: {
              formatter: function(value) {
                if (value !== 0) {
                  return value + '°'
                } else {
                  return 0 + '°'
                }
              },
              offsetCenter: [0, 5],
              textStyle: {
                padding: [0, 0, 5, 0],
                fontSize: 14,
                color: 'white'
              }
            },
            title: {
              show: false
            },
            pointer: {
              show: false
            },
            data: [
              {
                name: 'title',
                value: val
              }
            ]
          },
          {
            name: '内部圆',
            type: 'gauge',
            radius: '84%',
            startAngle: '90',
            endAngle: '-269.9',
            min: 0,
            max: 360,
            splitNumber: 12,
            pointer: {
              //指针
              show: true,
              width: 3,
              length: '80%'
            },
            detail: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, 'yellow']],
                width: 2,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [
              {
                value: val
              }
            ]
          },
          {
            type: 'gauge',
            radius: '82%',
            startAngle: '225',
            endAngle: '-134.99999',
            pointer: {
              show: true,
              color: 'red'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'white',
                width: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: 'white',
                width: 10,
                type: 'solid'
              }
            },
            axisLabel: {
              show: false,
              formatter: function(v) {
                return v.toFixed(0)
              }
            },
            animationDuration: 4000
          },
          {
            type: 'gauge',
            z: 2,
            radius: '80%',
            startAngle: '225',
            endAngle: '-134.99999',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#9a58ff']],
                fontSize: 40,
                width: 1,
                opacity: 1 //刻度背景宽度
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false,
              formatter: function(v) {
                return v.toFixed(0)
              }
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            detail: {
              show: false
            }
          },
          {
            //指针上的圆
            type: 'pie',
            tooltip: {
              show: false
            },
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['0%', '25.5%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 120,
                itemStyle: {
                  normal: {
                    color: '#0053fb'
                  }
                }
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    drawSpeed() {
      let myChart = echarts.init(document.getElementById('speed'))
      let val = this.Speed
      let Gradient = [
        {
          offset: 1,
          color: '#e100ff'
        },
        {
          offset: 0.8,
          color: '#c700ff'
        },
        {
          offset: 0.6,
          color: '#a400ff'
        },
        {
          offset: 0.4,
          color: '#8b00ff'
        },
        {
          offset: 0.2,
          color: '#8500ff'
        },
        {
          offset: 0,
          color: '#7f00ff'
        }
      ]
      let option = {
        // backgroundColor: '#062263',
        color: '#fff',
        tooltip: {
          show: false
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true,
          borderWidth: '0'
        },
        title: {
          text: '瞬时风速：' + val + 'm/s',
          bottom: '0',
          left: 'center',
          textStyle: {
            fontSize: 12,
            color: 'white'
          }
        },
        series: [
          {
            name: '最外部进度条',
            type: 'gauge',
            radius: '90%',
            startAngle: '225',
            endAngle: '-45.999',
            splitNumber: 12,
            axisLine: {
              lineStyle: {
                color: [
                  [
                    val / 25,
                    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: 'rgba(140,27,255,0)'
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(140,27,255,0.2)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(140,27,255,1)'
                      }
                    ])
                  ],
                  [1, 'rgba(28,128,245,.0)']
                ],
                width: 5
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            itemStyle: {
              show: false
            },
            detail: {
              show: false
            },
            title: {
              //标题
              show: false
            },
            data: [
              {
                value: val
              }
            ],
            pointer: {
              show: false
            },
            animationDuration: 4000
          },
          {
            name: '瞬时风速',
            type: 'gauge',
            radius: '80%',
            startAngle: '225',
            endAngle: '-45.999',
            splitNumber: 5, // 分割段数
            z: 8,
            min: 0,
            max: 25,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, 'red']],
                width: 0
              }
            },
            pointer: {
              //指针
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 5, // 每份split细分多少段
              length: 5, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: '#9a58ff',
                width: 1
              }
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel
              formatter: function(v) {
                v = v.toFixed()
                switch (v + '') {
                  case '0':
                    return '0'
                  case '5':
                    return '5'
                  case '10':
                    return '10'
                  case '15':
                    return '15'
                  case '20':
                    return '20'
                  case '25':
                    return '25'
                }
              },
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'white',
                fontSize: 10
              }
            },
            splitLine: {
              // 分隔线
              show: true, // 默认显示，属性show控制显示与否
              length: 8, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#9a58ff',
                width: 2
              }
            },
            detail: {
              show: false,
              textStyle: {
                fontSize: '14',
                color: 'white'
              }
            },
            title: {
              show: false
            },
            data: [
              {
                value: val
              }
            ]
          },
          {
            name: '内部阴影',
            type: 'gauge',
            radius: '70%',
            startAngle: '225',
            endAngle: '-45.999',
            z: 4,
            splitNumber: 5,
            axisLine: {
              lineStyle: {
                color: [
                  [val / 25, new echarts.graphic.LinearGradient(0, 1, 0, 0, Gradient)],
                  [1, 'rgba(28,128,245,.0)']
                ],
                width: 40,
                opacity: 0.6
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            pointer: {
              show: false
            },
            itemStyle: {
              show: false
            },
            detail: {
              formatter: function(value) {
                if (value !== 0) {
                  return value + 'm/s'
                } else {
                  return 0 + 'm/s'
                }
              },
              offsetCenter: [0, 5],
              textStyle: {
                padding: [0, 0, 5, 0],
                fontSize: 14,
                color: 'white'
              }
            },
            title: {
              show: false
            },
            data: [
              {
                name: 'title',
                value: val
              }
            ]
          },
          {
            name: '内部圆-指针',
            type: 'gauge',
            radius: '84%',
            startAngle: '225',
            endAngle: '-45.999',
            min: 0,
            max: 25,
            splitNumber: 5,
            pointer: {
              //指针
              show: true,
              width: 3,
              length: '80%'
            },
            detail: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, 'yellow']],
                width: 2,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [
              {
                value: val
              }
            ]
          },
          {
            type: 'gauge',
            radius: '82%',
            startAngle: '225',
            endAngle: '-134.99999',
            pointer: {
              show: false,
              color: 'red'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'white',
                width: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: 'white',
                width: 10,
                type: 'solid'
              }
            },
            axisLabel: {
              show: false,
              formatter: function(v) {
                return v.toFixed(0)
              }
            },
            animationDuration: 4000
          },
          {
            type: 'gauge',
            z: 2,
            radius: '80%',
            startAngle: '225',
            endAngle: '-134.99999',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#9a58ff']],
                fontSize: 40,
                width: 1,
                opacity: 1 //刻度背景宽度
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false,
              formatter: function(v) {
                return v.toFixed(0)
              }
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            },
            detail: {
              show: false
            }
          },
          {
            //指针上的圆
            type: 'pie',
            tooltip: {
              show: false
            },
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['0%', '25.5%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 120,
                itemStyle: {
                  normal: {
                    color: '#0053fb'
                  }
                }
              }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    mapSize() {
      //地图根据浏览器窗口变化而变化
      let mapHeight = document.getElementById('container')
      let screenHeight = 0
      // 电脑分辨率
      let width = screen.width
      switch (width) {
        case 1440:
        case 1400:
        case 1366:
          // 浏览器高度
          screenHeight = document.body.clientHeight - 40
          window.onresize = () => {
            let Height = document.body.clientHeight - 40
            mapHeight.style.height = Height + 'px'
          }
          break
        default:
          // 浏览器高度
          screenHeight = document.body.clientHeight - 40
          window.onresize = () => {
            let Height = document.body.clientHeight - 40
            mapHeight.style.height = Height + 'px'
          }
          break
      }
      mapHeight.style.height = screenHeight + 'px'
    },
    getSelectData() {
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      // headers['username'] = localStorage.getItem('user_name')
      this.$ajax
        .post('/equip_all_info')
        .then(res => {
          this.opStation = res.data.records
          this.$nextTick(() => {
            this.initMap()
          })
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted() {
    this.getSelectData()
    // this.initMap()
    this.mapSize()
    this.layerData()
  }
}
</script>
<style>
@import url('../../static/css/map_public.css');
</style>
<style scoped="scoped">
@import url('../../static/css/map.css');
</style>
