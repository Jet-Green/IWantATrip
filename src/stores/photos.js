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

    async function findPhotosOnModeration() {
        return await PhotosService.findPhotosOnModeration()
    }

    async function findRejectedPhotos() {
        return await PhotosService.findRejectedPhotos()
    }

    async function getPhotoById(_id) {
        return await PhotosService.getPhotoById(_id)
    }

    async function moderatePhoto(_id) {
        return await PhotosService.moderatePhoto(_id)
    }

    async function rejectPhoto(_id, msg) {
        return await PhotosService.rejectPhoto(_id, msg)
    }

    async function deletePhoto(_id) {
        return await PhotosService.deletePhoto(_id)
    }

    async function getMyPhotos(status, page) {
        return await PhotosService.getMyPhotos(status, page)
    }

    async function deleteMyPhoto(_id) {
        return await PhotosService.deleteMyPhoto(_id)
    }

    async function updateMyPhoto(_id, metadata) {
        return await PhotosService.updateMyPhoto(_id, metadata)
    }

    async function filterPublishedUrls(urls) {
        return await PhotosService.filterPublishedUrls(urls)
    }

    return {
        getPhotos,
        searchPhotos,
        uploadPhotobankPhotos,
        findPhotosOnModeration,
        findRejectedPhotos,
        getPhotoById,
        moderatePhoto,
        rejectPhoto,
        deletePhoto,
        getMyPhotos,
        deleteMyPhoto,
        updateMyPhoto,
        filterPublishedUrls,
    }
})
