import React, {useEffect} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const WindowScrollHandler = ({children, dispatch, nextPageNo}) => {
    const windowScrollHandler = (event) => {
        event.preventDefault();
        switch (event.type) {
            case 'scroll':
                ifReachBottomMiddleware(dispatch, nextPageNo);
                break;
            default:
                throw(new Error('No such handler ' + event.type));
        }
    };

    useEffect(() => {
        ['scroll'].forEach(event => window.addEventListener(event, windowScrollHandler));
        return () => {
            ['scroll'].forEach(event => window.removeEventListener(event, windowScrollHandler));
            dispatch({type: 'abortFetchItems'});
        };
    }, []);

    return <>{children}</>;
};
export default WindowScrollHandler;
