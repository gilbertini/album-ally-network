# Sticker Swap Network

Build a mobile-first web app called StickerSwap for collectors to trade Panini FIFA World Cup 2026 stickers.

The app is trade-only.

There is:

No selling

No bidding

No cash offers between users

No marketplace pricing

The core idea is simple:

Collectors list what they HAVE and what they NEED. The app automatically finds mutually beneficial trades.

Product Model

Users pay:

$5 one-time fee to join

$1 per completed trade

Each trade can include up to 5 stickers from each user

Do not charge the card $1 individually for every trade.

Instead, implement a Trade Credits system.

Example:

5 Trade Credits = $5

10 Trade Credits = $10

25 Trade Credits = $25

One credit allows one completed trade of up to 5 stickers.

Use Stripe for payments.

The $5 membership should be required before a user can initiate or accept trades.

Main Tagline

No buying. No selling. Just trading.

Secondary copy:

Complete your album. Trade your duplicates.



Sticker Database

I will provide a Markdown file containing the full Panini FIFA World Cup 2026 sticker checklist.

Use this Markdown file as the source dataset.

The checklist contains approximately:

980 base stickers

48 national teams

Sticker codes

Player names

Team emblems

Team photos

FIFA World Cup stickers

Parse the Markdown file and turn it into structured application data.

Each sticker object should include at minimum:

{

  id: string,

  code: string,

  name: string,

  country: string,

  category: "player" | "emblem" | "team_photo" | "world_cup",

  album: "Panini FIFA World Cup 2026"

}

Do not manually hard-code individual stickers if they can be parsed from the Markdown source.

Create an import/parser utility so the checklist can later be replaced or updated.



Authentication

Users should be able to create an account using:

Email

Google

Apple if supported

Profile information:

Username

Display name

City

State

ZIP code

Country

Profile photo

Collector rating

Total completed trades

Member since

Verified email status

Do NOT publicly display a user’s exact street address.



Onboarding

Create a very fast collector onboarding flow.

Step 1

Create account.

Step 2

Pay $5 membership fee.

Step 3

Select:

I HAVE

and

I NEED

stickers.

Step 4

Show the user:

Your Matches

Example:

You have 14 collectors who can help complete your album.

Make this moment visually exciting.



Collection Management

Create a screen called:

My Album

Allow users to browse stickers by:

Country

Player

Sticker number/code

Missing

Owned

Duplicates

For every sticker provide simple controls:

Need

Have

Duplicate +1

Users should be able to quickly update quantities.

Example:

ARG17 — Lionel Messi

Owned: 3

This means:

1 belongs to the user’s collection

2 are available to trade

Represent inventory internally as:

{

  stickerId,

  userId,

  quantityOwned,

  quantityAvailableForTrade,

  wanted: boolean

}



Country View

Users should be able to open a country.

Example:

🇦🇷 Argentina

Show all 20 stickers.

Display collection progress:

14 / 20 collected

Show each sticker in a clean grid.

States:

✓ HAVE

NEED

2 DUPLICATES

Use visually obvious states.



Dashboard

The main dashboard should prioritize matching.

Top section:

Your Album

Example:

643 / 980 collected
65.6% complete

Then show:

Missing: 337

Duplicates: 91

Then:

Best Matches

Example:

Carlos 🇺🇸

92% Trade Match

Carlos has:

ARG17 — Lionel Messi

BRA14 — Vinicius Jr.

ESP15 — Lamine Yamal

You have:

USA16 — Christian Pulisic

FRA20 — Kylian Mbappé

POR15 — Cristiano Ronaldo

CTA:

Build Trade



Matching Engine

The matching engine is the most important feature.

For User A and User B:

Find stickers where:

User A NEEDS sticker X
AND
User B has sticker X available as a duplicate.

Then also find stickers where:

User B NEEDS sticker Y
AND
User A has sticker Y available as a duplicate.

Only call something a Mutual Match when both users have something the other person needs.

Calculate a Match Score.

Suggested formula:

mutualAvailable =

number of stickers A has that B needs

+

number of stickers B has that A needs

Prioritize users with the highest number of reciprocal matches.

Also factor in:

Same country

Same state

Same metro area

Collector rating

Successful trade history

Do NOT prioritize based on sticker monetary value.

This is not a pricing marketplace.



Match Feed

Create a swipeable or card-based experience inspired loosely by modern prediction/trading apps, but do not copy any brand directly.

Each match card should show:

Collector

Location

Rating

Completed trades

THEY HAVE

Sticker cards that I need.

YOU HAVE

Sticker cards that they need.

Then show:

Possible Trade: 4 ↔ 3

CTA:

Build Trade

Secondary CTA:

View Collector



Build Trade

Allow User A to propose up to:

5 stickers

from their available duplicates.

And request up to:

5 stickers

from User B.

Interface:

You Send

USA16 — Christian Pulisic

MEX17 — Raúl Jiménez

ARG8 — Enzo Fernández

You Receive

ARG17 — Lionel Messi

BRA14 — Vinicius Jr.

ESP15 — Lamine Yamal

Buttons:

Send Trade Proposal

Cancel



Trade Proposal

User B receives:

Trade Offer

Gil wants to trade with you.

YOU RECEIVE:

3 stickers

YOU SEND:

3 stickers

Actions:

Accept Trade

Counter Offer

Decline

Allow counters while keeping the 5-sticker-per-side maximum.



Trade Locking

Once both users accept:

Temporarily lock those sticker quantities so they cannot be offered in another trade.

Trade status:

proposed

countered

accepted

awaiting_payment

ready_to_ship

shipped

delivered

completed

disputed

cancelled



Trade Fee

Once both users agree to the final trade:

Show:

Complete this trade for 1 Trade Credit

A Trade Credit is consumed when the trade becomes finalized.

Do not consume credits for:

Proposals

Declined trades

Counteroffers

Only charge once the trade is mutually accepted.

Clearly show:

1 Trade Credit covers this entire trade — up to 5 stickers each.



Trade Credits

Create a Wallet page.

Trade Credits

Current balance:

8 Credits

Purchase:

5 Trades — $5

10 Trades — $10

25 Trades — $25

Implement Stripe Checkout.

Store successful purchases and credit ledger entries in the database.

Do not simply store a mutable balance.

Use a ledger structure:

{

  userId,

  amount,

  type: "purchase" | "trade" | "refund" | "bonus",

  tradeId?,

  stripePaymentId?,

  createdAt

}

Balance should be calculated from ledger transactions.



Shipping

After the trade is finalized:

Users exchange shipping information privately.

Shipping address should only become visible after:

Both users accepted the trade

Required Trade Credit has been processed

Allow users to:

Mark as Shipped

Optional:

Add tracking number.

Carrier:

USPS

UPS

FedEx

Other

Do not require the platform to purchase postage in V1.



Trade Confirmation

Once a sticker shipment arrives:

User selects:

I Received My Stickers

When both users confirm receipt:

Trade becomes:

Completed

Then unlock ratings.



Reputation

After every completed trade users can leave:

1–5 stars

Optional short comment.

Profile example:

Gil
⭐ 4.9

37 Completed Trades

98% Successful

Member since August 2026

Also track:

Cancelled trades

Disputed trades

Successful trades

Do not expose unnecessary personal information.



Anti-Fraud

Add basic protections.

Require:

Verified email

$5 membership

Completed profile

Allow users to:

Report User

Report Trade

Block User

Create an admin dashboard for reviewing reports.

A user should not be able to trade with themselves.

Prevent duplicate concurrent trades involving already locked stickers.



Messaging

Each accepted or active trade should have a lightweight private chat.

Do not build a global DM system initially.

Messaging should be tied directly to a trade.

Example:

Trade Chat

“Shipping tomorrow.”

“Got it. Thanks!”

This reduces spam.



Search

Global search should find:

Sticker code

Player

Country

Example searches:

Messi

ARG17

Puerto Rico if future albums contain it

Display collectors currently offering the searched sticker.

Example:

Lionel Messi — ARG17

184 collectors have duplicates

23 are mutual matches for you

Prioritize mutual matches.



Notifications

Create in-app notifications for:

New match

Trade proposal

Counteroffer

Trade accepted

Trade shipped

Trade delivered

Rating received

Architecture should allow push notifications later.



Navigation

Mobile bottom navigation:

Home

Album

Matches

Trades

Profile

Include the Trade Credit balance visibly but subtly.

Example:

8 Credits



UI / Visual Direction

The app should feel:

Collectible

Social

Fast

Trustworthy

Competitive

Fun

Not childish.

Think:

modern sports app

collecting app

lightweight fintech UX

Use:

Large sticker imagery placeholders

Country flags

Team identity

Progress meters

Match percentages

Strong cards

Rounded components

Smooth micro-interactions

Mobile-first.

Desktop should still look excellent.

Avoid clutter.

Avoid generic SaaS dashboard styling.



Home Screen

Hero:

Complete the album together.

No buying. No selling. Just trading.

CTA:

Join for $5

Secondary CTA:

See How It Works

Then show:

1. Build Your Album

Mark what you have and what you need.

2. Find Matches

We find collectors who have what you’re missing.

3. Trade

Swap up to five stickers at a time.

4. Complete the Album

Track your progress toward all 980 stickers.



Social / Gamification

Add:

Album Completion %

72% Complete

Countries Completed

31 / 48

Current Streak

Trades completed without an issue.

Collector Levels

Rookie Collector

Collector

Super Collector

Master Collector

Album Legend

Do NOT make levels pay-to-win.



Achievements

Examples:

First Trade

Complete your first swap.

Perfect Match

Complete a 5-for-5 trade.

Argentina Complete

Collect every Argentina sticker.

50% Club

Collect half the album.

Album Complete

Collect all 980 base stickers.



Important Product Rule

Sticker values must never be automatically assigned monetary prices.

The app facilitates exchange.

It does not determine whether:

Messi = Pulisic

or

1 sticker = 5 stickers.

Collectors decide whether a proposed trade is fair.

The platform only limits each trade to:

Maximum 5 stickers from each party.



Database

Use Supabase/Postgres.

Suggested tables:

users

profiles

albums

stickers

user_stickers

matches

trade_proposals

trades

trade_items

trade_messages

trade_credit_ledger

payments

ratings

notifications

reports

blocked_users

Use proper foreign keys.

Use Supabase Row Level Security.

Users should only be able to modify their own inventory.

Private shipping information must never be returned to unauthorized users.



Technical Stack

Preferred:

React

TypeScript

Next.js or equivalent

Tailwind

Supabase

Stripe

Responsive PWA architecture

Build reusable components.

Do not create everything in one giant file.

Use a clear folder structure.



V1 Priority

Build the MVP in this order:

Authentication

$5 membership

Import Markdown sticker database

My Album

Have / Need / Duplicate tracking

Matching engine

Match feed

Trade proposal

Trade acceptance/counter

Trade Credits

Shipping status

Ratings

Notifications

Admin/reporting

Do not overbuild social features before the core trade loop works.



Seed Data

Use the supplied Markdown checklist as the authoritative seed data.

When the file is uploaded:

Parse headings as countries/sections.

Parse sticker code.

Parse sticker/player name.

Determine sticker type.

Generate database seed records.

Validate that exactly 980 base stickers were imported.

Show an error if the expected count does not match.

Build the import system so future albums can be added.

The architecture should eventually support:

Panini World Cup 2026

Panini Copa América

Panini Euro

Pokémon

Sports cards

Other collectible checklists

Do not hardwire the entire application exclusively to one album even though World Cup 2026 is the initial product.



Critical UX Moment

After a collector enters their duplicates and missing stickers, immediately calculate their network.

Display something like:

🎯 27 Trade Matches Found

18 collectors have stickers you need.

9 have mutual matches right now.

CTA:

Find My Best Trade

This should be one of the strongest moments in the entire product.



Core Product Philosophy

The application should optimize for:

Completing collections, not monetizing collectibles.

The best outcome is not:

“Your sticker is worth $30.”

The best outcome is:

“Someone has the sticker you’re missing — and you have one they need.”

Build the MVP around that experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/93c152c5-e4ab-4e3d-8bac-75cde9760454).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
