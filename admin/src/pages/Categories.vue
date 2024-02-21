<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Категории</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список категорий
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
              <th>Название</th>
              <th>Сортировка</th>
              <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.name }}</td>
              <td>{{ category.sorting }}</td>
              <td>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="editData(category.id)" title="Редактировать">
                  <i class="la la-edit"></i>
                </a>
                <a class="btn btn-sm btn-clean btn-icon btn-icon-md" v-on:click="delData(category.id)" title="Удалить">
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
            <h5 class="modal-title" id="exampleModalLongTitle">Создать категорию</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Название:</label>
                <input type="text" v-model="newedData.name" class="form-control">
              </div>
              <div class="form-group">
                <label>Сортировка:</label>
                <input type="text" v-model="newedData.sorting" class="form-control">
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

    <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="newLabel" style="display: none;" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLongTitle">Изменить категорию</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
          </div>
          <form class="kt-form-new" onclick="return false;">
            <div class="modal-body">
              <div class="form-group">
                <label>Название:</label>
                <input type="text" v-model="editedData.name" class="form-control">
              </div>
              <div class="form-group">
                <label>Сортировка:</label>
                <input type="text" v-model="editedData.sorting" class="form-control">
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
      categories: [],
      newedData: {},
      editedData: {}
    }
  },
  mounted() {
    this.getTable()
  },
  methods: {
    getTable() {
      this.$root.request('GET', `/admin/categories`)
          .then((data) => {
            const table = $('#table');

            table.DataTable().destroy();

            this.categories = data

            setTimeout(() => {
              this.$nextTick(function() {
                table.DataTable();
              });
            }, 100)
          })
    },
    editData(id) {
      this.$root.request('GET', `/admin/categories/category/${id}`)
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
      this.$root.request('GET', `/admin/categories/category/${id}/delete`)
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
      this.$root.request('POST', `/admin/categories/create`, this.newedData)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Категория создана'
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
      this.$root.request('POST', `/admin/categories/category/${this.editedData.id}/update`, this.editedData)
          .then(() => {
            $.wnoty({
              type: 'success',
              message: 'Категория обновлена'
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