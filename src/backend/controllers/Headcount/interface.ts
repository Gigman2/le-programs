import IBaseController from "../Base/interface";
import IEventService from "@/backend/services/Event/interface";

interface IEventController extends IBaseController<IEventService> {
}

export default IEventController