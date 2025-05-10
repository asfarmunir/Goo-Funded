// import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/prisma/client';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'PATCH') {
//     const { accountId, status } = req.body;

//     try {
//       const updatedAccount = await prisma.account.update({
//         where: { id: accountId },
//         data: { status },
//       });

//       res.status(200).json(updatedAccount);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to update account status' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
