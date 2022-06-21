import React, { FC } from 'react';

import 'aos/dist/aos.css';

import { Card } from '../card';

export type InheritedModalProps = {
  onHide?: () => void;
};

type ModalProps = {
  title?: string;
  children: React.ReactNode;
};

export const Modal: FC<ModalProps & InheritedModalProps> = ({
  title,
  onHide,
  children,
}) => (
  <div className="fixed top-0 left-0 z-10 m-auto h-full w-full bg-black bg-opacity-[0.4] backdrop-blur-[3px]">
    <div
      className="relative m-auto flex h-full w-full items-center justify-center"
      data-aos="fade-up"
    >
      <Card className="relative w-[432px] p-6">
        <div
          className="absolute top-[25px] right-[24px]"
          onClick={() => {
            onHide?.();
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
