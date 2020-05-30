import React from "react";

import UserAccountForm from "../../components/forms/UserAccountForm";

import {getLocalData} from "../../utils/API";

export async function getServerSideProps(ctx) {
    const URLBase = await ctx.req.headers.host;
    const Url = new URL("/api/countries", `http://${URLBase}`).href;

    const result = await getLocalData(Url);
    const {countries, countryNames} = await result;

    return {props: {countries, countryNames} };
}


const Register = () => {
    return <UserAccountForm URL="user/new" />   
};

export default Register;