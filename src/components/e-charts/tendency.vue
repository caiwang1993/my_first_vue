<template>
  <div
    class="line1">
    <div
      id="line1"
      class=""
      style="width:90%;height: 450px">
      1313
    </div>
  </div>
</template>
<script>
  //引入echarts主模块
  import echarts from 'echarts/lib/echarts'
  //引入柱状图
  import 'echarts/lib/chart/bar';
  //引入线形图
  import 'echarts/lib/chart/line';
  //图表标题
  import 'echarts/lib/component/title'
  //图表的图例组件
  import 'echarts/lib/component/legend'
  //图表的工具箱
  import 'echarts/lib/component/toolbox'
  //图表的注标
  import 'echarts/lib/component/markPoint'
  //图标的提示框组件
  import 'echarts/lib/component/tooltip'
  export default{
    mounted(){
      //初始化echarts实例
      this.myChart = echarts.init(document.getElementById("line1"));
      this.initData();
    },
    props: ['sevenDate', 'sevenDay'],
    methods: {
      initData(){
        console.log(this.sevenDay)
        const colors = ['#5793f3', '#675bba', '#d14a61'];
        const option = {
          color: colors,
          title: {
            text: '走势图',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['新注册用户', '新增订单', '新增管理员']
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {
                readOnly: false
              },
              magicType: {
                type: ['bar', 'line']
              },
              restore: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.sevenDay
          },
          yAxis: [{
            type: 'value',
            name: '用户',
            min: 0,
            max: 200,
            position: 'left',
            axisLine: {
              lineStyle: {color: "#999999"}
            },
            axisLabel: {
              formatter: '{value}'
            }

          },
            {
              type: 'value',
              name: '订单',
              min: 0,
              max: 200,
              position: 'right',
              axisLine: {
                lineStyle: {
                  color: '#999'
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '新注册用户',
              type: 'line',
              data: this.sevenDate[0],
              yAxisIndex: 1,
              markPoint: {
                data: [{
                  type: 'max',
                  name: '最大值'
                }, {
                  type: 'min',
                  name: '最小值'
                }]
              }
            },
            {
              name: '新增订单',
              type: 'line',
              data: this.sevenDate[1],
              yAxisIndex: 1,
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: '最大值'
                  },
                  {
                    type: 'min',
                    name: '最小值'
                  }
                ]
              },
            },
            {
              name: '新增管理员',
              type: 'line',
              data: this.sevenDate[2],
              yAxisIndex: 1,
              markPoint: {
                data: [
                  {
                    type: 'max',
                    name: '最大值'
                  },
                  {
                    type: 'min',
                    name: '最小值'
                  }
                ]
              },
            }
          ]
        };
        this.myChart.setOption(option)
      }
    },
    watch:{
      sevenDate:function () {
        this.initData()
      },
      sevenDay:function () {
        this.initData()
      }
    }
  }
</script>
<style
  lang="less">
  @import '../../style/mixin';

  .line1 {
    display: flex;
    justify-content: center;
  }
</style>
