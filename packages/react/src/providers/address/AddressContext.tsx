import { Cluster } from '@solana/web3.js';
import { createContext, useContext } from 'react';
import {
  AddressList,
  AddressDetails,
  Country,
} from '../../domain/model/Address';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';
import { useHelioProvider } from '../helio/HelioContext';

export const AddressContext = createContext<{
  addressList?: AddressList;
  setAddressList: (addressList: AddressList) => void;
  country?: Country;
  setCountry: (country: Country) => void;
  addressDetails?: AddressDetails;
  setAddressDetails: (address: AddressDetails) => void;
}>({
  addressList: [
    {
      id: 'postal_code=35100|town=Bornova|street=152. Sokak',
      count: 54,
      labels: ['35100', '152. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=153. Sokak',
      count: 120,
      labels: ['35100', '153. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=159. Sokak',
      count: 82,
      labels: ['35100', '159. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=160. Sokak',
      count: 56,
      labels: ['35100', '160. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=161. Sokak',
      count: 102,
      labels: ['35100', '161. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=162. Sokak',
      count: 108,
      labels: ['35100', '162. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=166. Sokak',
      count: 52,
      labels: ['35100', '166. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=169. Sokak',
      count: 59,
      labels: ['35100', '169. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=170. Sokak',
      count: 56,
      labels: ['35100', '170. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=183. Sokak',
      count: 70,
      labels: ['35100', '183. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=184. Sokak',
      count: 129,
      labels: ['35100', '184. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=185. Sokak',
      count: 113,
      labels: ['35100', '185. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=186. Sokak',
      count: 94,
      labels: ['35100', '186. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=194. Sokak',
      count: 124,
      labels: ['35100', '194. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=197. Sokak',
      count: 49,
      labels: ['35100', '197. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=200. Sokak',
      count: 54,
      labels: ['35100', '200. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=206. Sokak',
      count: 44,
      labels: ['35100', '206. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=213. Sokak',
      count: 86,
      labels: ['35100', '213. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=220. Sokak',
      count: 77,
      labels: ['35100', '220. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=225. Sokak',
      count: 47,
      labels: ['35100', '225. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=229/2. Sokak',
      count: 63,
      labels: ['35100', '229/2. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=296. Sokak',
      count: 68,
      labels: ['35100', '296. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=296/2 Sokak',
      count: 51,
      labels: ['35100', '296/2 Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=301. Sokak',
      count: 54,
      labels: ['35100', '301. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=302. Sokak',
      count: 142,
      labels: ['35100', '302. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=303. Sokak',
      count: 96,
      labels: ['35100', '303. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=342/1. Sokak',
      count: 84,
      labels: ['35100', '342/1. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=346. Sokak',
      count: 64,
      labels: ['35100', '346. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=351. Sokak',
      count: 93,
      labels: ['35100', '351. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=352. Sokak',
      count: 85,
      labels: ['35100', '352. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=357. Sokak',
      count: 88,
      labels: ['35100', '357. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=364/1. Sokak',
      count: 91,
      labels: ['35100', '364/1. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=364/3. Sokak',
      count: 57,
      labels: ['35100', '364/3. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=367. Sokak',
      count: 57,
      labels: ['35100', '367. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=372. Sokak',
      count: 84,
      labels: ['35100', '372. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=372/6. Sokak',
      count: 51,
      labels: ['35100', '372/6. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=372/8. Sokak',
      count: 56,
      labels: ['35100', '372/8. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=372/10. Sokak',
      count: 115,
      labels: ['35100', '372/10. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=402. Sokak',
      count: 50,
      labels: ['35100', '402. Sokak, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Ankara Caddesi',
      count: 202,
      labels: ['35100', 'Ankara Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Fatih Sultan Mehmet Caddesi',
      count: 84,
      labels: ['35100', 'Fatih Sultan Mehmet Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Fevzi Çakmak Caddesi',
      count: 72,
      labels: ['35100', 'Fevzi Çakmak Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Gediz Caddesi',
      count: 154,
      labels: ['35100', 'Gediz Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Kurtuluş Caddesi',
      count: 83,
      labels: ['35100', 'Kurtuluş Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Mustafa Kemal Caddesi',
      count: 351,
      labels: ['35100', 'Mustafa Kemal Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Sanayi Caddesi',
      count: 199,
      labels: ['35100', 'Sanayi Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Süvari Caddesi',
      count: 225,
      labels: ['35100', 'Süvari Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Yüzbaşı İbrahim Hakkı Caddesi',
      count: 83,
      labels: ['35100', 'Yüzbaşı İbrahim Hakkı Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Zafer Caddesi',
      count: 137,
      labels: ['35100', 'Zafer Caddesi, Bornova'],
    },
    {
      id: 'postal_code=35100|town=Bornova|street=Üniversite Caddesi',
      count: 264,
      labels: ['35100', 'Üniversite Caddesi, Bornova'],
    },
    {
      id: 'address_id=k_LFmIABeIMMPJNCnNzP',
      count: 1,
      labels: ['35100', '150. Sokak 13A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=Z_HFmIABeIMMPJNCi7nF',
      count: 1,
      labels: ['35100', '154. Sokak 3D, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=r_LFmIABeIMMPJNCkzFg',
      count: 1,
      labels: ['35100', '154. Sokak 5/2, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=0_HFmIABeIMMPJNCiH5C',
      count: 1,
      labels: ['35100', '156. Sokak 5A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=c_LFmIABeIMMPJNCnvha',
      count: 1,
      labels: ['35100', '165. Sokak 2A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=JQvHmIABeIMMPJNC6Avh',
      count: 1,
      labels: ['35100', '167. Sokak 10AA, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=hPHFmIABeIMMPJNCh27N',
      count: 1,
      labels: ['35100', '173. Sokak 4/3, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=NOzFmIABeIMMPJNCHu5o',
      count: 1,
      labels: ['35100', '175. Sokak 1C, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=me3FmIABeIMMPJNCHwez',
      count: 1,
      labels: ['35100', '175. Sokak 10A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=eiXJmIABeIMMPJNCk14c',
      count: 1,
      labels: ['35100', '175. Sokak 13A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=GvLFmIABeIMMPJNClmc6',
      count: 1,
      labels: ['35100', '175. Sokak 17B, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=VyfJmIABeIMMPJNCoXO-',
      count: 1,
      labels: ['35100', '180/3. Sokak 2B, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=mvLFmIABeIMMPJNCnNrP',
      count: 1,
      labels: ['35100', '186/1. Sokak 3E, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=hvHFmIABeIMMPJNChVkY',
      count: 1,
      labels: ['35100', '187. Sokak 15A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=NCbJmIABeIMMPJNCnvRh',
      count: 1,
      labels: ['35100', '192. Sokak 12/1, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=qQzHmIABeIMMPJNC9R46',
      count: 1,
      labels: ['35100', '199. Sokak 2C, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=UwrHmIABeIMMPJNC3kXH',
      count: 1,
      labels: ['35100', '201. Sokak 6B, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=giXJmIABeIMMPJNClH4W',
      count: 1,
      labels: ['35100', '206/1. Sokak 2, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=1CXJmIABeIMMPJNCkRkU',
      count: 1,
      labels: ['35100', '209. Sokak 1B, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=iQTHmIABeIMMPJNCPQWN',
      count: 1,
      labels: ['35100', '216. Sokak 2A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=piXJmIABeIMMPJNClH4W',
      count: 1,
      labels: ['35100', '216. Sokak 4, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=pyXJmIABeIMMPJNClH4W',
      count: 1,
      labels: ['35100', '216. Sokak 6, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=qSXJmIABeIMMPJNClH4W',
      count: 1,
      labels: ['35100', '216. Sokak 10, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=oyXJmIABeIMMPJNClH4W',
      count: 1,
      labels: ['35100', '216. Sokak 17, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=EiXJmIABeIMMPJNClIRO',
      count: 1,
      labels: ['35100', '219/1. Sokak 59, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=QPHFmIABeIMMPJNCfhlj',
      count: 1,
      labels: ['35100', '232. Sokak 16C, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=2fLFmIABeIMMPJNClnKp',
      count: 1,
      labels: ['35100', '234/1. Sokak 2A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=WPHFmIABeIMMPJNChVAY',
      count: 1,
      labels: ['35100', '259. Sokak 3-5, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=gQvHmIABeIMMPJNC8del',
      count: 1,
      labels: ['35100', '282/2. Sokak 13B, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=WQzHmIABeIMMPJNC-4gG',
      count: 1,
      labels: ['35100', '296/3. Sokak 21A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=ivHFmIABeIMMPJNCj_1S',
      count: 1,
      labels: ['35100', '340. Sokak 3E, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=y_HFmIABeIMMPJNCewjf',
      count: 1,
      labels: ['35100', '364/6. Sokak 1/6, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=BibJmIABeIMMPJNCm477',
      count: 1,
      labels: ['35100', '364/7. Sokak 9, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=QQvHmIABeIMMPJNC60t6',
      count: 1,
      labels: ['35100', '364/11. Sokak 1/3S, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=AAnHmIABeIMMPJNC2_KM',
      count: 1,
      labels: ['35100', '364/11. Sokak 1/3U, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=LijJmIABeIMMPJNCrb-X',
      count: 1,
      labels: ['35100', '366. Sokak 1/1, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=PQXHmIABeIMMPJNCfuek',
      count: 1,
      labels: ['35100', '372/1. Sokak 3/1, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=B_LFmIABeIMMPJNClnWp',
      count: 1,
      labels: ['35100', '372/23. Sokak 10/1, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=n_PFmIABeIMMPJNCnxGx',
      count: 1,
      labels: ['35100', '372/24. Sokak 4A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=DSXJmIABeIMMPJNCk2Yc',
      count: 1,
      labels: ['35100', '375. Sokak 1A, Kazımdirik, Bornova, İzmir'],
    },
    {
      id: 'address_id=UPLFmIABeIMMPJNCkRAn',
      count: 1,
      labels: [
        '35100',
        'Ord. Prof. Dr. Muhiddin Erel Caddesi 48/1, Kazımdirik, Bornova, İzmir',
      ],
    },
  ],
  setAddressList: () => {},
  country: undefined,
  setCountry: () => {},
  addressDetails: undefined,
  setAddressDetails: () => {},
});

export const useAddressProvider = () => {
  const {
    addressList,
    setAddressList,
    country,
    addressDetails,
    setAddressDetails,
    setCountry,
  } = useContext(AddressContext);
  const { cluster } = useHelioProvider();

  const findAddress = async (query: string, country_code: string) => {
    const result = await HelioApiAdapter.findAddress(
      query,
      country_code,
      cluster as Cluster
    );
    setAddressList(result?.results ?? []);
  };

  const getCountry = async () => {
    const result = await HelioApiAdapter.getCountry(cluster as Cluster);
    setCountry(result ?? {});
  };

  const retrieveAddress = async (address_id: string, country_code: string) => {
    if (address_id.startsWith('postal_code_partial=')) {
      const result = {} as any;
      const splitArray = address_id.split('|');
      // eslint-disable-next-line no-restricted-syntax
      for (const item of splitArray) {
        const [key, value] = item.split('=');
        switch (key) {
          case 'town':
            result.town = value;
            break;
          case 'street':
            result.street = value;
            break;
          default:
            break;
        }
      }
      setAddressDetails(result);
    } else {
      const { result } = await HelioApiAdapter.retrieveAddress(
        address_id,
        country_code,
        cluster as Cluster
      );
      setAddressDetails({
        city: result.province_name,
        street: [
          result?.street_prefix,
          result?.street_name,
          result?.street_suffix,
        ].join(' '),
        streetNumber: result?.building_number,
        addressLineOne: result?.line_2,
      });
    }
  };

  return {
    addressList,
    country,
    findAddress,
    getCountry,
    addressDetails,
    retrieveAddress,
  };
};
