<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Розыгрыши</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список розыгрышов
            </h3>
          </div>
          <div class="kt-portlet__head-toolbar">
            <div class="kt-portlet__head-wrapper">
              <div class="kt-portlet__head-actions">
                <a data-toggle="modal" href="#new" class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Добавить
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="giveaways">
            <thead>
            <tr>
              <th>ID</th>
              <th>Предмет</th>
              <th>Цена предмета</th>
              <th>Победитель</th>
              <th>Дата окончания</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="giveaway in giveaways" :key="giveaway.id">
              <td>{{ giveaway.id }}</td>
              <td>{{ giveaway.item.market_hash_name }}</td>
              <td>{{ giveaway.item.price }}</td>
              <td v-if="giveaway.winner">
                <RouterLink :to="`/user/${giveaway.winner_id}`">{{ giveaway.winner.username }}</RouterLink>
              </td>
              <td v-else>Не определен</td>
              <td>{{ $root.parseDate(giveaway.end_time) }}</td>
              <td>
                <RouterLink :to="`/giveaway/${giveaway.id}`" class="btn btn-sm btn-clean btn-icon btn-icon-md"
                            title="Редактировать">
                  <i class="la la-users"></i>
                </RouterLink>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Удалить"
                   @click="deleteGiveaway(giveaway.id)">
                  <i class="la la-trash"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="new" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Создать розыгрыш</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Предмет:</label>
                <select id="selectItem"></select>
              </div>
              <div class="form-group">
                <label>Депозит за сутки в рублях:</label>
                <input type="text" v-model="newedData.deposit_need" class="form-control">
              </div>
              <div class="form-group">
                <label>Дата окончания:</label>
                <div class="input-group date" id="datetimepicker">
                  <input type="text" class="form-control"/>
                  <span class="input-group-addon">
                    <i class="glyphicon glyphicon-calendar"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="createGiveaway">Создать</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      giveaways: [],
      newedData: {}
    }
  },
  created() {
    this.getGiveaways()

    this.loadInventoryItem()
  },
  mounted() {
    $('#datetimepicker').datetimepicker({
      locale: 'ru'
    });
  },
  methods: {
    getGiveaways() {
      this.$root.request('GET', '/admin/giveaways')
          .then(giveaways => {
            this.giveaways = giveaways

            this.$nextTick(() => {
              $('#giveaways').DataTable().destroy();
              $('#giveaways').DataTable({
                "order": [[0, "desc"]]
              })
            })
          })
    },
    deleteGiveaway(id) {
      this.$root.request('POST', `/admin/giveaways/delete/${id}`)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Розыгрыш удален'
            })

            setTimeout(() => {
              this.getGiveaways()
            }, 500)
          })
    },
    createGiveaway() {
      if (typeof $('#datetimepicker').data('date') !== 'undefined') {
        this.newedData.end_time = $('#datetimepicker').data('date')
      } else {
        return $.wnoty({
          type: 'error',
          message: 'Выберите дату'
        })
      }

      this.$root.request('POST', `/admin/giveaways/create`, {
        giveaway: {
          item_id: $('#selectItem option').last().val(),
          deposit_need: this.newedData.deposit_need,
          end_time: this.newedData.end_time
        }
      })
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Розыгрыш создан'
            })

            setTimeout(() => {
              this.getGiveaways()
            }, 500)

            $('#selectItem').html('');
            this.newedData = {}

            $('#new').modal('hide');
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    async loadInventoryItem() {
      setTimeout(() => {
        $('#selectItem').select2({
          theme: 'bootstrap4',
          dropdownParent: $("#new"),
          ajax: {
            delay: 250,
            url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/findItemsInInventory`,
            type: "GET",
            headers: {
              "Authorization": `Bearer ${this.$cookie.get('token')}`
            },
            data: function (params) {
              const query = {
                search: params.term,
                page: params.page || 1
              };

              return query;
            },
            processResults: function (data) {
              return {
                results: data.results,
                pagination: {
                  more: data.more
                }
              };
            },
          },
          templateResult: function (state) {
            return $(
                `<span><img src="${state.img}" class="img-flag" /> ${state.text}</span>`
            );
          }
        });

        $('#editItem').select2({
          theme: 'bootstrap4',
          dropdownParent: $("#edit"),
          ajax: {
            delay: 250,
            url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/findItemsInInventory`,
            type: "GET",
            headers: {
              "Authorization": `Bearer ${this.$cookie.get('token')}`
            },
            data: function (params) {
              const query = {
                search: params.term,
                page: params.page || 1
              };

              return query;
            },
            processResults: function (data) {
              return {
                results: data.results,
                pagination: {
                  more: data.more
                }
              };
            },
          },
          templateResult: function (state) {
            return $(
                `<span><img src="${state.img}" class="img-flag" /> ${state.text}</span>`
            );
          }
        });
      }, 500)
    }
  }
}
</script>