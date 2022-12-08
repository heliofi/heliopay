export default {
  version: '0.0.0',
  name: 'helio_protocol',
  instructions: [
    {
      name: 'createPayment',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'senderTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentAccount',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'paymentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipientTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'startAt',
          type: 'u64',
        },
        {
          name: 'endAt',
          type: 'u64',
        },
        {
          name: 'interval',
          type: 'u64',
        },
        {
          name: 'bump',
          type: 'u8',
        },
        {
          name: 'payFees',
          type: 'bool',
        },
      ],
    },
    {
      name: 'createSolPayment',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'solPaymentAccount',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'startAt',
          type: 'u64',
        },
        {
          name: 'endAt',
          type: 'u64',
        },
        {
          name: 'interval',
          type: 'u64',
        },
        {
          name: 'payFees',
          type: 'bool',
        },
      ],
    },
    {
      name: 'cancelPayment',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'senderTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipientTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pdaSigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseFee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'cancelSolPayment',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'sender',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solPaymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseFee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'recipient',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipientTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'pdaSigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseFee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'withdrawSol',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'recipient',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solPaymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'baseFee',
          type: 'u64',
        },
      ],
    },
    {
      name: 'singlePayment',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'senderTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipientTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'baseFee',
          type: 'u64',
        },
        {
          name: 'remainingAmounts',
          type: {
            vec: 'u64',
          },
        },
      ],
    },
    {
      name: 'singleSolPayment',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'recipient',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'helioFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoFeeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'baseFee',
          type: 'u64',
        },
        {
          name: 'remainingAmounts',
          type: {
            vec: 'u64',
          },
        },
      ],
    },
    {
      name: 'topup',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'senderTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'paymentTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'pdaSigner',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'topupAmount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'topupSol',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'solPaymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'topupAmount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'PaymentAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'withdrawal',
            type: 'u64',
          },
          {
            name: 'startAt',
            type: 'u64',
          },
          {
            name: 'endAt',
            type: 'u64',
          },
          {
            name: 'interval',
            type: 'u64',
          },
          {
            name: 'senderKey',
            type: 'publicKey',
          },
          {
            name: 'senderTokens',
            type: 'publicKey',
          },
          {
            name: 'recipientKey',
            type: 'publicKey',
          },
          {
            name: 'recipientTokens',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'payFees',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'SolPaymentAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'withdrawal',
            type: 'u64',
          },
          {
            name: 'startAt',
            type: 'u64',
          },
          {
            name: 'endAt',
            type: 'u64',
          },
          {
            name: 'interval',
            type: 'u64',
          },
          {
            name: 'senderKey',
            type: 'publicKey',
          },
          {
            name: 'recipientKey',
            type: 'publicKey',
          },
          {
            name: 'payFees',
            type: 'bool',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'HelioError',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'InsufficientBalance',
          },
          {
            name: 'InvalidChronology',
          },
          {
            name: 'InvalidAmount',
          },
          {
            name: 'InvalidPeriod',
          },
          {
            name: 'EmptyAccount',
          },
          {
            name: 'CancelAuthority',
          },
          {
            name: 'InvalidNumber',
          },
          {
            name: 'InvalidTokenAccount',
          },
          {
            name: 'InvalidSplitPaymentData',
          },
          {
            name: 'InvalidPaymentTokenAccount',
          },
          {
            name: 'InvalidPDASigner',
          },
          {
            name: 'InvalidFeeAccount',
          },
          {
            name: 'StreamExpired',
          },
          {
            name: 'InvalidTopupAmount',
          },
          {
            name: 'InvalidFee',
          },
          {
            name: 'UnauthorizedSigner',
          },
          {
            name: 'General',
          },
        ],
      },
    },
  ],
  events: [
    {
      name: 'SinglePaymentEvent',
      fields: [
        {
          name: 'transferAmount',
          type: 'u64',
          index: false,
        },
        {
          name: 'fee',
          type: 'u64',
          index: false,
        },
        {
          name: 'sender',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'recipient',
          type: 'publicKey',
          index: false,
        },
        {
          name: 'label',
          type: 'string',
          index: true,
        },
      ],
    },
  ],
  metadata: {
    address: 'ENicYBBNZQ91toN7ggmTxnDGZW14uv9UkumN7XBGeYJ4',
  },
};
