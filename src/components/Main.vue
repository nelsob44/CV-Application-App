<template>
  <v-container>
    <v-row justify="center">
      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <p class="text-toolbar">Nelson's Profile Builder App</p>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <div>
                <v-tooltip v-if="!$vuetify.theme.dark" bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="info" small fab @click="darkMode">
                      <v-icon class="mr-1">mdi-moon-waxing-crescent</v-icon>
                    </v-btn>
                  </template>
                  <span>Dark Mode On</span>
                </v-tooltip>

                <v-tooltip v-else bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="info" small fab @click="darkMode">
                      <v-icon color="yellow">mdi-white-balance-sunny</v-icon>
                    </v-btn>
                  </template>
                  <span>Dark Mode Off</span>
                </v-tooltip>
              </div>
            </v-toolbar-items>
            
          </v-toolbar>
          <div class="row-class-div">
              <p color="error" class="justify-center top">Welcome!</p>
          </div>
          <div class="row-class-div">
              <p class="white-bold top-one">We're excited to see what you can do!</p>
          </div>
          <div class="row-class-div">
              <p class="justify-center">
                <v-btn
                  depressed
                  color="error"
                  @click="beginApplication()"
                >
                Click here to begin
                </v-btn>
              </p>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
    <v-stepper v-model="el">
      <v-stepper-header>
        <v-stepper-step v-for="item in items"
        :key="item.stage"
          :complete="el > item.stage"
          :step="item.stage"
        >
          {{item.stagename}}
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content
          :step="item.stage"
          v-for="item in items"
          :key="item.stage">
          <v-form
            v-if="item.validate || item.validate == null"
            ref="form"
            v-model="valid"
            validation
          >
            <v-card>
              <v-card-title style="
                  font-size: 2rem;
                  word-break: normal;
                  line-height: 2rem;
                ">
                {{item.stagename}}
              </v-card-title>
              <v-card-text>
                <li style="list-style: none"
                  v-for="itm in item.questions"
                  :key="itm.Label">
                  <div :class="itm.validation ? 'required' : ''">
                        {{itm.Label}}
                  </div>
                  <v-text-field v-if="itm.type === 'text-field'"
                                :rules="itm.validation"
                                type="text-field"
                                v-model="submission[itm.formName]" />
                  <v-radio-group v-model="submission[itm.formName]"
                            v-if="itm.type === 'radio'"
                            row
                            :rules="itm.validation">
                    <v-radio v-for="n in itm.options"
                            :key="n.value"
                            :label="n.name"
                            :value="n.value"></v-radio>
                  </v-radio-group>
                  <v-textarea v-if="itm.type === 'text-area'"
                                  :rules="item.validation"
                                  v-model="submission[itm.formName]"
                                  outlined></v-textarea>
                  <FileDrop v-if="itm.type === 'file-input'" data="itm" @sendFiles="captureFiles"></FileDrop>
                </li>
                <v-alert
                  border="bottom"
                  colored-border
                  type="warning"
                  elevation="4"
                  v-if="notSubmitted"
                >
                  {{submissionText}}</v-alert
                >
              </v-card-text>
              <v-row justify="end">
                <v-spacer></v-spacer>
                  <v-col>
                    <v-btn
                  v-if="el > 1"
                  color="primary"
                  @click="back()"
                  :loading="loading"
                  :disabled="loading"
                >
                  Go Back
                </v-btn>
                <v-btn v-if="el < items.length"
                  color="primary"
                  @click="next()"
                >
                  Continue
                </v-btn>

                <v-btn
                  v-if="el == items.length && canSubmit"
                  color="primary"
                  @click="submit()"
                  :loading="loading"
                  :disabled="loading || !valid"
                  >Submit</v-btn>

                </v-col>
              </v-row>
            </v-card>
          </v-form>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          
        </v-toolbar>
        <div class="row-class-div">
            <p color="error" class="justify-center top">Success!</p>
        </div>
        <div class="row-class-div">
            <p class="white-bold top-two">Thank You</p>
        </div>
        <div class="row-class-div">
            <p class="justify-center top-two">Our team will respond to you within the next 48hours</p>
        </div>
        <div class="row-class-div">
            <p class="justify-center">
              <v-btn
                depressed
                color="error"
                @click="refresh()"
              >
              Home
              </v-btn>
            </p>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
 </v-container>
</template>

<script>
import environment from "../../env";
import FileDrop from './FileDrop';
import axios from "axios";

import form from "../../form";
  export default {
    name: 'Main',
    components: {FileDrop},
    data () {
      return {
        el: 1,
        submission: {},
        items: form.items,
        valid: true,
        isSubmitted: false,
        loading: false,
        canSubmit: false,
        formUpload: false,
        dragover: false,
        notSubmitted: false,
        submissionText: '',
        filesToUpload: [],
        dialog: false,
        dialog2: true,
        notifications: false,
        sound: true,
        widgets: false,
        on: true
      }
    },

    mounted() {
      this.items.forEach((item) => {
        item.questions.forEach((question) => {
            this.submission[question.formName] = null;
        });
      });
      this.$refs.form[0].reset();
      this.valid = true;
    },

    watch: {
      filesToUpload(val) {
        if(val.length > 1 && this.el == 3) {
          this.canSubmit = true;
        } else {
          this.canSubmit = false;
        }
      }
    },

    methods: {
      submit() {
        console.log('submitted', this.submission);
        const uploadData = new FormData();

        uploadData.append('cv', this.filesToUpload[0]);
        uploadData.append('cover_letter', this.filesToUpload[1]);
        uploadData.append('first_name', this.submission['first_name']);
        uploadData.append('last_name', this.submission['last_name']);
        uploadData.append('email', this.submission['email']);
        uploadData.append('phone_number', this.submission['phone_number']);
        uploadData.append('about_you', this.submission['about_you']);
        uploadData.append('git_profile', this.submission['git_profile']);
        uploadData.append('live_in_uk', this.submission['live_in_uk']);
        uploadData.append('git_profile', this.submission['git_profile']);
                
        const url = environment.VUE_APP_ROOT_API;

        axios.post(url, uploadData, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
            })
            .then((res) => {
              console.log(res);
              this.dialog = true;
            })
            .catch((err) => {
                console.log("error", err);
                this.notSubmitted = true;
                this.submissionText = 'Your CV was not submitted at this time, please try again later';
            });
      },
      next() {
        if(!this.$refs.form[this.el - 1].validate()) {
          return;
        }
        this.el++;
      },
      back() {
        this.el--;
        if(this.isSubmitted) {
          this.isSubmitted = false;
        }
        if(this.notSubmitted) {
          this.notSubmitted = false;
        }
      },
      captureFiles(file) {
        this.filesToUpload.push(file);
      },
      refresh(){
        location.reload();
      },
      closeDialog(){
        location.reload();
      },
      beginApplication() {
        this.dialog2 = false;
      },
      darkMode() {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      }
    }
  }
</script>

<style scoped>
.v-btn {
  margin: 1em;
}
.required::after {
  content: "*";
  color: red;
}
.second-class{
    font-family: Verdana;
    font-size: 0.8rem;
    text-align: justify;
}
.white-bold {
  font-family: Verdana;
  font-size: 2rem;
  font-weight: bolder;
}
.row-class-div {
  display: flex;
  align-items: center;
  justify-content: center;
}
.row-class-p {
  flex: 100%;
}
.top {
  margin-top: 15%;
  color: #E53935;
  font-family: Verdana;
}
.top-two {
  margin-top: 2rem;
}
.top-one {
  margin-top: 2rem;
  font-weight: bolder;
  font-size: 3rem;
}
</style>
