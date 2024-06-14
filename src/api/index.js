import axios from 'axios';

const instance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000',
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET,POST",
    "X-Auth-Token":
      "Rc47n1kl63a8C/MVboKaPaGxA0Czu-SsVh3RWRqiJ8AEiGFHA?iwa6EkDZ68lzWLO1R4ZtjQHZr!V5K1D-DD-1-V98MM!R7FY4IQqt0utKmb!mq75wL-L?!R9unu0p=8TveWsjQOTVobRSI5h?LQsHPi/nQetMhTWurlrWEfnrFPmqQGIY9nO/F=!r?aCDwuLF8?j/?GPaixACyTXhwBcW5prd6YgMRIvldaVBn-xJDcuIMewuVCDnzPUzz9pzSF",
  },
});

export default instance;