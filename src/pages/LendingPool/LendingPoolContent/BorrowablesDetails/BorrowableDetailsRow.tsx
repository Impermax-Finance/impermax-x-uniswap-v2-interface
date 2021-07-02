
interface RowProps {
  name: string;
  value: string;
}

export default function BorrowableDetailsRow({ name, value }: RowProps): JSX.Element {
  return (
    <tr>
      <td>{name}</td>
      <td className='text-right'>{value}</td>
    </tr>
  );
}
