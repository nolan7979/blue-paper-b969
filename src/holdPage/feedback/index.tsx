import { use, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import { Spinner } from 'flowbite-react';
import { useSendEmail, useUploadImage } from '@/hooks/useFeedback';
import { TwDataSection } from '@/components/modules/common';
import Seo from '@/components/Seo';
import XCircleIcon from '/public/svg/feedback/x-circle.svg';
import PlusCircleIcon from '/public/svg/feedback/plus-circle.svg';
import WarningCircleIcon from '/public/svg/feedback/warning-circle.svg';
import CustomModal from '@/components/modal/CustomModal';
import { Divider } from '@/components/modules/common/tw-components/TwPlayer';
import { useRouter } from 'next/navigation';
import useTrans from '@/hooks/useTrans';
import { EmailDataPayload } from '@/constant/interface';

type Image = {
  url: string;
  file: File;
};

type ErrorMessage = {
  type: string;
  size: string;
  required: string;
  emailFormat: string;
  min: string;
  max: string;
  requiredMessage: string;
};

const createSchema = (errorMessage: Partial<ErrorMessage>) => {
  return yup.object().shape({
    email: yup
      .string()
      .trim()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorMessage?.emailFormat || 'Invalid email format'
      )
      .required(errorMessage?.required || 'This is a required field'),
    message: yup
      .string()
      .trim()
      .min(10, errorMessage?.min || 'Please enter at least 10 characters')
      .max(1000, errorMessage?.max || 'Please enter at most 1000 characters')
      .required(errorMessage?.requiredMessage || 'Message is required'),
  });
};

const validateFile = (files: FileList, errorMessage: Partial<ErrorMessage>) => {
  // if (files.length > 4) {
  //   return 'You can only upload up to 4 files';
  // }
  const allowedTypes = ['image/jpeg', 'image/png'];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!allowedTypes.includes(file.type)) {
      return errorMessage?.type || 'Only .jpg and .png files are allowed';
    }
    if (file.size > 1024 * 1024 * 10) {
      return errorMessage?.size || 'File size should not exceed 10MB';
    }
  }
  return '';
};

const ContactPage = () => {
  const i18n = useTrans();
  const refFileInput = useRef<HTMLInputElement>(null);
  const feedbackSchema = createSchema({
    emailFormat: i18n.feedback.invalid_email_format || 'Invalid email format',
    required:
      i18n.feedback.this_is_a_required_field || 'This is a required field',
    min:
      i18n.feedback.please_enter_at_least_10_characters ||
      'Please enter at least 10 characters',
    max:
      i18n.feedback.please_enter_at_most_1000_characters ||
      'Please enter at most 1000 characters',
    requiredMessage: i18n.feedback.message_is_required || 'Message is required',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(feedbackSchema), mode: 'onBlur' });

  // const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Image[] | null>(null);
  const [errorImg, setErrorImg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const uploadImage = useUploadImage();
  const sendEmail = useSendEmail();

  const onSelectedFile = () => {
    if (refFileInput) {
      refFileInput.current?.click();
    }
  };

  const onInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { files } = e.target;
      const sliceFiles =
        files?.length > 4 ? Array.from(files).slice(0, 4) : files;
      const error = validateFile(sliceFiles as FileList, {
        type: i18n.feedback.only_jpg_and_png_files_are_allowed,
        size: i18n.feedback.file_size_should_not_exceed_10mb,
      });
      if (error) {
        setErrorImg(error);
        e.target.value = '';
        return;
      } else {
        setErrorImg(null);
        setImages(null);
        for (let i = 0; i < sliceFiles.length; i++) {
          const file = files[i];
          const urlImage = URL.createObjectURL(file);
          setImages((prev) => {
            if (prev) {
              return [...prev, { url: urlImage, file }];
            }
            return [{ url: urlImage, file }];
          });
        }
      }
    }
  };

  const onRemoveImage = (url: string) => {
    setImages((prev) => {
      if (prev) {
        return prev.filter((img) => img.url !== url);
      }
      return null;
    });
  };

  const sendEmailHandler = async (formData: EmailDataPayload) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await sendEmail.mutateAsync(formData);
      if (response?.code === 1) {
        setIsSuccess(true);
        setImages(null);
        reset();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (formData: {
    email: string;
    message: string;
  }) => {
    if (loading) return;
    setLoading(true);
    const defaultSendEmailPayload = {
      email: formData.email.trim(),
      subject: 'Feedback',
      body: formData.message.trim(),
      links: [],
    };
    try {
      if (images?.length) {
        const uploadImagesPayload = {
          images: images.map((img) => img.file),
          email: formData.email,
        };

        const { data, code } = await uploadImage.mutateAsync(
          uploadImagesPayload
        );

        const sendEmailPayload = {
          ...defaultSendEmailPayload,
          links:
            code === 1
              ? data?.valid_images?.map((img: any) => img.path) || []
              : [],
        };

        await sendEmailHandler(sendEmailPayload);
      } else {
        await sendEmailHandler(defaultSendEmailPayload);
      }
    } catch (error) {
      console.error('Error in onSubmitHandler:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title='Feedback' description='Feedback' />
      <TwDataSection className='layout flex flex-col pb-6'>
        <div className='mt-4 flex flex-col justify-center rounded-md p-2.5 py-4 '>
          <div className='flex w-full flex-col justify-center pb-1 text-center'>
            <h1 className='text-3xl dark:text-white'>
              {i18n.feedback.feedback}
            </h1>
          </div>

          <form
            className='mx-auto flex w-full max-w-lg flex-col gap-6 p-4'
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
          >
            <div className='relative flex flex-col gap-1'>
              <label
                htmlFor='email'
                className='text-[13px] font-medium dark:text-dark-text'
              >
                {i18n.feedback.email}
              </label>
              <input
                type='email'
                placeholder={`${
                  i18n.feedback.enter_your_email || 'Enter your email'
                }*`}
                className={clsx(
                  'rounded p-3 text-[13px] focus:border-transparent focus:outline-none focus:ring-0 active:border-transparent active:outline-none active:ring-0 dark:bg-dark-gray dark:text-white',
                  {
                    '!border !border-red-500 outline-none dark:!border-red-500 pr-8':
                      errors.email?.message,
                    'border-none': !errors.email?.message,
                  }
                )}
                {...register('email')}
              />
              {errors.email?.message && (
                <div className='absolute right-3 top-[41px]'>
                  <WarningCircleIcon className='size-4 text-red-500' />
                </div>
              )}
              <p
                className={clsx('text-[11px]', {
                  'text-red-500': errors.email?.message,
                  'text-dark-text': !errors.email?.message,
                })}
              >
                {errors.email?.message ||
                  i18n.feedback.this_is_a_required_field ||
                  'This is a required field'}
              </p>
            </div>
            <div className='relative flex flex-col gap-1'>
              <label
                htmlFor='message'
                className='text-[13px] font-medium dark:text-dark-text'
              >
                {i18n.feedback.feedback}
              </label>
              <textarea
                maxLength={1000}
                placeholder={`${
                  i18n.feedback.describe_your_issue_or_suggestion ||
                  'Describe your issue or suggestion'
                }*`}
                className={clsx(
                  'resize-none rounded p-3 text-[13px] focus:border-transparent focus:outline-none focus:!ring-0 active:border-transparent active:outline-none active:ring-0 dark:bg-dark-gray dark:text-white',
                  {
                    '!border !border-red-500 outline-none focus:!border-red-500 pr-8':
                      errors.message?.message,
                    'border-none': !errors.message?.message,
                  }
                )}
                {...register('message')}
              />
              {errors.message?.message && (
                <div className='absolute right-3 top-[41px]'>
                  <WarningCircleIcon className='size-4 text-red-500' />
                </div>
              )}
              <p
                className={clsx('text-[11px]', {
                  'text-red-500': errors.message?.message,
                  'text-dark-text': !errors.message?.message,
                })}
              >
                {errors.message?.message ||
                  i18n.feedback.please_enter_at_least_10_characters ||
                  'Please enter at least 10 characters'}
              </p>
            </div>
            <div className='relative flex flex-col gap-1'>
              <label htmlFor='message' className='text-sm dark:text-dark-text'>
                {i18n.feedback.images || 'Images'}
              </label>

              <input
                ref={refFileInput}
                type='file'
                name='proof'
                multiple
                accept='.jpg, .png'
                className='hidden rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-gray  dark:text-white'
                onChange={onInputFileChange}
              />
              <div
                className={clsx(
                  'flex flex-col items-start gap-2 rounded-md  bg-white dark:bg-dark-gray',
                  {
                    'border border-red-500': errorImg,
                  }
                )}
              >
                <button
                  type='button'
                  className='flex items-center gap-2 rounded bg-transparent p-3 text-[13px] outline-none dark:text-dark-text'
                  onClick={onSelectedFile}
                >
                  <PlusCircleIcon className='size-4' />
                  {i18n.feedback.upload_a_screenshot || 'Upload a screenshot'}
                </button>
                {!!images?.length && (
                  <div className='flex gap-3 px-3 pb-2'>
                    {images?.map((img, index) => (
                      <div
                        key={img.url}
                        className='relative flex h-fit w-fit items-center gap-2'
                      >
                        <img src={img.url} alt='proof' width={60} />
                        <button
                          onClick={() => onRemoveImage(img.url)}
                          className='absolute right-[-8px] top-[-8px] size-4 cursor-pointer rounded-full'
                        >
                          <XCircleIcon className='size-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errorImg && (
                <div className='absolute right-3 top-10'>
                  <WarningCircleIcon className='size-4 text-red-500' />
                </div>
              )}
              <p
                className={clsx('text-[11px] text-dark-text', {
                  'text-dark-text': !errorImg,
                  'text-red-500': errorImg,
                })}
              >
                {errorImg
                  ? `${errorImg}`
                  : i18n.feedback.this_is_an_optional_field ||
                    'This is an optional field'}
              </p>
            </div>
            <div className='flex justify-center'>
              <button
                formNoValidate
                type='submit'
                disabled={loading}
                className='flex w-full items-center justify-center gap-2 rounded bg-dark-button px-4 py-2 font-semibold uppercase text-white outline-none transition-colors hover:bg-blue-700 disabled:bg-dark-button/70'
              >
                {!loading && i18n.feedback.done}
                {loading && <Spinner size='sm' />}
              </button>
            </div>
          </form>
        </div>
      </TwDataSection>
      <SuccessfulModal isOpen={isSuccess} />
    </>
  );
};

export default ContactPage;

const SuccessfulModal = ({ isOpen }: { isOpen: boolean }) => {
  const i18n = useTrans();
  const { push } = useRouter();
  const onBackToHomeClick = () => {
    push('/');
  };

  return (
    <CustomModal open={isOpen} setOpen={() => null}>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h2 className='text-xl font-semibold dark:text-white'>
          {i18n.feedback.feedback_sent || 'Feedback Sent'}
        </h2>
        <span className='text-center text-sm dark:text-dark-text'>
          {i18n.feedback.thanks_for_sticking_with_us_we_ll_improve ||
            "Thanks for sticking with us, we'll improve!"}
        </span>
        <Divider className=' w-full' />
        <button
          className='text-[13px] font-normal outline-none active:opacity-75 dark:text-white'
          onClick={onBackToHomeClick}
        >
          {i18n.feedback.back_to_home || 'Back to Home'}
        </button>
      </div>
    </CustomModal>
  );
};
