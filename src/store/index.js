import { createStore } from 'vuex';
import api from '../api/index';

export default createStore({
  state: {
    user: null,
    endpoints: [],
    metrics: {},
    hourlyMetrics: {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setEndpoints(state, endpoints) {
      state.endpoints = endpoints;
    },
    setMetrics(state, { endpointId, metrics }) {
      state.metrics[endpointId] = metrics;
    },
    setHourlyMetrics(state, { endpointId, hourlyMetrics }) {
      state.hourlyMetrics[endpointId] = hourlyMetrics;
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await api.get('/api/me');
        commit('setUser', data.username);
      } catch (error) {
        commit('setUser', null);
      }
    },
    async register({ dispatch }, credentials) {
      await api.post('/api/register', credentials);
      await dispatch('login', credentials);
    },
    async login({ commit }, credentials) {
      const { data } = await api.post('/api/login', credentials);
      commit('setUser', data.username);
    },
    async logout({ commit }) {
      await api.get('/api/logout');
      commit('setUser', null);
    },
    async fetchEndpoints({ commit }) {
      const { data } = await api.get('/api/endpoints');
      commit('setEndpoints', data);
    },
    async fetchMetrics({ commit }, endpointId) {
      const { data } = await api.get(`/api/metrics/${endpointId}`);
      commit('setMetrics', { endpointId, metrics: data });
    },
    async fetchHourlyMetrics({ commit }, endpointId) {
      const { data } = await api.get(`/api/metrics/${endpointId}/last24hours`);
      commit('setHourlyMetrics', { endpointId, hourlyMetrics: data });
    },
    async addEndpoint({ dispatch }, endpoint) {
      await api.post('/api/endpoints', endpoint);
      await dispatch('fetchEndpoints');
    },
    async updateEndpoint({ dispatch }, endpoint) {
      await api.put(`/api/endpoints/${endpoint.id}`, endpoint);
      await dispatch('fetchEndpoints');
    },
    async deleteEndpoint({ dispatch }, endpointId) {
      await api.delete(`/api/endpoints/${endpointId}`);
      await dispatch('fetchEndpoints');
    }
  },
  getters: {
    isAuthenticated: state => !!state.user
  }
});
