import { IFollow } from "@/stores/follow-store";

export const development = 'https://dev.uniscore.vn';
export const development_local = 'localhost:4000';

export const COUNTRY_DETECT = 'detected_country';

export const IMAGE_CDN_PATH = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.uniscore.com';

export const LOCAL_STORAGE = {
  localeList: 'locale_list',
  countryDetect: 'detected_country',
  statsLocaleDetail: 'stats_locale',
  currentLocale: 'current_locale',
  showHdp: 'showHdp',
  show1x2: 'show1x2',
  showTX: 'showTX',
  showFavorite: 'showFavorite',
  showYellowCard: 'showYellowCard',
  showRedCard: 'showRedCard',
  theme: 'theme',
  homeStorage: 'home_storage',
  callbackParams: 'callback_params',
  matchData: 'match_data',
  featureData: 'feature_ata',
  cacheDuration: 30 * 60 * 1000,
  matchDataTimestamp: 'match_data_timestamp',
  getApp: 'get_app',
};

export enum NOTICE_TYPE {
  competition = 'competition',
  match = 'match',
  competitor = 'competitor',
}

export enum PAGE {
  results = 'results',
  liveScore = 'live-score',
  fixtures = 'fixtures',
}

export enum SPORT {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  VOLLEYBALL = 'volleyball',
  BADMINTON = 'badminton',
  BASEBALL = 'baseball',
  AMERICAN_FOOTBALL = 'am-football',
  CRICKET = 'cricket',
  ICE_HOCKEY = 'hockey',
  TABLE_TENNIS = 'table-tennis',
  SNOOKER = 'snooker',
}

export enum LINEUPS_TAB {
  nationality = 'nationality',
  height = 'height',
  age = 'age',
}

export enum STANDINGS_TAB {
  realtime = 'total/realtime',
  total = 'total',
  home = 'home',
  away = 'away',
}
export const FOOTBALL_STATUS_CODE = {
  6: 'HT',
  13: 'Penalties',
  14: 'ET',
  15: 'interrupted',
  60: 'postponed',
  70: 'cancelled',
  90: 'cancelled',
  100: 'FT',
  110: 'AET',
  120: 'AP',
};

export const footballStatusCodeMapping = (code: number) =>
  FOOTBALL_STATUS_CODE[code as keyof typeof FOOTBALL_STATUS_CODE] || '';

export const FOOTBALL_END_MATCH_STATUS = ['FT', 'AET', 'AP'];

export const isBrowser = typeof window !== 'undefined';
export const isServer = !isBrowser;
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export const MATCH_FILTERS = {
  FINISHED: 'finished',
  HOT: 'hot',
  LIVE: 'live',
  RESULTS: 'results',
  ALL: 'all',
  FIXTURES: 'fixtures',
};

export enum SOCKET_TOPIC {
  football = 'fb-live',
  basketball = 'basket-live',
  tennis = 'tennis-live',
  volleyball = 'volleyball-live',
  badminton = 'badminton-live',
  baseball = 'baseball-live',
  cricket = 'cricket-live',
  'am-football' = 'am-fb-live',
  hockey = 'hockey-live',
  'table-tennis' = 'table-tennis-live',
  snooker = 'snooker-live',
}

export enum SOCKET_CHAT_TOPIC {
  football = 'football',
  basketball = 'basketball',
  tennis = 'tennis',
  volleyball = 'volleyball',
  badminton = 'badminton',
  baseball = 'baseball',
  cricket = 'cricket',
  americanFootball = 'american-football',
  hockey = 'hockey',
  tableTennis = 'table-tennis',
  snooker = 'snooker',
}

export const initialFollowed: IFollow['followed'] = {
  teams: {
    football: [],
    basketball: [],
    tennis: [],
    hockey: [],
    "table-tennis": [],
    volleyball: [],
    cricket: [],
    "am-football": [],
    baseball: [],
    badminton: [],
  },
  players: {
    football: [],
    basketball: [],
    tennis: [],
    hockey: [],
    "table-tennis": [],
    volleyball: [],
    cricket: [],
    "am-football": [],
    baseball: [],
    badminton: [],
  },
  tournament: {
    football: [],
    basketball: [],
    tennis: [],
    hockey: [],
    "table-tennis": [],
    volleyball: [],
    cricket: [],
    "am-football": [],
    baseball: [],
    badminton: [],
  },
  uniqueTournament: {
    football: [],
    basketball: [],
    tennis: [],
    hockey: [],
    "table-tennis": [],
    volleyball: [],
    cricket: [],
    "am-football": [],
    baseball: [],
    badminton: [],
  },
  match: [],
};

export const STATIC_ROUTES = [
  'am-football',
  'badminton',
  'baseball',
  'basketball',
  'blogs',
  'contact',
  'cricket',
  'favorite',
  'football',
  'hockey',
  // 'news',
  'table-tennis',
  'tennis',
  'user',
  'volleyball',
  'login',
  'auth',
  'mobile',
  'snooker',
];

export const FILTER_COUNTRY_BY_KEY_LANG: any[] = [
  {
    "name": "United States",
    "slug": "united-states",
    "id": "g38gsxoowxth3we",
    "flag": "united-states",
    "key": 'en'
  },
  {
    "name": "England",
    "slug": "england",
    "id": "nq8prta4pwtedsb",
    "flag": "england",
    "key": 'en-GB'
  },
  {
    "name": "Germany",
    "slug": "germany",
    "id": "qhd9ut9qp3txee9",
    "flag": "germany",
    "key": 'de'
  },
  {
    "name": "Portugal",
    "slug": "portugal",
    "id": "2e72dozrpxth3we",
    "flag": "portugal",
    "key": 'pt'
  },
  {
    "name": "Italy",
    "slug": "italy",
    "id": "70asdo2npgu7tmm",
    "flag": "italy",
    "key": 'it'
  },
  {
    "name": "Brazil",
    "slug": "brazil",
    "id": "no03wnpomjtwd8j",
    "flag": "brazil",
    "key": 'pt-BR'
  },
  {
    "name": "Spain",
    "slug": "spain",
    "id": "3hc6ro1wp0p3bmq",
    "flag": "spain",
    "key": 'es'
  },
  {
    "name": "France",
    "slug": "france",
    "id": "als40spspjtwd8j",
    "flag": "france",
    "key": 'fr'
  },
  {
    "name": "Indonesia",
    "slug": "indonesia",
    "id": "nkb1x23ofvua33u",
    "flag": "indonesia",
    "key": 'id'
  },
  {
    "name": "India",
    "slug": "india",
    "id": "h5bhxp8ol5t91yb",
    "flag": "india",
    "key": 'hi'
  },
  {
    "name": "Turkey",
    "slug": "turkey",
    "id": "7au4xbkor2t97f7",
    "flag": "turkey",
    "key": 'tr'
  },
  {
    "name": "Malaysia",
    "slug": "malaysia",
    "id": "no03wnpofjtwd8j",
    "flag": "malaysia",
    "key": 'ms'
  },
  {
    "name": "Benin",
    "slug": "benin",
    "id": "nkb1x23o98ua33u",
    "flag": "benin",
    "key": 'bn'
  },
  {
    "name": "Croatia",
    "slug": "croatia",
    "id": "m2q3xlro42p8ag1",
    "flag": "croatia",
    "key": 'hr'
  },
  {
    "name": "Netherlands",
    "slug": "netherlands",
    "id": "9k6u0tnup2p8ag1",
    "flag": "netherlands",
    "key": 'nl'
  },
  {
    "name": "Poland",
    "slug": "poland",
    "id": "bwq6ushlpwu669p",
    "flag": "poland",
    "key": 'pl'
  },
  {
    "name": "Greece",
    "slug": "greece",
    "id": "na3huos1pwt1o5r",
    "flag": "greece",
    "key": 'el'
  },
  {
    "name": "Saudi Arabia",
    "slug": "saudi-arabia",
    "id": "s4luxy1orwtedsb",
    "flag": "saudi-arabia",
    "key": 'ar-XA'
  },
  {
    "name": "North Korea",
    "slug": "north-korea",
    "id": "bm0nxito3zu9p9u",
    "flag": "north-korea",
    "key": 'ko'
  },
  {
    "name": "Thailand",
    "slug": "thailand",
    "id": "mfiws1aoh0uztg4",
    "flag": "thailand",
    "key": 'th'
  },
  {
    "name": "China",
    "slug": "china",
    "id": "y3d7s6dorktm560",
    "flag": "china",
    "key": 'zh-CN'
  },
  {
    "name": "Japan",
    "slug": "japan",
    "id": "c9dxsq8oswt1o5r",
    "flag": "japan",
    "key": 'ja'
  },
  {
    "name": "Philippines",
    "slug": "philippines",
    "id": "c467w80osytp4sj",
    "flag": "philippines",
    "key": 'en-PH'
  },
  {
    "name": "Singapore",
    "slug": "singapore",
    "id": "jz5xx7nom3txee9",
    "flag": "singapore",
    "key": 'en-SG'
  },
  {
    "name": "India",
    "slug": "india",
    "id": "h5bhxp8ol5t91yb",
    "flag": "india",
    "key": 'en-IN'
  },
  {
    "name": "Russia",
    "slug": "russia",
    "id": "glof8t46pvua33u",
    "flag": "russia",
    "key": 'ru'
  },
  {
    "name": "Ukraine",
    "slug": "ukraine",
    "id": "2lis8tcvpot2eym",
    "flag": "ukraine",
    "key": 'uk'
  },
  {
    "name": "Vietnam",
    "slug": "vietnam",
    "id": "bm0nxitodju9p9u",
    "flag": "vietnam",
    "key": 'vi'
  },
]