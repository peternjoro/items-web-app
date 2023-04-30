import type { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/apiserver";
import { respType } from "../../lib/interfaces";

const Logout = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    const token: string = req.query.token ? req.query.token as string : "";
    let response: respType = {status: false,message:'request error'}

    if(token)
    {
        let mess = 'server access error';
        try
        {
            const { data } = await apiserver.get('/api/auth/logout?token='+token);
            if(data){
                mess = data.message;
                response.status = data.status;
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
export default Logout;