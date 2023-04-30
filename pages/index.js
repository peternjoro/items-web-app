import { useEffect, useState } from 'react';
import Image from 'next/image';
import Layout from '../components/layout';
import Loader from '../components/loaders/LoaderSpin';

export default function IndexPage(){
    const [error,setError] = useState('');
    const [fetchingStats,setFetchingStats] = useState(false);
    const [showItems,setShowItems] = useState(4);
    const [products,setProducts] = useState([]);

    useEffect(() => {
        localStorage.removeItem('pr7rg0ko2');
        if(!fetchingStats){
            (async () => {
                setFetchingStats(true);
                const endpoint = `/api/all-items`;
                const response = await fetch(endpoint);
                const results = await response.json();
                let error = results.message;
                if(results.status){
                    error = null;
                    setProducts(results.data);
                }
                setError(error);
                setFetchingStats(false);
            })();
        }
    },[]);

    const renderItems = () => {
        if(error){
            return (
                <div className='flex items-center justify-center w-full p-5'>
                    {error}
                </div>
            )
        }
        if(fetchingStats) {
            return (
                <div className='flex items-center justify-center w-full p-5'>
                    <Loader />
                </div>
            )
        }
        if(products.length === 0){
            return (
                <div className='flex items-center justify-center w-full p-5'>
                    <h3>No product found</h3>
                </div>
            )
        }
        return (
            <div className='flex flex-col'>
                <div className='grid w-full md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-7'>
                    {products.map((product,index) => {
                        let curIndex = parseInt(index) + 1;
                        if(curIndex <= showItems){
                            return (
                                <div className="items-start justify-start md:justify-between grid-col" key={index}>
                                    <div className="relative block float-left w-1/4 h-40 overflow-hidden bg-no-repeat rounded-lg md:w-1/2">
                                        <Image alt="Product Image" src={`https://picsum.photos/id/${parseInt(index)}/200`} layout='fill' 
                                            className="object-fill rounded-lg opacity-100"/>
                                    </div>
                                    <div className='flex flex-col w-3/4 mx-5 mt-2 md:w-1/2'>
                                        <h3 className='flex text-[0.82rem]'><strong>{product.title}</strong></h3>
                                        <p className='py-3 text-[0.8rem] md:line-clamp-3'>{product.description}</p>
                                        <h3 className='text-[0.8rem]'>By: {product.created_by}</h3>
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
                {products.length > showItems &&(
                    <div className="flex items-center justify-center w-full mt-10 mb-5">
                        <button className="flex p-2 font-light bg-gray-300 border border-gray-200 rounded-md w-fit"
                            onClick={() => setShowItems(showItems * 2)}>
                            <strong>View More Products</strong>
                        </button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <Layout>
            <div className='flex flex-col w-full h-full'>
                <h3 className="flex mt-5 mb-7"><strong>Products</strong></h3>
                {renderItems()}
            </div>
        </Layout>
    )
}