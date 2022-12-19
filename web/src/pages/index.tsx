import { useState } from 'react';
import Image from 'next/image';

import { api } from '../services/api';

import logoImg from '../assets/logo.svg';
import iconCheckImg from '../assets/icon-check.svg';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import usersAvatarImg from '../assets/users-avatar-example.png';

type HomeProps = {
  poolCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home({ poolCount, guessCount, usersCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function handleCreatePool(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso! Código copiado para a área de transferência.')

      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Erro ao criar o bolão, tente novamente!')
    }
  }


  return (
    <div className='grid items-center h-screen max-w-6xl grid-cols-2 mx-auto gap-28'>
      <main>
        <Image src={logoImg} alt="Logo NLW Copa" />

        <h1 className='text-5xl font-bold leading-tight text-white mt-14'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='flex items-center gap-2 mt-10'>
          <Image src={usersAvatarImg} alt="" />

          <strong className='text-xl text-gray-100'>
            <span className='text-ignite-500'>+{usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="flex gap-2 mt-10">
          <input
            required
            type="text"
            placeholder='Qual nome do seu bolão?'
            value={poolTitle}
            onChange={(event) => setPoolTitle(event.target.value)}
            className='flex-1 px-6 py-4 text-sm text-gray-100 bg-gray-800 border border-gray-600 rounded'
          />

          <button
            type='submit'
            className='px-6 py-4 text-sm font-bold text-gray-900 uppercase bg-yellow-500 rounded hover:bg-yellow-700'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm leading-relaxed text-gray-300'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='flex items-center justify-between pt-10 mt-10 text-gray-100 border-t border-gray-600'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt='' />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da app móvel do NLW Copa"
        quality={100}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    guessCountResponse,
    usersCountResponse
  ] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}