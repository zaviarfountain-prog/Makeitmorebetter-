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
  PanResponder, /* EXPANSION_DEL1_P_IMPORT: swipe-to-pan on the city map viewport (D1). */
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
  /* REALISTIC_LOOK_VIS2B_E02_ART_MAP: the five places that
   * shipped with code-drawn facades (VISUAL_V1) gain real art
   * in the same folder -- the two rental properties and the
   * three business buildings. Their CITY_PLACES rows name
   * these keys (the five row edits), so the shipped render
   * ternary routes them to the Image branch; the drawn
   * facade stays for the Job Board kiosk. */
  duplex: require('./assets/buildings/duplex.png'),
  apartment: require('./assets/buildings/apartment.png'),
  cleaning: require('./assets/buildings/cleaning.png'),
  hauling: require('./assets/buildings/hauling.png'),
  foodstand: require('./assets/buildings/foodstand.png'),
  /* VISUAL_CONSISTENCY_CITY3_E02_ART_MAP: the three
   * customer-house variants -- VIS2-style sprites in the
   * same folder, drawn for the nine BIZ_CUSTOMERS spots.
   * The CITY3_CUSTOMER_HOUSES table (E03) names these
   * keys, and the houses layer in CityBuildingsStatic
   * (E04) renders them through this map, exactly as the
   * places above render through their art keys. */
  custhouse_a: require('./assets/buildings/custhouse_a.png'),
  custhouse_b: require('./assets/buildings/custhouse_b.png'),
  custhouse_c: require('./assets/buildings/custhouse_c.png'),
  scenery_house: require('./assets/buildings/scenery_house.png'), /* CITY_POLISH_VIS3_E02_SCENERY_ART: the decorative scenery house's realistic sprite (VIS3 art) -- a new key on the shipped art map; no existing key, place row or geometry changes. */
};

/* HOME_INTERIOR_HOME1_E02_ART_MAP: the realistic
 * furniture sprites for the MY HOME living room -- the
 * VIS2-style art pass, in the NEW assets/furniture/
 * folder. Exactly six pieces gain a picture: the
 * charcoal sofa, the glass coffee table, the floor
 * lamp and the bookshelf on the floor spots, and the
 * curtains and wall art in their wall slots. The
 * render branches name these keys (E03-E08); every
 * other room piece keeps its shipped drawing. Map art
 * only -- no game text, price, or rule lives here. */
const FURNITURE_V1_ART = {
  sofa: require('./assets/furniture/sofa.png'),
  coffee_table: require('./assets/furniture/coffee_table.png'),
  lamp: require('./assets/furniture/lamp.png'),
  bookshelf: require('./assets/furniture/bookshelf.png'),
  curtains: require('./assets/furniture/curtains.png'),
  wall_art: require('./assets/furniture/wall_art.png'),
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

/* VISUAL_V1_E02_HELPERS: look-only helpers for the VIS1
 * build -- deterministic lit windows, a drawn coin, window
 * grids and code-drawn building facades, plus the `vis`
 * stylesheet. Everything here is pure presentation: no state,
 * no handlers, no economy contact. Lit patterns derive from a
 * seeded hash of the building id, never Math.random, so a
 * building's lit windows are the same on every render. */
function visualSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function litPattern(seed, count, litPct) {
  let s = visualSeed(seed) || 1;
  const out = [];
  for (let i = 0; i < count; i++) {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    out.push(((s >>> 8) % 100) < litPct);
  }
  return out;
}

/* VISUAL_V1_E02_COINICON: a shiny gold coin drawn from pure
 * Views -- outer rim, raised inner ring, one shine dot. Used
 * wherever a coin amount used to be bare text or the old PNG
 * glyph. Size is a primitive prop, default 18. */
function CoinIcon({ size = 18, style }) {
  const ring = Math.max(4, Math.round(size * 0.62));
  const shine = Math.max(2, Math.round(size * 0.2));
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#f4c542', borderWidth: 2, borderColor: '#a87f14', alignItems: 'center', justifyContent: 'center' }, style]}>
      <View style={{ width: ring, height: ring, borderRadius: ring / 2, borderWidth: 1, borderColor: '#c9930a', backgroundColor: '#ffd94d' }} />
      <View style={{ position: 'absolute', left: Math.round(size * 0.22), top: Math.round(size * 0.15), width: shine, height: shine, borderRadius: shine / 2, backgroundColor: 'rgba(255,255,255,0.85)' }} />
    </View>
  );
}

/* VISUAL_V1_E02_WINDOWGRID: a deterministic window grid for a
 * code-drawn facade or house. Lit windows are bright gold;
 * dark ones are deep night glass. Primitives only. */
function WindowGrid({ seed, cols, rows, winW, winH, gap, litPct, style }) {
  const lit = litPattern(seed, cols * rows, litPct == null ? 45 : litPct);
  const cells = [];
  for (let i = 0; i < cols * rows; i++) {
    cells.push(<View key={'w' + i} style={[vis.win, { width: winW, height: winH }, lit[i] ? vis.winLit : vis.winDark]} />);
  }
  return (
    <View pointerEvents="none" style={[vis.winGrid, { width: cols * winW + (cols - 1) * gap, gap: gap }, style]}>
      {cells}
    </View>
  );
}

/* VISUAL_V1_E02_FACADE: the code-drawn building faces, keyed
 * by place so each place reads as its own kind of building:
 * apartment = many windows + balcony lines; duplex = windows
 * + door; warehouse (Hauling) = high small windows + a wide
 * loading door; store (Cleaning) = striped awning + one wide
 * lit display window + door; food stand = awning + serving
 * window + counter + side door; job board kiosk keeps the
 * shipped roof strip on a 30px-tall body. The root reuses
 * styles.cityStorefront (76% height, border) with the shipped
 * per-kind background colors, so the sign layout below is
 * pixel-identical to before. */
function buildingVariantFor(place) {
  if (place.id === 'apartment') return 'apartment';
  if (place.id === 'duplex') return 'duplex';
  if (place.id === 'hauling') return 'warehouse';
  if (place.id === 'cleaning') return 'store';
  if (place.id === 'foodstand') return 'foodstand';
  if (place.id === 'jobboard') return 'kiosk';
  return place.kind === 'property' ? 'duplex' : 'store';
}

function BuildingFacade({ place }) {
  const variant = buildingVariantFor(place);
  const baseBg = place.kind === 'property' ? '#4a3b26' : '#31435c';
  if (variant === 'kiosk') {
    return (
      <View style={[styles.cityStorefront, { backgroundColor: baseBg }]}>
        <View style={styles.cityStoreRoof} />
      </View>
    );
  }
  if (variant === 'warehouse') {
    return (
      <View style={[styles.cityStorefront, { backgroundColor: '#3a3f47' }]}>
        <View style={styles.cityStoreRoof} />
        <WindowGrid seed={place.id} cols={4} rows={1} winW={30} winH={15} gap={12} litPct={50} style={{ marginTop: 12 }} />
        <View style={vis.loadingDoor}>
          <View style={vis.loadingSlat} />
          <View style={vis.loadingSlat} />
          <View style={vis.loadingSlat} />
        </View>
      </View>
    );
  }
  if (variant === 'apartment') {
    return (
      <View style={[styles.cityStorefront, { backgroundColor: baseBg }]}>
        <View style={styles.cityStoreRoof} />
        <WindowGrid seed={place.id} cols={5} rows={3} winW={30} winH={30} gap={11} litPct={45} style={{ marginTop: 12 }} />
        <View style={[vis.balconyLine, { top: '45%' }]} />
        <View style={[vis.balconyLine, { top: '65%' }]} />
        <View style={styles.cityStoreDoor} />
      </View>
    );
  }
  if (variant === 'store' || variant === 'foodstand') {
    const awningColor = variant === 'store' ? '#a03a32' : '#2f7a4d';
    return (
      <View style={[styles.cityStorefront, { backgroundColor: baseBg }]}>
        <View style={vis.awning}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={'aw' + i} style={{ flex: 1, backgroundColor: i % 2 ? '#e8ddc8' : awningColor }} />
          ))}
        </View>
        <View style={[vis.displayWin, { width: variant === 'store' ? 150 : 118, height: variant === 'store' ? 52 : 40, marginTop: variant === 'store' ? 26 : 14 }]} />
        {variant === 'store' ? <View style={styles.cityStoreDoor} /> : <View style={vis.counterLine} />}
        {variant === 'foodstand' && <View style={vis.standDoor} />}
      </View>
    );
  }
  return (
    <View style={[styles.cityStorefront, { backgroundColor: baseBg }]}>
      <View style={styles.cityStoreRoof} />
      <WindowGrid seed={place.id} cols={4} rows={2} winW={26} winH={30} gap={12} litPct={45} style={{ marginTop: 12 }} />
      <View style={styles.cityStoreDoor} />
    </View>
  );
}

const vis = StyleSheet.create({
  winGrid: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' },
  win: { borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.45)' },
  winLit: { backgroundColor: '#ffd94d' },
  winDark: { backgroundColor: 'rgba(16,24,36,0.85)' },
  balconyLine: { position: 'absolute', left: '7%', right: '7%', height: 3, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.40)' },
  loadingDoor: { position: 'absolute', bottom: 0, left: '27%', width: '46%', height: '46%', backgroundColor: '#232a33', borderWidth: 2, borderColor: '#4a5563', borderTopLeftRadius: 4, borderTopRightRadius: 4, justifyContent: 'space-evenly', paddingHorizontal: 5 },
  loadingSlat: { height: 2, backgroundColor: 'rgba(255,255,255,0.22)' },
  awning: { flexDirection: 'row', height: 22, borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' },
  displayWin: { alignSelf: 'center', borderRadius: 4, borderWidth: 2, borderColor: 'rgba(0,0,0,0.5)', backgroundColor: 'rgba(255,217,77,0.80)' },
  counterLine: { height: 8, marginHorizontal: 14, marginTop: 10, borderRadius: 3, backgroundColor: '#10151d' },
  standDoor: { position: 'absolute', right: 10, bottom: 0, width: 26, height: 56, backgroundColor: '#10151d', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  buildingShadow: { position: 'absolute', borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.32)' },
  houseShadow: { position: 'absolute', borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.30)' },
  signGlow: { position: 'absolute', left: '16%', right: '16%', bottom: 0, height: 38, borderRadius: 12, backgroundColor: 'rgba(244,197,66,0.18)' },
  lampWrap: { position: 'absolute', width: 54, height: 64 },
  lampGlowOuter: { position: 'absolute', top: 0, left: 0, width: 54, height: 54, borderRadius: 27, backgroundColor: 'rgba(244,197,66,0.10)' },
  lampGlowInner: { position: 'absolute', top: 12, left: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(244,197,66,0.16)' },
  lampHead: { position: 'absolute', top: 22, left: 22, width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffd94d', borderWidth: 1, borderColor: '#a87f14' },
  lampPole: { position: 'absolute', top: 30, left: 25, width: 3, height: 32, backgroundColor: '#4a5563' },
  coinLineRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 26 },
  coinLineText: { marginBottom: 0 },
  coinLineNum: { color: GOLD, fontWeight: '900' }, /* CITY_TRAVEL_GARAGE_V1_E07_COIN_NUM_STYLE: the My Home coin count's own gold bold span (G08). GOLD is the module const at the top of the file, long before this StyleSheet. */
  coinPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  progressCoinRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 },
  progressLineFlat: { marginBottom: 0 },
  busGroundShadow: { position: 'absolute', top: 31, left: 7, width: 46, height: 9, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.32)' },
});

/* POLISH_V1_STAT: Cash is the hero (bigger, green); Credit and XP are small; Savings is dim. */
const Stat = ({ label, value, accent, onPress, icon, coinIcon, hero, small, dim }) => ( /* VISUAL_V1_E14A_STAT_PROPS: coinIcon renders the drawn CoinIcon instead of an image. */
  <TouchableOpacity
    onPress={onPress}
    style={[styles.stat, { borderColor: accent }, hero && styles.statHero]}
  >
    {/* LOOKPASS_V1: stat icon. */}
    {coinIcon ? <CoinIcon size={20} style={{ marginBottom: 3 }} /> : icon ? <Image source={icon} style={styles.statIcon} resizeMode="contain" /> : null}{/* VISUAL_V1_E14B_STAT_COINICON */}
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
  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1, housing: 'none', jobId: 'none', inventory: [], /* CHAPTER3_BIZ_V1: new save fields. */ ownedBusinesses: [], /* BUSINESS_UPGRADES_V1_E04_INITIAL: new save field. */ businessUpgrades: [], hours: 8, bizWork: {}, businessUnlocked: false, /* CHAPTER3_INV_V1: new save fields. */ savingsPeak: 0, bondOwned: false, fundOwned: false, fundValue: 1000, fundCycle: 0, propertiesOwned: [], /* PROPERTY_LISTINGS_PROP1_E03_INITIAL: new save fields -- the per-property listing records start empty (null = not listed) and the per-property rebuy cooldowns start unset (-1 = no cooldown). The loader normalizes both (E04), the persist effect carries both (E06/E07), restartGame resets both (E08), and only the listing flow writes them (the handlers E11, the offer effect E13). */ propertyListings: { duplex: null, apartment: null, triplex: null }, propertyRebuyUntil: { duplex: -1, apartment: -1, triplex: -1 }, lastInvestPayday: -1, /* BANK_INTEREST_INT1_E03_INITIAL: new save field -- the Friday bank-interest latch starts unset (-1) like its sibling lastInvestPayday; the loader normalizes it (E04), the persist effect carries it (E06/E07), restartGame resets it (E08), and only the Friday interest routine (E09) sets it. */ lastInterestDay: -1, /* NEIGHBORHOOD_FUND_NFUND1_E01_INITIAL: new save field -- the Neighborhood Fund record starts empty: no balance, no growth clock running (startDay -1), no growth tick applied (lastGrowthDay -1). The loader normalizes it (E04), the persist effect carries it (E10/E11), restartGame resets it (E12), and only the fund flow writes it (the buys and sell, E07; the growth effect, E09). */ neighborhoodFund: { balance: 0, startDay: -1, lastGrowthDay: -1 }, investmentsUnlocked: false, /* HARLEY_V1_INITIAL: new save field. */ ownedBikes: [], /* TRANSIT_V1_SAVE: new save fields. */ transitEmployment: 'none', transitTraining: 'incomplete', transitBus: null, transitStop: 0, transitAboard: 0, transitBoarded: false, transitShiftActive: false, /* DAILY_LIMIT_V1: new save fields. */ earnedToday: 0, earnedTodayDay: 0, /* COINS_V1_E01_INITIAL: new save fields. */ goalCoinsPaid: [], shiftsThisWeek: 0, shiftsWeekKey: -1, lastShiftBonusWeek: -1, /* COIN_SHOP_V1_E02_INITIAL: new save fields. */ ownedOutfits: ['default'], wornOutfit: 'default', /* HOME_DECOR_V1_E02_INITIAL: new save fields. */ ownedDecorations: [], placedDecorations: [], /* MY_GARAGE_V1_E02_INITIAL: new save field. */ displayBike: null, /* BIKE_COLORS_V1_E02_INITIAL: new save fields. */ ownedBikeColors: ['factory'], appliedBikeColor: 'factory', /* MY_MONEY_V1_E02_INITIAL: new save field. */ lastFridayReport: null, /* MONEY_HISTORY_V1_E02_INITIAL: new save field. */ moneyHistory: [], /* SAVINGS_GOALS_V1_E02_INITIAL: new save field. */ savingsGoal: null, /* EXPLORE_CITY_V1_E02_INITIAL: new save fields. */ playerPos: null, ridingBike: null, /* CITY_JOBS_V1_E02_INITIAL: new save fields. */ activeMission: null, deliveryDay: -1, deliveryCount: 0, deliveryPayWaiting: 0, deliverySummary: null, /* DELIVERY_ROUTES_DELIVERY1_E13_INITIAL: new save fields -- completed-route pay waiting to collect starts at $0 and no route summary is stored; the loader normalizes both (E14), the persist effect carries both (E17/E18), and restartGame resets both (E30). */ deliveryLastCollect: null, /* COLLECTION_UX_DELIVERY2_E03_INITIAL: new save field -- the last delivery collect stamp ({amount, day}) starts null (nothing collected yet); the loader normalizes it (E04), the persist effect carries it (E10/E11), restartGame resets it (E12), and only a successful collect writes it (E06). */ /* MY_HOME_INTERIOR_V1_E02_INITIAL: new save field. */ homeLayout: null, /* FURNITURE_STORE_V1_E02_INITIAL: new save field. */ ownedFurniture: [], /* SKY_CITY_TRAVEL_V1_E02_INITIAL: new save field -- the Settings arrow-controls toggle; true = the city D-pad shows. */ showArrows: true, /* DEALERSHIP_OWNERSHIP_DEAL1_E02_INITIAL: new save fields -- dealership ownership starts unowned, with no profit waiting, no sales, no last sale, and the daily sale latch unset (-1). The loader normalizes each field, the persist effect carries each, and restartGame resets each. */ dealershipOwned: false, dealershipProfit: 0, dealershipSales: 0, dealershipLastSale: null, lastDealershipSaleDay: -1, /* BUSINESS_HEADQUARTERS_HQ1_E02_INITIAL: new save field -- the dealership customer-sale history starts empty; the loader normalizes it, the persist effect carries it, and restartGame resets it. */ dealershipHistory: [], /* DEALERSHIP_EXPANSION_DX1_E02_INITIAL: new save fields -- the showroom starts at level 1, lifetime profit starts null in the raw save (the loader migrates it to a real total: seeded from Money History for older saves; a fresh game reads the null as 0), and no sale notice is waiting. The loader normalizes each field, the persist effect carries each, and restartGame resets each. */ dealershipLevel: 1, dealershipLifetimeProfit: null, dealershipNotice: null, /* BUSINESS_MANAGEMENT_BM1_E02_INITIAL: new save field -- the per-business lifetime job earnings, one total per business, starting at zero and only ever growing by one increment per paid job (E08/E09). The loader normalizes the field, the persist effect carries it, and restartGame resets it. Past job earnings are never reconstructed: a save that predates the field starts at zero and counts forward. */ bizLifetimeEarnings: { cleaning: 0, hauling: 0, foodstand: 0 }, /* CITY_BUSINESS_JOBS_CBJ1_E02_INITIAL: new save field -- the Business Job History: one record per CITY business job completed through the CITY JOBS board (business, weekday, customer, amount), newest last, capped at 50. The loader normalizes it, the persist effect carries it, and restartGame resets it. Interior WORK A JOB completions never enter it -- it is the city jobs record. */ bizJobHistory: [], /* CLEANING_HAULING_EXPANSION_CHX1_E06_INITIAL: new save fields -- tier-2 upgrades start unowned (an id list mirroring businessUpgrades), cleaning/hauling job profit starts with nothing waiting to collect, and the all-time completed-jobs counter starts at zero for both pool businesses. The loader normalizes/seeds each field, the persist effect carries each, and restartGame resets each. */ businessUpgrades2: [], bizWaiting: { cleaning: 0, hauling: 0, foodstand: 0 }, bizJobsDone: { cleaning: 0, hauling: 0, foodstand: 0 }, /* MAES_PLACE_MAE1_E06_INITIAL: new save field -- the most recent Mae's Place customer round starts as no record (null). The loader normalizes it and stamps the latch for a restaurant already owned (E08); the persist effect carries it (E17/E18); restartGame resets it (E20); only the round flow writes it (the purchase stamp E16, the daily round E19). */ maeLastRound: null, /* FOOD_STAND_EXPANSION_FSX1_E11_INITIAL_POOL */ /* BUSINESS_EXPANSION_BIZX1_E03_INITIAL: the selected work vehicle (E02) starts unselected; the loader normalizes it against ownership, the persist effect carries it, and restartGame resets it. */ selectedWorkVehicle: null, /* FOOD_STAND_EXPANSION_FSX1_E12_INITIAL_MANAGE: which business the MANAGE_BIZ screen shows is part of the save since FSX1 -- a game closed on a management screen reopens on the same business's screen (E10/E13-E15). A fresh game is on no management screen. */ manageBizId: null
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
  { id: 'foodstand', name: 'Mae\'s Place', price: 2000, pay: 200, jobHours: 2, upgradeName: 'Second Grill', upgradeCost: 1500, upgradePay: 300 }, /* MAES_PLACE_MAE1_E03_TABLE_NAME: the business's display name is Mae's Place now (Zabby's word, 2026-11-08) -- the restaurant is a full Southern restaurant (E19/E21/E22). The internal id stays 'foodstand' here and everywhere: state keys, goal predicates, mission kinds and save fields are byte-identical, so every save, goal and mission reads exactly as before. Price, pay, hours and both upgrade rows are untouched. */
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

/* BUSINESS_MANAGEMENT_BM1_E03_NORMALIZE: the lifetime
 * job earnings per business -- one non-negative total
 * per shipped business id. A save that predates the
 * field (or stores it malformed) starts every business
 * at zero: past job earnings are NOT reconstructed,
 * the totals count forward from this build. A stored
 * total is kept as a whole-dollar amount (floored, and
 * only when positive and finite). */
function normalizeBizLifetimeEarnings(value) {
  const out = { cleaning: 0, hauling: 0, foodstand: 0 };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const biz of BUSINESSES) {
    const entry = value[biz.id];
    if (Number.isFinite(entry) && entry > 0) out[biz.id] = Math.floor(entry);
  }
  return out;
}

/* BUSINESS_MANAGEMENT_BM1_E03_INCREMENT: the one
 * accumulator update -- a NEW totals object with one
 * business's total raised by the pay of the job that
 * just paid. Both shipped business-job payment paths
 * call it in the same firing as their cash award (the
 * interior WORK A JOB handler, E08, and the CITY JOBS
 * mission completion, E09), so every paid job counts
 * exactly once and no other money movement can move
 * it. An unknown business id or a non-positive pay is
 * refused (the normalized totals come back unchanged). */
function addBizLifetimeEarning(totals, businessId, pay) {
  const base = normalizeBizLifetimeEarnings(totals);
  if (!BUSINESSES.some((biz) => biz.id === businessId)) return base;
  if (!Number.isFinite(pay) || pay <= 0) return base;
  return { ...base, [businessId]: base[businessId] + pay };
}

/* CITY_BUSINESS_JOBS_CBJ1_E03_HISTORY_HELPERS: the
 * Business Job History -- one record per CITY business
 * job, appended by the shipped mission completion in
 * the same firing as its payment (E18). An entry is
 * { bizId, bizName, day, customer, amount }: the
 * business id, its display name (rebuilt from the
 * BUSINESSES table on normalize, never trusted from
 * storage), the weekday NAME the job completed on,
 * the customer the job was for, and the pay actually
 * paid. Stored oldest-first, capped like the other
 * histories; the dashboard renders it newest-first. */
const BIZ_JOB_HISTORY_LIMIT = 50;

function normalizeBizJobHistoryEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
  const biz = BUSINESSES.find((b) => b.id === entry.bizId);
  if (!biz) return null;
  if (!DAY_NAMES.includes(entry.day)) return null;
  if (typeof entry.customer !== 'string' || entry.customer.trim() === '') return null;
  if (!Number.isFinite(entry.amount) || entry.amount <= 0) return null;
  return { bizId: biz.id, bizName: biz.name, day: entry.day, customer: entry.customer.trim().slice(0, 60), amount: Math.floor(entry.amount) };
}

function normalizeBizJobHistory(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const entry of value) {
    const valid = normalizeBizJobHistoryEntry(entry);
    if (valid) out.push(valid);
  }
  return out.slice(-BIZ_JOB_HISTORY_LIMIT);
}

/* Append one completed city job, dropping the oldest
 * beyond the cap. A malformed entry changes nothing. */
function appendBizJobHistory(history, entry) {
  const list = normalizeBizJobHistory(history);
  const valid = normalizeBizJobHistoryEntry(entry);
  if (!valid) return list;
  return [...list, valid].slice(-BIZ_JOB_HISTORY_LIMIT);
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

/* CLEANING_HAULING_EXPANSION_CHX1_E02_TIER2_TABLE: the tier-2
 * equipment upgrades (numbers approved by Zabby 2026-11-07).
 * Tier 2 sits on top of tier 1: it can only be bought once
 * the tier-1 upgrade is owned, and while owned it sets the
 * business's per-job pay. */
/* FOOD_STAND_EXPANSION_FSX1_E02_TIER2: the Food Stand gains
 * its tier 2 -- 'Catering Kitchen', $3,500 from savings,
 * requires tier 1 'Second Grill', pay $300 -> $400 (approved
 * by Zabby 2026-11-07). One row in this table is the whole
 * feature: bizTier2Upgrade, businessPay, the buy gate
 * (purchaseBusinessUpgrade2), normalizeBusinessUpgrades2 and
 * every upgrades surface already route through it. Chapter
 * 2/3 goal predicates keep reading the TIER-1 list only. */
const BIZ_TIER2_UPGRADES = {
  cleaning: { name: 'Commercial Contracts Kit', cost: 2500, pay: 240 },
  hauling: { name: 'Second Truck & Crew', cost: 3000, pay: 360 },
  foodstand: { name: 'Catering Kitchen', cost: 3500, pay: 400 },
};

function bizTier2Upgrade(businessId) {
  return BIZ_TIER2_UPGRADES[businessId] || null;
}

/* FOOD_STAND_EXPANSION_FSX1_E03_POOL: the businesses
 * whose job pay waits to be collected. Since FSX1 that is
 * all three -- the Food Stand joins Cleaning and Hauling in
 * the waiting pool, so its job pay waits in the business
 * until collected instead of landing as instant cash. Every
 * pool behavior keys off this one function: the interior
 * pay branch, the city completion branch, the collect gate,
 * the MY BUSINESSES panel treatment and the MANAGE_BIZ
 * screen guard. */
function bizHasWaitingPool(businessId) {
  return businessId === 'cleaning' || businessId === 'hauling' || businessId === 'foodstand';
}

/* BUSINESS_UPGRADES_V1_E03_HELPERS: the one effective-pay rule for
 * a business -- the upgraded rate when its upgrade is owned, the
 * base rate otherwise. The job award, the daily-limit check and the
 * WORK screen all read pay through here so they can never disagree. */
/* CLEANING_HAULING_EXPANSION_CHX1_E03_PAY: businessPay is now
 * tier-aware -- a tier-2 upgrade (E02) sets the pay when owned,
 * else the shipped tier-1 rule decides, so every reader of pay
 * (the job awards, the daily-limit checks, the board, the
 * interiors, the dashboard) agrees at every tier. A caller
 * that passes no tier-2 list gets exactly the shipped
 * behavior. */
function businessPay(biz, upgrades, upgrades2) {
  if (upgrades2 && upgrades2.includes(biz.id)) {
    const tier2 = bizTier2Upgrade(biz.id);
    if (tier2) return tier2.pay;
  }
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

/* CLEANING_HAULING_EXPANSION_CHX1_E04_HELPERS: the tier-2
 * ownership list mirrors businessUpgrades exactly (a list of
 * business ids), except it can only ever hold a business that
 * HAS a tier 2 -- before FSX1 a stored foodstand id was
 * dropped, never honored; since FSX1 (E02) the Food Stand
 * HAS a tier 2, so its stored id is kept like the others.
 * FOOD_STAND_EXPANSION_FSX1_E09_UPG2_COMMENT */
function normalizeBusinessUpgrades2(value) {
  return Array.isArray(value)
    ? BUSINESSES.filter((biz) => bizTier2Upgrade(biz.id) && value.includes(biz.id)).map((biz) => biz.id)
    : [];
}

/* The tier-2 buy gate, mirroring purchaseBusinessUpgrade: the
 * business must be owned, its tier-1 upgrade must be owned
 * first, the tier 2 must not be owned yet, and the savings
 * must cover the cost. All money comes from savings. */
function purchaseBusinessUpgrade2(savings, owned, upgrades, upgrades2, businessId) {
  const biz = BUSINESSES.find((entry) => entry.id === businessId);
  const tier2 = bizTier2Upgrade(businessId);
  if (!biz || !tier2) return { ok: false, message: 'This upgrade is unavailable.' };
  if (!owned.includes(biz.id))
    return { ok: false, message: 'You need to own ' + biz.name + ' before upgrading it.' };
  if (!upgrades.includes(biz.id))
    return { ok: false, message: 'Buy the ' + biz.upgradeName + ' first — tier 2 builds on it.' };
  if (upgrades2.includes(biz.id))
    return { ok: false, message: biz.name + ' already has the ' + tier2.name + ' upgrade.' };
  if (!Number.isFinite(savings) || savings < tier2.cost)
    return { ok: false, message: 'Not enough saved. ' + tier2.name + ' costs $' + tier2.cost + ' in savings.' };
  return {
    ok: true,
    savings: savings - tier2.cost,
    upgrades2: [...upgrades2, biz.id],
    message: 'You bought the ' + tier2.name + ' upgrade for ' + biz.name + ' for $' + tier2.cost + ' from savings. Every job now pays $' + tier2.pay + '.',
  };
}

/* FOOD_STAND_EXPANSION_FSX1_E04_NORM_WAIT: the
 * waiting-profit pool: one non-negative whole-dollar total
 * per pool business -- all three since FSX1 (E03). A save
 * stored before FSX1 simply reads its missing foodstand
 * key as 0. */
function normalizeBizWaiting(value) {
  const out = { cleaning: 0, hauling: 0, foodstand: 0 };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const bizId of ['cleaning', 'hauling', 'foodstand']) { /* FOOD_STAND_EXPANSION_FSX1_E05_NORM_WAIT_KEYS */
    const entry = value[bizId];
    if (Number.isFinite(entry) && entry > 0) out[bizId] = Math.floor(entry);
  }
  return out;
}

function addBizWaiting(waiting, businessId, pay) {
  const base = normalizeBizWaiting(waiting);
  if (!bizHasWaitingPool(businessId)) return base;
  if (!Number.isFinite(pay) || pay <= 0) return base;
  return { ...base, [businessId]: base[businessId] + pay };
}

/* The all-time completed-jobs counter, one count per pool
 * business. A save that already carries the counter keeps
 * its stored counts. A save where the field is first
 * created seeds each business from its Business Job
 * History rows (the best record the save holds: city jobs
 * only -- interior jobs worked before this build were
 * never recorded anywhere, so the count starts from the
 * history and counts every completion from now on). */
function normalizeBizJobsDone(value, history) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const out = { cleaning: 0, hauling: 0, foodstand: 0 };
    for (const bizId of ['cleaning', 'hauling', 'foodstand']) {
      const entry = value[bizId];
      if (Number.isFinite(entry) && entry > 0) out[bizId] = Math.floor(entry);
    }
    /* FOOD_STAND_EXPANSION_FSX1_E06_NORM_DONE: a save stored
     * before FSX1 carries no foodstand key at all -- seed it
     * from the Business Job History's Food Stand rows, the
     * same seeding the missing-whole-field branch below
     * applies, so a player who already ran food jobs keeps
     * the count. A stored foodstand value (even 0) is kept
     * exactly as read; the cleaning/hauling reads above are
     * the shipped ones, unchanged. */
    if (!Object.prototype.hasOwnProperty.call(value, 'foodstand')) {
      for (const entry of normalizeBizJobHistory(history)) {
        if (entry.bizId === 'foodstand') out.foodstand += 1;
      }
    }
    return out;
  }
  const seeded = { cleaning: 0, hauling: 0, foodstand: 0 };
  for (const entry of normalizeBizJobHistory(history)) {
    if (bizHasWaitingPool(entry.bizId)) seeded[entry.bizId] += 1;
  }
  return seeded;
}

function addBizJobDone(counts, businessId) {
  const base = normalizeBizJobsDone(counts, null);
  if (!bizHasWaitingPool(businessId)) return base;
  return { ...base, [businessId]: base[businessId] + 1 };
}

/* BUSINESS_EXPANSION_BIZX1_E02_HELPERS: work vehicles and
 * the business level. A work vehicle is FREE and unlocked
 * by owning its business (Zabby's decision, 2026-11-07):
 * the Cleaning Van rides with the Cleaning Service, the
 * Hauling Truck with the Hauling Service. selectedWorkVehicle
 * stores ONE vehicle id (or null): the fleet is a single
 * choice, like the ridden bike. */
/* FOOD_STAND_EXPANSION_FSX1_E07_VEHICLES: the Food Stand
 * gains its vehicle -- the Food Delivery Van, free on Food
 * Stand ownership like the others. workVehicleById /
 * workVehicleForBusiness / workVehicleUnlocked /
 * normalizeSelectedWorkVehicle below are generic over this
 * table, so the loader normalization, the MANAGE-screen
 * section, the marker badge and the ride-speed derivation
 * cover the van with no further code. */
const WORK_VEHICLES = {
  cleaning_van: { id: 'cleaning_van', businessId: 'cleaning', name: 'Cleaning Van', glyph: '🚐' },
  hauling_truck: { id: 'hauling_truck', businessId: 'hauling', name: 'Hauling Truck', glyph: '🚚' },
  food_delivery_van: { id: 'food_delivery_van', businessId: 'foodstand', name: 'Food Delivery Van', glyph: '🚙' },
};

/* One work vehicle by id, or null. */
function workVehicleById(vehicleId) {
  if (typeof vehicleId !== 'string') return null;
  return WORK_VEHICLES[vehicleId] || null;
}

/* FOOD_STAND_EXPANSION_FSX1_E08_VEHICLE_FN_COMMENT: the
 * work vehicle a business unlocks, or null (every business
 * has one since FSX1 -- E07). */
function workVehicleForBusiness(businessId) {
  for (const vehicleId of Object.keys(WORK_VEHICLES)) {
    if (WORK_VEHICLES[vehicleId].businessId === businessId) return WORK_VEHICLES[vehicleId];
  }
  return null;
}

/* A vehicle is unlocked exactly when its business is owned. */
function workVehicleUnlocked(vehicleId, ownedBusinesses) {
  const vehicle = workVehicleById(vehicleId);
  if (!vehicle) return false;
  return Array.isArray(ownedBusinesses) && ownedBusinesses.includes(vehicle.businessId);
}

/* The stored selection survives only while it names a real
 * vehicle whose business is still owned; anything else
 * (older saves, a business no longer owned, bad values) is
 * no vehicle. */
function normalizeSelectedWorkVehicle(value, ownedBusinesses) {
  return workVehicleUnlocked(value, ownedBusinesses) ? value : null;
}

/* FOOD_STAND_EXPANSION_FSX1_E10_MANAGE_HELPER: the
 * management screen's (place, business) pair, normalized
 * together on load -- the fix for the return bug in the
 * header. place is persisted but the selected business was
 * transient before FSX1, so a game closed on MANAGE_BIZ
 * reopened with the screen restored and no business behind
 * it, and the screen's guard rendered its no-business note.
 * The pair now survives together: the selection is kept
 * exactly when it names a business the player still owns
 * (whatever screen is open); a MANAGE_BIZ place whose
 * business is missing, stale or unowned falls back to the
 * MY BUSINESSES dashboard with no selection, so a restored
 * save can never land on the note. Any other place passes
 * through untouched. */
function normalizeManageBiz(place, manageBizId, ownedBusinesses) {
  const owned = normalizeOwnedBusinesses(ownedBusinesses);
  const biz = typeof manageBizId === 'string' ? BUSINESSES.find((b) => b.id === manageBizId) : null;
  if (biz && owned.includes(biz.id)) {
    return { place: place, manageBizId: biz.id };
  }
  return { place: place === 'MANAGE_BIZ' ? 'MY_BUSINESSES' : place, manageBizId: null };
}

/* BUSINESS_EXPANSION_BIZX1_E02_LEVEL: a business's level is
 * display only -- 1 at purchase, +1 for its tier-1 upgrade,
 * +1 for its tier-2. Nothing reads the level but the two
 * screens that show it; the goal predicates keep reading
 * the tier-1 list exactly as shipped. */
function businessLevel(businessId, upgrades, upgrades2) {
  let level = 1;
  if (Array.isArray(upgrades) && upgrades.includes(businessId)) level += 1;
  if (Array.isArray(upgrades2) && upgrades2.includes(businessId)) level += 1;
  return level;
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
 * Growth Fund. (PROPERTY_LISTINGS_PROP1_E16C_HISTORY_NOTE: since
 * PROP1 a property sale by listing IS logged -- the accept
 * handler writes one 'property_sale' entry, E02/E11; the v1
 * list above describes the instant sell it replaced.) */
const MONEY_HISTORY_LIMIT = 100;
const MONEY_HISTORY_SHOWN = 25;
const MONEY_HISTORY_KINDS = ['paycheck', 'rent', 'bond', 'deposit', 'withdrawal', 'purchase', 'job', 'dealership', 'interest', 'property_sale']; /* PROPERTY_LISTINGS_PROP1_E02_KINDS: 'property_sale' = a property sold by listing (the E11 accept handler), recorded only there through the shipped addHistoryEntry; it renders as money in ('+$X', Savings) like rent and bond income. Without the kind registered here, normalizeHistoryEntry would drop the entry on the next load. */ /* BANK_INTEREST_INT1_E02_KINDS: 'interest' = Friday bank interest paid into savings (E09), recorded only by the Friday interest routine through the shipped addHistoryEntry; it renders as money in ('+$X', Savings) like rent and bond income. Without the kind registered here, normalizeHistoryEntry would drop the entry on the next load. */ /* DEALERSHIP_OWNERSHIP_DEAL1_E04_KIND: 'dealership' = collected dealership profit, recorded only by the COLLECT EARNINGS handler through the shipped addHistoryEntry; it renders as money in ('+$X', Cash) like rent and bond income. */ /* CITY_JOBS_V1_E01_KINDS: 'job' = mission payouts (business missions + motorcycle deliveries), recorded only by the new CITY_JOBS completion handlers through the shipped addHistoryEntry. */
const MONEY_HISTORY_BALANCES = ['cash', 'savings', 'transfer', 'waiting']; /* CLEANING_HAULING_EXPANSION_CHX1_E05_WAITING_BALANCE: 'waiting' = job money earned but not yet collected (the E13/E15 completions); historyEntryLines renders it as 'Waiting to collect', so a waiting entry can never be mistaken for cash in hand. Older saves hold no such entries and are unaffected. */

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
      : entry.balance === 'waiting'
        ? 'Waiting to collect' /* CLEANING_HAULING_EXPANSION_CHX1_E05B_BALANCE_TEXT */
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

/* DEALERSHIP_OWNERSHIP_DEAL1_E05_HELPERS: owning the
 * Harley Dealership itself (Zabby's approved numbers,
 * 2026-11-06). The price is a single constant; the buy
 * gate mirrors purchaseBusiness -- savings only, buy
 * once, absolute savings out, so confirming twice in
 * one batch charges exactly once and an owned
 * dealership can never be bought again. */
const DEALERSHIP_PRICE = 7500;

function purchaseDealership(savings, owned) {
  if (owned)
    return { ok: false, message: 'You already own the Harley Dealership.' };
  if (!Number.isFinite(savings) || savings < DEALERSHIP_PRICE)
    return { ok: false, message: 'Not enough saved. The dealership costs $' + DEALERSHIP_PRICE + ' in savings.' };
  return {
    ok: true,
    savings: savings - DEALERSHIP_PRICE,
    message: 'You bought the Harley Dealership for $' + DEALERSHIP_PRICE + ' from savings. Customers will start buying bikes tomorrow.',
  };
}

/* Customer demand: one NPC sale per in-game day while
 * the dealership is owned. Cheaper models sell more
 * often -- weight = round(30000 / price), so the Iron
 * 883 (weight 20) outsells the CVO Street Glide
 * (weight 2) ten to one. The draw reads the shipped
 * BIKES table, and profit is the showroom margin
 * (20%, or 25% at showroom level 2 --
 * DEALERSHIP_EXPANSION_DX1_E05C_COMMENT) of the SOLD
 * bike's own list price, computed from the table at
 * sale time -- no amount is hardcoded per model. */
function dealershipSaleWeight(bike) {
  return Math.max(1, Math.round(30000 / bike.price));
}

function dealershipProfitFor(bike, level) {
  /* DEALERSHIP_EXPANSION_DX1_E05A_PROFIT: the margin is
   * the showroom's -- 20% at level 1, 25% once the
   * showroom is upgraded (level 2). A missing level
   * reads as level 1, so every pre-DX1 caller keeps
   * the 20% it shipped with. Prices are multiples of
   * 500, so both margins land on whole dollars. */
  return Math.round(bike.price * (level >= 2 ? 0.25 : 0.2));
}

function pickDealershipSale(rng, level) {
  /* DEALERSHIP_EXPANSION_DX1_E05B_PICK: the draw is the
   * shipped one; the level only sets the margin the
   * profit is computed at (see dealershipProfitFor). */
  const roll = typeof rng === 'function' ? rng : Math.random;
  const total = BIKES.reduce((sum, bike) => sum + dealershipSaleWeight(bike), 0);
  let ticket = roll() * total;
  for (const bike of BIKES) {
    ticket -= dealershipSaleWeight(bike);
    if (ticket < 0) return { bike: bike, profit: dealershipProfitFor(bike, level) };
  }
  const last = BIKES[BIKES.length - 1];
  return { bike: last, profit: dealershipProfitFor(last, level) };
}

/* MAES_PLACE_MAE1_E02_ROUND_HELPERS: Mae's Place (the
 * foodstand business -- its display name is E03) serves
 * NPC customers the way the dealership does: one round
 * per day, drawn here as a pure function of the caller's
 * random source so the sim drives it with a seeded
 * queue, exactly like pickDealershipSale above. Zabby's
 * locked numbers (2026-11-08): 5 to 9 customers a day;
 * each customer orders Southern fried chicken ($18
 * profit) or barbecue ribs ($26 profit), half and half.
 * The round total is the restaurant's earnings: the
 * daily effect (E19) lands it in the waiting pool and
 * the lifetime earnings through the shipped addBizWaiting
 * / addBizLifetimeEarning accumulators, never through
 * recordEarning, so a customer round never eats the
 * player's $1,500 daily earnings limit (the dealership
 * precedent: NPC income is cap-exempt). */
const MAE_CHICKEN_PROFIT = 18;
const MAE_RIBS_PROFIT = 26;

function drawMaeCustomerRound(random) {
  const roll = typeof random === 'function' ? random : Math.random;
  const customers = 5 + Math.floor(roll() * 5);
  let chicken = 0;
  let ribs = 0;
  for (let i = 0; i < customers; i += 1) {
    if (roll() < 0.5) chicken += 1;
    else ribs += 1;
  }
  return { chicken: chicken, ribs: ribs, total: chicken * MAE_CHICKEN_PROFIT + ribs * MAE_RIBS_PROFIT };
}

/* The last-sale record kept for the ownership screen:
 * { name, profit, day } or null before the first sale.
 * Anything malformed normalizes to null -- the screen
 * simply shows no last sale yet. */
function normalizeDealershipLastSale(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null;
  if (typeof value.name !== 'string' || value.name.trim() === '')
    return null;
  if (!Number.isFinite(value.profit) || value.profit <= 0)
    return null;
  if (!Number.isInteger(value.day) || value.day < 0)
    return null;
  return { name: value.name, profit: value.profit, day: value.day };
}

/* BUSINESS_HEADQUARTERS_HQ1_E04_HELPERS: the dealership's
 * customer-sale history -- one { day, name, profit } entry
 * per daily sale, stored newest-LAST and capped at the
 * most recent DEALERSHIP_HISTORY_LIMIT entries. A stored
 * history survives a reopen only if it is an array; each
 * entry must be well-formed (a non-negative integer day, a
 * non-empty model name, a positive profit) or it drops.
 * Anything else is not a history: []. */
const DEALERSHIP_HISTORY_LIMIT = 50;

function normalizeDealershipHistoryEntry(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null;
  if (!Number.isInteger(value.day) || value.day < 0)
    return null;
  if (typeof value.name !== 'string' || value.name.trim() === '')
    return null;
  if (!Number.isFinite(value.profit) || value.profit <= 0)
    return null;
  return { day: value.day, name: value.name, profit: value.profit };
}

function normalizeDealershipHistory(value) {
  if (!Array.isArray(value)) return [];
  const out = [];
  for (const entry of value) {
    const valid = normalizeDealershipHistoryEntry(entry);
    if (valid) out.push(valid);
  }
  return out.slice(-DEALERSHIP_HISTORY_LIMIT);
}

/* Append one sale, dropping the oldest beyond the cap.
 * A malformed entry changes nothing. */
function appendDealershipHistory(history, entry) {
  const list = normalizeDealershipHistory(history);
  const valid = normalizeDealershipHistoryEntry(entry);
  if (!valid) return list;
  return [...list, valid].slice(-DEALERSHIP_HISTORY_LIMIT);
}

/* DEALERSHIP_EXPANSION_DX1_E05D_GATE_SEED: the showroom
 * upgrade (Zabby's approved numbers, 2026-11-07). One
 * price constant; the gate mirrors purchaseDealership
 * -- savings only, absolute savings out, so confirming
 * twice in one batch charges exactly once, and a
 * level-2 showroom can never be bought again. The
 * gate takes the caller's state as one object so the
 * handler passes exactly what it read this render. */
const DEALERSHIP_SHOWROOM_COST = 5000;

function upgradeDealershipShowroom(state) {
  const savings = state ? state.savings : NaN;
  const owned = state ? state.owned : false;
  const level = state ? state.level : 1;
  if (!owned)
    return { ok: false, message: 'You do not own the Harley Dealership yet.' };
  if (level >= 2)
    return { ok: false, message: 'Your showroom is already Level 2.' };
  if (!Number.isFinite(savings) || savings < DEALERSHIP_SHOWROOM_COST)
    return { ok: false, message: 'Not enough saved. The showroom upgrade costs $' + DEALERSHIP_SHOWROOM_COST + ' in savings.' };
  return {
    ok: true,
    savings: savings - DEALERSHIP_SHOWROOM_COST,
    level: 2,
    message: 'Showroom upgraded to Level 2 for $' + DEALERSHIP_SHOWROOM_COST + ' from savings. Two customers a day now, and every sale earns the 25% margin.',
  };
}

/* The one-time lifetime-profit seed (see the loader):
 * the total of every dealership collection the save's
 * Money History still records, under any of the three
 * labels collections have shipped with, plus the
 * profit still waiting uncollected (waiting profit is
 * never in the history until it is collected, so the
 * two parts can never double-count). */
const DEALERSHIP_LIFETIME_LABELS = ['Dealership profit', 'Dealership profit → Cash', 'Dealership profit → Savings'];

function seedDealershipLifetimeProfit(moneyHistory, waitingProfit) {
  const entries = Array.isArray(moneyHistory) ? moneyHistory : [];
  let total = Number.isFinite(waitingProfit) && waitingProfit > 0 ? waitingProfit : 0;
  for (const entry of entries) {
    if (entry && DEALERSHIP_LIFETIME_LABELS.includes(entry.label) && Number.isFinite(entry.amount) && entry.amount > 0)
      total += entry.amount;
  }
  return total;
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

/* PLAYABLE_TRANSIT_V1_E01_DRIVE_MACHINE: the DRIVEABLE bus route.
 * Pure module-level machine, driven by the shipped 33 ms map
 * tick. The drive object is TRANSIENT (component state only,
 * never written to the save): { active, paused, exitConfirm,
 * headingDeg, speed, phase, stopIndex, passengers, doorsOpen,
 * boardingTicksLeft, boardAt, completedLatch, summaryPaid,
 * summaryBonus }. Phases: 'toStop' (driving to stop stopIndex),
 * 'boarding' (doors open, timer running), 'toDepot' (all stops
 * served, drive home), 'done' (passengers off, completion
 * applied by the component). NAME NOTE: BUS_STOPS already names
 * the ambient living-city bus's door list, so the playable
 * stops are BUS_ROUTE_STOPS. Stop points sit ON the horizontal
 * streets (avenue centers y = 530) in front of their districts:
 * Residential by the HOME block, Downtown below the Bank,
 * Casino District below the Casino. The depot is the TRANSIT
 * place's shipped entrance. Boarding counts are a fixed table
 * (deterministic -- no Math.random): 3 + 2 + 4 = 9 riders. */
const BUS_DRIVE_MAX_SPEED = 7;
const BUS_DRIVE_ACCEL = 0.35;
const BUS_DRIVE_BRAKE = 0.9;
const BUS_DRIVE_DRAG = 0.12;
const BUS_DRIVE_TURN_DEG = 4;
const BUS_STOP_RADIUS = 95;
const BUS_BOARD_TICKS = 54; /* ~1.8 s at the shipped 33 ms tick */
const BUS_BOARDING = [3, 2, 4];
const BUS_ROUTE_STOPS = [
  { id: 'residential', name: 'RESIDENTIAL', x: 860, y: 530 },
  { id: 'downtown', name: 'DOWNTOWN', x: 1800, y: 530 },
  { id: 'casino', name: 'CASINO DISTRICT', x: 2050, y: 530 },
];
function busDepotPoint() {
  const t = cityPlaceById('transit');
  return { x: t.entrance.x, y: t.entrance.y };
}
function busNewDrive() {
  return {
    active: true,
    paused: false,
    exitConfirm: false,
    headingDeg: 180, /* facing west, into the city */
    speed: 0,
    phase: 'toStop',
    stopIndex: 0,
    passengers: 0,
    doorsOpen: false,
    boardingTicksLeft: 0,
    boardAt: null,
    completedLatch: false,
    summaryPaid: false,
    summaryBonus: 0,
  };
}
function busTargetInfo(drive) {
  if (!drive || drive.phase === 'toDepot' || drive.phase === 'done' || (drive.phase === 'boarding' && drive.boardAt === 'depot')) {
    const d = busDepotPoint();
    return { x: d.x, y: d.y, label: 'TRANSIT DEPOT', isDepot: true };
  }
  const s = BUS_ROUTE_STOPS[Math.min(drive.stopIndex, BUS_ROUTE_STOPS.length - 1)];
  return { x: s.x, y: s.y, label: s.name, isDepot: false };
}
function busDoorsReady(drive, pos) {
  if (!drive || !drive.active) return false;
  if (drive.phase !== 'toStop' && drive.phase !== 'toDepot') return false;
  if (drive.speed > 0.001) return false;
  const t = busTargetInfo(drive);
  return Math.hypot(pos.x - t.x, pos.y - t.y) <= BUS_STOP_RADIUS;
}
function busOpenDoors(drive, pos) {
  if (!busDoorsReady(drive, pos)) return drive;
  return { ...drive, doorsOpen: true, phase: 'boarding', boardAt: drive.phase === 'toDepot' ? 'depot' : 'stop', boardingTicksLeft: BUS_BOARD_TICKS, speed: 0 };
}
/* One 33 ms step. Returns { drive, pos }: the SAME drive
 * reference when nothing changed (no re-render churn at a
 * standstill). Boarding ignores the pedals; steering works at
 * any speed including stopped; collision is the shipped
 * resolveCityMove over CITY_RECTS (axis-separated sliding) --
 * a move cancelled on both axes cuts the speed to 0, so the
 * bus can never wedge inside a building. */
function busStepDrive(drive, input, pos) {
  if (!drive || !drive.active || drive.phase === 'done') return { drive: drive, pos: pos };
  if (drive.phase === 'boarding') {
    const left = drive.boardingTicksLeft - 1;
    if (left > 0) return { drive: { ...drive, boardingTicksLeft: left }, pos: pos };
    if (drive.boardAt === 'depot') {
      return { drive: { ...drive, passengers: 0, doorsOpen: false, boardingTicksLeft: 0, boardAt: null, phase: 'done', speed: 0 }, pos: pos };
    }
    const boarded = drive.passengers + (BUS_BOARDING[drive.stopIndex] || 0);
    if (drive.stopIndex >= BUS_ROUTE_STOPS.length - 1) {
      return { drive: { ...drive, passengers: boarded, doorsOpen: false, boardingTicksLeft: 0, boardAt: null, phase: 'toDepot', speed: 0 }, pos: pos };
    }
    return { drive: { ...drive, passengers: boarded, doorsOpen: false, boardingTicksLeft: 0, boardAt: null, phase: 'toStop', stopIndex: drive.stopIndex + 1, speed: 0 }, pos: pos };
  }
  let heading = drive.headingDeg;
  if (input && input.left) heading -= BUS_DRIVE_TURN_DEG;
  if (input && input.right) heading += BUS_DRIVE_TURN_DEG;
  heading = ((heading % 360) + 360) % 360;
  let speed = drive.speed;
  if (input && input.gas) speed = Math.min(BUS_DRIVE_MAX_SPEED, speed + BUS_DRIVE_ACCEL);
  else if (input && input.brake) speed = Math.max(0, speed - BUS_DRIVE_BRAKE);
  else speed = Math.max(0, speed - BUS_DRIVE_DRAG);
  let next = pos;
  if (speed > 0) {
    const rad = (heading * Math.PI) / 180;
    next = resolveCityMove(pos, Math.cos(rad) * speed, Math.sin(rad) * speed, CITY_RECTS);
    if (next.x === pos.x && next.y === pos.y) speed = 0; /* solid hit: full stop, steering still free */
  }
  if (heading === drive.headingDeg && speed === drive.speed && next === pos) return { drive: drive, pos: pos };
  return { drive: { ...drive, headingDeg: heading, speed: speed }, pos: next };
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
/* NEIGHBORHOOD_FUND_NFUND1_E02_CONSTANTS: the Neighborhood
 * Fund (E07-E09): the three amounts a player can put in,
 * the growth rate, and the growth period in game days.
 * Buys come out of savings and the sell-back pays cash,
 * exactly like the Growth Fund beside them; the growth
 * clock runs from the first buy (E09). */
const NFUND_AMOUNTS = [100, 250, 500];
const NFUND_GROWTH_RATE = 0.05;
const NFUND_GROWTH_DAYS = 5;
const PROPERTIES = [
  { id: 'duplex', name: 'Duplex', price: 5000, credit: 650, rent: 200 },
  { id: 'triplex', name: 'Triplex', price: 7500, credit: 675, rent: 300 }, /* TRIPLEX_TRIPLEX1_E02_TABLE: the third rental property, between the Duplex and the Apartment Building in price, credit and rent. Every property system reads this one table -- the buy and listing handlers, the Friday rent routine, the offer effect, both listing normalizers, net worth and the REAL ESTATE cards -- so the Triplex rides them all. It has NO map building and NO CITY_PLACES entry in this build, and the Life Goals count stays pinned to the Duplex + Apartment Building (E03). */
  { id: 'apartment', name: 'Apartment Building', price: 10000, credit: 700, rent: 450 },
];

function normalizeProperties(value) {
  return Array.isArray(value)
    ? PROPERTIES.filter((prop) => value.includes(prop.id)).map((prop) => prop.id)
    : [];
}

/* PROPERTY_LISTINGS_PROP1_E09_NORMALIZERS: the persisted
 * listing records and rebuy cooldowns (E03). A listing is
 * { ask, listDay, offerDueDay, offer }: the asking price,
 * the day it was listed, the day its next offer falls due,
 * and the stored offer (null while waiting). The offer is
 * STORED, never re-rolled, so it must survive a reopen
 * exactly as written. A stored listing survives a load
 * only if every field is well-formed and the offer is null
 * or a whole-dollar amount no greater than the ask (the
 * offer rule, E13, pays 85% to 100% of the ask); anything
 * malformed reads as not listed. Cooldowns are plain day
 * numbers: an integer survives as stored, anything else
 * reads -1 (no cooldown).
 * (TRIPLEX_TRIPLEX1_E04_NORMALIZERS: both records gain a
 * triplex key in their empty shapes; the loops below
 * already read every id in PROPERTIES, so a stored
 * Triplex listing or cooldown survives a load exactly
 * like the other two, and a pre-TRIPLEX1 save -- no
 * triplex key anywhere -- reads as not listed and not
 * cooling down, everything else intact.) */
function normalizePropertyListings(value) {
  const out = { duplex: null, apartment: null, triplex: null };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const prop of PROPERTIES) {
    const entry = value[prop.id];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
    if (!Number.isInteger(entry.ask) || entry.ask <= 0) continue;
    if (!Number.isInteger(entry.listDay) || entry.listDay < 0) continue;
    if (!Number.isInteger(entry.offerDueDay) || entry.offerDueDay < 0) continue;
    if (!(entry.offer === null || (Number.isInteger(entry.offer) && entry.offer > 0 && entry.offer <= entry.ask))) continue;
    out[prop.id] = { ask: entry.ask, listDay: entry.listDay, offerDueDay: entry.offerDueDay, offer: entry.offer };
  }
  return out;
}

function normalizePropertyRebuyUntil(value) {
  const out = { duplex: -1, apartment: -1, triplex: -1 };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const prop of PROPERTIES) {
    if (Number.isInteger(value[prop.id])) out[prop.id] = value[prop.id];
  }
  return out;
}

/* MAES_PLACE_MAE1_E07_NORMALIZER: the persisted Mae's
 * Place customer record (E06): null, or the most recent
 * round { day, chicken, ribs, total } -- the day the
 * round fired (it is also the round's latch: a day is
 * processed exactly once, E19), how many customers
 * ordered chicken, how many ordered ribs, and the
 * profit the round added to the pool. A zero record
 * { day, 0, 0, 0 } is the latch stamp written when the
 * restaurant changes hands (E16) or migrated in for a
 * restaurant already owned when this build arrived
 * (E08): it is not a round and pays nothing. A stored
 * record survives a load only if every field is a
 * non-negative integer and the total is exactly the
 * two dishes at their profits; anything malformed
 * reads as no record (null), whole. */
function normalizeMaeLastRound(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!Number.isInteger(value.day) || value.day < 0) return null;
  if (!Number.isInteger(value.chicken) || value.chicken < 0) return null;
  if (!Number.isInteger(value.ribs) || value.ribs < 0) return null;
  if (!Number.isInteger(value.total) || value.total < 0) return null;
  if (value.total !== value.chicken * MAE_CHICKEN_PROFIT + value.ribs * MAE_RIBS_PROFIT) return null;
  return { day: value.day, chicken: value.chicken, ribs: value.ribs, total: value.total };
}

/* NEIGHBORHOOD_FUND_NFUND1_E03_NORMALIZER: the persisted
 * Neighborhood Fund record (E01): { balance, startDay,
 * lastGrowthDay } -- how much is in the fund, the day of
 * the FIRST buy (the growth anchor: later buys never
 * move it), and the most recent growth day applied (the
 * tick latch). The empty record is { 0, -1, -1 }. A
 * stored record survives a load only if every field is
 * well-formed: the balance a non-negative integer; a
 * zero balance carries no clock (it reads back as the
 * empty record whatever days were stored); a positive
 * balance needs a real anchor day, and the latch is
 * either unset (-1) or exactly on a tick day
 * (startDay + 5k). Anything malformed reads as the
 * empty record, whole -- a corrupt fund is gone, never
 * half-kept. */
function normalizeNeighborhoodFund(value) {
  const empty = { balance: 0, startDay: -1, lastGrowthDay: -1 };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return empty;
  if (!Number.isInteger(value.balance) || value.balance < 0) return empty;
  if (value.balance === 0) return empty;
  if (!Number.isInteger(value.startDay) || value.startDay < 0) return empty;
  if (!Number.isInteger(value.lastGrowthDay)) return empty;
  if (value.lastGrowthDay !== -1 && (value.lastGrowthDay <= value.startDay || (value.lastGrowthDay - value.startDay) % NFUND_GROWTH_DAYS !== 0)) return empty;
  return { balance: value.balance, startDay: value.startDay, lastGrowthDay: value.lastGrowthDay };
}

/* NEIGHBORHOOD_FUND_NFUND1_E03_GROWTH: one growth pass
 * over a fund record at a given day -- the pure half of
 * the growth effect (E09), in the drawMaeCustomerRound
 * (MAE1 E02) shape. Ticks fall at startDay + 5, +10,
 * ... and each tick adds Math.round(balance * 0.05), so
 * growth compounds tick over tick. Every tick due is
 * applied in order in the one pass, so a save reopened
 * after days away catches up whole. Returns the grown
 * record, or null when no tick is due (the effect then
 * writes nothing). */
function applyNeighborhoodFundGrowth(fund, day) {
  if (!fund || fund.balance <= 0 || fund.startDay < 0) return null;
  let balance = fund.balance;
  let lastGrowthDay = fund.lastGrowthDay;
  let tickDay = (lastGrowthDay >= fund.startDay ? lastGrowthDay : fund.startDay) + NFUND_GROWTH_DAYS;
  while (tickDay <= day) {
    balance += Math.round(balance * NFUND_GROWTH_RATE);
    lastGrowthDay = tickDay;
    tickDay += NFUND_GROWTH_DAYS;
  }
  if (lastGrowthDay === fund.lastGrowthDay) return null;
  return { balance: balance, startDay: fund.startDay, lastGrowthDay: lastGrowthDay };
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
    targetText: 'Own the Cleaning Service, Hauling Service, and Mae\'s Place.', /* MAES_PLACE_MAE1_E04_GOAL_TEXT: display text only -- the goal's id, kind ('businesses') and target are untouched, so a latched goal stays latched. */
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
 * or a third property. (TRIPLEX_TRIPLEX1_E03B_GOAL_COMMENT:
 * since TRIPLEX1 a third property -- the Triplex -- does
 * exist, but it is pinned out of the 'properties' count,
 * E03, so this still holds for goals.) LIFE_GOAL_IDS is
 * the one whitelist the
 * load normalization filters goalsDone and goalCoinsPaid by, so
 * a latched Chapter 2 goal -- and its coin-payment record --
 * survives reloads exactly like Chapter 1. */
const LIFE_GOAL_IDS = LIFE_GOALS.map((g) => g.id);
function lifeGoalProgress(g, s) {
  if (g.kind === 'credit') return s.credit;
  if (g.kind === 'businesses') return s.ownedBusinesses.length;
  if (g.kind === 'upgrades') return s.businessUpgrades.length;
  if (g.kind === 'properties') return s.propertiesOwned.filter((id) => id === 'duplex' || id === 'apartment').length; /* TRIPLEX_TRIPLEX1_E03_GOAL_COUNT: the 'properties' goals ('Own both rental properties', Chapters 2 and 3) mean the Duplex and the Apartment Building -- their targetText names exactly those two -- so the count is pinned to those ids. Before TRIPLEX1 the raw list length WAS that count (no third property could exist); pinning it keeps every goal predicate, latch and coin payment identical in behaviour while the new Triplex (E02) never moves a goal. The goal table, targets and texts are untouched. */
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
/* CASINO_INTERIOR_CASINOART1_E02_SCENE: the drawn casino
 * floor. Zabby (2026-11-09): the Casino exterior already
 * looks real; the only art still missing was slot
 * machines and tables drawn INSIDE the Casino. This is
 * that inside part, and it is decoration only -- no
 * state, no handlers, no Text, no emoji. The slot
 * machine sub-component below draws one machine from
 * plain Views (the CarFigure precedent: shapes, borders
 * and borderRadius only, which Android renders exactly
 * as drawn): a charcoal cabinet with a gold frame, a
 * marquee row of three light dots, a dark screen holding
 * three white reel windows (each with one colored dot --
 * cherry red, gold, or the city blue), a silver coin
 * tray, a gold base light, and a side lever with a red
 * knob. The floor scene composes three machines in a row
 * over two tables: a blackjack-style oval (wood rail,
 * green felt, gold trim line, two white cards and three
 * chips) and a roulette-style round wheel (wood rail,
 * gold trim, deep-red wheel ring, black hub with a gold
 * centre). The strip sits on the casino's near-black
 * with a gold border, matching the result panels below
 * it (casinoResultPanel), and carries
 * pointerEvents="none" so it can never intercept a
 * touch. It renders only on the casino floor view (the
 * render is inside the casinoGame === null branch, E03)
 * -- never inside the slots, blackjack or roulette
 * panels. All styles are inline; no StyleSheet entries
 * were added. Strip content height is 150 units. */
function CasinoSlotMachine({ r1, r2, r3 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <View style={{ width: 56, height: 64, backgroundColor: '#20242c', borderWidth: 2, borderColor: '#f5c542', borderRadius: 8, alignItems: 'center', paddingTop: 4 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#e5484d', marginRight: 4 }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#f5c542', marginRight: 4 }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#e5484d' }} />
        </View>
        <View style={{ marginTop: 4, width: 44, height: 21, backgroundColor: '#10151d', borderWidth: 1, borderColor: '#f5c542', borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <View style={{ width: 11, height: 14, backgroundColor: '#ffffff', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r1 }} />
          </View>
          <View style={{ width: 11, height: 14, backgroundColor: '#ffffff', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r2 }} />
          </View>
          <View style={{ width: 11, height: 14, backgroundColor: '#ffffff', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r3 }} />
          </View>
        </View>
        <View style={{ marginTop: 5, width: 36, height: 6, backgroundColor: '#9aa0a8', borderRadius: 3 }} />
        <View style={{ marginTop: 4, width: 28, height: 4, backgroundColor: '#f5c542', borderRadius: 2 }} />
      </View>
      <View style={{ marginLeft: 2, marginTop: 6, alignItems: 'center' }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#e5484d', borderWidth: 1, borderColor: '#7a1414' }} />
        <View style={{ width: 3, height: 26, backgroundColor: '#c7ccd4' }} />
      </View>
    </View>
  );
}

function CasinoFloorScene() {
  return (
    <View pointerEvents="none" style={{ alignSelf: 'stretch', backgroundColor: '#0b0e14', borderWidth: 2, borderColor: '#f5c542', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 8 }}>
        <CasinoSlotMachine r1="#e5484d" r2="#f5c542" r3="#3ea6ff" />
        <CasinoSlotMachine r1="#f5c542" r2="#e5484d" r3="#f5c542" />
        <CasinoSlotMachine r1="#3ea6ff" r2="#f5c542" r3="#e5484d" />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <View style={{ width: 148, height: 58, backgroundColor: '#6d4c2f', borderRadius: 29, padding: 5 }}>
          <View style={{ flex: 1, backgroundColor: '#0e6b3a', borderRadius: 24, borderWidth: 2, borderColor: '#f5c542', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 10, height: 14, backgroundColor: '#ffffff', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#e5484d' }} />
              </View>
              <View style={{ width: 10, height: 14, backgroundColor: '#ffffff', borderRadius: 2, marginLeft: 3 }} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5484d', marginRight: 4 }} />
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f5c542', marginRight: 4 }} />
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3ea6ff' }} />
            </View>
          </View>
        </View>
        <View style={{ width: 62, height: 62, backgroundColor: '#6d4c2f', borderRadius: 31, padding: 4 }}>
          <View style={{ flex: 1, backgroundColor: '#7a1420', borderRadius: 27, borderWidth: 2, borderColor: '#f5c542', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#10151d', borderWidth: 2, borderColor: '#f5c542', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#f5c542' }} />
            </View>
          </View>
        </View>
      </View>
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
 * (PROPERTY_LISTINGS_PROP1_E16D_WORTH_NOTE: the PROP1 listing
 * base ask -- a sale pays a stored buyer offer, not this
 * price; this read-only valuation is unchanged by design,
 * and the v1 instant sell this note named is gone), BUSINESSES price
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
const CITY_ENTER_RANGE = 140; /* CITY_NAVIGATION_V1_E02_RANGE: entrance distance that offers ENTER (was 90 -- Zabby's tablet test found entrances hard to trigger) */
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
  { id: 'duplex', name: 'Duplex', sign: 'DUPLEX', kind: 'property', propId: 'duplex', dest: 'HOME', art: 'duplex', rect: { x: 120, y: 700, w: 280, h: 240 }, entrance: { x: 260, y: 982 } }, /* REALISTIC_LOOK_VIS2B_E03_ART_DUPLEX: was art: null (the drawn facade); now the duplex sprite from the art map. Rect, entrance and sign are untouched. */
  { id: 'apartment', name: 'Apartment Building', sign: 'APARTMENT BUILDING', kind: 'property', propId: 'apartment', dest: 'HOME', art: 'apartment', rect: { x: 760, y: 700, w: 320, h: 260 }, entrance: { x: 920, y: 1002 } }, /* REALISTIC_LOOK_VIS2B_E04_ART_APARTMENT: was art: null (the drawn facade); now the apartment sprite from the art map. Rect, entrance and sign are untouched. */
  { id: 'bank', name: 'Bank', sign: 'BANK', kind: 'building', dest: 'BANK', art: 'bank', rect: { x: 1690, y: 90, w: 220, h: 270 }, entrance: { x: 1800, y: 402 } },
  { id: 'casino', name: 'Casino', sign: 'CASINO', kind: 'building', dest: 'CASINO', art: 'casino', rect: { x: 1940, y: 90, w: 220, h: 270 }, entrance: { x: 2050, y: 402 } },
  { id: 'dealership', name: 'Dealership', sign: 'DEALERSHIP', kind: 'building', dest: 'DEALERSHIP', art: 'dealership', rect: { x: 2190, y: 90, w: 180, h: 270 }, entrance: { x: 2280, y: 402 } },
  { id: 'work', name: 'Employment Center', sign: 'EMPLOYMENT CENTER', kind: 'building', dest: 'WORK', art: 'work', rect: { x: 1690, y: 680, w: 240, h: 270 }, entrance: { x: 1810, y: 992 } },
  { id: 'store', name: 'Store', sign: 'STORE', kind: 'building', dest: 'STORE', art: 'store', rect: { x: 1960, y: 680, w: 220, h: 270 }, entrance: { x: 2070, y: 992 } },
  { id: 'transit', name: 'Transit', sign: 'TRANSIT', kind: 'building', dest: 'TRANSIT', art: 'transit', rect: { x: 2210, y: 680, w: 160, h: 270 }, entrance: { x: 2290, y: 992 } },
  { id: 'hauling', name: 'Hauling Service', sign: 'HAULING SERVICE', kind: 'business', bizId: 'hauling', dest: 'HOME', art: 'hauling', rect: { x: 1690, y: 1250, w: 200, h: 210 }, entrance: { x: 1790, y: 1502 } }, /* REALISTIC_LOOK_VIS2B_E06_ART_HAULING: was art: null (the drawn facade); now the hauling sprite from the art map. Rect, entrance and sign are untouched. */
  { id: 'cleaning', name: 'Cleaning Service', sign: 'CLEANING SERVICE', kind: 'business', bizId: 'cleaning', dest: 'HOME', art: 'cleaning', rect: { x: 1920, y: 1250, w: 200, h: 210 }, entrance: { x: 2020, y: 1502 } }, /* REALISTIC_LOOK_VIS2B_E05_ART_CLEANING: was art: null (the drawn facade); now the cleaning sprite from the art map. Rect, entrance and sign are untouched. */
  { id: 'foodstand', name: 'Mae\'s Place', sign: 'MAE\'S PLACE', kind: 'business', bizId: 'foodstand', dest: 'HOME', art: 'foodstand', rect: { x: 2150, y: 1250, w: 200, h: 210 }, entrance: { x: 2250, y: 1502 } } /* MAES_PLACE_MAE1_E05_CITY_SIGN: the place's name and its city sign read Mae's Place (the sign is the same length class as FOOD STAND and keeps the shipped shrink-to-fit). Id, bizId, dest, art, rect and entrance are byte-identical -- the sprite is unchanged and every route, collision and entrance reads as before. */, /* REALISTIC_LOOK_VIS2B_E07_ART_FOODSTAND: was art: null (the drawn facade); now the foodstand sprite from the art map. Rect, entrance and sign are untouched. */
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
];
/* VISUAL_CONSISTENCY_CITY3F_F01_PLOT_SPLIT: the three
 * footprints below are the plots the CITY3 customer houses
 * now stand on -- each one overlaps a cleaning customer's
 * house box (the Johnson, Rivera and Kim houses;
 * BIZ_CUSTOMERS spots at y 1490, boxes ending at the spot).
 * Their DRAWN scenery houses are removed from
 * CITY_SCENERY_RECTS above, so the detailed sprites own
 * those plots with no flat drawn roofline above them. The
 * footprints stay in the collision set through this table,
 * appended to CITY_RECTS in their original position, so
 * CITY_RECTS keeps the exact same rects in the exact same
 * order and walking, road routing, unstick and arrival
 * behave byte-identically (a plain deletion measurably
 * re-routed trips in the CITY3F scratch test: the Kim ride
 * went 103 -> 187 ticks). This table is collision data
 * only: nothing renders it. */
const CITY3F_PLOT_RECTS = [
  { x: 110, y: 1270, w: 200, h: 180 },
  { x: 760, y: 1270, w: 200, h: 180 },
  { x: 1100, y: 1270, w: 200, h: 180 },
];
const CITY_RECTS = CITY_PLACES.filter((p) => p.kind !== 'zone').map((p) => p.rect).concat(CITY_SCENERY_RECTS).concat(CITY3F_PLOT_RECTS);

/* CITY_EXPANSION_CITY2_E02_SCENERY_TABLES: trees and bushes
 * for the neighborhood pass -- pure decoration in the ground
 * layer (rendered by CityGroundStatic, E04), read by no
 * other system. Collision stays exactly CITY_RECTS above:
 * these points are NOT rects, so the road-route walker, the
 * road grid (cityRoadCenters reads CITY_STREETS, the same
 * table the ground draws its sidewalks, roads and zebra
 * crossings from) and arrival never see them. Every point
 * was placed off the asphalt and sidewalks (outside
 * CITY_STREETS inflated past the shipped 26-unit sidewalk),
 * clear of every collision rect, every entrance and every
 * BIZ_CUSTOMERS spot; the CITY2 sim re-checks all 28 points
 * against the live tables. */
const CITY_TREES = [
  { x: 95, y: 95 }, { x: 405, y: 95 }, { x: 95, y: 375 }, { x: 405, y: 375 },
  { x: 1060, y: 90 }, { x: 1420, y: 90 }, { x: 1060, y: 390 }, { x: 1420, y: 390 }, { x: 690, y: 400 },
  { x: 70, y: 660 }, { x: 440, y: 990 },
  { x: 420, y: 1330 }, { x: 60, y: 1560 },
  { x: 700, y: 660 }, { x: 1140, y: 660 }, { x: 1140, y: 1010 },
  { x: 700, y: 1330 }, { x: 1400, y: 1330 }, { x: 700, y: 1560 },
  { x: 1700, y: 1010 },
];
const CITY_BUSHES = [
  { x: 1045, y: 378 }, { x: 695, y: 120 }, { x: 250, y: 385 }, { x: 455, y: 715 },
  { x: 735, y: 985 }, { x: 1370, y: 720 }, { x: 345, y: 1300 }, { x: 985, y: 1300 },
];

/* FULLER_CITY_VIS4_E02_TABLES: the VIS4 'FULLER CITY'
 * decoration tables -- pure data, read only by
 * CityGroundStatic (the E03 builders and the E04 and
 * E07 renders) and by nothing else. Like the CITY2
 * tables above, none of this is collision: CITY_RECTS
 * stays exactly the shipped set, and every point and
 * rect below was placed off the streets and their
 * sidewalks, clear of every collision rect, every
 * entrance, every customer-house box and every
 * walkway (the VIS4 sim re-checks all of it against
 * the live tables). VIS4_TREES and VIS4_BUSHES extend
 * the CITY2 greenery in the same drawn style (the
 * shipped city2TreeWrap and city2Bush styles render
 * them): +14 trees and +10 bushes over the shipped
 * 20 and 8. VIS4_FLOWER_BEDS are small planting
 * strips at the park, bank and home frontages (the
 * store's frontage is skipped: the Chen customer
 * house stands on it, a shipped CITY3 placement).
 * VIS4_PARKED_CARS are curb-parked cars on the two
 * avenues (centre points, drawn with the shipped
 * CarFigure), each at least 40 units from its
 * avenue's driving centreline and clear of every
 * crosswalk and vertical street. VIS4_SKYLINE is
 * the distant skyline along the world's north edge:
 * { x, w, h } shapes whose bottoms sit on y = 50,
 * in the three x bands between the vertical
 * streets' sidewalks (474 to 686 and 1474 to 1686),
 * clear of every plot (the nearest plot top is the
 * park's y = 60). */
const VIS4_TREES = [
  { x: 250, y: 330 }, { x: 770, y: 66 }, { x: 1440, y: 235 }, { x: 1800, y: 48 }, { x: 2060, y: 48 },
  { x: 1850, y: 400 }, { x: 445, y: 775 }, { x: 60, y: 1010 }, { x: 700, y: 760 }, { x: 1130, y: 760 },
  { x: 1760, y: 1000 }, { x: 420, y: 1560 }, { x: 1030, y: 1560 }, { x: 1720, y: 1560 },
];
const VIS4_BUSHES = [
  { x: 1035, y: 205 }, { x: 450, y: 420 }, { x: 1920, y: 655 }, { x: 2245, y: 655 }, { x: 1300, y: 655 },
  { x: 720, y: 1010 }, { x: 1000, y: 1240 }, { x: 460, y: 1300 }, { x: 2100, y: 1560 }, { x: 350, y: 650 },
];
const VIS4_FLOWER_BEDS = [
  { x: 92, y: 404, w: 64, h: 18 }, { x: 344, y: 404, w: 64, h: 18 },
  { x: 1736, y: 368, w: 40, h: 18 }, { x: 1836, y: 368, w: 64, h: 18 },
  { x: 748, y: 358, w: 64, h: 18 }, { x: 908, y: 358, w: 64, h: 18 },
];
const VIS4_FLOWER_COLORS = ['#ff6b9d', '#ffd23f', '#ff8c42', '#c792ff', '#ff6b6b'];
const VIS4_PARKED_CARS = [
  { x: 820, y: 588, body: '#e4572e' }, { x: 1180, y: 588, body: '#57b6ff' }, { x: 2060, y: 588, body: '#ffd23f' },
  { x: 860, y: 1072, body: '#c792ff' }, { x: 1330, y: 1072, body: '#3ea6ff' }, { x: 1080, y: 1188, body: '#7ee081' },
];
const VIS4_SKYLINE = [
  { x: 8, w: 54, h: 24 }, { x: 74, w: 91, h: 26 }, { x: 190, w: 72, h: 28 }, { x: 286, w: 109, h: 30 },
  { x: 694, w: 90, h: 32 }, { x: 806, w: 71, h: 34 }, { x: 898, w: 108, h: 36 }, { x: 1026, w: 89, h: 38 },
  { x: 1134, w: 70, h: 40 }, { x: 1222, w: 107, h: 42 }, { x: 1346, w: 88, h: 44 },
  { x: 1694, w: 69, h: 46 }, { x: 1778, w: 106, h: 48 }, { x: 1898, w: 87, h: 50 }, { x: 1998, w: 68, h: 25 },
  { x: 2078, w: 105, h: 27 }, { x: 2208, w: 86, h: 29 }, { x: 2318, w: 67, h: 31 },
];

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

/* CITY_EXPANSION_CITY2_E03_CAM_HELPER: one eased step of the
 * follow camera's focus toward its target. Pure: the movement
 * tick (E06) feeds it the ref focus and the follow target and
 * stores the result; nothing else calls it. Each step closes
 * CITY2_CAM_EASE of the remaining gap per axis, so the focus
 * approaches monotonically and can never overshoot its
 * target; inside CITY2_CAM_SNAP on both axes it settles
 * exactly onto the target. A null focus (the camera's first
 * tick) seeds straight onto the target -- the shipped hard
 * follow, so a cold start is VIS2C's camera. */
const CITY2_CAM_EASE = 0.35;
const CITY2_CAM_SNAP = 0.5;
function city2CamEaseStep(focus, target) {
  if (!focus) return { x: target.x, y: target.y };
  const dx = target.x - focus.x;
  const dy = target.y - focus.y;
  if (Math.abs(dx) <= CITY2_CAM_SNAP && Math.abs(dy) <= CITY2_CAM_SNAP) return { x: target.x, y: target.y };
  return { x: focus.x + dx * CITY2_CAM_EASE, y: focus.y + dy * CITY2_CAM_EASE };
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

/* TABLET_FIXES_CITY5_E05_SIGN_HELPER: the sign pill's
 * owned read. cityPlaceOwned above stays the shipped
 * function (the ENTER gate and the guide logic read it,
 * and its building fallthrough -- true, entering is
 * fine -- is a navigation rule, not an ownership
 * claim). The SIGN can only ask 'is this place the
 * player's own?': a business or property answers
 * through cityPlaceOwned exactly as CITY2 shipped, and
 * the DEALERSHIP -- kind 'building', so CITY2's pill
 * gate never reached it -- answers through
 * dealershipOwned, the one ownable place the shipped
 * derivation missed. Every other place answers false:
 * no tag, plain pill, exactly as shipped. Pure. */
function city5SignOwned(place, ownedBusinesses, propertiesOwned, dealershipOwned) {
  if (place.kind === 'business' || place.kind === 'property') return cityPlaceOwned(place, ownedBusinesses, propertiesOwned);
  if (place.id === 'dealership') return !!dealershipOwned;
  return false;
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
/* NAVIGATION_EASE_V1_E02_HELPERS: tap-to-building trips and
 * the GO TO panel, as pure functions of the shipped tables.
 * tapPlaceAtPoint hit-tests building rects for the places
 * that have entrances (the park zone has none and free-walks,
 * exactly as a ground tap does today). navArrivalNote is the
 * doorstep note for places that do NOT auto-open on arrival:
 * the two properties (owned or not -- their screen is the
 * shared HOME screen, reached with the ENTER button as
 * today) and any business the player does not own yet (the
 * same words the map's not-owned note uses). Every other
 * entrance place auto-opens through the shipped cityEnter.
 * Prices / rent / credit come from the PROPERTIES table. */
const GO_TO_DESTS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'bank', label: 'Bank' },
  { id: 'store', label: 'Store' },
  { id: 'casino', label: 'Casino' },
  { id: 'duplex', label: 'Duplex' },
  { id: 'apartment', label: 'Apartment Building' },
];

function propertyForPlace(placeDef) {
  if (!placeDef || placeDef.kind !== 'property') return null;
  return PROPERTIES.find((p) => p.id === placeDef.propId) || null;
}

function tapPlaceAtPoint(x, y, places) {
  for (const p of places || CITY_PLACES) {
    if (!p.entrance) continue;
    const r = p.rect;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return p;
  }
  return null;
}

function navArrivalNote(placeDef, ownedBusinesses, propertiesOwned) {
  if (!placeDef) return null;
  const owned = cityPlaceOwned(placeDef, ownedBusinesses, propertiesOwned);
  if (placeDef.kind === 'property') {
    const prop = propertyForPlace(placeDef);
    if (!prop) return placeDef.name + ' — not owned yet';
    return owned
      ? placeDef.name + ' — yours · $' + prop.rent + ' every Friday'
      : placeDef.name + ' — $' + prop.price.toLocaleString() + ' at HOME · needs ' + prop.credit + ' credit';
  }
  if (!owned) return placeDef.name + ' — not owned yet';
  return null;
}

function navArrivalDecision(placeDef, pos, ownedBusinesses, propertiesOwned) {
  if (!placeDef || !placeDef.entrance || !pos) return null;
  const d = Math.hypot(pos.x - placeDef.entrance.x, pos.y - placeDef.entrance.y);
  if (d > CITY_ENTER_RANGE) return null;
  const note = navArrivalNote(placeDef, ownedBusinesses, propertiesOwned);
  return note ? { action: 'note', text: note } : { action: 'open' };
}

function goToStatusLine(placeDef, pos, ownedBusinesses, propertiesOwned) {
  if (!placeDef) return '';
  if (placeDef.kind === 'property') {
    const prop = propertyForPlace(placeDef);
    if (!prop) return '';
    return cityPlaceOwned(placeDef, ownedBusinesses, propertiesOwned)
      ? 'Owned · $' + prop.rent + '/Friday'
      : 'Locked · needs $' + prop.price.toLocaleString() + ' + ' + prop.credit + ' credit';
  }
  if (!placeDef.entrance || !pos) return '';
  return Math.round(Math.hypot(pos.x - placeDef.entrance.x, pos.y - placeDef.entrance.y)) + ' away';
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

/* CITY_NAVIGATION_V1_E01_ROUTE: the FIND A PLACE route line.
 * BUILD_LABEL identifies this build on the HOME and title
 * screens (and in a bundle grep). routeToEntrance is a pure
 * function of the shipped tables: it walks the player to the
 * nearest point on a street centreline (the approach leg),
 * travels the centreline grid (vertical centrelines crossed
 * with horizontal centrelines; shortest path over that grid),
 * then leaves the road at the entrance's own projection (the
 * second approach leg). Every middle segment lies exactly on
 * a centreline derived from CITY_STREETS; only the two
 * approach legs leave the roads. routeDots then samples the
 * polyline into gold dots for the world renderer. Nothing
 * here moves the player or touches collision, the clock or
 * any economy state -- it only describes a line to draw. */
const BUILD_LABEL = 'CASINOART1 · 2026-11-09'; /* CASINO_INTERIOR_CASINOART1_E01_LABEL (was TRIPLEX1 · 2026-11-09) */ /* TRIPLEX_TRIPLEX1_E01_LABEL (was NFUND1 · 2026-11-09) */ /* NEIGHBORHOOD_FUND_NFUND1_E00_LABEL (was MAE1 · 2026-11-08) */ /* MAES_PLACE_MAE1_E01_LABEL (was READ1 · 2026-11-08) */ /* LISTING_READABILITY_READ1_E01_LABEL (was PROP1 · 2026-11-08) */ /* PROPERTY_LISTINGS_PROP1_E01_LABEL (was INT1 · 2026-11-08) */ /* BANK_INTEREST_INT1_E01_LABEL (was VIS6 · 2026-11-08) */ /* MAIN_STREET_TRAFFIC_VIS6_E01_LABEL (was VIS5 · 2026-11-08) */ /* READABILITY_VIS5_E01_LABEL (was DELIVERY2 · 2026-11-08) */ /* COLLECTION_UX_DELIVERY2_E01_LABEL (was VIS4 · 2026-11-08) */ /* FULLER_CITY_VIS4_E01_LABEL (was VIS3 · 2026-11-08) */ /* CITY_POLISH_VIS3_E01_LABEL (was DELIVERY1G · 2026-11-08) */ /* BANNER_LABEL_DELIVERY1G_E01_LABEL (was DELIVERY1F · 2026-11-08) */ /* TDZ_FIX_DELIVERY1F_E01_LABEL (was DELIVERY1 · 2026-11-08) */ /* DELIVERY_ROUTES_DELIVERY1_E01_LABEL (was NAVFIX1 · 2026-11-08) */ /* CITY_LABEL_NAVFIX1_E02_CITY_LABELS: every 'BACK TO CITY' back label in this file is plain text now -- the cityscape emoji came out of the label because Android dropped the word CITY after the wide glyph on Zabby's tablet; words, buttons and handlers unchanged (see the NAVFIX1 patch docstring) */ /* LAMP_NAV_HOME2F_E01_LABEL (was HOME2 · 2026-11-08) */ /* ROOM_SCALE_HOME2_E01_LABEL (was HOME1 · 2026-11-08) */ /* HOME_INTERIOR_HOME1_E01_LABEL (was CITY5 · 2026-11-07) */ /* TABLET_FIXES_CITY5_E01_LABEL (was CITY4 · 2026-11-07) */ /* READABILITY_CITY4_E01_LABEL (was CITY3 · 2026-11-07) */ /* VISUAL_CONSISTENCY_CITY3_E01_LABEL (was CITY2 · 2026-11-07) */ /* CITY_EXPANSION_CITY2_E01_LABEL (was VIS2C · 2026-11-07) */ /* CITY_BAR_FIX_VIS2C_E01_LABEL (was VIS2B · 2026-11-07) */ /* REALISTIC_LOOK_VIS2B_E01_LABEL (was VIS2 · 2026-11-07) */ /* REALISTIC_LOOK_VIS2_E01_LABEL (was FSX1 · 2026-11-07) */ /* FOOD_STAND_EXPANSION_FSX1_E01_LABEL (was BIZX1 · 2026-11-07) */ /* BUSINESS_EXPANSION_BIZX1_E01_LABEL (was DX2 · 2026-11-07) */ /* DEALERSHIP_REPORT_CONTRAST_DX2_E01_LABEL (was CHX1 · 2026-11-07) */ /* CLEANING_HAULING_EXPANSION_CHX1_E01_LABEL (was EA1 · 2026-11-07) */ /* FRIENDS_EARLY_ACCESS_EA1_E01_LABEL (was CBJ1F, CITY_BUSINESS_JOBS_FIX_CBJ1F_E01_LABEL) */

/* FRIENDS_EARLY_ACCESS_EA1_E02_REPORT_TEXT: the exact text of
 * a problem report, composed from the player's typed words.
 * Line 1 names the game, line 2 carries this build's label
 * (read from BUILD_LABEL itself, never a hardcoded copy),
 * line 3 is the fixed prompt, line 4 is what the player
 * typed -- or the placeholder when the box is still empty.
 * Pure; the REPORT A PROBLEM screen (E06) renders its return
 * value as selectable text so the player can copy it. */
function problemReportText(draft) {
  const body = draft ? draft : '(not filled in yet)';
  return "Sky's the Limit — Problem Report\nBuild: " + BUILD_LABEL + "\nWhat happened:\n" + body;
}
const CITY_ROUTE_DOT_GAP = 45;
const CITY_ROUTE_MAX_DOTS = 140;

function cityRoadCenters() {
  const xs = [];
  const ys = [];
  for (const s of CITY_STREETS) {
    if (s.h > s.w) xs.push(s.x + s.w / 2);
    else if (s.w > s.h) ys.push(s.y + s.h / 2);
  }
  return { xs, ys };
}

function cityRoadProjection(pos) {
  let best = null;
  for (const s of CITY_STREETS) {
    const cand = s.h > s.w
      ? { x: s.x + s.w / 2, y: Math.min(Math.max(pos.y, s.y), s.y + s.h) }
      : { x: Math.min(Math.max(pos.x, s.x), s.x + s.w), y: s.y + s.h / 2 };
    const d = Math.hypot(pos.x - cand.x, pos.y - cand.y);
    if (!best || d < best.dist) best = { point: cand, dist: d };
  }
  return best ? best.point : { x: pos.x, y: pos.y };
}

function routeToEntrance(pos, entrance) {
  if (!pos || !entrance || !Number.isFinite(pos.x) || !Number.isFinite(pos.y) || !Number.isFinite(entrance.x) || !Number.isFinite(entrance.y)) return [];
  const centers = cityRoadCenters();
  const nodes = [];
  const nodeIndex = (p) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].x === p.x && nodes[i].y === p.y) return i;
    }
    nodes.push({ x: p.x, y: p.y });
    return nodes.length - 1;
  };
  const startIdx = nodeIndex(cityRoadProjection(pos));
  const endIdx = nodeIndex(cityRoadProjection(entrance));
  for (const x of centers.xs) {
    for (const y of centers.ys) nodeIndex({ x, y });
  }
  const onGrid = (a, b) => (a.x === b.x && centers.xs.includes(a.x)) || (a.y === b.y && centers.ys.includes(a.y));
  const dist = nodes.map(() => Infinity);
  const prev = nodes.map(() => -1);
  const done = nodes.map(() => false);
  dist[startIdx] = 0;
  for (let step = 0; step < nodes.length; step++) {
    let u = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || !Number.isFinite(dist[u])) break;
    done[u] = true;
    if (u === endIdx) break;
    for (let v = 0; v < nodes.length; v++) {
      if (v === u || done[v] || !onGrid(nodes[u], nodes[v])) continue;
      const w = Math.abs(nodes[u].x - nodes[v].x) + Math.abs(nodes[u].y - nodes[v].y);
      if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
    }
  }
  const chain = [];
  if (Number.isFinite(dist[endIdx])) {
    let cur = endIdx;
    while (cur !== -1) { chain.unshift(nodes[cur]); cur = prev[cur]; }
  }
  const raw = [{ x: pos.x, y: pos.y }].concat(chain, [{ x: entrance.x, y: entrance.y }]);
  const out = [];
  for (const p of raw) {
    const last = out[out.length - 1];
    if (last && last.x === p.x && last.y === p.y) continue;
    out.push(p);
    while (out.length >= 3) {
      const a = out[out.length - 3];
      const b = out[out.length - 2];
      const c = out[out.length - 1];
      if ((a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y)) out.splice(out.length - 2, 1);
      else break;
    }
  }
  const deduped = [];
  for (const p of out) {
    const lastD = deduped[deduped.length - 1];
    if (lastD && lastD.x === p.x && lastD.y === p.y) continue;
    deduped.push(p);
  }
  return deduped;
}

function routeDots(waypoints) {
  if (!Array.isArray(waypoints) || waypoints.length < 2) return [];
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) total += Math.hypot(waypoints[i].x - waypoints[i - 1].x, waypoints[i].y - waypoints[i - 1].y);
  if (!(total > 0)) return [];
  const gap = Math.max(CITY_ROUTE_DOT_GAP, total / CITY_ROUTE_MAX_DOTS);
  const dots = [];
  let carry = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const a = waypoints[i - 1];
    const b = waypoints[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (!(seg > 0)) continue;
    let d = gap - carry;
    while (d < seg) {
      dots.push({ x: a.x + (b.x - a.x) * (d / seg), y: a.y + (b.y - a.y) * (d / seg) });
      d += gap;
    }
    carry = seg - (d - gap);
  }
  return dots;
}

/* NAVIGATION_EASE_V1_1_FIX_F01_STEP: road-route walks and
 * the stall watchdog, as pure functions beside the NAV1
 * route helpers. The NAV2 walker aimed at ONE straight-line
 * target; pressed against a building whose radius-inflated
 * span contains the target's own perpendicular coordinate,
 * the axis-separated slide decays geometrically (the error
 * shrinks by the step/distance ratio each tick), so the
 * player creeps a hair per tick and the shipped give-up --
 * which counts only ticks where the position is EXACTLY
 * unchanged -- effectively never fires (reproduced from the
 * shipped numbers: Home -> Bank freezes at distance ~198
 * against the Job Board's west edge; Home -> Apartment
 * Building at ~320 against its north edge). The fix walks
 * building trips along the roads and watches every walk for
 * stalled progress:
 * - citySegmentBlocked: exact segment vs radius-inflated
 *   rect test (slab method).
 * - cityStreetLink: the point's projection on each of the
 *   four streets, keeping only candidates whose straight
 *   segment to the point crosses no building; the shortest
 *   such segment wins. NAV1's cityRoadProjection cannot be
 *   used raw for this: for the Cleaning Service and Food
 *   Stand entrances it picks the north street, whose
 *   straight leg pierces the building itself.
 * - cityWalkWaypoints (renamed in NAVIGATION_EASE_V1_2_FIX -- V1.1 named it cityRouteWaypoints; see the G01 note at its definition): out to the player's street link,
 *   along routeToEntrance's centreline route to the
 *   entrance's street link, then the entrance. Every leg
 *   is segment-clear by test or by centreline geometry.
 * - stepCityWalk: ONE movement-tick step for a tap walk
 *   (the tick applies its result verbatim, the busStepDrive
 *   pattern). Advances the waypoint queue at the shipped
 *   arrival radius; counts ticks since the player last
 *   moved CITY_WALK_PROGRESS units; at
 *   CITY_WALK_STALL_TICKS the watchdog fires: advance to
 *   the next waypoint, or (final leg) rebuild the leg via
 *   the target's street link exactly once, or end the
 *   walk. Fires per walk are bounded by the queue length
 *   + 2, so every walk terminates. */
function citySegmentBlocked(a, b, rects) {
  for (const r of rects) {
    const minX = r.x - CITY_PLAYER_R, maxX = r.x + r.w + CITY_PLAYER_R;
    const minY = r.y - CITY_PLAYER_R, maxY = r.y + r.h + CITY_PLAYER_R;
    let t0 = 0, t1 = 1;
    const dx = b.x - a.x, dy = b.y - a.y;
    if (Math.abs(dx) < 1e-9) { if (a.x <= minX || a.x >= maxX) continue; }
    else { let ta = (minX - a.x) / dx, tb = (maxX - a.x) / dx; if (ta > tb) { const s = ta; ta = tb; tb = s; } t0 = Math.max(t0, ta); t1 = Math.min(t1, tb); if (t0 > t1) continue; }
    if (Math.abs(dy) < 1e-9) { if (a.y <= minY || a.y >= maxY) continue; }
    else { let ta = (minY - a.y) / dy, tb = (maxY - a.y) / dy; if (ta > tb) { const s = ta; ta = tb; tb = s; } t0 = Math.max(t0, ta); t1 = Math.min(t1, tb); if (t0 > t1) continue; }
    return true;
  }
  return false;
}

function cityStreetLink(point, rects) {
  if (!point) return null;
  let best = null;
  for (const s of CITY_STREETS) {
    const cand = s.h > s.w
      ? { x: s.x + s.w / 2, y: Math.min(Math.max(point.y, s.y), s.y + s.h) }
      : { x: Math.min(Math.max(point.x, s.x), s.x + s.w), y: s.y + s.h / 2 };
    if (citySegmentBlocked(point, cand, rects)) continue;
    const d = Math.hypot(cand.x - point.x, cand.y - point.y);
    if (!best || d < best.dist) best = { point: cand, dist: d };
  }
  return best ? best.point : null;
}

/* NAVIGATION_EASE_V1_2_FIX_G01_NAME: this helper was named
 * cityRouteWaypoints in V1.1 -- a name the Game render body
 * ALREADY held as a const (the NAV1 route-dots array,
 * CITY_NAVIGATION_V1_E06_ROUTE_DERIVED). Inside the
 * component that const shadows this module function, so
 * cityWalkRoute's call read the dots array (or null) and
 * threw TypeError inside the press handler: the guide
 * armed, the dots drew, and no armed walk ever started.
 * The module helper is renamed; the render const keeps its
 * shipped name. Never name a module helper with a name any
 * component-scope const uses. */
function cityWalkWaypoints(pos, entrance, rects) {
  if (!pos || !entrance) return [];
  const approach = cityStreetLink(entrance, rects);
  const anchor = approach || entrance;
  const exit = cityStreetLink(pos, rects);
  const from = exit || pos;
  const route = routeToEntrance(from, anchor);
  const pts = [];
  const push = (p) => { const last = pts[pts.length - 1]; if (!last || last.x !== p.x || last.y !== p.y) pts.push({ x: p.x, y: p.y }); };
  if (exit && (exit.x !== pos.x || exit.y !== pos.y)) push(exit);
  for (const p of route) push(p);
  if (pts.length && pts[0].x === pos.x && pts[0].y === pos.y) pts.shift();
  if (approach && (approach.x !== entrance.x || approach.y !== entrance.y)) push(entrance);
  return pts;
}

const CITY_WALK_STALL_TICKS = 30; /* ~1 s at CITY_TICK_MS */
const CITY_WALK_PROGRESS = 2; /* units of travel that reset the stall clock */

function newCityWalkRoute(pos) {
  return { queue: [], stallX: pos.x, stallY: pos.y, stallTicks: 0, rebuilt: false };
}

function stepCityWalk(walk, pos, speed, rects) {
  const w = { target: walk.target, queue: walk.queue.slice(), stallX: walk.stallX, stallY: walk.stallY, stallTicks: walk.stallTicks, rebuilt: walk.rebuilt };
  const here = { x: pos.x, y: pos.y };
  if (!w.target) return { pos: here, walk: w, event: 'idle' };
  const distT = Math.hypot(w.target.x - pos.x, w.target.y - pos.y);
  if (distT <= Math.max(speed, 24)) {
    if (w.queue.length) {
      const next = w.queue.shift();
      return { pos: here, walk: { target: next, queue: w.queue, stallX: pos.x, stallY: pos.y, stallTicks: 0, rebuilt: w.rebuilt }, event: 'waypoint' };
    }
    return { pos: here, walk: { target: null, queue: [], stallX: pos.x, stallY: pos.y, stallTicks: 0, rebuilt: w.rebuilt }, event: 'arrive' };
  }
  const dx = ((w.target.x - pos.x) / distT) * speed;
  const dy = ((w.target.y - pos.y) / distT) * speed;
  const nextPos = resolveCityMove(pos, dx, dy, rects);
  let stallX = w.stallX, stallY = w.stallY, stallTicks = w.stallTicks;
  if (Math.hypot(nextPos.x - stallX, nextPos.y - stallY) >= CITY_WALK_PROGRESS) { stallX = nextPos.x; stallY = nextPos.y; stallTicks = 0; }
  else stallTicks += 1;
  let target = w.target, queue = w.queue, rebuilt = w.rebuilt, event = 'move';
  if (stallTicks >= CITY_WALK_STALL_TICKS) {
    stallTicks = 0;
    stallX = nextPos.x;
    stallY = nextPos.y;
    if (rebuilt) { target = null; queue = []; event = 'watchdog-end'; }
    else if (queue.length) { target = queue.shift(); event = 'watchdog-advance'; }
    else {
      const link = cityStreetLink(target, rects);
      if (link && (link.x !== target.x || link.y !== target.y)) { queue = [target]; target = link; rebuilt = true; event = 'watchdog-nudge'; }
      else {
        const proj = cityRoadProjection(target);
        if (proj.x !== target.x || proj.y !== target.y) { target = proj; rebuilt = true; event = 'watchdog-nudge'; }
        else { target = null; queue = []; event = 'watchdog-end'; }
      }
    }
  }
  return { pos: nextPos, walk: { target, queue, stallX, stallY, stallTicks, rebuilt }, event };
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
/* EXPANSION_DEL1_R_ROUTES: three delivery routes off the
 * one shipped pickup (the Store entrance). Every drop-off
 * is an already-proven walkable point -- the Food Stand
 * storefront spot, the shipped delivery house, and the
 * cleaning mission's far-west customer house -- so no new
 * collision / reachability proof is needed. Terms are
 * Zabby's: Short $40/+1h, Medium $70/+2h, Long $100/+3h,
 * each +10 XP, all sharing the shipped 3-per-day delivery
 * counter and the $1,500 earnings-cap gate. LEGACY_DELIVERY
 * preserves the shipped flat terms for a mission saved
 * before routes existed (no route key): it completes at
 * exactly what the player accepted -- $60, +1 hour, no XP. */
const DELIVERY_ROUTES = {
  short: { id: 'short', name: 'Short', pay: 40, hours: 1, xp: 10, spot: MISSION_SPOTS.foodstand, spotName: 'Mae\'s Place', dropText: 'Mae\'s Place', destText: 'Store → Mae\'s Place' /* MAES_PLACE_MAE1_E09_ROUTE_TEXT: the Short route's drop-off is the restaurant's own storefront spot (MISSION_SPOTS.foodstand -- the point itself is untouched); its board text names Mae's Place now. Pay, hours, XP and the spot are byte-identical. */ },
  medium: { id: 'medium', name: 'Medium', pay: 70, hours: 2, xp: 10, spot: MISSION_SPOTS.deliveryDropoff, spotName: 'Delivery house', dropText: 'the house in the Residential District', destText: 'Store → Residential District' },
  long: { id: 'long', name: 'Long', pay: 100, hours: 3, xp: 10, spot: MISSION_SPOTS.cleaningCustomer, spotName: 'Customer house', dropText: 'the far-west house in the Residential District', destText: 'Store → far-west Residential District' },
};
const DELIVERY_ROUTE_ORDER = ['short', 'medium', 'long'];
const LEGACY_DELIVERY = { id: null, name: null, pay: MISSION_DELIVERY_PAY, hours: MISSION_DELIVERY_HOURS, xp: 0, spot: MISSION_SPOTS.deliveryDropoff, spotName: 'Delivery house', dropText: 'the house in the Residential District', destText: 'Store → Residential District' };
/* SKY_CITY_TRAVEL_V1_R_TERMS: the terms a NEW delivery
 * acceptance runs on (the TRV1 repricing) -- Short $40/+1h,
 * Medium $60/+1h, Long $80/+1h, each +10 XP, keyed by the
 * same route ids as DELIVERY_ROUTES so names, spots and
 * destinations stay shared. DELIVERY_ROUTES itself is
 * FROZEN at its DEL1 values: it is now the fallback rung
 * for a mission accepted in the DEL1 build (route key, no
 * stamped terms), and editing it in place would silently
 * reprice those missions. newMission stamps these numbers
 * onto the mission at accept time; deliveryTerms resolves
 * stamped terms first, then the frozen table, then
 * LEGACY_DELIVERY. */
const DELIVERY_ACCEPT_TERMS = {
  short: { pay: 40, hours: 1, xp: 10 },
  medium: { pay: 60, hours: 1, xp: 10 },
  long: { pay: 80, hours: 1, xp: 10 },
};
/* DELIVERY_ROUTES_DELIVERY1_E02_ROUTES: DELIVERY1 -- the
 * delivery board's routes are now ROUTES OF STOPS. A route
 * is a package run: pick up at the Store, then ride to
 * one, two or three customer houses in order. The ladder
 * is Zabby's approved numbers: 1 stop $40, 2 stops $70,
 * 3 stops $100, and EVERY route takes +1 hour total and
 * +10 XP -- the clock advances once, when the route
 * completes, never per stop. The DEL1 tables above stay
 * frozen exactly as shipped: DELIVERY_ROUTES /
 * DELIVERY_ACCEPT_TERMS / LEGACY_DELIVERY are now only
 * the fold for a mission accepted before this build
 * (E12), never a price source for a new accept. */
const DELIVERY1_ROUTES = {
  stops1: { id: 'stops1', name: '1-stop', stops: 1, pay: 40, hours: 1, xp: 10 },
  stops2: { id: 'stops2', name: '2-stop', stops: 2, pay: 70, hours: 1, xp: 10 },
  stops3: { id: 'stops3', name: '3-stop', stops: 3, pay: 100, hours: 1, xp: 10 },
};
const DELIVERY1_ROUTE_ORDER = ['stops1', 'stops2', 'stops3'];
/* TDZ_FIX_DELIVERY1F_E02_MOVED: DELIVERY1_STOP_POOL is
 * declared BELOW now, immediately after BIZ_CUSTOMERS.
 * It cannot live here: its initializer flattens
 * BIZ_CUSTOMERS the moment the module loads, and with
 * the pool above that table the app died at startup --
 * ReferenceError: Cannot access 'BIZ_CUSTOMERS' before
 * initialization, thrown inside the reduce() call
 * (temporal dead zone). The declaration itself is
 * unchanged; see the note at the pool below. */
/* One pool stop by id, or null. */
function deliveryStopById(stopId) {
  if (typeof stopId !== 'string') return null;
  return DELIVERY1_STOP_POOL.find((s) => s.id === stopId) || null;
}
/* DELIVERY_ROUTES_DELIVERY1_E02_RESOLVE: a stored stop
 * entry resolved the CBJ1 way -- the table row for its
 * id is the authority for name and spot; a stamped entry
 * whose id is gone but whose fields are sane keeps its
 * stamped fields; anything else falls back to the pool's
 * first stop, so a route always has somewhere to go. */
function resolveDeliveryStop(entry) {
  const fromTable = deliveryStopById(entry && entry.id);
  if (fromTable) return { id: fromTable.id, customer: fromTable.customer, label: fromTable.label, x: fromTable.x, y: fromTable.y };
  if (entry && Number.isFinite(entry.x) && Number.isFinite(entry.y) && typeof entry.customer === 'string' && entry.customer !== '') {
    return { id: typeof entry.id === 'string' ? entry.id : '', customer: entry.customer, label: typeof entry.label === 'string' ? entry.label : '', x: entry.x, y: entry.y };
  }
  const first = DELIVERY1_STOP_POOL[0];
  return { id: first.id, customer: first.customer, label: first.label, x: first.x, y: first.y };
}
/* DELIVERY_ROUTES_DELIVERY1_E02_STOPS_FOR: the stops a
 * route offer shows -- and the accept stamps -- a pure
 * function of the day and the deliveries already done
 * today, the bizCustomerFor pattern: the run starts at
 * pool[(day + done) % pool.length] and takes the next
 * stops in pool order (wrapping), so the offer is stable
 * within the day at a given count and rotates as routes
 * complete and days pass. The board (E22) and the accept
 * handler (E19) read this same derivation from the same
 * counters, so the stops shown are the stops stamped. */
function deliveryRouteStops(routeId, day, doneToday) {
  const row = DELIVERY1_ROUTES[routeId];
  if (!row || !DELIVERY1_STOP_POOL.length) return [];
  const d = Number.isInteger(day) ? day : 0;
  const done = Number.isInteger(doneToday) && doneToday > 0 ? doneToday : 0;
  const start = (((d + done) % DELIVERY1_STOP_POOL.length) + DELIVERY1_STOP_POOL.length) % DELIVERY1_STOP_POOL.length;
  const out = [];
  for (let i = 0; i < row.stops; i++) {
    const s = DELIVERY1_STOP_POOL[(start + i) % DELIVERY1_STOP_POOL.length];
    out.push({ id: s.id, customer: s.customer, label: s.label, x: s.x, y: s.y });
  }
  return out;
}
/* The terms a delivery mission runs on, resolved in
 * order (SKY_CITY_TRAVEL_V1_R_TERMSRESOLVE): (1) the
 * terms stamped onto the mission at accept time -- spot,
 * name and destination text still resolve from the route
 * row (or the legacy row when the route is missing or
 * invalid); only the numbers are the mission's own, each
 * key falling back to the row on its own. (2) The frozen
 * DEL1 route table when the mission carries a valid
 * route but no stamped terms (accepted in the DEL1
 * build). (3) The legacy flat terms when the mission
 * carries no (valid) route -- a pre-DEL1 save, or an
 * accept that named no route. */
function deliveryTerms(mission) {
  const row = mission && mission.route && DELIVERY_ROUTES[mission.route] ? DELIVERY_ROUTES[mission.route] : LEGACY_DELIVERY;
  if (mission && (Number.isFinite(mission.pay) || Number.isFinite(mission.hours) || Number.isFinite(mission.xp))) {
    return {
      id: row.id, name: row.name,
      pay: Number.isFinite(mission.pay) ? mission.pay : row.pay,
      hours: Number.isFinite(mission.hours) ? mission.hours : row.hours,
      xp: Number.isFinite(mission.xp) ? mission.xp : row.xp,
      spot: row.spot, spotName: row.spotName, dropText: row.dropText, destText: row.destText,
    };
  }
  return row;
}
/* DELIVERY_ROUTES_DELIVERY1_E03_STOPS: the stops a
 * delivery mission is actually running, resolved
 * defensively from the mission itself: its stamped stop
 * list, each entry resolved through E02's table-first
 * rule; or, for a DEL1-era mission that never carried
 * stops, the single destination it was already heading
 * to, on its resolved (stamped-first) terms -- a legacy
 * mission is a 1-stop route to its drop spot. Never
 * empty for a delivery mission. */
function deliveryMissionStops(mission) {
  if (!mission || mission.kind !== 'delivery') return [];
  if (Array.isArray(mission.stops) && mission.stops.length > 0) {
    return mission.stops.slice(0, 3).map((s) => resolveDeliveryStop(s));
  }
  const dt = deliveryTerms(mission);
  return [{ id: 'legacy_drop', customer: dt.spotName, label: dt.destText, x: dt.spot.x, y: dt.spot.y }];
}
/* DELIVERY_ROUTES_DELIVERY1_E03_AT: a delivery mission
 * rebuilt at a stage/progress, its route, terms and
 * stops RESTAMPED from the resolved values (the
 * FSX1-prep discipline): no stamped field is trusted
 * from the mission itself and none can be lost between
 * stages. Pure transition data -- no money, clock or
 * counter rides here. */
function deliveryMissionAt(mission, stage, progress) {
  const dm = { kind: 'delivery', stage: stage, progress: progress };
  if (mission.route) dm.route = mission.route;
  if (Number.isFinite(mission.pay)) dm.pay = mission.pay;
  if (Number.isFinite(mission.hours)) dm.hours = mission.hours;
  if (Number.isFinite(mission.xp)) dm.xp = mission.xp;
  dm.stops = deliveryMissionStops(mission);
  return dm;
}
/* DELIVERY_ROUTES_DELIVERY1_E04_TARGET: the current
 * destination of a delivery mission as a travel target
 * -- the delivery twin of missionCustomerTarget (which
 * stays business-only, as its contract states): the
 * Store at pickup, the current stop while delivering.
 * The banner's GO TO button (E25) and the name chip
 * (E28/E29) read this one derivation, and the walk
 * itself is the shipped road-route walker through
 * goToMissionCustomer (E24). */
function missionDeliveryTarget(mission) {
  if (!mission || mission.kind !== 'delivery') return null;
  const spot = missionSpot(mission);
  if (!spot) return null;
  if (mission.stage === 'deliver' || mission.stage === 'dropoff') {
    const stops = deliveryMissionStops(mission);
    const idx = Math.min(Math.max(Number.isInteger(mission.progress) ? mission.progress : 0, 0), stops.length - 1);
    const s = stops[idx];
    return { id: s.id, customer: s.customer, label: s.label, x: s.x, y: s.y, stopIndex: idx, stopCount: stops.length };
  }
  return { id: 'store', customer: 'Store', label: 'Package pickup', x: spot.x, y: spot.y, stopIndex: -1, stopCount: deliveryMissionStops(mission).length };
}
/* DELIVERY_ROUTES_DELIVERY1_E04_COLLECT_PLAN: the pure
 * collect decision for waiting delivery pay (E16's
 * handler applies it behind the shared pending ref).
 * Delivery pay counts toward the $1,500 daily earnings
 * cap AT COLLECT time -- the approved DELIVERY1
 * deviation: completion itself is never cap-blocked, so
 * the money waits instead. If the whole waiting amount
 * cannot fit under today's cap, the collect is refused
 * whole: no partial pay, and the pay keeps waiting for
 * a later day. */
function planDeliveryCollect(waiting, earnedToday, earnedTodayDay, day) {
  const amount = Number.isFinite(waiting) && waiting > 0 ? waiting : 0;
  if (amount <= 0) return { ok: false, reason: 'none', amount: 0 };
  if (!canEarn(earnedToday, earnedTodayDay, day, amount)) return { ok: false, reason: 'cap', amount: amount };
  return { ok: true, amount: amount };
}
/* DELIVERY_ROUTES_DELIVERY1_E04_SUMMARY_NORM: the
 * persisted last-route summary (stops delivered + that
 * route's pay), normalized on load and at state init: a
 * well-formed pair or null. */
function normalizeDeliverySummary(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!Number.isInteger(value.stops) || value.stops < 1 || value.stops > 3) return null;
  if (!Number.isFinite(value.pay) || value.pay <= 0) return null;
  return { stops: value.stops, pay: value.pay };
}
/* COLLECTION_UX_DELIVERY2_E02_STAMP_NORM: the persisted
 * last-collect stamp (the amount collected and the day it
 * was collected on), normalized on load and at state init
 * exactly like the summary above: a well-formed pair or
 * null. The stamp is written only by a successful collect
 * (E06) and read only by the board's collected
 * confirmation (E09) -- it never gates money. */
function normalizeDeliveryLastCollect(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (!Number.isFinite(value.amount) || value.amount <= 0) return null;
  if (!Number.isInteger(value.day) || value.day < 0) return null;
  return { amount: value.amount, day: value.day };
}
const MISSION_DEFS = {
  cleaning: { kind: 'cleaning', bizId: 'cleaning', title: 'Cleaning Service — Customer Clean', destText: 'Customer homes around the city', task: 'Travel to the customer shown below, then tap COMPLETE JOB when you arrive.', timeText: '+2 hours' }, /* CITY_BUSINESS_JOBS_CBJ1_E05_DEFS: the business cards now describe the one customer visit this build runs (E10); titles and time are unchanged, and the customer + location lines on the card (E20) carry the specifics. */
  hauling: { kind: 'hauling', bizId: 'hauling', title: 'Hauling Service — Depot Run', destText: 'Customer moves around the city', task: 'Travel to the customer shown below, then tap COMPLETE JOB when you arrive.', timeText: '+2 hours' },
  foodstand: { kind: 'foodstand', bizId: 'foodstand', title: 'Mae\'s Place — Serve Orders', destText: 'Customer orders around the city', task: 'Prepare the order at Mae\'s Place first, then travel to the customer shown below and tap COMPLETE DELIVERY when you arrive.', timeText: '+2 hours' /* MAES_PLACE_MAE1_E10_MISSION_DEF: the board card's title and prep text name Mae's Place; the kind, bizId, destText and timeText are untouched, and the prep flow (E12-E14) is the shipped one. */ }, /* FOOD_STAND_EXPANSION_FSX1_E20_DEFS_TASK: the board card's food text matches the prep flow (E21-E28); every other row is untouched. */
  transit_route: { kind: 'transit_route', bizId: null, title: 'City Loop Bus Route', destText: 'Depot → Residential → Downtown/Shopping', task: 'Drive the bus route and stop at all 3 stops so passengers can board.', rewardText: '$144 wages (paid Friday) · +40 XP', timeText: '+8 hours' },
  delivery: { kind: 'delivery', bizId: null, title: 'Motorcycle Delivery', destText: 'Store pickup → customer stops', task: 'Pick up a package at the Store, then ride to each stop on the route and hand over the package. Route pay waits at this board — collect it here.', rewardText: 'Pay by route — shown on each route below', timeText: '+1 hour per route' }, /* DELIVERY_ROUTES_DELIVERY1_E04_DEFS: DELIVERY1's card text -- the routes carry their own stops/pay on the E22 rows, and the time line is now one true line for every route (+1 hour per completed route, E02). */ /* EXPANSION_DEL1_R_DEFS: the three routes carry their own pay/time/XP on their board rows; the old flat $60/+1h card text would contradict them. */
};

/* CITY_BUSINESS_JOBS_CBJ1_E04_CUSTOMERS: customer job
 * locations for the three business mission kinds --
 * named customers at fixed, walkable spots in the
 * Explore world (2400x1600). Every spot is an
 * already-proven mission spot or place entrance (the
 * shipped cleaning customer house, the delivery
 * house, the depot and Store strips, the business
 * storefronts) or a same-geometry lawn of a scenery
 * house; the sim BFS-proves each one reachable from
 * the HOME entrance with the shipped collision
 * tables. Index 0 for each business is that
 * business's shipped spot, so a mission accepted
 * before this build still points where it pointed.
 * The customer a business is offering is a pure
 * function of the day and the jobs already done
 * today (bizCustomerFor): the board card and the
 * accept stamp read the same derivation from the
 * same state, so the customer shown is always the
 * customer stamped, and completing a job rotates
 * the offer to the next customer. */
const BIZ_CUSTOMERS = {
  cleaning: [
    { id: 'clean_johnson', customer: 'The Johnson House', label: 'Residential District \u2014 far west', x: 210, y: 1490 },
    { id: 'clean_rivera', customer: 'The Rivera House', label: 'Residential District \u2014 south', x: 860, y: 1490 },
    { id: 'clean_kim', customer: 'The Kim House', label: 'Residential District \u2014 east side', x: 1200, y: 1490 },
  ],
  hauling: [
    { id: 'haul_miller', customer: 'The Miller Move', label: 'By the Transit Depot', x: 2330, y: 1030 },
    { id: 'haul_chen', customer: 'The Chen Family Move', label: 'By the Store', x: 2070, y: 1030 },
    { id: 'haul_garcia', customer: 'The Garcia Move', label: 'Apartment Building \u2014 Residential District', x: 920, y: 1002 },
  ],
  /* FOOD_STAND_EXPANSION_FSX1_E19_ORDERS: each food
   * customer carries the ORDER line its MANAGE-screen card
   * shows (E31). Simple functional DRAFT copy, written for
   * Lori's pass. The other businesses' rows are untouched:
   * their cards never read an order field. */
  foodstand: [
    { id: 'food_rush', customer: 'Mae\'s Place Rush', label: 'Mae\'s Place', order: 'Fish & fries plates for the lunch rush', x: 2250, y: 1502 } /* MAES_PLACE_MAE1_E11_RUSH_CUSTOMER: the lunch-rush order is the restaurant's own -- its card names Mae's Place now. Id, order line and spot are untouched (a stored mission rebuilds its customer from this table by id, so an order in flight renames with the table). */,
    { id: 'food_park', customer: 'Park Picnic Order', label: 'The Park', order: 'Shrimp & fries for a family picnic', x: 250, y: 230 },
    { id: 'food_casino', customer: 'Casino Staff Party', label: 'By the Casino', order: 'Fish & shrimp combos for the staff party', x: 2050, y: 402 },
  ],
};

/* DELIVERY_ROUTES_DELIVERY1_E02_POOL: the stop pool --
 * the shipped named customer houses, flattened in the
 * table's own order (cleaning, hauling, foodstand; the
 * CITY3 house derivation order), so every stop is a spot
 * already proven walkable and already wearing a house
 * sprite. No new geometry is introduced. */
const DELIVERY1_STOP_POOL = ['cleaning', 'hauling', 'foodstand'].reduce((acc, kind) => acc.concat(BIZ_CUSTOMERS[kind] || []), []);
/* TDZ_FIX_DELIVERY1F_E03_POOL_BELOW: this declaration
 * MUST stay below BIZ_CUSTOMERS -- the reduce() above
 * reads that table during module evaluation. DELIVERY1
 * declared the pool with the other delivery tables,
 * ~177 lines ABOVE BIZ_CUSTOMERS, and the shipped app
 * rendered nothing (the boot test's ReferenceError).
 * Every use of the pool is inside a function body
 * (deliveryStopById / resolveDeliveryStop /
 * deliveryRouteStops), so moving the declaration here
 * changes no behavior -- only evaluation order. */

/* VISUAL_CONSISTENCY_CITY3_E03_HOUSE_TABLE: every
 * business customer gets a detailed house on the map
 * (rendered by E04 in CityBuildingsStatic). The
 * derivation is pure data over the shipped
 * BIZ_CUSTOMERS table: kinds in table order (cleaning,
 * hauling, foodstand), customers in their listed order,
 * and the variant cycles by the customer's index
 * within its kind -- index % 3 -> custhouse_a / _b /
 * _c. Geometry: every house is CITY3_HOUSE_W (208)
 * units wide; the height is the sprite's own aspect
 * at that width (a 512x409 -> 166, b 512x375 -> 152,
 * c 512x304 -> 124), so resizeMode 'contain' fills
 * the box exactly. The box is anchored with the
 * customer's spot -- the mission target the player
 * walks to -- on its BOTTOM edge, horizontally
 * centred: box left = x - 104, box top = y - h. The
 * mission spot itself never moves: targeting, arrival
 * ranges, the road-route walker, guide distances and
 * the pin all keep reading the spot exactly as before;
 * only the CITY2 chip rides higher (E05). Nothing
 * reads this table except the houses render. */
const CITY3_HOUSE_ART_KEYS = ['custhouse_a', 'custhouse_b', 'custhouse_c'];
const CITY3_HOUSE_W = 208;
const CITY3_HOUSE_H = { custhouse_a: 166, custhouse_b: 152, custhouse_c: 124 };
function city3BuildCustomerHouses() {
  const out = [];
  for (const kind of ['cleaning', 'hauling', 'foodstand']) {
    (BIZ_CUSTOMERS[kind] || []).forEach((c, i) => {
      const art = CITY3_HOUSE_ART_KEYS[i % 3];
      out.push({ id: c.id, kind: kind, x: c.x, y: c.y, art: art, h: CITY3_HOUSE_H[art] });
    });
  }
  return out;
}
const CITY3_CUSTOMER_HOUSES = city3BuildCustomerHouses();

/* One customer of a business by id, or null. */
function bizCustomerById(kind, customerId) {
  const spots = BIZ_CUSTOMERS[kind];
  if (!spots || typeof customerId !== 'string') return null;
  return spots.find((c) => c.id === customerId) || null;
}

/* The customer a business is offering right now, from
 * the same snapshot shape the board and the accept
 * handler read: rotates by day + jobs already done. */
function bizCustomerFor(kind, snap) {
  const spots = BIZ_CUSTOMERS[kind];
  if (!spots || !spots.length) return null;
  const day = snap && Number.isInteger(snap.day) ? snap.day : 0;
  const done = bizJobsDoneToday(snap ? snap.bizWork : null, kind, day);
  return spots[(day + done) % spots.length];
}

/* The customer a business mission is for, resolved
 * defensively: the table entry for the stamped id
 * first (the table is the authority for names and
 * spots), then the stamped fields themselves, then
 * the business's first customer -- so a mission
 * always has somewhere to go and someone to name. */
function missionCustomer(mission) {
  if (!mission) return null;
  const fromTable = bizCustomerById(mission.kind, mission.customerId);
  if (fromTable) return fromTable;
  if (Number.isFinite(mission.x) && Number.isFinite(mission.y) && typeof mission.customer === 'string' && mission.customer !== '') {
    return { id: typeof mission.customerId === 'string' ? mission.customerId : '', customer: mission.customer, label: typeof mission.label === 'string' ? mission.label : '', x: mission.x, y: mission.y };
  }
  const spots = BIZ_CUSTOMERS[mission.kind];
  return spots && spots.length ? spots[0] : null;
}

/* FOOD_STAND_EXPANSION_FSX1_E22_STAND_SPOT: the Food
 * Stand's own spot -- its CITY_PLACES entrance, the point
 * the stand's doorstep opens from. During a food mission's
 * PREP stage this is the mission's spot and its travel
 * target: the guide chip, the minimap ring, the range gate
 * and the road-route walker all read it through missionSpot
 * / missionCustomerTarget (E23/E24), exactly as they read
 * the customer during 'go'. Falls back to the stand's first
 * customer row -- by construction the same point (the
 * stand's own rush spot IS the entrance) -- so the helper
 * always returns a spot. */
function foodStandSpot() {
  const place = CITY_PLACES.find((p) => p.id === 'foodstand');
  if (place && place.entrance && Number.isFinite(place.entrance.x) && Number.isFinite(place.entrance.y)) {
    return { x: place.entrance.x, y: place.entrance.y };
  }
  const first = BIZ_CUSTOMERS.foodstand[0];
  return { x: first.x, y: first.y };
}

/* TABLET_FIXES_CITY5_E03_CHIP_HELPERS: the screen-space
 * geometry of the CITY2/CITY3 customer name chip, as pure
 * functions of the mission spot and the render's own
 * cityCam. The world chip (CITY2 E08, CITY3 E05) sits at
 * (spot.x - 120, spot.y - 204) in world coordinates, 240
 * wide and about 32 tall; the world layer is translated
 * by (-cityCam.x, -cityCam.y), so the chip's screen rect
 * is the world rect shifted by the same camera -- E04's
 * overlay reads these helpers with the very cityCam the
 * world transform in the same render pass uses, so the
 * two can never disagree. The banner band is the shipped
 * cityBanner slot: top 102, inset 16 on both sides, and
 * at most about 190 tall (the CITY4 stack measures ~148,
 * ~174 with a notice line; 190 is the safe ceiling).
 * Pure math; nothing here reads or writes state. */
const CITY5_CHIP_W = 240;
const CITY5_CHIP_H = 32;
const CITY5_BANNER_TOP = 102;
const CITY5_BANNER_H = 190;
const CITY5_BANNER_SIDE = 16;
function city5ChipScreenRect(spot, cam) {
  return { left: spot.x - 120 - cam.x, top: spot.y - 204 - cam.y, w: CITY5_CHIP_W, h: CITY5_CHIP_H };
}
function city5ChipCoveredByBanner(spot, cam, viewW) {
  const r = city5ChipScreenRect(spot, cam);
  const bx = CITY5_BANNER_SIDE;
  const bw = Math.max(0, viewW - CITY5_BANNER_SIDE * 2);
  return r.left < bx + bw && r.left + r.w > bx && r.top < CITY5_BANNER_TOP + CITY5_BANNER_H && r.top + r.h > CITY5_BANNER_TOP;
}

/* CITY_BUSINESS_JOBS_FIX_CBJ1F_E02_TARGET: the customer
 * a GO TO CUSTOMER trip can aim at, or null. Only the
 * three business kinds carry a customer (CBJ1 E04/E07),
 * and missionCustomer already resolves one for them in
 * every case -- the stamped table id first, then the
 * stamped fields, then the business's first customer --
 * while returning null for deliveries and the transit
 * route, whose BIZ_CUSTOMERS entry does not exist. So
 * this gate is the whole rule: a business mission
 * always has a target, and no other mission ever does.
 * Pure; shared by the travel handler (E03) and the one
 * render derivation (E06) both travel surfaces gate on. */
function missionCustomerTarget(mission) {
  if (!mission) return null;
  if (mission.kind !== 'cleaning' && mission.kind !== 'hauling' && mission.kind !== 'foodstand') return null;
  /* FOOD_STAND_EXPANSION_FSX1_E23_TARGET_PREP: during the
   * PREP stage the travel target is the Food Stand itself --
   * the banner's GO TO FOOD STAND button and the FIND A
   * PLACE first row both read this one derivation, exactly
   * as they read the customer during 'go'. */
  if (mission.kind === 'foodstand' && mission.stage === 'prep') {
    const standSpot = foodStandSpot();
    return { id: 'foodstand', customer: 'Mae\'s Place', label: 'Mae\'s Place', x: standSpot.x, y: standSpot.y }; /* MAES_PLACE_MAE1_E12_PREP_TARGET: during PREP the travel target is the restaurant itself; its guide name is Mae's Place now. The spot derivation is untouched. */
  }
  return missionCustomer(mission);
}

function newMission(kind, routeId, customer, routeStops) { /* DELIVERY_ROUTES_DELIVERY1_E05_NEWMISSION_SIG: a delivery accept also carries its stamped stop list (the fourth argument, from E19's derivation) -- every other kind ignores it, so their mission objects are byte-identical to before. */ /* CITY_BUSINESS_JOBS_CBJ1_E04_STAMP: a business accept also carries its customer (the third argument, from E04's picker) -- stamped onto the mission the same way a delivery's route and terms are, so the job the player accepted is the job that completes, even after a reopen (normalizeMission carries it, E12). */ /* EXPANSION_DEL1_R_NEWMISSION: a delivery accept carries its route; every other kind ignores the second argument, so their mission objects are byte-identical to before. An absent/invalid route leaves the key off entirely -- the legacy mission shape. */
  switch (kind) {
    case 'cleaning':
    case 'hauling':
    case 'foodstand': {
      /* CITY_BUSINESS_JOBS_CBJ1_E06_NEWMISSION_CASES: a
       * business mission in this build is ONE customer
       * visit -- travel to the customer, then complete
       * on arrival -- so all three kinds share the
       * single 'go' stage and carry the stamped
       * customer (id, name, location label, spot). A
       * customer that does not resolve against the
       * table is not stamped: the mission still runs,
       * and missionCustomer falls back to the
       * business's first customer. */
      /* FOOD_STAND_EXPANSION_FSX1_E21_ACCEPT_PREP: a Food
       * Stand mission instead starts at 'prep' -- the order
       * is prepared at the stand before the delivery run
       * (E22-E26). Both accept surfaces (the CITY JOBS board
       * and the MANAGE-screen order cards) construct missions
       * through this one function, so both start at 'prep'.
       * Cleaning and hauling keep the shipped 'go'. */
      const bm = { kind: kind, stage: kind === 'foodstand' ? 'prep' : 'go', progress: 0 };
      if (customer && bizCustomerById(kind, customer.id)) {
        bm.customerId = customer.id;
        bm.customer = customer.customer;
        bm.label = customer.label;
        bm.x = customer.x;
        bm.y = customer.y;
      }
      return bm;
    }
    case 'transit_route': return { kind: 'transit_route', stage: 'drive', progress: 0, aboard: 0 };
    case 'delivery': {
      const dm = { kind: 'delivery', stage: 'pickup', progress: 0 };
      /* DELIVERY_ROUTES_DELIVERY1_E06_NEWMISSION: a
       * DELIVERY1 accept stamps its route's approved terms
       * AND its stop list (E02's derivation, each entry
       * resolved through the table by id) onto the mission,
       * so the route the player accepted is the route that
       * runs and completes -- even after a reopen
       * (normalizeMission carries it, E12). A route id this
       * build does not know leaves the keys off entirely --
       * the legacy mission shape, which E03 resolves as a
       * 1-stop route on the frozen DEL1 terms. */
      const routeRow = DELIVERY1_ROUTES[routeId];
      if (routeRow) {
        dm.route = routeId;
        dm.pay = routeRow.pay;
        dm.hours = routeRow.hours;
        dm.xp = routeRow.xp;
        const stops = Array.isArray(routeStops) ? routeStops.map((s) => deliveryStopById(s && s.id)).filter(Boolean) : [];
        if (stops.length === routeRow.stops) {
          dm.stops = stops.map((s) => ({ id: s.id, customer: s.customer, label: s.label, x: s.x, y: s.y }));
        }
      }
      return dm;
    }
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
    case 'hauling':
    case 'foodstand': {
      /* CITY_BUSINESS_JOBS_CBJ1_E07_SPOT: a business
       * mission's spot is its customer's spot, and its
       * guide name is the customer's name -- so the
       * in-world marker (DEL1_M), the minimap ring,
       * the guide chip and the range gate all point at
       * the customer, exactly as they pointed at the
       * shipped spots before. missionCustomer never
       * returns null for a business kind. */
      /* FOOD_STAND_EXPANSION_FSX1_E24_SPOT_PREP: during
       * 'prep' the spot is the Food Stand itself, so the
       * in-world marker, the minimap ring, the guide chip
       * and the range gate all point at the stand. */
      if (mission.kind === 'foodstand' && mission.stage === 'prep') {
        const standSpot = foodStandSpot();
        return { x: standSpot.x, y: standSpot.y, name: 'Mae\'s Place' }; /* MAES_PLACE_MAE1_E13_PREP_SPOT: the prep marker's name follows the restaurant; the spot itself is untouched. */
      }
      const custSpot = missionCustomer(mission);
      return { x: custSpot.x, y: custSpot.y, name: custSpot.customer };
    }
    case 'transit_route': {
      const s = MISSION_SPOTS.transitStops[Math.min(Math.max(mission.progress, 0), MISSION_SPOTS.transitStops.length - 1)];
      return { x: s.x, y: s.y, name: s.name };
    }
    case 'delivery': {
      /* DELIVERY_ROUTES_DELIVERY1_E07_SPOT: the pickup
       * stage's spot is the Store, as shipped; at a stop
       * the spot is the current stop's house, and the name
       * carries its position ('Stop 2 of 3'), so the guide
       * chip and the minimap ring name the destination and
       * where it sits in the route. A legacy mission
       * resolves through E03 as a 1-stop route to its
       * shipped drop spot. */
      if (mission.stage === 'deliver' || mission.stage === 'dropoff') {
        const stops = deliveryMissionStops(mission);
        const idx = Math.min(Math.max(Number.isInteger(mission.progress) ? mission.progress : 0, 0), stops.length - 1);
        const s = stops[idx];
        return { x: s.x, y: s.y, name: s.customer + ' — Stop ' + (idx + 1) + ' of ' + stops.length };
      }
      return { x: MISSION_SPOTS.deliveryPickup.x, y: MISSION_SPOTS.deliveryPickup.y, name: 'Store' };
    }
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
    case 'hauling':
    case 'foodstand':
      /* CITY_BUSINESS_JOBS_CBJ1_E08_ACTION: the one
       * interaction a city business job has -- finish
       * it, here, at the customer. The shipped HUD
       * derivation shows this button only within
       * CITY_ENTER_RANGE of the mission spot, so the
       * label is the arrival gate Zabby asked for. */
      /* FOOD_STAND_EXPANSION_FSX1_E25_ACTION_PREP: a Food
       * Stand mission's button is PREPARE ORDER at the stand
       * during 'prep', then COMPLETE DELIVERY at the customer
       * during 'go'. Cleaning and hauling keep COMPLETE JOB. */
      if (mission.kind === 'foodstand') {
        return { label: mission.stage === 'prep' ? 'PREPARE ORDER' : 'COMPLETE DELIVERY' };
      }
      return { label: 'COMPLETE JOB' };
    case 'transit_route':
      return { label: 'STOP & BOARD' };
    case 'delivery':
      /* DELIVERY_ROUTES_DELIVERY1_E08_ACTION: a route's two
       * buttons -- PICK UP PACKAGE at the Store, then
       * DELIVER at each stop. The shipped HUD derivation
       * shows the button only within CITY_ENTER_RANGE of
       * the current spot (E07), so the label is the arrival
       * gate: it cannot be tapped from across the city. */
      return mission.stage === 'pickup' ? { label: 'PICK UP PACKAGE' } : { label: 'DELIVER' };
  }
  return null;
}

function missionObjective(mission) {
  const def = MISSION_DEFS[mission.kind];
  switch (mission.kind) {
    case 'cleaning':
    case 'hauling':
    case 'foodstand': {
      /* CITY_BUSINESS_JOBS_CBJ1_E09_OBJECTIVE: the
       * banner names the customer and where they are,
       * and says how the job ends -- the guide chip
       * next to it carries the live distance, as
       * shipped. */
      const custObj = missionCustomer(mission);
      /* FOOD_STAND_EXPANSION_FSX1_E26_OBJECTIVE_PREP: during
       * PREP the banner sends the player to the stand first;
       * during 'go' it names the delivery button. Cleaning
       * and hauling keep the shipped sentence word for word. */
      if (mission.kind === 'foodstand' && custObj) {
        return { title: def.title, text: mission.stage === 'prep'
          ? 'Prepare the order at Mae\'s Place first. Then deliver it to ' /* MAES_PLACE_MAE1_E14_OBJECTIVE: the banner's prep sentence names Mae's Place; the sentence's shape and the delivery half are untouched. */ + custObj.customer + ' — ' + custObj.label + '.'
          : 'Go to ' + custObj.customer + ' — ' + custObj.label + '. Tap COMPLETE DELIVERY when you arrive.' };
      }
      return { title: def.title, text: custObj ? 'Go to ' + custObj.customer + ' — ' + custObj.label + '. Tap COMPLETE JOB when you arrive.' : def.task };
    }
    case 'transit_route': {
      const stop = MISSION_SPOTS.transitStops[Math.min(Math.max(mission.progress, 0), MISSION_SPOTS.transitStops.length - 1)];
      return { title: def.title, text: 'Next stop: ' + stop.name + ' (Stop ' + (mission.progress + 1) + ' of 3) • Passengers aboard: ' + (mission.aboard || 0) };
    }
    case 'delivery': {
      /* DELIVERY_ROUTES_DELIVERY1_E09_OBJECTIVE: the banner
       * names the whole route at pickup and the current
       * stop -- with its position in the route -- while
       * delivering. */
      const dStops = deliveryMissionStops(mission);
      if (mission.stage === 'pickup') {
        return { title: def.title, text: 'Pick up the package at the Store, then deliver to: ' + dStops.map((s) => s.customer).join(' → ') + '.' };
      }
      const dIdx = Math.min(Math.max(Number.isInteger(mission.progress) ? mission.progress : 0, 0), dStops.length - 1);
      const dCur = dStops[dIdx];
      return { title: def.title, text: 'Deliver to ' + dCur.customer + ' — ' + dCur.label + ' (Stop ' + (dIdx + 1) + ' of ' + dStops.length + '). Tap DELIVER when you arrive.' };
    }
  }
  return { title: def.title, text: '' };
}
/* READABILITY_VIS5_E14_NEXT_HELPER: the HOME Next line's
 * pure derivation (render E15). A pure read of state the
 * game already holds -- no field is added, nothing is
 * written, and no required task is invented: real
 * pending business (the Week-1 tutorial step, an active
 * mission's shipped objective text, a paycheck, waiting
 * delivery / business / dealership pay, pending wages)
 * is named as the next step in that priority order, and
 * in free play the line falls to an 'Optional:'
 * suggestion rotated by the day from this fixed list of
 * shipped activities. */
const VIS5_OPTIONAL_SUGGESTIONS = [
  'Optional: Work a shift at WORK to build your next paycheck.',
  'Optional: Take a job from CITY JOBS or one of your businesses.',
  'Optional: Run a motorcycle delivery route from CITY JOBS.',
  'Optional: Try your luck at the Casino.',
  'Optional: Check your Life Goals and MY PROGRESS.',
];
function vis5NextLine(snap) {
  if (!snap || typeof snap !== 'object') return '';
  if (Number.isInteger(snap.step) && snap.step >= 0 && snap.step < story.length) {
    const s = story[snap.step];
    const act = s && s.button ? s.button.charAt(0) + s.button.slice(1).toLowerCase() : 'Continue';
    return 'Next: ' + act + (s && s.title ? ' \u2014 ' + s.title + '.' : '.');
  }
  if (snap.mission) {
    const obj = missionObjective(snap.mission);
    if (obj && obj.text) return 'Next: ' + obj.text;
  }
  if (snap.paycheck > 0) return 'Next: Collect your paycheck at WORK.';
  if (snap.deliveryPayWaiting > 0) return 'Next: Collect your delivery pay at CITY JOBS.';
  if (snap.bizWaiting && (snap.bizWaiting.cleaning > 0 || snap.bizWaiting.hauling > 0 || snap.bizWaiting.foodstand > 0)) return 'Next: Collect your business pay \u2014 open MY BUSINESSES and use Manage / Collect Profits.';
  if (snap.dealershipProfit > 0) return 'Next: Collect your dealership profit at the Dealership.';
  if (snap.pendingWages > 0) return 'Next: Your wages arrive on Friday payday.';
  const n = VIS5_OPTIONAL_SUGGESTIONS.length;
  const idx = ((Math.floor(snap.day || 0) % n) + n) % n;
  return VIS5_OPTIONAL_SUGGESTIONS[idx];
}


/* One interaction tap, as a pure transition. Returns the next
 * mission, { completes: true } when this tap is the completing
 * one (the component then runs the completion planner), or
 * null when the stage has no interaction. */
function missionInteract(mission) {
  if (!mission) return null;
  switch (mission.kind) {
    case 'cleaning':
    case 'hauling':
    case 'foodstand':
      /* CITY_BUSINESS_JOBS_CBJ1_E10_INTERACT: the one
       * tap IS the completion -- the component runs
       * the shipped completion planner and the shipped
       * business branch, behind the shipped completion
       * token, exactly once. There is no intermediate
       * stage to rebuild, so no stamped field can be
       * lost between accept and completion. */
      /* FOOD_STAND_EXPANSION_FSX1_E27_INTERACT_PREP: the
       * PREP tap is the one intermediate stage. It rebuilds
       * the mission at 'go' with its customer RESTAMPED FROM
       * THE TABLE -- the delivery transition's discipline, so
       * no stamped field is trusted from the mission itself
       * and none can be lost -- and it touches nothing else:
       * no money, no clock, no counter. The component runs
       * this behind its stage-stamped mission token, so the
       * advance fires exactly once; the 'go' tap then
       * completes through the shipped planner, as before. */
      if (mission.kind === 'foodstand' && mission.stage === 'prep') {
        const prepCust = bizCustomerById('foodstand', mission.customerId) || BIZ_CUSTOMERS.foodstand[0];
        return { mission: { kind: 'foodstand', stage: 'go', progress: 0, customerId: prepCust.id, customer: prepCust.customer, label: prepCust.label, x: prepCust.x, y: prepCust.y } };
      }
      return { completes: true };
    case 'transit_route':
      if (mission.progress >= 2) return { completes: true };
      return { mission: { kind: 'transit_route', stage: 'drive', progress: mission.progress + 1, aboard: (mission.aboard || 0) + (MISSION_TRANSIT_BOARDING[mission.progress] || 0) } };
    case 'delivery':
      /* DELIVERY_ROUTES_DELIVERY1_E10_INTERACT: the pickup
       * tap advances to the first stop; a stop tap advances
       * to the next; the final stop's tap is the completing
       * one (the component runs the completion planner).
       * Every advance rebuilds through E03's restamp, and
       * no tap here moves money, the clock or a counter --
       * the route's +1 hour, +10 XP and pay land once, at
       * completion (E11/E20). A legacy 'dropoff' stage
       * completes as shipped. */
      if (mission.stage === 'pickup') {
        return { mission: deliveryMissionAt(mission, 'deliver', 0) };
      }
      if (mission.stage === 'deliver' || mission.stage === 'dropoff') {
        const stops = deliveryMissionStops(mission);
        const idx = Math.min(Math.max(Number.isInteger(mission.progress) ? mission.progress : 0, 0), stops.length - 1);
        if (idx >= stops.length - 1) return { completes: true };
        return { mission: deliveryMissionAt(mission, 'deliver', idx + 1) };
      }
      return null;
  }
  return null;
}

/* Arrival advance: cleaning's travel stage becomes the work
 * stage when the player reaches the customer house (the map
 * effect calls this through a functional state update). Any
 * other mission is untouched (null). */
function missionArrive(mission) {
  /* CITY_BUSINESS_JOBS_CBJ1_E11_ARRIVE: arrival no
   * longer advances a cleaning mission -- a CBJ1
   * business mission carries a customer and stays at
   * its 'go' stage until the player taps COMPLETE
   * JOB (E08/E10). Only a customer-less legacy shape
   * could still take the shipped advance, and
   * normalizeMission (E12) folds every stored
   * business mission into the customer shape on
   * load, so in practice this never fires. */
  if (mission && mission.kind === 'cleaning' && mission.stage === 'go' && !mission.customerId)
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
    const pay = businessPay(biz, snap.businessUpgrades, snap.businessUpgrades2); /* CLEANING_HAULING_EXPANSION_CHX1_E14_PLAN_PAY: the completion planner reads the same tier-aware pay as every other site, off the snapshot's tier-2 list. */
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
    /* DELIVERY_ROUTES_DELIVERY1_E11_PLAN: a route's final
     * delivery ALWAYS completes -- no daily-count end and
     * no earnings-cap block (the approved deviation from
     * DEL1: the pay is not cash yet, it moves into the
     * waiting pool at completion (E20), and the cap reads
     * it at COLLECT time instead (E04/E16), where a full
     * cap leaves the pay waiting rather than unpaid).
     * Pay/hours/XP are the mission's own stamped terms;
     * deliveryTerms is only the fallback for a mission
     * carrying none. */
    const stops = deliveryMissionStops(mission);
    const dt = deliveryTerms(mission);
    return { outcome: 'paid', kind: 'delivery', pay: Number.isFinite(mission.pay) ? mission.pay : dt.pay, hours: Number.isFinite(mission.hours) ? mission.hours : dt.hours, xp: Number.isFinite(mission.xp) ? mission.xp : dt.xp, stops: stops.length };
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
    case 'cleaning':
    case 'hauling':
    case 'foodstand': {
      /* CITY_BUSINESS_JOBS_CBJ1_E12_NORMALIZE: a stored
       * business mission resumes as the single customer
       * visit this build runs -- stage 'go', progress
       * 0, and its customer REBUILT FROM THE TABLE by
       * the stamped id (the stamped name/label/spot
       * are never trusted from storage). The shipped
       * stage names stay valid so a mission accepted
       * before this build survives the update: any
       * cleaning stage and a hauling 'pickup' fold to
       * the business's first customer -- the shipped
       * spot those stages were already heading to --
       * and a hauling 'deliver' folds to the Store
       * customer, its shipped destination. A mission
       * whose customer cannot be resolved still
       * resumes, at the first customer. Nothing here
       * pays anything: a resumed mission has completed
       * nothing. */
      const bizStages = value.kind === 'cleaning' ? ['go', 'work', 'finish'] : value.kind === 'hauling' ? ['go', 'pickup', 'deliver'] : ['prep', 'go', 'serve'];
      if (!bizStages.includes(value.stage)) return null;
      let custNorm = bizCustomerById(value.kind, value.customerId);
      if (!custNorm) {
        custNorm = value.kind === 'hauling' && value.stage === 'deliver' ? BIZ_CUSTOMERS.hauling[1] : BIZ_CUSTOMERS[value.kind][0];
      }
      /* FOOD_STAND_EXPANSION_FSX1_E28_NORM_PREP: a Food Stand
       * mission stored at 'prep' (only an FSX1 save can hold
       * one) resumes at 'prep'; every older food stage --
       * 'go' from the shipped builds, 'serve' from before
       * them -- folds to 'go', so an in-flight delivery from
       * an older build never gains a prep step mid-mission
       * and never breaks. Cleaning and hauling stages fold
       * exactly as shipped. */
      return { kind: value.kind, stage: value.kind === 'foodstand' && value.stage === 'prep' ? 'prep' : 'go', progress: 0, customerId: custNorm.id, customer: custNorm.customer, label: custNorm.label, x: custNorm.x, y: custNorm.y };
    }
    case 'transit_route': {
      if (value.stage !== 'drive') return null;
      const aboard = Number.isInteger(value.aboard) && value.aboard > 0 ? Math.min(value.aboard, 99) : 0;
      return { kind: 'transit_route', stage: 'drive', progress: Math.min(Math.max(progress, 0), 2), aboard: aboard };
    }
    case 'delivery': {
      if (!['pickup', 'deliver', 'dropoff'].includes(value.stage)) return null;
      /* DELIVERY_ROUTES_DELIVERY1_E12_NORMALIZE: a stored
       * DELIVERY1 mission resumes with its stops REBUILT
       * FROM THE TABLE by id (E02's resolve -- the stamped
       * name/spot are never trusted from storage), its
       * stage and progress clamped onto the route, and its
       * stamped terms validated on the shipped bands, each
       * key on its own. A DEL1-era mission (no stops)
       * FOLDS into the new shape as a 1-stop route to the
       * destination it was already heading to, on the
       * terms it was accepted on -- deliveryTerms'
       * stamped-first resolution, restamped here so the
       * fold is the mission's own: 'pickup' stays
       * 'pickup', 'dropoff' becomes the single delivery
       * stop. Nothing here pays anything: a resumed route
       * has completed nothing. */
      const dm = { kind: 'delivery', stage: 'pickup', progress: 0 };
      if (DELIVERY1_ROUTES[value.route] || DELIVERY_ROUTES[value.route]) dm.route = value.route;
      if (Array.isArray(value.stops) && value.stops.length > 0) {
        dm.stops = value.stops.slice(0, 3).map((s) => resolveDeliveryStop(s));
        dm.stage = value.stage === 'pickup' ? 'pickup' : 'deliver';
        dm.progress = dm.stage === 'deliver' ? Math.min(Math.max(progress, 0), dm.stops.length - 1) : 0;
        if (Number.isFinite(value.pay) && value.pay >= 0 && value.pay <= 1000) dm.pay = value.pay;
        if (Number.isFinite(value.hours) && value.hours >= 0 && value.hours <= 8) dm.hours = value.hours;
        if (Number.isFinite(value.xp) && value.xp >= 0 && value.xp <= 100) dm.xp = value.xp;
        return dm;
      }
      const dt = deliveryTerms(value);
      dm.stops = [{ id: 'legacy_drop', customer: dt.spotName, label: dt.destText, x: dt.spot.x, y: dt.spot.y }];
      dm.pay = dt.pay;
      dm.hours = dt.hours;
      dm.xp = dt.xp;
      dm.stage = value.stage === 'pickup' ? 'pickup' : 'deliver';
      dm.progress = 0;
      return dm;
    }
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
          /* BUSINESS_MANAGEMENT_BM1_E04_LOAD: the lifetime
           * job earnings are new: a save that predates the
           * field starts every business at zero -- past job
           * earnings are never reconstructed on load (the
           * Money History cannot total them either: jobs
           * worked from a business interior write no entry
           * there). A valid stored total is kept as stored.
           * Balances never move. */
          saved.bizLifetimeEarnings = normalizeBizLifetimeEarnings(saved.bizLifetimeEarnings);
          /* CITY_BUSINESS_JOBS_CBJ1_E14_LOAD: the Business
           * Job History is new: a save that predates it
           * starts with an empty history -- past city jobs
           * are never reconstructed. Stored entries are
           * validated one by one (E03); malformed ones
           * drop, valid ones keep their order. Balances
           * never move. */
          saved.bizJobHistory = normalizeBizJobHistory(saved.bizJobHistory);
          /* CLEANING_HAULING_EXPANSION_CHX1_E07_LOAD: the tier-2
           * list, the waiting pool and the completed-jobs
           * counter are new. Older saves start with no tier 2
           * owned and nothing waiting; the counter seeds once
           * from the Business Job History just normalized
           * above (E04). Balances never move. */
          saved.businessUpgrades2 = normalizeBusinessUpgrades2(saved.businessUpgrades2);
          saved.bizWaiting = normalizeBizWaiting(saved.bizWaiting);
          /* MAES_PLACE_MAE1_E08_LOAD: the Mae's Place customer
           * record is new: a stored round survives only if
           * every field is well-formed (normalizeMaeLastRound,
           * E07), so the management summary survives a reopen
           * exactly. A save that already owns the restaurant
           * but predates the field gets the latch stamp for
           * TODAY (zero customers, zero profit): its rounds
           * start with the next day, never retroactively on
           * load -- the loader-migration shape of DX1's
           * lifetime profit. Balances never move on load. */
          saved.maeLastRound = normalizeMaeLastRound(saved.maeLastRound);
          if (saved.maeLastRound === null && Array.isArray(saved.ownedBusinesses) && saved.ownedBusinesses.includes('foodstand') && Number.isInteger(saved.day))
            saved.maeLastRound = { day: saved.day, chicken: 0, ribs: 0, total: 0 };
          saved.bizJobsDone = normalizeBizJobsDone(saved.bizJobsDone, saved.bizJobHistory);
          /* BUSINESS_EXPANSION_BIZX1_E04_LOAD: the work-vehicle
           * selection is new: an older save starts with none,
           * and a stored selection survives only while its
           * business is still owned (ownedBusinesses was
           * normalized above). Balances never move. */
          saved.selectedWorkVehicle = normalizeSelectedWorkVehicle(saved.selectedWorkVehicle, saved.ownedBusinesses);
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
          saved.showArrows = saved.showArrows !== false;
          /* DEALERSHIP_OWNERSHIP_DEAL1_E03_LOAD: dealership
           * ownership is new: older saves start unowned with
           * nothing to collect and no sales recorded -- past
           * sales are never invented on load. A malformed
           * last-sale record normalizes to null; bad numbers
           * reset to their starts. Balances never move. */
          saved.dealershipOwned = saved.dealershipOwned === true;
          if (!Number.isFinite(saved.dealershipProfit) || saved.dealershipProfit < 0)
            saved.dealershipProfit = 0;
          if (!Number.isInteger(saved.dealershipSales) || saved.dealershipSales < 0)
            saved.dealershipSales = 0;
          saved.dealershipLastSale = normalizeDealershipLastSale(saved.dealershipLastSale);
          /* BUSINESS_HEADQUARTERS_HQ1_E03_LOAD: the sale
           * history is new: older saves start with an empty
           * one -- past sales are never invented on load
           * (the shipped Last sale record above still shows
           * the most recent pre-HQ1 sale). Malformed entries
           * drop; the list keeps its most recent 50. */
          saved.dealershipHistory = normalizeDealershipHistory(saved.dealershipHistory);
          /* DEALERSHIP_EXPANSION_DX1_E03_LOAD: the showroom
           * level and the sale notice are new: older saves
           * are a level-1 showroom (one sale a day at the
           * 20% margin) with no notice waiting. Only an
           * explicitly stored 2 is a level-2 showroom, and
           * only a non-empty stored string is a notice.
           * Balances never move. */
          saved.dealershipLevel = saved.dealershipLevel === 2 ? 2 : 1;
          saved.dealershipNotice = typeof saved.dealershipNotice === 'string' && saved.dealershipNotice !== '' ? saved.dealershipNotice : null;
          if (!Number.isInteger(saved.lastDealershipSaleDay))
            saved.lastDealershipSaleDay = -1; /* SKY_CITY_TRAVEL_V1_E03_LOAD: the arrow toggle defaults SHOWN -- only an explicitly stored false hides the D-pad, so every pre-TRV1 save loads with arrows on. */
          saved.fundOwned = saved.fundOwned === true;
          if (!Number.isFinite(saved.fundValue) || saved.fundValue < 0)
            saved.fundValue = FUND_START_VALUE;
          if (!Number.isInteger(saved.fundCycle) || saved.fundCycle < 0 || saved.fundCycle > 2)
            saved.fundCycle = 0;
          saved.propertiesOwned = normalizeProperties(saved.propertiesOwned);
          /* PROPERTY_LISTINGS_PROP1_E04_LOAD: listings and
           * rebuy cooldowns are new: older saves have none --
           * nothing listed, nothing cooling down. A stored
           * record survives only if every field is well-formed
           * (normalizePropertyListings / normalizePropertyRebuyUntil,
           * beside normalizeProperties); a live listing and a
           * waiting offer must survive a reopen exactly.
           * Balances never move on load. */
          saved.propertyListings = normalizePropertyListings(saved.propertyListings);
          saved.propertyRebuyUntil = normalizePropertyRebuyUntil(saved.propertyRebuyUntil);
          if (!Number.isInteger(saved.lastInvestPayday))
            saved.lastInvestPayday = -1;
          /* BANK_INTEREST_INT1_E04_LOAD: the interest latch is new:
           * older saves start unset (-1), so the first Friday they
           * process under this build pays interest like any other
           * Friday. Balances never move on load. */
          if (!Number.isInteger(saved.lastInterestDay))
            saved.lastInterestDay = -1;
          /* NEIGHBORHOOD_FUND_NFUND1_E04_LOAD: the fund
           * record is new: older saves start empty. A
           * stored record survives only whole and
           * well-formed (normalizeNeighborhoodFund, E03),
           * so a live fund and its growth clock survive a
           * reopen exactly. Balances never move on load. */
          saved.neighborhoodFund = normalizeNeighborhoodFund(saved.neighborhoodFund);
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
          /* DEALERSHIP_EXPANSION_DX1_E04_LOAD_SEED: lifetime
           * dealership profit is new. A save already
           * carrying a valid total keeps it -- the seed
           * runs once. Otherwise the total is seeded from
           * what the save can prove: every dealership
           * collection recorded in the Money History just
           * normalized above (the DEAL1 cash label and the
           * two HQ1 destination labels), plus the profit
           * still waiting uncollected (never recorded
           * until it is collected). The mount persist
           * writes the seeded value back with the save.
           * Caveat: Money History stores at most 100
           * entries, so a collection old enough to have
           * been pushed out of the stored history cannot
           * be counted -- the seed is the best total the
           * save itself can prove, never an invention. */
          if (!Number.isFinite(saved.dealershipLifetimeProfit) || saved.dealershipLifetimeProfit < 0)
            saved.dealershipLifetimeProfit = seedDealershipLifetimeProfit(saved.moneyHistory, saved.dealershipProfit);
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
          /* DELIVERY_ROUTES_DELIVERY1_E14_LOAD: waiting
           * delivery pay and the last-route summary are
           * new (E13): older saves start with nothing
           * waiting and no summary; a stored pair survives
           * exactly, a malformed one resets. */
          if (!Number.isFinite(saved.deliveryPayWaiting) || saved.deliveryPayWaiting < 0) saved.deliveryPayWaiting = 0;
          saved.deliverySummary = normalizeDeliverySummary(saved.deliverySummary);
          /* COLLECTION_UX_DELIVERY2_E04_LOAD: the collect
           * stamp is new (E03): older saves have none (null
           * -- no confirmation is invented on load); a stored
           * stamp survives exactly, a malformed one resets. */
          saved.deliveryLastCollect = normalizeDeliveryLastCollect(saved.deliveryLastCollect);
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
          /* FOOD_STAND_EXPANSION_FSX1_E13_LOAD_MANAGE: the
           * management screen's business is part of the save
           * now (E12/E14/E15). Normalize the pair together
           * (E10): a restored MANAGE_BIZ keeps its business
           * only while that business is still owned; anything
           * else -- above all a pre-FSX1 save closed on the
           * management screen, which stored no business at
           * all -- falls back to the MY_BUSINESSES dashboard
           * instead of the screen's no-business note. Runs
           * after ownedBusinesses was normalized above. */
          const manageSelFsx1 = normalizeManageBiz(saved.place, saved.manageBizId, saved.ownedBusinesses);
          saved.place = manageSelFsx1.place;
          saved.manageBizId = manageSelFsx1.manageBizId;
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
function PlayerFigure({ shirt = '#e8b93c', legs = '#2b3442', bob = 0 }) {
  return (
    <View style={[pfig.wrap, bob ? { transform: [{ translateY: bob }] } : null]}>
      {/* VISUAL_V1_E06A_FIGURE: a soft ground shadow, a hair cap and two eye dots make the figure read as a person. The head becomes a fixed 16x16 box, so the figure's total height is unchanged and every existing caller aligns exactly as before. bob is a primitive px offset from the caller (the player marker only); default 0 = the shipped stance. */}
      <View style={pfig.groundShadow} />
      <View style={pfig.headBox}>
        <View style={pfig.head} />
        <View style={pfig.hair} />
        <View style={[pfig.eye, { left: 4 }]} />
        <View style={[pfig.eye, { left: 10 }]} />
      </View>
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
  /* VISUAL_V1_E06B_PFIG_STYLES */
  headBox: { width: 16, height: 16 },
  hair: { position: 'absolute', top: 0, left: 0, width: 16, height: 7, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: '#33241a' },
  eye: { position: 'absolute', top: 8, width: 2, height: 3, borderRadius: 1, backgroundColor: '#1c2530' },
  groundShadow: { position: 'absolute', bottom: -3, width: 26, height: 7, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.30)' },
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
  /* FULLER_CITY_VIS4_E09_WALKERS_TABLE: two more errand walkers in the shipped table's own shape (shirt, speed, start, stops over LIVING_CITY_DOORS) -- the population goes 4 to 6 (+50%, the VIS4 hard cap). Speeds stay inside the shipped range. Same errand-loop system, rendered by the E11 blocks; no new machinery, nothing persisted. */
  { shirt: '#ffd23f', speed: 0.10, start: 2, stops: [
    { at: 'STORE', pause: 5 }, { at: 'PLAZA', pause: 4 }, { at: 'WORK', pause: 5 }, { at: 'HOME', pause: 5 },
  ] },
  { shirt: '#57b6ff', speed: 0.115, start: 1, stops: [
    { at: 'TRANSIT', pause: 4 }, { at: 'BANK', pause: 4 }, { at: 'CASINO', pause: 5 }, { at: 'STORE', pause: 4 },
  ] },
];

const LIVING_CITY_CARS = [
  { body: '#3ea6ff', from: 0.02, to: 0.98, duration: 6000 },
  { body: '#ff9a3c', from: 0.98, to: 0.02, duration: 7000 },
  /* FULLER_CITY_VIS4_E10_CARS_TABLE: two more ambient cars on the shipped shuttle loop (avenue 1), 2 to 4 total -- shorter runs at their own paces, so the street reads busier without bunching at the ends. Rendered by the E12 blocks; the same native-driver loop, no new machinery. */
  { body: '#7ee081', from: 0.15, to: 0.85, duration: 8500 },
  { body: '#c792ff', from: 0.80, to: 0.20, duration: 9500 },
  /* MAIN_STREET_TRAFFIC_VIS6_E02_CARS_TABLE: two ambient cars on the MAIN street (the y=1050 street in front of Employment Center / Store / Transit), 4 to 6 total -- centreline (1050 + 80) / 1600 = 0.70625 of world height, carried on the optional avenue field. The four avenue-1 entries above carry no avenue field and keep the shipped LIVING_CITY_STREET_Y line exactly (the actor falls back to it). Opposite runs at their own paces inside the shipped envelope, rendered by the E04 blocks; the same native-driver loop, no new machinery, nothing persisted. */
  { body: '#ef4444', from: 0.05, to: 0.95, duration: 11000, avenue: 0.70625 },
  { body: '#ffb020', from: 0.90, to: 0.10, duration: 13500, avenue: 0.70625 },
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
      {/* VISUAL_V1_E08A_CAR: a soft ground shadow and a lit cabin stripe. */}
      <View style={carfig.groundShadow} />
      <View style={[carfig.body, { backgroundColor: body }]}>
        <View style={carfig.cabin} />
      </View>
      <View style={carfig.wheels}>
        <View style={carfig.wheel} />
        <View style={carfig.wheel} />
      </View>
    </View>
  );
}

const carfig = StyleSheet.create({
  wrap: { alignItems: 'center', width: 30 },
  /* VISUAL_V1_E08B_CARFIG_STYLES */
  groundShadow: { position: 'absolute', bottom: -2, width: 32, height: 7, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.30)' },
  cabin: { height: 5, marginHorizontal: 5, marginTop: 2, borderRadius: 2, backgroundColor: 'rgba(191,227,255,0.9)' },
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
      {/* VISUAL_V1_E09A_BUSFIG: a soft ground shadow under the ambient bus. */}
      <View style={busfig.groundShadow} />
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
  /* VISUAL_V1_E09B_BUSFIG_STYLES */
  groundShadow: { position: 'absolute', bottom: -2, width: 44, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.30)' },
  body: { width: 40, height: 14, borderRadius: 5, backgroundColor: '#ffd23f', justifyContent: 'center' },
  windows: { height: 5, marginHorizontal: 4, borderRadius: 2, backgroundColor: '#ffdf6b' }, /* VISUAL_V1_E09C_BUS_WINDOWS_LIT: the ambient bus rides with its windows lit. */
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
    const y = (car.avenue != null ? car.avenue : LIVING_CITY_STREET_Y) * mapSize.h; /* MAIN_STREET_TRAFFIC_VIS6_E03_ACTOR_AVENUE: a car carrying an avenue field (the main-street pair in the cars table) drives that street's centreline fraction; a car without one -- all four shipped entries -- resolves to LIVING_CITY_STREET_Y, the identical y as before this build. The loop below is untouched. */
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
  /* CITY_POLISH_VIS3_E04_CURBS: street dressing -- a
   * uniform curb line on both outer edges of every
   * sidewalk, derived from CITY_STREETS only (the
   * sidewalk a street wears is its rect inflated 26,
   * exactly as the shipped sidewalk render below
   * computes it). The 3-wide line sits on the
   * sidewalk's outer edge: for a vertical street the
   * left line starts at s.x - 26 and the right line
   * ends at s.x + s.w + 26 (its left is s.x + s.w + 23);
   * horizontal streets mirror that. Decoration only --
   * no street, sidewalk or crosswalk rect changes,
   * and the elements carry pointerEvents none like the
   * rest of this layer. The dashed center lines the
   * package asked for already ship (the dashes loop
   * above, centered on every segment), so they stay
   * byte-identical. */
  const curbs = [];
  for (const s of CITY_STREETS) {
    if (s.h > s.w) {
      curbs.push(<View key={'cbL' + s.x} pointerEvents="none" style={[styles.vis3CurbV, { left: s.x - 26, top: s.y - 26, height: s.h + 52 }]} />);
      curbs.push(<View key={'cbR' + s.x} pointerEvents="none" style={[styles.vis3CurbV, { left: s.x + s.w + 23, top: s.y - 26, height: s.h + 52 }]} />);
    } else {
      curbs.push(<View key={'cbT' + s.y} pointerEvents="none" style={[styles.vis3CurbH, { left: s.x - 26, top: s.y - 26, width: s.w + 52 }]} />);
      curbs.push(<View key={'cbB' + s.y} pointerEvents="none" style={[styles.vis3CurbH, { left: s.x - 26, top: s.y + s.h + 23, width: s.w + 52 }]} />);
    }
  }
  /* FULLER_CITY_VIS4_E03_GROUND_ARRAYS: four more
   * static arrays for this layer, all decoration,
   * all pointerEvents none, built once when this
   * memoized layer first renders.
   * SEAMS: paving joints across the sidewalk bands,
   * derived from CITY_STREETS like the VIS3 curbs --
   * a band is the street rect inflated 26, and each
   * seam spans the band MINUS the 3-wide curb line
   * on its outer edge (a vertical street's left band
   * seam runs from s.x - 23 to s.x). Positions step
   * along each street and skip any position inside
   * a crossing street's inflated span, so no seam
   * ever lands on an intersection.
   * WALKWAYS: for every place with an entrance, a
   * 36-wide paving strip centred on the entrance,
   * from the place's front (south) edge through the
   * entrance point to the outer edge of the nearest
   * avenue sidewalk south of it (the avenue rect
   * minus its 26 sidewalk inflation). Where no
   * avenue lies south (the three south-row
   * businesses, whose doors face the open grass),
   * the strip runs 40 past the entrance as a
   * driveway apron. The park, which has no
   * entrance, gets its path at the plaza point
   * (x 250) from its south edge to the same
   * sidewalk edge. Nothing here is read by arrival,
   * routing or the enter logic -- the entrances
   * themselves are untouched.
   * PARKED CARS: the E02 avenue cars, drawn with
   * the shipped CarFigure in a 30-wide wrap centred
   * on each car's point.
   * FLOWER BEDS: the E02 beds -- a soil strip with
   * five flower dots laid across it, dot colours
   * cycling the E02 palette by bed and dot index. */
  const seams = [];
  for (const s of CITY_STREETS) {
    if (s.h > s.w) {
      for (let y = s.y + 74; y < s.y + s.h - 40; y += 185) {
        let inX = false;
        for (const hst of CITY_STREETS) { if (hst.w > hst.h && y >= hst.y - 26 && y <= hst.y + hst.h + 26) inX = true; }
        if (inX) continue;
        seams.push(<View key={'smL' + s.x + '-' + y} pointerEvents="none" style={[styles.vis4SeamH, { left: s.x - 23, top: y - 1 }]} />);
        seams.push(<View key={'smR' + s.x + '-' + y} pointerEvents="none" style={[styles.vis4SeamH, { left: s.x + s.w, top: y - 1 }]} />);
      }
    } else {
      for (let x = s.x + 84; x < s.x + s.w - 50; x += 210) {
        let inX = false;
        for (const vst of CITY_STREETS) { if (vst.h > vst.w && x >= vst.x - 26 && x <= vst.x + vst.w + 26) inX = true; }
        if (inX) continue;
        seams.push(<View key={'smT' + s.y + '-' + x} pointerEvents="none" style={[styles.vis4SeamV, { left: x - 1, top: s.y - 23 }]} />);
        seams.push(<View key={'smB' + s.y + '-' + x} pointerEvents="none" style={[styles.vis4SeamV, { left: x - 1, top: s.y + s.h }]} />);
      }
    }
  }
  const walkways = [];
  for (const p of CITY_PLACES) {
    if (!p.entrance) continue;
    const top = p.rect.y + p.rect.h;
    let target = 0;
    for (const s of CITY_STREETS) {
      if (s.w > s.h && s.y - 26 >= p.entrance.y && (target === 0 || s.y - 26 < target)) target = s.y - 26;
    }
    if (!target) target = p.entrance.y + 40;
    walkways.push(<View key={'walk' + p.id} pointerEvents="none" style={[styles.vis4Walkway, { left: p.entrance.x - 18, top: top, height: target - top }]} />);
  }
  const parkRect = cityPlaceById('park').rect;
  const parkTop = parkRect.y + parkRect.h;
  let parkTarget = 0;
  for (const s of CITY_STREETS) {
    if (s.w > s.h && s.y - 26 >= parkTop && (parkTarget === 0 || s.y - 26 < parkTarget)) parkTarget = s.y - 26;
  }
  walkways.push(<View key={'walkpark'} pointerEvents="none" style={[styles.vis4Walkway, { left: 232, top: parkTop, height: parkTarget - parkTop }]} />);
  const parkedCars = [];
  for (const c of VIS4_PARKED_CARS) {
    parkedCars.push(
      <View key={'parked' + c.x + '-' + c.y} pointerEvents="none" style={[styles.vis4ParkedCar, { left: c.x - 15, top: c.y - 11 }]}>
        <CarFigure body={c.body} />
      </View>
    );
  }
  /* READABILITY_VIS5_E06_STALLS_BUILD: one painted stall
   * per VIS4 parked car, derived from the same table in
   * the same pass -- a bordered ground rect centred on
   * the car's own centre (the car wrapper sits at
   * c.x - 15, c.y - 11 with width 30, so a 46 x 36 stall
   * at c.x - 23, c.y - 18 frames it with a even margin).
   * Decoration only, like the cars themselves: no
   * collision entry, no routing contact (CITY_RECTS and
   * the trip battery are untouched), rendered by E07
   * immediately under the cars. */
  const stalls = VIS4_PARKED_CARS.map((c) => (
    <View key={'stall' + c.x + '-' + c.y} pointerEvents="none" style={[styles.vis5ParkStall, { left: c.x - 23, top: c.y - 18, width: 46, height: 36 }]} />
  ));

  const beds = [];
  VIS4_FLOWER_BEDS.forEach((b, bi) => {
    const bedDots = [];
    for (let i = 0; i < 5; i++) {
      bedDots.push(<View key={'fl' + i} pointerEvents="none" style={[styles.vis4FlowerDot, { left: 5 + i * ((b.w - 12) / 4), top: i % 2 ? 9 : 2, backgroundColor: VIS4_FLOWER_COLORS[(bi + i) % VIS4_FLOWER_COLORS.length] }]} />);
    }
    beds.push(
      <View key={'bed' + bi} pointerEvents="none" style={[styles.vis4BedSoil, { left: b.x, top: b.y, width: b.w, height: b.h }]}>
        {bedDots}
      </View>
    );
  });
  const park = cityPlaceById('park');
  return (
    <View pointerEvents="none" style={styles.cityLayer}>
      <View style={styles.cityGround} />
      <View style={styles.cityEastShade} />
      {/* FULLER_CITY_VIS4_E04_SKYLINE_RENDER: the E02 skyline silhouettes paint first among the ground details -- behind the sidewalks, roads and every building, along the world's north edge (bottoms on y = 50), in two alternating dark shades. Distant blocks the city continues past; decoration only. */}
      {VIS4_SKYLINE.map((b, i) => (
        <View key={'sky' + i} pointerEvents="none" style={[styles.vis4Skyline, { left: b.x, top: 50 - b.h, width: b.w, height: b.h, backgroundColor: i % 2 ? '#0f1622' : '#151e2e' }]} />
      ))}
      {CITY_STREETS.map((s) => (
        <View key={'sw' + s.x + '-' + s.y} style={[styles.citySidewalk, { left: s.x - 26, top: s.y - 26, width: s.w + 52, height: s.h + 52 }]} />
      ))}
      {CITY_STREETS.map((s) => (
        <View key={'rd' + s.x + '-' + s.y} style={[styles.cityRoad, { left: s.x, top: s.y, width: s.w, height: s.h }]} />
      ))}
      {/* CITY_POLISH_VIS3_E05_CURB_RENDER: the curbs paint over the road edge and under the center dashes and crosswalks, so a crosswalk still reads across the curb line at intersections; every later ground element (park, houses, trees, bushes) is untouched. */}
      {curbs}
      {/* FULLER_CITY_VIS4_E05_SEAMS_RENDER: the E03 sidewalk seams paint over the sidewalk bands right after the VIS3 curbs -- they sit on the bands themselves (inset by the curb lines) and never on a road, dash or crosswalk. */}
      {seams}
      {dashes}
      {crossings}
      {/* FULLER_CITY_VIS4_E06_PARKED_RENDER: the E03 parked cars sit on the avenue surfaces after the crossings -- at the curbs, clear of the centreline dashes and every crosswalk. Decoration only: no collision, exactly like the trees. */}
      {stalls}{/* READABILITY_VIS5_E07_STALLS_RENDER: the E06 stall lines paint immediately under the parked cars (E08's style) -- over the road and crossings, under the cars themselves. */}
      {parkedCars}
      <View style={[styles.cityParkLawn, { left: park.rect.x, top: park.rect.y, width: park.rect.w, height: park.rect.h }]}>
        <Image source={BUILDINGS_V1_ART.park} style={styles.cityParkArt} resizeMode="contain" />
      </View>
      {CITY_SCENERY_RECTS.map((r, i) => (
        <React.Fragment key={'house' + i}>
          {/* VISUAL_V1_E04_HOUSES: a soft ground shadow and a lit window grid for each decorative house. */}
          <View pointerEvents="none" style={[vis.houseShadow, { left: r.x + 9, top: r.y + 11, width: r.w, height: r.h }]} />
          {/* CITY_POLISH_VIS3_E03_SCENERY_SPRITE: the same scenery rect now renders the realistic scenery_house sprite in the flat drawing's exact box -- left and top are the rect origin, width and height the rect size, contain-fitted in the CITY3 customer-house pattern (styles.city3CustHouse). RENDER ONLY: CITY_SCENERY_RECTS, CITY3F_PLOT_RECTS and CITY_RECTS are untouched, so the collision footprint and every trip are unchanged; the ground shadow above stays. */}
          <Image source={BUILDINGS_V1_ART.scenery_house} pointerEvents="none" style={[styles.city3CustHouse, { left: r.x, top: r.y, width: r.w, height: r.h }]} resizeMode="contain" />
        </React.Fragment>
      ))}
      {/* CITY_EXPANSION_CITY2_E04_GROUND_RENDER: the CITY2
          tree and bush layer (tables E02) -- drawn Views in
          the ground's own palette (shadow, trunk, canopy,
          highlight), inside this same never-re-rendering
          ground layer and below the buildings layer, so a
          tree can never cover a building or its sign pill.
          pointerEvents none throughout, like every ground
          element here. */}
      {CITY_TREES.map((t, i) => (
        <View key={'tree' + i} pointerEvents="none" style={[styles.city2TreeWrap, { left: t.x - 26, top: t.y - 36 }]}>
          <View style={styles.city2TreeShadow} />
          <View style={styles.city2TreeTrunk} />
          <View style={styles.city2TreeCanopy} />
          <View style={styles.city2TreeCanopyHi} />
        </View>
      ))}
      {CITY_BUSHES.map((b, i) => (
        <View key={'bush' + i} pointerEvents="none" style={[styles.city2Bush, { left: b.x - 15, top: b.y - 10 }]} />
      ))}
      {/* FULLER_CITY_VIS4_E07_PATHS_RENDER: the E03 walkways and flower beds, then the E02 greenery extension in the shipped CITY2 fragments -- all ground decoration under the buildings layer, so a path slips behind any customer house standing at a frontage and no tree or bed can ever cover a building or a sign. */}
      {walkways}
      {beds}
      {VIS4_TREES.map((t, i) => (
        <View key={'tree4' + i} pointerEvents="none" style={[styles.city2TreeWrap, { left: t.x - 26, top: t.y - 36 }]}>
          <View style={styles.city2TreeShadow} />
          <View style={styles.city2TreeTrunk} />
          <View style={styles.city2TreeCanopy} />
          <View style={styles.city2TreeCanopyHi} />
        </View>
      ))}
      {VIS4_BUSHES.map((b, i) => (
        <View key={'bush4' + i} pointerEvents="none" style={[styles.city2Bush, { left: b.x - 15, top: b.y - 10 }]} />
      ))}
    </View>
  );
});

const CityBuildingsStatic = React.memo(function CityBuildingsStatic({ ownedBusinesses, propertiesOwned, dealershipOwned, guideTargetId, onBuildingPress }) { /* TABLET_FIXES_CITY5_E06_SIGN_COMPONENT: dealershipOwned joins the props -- the parent already holds the state and passes it at the render (E09) -- so the DEALERSHIP pill can read its ownership in E07/E08. The memo now also re-renders when ownership flips, which is the point. */
  const park = cityPlaceById('park');
  return (
    <View pointerEvents="box-none" style={styles.cityLayer}>
      {/* VISUAL_CONSISTENCY_CITY3_E04_HOUSES_RENDER: the
          customer houses (table E03, art E02) -- the FIRST
          children of the buildings layer, so every place
          touchable below paints its building and sign pill
          ABOVE them wherever a doorstep spot sits close
          under a main building (the hauling and food spots
          are doorsteps of the Transit / Store / Apartment /
          Food Stand / Casino buildings), and the mission
          pin and chip, rendered by the parent after this
          whole layer, stay above all. pointerEvents none:
          a house is never a tap target -- taps pass through
          to the world exactly as before. Each Image's box
          is the E03 anchor: the spot on its bottom edge. */}
      {CITY3_CUSTOMER_HOUSES.map((h) => (
        <Image key={'custhouse-' + h.id} pointerEvents="none" source={BUILDINGS_V1_ART[h.art]} style={[styles.city3CustHouse, { left: h.x - CITY3_HOUSE_W / 2, top: h.y - h.h, width: CITY3_HOUSE_W, height: h.h }]} resizeMode="contain" />
      ))}
            {/* READABILITY_VIS5_E02_SIGNS_PARK_MOVED: the PARK pill renders in CitySignsStatic now (E04), in the layer above the player marker (E05) -- same styles, same text, same absolute coords, carried verbatim in the new component. Nothing renders at this spot. */}
      {CITY_PLACES.filter((p) => p.kind !== 'zone').map((p) => {
        const owned = cityPlaceOwned(p, ownedBusinesses, propertiesOwned);
        const signOwned = city5SignOwned(p, ownedBusinesses, propertiesOwned, dealershipOwned); /* TABLET_FIXES_CITY5_E07_SIGN_DERIVE: the pill's owned read (E05) -- the same value as the shipped line above for businesses and properties, the dealership's own flag for the dealership, false everywhere else. The shipped 'owned' still drives the tag's words and tag style below; the sim proves the two agree in every state the tag gate can open, so business and property pills render byte-identically. */
        return (
          <TouchableOpacity
            key={p.id}
            activeOpacity={0.85}
            style={[styles.cityBuildingTouch, { left: p.rect.x, top: p.rect.y, width: p.rect.w, height: p.rect.h }]}
            onPress={() => onBuildingPress(p)}
          >
            <View style={styles.cityPad} />
            {/* VISUAL_V1_E05_BUILDING_DEPTH: a soft ground shadow under every building (Lori's PNG art itself is never painted over) and a detailed code-drawn facade where no PNG exists; a soft gold glow sits behind the sign pill. */}
            <View pointerEvents="none" style={[vis.buildingShadow, { left: 10, top: 14, width: p.rect.w - 8, height: Math.round(p.rect.h * 0.78) }]} />
            {p.art ? (
              <Image source={BUILDINGS_V1_ART[p.art]} style={styles.cityBuildingArt} resizeMode="contain" />
            ) : (
              <BuildingFacade place={p} />
            )}
            <View pointerEvents="none" style={vis.signGlow} />
                        {/* READABILITY_VIS5_E03_SIGNS_PLACE_MOVED: this place's sign pill (the citySign/city2SignOwned construction with its CITY2/CITY5 comments) renders in CitySignsStatic now (E04), in the layer above the player marker (E05) -- same styles, same text, same owned-tag gate and words, at the same flow position reproduced by the slot's 76% spacer. The owned/signOwned derivations above stay (the layer computes its own); nothing renders at this spot, and the touchable's remaining in-flow child (the building art) does not move. */}
            {guideTargetId === p.id && <View pointerEvents="none" style={styles.cityGuideRing} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

/* READABILITY_VIS5_E04_SIGNS_COMPONENT: the sign layer.
 * VIS5 lifts every place sign pill out of
 * CityBuildingsStatic (the E02 tombstones there) into
 * this signs-only layer, which the city screen renders
 * AFTER the player marker (E05), so a building name can
 * no longer be painted over by the marker or its YOU
 * tag at an entrance. The layer is a pure re-render of
 * the shipped pills: the same places in the same order,
 * the same citySign / city2SignOwned styles, the same
 * sign text, the same owned-tag gate and words. Each
 * pill sits in a slot mirroring its building
 * touchable's own layout -- absolute at the place rect
 * with alignItems center (vis5SignSlot, E09) and a 76%
 * spacer standing in for the building art's height --
 * which is the pill's shipped flow position inside the
 * touchable (citySign's own marginTop 4 included), so
 * every pill lands on exactly its shipped pixels. The
 * PARK pill keeps its shipped absolute coords verbatim.
 * pointerEvents none throughout: taps fall through to
 * the building touchables below, the same presses the
 * shipped in-touchable pills received. Memoized on the
 * same three ownership props the buildings layer
 * takes, so it repaints exactly when that layer would. */
const CitySignsStatic = React.memo(function CitySignsStatic({ ownedBusinesses, propertiesOwned, dealershipOwned }) {
  const park = cityPlaceById('park');
  return (
    <View pointerEvents="none" style={styles.cityLayer}>
      <View pointerEvents="none" style={[styles.citySign, { position: 'absolute', left: park.rect.x + park.rect.w / 2 - 42, top: park.rect.y + park.rect.h - 36 }]}>
        <Text style={styles.citySignText}>PARK</Text>
      </View>
      {CITY_PLACES.filter((p) => p.kind !== 'zone').map((p) => {
        const owned = cityPlaceOwned(p, ownedBusinesses, propertiesOwned);
        const signOwned = city5SignOwned(p, ownedBusinesses, propertiesOwned, dealershipOwned);
        return (
          <View key={p.id} pointerEvents="none" style={[styles.vis5SignSlot, { left: p.rect.x, top: p.rect.y, width: p.rect.w, height: p.rect.h }]}>
            <View pointerEvents="none" style={{ height: '76%' }} />
            <View style={signOwned ? [styles.citySign, styles.city2SignOwned] : styles.citySign}>
              <Text style={styles.citySignText}>{p.sign}</Text>
              {(p.kind === 'business' || p.kind === 'property' || (p.id === 'dealership' && signOwned)) && (
                <Text style={owned ? styles.cityOwnedTag : styles.cityNotOwnedTag}>{owned ? '✓ OWNED' : 'NOT OWNED'}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
});

/* CITY_NAVIGATION_V1_E03_ENTRANCES: a permanent gold
 * doorstep with a door glyph at every place's entrance
 * point, so the walk-up spot is visible long before the
 * player is in ENTER range. Entrances never move, so the
 * layer is memoized like the other static world layers and
 * never re-renders per tick; pointerEvents none throughout
 * -- it is a signpost, never a tap target. */
const CityEntrancesStatic = React.memo(function CityEntrancesStatic() {
  return (
    <View pointerEvents="none" style={styles.cityLayer}>
      {CITY_PLACES.filter((p) => p.entrance).map((p) => (
        <View key={p.id} style={[styles.cityEntranceMark, { left: p.entrance.x - 23, top: p.entrance.y - 27 }]}>
          <Text style={styles.cityEntranceGlyph}>🚪</Text>
          <View style={styles.cityEntranceStep} />
        </View>
      ))}
    </View>
  );
});

/* VISUAL_V1_E03A_LIGHTS_LAYER: street lights for the night
 * city -- a pole, a bright lamp head and two concentric
 * translucent gold glow circles at deterministic intervals
 * along both street bands (on the sidewalk edges). Same
 * pattern as CityEntrancesStatic: React.memo, no props,
 * pointerEvents none, rendered once and never re-rendered
 * by the movement tick. 26 lamps x 4 views, all static. */
const CityLightsStatic = React.memo(function CityLightsStatic() {
  const lamps = [];
  const addLamp = (x, y) => {
    lamps.push(
      <View key={'lamp' + x + '-' + y} pointerEvents="none" style={[vis.lampWrap, { left: x - 27, top: y - 30 }]}>
        <View style={vis.lampGlowOuter} />
        <View style={vis.lampGlowInner} />
        <View style={vis.lampHead} />
        <View style={vis.lampPole} />
      </View>
    );
  };
  for (const s of CITY_STREETS) {
    if (s.w > s.h) {
      for (let x = s.x + 170; x < s.x + s.w - 60; x += 300) addLamp(x, s.y - 8);
    } else {
      for (let y = s.y + 190; y < s.y + s.h - 60; y += 300) addLamp(s.x - 8, y);
    }
  }
  return (
    <View pointerEvents="none" style={styles.cityLayer}>
      {lamps}
    </View>
  );
});

/* FULLER_CITY_VIS4_E13_GLOW_COMPONENT: evening lamp
 * pools -- a soft warm pool of light on the ground
 * under every street lamp, at the same deterministic
 * positions CityLightsStatic (E03A above) derives
 * from CITY_STREETS, shown only while the day/night
 * tint is in its evening range. The parent passes
 * the tint's own opacity (mapTintForHour: 0 by day,
 * 0.10 at dusk, 0.28 at night) as the single prop
 * glow; at 0 this layer renders nothing at all. The
 * layer opacity scales with the tint (glow times 3,
 * capped at 0.85) over the fixed translucent fill,
 * so dusk glows faintly and night glows fully.
 * React.memo on one primitive prop: the layer
 * re-renders only when the tint band changes (a few
 * times per in-game day), never on the movement
 * tick. Decoration only -- pointerEvents none, no
 * state, nothing persisted. */
const CityLampGlowStatic = React.memo(function CityLampGlowStatic({ glow }) {
  if (!glow || glow <= 0) return null;
  const pools = [];
  const addPool = (x, y) => {
    pools.push(<View key={'pool' + x + '-' + y} pointerEvents="none" style={[styles.vis4LampPool, { left: x - 60, top: y - 9 }]} />);
  };
  for (const s of CITY_STREETS) {
    if (s.w > s.h) {
      for (let x = s.x + 170; x < s.x + s.w - 60; x += 300) addPool(x, s.y - 8);
    } else {
      for (let y = s.y + 190; y < s.y + s.h - 60; y += 300) addPool(s.x - 8, y);
    }
  }
  return (
    <View pointerEvents="none" style={[styles.cityLayer, { opacity: Math.min(0.85, glow * 3) }]}>
      {pools}
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
  /* DEALERSHIP_OWNERSHIP_DEAL1_E06_STATE: dealership
   * ownership (persisted with the save). Starts from
   * the load-normalized fields. The confirm flag and
   * the message are transient UI state, never saved --
   * reopening the app lands back on the ownership
   * section's main view. Declared here, with the HARLEY
   * block, so the persist effect, the daily sale effect
   * and the DEALERSHIP screen below all read state that
   * is already declared (the declaration-order rule).
   * The pending ref blocks a same-frame double-tap on
   * CONFIRM BUY or COLLECT EARNINGS from charging or
   * paying twice before React commits; it re-arms when
   * the balances it moves change. Its deps are [cash,
   * dealershipOwned, dealershipProfit] -- all declared
   * above this block. savings is deliberately NOT a
   * dep: it is declared further down the component, a
   * dep array is evaluated during render (that is the
   * furniture TDZ crash), and the buy path re-arms
   * through dealershipOwned anyway. */
  const [dealershipOwned, setDealershipOwned] = useState(initialSave.dealershipOwned === true);
  const [dealershipProfit, setDealershipProfit] = useState(Number.isFinite(initialSave.dealershipProfit) && initialSave.dealershipProfit >= 0 ? initialSave.dealershipProfit : 0);
  const [dealershipSales, setDealershipSales] = useState(Number.isInteger(initialSave.dealershipSales) && initialSave.dealershipSales >= 0 ? initialSave.dealershipSales : 0);
  const [dealershipLastSale, setDealershipLastSale] = useState(() => normalizeDealershipLastSale(initialSave.dealershipLastSale));
  const [dealershipHistory, setDealershipHistory] = useState(() => normalizeDealershipHistory(initialSave.dealershipHistory)); /* BUSINESS_HEADQUARTERS_HQ1_E05_STATE: the recorded customer sales, oldest first; the Dealership screen renders them newest-first. */
  const [lastDealershipSaleDay, setLastDealershipSaleDay] = useState(Number.isInteger(initialSave.lastDealershipSaleDay) ? initialSave.lastDealershipSaleDay : -1);
  const [maeLastRound, setMaeLastRound] = useState(() => normalizeMaeLastRound(initialSave.maeLastRound)); /* MAES_PLACE_MAE1_E15_STATE: the most recent Mae's Place customer round (E06/E07), declared inside the dealership block -- above buyBusiness (its purchase stamp, E16), the daily round effect (E19), restartGame (E20) and the MANAGE_BIZ summary (E22) that use it, in this block's declaration-order discipline. The loader already normalized and migrated the record (E08); the normalizer here is the shipped double-normalization shape (the PROP1 listing states). */
  /* DEALERSHIP_EXPANSION_DX1_E06_STATE: the expansion
   * state, declared inside the dealership block so
   * every reader below -- the pending re-arm effect,
   * the sale effect, the upgrade handler, the screens
   * -- sees state that is already declared (the
   * declaration-order rule). The level starts from the
   * load-normalized field (only an explicit 2 is level
   * 2). Lifetime profit starts from the loader's
   * seeded total; a fresh game stored null and starts
   * at 0. The notice is the waiting sale message HOME
   * shows (null = none). The showroom confirm flag is
   * transient UI state, never saved. */
  const [dealershipLevel, setDealershipLevel] = useState(initialSave.dealershipLevel === 2 ? 2 : 1);
  const [dealershipLifetimeProfit, setDealershipLifetimeProfit] = useState(Number.isFinite(initialSave.dealershipLifetimeProfit) && initialSave.dealershipLifetimeProfit >= 0 ? initialSave.dealershipLifetimeProfit : 0);
  const [dealershipNotice, setDealershipNotice] = useState(typeof initialSave.dealershipNotice === 'string' && initialSave.dealershipNotice !== '' ? initialSave.dealershipNotice : null);
  const [showroomConfirm, setShowroomConfirm] = useState(false);
  const [dealershipConfirm, setDealershipConfirm] = useState(false);
  const [dealershipMessage, setDealershipMessage] = useState('');
  const dealershipPending = useRef(false);
  React.useEffect(() => { dealershipPending.current = false; }, [cash, dealershipOwned, dealershipProfit, dealershipLevel]); /* DEALERSHIP_EXPANSION_DX1_E07_PENDING_DEPS: dealershipLevel joins the re-arm deps -- the showroom upgrade spends from savings (not a dep: it is declared further down, and a dep array is evaluated during render) and changes neither cash nor profit, so without the level the pending ref the upgrade sets would never re-arm and the collect buttons would stay blocked. dealershipLevel is declared directly above this effect, so the dep is safe. */

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

  /* DEALERSHIP_OWNERSHIP_DEAL1_E07_HANDLERS: buy the
   * dealership with savings, mirroring buyBusiness /
   * buyBusinessUpgrade. The pure gate returns absolute
   * savings, so confirming twice in one batch charges
   * exactly once, and once owned the gate keeps every
   * later call a no-op. The confirm step always closes.
   * Buying also stamps the sale latch with TODAY: the
   * first customer sale lands on the next in-game day,
   * never on the day the dealership changes hands.
   * Cash, bikes and every other balance are untouched. */
  const buyDealership = () => {
    if (dealershipPending.current) return;
    const result = purchaseDealership(savings, dealershipOwned);
    setDealershipMessage(result.message);
    setDealershipConfirm(false);
    if (!result.ok) return;
    dealershipPending.current = true;
    setSavings(result.savings);
    setDealershipOwned(true);
    setLastDealershipSaleDay(day);
    /* Record-only, success path only: the amount is the
     * exact price the gate just deducted from savings,
     * logged like every other savings purchase. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: 'Harley Dealership', amount: savings - result.savings, balance: 'savings' }));
  };

  /* BUSINESS_HEADQUARTERS_HQ1_E10_COLLECT_POINTER: the
   * collect handlers moved below the savings-peak state
   * (collectDealershipProfitTo, just above the persist
   * effect): the deposit-to-savings branch reads
   * setSavingsPeak, which is declared further down, and a
   * handler may only reference state declared above it.
   * The DEAL1 cash collect lives on there, behavior
   * unchanged, beside its new savings sibling. */

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
    /* MAES_PLACE_MAE1_E16_BUY_STAMP: buying Mae's Place stamps
     * the customer-round latch with TODAY -- the buyDealership
     * shape (E19): the first customers come tomorrow, never on
     * the day the restaurant changes hands. The stamp is the
     * zero record: a latch, not a round, and it pays nothing.
     * Every other business leaves the record alone. */
    if (businessId === 'foodstand') setMaeLastRound({ day: day, chicken: 0, ribs: 0, total: 0 });
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
    setFurnitureJustBought(true); /* CITY_NAVIGATION_V1_E10_BOUGHT_SET: success path only -- the gate has already returned ok above. */
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
    const pay = businessPay(biz, businessUpgrades, businessUpgrades2); /* CLEANING_HAULING_EXPANSION_CHX1_E13_JOB_PAY: the interior award reads the tier-aware pay, like every other site. */
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
    /* CLEANING_HAULING_EXPANSION_CHX1_E13_WAITING_AWARD: a
     * cleaning or hauling job no longer pays cash on the
     * spot -- its pay joins that business's waiting pool
     * (collected later, E12) and its all-time completed-jobs
     * counter rises, in the same firing as every other
     * completion effect below. The Food Stand keeps the
     * shipped instant-cash award, untouched. */
    const jobWaits = bizHasWaitingPool(businessId);
    if (jobWaits) {
      setBizWaiting((prev) => addBizWaiting(prev, businessId, pay));
      setBizJobsDone((prev) => addBizJobDone(prev, businessId));
    } else {
      setCash((c) => c + pay);
    }
    setBizLifetimeEarnings((prev) => addBizLifetimeEarning(prev, businessId, pay)); /* BUSINESS_MANAGEMENT_BM1_E08_JOB_INCREMENT: bookkeeping in the same firing as the cash award -- this job just paid `pay`, so its business's lifetime total rises by exactly that pay, once (upgraded pay counts at the upgraded amount, because `pay` here is the effective businessPay). No other line of this handler changes. */
    recordEarning(pay); /* DAILY_LIMIT_V1_BIZ_RECORD */
    setHours((h) => h + biz.jobHours);
    setBizWork((prev) => ({ ...prev, [businessId]: { day, count: doneToday + 1 } }));
    if (jobWaits) {
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' job +$' + pay + ' — waiting to collect', amount: pay, balance: 'waiting' })); /* CLEANING_HAULING_EXPANSION_CHX1_E13_WAITING_HISTORY: the interior path gains the same waiting entry the city path writes (E15), so every waiting dollar has a paper trail. */
      setBizMessage('Job complete! ' + biz.name + ' paid $' + pay + ' — waiting to collect. See it in My Businesses.');
    } else {
      setBizMessage('Job complete! ' + biz.name + ' paid $' + pay + '.');
    }
  };

  /* CHAPTER3_INV_V1: buy/sell investments + buy property (agreed rules,
   * Oct 31). Bond $500, pays $10 cash every Friday, sells back for the
   * full $500. Fund $1,000, value win/win/lose, sells for its current
   * value; the cycle persists across selling and rebuying. Properties
   * are bought from savings, credit-gated; SELL_PROPERTIES_V1_E02_COMMENT:
   * a property could once be sold back at its full buy price, paid to
   * cash; PROPERTY_LISTINGS_PROP1_E16A_COMMENT: since PROP1 a property
   * is sold by listing it (at its buy price, +10% or +20%) and accepting
   * a buyer offer, paid into savings (the handlers below). */
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
  /* NEIGHBORHOOD_FUND_NFUND1_E07_HANDLERS: the fund's buy
   * and sell, mirroring buyFund / sellFund above line for
   * line. Buys come OUT OF SAVINGS, gated on savings >=
   * the amount with the shipped 'Not enough saved'
   * message shape; a buy the player cannot reach (an
   * amount off the table, or no business owned -- the
   * fund's unlock) changes nothing. The first buy stamps
   * the growth anchor with TODAY; a later buy only adds
   * to the balance and never moves the anchor or the
   * latch. The sell pays the ENTIRE balance INTO CASH,
   * exactly like sellFund, and resets the record to
   * empty, so a rebuy starts a fresh 5-day clock. Both
   * run behind the nfundPending exactly-once gate (E06),
   * and neither writes Money History nor touches
   * earnedToday: like the bond and fund beside them,
   * buys and sells are transfers, not earnings. */
  const buyNeighborhoodFund = (amount) => {
    if (nfundPending.current) return;
    if (!NFUND_AMOUNTS.includes(amount)) return;
    if (ownedBusinesses.length === 0) {
      setInvestMessage('The Neighborhood Fund unlocks when you own a business.');
      return;
    }
    if (savings < amount) {
      setInvestMessage('Not enough saved. The Neighborhood Fund needs $' + amount + ' in savings.');
      return;
    }
    nfundPending.current = true;
    setSavings((s) => s - amount);
    setNeighborhoodFund((prev) => (prev && prev.balance > 0
      ? { balance: prev.balance + amount, startDay: prev.startDay, lastGrowthDay: prev.lastGrowthDay }
      : { balance: amount, startDay: day, lastGrowthDay: -1 }));
    setInvestMessage('You put $' + amount + ' into the Neighborhood Fund. It grows 5% every 5 days.');
  };
  const sellNeighborhoodFund = () => {
    if (nfundPending.current) return;
    if (!neighborhoodFund || neighborhoodFund.balance <= 0) return;
    nfundPending.current = true;
    const payout = neighborhoodFund.balance;
    setCash((c) => c + payout);
    setNeighborhoodFund({ balance: 0, startDay: -1, lastGrowthDay: -1 });
    setInvestMessage('You sold the Neighborhood Fund for $' + payout + '.');
  };
  const buyProperty = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || investPending.current || propertiesOwned.includes(prop.id)) return;
    /* PROPERTY_LISTINGS_PROP1_E12_BUY_GUARD: the rebuy
     * cooldown a sale stamps (E11 accept): while the day is
     * before this property's cooldown day, the buy is blocked
     * with the wait spelled out (the card shows the same
     * wait, E15). Price and credit requirement are unchanged,
     * and buying resumes on the cooldown day itself. This is
     * what stops a list-high / sell / rebuy-cheap loop from
     * printing money. */
    const rebuyUntilDay = propertyRebuyUntil[prop.id];
    if (Number.isInteger(rebuyUntilDay) && day < rebuyUntilDay) {
      setPropertyMessage('The ' + prop.name + ' just sold. It is back on the market in ' + (rebuyUntilDay - day) + ((rebuyUntilDay - day) === 1 ? ' day' : ' days') + '.');
      return;
    }
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
     * guard in this handler changes.
     * PROPERTY_LISTINGS_PROP1_E16B_NOTE: two PROP1 changes
     * postdate this note -- the rebuy-cooldown guard above
     * (E12), and the listing accept handler that replaced
     * the v1 sale below DOES log its sale (kind
     * 'property_sale', E02/E11), by the approved design. */
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: prop.name, amount: prop.price, balance: 'savings' }));
  };
  /* PROPERTY_LISTINGS_PROP1_E11_HANDLERS: selling a property
   * is a listing now. The instant sell this replaces (full buy
   * price back to cash, confirmed in one tap) is GONE -- no
   * handler, no button, no cash path. LIST stores the listing
   * on the persisted record (E03): the ask is one of the three
   * approved prices (the PROPERTIES buy price, +10%, +20%),
   * and the first offer falls due 1 to 3 days later, drawn
   * here. The offer itself is generated by the day-watching
   * effect (E13) and stored on the same record, never
   * re-rolled. All four handlers share the shipped
   * exactly-once gate shape (investPending / bizCollectPending):
   * propListingPending (E10) is set synchronously before any
   * state update, so a double-tap in one frame cannot run a
   * handler twice, and the record / ownership checks keep
   * every later call a no-op. */
  const listProperty = (propertyId, ask) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || propListingPending.current || !propertiesOwned.includes(prop.id)) return;
    if (propertyListings[prop.id]) return;
    const asks = [prop.price, Math.round(prop.price * 1.1), Math.round(prop.price * 1.2)];
    if (!asks.includes(ask)) return;
    propListingPending.current = true;
    const offerDueDay = day + 1 + Math.floor(Math.random() * 3);
    setPropertyListings((prev) => ({ ...prev, [prop.id]: { ask: ask, listDay: day, offerDueDay: offerDueDay, offer: null } }));
    setPropertyMessage('You listed the ' + prop.name + ' at $' + ask + '. A buyer offer should arrive within 1 to 3 days. Rent still pays every Friday while it is listed.');
  };
  /* PROPERTY_LISTINGS_PROP1_E11_ACCEPT: accepting pays the
   * stored offer into SAVINGS exactly once -- the pending ref
   * covers a double-tap in the same frame, and clearing the
   * listing and the ownership in the same batch makes every
   * later call a no-op. Credit-neutral: the savings peak
   * rises in the same batch (the shipped collect-to-savings
   * pattern), so the savings-peak effect grants no credit
   * for the sale. It never calls recordEarning: sale proceeds
   * stay exempt from the $1,500 daily earnings limit, like
   * the old sell. Clearing ownership is what stops the rent
   * -- the Friday routine reads propertiesOwned -- and rent
   * it already paid that Friday is never clawed back (this
   * handler never touches cash). The sale also stamps the
   * rebuy cooldown (E12): this property cannot be bought
   * again until day + 7, which is what stops a list-high /
   * sell / rebuy-cheap profit loop. Exactly one Money
   * History entry (kind 'property_sale', E02). No fee. */
  const acceptPropertyOffer = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || propListingPending.current || !propertiesOwned.includes(prop.id)) return;
    const listing = propertyListings[prop.id];
    if (!listing || !Number.isInteger(listing.offer)) return;
    propListingPending.current = true;
    const offer = listing.offer;
    setSavings((s) => s + offer);
    setSavingsPeak((p) => Math.max(p, savings + offer));
    setPropertiesOwned((prev) => prev.filter((id) => id !== prop.id));
    setPropertyListings((prev) => ({ ...prev, [prop.id]: null }));
    setPropertyRebuyUntil((prev) => ({ ...prev, [prop.id]: day + 7 }));
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'property_sale', label: prop.name + ' sale', amount: offer, balance: 'savings' }));
    setPropertyOfferConfirm(null);
    setPropertyMessage('You sold the ' + prop.name + ' for $' + offer + '. The money is in your savings.');
  };
  /* PROPERTY_LISTINGS_PROP1_E11_REJECT: the listing stays
   * up at the same ask; only the offer clears and a new due
   * day is drawn 1 to 3 days out. The effect (E13) brings
   * the next offer when that day arrives. */
  const rejectPropertyOffer = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || propListingPending.current || !propertiesOwned.includes(prop.id)) return;
    const listing = propertyListings[prop.id];
    if (!listing || !Number.isInteger(listing.offer)) return;
    propListingPending.current = true;
    const turnedDown = listing.offer;
    const nextDueDay = day + 1 + Math.floor(Math.random() * 3);
    setPropertyListings((prev) => {
      const current = prev[prop.id];
      if (!current) return prev;
      return { ...prev, [prop.id]: { ask: current.ask, listDay: current.listDay, offerDueDay: nextDueDay, offer: null } };
    });
    setPropertyMessage('You turned down the $' + turnedDown + ' offer for the ' + prop.name + '. It stays listed at $' + listing.ask + ' \u2014 a new offer should arrive within 1 to 3 days.');
  };
  /* PROPERTY_LISTINGS_PROP1_E11_CANCEL: the listing ends,
   * any waiting offer goes with it, and the property stays
   * owned (rent untouched). */
  const cancelPropertyListing = (propertyId) => {
    const prop = PROPERTIES.find((entry) => entry.id === propertyId);
    if (!prop || propListingPending.current || !propertiesOwned.includes(prop.id)) return;
    if (!propertyListings[prop.id]) return;
    propListingPending.current = true;
    setPropertyListings((prev) => ({ ...prev, [prop.id]: null }));
    setPropertyOfferConfirm(null);
    setPropertyMessage('You took the ' + prop.name + ' off the market. You still own it.');
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
  /* PLAYABLE_TRANSIT_V1_E03_STATE: the playable bus drive.
   * TRANSIENT ONLY -- busDrive is never added to SKY_INITIAL,
   * the loader, the persist object or restart, so the save
   * format is byte-identical to base and closing the app
   * mid-drive simply loses the drive (no reward, day not
   * consumed). busDriveRef mirrors the state for the 33 ms
   * tick; busInputRef holds the hold-to-press pedal/steering
   * state. Declared HERE, with the other transit state, so
   * every effect/handler/render below reads declarations that
   * sit ABOVE it (declaration-order rule). */
  const [busDrive, setBusDrive] = useState(null);
  const busDriveRef = useRef(null);
  const busInputRef = useRef({ left: false, right: false, gas: false, brake: false });
  const setBusDriveBoth = (next) => { busDriveRef.current = next; setBusDrive(next); };
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
  /* CLEANING_HAULING_EXPANSION_CHX1_E08_STATE: owned tier-2
   * upgrades (persisted with the save, mirroring
   * businessUpgrades) and the tier-2 confirmation step
   * (transient, never saved). */
  const [businessUpgrades2, setBusinessUpgrades2] = useState(() => normalizeBusinessUpgrades2(initialSave.businessUpgrades2));
  const [bizUpgrade2Confirm, setBizUpgrade2Confirm] = useState(null);
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
  /* CITY_NAVIGATION_V1_E09_BOUGHT_FLAG: set ONLY by a
   * successful buyFurniture; while true the Furniture Shop
   * offers its GO TO MY HOME shortcut. Transient UI state --
   * never saved, like the other shop transients above. */
  const [furnitureJustBought, setFurnitureJustBought] = useState(false);
  /* MY_HOME_INTERIOR_V1_E06_NOW: the layout in force. Null
   * happens only right after a restart (fresh game, not yet
   * re-housed), where the defaults re-derive on the fly. */
  const homeLayoutNow = homeLayout || defaultHomeLayout(placedDecorations, ownedDecorations, ownedFurniture); /* FURNITURE_STORE_V1_E07C_NOW */
  /* COIN_SHOP_V1: the worn outfit's colors, read by both player
   * figure sites (the city map and the warehouse scene). */
  const wornOutfitDef = outfitById(wornOutfit);
  const [hours, setHours] = useState(Number.isFinite(initialSave.hours) ? initialSave.hours : 8);
  const [bizWork, setBizWork] = useState(() => normalizeBizWork(initialSave.bizWork));
  /* BUSINESS_MANAGEMENT_BM1_E05_STATE: the per-business
   * lifetime job earnings, initialized through the same
   * normalizer the loader ran, so a stored total is
   * kept whole and an absent one starts at zero. Read
   * at render by the MY BUSINESSES earnings report;
   * written only by the two job-payment increments and
   * the restart reset. */
  const [bizLifetimeEarnings, setBizLifetimeEarnings] = useState(() => normalizeBizLifetimeEarnings(initialSave.bizLifetimeEarnings));
  /* CITY_BUSINESS_JOBS_CBJ1_E15_STATE: the Business Job
   * History, initialized through the same normalizer
   * the loader ran. Read at render by the MY BUSINESSES
   * history panel (E22); written only by the mission
   * completion append (E18) and the restart reset (E19). */
  const [bizJobHistory, setBizJobHistory] = useState(() => normalizeBizJobHistory(initialSave.bizJobHistory));
  /* CLEANING_HAULING_EXPANSION_CHX1_E09_STATE: the waiting
   * profit pool and the all-time completed-jobs counter
   * (both persisted with the save), initialized through the
   * same normalizers the loader ran, so a stored pool is
   * kept whole and the counter keeps its seeded counts.
   * Written only by the two completion paths (E13/E15),
   * the collect handlers (E12) and the restart reset. */
  const [bizWaiting, setBizWaiting] = useState(() => normalizeBizWaiting(initialSave.bizWaiting));
  const [bizJobsDone, setBizJobsDone] = useState(() => normalizeBizJobsDone(initialSave.bizJobsDone, initialSave.bizJobHistory));
  /* BUSINESS_EXPANSION_BIZX1_E05_STATE: the selected work
   * vehicle (E02), persisted with the save and normalized
   * against ownership exactly as the loader left it.
   * Written only by the management screens' vehicle buttons
   * (E16) and the restart reset. While it is set, the city
   * marker shows the vehicle's glyph and the movement tick
   * runs at ride speed (E09) -- the vehicle outranks the
   * ridden bike, which keeps its own state untouched. */
  const [selectedWorkVehicle, setSelectedWorkVehicle] = useState(() => normalizeSelectedWorkVehicle(initialSave.selectedWorkVehicle, initialSave.ownedBusinesses));
  const bizCollectPending = useRef(false);
  const [businessUnlocked, setBusinessUnlocked] = useState(initialSave.businessUnlocked === true);
  const [bizMessage, setBizMessage] = useState('');
  const bizJobPending = useRef(false);
  React.useEffect(() => { bizJobPending.current = false; }, [cash, bizWork]);
  React.useEffect(() => { bizCollectPending.current = false; }, [bizWaiting]); /* CLEANING_HAULING_EXPANSION_CHX1_E09_COLLECT_REARM: the collect pending ref re-arms whenever the pool changes (a collect zeroing it included); bizWaiting is declared above this effect, so the dep is safe. */
  /* CHAPTER3_INV_V1: investments + real estate state. The savings peak
   * only ever rises; the fund cycle persists across selling and
   * rebuying (never reset); lastInvestPayday latches each Friday. */
  const [savingsPeak, setSavingsPeak] = useState(Number.isFinite(initialSave.savingsPeak) && initialSave.savingsPeak >= 0 ? initialSave.savingsPeak : 0);
  const [bondOwned, setBondOwned] = useState(initialSave.bondOwned === true);
  const [fundOwned, setFundOwned] = useState(initialSave.fundOwned === true);
  const [fundValue, setFundValue] = useState(Number.isFinite(initialSave.fundValue) && initialSave.fundValue >= 0 ? initialSave.fundValue : FUND_START_VALUE);
  const [fundCycle, setFundCycle] = useState(Number.isInteger(initialSave.fundCycle) && initialSave.fundCycle >= 0 && initialSave.fundCycle <= 2 ? initialSave.fundCycle : 0);
  const [propertiesOwned, setPropertiesOwned] = useState(() => normalizeProperties(initialSave.propertiesOwned));
  const [propertyListings, setPropertyListings] = useState(() => normalizePropertyListings(initialSave.propertyListings)); /* PROPERTY_LISTINGS_PROP1_E05_STATE: the per-property listing records (E03/E04/E09), declared beside propertiesOwned and far above the listing handlers (E11), the offer effect (E13), the persist effect (E06/E07), restartGame (E08) and the HOME cards (E15) that use them. */
  const [propertyRebuyUntil, setPropertyRebuyUntil] = useState(() => normalizePropertyRebuyUntil(initialSave.propertyRebuyUntil)); /* the per-property rebuy cooldown days (E03/E04/E09); -1 = no cooldown running. */
  const [lastInvestPayday, setLastInvestPayday] = useState(Number.isInteger(initialSave.lastInvestPayday) ? initialSave.lastInvestPayday : -1);
  const [lastInterestDay, setLastInterestDay] = useState(Number.isInteger(initialSave.lastInterestDay) ? initialSave.lastInterestDay : -1); /* BANK_INTEREST_INT1_E05_STATE: the Friday bank-interest latch state (E03/E04), declared beside its sibling lastInvestPayday and far above the Friday interest routine (E09), the persist effect (E06/E07) and restartGame (E08) that use it. */
  const [neighborhoodFund, setNeighborhoodFund] = useState(() => normalizeNeighborhoodFund(initialSave.neighborhoodFund)); /* NEIGHBORHOOD_FUND_NFUND1_E05_STATE: the Neighborhood Fund record (E01/E03/E04), declared beside its investment siblings and far above the growth effect (E09), the persist effect (E10/E11) and restartGame (E12) that use it; the fund handlers (E07) sit with buyBond/buyFund above, in the shipped shape. The loader already normalized the record (E04); the normalizer here is the shipped double-normalization shape (the PROP1 listing states, MAE1 E15). */
  const [investmentsUnlocked, setInvestmentsUnlocked] = useState(initialSave.investmentsUnlocked === true);
  const [showArrows, setShowArrows] = useState(initialSave.showArrows !== false); /* SKY_CITY_TRAVEL_V1_E04_STATE: persisted Settings toggle for the city D-pad (S); defaults true (shown) on every save that predates it. */
  const [investMessage, setInvestMessage] = useState('');
  const [propertyMessage, setPropertyMessage] = useState('');
  /* PROPERTY_LISTINGS_PROP1_E10_STATE: the listing flow's
   * transient UI state, never saved -- which property (if
   * any) is showing its three asking prices, and which is
   * showing its accept confirmation. The instant sell's
   * confirm state is gone with the flow it served.
   * propListingPending is the listing handlers' exactly-once
   * gate, in the shipped pending-ref shape (investPending,
   * bizCollectPending): set synchronously before any state
   * update, re-armed by the effect below whenever one of the
   * states the handlers settle changes. Declared here, below
   * the listing records it guards (E05). */
  const [propertyListingPick, setPropertyListingPick] = useState(null);
  const [propertyOfferConfirm, setPropertyOfferConfirm] = useState(null);
  const propListingPending = useRef(false);
  React.useEffect(() => { propListingPending.current = false; }, [savings, propertiesOwned, propertyListings, propertyRebuyUntil]);
  const investPending = useRef(false);
  React.useEffect(() => { investPending.current = false; }, [cash, savings, bondOwned, fundOwned, fundValue, propertiesOwned]);
  /* NEIGHBORHOOD_FUND_NFUND1_E06_GATE: the fund handlers'
   * exactly-once gate, in the shipped pending-ref shape
   * (investPending just above, propListingPending): set
   * synchronously before any state update, re-armed by
   * the effect below whenever savings or the fund record
   * settles -- both declared above this effect. The fund
   * gets its own ref rather than sharing investPending:
   * its buys are repeatable, so the gate must re-arm on
   * the fund record itself, not only on the one-shot
   * ownership flags investPending watches. */
  const nfundPending = useRef(false);
  React.useEffect(() => { nfundPending.current = false; }, [savings, neighborhoodFund]);
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
  /* GARAGE_RIDING_RID1_E03_HANDLER: RIDE THIS BIKE, from
   * MY GARAGE -- pick an owned bike there and land on
   * the city already riding it. The ownership guard
   * mirrors the garage DISPLAY handler's guard. The
   * three writes are ones shipped code already makes:
   * the display pick (the DISPLAY button's write), the
   * mount (the city toggle's write), and the exit to
   * the free-roam city (the garage's own BACK TO CITY
   * write). Setting the pick and the mount to the same
   * bike keeps the city toggle's invariant: its bike
   * segment names the effective display pick -- this
   * bike -- and its lit segment reads the mount -- also
   * this bike. Selection and exit only: no balance is
   * read or written, nothing is bought or sold. Placed
   * here, after every state it touches (the owned list,
   * the display pick, the place and the mount are all
   * declared above), per the declaration-order rule. */
  const rideThisBike = (bikeId) => {
    if (!ownedBikes.includes(bikeId)) return;
    setDisplayBike(bikeId);
    setRidingBike(bikeId);
    setPlace(null);
  };
  const cityPosRef = useRef(cityPos);
  const cityDirRef = useRef({ x: 0, y: 0 });
  const cityWalkTargetRef = useRef(null);
  const [cityWalkTarget, setCityWalkTarget] = useState(null);
  /* NAVIGATION_EASE_V1_1_FIX_F02_STATE: the tap-walk route
   * state stepCityWalk reads and the tick writes back: the
   * remaining waypoint queue of a building trip (the road
   * route, F01) plus the stall watchdog's progress anchor,
   * tick count and rebuilt flag. TRANSIENT map UI in a ref
   * beside cityWalkTargetRef; never saved -- SKY_INITIAL,
   * the loader and the persist list are untouched.
   * cityWalkTo resets it whole (F03), so any walk started
   * outside cityWalkRoute (free taps, restarts, drive
   * clears) can never inherit a stale queue: the tick only
   * consumes the queue alongside a target, and every target
   * is set by cityWalkTo / cityWalkRoute. */
  const cityWalkRouteRef = useRef({ queue: [], stallX: 0, stallY: 0, stallTicks: 0, rebuilt: false });
  const [guideTargetId, setGuideTargetId] = useState(null);
  const [findOpen, setFindOpen] = useState(false);
  const [reportDraft, setReportDraft] = useState(''); /* FRIENDS_EARLY_ACCESS_EA1_E03_STATE: the REPORT A PROBLEM draft and the two help screens' return targets. TRANSIENT UI only -- none of the three is written to the save. reportDraft holds the player's own words for one report; helpReturn / reportReturn remember which screen opened HOW TO PLAY / REPORT A PROBLEM so BACK returns to the screen the player came from (null = the menu / city underneath). */
  const [helpReturn, setHelpReturn] = useState(null);
  const [manageBizId, setManageBizId] = useState(typeof initialSave.manageBizId === 'string' ? initialSave.manageBizId : null); /* CLEANING_HAULING_EXPANSION_CHX1_E24_MANAGE_STATE: which pool business the MANAGE_BIZ screen (E22) shows. */ /* FOOD_STAND_EXPANSION_FSX1_E14_STATE_MANAGE: the selection is part of the save since FSX1 (E12/E13/E15) -- a game closed on the management screen reopens on the SAME business's screen. The loader already normalized the stored pair (E10/E13), so the initializer only type-checks. Declared here, far above the persist effect and restartGame that also touch it. */
  const [reportReturn, setReportReturn] = useState(null);
  /* NAVIGATION_EASE_V1_E03_STATE: tap-to-building trip state.
   * pendingEnter is the place a building tap / GO TO choice
   * is walking to; the arrival effect (E08) opens it (or
   * shows its doorstep note) when the walk completes.
   * TRANSIENT map UI only: a state + ref mirror (the ref is
   * what the arrival effect and the tick read synchronously),
   * never added to the save -- SKY_INITIAL, the loader and
   * the persist list are untouched. cityArrivalNote is the
   * doorstep note for the two properties and unowned
   * businesses. goToOpen is the GO TO panel. */
  const [pendingEnterId, setPendingEnterId] = useState(null);
  const pendingEnterRef = useRef(null);
  const [cityArrivalNote, setCityArrivalNote] = useState('');
  const [goToOpen, setGoToOpen] = useState(false);
  /* SKY_CITY_TRAVEL_V1_T_STATE: the travel prompt's place
   * id (or null). TRANSIENT map UI in the same style as
   * findOpen / goToOpen above: never added to SKY_INITIAL,
   * the loader or the persist list, so a reopen never
   * restores an open prompt. */
  const [travelPromptId, setTravelPromptId] = useState(null);
  const setPendingEnterBoth = (id) => { pendingEnterRef.current = id; setPendingEnterId(id); };
  const clearPendingEnter = () => { if (pendingEnterRef.current !== null) { pendingEnterRef.current = null; setPendingEnterId(null); } };
  const [cityView, setCityView] = useState({ w: 0, h: 0 });
  const cityWorldRef = useRef(null);
  /* EXPANSION_DEL1_P_STATE: swipe-to-pan camera state.
   * cityCamOffset shifts the follow camera's focus so the
   * player can look around the city; it is TRANSIENT map
   * UI only -- never added to SKY_INITIAL, the loader or
   * the persist list, so reopening re-centres on the
   * player exactly as before. The ref mirrors the state
   * because the pan responder and the movement inputs
   * read/write the offset synchronously. cityPageScroll
   * is the main page ScrollView's scrollEnabled: the pan
   * responder turns it off while a map drag owns the
   * touch and back on at release. cityPanGuardRef stamps
   * the last pan release: a tap landing inside the guard
   * window is the drag's own release, never a walk. */
  const [cityCamOffset, setCityCamOffset] = useState({ x: 0, y: 0 });
  const cityCamOffsetRef = useRef({ x: 0, y: 0 });
  const [cityPageScroll, setCityPageScroll] = useState(true);
  const cityPanRef = useRef(null);
  const cityPanGuardRef = useRef(0);
  const citySetCamOffset = (next) => { cityCamOffsetRef.current = next; setCityCamOffset(next); };
  const cityRecenterCam = () => { if (cityCamOffsetRef.current.x !== 0 || cityCamOffsetRef.current.y !== 0) citySetCamOffset({ x: 0, y: 0 }); };
  /* CITY_EXPANSION_CITY2_E05_CAM_STATE: the eased follow
   * camera's focus -- the world point the camera centres
   * on. TRANSIENT map UI in the pan offset's own pattern
   * (a state plus a ref mirror the movement tick reads
   * synchronously): never added to SKY_INITIAL, the loader
   * or the persist list, so reopening re-derives the camera
   * exactly as before. null until the movement tick seeds
   * it from the follow target; the render (E07) falls back
   * to the shipped derivation while it is null. The tick
   * (E06) steps it toward the target with the pure helper
   * (E03). Declared here, beside the pan offset and far
   * above the tick and the render that read it. */
  const [cityCamFocus, setCityCamFocus] = useState(null);
  const cityCamFocusRef = useRef(null);
  const citySetCamFocus = (next) => { cityCamFocusRef.current = next; setCityCamFocus(next); };
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
  /* DELIVERY_ROUTES_DELIVERY1_E15_STATE: completed-route
   * pay waiting to collect, and the last completed route's
   * summary (both persisted -- reopening before collecting
   * keeps both, E13/E14/E17). The collect message is
   * transient board UI, never saved. The pending ref is
   * the shared exactly-once gate the dealership/biz
   * collects use: set synchronously on a successful
   * collect, re-armed by the effect below when the cash
   * or the waiting pool moves. */
  const [deliveryPayWaiting, setDeliveryPayWaiting] = useState(Number.isFinite(initialSave.deliveryPayWaiting) && initialSave.deliveryPayWaiting > 0 ? initialSave.deliveryPayWaiting : 0);
  const [deliverySummary, setDeliverySummary] = useState(() => normalizeDeliverySummary(initialSave.deliverySummary));
  const [deliveryLastCollect, setDeliveryLastCollect] = useState(() => normalizeDeliveryLastCollect(initialSave.deliveryLastCollect)); /* COLLECTION_UX_DELIVERY2_E05_STATE: the last successful delivery collect ({amount, day} or null), persisted (E03/E04/E10) so the board's collected confirmation (E09) survives a reopen; written only inside the collect's success path (E06), reset by restartGame (E12). Declared here, beside the pool it confirms and above the collect handler, the persist effect and the board render that read it. */
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const deliveryCollectPending = useRef(false);
  React.useEffect(() => { deliveryCollectPending.current = false; }, [cash, deliveryPayWaiting]); /* DELIVERY_ROUTES_DELIVERY1_E15_REARM: mirrors the dealership pending re-arm (DX1_E07) -- the two values a successful collect changes, both declared above this effect. */
  const [missionSummary, setMissionSummary] = useState(null);
  const [missionNotice, setMissionNotice] = useState('');
  /* Exactly-once token for mission taps, the transitBoardRef
   * pattern: one token per (kind, stage, progress, day) state,
   * set synchronously before any effect is applied, so a
   * double-tap inside one render can never fire twice. Accept
   * and cancel re-arm it by clearing. */
  const missionTokenRef = useRef('');

  /* BUSINESS_HEADQUARTERS_HQ1_E11_COLLECT: the two ways
   * to take dealership profit out -- COLLECT TO CASH (the
   * DEAL1 collect, behavior unchanged) and DEPOSIT TO
   * SAVINGS -- are ONE handler with two wrappers, drawing
   * on the SAME dealershipProfit pool behind the SAME
   * dealershipPending ref: whichever is tapped first
   * zeroes the pool, and every later tap on either button
   * pays nothing and logs nothing. Exactly one Money
   * History entry per collection, labelled with the
   * business and the destination. Neither destination
   * calls recordEarning: dealership profit is passive
   * asset income and stays exempt from the $1,500 daily
   * earnings limit, like Friday rent. The handlers sit
   * here, below every state they read -- the savings
   * branch also reads savings and setSavingsPeak
   * (declared with the investment state above), and a
   * handler may only reference state declared above it.
   * The savings branch is a pure transfer: it raises the
   * savings peak in the same batch, so the shipped
   * savings-peak effect sees savings already at the peak
   * and grants NO credit for the move (a Bank deposit
   * keeps its own shipped credit behavior). */
  const collectDealershipProfitTo = (destination) => {
    if (dealershipPending.current) return;
    if (!dealershipOwned || dealershipProfit <= 0) return;
    dealershipPending.current = true;
    const amount = dealershipProfit;
    setDealershipProfit(0);
    if (destination === 'savings') {
      setSavings((s) => s + amount);
      setSavingsPeak((p) => Math.max(p, savings + amount));
      setDealershipMessage('Deposited $' + amount + ' of dealership profit straight into your savings.');
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'dealership', label: 'Dealership profit → Savings', amount: amount, balance: 'savings' }));
    } else {
      setCash((c) => c + amount);
      setDealershipMessage('Collected $' + amount + ' of dealership profit into your cash. Deposit it at the Bank to move it into savings.');
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'dealership', label: 'Dealership profit → Cash', amount: amount, balance: 'cash' }));
    }
  };
  const collectDealershipProfit = () => collectDealershipProfitTo('cash');
  const depositDealershipProfit = () => collectDealershipProfitTo('savings');

  /* CLEANING_HAULING_EXPANSION_CHX1_E12_COLLECT: the two ways
   * to take a pool business's waiting profit out -- COLLECT
   * TO CASH and DEPOSIT TO SAVINGS -- one handler with two
   * wrappers, mirroring collectDealershipProfitTo above: one
   * shared pending ref (bizCollectPending) means whichever
   * tap lands first zeroes that business's pool and every
   * later tap on either button pays nothing and logs
   * nothing; the amount is read before zeroing, so exactly
   * the waiting amount moves, once. Exactly one Money
   * History entry per collection, labelled with the business
   * and the destination. Neither destination calls
   * recordEarning: the money already counted toward the
   * $1,500 daily limit when the job completed, so collecting
   * can never double-count it or be blocked by the cap. The
   * savings branch raises the savings peak in the same
   * batch, so the shipped peak effect sees savings already
   * at the peak and grants NO credit for the move (a Bank
   * deposit keeps its own shipped credit behavior). The
   * handlers sit here, below every state they read. */
  const collectBizProfitTo = (businessId, destination) => {
    if (bizCollectPending.current) return;
    const biz = BUSINESSES.find((entry) => entry.id === businessId);
    if (!biz || !bizHasWaitingPool(businessId)) return;
    const amount = bizWaiting[businessId] || 0;
    if (amount <= 0) return;
    bizCollectPending.current = true;
    setBizWaiting((prev) => ({ ...normalizeBizWaiting(prev), [businessId]: 0 }));
    if (destination === 'savings') {
      setSavings((s) => s + amount);
      setSavingsPeak((p) => Math.max(p, savings + amount));
      setBizMessage('Deposited $' + amount + ' of ' + biz.name + ' profit into your savings.');
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' profit → Savings', amount: amount, balance: 'savings' }));
    } else {
      setCash((c) => c + amount);
      setBizMessage('Collected $' + amount + ' of ' + biz.name + ' profit into your cash.');
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' profit → Cash', amount: amount, balance: 'cash' }));
    }
  };
  const collectBizToCash = (businessId) => collectBizProfitTo(businessId, 'cash');
  const collectBizToSavings = (businessId) => collectBizProfitTo(businessId, 'savings');

  /* DELIVERY_ROUTES_DELIVERY1_E16_COLLECT: COLLECT PAY
   * for waiting delivery pay -- one handler behind the
   * shared deliveryCollectPending ref (E15), mirroring
   * the dealership/biz collects above: the amount is read
   * before zeroing, exactly the waiting amount moves to
   * CASH, exactly once, and exactly one Money History
   * entry is written. Unlike those collects, this one
   * DOES call recordEarning: delivery pay counts toward
   * the $1,500 daily cap at collect time, not at
   * completion (the approved DELIVERY1 deviation, E04),
   * so E04's pure plan gates the collect -- a cap that
   * cannot fit the whole amount refuses it whole, the
   * pay keeps waiting, and the board says so. The
   * handler sits below every state it reads. */
  const collectDeliveryPay = () => {
    if (deliveryCollectPending.current) return;
    const plan = planDeliveryCollect(deliveryPayWaiting, earnedToday, earnedTodayDay, day);
    if (!plan.ok) {
      if (plan.reason === 'cap') setDeliveryMessage('Daily earnings limit — your $' + plan.amount + ' delivery pay stays waiting. Collect it tomorrow.');
      return;
    }
    deliveryCollectPending.current = true;
    const amount = plan.amount;
    setDeliveryPayWaiting(0);
    setDeliverySummary(null);
    setDeliveryLastCollect({ amount: amount, day: day }); /* COLLECTION_UX_DELIVERY2_E06_COLLECT_STAMP: the collected-confirmation stamp, written here and nowhere else -- inside the success path, past the pending gate and the plan, in the same batch as the payment itself. A cap-refused or no-op collect returns above and writes nothing; a second collect cannot rewrite it, because the plan then reads the zeroed pool (and the pending ref holds until the re-arm effect runs). */
    setCash((c) => c + amount);
    recordEarning(amount);
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: 'Motorcycle deliveries → Cash', amount: amount, balance: 'cash' }));
    setDeliveryMessage('Collected $' + amount + ' of delivery pay into your cash.');
  };

  /* CLEANING_HAULING_EXPANSION_CHX1_E12_BUY_TIER2: buy a
   * business's tier-2 upgrade with savings, mirroring
   * buyBusinessUpgrade. The pure gate (E04) returns absolute
   * savings/upgrades2 values, so confirming twice in one
   * batch charges exactly once, and once owned the gate
   * keeps every later call a no-op. The confirm step always
   * closes. Exactly one Money History entry, recorded like
   * the tier-1 purchase. */
  const buyBusinessUpgrade2 = (businessId) => {
    const result = purchaseBusinessUpgrade2(savings, ownedBusinesses, businessUpgrades, businessUpgrades2, businessId);
    setBizMessage(result.message);
    setBizUpgrade2Confirm(null);
    if (!result.ok) return;
    setSavings(result.savings);
    setBusinessUpgrades2(result.upgrades2);
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: bizTier2Upgrade(businessId).name, amount: savings - result.savings, balance: 'savings' }));
  };

  /* DEALERSHIP_EXPANSION_DX1_E08_HANDLER: buy the
   * showroom upgrade with savings, mirroring
   * buyDealership. The pure gate returns absolute
   * savings and the new level, so confirming twice in
   * one batch charges exactly once, and at level 2 the
   * gate keeps every later call a no-op. The handler
   * sits here, below every state it reads (savings is
   * declared further down than the dealership block),
   * beside the collect handlers whose pending ref it
   * shares; the level change re-arms that ref through
   * the re-arm effect's deps. The confirm step always
   * closes. Exactly one Money History entry, recorded
   * like every other savings purchase. Cash, bikes and
   * every other balance are untouched, and no sale is
   * generated: the day's latch is already set, so the
   * better rate starts with tomorrow's customers. */
  const buyDealershipShowroom = () => {
    if (dealershipPending.current) return;
    const result = upgradeDealershipShowroom({ savings: savings, owned: dealershipOwned, level: dealershipLevel });
    setDealershipMessage(result.message);
    setShowroomConfirm(false);
    if (!result.ok) return;
    dealershipPending.current = true;
    setSavings(result.savings);
    setDealershipLevel(result.level);
    setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'purchase', label: 'Showroom upgrade', amount: savings - result.savings, balance: 'savings' }));
  };

  React.useEffect(() => {
    /* CHAPTER3_BIZ_V1: persist business fields. */
    /* CHAPTER3_INV_V1: persist investment fields. */
    /* HARLEY_V1_PERSIST: persist owned bikes. */
    persistSave({ step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, businessUpgrades /* BUSINESS_UPGRADES_V1_E09_PERSIST_OBJ */, businessUpgrades2 /* CLEANING_HAULING_EXPANSION_CHX1_E10_PERSIST_OBJ */, hours, bizWork, bizLifetimeEarnings /* BUSINESS_MANAGEMENT_BM1_E06_PERSIST_OBJ */, bizJobHistory /* CITY_BUSINESS_JOBS_CBJ1_E16_PERSIST_OBJ */, bizWaiting, bizJobsDone /* CLEANING_HAULING_EXPANSION_CHX1_E10B_PERSIST_OBJ */, maeLastRound /* MAES_PLACE_MAE1_E17_PERSIST_OBJ */, manageBizId /* FOOD_STAND_EXPANSION_FSX1_E15_PERSIST_MANAGE_OBJ */, selectedWorkVehicle /* BUSINESS_EXPANSION_BIZX1_E06_PERSIST_OBJ */, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, propertyListings, propertyRebuyUntil /* PROPERTY_LISTINGS_PROP1_E06_PERSIST_OBJ */, lastInvestPayday, lastInterestDay /* BANK_INTEREST_INT1_E06_PERSIST_OBJ */, neighborhoodFund /* NEIGHBORHOOD_FUND_NFUND1_E10_PERSIST_OBJ */, investmentsUnlocked, ownedBikes /* TRANSIT_V1_PERSIST_OBJ */ , earnedToday, earnedTodayDay /* DAILY_LIMIT_V1_PERSIST_OBJ */, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive, goalCoinsPaid, shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek /* COINS_V1_E07_PERSIST_OBJ */, ownedOutfits, wornOutfit /* COIN_SHOP_V1_E04_PERSIST_OBJ */, ownedDecorations, placedDecorations /* HOME_DECOR_V1_E04_PERSIST_OBJ */, displayBike /* MY_GARAGE_V1_E04_PERSIST_OBJ */, ownedBikeColors, appliedBikeColor /* BIKE_COLORS_V1_E04_PERSIST_OBJ */, lastFridayReport /* MY_MONEY_V1_E05_PERSIST_OBJ */, moneyHistory /* MONEY_HISTORY_V1_E05_PERSIST_OBJ */, savingsGoal /* SAVINGS_GOALS_V1_E05_PERSIST_OBJ */, playerPos: cityPos, ridingBike /* EXPLORE_CITY_V1_E05_PERSIST_OBJ */, activeMission, deliveryDay, deliveryCount /* CITY_JOBS_V1_E07_PERSIST_OBJ */, deliveryPayWaiting, deliverySummary /* DELIVERY_ROUTES_DELIVERY1_E17_PERSIST_OBJ */, deliveryLastCollect /* COLLECTION_UX_DELIVERY2_E10_PERSIST_OBJ: the collect stamp (E03) rides the same persist object -- additive only, one new key; a save written by this build loads on older builds with the key simply ignored. */, homeLayout /* MY_HOME_INTERIOR_V1_E04_PERSIST_OBJ */, ownedFurniture /* FURNITURE_STORE_V1_E09A_PERSIST_OBJ */, showArrows /* SKY_CITY_TRAVEL_V1_E05_PERSIST_OBJ */, dealershipOwned, dealershipProfit, dealershipSales, dealershipLastSale, dealershipHistory /* BUSINESS_HEADQUARTERS_HQ1_E06_PERSIST_OBJ */, dealershipLevel, dealershipLifetimeProfit, dealershipNotice /* DEALERSHIP_EXPANSION_DX1_E09_PERSIST_OBJ */, lastDealershipSaleDay /* DEALERSHIP_OWNERSHIP_DEAL1_E08_PERSIST_OBJ */ });
  }, [step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, goalsDone, jobId, pendingEvent, inventory, ownedBusinesses, businessUpgrades /* BUSINESS_UPGRADES_V1_E10_PERSIST_DEPS */, businessUpgrades2 /* CLEANING_HAULING_EXPANSION_CHX1_E11_PERSIST_DEPS */, hours, bizWork, bizLifetimeEarnings /* BUSINESS_MANAGEMENT_BM1_E07_PERSIST_DEPS */, bizJobHistory /* CITY_BUSINESS_JOBS_CBJ1_E17_PERSIST_DEPS */, bizWaiting, bizJobsDone /* CLEANING_HAULING_EXPANSION_CHX1_E11B_PERSIST_DEPS */, maeLastRound /* MAES_PLACE_MAE1_E18_PERSIST_DEPS */, manageBizId /* FOOD_STAND_EXPANSION_FSX1_E16_PERSIST_MANAGE_DEPS */, selectedWorkVehicle /* BUSINESS_EXPANSION_BIZX1_E07_PERSIST_DEPS */, businessUnlocked, savingsPeak, bondOwned, fundOwned, fundValue, fundCycle, propertiesOwned, propertyListings, propertyRebuyUntil /* PROPERTY_LISTINGS_PROP1_E07_PERSIST_DEPS */, lastInvestPayday, lastInterestDay /* BANK_INTEREST_INT1_E07_PERSIST_DEPS */, neighborhoodFund /* NEIGHBORHOOD_FUND_NFUND1_E11_PERSIST_DEPS */, investmentsUnlocked, ownedBikes, transitEmployment, transitTraining, transitBus, transitStop, transitAboard, transitBoarded, transitShiftActive, earnedToday, earnedTodayDay, goalCoinsPaid, shiftsThisWeek, shiftsWeekKey, lastShiftBonusWeek, ownedOutfits, wornOutfit /* COIN_SHOP_V1_E05_PERSIST_DEPS */, ownedDecorations, placedDecorations /* HOME_DECOR_V1_E05_PERSIST_DEPS */, displayBike /* MY_GARAGE_V1_E05_PERSIST_DEPS */, ownedBikeColors, appliedBikeColor /* BIKE_COLORS_V1_E05_PERSIST_DEPS */, lastFridayReport /* MY_MONEY_V1_E06_PERSIST_DEPS */, moneyHistory /* MONEY_HISTORY_V1_E06_PERSIST_DEPS */, savingsGoal /* SAVINGS_GOALS_V1_E06_PERSIST_DEPS */, cityPos, ridingBike /* EXPLORE_CITY_V1_E06_PERSIST_DEPS */, activeMission, deliveryDay, deliveryCount /* CITY_JOBS_V1_E08_PERSIST_DEPS */, deliveryPayWaiting, deliverySummary /* DELIVERY_ROUTES_DELIVERY1_E18_PERSIST_DEPS */, deliveryLastCollect /* COLLECTION_UX_DELIVERY2_E11_PERSIST_DEPS */, homeLayout /* MY_HOME_INTERIOR_V1_E05_PERSIST_DEPS */, ownedFurniture /* FURNITURE_STORE_V1_E09B_PERSIST_DEPS */, showArrows /* SKY_CITY_TRAVEL_V1_E06_PERSIST_DEPS */, dealershipOwned, dealershipProfit, dealershipSales, dealershipLastSale, dealershipHistory /* BUSINESS_HEADQUARTERS_HQ1_E07_PERSIST_DEPS */, dealershipLevel, dealershipLifetimeProfit, dealershipNotice /* DEALERSHIP_EXPANSION_DX1_E10_PERSIST_DEPS */, lastDealershipSaleDay /* DEALERSHIP_OWNERSHIP_DEAL1_E09_PERSIST_DEPS */, /* COINS_V1_E08_PERSIST_DEPS */ /* DAILY_LIMIT_V1_PERSIST_DEPS */ /* TRANSIT_V1_PERSIST_DEPS */ persistSave]);

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

  /* BANK_INTEREST_INT1_E09_EFFECT: Friday bank interest -- the
   * sibling of the Friday investment routine above, in the same
   * latch shape: it watches the day, pays exactly once per
   * Friday, and latches the Friday EVEN when the payment is $0
   * (a player with $0 savings on Friday earns nothing that
   * week, then or later). The pay is 1% of the savings balance
   * at the moment Friday processing runs, rounded to whole
   * dollars, paid INTO savings. Credit-neutral: the savings
   * peak rises in the same batch (the shipped collect-to-
   * savings pattern in collectDealershipProfitTo /
   * collectBizProfitTo), so the savings-peak effect above
   * sees savings already at the peak and grants NO credit for
   * the interest. It never calls recordEarning: passive
   * Friday income stays exempt from the $1,500 daily earnings
   * limit, like Friday rent. A payment over $0 writes exactly
   * one Money History entry (kind 'interest', E02); a $0
   * Friday writes none. No render loop: setting the latch
   * makes the re-run return. Deps are exactly the values the
   * guard reads; every state the body touches (day, savings,
   * savingsPeak, moneyHistory) is declared above this effect. */
  React.useEffect(() => {
    if (day % 7 !== FRIDAY || lastInterestDay === day) return;
    const interest = Math.round(savings * 0.01);
    if (interest > 0) {
      setSavings((s) => s + interest);
      setSavingsPeak((p) => Math.max(p, savings + interest));
      setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'interest', label: 'Bank interest', amount: interest, balance: 'savings' }));
    }
    setLastInterestDay(day);
  }, [day, lastInterestDay]);

  /* PROPERTY_LISTINGS_PROP1_E13_EFFECT: buyer offers for
   * listed properties -- a day-watching effect in the same
   * discipline as the Friday routines and the dealership
   * daily sale around it: it watches the day, and the stored
   * offer itself is the latch. When a listing is active,
   * holds no offer yet, and the day has reached the listing's
   * due day, the firing generates exactly one offer --
   * Math.round(ask * (0.85 + Math.random() * 0.15)), 85% to
   * 100% of the asking price, so a profit is never
   * guaranteed -- and stores it on the persisted listing
   * record (E03). Because the offer is stored, a reload or
   * a re-render can never re-roll it; because the guard
   * reads the stored offer, the firing that stores it is
   * the only one that generates. An offer has no expiry: it
   * waits for the player's accept, reject or cancel (E11).
   * Both properties can come due in one firing; the batch
   * lands whole. Deps are exactly the values the guard
   * reads -- [day, propertyListings] -- and both are
   * declared far above; PROPERTIES is the module table. */
  React.useEffect(() => {
    let nextListings = null;
    for (const prop of PROPERTIES) {
      const listing = propertyListings[prop.id];
      if (listing && listing.offer === null && Number.isInteger(listing.offerDueDay) && day >= listing.offerDueDay) {
        if (!nextListings) nextListings = { ...propertyListings };
        nextListings[prop.id] = { ask: listing.ask, listDay: listing.listDay, offerDueDay: listing.offerDueDay, offer: Math.round(listing.ask * (0.85 + Math.random() * 0.15)) };
      }
    }
    if (nextListings) setPropertyListings(nextListings);
  }, [day, propertyListings]);

  /* MAES_PLACE_MAE1_E19_EFFECT: Mae's Place customer
   * rounds -- the dealership daily sale (just below) in
   * the restaurant's shape. The effect watches the day,
   * and maeLastRound.day latches the last day a round
   * was processed, so exactly one round fires per day
   * advance and a reload or re-render can never refire
   * it (the latch is already today and the effect
   * returns). Not owned: nothing. Ownership day: buying
   * stamped the latch with that day (E16), so the first
   * round lands the NEXT day -- it is the day just
   * passed being served, which is why the management
   * summary (E22) reads YESTERDAY. The round is drawn
   * up front (drawMaeCustomerRound, E02: 5 to 9
   * customers, Southern fried chicken $18 / barbecue
   * ribs $26, half and half) and lands whole in one
   * batch: the profit joins the foodstand waiting pool
   * and lifetime earnings through the shipped
   * accumulators -- the same two calls a completed job
   * makes -- and the round record replaces the latch.
   * It never calls recordEarning and never touches
   * earnedToday: NPC income stays exempt from the
   * $1,500 daily earnings limit, like dealership sales,
   * and collecting the pool later behaves exactly as
   * shipped (cap-exempt; the savings branch credit-
   * neutral). Deps mirror the dealership sale below --
   * [day, maeLastRound] -- with ownedBusinesses read
   * live in the guard, exactly as that effect reads
   * dealershipOwned outside its deps. Every state the
   * body touches (ownedBusinesses, bizWaiting,
   * bizLifetimeEarnings, maeLastRound, day) is declared
   * above this effect; its two helpers and the profit
   * constants are module scope (E02/E07). */
  React.useEffect(() => {
    if (!ownedBusinesses.includes('foodstand')) return;
    if (!maeLastRound || maeLastRound.day >= day) return;
    const round = drawMaeCustomerRound(Math.random);
    setBizWaiting((prev) => addBizWaiting(prev, 'foodstand', round.total));
    setBizLifetimeEarnings((prev) => addBizLifetimeEarning(prev, 'foodstand', round.total));
    setMaeLastRound({ day: day, chicken: round.chicken, ribs: round.ribs, total: round.total });
  }, [day, maeLastRound]);

  /* NEIGHBORHOOD_FUND_NFUND1_E09_EFFECT: Neighborhood Fund
   * growth -- a day-watching effect in the same discipline
   * as the Friday routines and the Mae round above: it
   * watches the day, and the record's lastGrowthDay
   * latches the most recent tick applied, so each tick
   * (startDay + 5, +10, ...) lands exactly once and a
   * reload or re-render can never refire it (the latch is
   * already past and the pure pass returns null). The
   * growth itself is computed whole by
   * applyNeighborhoodFundGrowth (E03): every tick due is
   * applied in order, compounding, so a save reopened
   * after days away catches up in the one firing. An
   * empty fund (never bought, or sold back) has no clock
   * and the pass returns null. Growth is not cash: like
   * the Growth Fund's value change it is never logged in
   * Money History, and it never calls recordEarning and
   * never touches earnedToday -- investment growth stays
   * exempt from the $1,500 daily earnings limit, like
   * Friday interest. Deps are exactly the values the
   * guard reads -- [day, neighborhoodFund] -- and both
   * are declared far above; the rate and period are
   * module constants (E02). */
  React.useEffect(() => {
    const grown = applyNeighborhoodFundGrowth(neighborhoodFund, day);
    if (grown) setNeighborhoodFund(grown);
  }, [day, neighborhoodFund]);

  /* DEALERSHIP_OWNERSHIP_DEAL1_E10_SALE_EFFECT: the
   * daily customer sale. One hook only, on the shipped
   * day-rollover path -- the same latch shape as the
   * Friday investment routine above: the effect watches
   * the day, and lastDealershipSaleDay latches the sale
   * day, so it generates exactly one sale per in-game
   * day even across a mid-day save/reload or a reopen
   * (a reload re-runs the effect with the latch already
   * set and returns). Not owned: nothing. Purchase day:
   * buying stamped the latch with that day, so the
   * first sale lands the NEXT day. The profit stacks
   * into dealershipProfit until collected; the sale is
   * also kept as the last-sale record for the screen.
   * Deps are exactly the values the guard reads --
   * [day, lastDealershipSaleDay], mirroring the Friday
   * effect's deps -- and both are declared far above.
   * DEALERSHIP_EXPANSION_DX1_E11_SALE_EFFECT: one firing
   * per new day still, but the firing now draws as many
   * sales as the showroom level allows -- one at level
   * 1, two at level 2 -- each an independent weighted
   * draw at the showroom's margin (20% / 25%). Every
   * sale in the firing accrues to the same waiting
   * profit, the sales count, the lifetime total and
   * the history (one entry per sale, in draw order);
   * the last-sale record keeps the LAST bike drawn.
   * The firing also leaves the HOME notice naming what
   * sold. dealershipLevel is read live at firing time:
   * a mid-day upgrade cannot refire the effect (the
   * latch is already today), so the new rate starts
   * with tomorrow's customers. Customer sales never
   * touch ownedBikes, displayBike or ridingBike -- the
   * draw reads the BIKES table only. */
  React.useEffect(() => {
    if (!dealershipOwned) return;
    if (lastDealershipSaleDay >= day) return;
    /* DEALERSHIP_EXPANSION_DX1_E11B_SALE_BODY: draw the
     * day's sales up front, then apply them in one
     * batch -- the batch either lands whole or not at
     * all, and the latch below closes the day either
     * way, exactly as the single-sale firing did. */
    const salesToday = [];
    const salesCount = dealershipLevel >= 2 ? 2 : 1;
    for (let i = 0; i < salesCount; i += 1) salesToday.push(pickDealershipSale(Math.random, dealershipLevel));
    const profitToday = salesToday.reduce((sum, s) => sum + s.profit, 0);
    const lastSaleToday = salesToday[salesToday.length - 1];
    setDealershipProfit((p) => p + profitToday);
    setDealershipSales((n) => n + salesToday.length);
    setDealershipLastSale({ name: lastSaleToday.bike.name, profit: lastSaleToday.profit, day: day });
    setDealershipHistory((h) => salesToday.reduce((acc, s) => appendDealershipHistory(acc, { day: day, name: s.bike.name, profit: s.profit }), h)); /* BUSINESS_HEADQUARTERS_HQ1_E09_SALE_APPEND: the same sales, recorded in the persistent history in the same firing -- one entry per sale, never more. */
    setDealershipLifetimeProfit((t) => (Number.isFinite(t) && t >= 0 ? t : 0) + profitToday);
    setDealershipNotice(salesToday.length >= 2
      ? '🔔 Two customers arrived at your Dealership: ' + salesToday[0].bike.name + ' and ' + salesToday[1].bike.name + ' — $' + profitToday + ' profit is waiting.'
      : '🔔 A customer arrived at your Dealership and bought a ' + salesToday[0].bike.name + ' — $' + salesToday[0].profit + ' profit is waiting.');
    setLastDealershipSaleDay(day);
  }, [day, lastDealershipSaleDay]);

  /* DEALERSHIP_EXPANSION_DX1_E12_NOTICE_CLEAR: walking
   * into the Dealership reads the notice -- the player
   * is looking at the business, so the HOME card has
   * done its job and clears. `place` is declared above
   * (with the navigation state) and dealershipNotice
   * with the dealership block, so the dep array is
   * safe. Entering any other place leaves the notice
   * waiting. */
  React.useEffect(() => {
    if (place === 'DEALERSHIP' && dealershipNotice) setDealershipNotice(null);
  }, [place]);


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
    cityRecenterCam(); /* EXPANSION_DEL1_P_WALKTO: any movement input re-centres the pan camera on the player (D1 follow rule). */
    const target = cityUnstick({ x: point.x, y: point.y }, CITY_RECTS);
    cityWalkRouteRef.current = newCityWalkRoute(cityPosRef.current); /* NAVIGATION_EASE_V1_1_FIX_F03_WALKTO: a plain tap walk starts with an empty queue and a fresh stall clock, whatever a previous trip left behind. */
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

  /* NAVIGATION_EASE_V1_1_FIX_F04_ROUTE: a building trip no
   * longer aims the walker straight at the entrance -- that
   * line presses the player against walls it cannot round
   * (see F01). The trip follows cityRouteWaypoints: out to a
   * street, along the centrelines (the route the NAV1 dots
   * draw), then the verified-clear final leg to the entrance.
   * The movement tick consumes the queue through stepCityWalk.
   * A trip started within the shipped arrival radius of the
   * entrance (24 -- the max(speed, 24) both shipped speeds
   * are under) keeps the shipped short hop through
   * cityWalkTo, and reduced motion teleports to the entrance
   * exactly as cityWalkTo's reduced-motion branch does. */
  const cityWalkRoute = React.useCallback((placeDef) => {
    if (!placeDef || !placeDef.entrance) return;
    const here = cityPosRef.current;
    if (Math.hypot(here.x - placeDef.entrance.x, here.y - placeDef.entrance.y) <= 24) { cityWalkTo(placeDef.entrance); return; }
    const pts = cityWalkWaypoints(here, placeDef.entrance, CITY_RECTS); /* NAVIGATION_EASE_V1_2_FIX_G02_CALL: the module helper (renamed in G01) -- in V1.1 this call read the render body's route-dots const of the same name and threw before any walk state was written. */
    if (!pts.length) { cityWalkTo(placeDef.entrance); return; }
    if (reduceMotion) {
      cityWalkTargetRef.current = null;
      setCityWalkTarget(null);
      cityWalkRouteRef.current = newCityWalkRoute(placeDef.entrance);
      const target = cityUnstick({ x: placeDef.entrance.x, y: placeDef.entrance.y }, CITY_RECTS);
      cityPosRef.current = target;
      setCityPos(target);
      return;
    }
    cityWalkRouteRef.current = newCityWalkRoute(here);
    cityWalkRouteRef.current.queue = pts.slice(1);
    cityWalkTargetRef.current = pts[0];
    setCityWalkTarget(pts[0]);
    cityBlockedRef.current = 0;
  }, [cityWalkTo, reduceMotion]);
  /* NAVIGATION_EASE_V1_E04_BUILDING_PRESS: tapping a building
   * now arms the trip: walk to its entrance (the shipped
   * walker), aim the FIND A PLACE guide at it (NAV1 route
   * dots + chip, as with FIND A PLACE) and record the
   * transient pendingEnter -- the arrival effect (E08) opens
   * the place (or shows its doorstep note) when the walk
   * completes. Inert while a bus drive owns the map. */
  const cityTravelTo = React.useCallback((placeDef) => { /* SKY_CITY_TRAVEL_V1_T_TRAVELTO: the shipped immediate-travel body under its new name -- GO TO and FIND A PLACE call this and keep travelling at once. Map building taps go through the cityBuildingPress prompt gate below. Body byte-identical to the shipped press. */
    if (Date.now() - cityPanGuardRef.current < 250) return; /* EXPANSION_DEL1_P_PRESSGUARD: a building tap inside the pan-guard window is the release of a map drag, not a trip (D1 threshold rule). */
    if (!placeDef || !placeDef.entrance) return;
    if (busDriveRef.current && busDriveRef.current.active) return;
    setPendingEnterBoth(placeDef.id);
    setGuideTargetId(placeDef.id);
    cityWalkRoute(placeDef); /* NAVIGATION_EASE_V1_1_FIX_F04B_PRESS: building trips walk the road route (F04), not the straight line at the entrance. */
  }, [cityWalkRoute]);
  /* SKY_CITY_TRAVEL_V1_T_PROMPTGATE: map building taps (the
   * world-Pressable resolver below and the per-building
   * Pressables -- both already call cityBuildingPress) no
   * longer travel instantly: they ask first. The pan guard
   * and the bus-drive guard run BEFORE any state is
   * written, behind the same guards cityTravelTo keeps, so
   * a pan drag's release or a drive can never open a
   * prompt. A tap already within ENTER range of the
   * entrance skips the prompt and travels immediately --
   * the shipped tap behaviour, since the arrival effect
   * opens the place on the next pass. Any other tap sets
   * the transient travelPromptId and nothing moves until
   * the player picks WALK HERE / RIDE HERE. Opening the
   * prompt never cancels a walk already running: choosing
   * replaces its target, CLOSE leaves it running, and
   * STOP WALK stays the one walk-cancel. */
  const cityBuildingPress = (placeDef) => {
    if (Date.now() - cityPanGuardRef.current < 250) return;
    if (!placeDef || !placeDef.entrance) return;
    if (busDriveRef.current && busDriveRef.current.active) return;
    if (Math.hypot(cityPos.x - placeDef.entrance.x, cityPos.y - placeDef.entrance.y) <= CITY_ENTER_RANGE) { cityTravelTo(placeDef); return; }
    setTravelPromptId(placeDef.id);
  };
  /* SKY_CITY_TRAVEL_V1_T_PROMPTACTIONS: the prompt's two
   * travel choices. Each closes the prompt first, then
   * sets the travel mode exactly the way the map's own
   * RIDE / PARK BIKE buttons do -- ridingBike IS the
   * mode; the movement tick reads ride speed from it --
   * then arms the trip through cityTravelTo, so a
   * prompted trip is the shipped trip in every other
   * respect (road route, arrival, auto-open). The ride
   * choice mounts the garage-selected bike (the same
   * effectiveDisplayBike resolution the map controls
   * derive citySelectedBikeId from) and is inert without
   * one; the panel disables the button in that case. */
  const travelPromptWalk = () => {
    const def = travelPromptId ? cityPlaceById(travelPromptId) : null;
    setTravelPromptId(null);
    if (!def) return;
    if (ridingBike) setRidingBike(null);
    cityTravelTo(def);
  };
  const travelPromptRide = () => {
    const def = travelPromptId ? cityPlaceById(travelPromptId) : null;
    setTravelPromptId(null);
    if (!def) return;
    const selBikeId = effectiveDisplayBike(ownedBikes, displayBike);
    if (!selBikeId) return;
    setRidingBike(selBikeId);
    cityTravelTo(def);
  };
  /* NAVIGATION_EASE_V1_E04B_TAP_RESOLVE: ONE resolver for
   * ground taps (the world Pressable; building touches land
   * in cityBuildingPress directly and behave identically). A
   * tap inside a place's building rect is a trip to that
   * place; any other tap is the shipped free tap-to-walk and
   * cancels a pending auto-open. Inert while driving (the
   * Pressable already returns early; this is the same guard,
   * kept so the resolver is safe from any caller). */
  const cityTapResolve = (point) => {
    if (Date.now() - cityPanGuardRef.current < 250) return; /* EXPANSION_DEL1_P_TAPGUARD: the release of a pan drag must not fire tap-to-walk (D1 threshold rule). */
    if (busDriveRef.current && busDriveRef.current.active) return;
    const hit = tapPlaceAtPoint(point.x, point.y);
    if (hit) { cityBuildingPress(hit); return; }
    clearPendingEnter();
    cityWalkTo(point);
  };
  /* REALISTIC_LOOK_VIS2_E03_PAD_HANDLERS: the two pad-direction
   * handlers that stood here are removed with the pad itself
   * (E04). They were called ONLY by the pad buttons (census:
   * their call sites were exactly the pad's onPressIn/onPressOut
   * props): between them they cleared the walk target, cleared
   * the pending auto-open, recentered the pan camera and nudged
   * the pad direction ref. The helpers they used are shared --
   * tap travel, ENTER and GO HOME recenter the camera too, and
   * tap travel clears the pending enter -- so both helpers stay.
   * The direction ref also stays: the movement tick still reads
   * it every frame, and with no pad input it simply rests at
   * { x: 0, y: 0 }, so the shipped tick arithmetic is unchanged. */
  React.useEffect(() => {
    if (place !== null || !freeRoam) return undefined;
    const iv = setInterval(() => {
      /* CITY_EXPANSION_CITY2_E06_TICK_EASE: the eased follow
       * camera (helper E03, state E05, render E07). Every
       * tick the focus steps toward the SAME follow target
       * the shipped render derivation clamped -- the player,
       * with the pan offset riding while no walk target
       * stands and no bus drive owns the map (the refs
       * mirror the states that derivation reads). Only a
       * real step writes state, so a settled camera costs
       * no renders. Player movement, speeds, arrival and
       * auto-open never read the camera -- the world
       * transform is its only consumer -- so this step sits
       * above the drive and walk branches and changes none
       * of their arithmetic. */
      const camTargetFocus = (cityWalkTargetRef.current || (busDriveRef.current && busDriveRef.current.active))
        ? { x: cityPosRef.current.x, y: cityPosRef.current.y }
        : { x: cityPosRef.current.x + cityCamOffsetRef.current.x, y: cityPosRef.current.y + cityCamOffsetRef.current.y };
      const camNextFocus = city2CamEaseStep(cityCamFocusRef.current, camTargetFocus);
      if (!cityCamFocusRef.current || camNextFocus.x !== cityCamFocusRef.current.x || camNextFocus.y !== cityCamFocusRef.current.y) citySetCamFocus(camNextFocus);
      /* PLAYABLE_TRANSIT_V1_E04_TICK: while a bus drive is
       * active, this tick belongs to the bus. The pure
       * busStepDrive machine integrates the pedals/steering
       * and moves cityPos (so the shipped camera follows the
       * bus exactly like the player). Paused = frozen solid:
       * no movement, no boarding countdown. A stray walk
       * target is cleared so nothing queues up behind the
       * drive. Normal movement below is untouched and runs
       * again the moment the drive ends. */
      const drv = busDriveRef.current;
      if (drv && drv.active) {
        if (!drv.paused) {
          if (cityWalkTargetRef.current) { cityWalkTargetRef.current = null; setCityWalkTarget(null); }
          const out = busStepDrive(drv, busInputRef.current, cityPosRef.current);
          if (out.pos.x !== cityPosRef.current.x || out.pos.y !== cityPosRef.current.y) citySetPos(out.pos);
          if (out.drive !== drv) { busDriveRef.current = out.drive; setBusDrive(out.drive); }
        }
        return;
      }
      const dir = cityDirRef.current;
      const pos = cityPosRef.current;
      const speed = selectedWorkVehicle || ridingBike || (activeMission && activeMission.kind === 'transit_route') ? CITY_RIDE_SPEED : CITY_WALK_SPEED; /* CITY_JOBS_V1_E10_SPEED: a driven bus route moves at ride speed; on foot and on a bike the speed is exactly the shipped one. */ /* BUSINESS_EXPANSION_BIZX1_E09_SPEED: a selected work vehicle (E02) drives at ride speed too and outranks the bike -- vehicle, then bike, then the driven route, then on foot, at exactly the shipped speeds. */
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
        /* NAVIGATION_EASE_V1_1_FIX_F05_TICK: tap walks run
         * through the pure stepCityWalk machine (F01): it
         * follows the trip's waypoint queue and its stall
         * watchdog advances / rebuilds / ends a walk that has
         * stopped making progress, so no walk can creep
         * against a wall forever. The result is applied the
         * way the bus branch applies busStepDrive's. The
         * shipped blocked give-up in the shared tail below is
         * untouched: it now only ever sees D-pad input (that
         * branch clears the walk target first), exactly the
         * only input it could ever fire for before. */
        const wr = cityWalkRouteRef.current;
        const out = stepCityWalk({ target: cityWalkTargetRef.current, queue: wr.queue, stallX: wr.stallX, stallY: wr.stallY, stallTicks: wr.stallTicks, rebuilt: wr.rebuilt }, pos, speed, CITY_RECTS);
        wr.queue = out.walk.queue;
        wr.stallX = out.walk.stallX;
        wr.stallY = out.walk.stallY;
        wr.stallTicks = out.walk.stallTicks;
        wr.rebuilt = out.walk.rebuilt;
        const nt = out.walk.target;
        if ((nt === null) !== (cityWalkTargetRef.current === null) || (nt && (nt.x !== cityWalkTargetRef.current.x || nt.y !== cityWalkTargetRef.current.y))) {
          cityWalkTargetRef.current = nt;
          setCityWalkTarget(nt);
        }
        if (out.pos.x !== pos.x || out.pos.y !== pos.y) citySetPos(out.pos);
        if (out.event === 'watchdog-end') {
          /* The walk ended without arriving: NAV2's give-up
           * rule clears the pending auto-open -- unless the
           * player stopped within the shipped CITY_ENTER_RANGE
           * of the entrance, in which case the pending trip
           * stays armed and the position is re-published so
           * the shipped arrival effect (E08) makes the
           * open / note decision itself. */
          const pid = pendingEnterRef.current;
          const pdef = pid ? cityPlaceById(pid) : null;
          if (pdef && pdef.entrance && Math.hypot(out.pos.x - pdef.entrance.x, out.pos.y - pdef.entrance.y) <= CITY_ENTER_RANGE) {
            citySetPos({ x: out.pos.x, y: out.pos.y });
          } else {
            clearPendingEnter();
          }
        }
        return;
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
          clearPendingEnter(); /* NAVIGATION_EASE_V1_E07_GIVEUP_CLEAR: an abandoned walk abandons its pending auto-open too. */
        }
        return;
      }
      cityBlockedRef.current = 0;
      citySetPos(next);
    }, CITY_TICK_MS);
    return () => clearInterval(iv);
  }, [place, freeRoam, ridingBike, activeMission, selectedWorkVehicle]); /* CITY_JOBS_V1_E11_SPEED_DEPS */ /* BUSINESS_EXPANSION_BIZX1_E10_SPEED_DEPS: the tick re-derives its speed when the vehicle selection changes (the vehicle state is declared far above this effect, so the dep is safe). */

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
    cityRecenterCam(); /* EXPANSION_DEL1_P_ENTER: entering a place retires the pan offset (D1). */
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

  /* CITY_NAVIGATION_V1_E07_GOHOME: the map's GO HOME
   * shortcut. Mirrors the exit watcher's respawn exactly --
   * the player reappears at the HOME entrance (citySetPos) --
   * plus the walk-target and guide clears a fresh arrival
   * needs (the same clears cityEnter performs). Riding state
   * is untouched, exactly as the watcher leaves it; no clock,
   * no cost, no other state. */
  const cityGoHome = () => {
    cityRecenterCam(); /* EXPANSION_DEL1_P_GOHOME: GO HOME re-centres the pan camera (D1). */
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    setGuideTargetId(null);
    clearPendingEnter(); /* NAVIGATION_EASE_V1_E09_GOHOME_CLEAR */
    setGoToOpen(false);
    citySetPos(cityHomeEntrance());
  };

  /* EXPANSION_DEL1_P_CONTROLS: the STOP WALK handler, the
   * follow-lock effect and the swipe-to-pan responder.
   * STOP WALK (D2): the guide chip's small x clears only
   * the guide and pendingEnter -- the walk itself keeps
   * going (audit 1d). This handler clears EVERYTHING a
   * trip set: the walk target, the road-route queue
   * (reset whole, the F03 pattern), the pending auto-open
   * and the guide, so the character actually stops where
   * he stands. The chip is untouched.
   * FOLLOW LOCK (D1): while a trip is armed (or a bus
   * drive owns the map) the stored pan offset is retired,
   * and the render camera ignores it while a walk target
   * stands, so travel always runs on the follow camera.
   * PAN RESPONDER (D1): claims only a gesture that has
   * already travelled past the threshold (12 units
   * Manhattan), never a tap; it never claims while a walk
   * target stands, a bus drive owns the map, or a panel
   * is open. Grant normalises the offset through
   * clampCamera and disables page scroll; move drags the
   * focus with the finger (content follows the drag);
   * release/terminate re-enable page scroll, stamp the
   * pan guard, and release re-normalises the offset, so
   * the stored value can never drift past the world. */
  const cityStopWalk = () => {
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    cityWalkRouteRef.current = newCityWalkRoute(cityPosRef.current);
    clearPendingEnter();
    setGuideTargetId(null);
  };
  React.useEffect(() => {
    if (cityWalkTarget || (busDrive && busDrive.active)) cityRecenterCam();
  }, [cityWalkTarget, busDrive]);
  const cityPanResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, g) => {
      if (busDriveRef.current && busDriveRef.current.active) return false;
      if (cityWalkTargetRef.current) return false;
      if (findOpen || goToOpen || travelPromptId) return false; /* SKY_CITY_TRAVEL_V1_T_PANGATE: an open travel prompt claims the map like the other panels -- a drag cannot start behind it. */
      return Math.abs(g.dx) + Math.abs(g.dy) > 12;
    },
    onPanResponderGrant: (evt, g) => {
      const vw = cityView.w || 800, vh = cityView.h || 520;
      const pos = cityPosRef.current;
      const cam = clampCamera(pos.x + cityCamOffsetRef.current.x, pos.y + cityCamOffsetRef.current.y, vw, vh);
      const baseOff = { x: cam.x + vw / 2 - pos.x, y: cam.y + vh / 2 - pos.y };
      cityPanRef.current = { baseX: baseOff.x, baseY: baseOff.y };
      citySetCamOffset(baseOff);
      setCityPageScroll(false);
    },
    onPanResponderMove: (evt, g) => {
      const st = cityPanRef.current;
      if (!st) return;
      citySetCamOffset({ x: st.baseX - g.dx, y: st.baseY - g.dy });
    },
    onPanResponderRelease: () => {
      cityPanRef.current = null;
      cityPanGuardRef.current = Date.now();
      setCityPageScroll(true);
      const vw = cityView.w || 800, vh = cityView.h || 520;
      const pos = cityPosRef.current;
      const cam = clampCamera(pos.x + cityCamOffsetRef.current.x, pos.y + cityCamOffsetRef.current.y, vw, vh);
      citySetCamOffset({ x: cam.x + vw / 2 - pos.x, y: cam.y + vh / 2 - pos.y });
    },
    onPanResponderTerminate: () => {
      cityPanRef.current = null;
      cityPanGuardRef.current = Date.now();
      setCityPageScroll(true);
    },
    onPanResponderTerminationRequest: () => false,
  }), [cityView, findOpen, goToOpen, travelPromptId]); /* SKY_CITY_TRAVEL_V1_T_PANDEPS: the responder re-derives when the prompt opens or closes (T04). */

  /* EXPLORE_CITY_V1_E09_EXIT_SPAWN: ONE watcher -- when the
   * screen returns to the map from a building entered through
   * ENTER, the player reappears at that building's entrance.
   * Map returns that did not come through ENTER (Settings, a
   * save reopened into a screen) keep the saved position. */
  const cityPrevPlaceRef = useRef(place);
  React.useEffect(() => {
    const prev = cityPrevPlaceRef.current;
    cityPrevPlaceRef.current = place;
    /* NAVIGATION_EASE_V1_E27_WATCH_CLEAR: entering ANY place
     * (ENTER, a HUD screen button, Settings) retires a pending
     * tap-to-building trip, so a stale auto-open can never
     * fire after the player comes back to the map. */
    if (place !== null) clearPendingEnter();
    /* PLAYABLE_TRANSIT_V1_E04B_WATCH: leaving the map for ANY
     * screen mid-drive (SETTINGS is the one door out of the
     * map screen) abandons the drive with NO effects -- the
     * same rule as closing the app -- and puts the player back
     * at the Transit entrance, exactly like an exit. START
     * ROUTE itself moves TRANSIT -> null, which never trips
     * this (place is null, and the drive is set in the same
     * handler after this watcher last ran). */
    if (place !== null && busDriveRef.current && busDriveRef.current.active) {
      busInputRef.current = { left: false, right: false, gas: false, brake: false };
      setBusDriveBoth(null);
      citySetPos(busDepotPoint());
    }
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
  /* NAVIGATION_EASE_V1_E08_ARRIVAL: when a tap-to-building /
   * GO TO walk reaches its entrance (within the shipped
   * CITY_ENTER_RANGE), finish the trip exactly once: clear
   * the pending flag FIRST (a second tick can never re-fire),
   * clear the guide if it was this trip's, then either show
   * the doorstep note (properties, unowned businesses) or
   * open the place through the SHIPPED cityEnter -- the same
   * function the ENTER button calls, so the writes are the
   * ENTER button's writes by construction. Never fires while
   * a screen is open or a bus drive owns the map. */
  React.useEffect(() => {
    const id = pendingEnterRef.current;
    if (!id || place !== null) return;
    if (busDriveRef.current && busDriveRef.current.active) return;
    const def = cityPlaceById(id);
    if (!def) { clearPendingEnter(); return; }
    const decision = navArrivalDecision(def, cityPos, ownedBusinesses, propertiesOwned);
    if (!decision) return;
    clearPendingEnter();
    setGuideTargetId((g) => (g === id ? null : g));
    if (decision.action === 'note') { setCityArrivalNote(decision.text); return; }
    cityEnter(def);
  }, [cityPos, pendingEnterId, place, ownedBusinesses, propertiesOwned]);

  /* NAVIGATION_EASE_V1_E08B_NOTE_TIMER: the doorstep note
   * fades on its own after a few seconds; nothing else is
   * touched. (A timeout effect, not the movement tick, so
   * the movement loop itself stays byte-identical.) */
  React.useEffect(() => {
    if (!cityArrivalNote) return undefined;
    const t = setTimeout(() => setCityArrivalNote(''), 4500);
    return () => clearTimeout(t);
  }, [cityArrivalNote]);
  /* CITY_JOBS_V1_E12_HANDLERS: accept / cancel / interact /
   * complete for city missions. The pure layer (E03) decides;
   * these handlers only apply a decision through the SHIPPED
   * setters and helpers -- setCash, recordEarning, setHours,
   * setBizWork (the menu's own update shape), setPendingWages,
   * setXp, setLastShiftDay, countPaidShift, addHistoryEntry --
   * so a mission job and a menu job are indistinguishable to
   * every counter, cap and report downstream. */
  const missionToken = (m) => (m ? m.kind + ':' + m.stage + ':' + m.progress + ':' + day : '');
  const acceptMission = (kind, routeId) => { /* EXPANSION_DEL1_R_ACCEPTSIG: routeId is threaded from the job board's route rows (delivery only). */
    if (activeMission) return;
    const elig = missionEligibility(kind, { ownedBusinesses, businessUpgrades, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount, transitEmployment, transitTraining, ownedBikes, activeMission });
    if (!elig.ok) { setMissionNotice(elig.reason); return; }
    missionTokenRef.current = '';
    setMissionNotice('');
    setMissionSummary(null);
    setGuideTargetId(null);
    setActiveMission(newMission(kind, routeId, bizCustomerFor(kind, { bizWork, day }), kind === 'delivery' ? deliveryRouteStops(routeId, day, deliveriesDoneToday(deliveryDay, deliveryCount, day)) : undefined)); /* EXPANSION_DEL1_R_ACCEPTCALL */ /* CITY_BUSINESS_JOBS_CBJ1_E13_ACCEPT: a business accept stamps the customer the board is showing for that business -- E04's picker reads this same bizWork + day, so the card and the stamp cannot disagree. Non-business kinds pass the picker by (it returns null for them) and their missions are unchanged. */ /* DELIVERY_ROUTES_DELIVERY1_E19_ACCEPT: a delivery accept also stamps the route's stops, from E02's derivation read off the same day + delivery counters the board card (E22) reads, so the stops shown are the stops stamped; and it MOUNTS the selected bike -- the garage pick the map's WALK/RIDE toggle rides (effectiveDisplayBike) written to ridingBike, exactly as the travel prompt's ride choice writes it -- so the route runs at ride speed on the bike the card showed. Other kinds pass the stop picker by and mount nothing. */
    if (kind === 'delivery') { const deliveryBikeId = effectiveDisplayBike(ownedBikes, displayBike); if (deliveryBikeId) setRidingBike(deliveryBikeId); }
    setPlace(null);
  };
  /* DELIVERY_ROUTES_DELIVERY1_E19_CYCLE: the board's
   * SWITCH BIKE control -- cycles the garage pick
   * (displayBike, the persisted selection the WALK/RIDE
   * toggle and the garage both read) through the owned
   * bikes. Selection only: it mounts nothing by itself;
   * the next accept (E19) or the map toggle rides the
   * new pick. */
  const cycleDeliveryBike = () => {
    if (!ownedBikes || ownedBikes.length < 2) return;
    const cur = effectiveDisplayBike(ownedBikes, displayBike);
    const idx = ownedBikes.indexOf(cur);
    setDisplayBike(ownedBikes[(idx + 1) % ownedBikes.length]);
  };
  /* BUSINESS_EXPANSION_BIZX1_E11_HQ_ACCEPT: the headquarters
   * accept behind the MANAGE_BIZ job choice cards (E16). It
   * mirrors acceptMission line for line -- the same
   * one-mission guard, the same missionEligibility gate off
   * the same snapshot, the same clearing writes, and the
   * mission built by the same newMission -- with ONE
   * difference: the customer is the card the player picked,
   * resolved from the same customer table by id
   * (bizCustomerById) instead of the board's rotating offer
   * (bizCustomerFor). The completion branch cannot tell an
   * HQ job from a board job, so completion pays through the
   * shipped path (the waiting pool for the pool businesses),
   * exactly once. setPlace(null) closes to the city so the
   * shipped banner / GO TO CUSTOMER / COMPLETE JOB flow
   * runs. Declared directly below acceptMission, so every
   * state and setter it reads is declared above it. */
  const acceptHqBusinessJob = (businessId, customerId) => {
    if (activeMission) return;
    const elig = missionEligibility(businessId, { ownedBusinesses, businessUpgrades, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount, transitEmployment, transitTraining, ownedBikes, activeMission });
    if (!elig.ok) { setMissionNotice(elig.reason); return; }
    missionTokenRef.current = '';
    setMissionNotice('');
    setMissionSummary(null);
    setGuideTargetId(null);
    setActiveMission(newMission(businessId, undefined, bizCustomerById(businessId, customerId)));
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
  /* CITY_BUSINESS_JOBS_FIX_CBJ1F_E03_HANDLER: GO TO
   * CUSTOMER -- the one-tap trip to the active job's
   * customer, called by the mission banner button (E04)
   * and the FIND A PLACE customer row (E05). The trip is
   * the shipped building trip itself: cityWalkRoute
   * walks the road route (NAV1/F04 -- a street link out,
   * the centrelines, then the verified final leg in),
   * and it reads nothing off its argument but the
   * entrance point, so the customer's spot is the
   * destination exactly as a doorstep would be. A plain
   * cityWalkTo straight line is NOT used: cross-town
   * lines press the walker against walls it cannot
   * round (the NAV2 finding) -- driven through the real
   * stepCityWalk, the straight line failed 31 of 144
   * entrance-to-customer trips where the road route
   * reached the customer in all 135 trips from a lawful
   * start. No pendingEnter is armed (arming one is
   * cityTravelTo's separate job), so arrival opens
   * nothing: the mission's own in-range derivation
   * offers COMPLETE JOB, as CBJ1 left it. A stale
   * pendingEnter is cleared first -- the ground-tap
   * composition in cityTapResolve -- so an old building
   * trip can never auto-open on this walk's arrival.
   * The walk lives in the one shipped travel state, so
   * STOP WALK, a D-pad press and any new destination
   * cancel it like any other trip; the movement tick
   * reads its speed from ridingBike, so the player
   * walks or rides exactly as the map's WALK/RIDE
   * toggle is set. Closing any open screen first
   * mirrors acceptMission's own setPlace(null): the
   * banner and the FIND panel render on the city, so in
   * practice the place is already null and the write is
   * inert. Travel only: nothing here pays, counts,
   * clocks or completes -- COMPLETE JOB on arrival is
   * still the one finish, through the shipped branch. */
  const goToMissionCustomer = () => {
    if (!activeMission) return;
    const cust = missionCustomerTarget(activeMission) || missionDeliveryTarget(activeMission); /* DELIVERY_ROUTES_DELIVERY1_E24_GOTO_TARGET: for a delivery the trip aims at the E04 target -- the Store at pickup, the current stop while delivering -- and rides the same shipped road-route walker below. Business missions resolve through missionCustomerTarget first, exactly as shipped, so their trips are unchanged. */
    if (!cust) return;
    setPlace(null);
    clearPendingEnter();
    cityWalkRoute({ entrance: { x: cust.x, y: cust.y } });
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
    const plan = planMissionCompletion(activeMission, { ownedBusinesses, businessUpgrades, businessUpgrades2 /* CLEANING_HAULING_EXPANSION_CHX1_E15_PLAN_SNAP */, bizWork, day, earnedToday, earnedTodayDay, lastShiftDay, deliveryDay, deliveryCount });
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
      /* CLEANING_HAULING_EXPANSION_CHX1_E15_CITY_WAITING: a
       * cleaning or hauling city job pays into the business's
       * waiting pool (collected later, E12) and raises its
       * all-time counter, behind the same completion token as
       * every other effect in this branch; the Food Stand
       * keeps the shipped cash award. */
      const planWaits = bizHasWaitingPool(plan.bizId);
      if (planWaits) {
        setBizWaiting((prev) => addBizWaiting(prev, plan.bizId, plan.pay));
        setBizJobsDone((prev) => addBizJobDone(prev, plan.bizId));
      } else {
        setCash((c) => c + plan.pay);
      }
      setBizLifetimeEarnings((prev) => addBizLifetimeEarning(prev, plan.bizId, plan.pay)); /* BUSINESS_MANAGEMENT_BM1_E09_MISSION_INCREMENT: a business job finished through the CITY JOBS board is the same paid job as one worked from the interior (same pay, same daily counter), so it counts toward the same lifetime total in the same firing as its cash award -- exactly once, behind the same completion token that guards the cash. No other line of this branch changes. */
      recordEarning(plan.pay);
      setHours((h) => h + plan.hours);
      setBizWork((prev) => ({ ...prev, [plan.bizId]: { day, count: doneToday + 1 } }));
      if (planWaits) {
        setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' job +$' + plan.pay + ' — waiting to collect', amount: plan.pay, balance: 'waiting' })); /* CLEANING_HAULING_EXPANSION_CHX1_E15_CITY_WAITING_HISTORY */
      } else {
        setMoneyHistory((h) => addHistoryEntry(h, { day: day, kind: 'job', label: biz.name + ' job', amount: plan.pay, balance: 'cash' }));
      }
      setBizJobHistory((h) => appendBizJobHistory(h, { bizId: plan.bizId, bizName: biz.name, day: DAY_NAMES[day % 7], customer: activeMission.customer || 'Customer', amount: plan.pay })); /* CITY_BUSINESS_JOBS_CBJ1_E18_HISTORY_APPEND: the city job joins the Business Job History in the same firing as its payment -- the weekday it completed, the business, the customer it was for, and the pay actually paid -- behind the same completion token that guards the cash, so it records exactly once. No other line of this branch changes. */
      setActiveMission(null);
      setMissionSummary({ title: 'Mission complete!', lines: [planWaits ? '$' + plan.pay + ' waiting to collect — ' + biz.name + ' job' : '+$' + plan.pay + ' cash — ' + biz.name + ' job', 'Time advanced: +' + plan.hours + ' hours'] }); /* CLEANING_HAULING_EXPANSION_CHX1_E15_CITY_WAITING_SUMMARY: a waiting completion says the money waits -- it never claims cash the player does not hold yet. */
      return;
    }
    if (plan.kind === 'delivery') {
      /* DELIVERY_ROUTES_DELIVERY1_E20_COMPLETE: a completed
       * route lands its clock (+1 hour), its XP and its
       * daily count exactly once, behind the same
       * completion token as every other branch -- but its
       * pay is NOT cash and NOT an earning yet: it moves
       * into the waiting pool (E15) with the route
       * summary, and cash + the cap record + the Money
       * History entry all happen at COLLECT (E16). No
       * setCash, no recordEarning and no addHistoryEntry
       * in this branch -- that is the approved DELIVERY1
       * deviation from DEL1. The completing tap also
       * parks the bike, as shipped. */
      setHours((h) => h + plan.hours);
      if (plan.xp > 0) setXp((v) => v + plan.xp);
      setDeliveryDay(day);
      setDeliveryCount(deliveriesDoneToday(deliveryDay, deliveryCount, day) + 1);
      setDeliveryPayWaiting((w) => (Number.isFinite(w) && w > 0 ? w : 0) + plan.pay);
      setDeliverySummary({ stops: plan.stops, pay: plan.pay });
      setRidingBike(null);
      setActiveMission(null);
      const deliveryLines = ['$' + plan.pay + ' waiting to collect — Motorcycle delivery (' + plan.stops + (plan.stops === 1 ? ' stop' : ' stops') + ')', 'Time advanced: +' + plan.hours + (plan.hours === 1 ? ' hour' : ' hours')];
      if (plan.xp > 0) deliveryLines.push('+' + plan.xp + ' XP');
      deliveryLines.push('Collect your pay at the City Job Board.');
      setMissionSummary({ title: 'Route complete!', lines: deliveryLines });
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
  /* PLAYABLE_TRANSIT_V1_E05_HANDLERS: the playable drive's
   * component side. applyBusRouteCompletion is the ONE new
   * economy path in this build: it applies the shipped menu
   * route completion's effects (driveTransitToNextStop's
   * final-stop branch) -- +$144 pending wages, +8h clock,
   * recordEarning($144), +40 XP, the weekly countPaidShift
   * bonus -- PLUS setLastShiftDay(day), which the menu flow
   * applied at START (startTransitShift) and the drive applies
   * at completion instead, the same shape as the CITY_JOBS
   * 'wages' mission application. Guards: transitShiftPaidRef
   * (the shipped latch) + the drive's completedLatch + the
   * lastShiftDay check at START make a second payment
   * impossible. */
  const applyBusRouteCompletion = () => {
    if (transitShiftPaidRef.current) return null;
    if (!canEarn(earnedToday, earnedTodayDay, day, TRANSIT_SHIFT_PAY)) {
      return { paid: false, bonus: 0 };
    }
    transitShiftPaidRef.current = true;
    setPendingWages((v) => v + TRANSIT_SHIFT_PAY);
    setHours((h) => h + 8);
    recordEarning(TRANSIT_SHIFT_PAY);
    setXp((v) => v + TRANSIT_SHIFT_XP);
    setLastShiftDay(day);
    const bonus = countPaidShift();
    return { paid: true, bonus: bonus || 0 };
  };
  /* The completion lands when the depot doors finish: the
   * tick moves the drive to phase 'done', this effect applies
   * the pay once and latches the summary onto the drive. */
  React.useEffect(() => {
    const drv = busDriveRef.current;
    if (!drv || drv.phase !== 'done' || drv.completedLatch) return;
    const result = applyBusRouteCompletion();
    const cur = busDriveRef.current;
    if (cur) setBusDriveBoth({ ...cur, completedLatch: true, summaryPaid: !!(result && result.paid), summaryBonus: result ? result.bonus : 0 });
  }, [busDrive]);
  /* START ROUTE: the menu shift's eligibility, checked -- not
   * consumed. Hired + trained (the button only renders then,
   * but the guards stand anyway), no CITY_JOBS transit_route
   * mission active (it shares the daily shift), today's
   * allowance unused, the earnings cap has room. A legacy
   * menu-started shift is retired here: it never paid (menu
   * pay only landed on the final DRIVE tap, now retired), so
   * clearing it moves no money. Double-taps cannot start two
   * drives: one drive object, set once. */
  const startBusRoute = () => {
    if (busDriveRef.current && busDriveRef.current.active) return;
    if (transitEmployment !== 'hired' || transitTraining !== 'complete') return;
    if (activeMission && activeMission.kind === 'transit_route') {
      setTransitMessage('Finish or cancel your City Jobs bus route first -- it uses the same daily shift.');
      return;
    }
    if (lastShiftDay === day) {
      setTransitMessage("You already used today's work allowance. Come back tomorrow to drive.");
      return;
    }
    if (!canEarn(earnedToday, earnedTodayDay, day, TRANSIT_SHIFT_PAY)) {
      setTransitMessage(DAILY_LIMIT_MESSAGE);
      return;
    }
    if (transitShiftActive) {
      transitDriveRef.current = -1;
      transitBoardRef.current = -1;
      setTransitStop(0);
      setTransitAboard(0);
      setTransitBoarded(false);
      setTransitShiftActive(false);
    }
    transitShiftPaidRef.current = false;
    busInputRef.current = { left: false, right: false, gas: false, brake: false };
    setBusDriveBoth(busNewDrive());
    citySetPos(busDepotPoint());
    setGuideTargetId(null);
    clearPendingEnter(); /* NAVIGATION_EASE_V1_E10_DRIVE_CLEAR: a drive start retires any pending trip, with the guide + walk target clears above. */
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    setFindOpen(false);
    setMissionSummary(null);
    setTransitMessage('');
    setPlace(null);
  };
  const busInputSet = (key, down) => {
    busInputRef.current = { ...busInputRef.current, [key]: down };
  };
  const busDoorsPress = () => {
    const drv = busDriveRef.current;
    if (!drv || !drv.active || drv.paused) return;
    const next = busOpenDoors(drv, cityPosRef.current);
    if (next !== drv) setBusDriveBoth(next);
  };
  const busPauseDrive = () => {
    const drv = busDriveRef.current;
    if (!drv || !drv.active || drv.phase === 'done') return;
    busInputRef.current = { left: false, right: false, gas: false, brake: false };
    setBusDriveBoth({ ...drv, paused: true, exitConfirm: false });
  };
  const busResumeDrive = () => {
    const drv = busDriveRef.current;
    if (!drv || !drv.active) return;
    setBusDriveBoth({ ...drv, paused: false, exitConfirm: false });
  };
  const busAskExit = () => {
    const drv = busDriveRef.current;
    if (!drv || !drv.active) return;
    setBusDriveBoth({ ...drv, exitConfirm: true });
  };
  const busCancelExit = () => {
    const drv = busDriveRef.current;
    if (!drv || !drv.active) return;
    setBusDriveBoth({ ...drv, exitConfirm: false });
  };
  /* Exit (confirmed from the pause overlay, after the
   * explanation) and FINISH (from ROUTE COMPLETE) share one
   * teardown: clear the transient drive, put the player at
   * the Transit entrance. Exit applies NOTHING -- no wages,
   * no XP, no clock, lastShiftDay untouched, so START ROUTE
   * is available again immediately. */
  const busEndDrive = () => {
    busInputRef.current = { left: false, right: false, gas: false, brake: false };
    setBusDriveBoth(null);
    citySetPos(busDepotPoint());
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
    setLastInterestDay(-1); /* BANK_INTEREST_INT1_E08_RESTART: a fresh game starts with the interest latch unset. */
    setNeighborhoodFund({ balance: 0, startDay: -1, lastGrowthDay: -1 }); /* NEIGHBORHOOD_FUND_NFUND1_E12_RESTART: a fresh game starts with an empty fund and no growth clock... */
    nfundPending.current = false; /* ...and the fund gate re-arms, mirroring the shipped pending-ref resets around it. */
    setPropertyListings({ duplex: null, apartment: null, triplex: null }); /* PROPERTY_LISTINGS_PROP1_E08_RESTART: a fresh game has nothing listed... */
    setPropertyRebuyUntil({ duplex: -1, apartment: -1, triplex: -1 }); /* ...no rebuy cooldown running... */
    setPropertyListingPick(null); /* ...no asking-price picker open... */
    setPropertyOfferConfirm(null); /* ...and no accept confirmation open. */
    setMoneyHistory([]); /* MONEY_HISTORY_V1_E07_RESTART: a fresh game starts with an empty history. */
    setSavingsGoal(null); /* SAVINGS_GOALS_V1_E07_RESTART: a fresh game has no savings goal, and the goal form resets with it. */
    /* EXPLORE_CITY_V1_E11_RESTART: a fresh game starts on foot
     * at the HOME entrance, with no walk target or guide set. */
    cityPosRef.current = cityHomeEntrance();
    setCityPos(cityHomeEntrance());
    setRidingBike(null);
    setShowArrows(true); /* SKY_CITY_TRAVEL_V1_E07_RESTART: a fresh game shows the arrow controls. */
    cityDirRef.current = { x: 0, y: 0 };
    cityWalkTargetRef.current = null;
    setCityWalkTarget(null);
    setGuideTargetId(null);
    /* CITY_JOBS_V1_E09_RESTART: a fresh game has no mission
     * and a full delivery allowance. */
    setActiveMission(null);
    setDeliveryDay(-1);
    setDeliveryCount(0);
    setDeliveryPayWaiting(0); /* DELIVERY_ROUTES_DELIVERY1_E30_RESTART: a fresh game has no delivery pay waiting... */
    setDeliverySummary(null); /* DELIVERY_ROUTES_DELIVERY1_E30_RESTART: ...no route summary stored... */
    setDeliveryLastCollect(null); /* COLLECTION_UX_DELIVERY2_E12_RESTART: ...no collect stamp... */
    setDeliveryMessage(''); /* DELIVERY_ROUTES_DELIVERY1_E30_RESTART: ...no collect message... */
    deliveryCollectPending.current = false; /* DELIVERY_ROUTES_DELIVERY1_E30_RESTART: ...and the collect gate re-arms. */
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
    setBusinessUpgrades2([]); /* CLEANING_HAULING_EXPANSION_CHX1_E23_RESTART: tier-2 upgrades reset with the save... */
    setBizUpgrade2Confirm(null); /* CLEANING_HAULING_EXPANSION_CHX1_E23_RESTART: ...and no tier-2 confirm survives it. */
    setSelectedWorkVehicle(null); /* BUSINESS_EXPANSION_BIZX1_E08_RESTART: a fresh game has no work vehicle selected. */
    setManageBizId(null); /* FOOD_STAND_EXPANSION_FSX1_E18_RESTART_MANAGE: a fresh game is on no management screen (the state is declared far above, with the other save fields). */
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
    setFurnitureJustBought(false); /* CITY_NAVIGATION_V1_E11_BOUGHT_RESET: ...and no post-purchase shortcut. */
    setDisplayBike(null); /* MY_GARAGE_V1_E08_RESTART: a fresh game has no display pick stored. */
    /* DEALERSHIP_OWNERSHIP_DEAL1_E11_RESTART: a fresh
     * game owns no dealership, has no profit waiting,
     * no sales and no last sale, and the sale latch is
     * unset; the confirm and message clear with it. */
    setDealershipOwned(false);
    setDealershipProfit(0);
    setDealershipSales(0);
    setDealershipLastSale(null);
    setDealershipHistory([]); /* BUSINESS_HEADQUARTERS_HQ1_E08_RESTART: ...and no recorded customer sales. */
    setLastDealershipSaleDay(-1);
    setDealershipConfirm(false);
    setDealershipMessage('');
    /* DEALERSHIP_EXPANSION_DX1_E13_RESTART: a fresh game
     * starts at a level-1 showroom with no lifetime
     * profit earned and no notice waiting; the upgrade
     * confirm clears with the dealership's own. */
    setDealershipLevel(1);
    setDealershipLifetimeProfit(0);
    setDealershipNotice(null);
    setShowroomConfirm(false);
    setOwnedBikeColors(['factory']); /* BIKE_COLORS_V1_E08_RESTART: a fresh game owns only the factory color... */
    setAppliedBikeColor('factory'); /* BIKE_COLORS_V1_E08_APPLIED_RESET: ...and has it applied. */
    setHours(8);
    setBizWork({});
    setBizLifetimeEarnings({ cleaning: 0, hauling: 0, foodstand: 0 }); /* BUSINESS_MANAGEMENT_BM1_E10_RESTART: a fresh game has earned nothing from its businesses yet. */
    setBizJobHistory([]); /* CITY_BUSINESS_JOBS_CBJ1_E19_RESTART: a fresh game has completed no city jobs yet. */
    setBizWaiting({ cleaning: 0, hauling: 0, foodstand: 0 }); /* CLEANING_HAULING_EXPANSION_CHX1_E23B_RESTART_WAITING: a fresh game has no job profit waiting to collect... */ /* FOOD_STAND_EXPANSION_FSX1_E17_RESTART_POOL */
    setBizJobsDone({ cleaning: 0, hauling: 0, foodstand: 0 }); /* CLEANING_HAULING_EXPANSION_CHX1_E23B_RESTART_WAITING: ...and no completed jobs counted. */ /* FOOD_STAND_EXPANSION_FSX1_E17_RESTART_POOL */
    setMaeLastRound(null); /* MAES_PLACE_MAE1_E20_RESTART: a fresh game has served no Mae's Place customers -- the round record (and its latch) starts empty, with the rest of the business state. */
    bizCollectPending.current = false; /* CLEANING_HAULING_EXPANSION_CHX1_E23B_RESTART_WAITING: ...and the collect gate re-arms, mirroring the shipped dealershipCollectPending reset just above. */
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
          <TouchableOpacity style={styles.secondary} onPress={() => { setEmploymentMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO CITY</Text></TouchableOpacity>
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
          <TouchableOpacity style={styles.secondary} onPress={() => setPlace(benefitsFrom === 'WORK' ? 'WORK' : benefitsFrom === 'TRANSIT' ? 'TRANSIT' : 'EMPLOYMENT')}><Text style={styles.secondaryText}>{benefitsFrom === 'WORK' ? 'BACK TO WORK' : benefitsFrom === 'TRANSIT' ? 'BACK TO TRANSIT' : 'BACK TO EMPLOYMENT CENTER'}</Text></TouchableOpacity>{/* CITY_TRAVEL_GARAGE_V1_E05_BENEFITS_LABEL: the label mirrors the onPress destination ternary on this same button, reading the same benefitsFrom chain, so the label can never disagree with where the button goes. Handler untouched. */}
          {/* NAVIGATION_EASE_V1_E24_BENEFITS_CITY */}
          <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}><Text style={styles.secondaryText}>BACK TO CITY</Text></TouchableOpacity>
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
                  {scenePhase === 'ready' ? 'BACK TO WORK' : 'LEAVE SCENE'} {/* CITY_TRAVEL_GARAGE_V1_E06_SCENE_LABEL: the ready-phase button's onPress (above) goes to WORK and the label now says so; LEAVE SCENE is a complete label and stays. */}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.secondary}
                onPress={() => setPlace(null)}
              >
                <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
          {/* NAVIGATION_EASE_V1_E25_TRAINING_CITY */}
          <TouchableOpacity style={styles.secondary} onPress={() => { setTrainingMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO CITY</Text></TouchableOpacity>
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
            const pay = businessPay(biz, businessUpgrades, businessUpgrades2); /* CLEANING_HAULING_EXPANSION_CHX1_E16_WORK_CARD_PAY */
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
                  {/* CLEANING_HAULING_EXPANSION_CHX1_E17_WORK_TIER2: the tier-2 row for the two businesses that have one (E02), below the tier-1 block, wired to the same gate and handler as everywhere (E04/E12) -- one source of truth. Until tier 1 is owned there is no buy button: the line says to buy tier 1 first. */}
                  {bizTier2Upgrade(biz.id) && (businessUpgrades2.includes(biz.id) ? (
                    <Text style={styles.body}>{'Tier 2 owned: ' + bizTier2Upgrade(biz.id).name + ' — every job pays $' + bizTier2Upgrade(biz.id).pay + '.'}</Text>
                  ) : !upgraded ? (
                    <Text style={styles.body}>{'Tier 2 upgrade: ' + bizTier2Upgrade(biz.id).name + ' — $' + bizTier2Upgrade(biz.id).cost + ' from savings. Pay $' + biz.upgradePay + ' → $' + bizTier2Upgrade(biz.id).pay + ' per job. Buy ' + biz.upgradeName + ' first.'}</Text>
                  ) : bizUpgrade2Confirm !== biz.id ? (
                    <>
                      <Text style={styles.body}>{'Tier 2 upgrade: ' + bizTier2Upgrade(biz.id).name + ' — $' + bizTier2Upgrade(biz.id).cost + ' from savings. Pay $' + biz.upgradePay + ' → $' + bizTier2Upgrade(biz.id).pay + ' per job.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgrade2Confirm(biz.id)}
                      >
                        <Text style={styles.secondaryText}>{'UPGRADE TIER 2 — $' + bizTier2Upgrade(biz.id).cost}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View>
                      <Text style={styles.body}>{'Buy ' + bizTier2Upgrade(biz.id).name + ' for $' + bizTier2Upgrade(biz.id).cost + ' from savings? Every job will pay $' + bizTier2Upgrade(biz.id).pay + '.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => buyBusinessUpgrade2(biz.id)}
                      >
                        <Text style={styles.secondaryText}>{'CONFIRM TIER 2 — $' + bizTier2Upgrade(biz.id).cost}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgrade2Confirm(null)}
                      >
                        <Text style={styles.secondaryText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
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
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
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

          <View style={styles.reportPanel}>
            {/* READABILITY_VIS5_E13_HOME_PANEL: HOME's two intro lines sat unbacked on the bgHome photo; they take the shipped reportPanel backing now (the CITY4 pattern), text and body styles byte-identical inside it. */}
            <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}.</Text>

            <Text style={styles.body}>
            Rest until tomorrow to advance the calendar. Payday is Friday.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primary}
            onPress={restDay}
          >
            <Text style={styles.primaryText}>
              REST — WAKE UP {tomorrow.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* TABLET_FIXES_CITY5_E10_HOME_BUTTON: an obvious MY HOME door at the top of the HOME screen, directly under the header block (eyebrow, title, the two status lines and the REST button) and above the dealership notice and the life-event card -- entering the room no longer means scrolling through HOUSING GOAL, LIFE GOALS and REAL ESTATE to the secondary MY HOME button further down, which stays where it is, untouched. The tap is the existing entry's own call, setPlace('MY_HOME'), in the primary gold style; the MY HOME screen itself still shows its locked message until the player is housed, exactly as the shipped entry behaves. */}
          <TouchableOpacity
            style={styles.primary}
            onPress={() => setPlace('MY_HOME')}
          >
            <Text style={styles.primaryText}>🏠 MY HOME</Text>
          </TouchableOpacity>
          {/* READABILITY_VIS5_E15_NEXT_RENDER: the Next line (helper E14) in a reportPanel under the HOME header block -- below the MY HOME button, above the dealership notice and the LIFE EVENT card. One sibling Text on the panel; the snapshot is built inline from the component's shipped state in the same render pass, and the helper is a pure read, so nothing about the line can write, pay or persist. */}
          <View style={styles.reportPanel}>
            <Text style={styles.reportBody}>{vis5NextLine({ step: step, mission: activeMission, paycheck: paycheck, deliveryPayWaiting: deliveryPayWaiting, bizWaiting: bizWaiting, dealershipProfit: dealershipProfit, pendingWages: pendingWages, day: day })}</Text>
          </View>

          {/* DEALERSHIP_EXPANSION_DX1_E14_HOME_NOTICE: the
           * dealership sale notice, directly ABOVE the
           * life-event card so neither displaces the
           * other. The notice text is a single sibling
           * Text; DISMISS clears it, and walking into
           * the Dealership clears it too (E12). No sale,
           * no notice: the block renders nothing. */}
          {dealershipNotice ? (<>
            <Text style={styles.eyebrow}>DEALERSHIP</Text>
            <View style={[styles.card, styles.cardGold]}>
              <Text style={styles.body}>{dealershipNotice}</Text>
              <TouchableOpacity style={styles.secondary} onPress={() => setDealershipNotice(null)}>
                <Text style={styles.secondaryText}>DISMISS</Text>
              </TouchableOpacity>
            </View>
          </>) : null}

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
          <View style={styles.reportPanel}>
            {/* LISTING_READABILITY_READ1_E02_INTRO: the REAL ESTATE
                instructions sat directly on the bgHome photo in the
                muted body style (#b8c4d4 on a photo -- the VIS5 E13
                finding); they take the shipped DX2 reportPanel with
                reportBody text (#f2f5f9), like the HOME intro lines
                above. The sentence itself is PROP1's, byte-identical;
                only its backing and text style change. */}
            <Text style={styles.reportBody}>Buy a property with your savings. Each one pays rent every Friday. To sell, list a property at its buy price, 10% over, or 20% over, and a buyer offer arrives in 1 to 3 days. Accept it and the money goes into your savings; rent keeps paying until the sale.</Text> {/* PROPERTY_LISTINGS_PROP1_E14_UI_INTRO: the section's own instructions now describe the listing flow (E11/E13/E15); the sell-back sentence this replaces described a flow that no longer exists. */}
          </View>
          {PROPERTIES.map((prop) => {
            const owned = propertiesOwned.includes(prop.id);
            const creditOk = credit >= prop.credit;
            const affordable = savings >= prop.price;
            /* PROPERTY_LISTINGS_PROP1_E15_CARDS: the card's
               listing record (E03/E11/E13) and rebuy cooldown
               (E12) join the shipped owned / credit / savings
               reads. Inside its cooldown a property cannot be
               bought, and the button says when it is back. */
            const listing = propertyListings[prop.id];
            const rebuyUntilDay = propertyRebuyUntil[prop.id];
            const cooling = !owned && Number.isInteger(rebuyUntilDay) && day < rebuyUntilDay;
            const buyDisabled = owned || cooling || !creditOk || !affordable;
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
                    {owned ? 'OWNED' : cooling ? 'BACK IN ' + (rebuyUntilDay - day) + ((rebuyUntilDay - day) === 1 ? ' DAY' : ' DAYS') : !creditOk ? 'NEED CREDIT ' + prop.credit : !affordable ? 'NEED $' + prop.price + ' IN SAVINGS' : 'BUY - $' + prop.price}
                  </Text>
                </TouchableOpacity>
                {cooling && (
                  <Text style={styles.body}>{'The ' + prop.name + ' sold recently, so it is off the market for now. It is back on the market in ' + (rebuyUntilDay - day) + ((rebuyUntilDay - day) === 1 ? ' day' : ' days') + '.'}</Text>
                )}
                {/* PROPERTY_LISTINGS_PROP1_E15_LIST: an owned,
                    unlisted property offers LIST FOR SALE, then
                    the three approved asking prices (E11). */}
                {owned && !listing && propertyListingPick !== prop.id && (
                  <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => setPropertyListingPick(prop.id)}
                  >
                    <Text style={styles.secondaryText}>LIST FOR SALE</Text>
                  </TouchableOpacity>
                )}
                {owned && !listing && propertyListingPick === prop.id && (
                  <View>
                    <Text style={styles.body}>{'List the ' + prop.name + ' at:'}</Text>
                    {[prop.price, Math.round(prop.price * 1.1), Math.round(prop.price * 1.2)].map((ask) => (
                      <TouchableOpacity
                        key={ask}
                        style={styles.secondary}
                        onPress={() => { setPropertyListingPick(null); listProperty(prop.id, ask); }}
                      >
                        <Text style={styles.secondaryText}>{'LIST AT $' + ask}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setPropertyListingPick(null)}
                    >
                      <Text style={styles.secondaryText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* PROPERTY_LISTINGS_PROP1_E15_WAITING: listed,
                    no offer yet -- the ask shows as sibling
                    Texts in a row, and the only action is
                    cancelling the listing (E11). */}
                {owned && listing && listing.offer === null && (
                  <View style={styles.reportPanel}>
                    {/* LISTING_READABILITY_READ1_E03_WAITING: the block
                        takes the reportPanel backing and reportBody
                        text, and its status row gains flexWrap: 'wrap'
                        -- the shipped row never wrapped, so on Android
                        the trailing Text overflowed the card and
                        clipped (Zabby's tablet report). The three
                        sibling Texts, and the button below, keep their
                        shipped strings and handlers byte-identical. */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Listed at</Text>
                      <Text style={styles.reportBody}>{'$' + listing.ask}</Text>
                      <Text style={styles.reportBody}>— waiting for a buyer.</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => cancelPropertyListing(prop.id)}
                    >
                      <Text style={styles.secondaryText}>CANCEL LISTING</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {/* PROPERTY_LISTINGS_PROP1_E15_OFFER: a stored
                    offer waits for the player (it never
                    expires): the amount shows as sibling Texts
                    in a row, and ACCEPT sits behind a
                    confirmation step, like the sell it
                    replaces. REJECT keeps the listing up for
                    the next offer (E11). */}
                {owned && listing && listing.offer !== null && propertyOfferConfirm !== prop.id && (
                  <View style={styles.reportPanel}>
                    {/* LISTING_READABILITY_READ1_E04_OFFER: the same
                        treatment as the waiting block (E03) -- the
                        buyer line shared the non-wrapping row
                        construction and the unbacked body style. Its
                        two sibling Texts keep their strings; the
                        ACCEPT / REJECT / CANCEL LISTING buttons below
                        are byte-identical. */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Buyer offer:</Text>
                      <Text style={styles.reportBody}>{'$' + listing.offer}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setPropertyOfferConfirm(prop.id)}
                    >
                      <Text style={styles.secondaryText}>{'ACCEPT - $' + listing.offer}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => rejectPropertyOffer(prop.id)}
                    >
                      <Text style={styles.secondaryText}>REJECT OFFER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => cancelPropertyListing(prop.id)}
                    >
                      <Text style={styles.secondaryText}>CANCEL LISTING</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {owned && listing && listing.offer !== null && propertyOfferConfirm === prop.id && (
                  <View style={styles.reportPanel}>
                    {/* LISTING_READABILITY_READ1_E05_CONFIRM: the
                        confirmation question is part of the offer
                        state: same panel, same reportBody text. The
                        CONFIRM SALE / CANCEL buttons below are
                        byte-identical. */}
                    <Text style={styles.reportBody}>{'Sell the ' + prop.name + ' for $' + listing.offer + '? The money goes into your savings.'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => acceptPropertyOffer(prop.id)}
                    >
                      <Text style={styles.secondaryText}>{'CONFIRM SALE - $' + listing.offer}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setPropertyOfferConfirm(null)}
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
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
   * PLAYABLE_TRANSIT_V1_E09A_COMMENT: the screen is now a depot
   * interior and the loop is DRIVEN -- START ROUTE begins Drive
   * Mode on the map and completion applies the shipped route
   * effects exactly once via applyBusRouteCompletion. A menu
   * shift left active in an old save is retired by START ROUTE
   * (it never paid: menu pay landed only at completion).
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
          {/* PLAYABLE_TRANSIT_V1_E09B_DEPOT_ROOM: the Transit
              Center interior -- the bus waiting in BAY 1 on the
              left, the CITY LOOP route board on the right, the
              gold depot banner across the floor line. Art only,
              BUSINESS_INTERIORS_V1 style (flat Views + emoji);
              every working control below is the shipped one. */}
          <View style={styles.bizRoom}>
            <View style={styles.bizRoomWall}>
              <View style={styles.busBay}>
                <Text style={styles.busBaySign}>BAY 1</Text>
                <Text style={styles.busBayEmoji}>🚌</Text>
                <Text style={styles.busBaySign}>{transitBus}</Text>
              </View>
              <View style={styles.bizBoard}>
                <Text style={styles.bizBoardTitle}>CITY LOOP - ROUTE BOARD</Text>
                <Text style={styles.bizBoardLine}>1 - Transit Depot (start)</Text>
                <Text style={styles.bizBoardLine}>2 - Residential - pick up</Text>
                <Text style={styles.bizBoardLine}>3 - Downtown - pick up</Text>
                <Text style={styles.bizBoardLine}>4 - Casino District - pick up</Text>
                <Text style={styles.bizBoardLine}>5 - Transit Depot (finish)</Text>
                <Text style={styles.bizBoardLine}>Pay: $144 + 40 XP - one shift a day</Text>
              </View>
            </View>
            <View style={styles.bizRoomFloor} />
            <View style={styles.bizGoldBanner}>
              <Text style={styles.bizGoldBannerText}>SKY CITY TRANSIT - DEPOT</Text>
            </View>
          </View>
          {transitEmployment === 'none' ? (<>
            <Text style={styles.body}>Drive the City Loop and earn $144 per completed route shift. Training pays $144 too.</Text>
            <TouchableOpacity style={styles.primary} onPress={applyForTransit}><Text style={styles.primaryText}>APPLY FOR BUS DRIVER</Text></TouchableOpacity>
          </>) : transitTraining === 'incomplete' ? (<>
            <Text style={styles.body}>Paid training covers passenger boarding, safe stops, and operating the bus. Training uses today's work allowance.</Text>
            <TouchableOpacity style={styles.primary} onPress={completeTransitTraining}><Text style={styles.primaryText}>COMPLETE PAID TRAINING</Text></TouchableOpacity>
            {shiftDoneToday && (<Text style={styles.body}>You already used today's work allowance. Training is available again tomorrow.</Text>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('TRANSIT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>) : !transitShiftActive ? (<>
            <Text style={styles.body}>Route: City Loop — Transit Depot → Residential → Downtown → Casino District → Transit Depot. Now you drive it yourself: follow the gold dots, stop inside each stop's ring, and open the doors for passengers. Finish back here at the depot. One shift per day, $144 when you complete the route.</Text>
            {/* PLAYABLE_TRANSIT_V1_E09C_START_ROUTE */}
            <TouchableOpacity style={styles.primary} onPress={startBusRoute}><Text style={styles.primaryText}>START ROUTE</Text></TouchableOpacity>
            {shiftDoneToday && (<Text style={styles.body}>You already used today's work allowance. Driving is available again tomorrow.</Text>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('TRANSIT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>) : (<>
            <Text style={styles.body}>{'Bus: ' + transitBus}</Text>
            {TRANSIT_STOPS.map((stop, i) => (
              <Text key={stop.id} style={i === transitStop ? styles.transitStopCurrent : styles.body}>
                {(i === transitStop ? '▶ ' : '') + stop.name + (i === transitStop ? ' — ' + waitingNow + ' waiting, ' + transitAboard + ' aboard' : '')}
              </Text>
            ))}
            {/* PLAYABLE_TRANSIT_V1_E09D_LEGACY_SHIFT: this
                shift was started on the old menu board. It paid
                nothing -- pay only ever landed when a route was
                finished -- so retiring it moves no money. */}
            <Text style={styles.body}>This shift was started on the old menu board. It paid nothing -- pay only lands when a route is finished. START ROUTE retires it and puts you in the driver's seat for the real drive.</Text>
            <TouchableOpacity style={styles.primary} onPress={startBusRoute}><Text style={styles.primaryText}>START ROUTE</Text></TouchableOpacity>
          </>)}
          {transitMessage !== '' && (<Text style={styles.body}>{transitMessage}</Text>)}
          <TouchableOpacity style={styles.secondary} onPress={() => { setTransitMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO CITY</Text></TouchableOpacity>
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
            {/* DEALERSHIP_OWNERSHIP_DEAL1_E12_SCREEN: the
             * ownership section — status, sales and
             * collectable profit when owned; the buy
             * offer and its confirm step when not. All
             * values are sibling Texts (no nested-Text
             * constructions). Buying runs through
             * buyDealership above; collecting through
             * collectDealershipProfit. The personal
             * bike list below is untouched. */}
            <Text style={styles.title}>OWN THE DEALERSHIP</Text>
            {dealershipOwned ? (<>
              <Text style={styles.body}>You own this dealership.</Text>
              <Text style={styles.body}>{'Total sales: ' + dealershipSales}</Text>
              {dealershipLastSale && (
                <Text style={styles.body}>{'Last sale: ' + dealershipLastSale.name + ' — profit $' + dealershipLastSale.profit}</Text>
              )}
              <Text style={styles.body}>{'Profit available: $' + dealershipProfit}</Text>
              <TouchableOpacity
                style={[styles.secondary, dealershipProfit <= 0 && { opacity: 0.5 }]}
                disabled={dealershipProfit <= 0}
                onPress={() => collectDealershipProfit()}
              >
                <Text style={styles.secondaryText}>{'COLLECT TO CASH — $' + dealershipProfit}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondary, dealershipProfit <= 0 && { opacity: 0.5 }]}
                disabled={dealershipProfit <= 0}
                onPress={() => depositDealershipProfit()}
              >
                <Text style={styles.secondaryText}>{'DEPOSIT TO SAVINGS — $' + dealershipProfit}</Text>
              </TouchableOpacity>
              {/* DEALERSHIP_EXPANSION_DX1_E15_SCREEN_UPGRADE:
               * the showroom upgrade -- price and benefits
               * in plain lines BEFORE any purchase, a
               * two-step confirm in the house shape, and
               * no buy button at all once upgraded. Buying
               * runs through buyDealershipShowroom above;
               * the button disables while savings are
               * short, with the shortfall spelled out. */}
              <Text style={styles.sectionTitle}>SHOWROOM UPGRADE</Text>
              {dealershipLevel >= 2 ? (
                <Text style={styles.body}>Showroom: Level 2 — 2 sales/day · 25% profit margin</Text>
              ) : showroomConfirm ? (<>
                <Text style={styles.body}>{'Pay $' + DEALERSHIP_SHOWROOM_COST + ' from savings? Savings after: $' + (savings - DEALERSHIP_SHOWROOM_COST)}</Text>
                <TouchableOpacity style={styles.secondary} onPress={() => buyDealershipShowroom()}>
                  <Text style={styles.secondaryText}>{'CONFIRM UPGRADE — $' + DEALERSHIP_SHOWROOM_COST}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={() => { setShowroomConfirm(false); setDealershipMessage('Showroom upgrade cancelled. No savings spent.'); }}>
                  <Text style={styles.secondaryText}>CANCEL</Text>
                </TouchableOpacity>
              </>) : (<>
                <Text style={styles.body}>{'Price: $' + DEALERSHIP_SHOWROOM_COST + ' from savings'}</Text>
                <Text style={styles.body}>2 customer sales per day (now 1)</Text>
                <Text style={styles.body}>Profit margin 25% (now 20%)</Text>
                <Text style={styles.body}>Example: Iron 883 profit $300 → $375</Text>
                <Text style={styles.body}>{'Your savings: $' + savings}</Text>
                <TouchableOpacity
                  style={[styles.secondary, savings < DEALERSHIP_SHOWROOM_COST && { opacity: 0.5 }]}
                  disabled={savings < DEALERSHIP_SHOWROOM_COST}
                  onPress={() => setShowroomConfirm(true)}
                >
                  <Text style={styles.secondaryText}>{'UPGRADE SHOWROOM — $' + DEALERSHIP_SHOWROOM_COST + ' (SAVINGS)'}</Text>
                </TouchableOpacity>
                {savings < DEALERSHIP_SHOWROOM_COST && (
                  <Text style={styles.body}>{'Not enough savings. You need $' + (DEALERSHIP_SHOWROOM_COST - savings) + ' more saved.'}</Text>
                )}
              </>)}
              {/* DEALERSHIP_REPORT_CONTRAST_DX2_E03_WRAP: the
               * report block and the sales-history block
               * below it sit together on one dark panel so
               * their light text stays readable over the
               * bright dealership photo. Inside the panel only, the titles use
               * the new light title style and the lines use
               * the new light body style. Every text string
               * below is byte-identical to the shipped
               * DX1 / HQ1 text. */}
              <View style={styles.reportPanel}>
                {/* DEALERSHIP_EXPANSION_DX1_E16_SCREEN_REPORT:
                 * the dealership report -- the four numbers
                 * of the business, each a sibling Text,
                 * directly above the sales history it
                 * summarizes. Owners only: it lives inside
                 * the owned branch with the rest of the
                 * ownership section. */}
                <Text style={styles.reportTitle}>DEALERSHIP REPORT</Text>
                <Text style={styles.reportBody}>{'Total bikes sold: ' + dealershipSales}</Text>
                <Text style={styles.reportBody}>{'Lifetime profit: $' + dealershipLifetimeProfit}</Text>
                <Text style={styles.reportBody}>{'Profit waiting: $' + dealershipProfit}</Text>
                <Text style={styles.reportBody}>{'Showroom: Level ' + dealershipLevel}</Text>
                {/* BUSINESS_HEADQUARTERS_HQ1_E12_SCREEN: the
                 * recorded customer sales, newest first.
                 * Storage is oldest-first, so the screen
                 * renders a reversed copy; each row is one
                 * sibling Text keyed by day + position, with
                 * the game's own weekday for the sale day.
                 * Sales from before HQ1 were never recorded
                 * -- the Last sale line above still shows
                 * the most recent one. */}
                <Text style={styles.reportTitle}>SALES HISTORY</Text>
                {dealershipHistory.length === 0 ? (
                  <Text style={styles.reportBody}>No customer sales recorded yet.</Text>
                ) : (
                  [...dealershipHistory].reverse().map((saleEntry, saleIndex) => (
                    <Text key={saleEntry.day + '-' + saleIndex} style={styles.reportBody}>{DAY_NAMES[saleEntry.day % 7] + ' — ' + saleEntry.name + ' — profit $' + saleEntry.profit}</Text>
                  ))
                )}
              </View>
            </>) : dealershipConfirm ? (<>
              <Text style={styles.body}>{'Buy the Harley Dealership for $' + DEALERSHIP_PRICE + ' from savings?'}</Text>
              <Text style={styles.body}>{'Savings after purchase: $' + (savings - DEALERSHIP_PRICE) + '.'}</Text>
              <TouchableOpacity style={styles.secondary} onPress={() => buyDealership()}>
                <Text style={styles.secondaryText}>{'CONFIRM BUY — $' + DEALERSHIP_PRICE}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondary} onPress={() => { setDealershipConfirm(false); setDealershipMessage('Purchase cancelled. No savings spent.'); }}>
                <Text style={styles.secondaryText}>CANCEL</Text>
              </TouchableOpacity>
            </>) : (<>
              <Text style={styles.body}>Own the dealership and earn profit when customers buy bikes — one sale a day, and the profit waits here for you to collect.</Text>
              <Text style={styles.body}>{'Your savings: $' + savings}</Text>
              {savings >= DEALERSHIP_PRICE ? (
                <TouchableOpacity style={styles.secondary} onPress={() => setDealershipConfirm(true)}>
                  <Text style={styles.secondaryText}>{'BUY DEALERSHIP — $' + DEALERSHIP_PRICE + ' (SAVINGS)'}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.body}>{'Not enough savings. You need $' + (DEALERSHIP_PRICE - savings) + ' more saved.'}</Text>
              )}
            </>)}
            {!!dealershipMessage && <Text style={styles.body} accessibilityLiveRegion="polite">{dealershipMessage}</Text>}
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
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            <CasinoFloorScene />{/* CASINO_INTERIOR_CASINOART1_E03_RENDER: the drawn casino floor (E02) shows on this floor view only, between the Cash line and the game picker; the slots, blackjack and roulette panels never render it. */}
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
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
                    <ScrollView contentContainerStyle={styles.page}>{/* EXPANSION_DEL1_K_BANKPAD: BANK was the only screen without the page padding (audit 4b) -- its bottom buttons rendered flush and half-clipped; now the same shell as every other screen. */}
                            <Text style={styles.title}>BANK</Text>
                            {/* LOOKPASS_V1: bank icons. */}
                            <View style={styles.iconRow}>
                              <Image source={ART.bankBuilding} style={styles.iconImg} resizeMode="contain" />
                              <Image source={ART.bankJar} style={styles.iconImg} resizeMode="contain" />
                              <Image source={ART.bankDeposit} style={styles.iconImg} resizeMode="contain" />
                            </View>

                                    <Text style={styles.body}>{'Cash: $' + cash}</Text>
                                            <Text style={styles.body}>{'Savings: $' + savings}</Text>
                                                    {/* BANK_INTEREST_INT1_E10_BANK_TEXT: the real interest rule, stated where the player banks -- the Friday interest routine (E09) pays it into savings. The base file makes NO other interest claim anywhere (swept file-wide: zero 'interest' hits, HELP included), so this line is the only player-facing interest text. */}
                                                    <Text style={styles.body}>Interest: 1% of savings, paid every Friday.</Text>
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
                                                    {/* BUSINESS_HEADQUARTERS_HQ1_E13_BANK_BUTTON: opens the
                                                     * MY BUSINESSES dashboard. Display only -- the
                                                     * dashboard itself collects nothing. */}
                                                    <TouchableOpacity
                                                      style={styles.secondary}
                                                      onPress={() => setPlace('MY_BUSINESSES')}
                                                    >
                                                      <Text style={styles.secondaryText}>MY BUSINESSES</Text>
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
                            {/* NEIGHBORHOOD_FUND_NFUND1_E13_BANK_CARD: the Neighborhood Fund card, directly under the bond and fund in the same INVESTMENTS area and the same plain body/secondary styling those cards use. It stands outside the $2,000 investments gate above because its own unlock is different: owning any business. Locked, it shows one plain note and no buttons. Unlocked, it shows the current value, the growth line, the three put-in buttons (disabled with the shipped NEED label while savings cannot cover the amount, mirroring BUY BOND / BUY FUND), and the sell button while a balance stands. Every value renders inside its own single Text -- no nested Text spans. */}
                            <Text style={styles.body}>{'Neighborhood Fund - put money in from savings and watch it grow. Sell any time for its current value.'}</Text>
                            {ownedBusinesses.length === 0 ? (
                              <Text style={styles.body}>The Neighborhood Fund unlocks when you own a business.</Text>
                            ) : (<>
                              <Text style={styles.body}>{'Your Neighborhood Fund is worth $' + neighborhoodFund.balance + '.'}</Text>
                              <Text style={styles.body}>{'Grows 5% every 5 days.'}</Text>
                              {NFUND_AMOUNTS.map((amount) => (
                                <TouchableOpacity key={'nfund-buy-' + amount} style={[styles.secondary, savings < amount && { opacity: 0.5 }]} disabled={savings < amount} onPress={() => buyNeighborhoodFund(amount)}>
                                  <Text style={styles.secondaryText}>{savings < amount ? 'NEED $' + amount + ' IN SAVINGS' : 'PUT IN $' + amount}</Text>
                                </TouchableOpacity>
                              ))}
                              {neighborhoodFund.balance > 0 && (
                                <TouchableOpacity style={styles.secondary} onPress={sellNeighborhoodFund}>
                                  <Text style={styles.secondaryText}>{'SELL NEIGHBORHOOD FUND - $' + neighborhoodFund.balance}</Text>
                                </TouchableOpacity>
                              )}
                            </>)}
                                                                                                                                                                                                                                                                                <TouchableOpacity
                                                                                                                                                                                                                                                                                          style={styles.secondary}
                                                                                                                                                                                                                                                                                                    onPress={() => setPlace(null)}
                                                                                                                                                                                                                                                                                                            >
                                                                                                                                                                                                                                                                                                                      <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            {/* NAVIGATION_EASE_V1_E20_BANK_CITY: nested bank screens keep BACK TO BANK and gain a direct exit to the map. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            {/* NAVIGATION_EASE_V1_E20_BANK_CITY: nested bank screens keep BACK TO BANK and gain a direct exit to the map. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
                    <Text style={styles.progressLine}>{entry.label + ' \u2014 ' + lines.amountText}</Text>
                    <Text style={styles.progressLine}>{lines.dayText + ' \u2014 ' + lines.balanceText}</Text>
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
            {/* NAVIGATION_EASE_V1_E20_BANK_CITY: nested bank screens keep BACK TO BANK and gain a direct exit to the map. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            {/* NAVIGATION_EASE_V1_E20_BANK_CITY: nested bank screens keep BACK TO BANK and gain a direct exit to the map. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
              <Text style={styles.progressLine}>{'Total XP: ' + summary.xp + ' \u2014 Level ' + summary.level}</Text>{/* VIS5F_XP_LABEL */}
              <Text style={styles.progressLine}>{'XP to next level: ' + xpToNext}</Text>{/* READABILITY_VIS5_E12_XP_PROGRESS: MY PROGRESS gains the to-next figure it never showed, reading the same component-scope xpToNext the header row uses -- a display line only; progressSummary and the XP derivation are untouched. */}
              <View style={vis.progressCoinRow}><CoinIcon size={15} /><Text style={[styles.progressLine, vis.progressLineFlat]}>{'Coins: ' + summary.coins}</Text></View>{/* VISUAL_V1_E17_PROGRESS_COIN */}
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
            {/* NAVIGATION_EASE_V1_E21_PROGRESS_CITY */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
            <View style={vis.coinLineRow}><CoinIcon size={20} /><Text style={[styles.body, vis.coinLineText]}>{'Your coins: ' + coins}</Text></View>{/* VISUAL_V1_E15A_COINLINE */}
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
                        <View style={vis.coinPriceRow}><CoinIcon size={15} /><Text style={styles.secondaryText}>{afford ? 'BUY - ' + outfit.price + ' COINS' : 'NEED ' + outfit.price + ' COINS'}</Text></View>{/* VISUAL_V1_E16A_COINPRICE */}
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
            {/* NAVIGATION_EASE_V1_E22_COIN_SHOP_CITY */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
        /* HOME_INTERIOR_HOME1_E03_RENDER_SOFA: the placed sofa draws the realistic sprite now (FURNITURE_V1_ART.sofa, 512x188 at 92x34 in home1ImgSofa) instead of the drawn charcoal Views. Same renderSpotPiece branch, same homePieceWrap + name chip around it; the drawn styles stay defined for the black-and-gold sofa and the armchair, which keep them. */
        return <Image source={FURNITURE_V1_ART.sofa} style={styles.home1ImgSofa} resizeMode="contain" />;
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
        /* HOME_INTERIOR_HOME1_E04_RENDER_TABLE: the coffee table draws the realistic sprite now (FURNITURE_V1_ART.coffee_table, 512x310 at 64x39 in home1ImgTable) instead of the drawn glass View. Same branch, same wrap and chip. */
        return <Image source={FURNITURE_V1_ART.coffee_table} style={styles.home1ImgTable} resizeMode="contain" />;
      }
      if (pieceId === 'plant') {
        return <Text style={styles.homePlantEmoji}>{'🪴'}</Text>;
      }
      /* FURNITURE_STORE_V1_E11C_RENDER: the cash furniture
       * drawn in its spot -- the lamp and the armchair as
       * drawn pieces (like the sofas), the bookshelf as
       * its glyph. */
      if (pieceId === 'lamp') {
        /* HOME_INTERIOR_HOME1_E05_RENDER_LAMP: the floor lamp draws the realistic sprite now (FURNITURE_V1_ART.lamp, 147x512 at 16x56 in home1ImgLamp) instead of the drawn shade/pole/base stack. Same branch, same wrap and chip. */
        /* LAMP_NAV_HOME2F_E04_LAMP_STRETCH: the lamp branch alone changes fit, contain -> stretch. Under contain the 147x512 sprite is height-bound: at 70 tall it renders 70 x 147/512 = 20.1 wide whatever the box width, so the E03 widening could never paint a single extra pixel -- the sliver Zabby still saw after HOME2. Stretch fills the 30x70 box exactly (the sprite stretches 1.49x horizontally). Same source, same style key, same wrap and name chip; the other three branches keep contain and their natural aspect. */
        return <Image source={FURNITURE_V1_ART.lamp} style={styles.home1ImgLamp} resizeMode="stretch" />;
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
        /* HOME_INTERIOR_HOME1_E06_RENDER_BOOKSHELF: the bookshelf draws the realistic sprite now (FURNITURE_V1_ART.bookshelf, 358x512 at 40x57 in home1ImgBookshelf) instead of the books glyph. Same branch, same wrap and chip; the plant keeps the glyph style. */
        return <Image source={FURNITURE_V1_ART.bookshelf} style={styles.home1ImgBookshelf} resizeMode="contain" />;
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
          {/* HOME_INTERIOR_HOME1_E14_SPOT_LABEL: the DECORATE spot labels were white text with only a shadow over the bright room; the layered home1SpotLabel gives the same label a solid dark backing bar. The shared homeSpotName style is untouched -- this layers on it. (The marker comment stands before the conditional: a JSX comment cannot live inside its parenthesized branch.) */}
          {homeDecorating && (
            <Text style={[styles.homeSpotName, styles.home1SpotLabel]}>{spot.name}</Text>
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
            {/* LAMP_NAV_HOME2F_E02_HOME_TOP_BACK: MY HOME carried the same BACK TO HOME button twice in this one unconditional return -- this copy at the top of the scroll and the clip-classed copy at the bottom (HOME2 E07). Both sat outside the locked-room, room-view and Decorate conditionals, so every state of the screen showed both. The top copy is removed; the bottom copy is now the screen's single back button in every state, and no exit is lost: Decorate still leaves via its DONE control and the room view keeps its own BACK TO CITY. */}

            <Text style={styles.eyebrow}>MY HOME</Text>
            <Text style={styles.title}>My Home</Text>

            {!housed ? (
              <>
                {/* HOME_INTERIOR_HOME1_E12_PANEL_LOCKED: the locked-room pair sat directly on the bright menu photo; both lines take the DX2 dark panel and the near-white report body, words unchanged. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportBody}>MY HOME is locked. You need a home of your own first.</Text>
                  <Text style={styles.reportBody}>Sign a lease at HOME to unlock decorating. Once you are housed, you can spend coins on decorations and make the place yours.</Text>
                </View>
              </>
            ) : (
              <>
                {/* HOME_INTERIOR_HOME1_E09_PANEL_COINLINE: the coin line sat directly on the bright menu photo; it takes the DX2 dark panel (reportPanel) so the label and the count read clearly. The row and its two sibling Texts keep their shipped styles byte-for-byte -- the RID1 sibling construction is load-bearing and is not restyled, only backed. */}
                <View style={styles.reportPanel}>
                  <View style={vis.coinLineRow}><CoinIcon size={20} /><Text style={[styles.body, vis.coinLineText]}>{'Your coins: '}</Text><Text style={[styles.body, vis.coinLineText, vis.coinLineNum]}>{coins}</Text></View>
                </View>{/* GARAGE_RIDING_RID1_E02_COIN_SIBLINGS: the count is a SIBLING Text now, not a nested span -- the GAR1 construction this replaces was the only nested-Text value render in the app, and the Android text path can drop a flattened inner span (label paints, amount blank) while web paints the same code fine. Two sibling Texts are each their own native view; nothing to flatten or drop. Same live coins binding, same row, and the number keeps its gold/900 emphasis via the existing coinLineNum style reused on the sibling. */}{/* VISUAL_V1_E15B_COINLINE */}{/* CITY_TRAVEL_GARAGE_V1_E08_COIN_NUM: readability restyle ONLY (the audit proved the count already rendered inside this same Text node) -- the count is now its own gold bold span so the figure reads as a figure. Same live coins state, same row, no other coin line changes. */}
                {/* HOME_INTERIOR_HOME1_E10_PANEL_INTRO: the living-room intro sat directly on the bright menu photo; it takes the DX2 dark panel and the near-white report body, words unchanged. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportBody}>This is your living room. Furniture never changes wages, credit, or savings.</Text>
                </View>

                {/* HOME_INTERIOR_HOME1_E11_PANEL_MESSAGE: the room's result message takes the DX2 dark panel + report body; the message gate and words are unchanged. */}
                {decorMessage !== '' && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportBody}>{decorMessage}</Text>
                  </View>
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
                    {/* HOME_INTERIOR_HOME1_E16_GLOW_HITSLOP: the accent-light strip is the one sub-44 control on this screen (9 units tall); hitSlop widens its touch band to ~45 units with zero visual change -- the strip still draws exactly as shipped, and the touchable is only enabled in DECORATE mode, as before. (The marker comment stands before the ternary: a JSX comment cannot live inside an opening tag or a parenthesized branch.) */}
                    {lightPlaced ? (
                      <TouchableOpacity
                        style={[styles.homeGlowStrip, slotPicked('accent_light') && styles.homeSlotPicked]}
                        hitSlop={{ top: 18, bottom: 18, left: 0, right: 0 }}
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
                      <View style={styles.homeWindowPane}>
                        {slotGhost('curtains', 'slot_curtains', curtainsPlaced) && (
                          <Text style={styles.homeGhostGlyph}>{'🟦'}</Text>
                        )}
                      </View>
                      {/* HOME_INTERIOR_HOME1_E07_WALL_CURTAINS: while the curtains sit in their wall slot, the window shows the realistic sprite (FURNITURE_V1_ART.curtains, filling the window inside its frame) instead of the two drawn side panels. The frame, the pane and the decorate ghost are the shipped ones; the image is the last child so it paints over the pane, and it renders only while placed -- the same gate the panels had. */}
                      {curtainsPlaced && <Image source={FURNITURE_V1_ART.curtains} style={styles.home1CurtainsImg} resizeMode="cover" />}
                    </TouchableOpacity>
                    {artPlaced ? (
                      <TouchableOpacity
                        style={[styles.homeArtwork, slotPicked('wall_art') && styles.homeSlotPicked]}
                        disabled={!homeDecorating}
                        activeOpacity={1}
                        onPress={() => tapHomeSlot('slot_art')}
                      >
                        {/* HOME_INTERIOR_HOME1_E08_WALL_ART: the framed picture shows the realistic sprite now (FURNITURE_V1_ART.wall_art, filling the frame inside its gold border) instead of the drawn sun and hill. The frame, its slot touchable and the placed gate are the shipped ones. */}
                        <Image source={FURNITURE_V1_ART.wall_art} style={styles.home1WallArtImg} resizeMode="cover" />
                      </TouchableOpacity>
                    ) : (homeDecorating && (
                      <TouchableOpacity
                        style={styles.homeArtworkEmpty}
                        activeOpacity={1}
                        onPress={() => tapHomeSlot('slot_art')}
                      >
                        {slotGhost('wall_art', 'slot_art', artPlaced)
                          ? <Text style={styles.homeGhostGlyph}>{'🖼️'}</Text>
                          : <Text style={[styles.homeSlotTag, styles.home1SlotTag]}>ART</Text>}{/* HOME_INTERIOR_HOME1_E15_SLOT_TAG: the ART slot placeholder tag was gold text on the near-clear dashed frame over the cream wall; the layered home1SlotTag gives it a solid dark chip. The shared homeSlotTag style is untouched -- this layers on it. */}
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
                        <Text style={styles.secondaryText}>BACK TO CITY</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {/* HOME_INTERIOR_HOME1_E13_PANEL_HINT: the Decorate-mode instruction line sat directly on the bright menu photo; it takes the DX2 dark panel and the near-white report body, words unchanged. */}
                    <View style={styles.reportPanel}>
                      <Text style={styles.reportBody}>Tap a piece, then tap a spot to place it. Rearranging is free.</Text>
                    </View>
                    <View style={styles.homeBtnGap}>
                      <TouchableOpacity
                        style={[styles.primary, styles.big1HomeDoneBtn]}
                        onPress={() => { setHomeSelectedPiece(null); setHomeDecorating(false); }}
                      >
                        <Text style={[styles.primaryText, styles.big1HomeBtnText]}>DONE</Text>{/* BIG_PACKAGE_BIG1_E11_DONE_BIGGER: same button, same press, same shared base styles -- only the B10 cluster overrides layered on (bigger text, taller control). */}
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
                        /* CITY_NAVIGATION_V1_E14_TRAY_CHIPS: one
                         * plain-language action chip per row --
                         * what this row's tap does (or where the
                         * piece is bought). Presentation only:
                         * the select handler and the coin BUY
                         * below are the shipped ones, untouched. */
                        const chipText = selected
                          ? 'SELECTED ✓'
                          : owned
                            ? 'SELECT TO PLACE'
                            : isFurniture
                              ? 'IN FURNITURE SHOP · $' + furnitureById(piece.id).price
                              : 'BUY · ' + decorationById(piece.id).price + ' COINS';
                        return (
                          <View key={piece.id} style={styles.coinShopRow}>
                            <View style={[styles.homeTrayRow, selected && styles.homeTrayRowSelected]}>
                              <TouchableOpacity
                                style={styles.homeTrayMain}
                                onPress={() => selectHomePiece(piece.id)}
                                disabled={!owned}
                              >
                                <Text style={[styles.progressLine, styles.homeTrayName]}>
                                  {(selected ? '▶ ' : '') + piece.name}
                                </Text>
                                <Text style={styles.body}>
                                  {!owned
                                    ? (isFurniture ? 'In the Furniture Shop · $' + furnitureById(piece.id).price + ' cash' : 'Not owned yet')
                                    : placedSpot
                                      ? 'PLACED · ' + homeLocationById(placedSpot).name
                                      : 'IN TRAY'}
                                </Text>
                                <View style={styles.homeTrayChip}>
                                  <Text style={styles.homeTrayChipText}>{chipText}</Text>
                                </View>
                              </TouchableOpacity>
                              {!owned && isDecoration && (
                                <TouchableOpacity
                                  style={styles.secondary}
                                  onPress={() => buyDecoration(piece.id)}
                                  disabled={!afford}
                                >
                                  <View style={vis.coinPriceRow}><CoinIcon size={15} /><Text style={styles.secondaryText}>{afford ? 'BUY - ' + decorationById(piece.id).price + ' COINS' : 'NEED ' + decorationById(piece.id).price + ' COINS'}</Text></View>{/* VISUAL_V1_E16B_COINPRICE */}
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        );
                      })}
                      {homeSelectedPiece && (
                        <TouchableOpacity
                          style={[styles.secondary, styles.big1HomeAwayBtn]}
                          onPress={putAwaySelectedHomePiece}
                        >
                          <Text style={[styles.secondaryText, styles.big1HomeAwayText]}>PUT AWAY</Text>{/* BIG_PACKAGE_BIG1_E12_PUTAWAY_BIGGER: same button, same press, same shared base styles -- only the B10 cluster overrides layered on (bigger text, taller control). */}
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* ROOM_SCALE_HOME2_E06_DECORATE_CITY_BTN: Decorate mode carried its own BACK TO CITY directly above the screen's always-present BACK TO HOME -- two back buttons stacked, the top one reading as a stray. It is removed: Decorate exits via its DONE control to the room, the view mode keeps its own BACK TO CITY, and BACK TO HOME below remains the screen's back button in both modes. No exit is lost. */}
                  </>
                )}
              </>
            )}

            {/* ROOM_SCALE_HOME2_E07_HOME_BACK_CLIP: the screen's always-present back button takes the CITY3 clip class (single-line shrink-to-fit), like the shop's kept pair in E05. Word and handler unchanged. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('HOME')}
            >
              <Text style={styles.secondaryText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>BACK TO HOME</Text>
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
    const furnitureBackLabel = furnitureReturn === 'MY_HOME' ? 'BACK TO MY HOME' : furnitureReturn === 'STORE' ? 'BACK TO STORE' : 'BACK TO CITY'; /* NAVIGATION_EASE_V1_E19_FURNITURE_LABEL */
    const furnitureBack = () => {
      setFurnitureConfirm(null);
      setFurnitureMessage('');
      setFurnitureJustBought(false); /* CITY_NAVIGATION_V1_E12_BACK_CLEARS: leaving by BACK retires the GO TO MY HOME shortcut too. */
      if (furnitureReturn === 'MY_HOME') setPlace('MY_HOME');
      else if (furnitureReturn === 'STORE') setPlace('STORE');
      else setPlace(null);
      setFurnitureReturn(null);
    };
    /* NAVIGATION_EASE_V1_E26A_FURNITURE_CITY: BACK TO CITY --
     * furnitureBack's own transient cleanup, straight to the
     * map; the exit watcher respawns the player at the
     * entrance of the building the shop was entered from. */
    const furnitureBackToCity = () => {
      setFurnitureConfirm(null);
      setFurnitureMessage('');
      setFurnitureJustBought(false);
      setPlace(null);
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

            {/* CITY_NAVIGATION_V1_E13_GO_HOME_BUTTON: right
                after a successful purchase, one tap straight
                to the room where the new piece is placed.
                Shown only while the bought flag stands; using
                it (or BACK) clears the shop transients. If the
                player is not housed, MY HOME shows its shipped
                locked text, as it does from its other doors. */}
            {furnitureJustBought && (
              <TouchableOpacity
                style={styles.primary}
                onPress={() => { setFurnitureJustBought(false); setFurnitureConfirm(null); setFurnitureMessage(''); setPlace('MY_HOME'); }}
              >
                <Text style={styles.primaryText}>GO TO MY HOME</Text>
              </TouchableOpacity>
            )}

            {/* ROOM_SCALE_HOME2_E04_SHOP_TOP_PAIR: the shop rendered the SAME back pair twice -- this top pair and the identical pair at the bottom of the scroll. One pair is the navigation; the duplicate is what reads as an extra, unexplained back button. The top pair is removed; the bottom pair (E05) stays, and both handlers (furnitureBack, furnitureBackToCity) stay defined above and in use by it. */}

            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>FURNITURE</Text>
              {FURNITURE.map((item) => {
                const owned = ownsPiece(item.id, ownedDecorations, ownedFurniture);
                const confirming = furnitureConfirm === item.id;
                const afford = cash >= item.price;
                return (
                  <View key={item.id} style={[styles.coinShopRow, styles.vis2FurnitureCard]}>{/* REALISTIC_LOOK_VIS2_E18_FURNITURE_CARD: each furniture item is now its own bordered card (styles E17), so the item's name, price line, OWNED status / confirm block / BUY button are fenced together -- a neighbouring item's button can no longer read as this item's (Zabby's armchair/bookshelf note). The row's contents, handlers and gates are byte-identical; only the row's style gained the card. */}
                    <View style={styles.coinShopSwatchRow}>
                      <Text style={styles.furnitureGlyph}>{item.glyph}</Text>
                      <View style={[styles.coinShopSwatch, { backgroundColor: item.chip }]} />
                      <View style={[styles.coinShopSwatch, { backgroundColor: item.chip2 }]} />
                      <Text style={styles.progressLine}>{item.name}</Text>
                    </View>
                    <Text style={styles.body}>{'$' + item.price + ' cash'}</Text>
                    {/* BIG_PACKAGE_BIG1_E13_SHOP_PLACEMENT: an owned row now says where the piece lives, read off the SAME derived layout the room renders (homeLayoutNow -- the My Home tray's own source) and named through the shipped homeLocationById, which covers floor spots and wall slots alike; owned but unseated reads IN TRAY. Read-only: nothing is written here, and the buy flow is untouched -- an owned piece never reaches it (the owned branch renders instead of the BUY button, and purchaseFurniture itself refuses owned pieces). The note sits here, as a row child, because inside the ternary's parentheses only a single expression may stand. */}
                    {owned ? (
                      <Text style={styles.coinShopWearing}>{'OWNED · ' + (typeof homeLayoutNow[item.id] === 'string' ? 'PLACED · ' + homeLocationById(homeLayoutNow[item.id]).name : 'IN TRAY')}</Text>
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

            {/* ROOM_SCALE_HOME2_E05_SHOP_BACK_CLIP: the shop's one remaining back pair takes the CITY3 clip class (single-line shrink-to-fit) -- the contextual label ('BACK TO MY HOME' / 'BACK TO STORE') and 'BACK TO CITY' now shrink a step instead of ever clipping on a narrow screen. Words and handlers unchanged. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={furnitureBack}
            >
              <Text style={styles.secondaryText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{furnitureBackLabel}</Text>
            </TouchableOpacity>
            {/* NAVIGATION_EASE_V1_E26B_FURNITURE_CITY_BTN */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={furnitureBackToCity}
            >
              <Text style={styles.secondaryText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>BACK TO CITY</Text>
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
    const bizPay = biz ? businessPay(biz, businessUpgrades, businessUpgrades2) : 0; /* CLEANING_HAULING_EXPANSION_CHX1_E18_INTERIOR_PAY */
    const bizDoneToday = biz ? bizJobsDoneToday(bizWork, biz.id, day) : 0;
    const exitBizInterior = () => { setBizMessage(''); setPlace(null); };
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={styles.page}>
            <TouchableOpacity style={styles.secondary} onPress={exitBizInterior}>
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
                {bizHasWaitingPool(biz.id) && (
                  <TouchableOpacity
                    style={styles.secondary}
                    onPress={() => { setManageBizId(biz.id); setPlace('MANAGE_BIZ'); }}
                  >
                    {/* CITY_POLISH_VIS3_E09_INTERIOR_LABEL: label only -- this button (inside each pool business's interior) still runs the same onPress into MANAGE_BIZ for biz.id; only its words change, to the one management-entry name. */}
                    <Text style={styles.secondaryText}>Manage / Collect Profits</Text>
                  </TouchableOpacity>
                )} {/* CLEANING_HAULING_EXPANSION_CHX1_E18_INTERIOR_MANAGE: the management door inside the two pool businesses' interiors (the Food Stand interior gets no such button). */}
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
                {/* CLEANING_HAULING_EXPANSION_CHX1_E18_INTERIOR_TIER2: the tier-2 row for the two businesses that have one (E02), below the tier-1 block, wired to the same gate and handler as everywhere (E04/E12). Until tier 1 is owned there is no buy button: the line says to buy tier 1 first. */}
                {bizTier2Upgrade(biz.id) && (businessUpgrades2.includes(biz.id) ? (
                  <Text style={styles.body}>{'Tier 2 owned: ' + bizTier2Upgrade(biz.id).name + ' — every job pays $' + bizTier2Upgrade(biz.id).pay + '.'}</Text>
                ) : !bizUpgraded ? (
                  <Text style={styles.body}>{'Tier 2 upgrade: ' + bizTier2Upgrade(biz.id).name + ' — $' + bizTier2Upgrade(biz.id).cost + ' from savings. Pay $' + biz.upgradePay + ' → $' + bizTier2Upgrade(biz.id).pay + ' per job. Buy ' + biz.upgradeName + ' first.'}</Text>
                ) : bizUpgrade2Confirm !== biz.id ? (
                  <>
                    <Text style={styles.body}>{'Tier 2 upgrade: ' + bizTier2Upgrade(biz.id).name + ' — $' + bizTier2Upgrade(biz.id).cost + ' from savings. Pay $' + biz.upgradePay + ' → $' + bizTier2Upgrade(biz.id).pay + ' per job.'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setBizUpgrade2Confirm(biz.id)}
                    >
                      <Text style={styles.secondaryText}>{'UPGRADE TIER 2 — $' + bizTier2Upgrade(biz.id).cost}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View>
                    <Text style={styles.body}>{'Buy ' + bizTier2Upgrade(biz.id).name + ' for $' + bizTier2Upgrade(biz.id).cost + ' from savings? Every job will pay $' + bizTier2Upgrade(biz.id).pay + '.'}</Text>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => buyBusinessUpgrade2(biz.id)}
                    >
                      <Text style={styles.secondaryText}>{'CONFIRM TIER 2 — $' + bizTier2Upgrade(biz.id).cost}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondary}
                      onPress={() => setBizUpgrade2Confirm(null)}
                    >
                      <Text style={styles.secondaryText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {bizMessage !== '' && (
                  <Text style={styles.body}>{bizMessage}</Text>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.secondary}
              onPress={exitBizInterior}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
                        <Text style={styles.coinShopWearing}>✓ SELECTED</Text>
                      ) : (
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => chooseDisplayBike(bike.id)}
                        >
                          <Text style={styles.secondaryText}>DISPLAY</Text>
                        </TouchableOpacity>
                      )}
                      {/* READABILITY_VIS5_E20_BIKE_TAG: the garage stage pick's tag reads '✓ SELECTED' now (was DISPLAYING) -- this row only (the gate is the shipped onDisplay read of garageDisplayId); the DISPLAY button on other rows, chooseDisplayBike and the displayBike field are untouched. */}
                      {ridingBike === bike.id && (
                        <Text style={styles.coinShopWearing}>🏍 RIDING</Text>
                      )}{/* BIG_PACKAGE_BIG1_E14_GARAGE_RIDING: render-only marker -- the row whose bike is the current mount (the ridingBike state the city toggle and RIDE THIS BIKE write) says so beside its DISPLAY/DISPLAYING state, so the stage pick and the bike being ridden are both visible at a glance. Reads state only; no handler or write changes, and when the player parks (ridingBike null) no row carries the marker. */}
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => rideThisBike(bike.id)}
                      >
                        <Text style={styles.secondaryText}>🏍 RIDE THIS BIKE</Text>
                      </TouchableOpacity>{/* GARAGE_RIDING_RID1_E04_RIDE_BUTTON: every row in this list is an owned bike (the list maps owned bikes only), so every row carries the ride button; the handler behind it re-checks ownership itself before writing anything. Pressing it exits to the city mounted on this bike. Rows stack vertically (coinShopRow is a plain block), so the second button lands under DISPLAY/DISPLAYING without crowding the bike name. */}
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
                <View style={vis.coinLineRow}><CoinIcon size={20} /><Text style={[styles.body, vis.coinLineText]}>{'Your coins: ' + coins}</Text></View>{/* VISUAL_V1_E15C_COINLINE */}
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
                          <View style={vis.coinPriceRow}><CoinIcon size={15} /><Text style={styles.secondaryText}>{afford ? 'BUY - ' + color.price + ' COINS' : 'NEED ' + color.price + ' COINS'}</Text></View>{/* VISUAL_V1_E16C_COINPRICE */}
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
            {/* NAVIGATION_EASE_V1_E23_GARAGE_CITY */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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

            {/* REALISTIC_LOOK_VIS2_E02_SETTINGS_TOGGLE: the arrow-controls toggle that stood here is removed -- the on-screen arrow pad it gated is gone from the city (E04), so there is nothing left for it to show or hide. The save field it flipped is NOT removed: the loader, the state initializer, the persist effect and the restart reset still carry it exactly as shipped (census-proven byte-identical), so every existing save loads and re-saves unchanged; the value is simply no longer read by any render. */}
            {/* FRIENDS_EARLY_ACCESS_EA1_E04_SETTINGS_BUTTONS: the two
             * help doors on the Settings screen. Each remembers
             * Settings as its return target before switching
             * place, so BACK on either screen lands here again. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => { setHelpReturn('SETTINGS'); setPlace('HELP'); }}
            >
              <Text style={styles.secondaryText}>HOW TO PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => { setReportReturn('SETTINGS'); setPlace('REPORT_PROBLEM'); }}
            >
              <Text style={styles.secondaryText}>REPORT A PROBLEM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(null)}
            >
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* FRIENDS_EARLY_ACCESS_EA1_E05_HELP: the HOW TO PLAY screen.
   * An early return on place === 'HELP', directly after the
   * SETTINGS screen and ABOVE the generic place fallback --
   * a screen placed below that fallback is swallowed by its
   * 'Welcome to {place}' placeholder (the HQ1 lesson).
   * DISPLAY ONLY: seven plain-language sections in a
   * ScrollView (nothing can clip on a small phone), a REPORT
   * A PROBLEM door at the bottom, and BACK to helpReturn --
   * the screen the player came from (the start menu, whose
   * BACK label says so, or Settings). Opening, reading or
   * leaving this screen writes nothing and saves nothing. */
  if (place === 'HELP') {
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>HELP</Text>
            <Text style={styles.title}>How to Play</Text>

            <Text style={styles.helpSectionTitle}>GETTING AROUND</Text>
            <Text style={styles.body}>Tap a building or use GO TO / TRAVEL to travel. Walking is free; riding your motorcycle is faster. STOP WALK cancels a trip. Tap ENTER (or walk up to a door) to go inside.</Text> {/* READABILITY_VIS5_E18_TRAVEL_HELP: the HOW TO PLAY directions name the travel chip by its new name (E16/E17); every other word is shipped. */}

            <Text style={styles.helpSectionTitle}>CITY JOBS</Text>
            <Text style={styles.body}>The Job Board by the Employment Center offers jobs around the city. Accept one, then tap GO TO CUSTOMER in the mission banner — your character travels there. Tap COMPLETE JOB when you arrive to get paid.</Text>

            <Text style={styles.helpSectionTitle}>WORK & FRIDAY PAYDAY</Text>
            <Text style={styles.body}>Apply for a job at the Employment Center, finish paid training, then work one shift a day. Pay waits as pending wages. Friday is payday: pending wages become your paycheck — collect it on the WORK screen.</Text>

            <Text style={styles.helpSectionTitle}>BANKING & CREDIT</Text>
            <Text style={styles.body}>The Bank moves $100 at a time between cash and savings. Saving more raises your credit score (up to 850); a higher score unlocks better property.</Text>
            <Text style={styles.body}>Once you own a business, the Bank also offers the Neighborhood Fund - put in $100, $250 or $500 from savings and it grows 5% every 5 days, and you can sell it back any time for its current value.</Text> {/* NEIGHBORHOOD_FUND_NFUND1_E14_HELP: one added line in the BANKING & CREDIT section, in the MAE1 E21 shape -- the fund is a bank product whose only door is owning a business (E13). Every other HELP section is byte-identical. */}

            <Text style={styles.helpSectionTitle}>YOUR BUSINESSES</Text>
            <Text style={styles.body}>Buy a business at the Employment Center once you have $1,500 saved. Business job pay WAITS in the business until you collect it — open MY BUSINESSES, tap MANAGE, then COLLECT TO CASH or DEPOSIT TO SAVINGS. Cleaning, Hauling and Mae's Place all work this way. Every business allows up to 3 jobs per day. The motorcycle dealership is different: customers buy bikes while you rest, and the profit WAITS at the dealership — visit to collect it to cash or deposit it to savings. Upgrades (bought with savings) raise a business's pay.</Text> {/* BUSINESS_EXPANSION_BIZX1_E19_HELP */} {/* FOOD_STAND_EXPANSION_FSX1_E31_HELP: since FSX1 the Food Stand waits too (E03), so the line no longer splits the businesses; every other HELP section is byte-identical. */}
            <Text style={styles.body}>Mae's Place is a full restaurant: customers come in on their own, order Southern fried chicken or barbecue ribs, and their money waits in profit for you to collect.</Text> {/* MAES_PLACE_MAE1_E21_HELP: the YOUR BUSINESSES section gains the restaurant's own line, in the section's voice -- Mae's Place is the one business whose customers arrive by themselves (E19), like the dealership's buyers the same paragraph already describes. The paragraph above also names Mae's Place in its business list now (E03); every other HELP section is byte-identical. */}

            <Text style={styles.helpSectionTitle}>EARNINGS LIMIT</Text>
            <Text style={styles.body}>You can earn up to $1,500 a day from jobs, shifts, and the casino. Spend and build back up.</Text>

            {/* READABILITY_VIS5_E19_COINS_HELP: one added HELP section stating the shipped coin rules exactly as they play -- earn +5 per completed Life Goal and +2 for the 3rd paid shift in a week; spend in the Coin Shop, on My Home decorations and on My Garage bike colors; the Phone/Medical bill events take 10 coins when cash is short. Copy only; no coin rule moves. */}
            <Text style={styles.helpSectionTitle}>REWARD COINS</Text>
            <Text style={styles.body}>Coins are earned rewards. You earn +5 coins each time you complete a Life Goal, and +2 coins for the 3rd paid shift you work in a week. Spend coins in the Coin Shop on outfits, on decorations for My Home, and on bike colors in My Garage. When a Phone Bill or Medical Bill life event lands and your cash is short, you can pay it with 10 coins instead.</Text>

            <Text style={styles.helpSectionTitle}>YOUR GAME SAVES ITSELF</Text>
            <Text style={styles.body}>Progress saves automatically on this device. Updating the app keeps your game. Deleting the app or clearing its data erases the game. Every phone or tablet keeps its own separate game.</Text>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => { setReportReturn('HELP'); setPlace('REPORT_PROBLEM'); }}
            >
              <Text style={styles.secondaryText}>REPORT A PROBLEM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(helpReturn)}
            >
              <Text style={styles.secondaryText}>{helpReturn === 'SETTINGS' ? '← BACK TO SETTINGS' : (freeRoam ? 'BACK TO CITY' : '← BACK TO START MENU')}</Text> {/* TABLET_FIXES_CITY5_E11_HELP_LABEL: the fallback arm names its destination now -- helpReturn null outside free roam is the start menu's HOW TO PLAY door (EA1 E07), and this button's setPlace(helpReturn) lands back on that menu flow. The handler is untouched. */}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* FRIENDS_EARLY_ACCESS_EA1_E06_REPORT: the REPORT A PROBLEM
   * screen. An early return on place === 'REPORT_PROBLEM',
   * above the generic place fallback like the HOW TO PLAY
   * screen before it. The build line reads BUILD_LABEL from
   * the constant. The player types into a multiline TextInput
   * (reportDraft -- transient state, never saved), and the
   * composed report renders below as selectable text:
   * package.json has no expo-clipboard, so there is no copy
   * button and no new dependency -- press-and-hold copy is
   * the shipped route, and the screen says so. DISPLAY ONLY:
   * nothing on this screen writes, awards or saves. */
  if (place === 'REPORT_PROBLEM') {
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />

          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>REPORT A PROBLEM</Text>
            <Text style={styles.title}>Report a Problem</Text>
            <Text style={styles.body}>{'Build: ' + BUILD_LABEL}</Text>

            <Text style={styles.dualInputLabel}>DESCRIBE WHAT HAPPENED</Text>
            <TextInput
              style={styles.reportInput}
              value={reportDraft}
              onChangeText={setReportDraft}
              placeholder="What were you doing, and what went wrong?"
              placeholderTextColor="#5f7186"
              multiline={true}
            />

            <Text style={styles.reportText} selectable={true}>{problemReportText(reportDraft)}</Text>

            <Text style={styles.body}>Please don't include your real name, home address, or passwords in a report.</Text>
            <Text style={styles.body}>Press and hold the report to copy it, then paste it in a message to the person who shared the game with you.</Text>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace(reportReturn)}
            >
              <Text style={styles.secondaryText}>{reportReturn === 'HELP' ? '← BACK TO HOW TO PLAY' : (reportReturn === 'SETTINGS' ? '← BACK TO SETTINGS' : (freeRoam ? 'BACK TO CITY' : '← BACK TO START MENU'))}</Text> {/* TABLET_FIXES_CITY5_E12_REPORT_LABEL: the fallback arm mirrors the HELP screen's fixed label (E11) -- reportReturn is set at every door ('HELP' / 'SETTINGS'), so the null arm is the save-reopen case (place persists, the return target is transient): setPlace(reportReturn) lands on the city in free roam and on the start menu before it. The handler is untouched. */}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /* CLEANING_HAULING_EXPANSION_CHX1_E22_MANAGE: the per-business
   * MANAGEMENT screen for the two pool businesses (Cleaning and
   * Hauling), opened by the MANAGE button on their MY BUSINESSES
   * panels and the MANAGEMENT button inside their interiors; the
   * selected business rides the transient manageBizId state. An
   * early return on place === 'MANAGE_BIZ', directly after the
   * REPORT A PROBLEM screen and ABOVE the generic place
   * fallback -- a screen placed below that fallback is
   * swallowed by its 'Welcome to {place}' placeholder (the
   * HQ1 lesson). The screen is the pool businesses' front
   * office: today's jobs both ways, the all-time counters, the
   * waiting pool with its two collect buttons (E12), and both
   * upgrade tiers with price and benefit shown before purchase
   * (the shipped confirm-step pattern, E04/E12 gates). GO TO
   * BUSINESS lands on the same interior the dashboard's OPEN
   * button opens; BACK returns to MY BUSINESSES. A business
   * with no pool (the Food Stand), or one the player does not
   * own, shows only a plain note -- it has no management
   * screen, by design. */
  if (place === 'MANAGE_BIZ') {
    const manageBiz = BUSINESSES.find((b) => b.id === manageBizId) || null;
    const manageOwned = !!manageBiz && ownedBusinesses.includes(manageBiz.id);
    const managePool = !!manageBiz && bizHasWaitingPool(manageBiz.id);
    const manageDoneToday = manageBiz ? bizJobsDoneToday(bizWork, manageBiz.id, day) : 0;
    const manageWaiting = manageBiz ? (bizWaiting[manageBiz.id] || 0) : 0;
    const manageTier2 = manageBiz ? bizTier2Upgrade(manageBiz.id) : null;
    const manageTier1Owned = !!manageBiz && businessUpgrades.includes(manageBiz.id);
    const manageTier2Owned = !!manageBiz && businessUpgrades2.includes(manageBiz.id);
    const manageCustomers = manageBiz ? (BIZ_CUSTOMERS[manageBiz.id] || []) : []; /* BUSINESS_EXPANSION_BIZX1_E14_MANAGE_DERIVATIONS: the screen's job choice cards (E16) read the shipped customer table directly -- the same three customers the CITY JOBS board rotates through. */
    const manageVehicle = manageBiz ? workVehicleForBusiness(manageBiz.id) : null; /* BUSINESS_EXPANSION_BIZX1_E14_MANAGE_DERIVATIONS: this business's work vehicle (E02), or null -- each pool business has one. */
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={styles.page}>
            <Text style={styles.eyebrow}>BUSINESS MANAGEMENT</Text>
            <Text style={styles.title}>{manageBiz ? manageBiz.name + ' — Management' : 'Business — Management'}</Text>
            {/* READABILITY_CITY4_E06_MANAGE_NO_SCREEN: the no-management-screen note takes the DX2 dark panel + report body; words unchanged. (The marker comment stands before the ternary: a JSX comment cannot live inside its parenthesized branch.) */}
            {!manageBiz || !manageOwned || !managePool ? (
              <View style={styles.reportPanel}>
                <Text style={styles.reportBody}>This business does not have a management screen.</Text>
              </View>
            ) : (
              <>
                {/* BUSINESS_EXPANSION_BIZX1_E15_MANAGE_STATS: the stats block takes the DX2 dark panel (reportPanel / reportTitle / reportBody) like the dealership report, and gains the business level line (E02) -- the level is display only, derived from the two upgrade lists. Every figure string below is the shipped CHX1 string. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportTitle}>{manageBiz.name.toUpperCase()}</Text>
                  <Text style={styles.reportBody}>{'Business Level: ' + businessLevel(manageBiz.id, businessUpgrades, businessUpgrades2)}</Text>
                  <Text style={styles.reportBody}>{'Jobs left today: ' + (3 - manageDoneToday) + ' of 3'}</Text>
                  <Text style={styles.reportBody}>{'Jobs done today: ' + manageDoneToday + ' of 3'}</Text>
                  <Text style={styles.reportBody}>{'Jobs completed (all time): ' + (bizJobsDone[manageBiz.id] || 0)}</Text>
                  <Text style={styles.reportBody}>{'Earned (all time): $' + (bizLifetimeEarnings[manageBiz.id] || 0)}</Text>
                  <Text style={styles.reportBody}>{'Profit waiting to collect: $' + manageWaiting}</Text>
                </View>
                {/* MAES_PLACE_MAE1_E22_MANAGE_SUMMARY: yesterday's
                    customer round at Mae's Place, on the shipped
                    dark panel -- sibling-Text rows in the READ1
                    wrapping shape (label and figure are separate
                    Texts, never nested), so a line wraps instead
                    of ever clipping. It shows only for a real
                    round (total > 0): the zero latch stamp from
                    the purchase day (E16) is not a round and
                    never displays. The figures are the persisted
                    record (E06), so the block survives a reopen
                    exactly, and the money it names is already in
                    the pool the stats panel above totals. */}
                {manageBiz.id === 'foodstand' && maeLastRound && maeLastRound.total > 0 && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportTitle}>YESTERDAY AT MAE'S PLACE</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Customers:</Text>
                      <Text style={styles.reportBody}>{maeLastRound.chicken + maeLastRound.ribs}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Southern fried chicken</Text>
                      <Text style={styles.reportBody}>{'×' + maeLastRound.chicken}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Barbecue ribs</Text>
                      <Text style={styles.reportBody}>{'×' + maeLastRound.ribs}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      <Text style={styles.reportBody}>Added to profit waiting:</Text>
                      <Text style={styles.reportBody}>{'$' + maeLastRound.total}</Text>
                    </View>
                  </View>
                )}
                {/* READABILITY_CITY4_E07_MANAGE_COLLECT_NOTE: the collect explainer above the two collect buttons takes the DX2 dark panel + report body; the buttons keep their own styling and handlers, words unchanged. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportBody}>Job money waits here until you collect it.</Text>
                </View>
                <TouchableOpacity
                  style={[styles.secondary, manageWaiting <= 0 && { opacity: 0.5 }]}
                  disabled={manageWaiting <= 0}
                  onPress={() => collectBizToCash(manageBiz.id)}
                >
                  <Text style={styles.secondaryText}>{'COLLECT TO CASH — $' + manageWaiting}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondary, manageWaiting <= 0 && { opacity: 0.5 }]}
                  disabled={manageWaiting <= 0}
                  onPress={() => collectBizToSavings(manageBiz.id)}
                >
                  <Text style={styles.secondaryText}>{'DEPOSIT TO SAVINGS — $' + manageWaiting}</Text>
                </TouchableOpacity>
                {/* BUSINESS_EXPANSION_BIZX1_E16_MANAGE_SECTIONS: the headquarters job board and the work vehicle, between the collect buttons and the upgrades. The job board offers ALL THREE of this business's customers at once (the CITY JOBS board rotates one offer at a time; the table behind both is the same one). Every card names the customer and where they are, shows the pay through the tier-aware pay helper and the job's hours BEFORE accepting, and its button runs the HQ accept (E11) -- acceptMission with the picked customer. The daily limit and the one-mission rule are the board's own gates, mirrored in the buttons' disabled state and the two notes above the cards. The vehicle section shows this business's free work vehicle (E02): SELECT writes the one shared selection, SELECTED is a plain state line, and NO VEHICLE clears the selection (offered from either business's screen whenever a selection exists). Both sections sit on the DX2 dark panel like the rest of this screen. */}
                {/* READABILITY_CITY4_E10_MANAGE_TITLE_JOBS: the job/order choices heading stood alone on the bright photo; it takes the DX2 dark panel and reportTitle -- which mirrors sectionTitle (white, 22, weight 900), so the heading renders at the same size, now backed. Words and the foodstand ternary unchanged. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportTitle}>{manageBiz.id === 'foodstand' ? 'ORDER CHOICES' : 'JOB CHOICES'}</Text>
                </View> {/* FOOD_STAND_EXPANSION_FSX1_E32_MANAGE_CARDS_TITLE: on the Food Stand the cards are orders (E19/E33); the other businesses keep JOB CHOICES. */}
                {/* READABILITY_CITY4_E08_MANAGE_GATE_ACTIVE: the finish-or-cancel gate note takes the DX2 dark panel + report body; the gate itself and the words are unchanged. */}
                {activeMission && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportBody}>Finish or cancel your current job first.</Text>
                  </View>
                )}
                {/* READABILITY_CITY4_E09_MANAGE_GATE_DONE: the all-jobs-done gate note takes the DX2 dark panel + report body; the gate itself and the words are unchanged. */}
                {!activeMission && manageDoneToday >= 3 && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportBody}>All jobs done today — more tomorrow.</Text>
                  </View>
                )}
                {manageCustomers.map((hqCustomer) => (
                  <View key={hqCustomer.id} style={styles.reportPanel}>
                    <Text style={styles.reportBody}>{hqCustomer.customer}</Text>
                    <Text style={styles.reportBody}>{hqCustomer.label}</Text>
                    {manageBiz.id === 'foodstand' && (
                      <Text style={styles.reportBody}>{'Order: ' + hqCustomer.order}</Text>
                    )} {/* FOOD_STAND_EXPANSION_FSX1_E33_MANAGE_ORDER_LINE: the ORDER line (E19's draft copy) shows on Food Stand cards only, as a sibling line -- never nested in another Text. */}
                    <Text style={styles.reportBody}>{'Pay: $' + businessPay(manageBiz, businessUpgrades, businessUpgrades2) + ' · +' + manageBiz.jobHours + ' hours'}</Text> {/* BUSINESS_EXPANSION_BIZX1_E16_HQ_JOBS */}
                    <TouchableOpacity
                      style={[styles.secondary, (activeMission || manageDoneToday >= 3) && { opacity: 0.5 }]}
                      disabled={!!activeMission || manageDoneToday >= 3}
                      onPress={() => acceptHqBusinessJob(manageBiz.id, hqCustomer.id)} /* BUSINESS_EXPANSION_BIZX1_E16_HQ_JOBS */
                    >
                      <Text style={styles.secondaryText}>{manageBiz.id === 'foodstand' ? 'TAKE THIS ORDER' : 'TAKE THIS JOB'}</Text> {/* BUSINESS_EXPANSION_BIZX1_E16_HQ_JOBS */} {/* FOOD_STAND_EXPANSION_FSX1_E34_MANAGE_ORDER_BUTTON: the accept itself is the shipped HQ accept for every business -- only the Food Stand's button names the order. */}
                    </TouchableOpacity>
                  </View>
                ))}
                {/* READABILITY_CITY4_E11_MANAGE_TITLE_VEHICLE: the work vehicle heading takes the DX2 dark panel + reportTitle, same treatment as the job choices heading (E10); words unchanged. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportTitle}>WORK VEHICLE</Text>
                </View>
                {manageVehicle && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportBody}>{manageVehicle.glyph + ' ' + manageVehicle.name}</Text>
                    {selectedWorkVehicle === manageVehicle.id ? (
                      <>
                        <Text style={styles.reportBody}>SELECTED — you travel in this vehicle.</Text>
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => setSelectedWorkVehicle(null)}
                        >
                          <Text style={styles.secondaryText}>NO VEHICLE</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={styles.reportBody}>{'Unlocked — free with your ' + manageBiz.name + '.'}</Text>
                        <TouchableOpacity
                          style={styles.secondary}
                          onPress={() => setSelectedWorkVehicle(manageVehicle.id)}
                        >
                          <Text style={styles.secondaryText}>SELECT</Text>
                        </TouchableOpacity>
                        {selectedWorkVehicle && (
                          <TouchableOpacity
                            style={styles.secondary}
                            onPress={() => setSelectedWorkVehicle(null)}
                          >
                            <Text style={styles.secondaryText}>NO VEHICLE</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                )}
                {/* BUSINESS_EXPANSION_BIZX1_E17_MANAGE_UPGRADES_PANEL: the upgrades section moves onto the DX2 dark panel like the rest of this screen -- the shipped title and every price/benefit string below are byte-identical; only the panel wrap, the indent and the two light styles change. The buy gates, the confirm steps and the handlers are the shipped ones, untouched. */}
                <View style={styles.reportPanel}>
                  <Text style={styles.reportTitle}>UPGRADES</Text>
                  {manageTier1Owned ? (
                    <Text style={styles.reportBody}>{'Tier 1 owned: ' + manageBiz.upgradeName + ' ✓ — every job pays $' + manageBiz.upgradePay + '.'}</Text>
                  ) : bizUpgradeConfirm !== manageBiz.id ? (
                    <>
                      <Text style={styles.reportBody}>{'Tier 1 upgrade: ' + manageBiz.upgradeName + ' — $' + manageBiz.upgradeCost + ' from savings. Pay $' + manageBiz.pay + ' → $' + manageBiz.upgradePay + ' per job.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgradeConfirm(manageBiz.id)}
                      >
                        <Text style={styles.secondaryText}>{'UPGRADE — $' + manageBiz.upgradeCost}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View>
                      <Text style={styles.reportBody}>{'Buy ' + manageBiz.upgradeName + ' for $' + manageBiz.upgradeCost + ' from savings? Every job will pay $' + manageBiz.upgradePay + '.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => buyBusinessUpgrade(manageBiz.id)}
                      >
                        <Text style={styles.secondaryText}>{'CONFIRM UPGRADE — $' + manageBiz.upgradeCost}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgradeConfirm(null)}
                      >
                        <Text style={styles.secondaryText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {manageTier2 && (manageTier2Owned ? ( /* BUSINESS_EXPANSION_BIZX1_E17_UPGRADES_PANEL */
                    <Text style={styles.reportBody}>{'Tier 2 owned: ' + manageTier2.name + ' ✓ — every job pays $' + manageTier2.pay + '.'}</Text>
                  ) : !manageTier1Owned ? (
                    <Text style={styles.reportBody}>{'Tier 2 upgrade: ' + manageTier2.name + ' — $' + manageTier2.cost + ' from savings. Pay $' + manageBiz.upgradePay + ' → $' + manageTier2.pay + ' per job. Buy ' + manageBiz.upgradeName + ' first.'}</Text>
                  ) : bizUpgrade2Confirm !== manageBiz.id ? (
                    <>
                      <Text style={styles.reportBody}>{'Tier 2 upgrade: ' + manageTier2.name + ' — $' + manageTier2.cost + ' from savings. Pay $' + manageBiz.upgradePay + ' → $' + manageTier2.pay + ' per job.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgrade2Confirm(manageBiz.id)}
                      >
                        <Text style={styles.secondaryText}>{'UPGRADE TIER 2 — $' + manageTier2.cost}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View>
                      <Text style={styles.reportBody}>{'Buy ' + manageTier2.name + ' for $' + manageTier2.cost + ' from savings? Every job will pay $' + manageTier2.pay + '.'}</Text>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => buyBusinessUpgrade2(manageBiz.id)}
                      >
                        <Text style={styles.secondaryText}>{'CONFIRM TIER 2 — $' + manageTier2.cost}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secondary}
                        onPress={() => setBizUpgrade2Confirm(null)}
                      >
                        <Text style={styles.secondaryText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {/* READABILITY_CITY4_E12_MANAGE_MESSAGE: the management screen's result message takes the DX2 dark panel + report body; the gate and the GO TO BUSINESS button below it are unchanged. */}
                {bizMessage !== '' && (
                  <View style={styles.reportPanel}>
                    <Text style={styles.reportBody}>{bizMessage}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.secondary}
                  onPress={() => setPlace(bizInteriorPlace(manageBiz.id))}
                >
                  <Text style={styles.secondaryText}>GO TO BUSINESS</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setPlace('MY_BUSINESSES')}
            >
              <Text style={styles.secondaryText}>← BACK TO MY BUSINESSES</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

 if (place && place !== 'JOB_BOARD' && place !== 'MY_BUSINESSES') { /* CITY_JOBS_V1_1_FIX: JOB_BOARD has its own screen below this generic fallback; without the exclusion the fallback swallowed it and rendered a placeholder. BUSINESS_HEADQUARTERS_HQ1F_E02_GUARD: MY_BUSINESSES needs the same exclusion for the same reason -- the Business Headquarters dashboard return sits below this fallback, and HQ1 shipped without the exclusion, so the fallback swallowed MY_BUSINESSES too and both of its buttons opened the placeholder. */
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.title}>{place}</Text>
          <Text style={styles.body}>Welcome to {place}.</Text>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setPlace(null)}
          >
            <Text style={styles.secondaryText}>BACK TO CITY</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* BUSINESS_HEADQUARTERS_HQ1_E15_DASHBOARD: the MY
   * BUSINESSES dashboard, opened from the BANK screen or
   * the city controls. DISPLAY + NAVIGATION ONLY: it reads
   * ownership, the dealership's waiting profit and the
   * shipped business helpers, and its MANAGE buttons ride
   * setPlace to screens that already exist -- the
   * DEALERSHIP and the three walk-in business interiors.
   * Buying stays where it already lives (Employment
   * Center / Dealership), and collecting stays on the
   * Dealership screen, so this block's only setter is
   * setPlace. */
  if (place === 'MY_BUSINESSES') {
    return (
      <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
        <SafeAreaView style={[styles.safe, styles.safeArt]}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={styles.page}>
            <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}>
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
            </TouchableOpacity>
            <Text style={styles.eyebrow}>BUSINESS HEADQUARTERS</Text>
            <Text style={styles.title}>My Businesses</Text>
            {/* READABILITY_CITY4_E05_DASH_INTRO: the dashboard intro paragraph was the one block of body text on MY BUSINESSES still sitting directly on the bright menu photo; it takes the DX2 dark panel and the near-white report body, words unchanged. */}
            <View style={styles.reportPanel}>
              <Text style={styles.reportBody}>Every business you own, in one place. Tap OPEN to open a business — its work and its upgrades live on the same screen.</Text>
            </View> {/* BUSINESS_MANAGEMENT_BM1_E11_DASHBOARD_INTRO: the owned panels now carry OPEN + UPGRADES buttons (E12/E13); both land on the business's own screen, so the intro says so. */}
            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>Motorcycle Dealership</Text>
              {dealershipOwned ? (<>
                <Text style={styles.progressLine}>Status: Owned</Text>
                <Text style={styles.progressLine}>{'Showroom: Level ' + dealershipLevel}</Text> {/* BUSINESS_MANAGEMENT_BM1_E12_DASHBOARD_DEALERSHIP: the panel gains the showroom level; the waiting figure is named as waiting (the same dealershipProfit the Dealership screen shows); MANAGE becomes OPEN + UPGRADES, both landing on the Dealership screen, which hosts the collect buttons and the showroom upgrade. Render reads and setPlace only. */}
                <Text style={styles.progressLine}>{'Total sales: ' + dealershipSales}</Text>
                <Text style={styles.progressLine}>{'Profit waiting: $' + dealershipProfit}</Text>
                <Text style={styles.progressLine}>{'Lifetime profit: $' + dealershipLifetimeProfit}</Text> {/* DEALERSHIP_EXPANSION_DX1_E17_DASHBOARD: one display line off the same lifetime field the Dealership report reads -- no new state, no setter. */}
                <TouchableOpacity style={styles.secondary} onPress={() => setPlace('DEALERSHIP')}>
                  <Text style={styles.secondaryText}>OPEN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={() => setPlace('DEALERSHIP')}>
                  <Text style={styles.secondaryText}>UPGRADES</Text>
                </TouchableOpacity>
              </>) : (<>
                <Text style={styles.progressLine}>Status: Not owned yet</Text>
                <Text style={styles.progressLine}>Buy it at the Dealership in the city.</Text>
              </>)}
            </View>
            {['cleaning', 'hauling', 'foodstand'].map((bizId) => {
              const biz = BUSINESSES.find((b) => b.id === bizId);
              const owned = ownedBusinesses.includes(bizId);
              const dashPool = bizHasWaitingPool(bizId); /* BUSINESS_EXPANSION_BIZX1_E18_DASH_PANELS: the two pool businesses' dashboard panels take the DX2 dark-panel treatment (reportPanel + light text) so they read like their management screens; the Food Stand panel keeps the shipped panel and text styles. Display only -- the same reads, the same buttons. */
              return (
                <View key={bizId} style={dashPool ? styles.reportPanel : styles.progressPanel}>
                  <Text style={dashPool ? styles.reportTitle : styles.progressHeading}>{biz.name}</Text> {/* BUSINESS_EXPANSION_BIZX1_E18_DASH_PANELS */}
                  {owned ? (<>
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>Status: Owned</Text> {/* BUSINESS_EXPANSION_BIZX1_E18_DASH_LINES: on the pool businesses' panels every line takes the light report body style (E18a's dashPool); the Food Stand panel's lines are byte-identical to the shipped ones. Strings unchanged. */}
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>{'Pay per job: $' + businessPay(biz, businessUpgrades, businessUpgrades2)}</Text> {/* CLEANING_HAULING_EXPANSION_CHX1_E19_DASH_PAY */} {/* BUSINESS_EXPANSION_BIZX1_E18_DASH_LINES */}
                    {dashPool && (
                      <Text style={styles.reportBody}>{'Business Level: ' + businessLevel(bizId, businessUpgrades, businessUpgrades2)}</Text>
                    )} {/* BUSINESS_EXPANSION_BIZX1_E18_DASH_LEVEL: the level line (E02), on the pool businesses' panels only, matching their management screens. */}
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>{'Jobs done today: ' + bizJobsDoneToday(bizWork, bizId, day) + '/3'}</Text>
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>{'Jobs left today: ' + (3 - bizJobsDoneToday(bizWork, bizId, day)) + ' of 3'}</Text> {/* BUSINESS_MANAGEMENT_BM1_E13_DASHBOARD_BIZ: the same daily counter read the other way -- the work still available today -- and the upgrade line in both of its states (previously it rendered only once owned, with no price). MANAGE becomes OPEN + UPGRADES below; both land on the business's own interior (bizInteriorPlace), which hosts WORK A JOB and the upgrade purchase flow. Render reads and setPlace only. */}
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>{businessUpgrades.includes(bizId) ? 'Upgrade: ' + biz.upgradeName + ' ✓ OWNED' : 'Upgrade: ' + biz.upgradeName + ' — $' + biz.upgradeCost + ' from savings'}</Text>
                    {bizTier2Upgrade(bizId) && ( /* BUSINESS_EXPANSION_BIZX1_E18_DASH_LINES */
                      <Text style={dashPool ? styles.reportBody : styles.progressLine}>{businessUpgrades2.includes(bizId) ? 'Tier 2: ' + bizTier2Upgrade(bizId).name + ' ✓ OWNED' : 'Tier 2: ' + bizTier2Upgrade(bizId).name + ' — $' + bizTier2Upgrade(bizId).cost + ' from savings'}</Text>
                    )} {/* CLEANING_HAULING_EXPANSION_CHX1_E19_DASH_TIER2 */}
                    {bizHasWaitingPool(bizId) && (bizWaiting[bizId] || 0) > 0 && ( /* BUSINESS_EXPANSION_BIZX1_E18_DASH_LINES */
                      <Text style={dashPool ? styles.reportBody : styles.progressLine}>{'Profit waiting: $' + bizWaiting[bizId]}</Text>
                    )} {/* CLEANING_HAULING_EXPANSION_CHX1_E19_DASH_WAITING */}
                    <TouchableOpacity style={styles.secondary} onPress={() => setPlace(bizInteriorPlace(bizId))}>
                      <Text style={styles.secondaryText}>OPEN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondary} onPress={() => setPlace(bizInteriorPlace(bizId))}>
                      <Text style={styles.secondaryText}>UPGRADES</Text>
                    </TouchableOpacity>
                    {bizHasWaitingPool(bizId) && (
                      <TouchableOpacity style={styles.secondary} onPress={() => { setManageBizId(bizId); setPlace('MANAGE_BIZ'); }}>
                        {/* CITY_POLISH_VIS3_E10_DASH_LABEL: label only -- this button (on each pool business's MY BUSINESSES panel) still runs the same onPress into MANAGE_BIZ for bizId; only its words change, to the one management-entry name. */}
                        <Text style={styles.secondaryText}>Manage / Collect Profits</Text>
                      </TouchableOpacity>
                    )} {/* CLEANING_HAULING_EXPANSION_CHX1_E19_DASH_MANAGE: the management door on the two pool businesses' dashboard panels; the Food Stand panel is unchanged. */}
                  </>) : (<>
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>Status: Not owned yet</Text> {/* BUSINESS_EXPANSION_BIZX1_E18_DASH_NOTOWNED */}
                    <Text style={dashPool ? styles.reportBody : styles.progressLine}>Buy it at the Employment Center.</Text>
                  </>)}
                </View>
              );
            })}
            {/* BUSINESS_MANAGEMENT_BM1_E14_EARNINGS_REPORT: the
             * business earnings report closes the dashboard and
             * is always visible. Pure render: every figure
             * derives from state read this render -- the DX1
             * dealership totals and the BM1 per-business job
             * accumulators -- and the block writes nothing. Its
             * one job is separating money still WAITING from
             * money already COLLECTED: job businesses pay cash
             * the moment a job completes, so their waiting is
             * always $0 and lifetime equals collected; the
             * dealership is the one business whose profit waits
             * for a collect tap, so its collected figure is
             * lifetime minus waiting. A business the player
             * does not own shows no figures. Every line is a
             * sibling Text -- no nested-Text constructions. */}
            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>BUSINESS EARNINGS</Text>
              <Text style={styles.progressLine}>{dealershipOwned ? 'Motorcycle Dealership — Lifetime profit: $' + dealershipLifetimeProfit + ' · Waiting: $' + dealershipProfit + ' · Collected: $' + (dealershipLifetimeProfit - dealershipProfit) : 'Motorcycle Dealership — Not owned'}</Text>
              {['cleaning', 'hauling', 'foodstand'].map((bizId) => {
                const biz = BUSINESSES.find((b) => b.id === bizId);
                const owned = ownedBusinesses.includes(bizId);
                const earned = bizLifetimeEarnings[bizId] || 0;
                /* CLEANING_HAULING_EXPANSION_CHX1_E20_EARNINGS: a pool
                 * business (cleaning/hauling) reports the honest pair --
                 * earned all time, and how much of it is still waiting
                 * to collect. There is deliberately NO collected figure
                 * for them: earnings from before this build were paid
                 * in cash instantly and were never split out, so
                 * inventing one would fabricate history. The Food
                 * Stand keeps its shipped line (its pay still lands
                 * instantly). */
                if (owned && bizHasWaitingPool(bizId)) {
                  return (
                    <React.Fragment key={bizId}>
                      <Text style={styles.progressLine}>{biz.name + ' — Earned (all time): $' + earned}</Text>
                      <Text style={styles.progressLine}>{biz.name + ' — Waiting to collect: $' + (bizWaiting[bizId] || 0)}</Text>
                    </React.Fragment>
                  );
                }
                return (
                  <Text key={bizId} style={styles.progressLine}>{owned ? biz.name + ' — Lifetime earned: $' + earned + ' · Waiting: $0 (paid instantly per job) · Collected: $' + earned : biz.name + ' — Not owned'}</Text>
                );
              })}
            </View>
            {/* CITY_BUSINESS_JOBS_CBJ1_E22_DASHBOARD_HISTORY: the
             * Business Job History closes the dashboard, below
             * the earnings report. Pure render off the E15
             * state: newest first, at most 10 rows, one
             * sibling Text per record (weekday -- business --
             * customer -- amount), and a plain empty state
             * until the first city job completes. It records
             * CITY JOBS board completions only (E18);
             * interior WORK A JOB completions share the
             * daily limit and the lifetime earnings but are
             * not city jobs, so they never appear here. */}
            <View style={styles.progressPanel}>
              <Text style={styles.progressHeading}>BUSINESS JOB HISTORY</Text>
              {bizJobHistory.length === 0 ? (
                <Text style={styles.progressLine}>No city jobs completed yet.</Text>
              ) : (
                bizJobHistory.slice(-10).reverse().map((entry, entryIdx) => (
                  <Text key={entryIdx} style={styles.progressLine}>{entry.day + ' — ' + entry.bizName + ' — ' + entry.customer + ' — $' + entry.amount}</Text>
                ))
              )}
            </View>
            <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}>
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
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
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
            </TouchableOpacity>
            <Text style={styles.eyebrow}>CITY JOBS</Text>
            <Text style={styles.title}>City Job Board</Text>
            <Text style={styles.body}>One active mission at a time. Travel in the city, follow the gold guide, and finish the job to get paid. Cancelling a mission costs nothing and pays nothing.</Text>
            {MISSION_KINDS.map((kind) => {
              const def = MISSION_DEFS[kind];
              const biz = def.bizId ? BUSINESSES.find((b) => b.id === def.bizId) : null;
              const reward = biz ? '$' + businessPay(biz, businessUpgrades, businessUpgrades2) + ' cash' : def.rewardText; /* CLEANING_HAULING_EXPANSION_CHX1_E21_BOARD_PAY */
              const isActive = !!(activeMission && activeMission.kind === kind);
              const elig = missionEligibility(kind, boardSnap);
              return (
                <View key={kind} style={styles.progressPanel}>
                  <Text style={styles.progressHeading}>{def.title}</Text>
                  <Text style={styles.progressLine}>{'Destination: ' + def.destText}</Text>
                  {biz && (() => { const custCard = bizCustomerFor(kind, boardSnap); return custCard ? (<>{/* CITY_BUSINESS_JOBS_CBJ1_E20_BOARD_CUSTOMER: the offer names its customer and where they are, before accepting -- the same picker the accept handler stamps from (E13), read off this render's board snapshot, so the card and the accepted job always agree. */}
                    <Text style={styles.progressLine}>{'Customer: ' + custCard.customer}</Text>
                    <Text style={styles.progressLine}>{'Location: ' + custCard.label}</Text>
                  </>) : null; })()}
                  <Text style={styles.progressLine}>{def.task}</Text>
                  <Text style={styles.progressLine}>{'Reward: ' + reward}</Text>
                  <Text style={styles.progressLine}>{'Time required: ' + def.timeText}</Text>
                  {biz && (
                    <Text style={styles.progressLine}>{'Jobs done today: ' + bizJobsDoneToday(bizWork, biz.id, day) + '/3'}</Text>
                  )}
                  {biz && bizJobsDoneToday(bizWork, biz.id, day) >= 3 && (
                    <Text style={styles.progressLine}>Done for today</Text>
                  )}{/* CITY_BUSINESS_JOBS_CBJ1_E21_BOARD_DONE: at the shared daily limit the card says so plainly, in the shipped lock presentation -- the eligibility line below still shows the shipped reason and no ACCEPT is offered (E12 handlers unchanged). */}
                  {kind === 'delivery' && (
                    <>
                      {/* DELIVERY_ROUTES_DELIVERY1_E21_BOARD_INTRO: the routes are stop runs now -- pickup, every stop, total pay and time all show on each route row before accepting (E22). The shared daily counter line stays. */}
                      <Text style={styles.progressLine}>{'Delivery routes — pick up at the Store, then ride to each stop in order. Pay, stops and time are shown on each route before you accept. Max ' + MISSION_DELIVERY_DAILY_MAX + ' deliveries per day, shared across all routes.'}</Text>
                      <Text style={styles.progressLine}>{'Deliveries done today: ' + boardDeliveriesToday + '/' + MISSION_DELIVERY_DAILY_MAX}</Text>
                      {/* DELIVERY_ROUTES_DELIVERY1_E21_BIKE: the offer names the bike the route will ride -- the garage pick (effectiveDisplayBike, the same resolution the map's WALK/RIDE toggle mounts) -- and SWITCH BIKE cycles that persisted pick when more than one bike is owned (E19's cycle handler). Accepting mounts the pick (E19). */}
                      {(() => { const boardBikeId = effectiveDisplayBike(ownedBikes, displayBike); const boardBike = boardBikeId ? BIKES.find((b) => b.id === boardBikeId) || null : null; return (
                        <>
                          <Text style={styles.progressLine}>{boardBike ? 'Your bike: ' + boardBike.name : 'Your bike: none — own a motorcycle to run deliveries'}</Text>
                          {ownedBikes.length > 1 && (
                            <TouchableOpacity style={styles.secondary} onPress={cycleDeliveryBike}>
                              <Text style={styles.secondaryText}>SWITCH BIKE</Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ); })()}
                    </>
                  )}
                  {kind === 'delivery' && deliveryPayWaiting > 0 && (
                    <>
                      {/* COLLECTION_UX_DELIVERY2_E08_BOARD_TOP: the collect block (E23, its lines unchanged) and its outcome line render HERE now -- above the route cards, directly under the delivery intro -- so waiting pay and COLLECT PAY are the first thing on the card, not the last; Zabby's DELIVERY2 ask. Still exactly one collect block on the board (the old spot below the routes is a tombstone, E07), still the shipped handler behind the shared pending gate, still shown whenever pay waits -- right after a route, after a reopen, even mid-mission. */}
                      {/* DELIVERY_ROUTES_DELIVERY1_E23_BOARD_COLLECT: the persisted completion summary + COLLECT PAY live on the delivery card whenever pay waits -- right after a route, after a reopen, even mid-mission -- never only on the transient completion panel. The collect is E16's handler behind the shared pending gate; a cap-blocked collect leaves the pay waiting and says so on E15's message line below. */}
                      {deliverySummary && (
                        <Text style={styles.progressLine}>{'Last route complete: ' + deliverySummary.stops + (deliverySummary.stops === 1 ? ' stop' : ' stops') + ' delivered — $' + deliverySummary.pay + ' route pay'}</Text>
                      )}
                      <Text style={styles.progressLine}>{'Delivery pay waiting: $' + deliveryPayWaiting}</Text>
                      <TouchableOpacity style={styles.primary} onPress={collectDeliveryPay}>
                        <Text style={styles.primaryText}>{'COLLECT PAY — $' + deliveryPayWaiting}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {kind === 'delivery' && deliveryMessage !== '' && (
                    <Text style={styles.progressLine}>{deliveryMessage}</Text>
                  )}
                  {kind === 'delivery' && deliveryPayWaiting === 0 && deliveryLastCollect && (
                    <Text style={styles.progressLine}>{'✓ Collected $' + deliveryLastCollect.amount}</Text>
                  )} {/* COLLECTION_UX_DELIVERY2_E09_BOARD_CONFIRM: the collected state of the collect area -- nothing waiting and a stamp exists, so the card confirms the last collection by its exact stamp amount, with no button. The stamp is not cleared on a day rollover (tomorrow's board still confirms yesterday's collect); it is superseded the moment new pay waits (the block above wins by its gate) and replaced by the next successful collect. With no stamp (a save from before this build) nothing renders here, exactly as boards looked before -- the neutral state is hidden, not a placeholder. */}
                  {isActive ? (
                    <>
                      <Text style={styles.progressLine}>{'ACTIVE — ' + missionObjective(activeMission).text}</Text>
                      <TouchableOpacity style={styles.secondary} onPress={cancelMission}>
                        <Text style={styles.secondaryText}>CANCEL MISSION</Text>
                      </TouchableOpacity>
                    </>
                  ) : elig.ok && kind === 'delivery' ? (
                    <>
                      {/* EXPANSION_DEL1_B_ROWS: three route rows replace the single ACCEPT for delivery, each with its terms up front and its own accept; every other kind keeps the shipped single ACCEPT below. All three rows share the one delivery eligibility gate (bike owned, shared count < 3, no other active mission). */}
                      {/* DELIVERY_ROUTES_DELIVERY1_E22_BOARD_ROWS: three route rows by stop count, each showing the pickup, every stop in order, the total pay and the route time BEFORE accepting -- the stops read E02's derivation off this render's day + deliveries-done counters, the same values the accept stamps (E19), so the card and the route cannot disagree. All three rows share the one delivery eligibility gate (bike owned, shared count < 3, no other active mission). */}
                      {DELIVERY1_ROUTE_ORDER.map((rid) => {
                        const r = DELIVERY1_ROUTES[rid];
                        const stops = deliveryRouteStops(rid, day, boardDeliveriesToday);
                        return (
                          <View key={rid}>
                            <Text style={styles.progressLine}>{r.name + ' route — $' + r.pay + ' • +' + r.hours + (r.hours === 1 ? ' hour' : ' hours') + ' • +' + r.xp + ' XP'}</Text>
                            <Text style={styles.progressLine}>{'Pickup: Store — package pickup'}</Text>
                            {stops.map((s, i) => (
                              <Text key={s.id} style={styles.progressLine}>{'Stop ' + (i + 1) + ': ' + s.customer + ' — ' + s.label}</Text>
                            ))}
                            <TouchableOpacity style={styles.primary} onPress={() => acceptMission('delivery', rid)}>
                              <Text style={styles.primaryText}>{'ACCEPT ' + r.name.toUpperCase() + ' ROUTE'}</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </>
                  ) : elig.ok ? (
                    <TouchableOpacity style={styles.primary} onPress={() => acceptMission(kind)}>
                      <Text style={styles.primaryText}>ACCEPT</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.progressLine}>{elig.reason}</Text>
                  )}
                  {/* COLLECTION_UX_DELIVERY2_E07_BOARD_MOVED: DELIVERY1's collect block (E23) and the collect outcome line stood here, below the route cards; DELIVERY2 renders them above the route cards instead (E08), directly under the delivery intro. Nothing renders at this spot now. */}
                </View>
              );
            })}
            <TouchableOpacity style={styles.secondary} onPress={() => setPlace(null)}>
              <Text style={styles.secondaryText}>BACK TO CITY</Text>
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
  const cityCamTargetFocus = { x: cityPos.x + (cityWalkTarget || (busDrive && busDrive.active) ? 0 : cityCamOffset.x), y: cityPos.y + (cityWalkTarget || (busDrive && busDrive.active) ? 0 : cityCamOffset.y) }; /* CITY_EXPANSION_CITY2_E07_CAM_RENDER: the follow focus the shipped derivation below always clamped -- the player plus the pan offset, the offset ignored while travelling (the EXPANSION_DEL1_P_CAM rule, unchanged). */
  const cityCam = clampCamera(cityCamFocus ? cityCamFocus.x : cityCamTargetFocus.x, cityCamFocus ? cityCamFocus.y : cityCamTargetFocus.y, cityView.w || 800, cityView.h || 520); /* EXPANSION_DEL1_P_CAM: the pan offset shifts the follow focus; while a walk target stands or a bus drive owns the map the offset is ignored, so the player stays centred while travelling. clampCamera still bounds the view to the world. CITY_EXPANSION_CITY2_E07_CAM_RENDER: the clamped point is the EASED focus (E05/E06) once the movement tick has seeded it; before that (the first frames, or whenever the tick is not running) it is the shipped derivation itself, so a cold start renders exactly as VIS2C did. */
  const cityNear = nearestEntrance(cityPos, CITY_PLACES);
  const cityNearPlace = cityNear && cityNear.dist <= CITY_ENTER_RANGE ? cityNear.place : null;
  const cityNearOwned = cityNearPlace ? cityPlaceOwned(cityNearPlace, ownedBusinesses, propertiesOwned) : false;
  const cityLocation = cityLocationLabel(cityPos);
  const citySelectedBikeId = effectiveDisplayBike(ownedBikes, displayBike);
  const travelPromptDef = travelPromptId ? cityPlaceById(travelPromptId) : null; /* SKY_CITY_TRAVEL_V1_T_PROMPTDEF: the place the open travel prompt is asking about -- a render derivation in the same style as the guide's, recomputed each render from the transient prompt state. */
  const citySelectedBike = citySelectedBikeId ? BIKES.find((b) => b.id === citySelectedBikeId) || null : null;
  const cityRidingBikeDef = ridingBike ? BIKES.find((b) => b.id === ridingBike) || null : null;
  const cityWorkVehicleDef = workVehicleById(selectedWorkVehicle); /* BUSINESS_EXPANSION_BIZX1_E12_MARKER_DEF: the selected work vehicle resolved for the city marker (E13) -- null when none is selected or the stored id names nothing. */
  const cityFrame = garageFrameColors(bikeColorById(appliedBikeColor));
  const cityGuide = guidePlace && guidePlace.entrance ? guideTo(cityPos, guidePlace.entrance) : null;
  /* CITY_NAVIGATION_V1_E06_ROUTE_DERIVED: the drawn route to
   * the guide target, recomputed from the live position on
   * every render (the map re-renders as the player moves, so
   * the line follows). Follows the FIND A PLACE guide exactly
   * -- the same target cityGuide reads. Pure derivation: no
   * state, no setters, no clock. */
  const cityRouteWaypoints = guidePlace && guidePlace.entrance ? routeToEntrance(cityPos, guidePlace.entrance) : null;
  const cityRouteDots = cityRouteWaypoints ? routeDots(cityRouteWaypoints) : [];
  /* PLAYABLE_TRANSIT_V1_E06_DERIVED: what the drive layer
   * reads -- whether a drive owns the map, its current target
   * (stop or depot), the NAV1 guide + gold-dot route to that
   * target, whether the DOORS button is live, and the
   * objective chip's two lines. Pure derivation from the
   * busDrive state: no state, no setters, no clock. */
  const busDriving = !!(busDrive && busDrive.active);
  const busTarget = busDriving ? busTargetInfo(busDrive) : null;
  const busGuide = busTarget ? guideTo(cityPos, busTarget) : null;
  const busRouteWaypoints = busTarget ? routeToEntrance(cityPos, busTarget) : null;
  const busRouteDotsDrive = busRouteWaypoints ? routeDots(busRouteWaypoints) : [];
  const busDoorsReadyNow = busDriving ? busDoorsReady(busDrive, cityPos) : false;
  const busStopsDone = !busDriving ? 0 : (busDrive.phase === 'toDepot' || busDrive.phase === 'done' || (busDrive.phase === 'boarding' && busDrive.boardAt === 'depot') ? BUS_ROUTE_STOPS.length : busDrive.stopIndex);
  const busObjectiveLine = !busDriving ? '' :
    busDrive.phase === 'done' ? 'ROUTE COMPLETE' :
    busDrive.phase === 'boarding' ? (busDrive.boardAt === 'depot' ? 'AT THE DEPOT -- PASSENGERS GETTING OFF...' : 'BOARDING AT ' + busTarget.label + '...') :
    busDrive.phase === 'toDepot' ? 'FINAL STOP: TRANSIT DEPOT - ' + Math.round(busGuide.dist) + ' away' :
    'NEXT STOP ' + (busDrive.stopIndex + 1) + ' OF 3: ' + busTarget.label + ' - ' + Math.round(busGuide.dist) + ' away';
  const busObjectiveSub = !busDriving ? '' : 'STOPS ' + busStopsDone + ' OF 3 DONE - PASSENGERS ABOARD: ' + busDrive.passengers;
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
  const missionCustomerNow = activeMission ? missionCustomerTarget(activeMission) : null;
  const missionDeliveryTargetNow = activeMission ? missionDeliveryTarget(activeMission) : null; /* DELIVERY_ROUTES_DELIVERY1_E27_TARGET_DERIVED: the active delivery's current target (E04), derived beside missionCustomerNow in the same render pass -- the gate the banner's GO TO button (E25) and the name chips (E28/E29) render on. Null for every other mission kind. */ /* CITY_BUSINESS_JOBS_FIX_CBJ1F_E06_DERIVED: the active business job's customer, or null -- the single gate the GO TO CUSTOMER button (E04) and the FIND A PLACE customer row (E05) render on. missionCustomerTarget (E02) is the whole rule: the three business kinds resolve their customer, deliveries and the transit route never do, so the travel affordance exists exactly while a customer job is active. A pure read, derived beside the shipped mission derivations above, in the same render pass and before every use below it. */

  return (
    <ImageBackground source={ART.bgMainMenu} style={styles.bgFill} resizeMode="cover">
      {/* LOOKPASS_V1: main-menu background. */}
      <SafeAreaView style={[styles.safe, styles.safeArt]}>
      <ScrollView contentContainerStyle={styles.page} scrollEnabled={cityPageScroll}>{/* EXPANSION_DEL1_P_SCROLL: the map pan responder (and any touch on the map viewport) turns page scroll off while a drag owns the touch, so pan and page never fight. */}
        <View style={styles.header}>
          {freeRoam ? (
            <View>
              {/* SKY_CITY_TRAVEL_V1_H_HEADER: on the city screen the header is one row tall -- the title on a single line at 20pt, the build label kept directly under it. Nothing is hidden: the label and the LEVEL pill both stay. The pre-free-roam menu keeps the tall two-line branded header in the other branch. */}
              <Text style={styles.trv1LogoOneLine}>SKY'S THE LIMIT</Text>
              <Text style={styles.buildLabel}>{'BUILD: ' + BUILD_LABEL}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.logoSmall}>SKY'S</Text>
              <Text style={styles.logoBig}>THE LIMIT</Text>
              {/* LOOKPASS_V1: gold rule under title. */}
              <View style={styles.goldRule} />
              {/* CITY_NAVIGATION_V1_E15_HEADER_LABEL */}
              <Text style={styles.buildLabel}>{'BUILD: ' + BUILD_LABEL}</Text>
            </View>
          )}

          <View style={styles.levelPill}>
            <Text style={styles.levelText}>
              LEVEL {1 + Math.floor(xp / 250)}
            </Text>
          </View>
        </View>

        {freeRoam ? (
          <View style={styles.trv1XpRow}>
            {/* SKY_CITY_TRAVEL_V1_H_XPFOLD: on the city screen the XP-to-next line folds INTO the progress row -- bar and text side by side on one line instead of two stacked rows. Same numbers and the same 12pt text; the pre-free-roam menu keeps the stacked bar in the other branch. */}
            <View style={[styles.progressTrack, styles.trv1XpTrackFlex]}>
              <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
            </View>
            <Text style={styles.trv1XpText}>{'XP to next level: ' + xpToNext}</Text>{/* READABILITY_VIS5_E11_XP_HEADER: the free-roam progress row names the figure plainly -- 'XP to next level: N' -- the same shipped xpToNext value the bar beside it reads; no XP number moves. */}
          </View>
        ) : (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        )}

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
            {/* FRIENDS_EARLY_ACCESS_EA1_E07_MENU_BUTTON: HOW TO PLAY on
             * the start menu, inside the intro card under the
             * step's own button, so a new player can read how
             * the game works before starting. helpReturn null:
             * BACK returns to this menu flow. Display only. */}
            <TouchableOpacity
              style={styles.secondary}
              onPress={() => { setHelpReturn(null); setPlace('HELP'); }}
            >
              <Text style={styles.secondaryText}>HOW TO PLAY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cityWelcome}>
              {/* SKY_CITY_TRAVEL_V1_H_WELCOME: the city screen's welcome is one line -- Sky City and the day -- plus the payday line. The two-line how-to body was onboarding text; the map's own ENTER button teaches it now. (This card only ever renders in free roam.) */}
              <Text style={styles.trv1WelcomeLine}>Sky City — {DAY_NAMES[day % 7]}</Text>
              <Text style={styles.paydayLine}>{paydayLine(day)}</Text>
            </View>
            {/* SKY_CITY_TRAVEL_V1_H_NOTITLE: the EXPLORE THE CITY section title is dropped on the city screen -- the map is self-evident once you are in it. The reclaimed height goes to the taller viewport (H04). */}
            {/* EXPLORE_CITY_V1_E13_MAP: the explorable city. The world
                (2400x1600) sits in a fixed viewport, translated by the
                camera; HUD, minimap and controls overlay it. Tap the
                ground to walk there, tap a building to walk to its
                door, or hold the D-pad. */}
            <View
              style={[styles.cityViewport, styles.trv1CityViewportTall]}
              {...cityPanResponder.panHandlers}
              onTouchStart={() => setCityPageScroll(false)}
              onTouchEnd={() => setCityPageScroll(true)}
              onTouchCancel={() => setCityPageScroll(true)}
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
                    if (busDriving) return; /* PLAYABLE_TRANSIT_V1_E08A_TAP_GUARD: the pedals drive; taps do not walk the bus. */
                    const n = e.nativeEvent || {};
                    if (Number.isFinite(n.locationX) && Number.isFinite(n.locationY)) {
                      cityTapResolve({ x: n.locationX, y: n.locationY }); /* NAVIGATION_EASE_V1_E05A_TAP_LOCAL */
                      return;
                    }
                    /* Web: press events carry page coordinates; the
                     * world view's measured position already includes
                     * the camera translation. */
                    if (cityWorldRef.current && Number.isFinite(n.pageX) && Number.isFinite(n.pageY)) {
                      cityWorldRef.current.measure((fx, fy, w, h, px, py) => {
                        cityTapResolve({ x: n.pageX - px, y: n.pageY - py }); /* NAVIGATION_EASE_V1_E05B_TAP_WEB */
                      });
                    }
                  }}
                />
                <CityGroundStatic />
                <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: CITY_WORLD.w, height: CITY_WORLD.h, backgroundColor: mapTintForHour(hours).color, opacity: mapTintForHour(hours).opacity }} />
                <CityBuildingsStatic ownedBusinesses={ownedBusinesses} propertiesOwned={propertiesOwned} dealershipOwned={dealershipOwned} guideTargetId={guideTargetId} onBuildingPress={cityBuildingPress} />{/* TABLET_FIXES_CITY5_E09_SIGN_PROP: the parent passes its shipped dealershipOwned state down (E06) -- a prop pass, no new state. */}
                <CityLightsStatic />{/* VISUAL_V1_E03B_LIGHTS_RENDER */}
                <CityLampGlowStatic glow={mapTintForHour(hours).opacity} />{/* FULLER_CITY_VIS4_E14_GLOW_RENDER: the E13 lamp pools ride the shipped tint derivation -- the same mapTintForHour(hours) the tint overlay above reads -- so by day the prop is 0 and the layer is absent. No new state, no new timer. */}
                {/* CITY_NAVIGATION_V1_E04_ENTRANCES_RENDER: the marked entrances layer. */}
                <CityEntrancesStatic />
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
                {/* FULLER_CITY_VIS4_E11_WALKER_RENDERS: walkers 5 and 6 (E09) get the identical AmbientActor plus PlayerFigure treatment -- one native-driver errand loop each, pointerEvents none inside the actor, nothing persisted. */}
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[4]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[4].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} walker={LIVING_CITY_WALKERS[5]} reduceMotion={reduceMotion}>
                  <PlayerFigure shirt={LIVING_CITY_WALKERS[5].shirt} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[0]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[0].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[1]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[1].body} />
                </AmbientActor>
                {/* FULLER_CITY_VIS4_E12_CAR_RENDERS: cars 3 and 4 (E10) get the identical AmbientActor plus CarFigure treatment -- the same shuttle loop on the native driver, nothing persisted. */}
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[2]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[2].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[3]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[3].body} />
                </AmbientActor>
                {/* MAIN_STREET_TRAFFIC_VIS6_E04_CAR_RENDERS: cars 5 and 6 (the main-street pair) get the identical AmbientActor plus CarFigure treatment -- the same shuttle loop on the native driver, placed on the main street by their avenue field; pointerEvents none inside the actor, nothing persisted. */}
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[4]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[4].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} car={LIVING_CITY_CARS[5]} reduceMotion={reduceMotion}>
                  <CarFigure body={LIVING_CITY_CARS[5].body} />
                </AmbientActor>
                <AmbientActor mapSize={CITY_ACTOR_SIZE} bus={BUS_STOPS} reduceMotion={reduceMotion}>
                  <BusFigure />
                </AmbientActor>
                {/* CITY_NAVIGATION_V1_E05_ROUTE_RENDER: the gold
                    dot route to the guide target's entrance,
                    drawn in the world under the player. Purely a
                    picture of routeToEntrance's output. */}
                {cityRouteDots.length > 0 && (
                  <View pointerEvents="none" style={styles.cityLayer}>
                    {cityRouteDots.map((d, i) => (
                      <View key={'route' + i} style={[styles.cityRouteDot, { left: d.x - 5, top: d.y - 5 }]} />
                    ))}
                  </View>
                )}
                {/* PLAYABLE_TRANSIT_V1_E07A_STOPS_RENDER: while
                    driving -- the gold-dot route to the CURRENT
                    target (same NAV1 renderer), a ring + bus-stop
                    sign at each passenger stop (gold = current
                    target, green = served, dim = upcoming) and
                    the depot ring at the Transit entrance. Pure
                    pictures of the drive state. */}
                {busDriving && busRouteDotsDrive.length > 0 && (
                  <View pointerEvents="none" style={styles.cityLayer}>
                    {busRouteDotsDrive.map((d, i) => (
                      <View key={'busroute' + i} style={[styles.cityRouteDot, { left: d.x - 5, top: d.y - 5 }]} />
                    ))}
                  </View>
                )}
                {busDriving && (
                  <View pointerEvents="none" style={styles.cityLayer}>
                    {BUS_ROUTE_STOPS.map((s, i) => {
                      const isCurrent = busTarget && !busTarget.isDepot && busDrive.stopIndex === i && busDrive.phase !== 'toDepot' && busDrive.phase !== 'done';
                      const isDone = i < busStopsDone;
                      return (
                        <View key={'busstop' + s.id}>
                          <View style={[styles.busStopRing, isCurrent ? styles.busStopRingCurrent : isDone ? styles.busStopRingDone : styles.busStopRingIdle, { left: s.x - BUS_STOP_RADIUS, top: s.y - BUS_STOP_RADIUS }]} />
                          <View style={[styles.busStopSign, { left: s.x - 70, top: s.y - BUS_STOP_RADIUS - 34 }]}>
                            <Text style={styles.busStopSignText}>{'🚌 ' + s.name}</Text>
                          </View>
                        </View>
                      );
                    })}
                    {(() => {
                      const d = busDepotPoint();
                      const isCurrent = !!(busTarget && busTarget.isDepot);
                      return (
                        <View>
                          <View style={[styles.busStopRing, isCurrent ? styles.busStopRingCurrent : styles.busStopRingIdle, { left: d.x - BUS_STOP_RADIUS, top: d.y - BUS_STOP_RADIUS }]} />
                          <View style={[styles.busStopSign, { left: d.x - 70, top: d.y - BUS_STOP_RADIUS - 34 }]}>
                            <Text style={styles.busStopSignText}>🚌 DEPOT - FINISH</Text>
                          </View>
                        </View>
                      );
                    })()}
                  </View>
                )}
                {cityWalkTarget && (
                  <View pointerEvents="none" style={[styles.cityTargetMark, { left: cityWalkTarget.x - 11, top: cityWalkTarget.y - 11 }]} />
                )}
                {/* EXPANSION_DEL1_M_MARK: an in-world marker on the active mission's current spot (pickup / drop-off / work spot), so the destination is visible in the world itself, not only as a minimap ring. Pure picture of missionSpotNow. */}
                {missionSpotNow && !busDriving && (
                  <View pointerEvents="none" style={[styles.del1MissionMark, { left: missionSpotNow.x - 16, top: missionSpotNow.y - 16 }]}>
                    <Text style={styles.del1MissionMarkText}>{"🎯"}</Text>
                  </View>
                )}
                {/* CITY_EXPANSION_CITY2_E08_MISSION_CHIP: a floating destination label above the pin, for BUSINESS missions only -- the gate is the shipped missionCustomerNow derivation (E06 CBJ1F), which resolves a customer target for the three business kinds and nothing else, so deliveries and the transit route keep the bare pin exactly as shipped. The text names the customer and its business off the same derivations the guide chip and the GO TO list read (during the Food Stand's PREP stage the target is the stand itself, so the stand is named alone). Position rides missionSpotNow, the pin's own spot, so the chip tracks stage changes and vanishes with the mission. Render-only: one Text, one string; no mission, guide or payment state is touched. VISUAL_CONSISTENCY_CITY3_E05_CHIP_OFFSET: CITY3 raises the chip from spot.y - 76 to spot.y - 204 (+128) -- the customer houses (E04) rise up to 166 units above the spot, and 204 = the tallest house (166) + the chip's own height (~30) + clearance, so the label floats above the roof instead of lying across it. The pin does not move. */}
                {/* TABLET_FIXES_CITY5_E02_CHIP_GATE: the name tag no longer hides while the bus is being driven -- startBusRoute never retires a business mission (it refuses only a transit_route one), so a business job can ride along on a drive with its mission still active, and the shipped !busDriving term blanked the tag for the whole drive. The tag is a world picture, so it renders in every state now; the pin, the banner and the guide chip keep their shipped drive gates, and the banner-overlap case is E04's overlay. */}
                {missionSpotNow && (missionCustomerNow || missionDeliveryTargetNow) && (
                  <View pointerEvents="none" style={[styles.city2MissionChip, { left: missionSpotNow.x - 120, top: missionSpotNow.y - 204 }]}>
                    <Text style={styles.city2MissionChipText}>{missionCustomerNow ? '🎯 ' + missionCustomerNow.customer + (missionCustomerNow.customer === ((BUSINESSES.find((b) => b.id === activeMission.kind) || {}).name || '') ? '' : ' · ' + ((BUSINESSES.find((b) => b.id === activeMission.kind) || {}).name || 'Business')) : '🎯 ' + (activeMission.stage === 'deliver' ? missionDeliveryTargetNow.customer + ' · Stop ' + (missionDeliveryTargetNow.stopIndex + 1) + ' of ' + missionDeliveryTargetNow.stopCount : 'Store · Pickup')}</Text>{/* DELIVERY_ROUTES_DELIVERY1_E28_CHIP_WORLD: a delivery gets the same name tag over its current target (E27's derivation) -- the Store at pickup, the current stop WITH its position in the route while delivering. The business text is byte-identical inside the first arm. */}
                  </View>
                )}
                {!busDriving && (
                <View pointerEvents="none" style={[styles.cityPlayerMark, { left: cityPos.x - 20, top: cityPos.y - 48 }]}>
                  {/* VISUAL_CONSISTENCY_CITY3_E06_MARKER_DISC: a gold ground disc under the player (styles E23) -- absolutely positioned as the marker's first child, so it paints behind the figure and shifts no layout: its centre (local 20, 62) sits directly under the figure's feet. The marker's anchor offsets, the tick, speeds and arrival never read it. */}
                  <View style={styles.city3PlayerDisc} />
                  {/* BUSINESS_EXPANSION_BIZX1_E13_MARKER: a selected work vehicle (E02/E12) rides the marker -- the ring shows as it does on the bike, the step bob stops (the player is driving, not walking), and the vehicle's glyph sits between the figure and the YOU tag, the same emoji-in-marker pattern as the route badge below. The vehicle outranks the bike here exactly as it does in the tick's speed (E09); the ridingBike state itself is untouched. */}
                  <View style={ridingBike || cityWorkVehicleDef ? [styles.cityRideRing, { borderColor: cityFrame.frame }] : styles.city3PlayerRing}>{/* VISUAL_CONSISTENCY_CITY3_E07_MARKER_RING: on foot the ring was transparent (cityRideRingOff) -- the on-foot branch now takes city3PlayerRing (styles E23): the same ring geometry with a gold border and a dark backing, so the player reads at a glance in every state. Both ring styles carry the same 1.15 scale (E08), a visual-only grow around the ring's own centre; layout size, and with it the marker anchor, is unchanged. */}
                    <PlayerFigure shirt={wornOutfitDef.shirt} legs={wornOutfitDef.legs} bob={cityWalkTarget && !ridingBike && !cityWorkVehicleDef ? (Math.floor((cityPos.x + cityPos.y) / 8) % 2 === 0 ? 0 : -2) : 0} />{/* VISUAL_V1_E07_PLAYER_BOB: a subtle 2px step bob while tap-walking, derived from the existing walk target + position state -- no new state, no timers. */}
                  </View>
                  {cityWorkVehicleDef && (
                    <View style={styles.city3VehicleBadge}>{/* VISUAL_CONSISTENCY_CITY3_E09_MARKER_BADGE: the work-vehicle glyph gains a ringed badge (styles E23) -- the house language of black with a gold ring, and a larger glyph (27, was cityBusEmoji's 24) -- so the selected ride reads at a glance. The badge sits in flow below the figure, so only the YOU tag below it rides a few units lower. The transit badge further down keeps the shared cityBusEmoji, untouched. */}
                      {/* BUSINESS_EXPANSION_BIZX1_E13_MARKER_GLYPH */}
                      <Text style={styles.city3VehicleGlyph}>{cityWorkVehicleDef.glyph}</Text>
                    </View>
                  )}
                  <Text style={styles.cityTag}>YOU</Text>
                </View>
                )}
                {/* PLAYABLE_TRANSIT_V1_E07B_BUS_MARK: while
                    driving, the player figure is replaced by the
                    bus -- a yellow rounded body rotated to the
                    drive heading (transform rotate around its
                    center; the BUS tag below stays upright
                    because it sits outside the rotated body). */}
                {busDriving && (
                  <View pointerEvents="none" style={[styles.busMarkWrap, { left: cityPos.x - 30, top: cityPos.y - 34 }]}>
                    {/* VISUAL_V1_E10_BUS_SHADOW: ground shadow under the driven bus, outside the rotated body so it never spins. */}
                    <View style={vis.busGroundShadow} />
                    <View style={[styles.busBody, { transform: [{ rotate: busDrive.headingDeg + 'deg' }] }]}>
                      <View style={styles.busWindshield} />
                      <Text style={styles.busBodyEmoji}>🚌</Text>
                    </View>
                    <Text style={styles.cityTag}>BUS</Text>
                  </View>
                )}
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
                <CitySignsStatic ownedBusinesses={ownedBusinesses} propertiesOwned={propertiesOwned} dealershipOwned={dealershipOwned} />{/* READABILITY_VIS5_E05_SIGNS_RENDER: the sign layer (E03) renders here -- after the player marker and the bus marks, the last world-space layer inside the world view -- so every sign pill paints above the marker and its YOU tag. The props are the parent's shipped ownership state, the same pass the buildings layer gets. HUD, minimap and every screen-space overlay below are untouched. */}
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
              {cityGuide && guidePlace && !activeMission && !busDriving && ( /* CITY_JOBS_V1_E18_GUIDE_CHIP: the mission guide owns this slot while a mission is active. PLAYABLE_TRANSIT_V1_E08B_GUIDE_GATE: the drive objective chip owns this slot while driving. */
                <View style={styles.cityGuideChip}>
                  <Text style={styles.cityGuideArrow}>{guideArrowChar(cityGuide.angle)}</Text>
                  <Text style={styles.cityGuideText}>{guidePlace.name} • {Math.round(cityGuide.dist)}</Text>
                  <TouchableOpacity onPress={() => { clearPendingEnter(); /* NAVIGATION_EASE_V1_E12_GUIDE_X_CLEAR */ setGuideTargetId(null); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.cityGuideX}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* CITY_JOBS_V1_E17_BANNER: the mission guide
                  chip (arrow, target, distance) and the
                  objective banner -- objective, progress, a
                  notice line and CANCEL -- readable while
                  moving, in the same black-and-gold language. */}
              {activeMission && missionGuide && missionSpotNow && !busDriving && ( /* PLAYABLE_TRANSIT_V1_E08C_MISSION_CHIP_GATE */
                <View style={styles.cityGuideChip}>
                  <Text style={styles.cityGuideArrow}>{guideArrowChar(missionGuide.angle)}</Text>
                  <Text style={styles.cityGuideText}>{missionSpotNow.name} • {Math.round(missionGuide.dist)}</Text>
                </View>
              )}
              {activeMission && missionObjectiveNow && !busDriving && ( /* PLAYABLE_TRANSIT_V1_E08D_MISSION_BANNER_GATE */
                <View style={styles.cityBanner}>
                  <Text style={styles.cityBannerTitle}>{missionObjectiveNow.title}</Text>
                  <Text style={styles.cityBannerText}>{missionObjectiveNow.text}</Text>
                  {missionNotice !== '' && (
                    <Text style={styles.cityBannerNotice}>{missionNotice}</Text>
                  )}
                  {(missionCustomerNow || missionDeliveryTargetNow) && ( /* DELIVERY_ROUTES_DELIVERY1_E25_BANNER_GATE: for a delivery the same gold button rides the E04/E24 target -- GO TO STORE at pickup, GO TO CUSTOMER at a stop (E26's label). */ /* CITY_BUSINESS_JOBS_FIX_CBJ1F_E04_BUTTON: GO TO CUSTOMER -- one tap starts the trip to the active job's customer (the E03 handler), from inside the mission banner that already carries the objective text and CANCEL MISSION, so the travel sits directly with the mission status. It renders only while a business mission is active (the E06 derivation carries the E02 gate), in the banner's gold primary style -- the red cancel style stays CANCEL's alone. Starting the trip pays nothing, counts nothing and clocks nothing: COMPLETE JOB on arrival is still the only finish. */
                    <TouchableOpacity style={[styles.cityGoldBtn, styles.city4BannerGoldBtn]} onPress={goToMissionCustomer}>{/* READABILITY_CITY4_E03_BANNER_GOLD_BTN: inside the mission banner the gold action button takes the E04 slimming override (paddingVertical 12 -> 8) so the banner stack stays compact; the shared cityGoldBtn style is untouched, so the completion panel's DONE button keeps its shipped padding. Same handler, same label, same gold. */}
                      <Text style={styles.cityGoldBtnText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{activeMission && activeMission.kind === 'delivery' ? (activeMission.stage === 'deliver' ? 'GO TO CUSTOMER' : 'GO TO STORE') : activeMission && activeMission.kind === 'foodstand' && activeMission.stage === 'prep' ? 'GO TO MAE\'S PLACE' : 'GO TO CUSTOMER' /* MAES_PLACE_MAE1_E23_BANNER: the prep-stage banner button names the restaurant it walks to (E12); the label keeps the shipped shrink-to-fit props on its Text, and every other mission's label is untouched. */}</Text> {/* DELIVERY_ROUTES_DELIVERY1_E26_BANNER_LABEL: a delivery's button names its target -- the Store at pickup, the customer at a stop; business labels are the shipped ones. */} {/* BANNER_LABEL_DELIVERY1G_E02_LABEL_FIX: DELIVERY1 left the E26 marker as bare text inside the <Text> above -- outside the {} expression, so React Native rendered the whole comment as part of the button label (the label read GO TO STORE plus the full E26 comment text at pickup, and GO TO CUSTOMER plus it at a stop; seen on the parent agent's live drive of DELIVERY1F). DELIVERY1G moves the marker here, into a real JSX comment beside the CITY3 E19 note; the label is the ternary alone now and its words are unchanged. */} {/* VISUAL_CONSISTENCY_CITY3_E19_GOLD_TEXT_PROPS: single-line shrink-to-fit on the gold mission button's label -- both of its words ('GO TO CUSTOMER', 'GO TO FOOD STAND') now shrink a step instead of clipping if they ever measure wide. Words unchanged. */} {/* FOOD_STAND_EXPANSION_FSX1_E29_BANNER_BUTTON: during PREP the same shipped road-route walk (goToMissionCustomer, its target from E23) goes to the Food Stand, and the button says so; every other mission keeps GO TO CUSTOMER. */}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.cityBannerCancel} onPress={cancelMission}>
                    <Text style={styles.cityBannerCancelText}>CANCEL MISSION</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* TABLET_FIXES_CITY5_E04_CHIP_OVERLAY: while the mission banner is up it paints over the world chip whenever the chip's screen rect crosses the banner band -- on arrival at a mid-field customer the follow camera centres the player on the spot, which puts the chip at about screen y 116, squarely inside the band (banner top 102, full width, zIndex 20, rendered after the world layer). This screen-space twin renders AFTER the banner, gated by E03's pure overlap test on the same cityCam the world transform uses, so it appears exactly when (and where) the world chip is covered, showing the identical tag in the identical style at the identical screen position, on top of the banner instead of behind it. When the rects do not cross, the world chip alone shows. Not rendered while driving (no banner then; the world chip, E02, carries the tag). pointerEvents none, like the chip it mirrors. */}
              {missionSpotNow && (missionCustomerNow || missionDeliveryTargetNow) && !busDriving && city5ChipCoveredByBanner(missionSpotNow, cityCam, cityView.w || 800) && (
                <View pointerEvents="none" style={[styles.city2MissionChip, { left: missionSpotNow.x - 120 - cityCam.x, top: missionSpotNow.y - 204 - cityCam.y, zIndex: 30 }]}>
                  <Text style={styles.city2MissionChipText}>{missionCustomerNow ? '🎯 ' + missionCustomerNow.customer + (missionCustomerNow.customer === ((BUSINESSES.find((b) => b.id === activeMission.kind) || {}).name || '') ? '' : ' · ' + ((BUSINESSES.find((b) => b.id === activeMission.kind) || {}).name || 'Business')) : '🎯 ' + (activeMission.stage === 'deliver' ? missionDeliveryTargetNow.customer + ' · Stop ' + (missionDeliveryTargetNow.stopIndex + 1) + ' of ' + missionDeliveryTargetNow.stopCount : 'Store · Pickup')}</Text>{/* DELIVERY_ROUTES_DELIVERY1_E29_CHIP_OVERLAY: the banner-overlap twin of E28 -- same gate, same text, so a delivery's tag survives the banner exactly as a business tag does. */}
                </View>
              )}
              {/* EXPANSION_DEL1_P_STOPBTN: the labelled walk cancel (D2), shown whenever a walk target stands and no bus drive owns the map. Sits above the ENTER slot, clear of the D-pad and the control column. */}
              {cityWalkTarget && !busDriving && (
                <View style={styles.del1StopWalkWrap} pointerEvents="box-none">
                  <TouchableOpacity style={styles.del1StopWalkBtn} onPress={cityStopWalk}>
                    <Text style={styles.del1StopWalkText}>{selectedWorkVehicle ? "✕ STOP DRIVING" : "✕ STOP WALK"}</Text> {/* FOOD_STAND_EXPANSION_FSX1_E30_STOP_LABEL: the label names the travel mode -- a selected work vehicle means the player is driving. The stop itself (cityStopWalk) is untouched; on foot or on a bike the button keeps STOP WALK. */}
                  </TouchableOpacity>
                </View>
              )}
              {/* REALISTIC_LOOK_VIS2_E04_DPAD_REMOVED: the hold-to-walk
                  arrow pad that stood here is removed. Tap-to-destination
                  travel is the control scheme now -- tap a building or a
                  spot on the map, or use GO TO / FIND A PLACE and the
                  mission buttons -- and the bottom-left of the map stays
                  clear over the detailed building art. The pad's Settings
                  toggle is gone too (E02); its save field still loads and
                  persists untouched (see the E02 note). Bus Drive Mode
                  steering was never this control set -- it renders
                  separately while a drive owns the map and is untouched. */}
              {/* CITY_BAR_FIX_VIS2C_E02_BAR_MOVED: the VIS2 bottom control bar stood here -- an absolutely positioned wrap at the map's bottom edge holding a horizontal ScrollView row (REALISTIC_LOOK_VIS2_E05_BAR_OPEN .. E09_BAR_CLOSE). On Zabby's Android tablet the row never measured: the bar rendered as an empty dark strip, the WALK/RIDE toggle stretched full-width (WALK squished to a sliver, the bike segment a long slab) and none of the five chips was visible or reachable, in portrait or landscape -- while the same bar rendered correctly on web. VIS2C moves the whole {!busDriving && ...} block, gate and controls byte-identical, into normal flow directly below the map viewport as a wrapping plain-View row (E03), and returns the three offsets VIS2 raised to clear the overlay bar to their pre-VIS2 values (E06-E08). */}
              {/* ENTER (or the not-owned note) for the nearest entrance. */}
              {cityNearPlace && !missionActionVisible && !busDriving && ( /* CITY_JOBS_V1_E19_ENTER_SLOT: a mission action owns this slot while offered. PLAYABLE_TRANSIT_V1_E08I_ENTER_GATE: the DOORS button owns this slot while driving. */
                <View style={styles.cityEnterWrap} pointerEvents="box-none">
                  {cityNearOwned ? (
                    <TouchableOpacity style={[styles.cityEnterBtn, cityView.w > 0 && cityView.w < 900 && styles.cityEnterBtnNarrow]} onPress={() => cityEnter(cityNearPlace)}>{/* CITY_TRAVEL_GARAGE_V1_E04_ENTER_NARROW: on a narrow measured city view (< 900, e.g. the demo window) ENTER alone takes the compact variant (padding 44 -> 24, text 23 -> 20) so a long sign (ENTER EMPLOYMENT CENTER) clears the D-pad and the control column; at tablet width it renders exactly as shipped. cityEnterWrap does not move, and the mission-action / bus-DOORS buttons that share this slot keep the shipped size. */}
                      <Text style={[styles.cityEnterText, cityView.w > 0 && cityView.w < 900 && styles.cityEnterTextNarrow]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>ENTER {cityNearPlace.sign}</Text> {/* VISUAL_CONSISTENCY_CITY3_E21_ENTER_TEXT_PROPS: single-line shrink-to-fit -- on a narrow screen the longest signs ('DEALERSHIP', 'FOOD STAND') now shrink a step instead of ever touching the button's edges. Words unchanged. */}
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
              {missionActionVisible && missionAction && !busDriving && ( /* PLAYABLE_TRANSIT_V1_E08J_MISSION_GATES */
                <View style={styles.cityEnterWrap} pointerEvents="box-none">
                  <TouchableOpacity style={styles.cityEnterBtn} onPress={missionInteractPress}>
                    <Text style={styles.cityEnterText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{missionAction.label}</Text> {/* VISUAL_CONSISTENCY_CITY3_E22_ACTION_TEXT_PROPS: the mission action button shares the ENTER slot and style (COLLECT PAYCHECK, COMPLETE ..., board / alight) -- the same single-line shrink-to-fit as E21, so no label in this slot can clip. Words unchanged (the labels are data, untouched). */}
                  </TouchableOpacity>
                </View>
              )}
              {/* CITY_JOBS_V1_E21_SUMMARY: the completion (or
                  unpaid-end) summary. Transient state only --
                  closing the app here loses nothing, the effects
                  were already applied exactly once. */}
              {missionSummary && !busDriving && ( /* PLAYABLE_TRANSIT_V1_E08J2_MISSION_SUMMARY_GATE */
                <View style={styles.citySummaryPanel}>
                  <Text style={styles.cityFindTitle}>{missionSummary.title}</Text>
                  {missionSummary.lines.map((line, i) => (
                    <Text key={i} style={styles.citySummaryLine}>{line}</Text>
                  ))}
                  {missionSummary.title === 'Route complete!' && deliveryPayWaiting > 0 && (
                    <TouchableOpacity style={styles.cityGoldBtn} onPress={() => { setMissionSummary(null); setPlace('JOB_BOARD'); }}>
                      <Text style={styles.cityGoldBtnText}>GO TO COLLECT</Text>
                    </TouchableOpacity>
                  )} {/* COLLECTION_UX_DELIVERY2_E13_GO_TO_COLLECT: on the route-complete panel only (the 'Route complete!' title is set by exactly one completion path, the delivery branch) and only while pay waits, a real button straight to the board where the collect block now sits at the top (E08). The press closes the transient panel and runs the shipped board navigation -- the CITY JOBS chip's own setPlace call -- and touches no money state: no cash, no waiting pool, no stamp, no history entry moves. The label is the button text's only child; this marker sits in a JSX comment after the gate, never inside a text element. */}
                  <TouchableOpacity style={styles.cityGoldBtn} onPress={() => setMissionSummary(null)}>
                    <Text style={styles.cityGoldBtnText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* Find-a-place panel: EXPANSION_DEL1_F_COMMENT -- choosing a destination now WALKS there and auto-opens (or shows the doorstep note) on arrival, exactly like GO TO: the press routes through cityTravelTo (the shipped immediate-travel body, renamed in TRV1; panels never prompt). The old guide-only behaviour is gone, by Zabby's request (audit 1f). */}
              {findOpen && !busDriving && ( /* PLAYABLE_TRANSIT_V1_E08K_FIND_GATE */
                <View style={styles.cityFindPanel}>
                  <Text style={styles.cityFindTitle}>TRAVEL</Text> {/* READABILITY_VIS5_E17_TRAVEL_PANEL: the destination panel takes the chip's new name (E16) -- the panel, its rows and the cityTravelTo funnel are untouched. */}
                  <ScrollView style={styles.big1FindScroll} nestedScrollEnabled={true}>{/* BIG_PACKAGE_BIG1_E02_FIND_SCROLL: the destination rows scroll INSIDE the panel (bounded by big1FindScroll's maxHeight) so the FIND A PLACE header above and the CLOSE button below stay fixed and reachable -- the unwrapped grid stood ~620px tall from the panel's top offset and pushed the last rows and CLOSE past the city viewport's bottom edge. Gesture safety is inherited, not invented: the map PanResponder already refuses to claim any drag while this panel is open (the findOpen clause in onMoveShouldSetPanResponder), and nestedScrollEnabled hands a drag on the rows to this ScrollView instead of the page ScrollView around the city, so a drag on the rows scrolls the list -- it cannot start a walk (walks start on taps, and the post-release guard is pan-only) or a camera pan. Row onPress is the shipped travel funnel, unchanged; B03 closes this ScrollView after the grid. */}
                  <View style={styles.cityFindGrid}>
                    {missionCustomerNow && missionGuide && ( /* CITY_BUSINESS_JOBS_FIX_CBJ1F_E05_FIND_ROW: while a business mission is active, its customer leads FIND A PLACE as the first row -- the destination that was missing from this list. The row follows the panel's own shape (a name line and a status line on the GO TO-sized button) and its tap is the other rows' shape too -- close the panel, start the trip -- except the trip is the E03 customer trip rather than a place trip: nothing is armed to open on arrival, and the mission's COMPLETE JOB stays the finish. The status line is the customer's own location label with the live guide distance, the mission chip's figure. No row renders for any other mission kind, or with no mission: the E06 derivation is null then. */
                      <TouchableOpacity style={styles.nav2GoToBtn} onPress={() => { setFindOpen(false); goToMissionCustomer(); }}>
                        <Text style={styles.nav2GoToName}>{'🎯 ' + missionCustomerNow.customer + ' — ' + ((BUSINESSES.find((b) => b.id === activeMission.kind) || {}).name || 'Business') + ' job'}</Text>
                        <Text style={styles.nav2GoToStatus}>{missionCustomerNow.label + ' • ' + Math.round(missionGuide.dist) + ' away'}</Text>
                      </TouchableOpacity>
                    )}
                    {CITY_PLACES.filter((p) => p.entrance).map((p) => (
                      <TouchableOpacity key={p.id} style={styles.nav2GoToBtn} onPress={() => { setFindOpen(false); cityTravelTo(p); }}>{/* EXPANSION_DEL1_F_CHIP: GO TO-sized buttons (minHeight 60, 19pt name, status line) that walk via cityTravelTo (TRV1: the immediate-travel body; map taps prompt, panels never do). */}
                        <Text style={styles.nav2GoToName}>{p.name}</Text>
                        <Text style={styles.nav2GoToStatus}>{goToStatusLine(p, cityPos, ownedBusinesses, propertiesOwned)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  </ScrollView>{/* BIG_PACKAGE_BIG1_E03_FIND_SCROLL_CLOSE: pairs with B02 -- the grid View closes, then the ScrollView; the CLOSE button stays OUTSIDE the scroll region, fixed under it. */}
                  <TouchableOpacity style={styles.cityDarkBtn} onPress={() => setFindOpen(false)}>
                    <Text style={styles.cityDarkBtnText}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* NAVIGATION_EASE_V1_E14A_ARRIVAL_NOTE: the
                  doorstep note after a tap-to-building trip
                  to a place that does not auto-open (E08). */}
              {cityArrivalNote !== '' && !busDriving && (
                <View style={styles.nav2ArrivalNoteWrap} pointerEvents="none">
                  <View style={styles.cityNote}>
                    <Text style={styles.cityNoteText}>{cityArrivalNote}</Text>
                  </View>
                </View>
              )}
              {/* NAVIGATION_EASE_V1_E14B_GO_TO_PANEL: quick
                  travel -- big labeled destinations; choosing
                  one is exactly a tap on that building (E04):
                  guide + walk, then auto-open (or the doorstep
                  note) on arrival. Locked properties say what
                  they need on their status line (E02). */}
              {goToOpen && !busDriving && (
                <View style={styles.cityFindPanel}>
                  <Text style={styles.cityFindTitle}>GO TO</Text>
                  <View style={styles.cityFindGrid}>
                    {GO_TO_DESTS.map((d) => {
                      const def = cityPlaceById(d.id);
                      if (!def) return null;
                      return (
                        <TouchableOpacity key={d.id} style={styles.nav2GoToBtn} onPress={() => { setGoToOpen(false); cityTravelTo(def); }}>
                          <Text style={styles.nav2GoToName}>{d.label}</Text>
                          <Text style={styles.nav2GoToStatus}>{goToStatusLine(def, cityPos, ownedBusinesses, propertiesOwned)}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity style={styles.cityDarkBtn} onPress={() => setGoToOpen(false)}>
                    <Text style={styles.cityDarkBtnText}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* SKY_CITY_TRAVEL_V1_T_PANEL: the travel prompt --
                  a building tap asks before it travels (T).
                  Modelled on the GO TO panel in the same slot:
                  the place's name, its GO TO status line, then
                  two big travel choices and CLOSE. WALK HERE
                  travels on foot (parking the bike first if
                  mounted); RIDE HERE mounts the garage-selected
                  bike and travels at ride speed; both arm the
                  trip through the shipped cityTravelTo, so
                  arrival and auto-open are identical either
                  way. Without an owned bike RIDE HERE is
                  disabled and says why on its own line. CLOSE
                  only dismisses -- a walk already running keeps
                  running (STOP WALK is the walk-cancel). */}
              {travelPromptDef && !busDriving && (
                <View style={styles.cityFindPanel}>
                  <Text style={styles.cityFindTitle}>{travelPromptDef.name}</Text>
                  <Text style={styles.nav2GoToStatus}>{goToStatusLine(travelPromptDef, cityPos, ownedBusinesses, propertiesOwned)}</Text>
                  <TouchableOpacity style={styles.trv1PromptBtn} onPress={travelPromptWalk}>
                    <Text style={styles.trv1PromptBtnText}>{"🚶 WALK HERE"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.trv1PromptBtn, styles.trv1PromptBtnRide, !citySelectedBike && styles.trv1PromptBtnOff]} disabled={!citySelectedBike} onPress={travelPromptRide}>
                    <Text style={styles.trv1PromptBtnRideText}>{"🏍 RIDE HERE"}</Text>
                  </TouchableOpacity>
                  {!citySelectedBike && (
                    <Text style={styles.nav2GoToStatus}>Own a motorcycle to ride</Text>
                  )}
                  <TouchableOpacity style={[styles.cityDarkBtn, styles.trv1PromptClose]} onPress={() => setTravelPromptId(null)}>
                    <Text style={styles.cityDarkBtnText}>CLOSE</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* PLAYABLE_TRANSIT_V1_E08L_DRIVE_HUD: while a bus
                  drive is active the normal map controls are
                  gated off above and this layer owns the
                  viewport: objective chip top-center, PAUSE
                  under the minimap, steering bottom-left, BRAKE
                  + GO bottom-right, DOORS in the ENTER slot
                  (raised above the pedal row). Every control is
                  at least 64px tall with text >= 18, hold-to-
                  press via onPressIn/onPressOut. The pause
                  overlay carries the required exit explanation;
                  the done panel is the ROUTE COMPLETE summary. */}
              {busDriving && (
                <View pointerEvents="none" style={styles.busObjectiveChip}>
                  <Text style={styles.busObjectiveText}>{busObjectiveLine}</Text>
                  <Text style={styles.busObjectiveSub}>{busObjectiveSub}</Text>
                </View>
              )}
              {busDriving && busDrive.phase !== 'done' && !busDrive.paused && (
                <TouchableOpacity style={styles.busPauseBtn} onPress={busPauseDrive}>
                  <Text style={styles.busPauseText}>⏸ PAUSE</Text>
                </TouchableOpacity>
              )}
              {busDriving && busDrive.phase !== 'done' && (
                <>
                  <View style={styles.busSteerWrap}>
                    <TouchableOpacity style={styles.busSteerBtn} onPressIn={() => busInputSet('left', true)} onPressOut={() => busInputSet('left', false)}>
                      <Text style={styles.busControlText}>◀</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.busSteerBtn} onPressIn={() => busInputSet('right', true)} onPressOut={() => busInputSet('right', false)}>
                      <Text style={styles.busControlText}>▶</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.busPedalWrap}>
                    <TouchableOpacity style={styles.busBrakeBtn} onPressIn={() => busInputSet('brake', true)} onPressOut={() => busInputSet('brake', false)}>
                      <Text style={styles.busControlText}>BRAKE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.busGoBtn} onPressIn={() => busInputSet('gas', true)} onPressOut={() => busInputSet('gas', false)}>
                      <Text style={styles.busControlText}>GO</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.busDoorsWrap} pointerEvents="box-none">
                    <TouchableOpacity style={busDoorsReadyNow || busDrive.phase === 'boarding' ? styles.busDoorsBtn : styles.busDoorsBtnOff} disabled={!busDoorsReadyNow} onPress={busDoorsPress}>
                      <Text style={styles.busDoorsText}>{busDrive.phase === 'boarding' ? (busDrive.boardAt === 'depot' ? '🚪 PASSENGERS GETTING OFF...' : '🚪 BOARDING...') : '🚪 OPEN DOORS'}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {busDriving && busDrive.paused && busDrive.phase !== 'done' && (
                <View style={styles.citySummaryPanel}>
                  {!busDrive.exitConfirm ? (<>
                    <Text style={styles.cityFindTitle}>PAUSED</Text>
                    <Text style={styles.citySummaryLine}>The bus is holding at the curb.</Text>
                    <TouchableOpacity style={styles.cityGoldBtn} onPress={busResumeDrive}>
                      <Text style={styles.cityGoldBtnText}>RESUME</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cityDarkBtn} onPress={busAskExit}>
                      <Text style={styles.cityDarkBtnText}>EXIT ROUTE</Text>
                    </TouchableOpacity>
                  </>) : (<>
                    <Text style={styles.cityFindTitle}>EXIT ROUTE?</Text>
                    <Text style={styles.citySummaryLine}>Route not finished. Exiting pays nothing and does NOT use up today's shift.</Text>
                    <TouchableOpacity style={styles.cityGoldBtn} onPress={busEndDrive}>
                      <Text style={styles.cityGoldBtnText}>EXIT ROUTE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cityDarkBtn} onPress={busCancelExit}>
                      <Text style={styles.cityDarkBtnText}>KEEP DRIVING</Text>
                    </TouchableOpacity>
                  </>)}
                </View>
              )}
              {busDriving && busDrive.phase === 'done' && (
                <View style={styles.citySummaryPanel}>
                  <Text style={styles.cityFindTitle}>ROUTE COMPLETE</Text>
                  {busDrive.summaryPaid ? (<>
                    <Text style={styles.citySummaryLine}>+$144 pending wages · +40 XP</Text>
                    {busDrive.summaryBonus > 0 && (<Text style={styles.citySummaryLine}>{'+' + busDrive.summaryBonus + ' coins -- weekly bonus for 3 shifts this week!'}</Text>)}
                    <Text style={styles.citySummaryLine}>Collect your paycheck Friday on the WORK screen.</Text>
                  </>) : (
                    <Text style={styles.citySummaryLine}>Daily limit reached -- come back tomorrow.</Text>
                  )}
                  <TouchableOpacity style={styles.cityGoldBtn} onPress={busEndDrive}>
                    <Text style={styles.cityGoldBtnText}>FINISH</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* CITY_BAR_FIX_VIS2C_E03_BAR_IN_FLOW: the city control bar in NORMAL FLOW directly below the map viewport (it stood inside the viewport as an overlay -- see the E02 note at its old site). The {!busDriving} gate is the shipped one, so the bar still hides while a bus drive owns the map. Inside, a plain wrapping row View (row styles E05) carries the shipped controls in the shipped order -- the WALK/RIDE segmented toggle first (its own gate on owning a bike, unchanged), then FIND A PLACE, CITY JOBS, MY BUSINESSES, GO HOME and GO TO as the shipped dark chips (wrap styles E04 keep the bar's dark fill and gold top border). Every label and press handler below is byte-identical to the VIS2 bar's; only the container changed, so nothing about the bar depends on ScrollView content measurement any more. */}
            {!busDriving && (<View style={styles.vis2CityBarWrap}>
              <View style={styles.vis2CityBarRow}>
                {(ridingBike && cityRidingBikeDef) || citySelectedBike ? (
                  <View style={[styles.cityModeToggle, styles.vis2BarToggle]}>{/* REALISTIC_LOOK_VIS2_E06_BAR_TOGGLE: the shipped segmented toggle, carried into the bar (E05) with only a cross-axis alignment override added (styles E10); its segments, presses and bike naming are byte-identical. */}
                    {/* CITY_TRAVEL_GARAGE_V1_E03_MODE_TOGGLE: one segmented RIDE/WALK control replaces the chip + RIDE/PARK BIKE pair, same slot, same visibility rule (with no bike owned this whole block renders nothing, exactly as before). The presses make the EXACT writes the old buttons made -- WALK is PARK BIKE's write (setRidingBike of null); the bike segment is RIDE's write (setRidingBike of citySelectedBikeId) -- and the current mode's segment is gold. The bike segment names the garage-selected bike with the chips' own shortening; numberOfLines + font shrink keep a long name (CVO Street Glide) inside its segment instead of pushing the layout. */}
                    <TouchableOpacity style={[styles.cityModeSeg, !ridingBike && styles.cityModeSegOn]} onPress={() => setRidingBike(null)}>
                      <Text style={[styles.cityModeSegText, !ridingBike && styles.cityModeSegTextOn]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>🚶 WALK</Text> {/* VISUAL_CONSISTENCY_CITY3_E17_SEG_WALK: the WALK segment gains exactly the single-line props its bike sibling already ships (numberOfLines 1 + adjustsFontSizeToFit + minimumFontScale 0.8) -- the two segments now measure identically. Words unchanged. */}
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cityModeSeg, ridingBike && styles.cityModeSegOn]} onPress={() => setRidingBike(citySelectedBikeId)}>
                      <Text style={[styles.cityModeSegText, ridingBike && styles.cityModeSegTextOn]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>🏍 {(citySelectedBike || cityRidingBikeDef).name.replace('Harley-Davidson ', '')}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <TouchableOpacity style={styles.vis2CityChip} onPress={() => { setGoToOpen(false); setFindOpen(true); }}>
                  <Text style={styles.vis2CityChipText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>TRAVEL</Text> {/* VISUAL_CONSISTENCY_CITY3_E12_CHIP_FIND: single-line shrink-to-fit -- the chip is a fixed-width pill; if the bold label ever measures wide on Android it now shrinks a step instead of clipping. Words unchanged. */}{/* REALISTIC_LOOK_VIS2_E07_BAR_FIND: FIND A PLACE as a bar chip (E05, styles E10) -- the shipped press handler, label and panel behaviour; the gold fill stays on the banner and summary buttons that still use it. */}
                </TouchableOpacity>{/* READABILITY_VIS5_E16_TRAVEL_CHIP: the destination chip reads TRAVEL now (Zabby's VIS5 wording) -- the shipped press (close GO TO, open the find panel), the panel and the travel funnel are untouched; the panel title (E17) and the HELP directions (E18) take the same name. */}{/* NAVIGATION_EASE_V1_E13A_FIND_MUTUAL: the two panels never stack. CITY_TRAVEL_GARAGE_V1_E02_FIND_GOLD: FIND A PLACE is the primary travel control (Zabby's pick) -- the column's gold button. onPress and both panels are untouched; GO TO below keeps the dark style. */}
                {/* CITY_JOBS_V1_E20_HUD_BUTTON: the job board is
                    also one tap from the map controls. */}
                {/* REALISTIC_LOOK_VIS2_E08_BAR_CHIPS: CITY JOBS, MY BUSINESSES, GO HOME and GO TO as bar chips (E05) -- shipped labels, shipped press handlers, the bar chip styles (E10) in place of the old column's dark buttons (which the FIND / GO TO / travel panels still use for their CLOSE buttons). */}
                <TouchableOpacity style={styles.vis2CityChip} onPress={() => setPlace('JOB_BOARD')}>
                  <Text style={styles.vis2CityChipText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>CITY JOBS</Text> {/* VISUAL_CONSISTENCY_CITY3_E13_CHIP_JOBS: single-line shrink-to-fit, same class fix as E12. Words unchanged. */}
                </TouchableOpacity>
                {/* BUSINESS_HEADQUARTERS_HQ1_E14_CITY_BUTTON: the
                    MY BUSINESSES dashboard is one tap from the map
                    controls, in the same dark-button stack as
                    CITY JOBS. */}
                <TouchableOpacity style={styles.vis2CityChip} onPress={() => setPlace('MY_BUSINESSES')}>
                  <Text style={styles.vis2CityChipText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>MY BUSINESSES</Text> {/* VISUAL_CONSISTENCY_CITY3_E14_CHIP_BIZ: single-line shrink-to-fit, same class fix as E12 -- the longest chip label, so the most exposed. Words unchanged. */}
                </TouchableOpacity>
                {/* CITY_NAVIGATION_V1_E08_GOHOME_BUTTON: one tap
                    back to the HOME entrance -- free and
                    instant, no clock or balance contact. */}
                <TouchableOpacity style={styles.vis2CityChip} onPress={cityGoHome}>
                  <Text style={styles.vis2CityChipText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>🏠 GO HOME</Text> {/* VISUAL_CONSISTENCY_CITY3_E15_CHIP_HOME: single-line shrink-to-fit, same class fix as E12. Words unchanged. */}
                </TouchableOpacity>
                {/* NAVIGATION_EASE_V1_E13B_GO_TO_BUTTON: quick travel (E14B). Sits with the other map controls, so the BUS1 gate on this block hides it while driving. */}
                <TouchableOpacity style={styles.vis2CityChip} onPress={() => { setFindOpen(false); setGoToOpen(true); }}>
                  <Text style={styles.vis2CityChipText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>🧭 GO TO</Text> {/* VISUAL_CONSISTENCY_CITY3_E16_CHIP_GOTO: single-line shrink-to-fit, same class fix as E12 -- this is the chip Zabby saw reading as 'GO'. Words unchanged. */}
                </TouchableOpacity>
              </View>
            </View>)}
            {/* PLAYABLE_TRANSIT_V1_E08H_CONTROLS_CLOSE */}

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
            label="Total XP"
            value={xp}
            accent={PURPLE}
            icon={ART.xp}
            small
            onPress={() => alert(`Total XP: ${xp}`)}
          />
          {/* READABILITY_VIS5_E10_XP_STAT: the stats-row XP tile is labelled 'Total XP' now (its tap alert agrees); the value is the shipped xp state, and the 250-per-level derivation is untouched. */}

          <Stat /* VISUAL_V1_E14C_COINS_STAT */
            label="COINS"
            value={coins}
            accent={GOLD}
            coinIcon
            onPress={() => alert(`Coin balance: ${coins}`)}
          />
        </View>

        {/* CITY_NAVIGATION_V1_E16_FOOTER_LABEL */}
        <Text style={styles.footer}>
          {"Sky's the Limit • Alpha 1.0 · " + BUILD_LABEL}
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
    fontSize: 15, /* VISUAL_V1_E12_STATVALUE: +1 size (weight was already 900; the Stat text already shrinks to fit its one line). */
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
    /* VISUAL_V1_E11A_PRIMARY_BEVEL: a lit top edge, a deeper bottom edge and a soft drop shadow -- style layering only; size, padding and tap target unchanged. */
    borderTopWidth: 1,
    borderTopColor: '#ffe9a8',
    borderBottomWidth: 3,
    borderBottomColor: '#a87f14',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
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

  /* DEALERSHIP_REPORT_CONTRAST_DX2_E02_STYLES: the dark panel
   * and light text for the dealership report + sales history
   * (E03), so the light lettering stays readable over the
   * bright dealership photo. reportTitle mirrors sectionTitle
   * exactly; reportBody mirrors body except the brighter
   * near-white color. Additive only -- no shipped style is
   * modified. */
  reportPanel: {
    backgroundColor: 'rgba(12,16,26,0.88)',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },

  reportTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },

  reportBody: {
    color: '#f2f5f9',
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 26,
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
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 4,
  }, /* REALISTIC_LOOK_VIS2_E13_LABEL_PILL: the named label-pill style takes the same solid dark backing as the rendered sign pill (E11) -- it was 'transparent' (the POLISH_V1 clear pill). NOTE: no render references this style today; the pill that actually draws building names is citySign (E11). This keeps the named style consistent so any future use inherits the readable backing. */

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

  /* FRIENDS_EARLY_ACCESS_EA1_E08_STYLES: the HOW TO PLAY
   * section titles and the REPORT A PROBLEM input + report
   * box. No fixed heights anywhere -- both screens scroll,
   * so nothing can clip on a small phone screen. The input
   * carries only a minHeight floor so the box starts big
   * enough to type in; it may grow, never clip. */
  helpSectionTitle: {
    color: GOLD,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 6,
  },
  reportInput: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    minHeight: 110,
    textAlignVertical: 'top',
  },
  reportText: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 10,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 23,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
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
  /* REALISTIC_LOOK_VIS2_E17_FURNITURE_CARD_STYLE: the bordered
   * card the FURNITURE SHOP rows add on top of the shared row
   * style (E18) -- the same dark panel family as the progress
   * panel behind them. The shared row style itself is untouched,
   * so the coin shop, the My Home tray and the garage lists keep
   * their shipped look; only the furniture listings gain the
   * card. */
  vis2FurnitureCard: {
    backgroundColor: 'rgba(8, 12, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 66, 0.65)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
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
  homeSpotName: { /* BIG_PACKAGE_BIG1_E07_SPOT_NAME: fontSize 9 -> 11 below -- the DECORATE spot labels over the room grid. Position/geometry keys untouched. */
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
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
  homePieceChip: { /* BIG_PACKAGE_BIG1_E08_PIECE_CHIP: fontSize 9 -> 11 below -- the placed pieces' name chips in the room. */
    marginTop: 2,
    fontSize: 11,
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
  /* CITY_NAVIGATION_V1_E19_TRAYROW: roomier tray rows for
   * the bigger name type and the action chip. */
  homeTrayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
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
  homeSlotTag: { /* BIG_PACKAGE_BIG1_E09_SLOT_TAG: fontSize 10 -> 12 below -- the wall-slot placeholder tag in the room. */
    color: '#e8b93c',
    fontSize: 12,
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
  /* HOME_INTERIOR_HOME1_E17_STYLES: the HOME1 additions,
   * all new keys (no shipped style is modified). The
   * four floor-piece sizes ride their sprites' own
   * aspects: sofa 92x34 for 512x188 (2.72), coffee
   * table 64x39 for 512x310 (1.65), lamp 16x56 for
   * 147x512 (0.29), bookshelf 40x57 for 358x512
   * (0.70) -- each within a floor spot's ~74-unit row
   * beside its name chip, against the shipped drawn
   * sizes (sofa 78 wide, table 58x24, lamp 26x42,
   * bookshelf a 34pt glyph). The two wall images fill
   * their shipped frames (window 118x104, artwork
   * 66x84), seated inside the frame borders. The two
   * label backings are the DX2 panel color at full
   * strength for small text. */
  /* ROOM_SCALE_HOME2_E02_SIZES: the four floor pieces
   * grow to room scale (Zabby: they rendered tiny).
   * Derived from the room's geometry (README has the
   * full audit): spot rows are 74 tall, a piece is
   * bottom-anchored in its cell, and the name chip
   * (marginTop 2 + ~16) used to stack UNDER the art,
   * so the stack was art + 18. The -18 bottom margin
   * on each image pulls the chip up as a caption over
   * the art's bottom edge -- the stack is now the art
   * height alone, and the clear gap between a piece's
   * art top and the chip of any piece above it is
   * 74 - artHeight: sofa 19, table 13, lamp 4,
   * bookshelf 4 (the two tall pieces are capped at
   * 70 tall so the gap never closes). Widths ride
   * the sprites' aspects (sofa 512x188, table
   * 512x310, lamp 147x512, bookshelf 358x512) at the
   * brief's room-proportionate targets: sofa 150
   * wide, table 100 wide. Same style keys, same
   * render branches -- only the boxes grow. */
  home1ImgSofa: { width: 150, height: 55, marginBottom: -18 },
  home1ImgTable: { width: 100, height: 61, marginBottom: -18 },
  /* LAMP_NAV_HOME2F_E03_LAMP_WIDE: the lamp box widens
   * 21 -> 30. Height stays 70, so HOME2's vertical
   * clearance is untouched (the gap above the lamp is
   * still 74 - 70 = 4) and the -18 name-chip caption is
   * unchanged. The lamp footprint stays chip-bound --
   * the name chip is ~73 wide against the art's 30 --
   * so no neighbour pairing or edge clearance HOME2
   * pinned can move. The width only paints because the
   * lamp's render branch changes fit in E04; the README
   * shows the contain math. */
  home1ImgLamp: { width: 30, height: 70, marginBottom: -18 },
  home1ImgBookshelf: { width: 49, height: 70, marginBottom: -18 },
  home1CurtainsImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  home1WallArtImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  /* ROOM_SCALE_HOME2_E03_SPOT_LABEL_Z: with the E02 sizes, a tall piece's art top (70 of its 74-unit row, bottom-anchored) reaches the band of its own cell's DECORATE spot label, which renders BEFORE the piece in the cell -- the label gains zIndex/elevation so it (and its solid HOME1 backing) paints above the art and stays readable. No word, position or size changes. */
  home1SpotLabel: { backgroundColor: 'rgba(12,16,26,0.88)', borderRadius: 6, paddingVertical: 1, overflow: 'hidden', zIndex: 4, elevation: 4 },
  home1SlotTag: { backgroundColor: 'rgba(12,16,26,0.88)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
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
  citySidewalk: { position: 'absolute', backgroundColor: '#79828c', borderRadius: 10 }, /* VISUAL_V1_E13A_SIDEWALK: a lighter warm-gray lift so the sidewalks read against the night roads. */
  cityRoad: { position: 'absolute', backgroundColor: '#39424d' },
  cityDashV: { position: 'absolute', width: 6, height: 56, backgroundColor: 'rgba(244, 197, 66, 0.5)', borderRadius: 3 },
  cityDashH: { position: 'absolute', width: 56, height: 6, backgroundColor: 'rgba(244, 197, 66, 0.5)', borderRadius: 3 },
  vis3CurbV: { position: 'absolute', width: 3, backgroundColor: 'rgba(226, 232, 238, 0.6)' }, /* CITY_POLISH_VIS3_E06_CURB_STYLES: the curb lines -- a light concrete edge, 3 units wide, in the ground palette; one vertical and one horizontal form. Color and width are the whole treatment; the geometry comes from E04. */
  vis3CurbH: { position: 'absolute', height: 3, backgroundColor: 'rgba(226, 232, 238, 0.6)' },
  vis4SeamH: { position: 'absolute', width: 23, height: 2, backgroundColor: '#6b747e' }, /* FULLER_CITY_VIS4_E08_STYLES: the VIS4 style additions -- the sidewalk seams (a step darker than the sidewalk's #79828c, one horizontal and one vertical form; the band span is in the style, the position inline), the walkway paving (a light warm concrete, 36 wide, height inline), the flower beds (dark soil with 7-unit flower dots whose colours ride inline from the E02 palette), the skyline (bare absolute positioning; shade and geometry inline), the lamp pool (a soft warm ellipse, 120 by 54) and the parked-car wrap (30 wide, matching CarFigure). */
  vis4SeamV: { position: 'absolute', width: 2, height: 23, backgroundColor: '#6b747e' },
  vis4Walkway: { position: 'absolute', width: 36, backgroundColor: '#a39e93', borderRadius: 4 },
  vis4BedSoil: { position: 'absolute', backgroundColor: '#3a2a1c', borderRadius: 6 },
  vis4FlowerDot: { position: 'absolute', width: 7, height: 7, borderRadius: 4 },
  vis4Skyline: { position: 'absolute' },
  vis4LampPool: { position: 'absolute', width: 120, height: 54, borderRadius: 27, backgroundColor: 'rgba(255, 190, 92, 0.32)' },
  vis4ParkedCar: { position: 'absolute', width: 30 },
  vis5ParkStall: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(255,255,255,0.40)', borderRadius: 6 }, /* READABILITY_VIS5_E08_STALL_STYLE: the painted parking-stall outline -- a thin pale border on the road, no fill, so the VIS4 parked cars sit in marked stalls. Decoration only. */
  cityCrossH: { position: 'absolute', width: 120, height: 12, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 },
  cityCrossV: { position: 'absolute', width: 12, height: 120, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 3 },
  cityParkLawn: { position: 'absolute', backgroundColor: '#2f5d2a', borderRadius: 18, borderWidth: 2, borderColor: '#3f7a37', alignItems: 'center', justifyContent: 'center' },
  cityParkArt: { width: '92%', height: '92%' },
  cityHouse: { position: 'absolute', backgroundColor: '#5d4a33', borderRadius: 10, borderWidth: 2, borderColor: '#3d2f1e' },
  cityHouseRoof: { height: '26%', backgroundColor: '#8a3b2e', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  cityHouseDoor: { position: 'absolute', bottom: 0, left: '42%', width: '16%', height: '34%', backgroundColor: '#2b1d12', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  cityBuildingTouch: { position: 'absolute', alignItems: 'center' },
  vis5SignSlot: { position: 'absolute', alignItems: 'center' }, /* READABILITY_VIS5_E09_SIGNSLOT_STYLE: the lifted sign layer's per-place slot (E03) -- the same layout role cityBuildingTouch plays for the building itself (absolute, alignItems center), so a pill centred in its slot lands where the touchable's flow centred it. */
  cityPad: { position: 'absolute', left: -12, top: -12, right: -12, bottom: -12, backgroundColor: 'rgba(214, 200, 160, 0.18)', borderRadius: 14, borderWidth: 2, borderColor: 'rgba(214, 200, 160, 0.38)' }, /* VISUAL_V1_E13B_PAD_FRAME: the shipped plot pad becomes a framed sidewalk plot. */
  cityBuildingArt: { width: '100%', height: '76%' },
  cityStorefront: { width: '100%', height: '76%', borderRadius: 10, borderWidth: 2, borderColor: '#10151d' },
  cityStoreRoof: { height: '22%', backgroundColor: GOLD, borderTopLeftRadius: 8, borderTopRightRadius: 8, opacity: 0.85 },
  cityStoreDoor: { position: 'absolute', bottom: 0, left: '40%', width: '20%', height: '40%', backgroundColor: '#10151d', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  citySign: { backgroundColor: 'rgba(10, 14, 22, 1)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, alignItems: 'center', marginTop: 4 }, /* CITY_POLISH_VIS3_E07_SIGN_SOLID: VIS3 sign pass -- the one shared sign backing goes fully solid (was rgba(10, 14, 22, 0.85)) so every place name sits on the identical dark pill whatever glows behind it; padding, radius, gold border and marginTop unchanged, and the CITY2 owned treatment layered over this style (city2SignOwned) is untouched. The sign audit (the VIS3 README) measured the pre-VIS3 translucent pill at 14.9 to 16.2 white-text contrast on every building with zero sprite coverage of the sign band, so no sign offset moves. */ /* REALISTIC_LOOK_VIS2_E11_SIGN: the rendered building-name pill takes the solid dark backing with more padding (was rgba(7, 13, 22, 0.88), padding 3/10) so names read over the detailed realistic art. The pill already rendered above the art -- it follows the Image inside each building touchable -- so the backing and padding are the whole change. */
  citySignText: { color: '#ffffff', fontWeight: '900', fontSize: 20, letterSpacing: 1 }, /* CITY_POLISH_VIS3_E08_SIGN_TEXT: VIS3 sign pass -- the one shared sign name size 18 to 20, so every place name (all places share this style, the PARK pill included) reads at the same clearly readable size; weight, color and letter spacing unchanged. */ /* REALISTIC_LOOK_VIS2_E12_SIGN_TEXT: building-name size 17 -> 18 for the new art. */
  cityOwnedTag: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  /* CITY_EXPANSION_CITY2_E11_STYLES: the CITY2 additions --
   * the owned sign treatment (a heavier gold border on a
   * warm dark-gold backing, layered over citySign), the
   * ground layer's trees and bushes (the park palette:
   * deep green canopy, lighter highlight, soft shadow),
   * and the mission destination chip (the guide chip's
   * black-and-gold language, sized to sit above the pin). */
  city2SignOwned: { borderWidth: 2, borderColor: GOLD, backgroundColor: 'rgba(52, 38, 4, 0.92)' },
  city2TreeWrap: { position: 'absolute', width: 52, height: 60 },
  city2TreeShadow: { position: 'absolute', left: 6, bottom: 0, width: 40, height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.30)' },
  city2TreeTrunk: { position: 'absolute', left: 23, bottom: 4, width: 6, height: 16, borderRadius: 3, backgroundColor: '#4a3421' },
  city2TreeCanopy: { position: 'absolute', left: 3, top: 0, width: 46, height: 46, borderRadius: 23, backgroundColor: '#2e5d27', borderWidth: 2, borderColor: '#3f7a37' },
  city2TreeCanopyHi: { position: 'absolute', left: 12, top: 7, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(120, 190, 90, 0.35)' },
  city2Bush: { position: 'absolute', width: 30, height: 20, borderRadius: 10, backgroundColor: '#2f6b2c', borderWidth: 2, borderColor: '#3f7a37' },
  city2MissionChip: { position: 'absolute', width: 240, alignItems: 'center', backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 5, paddingHorizontal: 8 },
  city2MissionChipText: { color: '#ffffff', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  /* VISUAL_CONSISTENCY_CITY3_E23_STYLES: the CITY3 style
   * additions -- the customer-house Image box (position
   * only; each house's box is inline per house, E04), the
   * player ground disc (E06) and the on-foot ring (E07:
   * cityRideRing's geometry exactly, plus a gold border,
   * a dark backing and the E08 scale), and the
   * work-vehicle badge + glyph (E09). cityRideRingOff
   * stays defined for the record; E07's JSX no longer
   * references it. */
  city3CustHouse: { position: 'absolute' },
  city3PlayerDisc: { position: 'absolute', left: -6, top: 54, width: 52, height: 16, borderRadius: 8, backgroundColor: 'rgba(232, 185, 60, 0.30)', borderWidth: 2, borderColor: GOLD },
  city3PlayerRing: { borderWidth: 3, borderColor: GOLD, borderRadius: 24, padding: 2, alignItems: 'center', backgroundColor: 'rgba(7, 13, 22, 0.45)', transform: [{ scale: 1.15 }] },
  city3VehicleBadge: { marginTop: 2, backgroundColor: 'rgba(7, 13, 22, 0.88)', borderWidth: 2, borderColor: GOLD, borderRadius: 12, paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center' },
  city3VehicleGlyph: { fontSize: 27 },
  cityNotOwnedTag: { color: '#8fa3bd', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cityGuideRing: { position: 'absolute', left: -8, top: -8, right: -8, bottom: -8, borderWidth: 4, borderColor: GOLD, borderRadius: 14 },
  /* CITY_NAVIGATION_V1_E18_STYLES: the route dots, the
   * entrance doorsteps, the tray action chips and the build
   * label. Same black-and-gold language as the city layer. */
  cityRouteDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD, borderWidth: 1, borderColor: '#10151d', opacity: 0.95 },
  cityEntranceMark: { position: 'absolute', width: 46, alignItems: 'center' },
  cityEntranceGlyph: { fontSize: 15 },
  cityEntranceStep: { width: 46, height: 14, borderRadius: 7, borderWidth: 2, borderColor: GOLD, backgroundColor: 'rgba(7, 13, 22, 0.55)', marginTop: 1 },
  homeTrayName: { fontSize: 19, fontWeight: '800' }, /* BIG_PACKAGE_BIG1_E05_TRAY_NAME: 17 -> 19 -- BIG1 My Home readability; a cluster style used only by the My Home tray rows. */
  homeTrayChip: { alignSelf: 'flex-start', marginTop: 6, borderWidth: 1, borderColor: GOLD, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10, backgroundColor: 'rgba(245, 197, 66, 0.12)' },
  homeTrayChipText: { color: GOLD, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }, /* BIG_PACKAGE_BIG1_E06_TRAY_CHIP: 13 -> 15 -- the tray action chips (SELECT TO PLACE / SELECTED / shop state). */
  buildLabel: { color: '#8fa3bf', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 5 },
  /* BIG_PACKAGE_BIG1_E10_HOME_CTRL_STYLES: cluster-only overrides for the My Home placement controls whose base styles (primary/secondary and their texts) are shared by every screen in the app and are deliberately NOT edited. Layered over the shared styles at the DONE and PUT AWAY buttons (B11/B12) through the style-array pattern this screen already uses for the coin line and the tray names. fontSize/minHeight keys only: DONE's text 15 -> 17 and its control ~52 -> minHeight 58; PUT AWAY's text (inherits the 14 default) -> 16 and its control ~50 -> minHeight 56. */
  big1HomeBtnText: { fontSize: 17 },
  big1HomeDoneBtn: { minHeight: 58 },
  big1HomeAwayBtn: { minHeight: 56 },
  big1HomeAwayText: { fontSize: 16 },
  /* SKY_CITY_TRAVEL_V1_H_STYLES: the compact city header
   * pieces (H) -- ADDITIONAL styles, picked only when
   * freeRoam. The shared header / progressTrack / xpToNext
   * / cityWelcome / cityViewport styles are NOT edited, so
   * the pre-free-roam menu and every other screen render
   * exactly as before. No size here goes below the 11pt
   * build label. The viewport override spends the
   * reclaimed chrome height on the map itself: 520 -> 640.
   * The camera reads the measured viewport through
   * onLayout, so no camera constant changes. */
  trv1LogoOneLine: { color: GOLD, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  trv1XpRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trv1XpTrackFlex: { flex: 1 },
  trv1XpText: { color: GOLD, fontSize: 12, fontWeight: '800' },
  trv1WelcomeLine: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
  trv1CityViewportTall: { height: 640 },
  /* CITY_TRAVEL_GARAGE_V1_E09_STYLES: the RIDE/WALK toggle
   * (G03) and the narrow ENTER variant (G04) -- ADDITIONAL
   * styles only; nothing shipped is edited. Segments are
   * minHeight 47, matching the shipped gold buttons they
   * replace, so the toggle is at least as tappable as
   * RIDE / PARK BIKE were. The toggle row is one ~53px
   * row where chip + button + gap took ~85px, so the
   * control column gets shorter, never taller. */
  cityModeToggle: { flexDirection: 'row', alignSelf: 'stretch', minWidth: 240, backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: GOLD, borderRadius: 12, padding: 3, gap: 3 },
  cityModeSeg: { flex: 1, minHeight: 47, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  cityModeSegOn: { backgroundColor: GOLD },
  cityModeSegText: { color: GOLD, fontSize: 15, fontWeight: '900' }, /* VISUAL_CONSISTENCY_CITY3_E11_SEG_TEXT_STYLE: letterSpacing 0.5 REMOVED, same audit as E10 -- the WALK / bike segments are the bar's other small bold labels. The WALK segment gains the single-line props its bike sibling already ships, in E17. */
  cityModeSegTextOn: { color: '#10151d' },
  cityEnterBtnNarrow: { paddingHorizontal: 24 },
  cityEnterTextNarrow: { fontSize: 20 },
  cityTargetMark: { position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: GOLD, backgroundColor: 'rgba(244, 197, 66, 0.25)' },
  cityPlayerMark: { position: 'absolute', width: 40, alignItems: 'center' },
  cityRideRing: { borderWidth: 3, borderRadius: 24, padding: 2, alignItems: 'center', transform: [{ scale: 1.15 }] }, /* VISUAL_CONSISTENCY_CITY3_E08_RING_SCALE: the marker's modest size increase -- a 1.15 visual scale on the ring (the figure inside grows with it, ~30 -> ~35 units wide). transform never affects layout in React Native, so the marker's position math is untouched. city3PlayerRing (E23) carries the same scale, so both branches render at the same size. */
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
  /* REALISTIC_LOOK_VIS2_E10_BAR_STYLES: the bottom control bar
   * (E05-E09) takes the place of the removed pad styles and the
   * old right-side controls column style, which stood here. The
   * bar is a full-width strip pinned to the map's bottom edge;
   * its chips carry the dark semi-transparent backing so they
   * read over the detailed art without covering it the way the
   * stacked column did. The toggle override only centers the
   * shipped segmented control on the bar's cross axis. */
  vis2CityBarWrap: { backgroundColor: 'rgba(7, 13, 22, 0.72)', borderTopWidth: 1, borderTopColor: GOLD }, /* CITY_BAR_FIX_VIS2C_E04_BAR_WRAP_STYLE: the bar is a normal-flow strip below the map viewport now (E03) -- the VIS2 absolute pin (position/left/right/bottom/zIndex from REALISTIC_LOOK_VIS2_E10_BAR_STYLES) is gone, so its layout no longer depends on overlay measurement at all; the dark fill and gold top border keep the bar's shipped identity. */
  vis2CityBarRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 10, paddingVertical: 10 } /* READABILITY_VIS5_E21_SPACING_ROW: the below-map row breathes -- gap 8 -> 12 and vertical padding 8 -> 10 (VIS2C flow layout unchanged: a plain wrapping row, no overlay, no ScrollView). */, /* CITY_BAR_FIX_VIS2C_E05_BAR_ROW_STYLE: this was the contentContainerStyle of the bar's horizontal ScrollView; it is now a plain wrapping row -- every control is laid out by ordinary flow, visible in portrait and landscape, wrapping to a second row on narrow screens instead of scrolling or collapsing. */
  vis2CityChip: { backgroundColor: 'rgba(10, 14, 22, 0.82)', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, minHeight: 48, alignItems: 'center', justifyContent: 'center' } /* READABILITY_VIS5_E22_SPACING_CHIP: the bar chips gain air (padding 10/14 -> 12/16, minHeight 44 -> 48) with the row's wider gap (E21); the ENTER button's cityEnterBtn styles are NOT this style and keep their exact shipped size. */,
  vis2CityChipText: { color: GOLD, fontSize: 15, fontWeight: '900' }, /* VISUAL_CONSISTENCY_CITY3_E10_CHIP_TEXT_STYLE: letterSpacing 0.5 REMOVED -- the label audit in the CITY3 README: Android measures letter-spaced bold text inconsistently and can shave the trailing glyphs (a chip reading 'GO' for 'GO TO'). The words are unchanged, and the chips' own padding (14 units each side) already keeps text off the edges. The five chip Texts gain single-line shrink-to-fit in E12-E16. */
  vis2BarToggle: { alignSelf: 'center' },
  cityChip: { color: '#ffffff', backgroundColor: 'rgba(7, 13, 22, 0.85)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, fontSize: 15, fontWeight: '800', overflow: 'hidden' },
  cityGoldBtn: { backgroundColor: GOLD, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ffe9a8', borderBottomWidth: 3, borderBottomColor: '#a87f14', shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 3, elevation: 3 }, /* VISUAL_V1_E11B_CITYGOLD_BEVEL */
  cityGoldBtnText: { color: '#10151d', fontSize: 17, fontWeight: '900' }, /* VISUAL_CONSISTENCY_CITY3_E18_GOLD_TEXT_STYLE: letterSpacing 1 REMOVED, same audit as E10 -- the widest tracking in the game sat on the GO TO CUSTOMER / GO TO FOOD STAND button, the exact label class Zabby saw clipped. The button's padding (20 units each side) already keeps text off the edges; the Text gains shrink-to-fit in E19. The DONE button shares this style and gains the same safety. Words unchanged. */
  cityDarkBtn: { backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: GOLD, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  cityDarkBtnText: { color: GOLD, fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  cityEnterWrap: { position: 'absolute', left: 0, right: 0, bottom: 16, alignItems: 'center' }, /* CITY_BAR_FIX_VIS2C_E06_ENTER_WRAP: back to the pre-VIS2 shipped offset -- REALISTIC_LOOK_VIS2_E14_ENTER_WRAP raised this from bottom 16 to 80 only to clear the overlay bar; the bar is in flow below the viewport now (E03), so the ENTER slot returns to 16. */
  /* CITY_NAVIGATION_V1_E17_ENTER_STYLE: a bigger ENTER --
   * more padding, larger type (it was already the largest
   * map button; Zabby's tablet test asked for larger still). */
  cityEnterBtn: { backgroundColor: GOLD, borderRadius: 14, paddingVertical: 19, paddingHorizontal: 44, borderWidth: 2, borderColor: '#10151d', borderTopColor: '#ffe9a8', borderBottomColor: '#a87f14', borderBottomWidth: 4, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 3, elevation: 3 }, /* VISUAL_V1_E11C_ENTER_BEVEL */
  cityEnterText: { color: '#10151d', fontSize: 23, fontWeight: '900' }, /* VISUAL_CONSISTENCY_CITY3_E20_ENTER_TEXT_STYLE: letterSpacing 1 REMOVED, same audit as E10 -- ENTER {building} is the game's largest bold label and its tracking was the joint-widest. The button's padding (44 units, 24 in the narrow variant) already keeps text off the edges; both ENTER-slot Texts gain shrink-to-fit in E21/E22. Words unchanged. */
  cityNote: { backgroundColor: 'rgba(7, 13, 22, 0.9)', borderWidth: 1, borderColor: '#8fa3bd', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
  cityNoteText: { color: '#dbe4ee', fontSize: 16, fontWeight: '800' },
  cityFindPanel: { position: 'absolute', left: 16, right: 16, top: 100, backgroundColor: 'rgba(7, 13, 22, 0.96)', borderWidth: 2, borderColor: GOLD, borderRadius: 16, padding: 16, alignItems: 'center', zIndex: 30 },
  cityFindTitle: { color: GOLD, fontSize: 20, fontWeight: '900', letterSpacing: 1, marginBottom: 12 },
  cityFindGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 },
  big1FindScroll: { alignSelf: 'stretch', maxHeight: 400 }, /* BIG_PACKAGE_BIG1_E04_FIND_SCROLL_STYLE: stretch keeps the scroll region at the panel's full content width (the panel centers its children; the 47%-wide rows measured against that width before and still do), and maxHeight 400 is the scroll bound -- panel chrome (padding 32 + title ~36 + grid margin 14 + CLOSE ~44) plus 400 of rows totals ~526px from the panel's top:100 offset, inside the 640px city viewport with room to spare, where the unwrapped ~620px panel overflowed it. */
  cityFindChip: { backgroundColor: '#16283f', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  cityFindChipText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  /* NAVIGATION_EASE_V1_E15_STYLES: the GO TO panel's big destination buttons (minHeight 60, name 19pt, status line beneath) and the doorstep note's wrap (above the ENTER slot, clear of the D-pad and the control column). */
  nav2GoToBtn: { width: '47%', minHeight: 60, backgroundColor: '#16283f', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center' },
  /* EXPANSION_DEL1_S_STYLES: the STOP WALK button (above
   * the ENTER slot, the CANCEL MISSION red language but
   * bigger -- it must read at arm's length on the tablet)
   * and the in-world mission spot marker. */
  del1StopWalkWrap: { position: 'absolute', left: 0, right: 0, bottom: 100, alignItems: 'center', zIndex: 26 }, /* CITY_BAR_FIX_VIS2C_E07_STOP_WRAP: back to the pre-VIS2 shipped offset -- REALISTIC_LOOK_VIS2_E15_STOP_WRAP raised this from bottom 100 to 158 only to stack above the raised ENTER slot; with the ENTER slot back at 16 (E06) the STOP button returns to 100, clear of it exactly as shipped. */
  del1StopWalkBtn: { backgroundColor: 'rgba(7, 13, 22, 0.94)', borderWidth: 2, borderColor: '#e0655f', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  del1StopWalkText: { color: '#ff9d97', fontSize: 19, fontWeight: '900', letterSpacing: 1 },
  del1MissionMark: { position: 'absolute', width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: GOLD, backgroundColor: 'rgba(7, 13, 22, 0.88)', alignItems: 'center', justifyContent: 'center' },
  del1MissionMarkText: { fontSize: 16 },
  nav2GoToName: { color: '#ffffff', fontSize: 19, fontWeight: '900' },
  nav2GoToStatus: { color: '#ffd23f', fontSize: 14, fontWeight: '700', marginTop: 2 },
  /* SKY_CITY_TRAVEL_V1_T_STYLES: the travel prompt's
   * buttons -- full panel width at GO TO height (minHeight
   * 60) and text size (19pt), so the walk / ride choice is
   * as tappable as the GO TO destinations themselves. The
   * walk choice wears the gold primary fill; the ride
   * choice the dark panel fill with a gold edge; the off
   * variant dims a disabled choice. */
  trv1PromptBtn: { width: '100%', minHeight: 60, backgroundColor: GOLD, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  trv1PromptBtnText: { color: '#101c2e', fontSize: 19, fontWeight: '900' },
  trv1PromptBtnRide: { backgroundColor: '#16283f', borderWidth: 1, borderColor: GOLD },
  trv1PromptBtnRideText: { color: '#ffffff', fontSize: 19, fontWeight: '900' },
  trv1PromptBtnOff: { opacity: 0.45 },
  trv1PromptClose: { marginTop: 14 },
  nav2ArrivalNoteWrap: { position: 'absolute', left: 0, right: 0, bottom: 100, alignItems: 'center', zIndex: 25 }, /* CITY_BAR_FIX_VIS2C_E08_ARRIVAL_WRAP: back to the pre-VIS2 shipped offset -- REALISTIC_LOOK_VIS2_E16_ARRIVAL_WRAP raised this from bottom 100 to 158 together with the STOP wrap; the two return to their shipped co-location at 100 (the STOP wrap's zIndex 26 above this wrap's 25, as shipped). */
  /* CITY_JOBS_V1_E22_STYLES: the mission layer -- objective
   * banner (below the guide chip, clear of the HUD and the
   * minimap), the completion summary panel, the driven-bus
   * marker badge and the gold minimap ring. Same black-and-gold
   * language, text at HUD size or larger. */
  /* READABILITY_CITY4_E02_BANNER_STYLES: the mission
   * banner tightened, styles only -- paddingVertical
   * 10 -> 6, title 17 -> 15 (its letterSpacing removed:
   * the CITY3 clip class -- the banner title and the
   * cancel text were the two bold labels that audit
   * did not reach), objective text 16 -> 15 with its
   * marginTop 2 -> 1, notice 15 -> 14 with marginTop
   * 4 -> 2, cancel marginTop 8 -> 5 and paddingVertical
   * 8 -> 6. The stack measures ~28 units shorter, so
   * more of the map -- and the destination -- stays
   * visible under it. Colors, words, top offset (102,
   * below the guide chip) and z-order unchanged. */
  cityBanner: { position: 'absolute', top: 102, left: 16, right: 16, backgroundColor: 'rgba(7, 13, 22, 0.94)', borderWidth: 2, borderColor: GOLD, borderRadius: 14, paddingVertical: 6, paddingHorizontal: 14, alignItems: 'center', zIndex: 20 },
  cityBannerTitle: { color: GOLD, fontSize: 15, fontWeight: '900', textAlign: 'center' },
  cityBannerText: { color: '#ffffff', fontSize: 15, fontWeight: '800', textAlign: 'center', marginTop: 1 },
  cityBannerNotice: { color: '#ffd23f', fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  cityBannerCancel: { marginTop: 5, borderWidth: 1, borderColor: '#e0655f', borderRadius: 10, paddingVertical: 6, paddingHorizontal: 16 },
  cityBannerCancelText: { color: '#ff9d97', fontSize: 15, fontWeight: '900' },
  /* READABILITY_CITY4_E04_BANNER_BTN_STYLE: the one
   * CITY4 style -- a padding-only override layered on
   * the shared cityGoldBtn inside the mission banner
   * (E03). It carries no color, border or text of its
   * own; the button it slims stays the shipped gold
   * button, 8 units shorter in the banner stack. */
  city4BannerGoldBtn: { paddingVertical: 8 },
  citySummaryPanel: { position: 'absolute', left: 24, right: 24, top: 150, backgroundColor: 'rgba(7, 13, 22, 0.97)', borderWidth: 2, borderColor: GOLD, borderRadius: 16, padding: 18, alignItems: 'center', zIndex: 40 },
  citySummaryLine: { color: '#ffffff', fontSize: 17, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  cityBusMark: { position: 'absolute', width: 46, alignItems: 'center', backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 2, borderColor: GOLD, borderRadius: 12, paddingVertical: 3 },
  cityBusEmoji: { fontSize: 24 },
  cityMinimapRingGold: { borderColor: GOLD },
  /* PLAYABLE_TRANSIT_V1_E10_STYLES: depot room pieces (the
   * room shell itself reuses bizRoom/bizRoomWall/bizRoomFloor/
   * bizBoard/bizGoldBanner), the world stop rings + signs, the
   * bus marker, and the drive HUD. Tablet sizes: steering and
   * pedal buttons are 72 tall, DOORS is 68 tall, control text
   * is 20 -- all above the 64px / 18px floor. */
  busBay: { width: 132, backgroundColor: '#37404c', borderRadius: 6, padding: 10, alignItems: 'center' },
  busBaySign: { fontSize: 12, fontWeight: '800', color: GOLD, letterSpacing: 1, textAlign: 'center' },
  busBayEmoji: { fontSize: 54, textAlign: 'center', marginVertical: 6 },
  busStopRing: { position: 'absolute', width: BUS_STOP_RADIUS * 2, height: BUS_STOP_RADIUS * 2, borderRadius: BUS_STOP_RADIUS, borderWidth: 3 },
  busStopRingCurrent: { borderColor: GOLD, backgroundColor: 'rgba(245, 197, 66, 0.10)' },
  busStopRingDone: { borderColor: '#35d07f', backgroundColor: 'rgba(53, 208, 127, 0.06)' },
  busStopRingIdle: { borderColor: 'rgba(255, 255, 255, 0.45)', backgroundColor: 'transparent' },
  busStopSign: { position: 'absolute', width: 140, alignItems: 'center', backgroundColor: 'rgba(7, 13, 22, 0.88)', borderWidth: 1, borderColor: GOLD, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 6 },
  busStopSignText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
  busMarkWrap: { position: 'absolute', width: 60, alignItems: 'center' },
  busBody: { width: 56, height: 32, borderRadius: 8, backgroundColor: '#ffd23f', borderWidth: 2, borderColor: '#10151d', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  busWindshield: { position: 'absolute', right: 3, top: 4, bottom: 4, width: 7, borderRadius: 3, backgroundColor: '#bfe3ff' },
  busBodyEmoji: { fontSize: 19 },
  busObjectiveChip: { position: 'absolute', top: 54, left: 76, right: 76, backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12, alignItems: 'center', zIndex: 15 },
  busObjectiveText: { color: '#ffffff', fontSize: 17, fontWeight: '800', textAlign: 'center' },
  busObjectiveSub: { color: GOLD, fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  busPauseBtn: { position: 'absolute', right: 8, top: 108, backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 1, borderColor: GOLD, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, zIndex: 16 },
  busPauseText: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  busSteerWrap: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', gap: 10, zIndex: 18 },
  busSteerBtn: { width: 78, height: 72, borderRadius: 14, backgroundColor: 'rgba(7, 13, 22, 0.92)', borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center' },
  busPedalWrap: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', gap: 10, zIndex: 18 },
  busBrakeBtn: { width: 96, height: 72, borderRadius: 14, backgroundColor: 'rgba(120, 20, 20, 0.95)', borderWidth: 2, borderColor: '#ff7a6b', alignItems: 'center', justifyContent: 'center' },
  busGoBtn: { width: 96, height: 72, borderRadius: 14, backgroundColor: 'rgba(16, 96, 44, 0.95)', borderWidth: 2, borderColor: '#35d07f', alignItems: 'center', justifyContent: 'center' },
  busControlText: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  busDoorsWrap: { position: 'absolute', left: 0, right: 0, bottom: 96, alignItems: 'center', zIndex: 18 },
  busDoorsBtn: { minWidth: 300, height: 68, borderRadius: 16, backgroundColor: GOLD, borderWidth: 2, borderColor: '#10151d', borderTopColor: '#ffe9a8', borderBottomColor: '#a87f14', borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, shadowColor: '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 3, elevation: 3 }, /* VISUAL_V1_E11D_DOORS_BEVEL */
  busDoorsBtnOff: { minWidth: 300, height: 68, borderRadius: 16, backgroundColor: 'rgba(7, 13, 22, 0.75)', borderWidth: 2, borderColor: 'rgba(245, 197, 66, 0.4)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  busDoorsText: { color: '#10151d', fontSize: 20, fontWeight: '800' },
});
