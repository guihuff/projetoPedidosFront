import Link from 'next/link';
import styles from './styles.module.scss';

import { FiLogOut } from 'react-icons/fi'
import Image from 'next/image';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Header (){
  const { singOut } = useContext(AuthContext);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/dashboard'>
          <Image src="/logo.svg" width={190} height={60} alt="logo" />
        </Link>

        <nav className={styles.menuNav}>
          <Link href='/category'>
            <a>Categoria</a>
          </Link>

          <Link href='/product'>
            <a>Cardápio</a>
          </Link>

          <button onClick={singOut}>
            <FiLogOut color='#FFF' size={24} />
          </button>
        </nav>
      </div>
    </header>
  )
}