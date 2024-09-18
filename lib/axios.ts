import Axios from 'axios';

const axios = Axios.create({
    baseURL: '',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
});

export { axios };
