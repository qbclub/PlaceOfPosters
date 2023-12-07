<script setup>
const userStore = useAuth()

let user = ref(userStore.user)
</script>
<template>
  <v-container>
    <v-row>
      <v-col class="d-flex flex-row flex-nowrap align-center">
        <v-avatar style="font-size: large" class="font-weight-bold" color="surface-variant" size="large">
          {{ user.firstname[0] }}
        </v-avatar>

        <span class="text-h6 font-weight-bold ml-4" style="font-size: 28px">
          {{ user.firstname }} {{ user.lastname }}
        </span>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <div style="color: grey">E-mail</div>
            <div>
              {{ user.email }}
            </div>
          </v-col>

          <v-col>
            <div style="color: grey">Телефон</div>
            <div>
              {{ user.phone }}
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <div style="color: grey">Фамилия Имя</div>
            <div>{{ user.firstname }} {{ user.lastname }}</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
