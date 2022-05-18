import { motion } from 'framer-motion'

import { fadeInRight } from '~/lib/animations'

export const Hero = () => {
  return (
    <>
      <svg className='absolute h-0 w-0'>
        <clipPath id='cloud-clip-path' clipPathUnits='objectBoundingBox'>
          <path d='M0.839,1 C0.928,1,1,0.882,1,0.736 C1,0.611,0.947,0.506,0.875,0.479 C0.874,0.214,0.742,0,0.58,0 C0.468,0,0.371,0.101,0.321,0.25 C0.305,0.239,0.289,0.233,0.271,0.233 C0.207,0.233,0.154,0.311,0.146,0.412 C0.063,0.439,0,0.559,0,0.703 C0,0.867,0.081,1,0.181,1 C0.209,1,0.82,1,0.839,1'></path>
        </clipPath>
      </svg>
      <div className='hero flex flex-col gap-8 bg-base-200 bg-transparent p-8 xl:flex-row'>
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className='hero-content h-[200px] w-[400px] flex-col object-cover p-0 drop-shadow-lg xl:flex-row'
          style={{ clipPath: 'url(#cloud-clip-path)' }}
          variants={fadeInRight}
        >
          <source src='https://res.cloudinary.com/scripthungry-com-prog/video/upload/ac_none,c_scale,e_accelerate:-10,q_auto,vc_auto,f_auto,w_500/v1651437759/mixkit-flight-above-the-cloud-level-loop-video-32991-medium_upevqf.mp4' />
        </motion.video>
        <div className='flex-1 bg-gradient-to-b from-orange-400 to-orange-600 bg-clip-text text-center'>
          <h1 className='m-0 mb-6 text-5xl font-bold text-transparent md:text-6xl lg:text-7xl 2xl:text-8xl'>
            <div className='mb-2 text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl'>
              Super fast
            </div>
            <div>cloud web sites</div>
          </h1>
        </div>
      </div>
    </>
  )
}
