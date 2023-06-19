<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../../stores/auth'

let { user } = defineProps(['user'])
let userStore = useAuth()

let modified = ref(false)

function detectUserRole(roles) {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('manager')) return 'manager';
    return 'user'
}

let roles = ['manager', 'admin']
let clickCount = ref(roles.indexOf(detectUserRole(user.roles)) + 1)

async function changeUserRole() {
    let res = await userStore.updateUser(user)
    if (res.status == 200) {
        modified.value = false
    }
}

watch(clickCount, (newClickCount) => {
    modified.value = true
    user.roles = ['user', ...roles.slice(0, newClickCount % 3)]
})
</script>
<template>
    <div class="d-flex ma-4">
        <a-tooltip placement="top">
            <template #title>
                <span>Изменить роль</span>
            </template>
            <a-avatar :class="detectUserRole(user.roles)"
                style="margin-right: 8px; user-select: none; font-size: large; font-weight: bold; cursor: pointer"
                size="large" @click="clickCount++">
                {{ detectUserRole(user.roles) }}
            </a-avatar>
        </a-tooltip>
        <a-row>
            <a-col :span="24" style="font-weight: 700">
                <span>{{ user.fullname }}</span>
            </a-col>
            <a-col :span="24">
                <span style="font-weight: 400; font-size: 12px;">
                    {{ user.email }}
                </span>
            </a-col>
        </a-row>
        <a-row>
            <a-col class="d-flex justify-center align-center" v-if="modified">
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

// .user {

// }

.manager {
    background: #3daff5;
}
</style>