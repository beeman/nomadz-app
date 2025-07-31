import { OrderStatuses } from "../enums";
import { PaymentIntent } from "@stripe/stripe-js";

export type Order = {
  hid: number;
  hash: string;
  userId: string;
  id: string;
  details: Record<string, unknown>;
  payment: PaymentIntent;
  status: OrderStatuses;
  createdAt: Date;
  updatedAt: Date;
}
