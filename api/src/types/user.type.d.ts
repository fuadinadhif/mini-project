export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  profilePic: string;
  referralCode?: string;
}
