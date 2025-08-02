import { ReactNode, FC } from "react";
import Button from "./Button";

interface StepFormProps {
  title: string;
  children: ReactNode;
  onNext: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  isValid: boolean;
  canSkip?: boolean;
  className?: string;
  nextStepExists?: boolean;
  previousStepExists?: boolean;
  nextButtonText?: string;
  skipButtonText?: string;
}

const StepForm: FC<StepFormProps> = ({ 
  title, 
  children, 
  onNext, 
  onSkip, 
  onPrevious, 
  isValid, 
  canSkip, 
  nextStepExists = true, 
  previousStepExists = true, 
  className,
  nextButtonText = 'Next step ►',
  skipButtonText = "I'll do it later"
}) => {
  return (
    <View className={`mt-24 gap-y-24 sm:!min-w-[330px] ${className || ''}`}>
      <View className="gap-y-4">
        </Text className="px-2 text-xl text-center text-white sm:text-2xl">{title}</Text>
        {children}
      </View>
      <View className="flex flex-col items-center gap-3">

        <View className="flex gap-x-4">
          {
            nextStepExists &&
            <Button
              className="!w-auto px-8 text-sm sm:text-base whitespace-nowrap"
              onClick={onNext}
              disabled={!isValid}
            >
              {nextButtonText}
            </Button>
          }
        </View>
        {canSkip && onSkip && (
          <Button
            type="button"
            className="text-[#999999] text-xs hover:text-white"
            onClick={onSkip}
          >
            {skipButtonText}
          </Button>
        )}
      </View>
    </View>
  );
};

export default StepForm;