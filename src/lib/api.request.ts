import axios from "axios";
import { axiosInstance } from "./axios-interceptor";
import { PropertyViewingFilter } from "./constants";

export class ApiRequests {
  private BASE_URL: string;

  constructor() {
    this.BASE_URL = String(process.env.NEXT_PUBLIC_API_URL);
  }

  async uploadPropertyVideo(file: File) {
    const url = `${this.BASE_URL}property/upload-video`;
    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await axios.post(url, payload);

      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async uploadPropertyImages(files: File[]) {
    const url = `${this.BASE_URL}property/upload-images`;
    const payload = new FormData();
    files.forEach((file) => {
      payload.append("files[]", file);
    });

    try {
      const response = await axios.post(url, payload);

      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(uploadId: string) {
    const url = `/delete-file/${uploadId}`;
    try {
      const response = await axiosInstance.delete(url);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchStateByName(stateName: string, fields?: string) {
    const params = new URLSearchParams({
      ...(fields && { fields }),
    });
    const url = `/country/states/by-name/${stateName}/?${params.toString()}`;
    try {
      const result = await axiosInstance.get(url);
      if (result.data?.success) {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchPropertyTypes(fields?: string) {
    const params = new URLSearchParams({
      ...(fields && { fields }),
    });
    const url = `/property-type/?${params.toString()}`;
    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async createProperty<T>(payload: T): Promise<any> {
    const url = "/property";
    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async addressAutocompletion(address: string): Promise<any> {
    const url = `/map/address-autocomplete/${address}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async joinWaitlist(email: string): Promise<any> {
    const url = "/waitlist/join";
    try {
      const response = await axiosInstance.post(url, { email });
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async findPropertyById(propertyId: string) {
    const url = `/property/${propertyId}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async findSavedSearchById(sId: string) {
    const url = `/saved-search/${sId}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateProperty<T>(payload: T) {
    const url = "/property";

    try {
      const response = await axiosInstance.patch(url, payload);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchCustomerViewingSummary() {
    const url = "/agent-property-viewing/customer/viewing-list/summary";

    try {
      const response = await axiosInstance.get(url);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchCustomerViewingSchedule(
    pageNumber = 1,
    pageSize = 10,
    filter = PropertyViewingFilter.TODAY
  ) {
    const url = `/agent-property-viewing/customer/viewing-list/`;

    try {
      const response = await axiosInstance.get(url, {
        params: {
          filter,
          pageSize,
          pageNumber,
        },
      });
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async rateViewing(viewingId: string, rating: number, comment?: string) {
    const url = "/agent-property-viewing/rate-viewing";
    const payload = {
      rating,
      ...(comment && { comment }),
      propertyViewingId: viewingId,
    };
    try {
      const response = await axiosInstance.post(url, payload);
      if (response.data?.success) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async trackViewedProperty(propertyId: string) {
    const url = `/property/viewed-properties/${propertyId}`;

    try {
      const result = await axiosInstance.post(url, {});
      if (result.data.success) {
        return result.data;
      }
    } catch (error) {
      throw error;
    }
  }
}
