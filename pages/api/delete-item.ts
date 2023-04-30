import type { NextApiRequest, NextApiResponse } from "next";
import apiserver from "../../lib/apiserver";
import { respType } from "../../lib/interfaces";

const DeleteItem = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    const token: string = req.query.token ? req.query.token as string : "";
    let response: respType = {status: false,message:'request error'}

    const { itemId } = req.body;
    if(itemId && token)
    {
        let mess = 'server access error';
        try
        {
            const { data } = await apiserver.delete(`/api/item/${parseInt(itemId)}?token=${token}`);
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
    }
    res.status(200).json(response);
    return;
}
export default DeleteItem;