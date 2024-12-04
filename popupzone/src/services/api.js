import axios from "axios";

const API_BASE_URL = "https://popup-zone-a3d172bdd420.herokuapp.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 팝업스토어 관련 API
export const getPopularPopups = async () => {
  const response = await api.get("/popups/popular");
  return response.data;
};

export const getAllPopups = async () => {
  const response = await api.get("/popups");
  return response.data;
};

export const getPopupDetails = async (id) => {
  const response = await api.get(`/popups/${id}`);
  return response.data;
};

export const createPopup = async (popupData) => {
  // 백앤드 API와 일치하는 형식으로 데이터 변환
  const formattedData = {
    title: popupData.popupName,
    brand_name: popupData.brandName,
    description: popupData.description,
    address: popupData.address,
    latitude: popupData.lat,
    longitude: popupData.lng,
    operating_hours: popupData.operatingHours,
    // 직접 startDate와 endDate 사용
    start_date: new Date(popupData.startDate).toISOString(),
    end_date: new Date(popupData.endDate).toISOString(),
    image_url: null, // 기본값
  };

  try {
    console.log("Sending data to API:", formattedData); // 디버깅용
    const response = await api.post("/popups/", formattedData);
    return response.data;
  } catch (error) {
    console.error("API 요청 데이터:", formattedData);
    console.error("API 에러 응답:", error.response?.data);
    throw new Error(
      error.response?.data?.detail || "팝업스토어 생성에 실패했습니다"
    );
  }
};

export const updatePopup = async (id, popupData) => {
  const response = await api.put(`/popups/${id}`, popupData);
  return response.data;
};

export const deletePopup = async (id) => {
  const response = await api.delete(`/popups/${id}`);
  return response.data;
};

export const updateReview = async (popupId, reviewId, reviewData) => {
  const response = await api.put(
    `/popups/${popupId}/reviews/${reviewId}`,
    reviewData
  );
  return response.data;
};

export const deleteReview = async (popupId, reviewId) => {
  const response = await api.delete(`/popups/${popupId}/reviews/${reviewId}`);
  return response.data;
};

// 관심 등록 관련 API
export const getFavoritePopups = async () => {
  const response = await api.get("/popups/user/favorites");
  return response;
};

export const addToFavorites = async (popupId) => {
  const response = await api.post(`/users/favorites/${popupId}`);
  return response.data;
};

export const removeFromFavorites = async (popupId) => {
  const response = await api.delete(`/users/favorites/${popupId}`);
  return response.data;
};

// 검색 관련 API
export const searchPopups = async (query) => {
  const response = await api.get("/popups/search", {
    params: { q: query },
  });
  return response.data;
};

export const searchByLocation = async (lat, lng, radius) => {
  const response = await api.get("/popups/nearby", {
    params: { lat, lng, radius },
  });
  return response.data;
};

// 제보 관련 API
export const reportPopup = async (reportData) => {
  const response = await api.post("/popups/report-popup", {
    popup_name: reportData.popupName,
    brand_name: reportData.brandName,
    address: reportData.address,
    period: reportData.period,
    description: reportData.description,
  });
  return response.data;
};

// 이미지 업로드 API
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Reviews
export const getPopupReviews = (popupId) =>
  api.get(`/popups/${popupId}/reviews`);

export const createReview = (popupId, reviewData) =>
  api.post(`/popups/${popupId}/reviews`, reviewData);

// Favorites
export const getFavorites = () => api.get(`/popups/favorites`);

export const toggleFavorite = (popupId) =>
  api.post(`/popups/${popupId}/favorite`);

export const checkFavoriteStatus = (popupId) =>
  api.get(`/popups/${popupId}/favorite/status`);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
