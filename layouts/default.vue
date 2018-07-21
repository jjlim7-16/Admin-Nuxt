<template>
  <div id="app" class="columns">
    <div class="column is-one-fifth" id="nav">
      <aside class="sidebar menu is-hidden-touch">
        <p class="menu-label">
          General
        </p>
        <ul class="menu-list">
          <li><nuxt-link to="/Admin/Dashboard">Dashboard</nuxt-link></li>
          <li><nuxt-link to="/Admin/Stations">Stations</nuxt-link></li>
          <li><nuxt-link to="/Admin/Roles">Roles</nuxt-link></li>
          <li><nuxt-link to="/Admin/Bookings">Bookings</nuxt-link></li>
        </ul>
        <p class="menu-label">
          Administration
        </p>
        <ul class="menu-list">
          <li><nuxt-link to="/Admin/Users">Manage Users</nuxt-link></li>
          <li><nuxt-link to="/Admin/Users/permissions">Roles &amp; Permissions</nuxt-link></li>
        </ul>
      </aside> 
    </div>
    <div class="container">
      <nuxt/>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      return this.$auth.logout()
    }
  },
  fetch ({ redirect }) {
    redirect('/Admin/Stations')
  }
}
</script>


<style>

#app {
  margin: 5px;
}

.container {
  /* float: right; */
  display: flex;
  justify-content: flex-start;
}

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.menu-list a.nuxt-link-active {
    background-color: #ff4c65;
    color: #fff;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
