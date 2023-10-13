import BusGroupService from "@/backend/services/BusGroup";
import { BusAccount, BusGroup as Group } from "@/backend/models";
import BaseController from "../Base";
import { NextApiRequest, NextApiResponse } from "next";
import responses from "@/backend/lib/response";
import BusAccountService from "@/backend/services/BusAccount";
import { IBusAccount, IBusGroups } from "@/interface/bus";

class BusGroupController extends BaseController<BusGroupService> {
  protected name = "Bus group";
  constructor(service: BusGroupService, private accountService: BusAccountService) {
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
      const getAll = this.service.exposeDocument<IBusGroups[]>(await this.service.get(req.query))
      const data = await Promise.all(
        getAll.map(async (item: any) => {
          item.accounts = await this.accountService.get({ 'accountType.groupId': item._id })
          item.subGroup = await this.service.get({ parent: item._id }) as IBusGroups[]
          item.fullParent = await this.service.getById(item.parent)
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
      group.accounts = await this.accountService.get({ 'accountType.groupId': (req.query as { id: string | string[] }).id }) as IBusAccount[]
      group.subGroup = await this.service.get({ parent: (req.query as { id: string | string[] }).id }) as IBusGroups[]

      return responses.successWithData(res, group)
    } catch (error: any) {
      return responses.error(res, error.message || error)
    }
  }

  async overallGroupsStat(req: NextApiRequest, res: NextApiResponse) {
    try {
      const type = (req.query as { type: string }).type
      let filteredGroups: string[] = []
      let withoutStations: string[] = []

      if (type) {
        const allGroupsByType = this.service.exposeDocument<IBusGroups[]>(await this.service.get({ type: type.toUpperCase(), }))
        const allAccountAsBusRep = this.service.exposeDocument<IBusAccount[]>(await this.accountService.get({ 'accountType.groupType': 'BUS_REP' }))

        let accountGroupId: string[] = []
        allAccountAsBusRep.forEach(item => {
          item.accountType?.forEach(g => {
            if (g.groupType === 'BUS_REP') {
              accountGroupId.push(g.groupId)
            }
          })
        })

        const accountGroupIds = Array.from(new Set([...accountGroupId]))

        filteredGroups = allGroupsByType.filter(item => {
          return !accountGroupIds.includes(item._id as string)
        }).map(item => item._id as string)

        withoutStations = allGroupsByType.filter(item => {
          return item.station.length == 0
        }).map(item => item._id as string)
      }
      return responses.successWithData(res, { noBusRep: filteredGroups, withoutStations })
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
