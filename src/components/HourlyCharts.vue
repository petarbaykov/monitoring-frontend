<template>
  <div>
    <canvas id="statusCodeChart"></canvas>
    <canvas id="responseTimeChart"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  props: ['hourlyMetrics'],
  data() {
    return {
      statusCodeChart: null,
      responseTimeChart: null,
    }
  },
  watch: {
    hourlyMetrics: {
      handler() {
        // this.renderStatusCodeChart();
        // this.renderResponseTimeChart();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    renderStatusCodeChart() {
      if (this.statusCodeChart) {
        this.statusCodeChart.destroy();
      }

      const groupedData = this.groupDataByStatusCode();
      const labels = Object.keys(groupedData[Object.keys(groupedData)[0]]).sort();

      const datasets = Object.keys(groupedData).map(statusCode => ({
        label: `Status Code ${statusCode}`,
        data: labels.map(label => groupedData[statusCode][label] || 0),
        borderColor: this.getRandomColor(),
        fill: false
      }));

      const ctx = document.getElementById('statusCodeChart').getContext('2d');
      this.statusCodeChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Hourly Status Codes'
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
                tooltipFormat: 'll HH:mm'
              },
              scaleLabel: {
                display: true,
                labelString: 'Time'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Count'
              }
            }]
          }
        }
      });
    },
    renderResponseTimeChart() {
      if (this.responseTimeChart) {
        this.responseTimeChart.destroy();
      }

      const labels = this.hourlyMetrics.map(metric => metric.hour);
      const data = this.hourlyMetrics.map(metric => metric.averageResponseTime);

      const ctx = document.getElementById('responseTimeChart').getContext('2d');
      this.responseTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Average Response Time (ms)',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Hourly Average Response Time'
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'hour',
                tooltipFormat: 'll HH:mm'
              },
              scaleLabel: {
                display: true,
                labelString: 'Time'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Response Time (ms)'
              }
            }]
          }
        }
      });
    },
    groupDataByStatusCode() {
      const grouped = {};

      this.hourlyMetrics.forEach(metric => {
        const hour = metric.hour;
        const statusCode = metric.statusCode;
        if (!grouped[statusCode]) {
          grouped[statusCode] = {};
        }
        grouped[statusCode][hour] = metric.count;
      });

      return grouped;
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  },
  mounted() {
    this.renderStatusCodeChart();
    this.renderResponseTimeChart();
  },
  beforeDestroy() {
    if (this.statusCodeChart) {
      this.statusCodeChart.destroy();
    }
    if (this.responseTimeChart) {
      this.responseTimeChart.destroy();
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  margin-top: 20px;
}
</style>
