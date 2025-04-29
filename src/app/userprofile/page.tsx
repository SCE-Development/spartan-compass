import React from 'react';
import UserInfo from './userInfo';
import { getCurrentSession } from '@/lib/db/session';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Spartan Compass | User Profile",
};

export default async function UserProfile() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect('/login');
  }

  return (
    <div className='px-60 pt-10 flex justify-center '>
      <div className='w-[100%] lg:w-[60%] space-y-20'>
      <p className='text-3xl font-bold font-sans'>Hey, SCE</p>
      <div className=' w-[100%]  border-spacing-y-96 border h-[50dvh] flex flex-col border-none  '>
        <div className=' h-[10%] border-b-[1px] dark:border-b-slate-100 border-b-black flex flex-rows '>
          <div className={`h-ful  cursor-pointer flex px-0 py-3  mr-12 font-bold dark:border-b-white border-b-black border-b-2`} >
            Profile
          </div>  
        </div>
        <UserInfo user={user?.name}/>
      </div>
      </div>
    </div>
  );
}


