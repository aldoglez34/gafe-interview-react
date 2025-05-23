import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { User } from '../user.mjs';
import { UserForm } from './components/UserForm';
import userService from './services/user.service';

export function UserPage() {
  const [user, setUser] = useState<User>();

  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id || id === 'new') return;
      try {
        const userRes = await userService.findById(id);
        setUser(userRes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>{user ? 'Update User' : 'New User'}</h2>
      <UserForm key={`userForm-${user?._id}`} {...{ user }} />
    </div>
  );
}
