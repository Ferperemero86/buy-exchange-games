import React from "react";

const Image = ({className, Url}) => {
    if (!Url || Url === "not selected" || "") { return null }

    return (
        <img className={className} src={Url} />
    )
}

export default Image;