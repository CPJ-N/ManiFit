import { assignRoutineToTrainee, updateRoutineStatus } from '../../utils/controllers/routineController';
import { getDoc, updateDoc } from 'firebase/firestore';

const mockGetDoc = getDoc as jest.Mock;
const mockUpdateDoc = updateDoc as jest.Mock;

describe('assignRoutineToTrainee', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls exists() as a method when checking if the routine document exists', async () => {
    // The bug: code uses `routineSnapshot.exists` (property) instead of
    // `routineSnapshot.exists()` (method). If it's a property access, existsMock
    // is never invoked and this test fails.
    const existsMock = jest.fn().mockReturnValue(false);
    mockGetDoc.mockResolvedValue({
      exists: existsMock,
      data: () => ({ assignees: [] }),
    });

    await assignRoutineToTrainee('routine-1', 'trainee-1', '2026-06-11');

    expect(existsMock).toHaveBeenCalled();
  });

  it('does not call updateDoc when the routine does not exist', async () => {
    mockGetDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
      data: () => undefined,
    });

    await assignRoutineToTrainee('nonexistent-id', 'trainee-1', '2026-06-11');

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('assigns a trainee when the routine exists', async () => {
    mockGetDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: () => ({ assignees: [] }),
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    await assignRoutineToTrainee('routine-1', 'trainee-1', '2026-06-11');

    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    const updatedAssignees = updatePayload.assignees;
    expect(updatedAssignees).toHaveLength(1);
    expect(updatedAssignees[0]).toMatchObject({
      traineeId: 'trainee-1',
      date: '2026-06-11',
      status: 'planned',
    });
    expect(updatePayload.assigneeIds).toEqual(['trainee-1']);
  });

  it('preserves existing assignee IDs when assigning a trainee', async () => {
    mockGetDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: () => ({
        assignees: [
          { traineeId: 'trainee-1', date: '2026-06-10', status: 'planned' },
        ],
        assigneeIds: ['trainee-1'],
      }),
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    await assignRoutineToTrainee('routine-1', 'trainee-2', '2026-06-11');

    const updatePayload = mockUpdateDoc.mock.calls[0][1];
    expect(updatePayload.assigneeIds).toEqual(['trainee-1', 'trainee-2']);
  });
});

describe('updateRoutineStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls exists() as a method when checking if the routine document exists', async () => {
    const existsMock = jest.fn().mockReturnValue(false);
    mockGetDoc.mockResolvedValue({
      exists: existsMock,
      data: () => ({ assignees: [] }),
    });

    await updateRoutineStatus('routine-1', 'trainee-1', '2026-06-11', 'completed');

    expect(existsMock).toHaveBeenCalled();
  });

  it('does not call updateDoc when the routine does not exist', async () => {
    mockGetDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
      data: () => undefined,
    });

    await updateRoutineStatus('nonexistent-id', 'trainee-1', '2026-06-11', 'completed');

    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it('updates status for the matching trainee+date combination', async () => {
    mockGetDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: () => ({
        assignees: [
          { traineeId: 'trainee-1', date: '2026-06-11', status: 'planned' },
          { traineeId: 'trainee-2', date: '2026-06-11', status: 'planned' },
        ],
      }),
    });
    mockUpdateDoc.mockResolvedValue(undefined);

    await updateRoutineStatus('routine-1', 'trainee-1', '2026-06-11', 'completed');

    const updatedAssignees = mockUpdateDoc.mock.calls[0][1].assignees;
    expect(updatedAssignees[0].status).toBe('completed');
    expect(updatedAssignees[1].status).toBe('planned');
  });
});
