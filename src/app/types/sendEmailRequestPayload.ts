import { Participant } from "@/app/types/participant";

export type SendEmailRequestPayload = {
  giver: Participant;
  receiver: Participant;
};
