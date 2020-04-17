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
    const name = query.name;
    const coverString = query.cover;
    const cover = coverString.replace("t_thumb", "t_screenshot_med");
    const summary = query.summary;
    

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
                <h2 className="title">{name}</h2>
            </div>
            <img src={`${cover}`} className="cover" />
            <div className="links">
                <ul className="links-list">
                    <li
                        className="link"
                        onClick={addToList}>Add to list</li>
                    <li className="link">Find a seller</li>
                </ul>
            </div>
            <p className="summary">{summary}</p>
        </div>
    )

};


export default Details;

