import config from './index';

const { NODE_ENV } = config;

const isDevelopment = NODE_ENV === 'development';

const isTesting = NODE_ENV === 'testing';

const isStaging = NODE_ENV === 'staging';

const isProduction = NODE_ENV === 'production';

const isDeployed = isStaging || isProduction;

export { isDevelopment, isTesting, isStaging, isProduction, isDeployed };
