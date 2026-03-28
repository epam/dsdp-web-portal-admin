import React from 'react';
import get from 'lodash/get';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import { getProcessByNameRequest } from 'store/process';
import {
  portalRender,
  act,
  screen,
} from '#shared/utils/testUtils';

import EditProcessPage from '../EditProcessPage';

const mockState = getCommonReduxMockState({
  process: {},
});

const mockProcessTitle = 'Test Name';
const mockProcessName = 'test-bp42';
const mockProcessXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
<bpmn:process id="${mockProcessName}" name="${mockProcessTitle}" isExecutable="false"><bpmn:startEvent id="Start" />
</bpmn:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="nikita-bp42">
<bpmndi:BPMNShape id="StartEvent_2" bpmnElement="Start"><dc:Bounds x="173" y="102" width="36" height="36" />
</bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

describe('EditProcessPage', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();
      portalRender(<EditProcessPage />, { preloadedState: mockState, dispatchMock });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: getProcessByNameRequest.type,
      }));
    });

    it('should fill inputs with data', async () => {
      const dispatchMock = vi.fn();

      await act(async () => {
        portalRender(<EditProcessPage />, {
          preloadedState: getCommonReduxMockState({
            process: {
              process: mockProcessXml,
            },
          }),
          dispatchMock,
        });
      });
      const inputs = screen.queryAllByRole('textbox');
      const titleInput = inputs.find((input) => get(input, 'name', '') === 'title');

      expect(titleInput).toHaveValue('Test Name');
    });
  });
});
