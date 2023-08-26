import Head from 'next/head';
import { Box, Flex, Text, useToast, Icon, Input, Button, Image,Link } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineUser } from 'react-icons/ai';


export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    };
  
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    };
  
    const handleLogin = () => {
      // Perform login logic here with the username/email and password
      console.log('Username/Email:', username);
      console.log('Password:', password);
    };
  
  

  // const handleUsernameChange = (event) => {
  //   setUsername(event.target.value);
  // };


  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };
// gave type to event



 

  return (
    <>
      <Head>
        <title>Swollen Sunday | Love Economy Church</title>
        <meta
          name="description"
          content="An app to record how God has blessed us with great increase"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{background:'black',minHeight: '100vh'}}>
        <Flex
          align="center"
          justify="center"
          direction="column"
          maxHeight="100vh" // Set the height of the container to 100% of the viewport height
          
        >
          <Box
               maxW="500px" w="150%"
            // width="30vw" // Set the width of the content
            p="2rem" // Add padding
            // bg="#C5C6D0" 
            bg="black"
            rounded="md" // Apply rounded corners
            shadow="lg" // Add a shadow
            margin="30px 20px"
            
          >
            <Flex direction="column" align="center">
              <Image src="/loginlogo.png" alt="Logo" width="220px" height="100px" mb={4} />


              <Text fontSize="3xl" fontWeight="bold" padding="50px 180px 0px 0px" color="white" mb={10}>
                Locked
              </Text>
              {/* <Text color="white" paddingRight="180px">Access Denied</Text> */}
              {/* <p>It appears you do not have access to this <br></br>application. Kindly contact support for<br></br> further assistance. </p> */}


              <Input
            type="text"
            fontSize="13px"
            placeholder="Email"
            value={username}
            onChange={handleUsernameChange}
            marginTop="1px"
            border="none"
            borderBottom="1px solid white"
            bg="black" // Set the background color of the input field
            width="300px"
            mb={4}
          />

              <Input
                type="password"
                placeholder="Password"
                fontSize="13px"
                // value={password}
                // onChange={handlePasswordChange}
                border="none"
                borderBottom="1px solid white"
                bg="black" // Set the background color of the input field
                width="300px"
                mb={4}
              />
     
              
              {/* Back to Login Button */}
              <Button colorScheme="blue" bg="#15215B" color="white" margin="2rem 5rem" padding="0.5rem 1rem" width="300px" borderRadius="5">
                Unlock
              </Button>
            </Flex>

            
            <Link
              color="white"
              textDecoration="none"
              paddingLeft="180px"
              fontSize="13px"
              _hover={{ textDecoration: "underline" }} // Add underline on hover
            >
              Back to Login
            </Link>
          </Box>
        </Flex>
      </main>
    </>
  );
}

















