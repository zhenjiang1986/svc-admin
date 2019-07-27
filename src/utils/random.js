import {v1 ,v4} from 'uuid'


function uuid_no_hyphen() {
    return v4().replace(/-/g, '');
}

// export  {
//     v1 as uuid_v1,
//     v4 as uuid_v4,
//     uuid_no_hyphen     
// }


export default {
    uuid_v1 : v1,
    uuid_v4 : v4,
    uuid_no_hyphen     
}


