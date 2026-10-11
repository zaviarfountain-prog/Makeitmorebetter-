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
    eyebrow: 'LIFE SIMULATOR',
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
  credit: 575, xp: 0, place: null
};

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

  React.useEffect(() => {
    persistSave({ step, cash, savings, credit, xp, place });
  }, [step, cash, savings, credit, xp, place, persistSave]);


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
     * Do nothing if this shift was already paid.
     */
    if (paidWorkShiftRef.current) {
      return;
    }

    paidWorkShiftRef.current = true;

    /*
     * Pay exactly once, award XP, and return to the map.
     */
    setCash((value) => value + 144);
    setXp((value) => value + 40);
    setPlace(null);
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
  };
 
  /*
   * WORK SHIFT SCREEN
   */
  if (place === 'WORK') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <ScrollView contentContainerStyle={styles.page}>
          <Text style={styles.eyebrow}>EMPLOYMENT CENTER</Text>
          <Text style={styles.title}>Warehouse Shift</Text>

          <Text style={styles.body}>
            Complete one 8-hour shift to earn $144 and 40 XP.
          </Text>

          <TouchableOpacity
            style={styles.primary}
            onPress={completeWorkShift}
          >
            <Text style={styles.primaryText}>
              WORK A SHIFT — EARN $144
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
                  Rest and manage your life
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.placeCard}
                onPress={startWorkShift}
              >
                <Text style={styles.placeIcon}>🏢</Text>
                <Text style={styles.placeName}>WORK</Text>
                <Text style={styles.placeDesc}>
                  Earn $144 and 40 XP per shift
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