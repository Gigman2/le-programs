import Navbar from '@/frontend/components/layouts/navbar'
import '@/styles/globals.css'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import { theme } from '../frontend/theme/theme'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return <ChakraProvider theme={theme} resetCSS>
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
            {router.pathname!=="/podcast-qrcode"?<Navbar />:<></>}

            <Component {...pageProps} />

          </Box>
        </motion.div>
      </AnimatePresence>
    </ChakraProvider>
}
