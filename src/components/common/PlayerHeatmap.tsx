import h337 from 'heatmap.js';
import { useEffect } from 'react';

import { usePlayerHeatmapData } from '@/hooks/useFootball';

// import "./styles.css";

export function PlayerHeatmap({
  matchId,
  playerId,
  isHome = true,
}: {
  matchId: string;
  playerId: string;
  isHome: boolean;
}) {
  // const { width, height } = useWindowSize();
  const heatmapId = `heatmap_${matchId}_${playerId}`;

  useEffect(() => {
    const element = document.querySelector(`#${heatmapId}`);
    if (element) {
      element.textContent = '';
      element.innerHTML = '';
    }
  }, [heatmapId]);

  useEffect(() => {
    return () => {
      const element = document.querySelector(`#${heatmapId}`);
      if (element) {
        element.textContent = '';
      }
    };
  }, [heatmapId]);

  const {
    data: apiData,
    isLoading,
    isError,
  } = usePlayerHeatmapData(matchId, playerId);

  useEffect(() => {
    const { heatmap = [] } = apiData || {};

    if (heatmap && heatmap.length) {
      const heatmapInstance = h337.create({
        container: document.querySelector(`#${heatmapId}`) || document.body,
        blur: 1,
        radius: 18,
        gradient: {
          '.6': '#ECCD31',
          '.7': '#feca30',
          '.8': '#feca30',
          '.9': '#F2902D',
          '1': '#F03431',
        },
      });
      let max = 0;
      const points = heatmap.map((item: any) => {
        const { x, y, value = 1 } = item;
        max = Math.max(max, value);

        // const adjustedY = isHome ? y : 100 - y;
        const adjustedY = isHome ? 100 - y : y;
        const adjustedX = isHome ? x : 100 - x;

        return {
          x: Math.round((adjustedX / 100) * 200),
          y: Math.round((adjustedY / 100) * 120),
          value,
        };
      });

      // heatmap data format
      const data: any = {
        max: 2.1,
        data: points,
      };

      heatmapInstance.setData(data);
    }
  }, [apiData, heatmapId, isHome]);

  if (isLoading || isError) {
    return (
      <div
        id={heatmapId}
        className='abc'
        css={{
          width: '200px',
          height: '120px',
        }}
      >
        ...
      </div>
    );
  }

  if (!apiData || !apiData.heatmap || !apiData.heatmap.length) {
    return <></>;
  }

  return (
    <div
      className='bg-contain bg-no-repeat p-3'
      style={{
        backgroundImage: `url('/svg/stadium-heamap.svg')`,
      }}
    >
      <div
        id={heatmapId}
        className=' rounded-md  '
        css={{
          width: '220px',
          height: '120px',
        }}
      ></div>
    </div>
  );
}
