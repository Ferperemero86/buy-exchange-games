import React from "react";

const Div = ({children, className, data}) => {
    return  <div className={className}
                 data={data}>{children}</div>
}

export default Div;