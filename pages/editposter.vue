<script setup>
import axios from "axios";
import getPossibleLocations from "~/utility/dadata";

definePageMeta({
    middleware: ['is-auth']
})

let router = useRouter()
let userStore = useAuth()
let posterStore = usePoster()
let priceStore = usePrice()
let appState = await getAppState()

let _id = useRoute().query._id
let poster = await posterStore.getById(_id)

let form = reactive(Object.assign({
    title: '',
    eventType: [],
    eventSubtype: [],
    eventLocation: null,
    organizer: '',
    phone: '',
    ageLimit: '',
    price: '',
    site: '',
    email: '',
    date: [],
    posterType: '',
    endEventDate: null,
    image: '',
    description: ''
}, poster))

let subcategories = ref([])
let visibleCropperModal = ref(false)
let blobImage
let updatedImage = ref(false)
let preview = ref(form.image)
let imagePreviewOverlay = ref(false)

let posterTypes = [{
    name: 'Событие',
    value: 'event'
}, {
    name: 'Место',
    value: 'place'
}]

let locationSearchRequest = ref('')
let possibleLocations = ref([]);

let formComponent = ref()

const options = {
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
}

let rules = {
    title(value) {
        if (value.length <= 2) return 'нужно больше 2 символов'
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

function addPreview(blob) {
    visibleCropperModal.value = false
    blobImage = blob
    updatedImage.value = true

    let reader = new FileReader()

    reader.readAsDataURL(blob)
    reader.onloadend = function () {
        let base64data = reader.result
        preview.value = base64data
    }
}
function deletePreview() {
    blobImage = null
    preview.value = null
}

let snackbar = ref(false)
let errorSnackbar = ref(false)
let firstErrorText = ref('')

async function submit() {
    let validationResult = await formComponent.value.validate()

    try {
        if (!blobImage && !preview.value) {
            errorSnackbar.value = true
            firstErrorText.value = 'Добавьте фото'
            validationResult.valid = false
        }

        if (form.description == '<p><br></p>' || form.description.split('p').length < 3) {
            errorSnackbar.value = true
            firstErrorText.value = 'Слишком короткое описание'
            validationResult.valid = false
        }

        if (!validationResult.valid) return
        
        if (form.date)
            form.date = form.date.map(stringDate => new Date(stringDate).getTime())
        
        await posterStore.editPoster(form, _id, useRoute().query.hotfix ?? 'false')

        if (updatedImage.value) {
            let imagesFormData = new FormData()
            imagesFormData.append("poster-image", new File([blobImage], _id + ".jpg"), _id + ".jpg")
            await posterStore.uploadImage(imagesFormData, _id)
        }

        router.back()
    } catch (error) {
        console.log(error)
    }
}

watch(() => form.eventType, (newValue, oldValue) => {
    if (oldValue.length)
        form.eventSubtype = []
    updateSubcategories()
})

function updateSubcategories() {
    subcategories.value = []
    appState.value.eventTypes.filter(category => form.eventType.includes(category.name)).map(category => subcategories.value = [...subcategories.value, ...category.subcategories])
}

watch(locationSearchRequest, async (value) => {
    possibleLocations.value = await getPossibleLocations(value)
})

onMounted(async () => {
    possibleLocations.value = await getPossibleLocations(locationSearchRequest.value)
    updateSubcategories()
    priceStore.fetchPrices()
})

function getCategory(category) {
    return appState.value.eventTypes.find(item => item.name === category)
}
</script>

<template>
    <v-container>
        <BackButton />

        <v-row class="d-flex justify-center">
            <v-col cols="12" sm="11" md="10" lg="9">
                <div class="d-flex justify-space-between align-center flex-wrap">
                    <div class="order-sm-1">
                        <v-autocomplete hide-details density="compact" v-model="form.contract" item-title="name"
                            item-value="name" :items="userStore.user?.contracts" placeholder="Рекламодатель"
                            variant="outlined" />
                    </div>
                    <div>
                        <div><b>Рекламодатель</b><span>*</span></div>
                        {{ form.contract }}
                    </div>
                </div>
            </v-col>
        </v-row>

        <h2 class="text-center">Изменить афишу</h2>

        <v-row class="d-flex justify-center">
            <v-col cols="12" sm="11" md="10" lg="9">
                <v-form @submit.prevent="submit" ref="formComponent" fast-fail>
                    <v-row>
                        <v-col cols="12" md="6">
                            <b>Название</b><span>*</span>
                            <v-textarea maxlength="140" :rules="[rules.title]" rows="1" auto-grow placeholder="День двора"
                                v-model="form.title" variant="outlined" density="compact"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6">
                            <b>Организатор</b><span>*</span>
                            <v-textarea maxlength="100" auto-grow rows="1" max="2" :rules="[rules.organizer]"
                                placeholder="клуб Кубит" v-model="form.organizer" density="compact"
                                variant="outlined"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="24">
                            <b>Категории</b><span>*</span>

                                <v-autocomplete hide-details :rules="[rules.eventType]" v-model="form.eventType"
                                item-title="name" item-value="name" :items="appState.eventTypes"
                                no-data-text="нет данных" placeholder="Концерт" variant="outlined" density="compact"
                                multiple chips clearable > 
                            </v-autocomplete>
                            <div style="font-size: 14px;">
                                Не больше 3х категорий
                            </div>
                                  
                        </v-col>
                        <!-- <v-col cols="12" md="6">
                            <b>Подкатегории</b>
                            <v-select hide-details :rules="[rules.eventSubtype]" density="compact"
                                v-model="form.eventSubtype" item-title="name" item-value="name" :items="subcategories"
                                placeholder="Концерт" no-data-text="нет данных" variant="outlined" multiple chips
                                disabled />
                        </v-col> -->
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
                            <v-autocomplete hide-details :rules="[rules.ageLimit]" density="compact" v-model="form.ageLimit"
                                item-title="name" item-value="name" :items="['0+', '6+', '12+', '14+', '16+', '18+', '21+']"
                                placeholder="12+" no-data-text="нет данных" variant="outlined" />
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
                                    minutes-grid-increment="2" input-class-name="dp-custom-input" placeholder="дата и время"
                                    :transitions="{
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
                            <VueDatePicker 
                                v-model="form.endEventDate"
                                locale="ru" 
                                minutes-grid-increment="2" 
                                input-class-name="dp-custom-input" 
                                placeholder="дата и время"
                                :transitions="{
                                    open: 'fade',
                                    close: 'fade',
                                }" 
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <b>Место / событие *</b>

                            <v-select 
                                hide-details 
                                :rules="[rules.posterType]" 
                                v-model="form.posterType" 
                                item-title="name"
                                item-value="value" 
                                :items="posterTypes"
                                placeholder="Событие" 
                                variant="outlined" 
                                density="compact" 
                            />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="4">
                            <v-btn> добавить афишу<span>*</span>
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
                            <v-img :src="preview" width="200" class="my-2" alt="Изображение не загрузилось">
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

                                <QuillEditor theme="snow" ref="quill" contentType="html" v-model:content="form.description"
                                    :toolbar="[
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
                            <v-btn color="accent" type="submit" class="ma-2">
                                Отправить
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
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped></style>