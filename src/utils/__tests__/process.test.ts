import { describe, expect, it } from 'vitest';
import {
  getProcessObj,
  setProcessAttributes,
  validateXmlString,
} from 'utils/process';

describe('process utils', () => {
  const testProcessId = 'testProcessId';
  const validProcessXml = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:modeler="http://camunda.org/schema/modeler/1.0"
    id="Definitions_07vhrbl"
    targetNamespace="http://bpmn.io/schema/bpmn"
    exporter="Camunda Modeler"
    exporterVersion="4.9.0"
    modeler:executionPlatform="Camunda Platform"
    modeler:executionPlatformVersion="7.15.0"
  >
    <bpmn:process id="${testProcessId}" isExecutable="true" name="someName" />
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${testProcessId}" />
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>
  `;
  const getProcessStringWithId = (id: string) => {
    return validProcessXml.replace(testProcessId, id);
  };

  it('getProcessObj should return valid process object', async () => {
    expect.assertions(1);
    const processObj = await getProcessObj(validProcessXml);
    expect(processObj.id).toEqual(testProcessId);
  });
  it('validateXmlString should throw an error if xml is not valid', async () => {
    expect.assertions(1);
    const invalidXml = getProcessStringWithId('1111');
    try {
      await validateXmlString(invalidXml);
    } catch (error: any) {
      expect(error.message).toBe('Invalid xml');
    }
  });
  // issue with mocking svg methods that used in modeler
  it.skip('setProcessAttributes should set attributes and return new string', async () => {
    expect.assertions(1);
    const xmlString = await setProcessAttributes(validProcessXml, 'id', 'someNewId');
    expect(xmlString).toContain('id="someNewId"');
  });
  it('setProcessAttributes should return old process string if wrong attributes have been set', async () => {
    expect.assertions(1);
    const xmlString = await setProcessAttributes(validProcessXml, 'id', '11111');
    expect(xmlString).toContain(`id="${testProcessId}"`);
  });
});
