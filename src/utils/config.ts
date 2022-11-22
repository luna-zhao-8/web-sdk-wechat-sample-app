export const APP_API_HOST = '__APP_API_HOST';
export const APP_CLIENT_ID = '__APP_CLIENT_ID';
export const APP_CLIENT_SECRET = '__APP_CLIENT_SECRET';
export const APP_SOCKET_URL = '__APP_SOCKET_URL';
export const APP_SOCKET_JWT_SECRET = '__APP_SOCKET_JWT_SECRET';
export const APP_SMILE_CLUB_WX_ID = '__APP_SMILE_CLUB_WX_ID';

export const CP_CHINA_API_HOST = '__CP_CHINA_API_HOST';
export const CP_CHINA_APP_ID = '__CP_CHINA_APP_ID';
export const CP_CHINA_APP_SECRET = '__CP_CHINA_APP_SECRET';


export const requestConfig = {
  baseUrl: APP_API_HOST,
  clientId: APP_CLIENT_ID,
  clientSecret: APP_CLIENT_SECRET,
};

export const cpChinaApiServerConfig = {
  baseUrl: CP_CHINA_API_HOST,
  appId: CP_CHINA_APP_ID,
  appSecret: CP_CHINA_APP_SECRET,
};

export const socketConfig = {
  url: APP_SOCKET_URL,
  secret: APP_SOCKET_JWT_SECRET,
};

export const SMILE_MINIPROGRAM = {
  appId: APP_SMILE_CLUB_WX_ID,
  path: 'pages/shopping/product/product',
};