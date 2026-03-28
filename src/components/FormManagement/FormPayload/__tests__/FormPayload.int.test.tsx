import {
  describe, expect, it, beforeEach, vi,
} from 'vitest';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { portalRender, waitFor } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import { Formio } from '#web-components/exports/formio';
import { FormioModule } from '#web-components/components/Form';
import FormPayload from '../FormPayload';

Formio.use(FormioModule);

const FormWrapper = ({ children, initialValues }: { children: React.ReactNode; initialValues: any }) => {
  const methods = useForm({ defaultValues: initialValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Hidden Component Tests', () => {
  const preloadedState = getCommonReduxMockState({});

  beforeEach(() => {
    vi.resetModules();
  });

  it('should exclude all hidden fields with defaultValues from FormPayload', { timeout: 5000 }, async () => {
    const formSchema = {
      components: [
        {
          type: 'textfieldLatest',
          key: 'visibleTextField',
          label: 'Visible Text',
          input: true,
          hidden: false,
          defaultValue: 'visible text',
        },
        {
          type: 'textfieldLatest',
          key: 'hiddenTextField',
          label: 'Hidden Text',
          input: true,
          hidden: true,
          clearOnHide: true,
          defaultValue: 'hidden text',
        },
        {
          type: 'numberLatest',
          key: 'hiddenNumber',
          label: 'Hidden Number',
          input: true,
          hidden: true,
          clearOnHide: true,
          defaultValue: 99,
        },
        {
          type: 'selectLatest',
          key: 'hiddenSelect',
          label: 'Hidden Select',
          input: true,
          hidden: true,
          clearOnHide: true,
          defaultValue: { value: 'default', label: 'Default' },
          dataSrc: 'values',
          data: { values: [{ label: 'Default', value: 'default' }] },
        },
        {
          type: 'emailLatest',
          key: 'hiddenEmail',
          label: 'Hidden Email',
          input: true,
          hidden: true,
          clearOnHide: true,
          defaultValue: 'hidden@example.com',
        },
      ],
    };

    const formPayload = {
      data: {
        visibleTextField: 'initial visible value',
      },
    };

    portalRender(
      <FormWrapper initialValues={{ formSchema, formPayload, jsonSchemeIsInValid: false }}>
        <FormPayload />
      </FormWrapper>,
      { preloadedState },
    );

    await waitFor(async () => {
      const el: HTMLTextAreaElement | null = document.querySelector('textarea[name="payload"]');
      expect(el).toBeTruthy();

      if (!el) {
        return;
      }

      const rawValue = el.value;
      expect(rawValue).toBeTruthy();

      expect(rawValue).toMatch(/"visibleTextField":/);
      expect(rawValue).not.toMatch(/"hiddenTextField":/);
      expect(rawValue).not.toMatch(/"hiddenNumber":/);
      expect(rawValue).not.toMatch(/"hiddenSelect":/);
      expect(rawValue).not.toMatch(/"hiddenEmail":/);
    }, { timeout: 2500 });
  });

  it('should exclude conditionally hidden fields', { timeout: 5000 }, async () => {
    const formSchema = {
      components: [
        {
          type: 'textfieldLatest',
          key: 'toggleField',
          label: 'Toggle Field',
          input: true,
          hidden: false,
          defaultValue: 'hide',
        },
        {
          type: 'textfieldLatest',
          key: 'conditionalField',
          label: 'Conditional Field',
          input: true,
          hidden: false,
          clearOnHide: true,
          defaultValue: 'conditional value',
          conditional: {
            show: false,
            when: 'toggleField',
            eq: 'hide',
          },
        },
      ],
    };

    const formPayload = {
      data: {
        toggleField: 'hide',
      },
    };

    portalRender(
      <FormWrapper initialValues={{ formSchema, formPayload, jsonSchemeIsInValid: false }}>
        <FormPayload />
      </FormWrapper>,
      { preloadedState },
    );

    await waitFor(async () => {
      const el: HTMLTextAreaElement | null = document.querySelector('textarea[name="payload"]');
      expect(el).toBeTruthy();

      if (!el) {
        return;
      }

      const rawValue = el.value;
      expect(rawValue).toBeTruthy();
      expect(rawValue).toMatch(/"toggleField":/);
      expect(rawValue).toMatch(/"hide"/);
      expect(rawValue).not.toMatch(/"conditionalField":/);
    }, { timeout: 2500 });
  });
});
