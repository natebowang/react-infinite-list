// return a promise of a object in original backend server format
// if status is not 200, throw error instead of return.
const getJsonObject = apiUrl => (signal = null, page = 0, size = 20, sort = '') => {
    return fetch(apiUrl + '?page=' + page + '&size=' + size + '&sort=' + sort, {signal: signal})
        .then(throwIfNot200)
        .then(response => response.json())
};
export default getJsonObject;

const throwIfNot200 = response => {
    if (response.status === 200) {
        return response;
    } else {
        throw new Error(response.status + ' ' + response.statusText);
    }
};

