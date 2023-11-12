import $api from "../plugins/axios";

export default {
    getOrganization() {
        return $api.get('/ord/get-organisation')
    },
   


    // яндекс орд методы
    createOrganisation(form) {

        return $api.post('/ord/create-organisation', form)
    },
    createPlatform(form) {
        return $api.post('/ord/create-platform', form)
    },
    createContract(form) {
        console.log(form)
        return $api.post('/ord/create-contract', form)
    },
    createCreative(form) {
        return $api.post('/ord/create-creative', form)
    },
    createInvoice(form) {
        return $api.post('/ord/create-invoice', form)
    },
    createInvoiceCreative(form) {
        return $api.post('/ord/create-invoice-creative', form)
    },
    sendStatistic() {
        return $api.post('/ord/send-statistic')
    }
} 
