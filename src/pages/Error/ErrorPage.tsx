import React from 'react';
import StandardLayout from 'components/Layouts/Standard';
import { defaultCriticalErrorProps } from 'constants/errorProps';

export default function ErrorPage() {
  return (
    <StandardLayout error={defaultCriticalErrorProps()} title="" />
  );
}
