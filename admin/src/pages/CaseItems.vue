<template>
  <div v-if="box">
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Предметы в кейсы "{{ box.name }}"</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список кейсов
            </h3>
          </div>
          <div class="kt-portlet__head-toolbar">
            <div class="kt-portlet__head-wrapper">
              <div class="kt-portlet__head-actions">
                <a style="margin-right: 10px;" data-toggle="modal" href="#transfer"
                   class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Перенести с другого кейса
                </a>
                <a style="margin-right: 10px;" data-toggle="modal" href="#copy"
                   class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Скопировать с другого кейса
                </a>
                <a style="margin-right: 10px;" href="#" @click="openFake()" class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Открыть 1000 кейсов
                </a>
                <a data-toggle="modal" href="#new" class="btn btn-success btn-elevate btn-icon-sm">
                  <i class="la la-plus"></i>
                  Добавить
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Картинка</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Выпадает</th>
              <th>Видимость</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.id }}</td>
              <td><img :src="`https://community.cloudflare.steamstatic.com/economy/image/${item.item.icon_url}/62x62`"
                       alt=""/></td>
              <td>{{ item.item.market_hash_name }}</td>
              <td>{{ item.item.price }}</td>
              <td>{{ item.enabled ? 'Да' : 'Нет' }}</td>
              <td>{{ item.visibility ? 'Да' : 'Нет' }}</td>
              <td>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="editData(item.id)"
                   title="Редактировать">
                  <i class="la la-edit"></i>
                </a>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="delData(item.id)" title="Удалить">
                  <i class="la la-trash"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="new" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Добавить предмет</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Предмет:</label>
                <select id="selectItem"></select>
              </div>
              <div class="form-group">
                <label>Выпадает</label>
                <select v-model="newedData.enabled" class="form-control">
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
              <div class="form-group">
                <label>Видимость</label>
                <select v-model="newedData.visibility" class="form-control">
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="createData">Добавить</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Редактировать предмет</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Предмет:</label>
                <select id="editItem"></select>
              </div>
              <div class="form-group">
                <label>Выпадает</label>
                <select v-model="editedData.enabled" class="form-control">
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
              <div class="form-group">
                <label>Видимость</label>
                <select v-model="editedData.visibility" class="form-control">
                  <option value="1">Да</option>
                  <option value="0">Нет</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="saveEditData">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="copy" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Скопировать предметы из кейса</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Кейс:</label>
                <select v-model="copyData.id" class="form-control">
                  <option
                      v-for="box in cases"
                      :key="box.id"
                      :value="box.id"
                  >{{ box.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="copy(0)">Скопировать</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="transfer" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Перенести предметы из кейса</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Кейс:</label>
                <select v-model="copyData.id" class="form-control">
                  <option
                      v-for="box in cases"
                      :key="box.id"
                      :value="box.id"
                  >{{ box.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="copy(1)">Перенести</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" id="open" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Фейк открытие 1000 кейсов</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div v-if="!open">
              Открываем..
            </div>
            <div v-else class="modal-body">
              <div class="form-group">
                <label>Выпало вещей (Р):</label>
                <input type="text" disabled :value="open.winItems" class="form-control">
              </div>
              <div class="form-group">
                <label>Выпало вещей больше кейса:</label>
                <input type="text" disabled :value="open.topItems" class="form-control">
              </div>
              <div class="form-group">
                <label>Профит:</label>
                <input type="text" disabled :value="(box.price * 1000) - open.winItems" class="form-control">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
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
      box: null,
      items: [],
      cases: [],
      newedData: [],
      editedData: [],
      copyData: [],
      open: null
    }
  },
  mounted() {
    this.getCase()
    this.getCases()

    this.loadInventoryItem();
  },
  methods: {
    getCases() {
      this.$root.request('GET', `/admin/cases`)
          .then((data) => {
            this.cases = data
          })
    },
    getCase() {
      this.$root.request('GET', `/admin/cases/case/${this.$route.params.id}`)
          .then((data) => {
            this.box = data

            this.getItems()
          })
    },
    getItems() {
      this.$root.request('GET', `/admin/case_items/case/${this.$route.params.id}`)
          .then((data) => {
            const table = $('#table');

            table.DataTable().destroy();

            this.items = data

            setTimeout(() => {
              this.$nextTick(function () {
                table.DataTable();
              });
            }, 100)
          })
    },
    delData(id) {
      this.$root.request('GET', `/admin/case_items/case/${id}/${this.box.id}/delete`)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Успешно'
            })

            this.getItems()
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    createData() {
      this.$root.request('POST', `/admin/case_items/create`, {
        item_id: $('#selectItem option').last().val(),
        case_id: this.box.id,
        enabled: this.newedData.enabled === '1',
        visibility: this.newedData.visibility === '1'
      })
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Предмет добавлен'
            })

            this.getItems()

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
    editData(id) {
      $('#editItem').html('');

      this.$root.request('GET', `/admin/case_items/item/${id}`)
          .then((data) => {
            this.editedData = data
            this.editedData.enabled = this.editedData.enabled ? 1 : 0
            this.editedData.visibility = this.editedData.visibility ? 1 : 0

            const item = {
              id: data.item.id,
              text: `${data.item.market_hash_name} (${data.item.price.toFixed(2)})`,
              url: data.item.icon_url
            };

            const newOption = new Option(item.text, item.id, true, true);
            $('#editItem').prepend(newOption).trigger('change');

            $('#edit').modal('show');
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    saveEditData() {
      this.$root.request('POST', `/admin/case_items/item/${this.editedData.id}/${this.box.id}/update`, {
        id: this.editedData.id,
        item_id: $('#editItem option').last().val(),
        case_id: this.box.id,
        enabled: parseInt(this.editedData.enabled) === 1,
        visibility: parseInt(this.editedData.visibility) === 1
      })
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Предмет обновлен'
            })

            this.getItems()

            this.editedData = {}

            $('#edit').modal('hide');
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    copy(transfer) {
      this.$root.request('POST', '/admin/case_items/transfer', {
        case_id: this.copyData.id,
        new_case_id: this.box.id,
        transfer
      })
          .then(() => {
            setTimeout(() => {
              this.getItems()
            }, 500)

            this.copyData = []

            if (transfer) {
              $.wnoty({
                type: 'success',
                message: 'Предметы перенесены'
              })

              $('#transfer').modal('hide');
            } else {
              $.wnoty({
                type: 'success',
                message: 'Предметы скопированы'
              })

              $('#copy').modal('hide');
            }
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
    },
    openFake() {
      $.wnoty({
        type: 'warning',
        message: 'Открываем'
      })

      this.$root.request('POST', `/admin/cases/fakeOpens`, {
        case_id: this.box.id
      })
          .then((data) => {
            this.open = data

            $('#open').modal('show');
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    }
  }
}
</script>
