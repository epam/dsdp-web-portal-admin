import { emailBlacklistValidator as sharedEmailBlacklistValidator } from '#shared/utils/formControls';

export const emailBlacklistValidator = (email: string): boolean => {
  const emailBlacklist = ENVIRONMENT_VARIABLES.emailBlacklist || [];
  return sharedEmailBlacklistValidator(email, emailBlacklist);
};
