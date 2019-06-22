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

    // Must run every rerender, because handler use nextPageNo,
    // if not update, nextPageNo will always be 0
    useEffect(() => {
        ['scroll'].forEach(event => window.addEventListener(event, windowScrollHandler));
        return () => {
            ['scroll'].forEach(event => window.removeEventListener(event, windowScrollHandler));
        };
    });
    useEffect(() => {
        return () => {
            dispatch({type: 'abortFetchItems'});
        };
    }, []);

    return <>{children}</>;
};
export default WindowScrollHandler;
