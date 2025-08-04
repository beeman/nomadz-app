export const NOTIFICATION_MESSAGES = {
  WELCOME: "Welcome to our platform! We're excited to have you here. Start exploring available apartments or check out our latest offers.",

  BOOKING: {
    CONFIRMED: (bookingId: string) =>
      `Your booking has been confirmed! Booking ID: ${bookingId}.`,

    CANCELLED: (bookingId: string) =>
      `Your booking (ID: ${bookingId}) has been cancelled. Any applicable refund will be processed according to our cancellation policy.`,
  },

  QUEST: {
    ACCOMPLISHED: (name: string) =>
      `Congratulations! You've successfully completed the "${name}" quest. Keep up the great work and unlock more achievements!`,
  },
} as const;