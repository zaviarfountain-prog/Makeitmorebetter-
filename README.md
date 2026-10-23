# Sky's the Limit

**A life-simulation game about building a better life, one real decision at a time.**

You arrive in Sky City with **$2,500** and nothing else. Get a job. Build your credit. Save for a place to live. Every system in the game is a real-life money skill — paychecks, savings, credit scores, and employer benefits — learned by playing, not by reading.

> I built this game to help people who are dealing with real-life struggles see the steps that move a life forward: work, save, build credit, get housed, keep climbing.

## ▶️ Play it now

- **Web demo (phone or computer):** https://zaviarfountain-prog.github.io/Makeitmorebetter-/
  Works in any browser — on iPhone, tap Share → *Add to Home Screen* to install it like an app.
- **Android:** APK built with EAS Build and tested on a real tablet.
- Each player's save lives on their own device and survives refresh/restart.

<!-- Screenshots: add 2-3 screenshots of the game here (city map, a work shift, the bank). -->

## 🎮 What you can do in the game

- **Explore Sky City** — a free-roam city map. Tap anywhere to walk there, or tap a building to go straight in.
- **Get hired** — apply at the Employment Center, pass hiring, and complete **paid job training** before your first shift.
- **Work shifts** — run warehouse shifts in an interactive work scene: pick up packages, deliver them, earn your pay.
- **Friday payday** — wages build up as *pending* during the week and land in an available paycheck every Friday. Collect it exactly once — no double-dipping.
- **Bank** — deposit cash into savings, $100 at a time. Every deposit builds your **credit score** (+1, up to 850).
- **First goal: a place to live** — save $700 in your savings account and sign the lease on the Room Rental in East Oakland. Rent comes out of savings, exactly once, and your housing stays saved.
- **Real benefits** — your job's benefits screen shows what many players have never had explained: employer-paid medical, dental, and vision premiums, and a **401(k) match** — dollar-for-dollar up to 5% of your pay.
- **Track your life stats** — cash, savings, credit score, XP, and level are always live at the top of the screen.

## 💰 The economy (no fake numbers)

| System | How it works |
|---|---|
| Starting cash | $2,500 |
| Warehouse shift | 8 hours × $18/hr = **$144** + 40 XP |
| Paid training | One 8-hour day at $18/hr = **$144** |
| Payday | Every Friday, pending wages become a collectable paycheck |
| Bank deposit | $100 per tap; **+1 credit** per deposit (max 850) |
| First home | Room Rental — East Oakland, **$700** first month from savings |

## 🛠️ Built with

- **React Native 0.86** + **Expo SDK 57** (JavaScript, React 19)
- **AsyncStorage** for on-device saves with safe fallbacks for older save files
- **EAS Build** for the Android APK
- **GitHub Actions** — every push to `main` rebuilds and redeploys the web demo automatically
- Single-file game architecture (`App.js`, ~2,000 lines) — the whole game in one readable place

Every feature ships the same way: designed, patched in with a dated backup, verified for exact money math, then tested on a real Android tablet before the next feature starts.

## 🗺️ Roadmap

- A second job — **City Hall Clerk** (city government) — with its own pay rate, alongside the warehouse
- A **life-goals ladder** after housing: emergency fund, credit milestones, and savings targets with progress tracking
- Vacation and sick leave in the benefits display

## 👤 About the developer

I'm Zabby, an independent developer in Oakland, CA. Sky's the Limit is my first game, built with an AI-assisted workflow: I direct the design and the mission, test every build myself on a real device, and ship updates one verified piece at a time. This project is my hands-on path into **game development and software development** — game design, coding, and testing included.

*Status: in active development. New features land one at a time, tested before the next begins.*
