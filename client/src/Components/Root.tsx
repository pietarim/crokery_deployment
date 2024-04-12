import { useEffect } from 'react';
import {
  Tabs, TabList, Tab, TabPanel, TabPanels, Button, Menu, MenuButton, MenuList,
  MenuItem, IconButton, Badge, Flex, Box
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import '../App.css';
import Login from "./Login";
import CreateNewUser from './CreateNewUser';
import { useAuth, useNotification, useAxios, useWidth } from '../hooks';
import { Outlet, Link } from 'react-router-dom';
import NavButton from './NavButton';

const Root = () => {
  const { setToken, token } = useAuth();
  const { get } = useAxios();
  const { showNotification } = useNotification();
  const isMobileView = useWidth();

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const user = await get('/auth/access-token', { withCredentials: true });
        setToken({ token: user.data.token, username: user.data.username, id: user.data.id });
      } catch (err) {
        console.log('not logged in');
      }
    };
    getAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await get('/auth/logout', { withCredentials: true });
      setToken(null);
    }
    catch {
      showNotification('Failed to log out', 'error');
    }
  };

  if (!token) {
    return (
      <Flex align='center' justify='center'>
        <Tabs mt={1} isFitted variant='enclosed' colorScheme='customYellow' width={{ md: '600px' }}>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <CreateNewUser />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    );
  } else {
    if (isMobileView) {
      return (
        <div style={{ position: 'relative', height: '100vh' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
              variant='outline'
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
            <MenuList>
              <Link to={'/'}><MenuItem>Discover recipes</MenuItem></Link>
              <Link to={'/create-recipe'}><MenuItem>Create recipe</MenuItem></Link>
              <Link to={'/shopping-list'}><MenuItem>Shopping list</MenuItem></Link>
              <Link to={'/'}><MenuItem onClick={() => handleLogout()}>Log out</MenuItem></Link>
            </MenuList>
          </Menu>
          <Outlet />
        </div>
      );
    } else if (!isMobileView) {
      return (
        <div>
          <Box style={{
            position: 'fixed',
            width: '100%',
            left: "0",
            backgroundColor: 'rgba(58, 69, 79, 0.75)',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: '5'
          }}
          >
            <Box
              style={{
                position: 'relative',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(58, 69, 79, 0.75)',
                width: '100%',
                maxWidth: '1280px',
              }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <NavButton buttonPath='/' buttonText='Discover recipes' />
                <NavButton buttonPath='/create-recipe' buttonText='Create recipe' />
                <NavButton buttonPath='/shopping-list' buttonText='Shopping list' />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Badge fontSize='0.8em' colorScheme='customBlue' mr='2' variant='solid' >
                  User: {token.username} logged in
                </Badge>
                <Button colorScheme='customeExit' onClick={() => handleLogout()}>Log out</Button>
              </div>
            </Box>
          </Box>
          <Flex style={{ height: '40px' }}></Flex>
          <Outlet />
        </div >
      );
    }
  }
};

export default Root;