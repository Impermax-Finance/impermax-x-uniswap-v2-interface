
import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import clsx from 'clsx';

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

type SelectButtonProps = Props<typeof Listbox.Button>;

const SelectButton = ({
  className,
  ...rest
}: SelectButtonProps): JSX.Element => (
  <Listbox.Button
    className={clsx(
      'focus:outline-none',
      'focus:ring',
      'focus:border-primary-300',
      'focus:ring-primary-200',
      'focus:ring-opacity-50',

      'relative',
      'w-full',
      'bg-white',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'pl-3',
      'pr-10',
      'py-2',
      'text-left',
      'cursor-default',
      'sm:text-sm',
      className
    )}
    {...rest} />
);

interface CustomSelectOptionsProps {
  open: boolean;
}

type SelectOptionsProps = CustomSelectOptionsProps & Props<typeof Listbox.Options>;

const SelectOptions = ({
  open,
  className,
  ...rest
}: SelectOptionsProps): JSX.Element => (
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
      )}
      {...rest} />
  </Transition>
);

type SelectOptionProps = Props<typeof Listbox.Option>;

const SelectOption = ({
  value,
  className,
  ...rest
}: SelectOptionProps): JSX.Element => (
  <Listbox.Option
    className={({ active }) =>
      clsx(
        active ?
          clsx(
            'text-white',
            'bg-indigo-600'
          ) :
          'text-gray-900',
        'cursor-default',
        'select-none',
        'relative',
        'py-2',
        'pl-3',
        'pr-9',
        className
      )
    }
    value={value}
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
  SelectButton,
  SelectOptions,
  SelectOption
};

export default Select;
