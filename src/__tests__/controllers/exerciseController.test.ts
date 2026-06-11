import { getExercisesByCategory } from '../../utils/controllers/exerciseController';
import { getDocs } from 'firebase/firestore';

const mockGetDocs = getDocs as jest.Mock;

describe('getExercisesByCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an array of exercises for the given category', async () => {
    const fakeExercise = { id: 'ex-1', name: 'Bench Press', primaryMuscles: ['chest'] };
    mockGetDocs.mockResolvedValue({
      forEach: (cb: (doc: any) => void) => {
        cb({ id: 'ex-1', data: () => fakeExercise });
      },
    });

    const result = await getExercisesByCategory('chest');

    // Bug: the function has a floating promise and always returns undefined.
    // After the fix it must return the exercises array.
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBeGreaterThan(0);
    expect((result as any[])[0]).toMatchObject({ id: 'ex-1', name: 'Bench Press' });
  });

  it('returns an empty array when no exercises match the category', async () => {
    mockGetDocs.mockResolvedValue({ forEach: () => {} });

    const result = await getExercisesByCategory('unknown-category');

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect((result as any[]).length).toBe(0);
  });
});
