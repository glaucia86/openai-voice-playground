import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type StatusMessageProps = {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
  requestId?: string | undefined;
};

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function StatusMessage({ tone, children, requestId }: StatusMessageProps) {
  const Icon = ICONS[tone];

  return (
    <div className={`status-message status-message--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      <div>
        <p>{children}</p>
        {requestId ? <small>Request ID: {requestId}</small> : null}
      </div>
    </div>
  );
}
