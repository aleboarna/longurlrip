import { ChangeEvent, FC } from 'react';

export type InputFieldProps = {
  readonly value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const InputField: FC<InputFieldProps> = ({ value, onChange }) => {
  return (
    <input
      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
      type="text"
      placeholder="Enter long url..."
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;
