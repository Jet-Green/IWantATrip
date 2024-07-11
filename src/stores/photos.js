import { defineStore } from "pinia";
import PhotosService from "../service/PhotosService";

export const usePhotos = defineStore('photos', () => {
    async function getPhotos(page) {
        return await PhotosService.getPhotos(page)
    }

    return { getPhotos }
})