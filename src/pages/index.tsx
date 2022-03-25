import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

type fetchImagesResponse = {
  data: Card[];
  after: string | null;
};


export default function Home(): JSX.Element {

  async function fetchImages(pageParam = null)  {



      const { data } = await api.get(`/api/images`, {
        params: {
          after: pageParam,
        },
      });

      return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    ({ pageParam = 1 }) =>
    fetchImages(pageParam)
    ,
    {
      getNextPageParam: lastPage => lastPage.after ?? null,
    }

  );
  

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    
    if (data) {



      return data.pages.map((dataArray) => {
        return dataArray.data
      }).flat()
    }
    
    return []
   
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return(<Loading />)
  }
  // TODO RENDER ERROR SCREEN
  
  if (isError) {
    return(<Error />)
  }
 // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAA')
 // console.log(formattedData)
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {
        /* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */
          
          (isFetchingNextPage) && <p>Carregando...</p>
          
        }
        {
          (hasNextPage) && <Button marginTop='1.5rem'  onClick={() => fetchNextPage()}>Carregar mais</Button> 
        }
      </Box>
    </>
  );
}
