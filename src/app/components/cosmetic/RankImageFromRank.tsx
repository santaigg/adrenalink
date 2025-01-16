import React from 'react';
import Image from 'next/image';

interface RankImageProps {
  rank: string;
}

const RankImage: React.FC<RankImageProps> = ({ rank }) => {
  // Convert the rank string to match the image file naming convention
//   const formattedRank = rank.replace(/\s+/g, '_').toLowerCase(); // Example: "Diamond 4" -> "diamond_4"
  const rankImage = require(`@/app/assets/images/ranks/solo_ranks/${rank}.png`);

  return (
    <div>
      <Image 
        src={rankImage.default} 
        alt={`${rank} rank`} 
        className='h-8 w-8'
      />
    </div>
  );
};

export {RankImage};
