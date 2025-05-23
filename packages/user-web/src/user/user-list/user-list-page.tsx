import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import userService from '../user-page/services/user.service';
import { User } from '../user.mjs';
import styles from './user-list-page.module.css';

export function UserListPage() {
  const [users, setUsers] = useState<User[]>();

  const navigate = useNavigate();

  const handleCreateUser = () => navigate('/users/new');
  const handleEditUser = (id: string) => navigate(`/users/${id}`);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.find();
        setUsers(res);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={styles['user-list-page']}>
      <h2>Users</h2>
      <button onClick={handleCreateUser}>Create New User</button>
      {users?.length && (
        <table>
          <thead>
            <tr>
              <th data-col="first-name">First Name</th>
              <th data-col="last-name">Last Name</th>
              <th data-col="phone-number">Phone Number</th>
              <th data-col="email">Email</th>
              <th data-col="type">Type</th>
              <th data-col="actions"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user._id} data-row={user._id}>
                <td data-col="first-name">{user.firstName}</td>
                <td data-col="last-name">{user.lastName}</td>
                <td data-col="phone-number">{user.phoneNumber}</td>
                <td data-col="email">{user.email}</td>
                <td data-col="type">{user.type}</td>
                <td data-col="actions">
                  <button onClick={() => handleEditUser(user._id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
