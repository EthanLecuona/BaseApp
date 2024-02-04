import { FC, ReactNode } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

interface GitHubSignInButtonProps {
  children: ReactNode;
}

const GitHubSignInButton: FC<GitHubSignInButtonProps> = ({ children }) => {
  const loginWithGitHub = () => {
    signIn('github', { callbackUrl: '/' });
  };

  return (
    <Button onClick={loginWithGitHub} className='w-full my=1'>
      {children}
    </Button>
  );
};

export default GitHubSignInButton;