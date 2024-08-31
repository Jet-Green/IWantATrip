<script setup>
import BackButton from "../components/BackButton.vue";
import { useAppState } from '../stores/appState'
import { useRouter } from "vue-router";
const appStateStore = useAppState()

const router = useRouter()
let setDocLink = (link) => {
    appStateStore.docLink = link
    router.push('document')
}
</script>
<template>
    <div style="margin-top: 69px">
        <BackButton />
        <a-row class="justify-center d-flex d-column">
            <a-col :xs="22" :xl="16" class="mb-32">
                <h2>Документы</h2>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Оферта.pdf')">
                        Пользовательское соглашение (оферта)
                    </div>

                </div>
                <div class="description">
                    Правила использования цифровой туристической платформы «Города и веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Правила обработки перональных данных.pdf')">
                        Правила обработки персональных данных
                    </div>
                </div>
                <div class="description">
                    Правила обработки персональных данных пользователей платформы «Города и веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Политика конфиденциальности.pdf')">
                        Политика конфиденциальности
                    </div>
                </div>
                <div class="description">
                    Политика конфиденциальности ООО «Платформа Союз» регулирует сбор и защиту данных
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Договор турпродукт+конс.услуги.pdf')">
                        Договор о реализации туристского продукта и об оказании консультационных услуг
                    </div>
                </div>
                <div class="description">
                    Договор о реализации туристского продукта и об оказании консультационных услуг платформы «Города и
                    веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Условия возврата оплаты.pdf')">
                        Условия возврата оплаты на платформе «Города и веси»
                    </div>
                </div>
                <div class="description">
                    Условия возврата и оплаты
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Аннуляция группового тура.pdf')">
                        Заявление на аннуляцию группового тура
                    </div>

                </div>

                <div class="description">
                    Документ для аннуляции группового тура
                </div>

                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Аннуляция тура.pdf')">
                        Заявление на аннуляцию тура
                    </div>
                </div>
                <div class="description">
                    Документ для аннуляции индивидуального тура
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div> 
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Согласие на размещение фото  видео в интернете.pdf')">
                        Согласие на размещение фото и видео в интернете
                    </div>
                </div>
                <div class="description">
                    Согласие пользователей платформы «Города и веси» на размещение фото и видео в интернете
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Согласие родителей  на размещение фото  видео в интернете.pdf')">
                        Согласие родителей на размещение фото и видео в интернете
                    </div>
                </div>
                <div class="description">
                    Согласие родителей на размещение фото и видео детей в интернете
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>   
                    <div style="font-weight: 700; cursor: pointer;"
                        @click="setDocLink('/documents/Сопровождение ребенка от агентства.pdf')">
                        Сопровождение ребенка от агентства
                    </div>
                </div>
                <div class="description">
                    Согласие родителей (родителя)
                    на сопровождение несовершеннолетнего, не достигшего 14-и летнего возраста
                </div>
                <a-divider></a-divider>




            </a-col>
        </a-row>
    </div>
</template>
<style scoped>
.circle {
    height: 20px;
    aspect-ratio: 1;
    background-color: dimgray;
    margin: 8px;
    border-radius: 50%;
}

.description {
    font-size: 0.9em;
    opacity: 0.9;
}
</style>