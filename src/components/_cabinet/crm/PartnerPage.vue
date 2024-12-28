<script setup>
let partner = ref({})
</script>
<template>
  <div>
    {{ partner }}
    <h3>
      {{ partner.name }}
    </h3>

    <h3>Контактное лицо</h3>
    <div class="second-level">
      <div class="contact-item">
        <span class="mdi mdi-account-outline"></span>
        {{ partner.contactPerson }}
      </div>

      <a :href="`mailto:${partner.email}`" class="contact-item">
        <span class="mdi mdi-email-fast-outline"></span>
        {{ partner.email }}
      </a>
      <a :href="`tel:${partner.phone}`" class="contact-item">
        <span class="mdi mdi-phone-outline"></span>
        {{ partner.phone }}
      </a>
    </div>

    <template #footer>
      <a-button @click="emit('close')">ок</a-button>
    </template>
  </div>
</template>
<style scoped lang="scss">
.contact-item {
  display: flex;
  align-items: center;

  .mdi {
    font-size: 20px;
    margin-right: 10px;
  }
}
.second-level {
  margin-left: 14px;
}
</style>
