export const dynamic = 'force-static';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'About',
  description: 'About page of My Space',
};

export default async function About() {
    return (
        <div className='mt-[67px]'>
          <h1>About</h1>
          <p>We are a social media company!</p>
        </div>

    );
}
  