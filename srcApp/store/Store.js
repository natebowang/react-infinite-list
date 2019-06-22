import React, {createContext, useReducer} from 'react';

export const Ctx = createContext();

const Store = ({children, reducer}) => {
    const [store, dispatch] = useReducer(reducer, new InitStore());

    return (
        <Ctx.Provider value={{store, dispatch}}>
            {children}
        </Ctx.Provider>
    )
};
export default Store;

class InitStore {
    constructor() {
        this.items = [];
    }
}
