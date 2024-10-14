import { API } from "./api";

export const voucherService = {
  GetVoucherBySalonId(salonId) {
    return API.get(`/api/v1/vouchers/GetVoucherBySalonIdNoPaging/${salonId}`);
  },
};
