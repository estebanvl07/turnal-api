import { CreatePlaceInput } from "../places/types";

export type CreateCenterInput = {
  name: string;
  address: string;
  ipsId: string;
  places: CreatePlaceInput[];
};
