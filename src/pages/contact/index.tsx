import { TwDataSection } from '@/components/modules/common';
import { Spinner } from 'flowbite-react';
import { useToast } from '@/components/toast/ToastProvider';
import { useState } from 'react';
import Seo from '@/components/Seo';

const ContactPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = () => {
    if (!email || !subject) {
      toast.showToast('Please fill in all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.showToast('Message sent successfully');
      setLoading(false);
      setEmail('');
      setSubject('');
      setMessage('');
    }, 2000);
  };
  return (
    <>
      <Seo title='Contact Us' description='Contact Us' />
      <TwDataSection className='layout flex flex-col pb-6'>
        <div className='mt-4 flex flex-col justify-center rounded-md p-2.5 py-8 dark:bg-dark-gray'>
          <div className='flex w-full flex-col justify-center pb-8 text-center'>
            <h1 className='text-3xl dark:text-white'>Contact Us</h1>
          </div>
          <form className='mx-auto flex w-full max-w-lg flex-col gap-4 p-4'>
            <label htmlFor='Email' className='text-sm dark:text-white'>
              Email address
            </label>
            <input
              type='email'
              name='email'
              placeholder='Your Email'
              required
              className='rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-main dark:text-white'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='subject' className='text-sm dark:text-white'>
              Subject
            </label>
            <input
              type='text'
              name='subject'
              placeholder='Subject'
              required
              className='rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-main dark:text-white'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <label htmlFor='message' className='text-sm dark:text-white'>
              Message
            </label>
            <textarea
              name='message'
              placeholder='Message'
              value={message}
              rows={5}
              onChange={(e) => setMessage(e.target.value)}
              className='rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-dark-main dark:text-white'
            ></textarea>
            <div className='flex justify-center'>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className='flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
              >
                {loading ? 'Sending...' : 'Send Message'}
                {loading && <Spinner />}
              </button>
            </div>
          </form>
        </div>
      </TwDataSection>
    </>
  );
};

export default ContactPage;
