<template>
  <section id="fullScreen">
    <img src="img-whitelogo.png" alt="logo" />
    <div id="form" class="columns is-centered section" @keyup.enter="login()">
      <div class="box column is-5">
        <b-field>
          <b-input placeholder='Username' v-model='username' required></b-input>
        </b-field>

        <b-field>
          <b-input type='password' placeholder='Password' v-model='password' required></b-input>
        </b-field>

        <button class="button" @click="login()">Login</button>
      </div>
    </div>
  </section>
</template>

<script>
import Cookie from 'js-cookie'
import config from '~/config'

export default {
  layout: 'fullscreen',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
			try {
				let res = await this.$axios.post(`http://${config.serverURL}/auth/login`, {
					username: this.username,
					password: this.password
				})
				if (res.status === 200) {
					const auth = res.data
					this.$store.commit('update', auth)
          Cookie.set('auth', auth)
          this.$axios.setToken(auth.token, 'Bearer')
					if (auth.user.account_type === 'Admin') {
						this.$router.push('/Admin/Dashboard')
					}
					if (auth.user.account_type === 'Crew') {
						this.$router.push(`/Crew/${auth.user.station_id}`)
					}
				}
			} catch (err) {
        let msg = 'Internal Server Error. Please Contact Administrator.'
        if (err.response.data) {
          msg = err.response.data.message
        }
        this.$dialog.alert({
					title: `Login Failed`,
					message: msg,
					type: 'is-danger',
					hasIcon: true,
					iconPack: 'mdi'
				})
			}
    }
  },
  beforeMount() {
    if (this.$store.state.loggedIn === true) {
      console.log('Is Logged In')
      const user = this.$store.state.user
      if (user.account_type === 'Admin') {
        this.$router.push('/Admin/Dashboard')
      }
      else {
        this.$router.push('/Crew/')
      }
    }
  }
}
</script>

<style scoped>
#fullScreen {
  background-color: #FF4C65;
  height: 100vh;
  width: 100vw;
}

img {
  display: block;
  margin: auto;
  padding-top: 5%;
  position: relative;
  width: 18%;
  height: auto;
}

#form {
  position: absolute;
  width: 100%;
  top: 50%;
  margin: auto;
  transform: translateY(-50%);
}

.box {
  background-color: #F9F9F9;
  padding: 25px;
}

.field {
  margin-top: 20px;
}

.button {
  width: 100%;
  background-color: #FF4C65;
  color: white;
  font-weight: bold;
  margin: 15px 0;
}

@media only screen and (max-width: 767px) {
  img {
    width: 60%;
    padding-top: 20%;
  }
}

@media screen and (min-width:320px) and (max-width:840px) and (orientation:landscape) {
  img {
    width: 18%;
    padding-top: 3%;
  }

  #form {
    top: 60%;
  }
}

@media screen and (min-width:841px) and (max-width:1024px) and (orientation:landscape) {
  img {
    width: 28%;
    padding-top: 16%;
  }

  #form {
    top: 54%;
  }
}
</style>
