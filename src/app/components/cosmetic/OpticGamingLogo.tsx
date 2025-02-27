import React from 'react';
import { cn } from '@/app/utils/cn';

interface OpticGamingLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const OpticGamingLogo: React.FC<OpticGamingLogoProps> = ({ 
  className, 
  size = 'md',
  color = '#92C951' // Optic Gaming's signature green color
}) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 64
  };

  const dimensions = sizeMap[size];

  return (
    <div className={cn('flex items-center justify-center', className)}>
        <svg width={dimensions} height={dimensions} viewBox="0 0 500 319" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_261_802)">
                <path d="M191.745 0C96.9965 0 0 79.7061 0 245.291H80.6806C84.4599 226.267 89.7543 208.875 96.3472 193.084C79.8315 193.15 71.1741 193.248 71.1741 193.248C71.1741 97.9302 150.09 52.0433 198.938 52.0433H355.438C355.438 60.1102 354.871 67.7853 353.839 75.1174C351.009 94.9908 344.566 112.186 335.659 126.834C307.988 172.329 256.56 193.248 215.886 193.248C197.623 193.15 180.957 193.084 165.94 193.052C156.45 207.912 149.491 225.303 146.527 245.291H221.897C314.065 245.291 378.396 209.594 408.065 126.834C413.642 111.288 418.004 94.0763 421.084 75.1174C424.747 52.5822 426.628 27.5811 426.628 0H191.745Z" fill="white"/>
                <path d="M421.071 75.1173C417.991 94.0763 413.629 111.272 408.052 126.834H500.004V75.1173H421.071Z" fill="#92C951"/>
                <path d="M430.974 267.124H144.929C144.929 259.531 145.478 252.247 146.527 245.275C149.49 225.287 156.466 207.879 165.94 193.035C194.359 148.504 245.372 126.818 279.002 126.818H335.659C344.566 112.17 351.009 94.9745 353.839 75.1011H269.579C195.558 75.1011 129.478 113.738 96.3472 193.068C89.7542 208.843 84.4765 226.25 80.6805 245.275C76.2519 267.549 73.8545 292.06 73.8545 318.824H499.867V179.629H430.974V267.124V267.124Z" fill="#9DC73B"/>
            </g>
            <defs>
                <clipPath id="clip0_261_802">
                    <rect width="500" height="318.841" fill="#92C951"/>
                </clipPath>
            </defs>
        </svg>
    </div>
  );
};

export default OpticGamingLogo; 