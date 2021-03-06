import React, {useEffect} from 'react';
import {ifReachBottomMiddleware} from "../reducer/ifReachBottomReducer";

const style = {
    margin: '0.4rem',
    borderRadius: '0.2rem',
    background: '#e0f0f0',
    width: '35rem',
};

const MockList = ({items, dispatch}) => {
    useEffect(() => {
        ifReachBottomMiddleware(dispatch);
    });
    return (
        <>
            {items.map((item, key) => {
                return <div key={key} style={style}>{key} {item.title}</div>
            })}
        </>
    );
};
export default MockList;