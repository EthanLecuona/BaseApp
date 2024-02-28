import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className='h-screen bg-muted overflow-hidden pt-[67px]'>{children}</div>;
};

export default AuthLayout;