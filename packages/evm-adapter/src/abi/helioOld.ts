export const helioOld = {
  contractName: 'Helio',
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'transferAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feeAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'EthPayment',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'transferAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feeAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'Payment',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'transferAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feeAmount',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          indexed: false,
          internalType: 'struct IHelio.RecepientAndAmount[]',
          name: 'splitData',
          type: 'tuple[]',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'SplitEthPayment',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'transferAmount',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'feeAmount',
          type: 'uint256',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          indexed: false,
          internalType: 'struct IHelio.RecepientAndAmount[]',
          name: 'splitData',
          type: 'tuple[]',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'SplitPayment',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint16',
          name: 'fee',
          type: 'uint16',
        },
        {
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'ethPayment',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint16',
          name: 'fee',
          type: 'uint16',
        },
        {
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'payment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint16',
          name: 'fee',
          type: 'uint16',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          internalType: 'struct IHelio.RecepientAndAmount[]',
          name: 'splitData',
          type: 'tuple[]',
        },
        {
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'splitEthPayment',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint16',
          name: 'fee',
          type: 'uint16',
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'recipient',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          internalType: 'struct IHelio.RecepientAndAmount[]',
          name: 'splitData',
          type: 'tuple[]',
        },
        {
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'splitPayment',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
};
