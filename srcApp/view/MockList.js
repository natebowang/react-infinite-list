import React, {useEffect} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const style = {
    margin: '0.4rem',
    borderRadius: '0.2rem',
    background: '#e0f0f0',
    width: '35rem',
};

const MockList = ({items, dispatch, nextPageNo}) => {
    useEffect(() => {
        ifReachBottomMiddleware(dispatch, nextPageNo);
    });
    return (
        <>
            {items.map((item, key) => {
                return <div key={key} style={style}>{item.id} {item.title}</div>
            })}
        </>
    );
};
export default MockList;