import { format, parseISO } from 'date-fns';
import { Text, View } from 'react-native';
import { XMarkIcon } from '../icons/Icons';

interface Policy {
  start_at: string | null;
  end_at: string | null;
  amount_charge: string;
  amount_show: string;
}

interface CancellationPenalties {
  policies: Policy[];
  free_cancellation_before: string | null;
}

interface CancellationRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeCancellationBefore: string | null;
  cancellationPenalties: CancellationPenalties | null;
  currencyChar?: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

export default function CancellationRulesModal({ isOpen, onClose, freeCancellationBefore, cancellationPenalties, currencyChar = '$' }: CancellationRulesModalProps) {
  // Determine if there is free cancellation
  const hasFreeCancellation = !!freeCancellationBefore && cancellationPenalties?.policies?.[0]?.amount_charge === '0.00';
  const policies = cancellationPenalties?.policies || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View className="max-w-[420px] w-full bg-[#232323] rounded-2xl px-9 py-7 border border-[#232323] text-white relative font-geist">
        <button onClick={onClose} className="absolute text-white right-5 top-5">
          <XMarkIcon className="size-3" />
        </button>
        <Text className="mb-5 text-lg font-medium text-left">Cancellation of booking</Text>
        <View className="text-sm">
          {policies.length > 0 && (
            <>
              {policies.map((policy, idx) => {
                const start = formatDate(policy.start_at);
                const end = formatDate(policy.end_at);
                // If both start and end are null
                if (!start && !end) {
                  return (
                    <View key={idx} className="mb-2">
                      <View className="text-[#E0E0E0]">
                        The cancellation fee is {policy.amount_show}.
                      </View>
                    </View>
                  );
                }
                // Free cancellation until end
                if (policy.amount_charge === '0.00') {
                  return (
                    <View key={idx} className="mb-2">
                      <View className="mb-1 font-semibold text-[#96FFA4]">✓ free cancellation until {end}.</View>
                      {
                        policies.length === 1 &&
                        <View>If you cancel after this date, the cancellation fee is the full cost of the reservation. In case of no-show, the no-show fee is the full cost of the reservation.</View>
                      }
                    </View>
                  );
                }
                // If only end is present and there is a fee
                if (!start && end && policy.amount_charge !== '0.00') {
                  return (
                    <View key={idx} className="mb-2">
                      <View className="text-[#E0E0E0]">
                        If you cancel before {end}, the fee is {currencyChar}{policy.amount_show}.
                      </View>
                    </View>
                  );
                }
                // If only start is present and there is a fee
                if (start && !end && policy.amount_charge !== '0.00') {
                  return (
                    <View key={idx} className="mb-2">
                      <View className="text-[#E0E0E0]">
                        If you cancel after {start}, the fee is {currencyChar}{policy.amount_show}.
                      </View>
                    </View>
                  );
                }
                // If both are present and there is a fee
                if (start && end && policy.amount_charge !== '0.00') {
                  return (
                    <View key={idx} className="mb-2">
                      <View className="text-[#E0E0E0]">
                        If you cancel between {start} and {end}, the fee is {currencyChar}{policy.amount_show}.
                      </View>
                    </View>
                  );
                }
                return <Text>{start} && {end} && {policy.amount_charge}</Text>;
              })}
            </>
          )}
          {(!hasFreeCancellation && !policies.length) && (
            <View className="text-[#E0E0E0]">No cancellation information available for this rate.</View>
          )}
        </View>
      </View>
    </Modal>
  );
} 