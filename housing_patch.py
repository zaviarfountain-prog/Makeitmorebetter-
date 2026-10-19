#!/usr/bin/env python3
"""Housing slice v1 for Sky's the Limit (targets main @ 9519832).

What it adds:
  - First player goal: earn and save toward a place to live.
  - Room Rental -- East Oakland, $700 first month's rent (price taken from the
    game's own intro card; not invented).
  - HOME screen shows the housing goal, cost, affordability, a savings
    progress bar, and a two-tap SIGN LEASE confirmation (from savings).
  - Successful lease deducts exactly $700 from savings, sets housing status
    to 'room_rental', and persists via the existing save pipeline.
  - Insufficient savings: message shown, balances untouched.
  - Old saves load as 'none' (no stable housing); Restart Alpha resets it.
  - New games still start with $2,500 cash; all existing systems untouched.

Economy decisions taken (flagged, not silent):
  - Rent is paid from SAVINGS (the "save toward" goal), not cash.
  - One-time $700 first-month payment. Recurring monthly billing is NOT
    implemented (parked future system).
  - No credit/XP effects on the lease (only established rule kept:
    bank deposits +1 credit).

Safe to run twice: aborts without writing if anchors mismatch or if the
slice is already applied. Makes a dated backup before writing.
"""

import datetime
import os
import shutil
import sys

APP = "App.js"
MARKER = "HOUSING_SLICE_V1"


def abort(msg):
    print("ABORT: " + msg)
    sys.exit(1)


def main():
    if not os.path.isfile(APP):
        abort("App.js not found. Run this from the repo root (where App.js lives).")
    with open(APP, "r", encoding="utf-8") as f:
        src = f.read()

    if MARKER in src:
        print("Housing slice already applied -- nothing to do.")
        return

    stamp = datetime.datetime.now().strftime("%Y-%m-%d-%H%M")
    backup = "App.backup-%s-housing.js" % stamp
    shutil.copyfile(APP, backup)
    print("Backup written: " + backup)

    def edit(old, new, label):
        nonlocal src
        n = src.count(old)
        if n == 0:
            abort("anchor not found: " + label)
        if n != 1:
            abort("anchor not unique (%d): %s" % (n, label))
        src = src.replace(old, new, 1)
        print("OK: " + label)

    # 1. New-game default: no stable housing yet.
    edit(
        "  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1\n};",
        "  day: 0, paycheck: 0, lastPayday: -1, lastShiftDay: -1, housing: 'none'\n};",
        "SKY_INITIAL housing default",
    )

    # 2. Old saves load as 'none'.
    edit(
        "          if (!Number.isInteger(saved.lastShiftDay))\n"
        "            saved.lastShiftDay = -1;",
        "          if (!Number.isInteger(saved.lastShiftDay))\n"
        "            saved.lastShiftDay = -1;\n"
        "          /* Housing is new: older saves load with no stable housing. */\n"
        "          if (saved.housing === undefined || ![\"none\", \"room_rental\"].includes(saved.housing))\n"
        "            saved.housing = \"none\";",
        "save-load guard for housing",
    )

    # 3. Housing goal constants (price from the game's intro card).
    edit(
        "const warehouseShiftPay = WAREHOUSE_JOB.shiftHours * WAREHOUSE_JOB.shiftRate;",
        "const warehouseShiftPay = WAREHOUSE_JOB.shiftHours * WAREHOUSE_JOB.shiftRate;\n"
        "/* HOUSING_SLICE_V1: first player goal. Room Rental -- East Oakland,\n"
        " * $700 first month's rent (intro card). Paid from savings; monthly\n"
        " * billing is a parked future system. */\n"
        "const HOUSING_GOAL = {\n"
        "  key: 'room_rental',\n"
        "  name: 'Room Rental \\u2014 East Oakland',\n"
        "  firstMonthRent: 700,\n"
        "};",
        "HOUSING_GOAL constants",
    )

    # 4. Game state for housing.
    edit(
        "  const [lastShiftDay, setLastShiftDay] = useState(initialSave.lastShiftDay);",
        "  const [lastShiftDay, setLastShiftDay] = useState(initialSave.lastShiftDay);\n"
        "  const [housing, setHousing] = useState(initialSave.housing);\n"
        "  const [housingMessage, setHousingMessage] = useState(\"\");\n"
        "  const [housingConfirm, setHousingConfirm] = useState(false);",
        "housing state",
    )

    # 5a. Persist housing with the rest of the save.
    edit(
        "persistSave({ step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay });",
        "persistSave({ step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing });",
        "persistSave includes housing",
    )

    # 5b. Persist effect watches housing too.
    edit(
        "}, [step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, persistSave]);",
        "}, [step, cash, savings, credit, xp, coins, place, employment, training, pendingWages, day, paycheck, lastPayday, lastShiftDay, housing, persistSave]);",
        "persist effect watches housing",
    )

    # 6. Lease transaction: $700 from savings, exactly once; insufficient funds = no-op.
    edit(
        "  const restartGame = () => {",
        "  /*\n"
        "   * HOUSING_SLICE_V1: sign the lease. Pays the $700 first month's rent\n"
        "   * from savings exactly once. Insufficient savings changes nothing.\n"
        "   */\n"
        "  const signLease = () => {\n"
        "    if (housing !== 'none') return;\n"
        "    if (savings < HOUSING_GOAL.firstMonthRent) {\n"
        "      setHousingMessage('Not enough saved yet. You need $' + (HOUSING_GOAL.firstMonthRent - savings) + ' more in savings.');\n"
        "      return;\n"
        "    }\n"
        "    setSavings((v) => v - HOUSING_GOAL.firstMonthRent);\n"
        "    setHousing(HOUSING_GOAL.key);\n"
        "    setHousingConfirm(false);\n"
        "    setHousingMessage('Lease signed! ' + HOUSING_GOAL.name + ' is yours \\u2014 first month paid from savings.');\n"
        "  };\n"
        "\n"
        "  const restartGame = () => {",
        "signLease transaction",
    )

    # 7. Restart Alpha resets housing.
    edit(
        "    setLastShiftDay(-1);\n"
        "    setPaycheckMessage('');\n"
        "    collectPayRef.current = false;\n"
        "  };",
        "    setLastShiftDay(-1);\n"
        "    setPaycheckMessage('');\n"
        "    collectPayRef.current = false;\n"
        "    setHousing('none');\n"
        "    setHousingMessage('');\n"
        "    setHousingConfirm(false);\n"
        "  };",
        "restartGame resets housing",
    )

    # 8. HOME screen: goal, cost, affordability, progress bar, two-tap confirmation.
    edit(
        "          <TouchableOpacity\n"
        "            style={styles.primary}\n"
        "            onPress={restDay}\n"
        "          >\n"
        "            <Text style={styles.primaryText}>\n"
        "              REST \u2014 WAKE UP {tomorrow.toUpperCase()}\n"
        "            </Text>\n"
        "          </TouchableOpacity>\n"
        "\n"
        "          <TouchableOpacity\n"
        "            style={styles.secondary}\n"
        "            onPress={() => setPlace(null)}\n"
        "          >\n"
        "            <Text style={styles.secondaryText}>BACK TO MAP</Text>\n"
        "          </TouchableOpacity>",
        "          <TouchableOpacity\n"
        "            style={styles.primary}\n"
        "            onPress={restDay}\n"
        "          >\n"
        "            <Text style={styles.primaryText}>\n"
        "              REST \u2014 WAKE UP {tomorrow.toUpperCase()}\n"
        "            </Text>\n"
        "          </TouchableOpacity>\n"
        "\n"
        "          {/* HOUSING_SLICE_V1: first goal -- earn and save toward a place to live. */}\n"
        "          <Text style={styles.eyebrow}>HOUSING GOAL</Text>\n"
        "          {housing === 'none' ? (<>\n"
        "            <Text style={styles.title}>A Place to Live</Text>\n"
        "            <Text style={styles.body}>{HOUSING_GOAL.name}</Text>\n"
        "            <Text style={styles.body}>{'First month\\u2019s rent: $' + HOUSING_GOAL.firstMonthRent + ' (from savings)'}</Text>\n"
        "            <Text style={styles.body}>{'Saved $' + Math.min(savings, HOUSING_GOAL.firstMonthRent) + ' of $' + HOUSING_GOAL.firstMonthRent}</Text>\n"
        "            <View style={{ height: 10, backgroundColor: '#1c2a3a', borderRadius: 5, overflow: 'hidden' }}>\n"
        "              <View style={{ height: 10, width: Math.min(100, Math.round((savings / HOUSING_GOAL.firstMonthRent) * 100)) + '%', backgroundColor: GOLD }} />\n"
        "            </View>\n"
        "            {savings >= HOUSING_GOAL.firstMonthRent ? (<>\n"
        "              {housingConfirm ? (<>\n"
        "                <Text style={styles.body}>{'Pay $' + HOUSING_GOAL.firstMonthRent + ' from savings for the first month\\u2019s rent?'}</Text>\n"
        "                <TouchableOpacity style={styles.primary} onPress={signLease}>\n"
        "                  <Text style={styles.primaryText}>CONFIRM \u2014 SIGN LEASE</Text>\n"
        "                </TouchableOpacity>\n"
        "                <TouchableOpacity style={styles.secondary} onPress={() => { setHousingConfirm(false); setHousingMessage(''); }}>\n"
        "                  <Text style={styles.secondaryText}>CANCEL</Text>\n"
        "                </TouchableOpacity>\n"
        "              </>) : (\n"
        "                <TouchableOpacity style={styles.primary} onPress={() => { setHousingMessage(''); setHousingConfirm(true); }}>\n"
        "                  <Text style={styles.primaryText}>SIGN LEASE \u2014 PAY $700</Text>\n"
        "                </TouchableOpacity>\n"
        "              )}\n"
        "            </>) : (\n"
        "              <Text style={styles.body}>{'Work warehouse shifts, collect your Friday paycheck, and deposit cash at the BANK. You need $' + (HOUSING_GOAL.firstMonthRent - savings) + ' more in savings.'}</Text>\n"
        "            )}\n"
        "            {housingMessage !== '' && (<Text style={styles.body}>{housingMessage}</Text>)}\n"
        "          </>) : (<>\n"
        "            <Text style={styles.title}>You\\u2019re Housed</Text>\n"
        "            <Text style={styles.body}>{'Current housing: ' + HOUSING_GOAL.name}</Text>\n"
        "            <Text style={styles.body}>First month\\u2019s rent paid from savings.</Text>\n"
        "          </>)}\n"
        "\n"
        "          <TouchableOpacity\n"
        "            style={styles.secondary}\n"
        "            onPress={() => setPlace(null)}\n"
        "          >\n"
        "            <Text style={styles.secondaryText}>BACK TO MAP</Text>\n"
        "          </TouchableOpacity>",
        "HOME screen housing section",
    )

    with open(APP, "w", encoding="utf-8") as f:
        f.write(src)
    print("Done. Housing slice applied.")


if __name__ == "__main__":
    main()
