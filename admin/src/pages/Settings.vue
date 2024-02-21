<template>
  <div v-if="config">
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Настройки</h3>
      </div>
    </div>

    <div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--tabs">
        <div class="kt-portlet__head">
          <div class="kt-portlet__head-toolbar">
            <ul class="nav nav-tabs nav-tabs-line nav-tabs-line-danger nav-tabs-line-2x nav-tabs-line-right" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#site" role="tab" aria-selected="true">
                  Настройки сайта
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#payment" role="tab" aria-selected="true">
                  Настройка оплаты
                </a>
              </li>
            </ul>
          </div>
        </div>
        <form class="kt-form" onclick="return false;">
          <div class="kt-portlet__body">
            <div class="tab-content">
              <div class="tab-pane active" id="site" role="tabpanel">
                <div class="kt-section">
                  <h3 class="kt-section__title">
                    Настройки сайта:
                  </h3>
                  <div class="form-group row">
                    <div class="col-lg-6">
                      <label>Ключ market.csgo:</label>
                      <input type="text" class="form-control" v-model="config.market_csgo.key" name="market_csgo.key">
                    </div>
                    <div class="col-lg-6">
                      <label>Коэффициент максимальной покупки:</label>
                      <input type="text" class="form-control" v-model="config.market_csgo.max_buy_percent" name="market_csgo.max_buy_percent">
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-lg-12">
                      <label>Минимальная сумма для перевода реферального баланса:</label>
                      <input type="number" class="form-control" v-model="config.referral.to_balance" name="referral.to_balance">
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="payment" role="tabpanel">
                <div class="kt-section">
                  <h3 class="kt-section__title">
                    Настройка оплаты:
                  </h3>
                  <div class="form-group row">
                    <div class="col-lg-4">
                      <label>FreeKassa ID:</label>
                      <input type="text" class="form-control" v-model="config.payment.freekassa.id" name="payment.freekassa.id">
                    </div>
                    <div class="col-lg-4">
                      <label>FreeKassa secret 1:</label>
                      <input type="text" class="form-control" v-model="config.payment.freekassa.secret_1" name="payment.freekassa.secret_1">
                    </div>
                    <div class="col-lg-4">
                      <label>FreeKassa secret 2:</label>
                      <input type="text" class="form-control" v-model="config.payment.freekassa.secret_2" name="payment.freekassa.secret_2">
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-lg-6">
                      <label>Unitpay Public Key:</label>
                      <input type="text" class="form-control" v-model="config.payment.unitpay.public_key" name="payment.unitpay.public_key">
                    </div>
                    <div class="col-lg-6">
                      <label>Unitpay Secret Key:</label>
                      <input type="text" class="form-control" v-model="config.payment.unitpay.secret_key" name="payment.unitpay.secret_key">
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-lg-6">
                      <label>Минимальная сумма пополнения:</label>
                      <input type="number" class="form-control" v-model="config.payment.min" name="payment.min">
                    </div>
                    <div class="col-lg-6">
                      <label>Максимальная сумма пополнения:</label>
                      <input type="number" class="form-control" v-model="config.payment.max" name="payment.max">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="kt-portlet__foot">
            <div class="kt-form__actions">
              <button type="submit" class="btn btn-primary" v-on:click="save">Сохранить</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: null,
      oldConfig: null,
      mailing: null
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.$root.request('GET', `/admin/config`)
          .then((config) => {
            this.config = config
            this.oldConfig = config
          })
          .catch(() => {
            this.$router.back()
          })
    },
    save() {
      this.$root.request('POST', '/admin/config/save', {
        config: this.config,
        mailing: this.mailing
      })
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Настройки сохранены'
            })
          })
          .catch((e) => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    }
  }
}
</script>
