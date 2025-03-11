import React from "react";

type BannerProps = {
  banner: string;
};

const Banner = ({ banner }: BannerProps) => {
  return <pre className="terminal-banner">{banner}</pre>;
};

export default Banner;