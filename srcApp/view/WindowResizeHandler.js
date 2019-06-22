import React, {useEffect} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const WindowResizeHandler = ({children, dispatch, nextPageNo}) => {
    const windowResizeHandler = (event) => {
        event.preventDefault();
        switch (event.type) {
            case 'resize':
                ifReachBottomMiddleware(dispatch, nextPageNo);
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
    return <>{children}</>
};

export default WindowResizeHandler;