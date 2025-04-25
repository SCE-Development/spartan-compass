'use client'
import {useState} from 'react';
import { PencilIcon } from 'lucide-react';
import { Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface UserInfoProps {
  user: string
}
const UserInfo:React.FC<UserInfoProps> = ({user}) => {
  const [newUserName, setnewUserName] = useState('');
  const [inEditMode, setInEditMode] = useState(false);
  const [username, setUsername] = useState(user)

  const handleUpdateName = async () => {
    const response = await fetch('/api/session/update', {
      method: 'PUT',
      body: JSON.stringify({name: newUserName}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      setInEditMode(false)
      setUsername(newUserName)
      setnewUserName('')
    }
  }
  return (
    <div className='h-[90%] pt-10'>
          <div className='flex justify-end space-x-4  items-center'>
              <PencilIcon  className='dark:text-white text-black' size={24} onClick={() => setInEditMode(true)}/>
              <Button variant={'link'} className='text-dark hover:no-underline h-0 w-0 font-[700] ' onClick={() => setInEditMode(true)}>Edit</Button>
          </div> 

          <div className='flex flex-col lg:flex-row h-auto text-left w-full items-start lg:gap-x-44  2xl:gap-x-36 mt-12  '>    
            <div className='w-1/6 '>
              <Label className='text-base text-left whitespace-nowrap font-[700]'>Name</Label>
            </div>
            {inEditMode ? <div className='flex flex-col w-full space-y-20'>
      <Input type='text'  placeholder={username}  onChange={(e) => setnewUserName(e.target.value)}/>
      <Button className='h-14 w-64 bg-black  cursor-pointer font-bold self-center text-white rounded-full dark:text-black dark:bg-white' onClick={handleUpdateName}>
        Save Change
      </Button>
      <Button variant={'link'} className='font-bold  text-black hover:no-underline dark:text-white' onClick={() => setInEditMode(false)}>
        Cancel
      </Button>
      
    </div> : <div className='w-auto'>
              <p className='text-base font-light'>{username}</p>
            </div>}

          </div>
        </div>
  )

}

export default UserInfo;