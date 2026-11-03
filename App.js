import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useMemo, useRef, useState } from 'react';
/* LOOKPASS_V1: image imports. */
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Text,
  View,
  Animated,
  Easing,
  Image,
  ImageBackground,
  AccessibilityInfo,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const GOLD = '#f4c542';
const BLUE = '#3ea6ff';
const GREEN = '#4cd97b';
const PURPLE = '#ad7bff';

/* LOOKPASS_V1: art table. */
/* Images live in assets/ next to App.js. No game text, price, or rule lives here. */
const ART = {
  bgMainMenu: require('./assets/bg_main_menu.png'),
  bgHome: require('./assets/bg_home.png'),
  bgMap: require('./assets/bg_map.png'),
  bgWork: require('./assets/bg_work.png'),
  bgWorkClerk: require('./assets/bg_work_clerk.png'),
  bgBank: require('./assets/bg_bank.png'),
  bgStore: require('./assets/bg_store.png'),
  bgEmployment: require('./assets/bg_employment.png'),
  cash: require('./assets/icon_cash.png'),
  savings: require('./assets/icon_savings.png'),
  credit: require('./assets/icon_credit.png'),
  xp: require('./assets/icon_xp.png'),
  coins: require('./assets/icon_coins.png'),
  bldgHome: require('./assets/icon_bldg_home.png'),
  bldgEmployment: require('./assets/icon_bldg_employment.png'),
  bldgBank: require('./assets/icon_bldg_bank.png'),
  bldgStore: require('./assets/icon_bldg_store.png'),
  bldgWork: require('./assets/icon_bldg_work.png'),
  workCarton: require('./assets/icon_work_carton.png'),
  workHandtruck: require('./assets/icon_work_handtruck.png'),
  workClock: require('./assets/icon_work_clock.png'),
  workPaycheck: require('./assets/icon_work_paycheck.png'),
  workTray: require('./assets/icon_work_tray.png'),
  workFolder: require('./assets/icon_work_folder.png'),
  workDesk: require('./assets/icon_work_desk.png'),
  bankBuilding: require('./assets/icon_bank_building.png'),
  bankJar: require('./assets/icon_bank_jar.png'),
  bankDeposit: require('./assets/icon_bank_deposit.png'),
  storeBackpack: require('./assets/icon_store_backpack.png'),
  storeShoes: require('./assets/icon_store_shoes.png'),
  storeKettle: require('./assets/icon_store_kettle.png'),
  storeCheck: require('./assets/icon_store_check.png'),
  empBriefcase: require('./assets/icon_emp_briefcase.png'),
  empClipboard: require('./assets/icon_emp_clipboard.png'),
  empBadge: require('./assets/icon_emp_badge.png'),
  empBook: require('./assets/icon_emp_book.png'),
  /* HARLEY_V1_ART: dealership bike pictures. Files ship in assets/
   * next to App.js (copy them there with this patch). */
  bikeIron883: require('./assets/bike_iron883.png'),
  bikeSoftail: require('./assets/bike_softail.png'),
  bikeFatBoy: require('./assets/bike_fatboy.png'),
  bikeRoadKing: require('./assets/bike_roadking.png'),
  bikeStreetGlide: require('./assets/bike_streetglide.png'),
};
const STORE_ICONS = {
  backpack: ART.storeBackpack,
  work_shoes: ART.storeShoes,
  kettle: ART.storeKettle,
};

const story = [
  {
    key: 'start',
    eyebrow: 'EARLY DEMO • LIFE SIMULATOR',
    title: "SKY'S THE LIMIT",
    body: 'Your journey. Your choices. Your future.',
    button: 'START YOUR JOURNEY',
  },
  {
    key: 'character',
    eyebrow: 'CHARACTER SETUP',
    title: 'Meet Zabby',
    body:
      'You are starting fresh with $2500 cash, a 575 credit score, and one goal: build a better life.',
    button: 'CHOOSE YOUR DREAM',
  },
  {
    key: 'dream',
    eyebrow: 'YOUR DREAM',
    title: 'Build a Life With Options',
    body:
      'Get stable housing, reliable transportation, better work, savings, property, businesses, and eventually a legacy.',
    button: 'FIND HOUSING',
  },
  {
    key: 'housing',
    eyebrow: 'HOUSING & BILLS',
    title: 'Room Rental — East Oakland',
    body:
      'Rent: $700/month. A practical first move that leaves room for food, transportation, savings, and credit building.',
    button: 'CHOOSE TRANSPORTATION',
  },
  {
    key: 'transport',
    eyebrow: 'TRANSPORTATION',
    title: 'Start Smart',
    body:
      'Use affordable transportation now. Upgrade to a car after your income, savings, and credit score improve.',
    button: 'GO TO WORK',
  },
  {
    key: 'work',
    eyebrow: 'EMPLOYMENT CENTER',
    title: 'Warehouse Associate',
    body:
      '$18/hour • 8-hour shift. Each completed shift earns $144 and 40 XP.',
    button: 'WORK A SHIFT',
  },
  {
    key: 'bill',
    eyebrow: 'LIFE EVENT',
    title: 'Unexpected Bill',
    body: 'A surprise expense hits your budget.',
    button: 'HANDLE THE BILL',
  },
  {
    key: 'payday',
    eyebrow: 'PAYDAY',
    title: '+ $720',
    body:
      'Your paycheck lands. Bills are covered. Now decide how much to save and how much to keep available.',
    button: 'SEE THE TEMPTATION',
  },
  {
    key: 'temptation',
    eyebrow: 'CHOICE',
    title: 'The $399 Temptation',
    body:
      'A new gadget looks good, but buying it now slows your emergency fund. Your choices shape the future.',
    button: 'SKIP IT & SAVE',
  },
  {
    key: 'report',
    eyebrow: 'WEEK 1 REPORT',
    title: 'You Are Moving Forward',
    body:
      'Bills paid on time • Savings growing • Credit protected • XP earned. Small wins compound.',
    button: 'ENTER FREE ROAM',
  },
];

/* POLISH_V1_STAT: Cash is the hero (bigger, green); Credit and XP are small; Savings is dim. */
const Stat = ({ label, value, accent, onPress, icon, hero, small, dim }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.stat, { borderColor: accent }, hero && styles.statHero]}
  >
    {/* LOOKPASS_V1: stat icon. */}
    {icon ? <Image source={icon} style={styles.statIcon} resizeMode="contain" /> : null}
    <Text style={[styles.statLabel, { color: accent }]}>{label}</Text>

    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[styles.statValue, hero && styles.statHeroValue, small && styles.statValueSm, dim && styles.statValueDim]}
    >
      {value}
    </Text>
  </TouchableOpacity>
);


const SKY_SAVE_KEY = "skys-limit-save-v1";
const SKY_INITIAL = {
  step: 0, cash: 2500, savings: 0,
  credit: 575, xp: 0, coins: 0, place: null, employment: 'none',
  training: 'incomplete', pendingWages: 0, goalsDone: [], pendingEvent: null,
  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1, housing: 'none', jobId: 'none', inventory: [], /* CHAPTER3_BIZ_V1: new save fields. */ ownedBusinesses: [], hours: 8, bizWork: {}, businessUnlocked: false, /* CHAPTER3_INV_V1: new save fields. */ savingsPeak: 0, bondOwned: false, fundOwned: false, fundValue: 1000, fundCycle: 0, propertiesOwned: [], lastInvestPayday: -1, investmentsUnlocked: false, /* HARLEY_V1_INITIAL: new save field. */ ownedBikes: [], /* TRANSIT_V1_SAVE: new save fields. */ transitEmployment: 'none', transitTraining: 'incomplete', transitBus: null, transitStop: 0, transitAboard: 0, transitBoarded: false, transitShiftActive: false, /* DAILY_LIMIT_V1: new save fields. */ earnedToday: 0, earnedTodayDay: 0
};

const STORE_ITEMS = [
  { id: 'backpack', name: 'Backpack', price: 25 },
  { id: 'work_shoes', name: 'Work shoes', price: 45 },
  { id: 'kettle', name: 'Kettle', price: 30 },
];

function normalizeInventory(value) {
  return Array.isArray(value)
    ? STORE_ITEMS.filter((item) => value.includes(item.id)).map((item) => item.id)
    : [];
}

function purchaseStoreItem(cash, inventory, itemId) {
  const item = STORE_ITEMS.find((entry) => entry.id === itemId);
  if (!item) return { ok: false, message: 'This item is unavailable.' };
  if (inventory.includes(item.id))
    return { ok: false, message: 'You already own ' + item.name + '.' };
  if (!Number.isFinite(cash) || cash < item.price)
    return { ok: false, message: 'Not enough cash. ' + item.name + ' costs $' + item.price + '.' };
  return {
    ok: true,
    cash: cash - item.price,
    inventory: [...inventory, item.id],
    message: 'Purchased ' + item.name + ' for $' + item.price + '.',
  };
}

/* CHAPTER3_BIZ_V1: businesses (AGREED rules, Oct 31). The menu unlocks
 * at $1,500 saved in BANK (cash on hand does not count). Prices are
 * deducted in full from BANK; the Food Stand needs $2,000 even though
 * the menu unlocks at $1,500. Pay is per completed job. */
const BUSINESS_UNLOCK_SAVINGS = 1500;
const BUSINESSES = [
  { id: 'hauling', name: 'Hauling Service', price: 1500, pay: 180, jobHours: 2 },
  { id: 'cleaning', name: 'Cleaning Service', price: 1200, pay: 120, jobHours: 2 },
  { id: 'foodstand', name: 'Food Stand', price: 2000, pay: 200, jobHours: 2 },
];

function normalizeOwnedBusinesses(value) {
  return Array.isArray(value)
    ? BUSINESSES.filter((biz) => value.includes(biz.id)).map((biz) => biz.id)
    : [];
}

function normalizeBizWork(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out = {};
  for (const biz of BUSINESSES) {
    const entry = value[biz.id];
    if (entry && typeof entry === 'object' &&
      Number.isInteger(entry.day) && entry.day >= 0 &&
      Number.isInteger(entry.count) && entry.count >= 0)
      out[biz.id] = { day: entry.day, count: entry.count };
  }
  return out;
}

function purchaseBusiness(savings, owned, businessId) {
  const biz = BUSINESSES.find((entry) => entry.id === businessId);
  if (!biz) return { ok: false, message: 'This business is unavailable.' };
  if (owned.includes(biz.id))
    return { ok: false, message: 'You already own ' + biz.name + '.' };
  if (!Number.isFinite(savings) || savings < biz.price)
    return { ok: false, message: 'Not enough saved. ' + biz.name + ' costs $' + biz.price + ' in savings.' };
  return {
    ok: true,
    savings: savings - biz.price,
    owned: [...owned, biz.id],
    message: 'You bought ' + biz.name + ' for $' + biz.price + ' from savings.',
  };
}

/* HARLEY_V1_BIKES: Sky's Limit Harley Dealership. Cash only (not
 * savings), buy-once, no gameplay effects in v1 -- browsing, buying,
 * and persistent ownership only. Prices are the proposal Zabby
 * approved Nov 2, 2026. */
const BIKES = [
  { id: 'iron883', name: 'Harley-Davidson Iron 883', blurb: 'A light Sportster -- easy to handle, classic Harley rumble.', price: 1500 },
  { id: 'softail', name: 'Harley-Davidson Softail Standard', blurb: 'A smooth cruiser with a clean, classic look.', price: 3000 },
  { id: 'fatboy', name: 'Harley-Davidson Fat Boy 114', blurb: 'Big, bold, and hard to miss on the road.', price: 5000 },
  { id: 'roadking', name: 'Harley-Davidson Road King', blurb: 'A touring bike built for long rides in comfort.', price: 7500 },
  { id: 'streetglide', name: 'Harley-Davidson Street Glide', blurb: 'The top of the line -- full fairing, full presence.', price: 10000 },
];

const BIKE_IMAGES = {
  iron883: ART.bikeIron883,
  softail: ART.bikeSoftail,
  fatboy: ART.bikeFatBoy,
  roadking: ART.bikeRoadKing,
  streetglide: ART.bikeStreetGlide,
};

function normalizeOwnedBikes(value) {
  return Array.isArray(value)
    ? BIKES.filter((bike) => value.includes(bike.id)).map((bike) => bike.id)
    : [];
}

/* HARLEY_V1_BIKES: pure buy logic (same shape as purchaseStoreItem).
 * Cash only. Exactly one deduction, only on success. */
function purchaseBike(cash, owned, bikeId) {
  const bike = BIKES.find((entry) => entry.id === bikeId);
  if (!bike) return { ok: false, message: 'This bike is unavailable.' };
  if (owned.includes(bike.id))
    return { ok: false, message: 'You already own the ' + bike.name + '.' };
  if (!Number.isFinite(cash) || cash < bike.price)
    return { ok: false, message: 'Not enough cash. The ' + bike.name + ' costs $' + bike.price + '. You have $' + cash + '.' };
  return {
    ok: true,
    cash: cash - bike.price,
    owned: [...owned, bike.id],
    message: 'You bought the ' + bike.name + ' for $' + bike.price + '. $' + (cash - bike.price) + ' cash left.',
  };
}

/* CASINO_V1_GAMES: Sky City Casino v1. Cash only, savings untouched.
 * SLOTS: each reel is a 20-stop strip (Seven 1, Star 2, Bell 4,
 * Cherry 6, Lemon 7). Every spin draws each reel's stop
 * independently and shows the three symbols; the prize comes from
 * the shown symbols (highest only). Multipliers are TOTAL cash
 * returned, bet included. Verified RTP 88.0125% (7041/8000).
 * BLACKJACK: one 52-card deck shuffled per round, dealer stands on
 * all 17s, natural pays 3:2 in whole dollars ($10->$15, $20->$30,
 * $50->$75). ROULETTE: European wheel, 18 red / 18 black / 1 green 0.
 * No new save fields: cash is already persisted by the save effect. */
const SLOT_REEL = [
  'seven',
  'star', 'star',
  'bell', 'bell', 'bell', 'bell',
  'cherry', 'cherry', 'cherry', 'cherry', 'cherry', 'cherry',
  'lemon', 'lemon', 'lemon', 'lemon', 'lemon', 'lemon', 'lemon',
];

const SLOT_EMOJI = {
  seven: '7️⃣',
  star: '⭐',
  bell: '🔔',
  cherry: '🍒',
  lemon: '🍋',
};

const SLOT_PRIZES = [
  { symbols: ['seven', 'seven', 'seven'], mult: 100, label: 'Three 7s: 100x' },
  { symbols: ['star', 'star', 'star'], mult: 25, label: 'Three Stars: 25x' },
  { symbols: ['bell', 'bell', 'bell'], mult: 15, label: 'Three Bells: 15x' },
  { symbols: ['cherry', 'cherry', 'cherry'], mult: 8, label: 'Three Cherries: 8x' },
  { symbols: ['lemon', 'lemon', 'lemon'], mult: 3, label: 'Three Lemons: 3x' },
];

function spinSlots() {
  return [0, 1, 2].map(() => SLOT_REEL[Math.floor(Math.random() * SLOT_REEL.length)]);
}

/* CASINO_V1_GAMES: highest prize only -- three-of-a-kind first (in
 * chart order), then exactly two cherries. Returns TOTAL cash back,
 * bet included. */
function slotsReturn(symbols, bet) {
  const [a, b, c] = symbols;
  if (a === b && b === c) {
    const prize = SLOT_PRIZES.find((entry) => entry.symbols[0] === a);
    return prize ? prize.mult * bet : 0;
  }
  const cherries = symbols.filter((s) => s === 'cherry').length;
  if (cherries === 2) return 2 * bet;
  return 0;
}

const CARD_SUITS = ['♠️', '♥️', '♦️', '♣️'];
const CARD_RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function buildDeck() {
  const deck = [];
  CARD_SUITS.forEach((suit) => {
    CARD_RANKS.forEach((rank) => deck.push({ rank, suit }));
  });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  return deck;
}

function cardLabel(card) {
  return card.rank + card.suit;
}

function cardValue(card) {
  if (card.rank === 'A') return 11;
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') return 10;
  return parseInt(card.rank, 10);
}

/* CASINO_V1_GAMES: best total -- aces count 11 unless that busts,
 * then 1 each. */
function handValue(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach((card) => {
    total += cardValue(card);
    if (card.rank === 'A') aces += 1;
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function isNatural(hand) {
  return hand.length === 2 && handValue(hand) === 21;
}

function dealerShouldHit(hand) {
  return handValue(hand) < 17;
}

/* CASINO_V1_GAMES: total cash returned, bet included -- win 2x bet,
 * push 1x bet, natural bet + 3:2 profit, loss 0. */
function blackjackReturn(playerHand, dealerHand, bet) {
  const playerNatural = isNatural(playerHand);
  const dealerNatural = isNatural(dealerHand);
  if (playerNatural && dealerNatural) return bet;
  if (playerNatural) return bet + Math.floor((bet * 3) / 2);
  if (dealerNatural) return 0;
  const player = handValue(playerHand);
  const dealer = handValue(dealerHand);
  if (player > 21) return 0;
  if (dealer > 21) return bet * 2;
  if (player > dealer) return bet * 2;
  if (player === dealer) return bet;
  return 0;
}

const ROULETTE_RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const ROULETTE_BLACK = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

function spinRoulette() {
  return Math.floor(Math.random() * 37);
}

function rouletteColor(pocket) {
  if (pocket === 0) return 'green';
  return ROULETTE_RED.includes(pocket) ? 'red' : 'black';
}

/* CASINO_V1_GAMES: total cash returned, bet included -- correct color
 * 2x bet, else 0. */
function rouletteReturn(pick, pocket, bet) {
  return rouletteColor(pocket) === pick ? bet * 2 : 0;
}

/* TRANSIT_V1_DATA: Sky City Transit v1. One bus-driver job, one route
 * (City Loop). Pay is a flat $144 for training and $144 per completed
 * route shift, matching the warehouse shift amount; both go through
 * the existing pendingWages + Friday payroll. A completed route also
 * awards 40 XP, matching warehouse work; training gives pay only.
 * Fares belong to the transit system and never reach the
 * driver's cash. This route serves the casino district but is not
 * the free casino shuttle. */
const TRANSIT_TRAINING_PAY = 144;
const TRANSIT_SHIFT_PAY = 144;
const TRANSIT_SHIFT_XP = 40;
const TRANSIT_BUS = 'City Bus #1';
const TRANSIT_STOPS = [
  { id: 'depot', name: 'Transit Depot' },
  { id: 'residential', name: 'Residential' },
  { id: 'hospital', name: 'Hospital/Civic' },
  { id: 'downtown', name: 'Downtown/Shopping' },
  { id: 'casino', name: 'Casino District' },
  { id: 'depot_end', name: 'Transit Depot' },
];
/* Waiting passengers per stop: fixed and cosmetic. Fares never reach
 * the driver and pay is flat per completed route, so these numbers
 * only dress the route. The depot starts and ends empty. */
const TRANSIT_WAITING = [0, 4, 3, 5, 2, 0];

/* TRANSIT_V1_STEP: pure boarding step. Everyone waiting at the
 * current stop boards. Returns the new aboard count. */
function transitBoardStep(state) {
  const waiting = TRANSIT_WAITING[state.stop] || 0;
  return { aboard: state.aboard + waiting, boarded: true, boardedCount: waiting };
}

/* TRANSIT_V1_STEP: pure driving step. Passengers get off BEFORE new
 * passengers board: half the aboard passengers leave at each stop
 * (rounded down); at the final depot everyone exits and the shift
 * completes with one $144 payment. */
function transitDriveStep(state) {
  const nextStop = state.stop + 1;
  if (nextStop >= TRANSIT_STOPS.length - 1) {
    return { stop: 0, aboard: 0, boarded: false, active: false, gotOff: state.aboard, completed: true, pay: TRANSIT_SHIFT_PAY };
  }
  const gotOff = Math.floor(state.aboard / 2);
  return { stop: nextStop, aboard: state.aboard - gotOff, boarded: false, active: true, gotOff: gotOff, completed: false, pay: 0 };
}

/* CHAPTER3_BIZ_V1: how many jobs of one business were done on a given
 * day. The count lives on the existing day counter, so Rest (a new day)
 * re-arms it with no second calendar. */
function bizJobsDoneToday(bizWork, businessId, day) {
  const entry = bizWork ? bizWork[businessId] : null;
  return entry && entry.day === day ? entry.count : 0;
}

/* CHAPTER3_INV_V1: investments + real estate constants. */
const INVEST_UNLOCK_SAVINGS = 2000;
const BOND_PRICE = 500;
const BOND_FRIDAY_PAY = 10;
const FUND_PRICE = 1000;
const FUND_START_VALUE = 1000;
const FUND_WIN = 40;
const FUND_LOSS = 20;
const FUND_FLOOR = 900;
const PROPERTIES = [
  { id: 'duplex', name: 'Duplex', price: 5000, credit: 650, rent: 200 },
  { id: 'apartment', name: 'Apartment Building', price: 10000, credit: 700, rent: 450 },
];

function normalizeProperties(value) {
  return Array.isArray(value)
    ? PROPERTIES.filter((prop) => value.includes(prop.id)).map((prop) => prop.id)
    : [];
}

/* CHAPTER3_INV_V1: savings-peak migration for older saves: the highest
 * of current savings, $1,500 if the business menu is unlocked, and any
 * life-goal savings target already latched. */
function peakMigrationValue(saved) {
  const latched = LIFE_GOALS
    .filter((g) => g.kind === 'savings' && Array.isArray(saved.goalsDone) && saved.goalsDone.includes(g.id))
    .map((g) => g.target);
  return Math.max(
    Number.isFinite(saved.savings) ? saved.savings : 0,
    saved.businessUnlocked === true ? BUSINESS_UNLOCK_SAVINGS : 0,
    ...latched
  );
}

/* CHAPTER3_BIZ_V1: minimal clock display for the 2-hour job advance.
 * Starts at 8 AM, +2 per business job, resets to 8 AM on Rest. */
function formatClock(hours) {
  const h = ((hours % 24) + 24) % 24;
  const suffix = h < 12 ? 'AM' : 'PM';
  const shown = h % 12 === 0 ? 12 : h % 12;
  return shown + ':00 ' + suffix;
}

/* LIVING_CITY_V1: day/night tint for the map, a pure function of the
 * existing business clock. Day 6-18, dusk 18-21, night 21-6. */
function mapTintForHour(hours) {
  const h = ((hours % 24) + 24) % 24;
  if (h >= 18 && h < 21) return { color: '#ff9a3c', opacity: 0.10 };
  if (h >= 21 || h < 6) return { color: '#0a1a33', opacity: 0.28 };
  return { color: '#000000', opacity: 0 };
}

/* JOBS_V1: every job shares one flow -- apply, hired, paid mandatory
 * training, work shifts, Friday paycheck. Warehouse Associate is the
 * original private-business job; City Hall Clerk is the city-government
 * job. PROPOSED RATES (flagged, not established): clerk $20/hr, a step
 * up from warehouse $18/hr. Change numbers here; screens compute from
 * this table. */
const JOBS = {
  warehouse: {
    id: 'warehouse',
    title: 'Warehouse Associate',
    kind: 'Private business',
    trainingHours: 8, trainingRate: 18,
    shiftHours: 8, shiftRate: 18, shiftXp: 40,
    visualShift: true,
  },
  cityhall: {
    id: 'cityhall',
    title: 'City Hall Clerk',
    kind: 'City government',
    trainingHours: 8, trainingRate: 20,
    shiftHours: 8, shiftRate: 20, shiftXp: 40,
    visualShift: false,
  },
};
/* HOUSING_SLICE_V1: first player goal. Room Rental -- East Oakland,
 * $700 first month's rent (intro card). Paid from savings; monthly
 * billing is a parked future system. */
const HOUSING_GOAL = {
  key: 'room_rental',
  name: 'Room Rental \u2014 East Oakland',
  firstMonthRent: 700,
};
/* GOAL_LADDER_V1: Lori's five life goals after housing. Targets track the
 * current savings balance / credit score; completing a goal spends
 * nothing. Completion latches (see goalsDone): once met, a goal stays
 * met even if the balance later drops. */
const LIFE_GOALS = [
  { id: 'breathing_room', name: 'A Little Breathing Room', kind: 'savings', target: 500,
    targetText: 'Have $500 in savings.',
    doneText: "Rent handled, cushion started\u2014you've got room to breathe!" },
  { id: 'building_name', name: 'Building Your Name', kind: 'credit', target: 580,
    targetText: 'Reach a credit score of 580.',
    doneText: "You're building more than a balance\u2014you're building your name!" },
  { id: 'first_thousand', name: 'Your First Thousand', kind: 'savings', target: 1000,
    targetText: 'Have $1,000 in savings.',
    doneText: "A thousand put away\u2014that's hard work you can count!" },
  { id: 'solid_ground', name: 'Solid Ground', kind: 'savings', target: 2000,
    targetText: 'Have $2,000 in savings.',
    doneText: "You've got a roof and a cushion\u2014now you're standing on solid ground!" },
  { id: 'skys_limit', name: "Sky's the Limit", kind: 'savings', target: 3000,
    targetText: 'Have $3,000 in savings.',
    doneText: "From getting housed to getting ahead\u2014look how far you've come!" },
];
/* LIFE_EVENTS_V1: surprise life events, rolled when the player wakes up.
 * Wording and amounts are a STARTER DECK for Lori to rewrite -- every
 * title, text, choice and dollar amount lives in this one table.
 * Effects use the existing systems only: cash, pending wages, XP,
 * credit (capped at 850, same as deposits). needsJob events only roll
 * for hired + trained players. */
const EVENT_CHANCE = 0.45;
const LIFE_EVENTS = [
  { id: 'overtime', needsJob: true, title: 'Overtime Offer',
    text: 'Your boss asks if you can stay late today. The extra hours go on this week\u2019s pay.',
    choices: [
      { label: 'Stay late (+$72 pending pay)', pending: 72, result: 'You stayed late. $72 was added to your pending wages.' },
      { label: 'Head home', result: 'You passed on the overtime and kept your evening.' },
    ] },
  { id: 'friend_loan', title: 'A Friend in Need',
    text: 'Your friend is short on rent money and asks to borrow $50 until payday.',
    choices: [
      { label: 'Lend $50 (+40 XP)', cash: -50, xp: 40, result: 'You helped a friend out. That means something. (+40 XP)' },
      { label: 'Say you can\u2019t', result: 'You had to say no this time. Building your own cushion comes first.' },
    ] },
  { id: 'side_gig', title: 'Weekend Side Gig',
    text: 'A neighbor offers you $60 cash to help move furniture today.',
    choices: [
      { label: 'Take the gig (+$60)', cash: 60, result: 'Hard work, quick cash. +$60.' },
      { label: 'Rest instead', result: 'You took the day for yourself.' },
    ] },
  { id: 'found_wallet', title: 'Found Wallet',
    text: 'You find a wallet on the sidewalk. There\u2019s $75 cash inside and no ID.',
    choices: [
      { label: 'Keep the $75', cash: 75, result: 'You kept the $75.' },
      { label: 'Turn it in (+40 XP)', xp: 40, result: 'You turned the wallet in. Doing right feels right. (+40 XP)' },
    ] },
  { id: 'phone_bill', title: 'Phone Bill Due',
    text: 'Your phone bill is due today: $45. Paying late adds a $15 fee.',
    choices: [
      { label: 'Pay $45 now', cash: -45, credit: 1, result: 'Phone bill paid on time. $45 paid. Credit +1.' }, /* PHONE_BILL_CREDIT_MSG_V1 */ /* PHONE_BILL_CREDIT_V1 */
      { label: 'Pay late (-$15 fee)', cash: -15, result: 'You paid the $15 late fee and pushed the bill back.' },
    ] },
  { id: 'credit_workshop', title: 'Free Credit Workshop',
    text: 'The library is running a free workshop on building credit tonight.',
    choices: [
      { label: 'Attend (+3 credit)', credit: 3, result: 'You showed up and learned the game. Credit +3.' },
      { label: 'Skip it', result: 'You skipped the workshop this time.' },
    ] },
];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FRIDAY = 4;

/* POLISH_V1_PAYDAY: Friday is payday -- rent and the paycheck land then.
 * Pure function of the absolute day number; no state, no economy change. */
function paydayLine(day) {
  const dow = ((day % 7) + 7) % 7;
  const untilFriday = (FRIDAY - dow + 7) % 7;
  if (untilFriday === 0) return 'Today is Payday — rent + paycheck land today.';
  if (untilFriday === 1) return 'Payday is tomorrow (Friday) — rent + paycheck land then.';
  return 'Friday is Payday — rent + paycheck land then.';
}

/* DAILY_LIMIT_V1: $1,500 of earnings per in-game day. Everything
 * the player EARNS counts (business jobs, shift/training pay to
 * pending wages, casino NET winnings, life-event cash gains).
 * Friday rent and paycheck collection do NOT count -- that money
 * was earned on earlier days, just paid Friday. earnedTodayDay
 * stamps the day the counter belongs to, so the counter resets
 * itself when Rest advances the day. */
const DAILY_LIMIT = 1500;
const DAILY_LIMIT_MESSAGE = 'Daily limit reached \u2014 come back tomorrow.';
function earnedTodayFor(earnedToday, earnedTodayDay, day) {
  return earnedTodayDay === day ? earnedToday : 0;
}
function canEarn(earnedToday, earnedTodayDay, day, amount) {
  return earnedTodayFor(earnedToday, earnedTodayDay, day) + amount <= DAILY_LIMIT;
}
/* Casino only: cap a win at what is left under the limit. The bet
 * was already placed, so the win pays partially instead of
 * blocking. A push or loss (returned <= bet) is untouched -- only
 * profit counts toward the limit. */
function capCasinoReturn(returned, bet, remaining) {
  if (returned <= bet) return returned;
  return bet + Math.max(0, Math.min(returned - bet, remaining));
}

export default function App() {
  const [initialSave, setInitialSave] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const saveQueue = useRef(Promise.resolve());

  React.useEffect(() => {
    let active = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(SKY_SAVE_KEY);
        let saved = SKY_INITIAL;
        if (raw !== null) {
          saved = JSON.parse(raw);
          if (!saved || saved.version !== 1)
            throw new Error("Unsupported save");
          for (const key of ["step", "cash", "savings", "credit", "xp"]) {
            if (!Number.isFinite(saved[key]))
              throw new Error("Invalid save");
          }
          if (!Number.isInteger(saved.step) || saved.step < 0)
            throw new Error("Invalid story progress");
          if (saved.place !== null && typeof saved.place !== "string")
            throw new Error("Invalid screen");
          /* Older saves predate employment: they load as not applied. */
          if (saved.employment === undefined || !["none", "applied", "hired"].includes(saved.employment))
            saved.employment = "none";
          /* Training fields are optional: older saves load incomplete with $0 pending. */
          if (saved.training === undefined || !["incomplete", "complete"].includes(saved.training))
            saved.training = "incomplete";
          if (!Number.isFinite(saved.pendingWages) || saved.pendingWages < 0)
            saved.pendingWages = 0;
          /* Coins are new: older saves load with 0 coins, all else preserved. */
          if (!Number.isFinite(saved.coins) || saved.coins < 0)
            saved.coins = 0;
          /* Payroll fields are optional: older saves start Monday with empty payroll. */
          if (!Number.isInteger(saved.day) || saved.day < 0)
            saved.day = 0;
          if (!Number.isFinite(saved.paycheck) || saved.paycheck < 0)
            saved.paycheck = 0;
          if (!Number.isInteger(saved.lastPayday))
            saved.lastPayday = -1;
          if (!Number.isInteger(saved.lastShiftDay))
            saved.lastShiftDay = -1;
          /* Housing is new: older saves load with no stable housing. */
          if (saved.housing === undefined || !["none", "room_rental"].includes(saved.housing))
            saved.housing = "none";
          /* Goal ladder is new: older saves start with no goals latched;
           * anything already met latches on the next balance check. */
          if (!Array.isArray(saved.goalsDone))
            saved.goalsDone = [];
          saved.goalsDone = saved.goalsDone.filter((id) =>
            ["breathing_room", "building_name", "first_thousand", "solid_ground", "skys_limit"].includes(id));
          /* Life events are new: older saves have no event waiting. */
          if (typeof saved.pendingEvent !== "string" ||
            !["overtime", "friend_loan", "side_gig", "found_wallet", "phone_bill", "credit_workshop"].includes(saved.pendingEvent))
            saved.pendingEvent = null;
          /* Job choice is new: saves from before it were warehouse-only. */
          if (saved.jobId === undefined || !["none", "warehouse", "cityhall"].includes(saved.jobId))
            saved.jobId = saved.employment === 'none' ? 'none' : 'warehouse';
          saved.inventory = normalizeInventory(saved.inventory);
          /* CHAPTER3_BIZ_V1: businesses are new: older saves start with
           * no business, the clock at 8 AM, no jobs done, menu locked
           * unless savings already reach $1,500 (permanent latch). */
          saved.ownedBusinesses = normalizeOwnedBusinesses(saved.ownedBusinesses);
          /* CHAPTER3_INV_V1: preserve the displayed business-job clock
           * after reopening, even past midnight (9 jobs = 26, shown as
           * 2 AM by formatClock's 24-hour wrap). Only a bad value (not
           * finite, or negative) resets to 8 AM. */
          if (!Number.isFinite(saved.hours) || saved.hours < 0)
            saved.hours = 8;
          saved.bizWork = normalizeBizWork(saved.bizWork);
          saved.businessUnlocked = saved.businessUnlocked === true || saved.savings >= BUSINESS_UNLOCK_SAVINGS;
          /* CHAPTER3_INV_V1: investments + real estate are new: older
           * saves start with no holdings and the investment menu locked
           * unless savings already reach $2,000 (permanent latch).
           * savingsPeak migrates to the highest of current savings,
           * $1,500 if the business menu is unlocked, and any life-goal
           * savings target already latched. Nothing is deposited
           * automatically; balances never move on load. */
          if (!Number.isFinite(saved.savingsPeak) || saved.savingsPeak < 0)
            saved.savingsPeak = peakMigrationValue(saved);
          saved.bondOwned = saved.bondOwned === true;
          saved.fundOwned = saved.fundOwned === true;
          if (!Number.isFinite(saved.fundValue) || saved.fundValue < 0)
            saved.fundValue = FUND_START_VALUE;
          if (!Number.isInteger(saved.fundCycle) || saved.fundCycle < 0 || saved.fundCycle > 2)
            saved.fundCycle = 0;
          saved.propertiesOwned = normalizeProperties(saved.propertiesOwned);
          if (!Number.isInteger(saved.lastInvestPayday))
            saved.lastInvestPayday = -1;
          saved.investmentsUnlocked = saved.investmentsUnlocked === true || saved.savings >= INVEST_UNLOCK_SAVINGS;
          /* HARLEY_V1_LOAD: bikes are new: older saves start with no
           * bike owned. Nothing else moves on load. */
          saved.ownedBikes = normalizeOwnedBikes(saved.ownedBikes);
          /* TRANSIT_V1_LOAD: transit is new: older saves start unhired
           * with no bus and no shift in progress. A saved mid-route
           * shift keeps its bus, stop, passengers, and progress, so
           * reopening resumes the same shift. Nothing else moves. */
          if (saved.transitEmployment === undefined || !['none', 'hired'].includes(saved.transitEmployment))
            saved.transitEmployment = 'none';
          if (saved.transitTraining === undefined || !['incomplete', 'complete'].includes(saved.transitTraining))
            saved.transitTraining = 'incomplete';
          if (typeof saved.transitBus !== 'string') saved.transitBus = null;
          if (!Number.isInteger(saved.transitStop) || saved.transitStop < 0 || saved.transitStop > 5)
            saved.transitStop = 0;
          if (!Number.isInteger(saved.transitAboard) || saved.transitAboard < 0)
            saved.transitAboard = 0;
          saved.transitBoarded = saved.transitBoarded === true;
          saved.transitShiftActive = saved.transitShiftActive === true;
          if (saved.transitTraining !== 'complete') saved.transitShiftActive = false;
          if (saved.transitShiftActive && typeof saved.transitBus !== 'string') saved.transitBus = TRANSIT_BUS;
          /* DAILY_LIMIT_V1_LOAD: daily earnings are new: older saves
           * start at $0 earned on the current day. A bad value resets
           * to 0; the day stamp is what resets the counter when the
           * day advances. Nothing else moves on load. */
          if (!Number.isFinite(saved.earnedToday) || saved.earnedToday < 0)
            saved.earnedToday = 0;
          if (!Number.isInteger(saved.earnedTodayDay) || saved.earnedTodayDay < 0)
            saved.earnedTodayDay = saved.day;
          /* Old saves may have the shift screen open; shifts now need training first. */
          if (saved.place === "WORK")
            saved.place = null;
        }
        if (active) setInitialSave(saved);
      } catch (error) {
        console.warn("Load failed:", error);
        if (active) setLoadError(true);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const persistSave = React.useCallback((state) => {
    const json = JSON.stringify({ ...state, version: 1 });
    saveQueue.current = saveQueue.current
      .then(() => AsyncStorage.setItem(SKY_SAVE_KEY, json))
      .then(() => setSaveError(false))
      .catch((error) => {
        console.warn("Save failed:", error);
        setSaveError(true);
      });
  }, []);

  /* POLISH_V1_STATUSBAR_LOAD_ERROR */
  if (loadError) {
    return React.createElement(
      React.Fragment, null,
      React.createElement(StatusBar, { hidden: true }),
      React.createElement(
        Text, { style: { padding: 30 } },
        "Could not load your save. Please refresh to retry."
      )
    );
  }
  /* POLISH_V1_STATUSBAR_LOADING */
  if (initialSave === null) {
    return React.createElement(
      React.Fragment, null,
      React.createElement(StatusBar, { hidden: true }),
      React.createElement(
        Text, { style: { padding: 30 } }, "Loading your game..."
      )
    );
  }
  return React.createElement(
    React.Fragment, null,
    /* POLISH_V1_STATUSBAR_ROOT: hide the phone status bar for the whole app. */
    React.createElement(StatusBar, { hidden: true }),
    saveError ? React.createElement(
      Text, { style: { padding: 12, color: "red" } },
      "Progress could not be saved. Please keep the game open."
    ) : null,
    React.createElement(Game, { initialSave, persistSave })
  );
}

/*
 * The player's 2D character, drawn with lightweight shapes. Shared by the
 * city map and the warehouse scene for a consistent look.
 */
function PlayerFigure({ shirt = '#e8b93c' }) {
  return (
    <View style={pfig.wrap}>
      <View style={pfig.head} />
      <View style={[pfig.body, { backgroundColor: shirt }]} />
      <View style={pfig.legs}>
        <View style={pfig.leg} />
        <View style={pfig.leg} />
      </View>
    </View>
  );
}

const pfig = StyleSheet.create({
  wrap: { alignItems: 'center', width: 30 },
  head: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e8b98a' },
  body: { width: 22, height: 24, borderRadius: 6, marginTop: 2 },
  legs: { flexDirection: 'row', width: 22, justifyContent: 'space-between', marginTop: 2 },
  leg: { width: 8, height: 14, borderRadius: 3, backgroundColor: '#2b3442' },
});

/* LIVING_CITY_V1: ambient life on the city map -- visual only.
 * Four walkers run fixed errand loops between building doors (purpose,
 * not wandering), two cars drive the main street, and a tint follows the
 * business clock. Nothing here touches the save, the persist object, or
 * any economy value: every position lives in Animated.Value refs, never
 * in state, never persisted. */
const LIVING_CITY_STREET_Y = 0.6425; // main street centreline, fraction of map height
const LIVING_CITY_WALK_Y = 0.6225; // walkers use the street's upper edge, clear of cars
const LIVING_CITY_DOORS = {
  HOME: { x: 0.19, y: 0.33 },
  WORK: { x: 0.81, y: 0.33 },
  CASINO: { x: 0.50, y: 0.33 },
  BANK: { x: 0.19, y: 0.63 },
  TRANSIT: { x: 0.50, y: 0.63 },
  STORE: { x: 0.81, y: 0.63 },
  DEALERSHIP: { x: 0.50, y: 0.70 },
  PLAZA: { x: 0.50, y: 0.93 },
};

/* One errand stop: { at: 'HOME', pause: 5 } -- seconds spent inside. */
const LIVING_CITY_WALKERS = [
  { shirt: '#2ec4b6', speed: 0.11, start: 0, stops: [
    { at: 'HOME', pause: 5 }, { at: 'WORK', pause: 6 }, { at: 'BANK', pause: 4 }, { at: 'STORE', pause: 5 },
  ] },
  { shirt: '#e4572e', speed: 0.09, start: 1, stops: [
    { at: 'HOME', pause: 5 }, { at: 'STORE', pause: 5 }, { at: 'BANK', pause: 4 }, { at: 'TRANSIT', pause: 4 },
  ] },
  { shirt: '#ad7bff', speed: 0.10, start: 1, stops: [
    { at: 'HOME', pause: 5 }, { at: 'CASINO', pause: 6 }, { at: 'DEALERSHIP', pause: 5 }, { at: 'BANK', pause: 4 },
  ] },
  { shirt: '#4cd97b', speed: 0.12, start: 0, stops: [
    { at: 'PLAZA', pause: 4 }, { at: 'BANK', pause: 4 }, { at: 'STORE', pause: 5 }, { at: 'HOME', pause: 5 },
  ] },
];

const LIVING_CITY_CARS = [
  { body: '#3ea6ff', from: 0.02, to: 0.98, duration: 6000 },
  { body: '#ff9a3c', from: 0.98, to: 0.02, duration: 7000 },
];

/* LIVING_CITY_V1: effective standing point of a door for a walker.
 * Row-2 doors (BANK/TRANSIT/STORE) sit on the street, so the walker
 * stops at the street's upper edge instead of the door's own y. */
function livingCityDoorPoint(door) {
  const d = LIVING_CITY_DOORS[door];
  if (!d) return { x: 0.5, y: 0.93 };
  if (d.y === 0.63) return { x: d.x, y: LIVING_CITY_WALK_Y };
  return { x: d.x, y: d.y };
}

/* LIVING_CITY_V1: axis-aligned waypoints from door A to door B, using
 * the same lanes the player walks: door column -> main street ->
 * door column. Returns fraction points; the last one is B's door. */
function livingCityLeg(from, to) {
  const a = livingCityDoorPoint(from);
  const b = livingCityDoorPoint(to);
  const pts = [];
  const streetY = LIVING_CITY_WALK_Y;
  if (a.y !== streetY) pts.push({ x: a.x, y: streetY });
  if (a.x !== b.x) pts.push({ x: b.x, y: streetY });
  if (b.y !== streetY) pts.push({ x: b.x, y: b.y });
  return pts;
}

/* LIVING_CITY_V1: build one walker's whole errand loop as plain step
 * descriptors (the component turns them into Animated composites):
 * legs (one step per axis-aligned segment, duration = length / speed,
 * minimum 800 ms), then fade out at the door, the pause, fade back in
 * at the same door. The itinerary is rotated so the walker starts at
 * its start stop; the loop closes by returning to that stop. */
function buildErrandSequence(walker, mapSize) {
  const stops = walker.stops;
  const n = stops.length;
  const order = [];
  for (let i = 0; i < n; i++) order.push(stops[(walker.start + i) % n]);
  const speedPx = walker.speed * mapSize.w; // px per second
  const steps = [];
  let cur = livingCityDoorPoint(order[0].at);
  for (let i = 1; i <= n; i++) {
    const stop = order[i % n];
    const leg = livingCityLeg(order[(i - 1) % n].at, stop.at);
    let from = cur;
    for (const wp of leg) {
      const to = { x: wp.x * mapSize.w, y: wp.y * mapSize.h };
      const fromPx = { x: from.x * mapSize.w, y: from.y * mapSize.h };
      const len = Math.abs(to.x - fromPx.x) + Math.abs(to.y - fromPx.y);
      const dur = Math.max(800, (len / speedPx) * 1000);
      steps.push({ kind: 'move', to, duration: dur });
      from = wp;
    }
    cur = livingCityDoorPoint(stop.at);
    steps.push({ kind: 'fadeOut', duration: 400 });
    steps.push({ kind: 'pause', duration: stop.pause * 1000 });
    steps.push({ kind: 'fadeIn', duration: 400 });
  }
  return steps;
}

/* LIVING_CITY_V1: a small shape-built car, same View-shape language as
 * PlayerFigure (no emoji, so no Android rendering risk). */
function CarFigure({ body = '#3ea6ff' }) {
  return (
    <View style={carfig.wrap}>
      <View style={[carfig.body, { backgroundColor: body }]} />
      <View style={carfig.wheels}>
        <View style={carfig.wheel} />
        <View style={carfig.wheel} />
      </View>
    </View>
  );
}

const carfig = StyleSheet.create({
  wrap: { alignItems: 'center', width: 30 },
  body: { width: 28, height: 12, borderRadius: 5 },
  wheels: { flexDirection: 'row', width: 24, justifyContent: 'space-between', marginTop: 1 },
  wheel: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#1c2530' },
});

/* LIVING_CITY_V1: one ambient actor on the map. Walkers run an errand
 * itinerary; cars shuttle the main street. All animation is native
 * driver, all positions are refs -- nothing here is saved or state.
 * Renders pointerEvents="none" so it can never intercept a tap. */
const AmbientActor = React.memo(function AmbientActor({ mapSize, walker, car, reduceMotion, children }) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (mapSize.w === 0) return undefined;
    if (walker) {
      const start = livingCityDoorPoint(walker.stops[walker.start].at);
      pos.setValue({ x: start.x * mapSize.w, y: start.y * mapSize.h });
      opacity.setValue(1);
      if (reduceMotion) return undefined;
      const anims = buildErrandSequence(walker, mapSize).map((s) => {
        if (s.kind === 'move') {
          return Animated.timing(pos, { toValue: s.to, duration: s.duration, easing: Easing.linear, useNativeDriver: true });
        }
        if (s.kind === 'fadeOut') {
          return Animated.timing(opacity, { toValue: 0, duration: s.duration, easing: Easing.linear, useNativeDriver: true });
        }
        if (s.kind === 'pause') return Animated.delay(s.duration);
        return Animated.timing(opacity, { toValue: 1, duration: s.duration, easing: Easing.linear, useNativeDriver: true });
      });
      const loop = Animated.loop(Animated.sequence(anims));
      loop.start();
      return () => loop.stop();
    }
    const y = LIVING_CITY_STREET_Y * mapSize.h;
    pos.setValue({ x: car.from * mapSize.w, y });
    if (reduceMotion) return undefined;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pos, { toValue: { x: car.to * mapSize.w, y }, duration: car.duration, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(pos, { toValue: { x: car.from * mapSize.w, y }, duration: car.duration, easing: Easing.linear, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapSize.w, reduceMotion]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.cityActor, { opacity, transform: [{ translateX: pos.x }, { translateY: pos.y }] }]}
    >
      {children}
    </Animated.View>
  );
});

function Game({ initialSave, persistSave }) {

  const [step, setStep] = useState(initialSave.step);
  const [cash, setCash] = useState(initialSave.cash);
  const [inventory, setInventory] = useState(() => normalizeInventory(initialSave.inventory));
  const [storeMessage, setStoreMessage] = useState('');
  const storePurchasePending = useRef(false);
  React.useEffect(() => { storePurchasePending.current = false; }, [cash, inventory]);

  const buyStoreItem = (itemId) => {
    // Block additional purchases until React commits the updated balance.
    if (storePurchasePending.current) return;
    const result = purchaseStoreItem(cash, inventory, itemId);
    setStoreMessage(result.message);
    if (!result.ok) return;
    storePurchasePending.current = true;
    setCash(result.cash);
    setInventory(result.inventory);
  };

  /* HARLEY_V1_STATE: dealership UI state. selectedBikeId opens the
   * detail view, confirmBikeId opens the buy confirmation. Neither is
   * saved -- reopening the app lands back on the bike list. */
  const [ownedBikes, setOwnedBikes] = useState(() => normalizeOwnedBikes(initialSave.ownedBikes));
  const [selectedBikeId, setSelectedBikeId] = useState(null);
  const [confirmBikeId, setConfirmBikeId] = useState(null);
  const [bikeMessage, setBikeMessage] = useState('');
  const bikePurchasePending = useRef(false);
  React.useEffect(() => { bikePurchasePending.current = false; }, [cash, ownedBikes]);

  /* HARLEY_V1_STATE: confirm a bike purchase. Cash only, exactly one
   * deduction. The pending ref blocks a double-tap from buying twice
   * before React commits the new balance (same guard as the store). */
  const confirmBuyBike = () => {
    if (bikePurchasePending.current) return;
    if (!confirmBikeId) return;
    const result = purchaseBike(cash, ownedBikes, confirmBikeId);
    setBikeMessage(result.message);
    setConfirmBikeId(null);
    if (!result.ok) return;
    bikePurchasePending.current = true;
    setCash(result.cash);
    setOwnedBikes(result.owned);
    setSelectedBikeId(null);
  };

  /* CASINO_V1_STATE: casino UI state. casinoGame picks the game
   * (null = menu). Slots and roulette resolve in one tap; blackjack
   * is interactive (DEAL -> HIT/STAND). The bet leaves cash the
   * moment a round starts; winnings are added once when the result
   * shows. No casino state is saved -- cash is already persisted
   * by the save effect, so closing mid-round keeps the loss and
   * never pays a win twice. */
  const [casinoGame, setCasinoGame] = useState(null);
  const casinoPending = useRef(false);
  React.useEffect(() => { casinoPending.current = false; }, [cash]);

  const [slotSymbols, setSlotSymbols] = useState(null);
  const [slotResult, setSlotResult] = useState('');

  /* CASINO_V1_STATE: spin the slots. Bet leaves cash first, then
   * the reels are drawn and any prize is added once. The pending
   * ref blocks a double-tap from betting twice before React
   * commits the new balance (same guard as the store). */
  const spinSlotsGame = (bet) => {
    if (casinoPending.current) return;
    if (!Number.isFinite(cash) || cash < bet) {
      setSlotResult('Not enough cash. You need $' + bet + ' to spin.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_SLOTS_BLOCK */
      setSlotResult(DAILY_LIMIT_MESSAGE);
      return;
    }
    casinoPending.current = true;
    setCash((c) => c - bet);
    const symbols = spinSlots();
    const returned = capCasinoReturn(slotsReturn(symbols, bet), bet, DAILY_LIMIT - earnedTodayValue); /* DAILY_LIMIT_V1_SLOTS_CAP */
    if (returned > bet) recordEarning(returned - bet); /* DAILY_LIMIT_V1_SLOTS_RECORD */
    if (returned > 0) setCash((c) => c + returned);
    const after = cash - bet + returned;
    setSlotSymbols(symbols);
    setSlotResult(
      returned > 0
        ? 'You won $' + (returned - bet) + '! Cash: $' + after + '.'
        : 'No match. You lost $' + bet + '. Cash: $' + after + '.'
    );
  };

  const [bjDeck, setBjDeck] = useState([]);
  const [bjPlayer, setBjPlayer] = useState([]);
  const [bjDealer, setBjDealer] = useState([]);
  const [bjBet, setBjBet] = useState(0);
  const [bjPhase, setBjPhase] = useState('idle');
  const [bjMessage, setBjMessage] = useState('');

  /* CASINO_V1_STATE: deal a blackjack round. The bet leaves cash
   * at DEAL; a natural on either side ends the round at once,
   * otherwise the player hits or stands. Leaving the table mid-hand
   * forfeits the bet (it is already deducted). */
  const dealBlackjack = (bet) => {
    if (casinoPending.current || bjPhase !== 'idle') return;
    if (!Number.isFinite(cash) || cash < bet) {
      setBjMessage('Not enough cash. You need $' + bet + ' to play.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_BJ_BLOCK */
      setBjMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    casinoPending.current = true;
    setCash((c) => c - bet);
    const deck = buildDeck();
    const player = [deck.pop(), deck.pop()];
    const dealer = [deck.pop(), deck.pop()];
    setBjDeck(deck);
    setBjPlayer(player);
    setBjDealer(dealer);
    setBjBet(bet);
    if (isNatural(player) || isNatural(dealer)) {
      const returned = capCasinoReturn(blackjackReturn(player, dealer, bet), bet, DAILY_LIMIT - earnedTodayValue); /* DAILY_LIMIT_V1_BJ_NATURAL_CAP */
      if (returned > bet) recordEarning(returned - bet); /* DAILY_LIMIT_V1_BJ_NATURAL_RECORD */
      if (returned > 0) setCash((c) => c + returned);
      const after = cash - bet + returned;
      setBjPhase('done');
      setBjMessage(
        returned > bet
          ? 'Blackjack! You won $' + (returned - bet) + '. Cash: $' + after + '.'
          : returned === bet
            ? 'Both have blackjack — push. Your $' + bet + ' is back. Cash: $' + after + '.'
            : 'Dealer has blackjack. You lost $' + bet + '. Cash: $' + after + '.'
      );
      return;
    }
    setBjPhase('playing');
    setBjMessage('Your hand: ' + handValue(player) + '. Hit or stand?');
  };

  const hitBlackjack = () => {
    if (bjPhase !== 'playing') return;
    const deck = [...bjDeck];
    const card = deck.pop();
    const player = [...bjPlayer, card];
    setBjDeck(deck);
    setBjPlayer(player);
    if (handValue(player) > 21) {
      setBjPhase('done');
      setBjMessage('Bust! ' + handValue(player) + ' is over 21. You lost $' + bjBet + '. Cash: $' + cash + '.');
    } else {
      setBjMessage('Your hand: ' + handValue(player) + '. Hit or stand?');
    }
  };

  const standBlackjack = () => {
    if (bjPhase !== 'playing') return;
    const deck = [...bjDeck];
    const dealer = [...bjDealer];
    while (dealerShouldHit(dealer)) {
      dealer.push(deck.pop());
    }
    setBjDeck(deck);
    setBjDealer(dealer);
    const returned = capCasinoReturn(blackjackReturn(bjPlayer, dealer, bjBet), bjBet, DAILY_LIMIT - earnedTodayValue); /* DAILY_LIMIT_V1_BJ_STAND_CAP */
    if (returned > bjBet) recordEarning(returned - bjBet); /* DAILY_LIMIT_V1_BJ_STAND_RECORD */
    if (returned > 0) setCash((c) => c + returned);
    const after = cash + returned;
    setBjPhase('done');
    setBjMessage(
      returned > bjBet
        ? 'You win! ' + handValue(bjPlayer) + ' beats ' + handValue(dealer) + '. You won $' + (returned - bjBet) + '. Cash: $' + after + '.'
        : returned === bjBet
          ? 'Push. ' + handValue(bjPlayer) + ' ties ' + handValue(dealer) + '. Your $' + bjBet + ' is back. Cash: $' + after + '.'
          : 'Dealer wins. ' + handValue(dealer) + ' beats ' + handValue(bjPlayer) + '. You lost $' + bjBet + '. Cash: $' + after + '.'
    );
  };

  const [roulettePick, setRoulettePick] = useState(null);
  const [roulettePocket, setRoulettePocket] = useState(null);
  const [rouletteResult, setRouletteResult] = useState('');

  /* CASINO_V1_STATE: spin the roulette wheel. Bet leaves cash
   * first, then the pocket is drawn and a correct color is paid
   * once. Same double-tap guard as the other games. */
  const spinRouletteGame = (bet) => {
    if (casinoPending.current) return;
    if (!roulettePick) {
      setRouletteResult('Pick RED or BLACK first.');
      return;
    }
    if (!Number.isFinite(cash) || cash < bet) {
      setRouletteResult('Not enough cash. You need $' + bet + ' to play.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_ROULETTE_BLOCK */
      setRouletteResult(DAILY_LIMIT_MESSAGE);
      return;
    }
    casinoPending.current = true;
    setCash((c) => c - bet);
    const pocket = spinRoulette();
    const returned = capCasinoReturn(rouletteReturn(roulettePick, pocket, bet), bet, DAILY_LIMIT - earnedTodayValue); /* DAILY_LIMIT_V1_ROULETTE_CAP */
    if (returned > bet) recordEarning(returned - bet); /* DAILY_LIMIT_V1_ROULETTE_RECORD */
    if (returned > 0) setCash((c) => c + returned);
    const after = cash - bet + returned;
    setRoulettePocket(pocket);
    setRouletteResult(
      returned > 0
        ? 'The ball landed on ' + pocket + ' (' + rouletteColor(pocket) + '). You won $' + (returned - bet) + '! Cash: $' + after + '.'
        : 'The ball landed on ' + pocket + ' (' + rouletteColor(pocket) + '). You lost $' + bet + '. Cash: $' + after + '.'
    );
  };
  /* CHAPTER3_BIZ_V1: buy a business with savings (agreed rules: full
   * price from BANK; each business buy-once; own more than one). */
  const buyBusiness = (businessId) => {
    const result = purchaseBusiness(savings, ownedBusinesses, businessId);
    setBizMessage(result.message);
    if (!result.ok) return;
    setSavings(result.savings);
    setOwnedBusinesses(result.owned);
  };

  /* CHAPTER3_BIZ_V1: work one business job. PROPOSED rules (flagged):
   * pay goes straight to cash (business income, not Friday wages);
   * up to 3 jobs per owned business per in-game day (Zabby revised
   * Oct 31); each job advances the clock 2 hours; no XP. */
  const workBusinessJob = (businessId) => {
    const biz = BUSINESSES.find((entry) => entry.id === businessId);
    if (!biz || !ownedBusinesses.includes(businessId) || bizJobPending.current) return;
    const doneToday = bizJobsDoneToday(bizWork, businessId, day);
    if (doneToday >= 3) {
      setBizMessage('You already worked 3 ' + biz.name + ' jobs today. Come back tomorrow.');
      return;
    }
    if (!canEarn(earnedToday, earnedTodayDay, day, biz.pay)) { /* DAILY_LIMIT_V1_BIZ_BLOCK */
      setBizMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    bizJobPending.current = true;
    setCash((c) => c + biz.pay);
    recordEarning(biz.pay); /* DAILY_LIMIT_V1_BIZ_RECORD */
    setHours((h) => h + biz.jobHours);
    setBizWork((prev) => ({ ...prev, [businessId]: { day, count: doneToday + 1 } }));
    setBizMessage('Job complete! ' + biz.name + ' paid $' + biz.pay + '.');
  };

  /* CHAPTER3_INV_V1: buy/sell investments + buy property (agreed rules,
   * Oct 31). Bond $500, pays $10 cash every Friday, sells back for the
   * full $500. Fund $1,000, value win/win/lose, sells for its current
   * value; the cycle persists across selling and rebuying. Properties
   * are buy-once from savings, credit-gated, and never sold in v1. */
  const buyBond = () => {
    if (investPending.current || bondOwned) return;
    if (savings < BOND_PRICE) {
      setInvestMessage('Not enough saved. The Savings Bond costs $500 in savings.');
      return;
    }
    investPending.current = true;
    setSavings((s) => s - BOND_PRICE);
    setBondOwned(true);
    setInvestMessage('You bought the Sky City Savings Bond for $500. It pays $10 every Friday.');
  };
  const sellBond = () => {
    if (investPending.current || !bondOwned) return;
    investPending.current = true;
    setBondOwned(false);
    setCash((c) => c + BOND_PRICE);
    setInvestMessage('You sold the Savings Bond for $500.');
  };
  const buyFund = () => {
    if (investPending.current || fundOwned) return;
    if (savings < FUND_PRICE) {
      setInvestMessage('Not enough saved. The Growth Fund costs $1,000 in savings.');
      return;
    }
    investPending.current = true;
    setSavings((s) => s - FUND_PRICE);
    setFundOwned(true);
    setFundValue(FUND_START_VALUE);
    setInvestMessage('You bought the Sky City Growth Fund for $1,000. Its value changes every Friday - sell it to take the money.');
  };
  const sellFund = () => {
    if (investPending.current || !fundOwned) return;
    investPending.current = true;
    setFundOwned(false);
    setCash((c) => c + fundValue);
    setInvestMessage('You sold the Growth Fund for $' + fundValue + '.');
  };
  const buyProperty = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || investPending.current || propertiesOwned.includes(prop.id)) return;
    if (credit < prop.credit) {
      setPropertyMessage('You need credit ' + prop.credit + ' to buy the ' + prop.name + '. Your credit is ' + credit + '.');
      return;
    }
    if (savings < prop.price) {
      setPropertyMessage('Not enough saved. The ' + prop.name + ' costs $' + prop.price + ' in savings.');
      return;
    }
    investPending.current = true;
    setSavings((s) => s - prop.price);
    setPropertiesOwned((prev) => [...prev, prop.id]);
    setPropertyMessage('You bought the ' + prop.name + ' for $' + prop.price + ' from savings. It pays $' + prop.rent + ' rent every Friday.');
  };

  const [savings, setSavings] = useState(initialSave.savings);
  const [credit, setCredit] = useState(initialSave.credit);
  const [xp, setXp] = useState(initialSave.xp);
  const [coins, setCoins] = useState(initialSave.coins);
  const [place, setPlace] = useState(initialSave.place);
  const [employment, setEmployment] = useState(initialSave.employment);
  const [employmentMessage, setEmploymentMessage] = useState("");
  const [training, setTraining] = useState(initialSave.training);
  const [pendingWages, setPendingWages] = useState(initialSave.pendingWages);
  const [trainingMessage, setTrainingMessage] = useState("");
  const trainingPaidRef = useRef(false);
  /* TRANSIT_V1_STATE: bus-driver job + City Loop shift. Separate from
   * the main employment (a player can hold both jobs); the daily work
   * allowance is shared through lastShiftDay. */
  const [transitEmployment, setTransitEmployment] = useState(initialSave.transitEmployment);
  const [transitTraining, setTransitTraining] = useState(initialSave.transitTraining);
  const [transitBus, setTransitBus] = useState(initialSave.transitBus);
  const [transitStop, setTransitStop] = useState(initialSave.transitStop);
  const [transitAboard, setTransitAboard] = useState(initialSave.transitAboard);
  const [transitBoarded, setTransitBoarded] = useState(initialSave.transitBoarded === true);
  const [transitShiftActive, setTransitShiftActive] = useState(initialSave.transitShiftActive === true);
  const [transitMessage, setTransitMessage] = useState('');
  const transitTrainingPaidRef = useRef(false);
  const transitShiftPaidRef = useRef(false);
  const transitDriveRef = useRef(-1);
  const transitBoardRef = useRef(-1);
  const [day, setDay] = useState(initialSave.day);
  /* DAILY_LIMIT_V1: today's earnings and the day they belong to.
   * Old saves default to $0 on the current day; the day stamp
   * resets the counter when Rest advances the day. */
  const [earnedToday, setEarnedToday] = useState(Number.isFinite(initialSave.earnedToday) && initialSave.earnedToday >= 0 ? initialSave.earnedToday : 0);
  const [earnedTodayDay, setEarnedTodayDay] = useState(Number.isInteger(initialSave.earnedTodayDay) && initialSave.earnedTodayDay >= 0 ? initialSave.earnedTodayDay : day);
  const earnedTodayValue = earnedTodayDay === day ? earnedToday : 0;
  /* DAILY_LIMIT_V1: record an earning for today. Hard-stop callers
   * check canEarn first; the casino caps instead (see E07-E10). */
  const recordEarning = (amount) => {
    if (!(amount > 0)) return;
    setEarnedToday(earnedTodayValue + amount);
    setEarnedTodayDay(day);
  };
  const [paycheck, setPaycheck] = useState(initialSave.paycheck);
  const [lastPayday, setLastPayday] = useState(initialSave.lastPayday);
  const [lastShiftDay, setLastShiftDay] = useState(initialSave.lastShiftDay);
  const [housing, setHousing] = useState(initialSave.housing);
  const [housingMessage, setHousingMessage] = useState("");
  const [goalsDone, setGoalsDone] = useState(initialSave.goalsDone);
  const [pendingEvent, setPendingEvent] = useState(initialSave.pendingEvent);
  const [eventMessage, setEventMessage] = useState('');
  const [housingConfirm, setHousingConfirm] = useState(false);
  const [jobId, setJobId] = useState(initialSave.jobId);
  /* CHAPTER3_BIZ_V1: owned businesses, the day clock, jobs done per
   * business today (bizWork maps business id -> { day, count }), and
   * the permanent business-menu unlock latch. */
  const [ownedBusinesses, setOwnedBusinesses] = useState(() => normalizeOwnedBusinesses(initialSave.ownedBusinesses));
  const [hours, setHours] = useState(Number.isFinite(initialSave.hours) ? initialSave.hours : 8);
  const [bizWork, setBizWork] = useState(() => normalizeBizWork(initialSave.bizWork));
  const [businessUnlocked, setBusinessUnlocked] = useState(initialSave.businessUnlocked === true);
  const [bizMessage, setBizMessage] = useState('');
  const bizJobPending = useRef(false);
  React.useEffect(() => { bizJobPending.current = false; }, [cash, bizWork]);
  /* CHAPTER3_INV_V1: investments + real estate state. The savings peak
   * only ever rises; the fund cycle persists across selling and
   * rebuying (never reset); lastInvestPayday latches each Friday. */
  const [savingsPeak, setSavingsPeak] = useState(Number.isFinite(initialSave.savingsPeak) && initialSave.savingsPeak >= 0 ? initialSave.savingsPeak : 0);
  const [bondOwned, setBondOwned] = useState(initialSave.bondOwned === true);
  const [fundOwned, setFundOwned] = useState(initialSave.fundOwned === true);
  const [fundValue, setFundValue] = useState(Number.isFinite(initialSave.fundValue) && initialSave.fundValue >= 0 ? initialSave.fundValue : FUND_START_VALUE);
  const [fundCycle, setFundCycle] = useState(Number.isInteger(initialSave.fundCycle) && initialSave.fundCycle >= 0 && initialSave.fundCycle <= 2 ? initialSave.fundCycle : 0);
  const [propertiesOwned, setPropertiesOwned] = useState(() => normalizeProperties(initialSave.propertiesOwned));
  const [lastInvestPayday, setLastInvestPayday] = useState(Number.isInteger(initialSave.lastInvestPayday) ? initialSave.lastInvestPayday : -1);
  const [investmentsUnlocked, setInvestmentsUnlocked] = useState(initialSave.investmentsUnlocked === true);
  const [investMessage, setInvestMessage] = useState('');
  const [propertyMessage, setPropertyMessage] = useState('');
  const investPending = useRef(false);
  React.useEffect(() => { investPending.current = false; }, [cash, savings, bondOwned, fundOwned, fundValue, propertiesOwned]);
  const [shiftMessage, setShiftMessage] = useState("");
  /* JOBS_V1: the player's chosen job; warehouse fallback for safety. */
  const activeJob = JOBS[jobId] || JOBS.warehouse;
  const jobTrainingPay = activeJob.trainingHours * activeJob.trainingRate;
  const jobShiftPay = activeJob.shiftHours * activeJob.shiftRate;
  const [paycheckMessage, setPaycheckMessage] = useState("");
  const collectPayRef = useRef(false);
  /* PAYROLL_FIX_V3_REFS: rapid-tap guards for the three money paths that
   * had none. eventChoiceRef blocks a second tap on the same life-event
   * choice (Overtime +$72 / Phone Bill -$45 +1 credit must apply once);
   * it re-arms when a new event waits. restPendingRef blocks a second
   * tap on REST in the same frame (a double-tap would skip a whole day
   * and with it that Friday's payday and rent); it re-arms when the day
   * advances. signLeaseRef blocks a second tap on CONFIRM — SIGN LEASE
   * in the same frame (signLease's state guard reads stale 'none' and
   * both taps would run setSavings((v) => v - 700): -$1,400 for one
   * lease); it never re-arms in play — housing stays signed — and
   * resets in restartGame. Same ref pattern as investPending /
   * collectPayRef. */
  const eventChoiceRef = useRef(false);
  const restPendingRef = useRef(false);
  const signLeaseRef = useRef(false);
  React.useEffect(() => { if (pendingEvent) eventChoiceRef.current = false; }, [pendingEvent]);
  React.useEffect(() => { restPendingRef.current = false; }, [day]);
  const [scenePhase, setScenePhase] = useState('ready');
  const [sceneHint, setSceneHint] = useState('');
  const [sceneSize, setSceneSize] = useState({ sw: 0, sh: 0 });
  const playerPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const boxPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [mapTravel, setMapTravel] = useState(null);
  const [mapSize, setMapSize] = useState({ w: 0, h: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const mapPlayerPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const walkBob = useRef(new Animated.Value(0)).current;
  const walkLoop = useRef(null);
  const stopWalkCycle = () => {
    if (walkLoop.current) { walkLoop.current.stop(); walkLoop.current = null; }
    walkBob.setValue(0);
  };
  const [benefitsFrom, setBenefitsFrom] = useState(null);

  React.useEffect(() => {
    /* CHAPTER3_BIZ_V1: persist business fields. */
    /* CHAPTER3_INV_V1: persist investment fields. */
    /* HARLEY_V1_PERSIST: persist owned bikes. */
    persistSave({ step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, hours, bizWork, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, lastInvestPayday, investmentsUnlocked, ownedBikes /* TRANSIT_V1_PERSIST_OBJ */ , earnedToday, earnedTodayDay /* DAILY_LIMIT_V1_PERSIST_OBJ */, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive });
  }, [step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, hours, bizWork, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, lastInvestPayday, investmentsUnlocked, ownedBikes, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive, earnedToday, earnedTodayDay, /* DAILY_LIMIT_V1_PERSIST_DEPS */ /* TRANSIT_V1_PERSIST_DEPS */ persistSave]);

  /* GOALS_GATE_V1_LATCH: latch newly met life goals. Counts from day
   * one; existing progress (e.g. credit) counts too. Completion
   * latches: once met, a goal stays met even if the balance drops. */
  React.useEffect(() => {
    const met = LIFE_GOALS.filter(
      (g) => !goalsDone.includes(g.id) && (g.kind === 'credit' ? credit : savings) >= g.target
    );
    if (met.length > 0) {
      setGoalsDone((prev) => [...prev, ...met.map((g) => g.id)]);
    }
  }, [savings, credit, goalsDone]);

  /* CHAPTER3_BIZ_V1: the business menu latches open permanently once
   * savings reach $1,500 (Zabby revised Oct 31: no re-lock). Same
   * latch pattern as the goal ladder. */
  React.useEffect(() => {
    if (savings >= BUSINESS_UNLOCK_SAVINGS && !businessUnlocked) {
      setBusinessUnlocked(true);
    }
  }, [savings, businessUnlocked]);

  /* CHAPTER3_INV_V1: the investments menu latches open permanently once
   * savings reach $2,000 (same latch pattern as the business menu). */
  React.useEffect(() => {
    if (savings >= INVEST_UNLOCK_SAVINGS && !investmentsUnlocked) {
      setInvestmentsUnlocked(true);
    }
  }, [savings, investmentsUnlocked]);

  /* CHAPTER3_INV_V1: the savings peak only ever rises. When savings pass
   * the old peak, credit rises +1 per full $100 of new peak:
   * floor(newPeak / 100) - floor(oldPeak / 100), capped at 850.
   * Withdrawing never lowers the peak; re-depositing the same money
   * earns $0 because savings return to at most the old peak. Each $100
   * milestone counts exactly once, whatever the deposit size. No render
   * loop: setting the peak makes savings <= peak, so the re-run returns. */
  React.useEffect(() => {
    if (savings <= savingsPeak) return;
    const gain = Math.floor(savings / 100) - Math.floor(savingsPeak / 100);
    setSavingsPeak(savings);
    if (gain > 0) setCredit((v) => Math.min(850, v + gain));
  }, [savings, savingsPeak]);

  /*
   * Friday payroll cutover: on Friday, move pending wages into the
   * available paycheck, added to any uncollected amount.
   * PAYROLL_FIX_V2_CUTOVER: the lastPayday === day guard is gone. It
   * blocked a second same-Friday batch: if Friday's payday already ran
   * that morning, a shift worked later that Friday stayed pending until
   * NEXT Friday. Each dollar still moves exactly once, because the move
   * zeroes pendingWages and the effect only re-runs when pendingWages
   * changes; the pendingWages <= 0 return stops the re-run. A Friday
   * with no pending wages latches nothing: lastPayday is only set when
   * a payment actually moves. (PAYROLL_FIX_V1 covered the
   * empty-Friday-morning case; this covers the morning-payday-then-shift
   * case.)
   */
  React.useEffect(() => {
    if (day % 7 !== FRIDAY) return;
    if (pendingWages <= 0) return;
    setPaycheck((p) => p + pendingWages);
    setPendingWages(0);
    setLastPayday(day);
    collectPayRef.current = false;
  }, [day, pendingWages, lastPayday]);

  /* CHAPTER3_INV_V1: Friday investment routine: bond $10 cash, fund
   * value change (win +$40 / loss -$20, floor $900), rent for each
   * owned property. Guarded by lastInvestPayday (the unique day
   * number), so it pays exactly once per Friday even across refreshes.
   * It latches the Friday EVEN when nothing is owned yet — that is
   * what makes a holding bought mid-Friday first pay NEXT Friday.
   * The fund cycle (win, win, lose) only advances on a Friday when the
   * fund is owned, and it persists across selling and rebuying.
   * No render loop: setting the latch makes the re-run return. */
  React.useEffect(() => {
    if (day % 7 !== FRIDAY || lastInvestPayday === day) return;
    if (bondOwned) setCash((c) => c + BOND_FRIDAY_PAY);
    if (fundOwned) {
      const win = fundCycle !== 2;
      setFundValue((v) => Math.max(FUND_FLOOR, v + (win ? FUND_WIN : -FUND_LOSS)));
      setFundCycle((c) => (c + 1) % 3);
    }
    if (propertiesOwned.length > 0) {
      const rent = PROPERTIES
        .filter((prop) => propertiesOwned.includes(prop.id))
        .reduce((sum, prop) => sum + prop.rent, 0);
      if (rent > 0) setCash((c) => c + rent);
    }
    setLastInvestPayday(day);
  }, [day, lastInvestPayday]);


  /*
   * Refs change immediately without waiting for the next render.
   * They prevent rapid button taps from paying the same shift twice.
   */
  const paidWorkShiftRef = useRef(false);
  const lastAdvancedStepRef = useRef(-1);

  const freeRoam = step >= story.length;
  const current = story[Math.min(step, story.length - 1)];

  const progress = useMemo(
    () => Math.min(100, Math.round((step / story.length) * 100)),
    [step]
  );

  /* POLISH_V1_XP: progress to the next level (Level = 1 + floor(xp/250)). */
  const level = 1 + Math.floor(xp / 250);
  const xpIntoLevel = xp % 250;
  const xpProgress = Math.round((xpIntoLevel / 250) * 100);
  const xpToNext = 250 - xpIntoLevel;

  const advance = () => {
    /*
     * Stop rapid double taps from processing the same story screen twice.
     */
    if (lastAdvancedStepRef.current === step) {
      return;
    }

    lastAdvancedStepRef.current = step;

    const key = current?.key;

    if (key === 'work') {
      setCash((value) => value + 144);
      setXp((value) => value + 40);
    }

    if (key === 'bill') {
      setCash((value) => Math.max(0, value - 120));
      setCredit((value) => value + 3);
      setXp((value) => value + 25);
    }

    if (key === 'payday') {
      setCash((value) => value + 720);
      setSavings((value) => value + 200);
      setXp((value) => value + 30);
    }

    if (key === 'temptation') {
      setSavings((value) => value + 100);
      setXp((value) => value + 20);
    }

    setStep((value) => value + 1);
  };

  const startWorkShift = () => {
    /*
     * Tapping WORK on the map begins one new unpaid shift.
     */
    paidWorkShiftRef.current = false;
    setPlace('WORK');
  };

  /*
   * The single authoritative shift reward. Guards are checked here and again
   * at completion time; awards exactly once per in-game day. Returns true when
   * the award was granted. Navigation is handled by the calling screen.
   */
  const awardShift = () => {
    if (employment !== 'hired' || training !== 'complete') return false;
    if (lastShiftDay === day || paidWorkShiftRef.current) return false;
    if (!canEarn(earnedToday, earnedTodayDay, day, jobShiftPay)) { /* DAILY_LIMIT_V1_SHIFT_BLOCK */
      setShiftMessage(DAILY_LIMIT_MESSAGE);
      return false;
    }

    paidWorkShiftRef.current = true;

    setPendingWages((v) => v + jobShiftPay);
    recordEarning(jobShiftPay); /* DAILY_LIMIT_V1_SHIFT_RECORD */
    setXp((v) => v + activeJob.shiftXp);
    setLastShiftDay(day);
    return true;
  };

  /*
   * Interactive warehouse task. Opening, beginning, picking up, moving, and
   * delivering award nothing; only completeVisualShift() calls awardShift().
   */
  const sceneBoxAt = () => ({ x: 0.2 * sceneSize.sw, y: 0.42 * sceneSize.sh });
  const sceneDropAt = () => ({ x: 0.74 * sceneSize.sw, y: 0.42 * sceneSize.sh });

  /* BEGIN SHIFT: places everyone and waits for the player's first choice. */
  const beginVisualTask = () => {
    if (scenePhase !== 'ready') return;
    const { sw, sh } = sceneSize;
    if (sw === 0) return;
    playerPos.setValue({ x: 0.5 * sw, y: 0.86 * sh });
    boxPos.setValue(sceneBoxAt());
    setSceneHint('');
    setScenePhase('awaitPickup');
  };

  /* Player chose the package: walk to it, then pick it up. */
  const pickupPackage = () => {
    if (scenePhase !== 'awaitPickup') return;
    const boxAt = sceneBoxAt();
    setSceneHint('');
    if (reduceMotion) {
      playerPos.setValue(boxAt);
      boxPos.setValue({ x: boxAt.x, y: boxAt.y - 40 });
      setScenePhase('awaitDrop');
      return;
    }
    setScenePhase('toPackage');
    Animated.timing(playerPos, {
      toValue: boxAt, duration: 900, useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        boxPos.setValue({ x: boxAt.x, y: boxAt.y - 40 });
        setScenePhase('awaitDrop');
      }
    });
  };

  /* Player chose the drop zone: carry the package over and set it down. */
  const deliverPackage = () => {
    if (scenePhase !== 'awaitDrop') return;
    const dropAt = sceneDropAt();
    setSceneHint('');
    if (reduceMotion) {
      playerPos.setValue({ x: dropAt.x, y: dropAt.y });
      boxPos.setValue(dropAt);
      setScenePhase('delivered');
      return;
    }
    setScenePhase('toDrop');
    Animated.parallel([
      Animated.timing(playerPos, {
        toValue: { x: dropAt.x, y: dropAt.y },
        duration: 1100, useNativeDriver: false,
      }),
      Animated.timing(boxPos, {
        toValue: dropAt, duration: 1100, useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished) setScenePhase('delivered');
    });
  };

  /* Tapping the drop zone before pickup shows a hint; nothing else changes. */
  const tapDropZone = () => {
    if (scenePhase === 'awaitDrop') deliverPackage();
    else if (scenePhase === 'awaitPickup') setSceneHint('Pick up the package first.');
  };

  /* Completion re-checks eligibility and awards exactly once via awardShift().
   * WAREHOUSE_CLOCK_V1: a completed 8-hour warehouse shift also advances
   * the business clock by the shift's hours (JOBS.warehouse.shiftHours).
   * The clock is display-only (formatClock wraps mod 24) and the in-game
   * day advances only on Rest, so a shift ending past midnight leaves the
   * day, the daily shift limit, Friday payday and the investment latch
   * untouched. Warehouse-only: the clerk shift calls awardShift() directly
   * and the transit route has its own award path, so neither moves the
   * clock. */
  const completeVisualShift = () => {
    if (scenePhase !== 'delivered') return;
    if (!canEarn(earnedToday, earnedTodayDay, day, jobShiftPay)) { setSceneHint(DAILY_LIMIT_MESSAGE); return; } /* DAILY_LIMIT_V1_SCENE_BLOCK */
    if (awardShift()) { setHours((h) => h + JOBS.warehouse.shiftHours); setScenePhase('complete'); } /* WAREHOUSE_CLOCK_V1 */
  };

  /* Respect the OS reduced-motion setting for map travel, where supported. */
  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setReduceMotion)
      .catch(() => {});
  }, []);

  /* Resolve a destination tap to its existing screen (WORK keeps its gates). */
  const resolveDest = (dest) => (
    dest === 'WORK'
      ? (employment === 'hired' && training === 'complete' ? 'WORK' : 'EMPLOYMENT')
      : dest
  );

  /*
   * Visual map travel along the sidewalks: plaza -> main street -> side
   * street -> building door. Never cuts through buildings. Presentation
   * only: no cash, savings, credit, XP, wages, or calendar changes.
   * Ignores taps while walking; SKIP jumps straight to arrival.
   */
  const travelTo = (dest) => {
    if (mapTravel) return;
    mapPlayerPos.stopAnimation();
    stopWalkCycle();
    freeWalkRef.current = false;
    const place = resolveDest(dest);
    const { w, h } = mapSize;
    if (reduceMotion || w === 0) {
      setPlace(place);
      return;
    }
    /* HARLEY_V1_DOOR: the dealership tile sits mid-map, so its door is center. */
    /* CASINO_V1_DOOR: the casino tile sits top-middle, so its door is center-top. */
    /* TRANSIT_V1_DOOR: three rows now. Doors sit just below each row's
     * tiles; the street runs between the middle and bottom rows. */
    const doorX = (dest === 'HOME' || dest === 'BANK' ? 0.19 : dest === 'DEALERSHIP' || dest === 'CASINO' || dest === 'TRANSIT' ? 0.5 : 0.81) * w;
    const doorY = (dest === 'HOME' || dest === 'WORK' || dest === 'CASINO' ? 0.33 : dest === 'TRANSIT' || dest === 'BANK' || dest === 'STORE' ? 0.63 : 0.70) * h;
    const start = { x: 0.5 * w, y: 0.93 * h };
    const waypoints = [
      { x: 0.5 * w, y: 0.6425 * h },
      { x: doorX, y: 0.6425 * h },
      { x: doorX, y: doorY },
    ];
    mapPlayerPos.setValue(start);
    setMapTravel(dest);
    walkBob.setValue(0);
    walkLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(walkBob, { toValue: -4, duration: 160, useNativeDriver: false }),
        Animated.timing(walkBob, { toValue: 0, duration: 160, useNativeDriver: false }),
      ])
    );
    walkLoop.current.start();
    Animated.sequence(
      waypoints.map((wp) =>
        Animated.timing(mapPlayerPos, { toValue: wp, duration: 350, useNativeDriver: false })
      )
    ).start(({ finished }) => {
      stopWalkCycle();
      setMapTravel(null);
      if (finished) setPlace(place);
    });
  };

  const skipTravel = () => {
    if (!mapTravel) return;
    const dest = mapTravel;
    mapPlayerPos.stopAnimation();
    stopWalkCycle();
    setMapTravel(null);
    setPlace(resolveDest(dest));
  };

  /*
   * Tap-anywhere movement: tap a spot on the map and the character walks
   * there. Building taps keep travelTo and interrupt a free walk.
   * Presentation only: no cash, savings, credit, XP, wages, or calendar changes.
   */
  const freeWalkRef = useRef(false);
  const mapViewRef = useRef(null);
  const freeMoveTo = (x, y) => {
    if (mapTravel) return;
    const { w, h } = mapSize;
    if (w === 0 || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const tx = Math.min(Math.max(x, 10), w - 10);
    const ty = Math.min(Math.max(y, 10), h - 10);
    mapPlayerPos.stopAnimation();
    stopWalkCycle();
    if (reduceMotion) {
      /* Reduced motion: move instantly, never silently ignore the tap. */
      freeWalkRef.current = false;
      mapPlayerPos.setValue({ x: tx, y: ty });
      return;
    }
    freeWalkRef.current = true;
    walkBob.setValue(0);
    walkLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(walkBob, { toValue: -4, duration: 160, useNativeDriver: false }),
        Animated.timing(walkBob, { toValue: 0, duration: 160, useNativeDriver: false }),
      ])
    );
    walkLoop.current.start();
    Animated.timing(mapPlayerPos, {
      toValue: { x: tx, y: ty },
      duration: 450,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        stopWalkCycle();
        freeWalkRef.current = false;
      }
    });
  };

  /* Application + hiring (prototype: guaranteed hire). No stat changes. */
  const applyForJob = (id) => {
    if (employment !== 'none') return;
    if (!JOBS[id]) return;
    setJobId(id);
    setEmployment('applied');
    setEmploymentMessage('Application submitted for ' + JOBS[id].title + '. Check your hiring result.');
  };
  const checkHiringResult = () => {
    if (employment !== 'applied') return;
    setEmployment('hired');
    setEmploymentMessage("You're hired! Paid training is required before your first shift.");
  };
/* Paid training: one full training day, no real-world wait. Pays exactly once into pending wages. */
  const completeTraining = () => {
    if (employment !== 'hired' || training !== 'incomplete') return;
    if (trainingPaidRef.current) return;
    if (!canEarn(earnedToday, earnedTodayDay, day, jobTrainingPay)) { /* DAILY_LIMIT_V1_TRAINING_BLOCK */
      setTrainingMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    trainingPaidRef.current = true;
    setTraining('complete');
    setEmploymentMessage('');
    setPendingWages((v) => v + jobTrainingPay);
    recordEarning(jobTrainingPay); /* DAILY_LIMIT_V1_TRAINING_RECORD */
    setTrainingMessage('Training complete. You earned $' + jobTrainingPay + ', payable Friday.');
  };
  /* TRANSIT_V1_FUNCS: transit actions. */
  /* TRANSIT_V1: apply for the bus-driver job. Accepted immediately;
   * no money, no XP. Status becomes Hired -- Training Required. */
  const applyForTransit = () => {
    if (transitEmployment !== 'none') return;
    setTransitEmployment('hired');
    setTransitMessage('You are hired as a City Bus Driver! Complete paid training to start driving.');
  };
  /* TRANSIT_V1: paid training, once. Pays $144 into pending wages
   * (Friday payroll) and uses the day's work allowance: it shares
   * lastShiftDay with the warehouse/clerk shift, so training blocks
   * a shift the same day and a shift blocks training. */
  const completeTransitTraining = () => {
    if (transitEmployment !== 'hired' || transitTraining !== 'incomplete') return;
    if (transitTrainingPaidRef.current) return;
    if (lastShiftDay === day) {
      setTransitMessage("You already used today's work allowance. Come back tomorrow to train.");
      return;
    }
    if (!canEarn(earnedToday, earnedTodayDay, day, TRANSIT_TRAINING_PAY)) { /* DAILY_LIMIT_V1_TRANSIT_TRAINING_BLOCK */
      setTransitMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    transitTrainingPaidRef.current = true;
    setTransitTraining('complete');
    setPendingWages((v) => v + TRANSIT_TRAINING_PAY);
    setLastShiftDay(day);
    recordEarning(TRANSIT_TRAINING_PAY); /* DAILY_LIMIT_V1_TRANSIT_TRAINING_RECORD */
    setTransitMessage('Training complete. You earned $' + TRANSIT_TRAINING_PAY + ', payable Friday.');
  };
  /* TRANSIT_V1: start the City Loop shift. Assigns City Bus #1 and
   * consumes the day's work allowance at the START, so a warehouse
   * or clerk shift cannot be worked mid-route the same day. */
  const startTransitShift = () => {
    if (transitEmployment !== 'hired' || transitTraining !== 'complete') return;
    if (transitShiftActive) return;
    if (lastShiftDay === day) {
      setTransitMessage("You already used today's work allowance. Come back tomorrow to drive.");
      return;
    }
    if (!canEarn(earnedToday, earnedTodayDay, day, TRANSIT_SHIFT_PAY)) { /* DAILY_LIMIT_V1_TRANSIT_START_BLOCK */
      setTransitMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    transitShiftPaidRef.current = false;
    transitDriveRef.current = -1;
    transitBoardRef.current = -1;
    setTransitBus(TRANSIT_BUS);
    setTransitStop(0);
    setTransitAboard(0);
    setTransitBoarded(false);
    setTransitShiftActive(true);
    setLastShiftDay(day);
    setTransitMessage('You are driving ' + TRANSIT_BUS + '. Board passengers, then drive to the next stop.');
  };
  /* TRANSIT_V1: board everyone waiting at the current stop. */
  const boardTransitPassengers = () => {
    if (!transitShiftActive || transitBoarded) return;
    if (transitBoardRef.current === transitStop) return;
    transitBoardRef.current = transitStop;
    const result = transitBoardStep({ stop: transitStop, aboard: transitAboard });
    setTransitAboard(result.aboard);
    setTransitBoarded(true);
    if (result.boardedCount > 0) {
      setTransitMessage(result.boardedCount + ' passenger' + (result.boardedCount === 1 ? '' : 's') + ' boarded at ' + TRANSIT_STOPS[transitStop].name + '.');
    } else {
      setTransitMessage('No passengers waiting at ' + TRANSIT_STOPS[transitStop].name + '.');
    }
  };
  /* TRANSIT_V1: drive to the next stop. Passengers get off BEFORE new
   * passengers board (see transitDriveStep). At the final depot
   * everyone exits and the shift completes with $144 to pending
   * wages and 40 XP, each exactly once. */
  const driveTransitToNextStop = () => {
    if (!transitShiftActive || !transitBoarded) return;
    if (transitDriveRef.current === transitStop) return;
    transitDriveRef.current = transitStop;
    const result = transitDriveStep({ stop: transitStop, aboard: transitAboard });
    if (result.completed) {
      if (transitShiftPaidRef.current) return;
      if (!canEarn(earnedToday, earnedTodayDay, day, result.pay)) { /* DAILY_LIMIT_V1_TRANSIT_ROUTE_BLOCK */
        setTransitMessage(DAILY_LIMIT_MESSAGE);
      } else {
        transitShiftPaidRef.current = true;
        setPendingWages((v) => v + result.pay);
        recordEarning(result.pay); /* DAILY_LIMIT_V1_TRANSIT_ROUTE_RECORD */
        /* TRANSIT_V1_XP: +40 XP per completed route, matching warehouse
         * work. Inside the same once-only guard as the $144, so
         * reopening or re-tapping can never award it twice. Training
         * gives pay only; an unfinished shift gives nothing. */
        setXp((v) => v + TRANSIT_SHIFT_XP);
        setTransitMessage('Shift complete! You earned $' + result.pay + '. Your wages will be paid Friday.');
      }
    } else if (result.gotOff > 0) {
      setTransitMessage(result.gotOff + ' passenger' + (result.gotOff === 1 ? '' : 's') + ' got off at ' + TRANSIT_STOPS[result.stop].name + '.');
    } else {
      setTransitMessage('Arrived at ' + TRANSIT_STOPS[result.stop].name + '.');
    }
    setTransitAboard(result.aboard);
    setTransitStop(result.stop);
    setTransitBoarded(result.boarded);
    setTransitShiftActive(result.active);
  };
  /* Rest at HOME advances the in-game calendar by one day and re-arms the daily shift. */
  const restDay = () => {
    if (restPendingRef.current) return; /* PAYROLL_FIX_V3_REST */
    restPendingRef.current = true;
    paidWorkShiftRef.current = false;
    /* TRANSIT_V1_REST: a new day re-arms transit the same way. The
     * saved shift itself is untouched, so a mid-route shift resumes. */
    transitShiftPaidRef.current = false;
    transitDriveRef.current = -1;
    transitBoardRef.current = -1;
    setTransitMessage('');
    setShiftMessage('');
    /* CHAPTER3_BIZ_V1: the clock resets to 8 AM on Rest (PROPOSED). */
    setHours(8);
    setEventMessage('');
    setDay((d) => d + 1);
    /* LIFE_EVENTS_V1: some mornings bring a surprise. No new roll while
     * an event is still waiting for an answer. */
    if (!pendingEvent && Math.random() < EVENT_CHANCE) {
      const pool = LIFE_EVENTS.filter(
        (e) => !e.needsJob || (employment === 'hired' && training === 'complete')
      );
      if (pool.length > 0) {
        setPendingEvent(pool[Math.floor(Math.random() * pool.length)].id);
      }
    }
  };

  /* LIFE_EVENTS_V1: apply the player's choice, then clear the event. */
  const applyEventChoice = (choice) => {
    if (eventChoiceRef.current) return; /* PAYROLL_FIX_V3_EVENT */
    const eventGain = Math.max(0, choice.cash || 0) + Math.max(0, choice.pending || 0); /* DAILY_LIMIT_V1_EVENT_GAIN */
    if (eventGain > 0 && !canEarn(earnedToday, earnedTodayDay, day, eventGain)) { /* DAILY_LIMIT_V1_EVENT_BLOCK */
      setEventMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    eventChoiceRef.current = true;
    if (eventGain > 0) recordEarning(eventGain); /* DAILY_LIMIT_V1_EVENT_RECORD */
    if (choice.cash) setCash((c) => Math.max(0, c + choice.cash));
    if (choice.pending) setPendingWages((w) => w + choice.pending);
    if (choice.xp) setXp((x) => x + choice.xp);
    if (choice.credit) setCredit((s) => Math.min(850, s + choice.credit));
    setEventMessage(choice.result);
    setPendingEvent(null);
  };

  /*
   * COLLECT PAYCHECK moves the available paycheck into cash exactly once.
   * Pending wages are never touched: they belong to the following Friday.
   */
  const collectPaycheck = () => {
    if (paycheck <= 0 || collectPayRef.current) return;
    collectPayRef.current = true;
    setCash((c) => c + paycheck);
    setPaycheck(0);
    setPaycheckMessage('Paycheck collected: $' + paycheck + ' added to cash.');
  };

  /*
   * HOUSING_SLICE_V1: sign the lease. Pays the $700 first month's rent
   * from savings exactly once. Insufficient savings changes nothing.
   */
  const signLease = () => {
    if (housing !== 'none') return;
    if (savings < HOUSING_GOAL.firstMonthRent) {
      setHousingMessage('Not enough saved yet. You need $' + (HOUSING_GOAL.firstMonthRent - savings) + ' more in savings.');
      return;
    }
    /* PAYROLL_FIX_V3_LEASE: the housing check above reads stale state
     * across same-frame taps, so guard with the ref instead. Placed
     * AFTER the checks so a failed attempt never arms it. */
    if (signLeaseRef.current) return; /* PAYROLL_FIX_V3_LEASE */
    signLeaseRef.current = true;
    setSavings((v) => v - HOUSING_GOAL.firstMonthRent);
    setHousing(HOUSING_GOAL.key);
    setHousingConfirm(false);
    setHousingMessage('Lease signed! ' + HOUSING_GOAL.name + ' is yours \u2014 first month paid from savings.');
  };

  const restartGame = () => {
    paidWorkShiftRef.current = false;
    lastAdvancedStepRef.current = -1;

    setPlace(null);
    setStep(0);
    setCash(2500);
    setSavings(0);
    setCredit(575);
    setXp(0);
    setCoins(0);
    setEmployment('none');
    setJobId('none');
    setEmploymentMessage('');
    setTraining('incomplete');
    setPendingWages(0);
    setTrainingMessage('');
    trainingPaidRef.current = false;
    /* TRANSIT_V1_RESET: a fresh game starts with no transit job. */
    setTransitEmployment('none');
    setTransitTraining('incomplete');
    setTransitBus(null);
    setTransitStop(0);
    setTransitAboard(0);
    setTransitBoarded(false);
    setTransitShiftActive(false);
    setTransitMessage('');
    transitTrainingPaidRef.current = false;
    transitShiftPaidRef.current = false;
    transitDriveRef.current = -1;
    transitBoardRef.current = -1;
    setDay(0);
    setEarnedToday(0); /* DAILY_LIMIT_V1_RESTART */
    setEarnedTodayDay(0);
    setPaycheck(0);
    setLastPayday(-1);
    setLastShiftDay(-1);
    setPaycheckMessage('');
    collectPayRef.current = false;
    eventChoiceRef.current = false; /* PAYROLL_FIX_V3_RESTART */
    restPendingRef.current = false;
    signLeaseRef.current = false;
    /* CHAPTER3_BIZ_V1: a fresh game starts with no business. */
    setOwnedBusinesses([]);
    setHours(8);
    setBizWork({});
    setBusinessUnlocked(false);
    setBizMessage('');
    bizJobPending.current = false;
    setHousing('none');
    setGoalsDone([]);
    setPendingEvent(null);
    setHousingMessage('');
    setHousingConfirm(false);
  };
 
  /*
   * EMPLOYMENT APPLICATION SCREEN - entry: the Work button on the city map.
   * Warehouse Associate is the first job. Shifts stay locked until paid training ships.
   */
  if (place === 'EMPLOYMENT') {
    return (
      <ImageBackground source={ART.bgEmployment} style={styles.bgFill} resizeMode="cover">
        {/* LOOKPASS_V1: employment background. */}
        <SafeAreaView style={[styles.safe, styles.safeArt]}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>{employment === 'none' ? 'Choose Your Job' : activeJob.title}</Text>
          {/* LOOKPASS_V1: employment icons. */}
          <View style={styles.iconRow}>
            <Image source={ART.empBriefcase} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.empClipboard} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.empBadge} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.empBook} style={styles.iconImg} resizeMode="contain" />
          </View>
          {employment === 'none' && (<>
            <Text style={styles.body}>Apply to begin your career. Once hired, you must complete paid training before working.</Text>
            <Text style={styles.eyebrow}>PRIVATE BUSINESS</Text>
            <Text style={styles.body}>Warehouse Associate</Text>
            <Text style={styles.body}>{'$' + JOBS.warehouse.shiftRate + '/hour \u2022 ' + JOBS.warehouse.shiftHours + '-hour shift. Each completed shift earns $' + (JOBS.warehouse.shiftHours * JOBS.warehouse.shiftRate) + ' and ' + JOBS.warehouse.shiftXp + ' XP.'}</Text>
            <TouchableOpacity style={styles.primary} onPress={() => applyForJob('warehouse')}><Text style={styles.primaryText}>APPLY — WAREHOUSE ASSOCIATE</Text></TouchableOpacity>
            <Text style={styles.eyebrow}>CITY GOVERNMENT</Text>
            <Text style={styles.body}>City Hall Clerk</Text>
            <Text style={styles.body}>{'$' + JOBS.cityhall.shiftRate + '/hour \u2022 ' + JOBS.cityhall.shiftHours + '-hour shift. Each completed shift earns $' + (JOBS.cityhall.shiftHours * JOBS.cityhall.shiftRate) + ' and ' + JOBS.cityhall.shiftXp + ' XP.'}</Text>
            <TouchableOpacity style={styles.primary} onPress={() => applyForJob('cityhall')}><Text style={styles.primaryText}>APPLY — CITY HALL CLERK</Text></TouchableOpacity>
          </>)}
          {employment === 'applied' && (<>
            <Text style={styles.body}>{'Your application for ' + activeJob.title + ' is in. Check your hiring result below.'}</Text>
            <TouchableOpacity style={styles.primary} onPress={checkHiringResult}><Text style={styles.primaryText}>CHECK HIRING RESULT</Text></TouchableOpacity>
          </>)}
          {employment === 'hired' && (<>
            {training === 'incomplete' ? (
              <Text style={styles.body}>Hired - Training Required.</Text>
            ) : (
              <Text style={styles.body}>Hired - Training Complete.</Text>
            )}
            {training === 'incomplete' ? (<>
              <Text style={styles.body}>Paid training must be completed before you can work.</Text>
              <TouchableOpacity style={styles.primary} onPress={() => setPlace('EMPLOYMENT_TRAINING')}><Text style={styles.primaryText}>START PAID TRAINING</Text></TouchableOpacity>
            </>) : (<>
              <Text style={styles.body}>{'Training complete. Pending wages: $' + pendingWages + ', payable Friday.'}</Text>
            </>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('EMPLOYMENT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>)}
          {employmentMessage !== '' && (<Text style={styles.body}>{employmentMessage}</Text>)}
          {businessUnlocked && (
            <TouchableOpacity style={styles.primary} onPress={() => setPlace('WORK')}><Text style={styles.primaryText}>OWN A BUSINESS</Text></TouchableOpacity>
          )}{/* BIZ_ROUTING_V1_BUTTON */}
          <TouchableOpacity style={styles.secondary} onPress={() => { setEmploymentMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO MAP</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {/* LOOKPASS_V1: employment background end. */}
    </ImageBackground>
    );
  }

  /*
   * BENEFITS SCREEN - display only. Entry: VIEW BENEFITS on the Employment Center (hired).
   * Viewing changes nothing: no enrollment, no contributions, no money moves.
   */
  if (place === 'EMPLOYMENT_BENEFITS') {
    return (
      <SafeAreaView style={styles.safe}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Your Benefits</Text>
          <Text style={styles.body}>Medical</Text>
          <Text style={styles.body}>Your employer pays 100% of your own medical insurance premium. Coverage options are available for your spouse and children; their premium costs are not yet specified.</Text>
          <Text style={styles.body}>Dental</Text>
          <Text style={styles.body}>Your employer pays 100% of your own dental insurance premium.</Text>
          <Text style={styles.body}>Vision</Text>
          <Text style={styles.body}>Your employer pays 100% of your own vision insurance premium.</Text>
          {/* BENEFITS_LEAVE_V1: vacation + sick leave, display only */}
          <Text style={styles.body}>Vacation</Text>
          <Text style={styles.body}>Paid vacation starts with your employment. Accrual amounts are not yet specified.</Text>
          <Text style={styles.body}>Sick Leave</Text>
          <Text style={styles.body}>Paid sick leave is available starting at employment. Details are not yet specified.</Text>
          <Text style={styles.body}>401(k)</Text>
          <Text style={styles.body}>Your employer matches your contributions dollar for dollar, up to 5% of eligible pay. Example: on $1,000 of eligible pay, contribute $50 and your employer adds $50.</Text>
          <Text style={styles.body}>Benefits information only. Viewing this screen does not enroll you, set contributions, or deduct money.</Text>
          {/* TRANSIT_V1_BENEFITS: BACK also returns to TRANSIT. */}
          <TouchableOpacity style={styles.secondary} onPress={() => setPlace(benefitsFrom === 'WORK' ? 'WORK' : benefitsFrom === 'TRANSIT' ? 'TRANSIT' : 'EMPLOYMENT')}><Text style={styles.secondaryText}>BACK</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
   * VISUAL WAREHOUSE SHIFT (place key: 'WORK_VISUAL')
   *
   * A small playable slice of the existing warehouse shift. Opening the scene
   * awards nothing; BEGIN SHIFT plays the box-moving animation; COMPLETE SHIFT
   * routes through awardShift() exactly once. Leaving or refreshing mid-scene
   * is a safe retry: scenePhase is transient and resets to 'ready'.
   */
  if (place === 'WORK_VISUAL') {
    const canWork = employment === 'hired' && training === 'complete';
    const shiftDoneToday = lastShiftDay === day;
    const measured = sceneSize.sw > 0 && sceneSize.sh > 0;
    return (
      <SafeAreaView style={styles.safe}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Warehouse Shift</Text>

          {/* LOOKPASS_V1: warehouse icons. */}
          <View style={styles.iconRow}>
            <Image source={ART.workCarton} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.workHandtruck} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.workClock} style={styles.iconImg} resizeMode="contain" />
            <Image source={ART.workPaycheck} style={styles.iconImg} resizeMode="contain" />
          </View>

          {!canWork && (
            <Text style={styles.body}>Paid training must be completed before you can work.</Text>
          )}

          {canWork && (!shiftDoneToday || scenePhase === 'complete') && (<>
            <Text style={styles.body}>
              Move the box to the marked drop zone, then complete your shift.
            </Text>

            <ImageBackground
              source={ART.bgWork}
              resizeMode="cover"
              style={styles.scene}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setSceneSize((prev) => (
                  prev.sw === width && prev.sh === height
                    ? prev
                    : { sw: width, sh: height }
                ));
                playerPos.setValue({ x: 0.5 * width, y: 0.86 * height });
                boxPos.setValue({ x: 0.2 * width, y: 0.42 * height });
              }}
            >
              {/* LOOKPASS_V1: warehouse scene background. */}
              <View style={[styles.sceneShelf, { left: '4%', top: '18%' }]} />
              <View style={[styles.sceneShelf, { left: '4%', top: '52%' }]} />
              <TouchableOpacity
                style={[styles.sceneDrop, { right: '6%', top: '30%' }, scenePhase === 'awaitDrop' && styles.dropActive]}
                onPress={tapDropZone}
                disabled={scenePhase !== 'awaitDrop' && scenePhase !== 'awaitPickup'}
              >
                <Text style={styles.sceneTag}>DROP ZONE</Text>
              </TouchableOpacity>
              <View style={[styles.scenePerson, { left: '30%', top: '30%' }]}>
                <Text style={styles.sceneEmoji}>👷</Text>
                <Text style={styles.sceneTag}>SAM</Text>
              </View>
              <View style={[styles.scenePerson, { left: '52%', top: '62%' }]}>
                <Text style={styles.sceneEmoji}>👷‍♀️</Text>
                <Text style={styles.sceneTag}>JO</Text>
              </View>
              {measured && (
                <Animated.View style={[styles.sceneActor, {
                  transform: [{ translateX: boxPos.x }, { translateY: boxPos.y }],
                }]}>
                  <TouchableOpacity
                    onPress={pickupPackage}
                    disabled={scenePhase !== 'awaitPickup'}
                    hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
                  >
                    <View style={[styles.packageWrap, scenePhase === 'awaitPickup' && styles.targetOn]}>
                      <Text style={styles.sceneEmoji}>📦</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              )}
              {measured && (
                <Animated.View style={[styles.sceneActor, {
                  transform: [{ translateX: playerPos.x }, { translateY: playerPos.y }],
                }]}>
                  <PlayerFigure />
                  <Text style={styles.sceneTag}>YOU</Text>
                </Animated.View>
              )}
              {/* LOOKPASS_V1: warehouse scene background end. */}
            </ImageBackground>

            {scenePhase === 'ready' && (
              <TouchableOpacity style={styles.primary} onPress={beginVisualTask}>
                <Text style={styles.primaryText}>BEGIN SHIFT</Text>
              </TouchableOpacity>
            )}
            {scenePhase === 'awaitPickup' && (<>
              <Text style={styles.body}>Tap the package to pick it up.</Text>
              <TouchableOpacity style={styles.primary} onPress={pickupPackage}>
                <Text style={styles.primaryText}>PICK UP PACKAGE</Text>
              </TouchableOpacity>
            </>)}
            {scenePhase === 'toPackage' && (
              <Text style={styles.body}>Heading to the package…</Text>
            )}
            {scenePhase === 'awaitDrop' && (<>
              <Text style={styles.body}>Tap the DROP ZONE to deliver the package.</Text>
              <TouchableOpacity style={styles.primary} onPress={deliverPackage}>
                <Text style={styles.primaryText}>DELIVER PACKAGE</Text>
              </TouchableOpacity>
            </>)}
            {scenePhase === 'toDrop' && (
              <Text style={styles.body}>Delivering the package…</Text>
            )}
            {scenePhase === 'delivered' && (<>
              <Text style={styles.body}>Package delivered. Complete your shift to record your earnings.</Text>
              <TouchableOpacity style={styles.primary} onPress={completeVisualShift}>
                <Text style={styles.primaryText}>COMPLETE SHIFT</Text>
              </TouchableOpacity>
            </>)}
            {sceneHint !== '' && (
              <Text style={styles.body}>{sceneHint}</Text>
            )}
            {scenePhase === 'complete' && (<>
              <Text style={styles.body}>Shift complete!</Text>
              <Text style={styles.body}>
                {'You earned $' + jobShiftPay + ' in pending wages and ' + activeJob.shiftXp + ' XP.'}
              </Text>
              <Text style={styles.body}>{'Pending wages: $' + pendingWages + '.'}</Text>
              {/* PAYROLL_FIX_V2_SHIFT_TEXT: a Friday shift now ALWAYS pays
               * the same Friday -- the cutover no longer stops after the
               * first batch of the day, so no Friday wages ever wait for
               * next Friday. The 'Paid next Friday.' branch is dead and
               * removed. */}
              <Text style={styles.body}>
                {day % 7 === FRIDAY
                  ? "It's Friday — your wages are in your available paycheck. Collect it on the WORK screen."
                  : 'Payable Friday.'}
              </Text>
            </>)}

            {scenePhase !== 'complete' ? (
              <TouchableOpacity
                style={styles.secondary}
                onPress={() => setPlace('WORK')}
              >
                <Text style={styles.secondaryText}>
                  {scenePhase === 'ready' ? 'BACK' : 'LEAVE SCENE'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.secondary}
                onPress={() => setPlace(null)}
              >
                <Text style={styles.secondaryText}>BACK TO MAP</Text>
              </TouchableOpacity>
            )}
          </>)}
          {canWork && shiftDoneToday && (<>
            <Text style={styles.body}>Shift completed for today. Next shift available tomorrow.</Text>
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('WORK')}
            >
              <Text style={styles.secondaryText}>BACK TO SHIFT</Text>
            </TouchableOpacity>
          </>)}
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
   * WORK SHIFT SCREEN
   * (Locked until paid training ships; the map now routes through the Employment Center.)
   */
  /*
   * PAID TRAINING SCREEN - entry: Start Paid Training in the Employment Center.
   * Completion pays into pending wages. Friday payroll is not implemented yet.
   */
  if (place === 'EMPLOYMENT_TRAINING') {
    return (
      <SafeAreaView style={styles.safe}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>{activeJob.title} - Paid Training</Text>
          <Text style={styles.body}>Duration: {activeJob.trainingHours} in-game hours</Text>
          <Text style={styles.body}>{'Rate: $' + activeJob.trainingRate + '/hour'}</Text>
          <Text style={styles.body}>{'Training earnings: $' + jobTrainingPay + ', payable Friday'}</Text>
          <Text style={styles.body}>No fee</Text>
          {training === 'incomplete' && employment === 'hired' && (<>
            <TouchableOpacity style={styles.primary} onPress={completeTraining}><Text style={styles.primaryText}>COMPLETE TRAINING</Text></TouchableOpacity>
          </>)}
          {training === 'complete' && (<>
            <Text style={styles.body}>{'Training complete. Pending wages: $' + pendingWages + ', payable Friday.'}</Text>
          </>)}
          {trainingMessage !== '' && (<Text style={styles.body}>{trainingMessage}</Text>)}
          <Text style={styles.body}>{'$' + jobTrainingPay + ' training pay added to pending wages. Paid out with Friday payroll.'}</Text>
          <TouchableOpacity style={styles.secondary} onPress={() => { setTrainingMessage(''); setPlace('EMPLOYMENT'); }}><Text style={styles.secondaryText}>BACK TO EMPLOYMENT CENTER</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (place === 'WORK') {
    /* Shifts unlock after hiring + training. The map routes here only then;
       this gate covers stale saves that still have the shift screen open. */
    const canWork = employment === 'hired' && training === 'complete';
    const shiftDoneToday = lastShiftDay === day;
    return (
      <ImageBackground source={activeJob.visualShift ? ART.bgWork : ART.bgWorkClerk} style={styles.bgFill} resizeMode="cover">
        {/* LOOKPASS_V1: work background. */}
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>{activeJob.title + ' Shift'}</Text>

          {/* LOOKPASS_V1: work icons. */}
          <View style={styles.iconRow}>
            {activeJob.visualShift ? (<>
              <Image source={ART.workCarton} style={styles.iconImg} resizeMode="contain" />
              <Image source={ART.workHandtruck} style={styles.iconImg} resizeMode="contain" />
              <Image source={ART.workClock} style={styles.iconImg} resizeMode="contain" />
              <Image source={ART.workPaycheck} style={styles.iconImg} resizeMode="contain" />
            </>) : (<>
              <Image source={ART.workTray} style={styles.iconImg} resizeMode="contain" />
              <Image source={ART.workFolder} style={styles.iconImg} resizeMode="contain" />
              <Image source={ART.workDesk} style={styles.iconImg} resizeMode="contain" />
            </>)}
          </View>

          <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}.</Text>

          {!canWork && (
            <Text style={styles.body}>Paid training must be completed before you can work.</Text>
          )}

          {canWork && (<>
            <Text style={styles.body}>
              {'Complete one ' + activeJob.shiftHours + '-hour shift to earn $' + jobShiftPay + ' in pending wages and ' + activeJob.shiftXp + ' XP. Wages pay out on Friday.'}
            </Text>

            <Text style={styles.body}>{'Pending wages: $' + pendingWages}</Text>
            <Text style={styles.body}>{'Available paycheck: $' + paycheck}</Text>
            <Text style={styles.body}>{'Today\'s earnings: $' + earnedTodayValue + ' / $' + DAILY_LIMIT}</Text>{/* DAILY_LIMIT_V1_DISPLAY */}

            {!shiftDoneToday ? (
              activeJob.visualShift ? (
                <TouchableOpacity
                  style={styles.primary}
                  onPress={() => { if (!canEarn(earnedToday, earnedTodayDay, day, jobShiftPay)) { setShiftMessage(DAILY_LIMIT_MESSAGE); return; } setScenePhase('ready'); setPlace('WORK_VISUAL'); }} /* DAILY_LIMIT_V1_NAV_BLOCK */
                >
                  <Text style={styles.primaryText}>
                    {'WORK A SHIFT — EARN $' + jobShiftPay + ' PENDING'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.primary}
                  onPress={() => { if (awardShift()) setShiftMessage('Shift complete! You earned $' + jobShiftPay + ' in pending wages and ' + activeJob.shiftXp + ' XP.'); }}
                >
                  <Text style={styles.primaryText}>
                    {'WORK A SHIFT — EARN $' + jobShiftPay + ' PENDING'}
                  </Text>
                </TouchableOpacity>
              )
            ) : (
              <Text style={styles.body}>Shift completed for today. Next shift available tomorrow.</Text>
            )}
            {shiftMessage !== '' && (
              <Text style={styles.body}>{shiftMessage}</Text>
            )}

            {paycheck > 0 && (
              <TouchableOpacity
                style={styles.primary}
                onPress={collectPaycheck}
              >
                <Text style={styles.primaryText}>
                  {'COLLECT PAYCHECK — $' + paycheck}
                </Text>
              </TouchableOpacity>
            )}

            {paycheckMessage !== '' && (
              <Text style={styles.body}>{paycheckMessage}</Text>
            )}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('WORK'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>)}

          {/* CHAPTER3_BIZ_V1: own a business. */}
          <Text style={styles.sectionTitle}>OWN A BUSINESS</Text>
          {/* CHAPTER3_INV_V1: business-job clock label. */}
          <Text style={styles.body}>{'Business clock: ' + formatClock(hours) + ' on ' + DAY_NAMES[day % 7] + '.'}</Text>
          <Text style={styles.body}>{'Savings: $' + savings}</Text>
          {!businessUnlocked ? (
            <Text style={styles.body}>{'The business menu unlocks at $1,500 saved in the bank. You have $' + savings + ' of $1,500 saved.'}</Text>
          ) : (
            <Text style={styles.body}>Business menu unlocked. Buy a business with your savings — each business pays you for every job you work, up to 3 jobs a day.</Text>
          )}
          {BUSINESSES.map((biz) => {
            const owned = ownedBusinesses.includes(biz.id);
            const affordable = savings >= biz.price;
            const doneToday = bizJobsDoneToday(bizWork, biz.id, day);
            const buyDisabled = !businessUnlocked || owned || !affordable;
            return (
              <View key={biz.id}>
                <Text style={styles.body}>
                  {biz.name + ' — buy for $' + biz.price + ' from savings. Each job pays $' + biz.pay + ' and takes 2 hours.'}
                </Text>
                <TouchableOpacity
                  style={[styles.secondary, buyDisabled && { opacity: 0.5 }]}
                  disabled={buyDisabled}
                  onPress={() => buyBusiness(biz.id)}
                >
                  <Text style={styles.secondaryText}>
                    {owned ? 'OWNED' : !businessUnlocked ? 'LOCKED — SAVE $1,500 TO UNLOCK' : !affordable ? 'NEED $' + biz.price + ' IN SAVINGS' : 'BUY — $' + biz.price}
                  </Text>
                </TouchableOpacity>
                {owned && (<>
                  <Text style={styles.body}>{'Jobs done today: ' + doneToday + ' of 3.'}</Text>
                  <TouchableOpacity
                    style={[styles.primary, doneToday >= 3 && { opacity: 0.5 }]}
                    disabled={doneToday >= 3}
                    onPress={() => workBusinessJob(biz.id)}
                  >
                    <Text style={styles.primaryText}>
                      {doneToday >= 3 ? '3 JOBS DONE FOR TODAY' : 'WORK A JOB — EARN $' + biz.pay}
                    </Text>
                  </TouchableOpacity>
                </>)}
              </View>
            );
          })}
          {ownedBusinesses.length > 0 && (
            <Text style={styles.body}>
              {'Your businesses: ' + BUSINESSES.filter((biz) => ownedBusinesses.includes(biz.id)).map((biz) => biz.name).join(', ')}
            </Text>
          )}
          {bizMessage !== '' && (
            <Text style={styles.body}>{bizMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { setPaycheckMessage(''); setShiftMessage(''); setBizMessage(''); setPlace(null); }}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {/* LOOKPASS_V1: work background end. */}
    </ImageBackground>
    );
  }

  /*
   * HOME SCREEN - resting advances the in-game calendar by one day.
   */
  if (place === 'HOME') {
    const tomorrow = DAY_NAMES[(day + 1) % 7];
    return (
      <ImageBackground source={ART.bgHome} style={styles.bgFill} resizeMode="cover">
        {/* LOOKPASS_V1: home background. */}
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>HOME</Text>
          <Text style={styles.title}>Rest</Text>

          <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}.</Text>

          <Text style={styles.body}>
            Rest until tomorrow to advance the calendar. Payday is Friday.
          </Text>

          <TouchableOpacity
            style={styles.primary}
            onPress={restDay}
          >
            <Text style={styles.primaryText}>
              REST — WAKE UP {tomorrow.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* LIFE_EVENTS_V1: a waiting event is answered here, on HOME. */}
          {pendingEvent ? (() => {
            const ev = LIFE_EVENTS.find((e) => e.id === pendingEvent);
            if (!ev) return null;
            return (<>
              <Text style={styles.eyebrow}>LIFE EVENT</Text>
              <View style={[styles.card, styles.cardGold]}>
                <Text style={styles.title}>{ev.title}</Text>
                <Text style={styles.body}>{ev.text}</Text>
                {ev.choices.map((ch) => {
                  const afford = !ch.cash || ch.cash >= 0 || cash >= -ch.cash;
                  return (
                    <TouchableOpacity
                      key={ch.label}
                      style={afford ? styles.primary : styles.secondary}
                      disabled={!afford}
                      onPress={() => applyEventChoice(ch)}
                    >
                      <Text style={styles.primaryText}>{afford ? ch.label : ch.label + ' (not enough cash)'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>);
          })() : null}
          {eventMessage !== '' && (<Text style={styles.body}>{eventMessage}</Text>)}

          {/* HOUSING_SLICE_V1: first goal -- earn and save toward a place to live. */}
          <Text style={styles.eyebrow}>HOUSING GOAL</Text>
          {housing === 'none' ? (<>
            <Text style={styles.title}>A Place to Live</Text>
            <Text style={styles.body}>{HOUSING_GOAL.name}</Text>
            <Text style={styles.body}>{'First month\u2019s rent: $' + HOUSING_GOAL.firstMonthRent + ' (from savings)'}</Text>
            <Text style={styles.body}>{'Saved $' + Math.min(savings, HOUSING_GOAL.firstMonthRent) + ' of $' + HOUSING_GOAL.firstMonthRent}</Text>
            <View style={{ height: 10, backgroundColor: '#1c2a3a', borderRadius: 5, overflow: 'hidden' }}>
              <View style={{ height: 10, width: Math.min(100, Math.round((savings / HOUSING_GOAL.firstMonthRent) * 100)) + '%', backgroundColor: GOLD }} />
            </View>
            {savings >= HOUSING_GOAL.firstMonthRent ? (<>
              {housingConfirm ? (<>
                <Text style={styles.body}>{'Pay $' + HOUSING_GOAL.firstMonthRent + ' from savings for the first month\u2019s rent?'}</Text>
                <TouchableOpacity style={styles.primary} onPress={signLease}>
                  <Text style={styles.primaryText}>CONFIRM — SIGN LEASE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={() => { setHousingConfirm(false); setHousingMessage(''); }}>
                  <Text style={styles.secondaryText}>CANCEL</Text>
                </TouchableOpacity>
              </>) : (
                <TouchableOpacity style={styles.primary} onPress={() => { setHousingMessage(''); setHousingConfirm(true); }}>
                  <Text style={styles.primaryText}>SIGN LEASE — PAY $700</Text>
                </TouchableOpacity>
              )}
            </>) : (
              <Text style={styles.body}>{'Work warehouse shifts, collect your Friday paycheck, and deposit cash at the BANK. You need $' + (HOUSING_GOAL.firstMonthRent - savings) + ' more in savings.'}</Text>
            )}
            {housingMessage !== '' && (<Text style={styles.body}>{housingMessage}</Text>)}
          </>) : (<>
            <Text style={styles.title}>You're Housed</Text>
            <Text style={styles.body}>{'Current housing: ' + HOUSING_GOAL.name}</Text>
            <Text style={styles.body}>First month's rent paid from savings.</Text>
          </>)}

          <>
            {/* GOALS_GATE_V1_RENDER_OPEN: life goals from day one; no housing gate. */}
            <Text style={styles.eyebrow}>LIFE GOALS</Text>
            {LIFE_GOALS.map((g) => {
              const done = goalsDone.includes(g.id);
              const value = g.kind === 'credit' ? credit : savings;
              const nextGoal = LIFE_GOALS.find((x) => !goalsDone.includes(x.id));
              const isNext = !done && nextGoal !== undefined && nextGoal.id === g.id;
              const frac = g.kind === 'credit'
                ? Math.min(1, Math.max(0, (value - 575) / (g.target - 575)))
                : Math.min(1, value / g.target);
              return (
                /* GOALS_GATE_V1_GREY: unmet goals render dimmed; done goals
                 * keep body with their checkmark and done text. */
                <View key={g.id}>
                  <Text style={done ? styles.body : styles.goalUnmet}>{(done ? '\u2713 ' : '') + g.name}</Text>
                  {done ? (
                    <Text style={styles.body}>{g.doneText}</Text>
                  ) : isNext ? (<>
                    <Text style={styles.goalUnmet}>{g.targetText}</Text>
                    <Text style={styles.goalUnmet}>{g.kind === 'credit' ? ('Credit ' + value + ' of ' + g.target) : ('Saved $' + Math.min(value, g.target) + ' of $' + g.target)}</Text>
                    <View style={{ height: 10, backgroundColor: '#1c2a3a', borderRadius: 5, overflow: 'hidden' }}>
                      <View style={{ height: 10, width: Math.round(frac * 100) + '%', backgroundColor: GOLD }} />
                    </View>
                  </>) : (
                    <Text style={styles.goalUnmet}>{g.targetText}</Text>
                  )}
                </View>
              );
            })}
            {goalsDone.length === LIFE_GOALS.length && (
              <Text style={styles.body}>Every life goal complete. Sky's the limit!</Text>
            )}
          </>
          {/* GOALS_GATE_V1_RENDER_CLOSE */}

          {/* CHAPTER3_INV_V1: real estate. */}
          <Text style={styles.sectionTitle}>REAL ESTATE</Text>
          <Text style={styles.body}>{'Savings: $' + savings + ' - Credit: ' + credit}</Text>
          <Text style={styles.body}>Buy a property with your savings. Each one pays rent every Friday. Properties can't be sold.</Text>
          {PROPERTIES.map((prop) => {
            const owned = propertiesOwned.includes(prop.id);
            const creditOk = credit >= prop.credit;
            const affordable = savings >= prop.price;
            const buyDisabled = owned || !creditOk || !affordable;
            return (
              <View key={prop.id}>
                <Text style={styles.body}>
                  {prop.name + ' - buy for $' + prop.price + ' from savings. Needs credit ' + prop.credit + '. Pays $' + prop.rent + ' rent every Friday.'}
                </Text>
                <TouchableOpacity
                  style={[styles.secondary, buyDisabled && { opacity: 0.5 }]}
                  disabled={buyDisabled}
                  onPress={() => buyProperty(prop.id)}
                >
                  <Text style={styles.secondaryText}>
                    {owned ? 'OWNED' : !creditOk ? 'NEED CREDIT ' + prop.credit : !affordable ? 'NEED $' + prop.price + ' IN SAVINGS' : 'BUY - $' + prop.price}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {propertiesOwned.length > 0 && (
            <Text style={styles.body}>
              {'Your properties: ' + PROPERTIES.filter((prop) => propertiesOwned.includes(prop.id)).map((prop) => prop.name).join(', ')}
            </Text>
          )}
          {propertyMessage !== '' && (
            <Text style={styles.body}>{propertyMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace(null)}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {/* LOOKPASS_V1: home background end. */}
    </ImageBackground>
    );
  }

  /*
   * HOME, BANK, AND STORE SCREENS
   */
  /*
   * HARLEY_V1_SCREEN: Sky's Limit Harley Dealership. Cash only,
   * buy-once, no gameplay effects in v1. List -> detail -> confirm ->
   * owned. Back to Map never buys anything. Reuses the store backdrop
   * in v1 (no separate dealership background art yet).
   */
  /*
   * TRANSIT_V1_SCREEN - Sky City Transit v1. One bus-driver job, one
   * route (City Loop). Employment and training are separate from the
   * main job; the daily work allowance is shared through
   * lastShiftDay. Pay goes to pending wages (Friday payroll); fares
   * never reach the driver's cash. Leaving mid-route resumes the
   * same shift: bus, stop, passengers, and progress are saved.
   */
if (place === 'TRANSIT') {
    const shiftDoneToday = lastShiftDay === day;
    const waitingNow = transitShiftActive ? (transitBoarded ? 0 : (TRANSIT_WAITING[transitStop] || 0)) : 0;
    return (
      <ImageBackground source={ART.bgEmployment} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>SKY CITY TRANSIT</Text>
          <Text style={styles.title}>City Bus Driver</Text>
          <Text style={styles.body}>{'Cash: $' + cash}</Text>
          <Text style={styles.body}>{'Status: ' + (transitEmployment === 'none' ? 'Not employed' : transitTraining === 'complete' ? 'Hired — Training Complete' : 'Hired — Training Required')}</Text>
          <Text style={styles.body}>{'Pending wages: $' + pendingWages + ', payable Friday.'}</Text>
          {transitEmployment === 'none' ? (<>
            <Text style={styles.body}>Drive the City Loop and earn $144 per completed route shift. Training pays $144 too.</Text>
            <TouchableOpacity style={styles.primary} onPress={applyForTransit}><Text style={styles.primaryText}>APPLY FOR BUS DRIVER</Text></TouchableOpacity>
          </>) : transitTraining === 'incomplete' ? (<>
            <Text style={styles.body}>Paid training covers passenger boarding, safe stops, and operating the bus. Training uses today's work allowance.</Text>
            <TouchableOpacity style={styles.primary} onPress={completeTransitTraining}><Text style={styles.primaryText}>COMPLETE PAID TRAINING</Text></TouchableOpacity>
            {shiftDoneToday && (<Text style={styles.body}>You already used today's work allowance. Training is available again tomorrow.</Text>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('TRANSIT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>) : !transitShiftActive ? (<>
            <Text style={styles.body}>Route: City Loop — Transit Depot → Residential → Hospital/Civic → Downtown/Shopping → Casino District → Transit Depot. One shift per day, $144 when you finish the loop.</Text>
            <TouchableOpacity style={styles.primary} onPress={startTransitShift}><Text style={styles.primaryText}>START CITY LOOP SHIFT</Text></TouchableOpacity>
            {shiftDoneToday && (<Text style={styles.body}>You already used today's work allowance. Driving is available again tomorrow.</Text>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('TRANSIT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>) : (<>
            <Text style={styles.body}>{'Bus: ' + transitBus}</Text>
            {TRANSIT_STOPS.map((stop, i) => (
              <Text key={stop.id} style={i === transitStop ? styles.transitStopCurrent : styles.body}>
                {(i === transitStop ? '▶ ' : '') + stop.name + (i === transitStop ? ' — ' + waitingNow + ' waiting, ' + transitAboard + ' aboard' : '')}
              </Text>
            ))}
            <Text style={styles.body}>Fares belong to the transit system. Your pay is $144 when you finish the loop.</Text>
            {!transitBoarded ? (
              <TouchableOpacity style={styles.primary} onPress={boardTransitPassengers}><Text style={styles.primaryText}>BOARD PASSENGERS</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primary} onPress={driveTransitToNextStop}><Text style={styles.primaryText}>DRIVE TO NEXT STOP</Text></TouchableOpacity>
            )}
          </>)}
          {transitMessage !== '' && (<Text style={styles.body}>{transitMessage}</Text>)}
          <TouchableOpacity style={styles.secondary} onPress={() => { setTransitMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO MAP</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
    );
  }

if (place === 'DEALERSHIP') {
    const confirmBike = confirmBikeId ? BIKES.find((b) => b.id === confirmBikeId) : null;
    const selectedBike = selectedBikeId ? BIKES.find((b) => b.id === selectedBikeId) : null;
    return (
      <ImageBackground source={ART.bgStore} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>HARLEY DEALERSHIP</Text>
          <Text style={styles.body}>{'Cash: $' + cash}</Text>
          {confirmBike ? (<>
            <Text style={styles.body}>{'Buy the ' + confirmBike.name + ' for $' + confirmBike.price + '?'}</Text>
            <Text style={styles.body}>{'Cash after purchase: $' + (cash - confirmBike.price) + '.'}</Text>
            <TouchableOpacity style={styles.secondary} onPress={() => confirmBuyBike()}>
              <Text style={styles.secondaryText}>{'CONFIRM BUY — $' + confirmBike.price}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => { setConfirmBikeId(null); setBikeMessage('Purchase cancelled. No cash spent.'); }}>
              <Text style={styles.secondaryText}>CANCEL</Text>
            </TouchableOpacity>
          </>) : selectedBike ? (<>
            <Image source={BIKE_IMAGES[selectedBike.id]} style={styles.bikeDetailImage} resizeMode="contain" />
            <Text style={styles.title}>{selectedBike.name}</Text>
            <Text style={styles.body}>{selectedBike.blurb}</Text>
            <Text style={styles.body}>{'Price: $' + selectedBike.price}</Text>
            <Text style={styles.body}>{'Your cash: $' + cash}</Text>
            {ownedBikes.includes(selectedBike.id) ? (
              <Text style={styles.body}>You own this bike.</Text>
            ) : cash >= selectedBike.price ? (
              <TouchableOpacity style={styles.secondary} onPress={() => setConfirmBikeId(selectedBike.id)}>
                <Text style={styles.secondaryText}>{'BUY — $' + selectedBike.price}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.body}>{'Not enough cash. You need $' + (selectedBike.price - cash) + ' more.'}</Text>
            )}
            <TouchableOpacity style={styles.secondary} onPress={() => { setSelectedBikeId(null); }}>
              <Text style={styles.secondaryText}>BACK TO DEALERSHIP</Text>
            </TouchableOpacity>
          </>) : (<>
            <Text style={styles.body}>Buy each bike once. Your bikes are saved.</Text>
            {BIKES.map((bike) => {
              const owned = ownedBikes.includes(bike.id);
              const affordable = cash >= bike.price;
              return (
                <TouchableOpacity
                  key={bike.id}
                  accessibilityRole="button"
                  style={[styles.secondary, styles.productBtn]}
                  onPress={() => { setBikeMessage(''); setSelectedBikeId(bike.id); }}
                >
                  <Image source={BIKE_IMAGES[bike.id]} style={styles.bikeThumb} resizeMode="contain" />
                  <Text style={styles.secondaryText}>
                    {bike.name + ' — $' + bike.price + (owned ? ' — OWNED' : !affordable ? ' — NOT ENOUGH CASH' : ' — VIEW')}
                  </Text>
                  {owned && <Image source={ART.storeCheck} style={styles.ownedIcon} resizeMode="contain" />}
                </TouchableOpacity>
              );
            })}
            {!!bikeMessage && <Text style={styles.body} accessibilityLiveRegion="polite">{bikeMessage}</Text>}
            <Text style={styles.body}>
              {'Your bikes: ' + (BIKES.filter((bike) => ownedBikes.includes(bike.id)).map((bike) => bike.name).join(', ') || 'None yet')}
            </Text>
          </>)}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { setBikeMessage(''); setSelectedBikeId(null); setConfirmBikeId(null); setPlace(null); }}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
    );
  }

  /* CASINO_V1_SCREEN: Sky City Casino. Cash only, savings untouched.
   * Menu -> game -> result with PLAY AGAIN / BACK TO CASINO.
   * Reuses the store backdrop in v1 (no new art yet). */
  if (place === 'CASINO') {
    const showCasinoGame = (game) => {
      setCasinoGame(game);
      setSlotSymbols(null);
      setSlotResult('');
      setBjDeck([]);
      setBjPlayer([]);
      setBjDealer([]);
      setBjBet(0);
      setBjPhase('idle');
      setBjMessage('');
      setRoulettePocket(null);
      setRouletteResult('');
    };
    return (
      <ImageBackground source={ART.bgStore} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>SKY CITY CASINO</Text>
          <Text style={styles.body}>{'Cash: $' + cash}</Text>
          {casinoGame === null ? (<>
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame('slots')}>
              <Text style={styles.secondaryText}>SLOTS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame('blackjack')}>
              <Text style={styles.secondaryText}>BLACKJACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame('roulette')}>
              <Text style={styles.secondaryText}>ROULETTE</Text>
            </TouchableOpacity>
          </>) : casinoGame === 'slots' ? (<>
            <Text style={styles.title}>SLOTS</Text>
            <Text style={styles.body}>Prize chart — total returned, bet included. Only the highest prize pays.</Text>
            {SLOT_PRIZES.map((prize) => (
              <Text key={prize.label} style={styles.body}>{prize.label}</Text>
            ))}
            <Text style={styles.body}>Two Cherries: 2x</Text>
            <Text style={styles.body}>Anything else: lose the bet</Text>
            {slotSymbols && (
              <Text style={styles.slotReel}>
                {slotSymbols.map((s) => SLOT_EMOJI[s]).join(' ')}
              </Text>
            )}
            {[5, 10, 25].map((bet) => (
              <TouchableOpacity
                key={bet}
                style={[styles.secondary, cash < bet && { opacity: 0.5 }]}
                disabled={cash < bet}
                onPress={() => spinSlotsGame(bet)}
              >
                <Text style={styles.secondaryText}>{'SPIN — $' + bet}</Text>
              </TouchableOpacity>
            ))}
            {!!slotResult && <Text style={styles.casinoResult} accessibilityLiveRegion="polite">{slotResult}</Text>}{/* TRANSIT_V1_CASINO_FIX_SLOTS */}
            <TouchableOpacity style={styles.secondary} onPress={() => { setSlotSymbols(null); setSlotResult(''); }}>
              <Text style={styles.secondaryText}>PLAY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame(null)}>
              <Text style={styles.secondaryText}>BACK TO CASINO</Text>
            </TouchableOpacity>
          </>) : casinoGame === 'blackjack' ? (<>
            <Text style={styles.title}>BLACKJACK</Text>
            <Text style={styles.body}>Beat the dealer to win your bet back plus the same again. A natural blackjack pays 3:2. Dealer stands on 17.</Text>
            {bjPhase === 'idle' ? (<>
              {[10, 20, 50].map((bet) => (
                <TouchableOpacity
                  key={bet}
                  style={[styles.secondary, cash < bet && { opacity: 0.5 }]}
                  disabled={cash < bet}
                  onPress={() => dealBlackjack(bet)}
                >
                  <Text style={styles.secondaryText}>{'DEAL — $' + bet}</Text>
                </TouchableOpacity>
              ))}
            </>) : (<>
              <Text style={styles.body}>{'Dealer: ' + bjDealer.map((card, i) => (bjPhase === 'playing' && i === 1 ? '🂠' : cardLabel(card))).join('  ') + (bjPhase === 'playing' ? '' : '  (' + handValue(bjDealer) + ')')}</Text>
              <Text style={styles.body}>{'You: ' + bjPlayer.map(cardLabel).join('  ') + '  (' + handValue(bjPlayer) + ')'}</Text>
              {bjPhase === 'playing' && (<>
                <TouchableOpacity style={styles.secondary} onPress={hitBlackjack}>
                  <Text style={styles.secondaryText}>HIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={standBlackjack}>
                  <Text style={styles.secondaryText}>STAND</Text>
                </TouchableOpacity>
              </>)}
              {bjPhase === 'done' && (
                <TouchableOpacity style={styles.secondary} onPress={() => { setBjDeck([]); setBjPlayer([]); setBjDealer([]); setBjBet(0); setBjPhase('idle'); setBjMessage(''); }}>
                  <Text style={styles.secondaryText}>PLAY AGAIN</Text>
                </TouchableOpacity>
              )}
            </>)}
            {!!bjMessage && <Text style={styles.casinoResult} accessibilityLiveRegion="polite">{bjMessage}</Text>}{/* TRANSIT_V1_CASINO_FIX_BJ */}
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame(null)}>
              <Text style={styles.secondaryText}>BACK TO CASINO</Text>
            </TouchableOpacity>
          </>) : (<>
            <Text style={styles.title}>ROULETTE</Text>
            <Text style={styles.body}>Pick a color, place your bet, spin the wheel. 18 red, 18 black, 1 green zero.</Text>
            <Text style={styles.body}>{'Your pick: ' + (roulettePick ? roulettePick.toUpperCase() : 'none yet')}</Text>
            <TouchableOpacity style={[styles.secondary, roulettePick === 'red' && { opacity: 0.6 }]} onPress={() => { setRoulettePick('red'); setRouletteResult(''); }}>
              <Text style={styles.secondaryText}>🔴 RED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondary, roulettePick === 'black' && { opacity: 0.6 }]} onPress={() => { setRoulettePick('black'); setRouletteResult(''); }}>
              <Text style={styles.secondaryText}>⚫ BLACK</Text>
            </TouchableOpacity>
            {[5, 10, 25].map((bet) => (
              <TouchableOpacity
                key={bet}
                style={[styles.secondary, cash < bet && { opacity: 0.5 }]}
                disabled={cash < bet}
                onPress={() => spinRouletteGame(bet)}
              >
                <Text style={styles.secondaryText}>{'SPIN — $' + bet}</Text>
              </TouchableOpacity>
            ))}
            {roulettePocket !== null && (
              <Text style={styles.body}>{'Ball: ' + roulettePocket + ' (' + rouletteColor(roulettePocket) + ')'}</Text>
            )}
            {!!rouletteResult && <Text style={styles.casinoResult} accessibilityLiveRegion="polite">{rouletteResult}</Text>}{/* TRANSIT_V1_CASINO_FIX_ROULETTE */}
            <TouchableOpacity style={styles.secondary} onPress={() => { setRoulettePocket(null); setRouletteResult(''); }}>
              <Text style={styles.secondaryText}>PLAY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame(null)}>
              <Text style={styles.secondaryText}>BACK TO CASINO</Text>
            </TouchableOpacity>
          </>)}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { showCasinoGame(null); setPlace(null); }}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
    );
  }

if (place === 'STORE') {
    return (
      <ImageBackground source={ART.bgStore} style={styles.bgFill} resizeMode="cover">
        {/* LOOKPASS_V1: store background. */}
        <SafeAreaView style={[styles.safe, styles.safeArt]}>        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>STORE</Text>
          <Text style={styles.body}>{'Cash: $' + cash}</Text>
          <Text style={styles.body}>Buy each item once. Your purchases are saved.</Text>
          {STORE_ITEMS.map((item) => {
            const owned = inventory.includes(item.id);
            const affordable = cash >= item.price;
            const unavailable = owned || !affordable;
            return (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ disabled: unavailable }}
                style={[styles.secondary, styles.productBtn, unavailable && { opacity: 0.5 }]}
                disabled={unavailable}
                onPress={() => buyStoreItem(item.id)}
              >
                {/* LOOKPASS_V1: product icons. */}
                <Image source={STORE_ICONS[item.id]} style={styles.productIcon} resizeMode="contain" />
                <Text style={styles.secondaryText}>
                  {item.name + ' — $' + item.price + (owned ? ' — OWNED' : !affordable ? ' — NOT ENOUGH CASH' : ' — BUY')}
                </Text>
                {owned && <Image source={ART.storeCheck} style={styles.ownedIcon} resizeMode="contain" />}
              </TouchableOpacity>
            );
          })}
          {!!storeMessage && <Text style={styles.body} accessibilityLiveRegion="polite">{storeMessage}</Text>}
          <Text style={styles.body}>
            {'Your items: ' + (STORE_ITEMS.filter((item) => inventory.includes(item.id)).map((item) => item.name).join(', ') || 'None yet')}
          </Text>
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { setStoreMessage(''); setPlace(null); }}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {/* LOOKPASS_V1: store background end. */}
    </ImageBackground>
    );
  }

if (place === 'BANK') {
    return (
      <ImageBackground source={ART.bgBank} style={styles.bgFill} resizeMode="cover">
        {/* LOOKPASS_V1: bank background. */}
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
                    <ScrollView>
                            <Text style={styles.title}>BANK</Text>
                            {/* LOOKPASS_V1: bank icons. */}
                            <View style={styles.iconRow}>
                              <Image source={ART.bankBuilding} style={styles.iconImg} resizeMode="contain" />
                              <Image source={ART.bankJar} style={styles.iconImg} resizeMode="contain" />
                              <Image source={ART.bankDeposit} style={styles.iconImg} resizeMode="contain" />
                            </View>

                                    <Text style={styles.body}>{'Cash: $' + cash}</Text>
                                            <Text style={styles.body}>{'Savings: $' + savings}</Text>
                                                    <Text style={styles.body}>Credit: {credit}</Text>
                                                    {/* PAYROLL_DISPLAY_FIX_V1_BANK: show the available paycheck
                                                     * here too. It lives on the WORK screen with its COLLECT
                                                     * button; BANK never mentioned it, so a Friday paycheck
                                                     * looked like missing money. Display only: no button,
                                                     * no state change. */}
                                                    <Text style={styles.body}>{'Available paycheck: $' + paycheck}</Text>
                                                    {paycheck > 0 && (
                                                      <Text style={styles.body}>Collect it on the WORK screen.</Text>
                                                    )}

                                                            <TouchableOpacity
                                                                      style={styles.secondary}
                                                                                onPress={() => {
                                                                                            const amount = Math.min(100, cash);
                                                                                                        setCash(v => v - amount);
                                                                                                                    setSavings(v => v + amount);
                                                                                                                                /* CHAPTER3_INV_V1: credit now comes from the savings-peak effect. */
                                                                                                                                          }}
                                                                                                                                                  >
                                                                                                                                                            <Text style={styles.secondaryText}>DEPOSIT $100</Text>
                                                                                                                                                                    </TouchableOpacity>

                                                                                                                                                                            <TouchableOpacity
                                                                                                                                                                                      style={styles.secondary}
                                                                                                                                                                                                onPress={() => {
                                                                                                                                                                                                            const amount = Math.min(100, savings);
                                                                                                                                                                                                                        setSavings(v => v - amount);
                                                                                                                                                                                                                                    setCash(v => v + amount);
                                                                                                                                                                                                                                              }}
                                                                                                                                                                                                                                                      >
                                                                                                                                                                                                                                                                <Text style={styles.secondaryText}>WITHDRAW $100</Text>
                                                                                                                                                                                                                                                                        </TouchableOpacity>


                            {/* CHAPTER3_INV_V1: investments. */}
                            <Text style={styles.sectionTitle}>INVESTMENTS</Text>
                            <Text style={styles.body}>{'Savings: $' + savings}</Text>
                            {!investmentsUnlocked ? (
                              <Text style={styles.body}>{'Investments unlock at $2,000 saved in the bank. You have $' + savings + ' of $2,000 saved.'}</Text>
                            ) : (<>
                              <Text style={styles.body}>Investments unlocked. The bond pays $10 cash every Friday; the fund's value changes every Friday - sell it to take the money.</Text>
                              <Text style={styles.body}>{'Sky City Savings Bond - buy for $500 from savings. Pays $10 every Friday, never loses value. Sell any time for $500.'}</Text>
                              {bondOwned ? (<>
                                <Text style={styles.body}>You own the Savings Bond.</Text>
                                <TouchableOpacity style={styles.secondary} onPress={sellBond}>
                                  <Text style={styles.secondaryText}>SELL BOND - $500</Text>
                                </TouchableOpacity>
                              </>) : (
                                <TouchableOpacity style={[styles.secondary, savings < BOND_PRICE && { opacity: 0.5 }]} disabled={savings < BOND_PRICE} onPress={buyBond}>
                                  <Text style={styles.secondaryText}>{savings < BOND_PRICE ? 'NEED $500 IN SAVINGS' : 'BUY BOND - $500'}</Text>
                                </TouchableOpacity>
                              )}
                              <Text style={styles.body}>{'Sky City Growth Fund - buy for $1,000 from savings. Value goes up $40 on winning Fridays and down $20 on losing Fridays (win, win, lose), never below $900. Sell any time for the current value.'}</Text>
                              {fundOwned ? (<>
                                <Text style={styles.body}>{'Your fund is worth $' + fundValue + '.'}</Text>
                                <Text style={styles.body}>{fundCycle === 2 ? 'Next Friday is a losing Friday (-$20).' : 'Next Friday is a winning Friday (+$40).'}</Text>
                                <TouchableOpacity style={styles.secondary} onPress={sellFund}>
                                  <Text style={styles.secondaryText}>{'SELL FUND - $' + fundValue}</Text>
                                </TouchableOpacity>
                              </>) : (
                                <TouchableOpacity style={[styles.secondary, savings < FUND_PRICE && { opacity: 0.5 }]} disabled={savings < FUND_PRICE} onPress={buyFund}>
                                  <Text style={styles.secondaryText}>{savings < FUND_PRICE ? 'NEED $1,000 IN SAVINGS' : 'BUY FUND - $1,000'}</Text>
                                </TouchableOpacity>
                              )}
                              {investMessage !== '' && (
                                <Text style={styles.body}>{investMessage}</Text>
                              )}
                            </>)}
                                                                                                                                                                                                                                                                                <TouchableOpacity
                                                                                                                                                                                                                                                                                          style={styles.secondary}
                                                                                                                                                                                                                                                                                                    onPress={() => setPlace(null)}
                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                      <Text style={styles.secondaryText}>BACK TO MAP</Text>
                                                                                                                                                                                                                                                                                                                              </TouchableOpacity>
                                                                                                                                                                                                                                                                                                                                    </ScrollView>
                                                                                                                                                                                                                                                                                                                                        </SafeAreaView>
                                                                                                                                                                                                                                                                                                                                        {/* LOOKPASS_V1: bank background end. */}
                                                                                                                                                                                                                                                                                                                                        </ImageBackground>
                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                          }
  /* POLISH_V1_SETTINGS: RESTART ALPHA lives here now, off the map screen,
   * so a mis-tap can never wipe the save. */
  if (place === 'SETTINGS') {
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>SETTINGS</Text>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.body}>Your progress is saved on this device. Restarting erases everything and starts a new game at $2,500.</Text>

            <TouchableOpacity
              style={styles.secondary}
              onPress={restartGame}
            >
              <Text style={styles.secondaryText}>
                RESTART ALPHA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO MAP</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

 if (place) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>{place}</Text>
          <Text style={styles.body}>Welcome to {place}.</Text>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace(null)}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
      {/* LOOKPASS_V1: main-menu background. */}
      <SafeAreaView style={[styles.safe, styles.safeArt]}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoSmall}>SKY'S</Text>
            <Text style={styles.logoBig}>THE LIMIT</Text>
            {/* LOOKPASS_V1: gold rule under title. */}
            <View style={styles.goldRule} />
          </View>

          <View style={styles.levelPill}>
            <Text style={styles.levelText}>
              LEVEL {1 + Math.floor(xp / 250)}
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${freeRoam ? xpProgress : progress}%` },
            ]}
          />
        </View>
        {freeRoam ? (
          <Text style={styles.xpToNext}>{xpToNext} XP to Level {level + 1}</Text>
        ) : null}

        {!freeRoam ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>{current.eyebrow}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.body}>{current.body}</Text>

            <TouchableOpacity
              style={styles.primary}
              onPress={advance}
            >
              <Text style={styles.primaryText}>
                {current.button}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cityWelcome}>
              <Text style={styles.eyebrow}>FREE ROAM — ALPHA</Text>
              <Text style={styles.cityWelcomeTitle}>Sky City</Text>
              <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}. Tap a building to go inside.</Text>
              <Text style={styles.paydayLine}>{paydayLine(day)}</Text>
            </View>

            <Text style={styles.sectionTitle}>CITY MAP</Text>

            <ImageBackground
              source={ART.bgMap}
              resizeMode="cover"
              ref={mapViewRef}
              style={styles.city}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setMapSize((prev) => (
                  prev.w === width && prev.h === height
                    ? prev
                    : { w: width, h: height }
                ));
                mapPlayerPos.setValue({ x: 0.5 * width, y: 0.93 * height });
              }}
            >
              {/* LOOKPASS_V1: map background. */}
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={(e) => {
                  const n = e.nativeEvent || {};
                  if (Number.isFinite(n.locationX) && Number.isFinite(n.locationY)) {
                    freeMoveTo(n.locationX, n.locationY);
                    return;
                  }
                  /* Web: press events carry a MouseEvent (no locationX/Y).
                     Derive map coordinates from the page position instead. */
                  if (mapViewRef.current && Number.isFinite(n.pageX) && Number.isFinite(n.pageY)) {
                    mapViewRef.current.measure((fx, fy, w, h, px, py) => {
                      freeMoveTo(n.pageX - px, n.pageY - py);
                    });
                  }
                }}
              />
              <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: mapTintForHour(hours).color, opacity: mapTintForHour(hours).opacity }]} />{/* LIVING_CITY_V1: day/night tint. */}
              <View pointerEvents="none" style={[styles.cityDeco, { left: '38%', top: '12%' }]}>
                <View style={styles.treeTop} />
                <View style={styles.treeTrunk} />
              </View>
              <View pointerEvents="none" style={[styles.cityDeco, { left: '60%', top: '72%' }]}>
                <View style={styles.treeTop} />
                <View style={styles.treeTrunk} />
              </View>
              <View pointerEvents="none" style={[styles.cityLamp, { left: '56%', top: '24%' }]}>
                <View style={[styles.lampGlow, { opacity: mapTintForHour(hours).opacity > 0.2 ? 1 : 0.35 }]} />
                <View style={styles.lampPole} />
              </View>
              <View pointerEvents="none" style={[styles.cityLamp, { left: '28%', top: '62%' }]}>
                <View style={[styles.lampGlow, { opacity: mapTintForHour(hours).opacity > 0.2 ? 1 : 0.35 }]} />
                <View style={styles.lampPole} />
              </View>{/* LIVING_CITY_V1: lamp glow follows the clock. */}
              <View pointerEvents="none" style={[styles.cityBench, { left: '58%', top: '84%' }]}>
                <View style={styles.benchSeat} />
                <View style={styles.benchLegs}>
                  <View style={styles.benchLeg} />
                  <View style={styles.benchLeg} />
                </View>
              </View>
              <View pointerEvents="none" style={[styles.cityPath, { left: '48%', top: '4%', width: '4%', height: '92%' }]} />
              <View pointerEvents="none" style={[styles.cityPath, { left: '4%', top: '62%', width: '92%', height: '4.5%' }]} />{/* TRANSIT_V1_MAP_PATH */}
              {mapSize.w > 0 && (
                <>
                  <AmbientActor mapSize={mapSize} walker={LIVING_CITY_WALKERS[0]} reduceMotion={reduceMotion}>
                    <PlayerFigure shirt={LIVING_CITY_WALKERS[0].shirt} />
                  </AmbientActor>
                  <AmbientActor mapSize={mapSize} walker={LIVING_CITY_WALKERS[1]} reduceMotion={reduceMotion}>
                    <PlayerFigure shirt={LIVING_CITY_WALKERS[1].shirt} />
                  </AmbientActor>
                  <AmbientActor mapSize={mapSize} walker={LIVING_CITY_WALKERS[2]} reduceMotion={reduceMotion}>
                    <PlayerFigure shirt={LIVING_CITY_WALKERS[2].shirt} />
                  </AmbientActor>
                  <AmbientActor mapSize={mapSize} walker={LIVING_CITY_WALKERS[3]} reduceMotion={reduceMotion}>
                    <PlayerFigure shirt={LIVING_CITY_WALKERS[3].shirt} />
                  </AmbientActor>
                  <AmbientActor mapSize={mapSize} car={LIVING_CITY_CARS[0]} reduceMotion={reduceMotion}>
                    <CarFigure body={LIVING_CITY_CARS[0].body} />
                  </AmbientActor>
                  <AmbientActor mapSize={mapSize} car={LIVING_CITY_CARS[1]} reduceMotion={reduceMotion}>
                    <CarFigure body={LIVING_CITY_CARS[1].body} />
                  </AmbientActor>
                </>
              )}{/* LIVING_CITY_V1: ambient walkers and cars, behind the tiles. */}
              <View pointerEvents="none" style={[styles.cityPlaza, { left: '40%', top: '93%' }]}>{/* TRANSIT_V1_MAP_PLAZA */}
                <Text style={styles.cityTag}>YOU ARE HERE</Text>
              </View>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '3%', top: '5%' }, styles.districtHome]}
                onPress={() => travelTo('HOME')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  {/* LOOKPASS_V1: home building icon. */}
                  <Image source={ART.bldgHome} style={styles.bldgIcon} resizeMode="contain" />
                </View>
                <View style={styles.cityLabelPill}>
                  {/* CITYLAYOUT_V1: label pill HOME. */}
                  <Text style={styles.cityName}>HOME</Text>
                  <Text style={styles.cityDesc}>Rest — advances the calendar one day</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '65%', top: '5%' }, styles.districtWork]}
                onPress={() => travelTo('WORK')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  {/* LOOKPASS_V1: work building icon. */}
                  <Image source={ART.bldgWork} style={styles.bldgIcon} resizeMode="contain" />
                </View>
                <View style={styles.cityLabelPill}>
                  {/* CITYLAYOUT_V1: label pill WORK. */}
                  <Text style={styles.cityName}>WORK</Text>
                  <Text style={styles.cityDesc}>
                    {employment === 'hired' && training === 'complete'
                      ? 'Work a shift — earn $144 pending'
                      : 'Apply at the Employment Center'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '3%', top: '35%' }]}
                onPress={() => travelTo('BANK')}
                disabled={!!mapTravel}
              >{/* TRANSIT_V1_MAP_BANK */}
                <View style={styles.buildingArt}>
                  {/* LOOKPASS_V1: bank building icon. */}
                  <Image source={ART.bldgBank} style={styles.bldgIcon} resizeMode="contain" />
                </View>
                <View style={styles.cityLabelPill}>
                  {/* CITYLAYOUT_V1: label pill BANK. */}
                  <Text style={styles.cityName}>BANK</Text>
                  <Text style={styles.cityDesc}>Save money and build credit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '65%', top: '35%' }]}
                onPress={() => travelTo('STORE')}
                disabled={!!mapTravel}
              >{/* TRANSIT_V1_MAP_STORE */}
                <View style={styles.buildingArt}>
                  {/* LOOKPASS_V1: store building icon. */}
                  <Image source={ART.bldgStore} style={styles.bldgIcon} resizeMode="contain" />
                </View>
                <View style={styles.cityLabelPill}>
                  {/* CITYLAYOUT_V1: label pill STORE. */}
                  <Text style={styles.cityName}>STORE</Text>
                  <Text style={styles.cityDesc}>Buy food and essentials</Text>
                </View>
              </TouchableOpacity>
              {/* HARLEY_V1_TILE: dealership building, middle of the lower row. */}
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '34%', top: '66%' }]}
                onPress={() => travelTo('DEALERSHIP')}
                disabled={!!mapTravel}
              >{/* TRANSIT_V1_MAP_DEALER */}
                <View style={styles.buildingArt}>
                  <Text style={styles.cityEmoji}>🏍️</Text>
                </View>
                <View style={styles.cityLabelPill}>
                  <Text style={styles.cityName}>DEALERSHIP</Text>
                  <Text style={styles.cityDesc}>Buy a Harley</Text>
                </View>
              </TouchableOpacity>
              {/* TRANSIT_V1_TILE: transit depot, middle of the middle row. */}
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '34%', top: '35%' }]}
                onPress={() => travelTo('TRANSIT')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <Text style={styles.cityEmoji}>🚌</Text>
                </View>
                <View style={styles.cityLabelPill}>
                  <Text style={styles.cityName}>TRANSIT</Text>
                  <Text style={styles.cityDesc}>Drive the City Loop</Text>
                </View>
              </TouchableOpacity>
              {/* CASINO_V1_TILE: casino building, middle of the upper row. */}
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '34%', top: '5%' }, styles.districtCasino]}
                onPress={() => travelTo('CASINO')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <Text style={styles.cityEmoji}>🎰</Text>
                </View>
                <View style={styles.cityLabelPill}>
                  <Text style={styles.cityName}>CASINO</Text>
                  <Text style={styles.cityDesc}>Slots, blackjack, roulette</Text>
                </View>
              </TouchableOpacity>
              {mapSize.w > 0 && (
                <Animated.View
                  pointerEvents="none"
                  style={[styles.cityActor, {
                    transform: [
                      { translateX: mapPlayerPos.x },
                      { translateY: Animated.add(mapPlayerPos.y, walkBob) },
                    ],
                  }]}
                >
                  <PlayerFigure />
                  <Text style={styles.cityTag}>YOU</Text>
                </Animated.View>
              )}
              {/* LOOKPASS_V1: map background end. */}
            </ImageBackground>
            {mapTravel && (
              <TouchableOpacity style={styles.secondary} onPress={skipTravel}>
                <Text style={styles.secondaryText}>SKIP — GO INSIDE</Text>
              </TouchableOpacity>
            )}


            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('SETTINGS')}
            >
              <Text style={styles.secondaryText}>
                SETTINGS
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* CITYLAYOUT_V1: stats row moved below the map. */}
        <View style={styles.statsRow}>
          {/* LOOKPASS_V1: stat icons. */}
          {/* POLISH_V1_CASH_HERO */}
          <Stat
            label="CASH"
            value={`$${cash}`}
            accent={GREEN}
            icon={ART.cash}
            hero
            onPress={() => alert(`Cash balance: $${cash}`)}
          />

          {/* POLISH_V1_SAVINGS_DIM */}
          <Stat
            label="SAVINGS"
            value={`$${savings}`}
            accent={BLUE}
            icon={ART.savings}
            small
            dim
            onPress={() => alert(`Savings: $${savings}`)}
          />

          {/* POLISH_V1_SMALL_CREDIT */}
          <Stat
            label="CREDIT"
            value={credit}
            accent={GOLD}
            icon={ART.credit}
            small
            onPress={() => alert(`Credit score: ${credit}`)}
          />

          {/* POLISH_V1_SMALL_XP */}
          <Stat
            label="XP"
            value={xp}
            accent={PURPLE}
            icon={ART.xp}
            small
            onPress={() => alert(`XP: ${xp}`)}
          />

          <Stat
            label="COINS"
            value={coins}
            accent={GOLD}
            icon={ART.coins}
            onPress={() => alert(`Coin balance: ${coins}`)}
          />
        </View>

        <Text style={styles.footer}>
          Sky's the Limit • Alpha 1.0
        </Text>
      </ScrollView>
      </SafeAreaView>
      {/* LOOKPASS_V1: main-menu background end. */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#07101c',
  },

  page: {
    padding: 18,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* LOOKPASS_V1: title in gold. */
  logoSmall: {
    color: GOLD,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
  },

  logoBig: {
    color: GOLD,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },

  levelPill: {
    backgroundColor: '#13253d',
    borderWidth: 1,
    borderColor: '#2b4668',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  levelText: {
    color: BLUE,
    fontSize: 12,
    fontWeight: '800',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  /* LOOKPASS_V1: slim stat boxes. */
  stat: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
  },

  statLabel: {
    fontSize: 9,
    fontWeight: '900',
  },

  statValue: {
    color: '#ffffff',  
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },

  /* POLISH_V1_STAT_HERO: Cash hero uses the reviewer's sizes/colors:
   * 28pt, weight 800, #22c55e. Savings is 12pt at 0.7 opacity. */
  statHero: {
    flex: 1.8,
    borderWidth: 2,
  },

  statHeroValue: {
    color: '#22c55e',
    fontSize: 28,
    fontWeight: '800',
  },

  statValueSm: {
    fontSize: 12,
  },

  statValueDim: {
    opacity: 0.7,
  },

  progressTrack: {
    height: 10,
    backgroundColor: '#17263a',
    borderRadius: 99,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#ffd94d',
  },

  /* POLISH_V1_XP_BAR: remaining XP to the next level, shown in free roam. */
  xpToNext: {
    color: GOLD,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  /* POLISH_V1_PAYDAY: gold payday line under the map welcome text. */
  paydayLine: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },

  heroCard: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 24,
    padding: 22,
    minHeight: 330,
    justifyContent: 'center',
  },

  eyebrow: {
    color: BLUE,
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 14,
  },

  title: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 34,
    lineHeight: 38,
    marginBottom: 16,
  },

  body: {
    color: '#b8c4d4',
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 26,
  },

  primary: {
    backgroundColor: GOLD,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },

  primaryText: {
    color: '#111111',
    fontWeight: '900',
    fontSize: 15,
    textAlign: 'center',
  },

  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  placeCard: {
    minHeight: 155,
    width: '48%',
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 18,
    padding: 16,
  },

  placeIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  placeName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },

  placeDesc: {
    color: '#8fa0b5',
    fontSize: 12,
    lineHeight: 17,
  },

  /* LOOKPASS_V1: secondary buttons. */
  /* Navy fill, gold outline. */
  secondary: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginTop: 4,
  },

  secondaryText: {
    color: '#c8d3e0',
    fontWeight: '900',
  },

  footer: {
    color: '#53657a',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },

  scene: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#1a2433',
    borderWidth: 1,
    borderColor: '#2b4668',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 4,
  },

  sceneShelf: {
    position: 'absolute',
    width: '22%',
    height: '26%',
    backgroundColor: '#5a4632',
    borderWidth: 1,
    borderColor: '#7a6248',
    borderRadius: 6,
  },

  sceneDrop: {
    position: 'absolute',
    width: '24%',
    height: '34%',
    borderWidth: 2,
    borderColor: GOLD,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scenePerson: {
    position: 'absolute',
    alignItems: 'center',
  },

  sceneActor: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
  },

  sceneEmoji: {
    fontSize: 34,
  },

  sceneTag: {
    color: '#8fa3bd',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  city: {
    width: '100%',
    /* TRANSIT_V1_MAP_ASPECT: taller map -- three rows of tiles now fit. */
    aspectRatio: 1.3,
    backgroundColor: '#101c2e',
    borderWidth: 1,
    borderColor: '#2b4668',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 4,
  },

  cityPath: {
    position: 'absolute',
    backgroundColor: '#2a3a52',
    borderRadius: 4,
  },

  cityPlaza: {
    position: 'absolute',
    width: '24%',
    alignItems: 'center',
    backgroundColor: '#16283f',
    borderWidth: 1,
    borderColor: '#2b4668',
    borderRadius: 8,
    paddingVertical: 4,
  },

  /* CITYLAYOUT_V1: transparent tile overlay (map art shows through). */
  cityBuilding: {
    position: 'absolute',
    width: '32%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    /* POLISH_V1_TILE: slimmer tile for the bigger icons. */
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  cityEmoji: {
    /* POLISH_V1_EMOJI: bigger building icons. */
    fontSize: 68,
  },

  cityEmojiSm: {
    fontSize: 30,
  },

  cityName: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
    marginTop: 4,
    /* POLISH_V1_NAME_SHADOW: readable over the map now the pill is clear. */
    textShadowColor: '#07101c',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  cityDesc: {
    color: '#8fa3bd',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    /* POLISH_V1_DESC_SHADOW: readable over the map now the pill is clear. */
    textShadowColor: '#07101c',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* CITYLAYOUT_V1: label pill style. */
  /* POLISH_V1_PILL: clear pill so the map shows through. */
  cityLabelPill: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 4,
  },

  cityTag: {
    color: '#8fa3bd',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  /* POLISH_V1_DISTRICTS: subtle tint per district. */
  districtHome: {
    backgroundColor: 'rgba(76, 217, 123, 0.14)',
    borderRadius: 12,
  },

  districtCasino: {
    backgroundColor: 'rgba(244, 197, 66, 0.14)',
    borderRadius: 12,
  },

  districtWork: {
    backgroundColor: 'rgba(62, 166, 255, 0.14)',
    borderRadius: 12,
  },

  cityActor: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
  },

  /* CITYLAYOUT_V1: slim welcome strip. */
  cityWelcome: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 14,
  },

  /* CITYLAYOUT_V1: slim welcome title. */
  cityWelcomeTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 2,
  },

  /* CITYLAYOUT_V1: smaller building art slot. */
  buildingArt: {
    /* POLISH_V1_ART: taller art slot for the bigger icons. */
    height: 104,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  houseRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 52,
    borderRightWidth: 52,
    borderBottomWidth: 34,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8a4b2e',
  },

  houseBody: {
    width: 96,
    height: 62,
    backgroundColor: '#d9b380',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },

  houseWin: {
    width: 18,
    height: 18,
    backgroundColor: '#ffe9a8',
    borderRadius: 2,
    marginBottom: 14,
  },

  houseDoor: {
    width: 22,
    height: 40,
    backgroundColor: '#5a3a22',
    borderRadius: 3,
  },

  wareRoof: {
    width: 124,
    height: 14,
    backgroundColor: '#525d6e',
    borderRadius: 3,
  },

  wareBody: {
    width: 124,
    height: 66,
    backgroundColor: '#7a8699',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 5,
  },

  wareDoor: {
    width: 30,
    height: 44,
    backgroundColor: '#3d4450',
    borderRadius: 2,
  },

  wareBoxes: {
    justifyContent: 'flex-end',
  },

  wareBox: {
    width: 20,
    height: 20,
    backgroundColor: '#b98a4a',
    borderRadius: 2,
    marginTop: 2,
  },

  bankRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 55,
    borderRightWidth: 55,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#9aa5b1',
  },

  bankSign: {
    backgroundColor: '#e8b93c',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 3,
    marginVertical: 3,
  },

  bankSignText: {
    color: '#111111',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 2,
  },

  bankBody: {
    width: 120,
    height: 46,
    backgroundColor: '#8e99a6',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },

  bankCol: {
    width: 12,
    height: 40,
    backgroundColor: '#c7cfd8',
    borderRadius: 2,
  },

  bankBase: {
    width: 124,
    height: 8,
    backgroundColor: '#6e7885',
    borderRadius: 2,
    marginTop: 2,
  },

  awning: {
    flexDirection: 'row',
    width: 120,
    height: 16,
    borderRadius: 3,
    overflow: 'hidden',
  },

  awnStripe: {
    flex: 1,
  },

  storeBody: {
    width: 120,
    height: 60,
    backgroundColor: '#a8b5c4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },

  storeWin: {
    width: 62,
    height: 32,
    backgroundColor: '#ffe9a8',
    borderRadius: 2,
    marginBottom: 6,
  },

  storeDoor: {
    width: 22,
    height: 42,
    backgroundColor: '#4a5560',
    borderRadius: 2,
  },

  cityDeco: {
    position: 'absolute',
    alignItems: 'center',
  },

  treeTop: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2f7a3d',
  },

  treeTrunk: {
    width: 8,
    height: 14,
    backgroundColor: '#6b4a2f',
    marginTop: -4,
  },

  cityLamp: {
    position: 'absolute',
    alignItems: 'center',
  },

  lampGlow: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ffe9a8',
  },

  lampPole: {
    width: 5,
    height: 34,
    backgroundColor: '#3a4656',
    marginTop: -2,
  },

  cityBench: {
    position: 'absolute',
    alignItems: 'center',
  },

  benchSeat: {
    width: 44,
    height: 8,
    backgroundColor: '#8a5f3c',
    borderRadius: 3,
  },

  benchLegs: {
    flexDirection: 'row',
    width: 36,
    justifyContent: 'space-between',
  },

  benchLeg: {
    width: 5,
    height: 10,
    backgroundColor: '#5a3d24',
  },

  packageWrap: {
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  targetOn: {
    borderColor: GOLD,
    borderStyle: 'dashed',
  },

  dropActive: {
    backgroundColor: 'rgba(232, 185, 60, 0.15)',
  },

  /* LOOKPASS_V1: look-pass styles. */
  /* Visual only. */
  bgFill: {
    flex: 1,
  },

  safeArt: {
    backgroundColor: 'transparent',
  },

  goldRule: {
    height: 2,
    width: 120,
    backgroundColor: GOLD,
    marginTop: 6,
    borderRadius: 1,
  },

  statIcon: {
    width: 20,
    height: 20,
    marginBottom: 3,
  },

  /* CITYLAYOUT_V1: smaller building icon. */
  bldgIcon: {
    /* POLISH_V1_ICON: bigger building icons (about 2x). */
    width: 104,
    height: 104,
  },

  iconRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },

  iconImg: {
    width: 44,
    height: 44,
  },

  productBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  productIcon: {
    width: 30,
    height: 30,
  },

  ownedIcon: {
    width: 24,
    height: 24,
  },

  /* HARLEY_V1_STYLE: bike pictures are wide (1920x1280), so the list
   * thumb is wide and the detail picture is full-width. */
  bikeThumb: {
    width: 90,
    height: 60,
  },

  bikeDetailImage: {
    width: '100%',
    height: 200,
  },

  /* CASINO_V1_STYLE: slot reels show big, in white so they read on
   * the dark store backdrop. */
  slotReel: {
    color: '#ffffff',
    fontSize: 44,
    textAlign: 'center',
  },

  /* TRANSIT_V1_CASINO_FIX_STYLE: the casino result message was hard to read
   * (small muted-grey body text on a dark backdrop). Results now show
   * large, bold, white. */
  casinoResult: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 26,
  },

  /* GOALS_GATE_V1_STYLE: unmet life goals render dimmed (same size as
   * body, darker grey) so a new player can read the requirements but
   * sees at a glance they are not yet met. */
  goalUnmet: {
    color: '#67798c',
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 26,
  },

  /* TRANSIT_V1_STYLE: the current stop reads clearly on the route list. */
  transitStopCurrent: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 26,
  },
});
