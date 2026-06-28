export const USER_ROLES = {
  ASPIRANT: 'aspirant',
  COACH: 'coach',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const COACH_VERIFICATION_STATUS = {
  NOT_APPLIED: 'not_applied',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type CoachVerificationStatus =
  typeof COACH_VERIFICATION_STATUS[keyof typeof COACH_VERIFICATION_STATUS];

export const DEFAULT_USER_ROLE = USER_ROLES.ASPIRANT;
export const DEFAULT_COACH_VERIFICATION_STATUS = COACH_VERIFICATION_STATUS.NOT_APPLIED;

type UserRoleState = {
  role?: UserRole;
  coachVerificationStatus?: CoachVerificationStatus;
};

export const isApprovedCoach = (user?: UserRoleState | null): boolean =>
  user?.role === USER_ROLES.COACH &&
  user?.coachVerificationStatus === COACH_VERIFICATION_STATUS.APPROVED;

export const getHomeLayer = (user?: UserRoleState | null): UserRole =>
  isApprovedCoach(user) ? USER_ROLES.COACH : USER_ROLES.ASPIRANT;

export const getPrimaryRoleLabel = (user?: UserRoleState | null): 'Coach' | 'Aspirant' =>
  isApprovedCoach(user) ? 'Coach' : 'Aspirant';
