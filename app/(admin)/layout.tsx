import { FC, ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AdminLayoutProps> = ({ children }) => {
  return <div className='overflow-hidden'>{children}</div>;
};

export default AuthLayout;