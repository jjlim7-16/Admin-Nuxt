<template>
	<div id='form'>
		<b-field label='Station Name *' width="410px">
			<b-input placeholder='Enter Station Name' v-model="name" required></b-input>
		</b-field>

		<b-field grouped>
			<b-field label="Select Start Time">
				<b-timepicker v-model="startTime"
					:min-time='minTime'
					:max-time='maxTime'
          :increment-minutes=10>
				</b-timepicker>
			</b-field>

			<b-field label="Select End Time">
				<b-timepicker v-model="endTime"
          :min-time='minTime'
					:max-time='maxTime'
          :increment-minutes=10>
				</b-timepicker>
			</b-field>
		</b-field>

		<b-field label="Description" width="410px">
			<b-input maxlength="500" type="textarea" v-model="description"></b-input>
		</b-field>

    <b-field label='Image'>
      <b-field class='file'>
        <b-upload v-model='files' accept="image/*">
          <a class='button is-primary'>
            <b-icon icon='upload'></b-icon>
            <span>Upload Image</span>
          </a>
        </b-upload>
        <span class='file-name' v-if='files && files.length'>
        {{ files[0].name }}
        </span>
      </b-field>
    </b-field>

		<b-field label="Roles" >
			<b-field grouped group-multiline>
				<div class="control" v-if="roles.length>0" v-for="role in roles" :key="role.roleName">
					<b-tag v-if="(role.roleName)" 
						type="is-primary" size="is-medium" 
						attached closable
						@close="removeRole(role)">
						{{role.roleName}}
					</b-tag>
				</div>
				<button class="button is-primary"
					@click="isComponentModalActive = true">
					<b-icon icon="plus-circle"></b-icon>&nbsp; Add Role
				</button>
			</b-field>
		</b-field>

		<b-modal :active.sync="isComponentModalActive" @click="onClose()" has-modal-card>
			<modal-form></modal-form>
		</b-modal>

		<br/>
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Add Station</button>
	</div>
	
</template>

<script>
import axios from "axios";
import Vuex from "vuex";

function WebFormDataRole(roleName, capacity, file) {
  this.roleName = roleName;
  this.capacity = capacity;
  this.file = file;
}
let webFormDataRole;
let roleList = [];
const ModalForm = {
  template: `<div>
<div class='modal-card' style='width: 560px'>
<header class='modal-card-head'>
<p class='modal-card-title'>Add Role</p>
</header>
<section class='modal-card-body'>
<b-field label='Role Name'>
<b-input style='width: 280px'
v-model='roleName'
placeholder='New Role'
required>
</b-input>
</b-field>
<b-field grouped>
<b-field label='Capacity'>
<b-select v-model='capacity' placeholder='Select Max. Capacity' required>
<option>4</option>
<option>6</option>
<option>8</option>
</b-select>
</b-field>
<b-field label='Duration'>
<b-select placeholder='Select Activity Duration' v-model="duration">
<option>20 mins</option>
<option>30 mins</option>
<option>40 mins</option>
</b-select>
</b-field>
</b-field grouped>
<b-field label='Image'>
<b-field class='file'>
<b-upload v-model='files'>
<a class='button is-primary'>
<b-icon icon='upload'></b-icon>
<span>Upload Image</span>
</a>
</b-upload>
<span class='file-name'
v-if='files && files.length'>
{{ files[0].name }}
</span>
</b-field>
</b-field>
</section>
<footer class='modal-card-foot'>
<button class='button' type='button' @click='$parent.close()'>Close</button>
<button class='button is-primary' :disabled='isDisabled' @click='addRole()'>Add New Role</button>
</footer>
</div>
</div> `,
  methods: {
    addRole() {
      //this.roleList.push(this.role)
      //console.log(this.roleList)
      let roleExist = false;
      //console.log(this.files[0])
      webFormDataRole = new WebFormDataRole(
        this.roleName,
        this.capacity,
        this.files[0]
      );
      //console.log(webFormDataRole)
      console.log(roleList.length);
      if (roleList.length > 0) {
        let i = 0;
        for (i = 0; i < roleList.length; i++) {
          if (this.roleName === roleList[i].roleName) {
            roleExist = true;
            this.alertCustomError();
          }
          console.log(roleList[i].roleName);
        }
      }
      if (roleExist === false) {
        roleList.push(webFormDataRole);
        this.$parent.close();
      }
    },
    alertCustomError() {
      this.$dialog.alert({
        title: "Error",
        message: `Error! The Role \'${this.roleName}\' Already Exists`,
        type: "is-danger",
        hasIcon: true,
        icon: "times-circle",
        iconPack: "fa"
      });
    }
  },
  data() {
    return {
      roleName: "",
      capacity: 4,
      files: []
    };
  },
  computed: {
    isDisabled() {
      console.log(this.files[0]);
      return !this.roleName || !this.capacity || !this.files[0];
    }
  }
};

function WebFormData(name, description, noRSlots, startTime, endTime, roles, file) {
	this.name = name,
	this.description = description,
	this.noRSlots = noRSlots,
	this.startTime = startTime,
	this.endTime = endTime,
	this.roles = roles
	this.file = file
}

export default {
  components: {
    ModalForm
  },
  data() {
    const min = new Date();
    min.setHours(10);
    min.setMinutes(0);
    const max = new Date();
    max.setHours(18);
    max.setMinutes(0);
    return {
      isComponentModalActive: false,
      name: "",
      description: "",
      roles: [],
      minTime: min,
      maxTime: max,
      startTime: min,
      endTime: max,
      files: []
    };
  },
  methods: {
    submit() {
      let webFormData = new WebFormData(this.name,this.description,2,
      this.startTime,this.endTime,this.roles);

      let formData = new FormData();
      for (var i = 0; i < webFormData.roles.length; i++) {
        let file = webFormData.roles[i].file;
        console.log(file);
        formData.append(webFormData.name + "-" + webFormData.roles[i].roleName, file);
      }

      formData.append("webFormData", JSON.stringify(webFormData));
      console.log(formData.get("webFormData"));
      axios.post("http://localhost:8000/stations/", formData)
        .then(res => {
          console.log(res);
          console.log("SUCCESS");
        })
        .catch(() => {
          console.log("FAILURE");
        });
    },
    removeRole(role) {
      this.roles.pop(role);
      roleList = this.roles;
    }
  },
  computed: {
    isDisabled() {
      return !this.name || !(this.roles.length > 0) || !this.description;
    },
    getRoles() {
      roles = roleList;
      console.log(roles);
      //return
    }
  },
  updated() {
    //console.log(roleList)
    this.roles = roleList;
    console.log(this.startTime);
  }
};
</script>

<style>
#form {
  margin: 25px 60px 25px 70px;
}
</style>