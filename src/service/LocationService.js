import $api from "../plugins/axios";

export default {
    fetchLocations() {
        return $api.get('/location/get-all')
    },
    searchLocation(r) {
        return $api.get(`/location/search?name=${r}`)
    },
    selectUserLocation(location, userId) {
        return $api.post(`/location/select-user-location?user_id=${userId}`, location)
    },
    createLocation(location) {
        return $api.post(`/location/create-location`, {location})
    },
    uploadImage(image) {
        return $api.post(`/location/upload-image`, image)
    },
    deletePhotoFromLocation(_id) {
          return $api.post(`/location/delete-photo`, {_id})
    }
}

/**
 * Человекочитаемое название локации.
 * Локация может быть объектом DaData ({ name, shortName, coordinates }),
 * строкой (старые записи) или массивом локаций.
 * @param {object|string|Array|null|undefined} location
 * @returns {string} пустая строка, если названия нет
 */
export function locationName(location) {
    if (!location) return ""

    if (Array.isArray(location)) {
        return location.map(locationName).filter(Boolean).join(", ")
    }

    if (typeof location === "string") return location.trim()

    return (location.name || location.shortName || "").trim()
}

/**
 * Короткое название локации — город/населённый пункт.
 * @param {object|string|Array|null|undefined} location
 * @returns {string}
 */
export function locationShortName(location) {
    if (!location) return ""

    if (Array.isArray(location)) {
        return location.map(locationShortName).filter(Boolean).join(", ")
    }

    if (typeof location === "string") return location.trim()

    return (location.shortName || location.name || "").trim()
}
