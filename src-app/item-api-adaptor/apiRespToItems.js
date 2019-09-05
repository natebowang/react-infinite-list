// Transform original backend format to items array format
const apiRespToItems = obj => {
    let items = obj;
    if (items === undefined) {
        // Sometimes you need to get items from like obj.xs,
        // then you need to check if obj has xs.
        console.error('Wrong JSON format.');
        throw new Error('Sorry something went wrong with the server. Please try again later.');
    } else {
        return items;
    }
};
export default apiRespToItems;