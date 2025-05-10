import { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios'; 
import prisma from '@/prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accountId, cardDetails, paymentMethod } = req.body;
    try {
      const tapResponse = await axios.post('https://api.tap.company/v2/saved-cards', {
        card: cardDetails,
        save_card: true,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.TAP_API_KEY}`,
        },
      });

      const paymentData = tapResponse.data;

      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          paymentMethod: paymentData.card.id,  
        },
      });

      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(500).json({ error: 'Payment processing failed' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
