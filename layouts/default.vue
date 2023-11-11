<script setup>

let drawer = ref(false)
let routeTo = (path) => {
    navigateTo(path)
}
</script>

<template>
    <v-app>
        <v-app-bar :elevation="0">
            <v-container>
                <v-row class="d-flex flex-nowrap justify-space-between align-center">
                    <div>
                        <img src="@/assets/logo.webp" class="logo cursor-pointer" @click="routeTo('/posters')" />
                    </div>
                    <div class="d-flex align-center">

                        <v-icon :class="{ active: isFiltered }" icon="mdi-filter-outline" @click="showFilter = !showFilter"></v-icon>

            <v-btn :ripple="false" class="rounded text-body-1 font-weight-regular"
              style="letter-spacing: normal !important; height: 40px;" prepend-icon="mdi-map-marker-outline"
              @click="showAddPlace = !showAddPlace">
              {{ location ? shortLocationName : "Место" }}
            </v-btn>

                        <v-icon class="d-none d-sm-block ma-2" icon="mdi-menu" @click.stop="drawer = !drawer"></v-icon>
                    </div>
                </v-row>

            </v-container>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" location="right" temporary elevation="0">
            <v-list nav>
                <v-list-item class="cursor-pointer" prepend-icon="mdi-post" to="/" exact :ripple="false">
                    Домой
                </v-list-item>
                <v-list-item class="cursor-pointer" prepend-icon="mdi-post" to="/posters" exact :ripple="false">
                    Афиши
                </v-list-item>
                <v-list-item class="cursor-pointer" prepend-icon="mdi mdi-information-variant" to="/info" exact
                    :ripple="false">
                    Информация
                </v-list-item>
                <v-list-item class="cursor-pointer" prepend-icon="mdi-plus" to="/create-post" exact :ripple="false">
                    Создать
                </v-list-item>

                <v-list-item class="cursor-pointer" prepend-icon="mdi-account" to="/cabinet" exact :ripple="false">
                    Кабинет
                </v-list-item>
                <!-- <v-list-item class="cursor-pointer" prepend-icon="mdi-security" to="/admin/moderation/on-moderation" exact
                    :ripple="false" v-if="authStore.user?.roles.includes('admin')">
                    Админ
                </v-list-item> -->
            </v-list>
        </v-navigation-drawer>

        <v-main class="pb-0">

            <NuxtPage />

        </v-main>


    </v-app>
</template>

<style lang="scss" scoped>
.header {
    border-radius: 0 0 10px 10px;
}

.logo {
    height: 50px;
}

.active {
    color: #ED413E;
}


</style>
