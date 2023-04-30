import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { activeState } from "../store/userSlice";
import Layout from "../components/layout";
import Loader from "../components/loaders/LoaderPulse";
import { API_POST_REQUEST, validText } from "../lib/util";

export default function Login(){
    const router = useRouter();
    const dispatch = useDispatch();
    const [submitting,setSubmitting] = useState(false);
    const [error,setError] = useState('');

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const pval = e.target.tval1.value;
        const pval2 = e.target.tval2.value;
        if(!validText(pval,'email')){
            setError('invalid email');
            return;
        }
        setError('');
        setSubmitting(true);
        const data = {
            email: pval,
            password: pval2
        };
        const endpoint = '/api/login';
        const jsonData = JSON.stringify(data);
        const postReq = {...API_POST_REQUEST,body:jsonData}
        const response = await fetch(endpoint,postReq);
        const results = await response.json();
        let error = results.message;
        if(results.status){
            error = null;
            const token = results.data.token;
            localStorage.setItem('pr7rg0ko2',token);
            dispatch(activeState({signedIn:true,user: {userId:results.data.id,authToken:token,user_name:results.data.name}}));
            router.push(`/dashboard`);
        }
        setError(error);
        setSubmitting(false);
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full min-w-full">
                <form onSubmit={onSubmitForm} className="flex flex-col w-2/3 md:w-1/4">
                    {(error !== null) && (
                        <div className="max-w-md py-0 -mb-3 text-sm text-center">
                            <p className="text-sm font-medium text-center text-red-500">{error}</p>
                        </div>
                    )}
                    <label className="block py-4">
                        <span className="text-gray-700">Email address</span>
                        <input type="email" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            placeholder="john@example.com"
                            name="tval1"
                            required
                            />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Password</span>
                        <input type="password" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                            name="tval2"
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
                            <button type="submit" className="w-full p-2 font-medium text-center text-white bg-red-500 rounded-md">Login</button>
                        </div>
                    )}
                </form>
            </div>
        </Layout>
        
    )
}