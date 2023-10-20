import { Model, Types } from 'mongoose';
import { IBusGroups } from '@/interface/bus'
import BaseService from '../Base';

export default class BusGroupService extends BaseService<IBusGroups> {
    protected readonly name = 'BusGroup';

    constructor(protected readonly model: Model<IBusGroups>) {
        super(model)
        this.getTree = this.getTree.bind(this)
    }

    async getTree(data: any) {
        try {
            let hasParent = false
            let currentLineage: IBusGroups[] = []
            let currentParent

            let group = await this.getOne(data)
            if (!group) null

            currentLineage.push(group as IBusGroups)
            if (group?.parent) {
                hasParent = true
                currentParent = group?.parent
            }

            while (hasParent) {
                let parentGroup = await this.getOne({ _id: currentParent })

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

            return currentLineage
        } catch (error) {
            this.log(error)
        }
    }

    async getChildren(group: string, base: string) {
        try {
            const baseNodes: string[] = []
            let parents = [group]

            let noChildren = false
            while (!noChildren) {
                const nodes = await this.get({ parent: { '$in': parents } })
                parents = []
                nodes.forEach(item => {
                    if (item.type === base) {
                        baseNodes.push(item._id)
                    } else {
                        parents.push(item._id)
                    }
                })

                if (!parents.length) {
                    noChildren = true
                }
            }
            return baseNodes
        } catch (error) {
            this.log(error)
        }
    }
}