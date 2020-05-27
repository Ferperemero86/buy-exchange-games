import React from "react";

export async function getServerSideProps({query}) {
    console.log('QUERY DETAILS', query);
    return { props: {query} };
}

const UsersSellingDetails = ({query}) => {
    console.log(query);
    return <h1>Details</h1>
}

export default UsersSellingDetails;