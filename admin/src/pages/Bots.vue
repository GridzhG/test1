<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Боты</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список ботов
            </h3>
          </div>
          <div class="kt-portlet__head-toolbar">
            <div class="kt-portlet__head-wrapper">
              <div class="kt-portlet__head-actions">
                <a data-toggle="modal" href="#addBot" class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Добавить бота
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="users">
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Steam профиль</th>
              <th>Баланс</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addBot" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Создать бота</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>SteamID64:</label>
                <input type="text" class="form-control" v-model="bot.steamId">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="createBot">Создать</button>
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
      bot: {
        steamId: null
      },
    }
  },
  mounted() {
    const app = this;

    this.loadTable()
    this.loadSelectBots()

    setTimeout(() => {
      $(document).on('click', '.editUser', function () {
        app.edit($(this).attr('data-id'));
      });
      $(document).on('click', '.deleteUser', function () {
        app.deleteUser($(this).attr('data-id'));
      });
    })
  },
  methods: {
    async loadTable() {
      const table = $('#users');

      table.dataTable().fnDestroy();

      table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        ajax: {
          url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/bots`,
          type: "GET",
          headers: {
            "Authorization": `Bearer ${this.$cookie.get('token')}`
          }
        },
        columns: [
          {data: "id", searchable: true},
          {data: "username", searchable: true},
          {
            data: null, searchable: false,
            render: function (data, type, row) {
              return '<a href="https://steamcommunity.com/profiles/' + row.steamId + '/">Профиль Steam</a>'
            }
          },
          {data: "balance", searchable: true},
          {
            data: "role", searchable: false,
            render: function (data, type, row) {
              if (row.role === 'user') {
                return '<span>Пользователь</span>'
              } else if (row.role === 'admin') {
                return '<span>Администратор</span>'
              } else if (row.role === 'moderator') {
                return '<span>Модератор</span>'
              } else if (row.role === 'bot') {
                return '<span>Бот</span>'
              }
            }
          },
          {
            data: null, searchable: false,
            render: function (data, type, row) {
              return '                                <a class="btn btn-sm btn-clean btn-icon btn-icon-md editUser" data-id="' + row.id + '" title="Редактировать">\n' +
                  '                                    <i class="la la-edit"></i>\n' +
                  '                                ' +
                  '<a class="btn btn-sm btn-danger btn-icon btn-icon-md deleteUser" data-id="' + row.id + '" title="Удалить">\n' +
                  '                                    <i class="la la-trash"></i>\n' +
                  '                                </a>'
            }
          }
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
    async loadSelectBots() {
      setTimeout(() => {
        $('#selectBot').select2({
          theme: 'bootstrap4',
          dropdownParent: $("#sendMessage"),
          ajax: {
            delay: 250,
            url: `${process.env.VUE_APP_BACKEND_URL}/api/admin/findBots`,
            type: "GET",
            headers: {
              "Authorization": `Bearer ${this.$cookie.get('token')}`
            },
            data: function (params) {
              const query = {
                search: params.term,
                page: params.page || 0
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
            }
          }
        });
      }, 500)
    },
    async edit(id) {
      this.$router.replace({
        name: 'user',
        params: {
          id: id
        }
      });
    },
    async createBot() {
      this.$root.request('POST', '/admin/bots/create', {
        steamId: this.bot.steamId
      }).then(() => {
        $.wnoty({
          type: 'success',
          message: 'Бот добавлен'
        })

        this.loadTable();
      }).catch((e) => {
        $.wnoty({
          type: 'error',
          message: e
        })
      })
    },
    async deleteUser(id) {
      this.$root.request('POST', '/admin/bots/delete', {
        id
      }).then(() => {
        $.wnoty({
          type: 'success',
          message: 'Бот удален'
        })

        this.loadTable();
      }).catch((e) => {
        $.wnoty({
          type: 'error',
          message: e
        })
      })
    },
  }
}
</script>
