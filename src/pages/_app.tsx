import type { AppProps } from 'next/app'
import Navbar from '@/frontend/components/layouts/navbar'
import '@/frontend/styles/globals.css'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import { theme } from '../frontend/theme/theme'

function MyApp({ Component, pageProps }: AppProps ) {
  const router = useRouter()
  const queryClient = new QueryClient()

  return <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.pathname}
          initial="pageInitial"
          animate="pageAnimate"
          variants={{
            pageInitial: {
              opacity: 0
            },
            pageAnimate: {
              opacity: 1,
              transition: { duration: 0.5 }
            }
          }}
        >
          <Box bgColor="white" pos="relative" overflow="hidden">
            {router.pathname !=="/podcast-qrcode"?<Navbar />:<></>}

            <Component {...pageProps} />

          </Box>
        </motion.div>
      </AnimatePresence>
    </ChakraProvider>
  </QueryClientProvider>
}

export default MyApp
