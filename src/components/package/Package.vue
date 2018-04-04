<template>
  <v-dialog v-model="showPackage" persistent max-width="400px">
    <v-card v-show="step === listStep.choseTypePackage">
      <v-toolbar class="header">
        <v-toolbar-title>Lựa chọn gói</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-list one-line>
            <v-radio-group v-model="radioGroup">
              <template v-for="(item, index) in listPackage">
                <v-list-tile >
                  <v-list-tile-action>
                    <v-radio v-model="item.price"></v-radio>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>{{ item.price }}</v-list-tile-action>
                </v-list-tile>
              </template>
            </v-radio-group>
          </v-list>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat >  Đăng nhập
          </v-btn>
          <div class="btn-last">Quên mật khẩu</div>
        </v-flex>
        <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat >Đóng</v-btn>
          <div class="btn-last">Đăng ký</div>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    data () {
      return {
        showPackage: true,
        radioGroup: 1,
        step: 1,
        listStep: {
          choseTypePackage: 1
        },
        listPackage: [
          {
            name: 'GOI 1',
            price: 1
          },
          {
            name: 'GOI 2',
            price: 2
          }
        ]
      }
    }
  }
</script>