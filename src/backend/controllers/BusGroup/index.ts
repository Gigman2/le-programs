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
      let hasParent = false
      let currentLineage: IBusGroups[] = []
      let currentParent
      const query = req.query
      let group = await this.service.getOne(query)
      if (!group) res.status(400).json({ message: "Group does not exist" })

      currentLineage.push(group as IBusGroups)
      if (group?.parent) {
        hasParent = true
        currentParent = group?.parent
      }

      while (hasParent) {
        let parentGroup = await this.service.getOne({ _id: currentParent })

        if (!parentGroup) hasParent = false

        const alreadyAMember = currentLineage.filter(item => item._id?.toString() === parentGroup?._id)

        if (!alreadyAMember.length) {
          currentLineage.push(parentGroup as IBusGroups)
        }

        if ((parentGroup?.parent as Types.ObjectId)?._id || parentGroup?.parent) {
          currentParent = (parentGroup?.parent as Types.ObjectId)?._id || parentGroup?.parent;
        } else {
          hasParent = false;
        }
      }

      return responses.successWithData(res, currentLineage)
    } catch (error: any) {
      return responses.error(res, error.message || error)
    }
  }
}

const BusGroup = new BusGroupController(new BusGroupService(Group));
export default BusGroup;
