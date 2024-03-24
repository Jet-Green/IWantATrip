import $api from "../plugins/axios"

export default {
    createIdea(idea) {
        return $api.post('/idea/create-idea', idea)
    }
}