/**
 * Shared Type Definitions.
 * Includes user account schemas, statuses, and role-based permissions models.
 *
 * @author akshatnathani
 * @version 1.0.0
 */

export type Role = 'Admin' | 'User';
export type Status = 'Active' | 'Inactive' | 'Deleted';

export type User = {
  id: string;
  fullName: string;
  email: string;
  username: string;
  contact?: string;
  profilePicture?: string;
  status: Status;
  role: Role;
  joinedDate: string;
};
