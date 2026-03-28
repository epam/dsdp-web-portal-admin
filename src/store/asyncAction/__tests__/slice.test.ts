import { createAction } from '@reduxjs/toolkit';
import AsyncActionReducer, { AsyncActionState } from '../slice';

describe('AsyncAction slice tests', () => {
  const initialState: AsyncActionState = {
    asyncActionMap: {},
  };
  const testAction = 'testAction';
  const testRequestAction = createAction(`${testAction}Request`);
  const testSuccessAction = createAction(`${testAction}Success`);
  const testErrorAction = createAction(`${testAction}Error`);
  const testCleanAction = createAction(`${testAction}Clean`);
  it('Request action should set isLoading: true, isLoaded: false', () => {
    expect(
      AsyncActionReducer(initialState, testRequestAction()),
    ).toMatchObject({
      asyncActionMap: {
        [testAction]: {
          isLoading: true,
          isLoaded: false,
        },
      },
    });
  });
  it('Success action should set isLoading: false, isLoaded: true', () => {
    expect(
      AsyncActionReducer(initialState, testSuccessAction()),
    ).toMatchObject({
      asyncActionMap: {
        [testAction]: {
          isLoading: false,
          isLoaded: true,
        },
      },
    });
  });
  it('Error action should set isLoading: false, isLoaded: false', () => {
    expect(
      AsyncActionReducer(initialState, testErrorAction()),
    ).toMatchObject({
      asyncActionMap: {
        [testAction]: {
          isLoading: false,
          isLoaded: false,
        },
      },
    });
  });
  it('Clean action should set isLoading: false, isLoaded: false', () => {
    expect(
      AsyncActionReducer(initialState, testCleanAction()),
    ).toMatchObject({
      asyncActionMap: {
        [testAction]: {
          isLoading: false,
          isLoaded: false,
        },
      },
    });
  });
});
