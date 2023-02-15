<template>
  <div class="EchartPractice">
    <h1 class="home_title">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click="getPreYearDate"
        >上一年</el-button
      >
      &ensp;&ensp;&ensp;&ensp;
      <span>{{ year }}</span>
      <span>年会员数量</span>
      &ensp;&ensp;&ensp;&ensp;
      <el-button type="primary" @click="getNextYearDate"
        >下一年 <i class="el-icon-arrow-left el-icon--right"></i
      ></el-button>
    </h1>
    <div id="main"></div>
  </div>
</template>

<script>
import studentApi from "../../api/student";

export default {
  name: "EchartPractive",
  data() {
    return {
      year: 2021,
    };
  },

  components: {},
  mounted() {
    this.drawChart();
  },
  methods: {
    getPreYearDate() {
      this.year--;
      this.drawChart();
    },
    getNextYearDate() {
      this.year++;
      this.drawChart();
    },
    drawChart() {
      studentApi.getStudentListForMonth(this.year).then((response) => {
        const resp = response.data;
        if (resp.status == 0) {
          var chartDom = document.getElementById("main");
          var myChart = this.$echarts.init(chartDom);
          var option;
          let dataArr = [0];
          if (resp.data && resp.data.length) {
            resp.data.forEach((item) => {
              dataArr[item._id - 1] = item.count;
            });
          } else {
            this.$message({
              message: "当前年份无数据",
              type: "warning",
              duration: 5000,
            });
          }

          option = {
            xAxis: {
              type: "category",
              data: [
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
              ],
            },
            yAxis: {
              type: "value",
            },
            series: [
              {
                data: dataArr,
                type: "bar",
              },
            ],
          };

          option && myChart.setOption(option);
        }
        // let myChart = this.$echarts.init(document.getElementById("main"));
      });
    },
  },
};
</script>

<style scoped>
#main {
  width: 100%;
  height: 70vh;
  margin: 100 auto 0;
}
.home_title {
  text-align: center;
}
.home_title span {
  vertical-align: bottom;
}
</style>