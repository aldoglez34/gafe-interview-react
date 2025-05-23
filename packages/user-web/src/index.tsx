import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserApp } from './app/user-app';
import { LS_INITIAL_USERS, LS_USERS_KEY } from './user/user-page/utils/constants';

if (!localStorage.getItem(LS_USERS_KEY)) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(LS_INITIAL_USERS));
}

const container = createRoot(document.getElementById('user-app')!);

container.render(
  <StrictMode>
    <BrowserRouter>
      <UserApp />
    </BrowserRouter>
  </StrictMode>,
);
