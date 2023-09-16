import BusGroupService from "@/backend/services/BusGroup";
import { BusGroup as Group } from "@/backend/models";
import BaseController from "../Base";

class BusGroupController extends BaseController<BusGroupService> {
  protected name = "Bus group";
  constructor(service: BusGroupService) {
    super(service);
  }
}

const BusGroup = new BusGroupController(new BusGroupService(Group));
export default BusGroup;
