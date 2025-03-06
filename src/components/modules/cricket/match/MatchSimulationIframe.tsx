import { SPORT } from '@/constant/common';
import { useRouter } from 'next/router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MatchSimulationIframeProps {
  id: string;
  allowFullScreen?: boolean;
  width?: string;
  className?: string;
  height?: string;
  mode?: '2d' | '3d';
  sport?: string;
}

const MatchSimulationIframe: React.FC<MatchSimulationIframeProps> = ({
  id,
  allowFullScreen = true,
  className,
  width = '100%',
  height = '268px',
  mode = '3d',
  sport = SPORT.FOOTBALL,
}) => {
  const router = useRouter();
  const { locale } = router;
  const heightWrapper =
    (mode === '3d' && parseInt(height.replace('px', '')) + 10) || height;
  const layoutVersion = mode === '2d' ? '&vsLayout=2' : '';
  const url = `https://widgets.uniscore.com/${locale}/${mode}/${sport}/${id}?width=100%&height=${height}&amp;timezone=07:00&amp;audio=1;${layoutVersion}`;

  return (
    <iframe
      src={url}
      allowFullScreen={allowFullScreen}
      width={width}
      height={`${heightWrapper}px`}
      className={twMerge(className)}
      loading='lazy'
      style={{
        width: '100%',
        padding: '0px',
        margin: '0px',
        borderWidth: '0px 0px 1px',
        borderTopStyle: 'initial',
        borderRightStyle: 'initial',
        borderBottomStyle: 'solid',
        borderLeftStyle: 'initial',
        borderTopColor: 'initial',
        borderRightColor: 'initial',
        borderBottomColor: 'rgba(255, 255, 255, 0.03)',
        borderLeftColor: 'initial',
        borderImage: 'initial',
        display: 'inline-block',
        aspectRatio: '16 / 10',
        verticalAlign: 'top',
        height: `${heightWrapper}px`,
      }}
    ></iframe>
  );
};
const areEqual = (
  prevProps: MatchSimulationIframeProps,
  nextProps: MatchSimulationIframeProps
) => {
  return prevProps?.id === nextProps.id;
};
export default React.memo(MatchSimulationIframe, areEqual);
