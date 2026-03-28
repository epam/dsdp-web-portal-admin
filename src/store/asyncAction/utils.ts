import { ErrorInfo } from '#shared/types/common';
import { AnyAction, Action } from '@reduxjs/toolkit';
import {
  cleanActionPostfix,
  errorActionPostfix,
  requestActionPostfix,
  successActionPostfix,
} from './constants';

export interface RejectedAction extends Action {
  payload: ErrorInfo | Array<ErrorInfo>;
}

export const getActionName = (
  actionType: string,
  postfix: string,
) => actionType.substring(0, actionType.length - postfix.length);

export const isRequestAction = (action: AnyAction): action is AnyAction => {
  return action.type.endsWith(requestActionPostfix);
};

export const isSuccessAction = (action: AnyAction): action is AnyAction => {
  return action.type.endsWith(successActionPostfix);
};

export const isErrorAction = (action: AnyAction): action is RejectedAction => {
  return action.type.endsWith(errorActionPostfix);
};

export const isCleanAction = (action: AnyAction): action is AnyAction => {
  return action.type.endsWith(cleanActionPostfix);
};
