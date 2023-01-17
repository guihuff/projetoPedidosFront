import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';

import logoImg from '../../../public/logo.svg';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

import Link from 'next/link';
import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function SingUp() {
  const { singUp } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleSingUp (event: FormEvent){
    event.preventDefault();

    if(email === '' || password === '' || name === ''){
      toast.warn('Preencha todos os campos!');
      return;
    }

    setLoading(true);

    let data = {
      name,
      password,
      email
    }

    await singUp(data);

    setLoading(false);
  }
  return (
    <>
      <Head>
        <title>Faça seu cadastro agora!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo Sujeito Pizzaria' />
        <div className={styles.login}>
          <h1>Criando sua conta</h1>
          <form onSubmit={handleSingUp}>
            <Input 
              placeholder='Digite o seu nome'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              placeholder='Digite o seu email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
              loading={loading}
              type='submit'
            >
              Cadastrar
            </Button>

          </form>

          <Link href="/"><a className={styles.text}>Já possui uma conta? Faça login</a></Link>
          

        </div>
      </div>
    </>
  )
}
