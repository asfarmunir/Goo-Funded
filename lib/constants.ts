export const navlinks = [
  {
    title: "Home",
    icons: [
      {
        src: "/icons/home.svg",
      },
      {
        src: "/icons/home-off.svg",
      },
    ],
    link: "/",
  },
  {
    title: "Dashboard",
    icons: [
      {
        src: "/icons/dashboard.svg",
      },
      {
        src: "/icons/dashboard-off.svg",
      },
    ],
    link: "/dashboard",
  },
  {
    title: "pick",
    icons: [
      {
        src: "/icons/pick-green.svg",
      },
      {
        src: "/icons/pick-off.svg",
      },
    ],
    link: "/picks",
  },
  {
    title: "community",
    icons: [
      {
        src: "/icons/community.svg",
      },
      {
        src: "/icons/community-off.svg",
      },
    ],
    link: "/community",
  },
  {
    title: "Affiliates",
    icons: [
      {
        src: "/icons/refer.svg",
      },
      {
        src: "/icons/refer-off.svg",
      },
    ],
    link: "/refer-and-earn",
  },
];

export const tabs = [
  {
    name: "profile",
  },
  {
    name: "accounts",
  },
  {
    name: "payouts",
  },
  // {
  //   name: "certificates",
  // },
];

export const settingTabs = [
  {
    name: "general",
    tab: "general",
  },
  {
    name: "preferences",
    tab: "preferences",
  },
  {
    name: "billing",
    tab: "billing",
  },
  {
    name: "kyc verification",
    tab: "kyc",
  },
  {
    name: "agreements",
    tab: "agreements",
  },
  {
    name: "2-STEP verification",
    tab: "verification",
  },
];

export const dashboardTabs = [
  {
    title: "Account Stats",
    tab: "stats",
    icon: ["/icons/trophy.png", "/icons/trophy-off.png"],
  },
  {
    title: "objectives",
    tab: "objectives",
    icon: ["/icons/objective-green.png", "/icons/objective-off.png"],
  },
  {
    title: " bet history",
    tab: "history",
    icon: ["/icons/bet.png", "/icons/bet-off.png"],
  },
];

// PICKS
export const picksTabs = [
  {
    title: "hottest games",
    tab: "hottest",
    icon: ["/icons/hottes.svg", "/icons/hottest-game-off.png"],
  },
  {
    title: "mma",
    tab: "mma",
    icon: ["/icons/mma.svg", "/icons/mma-off.svg"],
  },
  {
    title: "soccer",
    tab: "soccer",
    icon: ["/icons/soccer.svg", "/icons/soccer-off.svg"],
  },
  {
    title: "hockey",
    tab: "hockey",
    icon: ["/icons/hockey.svg", "/icons/hockey-off.svg"],
  },
  {
    title: "football",
    tab: "football",
    icon: ["/icons/football.svg", "/icons/football.svg"],
  },
  {
    title: "basketball",
    tab: "basketball",
    icon: ["/icons/basketball.svg", "/icons/basketball-off.svg"],
  },
  {
    title: "baseball",
    tab: "baseball",
    icon: ["/icons/baseball.svg", "/icons/baseball-off.svg"],
  },

  {
    title: "tennis",
    tab: "tennis",
    icon: ["/icons/tennis.svg", "/icons/tennis-off.svg"],
  },
];

// PROFILE LEVELS
// export const profileLevels = {
//   NEWBIE: {
//     icon: "/icons/newbie.svg",
//     target: 10,
//   },
//   BRONZE: {
//     icon: "/icons/level2.png",
//     target: 50,
//   },
//   SILVER: {
//     icon: "/images/plan.png",
//     target: 100,
//   },
//   GOLD: {
//     icon: "/icons/gold.svg",
//     target: 200,
//   },
//   PLATINUM: {
//     icon: "/icons/level3.png",
//     target: 350,
//   },
//   HERO: {
//     icon: "/icons/level1.png",
//     target: 351,
//   },
// };
export const profileLevels = {
  Beginner: {
    icon: "/vintage/images/1.svg",
    target: 10,
  },
  Superviser: {
    icon: "/vintage/images/2.svg",
    target: 25,
  },
  Coach: {
    icon: "/vintage/images/2.svg",
    target: 50,
  },
  TopTier: {
    icon: "/vintage/images/2.svg",
    target: 100,
  },
  RegionalPlayer: {
    icon: "/vintage/images/2.svg",
    target: 200,
  },
  // HERO: {
  //   icon: "/icons/level1.png",
  //   target: 351,
  // },
};

export const LEVEL_1_TARGET = 10;
export const LEVEL_2_TARGET = 50;
export const LEVEL_3_TARGET = 100;

export const BONUS = 50;

export const REFER_COMMISSIONS = {
  level1: {
    target: 10,
    commission: 0.15, // 15%
  },
  level2: {
    target: 50,
    commission: 0.15, // 15%
  },
  level3: {
    target: 100,
    commission: 0.2, // 20%
  },
};

export const ALL_STEP_CHALLENGES = {
  minPicks: 20,
  minPickAmount: 0.01, // 2.5%
  maxPickAmount: 0.1, // 10%
  maxLoss: 0.2, // 20%
  maxDailyLoss: 0.15, // 15%
  profitTarget: 0.33, // 30%
  minBetPeriod: 7, // 7 days
  maxBetPeriod: 30, // 30 days
};

export const DAILY_LOSS_TIMER_RESET = new Date().setUTCHours(6, 0, 0, 0);

// EMAIL CONSTANTS (it was used for sendgrid Api)
export const FROM_EMAIL = "no-reply@pickshero.io";
export const MAX_PROFIT_THRESHOLD = 0.25;
