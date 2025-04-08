import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

import Landing from '@/components/landing-page';

import { authOptions } from './(auth)/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/new');
  return <Landing />;
}
