<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Кейсы</h3>
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
              <th>Название</th>
              <th>Категория</th>
              <th>Стоимость</th>
              <th>Открытий</th>
              <th>Макс. кол-во открытий</th>
              <th>Профит</th>
              <th>Банк</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="box in cases" :key="box.id">
              <td>{{ box.id }}</td>
              <td>{{ box.name }}</td>
              <td>{{ box.category.name }}</td>
              <td>{{ box.price }}</td>
              <td>{{ box.opened }}</td>
              <td>{{ box.max_opened }}</td>
              <td>{{ box.profit }}</td>
              <td>{{ box.bank }}</td>
              <td>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="editData(box.id)"
                   title="Редактировать">
                  <i class="la la-edit"></i>
                </a>
                <router-link tag="a" :to="{name: 'CaseItems', params: {id: box.id}}" class="btn btn-sm btn-clean btn-icon btn-icon-md"
                             title="Предметы">
                  <i class="la la-info"></i>
                </router-link>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="delData(box.id)" title="Удалить">
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
            <h5 class="modal-title" id="exampleModalLongTitle">Создать кейс</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Название:</label>
                <input type="text" v-model="newedData.name" placeholder="Армейское" class="form-control">
              </div>
              <div class="form-group">
                <label>Название для ссылки:</label>
                <input type="text" v-model="newedData.url" placeholder="milspec" class="form-control">
              </div>
              <div class="form-group">
                <label>Категория:</label>
                <select v-model="newedData.category_id" class="form-control">
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{
                      category.name
                    }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Изображение:</label>
                <input type="text" v-model="newedData.image" placeholder="/cases/milspec.png" class="form-control">
              </div>
              <div class="form-group">
                <label>Старая цена:</label>
                <input type="number" v-model="newedData.old_price" placeholder="39" class="form-control">
              </div>
              <div class="form-group">
                <label>Цена:</label>
                <input type="number" v-model="newedData.price" placeholder="29" class="form-control">
              </div>
              <div class="form-group">
                <label>Кол-во открытий</label>
                <input type="number" v-model="newedData.max_opened" class="form-control">
              </div>
              <div class="form-group">
                <label>% в банк</label>
                <input type="number" v-model="newedData.bank_percent" class="form-control">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
              <button type="submit" class="btn btn-primary" v-on:click="createData">Создать</button>
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
            <h5 class="modal-title" id="exampleModalLongTitle">Редактировать кейс</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Название:</label>
                <input type="text" v-model="editedData.name" placeholder="Армейское" class="form-control">
              </div>
              <div class="form-group">
                <label>Название для ссылки:</label>
                <input type="text" v-model="editedData.url" placeholder="milspec" class="form-control">
              </div>
              <div class="form-group">
                <label>Категория:</label>
                <select v-model="editedData.category_id" class="form-control">
                  <option
                      v-for="category in categories"
                      :key="category.id"
                      :selected="category.id === editedData.category_id"
                      :value="category.id"
                  >{{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Изображение:</label>
                <input type="text" v-model="editedData.image" placeholder="/cases/milspec.png" class="form-control">
              </div>
              <div class="form-group">
                <label>Старая цена:</label>
                <input type="number" v-model="editedData.old_price" placeholder="39" class="form-control">
              </div>
              <div class="form-group">
                <label>Цена:</label>
                <input type="number" v-model="editedData.price" placeholder="29" class="form-control">
              </div>
              <div class="form-group">
                <label>Кол-во открытий</label>
                <input type="number" v-model="editedData.max_opened" class="form-control">
              </div>
              <div class="form-group">
                <label>% в банк</label>
                <input type="number" v-model="editedData.bank_percent" class="form-control">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      cases: [],
      categories: [],
      newedData: {},
      editedData: {}
    }
  },
  mounted() {
    this.getTable()
    this.getCategories()
  },
  methods: {
    getTable() {
      this.$root.request('GET', `/admin/cases`)
          .then((data) => {
            const table = $('#table');

            table.DataTable().destroy();

            this.cases = data

            setTimeout(() => {
              this.$nextTick(function () {
                table.DataTable();
              });
            }, 100)
          })
    },
    getCategories() {
      this.$root.request('GET', `/admin/categories`)
          .then((data) => {
            this.categories = data
          })
    },
    editData(id) {
      this.$root.request('GET', `/admin/cases/case/${id}`)
          .then((data) => {
            this.editedData = data

            $('#edit').modal('show');
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    delData(id) {
      this.$root.request('GET', `/admin/cases/case/${id}/delete`)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Успешно'
            })

            this.getTable()
          })
          .catch(e => {
            $.wnoty({
              type: 'error',
              message: e
            })
          })
    },
    createData() {
      if (typeof this.newedData.max_opened === 'undefined' || this.newedData.max_opened === null || this.newedData.max_opened.length === 0) {
        this.newedData.max_opened = null
      }

      this.$root.request('POST', `/admin/cases/create`, this.newedData)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Кейс создан'
            })

            this.getTable()


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
    saveEditData() {
      if (typeof this.editedData.max_opened === 'undefined' || this.editedData.max_opened === null || this.editedData.max_opened.length === 0) {
        this.editedData.max_opened = null
      }

      this.$root.request('POST', `/admin/cases/case/${this.editedData.id}/update`, this.editedData)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Кейс обновлен'
            })

            this.getTable()

            this.editedData = {}

            $('#edit').modal('hide');
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