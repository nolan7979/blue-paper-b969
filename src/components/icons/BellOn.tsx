import BellOnSVG from '/public/svg/bell-on.svg';

export function BellOn({ classes }: { classes?: string }) {
  // event handlers ...

  return <BellOnSVG className={`${classes ? classes : ''} cursor-pointer`} />;
}
