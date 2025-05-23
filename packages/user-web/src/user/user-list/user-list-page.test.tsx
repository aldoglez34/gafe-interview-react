import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { History, createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { UserType } from '../user.mjs';
import { UserListPage } from './user-list-page';

interface GetViewArgs {
  history: History;
}

vi.mock('../user-page/services/user.service', () => ({
  default: {
    find: vi.fn().mockResolvedValue([
      {
        _id: 'ff899ea1-5397-42b4-996d-f52492e8c835',
        firstName: 'Tom',
        lastName: 'Sawyer',
        email: 'tom@email.fake',
        phoneNumber: '+1-214-555-7294',
        type: UserType.Admin,
      },
    ]),
  },
}));

describe('User List Page', () => {
  const getView = (args?: GetViewArgs) => {
    const $args = {
      history: createMemoryHistory(),
      ...args,
    };

    const target = render(
      <Router location={$args.history.location} navigator={$args.history}>
        <UserListPage />
      </Router>,
    );

    const getCell = (row: string, col: string) =>
      Promise.resolve(
        target.container.querySelector<HTMLTableCellElement>(
          `table tr[data-row="${row}"] td[data-col="${col}"]`,
        ),
      );

    const getEditButton = async (id: string) => {
      const cell = await getCell(id, 'actions');
      return cell?.querySelector<HTMLButtonElement>('button');
    };

    const clickEditButton = async (id: string) => {
      const button = await getEditButton(id);
      await userEvent.click(button!);
    };

    const getCreateUserButton = () => screen.findByText<HTMLButtonElement>('Create New User');

    const clickCreateButton = async () => {
      const button = await getCreateUserButton();
      await userEvent.click(button);
    };

    return Promise.resolve({
      getCell,
      getCreateUserButton,
      clickCreateButton,
      getEditButton,
      clickEditButton,
    });
  };

  it('should navigate to the edit user page when the edit button is clicked', async () => {
    // Arrange.
    const target = 'ff899ea1-5397-42b4-996d-f52492e8c835';
    const history = createMemoryHistory();
    const view = await getView({ history });

    // Act
    await screen.findByText('Tom');
    await view.clickEditButton(target);
    const actual = history.location.pathname;

    // Assert.
    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: /edit/i }));
      expect(actual).toBe(`/users/${target}`);
    });
  });
});
