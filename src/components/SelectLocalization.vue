<script setup>
import { onMounted, watch, ref } from "vue"
import { useI18n } from "vue-i18n"

let i18n = useI18n()

let selectedLocale = ref()
console.log(i18n.availableLocales)

let options = ref(
  i18n.availableLocales.map((name) => {
    return { name }
  })
)

watch(selectedLocale, (newLocale) => {
  i18n.locale.value = newLocale
  localStorage.setItem("localization", newLocale)
})

onMounted(() => {
  let localizationFromLocalStorage = localStorage.getItem("localization")
  if (localizationFromLocalStorage) {
    // it will trigger watch and locale will be set
    selectedLocale.value = localizationFromLocalStorage
  }
})
</script>
<template>
  <a-select v-model:value="selectedLocale" :fieldNames="{ label: 'name', value: 'name' }" :options="options"></a-select>
  <!-- <select v-model="selectedLocale">
    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
  </select> -->
</template>
