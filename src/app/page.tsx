import { redirect } from 'next/navigation';
import React from 'react';

import { getAuthenticatedUser } from '@/actions/misc';
import Landing from '@/components/landing-page';

export default async function Home() {
  const user = await getAuthenticatedUser();
  if (user) redirect('/new');
  return <Landing />;
}
