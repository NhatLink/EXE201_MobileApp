import { API } from "./api";

export const collectionService = {
  SaveAsCustomerImageHistory(data) {
    return API.post(`/api/v1/customers/SaveAsCustomerImageHistory`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  GetCustomerImageHistoryByCustomerId(page, size, id) {
    return API.get(
      `api/v1/customers/GetCustomerImageHistoryByCustomerId/${id}`,
      {
        params: {
          page,
          size,
        },
      }
    );
  },
  UpdateCustomerImageHistory(id, data) {
    return API.put(`/api/v1/customers/UpdateCustomerImageHistory/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  DeleteCustomerImageHistory(id) {
    return API.delete(`/api/v1/customers/DeleteCustomerImageHistory/${id}`);
  },
};
