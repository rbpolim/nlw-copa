import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { api } from "../services/api";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation()

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  async function handleJoinPool() {
    try {
      setIsLoading(true)

      if (!code.trim()) {
        return toast.show({
          title: "Hey! Informe o código do bolão",
          placement: "top",
          bgColor: "red.500",
        })
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: "Você entrou no bolão com sucesso",
        placement: "top",
        bgColor: "green.500",
      })

      setCode('');
      navigate('pools')
    } catch (err) {
      console.log(err);
      setIsLoading(false);

      if (err.response.data.message === "Pool not found") {
        return toast.show({
          title: "Bolão não encontrado",
          placement: "top",
          bgColor: "red.500",
        })
      }

      if (err.response.data.message === "Already joined") {
        return toast.show({
          title: "Você já esta nesse Bolão",
          placement: "top",
          bgColor: "red.500",
        })
      }

      toast.show({
        title: "Nao foi possível encontrar o bolão",
        placement: "top",
        bgColor: "red.500",
      })
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header showBackButton title="Buscar por código" />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          mb={8}
          color="white"
          fontSize="xl"
          textAlign="center"
          fontFamily="heading"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          autoCapitalize="characters"
          onChangeText={setCode}
          placeholder="Qual o nome do seu bolão?"
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack >
  )
}