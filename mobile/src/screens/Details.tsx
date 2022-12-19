import { useEffect, useState } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";
import { PoolHeader } from "../components/PoolHeader";
import { PoolCardProps } from "../components/PoolCard";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";

import { api } from "../services/api";

type DetailsParams = {
  id: string;
}

export function Details() {
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as DetailsParams;

  const [isLoading, setIsLoading] = useState(true);
  const [isSelected, setIsSelected] = useState<'guess' | 'ranking'>('guess');
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

  async function fetchPoolDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)
      setPoolDetails(response.data.pool);

    } catch (err) {
      console.log(err);
      setIsLoading(false);

      toast.show({
        title: "Nao foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Olha o bolão que eu encontrei! - ${poolDetails.code}`,
    })
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded='sm' mb={5}>
            <Option
              title="Seus palpites"
              isSelected={isSelected === 'guess'}
              onPress={() => setIsSelected('guess')}
            />

            <Option
              title="Ranking do grupo"
              isSelected={isSelected === 'ranking'}
              onPress={() => setIsSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  )
}