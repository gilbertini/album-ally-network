import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { stickers, stickerById } from "@/lib/album";
import { buildInventory, matchCollectors, type MatchResult } from "@/lib/matching";
import type {
  AppNotification,
  CreditLedgerEntry,
  Trade,
  TradeStatus,
  UserSticker,
} from "@/lib/types";
import {
  allCollectors,
  collectors,
  me,
  myInventory,
  otherInventories,
} from "@/mocks/collectors";

const allStickerIds = stickers.map((s) => s.id);

const initialLedger: CreditLedgerEntry[] = [
  { id: "l1", userId: me.id, amount: 5, type: "purchase", stripePaymentId: "pi_3Qmock01", createdAt: "2026-08-02T14:05:00Z", note: "5 Trade Credits" },
  { id: "l2", userId: me.id, amount: 1, type: "bonus", createdAt: "2026-08-02T14:05:30Z", note: "Welcome credit" },
  { id: "l3", userId: me.id, amount: -1, type: "trade", tradeId: "t_1001", createdAt: "2026-08-06T18:22:00Z", note: "Trade with Maya Chen" },
  { id: "l4", userId: me.id, amount: 10, type: "purchase", stripePaymentId: "pi_3Qmock02", createdAt: "2026-08-09T09:14:00Z", note: "10 Trade Credits" },
  { id: "l5", userId: me.id, amount: -1, type: "trade", tradeId: "t_1002", createdAt: "2026-08-12T20:41:00Z", note: "Trade with Ade Okafor" },
  { id: "l6", userId: me.id, amount: -1, type: "trade", tradeId: "t_1003", createdAt: "2026-08-14T15:02:00Z", note: "Trade with Leo Bakker" },
  { id: "l7", userId: me.id, amount: -1, type: "trade", tradeId: "t_1004", createdAt: "2026-08-15T17:30:00Z", note: "Trade with Tomas Alvarez" },
  { id: "l8", userId: me.id, amount: -2, type: "trade", createdAt: "2026-08-16T11:12:00Z", note: "2 completed trades" },
];

function pickIds(inv: UserSticker[], predicate: (i: UserSticker) => boolean, n: number) {
  return inv.filter(predicate).slice(0, n).map((i) => i.stickerId);
}

function seedTrades(): Trade[] {
  const theirs = otherInventories.get("u_carlos") ?? [];
  const dani = otherInventories.get("u_dani") ?? [];
  const mine = myInventory;
  const iCanSend = pickIds(mine, (i) => i.quantityAvailableForTrade > 0, 6);
  const theyCanSend = pickIds(theirs, (i) => i.quantityAvailableForTrade > 0, 6);
  const daniCanSend = pickIds(dani, (i) => i.quantityAvailableForTrade > 0, 4);

  return [
    {
      id: "t_2001",
      proposerId: "u_dani",
      receiverId: me.id,
      status: "proposed",
      send: daniCanSend.slice(0, 3),
      receive: iCanSend.slice(3, 6),
      createdAt: "2026-08-16T22:10:00Z",
      updatedAt: "2026-08-16T22:10:00Z",
      creditConsumed: false,
      shipping: { proposerShipped: false, receiverShipped: false, proposerReceived: false, receiverReceived: false },
      messages: [],
    },
    {
      id: "t_2002",
      proposerId: me.id,
      receiverId: "u_carlos",
      status: "ready_to_ship",
      send: iCanSend.slice(0, 3),
      receive: theyCanSend.slice(0, 3),
      createdAt: "2026-08-15T13:40:00Z",
      updatedAt: "2026-08-16T09:05:00Z",
      creditConsumed: true,
      shipping: { proposerShipped: false, receiverShipped: true, proposerReceived: false, receiverReceived: false, carrier: "USPS", tracking: "9400 1000 0000 0000 0000 00" },
      messages: [
        { id: "m1", authorId: "u_carlos", body: "Shipping tomorrow morning.", createdAt: "2026-08-16T09:00:00Z" },
        { id: "m2", authorId: me.id, body: "Got it. Thanks!", createdAt: "2026-08-16T09:05:00Z" },
      ],
    },
    {
      id: "t_1004",
      proposerId: me.id,
      receiverId: "u_tomas",
      status: "completed",
      send: iCanSend.slice(0, 2),
      receive: theyCanSend.slice(3, 5),
      createdAt: "2026-08-10T10:00:00Z",
      updatedAt: "2026-08-15T17:30:00Z",
      creditConsumed: true,
      shipping: { proposerShipped: true, receiverShipped: true, proposerReceived: true, receiverReceived: true, carrier: "UPS" },
      messages: [],
      rating: { stars: 5, comment: "Fast shipper, stickers arrived mint." },
    },
  ];
}

const initialNotifications: AppNotification[] = [
  { id: "n1", kind: "trade_proposal", title: "New trade offer", body: "Daniela Rossi wants to trade 3 ↔ 3 with you.", createdAt: "2026-08-16T22:10:00Z", read: false, tradeId: "t_2001" },
  { id: "n2", kind: "trade_shipped", title: "Trade shipped", body: "Carlos Mendez marked his half as shipped (USPS).", createdAt: "2026-08-16T09:00:00Z", read: false, tradeId: "t_2002" },
  { id: "n3", kind: "new_match", title: "5 new matches", body: "New collectors near Austin have stickers you need.", createdAt: "2026-08-15T19:20:00Z", read: true },
  { id: "n4", kind: "rating_received", title: "You got 5 stars", body: "Tomas Alvarez rated your trade 5★.", createdAt: "2026-08-15T17:31:00Z", read: true, tradeId: "t_1004" },
  { id: "n5", kind: "trade_delivered", title: "Delivered", body: "Leo Bakker confirmed he received your stickers.", createdAt: "2026-08-14T15:02:00Z", read: true },
];

interface StoreValue {
  inventory: UserSticker[];
  ledger: CreditLedgerEntry[];
  trades: Trade[];
  notifications: AppNotification[];
  isMember: boolean;
  credits: number;
  stats: {
    owned: number;
    total: number;
    missing: number;
    duplicates: number;
    percent: number;
    countriesComplete: number;
    countriesTotal: number;
  };
  matches: MatchResult[];
  lockedStickerIds: Set<string>;
  setWanted: (stickerId: string, wanted: boolean) => void;
  setOwned: (stickerId: string, quantityOwned: number) => void;
  addDuplicate: (stickerId: string) => void;
  joinMembership: () => void;
  purchaseCredits: (amount: number) => void;
  createTrade: (receiverId: string, send: string[], receive: string[]) => Trade;
  updateTrade: (id: string, patch: Partial<Trade>) => void;
  setTradeStatus: (id: string, status: TradeStatus) => void;
  finalizeTrade: (id: string) => void;
  sendMessage: (id: string, body: string) => void;
  markAllNotificationsRead: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<UserSticker[]>(myInventory);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>(initialLedger);
  const [trades, setTrades] = useState<Trade[]>(seedTrades);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isMember, setIsMember] = useState(true);

  const patchItem = useCallback((stickerId: string, patch: Partial<UserSticker>) => {
    setInventory((prev) =>
      prev.map((item) => (item.stickerId === stickerId ? { ...item, ...patch } : item)),
    );
  }, []);

  const setWanted = useCallback(
    (stickerId: string, wanted: boolean) => patchItem(stickerId, { wanted }),
    [patchItem],
  );

  const setOwned = useCallback(
    (stickerId: string, quantityOwned: number) => {
      const qty = Math.max(0, Math.min(20, quantityOwned));
      patchItem(stickerId, {
        quantityOwned: qty,
        quantityAvailableForTrade: Math.max(0, qty - 1),
        wanted: qty === 0,
      });
    },
    [patchItem],
  );

  const addDuplicate = useCallback(
    (stickerId: string) => {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.stickerId !== stickerId) return item;
          const qty = Math.min(20, item.quantityOwned + 1);
          return {
            ...item,
            quantityOwned: qty,
            quantityAvailableForTrade: Math.max(0, qty - 1),
            wanted: false,
          };
        }),
      );
    },
    [],
  );

  const credits = useMemo(() => ledger.reduce((sum, e) => sum + e.amount, 0), [ledger]);

  const stats = useMemo(() => {
    const owned = inventory.filter((i) => i.quantityOwned > 0).length;
    const duplicates = inventory.reduce((n, i) => n + i.quantityAvailableForTrade, 0);
    const total = inventory.length;
    const byCountry = new Map<string, { owned: number; total: number }>();
    for (const item of inventory) {
      const sticker = stickerById.get(item.stickerId);
      if (!sticker) continue;
      const row = byCountry.get(sticker.country) ?? { owned: 0, total: 0 };
      row.total += 1;
      if (item.quantityOwned > 0) row.owned += 1;
      byCountry.set(sticker.country, row);
    }
    let countriesComplete = 0;
    byCountry.forEach((row) => {
      if (row.owned === row.total) countriesComplete += 1;
    });
    return {
      owned,
      total,
      missing: total - owned,
      duplicates,
      percent: total ? (owned / total) * 100 : 0,
      countriesComplete,
      countriesTotal: byCountry.size,
    };
  }, [inventory]);

  const lockedStickerIds = useMemo(() => {
    const locked = new Set<string>();
    const activeStatuses: TradeStatus[] = [
      "accepted",
      "awaiting_payment",
      "ready_to_ship",
      "shipped",
      "delivered",
    ];
    for (const trade of trades) {
      if (!activeStatuses.includes(trade.status)) continue;
      const mineInTrade = trade.proposerId === me.id ? trade.send : trade.receive;
      mineInTrade.forEach((id) => locked.add(id));
    }
    return locked;
  }, [trades]);

  const matches = useMemo(() => {
    const mine = { profile: me, inventory: buildInventory(me.id, inventory) };
    const others = collectors.map((c) => ({
      profile: c,
      inventory: buildInventory(c.id, otherInventories.get(c.id) ?? []),
    }));
    return matchCollectors(mine, others, allStickerIds);
  }, [inventory]);

  const joinMembership = useCallback(() => setIsMember(true), []);

  const purchaseCredits = useCallback((amount: number) => {
    setLedger((prev) => [
      {
        id: `l_${Date.now()}`,
        userId: me.id,
        amount,
        type: "purchase",
        stripePaymentId: `pi_demo_${Math.random().toString(36).slice(2, 10)}`,
        createdAt: new Date().toISOString(),
        note: `${amount} Trade Credits`,
      },
      ...prev,
    ]);
  }, []);

  const createTrade = useCallback((receiverId: string, send: string[], receive: string[]) => {
    const trade: Trade = {
      id: `t_${Date.now()}`,
      proposerId: me.id,
      receiverId,
      status: "proposed",
      send: send.slice(0, 5),
      receive: receive.slice(0, 5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creditConsumed: false,
      shipping: { proposerShipped: false, receiverShipped: false, proposerReceived: false, receiverReceived: false },
      messages: [],
    };
    setTrades((prev) => [trade, ...prev]);
    return trade;
  }, []);

  const updateTrade = useCallback((id: string, patch: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
    );
  }, []);

  const setTradeStatus = useCallback(
    (id: string, status: TradeStatus) => updateTrade(id, { status }),
    [updateTrade],
  );

  /** A Trade Credit is only consumed when a mutually accepted trade is finalized. */
  const finalizeTrade = useCallback(
    (id: string) => {
      setTrades((prev) =>
        prev.map((t) =>
          t.id === id && !t.creditConsumed
            ? { ...t, creditConsumed: true, status: "ready_to_ship", updatedAt: new Date().toISOString() }
            : t,
        ),
      );
      setLedger((prev) =>
        prev.some((e) => e.tradeId === id && e.type === "trade")
          ? prev
          : [
              {
                id: `l_${Date.now()}`,
                userId: me.id,
                amount: -1,
                type: "trade",
                tradeId: id,
                createdAt: new Date().toISOString(),
                note: "Trade finalized — up to 5 stickers each side",
              },
              ...prev,
            ],
      );
    },
    [],
  );

  const sendMessage = useCallback((id: string, body: string) => {
    setTrades((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              messages: [
                ...t.messages,
                { id: `m_${Date.now()}`, authorId: me.id, body, createdAt: new Date().toISOString() },
              ],
            }
          : t,
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
    [],
  );

  const value: StoreValue = {
    inventory,
    ledger,
    trades,
    notifications,
    isMember,
    credits,
    stats,
    matches,
    lockedStickerIds,
    setWanted,
    setOwned,
    addDuplicate,
    joinMembership,
    purchaseCredits,
    createTrade,
    updateTrade,
    setTradeStatus,
    finalizeTrade,
    sendMessage,
    markAllNotificationsRead,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function collectorById(id: string) {
  return allCollectors.find((c) => c.id === id);
}

export { me, collectors, allCollectors, otherInventories };
