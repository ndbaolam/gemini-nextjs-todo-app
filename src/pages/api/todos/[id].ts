import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("todo");
  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      const updatedTodo = await db.collection('todos').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: req.body }
      );
      res.json(updatedTodo);
      break;
    case 'DELETE':
      const deletedTodo = await db.collection('todos').deleteOne(
        { _id: new ObjectId(id as string) }
      );
      res.json(deletedTodo);
      break;
  }
}
