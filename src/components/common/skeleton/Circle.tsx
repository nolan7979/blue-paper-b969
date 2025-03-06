interface CircleProps {
  classes: string; // should include width, height and something like mx my px py ...
}

const Circle: React.FC<CircleProps> = ({ classes }) => {
  return (
    <div className='animate-pulse'>
      <div
        className={`dark:bg-primary-gradient dark:border-linear-skeleton rounded-full bg-[#ccc] ${classes}`}
      ></div>
    </div>
  );
};

export default Circle;
