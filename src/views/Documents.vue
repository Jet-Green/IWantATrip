<script setup>
import BackButton from "../components/BackButton.vue";
</script>
<template>
    <div style="margin-top: 69px">
        <BackButton />
        <a-row class="justify-center d-flex d-column">
            <a-col :xs="22" :xl="16" class="mb-32">
                <h2>Документы</h2>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Оферта.pdf" target="_blank" style="font-weight: 700;">
                            Пользовательское соглашение (оферта)
                        </a>
                    </div>
                </div>
                <div class="description">
                    Правила использования цифровой туристической платформы «Города и веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Согласие на обработку персональных данных.pdf" target="_blank"
                            style="font-weight: 700;">
                            Правила обработки персональных данных
                        </a>
                    </div>
                </div>
                <div class="description">
                    Правила обработки персональных данных пользователей платформы «Города и веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Политика конфиденциальности.pdf" target="_blank"
                            style="font-weight: 700;">
                            Политика конфиденциальности
                        </a>
                    </div>
                </div>
                <div class="description">
                    Политика конфиденциальности ООО «Платформа Союз» регулирует сбор и защиту данных
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a  download href="../assets/documents/Договор турпродукт+конс.услуги.pdf" target="_blank"
                            style="font-weight: 700;">
                            Договор о реализации туристского продукта и об оказании консультационных услуг
                        </a>
                    </div>
                </div>
                <div class="description">
                    Договор о реализации туристского продукта и об оказании консультационных услуг платформы «Города и веси»
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Условия возврата оплаты.pdf" target="_blank"
                            style="font-weight: 700;">
                            Условия возврата оплаты на платформе «Города и веси»
                        </a>
                    </div>
                </div>
                <div class="description">
                    Условия возврата и оплаты
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Аннуляция группового тура.pdf" target="_blank"
                            style="font-weight: 700;">
                            Заявление на аннуляцию группового тура
                        </a>
                    </div>

                </div>

                <div class="description">
                    Документ для аннуляции группового тура
                </div>

                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Аннуляция тура.pdf" target="_blank" style="font-weight: 700;">
                            Заявление на аннуляцию тура
                        </a>
                    </div>
                </div>
                <div class="description">
                    Документ для аннуляции индивидуального тура
                </div>
                <a-divider></a-divider>

               

               




                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Согласие на размещение фото  видео в интернете.pdf"
                            target="_blank" style="font-weight: 700;">
                            Согласие на размещение фото и видео в интернете
                        </a>
                    </div>
                </div>
                <div class="description">
                    Согласие пользователей платформы «Города и веси» на размещение фото и видео в интернете
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Согласие родителей  на размещение фото  видео в интернете.pdf"
                            target="_blank" style="font-weight: 700;">
                            Согласие родителей на размещение фото и видео в интернете
                        </a>
                    </div>
                </div>
                <div class="description">
                    Согласие родителей на размещение фото и видео детей в интернете
                </div>
                <a-divider></a-divider>
                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a download href="../assets/documents/Сопровождение ребенка от агентства.pdf" target="_blank"
                            style="font-weight: 700;">
                            Сопровождение ребенка от агентства
                        </a>
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
<style>
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