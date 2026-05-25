<script setup>
import { onMounted, ref } from 'vue';
import { useCompanions } from '../../stores/companions';

let companions = ref([])
const companionStore = useCompanions()

async function acceptCompanion(companionId) {
    let res = await companionStore.acceptCompanion(companionId)
    if (res.status == 200) {
        for (let i = 0; i < companions.value.length; i++) {
            if (companions.value[i]._id == companionId) {
                companions.value.splice(i, 1)
            }
        }
    }
}

async function deleteCompanion(_id) {
    let res = await companionStore.deleteCompanion(_id)

    if (res.status == 200) {
        for (let i = 0; i < companions.value.length; i++) {
            if (companions.value[i]._id == _id) {
                companions.value.splice(i, 1)
            }
        }
    }
}

const clearData = (dateNumber) => {
    let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    })
    if (date !== 'Invalid Date' && date) {
        return date
    }
    return ''
}
const ageString = (age) => {
    age = age.toString()
    if (age >= 10 && age <= 20) {
        return `${age} лет`;
    }
    let arr = age.split("");
    let lastNumber = arr[arr.length - 1];
    if (lastNumber == 1) {
        return `${age} год`;
    }
    if (lastNumber == 2 || lastNumber == 3 || lastNumber == 4) {
        return `${age} года`;
    }
    return `${age} лет`;
}; // это гениально

onMounted(async () => {
    let res = await companionStore.getCompanionsOnModeration()
    companions.value = res.data
})
</script>
<template>
    <a-row>
        <a-col :span="24">
            <h3>Попутчики на модерации</h3>
            <a-row :gutter="[8, 8]" class="mt-8">
                <a-col :lg="8" :sm="12" :xs="24" v-for="companion in companions">
                    <a-card class="card" hoverable>
                        <div>
                            <MdiIcon name="human-male-female" />{{ companion.name }}
                            <MdiIcon name="human-cane" />{{ ageString(companion.age) }}
                        </div>

                        <div>
                            <MdiIcon name="compass-outline" />{{ companion.direction }}
                        </div>
                        <div :class="[
                            companion.companionGender == 'Мужчина'
                                ? 'male'
                                : companion.companionGender == 'Женщина'
                                    ? 'female'
                                    : 'not-matter',
                        ]">
                            <MdiIcon v-if="request.gender == Female" name="gender-female" />
                            <MdiIcon v-if="request.gender == Male" name="gender-female" />
                            <MdiIcon v-else name="human-male-female" />
                            {{ companion.companionGender == "Мужчина" ? "Мужчину" : companion.companionGender ==
                                "Женщина" ? "Женщину" : "Не важно"
                            }}
                        </div>
                        <div>
                            <MdiIcon name="calendar-arrow-right" />
                            {{ `c ${clearData(companion.start)}` }}
                            <MdiIcon name="calendar-arrow-left" />
                            {{ `по ${clearData(companion.end)}` }}
                        </div>

                        <div>
                            <MdiIcon name="list-status" />{{ companion.description }}
                        </div>
                        <div class="actions d-flex justify-center">
                            <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет"
                                @confirm="deleteCompanion(companion._id)">
                                <MdiIcon style="color: #ff6600;" name="delete" />
                            </a-popconfirm>
                            <a-popconfirm title="Принять?" ok-text="Да" cancel-text="Нет"
                                @confirm="acceptCompanion(companion._id)" class="d-flex align-center">
                                <MdiIcon style="color: #245159;" name="check-decagram-outline" />
                            </a-popconfirm>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>
<style lang="scss" scoped>
.actions {
    font-size: 20px;
    position: relative;

    * {
        margin: 4px;
        cursor: pointer;
    }
}

.women {
    background: rgba(255, 102, 0, 0.05);
}

.men {
    background: rgba(34, 176, 214, 0.05);
}

.table_header {
    text-align: center;
}

.card {
    position: relative;

    .mdi {
        margin: 4px;
    }

    .accept {
        position: absolute;
        top: -6px;
        right: -6px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .male {
        color: rgba(34, 176, 214);
    }

    .female {
        color: rgb(255, 102, 0);
    }

    .not-matter {
        color: rgb(111, 133, 43);
    }
}
</style>