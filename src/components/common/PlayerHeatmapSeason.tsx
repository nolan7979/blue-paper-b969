/* eslint-disable @next/next/no-img-element */
import h337 from 'heatmap.js';
import { useEffect } from 'react';

import { usePlayerSeasonHeatmapData } from '@/hooks/useFootball';

import StadiumHeatmapSVG from '/public/svg/stadium-heamap.svg';

export function PlayerSeasonHeatmap({
  tournamentId,
  seasonId,
  playerId,
  isHome = true,
}: {
  tournamentId: string;
  seasonId: string;
  playerId: string;
  isHome?: boolean;
}) {
  // const [squareRef, { width, height }] = useElementSize();

  // const { width, height } = useWindowSize();
  const width = 230; // TODO rem
  const height = 144;
  const heatmapId = `heatmap_${tournamentId}_${seasonId}_${playerId}`;

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
    isFetching,
    isError,
  } = usePlayerSeasonHeatmapData(tournamentId, seasonId, playerId);

  useEffect(() => {
    const heatmapInstance = h337.create({
      // only container is required, the rest will be defaults
      container: document.querySelector(`#${heatmapId}`) || document.body,
      // container: document.getElementById('heatmapId') || document.body,
      // container: document.getElementById('heatmapId'),
      blur: 0.5,
      radius: 9,
      // opacity: 0.3,
      // maxOpacity: 0.5,
      // minOpacity: 0,
      // backgroundColor: 'green',
      gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '.6': '#ECCD31',
        '.7': '#feca30',
        '.8': '#feca30',
        '.9': '#F2902D',
        '1': '#F03431',
      },

      // gradient: {
      //   // Adjust the gradient color scale from light yellow to red.
      //   0.1: '#F9D230', // less activity (light yellow)
      //   0.3: '#F4A425',
      //   0.5: '#EF7621',
      //   0.7: '#E8491D',
      //   1.0: '#E21618', // high activity (red)
      // },
    });
    const { points: pointData = [] } = apiData || {};

    if (pointData && pointData.length) {
      let max = 0;
      const points = pointData.map((item: any) => {
        const { x, y, count: value = 1 } = item;
        max = Math.max(max, value);

        // const adjustedY = isHome ? y : 100 - y;
        const adjustedY = isHome ? 100 - y : y;
        const adjustedX = isHome ? x : 100 - x;

        return {
          x: Math.round((adjustedX / 100) * width),
          y: Math.round((adjustedY / 100) * height),
          value,
        };
      });

      // heatmap data format
      const data: any = {
        max: max,
        data: points,
      };

      heatmapInstance.setData(data);
    }
  }, [apiData, heatmapId, height, isHome, width]);

  if (isLoading || isFetching || !apiData || isError) {
    return (
      <div
        id={heatmapId}
        // ref={squareRef}
        className=''
        css={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        ...
      </div>
    );
  }

  return (
    <div className='relative rounded-lg bg-[#3D9F53] p-6'>
      <div>
        <StadiumHeatmapSVG className='absolute left-0 top-6 z-10 h-36 w-full text-white'></StadiumHeatmapSVG>
      </div>
      <div className='flex place-content-center'>
        <div
          // ref={squareRef}
          id={heatmapId}
          className='  h-full w-full rounded-md '
          css={{
            width: `${230}px`,
            height: `${144}px`,
          }}
        ></div>
      </div>
    </div>
  );
}
