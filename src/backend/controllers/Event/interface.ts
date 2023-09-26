import IEventService from "@/backend/services/Event/interface";
import IBaseController from "../Base/interface";

interface IEventController extends IBaseController<IEventService> {
}

export default IEventController