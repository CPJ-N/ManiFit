import { getExercisesByCategory, getExerciseImageUrl, getExercisesByBodyPart } from '../../utils/controllers/exerciseController';
import { getDocs } from 'firebase/firestore';

const mockGetDocs = getDocs as jest.Mock;

describe('getExercisesByBodyPart', () => {
  const DATASET = [
    { name: 'Standing Calf Raise', primaryMuscles: ['calves'], category: 'strength', images: ['Calf/0.jpg'] },
    { name: 'Barbell Squat', primaryMuscles: ['quadriceps'], category: 'strength', images: ['Squat/0.jpg'] },
    { name: 'Burpee', primaryMuscles: [], category: 'cardio', images: ['Burpee/0.jpg'] },
  ];

  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({ json: async () => DATASET });
  });

  it('matches by primaryMuscles (calves)', async () => {
    const result = await getExercisesByBodyPart('calves');
    expect(result.map(e => e.name)).toEqual(['Standing Calf Raise']);
  });

  it('matches by primaryMuscles (quadriceps)', async () => {
    const result = await getExercisesByBodyPart('quadriceps');
    expect(result.map(e => e.name)).toEqual(['Barbell Squat']);
  });

  it('matches cardio via the category field, not primaryMuscles', async () => {
    // 'cardio' is a category, not a muscle — the old filter returned [].
    const result = await getExercisesByBodyPart('cardio');
    expect(result.map(e => e.name)).toEqual(['Burpee']);
  });
});

describe('getExerciseImageUrl', () => {
  const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

  it('builds the URL from the exercise images path, not a slug of the name', () => {
    // The free-exercise-db serves images at exercises/<id>/<n>.jpg, and each
    // record already carries the correct relative paths in `images`.
    const exercise = { name: '3/4 Sit-Up', images: ['3_4_Sit-Up/0.jpg', '3_4_Sit-Up/1.jpg'] };

    const url = getExerciseImageUrl(exercise);

    expect(url).toBe(`${BASE}/3_4_Sit-Up/0.jpg`);
    // It must NOT slugify the name into a broken (404) path.
    expect(url).not.toContain('3-4-sit-up');
  });

  it('returns undefined when the exercise has no images', () => {
    expect(getExerciseImageUrl({ name: 'No Image Exercise', images: [] })).toBeUndefined();
    expect(getExerciseImageUrl({ name: 'No Image Exercise' })).toBeUndefined();
  });
});

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
