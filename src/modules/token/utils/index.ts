import { CbridgeCurrency } from 'src/c-bridge';
import { endpointKey, providerEndpoints } from 'src/config/chainEndpoints';
import { LOCAL_STORAGE } from 'src/config/localStorage';
import { registeredErc20Tokens, Erc20Token, tokenImageMap } from 'src/modules/token';

export const getTokenImage = ({
  isNativeToken,
  symbol,
  iconUrl,
}: {
  isNativeToken: boolean;
  symbol: string;
  iconUrl?: string;
}): string => {
  if (isNativeToken) {
    return symbol === 'SDN' ? 'icons/sdn-token.png' : 'icons/astar.png';
  } else {
    return iconUrl || 'custom-token';
  }
};

export const getErc20Explorer = ({
  currentNetworkIdx,
  tokenAddress,
}: {
  currentNetworkIdx: endpointKey;
  tokenAddress: string;
}) => {
  const base = providerEndpoints[currentNetworkIdx].blockscout;
  return base + '/token/' + tokenAddress;
};

export const getRegisteredERC20Token = (): Erc20Token[] => {
  const storedTokens = getStoredERC20Tokens().map((it: Erc20Token) => {
    return {
      ...it,
      image: tokenImageMap.hasOwnProperty(it.symbol)
        ? tokenImageMap[it.symbol as keyof typeof tokenImageMap]
        : 'custom-token',
    };
  });
  return registeredErc20Tokens.concat(storedTokens);
};

export const getStoredERC20Tokens = (): Erc20Token[] => {
  const data = localStorage.getItem(LOCAL_STORAGE.EVM_TOKEN_IMPORTS);
  return data ? JSON.parse(data) : [];
};

export const storeImportedERC20Token = (token: Erc20Token) => {
  const tokens = getStoredERC20Tokens();
  tokens.push(token);
  localStorage.setItem(LOCAL_STORAGE.EVM_TOKEN_IMPORTS, JSON.stringify(tokens));
};

export const castCbridgeToErc20 = ({
  token,
  srcChainId,
}: {
  token: CbridgeCurrency;
  srcChainId: number;
}): Erc20Token => {
  return {
    srcChainId,
    address: token.address,
    decimal: token.decimal,
    symbol: token.symbol,
    name: token.name,
    image: token.icon,
    isWrappedToken: false,
    isXC20: false,
    wrapUrl: null,
    userBalance: token.userBalance,
    userBalanceUsd: token.userBalanceUsd,
    isCbridgeToken: true,
  };
};
