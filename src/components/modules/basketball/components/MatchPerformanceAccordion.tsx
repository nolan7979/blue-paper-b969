import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowDown from '/public/svg/arrow-down.svg';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { formatSecondToHourView } from '@/utils';
import { useTheme } from 'next-themes';

// const { resolvedTheme } = useTheme();

const Accordion = styled((props: AccordionProps | any) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({currentTheme}) => ({
  borderRadius: 5,
  background: currentTheme == 'light' ? '#fff' : '#03060d',
  '&:not(:last-child)': {
    marginBottom: 8,
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps | any) => (
  <MuiAccordionSummary
    expandIcon={<ArrowDown />}
    {...props}
  />
))(({currentTheme}) => ({
  minHeight: 32,
  borderRadius: 5,
  background: currentTheme == 'light' ? '#fff' : `linear-gradient(124.54deg, rgb(7 21 55) 0%, rgb(8 25 66) 27.66%, rgb(10 22 59) 70.02%)`,
  justifyContent: 'center',
  color: currentTheme == 'light' ? '#000' :'#fff',
  '&.Mui-expanded': {
    minHeight: 32
  },
  '& .MuiAccordionSummary-content': {
    flexGrow: 0,
    margin: 0,
  },
  '& .MuiAccordionSummary-content .MuiTypography-root': {
    fontSize: 13
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: '#fff',
    width:12,
    marginLeft: 8
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(-180deg)',
  },
}));

const AccordionDetails = styled((props: AccordionDetailsProps | any) => (<MuiAccordionDetails {...props} />))(({ theme, currentTheme }:any) => ({
  padding: theme.spacing(2),
  background:currentTheme == 'light' ? '#fff' : '#020C20',
  color: '#fff'
}));

export default function MatchPerformanceAccordion({data}:any) {
  const { resolvedTheme } = useTheme();
  return (
    <div>
      {Object.keys(data).length > 0 &&
        Object.keys(data).map((pItem: any) => (
          <Accordion key={pItem} currentTheme={resolvedTheme}>
            <AccordionSummary aria-controls={`panel${pItem}-content`} id={`panel${pItem}-header`} currentTheme={resolvedTheme}>
              <Typography>{`${pItem} ${data[pItem][0].homeScore} - ${data[pItem][0].awayScore}`}</Typography>
            </AccordionSummary>
            <AccordionDetails currentTheme={resolvedTheme}>
              <ul className='mt-3 w-full'>
                {data[pItem].map((item: any, index: any) => {
                  if (item.text === '') {
                    return <RowPerformanceItem content={item} key={index} />;
                  }
                })}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

const RowPerformanceItem = ({ content }: any) => (
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
      } gap-2 p-[11px] text-black dark:text-white`}
    >
      <div className='text-[8px]'>
        <div>{`${content.homeScore} - ${content.awayScore}`}</div>
      </div>
      <div className='text-xl font-bold text-dark-win dark:text-dark-green'>
        {content.incidentScore}
      </div>
    </div>
    <div className='w-[50px] text-center text-csm text-light-secondary'>
      {formatSecondToHourView(content.timeSeconds)}
    </div>
  </li>
);