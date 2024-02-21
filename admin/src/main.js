import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import router from "@/router"
import App from './App.vue'
import datef from 'datef'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueCookie)

axios.defaults.baseURL = `${process.env.VUE_APP_BACKEND_URL}`

new Vue({
  data() {
    return {
      user: null
    }
  },
  created() {
    if (this.$cookie.get('token')) {
      this.getUser();
    } else {
      this.redirectToFrontend()
    }
  },
  methods: {
    async getUser() {
      this.request(
          'POST',
          `/graphql`,
          {"query":"{currentUser {id, username, avatar, balance, trade_url, opened, role, referral_code, referral_lvl, referral_sum, referral_balance, referral_payment, referral_invited, bestDrop { box { name }}} }"}
      )
        .then((data) => {
          const user = data.currentUser

          if (user.role !== 'admin' && user.role !== 'moderator') {
            return this.redirectToFrontend()
          }

          this.user = user
        })
        .catch(() => {
          this.redirectToFrontend()
        })
    },
    async redirectToFrontend() {
      document.location.href = process.env.VUE_APP_FRONTEND_URL
    },
    async request(type, uri, data = {}) {
      if (this.$cookie.get('token')) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$cookie.get('token');
      }

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (res, rej) => {
        try {
          let result;

          if (uri.indexOf('graphql') === -1) {
            uri = `/api${uri}`
          }

          if (type === 'POST') {
            result = await this.$root.axios.post(uri, data)
          } else {
            result = await this.$root.axios.get(uri, {params: data})
          }

          if (typeof result.data.errors !== "undefined") {
            return rej(result.data.errors)
          }

          if (uri.indexOf('graphql') > -1) {
            return res(result.data.data);
          } else {
            return res(result.data);
          }
        } catch (e) {
          if (typeof e.response !== "undefined" && typeof e.response.data.message !== "undefined") {
            return rej(e.response.data.message);
          } else {
            return rej(false);
          }
        }
      });
    },
    parseDate(date) {
      return datef('HH:mm dd.MM.YYYY', date)
    }
  },
  render: h => h(App),
  router
}).$mount('#app')
