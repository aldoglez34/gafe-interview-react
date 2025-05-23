import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, useParams } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { User, UserType } from '../user.mjs';
import userService from './services/user.service';
import { UserPage } from './user-page';

vi.mock('react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('./services/user.service', () => ({
  default: { findById: vi.fn() },
}));

const mockedUseParams = useParams as Mock;
const mockedFindById = userService.findById as Mock;

const renderWithRouter = (ui: React.ReactNode) => {
  const history = createMemoryHistory();
  return render(
    <Router location={history.location} navigator={history}>
      {ui}
    </Router>,
  );
};

describe('UserPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('do not call findById if param is not a user id', () => {
    mockedUseParams.mockReturnValue({ id: 'new' });
    renderWithRouter(<UserPage />);

    expect(mockedFindById).not.toHaveBeenCalled();

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2.textContent).toBe('New User');
  });

  it('call findById if param is a user id', async () => {
    const mockUser: User = {
      _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      phoneNumber: '+1-214-555-7294',
      email: 'tom@email.fake',
      type: UserType.Admin,
    };

    mockedUseParams.mockReturnValue({ id: mockUser._id });
    mockedFindById.mockResolvedValue(mockUser);

    renderWithRouter(<UserPage />);

    await waitFor(() => {
      expect(mockedFindById).toHaveBeenCalledWith(mockUser._id);
    });
  });

  it('show Update User header if param is a user id', async () => {
    const mockUser: User = {
      _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      phoneNumber: '+1-214-555-7294',
      email: 'tom@email.fake',
      type: UserType.Admin,
    };

    mockedUseParams.mockReturnValue({ id: mockUser._id });
    mockedFindById.mockResolvedValue(mockUser);

    renderWithRouter(<UserPage />);

    await waitFor(() => {
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2.textContent).toBe('Update User');
    });
  });

  it('show New User header if param is not a user id', async () => {
    mockedUseParams.mockReturnValue({ id: 'new' });

    renderWithRouter(<UserPage />);

    await waitFor(() => {
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2.textContent).toBe('New User');
    });
  });
});
