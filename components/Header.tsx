import Image from 'next/image';
export const Header = () => {
  return (
    <nav className='bg-gray-50 py-3'>
      <div className='flex items-center container mx-auto md:px-8 px-4 gap-4'>
        <Image
          src='https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png?auto=compress'
          alt='Hashnode'
          height='32'
          width='32'
        />
        <p className='inline-block text-2xl text-gray-900 font-bold'>
          Dev Card
        </p>
      </div>
    </nav>
  );
};
