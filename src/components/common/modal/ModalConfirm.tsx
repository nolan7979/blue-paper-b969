import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

function ModalConfirm({
  isOpen,
  setIsOpen,
  confirm,
}: {
  isOpen: boolean;
  setIsOpen: any;
  confirm: any;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-30'
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto scrollbar'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Xoá tất cả các trận đấu đã diễn ra
                </Dialog.Title>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    Bạn có chắc chắn muốn xoá tất cả các trận đấu đã diễn ra
                    khỏi danh sách yêu thích của bạn không ?
                  </p>
                </div>

                <div className='mt-4 flex justify-end gap-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-solid bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900'
                    onClick={() => setIsOpen(false)}
                  >
                    Huỷ
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border  !bg-red-600 px-4 py-2 text-sm font-medium text-white'
                    onClick={() => confirm()}
                  >
                    Đồng ý
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ModalConfirm;
