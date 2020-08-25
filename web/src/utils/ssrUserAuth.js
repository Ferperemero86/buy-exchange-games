
const ssrUserAuth = (userLogged) => {
    if (!userLogged) { return { props: {login: false} } }
}

export default ssrUserAuth;