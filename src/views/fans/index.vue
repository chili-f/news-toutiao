<template>
  <div class="fans-container">
    <!-- 1、为ECharts准备一个具备大小（宽高）的Dom -->
    <div ref="main" style="width: 800px;height:500px;"></div>
  </div>
</template>

<script>
//2、加载echarts
import * as echarts from 'echarts';
export default {
  data() {
    return {
    
    }
  },
  mounted() {
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '粉丝管理'
      },
      tooltip: {},
      legend: {
        data: ['粉丝数']
      },
      xAxis: {
        data: ["lili", "anan", "jin", "lina", "sansi", "simo"]
      },
      yAxis: {},
      series: [{
        name: '数量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
  }
}
</script>

<style>
</style>