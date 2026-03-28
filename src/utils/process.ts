import BpmnModdle from 'bpmn-moddle';
import BpmModeler from 'bpmn-js/dist/bpmn-modeler.production.min';
import { bpNamePattern } from 'constants/validationRules';

export async function getProcessNodeFromXml(xmlString: string): Promise<Element> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  const processNode = doc.getElementsByTagName('bpmn:process')[0];

  return new Promise((resolve, reject) => {
    if (errorNode) {
      reject(new Error('Invalid xml'));
    } else {
      resolve(processNode);
    }
  });
}

export async function getProcessObj(xmlString: string): Promise<{ name: string, id: string }> {
  const processNode = await getProcessNodeFromXml(xmlString);
  const id = processNode.getAttribute('id') ?? '';
  const name = processNode.getAttribute('name') ?? '';
  return { id, name };
}

export async function validateXmlString(xmlString: string) {
  const moddle = new BpmnModdle();
  const { rootElement: { rootElements } } = await moddle.fromXML(xmlString);
  if (!rootElements) {
    throw new Error('Invalid xml');
  }
}

export async function setProcessAttributes(xmlString: string, attr: string, value: string): Promise<string> {
  try {
    // We will use modeler to update all references of the attribute and not just single instance
    const modeler = new BpmModeler();
    await modeler.importXML(xmlString);

    // here we retrieve services from BpmModeler's DI used to find and update the attribute
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    const { id } = await getProcessObj(xmlString);
    const processElement = elementRegistry.get(id);
    const isValidValue = attr === 'id' ? bpNamePattern.test(value) : true;
    if (!isValidValue) {
      return xmlString;
    }

    if (processElement) {
      // if element is found in root that means we can update it right away using modeling service
      modeling.updateProperties(processElement, {
        [attr]: value,
      });
    } else {
      // if not then it means the process is wrapped in something
      // right now we assume it can only be wrapped in participant:
      const participant = elementRegistry.find((el: { type: string }) => el.type.toLowerCase() === 'bpmn:participant');
      const { processRef } = participant.businessObject;
      processRef[attr] = value;
    }
    const { xml } = await modeler.saveXML({ format: true });
    return xml;
  } catch {
    return xmlString;
  }
}

export async function createProcessString(name: string, id: string) {
  const modeler = new BpmModeler();
  const moddle = new BpmnModdle();
  return new Promise<string>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modeler.on('import.parse.complete', async (data: any) => {
      try {
        data.definitions.rootElements[0].set('name', name);
        data.definitions.rootElements[0].set('id', id);
        data.definitions.rootElements[0].set('isExecutable', true);
        const { xml } = await moddle.toXML(data.definitions, { format: true });
        resolve(xml);
      } catch {
        resolve('');
      }
    });
    modeler.createDiagram().catch(() => undefined);
  });
}
