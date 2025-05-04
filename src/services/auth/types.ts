export type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
  ipsName: string;
  phone: string;
  nit: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type DataStoredInToken = {
  userId: string;
  ipsId: string;
  centerId?: string;
};
