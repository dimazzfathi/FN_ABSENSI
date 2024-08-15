import Footer from './footer/page';
import Navbar from './navbar/page';
import Sidebar from './sidebar/page';

export default function Home() {
  return (
    
    <>
    <div className=''>

    
      <Navbar />
      <div className="flex flex-col w-full">
        
        <main className="flex-grow p-4">
        </main>
        <Footer />
    </div>
    </div>
    </>

    
  );
}

