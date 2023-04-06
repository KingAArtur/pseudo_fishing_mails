import React, { useState } from 'react';
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Loader from '../../components/Loader';


const Home = () => {

     const [loading] = useState(false)

     if (loading)
          return <Loader />

     return (
          <>
               <section className="bg-black ">
                    <DashboardHeader />

                    <div className="container px-5 py-12 mx-auto lg:px-20">

                         <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
                              <h1 className="mb-6 text-3xl font-medium text-white">
                                   what
                              </h1>
                         </div>
                    </div>
                    <Footer />
               </section>
          </>
     )
}

export default Home;