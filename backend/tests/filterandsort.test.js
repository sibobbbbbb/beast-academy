import { jest } from '@jest/globals';

// create the two mock functions up‐front
const mockFindMany = jest.fn();
const mockCount    = jest.fn();

await jest.unstable_mockModule(
  '../db/prisma/prisma.js',
  () => ({
    __esModule: true,
    prisma: {
      users: {
        findMany: mockFindMany,
        count:    mockCount
      }
    }
  })
);

import { getMembers as filterAndSortController } from '../controllers/filterAndSortController';
import { prisma } from '../db/prisma/prisma';

describe('filterAndSortController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { query: {}, user: { role: 'admin', userId: 1 } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test('returns paginated members', async () => {
    mockFindMany.mockResolvedValue([{ id:1, name:'Foo' }]);
    mockCount.mockResolvedValue(1);

    await getMembers(req, res);

    expect(mockFindMany).toHaveBeenCalled();
    expect(mockCount).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [{ id:1, name:'Foo' }],
        pagination: expect.objectContaining({ total:1, page:1, limit:10, totalPages:1 })
      })
    );
  });

  test('handles errors', async () => {
    mockFindMany.mockRejectedValue(new Error('boom'));

    await getMembers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});