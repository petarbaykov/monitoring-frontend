<template>
  <div class="charts-container">
    <h2>Hourly Metrics for Last 24 Hours</h2>
    <div class="chart">
      <h3>Status Codes Count</h3>
      <line-chart :chart-data="statusCodeCountData"></line-chart>
    </div>
    <div class="chart">
      <h3>Average Response Time</h3>
      <line-chart :chart-data="averageResponseTimeData"></line-chart>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

export default {
  components: {
    LineChart: Line
  },
  props: {
    hourlyMetrics: {
      type: Array,
      required: true
    }
  },
  computed: {
    statusCodeCountData() {
      const labels = this.hourlyMetrics.map(metric => metric.hour);
      const data = this.hourlyMetrics.map(metric => metric.count);

      return {
        labels,
        datasets: [
          {
            label: 'Status Codes Count',
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };
    },
    averageResponseTimeData() {
      const labels = this.hourlyMetrics.map(metric => metric.hour);
      const data = this.hourlyMetrics.map(metric => metric.averageResponseTime);

      return {
        labels,
        datasets: [
          {
            label: 'Average Response Time (ms)',
            data,
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      };
    }
  }
};
</script>

<style scoped>
.charts-container {
  margin-top: 20px;
}

.chart {
  margin-bottom: 40px;
}
</style>
