import { Listbox } from '@headlessui/react';
import {
  useParams,
  useHistory
} from 'react-router-dom';
import clsx from 'clsx';

import { SelectorIcon } from '@heroicons/react/solid';
import {
  SelectOptions,
  SelectBody,
  SelectText
} from 'components/Select';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { SUPPORTED_CHAINS } from 'config/web3/chains';
import { PARAMETERS } from 'utils/constants/links';
import { SupportedChain } from 'types/web3/general.d';

interface Props {
  routeLink: string;
}

const ChainSelect = ({
  routeLink
}: Props): JSX.Element => {
  const { [PARAMETERS.CHAIN_ID]: selectedChainIDParam } = useParams<Record<string, string>>();
  const value = SUPPORTED_CHAINS.find(supportedChain => supportedChain.id === Number(selectedChainIDParam));

  if (!value) {
    throw new Error('Something went wrong!');
  }
  if (!routeLink.includes(PARAMETERS.CHAIN_ID)) {
    throw new Error('Invalid router link!');
  }

  const history = useHistory();
  const handleChange = (newValue: SupportedChain) => {
    history.push({
      ...history.location,
      pathname: routeLink.replace(`:${PARAMETERS.CHAIN_ID}`, newValue.id.toString())
    });
  };

  return (
    <Listbox
      value={value}
      onChange={handleChange}>
      {({ open }) => (
        <SelectBody
          style={{
            minWidth: 240
          }}>
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
              'sm:text-sm'
            )}>
            <span
              className={clsx(
                'flex',
                'items-center',
                'space-x-3'
              )}>
              <ImpermaxImage
                src={value.iconPath}
                alt={value.label}
                className={clsx(
                  'flex-shrink-0',
                  'h-6',
                  'w-6',
                  'rounded-full'
                )} />
              <SelectText>
                {value.label}
              </SelectText>
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
          <SelectOptions
            open={open}
            SUPPORTED_CHAINS={SUPPORTED_CHAINS} />
        </SelectBody>
      )}
    </Listbox>
  );
};

export default ChainSelect;
