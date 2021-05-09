import './index.scss';
import QuestionHelper from '../QuestionHelper';

interface DetailsRowProps {
  name: string;
  value?: string;
  explanation?: string
  children?: any;
}

interface DetailsRowCustomProps {
  children: any;
}

export function DetailsRowCustom({ children }: DetailsRowCustomProps): JSX.Element {
  return (
    <div className='details-row'>{children}</div>
  );
}

/**
 * Build account lending pool detail rows for LP token currencies.
 * @params AccountLendingPoolDetailsRowProps
 */

export default function DetailsRow({ name, value, explanation, children }: DetailsRowProps): JSX.Element {
  return (
    <div className='details-row'>
      <div className='name'>
        {name}
        {explanation ? (
          <QuestionHelper text={explanation} />
        ) : null}
      </div>
      <div className='value'>{value}{children}</div>
    </div>
  );
}
