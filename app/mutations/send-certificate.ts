import { CertificateType } from "@prisma/client";

interface SendCertificateReqData {
  certificateType: CertificateType;
  accountId: string,
}

export const sendCeriticicate = async (data: SendCertificateReqData) => {
  const response = await fetch("/api/certificate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(error);
  }
};