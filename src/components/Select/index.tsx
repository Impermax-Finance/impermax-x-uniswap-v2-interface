
// ray test touch <<
import * as React from 'react';
import {
  Listbox,
  Transition
} from '@headlessui/react';
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

const Select = (): JSX.Element => {
  const [selected, setSelected] = React.useState(people[3]);

  return (
    <Listbox
      value={selected}
      onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label
            className={clsx(
              'block',
              'text-sm',
              'font-medium',
              'text-gray-700'
            )}>
            Assigned to
          </Listbox.Label>
          <div
            className={clsx(
              'mt-1',
              'relative'
            )}>
            <Listbox.Button
              className={clsx(
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
                'focus:outline-none',
                'focus:ring-1',
                'focus:ring-indigo-500',
                'focus:border-indigo-500',
                'sm:text-sm'
              )}>
              <span
                className={clsx(
                  'flex',
                  'items-center'
                )}>
                <img
                  src={selected.avatar}
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
                  {selected.name}
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
            </Listbox.Button>
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
                  'z-10',
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
                  'sm:text-sm'
                )}>
                {people.map(person => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      clsx(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default',
                        'select-none',
                        'relative',
                        'py-2',
                        'pl-3',
                        'pr-9'
                      )
                    }
                    value={person}>
                    {({ selected, active }) => (
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
                              selected ? 'font-semibold' : 'font-normal',
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
                              active ? 'text-white' : 'text-indigo-600',
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
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default Select;
// ray test touch >>
