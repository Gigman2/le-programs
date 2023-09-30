import { IAccountUser, getUser } from "@/frontend/store/auth";

export default function useGetUser() {
  const getUserData = () => {
    const user = getUser() as IAccountUser;
    return user
  };

  const isUserRole = (_roles: ('BUS_REP' | 'BRANCH_HEAD' | 'SECTOR_HEAD' | 'OVERALL_HEAD')[]) => {
    const { roles } = getUser() as IAccountUser;

    if (roles.map((el) => el.groupType).every(userRole => _roles.includes(userRole))) {
      return true;
    } else {
      return false;
    }
  };

  return [isUserRole, getUserData];
}
