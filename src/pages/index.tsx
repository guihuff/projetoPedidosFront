import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import logoImg from '../../public/logo.svg';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import Link from 'next/link';
import { FormEvent, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { singIn } = useContext(AuthContext);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    let data = {
      email: "teste@teste.com",
      password: "123456"
    }

    await singIn(data);
  }

  return (
    <>
      <Head>
        <title>SujeitoPizza - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo Sujeito Pizzaria' />
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input 
              placeholder='Digite o seu email'
              type='text'
            />
            <Input 
              placeholder='Digite sua senha'
              type='password'
            />

            <Button 
              loading={false}
              type='submit'
            >
              Entrar
            </Button>

          </form>

          <Link href="/singup"><a className={styles.text}>Não possui uma conta? Cadastre-se</a></Link>
          

        </div>
      </div>
    </>
  )
}
