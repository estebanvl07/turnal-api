import { UserIncludes } from "@/types/user.types";

interface UserResponse {
  id: string;
  email: string;
  name: string;
  ipsId: string;
  centerId?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  public userMapper(user: UserIncludes): UserResponse {
    const { id, email, name, ipsId, centerId, role, createdAt, updatedAt } =
      user;

    return {
      id,
      email,
      name,
      ipsId,
      centerId,
      role,
      createdAt,
      updatedAt,
    };
  }
}

export default new UserService();
