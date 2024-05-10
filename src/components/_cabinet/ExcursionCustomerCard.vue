<script setup>
defineProps({
    customer: Object
})

function getPhoneNumber(number) {
    return `tel:${number}`;
}
</script>

<template>
<a-card hoverable class="card">
                            <div class="d-flex space-between"></div>
                                <div>
                                    <span class="mdi mdi-account-outline" style=""></span>
                                    {{ customer}}

                                </div>
                                <div>
                                    <span class="mdi mdi-map-marker-outline" style=""></span>
                                    {{ customer}}
                                </div>
                                <div>
                                    <span class="mdi mdi-phone-outline" style=""></span>
                                    <a :href="getPhoneNumber('88005553535')">
                                        {{ customer}}</a>
                                </div>
                        </a-card>
</template>
