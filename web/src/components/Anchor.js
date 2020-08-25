import React from "react";

const Anchor = ({Url, className, children}) => (
 <a href={Url} className={className}>{children}</a>
)

export default Anchor;