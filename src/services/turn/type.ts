import { Prisma } from "@prisma/client";

export type CreateTurnInput = Omit<
  Prisma.TurnUncheckedCreateInput,
  "ipsId" | "statusId" | "code"
>;
