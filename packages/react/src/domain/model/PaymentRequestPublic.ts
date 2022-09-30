export type PaymentRequestPublic = {
    id: string,
    description?: string,
    disabled: boolean,
    notifySenderByEmail: boolean,
    notifyReceiverByEmail: boolean,
    addDiscordRole: boolean,
    features: {
        canChangeQuantity: boolean,
        canChangePrice: boolean,
        requireCountry: boolean,
        requireEmail: boolean,
        requireDeliveryAddress: boolean,
        requireDiscordUsername: boolean,
        requireFullName: boolean,
        requirePhoneNumber: boolean,
        requireTwitterUsername: boolean,
        requireProductDetails: boolean,
        requireMaxTransactions: boolean,
        requireNftGate: boolean
    },
    normalizedPrice: string,
    name: string,
    nftCollectionAddress: string,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        email?: string,
        name?: string,
        discordUsername?: string,
        twitterUsername?: string,
        roles: {
            id: string,
            company?: string,
            user?: string
        }[],
        wallets: {
            id: string,
            blockchain?: string
        }[]
    },
    company?: {
        id: string,
        name?: string,
        email?: string,
        websiteUrl?: string,
        discordUsername?: string,
        twitterUsername?: string,
        logoUrl?: string
    },
    currency: {
        id: string,
        name: string,
        decimals: number,
        order: number,
        mintAddress: string,
        coinMarketCapId?: number,
        symbol: string,
        symbolPrefix?: string,
        blockchain: {
            id: string,
        }
    },
    wallet: {
        id: string,
        publicKey: string,
        blockchain: {
            id: string,
        }
    }
    product?: any,
    message?: string
}