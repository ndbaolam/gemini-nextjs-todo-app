import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("todo");

  switch (req.method) {
    case 'GET':
      const todos = await db.collection('todos').find({}).toArray();
      res.json(todos);
      break;
    case 'POST':
      const newTodo = await db.collection('todos').insertOne(req.body);
      res.json(newTodo);
      break;
  }
}
