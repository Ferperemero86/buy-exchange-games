import React from "react";
import Link from "next/link";
import {sendDataFromClient} from "../../utils/API";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import Heading from "../../components/Heading";
import List from "../../components/List";
import ListElement from "../../components/ListElement";
import Image from "../../components/Image";
import Paragraph from "../../components/Paragraph";
import Anchor from "../../components/Anchor";


export async function getServerSideProps ({query}) {
    return {props: {query}}
}

const Header = ({title}) => (
    <div className="header">
        <Heading 
         className="title"
         type="h2"
         text={title} />
    </div>
);

const Cover = ({cover}) => (
    <div className="cover-container">
        <Image 
         Url={`${cover}`} 
         className="cover" />
    </div>
);

const Links = ({query, addToList}) => (
    <div className="links">
        <List className="links-list">
            <ListElement 
             className="link"
             onClick={addToList}>Add to list</ListElement>
            <ListElement className="link">
                <Link href={{ pathname: `/games/users-selling`, 
                              query: { id: query.id} }}>
                       <a href=""
                          className="details-buy-link">Buy</a>
                </Link>
            </ListElement>
            <ListElement className="link">Exchange</ListElement>
        </List>
    </div>
);

const Summary = ({summary}) => (
    <Paragraph 
     className="summary" 
     text={summary} />
);

const Details = ({query}) => {
    const id = query.id;
    const platform = query.platform;
    const page = query.page;
    const title = query.title;
    const summary = query.summary;
    let cover;
   
    if (Object.keys(query).length > 0) {
        const coverString = query.cover;
        cover = coverString.replace("t_thumb", "t_screenshot_med");
    }

    const addToList = () => {
        const game = query;

        sendDataFromClient("/api/gamesinlist/game/add", {game})
            .then(result => {
                console.log("GAME ADDED", result)
            })
            .catch(err => {
                console.log("ERROR", err);
            })
    };

    if (Object.keys(query).length > 0) {
        return (
            <div className="game-details" key={id}>
                <Header platform={platform} 
                        page={page}
                        title={title} />
                <Cover cover={cover}/>
                <Links query={query}
                       addToList={addToList} />
                <Summary summary={summary} />
            </div>
        )
    }
    return (
        <div className="no-game-selected">
            <Heading 
             className="heading"
             text="No Game Selected" />
            <FontAwesomeIcon 
             icon={faArrowCircleLeft} 
             className="left-arrow" />
            <Link href="/">
                <Anchor 
                 Url="/" 
                 className="go-back-link">Go Back</Anchor>
            </Link>
        </div>
    )
};

export default Details;

