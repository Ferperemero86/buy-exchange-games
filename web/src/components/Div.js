import React from "react";

const Div = ({children, className, data, onClick}) => {
    return  <div className={className}
                 onClick={onClick}
                 data={data}>{children}</div>
}

export default Div;