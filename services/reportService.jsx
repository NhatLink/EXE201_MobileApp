import { API } from "./api";

export const reportService = {
  CreateReport(data) {
    return API.post("/api/v1/reports/CreateReport", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  GetReportByCustomerId(id, page, size, status) {
    return API.get(`/api/v1/reports/GetReportByCustomerId/${id}`, {
      params: {
        page,
        size,
        status,
      },
    });
  },
};
