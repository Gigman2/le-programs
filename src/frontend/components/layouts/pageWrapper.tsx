/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import { ReactNode } from 'react'
import { Flex} from '@chakra-ui/react'

const PageWrapper = ({children}: {children: ReactNode}) => {

  return (
    <>
      <Head>
        <title>Swollen Sunday | Love Economy Church</title>
        <meta name="description" content="An app to record how God has blessed us with great increase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex w="100%" justify={"center"}>
         {children}
        </Flex>
      </main>
    </>
  )
}


export default PageWrapper
