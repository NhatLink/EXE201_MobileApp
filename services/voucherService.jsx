import { API } from "./api";

export const voucherService = {
  GetVoucherBySalonId(salonId, page, size) {
    return API.get(`/api/v1/vouchers/GetVoucherBySalonId/${salonId}`, {
      params: {
        page,
        size,
      },
    });
  },
};
