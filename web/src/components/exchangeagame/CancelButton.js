import React from "react";

import {useRouter} from "next/router";

const CancelButton = () => {
    const router = useRouter();

    const cancelExchange = () => {
        router.push("/account/gameslist");
    }

    return <button className="exchange-cancel-button"
                   onClick={cancelExchange}>Cancel</button>
}

export default CancelButton;