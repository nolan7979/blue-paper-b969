import GoalSVG from '~/svg/goal-shotmap.svg';

export function ShotmapGraphSection({
  isHome,
  homeShotmap,
  awayShotmap,
  setCurrentShotIdx,
  setCurrentTab,
  selectedShotData,
  i18n,
  plusHome = 0,
  currentTab,
  className = '',
}: {
  currentTab: boolean;
  setCurrentTab: any;
  isHome: boolean;
  homeShotmap: any;
  awayShotmap: any;
  setCurrentShotIdx: any;
  selectedShotData: any;
  i18n: any;
  plusHome?: number;
  className?: string;
}) {
  const {
    // player = {},
    // shotType,
    // goalType,
    // situation,
    // bodyPart,
    // goalMouthLocation,
    draw = {},
    // time,
    // addedTime,
    // xg = 0,
    // xgot = 0,
  } = selectedShotData || {};

  const { start = {}, block = {}, end = {}, goal = {} } = draw || {};
  const { x: x1 = 0, y: y1 = 0 } = start;
  const { x: x2 = 0, y: y2 = 0 } = block;
  const { x: x3 = 0, y: y3 = 0 } = end;
  // const { x: x4 = 0, y: y4 = 0 } = goal;

  const teamData = isHome ? homeShotmap : awayShotmap;
  const destX = x2 || x3;
  const destY = y2 || y3;

  return (
    <div className={className}>
      <div className='h-auto w-[14.5rem]'>
        <svg viewBox='-23 -23 330 290' className='align-top leading-4'>
          {/* <BallCircle cx={0} cy={0}></BallCircle>
          <BallCircle cx={0} cy={210}></BallCircle>
          <BallCircle cx={280} cy={210}></BallCircle>
          <BallCircle cx={280} cy={0}></BallCircle> */}

          {teamData && (
            <>
              {teamData.map((shot: any, idx: number) => {
                const {
                  // player = {},
                  shotType,
                  goalType,
                  situation,
                  bodyPart,
                  goalMouthLocation,
                  draw = {},
                  // time,
                  // addedTime,
                  // xg = 0,
                  // xgot = 0,
                } = shot || {};

                const {
                  start = {},
                  block = {},
                  end = {},
                  goal = {},
                } = draw || {};
                const { x: x1 = 0, y: y1 = 0 } = start;
                // const { x: x2 = 0, y: y2 = 0 } = block;
                // const { x: x3 = 0, y: y3 = 0 } = end;
                // const { x: x4 = 0, y: y4 = 0 } = goal;

                return (
                  <BallCircle
                    key={`s-${idx}`}
                    cx={x1 * 2.8}
                    cy={y1 * 2.1 * 2}
                    isHome={isHome}
                    isGoal={shotType === 'goal'}
                    idx={idx}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    setCurrentShotIdx={setCurrentShotIdx}
                    attemptSaved={shotType === 'save'}
                  />
                );
              })}
            </>
          )}

          <SelectedBallCircle cx={x1 * 2.8} cy={y1 * 2.1 * 2} isHome={isHome} />
          <SelectedDestPoint
            cx={destX * 2.8 - 3}
            cy={destY * 2.1 * 2}
            isHome={isHome}
          />
          <line
            x1={x1 * 2.8}
            y1={y1 * 2.1 * 2}
            x2={destX * 2.8}
            y2={destY * 2.1 * 2}
            stroke='#ffffff'
            fill='#ffffff'
            strokeWidth={2}
            strokeDasharray={3}
          />

          {/* <HiAcademicCap x={100} y={100} ></HiAcademicCap> */}
        </svg>
      </div>
    </div>
  );
}

export const BallCircle = ({
  cx,
  cy,
  isHome = true,
  isGoal = false,
  idx,
  plusHome = 0,
  setCurrentShotIdx,
  attemptSaved = false,
  currentTab,
  setCurrentTab,
}: any) => {
  let fillColor = isHome ? '#2187E5' : '#E0A500';
  let strokeColor = '#2187E5';
  if (isHome) {
    if (isGoal) {
      fillColor = isHome ? '#2187E5' : '#E0A500';
      strokeColor = isHome ? '#2187E5' : '#E0A500';
    }
  } else {
    if (isGoal) {
      fillColor = '#F6B500';
      strokeColor = '#F6B500';
    }
  }

  return (
    <g
      cursor='pointer'
      className='sc-24b92b28-0 beiEsl'
      onClick={() => {
        if (currentTab === isHome) {
          setCurrentShotIdx(idx);
        } else {
          setCurrentTab(!currentTab);
          setCurrentShotIdx(idx);
        }
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={isGoal ? '8' : '6.5'}
        fill={fillColor}
        fillRule='evenodd'
        stroke='#FFFFFF'
        strokeWidth='1'
      />

      {/* {isGoal && <GoalSVG className='h-4 w-4 transform -translate-x-5 -translate-y-1' x={cx} y={cy}></GoalSVG>} */}
      {isGoal && <GoalSVG className='h-4 w-4' x={cx - 8} y={cy - 8} />}

      {/* Assisted dot */}
      {attemptSaved && (
        <circle
          cx={cx}
          cy={cy}
          r='1'
          fill='#ffffff'
          fillRule='evenodd'
          stroke='#ffffff'
          strokeWidth='1.5'
        />
      )}
    </g>
  );
};

export const SelectedBallCircle = ({ cx, cy, isHome }: any) => {
  return (
    <g className='sc-1570dcb-0 kKothv'>
      <circle
        fill='transparent'
        r='9'
        stroke={isHome ? '#0386FF' : '#F6B500'}
        strokeWidth='2.5'
        strokeOpacity='1'
        cx={cx}
        cy={cy}
      />
    </g>
  );
};

export const SelectedShotLine = ({ x1, y1, x2, y2, isHome }: any) => {
  return isHome ? (
    <line
      x1={x1 * 2.8}
      y1={y1 * 2.1 * 2}
      x2={x2 * 2.8}
      y2={y2 * 2.1 * 2}
      stroke='#2187E5'
      fill='#2187E5'
      strokeWidth={2}
      strokeDasharray={3}
    />
  ) : (
    <line
      x1={x1 * 2.8}
      y1={y1 * 2.1 * 2}
      x2={x2 * 2.8}
      y2={y2 * 2.1 * 2}
      stroke='#E0A500'
      fill='#E0A500'
      strokeWidth={2}
      strokeDasharray={3}
    />
  );
};

export const SelectedDestPoint = ({ cx, cy, isHome }: any) => {
  return (
    <g className='sc-1570dcb-0 kKothv'>
      <rect
        fill='#FFFFFF'
        stroke='#FFFFFF'
        strokeWidth='1'
        strokeOpacity='1'
        cx={cx}
        cy={cy}
        x={cx}
        y={cy}
        width='8'
        height='2'
      />
    </g>
  );
};
