import { defineStore } from "pinia";
import IdeaService from "../service/IdeaService";

export const useIdea = defineStore('idea', () => {
    async function createIdea(idea) {
        return await IdeaService.createIdea(idea)
    }

    return { createIdea }
})