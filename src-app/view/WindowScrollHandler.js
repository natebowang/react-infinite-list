import React, {useEffect, memo} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const WindowScrollHandler = memo(({dispatch}) => {
    const windowScrollHandler = (event) => {
        event.preventDefault();
        switch (event.type) {
            case 'scroll':
                ifReachBottomMiddleware(dispatch);
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

    return <></>;
});
export default WindowScrollHandler;
