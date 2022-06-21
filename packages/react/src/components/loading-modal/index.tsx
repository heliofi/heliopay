import React from 'react';
import ReactDOM from 'react-dom';

import { Modal, InheritedModalProps } from '../modal';

const optionalCurrenciesCount = 10;

export const LoadingModal = ({ onHide }: InheritedModalProps) =>
  ReactDOM.createPortal(
    <div>
      <Modal onHide={onHide}>
        <div className="mx-2 mt-12">
          <h1 className="text-3xl text-black">Loading..</h1>
          <p className="text-sm text-black">Approving transaction</p>
          <div className="mt-12 flex flex-row items-center justify-between">
            <a href="https://docs.hel.io" target="_blank" rel="noreferrer">
              <p className="text-horange underline">New to helio?</p>
            </a>
            <div className="flex flex-row items-center gap-x-1">
              <p className="pr-1">We accept</p>
              <div className="flex h-6 w-6 flex-row items-center justify-center rounded-full bg-gray-200 p-1">
                <p className="text-[#9ca3af]">+{optionalCurrenciesCount}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>,
    document.body
  );
