import React, {useContext} from "react";
import Link from "next/link";
import axios from "axios";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons';

import {StoreContext} from "../../utils/store";

import Messages from "../../components/messages/Messages";

export async function getServerSideProps ({query}) {

    return {props: {query}}
}

const Details = ({query}) => {
    const {message, setMessage} = useContext(StoreContext);
    const {currentPage, setCurrentPage} = useContext(StoreContext);
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
            url: "/api/addgametolist",
            method: "POST",
            data: { game }
        })
            .then(result => {
                const success = result.data;

                setMessage(success);
            })
            .catch(err => {
                if(err.response) {
                    const error = err.response.data;
    
                    setMessage(error);
                }
            })
    }

    if (Object.keys(query).length > 0) {
        return (
            <div className="game-details" key={id}>
                <Messages 
                    page="details"
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    clearMessage={setMessage}
                    message={message} />
                <div className="header">
                    <div className="go-back-link">
                        <FontAwesomeIcon icon={faArrowCircleLeft} className="left-arrow" />
                        <Link href={{ pathname: `/explore/${platform}`, query: {page} }}>
                            <span className="header-link link">Back To Games</span>
                        </Link>
                    </div>
                    <h2 className="title">{title}</h2>
                </div>
                <img src={`${cover}`} className="cover" />
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
                <p className="summary">{summary}</p>
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

