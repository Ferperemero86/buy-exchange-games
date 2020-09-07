import React, {useContext, useEffect} from 'react';

import {UserContext} from "../components/providers/UserProvider";
import {MainSearchContext} from "../components/providers/MainSearchProvider";
import {getDataFromClient} from "../utils/API";

import "../static/styles/styles.css";
import MainSearchProvider from "../components/providers/MainSearchProvider";
import RegisterProvider from "../components/providers/forms/RegisterProvider";
import LoginProvider from "../components/providers/forms/LoginProvider";
import GamesListProvider from "../components/providers/GamesListProvider";
import TransactionsProvider from "../components/providers/TransactionsProvider";
import SellGameProvider from "../components/providers/SellGameProvider";
import UserProvider from "../components/providers/UserProvider";
import ExploreGamesProvider from "../components/providers/ExploreGamesProvider";
import UsersGamesProvider from "../components/providers/UsersGamesProvider";
import MessagesProvider from "../components/providers/MessagesProvider";
import UserProfileProvider from "../components/providers/UserProfileProvider";
import UserMessagesProvider from "../components/providers/UsersMessagesProvider";
import ProposalsProvider from "../components/providers/ProposalsProvider";
import SettingsProvider from "../components/providers/SettingsProvider";
import Header from "../components/Header";
import MainSearch from "../components/MainSearch";
import AdminProvider from "../components/providers/AdminProvider";

const Page = ({pageProps, Component, router}) => {
    console.log("ROUTER", router);
    const asPath = router.asPath;
    const {dispatchUser} = useContext(UserContext);
    const {mainSearch} = useContext(MainSearchContext);
    const {textSearchInput, games} = mainSearch;
    
    useEffect(() => {
        const user = getDataFromClient("/api/session");

        user.then(result => { 
            if (result.login === false) {
                dispatchUser({type: "USER_LOGGED_OUT"});
            } else {
                dispatchUser({type: "USER_LOGGED_IN"});
                dispatchUser({type: "UPDATE_USER_ID", payload: result.userId})
            } 
            
        });
    }, [])
    
    if (textSearchInput !== "") { 
        return <MainSearch games={games} />
    }

    console.log("PATH", asPath);
    switch (asPath) {

        case `/account/user-profile?userId=${router.query.userId}` :
            //case "account/user-profile" :
                return (
                    <UserProfileProvider pageProps={pageProps}>
                        <Component {...pageProps} />
                    </UserProfileProvider>
                )
    
        case "account/proposals" :
            return (
                <ProposalsProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </ProposalsProvider>
            )

        case `/explore/ps4?page=${router.query.page}` : 
        case `/explore/xbox?page=${router.query.page}` : 
        case `/explore/pc?page=${router.query.page}` :
            return (
                <ExploreGamesProvider pageProps={pageProps}>
                     <Component {...pageProps} />
                </ExploreGamesProvider>
            )
            
        case "/account/messages" :
            return (
                <UserMessagesProvider pageProps={pageProps}>
                     <Component {...pageProps} />
                </UserMessagesProvider>
            )

        case "/account/exchange-a-game" :
            return (
                <TransactionsProvider pageProps={pageProps}>
                    <Component {...pageProps} />   
                </TransactionsProvider>
            )
    

        case "/account/sell-a-game" :
            return (
                <SellGameProvider pageProps={pageProps}>
                    <Component {...pageProps} />   
                </SellGameProvider>
            )

        case "/users-selling/details" :
            return (
                <UsersGamesProvider pageProps={pageProps}>
                    <Component {...pageProps} />  
                </UsersGamesProvider>
            )
       
        case "/admin" :
            return(
                <AdminProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </AdminProvider>
            )

        case `/account/settings?userId=${router.query.userId}` :
            return (
                <SettingsProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </SettingsProvider>
            )

        case "/account/login" :
            return (
                <LoginProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </LoginProvider>
            )
            
        case "/account/register" :
            return (
                <RegisterProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </RegisterProvider>
            )

        case "/account/gameslist" :
        case "/account/gameslist?sellgame=true" :
            return (
                <GamesListProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </GamesListProvider>
            )

        case "/games/users-selling" :
            return (
                <UsersGamesProvider pageProps={pageProps}>
                    <Component {...pageProps} />   
                </UsersGamesProvider>
            )

        case "/games/users-exchanging" :
            return (
                <UsersGamesProvider pageProps={pageProps}>
                    <Component {...pageProps} />   
                </UsersGamesProvider>
            )

        case "/" :
            return <Component {...pageProps} />
        
        default : 
            return null;
        }
};

const MyApp = ({Component, pageProps, router}) => {
    return (
        <div id="app">
            <UserProvider>
                <MessagesProvider>
                    <MainSearchProvider>
                        <Header />
                        <Page 
                         pageProps={pageProps} 
                         Component={Component} 
                         router={router} />
                    </ MainSearchProvider>
                </MessagesProvider>
            </UserProvider>
        </div>
    )
}

export default MyApp;