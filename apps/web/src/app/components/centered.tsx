import { PropsWithChildren } from 'react';
import Header from './header';

const Centered = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
        {children}
      </div>
    </div>
  );
};

export default Centered;
