import YellowStarSVG from '/public/svg/star-yellow.svg';

export function StarYellowNew({className}:any) {
  // event handlers ...

  return <YellowStarSVG id='yellow-start' className={`${className ? className : 'h-4 w-4'} cursor-pointer`} />;
}
