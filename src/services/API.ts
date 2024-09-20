import axios from "axios";

const servicesApi = axios.create({
  withCredentials: false,
  timeout: 60000,
  headers: {
    common: {
      Accept: "application/json",
    },
  },
});

export const postData = async (
  param: string,
  data: any,
  withToken: boolean = false,
) => {
  if (withToken) {
    const token = localStorage.getItem("token");
    return servicesApi.post(param, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return servicesApi.post(param, data);
};
export const putData = async (
  param: string,
  data: any,
  withToken: boolean = false,
) => {
  if (withToken) {
    const token = localStorage.getItem("token");
    return servicesApi.put(param, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return servicesApi.put(param, data); // Use PUT instead of POST
};

export const getData = async (
  param: string,
  data: any,
  withToken: boolean = false,
) => {
  if (withToken) {
    const token = localStorage.getItem("token");
    return servicesApi.get(param, {
      params: data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return servicesApi.get(param, { params: data });
};

export const deleteData = async (
  param: string,
  data: any,
  withToken: boolean = false,
) => {
  if (withToken) {
    const token = localStorage.getItem("token");
    return servicesApi.delete(param, {
      headers: { Authorization: `Bearer ${token}` },
      data,
    });
  }
  return servicesApi.delete(param, { data });
};
