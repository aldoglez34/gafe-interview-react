import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { User, UserType } from '../../user.mjs';
import userService from '../services/user.service';
import { UserForm } from './UserForm';

const navigateMock = vi.fn();
vi.mock('react-router', async importOrig => {
  const actual = await importOrig<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../services/user.service', () => ({
  default: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

describe('<UserForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('enable submit button once all required fields are filled', async () => {
    render(<UserForm />);

    const firstName = screen.getByLabelText('First Name*') as HTMLInputElement;
    const lastName = screen.getByLabelText('Last Name*') as HTMLInputElement;
    const email = screen.getByLabelText('Email*') as HTMLInputElement;
    const type = screen.getByLabelText('Type*') as HTMLSelectElement;
    const submitBtn = screen.getByRole('button', { name: 'Create' }) as HTMLButtonElement;

    expect(firstName.value).toBe('');
    expect(lastName.value).toBe('');
    expect(email.value).toBe('');
    expect(type.value).toBe('');
    expect(submitBtn.disabled).toBe(true);

    await userEvent.type(firstName, 'Aldo');
    await userEvent.type(lastName, 'Solano');
    await userEvent.type(email, 'aldo.solano@test.com');
    await userEvent.selectOptions(type, UserType.Basic);

    expect(submitBtn.disabled).toBe(false);
  });

  it('fill all required values, call create and navigate to user list page', async () => {
    render(<UserForm />);

    await userEvent.type(screen.getByLabelText('First Name*'), 'Aldo');
    await userEvent.type(screen.getByLabelText('Last Name*'), 'Solano');
    await userEvent.type(screen.getByLabelText('Email*'), 'aldo.solano@test.com');
    await userEvent.selectOptions(screen.getByLabelText('Type*'), UserType.Basic);

    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(userService.create).toHaveBeenCalledWith({
        _id: '',
        firstName: 'Aldo',
        lastName: 'Solano',
        phoneNumber: '',
        email: 'aldo.solano@test.com',
        type: UserType.Basic,
      });

      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  it('click cancel to navigate to user list page', async () => {
    render(<UserForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('populate fields and enable submit button if a user is passed in the props', () => {
    const user: User = {
      _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      phoneNumber: '+1-214-555-7294',
      email: 'tom@email.fake',
      type: UserType.Admin,
    };

    render(<UserForm {...{ user }} />);

    expect((screen.getByLabelText('First Name*') as HTMLInputElement).value).toBe(user.firstName);
    expect((screen.getByLabelText('Last Name*') as HTMLInputElement).value).toBe(user.lastName);
    expect((screen.getByLabelText('Phone Number') as HTMLInputElement).value).toBe(
      user.phoneNumber,
    );
    expect((screen.getByLabelText('Email*') as HTMLInputElement).value).toBe(user.email);
    expect((screen.getByLabelText('Type*') as HTMLSelectElement).value).toBe(user.type);

    const updateBtn = screen.getByRole('button', { name: 'Update' }) as HTMLButtonElement;

    expect(updateBtn.disabled).toBe(false);
  });

  it('call update from userService and then navigate to user list page', async () => {
    const user: User = {
      _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
      firstName: 'Tom',
      lastName: 'Sawyer',
      phoneNumber: '+1-214-555-7294',
      email: 'tom@email.fake',
      type: UserType.Admin,
    };

    render(<UserForm {...{ user }} />);

    await userEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(userService.update).toHaveBeenCalledWith(user);
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
