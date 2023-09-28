import BusGroupService from "@/backend/services/BusGroup";
import { BusGroup as Group } from "@/backend/models";
import BaseController from "../Base";
import { NextApiRequest, NextApiResponse } from "next";
import { IBusGroups } from "@/interface/bus";
import { Types } from "mongoose";
import responses from "@/backend/lib/response";

class BusGroupController extends BaseController<BusGroupService> {
  protected name = "Bus group";
  constructor(service: BusGroupService) {
    super(service);
    this.getTree = this.getTree.bind(this)
  }

  async getTree(req: NextApiRequest, res: NextApiResponse) {
    try {
      const currentLineage = await this.service.getTree(req.query)
      return responses.successWithData(res, currentLineage)
    } catch (error: any) {
      return responses.error(res, error.message || error)
    }
  }
}

const BusGroup = new BusGroupController(new BusGroupService(Group));
export default BusGroup;
