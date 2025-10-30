import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// ==================== Axios Instance ====================
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure we always throw errors for bad status codes
  validateStatus: (status) => status >= 200 && status < 300,
});

// ==================== Request Interceptor ====================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request untuk debugging
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.params ? { params: config.params } : ""
      );
    }

    return config;
  },
  (error: AxiosError) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(error);
  }
);

// ==================== Response Interceptor ====================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response untuk debugging
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.status,
        response.data
      );
    }

    return response;
  },
  async (error: AxiosError) => {
    // Handle error global
    if (error.response) {
      const { status, data } = error.response;

      // Custom error messages
      const errorMessages: Record<number, string> = {
        401: "Sesi Anda telah berakhir. Silakan login kembali.",
        403: "Anda tidak memiliki akses untuk resource ini.",
        404: "Resource tidak ditemukan.",
        500: "Terjadi kesalahan di server. Silakan coba lagi.",
        503: "Service sedang dalam maintenance.",
      };

      const message = errorMessages[status] || "Terjadi kesalahan. Silakan coba lagi.";

      if (process.env.NODE_ENV === "development") {
        console.error(`[API Error ${status}]`, {
          url: error.config?.url,
          method: error.config?.method,
          message,
          data,
        });
      }

      // Handle 401 - redirect to login
      if (status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }

      // Attach user-friendly message to error
      error.message = message;
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      error.message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      
      if (process.env.NODE_ENV === "development") {
        console.error("[API Error] No response received", {
          url: error.config?.url,
          message: error.message,
        });
      }
    } else {
      // Error saat setup request
      error.message = "Terjadi kesalahan. Silakan coba lagi.";
      
      if (process.env.NODE_ENV === "development") {
        console.error("[API Error]", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
