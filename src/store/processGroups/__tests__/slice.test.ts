import ProcessGroupsReducer, {
  ProcessGroupsState,
  getProcessGroupDataSuccess,
  getProcessGroupDataClean,
  saveProcessGroupDataSuccess,
  cancelGroupDataEdit,
  groupActionNewGroup,
  groupActionMoveGroupUp,
  groupActionMoveGroupDown,
  groupActionDeleteGroup,
  groupActionEditGroup,
  groupActionMoveProcessUp,
  groupActionMoveProcessDown,
  groupActionMoveProcess,
  groupActionNewGroupWithProcess,
} from '../slice';

describe('Process slice', () => {
  const initialState: ProcessGroupsState = {
    groupData: {
      groups: [],
      ungrouped: [],
    },
    groupDataEdit: {
      groups: [],
      ungrouped: [],
    },
  };
  it('getProcessGroupDataSuccess should set correct state', () => {
    expect(ProcessGroupsReducer(initialState, getProcessGroupDataSuccess({ groups: [], ungrouped: [] })))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: { groups: [], ungrouped: [] },
      });
  });
  it('groupActionEditGroup should edit group name', () => {
    expect(ProcessGroupsReducer(
      {
        ...initialState,
        groupDataEdit: {
          ...initialState.groupDataEdit,
          groups: [
            { name: 'someName1' },
            { name: 'someName2' },
          ] as any,
        },
      },
      groupActionEditGroup({ name: 'someName2', newName: 'someName42' }),
    ))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: {
          groups: [
            { name: 'someName1' },
            { name: 'someName42' },
          ],
        },
      });
  });
  it('groupActionMoveProcessUp should move up process in provided group', () => {
    expect(
      ProcessGroupsReducer(
        {
          ...initialState,
          groupDataEdit: {
            groups: [
              { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId2' }, { id: 'pId3' }] },
              { name: 'g2', processDefinitions: [] },
            ] as any,
            ungrouped: [],
          },
        },
        groupActionMoveProcessUp({ groupName: 'g1', processId: 'pId2' }),
      ),
    ).toMatchObject(
      {
        ...initialState,
        groupDataEdit: {
          groups: [
            { name: 'g1', processDefinitions: [{ id: 'pId2' }, { id: 'pId1' }, { id: 'pId3' }] },
            { name: 'g2', processDefinitions: [] },
          ] as any,
          ungrouped: [],
        },
      },
    );
  });
  it('groupActionMoveProcessDown should move down process in provided group', () => {
    expect(
      ProcessGroupsReducer(
        {
          ...initialState,
          groupDataEdit: {
            groups: [
              { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId2' }, { id: 'pId3' }] },
              { name: 'g2', processDefinitions: [] },
            ] as any,
            ungrouped: [],
          },
        },
        groupActionMoveProcessDown({ groupName: 'g1', processId: 'pId2' }),
      ),
    ).toMatchObject(
      {
        ...initialState,
        groupDataEdit: {
          groups: [
            { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId3' }, { id: 'pId2' }] },
            { name: 'g2', processDefinitions: [] },
          ] as any,
          ungrouped: [],
        },
      },
    );
  });
  it('groupActionMoveProcess should move process from one to other group', () => {
    expect(
      ProcessGroupsReducer(
        {
          ...initialState,
          groupDataEdit: {
            groups: [
              { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId2' }, { id: 'pId3' }] },
              { name: 'g2', processDefinitions: [] },
            ] as any,
            ungrouped: [],
          },
        },
        groupActionMoveProcess({ groupName: 'g2', processDefinition: { id: 'pId2' } as any, currentGroup: 'g1' }),
      ),
    ).toMatchObject(
      {
        ...initialState,
        groupDataEdit: {
          groups: [
            { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId3' }] },
            { name: 'g2', processDefinitions: [{ id: 'pId2' }] },
          ] as any,
          ungrouped: [],
        },
      },
    );
  });
  it('groupActionNewGroupWithProcess should create new group with provided process', () => {
    expect(
      ProcessGroupsReducer(
        {
          ...initialState,
          groupDataEdit: {
            groups: [
              { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId2' }, { id: 'pId3' }] },
              { name: 'g2', processDefinitions: [] },
            ] as any,
            ungrouped: [],
          },
        },
        groupActionNewGroupWithProcess({ groupName: 'g3', processDefinition: { id: 'pId4' } as any }),
      ),
    ).toMatchObject(
      {
        ...initialState,
        groupDataEdit: {
          groups: [
            { name: 'g1', processDefinitions: [{ id: 'pId1' }, { id: 'pId2' }, { id: 'pId3' }] },
            { name: 'g2', processDefinitions: [] },
            { name: 'g3', processDefinitions: [{ id: 'pId4' }] },
          ] as any,
          ungrouped: [],
        },
      },
    );
  });
  it('getProcessGroupDataClean should set correct state', () => {
    expect(ProcessGroupsReducer({ ...initialState, groupData: {} } as any, getProcessGroupDataClean()))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: { groups: [], ungrouped: [] },
      });
  });
  it('saveProcessGroupDataSuccess should set correct state', () => {
    expect(ProcessGroupsReducer({ ...initialState, groupData: {} } as any, saveProcessGroupDataSuccess()))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: { groups: [], ungrouped: [] },
      });
  });
  it('cancelGroupDataEdit should set correct state', () => {
    expect(ProcessGroupsReducer({ ...initialState, groupDataEdit: {} } as any, cancelGroupDataEdit()))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: { groups: [], ungrouped: [] },
      });
  });
  it('groupActionNewGroup should set correct state', () => {
    expect(ProcessGroupsReducer(initialState, groupActionNewGroup('someGroupName')))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: { groups: [{ name: 'someGroupName', processDefinitions: [] }], ungrouped: [] },
      });
  });
  it('groupActionMoveGroupUp should move group up', () => {
    expect(ProcessGroupsReducer({
      ...initialState,
      groupDataEdit: {
        ungrouped: [],
        groups: [
          { name: 'group1', processDefinitions: [] },
          { name: 'group2', processDefinitions: [] },
        ],
      },
    }, groupActionMoveGroupUp('group2')))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: {
          groups: [
            { name: 'group2', processDefinitions: [] },
            { name: 'group1', processDefinitions: [] },
          ],
          ungrouped: [],
        },
      });
  });
  it('groupActionMoveGroupDown should move group up', () => {
    expect(ProcessGroupsReducer({
      ...initialState,
      groupDataEdit: {
        ungrouped: [],
        groups: [
          { name: 'group1', processDefinitions: [] },
          { name: 'group2', processDefinitions: [] },
        ],
      },
    }, groupActionMoveGroupDown('group1')))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: {
          groups: [
            { name: 'group2', processDefinitions: [] },
            { name: 'group1', processDefinitions: [] },
          ],
          ungrouped: [],
        },
      });
  });
  it('groupActionDeleteGroup should move group up', () => {
    expect(ProcessGroupsReducer({
      ...initialState,
      groupDataEdit: {
        ungrouped: [],
        groups: [
          { name: 'group1', processDefinitions: [] },
          { name: 'group2', processDefinitions: [] },
        ],
      },
    }, groupActionDeleteGroup('group1')))
      .toMatchObject({
        ...initialState,
        groupData: { groups: [], ungrouped: [] },
        groupDataEdit: {
          groups: [
            { name: 'group2', processDefinitions: [] },
          ],
          ungrouped: [],
        },
      });
  });
});
