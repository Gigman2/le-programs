import IHeadCountService from "@/backend/services/HeadCount/interface";
import IBaseController from "../Base/interface";

interface IHeadCountController extends IBaseController<IHeadCountService> {
}

export default IHeadCountController