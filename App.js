import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Animated,
  AccessibilityInfo,
} from 'react-native';

const GOLD = '#f4c542';
const BLUE = '#3ea6ff';
const GREEN = '#4cd97b';
const PURPLE = '#ad7bff';

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

const Stat = ({ label, value, accent, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.stat, { borderColor: accent }]}
  >
    <Text style={[styles.statLabel, { color: accent }]}>{label}</Text>

    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={styles.statValue}
    >
      {value}
    </Text>
  </TouchableOpacity>
);


const SKY_SAVE_KEY = "skys-limit-save-v1";
const SKY_INITIAL = {
  step: 0, cash: 2500, savings: 0,
  credit: 575, xp: 0, place: null, employment: 'none',
  training: 'incomplete', pendingWages: 0,
  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1
};

/* Warehouse Associate: first job. Duration + pay stay together so future jobs can reuse training. */
const WAREHOUSE_JOB = {
  title: 'Warehouse Associate',
  trainingHours: 8,
  trainingRate: 18,
  shiftHours: 8,
  shiftRate: 18,
  shiftXp: 40,
};
const warehouseTrainingPay = WAREHOUSE_JOB.trainingHours * WAREHOUSE_JOB.trainingRate;
const warehouseShiftPay = WAREHOUSE_JOB.shiftHours * WAREHOUSE_JOB.shiftRate;
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FRIDAY = 4;

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
          /* Payroll fields are optional: older saves start Monday with empty payroll. */
          if (!Number.isInteger(saved.day) || saved.day < 0)
            saved.day = 0;
          if (!Number.isFinite(saved.paycheck) || saved.paycheck < 0)
            saved.paycheck = 0;
          if (!Number.isInteger(saved.lastPayday))
            saved.lastPayday = -1;
          if (!Number.isInteger(saved.lastShiftDay))
            saved.lastShiftDay = -1;
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

  if (loadError) {
    return React.createElement(
      Text, { style: { padding: 30 } },
      "Could not load your save. Please refresh to retry."
    );
  }
  if (initialSave === null) {
    return React.createElement(
      Text, { style: { padding: 30 } }, "Loading your game..."
    );
  }
  return React.createElement(
    React.Fragment, null,
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

function Game({ initialSave, persistSave }) {

  const [step, setStep] = useState(initialSave.step);
  const [cash, setCash] = useState(initialSave.cash);
  const [savings, setSavings] = useState(initialSave.savings);
  const [credit, setCredit] = useState(initialSave.credit);
  const [xp, setXp] = useState(initialSave.xp);
  const [place, setPlace] = useState(initialSave.place);
  const [employment, setEmployment] = useState(initialSave.employment);
  const [employmentMessage, setEmploymentMessage] = useState("");
  const [training, setTraining] = useState(initialSave.training);
  const [pendingWages, setPendingWages] = useState(initialSave.pendingWages);
  const [trainingMessage, setTrainingMessage] = useState("");
  const trainingPaidRef = useRef(false);
  const [day, setDay] = useState(initialSave.day);
  const [paycheck, setPaycheck] = useState(initialSave.paycheck);
  const [lastPayday, setLastPayday] = useState(initialSave.lastPayday);
  const [lastShiftDay, setLastShiftDay] = useState(initialSave.lastShiftDay);
  const [paycheckMessage, setPaycheckMessage] = useState("");
  const collectPayRef = useRef(false);
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
    persistSave({ step, cash, savings, credit, xp, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay });
  }, [step, cash, savings, credit, xp, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, persistSave]);

  /*
   * Friday payroll cutover: on entering Friday, move wages accrued before
   * Friday into the available paycheck, added to any uncollected amount.
   * lastPayday makes it run exactly once per Friday, even across refreshes.
   */
  React.useEffect(() => {
    if (day % 7 !== FRIDAY || lastPayday === day) return;
    if (pendingWages > 0) {
      setPaycheck(paycheck + pendingWages);
      setPendingWages(0);
    }
    setLastPayday(day);
    collectPayRef.current = false;
  }, [day]);


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

    paidWorkShiftRef.current = true;

    setPendingWages((v) => v + warehouseShiftPay);
    setXp((v) => v + WAREHOUSE_JOB.shiftXp);
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

  /* Completion re-checks eligibility and awards exactly once via awardShift(). */
  const completeVisualShift = () => {
    if (scenePhase !== 'delivered') return;
    if (awardShift()) setScenePhase('complete');
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
    const place = resolveDest(dest);
    const { w, h } = mapSize;
    if (reduceMotion || w === 0) {
      setPlace(place);
      return;
    }
    const doorX = (dest === 'HOME' || dest === 'BANK' ? 0.19 : 0.81) * w;
    const doorY = (dest === 'HOME' || dest === 'WORK' ? 0.4 : 0.56) * h;
    const start = { x: 0.5 * w, y: 0.93 * h };
    const waypoints = [
      { x: 0.5 * w, y: 0.4725 * h },
      { x: doorX, y: 0.4725 * h },
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

  /* Application + hiring (prototype: guaranteed hire). No stat changes. */
  const applyForJob = () => {
    if (employment !== 'none') return;
    setEmployment('applied');
    setEmploymentMessage('Application submitted. Check your hiring result.');
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
    trainingPaidRef.current = true;
    setTraining('complete');
    setEmploymentMessage('');
    setPendingWages((v) => v + warehouseTrainingPay);
    setTrainingMessage('Training complete. You earned $' + warehouseTrainingPay + ', payable Friday.');
  };
  /* Rest at HOME advances the in-game calendar by one day and re-arms the daily shift. */
  const restDay = () => {
    paidWorkShiftRef.current = false;
    setDay((d) => d + 1);
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

  const restartGame = () => {
    paidWorkShiftRef.current = false;
    lastAdvancedStepRef.current = -1;

    setPlace(null);
    setStep(0);
    setCash(2500);
    setSavings(0);
    setCredit(575);
    setXp(0);
    setEmployment('none');
    setEmploymentMessage('');
    setTraining('incomplete');
    setPendingWages(0);
    setTrainingMessage('');
    trainingPaidRef.current = false;
    setDay(0);
    setPaycheck(0);
    setLastPayday(-1);
    setLastShiftDay(-1);
    setPaycheckMessage('');
    collectPayRef.current = false;
  };
 
  /*
   * EMPLOYMENT APPLICATION SCREEN - entry: the Work button on the city map.
   * Warehouse Associate is the first job. Shifts stay locked until paid training ships.
   */
  if (place === 'EMPLOYMENT') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Warehouse Associate</Text>
          {employment === 'none' && (<>
            <Text style={styles.body}>Apply to begin your career. Once hired, you must complete paid training before working.</Text>
            <TouchableOpacity style={styles.primary} onPress={applyForJob}><Text style={styles.primaryText}>APPLY FOR JOB</Text></TouchableOpacity>
          </>)}
          {employment === 'applied' && (<>
            <Text style={styles.body}>Your application is in. Check your hiring result below.</Text>
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
              <Text style={styles.body}>Training complete. Pending wages: ${pendingWages}, payable Friday.</Text>
            </>)}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('EMPLOYMENT'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>)}
          {employmentMessage !== '' && (<Text style={styles.body}>{employmentMessage}</Text>)}
          <TouchableOpacity style={styles.secondary} onPress={() => { setEmploymentMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO MAP</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
   * BENEFITS SCREEN - display only. Entry: VIEW BENEFITS on the Employment Center (hired).
   * Viewing changes nothing: no enrollment, no contributions, no money moves.
   */
  if (place === 'EMPLOYMENT_BENEFITS') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Your Benefits</Text>
          <Text style={styles.body}>Medical</Text>
          <Text style={styles.body}>Your employer pays 100% of your own medical insurance premium. Coverage options are available for your spouse and children; their premium costs are not yet specified.</Text>
          <Text style={styles.body}>Dental</Text>
          <Text style={styles.body}>Your employer pays 100% of your own dental insurance premium.</Text>
          <Text style={styles.body}>Vision</Text>
          <Text style={styles.body}>Your employer pays 100% of your own vision insurance premium.</Text>
          <Text style={styles.body}>401(k)</Text>
          <Text style={styles.body}>Your employer matches your contributions dollar for dollar, up to 5% of eligible pay. Example: on $1,000 of eligible pay, contribute $50 and your employer adds $50.</Text>
          <Text style={styles.body}>Benefits information only. Viewing this screen does not enroll you, set contributions, or deduct money.</Text>
          <TouchableOpacity style={styles.secondary} onPress={() => setPlace(benefitsFrom === 'WORK' ? 'WORK' : 'EMPLOYMENT')}><Text style={styles.secondaryText}>BACK</Text></TouchableOpacity>
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
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Warehouse Shift</Text>

          {!canWork && (
            <Text style={styles.body}>Paid training must be completed before you can work.</Text>
          )}

          {canWork && (!shiftDoneToday || scenePhase === 'complete') && (<>
            <Text style={styles.body}>
              Move the box to the marked drop zone, then complete your shift.
            </Text>

            <View
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
            </View>

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
                You earned ${warehouseShiftPay} in pending wages and {WAREHOUSE_JOB.shiftXp} XP.
              </Text>
              <Text style={styles.body}>Pending wages: ${pendingWages}.</Text>
              <Text style={styles.body}>
                {day % 7 === FRIDAY ? 'Paid next Friday.' : 'Payable Friday.'}
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
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>{WAREHOUSE_JOB.title} - Paid Training</Text>
          <Text style={styles.body}>Duration: {WAREHOUSE_JOB.trainingHours} in-game hours</Text>
          <Text style={styles.body}>Rate: ${WAREHOUSE_JOB.trainingRate}/hour</Text>
          <Text style={styles.body}>Training earnings: ${warehouseTrainingPay}, payable Friday</Text>
          <Text style={styles.body}>No fee</Text>
          {training === 'incomplete' && employment === 'hired' && (<>
            <TouchableOpacity style={styles.primary} onPress={completeTraining}><Text style={styles.primaryText}>COMPLETE TRAINING</Text></TouchableOpacity>
          </>)}
          {training === 'complete' && (<>
            <Text style={styles.body}>Training complete. Pending wages: ${pendingWages}, payable Friday.</Text>
          </>)}
          {trainingMessage !== '' && (<Text style={styles.body}>{trainingMessage}</Text>)}
          <Text style={styles.body}>${warehouseTrainingPay} earned toward Friday pay. Payment is pending; Friday payroll arrives in a later update.</Text>
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
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Warehouse Shift</Text>

          <Text style={styles.body}>Today is {DAY_NAMES[day % 7]}.</Text>

          {!canWork && (
            <Text style={styles.body}>Paid training must be completed before you can work.</Text>
          )}

          {canWork && (<>
            <Text style={styles.body}>
              Complete one {WAREHOUSE_JOB.shiftHours}-hour shift to earn ${warehouseShiftPay} in pending wages and {WAREHOUSE_JOB.shiftXp} XP. Wages pay out on Friday.
            </Text>

            <Text style={styles.body}>Pending wages: ${pendingWages}</Text>
            <Text style={styles.body}>Available paycheck: ${paycheck}</Text>

            {!shiftDoneToday ? (
              <TouchableOpacity
                style={styles.primary}
                onPress={() => { setScenePhase('ready'); setPlace('WORK_VISUAL'); }}
              >
                <Text style={styles.primaryText}>
                  WORK A SHIFT — EARN ${warehouseShiftPay} PENDING
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.body}>Shift completed for today. Next shift available tomorrow.</Text>
            )}

            {paycheck > 0 && (
              <TouchableOpacity
                style={styles.primary}
                onPress={collectPaycheck}
              >
                <Text style={styles.primaryText}>
                  COLLECT PAYCHECK — ${paycheck}
                </Text>
              </TouchableOpacity>
            )}

            {paycheckMessage !== '' && (
              <Text style={styles.body}>{paycheckMessage}</Text>
            )}
            <TouchableOpacity style={styles.secondary} onPress={() => { setBenefitsFrom('WORK'); setPlace('EMPLOYMENT_BENEFITS'); }}><Text style={styles.secondaryText}>VIEW BENEFITS</Text></TouchableOpacity>
          </>)}

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => { setPaycheckMessage(''); setPlace(null); }}
          >
            <Text style={styles.secondaryText}>BACK TO MAP</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
   * HOME SCREEN - resting advances the in-game calendar by one day.
   */
  if (place === 'HOME') {
    const tomorrow = DAY_NAMES[(day + 1) % 7];
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

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

  /*
   * HOME, BANK, AND STORE SCREENS
   */
if (place === 'BANK') {
    return (
        <SafeAreaView style={styles.safe}>
              <StatusBar barStyle="light-content" />

                    <ScrollView>
                            <Text style={styles.title}>BANK</Text>

                                    <Text style={styles.body}>Cash: ${cash}</Text>
                                            <Text style={styles.body}>Savings: ${savings}</Text>
                                                    <Text style={styles.body}>Credit: {credit}</Text>

                                                            <TouchableOpacity
                                                                      style={styles.secondary}
                                                                                onPress={() => {
                                                                                            const amount = Math.min(100, cash);
                                                                                                        setCash(v => v - amount);
                                                                                                                    setSavings(v => v + amount);
                                                                                                                                if (amount > 0) setCredit(v => Math.min(850, v + 1));
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
 if (place) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoSmall}>SKY'S</Text>
            <Text style={styles.logoBig}>THE LIMIT</Text>
          </View>

          <View style={styles.levelPill}>
            <Text style={styles.levelText}>
              LEVEL {1 + Math.floor(xp / 250)}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat
            label="CASH"
            value={`$${cash}`}
            accent={GREEN}
            onPress={() => alert(`Cash balance: $${cash}`)}
          />

          <Stat
            label="SAVINGS"
            value={`$${savings}`}
            accent={BLUE}
            onPress={() => alert(`Savings: $${savings}`)}
          />

          <Stat
            label="CREDIT"
            value={credit}
            accent={GOLD}
            onPress={() => alert(`Credit score: ${credit}`)}
          />

          <Stat
            label="XP"
            value={xp}
            accent={PURPLE}
            onPress={() => alert(`XP: ${xp}`)}
          />
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>

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
            </View>

            <Text style={styles.sectionTitle}>CITY MAP</Text>

            <View
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
              <View pointerEvents="none" style={[styles.cityDeco, { left: '38%', top: '12%' }]}>
                <View style={styles.treeTop} />
                <View style={styles.treeTrunk} />
              </View>
              <View pointerEvents="none" style={[styles.cityDeco, { left: '60%', top: '72%' }]}>
                <View style={styles.treeTop} />
                <View style={styles.treeTrunk} />
              </View>
              <View pointerEvents="none" style={[styles.cityLamp, { left: '56%', top: '24%' }]}>
                <View style={styles.lampGlow} />
                <View style={styles.lampPole} />
              </View>
              <View pointerEvents="none" style={[styles.cityLamp, { left: '28%', top: '62%' }]}>
                <View style={styles.lampGlow} />
                <View style={styles.lampPole} />
              </View>
              <View pointerEvents="none" style={[styles.cityBench, { left: '58%', top: '84%' }]}>
                <View style={styles.benchSeat} />
                <View style={styles.benchLegs}>
                  <View style={styles.benchLeg} />
                  <View style={styles.benchLeg} />
                </View>
              </View>
              <View pointerEvents="none" style={[styles.cityPath, { left: '48%', top: '4%', width: '4%', height: '92%' }]} />
              <View pointerEvents="none" style={[styles.cityPath, { left: '4%', top: '45%', width: '92%', height: '4.5%' }]} />
              <View pointerEvents="none" style={[styles.cityPlaza, { left: '40%', top: '88%' }]}>
                <Text style={styles.cityTag}>YOU ARE HERE</Text>
              </View>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '3%', top: '5%' }]}
                onPress={() => travelTo('HOME')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <View style={styles.houseRoof} />
                  <View style={styles.houseBody}>
                    <View style={styles.houseWin} />
                    <View style={styles.houseDoor} />
                    <View style={styles.houseWin} />
                  </View>
                </View>
                <Text style={styles.cityName}>HOME</Text>
                <Text style={styles.cityDesc}>Rest — advances the calendar one day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '65%', top: '5%' }]}
                onPress={() => travelTo('WORK')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <View style={styles.wareRoof} />
                  <View style={styles.wareBody}>
                    <View style={styles.wareDoor} />
                    <View style={styles.wareDoor} />
                    <View style={styles.wareBoxes}>
                      <View style={styles.wareBox} />
                      <View style={styles.wareBox} />
                    </View>
                  </View>
                </View>
                <Text style={styles.cityName}>WORK</Text>
                <Text style={styles.cityDesc}>
                  {employment === 'hired' && training === 'complete'
                    ? 'Work a shift — earn $144 pending'
                    : 'Apply at the Employment Center'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '3%', top: '53%' }]}
                onPress={() => travelTo('BANK')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <View style={styles.bankRoof} />
                  <View style={styles.bankSign}>
                    <Text style={styles.bankSignText}>BANK</Text>
                  </View>
                  <View style={styles.bankBody}>
                    <View style={styles.bankCol} />
                    <View style={styles.bankCol} />
                    <View style={styles.bankCol} />
                  </View>
                  <View style={styles.bankBase} />
                </View>
                <Text style={styles.cityName}>BANK</Text>
                <Text style={styles.cityDesc}>Save money and build credit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cityBuilding, { left: '65%', top: '53%' }]}
                onPress={() => travelTo('STORE')}
                disabled={!!mapTravel}
              >
                <View style={styles.buildingArt}>
                  <View style={styles.awning}>
                    <View style={[styles.awnStripe, { backgroundColor: '#c95656' }]} />
                    <View style={[styles.awnStripe, { backgroundColor: '#f2ede4' }]} />
                    <View style={[styles.awnStripe, { backgroundColor: '#c95656' }]} />
                    <View style={[styles.awnStripe, { backgroundColor: '#f2ede4' }]} />
                    <View style={[styles.awnStripe, { backgroundColor: '#c95656' }]} />
                    <View style={[styles.awnStripe, { backgroundColor: '#f2ede4' }]} />
                  </View>
                  <View style={styles.storeBody}>
                    <View style={styles.storeWin} />
                    <View style={styles.storeDoor} />
                  </View>
                </View>
                <Text style={styles.cityName}>STORE</Text>
                <Text style={styles.cityDesc}>Buy food and essentials</Text>
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
            </View>
            {mapTravel && (
              <TouchableOpacity style={styles.secondary} onPress={skipTravel}>
                <Text style={styles.secondaryText}>SKIP — GO INSIDE</Text>
              </TouchableOpacity>
            )}


            <TouchableOpacity
              style={styles.secondary}
              onPress={restartGame}
            >
              <Text style={styles.secondaryText}>
                RESTART ALPHA
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footer}>
          Sky's the Limit • Alpha 1.0
        </Text>
      </ScrollView>
    </SafeAreaView>
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

  logoSmall: {
    color: '#ffffff',
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

  stat: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: '900',
  },

  statValue: {
    color: '#ffffff',  
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },

  progressTrack: {
    height: 6,
    backgroundColor: '#17263a',
    borderRadius: 99,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
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

  secondary: {
    borderWidth: 1,
    borderColor: '#3e5878',
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
    aspectRatio: 16 / 10,
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

  cityBuilding: {
    position: 'absolute',
    width: '32%',
    alignItems: 'center',
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  cityEmoji: {
    fontSize: 40,
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
  },

  cityDesc: {
    color: '#8fa3bd',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },

  cityTag: {
    color: '#8fa3bd',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  cityActor: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'center',
  },

  cityWelcome: {
    backgroundColor: '#0d1a2a',
    borderWidth: 1,
    borderColor: '#243c5b',
    borderRadius: 18,
    padding: 16,
  },

  cityWelcomeTitle: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 24,
    marginBottom: 8,
  },

  buildingArt: {
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
});