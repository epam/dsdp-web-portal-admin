export const getCommonReduxMockState = (specificState: Record<string, unknown>) => ({
  asyncAction: {
    asyncActionMap: {},
  },
  currentUser: {},
  versions: {
    versionsList: [],
  },
  ...specificState,
});
