<template>
  <div
    class="visitorpie">
    <div id="visitorpie" style="width: 90%;height:450px;">
    </div>
  </div>
</template>
<script>
  //引入echarts主模块
  import echarts from 'echarts/lib/echarts'

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

  import 'echarts/lib/chart/pie';
  export default{
    mounted(){
      //初始化echarts实例
      this.myChart = echarts.init(document.getElementById("visitorpie"));
      this.initData();
    },
    props: ['pieData'],
    methods: {
      initData(){
        console.log(this.pieData)
        const option = {
          title : {
            text: '用户分布',
            subtext: '',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['北京','上海','深圳','杭州','其他']
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value:this.pieData.beijing, name:'北京'},
                {value:this.pieData.shanghai, name:'上海'},
                {value:this.pieData.shenzhen, name:'深圳'},
                {value:this.pieData.hangzhou, name:'杭州'},
                {value:this.pieData.qita, name:'其他'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        this.myChart.setOption(option)
      }
    },
    watch:{
      pieData:function () {
        this.initData()
      }
    }
  }
</script>
<style
  lang="less">
  @import '../../style/mixin';

  .visitorpie {
    display: flex;
    justify-content: center;
    padding: 20px;
  }
</style>
