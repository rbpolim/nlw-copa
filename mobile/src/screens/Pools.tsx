import { useCallback, useState } from "react";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons'

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { PoolCardProps, PoolCard } from "../components/PoolCard";

import { api } from "../services/api";

export function Pools() {
  const toast = useToast();
  const { navigate } = useNavigation()

  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  async function fetchPools() {
    try {
      setIsLoading(true)

      const response = await api.get('/pools')
      setPools(response.data.pools)
    } catch (err) {
      console.log(err)

      toast.show({
        title: "Não foi possível carregar os bolão",
        placement: "top",
        bgColor: "red.500",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []))

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={8}
        mx={5}
        mb={4}
        pb={4}
        borderBottomWidth={1}
        borderBottomColor='gray.600'
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={item => item.id}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 8 }}
          ListEmptyComponent={<EmptyPoolList />}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
        />
      )}
    </VStack >
  )
}