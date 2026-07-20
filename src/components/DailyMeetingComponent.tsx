import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

interface DailyMeetingProps {
  url: string;
  audioOnly?: boolean;
  onReadyToClose?: () => void;
}

export function DailyMeetingComponent({ url, audioOnly = false, onReadyToClose }: DailyMeetingProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onReadyToClose) {
      onReadyToClose();
    } else {
      navigate({ to: '/' });
    }
  };

  // Append parameters to the Daily.co URL to customize the prebuilt UI
  // e.g. disabling video for audio-only calls
  const getCallUrl = () => {
    try {
      const urlObj = new URL(url);
      if (audioOnly) {
        urlObj.searchParams.set('video', 'false');
      }
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 overflow-hidden rounded-xl border border-border/60 bg-black relative">
        <iframe 
          src={getCallUrl()} 
          allow="camera; microphone; fullscreen; speaker; display-capture" 
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="destructive" onClick={handleClose}>
          End & Return
        </Button>
      </div>
    </div>
  );
}
