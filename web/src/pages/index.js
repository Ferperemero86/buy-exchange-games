import React from 'react';
import Link from 'next/link';

import ExploreGames from "../components/ExploreGames";

const PlatformGames = ({ title, platform, platformId }) => {
  return (
    <div className="platform-games-container">
      <ExploreGames
        title={title}
        platform={platform}
        dataContent={`fields name, cover.url, id; where platforms = {${platformId}} & release_dates.date > 1567296000;limit 1;`} />
    </div>
  )
}


export default class extends React.Component {
  render() {
    return (
      <div className="home-games-container">
        <h2 className="home-main-header">Find your Game</h2>
        <PlatformGames
          title="PS4 GAMES"
          platform="ps4"
          platformId="48" />
        <PlatformGames
          title="XBOX GAMES"
          platform="xbox"
          platformId="49" />
        <PlatformGames
          title="PC GAMES"
          platform="pc"
          platformId="6" />
      </div>
    )
  }
}
