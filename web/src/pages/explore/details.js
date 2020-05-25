import React from "react";
import Link from "next/link";
import axios from "axios";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';


export async function getServerSideProps ({query}) {
    return {props: {query}}
}

const Header = ({platform, page, title}) => (
    <div className="header">
        <div className="go-back-link">
            <FontAwesomeIcon icon={faArrowCircleLeft} className="left-arrow" />
            <Link href={{ pathname: `/explore/${platform}`, query: {page} }}>
                <span className="header-link link">Back To Games</span>
            </Link>
        </div>
        <h2 className="title">{title}</h2>
    </div>
);

const Cover = ({cover}) => (
    <div className="cover-container">
        <img src={`${cover}`} className="cover" />
    </div>
);

const Links = ({query, addToList}) => (
    <div className="links">
        <ul className="links-list">
            <li className="link"
                onClick={addToList}>Add to list</li>
            <Link href={{ pathname: `/games/users-selling`, 
                          query: { id: query.id} }}>
                <li className="link">Buy</li>
            </Link>
            <li className="link">Exchange</li>
        </ul>
    </div>
);

const Summary = ({summary}) => (
    <p className="summary">{summary}</p>
)

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

        axios({
            url: "/api/gamesinlist/game/add",
            method: "POST",
            data: { game }
        })
            .then(result => {
                console.log(result);
                //Show notification
                
            })
            .catch(()=> {
                //Show error notification
            })
    }

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
            <h1 className="heading">No Game selected</h1>
            <FontAwesomeIcon icon={faArrowCircleLeft} className="left-arrow" />
            <Link href="/">
                <a href="/" className="go-back-link">Go Back</a>
            </Link>
        </div>
    )
};

export default Details;

