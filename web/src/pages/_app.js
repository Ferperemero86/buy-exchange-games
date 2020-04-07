import React from 'react';

import Header from "../components/Header";
import StoreProvider from "../utils/store";

import "../static/styles/styles.css";


const Layout = ({ children }) => <div className="layout">{children}</div>

export default ({ Component, pageProps }) => (
    <StoreProvider>
        <Layout>
            <Header />
            <Component {...pageProps} />
        </Layout>
    </StoreProvider>

)