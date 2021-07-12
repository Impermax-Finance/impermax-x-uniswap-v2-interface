
import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
import { Props } from '@headlessui/react/dist/types';
import {
  CheckIcon,
  SelectorIcon
} from '@heroicons/react/solid';
import clsx from 'clsx';

const people = [
  {
    id: 1,
    name: 'Wade Cooper',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Arlene Mccoy',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 3,
    name: 'Devon Webb',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
  },
  {
    id: 4,
    name: 'Tom Cook',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 5,
    name: 'Tanya Fox',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 6,
    name: 'Hellen Schmidt',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 7,
    name: 'Caroline Schultz',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 8,
    name: 'Mason Heaney',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 9,
    name: 'Claudie Smitham',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 10,
    name: 'Emil Schaefer',
    avatar:
      // eslint-disable-next-line max-len
      'https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

type SelectLabelProps = Props<typeof Listbox.Label>;

const SelectLabel = ({
  className,
  ...rest
}: SelectLabelProps) => (
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
}: SelectButtonProps) => (
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
}: SelectOptionsProps) => (
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
}: SelectOptionProps) => (
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
  onChange
}: SelectProps): JSX.Element => {
  return (
    <Listbox
      value={value}
      onChange={onChange}>
      {({ open }) => (
        <>
          <SelectLabel>
            Assigned to
          </SelectLabel>
          <div className='relative'>
            <SelectButton>
              <span
                className={clsx(
                  'flex',
                  'items-center'
                )}>
                <img
                  src={value.avatar}
                  alt=''
                  className={clsx(
                    'flex-shrink-0',
                    'h-6',
                    'w-6',
                    'rounded-full'
                  )} />
                <span
                  className={clsx(
                    'ml-3',
                    'block',
                    'truncate'
                  )}>
                  {value.name}
                </span>
              </span>
              <span
                className={clsx(
                  'ml-3',
                  'absolute',
                  'inset-y-0',
                  'right-0',
                  'flex',
                  'items-center',
                  'pr-2',
                  'pointer-events-none'
                )}>
                <SelectorIcon
                  className={clsx(
                    'h-5',
                    'w-5',
                    'text-gray-400'
                  )}
                  aria-hidden='true' />
              </span>
            </SelectButton>
            <SelectOptions open={open}>
              {people.map(person => (
                <SelectOption
                  key={person.id}
                  value={person}>
                  {({
                    selected,
                    active
                  }) => (
                    <>
                      <div
                        className={clsx(
                          'flex',
                          'items-center'
                        )}>
                        <img
                          src={person.avatar}
                          alt=''
                          className={clsx(
                            'flex-shrink-0',
                            'h-6',
                            'w-6',
                            'rounded-full'
                          )} />
                        <span
                          className={clsx(
                            selected ?
                              'font-semibold' :
                              'font-normal',
                            'ml-3',
                            'block',
                            'truncate'
                          )}>
                          {person.name}
                        </span>
                      </div>
                      {selected ? (
                        <span
                          className={clsx(
                            active ?
                              'text-white' :
                              'text-indigo-600',
                            'absolute',
                            'inset-y-0',
                            'right-0',
                            'flex',
                            'items-center',
                            'pr-4'
                          )}>
                          <CheckIcon
                            className='h-5 w-5'
                            aria-hidden='true' />
                        </span>
                      ) : null}
                    </>
                  )}
                </SelectOption>
              ))}
            </SelectOptions>
          </div>
        </>
      )}
    </Listbox>
  );
};

export type SelectProps = Props<typeof Listbox>;

export default Select;
