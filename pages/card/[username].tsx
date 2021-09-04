import router, { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { Header } from '../../components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const CardGeneratePage: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { username }: any = router.query;

  useEffect(() => {
    const fetchData = async () => {
      const apiRes = await fetch('/api/hashnode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      });
      const apiJson = await apiRes.json();
      if (apiJson.name) {
        setLoading(false);
        setUser(apiJson);
      } else {
        setError(true);
      }
    };
    fetchData();
  });
  console.log(user);
  return (
    <>
      <Head>
        <title>Hashnode Card Generator - {username}</title>
      </Head>
      <Header />
      <main className='container mx-auto md:px-8 px-4 flex flex-col items-center py-4'>
        {loading && (
          <div className='flex flex-col my-2 gap-2 items-center'>
            <p>Loading your data</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='feather feather-refresh-cw animate-spin'
            >
              <polyline points='23 4 23 10 17 10'></polyline>
              <polyline points='1 20 1 14 7 14'></polyline>
              <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'></path>
            </svg>
          </div>
        )}
        <div className='relative'>
          <div
            style={{ width: '365px' }}
            className='px-4 border-brand border-4 rounded-lg bg-white py-4 flex items-center flex-col gap-4'
          >
            {!loading ? (
              user.photo && (
                <Image
                  src={user.photo}
                  alt={username ? username : 'Hashnode Card'}
                  width='100'
                  height='100'
                  className='rounded-full shadow-lg'
                />
              )
            ) : (
              <Skeleton width={100} height={100} circle={true} />
            )}
            <div className='flex flex-col items-center'>
              <p className='text-2xl font-bold'>
                {!loading ? user?.name : <Skeleton height={32} width={180} />}
              </p>
              <p className='text-gray-600'>
                {!loading ? (
                  '@' + username
                ) : (
                  <Skeleton height={32} width={100} />
                )}
              </p>
            </div>
            <div className='flex flex-col items-center text-black mt-2'>
              <h2 className='text-5xl font-bold'>
                {!loading ? (
                  user.postsCount
                ) : (
                  <Skeleton height={48} width={80} />
                )}
              </h2>
              <p>Articles Written</p>
            </div>
            <div className='flex justify-between gap-10 my-6 text-gray-700'>
              <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold'>
                  {!loading ? (
                    user.following
                  ) : (
                    <Skeleton height={40} width={80} />
                  )}
                </p>
                <p>Following</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold'>
                  {!loading ? (
                    user.impressions
                  ) : (
                    <Skeleton height={40} width={80} />
                  )}
                </p>
                <p>Impressions</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold'>
                  {!loading ? (
                    user.followers
                  ) : (
                    <Skeleton height={40} width={80} />
                  )}
                </p>
                <p>Followers</p>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <Image
                src='/brand-full.png'
                width='130'
                height='22'
                alt='Hashnode Logo'
              />
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-16 mt-4'>
          <button
            disabled={error || loading}
            className='bg-brand disabled:bg-gray-300 cursor-not-allowed text-white py-2 rounded px-3 flex gap-2 items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-5 h-5'
            >
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
              <polyline points='7 10 12 15 17 10'></polyline>
              <line x1='12' y1='15' x2='12' y2='3'></line>
            </svg>
            Download
          </button>
          <button
            disabled={error || loading}
            className='bg-brand disabled:bg-gray-300 cursor-not-allowed text-white py-2 flex gap-2 rounded px-3 items-center'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-5 h-5'
            >
              <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
            </svg>
            Tweet
          </button>
        </div>
      </main>
    </>
  );
};

export default CardGeneratePage;
