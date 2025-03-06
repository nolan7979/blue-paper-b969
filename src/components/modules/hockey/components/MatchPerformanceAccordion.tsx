import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowDown from '/public/svg/arrow-down.svg';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { formatSecondToHourView } from '@/utils';
import PuckSVG from '/public/svg/puck.svg';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderRadius: 5,
  background: '#03060d',
  '&:not(:last-child)': {
    marginBottom: 8,
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  minHeight: 32,
  borderRadius: 5,
  backgroundImage: `linear-gradient(124.54deg, rgb(7 21 55) 0%, rgb(8 25 66) 27.66%, rgb(10 22 59) 70.02%)`,
  justifyContent: 'center',
  color: '#fff',
  '&.Mui-expanded': {
    minHeight: 32,
  },
  '& .MuiAccordionSummary-content': {
    flexGrow: 0,
    margin: 0,
  },
  '& .MuiAccordionSummary-content .MuiTypography-root': {
    fontSize: 13,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#fff',
    width: 12,
    marginLeft: 8,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(-180deg)',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  background: '#020C20',
  color: '#fff',
}));

export default function MatchPerformanceAccordion({ data }: any) {
  return (
    <div className='flex flex-col gap-2.5'>
      {data?.map((pItem: any, index: number) => {
        if (!pItem.text?.includes('PEN') && pItem.text !== '') {
          return (
            <div className='px-4 py-2 text-center text-csm bg-white dark:bg-primary-gradient dark:text-white'>
              <span>{`${pItem?.text} ${pItem.homeScore} - ${pItem.awayScore}`}</span>
            </div>
          );
        }

        if (
          pItem.text?.includes('PEN') &&
          !data[index -1]?.text?.includes('PEN') &&
          pItem.text !== ''
        ) {
          return (
            <div className='px-4 py-2 text-center text-csm dark:dark:bg-primary-gradient dark:text-white'>
              <span>{`${pItem?.text} ${pItem.homeScore} - ${pItem.awayScore}`}</span>
            </div>
          );
        }

        return <RowPerformanceItem content={pItem} />;
      })}
    </div>
  );
}

const RowPerformanceItem = ({ content }: any) => {
  return (
    <li
      className={`mb-4 flex w-full items-center ${
        !content.isHome && 'flex-row-reverse'
      } last:mb-0`}
    >
      <div
        className={`flex ${
          !content.isHome && 'flex-row-reverse'
        } h-[40px] w-[calc(50%-25px)] items-center justify-end border-t-2 bg-line-default dark:bg-dark-stadium ${
          !content.isHome ? 'border-light-detail-away' : 'border-logo-blue'
        } gap-2 px-[11px] text-black dark:text-white`}
      >
        {content?.card_minute && (
          <>
            <div
              className={`flex flex-1 ${!content.isHome && 'flex-row-reverse'}`}
            >
              <span
                className={`size-6 rounded-sm bg-all-blue text-center font-oswald ${
                  !content.isHome && '!bg-light-detail-away'
                }`}
              >
                {`${content?.card_minute}'`}
              </span>
            </div>
            <span className='text-cxs dark:text-white'>
              {content?.player?.name || ''}
            </span>
          </>
        )}
        {!content?.card_minute && (
          <>
            <div
              className={`flex flex-1 w-min ${!content.isHome && 'flex-row-reverse' || ''} text-black dark:text-white`}
            >
              <PuckSVG />
            </div>

            <div className='flex flex-col w-full max-w-[6.25rem] lg:max-w-[10.625rem] truncate'>
              <span className='text-cxs dark:text-white truncate'>
                {content?.player?.name || ''}
              </span>
              <span className='text-cxs text-dark-text truncate'>
                {content?.assists1?.name || ''} {content?.assists2 ? ` + ${content?.assists2?.name}` : ''}
              </span>
            </div>
            <div className='flex whitespace-nowrap'>
              <span className='font-oswald text-sm font-bold text-light-green dark:text-dark-green'>{`${content.homeScore} - ${content.awayScore}`}</span>
            </div>
          </>
        )}
      </div>
      <div className='w-[50px] text-center text-csm text-light-secondary'>
        {formatSecondToHourView(content.second)}
      </div>
    </li>
  );
};
