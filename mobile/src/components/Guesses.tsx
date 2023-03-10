import { useEffect, useState } from 'react';
import { useToast, FlatList } from 'native-base';

import { Game, GameProps } from './Game';

import { api } from '../services/api';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface GuessesProps {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: GuessesProps) {
  const toast = useToast();

  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function fetchGames() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Preencha todos os campos do palpite",
          placement: "top",
          bgColor: "red.500",
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      })

      fetchGames()
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível enviar o palpite",
        placement: "top",
        bgColor: "red.500",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      _contentContainerStyle={{ pb: 8 }}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
    />
  );
}
