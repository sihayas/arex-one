interface UserNameProps {
  username: string;
  color?: string;
}

export const UserName: React.FC<UserNameProps> = ({ username, color }) => {
  return (
    <div className={`font-semibold text-sm text-${color}`}>{username}</div>
  );
};
