import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import { objectNotEmpty, validText } from "../../lib/util";
import { selectedItem } from "../../store/userSlice";

const formdata = {
    name: '',
    desc: '',
    itemID: 0
}
export default function ItemAction(){
    const selected_item = useSelector(selectedItem);
    const [formData,setFormData] = useState(formdata);
    const [submitting,setSubmitting] = useState(false);
    const [error,setError] = useState('');
    const [image,setImage] = useState(null);
    const router = useRouter();
    const params = router.query;
    let action = params['acction-type'] === 'edit-product' ? 'Edit Product' : 'Add New Product';

    useEffect(() => {
        if(action === 'Edit Product'){
            if(objectNotEmpty(selected_item)){
                let formdata = {...formData,name:selected_item.title,desc:selected_item.description,itemID:selected_item.id};
                setFormData(formdata);
            }
        }
    },[]);

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('pr7rg0ko2');
        if(!image){
            setError('upload product image');
            return;
        }
        const name = formData.name;
        const desc = formData.desc;
        if(!validText(name,'alpha-numeric')){
            setError('invalid characters found in name');
            return;
        }
        if(!validText(desc,'alpha-numeric')){
            setError('invalid characters found in name');
            return;
        }
        if(!submitting)
        {
            setSubmitting(true);
            const form = new FormData();
            form.append("itemID",formData.itemID);
            form.append("title",name);
            form.append("description",desc);
            form.append("image",image);
            const config = {
                headers: { 
                    'Accept': '*/*',
                   'Content-Type': undefined,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                    'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
                    'Access-Control-Allow-Credentials': true
                },
                onUploadProgress: (event) => {
                    console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
                },
            }
            const { data } = await axios.post('/api/add-update-item?token='+token, form, config);
            let error = data.message;
            if(data.status){
                //error = null;
            }
            setError(error);
        }
    }
    const uploadFile = (event) => {
        let img = null;
        if(event.target.files && event.target.files[0]){
            img = event.target.files[0];
        }
        setImage(img);
    }

    return (
        <Layout pageTitle={action}>
            <div className="flex flex-col w-full h-full">
                <div className="flex items-center justify-between w-full mt-5 mb-7">
                    <h3><strong>{action}</strong></h3>
                    <Link href={`/dashboard`}>
                        <div className="items-center p-1 px-2 space-x-1 outlined-action-btn w-fit" title="Go Back">
                            <BiArrowBack/>
                            <span>Back</span>
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col w-full p-3 bg-white rounded">
                    <form onSubmit={onSubmitForm} className="flex flex-col">
                        {(error !== null) && (
                            <div className="max-w-md py-0 mb-5 text-sm text-center">
                                <p className="text-sm font-medium text-center text-red-500">{error}</p>
                            </div>
                        )}
                        <div className="flex items-center py-4">
                            <span className="flex w-1/3 text-gray-700 md:w-1/4">Product Name:</span>
                            <input type="text" className="block w-full mt-1 bg-gray-100 border-transparent rounded-md md:w-1/2 lg:w-1/3 focus:border-gray-500 focus:bg-white focus:ring-0"
                                placeholder="product name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData,name:e.target.value})}
                                />
                        </div>
                        <div className="flex items-center">
                            <span className="flex w-1/3 text-gray-700 md:w-1/4">Description:</span>
                            <textarea rows={2}  name="desc" className="w-full p-1 px-2 mt-1 border-0 rounded-md md:w-1/2 lg:w-1/3 outline outline-1 outline-softGreen"
                                placeholder="product description"
                                required
                                value={formData.desc}
                                onChange={e => setFormData({...formData,desc:e.target.value})}
                                />
                        </div>
                        <div className="flex items-center py-4">
                            <span className="flex w-1/3 text-gray-700 md:w-1/4">Image:</span>
                            <input type="file" name="imgfile" onChange={uploadFile}
                                className="flex w-full ml-0 border-0 rounded-md outline outline-1 md:w-1/2 lg:w-1/3 outline-softGreen"
                                accept="image/png, image/gif, image/jpeg"
                                />
                        </div>
                        <button type="submit" className="p-2 px-5 mt-5 text-center text-white rounded-md bg-primary w-fit">
                            {action === 'Edit Product' ? 'Update Product' : 'Add Product'}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}