import React, {useEffect, memo} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const WindowResizeHandler = memo(({dispatch}) => {
    const windowResizeHandler = (event) => {
        event.preventDefault();
        switch (event.type) {
            case 'resize':
                ifReachBottomMiddleware(dispatch);
                break;
            default:
                throw(new Error('No such handler ' + event.type));
        }
    };

    useEffect(() => {
        ['resize'].forEach(event => window.addEventListener(event, windowResizeHandler));
        return () => {
            ['resize'].forEach(event => window.removeEventListener(event, windowResizeHandler));
        };
    }, []);

    return <></>;
});
export default WindowResizeHandler;