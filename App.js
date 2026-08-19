import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const GOLD = '#f4c542';
const BLUE = '#3ea6ff';
const GREEN = '#4cd97b';
const RED = '#ff6262';
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
    body: 'You are starting fresh with $850 cash, a 575 credit score, and one goal: build a better life.',
    button: 'CHOOSE YOUR DREAM',
  },
  {
    key: 'dream',
    eyebrow: 'YOUR DREAM',
    title: 'Build a Life With Options',
    body: 'Get stable housing, reliable transportation, better work, savings, property, businesses, and eventually a legacy.',
    button: 'FIND HOUSING',
  },
  {
    key: 'housing',
    eyebrow: 'HOUSING & BILLS',
    title: 'Room Rental — East Oakland',
    body: 'Rent: $700/month. A practical first move that leaves room for food, transportation, savings, and credit building.',
    button: 'CHOOSE TRANSPORTATION',
  },
  {
    key: 'transport',
    eyebrow: 'TRANSPORTATION',
    title: 'Start Smart',
    body: 'Use affordable transportation now. Upgrade to a car after your income, savings, and credit score improve.',
    button: 'GO TO WORK',
  },
  {
    key: 'work',
    eyebrow: 'EMPLOYMENT CENTER',
    title: 'Warehouse Associate',
    body: '$18/hour • 40 hours/week. Work shifts earn cash and XP while you unlock training and higher-paying careers.',
    button: 'WORK A SHIFT',
  },
  {
    key: 'bill',
    eyebrow: 'LIFE EVENT',
    title: 'A Bill Is Due',
    body: 'Paying on time protects your credit and builds discipline. Missing it may cost fees, XP, and credit points.',
    button: 'PAY BILL',
  },
  {
    key: 'payday',
    eyebrow: 'PAYDAY',
    title: '+ $720',
    body: 'Your paycheck lands. Bills are covered. Now decide how much to save and how much to keep available.',
    button: 'SEE THE TEMPTATION',
  },
  {
    key: 'temptation',
    eyebrow: 'CHOICE',
    title: 'The $399 Temptation',
    body: 'A new gadget looks good, but buying it now slows your emergency fund. Your choices shape the future.',
    button: 'SKIP IT & SAVE',
  },
  {
    key: 'report',
    eyebrow: 'WEEK 1 REPORT',
    title: 'You Are Moving Forward',
    body: 'Bills paid on time • Savings growing • Credit protected • XP earned. Small wins compound.',
    button: 'ENTER FREE ROAM',
  },
];

const places = [
  ['🏦', 'Bank', 'Build credit, save, borrow wisely'],
  ['💼', 'Jobs', 'Work shifts and unlock careers'],
  ['🎓', 'Training', 'CDL, trades, healthcare, tech'],
  ['🏠', 'Real Estate', 'Rent, buy, and own property'],
  ['🚗', 'Dealership', 'Upgrade transportation'],
  ['🏢', 'Business', 'Start and grow companies'],
  ['📈', 'Investments', 'Build long-term wealth'],
  ['🎰', 'Casino Property', 'Future property expansion — locked'],
  ['🏆', 'Achievements', 'Earn XP and level up'],
];

function Stat({label, value, accent}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, {color: accent || '#fff'}]}>{value}</Text>
    </View>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [cash, setCash] = useState(850);
  const [savings, setSavings] = useState(0);
  const [credit, setCredit] = useState(575);
  const [xp, setXp] = useState(0);

  const freeRoam = step >= story.length;
  const current = story[Math.min(step, story.length - 1)];

  const progress = useMemo(() => Math.min(100, Math.round((step / story.length) * 100)), [step]);

  const advance = () => {
    const k = current?.key;
    if (k === 'work') { setCash(v => v + 144); setXp(v => v + 40); }
    if (k === 'bill') { setCash(v => Math.max(0, v - 120)); setCredit(v => v + 3); setXp(v => v + 25); }
    if (k === 'payday') { setCash(v => v + 720); setSavings(v => v + 200); setXp(v => v + 30); }
    if (k === 'temptation') { setSavings(v => v + 100); setXp(v => v + 20); }
    setStep(v => v + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoSmall}>SKY'S</Text>
            <Text style={styles.logoBig}>THE LIMIT</Text>
          </View>
          <View style={styles.levelPill}><Text style={styles.levelText}>LEVEL {1 + Math.floor(xp/250)}</Text></View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="CASH" value={`$${cash}`} accent={GREEN} />
          <Stat label="SAVINGS" value={`$${savings}`} accent={BLUE} />
          <Stat label="CREDIT" value={credit} accent={GOLD} />
          <Stat label="XP" value={xp} accent={PURPLE} />
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>

        {!freeRoam ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>{current.eyebrow}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.body}>{current.body}</Text>
            <TouchableOpacity style={styles.primary} onPress={advance}>
              <Text style={styles.primaryText}>{current.button}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.eyebrow}>FREE ROAM — ALPHA</Text>
              <Text style={styles.title}>The City Is Open</Text>
              <Text style={styles.body}>Choose where to go next. This playable alpha establishes the life-simulation loop and the systems we can keep expanding.</Text>
            </View>

            <Text style={styles.sectionTitle}>CITY MAP</Text>
            <View style={styles.grid}>
              {places.map(([icon, name, desc]) => (
                <TouchableOpacity key={name} style={styles.place} onPress={() => setXp(v => v + 5)}>
                  <Text style={styles.placeIcon}>{icon}</Text>
                  <Text style={styles.placeName}>{name}</Text>
                  <Text style={styles.placeDesc}>{desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.secondary} onPress={() => {
              setStep(0); setCash(850); setSavings(0); setCredit(575); setXp(0);
            }}>
              <Text style={styles.secondaryText}>RESTART ALPHA</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footer}>Sky's the Limit • Alpha 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07101c' },
  page: { padding: 18, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoSmall: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 4 },
  logoBig: { color: GOLD, fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  levelPill: { backgroundColor: '#13253d', borderWidth: 1, borderColor: '#2b4668', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  levelText: { color: BLUE, fontSize: 12, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: '#0d1a2a', borderWidth: 1, borderColor: '#1f3550', borderRadius: 14, padding: 10 },
  statLabel: { color: '#7f91a8', fontSize: 9, fontWeight: '800' },
  statValue: { fontSize: 18, fontWeight: '900', marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: '#17263a', borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GOLD },
  heroCard: { backgroundColor: '#0d1a2a', borderWidth: 1, borderColor: '#243c5b', borderRadius: 24, padding: 22, minHeight: 330, justifyContent: 'center' },
  eyebrow: { color: BLUE, fontWeight: '900', letterSpacing: 2, fontSize: 12, marginBottom: 14 },
  title: { color: '#fff', fontWeight: '900', fontSize: 34, lineHeight: 38, marginBottom: 16 },
  body: { color: '#b8c4d4', fontSize: 17, lineHeight: 25, marginBottom: 26 },
  primary: { backgroundColor: GOLD, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18, alignItems: 'center' },
  primaryText: { color: '#111', fontWeight: '900', fontSize: 15 },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  place: { width: '48%', minHeight: 155, backgroundColor: '#0d1a2a', borderWidth: 1, borderColor: '#243c5b', borderRadius: 18, padding: 16 },
  placeIcon: { fontSize: 28, marginBottom: 10 },
  placeName: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 6 },
  placeDesc: { color: '#8fa0b5', fontSize: 12, lineHeight: 17 },
  secondary: { borderWidth: 1, borderColor: '#3e5878', borderRadius: 16, padding: 15, alignItems: 'center', marginTop: 4 },
  secondaryText: { color: '#c8d3e0', fontWeight: '900' },
  footer: { color: '#53657a', textAlign: 'center', marginTop: 8, fontSize: 12 },
});
