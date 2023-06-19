<script setup>
defineProps(['user'])

function detectUserRole(roles) {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('manager')) return 'manager';
    return 'user'
}
</script>
<template>
    <div class="d-flex ma-4">
        <a-avatar :class="detectUserRole(user.roles)"
            style="margin-right: 8px; font-size: large; font-weight: bold; cursor: pointer" size="large">
            {{ detectUserRole(user.roles) }}
        </a-avatar>
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