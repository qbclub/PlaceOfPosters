<script setup>
definePageMeta({
    middleware: ['is-auth']
})

import getPossibleLocations from "~/utility/dadata";

let router = useRouter()
let appState = useAppStore()
let userStore = useAuth()
let posterStore = usePoster()
let priceStore = usePrice()

let form = reactive({
    title: '',//
    eventType: [],//
    eventSubtype: [],//
    eventLocation: null,
    organizer: '',
    phone: '',
    ageLimit: '',//
    price: '',//
    site: '',
    email: '',
    date: [],//
    posterType: '',
    endEventDate: null,//
    image: '',//
    description: ''//
})
let subcategories = ref([])
let visibleCropperModal = ref(false)
let blobImage;
let preview = ref()
let imagePreviewOverlay = ref(false)

let posterTypes = [
    {
        name: 'Событие',
        value: 'event'
    },
    {
        name: 'Место',
        value: 'place'
    }
]

let contract = ref('')

let editPosterId = localStorage.getItem('editPosterId')

let locationSearchRequest = ref('')
let possibleLocations = ref([]);
let buyDialog = ref(false)
let snackbar = ref(false)
let snackbarText = ref('')
let contractDialog = ref(false);

let formComponent = ref()

function resetForm() {
    form.title = ''
    form.eventType = []
    form.eventSubtype = []
    form.ageLimit = ''
    form.price = ''
    form.date = []
    form.endEventDate = null
    form.image = ''
    form.posterType = ''
    form.description = '<p><br></p>'
    localStorage.setItem('createPosterForm', '')
    localStorage.setItem('posterFormImage', '')
    preview.value = null;
}

// function format() {
//     let tempDate = form.date
//     if (tempDate) {
//         const day = tempDate.getDate();
//         const month = tempDate.getMonth() + 1;
//         const year = tempDate.getFullYear();
//         const hours = tempDate.getHours()
//         const minutes = tempDate.getMinutes()

//         return `${day}.${month}.${year} ${hours}:${minutes}`;
//     }

// }



const options = reactive({
    theme: 'snow',
    modules: {
        clipboard: {
            allowed: {
                tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span'],
                attributes: ['href', 'rel', 'target', 'class']
            },
            keepSelection: true,
            substituteBlockElements: true,
            magicPasteLinks: true,
            hooks: {
                uponSanitizeElement(node, data, config) {
                    console.log(node);
                },
            },
        },
    },
})

let rules = {
    title(value) {
        if (value.length <= 5) return 'нужно больше 5 символов'

        return true
    },
    eventType(value) {
        if (!value?.length) return 'укажите тип'
        return true
    },
    eventSubtype(value) {
        return true
    },
    eventLocation(value) {
        if (!value) return 'укажите локацию'
        return true
    },
    organizer(value) {
        if (value.length <= 3) return 'нужно больше 3 символов'
        return true
    },
    phone(value) {
        return true
    },
    ageLimit(value) {
        if (!value) return 'Укажите возрастное ограничение'
        return true
    },
    price(value) {
        return true
    },
    posterType(value) {
        return !!value
    },
    site(value) {
        if (value.length != 0 && value.length < 4) return 'минимум 4 символа'
        return true
    },
    email(value) {
        return true
    },

}

let closeDialog = async () => {
    buyDialog.value = false
    contractDialog.value = false
    await userStore.checkAuth()
    if (userStore.user.contracts.length) {
        contract.value = userStore.user.contracts[0].name
    }

}

let purchase = async () => {

    await userStore.getSubscriptionCount(userStore.user._id)
    buyDialog.value = false
    snackbarText.value = 'Афишы куплены'
    snackbar.value = true
    createPoster()
}

function addPreview(blob) {
    visibleCropperModal.value = false;
    blobImage = blob;

    let reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        let base64data = reader.result;
        preview.value = base64data;
        localStorage.setItem('posterFormImage', base64data)
    };
}
function deletePreview() {
    blobImage = null;
    preview.value = null
    localStorage.setItem('posterFormImage', '')
}
async function editPoster() {
    if (form.date) {
        form.date = form.date
            .filter((item) => { return item })
            .map((stringDate) => { return new Date(stringDate).getTime() })
    }
    let _id = editPosterId
    await posterStore.editPoster(form, _id, router.currentRoute.value.query.hotfix ?? 'false')

    if (blobImage) {
        let imagesFormData = new FormData();
        imagesFormData.append("poster-image", new File([blobImage], _id + ".jpg"), _id + ".jpg");
        await posterStore.uploadImage(imagesFormData, _id).then(() => { })
    }
    localStorage.setItem('editPosterId', '')

    if (router.currentRoute.value.query.hotfix == 'true')
        navigateTo('admin/appsettings/management')
    else
        navigateTo('/cabinet/posters/postersonmoderation');
}
async function createDraft() {
    try {
        if (userStore?.user.contracts.length) {
            if (form.date) {
                form.date = form.date
                    .filter((item) => { return item })
                    .map((stringDate) => { return new Date(stringDate).getTime() })
            }
            if (form.endEventDate) {
                form.endEventDate = (new Date(form.endEventDate)).getTime()
                console.log(form.endEventDate)
            }
            form.createdDate = Number(Date.now())
            form.contract = contract.value
            form.creator = userStore.user._id
            if (userStore?.user.contracts.length) {
                let _id = await posterStore.createPosterDraft(form)

                if (blobImage) {
                    let imagesFormData = new FormData();
                    imagesFormData.append("poster-image", new File([blobImage], _id + ".jpg"), _id + ".jpg");
                    await posterStore.uploadImage(imagesFormData, _id);
                }
                resetForm()
                navigateTo("/cabinet/posters/draftposters");
            }
        }

    } catch (error) {
        console.log(error);
    }
}
async function createPoster() {
    try {
        if (userStore?.user.contracts.length) {

            form.date = form.date
                .filter((item) => { return item })
                .map((stringDate) => { return new Date(stringDate).getTime() })
            if (form.endEventDate) {
                form.endEventDate = (new Date(form.endEventDate)).getTime()
            }
            form.createdDate = Number(Date.now())
            form.contract = contract.value
            form.creator = userStore.user._id
            let _id = await posterStore.createPoster(form)
            let imagesFormData = new FormData();
            imagesFormData.append("poster-image", new File([blobImage], _id + ".jpg"), _id + ".jpg");
            await posterStore.uploadImage(imagesFormData, _id);
            resetForm()
            navigateTo("/cabinet/posters/postersonmoderation");
        }
    } catch (error) {
        console.log(error);
    }
}

let errorSnackbar = ref(false)
let firstErrorText = ref('')
async function submit() {
    let validationResult = await formComponent.value.validate()

    let onModeration = await posterStore.getPosters(userStore.user._id, 'onModeration')
    if (!userStore.user.subscription.count || onModeration.length == userStore.user.subscription.count) {
        buyDialog.value = true
        return
    }

    try {
        if (!editPosterId) {
            if (!blobImage) {
                errorSnackbar.value = true
                firstErrorText.value = 'Добавьте фото'
                validationResult.valid = false
            }
            // <p><br></p> - стартовое значение
            if (form.description == '<p><br></p>' || form.description.split('p').length < 3) {
                errorSnackbar.value = true
                firstErrorText.value = 'Слишком короткое описание'
                validationResult.valid = false
            }

            if (validationResult.valid && userStore?.user.contracts.length) {
                createPoster()
            }
        } else {
            if (!blobImage && !preview.value) {
                errorSnackbar.value = true
                firstErrorText.value = 'Добавьте фото'
                validationResult.valid = false
            }
            // <p><br></p> - стартовое значение
            if (form.description == '<p><br></p>' || form.description.split('p').length < 3) {
                errorSnackbar.value = true
                firstErrorText.value = 'Слишком короткое описание'
                validationResult.valid = false
            }


            if (validationResult.valid && userStore?.user.contracts.length) {
                editPoster()
            }
        }
    } catch (error) {
        console.log(error);
    }
}

watch(form, (value) => {
    if (!editPosterId) { localStorage.setItem('createPosterForm', JSON.stringify(form)) }
    if (!userStore?.user.contracts.length) {
        contractDialog.value = true;
    }
})
watch(() => form.eventType, (newValue, oldValue) => {
    // subtype затирается при редактировании, когда заходишь на страницу
    if (oldValue.length)
        form.eventSubtype = []
    updateSubcategories()
})
function updateSubcategories() {
    subcategories.value = []
    appState.appState.eventTypes?.filter(category => form.eventType.includes(category.name)).map(category => subcategories.value = [...subcategories.value, ...category.subcategories])
}
watch(locationSearchRequest, async (value) => {
    possibleLocations.value = await getPossibleLocations(value);
});

onMounted(async () => {
    possibleLocations.value = await getPossibleLocations(locationSearchRequest.value)
    if (!appState.appState) {
        await appStateStore.getAppState()
    }
    updateSubcategories()

    if (!userStore?.user.contracts.length) {
        contractDialog.value = true;
    } else {
        contract.value = userStore?.user.contracts[0].name
    }
    if (editPosterId) {
        let data = await posterStore.getById(editPosterId)
        let formKeys = Object.keys(form)

        for (let key of Object.keys(data)) {
            if (formKeys.includes(key))
                form[key] = data[key]
        }

        preview.value = form.image



    } else {
        try {
            let formFromLocalStorage = JSON.parse(localStorage.getItem('createPosterForm'))
            if (formFromLocalStorage) {
                let formKeys = Object.keys(form)

                for (let key of Object.keys(formFromLocalStorage)) {
                    if (formKeys.includes(key))
                        form[key] = formFromLocalStorage[key]
                }

            }
        } catch (error) { }

        try {
            let posterFormImageFromLocalStorage = localStorage.getItem('posterFormImage')
            if (posterFormImageFromLocalStorage) {
                preview.value = posterFormImageFromLocalStorage

                const base64Response = await fetch(`${preview.value}`);
                blobImage = await base64Response.blob()
            }
        } catch (error) { }
    }

    await priceStore.fetchPrices()

})
onBeforeUnmount(() => {
    localStorage.setItem('editPosterId', '')
})

function getCategory(category) {
    return appState.appState.eventTypes.find(item => item.name === category)
}
</script>
<template>
    <v-container>
        <BackButton />

        <v-row class="d-flex justify-center">
            <v-col cols="12" sm="11" md="10" lg="9">
                <div class="d-flex justify-space-between align-center flex-wrap">
                    <div class="order-sm-1">
                        <v-autocomplete hide-details density="compact" v-model="contract" item-title="name"
                            item-value="name" :items="userStore.user?.contracts" placeholder="Рекламодатель"
                            variant="outlined" />
                    </div>
                    <div>
                        <div><b>Рекламодатель</b><span>*</span></div>
                        {{ contract }}
                    </div>

                </div>


            </v-col>

        </v-row>
        <h2 class="text-center" v-if="!editPosterId">Создание афишы</h2>
        <h2 class="text-center" v-else>Изменить афишу</h2>
        <v-row class="d-flex justify-center">
            <v-col cols="12" sm="11" md="10" lg="9">
                <v-form @submit.prevent="submit" ref="formComponent" fast-fail>
                    <v-row>
                        <v-col cols="12" md="6">
                            <b>Название</b><span>*</span>
                            <v-textarea maxlength="140" :rules="[rules.title]" rows="1" auto-grow
                                placeholder="День двора" v-model="form.title" variant="outlined"
                                density="compact"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                            <b>Организатор</b><span>*</span>
                            <v-textarea maxlength="100" auto-grow rows="1" max="2" :rules="[rules.organizer]"
                                placeholder="клуб Кубит" v-model="form.organizer" density="compact"
                                variant="outlined"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <b>Категории</b><span>*</span>
                            <v-select hide-details :rules="[rules.eventType]" v-model="form.eventType" item-title="name"
                                item-value="name" :items="appState.appState.eventTypes" no-data-text="нет данных"
                                placeholder="Концерт" variant="outlined" density="compact" multiple chips clearable />
                        </v-col>
                        <v-col cols="12" md="6">
                            <b>Подкатегории</b>
                            <v-select hide-details :rules="[rules.eventSubtype]" density="compact"
                                v-model="form.eventSubtype" item-title="name" item-value="name" :items="subcategories"
                                placeholder="Концерт" no-data-text="нет данных" variant="outlined" multiple chips
                                disabled />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <b>Место</b><span>*</span>
                            <v-autocomplete hide-details :rules="[rules.eventLocation]" density="compact"
                                v-model="form.eventLocation" v-model:search="locationSearchRequest"
                                :items="possibleLocations" item-title="name" placeholder="Место" item-value="geo"
                                variant="outlined" clearable>
                                <template v-slot:no-data>
                                    <div class="pt-2 pr-4 pb-2 pl-4">
                                        {{
                            locationSearchRequest.trim().length < 3 ? "Минимум 3 символа" : "Не найдено" }}
                                            </div>
                                </template>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <b>Телефон</b>
                            <v-text-field :rules="[rules.phone]" density="compact" v-model="form.phone"
                                placeholder="89009999999" variant="outlined" />
                        </v-col>

                        <v-col cols="6" md="3">
                            <b>Возраст</b><span>*</span>
                            <v-autocomplete hide-details :rules="[rules.ageLimit]" density="compact"
                                v-model="form.ageLimit" item-title="name" item-value="name"
                                :items="['0+', '6+', '12+', '14+', '16+', '18+', '21+']" placeholder="12+"
                                no-data-text="нет данных" variant="outlined" />
                        </v-col>
                        <v-col cols="6" md="3">
                            <b>Стоимость</b>
                            <v-textarea auto-grow rows="1" :rules="[rules.price]" density="compact" v-model="form.price"
                                placeholder="100 рублей" variant="outlined" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <b>Сайт или соц. сеть</b>
                            <v-text-field :rules="[rules.site]" density="compact" v-model="form.site"
                                placeholder="https://my-super-event.ru" variant="outlined" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <b>Email</b>
                            <v-text-field :rules="[rules.email]" density="compact" v-model="form.email"
                                placeholder="my-super-event@gmail.com" variant="outlined" />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="d-flexalign-end h-100">
                                <v-btn @click="form.date.push(null)">Добавить время</v-btn>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <b v-if="form.date.length">Время начала </b>
                            <div v-for="date, index in form.date " :key="index" class="d-flex align-center">
                                <!-- :format="format" для пиккера надо добавить -->
                                <VueDatePicker locale="ru" v-model="form.date[index]" class="mb-1"
                                    minutes-grid-increment="2" input-class-name="dp-custom-input"
                                    placeholder="дата и время" :transitions="{
                            open: 'fade',
                            close: 'fade',
                        }" />

                                <v-icon icon="mdi-trash-can-outline" color="accent" style="cursor:pointer"
                                    @click="form.date.splice(index, 1);"></v-icon>
                            </div>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" sm="6">
                            <b>Время окончания</b>

                            <!-- :format="format" для пиккера надо добавить -->
                            <VueDatePicker v-model="form.endEventDate" locale="ru" minutes-grid-increment="2"
                                input-class-name="dp-custom-input" placeholder="дата и время" :transitions="{
                            open: 'fade',
                            close: 'fade',
                        }" />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <b>Место / событие *</b>

                            <v-select hide-details :rules="[rules.posterType]" v-model="form.posterType"
                                item-title="name" item-value="value" :items="posterTypes" placeholder="Событие"
                                variant="outlined" density="compact" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="4">
                            <v-btn>добавить изображение<span>*</span>
                                <v-dialog v-model="visibleCropperModal" activator="parent">
                                    <v-row class="justify-center">
                                        <v-col cols="12" md="8" lg="6">
                                            <v-card class="pa-4 rounded-lg">
                                                <ImageCropper @addImage="addPreview" />

                                                <v-card-actions>
                                                    <v-btn @click="visibleCropperModal = false" color="error"
                                                        class="ml-auto">
                                                        закрыть
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-dialog>
                            </v-btn>
                            <v-img :src="preview" width="200" class="my-2">
                                <v-overlay :open-on-click="true" v-model="imagePreviewOverlay" contained
                                    class="align-center justify-center" activator="parent">
                                    <v-btn color="error" @click="deletePreview" icon>
                                        <span class="mdi mdi-delete"></span>
                                    </v-btn>
                                </v-overlay>
                            </v-img>
                        </v-col>

                        <v-col cols="12" md="8">
                            <b>Описание </b><span>*</span>
                            <ClientOnly fallback-tag="span" fallback="Loading on server...">

                                <QuillEditor theme="snow" ref="quill" contentType="html"
                                    v-model:content="form.description" :toolbar="[
                            ['bold', 'italic', 'underline'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            [{ color: ['#000000', '#ED413E'] }],
                            [{ align: [] }],
                            ['link'],
                            ['clean']
                        ]" :options="options">

                                </QuillEditor>
                            </ClientOnly>
                        </v-col>
                    </v-row>
                    <v-row class="d-flex justify-center">
                        <v-col class="d-flex justify-space-around align-center flex-wrap pa-8 mb-8">
                            <v-btn class="ma-2" @click="navigateTo({ name: 'PosterPreview' })">
                                Посмотреть
                            </v-btn>
                            <v-btn class="ma-2" @click="resetForm">
                                Очистить
                            </v-btn>
                            <v-btn color="accent" type="submit" class="ma-2">
                                Отправить
                            </v-btn>
                            <v-btn @click="createDraft" class="ma-2">
                                В черновики
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
            <v-snackbar v-model="errorSnackbar" :timeout="3200">
                <div class="text-center text-body-1">
                    {{ firstErrorText }}
                </div>
            </v-snackbar>

            <v-snackbar v-model="snackbar" color="success" :timeout="2000">
                {{ snackbarText }}
                <template v-slot:actions>
                    <v-btn @click="snackbar = false" density="compact" icon="mdi-close"></v-btn>
                </template>
            </v-snackbar>

            <v-dialog v-model="buyDialog" width="auto">
                <v-card class="pa-2">
                    <v-card-title> Покупка и отправка </v-card-title>
                    <Buy @closeDialog="closeDialog" @purchase="purchase" />
                </v-card>
            </v-dialog>
            <v-dialog v-model="contractDialog" width="auto">
                <v-card class="pa-2">
                    <ContractForm @closeDialog="closeDialog" />
                </v-card>
            </v-dialog>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped></style>