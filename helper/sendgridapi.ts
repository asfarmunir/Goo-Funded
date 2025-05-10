import { FROM_EMAIL } from "@/lib/constants";
import { getAccountUnlockedEmailTemplate, getBreachedEmailTemplate, getFundedEmailTemplate } from "@/lib/email-templates/account";
import { getAffiliateSaleEmailTemplate } from "@/lib/email-templates/affiliate";
import { getContractEmailTemplate } from "@/lib/email-templates/contract";
import { getKycEmailTemplate } from "@/lib/email-templates/kyc";
import { getPhaseCompleteEmailTemplate } from "@/lib/email-templates/phase-complete";
import { getPickLossEmailTemplate } from "@/lib/email-templates/pick-loss";
import { getPickWonEmailTemplate } from "@/lib/email-templates/pick-won";
import { getResetPasswordEmailTemplate } from "@/lib/email-templates/reset";
import { getSignupEmailTemplate } from "@/lib/email-templates/signup";
import {
  getWelcomePhase1EmailTemplate,
  getWelcomePhase2EmailTemplate,
  getWelcomePhase3EmailTemplate,
} from "@/lib/email-templates/welcome";
import sendgrid from "@sendgrid/mail";
import { getServerSession } from "next-auth";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendGreetingEmail(to: string, name: string) {
  const message = {
    to,
    from: FROM_EMAIL,
    subject: getSignupEmailTemplate(name).title,
    text: `Hello ${name},\n\nThank you for signing up to Vantage Picks. We're excited to have you on board!`,
    html: getSignupEmailTemplate(name).template,
  };

  try {
    const response = await sendgrid.send(message);
    console.log("Greeting email sent successfully:", response);
  } catch (error) {
    console.error("Error sending greeting email:", error);
  }
}

export async function send2FACodeEmail(userEmail: string, code: string) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: "Your 2FA Code",
    text: `Your 2FA code is: ${code}. It is valid for 10 minutes.`,
    html: `<strong>Your 2FA code is: ${code}</strong>. It is valid for 10 minutes.`,
  };

  try {
    const FAcode = await sendgrid.send(message);
    console.log("2FA code is sent : ", FAcode);
    console.log("2FA code sent successfully");
  } catch (error) {
    console.error("Error sending 2FA code:", error);
  }
}

export async function sendPasswordResetEmail(
  userEmail: string,
  resetLink: string
) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getResetPasswordEmailTemplate(resetLink).title,
    text: `You requested a password reset. Click here to reset your password: ${resetLink}`,
    html: getResetPasswordEmailTemplate(resetLink).template,
  };

  try {
    const response = await sendgrid.send(message);
    console.log("Password reset email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

export async function sendAffiliateSaleEmail(
  userEmail: string,
  firstName: string,
  amount: string
) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getAffiliateSaleEmailTemplate(firstName, amount).title,
    text: `Congratulations! You've earned a commission of ${amount} from a referral.`,
    html: getAffiliateSaleEmailTemplate(firstName, amount).template,
  };

  try {
    const response = await sendgrid.send(message);
    console.log("Affiliate sale email sent successfully:", response);
  } catch (error) {
    console.error("Error sending affiliate sale email:", error);
  }
}

export async function sendAccountBreachedEmail(
  userEmail: string,
  userName: string,
  accountNumber: string
) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getBreachedEmailTemplate(userName, accountNumber).title,
    html: getAffiliateSaleEmailTemplate(userName, accountNumber).template,
  };

  try {
    const response = await sendgrid.send(message);
    console.log("Breached Email Sent.");
  } catch (error) {
    console.error("Breached Email Send Error: ", error);
  }
}

export async function sendPhaseUpdateEmail(
  userEmail: string,
  userName: string,
  accountNumber: string,
  startingPhase: number
) {
  const subject =
    startingPhase === 1
      ? getWelcomePhase1EmailTemplate(userName).title
      : startingPhase === 2
      ? getWelcomePhase2EmailTemplate(userName).title
      : getWelcomePhase3EmailTemplate(userName).title;
  
  const template =
    startingPhase === 1
      ? getWelcomePhase1EmailTemplate(userName).template
      : startingPhase === 2
      ? getWelcomePhase2EmailTemplate(userName).template
      : getWelcomePhase3EmailTemplate(userName).template;

  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: subject,
    html: template,
  };

  const phaseCompleteMessage = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getPhaseCompleteEmailTemplate(userName, startingPhase-1, accountNumber).title,
    html: getPhaseCompleteEmailTemplate(userName, startingPhase-1, accountNumber).template,
  }

  try {
    await sendgrid.send(message);
    await sendgrid.send(phaseCompleteMessage);
  } catch (error) {
    console.error("Account Update Email Send Error: ", error);
  }
}

export async function sendFundedAccountEmail(userEmail:string, userName: string, accountNumber: string) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getFundedEmailTemplate(userName, accountNumber).title,
    html: getFundedEmailTemplate(userName, accountNumber).template,
  };

  try {
    const response = await sendgrid.send(message);
    console.log("Funded Email Sent.");
  } catch (error) {
    console.error("Funded Email Send Error: ", error);
  }
}

export async function sendKycVerifiedEmail (userEmail: string, userName: string) {
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: getKycEmailTemplate(userName).title,
    html: getKycEmailTemplate(userName).template,
  }

  try {
    const response = await sendgrid.send(message);
    console.log("KYC Verified Email Sent.");
  } catch (error) {
    console.error("KYC Verified Email Send Error: ", error);
  }
}

export async function sendPickResultEmail (userEmail: string, userName: string, accountNumber: string, result: "WIN" | "LOSS" ) {
  
  const template = result === "WIN"
    ? getPickWonEmailTemplate(userName, accountNumber).template
    : getPickLossEmailTemplate(userName, accountNumber).template
  const title = result === "WIN"
    ? getPickWonEmailTemplate(userName, accountNumber).title
    : getPickLossEmailTemplate(userName, accountNumber).title
  
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: title,
    html: template,
  }

  try {
    const response = await sendgrid.send(message);
    console.log("Pick Result Email Sent.");
  } catch (error) {
    console.error("Pick Result Email Send Error: ", error);
  }
}

export async function sendAccountUnlockedEmail(userEmail: string) {
  
  const template = getAccountUnlockedEmailTemplate().template
  const title = getAccountUnlockedEmailTemplate().title
  
  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: title,
    html: template,
  }

  try {
    const response = await sendgrid.send(message);
    console.log("Account Unlocked Email Sent.");
  } catch (error) {
    console.error("Account Unlocked Email Send Error: ", error);
  }

}

export async function sendContractAwaitsEmail(userEmail: string, userName: string) {
  
  const template = getContractEmailTemplate(userName).template
  const title = getContractEmailTemplate(userName).title

  const message = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: title,
    html: template,
  }

  try {
    const response = await sendgrid.send(message);
    console.log("Contract Awaits Email Sent.");
  } catch (error) {
    console.error("Contract Awaits Email Send Error: ", error);
  }
}