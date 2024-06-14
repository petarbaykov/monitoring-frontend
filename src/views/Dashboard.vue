<template>
  <div class="container">
    <Navbar />
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <form @submit.prevent="submitForm" class="form-container">
        <div>
          <label for="url">URL:</label>
          <input type="text" v-model="form.url" />
        </div>
        <div>
          <label for="method">Method:</label>
          <select v-model="form.method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>
        <div>
          <label for="interval">Interval (ms):</label>
          <input type="number" v-model="form.interval" />
        </div>
        <div class="form-buttons">
          <button type="submit">{{ editMode ? 'Update Endpoint' : 'Add Endpoint' }}</button>
          <button v-if="editMode" @click="cancelEdit" type="button">Cancel</button>
        </div>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
      <ul class="endpoints-list">
        <li v-for="endpoint in endpoints" :key="endpoint.id">
          <span @click="fetchMetrics(endpoint.id)">
            {{ endpoint.url }} ({{ endpoint.method }})
          </span>
          <div class="endpoint-buttons">
            <button @click="editEndpoint(endpoint)" class="edit-button">Edit</button>
            <button @click="deleteEndpoint(endpoint.id)" class="delete-button">Delete</button>
          </div>
        </li>
      </ul>
      <chart-component v-if="metrics" :response-time-data="responseTimeData" :status-code-data="statusCodeData"></chart-component>
      <hourly-charts v-if="hourlyMetrics" :hourly-metrics="hourlyMetrics"></hourly-charts>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import ChartComponent from '@/components/ChartComponent.vue';
import HourlyCharts from '@/components/HourlyCharts.vue';

export default {
  components: {
    Navbar,
    ChartComponent,
    HourlyCharts
  },
  data() {
    return {
      form: {
        id: null,
        url: '',
        method: 'GET',
        interval: 60000
      },
      editMode: false,
      error: '',
      metrics: null,
      hourlyMetrics: null
    };
  },
  computed: {
    endpoints() {
      return this.$store.state.endpoints;
    },
    responseTimeData() {
      return {
        labels: this.metrics ? this.metrics.map(metric => new Date(metric.createdAt).toLocaleTimeString()) : [],
        datasets: [{
          label: 'Response Time (ms)',
          data: this.metrics ? this.metrics.map(metric => metric.responseTime) : [],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    },
    statusCodeData() {
      if (!this.metrics) return { labels: [], datasets: [] };
      const statusCounts = this.metrics.reduce((acc, metric) => {
        acc[metric.statusCode] = (acc[metric.statusCode] || 0) + 1;
        return acc;
      }, {});

      return {
        labels: Object.keys(statusCounts),
        datasets: [{
          label: 'Status Codes',
          data: Object.values(statusCounts),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      };
    }
  },
  methods: {
    submitForm() {
      if (this.editMode) {
        this.$store.dispatch('updateEndpoint', this.form).then(() => {
          this.resetForm();
        }).catch(err => {
          this.error = err.response.data.error || 'Failed to update endpoint';
        });
      } else {
        this.$store.dispatch('addEndpoint', this.form).then(() => {
          this.resetForm();
        }).catch(err => {
          this.error = err.response.data.error || 'Failed to add endpoint';
        });
      }
    },
    editEndpoint(endpoint) {
      this.form = { ...endpoint };
      this.editMode = true;
    },
    deleteEndpoint(endpointId) {
      this.$store.dispatch('deleteEndpoint', endpointId).catch(err => {
        this.error = err.response.data.error || 'Failed to delete endpoint';
      });
    },
    fetchMetrics(endpointId) {
      this.$store.dispatch('fetchMetrics', endpointId).then(() => {
        this.metrics = this.$store.state.metrics[endpointId];
      }).catch(err => {
        console.error(err);
      });
      this.$store.dispatch('fetchHourlyMetrics', endpointId).then(() => {
        this.hourlyMetrics = this.$store.state.hourlyMetrics[endpointId];
      }).catch(err => {
        console.error(err);
      });
    },
    resetForm() {
      this.form = {
        id: null,
        url: '',
        method: 'GET',
        interval: 60000
      };
      this.editMode = false;
    },
    cancelEdit() {
      this.resetForm();
    }
  },
  created() {
    this.$store.dispatch('fetchEndpoints').catch(err => {
      console.error(err);
    });
  }
};
</script>

<style scoped>
.container {
  width: 80%;
  margin: auto;
  overflow: hidden;
}

.dashboard-container {
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-top: 20px;
}

h1 {
  text-align: center;
}

.form-container {
  margin-bottom: 20px;
}

.form-container div {
  margin-bottom: 10px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.endpoints-list {
  list-style-type: none;
  padding: 0;
}

.endpoints-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.endpoints-list li span {
  cursor: pointer;
}

.endpoint-buttons {
  display: flex;
}

.endpoint-buttons button {
  margin-left: 10px;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #ff4d4d;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #ff1a1a;
}

.chart {
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
