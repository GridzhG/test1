<template>
  <div v-if="user">
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Редактирование пользователя</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid">
      <div class="row">
        <div class="col-xl-4">
          <div class="kt-portlet kt-portlet--fit kt-portlet--head-lg kt-portlet--head-overlay">
            <div class="kt-portlet__head kt-portlet__space-x">
              <div class="kt-portlet__head-label" style="width: 100%;">
                <h3 class="kt-portlet__head-title text-center" style="width: 100%;">
                  {{ user.username }}
                </h3>
              </div>
            </div>
            <div class="kt-portlet__body">
              <div class="kt-widget28">
                <div class="kt-widget28__visual"
                     :style="'background: url('+user.avatar+') bottom center no-repeat'"></div>
                <div class="kt-widget28__wrapper kt-portlet__space-x">
                  <div class="tab-content">
                    <div id="menu11" class="tab-pane active">
                      <div class="kt-widget28__tab-items">
                        <div class="kt-widget12">
                          <div class="kt-widget12__content">
                            <div class="kt-widget12__item">
                              <div class="kt-widget12__info text-center">
                                <span class="kt-widget12__desc">Профит</span>
                                <span class="kt-widget12__value">{{ user.profit }} <i class="la la-rub"></i></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-8">
          <div class="kt-portlet">
            <div class="kt-portlet__head">
              <div class="kt-portlet__head-label">
                <h3 class="kt-portlet__head-title">
                  Информация о пользователе
                </h3>
              </div>
            </div>
            <form class="kt-form" v-on:submit="save" onsubmit="return false;">
              <div class="kt-portlet__body">
                <div class="form-group row">
                  <div class="col-lg-6">
                    <label>Имя:</label>
                    <input type="text" class="form-control" v-model="user.username">
                  </div>
                  <div class="col-lg-6">
                    <label>SteamID64:</label>
                    <input type="text" class="form-control" v-model="user.steamId" disabled>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-6">
                    <label>Ссылка на обмен:</label>
                    <input type="text" class="form-control" v-model="user.trade_url">
                  </div>
                  <div class="col-lg-6">
                    <label>Профиль STEAM:</label>
                    <div class="kt-input-icon">
                      <input type="text" class="form-control"
                             :value="'https://steamcommunity.com/profiles/'+user.steamId+'/'" disabled>
                      <span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i
                          class="la la-steam"></i></span></span>
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-6">
                    <label>Баланс:</label>
                    <div class="kt-input-icon">
                      <input type="text" class="form-control" v-model="user.balance">
                      <span class="kt-input-icon__icon kt-input-icon__icon--right"><span><i
                          class="la la-rub"></i></span></span>
                    </div>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-12">
                    <label>Роль:</label>
                    <select class="form-control" v-model="user.role">
                      <option :selected="user.role === 'user'" value="user">Пользователь</option>
                      <option :selected="user.role === 'admin'" value="admin">Администратор</option>
                      <option :selected="user.role === 'bot'" value="bot">Администратор</option>
                    </select>
                  </div>
                </div>

                <div class="kt-portlet__foot kt-portlet__foot--solid">
                  <div class="kt-form__actions">
                    <div class="row">
                      <div class="col-12">
                        <button type="submit" class="btn btn-brand">Сохранить</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список открытий
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="opens">
            <thead>
            <tr>
              <th>ID</th>
              <th>Кейс</th>
              <th>Предмет</th>
              <th>Стоимость кейса</th>
              <th>Стоимость предмета</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список выводов
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="withdraws">
            <thead>
            <tr>
              <th>ID</th>
              <th>Предмет</th>
              <th>Стоимость предмета</th>
              <th>Статус</th>
              <th>Ошибка</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="withdraw in info.withdraws" :key="withdraw.id">
              <td>{{ withdraw.id }}</td>
              <td>{{ withdraw.item.market_hash_name }}</td>
              <td>{{ withdraw.price }}</td>
              <td v-if="withdraw.status === 0">Ожидает</td>
              <td v-if="withdraw.status === 1"><span style="color: green">Выведено</span></td>
              <td v-if="withdraw.status === 2"><span style="color: red">Ошибка</span></td>
              <td>{{ withdraw.error_msg }}</td>
              <td>{{ $root.parseDate(withdraw.created_at) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список пополнений
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="payments">
            <thead>
            <tr>
              <th>ID</th>
              <th>Сумма</th>
              <th>Промокод</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="payment in info.payments" :key="payment.id">
              <td>{{ payment.id }}</td>
              <td>{{ payment.sum }}</td>
              <td v-if="payment.promo === null"></td>
              <td v-else>{{ payment.promo.name }} ({{ payment.promo.value }}%)</td>
              <td>{{ $root.parseDate(payment.created_at) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список бустов
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="contracts">
            <thead>
            <tr>
              <th>ID</th>
              <th>Предметы</th>
              <th>Сумма предметов</th>
              <th>Выигрыш</th>
              <th>Сумма выигрыша</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="inv in info.contracts" :key="inv.id">
              <td>{{ inv.id }}</td>
              <td>
                <span v-for="item of inv.items" :key="item.id" class="kt-widget3__username">
                  <b>{{ item.item.market_name }}</b> |
                </span>
              </td>
              <td>
                {{ inv.sum }}
              </td>
              <td><b>{{ inv.winItem.market_hash_name }}</b></td>
              <td>{{ inv.winItem.price }}</td>
              <td>
                {{ $root.parseDate(inv.created_at) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список апгрейдов
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="upgrades">
            <thead>
            <tr>
              <th>ID</th>
              <th>Предмет</th>
              <th>Сумма предметов</th>
              <th>Выигрыш</th>
              <th>Сумма выигрыша</th>
              <th>Дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="inv in info.upgrades" :key="inv.id">
              <td>{{ inv.id }}</td>
              <td>
                <span class="kt-widget3__username">
                  <b>{{ inv.item.market_hash_name }}</b>
                </span>
              </td>
              <td>
                {{ inv.item.price }}
              </td>
              <td v-if="inv.winItem === null"></td>
              <td v-else><b>{{ inv.winItem.market_hash_name }}</b></td>

              <td v-if="inv.winItem === null"></td>
              <td v-else>{{ inv.winItem.price }}</td>
              <td>
                {{ $root.parseDate(inv.created_at) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      info: {}
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    async getUser()  {
      this.$root.request('GET', `/admin/user/${this.$route.params.id}`)
          .then((data) => {
            this.user = data.user
            this.info = data.info

            this.$nextTick(() => {
              this.loadOpens()

              $('#withdraws').dataTable().fnDestroy();
              $('#withdraws').DataTable({
                "order": [[ 0, "desc" ]]
              })

              $('#payments').dataTable().fnDestroy();
              $('#payments').DataTable({
                "order": [[ 0, "desc" ]]
              })

              $('#contracts').dataTable().fnDestroy();
              $('#contracts').DataTable({
                "order": [[ 0, "desc" ]]
              })

              $('#upgrades').dataTable().fnDestroy();
              $('#upgrades').DataTable({
                "order": [[ 0, "desc" ]]
              })
            })
          })
          .catch(() => {
            this.$router.back()
          })
    },
    async save() {
      this.$root.request('POST', `/admin/user/${this.$route.params.id}`, {
        user: this.user
      })
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Информация обновлена'
            })
          })
          .catch((e) => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    async loadOpens() {
      const app =  this;
      const table = $('#opens');

      table.dataTable().fnDestroy();

      table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        ajax: {
          url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/opens_users/${this.user.id}`,
          type: "GET",
          headers: {
            "Authorization": `Bearer ${this.$cookie.get('token')}`
          }
        },
        "aaSorting": [[0, 'DESC']],
        columns: [
          { data: "id", searchable: true },
          { data: "box.name", searchable: true },
          { data: "item.market_hash_name", searchable: true },
          { data: "box.price", searchable: true },
          { data: "item.price", searchable: true },
          { data: "created_at", searchable: true,
            render: function (data, type, row) {
              return app.$root.parseDate(row.created_at)
            }
          },
        ],
        "language": {
          "processing": "Подождите...",
          "search": "Поиск:",
          "lengthMenu": "Показать _MENU_ записей",
          "info": "Записи с _START_ по _END_ из _TOTAL_ записей",
          "infoEmpty": "Записи с 0 до 0 из 0 записей",
          "infoFiltered": "(отфильтровано из _MAX_ записей)",
          "infoPostFix": "",
          "loadingRecords": "Загрузка записей...",
          "zeroRecords": "Записи отсутствуют.",
          "emptyTable": "В таблице отсутствуют данные",
          "paginate": {
            "first": "Первая",
            "previous": "Предыдущая",
            "next": "Следующая",
            "last": "Последняя"
          },
          "aria": {
            "sortAscending": ": активировать для сортировки столбца по возрастанию",
            "sortDescending": ": активировать для сортировки столбца по убыванию"
          }
        }
      });

      $(document).on('click', '.editUser', function() {
        app.edit($(this).attr('data-id'));
      });
    }
  },
}
</script>