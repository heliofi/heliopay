export const helio = {
  contractName: 'Helio',
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint8',
          name: 'version',
          type: 'uint8',
        },
      ],
      name: 'Initialized',
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
          internalType: 'struct IHelio.RecipientAndAmount[]',
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
      name: 'Payment',
      type: 'event',
    },
    {
      inputs: [],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'tokenAddress',
          type: 'address',
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
          internalType: 'struct IHelio.RecipientAndAmount[]',
          name: 'splitData',
          type: 'tuple[]',
        },
        {
          internalType: 'string',
          name: 'transactionDbId',
          type: 'string',
        },
      ],
      name: 'payment',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ],
};
