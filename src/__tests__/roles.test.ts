import {
  COACH_VERIFICATION_STATUS,
  getHomeLayer,
  getPrimaryRoleLabel,
  isApprovedCoach,
  USER_ROLES,
} from '../constants/roles';

describe('role helpers', () => {
  it('defaults missing users to the Aspirant home layer', () => {
    expect(getHomeLayer(null)).toBe(USER_ROLES.ASPIRANT);
    expect(getPrimaryRoleLabel(undefined)).toBe('Aspirant');
  });

  it('does not unlock Coach home until verification is approved', () => {
    const pendingCoach = {
      role: USER_ROLES.COACH,
      coachVerificationStatus: COACH_VERIFICATION_STATUS.PENDING,
    };

    expect(isApprovedCoach(pendingCoach)).toBe(false);
    expect(getHomeLayer(pendingCoach)).toBe(USER_ROLES.ASPIRANT);
    expect(getPrimaryRoleLabel(pendingCoach)).toBe('Aspirant');
  });

  it('unlocks Coach home for approved Coaches', () => {
    const approvedCoach = {
      role: USER_ROLES.COACH,
      coachVerificationStatus: COACH_VERIFICATION_STATUS.APPROVED,
    };

    expect(isApprovedCoach(approvedCoach)).toBe(true);
    expect(getHomeLayer(approvedCoach)).toBe(USER_ROLES.COACH);
    expect(getPrimaryRoleLabel(approvedCoach)).toBe('Coach');
  });
});
