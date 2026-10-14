import axios from 'axios';
import './axiosConfig';

export const APIServices = ( function () {

    function get({ url, payload }) {
        return axios.get(url, { params: payload })
            .then(res => res)
            .catch(error => [error, console.log(error)])
    }

    function post({ url, payload }) {
        return axios.post(url, payload)
            .then(res => res)
            .catch(error => [error, console.log(error)])
    }

    function put({ url, payload }) {
        return axios.put(url, payload)
            .then(res => res)
            .catch(error => error)
    }

    function deletes({ url, payload }) {
        return axios.delete(url, { params: payload })
            .then(res => res)
            .catch(error => error)
    }

    return {
        get: get,
        post: post,
        put: put,
        deletes : deletes
    }

})();