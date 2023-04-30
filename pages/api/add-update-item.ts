import fs from "fs-extra";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import FormData from "form-data";
import axios from "axios";
import { respType } from "../../lib/interfaces";

export const config = {
    api: {
      bodyParser: false,
    },
};
const BASE_URL = 'http://localhost:8000';

const AddUpdateItem = async (req:NextApiRequest,res:NextApiResponse): Promise<respType> => {
    const token: string = req.query.token ? req.query.token as string : "";
    let response: respType = {status: false,message:'request error'}

    if(token)
    {
        let mess = 'request data not found';
        try
        {
            const form = new formidable.IncomingForm();
            form.multiples = true;
            form.maxFileSize = 10 * 1024 * 1024; // 10MB
            form.allowEmptyFiles = false;
            const formData = await new Promise(function(resolve, reject) {
                form.parse(req, function(err, fields, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve([fields,files]);
                });
            });
            const formFields = formData[0];
            const uploadedfiles = formData[1];
            const filepath = uploadedfiles['image'].filepath;
            const filename = uploadedfiles[`image`].newFilename;
            const mimetype = uploadedfiles[`image`].mimetype;
            const filetype = mimetype.split("/").pop();
            const newfilename = `${filename}.${filetype}`;
            if(filepath && formFields)
            {
                let url = `${BASE_URL}/api/item`; // post
                const title: string = formFields['title'];
                const description: string = formFields['description'];
                if("itemID" in formFields){
                    let itemId = parseInt(formFields['itemID']);
                    if(itemId > 0){
                        url = `${BASE_URL}/api/item/${itemId}`; // update
                    }
                }
                const rawData = await fs.readFileSync(filepath);
                mess = 'image file error';
                if(rawData)
                {
                    mess = 'server access error';
                    const formData = new FormData();
                    formData.append('title',title);
                    formData.append('description', description);
                    formData.append("image", Buffer.from(rawData), { filename: newfilename});
                    await axios({
                        method: 'POST',
                        url: url,
                        data: formData,
                        headers: {
                            ...formData.getHeaders(),
                            'Authorization': 'Bearer '+token
                        }
                    }).then(result => {
                        const results = result.data;
                        //console.log(result);
                        response.status = results.status;
                        mess = results.message;
                    }).catch(err => {
                        const errResult = err.response.data;
                        //console.log(err.response.data);
                        mess = errResult.message;
                    });
                }
            }
        }
        catch(e: any){
            console.log(e.message);
            mess = 'operation error';
        }
        response.message = mess;
    }
    res.status(200).json(response);
    return;
}
export default AddUpdateItem;