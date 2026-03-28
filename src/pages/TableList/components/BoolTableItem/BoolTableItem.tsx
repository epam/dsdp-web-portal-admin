import React from 'react';
import { DoneIcon } from '#web-components/components/Icons';

type BoolTableItemProps = {
  value: boolean,
};

export default function BoolTableItem({ value }: BoolTableItemProps) {
  if (value) {
    return <DoneIcon />;
  }
  return <span>-</span>;
}
