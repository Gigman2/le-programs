import {IBusRound} from "@/interface/bus";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL

 export const getBusGroupsApi = async () => {
   return await fetch(`${baseUrl}/api/bus_groups`, {
        method: 'get',
    })
}


export const removeBusRoundApi = async (bus: IBusRound) => {
    await fetch(`${baseUrl}/api/bus_rounds/${bus?._id}`, {
        method: 'DELETE'
    })
}

export const addBusRoundsApi = async (apiPayload: any) => {
    return await fetch(`${baseUrl}/api/bus_rounds`, {
        method: 'post',
        body: JSON.stringify(apiPayload)
    })
}

export const addAttendeeApi = async (fields: Record<string, string | boolean | undefined> ) => {
   return  await fetch(`${baseUrl}/api/attendee/addAttendee`, {
        method: 'post',
        body: JSON.stringify(fields)
    })
}

export const recordBusRoundsApi = async (recorderPage: any) => {
   return  await fetch(`${baseUrl}/api/bus_rounds`, {
        method: 'post',
        body: JSON.stringify(recorderPage)
    })
}

export const createBusRoundsApi = async (recorderPayload: any) => {
  return   await fetch(`${baseUrl}/api/bus_rounds/addBusRounds`, {
        method: 'post',
        body: JSON.stringify(recorderPayload)
    })
}

export const addBusGroupApi = async (payload: any) => {
   return await fetch(`${baseUrl}/api/bus_groups/addGroup`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const getBusRoundsByBusIdApi =  async (busId: string) => {
    return await fetch(`${baseUrl}/api/bus_rounds/${busId}`, {
        method: 'get',
    })
}

export const endBusRoundApi = async (id: any) => {
   return await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
        method: 'post',
        body: JSON.stringify({busState: "ARRIVED", arrivalTime: new Date() })
    })
}

export const updateBusRoundsApi = async (id: any, payload: any) => {
   return await fetch(`${baseUrl}/api/bus_rounds/${id}`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}

export const getBusGroupsPostApi = async (apiPayload: any) => {
   return await fetch(`${baseUrl}/api/bus_groups/getBusGroups`, {
        method: 'post',
        body: JSON.stringify(apiPayload)
    })
}

export const getHeadCountPostApi = async (payload: {}) => {
  return await fetch(`${baseUrl}/api/head_count/getHeadcount`, {
      method: 'post',
      body: JSON.stringify(payload)
  })
}

export const addHeadCountApi = async (payload: any) => {
  return await fetch(`${baseUrl}/api/head_count/addHeadcount`, {
      method: 'post',
      body: JSON.stringify(payload)
  })
}

export const getAttendeePostApi = async (reqData: any) => {
  return fetch(`${baseUrl}/api/attendee/getAttendee`, {
      method: 'post',
      body: JSON.stringify(reqData)
  })
}

export const getAttendeeInfoApi =  async () => {
  return  await fetch(`${baseUrl}/api/attendee/getAttendee`, {
      method: 'get',
  })
}

export const addAttendeeInfoApi = async (payload: any) => {
  return await  fetch(`${baseUrl}/api/attendee/addAttendee`, {
        method: 'post',
        body: JSON.stringify(payload)
    })
}