import { Button } from '@chakra-ui/react';
import { useLocation, Link } from 'react-router-dom';

interface NavButtonProps {
  buttonPath: string;
  buttonText: string;
}

const NavButton = ({ buttonPath, buttonText }: NavButtonProps) => {
  const location = useLocation();

  return (
    <Link to={buttonPath}>
      <Button
        mr={0.5}
        style={{ borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}
        colorScheme='anotherCustomYellow' isActive={location.pathname === buttonPath ? true : false}
      >
        {buttonText}
      </Button>
    </Link>
  );
};

export default NavButton;