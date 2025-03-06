export const isProd = process.env.NEXT_PUBLIC_NODE_ENVIROMENT === 'production';
export const isLocal =
  process.env.NEXT_PUBLIC_NODE_ENVIROMENT === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;
