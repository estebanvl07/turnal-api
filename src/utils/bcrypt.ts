import bcrypt from "bcrypt";

interface ComparePassword {
  password: string;
  hash: string;
}

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = ({ password, hash }: ComparePassword) => {
  return bcrypt.compareSync(password, hash);
};
