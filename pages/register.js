import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Loader from "../components/loaders/LoaderPulse";
import { API_POST_REQUEST, validText } from "../lib/util";

export default function Register(){
    const router = useRouter();
    const [submitting,setSubmitting] = useState(false);
    const [error,setError] = useState('');
    
    const onSubmitForm = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.tval1.value;
        const pval = e.target.tval2_1.value;
        const pval2 = e.target.tval2_2.value;
        if(!validText(name,'names')){
            setError('wrong name format')
            return;
        }
        if(!validText(email,'email')){
            setError('invalid email');
            return;
        }
        if(pval && pval.length >= 6)
        {
            if(pval !== pval2){
                setError("password didn't match");
                return;
            }
            setError('');
            setSubmitting(true);
            const data = {
                name,
                email,
                password: pval,
                c_password: pval2,
            };
            const endpoint = '/api/register';
            const jsonData = JSON.stringify(data);
            const postReq = {...API_POST_REQUEST,body:jsonData};
            const response = await fetch(endpoint,postReq);
            const results = await response.json();
            let error = results.message;
            if(results.status){
                alert(error);
                error = null;
                router.push(`/login`);
            }
            setError(error);
            setSubmitting(false);
        }
        else {
            setError('password must be at least 6 characters');
        }
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full">
                <form onSubmit={onSubmitForm} className="flex flex-col w-2/3 md:w-1/4">
                    {(error !== null) && (
                        <div className="max-w-md py-0 -mb-3 text-sm text-center">
                            <p className="text-sm font-medium text-center text-red-500">{error}</p>
                        </div>
                    )}
                    <label className="block py-4">
                        <span className="text-gray-700">Your Name</span>
                        <input type="text" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            placeholder="John Doe"
                            name="name"
                            required
                            />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Email address</span>
                        <input type="email" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            placeholder="john@example.com"
                            name="tval1"
                            required
                            />
                    </label>
                    <label className="block py-4">
                        <span className="text-gray-700">Password</span>
                        <input type="password" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            name="tval2_1"
                            required
                            placeholder="****"
                            />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Confirm Password</span>
                        <input type="password" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            name="tval2_2"
                            required
                            placeholder="****"
                            />
                    </label>
                    {submitting ? (
                        <div className="py-8">
                            <Loader />
                        </div>
                    ) : (
                        <div className="py-5">
                            <button type="submit" className="w-full p-2 font-medium text-center text-white bg-red-500 rounded-md">Register</button>
                        </div>
                    )}
                </form>
            </div>
        </Layout>
        
    )
}
