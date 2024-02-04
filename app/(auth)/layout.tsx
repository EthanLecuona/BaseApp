import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className='h-[844px] bg-muted overflow-hidden'>{children}</div>;
};

export default AuthLayout;