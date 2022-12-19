import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTheme } from 'native-base'
import { PlusCircle, SoccerBall } from 'phosphor-react-native'

const { Navigator, Screen } = createBottomTabNavigator()

import { New } from '../screens/New'
import { Pools } from '../screens/Pools'
import { Platform } from 'react-native'
import { Find } from '../screens/Find'
import { Details } from '../screens/Details'

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  const size = sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon', // ícone ao lado do texto
        tabBarActiveTintColor: colors.yellow[500], // cor do ícone ativo
        tabBarInactiveTintColor: colors.gray[300], // cor do ícone inativo
        tabBarStyle: {
          position: 'absolute', // fixar a tab bar no final da tela
          height: sizes[22], // tamanho da tab bar
          borderTopWidth: 0, // remover a borda superior
          backgroundColor: colors.gray[800], // cor de fundo da tab bar
        },
        tabBarItemStyle: {
          position: 'relative', // fixar o ícone e o texto no final da tab bar
          top: Platform.OS === 'android' ? -10 : 0, // corrigir o posicionamento do ícone e do texto no iOS
        }
      }}
    >
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />, // ícone do botão
          tabBarLabel: 'Novo bolão', // texto do botão
        }}
      />
      <Screen
        name="pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />, // ícone do botão
          tabBarLabel: 'Meus bolões', // texto do botão
        }}
      />
      <Screen
        name="find"
        component={Find}
        options={{ tabBarButton: () => null }} // remover o botão
      />
      <Screen
        name="details"
        component={Details}
        options={{ tabBarButton: () => null }} // remover o botão
      />
    </Navigator>
  )
}