'use client';
import { motion } from 'framer-motion';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Loading Card Component
const LoadingCard = () => (
  <motion.div variants={itemVariants}>
    <Card>
      <CardHeader className='space-y-4'>
        <Skeleton className='h-6 w-1/4' />
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-4 w-16' />
        </div>
        <Skeleton className='h-4 w-3/4' />
      </CardHeader>

      <CardContent>
        <Skeleton className='h-10 w-full' />
      </CardContent>

      <hr className='w-4/5 m-auto mb-4' />

      <CardFooter className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Skeleton className='h-4 w-1/2' />
        </div>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-5 rounded-full' />
          <Skeleton className='h-4 w-3/4' />
        </div>
      </CardFooter>
    </Card>
  </motion.div>
);

// Main Loading Component
export default function Loading() {
  return (
    <div className='container py-24 sm:py-32 mx-auto'>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='space-y-4'
      >
        <div className='flex justify-center space-x-2'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-32 bg-primary/20' />
          <Skeleton className='h-10 w-24' />
        </div>
        <Skeleton className='h-6 w-2/3 mx-auto' />
      </motion.div>

      {/* Cards Section */}
      <motion.div
        className='grid md:grid-cols-2 lg:grid-cols-2 gap-8 mx-auto w-full p-2 mt-8'
        variants={containerVariants}
        initial='hidden'
        animate='show'
      >
        <LoadingCard />
        <LoadingCard />
      </motion.div>
    </div>
  );
}
