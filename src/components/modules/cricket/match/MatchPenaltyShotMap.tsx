export const MatchPenaltyShotMap = ({
  penalties = [],
  setSelectedPenIdx = 0,
}: any) => {
  return (
    <svg width='424' height='172' viewBox='0 0 424 172' className='rounded-lg'>
      {/* Stand */}
      <rect
        y='0'
        width='424'
        height='132'
        className='sc-84e566de-0 kofheK'
        fill='#29345A'
      ></rect>

      {/* Grass */}
      <rect
        y='132'
        width='424'
        height='40'
        className='sc-84e566de-1 erEZKp'
        fill='#3d9f53'
      ></rect>

      {/* Net */}
      <svg x='119' y='44' width='186' height='98' viewBox='0 0 186 98'>
        <path
          d='M183.17 0H0v98h8v-.1l11.94-6.89h145.94l12.12 7h8V0h-2.83zM8 93.28V10.83l5.54 5.54 4.21 71.29-9.74 5.63-.01-.01zm9.49-77.77-.05-.89-.72-.72-5.9-5.9h164.35l-5.95 5.95-.66.66-.05.89-4.22 71.49H21.71l-4.22-71.48zm150.76 72.24 4.21-71.39 5.54-5.54v82.56l-9.75-5.63z'
          fill='#cccccc'
          fillRule='evenodd'
        ></path>
      </svg>

      {/* Goal */}
      {penalties.map((penalty: any, idx: number) => {
        const { x = 0, y = 0, outcome, zone } = penalty || {};

        let fillColor = '';
        if (outcome === 'goal') {
          fillColor = '#2187E5';
        } else if (outcome === 'miss') {
          fillColor = '#b7422b';
        } else if (outcome === 'save') {
          fillColor = '#555555';
        }

        // BK:
        // transformed_x = 2.92 * original_x + 85.0
        // transformed_y = 0.94 * original_y + 27.8
        return (
          <PenGoal
            key={idx}
            x={2.92 * x + 60}
            y={y * 1.36}
            fillColor={fillColor}
            onClick={() => setSelectedPenIdx(idx)}
          ></PenGoal>
        );
      })}

      {/* Sample */}
      {/* <SelectedPenCircle cx={163.8 + 8} cy={102.2 + 8}></SelectedPenCircle> */}
      {/* <PenGoal x='163.8' y='102.2' fillColor='red'></PenGoal> */}
      {/* <PenGoal x={0} y={0} fillColor='red'></PenGoal> */}
      {/* <PenGoal x={0} y={132-4} fillColor='red'></PenGoal> */}
    </svg>
  );
};

export const PenGoal = ({ x, y, fillColor = '#1A4B70', onClick }: any) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      x={x}
      y={y}
      className='sc-397037af-0 kDfNYo cursor-pointer'
      onClick={onClick}
    >
      <g transform='rotate(90 8 8)' fill={fillColor} fillRule='evenodd'>
        <circle
          fill='#fff'
          transform='rotate(90 8 8)'
          cx='8'
          cy='8'
          r='8'
        ></circle>
        <path
          d='M2.335 2.347c3.112-3.13 8.197-3.13 11.33 0 3.113 3.108 3.113 8.185 0 11.314-3.133 3.129-8.197 3.108-11.33 0-3.113-3.108-3.113-8.206 0-11.314zm8.82-.477C8.56.544 5.28.98 3.122 3.134a6.887 6.887 0 0 0-1.266 8.02l1.35-.56 2.199 2.197-.56 1.347a6.945 6.945 0 0 0 8.03-1.264c2.159-2.176 2.574-5.45 1.267-8.04l-1.35.559-2.199-2.197zm.56 6.072 1.037 2.631-2.179 2.176-2.615-1.015.685-3.088 3.072-.704zM5.28 3.279l2.594 1.099-.56 2.942-2.967.539-1.08-2.57 2.013-2.01z'
          fill='var(--secondary-default)'
        ></path>
      </g>
    </svg>
  );
};

export const SelectedPenCircle = ({ cx, cy, strokeColor = '#FFFFFF' }: any) => {
  return (
    <g className='sc-a7e9ad6a-0 jRPdjR'>
      <circle
        fill='transparent'
        r='10'
        stroke={strokeColor}
        strokeWidth='1.25'
        strokeOpacity='1'
        cx={cx}
        cy={cy}
      ></circle>
    </g>
  );
};
