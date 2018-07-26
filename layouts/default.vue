<template>
<div id="app" class="columns">
  <div class="column is-2 is-hidden-touch" id="nav">
    <aside class="sidebar menu">
      <img src="~/static/img-whitelogo.png" alt="logo" />

      <p class="menu-label">General</p>
      <ul class="menu-list">
        <li>
          <nuxt-link to="/Admin/Dashboard">Dashboard</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/Admin/Stations">Manage Stations</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/Admin/Roles">Manage Roles</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/Admin/Settings/Limit">Manage Limits</nuxt-link>
        </li>
      </ul>

      <p class="menu-label">Administration</p>
      <ul class="menu-list">
        <li>
          <nuxt-link to="/Admin/Users">Manage Users</nuxt-link>
        </li>
      </ul>

      <ul class="menu-list">
        <li id="logout"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>Logout</a></li>
      </ul>

    </aside>
  </div>

  <aside class="column is-10 myContent">
      <header class="navbar header has-shadow mobileNav">
        <div class="container" id="myNavTitle">
          <div class="navbar-brand">
            <div class="centerTextBox">
              <p class="has-text-weight-semibold">
                {{ this.$store.state.pageName }}
              </p>
            </div>
            <span class="navbar-burger burger" :class="{'is-active': menuIsActive}" @click="toggleMenu()">
          <span></span>
            <span></span>
            <span></span>
            </span>
          </div>
          <div class="navbar-menu" :class="{'is-active': menuIsActive}" @click="toggleMenu()">
            <div class="navbar-end">
              <p class="menu-label">General</p>
              <ul class="menu-list">
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Dashboard">Dashboard</nuxt-link>
                </li>
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Stations">Manage Stations</nuxt-link>
                </li>
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Roles">Manage Roles</nuxt-link>
                </li>
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Settings/Limit">Manage Limits</nuxt-link>
                </li>
              </ul>

              <p class="menu-label">Administration</p>
              <ul class="menu-list">
                <li>
                  <nuxt-link to="/Admin/Users">Manage Users</nuxt-link>
                </li>
              </ul>

              <ul class="menu-list">
                <li id="logout"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

    <nuxt/>

  </aside>
</div>
</template>

<script>
export default {
  data() {
    return {
      menuIsActive: false
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/')
    },
    toggleMenu() {
      this.menuIsActive = !this.menuIsActive;
    }
  }
}
</script>


<style>
.navbar-menu {
  display: none;
}

.nav-title {
  position: fixed;
  padding: 25px 40px;
  right: 0;
  top: 0;
  width: 80%;
  background: white;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  z-index: 5;
  color: #2C2C2C;
}

#app {
  margin: 5px;
}

.mobileNav {
  height: 10vh;
}

#nav {
  background-color: #565656;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

#myNavTitle {
  max-width: 100%;
  font-size: 1.6rem;
  padding: 0 3.5vw;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

#logout {
  position: fixed;
  display: inline;
  bottom: 30px;
  width: 15%;
  text-align: center;
  font-size: 18px;
  color: white;
}

.myContent {
  position: fixed;
  right: 0;
  top: 0;
  padding: 0;
  height: 100%;
}

#content {
  padding: 3vh 1.5vw;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  height: 80%;
  margin: 2vw;
  overflow-y: auto;
}

.menu-label {
  color: rgba(255, 255, 255, 0.72)
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

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1.2rem;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #F8F8F8;
  overflow: hidden;
}

*,
*:before,
*:after {
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

.centerTextBox {
  display: flex;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  html {
    font-size: 1rem;
    overflow: scroll;
  }
  .menu-label {
    color: black;
    padding: 0 2.5vw;
  }
  #myNavTitle {
    font-size: 1.2rem;
    padding: 0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);
  }
  .centerTextBox {
    /* margin-left: 28%; */
  }
  .container {
    display: block;
  }
  #app {
    margin: 0;
  }
  .myContainer {
    float: none;
    margin-left: 0;
    width: 100%;
  }
  #content {
    margin: 0;
    padding: 1.5vh 1.5vw;
    height: 100%;
  }
  .myContent {
    position: inherit;
  }
}
</style>
