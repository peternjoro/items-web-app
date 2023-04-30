import styled from "styled-components";
import Image from "next/image";
import moment from "moment-timezone";
import { forwardRef, Fragment, useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable, useGlobalFilter,  useAsyncDebounce, usePagination } from "react-table";
import { Menu,Transition } from "@headlessui/react";
import { BiChevronDown,BiChevronsLeft,BiChevronsRight,BiChevronLeft,BiChevronRight } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { AiOutlineUnlock } from "react-icons/ai";
import { SlRefresh } from "react-icons/sl";
import { activeState,authUser,productItems } from "../../store/userSlice";
import { classNames } from "../../lib/util";

const cols = [
    {Header:'Image',accessor:'filename'},
    {Header:'Product Name',accessor:'title'},
    {Header:'Description',accessor:'description'},
    {Header:'Owner',accessor:'created_by'},
    {Header:'Actions',accessor:'action'}
];

const allowedActions = ['edit','delete'];

const IndeterminateCheckbox = forwardRef(({indeterminate, ...rest}, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
    },[resolvedRef,indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />
});
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';
// Global filter component 
function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter}){
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(globalFilter);
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 100);
    
    return (
        <label className="flex items-center justify-center w-full">
            <input
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                className={classNames("block flex-grow rounded-md border-gray-300 shadow-sm text-gray-700",
                    "focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50")}
                placeholder={`Search here`}
                />
        </label>
    )
}
const Styles = styled.div`
    padding: 1rem;

    table {
        border-spacing: 0;
        /*border: 1px solid black;*/

        tr {
            :last-child {
            td {
                border-bottom: 0;
            }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid rgba(42, 187, 155, .1);
            border-right: 1px solid rgba(42, 187, 155, .1);
            /*border-bottom: 1px solid black;
            border-right: 1px solid black;*/

            :last-child {
            border-right: 0;
            }
        }
    }

    .pagination {
        padding: 0.5rem;
    }
`

export default function SimpleReactTable({ onEdit, onDelete }){
    const [reloading,setReloading] = useState(false);
    const dispatch = useDispatch();
    const columns = useMemo(() => cols,[]);
    const user = useSelector(authUser);
    const curItems = useSelector(productItems);
    const data = curItems.items;

    const props = useTable({
            columns,
            data
        },
        useGlobalFilter,
        usePagination
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        getToggleHideAllColumnsProps,
        preGlobalFilteredRows,
        setGlobalFilter,
        state,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter }
    } = props;

    const reloadProducts = () => {
        const token = localStorage.getItem('pr7rg0ko2');
        if(token){
            if(!reloading){
                (async () => {
                    setReloading(true);
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
                    setReloading(false);
                })();
            }
        }
    }

    return (
        <Styles>
            <div className="flex flex-col w-full">
                <pre className='hidden'>
                    <code>
                    {JSON.stringify(
                        {
                        pageIndex,
                        pageSize,
                        pageCount,
                        canNextPage,
                        canPreviousPage,
                        },
                        null,
                        2
                    )}
                    </code>
                </pre>
                <div className="flex flex-col w-full py-4 space-y-5 md:space-y-0 md:items-center md:justify-between md:flex-row">
                    <div className="flex items-center pr-10 space-x-2 md:pr-0">
                        <GlobalFilter 
                            preGlobalFilteredRows={preGlobalFilteredRows} 
                            globalFilter={state.globalFilter}
                            setGlobalFilter={setGlobalFilter}
                            />
                            <button className="h-full p-1 outlined-action-btn" title="Refresh Products" onClick={() => reloadProducts()}>
                                <SlRefresh className="w-5 h-5"/>
                                <span>Refresh</span>
                            </button>
                    </div>
                    <div className="flex">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className={classNames("inline-flex w-full justify-center rounded-md bg-black",
                                    "bg-opacity-30 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none",
                                    "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75")}>
                                    Show / Hide Columns
                                    <BiChevronDown className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"/>
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                >
                                <Menu.Items className={classNames("absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100",
                                    "rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none")}>
                                    <div className="flex flex-col px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <label className="inline-flex items-center">
                                                    <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} 
                                                        className="simple-checkbox"
                                                        />
                                                    <span className="ml-2">Toggle All</span>
                                                </label>
                                            )}
                                        </Menu.Item>
                                        {allColumns.map(column => {
                                            //console.log(column.Header);
                                            return (
                                                    <Menu.Item key={column.id}>
                                                        {({ active }) => (
                                                            <label className="inline-flex items-center">
                                                                <input type="checkbox" {...column.getToggleHiddenProps()} 
                                                                    className="simple-checkbox"
                                                                    />
                                                                    <span className="ml-2">{column.Header}</span>
                                                            </label>
                                                        )}
                                                    </Menu.Item>
                                            )
                                        })}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
                <table {...getTableProps()} className="border rounded border-softGreen border-opacity-20">
                    <thead>
                        {headerGroups.map((headerGroup,index) => (
                            //console.log(headerGroup.id)
                            <tr {...headerGroup.getHeaderGroupProps()} key={index} className='text-sm'>
                                {headerGroup.headers.map((column,index) => {
                                    const headerCol = column.Header;
                                    let textAlighment = 'text-left';
                                    /*if(headerCol === "Actions"){
                                        textAlighment = 'text-right';
                                    }*/
                                    //console.log(column.id);
                                    return (
                                        <th {...column.getHeaderProps()} key={index} className={`${textAlighment}`}>
                                            {column.render('Header')}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, index) => {
                            prepareRow(row);
                            let rowId = 0;
                            if("id" in row.original){
                                rowId = row.original.id;
                            }
                            let userid = 0;
                            if("user_id" in row.original){
                                userid = parseInt(row.original.user_id);
                            }
                            //console.log(`id: ${rowId}, status: ${recordStatus}`);
                            return (
                                <tr {...row.getRowProps()} key={index} className='text-sm'>
                                    {row.cells.map((cell, index) => {
                                        const curIndex = parseInt(index) + 1;
                                        const header = cell.column.Header;
                                        if(header === "Actions"){
                                            if(parseInt(user.userId) !== userid){
                                                return (
                                                    <td {...cell.getCellProps()} className="flex items-center justify-center cursor-pointer" key={index}>
                                                        <AiOutlineUnlock className="w-5 h-5" title="You cannot edit this item" key={`locked_${index}`}/>
                                                    </td>
                                                )
                                            }
                                            else {
                                                return (
                                                    <td {...cell.getCellProps()} className="flex items-center justify-center cursor-pointer" key={index}>
                                                        {allowedActions.includes("delete") &&(
                                                            <MdDeleteForever className="w-5 h-5 fill-red-500" title="Delete Item" 
                                                                key={`delete_${index}`}
                                                                onClick={() => onDelete(rowId)}
                                                            />
                                                        )}
                                                        {allowedActions.includes("edit") &&(
                                                            <FiEdit className="w-5 h-5" title="Edit Item" key={`edit_${index}`} onClick={() => onEdit(rowId)}/>
                                                        )}
                                                    </td>
                                                )
                                            }
                                        }
                                        if(header === "Image"){
                                            return (
                                                <td {...cell.getCellProps()} key={index} className="relative block">
                                                    <Image alt="Product Image" src={`https://picsum.photos/id/${parseInt(curIndex)}/200`} width={30} height={30} className="rounded-md opacity-100"/>
                                                </td>
                                            )
                                        }
                                        return (
                                            <td {...cell.getCellProps()} key={index}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {rows.length > pageSize && (
                    <>
                        <div className="flex mt-1 text-xs">Showing {pageIndex === 0 ? 0 : pageSize * pageIndex} to {pageIndex === 0 ? pageSize : (rows.length > (pageSize * (pageIndex + 1)) ? pageSize * (pageIndex + 1) : rows.length ) } of {rows.length} records</div>
                        <div className="flex flex-col mt-2 space-y-3 pagination md:flex-row md:space-y-0">
                            <div className="flex md:items-center">
                                <button className="simple-paginator-navigator-btn p-1 px-1.5 items-center" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                                    <BiChevronsLeft className="w-5 h-5"/>
                                </button>{" "}
                                <button className="items-center p-1 simple-paginator-navigator-btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
                                    <BiChevronLeft className="w-5 h-5"/>
                                </button>{" "}
                                <span className="flex items-center mx-3 text-sm">
                                    Page{" "}
                                    <strong className="ml-1">
                                        {pageIndex + 1} of {pageOptions.length}
                                    </strong>{" "}
                                </span>
                                <button className="items-center p-1 simple-paginator-navigator-btn" onClick={() => nextPage()} disabled={!canNextPage}>
                                    <BiChevronRight className="w-5 h-5"/>
                                </button>{" "}
                                <button className="simple-paginator-navigator-btn p-1 px-1.5 items-center" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                                    <BiChevronsRight className="w-5 h-5"/>
                                </button>{" "} 
                            </div>
                            <div className="flex md:items-center">
                                <span className="flex items-center mx-2 text-sm">
                                    Go to page:{" "}
                                    <input
                                        type="number"
                                        defaultValue={pageIndex + 1}
                                        onChange={e => {
                                        const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                        gotoPage(page);
                                        }}
                                        style={{ width: "80px" }}
                                        className="flex mx-2 border-gray-300 rounded-md h-fit focus:border-indigo-200"
                                    />
                                </span>{" "}
                                <select
                                    value={pageSize}
                                    onChange={e => {
                                        setPageSize(Number(e.target.value));
                                    }}
                                    className="flex border-gray-300 rounded-md focus:border-indigo-200"
                                    >
                                    {[10, 20, 30, 40, 50].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Styles>
    )
}