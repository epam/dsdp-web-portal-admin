import React from 'react';

import StandardLayout from 'components/Layouts/Standard';
import { notFoundErrorProps } from 'constants/errorProps';

export default function NotFoundPage() {
  return (
    <StandardLayout error={notFoundErrorProps()} title="" />
  );
}
