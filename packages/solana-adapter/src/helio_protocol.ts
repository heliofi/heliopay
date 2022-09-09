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
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'feeAccount',
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
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'feeAccount',
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
      args: [],
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
          name: 'feeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'recipient',
          isMut: true,
          isSigner: true,
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
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'feeAccount',
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
      args: [],
    },
    {
      name: 'withdrawSol',
      accounts: [
        {
          name: 'recipient',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'solPaymentAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'feeAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
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
          name: 'feeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'feeAccount',
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
          name: 'payFees',
          type: 'bool',
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
          name: 'feeAccount',
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
          name: 'payFees',
          type: 'bool',
        },
        {
          name: 'remainingAmounts',
          type: {
            vec: 'u64',
          },
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
    address: 'C36Zn8LWyGkkd8BgfzBJ3DxkEjk45xRr91ZVzWCjHgFv',
  },
};
