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
