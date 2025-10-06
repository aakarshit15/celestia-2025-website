import React from 'react'
// import bgImg from "/figma/bg_img.png"

const Figma = () => {
  return (
    <>
        <div className="w-full h-screen bg-cover flex flex-col relative" style={{
            backgroundImage: "url('/bg_img.jpg')"
        }}>
            <div className="absolute w-full h-full" 
            style={{
    background: 'radial-gradient(circle 10000px, #02020C42, #0A0400)'
  }}
            ></div>
            <nav className="flex text-white justify-center lg:justify-end gap-10 py-5 md:text-xl lg:text-2xl lg:pr-20 z-10"
                
            >
                <span className="home font-cinzel">Home</span>
                <span className="leaderboard font-cinzel">Leaderboard</span>
            </nav>
            <div className='flex flex-col flex-grow justify-center items-center z-10'>
                <main className='flex flex-col justify-center items-center text-white font-cinzel'>
                    <div className="tag tracking-wider text-center md:text-xl lg:text-2xl">DIVE DEEP INTO THE REALMS OF MAGIC, MYSTERY & SPLENDOR</div>
                    <div className="event-name text-[50px] md:text-[80px] lg:text-[165px] font-black">CELESTIA</div>
                    <div className="theme text-3xl">ARABIAN NIGHTS</div>
                </main>
            </div>
        </div>
    </>
  )
}

export default Figma
