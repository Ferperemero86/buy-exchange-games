import React from "react";
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
            <li>Buy</li>
            <li>Exchange</li>
            <li>Lists</li>
        </ul>
    </nav>
);

const HeaderAccountNav = () => (
    <nav className="header-account-nav">
        <ul>
            <li>Login</li>
            <li>Sign Up</li>
        </ul>
    </nav>
)

const HeaderSearch = () => (
    <div className="header-search">
        <span className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
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