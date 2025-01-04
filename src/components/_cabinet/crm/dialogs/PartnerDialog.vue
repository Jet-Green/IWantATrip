<script setup>
import PartnerCard from "../PartnerCard.vue"
import { ref, watch, toRefs } from "vue"

let props = defineProps({
  partner: Object,
  propsDialog: Boolean,
})
let emit = defineEmits(["close"])

let { partner, propsDialog } = toRefs(props)

let dialog = ref(false)

watch(propsDialog, (newDialog) => {
  dialog.value = newDialog
})
</script>
<template>
  <a-modal v-model:open="dialog" @cancel="emit('close')">
    <PartnerCard :partner="partner" />
    <template #footer>
      
    </template>
  </a-modal>
</template>
