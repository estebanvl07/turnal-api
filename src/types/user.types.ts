import { CareCenter, User } from "@prisma/client";

export interface UserIncludes extends User {
  ips?: User;
  center?: CareCenter;
}
