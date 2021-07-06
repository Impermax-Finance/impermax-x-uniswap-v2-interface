
// ray test touch <
import clsx from 'clsx';

const tabs = [
  { name: 'My Account', href: '#', current: false },
  { name: 'Company', href: '#', current: false },
  { name: 'Team Members', href: '#', current: true },
  { name: 'Billing', href: '#', current: false }
];

const Tabs = (): JSX.Element => {
  return (
    <div>
      <div className='sm:hidden'>
        <label
          htmlFor='tabs'
          className='sr-only'>
          Select a tab
        </label>
        <select
          id='tabs'
          name='tabs'
          className={clsx(
            'block',
            'w-full',
            'focus:ring-indigo-500',
            'focus:border-indigo-500',
            'border-gray-300',
            'rounded-md'
          )}
          defaultValue={tabs.find(tab => tab.current)?.name}>
          {tabs.map(tab => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div
        className={clsx(
          'hidden',
          'sm:block'
        )}>
        <nav
          className={clsx(
            'flex',
            'space-x-4'
          )}
          aria-label='Tabs'>
          {tabs.map(tab => (
            <a
              key={tab.name}
              href={tab.href}
              className={clsx(
                tab.current ?
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
                )
              )}
              aria-current={tab.current ? 'page' : undefined}>
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
// ray test touch >
