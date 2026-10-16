readme.md

# 🍲 Meal Train SA

> A free, privacy-first Progressive Web App for coordinating meal deliveries to community members in need.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase)](https://supabase.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Table of Contents

- [What Is This?](#-what-is-this)
- [The Problem](#-the-problem)
- [How It Works](#-how-it-works)
- [Features (v1)](#-features-v1)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Data Model](#️-data-model)
- [User Flows](#-user-flows)
- [Privacy & POPIA Compliance](#-privacy--popia-compliance)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment](#️-deployment)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 What Is This?

**Meal Train SA** is a lightweight Progressive Web App that helps communities organize meal deliveries for someone going through a difficult time — a new baby, an illness, a bereavement, or a recovery.

A neighbour or friend (the **organizer**) creates a "meal train" for a recipient, shares a private link via WhatsApp, and volunteers claim evenings to deliver a home-cooked meal.

**No public listings. No payments. No app store. No login required for volunteers.**

Built for the South African context:

- Works on low data
- Works offline
- WhatsApp-first notifications
- Phone-number auth (no email required)
- POPIA-compliant by design

---

## 🧩 The Problem

When someone in your community needs support, well-meaning neighbours often say _"Let me know if you need anything!"_ — but nobody coordinates. The result:

- The family gets **five lasagnas on Monday** and nothing for the rest of the week.
- The person who wants to help **doesn't know what's needed** or when.
- The organizer becomes a **human spreadsheet**, juggling WhatsApp messages.
- The recipient feels **like a burden** having to ask.

Existing tools like MealTrain.com and Give InKind are US-centric, require email signups, aren't optimised for low-data environments, and don't integrate with WhatsApp.

**Meal Train SA solves this with a single, focused tool built for how South Africans actually communicate.**

---

## ⚙️ How It Works

Here is the entire lifecycle of a meal train.

### 1. The Organizer Creates a Train

Sarah's neighbour Thandi just had a baby. Sarah opens Meal Train SA, signs up with her phone number (OTP), and fills in a simple form:

- Recipient's first name
- Delivery address
- Date range (e.g. 20 Oct – 9 Nov)
- Meal types (breakfast / lunch / dinner)
- Dietary notes
- A private note for volunteers ("Ring the bell, don't knock — baby is sleeping")

The app generates a **calendar of slots** — one for each meal, each day.

### 2. The Organizer Shares a Private Link

The app produces a unique URL, e.g. `mealtrain.co.za/t/a7x9k2m4p1`.

Sarah pastes it into her neighbourhood WhatsApp group. **Only people with the link can see the train.** There is no public directory or search.

### 3. Volunteers Claim Slots

Priya clicks the link. **No login required.** She sees:

- Thandi's first name
- The delivery address
- Dietary notes
- Which slots are still open

She taps Tuesday 21 October — Dinner, enters her name and phone number, and optionally notes what she'll bring.

The slot is locked. First come, first served.

### 4. Reminders Go Out

The day before Priya's slot, she receives a WhatsApp reminder with the address and drop-off window. If she can't make it, she taps **CANCEL** and the slot reopens. The organizer is notified.

### 5. Meals Get Delivered

Priya cooks, delivers, and gets on with her evening. Sarah marks the slot **Delivered** in her dashboard.

### 6. The Train Ends

After the final date, Sarah sees a summary: _"21 of 21 dinners delivered by 14 volunteers."_

**90 days later, all personal data is automatically deleted.**

---

## ✨ Features (v1)

### Organizer

- ✅ Sign up with phone number (OTP)
- ✅ Create a meal train (recipient, address, dates, meal types, dietary notes)
- ✅ Auto-generated calendar of meal slots
- ✅ Unique, private share link
- ✅ Dashboard to view, edit, and manage trains
- ✅ See who claimed what
- ✅ Mark meals as delivered
- ✅ Send reminders manually or automatically

### Volunteer

- ✅ Open a share link — no login, no install required
- ✅ View open slots and dietary requirements
- ✅ Claim a slot with name + phone number
- ✅ Optional note ("I'll bring a veg curry")
- ✅ Receive a WhatsApp reminder 24 hours before
- ✅ Cancel a slot via WhatsApp reply
- ✅ Add slot to personal calendar (.ics download)

### Recipient

- ✅ Receives meals
- ✅ Does not need to log in or interact with the app

### Platform

- ✅ Installable PWA (add to home screen)
- ✅ Offline-first — cached calendar and delivery details
- ✅ Low-data footprint
- ✅ WhatsApp share buttons throughout
- ✅ POPIA-compliant data handling
- ✅ Auto-deletion of personal data after 90 days

---

## 🛠️ Tech Stack

| Layer                | Technology                                   | Purpose                              |
| :------------------- | :------------------------------------------- | :----------------------------------- |
| **Framework**        | Next.js 14 (App Router)                      | SSR, routing, API routes             |
| **Language**         | TypeScript                                   | Type safety                          |
| **Styling**          | Tailwind CSS                                 | Fast, mobile-first UI                |
| **Backend / DB**     | Supabase (PostgreSQL)                        | Auth, database, row-level security   |
| **Auth**             | Supabase Phone Auth (OTP)                    | No-password login for organizers     |
| **Hosting**          | Vercel                                       | Seamless Next.js deployment          |
| **PWA**              | `next-pwa` + custom service worker           | Offline caching, install prompt      |
| **WhatsApp**         | `wa.me` deep links (v1), WhatsApp Business API (v2) | Reminders and shares         |
| **Calendar**         | `ics` library                                | Add-to-calendar downloads            |
| **Emails (optional)**| Resend                                       | Backup notifications                 |

**Why Supabase over Firebase?**

- PostgreSQL gives us relational integrity (critical for slot claiming).
- Row-Level Security lets us enforce privacy at the database layer.
- Phone OTP auth is built in and reliable in South Africa.
- Can be self-hosted later if needed.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (PWA)                         │
│                                                             │
│  Next.js App Router  •  Tailwind  •  Service Worker         │
│  Installable  •  Offline cache  •  WhatsApp deep links      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Vercel)                  │
│                                                             │
│  • Server Components (SSR)                                  │
│  • API Routes (/api/*)                                      │
│  • Middleware (auth checks, rate limiting)                  │
│  • Share token validation                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Supabase JS Client
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (Postgres)                     │
│                                                             │
│  • Auth (phone OTP)                                         │
│  • Tables (users, meal_trains, meal_slots)                  │
│  • Row-Level Security policies                              │
│  • Edge Functions (scheduled reminders)                     │
│  • Cron jobs (auto-deletion after 90 days)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│                                                             │
│  • WhatsApp (wa.me links → Business API in v2)              │
│  • Resend (optional email backup)                           │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Privacy by default** — Recipients are never exposed publicly. Volunteers see only what they need.
2. **Zero friction for volunteers** — No login. No install. Just a link.
3. **Offline-first** — Cache the calendar and delivery details. It must work during load shedding.
4. **WhatsApp is the notification channel** — Not email, not push notifications. WhatsApp.
5. **Data minimisation** — Only collect what's necessary. Delete it after 90 days.
6. **Dignity in design** — Warm, respectful language. No clinical or pitying tone.

---

## 🗄️ Data Model

```sql
-- Users (organizers only — volunteers don't have accounts)
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Trains
CREATE TABLE meal_trains (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_name    TEXT NOT NULL,          -- First name or nickname only
  recipient_note    TEXT,                   -- Private note for volunteers
  delivery_address  TEXT NOT NULL,
  dietary_notes     TEXT,
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  share_token       TEXT UNIQUE NOT NULL,   -- 32-char random string
  status            TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Slots (one per meal, per day)
CREATE TABLE meal_slots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_train_id   UUID NOT NULL REFERENCES meal_trains(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  meal_type       TEXT NOT NULL
                  CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  claimed_by_name TEXT,                     -- Volunteer name (no account required)
  claimed_by_phone TEXT,                    -- Volunteer phone
  volunteer_note  TEXT,
  claimed_at      TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'claimed', 'delivered', 'cancelled')),
  UNIQUE (meal_train_id, date, meal_type)
);

-- Indexes
CREATE INDEX idx_meal_trains_organizer ON meal_trains(organizer_id);
CREATE INDEX idx_meal_trains_token ON meal_trains(share_token);
CREATE INDEX idx_meal_slots_train ON meal_slots(meal_train_id);
CREATE INDEX idx_meal_slots_status ON meal_slots(status);
```

### Row-Level Security (RLS) Policies

```sql
-- Organizers can only see their own trains
ALTER TABLE meal_trains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizers can view own trains"
  ON meal_trains FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can create trains"
  ON meal_trains FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own trains"
  ON meal_trains FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Public read access via share_token only (enforced in API layer)
-- Direct table access is blocked; the API validates the token first.

ALTER TABLE meal_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Slots visible to train organizer"
  ON meal_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_trains
      WHERE meal_trains.id = meal_slots.meal_train_id
      AND meal_trains.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can claim an open slot"
  ON meal_slots FOR UPDATE
  USING (status = 'open')
  WITH CHECK (status = 'claimed');
```

### Auto-Deletion (POPIA Compliance)

```sql
-- Runs nightly via pg_cron
-- Deletes all personal data 90 days after a train ends
DELETE FROM meal_trains
WHERE status IN ('completed', 'cancelled')
  AND end_date < NOW() - INTERVAL '90 days';
```

---

## 🔄 User Flows

### Organizer Flow

```
Sign up (phone OTP)
        │
        ▼
Create meal train (form)
        │
        ▼
App generates slots + share link
        │
        ▼
Share link via WhatsApp
        │
        ▼
Watch sign-ups arrive
        │
        ▼
Fill gaps / nudge volunteers
        │
        ▼
Mark meals delivered
        │
        ▼
Close train → summary → auto-delete (90 days)
```

### Volunteer Flow

```
Receive WhatsApp link
        │
        ▼
Open link (no login)
        │
        ▼
View calendar of open slots
        │
        ▼
Claim a slot (name + phone + optional note)
        │
        ▼
Confirmation + .ics calendar download
        │
        ▼
Receive WhatsApp reminder 24h before
        │
        ▼
Cook + deliver meal
        │
        ▼
(Optional) Receive thank-you
```

### Recipient Flow

```
Receive meals
        │
        ▼
(No app interaction required)
```

---

## 🔒 Privacy & POPIA Compliance

Meal Train SA processes personal information (names, phone numbers, addresses, dietary notes) and must comply with South Africa's **Protection of Personal Information Act (POPIA)**.

### Compliance Checklist

- [x] **Lawful basis** — Consent obtained at sign-up and slot claim.
- [x] **Purpose limitation** — Data used only to coordinate meal deliveries.
- [x] **Data minimisation** — No ID numbers. No emails. Recipient's full name not stored.
- [x] **Retention limits** — Personal data deleted 90 days after a train ends.
- [x] **Right to deletion** — "Delete my account" and "Delete this train" options.
- [x] **Security safeguards** — HTTPS, encryption at rest, row-level security.
- [x] **Information Officer** — Registered with the Information Regulator.
- [x] **Privacy policy** — Plain-language, linked from every screen.
- [x] **Breach response plan** — Documented, with Regulator notification procedure.

### Privacy Design Decisions

| Decision                        | Reason                                                  |
| :------------------------------ | :------------------------------------------------------ |
| No public listing               | Trains are only accessible via private share tokens.    |
| Recipient first name only       | Full names are unnecessary and increase risk.           |
| No recipient contact details    | Recipients don't interact with the app.                 |
| Volunteers don't need accounts  | Minimises data collected.                               |
| Auto-deletion after 90 days     | Purpose is fulfilled; retention no longer justified.    |
| Share token is 32-char random   | Prevents guessing/enumeration.                          |
| Organizer can regenerate link   | Revokes access if the link leaks.                       |

### Information Officer Registration

Register your Information Officer with the Information Regulator:
👉 <https://inforegulator.org.za/>

---

## 📬 Contact

**Project Maintainer:** [NumNine9]
**Email:** [nyagura.george@gmail.com]

---

> **Built with ❤️ for South African communities.**
>
> _"Ubuntu — I am because we are."_
