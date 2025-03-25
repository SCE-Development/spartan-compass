import {useState, useEffect} from 'react';
import { PencilIcon } from 'lucide-react';
const UserInfo = () => {
  const [userSession, setUserSession] = useState<any>(null);
  const [inEditMode, setInEditMode] = useState(false);
  useEffect(() => {
    fetch('/api/session/validate')
    .then(res => res.json())
    .then(data => {
      
      setUserSession(data?.user)})
  },[])
  return (
    <div className='h-[90%] pt-10'>
          <div className='flex justify-end space-x-4'>
              <PencilIcon color='black' className='cursor-pointer' size={24} onClick={() => setInEditMode(true)}/>
              <p className='font-[700] text-sm cursor-pointer' onClick={() => setInEditMode(true)}>Edit</p>
          </div> 

          <div className='flex flex-col lg:flex-row h-auto text-left w-full items-start lg:gap-x-44  2xl:gap-x-36 mt-12  '>    
            <div className='w-1/6 '>
              <label className='text-base text-left whitespace-nowrap font-[700]'>Name</label>
            </div>
            {inEditMode ? <div className='flex flex-col w-full space-y-20'>
      <input type='text' placeholder={userSession && userSession.name} className='w-full h-12 pl-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-black'>

      </input>

      <button className='text-md h-14 w-64 bg-black  cursor-pointer font-bold text-center outline-none self-center text-white rounded-full  '>
        Save Change
      </button>
      
      <button className='bg-none border-none cursor-pointer inline-block font-bold outline-none text-md mt-3 ' onClick={() => setInEditMode(false)}>
        Cancel
      </button>

    </div> : <div className='w-auto'>
              <p className='text-base font-light'>{userSession && userSession.name}</p>
            </div>}





          </div>
          {/* <div className='flex flex-col lg:flex-row h-auto text-left w-full items-start lg:gap-x-44  2xl:gap-x-36 mt-12 '>
            <div className='w-1/6'>
              <label className='text-base text-left whitespace-nowrap font-[700]'>Google Id</label>
            </div>
            <div className='w-auto'>
              <p className='text-base font-light'>{userSession && userSession.googleId}</p>
            </div>
          </div> */}
          
        </div>
  )

}

export default UserInfo;