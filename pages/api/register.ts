import type { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/apiserver";
import { registerUser, respType } from "../../lib/interfaces";

const Register = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    let response: respType = {status: false,message:'request error'}

    const payload: registerUser = req.body;
    if(payload.name && payload.email && payload.password && payload.c_password)
    {
        let mess = 'server access error';
        try
        {
            /*await axios.post('http://localhost:8000/api/auth/register', {
                        name: payload.name,
                        email: payload.email,
                        password: payload.password,
                        c_password: payload.c_password
                    }).then(result => {
                        const results = result.data;
                        response.status = results.status;
                        let respMess = results.message;
                        console.log(respMess)
                    }).catch(err => {
                        console.log(err.response.data)
                    })*/ // works
            const { data } = await apiserver.post('/api/auth/register',payload);
            if(data){
                mess = data.message;
                response.status = data.status;
                if(!data.status){
                    if(mess.toLowerCase() === 'validation error'){
                        if("email" in data.data){
                            mess = data.data['email'][0];
                        }
                        if("name" in data.data){
                            mess = data.data['name'][0];
                        }
                        if("password" in data.data){
                            mess = data.data['password'][0];
                        }
                        if("c_password" in data.data){
                            mess = data.data['c_password'][0];
                        }
                    }
                }
            }
            //console.log(data);
        }
        catch(e: any){
            console.log(e.message);
        }
        response.message = mess;
    }
    res.status(200).json(response);
    return;
}
export default Register;