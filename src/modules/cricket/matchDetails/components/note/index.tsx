import CardSVG from '~/images/cards.svg';
import ChartSVG from '~/images/chart.svg';
import CornerSVG from '~/images/corner.svg';
import GoalSVG from '~/images/goal-regular.svg';
import en from '~/lang/en';

const MatchNote = ({ i18n = en }: { i18n: any }) => (
  <div className='match-note-content pt-8'>
    <ul className='note-list'>
      <li>
        <GoalSVG className='h-4 w-4' />
        <span className='text'>{i18n.chart.score}</span>
      </li>
      <li>
        <CornerSVG className='h-4 w-4' />
        <span className='text'>{i18n.menu.corner}</span>
      </li>
      <li>
        <CardSVG className='h-4 w-4' />
        <span className='text'>{i18n.chart.card}</span>
      </li>
      <li>
        <ChartSVG className='h-4 w-4' />
        <span className='text'>{i18n.competitor.attack}</span>
      </li>
    </ul>
  </div>
);

export default MatchNote;
