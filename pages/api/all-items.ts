import type { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/apiserver";
import { respType } from "../../lib/interfaces";

const AllItems = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    let response: respType = {status: false,message:'request error'}

    let mess = 'server access error';
    try
    {
        const { data } = await apiserver.get('/api/all-items');
        if(data){
            mess = data.message;
            response.status = data.status;
            response.data = data.data;
        }
    }
    catch(e: any){
        console.log(e.message);
    }
    response.message = mess;
    res.status(200).json(response);
    return;
}
export default AllItems;