interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 mb-6 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700"
    >
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        title="Dismiss"
        className="px-2 rounded text-red-500 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
