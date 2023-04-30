export const API_POST_REQUEST = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}
// join multiple classnames
export function classNames(...classes){
    return classes.filter(Boolean).join(' ');
}
export function validText(str,type='text-only'){
    let valid = false;
    if(type && str){
        if(type === 'text-only'){
            valid = /^[a-zA-Z']*$/.test(str);
        }
        if(type === 'names'){
            valid = /^[a-zA-Z' ]*$/.test(str);
        }
        if(type === 'alpha-numeric'){
            if(/^[a-zA-Z0-9'-._,() ]*$/.test(str) === true) valid = true;
        }
        if(type === 'email'){
            valid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/.test(str);
        }
    }
    return valid;
}
export function objectNotEmpty(obj)
{
    let isEmpty = false;
    if(obj)
    {
        for(const keys in obj){
            isEmpty = true;
            break;
        }
    }
    return isEmpty;
}
export function timeDifference(fromDatetime,toDatetime,diffIn){
    let diff = 0;
    if(fromDatetime && toDatetime && diffIn){
        let diffms = Math.abs(new Date(toDatetime) - new Date(fromDatetime));
        if(diffms > 0){
            diff = Math.floor(diffms/1000); // in seconds
            if(diffIn === 'min'){
                diff = Math.floor((diffms/1000)/60);
            }
        }
    }
    return diff;
}
export function getObjFromArray(arrayofObjs,findKey,findVal){
    let objItem = null;
    let objIndex = null;
    if(arrayofObjs && arrayofObjs.length > 0 && findKey && findVal){
        const obj = arrayofObjs.filter(item => item[findKey] === findVal);
        if(obj.length > 0){
            objItem = obj[0];
            objIndex = arrayofObjs.findIndex(obj => obj[findKey] === findVal);
        }
    }
    return [objItem,objIndex];
}