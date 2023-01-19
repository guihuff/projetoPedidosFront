import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './styles.module.scss';

type ItemProps = {
  id: string;
  name: string;
}

type CategoryProps = {
  categoryList: ItemProps[];
}


export default function Product ({categoryList}: CategoryProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [category, setCategory] = useState(0);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  function handleFile (e: ChangeEvent<HTMLInputElement>) {
    if(!e.target.files){
      return;
    }

    const image = e.target.files[0];

    if(!image){
      return;
    }

    if(image.type === 'image/jpeg' || image.type === 'image/png'){

      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleChangeCategory(event) {
    setCategory(event.target.value);
  }

  async function handleRegister(e: FormEvent){
    e.preventDefault();
    try { 
      const data = new FormData();

      if(name === '' || price === '' || description === '' || imageAvatar === null){
        toast.warning("Preencha todos os campos");
        return;
      }
      data.append('name', name);
      data.append('price', price);
      data.append('description', description);
      data.append('file', imageAvatar);
      data.append('category_id', categories[category].id);
      
      const api = setupAPIClient();

      await api.post('/product', data);

      toast.success("Produto cadastrado com sucesso!");
      
    }catch(err){
      toast.error('Ops! Erro ao cadastrar')
      console.log(err);
    }

    setName('');
    setPrice('');
    setDescription('');
    setImageAvatar(null);
    setAvatarUrl('');
    setCategory(0);
  }

  return (
    <>
      <Head>
        <title>Novo Produto -Sujeito Pizzaria</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>
          <h1>Novo Produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>

            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color='#FFF' />
              </span>

              <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>

              {avatarUrl && (
                <img 
                  className={styles.preview}
                  src={avatarUrl}
                  alt='Foto do produto'
                  width={250}
                  height={250}
                />
              )}
              
            </label>


            <select className={styles.input} 
              value={category}
              onChange={handleChangeCategory}
            >
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
    
            </select>

            <input className={styles.input}
              type='text'
              placeholder='Nome do produto'
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input className={styles.input}
              type='text'
              placeholder='Preço do produto'
              value={price}
              onChange={e => setPrice(e.target.value)}
            />

            <textarea className={styles.input}
              placeholder='Descreva seu produto...'
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <button className={styles.buttonAdd} type='submit'>
              Cadastrar
            </button>

          </form>
        </main>

      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const api = setupAPIClient(ctx);

  const response = await api.get('/categorys');

  // console.log(response.data);

  return {
    props: {
      categoryList: response.data
    }
  }
})