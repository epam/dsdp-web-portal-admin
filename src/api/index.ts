import { Api } from './setupApi';
import { API_URL, MOCK_API_URL } from '../constants/baseUrl';

const headers = {
  'Content-Type': 'application/json',
};

export const api = new Api(API_URL, headers);
export const mockApi = new Api(MOCK_API_URL, headers);
export const localesApi = new Api(globalThis.location.origin, headers);

export const isAvoidAuth: boolean = ['true', '1'].includes(import.meta.env.AVOID_AUTH);
