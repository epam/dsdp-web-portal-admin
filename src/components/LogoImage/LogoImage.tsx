import React from 'react';
import SvgUrlImage from '#web-components/components/SvgUrlImage';

export default function LogoImage() {
  return (
    <SvgUrlImage url={`${import.meta.env.BASE_URL}/logos/header-logo.svg`} />
  );
}
