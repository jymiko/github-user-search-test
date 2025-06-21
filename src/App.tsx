import { Container, Heading, Stack } from '@chakra-ui/react';
import { UserSearch } from './components/UserSearch';

function App() {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading as="h1" size="xl" textAlign="center">
          GitHub User Search
        </Heading>
        <UserSearch />
      </Stack>
    </Container>
  );
}

export default App;
