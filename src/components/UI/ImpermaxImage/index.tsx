
const ImpermaxImage = ({
  alt,
  ...rest
}: React.ComponentPropsWithRef<'img'>): JSX.Element => (
  <img
    alt={alt}
    {...rest} />
);

export default ImpermaxImage;
