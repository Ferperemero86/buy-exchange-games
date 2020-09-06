import React, {createContext, useReducer, useMemo} from "react";
import {sendLocalData} from "../../utils/API";
import {proposalsReducer} from "../../utils/reducers";

export const ProposalsContext = createContext();


const ProposalsProvider = ({children, pageProps}) => {
    const proposalsData = pageProps.proposals;

    const initialValues = {
       proposalsData
    };
    
    const [proposalsState, dispatchProposals] = useReducer(proposalsReducer, initialValues);

    const proposals = useMemo(() => {
        return proposalsState
    }, [proposalsState]);

    const organizeProposals = (proposals, userLogged) => {
        const exchangeProposalsSent = proposals.exProp.filter(prop => { return prop.sender_id === userLogged});
        const exchangeProposalsReceived = proposals.exProp.filter(prop => { return prop.recipient_id === userLogged});
        const sellingProposalsSent = proposals.sellProp.filter(prop => { return prop.sender_id === userLogged});
        const sellingProposalsReceived = proposals.sellProp.filter(prop => { return prop.recipient_id === userLogged});
    
        return {
            exchangeProposalsSent,
            exchangeProposalsReceived,
            sellingProposalsSent,
            sellingProposalsReceived
        }
    };

    const clearGame = async (e) => {
        const id = e.target.getAttribute("data");
    
        const proposalsData = await sendLocalData("/api/usersselling/proposal/delete", {id});
    
        if (proposalsData) {
            dispatchProposals({type: "UPDATE_PROPOSALS", payload: proposalsData})
        }
    };

    return <ProposalsContext.Provider 
            value={{
                proposals, 
                dispatchProposals,
                organizeProposals,
                clearGame
            }}>{children}</ProposalsContext.Provider>

}

export default ProposalsProvider;