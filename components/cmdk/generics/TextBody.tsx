interface TextBodyProps {
  content: string | null;
  color?: string;
}

export const TextBody: React.FC<TextBodyProps> = ({ content, color }) => {
  return <div className={`text-sm text-${color} break-words`}>{content}</div>;
};
