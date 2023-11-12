<script setup>
import { ref, watch } from 'vue';

let props = defineProps({
	modelValue: {
		type: String,
		required: true,
		default: null
	},
	first: {
		type: Boolean,
		default: false
	},
	label: {
		type: String
	},
	placeholder: {
		type: String
	},
	'error-messages': {
		type: Array
	},
	'insert-dadata': {
		type: Boolean
	},
	phone: {
		type: Boolean
	}
})
let emit = defineEmits(['update:modelValue'])

let model = ref('')

watch(model, (value) => {
	emit('update:modelValue', value)
})
</script>

<template>
	<v-row class="w-100 flex-row">
		<v-col cols="6" :class="`mt-2 text-submit-1 ${!props.first ? 'text-right' : ''}`">
			<slot />
		</v-col>

		<v-col cols="6">
			<v-text-field 
				v-model="model"
				:label="props.label"
				:placeholder="placeholder"
				:error-messages="errorMessages"
				density="compact"
				variant="outlined"
			/>
		</v-col>
	</v-row>
</template>