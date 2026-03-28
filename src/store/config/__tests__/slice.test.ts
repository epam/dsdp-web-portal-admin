import ConfigReducer, { ConfigState, getBpModelerTemplatesSuccess } from '../slice';

describe('Config slice', () => {
  const initialState: ConfigState = {
    bpModelerTemplates: undefined,
  };
  it('getBpModelerTemplatesSuccess should set correct state', () => {
    expect(
      ConfigReducer(
        initialState,
        getBpModelerTemplatesSuccess([{ id: 'someId', name: 'someName' }]),
      ),
    ).toEqual({
      ...initialState,
      bpModelerTemplates: [{ id: 'someId', name: 'someName' }],
    });
  });
});
