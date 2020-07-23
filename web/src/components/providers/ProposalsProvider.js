import React, {createContext, useReducer, useMemo} from "react";

import {proposalsReducer} from "../../utils/reducers";


export const ProposalsContext = createContext();


const ProposalsProvider = ({children, pageProps}) => {
    const proposalsData = pageProps.proposals;

    const initialValues = {
       proposalsData
    }
    
    const [proposalsState, dispatchProposals] = useReducer(proposalsReducer, initialValues);

    const proposals = useMemo(() => {
        return proposalsState
    }, [proposalsState])
       
    return <ProposalsContext.Provider value={{proposals, dispatchProposals}}>{children}</ProposalsContext.Provider>

}

export default ProposalsProvider;