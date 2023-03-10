import { Center, Icon, Text } from 'native-base'
import { Fontisto } from '@expo/vector-icons'

import { useAuth } from '../hooks/useAuth'

import { Button } from '../components/Button'

import Logo from '../assets/logo.svg'

export function SignIn() {
  const { signIn, isLoadingUser } = useAuth()

  return (
    <Center
      flex={1}
      bgColor="gray.900"
      p={7}
    >
      <Logo width={212} height={40} />

      <Button
        mt='10'
        type='SECONDARY'
        title='Sign in with Google'
        leftIcon={<Icon as={Fontisto} name="google" color="white" size='md' />}
        onPress={signIn}
        isLoading={isLoadingUser}
      />

      <Text color="white" textAlign='center' mt='4'>
        Não utilizamos nenhuma informação além {'\n'} do seu email para criação de conta
      </Text>
    </Center>
  )
}