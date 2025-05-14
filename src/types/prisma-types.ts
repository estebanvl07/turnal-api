import {
  CareCenter,
  CareCenterServices,
  Ips,
  PlacesOfCare,
  Priority,
  Services,
  Turn,
  TurnComments,
  TurnStatus,
  User,
} from "@prisma/client";

export type IpsIncludes = Ips & {
  users?: UserIncludes[];
  turns?: TurnIncludes[];
  centers?: CareCenterIncludes[];
  services?: ServicesIncludes[];
};

export type ServicesIncludes = Services & {
  ips?: Ips;
  careCenterServices?: CareCenterServiceInclude[];
  turns?: TurnIncludes[];
};

export type CareCenterIncludes = CareCenter & {
  ips?: Ips;
  users?: User[];
  placesOfCare?: PlacesOfCareIncludes[];
  centerServices?: CareCenterServiceInclude[];
  turns?: TurnIncludes[];
};

export type CareCenterServiceInclude = CareCenterServices & {
  careCenter?: CareCenterIncludes;
  service?: ServicesIncludes;
};

export type PlacesOfCareIncludes = PlacesOfCare & {
  center?: CareCenterIncludes;
  turns?: TurnIncludes[];
  users?: UserIncludes[];
};

export enum UserRole {
  USER,
  ADMIN,
  SUPERADMIN,
}

export type UserIncludes = User & {
  ips?: Ips;
  placesOfCare?: PlacesOfCareIncludes;
  center?: CareCenterIncludes;
  comments?: TurnCommentsIncludes[];
};

export type TurnIncludes = Turn & {
  center?: CareCenterIncludes;
  users?: UserIncludes[];
  ips?: IpsIncludes;
  service?: ServicesIncludes;
  status?: TurnStatusInclude;
  priority?: PriorityIncludes;
  placesOfCare?: PlacesOfCareIncludes;
  comments?: TurnCommentsIncludes[];
};

export type TurnCommentsIncludes = TurnComments & {
  turn?: TurnIncludes;
  user?: UserIncludes;
};

export type TurnStatusInclude = TurnStatus & {
  turns?: TurnIncludes[];
};

export type PriorityIncludes = Priority & {
  turns?: TurnIncludes[];
};
