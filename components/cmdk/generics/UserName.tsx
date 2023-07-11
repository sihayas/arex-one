interface UserNameProps {
  username: string;
  color?: string;
}

export const UserName: React.FC<UserNameProps> = ({ username, color }) => {
  return <div className={`font-medium text-sm text-black`}>{username}</div>;
};
