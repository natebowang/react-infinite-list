import React from 'react';

const MockList = ({items}) => {
    return (
        <>
            {items.map((item, key)=>{
                return <div key={key}>{item.id} {item.title}</div>
            })}
        </>
    );
};
export default MockList;