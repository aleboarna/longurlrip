import { FC } from 'react';

export type SubmitButtonProps = {
  onClick: () => void;
};

const SubmitButton: FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <button
      className="w-full px-3 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
      onClick={onClick}
    >
      RIP
    </button>
  );
};

export default SubmitButton;
