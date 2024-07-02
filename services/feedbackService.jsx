import { API } from "./api";

export const feedbackService = {
  CreateFeedback(data) {
    return API.post("/api/v1/feedbacks/CreateFeedback", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
