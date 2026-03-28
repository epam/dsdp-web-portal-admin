import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ErrorInfo } from '#shared/types/common';
import { Report } from 'types/report';

const ACTION_PREFIX = 'report';

export interface ReportState {
  list: Report[],
}

const initialState: ReportState = {
  list: [],
};

export const getReportListRequest = createAction(`${ACTION_PREFIX}/getReportListRequest`);
export const getReportListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getReportListError`);

const FormSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getReportListSuccess(state, action: PayloadAction<Report[]>) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getReportListClean(state) {
      return {
        ...state,
        list: [],
      };
    },
  },
});

export default FormSlice.reducer;

export const {
  getReportListSuccess,
  getReportListClean,
} = FormSlice.actions;
