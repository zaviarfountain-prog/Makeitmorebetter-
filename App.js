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

  const completeWorkShift = () => {
    /*
     * One shift per in-game day. Earnings go to pending wages for Friday
     * payroll; XP is awarded immediately, as before.
     */
    if (employment !== 'hired' || training !== 'complete') return;
    if (lastShiftDay === day || paidWorkShiftRef.current) return;

    paidWorkShiftRef.current = true;

    setPendingWages((v) => v + warehouseShiftPay);
    setXp((v) => v + WAREHOUSE_JOB.shiftXp);
    setLastShiftDay(day);
    setPlace(null);
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
          </>)}
          {employmentMessage !== '' && (<Text style={styles.body}>{employmentMessage}</Text>)}
          <TouchableOpacity style={styles.secondary} onPress={() => { setEmploymentMessage(''); setPlace(null); }}><Text style={styles.secondaryText}>BACK TO MAP</Text></TouchableOpacity>
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
                onPress={completeWorkShift}
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
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>FREE ROAM — ALPHA</Text>
              <Text style={styles.title}>The City Is Open</Text>

              <Text style={styles.body}>
                Choose where to go next. Visit WORK whenever you
                want to begin a new shift.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>CITY MAP</Text>

            <View style={styles.grid}>
              <TouchableOpacity
                style={styles.placeCard}
                onPress={() => setPlace('HOME')}
              >
                <Text style={styles.placeIcon}>🏠</Text>
                <Text style={styles.placeName}>HOME</Text>
                <Text style={styles.placeDesc}>
                  Rest — advances the calendar one day
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.placeCard}
                onPress={() => {
                  if (employment === 'hired' && training === 'complete') setPlace('WORK');
                  else setPlace('EMPLOYMENT');
                }}
              >
                <Text style={styles.placeIcon}>🏢</Text>
                <Text style={styles.placeName}>WORK</Text>
                <Text style={styles.placeDesc}>
                  {employment === 'hired' && training === 'complete'
                    ? 'Work a shift — earn $144 pending'
                    : 'Apply at the Employment Center'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.placeCard}
                onPress={() => setPlace('BANK')}
              >
                <Text style={styles.placeIcon}>🏦</Text>
                <Text style={styles.placeName}>BANK</Text>
                <Text style={styles.placeDesc}>
                  Save money and build credit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.placeCard}
                onPress={() => setPlace('STORE')}
              >
                <Text style={styles.placeIcon}>🏪</Text>
                <Text style={styles.placeName}>STORE</Text>
                <Text style={styles.placeDesc}>
                  Buy food and essentials
                </Text>
              </TouchableOpacity>
            </View>

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
});