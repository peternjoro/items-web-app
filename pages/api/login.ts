import type { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/apiserver";
import { respType } from "../../lib/interfaces";

type login = {
    email: string,
    password: string
}

const Login = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    let response: respType = {status: false,message:'request error'}

    const payload: login = req.body;
    if(payload.email && payload.password)
    {
        let mess = 'server access error';
        try
        {
            const { data } = await apiserver.post('/api/auth/login',payload);
            if(data){
                mess = data.message;
                response.status = data.status;
                if(!data.status){
                    if(mess.toLowerCase() === 'validation error'){
                        if("email" in data.data){
                            mess = data.data['email'][0];
                        }
                        if("password" in data.data){
                            mess = data.data['password'][0];
                        }
                    }
                }
                else response.data = data.data;
            }
           // console.log(data);
        }
        catch(e: any){
            console.log(e.message);
        }
        response.message = mess;
    }
    res.status(200).json(response);
    return;
}
export default Login;