import type { DataProvider } from "@refinedev/core";
import api from "../api";

export const API_BASE_URL = import.meta.env.VITE_BASE_API;

export const dataProvider: DataProvider = {
  getApiUrl: () => API_BASE_URL,
  getOne: async ({ resource, id }) => {
    const response =
      id == -1
        ? await api.get(`${API_BASE_URL}/${resource}/`)
        : await api.get(`${API_BASE_URL}/${resource}/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.data;

    return { data };
  },
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids) {
      ids.forEach((id) => params.append("id", id.toString()));
    }

    const response = await api.get(
      `${API_BASE_URL}/${resource}?${params.toString()}/`
    );

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.data;

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await api.put(
      `${API_BASE_URL}/${resource}/${id}/`,
      variables
    );
    if (response.status < 200 || response.status > 299) throw response;

    const data = response.data;

    return { data };
  },
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();
    const accessToken = localStorage.getItem("access_token");
    const current: number = pagination?.current || 0;
    const pageSize: number = pagination?.pageSize || 0;
    if (pagination) {
      params.append("start", ((current - 1) * pageSize).toString());
      params.append("end", (current * pageSize).toString());
    }
    if (sorters && sorters.length > 0) {
      params.append("sort", sorters.map((sorter) => sorter.field).join(","));
      params.append("order", sorters.map((sorter) => sorter.order).join(","));
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter) {
          params.append(`${filter.field}_${filter.operator}`, filter.value);
        }
      });
    }
    const response = await fetch(
      `${API_BASE_URL}/${resource}/?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 401) RefreshToken();
    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return {
      data,
      total: data.length,
    };
  },
  create: async ({ resource, variables }) => {
    const accessToken = localStorage.getItem("access_token");
    // const response = await api.post(
    //   `${API_BASE_URL}/${resource}/`,
    //   variables
    // );
    const response = await fetch(`${API_BASE_URL}/${resource}/`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  deleteOne: async ({ resource, id }) => {
    const accessToken = localStorage.getItem("access_token");
    //const response = await api.delete(`${API_BASE_URL}/${resource}/${id}/`);
    const response = await fetch(`${API_BASE_URL}/${resource}/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
};
const RefreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: "POST",
    body: JSON.stringify({ refresh: refresh }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
  if (response.status < 200 || response.status > 299) throw response;
  const data = await response.json();
  localStorage.setItem("access_token", data.access);
};
