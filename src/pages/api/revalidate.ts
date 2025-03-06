// Import necessary modules
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, post_id, category, slug, subcategory } = req.query;

  if (secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const keysToDelete = [
    `post-${post_id}-*`,
    `category-${subcategory}-*`,
    `related-${post_id}-*`,
    `postByCat-${subcategory}-*`,
  ];

  try {
    const redis: any = { get: null, set: null };

    const keys = await Promise.all(
      keysToDelete.map((pattern) => redis.keys(pattern))
    );

    const keysFlat = keys.flat();

    if (keysFlat.length > 0) {
      await redis.del(...keysFlat);
    }

    return res
      .status(200)
      .json({ message: `Keys '${keysFlat.join(', ')}' deleted from Redis` });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
