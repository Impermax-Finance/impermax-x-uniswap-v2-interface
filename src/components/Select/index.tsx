
import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';
import {
  CheckIcon
} from '@heroicons/react/solid';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { SupportedChain } from 'types/web3/general.d';

type SelectLabelProps = Props<typeof Listbox.Label>;

const SelectLabel = ({
  className,
  ...rest
}: SelectLabelProps): JSX.Element => (
  <Listbox.Label
    className={clsx(
      'block',
      'text-sm',
      'font-medium',
      'text-gray-700',
      'mb-1',
      className
    )}
    {...rest} />
);

interface CustomSelectOptionsProps {
  open: boolean;
}

type SelectOptionsProps = CustomSelectOptionsProps & Props<typeof Listbox.Options>;
interface SelectOptionsPropsInterface extends SelectOptionsProps {
  SUPPORTED_CHAINS: SupportedChain[]
}

const SelectOptions = ({
  open,
  className,
  SUPPORTED_CHAINS
}: SelectOptionsPropsInterface): JSX.Element => (
  <Transition
    show={open}
    as={React.Fragment}
    leave={clsx(
      'transition',
      'ease-in',
      'duration-100'
    )}
    leaveFrom='opacity-100'
    leaveTo='opacity-0'>
    <Listbox.Options
      static
      className={clsx(
        'absolute',
        'z-impermaxSpeedDial',
        'mt-1',
        'w-full',
        'bg-white',
        'shadow-lg',
        'max-h-56',
        'rounded-md',
        'py-1',
        'text-base',
        'ring-1',
        'ring-black',
        'ring-opacity-5',
        'overflow-auto',
        'focus:outline-none',
        'sm:text-sm',
        className
      )}>
      {SUPPORTED_CHAINS.map(chain => (
        <Listbox.Option
          key={chain.id}
          value={chain}>
          {({
            selected,
            active
          }) => (
            <>
              <div
                className={clsx(
                  'flex',
                  'items-center',
                  'space-x-3'
                )}>
                <ImpermaxImage
                  src={chain.iconPath}
                  alt={chain.label}
                  className={clsx(
                    'flex-shrink-0',
                    'h-6',
                    'w-6',
                    'rounded-full'
                  )} />
                <SelectText selected={selected}>
                  {chain.label}
                </SelectText>
              </div>
              {selected ? (
                <SelectCheck active={active} />
              ) : null}
            </>
          )}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  </Transition>
);

const SelectBody = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    className={clsx(
      'relative',
      className
    )}
    {...rest} />
);

interface CustomSelectCheckProps {
  active: boolean;
}

const SelectCheck = ({
  active,
  className,
  ...rest
}: CustomSelectCheckProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      active ?
        'text-white' :
        'text-impermaxJade-600',
      'absolute',
      'inset-y-0',
      'right-0',
      'flex',
      'items-center',
      'pr-4',
      className
    )}
    {...rest}>
    <CheckIcon
      className={clsx(
        'h-5',
        'w-5'
      )}
      aria-hidden='true' />
  </span>
);

interface CustomSelectTextProps {
  selected?: boolean;
}

const SelectText = ({
  selected = false,
  className,
  ...rest
}: CustomSelectTextProps & React.ComponentPropsWithRef<'span'>): JSX.Element => (
  <span
    className={clsx(
      selected ?
        'font-semibold' :
        'font-normal',
      'block',
      'truncate',
      className
    )}
    {...rest} />
);

const Select = ({
  value,
  onChange,
  children
}: SelectProps): JSX.Element => {
  return (
    <Listbox
      value={value}
      onChange={onChange}>
      {children}
    </Listbox>
  );
};

export type SelectProps = Props<typeof Listbox>;

export {
  SelectLabel,
  SelectOptions,
  SelectBody,
  SelectCheck,
  SelectText
};

export default Select;
