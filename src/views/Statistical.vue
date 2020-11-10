<template>
  <div>
    <span class="demonstration">选择日期：</span>
    <el-date-picker
      v-model="time"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
    >
    </el-date-picker>
    <span class="demonstration">站台配置：</span>
    <el-select v-model="eid" @change="selectStation" placeholder="请选择台站">
      <el-option v-for="item in stations" :key="item.key" :label="item.value" :value="item.key">
      </el-option>
    </el-select>
    <span class="demonstration">要素配置：</span>
    <el-select v-model="feature_filter" @change="selectStations" placeholder="请选择台站">
      <el-option v-for="item in elements" :key="item.key" :label="item.value" :value="item.key">
      </el-option>
    </el-select>
    <el-button
      type="primary"
      style="font-size: 16px; width: 84px;border-radius: 5px;"
      @click="Inquire"
      >查询</el-button
    >
    <div>
      <div id="visi_tu" class="kEchars" style="height: 60vh;width: 87vw;"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      elements: [],
      stations: [],
      time: '',
      eid: '', //台站
      feature_filter: '' //要素
    }
  },
  watch: {},
  methods: {
    selectStation(val) {
      this.eid = val
    },
    selectStations(val) {
      this.feature_filter = val
    },
    Inquire() {
      // 查询
      let headers = this.$ajax.defaults.headers.common
      headers['token'] = localStorage.getItem('token')
      this.$ajax
        .post('/line_data', {
          eid: this.eid,
          start_time: this.time[0],
          end_time: this.time[1] + 86400000,
          column: this.feature_filter
        })
        .then(res => {
          let Data = res.data
          //   console.log(data)
          this.$nextTick(() => {
            this.drawVisi_Tu(Data)
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    drawVisi_Tu(Data) {
      let myChart = echarts.init(document.getElementById('visi_tu'))
      let colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      let max_visi = Math.max(...Data.data) + Math.max(...Data.data) * 0.01
      let min_visi = Math.min(...Data.data) - Math.min(...Data.data) * 0.01
      let option = {
        title: {
          show: false,
          text: '数据统计',
          textStyle: {
            fontSize: 16,
            fontWeight: 400,
            color: '#556677'
          },
          left: 'center'
          // top: '5%'
        },
        legend: {
          icon: 'circle',
          top: '5%',
          right: '5%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#556677'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              show: true,
              backgroundColor: '#fff',
              color: '#556677',
              borderColor: 'rgba(0,0,0,0)',
              shadowColor: 'rgba(0,0,0,0)',
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 1
            }
          },
          backgroundColor: '#fff',
          textStyle: {
            color: '#556677'
          },
          padding: [10, 10],
          extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
        },
        grid: {
          top: '15%'
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            filterMode: 'empty',
            textStyle: {
              color: '#556677'
            }
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 1,
            end: 35
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: Data.time,
            axisLine: {
              lineStyle: {
                color: '#556677'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // 修改步长
              interval: 'auto',
              textStyle: {
                color: '#556677'
              },
              fontSize: 12,
              margin: 10
            },
            axisPointer: {
              label: {
                padding: [0, 0, 2, 0],
                margin: 10,
                fontSize: 12,
                backgroundColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#fff' // 0% 处的颜色
                    },
                    {
                      offset: 0.86,
                      color: '#fff' // 0% 处的颜色
                    },
                    {
                      offset: 0.86,
                      color: '#33c0cd' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#33c0cd' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: Math.floor(min_visi),
            max: Math.ceil(max_visi),
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#556677'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              }
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            position: 'right',
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#556677'
              },
              formatter: '{value}'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#556677'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '数据',
            type: 'line',
            data: Data.data,
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 5,
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#9effff'
                },
                {
                  offset: 1,
                  color: '#9E87FF'
                }
              ]),
              shadowColor: 'rgba(158,135,255, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 20
            },
            itemStyle: {
              normal: {
                color: colorList[0],
                borderColor: colorList[0]
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      window.onresize = myChart.resize
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
  }
}
</script>

<style scoped></style>
