<template>
  <div>
    <div class="kt-subheader kt-grid__item" id="kt_subheader">
      <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Пользователи</h3>
      </div>
    </div>

    <div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
      <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              Список пользователей
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <table class="table table-striped- table-bordered table-hover table-checkable" id="users">
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя пользователя</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.user.id }}</td>
              <td>{{ user.user.username }}</td>
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
      users: []
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      this.$root.request('GET', `/admin/giveaways/get_users/${this.$route.params.id}`)
        .then(users => {
          this.users = users

          this.$nextTick(() => {
            $('#users').DataTable().destroy();
            $('#users').DataTable({
              "order": [[0, "desc"]]
            })
          })
        })
    }
  }
}
</script>