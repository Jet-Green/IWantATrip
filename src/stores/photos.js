import { defineStore } from "pinia";
import PhotosService from "../service/PhotosService";

export const usePhotos = defineStore('photos', () => {
    async function getPhotos() {
        return await PhotosService.getPhotos()
    }

    return { getPhotos }
})