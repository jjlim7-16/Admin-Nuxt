<template>
<div id="app" class="columns">

  <!-- side navigation bar -->
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
      </ul>

      <p class="menu-label">Settings</p>
      <ul class="menu-list">
        <li>
          <nuxt-link to="/Admin/Limit">Manage Limits</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/Admin/Reservations">Manage Reservations</nuxt-link>
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
  </div> <!-- end of side navigation bar -->

  <aside class="column is-10 myContent">
      <header class="navbar header has-shadow mobileNav">
        <div class="container" id="myPageTitle">
          <div class="navbar-brand">
            <div class="centerTextBox navbar-item">
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
          <div class="navbar-menu" :class="{'is-active': menuIsActive}" id="mobileNavbarMenu" @click="toggleMenu()">
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
              </ul>

              <p class="menu-label">Settings</p>
              <ul class="menu-list">
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Limit">Manage Limits</nuxt-link>
                </li>
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Reservations">Manage Reservations</nuxt-link>
                </li>
              </ul>

              <p class="menu-label">Administration</p>
              <ul class="menu-list">
                <li class="navbar-item">
                  <nuxt-link to="/Admin/Users">Manage Users</nuxt-link>
                </li>
              </ul>

              <hr />

              <li class="navbar-item">
                <ul class="menu-list"><a @click="logout()"><b-icon class="mdi mdi-logout"></b-icon>&nbsp;Logout</a></ul>
              </li>

            </div>
          </div>
        </div>
      </header>

    <nuxt/>
    <BackToTop :visibleoffset="heightOfBrowser" style=""></BackToTop>

  </aside>

</div> <!-- end of #app -->
</template>

<script>
import Cookie from 'js-cookie'
import BackToTop from '~/components/BackToTop'

export default {
  middleware: 'authenticated',
  components: {
    BackToTop
  },
  data() {
    return {
      menuIsActive: false,
      heightOfBrowser: 0
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      .then(() => {
        Cookie.set('auth', null)
        this.$axios.setToken(false)
        this.$router.push('/')
      })
    },
    toggleMenu() {
      this.menuIsActive = !this.menuIsActive;
    }
  },
  beforeMount() {
    this.heightOfBrowser = window.innerHeight/7
  }
}
</script>

<style>
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


#app {
  margin: 0px;
}

.navbar-menu {
  display: none;
}

/* .centerTextBox {
  display: flex;
  align-items: center;
} */

#nav {
  background-color: #565656;
  height: 100vh;
  display: block;
  top: 0;
  left: 0;
}

.menu img {
  display: block;
  margin: 20px auto;
  width: 70%;
}

.menu-label {
  color: rgba(255, 255, 255, 0.72)
}

.sidebar a {
  color: white;
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

#myPageTitle {
  max-width: 100%;
  height: 100%;
  font-size: 1.6rem;
  padding: 1vh 2.5vw;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
}

.myContent {
  padding: 0;
}

#content {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  height: 80%;
  margin: 2vw;
  overflow-y: auto;
}


.vue-back-to-top {
  bottom: 4%;
  right: 3%;
}


@media only screen and (min-width:320px) and (max-width:840px) and (orientation:portrait) {
  html {
    font-size: 1rem;
    overflow: scroll;
  }
  .menu-label {
    color: black;
    padding: 0 2.5vw;
  }
  #myPageTitle {
    font-size: 1.2rem;
    padding: 0;
  }
  .container {
    display: block;
  }
  .myContainer {
    float: none;
    margin-left: 0;
    width: 100%;
  }
  #content {
    margin: 0;
    min-height: 93%;
  }
  .myContent {
    width: 100% !important;
    height: 100vh;
  }
  hr {
    margin: 0.2rem;
  }
  #mobileNavbarMenu {
    padding: 0.5rem 0.7rem;
  }
  .mobileNav {
    height: 7%;
  }
}

@media screen and (min-width:320px) and (max-width:840px) and (orientation:landscape) {
  .myContent {
    width: 100% !important;
  }
  #content {
    margin: 0;
    height: 85%;
  }
  #myPageTitle {
    font-size: 1.2rem;
  }
  #mobileNavbarMenu {
    height: 50vh;
    overflow-y: scroll;
    box-shadow: none;
  }
  .menu-label {
    color: black;
    padding: 0 2.5vw;
  }
  hr {
    margin: 0.2rem;
  }
}
</style>
