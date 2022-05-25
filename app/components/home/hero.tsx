export const Hero = () => {
  return (
    <div className='p-8 px-2 text-center lg:px-16'>
      <div className='flex flex-row gap-2 text-2xl sm:text-3xl md:text-4xl'>
        <div className='flex flex-1 flex-col justify-center'>
          <div className='mt-[.45em] h-[2px] flex-grow-0 bg-gradient-to-bl from-yellow-700 via-yellow-300 to-yellow-700'></div>
        </div>
        <h1 className='m-0 inline-block font-brand leading-none'>
          <span className='bg-gradient-to-bl from-yellow-700 via-yellow-300 to-yellow-700 bg-clip-text font-normal text-transparent'>
            scriptHungry
          </span>
        </h1>
        <div className='flex flex-1 flex-col justify-center'>
          <div className='mt-[.45em] h-[2px] flex-grow-0 bg-gradient-to-bl from-yellow-700 via-yellow-300 to-yellow-700'></div>
        </div>
      </div>

      <h2 className='m-0 inline-block pt-2 text-3xl sm:pt-4 sm:text-4xl md:text-5xl'>
        <span className='bg-gradient-to-bl from-yellow-700 via-yellow-300 to-yellow-700 bg-clip-text font-normal text-transparent'>
          super fast cloud web sites
        </span>
      </h2>
    </div>
  )
}
