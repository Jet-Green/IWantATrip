<script setup>
import { ref } from 'vue'
let images = ref([
    { src: 'https://downloader.disk.yandex.ru/preview/203f3dcda376dc0ca3fbe8303931394ce69cc12a139638b5f8138f3b80aa6596/668e1eae/eCnTe9d7afyBzwMrLeLhxeq6SIF53y-vkuwd2rSJxHUrDTGxlleRXSMTp6M7JI_QEBvNqAOb_-saJI4Q3ZWE9Q%3D%3D?uid=0&filename=DSC_0005.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
    { src: 'https://downloader.disk.yandex.ru/preview/62826d0fc639d93f069c3e904212d2b3dd805a478cf4f3356434093fa3160ae7/668e1eae/Mm77ZAgvVJBJt1I9LAkmVyBIi-3y7CEv1Czvwtwu38AbWd30RqcUQOu9eZSqmfEp-FeDVvmwEfOgWCNHl1d-PQ%3D%3D?uid=0&filename=DSC_0007%20%282%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 2' },
    { src: 'https://downloader.disk.yandex.ru/preview/4d794136a37fe10526ff6fb882bee2fa51ad4ddda5640b42011dd436cc4616f0/668e1eae/vc9BAjVfjMP77OA4iSXRWzc-pH4NaL-H2zd4GKnjSr_l3WXJr2p4CWrYOWxPmvxlMFirJIHhHKhfEcQrVPIGLA%3D%3D?uid=0&filename=DSC_0007%20%283%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 3' },
    { src: 'https://downloader.disk.yandex.ru/preview/285f48468bc9adb22f121a98d4c701cf27d03c7db26c82d95c45b1ea29b068bc/668e1eae/f1mP2TnLHjx9CZp40QHTQn3-ZBscVa2IK_BpyzjyYJtwxFM3ioQC619l4LEU507RcplgvU2GbYAwrJMVy5EdlA%3D%3D?uid=0&filename=DSC_0009%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 4' },
    { src: 'https://downloader.disk.yandex.ru/preview/52b68bac90babbe465b498829f67c28f66c9ace72f962bc8fc8787fe02bb159d/668e1eae/gKCsqslUGnrAMl907LAd3KiNlSx2OU2u4ayoQcLwHkBIvX_1ekMB_9SLeo749GCytLonVrOFVAYIxCAmbOwWNw%3D%3D?uid=0&filename=DSC_0011%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
    { src: 'https://downloader.disk.yandex.ru/preview/de68664fccca0be3de8e3e8f77238d47ab7401c802a63695d1010c77bf020265/668e1eae/-HKBNw2Zde3AG2NP17x0WhWaUWcDCTUWeKKV6oxnYmNuXWyaA_F0UEKsL6UWJGUXm8TyWhHjTg6Zj5_66hk79w%3D%3D?uid=0&filename=DSC_0011%20%282%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 2' },
    { src: 'https://downloader.disk.yandex.ru/preview/09848727981335755d2433a2fcfa36f4f5aabfaf3efa473742bc13e63c19c6a5/668e1eae/6it7exVKQoYViGExmZ4ShOQuI4tbo5cVD9su9BvRdCVPii9H-l0OJ9zBbiHcc7KbmkJ7fJa7eSDxLRLUQ8gqSw%3D%3D?uid=0&filename=DSC_0012.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 3' },
    { src: 'https://downloader.disk.yandex.ru/preview/20978b254b17a233a578966c88b34b6679510f951362af6c78a30fbae9095346/668e1eae/F5Nn7Q5hmqMrRbKQDOhHWBBni4ORi5IISyyg7mt_B823YV4CRKMdk2RxKaRABfcEX9KCulNDhznil6IOgT-fcA%3D%3D?uid=0&filename=DSC_0013%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 4' },
    { src: 'https://downloader.disk.yandex.ru/preview/061504b21d97573367b25e79eab4dc322c1d7ad7145820ed667e9998b9bdcd55/668e1eae/pmBE1nLitYHz8BARQKTaqRpKlgcmkLIfX03YWpgwiO3X785vsin9K2IyVWsskkYRmY9Ga0OcmTpBo8UiKHQhGA%3D%3D?uid=0&filename=DSC_0015%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
    { src: 'https://downloader.disk.yandex.ru/preview/203f3dcda376dc0ca3fbe8303931394ce69cc12a139638b5f8138f3b80aa6596/668e1eae/eCnTe9d7afyBzwMrLeLhxeq6SIF53y-vkuwd2rSJxHUrDTGxlleRXSMTp6M7JI_QEBvNqAOb_-saJI4Q3ZWE9Q%3D%3D?uid=0&filename=DSC_0005.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
    { src: 'https://downloader.disk.yandex.ru/preview/62826d0fc639d93f069c3e904212d2b3dd805a478cf4f3356434093fa3160ae7/668e1eae/Mm77ZAgvVJBJt1I9LAkmVyBIi-3y7CEv1Czvwtwu38AbWd30RqcUQOu9eZSqmfEp-FeDVvmwEfOgWCNHl1d-PQ%3D%3D?uid=0&filename=DSC_0007%20%282%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 2' },
    { src: 'https://downloader.disk.yandex.ru/preview/4d794136a37fe10526ff6fb882bee2fa51ad4ddda5640b42011dd436cc4616f0/668e1eae/vc9BAjVfjMP77OA4iSXRWzc-pH4NaL-H2zd4GKnjSr_l3WXJr2p4CWrYOWxPmvxlMFirJIHhHKhfEcQrVPIGLA%3D%3D?uid=0&filename=DSC_0007%20%283%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 3' },
    { src: 'https://downloader.disk.yandex.ru/preview/285f48468bc9adb22f121a98d4c701cf27d03c7db26c82d95c45b1ea29b068bc/668e1eae/f1mP2TnLHjx9CZp40QHTQn3-ZBscVa2IK_BpyzjyYJtwxFM3ioQC619l4LEU507RcplgvU2GbYAwrJMVy5EdlA%3D%3D?uid=0&filename=DSC_0009%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 4' },
    { src: 'https://downloader.disk.yandex.ru/preview/52b68bac90babbe465b498829f67c28f66c9ace72f962bc8fc8787fe02bb159d/668e1eae/gKCsqslUGnrAMl907LAd3KiNlSx2OU2u4ayoQcLwHkBIvX_1ekMB_9SLeo749GCytLonVrOFVAYIxCAmbOwWNw%3D%3D?uid=0&filename=DSC_0011%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
    { src: 'https://downloader.disk.yandex.ru/preview/de68664fccca0be3de8e3e8f77238d47ab7401c802a63695d1010c77bf020265/668e1eae/-HKBNw2Zde3AG2NP17x0WhWaUWcDCTUWeKKV6oxnYmNuXWyaA_F0UEKsL6UWJGUXm8TyWhHjTg6Zj5_66hk79w%3D%3D?uid=0&filename=DSC_0011%20%282%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 2' },
    { src: 'https://downloader.disk.yandex.ru/preview/09848727981335755d2433a2fcfa36f4f5aabfaf3efa473742bc13e63c19c6a5/668e1eae/6it7exVKQoYViGExmZ4ShOQuI4tbo5cVD9su9BvRdCVPii9H-l0OJ9zBbiHcc7KbmkJ7fJa7eSDxLRLUQ8gqSw%3D%3D?uid=0&filename=DSC_0012.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 3' },
    { src: 'https://downloader.disk.yandex.ru/preview/20978b254b17a233a578966c88b34b6679510f951362af6c78a30fbae9095346/668e1eae/F5Nn7Q5hmqMrRbKQDOhHWBBni4ORi5IISyyg7mt_B823YV4CRKMdk2RxKaRABfcEX9KCulNDhznil6IOgT-fcA%3D%3D?uid=0&filename=DSC_0013%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 4' },
    { src: 'https://downloader.disk.yandex.ru/preview/061504b21d97573367b25e79eab4dc322c1d7ad7145820ed667e9998b9bdcd55/668e1eae/pmBE1nLitYHz8BARQKTaqRpKlgcmkLIfX03YWpgwiO3X785vsin9K2IyVWsskkYRmY9Ga0OcmTpBo8UiKHQhGA%3D%3D?uid=0&filename=DSC_0015%20%281%29.JPG&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=3024x1646', alt: 'Image 1' },
])
const visible = ref(false);
let activePhoto = ref('')
let show = (index)=> {
    visible.value = true
    activePhoto.value = images.value[index].src
    console.log(activePhoto.value)
}

</script>
<template>
    <a-row class="d-flex justify-center" >
        <a-col :xs="22" :lg="16">
            <masonry-wall :items="images" :ssr-columns="1" :column-width="200" :gap="8" >
                <template #default="{ item, index }">
                    <div>
                        



                        <a-image :preview="{ visible: false }" :src="item.src" @click="show(index)"  loading="lazy"/>

                    </div>
                </template>
            </masonry-wall>
            <div style="display: none; " >
                <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
                    <a-image 
                        :src="activePhoto" 
                        />
                </a-image-preview-group>
            </div>
        </a-col>
    </a-row>
</template>
<style lang="scss" scoped>
img {
    width: 100%;
    height: auto;
}
.ant-image-preview-mask {

background-color: rgba(0, 0, 0, 1) ;
} 
</style>