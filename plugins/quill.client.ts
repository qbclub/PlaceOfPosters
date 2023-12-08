import { QuillEditor } from "@vueup/vue-quill";
import 'quill-paste-smart';
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('QuillEditor', QuillEditor)
})
