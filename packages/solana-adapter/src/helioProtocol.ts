export default {
  version: '1.0.1',
  name: 'helio_protocol',
  docs: [
    'Program for processing stream and one time payments in SOL or SPL token.',
  ],
  instructions: [
    {
      name: 'createPayment',
      docs: ['Entry point for function for creating the stream payment.'],
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
      docs: [
        'Entry point for function for creating the stream payment in SOL.',
      ],
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
      docs: ['Entry point for cancelling(terminating) the stream payment.'],
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
          name: 'mint',
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
      docs: ['Entry point for cancelling(terminating) the stream payment.'],
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
      docs: ['Entry point for witdhraw due SPL tokens for recipient.'],
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
          name: 'mint',
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
      docs: ['Entry point for witdhraw due SOL for recipient.'],
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
      docs: ['Entry point for one time payment in SPL tokens.'],
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
      docs: ['Entry point for one time payment in SOL.'],
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
      docs: ['Entry point for topup in SPL tokens.'],
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
          name: 'mint',
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
      docs: ['Entry point for topup in SPL tokens.'],
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
      docs: ['Account holding metadata for payment stream.'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            docs: ['The raw amount to transfer'],
            type: 'u64',
          },
          {
            name: 'withdrawal',
            docs: ['The recipents withrawed amount'],
            type: 'u64',
          },
          {
            name: 'startAt',
            docs: ['The unix timestamp to start the payment at'],
            type: 'u64',
          },
          {
            name: 'endAt',
            docs: [
              'The unix timestamp to end the payment at. If recurrence_interval is zero, then start_at must equal end_at',
            ],
            type: 'u64',
          },
          {
            name: 'interval',
            docs: ['Duration of charged interval in seconds'],
            type: 'u64',
          },
          {
            name: 'senderKey',
            docs: ['The sender party of the payment'],
            type: 'publicKey',
          },
          {
            name: 'senderTokens',
            docs: ["The sender's token account address"],
            type: 'publicKey',
          },
          {
            name: 'recipientKey',
            docs: ['The recipient party of the payment'],
            type: 'publicKey',
          },
          {
            name: 'recipientTokens',
            docs: ["The recipient's token account address"],
            type: 'publicKey',
          },
          {
            name: 'mint',
            docs: ['The mint (currency) token of the payment'],
            type: 'publicKey',
          },
          {
            name: 'bump',
            docs: ['PDA bump (0-255, sent from client on stream creation)'],
            type: 'u8',
          },
          {
            name: 'payFees',
            docs: ['Pay fees flag'],
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'SolPaymentAccount',
      docs: ['Account holding metadata for sol payment stream.'],
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'amount',
            docs: ['The total amount to transfer'],
            type: 'u64',
          },
          {
            name: 'withdrawal',
            docs: ['The recipents withrawed amount'],
            type: 'u64',
          },
          {
            name: 'startAt',
            docs: ['The unix timestamp to start the payment at'],
            type: 'u64',
          },
          {
            name: 'endAt',
            docs: [
              'The unix timestamp to end the payment at. If recurrence_interval is zero, then start_at must equal end_at',
            ],
            type: 'u64',
          },
          {
            name: 'interval',
            docs: ['Duration of charged interval in seconds'],
            type: 'u64',
          },
          {
            name: 'senderKey',
            docs: ['The sender party of the payment'],
            type: 'publicKey',
          },
          {
            name: 'recipientKey',
            docs: ['The recipient party of the payment'],
            type: 'publicKey',
          },
          {
            name: 'payFees',
            docs: ['Pay fees flag'],
            type: 'bool',
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
  errors: [
    {
      code: 6000,
      name: 'InsufficientBalance',
      msg: 'Insufficient SOL to pay transfer fees.',
    },
    {
      code: 6001,
      name: 'InvalidChronology',
      msg: 'The timestamps must be chronological.',
    },
    {
      code: 6002,
      name: 'InvalidAmount',
      msg: 'The amount must be positive number.',
    },
    {
      code: 6003,
      name: 'InvalidPeriod',
      msg: 'The charging period must be shorter then duration time, longer then 10secs.',
    },
    {
      code: 6004,
      name: 'EmptyAccount',
      msg: 'The account is empty, nothing to withdraw.',
    },
    {
      code: 6005,
      name: 'CancelAuthority',
      msg: 'The signer trying to cancel running stream is not a sender!',
    },
    {
      code: 6006,
      name: 'InvalidNumber',
      msg: 'The number is invalid!',
    },
    {
      code: 6007,
      name: 'InvalidTokenAccount',
      msg: 'The token account not provided or has wrong owner.',
    },
    {
      code: 6008,
      name: 'InvalidSplitPaymentData',
      msg: 'Remainings amounts and accounts not matching.',
    },
    {
      code: 6009,
      name: 'InvalidPaymentTokenAccount',
      msg: 'Invalid payment token account.',
    },
    {
      code: 6010,
      name: 'InvalidPDASigner',
      msg: 'Invalid PDA signer address.',
    },
    {
      code: 6011,
      name: 'InvalidFeeAccount',
      msg: 'Invalid fee account address.',
    },
    {
      code: 6012,
      name: 'StreamExpired',
      msg: 'Stream already expired no changes allowed.',
    },
    {
      code: 6013,
      name: 'InvalidTopupAmount',
      msg: 'Invalid topup amount (less then base interval amount).',
    },
    {
      code: 6014,
      name: 'InvalidFee',
      msg: 'Invalid fee, 100 percent or larger.',
    },
    {
      code: 6015,
      name: 'UnauthorizedSigner',
      msg: 'Signer not authorized to perform operation.',
    },
    {
      code: 6016,
      name: 'General',
      msg: 'General error',
    },
  ],
  metadata: {
    address: 'ENicYBBNZQ91toN7ggmTxnDGZW14uv9UkumN7XBGeYJ4',
  },
};
