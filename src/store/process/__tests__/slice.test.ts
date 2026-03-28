import { ProcessListItem } from 'types/processes';
import ProcessReducer, {
  getProcessListSuccess,
  getProcessListClean,
  getProcessListRequest,
  getProcessListError,

  getProcessByNameRequest,
  getProcessByNameError,
  getProcessByNameClean,
  getProcessByNameSuccess,

  updateProcessRequest,
  updateProcessSuccess,
  updateProcessError,

  createProcessRequest,
  createProcessSuccess,
  createProcessError,

  deleteProcessRequest,
  deleteProcessSuccess,
  deleteProcessError,
  ProcessState,
} from '../slice';

describe('Process slice', () => {
  const initialState: ProcessState = {
    list: [],
    process: null,
    hasConflicts: null,
    eTags: null,
  };

  it('getProcessListRequest action should set initialState', () => {
    expect(ProcessReducer(initialState, getProcessListRequest('id')))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessListError action should not set initialized', () => {
    expect(ProcessReducer(initialState, getProcessListError({})))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessListClean action should set initialState', () => {
    expect(ProcessReducer(initialState, getProcessListClean()))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessListSuccess action should set ProcessList', () => {
    expect(ProcessReducer(initialState, getProcessListSuccess([{ name: 'someName' }] as ProcessListItem[])))
      .toMatchObject({
        ...initialState, list: [{ name: 'someName' }], process: null,
      });
  });

  it('getProcessByNameRequest action should set initialState', () => {
    expect(ProcessReducer(initialState, getProcessByNameRequest({ name: 'name', versionId: 'versionId' })))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessByNameError action should not set initialized', () => {
    expect(ProcessReducer(initialState, getProcessByNameError({})))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessByNameClean action should set initialState', () => {
    expect(ProcessReducer(initialState, getProcessByNameClean()))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('getProcessByNameSuccess action should set ProcessList', () => {
    expect(ProcessReducer(initialState, getProcessByNameSuccess('someName')))
      .toMatchObject({
        ...initialState, list: [], process: 'someName',
      });
  });

  it('updateProcessRequest action should set initialState', () => {
    expect(ProcessReducer(initialState, updateProcessRequest({
      name: 'name', title: 'title', data: 'data', versionId: 'versionId',
    })))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('updateProcessError action should not set initialized', () => {
    expect(ProcessReducer(initialState, updateProcessError({})))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('updateProcessSuccess action should set ProcessList', () => {
    expect(ProcessReducer(initialState, updateProcessSuccess()))
      .toMatchObject({
        ...initialState, list: [], process: null,
      });
  });

  it('createProcessRequest action should set initialState', () => {
    expect(ProcessReducer(initialState, createProcessRequest({
      name: 'name', title: 'title', data: 'data', versionId: 'versionId',
    })))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('createProcessError action should not set initialized', () => {
    expect(ProcessReducer(initialState, createProcessError({})))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('createProcessSuccess action should set ProcessList', () => {
    expect(ProcessReducer(initialState, createProcessSuccess()))
      .toMatchObject({
        ...initialState, list: [], process: null,
      });
  });

  it('deleteProcessRequest action should set initialState', () => {
    expect(ProcessReducer(initialState, deleteProcessRequest({
      name: 'name', title: 'title', versionId: 'versionId',
    })))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('deleteProcessError action should not set initialized', () => {
    expect(ProcessReducer(initialState, deleteProcessError({})))
      .toMatchObject({ ...initialState, list: [], process: null });
  });

  it('deleteProcessSuccess action should set ProcessList', () => {
    expect(ProcessReducer(initialState, deleteProcessSuccess('name')))
      .toMatchObject({
        ...initialState, list: [], process: null,
      });
  });
});
