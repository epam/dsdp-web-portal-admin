import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { RegistryTable, TableListItem } from 'types/table';

export interface TablesState {
  list: TableListItem[],
  table: RegistryTable | null,
  dataModel: string,
}

const initialState: TablesState = {
  list: [],
  table: null,
  dataModel: '',
};

const ACTION_PREFIX = 'table';

export const getTableListRequest = createAction<string>(`${ACTION_PREFIX}/getListRequest`);
export const getTableListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getListError`);

export const getTableByNameRequest = createAction<{
  name: string,
  versionId: string,
}>(`${ACTION_PREFIX}/getByNameRequest`);
export const getTableByNameError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getByNameError`);

export const getTableDataModelRequest = createAction<string>(`${ACTION_PREFIX}/getDataModelRequest`);
export const getTableDataModelError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getDataModelError`);

export const updateTableDataModelRequest = createAction<{
  xml: string,
  versionId: string
}>(`${ACTION_PREFIX}/updateDataModelRequest`);
export const updateTableDataModelError = createAction<ErrorInfo>(`${ACTION_PREFIX}/updateDataModelError`);

const TablesSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getListSuccess(state, action: PayloadAction<TableListItem[]>) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getListClean(state) {
      return {
        ...state,
        list: [],
      };
    },
    getByNameSuccess(state, action: PayloadAction<RegistryTable>) {
      return {
        ...state,
        table: action.payload,
      };
    },
    getByNameClean(state) {
      return {
        ...state,
        table: null,
      };
    },
    getDataModelSuccess(state, action: PayloadAction<string>) {
      return {
        ...state,
        dataModel: action.payload,
      };
    },
    getDataModelClean(state) {
      return {
        ...state,
        dataModel: '',
      };
    },
    updateDataModelSuccess(state, action: PayloadAction<string>) {
      return {
        ...state,
        dataModel: action.payload,
      };
    },
  },
});

export default TablesSlice.reducer;

export const {
  getListSuccess: getTableListSuccess,
  getByNameSuccess: getTableByNameSuccess,
  getByNameClean: getTableByNameClean,
  getListClean: getTableListClean,
  getDataModelSuccess: getTableDataModelSuccess,
  getDataModelClean: getTableDataModelClean,
  updateDataModelSuccess: updateTableDataModelSuccess,
} = TablesSlice.actions;
