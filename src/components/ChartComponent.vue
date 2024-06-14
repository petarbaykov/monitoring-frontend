<template>
  <div>
    <h2>Response Time Chart</h2>
    <line-chart :chart-data="responseTimeData"></line-chart>
    <h2>Status Code Chart</h2>
    <bar-chart :chart-data="statusCodeData"></bar-chart>
  </div>
</template>

<script>
import { Line, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement);

export default {
  components: {
    LineChart: Line,
    BarChart: Bar
  },
  props: {
    responseTimeData: {
      type: Object,
      required: true
    },
    statusCodeData: {
      type: Object,
      required: true
    }
  }
};
</script>
