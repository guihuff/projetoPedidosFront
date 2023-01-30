import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import styles from './styles.module.scss';

import { Header } from '../../components/Header'
import { FiRefreshCcw } from "react-icons/fi";
import { setupAPIClient } from "../../services/api";
import { useState } from "react";
import Modal from "react-modal";

import { ModalOrder } from "../../components/ModalOrder";

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;
}

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemProps = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string;
  },
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard ({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || []);
  const [modalItem, setModalItem] = useState<OrderItemProps[]>();
  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal () {
    setModalVisible(false);
  }

  async function handleOpenModalView(id: string){
    const api = setupAPIClient();

    const response = await api.get('/order/detail', {
      params: {
        order_id: id,
      }
    });

    setModalItem(response.data);
    setModalVisible(true);
  }

  Modal.setAppElement('#__next');

  return (
    <>
    <Head>
      <title>Painel - Sujeito Pizzaria</title>
    </Head>
    <div>
      <Header />
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <h1>Últimos Pedidos</h1>
          <button>
            <FiRefreshCcw color="#3FFFa3" size={25}/>
          </button>
        </div>

        <article className={styles.listOrders}>
          {orderList.map(item => (
            <section key={item.id} className={styles.orderItem}>
              <button onClick={() => handleOpenModalView(item.id) }>
                <div className={styles.tag}></div>
                <span>Mesa {item.table}</span>
              </button>
            </section>
          ))}
          
        </article>
      </main>
      {modalVisible && (
        <ModalOrder 
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
          order={modalItem}
        />
      )}
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  
  const api = setupAPIClient(ctx);

  const response = await api.get('/orders');
  // console.log(response.data);
  return {
    props: {
      orders: response.data
    }
  }

});