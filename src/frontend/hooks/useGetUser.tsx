import { IAccountUser, getUser } from "@/frontend/store/auth";

export default function useGetUser() {

  const isUserRole = (
    rowCheck: ("BUS_REP" | "BUS_HEAD" | "SECTOR_HEAD" | "OVERALL_HEAD")[]
  ) => {
    const { roles } = getUser() as IAccountUser;

    if (
      roles
        .map((el) => el.groupType)
        .every((userRole) => rowCheck.includes(userRole))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getUserData = (): IAccountUser => {
    const user = getUser() as IAccountUser;
    return user;
  };
  
  const currentRole = (): {groupType:string;groupId:string} => {
    const user = getUser() as IAccountUser;
    return user?.currentRole||{groupType:'',groupId:''};
  };


  return [isUserRole, getUserData, currentRole];
}
