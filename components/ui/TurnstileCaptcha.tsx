import Turnstile from "react-turnstile";

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export function TurnstileCaptcha({ onVerify, onError }: TurnstileCaptchaProps) {
  return (
    <Turnstile
      sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      onVerify={onVerify}
      onError={onError}
      theme="dark"
    />
  );
} 