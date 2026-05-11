import RequestReset from '@/features/auth/forgot-password/components/RequestReset';
import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-1 flex-col gap-0 bg-white p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium text-dark">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-white">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full">
          <RequestReset />
        </div>
      </div>
    </div>
  );
};

export default page;
