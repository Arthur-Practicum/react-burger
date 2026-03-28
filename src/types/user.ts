export type User = {
  email: string;
  name: string;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserResponse = {
  success: boolean;
  user: User;
};
