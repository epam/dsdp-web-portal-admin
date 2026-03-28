import React from 'react';
import ErrorLayout from 'components/Layouts/Error';
import { forbiddenErrorProps } from 'constants/errorProps';

export default function Forbidden() {
  return (
    <ErrorLayout error={forbiddenErrorProps()} />
  );
}
