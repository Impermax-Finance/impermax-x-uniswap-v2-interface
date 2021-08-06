
// ray test touch <<
import clsx from 'clsx';

import Select, {
  SelectButton,
  SelectOptions,
  SelectOption,
  SelectBody,
  SelectCheck,
  SelectText
} from 'components/Select';
import ImpermaxImage from 'components/UI/ImpermaxImage';
import { SUPPORTED_CHAINS } from 'config/web3/chains';
import { SupportedChain } from 'types/web3/general.d';

interface Props {
  value: SupportedChain;
  onChange: (newValue: SupportedChain) => void;
}

const ChainSelect = ({
  value,
  onChange
}: Props): JSX.Element => (
  <Select
    value={value}
    onChange={onChange}>
    {({ open }) => (
      <SelectBody
        style={{
          minWidth: 240
        }}>
        <SelectButton>
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
        </SelectButton>
        <SelectOptions open={open}>
          {SUPPORTED_CHAINS.map(chain => (
            <SelectOption
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
            </SelectOption>
          ))}
        </SelectOptions>
      </SelectBody>
    )}
  </Select>
);

export default ChainSelect;
// ray test touch >>
