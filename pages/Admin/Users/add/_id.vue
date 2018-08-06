<template>
  <section id="content" class="box columns is-multiline">
    <div class="column is-7">
      <b-field label='Roles*'>
        <div class="block">
          <b-radio v-model="account_type" native-value="Admin">Admin</b-radio>
          <b-radio v-model="account_type" native-value="Crew">Crew</b-radio>
        </div>
      </b-field>

      <b-field label='Station Name*' v-show="account_type === 'Crew'">
        <b-select placeholder="Select a station"  v-model="account_type_id" disabled>
          <option v-for="crewAccountType in crewAccountTypeList"
                  :value="crewAccountType.account_type_id"
                  :key="crewAccountType.account_type_id">
            {{crewAccountType.station_name}}
          </option>
        </b-select>
      </b-field>

      <b-field label='Username*' :type="errors.has('username') ? 'is-danger': ''"
        :message="errors.has('username') ? errors.first('username') : ''">
        <b-input placeholder='Enter Username' v-model="username" name="username" data-vv-as="'username'"
          v-validate="'required|alpha_spaces'"></b-input>
      </b-field>

      <b-field label='Password*' :type="errors.has('password') ? 'is-danger': ''"
        :message="errors.has('password') ? errors.first('password') : ''">
        <b-input placeholder='Enter Password' v-model="password" name="password" 
        type="password" v-validate="'required|min:8'" ref="password"></b-input>
      </b-field>

      <b-field label='Confirm Password*' :type="errors.has('confirmPassword') ? 'is-danger': ''"
        :message="errors.has('confirmPassword') ? errors.first('confirmPassword') : ''">
        <b-input placeholder='Confirm Password' type="password" v-model="confirmPassword" 
        name="confirmPassword" v-validate="'required|min:8|confirmed:password'" data-vv-as="password">
        </b-input>
      </b-field>

      <br/>
      <button class="button is-success is-pulled-right" @click="submit()">Submit</button>
      <router-link to="/Admin/Users/" class="button is-light right-spaced is-pulled-right">Cancel</router-link>
    </div>
  </section>
</template>

<script>
import config from '~/config.js'
import DataModel from '~/models/dataModel.js'

export default {

  data(){
    return{
      crewAccountTypeList: [],
      username: '',
      password:'',
      account_type:'Admin',
      station_id:'',
      account_type_id: '',
      selectedStation:''
    }
  },
  async beforeMount() {
    let res = await this.$axios.get(`http://${config.serverURL}/user/getAccountTypeCrewList`)
    this.crewAccountTypeList = res.data
    console.log(this.crewAccountTypeList)
    for (var i in this.data) {
      if (this.data[i].account_type != 'Admin') {
        for (var a in this.crewAccountTypeList) {
          if (this.crewAccountTypeList[a].account_type == this.data[i]) {
            this.data[i].station_name = this.crewAccountTypeList[a].station_name
          }
        }
      } else{
        this.data[i].station_name = "NULL"
      }
    }
    this.$store.commit('setPageTitle', 'Add User')
  },

  methods:{
    async submit() {
      if (this.account_type == 'Admin') {
        this.account_type_id = 1
      }

      let webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
      console.log(this.account_type_id + this.username + this.password)
      this.$axios.post(`http://${config.serverURL}/user/`, webFormData)
        .then(res => {
          if (res.status === 200) {
            this.$dialog.alert({
              title: 'Add User',
              message: `A new user \'${this.username}\' has been successfully added.`,
              type: 'is-success',
              hasIcon: true,
              icon: 'check-circle',
              iconPack: 'mdi'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

}
</script>

<style scoped>
.right-spaced {
  margin-right: 1.5vw;
}
</style>
