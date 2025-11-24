import { ReportType, REPORT_TYPE_LABELS } from '@/types/anime';

interface ReportTypeTagProps {
  reportType: ReportType;
  className?: string;
}

export function ReportTypeTag({ reportType, className = '' }: ReportTypeTagProps) {
  const getTypeConfig = (type: ReportType) => {
    switch (type) {
      case 'video_broken':
        return {
          icon: '🎬',
          className: 'bg-red-900/50 text-red-200',
        };
      case 'audio_not_synced':
        return {
          icon: '🔊',
          className: 'bg-orange-900/50 text-orange-200',
        };
      case 'subtitle_not_synced':
        return {
          icon: '📝',
          className: 'bg-yellow-900/50 text-yellow-200',
        };
      case 'wron_skip_time':
        return {
          icon: '⏭️',
          className: 'bg-blue-900/50 text-blue-200',
        };
      case 'other':
        return {
          icon: '❓',
          className: 'bg-gray-700 text-gray-200',
        };
      default:
        return {
          icon: '⚠️',
          className: 'bg-gray-700 text-gray-200',
        };
    }
  };

  const config = getTypeConfig(reportType);
  const label = REPORT_TYPE_LABELS[reportType] || 'Unknown Issue';

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.className} ${className}`}
      title={label}
    >
      <span className="mr-1.5" aria-hidden="true">
        {config.icon}
      </span>
      {label}
    </span>
  );
}