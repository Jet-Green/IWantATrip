<script setup>
import { useTrips } from '../stores/trips'
import { ref, onMounted, onUnmounted, toRef, getCurrentInstance } from 'vue'
import BackButton from "../components/BackButton.vue";
const API_URL = import.meta.env.VITE_API_URL

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const tripStore = useTrips()

let BILL = toRef(tripStore.printContractTour)

const print = async (BILL) => {

    await htmlToPaper('printMe');
};

const clearData = (dateNumber) => {

    dateNumber = dateNumber - BILL?.value?.tripId?.timezoneOffset
    const date = new Date(dateNumber);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ru-RU", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            timeZone: 'UTC' // Используем UTC для гарантии, что время будет в формате UTC
        });
    }
    return '';
};
onMounted(() => {

})
onUnmounted(() => {
    tripStore.printContractTour = {}
})


</script>
<template>
    <div>
        <BackButton />
        <div style="text-align: center;">
            <a-button style="margin:20px" @click="print()">Печать</a-button>

        </div>
        <a-row type="flex" justify="center" class="mb-8">
            <a-col :xs="22" :lg="16">

                <div class="contract" id="printMe">
                    <h3 style="text-align: center; margin: 40px;">Договор от <b>{{ clearData(BILL?.date) }}</b> </h3>
                    <p class="info-block"> <b>{{ BILL?.seller.name }} (ИНН:{{ BILL?.seller.inn }})</b>, в дальнейшем
                        “Продавец”, с
                        одной стороны и
                        <b>{{ BILL?.touristsList[0]?.fullname }}</b>,в дальнейшем “Покупатель”, с другой стороны,
                        заключили
                        настоящий Договор о нижеследующем:
                    </p>

                    <h4 class="section-title">1. ПРЕДМЕТ ДОГОВОРА</h4>
                    <p>Продавец обязуется предоставить Покупателю услуги на следующих условиях:</p>
                    <ul>
                        <li>Название тура: <b>{{ BILL?.tripId.name }}</b></li>
                        <li>Дата тура: c <b>{{ clearData(BILL?.tripId.start) }}</b> по <b>{{ clearData(BILL?.tripId.end)
                                }}</b> </li>
                        <li>Программа тура: <a :href="`${API_URL}/trip?_id=${BILL.tripId._id}`"><b>{{
                            `${API_URL}/trip?_id=${BILL?.tripId._id}`}}</b></a> </li>
                        <li>В стоимость включено: <b>{{ BILL.tripId.includedInPrice }}</b></li>
                          <li>Условия возврата: <b>{{ BILL.tripId.returnConditions }}</b></li>
                        <li>Туристы по данному заказу: <b>{{ (BILL?.touristsList.map((list) => list.fullname).join())
                                }}</b>
                        </li>
                        <li>Общая стоимость составляет: <b>{{ BILL?.billTotal }} руб.</b> </li>
                    </ul>

                    <h4 class="section-title">2. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h4>

                    <h4>2.1. Продавец обязан:</h4>
                    <ul>
                        <li>Предоставить Покупателю (туристу) услуги, предусмотренные данным договором.</li>
                        <li>Оформить сопроводительные к туру документы в соответствии с настоящим договором.</li>
                        <li>Уведомить о предстоящей поездке за 24 часа СМС-уведомлением с номером автобуса и контактным
                            номером
                            гида. <i>В случае, если СМС-уведомление не пришло за 12 часов до тура (экскурсии) нужно
                                связаться с нами
                                по телефону: <b>{{ BILL?.tripId.tinkoffContract.Phones[0] }}</b></i>
                        </li>
                        <li>Обеспечить надлежащее качество предоставляемых услуг и информации по туру.</li>
                    </ul>

                    <h4>2.2. Продавец имеет право:</h4>
                    <ul>
                        <li>
                            Изменить дату поездки при переносе мероприятия, либо при других существенных
                            обстоятельствах,
                            независимых от Продавца, заранее согласовав новые условия с Покупателем не позднее, чем за 3
                            суток до
                            отъезда.
                        </li>
                    </ul>
                    <h4>2.3. Покупатель обязан:</h4>
                    <ul>
                        <li>Сообщить свои достоверные контактные данные для связи. </li>
                        <li>Оплатить стоимость тура в размере, порядке и в сроки, указанные в конкретном туре. </li>
                        <li>В случае если оплата была внесена частично, остаток суммы вносится за 10 дней до экскурсии
                            или
                            тура.
                            Если при
                            бронировании тура (экскурсии) до даты тура осталось менее 10 дней, то оплата вносится
                            полностью.
                        </li>
                        <li>Покупатель обязан явиться на посадку в установленное время, иметь при себе документы:
                            паспорт
                            (свидетельство
                            о рождении для детей), страховой медицинский полис, пенсионное удостоверение (при наличии),
                            иные
                            документы
                            на предоставление льгот. </li>
                        <li>Иметь согласие на передачу персональных данных третьих лиц (участников поездки) по данному
                            туру.
                        </li>



                    </ul>
               
                    <h4>2.4. Покупатель имеет право:</h4>
                    <ul>
                        <li>Произвести замену туриста в случае невозможности участия в туре с соблюдением
                            порядка
                            оформления транспортных документов всех перевозчиков по туру.</li>
                        <li>Отказаться от тура с удержанием фактически понесённых расходов Продавцом, указанных в
                            описании
                            условий
                            по
                            каждому конкретному туру. </li>
                    </ul>

                    <p class="seller">

                    <p> <b>Продавец: {{ BILL?.seller?.name }}</b> </p>
                    <div>ИНН: {{ BILL?.seller?.inn }} КПП: {{ BILL?.seller?.kpp }}</div>
                    <div>ОГРН: {{ BILL?.seller?.ogrn }} ОКВЕД: {{ BILL?.seller?.okved }} </div>
                    <div>
                        Р/с {{ BILL?.seller?.bankAccount?.account }} {{ BILL?.seller.bankAccount.bankName }}

                    </div>
                    <div>БИК {{ BILL?.seller.bankAccount.bik }}</div>
                    <div>Юр. адрес: {{ BILL?.seller.addresses[1].zip }}, {{ BILL?.seller.addresses[1].city }}, {{
                        BILL?.seller.addresses[1].street }}</div>
                    <div>Факт адрес: {{ BILL?.seller.addresses[0].zip }}, {{ BILL?.seller.addresses[0].city }}, {{
                        BILL?.seller.addresses[0].street }}</div>
                    <div>Тел: <b>{{ BILL?.tripId.tinkoffContract.Phones[0] }}</b> </div>
                    <div>E-mail: {{ BILL?.seller.email }} </div>
                    </p>
                    <p>____________________/ {{ BILL?.seller.ceo.firstName[0] }}. {{ BILL?.seller.ceo.middleName[0] }}.
                        {{ BILL?.seller.ceo.lastName }} /</p>


                    <div>
                        <p><b>Покупатель: {{ BILL?.touristsList[0]?.fullname }}</b> </p>
                        <p>Телефон: <b>{{ BILL?.touristsList[0]?.phone }}</b> </p>
                        <p>____________________ / ________________ /</p>
                    </div>


                </div>
            </a-col>
        </a-row>
    </div>
</template>
<style scoped>



</style>
