


import Attendee from '@/models/attendee';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'


import { connectMongo } from '../../../utils/connectMongo';



const handler: NextApiHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {




  await connectMongo();
  const { queryTerm } = req.query



  let pipeline = [
    {
      "$search": {
        index: "default",
        text: {
          query: queryTerm,
          path: {
            wildcard: "*"
          },
          fuzzy: {}
        }
      }

    }
  ]

  let pipeline2 = [
    {
      "$search": {
        index: "searchMembers",
        "autocomplete": {
          "query": queryTerm,
          "path": "fullName",
          "tokenOrder": "sequential"
          // "fuzzy": {
          //     "maxEdits": 2,
          //     "prefixLength": 3
          // }
        }
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        "fullName": 1,
        // "phoneNumber":1
      }
    }


  ]

  try {
    let result = await Attendee.aggregate(pipeline2)




    //check if order Id exists
    // const busGroup =  await BusGroup.create({bidId:busGroup._id})



    return res.status(200).json({ result })



    //   res.status(200).json({ message: 'Unsucessful',  })

  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error })
  }

}



export default handler;



//   var dbName = "dev_le_streaming_db";
//   var collName = "videos";

//   // Get a collection from the context
//   var collection = context.services.get("Cluster0").db("dev_le_streaming_db").collection("videos");



// let pipeline =[
//   {
//     $search: {
//       index: "searchVideos",
//       text: {
//         query:arg,
//         path: {
//           wildcard: "*"
//         }
//       }
//     }
//   }
// ];

// return collection.aggregate(pipeline)


// [
//     {
//       $search: {
//         index: "searchVideos",
//         text: {
//           query: "<query>",
//           path: {
//             wildcard: "*"
//           }
//         }
//       }
//     }
//   ]