import { ReportSeverity } from '@/types/anime';

interface ReportStatusBadgeProps {
  severity: ReportSeverity;
  className?: string;
}

export function ReportStatusBadge({ severity, className = '' }: ReportStatusBadgeProps) {
  const getStatusConfig = (severity: ReportSeverity) => {
    switch (severity) {
      case 'high':
        return {
          label: 'High',
          icon: '🔴',
          className: 'bg-red-700 text-red-200',
        };
      case 'medium':
        return {
          label: 'Medium',
          icon: '🟡',
          className: 'bg-yellow-700 text-yellow-200',
        };
      case 'low':
        return {
          label: 'Low',
          icon: '🔵',
          className: 'bg-blue-700 text-blue-200',
        };
      default:
        return {
          label: 'Unknown',
          icon: '⚪',
          className: 'bg-gray-700 text-gray-200',
        };
    }
  };

  const config = getStatusConfig(severity);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${config.className} ${className}`}
    >
      <span className="mr-1" aria-hidden="true">
        {config.icon}
      </span>
      {config.label}
    </span>
  );
}