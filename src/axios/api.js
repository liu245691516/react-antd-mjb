import { get, post } from './$axios';

//登录
export function userLogin(data){ return post('api/v1/site/login', data) };

//我的资源 - 媒体资源 - 媒体列表
export function getMediaList(data) { return get('api/v1/source/media', data); }
