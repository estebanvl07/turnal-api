export type CreateCenterInput = {
  name: string;
  address: string;
  ipsId: string;
  places: {
    name: string;
    serviceId: string;
    prefix: string;
  }[];
};
