import { FormComponent } from '#web-components/components/Form/types';
import { createFieldCopy, formatFormForExport, removeCustomClass } from '../form';

describe('form utils', () => {
  describe('createFieldCopy', () => {
    it('should add _copy to field value', () => {
      expect(createFieldCopy('Test')).toEqual('Copy_Test');
    });

    it('should return empty string on no value', () => {
      expect(createFieldCopy('')).toEqual('');
    });
  });

  describe('formatFormForExport', () => {
    it('should leave only required fields', () => {
      const form = {
        components: [],
        title: '',
        path: '',
        name: '',
        owner: '',
        access: [],
        _id: '',
      };

      expect(formatFormForExport(form)).toEqual({
        components: [],
        title: '',
        path: '',
        name: '',
      });
    });
  });

  describe('removeCustomClass', () => {
    it('should remove customClass from Latest components', () => {
      const oldComponent = {
        customClass: 'bootstrapFormStyles',
        type: 'email',
      } as unknown as FormComponent;
      const latestComponent = {
        customClass: 'bootstrapFormStyles',
        type: 'numberLatest',
      } as unknown as FormComponent;
      const components = [oldComponent, latestComponent];

      expect(removeCustomClass(components)).toEqual([{
        customClass: '',
        type: 'email',
      },
      {
        customClass: '',
        type: 'numberLatest',
      },
      ]);
    });
  });
});
