import React, {useContext, useEffect} from "react";
import Link from 'next/link';
import cookie from 'react-cookies';
import {useRouter} from "next/router";

import {UserContext} from "../components/providers/UserProvider";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

import LogoImage from "../static/images/controller-logo.png";

const Logo = () => (
    <div className="header-logo">
        <img src={LogoImage} className="header-logo-image" />
    </div>
);

const HeaderMainNav = () => (
    <nav className="header-main-nav">
        <ul>
            <Link href="/">
                <li>Home</li>
            </Link>
            <Link href="/games/users-selling">
                <li>Buy</li>
            </Link>
            <Link href="/games/users-exchanging">
                <li>Exchange</li>
            </Link>
            <Link href="/account/gameslist">
                <li>Sell</li>
            </Link>
            <Link href="/games/users-lists">
                <li>Lists</li>
            </Link>
            
        </ul>
    </nav>
);

const HeaderAccountNav = () => {
    const {user, dispatchUser} = useContext(UserContext);
    const {userLogged, hasMounted} = user;
    const router = useRouter();
    
    const logOut = () => {
        cookie.remove("user_id", { path: "/" });
        router.push("/");
        dispatchUser({ type: "USER_LOGGED_OUT"});
        dispatchUser({type: "UPDATE_COMPONENT_MOUNT_STATUS", payload: false})
    }

    useEffect(() => {
        dispatchUser({type: "UPDATE_COMPONENT_MOUNT_STATUS", payload: true})
    }, [])

    if (!hasMounted) {
        return null;
    }

    if (!userLogged) {
        return (
            <nav className="header-account-nav">
                <ul>
                    <Link href="/account/login">
                        <li>Login</li>
                    </Link>
                    <Link href="/account/register">
                        <li>Sign Up</li>
                    </Link>
                </ul>
            </nav>
        )
    }
   
    return (
        <div className="account-menu">
            <span>Account</span>
            <ul className="account-menu-list">
                <Link href="/account/gameslist">
                    <li className="list-element">Games List</li>
                </Link>
                <Link href="/account/messages">
                    <li className="list-element">Messages</li>
                </Link>
                <li
                    className="list-element"
                    onClick={logOut}>Log Out</li>
            </ul>
        </div>
    )
    
}

const HeaderSearch = () => (
    <div className="header-search">
        <span className="search-icon">
            <FontAwesomeIcon
                icon={faSearch}
                className="icon" />
        </span>
        <input type="search" />
    </div>
);

const Header = () => (
    <header className="main-header">
        <Logo />
        <div className="header-navs">
            <HeaderMainNav />
            <HeaderAccountNav />
        </div>
        <HeaderSearch />
    </header>
)

export default Header;