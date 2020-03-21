import React, { useEffect, useContext } from "react";
import { StoreContext } from "../utils/store";
import Link from 'next/link';
import cookie from 'react-cookies';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import LogoImage from "../static/images/controller-logo.png";
import { useRouter } from 'next/router';


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
            <li>Buy</li>
            <li>Exchange</li>
            <li>Lists</li>
        </ul>
    </nav>
);

const HeaderAccountNav = () => {
    const { userLogged, setUserLogged } = useContext(StoreContext);
    const router = useRouter();

    useEffect(() => {
        if (!userLogged && cookie.load("user_id")) {
            setUserLogged(true);
        }
    })

    const logOut = () => {
        cookie.remove("user_id", { path: "/" });
        setUserLogged(false);
        router.push({ pathname: `/account/login` });
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
    } else {
        return (
            <div className="account-menu">
                <span>Account</span>
                <ul className="account-menu-list">
                    <Link href="/account/gameslist">
                        <li className="list-element">Games List</li>
                    </Link>
                    <li
                        className="list-element"
                        onClick={logOut}>Log Out</li>
                </ul>
            </div>
        )
    }
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