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
  TextInput, /* SAVINGS_GOALS_V1_E08_IMPORT: the SAVINGS GOALS form's name and target fields. */
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

/* BUILDINGS_V1_E01_ART: Lori's pixel-art buildings, prepared
 * at 512px in assets/buildings/. Map art only -- no game text,
 * price, or rule lives here. */
const BUILDINGS_V1_ART = {
  home: require('./assets/buildings/home.png'),
  bank: require('./assets/buildings/bank.png'),
  store: require('./assets/buildings/store.png'),
  transit: require('./assets/buildings/transit.png'),
  dealership: require('./assets/buildings/dealership.png'),
  casino: require('./assets/buildings/casino.png'),
  work: require('./assets/buildings/work.png'),
  park: require('./assets/buildings/park.png'),
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
  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1, housing: 'none', jobId: 'none', inventory: [], /* CHAPTER3_BIZ_V1: new save fields. */ ownedBusinesses: [], /* BUSINESS_UPGRADES_V1_E04_INITIAL: new save field. */ businessUpgrades: [], hours: 8, bizWork: {}, businessUnlocked: false, /* CHAPTER3_INV_V1: new save fields. */ savingsPeak: 0, bondOwned: false, fundOwned: false, fundValue: 1000, fundCycle: 0, propertiesOwned: [], lastInvestPayday: -1, investmentsUnlocked: false, /* HARLEY_V1_INITIAL: new save field. */ ownedBikes: [], /* TRANSIT_V1_SAVE: new save fields. */ transitEmployment: 'none', transitTraining: 'incomplete', transitBus: null, transitStop: 0, transitAboard: 0, transitBoarded: false, transitShiftActive: false, /* DAILY_LIMIT_V1: new save fields. */ earnedToday: 0, earnedTodayDay: 0, /* COINS_V1_E01_INITIAL: new save fields. */ goalCoinsPaid: [], shiftsThisWeek: 0, shiftsWeekKey: -1, lastShiftBonusWeek: -1, /* COIN_SHOP_V1_E02_INITIAL: new save fields. */ ownedOutfits: ['default'], wornOutfit: 'default', /* HOME_DECOR_V1_E02_INITIAL: new save fields. */ ownedDecorations: [], placedDecorations: [], /* MY_GARAGE_V1_E02_INITIAL: new save field. */ displayBike: null, /* BIKE_COLORS_V1_E02_INITIAL: new save fields. */ ownedBikeColors: ['factory'], appliedBikeColor: 'factory', /* MY_MONEY_V1_E02_INITIAL: new save field. */ lastFridayReport: null, /* MONEY_HISTORY_V1_E02_INITIAL: new save field. */ moneyHistory: [], /* SAVINGS_GOALS_V1_E02_INITIAL: new save field. */ savingsGoal: null, /* EXPLORE_CITY_V1_E02_INITIAL: new save fields. */ playerPos: null, ridingBike: null, /* CITY_JOBS_V1_E02_INITIAL: new save fields. */ activeMission: null, deliveryDay: -1, deliveryCount: 0, /* MY_HOME_INTERIOR_V1_E02_INITIAL: new save field. */ homeLayout: null, /* FURNITURE_STORE_V1_E02_INITIAL: new save field. */ ownedFurniture: []
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
/* BUSINESS_UPGRADES_V1_E01_TABLE: each business also carries its
 * one buy-once upgrade (name, cost from savings, upgraded pay). */
const BUSINESSES = [
  { id: 'hauling', name: 'Hauling Service', price: 1500, pay: 180, jobHours: 2, upgradeName: 'Heavy-Duty Truck', upgradeCost: 1100, upgradePay: 270 },
  { id: 'cleaning', name: 'Cleaning Service', price: 1200, pay: 120, jobHours: 2, upgradeName: 'Pro Cleaning Crew', upgradeCost: 900, upgradePay: 180 },
  { id: 'foodstand', name: 'Food Stand', price: 2000, pay: 200, jobHours: 2, upgradeName: 'Second Grill', upgradeCost: 1500, upgradePay: 300 },
];

function normalizeOwnedBusinesses(value) {
  return Array.isArray(value)
    ? BUSINESSES.filter((biz) => value.includes(biz.id)).map((biz) => biz.id)
    : [];
}

/* BUSINESS_UPGRADES_V1_E02_NORMALIZE: owned business upgrades are a
 * list of business ids; anything else (older saves, bad values)
 * normalizes to no upgrades. */
function normalizeBusinessUpgrades(value) {
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

/* BUSINESS_UPGRADES_V1_E03_HELPERS: the one effective-pay rule for
 * a business -- the upgraded rate when its upgrade is owned, the
 * base rate otherwise. The job award, the daily-limit check and the
 * WORK screen all read pay through here so they can never disagree. */
function businessPay(biz, upgrades) {
  return upgrades && upgrades.includes(biz.id) ? biz.upgradePay : biz.pay;
}

function purchaseBusinessUpgrade(savings, owned, upgrades, businessId) {
  const biz = BUSINESSES.find((entry) => entry.id === businessId);
  if (!biz) return { ok: false, message: 'This upgrade is unavailable.' };
  if (!owned.includes(biz.id))
    return { ok: false, message: 'You need to own ' + biz.name + ' before upgrading it.' };
  if (upgrades.includes(biz.id))
    return { ok: false, message: biz.name + ' already has the ' + biz.upgradeName + ' upgrade.' };
  if (!Number.isFinite(savings) || savings < biz.upgradeCost)
    return { ok: false, message: 'Not enough saved. ' + biz.upgradeName + ' costs $' + biz.upgradeCost + ' in savings.' };
  return {
    ok: true,
    savings: savings - biz.upgradeCost,
    upgrades: [...upgrades, biz.id],
    message: 'You bought the ' + biz.upgradeName + ' upgrade for ' + biz.name + ' for $' + biz.upgradeCost + ' from savings. Every job now pays $' + biz.upgradePay + '.',
  };
}

/* COIN_SHOP_V1_E01_TABLE_HELPERS: cosmetic outfits, bought with
 * coins in the COIN SHOP (Lori's names and prices, approved by
 * Zabby 2026-11-05). Cosmetic ONLY: an outfit is the two colors
 * PlayerFigure draws for the player -- shirt (the body) and legs.
 * The starting outfit's colors are the figure's original colors
 * (#e8b93c shirt, #2b3442 legs), so a player who buys nothing
 * looks exactly as before. Owning is forever; wearing is free.
 * Decorations and bike colors are a later build -- not here. */
const OUTFITS = [
  { id: 'default', name: 'Everyday (starting outfit)', price: 0, shirt: '#e8b93c', legs: '#2b3442' },
  { id: 'green', name: 'Everyday Green', price: 5, shirt: '#2f9e44', legs: '#2b3442' },
  { id: 'blue', name: 'Street Rider Blue', price: 10, shirt: '#2f6fd0', legs: '#2b3442' },
  { id: 'blackgold', name: 'Black & Gold', price: 15, shirt: '#16181d', legs: '#e8b93c' },
];
const DEFAULT_OUTFIT_ID = 'default';

function outfitById(outfitId) {
  return OUTFITS.find((entry) => entry.id === outfitId) || OUTFITS[0];
}

/* COIN_SHOP_V1: owned outfits are a list of outfit ids in table
 * order; anything else (older saves, bad values) normalizes to
 * just the starting outfit, which is always owned. The worn
 * outfit must be owned, else it falls back to the starting
 * outfit. Neither normalizer touches coins or any other field. */
function normalizeOwnedOutfits(value) {
  const owned = Array.isArray(value)
    ? OUTFITS.filter((outfit) => value.includes(outfit.id)).map((outfit) => outfit.id)
    : [];
  if (!owned.includes(DEFAULT_OUTFIT_ID)) owned.unshift(DEFAULT_OUTFIT_ID);
  return owned;
}

function normalizeWornOutfit(value, owned) {
  return Array.isArray(owned) && owned.includes(value) ? value : DEFAULT_OUTFIT_ID;
}

/* COIN_SHOP_V1: pure buy gate in the purchaseBusinessUpgrade
 * style. Coins ONLY -- cash, savings, credit and XP are never
 * read or written here, and a purchase is spending, not earning,
 * so the daily earnings limit is not involved. The handler
 * writes the returned ABSOLUTE coins and owned list, so two
 * calls in one batch (a double-tap) compute the same result and
 * the outfit is charged for exactly once; once owned, every
 * later call is a no-op. Buying does NOT wear the outfit -- the
 * player taps WEAR. */
function purchaseOutfit(coins, owned, outfitId) {
  const outfit = OUTFITS.find((entry) => entry.id === outfitId);
  if (!outfit) return { ok: false, message: 'This outfit is unavailable.' };
  if (owned.includes(outfit.id))
    return { ok: false, message: 'You already own ' + outfit.name + '.' };
  if (!Number.isFinite(coins) || coins < outfit.price)
    return { ok: false, message: 'Not enough coins. ' + outfit.name + ' costs ' + outfit.price + ' coins.' };
  return {
    ok: true,
    coins: coins - outfit.price,
    owned: [...owned, outfit.id],
    message: 'You bought ' + outfit.name + ' for ' + outfit.price + ' coins. Tap WEAR to put it on.',
  };
}

/* BIKE_COLORS_V1_E01_TABLE_HELPERS: bike colors, bought with
 * coins in MY GARAGE (Lori's names and prices, approved by
 * Zabby 2026-11-05). Cosmetic ONLY, and garage ONLY -- colors
 * are not sold in the COIN SHOP and never touch the
 * dealership photos. A color is the paint for the garage's
 * drawn bike: tank and body are the two main-paint parts,
 * accent is the wheel hubs. The factory row reproduces the
 * drawing's original literals exactly (gold tank #e8b93c,
 * steel body bar #5b6b7f, gold hubs #e8b93c), so a player who
 * buys nothing sees the identical bike. The wheels, seat,
 * fork and handlebar keep their steel/dark colors in every
 * row. Owning is forever; applying is free. */
const BIKE_COLORS = [
  { id: 'factory', name: 'Factory Steel', price: 0, tank: '#e8b93c', body: '#5b6b7f', accent: '#e8b93c' },
  { id: 'green', name: 'Green', price: 5, tank: '#2f9e44', body: '#1f7a33', accent: '#e8b93c' },
  { id: 'blue', name: 'Blue', price: 10, tank: '#2f6fd0', body: '#245aa8', accent: '#e8b93c' },
  { id: 'blackgold', name: 'Black & Gold', price: 15, tank: '#16181d', body: '#16181d', accent: '#e8b93c' },
];
const DEFAULT_BIKE_COLOR_ID = 'factory';

function bikeColorById(colorId) {
  return BIKE_COLORS.find((entry) => entry.id === colorId) || BIKE_COLORS[0];
}

/* MONEY_HISTORY_V1_E01_HELPERS: the persisted transaction
 * history behind the MONEY HISTORY screen at the BANK.
 * Entries are recorded ONLY by the game's real money
 * handlers, inside their success paths and after their
 * guards, with the exact amounts those handlers just moved
 * (see the MONEY_HISTORY_V1_E08..E17 hook call sites).
 * Recording never changes an amount, a guard or a latch:
 * blocked or unaffordable attempts return before the log
 * call, exactly-once handlers (collect, sign lease, the
 * Friday payout latch) keep the log exactly-once too, and
 * pending wages are never logged -- wages enter the
 * history once, when the paycheck is COLLECTED.
 *
 * Entry shape: { day, kind, label, amount, balance }.
 * day is the game day counter (the screen renders the
 * weekday through DAY_NAMES[day % 7], the game's own
 * convention). amount is a positive number; direction is
 * conveyed by kind: paycheck / rent / bond are money in,
 * purchase is money out, deposit / withdrawal are
 * transfers between cash and savings (balance 'transfer')
 * -- a transfer is never income and never spending.
 * balance is 'cash' | 'savings' | 'transfer': the balance
 * that changed.
 *
 * The list is newest first, capped at 100 stored entries
 * (MONEY_HISTORY_LIMIT); the screen shows the first 25
 * (visibleHistory). Older saves have no history and start
 * empty: history is never invented. Coin purchases move
 * no cash or savings and are never logged; neither are
 * casino results, business-job or shift earnings (they
 * arrive via the paycheck), life-event cash, property
 * sale proceeds, bond/fund buying or sell-backs, or the
 * Growth Fund. */
const MONEY_HISTORY_LIMIT = 100;
const MONEY_HISTORY_SHOWN = 25;
const MONEY_HISTORY_KINDS = ['paycheck', 'rent', 'bond', 'deposit', 'withdrawal', 'purchase', 'job']; /* CITY_JOBS_V1_E01_KINDS: 'job' = mission payouts (business missions + motorcycle deliveries), recorded only by the new CITY_JOBS completion handlers through the shipped addHistoryEntry. */
const MONEY_HISTORY_BALANCES = ['cash', 'savings', 'transfer'];

function normalizeHistoryEntry(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null;
  if (!Number.isInteger(value.day) || value.day < 0)
    return null;
  if (!MONEY_HISTORY_KINDS.includes(value.kind))
    return null;
  if (!MONEY_HISTORY_BALANCES.includes(value.balance))
    return null;
  if (typeof value.label !== 'string' || value.label.trim() === '')
    return null;
  if (!Number.isFinite(value.amount) || value.amount <= 0)
    return null;
  return {
    day: value.day,
    kind: value.kind,
    label: value.label,
    amount: value.amount,
    balance: value.balance,
  };
}

function normalizeMoneyHistory(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const entry of value) {
    const valid = normalizeHistoryEntry(entry);
    if (valid) out.push(valid);
    if (out.length >= MONEY_HISTORY_LIMIT) break;
  }
  return out;
}

/* MONEY_HISTORY_V1_E01_ADD: prepend one entry (newest
 * first) and cap the stored list at MONEY_HISTORY_LIMIT,
 * dropping the oldest beyond it. A malformed entry
 * changes nothing. */
function addHistoryEntry(history, entry) {
  const list = normalizeMoneyHistory(history);
  const valid = normalizeHistoryEntry(entry);
  if (!valid) return list;
  return [valid, ...list].slice(0, MONEY_HISTORY_LIMIT);
}

/* MONEY_HISTORY_V1_E01_VISIBLE: the slice the MONEY
 * HISTORY screen renders -- the newest
 * MONEY_HISTORY_SHOWN entries, in stored (newest-first)
 * order. */
function visibleHistory(history) {
  return normalizeMoneyHistory(history).slice(0, MONEY_HISTORY_SHOWN);
}

/* MONEY_HISTORY_V1_E01_LINES: how one entry reads on
 * screen. The weekday follows the game's own convention
 * (DAY_NAMES[day % 7], day 0 a Monday). Money in carries
 * a '+', a purchase a '-', and a transfer a plain amount
 * with a Transfer balance line, so a transfer can never
 * be mistaken for income or spending. */
function historyEntryLines(entry) {
  const dayText = DAY_NAMES[entry.day % 7];
  const amountText = entry.kind === 'purchase'
    ? '-$' + entry.amount
    : entry.balance === 'transfer'
      ? '$' + entry.amount
      : '+$' + entry.amount;
  const balanceText = entry.balance === 'cash'
    ? 'Cash'
    : entry.balance === 'savings'
      ? 'Savings'
      : entry.kind === 'deposit'
        ? 'Transfer: Cash to Savings'
        : 'Transfer: Savings to Cash';
  return { dayText: dayText, amountText: amountText, balanceText: balanceText };
}

/* SAVINGS_GOALS_V1_E01_HELPERS: the one savings goal
 * behind the SAVINGS GOALS screen in BANK. A goal is
 * { category, name, target }: one of the four categories
 * below, a player-chosen name, and a positive whole-dollar
 * target. The goal is a DISPLAY marker only: it tracks the
 * existing savings balance and never moves, holds or
 * reserves money. Progress is a pure function of the live
 * savings balance (goalProgress below), so deposits and
 * withdrawals update it automatically, reaching the target
 * never latches (savings dropping back below the target
 * shows the lower progress again), and setting, editing or
 * removing a goal touches nothing but the savingsGoal save
 * field itself. Older saves have no goal (null) and the
 * screen invites the player to set their first one. */
const SAVINGS_GOAL_CATEGORIES = ['Emergency Fund', 'Motorcycle', 'Property', 'Custom'];

/* SAVINGS_GOALS_V1_E01_NORMALIZE: a stored goal survives
 * a reopen only if it is well-formed: the category is one
 * of the four, the target is a positive whole-dollar
 * amount, and the name is a non-empty string -- a blank or
 * missing name falls back to the category name, the same
 * fallback the form applies on save. Anything else is not
 * a goal: null. */
function normalizeSavingsGoal(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null;
  if (!SAVINGS_GOAL_CATEGORIES.includes(value.category))
    return null;
  if (!Number.isInteger(value.target) || value.target <= 0)
    return null;
  const name = typeof value.name === 'string' && value.name.trim() !== ''
    ? value.name.trim()
    : value.category;
  return { category: value.category, name: name, target: value.target };
}

/* SAVINGS_GOALS_V1_E01_TARGET: parse the form's target
 * field. Only a positive whole-dollar amount is accepted:
 * the trimmed text must be digits only (so "10.50",
 * "-500", "abc" and "" all fail before parsing), greater
 * than zero, and a safe integer. Returns the amount, or
 * null when the entry is not a valid target. */
function parseSavingsGoalTarget(text) {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const amount = parseInt(trimmed, 10);
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  return amount;
}

/* SAVINGS_GOALS_V1_E01_VALIDATE: the SAVE GOAL gate. A
 * valid form becomes the player's one goal (replacing any
 * existing goal); an invalid target returns an error
 * message and NO goal, so a failed save leaves any
 * existing goal untouched. A blank name is not an error:
 * it falls back to the category name, matching the load
 * normalizer. */
function validateSavingsGoalForm(category, name, targetText) {
  if (!SAVINGS_GOAL_CATEGORIES.includes(category))
    return { ok: false, error: 'Choose a goal category.' };
  const target = parseSavingsGoalTarget(targetText);
  if (target === null)
    return { ok: false, error: 'Enter a target above $0, in whole dollars (no cents).' };
  const finalName = typeof name === 'string' && name.trim() !== ''
    ? name.trim()
    : category;
  return { ok: true, goal: { category: category, name: finalName, target: target } };
}

/* SAVINGS_GOALS_V1_E01_PROGRESS: progress is a pure
 * function of the live savings balance and the goal --
 * nothing is stored, so nothing can latch. percent is
 * floored and capped at 100; left never drops below $0;
 * reached is simply savings at or above the target right
 * now. */
function goalProgress(savings, goal) {
  if (!goal) return { percent: 0, left: 0, reached: false };
  const percent = Math.min(100, Math.floor(savings / goal.target * 100));
  const left = Math.max(0, goal.target - savings);
  return { percent: percent, left: left, reached: savings >= goal.target };
}

/* MY_MONEY_V1_E01_HELPERS: the LAST FRIDAY income report
 * behind the MY MONEY screen in BANK. The recorders below
 * are PURE and record-only: the game's real payment moments
 * (the Friday payroll effect, the Friday investment /
 * property effect, and COLLECT PAYCHECK) call them with the
 * exact amounts those handlers just moved, and store the
 * result in the persisted lastFridayReport field. No
 * recorder pays, collects or moves anything; bank
 * transfers, purchases and property sales are never
 * recorded, and the Growth Fund's value change is not cash
 * and is never recorded.
 *
 * Report shape: { day, wagesDue, wagesCollectedAmount,
 * rentPaid, bondPaid }. day is the game day counter of the
 * Friday the report belongs to: a recorder call with a
 * newer day starts a fresh report and a call with the same
 * day merges into it, so one Friday's payroll and payout
 * land in ONE report whichever fires first. wagesDue is
 * every wage dollar that became payable that Friday (the
 * payroll effect can move a second same-Friday batch after
 * a Friday shift; it adds). rentPaid and bondPaid are set
 * by the payout, which the lastInvestPayday latch already
 * makes exactly-once per Friday.
 *
 * COLLECT PAYCHECK moves the whole paycheck balance at
 * once, and an uncollected paycheck stacks into that
 * balance across Fridays -- so recordPaycheckCollected
 * credits only the part that is this report's own
 * outstanding wages (min(amount, wagesDue -
 * wagesCollectedAmount)). The report's received total
 * therefore counts its own Friday's wages exactly once,
 * and a repeated collect call changes nothing. */
function normalizeFridayAmount(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function emptyFridayReport(day) {
  return {
    day: day,
    wagesDue: 0,
    wagesCollectedAmount: 0,
    rentPaid: 0,
    bondPaid: 0,
  };
}

function normalizeLastFridayReport(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null;
  if (!Number.isInteger(value.day) || value.day < 0)
    return null;
  const wagesDue = normalizeFridayAmount(value.wagesDue);
  return {
    day: value.day,
    wagesDue: wagesDue,
    wagesCollectedAmount: Math.min(
      normalizeFridayAmount(value.wagesCollectedAmount), wagesDue),
    rentPaid: normalizeFridayAmount(value.rentPaid),
    bondPaid: normalizeFridayAmount(value.bondPaid),
  };
}

function recordFridayPayroll(report, day, wagesAmount) {
  const current = report && report.day === day
    ? report
    : emptyFridayReport(day);
  return {
    ...current,
    wagesDue: current.wagesDue + normalizeFridayAmount(wagesAmount),
  };
}

function recordFridayPayout(report, day, rentAmount, bondAmount) {
  const current = report && report.day === day
    ? report
    : emptyFridayReport(day);
  return {
    ...current,
    rentPaid: normalizeFridayAmount(rentAmount),
    bondPaid: normalizeFridayAmount(bondAmount),
  };
}

function recordPaycheckCollected(report, amount) {
  if (!report) return report;
  const outstanding = report.wagesDue - report.wagesCollectedAmount;
  if (outstanding <= 0) return report;
  const add = Math.min(normalizeFridayAmount(amount), outstanding);
  if (add <= 0) return report;
  return {
    ...report,
    wagesCollectedAmount: report.wagesCollectedAmount + add,
  };
}

/* MY_MONEY_V1_E01_TOTALS: what the report means in money.
 * Received is cash that actually landed: rent and the bond
 * pay straight into cash on Friday, and job pay counts only
 * once its paycheck is collected. Waiting is job pay still
 * sitting in the available paycheck. Waiting money is never
 * inside received. */
function fridayReportTotals(report) {
  if (!report) return { received: 0, waiting: 0 };
  return {
    received: report.rentPaid + report.bondPaid
      + report.wagesCollectedAmount,
    waiting: Math.max(
      0, report.wagesDue - report.wagesCollectedAmount),
  };
}

/* BIKE_COLORS_V1: owned bike colors are a list of color ids
 * in table order; anything else (older saves, bad values)
 * normalizes to just the factory color, which is always
 * owned. The applied color must be owned, else it falls
 * back to the factory color. Neither normalizer touches
 * coins or any other field. */
function normalizeOwnedBikeColors(value) {
  const owned = Array.isArray(value)
    ? BIKE_COLORS.filter((color) => value.includes(color.id)).map((color) => color.id)
    : [];
  if (!owned.includes(DEFAULT_BIKE_COLOR_ID)) owned.unshift(DEFAULT_BIKE_COLOR_ID);
  return owned;
}

function normalizeAppliedBikeColor(value, owned) {
  return Array.isArray(owned) && owned.includes(value) ? value : DEFAULT_BIKE_COLOR_ID;
}

/* BIKE_COLORS_V1: pure buy gate in the purchaseOutfit style.
 * Coins ONLY -- cash, savings, credit and XP are never read
 * or written here, and a purchase is spending, not earning,
 * so the daily earnings limit is not involved. The handler
 * writes the returned ABSOLUTE coins and owned list, so two
 * calls in one batch (a double-tap) compute the same result
 * and the color is charged for exactly once; once owned,
 * every later call is a no-op. Buying does NOT apply the
 * color -- the player taps APPLY. */
function purchaseBikeColor(coins, owned, colorId) {
  const color = BIKE_COLORS.find((entry) => entry.id === colorId);
  if (!color) return { ok: false, message: 'This color is unavailable.' };
  if (owned.includes(color.id))
    return { ok: false, message: 'You already own ' + color.name + '.' };
  if (!Number.isFinite(coins) || coins < color.price)
    return { ok: false, message: 'Not enough coins. ' + color.name + ' costs ' + color.price + ' coins.' };
  return {
    ok: true,
    coins: coins - color.price,
    owned: [...owned, color.id],
    message: 'You bought ' + color.name + ' for ' + color.price + ' coins. Tap APPLY to paint your bike.',
  };
}

/* GARAGE_PHOTO_V1_E01_FRAME_HELPER: in MY GARAGE the
 * applied bike color dresses the display stage's frame --
 * this pure helper resolves an applied BIKE_COLORS row to
 * the stage border color (frame) and the bike-name color
 * (name). The factory row resolves to the stage's original
 * border literal and the name style's original GOLD, so a
 * player who buys no color sees the identical frame. Green
 * and Blue use the row's main paint (its tank color). Black
 * & Gold uses the row's gold accent for both: its paint is
 * near-black and would not read as a frame on the dark
 * screen. A missing or unknown row resolves as factory.
 * Display only -- no balance is read or written here. */
function garageFrameColors(colorRow) {
  if (!colorRow || colorRow.id === 'factory') {
    return { frame: 'rgba(245, 197, 66, 0.65)', name: GOLD };
  }
  if (colorRow.id === 'blackgold') {
    return { frame: colorRow.accent, name: colorRow.accent };
  }
  return { frame: colorRow.tank, name: colorRow.tank };
}

/* HOME_DECOR_V1_E01_TABLE_HELPERS: room decorations, bought
 * with coins in MY HOME (Lori's names and prices, approved by
 * Zabby 2026-11-05). Cosmetic ONLY: a decoration is drawn in
 * the room preview once it is PLACED; owning is forever, and
 * placing/removing are free. chip/chip2 are the two colors the
 * shop list previews for each piece (foliage + pot, rug blue +
 * trim, sofa black + gold). */
const DECORATIONS = [
  { id: 'plant', name: 'Green houseplant', price: 5, chip: '#2f9e44', chip2: '#7a5230' },
  { id: 'rug', name: 'Blue rug', price: 10, chip: '#2f6fd0', chip2: '#7fb2e5' },
  { id: 'sofa', name: 'Black-and-gold sofa', price: 15, chip: '#16181d', chip2: '#e8b93c' },
];

function decorationById(decorationId) {
  return DECORATIONS.find((entry) => entry.id === decorationId) || DECORATIONS[0];
}

/* HOME_DECOR_V1: MY HOME unlocks when the player is housed --
 * the lease is signed. housing holds HOUSING_GOAL.key
 * ('room_rental') once signLease runs and 'none' before; the
 * load whitelist admits exactly those two values, so this one
 * comparison is the whole gate. It is read by the MY HOME
 * screen and nowhere else. */
function isHoused(housing) {
  return housing === HOUSING_GOAL.key;
}

/* HOME_DECOR_V1: owned decorations are a list of decoration
 * ids in table order; anything else (older saves, bad values)
 * normalizes to an empty list. Placed decorations normalize
 * the same way and are then filtered to owned ids, so placed
 * is always a subset of owned. Neither normalizer touches
 * coins or any other field. */
function normalizeOwnedDecorations(value) {
  return Array.isArray(value)
    ? DECORATIONS.filter((decoration) => value.includes(decoration.id)).map((decoration) => decoration.id)
    : [];
}

function normalizePlacedDecorations(value, owned) {
  const placed = Array.isArray(value)
    ? DECORATIONS.filter((decoration) => value.includes(decoration.id)).map((decoration) => decoration.id)
    : [];
  return Array.isArray(owned) ? placed.filter((id) => owned.includes(id)) : [];
}

/* HOME_DECOR_V1: pure buy gate in the purchaseOutfit style.
 * Coins ONLY -- cash, savings, credit and XP are never read or
 * written here, and a purchase is spending, not earning, so
 * the daily earnings limit is not involved. The handler
 * writes the returned ABSOLUTE coins and owned list, so two
 * calls in one batch (a double-tap) compute the same result
 * and the decoration is charged for exactly once; once owned,
 * every later call is a no-op. Buying does NOT place the
 * decoration -- the player taps PLACE. */
function purchaseDecoration(coins, owned, decorationId) {
  const decoration = DECORATIONS.find((entry) => entry.id === decorationId);
  if (!decoration) return { ok: false, message: 'This decoration is unavailable.' };
  if (owned.includes(decoration.id))
    return { ok: false, message: 'You already own ' + decoration.name + '.' };
  if (!Number.isFinite(coins) || coins < decoration.price)
    return { ok: false, message: 'Not enough coins. ' + decoration.name + ' costs ' + decoration.price + ' coins.' };
  return {
    ok: true,
    coins: coins - decoration.price,
    owned: [...owned, decoration.id],
    message: 'You bought ' + decoration.name + ' for ' + decoration.price + ' coins. Tap PLACE to put it in your room.',
  };
}

/* FURNITURE_STORE_V1_E01_CATALOG: the Store's Furniture
 * section -- seven pieces for the living room, bought with
 * CASH at Zabby's prices (Nov 5, 2026). kind says where a
 * piece lives: 'floor' pieces hold one of the nine floor
 * spots, the 'rug' is the non-occupying floor layer (the
 * SAME piece as the HOME_DECOR_V1 coin decoration -- see
 * ownsPiece below), and 'layer' pieces each own one wall
 * slot in HOME_SLOTS. chip/chip2 are the two preview colors
 * the shop list shows; glyph is its preview emoji. Buying
 * never places a piece; placing is free in MY HOME's
 * DECORATE mode. */
const FURNITURE = [
  { id: 'rug', name: 'Blue Rug', price: 100, kind: 'rug', glyph: '🟦', chip: '#2f6fd0', chip2: '#7fb2e5' },
  { id: 'curtains', name: 'Blue Curtains', price: 80, kind: 'layer', glyph: '🟦', chip: '#2f6fd0', chip2: '#bcd8f2' },
  { id: 'lamp', name: 'Floor Lamp', price: 75, kind: 'floor', glyph: '🪔', chip: '#f5c542', chip2: '#57b6ff' },
  { id: 'wall_art', name: 'Modern Wall Art', price: 120, kind: 'layer', glyph: '🖼️', chip: '#9fc6ee', chip2: '#f5c542' },
  { id: 'accent_light', name: 'Blue Accent Lighting', price: 150, kind: 'layer', glyph: '✨', chip: '#57b6ff', chip2: '#2f6fd0' },
  { id: 'armchair', name: 'Blue Armchair', price: 200, kind: 'floor', glyph: '🛋️', chip: '#2f6fd0', chip2: '#7fb2e5' },
  { id: 'bookshelf', name: 'Bookshelf', price: 250, kind: 'floor', glyph: '📚', chip: '#7a5230', chip2: '#f5c542' },
];

function furnitureById(itemId) {
  return FURNITURE.find((entry) => entry.id === itemId) || null;
}

/* FURNITURE_STORE_V1_E01_NORMALIZE: owned furniture is a
 * list of FURNITURE ids in table order; anything else
 * (older saves, bad values) normalizes to an empty list. */
function normalizeFurniture(value) {
  return Array.isArray(value)
    ? FURNITURE.filter((item) => value.includes(item.id)).map((item) => item.id)
    : [];
}

/* FURNITURE_STORE_V1_E01_OWNS: the one ownership rule for
 * room pieces. Starters are always owned; a decoration is
 * owned from ownedDecorations; a furniture piece is owned
 * from ownedFurniture -- and the Blue Rug is ONE piece with
 * two doors, so it reads owned when EITHER list holds it.
 * The fields stay separate in the save; every reader (the
 * shop, the decorate tray, the layout helpers) goes through
 * here so the two lists can never disagree about what the
 * player owns. */
function ownsPiece(pieceId, ownedDecorations, ownedFurniture) {
  const piece = homePieceById(pieceId);
  if (!piece) return false;
  if (piece.starter) return true;
  if (Array.isArray(ownedDecorations) && ownedDecorations.includes(pieceId)) return true;
  if (Array.isArray(ownedFurniture) && ownedFurniture.includes(pieceId)) return true;
  return false;
}

/* FURNITURE_STORE_V1_E01_GATE: pure buy gate in the
 * purchaseStoreItem style. CASH ONLY -- savings, credit,
 * coins and XP are never read or written here, and a
 * purchase is spending, not earning, so the daily earnings
 * limit is not involved. Already-owned is checked against
 * the union (ownsPiece), so the rug bought with coins can
 * never be charged for again in cash, or the other way
 * round. The handler writes the returned ABSOLUTE cash and
 * owned list, so a double confirm computes the same result
 * and the piece is charged for exactly once. */
function purchaseFurniture(cash, ownedFurniture, ownedDecorations, itemId) {
  const item = furnitureById(itemId);
  if (!item) return { ok: false, message: 'This item is unavailable.' };
  if (ownsPiece(item.id, ownedDecorations, ownedFurniture))
    return { ok: false, message: 'You already own ' + item.name + '.' };
  if (!Number.isFinite(cash) || cash < item.price)
    return { ok: false, message: 'Not enough cash. ' + item.name + ' costs $' + item.price + '.' };
  return {
    ok: true,
    cash: cash - item.price,
    ownedFurniture: [...normalizeFurniture(ownedFurniture), item.id],
    message: 'You bought ' + item.name + ' for $' + item.price + '. Place it free from MY HOME — DECORATE.',
  };
}

/* MY_HOME_INTERIOR_V1_E01_TABLES_HELPERS: the walk-in living
 * room. HOME_SPOTS are the six fixed floor spots (3 wide x 2
 * deep); HOME_PIECES are the two starter pieces that come
 * with the room plus the three HOME_DECOR_V1 decorations
 * (same ids and names -- DECORATIONS above stays the price
 * table; a piece here only says whether it is a starter and
 * where it sits by default). homeLayout is the single source
 * of truth for placement: { pieceId: spotId }. The RUG is a
 * floor layer: it has a spot but never occupies it, so any
 * piece may share the rug's spot (drawn under it). Every
 * other piece holds its spot alone. All helpers are pure. */
/* FURNITURE_STORE_V1_E03_SPOTS_PIECES: the floor grows
 * from six spots to nine -- the shipped six keep their ids
 * and their grid positions (a stored layout, like a sofa
 * saved By the Window, never moves), and three more join
 * the front row: West Corner, Entry Nook, East Corner.
 * HOME_SLOTS are the wall homes of the three layer pieces:
 * each layer piece fits ONLY its own slot, and slots never
 * collide with floor spots or with each other. */
const HOME_SPOTS = [
  { id: 'window', name: 'By the Window' },
  { id: 'center_back', name: 'Center Back' },
  { id: 'tv_side', name: 'By the TV' },
  { id: 'nook', name: 'Reading Nook' },
  { id: 'center_front', name: 'Center Front' },
  { id: 'door', name: 'By the Door' },
  { id: 'corner_west', name: 'West Corner' },
  { id: 'entry', name: 'Entry Nook' },
  { id: 'corner_east', name: 'East Corner' },
];
const HOME_RUG_ID = 'rug';
const HOME_SLOTS = [
  { id: 'slot_curtains', name: 'the Window' },
  { id: 'slot_art', name: 'the Wall' },
  { id: 'slot_light', name: 'the Light Strip' },
];
const HOME_PIECES = [
  { id: 'charcoal_sofa', name: 'Charcoal Sofa', starter: true, defaultSpot: 'center_back', glyph: '🛋️' },
  { id: 'glass_table', name: 'Glass Coffee Table', starter: true, defaultSpot: 'center_front', glyph: '▭' },
  { id: 'plant', name: 'Green houseplant', starter: false, defaultSpot: 'window', glyph: '🪴' },
  { id: 'rug', name: 'Blue rug', starter: false, defaultSpot: 'center_front', glyph: '🟦' },
  { id: 'sofa', name: 'Black-and-gold sofa', starter: false, defaultSpot: 'tv_side', glyph: '🛋️' },
  { id: 'lamp', name: 'Floor Lamp', starter: false, defaultSpot: 'corner_west', glyph: '🪔' },
  { id: 'armchair', name: 'Blue Armchair', starter: false, defaultSpot: 'corner_east', glyph: '🛋️' },
  { id: 'bookshelf', name: 'Bookshelf', starter: false, defaultSpot: 'entry', glyph: '📚' },
  { id: 'curtains', name: 'Blue Curtains', starter: false, defaultSpot: 'slot_curtains', slot: 'slot_curtains', glyph: '🟦' },
  { id: 'wall_art', name: 'Modern Wall Art', starter: false, defaultSpot: 'slot_art', slot: 'slot_art', glyph: '🖼️' },
  { id: 'accent_light', name: 'Blue Accent Lighting', starter: false, defaultSpot: 'slot_light', slot: 'slot_light', glyph: '✨' },
];

function homeSpotById(spotId) {
  return HOME_SPOTS.find((entry) => entry.id === spotId) || HOME_SPOTS[0];
}

function homePieceById(pieceId) {
  return HOME_PIECES.find((entry) => entry.id === pieceId) || null;
}

/* FURNITURE_STORE_V1_E04_LOCATION: a layout value is a
 * floor spot OR a wall slot; this lookup names either one,
 * for the tray's PLACED line and the placement message. */
function homeLocationById(locationId) {
  return HOME_SPOTS.find((entry) => entry.id === locationId)
    || HOME_SLOTS.find((entry) => entry.id === locationId)
    || HOME_SPOTS[0];
}

/* FURNITURE_STORE_V1_E04_SLOTPIECE: which piece belongs to
 * a wall slot (each slot has exactly one). */
function homeSlotPieceId(slotId) {
  const piece = HOME_PIECES.find((entry) => entry.slot === slotId);
  return piece ? piece.id : null;
}

/* FURNITURE_STORE_V1_E05A_AVAILABLE: availability IS the
 * ownership union now (starters, coin decorations, cash
 * furniture) -- ownsPiece is the single rule. */
function isHomePieceAvailable(pieceId, ownedDecorations, ownedFurniture) {
  return ownsPiece(pieceId, ownedDecorations, ownedFurniture);
}

/* MY_HOME_INTERIOR_V1_E01_DEFAULTS: the layout a housed
 * player gets when nothing (valid) is stored: the starter
 * pieces on their default spots, plus every PLACED
 * decoration on its v1-equivalent spot, so a pre-interior
 * save opens with the room it already had -- plant at the
 * window corner, rug mid floor, black-and-gold sofa by the
 * TV wall. Owned-but-unplaced decorations stay in the tray. */
/* FURNITURE_STORE_V1_E05B_DEFAULTS: derivation also seats
 * every owned layer piece in its wall slot, so a save with
 * no stored layout (every pre-interior save, whose owner
 * was granted the three layers at load) opens with the
 * room it already had -- curtains on the window, art on
 * the wall, the accent strip glowing. Owned FLOOR
 * furniture is NOT auto-placed: it waits in the tray like
 * an owned-but-unplaced decoration. */
function defaultHomeLayout(placedDecorations, ownedDecorations, ownedFurniture) {
  const placed = Array.isArray(placedDecorations) ? placedDecorations : [];
  const owned = Array.isArray(ownedDecorations) ? ownedDecorations : [];
  const layout = {};
  for (const piece of HOME_PIECES) {
    if (piece.starter) layout[piece.id] = piece.defaultSpot;
    else if (piece.slot) {
      if (ownsPiece(piece.id, owned, ownedFurniture)) layout[piece.id] = piece.slot;
    }
    else if (placed.includes(piece.id) && owned.includes(piece.id)) layout[piece.id] = piece.defaultSpot;
  }
  return layout;
}

/* MY_HOME_INTERIOR_V1_E01_NORMALIZE: sanitize a stored
 * layout. A missing or non-object value DERIVES from
 * placedDecorations (every pre-interior save). A stored
 * object is authoritative: only known pieces on known spots
 * survive, decorations must be owned, and when two non-rug
 * pieces claim one spot the earlier piece in HOME_PIECES
 * order wins while the loser is simply not placed; the rug
 * never conflicts. A starter piece absent from a stored
 * object stays absent -- that is how a put-away is stored. */
/* FURNITURE_STORE_V1_E05C_NORMALIZE: the sanitizer now
 * reads ownership through the union and admits the wall
 * slots: a layer piece survives only in its OWN slot, a
 * floor piece only on a floor spot, and floor conflicts
 * resolve exactly as before (the earlier HOME_PIECES entry
 * wins; the rug never conflicts). A stored object stays
 * authoritative -- a put-away stays away. The extra
 * placeOwnedLayers pass runs ONLY for saves that predate
 * the Furniture Store (the loader grants those owners the
 * three layers): it seats each granted layer in its slot,
 * so the room those players already see keeps its
 * curtains, its art and its lighting. */
function normalizeHomeLayout(saved, placedDecorations, ownedDecorations, ownedFurniture, placeOwnedLayers) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
    return defaultHomeLayout(placedDecorations, ownedDecorations, ownedFurniture);
  }
  const owned = Array.isArray(ownedDecorations) ? ownedDecorations : [];
  const layout = {};
  const taken = {};
  for (const piece of HOME_PIECES) {
    const spot = saved[piece.id];
    if (typeof spot !== 'string') continue;
    if (!ownsPiece(piece.id, owned, ownedFurniture)) continue;
    if (piece.slot) {
      if (spot !== piece.slot) continue;
      layout[piece.id] = spot;
      continue;
    }
    if (!HOME_SPOTS.some((entry) => entry.id === spot)) continue;
    if (piece.id === HOME_RUG_ID) { layout[piece.id] = spot; continue; }
    if (taken[spot]) continue;
    taken[spot] = piece.id;
    layout[piece.id] = spot;
  }
  if (placeOwnedLayers) {
    for (const piece of HOME_PIECES) {
      if (piece.slot && layout[piece.id] === undefined && ownsPiece(piece.id, owned, ownedFurniture)) {
        layout[piece.id] = piece.slot;
      }
    }
  }
  return layout;
}

/* MY_HOME_INTERIOR_V1_E01_SYNC: placedDecorations is always
 * exactly the decoration ids present in the layout, in
 * DECORATIONS table order -- the v1 field kept in sync with
 * the layout so any other reader stays correct. */
function layoutPlacedDecorations(layout) {
  if (!layout || typeof layout !== 'object') return [];
  return DECORATIONS
    .filter((decoration) => typeof layout[decoration.id] === 'string')
    .map((decoration) => decoration.id);
}

/* MY_HOME_INTERIOR_V1_E01_PLACE: place or move a piece.
 * Free. The piece must be available (starter or owned
 * decoration) and the spot real; anything else returns the
 * layout untouched (same reference). Landing on an occupied
 * spot SWAPS: the displaced piece takes the mover's old
 * spot, or leaves the room if the mover came from the tray.
 * The rug slides under whatever is there and never
 * displaces anything. */
/* FURNITURE_STORE_V1_E05D_PLACE: placement now speaks
 * locations. A layer piece may ONLY take its own wall
 * slot (never a floor spot, never another slot) and never
 * displaces anything; a floor piece may ONLY take a floor
 * spot. Everything else -- the swap rule, the rug sliding
 * under, the untouched return for anything invalid -- is
 * the shipped behavior. */
function placeHomePieceAt(layout, pieceId, spotId, ownedDecorations, ownedFurniture) {
  const from = (layout && typeof layout === 'object' && !Array.isArray(layout)) ? layout : {};
  if (!isHomePieceAvailable(pieceId, ownedDecorations, ownedFurniture)) return from;
  const piece = homePieceById(pieceId);
  if (piece.slot) {
    if (spotId !== piece.slot) return from;
    if (from[pieceId] === spotId) return from;
    const next = { ...from };
    next[pieceId] = spotId;
    return next;
  }
  if (!HOME_SPOTS.some((entry) => entry.id === spotId)) return from;
  if (from[pieceId] === spotId) return from;
  const next = { ...from };
  if (pieceId === HOME_RUG_ID) { next[pieceId] = spotId; return next; }
  let occupant = null;
  for (const id of Object.keys(next)) {
    if (id !== pieceId && id !== HOME_RUG_ID && next[id] === spotId) { occupant = id; break; }
  }
  if (occupant) {
    if (typeof from[pieceId] === 'string') next[occupant] = from[pieceId];
    else delete next[occupant];
  }
  next[pieceId] = spotId;
  return next;
}

/* MY_HOME_INTERIOR_V1_E01_TAKEOUT: put a piece back in the
 * tray. Free; owning never changes. An absent piece leaves
 * the layout untouched (same reference). */
function takeHomePieceOut(layout, pieceId) {
  if (!layout || typeof layout !== 'object' || !(pieceId in layout)) return layout;
  const next = { ...layout };
  delete next[pieceId];
  return next;
}

/* HARLEY_V1_BIKES: Sky's Limit Harley Dealership. Cash only (not
 * savings), buy-once, no gameplay effects in v1 -- browsing, buying,
 * and persistent ownership only. Prices are the proposal Zabby
 * approved Nov 2, 2026.
 * HARLEYS_V2: five more models added Nov 5, 2026 at prices Zabby
 * approved that day (Sportster S $2,000, Heritage Classic $4,000,
 * Low Rider S $6,000, Road Glide $9,000, CVO Street Glide
 * $15,000), inserted in ascending price order. Table only --
 * every consumer reads BIKES. The new ids reuse the closest
 * existing model's picture in BIKE_IMAGES below until dedicated
 * art exists; names and prices are each model's own. */
const BIKES = [
  { id: 'iron883', name: 'Harley-Davidson Iron 883', blurb: 'A light Sportster -- easy to handle, classic Harley rumble.', price: 1500 },
  { id: 'sportsters', name: 'Harley-Davidson Sportster S', blurb: 'A modern Sportster -- quick, sharp, and all muscle.', price: 2000 },
  { id: 'softail', name: 'Harley-Davidson Softail Standard', blurb: 'A smooth cruiser with a clean, classic look.', price: 3000 },
  { id: 'heritage', name: 'Harley-Davidson Heritage Classic', blurb: 'Throwback looks with modern comfort -- pure classic cruiser.', price: 4000 },
  { id: 'fatboy', name: 'Harley-Davidson Fat Boy 114', blurb: 'Big, bold, and hard to miss on the road.', price: 5000 },
  { id: 'lowriders', name: 'Harley-Davidson Low Rider S', blurb: 'A performance cruiser -- low, lean, and built to run.', price: 6000 },
  { id: 'roadking', name: 'Harley-Davidson Road King', blurb: 'A touring bike built for long rides in comfort.', price: 7500 },
  { id: 'roadglide', name: 'Harley-Davidson Road Glide', blurb: 'The shark-nose bagger -- made for eating up highway miles.', price: 9000 },
  { id: 'streetglide', name: 'Harley-Davidson Street Glide', blurb: 'The top of the line -- full fairing, full presence.', price: 10000 },
  { id: 'cvostreetglide', name: 'Harley-Davidson CVO Street Glide', blurb: 'Custom Vehicle Operations -- the finest Harley money can buy.', price: 15000 },
];

const BIKE_IMAGES = {
  iron883: ART.bikeIron883,
  sportsters: ART.bikeIron883,
  softail: ART.bikeSoftail,
  heritage: ART.bikeSoftail,
  fatboy: ART.bikeFatBoy,
  lowriders: ART.bikeFatBoy,
  roadking: ART.bikeRoadKing,
  roadglide: ART.bikeStreetGlide,
  streetglide: ART.bikeStreetGlide,
  cvostreetglide: ART.bikeStreetGlide,
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

/* MY_GARAGE_V1_E01_HELPERS: the MY GARAGE display pick.
 * displayBike is the bike id the player chose to put on
 * display, or null when they have never chosen. What the
 * garage actually shows is the EFFECTIVE pick: the stored
 * pick when it names an owned bike, otherwise the first
 * owned bike, otherwise null (an empty garage). That one
 * rule is why buying a first bike at the DEALERSHIP shows
 * it on display with no dealership change, and why a stale
 * pick can never point at a bike the player does not own.
 * Selection only -- neither helper reads or writes cash,
 * savings, credit, XP, or coins. */
function effectiveDisplayBike(ownedBikes, displayBike) {
  const owned = normalizeOwnedBikes(ownedBikes);
  if (owned.includes(displayBike)) return displayBike;
  return owned.length > 0 ? owned[0] : null;
}

/* MY_GARAGE_V1: the load/state normalizer for the stored
 * pick. It stores the effective pick, so a stored id that
 * is not owned (or not a real bike id) resolves to the
 * first owned bike, or null when no bike is owned, instead
 * of persisting a stale value. */
function normalizeDisplayBike(value, owned) {
  return effectiveDisplayBike(owned, value);
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
  /* LIFE_GOALS_CH2_V1_E01_TABLE: Chapter 2 -- five more goals on
   * systems already built (Chapter 3 businesses and their
   * upgrades, rental properties) plus a $25,000 savings capstone.
   * chapter: 2 drives the CHAPTER 2 subheading in the render; the
   * latch effect, the load-time coin grant and the load whitelists
   * all read this one table, so existing accomplishments latch
   * (and pay their +5 coins) through the same paths as Chapter 1.
   * Kinds businesses / upgrades / properties count the matching
   * ownership list; savings_25000 reuses the savings kind. */
  { id: 'upgrade_first', name: 'Upgrade your first business', kind: 'upgrades', target: 1, chapter: 2,
    targetText: 'Buy an upgrade for one of your businesses.',
    doneText: "Your business is working harder for you now!" },
  { id: 'own_all_businesses', name: 'Own all three businesses', kind: 'businesses', target: 3, chapter: 2,
    targetText: 'Own the Cleaning Service, Hauling Service, and Food Stand.',
    doneText: "Three businesses, one boss\u2014you!" },
  { id: 'upgrade_all_businesses', name: 'Upgrade all three businesses', kind: 'upgrades', target: 3, chapter: 2,
    targetText: 'Buy the upgrade for all three businesses.',
    doneText: "Every business upgraded\u2014a real little empire!" },
  { id: 'own_both_properties', name: 'Own both rental properties', kind: 'properties', target: 2, chapter: 2,
    targetText: 'Own the Duplex and the Apartment Building.',
    doneText: "Two properties paying you rent every Friday!" },
  { id: 'savings_25000', name: 'Reach $25,000 in savings', kind: 'savings', target: 25000, chapter: 2,
    targetText: 'Have $25,000 in savings.',
    doneText: "Twenty-five thousand put away\u2014that's real security!" },
  /* LIFE_GOALS_CH3_V1_E01_TABLE: Chapter 3 -- Building Your
   * Future. LOCKED until every Chapter 2 goal is complete (see
   * lifeGoalChapterUnlocked); the moment the chapter unlocks,
   * existing accomplishments latch through the same paths as
   * Chapters 1-2. ch3_own_both_properties repeats Chapter 2
   * goal 4 on purpose (Lori's spec): same label, same
   * condition, its own id, its own +5 coins. The savings
   * ladder continues 40k / 50k / 75k on the savings kind. */
  { id: 'ch3_upgrade_all_businesses', name: 'Own all three upgraded businesses', kind: 'upgrades', target: 3, chapter: 3,
    targetText: 'Own all three businesses with their upgrades.',
    doneText: "Every business upgraded and earning at full strength!" },
  { id: 'ch3_own_both_properties', name: 'Own both rental properties', kind: 'properties', target: 2, chapter: 3,
    targetText: 'Own the Duplex and the Apartment Building.',
    doneText: "Both properties yours\u2014rent rolling in every Friday!" },
  { id: 'savings_40000', name: 'Reach $40,000 in savings', kind: 'savings', target: 40000, chapter: 3,
    targetText: 'Have $40,000 in savings.',
    doneText: "Forty thousand put away\u2014you're building real wealth!" },
  { id: 'savings_50000', name: 'Reach $50,000 in savings', kind: 'savings', target: 50000, chapter: 3,
    targetText: 'Have $50,000 in savings.',
    doneText: "Fifty thousand! Halfway to six figures!" },
  { id: 'savings_75000', name: 'Reach $75,000 in savings', kind: 'savings', target: 75000, chapter: 3,
    targetText: 'Have $75,000 in savings.',
    doneText: "Seventy-five thousand in savings\u2014a future you built yourself!" },
];
/* LIFE_GOALS_CH2_V1_E02_HELPERS: progress toward a goal, in the
 * goal's own units -- dollars for savings goals, points for the
 * credit goal, item counts for the Chapter 2 collection goals.
 * The ownership lists are whitelisted by their normalizers
 * (normalizeOwnedBusinesses / normalizeBusinessUpgrades /
 * normalizeProperties), so a count reaching the target means
 * every item is owned; there is no way to hold a fourth business
 * or a third property. LIFE_GOAL_IDS is the one whitelist the
 * load normalization filters goalsDone and goalCoinsPaid by, so
 * a latched Chapter 2 goal -- and its coin-payment record --
 * survives reloads exactly like Chapter 1. */
const LIFE_GOAL_IDS = LIFE_GOALS.map((g) => g.id);
function lifeGoalProgress(g, s) {
  if (g.kind === 'credit') return s.credit;
  if (g.kind === 'businesses') return s.ownedBusinesses.length;
  if (g.kind === 'upgrades') return s.businessUpgrades.length;
  if (g.kind === 'properties') return s.propertiesOwned.length;
  return s.savings;
}
function lifeGoalMet(g, s) {
  return lifeGoalProgress(g, s) >= g.target;
}
/* LIFE_GOALS_CH3_V1_E02_HELPER: chapter availability. Chapters
 * 1-2 are always available; Chapter 3 (Building Your Future) is
 * locked until every Chapter 2 goal is in goalsDone. The unlock
 * is derived from goalsDone itself -- no separate save field --
 * and Chapter 2 latches are permanent, so once unlocked the
 * chapter can never re-lock. The latch effect, the load-time
 * legacy grant and the goals render all consult this one
 * predicate, so while locked a Chapter 3 goal can neither
 * latch, be paid, nor show its items. */
function lifeGoalChapterUnlocked(g, goalsDone) {
  if (g.chapter !== 3) return true;
  return LIFE_GOALS.filter((x) => x.chapter === 2).every((x) => goalsDone.includes(x.id));
}
/* LIFE_EVENTS_V1: surprise life events, rolled when the player wakes up.
 * Wording and amounts are a STARTER DECK for Lori to rewrite -- every
 * title, text, choice and dollar amount lives in this one table.
 * Effects use the existing systems only: cash, savings (peak +
 * credit via the deposit rule), pending wages, XP, credit (capped
 * at 850, floored at 0, same as deposits). needsJob events only
 * roll for hired + trained players.
 * LIFE_EVENTS_V2_E06_HEADER: six more events (medical bill, tax
 * refund, birthday gift, broken phone, neighbor moving, raise
 * at work). */
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
      { label: 'Pay with 10 coins', coins: -10, credit: 1, coinGate: 45, result: 'Phone bill paid on time with coins. 10 coins spent. Credit +1.' }, /* COINS_V1_E12_PHONE_CHOICE: appended last so the existing choices keep their positions; same paid effects as cash (+1 credit); coinGate is the cash cost cash must be below. */
    ] },
  { id: 'credit_workshop', title: 'Free Credit Workshop',
    text: 'The library is running a free workshop on building credit tonight.',
    choices: [
      { label: 'Attend (+3 credit)', credit: 3, result: 'You showed up and learned the game. Credit +3.' },
      { label: 'Skip it', result: 'You skipped the workshop this time.' },
    ] },
  /* LIFE_EVENTS_V2_E01_TABLE: six more events (starter deck
   * for Lori to rewrite). Same fields as v1, plus savings:
   * a choice may set savings (tax refund) -- the choice
   * resolver applies it and the deposit rule handles peak
   * + credit. */
  { id: 'medical_bill', title: 'Medical Bill',
    text: 'A $80 bill from the clinic came in the mail.',
    choices: [
      { label: 'Pay it now (-$80)', cash: -80, result: 'Bill paid. One less thing hanging over you.' },
      { label: 'Ignore it (credit -3)', credit: -3, result: 'You ignored the bill. It may come back as a collection. Credit -3.' },
      { label: 'Pay with 10 coins', coins: -10, coinGate: 80, result: 'Medical bill paid with coins. 10 coins spent.' }, /* COINS_V1_E13_MEDICAL_CHOICE: appended last so the existing choices keep their positions; same paid effects as cash (no credit change); coinGate is the cash cost cash must be below. */
    ] },
  { id: 'tax_refund', title: 'Tax Refund',
    text: 'Your tax refund came in: $120.',
    choices: [
      { label: 'Take the cash (+$120)', cash: 120, result: 'Refund in hand. +$120.' },
      { label: 'Put it in savings (+$120)', savings: 120, result: 'Refund tucked into savings. +$120 savings.' },
    ] },
  { id: 'birthday_gift', title: 'Birthday Gift',
    text: 'A friend has a birthday today.',
    choices: [
      { label: 'Buy a gift (-$25, +40 XP)', cash: -25, xp: 40, result: 'Your friend loved the gift. (+40 XP)' },
      { label: 'Skip it', result: 'You skipped the gift this time.' },
    ] },
  { id: 'broken_phone', title: 'Broken Phone',
    text: 'You cracked your phone screen.',
    choices: [
      { label: 'Fix it (-$90)', cash: -90, result: 'Screen fixed. Good as new.' },
      { label: 'Live with it', result: 'You can still read it. Mostly.' },
    ] },
  { id: 'neighbor_moving', title: 'Neighbor Moving',
    text: 'Your neighbor needs help moving today.',
    choices: [
      { label: 'Help out (+$30, +20 XP)', cash: 30, xp: 20, result: 'Boxes moved, neighbor happy. +$30, +20 XP.' },
      { label: 'Say you are busy', result: 'You stayed home today.' },
    ] },
  { id: 'raise_at_work', title: 'Raise at Work',
    text: 'Your boss gave you a $25 bonus for good work.',
    choices: [
      { label: 'Nice! (+$25)', cash: 25, result: 'Bonus in your pocket. +$25.' },
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

/* CASINO_RESULTS_V1_INFO: display math for one finished casino
 * round. bet is what left cash when the round started; returned is
 * what was ACTUALLY credited back to cash -- the games pass the
 * post-cap amount (see capCasinoReturn), stake included when it
 * comes back, 0 on a loss or a blackjack bust. net = returned - bet
 * is therefore exactly the round's real cash change, capped wins
 * included. The outcome word comes from the sign of net alone, so
 * a round that returns exactly the bet reads PUSH. */
function casinoResultInfo(bet, returned) {
  const net = returned - bet;
  return {
    bet: bet,
    returned: returned,
    net: net,
    outcome: net > 0 ? 'WIN' : net < 0 ? 'LOSS' : 'PUSH',
  };
}

/* CASINO_RESULTS_V1_LINE: "Bet $10 \u2022 Returned $20 \u2022 Net gain $10"
 * (a loss reads "Net loss $10"; a push reads "Net $0"). */
function casinoAmountsLine(info) {
  const netPart = info.net > 0
    ? 'Net gain $' + info.net
    : info.net < 0
      ? 'Net loss $' + (-info.net)
      : 'Net $0';
  return 'Bet $' + info.bet + ' \u2022 Returned $' + info.returned + ' \u2022 ' + netPart;
}

/* CASINO_RESULTS_V1_PANEL: shared result block for slots,
 * blackjack and roulette. With no finished round (info null) it
 * renders the plain message exactly as before (errors, "Hit or
 * stand?", ...). With a finished round it shows the big outcome
 * word, the bet / returned / net line, and the game's own message
 * as a smaller detail line underneath. The WORD carries the
 * meaning; the outcome colors only reinforce it. */
function CasinoResultPanel({ info, detail }) {
  if (!info) {
    return detail ? (
      <Text style={styles.casinoResult} accessibilityLiveRegion="polite">{detail}</Text>
    ) : null;
  }
  const outcomeStyle = info.outcome === 'WIN'
    ? styles.casinoOutcomeWin
    : info.outcome === 'LOSS'
      ? styles.casinoOutcomeLoss
      : styles.casinoOutcomePush;
  return (
    <View style={styles.casinoResultPanel} accessibilityLiveRegion="polite">
      <Text style={[styles.casinoOutcome, outcomeStyle]}>{info.outcome}</Text>
      <Text style={styles.casinoResultAmounts}>{casinoAmountsLine(info)}</Text>
      {!!detail && <Text style={styles.casinoResultDetail}>{detail}</Text>}
    </View>
  );
}

/* MY_PROGRESS_V1_HELPER: pure, read-only summary behind the MY
 * PROGRESS screen. It reads existing state values and the
 * BUSINESSES / PROPERTIES / BIKES / LIFE_GOALS tables only --
 * writes nothing, awards nothing, and never runs goal latch or
 * progress logic: completed goals are read straight out of
 * goalsDone exactly as stored. Chapter groups derive from the
 * LIFE_GOALS table itself (the chapter field; no chapter field
 * means Chapter 1), so a future chapter groups itself here with
 * no new code. Money values pass through untouched; the screen
 * formats them. Level uses the game's own derivation
 * (POLISH_V1_XP: 1 + floor(xp / 250)). */
function progressSummary(s) {
  const businesses = BUSINESSES
    .filter((biz) => s.ownedBusinesses.includes(biz.id))
    .map((biz) => {
      const upgraded = s.businessUpgrades.includes(biz.id);
      return {
        id: biz.id,
        name: biz.name,
        upgradeName: upgraded ? biz.upgradeName : null,
        label: biz.name + ' \u2014 ' + (upgraded ? biz.upgradeName : 'no upgrade'),
      };
    });
  const chapterNumbers = [];
  for (const g of LIFE_GOALS) {
    const ch = g.chapter || 1;
    if (!chapterNumbers.includes(ch)) chapterNumbers.push(ch);
  }
  chapterNumbers.sort((a, b) => a - b);
  return {
    cash: s.cash,
    savings: s.savings,
    credit: s.credit,
    xp: s.xp,
    level: 1 + Math.floor(s.xp / 250),
    coins: s.coins,
    pendingWages: s.pendingWages,
    paycheck: s.paycheck,
    businesses: businesses,
    properties: PROPERTIES
      .filter((prop) => s.propertiesOwned.includes(prop.id))
      .map((prop) => prop.name),
    bikes: BIKES
      .filter((bike) => s.ownedBikes.includes(bike.id))
      .map((bike) => bike.name),
    goalChapters: chapterNumbers.map((ch) => ({
      chapter: ch,
      title: ch === 3 ? 'Chapter 3 \u2014 Building Your Future' : 'Chapter ' + ch,
      completed: LIFE_GOALS
        .filter((g) => (g.chapter || 1) === ch && s.goalsDone.includes(g.id))
        .map((g) => g.name),
    })),
  };
}

/* MY_NET_WORTH_V1_E01_HELPER: pure, read-only net-worth
 * breakdown behind the MY NET WORTH screen in BANK. It reads
 * existing state values and the game's own tables/constants
 * only -- BOND_PRICE (sellBond pays exactly that back), the
 * live fundValue state (sellFund pays it), PROPERTIES price
 * (sellProperty pays prop.price in full), BUSINESSES price
 * and upgradeCost, BIKES price -- and writes nothing, moves
 * nothing and stores nothing: the screen has NO save field
 * of its own, so reopening recomputes the same display from
 * the same save. Investments and properties are valued at
 * what they would sell for today; businesses, upgrades and
 * motorcycles at what was paid for them. Upgrades are their
 * OWN lines, never folded into the business line, so nothing
 * is counted twice. EXCLUDED by design: coins, XP, credit
 * score, pending wages and uncollected paychecks -- the
 * helper takes no input for them, so they can never reach
 * the total. */
function computeNetWorth(s) {
  const investments = [];
  if (s.bondOwned) investments.push({ id: 'bond', name: 'Savings Bond', amount: BOND_PRICE });
  if (s.fundOwned) investments.push({ id: 'fund', name: 'Growth Fund', amount: s.fundValue });
  const properties = PROPERTIES
    .filter((prop) => s.propertiesOwned.includes(prop.id))
    .map((prop) => ({ id: prop.id, name: prop.name, amount: prop.price }));
  const businesses = BUSINESSES
    .filter((biz) => s.ownedBusinesses.includes(biz.id))
    .map((biz) => ({ id: biz.id, name: biz.name, amount: biz.price }));
  const upgrades = BUSINESSES
    .filter((biz) => s.businessUpgrades.includes(biz.id))
    .map((biz) => ({ id: biz.id, name: biz.upgradeName, businessName: biz.name, amount: biz.upgradeCost }));
  const bikes = BIKES
    .filter((bike) => s.ownedBikes.includes(bike.id))
    .map((bike) => ({ id: bike.id, name: bike.name, amount: bike.price }));
  const sum = (items) => items.reduce((acc, item) => acc + item.amount, 0);
  const moneyTotal = s.cash + s.savings;
  const investmentsTotal = sum(investments);
  const propertiesTotal = sum(properties);
  const businessesTotal = sum(businesses);
  const upgradesTotal = sum(upgrades);
  const bikesTotal = sum(bikes);
  return {
    cash: s.cash,
    savings: s.savings,
    moneyTotal: moneyTotal,
    investments: investments,
    investmentsTotal: investmentsTotal,
    properties: properties,
    propertiesTotal: propertiesTotal,
    businesses: businesses,
    businessesTotal: businessesTotal,
    upgrades: upgrades,
    upgradesTotal: upgradesTotal,
    bikes: bikes,
    bikesTotal: bikesTotal,
    total: moneyTotal + investmentsTotal + propertiesTotal + businessesTotal + upgradesTotal + bikesTotal,
  };
}

/* COINS_V1_E02_WEEK_HELPERS: coin math for life goals and the
 * weekly shift bonus. Life goals pay COIN_PER_GOAL coins each,
 * exactly once per goal (see the load migration and the
 * goal-latch effect). The weekly bonus pays COIN_WEEKLY_BONUS
 * when the SHIFTS_FOR_WEEKLY_BONUS-th regular paid shift lands
 * in one in-game week. A week runs Monday..Sunday of the
 * absolute day counter: day 0 is a Monday (DAY_NAMES[0] is
 * 'Monday', FRIDAY = 4, and paydayLine derives the weekday as
 * day % 7), so the week key is Math.floor(day / 7) and a
 * week's Friday is day 7k + 4 -- the same anchor the payroll
 * math already uses. The counter is lazy: a stale count from
 * an older week is ignored the next time a shift completes,
 * so nothing has to reset at midnight or on Rest. */
const COIN_PER_GOAL = 5;
const COIN_WEEKLY_BONUS = 2;
const COIN_BILL_COST = 10;
const SHIFTS_FOR_WEEKLY_BONUS = 3;
function shiftWeekKeyFor(day) {
  return Math.floor(day / 7);
}
function applyShiftWeekCount(shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek, day) {
  const wk = shiftWeekKeyFor(day);
  const count = shiftsWeekKey === wk ? shiftsThisWeek + 1 : 1;
  const bonus = count === SHIFTS_FOR_WEEKLY_BONUS && lastShiftBonusWeek !== wk ? COIN_WEEKLY_BONUS : 0;
  return {
    shiftsThisWeek: count,
    shiftsWeekKey: wk,
    lastShiftBonusWeek: bonus > 0 ? wk : lastShiftBonusWeek,
    bonus,
  };
}
/* The legacy one-time goal grant, run during load
 * normalization: every latched goal not yet recorded in
 * goalCoinsPaid pays COIN_PER_GOAL once and is recorded, so
 * a reload (which re-reads the persisted paid list) grants
 * 0. Pure: the loader passes the normalized save fields. */
function legacyGoalCoinGrant(coins, goalsDone, goalCoinsPaid) {
  /* LIFE_GOALS_CH3_V1_E03_GRANT: the Chapter 3 lock gate applies
   * here too -- a locked Chapter 3 goal is never paid at load.
   * (Unreachable for any save the app itself wrote, since a
   * Chapter 3 id only enters goalsDone through the gated latch;
   * Chapters 1-2 are always unlocked, so their grants are
   * byte-for-byte the old behavior.) */
  const unpaid = LIFE_GOALS.filter((g) => goalsDone.includes(g.id) && !goalCoinsPaid.includes(g.id) && lifeGoalChapterUnlocked(g, goalsDone));
  return {
    coins: coins + COIN_PER_GOAL * unpaid.length,
    goalCoinsPaid: [...goalCoinsPaid, ...unpaid.map((g) => g.id)],
    granted: COIN_PER_GOAL * unpaid.length,
  };
}


/* EXPLORE_CITY_V1_HELPERS_START */
/* EXPLORE_CITY_V1: EXPLORE THE CITY -- the fixed tile map becomes a
 * 2400x1600 world the player walks and rides through. Everything in
 * this block is pure data or a pure function of it: the layout table
 * CITY_PLACES is the ONE source movement, collision, ENTER, the
 * minimap, the guide and the location label all read. Nothing here
 * touches cash, savings, credit, XP, wages, the clock or the
 * calendar -- position and riding are the only new save fields, and
 * they are additive (playerPos, ridingBike). */
const CITY_WORLD = { w: 2400, h: 1600 };
const CITY_ACTOR_SIZE = { w: 2400, h: 1600 };
const CITY_TICK_MS = 33; /* ~30 ticks/sec movement loop */
const CITY_WALK_SPEED = 3.2; /* world units per tick on foot */
const CITY_RIDE_SPEED = 8; /* world units per tick on a motorcycle */
const CITY_PLAYER_R = 16; /* player body radius for collision */
const CITY_ENTER_RANGE = 90; /* entrance distance that offers ENTER */
const CITY_GUIDE_ARRIVE = 100; /* guide clears within this distance */
const CITY_STREETS = [
  { x: 500, y: 0, w: 160, h: 1600 },
  { x: 1500, y: 0, w: 160, h: 1600 },
  { x: 0, y: 450, w: 2400, h: 160 },
  { x: 0, y: 1050, w: 2400, h: 160 },
];
/* One row per place: rect is the building footprint (collision),
 * entrance is the walk-up point just south of the front edge.
 * kind 'building' always opens dest; 'property' / 'business' open
 * dest (the HOME screen, where property selling and business jobs
 * live) only when owned; 'zone' is walkable ground with no entry.
 * dest uses the game's real screen ids; 'work' keeps its gates via
 * resolveDest at ENTER time, exactly like the old map tile did.
 * The x=1500 street is the district divide: west is Residential,
 * east is Shopping & Work. */
const CITY_PLACES = [
  { id: 'park', name: 'Park', sign: 'PARK', kind: 'zone', dest: null, art: 'park', rect: { x: 60, y: 60, w: 380, h: 340 }, entrance: null },
  { id: 'home', name: 'Home', sign: 'HOME', kind: 'building', dest: 'HOME', art: 'home', rect: { x: 720, y: 110, w: 280, h: 240 }, entrance: { x: 860, y: 392 } },
  { id: 'duplex', name: 'Duplex', sign: 'DUPLEX', kind: 'property', propId: 'duplex', dest: 'HOME', art: null, rect: { x: 120, y: 700, w: 280, h: 240 }, entrance: { x: 260, y: 982 } },
  { id: 'apartment', name: 'Apartment Building', sign: 'APARTMENT BUILDING', kind: 'property', propId: 'apartment', dest: 'HOME', art: null, rect: { x: 760, y: 700, w: 320, h: 260 }, entrance: { x: 920, y: 1002 } },
  { id: 'bank', name: 'Bank', sign: 'BANK', kind: 'building', dest: 'BANK', art: 'bank', rect: { x: 1690, y: 90, w: 220, h: 270 }, entrance: { x: 1800, y: 402 } },
  { id: 'casino', name: 'Casino', sign: 'CASINO', kind: 'building', dest: 'CASINO', art: 'casino', rect: { x: 1940, y: 90, w: 220, h: 270 }, entrance: { x: 2050, y: 402 } },
  { id: 'dealership', name: 'Dealership', sign: 'DEALERSHIP', kind: 'building', dest: 'DEALERSHIP', art: 'dealership', rect: { x: 2190, y: 90, w: 180, h: 270 }, entrance: { x: 2280, y: 402 } },
  { id: 'work', name: 'Employment Center', sign: 'EMPLOYMENT CENTER', kind: 'building', dest: 'WORK', art: 'work', rect: { x: 1690, y: 680, w: 240, h: 270 }, entrance: { x: 1810, y: 992 } },
  { id: 'store', name: 'Store', sign: 'STORE', kind: 'building', dest: 'STORE', art: 'store', rect: { x: 1960, y: 680, w: 220, h: 270 }, entrance: { x: 2070, y: 992 } },
  { id: 'transit', name: 'Transit', sign: 'TRANSIT', kind: 'building', dest: 'TRANSIT', art: 'transit', rect: { x: 2210, y: 680, w: 160, h: 270 }, entrance: { x: 2290, y: 992 } },
  { id: 'hauling', name: 'Hauling Service', sign: 'HAULING SERVICE', kind: 'business', bizId: 'hauling', dest: 'HOME', art: null, rect: { x: 1690, y: 1250, w: 200, h: 210 }, entrance: { x: 1790, y: 1502 } },
  { id: 'cleaning', name: 'Cleaning Service', sign: 'CLEANING SERVICE', kind: 'business', bizId: 'cleaning', dest: 'HOME', art: null, rect: { x: 1920, y: 1250, w: 200, h: 210 }, entrance: { x: 2020, y: 1502 } },
  { id: 'foodstand', name: 'Food Stand', sign: 'FOOD STAND', kind: 'business', bizId: 'foodstand', dest: 'HOME', art: null, rect: { x: 2150, y: 1250, w: 200, h: 210 }, entrance: { x: 2250, y: 1502 } },
  /* CITY_JOBS_V1_E04_BOARD_PLACE: the City Job Board kiosk,
   * across the avenue from the Employment Center -- the open
   * corner between the east street and the Bank. ENTER opens
   * the JOB_BOARD screen (dest is a screen id, like the rest).
   * The entrance below the kiosk clears its own, the Bank's
   * and the street's inflated footprints with room to stand. */
  { id: 'jobboard', name: 'City Job Board', sign: 'JOB BOARD', kind: 'building', dest: 'JOB_BOARD', art: null, rect: { x: 1620, y: 360, w: 110, h: 30 }, entrance: { x: 1675, y: 422 } },
];
/* Decorative residential houses: drawn in the ground layer and
 * solid for collision, but they are not destinations. */
const CITY_SCENERY_RECTS = [
  { x: 1140, y: 130, w: 220, h: 200 },
  { x: 110, y: 1270, w: 200, h: 180 },
  { x: 760, y: 1270, w: 200, h: 180 },
  { x: 1100, y: 1270, w: 200, h: 180 },
];
const CITY_RECTS = CITY_PLACES.filter((p) => p.kind !== 'zone').map((p) => p.rect).concat(CITY_SCENERY_RECTS);

function cityPlaceById(id) {
  return CITY_PLACES.find((p) => p.id === id) || null;
}

function cityHomeEntrance() {
  const home = cityPlaceById('home');
  return { x: home.entrance.x, y: home.entrance.y };
}

function cityPointInRect(x, y, r, pad) {
  return x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad;
}

function cityHitsRect(x, y, rects) {
  for (const r of rects) {
    if (cityPointInRect(x, y, r, CITY_PLAYER_R)) return true;
  }
  return false;
}

/* Camera: keep the player centred, clamped so the view never
 * leaves the world. */
function clampCamera(px, py, viewW, viewH) {
  const maxX = Math.max(0, CITY_WORLD.w - viewW);
  const maxY = Math.max(0, CITY_WORLD.h - viewH);
  return {
    x: Math.min(Math.max(px - viewW / 2, 0), maxX),
    y: Math.min(Math.max(py - viewH / 2, 0), maxY),
  };
}

/* Axis-separated move: try X, then Y, so the player slides along
 * walls. The result is clamped to the world and can never be
 * inside a collision rect when the start was not. */
function resolveCityMove(pos, dx, dy, rects) {
  let nx = Math.min(Math.max(pos.x + dx, CITY_PLAYER_R), CITY_WORLD.w - CITY_PLAYER_R);
  if (cityHitsRect(nx, pos.y, rects)) nx = pos.x;
  let ny = Math.min(Math.max(pos.y + dy, CITY_PLAYER_R), CITY_WORLD.h - CITY_PLAYER_R);
  if (cityHitsRect(nx, ny, rects)) ny = pos.y;
  return { x: nx, y: ny };
}

/* Push a point out of any collision rect (nearest edge first).
 * Used for tap targets and reduced-motion teleports; falls back
 * to the HOME entrance if a point somehow cannot be freed. */
function cityUnstick(pos, rects) {
  let out = {
    x: Math.min(Math.max(pos.x, CITY_PLAYER_R), CITY_WORLD.w - CITY_PLAYER_R),
    y: Math.min(Math.max(pos.y, CITY_PLAYER_R), CITY_WORLD.h - CITY_PLAYER_R),
  };
  for (let pass = 0; pass < 4; pass++) {
    if (!cityHitsRect(out.x, out.y, rects)) return out;
    for (const r of rects) {
      if (!cityPointInRect(out.x, out.y, r, CITY_PLAYER_R)) continue;
      const left = out.x - (r.x - CITY_PLAYER_R);
      const right = (r.x + r.w + CITY_PLAYER_R) - out.x;
      const up = out.y - (r.y - CITY_PLAYER_R);
      const down = (r.y + r.h + CITY_PLAYER_R) - out.y;
      const m = Math.min(left, right, up, down);
      if (m === left) out = { x: r.x - CITY_PLAYER_R - 1, y: out.y };
      else if (m === right) out = { x: r.x + r.w + CITY_PLAYER_R + 1, y: out.y };
      else if (m === up) out = { x: out.x, y: r.y - CITY_PLAYER_R - 1 };
      else out = { x: out.x, y: r.y + r.h + CITY_PLAYER_R + 1 };
    }
  }
  return cityHitsRect(out.x, out.y, rects) ? cityHomeEntrance() : out;
}

/* Save normalization for the player position: finite, in-bounds
 * and not inside a building, else the safe HOME entrance. Older
 * saves have no position at all and start at HOME. */
function normalizePlayerPos(raw) {
  if (!raw || !Number.isFinite(raw.x) || !Number.isFinite(raw.y)) return cityHomeEntrance();
  if (raw.x < 0 || raw.x > CITY_WORLD.w || raw.y < 0 || raw.y > CITY_WORLD.h) return cityHomeEntrance();
  if (cityHitsRect(raw.x, raw.y, CITY_RECTS)) return cityHomeEntrance();
  return { x: raw.x, y: raw.y };
}

/* Save normalization for riding: only a bike the player owns. */
function normalizeRidingBike(raw, owned) {
  const ownedList = normalizeOwnedBikes(owned);
  return typeof raw === 'string' && ownedList.includes(raw) ? raw : null;
}

function nearestEntrance(pos, places) {
  let best = null;
  for (const p of places || CITY_PLACES) {
    if (!p.entrance) continue;
    const d = Math.hypot(pos.x - p.entrance.x, pos.y - p.entrance.y);
    if (!best || d < best.dist) best = { place: p, dist: d };
  }
  return best;
}

function cityPlaceOwned(place, ownedBusinesses, propertiesOwned) {
  if (place.kind === 'business') return (ownedBusinesses || []).includes(place.bizId);
  if (place.kind === 'property') return (propertiesOwned || []).includes(place.propId);
  return true;
}

/* BUSINESS_INTERIORS_V1_E01_ROUTING: the walk-in business
 * interiors. An owned business's ENTER opens its interior
 * screen instead of the shipped dest (the HOME screen);
 * every other place resolves exactly as before. cityEnter
 * only ever fires for owned places -- the map shows the
 * not-owned note and no ENTER button otherwise -- so the
 * ownership re-check in cityEnterDest is belt-and-braces:
 * a business the player does not own still resolves to its
 * shipped dest. The interior place ids are screens, not
 * city places: nothing is added to CITY_PLACES, so the
 * exit watcher's respawn (keyed by the storefront's own
 * place id, recorded at ENTER) is untouched. */
const BIZ_INTERIOR_PLACES = {
  cleaning: 'BIZ_CLEANING',
  hauling: 'BIZ_HAULING',
  foodstand: 'BIZ_FOODSTAND',
};

function bizInteriorPlace(businessId) {
  return BIZ_INTERIOR_PLACES[businessId] || null;
}

function bizIdForInteriorPlace(place) {
  for (const bizId of Object.keys(BIZ_INTERIOR_PLACES)) {
    if (BIZ_INTERIOR_PLACES[bizId] === place) return bizId;
  }
  return null;
}

function cityEnterDest(placeDef, ownedBusinesses) {
  if (placeDef && placeDef.kind === 'business' && (ownedBusinesses || []).includes(placeDef.bizId)) {
    return bizInteriorPlace(placeDef.bizId) || placeDef.dest;
  }
  return placeDef ? placeDef.dest : null;
}

/* HUD location text: the park, then the nearest entrance within
 * 150 units, then the district (the x=1500 street is the divide;
 * its centre line is 1580). */
function cityLocationLabel(pos) {
  const park = cityPlaceById('park');
  if (pos.x >= park.rect.x && pos.x <= park.rect.x + park.rect.w && pos.y >= park.rect.y && pos.y <= park.rect.y + park.rect.h) return 'Park';
  const near = nearestEntrance(pos, CITY_PLACES);
  if (near && near.dist <= 150) return near.place.name;
  return pos.x < 1580 ? 'Residential District' : 'Shopping & Work District';
}

function guideTo(pos, target) {
  const dx = target.x - pos.x;
  const dy = target.y - pos.y;
  return { dist: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) };
}

/* Eight-way arrow for the guide chip (screen y grows downward,
 * so angle +PI/2 points down). */
function guideArrowChar(angle) {
  const arrows = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
  const idx = ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8;
  return arrows[idx];
}
/* EXPLORE_CITY_V1_HELPERS_END */

/* CITY_JOBS_V1_HELPERS_START */
/* CITY_JOBS_V1: CITY JOBS & MISSIONS -- a City Job Board plus
 * playable missions in the explorable city. This block is pure
 * data and pure functions only: the mission state machine, the
 * board eligibility rules and the completion planner. The
 * planner REUSES the shipped economy rules by calling the same
 * helpers the menus call (bizJobsDoneToday for the per-business
 * daily allowance, businessPay for pay incl. upgrades, canEarn
 * for the $1,500 daily earnings cap, TRANSIT_SHIFT_PAY /
 * TRANSIT_SHIFT_XP for the bus route). Nothing here touches
 * cash, wages, the clock or the calendar -- the handlers in the
 * component apply a plan, exactly once, through the shipped
 * setters. */
const MISSION_KINDS = ['cleaning', 'hauling', 'foodstand', 'transit_route', 'delivery'];
/* Motorcycle deliveries: Lori's approved starting terms --
 * $60 cash and one game hour per completed delivery, at most
 * 3 per in-game day, shown on the board before acceptance. */
const MISSION_DELIVERY_PAY = 60;
const MISSION_DELIVERY_HOURS = 1;
const MISSION_DELIVERY_DAILY_MAX = 3;
/* Passengers boarding at the mission route's three stops
 * (flavor only -- route pay is the flat TRANSIT_SHIFT_PAY). */
const MISSION_TRANSIT_BOARDING = [2, 4, 3];
/* Food Stand order sequence (draft flavor from the game's own
 * menu -- fish fry items). */
const MISSION_ORDERS = [
  { item: 'Fish & Fries', count: 1 },
  { item: 'Shrimp & Fries', count: 2 },
  { item: 'Fish & Shrimp Combo', count: 1 },
];
/* Mission spots: fixed walkable points by existing places.
 * The customer house is the scenery house at {110,1270} (spots
 * on its front lawn, south of the footprint); the delivery
 * house is the scenery house at {760,1270}. Every spot is
 * outside every collision rect (with the player radius) and
 * BFS-reachable from the HOME entrance -- the sim proves both
 * with the EXPLORE grid method. */
const MISSION_SPOTS = {
  cleaningCustomer: { x: 210, y: 1490 },
  cleaningSpots: [
    { x: 140, y: 1490 },
    { x: 280, y: 1490 },
    { x: 210, y: 1545 },
  ],
  haulingPickup: { x: 2330, y: 1030 },
  haulingDeliver: { x: 2070, y: 1030 },
  foodstand: { x: 2250, y: 1502 },
  transitStops: [
    { x: 2290, y: 992, name: 'Transit Depot' },
    { x: 920, y: 1002, name: 'Residential' },
    { x: 2070, y: 992, name: 'Downtown/Shopping' },
  ],
  deliveryPickup: { x: 2070, y: 992 },
  deliveryDropoff: { x: 860, y: 1490 },
};
const MISSION_DEFS = {
  cleaning: { kind: 'cleaning', bizId: 'cleaning', title: 'Cleaning Service — Customer Clean', destText: 'Customer house · Residential District', task: 'Travel to the customer house, clean the 3 marked spots, then finish the job at the house.', timeText: '+2 hours' },
  hauling: { kind: 'hauling', bizId: 'hauling', title: 'Hauling Service — Depot Run', destText: 'Transit Depot → Store', task: 'Load up at the depot by Transit, then deliver the load to the Store.', timeText: '+2 hours' },
  foodstand: { kind: 'foodstand', bizId: 'foodstand', title: 'Food Stand — Serve Orders', destText: 'Food Stand storefront', task: 'Serve 3 customer orders at your Food Stand.', timeText: '+2 hours' },
  transit_route: { kind: 'transit_route', bizId: null, title: 'City Loop Bus Route', destText: 'Depot → Residential → Downtown/Shopping', task: 'Drive the bus route and stop at all 3 stops so passengers can board.', rewardText: '$144 wages (paid Friday) · +40 XP', timeText: '+8 hours' },
  delivery: { kind: 'delivery', bizId: null, title: 'Motorcycle Delivery', destText: 'Store → Residential District', task: 'Collect a package at the Store, ride it to the house, park and hand it over.', rewardText: '$60 cash', timeText: '+1 hour' },
};

function newMission(kind) {
  switch (kind) {
    case 'cleaning': return { kind: 'cleaning', stage: 'go', progress: 0 };
    case 'hauling': return { kind: 'hauling', stage: 'pickup', progress: 0 };
    case 'foodstand': return { kind: 'foodstand', stage: 'serve', progress: 0 };
    case 'transit_route': return { kind: 'transit_route', stage: 'drive', progress: 0, aboard: 0 };
    case 'delivery': return { kind: 'delivery', stage: 'pickup', progress: 0 };
  }
  return null;
}

/* Deliveries done on the given day, from the day-keyed counter
 * (the shipped earnedToday pattern: a stale day stamp reads 0). */
function deliveriesDoneToday(deliveryDay, deliveryCount, day) {
  return deliveryDay === day && Number.isInteger(deliveryCount) && deliveryCount > 0 ? deliveryCount : 0;
}

/* The world point the guide and the interaction button use for
 * the mission's current stage. */
function missionSpot(mission) {
  if (!mission) return null;
  switch (mission.kind) {
    case 'cleaning':
      if (mission.stage === 'work') {
        const s = MISSION_SPOTS.cleaningSpots[Math.min(Math.max(mission.progress, 0), MISSION_SPOTS.cleaningSpots.length - 1)];
        return { x: s.x, y: s.y, name: 'Customer house' };
      }
      return { x: MISSION_SPOTS.cleaningCustomer.x, y: MISSION_SPOTS.cleaningCustomer.y, name: 'Customer house' };
    case 'hauling':
      return mission.stage === 'deliver'
        ? { x: MISSION_SPOTS.haulingDeliver.x, y: MISSION_SPOTS.haulingDeliver.y, name: 'Store' }
        : { x: MISSION_SPOTS.haulingPickup.x, y: MISSION_SPOTS.haulingPickup.y, name: 'Transit Depot' };
    case 'foodstand':
      return { x: MISSION_SPOTS.foodstand.x, y: MISSION_SPOTS.foodstand.y, name: 'Food Stand' };
    case 'transit_route': {
      const s = MISSION_SPOTS.transitStops[Math.min(Math.max(mission.progress, 0), MISSION_SPOTS.transitStops.length - 1)];
      return { x: s.x, y: s.y, name: s.name };
    }
    case 'delivery':
      return mission.stage === 'dropoff'
        ? { x: MISSION_SPOTS.deliveryDropoff.x, y: MISSION_SPOTS.deliveryDropoff.y, name: 'Delivery house' }
        : { x: MISSION_SPOTS.deliveryPickup.x, y: MISSION_SPOTS.deliveryPickup.y, name: 'Store' };
  }
  return null;
}

/* The big interaction button for the current stage, or null
 * when the stage has none (cleaning's travel stage advances on
 * arrival instead). */
function missionActionFor(mission) {
  if (!mission) return null;
  switch (mission.kind) {
    case 'cleaning':
      if (mission.stage === 'work') return { label: 'CLEAN SPOT' };
      if (mission.stage === 'finish') return { label: 'FINISH JOB' };
      return null;
    case 'hauling':
      return mission.stage === 'deliver' ? { label: 'DELIVER LOAD' } : { label: 'LOAD UP' };
    case 'foodstand':
      return { label: 'SERVE ORDER' };
    case 'transit_route':
      return { label: 'STOP & BOARD' };
    case 'delivery':
      return mission.stage === 'dropoff' ? { label: 'PARK & HAND OVER' } : { label: 'COLLECT PACKAGE' };
  }
  return null;
}

function missionObjective(mission) {
  const def = MISSION_DEFS[mission.kind];
  switch (mission.kind) {
    case 'cleaning':
      if (mission.stage === 'go') return { title: def.title, text: 'Go to the customer house in the Residential District.' };
      if (mission.stage === 'work') return { title: def.title, text: 'Clean the marked spots. Spots cleaned: ' + mission.progress + '/3' };
      return { title: def.title, text: 'All spots clean — finish the job at the customer house.' };
    case 'hauling':
      return mission.stage === 'pickup'
        ? { title: def.title, text: 'Load up at the depot by Transit.' }
        : { title: def.title, text: 'Deliver the load to the Store.' };
    case 'foodstand': {
      const order = MISSION_ORDERS[Math.min(Math.max(mission.progress, 0), MISSION_ORDERS.length - 1)];
      return { title: def.title, text: 'Order ' + (mission.progress + 1) + ' of 3: ' + order.item + ' ×' + order.count + ' — Orders served: ' + mission.progress + '/3' };
    }
    case 'transit_route': {
      const stop = MISSION_SPOTS.transitStops[Math.min(Math.max(mission.progress, 0), MISSION_SPOTS.transitStops.length - 1)];
      return { title: def.title, text: 'Next stop: ' + stop.name + ' (Stop ' + (mission.progress + 1) + ' of 3) • Passengers aboard: ' + (mission.aboard || 0) };
    }
    case 'delivery':
      return mission.stage === 'pickup'
        ? { title: def.title, text: 'Collect the package at the Store.' }
        : { title: def.title, text: 'Ride to the house in the Residential District, park and hand over the package.' };
  }
  return { title: def.title, text: '' };
}

/* One interaction tap, as a pure transition. Returns the next
 * mission, { completes: true } when this tap is the completing
 * one (the component then runs the completion planner), or
 * null when the stage has no interaction. */
function missionInteract(mission) {
  if (!mission) return null;
  switch (mission.kind) {
    case 'cleaning':
      if (mission.stage === 'work') {
        if (mission.progress >= 2) return { mission: { kind: 'cleaning', stage: 'finish', progress: 3 } };
        return { mission: { kind: 'cleaning', stage: 'work', progress: mission.progress + 1 } };
      }
      if (mission.stage === 'finish') return { completes: true };
      return null;
    case 'hauling':
      if (mission.stage === 'pickup') return { mission: { kind: 'hauling', stage: 'deliver', progress: 0 } };
      if (mission.stage === 'deliver') return { completes: true };
      return null;
    case 'foodstand':
      if (mission.progress >= 2) return { completes: true };
      return { mission: { kind: 'foodstand', stage: 'serve', progress: mission.progress + 1 } };
    case 'transit_route':
      if (mission.progress >= 2) return { completes: true };
      return { mission: { kind: 'transit_route', stage: 'drive', progress: mission.progress + 1, aboard: (mission.aboard || 0) + (MISSION_TRANSIT_BOARDING[mission.progress] || 0) } };
    case 'delivery':
      if (mission.stage === 'pickup') return { mission: { kind: 'delivery', stage: 'dropoff', progress: 0 } };
      if (mission.stage === 'dropoff') return { completes: true };
      return null;
  }
  return null;
}

/* Arrival advance: cleaning's travel stage becomes the work
 * stage when the player reaches the customer house (the map
 * effect calls this through a functional state update). Any
 * other mission is untouched (null). */
function missionArrive(mission) {
  if (mission && mission.kind === 'cleaning' && mission.stage === 'go')
    return { kind: 'cleaning', stage: 'work', progress: 0 };
  return null;
}

/* Board eligibility for one mission kind against a snapshot of
 * the live state. One active mission at a time; the reasons are
 * the exact board texts. */
function missionEligibility(kind, snap) {
  if (snap.activeMission) {
    return snap.activeMission.kind === kind
      ? { ok: false, active: true, reason: 'This mission is active.' }
      : { ok: false, reason: 'Finish or cancel your current mission first' };
  }
  if (kind === 'cleaning' || kind === 'hauling' || kind === 'foodstand') {
    const biz = BUSINESSES.find((b) => b.id === kind);
    if (!biz || !(snap.ownedBusinesses || []).includes(kind))
      return { ok: false, reason: 'Own the ' + (biz ? biz.name : 'business') + ' to take this mission' };
    if (bizJobsDoneToday(snap.bizWork, kind, snap.day) >= 3)
      return { ok: false, reason: 'Daily limit reached for ' + biz.name };
    return { ok: true };
  }
  if (kind === 'transit_route') {
    if (snap.transitEmployment !== 'hired')
      return { ok: false, reason: 'Get hired as a City Bus Driver at Transit first' };
    if (snap.transitTraining !== 'complete')
      return { ok: false, reason: 'Complete bus driver training at Transit first' };
    if (snap.lastShiftDay === snap.day)
      return { ok: false, reason: "Already used today's shift" };
    return { ok: true };
  }
  if (kind === 'delivery') {
    if (!snap.ownedBikes || snap.ownedBikes.length === 0)
      return { ok: false, reason: 'Own a motorcycle to take this mission' };
    if (deliveriesDoneToday(snap.deliveryDay, snap.deliveryCount, snap.day) >= MISSION_DELIVERY_DAILY_MAX)
      return { ok: false, reason: 'Deliveries done today: 3/3' };
    return { ok: true };
  }
  return { ok: false, reason: 'Unknown mission' };
}

/* The completion planner: re-validates the shipped allowances
 * at finish time (the menu may have taken the last slot since
 * the mission was accepted) and decides the outcome.
 *   'paid'    -- cash pay (business job / delivery): apply pay,
 *                recordEarning, clock, the daily counter, and a
 *                Money History 'job' entry.
 *   'wages'   -- transit route: pending wages + XP + clock +
 *                the shared lastShiftDay flag (payroll money;
 *                no cash, no history entry).
 *   'blocked' -- the earnings cap refuses the pay: the mission
 *                STAYS at its finish stage, allowance
 *                unconsumed, and can finish on a later day.
 *   'ended'   -- the allowance is gone: the mission ends with
 *                an explanation and applies nothing. */
function planMissionCompletion(mission, snap) {
  if (!mission) return { outcome: 'ended', reason: 'none', message: 'No mission was active.' };
  if (mission.kind === 'cleaning' || mission.kind === 'hauling' || mission.kind === 'foodstand') {
    const biz = BUSINESSES.find((b) => b.id === mission.kind);
    if (!biz) return { outcome: 'ended', reason: 'limit', message: 'That business is gone — the mission ended unpaid.' };
    if (bizJobsDoneToday(snap.bizWork, biz.id, snap.day) >= 3)
      return { outcome: 'ended', reason: 'limit', message: 'Daily limit reached for ' + biz.name + ' — the mission ended unpaid.' };
    const pay = businessPay(biz, snap.businessUpgrades);
    if (!canEarn(snap.earnedToday, snap.earnedTodayDay, snap.day, pay)) return { outcome: 'blocked' };
    return { outcome: 'paid', kind: 'business', bizId: biz.id, pay: pay, hours: biz.jobHours };
  }
  if (mission.kind === 'transit_route') {
    if (snap.lastShiftDay === snap.day)
      return { outcome: 'ended', reason: 'shift', message: "Today's work allowance was already used — the route ended unpaid." };
    if (!canEarn(snap.earnedToday, snap.earnedTodayDay, snap.day, TRANSIT_SHIFT_PAY))
      return { outcome: 'ended', reason: 'cap', message: 'Daily earnings limit reached — the route ended unpaid.' };
    return { outcome: 'wages', kind: 'wages', pay: TRANSIT_SHIFT_PAY, xp: TRANSIT_SHIFT_XP, hours: 8 };
  }
  if (mission.kind === 'delivery') {
    if (deliveriesDoneToday(snap.deliveryDay, snap.deliveryCount, snap.day) >= MISSION_DELIVERY_DAILY_MAX)
      return { outcome: 'ended', reason: 'deliveries', message: 'Deliveries are done for today — the mission ended unpaid.' };
    if (!canEarn(snap.earnedToday, snap.earnedTodayDay, snap.day, MISSION_DELIVERY_PAY)) return { outcome: 'blocked' };
    return { outcome: 'paid', kind: 'delivery', pay: MISSION_DELIVERY_PAY, hours: MISSION_DELIVERY_HOURS };
  }
  return { outcome: 'ended', reason: 'none', message: 'The mission ended unpaid.' };
}

/* Save normalization for the active mission: a stored mission
 * survives a reopen only if it is well-formed -- a known kind,
 * a stage that kind can be in, progress inside the stage's
 * range (clamped), and, for business missions, a business the
 * player still owns. Anything else is no mission: null. A
 * normalized mission resumes exactly where it left off and
 * has paid nothing. */
function normalizeMission(value, ownedRaw) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!MISSION_KINDS.includes(value.kind)) return null;
  const owned = normalizeOwnedBusinesses(ownedRaw);
  if ((value.kind === 'cleaning' || value.kind === 'hauling' || value.kind === 'foodstand') && !owned.includes(value.kind)) return null;
  const progress = Number.isInteger(value.progress) ? value.progress : 0;
  switch (value.kind) {
    case 'cleaning': {
      if (!['go', 'work', 'finish'].includes(value.stage)) return null;
      let p = Math.min(Math.max(progress, 0), 3);
      let stage = value.stage;
      if (stage === 'go') p = 0;
      if (stage === 'work' && p >= 3) stage = 'finish';
      if (stage === 'finish') p = 3;
      return { kind: 'cleaning', stage: stage, progress: p };
    }
    case 'hauling':
      if (!['pickup', 'deliver'].includes(value.stage)) return null;
      return { kind: 'hauling', stage: value.stage, progress: 0 };
    case 'foodstand':
      if (value.stage !== 'serve') return null;
      return { kind: 'foodstand', stage: 'serve', progress: Math.min(Math.max(progress, 0), 2) };
    case 'transit_route': {
      if (value.stage !== 'drive') return null;
      const aboard = Number.isInteger(value.aboard) && value.aboard > 0 ? Math.min(value.aboard, 99) : 0;
      return { kind: 'transit_route', stage: 'drive', progress: Math.min(Math.max(progress, 0), 2), aboard: aboard };
    }
    case 'delivery':
      if (!['pickup', 'dropoff'].includes(value.stage)) return null;
      return { kind: 'delivery', stage: value.stage, progress: 0 };
  }
  return null;
}
/* CITY_JOBS_V1_HELPERS_END */

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
          /* LIFE_GOALS_CH2_V1_E03_LOAD_DONE: the whitelist is the
           * whole goal table now (LIFE_GOAL_IDS) -- Chapter 2
           * latches survive reloads instead of being stripped. */
          saved.goalsDone = saved.goalsDone.filter((id) =>
            LIFE_GOAL_IDS.includes(id));
          /* COINS_V1_E05_LOAD: coin fields are new: older saves
           * start with no weekly shift progress. A legacy save
           * whose goals already latched is granted +5 coins per
           * latched goal here, exactly once: the paid ids are
           * recorded in goalCoinsPaid and the mount persist
           * writes them back, so no reload can grant twice.
           * Goals that latch later pay in the latch effect. */
          if (!Array.isArray(saved.goalCoinsPaid))
            saved.goalCoinsPaid = [];
          /* LIFE_GOALS_CH2_V1_E04_LOAD_PAID: same full-table
           * whitelist -- a Chapter 2 goal's payment record
           * survives reloads, so the grant below can never pay
           * it a second time. */
          saved.goalCoinsPaid = saved.goalCoinsPaid.filter((id) =>
            LIFE_GOAL_IDS.includes(id));
          const goalGrant = legacyGoalCoinGrant(saved.coins, saved.goalsDone, saved.goalCoinsPaid);
          saved.coins = goalGrant.coins;
          saved.goalCoinsPaid = goalGrant.goalCoinsPaid;
          if (!Number.isInteger(saved.shiftsThisWeek) || saved.shiftsThisWeek < 0)
            saved.shiftsThisWeek = 0;
          if (!Number.isInteger(saved.shiftsWeekKey))
            saved.shiftsWeekKey = -1;
          if (!Number.isInteger(saved.lastShiftBonusWeek))
            saved.lastShiftBonusWeek = -1;
          /* Life events are new: older saves have no event waiting. */
          if (typeof saved.pendingEvent !== "string" ||
            !["overtime", "friend_loan", "side_gig", "found_wallet", "phone_bill", "credit_workshop", "medical_bill", "tax_refund", "birthday_gift", "broken_phone", "neighbor_moving", "raise_at_work"].includes(saved.pendingEvent)) /* LIFE_EVENTS_V2_E02_WHITELIST */
            saved.pendingEvent = null;
          /* Job choice is new: saves from before it were warehouse-only. */
          if (saved.jobId === undefined || !["none", "warehouse", "cityhall"].includes(saved.jobId))
            saved.jobId = saved.employment === 'none' ? 'none' : 'warehouse';
          saved.inventory = normalizeInventory(saved.inventory);
          /* CHAPTER3_BIZ_V1: businesses are new: older saves start with
           * no business, the clock at 8 AM, no jobs done, menu locked
           * unless savings already reach $1,500 (permanent latch). */
          saved.ownedBusinesses = normalizeOwnedBusinesses(saved.ownedBusinesses);
          /* BUSINESS_UPGRADES_V1_E05_LOAD: business upgrades are new:
           * older saves start with none, and nothing else in the
           * save moves. */
          saved.businessUpgrades = normalizeBusinessUpgrades(saved.businessUpgrades);
          /* COIN_SHOP_V1_E03_LOAD: outfits are new: older saves start
           * owning and wearing the starting outfit; coins and every
           * other field are untouched. */
          saved.ownedOutfits = normalizeOwnedOutfits(saved.ownedOutfits);
          saved.wornOutfit = normalizeWornOutfit(saved.wornOutfit, saved.ownedOutfits);
          /* HOME_DECOR_V1_E03_LOAD: decorations are new: older
           * saves start with none owned or placed, and placed is
           * filtered to owned ids. Coins and every other field
           * are untouched. */
          saved.ownedDecorations = normalizeOwnedDecorations(saved.ownedDecorations);
          saved.placedDecorations = normalizePlacedDecorations(saved.placedDecorations, saved.ownedDecorations);
          /* MY_HOME_INTERIOR_V1_E03_LOAD: the room layout is
           * new: older saves derive it from placedDecorations
           * (nothing owned is lost), a stored layout is
           * sanitized against the piece/spot tables and
           * ownership, and placedDecorations is rewritten
           * from the layout so the two can never disagree.
           * Coins and every other field are untouched. */
          /* FURNITURE_STORE_V1_E03_LOAD: furniture is new:
           * a save with NO ownedFurniture field predates the
           * Furniture Store. Those players already SEE blue
           * curtains, wall art and accent lighting in their
           * room (the interior build drew them as base
           * styling), so they are granted the three pieces
           * and the layout pass below seats them in their
           * slots -- nothing they have is taken away. A save
           * that HAS the field (even an empty list) was made
           * by this build or later and gets no grant: its
           * room starts bare and the shop sells the pieces.
           * Brand-new games never reach this block: they use
           * SKY_INITIAL, whose field is present (empty). */
          const furnitureFieldAbsent = saved.ownedFurniture === undefined;
          saved.ownedFurniture = normalizeFurniture(saved.ownedFurniture);
          if (furnitureFieldAbsent) {
            saved.ownedFurniture = ['curtains', 'wall_art', 'accent_light'];
          }
          saved.homeLayout = normalizeHomeLayout(saved.homeLayout, saved.placedDecorations, saved.ownedDecorations, saved.ownedFurniture, furnitureFieldAbsent);
          saved.placedDecorations = layoutPlacedDecorations(saved.homeLayout);
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
          /* MY_GARAGE_V1_E03_LOAD: the garage display pick is
           * new: older saves have none stored, and a stored
           * pick that is not owned (or not a real bike id)
           * resolves to the first owned bike -- or null when
           * no bike is owned -- instead of persisting a stale
           * value. Nothing else moves on load. */
          saved.displayBike = normalizeDisplayBike(saved.displayBike, saved.ownedBikes);
          /* BIKE_COLORS_V1_E03_LOAD: bike colors are new: older
           * saves start owning and applying the factory color;
           * an applied color that is not owned resolves to the
           * factory color. Coins and every other field are
           * untouched. */
          saved.ownedBikeColors = normalizeOwnedBikeColors(saved.ownedBikeColors);
          saved.appliedBikeColor = normalizeAppliedBikeColor(saved.appliedBikeColor, saved.ownedBikeColors);
          /* MY_MONEY_V1_E03_LOAD: the last-Friday report is new:
           * older saves have none (null, and the MY MONEY screen
           * shows the first-report line -- history is never
           * invented on load). A malformed stored report
           * normalizes to null, or to amounts clamped at zero
           * with collected never above due. */
          saved.lastFridayReport = normalizeLastFridayReport(saved.lastFridayReport);
          /* MONEY_HISTORY_V1_E03_LOAD: money history is new:
           * older saves start with an empty history and record
           * forward from the update -- past transactions are
           * never invented on load. Malformed stored entries
           * are dropped by the normalizer; valid ones keep
           * their stored order. */
          saved.moneyHistory = normalizeMoneyHistory(saved.moneyHistory);
          /* SAVINGS_GOALS_V1_E03_LOAD: the savings goal is
           * new: older saves have none (null, and the SAVINGS
           * GOALS screen invites the player to set their
           * first goal -- nothing is invented on load). A
           * malformed stored goal normalizes to null; a
           * blank stored name falls back to the category
           * name inside the normalizer. */
          saved.savingsGoal = normalizeSavingsGoal(saved.savingsGoal);
          /* EXPLORE_CITY_V1_E03_LOAD: the city position and
           * riding state are new: older saves have neither and
           * start on foot at the HOME entrance. A stored
           * position that is off-world or inside a building
           * resets to that same safe entrance, and riding
           * survives only for a bike the player owns. Nothing
           * else in the save moves. */
          saved.playerPos = normalizePlayerPos(saved.playerPos);
          saved.ridingBike = normalizeRidingBike(saved.ridingBike, saved.ownedBikes);
          /* CITY_JOBS_V1_E05_LOAD: city jobs are new: older saves
           * have no active mission (null -- nothing is invented
           * on load) and a full delivery allowance. A malformed
           * stored mission (unknown kind/stage, a business the
           * player no longer owns) normalizes to null; a valid
           * one resumes mid-mission, unpaid. Bad counter values
           * reset to a fresh day, the earnedToday pattern. */
          saved.activeMission = normalizeMission(saved.activeMission, saved.ownedBusinesses);
          if (!Number.isInteger(saved.deliveryDay)) saved.deliveryDay = -1;
          if (!Number.isInteger(saved.deliveryCount) || saved.deliveryCount < 0) saved.deliveryCount = 0;
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
 * COIN_SHOP_V1_E10_FIGURE: legs is a prop now; its default is the
 * original leg color (#2b3442), so the walkers and any caller that
 * passes nothing render exactly as before. The two player sites
 * pass the worn outfit's shirt and legs colors.
 */
function PlayerFigure({ shirt = '#e8b93c', legs = '#2b3442' }) {
  return (
    <View style={pfig.wrap}>
      <View style={pfig.head} />
      <View style={[pfig.body, { backgroundColor: shirt }]} />
      <View style={pfig.legs}>
        <View style={[pfig.leg, { backgroundColor: legs }]} />
        <View style={[pfig.leg, { backgroundColor: legs }]} />
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
/* EXPLORE_CITY_V1_E14_LIVING: re-pathed onto the explorable
 * city's grid -- the main street is now avenue 1 (world centre
 * y 530 of 1600); walkers keep its north edge (y 470). */
const LIVING_CITY_STREET_Y = 0.33125; // avenue 1 centreline, fraction of world height
const LIVING_CITY_WALK_Y = 0.29375; // walkers use avenue 1's north edge, clear of cars
/* EXPLORE_CITY_V1_E14_DOORS: door points are the CITY_PLACES
 * entrances as fractions of the 2400x1600 world (PLAZA is the
 * park centre). No door keeps the old 0.63 row-2 value, so the
 * street-snap branch in livingCityDoorPoint simply never fires
 * and every route walks door -> avenue 1 -> door as before. */
const LIVING_CITY_DOORS = {
  HOME: { x: 0.358333, y: 0.245 },
  WORK: { x: 0.754167, y: 0.62 },
  CASINO: { x: 0.854167, y: 0.25125 },
  BANK: { x: 0.75, y: 0.25125 },
  TRANSIT: { x: 0.954167, y: 0.62 },
  STORE: { x: 0.8625, y: 0.62 },
  DEALERSHIP: { x: 0.95, y: 0.25125 },
  PLAZA: { x: 0.104167, y: 0.14375 },
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
/* BUS_ON_MAP_V1_E01_DOORPOINT: the street line is now a
 * parameter so the bus can drive the main-street centreline
 * (0.6425) while walkers keep the upper edge (0.6225).
 * Walkers call with no second argument, so v1 routes are
 * byte-identical. */
function livingCityDoorPoint(door, streetY = LIVING_CITY_WALK_Y) {
  const d = LIVING_CITY_DOORS[door];
  if (!d) return { x: 0.5, y: 0.93 };
  if (d.y === 0.63) return { x: d.x, y: streetY };
  return { x: d.x, y: d.y };
}

/* LIVING_CITY_V1: axis-aligned waypoints from door A to door B, using
 * the same lanes the player walks: door column -> main street ->
 * door column. Returns fraction points; the last one is B's door. */
/* BUS_ON_MAP_V1_E02_LEG: street line parameterised (see E01). */
function livingCityLeg(from, to, streetY = LIVING_CITY_WALK_Y) {
  const a = livingCityDoorPoint(from, streetY);
  const b = livingCityDoorPoint(to, streetY);
  const pts = [];
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

/* BUS_ON_MAP_V1_E03_BUS_ROUTES: City Bus #1 runs the City Loop
 * all day -- Depot -> Residential -> Hospital/Civic ->
 * Downtown/Shopping -> Casino District -> Depot. One stop =
 * { door, label, pause } (label is for the sim and test steps
 * only -- nothing is rendered above the bus). The loop closes
 * by returning to TRANSIT; the bus never goes to the plaza or
 * the DEALERSHIP. */
const BUS_STOPS = [
  { door: 'TRANSIT', label: 'Transit Depot', pause: 4 },
  { door: 'HOME', label: 'Residential', pause: 3 },
  { door: 'WORK', label: 'Hospital/Civic', pause: 3 },
  { door: 'STORE', label: 'Downtown/Shopping', pause: 3 },
  { door: 'CASINO', label: 'Casino District', pause: 3 },
];

/* Half the bus figure's bounding box (40x22); the bus rotates
 * about its centre, so the centre is what stays on the lane. */
const BUS_HALF = { x: 20, y: 11 };

/* Bus speed, fraction of map width per second -- faster than
 * the walkers (0.09-0.12) and about the cars' pace, so it reads
 * as a vehicle, not a pedestrian. */
const BUS_SPEED = 0.14;

/* Centre point of the bus at a stop. Row-2 doors sit on the
 * street, so the bus stops on the centreline; row-1 doors stop
 * at the door itself. Same numbers as
 * livingCityDoorPoint(door, 0.6425). */
function busStopPoint(door) {
  const d = LIVING_CITY_DOORS[door];
  if (!d) return { x: 0.5, y: LIVING_CITY_STREET_Y };
  if (d.y === 0.63) return { x: d.x, y: LIVING_CITY_STREET_Y };
  return { x: d.x, y: d.y };
}

/* Build one bus loop as plain step descriptors (the component
 * turns them into Animated composites), same shape as
 * buildErrandSequence: legs (one move step per axis-aligned
 * segment, duration = length / speed, minimum 800 ms), a
 * rotate step before any segment whose axis differs from the
 * current orientation (rotation happens only while stationary
 * at a junction, ~300 ms), then a pause at each stop (the bus
 * waits visibly -- no fading). The loop closes in orientation
 * too: a final rotate back to horizontal is appended when
 * needed, so the next iteration never slides sideways. */
function buildBusSequence(stops, mapSize) {
  const speedPx = BUS_SPEED * mapSize.w; // px per second
  const steps = [];
  const n = stops.length;
  const toPx = (c) => ({ x: c.x * mapSize.w - BUS_HALF.x, y: c.y * mapSize.h - BUS_HALF.y });
  let cur = busStopPoint(stops[0].door);
  let orient = 0; // 0 = horizontal (0deg), 1 = vertical (90deg)
  for (let i = 1; i <= n; i++) {
    const stop = stops[i % n];
    const leg = livingCityLeg(stops[(i - 1) % n].door, stop.door, LIVING_CITY_STREET_Y);
    let from = cur;
    for (const wp of leg) {
      const to = toPx(wp);
      const fromPx = toPx(from);
      const dx = to.x - fromPx.x;
      const dy = to.y - fromPx.y;
      const len = Math.abs(dx) + Math.abs(dy);
      const axis = dx !== 0 ? 0 : 1;
      if (axis !== orient) {
        steps.push({ kind: 'rotate', to: axis, duration: 300 });
        orient = axis;
      }
      const dur = Math.max(800, (len / speedPx) * 1000);
      steps.push({ kind: 'move', to, duration: dur });
      from = wp;
    }
    cur = busStopPoint(stop.door);
    steps.push({ kind: 'pause', duration: stop.pause * 1000 });
  }
  if (orient !== 0) {
    steps.push({ kind: 'rotate', to: 0, duration: 300 });
    orient = 0;
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

/* BUS_ON_MAP_V1_E04_BUS_FIGURE: City Bus #1, shape-built like
 * CarFigure (no emoji). School-bus yellow, dark window band,
 * 2 wheels; symmetric front-to-back, so it never needs a
 * 180 flip. Bounding box 40x22 -- see BUS_HALF. */
function BusFigure() {
  return (
    <View style={busfig.wrap}>
      <View style={busfig.body}>
        <View style={busfig.windows} />
      </View>
      <View style={busfig.wheels}>
        <View style={busfig.wheel} />
        <View style={busfig.wheel} />
      </View>
    </View>
  );
}

const busfig = StyleSheet.create({
  wrap: { alignItems: 'center', width: 40 },
  body: { width: 40, height: 14, borderRadius: 5, backgroundColor: '#ffd23f', justifyContent: 'center' },
  windows: { height: 5, marginHorizontal: 4, borderRadius: 2, backgroundColor: '#1c2530' },
  wheels: { flexDirection: 'row', width: 30, justifyContent: 'space-between', marginTop: 1 },
  wheel: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#1c2530' },
});

/* LIVING_CITY_V1: one ambient actor on the map. Walkers run an errand
 * itinerary; cars shuttle the main street. All animation is native
 * driver, all positions are refs -- nothing here is saved or state.
 * Renders pointerEvents="none" so it can never intercept a tap. */
const AmbientActor = React.memo(function AmbientActor({ mapSize, walker, car, bus, reduceMotion, children }) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current; // BUS_ON_MAP_V1_E05_ACTOR_PROPS: bus only

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
    if (bus) { // BUS_ON_MAP_V1_E06_ACTOR_BUS
      const start = busStopPoint(bus[0].door);
      pos.setValue({ x: start.x * mapSize.w - BUS_HALF.x, y: start.y * mapSize.h - BUS_HALF.y });
      rotation.setValue(0);
      if (reduceMotion) return undefined;
      const anims = buildBusSequence(bus, mapSize).map((s) => {
        if (s.kind === 'move') {
          return Animated.timing(pos, { toValue: s.to, duration: s.duration, easing: Easing.linear, useNativeDriver: true });
        }
        if (s.kind === 'rotate') {
          return Animated.timing(rotation, { toValue: s.to, duration: s.duration, easing: Easing.linear, useNativeDriver: true });
        }
        return Animated.delay(s.duration);
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
      style={[styles.cityActor, { opacity, transform: bus ? [{ translateX: pos.x }, { translateY: pos.y }, { rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) /* BUS_ON_MAP_V1_E07_ROTATE_RENDER */ }] : [{ translateX: pos.x }, { translateY: pos.y }] }]}
    >
      {children}
    </Animated.View>
  );
});


/* EXPLORE_CITY_V1_E15_STATIC: the explorable city's static layers.
 * CityGroundStatic never re-renders (no props): ground, district
 * shading, streets with sidewalks, lane dashes, crosswalks, the
 * park lawn and the decorative houses. CityBuildingsStatic
 * re-renders only when ownership or the guide target changes:
 * building art (Lori's pixel art where it exists), code-drawn
 * storefronts for the property / business sites, signs, and the
 * guide ring. Both layers read CITY_PLACES / CITY_STREETS only. */
const CityGroundStatic = React.memo(function CityGroundStatic() {
  const dashes = [];
  for (const s of CITY_STREETS) {
    if (s.h > s.w) {
      for (let y = s.y + 60; y < s.y + s.h - 40; y += 160) {
        dashes.push(<View key={'dv' + s.x + '-' + y} pointerEvents="none" style={[styles.cityDashV, { left: s.x + s.w / 2 - 3, top: y }]} />);
      }
    } else {
      for (let x = s.x + 60; x < s.x + s.w - 40; x += 160) {
        dashes.push(<View key={'dh' + s.y + '-' + x} pointerEvents="none" style={[styles.cityDashH, { left: x, top: s.y + s.h / 2 - 3 }]} />);
      }
    }
  }
  const crossings = [];
  for (const v of CITY_STREETS.filter((s) => s.h > s.w)) {
    for (const h of CITY_STREETS.filter((s) => s.w > s.h)) {
      for (let i = 0; i < 5; i++) {
        crossings.push(<View key={'cx' + v.x + '-' + h.y + '-' + i} pointerEvents="none" style={[styles.cityCrossH, { left: v.x + 20, top: h.y + 16 + i * 28 }]} />);
        crossings.push(<View key={'cy' + v.x + '-' + h.y + '-' + i} pointerEvents="none" style={[styles.cityCrossV, { left: v.x + 16 + i * 28, top: h.y + 20 }]} />);
      }
    }
  }
  const park = cityPlaceById('park');
  return (
    <View pointerEvents="none" style={styles.cityLayer}>
      <View style={styles.cityGround} />
      <View style={styles.cityEastShade} />
      {CITY_STREETS.map((s) => (
        <View key={'sw' + s.x + '-' + s.y} style={[styles.citySidewalk, { left: s.x - 26, top: s.y - 26, width: s.w + 52, height: s.h + 52 }]} />
      ))}
      {CITY_STREETS.map((s) => (
        <View key={'rd' + s.x + '-' + s.y} style={[styles.cityRoad, { left: s.x, top: s.y, width: s.w, height: s.h }]} />
      ))}
      {dashes}
      {crossings}
      <View style={[styles.cityParkLawn, { left: park.rect.x, top: park.rect.y, width: park.rect.w, height: park.rect.h }]}>
        <Image source={BUILDINGS_V1_ART.park} style={styles.cityParkArt} resizeMode="contain" />
      </View>
      {CITY_SCENERY_RECTS.map((r, i) => (
        <View key={'house' + i} style={[styles.cityHouse, { left: r.x, top: r.y, width: r.w, height: r.h }]}>
          <View style={styles.cityHouseRoof} />
          <View style={styles.cityHouseDoor} />
        </View>
      ))}
    </View>
  );
});

const CityBuildingsStatic = React.memo(function CityBuildingsStatic({ ownedBusinesses, propertiesOwned, guideTargetId, onBuildingPress }) {
  const park = cityPlaceById('park');
  return (
    <View pointerEvents="box-none" style={styles.cityLayer}>
      <View pointerEvents="none" style={[styles.citySign, { position: 'absolute', left: park.rect.x + park.rect.w / 2 - 42, top: park.rect.y + park.rect.h - 36 }]}>
        <Text style={styles.citySignText}>PARK</Text>
      </View>
      {CITY_PLACES.filter((p) => p.kind !== 'zone').map((p) => {
        const owned = cityPlaceOwned(p, ownedBusinesses, propertiesOwned);
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.85}
            style={[styles.cityBuildingTouch, { left: p.rect.x, top: p.rect.y, width: p.rect.w, height: p.rect.h }]}
            onPress={() => onBuildingPress(p)}
          >
            <View style={styles.cityPad} />
            {p.art ? (
              <Image source={BUILDINGS_V1_ART[p.art]} style={styles.cityBuildingArt} resizeMode="contain" />
            ) : (
              <View style={[styles.cityStorefront, { backgroundColor: p.kind === 'property' ? '#4a3b26' : '#31435c' }]}>
                <View style={styles.cityStoreRoof} />
                <View style={styles.cityStoreDoor} />
              </View>
            )}
            <View style={styles.citySign}>
              <Text style={styles.citySignText}>{p.sign}</Text>
              {(p.kind === 'business' || p.kind === 'property') && (
                <Text style={owned ? styles.cityOwnedTag : styles.cityNotOwnedTag}>{owned ? 'OWNED' : 'NOT OWNED'}</Text>
              )}
            </View>
            {guideTargetId === p.id && <View pointerEvents="none" style={styles.cityGuideRing} />}
          </TouchableOpacity>
        );
      })}
    </View>
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
    /* MONEY_HISTORY_V1_E12_HOOK_STORE: record-only. This
     * line runs only on the gate's success path -- a
     * blocked, already-owned or unaffordable tap returned
     * above and logs nothing -- and the amount is the
     * exact price the gate just deducted: cash before
     * minus cash after. No amount or guard changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: STORE_ITEMS.find((entry) => entry.id === itemId).name, amount: cash - result.cash, balance: 'cash' }));
  };

  /* HARLEY_V1_STATE: dealership UI state. selectedBikeId opens the
   * detail view, confirmBikeId opens the buy confirmation. Neither is
   * saved -- reopening the app lands back on the bike list. */
  const [ownedBikes, setOwnedBikes] = useState(() => normalizeOwnedBikes(initialSave.ownedBikes));
  /* MY_GARAGE_V1_E06_STATE: which owned bike is on display in
   * MY GARAGE (persisted with the save). Starts from the
   * load-normalized pick; the garage screen reads the
   * effective pick through effectiveDisplayBike, so a null
   * pick still shows the first owned bike. */
  const [displayBike, setDisplayBike] = useState(() => normalizeDisplayBike(initialSave.displayBike, normalizeOwnedBikes(initialSave.ownedBikes)));
  /* BIKE_COLORS_V1_E06_STATE: owned bike colors and the one
   * applied to the displayed bike (persisted with the save);
   * the garage color message is transient. */
  const [ownedBikeColors, setOwnedBikeColors] = useState(() => normalizeOwnedBikeColors(initialSave.ownedBikeColors));
  const [appliedBikeColor, setAppliedBikeColor] = useState(() => normalizeAppliedBikeColor(initialSave.appliedBikeColor, normalizeOwnedBikeColors(initialSave.ownedBikeColors)));
  const [bikeColorMessage, setBikeColorMessage] = useState('');
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
    /* MONEY_HISTORY_V1_E13_HOOK_BIKE: record-only. This
     * line runs only on the gate's success path -- an
     * unaffordable or already-owned confirm returned
     * above and logs nothing -- and the amount is the
     * exact price the gate just deducted from cash. The
     * label is the bike's own full name. No amount or
     * guard changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: BIKES.find((entry) => entry.id === confirmBikeId).name, amount: cash - result.cash, balance: 'cash' }));
  };

  /* MY_GARAGE_V1_E07_HANDLER: choose which owned bike is on
   * display in MY GARAGE. Free and unlimited, and only
   * accepts bikes the player owns. Selection ONLY -- no
   * balance is read or written here or anywhere in the
   * garage, and nothing is bought or sold. */
  const chooseDisplayBike = (bikeId) => {
    if (!ownedBikes.includes(bikeId)) return;
    setDisplayBike(bikeId);
  };

  /* BIKE_COLORS_V1_E07_HANDLER: buy a bike color with coins,
   * mirroring buyOutfit. The pure gate returns absolute coins
   * and owned values, so a double-tap in one batch charges
   * exactly once. Coins only -- no other balance is touched,
   * and buying does not apply the color. Applying is free,
   * unlimited, and only accepts colors the player owns; it
   * repaints whichever bike is on display. */
  const buyBikeColor = (colorId) => {
    const result = purchaseBikeColor(coins, ownedBikeColors, colorId);
    setBikeColorMessage(result.message);
    if (!result.ok) return;
    setCoins(result.coins);
    setOwnedBikeColors(result.owned);
  };

  const applyBikeColor = (colorId) => {
    if (!ownedBikeColors.includes(colorId)) return;
    setAppliedBikeColor(colorId);
    setBikeColorMessage('Your bike is now ' + bikeColorById(colorId).name + '.');
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
  const [slotOutcome, setSlotOutcome] = useState(null); /* CASINO_RESULTS_V1_SLOTS_STATE */

  /* CASINO_V1_STATE: spin the slots. Bet leaves cash first, then
   * the reels are drawn and any prize is added once. The pending
   * ref blocks a double-tap from betting twice before React
   * commits the new balance (same guard as the store). */
  const spinSlotsGame = (bet) => {
    if (casinoPending.current) return;
    if (!Number.isFinite(cash) || cash < bet) {
      setSlotOutcome(null); /* CASINO_RESULTS_V1_SLOTS_CLEAR */
      setSlotResult('Not enough cash. You need $' + bet + ' to spin.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_SLOTS_BLOCK */
      setSlotOutcome(null); /* CASINO_RESULTS_V1_SLOTS_CLEAR_LIMIT */
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
    setSlotOutcome(casinoResultInfo(bet, returned)); /* CASINO_RESULTS_V1_SLOTS_SET */
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
  const [bjOutcome, setBjOutcome] = useState(null); /* CASINO_RESULTS_V1_BJ_STATE */

  /* CASINO_V1_STATE: deal a blackjack round. The bet leaves cash
   * at DEAL; a natural on either side ends the round at once,
   * otherwise the player hits or stands. Leaving the table mid-hand
   * forfeits the bet (it is already deducted). */
  const dealBlackjack = (bet) => {
    if (casinoPending.current || bjPhase !== 'idle') return;
    if (!Number.isFinite(cash) || cash < bet) {
      setBjOutcome(null); /* CASINO_RESULTS_V1_BJ_CLEAR_NOCASH */
      setBjMessage('Not enough cash. You need $' + bet + ' to play.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_BJ_BLOCK */
      setBjOutcome(null); /* CASINO_RESULTS_V1_BJ_CLEAR_LIMIT */
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
      setBjOutcome(casinoResultInfo(bet, returned)); /* CASINO_RESULTS_V1_BJ_NATURAL_SET */
      setBjMessage(
        returned > bet
          ? 'Blackjack! You won $' + (returned - bet) + '. Cash: $' + after + '.'
          : returned === bet
            ? 'Both have blackjack — push. Your $' + bet + ' is back. Cash: $' + after + '.'
            : 'Dealer has blackjack. You lost $' + bet + '. Cash: $' + after + '.'
      );
      return;
    }
    setBjOutcome(null); /* CASINO_RESULTS_V1_BJ_CLEAR */
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
      setBjOutcome(casinoResultInfo(bjBet, 0)); /* CASINO_RESULTS_V1_BJ_BUST_SET */
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
    setBjOutcome(casinoResultInfo(bjBet, returned)); /* CASINO_RESULTS_V1_BJ_STAND_SET */
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
  const [rouletteOutcome, setRouletteOutcome] = useState(null); /* CASINO_RESULTS_V1_ROULETTE_STATE */

  /* CASINO_V1_STATE: spin the roulette wheel. Bet leaves cash
   * first, then the pocket is drawn and a correct color is paid
   * once. Same double-tap guard as the other games. */
  const spinRouletteGame = (bet) => {
    if (casinoPending.current) return;
    if (!roulettePick) {
      setRouletteOutcome(null); /* CASINO_RESULTS_V1_ROULETTE_CLEAR_PICK */
      setRouletteResult('Pick RED or BLACK first.');
      return;
    }
    if (!Number.isFinite(cash) || cash < bet) {
      setRouletteOutcome(null); /* CASINO_RESULTS_V1_ROULETTE_CLEAR_NOCASH */
      setRouletteResult('Not enough cash. You need $' + bet + ' to play.');
      return;
    }
    if (earnedTodayValue >= DAILY_LIMIT) { /* DAILY_LIMIT_V1_ROULETTE_BLOCK */
      setRouletteOutcome(null); /* CASINO_RESULTS_V1_ROULETTE_CLEAR_LIMIT */
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
    setRouletteOutcome(casinoResultInfo(bet, returned)); /* CASINO_RESULTS_V1_ROULETTE_SET */
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
    /* MONEY_HISTORY_V1_E14_HOOK_BUSINESS: record-only.
     * Success path only -- a blocked, already-owned or
     * unaffordable call returned above and logs nothing.
     * The amount is the exact price the gate just
     * deducted from savings. No amount or guard
     * changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: BUSINESSES.find((entry) => entry.id === businessId).name, amount: savings - result.savings, balance: 'savings' }));
  };

  /* BUSINESS_UPGRADES_V1_E07_HANDLER: buy a business's one upgrade
   * with savings, mirroring buyBusiness. The pure gate returns
   * absolute savings/upgrade values, so confirming twice in one
   * batch charges exactly once, and once owned the gate keeps every
   * later call a no-op. The confirm step always closes. */
  const buyBusinessUpgrade = (businessId) => {
    const result = purchaseBusinessUpgrade(savings, ownedBusinesses, businessUpgrades, businessId);
    setBizMessage(result.message);
    setBizUpgradeConfirm(null);
    if (!result.ok) return;
    setSavings(result.savings);
    setBusinessUpgrades(result.upgrades);
    /* MONEY_HISTORY_V1_E15_HOOK_UPGRADE: record-only.
     * Success path only -- a blocked or unaffordable
     * confirm returned above and logs nothing. The label
     * is the upgrade's own name (e.g. Pro Cleaning Crew)
     * and the amount is the exact cost the gate just
     * deducted from savings. No amount or guard
     * changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: BUSINESSES.find((entry) => entry.id === businessId).upgradeName, amount: savings - result.savings, balance: 'savings' }));
  };

  /* COIN_SHOP_V1_E07_HANDLER: buy an outfit with coins, mirroring
   * buyBusinessUpgrade. The pure gate returns absolute coins and
   * owned values, so confirming twice in one batch charges
   * exactly once. Coins only -- no other balance is touched, and
   * buying does not wear the outfit. Wearing is free, unlimited,
   * and only accepts outfits the player owns. */
  const buyOutfit = (outfitId) => {
    const result = purchaseOutfit(coins, ownedOutfits, outfitId);
    setOutfitMessage(result.message);
    if (!result.ok) return;
    setCoins(result.coins);
    setOwnedOutfits(result.owned);
  };

  const wearOutfit = (outfitId) => {
    if (!ownedOutfits.includes(outfitId)) return;
    setWornOutfit(outfitId);
    setOutfitMessage('You are now wearing ' + outfitById(outfitId).name + '.');
  };

  /* HOME_DECOR_V1_E07_HANDLER: buy a decoration with coins,
   * mirroring buyOutfit. The pure gate returns absolute coins
   * and owned values, so a double-tap in one batch charges
   * exactly once. Coins only -- no other balance is touched,
   * and buying does not place the decoration. Placing and
   * removing are free and unlimited, and only accept owned /
   * placed decorations; removing never un-owns. */
  const buyDecoration = (decorationId) => {
    const result = purchaseDecoration(coins, ownedDecorations, decorationId);
    setDecorMessage(result.message);
    if (!result.ok) return;
    setCoins(result.coins);
    setOwnedDecorations(result.owned);
  };

  const placeDecoration = (decorationId) => {
    if (!ownedDecorations.includes(decorationId)) return;
    if (placedDecorations.includes(decorationId)) return;
    setPlacedDecorations([...placedDecorations, decorationId]);
    setDecorMessage(decorationById(decorationId).name + ' is in your room.');
  };

  const removeDecoration = (decorationId) => {
    if (!placedDecorations.includes(decorationId)) return;
    setPlacedDecorations(placedDecorations.filter((id) => id !== decorationId));
    setDecorMessage(decorationById(decorationId).name + ' was put away. You still own it.');
  };

  /* MY_HOME_INTERIOR_V1_E07_HANDLERS: decorate-mode actions.
   * Rearranging is free and unlimited and never touches
   * coins or any balance; buying still runs only through
   * buyDecoration above (the shipped purchaseDecoration
   * gate). applyHomeLayout writes the layout and re-derives
   * placedDecorations from it on every change, so the two
   * stores can never disagree. Selection is transient. */
  const applyHomeLayout = (nextLayout) => {
    setHomeLayout(nextLayout);
    setPlacedDecorations(layoutPlacedDecorations(nextLayout));
  };

  const selectHomePiece = (pieceId) => {
    if (homeSelectedPiece === pieceId) { setHomeSelectedPiece(null); return; }
    if (!isHomePieceAvailable(pieceId, ownedDecorations, ownedFurniture)) return; /* FURNITURE_STORE_V1_E08A_SELECT: selection reads the ownership union. */
    setHomeSelectedPiece(pieceId);
  };

  /* FURNITURE_STORE_V1_E08B_TAP: one tap handler serves
   * floor spots and wall slots alike -- placeHomePieceAt
   * validates which locations the selected piece may take,
   * and the message names the landing through the shared
   * spot-or-slot lookup. */
  const tapHomeSpot = (spotId) => {
    if (!homeSelectedPiece) return;
    const next = placeHomePieceAt(homeLayoutNow, homeSelectedPiece, spotId, ownedDecorations, ownedFurniture);
    if (next === homeLayoutNow) return;
    applyHomeLayout(next);
    setDecorMessage(homePieceById(homeSelectedPiece).name + ' is now ' + homeLocationById(spotId).name + '.');
  };

  const putAwaySelectedHomePiece = () => {
    if (!homeSelectedPiece) return;
    const next = takeHomePieceOut(homeLayoutNow, homeSelectedPiece);
    if (next !== homeLayoutNow) {
      applyHomeLayout(next);
      setDecorMessage(homePieceById(homeSelectedPiece).name + ' was put away. You still own it.');
    }
    setHomeSelectedPiece(null);
  };

  /* FURNITURE_STORE_V1_E08C_HANDLER: buy furniture with
   * cash, mirroring buyStoreItem. The pure gate returns
   * absolute cash and owned values; the pending ref blocks
   * a second confirm landing in the same batch, and the
   * gate itself refuses an already-owned piece, so a
   * purchase is charged exactly once however it is tapped.
   * The Money History line runs only on the success path,
   * with the item's own name and the exact price the gate
   * deducted -- the STORE purchase shape. Cash only:
   * savings, credit, coins and XP are never touched here.
   * Buying does not place the piece; placing is free in
   * DECORATE mode. */
  const furniturePurchasePending = useRef(false);
  const buyFurniture = (itemId) => {
    if (furniturePurchasePending.current) return;
    const result = purchaseFurniture(cash, ownedFurniture, ownedDecorations, itemId);
    setFurnitureMessage(result.message);
    setFurnitureConfirm(null);
    if (!result.ok) return;
    furniturePurchasePending.current = true;
    setCash(result.cash);
    setOwnedFurniture(result.ownedFurniture);
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: FURNITURE.find((entry) => entry.id === itemId).name, amount: cash - result.cash, balance: 'cash' }));
  };

  /* CHAPTER3_BIZ_V1: work one business job. PROPOSED rules (flagged):
   * pay goes straight to cash (business income, not Friday wages);
   * up to 3 jobs per owned business per in-game day (Zabby revised
   * Oct 31); each job advances the clock 2 hours; no XP. */
  const workBusinessJob = (businessId) => {
    const biz = BUSINESSES.find((entry) => entry.id === businessId);
    if (!biz || !ownedBusinesses.includes(businessId) || bizJobPending.current) return;
    /* BUSINESS_UPGRADES_V1_E08_JOB_PAY: one effective pay feeds the
     * daily-limit check below, the cash award, the daily record and
     * the completion message, so an upgraded business counts toward
     * the $1,500 cap at its new rate everywhere. */
    const pay = businessPay(biz, businessUpgrades);
    const doneToday = bizJobsDoneToday(bizWork, businessId, day);
    if (doneToday >= 3) {
      setBizMessage('You already worked 3 ' + biz.name + ' jobs today. Come back tomorrow.');
      return;
    }
    if (!canEarn(earnedToday, earnedTodayDay, day, pay)) { /* DAILY_LIMIT_V1_BIZ_BLOCK */
      setBizMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    bizJobPending.current = true;
    setCash((c) => c + pay);
    recordEarning(pay); /* DAILY_LIMIT_V1_BIZ_RECORD */
    setHours((h) => h + biz.jobHours);
    setBizWork((prev) => ({ ...prev, [businessId]: { day, count: doneToday + 1 } }));
    setBizMessage('Job complete! ' + biz.name + ' paid $' + pay + '.');
  };

  /* CHAPTER3_INV_V1: buy/sell investments + buy property (agreed rules,
   * Oct 31). Bond $500, pays $10 cash every Friday, sells back for the
   * full $500. Fund $1,000, value win/win/lose, sells for its current
   * value; the cycle persists across selling and rebuying. Properties
   * are bought from savings, credit-gated; SELL_PROPERTIES_V1_E02_COMMENT:
   * a property can be sold back at its full buy price, paid to cash. */
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
    /* MONEY_HISTORY_V1_E16_HOOK_PROPERTY: record-only.
     * Every guard above (unknown property, the
     * investPending double-tap ref, already owned, credit,
     * savings) has passed, so this purchase just happened
     * exactly once, for prop.price from savings. The SALE
     * handler below is deliberately NOT hooked: property
     * sale proceeds are not logged in v1. No amount or
     * guard in this handler changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: prop.name, amount: prop.price, balance: 'savings' }));
  };
  /* SELL_PROPERTIES_V1_E03_HANDLER: sell a property back at its full
   * buy price, paid to cash. The investPending ref is set synchronously
   * before any state update, so a double-tapped Confirm cannot pay
   * twice (the same guard sellBond/sellFund use); the ownership check
   * then keeps every later call a no-op. The sale never touches
   * lastInvestPayday, so Friday rent stays exactly-once per Friday and
   * rent already paid that Friday is never clawed back. Sale proceeds
   * do not count toward the daily earnings limit. */
  const sellProperty = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || investPending.current || !propertiesOwned.includes(prop.id)) return;
    investPending.current = true;
    setPropertiesOwned((prev) => prev.filter((id) => id !== prop.id));
    setCash((c) => c + prop.price);
    setPropertySaleConfirm(null);
    setPropertyMessage('You sold the ' + prop.name + ' for $' + prop.price + ' cash.');
  };

  const [savings, setSavings] = useState(initialSave.savings);
  const [credit, setCredit] = useState(initialSave.credit);
  const [xp, setXp] = useState(initialSave.xp);
  const [coins, setCoins] = useState(initialSave.coins);
  /* COINS_V1_E03_STATE: goalCoinsPaid records which life goals
   * have already paid their +5 coins (the load migration fills
   * it for older saves). shiftsThisWeek / shiftsWeekKey count
   * regular paid shifts in the current in-game week;
   * lastShiftBonusWeek is the last week that paid the bonus. */
  const [goalCoinsPaid, setGoalCoinsPaid] = useState(Array.isArray(initialSave.goalCoinsPaid) ? initialSave.goalCoinsPaid : []);
  const [shiftsThisWeek, setShiftsThisWeek] = useState(Number.isInteger(initialSave.shiftsThisWeek) && initialSave.shiftsThisWeek >= 0 ? initialSave.shiftsThisWeek : 0);
  const [shiftsWeekKey, setShiftsWeekKey] = useState(Number.isInteger(initialSave.shiftsWeekKey) ? initialSave.shiftsWeekKey : -1);
  const [lastShiftBonusWeek, setLastShiftBonusWeek] = useState(Number.isInteger(initialSave.lastShiftBonusWeek) ? initialSave.lastShiftBonusWeek : -1);
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
  /* MY_MONEY_V1_E04_STATE: the recorded last-Friday income
   * report (persisted; null until the first Friday payday is
   * recorded). Written only by the payment-moment recorders
   * through their hooks; read by the MY MONEY screen. */
  const [lastFridayReport, setLastFridayReport] = useState(() => normalizeLastFridayReport(initialSave.lastFridayReport));
  /* MONEY_HISTORY_V1_E04_STATE: the persisted transaction
   * history (newest first, persisted; [] until the first
   * transaction is recorded). Written only by the money
   * handlers' record-only MONEY_HISTORY hooks; read by the
   * MONEY HISTORY screen at the BANK. */
  const [moneyHistory, setMoneyHistory] = useState(() => normalizeMoneyHistory(initialSave.moneyHistory));
  /* SAVINGS_GOALS_V1_E04_STATE: the player's one savings
   * goal (persisted; null until set). Written only by the
   * SAVINGS GOALS screen (SAVE GOAL through its validation
   * gate, REMOVE GOAL clearing it) through setSavingsGoal.
   * Progress is never stored -- the screen derives it live
   * from savings with goalProgress. */
  const [savingsGoal, setSavingsGoal] = useState(() => normalizeSavingsGoal(initialSave.savingsGoal));
  /* SAVINGS_GOALS_V1_E04_FORM_STATE: transient goal-form
   * state (never saved): whether the form is open over an
   * existing goal, the form's category / name / target
   * inputs, and the validation message. The form starts on
   * the first category with the name prefilled to match,
   * per the form's prefill rule. */
  const [goalEditing, setGoalEditing] = useState(false);
  const [goalCategoryInput, setGoalCategoryInput] = useState(SAVINGS_GOAL_CATEGORIES[0]);
  const [goalNameInput, setGoalNameInput] = useState(SAVINGS_GOAL_CATEGORIES[0]);
  const [goalTargetInput, setGoalTargetInput] = useState('');
  const [goalError, setGoalError] = useState('');
  const [lastShiftDay, setLastShiftDay] = useState(initialSave.lastShiftDay);
  const [housing, setHousing] = useState(initialSave.housing);
  const [housingMessage, setHousingMessage] = useState("");
  const [goalsDone, setGoalsDone] = useState(initialSave.goalsDone);
  /* LIFE_GOALS_CH3_V1_E06_STATE: the latest goal-completion
   * message(s) -- "[Goal name] complete! +5 coins." -- shown at
   * the head of the LIFE GOALS section. Same per-section
   * transient-message pattern as housingMessage; never saved. */
  const [goalMessage, setGoalMessage] = useState('');
  const [pendingEvent, setPendingEvent] = useState(initialSave.pendingEvent);
  const [eventMessage, setEventMessage] = useState('');
  const [housingConfirm, setHousingConfirm] = useState(false);
  const [jobId, setJobId] = useState(initialSave.jobId);
  /* CHAPTER3_BIZ_V1: owned businesses, the day clock, jobs done per
   * business today (bizWork maps business id -> { day, count }), and
   * the permanent business-menu unlock latch. */
  const [ownedBusinesses, setOwnedBusinesses] = useState(() => normalizeOwnedBusinesses(initialSave.ownedBusinesses));
  /* BUSINESS_UPGRADES_V1_E06_STATE: owned business upgrades
   * (persisted with the save) and which business, if any, is
   * showing its upgrade confirmation step (transient, never saved). */
  const [businessUpgrades, setBusinessUpgrades] = useState(() => normalizeBusinessUpgrades(initialSave.businessUpgrades));
  const [bizUpgradeConfirm, setBizUpgradeConfirm] = useState(null);
  /* COIN_SHOP_V1_E06_STATE: owned outfits and the one being worn
   * (persisted with the save); the shop message is transient. */
  const [ownedOutfits, setOwnedOutfits] = useState(() => normalizeOwnedOutfits(initialSave.ownedOutfits));
  const [wornOutfit, setWornOutfit] = useState(() => normalizeWornOutfit(initialSave.wornOutfit, normalizeOwnedOutfits(initialSave.ownedOutfits)));
  const [outfitMessage, setOutfitMessage] = useState('');
  /* HOME_DECOR_V1_E06_STATE: owned and placed decorations
   * (persisted with the save); the decor message is transient. */
  const [ownedDecorations, setOwnedDecorations] = useState(() => normalizeOwnedDecorations(initialSave.ownedDecorations));
  /* MY_HOME_INTERIOR_V1_E06_STATE: the room layout for this
   * save, normalized once here (deriving from the stored
   * placedDecorations for pre-interior saves) so the
   * placedDecorations and homeLayout states start in sync:
   * the layout is the source of truth, placed derives from
   * it. Decorate mode and the selected piece are transient. */
  const initialHomeLayout = normalizeHomeLayout(initialSave.homeLayout, normalizePlacedDecorations(initialSave.placedDecorations, normalizeOwnedDecorations(initialSave.ownedDecorations)), normalizeOwnedDecorations(initialSave.ownedDecorations), normalizeFurniture(initialSave.ownedFurniture)); /* FURNITURE_STORE_V1_E07A_INITCALL: the layout sanitize reads furniture ownership too (union). */
  const [placedDecorations, setPlacedDecorations] = useState(() => layoutPlacedDecorations(initialHomeLayout));
  const [decorMessage, setDecorMessage] = useState('');
  const [homeLayout, setHomeLayout] = useState(initialHomeLayout);
  const [homeDecorating, setHomeDecorating] = useState(false);
  const [homeSelectedPiece, setHomeSelectedPiece] = useState(null);
  /* FURNITURE_STORE_V1_E07B_STATE: cash-bought furniture
   * (persisted with the save) and the Furniture Shop's
   * transient UI state -- the open confirm, the shop
   * message, and which door the shop was opened from.
   * None of the transients is saved. */
  const [ownedFurniture, setOwnedFurniture] = useState(() => normalizeFurniture(initialSave.ownedFurniture));
  /* FURNITURE_STORE_V1_1_FIX: the pending-reset effect lives BELOW the
   * ownedFurniture declaration -- its dependency array is evaluated during
   * render, so referencing the state above its declaration crashed the
   * app on load (TDZ). Same effect, safe position. */
  React.useEffect(() => { furniturePurchasePending.current = false; }, [cash, ownedFurniture]);
  const [furnitureConfirm, setFurnitureConfirm] = useState(null);
  const [furnitureMessage, setFurnitureMessage] = useState('');
  const [furnitureReturn, setFurnitureReturn] = useState(null);
  /* MY_HOME_INTERIOR_V1_E06_NOW: the layout in force. Null
   * happens only right after a restart (fresh game, not yet
   * re-housed), where the defaults re-derive on the fly. */
  const homeLayoutNow = homeLayout || defaultHomeLayout(placedDecorations, ownedDecorations, ownedFurniture); /* FURNITURE_STORE_V1_E07C_NOW */
  /* COIN_SHOP_V1: the worn outfit's colors, read by both player
   * figure sites (the city map and the warehouse scene). */
  const wornOutfitDef = outfitById(wornOutfit);
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
  /* SELL_PROPERTIES_V1_E01_STATE: which property (if any) is showing
   * its sell confirmation step. Transient UI state, never saved. */
  const [propertySaleConfirm, setPropertySaleConfirm] = useState(null);
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
  /* EXPLORE_CITY_V1_E04_STATE: the explorable-city position and
   * riding state (persisted with the save -- cityPos is stored
   * under the playerPos save key; the name differs because the
   * warehouse scene already uses a playerPos ref). The direction,
   * walk target, guide and viewport values are transient map UI
   * state, never saved. */
  const [cityPos, setCityPos] = useState(() => normalizePlayerPos(initialSave.playerPos));
  const [ridingBike, setRidingBike] = useState(() => normalizeRidingBike(initialSave.ridingBike, normalizeOwnedBikes(initialSave.ownedBikes)));
  const cityPosRef = useRef(cityPos);
  const cityDirRef = useRef({ x: 0, y: 0 });
  const cityWalkTargetRef = useRef(null);
  const [cityWalkTarget, setCityWalkTarget] = useState(null);
  const [guideTargetId, setGuideTargetId] = useState(null);
  const [findOpen, setFindOpen] = useState(false);
  const [cityView, setCityView] = useState({ w: 0, h: 0 });
  const cityWorldRef = useRef(null);
  const cityBlockedRef = useRef(0);
  const lastEnteredRef = useRef(null);
  /* CITY_JOBS_V1_E06_STATE: the active city mission and the
   * day-keyed delivery counter (persisted -- a reopened game
   * resumes the mission exactly where it stopped, unpaid).
   * The summary panel and the notice line are transient map UI,
   * never saved: if the app closes on the summary, the money
   * was already applied exactly once and the mission is null. */
  const [activeMission, setActiveMission] = useState(() => normalizeMission(initialSave.activeMission, initialSave.ownedBusinesses));
  const [deliveryDay, setDeliveryDay] = useState(Number.isInteger(initialSave.deliveryDay) ? initialSave.deliveryDay : -1);
  const [deliveryCount, setDeliveryCount] = useState(Number.isInteger(initialSave.deliveryCount) && initialSave.deliveryCount >= 0 ? initialSave.deliveryCount : 0);
  const [missionSummary, setMissionSummary] = useState(null);
  const [missionNotice, setMissionNotice] = useState('');
  /* Exactly-once token for mission taps, the transitBoardRef
   * pattern: one token per (kind, stage, progress, day) state,
   * set synchronously before any effect is applied, so a
   * double-tap inside one render can never fire twice. Accept
   * and cancel re-arm it by clearing. */
  const missionTokenRef = useRef('');

  React.useEffect(() => {
    /* CHAPTER3_BIZ_V1: persist business fields. */
    /* CHAPTER3_INV_V1: persist investment fields. */
    /* HARLEY_V1_PERSIST: persist owned bikes. */
    persistSave({ step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, businessUpgrades /* BUSINESS_UPGRADES_V1_E09_PERSIST_OBJ */, hours, bizWork, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, lastInvestPayday, investmentsUnlocked, ownedBikes /* TRANSIT_V1_PERSIST_OBJ */ , earnedToday, earnedTodayDay /* DAILY_LIMIT_V1_PERSIST_OBJ */, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive, goalCoinsPaid, shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek /* COINS_V1_E07_PERSIST_OBJ */, ownedOutfits, wornOutfit /* COIN_SHOP_V1_E04_PERSIST_OBJ */, ownedDecorations, placedDecorations /* HOME_DECOR_V1_E04_PERSIST_OBJ */, displayBike /* MY_GARAGE_V1_E04_PERSIST_OBJ */, ownedBikeColors, appliedBikeColor /* BIKE_COLORS_V1_E04_PERSIST_OBJ */, lastFridayReport /* MY_MONEY_V1_E05_PERSIST_OBJ */, moneyHistory /* MONEY_HISTORY_V1_E05_PERSIST_OBJ */, savingsGoal /* SAVINGS_GOALS_V1_E05_PERSIST_OBJ */, playerPos: cityPos, ridingBike /* EXPLORE_CITY_V1_E05_PERSIST_OBJ */, activeMission, deliveryDay, deliveryCount /* CITY_JOBS_V1_E07_PERSIST_OBJ */, homeLayout /* MY_HOME_INTERIOR_V1_E04_PERSIST_OBJ */, ownedFurniture /* FURNITURE_STORE_V1_E09A_PERSIST_OBJ */ });
  }, [step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, businessUpgrades /* BUSINESS_UPGRADES_V1_E10_PERSIST_DEPS */, hours, bizWork, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, lastInvestPayday, investmentsUnlocked, ownedBikes, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive, earnedToday, earnedTodayDay, goalCoinsPaid, shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek, ownedOutfits, wornOutfit /* COIN_SHOP_V1_E05_PERSIST_DEPS */, ownedDecorations, placedDecorations /* HOME_DECOR_V1_E05_PERSIST_DEPS */, displayBike /* MY_GARAGE_V1_E05_PERSIST_DEPS */, ownedBikeColors, appliedBikeColor /* BIKE_COLORS_V1_E05_PERSIST_DEPS */, lastFridayReport /* MY_MONEY_V1_E06_PERSIST_DEPS */, moneyHistory /* MONEY_HISTORY_V1_E06_PERSIST_DEPS */, savingsGoal /* SAVINGS_GOALS_V1_E06_PERSIST_DEPS */, cityPos, ridingBike /* EXPLORE_CITY_V1_E06_PERSIST_DEPS */, activeMission, deliveryDay, deliveryCount /* CITY_JOBS_V1_E08_PERSIST_DEPS */, homeLayout /* MY_HOME_INTERIOR_V1_E05_PERSIST_DEPS */, ownedFurniture /* FURNITURE_STORE_V1_E09B_PERSIST_DEPS */, /* COINS_V1_E08_PERSIST_DEPS */ /* DAILY_LIMIT_V1_PERSIST_DEPS */ /* TRANSIT_V1_PERSIST_DEPS */ persistSave]);

  /* GOALS_GATE_V1_LATCH: latch newly met life goals. Counts from day
   * one; existing progress (e.g. credit) counts too. Completion
   * latches: once met, a goal stays met even if the balance drops.
   * LIFE_GOALS_CH2_V1_E05_LATCH: the predicate is lifeGoalMet for
   * every kind (savings, credit, and the Chapter 2 ownership
   * counts), and the effect also re-runs when a business, an
   * upgrade or a property is gained, so a Chapter 2 goal latches
   * -- and pays its +5 coins below -- through this same pass the
   * moment its condition is met, including on mount for a save
   * that already qualifies.
   * LIFE_GOALS_CH3_V1_E04_LATCH: Chapter 3 goals are additionally
   * gated by lifeGoalChapterUnlocked -- while any Chapter 2 goal
   * is incomplete they can neither latch nor pay in this pass.
   * The gate reads goalsDone, which is already a dependency of
   * this effect, so the pass that latches the final Chapter 2
   * goal is followed immediately (same session, no reload) by a
   * pass in which Chapter 3 is unlocked and its already-met
   * goals latch and pay -- existing accomplishments count from
   * the moment of the unlock. */
  React.useEffect(() => {
    const met = LIFE_GOALS.filter(
      (g) => !goalsDone.includes(g.id) && lifeGoalChapterUnlocked(g, goalsDone) && lifeGoalMet(g, { savings, credit, ownedBusinesses, businessUpgrades, propertiesOwned })
    );
    if (met.length > 0) {
      setGoalsDone((prev) => [...prev, ...met.map((g) => g.id)]);
      /* COINS_V1_E06_LATCH: +5 coins per newly latched goal.
       * The paid ids are recorded in the same pass, and the
       * filter below never pays an id twice -- the load
       * migration already paid (and recorded) every goal
       * latched before this build, so a goal can never be
       * paid by both paths. */
      const unpaid = met.filter((g) => !goalCoinsPaid.includes(g.id));
      if (unpaid.length > 0) {
        setCoins((c) => c + COIN_PER_GOAL * unpaid.length);
        setGoalCoinsPaid((prev) => [...prev, ...unpaid.map((g) => g.id)]);
        /* LIFE_GOALS_CH3_V1_E05_MESSAGE: Lori's result line --
         * "[Goal name] complete! +5 coins." -- one per goal paid
         * in this pass, newline-joined into the one goalMessage,
         * so simultaneous completions (above all the Chapter 3
         * unlock burst, where goals 1-2 latch together) are all
         * shown and none is dropped. A later completion replaces
         * the text, exactly like every other section message. */
        setGoalMessage(unpaid.map((g) => g.name + ' complete! +5 coins.').join('\n'));
      }
    }
  }, [savings, credit, goalsDone, goalCoinsPaid, ownedBusinesses, businessUpgrades, propertiesOwned]); /* LIFE_GOALS_CH2_V1_E05B_DEPS */

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
    /* MY_MONEY_V1_E08_HOOK_PAYROLL: record-only. pendingWages
     * is the exact amount this effect just moved into the
     * paycheck; the recorder stores it as wages that became
     * payable this Friday. No amount, guard or latch in this
     * effect changes. */
    setLastFridayReport((r) => recordFridayPayroll(r, day, pendingWages));
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
    /* MY_MONEY_V1_E09_HOOK_PAYOUT: record-only. The recorded
     * amounts recompute the exact expressions this effect
     * just paid with, from the same state in the same run:
     * the bond pays BOND_FRIDAY_PAY when owned, and rent is
     * the same PROPERTIES filter/reduce total paid to cash
     * above. The Growth Fund's value change is not cash and
     * is never recorded. No amount, guard or latch in this
     * effect changes. */
    const myMoneyRentPaid = propertiesOwned.length > 0
      ? PROPERTIES
        .filter((prop) => propertiesOwned.includes(prop.id))
        .reduce((sum, prop) => sum + prop.rent, 0)
      : 0;
    setLastFridayReport((r) => recordFridayPayout(r, day, myMoneyRentPaid > 0 ? myMoneyRentPaid : 0, bondOwned ? BOND_FRIDAY_PAY : 0));
    /* MONEY_HISTORY_V1_E09_HOOK_PAYOUT: record-only. This
     * effect is latched exactly-once per Friday by
     * lastInvestPayday, so its entries are exactly-once
     * too. The bond entry is written first because the
     * effect pays the bond first; the rent entry follows,
     * so in newest-first order the rent sits above the
     * bond. Amounts are the very expressions the effect
     * just paid with: BOND_FRIDAY_PAY when the bond is
     * owned, and myMoneyRentPaid (the identical PROPERTIES
     * filter/reduce total computed for MY MONEY above).
     * A Friday owning nothing writes NO rent or bond
     * entries, even though the effect still latches. The
     * Growth Fund pays no cash and is never logged. No
     * amount, guard or latch in this effect changes. */
    if (bondOwned) setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'bond', label: 'Savings Bond income', amount: BOND_FRIDAY_PAY, balance: 'cash' }));
    if (myMoneyRentPaid > 0) setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'rent', label: 'Property rent', amount: myMoneyRentPaid, balance: 'cash' }));
  }, [day, lastInvestPayday]);


  /*
   * Refs change immediately without waiting for the next render.
   * They prevent rapid button taps from paying the same shift twice.
   */
  const paidWorkShiftRef = useRef(false);
  /* COINS_V1_E04_REF: the weekly bonus paid by the shift just
   * awarded (0 or 2). countPaidShift rewrites it on every paid
   * shift, before any message reads it in the same tap. */
  const lastShiftBonusRef = useRef(0);
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

  /* COINS_V1_E09_COUNT_FN: count one completed regular paid
   * shift toward the weekly bonus and pay it. Called only from
   * the two exactly-once pay points (awardShift for warehouse
   * + clerk, the transit route completion) -- training never
   * calls it. Returns the bonus paid (0 or 2) and mirrors it
   * into lastShiftBonusRef so message builders running
   * synchronously off awardShift can read it in the same tap. */
  const countPaidShift = () => {
    const result = applyShiftWeekCount(shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek, day);
    setShiftsThisWeek(result.shiftsThisWeek);
    setShiftsWeekKey(result.shiftsWeekKey);
    setLastShiftBonusWeek(result.lastShiftBonusWeek);
    if (result.bonus > 0) setCoins((c) => c + result.bonus);
    lastShiftBonusRef.current = result.bonus;
    return result.bonus;
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
    countPaidShift(); /* COINS_V1_E10_AWARDSHIFT: a regular paid shift counts toward the weekly coin bonus. */
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
   * untouched. CLOCK_V2: this line stays the warehouse wiring; the
   * clerk shift, the transit route and both trainings now advance
   * the clock the same +8h way at their own completion points. */
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


  /* EXPLORE_CITY_V1_E07_MOVE: the explorable-city movement loop.
   * One 33 ms tick (~30/sec) while the map is on screen. Each tick
   * reads the D-pad direction ref or the tap-to-walk target ref,
   * steps through resolveCityMove (axis-separated, so the player
   * slides along walls and can never end a tick inside a building
   * or outside the world), and mirrors the result into cityPos
   * state for rendering and the save. D-pad input cancels any tap
   * target. Presentation only: this loop reads and writes ONLY the
   * city position and riding state -- no cash, savings, credit,
   * XP, wages, clock or calendar contact, ever. */
  const citySetPos = (next) => {
    cityPosRef.current = next;
    setCityPos(next);
  };
  const cityWalkTo = React.useCallback((point) => {
    const target = cityUnstick({ x: point.x, y: point.y }, CITY_RECTS);
    if (reduceMotion) {
      /* Reduced motion: arrive instantly, never ignore the tap. */
      cityWalkTargetRef.current = null;
      setCityWalkTarget(null);
      cityPosRef.current = target;
      setCityPos(target);
      return;
    }
    cityWalkTargetRef.current = target;
    setCityWalkTarget(target);
    cityBlockedRef.current = 0;
  }, [reduceMotion]);
  const cityBuildingPress = React.useCallback((placeDef) => {
    if (placeDef && placeDef.entrance) cityWalkTo(placeDef.entrance);
  }, [cityWalkTo]);
  const cityPadDown = (x, y) => {
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    cityDirRef.current = { x: cityDirRef.current.x + x, y: cityDirRef.current.y + y };
  };
  const cityPadUp = (x, y) => {
    cityDirRef.current = { x: cityDirRef.current.x - x, y: cityDirRef.current.y - y };
  };
  React.useEffect(() => {
    if (place !== null || !freeRoam) return undefined;
    const iv = setInterval(() => {
      const dir = cityDirRef.current;
      const pos = cityPosRef.current;
      const speed = ridingBike || (activeMission && activeMission.kind === 'transit_route') ? CITY_RIDE_SPEED : CITY_WALK_SPEED; /* CITY_JOBS_V1_E10_SPEED: a driven bus route moves at ride speed; on foot and on a bike the speed is exactly the shipped one. */
      let dx = 0;
      let dy = 0;
      if (dir.x !== 0 || dir.y !== 0) {
        if (cityWalkTargetRef.current) {
          cityWalkTargetRef.current = null;
          setCityWalkTarget(null);
        }
        const len = Math.hypot(dir.x, dir.y) || 1;
        dx = (dir.x / len) * speed;
        dy = (dir.y / len) * speed;
      } else if (cityWalkTargetRef.current) {
        const t = cityWalkTargetRef.current;
        const vx = t.x - pos.x;
        const vy = t.y - pos.y;
        const dist = Math.hypot(vx, vy);
        if (dist <= Math.max(speed, 24)) {
          cityWalkTargetRef.current = null;
          setCityWalkTarget(null);
          return;
        }
        dx = (vx / dist) * speed;
        dy = (vy / dist) * speed;
      } else {
        return;
      }
      const next = resolveCityMove(pos, dx, dy, CITY_RECTS);
      if (next.x === pos.x && next.y === pos.y) {
        /* Pushing into a wall: after a moment, give up on a tap
         * target the straight-line walk cannot reach. */
        cityBlockedRef.current += 1;
        if (cityWalkTargetRef.current && cityBlockedRef.current > 12) {
          cityWalkTargetRef.current = null;
          setCityWalkTarget(null);
          cityBlockedRef.current = 0;
        }
        return;
      }
      cityBlockedRef.current = 0;
      citySetPos(next);
    }, CITY_TICK_MS);
    return () => clearInterval(iv);
  }, [place, freeRoam, ridingBike, activeMission]); /* CITY_JOBS_V1_E11_SPEED_DEPS */

  /* EXPLORE_CITY_V1_E08_ENTER: walk-up entrances. ENTER records
   * the place so the exit watcher can return the player to its
   * door. WORK keeps the old tile's gates through resolveDest;
   * owned properties open the HOME screen, where property
   * selling lives. BUSINESS_INTERIORS_V1_E02_ENTER: an owned
   * business opens its walk-in interior instead of the HOME
   * screen (cityEnterDest, E01). lastEnteredRef still records
   * the storefront's own place id, so the exit watcher returns
   * the player to that business's door when the interior
   * exits to the map. */
  const cityEnter = (placeDef) => {
    lastEnteredRef.current = placeDef.id;
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    cityDirRef.current = { x: 0, y: 0 };
    if (placeDef.dest === 'WORK') {
      setPlace(resolveDest('WORK'));
    } else if (placeDef.kind === 'business') {
      setPlace(cityEnterDest(placeDef, ownedBusinesses));
    } else {
      setPlace(placeDef.dest);
    }
  };

  /* EXPLORE_CITY_V1_E09_EXIT_SPAWN: ONE watcher -- when the
   * screen returns to the map from a building entered through
   * ENTER, the player reappears at that building's entrance.
   * Map returns that did not come through ENTER (Settings, a
   * save reopened into a screen) keep the saved position. */
  const cityPrevPlaceRef = useRef(place);
  React.useEffect(() => {
    const prev = cityPrevPlaceRef.current;
    cityPrevPlaceRef.current = place;
    if (prev !== null && place === null && lastEnteredRef.current) {
      const def = cityPlaceById(lastEnteredRef.current);
      lastEnteredRef.current = null;
      if (def && def.entrance) citySetPos({ x: def.entrance.x, y: def.entrance.y });
    }
  }, [place]);

  /* EXPLORE_CITY_V1_E10_GUIDE: the find-a-place guide target and
   * its arrival auto-clear (within CITY_GUIDE_ARRIVE units). */
  const guidePlace = guideTargetId ? cityPlaceById(guideTargetId) : null;
  React.useEffect(() => {
    if (guidePlace && guidePlace.entrance) {
      const d = Math.hypot(cityPos.x - guidePlace.entrance.x, cityPos.y - guidePlace.entrance.y);
      if (d <= CITY_GUIDE_ARRIVE) setGuideTargetId(null);
    }
  }, [cityPos, guideTargetId, guidePlace]);
  /* CITY_JOBS_V1_E12_HANDLERS: accept / cancel / interact /
   * complete for city missions. The pure layer (E03) decides;
   * these handlers only apply a decision through the SHIPPED
   * setters and helpers -- setCash, recordEarning, setHours,
   * setBizWork (the menu's own update shape), setPendingWages,
   * setXp, setLastShiftDay, countPaidShift, addHistoryEntry --
   * so a mission job and a menu job are indistinguishable to
   * every counter, cap and report downstream. */
  const missionToken = (m) => (m ? m.kind + ':' + m.stage + ':' + m.progress + ':' + day : '');
  const acceptMission = (kind) => {
    if (activeMission) return;
    const elig = missionEligibility(kind, { ownedBusinesses, businessUpgrades, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount, transitEmployment, transitTraining, ownedBikes, activeMission });
    if (!elig.ok) { setMissionNotice(elig.reason); return; }
    missionTokenRef.current = '';
    setMissionNotice('');
    setMissionSummary(null);
    setGuideTargetId(null);
    setActiveMission(newMission(kind));
    setPlace(null);
  };
  const cancelMission = () => {
    if (!activeMission) return;
    /* Cancel pays nothing, advances nothing and consumes no
     * allowance or counter -- it only clears the mission. */
    missionTokenRef.current = '';
    setActiveMission(null);
    setMissionNotice('');
  };
  const missionInteractPress = () => {
    if (!activeMission) return;
    const step = missionInteract(activeMission);
    if (!step) return;
    if (step.completes) { completeMission(); return; }
    const token = missionToken(activeMission);
    if (missionTokenRef.current === token) return;
    missionTokenRef.current = token;
    setMissionNotice('');
    setActiveMission(step.mission);
  };
  const completeMission = () => {
    if (!activeMission) return;
    const plan = planMissionCompletion(activeMission, { ownedBusinesses, businessUpgrades, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount });
    if (plan.outcome === 'blocked') {
      /* The earnings cap refuses the pay: the mission stays at
       * its finish stage with its allowance unconsumed, ready
       * to finish on a later day. Nothing is applied and the
       * token is NOT consumed, so the button stays live. */
      setMissionNotice('Daily earnings limit reached — finish tomorrow');
      return;
    }
    const token = 'complete:' + missionToken(activeMission);
    if (missionTokenRef.current === token) return;
    missionTokenRef.current = token;
    setMissionNotice('');
    if (plan.outcome === 'ended') {
      setActiveMission(null);
      setMissionSummary({ title: 'Mission ended', lines: [plan.message] });
      return;
    }
    if (plan.kind === 'business') {
      const biz = BUSINESSES.find((b) => b.id === plan.bizId);
      const doneToday = bizJobsDoneToday(bizWork, plan.bizId, day);
      setCash((c) => c + plan.pay);
      recordEarning(plan.pay);
      setHours((h) => h + plan.hours);
      setBizWork((prev) => ({ ...prev, [plan.bizId]: { day, count: doneToday + 1 } }));
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' job', amount: plan.pay, balance: 'cash' }));
      setActiveMission(null);
      setMissionSummary({ title: 'Mission complete!', lines: ['+$' + plan.pay + ' cash — ' + biz.name + ' job', 'Time advanced: +' + plan.hours + ' hours'] });
      return;
    }
    if (plan.kind === 'delivery') {
      setCash((c) => c + plan.pay);
      recordEarning(plan.pay);
      setHours((h) => h + plan.hours);
      setDeliveryDay(day);
      setDeliveryCount(deliveriesDoneToday(deliveryDay, deliveryCount, day) + 1);
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: 'Motorcycle delivery', amount: plan.pay, balance: 'cash' }));
      /* PARK & HAND OVER: the tap that completes a delivery
       * also parks the bike, in the same guarded action. */
      setRidingBike(null);
      setActiveMission(null);
      setMissionSummary({ title: 'Mission complete!', lines: ['+$' + plan.pay + ' cash — Motorcycle delivery', 'Time advanced: +' + plan.hours + ' hour'] });
      return;
    }
    if (plan.kind === 'wages') {
      /* The bus route pays exactly like the menu route: wages
       * to pending (Friday payroll), XP, the +8h clock, the
       * shared lastShiftDay flag, the cap record and the
       * weekly shift coin bonus. No cash, no Money History
       * entry -- wages are logged when collected, as today. */
      setPendingWages((v) => v + plan.pay);
      recordEarning(plan.pay);
      setXp((v) => v + plan.xp);
      setHours((h) => h + plan.hours);
      setLastShiftDay(day);
      const missionShiftBonus = countPaidShift();
      const lines = ['+$' + plan.pay + ' wages (collect Friday)', '+' + plan.xp + ' XP', 'Time advanced: +' + plan.hours + ' hours'];
      if (missionShiftBonus > 0) lines.push('+' + missionShiftBonus + ' coins — weekly shift bonus');
      setActiveMission(null);
      setMissionSummary({ title: 'Mission complete!', lines: lines });
    }
  };
  /* Cleaning's travel stage advances on arrival at the
   * customer house (functional update, so a mission cancelled
   * or replaced in the meantime is never overwritten). */
  React.useEffect(() => {
    if (!activeMission || activeMission.kind !== 'cleaning' || activeMission.stage !== 'go') return;
    const spot = missionSpot(activeMission);
    if (!spot) return;
    if (Math.hypot(cityPos.x - spot.x, cityPos.y - spot.y) > CITY_ENTER_RANGE) return;
    setActiveMission((m) => missionArrive(m) || m);
  }, [cityPos, activeMission]);

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
    setHours((h) => h + activeJob.trainingHours); /* CLOCK_V2_E02_TRAINING */
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
    setHours((h) => h + 8); /* CLOCK_V2_E03_TRANSIT_TRAINING */
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
        setHours((h) => h + 8); /* CLOCK_V2_E04_TRANSIT_ROUTE */
        recordEarning(result.pay); /* DAILY_LIMIT_V1_TRANSIT_ROUTE_RECORD */
        /* TRANSIT_V1_XP: +40 XP per completed route, matching warehouse
         * work. Inside the same once-only guard as the $144, so
         * reopening or re-tapping can never award it twice. Training
         * gives pay only; an unfinished shift gives nothing. */
        setXp((v) => v + TRANSIT_SHIFT_XP);
        const transitShiftBonus = countPaidShift(); /* COINS_V1_E11_TRANSIT */
        setTransitMessage('Shift complete! You earned $' + result.pay + '. Your wages will be paid Friday.' + (transitShiftBonus > 0 ? ' Weekly bonus: +' + transitShiftBonus + ' coins for 3 shifts this week.' : ''));
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
    const eventGain = Math.max(0, choice.cash || 0) + Math.max(0, choice.pending || 0) + Math.max(0, choice.savings || 0); /* DAILY_LIMIT_V1_EVENT_GAIN */ /* LIFE_EVENTS_V2_E03_GAIN_SAVINGS */
    if (eventGain > 0 && !canEarn(earnedToday, earnedTodayDay, day, eventGain)) { /* DAILY_LIMIT_V1_EVENT_BLOCK */
      setEventMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    /* COINS_V1_E14_RESOLVER_GATE: a coin bill choice re-checks
     * its gate before the double-tap ref arms (the button is
     * disabled when the gate fails; this keeps a stale tap
     * from ever spending coins it should not). */
    if (choice.coins && (coins < -choice.coins || cash >= choice.coinGate)) return;
    eventChoiceRef.current = true;
    if (eventGain > 0) recordEarning(eventGain); /* DAILY_LIMIT_V1_EVENT_RECORD */
    if (choice.cash) setCash((c) => Math.max(0, c + choice.cash));
    if (choice.savings) setSavings((v) => v + choice.savings); /* LIFE_EVENTS_V2_E04_SAVINGS_APPLY */
    if (choice.pending) setPendingWages((w) => w + choice.pending);
    if (choice.xp) setXp((x) => x + choice.xp);
    if (choice.credit) setCredit((s) => Math.max(0, Math.min(850, s + choice.credit))); /* LIFE_EVENTS_V2_E05_CREDIT_FLOOR */
    if (choice.coins) setCoins((c) => Math.max(0, c + choice.coins)); /* COINS_V1_E15_RESOLVER_APPLY */
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
    /* MY_MONEY_V1_E10_HOOK_COLLECT: record-only. paycheck is
     * the exact amount just moved into cash; the recorder
     * marks this report's outstanding wages collected, capped
     * at what this Friday is still owed, so a paycheck stacked
     * across Fridays can never double-count. No amount or
     * guard in this handler changes. */
    setLastFridayReport((r) => recordPaycheckCollected(r, paycheck));
    /* MONEY_HISTORY_V1_E08_HOOK_COLLECT: record-only.
     * paycheck is the exact amount this handler just moved
     * into cash, and the handler's own guards (paycheck
     * <= 0, collectPayRef) keep the entry exactly-once: a
     * second tap returns above and logs nothing. Pending
     * wages are never logged anywhere -- wages enter the
     * history only here, at collection. No amount or
     * guard in this handler changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'paycheck', label: 'Paycheck collected', amount: paycheck, balance: 'cash' }));
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
    /* MONEY_HISTORY_V1_E17_HOOK_LEASE: record-only. The
     * guards above (already housed, insufficient savings,
     * the signLeaseRef exactly-once ref) have all passed,
     * so the lease was just signed exactly once, for the
     * first month's rent from savings. No amount or guard
     * in this handler changes. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: 'Room Rental \u2014 lease signed', amount: HOUSING_GOAL.firstMonthRent, balance: 'savings' }));
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
    setLastFridayReport(null); /* MY_MONEY_V1_E07_RESTART: a fresh game has no Friday report yet. */
    setMoneyHistory([]); /* MONEY_HISTORY_V1_E07_RESTART: a fresh game starts with an empty history. */
    setSavingsGoal(null); /* SAVINGS_GOALS_V1_E07_RESTART: a fresh game has no savings goal, and the goal form resets with it. */
    /* EXPLORE_CITY_V1_E11_RESTART: a fresh game starts on foot
     * at the HOME entrance, with no walk target or guide set. */
    cityPosRef.current = cityHomeEntrance();
    setCityPos(cityHomeEntrance());
    setRidingBike(null);
    cityDirRef.current = { x: 0, y: 0 };
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    setGuideTargetId(null);
    /* CITY_JOBS_V1_E09_RESTART: a fresh game has no mission
     * and a full delivery allowance. */
    setActiveMission(null);
    setDeliveryDay(-1);
    setDeliveryCount(0);
    setMissionSummary(null);
    setMissionNotice('');
    missionTokenRef.current = '';
    setGoalEditing(false);
    setGoalError('');
    setLastShiftDay(-1);
    setPaycheckMessage('');
    collectPayRef.current = false;
    eventChoiceRef.current = false; /* PAYROLL_FIX_V3_RESTART */
    restPendingRef.current = false;
    signLeaseRef.current = false;
    /* CHAPTER3_BIZ_V1: a fresh game starts with no business. */
    setOwnedBusinesses([]);
    setBusinessUpgrades([]); /* BUSINESS_UPGRADES_V1_E11_RESTART: upgrades reset with the save. */
    setOwnedOutfits(['default']); /* COIN_SHOP_V1_E08_RESTART: a fresh game owns only the starting outfit... */
    setWornOutfit('default'); /* COIN_SHOP_V1_E08_WORN_RESET: ...and wears it. */
    setOwnedDecorations([]); /* HOME_DECOR_V1_E08_RESTART: a fresh game owns no decorations... */
    setPlacedDecorations([]); /* HOME_DECOR_V1_E08_PLACED_RESET: ...and has none placed. */
    setHomeLayout(null); /* MY_HOME_INTERIOR_V1_E08_RESTART: a fresh game stores no room layout; the defaults re-derive when the player is housed again. */
    setHomeDecorating(false); /* MY_HOME_INTERIOR_V1_E08_DECORATE_RESET: decorate mode never survives a restart. */
    setHomeSelectedPiece(null); /* MY_HOME_INTERIOR_V1_E08_SELECT_RESET: ...and neither does a selection. */
    setOwnedFurniture([]); /* FURNITURE_STORE_V1_E10_RESTART: a fresh game owns no furniture... */
    setFurnitureConfirm(null); /* FURNITURE_STORE_V1_E10_CONFIRM_RESET: ...no open shop confirm... */
    setFurnitureMessage(''); /* FURNITURE_STORE_V1_E10_MESSAGE_RESET: ...no shop message... */
    setFurnitureReturn(null); /* FURNITURE_STORE_V1_E10_RETURN_RESET: ...and no remembered shop door. */
    setDisplayBike(null); /* MY_GARAGE_V1_E08_RESTART: a fresh game has no display pick stored. */
    setOwnedBikeColors(['factory']); /* BIKE_COLORS_V1_E08_RESTART: a fresh game owns only the factory color... */
    setAppliedBikeColor('factory'); /* BIKE_COLORS_V1_E08_APPLIED_RESET: ...and has it applied. */
    setHours(8);
    setBizWork({});
    setBusinessUnlocked(false);
    setBizMessage('');
    setBizUpgradeConfirm(null);
    bizJobPending.current = false;
    setHousing('none');
    setGoalsDone([]);
    /* COINS_V1_E19_RESTART: the coin fields reset with the save
     * they belong to -- a fresh game has no goals latched, so
     * its empty paid list lets the goals re-earn their coins
     * legitimately, and the weekly counter starts clean. */
    setGoalCoinsPaid([]);
    setGoalMessage(''); /* LIFE_GOALS_CH3_V1_E08_RESTART: a fresh game shows no stale goal-completion message. */
    setShiftsThisWeek(0);
    setShiftsWeekKey(-1);
    setLastShiftBonusWeek(-1);
    lastShiftBonusRef.current = 0;
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
                  <PlayerFigure shirt={wornOutfitDef.shirt} legs={wornOutfitDef.legs} />{/* COIN_SHOP_V1_E11_FIGURE_WORK */}
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
              {lastShiftBonusRef.current > 0 && ( /* COINS_V1_E18_WAREHOUSE_PANEL */
                <Text style={styles.body}>{'Weekly bonus: +' + lastShiftBonusRef.current + ' coins for 3 shifts this week.'}</Text>
              )}
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
                  onPress={() => { /* COINS_V1_E17_CLERK_MSG */ if (awardShift()) { setHours((h) => h + activeJob.shiftHours); /* CLOCK_V2_E01_CLERK_SHIFT */ setShiftMessage('Shift complete! You earned $' + jobShiftPay + ' in pending wages and ' + activeJob.shiftXp + ' XP.' + (lastShiftBonusRef.current > 0 ? ' Weekly bonus: +' + lastShiftBonusRef.current + ' coins for 3 shifts this week.' : '')); } }}
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
            /* BUSINESS_UPGRADES_V1_E12_UI_PAY: the card shows the one
             * effective pay (businessPay), so the description and the
             * WORK A JOB button quote the rate a job will really pay. */
            const pay = businessPay(biz, businessUpgrades);
            const upgraded = businessUpgrades.includes(biz.id);
            return (
              <View key={biz.id}>
                <Text style={styles.body}>
                  {biz.name + ' — buy for $' + biz.price + ' from savings. Each job pays $' + pay + ' and takes 2 hours.'}
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
                      {doneToday >= 3 ? '3 JOBS DONE FOR TODAY' : 'WORK A JOB — EARN $' + pay}
                    </Text>
                  </TouchableOpacity>
                  {/* BUSINESS_UPGRADES_V1_E13_UI_WORK: the one buy-once
                      upgrade for this business. UPGRADE first opens a
                      confirmation step that shows the upgrade name,
                      the cost and the new per-job pay; CONFIRM runs
                      the exactly-once purchase; CANCEL closes the
                      step and charges nothing. An owned upgrade
                      shows its owned state instead of a buy action. */}
                  {upgraded ? (
                    <Text style={styles.body}>{'Upgrade owned: ' + biz.upgradeName + ' — every job pays $' + biz.upgradePay + '.'}</Text>
                  ) : bizUpgradeConfirm !== biz.id ? (
                    <>
                      <Text style={styles.body}>{'Upgrade: ' + biz.upgradeName + ' — $' + biz.upgradeCost + ' from savings. Pay $' + biz.pay + ' → $' + biz.upgradePay + ' per job.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgradeConfirm(biz.id)}
                      >
                        <Text style={styles.secondaryText}>{'UPGRADE — $' + biz.upgradeCost}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View>
                      <Text style={styles.body}>{'Buy ' + biz.upgradeName + ' for $' + biz.upgradeCost + ' from savings? Every job will pay $' + biz.upgradePay + '.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => buyBusinessUpgrade(biz.id)}
                      >
                        <Text style={styles.secondaryText}>{'CONFIRM UPGRADE — $' + biz.upgradeCost}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgradeConfirm(null)}
                      >
                        <Text style={styles.secondaryText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  )}
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
                  /* COINS_V1_E16_EVENT_RENDER: a coin bill choice
                   * is available only when the player holds enough
                   * coins AND cash cannot cover the bill it
                   * replaces (cash < coinGate). */
                  const afford = ch.coins
                    ? (coins >= -ch.coins && cash < ch.coinGate)
                    : (!ch.cash || ch.cash >= 0 || cash >= -ch.cash);
                  return (
                    <TouchableOpacity
                      key={ch.label}
                      style={afford ? styles.primary : styles.secondary}
                      disabled={!afford}
                      onPress={() => applyEventChoice(ch)}
                    >
                      <Text style={styles.primaryText}>{afford ? ch.label : ch.label + (ch.coins ? ' (unavailable)' : ' (not enough cash)')}</Text>
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
            {/* LIFE_GOALS_CH3_V1_E07_RENDER: the latest completion
             * message(s), in the housingMessage idiom. */}
            {goalMessage !== '' && (<Text style={styles.body}>{goalMessage}</Text>)}
            {LIFE_GOALS.map((g, idx) => {
              /* LIFE_GOALS_CH2_V1_E06_RENDER: value comes from
               * lifeGoalProgress (dollars / points for Chapter 1,
               * item counts for Chapter 2), and the first Chapter 2
               * goal carries the CHAPTER 2 subheading. The item is
               * wrapped in a fragment -- fragments add no layout,
               * so Chapter 1 items render exactly as before.
               * Chapter 3: the first Chapter 3 goal carries the
               * CHAPTER 3 -- BUILDING YOUR FUTURE subheading. While
               * the chapter is locked, that item renders Lori's
               * unlock message in place of the Chapter 3 goal list
               * and the remaining Chapter 3 items render nothing;
               * once unlocked they render in this same style. */
              const done = goalsDone.includes(g.id);
              const value = lifeGoalProgress(g, { savings, credit, ownedBusinesses, businessUpgrades, propertiesOwned });
              const nextGoal = LIFE_GOALS.find((x) => !goalsDone.includes(x.id));
              const isNext = !done && nextGoal !== undefined && nextGoal.id === g.id;
              const frac = g.kind === 'credit'
                ? Math.min(1, Math.max(0, (value - 575) / (g.target - 575)))
                : Math.min(1, value / g.target);
              const ch3First = g.chapter === 3 && (idx === 0 || LIFE_GOALS[idx - 1].chapter !== 3);
              const ch3Locked = g.chapter === 3 && !lifeGoalChapterUnlocked(g, goalsDone);
              return (
                /* GOALS_GATE_V1_GREY: unmet goals render dimmed; done goals
                 * keep body with their checkmark and done text. */
                <React.Fragment key={g.id}>
                  {g.chapter === 2 && (idx === 0 || LIFE_GOALS[idx - 1].chapter !== 2) && (
                    <Text style={styles.eyebrow}>CHAPTER 2</Text>
                  )}
                  {ch3First && (
                    <Text style={styles.eyebrow}>{'CHAPTER 3 \u2014 BUILDING YOUR FUTURE'}</Text>
                  )}
                  {ch3Locked ? (
                    ch3First ? (
                      <Text style={styles.goalUnmet}>Complete Chapter 2 to unlock Building Your Future.</Text>
                    ) : null
                  ) : (
                <View>
                  <Text style={done ? styles.body : styles.goalUnmet}>{(done ? '\u2713 ' : '') + g.name}</Text>
                  {done ? (
                    <Text style={styles.body}>{g.doneText}</Text>
                  ) : isNext ? (<>
                    <Text style={styles.goalUnmet}>{g.targetText}</Text>
                    <Text style={styles.goalUnmet}>{g.kind === 'credit' ? ('Credit ' + value + ' of ' + g.target) : g.kind === 'savings' ? ('Saved $' + Math.min(value, g.target) + ' of $' + g.target) : ((g.kind === 'upgrades' ? 'Upgraded ' : 'Owned ') + value + ' of ' + g.target)}</Text>
                    <View style={{ height: 10, backgroundColor: '#1c2a3a', borderRadius: 5, overflow: 'hidden' }}>
                      <View style={{ height: 10, width: Math.round(frac * 100) + '%', backgroundColor: GOLD }} />
                    </View>
                  </>) : (
                    <Text style={styles.goalUnmet}>{g.targetText}</Text>
                  )}
                </View>
                  )}
                </React.Fragment>
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
          <Text style={styles.body}>Buy a property with your savings. Each one pays rent every Friday. You can sell a property back for its full buy price.</Text>
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
                {/* SELL_PROPERTIES_V1_E05_UI_SELL: an owned property can
                    be sold back at full price; SELL first opens a
                    confirmation step that shows the sale price. */}
                {owned && propertySaleConfirm !== prop.id && (
                  <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => setPropertySaleConfirm(prop.id)}
                  >
                    <Text style={styles.secondaryText}>{'SELL - $' + prop.price}</Text>
                  </TouchableOpacity>
                )}
                {owned && propertySaleConfirm === prop.id && (
                  <View>
                    <Text style={styles.body}>{'Sell the ' + prop.name + ' for $' + prop.price + ' cash?'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => sellProperty(prop.id)}
                    >
                      <Text style={styles.secondaryText}>{'CONFIRM SELL - $' + prop.price}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setPropertySaleConfirm(null)}
                    >
                      <Text style={styles.secondaryText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                )}
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

          {/* MY_PROGRESS_V1_BUTTON: opens the read-only MY
              PROGRESS screen; navigation only, nothing else. */}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace('MY_PROGRESS')}
          >
            <Text style={styles.secondaryText}>MY PROGRESS</Text>
          </TouchableOpacity>

          {/* COIN_SHOP_V1_E09_BUTTON: opens the COIN SHOP screen,
              beside MY PROGRESS; navigation only. */}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace('COIN_SHOP')}
          >
            <Text style={styles.secondaryText}>COIN SHOP</Text>
          </TouchableOpacity>

          {/* HOME_DECOR_V1_E09_BUTTON: opens the MY HOME screen,
              beside MY PROGRESS and the COIN SHOP; navigation
              only. The screen itself shows the locked message
              until the player is housed. */}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace('MY_HOME')}
          >
            <Text style={styles.secondaryText}>MY HOME</Text>
          </TouchableOpacity>

          {/* MY_GARAGE_V1_E09_BUTTON: opens the MY GARAGE
              screen, beside MY PROGRESS, the COIN SHOP, and
              MY HOME; navigation only. */}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace('MY_GARAGE')}
          >
            <Text style={styles.secondaryText}>MY GARAGE</Text>
          </TouchableOpacity>

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
      setSlotOutcome(null); /* CASINO_RESULTS_V1_NAV_CLEAR */
      setBjDeck([]);
      setBjPlayer([]);
      setBjDealer([]);
      setBjBet(0);
      setBjPhase('idle');
      setBjMessage('');
      setBjOutcome(null); /* CASINO_RESULTS_V1_NAV_CLEAR_BJ */
      setRoulettePocket(null);
      setRouletteResult('');
      setRouletteOutcome(null); /* CASINO_RESULTS_V1_NAV_CLEAR_ROULETTE */
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
            <CasinoResultPanel info={slotOutcome} detail={slotResult} />{/* CASINO_RESULTS_V1_SLOTS_RENDER */}
            <TouchableOpacity style={styles.secondary} onPress={() => { setSlotSymbols(null); setSlotResult(''); setSlotOutcome(null); }}>
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
                <TouchableOpacity style={styles.secondary} onPress={() => { setBjDeck([]); setBjPlayer([]); setBjDealer([]); setBjBet(0); setBjPhase('idle'); setBjMessage(''); setBjOutcome(null); }}>
                  <Text style={styles.secondaryText}>PLAY AGAIN</Text>
                </TouchableOpacity>
              )}
            </>)}
            <CasinoResultPanel info={bjOutcome} detail={bjMessage} />{/* CASINO_RESULTS_V1_BJ_RENDER */}
            <TouchableOpacity style={styles.secondary} onPress={() => showCasinoGame(null)}>
              <Text style={styles.secondaryText}>BACK TO CASINO</Text>
            </TouchableOpacity>
          </>) : (<>
            <Text style={styles.title}>ROULETTE</Text>
            <Text style={styles.body}>Pick a color, place your bet, spin the wheel. 18 red, 18 black, 1 green zero.</Text>
            <Text style={styles.body}>{'Your pick: ' + (roulettePick ? roulettePick.toUpperCase() : 'none yet')}</Text>
            <TouchableOpacity style={[styles.secondary, roulettePick === 'red' && { opacity: 0.6 }]} onPress={() => { setRoulettePick('red'); setRouletteResult(''); setRouletteOutcome(null); }}>
              <Text style={styles.secondaryText}>🔴 RED</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondary, roulettePick === 'black' && { opacity: 0.6 }]} onPress={() => { setRoulettePick('black'); setRouletteResult(''); setRouletteOutcome(null); }}>
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
            <CasinoResultPanel info={rouletteOutcome} detail={rouletteResult} />{/* CASINO_RESULTS_V1_ROULETTE_RENDER */}
            <TouchableOpacity style={styles.secondary} onPress={() => { setRoulettePocket(null); setRouletteResult(''); setRouletteOutcome(null); }}>
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
          {/* FURNITURE_STORE_V1_E13_STORE_DOOR: the shop's
            * second door, inside the map STORE -- the same
            * FURNITURE_SHOP screen, and it remembers it came
            * from here so its BACK lands back in the STORE. */}
          <Text style={styles.eyebrow}>FURNITURE</Text>
          <Text style={styles.body}>Furniture for your room at MY HOME, bought with cash.</Text>
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { setFurnitureReturn('STORE'); setFurnitureConfirm(null); setFurnitureMessage(''); setStoreMessage(''); setPlace('FURNITURE_SHOP'); }}
          >
            <Text style={styles.secondaryText}>SHOP FURNITURE</Text>
          </TouchableOpacity>
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
                                                    {/* MY_MONEY_V1_E11_BANK_BUTTON: opens the MY
                                                     * MONEY income report. Display only -- the
                                                     * report screen pays and collects nothing. */}
                                                    <TouchableOpacity
                                                      style={styles.secondary}
                                                      onPress={() => setPlace('MY_MONEY')}
                                                    >
                                                      <Text style={styles.secondaryText}>MY MONEY</Text>
                                                    </TouchableOpacity>
                                                    {/* MONEY_HISTORY_V1_E18_BANK_BUTTON: opens the
                                                     * MONEY HISTORY transaction list. Display
                                                     * only -- the history screen records
                                                     * nothing. */}
                                                    <TouchableOpacity
                                                      style={styles.secondary}
                                                      onPress={() => setPlace('MONEY_HISTORY')}
                                                    >
                                                      <Text style={styles.secondaryText}>MONEY HISTORY</Text>
                                                    </TouchableOpacity>
                                                    {/* SAVINGS_GOALS_V1_E09_BANK_BUTTON: opens the
                                                     * SAVINGS GOALS screen. Opening it with a
                                                     * goal in place lands on the goal view (the
                                                     * form opens only from EDIT GOAL, or when
                                                     * no goal exists yet). */}
                                                    <TouchableOpacity
                                                      style={styles.secondary}
                                                      onPress={() => { setGoalEditing(false); setGoalError(''); setPlace('SAVINGS_GOALS'); }}
                                                    >
                                                      <Text style={styles.secondaryText}>SAVINGS GOALS</Text>
                                                    </TouchableOpacity>
                                                    {/* MY_NET_WORTH_V1_E02_BANK_BUTTON: opens the
                                                     * MY NET WORTH breakdown. Display only --
                                                     * the breakdown screen moves nothing. */}
                                                    <TouchableOpacity
                                                      style={styles.secondary}
                                                      onPress={() => setPlace('MY_NET_WORTH')}
                                                    >
                                                      <Text style={styles.secondaryText}>MY NET WORTH</Text>
                                                    </TouchableOpacity>

                                                            <TouchableOpacity
                                                                      style={styles.secondary}
                                                                                onPress={() => {
                                                                                            const amount = Math.min(100, cash);
                                                                                                        setCash(v => v - amount);
                                                                                                                    setSavings(v => v + amount);
                                                                                                                    /* MONEY_HISTORY_V1_E10_HOOK_DEPOSIT: record-only.
                                                                                                                     * amount is the exact sum this tap just moved --
                                                                                                                     * Math.min(100, cash) above, so a smaller remainder
                                                                                                                     * moves (and logs) as-is; a $0 tap moved nothing and
                                                                                                                     * logs nothing. The entry is a TRANSFER: cash down,
                                                                                                                     * savings up -- never income, never spending. No
                                                                                                                     * amount or guard in this handler changes. */
                                                                                                                    if (amount > 0) setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'deposit', label: 'Deposit \u2014 transfer to savings', amount: amount, balance: 'transfer' }));
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
                                                                                                                                                                                                                                    /* MONEY_HISTORY_V1_E11_HOOK_WITHDRAW: record-only.
                                                                                                                                                                                                                                     * amount is the exact sum this tap just moved --
                                                                                                                                                                                                                                     * Math.min(100, savings) above, so a smaller
                                                                                                                                                                                                                                     * remainder moves (and logs) as-is; a $0 tap moved
                                                                                                                                                                                                                                     * nothing and logs nothing. The entry is a
                                                                                                                                                                                                                                     * TRANSFER: savings down, cash up -- never income,
                                                                                                                                                                                                                                     * never spending. No amount or guard in this
                                                                                                                                                                                                                                     * handler changes. */
                                                                                                                                                                                                                                    if (amount > 0) setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'withdrawal', label: 'Withdrawal \u2014 transfer to cash', amount: amount, balance: 'transfer' }));
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
  /* MY_MONEY_V1_E12_SCREEN: the MY MONEY income report,
   * opened from BANK with the MY MONEY button. DISPLAY ONLY:
   * the balances are read straight from live state, and the
   * LAST FRIDAY section renders the persisted
   * lastFridayReport that the Friday payment moments
   * recorded. The only setter touched in this block is
   * setPlace (BACK TO BANK); opening, viewing, scrolling or
   * closing this screen pays nothing, collects nothing,
   * advances no time and writes no state. */
  if (place === 'MY_MONEY') {
    const moneyReport = lastFridayReport;
    const moneyTotals = fridayReportTotals(moneyReport);
    const moneyWaiting = moneyTotals.waiting;
    const moneyJobPayLine = !moneyReport || moneyReport.wagesDue <= 0
      ? 'Job pay (paycheck): $0'
      : moneyWaiting <= 0
        ? 'Job pay (paycheck): $' + moneyReport.wagesDue + ' \u2014 collected'
        : moneyReport.wagesCollectedAmount > 0
          ? 'Job pay (paycheck): $' + moneyReport.wagesDue + ' \u2014 $' + moneyReport.wagesCollectedAmount + ' collected, $' + moneyWaiting + ' waiting to be collected'
          : 'Job pay (paycheck): $' + moneyReport.wagesDue + ' \u2014 waiting to be collected';
    return (
      <ImageBackground source={ART.bgBank} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>MY MONEY</Text>
            <Text style={styles.title}>My Money</Text>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>CURRENT BALANCES</Text>
              <Text style={styles.progressLine}>{'Cash: $' + cash}</Text>
              <Text style={styles.progressLine}>{'Savings: $' + savings}</Text>
              <Text style={styles.progressLine}>{'Pending Wages: $' + pendingWages}</Text>
              <Text style={styles.progressLine}>{'Paycheck Available to Collect: $' + paycheck}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>LAST FRIDAY</Text>
              {moneyReport === null ? (
                <Text style={styles.progressLine}>Your first report will appear after your next payday.</Text>
              ) : (<>
                <Text style={styles.progressLine}>{'Last Friday you received $' + moneyTotals.received + '.'}</Text>
                <Text style={styles.progressLine}>{moneyJobPayLine}</Text>
                <Text style={styles.progressLine}>{'Property rent: $' + moneyReport.rentPaid + (moneyReport.rentPaid > 0 ? ' \u2014 received' : '')}</Text>
                <Text style={styles.progressLine}>{'Investment income (Savings Bond): $' + moneyReport.bondPaid + (moneyReport.bondPaid > 0 ? ' \u2014 received' : '')}</Text>
                {moneyWaiting > 0 && (
                  <Text style={styles.progressLine}>{'Still waiting to be collected: $' + moneyWaiting + ' \u2014 collect your paycheck on the WORK screen.'}</Text>
                )}
              </>)}
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('BANK')}
            >
              <Text style={styles.secondaryText}>BACK TO BANK</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* SAVINGS_GOALS_V1_E11_SCREEN: the SAVINGS GOALS
   * screen, opened from BANK with the SAVINGS GOALS
   * button. The player keeps ONE goal ({ category, name,
   * target }) in the persisted savingsGoal field; this
   * screen is the only place that field is written (SAVE
   * GOAL through the validateSavingsGoalForm gate, REMOVE
   * GOAL clearing it). Progress is derived live from the
   * savings balance with goalProgress -- never stored, so
   * deposits and withdrawals update it on their own and
   * reaching the target never latches. Setting, editing
   * or removing a goal NEVER moves, holds or reserves
   * money: the only setters in this block are setPlace,
   * setSavingsGoal and the transient form state. */
  if (place === 'SAVINGS_GOALS') {
    const goal = savingsGoal;
    const progress = goal ? goalProgress(savings, goal) : null;
    const showGoalForm = !goal || goalEditing;
    return (
      <ImageBackground source={ART.bgBank} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>SAVINGS GOALS</Text>
            <Text style={styles.title}>Savings Goals</Text>

            {goal && !showGoalForm && (
              <View style={styles.progressPanel}>
                <Text style={styles.progressHeading}>{goal.name}</Text>
                <Text style={styles.progressLine}>{'Category: ' + goal.category}</Text>
                <Text style={styles.progressLine}>{'Target: $' + goal.target}</Text>
                <Text style={styles.progressLine}>{'Current savings: $' + savings}</Text>
                <View style={[styles.progressTrack, { marginTop: 8, marginBottom: 12 }]}>
                  <View style={[styles.progressFill, { width: progress.percent + '%' }]} />
                </View>
                <Text style={styles.progressLine}>{progress.percent + '% complete'}</Text>
                {progress.reached && (
                  <Text style={styles.progressLine}>Goal reached!</Text>
                )}
                <Text style={styles.progressLine}>{'$' + progress.left + ' left to reach your goal.'}</Text>
                <TouchableOpacity
                  style={styles.secondary}
                  onPress={() => { setGoalCategoryInput(goal.category); setGoalNameInput(goal.name); setGoalTargetInput(String(goal.target)); setGoalError(''); setGoalEditing(true); }}
                >
                  <Text style={styles.secondaryText}>EDIT GOAL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondary}
                  onPress={() => { setSavingsGoal(null); setGoalEditing(false); setGoalError(''); setGoalCategoryInput(SAVINGS_GOAL_CATEGORIES[0]); setGoalNameInput(SAVINGS_GOAL_CATEGORIES[0]); setGoalTargetInput(''); }}
                >
                  <Text style={styles.secondaryText}>REMOVE GOAL</Text>
                </TouchableOpacity>
              </View>
            )}

            {showGoalForm && (
              <View style={styles.progressPanel}>
                <Text style={styles.progressHeading}>{goal ? 'EDIT YOUR GOAL' : 'SET A GOAL'}</Text>
                {!goal && (
                  <Text style={styles.progressLine}>Set your first savings goal.</Text>
                )}
                <Text style={styles.goalInputLabel}>CATEGORY</Text>
                <View style={styles.goalChipRow}>
                  {SAVINGS_GOAL_CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[styles.goalChip, goalCategoryInput === category && styles.goalChipSelected]}
                      onPress={() => { setGoalCategoryInput(category); setGoalNameInput(category); setGoalError(''); }}
                    >
                      <Text style={[styles.goalChipText, goalCategoryInput === category && styles.goalChipTextSelected]}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.goalInputLabel}>GOAL NAME</Text>
                <TextInput
                  style={styles.goalInput}
                  value={goalNameInput}
                  onChangeText={setGoalNameInput}
                  placeholder="Goal name"
                  placeholderTextColor="#5f7186"
                  maxLength={40}
                />
                <Text style={styles.goalInputLabel}>TARGET (WHOLE DOLLARS)</Text>
                <TextInput
                  style={styles.goalInput}
                  value={goalTargetInput}
                  onChangeText={setGoalTargetInput}
                  placeholder="e.g. 40000"
                  placeholderTextColor="#5f7186"
                  keyboardType="numeric"
                />
                {goalError !== '' && (
                  <Text style={styles.goalErrorText}>{goalError}</Text>
                )}
                <TouchableOpacity
                  style={styles.primary}
                  onPress={() => {
                    const result = validateSavingsGoalForm(goalCategoryInput, goalNameInput, goalTargetInput);
                    if (!result.ok) { setGoalError(result.error); return; }
                    setSavingsGoal(result.goal);
                    setGoalEditing(false);
                    setGoalError('');
                  }}
                >
                  <Text style={styles.primaryText}>SAVE GOAL</Text>
                </TouchableOpacity>
                {goal && (
                  <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => { setGoalEditing(false); setGoalError(''); }}
                  >
                    <Text style={styles.secondaryText}>CANCEL EDIT</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('BANK')}
            >
              <Text style={styles.secondaryText}>BACK TO BANK</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* MONEY_HISTORY_V1_E19_SCREEN: the MONEY HISTORY
   * transaction list, opened from BANK with the MONEY
   * HISTORY button. DISPLAY ONLY: it renders the persisted
   * moneyHistory (the newest 25, via visibleHistory) and
   * the only setter touched in this block is setPlace
   * (BACK TO BANK); opening, viewing, scrolling or closing
   * this screen records nothing, pays nothing, collects
   * nothing and moves no balance. Transfers render as
   * transfers (see historyEntryLines) -- never as income
   * or spending. */
  if (place === 'MONEY_HISTORY') {
    const shownHistory = visibleHistory(moneyHistory);
    return (
      <ImageBackground source={ART.bgBank} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>MONEY HISTORY</Text>
            <Text style={styles.title}>Money History</Text>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>RECENT ACTIVITY</Text>
              {moneyHistory.length > shownHistory.length && (
                <Text style={styles.progressLine}>{'Showing the newest ' + shownHistory.length + ' transactions.'}</Text>
              )}
              {shownHistory.length === 0 ? (
                <Text style={styles.progressLine}>No transactions recorded yet. Paychecks you collect, Friday rent and bond income, bank transfers and purchases will appear here.</Text>
              ) : shownHistory.map((entry, index) => {
                const lines = historyEntryLines(entry);
                return (
                  <View key={entry.day + '-' + entry.kind + '-' + index}>
                    <Text style={styles.progressLine}>{entry.label}</Text>
                    <Text style={styles.progressLine}>{lines.dayText + ' \u2014 ' + lines.amountText + ' \u2014 ' + lines.balanceText}</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('BANK')}
            >
              <Text style={styles.secondaryText}>BACK TO BANK</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* MY_NET_WORTH_V1_E03_SCREEN: the MY NET WORTH
   * breakdown, opened from BANK with the MY NET WORTH
   * button. DISPLAY ONLY: everything renders from
   * computeNetWorth(...) -- a pure read of live state and
   * the game's own tables -- and the only setter touched in
   * this block is setPlace (BACK TO BANK). Opening, viewing,
   * scrolling or closing this screen pays nothing, sells
   * nothing, moves no balance and writes no state; there is
   * no net-worth save field, so the display always reflects
   * the current save exactly. */
  if (place === 'MY_NET_WORTH') {
    const worth = computeNetWorth({ cash, savings, bondOwned, fundOwned, fundValue, propertiesOwned, ownedBusinesses, businessUpgrades, ownedBikes });
    return (
      <ImageBackground source={ART.bgBank} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>MY NET WORTH</Text>
            <Text style={styles.title}>My Net Worth</Text>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>TOTAL NET WORTH</Text>
              <Text style={styles.progressLine}>{'$' + worth.total}</Text>
              <Text style={styles.progressLine}>{'Businesses, upgrades and motorcycles are shown at what you paid for them. Properties and investments are shown at what you could sell them for today. These values are not spendable cash \u2014 only your Cash and Savings can be spent.'}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>MONEY</Text>
              <Text style={styles.progressLine}>{'Cash: $' + worth.cash}</Text>
              <Text style={styles.progressLine}>{'Savings: $' + worth.savings}</Text>
              <Text style={styles.progressLine}>{'Money total: $' + worth.moneyTotal}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>{'INVESTMENTS \u2014 SELL VALUE'}</Text>
              {worth.investments.length === 0 ? (
                <Text style={styles.progressLine}>None yet</Text>
              ) : worth.investments.map((item) => (
                <Text key={item.id} style={styles.progressLine}>{item.name + ': $' + item.amount}</Text>
              ))}
              <Text style={styles.progressLine}>{'Investments total: $' + worth.investmentsTotal}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>{'PROPERTIES \u2014 SELL VALUE'}</Text>
              {worth.properties.length === 0 ? (
                <Text style={styles.progressLine}>None yet</Text>
              ) : worth.properties.map((item) => (
                <Text key={item.id} style={styles.progressLine}>{item.name + ': $' + item.amount}</Text>
              ))}
              <Text style={styles.progressLine}>{'Properties total: $' + worth.propertiesTotal}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>{'BUSINESSES \u2014 PURCHASE COST'}</Text>
              {worth.businesses.length === 0 ? (
                <Text style={styles.progressLine}>None yet</Text>
              ) : worth.businesses.map((item) => (
                <Text key={item.id} style={styles.progressLine}>{item.name + ': $' + item.amount}</Text>
              ))}
              <Text style={styles.progressLine}>{'Businesses total: $' + worth.businessesTotal}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>{'UPGRADES \u2014 PURCHASE COST'}</Text>
              {worth.upgrades.length === 0 ? (
                <Text style={styles.progressLine}>None yet</Text>
              ) : worth.upgrades.map((item) => (
                <Text key={item.id} style={styles.progressLine}>{item.name + ' (' + item.businessName + '): $' + item.amount}</Text>
              ))}
              <Text style={styles.progressLine}>{'Upgrades total: $' + worth.upgradesTotal}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>{'MOTORCYCLES \u2014 PURCHASE COST'}</Text>
              {worth.bikes.length === 0 ? (
                <Text style={styles.progressLine}>None yet</Text>
              ) : worth.bikes.map((item) => (
                <Text key={item.id} style={styles.progressLine}>{item.name + ': $' + item.amount}</Text>
              ))}
              <Text style={styles.progressLine}>{'Motorcycles total: $' + worth.bikesTotal}</Text>
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('BANK')}
            >
              <Text style={styles.secondaryText}>BACK TO BANK</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* MY_PROGRESS_V1_SCREEN: read-only progress summary, opened
   * from HOME. Everything on it comes from progressSummary(...)
   * -- a pure read of current state. The only setter touched in
   * this block is setPlace (BACK TO HOME); opening, viewing,
   * scrolling or closing this screen writes nothing, awards
   * nothing and saves nothing. */
  if (place === 'MY_PROGRESS') {
    const summary = progressSummary({ cash, savings, credit, xp, coins, pendingWages, paycheck, ownedBusinesses, businessUpgrades, propertiesOwned, ownedBikes, goalsDone });
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>MY PROGRESS</Text>
            <Text style={styles.title}>My Progress</Text>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>MONEY</Text>
              <Text style={styles.progressLine}>{'Cash: $' + summary.cash}</Text>
              <Text style={styles.progressLine}>{'Savings: $' + summary.savings}</Text>
              <Text style={styles.progressLine}>{'Credit: ' + summary.credit}</Text>
              <Text style={styles.progressLine}>{'XP: ' + summary.xp + ' \u2014 Level ' + summary.level}</Text>
              <Text style={styles.progressLine}>{'Coins: ' + summary.coins}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>WORK PAY</Text>
              <Text style={styles.progressLine}>{'Pending Wages: $' + summary.pendingWages}</Text>
              <Text style={styles.progressLine}>{'Available Paycheck: $' + summary.paycheck}</Text>
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>BUSINESSES</Text>
              {summary.businesses.length > 0 ? summary.businesses.map((biz) => (
                <Text key={biz.id} style={styles.progressLine}>{biz.label}</Text>
              )) : (
                <Text style={styles.progressLine}>No businesses yet</Text>
              )}
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>PROPERTIES</Text>
              {summary.properties.length > 0 ? summary.properties.map((name) => (
                <Text key={name} style={styles.progressLine}>{name}</Text>
              )) : (
                <Text style={styles.progressLine}>No properties yet</Text>
              )}
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>MOTORCYCLES</Text>
              {summary.bikes.length > 0 ? summary.bikes.map((name) => (
                <Text key={name} style={styles.progressLine}>{name}</Text>
              )) : (
                <Text style={styles.progressLine}>No motorcycles yet</Text>
              )}
            </View>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>LIFE GOALS</Text>
              {summary.goalChapters.map((group) => (
                <View key={group.chapter}>
                  <Text style={styles.progressChapter}>{group.title}</Text>
                  {group.completed.length > 0 ? group.completed.map((name) => (
                    <Text key={name} style={styles.progressLine}>{'\u2713 ' + name}</Text>
                  )) : (
                    <Text style={styles.progressLine}>None completed yet</Text>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText}>BACK TO HOME</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* COIN_SHOP_V1_E13_SCREEN: the COIN SHOP, opened from HOME
   * beside MY PROGRESS. Three cosmetic outfits for coins, plus
   * the always-owned starting outfit. Buying runs through
   * purchaseOutfit -- coins only, exactly-once; wearing is free
   * and only recolors the player figure. Same black-and-gold
   * shell as MY PROGRESS: ScrollView, progressPanel, large text,
   * BACK TO HOME to close. */
  if (place === 'COIN_SHOP') {
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>COIN SHOP</Text>
            <Text style={styles.title}>Coin Shop</Text>
            <Text style={styles.body}>{'Your coins: ' + coins}</Text>
            <Text style={styles.body}>Outfits change how your character looks on the map. They never change wages, credit, or savings.</Text>

            {outfitMessage !== '' && (
              <Text style={styles.body}>{outfitMessage}</Text>
            )}

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>OUTFITS</Text>
              {OUTFITS.map((outfit) => {
                const owned = ownedOutfits.includes(outfit.id);
                const wearing = wornOutfit === outfit.id;
                const afford = coins >= outfit.price;
                return (
                  <View key={outfit.id} style={styles.coinShopRow}>
                    <View style={styles.coinShopSwatchRow}>
                      <View style={[styles.coinShopSwatch, { backgroundColor: outfit.shirt }]} />
                      <View style={[styles.coinShopSwatch, { backgroundColor: outfit.legs }]} />
                      <Text style={styles.progressLine}>{outfit.name}</Text>
                    </View>
                    {wearing ? (
                      <Text style={styles.coinShopWearing}>WEARING</Text>
                    ) : owned ? (
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => wearOutfit(outfit.id)}
                      >
                        <Text style={styles.secondaryText}>WEAR</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => buyOutfit(outfit.id)}
                        disabled={!afford}
                      >
                        <Text style={styles.secondaryText}>{afford ? 'BUY - ' + outfit.price + ' COINS' : 'NEED ' + outfit.price + ' COINS'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText}>BACK TO HOME</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* MY_HOME_INTERIOR_V1_E10_SCREEN: MY HOME, opened from
   * HOME beside MY PROGRESS and the COIN SHOP. Locked until
   * the player is housed (isHoused -- housing ===
   * HOUSING_GOAL.key, 'room_rental'): the locked screen
   * shows only the message and BACK TO HOME, no room and no
   * shop. Once housed: the walk-in living room -- cream
   * walls, light wood floor, a window with blue curtains, a
   * framed art piece, a flat-screen TV and a blue
   * accent-light strip as the always-there base look -- with
   * the player's furniture drawn on the six floor spots from
   * homeLayoutNow. DECORATE mode: spots become tappable gold
   * zones, the furniture tray lists every piece (starter
   * pieces free; the three decorations bought through the
   * shipped purchaseDecoration gate via buyDecoration --
   * coins only, exactly-once, buying never places), a
   * selected piece ghost-previews on every spot it could
   * land on, and tapping a spot places / moves / swaps it
   * for free. BACK returns to the HOME screen; RETURN TO
   * CITY goes straight to the map (setPlace(null)) -- the
   * shipped EXPLORE exit watcher then respawns the player
   * at the entrance of the building they entered through
   * (the HOME building on the normal path), exactly like
   * every other screen exit. The layout persists through
   * the normal save on every change; placedDecorations is
   * re-derived from it by applyHomeLayout. */
  if (place === 'MY_HOME') {
    const housed = isHoused(housing);
    const layout = homeLayoutNow;
    const rugSpotId = typeof layout[HOME_RUG_ID] === 'string' ? layout[HOME_RUG_ID] : null;
    const pieceAtSpot = {};
    for (const piece of HOME_PIECES) {
      if (piece.id !== HOME_RUG_ID && typeof layout[piece.id] === 'string') pieceAtSpot[layout[piece.id]] = piece.id;
    }
    const selectedPiece = homeSelectedPiece ? homePieceById(homeSelectedPiece) : null;
    /* FURNITURE_STORE_V1_E11A_PREAMBLE: the layer pieces
     * are drawn only while placed in their wall slots --
     * a room that has not bought them (or has put them
     * away) shows the bare window, wall and top edge.
     * slotGhost lights a slot's placeholder while its
     * piece is the tray selection; slotPicked marks the
     * slot whose piece is selected. */
    const curtainsPlaced = homeLayoutNow.curtains === 'slot_curtains';
    const artPlaced = homeLayoutNow.wall_art === 'slot_art';
    const lightPlaced = homeLayoutNow.accent_light === 'slot_light';
    const slotGhost = (pieceId, slotId, placed) => homeDecorating && !placed && homeSelectedPiece === pieceId && homeLayoutNow[pieceId] !== slotId;
    const slotPicked = (pieceId) => homeSelectedPiece === pieceId;
    const tapHomeSlot = (slotId) => {
      if (!homeDecorating) return;
      if (homeSelectedPiece) { tapHomeSpot(slotId); return; }
      const pid = homeSlotPieceId(slotId);
      if (pid && homeLayoutNow[pid] === slotId) selectHomePiece(pid);
    };
    const ghostAt = (spot) => {
      if (!homeDecorating || !selectedPiece) return false;
      if (selectedPiece.slot) return false; /* FURNITURE_STORE_V1_E11B_GHOST: a selected layer piece ghosts at its wall slot only, never at floor spots. */
      if (layout[selectedPiece.id] === spot.id) return false;
      if (selectedPiece.id === HOME_RUG_ID) return rugSpotId !== spot.id;
      return !pieceAtSpot[spot.id];
    };
    const renderSpotPiece = (pieceId) => {
      if (pieceId === 'charcoal_sofa') {
        return (
          <View style={styles.homeSofaArt}>
            <View style={styles.homeCharcoalBack} />
            <View style={styles.homeSofaSeatRow}>
              <View style={styles.homePillow} />
              <View style={styles.homePillow} />
            </View>
            <View style={styles.homeCharcoalSeat} />
          </View>
        );
      }
      if (pieceId === 'sofa') {
        return (
          <View style={styles.homeSofaArt}>
            <View style={styles.homeBlackGoldBack} />
            <View style={styles.homeBlackGoldSeat} />
          </View>
        );
      }
      if (pieceId === 'glass_table') {
        return <View style={styles.homeGlassTable} />;
      }
      if (pieceId === 'plant') {
        return <Text style={styles.homePlantEmoji}>{'🪴'}</Text>;
      }
      /* FURNITURE_STORE_V1_E11C_RENDER: the cash furniture
       * drawn in its spot -- the lamp and the armchair as
       * drawn pieces (like the sofas), the bookshelf as
       * its glyph. */
      if (pieceId === 'lamp') {
        return (
          <View style={styles.homeLampArt}>
            <View style={styles.homeLampShade} />
            <View style={styles.homeLampPole} />
            <View style={styles.homeLampBase} />
          </View>
        );
      }
      if (pieceId === 'armchair') {
        return (
          <View style={styles.homeSofaArt}>
            <View style={styles.homeArmchairBack} />
            <View style={styles.homeArmchairSeat} />
          </View>
        );
      }
      if (pieceId === 'bookshelf') {
        return <Text style={styles.homePlantEmoji}>{'📚'}</Text>;
      }
      return null;
    };
    const spotCell = (spot) => {
      const pieceId = pieceAtSpot[spot.id] || null;
      const hasRug = rugSpotId === spot.id;
      const selectedHere = (!!pieceId && homeSelectedPiece === pieceId) || (hasRug && homeSelectedPiece === HOME_RUG_ID);
      const inner = (
        <>
          {hasRug && <View style={styles.homeRugLayer} />}
          {homeDecorating && (
            <Text style={styles.homeSpotName}>{spot.name}</Text>
          )}
          {ghostAt(spot) && (
            <Text style={styles.homeGhostGlyph}>{selectedPiece.glyph}</Text>
          )}
          {pieceId && (
            <View style={styles.homePieceWrap}>
              {renderSpotPiece(pieceId)}
              <Text style={styles.homePieceChip}>{homePieceById(pieceId).name}</Text>
            </View>
          )}
          {!pieceId && hasRug && (
            <Text style={styles.homePieceChip}>{homePieceById(HOME_RUG_ID).name}</Text>
          )}
        </>
      );
      if (!homeDecorating) {
        return (
          <View key={spot.id} style={styles.homeSpot}>
            {inner}
          </View>
        );
      }
      return (
        <TouchableOpacity
          key={spot.id}
          style={[styles.homeSpot, styles.homeSpotActive, selectedHere && styles.homeSpotSelected]}
          onPress={() => {
            if (homeSelectedPiece) tapHomeSpot(spot.id);
            else if (pieceId) selectHomePiece(pieceId);
            else if (hasRug) selectHomePiece(HOME_RUG_ID);
          }}
        >
          {inner}
        </TouchableOpacity>
      );
    };
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText}>BACK TO HOME</Text>
            </TouchableOpacity>

            <Text style={styles.eyebrow}>MY HOME</Text>
            <Text style={styles.title}>My Home</Text>

            {!housed ? (
              <>
                <Text style={styles.body}>MY HOME is locked. You need a home of your own first.</Text>
                <Text style={styles.body}>Sign a lease at HOME to unlock decorating. Once you are housed, you can spend coins on decorations and make the place yours.</Text>
              </>
            ) : (
              <>
                <Text style={styles.body}>{'Your coins: ' + coins}</Text>
                <Text style={styles.body}>This is your living room. Furniture never changes wages, credit, or savings.</Text>

                {decorMessage !== '' && (
                  <Text style={styles.body}>{decorMessage}</Text>
                )}

                <View style={styles.homeRoom}>
                  <View style={styles.homeWall}>
                    {/* FURNITURE_STORE_V1_E11D_WALL: the wall
                      * styling is furniture now. The glow
                      * strip, the curtains and the framed art
                      * render only while their layer piece
                      * sits in its wall slot; in DECORATE
                      * mode each wall element is tappable --
                      * tapping it with its piece selected
                      * places the piece, and tapping a placed
                      * piece selects it. An unplaced slot
                      * shows a quiet placeholder while
                      * decorating: a dashed frame for the
                      * art, a dim strip for the light, and
                      * the ghost glyph in the window while
                      * the curtains are selected. */}
                    {lightPlaced ? (
                      <TouchableOpacity
                        style={[styles.homeGlowStrip, slotPicked('accent_light') && styles.homeSlotPicked]}
                        disabled={!homeDecorating}
                        activeOpacity={1}
                        onPress={() => tapHomeSlot('slot_light')}
                      />
                    ) : (homeDecorating && (
                      <View style={[styles.homeGlowStripEmpty, slotGhost('accent_light', 'slot_light', lightPlaced) && styles.homeGlowStripGhost, slotPicked('accent_light') && styles.homeGlowStripPicked]} />
                    ))}
                    <TouchableOpacity
                      style={[styles.homeWindow, slotPicked('curtains') && styles.homeSlotPicked]}
                      disabled={!homeDecorating}
                      activeOpacity={1}
                      onPress={() => tapHomeSlot('slot_curtains')}
                    >
                      {curtainsPlaced && <View style={styles.homeCurtain} />}
                      <View style={styles.homeWindowPane}>
                        {slotGhost('curtains', 'slot_curtains', curtainsPlaced) && (
                          <Text style={styles.homeGhostGlyph}>{'🟦'}</Text>
                        )}
                      </View>
                      {curtainsPlaced && <View style={styles.homeCurtain} />}
                    </TouchableOpacity>
                    {artPlaced ? (
                      <TouchableOpacity
                        style={[styles.homeArtwork, slotPicked('wall_art') && styles.homeSlotPicked]}
                        disabled={!homeDecorating}
                        activeOpacity={1}
                        onPress={() => tapHomeSlot('slot_art')}
                      >
                        <View style={styles.homeArtSun} />
                        <View style={styles.homeArtHill} />
                      </TouchableOpacity>
                    ) : (homeDecorating && (
                      <TouchableOpacity
                        style={styles.homeArtworkEmpty}
                        activeOpacity={1}
                        onPress={() => tapHomeSlot('slot_art')}
                      >
                        {slotGhost('wall_art', 'slot_art', artPlaced)
                          ? <Text style={styles.homeGhostGlyph}>{'🖼️'}</Text>
                          : <Text style={styles.homeSlotTag}>ART</Text>}
                      </TouchableOpacity>
                    ))}
                    <View style={styles.homeTv}>
                      <Text style={styles.homeTvText}>TV</Text>
                    </View>
                  </View>
                  <View style={styles.homeFloor}>
                    <View style={styles.homePlank} />
                    <View style={styles.homePlank} />
                    <View style={styles.homePlank} />
                  </View>
                  <View style={styles.homeSpotGrid}>
                    <View style={styles.homeSpotRow}>
                      {HOME_SPOTS.slice(0, 3).map(spotCell)}
                    </View>
                    <View style={styles.homeSpotRow}>
                      {HOME_SPOTS.slice(3, 6).map(spotCell)}
                    </View>
                    {/* FURNITURE_STORE_V1_E11E_GRID: the third
                      * row of floor spots (West Corner, Entry
                      * Nook, East Corner) -- the shipped rows
                      * keep their spots and their order. */}
                    <View style={styles.homeSpotRow}>
                      {HOME_SPOTS.slice(6, 9).map(spotCell)}
                    </View>
                  </View>
                </View>

                {!homeDecorating ? (
                  <>
                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={styles.primary}
                        onPress={() => { setHomeSelectedPiece(null); setHomeDecorating(true); }}
                      >
                        <Text style={styles.primaryText}>DECORATE</Text>
                      </TouchableOpacity>
                    </View>
                    {/* FURNITURE_STORE_V1_E11F_BUTTON: the shop
                      * door on the room screen -- view mode
                      * only, and it remembers it came from
                      * here so the shop's BACK lands back in
                      * the room. */}
                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => { setFurnitureReturn('MY_HOME'); setFurnitureConfirm(null); setFurnitureMessage(''); setPlace('FURNITURE_SHOP'); }}
                      >
                        <Text style={styles.secondaryText}>SHOP FURNITURE</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => { setHomeDecorating(false); setHomeSelectedPiece(null); setPlace(null); }}
                      >
                        <Text style={styles.secondaryText}>RETURN TO CITY</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.body}>Tap a piece, then tap a spot to place it. Rearranging is free.</Text>
                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={styles.primary}
                        onPress={() => { setHomeSelectedPiece(null); setHomeDecorating(false); }}
                      >
                        <Text style={styles.primaryText}>DONE</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.progressPanel}>
                      <Text style={styles.progressHeading}>FURNITURE</Text>
                      {HOME_PIECES.map((piece) => {
                        /* FURNITURE_STORE_V1_E11G_TRAY: the tray
                         * lists every room piece -- starters,
                         * coin decorations and cash furniture --
                         * with ownership from the union
                         * (ownsPiece), so a rug bought with cash
                         * reads owned here, and a rug bought
                         * with coins reads owned in the shop.
                         * isDecoration is the DECORATIONS table
                         * itself now (a furniture piece is not
                         * a decoration and has no coin price);
                         * unowned furniture shows its shop
                         * state and gets NO tray buy button --
                         * it is bought with cash in the shop.
                         * Decorations keep their shipped coin
                         * BUY below, untouched. The PLACED
                         * line names spots and wall slots alike
                         * through homeLocationById. */
                        const isDecoration = DECORATIONS.some((entry) => entry.id === piece.id);
                        const isFurniture = FURNITURE.some((entry) => entry.id === piece.id);
                        const owned = ownsPiece(piece.id, ownedDecorations, ownedFurniture);
                        const placedSpot = typeof layout[piece.id] === 'string' ? layout[piece.id] : null;
                        const selected = homeSelectedPiece === piece.id;
                        const afford = isDecoration && coins >= decorationById(piece.id).price;
                        return (
                          <View key={piece.id} style={styles.coinShopRow}>
                            <View style={[styles.homeTrayRow, selected && styles.homeTrayRowSelected]}>
                              <TouchableOpacity
                                style={styles.homeTrayMain}
                                onPress={() => selectHomePiece(piece.id)}
                                disabled={!owned}
                              >
                                <Text style={styles.progressLine}>
                                  {(selected ? '▶ ' : '') + piece.name}
                                </Text>
                                <Text style={styles.body}>
                                  {!owned
                                    ? (isFurniture ? 'In the Furniture Shop · $' + furnitureById(piece.id).price + ' cash' : 'Not owned yet')
                                    : placedSpot
                                      ? 'PLACED · ' + homeLocationById(placedSpot).name
                                      : 'IN TRAY'}
                                </Text>
                              </TouchableOpacity>
                              {!owned && isDecoration && (
                                <TouchableOpacity
                                  style={styles.secondary}
                                  onPress={() => buyDecoration(piece.id)}
                                  disabled={!afford}
                                >
                                  <Text style={styles.secondaryText}>{afford ? 'BUY - ' + decorationById(piece.id).price + ' COINS' : 'NEED ' + decorationById(piece.id).price + ' COINS'}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        );
                      })}
                      {homeSelectedPiece && (
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={putAwaySelectedHomePiece}
                        >
                          <Text style={styles.secondaryText}>PUT AWAY</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => { setHomeDecorating(false); setHomeSelectedPiece(null); setPlace(null); }}
                      >
                        <Text style={styles.secondaryText}>RETURN TO CITY</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText}>BACK TO HOME</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

   /* FURNITURE_STORE_V1_E12_SCREEN: the Store's Furniture
   * section -- its own screen in the COIN SHOP's shape,
   * reached from the MY HOME room (SHOP FURNITURE) or from
   * the map STORE (SHOP FURNITURE), and its BACK returns to
   * whichever door opened it (furnitureReturn; to the map
   * if somehow neither). Each row previews the piece (its
   * glyph and its two blue-palette chips), its name and its
   * cash price. OWNED reads through the union, so the rug
   * bought with coins shows OWNED here. Buying follows the
   * shipped store shape: BUY opens an inline confirm that
   * shows the price and the cash left after, CONFIRM
   * PURCHASE runs the pure gate exactly once, and CANCEL
   * backs out. Cash only. */
  if (place === 'FURNITURE_SHOP') {
    const furnitureBackLabel = furnitureReturn === 'MY_HOME' ? 'BACK TO MY HOME' : furnitureReturn === 'STORE' ? 'BACK TO STORE' : 'BACK TO MAP';
    const furnitureBack = () => {
      setFurnitureConfirm(null);
      setFurnitureMessage('');
      if (furnitureReturn === 'MY_HOME') setPlace('MY_HOME');
      else if (furnitureReturn === 'STORE') setPlace('STORE');
      else setPlace(null);
      setFurnitureReturn(null);
    };
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>STORE — FURNITURE</Text>
            <Text style={styles.title}>Furniture</Text>
            <Text style={styles.body}>{'Your cash: $' + cash.toLocaleString()}</Text>
            <Text style={styles.body}>Furniture for your room at MY HOME. Buying never places a piece — placing, moving and putting away are free in DECORATE.</Text>

            {furnitureMessage !== '' && (
              <Text style={styles.body}>{furnitureMessage}</Text>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={furnitureBack}
            >
              <Text style={styles.secondaryText}>{furnitureBackLabel}</Text>
            </TouchableOpacity>

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>FURNITURE</Text>
              {FURNITURE.map((item) => {
                const owned = ownsPiece(item.id, ownedDecorations, ownedFurniture);
                const confirming = furnitureConfirm === item.id;
                const afford = cash >= item.price;
                return (
                  <View key={item.id} style={styles.coinShopRow}>
                    <View style={styles.coinShopSwatchRow}>
                      <Text style={styles.furnitureGlyph}>{item.glyph}</Text>
                      <View style={[styles.coinShopSwatch, { backgroundColor: item.chip }]} />
                      <View style={[styles.coinShopSwatch, { backgroundColor: item.chip2 }]} />
                      <Text style={styles.progressLine}>{item.name}</Text>
                    </View>
                    <Text style={styles.body}>{'$' + item.price + ' cash'}</Text>
                    {owned ? (
                      <Text style={styles.coinShopWearing}>OWNED</Text>
                    ) : confirming ? (
                      <>
                        <Text style={styles.body}>{'Buy ' + item.name + ' for $' + item.price + '? Cash after: $' + (cash - item.price).toLocaleString()}</Text>
                        <TouchableOpacity
                          style={styles.primary}
                          onPress={() => buyFurniture(item.id)}
                        >
                          <Text style={styles.primaryText}>CONFIRM PURCHASE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => setFurnitureConfirm(null)}
                        >
                          <Text style={styles.secondaryText}>CANCEL</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setFurnitureConfirm(item.id)}
                        disabled={!afford}
                      >
                        <Text style={styles.secondaryText}>{afford ? 'BUY' : 'NEED $' + (item.price - cash) + ' MORE'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.secondary}
              onPress={furnitureBack}
            >
              <Text style={styles.secondaryText}>{furnitureBackLabel}</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

 /* BUSINESS_INTERIORS_V1_E03_SCREENS: the walk-in business
   * interiors -- one themed room per business, reached ONLY
   * by ENTERing its owned storefront in the city (E02). One
   * shared renderer: bizIdForInteriorPlace(place) picks the
   * business, so this single early return dispatches all
   * three interiors. It sits in the screen chain ABOVE the
   * generic place fallback, like every other real screen.
   * The room is flat View / emoji art in the living room's
   * spirit (bizRoom styles, E04); below it sits the working
   * panel -- the business's effective pay line (businessPay),
   * its jobs-done counter (bizJobsDoneToday), a WORK A JOB
   * button calling the SHIPPED workBusinessJob, and the
   * upgrade block wired to the SHIPPED bizUpgradeConfirm /
   * buyBusinessUpgrade flow -- so an interior visit is
   * indistinguishable from the business menu for every
   * counter, cap and report downstream. EXIT TO CITY returns
   * to the map; the shipped exit watcher then respawns the
   * player at this storefront's entrance, because ENTER
   * recorded its place id. A stale place for a business the
   * player does not own (a save reopened into the screen)
   * shows a safety panel with NO work or buy controls.
   * This block adds no economy setter call sites of its own:
   * the buttons call shipped handlers, and its own setters
   * are only setPlace / setBizMessage (navigation + the
   * shared business message, cleared on exit, mirroring the
   * shipped business menu's BACK TO MAP). */
  const bizInteriorBizId = bizIdForInteriorPlace(place);
  if (bizInteriorBizId) {
    const biz = BUSINESSES.find((entry) => entry.id === bizInteriorBizId) || null;
    const bizOwned = !!biz && ownedBusinesses.includes(biz.id);
    const bizUpgraded = bizOwned && businessUpgrades.includes(biz.id);
    const bizPay = biz ? businessPay(biz, businessUpgrades) : 0;
    const bizDoneToday = biz ? bizJobsDoneToday(bizWork, biz.id, day) : 0;
    const exitBizInterior = () => { setBizMessage(''); setPlace(null); };
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={styles.page}>
            <TouchableOpacity style={styles.secondary} onPress={exitBizInterior}>
              <Text style={styles.secondaryText}>EXIT TO CITY</Text>
            </TouchableOpacity>

            <Text style={styles.eyebrow}>{bizOwned ? 'YOUR BUSINESS' : 'BUSINESS'}</Text>
            <Text style={styles.title}>{biz ? biz.name : 'Business'}</Text>

            {!bizOwned ? (
              <>
                <Text style={styles.body}>{'You don’t own this business yet.'}</Text>
                <Text style={styles.body}>Buy it from the business menu first — then you can walk in from its storefront in the city.</Text>
              </>
            ) : (
              <>
                {biz.id === 'cleaning' && (
                  <View style={styles.bizRoom}>
                    <View style={styles.bizRoomWall}>
                      <View style={styles.bizShelf}>
                        <Text style={styles.bizShelfEmoji}>{'🧴 🧽 🧴'}</Text>
                        <View style={styles.bizShelfBar} />
                        <Text style={styles.bizShelfEmoji}>{'🧹 🪣 🧤'}</Text>
                        <View style={styles.bizShelfBar} />
                        <Text style={styles.bizShelfEmoji}>{'🧼 🧴 🧽'}</Text>
                      </View>
                      <View style={styles.bizBoard}>
                        <Text style={styles.bizBoardTitle}>CREW SCHEDULE</Text>
                        <Text style={styles.bizBoardLine}>AM — customer homes</Text>
                        <Text style={styles.bizBoardLine}>PM — offices & stores</Text>
                        <Text style={styles.bizBoardLine}>Supplies restocked Fridays</Text>
                      </View>
                    </View>
                    <View style={styles.bizRoomFloor} />
                    {bizUpgraded && (
                      <View style={styles.bizGoldBanner}>
                        <Text style={styles.bizGoldBannerText}>★ PRO CLEANING CREW ON STAFF ★</Text>
                      </View>
                    )}
                  </View>
                )}
                {biz.id === 'hauling' && (
                  <View style={styles.bizRoom}>
                    <View style={styles.bizRoomWall}>
                      <View style={styles.bizToolWall}>
                        <Text style={styles.bizShelfEmoji}>{'🔧 🪛 🔨'}</Text>
                        <Text style={styles.bizWallLabel}>TOOL WALL</Text>
                      </View>
                      <View style={styles.bizBoxesWrap}>
                        <Text style={styles.bizBoxEmoji}>{'📦 📦'}</Text>
                        <Text style={styles.bizBoxEmoji}>{'📦 📦 📦'}</Text>
                      </View>
                    </View>
                    <View style={styles.bizRoomFloor} />
                    <View style={styles.bizTruck}>
                      <Text style={bizUpgraded ? styles.bizTruckEmojiBig : styles.bizTruckEmoji}>{'🚚'}</Text>
                      {bizUpgraded && <Text style={styles.bizTruckPlate}>HEAVY-DUTY TRUCK</Text>}
                    </View>
                  </View>
                )}
                {biz.id === 'foodstand' && (
                  <View style={styles.bizRoom}>
                    <View style={styles.bizRoomWall}>
                      <View style={styles.bizBoard}>
                        <Text style={styles.bizBoardTitle}>MENU</Text>
                        <Text style={styles.bizBoardLine}>Fish & Fries</Text>
                        <Text style={styles.bizBoardLine}>Shrimp & Fries</Text>
                        <Text style={styles.bizBoardLine}>Fish & Shrimp Combo</Text>
                      </View>
                      <Text style={styles.bizShelfEmoji}>{'🕐'}</Text>
                    </View>
                    <View style={styles.bizRoomFloor} />
                    <View style={styles.bizCounter}>
                      <View style={styles.bizGrillRow}>
                        <View style={styles.bizGrill}>
                          <Text style={styles.bizGrillEmoji}>{'🔥'}</Text>
                          <Text style={styles.bizGrillLabel}>GRILL 1</Text>
                        </View>
                        {bizUpgraded && (
                          <View style={styles.bizGrill}>
                            <Text style={styles.bizGrillEmoji}>{'🔥'}</Text>
                            <Text style={styles.bizGrillLabel}>SECOND GRILL</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.bizCounterTop} />
                    </View>
                  </View>
                )}

                <Text style={styles.body}>{'Each job pays $' + bizPay + ' and takes ' + biz.jobHours + ' hours.'}</Text>
                <Text style={styles.body}>{'Jobs done today: ' + bizDoneToday + ' of 3.'}</Text>
                <TouchableOpacity
                  style={[styles.primary, bizDoneToday >= 3 && { opacity: 0.5 }]}
                  disabled={bizDoneToday >= 3}
                  onPress={() => workBusinessJob(biz.id)}
                >
                  <Text style={styles.primaryText}>
                    {bizDoneToday >= 3 ? '3 JOBS DONE FOR TODAY' : 'WORK A JOB — EARN $' + bizPay}
                  </Text>
                </TouchableOpacity>
                {bizUpgraded ? (
                  <Text style={styles.body}>{'Upgraded: ' + biz.upgradeName + ' ✓'}</Text>
                ) : bizUpgradeConfirm !== biz.id ? (
                  <>
                    <Text style={styles.body}>{'Upgrade: ' + biz.upgradeName + ' — $' + biz.upgradeCost + ' from savings. Pay $' + biz.pay + ' → $' + biz.upgradePay + ' per job.'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setBizUpgradeConfirm(biz.id)}
                    >
                      <Text style={styles.secondaryText}>{'UPGRADE — $' + biz.upgradeCost}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View>
                    <Text style={styles.body}>{'Buy ' + biz.upgradeName + ' for $' + biz.upgradeCost + ' from savings? Every job will pay $' + biz.upgradePay + '.'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => buyBusinessUpgrade(biz.id)}
                    >
                      <Text style={styles.secondaryText}>{'CONFIRM UPGRADE — $' + biz.upgradeCost}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setBizUpgradeConfirm(null)}
                    >
                      <Text style={styles.secondaryText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {bizMessage !== '' && (
                  <Text style={styles.body}>{bizMessage}</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={exitBizInterior}
            >
              <Text style={styles.secondaryText}>EXIT TO CITY</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* MY_GARAGE_V1_E10_SCREEN: MY GARAGE, opened from HOME
   * beside MY PROGRESS, the COIN SHOP, and MY HOME. Viewing
   * and selection ONLY -- nothing is sold here, there are no
   * purchases and no rewards, and no balance is read or
   * written: the player sees the bikes they already own and
   * picks which one is on display. The pick is displayBike;
   * what actually shows is effectiveDisplayBike(ownedBikes,
   * displayBike), so a first bike bought at the DEALERSHIP
   * is on display automatically and a stale pick falls back
   * to the first owned bike. The displayed bike is drawn as
   * flat View art (two wheel circles with gold hubs, a low
   * steel body bar, a gold tank, a dark seat, a slanted fork
   * and handlebar) in a neutral steel-and-gold palette --
   * bike COLORS are a later build. Bikes the player does
   * not own are not listed. Same black-and-gold shell as
   * MY PROGRESS. */
  if (place === 'MY_GARAGE') {
    const garageDisplayId = effectiveDisplayBike(ownedBikes, displayBike);
    const garageDisplayBike = garageDisplayId ? BIKES.find((b) => b.id === garageDisplayId) : null;
    /* GARAGE_PHOTO_V1_E02_FRAME: the applied color dresses
     * the display stage -- garageFrameColors resolves the
     * applied row to the stage frame's border color and the
     * bike name's color, so APPLY recolors the frame at once.
     * The factory row resolves to the stage's original border
     * and the name's original GOLD, so a player who buys no
     * color sees the identical frame. (This replaces
     * BIKE_COLORS_V1's stage paint, which colored the drawn
     * bike that GARAGE_PHOTO_V1 retired.) */
    const garagePaint = bikeColorById(appliedBikeColor);
    const garageFrame = garageFrameColors(garagePaint);
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>MY GARAGE</Text>
            <Text style={styles.title}>My Garage</Text>

            {garageDisplayBike ? (
              <>
                <View style={[styles.garageStage, { borderColor: garageFrame.frame }]}>{/* GARAGE_PHOTO_V1_E03_STAGE_PHOTO */}
                  <Image source={BIKE_IMAGES[garageDisplayBike.id]} style={styles.garageStageImage} resizeMode="contain" />
                </View>
                <Text style={[styles.garageBikeName, { color: garageFrame.name }]}>{garageDisplayBike.name}</Text>
                <Text style={styles.body}>{'Bought for $' + garageDisplayBike.price + ' at the DEALERSHIP.'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.body}>Your garage is empty. You don't own any motorcycles yet.</Text>
                <Text style={styles.body}>Buy a Harley at the DEALERSHIP and it will be on display here.</Text>
              </>
            )}

            {ownedBikes.length > 0 && (
              <View style={styles.progressPanel}>
                <Text style={styles.progressHeading}>YOUR MOTORCYCLES</Text>
                {BIKES.filter((bike) => ownedBikes.includes(bike.id)).map((bike) => {
                  const onDisplay = garageDisplayId === bike.id;
                  return (
                    <View key={bike.id} style={styles.coinShopRow}>
                      <Text style={styles.progressLine}>{bike.name}</Text>
                      {onDisplay ? (
                        <Text style={styles.coinShopWearing}>DISPLAYING</Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => chooseDisplayBike(bike.id)}
                        >
                          <Text style={styles.secondaryText}>DISPLAY</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* BIKE_COLORS_V1_E10_SCREEN: BIKE COLORS, under the
              * motorcycle list and only when the player owns a
              * bike -- the empty garage above stays exactly as
              * it was, with nothing to paint and nothing to buy.
              * Rows mirror the COIN SHOP: color chips, BUY with
              * the price (NEED X COINS when short), APPLY on an
              * owned color, APPLIED on the one in use. Buying
              * runs through purchaseBikeColor -- coins only,
              * exactly-once; applying is free and repaints the
              * stage bike at the top of this screen. */}
            {ownedBikes.length > 0 && (
              <View style={styles.progressPanel}>
                <Text style={styles.progressHeading}>BIKE COLORS</Text>
                <Text style={styles.body}>{'Your coins: ' + coins}</Text>
                <Text style={styles.body}>Colors set the frame and name color in your garage, and the ring around you while you ride. They never change wages, credit, or savings.</Text>
                {bikeColorMessage !== '' && (
                  <Text style={styles.body}>{bikeColorMessage}</Text>
                )}
                {BIKE_COLORS.map((color) => {
                  const owned = ownedBikeColors.includes(color.id);
                  const applied = appliedBikeColor === color.id;
                  const afford = coins >= color.price;
                  return (
                    <View key={color.id} style={styles.coinShopRow}>
                      <View style={styles.coinShopSwatchRow}>
                        <View style={[styles.coinShopSwatch, { backgroundColor: color.tank }]} />
                        <View style={[styles.coinShopSwatch, { backgroundColor: color.body }]} />
                        <View style={[styles.coinShopSwatch, { backgroundColor: color.accent }]} />
                        <Text style={styles.progressLine}>{color.name}</Text>
                      </View>
                      {applied ? (
                        <Text style={styles.coinShopWearing}>APPLIED</Text>
                      ) : owned ? (
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => applyBikeColor(color.id)}
                        >
                          <Text style={styles.secondaryText}>APPLY</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => buyBikeColor(color.id)}
                          disabled={!afford}
                        >
                          <Text style={styles.secondaryText}>{afford ? 'BUY - ' + color.price + ' COINS' : 'NEED ' + color.price + ' COINS'}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText}>BACK TO HOME</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
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

 if (place && place !== 'JOB_BOARD') { /* CITY_JOBS_V1_1_FIX: JOB_BOARD has its own screen below this generic fallback; without the exclusion the fallback swallowed it and rendered a placeholder. */
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

  /* CITY_JOBS_V1_E13_BOARD: the CITY JOBS board, opened from
   * the JOB BOARD kiosk by the Employment Center (ENTER) or the
   * CITY JOBS button on the map. One card per mission kind:
   * destination, task, reward, time required, and its state --
   * ACCEPT, the reason it cannot be taken, or ACTIVE with its
   * progress and a cancel. Accepting returns to the map, where
   * the objective banner and the guide take over. Display and
   * navigation only in this block: accepting/cancelling run the
   * E12 handlers; nothing here moves money. */
  if (place === 'JOB_BOARD') {
    const boardSnap = { ownedBusinesses, businessUpgrades, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount, transitEmployment, transitTraining, ownedBikes, activeMission };
    const boardDeliveriesToday = deliveriesDoneToday(deliveryDay, deliveryCount, day);
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={styles.page}>
            <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}>
              <Text style={styles.secondaryText}>BACK TO MAP</Text>
            </TouchableOpacity>
            <Text style={styles.eyebrow}>CITY JOBS</Text>
            <Text style={styles.title}>City Job Board</Text>
            <Text style={styles.body}>One active mission at a time. Travel in the city, follow the gold guide, and finish the job to get paid. Cancelling a mission costs nothing and pays nothing.</Text>
            {MISSION_KINDS.map((kind) => {
              const def = MISSION_DEFS[kind];
              const biz = def.bizId ? BUSINESSES.find((b) => b.id === def.bizId) : null;
              const reward = biz ? '$' + businessPay(biz, businessUpgrades) + ' cash' : def.rewardText;
              const isActive = !!(activeMission && activeMission.kind === kind);
              const elig = missionEligibility(kind, boardSnap);
              return (
                <View key={kind} style={styles.progressPanel}>
                  <Text style={styles.progressHeading}>{def.title}</Text>
                  <Text style={styles.progressLine}>{'Destination: ' + def.destText}</Text>
                  <Text style={styles.progressLine}>{def.task}</Text>
                  <Text style={styles.progressLine}>{'Reward: ' + reward}</Text>
                  <Text style={styles.progressLine}>{'Time required: ' + def.timeText}</Text>
                  {biz && (
                    <Text style={styles.progressLine}>{'Jobs done today: ' + bizJobsDoneToday(bizWork, biz.id, day) + '/3'}</Text>
                  )}
                  {kind === 'delivery' && (
                    <>
                      <Text style={styles.progressLine}>{'Terms: $' + MISSION_DELIVERY_PAY + ' cash • +' + MISSION_DELIVERY_HOURS + ' hour • max ' + MISSION_DELIVERY_DAILY_MAX + ' per day'}</Text>
                      <Text style={styles.progressLine}>{'Deliveries done today: ' + boardDeliveriesToday + '/' + MISSION_DELIVERY_DAILY_MAX}</Text>
                    </>
                  )}
                  {isActive ? (
                    <>
                      <Text style={styles.progressLine}>{'ACTIVE — ' + missionObjective(activeMission).text}</Text>
                      <TouchableOpacity style={styles.secondary} onPress={cancelMission}>
                        <Text style={styles.secondaryText}>CANCEL MISSION</Text>
                      </TouchableOpacity>
                    </>
                  ) : elig.ok ? (
                    <TouchableOpacity style={styles.primary} onPress={() => acceptMission(kind)}>
                      <Text style={styles.primaryText}>ACCEPT</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.progressLine}>{elig.reason}</Text>
                  )}
                </View>
              );
            })}
            <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}>
              <Text style={styles.secondaryText}>BACK TO MAP</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* EXPLORE_CITY_V1_E12_DERIVED: what the explorable city reads,
   * computed fresh each render from state. The selected bike is
   * the garage's displayed bike (effectiveDisplayBike) -- that is
   * what "which bike is selected" means on the map, and the riding
   * ring wears the applied bike color's frame color. */
  const cityCam = clampCamera(cityPos.x, cityPos.y, cityView.w || 800, cityView.h || 520);
  const cityNear = nearestEntrance(cityPos, CITY_PLACES);
  const cityNearPlace = cityNear && cityNear.dist <= CITY_ENTER_RANGE ? cityNear.place : null;
  const cityNearOwned = cityNearPlace ? cityPlaceOwned(cityNearPlace, ownedBusinesses, propertiesOwned) : false;
  const cityLocation = cityLocationLabel(cityPos);
  const citySelectedBikeId = effectiveDisplayBike(ownedBikes, displayBike);
  const citySelectedBike = citySelectedBikeId ? BIKES.find((b) => b.id === citySelectedBikeId) || null : null;
  const cityRidingBikeDef = ridingBike ? BIKES.find((b) => b.id === ridingBike) || null : null;
  const cityFrame = garageFrameColors(bikeColorById(appliedBikeColor));
  const cityGuide = guidePlace && guidePlace.entrance ? guideTo(cityPos, guidePlace.entrance) : null;
  /* CITY_JOBS_V1_E14_DERIVED: what the mission layer reads --
   * the current stage's spot, the guide to it, whether the
   * player is in interaction range, the stage's button and the
   * objective line. All pure reads of activeMission + cityPos. */
  const missionSpotNow = activeMission ? missionSpot(activeMission) : null;
  const missionGuide = missionSpotNow ? guideTo(cityPos, missionSpotNow) : null;
  const missionInRange = missionGuide ? missionGuide.dist <= CITY_ENTER_RANGE : false;
  const missionAction = activeMission ? missionActionFor(activeMission) : null;
  const missionActionVisible = !!(missionAction && missionInRange);
  const missionObjectiveNow = activeMission ? missionObjective(activeMission) : null;

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
              <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}. Walk to a building and tap ENTER to go inside.</Text>
              <Text style={styles.paydayLine}>{paydayLine(day)}</Text>
            </View>

            <Text style={styles.sectionTitle}>EXPLORE THE CITY</Text>
            {/* EXPLORE_CITY_V1_E13_MAP: the explorable city. The world
                (2400x1600) sits in a fixed viewport, translated by the
                camera; HUD, minimap and controls overlay it. Tap the
                ground to walk there, tap a building to walk to its
                door, or hold the D-pad. */}
            <View
              style={styles.cityViewport}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setCityView((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
              }}
            >
              <View
                ref={cityWorldRef}
                style={[styles.cityWorld, { transform: [{ translateX: -cityCam.x }, { translateY: -cityCam.y }] }]}
              >
                <Pressable
                  style={styles.cityWorldTap}
                  onPress={(e) => {
                    const n = e.nativeEvent || {};
                    if (Number.isFinite(n.locationX) && Number.isFinite(n.locationY)) {
                      cityWalkTo({ x: n.locationX, y: n.locationY });
                      return;
                    }
                    /* Web: press events carry page coordinates; the
                     * world view's measured position already includes
                     * the camera translation. */
                    if (cityWorldRef.current && Number.isFinite(n.pageX) && Number.isFinite(n.pageY)) {
                      cityWorldRef.current.measure((fx, fy, w, h, px, py) => {
                        cityWalkTo({ x: n.pageX - px, y: n.pageY - py });
                      });
                    }
                  }}
                />
                <CityGroundStatic />
                <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: CITY_WORLD.w, height: CITY_WORLD.h, backgroundColor: mapTintForHour(hours).color, opacity: mapTintForHour(hours).opacity }} />
                <CityBuildingsStatic ownedBusinesses={ownedBusinesses} propertiesOwned={propertiesOwned} guideTargetId={guideTargetId} onBuildingPress={cityBuildingPress} />
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[0]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[0].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[1]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[1].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[2]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[2].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[3]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[3].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[0]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[0].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[1]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[1].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} bus={BUS_STOPS} reduceMotion={reduceMotion}>
                  <BusFigure />
                </AmbientActor>
                {cityWalkTarget && (
                  <View pointerEvents="none" style={[styles.cityTargetMark, { left: cityWalkTarget.x - 11, top: cityWalkTarget.y - 11 }]} />
                )}
                <View pointerEvents="none" style={[styles.cityPlayerMark, { left: cityPos.x - 20, top: cityPos.y - 48 }]}>
                  <View style={ridingBike ? [styles.cityRideRing, { borderColor: cityFrame.frame }] : styles.cityRideRingOff}>
                    <PlayerFigure shirt={wornOutfitDef.shirt} legs={wornOutfitDef.legs} />
                  </View>
                  <Text style={styles.cityTag}>YOU</Text>
                </View>
                {/* CITY_JOBS_V1_E15_BUS_MARK: while a transit
                    mission is active the player is driving the
                    bus -- an opaque badge over the figure. */}
                {activeMission && activeMission.kind === 'transit_route' && (
                  <View pointerEvents="none" style={[styles.cityBusMark, { left: cityPos.x - 23, top: cityPos.y - 52 }]}>
                    <Text style={styles.cityBusEmoji}>🚌</Text>
                    <Text style={styles.cityTag}>DRIVING ROUTE</Text>
                  </View>
                )}
              </View>
              {/* HUD: cash, day/time, current location -- slim, top-left. */}
              <View pointerEvents="none" style={styles.cityHud}>
                <Text style={styles.cityHudText}>{'Cash $' + cash}</Text>
                <Text style={styles.cityHudText}>{DAY_NAMES[day % 7]} • {formatClock(hours)}</Text>
                <Text style={styles.cityHudText}>{cityLocation}</Text>
              </View>
              {/* Minimap: gold dots per destination, ring on the guide
                  target, white dot for the player. */}
              <View pointerEvents="none" style={styles.cityMinimap}>
                <View style={styles.cityMinimapEast} />
                {CITY_PLACES.filter((p) => p.entrance).map((p) => (
                  <View key={p.id} style={[styles.cityMinimapDot, { left: 2 + (p.entrance.x / CITY_WORLD.w) * 124, top: 2 + (p.entrance.y / CITY_WORLD.h) * 84 }]} />
                ))}
                {guidePlace && guidePlace.entrance && (
                  <View style={[styles.cityMinimapRing, { left: 2 + (guidePlace.entrance.x / CITY_WORLD.w) * 124 - 3, top: 2 + (guidePlace.entrance.y / CITY_WORLD.h) * 84 - 3 }]} />
                )}
                {missionSpotNow && (
                  <View style={[styles.cityMinimapRing, styles.cityMinimapRingGold, { left: 2 + (missionSpotNow.x / CITY_WORLD.w) * 124 - 3, top: 2 + (missionSpotNow.y / CITY_WORLD.h) * 84 - 3 }]} />
                )}
                {/* CITY_JOBS_V1_E16_MINIMAP_RING: gold ring on the mission target, above. */}
                <View style={[styles.cityMinimapPlayer, { left: 2 + (cityPos.x / CITY_WORLD.w) * 124 - 2, top: 2 + (cityPos.y / CITY_WORLD.h) * 84 - 2 }]} />
              </View>
              {/* Guide chip: eight-way arrow, name, distance, clear. */}
              {cityGuide && guidePlace && !activeMission && ( /* CITY_JOBS_V1_E18_GUIDE_CHIP: the mission guide owns this slot while a mission is active. */
                <View style={styles.cityGuideChip}>
                  <Text style={styles.cityGuideArrow}>{guideArrowChar(cityGuide.angle)}</Text>
                  <Text style={styles.cityGuideText}>{guidePlace.name} • {Math.round(cityGuide.dist)}</Text>
                  <TouchableOpacity onPress={() => setGuideTargetId(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.cityGuideX}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* CITY_JOBS_V1_E17_BANNER: the mission guide
                  chip (arrow, target, distance) and the
                  objective banner -- objective, progress, a
                  notice line and CANCEL -- readable while
                  moving, in the same black-and-gold language. */}
              {activeMission && missionGuide && missionSpotNow && (
                <View style={styles.cityGuideChip}>
                  <Text style={styles.cityGuideArrow}>{guideArrowChar(missionGuide.angle)}</Text>
                  <Text style={styles.cityGuideText}>{missionSpotNow.name} • {Math.round(missionGuide.dist)}</Text>
                </View>
              )}
              {activeMission && missionObjectiveNow && (
                <View style={styles.cityBanner}>
                  <Text style={styles.cityBannerTitle}>{missionObjectiveNow.title}</Text>
                  <Text style={styles.cityBannerText}>{missionObjectiveNow.text}</Text>
                  {missionNotice !== '' && (
                    <Text style={styles.cityBannerNotice}>{missionNotice}</Text>
                  )}
                  <TouchableOpacity style={styles.cityBannerCancel} onPress={cancelMission}>
                    <Text style={styles.cityBannerCancelText}>CANCEL MISSION</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* D-pad: large tablet-friendly hold-to-walk cluster. */}
              <View style={styles.cityDpad}>
                <View style={styles.cityDpadRow}>
                  <View style={styles.cityDpadSpacer} />
                  <TouchableOpacity style={styles.cityDpadBtn} onPressIn={() => cityPadDown(0, -1)} onPressOut={() => cityPadUp(0, -1)}>
                    <Text style={styles.cityDpadText}>▲</Text>
                  </TouchableOpacity>
                  <View style={styles.cityDpadSpacer} />
                </View>
                <View style={styles.cityDpadRow}>
                  <TouchableOpacity style={styles.cityDpadBtn} onPressIn={() => cityPadDown(-1, 0)} onPressOut={() => cityPadUp(-1, 0)}>
                    <Text style={styles.cityDpadText}>◀</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cityDpadBtn} onPressIn={() => cityPadDown(0, 1)} onPressOut={() => cityPadUp(0, 1)}>
                    <Text style={styles.cityDpadText}>▼</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cityDpadBtn} onPressIn={() => cityPadDown(1, 0)} onPressOut={() => cityPadUp(1, 0)}>
                    <Text style={styles.cityDpadText}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Ride / park / find controls, bottom-right. */}
              <View style={styles.cityControls}>
                {ridingBike && cityRidingBikeDef ? (
                  <>
                    <Text style={styles.cityChip}>Riding: {cityRidingBikeDef.name.replace('Harley-Davidson ', '')}</Text>
                    <TouchableOpacity style={styles.cityGoldBtn} onPress={() => setRidingBike(null)}>
                      <Text style={styles.cityGoldBtnText}>PARK BIKE</Text>
                    </TouchableOpacity>
                  </>
                ) : citySelectedBike ? (
                  <>
                    <Text style={styles.cityChip}>Selected: {citySelectedBike.name.replace('Harley-Davidson ', '')}</Text>
                    <TouchableOpacity style={styles.cityGoldBtn} onPress={() => setRidingBike(citySelectedBikeId)}>
                      <Text style={styles.cityGoldBtnText}>RIDE</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                <TouchableOpacity style={styles.cityDarkBtn} onPress={() => setFindOpen(true)}>
                  <Text style={styles.cityDarkBtnText}>FIND A PLACE</Text>
                </TouchableOpacity>
                {/* CITY_JOBS_V1_E20_HUD_BUTTON: the job board is
                    also one tap from the map controls. */}
                <TouchableOpacity style={styles.cityDarkBtn} onPress={() => setPlace('JOB_BOARD')}>
                  <Text style={styles.cityDarkBtnText}>CITY JOBS</Text>
                </TouchableOpacity>
              </View>
              {/* ENTER (or the not-owned note) for the nearest entrance. */}
              {cityNearPlace && !missionActionVisible && ( /* CITY_JOBS_V1_E19_ENTER_SLOT: a mission action owns this slot while offered. */
                <View style={styles.cityEnterWrap} pointerEvents="box-none">
                  {cityNearOwned ? (
                    <TouchableOpacity style={styles.cityEnterBtn} onPress={() => cityEnter(cityNearPlace)}>
                      <Text style={styles.cityEnterText}>ENTER {cityNearPlace.sign}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.cityNote}>
                      <Text style={styles.cityNoteText}>{cityNearPlace.name} — not owned yet</Text>
                    </View>
                  )}
                </View>
              )}
              {/* CITY_JOBS_V1_E21_INTERACT: the current stage's
                  big action button, in the ENTER slot and style,
                  shown only in range of the stage spot. */}
              {missionActionVisible && missionAction && (
                <View style={styles.cityEnterWrap} pointerEvents="box-none">
                  <TouchableOpacity style={styles.cityEnterBtn} onPress={missionInteractPress}>
                    <Text style={styles.cityEnterText}>{missionAction.label}</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* CITY_JOBS_V1_E21_SUMMARY: the completion (or
                  unpaid-end) summary. Transient state only --
                  closing the app here loses nothing, the effects
                  were already applied exactly once. */}
              {missionSummary && (
                <View style={styles.citySummaryPanel}>
                  <Text style={styles.cityFindTitle}>{missionSummary.title}</Text>
                  {missionSummary.lines.map((line, i) => (
                    <Text key={i} style={styles.citySummaryLine}>{line}</Text>
                  ))}
                  <TouchableOpacity style={styles.cityGoldBtn} onPress={() => setMissionSummary(null)}>
                    <Text style={styles.cityGoldBtnText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Find-a-place panel: choosing a destination sets the guide. */}
              {findOpen && (
                <View style={styles.cityFindPanel}>
                  <Text style={styles.cityFindTitle}>FIND A PLACE</Text>
                  <View style={styles.cityFindGrid}>
                    {CITY_PLACES.filter((p) => p.entrance).map((p) => (
                      <TouchableOpacity key={p.id} style={styles.cityFindChip} onPress={() => { setGuideTargetId(p.id); setFindOpen(false); }}>
                        <Text style={styles.cityFindChipText}>{p.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.cityDarkBtn} onPress={() => setFindOpen(false)}>
                    <Text style={styles.cityDarkBtnText}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>


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

  /* BUILDINGS_V1_E10_STYLES: Lori's buildings sit in the same
   * 104px art slot, a touch wider than the old icons; the park
   * plot's container keeps park.png's aspect (512x468); the art fills it. */
  buildingsTileArt: {
    width: 110,
    height: 100,
  },

  buildingsPark: {
    position: 'absolute',
    width: '22%',
    aspectRatio: 512 / 468,
  },

  buildingsParkArt: {
    width: '100%',
    height: '100%',
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

  /* CASINO_RESULT_PANEL_V1: the casino result message now sits on a
   * dark backing panel (deep translucent box, gold accent border) so
   * the big bold white text stays readable over the bright casino
   * backdrop photo. Supersedes the TRANSIT_V1_CASINO_FIX_STYLE
   * sizing-only pass. */
  casinoResult: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
    textAlign: 'center',
    backgroundColor: 'rgba(8, 12, 20, 0.88)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    overflow: 'hidden',
    alignSelf: 'stretch',
    marginBottom: 26,
  },

  /* CASINO_RESULTS_V1_STYLES: the finished-round result block.
   * Same dark backing and gold border as casinoResult, so it reads
   * as one family; the outcome word is large and bright, and all
   * three outcome colors are high-contrast on the near-black panel
   * (the word, not the color, carries the meaning). */
  casinoResultPanel: {
    backgroundColor: 'rgba(8, 12, 20, 0.88)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    alignSelf: 'stretch',
    marginBottom: 26,
    alignItems: 'center',
  },
  casinoOutcome: {
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
    letterSpacing: 2,
    textAlign: 'center',
  },
  casinoOutcomeWin: {
    color: '#7ce495',
  },
  casinoOutcomeLoss: {
    color: '#ff9d8a',
  },
  casinoOutcomePush: {
    color: '#ffd54f',
  },
  casinoResultAmounts: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 2,
  },
  casinoResultDetail: {
    color: '#dbe4ee',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 6,
  },

  /* SAVINGS_GOALS_V1_E10_STYLES: the SAVINGS GOALS form --
   * category chips and text fields in the same black-and-
   * gold family as progressPanel, with large readable text.
   * The progress bar itself reuses the existing
   * progressTrack / progressFill styles. */
  goalChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  goalChip: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 99,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  goalChipSelected: {
    backgroundColor: 'rgba(245, 197, 66, 0.16)',
    borderColor: GOLD,
  },
  goalChipText: {
    color: '#dbe4ee',
    fontSize: 16,
    fontWeight: '700',
  },
  goalChipTextSelected: {
    color: GOLD,
  },
  goalInputLabel: {
    color: GOLD,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  goalInput: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  goalErrorText: {
    color: '#ff9d9d',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 12,
  },

  /* MY_PROGRESS_V1_STYLES: black-and-gold panels for the MY
   * PROGRESS screen -- the same dark backing and gold border
   * family as casinoResult, with large text so every line
   * reads easily on a tablet. */
  progressPanel: {
    backgroundColor: 'rgba(8, 12, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  progressHeading: {
    color: GOLD,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  progressChapter: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 6,
  },
  progressLine: {
    color: '#dbe4ee',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: 6,
  },

  /* COIN_SHOP_V1_E14_STYLES: COIN SHOP rows, in the same
   * black-and-gold family as progressPanel. The two chips
   * preview an outfit's shirt and legs colors before the
   * player spends any coins. */
  coinShopRow: {
    marginBottom: 18,
  },
  coinShopSwatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinShopSwatch: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    marginRight: 8,
  },
  coinShopWearing: {
    color: GOLD,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },

  /* HOME_DECOR_V1_E11_STYLES: the MY HOME room preview -- flat
   * View art in the PlayerFigure spirit, in the game's dark /
   * gold palette. The room is a wall band over a floor band;
   * each placed decoration is absolutely positioned at a fixed
   * spot: the sofa against the wall on the left, the rug flat
   * in the middle of the floor, the houseplant standing in the
   * right corner (green foliage over a brown pot). */
  decorRoom: {
    position: 'relative',
    height: 250,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    backgroundColor: '#101623',
    overflow: 'hidden',
    marginBottom: 22,
  },
  decorWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 158,
    backgroundColor: '#263650',
  },
  decorFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 92,
    backgroundColor: '#4a3520',
    borderTopWidth: 3,
    borderTopColor: 'rgba(245, 197, 66, 0.55)',
  },
  decorSofa: {
    position: 'absolute',
    left: 26,
    bottom: 82,
    width: 148,
  },
  decorSofaBack: {
    height: 46,
    backgroundColor: '#16181d',
    borderWidth: 2,
    borderColor: '#e8b93c',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  decorSofaTrim: {
    height: 5,
    backgroundColor: '#e8b93c',
    marginTop: 3,
  },
  decorSofaSeat: {
    height: 20,
    backgroundColor: '#16181d',
    borderWidth: 2,
    borderColor: '#e8b93c',
    borderRadius: 6,
    marginTop: 3,
  },
  decorRug: {
    position: 'absolute',
    bottom: 16,
    left: '24%',
    width: '52%',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2f6fd0',
    borderWidth: 2,
    borderColor: 'rgba(219, 228, 238, 0.55)',
  },
  decorPlant: {
    position: 'absolute',
    right: 26,
    bottom: 14,
    alignItems: 'center',
  },
  decorPlantLeaves: {
    width: 58,
    height: 44,
  },
  decorPlantLeafBig: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2f9e44',
  },
  decorPlantLeafSmall: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3cb54f',
  },
  decorPlantPot: {
    width: 30,
    height: 24,
    backgroundColor: '#7a5230',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    marginTop: 1,
  },

  /* MY_HOME_INTERIOR_V1_E11_STYLES: the walk-in living room.
   * Cream wall over a light wood floor; a blue accent-light
   * strip glows along the top of the wall; a window with
   * blue curtains, a framed art piece and a flat-screen TV
   * dress the wall. The six floor spots form a 3 x 2 grid
   * over the floor band only (the grid lives inside the
   * room box, above its bottom edge -- the DECORATE / DONE /
   * BACK / RETURN TO CITY buttons all render below the room
   * in the page flow, so a spot can never overlap a button);
   * in decorate mode each spot is a dashed gold tappable
   * zone. Pieces are flat View art in the PlayerFigure
   * spirit: charcoal sofa with blue pillows, a black-and-gold
   * sofa, a glass coffee table, the rug as a flat blue floor
   * layer under whatever shares its spot. */
  /* FURNITURE_STORE_V1_E14A_ROOM: the room grows to 430
   * tall for the third row of floor spots. The wall keeps
   * its 196 height, so the floor band becomes 196..430 and
   * the spot grid (bottom inset 6) still lies fully inside
   * it at the shipped ~76-unit row height. */
  homeRoom: {
    position: 'relative',
    height: 430,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    backgroundColor: '#f2e8d5',
    overflow: 'hidden',
    marginBottom: 22,
  },
  homeWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 196,
    backgroundColor: '#f2e8d5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 26,
    paddingHorizontal: 18,
  },
  homeGlowStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 9,
    backgroundColor: '#57b6ff',
    opacity: 0.85,
  },
  homeWindow: {
    flexDirection: 'row',
    width: 118,
    height: 104,
    borderWidth: 3,
    borderColor: '#b09a72',
    backgroundColor: '#bcd8f2',
    overflow: 'hidden',
  },
  homeCurtain: {
    width: 20,
    backgroundColor: '#2f6fd0',
  },
  homeWindowPane: {
    flex: 1,
    backgroundColor: '#bcd8f2',
  },
  homeArtwork: {
    width: 66,
    height: 84,
    borderWidth: 5,
    borderColor: '#a87f2f',
    backgroundColor: '#9fc6ee',
    position: 'relative',
    overflow: 'hidden',
  },
  homeArtSun: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f5c542',
  },
  homeArtHill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 26,
    backgroundColor: '#2f9e44',
    borderTopLeftRadius: 20,
  },
  homeTv: {
    width: 132,
    height: 78,
    backgroundColor: '#101623',
    borderWidth: 3,
    borderColor: '#232a35',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeTvText: {
    color: '#7fb2e5',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
  },
  homeFloor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 234, /* FURNITURE_STORE_V1_E14B_FLOOR: grows with the room; the wall/floor seam stays at y = 196. */
    backgroundColor: '#c89b62',
    borderTopWidth: 3,
    borderTopColor: '#a67c44',
    justifyContent: 'space-evenly',
  },
  homePlank: {
    height: 2,
    backgroundColor: 'rgba(122, 82, 48, 0.45)',
  },
  homeSpotGrid: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 6,
    height: 222, /* FURNITURE_STORE_V1_E14C_GRID: three rows now; the grid top stays at y = 202 and its bottom edge at y = 424, inside the room. */
  },
  homeSpotRow: {
    flex: 1,
    flexDirection: 'row',
  },
  homeSpot: {
    flex: 1,
    margin: 3,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    paddingBottom: 2,
  },
  homeSpotActive: {
    borderStyle: 'dashed',
    borderColor: 'rgba(245, 197, 66, 0.9)',
    backgroundColor: 'rgba(16, 22, 35, 0.18)',
  },
  homeSpotSelected: {
    borderStyle: 'solid',
    borderColor: '#f5c542',
    backgroundColor: 'rgba(245, 197, 66, 0.22)',
  },
  homeSpotName: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  homeGhostGlyph: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    fontSize: 26,
    opacity: 0.35,
  },
  homeRugLayer: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 4,
    height: 26,
    backgroundColor: '#2f6fd0',
    borderWidth: 2,
    borderColor: '#7fb2e5',
    borderRadius: 10,
  },
  homePieceWrap: {
    alignItems: 'center',
  },
  homePieceChip: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    color: '#fdf6e0',
    backgroundColor: 'rgba(16, 22, 35, 0.72)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  homeSofaArt: {
    alignItems: 'center',
  },
  homeCharcoalBack: {
    width: 74,
    height: 24,
    backgroundColor: '#343a42',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  homeSofaSeatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -9,
    zIndex: 1,
  },
  homePillow: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#2f6fd0',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#7fb2e5',
  },
  homeCharcoalSeat: {
    width: 78,
    height: 12,
    backgroundColor: '#343a42',
    borderRadius: 5,
    marginTop: -3,
  },
  homeBlackGoldBack: {
    width: 74,
    height: 24,
    backgroundColor: '#16181d',
    borderWidth: 2,
    borderColor: '#e8b93c',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  homeBlackGoldSeat: {
    width: 78,
    height: 13,
    backgroundColor: '#16181d',
    borderWidth: 2,
    borderColor: '#e8b93c',
    borderRadius: 5,
    marginTop: 2,
  },
  homeGlassTable: {
    width: 58,
    height: 24,
    backgroundColor: 'rgba(159, 208, 245, 0.55)',
    borderWidth: 2,
    borderColor: '#9fd0f5',
    borderRadius: 4,
    marginBottom: 8,
  },
  homePlantEmoji: {
    fontSize: 34,
  },
  homeBtnGap: {
    marginBottom: 14,
  },
  homeTrayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 6,
  },
  homeTrayRowSelected: {
    borderColor: '#f5c542',
    backgroundColor: 'rgba(245, 197, 66, 0.08)',
  },
  homeTrayMain: {
    flex: 1,
  },
  /* FURNITURE_STORE_V1_E14D_STYLES: the drawn lamp, the
   * blue armchair, the unplaced-slot placeholders and the
   * Furniture Shop's row pieces. */
  homeLampArt: {
    alignItems: 'center',
  },
  homeLampShade: {
    width: 26,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#57b6ff',
    borderWidth: 2,
    borderColor: '#2f6fd0',
  },
  homeLampPole: {
    width: 4,
    height: 22,
    backgroundColor: '#2f6fd0',
  },
  homeLampBase: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2f6fd0',
  },
  homeArmchairBack: {
    width: 34,
    height: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#2f6fd0',
    borderWidth: 2,
    borderColor: '#7fb2e5',
  },
  homeArmchairSeat: {
    width: 44,
    height: 16,
    borderRadius: 6,
    backgroundColor: '#2f6fd0',
    borderWidth: 2,
    borderColor: '#7fb2e5',
    marginTop: -3,
  },
  homeArtworkEmpty: {
    width: 74,
    height: 54,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e8b93c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232, 185, 60, 0.08)',
  },
  homeSlotTag: {
    color: '#e8b93c',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  homeSlotPicked: {
    borderColor: '#f5c542',
    borderWidth: 3,
  },
  homeGlowStripEmpty: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: 'rgba(87, 182, 255, 0.18)',
  },
  homeGlowStripGhost: {
    backgroundColor: 'rgba(87, 182, 255, 0.45)',
  },
  homeGlowStripPicked: {
    backgroundColor: '#57b6ff',
  },
  furnitureGlyph: {
    fontSize: 24,
    marginRight: 8,
  },

  /* BUSINESS_INTERIORS_V1_E04_STYLES: the walk-in business
   * rooms -- one shell for all three (a work-space wall band
   * over a service floor, gold-trimmed like the living room).
   * Cleaning gets supply shelves + a paper schedule board on
   * the wall and a gold crew banner over the floor seam when
   * the Pro Cleaning Crew is on staff; Hauling gets a tool
   * wall, stacked boxes and the truck standing on the floor
   * (bigger emoji + a gold plate with the Heavy-Duty Truck);
   * the Food Stand gets its menu board, a wall clock, and a
   * counter with one grill -- two when the Second Grill is
   * fitted. Flat View / emoji art only, no new assets. */
  bizRoom: {
    position: 'relative',
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    backgroundColor: '#2c313a',
    overflow: 'hidden',
    marginBottom: 22,
  },
  bizRoomWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    paddingTop: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bizRoomFloor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
    backgroundColor: '#5d4630',
    borderTopWidth: 3,
    borderTopColor: '#42311f',
  },
  bizShelf: {
    width: 132,
    backgroundColor: '#54432c',
    borderRadius: 6,
    padding: 8,
  },
  bizShelfBar: {
    height: 4,
    backgroundColor: '#2e2416',
    borderRadius: 2,
    marginVertical: 5,
  },
  bizShelfEmoji: {
    fontSize: 21,
    textAlign: 'center',
  },
  bizBoard: {
    width: 150,
    backgroundColor: '#f2e8d5',
    borderWidth: 3,
    borderColor: '#a87f2f',
    borderRadius: 4,
    padding: 8,
  },
  bizBoardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#232a35',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bizBoardLine: {
    fontSize: 11,
    color: '#232a35',
    marginTop: 2,
  },
  bizGoldBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 112,
    backgroundColor: '#f5c542',
    paddingVertical: 5,
    alignItems: 'center',
  },
  bizGoldBannerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#232a35',
    letterSpacing: 1,
  },
  bizToolWall: {
    width: 120,
    backgroundColor: '#37404c',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  bizWallLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f5c542',
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
  },
  bizBoxesWrap: {
    alignItems: 'center',
  },
  bizBoxEmoji: {
    fontSize: 24,
  },
  bizTruck: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
  },
  bizTruckEmoji: {
    fontSize: 64,
  },
  bizTruckEmojiBig: {
    fontSize: 84,
  },
  bizTruckPlate: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '800',
    color: '#f5c542',
    backgroundColor: 'rgba(16, 22, 35, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bizCounter: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 30,
    alignItems: 'center',
  },
  bizGrillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bizGrill: {
    alignItems: 'center',
    marginHorizontal: 14,
  },
  bizGrillEmoji: {
    fontSize: 34,
  },
  bizGrillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffd9a0',
    letterSpacing: 1,
    marginTop: 2,
  },
  bizCounterTop: {
    marginTop: 6,
    height: 16,
    alignSelf: 'stretch',
    backgroundColor: '#8a5a33',
    borderRadius: 4,
    borderTopWidth: 3,
    borderTopColor: '#c89b62',
  },

  /* MY_GARAGE_V1_E11_STYLES: the MY GARAGE display stage --
   * flat View art in the PlayerFigure / room-preview spirit,
   * in a neutral steel-and-gold palette (bike colors are a
   * later build). The stage is a dark floor band with the
   * bike standing on it: two wheel circles with gold hubs, a
   * low steel body bar, a gold tank, a dark seat, and a
   * slanted fork up to the handlebar. */
  garageStage: {
    position: 'relative',
    height: 216,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    backgroundColor: '#101623',
    overflow: 'hidden',
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  /* GARAGE_PHOTO_V1_E04_STAGE_IMAGE_STYLE: the displayed
   * bike's real photo fills the stage box (the stage keeps
   * its size and proportions); contain shows the whole wide
   * picture, mirroring the dealership's detail image. */
  garageStageImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  garageFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#263650',
    borderTopWidth: 3,
    borderTopColor: 'rgba(245, 197, 66, 0.55)',
  },
  garageBike: {
    position: 'relative',
    width: 252,
    height: 122,
  },
  garageWheelBack: {
    position: 'absolute',
    left: 12,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: '#9aa7b8',
    backgroundColor: '#101623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageWheelFront: {
    position: 'absolute',
    right: 12,
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 6,
    borderColor: '#9aa7b8',
    backgroundColor: '#101623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  garageHub: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e8b93c',
  },
  garageBody: {
    position: 'absolute',
    left: 56,
    bottom: 30,
    width: 122,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#5b6b7f',
  },
  garageTank: {
    position: 'absolute',
    left: 126,
    bottom: 42,
    width: 66,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e8b93c',
  },
  garageSeat: {
    position: 'absolute',
    left: 62,
    bottom: 44,
    width: 54,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#16181d',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
  },
  garageFork: {
    position: 'absolute',
    right: 38,
    bottom: 8,
    width: 7,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#9aa7b8',
    transform: [{ rotate: '16deg' }],
  },
  garageBar: {
    position: 'absolute',
    right: 18,
    bottom: 68,
    width: 32,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#dbe4ee',
    transform: [{ rotate: '-18deg' }],
  },
  garageBikeName: {
    color: GOLD,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 10,
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

  /* EXPLORE_CITY_V1_E16_STYLES: the explorable city -- viewport,
   * world layers, HUD, minimap, guide, D-pad and controls.
   * Black-and-gold menus over the world, large text and buttons. */
  cityViewport: {
    width: '100%',
    height: 520,
    backgroundColor: '#101c2e',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 4,
  },
  cityWorld: { width: 2400, height: 1600 },
  cityWorldTap: { position: 'absolute', left: 0, top: 0, width: 2400, height: 1600 },
  cityLayer: { position: 'absolute', left: 0, top: 0, width: 2400, height: 1600 },
  cityGround: { position: 'absolute', left: 0, top: 0, width: 2400, height: 1600, backgroundColor: '#26331f' },
  cityEastShade: { position: 'absolute', left: 1660, top: 0, width: 740, height: 1600, backgroundColor: 'rgba(62, 166, 255, 0.07)' },
  citySidewalk: { position: 'absolute', backgroundColor: '#66707c', borderRadius: 10 },
  cityRoad: { position: 'absolute', backgroundColor: '#39424d' },
  cityDashV: { position: 'absolute', width: 6, height: 56, backgroundColor: 'rgba(244, 197, 66, 0.5)', borderRadius: 3 },
  cityDashH: { position: 'absolute', width: 56, height: 6, backgroundColor: 'rgba(244, 197, 66, 0.5)', borderRadius: 3 },
  cityCrossH: { position: 'absolute', width: 120, height: 12, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 },
  cityCrossV: { position: 'absolute', width: 12, height: 120, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 },
  cityParkLawn: { position: 'absolute', backgroundColor: '#2f5d2a', borderRadius: 18, borderWidth: 2, borderColor: '#3f7a37', alignItems: 'center', justifyContent: 'center' },
  cityParkArt: { width: '92%', height: '92%' },
  cityHouse: { position: 'absolute', backgroundColor: '#5d4a33', borderRadius: 10, borderWidth: 2, borderColor: '#3d2f1e' },
  cityHouseRoof: { height: '26%', backgroundColor: '#8a3b2e', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  cityHouseDoor: { position: 'absolute', bottom: 0, left: '42%', width: '16%', height: '34%', backgroundColor: '#2b1d12', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  cityBuildingTouch: { position: 'absolute', alignItems: 'center' },
  cityPad: { position: 'absolute', left: -12, top: -12, right: -12, bottom: -12, backgroundColor: 'rgba(214, 200, 160, 0.18)', borderRadius: 14 },
  cityBuildingArt: { width: '100%', height: '76%' },
  cityStorefront: { width: '100%', height: '76%', borderRadius: 10, borderWidth: 2, borderColor: '#10151d' },
  cityStoreRoof: { height: '22%', backgroundColor: GOLD, borderTopLeftRadius: 8, borderTopRightRadius: 8, opacity: 0.85 },
  cityStoreDoor: { position: 'absolute', bottom: 0, left: '40%', width: '20%', height: '40%', backgroundColor: '#10151d', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  citySign: { backgroundColor: 'rgba(7, 13, 22, 0.88)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10, alignItems: 'center', marginTop: 4 },
  citySignText: { color: '#ffffff', fontWeight: '900', fontSize: 17, letterSpacing: 1 },
  cityOwnedTag: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cityNotOwnedTag: { color: '#8fa3bd', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cityGuideRing: { position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, borderWidth: 4, borderColor: GOLD, borderRadius: 14 },
  cityTargetMark: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: GOLD, backgroundColor: 'rgba(244, 197, 66, 0.25)' },
  cityPlayerMark: { position: 'absolute', width: 40, alignItems: 'center' },
  cityRideRing: { borderWidth: 3, borderRadius: 24, padding: 2, alignItems: 'center' },
  cityRideRingOff: { borderWidth: 3, borderColor: 'transparent', borderRadius: 24, padding: 2, alignItems: 'center' },
  cityHud: { position: 'absolute', left: 8, top: 8, right: 148, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityHudText: { color: '#ffffff', backgroundColor: 'rgba(7, 13, 22, 0.82)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, fontSize: 16, fontWeight: '800', overflow: 'hidden' },
  cityMinimap: { position: 'absolute', right: 8, top: 8, width: 132, height: 92, backgroundColor: 'rgba(7, 13, 22, 0.88)', borderWidth: 1, borderColor: GOLD, borderRadius: 10 },
  cityMinimapEast: { position: 'absolute', left: 80, top: 0, width: 50, height: 90, backgroundColor: 'rgba(62, 166, 255, 0.15)', borderTopRightRadius: 10, borderBottomRightRadius: 10 },
  cityMinimapDot: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD },
  cityMinimapRing: { position: 'absolute', width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: '#ffffff' },
  cityMinimapPlayer: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#07101c' },
  cityGuideChip: { position: 'absolute', top: 54, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 },
  cityGuideArrow: { color: GOLD, fontSize: 22, fontWeight: '900' },
  cityGuideText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  cityGuideX: { color: GOLD, fontSize: 18, fontWeight: '900', paddingHorizontal: 4 },
  cityDpad: { position: 'absolute', left: 10, bottom: 10, gap: 6 },
  cityDpadRow: { flexDirection: 'row', gap: 6 },
  cityDpadBtn: { width: 64, height: 64, borderRadius: 14, backgroundColor: 'rgba(7, 13, 22, 0.85)', borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center' },
  cityDpadSpacer: { width: 64, height: 64 },
  cityDpadText: { color: GOLD, fontSize: 26, fontWeight: '900' },
  cityControls: { position: 'absolute', right: 10, bottom: 10, alignItems: 'flex-end', gap: 8 },
  cityChip: { color: '#ffffff', backgroundColor: 'rgba(7, 13, 22, 0.85)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, fontSize: 15, fontWeight: '800', overflow: 'hidden' },
  cityGoldBtn: { backgroundColor: GOLD, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20 },
  cityGoldBtnText: { color: '#10151d', fontSize: 17, fontWeight: '900', letterSpacing: 1 },
  cityDarkBtn: { backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: GOLD, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  cityDarkBtnText: { color: GOLD, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  cityEnterWrap: { position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' },
  cityEnterBtn: { backgroundColor: GOLD, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 34, borderWidth: 2, borderColor: '#10151d' },
  cityEnterText: { color: '#10151d', fontSize: 21, fontWeight: '900', letterSpacing: 1 },
  cityNote: { backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: '#8fa3bd', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
  cityNoteText: { color: '#dbe4ee', fontSize: 16, fontWeight: '800' },
  cityFindPanel: { position: 'absolute', left: 16, right: 16, top: 100, backgroundColor: 'rgba(7, 13, 22, 0.96)', borderWidth: 2, borderColor: GOLD, borderRadius: 16, padding: 16, alignItems: 'center', zIndex: 30 },
  cityFindTitle: { color: GOLD, fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 12 },
  cityFindGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 },
  cityFindChip: { backgroundColor: '#16283f', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  cityFindChipText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  /* CITY_JOBS_V1_E22_STYLES: the mission layer -- objective
   * banner (below the guide chip, clear of the HUD and the
   * minimap), the completion summary panel, the driven-bus
   * marker badge and the gold minimap ring. Same black-and-gold
   * language, text at HUD size or larger. */
  cityBanner: { position: 'absolute', top: 102, left: 16, right: 16, backgroundColor: 'rgba(7, 13, 22, 0.94)', borderWidth: 2, borderColor: GOLD, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, alignItems: 'center', zIndex: 20 },
  cityBannerTitle: { color: GOLD, fontSize: 17, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  cityBannerText: { color: '#ffffff', fontSize: 16, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  cityBannerNotice: { color: '#ffd23f', fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  cityBannerCancel: { marginTop: 8, borderWidth: 1, borderColor: '#e0655f', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  cityBannerCancelText: { color: '#ff9d97', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  citySummaryPanel: { position: 'absolute', left: 24, right: 24, top: 150, backgroundColor: 'rgba(7, 13, 22, 0.97)', borderWidth: 2, borderColor: GOLD, borderRadius: 16, padding: 18, alignItems: 'center', zIndex: 40 },
  citySummaryLine: { color: '#ffffff', fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  cityBusMark: { position: 'absolute', width: 46, alignItems: 'center', backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 2, borderColor: GOLD, borderRadius: 12, paddingVertical: 3 },
  cityBusEmoji: { fontSize: 24 },
  cityMinimapRingGold: { borderColor: GOLD },
});
