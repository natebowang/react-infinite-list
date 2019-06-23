import ifReachBottomReducer, {
    setDownloading,
    ifReachBottomMiddleware
} from "./ifReachBottomReducer";

const itemsTemplate = [
    {
        "id": 1,
        "title": "HTTP headers for the responsible developer",
        "content": "A hidden Cupid in Vermeer’s Girl Reading a Letter at an Open Window, one of the world’s most famous paintings, is set to resurface on the canvas after two and a half centuries behind a layer of paint. During restoration work, conservators discovered, to their surprise, that the naked figure—which dominates the upper right section of the picture—was overpainted long after the artist’s death."
    },
    {
        "id": 2,
        "title": "Smartwatches sense hand activity",
        "content": "It was detected 40 years ago by x-ray, but scholars had always assumed that Vermeer himself painted over it, says Uta Neidhardt, the senior conservator at Dresden’s Gemäldegalerie. The decision to restore Cupid to the work was taken after recent laboratory tests established beyond doubt that the figure was overpainted decades after Vermeer completed it."
    },
];
let dispatch = jest.fn(() => {
    console.log('dispatch');
    setDownloading(false);
});
window.fetch = jest.fn(() => new Promise(resolve => (resolve({
    ok: true,
    status: 200,
    json: () => itemsTemplate,
}))));
window.innerHeight = 300;
window.scrollY = 100;

test('Dispatch ifReachBottomReducer when reach bottom', (done) => {
    Object.defineProperty(document.body, 'clientHeight', {
        get: jest.fn(() => 800),
        configurable: true,
    });
    ifReachBottomMiddleware(dispatch); // will not dispatch because not reach bottom
    Object.defineProperty(document.body, 'clientHeight', {
        get: jest.fn(() => 300),
        configurable: true,
    });
    ifReachBottomMiddleware(dispatch); // will dispatch
    ifReachBottomMiddleware(dispatch); // will not dispatch because downloading is true
    setTimeout(() => {
        expect(dispatch).toHaveBeenCalledTimes(1);
        done()
    }, 0); // will dispatch
});
