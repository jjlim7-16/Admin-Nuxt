<template>
  <div id="app" class="columns">
    <div class="column is-2" id="nav">
      <aside class="sidebar menu is-hidden-touch">
        <img src="~/static/img-whitelogo.png" alt="logo">

        <p class="menu-label">General</p>
        <ul class="menu-list">
          <li><nuxt-link to="/Admin/Dashboard">Dashboard</nuxt-link></li>
          <li><nuxt-link to="/Admin/Stations">Manage Stations</nuxt-link></li>
          <li><nuxt-link to="/Admin/Roles">Manage Roles</nuxt-link></li>
        </ul>

        <p class="menu-label">Settings</p>
        <ul class="menu-list">
          <li><nuxt-link to="/Admin/Settings/Limit">Manage Limits</nuxt-link></li>
          <!-- <li><nuxt-link to="/Admin/Settings/Limit/setLimit">Set New Limit</nuxt-link></li> -->
        </ul>

        <p class="menu-label">Administration</p>
        <ul class="menu-list">
          <li><nuxt-link to="/Admin/Users">Manage Users</nuxt-link></li>
          <!-- <li><nuxt-link to="/Admin/Users">Roles &amp; Permissions</nuxt-link></li> -->
        </ul>
        <ul class="menu-list">
          <li id="logout"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>Logout</a></li>
        </ul>
      </aside>
    </div>

    <div class="container">
      <div class="level">
        <div class="level-item">
          <p class="nav-title" style="margin-left: 210px;">
            <strong>{{ this.$store.state.pageName }}</strong>
          </p>
        </div>
      </div>

      <nuxt/>
    </div>
    <!-- <div class="container">
      <nuxt/>
    </div> -->
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      return this.$auth.logout()
    }
  }
}
</script>


<style>

.nav-title {
  position: fixed;
  padding: 25px 40px;
  margin-left: 316px;
  left: 0;
  top: 0;
  width: 100%;
  background: white;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
}

#app {
  margin: 5px;
}

#nav {
  background-color: #565656;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  min-width: 20%;
}

#logout {
  position: fixed;
  display: inline;
  bottom: 30px;
  /* width: 18.7%; */
  width: 15%;
  text-align: center;
  font-size: 18px;
  color: white;
}

#content {
  padding: 20px;
  box-shadow: 0px 3px 6px rgba(0,0,0,0.16);
  background-color: white;
  width: 100%;
  height: 100%;
  /* margin: 120px 60px 25px 100px; */
  margin: 20px 50px;
}

.menu-label {
  color: rgba(255,255,255,0.72)
}

.menu img {
  display: block;
  margin: 20px auto;
  width: 55%;
  height: 55%;
}

.sidebar a {
  color: white;
}

.container {
  float: right;
  display: flex;
  margin-left: 250px;
  margin-right: auto;
  height: 100%;
  width: 1920px;
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
  background-color: #F8F8F8;
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
