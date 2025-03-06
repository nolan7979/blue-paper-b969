// import { SPORT } from "@/constant/common";

import { SPORT } from "@/constant/common";

export const MenuHeaderPath = {
  liveScore: '/',
  results: '/football/results',
  fixtures: '/football/fixtures',
  standings: '/competition/brasileiro-betano/7au4xbko7zt97f7',
  standings_normal: '/competition/premier-league/mfiws1aoh0uztg4',
  basketBall: '/basketball',
  liveScoreTennis: '/tennis',
};

export const MenuHeaderPathBasketball = {
  liveScore: '/basketball',
  results: '/basketball/results',
  fixtures: '/basketball/fixtures',
  standings: '/basketball/competition/brasileiro-betano/7au4xbko7zt97f7',
  standings_normal: '/basketball/competition/premier-league/mfiws1aoh0uztg4',
};

export const MenuHeaderPathVolleyball = {
  liveScore: '/volleyball',
  results: '/volleyball/results',
  fixtures: '/volleyball/fixtures',
  standings: '/volleyball/competition/brasileiro-betano/7au4xbko7zt97f7',
  standings_normal: '/volleyball/competition/premier-league/mfiws1aoh0uztg4',
};

export const MenuHeaderPathTennis = {
  liveScore: '/tennis',
  results: '/tennis/results',
  fixtures: '/tennis/fixtures',
  standings: '/tennis/competition/brasileiro-betano/7au4xbko7zt97f7',
  standings_normal: '/tennis/competition/premier-league/mfiws1aoh0uztg4',
};

export const MenuHeaderPathBadminton = {
  liveScore: '/badminton',
  results: '/badminton/results',
  fixtures: '/badminton/fixtures',
  standings: '/badminton/competition/brasileiro-betano/7au4xbko7zt97f7',
  standings_normal: '/badminton/competition/premier-league/mfiws1aoh0uztg4',
};


const createSportRoutes = (sport: string) => ({
  livescore: sport === SPORT.FOOTBALL ? '/' : `/${sport}`,
  results: `/${sport}/results`,
  fixtures: `/${sport}/fixtures`,
  competition: `/${sport}/competition/:slug/:id`,
  competitor: `/${sport}/competitor/:slug/:id`,
});

export const ROUTES = Object.values(SPORT).reduce((acc, sport) => {
  acc[sport] = createSportRoutes(sport);
  return acc;
}, {} as Record<SPORT, ReturnType<typeof createSportRoutes>>);


export const ALL_HOME_PATH = [
  '/',
  ...Object.values(SPORT).map(sport => `/${sport}`),
  ...Object.values(SPORT).map(sport => `/${sport}/results`),
  ...Object.values(SPORT).map(sport => `/${sport}/fixtures`),
  '/football/country',
  '/favorite'
];

export const ALL_ADS_PATH = [
  '/mobile',
  '/login'
];

export enum ROUTES_PATH {
  football = '/',
  basketball = '/basketball',
  tennis = '/tennis',
  badminton = '/badminton',
  amFootball = '/am-football',
  volleyball = '/volleyball',
  baseball = '/baseball',
  cricket = '/cricket',
  hockey = '/hockey',
  tableTennis = '/table-tennis',
  snooker = '/snooker',
}
