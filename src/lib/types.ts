export type StickerCategory = "player" | "emblem" | "team_photo" | "world_cup";

export interface Sticker {
  id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  category: StickerCategory;
  album: string;
  number: number;
}

export interface Album {
  id: string;
  name: string;
  expectedBaseCount: number;
  stickers: Sticker[];
}

export interface UserSticker {
  stickerId: string;
  userId: string;
  quantityOwned: number;
  quantityAvailableForTrade: number;
  wanted: boolean;
}

export type CollectorLevel =
  | "Rookie Collector"
  | "Collector"
  | "Super Collector"
  | "Master Collector"
  | "Album Legend";

export interface Collector {
  id: string;
  username: string;
  displayName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  avatar: string;
  flag: string;
  rating: number;
  completedTrades: number;
  cancelledTrades: number;
  disputedTrades: number;
  successRate: number;
  memberSince: string;
  emailVerified: boolean;
  isMember: boolean;
  level: CollectorLevel;
  streak: number;
}

export type TradeStatus =
  | "proposed"
  | "countered"
  | "accepted"
  | "awaiting_payment"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled";

export interface TradeItem {
  stickerId: string;
  fromUserId: string;
}

export interface TradeMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Trade {
  id: string;
  proposerId: string;
  receiverId: string;
  status: TradeStatus;
  send: string[];
  receive: string[];
  createdAt: string;
  updatedAt: string;
  creditConsumed: boolean;
  shipping: {
    proposerShipped: boolean;
    receiverShipped: boolean;
    proposerReceived: boolean;
    receiverReceived: boolean;
    carrier?: "USPS" | "UPS" | "FedEx" | "Other";
    tracking?: string;
  };
  messages: TradeMessage[];
  rating?: { stars: number; comment?: string };
}

export type LedgerType = "purchase" | "trade" | "refund" | "bonus";

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  amount: number;
  type: LedgerType;
  tradeId?: string;
  stripePaymentId?: string;
  createdAt: string;
  note: string;
}

export type NotificationKind =
  | "new_match"
  | "trade_proposal"
  | "counteroffer"
  | "trade_accepted"
  | "trade_shipped"
  | "trade_delivered"
  | "rating_received";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  tradeId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}
