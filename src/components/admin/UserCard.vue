<script setup>
import { ref, watch, computed, toRefs } from 'vue'
import { useAdmin } from '../../stores/admin'

let props = defineProps({ userFromDb: {} })
let { userFromDb } = toRefs(props)

let adminStore = useAdmin()

let detectedUserRole = computed(() => {
    if (userFromDb.value.roles.includes('admin')) return 'admin';
    if (userFromDb.value.roles.includes('manager')) return 'manager';
    return 'user'
})

let roles = ["user", 'manager', 'admin']
let clickCount = ref(roles.indexOf(detectedUserRole.value))

async function changeUserRole() {
    let res = await adminStore.changeUserRoles(userFromDb.value.email, userFromDb.value.roles)

    if (res.status == 200) {
        userFromDb.value.modified = false
    }
}
watch(clickCount, (newClickCount) => {
    // не влияет на юзера никак, мы не сохраняем в базу. Нужно для рекативности
    userFromDb.value.modified = true

    if (newClickCount % 3 == 0) {
        userFromDb.value.roles = ['user']
    } else if (newClickCount % 3 == 1) {
        userFromDb.value.roles = ['user', 'manager']
    } else {
        userFromDb.value.roles = ['user', 'manager', 'admin']
    }
})
</script>
<template>
    <div class="d-flex">
        <a-tooltip placement="top">
            <template #title>
                <span>Изменить роль</span>
            </template>
            <a-avatar :class="detectedUserRole"
                style="margin-right: 8px; user-select: none; font-size: large; font-weight: bold; cursor: pointer"
                size="large" @click="clickCount += 1">
                {{ detectedUserRole }}
            </a-avatar>
        </a-tooltip>
        <a-row>
            <a-col :span="24" style="font-weight: 700">
                <span>{{ userFromDb.fullname }}</span>
            </a-col>
            <a-col :span="24">
                <span style="font-weight: 400; font-size: 12px;">
                    {{ userFromDb.email }}
                </span>
            </a-col>
        </a-row>
        <a-row>
            <a-col class="d-flex justify-center align-center" v-if="userFromDb.modified">
                <a-button size="small" shape="round" @click="changeUserRole">
                    <span class="mdi mdi-check"></span>
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>
<style lang="scss" scoped>
.admin {
    background: #ff6600;
}

.manager {
    background: #3daff5;
}
</style>