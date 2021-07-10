
import * as React from 'react';

import ImpermaxImage, { Props as ImpermaxImageProps } from 'components/UI/ImpermaxImage';

interface CustomProps {
  images:
    Array<{
      type: string;
      path: string;
    }>
}

const ImpermaxPicture = ({
  images,
  ...rest
}: CustomProps & Omit<ImpermaxImageProps, 'src'>): JSX.Element => (
  <picture>
    {images.map((image, index) => {
      return (
        <React.Fragment key={image.path}>
          {images.length - 1 === index ? (
            <ImpermaxImage
              width={64}
              height={64}
              src={image.path}
              {...rest} />
          ) : (
            <source
              type={image.type}
              srcSet={image.path} />
          )}
        </React.Fragment>
      );
    })}
  </picture>
);

export default ImpermaxPicture;
