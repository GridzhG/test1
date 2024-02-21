<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Промокоды</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список промокодов
            </h3>
          </div>
          <div class="kt-portlet__head-toolbar">
            <div class="kt-portlet__head-wrapper">
              <div class="kt-portlet__head-actions">
                <a data-toggle="modal" href="#addPromocode" class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Добавить промокод
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="promocodes">
            <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Тип</th>
              <th>Использовано</th>
              <th>Максимум использований</th>
              <th>Дата окончания</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addPromocode" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Создать промокод</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Название:</label>
                <input class="form-control" v-model="newItem.name" type="text" name="name">
              </div>
              <div class="form-group">
                <label>Тип:</label>
                <select class="form-control" v-model="newItem.type">
                  <option :selected="newItem.type === 'balance'" value="balance">Баланс</option>
                  <option :selected="newItem.type === 'bonus'" value="bonus">Бонус к депозиту</option>
                </select>
              </div>
              <div class="form-group" v-if="newItem.type === 'balance'">
                <label>Сумма:</label>
                <input class="form-control" v-model="newItem.value" type="number" name="value">
              </div>
              <div class="form-group" v-if="newItem.type === 'bonus'">
                <label>Процент к пополнению:</label>
                <input class="form-control" v-model="newItem.value" type="number" name="value">
              </div>
              <div class="form-group">
                <label>Максимальное кол-во активаций:</label>
                <input class="form-control" v-model="newItem.limited" type="number" name="limited">
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
              <button type="submit" class="btn btn-primary" v-on:click="createPromocode">Создать</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="information" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Информация о промокоде</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Использовано:</label>
                <input class="form-control" v-model="info.count" type="text" disabled>
              </div>
              <div class="form-group">
                <label>Пополнено:</label>
                <input class="form-control" v-model="info.sum" type="text" disabled>
              </div>
              <div class="form-group">
                <label>Среднее пополнение:</label>
                <input class="form-control" v-model="info.avg" type="text" disabled>
              </div>
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
      newItem: {
        name: '',
        value: 0,
        type: 'balance',
        limited: null,
        end_time: '',
      },
      info: {}
    }
  },
  mounted() {
    const app = this;

    this.loadTable()

    $('#datetimepicker').datetimepicker({
      locale: 'ru'
    });

    setTimeout(() => {
      $(document).on('click', '.deletePromocode', function () {
        app.delete($(this).attr('data-id'));
      });

      $(document).on('click', '.getInformation', function () {
        app.getInformation($(this).attr('data-id'));
      });
    })
  },
  methods: {
    async loadTable() {
      const app = this;
      const table = $('#promocodes');

      table.dataTable().fnDestroy();

      table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        ajax: {
          url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/promocodes`,
          type: "GET",
          headers: {
            "Authorization": `Bearer ${this.$cookie.get('token')}`
          }
        },
        columns: [
          { data: "id", searchable: true },
          { data: "name", searchable: true },
          { data: "type", searchable: true,
            render: function (data, type, row) {
              if (row.type === 'balance') {
                return 'Баланс'
              } else if (row.type === 'bonus') {
                return 'Бонус к пополнению'
              }
            }
          },
          { data: "used", searchable: true },
          { data: "limited", searchable: true,
            render: function (data, type, row) {
              if (row.limited !== null) {
                return row.limited
              } else {
                return ''
              }
            }
          },
          { data: "end_time", searchable: true,
            render: function (data, type, row) {
              if (row.end_time !== null) {
                return app.$root.parseDate(row.end_time)
              } else {
                return ''
              }
            }
          },
          { data: null, searchable: true,
            render: function (data, type, row) {
              return '<a style="cursor: pointer" class="btn btn-sm btn-danger btn-icon btn-icon-md deletePromocode" data-id="'+row.id+'" title="Удалить">\n' +
                  '<i class="la la-trash"></i>\n' +
                  '</a>' +
                  '                <a data-id="'+row.id+'" class="btn btn-sm btn-clean btn-icon btn-icon-md getInformation"\n' +
                  '                             title="Предметы">\n' +
                  '                  <i class="la la-info"></i>\n' +
                  '                </a>'
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
    },
    async delete(id) {
      this.$root.request('POST', `/admin/promocodes/${id}/del`)
          .then(() => {
            this.loadTable()

            $.wnoty({
              type: 'success',
              message: 'Промокод удален'
            })
          })
          .catch((e) => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    async createPromocode() {
      if (typeof $('#datetimepicker').data('date') !== 'undefined') {
        this.newItem.end_time = $('#datetimepicker').data('date')
      } else {
        this.newItem.end_time = null
      }

      this.$root.request('POST', '/admin/promocodes/create', {
        item: this.newItem
      }).then(() => {
        $('#addPromocode').modal('hide');

        this.newItem = {
          name: '',
          value: 0,
          type: 'sum',
          limited: null,
          end_time: '',
        }

        this.loadTable()

        $.wnoty({
          type: 'success',
          message: 'Промокод создан'
        })
      }).catch((e) => {
        $.wnoty({
          type: 'error',
          message: e
        })
      })
    },
    async getInformation(id) {
      this.$root.request('GET', `/admin/promocodes/${id}/info`)
          .then(data => {
            this.info = data

            $('#information').modal('show');
          })
    }
  }
}
</script>
