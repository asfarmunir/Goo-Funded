// account store
import { ProfileLevels, User } from "@prisma/client";
import { create } from "zustand";

interface UserStore {
  user: User;
  setUser: (updatedUser: User) => void;
}

const initialUserValues = {
  id: "",
  firstName: "",
  lastName: null,
  country: "",
  email: "",
  password: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  profileLevel: "Beginner" as ProfileLevels,
  picksWon: 0,
  kycVerified: false,

  twoFactorCode: null,
  twoFactorSecret: null,
  ascii: null,
  otpUrl: null,
  twoFactorExpires: null,

  resetToken: null,
  resetTokenExpiry: null,

  phoneNumber: null,
  displayStatsLive: false,
  phoneNotification: false,
  emailNotification: false,

  address: null,
  dateOfBirth: null,
  avatar: null,

  agreement1: false,
  agreement2: false,
  agreement3: false,

  referralCode: null,
  referredBy: null,
  referralBonus: 0.0,
  totalEarned: 0.0,
  totalReferrals: 0,
  totalReferPayout: 0.0,
  referPayoutTimer: null,

  accounts: [],
  PaymentCard: [],
  AccountInvoices: [],
  Bets: [],
  PayoutRequests: [],
  FundedPayoutRequests: [],
};

export const userStore = create<UserStore>((set) => ({
  user: initialUserValues,
  setUser: (updatedUser: User) =>
    set((state: UserStore) => ({
      user: {
        ...Object(state.user),
        ...Object(updatedUser),
      },
    })),
}));
