import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import {
  EmailDataPayload,
  UploadImageResponse,
  UpLoadPayload,
} from '@/constant/interface';

const uploadImage = async ({
  images,
  email,
}: UpLoadPayload): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('user_id', email);
  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i]);
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ADMIN_URL}/feedback/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response as unknown as UploadImageResponse;
  } catch (e) {
    return { code: -1, data: { valid_images: [] } };
  }
};

const useUploadImage = () => {
  return useMutation<UploadImageResponse, unknown, UpLoadPayload>(
    (payload: UpLoadPayload) => uploadImage(payload)
  );
};

const sendEmail = async (payload: EmailDataPayload) => {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ADMIN_URL}/mail/send-mail`,
      payload
    );
    return data;
  } catch (e) {
    return { code: -1, message: 'Send email failed' };
  }
};

const useSendEmail = () => {
  return useMutation<{ code: number }, unknown, EmailDataPayload>(
    (payload: EmailDataPayload) => sendEmail(payload)
  );
};

export { useUploadImage, useSendEmail };
