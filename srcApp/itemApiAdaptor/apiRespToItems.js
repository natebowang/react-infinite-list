// Transform original backend format to items array format
const apiRespToItems = obj => {
    let items = obj;
    if (items === undefined) {
        // Sometimes you need to get items from like obj.xs,
        // then you need to check if obj has xs.
        throw new Error('Wrong JSON format.')
    } else {
        return items;
    }
};
export default apiRespToItems;