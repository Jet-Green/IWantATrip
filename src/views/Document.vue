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
                        <a href="../../public/documents/Аннуляция группового тура.pdf" target="_blank"
                            style="font-weight: 700;">
                            Заявление на аннуляцию группового тура
                        </a>
                    </div>

                </div>

                <div class="description">
                    Если вы хотите аннулировать групповой тур, то вы должны заполнить этот документ
                </div>

                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a href="../../public/documents/Аннуляция тура.pdf" target="_blank" style="font-weight: 700;">
                            Заявление на аннуляцию тура
                        </a>
                    </div>
                </div>
                <div class="description">
                    Если вы хотите аннулировать тур, то вы должны заполнить этот документ
                </div>
                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a href="../../public/documents/Договор турпродукт+конс.услуги.pdf" target="_blank"
                            style="font-weight: 700;">
                            Договор о реализации туристского продукта и об оказании консультационных услуг
                        </a>
                    </div>
                </div>
                <div class="description">
                    Договор необходимый для турагентов
                </div>
                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a href="../../public/documents/Условия возврата оплаты.pdf" target="_blank"
                            style="font-weight: 700;">
                            Условия возврата оплаты на платформе ГОРОДА И ВЕСИ
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
                        <a href="../../public/documents/Оферта.pdf" target="_blank" style="font-weight: 700;">
                            Оферта
                        </a>
                    </div>
                </div>
                <div class="description">
                    Пользовательское соглашение платформы ГОРОДА И ВЕСИ
                </div>
                <a-divider></a-divider>

                <div class="d-flex align-center">
                    <div class="circle"></div>
                    <div>
                        <a href="../../public/documents/Согласие на обработку персональных данных" target="_blank"
                            style="font-weight: 700;">
                            Согласие на обработку персональных данных
                        </a>
                    </div>
                </div>
                <div class="description">
                    Согласие на обработку персональных данных
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