import RenderIf from '@/components/common/RenderIf';
import InfoList from '@/components/modules/football/competition/InfoList';
import MostTitleHolderSection from '@/components/modules/football/competition/MostTitleHolderSection';
import { TwTitle } from '@/components/modules/football/tw-components';
import { isValEmpty } from '@/utils';

const CompetitionInfoSection = ({
  uniqueTournament,
  i18n,
}: {
  uniqueTournament: any;
  i18n: any;
}) => {
  const {
    mostTitles = 0,
    mostTitlesTeams = [],
    titleHolderTitles = 0,
    titleHolder = {},
    upperDivisions,
    upperNewComers,
    lowerDivisions,
    lowerNewComers,
    host,
  } = uniqueTournament || {};

  const baseClassName =
    'flex flex-col justify-start items-start [&>*:not(:last-child)]:border-gray-700 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-dotted [&>*]:w-full [&>*:not(:last-child)]:pb-2.5 gap-y-3';
  // if (
  //   upperDivisions.length == 0 &&
  //   upperNewComers.length == 0 &&
  //   lowerNewComers.length == 0
  // )
  //   return <></>;
  const shownTeams = mostTitlesTeams.filter((team: any) => !isValEmpty(team));

  const titleHolderTeams = [
    {
      ...titleHolder,
      title: `${i18n.competition.defendingChampion} (${titleHolderTitles})`,
    },
    ...mostTitlesTeams.map((team: any) => ({
      ...team,
      title: `${i18n.competition.mostTitlesWon} (${mostTitles})`,
    })),
  ];

  if (
    isValEmpty(shownTeams) &&
    isValEmpty(titleHolder) &&
    isValEmpty(lowerDivisions) &&
    isValEmpty(upperDivisions) &&
    isValEmpty(upperNewComers) &&
    isValEmpty(lowerNewComers)
  ) {
    return <></>;
  }

  return (
    <div className='space-y-4 p-2.5 lg:px-0'>
      <div className='space-y-8 lg:space-y-6'>
        <RenderIf isTrue={!isValEmpty(titleHolder) || !isValEmpty(shownTeams)}>
          <div className='flex w-full flex-wrap items-start justify-center gap-x-18 rounded-md bg-transparent dark:bg-transparent lg:bg-light lg:dark:bg-dark-card'>
            <div className='w-full lg:py-3.5 text-center'>
              <TwTitle>{i18n.competition.tournamentInfo}</TwTitle>
            </div>
            <div className='mb-3 block w-full pb-1 text-left text-sm font-bold text-black dark:text-white lg:hidden'>
              {i18n.competition.titleHolder}
            </div>
            <div className='flex w-full justify-center rounded-md bg-light p-2 lg:p-4 dark:bg-dark-card lg:bg-transparent lg:dark:bg-transparent'>
              <MostTitleHolderSection mostTitlesTeams={titleHolderTeams} />
            </div>
          </div>
        </RenderIf>
        <div className='flex w-full flex-col items-start justify-center gap-x-6 gap-y-8 lg:flex-row lg:gap-y-6'>
          <InfoList
            newComers={lowerDivisions}
            type='competition'
            title={i18n.competition.lowerDivision}
          />

          <InfoList
            newComers={upperDivisions}
            type='competition'
            title={i18n.competition.upperDivision}
          />
        </div>

        <InfoList
          newComers={upperNewComers}
          type='team'
          className={baseClassName}
          title={i18n.competition.upperNewComers}
        />

        <InfoList
          newComers={lowerNewComers}
          type='team'
          className={baseClassName}
          title={i18n.competition.lowerNewComers}
        />

        {/* TODO: data  */}
        {/* <FactSection></FactSection> */}

        {/* <HostSection i18n={i18n} host={host}></HostSection> */}
      </div>
    </div>
  );
};

export default CompetitionInfoSection;
