import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const strapi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
});

export const fetchFromStrapi = async (path) => {
  try {
    const response = await strapi.get(`/api/${path}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching from Strapi at ${path}:`, error);
    return null;
  }
};
