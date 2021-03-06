import router, { useRouter } from 'next/router';
import Head from 'next/head';
import { NextPage } from 'next';
import { Header } from '../../components/Header';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';

const CardGeneratePage: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [badges, setBadges] = useState<any[]>([]);
  const [url, setURL] = useState('');
  const [error, setError] = useState(false);
  const [imgLink, setImgLink] = useState('');
  const { username }: any = router.query;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      setBadgeLoading(true);
      const response = await fetch(
        'https://hashnode-badge-scraper.herokuapp.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
          }),
        }
      );
      const responseJson = await response.json();
      if (responseJson.badges) {
        setBadges(responseJson.badges);
        setURL(responseJson.domain);
        console.log('Badges Loaded');
      } else {
        console.log('Badges not Loaded');
      }
      setBadgeLoading(false);
    };
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
    if (!user.name) {
      fetchData();
    }
    if (badges.length === 0) {
      fetchBadges();
    }
  });

  const onShare = async () => {
    if (ref.current === null) {
      return;
    }
    let base64Image: string = '';
    toPng(ref.current).then((dataUrl) => {
      base64Image = dataUrl.slice(22);
      console.log(base64Image);
      const formData = new FormData();
      // @ts-ignore
      const key: string = process.env.NEXT_PUBLIC_IMGBB_STORAGE_KEY;
      formData.append('image', base64Image);
      formData.append('name', username);
      formData.append('key', key);
      const upload = axios
        .post('https://api.imgbb.com/1/upload', formData)
        .then((data) => {
          navigator.clipboard.writeText(data.data.data.url);
          setImgLink(data.data.data.url);
        });
      // @ts-ignore
      toast.promise(upload, {
        loading: 'Creating Shareable Image...',
        success: 'Image URL copied to clipboard',
        error: 'Error Creating Shareable Image',
      });
    });
  };

  const downloadImage = async () => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = username + '.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Head>
        <title>Hashnode Card Generator - {username}</title>
      </Head>
      <Header />
      <main className='container mx-auto md:px-8 px-4 flex flex-col items-center py-4'>
        {loading && (
          <div className='flex flex-col my-2 items-center'>
            <p className='mb-2'>Loading your data</p>
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
              className='feather feather-refresh-cw animate-spin mb-2'>
              <polyline points='23 4 23 10 17 10'></polyline>
              <polyline points='1 20 1 14 7 14'></polyline>
              <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'></path>
            </svg>
          </div>
        )}
        <div className='relative'>
          <div
            style={{ width: '365px' }}
            id='hashnodeCard'
            ref={ref}
            className='px-4 border-brand border-4 rounded-lg bg-white py-3 flex items-center flex-col'>
            {!loading ? (
              user.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    user.photo +
                    '?w=400&h=400&fit=crop&crop=faces&auto=compress'
                  }
                  alt={username ? username : 'Hashnode Card'}
                  width='100'
                  height='100'
                  className='rounded-full shadow-lg mb-2'
                />
              )
            ) : (
              <Skeleton
                width={100}
                height={100}
                className='mb-2'
                circle={true}
              />
            )}
            <div className='flex flex-col items-center mb-2'>
              <p className='text-2xl font-bold'>
                {!loading ? user?.name : <Skeleton height={32} width={180} />}
              </p>
              <p className='text-gray-600'>
                {!loading ? (
                  '@' + username
                ) : (
                  <Skeleton height={24} width={100} />
                )}
              </p>
              <p className='text-gray-600'>
                {badges.length > 0 ? url : <Skeleton height={24} width={100} />}
              </p>
            </div>
            <div className='flex flex-col items-center mb-2 text-black mt-1'>
              <h2 className='text-5xl font-bold mb-1'>
                {!loading ? (
                  user.postsCount
                ) : (
                  <Skeleton height={48} width={80} />
                )}
              </h2>
              <p>Articles Written</p>
            </div>
            <div className='flex justify-between mt-2 mb-4 text-gray-700'>
              <div className='flex flex-col items-center mr-5'>
                <p className='text-4xl font-bold'>
                  {!loading ? (
                    user.following
                  ) : (
                    <Skeleton height={40} width={80} />
                  )}
                </p>
                <p>Following</p>
              </div>
              <div className='flex flex-col items-center mr-5'>
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
            <div className='flex flex-wrap justify-center w-full mt-2 mb-4'>
              {badges.length > 0 ? (
                badges.map((badge, index) => {
                  if (badge.type === 'img') {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={Math.random()}
                        src={badge.logo}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                        }}
                        className={
                          ([4, 9].includes(index) ? 'mx-0' : 'mx-1') + ' mb-2'
                        }
                        alt={badge.name}
                      />
                    );
                  } else {
                    const idRand = badge.name
                      .replaceAll('#', '')
                      .replaceAll(' ', '-');
                    const svgElement = document.querySelector(
                      `#svgContainer${idRand}`
                    );
                    if (svgElement) {
                      svgElement.innerHTML = badge.logo;
                    }
                    return (
                      <div
                        key={idRand}
                        id={'svgContainer' + idRand}
                        className={[4, 9].includes(index) ? 'mx-0' : 'mx-1'}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                        }}></div>
                    );
                  }
                })
              ) : (
                <div>
                  <Skeleton height={40} width={40}></Skeleton>
                </div>
              )}
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
        <div className='flex justify-between mt-4' style={{ width: '365px' }}>
          <button
            onClick={downloadImage}
            disabled={loading}
            className='bg-brand disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded px-3 flex gap-2 items-center'>
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
              className='w-5 h-5 mr-2'>
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
              <polyline points='7 10 12 15 17 10'></polyline>
              <line x1='12' y1='15' x2='12' y2='3'></line>
            </svg>
            Download
          </button>
          <button
            onClick={onShare}
            disabled={loading}
            className='bg-brand disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded px-3 flex items-center'>
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
              className='w-5 h-5 mr-2'>
              <circle cx='18' cy='5' r='3'></circle>
              <circle cx='6' cy='12' r='3'></circle>
              <circle cx='18' cy='19' r='3'></circle>
              <line x1='8.59' y1='13.51' x2='15.42' y2='17.49'></line>
              <line x1='15.41' y1='6.51' x2='8.59' y2='10.49'></line>
            </svg>
            Share
          </button>
        </div>

        {imgLink && (
          <input
            type='text'
            className='block w-full max-w-sm mt-4'
            defaultValue={imgLink}
          />
        )}

        {imgLink && (
          <>
            <a
              href={
                'https://twitter.com/intent/tweet?text=My hashnode achievements. Created using https://hashnode-cards.herokuapp.com which is developed by @ChapagainAshik&url=' +
                imgLink
              }
              className='twitter-share-button bg-brand disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded px-3 flex gap-2 items-center'>
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
                className='w-5 h-5'>
                <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
              </svg>
              Tweet
            </a>
          </>
        )}
      </main>
      <footer className='flex justify-center'>
        Made with <span className='text-red-500 px-1'>&hearts;</span> by
        <a href='https://github.com/projectashik'>&nbsp;Ashik Chapagain</a>
        &nbsp;and
        <a href='https://github.com/lalit2005'>&nbsp;Lalit Kishore</a>
      </footer>
    </>
  );
};

export default CardGeneratePage;
