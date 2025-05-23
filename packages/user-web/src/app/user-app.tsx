import { Route, Routes } from 'react-router';
import { UserListPage } from '../user/user-list/user-list-page';
import { UserPage } from '../user/user-page/user-page';

export function UserApp() {
  return (
    <div className="gafe-user-app">
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserPage />} />
      </Routes>
    </div>
  );
}
