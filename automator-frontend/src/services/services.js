import axios from "axios"


export const waiter = async () => {
    try {
        return await axios.get(`/api/waiter`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getDbPediaByKeyword = async (keyword) => {
    try {
        return await axios.get(`/api/dbpedia/search/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getImageFileNames = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getimagefilenames/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getDownloadableImageURL = async (keyword) => {
    try {
        return await axios.get(`/api/wikimedia/getimageurl/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getPerson = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getperson/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getWikiCoord = async (keyword) => {
    try {
        return await axios.get(`/api/wikipedia/getcoord/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}

export const getCoordinate = async (keyword) => {
    try {
        return await axios.get(`/api/geonames/getcoordinate/${keyword}`);
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}


// Save
export const saveArtefact = async (keyword) => {
    try {
        // return await axios.get(`/api/geonames/getcoordinate/${keyword}`);
        return "SaveArtefact Success!"
    } catch (error) {
        return {
            error: error.message,
            inValid: true
        }
    }
}