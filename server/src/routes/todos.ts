import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectDB } from '../db';

const router = Router();
const COLLECTION = 'todos';

interface TodoDoc {
  _id?: ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

function toClient(doc: TodoDoc & { _id: ObjectId }) {
  const { _id, ...rest } = doc;
  return {
    id: _id.toHexString(),
    ...rest,
    // Serialize dates as ISO strings for the client
    createdAt: rest.createdAt instanceof Date ? rest.createdAt.toISOString() : rest.createdAt,
    dueDate: rest.dueDate instanceof Date ? rest.dueDate.toISOString() : rest.dueDate,
  };
}

router.get('/', async (_req: Request, res: Response) => {
  const db = await connectDB();
  const docs = await db
    .collection<TodoDoc>(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  res.json(docs.map((d) => toClient(d as TodoDoc & { _id: ObjectId })));
});

router.post('/', async (req: Request, res: Response) => {
  const { title, dueDate } = req.body as { title?: string; dueDate?: string };
  if (!title?.trim()) {
    res.status(400).json({ error: 'title is required' });
    return;
  }
  const doc: TodoDoc = {
    title: title.trim(),
    completed: false,
    createdAt: new Date(),
    ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
  };
  const db = await connectDB();
  const result = await db.collection<TodoDoc>(COLLECTION).insertOne(doc);
  res.status(201).json(toClient({ ...doc, _id: result.insertedId }));
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'invalid id' });
    return;
  }

  const { completed, dueDate } = req.body as {
    completed?: boolean;
    dueDate?: string | null;
  };

  // Build the update: only set fields that were explicitly sent
  const $set: Partial<TodoDoc> = {};
  if (completed !== undefined) $set.completed = completed;
  if (dueDate !== undefined) {
    // null means "remove due date", a string means "set/update it"
    $set.dueDate = dueDate ? new Date(dueDate) : undefined;
  }

  if (Object.keys($set).length === 0) {
    res.status(400).json({ error: 'nothing to update' });
    return;
  }

  const db = await connectDB();

  // When dueDate is null, remove the field entirely rather than storing null.
  // $unset value must be 1 per MongoDB driver types.
  const result = await db
    .collection<TodoDoc>(COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      dueDate === null
        ? { $set: $set, $unset: { dueDate: 1 as unknown as '' } }
        : { $set: $set },
      { returnDocument: 'after' }
    );

  if (!result) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  res.json(toClient(result as TodoDoc & { _id: ObjectId }));
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'invalid id' });
    return;
  }
  const db = await connectDB();
  await db.collection<TodoDoc>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  res.status(204).send();
});

export default router;
