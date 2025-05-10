// import { AccountInvoices, AccountStatus, AccountType, Bets, BillingAddress, PaymentCard, User } from "@prisma/client";

// export interface Account {
//   id: string; // MongoDB ObjectId as a string
//   userId: string; // MongoDB ObjectId as a string

//   accountType: AccountType;
//   accountSize: '1k' | '5k' | '10k' | '50k' | '100k'; 
//   status: AccountStatus;
//   balance: number; // Store account balance
//   accountNumber: string; // Store account number
//   phase: number; // Store account phase
//   picks: number; // Store account picks

//   totalLoss?: number; // Store total loss (optional)
//   dailyLoss?: number; // Store daily loss limit (optional)
//   minBetPeriod: Date; // Store minimum bet period
//   maxBetPeriod: Date; // Store maximum bet period
//   minBetPeriodCompleted: boolean; // Store if minimum bet period is completed

//   paymentMethod?: string; // Store payment method details (optional)
//   user?: User; // Store user information
//   billingAddress: BillingAddress[]; // Store billing addresses
//   paymentCard: PaymentCard[]; // Store payment card information

//   createdAt: Date; // Store account creation date
//   updatedAt: Date; // Store last updated timestamp
//   accountInvoices: AccountInvoices[]; // Store account invoices
//   bets: Bets[]; // Store related bets
// }
