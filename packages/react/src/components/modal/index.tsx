import React, { FC } from 'react';

import { Card } from '../card';

export type InheritedModalProps = {
  onHide: () => void;
};

type ModalProps = {
  title?: string;
  children: React.ReactNode;
};

console.log('Modal');

export const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  onHide,
  children,
}) => (
  <div className="fixed top-0 left-0 z-10 m-auto h-full w-full bg-black bg-opacity-4 backdrop-blur-2">
    <div
      className="relative m-auto flex h-full w-full items-center justify-center"
      data-aos="fade-up"
    >
      <Card className="relative w-12 p-6">
        <div
          className="absolute top-4 right-4"
          onClick={() => {
            onHide();
          }}
        >
          x
        </div>
        <h3 className="font-poppins text-black">{title}</h3>
        <div className="pt-2">{children}</div>
      </Card>
    </div>
  </div>
);

export default Modal;
