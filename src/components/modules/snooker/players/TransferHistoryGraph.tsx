import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SoccerTeam } from '@/components/modules/football/quickviewColumn/QuickViewComponents';

import { getImage, Images, isValEmpty, roundNumber } from '@/utils';

const CustomLabel = (props: any) => {
  const { x, y, stroke, value } = props;

  return (
    <span>
      <div>{value}</div>
    </span>
  );
};

export function TransferHistoryGraph({
  player = {},
  transfers = [],
}: {
  player?: any;
  transfers?: any[];
}) {
  if (isValEmpty(transfers)) {
    return <></>;
  }

  const { proposedMarketValueRaw = {} } = player || {};
  const { value: currentMarketValue = 0, currency } = proposedMarketValueRaw;

  const sortedData = (transfers || [])
    .sort((a, b) => a.transferDateTimestamp - b.transferDateTimestamp)
    .map((item) => ({
      time:
        `${item.transferDateTimestamp}`.toString().length < 13
          ? item.transferDateTimestamp * 1000
          : item.transferDateTimestamp,
      value: (item.transferFeeRaw?.value || 0) / 1000000,
      transferFrom: item.transferFrom || {},
      transferTo: item.transferTo || {},
    }));

  const tickValues = sortedData.map((transfer) => transfer.value);
  const setTickValues = new Set([...tickValues, currentMarketValue / 1000000]);

  const sortedTicks = Array.from(setTickValues).sort((a, b) => a - b);

  if (isValEmpty(sortedData)) return <></>;

  const firstPoint = sortedData[0];
  const lastPoint = sortedData[sortedData.length - 1];
  const totalTime = lastPoint.time - firstPoint.time;
  const periods: any[] = [];
  for (let idx = 0; idx < sortedData.length; idx++) {
    const thisTime = sortedData[idx].time;
    let thisLength = 0;
    if (idx === 0) {
      thisLength = thisTime - firstPoint.time;
    } else {
      const prevTime = sortedData[idx - 1].time;
      thisLength = thisTime - prevTime;
    }

    periods.push({
      width: roundNumber((thisLength / totalTime) * 100, 4),
      transferTo: sortedData[idx].transferTo,
      transferFrom: sortedData[idx].transferFrom,
    });
  }
  return (
    <div className=' pt-2 text-xs'>
      <div className='h-10 pl-1 pr-10'>
        <ul className=' flex h-10'>
          {periods.map((period, idx) => {
            return (
              <li
                key={idx}
                css={{
                  width: `${period.width}%`,
                }}
                className='flex items-center justify-center'
              >
                {period.width > 1 && (
                  <SoccerTeam
                    logoUrl={`${getImage(
                      Images.team,
                      period?.transferFrom?.id
                    )}`}
                    team={period.transferFrom}
                    logoSize={18}
                    showName={false}
                  ></SoccerTeam>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className='w-68 h-52'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='30%' stopColor='#0192B2' stopOpacity={1} />
                <stop offset='60%' stopColor='#0EFF68' stopOpacity={0.6} />
                <stop offset='100%' stopColor='#FFFFFF' stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey='time'
              domain={[firstPoint.time, lastPoint.time]}
              name='Time'
              tickFormatter={(unixTime) => `${format(unixTime, 'yy')}`}
              type='number'
              style={{
                fontSize: '11px',
              }}
              stroke='#FFFFFF'
              axisLine={false}
            />
            {/* TODO width by max value */}
            <YAxis
              name='Value'
              width={35}
              tickFormatter={(value) => `${value}M`}
              style={{
                fontSize: '11px',
                color: '#8FA1DE',
              }}
              // color='#8FA1DE'
              stroke='#8FA1DE'
              orientation='right'
              ticks={sortedTicks}
              domain={[0, 80]}
              axisLine={false}
              tickLine={false}
            />
            <Area
              type='linear'
              name='Values'
              dataKey='value'
              stroke='#2187E5'
              strokeWidth={3}
              fillOpacity={1}
              fill='url(#colorUv)'
              dot={true}
              label={<CustomLabel />}
            />
            <ReferenceLine
              y={currentMarketValue / 1000000}
              stroke='#F5A585'
              strokeWidth={2}
              strokeDasharray='3 3'
              // label='Current value'
              style={{
                fontSize: '11px',
              }}
            />
            <Tooltip />
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#666666'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
