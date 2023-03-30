export default {
  version: '0.1.0',
  name: 'solana_nft',
  instructions: [
    {
      name: 'escrowNft',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'ownerNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowAccount',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'escrowNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowPda',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'currency',
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
          name: 'unitPrice',
          type: 'u64',
        },
        {
          name: 'bump',
          type: 'u8',
        },
      ],
    },
    {
      name: 'cancelEscrow',
      accounts: [
        {
          name: 'owner',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'ownerNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowPda',
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
      args: [],
    },
    {
      name: 'singlePaymentEscrow',
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
          name: 'senderNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'recipientTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowNftAccount',
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
          name: 'escrowPda',
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
          name: 'currency',
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
      args: [],
    },
    {
      name: 'singleSolPaymentEscrow',
      accounts: [
        {
          name: 'sender',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'senderNftAccount',
          isMut: true,
          isSigner: false,
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
          name: 'escrowNftAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'escrowPda',
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
      args: [],
    },
  ],
  accounts: [
    {
      name: 'EscrowAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'ownerKey',
            type: 'publicKey',
          },
          {
            name: 'mint',
            type: 'publicKey',
          },
          {
            name: 'currency',
            type: 'publicKey',
          },
          {
            name: 'amount',
            type: 'u64',
          },
          {
            name: 'amountSold',
            type: 'u64',
          },
          {
            name: 'unitPrice',
            type: 'u64',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
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
      name: 'InvalidAmount',
      msg: 'The amount must be positive number.',
    },
    {
      code: 6002,
      name: 'InvalidFee',
      msg: 'Invalid fee, less then minimum or larger then 100 percent.',
    },
    {
      code: 6003,
      name: 'InvalidTokenAccount',
      msg: 'Invalid token account.',
    },
    {
      code: 6004,
      name: 'InvalidPdaAccount',
      msg: 'Invalid PDA account.',
    },
    {
      code: 6005,
      name: 'InvalidFeeAccount',
      msg: 'Invalid fee account address.',
    },
  ],
  metadata: {
    address: '5enpPK1sBhBSWwEjmKjVuBkDoMo5nKd6Su7WjFLtza3a',
  },
};
