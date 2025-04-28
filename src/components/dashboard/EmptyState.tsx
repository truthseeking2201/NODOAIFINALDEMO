import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  onActionClick?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionLink,
  onActionClick
}: EmptyStateProps) {
  // If onActionClick is provided, use a regular button, otherwise use a Link
  const ActionButton = onActionClick ? (
    <Button
      className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-white hover:shadow-[0_4px_16px_-2px_rgba(255,138,0,0.4)]"
      onClick={onActionClick}
    >
      {actionLabel}
    </Button>
  ) : (
    <Button
      asChild
      className="bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-white hover:shadow-[0_4px_16px_-2px_rgba(255,138,0,0.4)]"
    >
      <Link to={actionLink}>{actionLabel}</Link>
    </Button>
  );

  return (
    <div className="glass-card p-8 text-center flex flex-col items-center">
      <div className="bg-nova/10 rounded-full p-6 mb-6">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 6V18M5 12H19"
            stroke="#FF8800"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/60 mb-6 max-w-md">{description}</p>
      {ActionButton}
    </div>
  );
}
