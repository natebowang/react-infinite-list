import React from 'react';

const NextPage = ({children, dispatch}) => {
    const nextPageHandler = (event) => {
        event.preventDefault();
        dispatch({
            type: 'nextPage',
        });
    };
    return (
        <>
            {children}
            <button onClick={nextPageHandler}>Next Page</button>
        </>
    )
};
export default NextPage;
