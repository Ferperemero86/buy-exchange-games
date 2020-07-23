import React, {useContext} from "react";

import {sendLocalData} from "../../utils/API";

import {ProposalsContext} from "../../components/providers/ProposalsProvider";

import Game from "../../components/games/Game";
import BasicUserInfo from "../../components/usersGames/BasicUserInfo";
import CloseIcon from "../../components/CloseIcon";

export async function getServerSideProps(ctx) {
    let userLogged = ctx.req.user ? ctx.req.user.id : null;
    const URLBase = ctx.req.headers.host;
    const Url = new URL("/api/proposals", `http://${URLBase}`).href;

    if (!userLogged) { return {login: false} }

    const proposals = await sendLocalData(Url, {userId: userLogged});
    
    return { props: {proposals, userLogged} }
}


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
}

const Heading = ({title}) => {
    return <h2 className="proposals-heading">{title}</h2>
}

const SellingGames = ({proposals}) => {
    const {dispatchProposals} = useContext(ProposalsContext);

    const clearGame = async (e) => {
        const id = e.target.getAttribute("data");
    
        const proposalsData = await sendLocalData("/api/usersselling/proposal/delete", {id});
    
        if (proposalsData) {
            dispatchProposals({type: "UPDATE_PROPOSALS", payload: proposalsData})
        }
    }

    if (Array.isArray(proposals) && proposals.length > 0) {
        return proposals.map(proposal => {
            const game = proposal.proposals.content;
            const profile = proposal.proposals.userProfile;

            return (
                <div className="proposals-selling-game"
                     key={game.id}>
                    <CloseIcon 
                        data={proposal.id}
                        text="Clear"
                        className="clear-selling-game-icon"
                        onClick={clearGame} />
                    <BasicUserInfo
                        nickName={profile.nickName}
                        userId={profile.id} />
                    <Game
                        Url={game.cover}
                        title={game.name} />
                </div>
            )
        })
    }
    return null;
}

const ExchangingGames = ({proposals, userLogged}) => {
    const {dispatchProposals} = useContext(ProposalsContext);

    const clearGame = async (e) => {
        const id = e.target.getAttribute("data");
    
        const proposalsData = await sendLocalData("/api/usersexchanging/proposal/delete", {id});
    
        dispatchProposals({type: "UPDATE_PROPOSALS", payload: proposalsData})
    
    }

    if (Array.isArray(proposals) && proposals.length > 0) {
        return proposals.map((proposal, index) => {
                const game1 = proposal.proposals.gameContent1;
                const game2 = proposal.gameContent2;
                const profile1 = proposal.proposals.userProfile1;
                const profile2 = proposal.proposals.userProfile2;
                
                return (
                    <div key={index} className="exchanging-proposal">
                        <div className="proposal-game">
                            {userLogged !== profile1.id && <BasicUserInfo
                                nickName={profile1.nickName}
                                userId={profile1.id} />}
                            <CloseIcon 
                                data={proposal.id}
                                text="Clear"
                                className="clear-exchanging-game-icon"
                                dispatchFunc={dispatchProposals}
                                onClick={clearGame} />
                            <Game
                                Url={game1.cover}
                                title={game1.name} />
                        </div>
                        <div className="proposal-game">
                            {userLogged !== profile2.id && <BasicUserInfo
                                    nickName={profile2.nickName}
                                    userId={profile2.id} />}
                            <Game
                                Url={game2.cover}
                                title={game2.name} />
                        </div>
                    </div>
                )
            })
    }
    return null;
}

const ExchangingProposals = ({proposals, heading, userLogged}) => {
    return (
        <div className="exchanging-proposals">
            {proposals.length > 0 && <Heading title={heading} />}
            <ExchangingGames 
                proposals={proposals} 
                userLogged={userLogged} />
        </div>
    )
}

const SellingProposals = ({proposals, heading}) => {
    return (
        <div className="selling-proposals">
            {proposals.length > 0 && <Heading title={heading} />}
            <SellingGames 
                heading={heading}
                proposals={proposals} />
        </div>
    )
}


const Proposals = ({userLogged}) => {
    const {proposals} = useContext(ProposalsContext);
    const {proposalsData} = proposals;

    const organizedProposals = organizeProposals(proposalsData, userLogged);
    const {exchangeProposalsSent, exchangeProposalsReceived, 
           sellingProposalsSent, sellingProposalsReceived} = organizedProposals;
    
    return (
        <div className="proposals">
            <h1 className="proposals-main-heading">Proposals</h1>
            <ExchangingProposals
                heading="Exchanging Proposals Sent"
                proposals={exchangeProposalsSent} 
                userLogged={userLogged} />
            <ExchangingProposals
                heading="Exchanging Proposals Received"
                proposals={exchangeProposalsReceived} 
                userLogged={userLogged} />
            <SellingProposals
                heading="Selling Proposals Sent"
                proposals={sellingProposalsSent} />
            <SellingProposals
                heading="Selling Proposals Received"
                proposals={sellingProposalsReceived} />
        </div>
    )
}

export default Proposals;