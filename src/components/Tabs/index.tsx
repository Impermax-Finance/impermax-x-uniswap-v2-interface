
import clsx from 'clsx';

interface TabProps {
  index: number;
  selectedIndex: number;
  id: string;
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}

const Tab = ({
  index,
  selectedIndex,
  id,
  children,
  onSelect,
  className
}: TabProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect();
  };

  const selected = index === selectedIndex;

  return (
    <a
      id={id}
      className={clsx(
        selected ?
          clsx(
            'bg-gray-100',
            'text-gray-700'
          ) :
          clsx(
            'text-gray-500',
            'hover:text-gray-700'
          ),
        clsx(
          'px-3',
          'py-2',
          'font-medium',
          'text-sm',
          'rounded-md'
        ),
        className
      )}
      href={`#${id}`}
      role='tablist'
      data-toggle='tab'
      onClick={handleClick}>
      {children}
    </a>
  );
};

interface TabPanelProps {
  id: string;
  index: number;
  selectedIndex: number;
}

const TabPanel = ({
  id,
  index,
  selectedIndex,
  ...rest
}: TabPanelProps & React.ComponentPropsWithRef<'div'>): JSX.Element | null => {
  const selected = selectedIndex === index;
  if (!selected) return null;

  return (
    <div
      id={id}
      {...rest} />
  );
};

const Tabs = ({
  className,
  ...rest
}: TabsProps): JSX.Element => {
  return (
    <nav
      className={clsx(
        'flex',
        'space-x-4',
        className
      )}
      role='tablist'
      {...rest} />
  );
};

export type TabsProps = React.ComponentPropsWithRef<'nav'>;

export {
  Tab,
  TabPanel
};

export default Tabs;
