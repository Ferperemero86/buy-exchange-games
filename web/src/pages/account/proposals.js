import React from "react";

import {sendLocalData} from "../../utils/API";

import Game from "../../components/games/Game";
import BasicUserInfo from "../../components/usersGames/BasicUserInfo";

export async function getServerSideProps(ctx) {
    let userLogged = ctx.req.user ? ctx.req.user.id : null;
    const URLBase = ctx.req.headers.host;
    const Url = new URL("/api/proposals", `http://${URLBase}`).href;

    if (!userLogged) { return {login: false} }

    const proposals = await sendLocalData(Url, {userId: userLogged});
    
    return { props: {proposals, userLogged} }

}

const ExchangingGames = ({proposals, userLogged}) => {
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

const Heading = ({title}) => {
    return <h2 className="proposals-heading">{title}</h2>
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


const Proposals = ({proposals, userLogged}) => {
    const organizeProposals = (proposals, userLogged) => {
        const exchangeProposalsSent = proposals.exProp.filter(prop => { return prop.sender_id === userLogged});
        const exchangeProposalsReceived = proposals.exProp.filter(prop => { return prop.recipient_id === userLogged});
    
        return {
            exchangeProposalsSent,
            exchangeProposalsReceived
        }
    }

    const organizedProposals = organizeProposals(proposals, userLogged);
    const {exchangeProposalsSent, exchangeProposalsReceived} = organizedProposals;
    
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
        </div>
    )
}

export default Proposals;