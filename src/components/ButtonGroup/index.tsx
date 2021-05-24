
// ray test touch <
import clsx from 'clsx';

const ButtonGroup = (): JSX.Element => (
  <span className='relative z-0 inline-flex shadow-sm rounded-md'>
    <button
      type='button'
      className={clsx(
        'relative',
        'inline-flex',
        'items-center',
        'px-4',
        'py-2',
        'rounded-l-md',
        'border',
        'border-gray-300',
        'bg-white',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'hover:bg-gray-50',
        'focus:z-10',
        'focus:outline-none',
        'focus:ring-1',
        'focus:ring-indigo-500',
        'focus:border-indigo-500'
      )}>
      Years
    </button>
    <button
      type='button'
      className={clsx(
        '-ml-px',
        'relative',
        'inline-flex',
        'items-center',
        'px-4',
        'py-2',
        'border',
        'border-gray-300',
        'bg-white',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'hover:bg-gray-50',
        'focus:z-10',
        'focus:outline-none',
        'focus:ring-1',
        'focus:ring-indigo-500',
        'focus:border-indigo-500'
      )}>
      Months
    </button>
    <button
      type='button'
      className={clsx(
        '-ml-px',
        'relative',
        'inline-flex',
        'items-center',
        'px-4',
        'py-2',
        'rounded-r-md',
        'border',
        'border-gray-300',
        'bg-white',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'hover:bg-gray-50',
        'focus:z-10',
        'focus:outline-none',
        'focus:ring-1',
        'focus:ring-indigo-500',
        'focus:border-indigo-500'
      )}>
      Days
    </button>
  </span>
);

export default ButtonGroup;
// ray test touch >
