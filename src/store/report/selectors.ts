import { createSelector } from 'reselect';
import { createAsyncActionErrorSelector, createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  getReportListRequest,
} from './slice';

export const selectReportState = (state: RootState) => state.report;
export const selectReportList = createSelector(
  selectReportState,
  (ReportState) => ReportState.list,
);

export const selectReportListIsLoading = createAsyncActionIsLoadingSelector(getReportListRequest.type);
export const selectReportListError = createAsyncActionErrorSelector(getReportListRequest.type);
