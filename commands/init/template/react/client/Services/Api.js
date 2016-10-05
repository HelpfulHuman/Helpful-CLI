import { createPortal } from 'portals';

const Api = createPortal({
  globals: {
    hostname: process.env.API_HOST
  }
});

export default Api;