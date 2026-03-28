import React, { useState, useCallback } from 'react';
import SvgUrlImage from '#web-components/components/SvgUrlImage';
import WebComponentLoader from '#web-components/components/Loader';

interface LoaderProps {
  className?: string;
  show?: boolean;
  description?: string;
  'data-xpath'?: string;
}

export default function Loader({
  className, show, description, 'data-xpath': dataXPath = 'component-loader',
}: LoaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <WebComponentLoader
      show={show}
      showLoaderContent={imageLoaded}
      className={className}
      description={description}
      data-xpath={dataXPath}
      loaderIcon={<SvgUrlImage url={`${import.meta.env.BASE_URL}/logos/loader-logo.svg`} onLoad={handleImageLoad} />}
    />
  );
}
