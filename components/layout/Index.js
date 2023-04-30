import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FaPowerOff } from "react-icons/fa";
import { loginStatus,authUser,activeState } from '../../store/userSlice';

export default function Layout({ pageTitle, children }){
    const router = useRouter();
    const dispatch = useDispatch();
    const [signingOut,setSigningOut] = useState(false);
    const loggedIn = useSelector(loginStatus);
    const user = useSelector(authUser);

    const signOut = async () => {
        const token = localStorage.getItem('pr7rg0ko2');
        if(token)
        {
            if(!signingOut)
            {
                setSigningOut(true);
                const endpoint = '/api/logout?token='+token;
                const response = await fetch(endpoint);
                const results = await response.json();
                let error = results.message;
                //console.log(results);
                if(results.status){
                    error = null;
                    localStorage.removeItem('pr7rg0ko2');
                    dispatch(activeState({signedIn:false,user: {userId:0,authToken:'',user_name:''}}));
                    router.push(`/`);
                }
                setSigningOut(false);
            }
        }
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>{ pageTitle ? pageTitle : 'Products' }</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link rel="icon" href="/images/identigate-sm.png" />
            </Head>
            <main className={`flex flex-col main`}>
                <div className="w-full bg-white shadow-md header-height">
                    <div className="container flex items-center justify-between h-full mx-auto">
                        <div className="flex ml-5 md:ml-0">
                            <Image priority alt="Identigate" src="/images/identigate.png" height={50} width={150}/>
                        </div>
                        <div className="flex flex-row mr-3 md:mr-0">
                            {loggedIn ? (
                                <div className='flex items-center'>
                                    <strong><h3 className='mr-5 text-sm md:text-base'>{user.user_name}</h3></strong>
                                    <div className='flex cursor-pointer' onClick={() => signOut()} title='Sign out now'><FaPowerOff /></div>
                                </div>
                            ) : (
                                <>
                                    <Link  href={`/login`} title='Login now'>
                                        <div className='mr-5 text-sm md:text-base link-hover'>
                                            Login
                                        </div>
                                    </Link>
                                    <Link  href={`/register`} title='Register now'>
                                        <div className='mr-5 text-sm md:text-base link-hover'>
                                            Register
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='flex flex-grow w-full mt-1'>
                    <div className='container flex mx-auto'>
                        <div className='flex flex-col w-full ml-5 mr-3 md:ml-0 md:mr-0'>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}