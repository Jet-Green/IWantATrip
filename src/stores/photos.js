import { defineStore } from "pinia";
import PhotosService from "../service/PhotosService";

export const usePhotos = defineStore('photos', () => {
    async function getPhotos(page) {
        return await PhotosService.getPhotos(page)
    }

    async function searchPhotos(q, page) {
        return await PhotosService.searchPhotos(q, page)
    }

    async function uploadPhotobankPhotos(formData) {
        return await PhotosService.uploadPhotobankPhotos(formData)
    }

    return { getPhotos, searchPhotos, uploadPhotobankPhotos }
})