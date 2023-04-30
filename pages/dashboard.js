import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import moment from "moment-timezone";
import SimpleReactTable from "../components/datagrid/ReactTable";
import Layout from "../components/layout";
import { activeState,authUser,productItems } from "../store/userSlice";
import { API_POST_REQUEST, getObjFromArray, objectNotEmpty, timeDifference } from "../lib/util";

export default function Dashboard(){
    const router = useRouter();
    const dispatch = useDispatch();
    const [deleting,setDeleting] = useState(false);
    const [fetchingStats,setFetchingStats] = useState(false);
    const user = useSelector(authUser);
    const curItems = useSelector(productItems);

    useEffect(() => {
        if(curItems.items.length === 0){
            fetchStats();
        }
        else validateRefresh();
    },[curItems]);

    const fetchStats = async () => {
        const token = localStorage.getItem('pr7rg0ko2');
        if(token)
        {
            if(!fetchingStats){
                setFetchingStats(true);
                const endpoint = '/api/items-stats?token='+token;
                const response = await fetch(endpoint);
                const results = await response.json();
                let error = results.message;
                let curStats = {...curItems};
                if(results.status){
                    error = null;
                    const curItems = results.data.items;
                    curStats = {
                        ...curStats,
                        last_timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                        products: {total:results.data.totalItems,new:results.data.newItems,myproducts:results.data.myItems},
                        users: {total:results.data.totalUsers,new:results.data.newUsers},
                        visits: {total:results.data.totalVisits,new:results.data.newVisits},
                        items: curItems,
                    };
                    dispatch(activeState({items: curStats}));
                }
                setFetchingStats(false);
            }
        }
    }

    const validateRefresh = async () => {
        const lastFetchTstmp = curItems.last_timestamp;
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const seconds = timeDifference(lastFetchTstmp,now,"sec");
        if(seconds > 60){
            await fetchStats();
        }
    }

    const onItemDeleted = async (id) => {
        const token = localStorage.getItem('pr7rg0ko2');
        if(token)
        {
            if(confirm('Delete this product?'))
            {
                if(!deleting)
                {
                    setDeleting(true);
                    const endpoint = '/api/delete-item?token='+token;
                    const jsonData = JSON.stringify({itemId:id});
                    const postReq = {...API_POST_REQUEST,body:jsonData};
                    const response = await fetch(endpoint,postReq);
                    const results = await response.json();
                    let error = results.message;
                    if(results.status){
                        error = null;
                        fetchStats();
                    }
                    if(error){
                        alert(error);
                    }
                    setDeleting(false);
                }
            }
        }
    }
    const onEditItem = (id) => {
        if(parseInt(id) > 0){
            const item = getObjFromArray(curItems.items,"id",parseInt(id))[0];
            if(objectNotEmpty(item)){
                dispatch(activeState({item}));
                doAction('edit-item');
            }
        }
    }

    const doAction = (type) => {
        let path = `/new-product`;
        if(type === 'edit-item'){
            path = `/edit-product`;
        }
        router.push(path);
    }

    return (
        <Layout pageTitle={`Dashboard`}>
            <div className="flex flex-col w-full h-full">
                <h3 className="flex mt-5 mb-7"><strong>Dashboard</strong></h3>
                <div className="flex flex-col space-x-0 space-y-5 md:space-y-0 md:flex-row md:space-x-5">
                    <div className="flex flex-col w-full p-3 bg-white divide-y rounded shadow md:w-1/3 h-fit">
                        <h3>Products</h3>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>Total Products</h3>
                            <span className="stat-btn-view">{curItems.products.total}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>New Products</h3>
                            <span className="stat-btn-view">{curItems.products.new}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>My Products</h3>
                            <span className="stat-btn-view">{curItems.products.myproducts}</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full p-3 bg-white divide-y rounded shadow md:w-1/3 h-fit">
                        <h3>Users</h3>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>Total Users</h3>
                            <span className="stat-btn-view">{curItems.users.total}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>New Users</h3>
                            <span className="stat-btn-view">{curItems.users.new}</span>
                        </div>
                    </div>
                    <div className="flex flex-col w-full p-3 bg-white divide-y rounded shadow md:w-1/3 h-fit">
                        <h3>Visits</h3>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>Total Visits</h3>
                            <span className="stat-btn-view">{curItems.visits.total}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 text-sm">
                            <h3>New Visits</h3>
                            <span className="stat-btn-view">{curItems.visits.total}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col my-5">
                    <h3 className="mb-2"><strong>Products</strong></h3>
                    <div className="flex flex-col w-full p-3 bg-white rounded shadow">
                        <button className="p-1 px-2 outlined-action-btn w-fit" title="Add new product?" onClick={() => doAction('new-item')}>Add Product</button>
                        <hr className="mt-1"/>
                        <div className="flex flex-col my-0">
                            {curItems.items.length > 0 ? (
                                <SimpleReactTable onDelete={onItemDeleted} onEdit={onEditItem}/>
                            ) : (
                                <h3 className="my-5"><small>No Products found</small></h3>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}