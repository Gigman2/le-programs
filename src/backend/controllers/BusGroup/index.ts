import BusGroupService from "@/backend/services/BusGroup";
import { BusAccount, BusGroup as Group } from "@/backend/models";
import BaseController from "../Base";
import { NextApiRequest, NextApiResponse } from "next";
import responses from "@/backend/lib/response";
import BusAccountService from "@/backend/services/BusAccount";
import { IBusAccount, IBusGroups } from "@/interface/bus";

class BusGroupController extends BaseController<BusGroupService> {
  protected name = "Bus group";
  constructor(service: BusGroupService, private account: BusAccountService) {
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

  async fullData(req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = req.query
      for (const key in query) {
        if (query.hasOwnProperty(key)) {

          if (/^{.*}$/.test(query[key] as string)) {
            query[key] = JSON.parse(query[key] as string)
          }
        }
      }

      const getAll = this.service.exposeDocument<IBusGroups[]>(await this.service.get(query))
      const data = await Promise.all(
        getAll.map(async (item: any) => {
          item.accounts = await this.account.get({ 'accountType.groupId': item._id })
          item.subGroup = await this.service.get({ parent: item._id }) as IBusGroups[]
          return item
        })
      )
      return responses.successWithData(res, data)
    } catch (error: any) {
      return responses.error(res, error.message || error)
    }
  }

  async fullSingleGroup(req: NextApiRequest, res: NextApiResponse) {
    try {
      const group = this.service.exposeDocument<IBusGroups>(await this.service.getById((req.query as { id: string | string[] }).id))
      group.accounts = await this.account.get({ 'accountType.groupId': (req.query as { id: string | string[] }).id }) as IBusAccount[]
      group.subGroup = await this.service.get({ parent: (req.query as { id: string | string[] }).id }) as IBusGroups[]

      return responses.successWithData(res, group)
    } catch (error: any) {
      return responses.error(res, error.message || error)
    }
  }
}

const BusGroup = new BusGroupController(
  new BusGroupService(Group),
  new BusAccountService(BusAccount)
);
export default BusGroup;
