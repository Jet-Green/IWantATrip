<script setup>


defineProps({
    form: Object,
    calcIndividualCost: Number,
    calcGroupCost: Number,
    transportCost: Number,
    result: Object,
    resultArray: Object

})
</script>
<template>
    <h2>{{ form.name }}</h2>
    <div v-for="(item, index) in form.individualCost" :key="index"
        style="display: flex; justify-content: flex-end; column-gap: 20px">
        <div>{{ item.type }} --</div>
        <div>{{ item.price }} руб.</div>
    </div>

    <div style="text-align: right">
        <b>Индивидуальные расходы:{{ calcIndividualCost }} руб.</b>
    </div>

    <div v-for="(item, index) in form.groupCost" :key="index"
        style="display: flex; justify-content: flex-end; column-gap: 20px">
        <div>{{ item.type }} --</div>
        <div>{{ item.price }} руб.</div>
    </div>
    <div style="text-align: right">
        <b>Групповые расходы:{{ calcGroupCost }} руб.</b>
    </div>

    <div v-for="(item, index) in form.transportCost" :key="index"
        style="display: flex; justify-content: flex-end; column-gap: 20px">
        <div>{{ item.type }}({{ item.capacity }}) --</div>
        <div>{{ item.price }} руб.</div>
    </div>
    <div style="text-align: right">
        <b>Расходы на транспорт:{{ transportCost }} руб.</b>
    </div>

    <div style="text-align: right; margin-top: 10px">
        {{ `Туристов: ${form.tourists} чел.` }}
    </div>
    <div style="text-align: right">
        {{ `Стоимость тура: ${form.tourePrice} руб.` }}
    </div>

    <div class="result" style="
                                                  display: flex;
                                                  align-items: end;
                                                  flex-direction: column;
                                                  margin-top: 10px;
                                                ">
        <div>
            Себестоимость:
            {{ result.cost }} руб.
        </div>
        <div>
            Затраты на 1 человека:
            {{ result.costForOne }} руб.
        </div>
        <div>
            Общий доход:
            {{ result.totalPrice }} руб.
        </div>
        <div>Прибыль: {{ result.profit }} руб.</div>

        <div>
            Рентабельность:
            {{
                result.profitability
                ? result.profitability
                : 0
            }}%
        </div>
    </div>
    <div>
        <b>Прибыль в зависимости от количества туристов</b>
    </div>
    <div style="display: flex;
                        font-size: 10px;
                        margin: 20px;
                        border: 1px solid black;
                        flex-wrap: wrap;">
        <div v-for="(item, index) in resultArray.profit" :key="index" style="
                                       margin: 4px;
                                                    display: flex;
                                                    align-items: center;
                                                    flex-direction: column;
                                                  ">
            <div style="font-size: 8px; text-decoration: underline">
                {{ index + 1 }}чел
            </div>
            <div>{{ item }}</div>
        </div>
    </div>
</template>