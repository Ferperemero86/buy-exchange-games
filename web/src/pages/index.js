import React from "react";
import Link from 'next/link';

const PlatformGamesLink = ({Url, platform}) => {
    return(
      <Link href={{ pathname: `/explore/${Url}`, query: {page: 1}} }>
        <div className="game-container">
          <p className="title">{platform}</p>
        </div>
      </Link>
    )
}

const Home = () => {
  return (
    <div id="home">
      <div className="explore-games">
        <PlatformGamesLink Url={"ps4"} platform="PS4" />
        <PlatformGamesLink Url={"xbox"} platform="XBOX" />
        <PlatformGamesLink Url={"pc"} platform="PC" />
      </div>
    </div>
  )
}

export default Home;

