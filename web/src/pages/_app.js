import React from 'react';

import "../static/styles/styles.css";
import FormsProvider from "../components/providers/FormsProvider";
import GamesListProvider from "../components/providers/GamesListProvider";
import TransactionsProvider from "../components/providers/TransactionsProvider";
import SellGameProvider from "../components/providers/SellGameProvider";
import UserProvider from "../components/providers/UserProvider";
import ExploreGamesProvider from "../components/providers/ExploreGamesProvider";
import UsersSellingProvider from "../components/providers/UsersSellingProvider";
import MessagesProvider from "../components/providers/MessagesProvider";
import Header from "../components/Header";

const Page = ({pageProps, Component, router}) => {
    const path = router.pathname;

    if (path.includes("/explore/") ) {
        return (
            <ExploreGamesProvider pageProps={pageProps}>
                 <Component {...pageProps} />
            </ExploreGamesProvider>
        )
    }

    if (path.includes("/account/exchange-a-game") ) {
        return (
            <TransactionsProvider pageProps={pageProps}>
                <Component {...pageProps} />   
            </TransactionsProvider>
        )
    }

    if (path.includes("/account/sell-a-game") ) {
        return (
            <SellGameProvider pageProps={pageProps}>
                <Component {...pageProps} />   
            </SellGameProvider>
        )
    }

    if (path.includes("/users-selling/details")) {
        return (
            <MessagesProvider>
                <Component {...pageProps} />  
            </MessagesProvider>
        )
    }

    switch (path) {
        case "/account/login" :

            return (
                <FormsProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </FormsProvider>
            )

        case "/account/register" :

            return (
                <FormsProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </FormsProvider>
            )

        case "/account/gameslist" :
        
            return (
                <GamesListProvider pageProps={pageProps}>
                    <Component {...pageProps} />
                </GamesListProvider>
            )

        case "/games/users-selling" :
            return (
                <UsersSellingProvider pageProps={pageProps}>
                    <Component {...pageProps} />   
                </UsersSellingProvider>
            )

    }
    return <Component {...pageProps} />
}

const MyApp = ({Component, pageProps, router}) => {
    return (
        <div id="app">
            <UserProvider>
                <Header />
                <Page pageProps={pageProps} 
                      Component={Component} 
                      router={router} />
            </UserProvider>
        </div>
    )
   
}

export default MyApp;