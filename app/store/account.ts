// account store
import { Account } from '@prisma/client';
import { create } from 'zustand';

interface AccountStore {
    account: Account;
    setAccount: (newAccount: Account) => void;
}

const initNullAccount: Account = {
    id: '',
    userId: '',
    accountType: 'THREE_STEP',
    accountSize: '1K',
    status: 'BREACHED',
    balance: 0,
    accountNumber: '',
    phase: 0,
    picks: 0,
    totalLoss: 0,
    dailyLoss: 0,
    paymentMethod: '',
    minBetPeriod: new Date(),
    maxBetPeriod: new Date(),
    minBetPeriodCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    fundedPayoutTimer: new Date(),
    totalFundedAmount: 0,
    totalFundedPayout: 0,
    // billingAddress: [],
    // paymentCard: [],
    // accountInvoices: [],
    // bets: [],
}

export const accountStore = create<AccountStore>((set) => ({
    account: initNullAccount,
    setAccount: (newAccount: Account) => set((state: AccountStore) => ({
        account: {
            ...Object(state.account),
            ...Object(newAccount),
        }
    })),
}));